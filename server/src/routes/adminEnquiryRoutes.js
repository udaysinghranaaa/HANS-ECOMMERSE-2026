import { Router } from 'express';
import {
  deleteEnquiryHandler,
  getAdminEnquiriesHandler,
  updateEnquiryStatusHandler,
} from '../controllers/enquiryController.js';
import { protectAdmin } from '../middleware/protectAdmin.js';
import { updateEnquiryStatusSchema, validateBody } from '../validators/schemas.js';

const router = Router();

router.use(protectAdmin);

router.get('/', getAdminEnquiriesHandler);
router.patch(
  '/:id/status',
  validateBody(updateEnquiryStatusSchema),
  updateEnquiryStatusHandler,
);
router.delete('/:id', deleteEnquiryHandler);

export default router;
