import { expect, test } from "@playwright/test";

test.describe("fact feed", () => {
  test("shows sample cards and filters them by category", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByTestId("splash")).toBeHidden({ timeout: 15_000 });

    const cards = page.locator("#bilgiler article");
    await expect(cards).toHaveCount(15);
    await expect(cards.first().getByText("Örnek")).toBeVisible();

    await page.getByRole("button", { name: "Bilim" }).click();
    await expect(cards).toHaveCount(2);
    await expect(page.getByText("2 bilgi")).toBeVisible();
  });

  test("'Haritada gör' opens the same fact on the map", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByTestId("splash")).toBeHidden({ timeout: 15_000 });
    await page
      .getByRole("article", { name: "Dünyanın en derin gölü" })
      .getByRole("link", { name: /Haritada gör/ })
      .click();

    await expect(page).toHaveURL(/\/harita\?bilgi=baykal$/);
    await expect(
      page.getByRole("heading", { level: 2, name: "Dünyanın en derin gölü" }),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: /Dünyanın en derin gölü \(Baykal/ }),
    ).toHaveAttribute("aria-pressed", "true");
  });
});

test.describe("fact map", () => {
  test("zooms into Turkey and opens a pin", async ({ page }) => {
    await page.goto("/harita");
    await expect(page.getByRole("heading", { level: 1, name: "Bilgi haritası" })).toBeVisible();

    await page.getByRole("button", { name: "Türkiye: 6 bilgi. Yakınlaştır" }).click();
    const turkey = page.locator('[data-view="turkey"]');
    await expect(turkey).toHaveAttribute("data-active", "true");

    await turkey.getByRole("button", { name: /Türkiye'nin çatısı/ }).click();
    await expect(page).toHaveURL(/bilgi=agri-dagi/);
    await expect(
      page.getByRole("heading", { level: 2, name: "Türkiye'nin çatısı" }),
    ).toBeInViewport();

    await page.getByRole("button", { name: "Bilgiyi kapat" }).click();
    await expect(page.getByText(/Bir iğne seç/)).toBeVisible();
    await expect(turkey.getByRole("button", { name: /Türkiye'nin çatısı/ })).toBeFocused();
  });

  test("pins stay inside the map frame", async ({ page }) => {
    await page.goto("/harita");
    const frame = (await page.locator('[data-view="world"] svg').boundingBox())!;
    const pins = page.locator('[data-view="world"] [data-pin]');
    await expect(pins.first()).toBeVisible();
    for (const box of await pins.evaluateAll((els) =>
      els.map((el) => {
        const r = el.getBoundingClientRect();
        return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
      }),
    )) {
      expect(box.x).toBeGreaterThanOrEqual(frame.x);
      expect(box.x).toBeLessThanOrEqual(frame.x + frame.width);
      expect(box.y).toBeGreaterThanOrEqual(frame.y);
      expect(box.y).toBeLessThanOrEqual(frame.y + frame.height);
    }
  });
});
