import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const stripEnv = (value) => value?.trim().replace(/^["']|["']$/g, '') ?? '';

const parseClientUrls = (value) => {
  const raw = stripEnv(value) || 'http://localhost:5173';

  return raw
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean);
};

const clientUrls = parseClientUrls(process.env.CLIENT_URL);

const config = {
  env: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT) || 5000,
  mongodbUri: process.env.MONGODB_URI?.trim().replace(/^["']|["']$/g, ''),
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
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
