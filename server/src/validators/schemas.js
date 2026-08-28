import { z } from 'zod';

export const adminLoginSchema = z.object({
  email: z.string().trim().email('A valid admin email is required'),
  password: z.string().min(1, 'Password is required'),
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
