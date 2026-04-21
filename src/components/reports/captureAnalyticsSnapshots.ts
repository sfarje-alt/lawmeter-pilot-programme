import * as React from "react";
import { createRoot, type Root } from "react-dom/client";
import html2canvas from "html2canvas";
import { LegalTeamAnalyticsDashboard } from "@/components/analytics/LegalTeamAnalyticsDashboard";

/**
 * Renders the live LegalTeamAnalyticsDashboard offscreen, force-expands every
 * collapsible section, then captures **each section** as its own tight,
 * high-resolution PNG snapshot. Sections that are taller than an A4 page are
 * sliced into multiple page-sized chunks. The output skips empty / blank
 * regions so the report appendix never shows mostly-empty pages.
 *
 * Returned strings are PNG data URLs ready to embed in a @react-pdf/renderer
 * <Image /> element.
 */
export async function captureAnalyticsSnapshots(): Promise<string[]> {
  // 1) Mount offscreen container with the *live* analytics dashboard.
  const host = document.createElement("div");
  host.setAttribute("data-snapshot-host", "analytics");
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

    // 2) Initial paint — let React commit and recharts measure.
    await raf2();
    await delay(500);

    // 3) Force-expand every collapsible analytics section so charts render.
    //    Radix Collapsible exposes data-state="closed|open" on the trigger.
    //    We click any closed trigger inside a <section id="section-..."> root.
    expandAllSections(host);
    await raf2();
    await delay(900); // Recharts ResizeObserver settle.
    expandAllSections(host); // second pass for any lazy children.
    await raf2();
    await delay(600);

    // 4) Locate each section root. We snapshot per-section to avoid the giant
    //    blank gaps that appear when a single full-page screenshot is taken.
    const sections = Array.from(
      host.querySelectorAll<HTMLElement>('section[id^="section-"]'),
    );

    // Fallback: if no sections found (unexpected), snapshot the whole host.
    const targets: HTMLElement[] = sections.length > 0 ? sections : [host];

    const PAGE_W = 1240 * 2; // 2x scale capture width
    const PAGE_H = Math.round(PAGE_W * Math.SQRT2); // A4 portrait

    const slices: string[] = [];
    const bgColor = resolveBackground();

    for (const target of targets) {
      // Skip empty / collapsed-only nodes so we don't produce blank pages.
      if (!hasMeaningfulContent(target)) continue;

      const canvas = await html2canvas(target, {
        backgroundColor: bgColor,
        scale: 2,
        useCORS: true,
        logging: false,
        windowWidth: 1240,
        windowHeight: Math.max(target.scrollHeight, host.scrollHeight),
      });

      // Auto-trim transparent / background-only edges so each snapshot is
      // tight around the actual chart/card content.
      const trimmed = trimCanvas(canvas, bgColor);

      // Paginate vertically into A4-sized slices if the section is tall.
      for (let y = 0; y < trimmed.height; y += PAGE_H) {
        const sliceH = Math.min(PAGE_H, trimmed.height - y);
        // Skip near-empty trailing slices.
        if (sliceH < 120) continue;

        const slice = document.createElement("canvas");
        slice.width = trimmed.width;
        slice.height = sliceH;
        const ctx = slice.getContext("2d");
        if (!ctx) continue;
        ctx.drawImage(
          trimmed,
          0,
          y,
          trimmed.width,
          sliceH,
          0,
          0,
          trimmed.width,
          sliceH,
        );
        slices.push(slice.toDataURL("image/png"));
      }
    }

    return slices;
  } finally {
    try {
      root?.unmount();
    } catch {
      /* noop */
    }
    host.remove();
  }
}

// ---------- helpers ----------

function raf2(): Promise<void> {
  return new Promise((r) =>
    requestAnimationFrame(() => requestAnimationFrame(() => r())),
  );
}

