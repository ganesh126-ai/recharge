const { chromium } = require('playwright');

async function recharge(stbNumber) {
  const browser = await chromium.launch({
    headless: true
  });

  const page = await browser.newPage();

  try {
    await page.goto('https://lcoportalnew5.nxtdigital.in/');

    await page.getByRole('textbox', { name: 'User Name' })
      .fill(process.env.LCO_USERNAME);

    await page.getByRole('textbox', { name: 'PASSWORD' })
      .fill(process.env.LCO_PASSWORD);

    await page.getByRole('button', { name: 'LOGIN' }).click();

    await page.waitForLoadState('networkidle');

    await page.goto(
      'https://lcoportalnew5.nxtdigital.in/lcoportal/product/renew'
    );

    await page.getByRole('textbox', {
      name: 'Enter Customer Id / Serial'
    }).fill(stbNumber);

    await page.getByRole('button', {
      name: 'SEARCH'
    }).click();

    await page.locator('.checkmark').first().waitFor({
      state: 'visible',
      timeout: 60000
    });

    await page.waitForTimeout(6000);

    await page.locator('.checkmark').first().click();

    const checkoutBtn = page.getByRole('button', {
      name: /checkout/i
    });

    await checkoutBtn.waitFor({
      state: 'visible',
      timeout: 30000
    });

    await checkoutBtn.click();

    const subscribeBtn = page.getByRole('button', {
      name: /subscribe/i
    });

    await subscribeBtn.waitFor({
      state: 'visible',
      timeout: 30000
    });

    await subscribeBtn.click();

    await page.waitForTimeout(5000);

    return {
      success: true,
      stbNumber
    };

  } catch (err) {

    return {
      success: false,
      error: err.message
    };

  } finally {

    await browser.close();

  }
}

module.exports = recharge;