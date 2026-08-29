import { useState } from 'react';
import { Play } from 'lucide-react';
import useRevealOnScroll from '@/hooks/useRevealOnScroll';
import { aboutUsContent, aboutUsVideo } from '@/constants/homeContent';

function AboutUsVideo() {
  const [isPlaying, setIsPlaying] = useState(false);
  const { youtubeId, title } = aboutUsVideo;
  const thumbnailUrl = `https://i.ytimg.com/vi/${youtubeId}/maxresdefault.jpg`;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-gray-100 bg-charcoal shadow-xl shadow-charcoal/10 ring-1 ring-black/5 sm:rounded-3xl">
      <div className="aspect-video w-full">
        {isPlaying ? (
          <iframe
            title={title}
            src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0&modestbranding=1`}
            className="h-full w-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        ) : (
          <button
            type="button"
            onClick={() => setIsPlaying(true)}
            className="group relative block h-full w-full cursor-pointer"
            aria-label={`Play ${title}`}
          >
            <img
              src={thumbnailUrl}
              alt={title}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
              loading="lazy"
              decoding="async"
              onError={(event) => {
                event.currentTarget.src = `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`;
              }}
            />

            <div className="absolute inset-0 bg-gradient-to-t from-charcoal/55 via-charcoal/15 to-transparent" />

            <span className="absolute inset-0 flex items-center justify-center">
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/95 text-solar-700 shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:bg-white sm:h-20 sm:w-20">
                <Play className="ml-1 h-7 w-7 fill-current sm:h-8 sm:w-8" />
              </span>
            </span>

            <span className="absolute bottom-4 left-4 rounded-full bg-black/45 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm sm:text-sm">
              Watch HANS Solar
            </span>
          </button>
        )}
      </div>
    </div>
  );
}

function SectionDivider() {
  return (
    <div className="mt-4 flex items-center gap-3">
      <span className="h-px flex-1 max-w-[72px] bg-solar-600" />
      <span className="h-2 w-2 rotate-45 bg-solar-600" />
      <span className="h-px flex-1 max-w-[120px] bg-solar-600/70" />
    </div>
  );
}

export default function WhyChooseUs() {
  const { ref: sectionRef, isVisible } = useRevealOnScroll();

  return (
    <section ref={sectionRef} className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14 xl:gap-16">
          <div
            className={`reveal-up ${isVisible ? 'is-visible' : ''}`}
          >
            <h2 className="text-3xl font-bold tracking-tight text-charcoal sm:text-4xl">
              {aboutUsContent.title}
            </h2>
            <SectionDivider />

            <div className="mt-6 space-y-4 text-base leading-relaxed text-charcoal-light sm:text-[17px] sm:leading-8">
              {aboutUsContent.paragraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 24)}>{paragraph}</p>
              ))}
            </div>
          </div>

          <div
            className={`reveal-up ${isVisible ? 'is-visible' : ''}`}
            style={{ animationDelay: '100ms' }}
          >
            <AboutUsVideo />
          </div>
        </div>
      </div>
    </section>
  );
}
