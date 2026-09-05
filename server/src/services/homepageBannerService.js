import prisma from '../config/prisma.js';
import ApiError from '../utils/ApiError.js';
import { deleteBannerFile, persistUploadedImage } from '../utils/fileUpload.js';
import { getMemoryCached } from '../utils/memoryCache.js';
import { toAbsoluteMediaUrl } from '../utils/mediaUrl.js';

export const BANNER_POSITIONS = [1, 2, 3, 4];
const BANNER_LINK_TYPES = ['none', 'category', 'product', 'url'];

const normalizeLinkType = (value) => {
  const linkType = (value || 'none').trim().toLowerCase();

  if (!BANNER_LINK_TYPES.includes(linkType)) {
    throw new ApiError(400, 'Invalid banner link type');
  }

  return linkType;
};

const normalizeCustomLinkUrl = (value) => {
  const url = value?.trim();

  if (!url) {
    throw new ApiError(400, 'Please enter a custom banner link URL');
  }

  if (/^https?:\/\//i.test(url) || url.startsWith('/')) {
    return url;
  }

  throw new ApiError(
    400,
    'Custom banner link must start with http://, https://, or /',
  );
};

const resolveBannerLinkFields = async (linkType, linkTargetId, linkUrl) => {
  if (linkType === 'none') {
    return { linkTargetId: null, linkUrl: null };
  }

  if (linkType === 'url') {
    return {
      linkTargetId: null,
      linkUrl: normalizeCustomLinkUrl(linkUrl || linkTargetId),
    };
  }

  const targetId = linkTargetId?.trim();

  if (!targetId) {
    throw new ApiError(400, 'Please select a category or product for the banner link');
  }

  if (linkType === 'category') {
    const category = await prisma.category.findUnique({ where: { id: targetId } });

    if (!category) {
      throw new ApiError(400, 'Selected category was not found');
    }

    return { linkTargetId: category.id, linkUrl: null };
  }

  const product = await prisma.product.findUnique({ where: { id: targetId } });

  if (!product) {
    throw new ApiError(400, 'Selected product was not found');
  }

  return { linkTargetId: product.id, linkUrl: null };
};

const buildCategorySlugMap = async (banners) => {
  const categoryIds = banners
    .filter((banner) => banner.linkType === 'category' && banner.linkTargetId)
    .map((banner) => banner.linkTargetId);

  if (categoryIds.length === 0) {
    return new Map();
  }

  const categories = await prisma.category.findMany({
    where: { id: { in: categoryIds } },
    select: { id: true, slug: true },
  });

  return new Map(categories.map((category) => [category.id, category.slug]));
};

const formatBanner = (banner, categorySlugMap = new Map()) => {
  const linkType = banner.linkType || 'none';
  let linkHref = null;

  if (linkType === 'category' && banner.linkTargetId) {
    const slug = categorySlugMap.get(banner.linkTargetId);
    if (slug) {
      linkHref = `/shop/${slug}`;
    }
  } else if (linkType === 'product' && banner.linkTargetId) {
    linkHref = `/shop/product/${banner.linkTargetId}`;
  } else if (linkType === 'url' && banner.linkUrl) {
    linkHref = banner.linkUrl;
  }

  return {
    id: banner.id,
    position: banner.position,
    title: banner.title,
    imageUrl: toAbsoluteMediaUrl(banner.imageUrl, banner.updatedAt, { width: 1920 }),
    mobileImageUrl: banner.mobileImageUrl
      ? toAbsoluteMediaUrl(banner.mobileImageUrl, banner.updatedAt, { width: 1080 })
      : null,
    isActive: banner.isActive,
    linkType,
    linkTargetId: banner.linkTargetId || null,
    linkUrl: banner.linkUrl || null,
    linkHref,
    createdAt: banner.createdAt,
    updatedAt: banner.updatedAt,
  };
};

const enrichBanners = async (banners) => {
  const categorySlugMap = await buildCategorySlugMap(banners);
  return banners.map((banner) => formatBanner(banner, categorySlugMap));
};

export const getPublicHomepageBanners = async () => {
  return getMemoryCached('public-homepage-banners', 60_000, async () => {
    const banners = await prisma.homepageBanner.findMany({
      where: {
        isActive: true,
        imageUrl: { not: '' },
      },
      orderBy: { position: 'asc' },
    });

    return enrichBanners(banners);
  });
};

export const getAdminHomepageBanners = async () => {
  const banners = await prisma.homepageBanner.findMany({
    orderBy: { position: 'asc' },
  });

  const formattedBanners = await enrichBanners(banners);
  const bannerByPosition = new Map(
    formattedBanners.map((banner) => [banner.position, banner]),
  );

  return BANNER_POSITIONS.map((position) => ({
    position,
    banner: bannerByPosition.get(position) ?? null,
  }));
};

