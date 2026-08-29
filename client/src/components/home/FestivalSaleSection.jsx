import { ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '@/components/ui/Button';
import ProductCard from '@/components/shop/ProductCard';
import FestivalCountdown from '@/components/home/FestivalCountdown';
import useFestivalCountdown from '@/hooks/useFestivalCountdown';
import { useGetActiveFestivalQuery } from '@/services/festivalsApi';

function FestivalProductGrid({ products, festivalName }) {
  return (
    <div className="mt-10 grid gap-4 sm:mt-12 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product, index) => (
        <div key={product.id}>
          <ProductCard
            product={product}
            festivalPricing={{
              discountPercent: product.festivalDiscountPercent,
              festivalName,
            }}
          />
        </div>
      ))}
    </div>
  );
}

export default function FestivalSaleSection() {
  const { data, isLoading, isFetching } = useGetActiveFestivalQuery(undefined, {
    refetchOnMountOrArgChange: false,
    refetchOnFocus: false,
    refetchOnReconnect: true,
  });

  const festival = data?.data?.festival;
  const products = data?.data?.products ?? [];
  const remaining = useFestivalCountdown(festival?.endsAt);

  if ((isLoading && !data) || isFetching && !festival) {
    return null;
  }

  if (!festival || !remaining || products.length === 0) {
    return null;
  }

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-amber-500 via-orange-500 to-solar-700 py-16 text-white sm:py-20">
      <div className="pointer-events-none absolute -left-20 top-0 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-16 bottom-0 h-80 w-80 rounded-full bg-solar-400/20 blur-3xl" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.18),transparent_35%)]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-amber-50 ring-1 ring-white/15">
              <Sparkles className="h-3.5 w-3.5" />
              {festival.name} Festival Sale
            </p>
            <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              {festival.title}
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-amber-50/95 sm:text-lg">
              {festival.description}
            </p>
            {festival.discountPercent && (
              <p className="mt-3 inline-flex rounded-full bg-white/15 px-3 py-1 text-sm font-semibold text-white ring-1 ring-white/20">
                Up to {festival.discountPercent}% off on festival products
              </p>
            )}

            <div className="mt-8 max-w-xl">
              <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-amber-100">
                Offer Ends In
              </p>
              <FestivalCountdown remaining={remaining} />
            </div>

            <Button
              to="/shop"
              variant="white"
              size="lg"
              className="mt-8 shadow-lg shadow-black/10"
            >
              Explore Sale
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>

          <div>
            <div className="overflow-hidden rounded-3xl border border-white/20 bg-white/10 p-3 shadow-2xl shadow-black/10 backdrop-blur-sm">
              {festival.imageUrl ? (
                <img
                  src={festival.imageUrl}
                  alt={festival.name}
                  className="aspect-[4/3] w-full rounded-2xl object-cover"
                  loading="eager"
                  decoding="async"
                  fetchPriority="high"
                />
              ) : (
                <div className="flex aspect-[4/3] items-center justify-center rounded-2xl bg-white/10">
                  <Sparkles className="h-16 w-16 text-white/70" />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-12">
          <div>
            <h3 className="text-xl font-semibold text-white sm:text-2xl">
              Festival Sale Products
            </h3>
            <p className="mt-1 text-sm text-amber-50/90">
              {products.length} product{products.length === 1 ? '' : 's'} on special
              festival pricing
            </p>
          </div>

          <FestivalProductGrid products={products} festivalName={festival.name} />
        </div>

        <div className="mt-8 text-center sm:hidden">
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 text-sm font-semibold text-white"
          >
            Explore Sale
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
