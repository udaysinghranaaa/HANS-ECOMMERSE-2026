import catchAsync from '../utils/catchAsync.js';
import { loginAdmin } from '../services/adminAuthService.js';

export const adminLogin = catchAsync(async (req, res) => {
  const result = await loginAdmin(req.body);

  res.status(200).json({
    success: true,
    message: 'Admin logged in successfully',
    data: result,
  });
});
