import { Router } from 'express';
import {
  deleteAdminHomepageBanner,
  getAdminHomepageBannersHandler,
  updateAdminHomepageBanner,
  upsertAdminHomepageBanner,
} from '../controllers/homepageBannerController.js';
import { protectAdmin } from '../middleware/protectAdmin.js';
import { bannerMediaUpload } from '../utils/fileUpload.js';
import { homepageBannerUpdateSchema, validateBody } from '../validators/schemas.js';

const router = Router();

router.use(protectAdmin);

router.get('/banners', getAdminHomepageBannersHandler);
router.post(
  '/banners/:position',
  bannerMediaUpload,
  upsertAdminHomepageBanner,
);
router.put(
  '/banners/:position',
  validateBody(homepageBannerUpdateSchema),
  updateAdminHomepageBanner,
);
router.delete('/banners/:position', deleteAdminHomepageBanner);

export default router;
