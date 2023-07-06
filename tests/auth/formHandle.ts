import { test, expect } from "@playwright/test";
import { alertMessage } from "./errorHandle";
import { Page } from "playwright-core";

export async function signupFormSubmit(
  page,
  username,
  email,
  password,
  confirm_password
) {
  await page.getByPlaceholder("Enter your name").fill(username);
  await page.getByPlaceholder("Email").fill(email);
  await page.getByPlaceholder("Password", { exact: true }).fill(password);
  await page.getByPlaceholder("Confirm Password").fill(confirm_password);
}

export async function signIn(page, email, password) {
  await page.getByPlaceholder("Email").fill(email);
  await page.getByPlaceholder("Password").fill(password);
}

export async function fileUpload(page, fileNames) {
  if (!Array.isArray(fileNames)) {
    fileNames = [fileNames];
  }

  if (fileNames.length > 5) {
    throw new Error("File upload limit reached.");
  }
  for (const fileName of fileNames) {
    await page.setInputFiles("input[type='file']", [`tests/${fileName}`]);
  }
}

export async function raiseExpenseForm(page, FormFields) {
  for (const forms of FormFields) {
    const { selector, value } = forms;
    await page.getByPlaceholder(selector).fill(value);
  }
}

export async function selectField(page: Page, selectData) {
  for (const data of selectData) {
    const { title, value } = data;
    await page
      .locator(`div.text-sm:has-text("${title}") ~ div.form-control`)
      .click();
    await page.waitForSelector(".selectbox-container [class$='-menu']", {
      state: "attached",
    });

    await page.locator(`div[id$="-option-${value}"]`).click();
  }
}

export async function raiseExpenseDialog(page, dialogBox) {
  for (const dialog of dialogBox) {
    const { value } = dialog;
    const selectElement = await page.$(
      'div.selectbox-control input[type="text"]'
    );
    await selectElement.click();

    const optionElement = await page.waitForSelector(
      'div.selectbox-control [aria-expanded="true"] [role="option"]'
    );
    await optionElement.fill(value);
  }
}
export async function expenseApproval(page, portal, invoice, action, comment) {
  await page.locator(".hide-scrollbar-business");
  const portalLocator = await page.locator(".text-color-primary");
  await portalLocator.filter({ hasText: portal }).click();
  await page.getByText("ExpensesExpenses").click();
  await page.getByRole("link", { name: `${invoice}` }).click();
  await page.getByRole("button", { name: `${action}` }).click();

  await page.getByPlaceholder("Write a comment...").click();
  await page.getByPlaceholder("Write a comment...").fill(`${comment}`);
  await page.getByRole("button", { name: `${action}` }).click();
  await page.goForward();
  await page.waitForTimeout(1200);
}
