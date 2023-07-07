import { test, expect } from "@playwright/test";
import { finOpsLogin } from "./auth/finopsSignin";
import {
  expenseApproval,
  fileUpload,
  raiseExpenseDialog,
  raiseExpenseForm,
  selectField,
  signIn,
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

  // Required data to raise Expenses
  const FormFields = [
    {
      selector: "Invoice Number",
      value: "Inv" + Math.random(),
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

  //Raise expenses
  await raiseExpenseForm(page, FormFields);
  await page.getByPlaceholder("Invoice Date").click(); // Calender - This might not choose automatic

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
      value: "2",
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

  //Data to set in dialog
  const gst = "1";
  const cess = "500";
  const tds = "1";
  const tcs = "10";

  await selectField(page, selectData);
  await page
    .getByRole("button", { name: "add_circle_outline Add Taxes" })
    .click();
  await raiseExpenseDialog(page, gst, cess, tds, tcs);

  expect(page.getByText("Edit Taxes")).toBeTruthy();

  await page.getByRole("button", { name: "Save" }).click();
  await page.waitForTimeout(2000);
});

// Approve and Reject of expense by PoC/Approver
test("Approve and Reject by PoC", async ({ page }) => {
  await page.goto("https://fn-new-web.vercel.app/login");
  await signIn(page, "abhishek@drivezy.com", "123456");
  await page.getByRole("button", { name: "Next" }).click();
  await page.waitForTimeout(1200);

  //true for approve without comment and false for with comments
  await expenseApproval(
    page,
    "BD Test",
    "FinOps Portal",
    "EXPVN132",
    "Approve",
    "good fine",
    false // Does not work if approver Rejected
  );
});
test("Expenses Side Menu", async ({ page }) => {
  await page.goto("https://fn-new-web.vercel.app/e/f/expenses");
  await page.waitForTimeout(1200);
  await page.getByText("ExpensesExpenses").click();
  await page.getByRole("link", { name: "EXPVN96" }).click();
  await page
    .getByText("Expense Details #EXPVN96HomeExpensesExpense DetailsActions")
    .click();
  await page.getByText("#EXPVN96").click();
  await page.getByRole("button").nth(3).click();
  await page.getByRole("button", { name: "Save" }).click();
  await page.getByPlaceholder("Search...").click();
  await page.getByRole("button", { name: "Actions" }).click();

  await page.getByPlaceholder("Search...").fill("");
  await page.getByRole("menuitem", { name: "Add Documents" }).click();
  await page.getByRole("button", { name: "Select File" }).click();
  await page.getByPlaceholder("Document Message").click();
  await page.getByPlaceholder("Document Message").fill("adding comments");
  await page.getByRole("button", { name: "Submit" }).click();
  await page.getByRole("tab", { name: "Documents" }).click();
  await page
    .getByRole("tabpanel", { name: "Documents" })
    .getByRole("button")
    .nth(1)
    .click();
  await page.getByRole("tabpanel", { name: "Documents" }).click();
  await page.getByRole("heading", { name: "adding comments" }).click();
  await page
    .getByRole("tabpanel", { name: "Documents" })
    .getByRole("button")
    .nth(3)
    .click();
  await page.getByRole("button", { name: "No" }).click();
  await page
    .getByRole("tabpanel", { name: "Documents" })
    .getByRole("button")
    .nth(1)
    .click();
  await page
    .getByRole("tabpanel", { name: "Documents" })
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
});
