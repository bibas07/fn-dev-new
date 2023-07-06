import { expect, test } from "@playwright/test";
import { signupFormSubmit } from "./auth/formHandle";
import { alertMessage } from "./auth/errorHandle";
import { emailGenerator } from "./auth/fakemailGenerator";
const { chromium } = require("playwright");

let randomEmail;

async function generateEmail(page) {
  randomEmail = await emailGenerator(page);
}
const signupPage = "https://fn-new-web.vercel.app/signup";
test.describe("Signup Flow in Finnoto", () => {
  const firstSignup = {
    name: "Testing singup",
    email: "onnteestsss0123456@gmail.com", //for testing with valid info and used in singin
    password: "123456",
  };
  const nameFieldInfo = [
    {
      name: "Testing Name001",
      email: "naameeetestemaailss33@gmail.com", //for testing signup with different condition
    },
    {
      name: "Te$ ting Name3&* S120%$",
      email: "naameeetestemaailss34@gmail.com",
    },
  ];
  const forValidation = {
    email: "forrvaaalidationss1233@gmail.com", //to check validation on every fields and used in verifaction email
  };

  test("Signup Interface", async ({ page }) => {
    await page.goto("https://fn-new-web.vercel.app/login");
    const signupBtn = page.locator("div.text-center");
    await signupBtn.getByRole("link", { name: "Sign Up" }).click();
    await page.goForward();
    await page.waitForTimeout(1000);
  });

  test("Signup with valid info", async ({ page }) => {
    await page.goto("https://fn-new-web.vercel.app/signup");

    //if checkbox is ticked by default
    const checkboxLocator = page.locator("div.form-control");
    const checkboxStatus = checkboxLocator.locator('input[type="checkbox"]');
    expect(checkboxStatus.isChecked()).toBeTruthy();

    await signupFormSubmit(
      page,
      firstSignup.name,
      firstSignup.email,
      firstSignup.password,
      firstSignup.password
    );
    await page.getByRole("button", { name: "Next →" }).click();
    await page.goForward();
    await page.waitForTimeout(1200);
  });

  test("Name Field Character and Space", async ({ page }) => {
    await page.goto(signupPage);
    for (const nameField of nameFieldInfo) {
      await signupFormSubmit(
        page,
        nameField.name,
        nameField.email,
        firstSignup.password,
        firstSignup.password
      );
      await page.getByRole("button", { name: "Next →" }).click();
      await page.waitForTimeout(1200);
      await page.goBack();
    }
  });

  test("Name Field Validation", async ({ page }) => {
    await page.goto(signupPage);

    await signupFormSubmit(
      page,
      "",
      forValidation.email,
      firstSignup.password,
      firstSignup.password
    );
    await alertMessage(page, "Name is required");
    await page.waitForTimeout(1200);
    // await page.getByRole("button", { name: "Next →" }).click();
    // await expect(page.getByRole("button", { name: "Next →" })).toBeDisabled();
  });

  test("Email Field Validation", async ({ page }) => {
    await page.goto(signupPage);

    await signupFormSubmit(
      page,
      firstSignup.name,
      "",
      firstSignup.password,
      firstSignup.password
    );
    await alertMessage(page, "Email is required");
    await page.waitForTimeout(1200);
  });

  test("Email Field without Domain Name", async ({ page }) => {
    await page.goto(signupPage);

    await signupFormSubmit(
      page,
      firstSignup.name,
      "testing@gmail",
      firstSignup.password,
      firstSignup.password
    );
    await alertMessage(page, "Email must be a valid email");
    await page.waitForTimeout(1200);
  });

  test("Email Field without Local Part", async ({ page }) => {
    await page.goto(signupPage);

    await signupFormSubmit(
      page,
      firstSignup.name,
      "@gmail.com",
      firstSignup.password,
      firstSignup.password
    );
    await alertMessage(page, "Email must be a valid email");
    await page.waitForTimeout(1200);
  });

  test("Email Field without @ symbol", async ({ page }) => {
    await page.goto(signupPage);

    await signupFormSubmit(
      page,
      firstSignup.name,
      "testingmail.com",
      firstSignup.password,
      firstSignup.password
    );
    await alertMessage(page, "Email must be a valid email");
    await page.waitForTimeout(1200);
  });

  test("Email Field with double @ symbol", async ({ page }) => {
    await page.goto(signupPage);

    await signupFormSubmit(
      page,
      firstSignup.name,
      "testing@test@gmail.com",
      firstSignup.password,
      firstSignup.password
    );
    await alertMessage(page, "Email must be a valid email");
    await page.waitForTimeout(1200);
  });

  test("Password Field Validation", async ({ page }) => {
    await page.goto(signupPage);

    await signupFormSubmit(
      page,
      firstSignup.name,
      forValidation.email,
      "",
      firstSignup.password
    );
    await alertMessage(page, "Password is required");
    await page.waitForTimeout(1200);
  });
  test("Password Field less than 6 characters", async ({ page }) => {
    await page.goto(signupPage);

    await signupFormSubmit(
      page,
      firstSignup.name,
      forValidation.email,
      "123",
      firstSignup.password
    );
    await alertMessage(
      page,
      "Password length must be at least 6 characters long"
    );
    await page.waitForTimeout(1200);
  });

  test("Password Field visibility", async ({ page }) => {
    await page.goto(signupPage);

    await signupFormSubmit(
      page,
      firstSignup.name,
      forValidation.email,
      firstSignup.password,
      firstSignup.password
    );
    const inputHidden = page.locator("input[id='password']");
    await expect(inputHidden).toHaveAttribute("type", "password");
    await page
      .locator("div")
      .filter({ hasText: /^Password \*$/ })
      .getByRole("img")
      .click();
    const inputVisible = page.locator("input[id='password']");
    await expect(inputVisible).toHaveAttribute("type", "text");
  });

  test("Confirm Password Field Validation", async ({ page }) => {
    await page.goto(signupPage);

    await signupFormSubmit(
      page,
      firstSignup.name,
      forValidation.email,
      firstSignup.password,
      ""
    );
    await page.getByRole("button", { name: "Next →" }).click();
    await page.waitForTimeout(1200);
    await alertMessage(page, "Confirm Password is required");
    await page.waitForTimeout(1200);
  });

  test("Confirm Password Field with different value ", async ({ page }) => {
    await page.goto(signupPage);

    await signupFormSubmit(
      page,
      firstSignup.name,
      forValidation.email,
      firstSignup.password,
      "1234"
    );
    await page.getByRole("button", { name: "Next →" }).click();
    await page.waitForTimeout(1000);
    await alertMessage(page, "Confirm Password does not match");
    await page.waitForTimeout(1000);
  });

  test("Confirm Password Case Sensitive", async ({ page }) => {
    await page.goto(signupPage);

    await signupFormSubmit(
      page,
      firstSignup.name,
      forValidation.email,
      "Abc1235",
      "abc1235"
    );
    await page.getByRole("button", { name: "Next →" }).click();
    await page.waitForTimeout(1000);
    await alertMessage(page, "Confirm Password does not match");
    await page.waitForTimeout(1000);
  });

  test("Confirm Password visibility", async ({ page }) => {
    await page.goto(signupPage);

    await signupFormSubmit(
      page,
      firstSignup.name,
      forValidation.email,
      firstSignup.password,
      firstSignup.password
    );

    const inputLocator = await page.locator('input[id="confirmPassword"]');
    await expect(inputLocator).toHaveAttribute("type", "text");

    //Confirm Password does not have view icon
    // const eyeCon = page
    //   .locator("div")
    //   .filter({ hasText: /^Confirm Password \*$/ })
    //   .getByRole("img");
    // expect(eyeCon).toBeFalsy();
    await page.waitForTimeout(1200);
  });

  test("Checkbox with unchecked", async ({ page }) => {
    await page.goto(signupPage);

    await signupFormSubmit(
      page,
      firstSignup.name,
      forValidation.email,
      firstSignup.password,
      firstSignup.password
    );
    const checkboxLocator = page.locator('input[type="checkbox"]');
    expect(checkboxLocator.isChecked()).toBeTruthy();
    await checkboxLocator.click();
    expect(page.getByRole("button", { name: "Next →" })).toBeDisabled();
    await page.waitForTimeout(1200);
  });

  test("Next Button submit without credentials", async ({ page }) => {
    await page.goto(signupPage);

    await page.getByRole("button", { name: "Next →" }).click();

    expect(page.getByRole("button", { name: "Next →" })).toBeDisabled();
    await page.waitForTimeout(1200);
  });

  test("Next Button with invalid credentials", async ({ page }) => {
    await page.goto(signupPage);

    await signupFormSubmit(
      page,
      firstSignup.name,
      forValidation.email,
      firstSignup.password,
      ""
    );
    const checkboxLocator = page.locator('input[type="checkbox"]');
    expect(checkboxLocator.isChecked());
    await page.getByRole("button", { name: "Next →" }).click();
    await alertMessage(page, "Confirm Password is required");
    expect(page.getByRole("button", { name: "Next →" })).toBeDisabled();

    await page.waitForTimeout(1000);
  });

  test("Next Button with invalid password", async ({ page }) => {
    await page.goto(signupPage);

    await signupFormSubmit(
      page,
      firstSignup.name,
      forValidation.email,
      firstSignup.password,
      "1234567"
    );
    page.locator('input[type="checkbox"]').isChecked();
    await page.getByRole("button", { name: "Next →" }).click();
    await alertMessage(page, "Confirm Password does not match");
    expect(page.getByRole("button", { name: "Next →" })).toBeDisabled();

    await page.waitForTimeout(1000);
  });
});
