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
  const isLearnMore = label === 'Learn More';

  return (
    <span
      data-banner-cta
      className={`pointer-events-none inline-flex items-center justify-center rounded-full border border-white/40 bg-solar-600 font-bold tracking-wide text-white shadow-[0_8px_24px_rgba(0,0,0,0.35),0_4px_12px_rgba(22,101,52,0.5)] ring-2 ring-white/30 transition-all duration-300 group-hover:bg-solar-700 group-hover:shadow-[0_10px_28px_rgba(0,0,0,0.4),0_6px_16px_rgba(22,101,52,0.55)] group-focus-visible:ring-white group-active:scale-[0.98] ${
        isLearnMore
          ? 'min-h-[38px] max-w-[min(calc(100vw-5rem),200px)] gap-1 px-3 py-1.5 text-xs whitespace-nowrap lg:min-h-[46px] lg:max-w-none lg:gap-2 lg:px-5 lg:py-2.5 lg:text-[15px]'
          : 'min-h-[44px] max-w-[min(calc(100vw-2.5rem),280px)] gap-2 px-4 py-2.5 text-sm sm:min-h-[46px] sm:max-w-none sm:px-5 sm:text-[15px]'
      }`}
    >
      <span className="truncate drop-shadow-sm">{label}</span>
      <ArrowRight
        className={`shrink-0 drop-shadow-sm ${isLearnMore ? 'h-3.5 w-3.5 lg:h-4 lg:w-4' : 'h-4 w-4'}`}
        aria-hidden="true"
      />
    </span>
  );
}

function BannerImage({ banner, className, loading, fetchPriority }) {
  const alt = banner.title || `Banner ${banner.position}`;
  const desktopSrc = banner.imageUrl;
  const mobileSrc = banner.mobileImageUrl || banner.imageUrl;
  const sharedProps = {
    alt,
    decoding: 'async',
    draggable: false,
    loading,
    fetchPriority,
  };

  return (
    <>
      <img
        {...sharedProps}
        src={mobileSrc}
        className={`${className} lg:hidden`}
      />
      <img
        {...sharedProps}
        src={desktopSrc}
        className={`${className} hidden lg:block`}
      />
    </>
  );
}

function BannerSlideContent({ banner, hasMultipleSlides }) {
  const ctaLabel = getBannerCtaLabel(banner);
  const ctaPositionClass = hasMultipleSlides
    ? 'bottom-[3.35rem] sm:bottom-[3.75rem] md:bottom-20'
    : 'bottom-4 sm:bottom-5 md:bottom-6';
  const ctaLeftClass = hasMultipleSlides
    ? 'left-14 sm:left-5 lg:left-8'
    : 'left-3 sm:left-5 lg:left-8';

  return (
    <div className="relative h-full w-full overflow-hidden">
      <BannerImage
        banner={banner}
        className="h-[260px] w-full bg-slate-900 object-contain object-center transition-transform duration-500 group-hover:scale-[1.02] group-active:scale-[0.995] sm:h-[340px] sm:object-cover md:h-[500px] lg:h-[560px] lg:object-cover"
        loading={banner.position === 1 ? 'eager' : 'lazy'}
        fetchPriority={banner.position === 1 ? 'high' : 'auto'}
      />

      <span
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-[46%] bg-gradient-to-t from-slate-950/80 via-slate-900/35 to-transparent sm:h-[42%]"
        aria-hidden="true"
      />

      <div
        className={`pointer-events-none absolute ${ctaPositionClass} ${ctaLeftClass} z-[30]`}
      >
        <span className="inline-flex rounded-full bg-slate-950/30 p-0.5 shadow-lg backdrop-blur-[3px]">
          <BannerCta label={ctaLabel} />
        </span>
      </div>
    </div>
  );
}

function BannerSlide({ banner, categorySlugById, hasMultipleSlides }) {
  const href = resolveBannerHref(banner, categorySlugById);

  if (!href) {
    return (
      <BannerImage
        banner={banner}
        className="h-[260px] w-full bg-slate-900 object-contain object-center sm:h-[340px] sm:object-cover md:h-[500px] lg:h-[560px] lg:object-cover"
        loading={banner.position === 1 ? 'eager' : 'lazy'}
        fetchPriority={banner.position === 1 ? 'high' : 'auto'}
      />
    );
  }

  const label = `${getBannerCtaLabel(banner)} — ${banner.title || `Banner ${banner.position}`}`;
  const sharedClassName =
    'group relative isolate block h-full w-full cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-solar-400';

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
        className="relative z-[1] flex transition-transform duration-700 ease-in-out"
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

      {hasMultipleSlides && (
        <>
          <button
            type="button"
            aria-label="Previous banner"
            onClick={goPrev}
            className="absolute left-3 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-white/90 text-slate-700 shadow-lg backdrop-blur-sm transition-all duration-200 hover:bg-white md:left-5 md:h-11 md:w-11 lg:opacity-0 lg:group-hover:opacity-100"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <button
            type="button"
            aria-label="Next banner"
            onClick={goNext}
            className="absolute right-3 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-white/90 text-slate-700 shadow-lg backdrop-blur-sm transition-all duration-200 hover:bg-white md:right-5 md:h-11 md:w-11 lg:opacity-0 lg:group-hover:opacity-100"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex justify-center pb-3 sm:pb-4">
            <div className="pointer-events-auto flex gap-2 rounded-full bg-slate-900/40 px-3 py-2 backdrop-blur-sm">
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
          </div>
        </>
      )}
    </section>
  );
}
