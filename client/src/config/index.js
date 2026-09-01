const DEFAULT_DEV_API_URL = 'http://localhost:5000/api/v1';
const DEFAULT_DEV_SERVER_URL = 'http://localhost:5000';

const normalizeUrl = (value) => {
  if (!value || typeof value !== 'string') {
    return undefined;
  }

  return value.trim().replace(/\/+$/, '');
};

const resolvedApiUrl =
  normalizeUrl(import.meta.env.VITE_API_URL) ??
  (import.meta.env.DEV ? DEFAULT_DEV_API_URL : '');

const resolvedServerUrl =
  normalizeUrl(import.meta.env.VITE_SERVER_URL) ??
  (resolvedApiUrl ? resolvedApiUrl.replace(/\/api\/v1$/i, '') : undefined) ??
  (import.meta.env.DEV ? DEFAULT_DEV_SERVER_URL : '');

if (!resolvedApiUrl && import.meta.env.PROD) {
  console.error(
    '[HANS Solar] VITE_API_URL is missing. Set it in Vercel environment variables and redeploy.',
  );
}

export const config = {
  apiUrl: resolvedApiUrl,
  serverUrl: resolvedServerUrl,
};
