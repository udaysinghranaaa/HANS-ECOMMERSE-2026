export const parseYouTubeVideoId = (value) => {
  if (!value || typeof value !== 'string') {
    return null;
  }

  const trimmed = value.trim();

  if (!trimmed) {
    return null;
  }

  if (trimmed.startsWith('youtube:')) {
    return trimmed.slice(8) || null;
  }

  try {
    const url = new URL(trimmed);
    const host = url.hostname.replace(/^www\./, '');

    if (host === 'youtu.be') {
      return url.pathname.slice(1).split('/')[0] || null;
    }

    if (host === 'youtube.com' || host === 'm.youtube.com') {
      if (url.pathname.startsWith('/embed/')) {
        return url.pathname.split('/')[2] || null;
      }

      if (url.pathname.startsWith('/shorts/')) {
        return url.pathname.split('/')[2] || null;
      }

      return url.searchParams.get('v');
    }
  } catch {
    return /^[\w-]{11}$/.test(trimmed) ? trimmed : null;
  }

  return null;
};

export const isYouTubeVideoUrl = (url) =>
  typeof url === 'string' && url.startsWith('youtube:');

export const normalizeYouTubeVideoInput = (input) => {
  const videoId = parseYouTubeVideoId(input);

  if (!videoId) {
    return null;
  }

  return `youtube:${videoId}`;
};

export const isUploadedVideoUrl = (url) =>
  Boolean(url) && !isYouTubeVideoUrl(url);