function delay(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

function resolveBackground(): string {
  try {
    const v = getComputedStyle(document.documentElement)
      .getPropertyValue("--background")
      .trim();
    return v ? `hsl(${v})` : "#ffffff";
  } catch {
    return "#ffffff";
  }
}

/**
 * Click every collapsed Radix Collapsible trigger inside the analytics host
 * so all sections render their charts before snapshotting.
 */
function expandAllSections(host: HTMLElement) {
  const triggers = host.querySelectorAll<HTMLElement>(
    '[data-state="closed"]',
  );
  triggers.forEach((t) => {
    // Only trigger Collapsible/Accordion-style controls (buttons).
    if (t.tagName === "BUTTON" || t.getAttribute("role") === "button") {
      try {
        t.click();
      } catch {
        /* noop */
      }
    }
  });
}

/**
 * Heuristic: a section is "meaningful" if it has at least one rendered
 * chart-like child (svg, canvas, or a card wider than 200px) OR its rendered
 * height comfortably exceeds the header strip.
 */
function hasMeaningfulContent(el: HTMLElement): boolean {
  const rect = el.getBoundingClientRect();
  if (rect.height < 140) return false;
  const hasChart = !!el.querySelector("svg, canvas, [data-analytics-block]");
  if (hasChart) return true;
  // Fallback: any sizable inner content area beyond the header.
  return el.scrollHeight > 220;
}

/**
 * Trim uniform background/transparent borders around a canvas so the
 * resulting snapshot is tight around the real content. Falls back to the
 * original canvas if trimming fails or yields an empty result.
 */
function trimCanvas(
  src: HTMLCanvasElement,
  bgColor: string,
): HTMLCanvasElement {
  try {
    const ctx = src.getContext("2d");
    if (!ctx) return src;
    const { width, height } = src;
    const data = ctx.getImageData(0, 0, width, height).data;
    const [bgR, bgG, bgB] = parseColor(bgColor);
    const TOL = 8; // tolerance per channel

    const isBg = (i: number) =>
      Math.abs(data[i] - bgR) <= TOL &&
      Math.abs(data[i + 1] - bgG) <= TOL &&
      Math.abs(data[i + 2] - bgB) <= TOL;

    let top = 0;
    let bottom = height - 1;
    let left = 0;
    let right = width - 1;

    // top
    outerTop: for (; top < height; top++) {
      for (let x = 0; x < width; x++) {
        const i = (top * width + x) * 4;
        if (data[i + 3] > 8 && !isBg(i)) break outerTop;
      }
    }
    // bottom
    outerBottom: for (; bottom > top; bottom--) {
      for (let x = 0; x < width; x++) {
        const i = (bottom * width + x) * 4;
        if (data[i + 3] > 8 && !isBg(i)) break outerBottom;
      }
    }
    // left
    outerLeft: for (; left < width; left++) {
      for (let y = top; y <= bottom; y++) {
        const i = (y * width + left) * 4;
        if (data[i + 3] > 8 && !isBg(i)) break outerLeft;
      }
    }
    // right
    outerRight: for (; right > left; right--) {
      for (let y = top; y <= bottom; y++) {
        const i = (y * width + right) * 4;
        if (data[i + 3] > 8 && !isBg(i)) break outerRight;
      }
    }

    // Add a small breathing-room margin so cards don't look amputated.
    const margin = 24;
    top = Math.max(0, top - margin);
    left = Math.max(0, left - margin);
    bottom = Math.min(height - 1, bottom + margin);
    right = Math.min(width - 1, right + margin);

    const w = right - left + 1;
    const h = bottom - top + 1;
    if (w <= 0 || h <= 0 || w === width && h === height) return src;

    const out = document.createElement("canvas");
    out.width = w;
    out.height = h;
    const octx = out.getContext("2d");
    if (!octx) return src;
    octx.fillStyle = bgColor;
    octx.fillRect(0, 0, w, h);
    octx.drawImage(src, left, top, w, h, 0, 0, w, h);
    return out;
  } catch {
    return src;
  }
}

/** Best-effort color parser for `hsl(...)`, `#rgb`, `#rrggbb`, `rgb(...)`. */
function parseColor(input: string): [number, number, number] {
  const probe = document.createElement("div");
  probe.style.color = input;
  document.body.appendChild(probe);
  const computed = getComputedStyle(probe).color; // normalized to rgb(a)
  probe.remove();
  const m = computed.match(/\d+(\.\d+)?/g);
  if (!m || m.length < 3) return [255, 255, 255];
  return [Number(m[0]), Number(m[1]), Number(m[2])];
}
