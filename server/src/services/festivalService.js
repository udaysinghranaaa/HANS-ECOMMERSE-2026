import prisma from '../config/prisma.js';
import ApiError from '../utils/ApiError.js';
import {
  deleteFestivalImageFile,
  persistUploadedImage,
} from '../utils/fileUpload.js';
import {
  findActiveFestival,
  getProductFestivalDiscount,
} from './festivalPricingService.js';
import { formatProduct, productInclude } from './productService.js';
import { toAbsoluteMediaUrl } from '../utils/mediaUrl.js';

const toAbsoluteImageUrl = (imageUrl, updatedAt) =>
  toAbsoluteMediaUrl(imageUrl, updatedAt, { width: 1400 });

export const getFestivalStatus = (festival, now = new Date()) => {
  if (!festival.isEnabled) {
    return 'disabled';
  }

  const start = new Date(festival.startsAt);
  const end = new Date(festival.endsAt);

  if (now < start) {
    return 'upcoming';
  }

  if (now > end) {
    return 'expired';
  }

  return 'active';
};

const formatFestival = (festival, { includeStatus = false, now = new Date() } = {}) => {
  const formatted = {
    id: festival.id,
    name: festival.name,
    title: festival.title,
    description: festival.description,
    imageUrl: toAbsoluteImageUrl(festival.imageUrl, festival.updatedAt),
    startsAt: festival.startsAt,
    endsAt: festival.endsAt,
    discountPercent: festival.discountPercent ?? null,
    applyToAllProducts: festival.applyToAllProducts ?? false,
    isEnabled: festival.isEnabled,
    priority: festival.priority,
    createdAt: festival.createdAt,
    updatedAt: festival.updatedAt,
  };

  if (includeStatus) {
    formatted.status = getFestivalStatus(festival, now);
  }

  if (festival._count) {
    formatted.productCount = festival._count.products;
  }

  return formatted;
};

const parseDateTime = (value, fieldName) => {
  const date = new Date(value);

  if (!value || Number.isNaN(date.getTime())) {
    throw new ApiError(400, `${fieldName} must be a valid date and time`);
  }

  return date;
};

const normalizeFestivalDiscount = (value) => {
  const percent = Number(value);

  if (!Number.isFinite(percent) || percent <= 0 || percent >= 100) {
    throw new ApiError(400, 'Festival discount must be between 1 and 99 percent');
  }

  return percent;
};

const validateFestivalDates = (startsAt, endsAt) => {
  if (endsAt <= startsAt) {
    throw new ApiError(400, 'End date/time must be after start date/time');
  }
};

export const getPublicActiveFestival = async () => {
  const festival = await findActiveFestival();

  if (!festival) {
    return null;
  }

  const productWhere = festival.applyToAllProducts
    ? { isActive: true }
    : {
        isActive: true,
        festivalId: festival.id,
      };

  const products = await prisma.product.findMany({
    where: productWhere,
    include: productInclude,
    orderBy: { updatedAt: 'desc' },
  });

  const effectiveDiscount =
    festival.discountPercent ??
    products.find(
      (product) =>
        product.festivalId === festival.id && product.festivalDiscountPercent,
    )?.festivalDiscountPercent ??
    null;

  if (festival.applyToAllProducts && !effectiveDiscount) {
    return null;
  }

  const festivalProducts = products
    .map((product) => {
      const discount = getProductFestivalDiscount(product, festival);

      if (!discount) {
        return null;
      }

      return {
        ...formatProduct(product),
        festivalDiscountPercent: discount,
        activeFestivalDiscount: discount,
        activeFestival: {
          id: festival.id,
          name: festival.name,
        },
      };
    })
    .filter(Boolean);

  if (festivalProducts.length === 0) {
    return null;
  }

  return {
    festival: {
      ...formatFestival(festival),
      discountPercent: effectiveDiscount ?? festival.discountPercent,
    },
    products: festivalProducts,
  };
};

export const getAdminFestivals = async () => {
  const now = new Date();
  const festivals = await prisma.festival.findMany({
    include: {
      _count: {
        select: { products: true },
      },
    },
    orderBy: [{ priority: 'desc' }, { startsAt: 'desc' }],
  });

  return festivals.map((festival) => formatFestival(festival, { includeStatus: true, now }));
};

