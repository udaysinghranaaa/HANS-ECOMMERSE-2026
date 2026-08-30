import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import multer from 'multer';
import { randomBytes } from 'crypto';
import ApiError from './ApiError.js';
import {
  deleteCloudinaryResource,
  deleteCloudinaryResourceByPublicId,
  isCloudinaryConfigured,
  isCloudinaryUrl,
  uploadBufferToCloudinary,
} from './cloudinary.js';
import { isYouTubeVideoUrl } from './videoUrl.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const uploadsRoot = path.resolve(__dirname, '../../uploads');
export const bannerUploadDir = path.join(uploadsRoot, 'banners');
export const categoryUploadDir = path.join(uploadsRoot, 'categories');
export const festivalUploadDir = path.join(uploadsRoot, 'festivals');
export const productImageUploadDir = path.join(uploadsRoot, 'products', 'images');
export const productVideoUploadDir = path.join(uploadsRoot, 'products', 'videos');

const FOLDER_MAP = {
  banners: bannerUploadDir,
  categories: categoryUploadDir,
  festivals: festivalUploadDir,
  'products/images': productImageUploadDir,
  'products/videos': productVideoUploadDir,
};

const allowedImageMimeTypes = new Set([
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
]);

const allowedVideoMimeTypes = new Set([
  'video/mp4',
  'video/webm',
  'video/quicktime',
]);

const memoryStorage = multer.memoryStorage();

const bannerFileFilter = (_req, file, cb) => {
  if (allowedImageMimeTypes.has(file.mimetype)) {
    cb(null, true);
    return;
  }

  cb(new ApiError(400, 'Only JPG, JPEG, PNG and WEBP images are allowed'));
};

const productFileFilter = (_req, file, cb) => {
  if (file.fieldname === 'video') {
    if (allowedVideoMimeTypes.has(file.mimetype)) {
      cb(null, true);
      return;
    }

    cb(new ApiError(400, 'Only MP4, WEBM and MOV videos are allowed'));
    return;
  }

  if (allowedImageMimeTypes.has(file.mimetype)) {
    cb(null, true);
    return;
  }

  cb(new ApiError(400, 'Only JPG, JPEG, PNG and WEBP images are allowed'));
};

