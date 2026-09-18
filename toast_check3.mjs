import { chromium } from 'file:///C:/Users/asus1/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });
await page.goto('http://localhost:5174/todo');
await page.waitForTimeout(2000);

await page.locator('button[aria-label="Delete task"]').first().click();
await page.waitForSelector('div[role="dialog"]', { state: 'visible' });
await page.waitForTimeout(400);
await page.locator('div[role="dialog"] button:has-text("Delete")').click();
await page.waitForTimeout(500);
await page.screenshot({ path: 'toast_light.png' });
await browser.close();
