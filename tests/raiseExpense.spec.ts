import { test, expect } from "@playwright/test";
import { finOpsLogin } from "./auth/finopsSignin";
import {
  fileUpload,
  raiseExpenseDialog,
  raiseExpenseForm,
  selectField,
} from "./auth/formHandle";
import { toastMessage } from "./auth/errorHandle";
const { chromium } = require("playwright");
let browser;
let context;

test.beforeAll(async () => {
  browser = await chromium.launch({
    headless: false,
  });
  context = await browser.newContext();
});

test.afterAll(async () => {
  await context.close();
  await browser.close();
});

test("FinOps Raise Expense Creation", async ({ page }) => {
  const fileNames = "invoice.png"; // Pass the file name as an array

  await finOpsLogin(page);
  await page.goForward();

  await page
    .getByRole("button", { name: "add_circle_outline Raise Expense" })
    .click();
  await page.goForward();
  await page.getByRole("button", { name: "Select File" }).click();
  await fileUpload(page, fileNames);

  //Checking Table View
  await page
    .locator("div")
    .filter({ hasText: /^Documents\+ Upload Document$/ })
    .getByRole("button")
    .nth(1)
    .click();
  await fileUpload(page, fileNames);
  expect(
    page
      .locator("div")
      .filter({
        hasText:
          /^No comments Added wxxkte_invoice\.pngAdded At : 05 Jul, 2023 02:04 PM$/,
      })
      .nth(3)
  ).toBeTruthy();

  const download2Promise = page.waitForEvent("download");
  await page.locator(".opacity-0 > .flex > .btn").click();
  const download2 = await download2Promise;
  await page
    .locator("div")
    .filter({ hasText: /^Documents\+ Upload Document$/ })
    .getByRole("button")
    .nth(1)
    .click();

  //Checking Zoom Indicator

  await page
    .locator("div")
    .filter({ hasText: /^Documents\+ Upload Document$/ })
    .getByRole("button")
    .nth(2)
    .click();
  await page.getByRole("slider").click();
  await page.getByRole("slider").click();
  await page
    .locator("div")
    .filter({ hasText: /^Zoom:$/ })
    .click();
  await page.getByRole("slider").click();

  //Checking Download

  const download3Promise = page.waitForEvent("download");
  await page
    .locator("div")
    .filter({ hasText: /^Documents\+ Upload Document$/ })
    .getByRole("button")
    .nth(3)
    .click();
  const download3 = await download3Promise;
});

