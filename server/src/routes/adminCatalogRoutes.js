import { Router } from 'express';
import {
  createAdminProduct,
  deleteAdminProduct,
  getAdminProductByIdHandler,
  getAdminProductsHandler,
  updateAdminProduct,
} from '../controllers/productController.js';
import { getAdminCategoriesHandler } from '../controllers/categoryController.js';
import { protectAdmin } from '../middleware/protectAdmin.js';
import { productMediaUpload } from '../utils/fileUpload.js';

const router = Router();

router.use(protectAdmin);

router.get('/products', getAdminProductsHandler);
router.get('/products/:id', getAdminProductByIdHandler);
router.post('/products', productMediaUpload, createAdminProduct);
router.put('/products/:id', productMediaUpload, updateAdminProduct);
router.delete('/products/:id', deleteAdminProduct);
router.get('/categories', getAdminCategoriesHandler);

export default router;
