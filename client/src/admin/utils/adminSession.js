export const ADMIN_SESSION_INACTIVITY_MS = 5 * 60 * 1000;

const decodeBase64Url = (value) => {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/');
  const padded = normalized.padEnd(
    normalized.length + ((4 - (normalized.length % 4)) % 4),
    '=',
  );

  return atob(padded);
};

export const decodeAdminTokenPayload = (token) => {
  if (!token || typeof token !== 'string') {
    return null;
  }

  const parts = token.split('.');

  if (parts.length !== 3) {
    return null;
  }

  try {
    return JSON.parse(decodeBase64Url(parts[1]));
  } catch {
    return null;
  }
};

export const isAdminSessionActive = (token) => {
  const payload = decodeAdminTokenPayload(token);

  if (
    !payload ||
    payload.role !== 'admin' ||
    payload.stage !== 'authenticated' ||
    !payload.totpVerified
  ) {
    return false;
  }

  if (!payload.lastActivityAt) {
    return false;
  }

  return (
    Date.now() - payload.lastActivityAt * 1000 <= ADMIN_SESSION_INACTIVITY_MS
  );
};
