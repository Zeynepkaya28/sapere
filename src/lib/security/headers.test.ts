import { describe, expect, it } from "vitest";
import { buildCsp, createNonce, securityHeaders } from "./headers";

function directive(csp: string, name: string): string[] {
  const part = csp.split("; ").find((p) => p.startsWith(`${name} `));
  return part ? part.split(" ").slice(1) : [];
}

describe("buildCsp", () => {
  const prod = buildCsp({ nonce: "abc", isDev: false, supabaseUrl: "https://xyz.supabase.co" });

  it("only allows scripts with the request nonce", () => {
    const scripts = directive(prod, "script-src");
    expect(scripts).toContain("'nonce-abc'");
    expect(scripts).toContain("'strict-dynamic'");
    expect(scripts).not.toContain("'unsafe-inline'");
    expect(scripts).not.toContain("'unsafe-eval'");
  });

  it("blocks framing, plugins and foreign form targets", () => {
    expect(directive(prod, "frame-ancestors")).toEqual(["'none'"]);
    expect(directive(prod, "object-src")).toEqual(["'none'"]);
    expect(directive(prod, "form-action")).toEqual(["'self'"]);
    expect(directive(prod, "base-uri")).toEqual(["'self'"]);
  });

  it("allows Supabase REST and Realtime origins only", () => {
    expect(directive(prod, "connect-src")).toEqual([
      "'self'",
      "https://xyz.supabase.co",
      "wss://xyz.supabase.co",
    ]);
  });

  it("upgrades insecure requests in production only", () => {
    expect(prod).toContain("upgrade-insecure-requests");
    expect(buildCsp({ nonce: "n", isDev: true })).not.toContain("upgrade-insecure-requests");
  });

  it("adds eval only in development", () => {
    expect(directive(buildCsp({ nonce: "n", isDev: true }), "script-src")).toContain(
      "'unsafe-eval'",
    );
  });

  it("ignores an invalid Supabase URL", () => {
    expect(
      directive(buildCsp({ nonce: "n", isDev: false, supabaseUrl: "not a url" }), "connect-src"),
    ).toEqual(["'self'"]);
  });
});

describe("securityHeaders", () => {
  it("sends HSTS in production only", () => {
    expect(securityHeaders({ isDev: false })["Strict-Transport-Security"]).toMatch(/max-age=/);
    expect(securityHeaders({ isDev: true })["Strict-Transport-Security"]).toBeUndefined();
  });

  it("disables sniffing and framing", () => {
    const h = securityHeaders({ isDev: false });
    expect(h["X-Content-Type-Options"]).toBe("nosniff");
    expect(h["X-Frame-Options"]).toBe("DENY");
  });
});

describe("createNonce", () => {
  it("returns a different 128-bit base64 value each time", () => {
    const a = createNonce();
    const b = createNonce();
    expect(a).not.toBe(b);
    expect(atob(a)).toHaveLength(16);
  });
});
