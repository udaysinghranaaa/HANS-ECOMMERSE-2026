import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
const errors = [];

page.on('console', (msg) => {
  if (msg.type() === 'error') {
    errors.push(msg.text());
  }
});

await page.goto('http://localhost:5173/', {
  waitUntil: 'domcontentloaded',
  timeout: 60000,
});
await page.waitForSelector('[aria-label="Homepage banner carousel"]', {
  timeout: 15000,
});

const navCount = await page.locator('[data-banner-nav]').count();
console.log('Live banner nav links (linked banners):', navCount);
console.log('Console errors:', errors.length ? errors.join(' | ') : 'none');

await browser.close();
