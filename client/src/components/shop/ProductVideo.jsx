import { getYouTubeEmbedUrl, isYouTubeVideoUrl } from '@/utils/video';

export default function ProductVideo({ videoUrl, poster, title = 'Product video' }) {
  if (!videoUrl) {
    return null;
  }

  const youtubeEmbedUrl = isYouTubeVideoUrl(videoUrl)
    ? getYouTubeEmbedUrl(videoUrl)
    : null;

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
