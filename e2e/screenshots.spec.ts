import { test, expect } from '@playwright/test';

const pages = [
  '/',
  '/auth',
  '/bodega',
  '/dashboard',
  '/map',
  '/promo',
  '/settings',
  '/wallet',
];

for (const page of pages) {
  test(`Screenshot for ${page}`, async ({ page: playwrightPage }) => {
    await playwrightPage.goto(`http://localhost:5000${page}`);
    await playwrightPage.waitForTimeout(1000); // Wait for animations
    const screenshotPath = `/tmp/screenshots${page.replace('/', '_') || '_index'}.png`;
    await playwrightPage.screenshot({ path: screenshotPath });
    console.log(`Screenshot saved to ${screenshotPath}`);
  });
}
