import { useState } from 'react';
import { Play } from 'lucide-react';
import SectionHeader from '@/components/home/SectionHeader';
import useRevealOnScroll from '@/hooks/useRevealOnScroll';
import { aboutUsContent, aboutUsVideo } from '@/constants/homeContent';

function AboutUsVideo() {
  const [isPlaying, setIsPlaying] = useState(false);
  const { youtubeId, title } = aboutUsVideo;
  const thumbnailUrl = `https://i.ytimg.com/vi/${youtubeId}/maxresdefault.jpg`;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-slate-800 shadow-[0_20px_50px_rgba(15,23,42,0.12)] ring-1 ring-slate-900/5 sm:rounded-3xl">
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
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
              loading="lazy"
              decoding="async"
              onError={(event) => {
                event.currentTarget.src = `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`;
              }}
            />

            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-slate-900/10 to-transparent" />

            <span className="absolute inset-0 flex items-center justify-center">
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/95 text-solar-700 shadow-xl ring-4 ring-white/20 transition-all duration-300 group-hover:scale-110 group-hover:bg-white sm:h-20 sm:w-20">
                <Play className="ml-1 h-7 w-7 fill-current sm:h-8 sm:w-8" />
              </span>
            </span>

            <span className="absolute bottom-4 left-4 rounded-full bg-slate-900/55 px-3.5 py-1.5 text-xs font-medium text-white backdrop-blur-sm sm:text-sm">
              Watch HANS Solar
            </span>
          </button>
        )}
      </div>
    </div>
  );
}

export default function WhyChooseUs() {
  const { ref: sectionRef, isVisible } = useRevealOnScroll();

  return (
    <section ref={sectionRef} className="border-b border-slate-100 bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16 xl:gap-20">
          <div className={`reveal-up ${isVisible ? 'is-visible' : ''}`}>
            <SectionHeader
              title={aboutUsContent.title}
              showAccent
              className="max-w-xl"
            />

            <div className="mt-8 space-y-5 text-base leading-relaxed text-slate-600 sm:text-[17px] sm:leading-8">
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
