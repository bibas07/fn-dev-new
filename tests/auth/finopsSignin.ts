const { chromium } = require("playwright");

export async function finOpsLogin(page) {
  await page.goto("https://fn-new-web.vercel.app/login");
  await page.getByPlaceholder("Enter your email address").click();
  await page
    .getByPlaceholder("Enter your email address")
    .fill("hemantanshu@gmail.com");
  await page.getByPlaceholder("Enter your email address").press("Tab");
  await page.getByPlaceholder("Password").fill("123456");
  await page.getByRole("button", { name: "Next →" }).click();
  await page
    .locator("div")
    .filter({ hasText: /^BD Test$/ })
    .first()
    .click();
  await page
    .locator("div")
    .filter({
      hasText: /^FinOps PortalManage expenses , reimbursements & finance$/,
    })
    .nth(1)
    .click();
}
