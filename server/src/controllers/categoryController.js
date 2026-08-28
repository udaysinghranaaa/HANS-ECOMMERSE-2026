import catchAsync from '../utils/catchAsync.js';
import {
  getAdminCategories,
  getPublicCategories,
} from '../services/categoryService.js';

export const getPublicCategoriesHandler = catchAsync(async (_req, res) => {
  const categories = await getPublicCategories();

  res.status(200).json({
    success: true,
    data: { categories },
  });
});

export const getAdminCategoriesHandler = catchAsync(async (_req, res) => {
  const categories = await getAdminCategories();

  res.status(200).json({
    success: true,
    data: { categories },
  });
});
