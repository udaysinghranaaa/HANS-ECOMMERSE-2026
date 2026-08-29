import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  assertCloudinaryUploadPermission,
  isCloudinaryConfigured,
} from '../src/utils/cloudinary.js';
import { GALLERY_COUNT } from '../src/constants/siteMediaAssets.js';
import { seedSiteMediaFromFile } from '../src/services/siteMediaService.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const clientPublicDir = path.resolve(__dirname, '../../client/public');

if (!isCloudinaryConfigured()) {
  console.error(
    'Cloudinary is not configured. Add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET to server/.env.',
  );
  process.exit(1);
}

const testOnly = process.argv.includes('--test');

const staticAssets = [
  { key: 'logo', filePath: path.join(clientPublicDir, 'logo.jpg') },
  ...Array.from({ length: GALLERY_COUNT }, (_, index) => ({
    key: `gallery-${index + 1}`,
    filePath: path.join(clientPublicDir, `s${index + 1}.webp`),
  })),
];

const run = async () => {
  console.log('Checking Cloudinary upload permission...');
  await assertCloudinaryUploadPermission();
  console.log('Upload permission OK.');

  const assetsToUpload = testOnly ? staticAssets.slice(0, 1) : staticAssets;

  console.log(
    testOnly
      ? 'Uploading one test site asset to Cloudinary...'
      : 'Uploading static website assets to Cloudinary...',
  );

  for (const asset of assetsToUpload) {
    if (!fs.existsSync(asset.filePath)) {
      console.warn(`Skipped missing file: ${asset.filePath}`);
      continue;
    }

    const result = await seedSiteMediaFromFile(
      asset.key,
      asset.filePath,
      path.basename(asset.filePath),
    );

    console.log(`${path.basename(asset.filePath)} -> ${result.imageUrl}`);
  }

  console.log(
    testOnly
      ? 'Test upload complete.'
      : 'Done. Static assets are stored in the database and served via GET /api/v1/site/media.',
  );
};

run().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});
