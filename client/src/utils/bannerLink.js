const EXTERNAL_HREF_PATTERN = /^https?:\/\//i;

export const isExternalHref = (href) =>
  typeof href === 'string' && EXTERNAL_HREF_PATTERN.test(href.trim());

export const getBannerCtaLabel = (banner) => {
  const linkType = (banner?.linkType || 'none').toLowerCase();

  switch (linkType) {
    case 'product':
      return 'View Details';
    case 'category':
      return 'Shop Now';
    case 'url':
    case 'link':
      return 'Learn More';
    default:
      return 'Explore Now';
  }
};

export const resolveBannerHref = (banner, categorySlugById = new Map()) => {
  if (!banner) {
    return null;
  }

  if (banner.linkHref) {
    return banner.linkHref;
  }

  const linkType = (banner.linkType || 'none').toLowerCase();
  const targetId = banner.linkTargetId?.trim?.() ?? banner.linkTargetId;

  if (linkType === 'none') {
    return null;
  }

  if (linkType === 'category' && targetId) {
    const slug = categorySlugById.get(targetId);
    return slug ? `/shop/${slug}` : null;
  }

  if (linkType === 'product' && targetId) {
    return `/shop/product/${targetId}`;
  }

  if (linkType === 'url' || linkType === 'link') {
    return banner.linkUrl || targetId || null;
  }

  return null;
};

export const getBannerLinkPreview = ({
  linkType,
  linkTargetId,
  linkUrl,
  categories = [],
  products = [],
}) => {
  if (!linkType || linkType === 'none') {
    return null;
  }

  if (linkType === 'category' && linkTargetId) {
    const category = categories.find((item) => item.id === linkTargetId);
    return category ? `/shop/${category.slug}` : null;
  }

  if (linkType === 'product' && linkTargetId) {
    return `/shop/product/${linkTargetId}`;
  }

  if (linkType === 'url' || linkType === 'link') {
    return linkUrl || linkTargetId || null;
  }

  return null;
};
