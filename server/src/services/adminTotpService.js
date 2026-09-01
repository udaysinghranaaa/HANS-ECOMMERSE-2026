import bcrypt from 'bcryptjs';
import QRCode from 'qrcode';
import { generateSecret, generateURI, verifySync } from 'otplib';
import prisma from '../config/prisma.js';
import ApiError from '../utils/ApiError.js';
import { generateBackupCodes, verifyBackupCode } from '../utils/backupCodes.js';
import {
  decryptTotpSecretOrThrow,
  encryptTotpSecret,
} from '../utils/totpCrypto.js';
import { signAdminToken } from '../utils/jwt.js';

const TOTP_ISSUER = 'HANS Solar Energy';

const getAdminProfile = (admin) => ({
  id: admin.id,
  name: admin.name,
  email: admin.email,
});

const issueAuthenticatedSession = (admin) => ({
  token: signAdminToken(admin.id),
  admin: getAdminProfile(admin),
});

const verifyTotpCode = (token, secret) => {
  const normalizedToken = token.trim();

  if (!/^\d{6}$/.test(normalizedToken)) {
    return false;
  }

  return verifySync({ token: normalizedToken, secret }).valid === true;
};

export const setupAdminTotp = async (adminId) => {
  const admin = await prisma.admin.findUnique({ where: { id: adminId } });

  if (!admin) {
    throw new ApiError(401, 'Admin account no longer exists');
  }

  if (admin.totpEnabled) {
    throw new ApiError(400, 'Two-factor authentication is already enabled');
  }

  const secret = generateSecret();
  const encryptedSecret = encryptTotpSecret(secret);

  await prisma.admin.update({
    where: { id: adminId },
    data: {
      totpSecretEncrypted: encryptedSecret,
      totpEnabled: false,
      backupCodesHashed: [],
    },
  });

  const otpauthUrl = generateURI({
    issuer: TOTP_ISSUER,
    label: admin.email,
    secret,
  });
  const qrCodeDataUrl = await QRCode.toDataURL(otpauthUrl);

  return {
    qrCodeDataUrl,
    manualEntryKey: secret,
    issuer: TOTP_ISSUER,
    accountName: admin.email,
  };
};

export const enableAdminTotp = async (adminId, code) => {
  const admin = await prisma.admin.findUnique({ where: { id: adminId } });

  if (!admin) {
    throw new ApiError(401, 'Admin account no longer exists');
  }

  if (admin.totpEnabled) {
    throw new ApiError(400, 'Two-factor authentication is already enabled');
  }

  const secret = decryptTotpSecretOrThrow(admin.totpSecretEncrypted);

  if (!secret) {
    throw new ApiError(400, 'Two-factor setup has not been initiated');
  }

  if (!verifyTotpCode(code, secret)) {
    throw new ApiError(401, 'Invalid authenticator code');
  }

  const { plainCodes, hashedCodes } = await generateBackupCodes();

  const updatedAdmin = await prisma.admin.update({
    where: { id: adminId },
    data: {
      totpEnabled: true,
      backupCodesHashed: hashedCodes,
    },
  });

  return {
    ...issueAuthenticatedSession(updatedAdmin),
    backupCodes: plainCodes,
  };
};

export const verifyAdminTotp = async (adminId, code) => {
  const admin = await prisma.admin.findUnique({ where: { id: adminId } });

  if (!admin) {
    throw new ApiError(401, 'Admin account no longer exists');
  }

  if (!admin.totpEnabled) {
    throw new ApiError(400, 'Two-factor authentication is not enabled');
  }

  const secret = decryptTotpSecretOrThrow(admin.totpSecretEncrypted);

  if (!secret || !verifyTotpCode(code, secret)) {
    throw new ApiError(401, 'Invalid authenticator code');
  }

  return issueAuthenticatedSession(admin);
};

export const recoverAdminWithBackupCode = async (adminId, backupCode) => {
  const admin = await prisma.admin.findUnique({ where: { id: adminId } });

  if (!admin) {
    throw new ApiError(401, 'Admin account no longer exists');
  }

  if (!admin.totpEnabled || admin.backupCodesHashed.length === 0) {
    throw new ApiError(400, 'Backup recovery is not available');
  }

  const matchedIndex = await verifyBackupCode(
    backupCode,
    admin.backupCodesHashed,
  );

  if (matchedIndex === -1) {
    throw new ApiError(401, 'Invalid backup recovery code');
  }

  const remainingCodes = admin.backupCodesHashed.filter(
    (_, index) => index !== matchedIndex,
  );

  const updatedAdmin = await prisma.admin.update({
    where: { id: adminId },
    data: { backupCodesHashed: remainingCodes },
  });

  return issueAuthenticatedSession(updatedAdmin);
};
