import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Landmark, Sparkles } from 'lucide-react';
import ProductCard from '@/components/shop/ProductCard';
import {
  CarouselFadeEdges,
  CarouselNavButton,
} from '@/components/home/CarouselControls';
import SectionHeader from '@/components/home/SectionHeader';
import useRevealOnScroll from '@/hooks/useRevealOnScroll';
import { useGetFeaturedProductsQuery } from '@/services/productsApi';

function ProductCarousel({ products, isVisible, sectionKey, fadeFrom }) {
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
    <div className="relative mt-10">
      <CarouselFadeEdges from={fadeFrom} />

      {showControls && canScrollLeft && (
        <CarouselNavButton
          direction="left"
          label="Scroll products left"
          onClick={() => scrollByAmount(-1)}
        />
      )}

      {showControls && canScrollRight && (
        <CarouselNavButton
          direction="right"
          label="Scroll products right"
          onClick={() => scrollByAmount(1)}
        />
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
  icon,
  background = 'gray',
}) {
  const { ref: sectionRef, isVisible } = useRevealOnScroll();

  if (products.length === 0) {
    return null;
  }

  const isGray = background === 'gray';
  const sectionClass = isGray
    ? 'border-y border-slate-100 bg-slate-50/70'
    : 'bg-white';
  const fadeFrom = isGray ? 'from-slate-50' : 'from-white';

  return (
    <section ref={sectionRef} className={`${sectionClass} py-16 sm:py-20`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className={`reveal-up ${isVisible ? 'is-visible' : ''}`}>
          <SectionHeader
            eyebrow={eyebrow}
            title={title}
            subtitle={subtitle}
            icon={icon}
          />
        </div>

        <ProductCarousel
          sectionKey={sectionKey}
          products={products}
          isVisible={isVisible}
          fadeFrom={fadeFrom}
        />
      </div>
    </section>
  );
}

export default function FeaturedProductsSection({ section = 'all' }) {
  const { data, isLoading } = useGetFeaturedProductsQuery();

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
