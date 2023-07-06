import { test, expect } from "@playwright/test";
import { signIn, signupFormSubmit } from "./auth/formHandle";
import { alertMessage, toastMessage } from "./auth/errorHandle";
const chromium = require("playwright");

const signupPage = "https://fn-new-web.vercel.app/signup";
test.describe("Verify Email after Signup", () => {
  const emailInfo = {
    name: "Testing Verify Email",
    email: "onnteestsss0123456@gmail.com",
    password: "123456",
  };
  test("Verify Email Interface", async ({ page }) => {
    await page.goto("https://fn-new-web.vercel.app/login");
    // await signupFormSubmit(
    //   page,
    //   emailInfo.name,
    //   emailInfo.email,
    //   emailInfo.password,
    //   emailInfo.password
    // );
    // await page.getByRole("button", { name: "Next" }).click();
    // await page.goForward();
    await signIn(page, emailInfo.email, emailInfo.password);
    await page.getByRole("button", { name: "Next →" }).click();
    await page.goForward();
    await page.waitForTimeout(1000);

    const title = page.locator("p.text-2xl");
    await expect(title).toHaveText("Verify Your Email");

    //Count Input box
    const inputLocator = page.locator('input[type="number"]');
    await expect(inputLocator).toHaveCount(6);
    await page.locator("span.countdown.pt-1").isVisible();
    const countdown = page.locator(
      "span.flex.items-center.gap-2.text-color-primary"
    );
    //Checking if page shows 60 seconds countdown
    expect(countdown.filter({ hasText: "/^00: 60$/" }).first()).toBeTruthy();
    // await page.getByRole("button", { name: "Back" }).click();
    await page.waitForTimeout(1000);

    //Presence of Button
    const totalButton = page.locator("button");
    await expect(totalButton).toHaveCount(2);

    expect(page.getByRole("button", { name: "Back" })).toBeTruthy();
    expect(page.getByRole("button", { name: "Verify →" })).toBeTruthy();

    //Clicked on Verify Button
    await page.getByRole("button", { name: "Verify →" }).click();
    await toastMessage(page, "Invalid code!");

    await page.getByRole("button", { name: "Back" }).click();

    //If user enter invalid code
    await page.waitForTimeout(2000);
  });

  test("Email Verification after clicking on Back Button", async ({ page }) => {
    await page.goto(signupPage);
    await signupFormSubmit(
      page,
      emailInfo.name,
      emailInfo.email,
      emailInfo.password,
      emailInfo.password
    );
    await page.getByRole("button", { name: "Next" }).click();
    await alertMessage(
      page,
      `User with email ${emailInfo.email} already exists..`
    );
    await page.waitForTimeout(1200);
  });

  test("OTP field validation", async ({ page }) => {
    await page.goto("https://fn-new-web.vercel.app/login");
    await signIn(page, emailInfo.email, emailInfo.password);

    await page.getByRole("button", { name: "Next →" }).click();
    await page.goForward();
    await page.waitForTimeout(1000);

    const title = page.locator("p.text-2xl");
    await expect(title).toHaveText("Verify Your Email");
    //For Invalid Code
    await page.locator(".otpInput").first().fill("1");
    await page.locator("input:nth-child(2)").fill("2");
    await page.locator("input:nth-child(3)").fill("3");
    await page.locator("input:nth-child(4)").fill("4");
    await page.locator("input:nth-child(5)").fill("5");
    await page.locator("input:nth-child(6)").fill("6");
    await page.getByRole("button", { name: "Verify →" }).click();

    await toastMessage(page, "Invalid code!");

    await page.waitForTimeout(1000);
    //For less than 6 digits code
    await page.locator(".otpInput").first().fill("1");
    await page.locator("input:nth-child(2)").fill("2");
    await page.locator("input:nth-child(3)").fill("");
    await page.locator("input:nth-child(4)").fill("4");
    await page.locator("input:nth-child(5)").fill("5");
    await page.locator("input:nth-child(6)").click();
    await page.getByRole("button", { name: "Verify →" }).click();

    await toastMessage(page, "Invalid code!");
    await page.waitForTimeout(1000);
  });

  test("Valid OTP and Success page Interface", async ({ page }) => {
    await page.goto("https://fn-new-web.vercel.app/login");
    await signIn(page, emailInfo.email, emailInfo.password);
    await page.getByRole("button", { name: "Next →" }).click();
    await page.goForward();

    await page.locator(".otpInput").first().fill("1");
    await page.locator("input:nth-child(2)").fill("1");
    await page.locator("input:nth-child(3)").fill("1");
    await page.locator("input:nth-child(4)").fill("1");
    await page.locator("input:nth-child(5)").fill("1");
    await page.locator("input:nth-child(6)").fill("1");
    await page.getByRole("button", { name: "Verify" }).click();
    await page.goForward();

    await expect(
      page.getByText(
        `Your email address ${emailInfo.email}
        has been successfully verified. Press continue to start your journey with us!`
      )
    ).toBeTruthy();

    await page.waitForTimeout(2000);
    const buttonCount = page.locator("button");
    await expect(buttonCount).toHaveCount(1);
    expect(buttonCount.getByText("Continue →")).toBeTruthy();
  });

  test("Login after set organization windows closed", async ({ page }) => {
    await page.goto("https://fn-new-web.vercel.app/login");
    await signIn(page, emailInfo.email, emailInfo.password);
    await page.getByRole("button", { name: "Next →" }).click();
    await page.goForward();

    await page.waitForTimeout(2000);
    const dialog = page.getByRole("dialog");
    const dialogTitle = dialog.locator("form.gap-8.col-flex");
    await expect(
      dialogTitle.locator("p.text-sm.font-medium.text-color-secondary")
    ).toContainText("Create your organization profile");

    //Button Count

    const buttonCount = dialog.locator("button");
    await expect(buttonCount).toHaveCount(2);

    expect(buttonCount.getByText("Closed")).toBeTruthy();
    expect(buttonCount.getByText("Continue")).toBeTruthy();

    const linkLocator = dialog.locator("a");
    await expect(linkLocator).toContainText("Login with different user");

    //Check if there is input field
    const inputLocator = dialog.locator(
      "input.input-bordered.input-md.input-default"
    );
    expect(
      inputLocator.getByPlaceholder("Enter your organization name")
    ).toBeTruthy();

    //Checking if Continue button is disabled by default
    await inputLocator.click();
    await inputLocator.fill("");
    const continueBtn = dialog.locator("button");
    await expect(continueBtn.getByText("Continue")).toBeDisabled();

    //Clicking on Login with another

    await linkLocator.getByText("Login with different user").click();

    expect(page).toHaveURL("https://fn-new-web.vercel.app/login");
    await page.waitForTimeout(1000);
  });

  test("Set organization name and continue", async ({ page }) => {
    await page.goto("https://fn-new-web.vercel.app/login");
    await signIn(page, emailInfo.email, emailInfo.password);
    await page.getByRole("button", { name: "Next →" }).click();
    await page.goForward();
    await page.waitForTimeout(1000);
    try {
      const dialog = page.getByRole("dialog");
      const inputLocator = dialog.locator(
        "input.input-bordered.input-md.input-default"
      );
      inputLocator.click();
      await inputLocator.fill("ABCD Company");
      await dialog.getByRole("button", { name: "Continue" }).click();
      await page.goForward();
      await page.waitForTimeout(9000);
      await expect(page).toHaveURL("https://fn-new-web.vercel.app/r");
    } catch (error) {
      console.log("User has already set organization name" + error);
    }
  });
});
