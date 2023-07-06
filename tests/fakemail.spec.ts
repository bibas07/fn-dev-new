import { test, expect } from "@playwright/test";
import { emailGenerator } from "./auth/fakemailGenerator";

test("Fake Email generator", async ({ page }) => {
  const emailName = await emailGenerator(page);
  console.log(emailName.randomEmail);
});
