import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useGetPublicHomepageBannersQuery } from '@/services/homepageBannerApi';
import { useGetPublicCategoriesQuery } from '@/services/categoriesApi';
import { isExternalHref, resolveBannerHref } from '@/utils/bannerLink';

const AUTO_SLIDE_MS = 5000;
const SWIPE_THRESHOLD = 50;

function BannerSlide({ banner, categorySlugById }) {
  const href = resolveBannerHref(banner, categorySlugById);
  const hasLink = Boolean(href);

  const image = (
    <img
      src={banner.imageUrl}
      alt={banner.title || `Banner ${banner.position}`}
      className={`h-[260px] w-full bg-slate-900 object-contain object-center sm:h-[340px] sm:object-cover md:h-[500px] lg:h-[560px] ${
        hasLink
          ? 'transition-transform duration-500 group-hover:scale-[1.02] group-active:scale-[0.995]'
          : ''
      }`}
      loading={banner.position === 1 ? 'eager' : 'lazy'}
      decoding="async"
      fetchPriority={banner.position === 1 ? 'high' : 'auto'}
      draggable={false}
    />
  );

  if (!hasLink) {
    return image;
  }

  const linkedContent = (
    <>
      {image}
      <span className="pointer-events-none absolute inset-0 bg-slate-900/0 transition-colors duration-300 group-hover:bg-slate-900/10 group-active:bg-slate-900/15" />
    </>
  );

  if (isExternalHref(href)) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative z-[1] block h-full w-full cursor-pointer"
        aria-label={`Open ${banner.title || `banner ${banner.position}`}`}
      >
        {linkedContent}
      </a>
    );
  }

  return (
    <Link
      to={href}
      className="group relative z-[1] block h-full w-full cursor-pointer"
      aria-label={`Open ${banner.title || `banner ${banner.position}`}`}
      draggable={false}
    >
      {linkedContent}
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

  const handleTouchStart = (event) => {
    if (event.target.closest('a')) {
      touchStartX.current = null;
      touchStartY.current = null;
      return;
    }

    touchStartX.current = event.touches[0]?.clientX ?? null;
    touchStartY.current = event.touches[0]?.clientY ?? null;
  };

  const handleTouchEnd = (event) => {
    if (event.target.closest('a')) {
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
            <BannerSlide banner={banner} categorySlugById={categorySlugById} />
          </div>
        ))}
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-24 bg-gradient-to-t from-slate-900/25 to-transparent" />

      {totalSlides > 1 && (
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

          <div className="absolute bottom-5 left-1/2 z-10 flex -translate-x-1/2 gap-2 rounded-full bg-slate-900/30 px-3 py-2 backdrop-blur-sm">
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
