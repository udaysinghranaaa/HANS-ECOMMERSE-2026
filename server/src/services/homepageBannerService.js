import prisma from '../config/prisma.js';
import config from '../config/index.js';
import ApiError from '../utils/ApiError.js';
import { buildBannerImageUrl, deleteBannerFile } from '../utils/fileUpload.js';

export const BANNER_POSITIONS = [1, 2, 3, 4];

const toAbsoluteImageUrl = (imageUrl, updatedAt) => {
  if (!imageUrl) {
    return imageUrl;
  }

  const version = new Date(updatedAt).getTime();
  const baseUrl = imageUrl.startsWith('http://') || imageUrl.startsWith('https://')
    ? imageUrl
    : `${config.serverUrl}${imageUrl}`;

  const separator = baseUrl.includes('?') ? '&' : '?';
  return `${baseUrl}${separator}v=${version}`;
};

const formatBanner = (banner) => ({
  id: banner.id,
  position: banner.position,
  title: banner.title,
  imageUrl: toAbsoluteImageUrl(banner.imageUrl, banner.updatedAt),
  isActive: banner.isActive,
  createdAt: banner.createdAt,
  updatedAt: banner.updatedAt,
});

export const getPublicHomepageBanners = async () => {
  const banners = await prisma.homepageBanner.findMany({
    where: {
      isActive: true,
      imageUrl: { not: '' },
    },
    orderBy: { position: 'asc' },
  });

  return banners.map(formatBanner);
};

export const getAdminHomepageBanners = async () => {
  const banners = await prisma.homepageBanner.findMany({
    orderBy: { position: 'asc' },
  });

  const bannerByPosition = new Map(
    banners.map((banner) => [banner.position, formatBanner(banner)]),
  );

  return BANNER_POSITIONS.map((position) => ({
    position,
    banner: bannerByPosition.get(position) ?? null,
  }));
};

export const upsertHomepageBanner = async ({ position, title, filename }) => {
  if (!BANNER_POSITIONS.includes(position)) {
    throw new ApiError(400, 'Banner position must be between 1 and 4');
  }

  const imageUrl = buildBannerImageUrl(filename);
  const existingBanner = await prisma.homepageBanner.findUnique({
    where: { position },
  });

  if (existingBanner) {
    deleteBannerFile(existingBanner.imageUrl);

    const banner = await prisma.homepageBanner.update({
      where: { position },
      data: {
        title,
        imageUrl,
        isActive: true,
      },
    });

    return formatBanner(banner);
  }

  const banner = await prisma.homepageBanner.create({
    data: {
      position,
      title,
      imageUrl,
      isActive: true,
    },
  });

  return formatBanner(banner);
};

export const updateHomepageBannerByPosition = async (
  position,
  { title, isActive },
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

  const banner = await prisma.homepageBanner.update({
    where: { position },
    data: {
      ...(title !== undefined ? { title } : {}),
      ...(isActive !== undefined ? { isActive } : {}),
    },
  });

  return formatBanner(banner);
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
  deleteBannerFile(banner.imageUrl);

  return { message: 'Banner removed successfully' };
};
