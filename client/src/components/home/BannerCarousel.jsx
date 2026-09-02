import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { useGetPublicHomepageBannersQuery } from '@/services/homepageBannerApi';
import { useGetPublicCategoriesQuery } from '@/services/categoriesApi';
import {
  getBannerCtaLabel,
  isExternalHref,
  resolveBannerHref,
} from '@/utils/bannerLink';

const AUTO_SLIDE_MS = 5000;
const SWIPE_THRESHOLD = 50;

const bannerNavSelector = '[data-banner-nav]';

function BannerCta({ label }) {
  return (
    <span className="pointer-events-none inline-flex min-h-[44px] max-w-[calc(100vw-2rem)] items-center gap-2 rounded-full border border-white/30 bg-white/95 px-4 py-2.5 text-sm font-semibold text-charcoal shadow-[0_8px_24px_rgba(15,23,42,0.18)] backdrop-blur-sm transition-all duration-300 group-hover:bg-white group-hover:shadow-[0_10px_28px_rgba(15,23,42,0.22)] group-focus-visible:ring-2 group-focus-visible:ring-solar-400 group-focus-visible:ring-offset-2 group-active:scale-[0.98] sm:px-5 sm:text-[15px]">
      <span className="truncate">{label}</span>
      <ArrowRight className="h-4 w-4 shrink-0 text-solar-700" aria-hidden="true" />
    </span>
  );
}

function BannerSlideContent({ banner, hasMultipleSlides }) {
  const ctaLabel = getBannerCtaLabel(banner);
  const ctaBottomClass = hasMultipleSlides
    ? 'bottom-14 sm:bottom-16 md:bottom-[4.75rem]'
    : 'bottom-5 sm:bottom-6 md:bottom-8';

  return (
    <>
      <img
        src={banner.imageUrl}
        alt={banner.title || `Banner ${banner.position}`}
        className="h-[260px] w-full bg-slate-900 object-contain object-center transition-transform duration-500 group-hover:scale-[1.02] group-active:scale-[0.995] sm:h-[340px] sm:object-cover md:h-[500px] lg:h-[560px]"
        loading={banner.position === 1 ? 'eager' : 'lazy'}
        decoding="async"
        fetchPriority={banner.position === 1 ? 'high' : 'auto'}
        draggable={false}
      />
      <span
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-900/45 via-slate-900/5 to-transparent"
        aria-hidden="true"
      />
      <span
        className={`pointer-events-none absolute left-4 z-[2] ${ctaBottomClass} sm:left-6 lg:left-8`}
      >
        <BannerCta label={ctaLabel} />
      </span>
    </>
  );
}

function BannerSlide({ banner, categorySlugById, hasMultipleSlides }) {
  const href = resolveBannerHref(banner, categorySlugById);

  if (!href) {
    return (
      <img
        src={banner.imageUrl}
        alt={banner.title || `Banner ${banner.position}`}
        className="h-[260px] w-full bg-slate-900 object-contain object-center sm:h-[340px] sm:object-cover md:h-[500px] lg:h-[560px]"
        loading={banner.position === 1 ? 'eager' : 'lazy'}
        decoding="async"
        fetchPriority={banner.position === 1 ? 'high' : 'auto'}
        draggable={false}
      />
    );
  }

  const label = `${getBannerCtaLabel(banner)} — ${banner.title || `Banner ${banner.position}`}`;
  const sharedClassName =
    'group relative z-[1] block h-full w-full cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-solar-400';

  if (isExternalHref(href)) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        data-banner-nav
        className={sharedClassName}
        aria-label={label}
      >
        <BannerSlideContent
          banner={banner}
          hasMultipleSlides={hasMultipleSlides}
        />
      </a>
    );
  }

  return (
    <Link
      to={href}
      data-banner-nav
      className={sharedClassName}
      aria-label={label}
      draggable={false}
    >
      <BannerSlideContent
        banner={banner}
        hasMultipleSlides={hasMultipleSlides}
      />
    </Link>
  );
}

