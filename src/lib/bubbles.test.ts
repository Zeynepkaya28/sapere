import { describe, expect, it } from "vitest";
import { burstParticles, capacity, hoverParticles, MAX_LIVE } from "./bubbles";

// Small seeded generator so ranges are checked across many draws, reproducibly.
function seeded(seed = 42) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 2 ** 32;
    return s / 2 ** 32;
  };
}

const angleOf = (p: { dx: number; dy: number }) => (Math.atan2(p.dy, p.dx) * 180) / Math.PI;
const distOf = (p: { dx: number; dy: number }) => Math.hypot(p.dx, p.dy);

describe("hoverParticles", () => {
  const rand = seeded();
  const runs = Array.from({ length: 200 }, () => hoverParticles(rand));

  it("makes 6 bubbles in peach, rose, lavender, sky, mint, butter order", () => {
    for (const run of runs) {
      expect(run).toHaveLength(6);
      expect(run.map((p) => p.color)).toEqual([
        "peach",
        "rose",
        "lavender",
        "sky",
        "mint",
        "butter",
      ]);
      expect(run.every((p) => p.kind === "bubble")).toBe(true);
    }
  });

  it("keeps size, direction, distance and duration in range", () => {
    for (const p of runs.flat()) {
      expect(p.size).toBeGreaterThanOrEqual(6);
      expect(p.size).toBeLessThanOrEqual(16);
      expect(angleOf(p)).toBeGreaterThanOrEqual(-115 - 1e-9);
      expect(angleOf(p)).toBeLessThanOrEqual(-65 + 1e-9);
      expect(distOf(p)).toBeGreaterThanOrEqual(40 - 1e-9);
      expect(distOf(p)).toBeLessThanOrEqual(90 + 1e-9);
      expect(p.duration).toBeGreaterThanOrEqual(900);
      expect(p.duration).toBeLessThanOrEqual(1300);
    }
  });
});

describe("burstParticles", () => {
  const rand = seeded(7);
  const runs = Array.from({ length: 200 }, () => burstParticles(rand));

  it("makes 11 pieces: 9 bubbles and 2 butter stars that turn 120°", () => {
    for (const run of runs) {
      expect(run).toHaveLength(11);
      const stars = run.filter((p) => p.kind === "star");
      expect(stars).toHaveLength(2);
      expect(stars.every((s) => s.color === "butter" && s.rotate === 120)).toBe(true);
    }
  });

  it("spreads over a 250° arc centred upwards, 50–90px, 800–1100ms", () => {
    for (const p of runs.flat()) {
      // Arc runs from -215° to +35°; atan2 wraps -215° to 145°.
      const a = angleOf(p);
      const normal = a > 90 ? a - 360 : a;
      expect(normal).toBeGreaterThanOrEqual(-215 - 1e-9);
      expect(normal).toBeLessThanOrEqual(35 + 1e-9);
      expect(distOf(p)).toBeGreaterThanOrEqual(50 - 1e-9);
      expect(distOf(p)).toBeLessThanOrEqual(90 + 1e-9);
      expect(p.duration).toBeGreaterThanOrEqual(800);
      expect(p.duration).toBeLessThanOrEqual(1100);
    }
  });
});

describe("capacity", () => {
  it("never lets more than 40 be on screen", () => {
    expect(MAX_LIVE).toBe(40);
    expect(capacity(0, 11)).toBe(11);
    expect(capacity(35, 11)).toBe(5);
    expect(capacity(40, 6)).toBe(0);
    expect(capacity(45, 6)).toBe(0);
  });
});
