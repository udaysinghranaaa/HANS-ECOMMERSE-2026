import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { createContactEnquiryHandler } from '../controllers/enquiryController.js';
import { contactEnquirySchema, validateBody } from '../validators/schemas.js';

const router = Router();

const contactEnquiryLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many enquiry submissions. Please try again later.',
  },
});

router.post(
  '/enquiries',
  contactEnquiryLimiter,
  validateBody(contactEnquirySchema),
  createContactEnquiryHandler,
);

export default router;
