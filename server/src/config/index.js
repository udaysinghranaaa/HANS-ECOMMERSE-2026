import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const stripEnv = (value) => value?.trim().replace(/^["']|["']$/g, '') ?? '';

const normalizeOrigin = (value) => stripEnv(value).replace(/\/+$/, '');

const parseClientUrls = (value) => {
  const raw = stripEnv(value) || 'http://localhost:5173';

  return raw
    .split(',')
    .map((entry) => normalizeOrigin(entry))
    .filter(Boolean);
};

const clientUrls = parseClientUrls(process.env.CLIENT_URL);

const jwtSecret = stripEnv(process.env.JWT_SECRET);
const totpEncryptionKeyFromEnv =
  stripEnv(process.env.TOTP_ENCRYPTION_KEY) ||
  stripEnv(process.env.ENCRYPTION_KEY);
const totpEncryptionKey = totpEncryptionKeyFromEnv || jwtSecret;

const config = {
  env: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT) || 5000,
  mongodbUri: process.env.MONGODB_URI?.trim().replace(/^["']|["']$/g, ''),
  jwt: {
    secret: jwtSecret,
  },
  totp: {
    encryptionKey: totpEncryptionKey,
    encryptionKeySource: stripEnv(process.env.TOTP_ENCRYPTION_KEY)
      ? 'TOTP_ENCRYPTION_KEY'
      : stripEnv(process.env.ENCRYPTION_KEY)
        ? 'ENCRYPTION_KEY'
        : 'JWT_SECRET',
  },
  clientUrls,
  clientUrl: clientUrls[0],
  serverUrl: stripEnv(process.env.SERVER_URL) || 'http://localhost:5000',
  admin: {
    email: process.env.ADMIN_EMAIL?.trim().toLowerCase(),
    password: process.env.ADMIN_PASSWORD,
    name: process.env.ADMIN_NAME?.trim() || 'HANS Solar Admin',
  },
  cloudinary: {
    cloudName: stripEnv(process.env.CLOUDINARY_CLOUD_NAME),
    apiKey: stripEnv(process.env.CLOUDINARY_API_KEY),
    apiSecret: stripEnv(process.env.CLOUDINARY_API_SECRET),
    folder: stripEnv(process.env.CLOUDINARY_FOLDER) || 'hans-solar',
  },
};

export default config;
