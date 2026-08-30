import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import Button from '@/components/ui/Button';
import CategoryCard from '@/components/shop/CategoryCard';
import SectionHeader from '@/components/home/SectionHeader';
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
    <section ref={sectionRef} className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div
          className={`reveal-up flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between ${sectionVisible ? 'is-visible' : ''}`}
        >
          <SectionHeader
            eyebrow="Shop by Category"
            title="Explore Our Solar Categories"
            subtitle="Discover curated collections for panels, inverters, batteries and more — built for modern solar projects."
            showAccent
          />
          <Button
            to="/shop"
            variant="secondary"
            size="sm"
            className="shrink-0 rounded-xl border-slate-200"
          >
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
          <div className="mt-12 rounded-2xl border border-dashed border-slate-300 bg-slate-50/50 p-10 text-center">
            <p className="text-sm text-slate-600">
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
            <div className="pointer-events-none absolute inset-y-0 left-0 z-10 hidden w-14 bg-gradient-to-r from-white to-transparent sm:block" />
            <div className="pointer-events-none absolute inset-y-0 right-0 z-10 hidden w-14 bg-gradient-to-l from-white to-transparent sm:block" />

            {canScrollLeft && (
              <button
                type="button"
                aria-label="Scroll categories left"
                onClick={() => scrollByAmount(-1)}
                className="absolute -left-2 top-[42%] z-20 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200/80 bg-white/95 text-slate-700 shadow-[0_4px_20px_rgba(15,23,42,0.08)] backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:border-solar-200 hover:bg-solar-50 hover:text-solar-700 sm:flex"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
            )}

            {canScrollRight && (
              <button
                type="button"
                aria-label="Scroll categories right"
                onClick={() => scrollByAmount(1)}
                className="absolute -right-2 top-[42%] z-20 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200/80 bg-white/95 text-slate-700 shadow-[0_4px_20px_rgba(15,23,42,0.08)] backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:border-solar-200 hover:bg-solar-50 hover:text-solar-700 sm:flex"
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
