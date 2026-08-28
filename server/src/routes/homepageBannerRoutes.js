import { Router } from 'express';
import { getPublicHomepageBannersHandler } from '../controllers/homepageBannerController.js';

const router = Router();

router.get('/banners', getPublicHomepageBannersHandler);

export default router;
