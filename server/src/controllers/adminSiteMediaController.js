import catchAsync from '../utils/catchAsync.js';
import {
  getAdminSiteMediaList,
  upsertSiteMediaAsset,
} from '../services/siteMediaService.js';

export const getAdminSiteMediaHandler = catchAsync(async (_req, res) => {
  const assets = await getAdminSiteMediaList();

  res.status(200).json({
    success: true,
    data: { assets },
  });
});

export const upsertAdminSiteMediaHandler = catchAsync(async (req, res) => {
  const asset = await upsertSiteMediaAsset(req.params.key, req.file, {
    alt: req.body.alt,
  });

  res.status(200).json({
    success: true,
    message: 'Site image updated successfully',
    data: { asset },
  });
});