export const upsertHomepageBanner = async ({
  position,
  title,
  imageFile,
  mobileImageFile,
  linkType,
  linkTargetId,
  linkUrl,
}) => {
  if (!BANNER_POSITIONS.includes(position)) {
    throw new ApiError(400, 'Banner position must be between 1 and 4');
  }

  const existingBanner = await prisma.homepageBanner.findUnique({
    where: { position },
  });

  if (!imageFile && !existingBanner) {
    throw new ApiError(400, 'Desktop banner image is required');
  }

  if (!imageFile && !mobileImageFile && !existingBanner) {
    throw new ApiError(400, 'At least one banner image is required');
  }

  const normalizedLinkType = normalizeLinkType(linkType);
  const linkFields = await resolveBannerLinkFields(
    normalizedLinkType,
    linkTargetId,
    linkUrl,
  );

  let imageUrl = existingBanner?.imageUrl ?? '';
  let imagePublicId = existingBanner?.imagePublicId ?? null;
  let mobileImageUrl = existingBanner?.mobileImageUrl ?? null;
  let mobileImagePublicId = existingBanner?.mobileImagePublicId ?? null;

  if (imageFile) {
    const uploadedImage = await persistUploadedImage(imageFile, 'banners');

    if (existingBanner?.imageUrl) {
      await deleteBannerFile(existingBanner.imageUrl, existingBanner.imagePublicId);
    }

    imageUrl = uploadedImage.url;
    imagePublicId = uploadedImage.publicId;
  }

  if (mobileImageFile) {
    const uploadedMobileImage = await persistUploadedImage(mobileImageFile, 'banners');

    if (existingBanner?.mobileImageUrl) {
      await deleteBannerFile(
        existingBanner.mobileImageUrl,
        existingBanner.mobileImagePublicId,
      );
    }

    mobileImageUrl = uploadedMobileImage.url;
    mobileImagePublicId = uploadedMobileImage.publicId;
  }

  const bannerData = {
    title,
    imageUrl,
    imagePublicId,
    mobileImageUrl,
    mobileImagePublicId,
    isActive: true,
    linkType: normalizedLinkType,
    linkTargetId: linkFields.linkTargetId,
    linkUrl: linkFields.linkUrl,
  };

  if (existingBanner) {
    const banner = await prisma.homepageBanner.update({
      where: { position },
      data: bannerData,
    });

    const [formattedBanner] = await enrichBanners([banner]);
    return formattedBanner;
  }

  const banner = await prisma.homepageBanner.create({
    data: {
      position,
      ...bannerData,
    },
  });

  const [formattedBanner] = await enrichBanners([banner]);
  return formattedBanner;
};

export const updateHomepageBannerByPosition = async (
  position,
  { title, isActive, linkType, linkTargetId, linkUrl },
) => {
  if (!BANNER_POSITIONS.includes(position)) {
    throw new ApiError(400, 'Banner position must be between 1 and 4');
  }

  const existingBanner = await prisma.homepageBanner.findUnique({
    where: { position },
  });

  if (!existingBanner) {
    throw new ApiError(404, 'Banner slot is empty');
  }

  const data = {};

  if (title !== undefined) {
    data.title = title;
  }

  if (isActive !== undefined) {
    data.isActive = isActive;
  }

  if (linkType !== undefined) {
    const normalizedLinkType = normalizeLinkType(linkType);
    const linkFields = await resolveBannerLinkFields(
      normalizedLinkType,
      linkTargetId,
      linkUrl,
    );
    data.linkType = normalizedLinkType;
    data.linkTargetId = linkFields.linkTargetId;
    data.linkUrl = linkFields.linkUrl;
  } else if (
    linkTargetId !== undefined ||
    linkUrl !== undefined
  ) {
    const linkFields = await resolveBannerLinkFields(
      existingBanner.linkType,
      linkTargetId ?? existingBanner.linkTargetId,
      linkUrl ?? existingBanner.linkUrl,
    );
    data.linkTargetId = linkFields.linkTargetId;
    data.linkUrl = linkFields.linkUrl;
  }

  const banner = await prisma.homepageBanner.update({
    where: { position },
    data,
  });

  const [formattedBanner] = await enrichBanners([banner]);
  return formattedBanner;
};

export const deleteHomepageBannerByPosition = async (position) => {
  if (!BANNER_POSITIONS.includes(position)) {
    throw new ApiError(400, 'Banner position must be between 1 and 4');
  }

  const banner = await prisma.homepageBanner.findUnique({
    where: { position },
  });

  if (!banner) {
    throw new ApiError(404, 'Banner slot is empty');
  }

  await prisma.homepageBanner.delete({ where: { position } });
  await deleteBannerFile(banner.imageUrl, banner.imagePublicId);

  if (banner.mobileImageUrl) {
    await deleteBannerFile(banner.mobileImageUrl, banner.mobileImagePublicId);
  }

  return { message: 'Banner removed successfully' };
};
