import jwt from 'jsonwebtoken';
import config from '../config/index.js';

export const ADMIN_SESSION_INACTIVITY_MS = 5 * 60 * 1000;

export const isAdminSessionActive = (lastActivityAt) => {
  if (!lastActivityAt) {
    return false;
  }

  return Date.now() - lastActivityAt * 1000 <= ADMIN_SESSION_INACTIVITY_MS;
};

export const signAdminToken = (adminId) =>
  jwt.sign(
    {
      id: adminId,
      role: 'admin',
      stage: 'authenticated',
      totpVerified: true,
      lastActivityAt: Math.floor(Date.now() / 1000),
    },
    config.jwt.secret,
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
