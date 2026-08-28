import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import multer from 'multer';
import { randomBytes } from 'crypto';
import ApiError from './ApiError.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const uploadsRoot = path.resolve(__dirname, '../../uploads');
export const bannerUploadDir = path.join(uploadsRoot, 'banners');
export const categoryUploadDir = path.join(uploadsRoot, 'categories');
export const productImageUploadDir = path.join(uploadsRoot, 'products', 'images');
export const productVideoUploadDir = path.join(uploadsRoot, 'products', 'videos');

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

const bannerStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    fs.mkdirSync(bannerUploadDir, { recursive: true });
    cb(null, bannerUploadDir);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase() || '.jpg';
    const safeExt = ['.jpg', '.jpeg', '.png', '.webp'].includes(ext)
      ? ext
      : '.jpg';
    cb(null, `banner-${Date.now()}-${randomBytes(6).toString('hex')}${safeExt}`);
  },
});

const categoryStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    fs.mkdirSync(categoryUploadDir, { recursive: true });
    cb(null, categoryUploadDir);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase() || '.jpg';
    const safeExt = ['.jpg', '.jpeg', '.png', '.webp'].includes(ext)
      ? ext
      : '.jpg';
    cb(
      null,
      `category-${Date.now()}-${randomBytes(6).toString('hex')}${safeExt}`,
    );
  },
});

const productStorage = multer.diskStorage({
  destination: (_req, file, cb) => {
    const dir =
      file.fieldname === 'video' ? productVideoUploadDir : productImageUploadDir;
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const prefix = file.fieldname === 'video' ? 'product-video' : 'product-image';
    cb(null, `${prefix}-${Date.now()}-${randomBytes(6).toString('hex')}${ext || '.bin'}`);
  },
});

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
  storage: bannerStorage,
  fileFilter: bannerFileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

export const categoryUpload = multer({
  storage: categoryStorage,
  fileFilter: bannerFileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

export const productUpload = multer({
  storage: productStorage,
  fileFilter: productFileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024,
  },
});

export const productMediaUpload = productUpload.fields([
  { name: 'images', maxCount: 5 },
  { name: 'video', maxCount: 1 },
]);

export const buildBannerImageUrl = (filename) => `/uploads/banners/${filename}`;
export const buildCategoryImageUrl = (filename) =>
  `/uploads/categories/${filename}`;
export const buildProductImageUrl = (filename) =>
  `/uploads/products/images/${filename}`;
export const buildProductVideoUrl = (filename) =>
  `/uploads/products/videos/${filename}`;

const deleteUploadedFile = (fileUrl, expectedPrefix) => {
  if (!fileUrl?.startsWith(expectedPrefix)) {
    return;
  }

  const filePath = path.join(uploadsRoot, fileUrl.replace('/uploads/', ''));

  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
};

export const deleteBannerFile = (imageUrl) => {
  deleteUploadedFile(imageUrl, '/uploads/banners/');
};

export const deleteCategoryImageFile = (imageUrl) => {
  deleteUploadedFile(imageUrl, '/uploads/categories/');
};

export const deleteProductImageFile = (imageUrl) => {
  deleteUploadedFile(imageUrl, '/uploads/products/images/');
};

export const deleteProductVideoFile = (videoUrl) => {
  deleteUploadedFile(videoUrl, '/uploads/products/videos/');
};

export const deleteProductMedia = ({ images = [], videoUrl = null }) => {
  images.forEach(deleteProductImageFile);
  if (videoUrl) {
    deleteProductVideoFile(videoUrl);
  }
};
