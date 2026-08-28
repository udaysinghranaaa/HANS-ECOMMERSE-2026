import catchAsync from '../utils/catchAsync.js';
import ApiError from '../utils/ApiError.js';
import {
  createProduct,
  deleteProduct,
  getAdminProductById,
  getAdminProducts,
  getPublicProductById,
  getPublicProducts,
  updateProduct,
} from '../services/productService.js';

const parseExistingImages = (value) => {
  if (!value) {
    return [];
  }

  if (Array.isArray(value)) {
    return value;
  }

  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    throw new ApiError(400, 'Existing images must be a valid JSON array');
  }
};

const mapProductBody = (body, files) => {
  const imageFiles = files?.images || [];
  const videoFile = files?.video?.[0] || null;

  return {
    name: body.name,
    description: body.description,
    price: body.price,
    discountPercent: body.discountPercent ?? 18,
    categoryId: body.categoryId,
    stock: body.stock ?? 0,
    specifications: body.specifications,
    warranty: body.warranty,
    isActive:
      body.isActive === undefined
        ? undefined
        : body.isActive === true || body.isActive === 'true',
    existingImages: parseExistingImages(body.existingImages),
    imageFiles,
    videoFile,
    removeVideo: body.removeVideo === true || body.removeVideo === 'true',
  };
};

export const getPublicProductsHandler = catchAsync(async (req, res) => {
  const products = await getPublicProducts({
    categorySlug: req.query.category,
  });

  res.status(200).json({
    success: true,
    data: { products },
  });
});

export const getPublicProductByIdHandler = catchAsync(async (req, res) => {
  const data = await getPublicProductById(req.params.id);

  res.status(200).json({
    success: true,
    data,
  });
});

export const getAdminProductsHandler = catchAsync(async (_req, res) => {
  const products = await getAdminProducts();

  res.status(200).json({
    success: true,
    data: { products },
  });
});

export const getAdminProductByIdHandler = catchAsync(async (req, res) => {
  const product = await getAdminProductById(req.params.id);

  res.status(200).json({
    success: true,
    data: { product },
  });
});

export const createAdminProduct = catchAsync(async (req, res) => {
  const product = await createProduct(mapProductBody(req.body, req.files));

  res.status(201).json({
    success: true,
    message: 'Product created successfully',
    data: { product },
  });
});

export const updateAdminProduct = catchAsync(async (req, res) => {
  const product = await updateProduct(
    req.params.id,
    mapProductBody(req.body, req.files),
  );

  res.status(200).json({
    success: true,
    message: 'Product updated successfully',
    data: { product },
  });
});

export const deleteAdminProduct = catchAsync(async (req, res) => {
  const result = await deleteProduct(req.params.id);

  res.status(200).json({
    success: true,
    message: result.message,
  });
});
