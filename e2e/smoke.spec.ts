import { expect, test } from "@playwright/test";

test("home page renders the welcome title", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle("Sapere");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Bugün neyi merak ediyorsun?");
});
