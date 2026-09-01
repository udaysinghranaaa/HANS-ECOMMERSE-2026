const store = new Map();

export const getMemoryCached = async (key, ttlMs, loader) => {
  const now = Date.now();
  const cached = store.get(key);

  if (cached && cached.expiresAt > now) {
    return cached.value;
  }

  const value = await loader();
  store.set(key, { value, expiresAt: now + ttlMs });
  return value;
};

export const clearMemoryCache = (keyPrefix) => {
  if (!keyPrefix) {
    store.clear();
    return;
  }

  for (const key of store.keys()) {
    if (key.startsWith(keyPrefix)) {
      store.delete(key);
    }
  }
};