export const getAdminFestivalById = async (id) => {
  const festival = await prisma.festival.findUnique({
    where: { id },
    include: {
      products: {
        include: productInclude,
        orderBy: { name: 'asc' },
      },
      _count: {
        select: { products: true },
      },
    },
  });

  if (!festival) {
    throw new ApiError(404, 'Festival not found');
  }

  return {
    ...formatFestival(festival, { includeStatus: true }),
    products: festival.products.map((product) => formatProduct(product)),
  };
};

export const createFestival = async ({
  name,
  title,
  description,
  startsAt,
  endsAt,
  discountPercent,
  applyToAllProducts = false,
  isEnabled = true,
  priority = 0,
  imageFile,
}) => {
  if (!name?.trim()) {
    throw new ApiError(400, 'Festival name is required');
  }

  if (!title?.trim()) {
    throw new ApiError(400, 'Festival title is required');
  }

  if (!description?.trim()) {
    throw new ApiError(400, 'Festival description is required');
  }

  if (!imageFile) {
    throw new ApiError(400, 'Festival image is required');
  }

  const parsedStartsAt = parseDateTime(startsAt, 'Start date/time');
  const parsedEndsAt = parseDateTime(endsAt, 'End date/time');
  validateFestivalDates(parsedStartsAt, parsedEndsAt);
  const parsedDiscount = normalizeFestivalDiscount(discountPercent);
  const parsedApplyToAllProducts =
    applyToAllProducts === true || applyToAllProducts === 'true';

  const uploadedImage = await persistUploadedImage(imageFile, 'festivals');

  const festival = await prisma.festival.create({
    data: {
      name: name.trim(),
      title: title.trim(),
      description: description.trim(),
      imageUrl: uploadedImage.url,
      imagePublicId: uploadedImage.publicId,
      startsAt: parsedStartsAt,
      endsAt: parsedEndsAt,
      discountPercent: parsedDiscount,
      applyToAllProducts: parsedApplyToAllProducts,
      isEnabled,
      priority: Number(priority) || 0,
    },
  });

  return formatFestival(festival, { includeStatus: true });
};

export const updateFestival = async (
  id,
  {
    name,
    title,
    description,
    startsAt,
    endsAt,
    discountPercent,
    applyToAllProducts,
    isEnabled,
    priority,
    imageFile,
  },
) => {
  const existingFestival = await prisma.festival.findUnique({ where: { id } });

  if (!existingFestival) {
    throw new ApiError(404, 'Festival not found');
  }

  const parsedStartsAt =
    startsAt !== undefined
      ? parseDateTime(startsAt, 'Start date/time')
      : existingFestival.startsAt;
  const parsedEndsAt =
    endsAt !== undefined
      ? parseDateTime(endsAt, 'End date/time')
      : existingFestival.endsAt;

  validateFestivalDates(parsedStartsAt, parsedEndsAt);

  const parsedDiscount =
    discountPercent !== undefined
      ? normalizeFestivalDiscount(discountPercent)
      : existingFestival.discountPercent;
  const parsedApplyToAllProducts =
    applyToAllProducts !== undefined
      ? applyToAllProducts === true || applyToAllProducts === 'true'
      : existingFestival.applyToAllProducts;

  let imageUrl = existingFestival.imageUrl;
  let imagePublicId = existingFestival.imagePublicId;

  if (imageFile) {
    await deleteFestivalImageFile(
      existingFestival.imageUrl,
      existingFestival.imagePublicId,
    );
    const uploadedImage = await persistUploadedImage(imageFile, 'festivals');
    imageUrl = uploadedImage.url;
    imagePublicId = uploadedImage.publicId;
  }

  const festival = await prisma.festival.update({
    where: { id },
    data: {
      ...(name !== undefined ? { name: name.trim() } : {}),
      ...(title !== undefined ? { title: title.trim() } : {}),
      ...(description !== undefined ? { description: description.trim() } : {}),
      startsAt: parsedStartsAt,
      endsAt: parsedEndsAt,
      ...(discountPercent !== undefined ? { discountPercent: parsedDiscount } : {}),
      ...(applyToAllProducts !== undefined
        ? { applyToAllProducts: parsedApplyToAllProducts }
        : {}),
      ...(isEnabled !== undefined ? { isEnabled } : {}),
      ...(priority !== undefined ? { priority: Number(priority) || 0 } : {}),
      imageUrl,
      imagePublicId,
    },
  });

  if (applyToAllProducts !== undefined && parsedApplyToAllProducts) {
    await prisma.product.updateMany({
      where: { festivalId: id },
      data: {
        festivalId: null,
        festivalDiscountPercent: null,
      },
    });
  }

  return formatFestival(festival, { includeStatus: true });
};