export const bannerUpload = multer({
  storage: memoryStorage,
  fileFilter: bannerFileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

export const categoryUpload = multer({
  storage: memoryStorage,
  fileFilter: bannerFileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

export const festivalUpload = multer({
  storage: memoryStorage,
  fileFilter: bannerFileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

export const productUpload = multer({
  storage: memoryStorage,
  fileFilter: productFileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024,
  },
});

export const productMediaUpload = productUpload.fields([
  { name: 'images', maxCount: 5 },
  { name: 'video', maxCount: 1 },
]);

const getSafeExtension = (originalname, fallback = '.jpg') => {
  const ext = path.extname(originalname || '').toLowerCase();
  return ext || fallback;
};

const writeLocalFile = (file, folder, prefix) => {
  const uploadDir = FOLDER_MAP[folder];

  if (!uploadDir) {
    throw new ApiError(500, 'Unsupported upload folder');
  }

  fs.mkdirSync(uploadDir, { recursive: true });

  const ext = getSafeExtension(file.originalname, folder.includes('video') ? '.mp4' : '.jpg');
  const filename = `${prefix}-${Date.now()}-${randomBytes(6).toString('hex')}${ext}`;
  fs.writeFileSync(path.join(uploadDir, filename), file.buffer);

  return `/uploads/${folder}/${filename}`;
};

export const buildBannerImageUrl = (filename) => `/uploads/banners/${filename}`;
export const buildCategoryImageUrl = (filename) =>
  `/uploads/categories/${filename}`;
export const buildFestivalImageUrl = (filename) =>
  `/uploads/festivals/${filename}`;
export const buildProductImageUrl = (filename) =>
  `/uploads/products/images/${filename}`;
export const buildProductVideoUrl = (filename) =>
  `/uploads/products/videos/${filename}`;

const CLOUDINARY_CONFIG_ERROR =
  'Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET in server/.env';

export const persistUploadedImage = async (file, folder) => {
  if (!file?.buffer) {
    throw new ApiError(400, 'Uploaded image file is missing');
  }

  if (!isCloudinaryConfigured()) {
    throw new ApiError(500, CLOUDINARY_CONFIG_ERROR);
  }

  const result = await uploadBufferToCloudinary(file.buffer, {
    folder,
    resourceType: 'image',
    originalname: file.originalname,
  });

  return {
    url: result.secure_url,
    publicId: result.public_id,
  };
};

export const persistUploadedVideo = async (file) => {
  if (!file?.buffer) {
    throw new ApiError(400, 'Uploaded video file is missing');
  }

  if (!isCloudinaryConfigured()) {
    throw new ApiError(500, CLOUDINARY_CONFIG_ERROR);
  }

  const result = await uploadBufferToCloudinary(file.buffer, {
    folder: 'products/videos',
    resourceType: 'video',
    originalname: file.originalname,
  });

  return {
    url: result.secure_url,
    publicId: result.public_id,
  };
};

export const persistSiteMediaImage = async (file, { folder, publicId }) => {
  if (!file?.buffer) {
    throw new ApiError(400, 'Uploaded image file is missing');
  }

  if (!folder || !publicId) {
    throw new ApiError(500, 'Site media upload target is not configured');
  }

  if (!isCloudinaryConfigured()) {
    throw new ApiError(500, CLOUDINARY_CONFIG_ERROR);
  }

  const result = await uploadBufferToCloudinary(file.buffer, {
    folder,
    resourceType: 'image',
    originalname: file.originalname,
    publicId,
    overwrite: true,
  });

  return {
    url: result.secure_url,
    publicId: result.public_id,
  };
};

const deleteLocalUploadedFile = (fileUrl, expectedPrefix) => {
  if (!fileUrl?.startsWith(expectedPrefix)) {
    return;
  }

  const filePath = path.join(uploadsRoot, fileUrl.replace('/uploads/', ''));

  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
};

export const deleteBannerFile = async (imageUrl, publicId = null) => {
  if (publicId) {
    await deleteCloudinaryResourceByPublicId(publicId, 'image');
    return;
  }

  if (isCloudinaryUrl(imageUrl)) {
    await deleteCloudinaryResource(imageUrl, 'image');
    return;
  }

  deleteLocalUploadedFile(imageUrl, '/uploads/banners/');
};

export const deleteCategoryImageFile = async (imageUrl, publicId = null) => {
  if (publicId) {
    await deleteCloudinaryResourceByPublicId(publicId, 'image');
    return;
  }

  if (isCloudinaryUrl(imageUrl)) {
    await deleteCloudinaryResource(imageUrl, 'image');
    return;
  }

  deleteLocalUploadedFile(imageUrl, '/uploads/categories/');
};

export const deleteFestivalImageFile = async (imageUrl, publicId = null) => {
  if (publicId) {
    await deleteCloudinaryResourceByPublicId(publicId, 'image');
    return;
  }

  if (isCloudinaryUrl(imageUrl)) {
    await deleteCloudinaryResource(imageUrl, 'image');
    return;
  }

  deleteLocalUploadedFile(imageUrl, '/uploads/festivals/');
};

export const deleteProductImageFile = async (imageUrl, publicId = null) => {
  if (publicId) {
    await deleteCloudinaryResourceByPublicId(publicId, 'image');
    return;
  }

  if (isCloudinaryUrl(imageUrl)) {
    await deleteCloudinaryResource(imageUrl, 'image');
    return;
  }

  deleteLocalUploadedFile(imageUrl, '/uploads/products/images/');
};

export const deleteProductVideoFile = async (videoUrl, publicId = null) => {
  if (publicId) {
    await deleteCloudinaryResourceByPublicId(publicId, 'video');
    return;
  }

  if (isCloudinaryUrl(videoUrl)) {
    await deleteCloudinaryResource(videoUrl, 'video');
    return;
  }

  deleteLocalUploadedFile(videoUrl, '/uploads/products/videos/');
};

export const deleteSiteMediaFile = async (imageUrl, publicId = null) => {
  if (publicId) {
    await deleteCloudinaryResourceByPublicId(publicId, 'image');
    return;
  }

  if (isCloudinaryUrl(imageUrl)) {
    await deleteCloudinaryResource(imageUrl, 'image');
  }
};

export const deleteProductMedia = async ({
  images = [],
  imagePublicIds = [],
  videoUrl = null,
  videoPublicId = null,
}) => {
  await Promise.all(
    images.map((image, index) =>
      deleteProductImageFile(image, imagePublicIds[index] ?? null),
    ),
  );

  if (videoUrl && !isYouTubeVideoUrl(videoUrl)) {
    await deleteProductVideoFile(videoUrl, videoPublicId);
  }
};
