const { chromium } = require('playwright');
const { expect } = require('@playwright/test');

async function recharge(stbNumber) {

  const browser = await chromium.launch({
    headless: true
  });

  const page = await browser.newPage();

  try {

    // Open application
    await page.goto('https://lcoportalnew5.nxtdigital.in/');

    // Login
    await page.getByRole('textbox', { name: 'User Name' })
      .fill('LCO200016068.01');

    await page.getByRole('textbox', { name: 'PASSWORD' })
      .fill('Laxman126@');

    await page.getByRole('button', { name: 'LOGIN' }).click();

    // Wait for login to complete
    await page.waitForLoadState('networkidle');

    // Navigate to Renew page
    await page.goto('https://lcoportalnew5.nxtdigital.in/lcoportal/product/renew');

    // Search customer
    await page.getByRole('textbox', {
      name: 'Enter Customer Id / Serial'
    }).fill(stbNumber);

    await page.getByRole('button', { name: 'SEARCH' }).click();

    // Wait for search results
    await page.locator('.checkmark').first().waitFor({
      state: 'visible',
      timeout: 60000
    });

    // Give UI time to enable checkout
    await page.waitForTimeout(6000);

    await page.locator('.checkmark').first().click();

    // Debug information
    const buttons = await page.locator('button').allTextContents();
    console.log('Buttons on page:', buttons);

    // Take screenshot
    await page.screenshot({
      path: 'before-checkout.png',
      fullPage: true
    });

    // Locate checkout button
    const checkoutBtn = page.getByRole('button', {
      name: /checkout/i
    });

    // Verify button exists
    await expect(checkoutBtn).toBeVisible({
      timeout: 30000
    });

    // Click checkout
    await checkoutBtn.click();

    // Wait for Subscribe button
    const subscribeBtn = page.getByRole('button', {
      name: /subscribe/i
    });

    await expect(subscribeBtn).toBeVisible({
      timeout: 30000
    });

    // Click Subscribe
    await subscribeBtn.click();

    // Optional success validation
    await page.waitForTimeout(5000);

    // Capture final screenshot
    await page.screenshot({
      path: 'after-subscribe.png',
      fullPage: true
    });

    // Adjust success text according to actual application message
    await expect(
      page.locator('text=/success|subscribed|renewed/i')
    ).toBeVisible({
      timeout: 30000
    });

    console.log("success");

    return {
      success: true,
      stbNumber
    };

  } catch (error) {

    console.error(error);

    return {
      success: false,
      error: error.message
    };

  } finally {

    await browser.close();

  }
}

module.exports = recharge;