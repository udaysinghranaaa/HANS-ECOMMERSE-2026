import prisma from '../config/prisma.js';
import ApiError from '../utils/ApiError.js';
import {
  deleteProductImageFile,
  deleteProductMedia,
  persistUploadedImage,
  persistUploadedVideo,
} from '../utils/fileUpload.js';
import { toAbsoluteMediaUrl, normalizeStoredMediaUrl } from '../utils/mediaUrl.js';
import {
  isUploadedVideoUrl,
  isYouTubeVideoUrl,
  normalizeYouTubeVideoInput,
} from '../utils/videoUrl.js';
import {
  applyActiveFestivalFields,
  findActiveFestival,
} from './festivalPricingService.js';

const findPublicIdForUrl = (url, images, publicIds = []) => {
  const normalized = normalizeStoredMediaUrl(url);
  const index = images.findIndex(
    (image) => normalizeStoredMediaUrl(image) === normalized,
  );

  return index >= 0 ? publicIds[index] ?? null : null;
};

const toAbsoluteMediaUrlForProduct = (mediaUrl, updatedAt) =>
  toAbsoluteMediaUrl(mediaUrl, updatedAt, { width: 1200 });

const formatProductVideoUrl = (videoUrl, updatedAt) => {
  if (!videoUrl) {
    return null;
  }

  if (isYouTubeVideoUrl(videoUrl)) {
    return videoUrl;
  }

  return toAbsoluteMediaUrlForProduct(videoUrl, updatedAt);
};

const normalizeSaleFields = (isOnSale, saleDiscountPercent) => {
  if (!isOnSale) {
    return { isOnSale: false, saleDiscountPercent: null };
  }

  const percent = Number(saleDiscountPercent);

  if (!Number.isFinite(percent) || percent <= 0 || percent >= 100) {
    throw new ApiError(400, 'Sale discount must be between 1 and 99 percent');
  }

  return { isOnSale: true, saleDiscountPercent: percent };
};

const parseSpecifications = (value) => {
  if (!value) {
    return {};
  }

  if (typeof value === 'object') {
    return value;
  }

  try {
    return JSON.parse(value);
  } catch {
    throw new ApiError(400, 'Specifications must be valid JSON');
  }
};

const normalizeFestivalFields = async (festivalId, festivalDiscountPercent) => {
  if (!festivalId || festivalId === 'none' || festivalId === '') {
    return { festivalId: null, festivalDiscountPercent: null };
  }

  const festival = await prisma.festival.findUnique({ where: { id: festivalId } });

  if (!festival) {
    throw new ApiError(400, 'Selected festival does not exist');
  }

  const percent = Number(festivalDiscountPercent);

  if (!Number.isFinite(percent) || percent <= 0 || percent >= 100) {
    throw new ApiError(
      400,
      'Festival discount must be between 1 and 99 percent when a festival is selected',
    );
  }

  return { festivalId, festivalDiscountPercent: percent };
};

const resolveProductVideoFields = async ({
  existingVideoUrl = null,
  existingVideoPublicId = null,
  videoFile = null,
  videoLink = null,
  removeVideo = false,
}) => {
  if (removeVideo) {
    if (existingVideoUrl && isUploadedVideoUrl(existingVideoUrl)) {
      await deleteProductMedia({
        videoUrl: existingVideoUrl,
        videoPublicId: existingVideoPublicId,
      });
    }

    return { videoUrl: null, videoPublicId: null };
  }

  if (videoFile) {
    if (existingVideoUrl && isUploadedVideoUrl(existingVideoUrl)) {
      await deleteProductMedia({
        videoUrl: existingVideoUrl,
        videoPublicId: existingVideoPublicId,
      });
    }

    const uploadedVideo = await persistUploadedVideo(videoFile);
    return {
      videoUrl: uploadedVideo.url,
      videoPublicId: uploadedVideo.publicId,
    };
  }

  if (videoLink !== undefined && videoLink !== null) {
    const trimmedLink = String(videoLink).trim();

    if (!trimmedLink) {
      if (existingVideoUrl && isUploadedVideoUrl(existingVideoUrl)) {
        await deleteProductMedia({
          videoUrl: existingVideoUrl,
          videoPublicId: existingVideoPublicId,
        });
      }

      return { videoUrl: null, videoPublicId: null };
    }

    const normalizedYouTube = normalizeYouTubeVideoInput(trimmedLink);

    if (!normalizedYouTube) {
      throw new ApiError(400, 'Enter a valid YouTube video link');
    }

    if (existingVideoUrl && isUploadedVideoUrl(existingVideoUrl)) {
      await deleteProductMedia({
        videoUrl: existingVideoUrl,
        videoPublicId: existingVideoPublicId,
      });
    }

    return { videoUrl: normalizedYouTube, videoPublicId: null };
  }

  return {
    videoUrl: existingVideoUrl,
    videoPublicId: existingVideoPublicId,
  };
};

