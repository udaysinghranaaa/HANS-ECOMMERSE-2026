import prisma from '../config/prisma.js';
import config from '../config/index.js';
import ApiError from '../utils/ApiError.js';
import {
  GALLERY_COUNT,
  SITE_MEDIA_ASSETS,
  SITE_MEDIA_KEYS,
  getSiteMediaDefinition,
  isValidSiteMediaKey,
} from '../constants/siteMediaAssets.js';
import {
  deleteCloudinaryResourceByPublicId,
  buildCloudinaryDeliveryUrl,
  isCloudinaryConfigured,
} from '../utils/cloudinary.js';
import {
  deleteSiteMediaFile,
  persistSiteMediaImage,
} from '../utils/fileUpload.js';
import { toAbsoluteMediaUrl } from '../utils/mediaUrl.js';

const resolveAssetUrl = (asset, definition) => {
  if (asset?.imageUrl) {
    return toAbsoluteMediaUrl(asset.imageUrl, asset.updatedAt, {
      width: definition.width,
    });
  }

  if (isCloudinaryConfigured()) {
    const deliveryUrl = buildCloudinaryDeliveryUrl(
      `${config.cloudinary.folder}/${definition.folder}/${definition.publicId}`,
      { width: definition.width },
    );

    if (deliveryUrl) {
      return deliveryUrl;
    }
  }

  return definition.fallback;
};

const formatSiteMediaAsset = (asset, definition) => ({
  key: definition.key,
  label: definition.label,
  section: definition.section,
  alt: asset?.alt ?? definition.defaultAlt,
  imageUrl: resolveAssetUrl(asset, definition),
  storedImageUrl: asset?.imageUrl ?? null,
  imagePublicId: asset?.imagePublicId ?? null,
  updatedAt: asset?.updatedAt ?? null,
});

export const getAdminSiteMediaList = async () => {
  const assets = await prisma.siteMedia.findMany();
  const assetByKey = new Map(assets.map((asset) => [asset.key, asset]));

  return SITE_MEDIA_KEYS.map((key) =>
    formatSiteMediaAsset(assetByKey.get(key) ?? null, SITE_MEDIA_ASSETS[key]),
  );
};

export const getPublicSiteMedia = async () => {
  const assets = await prisma.siteMedia.findMany();
  const assetByKey = new Map(assets.map((asset) => [asset.key, asset]));

  const logoDefinition = SITE_MEDIA_ASSETS.logo;

  return {
    logo: resolveAssetUrl(assetByKey.get('logo') ?? null, logoDefinition),
    gallery: Array.from({ length: GALLERY_COUNT }, (_, index) => {
      const key = `gallery-${index + 1}`;
      const definition = SITE_MEDIA_ASSETS[key];
      const asset = assetByKey.get(key) ?? null;

      return {
        src: resolveAssetUrl(asset, definition),
        alt: asset?.alt ?? definition.defaultAlt,
      };
    }),
    aboutUs: resolveAssetUrl(
      assetByKey.get('about-us') ?? null,
      SITE_MEDIA_ASSETS['about-us'],
    ),
    office: resolveAssetUrl(
      assetByKey.get('office') ?? null,
      SITE_MEDIA_ASSETS.office,
    ),
  };
};

export const upsertSiteMediaAsset = async (key, imageFile, { alt } = {}) => {
  if (!isValidSiteMediaKey(key)) {
    throw new ApiError(400, 'Invalid site media key');
  }

  const definition = getSiteMediaDefinition(key);
  const existingAsset = await prisma.siteMedia.findUnique({ where: { key } });

  const uploaded = await persistSiteMediaImage(imageFile, {
    folder: definition.folder,
    publicId: definition.publicId,
  });

  if (
    existingAsset?.imagePublicId &&
    existingAsset.imagePublicId !== uploaded.publicId
  ) {
    await deleteCloudinaryResourceByPublicId(existingAsset.imagePublicId, 'image');
  } else if (
    existingAsset?.imageUrl &&
    !existingAsset.imagePublicId &&
    existingAsset.imageUrl !== uploaded.url
  ) {
    await deleteSiteMediaFile(existingAsset.imageUrl);
  }

  const asset = await prisma.siteMedia.upsert({
    where: { key },
    create: {
      key,
      imageUrl: uploaded.url,
      imagePublicId: uploaded.publicId,
      alt: alt?.trim() || definition.defaultAlt,
    },
    update: {
      imageUrl: uploaded.url,
      imagePublicId: uploaded.publicId,
      ...(alt !== undefined ? { alt: alt.trim() || definition.defaultAlt } : {}),
    },
  });

  return formatSiteMediaAsset(asset, definition);
};

export const seedSiteMediaFromFile = async (key, filePath, originalname) => {
  const fs = await import('fs');

  if (!fs.existsSync(filePath)) {
    return null;
  }

  const buffer = fs.readFileSync(filePath);

  return upsertSiteMediaAsset(key, { buffer, originalname });
};
