const DEFAULT_DEV_API_URL = 'http://localhost:5000/api/v1';
const DEFAULT_DEV_SERVER_URL = 'http://localhost:5000';

const rawApiUrl = import.meta.env.VITE_API_URL;
const rawServerUrl = import.meta.env.VITE_SERVER_URL;

const apiUrl =
  (typeof rawApiUrl === 'string' && rawApiUrl.trim().replace(/\/+$/, '')) ||
  (import.meta.env.DEV ? DEFAULT_DEV_API_URL : '');

const serverUrl =
  (typeof rawServerUrl === 'string' && rawServerUrl.trim().replace(/\/+$/, '')) ||
  (apiUrl ? apiUrl.replace(/\/api\/v1$/i, '') : '') ||
  (import.meta.env.DEV ? DEFAULT_DEV_SERVER_URL : '');

if (!apiUrl && import.meta.env.PROD) {
  console.error(
    '[HANS Solar] VITE_API_URL is missing from the production build.',
  );
}

export const config = {
  apiUrl,
  serverUrl,
};