const formatProduct = (product, { includeCategory = true } = {}) => {
  const formatted = {
    id: product.id,
    name: product.name,
    description: product.description,
    price: product.price,
    images: (product.images || []).map((image) =>
      toAbsoluteMediaUrlForProduct(image, product.updatedAt),
    ),
    videoUrl: formatProductVideoUrl(product.videoUrl, product.updatedAt),
    categoryId: product.categoryId,
    stock: product.stock,
    specifications: product.specifications || {},
    warranty: product.warranty,
    isActive: product.isActive,
    isTrending: product.isTrending,
    isGovernmentSubsidy: product.isGovernmentSubsidy,
    isOnSale: product.isOnSale ?? false,
    saleDiscountPercent: product.saleDiscountPercent ?? null,
    festivalId: product.festivalId ?? null,
    festivalDiscountPercent: product.festivalDiscountPercent ?? null,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
  };

  if (includeCategory && product.category) {
    formatted.category = {
      id: product.category.id,
      name: product.category.name,
      slug: product.category.slug,
    };
  }

  if (product.festival) {
    formatted.festival = {
      id: product.festival.id,
      name: product.festival.name,
    };
  }

  return formatted;
};

const formatPublicProduct = (product, activeFestival) => {
  const formatted = formatProduct(product);
  return activeFestival
    ? applyActiveFestivalFields(formatted, product, activeFestival)
    : formatted;
};

const formatPublicProducts = (products, activeFestival) =>
  products.map((product) => formatPublicProduct(product, activeFestival));

export const productInclude = {
  category: {
    select: { id: true, name: true, slug: true },
  },
  festival: {
    select: { id: true, name: true },
  },
};

export { formatProduct };

export const getPublicProducts = async ({ categorySlug } = {}) => {
  const where = { isActive: true };

  if (categorySlug) {
    where.category = { slug: categorySlug, isActive: true };
  }

  const products = await prisma.product.findMany({
    where,
    include: productInclude,
    orderBy: { createdAt: 'desc' },
  });

  const activeFestival = await findActiveFestival();
  return formatPublicProducts(products, activeFestival);
};

export const getFeaturedProducts = async () => {
  const baseWhere = { isActive: true };
  const activeFestival = await findActiveFestival();

  const [trendingProducts, subsidyProducts] = await Promise.all([
    prisma.product.findMany({
      where: { ...baseWhere, isTrending: true },
      include: productInclude,
      orderBy: { updatedAt: 'desc' },
    }),
    prisma.product.findMany({
      where: { ...baseWhere, isGovernmentSubsidy: true },
      include: productInclude,
      orderBy: { updatedAt: 'desc' },
    }),
  ]);

  return {
    trendingProducts: formatPublicProducts(trendingProducts, activeFestival),
    subsidyProducts: formatPublicProducts(subsidyProducts, activeFestival),
  };
};

