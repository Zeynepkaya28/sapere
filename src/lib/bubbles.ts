// Colour-bubble effect for the nav bar (prompt section 4.3).
// Particle maths is pure (testable); spawnParticles() draws them with the Web Animations API.

import { pastels, type Pastel } from "./categories";
import { between, easing, prefersReducedMotion, type Random } from "./motion";

export type Particle = {
  kind: "bubble" | "star";
  color: Pastel;
  /** Diameter in px. */
  size: number;
  /** Travel from the origin, px. */
  dx: number;
  dy: number;
  duration: number;
  /** End rotation in degrees (stars only). */
  rotate: number;
};

export const HOVER_COUNT = 6;
export const BURST_BUBBLES = 9;
export const BURST_STARS = 2;
export const MAX_LIVE = 40;

const rad = (deg: number) => (deg * Math.PI) / 180;

function travel(angleDeg: number, distance: number) {
  return { dx: Math.cos(rad(angleDeg)) * distance, dy: Math.sin(rad(angleDeg)) * distance };
}

/** Hover: 6 bubbles, up ±25°, 40–90px, 6–16px, 900–1300ms, colours in fixed order. */
export function hoverParticles(rand: Random = Math.random): Particle[] {
  return Array.from({ length: HOVER_COUNT }, (_, i) => ({
    kind: "bubble",
    color: pastels[i % pastels.length],
    size: between(rand, 6, 16),
    ...travel(-90 + between(rand, -25, 25), between(rand, 40, 90)),
    duration: between(rand, 900, 1300),
    rotate: 0,
  }));
}

/** Click: 9 bubbles + 2 butter stars over a 250° arc, 50–90px, 800–1100ms; stars turn 120°. */
export function burstParticles(rand: Random = Math.random): Particle[] {
  const total = BURST_BUBBLES + BURST_STARS;
  const arc = 250;
  const start = -90 - arc / 2;
  const step = arc / (total - 1);
  const starSlots = new Set([3, 7]);

  return Array.from({ length: total }, (_, i) => {
    const star = starSlots.has(i);
    const angle = start + step * i + between(rand, -step / 3, step / 3);
    return {
      kind: star ? "star" : "bubble",
      color: star ? "butter" : pastels[i % pastels.length],
      size: star ? between(rand, 12, 16) : between(rand, 6, 16),
      ...travel(Math.max(start, Math.min(start + arc, angle)), between(rand, 50, 90)),
      duration: between(rand, 800, 1100),
      rotate: star ? 120 : 0,
    };
  });
}

/** How many of `requested` may start while `live` are on screen. */
export function capacity(live: number, requested: number, max = MAX_LIVE): number {
  return Math.max(0, Math.min(requested, max - live));
}

// ---- DOM layer ----

let layer: HTMLDivElement | null = null;
let live = 0;

export function liveBubbleCount(): number {
  return live;
}

function getLayer(): HTMLDivElement {
  if (layer && document.body.contains(layer)) return layer;
  layer = document.createElement("div");
  layer.setAttribute("aria-hidden", "true");
  layer.dataset.bubbleLayer = "";
  Object.assign(layer.style, {
    position: "fixed",
    inset: "0",
    pointerEvents: "none",
    zIndex: "90",
    overflow: "hidden",
  });
  document.body.appendChild(layer);
  return layer;
}

const STAR_CLIP =
  "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)";

/** Draws particles from (x, y) in viewport px. Returns how many were drawn. */
export function spawnParticles(particles: Particle[], x: number, y: number): number {
  if (typeof document === "undefined" || prefersReducedMotion()) return 0;
  const count = capacity(live, particles.length);
  if (count === 0) return 0;
  const host = getLayer();

  for (const p of particles.slice(0, count)) {
    const el = document.createElement("span");
    Object.assign(el.style, {
      position: "absolute",
      left: `${x}px`,
      top: `${y}px`,
      width: `${p.size}px`,
      height: `${p.size}px`,
      background: `var(--${p.color})`,
      borderRadius: p.kind === "star" ? "0" : "50%",
      clipPath: p.kind === "star" ? STAR_CLIP : "none",
      opacity: "0",
      willChange: "transform, opacity",
    });
    el.dataset.kind = p.kind;
    host.appendChild(el);
    live++;

    const from = `translate(-50%, -50%) translate(0px, 0px) scale(0.4) rotate(0deg)`;
    const to = `translate(-50%, -50%) translate(${p.dx}px, ${p.dy}px) scale(0.8) rotate(${p.rotate}deg)`;
    const done = () => {
      el.remove();
      live = Math.max(0, live - 1);
    };

    if (typeof el.animate !== "function") {
      done();
      continue;
    }
    const animation = el.animate(
      [
        { transform: from, opacity: 0 },
        { opacity: 0.95, offset: 0.25 },
        { transform: to, opacity: 0 },
      ],
      { duration: p.duration, easing: easing.standard, fill: "forwards" },
    );
    animation.onfinish = done;
    animation.oncancel = done;
  }
  return count;
}

export function centerOf(el: Element): { x: number; y: number } {
  const r = el.getBoundingClientRect();
  return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
}
