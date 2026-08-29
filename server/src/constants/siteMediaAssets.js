export const GALLERY_COUNT = 11;

export const SITE_MEDIA_ASSETS = {
  logo: {
    key: 'logo',
    folder: 'site',
    publicId: 'logo',
    label: 'Website Logo',
    section: 'brand',
    fallback: '/logo.jpg',
    defaultAlt: 'HANS Solar',
    width: 400,
  },
  'about-us': {
    key: 'about-us',
    folder: 'about',
    publicId: 'about-us',
    label: 'About Us Image',
    section: 'about',
    fallback: null,
    defaultAlt: 'HANS Solar about us',
    width: 1200,
  },
  office: {
    key: 'office',
    folder: 'office',
    publicId: 'office',
    label: 'Office Image',
    section: 'office',
    fallback: null,
    defaultAlt: 'HANS Solar corporate office',
    width: 1200,
  },
  ...Object.fromEntries(
    Array.from({ length: GALLERY_COUNT }, (_, index) => {
      const slot = index + 1;

      return [
        `gallery-${slot}`,
        {
          key: `gallery-${slot}`,
          folder: 'gallery',
          publicId: `s${slot}`,
          label: `Gallery Image ${slot}`,
          section: 'gallery',
          fallback: `/s${slot}.webp`,
          defaultAlt: `HANS Solar subsidy installation ${slot}`,
          width: 800,
        },
      ];
    }),
  ),
};

export const SITE_MEDIA_KEYS = Object.keys(SITE_MEDIA_ASSETS);

export const isValidSiteMediaKey = (key) => SITE_MEDIA_KEYS.includes(key);

export const getSiteMediaDefinition = (key) => SITE_MEDIA_ASSETS[key] ?? null;
