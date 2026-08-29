import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Landmark, Sparkles } from 'lucide-react';
import ProductCard from '@/components/shop/ProductCard';
import useRevealOnScroll from '@/hooks/useRevealOnScroll';
import { useGetFeaturedProductsQuery } from '@/services/productsApi';

function ProductCarousel({ products, isVisible, sectionKey }) {
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
  }, [products.length, updateScrollState]);

  const scrollByAmount = (direction) => {
    scrollRef.current?.scrollBy({
      left: direction * Math.min(scrollRef.current.clientWidth * 0.82, 320),
      behavior: 'smooth',
    });
  };

  const showControls = products.length > 1;

  return (
    <div className="relative mt-8">
      {showControls && canScrollLeft && (
        <button
          type="button"
          aria-label="Scroll products left"
          onClick={() => scrollByAmount(-1)}
          className="absolute -left-2 top-[42%] z-20 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-gray-200 bg-white text-charcoal shadow-lg transition-all duration-300 hover:scale-105 hover:bg-solar-50 hover:text-solar-700 sm:flex"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
      )}

      {showControls && canScrollRight && (
        <button
          type="button"
          aria-label="Scroll products right"
          onClick={() => scrollByAmount(1)}
          className="absolute -right-2 top-[42%] z-20 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-gray-200 bg-white text-charcoal shadow-lg transition-all duration-300 hover:scale-105 hover:bg-solar-50 hover:text-solar-700 sm:flex"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      )}

      <div
        ref={scrollRef}
        onScroll={updateScrollState}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 pt-1 [-ms-overflow-style:none] [scrollbar-width:none] sm:gap-5 [&::-webkit-scrollbar]:hidden"
      >
        {products.map((product, index) => (
          <div
            key={`${sectionKey}-${product.id}`}
            style={{ animationDelay: `${100 + index * 70}ms` }}
            className={`reveal-up w-[280px] shrink-0 snap-start sm:w-[300px] lg:w-[320px] ${isVisible ? 'is-visible' : ''}`}
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
}

function FeaturedProductBlock({
  sectionKey,
  eyebrow,
  title,
  subtitle,
  products,
  icon: Icon,
  background = 'gray',
}) {
  const { ref: sectionRef, isVisible } = useRevealOnScroll();

  if (products.length === 0) {
    return null;
  }

  const bgClass = background === 'white' ? 'bg-white' : 'bg-gray-50';

  return (
    <section ref={sectionRef} className={`${bgClass} py-12 sm:py-14`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className={`reveal-up max-w-3xl ${isVisible ? 'is-visible' : ''}`}>
          <p className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-solar-600">
            <Icon className="h-4 w-4" />
            {eyebrow}
          </p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-charcoal sm:text-3xl lg:text-4xl">
            {title}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-charcoal-light sm:text-base">
            {subtitle}
          </p>
        </div>

        <ProductCarousel
          sectionKey={sectionKey}
          products={products}
          isVisible={isVisible}
        />
      </div>
    </section>
  );
}

export default function FeaturedProductsSection({ section = 'all' }) {
  const { data, isLoading } = useGetFeaturedProductsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const trendingProducts = useMemo(
    () =>
      (data?.data?.trendingProducts ?? []).filter(
        (product) => product.isTrending === true,
      ),
    [data],
  );

  const subsidyProducts = useMemo(
    () =>
      (data?.data?.subsidyProducts ?? []).filter(
        (product) => product.isGovernmentSubsidy === true,
      ),
    [data],
  );

  if (isLoading) {
    return null;
  }

  const showTrending = section === 'all' || section === 'trending';
  const showSubsidy = section === 'all' || section === 'subsidy';

  if (
    (showTrending && trendingProducts.length === 0 && !showSubsidy) ||
    (showSubsidy && subsidyProducts.length === 0 && !showTrending) ||
    (section === 'all' &&
      trendingProducts.length === 0 &&
      subsidyProducts.length === 0)
  ) {
    return null;
  }

  return (
    <>
      {showTrending && trendingProducts.length > 0 && (
        <FeaturedProductBlock
          sectionKey="trending"
          eyebrow="Trending Now"
          title="Trending Products"
          subtitle="Our most popular solar products, loved by customers."
          products={trendingProducts}
          icon={Sparkles}
          background="gray"
        />
      )}
      {showSubsidy && subsidyProducts.length > 0 && (
        <FeaturedProductBlock
          sectionKey="subsidy"
          eyebrow="Subsidy Eligible"
          title="Top Government Subsidy Products"
          subtitle="Popular subsidy-eligible solar solutions to help you save more on clean energy."
          products={subsidyProducts}
          icon={Landmark}
          background="white"
        />
      )}
    </>
  );
}
