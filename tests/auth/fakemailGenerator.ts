export async function emailGenerator(page: any) {
  await page.goto("https://generator.email/");

  await page.waitForSelector("div.e7m.coserch");

  const userNamelocator = await page.locator('input[id="userName"]');
  const domainNameLocator = await page.locator('input[id="domainName2"]');

  const userNameHandle = await userNamelocator.evaluateHandle((el) => el.value);
  const domainNameHandle = await domainNameLocator.evaluateHandle(
    (el) => el.value
  );

  const userNameText = await userNameHandle.jsonValue();
  const domainNameText = await domainNameHandle.jsonValue();

  const email = `${userNameText}@${domainNameText}`;

  return { email };
}
