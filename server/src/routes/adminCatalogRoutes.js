import { Router } from 'express';
import {
  createAdminProduct,
  deleteAdminProduct,
  getAdminProductByIdHandler,
  getAdminProductsHandler,
  updateAdminProduct,
} from '../controllers/productController.js';
import {
  createAdminCategory,
  deleteAdminCategory,
  getAdminCategoriesHandler,
  getAdminCategoryByIdHandler,
  updateAdminCategory,
} from '../controllers/categoryController.js';
import { protectAdmin } from '../middleware/protectAdmin.js';
import {
  categoryUpload,
  productMediaUpload,
} from '../utils/fileUpload.js';

const router = Router();

router.use(protectAdmin);

router.get('/products', getAdminProductsHandler);
router.get('/products/:id', getAdminProductByIdHandler);
router.post('/products', productMediaUpload, createAdminProduct);
router.put('/products/:id', productMediaUpload, updateAdminProduct);
router.delete('/products/:id', deleteAdminProduct);

router.get('/categories', getAdminCategoriesHandler);
router.get('/categories/:id', getAdminCategoryByIdHandler);
router.post('/categories', categoryUpload.single('image'), createAdminCategory);
router.put('/categories/:id', categoryUpload.single('image'), updateAdminCategory);
router.delete('/categories/:id', deleteAdminCategory);

export default router;
