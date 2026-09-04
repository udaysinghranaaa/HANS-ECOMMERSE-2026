import jwt from 'jsonwebtoken';
import config from '../config/index.js';

export const TOTP_VERIFICATION_TTL_MS = 5 * 60 * 1000;

export const isTotpVerificationFresh = (totpVerifiedAt) => {
  if (!totpVerifiedAt) {
    return false;
  }

  return Date.now() - totpVerifiedAt * 1000 <= TOTP_VERIFICATION_TTL_MS;
};

export const signAdminToken = (adminId) =>
  jwt.sign(
    {
      id: adminId,
      role: 'admin',
      stage: 'authenticated',
      totpVerified: true,
      totpVerifiedAt: Math.floor(Date.now() / 1000),
    },
    config.jwt.secret,
    { expiresIn: config.jwt.expiresIn },
  );

export const signPendingTotpToken = (adminId) =>
  jwt.sign(
    { id: adminId, role: 'admin', stage: 'totp_pending' },
    config.jwt.secret,
    { expiresIn: '5m' },
  );

export const verifyAdminToken = (token) =>
  jwt.verify(token, config.jwt.secret);

export const verifyPendingTotpToken = (token) =>
  jwt.verify(token, config.jwt.secret);
