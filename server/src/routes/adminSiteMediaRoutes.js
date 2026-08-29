import { Router } from 'express';
import {
  getAdminSiteMediaHandler,
  upsertAdminSiteMediaHandler,
} from '../controllers/adminSiteMediaController.js';
import { protectAdmin } from '../middleware/protectAdmin.js';
import { bannerUpload } from '../utils/fileUpload.js';

const router = Router();

router.use(protectAdmin);

router.get('/media', getAdminSiteMediaHandler);
router.post('/media/:key', bannerUpload.single('image'), upsertAdminSiteMediaHandler);

export default router;
