import prisma from '../config/prisma.js';
import config from '../config/index.js';
import ApiError from '../utils/ApiError.js';
import {
  buildProductImageUrl,
  buildProductVideoUrl,
  deleteProductMedia,
} from '../utils/fileUpload.js';

const toAbsoluteMediaUrl = (mediaUrl, updatedAt) => {
  if (!mediaUrl) {
    return null;
  }

  const version = updatedAt ? new Date(updatedAt).getTime() : Date.now();
  const baseUrl =
    mediaUrl.startsWith('http://') || mediaUrl.startsWith('https://')
      ? mediaUrl
      : `${config.serverUrl}${mediaUrl}`;

  const separator = baseUrl.includes('?') ? '&' : '?';
  return `${baseUrl}${separator}v=${version}`;
};

const calculateDiscountedPrice = (price, discountPercent) =>
  Math.round(price * (1 - discountPercent / 100));

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

const formatProduct = (product, { includeCategory = true } = {}) => {
  const discountedPrice = calculateDiscountedPrice(
    product.price,
    product.discountPercent,
  );

  const formatted = {
    id: product.id,
    name: product.name,
    description: product.description,
    price: product.price,
    originalPrice: product.price,
    discountPercent: product.discountPercent,
    discountedPrice,
    images: (product.images || []).map((image) =>
      toAbsoluteMediaUrl(image, product.updatedAt),
    ),
    videoUrl: toAbsoluteMediaUrl(product.videoUrl, product.updatedAt),
    categoryId: product.categoryId,
    stock: product.stock,
    specifications: product.specifications || {},
    warranty: product.warranty,
    isActive: product.isActive,
    isTrending: product.isTrending,
    isGovernmentSubsidy: product.isGovernmentSubsidy,
    isOnSale: product.isOnSale ?? false,
    saleDiscountPercent: product.saleDiscountPercent ?? null,
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

  return formatted;
};

const productInclude = {
  category: {
    select: { id: true, name: true, slug: true },
  },
};

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

  return products.map((product) => formatProduct(product));
};

export const getFeaturedProducts = async () => {
  const baseWhere = { isActive: true };

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
    trendingProducts: trendingProducts.map((product) => formatProduct(product)),
    subsidyProducts: subsidyProducts.map((product) => formatProduct(product)),
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

  return {
    product: formatProduct(product),
    relatedProducts: relatedProducts.map((item) => formatProduct(item)),
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
  discountPercent = 18,
  categoryId,
  stock = 0,
  specifications,
  warranty,
  isActive = true,
  isTrending = false,
  isGovernmentSubsidy = false,
  isOnSale = false,
  saleDiscountPercent = null,
  imageFiles = [],
  videoFile = null,
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

  const images = imageFiles.map((file) => buildProductImageUrl(file.filename));
  const videoUrl = videoFile ? buildProductVideoUrl(videoFile.filename) : null;
  const saleFields = normalizeSaleFields(isOnSale, saleDiscountPercent);

  const product = await prisma.product.create({
    data: {
      name: name.trim(),
      description: description.trim(),
      price: Number(price),
      discountPercent: Number(discountPercent) || 18,
      images,
      videoUrl,
      categoryId,
      stock: Number(stock) || 0,
      specifications: parseSpecifications(specifications),
      warranty: warranty.trim(),
      isActive,
      isTrending,
      isGovernmentSubsidy,
      ...saleFields,
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
    discountPercent,
    categoryId,
    stock,
    specifications,
    warranty,
    isActive,
    isTrending,
    isGovernmentSubsidy,
    isOnSale,
    saleDiscountPercent,
    existingImages = [],
    imageFiles = [],
    videoFile = null,
    removeVideo = false,
  },
) => {
  const existingProduct = await prisma.product.findUnique({ where: { id } });

  if (!existingProduct) {
    throw new ApiError(404, 'Product not found');
  }

  const mergedImages = [...existingImages, ...imageFiles.map((file) => buildProductImageUrl(file.filename))];

  if (mergedImages.length === 0) {
    throw new ApiError(400, 'At least one product image is required');
  }

  if (mergedImages.length > 5) {
    throw new ApiError(400, 'A maximum of 5 product images are allowed');
  }

  const removedImages = existingProduct.images.filter(
    (image) => !mergedImages.includes(image),
  );
  removedImages.forEach((image) => deleteProductMedia({ images: [image] }));

  let videoUrl = existingProduct.videoUrl;

  if (removeVideo && videoUrl) {
    deleteProductMedia({ videoUrl });
    videoUrl = null;
  }

  if (videoFile) {
    if (existingProduct.videoUrl) {
      deleteProductMedia({ videoUrl: existingProduct.videoUrl });
    }
    videoUrl = buildProductVideoUrl(videoFile.filename);
  }

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

  const product = await prisma.product.update({
    where: { id },
    data: {
      ...(name !== undefined ? { name: name.trim() } : {}),
      ...(description !== undefined ? { description: description.trim() } : {}),
      ...(price !== undefined ? { price: Number(price) } : {}),
      ...(discountPercent !== undefined
        ? { discountPercent: Number(discountPercent) }
        : {}),
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
      images: mergedImages,
      videoUrl,
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
  deleteProductMedia({ images: product.images, videoUrl: product.videoUrl });

  return { message: 'Product deleted successfully' };
};
