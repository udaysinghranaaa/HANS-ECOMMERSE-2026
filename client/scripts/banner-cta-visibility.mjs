import { chromium, devices } from 'playwright';

const BASE_URL = process.env.E2E_BASE_URL || 'http://localhost:5173';
const PRODUCT_ID = 'test-product-id-001';
const CATEGORY_ID = 'test-category-id-001';
const CATEGORY_SLUG = 'on-grid-solar-solutions';
const CUSTOM_URL = 'https://example.com/hans-solar-promo';

const mockBanners = [
  {
    id: 'banner-product',
    position: 1,
    title: 'Product Banner',
    imageUrl: 'https://via.placeholder.com/1200x600/16a34a/ffffff?text=Product+Banner',
    isActive: true,
    linkType: 'product',
    linkTargetId: PRODUCT_ID,
    linkUrl: null,
    linkHref: `/shop/product/${PRODUCT_ID}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'banner-category',
    position: 2,
    title: 'Category Banner',
    imageUrl: 'https://via.placeholder.com/1200x600/15803d/ffffff?text=Category+Banner',
    isActive: true,
    linkType: 'category',
    linkTargetId: CATEGORY_ID,
    linkUrl: null,
    linkHref: `/shop/${CATEGORY_SLUG}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'banner-url',
    position: 3,
    title: 'Custom Link Banner',
    imageUrl: 'https://via.placeholder.com/1200x600/166534/ffffff?text=Custom+Link+Banner',
    isActive: true,
    linkType: 'url',
    linkTargetId: null,
    linkUrl: CUSTOM_URL,
    linkHref: CUSTOM_URL,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

async function installMocks(page) {
  await page.route('**/api/v1/homepage/banners', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ success: true, data: { banners: mockBanners } }),
    });
  });

  await page.route('**/api/v1/catalog/categories**', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        success: true,
        data: {
          categories: [
            { id: CATEGORY_ID, name: 'On Grid Solar', slug: CATEGORY_SLUG, isActive: true },
          ],
        },
      }),
    });
  });

  await page.route('**/api/v1/**', async (route) => {
    if (route.request().url().includes('/homepage/banners') || route.request().url().includes('/catalog/categories')) {
      return;
    }
    await route.continue();
  });
}

async function assertCtaVisible(page, label, slideIndex) {
  if (slideIndex > 0) {
    await page.getByLabel(`Go to banner ${slideIndex + 1}`).click();
    await page.waitForTimeout(700);
  }

  const cta = page.locator('[data-banner-cta]').nth(slideIndex);
  await cta.waitFor({ state: 'visible', timeout: 10000 });

  const box = await cta.boundingBox();
  if (!box || box.width < 80 || box.height < 36) {
    throw new Error(`${label}: CTA bounding box too small ${JSON.stringify(box)}`);
  }

  const text = await cta.textContent();
  if (!text?.trim()) {
    throw new Error(`${label}: CTA has no text`);
  }

  const opacity = await cta.evaluate((el) => {
    const style = window.getComputedStyle(el);
    return { opacity: style.opacity, visibility: style.visibility, display: style.display, zIndex: style.zIndex };
  });

  if (opacity.visibility === 'hidden' || opacity.display === 'none' || Number(opacity.opacity) === 0) {
    throw new Error(`${label}: CTA hidden via CSS ${JSON.stringify(opacity)}`);
  }

  console.log(`${label}: PASS — "${text.trim()}" box=${Math.round(box.width)}x${Math.round(box.height)}`);
}

async function runViewport(name, viewport) {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage(viewport);
  await installMocks(page);

  await page.goto(BASE_URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForSelector('[aria-label="Homepage banner carousel"]', {
    timeout: 30000,
  });
  await page.waitForSelector('[data-banner-cta]', { timeout: 10000 });

  await assertCtaVisible(page, `${name} Product CTA`, 0);
  await assertCtaVisible(page, `${name} Category CTA`, 1);
  await assertCtaVisible(page, `${name} Custom Link CTA`, 2);

  await page.screenshot({ path: `banner-cta-${name.toLowerCase()}.png`, fullPage: false });
  await browser.close();
}

await runViewport('Desktop', { viewport: { width: 1280, height: 800 } });
await runViewport('Mobile', devices['iPhone 13']);

console.log('All CTA visibility checks passed.');
