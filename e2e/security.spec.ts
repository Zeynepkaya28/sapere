import { expect, test } from "@playwright/test";

test.describe("security headers", () => {
  test("pages send a nonce CSP and hardening headers", async ({ page }) => {
    const response = await page.goto("/");
    const headers = response!.headers();
    const csp = headers["content-security-policy"];

    expect(csp).toMatch(/script-src 'self' 'nonce-[A-Za-z0-9+/=]+' 'strict-dynamic'/);
    expect(csp).toContain("frame-ancestors 'none'");
    expect(csp).toContain("object-src 'none'");
    expect(csp).not.toMatch(/script-src[^;]*'unsafe-inline'/);
    expect(headers["x-content-type-options"]).toBe("nosniff");
    expect(headers["x-frame-options"]).toBe("DENY");
    expect(headers["referrer-policy"]).toBe("strict-origin-when-cross-origin");
    expect(headers["permissions-policy"]).toContain("camera=()");
    expect(headers["strict-transport-security"]).toContain("max-age=");
    expect(headers["x-powered-by"]).toBeUndefined();
  });

  test("every script carries this request's nonce and nothing is blocked", async ({ page }) => {
    const violations: string[] = [];
    page.on("console", (msg) => {
      if (/Content Security Policy|CSP/i.test(msg.text())) violations.push(msg.text());
    });

    const response = await page.goto("/");
    const nonce = /'nonce-([^']+)'/.exec(response!.headers()["content-security-policy"])![1];
    await expect(page.getByTestId("splash")).toBeHidden({ timeout: 15_000 });

    const scriptNonces = await page.$$eval("script", (els) => els.map((s) => s.nonce));
    expect(scriptNonces.length).toBeGreaterThan(0);
    expect(scriptNonces.every((n) => n === nonce)).toBe(true);
    expect(violations).toEqual([]);
  });

  test("nonce changes on every request", async ({ request }) => {
    const a = (await request.get("/")).headers()["content-security-policy"];
    const b = (await request.get("/")).headers()["content-security-policy"];
    expect(a).not.toBe(b);
  });
});
