import { Router } from 'express';
import {
  adminLogin,
  adminTotpEnable,
  adminTotpRecover,
  adminTotpSetup,
  adminTotpVerify,
} from '../controllers/adminAuthController.js';
import { adminAuthRateLimiter } from '../middleware/adminAuthRateLimiter.js';
import {
  requireAdminTotpVerification,
  requirePendingTotpToken,
} from '../middleware/requirePendingTotpToken.js';
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
  requireAdminTotpVerification,
  validateBody(adminTotpCodeSchema),
  adminTotpVerify,
);

router.post(
  '/totp/recover',
  requireAdminTotpVerification,
  validateBody(adminBackupCodeSchema),
  adminTotpRecover,
);

export default router;
