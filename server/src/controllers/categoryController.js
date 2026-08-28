import catchAsync from '../utils/catchAsync.js';
import {
  createCategory,
  deleteCategory,
  getAdminCategories,
  getAdminCategoryById,
  getPublicCategories,
  getPublicCategoryBySlug,
  updateCategory,
} from '../services/categoryService.js';

export const getPublicCategoriesHandler = catchAsync(async (_req, res) => {
  const categories = await getPublicCategories();

  res.status(200).json({
    success: true,
    data: { categories },
  });
});

export const getPublicCategoryBySlugHandler = catchAsync(async (req, res) => {
  const category = await getPublicCategoryBySlug(req.params.slug);

  res.status(200).json({
    success: true,
    data: { category },
  });
});

export const getAdminCategoriesHandler = catchAsync(async (_req, res) => {
  const categories = await getAdminCategories();

  res.status(200).json({
    success: true,
    data: { categories },
  });
});

export const getAdminCategoryByIdHandler = catchAsync(async (req, res) => {
  const category = await getAdminCategoryById(req.params.id);

  res.status(200).json({
    success: true,
    data: { category },
  });
});

export const createAdminCategory = catchAsync(async (req, res) => {
  const category = await createCategory({
    name: req.body.name,
    description: req.body.description ?? '',
    isActive:
      req.body.isActive === undefined
        ? true
        : req.body.isActive === true || req.body.isActive === 'true',
    imageFile: req.file,
  });

  res.status(201).json({
    success: true,
    message: 'Category created successfully',
    data: { category },
  });
});

export const updateAdminCategory = catchAsync(async (req, res) => {
  const category = await updateCategory(req.params.id, {
    name: req.body.name,
    description: req.body.description,
    isActive:
      req.body.isActive === undefined
        ? undefined
        : req.body.isActive === true || req.body.isActive === 'true',
    imageFile: req.file,
    removeImage: req.body.removeImage === true || req.body.removeImage === 'true',
  });

  res.status(200).json({
    success: true,
    message: 'Category updated successfully',
    data: { category },
  });
});

export const deleteAdminCategory = catchAsync(async (req, res) => {
  const result = await deleteCategory(req.params.id);

  res.status(200).json({
    success: true,
    message: result.message,
  });
});
