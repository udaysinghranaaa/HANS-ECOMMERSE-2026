import { Router } from 'express';
import {
  adminLogin,
  adminSessionHeartbeat,
  adminTotpEnable,
  adminTotpRecover,
  adminTotpSetup,
  adminTotpVerify,
} from '../controllers/adminAuthController.js';
import { adminAuthRateLimiter } from '../middleware/adminAuthRateLimiter.js';
import { protectAdmin } from '../middleware/protectAdmin.js';
import { requirePendingTotpToken } from '../middleware/requirePendingTotpToken.js';
import {
  adminBackupCodeSchema,
  adminLoginSchema,
  adminTotpCodeSchema,
  validateBody,
} from '../validators/schemas.js';

const router = Router();

router.use(adminAuthRateLimiter);

router.post('/login', validateBody(adminLoginSchema), adminLogin);

router.post(
  '/session/heartbeat',
  protectAdmin,
  adminSessionHeartbeat,
);

router.post(
  '/totp/setup',
  requirePendingTotpToken,
  adminTotpSetup,
);

router.post(
  '/totp/enable',
  requirePendingTotpToken,
  validateBody(adminTotpCodeSchema),
  adminTotpEnable,
);

router.post(
  '/totp/verify',
  requirePendingTotpToken,
  validateBody(adminTotpCodeSchema),
  adminTotpVerify,
);

router.post(
  '/totp/recover',
  requirePendingTotpToken,
  validateBody(adminBackupCodeSchema),
  adminTotpRecover,
);

export default router;
