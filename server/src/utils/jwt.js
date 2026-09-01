import jwt from 'jsonwebtoken';
import config from '../config/index.js';

export const signAdminToken = (adminId) =>
  jwt.sign(
    { id: adminId, role: 'admin', stage: 'authenticated', totpVerified: true },
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
