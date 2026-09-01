import { z } from 'zod';

export const adminLoginSchema = z.object({
  email: z.string().trim().email('A valid admin email is required'),
  password: z.string().min(1, 'Password is required'),
});

export const adminTotpCodeSchema = z.object({
  code: z
    .string()
    .trim()
    .regex(/^\d{6}$/, 'Enter a valid 6-digit authenticator code'),
});

export const adminBackupCodeSchema = z.object({
  backupCode: z
    .string()
    .trim()
    .min(6, 'Enter a valid backup recovery code')
    .max(12, 'Enter a valid backup recovery code'),
});

export const contactEnquirySchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .max(120, 'Name is too long'),
  email: z.string().trim().email('A valid email is required'),
  phone: z
    .string()
    .trim()
    .min(10, 'Enter a valid phone number')
    .max(20, 'Phone number is too long')
    .regex(/^[\d+\s()-]+$/, 'Enter a valid phone number'),
  message: z
    .string()
    .trim()
    .min(10, 'Please describe your requirement')
    .max(2000, 'Message is too long'),
  enquiryType: z.enum(['contact', 'distributor', 'product', 'quote']).optional(),
  formSource: z.enum(['siteSurvey']).optional(),
  productName: z.string().trim().max(200).optional(),
});

export const homepageBannerUpdateSchema = z.object({
  title: z.string().trim().min(1).max(120).optional(),
  isActive: z
    .union([z.boolean(), z.enum(['true', 'false'])])
    .optional()
    .transform((value) => {
      if (value === undefined) {
        return undefined;
      }

      if (typeof value === 'boolean') {
        return value;
      }

      return value === 'true';
    }),
});

export const updateEnquiryStatusSchema = z.object({
  status: z.enum(
    ['NEW', 'CONTACTED', 'IN_PROGRESS', 'CONVERTED', 'CLOSED'],
    {
      message: 'A valid enquiry status is required',
    },
  ),
});

export const validateBody = (schema) => (req, _res, next) => {
  const result = schema.safeParse(req.body);

  if (!result.success) {
    const message = result.error.issues[0]?.message || 'Invalid request body';
    const error = new Error(message);
    error.statusCode = 400;
    return next(error);
  }

  req.body = result.data;
  next();
};
