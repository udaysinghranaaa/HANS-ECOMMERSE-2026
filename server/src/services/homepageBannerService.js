import prisma from '../config/prisma.js';
import ApiError from '../utils/ApiError.js';
import { deleteBannerFile, persistUploadedImage } from '../utils/fileUpload.js';
import { toAbsoluteMediaUrl } from '../utils/mediaUrl.js';

export const BANNER_POSITIONS = [1, 2, 3, 4];

const formatBanner = (banner) => ({
  id: banner.id,
  position: banner.position,
  title: banner.title,
  imageUrl: toAbsoluteMediaUrl(banner.imageUrl, banner.updatedAt, { width: 1920 }),
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

export const upsertHomepageBanner = async ({ position, title, imageFile }) => {
  if (!BANNER_POSITIONS.includes(position)) {
    throw new ApiError(400, 'Banner position must be between 1 and 4');
  }

  const { url: imageUrl, publicId: imagePublicId } = await persistUploadedImage(
    imageFile,
    'banners',
  );
  const existingBanner = await prisma.homepageBanner.findUnique({
    where: { position },
  });

  if (existingBanner) {
    await deleteBannerFile(existingBanner.imageUrl, existingBanner.imagePublicId);

    const banner = await prisma.homepageBanner.update({
      where: { position },
      data: {
        title,
        imageUrl,
        imagePublicId,
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
      imagePublicId,
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
  await deleteBannerFile(banner.imageUrl, banner.imagePublicId);

  return { message: 'Banner removed successfully' };
};
