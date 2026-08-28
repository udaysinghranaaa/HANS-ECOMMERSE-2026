import { Router } from 'express';
import healthRoutes from './healthRoutes.js';
import adminAuthRoutes from './adminAuthRoutes.js';
import adminHomepageBannerRoutes from './adminHomepageBannerRoutes.js';
import homepageBannerRoutes from './homepageBannerRoutes.js';

const router = Router();

router.use(healthRoutes);
router.use('/admin/auth', adminAuthRoutes);
router.use('/admin/homepage', adminHomepageBannerRoutes);
router.use('/homepage', homepageBannerRoutes);

export default router;