test("FinOps Raise Expense Right Form", async ({ page }) => {
  const fileNames = "invoice.png"; // Pass this file name as an array

  await finOpsLogin(page);
  await page.goForward();

  await page
    .getByRole("button", { name: "add_circle_outline Raise Expense" })
    .click();
  await page.getByRole("button", { name: "Select File" }).click();

  await fileUpload(page, fileNames);
  await page.goForward();
  await page.getByText("Reimbursement").click();
  await page.getByText("Vendor Expense").click();
  await page
    .getByRole("button", { name: "add_circle_outline Add Client" })
    .click();
  await page.getByText("Raise ExpenseHomeRaise Expense").click();
  await page
    .locator("div")
    .filter({ hasText: /^Select Expense Head$/ })
    .first()
    .click();
  await page
    .locator("div")
    .filter({ hasText: /^Select Expense Head$/ })
    .first()
    .click();
  await page.locator(".css-1lx7dxn").click();
  await page.getByText("Mumbai", { exact: true }).click();
  await page.getByText("arrow_back_ios_new").click();
  await page.getByText("arrow_back_ios_new").click();
  await page
    .getByRole("button", { name: "add_circle_outline Add Client" })
    .click();
  await page
    .getByText("Drivezy India Travels Private Limited29AAFCD9166L1ZY KA")
    .click();
  await page
    .getByRole("button", { name: "add_circle_outline Select Vendor" })
    .click();
  await page
    .getByText("365 Facility Management Private LimitedVendor Managed")
    .click();
  const FormFields = [
    {
      selector: "Invoice Number",
      value: "Inv211092",
    },
    {
      selector: "Total Amount",
      value: "100000",
    },
    {
      selector: "Taxable Amount",
      value: "1000",
    },
    {
      selector: "Enter Description",
      value: "Testing123",
    },
  ];
  await raiseExpenseForm(page, FormFields);
  // await page.getByPlaceholder("Invoice Date").click();
  // await page.waitForTimeout(3000);

  const selectData = [
    {
      title: "Department",
      value: "3",
    },
    {
      title: "Expense Head",
      value: "4",
    },
    {
      title: "POC Email",
      value: "Abhishel Mahajan",
    },
    {
      title: "Pay To",
      value: "0",
    },
    {
      title: "City",
      value: "1",
    },
  ];
  await selectField(page, selectData);
  await page
    .getByRole("button", { name: "add_circle_outline Add Taxes" })
    .click();

  const dialogBox = page.getByRole("dialog");
  await dialogBox.locator("div").filter({ hasText: /^5%$/ }).nth(3).click();
  await dialogBox.getByText("12%", { exact: true }).click();
  await dialogBox
    .getByRole("button", { name: "add_circle_outline Add GST Field" })
    .click();
  await page.getByText("Select...").click();
  await page.getByRole("tab", { name: "CESS" }).click();

  await page.getByText("GSTCESSTDSTCS").click();
  await page
    .locator(
      ".gap-2 > .form-control > .text-sm > .selectbox-control > .css-1gzzqje > .css-1lx7dxn"
    )
    .click();
  await page.getByText("Commission / Brokerage").click();
  await page.getByPlaceholder("Enter Amount").click();
  await page.getByPlaceholder("Enter Amount").fill("2225");
  await page.getByRole("tab", { name: "TCS" }).click();
  await page.getByPlaceholder("Enter Percentage").click();
  await page.getByPlaceholder("Enter Percentage").fill("20");
  await page.getByPlaceholder("Enter Amount").click();
  await page.getByPlaceholder("Enter Amount").fill("32224");
  await page.getByRole("button", { name: "Save" }).click();
  await page
    .locator(
      ".rah-static > div > .gap-3 > .items-center > .form-control > .text-sm > .selectbox-control > .css-1gzzqje > .css-1lx7dxn"
    )
    .click();
  await page.getByText("Bengaluru", { exact: true }).click();

  await page.getByRole("button", { name: "Save" }).click();
  await page.goForward();
  await page.waitForTimeout(2000);
});

test("Expenses Side Menu", async ({ page }) => {
  await page.goto("https://fn-new-web.vercel.app/e/f/expenses");
  await page.waitForTimeout(1200);
});

// const fileNames = "invoice.png"; // Pass the file name as an array

// await finOpsLogin(page);
// await page.goForward();

// await page
//   .getByRole("button", { name: "add_circle_outline Raise Expense" })
//   .click();
// await page.getByRole("button", { name: "Select File" }).click();

// await fileUpload(page, fileNames);
// await page.goForward();
// await page.getByText("Reimbursement").click();
// await page.getByText("Vendor Expense").click();
// await page
//   .getByRole("button", { name: "add_circle_outline Add Client" })
//   .click();
// await page.getByText("Raise ExpenseHomeRaise Expense").click();
// await page
//   .locator("div")
//   .filter({ hasText: /^Select Expense Head$/ })
//   .first()
//   .click();
// await page
//   .locator("div")
//   .filter({ hasText: /^Select Expense Head$/ })
//   .first()
//   .click();
// await page.locator(".css-1lx7dxn").click();
// await page.getByText("Mumbai", { exact: true }).click();
// await page.getByText("arrow_back_ios_new").click();
// await page.getByText("arrow_back_ios_new").click();
// await page
//   .getByRole("button", { name: "add_circle_outline Add Client" })
//   .click();
// await page
//   .getByText("Drivezy India Travels Private Limited29AAFCD9166L1ZY KA")
//   .click();
// await page
//   .getByRole("button", { name: "add_circle_outline Select Vendor" })
//   .click();
// await page
//   .getByText("365 Facility Management Private LimitedVendor Managed")
//   .click();
// await page.getByPlaceholder("Invoice Number").click();
// await page.getByPlaceholder("Invoice Number").fill("inv123344");
// await page.getByPlaceholder("Invoice Date").click();

