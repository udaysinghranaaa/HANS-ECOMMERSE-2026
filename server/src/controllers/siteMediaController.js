import catchAsync from '../utils/catchAsync.js';
import { setPublicJsonCache } from '../utils/publicCache.js';
import { getPublicSiteMedia } from '../services/siteMediaService.js';

export const getSiteMedia = catchAsync(async (_req, res) => {
  const media = await getPublicSiteMedia();

  setPublicJsonCache(res, 300);
  res.status(200).json({
    success: true,
    data: media,
  });
});
