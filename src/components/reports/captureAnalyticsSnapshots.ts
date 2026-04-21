import * as React from "react";
import { createRoot, type Root } from "react-dom/client";
import html2canvas from "html2canvas";
import { LegalTeamAnalyticsDashboard } from "@/components/analytics/LegalTeamAnalyticsDashboard";

export interface AnalyticsSnapshot {
  src: string;
  width: number;
  height: number;
}

/**
 * Renders the live LegalTeamAnalyticsDashboard offscreen, force-expands every
 * collapsible section, then captures each section as its own tight,
 * high-resolution snapshot. Tall sections are split into multiple slices, but
 * always aligned to the section itself rather than the full dashboard canvas.
 */
export async function captureAnalyticsSnapshots(): Promise<AnalyticsSnapshot[]> {
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
    root.render(React.createElement(LegalTeamAnalyticsDashboard, { snapshotMode: true }));

    await raf2();
    await delay(500);
    expandAllSections(host);
    await raf2();
    await delay(900);
    expandAllSections(host);
    await raf2();
    await delay(600);

    const sections = Array.from(
      host.querySelectorAll<HTMLElement>('section[id^="section-"]'),
    );
    const targets: HTMLElement[] = sections.length > 0 ? sections : [host];

    const PAGE_W = 1240 * 2;
    const PAGE_H = Math.round(PAGE_W * Math.SQRT2);
    const slices: AnalyticsSnapshot[] = [];
    const bgColor = resolveBackground();

    for (const target of targets) {
      if (target.scrollHeight < 180) continue;

      const canvas = await html2canvas(target, {
        backgroundColor: bgColor,
        scale: 2,
        useCORS: true,
        logging: false,
        windowWidth: 1240,
        windowHeight: Math.max(target.scrollHeight, host.scrollHeight),
      });

      const trimmed = trimCanvas(canvas, bgColor);

      for (let y = 0; y < trimmed.height; y += PAGE_H) {
        const sliceH = Math.min(PAGE_H, trimmed.height - y);
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
        slices.push({
          src: slice.toDataURL("image/png"),
          width: slice.width,
          height: slice.height,
        });
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
