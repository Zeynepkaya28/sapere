// @vitest-environment node
import { describe, expect, it } from "vitest";
import { facts } from "@/content/facts";
import { getMapViews, isInTurkey } from "./views";

const [world, turkey] = getMapViews(facts);
const located = facts.filter((f) => f.place);

describe("isInTurkey", () => {
  it("finds places inside Turkey and not its neighbours", () => {
    const inside = facts.filter(isInTurkey).map((f) => f.id);
    expect(inside.sort()).toEqual(
      [
        "agri-dagi",
        "ankara-baskent",
        "aziz-sancar",
        "gobeklitepe",
        "istanbul-kitalar",
        "van-golu",
      ].sort(),
    );
  });
});

describe("map views", () => {
  it("puts every located fact on exactly one view", () => {
    const onWorld = world.pins.length + (world.cluster?.count ?? 0);
    expect(onWorld).toBe(located.length);
    expect(turkey.pins).toHaveLength(world.cluster?.count ?? 0);
  });

  it("keeps pins inside the frame", () => {
    for (const pin of [...world.pins, ...turkey.pins]) {
      expect(pin.x).toBeGreaterThanOrEqual(0);
      expect(pin.x).toBeLessThanOrEqual(100);
      expect(pin.y).toBeGreaterThanOrEqual(0);
      expect(pin.y).toBeLessThanOrEqual(100);
    }
  });

  it("draws land, borders and Turkey on both views", () => {
    for (const view of [world, turkey]) {
      expect(view.land).toMatch(/^M/);
      expect(view.borders).toMatch(/^M/);
      expect(view.home).toMatch(/^M/);
    }
  });

  it("stays small enough to inline in the page", () => {
    const size = (v: typeof world) => v.land.length + v.borders.length + v.home.length;
    expect(size(world)).toBeLessThan(120_000);
    expect(size(turkey)).toBeLessThan(120_000);
  });

  it("returns the cached views on the second call", () => {
    expect(getMapViews(facts)[0]).toBe(world);
  });
});
