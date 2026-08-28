import { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useGetPublicHomepageBannersQuery } from '@/services/homepageBannerApi';

const AUTO_SLIDE_MS = 5000;
const SWIPE_THRESHOLD = 50;

export default function BannerCarousel() {
  const { data, isLoading, isError } = useGetPublicHomepageBannersQuery(undefined, {
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  const banners = data?.data?.banners ?? [];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef(null);

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
    touchStartX.current = event.touches[0]?.clientX ?? null;
  };

  const handleTouchEnd = (event) => {
    if (touchStartX.current === null) {
      return;
    }

    const touchEndX = event.changedTouches[0]?.clientX ?? touchStartX.current;
    const delta = touchEndX - touchStartX.current;
    touchStartX.current = null;

    if (Math.abs(delta) < SWIPE_THRESHOLD) {
      return;
    }

    if (delta > 0) {
      goPrev();
    } else {
      goNext();
    }
  };

  if (isLoading) {
    return (
      <section className="flex h-[450px] w-full items-center justify-center bg-gray-100 md:h-[500px] lg:h-[600px]">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-solar-200 border-t-solar-600" />
      </section>
    );
  }

  if (isError || totalSlides === 0) {
    return (
      <section className="flex h-[450px] w-full items-center justify-center bg-gray-100 md:h-[500px] lg:h-[600px]">
        <p className="text-sm text-charcoal-light">
          {isError ? 'Unable to load homepage banners.' : 'No banners available.'}
        </p>
      </section>
    );
  }

  return (
    <section
      className="group relative w-full overflow-hidden"
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
          <img
            key={`${banner.id}-${banner.updatedAt}`}
            src={banner.imageUrl}
            alt={banner.title || `Banner ${banner.position}`}
            className="h-[450px] w-full shrink-0 object-cover object-center md:h-[500px] lg:h-[600px]"
            loading={banner.position === 1 ? 'eager' : 'lazy'}
            decoding="async"
          />
        ))}
      </div>

      {totalSlides > 1 && (
        <>
          <button
            type="button"
            aria-label="Previous banner"
            onClick={goPrev}
            className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-charcoal shadow-md transition hover:bg-white md:left-5 md:h-11 md:w-11"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <button
            type="button"
            aria-label="Next banner"
            onClick={goNext}
            className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-charcoal shadow-md transition hover:bg-white md:right-5 md:h-11 md:w-11"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
            {banners.map((banner, index) => (
              <button
                key={banner.id}
                type="button"
                aria-label={`Go to banner ${index + 1}`}
                onClick={() => goToSlide(index)}
                className={`h-2.5 rounded-full transition-all ${
                  index === safeIndex
                    ? 'w-8 bg-solar-600'
                    : 'w-2.5 bg-white/80 hover:bg-white'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
