import jwt from 'jsonwebtoken';
import config from '../config/index.js';

export const signAdminToken = (adminId) =>
  jwt.sign({ id: adminId, role: 'admin' }, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
  });

export const verifyAdminToken = (token) =>
  jwt.verify(token, config.jwt.secret);
