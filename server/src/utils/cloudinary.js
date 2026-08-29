import { v2 as cloudinary } from 'cloudinary';
import config from '../config/index.js';

export const isCloudinaryUrl = (url) =>
  typeof url === 'string' && url.includes('res.cloudinary.com');

export const isCloudinaryConfigured = () =>
  Boolean(
    config.cloudinary.cloudName &&
      config.cloudinary.apiKey &&
      config.cloudinary.apiSecret,
  );

if (isCloudinaryConfigured()) {
  cloudinary.config({
    cloud_name: config.cloudinary.cloudName,
    api_key: config.cloudinary.apiKey,
    api_secret: config.cloudinary.apiSecret,
    secure: true,
  });
}

const buildPublicId = (originalname) => {
  const baseName = originalname?.replace(/\.[^.]+$/, '') || 'asset';
  return baseName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48);
};

export const uploadBufferToCloudinary = async (
  buffer,
  { folder, resourceType = 'image', originalname, publicId, overwrite = false },
) => {
  if (!isCloudinaryConfigured()) {
    throw new Error('Cloudinary is not configured');
  }

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: `${config.cloudinary.folder}/${folder}`,
        public_id: publicId || `${buildPublicId(originalname)}-${Date.now()}`,
        resource_type: resourceType,
        overwrite,
        unique_filename: !publicId,
      },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }

        resolve(result);
      },
    );

    uploadStream.end(buffer);
  });
};

const PERMISSION_DENIED_HINT =
  'Your Cloudinary API key is missing Upload (create) permission. In Cloudinary Console go to Settings -> API Keys, edit this key (or use the root Product Environment key) and allow Upload/create actions.';

export const getCloudinaryUploadForbiddenReason = async () => {
  if (!isCloudinaryConfigured()) {
    return null;
  }

  const auth = Buffer.from(
    `${config.cloudinary.apiKey}:${config.cloudinary.apiSecret}`,
  ).toString('base64');

  const form = new FormData();
  form.append(
    'file',
    new Blob([
      Buffer.from(
        'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
        'base64',
      ),
    ]),
    'permission-probe.png',
  );

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${config.cloudinary.cloudName}/image/upload`,
    {
      method: 'POST',
      headers: {
        Authorization: `Basic ${auth}`,
      },
      body: form,
    },
  );

  if (response.ok) {
    const body = await response.json();
    if (body.public_id) {
      await deleteCloudinaryResourceByPublicId(body.public_id, 'image');
    }
    return null;
  }

  const headerError = response.headers.get('x-cld-error');
  if (headerError) {
    return headerError;
  }

  const body = await response.json().catch(() => null);
  return body?.error?.message ?? `HTTP ${response.status}`;
};

export const assertCloudinaryUploadPermission = async () => {
  const reason = await getCloudinaryUploadForbiddenReason();

  if (!reason) {
    return;
  }

  throw new Error(`${reason}\n\n${PERMISSION_DENIED_HINT}`);
};

export const enhanceCloudinaryUploadError = (error) => {
  if (error?.http_code !== 403 && error?.name !== 'UnexpectedResponse') {
    return error;
  }

  return new Error(
    `Cloudinary upload was forbidden (HTTP 403). ${PERMISSION_DENIED_HINT}`,
  );
};

export const buildCloudinaryDeliveryUrl = (
  publicId,
  { width, height, crop = 'limit', resourceType = 'image' } = {},
) => {
  if (!publicId || !isCloudinaryConfigured()) {
    return null;
  }

  const transformation = [{ fetch_format: 'auto', quality: 'auto' }];

  if (width) {
    transformation.push({ width, crop });
  }

  if (height) {
    transformation.push({ height, crop });
  }

  return cloudinary.url(publicId, {
    secure: true,
    resource_type: resourceType,
    transformation,
  });
};

export const deleteCloudinaryResourceByPublicId = async (
  publicId,
  resourceType = 'image',
) => {
  if (!publicId || !isCloudinaryConfigured()) {
    return;
  }

  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
  } catch {
    // Ignore missing assets during replacement/delete flows.
  }
};

export const deleteCloudinaryResource = async (url, resourceType = 'image') => {
  if (!url || !isCloudinaryUrl(url) || !isCloudinaryConfigured()) {
    return;
  }

  const publicId = cloudinary.utils.public_id_from_url(url);

  if (!publicId) {
    return;
  }

  await deleteCloudinaryResourceByPublicId(publicId, resourceType);
};

export const optimizeCloudinaryUrl = (url, { width, height, crop = 'limit' } = {}) => {
  if (!isCloudinaryUrl(url)) {
    return url;
  }

  if (url.includes('/upload/f_auto,q_auto') || url.includes('/upload/w_')) {
    return url;
  }

  const transforms = ['f_auto', 'q_auto'];

  if (width) {
    transforms.push(`w_${width}`);
  }

  if (height) {
    transforms.push(`h_${height}`);
  }

  if (width || height) {
    transforms.push(`c_${crop}`);
  }

  return url.replace('/upload/', `/upload/${transforms.join(',')}/`);
};
