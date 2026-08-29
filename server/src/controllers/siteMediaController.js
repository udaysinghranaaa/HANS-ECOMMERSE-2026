import catchAsync from '../utils/catchAsync.js';
import { getPublicSiteMedia } from '../services/siteMediaService.js';

export const getSiteMedia = catchAsync(async (_req, res) => {
  const media = await getPublicSiteMedia();

  res.status(200).json({
    success: true,
    data: media,
  });
});
