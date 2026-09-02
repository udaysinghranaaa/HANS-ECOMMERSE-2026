const EXTERNAL_HREF_PATTERN = /^https?:\/\//i;

export const isExternalHref = (href) =>
  typeof href === 'string' && EXTERNAL_HREF_PATTERN.test(href.trim());

export const resolveBannerHref = (banner, categorySlugById = new Map()) => {
  if (!banner) {
    return null;
  }

  if (banner.linkHref) {
    return banner.linkHref;
  }

  const linkType = (banner.linkType || 'none').toLowerCase();
  const targetId = banner.linkTargetId?.trim?.() ?? banner.linkTargetId;

  if (!targetId || linkType === 'none') {
    return null;
  }

  if (linkType === 'category') {
    const slug = categorySlugById.get(targetId);
    return slug ? `/shop/${slug}` : null;
  }

  if (linkType === 'product') {
    return `/shop/product/${targetId}`;
  }

  if (linkType === 'url' || linkType === 'link') {
    const customUrl = banner.linkUrl || targetId;
    return customUrl || null;
  }

  return null;
};
