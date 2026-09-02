import { useState } from 'react';
import { Play } from 'lucide-react';
import useRevealOnScroll from '@/hooks/useRevealOnScroll';
import { aboutUsContent, aboutUsVideo } from '@/constants/homeContent';
import { useGetSiteMediaQuery } from '@/services/siteMediaApi';

function AboutUsVideo({ isVisible }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const { youtubeId, title } = aboutUsVideo;
  const thumbnailUrl = `https://i.ytimg.com/vi/${youtubeId}/maxresdefault.jpg`;

  return (
    <div
      className={`about-video-panel reveal-up relative ${isVisible ? 'is-visible' : ''}`}
      style={{ animationDelay: '140ms' }}
    >
      <p className="mb-3 text-sm font-medium text-charcoal-light sm:mb-4 sm:text-base">
        Play this video to learn more about HANS Solar
      </p>

      <div className="aspect-video w-full overflow-hidden rounded-2xl shadow-[0_24px_60px_rgba(15,23,42,0.14)] sm:rounded-3xl lg:shadow-[0_28px_70px_rgba(15,23,42,0.16)]">
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

            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-slate-900/15 to-slate-900/10 transition-opacity duration-300 group-hover:from-slate-900/65" />

            <span className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-4">
              <span className="about-play-btn flex h-16 w-16 items-center justify-center rounded-full bg-white/95 text-solar-700 shadow-xl ring-4 ring-white/30 transition-all duration-300 group-hover:scale-110 group-hover:bg-white sm:h-[4.5rem] sm:w-[4.5rem]">
                <Play className="ml-1 h-7 w-7 fill-current sm:h-8 sm:w-8" />
              </span>
              <span className="rounded-full bg-slate-900/55 px-4 py-1.5 text-xs font-semibold text-white backdrop-blur-sm sm:text-sm">
                Watch company overview
              </span>
            </span>
          </button>
        )}
      </div>
    </div>
  );
}

export default function WhyChooseUs() {
  const { ref: sectionRef, isVisible } = useRevealOnScroll();
  const { data: siteMediaResponse } = useGetSiteMediaQuery();
  const logoSrc = siteMediaResponse?.data?.logo ?? '/logo.jpg';
  const [logoError, setLogoError] = useState(false);

  return (
    <section
      ref={sectionRef}
      aria-labelledby="about-us-heading"
      className="overflow-x-hidden border-b border-slate-100 bg-white py-10 sm:py-12 lg:py-16"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14 xl:gap-16">
          <div
            className={`reveal-up ${isVisible ? 'is-visible' : ''}`}
            style={{ animationDelay: '60ms' }}
          >
            <div className="flex items-center gap-3">
              {!logoError ? (
                <img
                  src={logoSrc}
                  alt=""
                  className="h-9 w-auto max-w-[110px] object-contain sm:h-10"
                  onError={() => setLogoError(true)}
                />
              ) : null}
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-solar-600">
                About HANS Solar Energy
              </p>
            </div>

            <h2
              id="about-us-heading"
              className="mt-4 text-3xl font-bold tracking-tight text-charcoal sm:text-4xl lg:text-[2.5rem] lg:leading-tight"
            >
              {aboutUsContent.title}
            </h2>

            <div className="mt-4 flex items-center gap-2.5" aria-hidden="true">
              <span className="h-px w-10 bg-solar-500/80" />
              <span className="h-1.5 w-1.5 rounded-full bg-solar-500" />
              <span className="h-px w-6 bg-solar-500/40" />
            </div>

            <div className="mt-7 space-y-5 text-base leading-relaxed text-charcoal-light sm:text-[17px] sm:leading-8">
              {aboutUsContent.paragraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 24)}>{paragraph}</p>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-6 border-t border-slate-100 pt-6">
              <div>
                <p className="text-2xl font-bold tabular-nums text-solar-700 sm:text-3xl">
                  800+
                </p>
                <p className="mt-1 text-sm font-medium text-charcoal-light">
                  Subsidy installations completed
                </p>
              </div>
              <div>
                <p className="text-sm font-semibold text-charcoal">Bulandshahr, UP</p>
                <p className="mt-1 text-sm text-charcoal-light">
                  Corporate office &amp; North India support
                </p>
              </div>
            </div>
          </div>

          <AboutUsVideo isVisible={isVisible} />
        </div>
      </div>
    </section>
  );
}
