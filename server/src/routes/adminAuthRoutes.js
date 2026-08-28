import { Router } from 'express';
import { adminLogin } from '../controllers/adminAuthController.js';
import { validateBody, adminLoginSchema } from '../validators/schemas.js';

const router = Router();

router.post('/login', validateBody(adminLoginSchema), adminLogin);

export default router;
