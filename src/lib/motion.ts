// Shared motion values for JS animations (Web Animations API). CSS uses the same values from tokens.css.

export const easing = {
  standard: "cubic-bezier(.2,.8,.2,1)",
  spring: "cubic-bezier(.2,1.3,.3,1)",
} as const;

export const duration = {
  fast: 150,
  panel: 300,
  progress: 500,
} as const;

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export type Random = () => number;

/** Random number in [min, max). */
export function between(rand: Random, min: number, max: number): number {
  return min + rand() * (max - min);
}
