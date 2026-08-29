import { Router } from 'express';
import {
  assignAdminFestivalProduct,
  assignAdminFestivalProducts,
  createAdminFestival,
  deleteAdminFestival,
  getAdminFestivalByIdHandler,
  getAdminFestivalsHandler,
  removeAdminFestivalProduct,
  updateAdminFestival,
  updateAdminFestivalProductDiscount,
} from '../controllers/festivalController.js';
import { protectAdmin } from '../middleware/protectAdmin.js';
import { festivalUpload } from '../utils/fileUpload.js';

const router = Router();

router.use(protectAdmin);

router.get('/', getAdminFestivalsHandler);
router.get('/:id', getAdminFestivalByIdHandler);
router.post('/', festivalUpload.single('image'), createAdminFestival);
router.put('/:id', festivalUpload.single('image'), updateAdminFestival);
router.delete('/:id', deleteAdminFestival);
router.post('/:id/products/batch', assignAdminFestivalProducts);
router.post('/:id/products', assignAdminFestivalProduct);
router.put(
  '/:id/products/:productId',
  updateAdminFestivalProductDiscount,
);
router.delete('/:id/products/:productId', removeAdminFestivalProduct);

export default router;
