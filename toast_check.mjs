import { chromium } from 'file:///C:/Users/asus1/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });
await page.goto('http://localhost:5174/todo');
await page.waitForTimeout(2000);
await page.click('text=Add Task');
await page.fill('input[name="title"]', 'Toast style check');
await page.click('button:has-text("Save Task")');
await page.waitForTimeout(600);
await page.screenshot({ path: 'toast_light.png' });

// toggle dark mode
await page.click('button[aria-label], svg', { timeout: 1000 }).catch(() => {});