// await page.getByPlaceholder("Total Amount").click();
// await page.getByPlaceholder("Total Amount").fill("12000");
// await page.getByPlaceholder("Taxable Amount").click();
// await page.getByPlaceholder("Taxable Amount").fill("500");
// await page.locator(".css-1lx7dxn").first().click();
// await page.getByText("Marketing", { exact: true }).click();
// await page
//   .locator(
//     "div:nth-child(6) > .form-control > .text-sm > .selectbox-control > .css-1gzzqje > .css-1lx7dxn"
//   )
//   .click();
// await page
//   .locator("#react-select-4-option-6")
//   .getByText("Expense Head")
//   .click();
// await page
//   .locator(
//     "div:nth-child(7) > .form-control > .text-sm > .selectbox-control > .css-1gzzqje > .css-1lx7dxn"
//   )
//   .click();
// await page.getByText("Abhishek Mahajanabhishek@drivezy.com").click();
// await page.getByText("Vendor", { exact: true }).click();
// await page.locator("#react-select-6-option-0").getByText("Vendor").click();
// await page.getByText("Vendor", { exact: true }).click();
// await page.locator("#react-select-6-option-1").click();
// await page.getByText("Employee", { exact: true }).first().click();
// await page.getByText("Vendor", { exact: true }).click();
// await page
//   .getByRole("button", { name: "add_circle_outline Add Taxes" })
//   .click();

// const dialogBox = await page.getByRole("dialog");
// await dialogBox.locator("div").filter({ hasText: /^5%$/ }).nth(3).click();
// await dialogBox.getByText("12%", { exact: true }).click();
// await dialogBox
//   .getByRole("button", { name: "add_circle_outline Add GST Field" })
//   .click();
// await page.getByText("Select...").click();
// await page.getByRole("tab", { name: "CESS" }).click();
// await page.getByPlaceholder("Enter Amount").click();
// await page.getByPlaceholder("Enter Amount").fill("2000");
// await page.getByText("GSTCESSTDSTCS").click();
// await page
//   .locator(
//     ".gap-2 > .form-control > .text-sm > .selectbox-control > .css-1gzzqje > .css-1lx7dxn"
//   )
//   .click();
// await page.getByText("Commission / Brokerage").click();
// await page.getByPlaceholder("Enter Amount").click();
// await page.getByPlaceholder("Enter Amount").fill("2225");
// await page.getByRole("tab", { name: "TCS" }).click();
// await page.getByPlaceholder("Enter Percentage").click();
// await page.getByPlaceholder("Enter Percentage").fill("20");
// await page.getByPlaceholder("Enter Amount").click();
// await page.getByPlaceholder("Enter Amount").fill("32224");
// await page.getByRole("button", { name: "Save" }).click();
// await page
//   .locator(
//     ".rah-static > div > .gap-3 > .items-center > .form-control > .text-sm > .selectbox-control > .css-1gzzqje > .css-1lx7dxn"
//   )
//   .click();
// await page.getByText("Bengaluru", { exact: true }).click();

// await page.getByPlaceholder("Enter Description").click();
// await page.getByPlaceholder("Enter Description").fill("Testing1234");

// await page.getByRole("button", { name: "Save" }).click();
// await page.goForward();
// await page.waitForTimeout(2000);