export const deleteFestival = async (id) => {
  const festival = await prisma.festival.findUnique({ where: { id } });

  if (!festival) {
    throw new ApiError(404, 'Festival not found');
  }

  await prisma.product.updateMany({
    where: { festivalId: id },
    data: {
      festivalId: null,
      festivalDiscountPercent: null,
    },
  });

  await prisma.festival.delete({ where: { id } });
  await deleteFestivalImageFile(festival.imageUrl, festival.imagePublicId);

  return { message: 'Festival deleted successfully' };
};

export const assignFestivalProducts = async (festivalId, productIds = []) => {
  const festival = await prisma.festival.findUnique({ where: { id: festivalId } });

  if (!festival) {
    throw new ApiError(404, 'Festival not found');
  }

  if (!Array.isArray(productIds) || productIds.length === 0) {
    throw new ApiError(400, 'At least one product must be selected');
  }

  const discount = festival.discountPercent
    ? normalizeFestivalDiscount(festival.discountPercent)
    : null;

  if (!discount) {
    throw new ApiError(
      400,
      'Festival discount must be configured before assigning products',
    );
  }

  const products = await prisma.product.findMany({
    where: { id: { in: productIds } },
  });

  if (products.length !== productIds.length) {
    throw new ApiError(400, 'One or more selected products were not found');
  }

  await Promise.all(
    productIds.map((productId) =>
      prisma.product.update({
        where: { id: productId },
        data: {
          festivalId,
          festivalDiscountPercent: discount,
        },
      }),
    ),
  );

  const assignedProducts = await prisma.product.findMany({
    where: { festivalId },
    include: productInclude,
    orderBy: { name: 'asc' },
  });

  return assignedProducts.map((product) => formatProduct(product));
};

export const assignFestivalProduct = async (
  festivalId,
  { productId, festivalDiscountPercent },
) => {
  const festival = await prisma.festival.findUnique({ where: { id: festivalId } });

  if (!festival) {
    throw new ApiError(404, 'Festival not found');
  }

  const product = await prisma.product.findUnique({ where: { id: productId } });

  if (!product) {
    throw new ApiError(404, 'Product not found');
  }

  const discount = festivalDiscountPercent
    ? normalizeFestivalDiscount(festivalDiscountPercent)
    : festival.discountPercent
      ? normalizeFestivalDiscount(festival.discountPercent)
      : null;

  if (!discount) {
    throw new ApiError(
      400,
      'Festival discount must be configured before assigning products',
    );
  }

  const updatedProduct = await prisma.product.update({
    where: { id: productId },
    data: {
      festivalId,
      festivalDiscountPercent: discount,
    },
    include: productInclude,
  });

  return formatProduct(updatedProduct);
};

export const updateFestivalProductDiscount = async (
  festivalId,
  productId,
  festivalDiscountPercent,
) => {
  const product = await prisma.product.findFirst({
    where: { id: productId, festivalId },
  });

  if (!product) {
    throw new ApiError(404, 'Product is not assigned to this festival');
  }

  const discount = normalizeFestivalDiscount(festivalDiscountPercent);

  const updatedProduct = await prisma.product.update({
    where: { id: productId },
    data: { festivalDiscountPercent: discount },
    include: productInclude,
  });

  return formatProduct(updatedProduct);
};

export const removeFestivalProduct = async (festivalId, productId) => {
  const product = await prisma.product.findFirst({
    where: { id: productId, festivalId },
  });

  if (!product) {
    throw new ApiError(404, 'Product is not assigned to this festival');
  }

  const updatedProduct = await prisma.product.update({
    where: { id: productId },
    data: {
      festivalId: null,
      festivalDiscountPercent: null,
    },
    include: productInclude,
  });

  return formatProduct(updatedProduct);
};
