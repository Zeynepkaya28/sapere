import { expect, test } from "@playwright/test";

test("home page renders the logo text", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle("Sapere");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("sapere");
});
