/**
 * Banner E2E verification — mocks banner API so tests run without DB changes.
 * Run: node scripts/banner-e2e.mjs
 */
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

const mockCategories = {
  success: true,
  data: {
    categories: [
      {
        id: CATEGORY_ID,
        name: 'On Grid Solar',
        slug: CATEGORY_SLUG,
        description: '',
        image: '',
        isActive: true,
      },
    ],
  },
};

const mockProduct = {
  success: true,
  data: {
    product: {
      id: PRODUCT_ID,
      name: 'Test Solar Product',
      description: 'E2E test product',
      images: ['https://via.placeholder.com/400'],
      stock: 5,
      category: { id: CATEGORY_ID, name: 'On Grid Solar', slug: CATEGORY_SLUG },
      specifications: {},
    },
    relatedProducts: [],
  },
};

const results = {};

const pass = (key) => {
  results[key] = 'PASS';
};

const fail = (key, reason) => {
  results[key] = `FAIL (${reason})`;
};

async function installMocks(page) {
  await page.route('**/api/v1/homepage/banners', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ success: true, data: { banners: mockBanners } }),
    });
  });

  await page.route('**/api/v1/catalog/categories', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(mockCategories),
    });
  });

  await page.route(`**/api/v1/catalog/products/${PRODUCT_ID}`, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(mockProduct),
    });
  });

  await page.route('**/api/v1/catalog/products', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ success: true, data: { products: [] } }),
    });
  });

  await page.route('**/api/v1/site-media**', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ success: true, data: { logo: '/logo.jpg' } }),
    });
  });

  await page.route('**/api/v1/festival/**', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ success: true, data: null }),
    });
  });
}

async function goHome(page) {
  await page.goto(BASE_URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForSelector('[aria-label="Homepage banner carousel"]', {
    timeout: 30000,
  });
}

async function getBannerLinkAtIndex(page, index) {
  return page.locator('[data-banner-nav]').nth(index);
}

async function testProductBanner(page, label) {
  const link = await getBannerLinkAtIndex(page, 0);
  const href = await link.getAttribute('href');
  if (href !== `/shop/product/${PRODUCT_ID}`) {
    fail(`${label} Product Banner`, `expected product href, got ${href}`);
    return;
  }
  pass(`${label} Product Banner`);

  const ctaText = await link.locator('span.truncate').first().textContent();
  if (!ctaText?.includes('View Details')) {
    fail(`${label} Banner CTA`, `expected View Details, got ${ctaText}`);
  } else {
    pass(`${label} Banner CTA`);
  }

  await link.click();
  await page.waitForURL(`**/shop/product/${PRODUCT_ID}`);
  pass(`${label} Banner direct click`);

  const scrollY = await page.evaluate(() => window.scrollY);
  if (scrollY > 40) {
    fail(`${label} Product page opens at top`, `scrollY=${scrollY}`);
  } else {
    pass(`${label} Product page opens at top`);
  }
}

async function testCategoryBanner(page, label) {
  await goHome(page);
  await page.getByLabel('Go to banner 2').click();
  await page.waitForTimeout(900);

  const link = await getBannerLinkAtIndex(page, 1);
  const href = await link.getAttribute('href');
  if (href !== `/shop/${CATEGORY_SLUG}`) {
    fail(`${label} Category Banner`, `expected category href, got ${href}`);
    return;
  }
  pass(`${label} Category Banner`);

  await link.click();
  await page.waitForURL(`**/shop/${CATEGORY_SLUG}`);
  pass(`${label} Category Banner direct click`);

  const scrollY = await page.evaluate(() => window.scrollY);
  if (scrollY > 40) {
    fail(`${label} Category page opens at top`, `scrollY=${scrollY}`);
  } else {
    pass(`${label} Category page opens at top`);
  }
}

async function testCustomLinkBanner(page, label) {
  await goHome(page);
  await page.getByLabel('Go to banner 3').click();
  await page.waitForTimeout(900);

  const link = await getBannerLinkAtIndex(page, 2);
  const href = await link.getAttribute('href');
  if (href !== CUSTOM_URL) {
    fail(`${label} Custom Link Banner`, `expected ${CUSTOM_URL}, got ${href}`);
    return;
  }
  pass(`${label} Custom Link Banner`);

  const target = await link.getAttribute('target');
  if (target !== '_blank') {
    fail(`${label} Custom Link Banner`, 'external link should open in new tab');
  }

  const ctaText = await link.locator('span.truncate').first().textContent();
  if (!ctaText?.includes('Learn More')) {
    fail(`${label} Custom Link CTA`, `expected Learn More, got ${ctaText}`);
  }
}

async function testConsoleErrors(page, label) {
  const errors = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      errors.push(msg.text());
    }
  });
  await goHome(page);
  await page.waitForTimeout(1000);
  if (errors.length > 0) {
    fail(`${label} Console`, errors.join('; '));
  }
}

async function runViewport(deviceName, viewport) {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext(viewport);
  const page = await context.newPage();
  await installMocks(page);

  const label = deviceName;
  try {
    await goHome(page);
    await testProductBanner(page, label);
    await testCategoryBanner(page, label);
    await testCustomLinkBanner(page, label);
    pass(`${label} viewport`);
  } catch (error) {
    fail(`${label} viewport`, error.message);
  }

  await browser.close();
}

async function main() {
  console.log(`Testing banners at ${BASE_URL}`);

  try {
    await runViewport('Desktop', { viewport: { width: 1280, height: 800 } });
    await runViewport('Mobile', devices['iPhone 13']);
  } catch (error) {
    console.error('Playwright run failed:', error.message);
    results['Runner'] = `FAIL (${error.message})`;
  }

  const report = {
    'Product Banner': results['Desktop Product Banner'] === 'PASS' && results['Mobile Product Banner'] === 'PASS' ? 'PASS' : 'FAIL',
    'Category Banner': results['Desktop Category Banner'] === 'PASS' && results['Mobile Category Banner'] === 'PASS' ? 'PASS' : 'FAIL',
    'Custom Link Banner': results['Desktop Custom Link Banner'] === 'PASS' && results['Mobile Custom Link Banner'] === 'PASS' ? 'PASS' : 'FAIL',
    Mobile: results['Mobile viewport'] || 'FAIL',
    Desktop: results['Desktop viewport'] || 'FAIL',
    'Banner CTA': results['Desktop Banner CTA'] === 'PASS' && results['Mobile Banner CTA'] === 'PASS' ? 'PASS' : 'FAIL',
    'Banner direct click': results['Desktop Banner direct click'] === 'PASS' && results['Mobile Banner direct click'] === 'PASS' ? 'PASS' : 'FAIL',
    'Product page opens at top': results['Desktop Product page opens at top'] === 'PASS' && results['Mobile Product page opens at top'] === 'PASS' ? 'PASS' : 'FAIL',
  };

  console.log('\nDetailed results:');
  console.log(JSON.stringify(results, null, 2));
  console.log('\n=== TEST REPORT ===');
  Object.entries(report).forEach(([key, value]) => {
    console.log(`${key}: ${value}`);
  });

  const hasFail = Object.values(report).some((value) => value.startsWith('FAIL'));
  process.exit(hasFail ? 1 : 0);
}

main();
