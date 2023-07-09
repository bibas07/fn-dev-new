import { test, expect, Page } from "@playwright/test";
import { finOpsLogin } from "./auth/finopsSignin";
import {
  expenseApproval,
  fileUpload,
  raiseExpenseDialog,
  raiseExpenseForm,
  // selectField,
  signIn,
} from "./auth/formHandle";
import { toastMessage } from "./auth/errorHandle";
test.describe.configure({ mode: "serial" });

let page: Page;

test.beforeAll(async ({ browser }) => {
  page = await browser.newPage();
});

test.afterAll(async () => {
  await page.close();
});
test.describe("Raise Expense Flows", () => {
  let verifier;
  test("FinOps Raise Expense Creation", async () => {
    const fileNames = "invoice.png"; // Pass the file name as an array

    await test.step("FinOps Login Portal", async () => {
      await finOpsLogin(page);
      await page.goForward();
    });

    await test.step("Single File uploads", async () => {
      await page
        .getByRole("button", { name: "add_circle_outline Raise Expense" })
        .click();
      await page.goForward();
      await page.getByRole("button", { name: "Select File" }).click();
      await fileUpload(page, fileNames);
    });

    //Checking Table View
    await test.step("Multiple File uploads", async () => {
      await page
        .locator("div")
        .filter({ hasText: /^Documents\+ Upload Document$/ })
        .getByRole("button")
        .nth(1)
        .click();
      await fileUpload(page, fileNames);
    });

    await test.step("Table nav Test", async () => {
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
    });

    await test.step("Zoom Indicator Test", async () => {
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
    });

    await test.step("Download nav Test", async () => {
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
  });

  //Raise Expenses

  test("FinOps Raise Expense Right Side Form", async () => {
    const fileNames = "invoice.png"; // Pass this file name as an array
    await await test.step("Login to FinOps Portal", async () => {
      await finOpsLogin(page);
      await page.goForward();
    });

    await test.step("Login to Raise Expense Page", async () => {
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
    });

    await test.step("Add Client and Vendor", async () => {
      await page
        .getByRole("button", { name: "add_circle_outline Add Client" })
        .click();

      await page.waitForSelector("div[role='dialog']");
      await page
        .locator("div.gap-2.overflow-y-auto.col-flex div.col-flex")
        .nth(2)
        .click();

      await page
        .getByRole("button", { name: "add_circle_outline Select Vendor" })
        .click();
      await page.waitForSelector("div[role='dialog']");
      await page
        .locator("div.gap-2.overflow-y-auto.col-flex div.col-flex")
        .nth(3)
        .click();
    });

    // Required data to raise Expenses

    await test.step("Filling Form Details", async () => {
      const FormFields = [
        {
          selector: "Invoice Number",
          value: "Inv" + Math.random(),
        },
        {
          selector: "Total Amount",
          value: (Math.random() * 10000).toString(),
        },
        {
          selector: "Taxable Amount",
          value: (Math.random() * 1000).toString(),
        },
        {
          selector: "Enter Description",
          value: Math.random().toString(36).substring(2, 70),
        },
      ];

      //Raise expenses
      await raiseExpenseForm(page, FormFields);
      await page.getByPlaceholder("Invoice Date").click(); // Calender - This might not choose automatic

      //Adding values on details
      const selectData = [
        {
          title: "Department",
        },
        {
          title: "Expense Head",
        },
        {
          title: "POC Email",
        },
        {
          title: "Pay To",
        },
        {
          title: "City",
        },
      ];

      for (const data of selectData) {
        const { title } = data;
        await page
          .locator(`div.text-sm:has-text("${title}") ~ div.form-control`)
          .click();

        await page.waitForSelector(".selectbox-container [class$='-menu']", {
          state: "attached",
        });

        await page.locator(`div[id$="-option-0"]`).click();

        if (title === "POC Email") {
          await page
            .locator(`div.text-sm:has-text("${title}") ~ div.form-control`)
            .click();

          await page.waitForSelector(".selectbox-container [class$='-menu']", {
            state: "attached",
          });

          const pocEmailLocator = page.locator(`div[id$="-option-0"]`);
          verifier = await pocEmailLocator.textContent();
          pocEmailLocator.click();
          console.log(" Inside : " + verifier);
          // verifier = pocEmail ? pocEmail : "NULL";
          // pocEmailLocator.click();

          // break;
        }
      }
      console.log(" Outside of Test: " + verifier);
    });

    await test.step("Dialog Forms", async () => {
      await page
        .getByRole("button", { name: "add_circle_outline Add Taxes" })
        .click();

      //adding value on dialog
      //Data to set in dialog (not used in this case)
      // const dialogData = [
      //   // {
      //   //   title: "GST",
      //   // },
      //   {
      //     title: "CESS",
      //   },
      //   {
      //     title: "TDS",
      //   },
      //   {
      //     title: "TCS",
      //   },
      // ];

      await raiseExpenseDialog(page);
      await page.pause();
      expect(page.getByText("Edit Taxes")).toBeTruthy();
    });
    await test.step("Save dara", async () => {
      await page.getByRole("button", { name: "Save" }).click();
      await page.waitForTimeout(2000);
    });
  });

  // Approve and Reject of expense by PoC/Approver
  test("Approve and Reject by PoC", async () => {
    await page.goto("https://fn-new-web.vercel.app/login");
    console.log("POC Email: ", verifier);
    await signIn(page, verifier, "123456");
    await page.getByRole("button", { name: "Next" }).click();
    await page.waitForTimeout(1200);

    //true for approve without comment and false for with comments
    await expenseApproval(
      page,
      "BD Test",
      "FinOps Portal",
      "EXPVN144",
      "Reject",
      "good fine",
      false // Does not work if approver Rejected
    );
  });
  test("Expenses Side Menu", async () => {
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
});
