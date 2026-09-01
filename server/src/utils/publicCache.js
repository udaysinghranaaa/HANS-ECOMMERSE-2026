export const setPublicJsonCache = (res, maxAgeSeconds = 60) => {
  res.set(
    'Cache-Control',
    `public, max-age=${maxAgeSeconds}, stale-while-revalidate=120`,
  );
};
