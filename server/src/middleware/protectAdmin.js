import jwt from 'jsonwebtoken';
import prisma from '../config/prisma.js';
import config from '../config/index.js';
import ApiError from '../utils/ApiError.js';
import catchAsync from '../utils/catchAsync.js';
import { verifyAdminToken } from '../utils/jwt.js';

export const protectAdmin = catchAsync(async (req, _res, next) => {
  if (!config.jwt.secret) {
    throw new ApiError(500, 'JWT secret is not configured on the server');
  }

  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    throw new ApiError(401, 'Admin authentication required');
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = verifyAdminToken(token);

    if (decoded.role !== 'admin') {
      throw new ApiError(403, 'Admin access denied');
    }

    if (decoded.stage !== 'authenticated' || !decoded.totpVerified) {
      throw new ApiError(401, 'Admin authentication required');
    }

    const admin = await prisma.admin.findUnique({
      where: { id: decoded.id },
      select: { id: true, name: true, email: true },
    });

    if (!admin) {
      throw new ApiError(401, 'Admin account no longer exists');
    }

    req.admin = admin;
    next();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    if (error instanceof jwt.JsonWebTokenError) {
      throw new ApiError(401, 'Invalid or expired admin token');
    }

    throw error;
  }
});