export const getPublicProductById = async (id) => {
  const product = await prisma.product.findFirst({
    where: { id, isActive: true },
    include: productInclude,
  });

  if (!product) {
    throw new ApiError(404, 'Product not found');
  }

  const relatedProducts = await prisma.product.findMany({
    where: {
      isActive: true,
      categoryId: product.categoryId,
      NOT: { id: product.id },
    },
    include: productInclude,
    orderBy: { createdAt: 'desc' },
    take: 4,
  });

  const activeFestival = await findActiveFestival();

  return {
    product: formatPublicProduct(product, activeFestival),
    relatedProducts: formatPublicProducts(relatedProducts, activeFestival),
  };
};

export const getAdminProductById = async (id) => {
  const product = await prisma.product.findUnique({
    where: { id },
    include: productInclude,
  });

  if (!product) {
    throw new ApiError(404, 'Product not found');
  }

  return formatProduct(product);
};

export const getAdminProducts = async () => {
  const products = await prisma.product.findMany({
    include: productInclude,
    orderBy: { createdAt: 'desc' },
  });

  return products.map((product) => formatProduct(product));
};

export const createProduct = async ({
  name,
  description,
  price,
  categoryId,
  stock = 0,
  specifications,
  warranty,
  isActive = true,
  isTrending = false,
  isGovernmentSubsidy = false,
  isOnSale = false,
  saleDiscountPercent = null,
  festivalId = null,
  festivalDiscountPercent = null,
  imageFiles = [],
  videoFile = null,
  videoLink = null,
}) => {
  if (!name?.trim()) {
    throw new ApiError(400, 'Product title is required');
  }

  if (!description?.trim()) {
    throw new ApiError(400, 'Product description is required');
  }

  if (!categoryId) {
    throw new ApiError(400, 'Product category is required');
  }

  if (!warranty?.trim()) {
    throw new ApiError(400, 'Product warranty is required');
  }

  if (imageFiles.length === 0) {
    throw new ApiError(400, 'At least one product image is required');
  }

  if (imageFiles.length > 5) {
    throw new ApiError(400, 'A maximum of 5 product images are allowed');
  }

  const category = await prisma.category.findUnique({ where: { id: categoryId } });
  if (!category) {
    throw new ApiError(400, 'Selected category does not exist');
  }

  const uploadedImages = await Promise.all(
    imageFiles.map((file) => persistUploadedImage(file, 'products/images')),
  );
  const images = uploadedImages.map((upload) => upload.url);
  const imagePublicIds = uploadedImages.map((upload) => upload.publicId);
  const videoFields = await resolveProductVideoFields({
    videoFile,
    videoLink,
  });
  const saleFields = normalizeSaleFields(isOnSale, saleDiscountPercent);
  const festivalFields = await normalizeFestivalFields(
    festivalId,
    festivalDiscountPercent,
  );

  const product = await prisma.product.create({
    data: {
      name: name.trim(),
      description: description.trim(),
      price: Number(price),
      discountPercent: 0,
      images,
      imagePublicIds,
      videoUrl: videoFields.videoUrl,
      videoPublicId: videoFields.videoPublicId,
      categoryId,
      stock: Number(stock) || 0,
      specifications: parseSpecifications(specifications),
      warranty: warranty.trim(),
      isActive,
      isTrending,
      isGovernmentSubsidy,
      ...saleFields,
      ...festivalFields,
    },
    include: productInclude,
  });

  return formatProduct(product);
};

