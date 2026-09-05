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
    <>
      <div className="mt-8 grid grid-cols-2 gap-3 sm:hidden">
        {products.map((product, index) => (
          <div
            key={`${sectionKey}-mobile-${product.id}`}
            style={{ animationDelay: `${100 + index * 70}ms` }}
            className={`reveal-up min-w-0 ${isVisible ? 'is-visible' : ''}`}
          >
            <ProductCard product={product} imagePriority={index < 4} />
          </div>
        ))}
      </div>

      <div className="relative mt-8 hidden sm:mt-9 sm:block">
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
            <ProductCard product={product} imagePriority={index < 2} />
          </div>
        ))}
      </div>
    </div>
    </>
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
  layout = 'standalone',
}) {
  const { ref: blockRef, isVisible } = useRevealOnScroll();

  if (products.length === 0) {
    return null;
  }

  const isGray = background === 'gray';
  const fadeFrom = isGray ? 'from-slate-50' : 'from-white';

  const paddingClass =
    layout === 'group-start'
      ? 'pt-12 pb-7 sm:pt-14 sm:pb-8'
      : layout === 'group-end'
        ? 'border-t border-slate-200/70 pt-8 pb-12 sm:pt-10 sm:pb-14'
        : 'py-12 sm:py-14';

  const backgroundClass =
    layout === 'standalone'
      ? isGray
        ? 'border-y border-slate-100 bg-slate-50/70'
        : 'bg-white'
      : isGray
        ? 'bg-slate-50/70'
        : 'bg-white';

  const Tag = layout === 'standalone' ? 'section' : 'div';

  return (
    <Tag ref={blockRef} className={`${backgroundClass} ${paddingClass}`}>
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
    </Tag>
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
  const hasTrending = showTrending && trendingProducts.length > 0;
  const hasSubsidy = showSubsidy && subsidyProducts.length > 0;

  if (
    (showTrending && trendingProducts.length === 0 && !showSubsidy) ||
    (showSubsidy && subsidyProducts.length === 0 && !showTrending) ||
    (section === 'all' &&
      trendingProducts.length === 0 &&
      subsidyProducts.length === 0)
  ) {
    return null;
  }

  if (hasTrending && hasSubsidy) {
    return (
      <section className="border-y border-slate-100">
        <FeaturedProductBlock
          sectionKey="trending"
          eyebrow="Trending Now"
          title="TRENDING PRODUCTS"
          subtitle="Our most popular solar products, loved by customers."
          products={trendingProducts}
          icon={Sparkles}
          background="gray"
          layout="group-start"
        />
        <FeaturedProductBlock
          sectionKey="subsidy"
          eyebrow="Subsidy Eligible"
          title="TOP GOVT SUBSIDY PRODUCTS"
          subtitle="Popular subsidy-eligible solar solutions to help you save more on clean energy."
          products={subsidyProducts}
          icon={Landmark}
          background="white"
          layout="group-end"
        />
      </section>
    );
  }

  return (
    <>
      {hasTrending && (
        <FeaturedProductBlock
          sectionKey="trending"
          eyebrow="Trending Now"
          title="TRENDING PRODUCTS"
          subtitle="Our most popular solar products, loved by customers."
          products={trendingProducts}
          icon={Sparkles}
          background="gray"
          layout="standalone"
        />
      )}
      {hasSubsidy && (
        <FeaturedProductBlock
          sectionKey="subsidy"
          eyebrow="Subsidy Eligible"
          title="TOP GOVT SUBSIDY PRODUCTS"
          subtitle="Popular subsidy-eligible solar solutions to help you save more on clean energy."
          products={subsidyProducts}
          icon={Landmark}
          background="white"
          layout="standalone"
        />
      )}
    </>
  );
}
