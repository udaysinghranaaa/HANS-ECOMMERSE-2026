import { Router } from 'express';
import healthRoutes from './healthRoutes.js';
import adminAuthRoutes from './adminAuthRoutes.js';
import adminHomepageBannerRoutes from './adminHomepageBannerRoutes.js';
import adminFestivalRoutes from './adminFestivalRoutes.js';
import adminCatalogRoutes from './adminCatalogRoutes.js';
import adminEnquiryRoutes from './adminEnquiryRoutes.js';
import homepageBannerRoutes from './homepageBannerRoutes.js';
import festivalRoutes from './festivalRoutes.js';
import catalogRoutes from './catalogRoutes.js';
import contactRoutes from './contactRoutes.js';
import siteMediaRoutes from './siteMediaRoutes.js';
import adminSiteMediaRoutes from './adminSiteMediaRoutes.js';

const router = Router();

router.use(healthRoutes);
router.use('/admin/auth', adminAuthRoutes);
router.use('/admin/homepage', adminHomepageBannerRoutes);
router.use('/admin/festivals', adminFestivalRoutes);
router.use('/admin/catalog', adminCatalogRoutes);
router.use('/admin/enquiries', adminEnquiryRoutes);
router.use('/admin/site', adminSiteMediaRoutes);
router.use('/homepage', homepageBannerRoutes);
router.use('/festivals', festivalRoutes);
router.use('/catalog', catalogRoutes);
router.use('/contact', contactRoutes);
router.use('/site', siteMediaRoutes);

export default router;
