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

//Add value inside dialog box
export async function raiseExpenseDialog(page: Page, gst, cess, tds, tcs) {
  const dialogBox = page.getByRole("dialog");

  // const { value } = dialogData;

  await dialogBox.locator("div.form-control").first().click();
  await dialogBox.locator(`div[id$="-option-${gst}"]`).click();

  await dialogBox.getByRole("tab", { name: "CESS" }).click();
  // await page.locator("div.form-control input[type='number']").click();
  await dialogBox.getByPlaceholder("Enter Amount").fill(cess);

  await dialogBox.getByRole("tab", { name: "TDS" }).click();
  await dialogBox.locator("div.form-control .selectbox-container").click();
  await dialogBox.locator(`div[id$="-option-${tds}"]`).click();

  await dialogBox.getByRole("tab", { name: "TCS" }).click();
  // await page.locator("div.form-control input[type='number']").click();
  await dialogBox.getByPlaceholder("Enter Percentage").fill(tcs);
  await page.getByRole("button", { name: "Save" }).click();
}
// await dialogBox.getByRole("button", { name: "Save" }).click();

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
  await page.getByText("ExpensesExpenses").click();
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
