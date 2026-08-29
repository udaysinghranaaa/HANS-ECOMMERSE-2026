import { Router } from 'express';
import { getPublicActiveFestivalHandler } from '../controllers/festivalController.js';

const router = Router();

router.get('/active', getPublicActiveFestivalHandler);

export default router;