export default function BannerCarousel() {
  const { data, isLoading, isError } = useGetPublicHomepageBannersQuery();
  const { data: categoriesData } = useGetPublicCategoriesQuery();

  const banners = data?.data?.banners ?? [];
  const categorySlugById = useMemo(() => {
    const categories = categoriesData?.data?.categories ?? [];

    return new Map(categories.map((category) => [category.id, category.slug]));
  }, [categoriesData]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef(null);
  const touchStartY = useRef(null);

  const totalSlides = banners.length;
  const hasMultipleSlides = totalSlides > 1;
  const safeIndex =
    totalSlides > 0 ? ((currentIndex % totalSlides) + totalSlides) % totalSlides : 0;

  const goToSlide = useCallback(
    (index) => {
      if (totalSlides === 0) {
        return;
      }

      setCurrentIndex(((index % totalSlides) + totalSlides) % totalSlides);
    },
    [totalSlides],
  );

  const goNext = useCallback(() => {
    goToSlide(safeIndex + 1);
  }, [safeIndex, goToSlide]);

  const goPrev = useCallback(() => {
    goToSlide(safeIndex - 1);
  }, [safeIndex, goToSlide]);

  useEffect(() => {
    if (totalSlides <= 1 || isPaused) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % totalSlides);
    }, AUTO_SLIDE_MS);
    return () => window.clearInterval(timer);
  }, [totalSlides, isPaused]);

  const isBannerNavTarget = (target) => Boolean(target?.closest?.(bannerNavSelector));

  const handleTouchStart = (event) => {
    if (isBannerNavTarget(event.target)) {
      touchStartX.current = null;
      touchStartY.current = null;
      return;
    }

    touchStartX.current = event.touches[0]?.clientX ?? null;
    touchStartY.current = event.touches[0]?.clientY ?? null;
  };

  const handleTouchEnd = (event) => {
    if (isBannerNavTarget(event.target)) {
      touchStartX.current = null;
      touchStartY.current = null;
      return;
    }

    if (touchStartX.current === null) {
      return;
    }

    const touchEndX = event.changedTouches[0]?.clientX ?? touchStartX.current;
    const touchEndY = event.changedTouches[0]?.clientY ?? touchStartY.current ?? 0;
    const deltaX = touchEndX - touchStartX.current;
    const deltaY = touchEndY - (touchStartY.current ?? 0);
    touchStartX.current = null;
    touchStartY.current = null;

    if (Math.abs(deltaX) < SWIPE_THRESHOLD || Math.abs(deltaX) < Math.abs(deltaY)) {
      return;
    }

    if (deltaX > 0) {
      goPrev();
    } else {
      goNext();
    }
  };

  if (isLoading) {
    return (
      <section className="flex h-[260px] w-full items-center justify-center bg-slate-100 sm:h-[340px] md:h-[500px] lg:h-[560px]">
        <div className="h-10 w-10 animate-spin rounded-full border-[3px] border-solar-100 border-t-solar-600" />
      </section>
    );
  }

  if (isError || totalSlides === 0) {
    return (
      <section className="flex h-[260px] w-full items-center justify-center bg-slate-100 sm:h-[340px] md:h-[500px] lg:h-[560px]">
        <p className="text-sm text-slate-600">
          {isError ? 'Unable to load homepage banners.' : 'No banners available.'}
        </p>
      </section>
    );
  }

  return (
    <section
      className="group relative w-full overflow-hidden bg-slate-900"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      aria-label="Homepage banner carousel"
    >
      <div
        className="flex transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${safeIndex * 100}%)` }}
      >
        {banners.map((banner) => (
          <div
            key={`${banner.id}-${banner.updatedAt}`}
            className="relative h-[260px] w-full shrink-0 sm:h-[340px] md:h-[500px] lg:h-[560px]"
          >
            <BannerSlide
              banner={banner}
              categorySlugById={categorySlugById}
              hasMultipleSlides={hasMultipleSlides}
            />
          </div>
        ))}
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-28 bg-gradient-to-t from-slate-900/35 to-transparent" />

      {hasMultipleSlides && (
        <>
          <button
            type="button"
            aria-label="Previous banner"
            onClick={goPrev}
            className="absolute left-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-white/90 text-slate-700 shadow-lg backdrop-blur-sm transition-all duration-200 hover:bg-white md:left-5 md:h-11 md:w-11 lg:opacity-0 lg:group-hover:opacity-100"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <button
            type="button"
            aria-label="Next banner"
            onClick={goNext}
            className="absolute right-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-white/90 text-slate-700 shadow-lg backdrop-blur-sm transition-all duration-200 hover:bg-white md:right-5 md:h-11 md:w-11 lg:opacity-0 lg:group-hover:opacity-100"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-2 rounded-full bg-slate-900/35 px-3 py-2 backdrop-blur-sm sm:bottom-5">
            {banners.map((banner, index) => (
              <button
                key={banner.id}
                type="button"
                aria-label={`Go to banner ${index + 1}`}
                aria-current={index === safeIndex ? 'true' : undefined}
                onClick={() => goToSlide(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === safeIndex
                    ? 'w-7 bg-solar-500'
                    : 'w-2 bg-white/70 hover:bg-white'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
