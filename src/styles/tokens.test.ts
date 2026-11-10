import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { contrast, mix, parseHex } from "@/lib/color";
import { pastels } from "@/lib/categories";

// Reads tokens.css itself so the test checks what ships, not a copy.
const css = readFileSync(resolve(process.cwd(), "src/styles/tokens.css"), "utf8");

function block(selector: string): Record<string, string> {
  const start = css.indexOf(selector);
  if (start < 0) throw new Error(`Missing block ${selector}`);
  const body = css.slice(css.indexOf("{", start) + 1, css.indexOf("}", start));
  const out: Record<string, string> = {};
  for (const m of body.matchAll(/--([\w-]+):\s*(#[0-9a-f]{3,6})\s*;/gi)) out[m[1]] = m[2];
  return out;
}

const light = block(":root {");
const dark = block(':root[data-theme="dark"]');
const darkSystem = block(':root:not([data-theme="light"])');

const AA = 4.5;

describe.each([
  ["light", light, 0.62],
  ["dark", dark, 0.3],
])("%s theme", (_name, t, share) => {
  const ink = parseHex(t.ink);

  it.each(pastels)("ink is AA on %s card background", (p) => {
    const bg = mix(parseHex(t[p]), parseHex(t.surface), share);
    expect(contrast(ink, bg)).toBeGreaterThanOrEqual(AA);
  });

  it("ink is AA on bg, surface and surface-2", () => {
    for (const bg of ["bg", "surface", "surface-2"]) {
      expect(contrast(ink, parseHex(t[bg]))).toBeGreaterThanOrEqual(AA);
    }
  });

  it("secondary ink is AA on bg and surface", () => {
    for (const bg of ["bg", "surface"]) {
      expect(contrast(parseHex(t["ink-2"]), parseHex(t[bg]))).toBeGreaterThanOrEqual(AA);
    }
  });

  it("primary button text is AA on accent", () => {
    expect(contrast(parseHex(t["accent-ink"]), parseHex(t.accent))).toBeGreaterThanOrEqual(AA);
  });
});

describe("avatars (same in both themes)", () => {
  it.each(pastels)("avatar ink is AA on %s", (p) => {
    expect(
      contrast(parseHex(light["avatar-ink"]), parseHex(light[`avatar-${p}`])),
    ).toBeGreaterThanOrEqual(AA);
  });

  it("no dark block overrides avatar colours", () => {
    expect(Object.keys(dark).some((k) => k.startsWith("avatar"))).toBe(false);
  });
});

it("system dark and explicit dark use the same values", () => {
  expect(darkSystem).toEqual(dark);
});