export const updateProduct = async (
  id,
  {
    name,
    description,
    price,
    categoryId,
    stock,
    specifications,
    warranty,
    isActive,
    isTrending,
    isGovernmentSubsidy,
    isOnSale,
    saleDiscountPercent,
    festivalId,
    festivalDiscountPercent,
    existingImages = [],
    imageFiles = [],
    videoFile = null,
    videoLink,
    removeVideo = false,
  },
) => {
  const existingProduct = await prisma.product.findUnique({ where: { id } });

  if (!existingProduct) {
    throw new ApiError(404, 'Product not found');
  }

  const normalizedExistingImages = existingImages.map(normalizeStoredMediaUrl);
  const uploadedImages = await Promise.all(
    imageFiles.map((file) => persistUploadedImage(file, 'products/images')),
  );
  const mergedImages = [
    ...normalizedExistingImages,
    ...uploadedImages.map((upload) => upload.url),
  ];
  const mergedPublicIds = [
    ...normalizedExistingImages.map((url) =>
      findPublicIdForUrl(
        url,
        existingProduct.images,
        existingProduct.imagePublicIds ?? [],
      ),
    ),
    ...uploadedImages.map((upload) => upload.publicId),
  ];

  if (mergedImages.length === 0) {
    throw new ApiError(400, 'At least one product image is required');
  }

  if (mergedImages.length > 5) {
    throw new ApiError(400, 'A maximum of 5 product images are allowed');
  }

  const removedImages = existingProduct.images.filter(
    (image) => !mergedImages.includes(normalizeStoredMediaUrl(image)),
  );
  await Promise.all(
    removedImages.map((image) =>
      deleteProductImageFile(
        image,
        findPublicIdForUrl(
          image,
          existingProduct.images,
          existingProduct.imagePublicIds ?? [],
        ),
      ),
    ),
  );

  let videoUrl = existingProduct.videoUrl;
  let videoPublicId = existingProduct.videoPublicId;

  const resolvedVideo = await resolveProductVideoFields({
    existingVideoUrl: existingProduct.videoUrl,
    existingVideoPublicId: existingProduct.videoPublicId,
    videoFile,
    videoLink,
    removeVideo,
  });
  videoUrl = resolvedVideo.videoUrl;
  videoPublicId = resolvedVideo.videoPublicId;

  if (categoryId) {
    const category = await prisma.category.findUnique({ where: { id: categoryId } });
    if (!category) {
      throw new ApiError(400, 'Selected category does not exist');
    }
  }

  const saleUpdate =
    isOnSale !== undefined
      ? normalizeSaleFields(
          isOnSale,
          saleDiscountPercent ?? existingProduct.saleDiscountPercent,
        )
      : {};

  const festivalUpdate =
    festivalId !== undefined || festivalDiscountPercent !== undefined
      ? await normalizeFestivalFields(
          festivalId ?? existingProduct.festivalId,
          festivalDiscountPercent ?? existingProduct.festivalDiscountPercent,
        )
      : {};

  const product = await prisma.product.update({
    where: { id },
    data: {
      ...(name !== undefined ? { name: name.trim() } : {}),
      ...(description !== undefined ? { description: description.trim() } : {}),
      ...(price !== undefined ? { price: Number(price) } : {}),
      discountPercent: 0,
      ...(categoryId !== undefined ? { categoryId } : {}),
      ...(stock !== undefined ? { stock: Number(stock) } : {}),
      ...(specifications !== undefined
        ? { specifications: parseSpecifications(specifications) }
        : {}),
      ...(warranty !== undefined ? { warranty: warranty.trim() } : {}),
      ...(isActive !== undefined ? { isActive } : {}),
      ...(isTrending !== undefined ? { isTrending } : {}),
      ...(isGovernmentSubsidy !== undefined ? { isGovernmentSubsidy } : {}),
      ...saleUpdate,
      ...festivalUpdate,
      images: mergedImages,
      imagePublicIds: mergedPublicIds,
      videoUrl,
      videoPublicId,
    },
    include: productInclude,
  });

  return formatProduct(product);
};

export const deleteProduct = async (id) => {
  const product = await prisma.product.findUnique({ where: { id } });

  if (!product) {
    throw new ApiError(404, 'Product not found');
  }

  await prisma.product.delete({ where: { id } });
  await deleteProductMedia({
    images: product.images,
    imagePublicIds: product.imagePublicIds ?? [],
    videoUrl: product.videoUrl,
    videoPublicId: product.videoPublicId,
  });

  return { message: 'Product deleted successfully' };
};
