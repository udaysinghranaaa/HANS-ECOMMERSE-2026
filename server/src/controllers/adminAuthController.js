import catchAsync from '../utils/catchAsync.js';
import { loginAdmin } from '../services/adminAuthService.js';
import {
  enableAdminTotp,
  recoverAdminWithBackupCode,
  setupAdminTotp,
  verifyAdminTotp,
} from '../services/adminTotpService.js';

export const adminLogin = catchAsync(async (req, res) => {
  const result = await loginAdmin(req.body);

  res.status(200).json({
    success: true,
    message: 'Credentials verified. Complete two-factor authentication.',
    data: result,
  });
});

export const adminTotpSetup = catchAsync(async (req, res) => {
  const result = await setupAdminTotp(req.adminId);

  res.status(200).json({
    success: true,
    message: 'Scan the QR code with your authenticator app',
    data: result,
  });
});

export const adminTotpEnable = catchAsync(async (req, res) => {
  const result = await enableAdminTotp(req.adminId, req.body.code);

  res.status(200).json({
    success: true,
    message: 'Two-factor authentication enabled successfully',
    data: result,
  });
});

export const adminTotpVerify = catchAsync(async (req, res) => {
  const result = await verifyAdminTotp(req.adminId, req.body.code);

  res.status(200).json({
    success: true,
    message: 'Two-factor authentication verified',
    data: result,
  });
});

export const adminTotpRecover = catchAsync(async (req, res) => {
  const result = await recoverAdminWithBackupCode(
    req.adminId,
    req.body.backupCode,
  );

  res.status(200).json({
    success: true,
    message: 'Backup recovery code accepted',
    data: result,
  });
});
