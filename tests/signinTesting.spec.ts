import { expect, test } from "@playwright/test";
const { chromium } = require("playwright");
import { signIn } from "./auth/formHandle";
import { alertMessage, toastMessage } from "./auth/errorHandle";

const signinPage = "https://fn-new-web.vercel.app/login";
const validInfo = {
  email: "onnteestsss0123456@gmail.com",
  password: "123456",
};
test.describe("SignIn Flow in Finnoto", () => {
  test("Login with valid Info", async ({ page }) => {
    await page.goto(signinPage);
    await signIn(page, validInfo.email, validInfo.password);
    await page.getByRole("button", { name: "Next" }).click();
    await page.goForward();
    await page.waitForTimeout(1500);
    await expect(page).toHaveURL("https://fn-new-web.vercel.app/r");

    const userEmailLocator = page.locator("div.user-profile-details");
    await expect(userEmailLocator.locator("p.text-color-tertiary")).toHaveText(
      `${validInfo.email}`
    );
    await page.waitForTimeout(1000);
  });

  test("Login with invalid credentials", async ({ page }) => {
    await page.goto(signinPage);
    await signIn(page, validInfo.email, "123abcd");
    await page.getByRole("button", { name: "Next" }).click();

    await alertMessage(page, "Invalid username or password..");
    await page.waitForTimeout(1000);
  });

  test("Multiple attempt to logged In", async ({ page }) => {
    await page.goto(signinPage);
    for (let i = 0; i < 5; i++) {
      await signIn(page, validInfo.email, "abc123");
      await page.getByRole("button", { name: "Next" }).click();
      await page.waitForTimeout(1000);
    }
    await signIn(page, validInfo.email, validInfo.password);
    await page.getByRole("button", { name: "Next" }).click();
    await alertMessage(
      page,
      "Account locked for too many invalid attempts. Please try after 5 minutes"
    );
    await page.waitForTimeout(1000);
  });

  test("Login with incorrect credentials", async ({ page }) => {
    await page.goto(signinPage);
    await signIn(page, "fakemail@gmail.com", "123abcd");
    await page.getByRole("button", { name: "Next" }).click();

    await toastMessage(page, "Invalid username or password");
    await page.waitForTimeout(1000);
  });
});
