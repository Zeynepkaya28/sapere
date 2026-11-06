import { describe, expect, it } from "vitest";
import { readPublicEnv } from "./env";

describe("readPublicEnv", () => {
  it("returns values and defaults the site URL", () => {
    const env = readPublicEnv({
      NEXT_PUBLIC_SUPABASE_URL: "http://127.0.0.1:54321",
      NEXT_PUBLIC_SUPABASE_ANON_KEY: "anon",
    });
    expect(env).toEqual({
      supabaseUrl: "http://127.0.0.1:54321",
      supabaseAnonKey: "anon",
      siteUrl: "http://localhost:3000",
    });
  });

  it("throws with the variable name when one is missing", () => {
    expect(() => readPublicEnv({ NEXT_PUBLIC_SUPABASE_URL: "x" })).toThrow(
      /NEXT_PUBLIC_SUPABASE_ANON_KEY/,
    );
  });
});
