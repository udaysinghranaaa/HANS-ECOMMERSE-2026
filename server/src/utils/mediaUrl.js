import { v2 as cloudinary } from 'cloudinary';
import config from '../config/index.js';
import {
  isCloudinaryConfigured,
  isCloudinaryUrl,
  optimizeCloudinaryUrl,
} from './cloudinary.js';

export const toAbsoluteMediaUrl = (
  mediaUrl,
  updatedAt,
  { width, height } = {},
) => {
  if (!mediaUrl) {
    return null;
  }

  let baseUrl =
    mediaUrl.startsWith('http://') || mediaUrl.startsWith('https://')
      ? mediaUrl
      : `${config.serverUrl}${mediaUrl}`;

  if (isCloudinaryUrl(baseUrl)) {
    return optimizeCloudinaryUrl(baseUrl, { width, height });
  }

  const version = updatedAt ? new Date(updatedAt).getTime() : Date.now();
  const separator = baseUrl.includes('?') ? '&' : '?';
  return `${baseUrl}${separator}v=${version}`;
};

export const normalizeStoredMediaUrl = (url) => {
  if (!url) {
    return '';
  }

  if (url.startsWith('/uploads/')) {
    return url.split('?')[0];
  }

  if (isCloudinaryUrl(url)) {
    const cleanUrl = url.split('?')[0];

    if (isCloudinaryConfigured()) {
      const publicId = cloudinary.utils.public_id_from_url(cleanUrl);

      if (publicId) {
        const resourceType = cleanUrl.includes('/video/upload/') ? 'video' : 'image';
        return cloudinary.url(publicId, {
          secure: true,
          resource_type: resourceType,
        });
      }
    }

    return cleanUrl.replace(/\/upload\/(?:(?!v\d+\/)[^/]+\/)+/, '/upload/');
  }

  try {
    const parsed = new URL(url);
    return `${parsed.origin}${parsed.pathname}`;
  } catch {
    return url.split('?')[0];
  }
};
