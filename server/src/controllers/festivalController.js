import catchAsync from '../utils/catchAsync.js';
import {
  assignFestivalProduct,
  assignFestivalProducts,
  createFestival,
  deleteFestival,
  getAdminFestivalById,
  getAdminFestivals,
  getPublicActiveFestival,
  removeFestivalProduct,
  updateFestival,
  updateFestivalProductDiscount,
} from '../services/festivalService.js';

const parseBoolean = (value, fallback = undefined) => {
  if (value === undefined) {
    return fallback;
  }

  return value === true || value === 'true';
};

export const getPublicActiveFestivalHandler = catchAsync(async (_req, res) => {
  const data = await getPublicActiveFestival();

  res.status(200).json({
    success: true,
    data: data ?? { festival: null, products: [] },
  });
});

export const getAdminFestivalsHandler = catchAsync(async (_req, res) => {
  const festivals = await getAdminFestivals();

  res.status(200).json({
    success: true,
    data: { festivals },
  });
});

export const getAdminFestivalByIdHandler = catchAsync(async (req, res) => {
  const festival = await getAdminFestivalById(req.params.id);

  res.status(200).json({
    success: true,
    data: { festival },
  });
});

export const createAdminFestival = catchAsync(async (req, res) => {
  const imageFile = req.file ?? null;
  const festival = await createFestival({
    name: req.body.name,
    title: req.body.title,
    description: req.body.description,
    startsAt: req.body.startsAt,
    endsAt: req.body.endsAt,
    discountPercent: req.body.discountPercent,
    applyToAllProducts: parseBoolean(req.body.applyToAllProducts, false),
    isEnabled: parseBoolean(req.body.isEnabled, true),
    priority: req.body.priority ?? 0,
    imageFile,
  });

  res.status(201).json({
    success: true,
    message: 'Festival created successfully',
    data: { festival },
  });
});

export const updateAdminFestival = catchAsync(async (req, res) => {
  const imageFile = req.file ?? null;
  const festival = await updateFestival(req.params.id, {
    name: req.body.name,
    title: req.body.title,
    description: req.body.description,
    startsAt: req.body.startsAt,
    endsAt: req.body.endsAt,
    discountPercent: req.body.discountPercent,
    applyToAllProducts:
      req.body.applyToAllProducts !== undefined
        ? parseBoolean(req.body.applyToAllProducts)
        : undefined,
    isEnabled: parseBoolean(req.body.isEnabled),
    priority: req.body.priority,
    imageFile,
  });

  res.status(200).json({
    success: true,
    message: 'Festival updated successfully',
    data: { festival },
  });
});

export const deleteAdminFestival = catchAsync(async (req, res) => {
  const result = await deleteFestival(req.params.id);

  res.status(200).json({
    success: true,
    message: result.message,
  });
});

export const assignAdminFestivalProducts = catchAsync(async (req, res) => {
  const products = await assignFestivalProducts(req.params.id, req.body.productIds);

  res.status(200).json({
    success: true,
    message: 'Products assigned to festival successfully',
    data: { products },
  });
});

export const assignAdminFestivalProduct = catchAsync(async (req, res) => {
  const product = await assignFestivalProduct(req.params.id, {
    productId: req.body.productId,
    festivalDiscountPercent: req.body.festivalDiscountPercent,
  });

  res.status(200).json({
    success: true,
    message: 'Product assigned to festival successfully',
    data: { product },
  });
});

export const updateAdminFestivalProductDiscount = catchAsync(async (req, res) => {
  const product = await updateFestivalProductDiscount(
    req.params.id,
    req.params.productId,
    req.body.festivalDiscountPercent,
  );

  res.status(200).json({
    success: true,
    message: 'Festival discount updated successfully',
    data: { product },
  });
});

export const removeAdminFestivalProduct = catchAsync(async (req, res) => {
  const product = await removeFestivalProduct(
    req.params.id,
    req.params.productId,
  );

  res.status(200).json({
    success: true,
    message: 'Product removed from festival successfully',
    data: { product },
  });
});
