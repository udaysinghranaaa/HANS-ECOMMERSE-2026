/**
 * Visual CTA verification using real banner images + mocked link metadata.
 * Does not mutate the database.
 */
import { chromium, devices } from 'playwright';

const BASE_URL = process.env.E2E_BASE_URL || 'http://localhost:5173';
const API_URL = process.env.E2E_API_URL || 'http://localhost:5000/api/v1';

const PRODUCT_ID = '6a97b301d067efe178e7e9d7';
const CATEGORY_ID = '6a979d0bec3bfd0491e95ffd';
const CATEGORY_SLUG = 'on-grid-solar-solutions';
const CUSTOM_URL = 'https://www.youtube.com/@Gajendra_Singh_Rana';

async function fetchLiveBanners() {
  const response = await fetch(`${API_URL}/homepage/banners`);
  const payload = await response.json();
  return payload?.data?.banners ?? [];
}

function withLinks(banners) {
  const linkConfigs = [
    { linkType: 'product', linkTargetId: PRODUCT_ID, linkUrl: null, linkHref: `/shop/product/${PRODUCT_ID}`, cta: 'View Details' },
    { linkType: 'category', linkTargetId: CATEGORY_ID, linkUrl: null, linkHref: `/shop/${CATEGORY_SLUG}`, cta: 'Shop Now' },
    { linkType: 'url', linkTargetId: null, linkUrl: CUSTOM_URL, linkHref: CUSTOM_URL, cta: 'Learn More' },
  ];

  return banners.slice(0, 3).map((banner, index) => ({
    ...banner,
    ...linkConfigs[index],
  }));
}

async function installMocks(page, linkedBanners) {
  await page.route('**/api/v1/homepage/banners', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ success: true, data: { banners: linkedBanners } }),
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
            { id: CATEGORY_ID, name: 'ON GRID SOLAR SOLUTIONS', slug: CATEGORY_SLUG, isActive: true },
          ],
        },
      }),
    });
  });
}

async function assertCta(page, label, slideIndex, expectedText) {
  if (slideIndex > 0) {
    await page.getByLabel(`Go to banner ${slideIndex + 1}`).click();
    await page.waitForTimeout(800);
  }

  const nav = page.locator('[data-banner-nav]').nth(slideIndex);
  await nav.waitFor({ state: 'visible', timeout: 10000 });

  const cta = nav.locator('[data-banner-cta]');
  await cta.waitFor({ state: 'visible', timeout: 10000 });

  const box = await cta.boundingBox();
  if (!box || box.width < 80 || box.height >= 36 === false) {
    throw new Error(`${label}: CTA too small ${JSON.stringify(box)}`);
  }

  const text = (await cta.textContent())?.trim() ?? '';
  if (!text.includes(expectedText)) {
    throw new Error(`${label}: expected "${expectedText}", got "${text}"`);
  }

  const styles = await cta.evaluate((el) => {
    const computed = window.getComputedStyle(el);
    return {
      opacity: computed.opacity,
      visibility: computed.visibility,
      display: computed.display,
    };
  });

  if (styles.visibility === 'hidden' || styles.display === 'none' || Number(styles.opacity) === 0) {
    throw new Error(`${label}: hidden via CSS ${JSON.stringify(styles)}`);
  }

  const href = await nav.getAttribute('href');
  console.log(`${label}: PASS — "${text}" href=${href} box=${Math.round(box.width)}x${Math.round(box.height)}`);
}

async function runViewport(name, viewport, linkedBanners) {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage(viewport);
  await installMocks(page, linkedBanners);

  await page.goto(BASE_URL, { waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForSelector('[aria-label="Homepage banner carousel"]', { timeout: 30000 });

  await assertCta(page, `${name} Product`, 0, 'View Details');
  await assertCta(page, `${name} Category`, 1, 'Shop Now');
  await assertCta(page, `${name} Custom Link`, 2, 'Learn More');

  await page.screenshot({ path: `banner-cta-${name.toLowerCase()}.png`, fullPage: false });
  await browser.close();
}

async function checkLiveUnlinked() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });

  await page.goto(BASE_URL, { waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForSelector('[aria-label="Homepage banner carousel"]', { timeout: 30000 });

  const navCount = await page.locator('[data-banner-nav]').count();
  const ctaCount = await page.locator('[data-banner-cta]').count();
  console.log(`Live homepage (no mocks): data-banner-nav=${navCount}, data-banner-cta=${ctaCount}`);

  await page.screenshot({ path: 'banner-cta-live-unlinked.png', fullPage: false });
  await browser.close();
}

const liveBanners = await fetchLiveBanners();
console.log(`Fetched ${liveBanners.length} live banner(s) from API`);
liveBanners.forEach((banner) => {
  console.log(`  Banner ${banner.position}: linkType=${banner.linkType}, linkHref=${banner.linkHref ?? 'null'}`);
});

if (liveBanners.length === 0) {
  throw new Error('No live banners available for visual verification');
}

const linkedBanners = withLinks(liveBanners);

await runViewport('Desktop', { viewport: { width: 1280, height: 800 } }, linkedBanners);
await runViewport('Mobile', devices['iPhone 13'], linkedBanners);
await checkLiveUnlinked();

console.log('All visual CTA checks passed.');
