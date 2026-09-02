import catchAsync from '../utils/catchAsync.js';
import ApiError from '../utils/ApiError.js';
import { setPublicJsonCache } from '../utils/publicCache.js';
import {
  deleteHomepageBannerByPosition,
  getAdminHomepageBanners,
  getPublicHomepageBanners,
  updateHomepageBannerByPosition,
  upsertHomepageBanner,
} from '../services/homepageBannerService.js';

const parsePosition = (value) => {
  const position = Number.parseInt(value, 10);

  if (!Number.isInteger(position) || position < 1 || position > 4) {
    throw new ApiError(400, 'Banner position must be between 1 and 4');
  }

  return position;
};

export const getPublicHomepageBannersHandler = catchAsync(async (_req, res) => {
  const banners = await getPublicHomepageBanners();

  setPublicJsonCache(res, 120);
  res.status(200).json({
    success: true,
    data: { banners },
  });
});

export const getAdminHomepageBannersHandler = catchAsync(async (_req, res) => {
  const slots = await getAdminHomepageBanners();

  res.status(200).json({
    success: true,
    data: { slots },
  });
});

export const upsertAdminHomepageBanner = catchAsync(async (req, res) => {
  if (!req.file) {
    throw new ApiError(400, 'Banner image is required');
  }

  const position = parsePosition(req.params.position);
  const title = req.body.title?.trim() || `Banner ${position}`;

  const banner = await upsertHomepageBanner({
    position,
    title,
    imageFile: req.file,
    linkType: req.body.linkType,
    linkTargetId: req.body.linkTargetId,
    linkUrl: req.body.linkUrl,
  });

  res.status(200).json({
    success: true,
    message: `Banner ${position} published successfully`,
    data: { banner },
  });
});

export const updateAdminHomepageBanner = catchAsync(async (req, res) => {
  const position = parsePosition(req.params.position);
  const banner = await updateHomepageBannerByPosition(position, req.body);

  res.status(200).json({
    success: true,
    message: `Banner ${position} updated successfully`,
    data: { banner },
  });
});

export const deleteAdminHomepageBanner = catchAsync(async (req, res) => {
  const position = parsePosition(req.params.position);
  const result = await deleteHomepageBannerByPosition(position);

  res.status(200).json({
    success: true,
    message: result.message,
  });
});
