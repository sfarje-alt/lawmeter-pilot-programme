import * as React from "react";
import { createRoot, type Root } from "react-dom/client";
import html2canvas from "html2canvas";
import { LegalTeamAnalyticsDashboard } from "@/components/analytics/LegalTeamAnalyticsDashboard";

/**
 * Renders the live LegalTeamAnalyticsDashboard offscreen, captures it as
 * high-resolution PNG snapshots and returns them sliced into A4-portrait
 * page-sized chunks (width-first, then height-paginated).
 *
 * Returned strings are PNG data URLs ready to embed in a @react-pdf/renderer
 * <Image /> element.
 *
 * The component is rendered into a hidden, fully-painted container so
 * recharts / SVG content can lay out correctly. We rely on the same DOM and
 * theme tokens used by the live LawMeter app, so the resulting visuals match
 * the platform pixel-for-pixel.
 */
export async function captureAnalyticsSnapshots(): Promise<string[]> {
  // 1) Mount offscreen container with the *live* analytics dashboard.
  const host = document.createElement("div");
  host.setAttribute("data-snapshot-host", "analytics");
  // Keep it interactive-friendly (no `display:none`, which breaks layout
  // measurement and recharts), but visually invisible & non-blocking.
  Object.assign(host.style, {
    position: "fixed",
    top: "0",
    left: "-100000px",
    width: "1240px",
    background: "hsl(var(--background))",
    zIndex: "-1",
    pointerEvents: "none",
  });
  document.body.appendChild(host);

  let root: Root | null = null;
  try {
    root = createRoot(host);
    root.render(React.createElement(LegalTeamAnalyticsDashboard));

    // 2) Wait for charts (recharts/SVG) to lay out. Two animation frames
    // plus a settle delay covers ResizeObserver-driven re-renders.
    await new Promise<void>((r) =>
      requestAnimationFrame(() => requestAnimationFrame(() => r())),
    );
    await new Promise((r) => setTimeout(r, 900));

    // 3) Snapshot at 2x for HD output.
    const canvas = await html2canvas(host, {
      backgroundColor: getComputedStyle(document.documentElement)
        .getPropertyValue("--background")
        ? `hsl(${getComputedStyle(document.documentElement).getPropertyValue("--background")})`
        : "#ffffff",
      scale: 2,
      useCORS: true,
      logging: false,
      windowWidth: 1240,
      windowHeight: host.scrollHeight,
    });

    // 4) Slice vertically into A4-portrait page-sized chunks.
    //    A4 ratio 1:√2 ≈ 1240 × 1754 at our capture width.
    const PAGE_W = canvas.width;
    const PAGE_H = Math.round(PAGE_W * Math.SQRT2);
    const slices: string[] = [];

    for (let y = 0; y < canvas.height; y += PAGE_H) {
      const sliceH = Math.min(PAGE_H, canvas.height - y);
      const slice = document.createElement("canvas");
      slice.width = PAGE_W;
      slice.height = sliceH;
      const ctx = slice.getContext("2d");
      if (!ctx) continue;
      ctx.drawImage(canvas, 0, y, PAGE_W, sliceH, 0, 0, PAGE_W, sliceH);
      slices.push(slice.toDataURL("image/png"));
    }

    return slices;
  } finally {
    // 5) Always tear down so we never leak DOM.
    try {
      root?.unmount();
    } catch {
      /* noop */
    }
    host.remove();
  }
}
