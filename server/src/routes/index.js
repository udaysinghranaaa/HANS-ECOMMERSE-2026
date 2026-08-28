import { Router } from 'express';
import healthRoutes from './healthRoutes.js';
import adminAuthRoutes from './adminAuthRoutes.js';
import adminHomepageBannerRoutes from './adminHomepageBannerRoutes.js';
import adminCatalogRoutes from './adminCatalogRoutes.js';
import homepageBannerRoutes from './homepageBannerRoutes.js';
import catalogRoutes from './catalogRoutes.js';

const router = Router();

router.use(healthRoutes);
router.use('/admin/auth', adminAuthRoutes);
router.use('/admin/homepage', adminHomepageBannerRoutes);
router.use('/admin/catalog', adminCatalogRoutes);
router.use('/homepage', homepageBannerRoutes);
router.use('/catalog', catalogRoutes);

export default router;
