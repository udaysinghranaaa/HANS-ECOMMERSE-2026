import catchAsync from '../utils/catchAsync.js';

export const getHealth = catchAsync(async (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'HANS Solar API is running',
  });
});
