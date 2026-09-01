import { useState } from 'react';
import { Play, PlayCircle } from 'lucide-react';
import {
  getYouTubeEmbedUrl,
  getYouTubeThumbnailUrl,
  isYouTubeVideoUrl,
} from '@/utils/video';

export default function ProductVideo({
  videoUrl,
  poster,
  title = 'Product video',
  layout = 'default',
  label = 'Watch Product Video',
}) {
  const [isPlaying, setIsPlaying] = useState(false);

  if (!videoUrl) {
    return null;
  }

  const youtubeEmbedUrl = isYouTubeVideoUrl(videoUrl)
    ? getYouTubeEmbedUrl(videoUrl)
    : null;
  const youtubeThumbnailUrl = isYouTubeVideoUrl(videoUrl)
    ? getYouTubeThumbnailUrl(videoUrl)
    : null;

  if (layout === 'section') {
    return (
      <div className="overflow-hidden rounded-xl border border-gray-200/90 bg-gray-50 shadow-sm ring-1 ring-gray-100/80">
        <div className="aspect-video w-full bg-charcoal">
          {youtubeEmbedUrl ? (
            isPlaying ? (
              <iframe
                title={title}
                src={getYouTubeEmbedUrl(videoUrl, { autoplay: true })}
                className="h-full w-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            ) : (
              <button
                type="button"
                onClick={() => setIsPlaying(true)}
                className="group relative h-full w-full cursor-pointer"
                aria-label={label}
              >
                <img
                  src={youtubeThumbnailUrl || poster}
                  alt={title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                  onError={(event) => {
                    const fallback = getYouTubeThumbnailUrl(videoUrl, 'hqdefault');
                    if (fallback && event.currentTarget.src !== fallback) {
                      event.currentTarget.src = fallback;
                    } else if (poster) {
                      event.currentTarget.src = poster;
                    }
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-charcoal/20 to-charcoal/10" />
                <span className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-4">
                  <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/95 text-solar-700 shadow-xl ring-4 ring-white/20 transition-transform duration-300 group-hover:scale-110 sm:h-[4.5rem] sm:w-[4.5rem]">
                    <Play className="ml-1 h-7 w-7 fill-current sm:h-8 sm:w-8" />
                  </span>
                  <span className="rounded-full bg-charcoal/55 px-4 py-1.5 text-xs font-semibold tracking-wide text-white backdrop-blur-sm sm:text-sm">
                    {label}
                  </span>
                </span>
              </button>
            )
          ) : (
            <video
              controls
              playsInline
              preload="metadata"
              className="h-full w-full object-contain"
              poster={poster}
            >
              <source src={videoUrl} />
              Your browser does not support the video tag.
            </video>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      {youtubeEmbedUrl ? (
        <iframe
          title={title}
          src={youtubeEmbedUrl}
          className="aspect-video w-full border-0 bg-charcoal"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      ) : (
        <video
          controls
          playsInline
          className="aspect-video w-full bg-charcoal"
          poster={poster}
        >
          <source src={videoUrl} />
          Your browser does not support the video tag.
        </video>
      )}
    </div>
  );
}

export function ProductVideosSection({ product, poster = '' }) {
  const videos = (() => {
    if (!product?.videoUrl) {
      return [];
    }

    const { videoUrl, name } = product;

    if (Array.isArray(videoUrl)) {
      return videoUrl
        .filter(Boolean)
        .map((url, index) => ({
          url,
          title: `${name} video ${index + 1}`,
        }));
    }

    if (typeof videoUrl === 'string' && videoUrl.trim()) {
      return [
        {
          url: videoUrl.trim(),
          title: `${name} video`,
        },
      ];
    }

    return [];
  })();

  if (videos.length === 0) {
    return null;
  }

  return (
    <section
      aria-labelledby={`product-videos-${product.id}`}
      className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
    >
      <div className="border-b border-gray-100 bg-gradient-to-r from-solar-50/90 via-white to-emerald-50/40 px-5 py-4 sm:px-6">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-solar-100 text-solar-700 ring-1 ring-solar-200/70">
            <PlayCircle className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <h2
              id={`product-videos-${product.id}`}
              className="text-base font-semibold text-charcoal sm:text-lg"
            >
              Product Video
            </h2>
            <p className="text-xs text-charcoal-light sm:text-sm">
              {videos.length > 1
                ? `${videos.length} videos available for this product`
                : 'Watch this product in action'}
            </p>
          </div>
        </div>
      </div>

      <div
        className={`p-4 sm:p-5 ${videos.length > 1 ? 'grid gap-4 sm:grid-cols-2' : ''}`}
      >
        {videos.map((video, index) => (
          <ProductVideo
            key={video.url}
            videoUrl={video.url}
            poster={poster}
            title={video.title}
            layout="section"
            label={
              videos.length > 1
                ? `Watch Video ${index + 1}`
                : 'Watch Product Video'
            }
          />
        ))}
      </div>
    </section>
  );
}
