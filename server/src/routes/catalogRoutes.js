import { Router } from 'express';
import {
  getPublicProductByIdHandler,
  getPublicProductsHandler,
} from '../controllers/productController.js';
import { getPublicCategoriesHandler } from '../controllers/categoryController.js';

const router = Router();

router.get('/categories', getPublicCategoriesHandler);
router.get('/products', getPublicProductsHandler);
router.get('/products/:id', getPublicProductByIdHandler);

export default router;
