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

//Add value inside dialog box
export async function raiseExpenseDialog(page: Page) {
  const dialogBox = page.getByRole("dialog");
  // for (const data of dialogData) {
  //   const { value } = data;

  await dialogBox.locator("div.form-control").first().click();
  await dialogBox
    .locator(`div[id$="-option-${Math.floor(Math.random() * 4).toString()}"]`)
    .click();

  await dialogBox.getByRole("tab").nth(1).click();
  await dialogBox
    .getByPlaceholder("Enter Amount")
    .fill((Math.random() * 1000).toString());

  await dialogBox.getByRole("tab").nth(2).click();
  await dialogBox.locator("div.form-control .selectbox-container").click();
  await dialogBox
    .locator(`div[id$="-option-${Math.floor(Math.random() * 9).toString()}"]`)
    .click();
  await dialogBox.getByRole("tab").nth(3).click();
  // await page.locator("div.form-control input[type='number']").click();
  await dialogBox
    .getByPlaceholder("Enter Percentage")
    .fill((Math.random() * 100).toString());
  await page.getByRole("button", { name: "Save" }).click();
}
// }

//Approve or Reject by PoC/Approver
export async function expenseApproval(
  page,
  portal,
  portal2,
  invoice,
  action,
  comment,
  noCmt: boolean
) {
  await page.locator(".hide-scrollbar-business");
  const portalLocator = await page.locator("span.text-base");
  await portalLocator.filter({ hasText: portal }).click();
  const portalLocator2 = await page.locator("p.text-lg");
  await portalLocator2.filter({ hasText: portal2 }).click();
  await page.waitForTimeout(2000);
  await page.locator("a").filter({ hasText: "Expenses" }).click();
  await page.getByRole("link", { name: `${invoice}` }).click();
  await page.goForward();
  await page.waitForTimeout(2000);

  if (action === "Approve" && noCmt === true) {
    const stickyBottom = await page.locator("div.sticky.bottom-0");
    await stickyBottom.locator('button[aria-haspopup="menu"]').click();
    await page.locator('div[role="menu"] span.capitalize').click();
  } else if (action === "Reject" || (action === "Approve" && noCmt === false)) {
    await page.getByRole("button", { name: `${action}` }).click();
    await page.getByPlaceholder("Write a comment...").click();
    await page.getByPlaceholder("Write a comment...").fill(`${comment}`);
    await page.getByRole("button", { name: `${action}` }).click();
  }
  await page.waitForTimeout(1200);
}
