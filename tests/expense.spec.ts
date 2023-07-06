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
