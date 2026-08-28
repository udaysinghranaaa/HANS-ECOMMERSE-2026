import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const bannerPath = path.resolve(__dirname, '../../client/public/banner1.jpg');

const loginResponse = await fetch('http://localhost:5000/api/v1/admin/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: process.env.ADMIN_EMAIL,
    password: process.env.ADMIN_PASSWORD,
  }),
});

const loginData = await loginResponse.json();
const token = loginData.data?.token;

if (!token) {
  console.error('Login failed', loginData);
  process.exit(1);
}

const imageBuffer = fs.readFileSync(bannerPath);

for (const position of [1, 2, 3, 4]) {
  const formData = new FormData();
  formData.append('title', `Banner ${position}`);
  formData.append(
    'image',
    new Blob([imageBuffer], { type: 'image/jpeg' }),
    `banner-${position}.jpg`,
  );

  const uploadResponse = await fetch(
    `http://localhost:5000/api/v1/admin/homepage/banners/${position}`,
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    },
  );

  const uploadData = await uploadResponse.json();
  console.log(
    `slot ${position}:`,
    uploadResponse.status,
    uploadData.success,
    uploadData.data?.banner?.position,
  );
}

const publicResponse = await fetch('http://localhost:5000/api/v1/homepage/banners');
const publicData = await publicResponse.json();

console.log(
  'public banners:',
  publicResponse.status,
  publicData.data?.banners?.length,
  publicData.data?.banners?.map((banner) => banner.position),
);
