import { Router } from 'express';
import { getSiteMedia } from '../controllers/siteMediaController.js';

const router = Router();

router.get('/media', getSiteMedia);

export default router;
