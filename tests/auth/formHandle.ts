import { test, expect } from "@playwright/test";
import { alertMessage } from "./errorHandle";

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

export async function selectField(page, selectData) {
  for (const data of selectData) {
    const { title, value } = data;
    for (let i = 3; i < 7; i++) {
      const selectElement = await page.locator(
        `div.text-sm:has-text("${title}") .selectbox-control`
      );
      const container = await page.locator(`div.selectbox-container `, {
        has: selectElement,
      });
      await selectElement.click();
      console.log(container);
      await container.waitForSelector(".selectbox-menuportal");

      await container.locator(`div#react-select-${i}-option-${value}`).click();
    }

    // try {
    //   if ((await title) === "Department") {
    //     const selectElement = await page.$(
    //       `div.text-sm:has-text("${title}") div.selectbox-control input[type="text"]`
    //     );
    //     await selectElement.click();

    //     const optionElement = await page.locator(
    //       `#react-select-3-option-${value}`
    //     );
    //     await optionElement.click();
    //   }
    //   if ((await title) === "Expense Head") {
    //     const selectElement = await page.locator(
    //       `div.text-sm:has-text("${title}") div.selectbox-control input[type="text"]`
    //     );
    //     await selectElement.click();

    //     const optionElement = await page.locator(
    //       `#react-select-4-option-${value}`
    //     );
    //     await optionElement.click();
    //   }
    //   if ((await title) === "POC Email") {
    //     const selectElement = await page.locator(
    //       `div.text-sm:has-text("${title}") div.selectbox-control input[type="text"]`
    //     );
    //     await selectElement.click();

    //     const optionElement = await page.locator(
    //       `#react-select-5-option-${value}`
    //     );
    //     await optionElement.click();
    //   }
    //   if (title === "Pay To") {
    //     await page.waitForTimeout(1000);
    //     const selectElement = await page.locator(
    //       `div.text-sm:has-text("${title}") div.selectbox-control input[type="text"]`
    //     );
    //     await selectElement.click();

    //     const optionElement = await page.locator(
    //       `#react-select-6-option-${value}`
    //     );
    //     await optionElement.click();
    //   }
    //   if (title === "City") {
    //     const selectElement = await page.locator(
    //       `div.text-sm:has-text("${title}") div.selectbox-control input[type="text"]`
    //     );
    //     await selectElement.click();

    //     const optionElement = await page.locator(
    //       `#react-select-7-option-${value}`
    //     );
    //     await optionElement.click();
    //   }
    // } catch (error) {
    //   console.log("Error occured", error);
    // }
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
