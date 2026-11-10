import { expect, test, type Page } from "@playwright/test";

const bubbleCount = (page: Page) =>
  page.evaluate(() => document.querySelector("[data-bubble-layer]")?.childElementCount ?? 0);

async function ready(page: Page) {
  await page.goto("/");
  await expect(page.getByTestId("splash")).toBeHidden({ timeout: 15_000 });
}

test.describe("splash screen", () => {
  test("reaches 100% with real progress, says Hazır! and fades away", async ({ page }) => {
    await page.goto("/");
    const splash = page.getByTestId("splash");
    await expect(splash.getByText("sapere")).toBeVisible();
    await expect(splash.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "100", {
      timeout: 15_000,
    });
    await expect(splash.getByText("Hazır!")).toBeVisible();
    await expect(splash.getByText("Örnek")).toBeVisible();
    await expect(splash).toBeHidden({ timeout: 5_000 });
  });
});

test.describe("nav bubbles (mouse)", () => {
  test.skip(({ isMobile }) => isMobile, "No hover on touch devices");

  test("hover makes 6 bubbles, click makes 11 with 2 stars, all cleaned up", async ({ page }) => {
    await ready(page);
    const feed = page.getByRole("link", { name: "Akış" });

    await feed.hover();
    await expect.poll(() => bubbleCount(page)).toBe(6);
    await expect.poll(() => bubbleCount(page), { timeout: 3_000 }).toBe(0);

    await feed.click();
    await expect.poll(() => bubbleCount(page)).toBe(11);
    expect(await page.locator('[data-bubble-layer] [data-kind="star"]').count()).toBe(2);
    await expect.poll(() => bubbleCount(page), { timeout: 3_000 }).toBe(0);
  });

  test("never more than 40 bubbles at once", async ({ page }) => {
    await ready(page);
    const feed = page.getByRole("link", { name: "Akış" });
    let max = 0;
    for (let i = 0; i < 8; i++) {
      await feed.click();
      max = Math.max(max, await bubbleCount(page));
    }
    expect(max).toBe(40);
  });

  test("reduced motion: no bubbles, no teddy animation", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await ready(page);
    await page.getByRole("link", { name: "Akış" }).hover();
    await page.getByRole("link", { name: "Akış" }).click();
    expect(await bubbleCount(page)).toBe(0);

    const animation = await page
      .locator('main svg[data-pose="wave"] [class*="armR"]')
      .evaluate((arm) => getComputedStyle(arm).animationName);
    expect(animation).toBe("none");
  });
});

test.describe("mobile tab bar", () => {
  test.skip(({ isMobile }) => !isMobile, "Phone layout only");

  test("sits at the bottom of the screen and leaves the header usable", async ({ page }) => {
    await ready(page);
    const nav = page.getByRole("navigation", { name: "Ana gezinme" });
    const box = (await nav.boundingBox())!;
    const viewport = page.viewportSize()!;
    expect(Math.round(box.y + box.height)).toBe(viewport.height);
    await expect(page.getByRole("button", { name: "Koyu temaya geç" })).toBeInViewport();
  });
});

test.describe("theme", () => {
  test("toggle switches theme and remembers it", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "light" });
    await ready(page);
    await page.getByRole("button", { name: "Koyu temaya geç" }).click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
    // Body background fades over 300 ms.
    await expect
      .poll(() => page.evaluate(() => getComputedStyle(document.body).backgroundColor))
      .toBe("rgb(28, 24, 40)");

    await page.reload();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
    await expect(page.getByRole("button", { name: "Açık temaya geç" })).toBeVisible();
  });
});
