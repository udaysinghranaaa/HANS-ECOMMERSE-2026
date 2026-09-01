import jwt from 'jsonwebtoken';
import ApiError from '../utils/ApiError.js';
import catchAsync from '../utils/catchAsync.js';
import { verifyPendingTotpToken } from '../utils/jwt.js';

export const requirePendingTotpToken = catchAsync(async (req, _res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    throw new ApiError(401, 'Two-factor authentication session required');
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = verifyPendingTotpToken(token);

    if (decoded.role !== 'admin' || decoded.stage !== 'totp_pending') {
      throw new ApiError(401, 'Invalid two-factor authentication session');
    }

    req.adminId = decoded.id;
    next();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    if (error instanceof jwt.TokenExpiredError) {
      throw new ApiError(401, 'Two-factor session expired. Please sign in again.');
    }

    throw new ApiError(401, 'Invalid two-factor authentication session');
  }
});
