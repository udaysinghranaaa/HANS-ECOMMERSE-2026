import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import multer from 'multer';
import { randomBytes } from 'crypto';
import ApiError from './ApiError.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const uploadsRoot = path.resolve(__dirname, '../../uploads');
export const bannerUploadDir = path.join(uploadsRoot, 'banners');

const allowedMimeTypes = new Set([
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
]);

const storage = multer.diskStorage({
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

const fileFilter = (_req, file, cb) => {
  if (allowedMimeTypes.has(file.mimetype)) {
    cb(null, true);
    return;
  }

  cb(new ApiError(400, 'Only JPG, JPEG, PNG and WEBP images are allowed'));
};

export const bannerUpload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

export const buildBannerImageUrl = (filename) => `/uploads/banners/${filename}`;

export const deleteBannerFile = (imageUrl) => {
  if (!imageUrl?.startsWith('/uploads/banners/')) {
    return;
  }

  const filename = path.basename(imageUrl);
  const filePath = path.join(bannerUploadDir, filename);

  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
};
