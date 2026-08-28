import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import Button from '@/components/ui/Button';
import CategoryCard from '@/components/shop/CategoryCard';
import useRevealOnScroll from '@/hooks/useRevealOnScroll';
import { useGetPublicCategoriesQuery } from '@/services/categoriesApi';

const useCarousel = (itemCount) => {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollState = useCallback(() => {
    const container = scrollRef.current;
    if (!container) {
      return;
    }

    setCanScrollLeft(container.scrollLeft > 8);
    setCanScrollRight(
      container.scrollLeft + container.clientWidth < container.scrollWidth - 8,
    );
  }, []);

  useEffect(() => {
    updateScrollState();
    window.addEventListener('resize', updateScrollState);
    return () => window.removeEventListener('resize', updateScrollState);
  }, [itemCount, updateScrollState]);

  const scrollByAmount = (direction) => {
    const container = scrollRef.current;
    if (!container) {
      return;
    }

    container.scrollBy({
      left: direction * Math.min(container.clientWidth * 0.82, 320),
      behavior: 'smooth',
    });
  };

  return { scrollRef, canScrollLeft, canScrollRight, updateScrollState, scrollByAmount };
};

export default function ProductShowcase() {
  const { ref: sectionRef, isVisible: sectionVisible } = useRevealOnScroll();
  const { data, isLoading, isError } = useGetPublicCategoriesQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const categories = data?.data?.categories ?? [];
  const useCarouselLayout = categories.length > 3;

  const {
    scrollRef,
    canScrollLeft,
    canScrollRight,
    updateScrollState,
    scrollByAmount,
  } = useCarousel(categories.length);

  return (
    <section ref={sectionRef} className="bg-gray-50 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div
          className={`reveal-up flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between ${sectionVisible ? 'is-visible' : ''}`}
        >
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-wider text-solar-600">
              Shop by Category
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-charcoal sm:text-4xl">
              Explore Our Solar Categories
            </h2>
            <p className="mt-4 text-base text-charcoal-light sm:text-lg">
              Discover curated collections for panels, inverters, batteries and
              more — built for modern solar projects.
            </p>
          </div>
          <Button to="/shop" variant="secondary" size="sm" className="shrink-0">
            View All Categories
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>

        {isLoading ? (
          <div className="mt-12 flex min-h-60 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-solar-600" />
          </div>
        ) : isError ? (
          <div className="mt-12 rounded-2xl border border-red-200 bg-red-50 p-8 text-center text-red-700">
            Unable to load categories right now.
          </div>
        ) : categories.length === 0 ? (
          <div className="mt-12 rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center">
            <p className="text-sm text-charcoal-light">
              Categories added from the admin dashboard will appear here
              automatically.
            </p>
            <Link
              to="/shop"
              className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-solar-700 hover:text-solar-800"
            >
              Visit Shop
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : useCarouselLayout ? (
          <div className="relative mt-10">
            <div className="pointer-events-none absolute inset-y-0 left-0 z-10 hidden w-12 bg-gradient-to-r from-gray-50 to-transparent sm:block" />
            <div className="pointer-events-none absolute inset-y-0 right-0 z-10 hidden w-12 bg-gradient-to-l from-gray-50 to-transparent sm:block" />

            {canScrollLeft && (
              <button
                type="button"
                aria-label="Scroll categories left"
                onClick={() => scrollByAmount(-1)}
                className="absolute -left-2 top-[42%] z-20 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-gray-200 bg-white text-charcoal shadow-lg transition-all duration-300 hover:scale-105 hover:bg-solar-50 hover:text-solar-700 sm:flex"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
            )}

            {canScrollRight && (
              <button
                type="button"
                aria-label="Scroll categories right"
                onClick={() => scrollByAmount(1)}
                className="absolute -right-2 top-[42%] z-20 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-gray-200 bg-white text-charcoal shadow-lg transition-all duration-300 hover:scale-105 hover:bg-solar-50 hover:text-solar-700 sm:flex"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            )}

            <div
              ref={scrollRef}
              onScroll={updateScrollState}
              className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-3 pt-1 [-ms-overflow-style:none] [scrollbar-width:none] sm:gap-5 [&::-webkit-scrollbar]:hidden"
            >
              {categories.map((category, index) => (
                <div key={category.id} className="snap-start">
                  <CategoryCard
                    category={category}
                    compact
                    isVisible={sectionVisible}
                    revealDelay={120 + index * 80}
                  />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category, index) => (
              <CategoryCard
                key={category.id}
                category={category}
                isVisible={sectionVisible}
                revealDelay={120 + index * 90}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
