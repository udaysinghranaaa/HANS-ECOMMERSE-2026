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

export const isYouTubeVideoUrl = (url) => Boolean(parseYouTubeVideoId(url));

export const getYouTubeEmbedUrl = (url, { autoplay = false } = {}) => {
  const videoId = parseYouTubeVideoId(url);

  if (!videoId) {
    return null;
  }

  const params = new URLSearchParams({
    rel: '0',
    modestbranding: '1',
  });

  if (autoplay) {
    params.set('autoplay', '1');
  }

  return `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
};

export const getYouTubeThumbnailUrl = (url, quality = 'maxresdefault') => {
  const videoId = parseYouTubeVideoId(url);

  if (!videoId) {
    return null;
  }

  return `https://i.ytimg.com/vi/${videoId}/${quality}.jpg`;
};

export const getYouTubeWatchUrl = (url) => {
  const videoId = parseYouTubeVideoId(url);

  if (!videoId) {
    return null;
  }

  return `https://www.youtube.com/watch?v=${videoId}`;
};

export const toYouTubeStorageValue = (input) => {
  const videoId = parseYouTubeVideoId(input);

  if (!videoId) {
    return null;
  }

  return `youtube:${videoId}`;
};
