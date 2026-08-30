import { useState } from 'react';
import { ArrowRight, ChevronRight, Clock, Sparkles, Tag, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '@/components/ui/Button';
import { ProductSaleBadge } from '@/components/shop/ProductBadges';
import ProductQuickViewModal from '@/components/shop/ProductQuickViewModal';
import FestivalCountdown from '@/components/home/FestivalCountdown';
import useFestivalCountdown from '@/hooks/useFestivalCountdown';
import { useGetActiveFestivalQuery } from '@/services/festivalsApi';
import {
  formatCurrency,
  getAmountSaved,
  getFestivalProductPricing,
} from '@/utils/format';

function FestivalProductCard({ product, onViewDetails }) {
  const imageUrl = product.images?.[0] || '';
  const pricing = getFestivalProductPricing(
    product,
    product.festivalDiscountPercent,
  );
  const amountSaved = getAmountSaved(pricing);

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200/90 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.06)] ring-1 ring-slate-900/[0.04] transition-all duration-300 hover:-translate-y-1.5 hover:border-solar-200 hover:shadow-[0_20px_40px_rgba(22,163,74,0.12)] hover:ring-solar-100">
      <button
        type="button"
        onClick={onViewDetails}
        className="relative block w-full overflow-hidden bg-gray-50 text-left"
      >
        <div className="aspect-[4/3] overflow-hidden">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={product.name}
              className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-gray-400">
              No image
            </div>
          )}
        </div>

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-800/50 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        {pricing.discountPercent > 0 && (
          <div className="absolute left-3 top-3 z-10">
            <ProductSaleBadge
              saleDiscountPercent={pricing.discountPercent}
              label="Festival Sale"
            />
          </div>
        )}

        {amountSaved > 0 && (
          <div className="absolute bottom-3 left-3 z-10 rounded-lg bg-slate-800/90 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-sm">
            Save {formatCurrency(amountSaved)}
          </div>
        )}
      </button>

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-solar-600">
          {product.category?.name || 'Solar Product'}
        </p>

        <h3 className="mt-1.5 line-clamp-2 min-h-[2.75rem] text-base font-bold leading-snug text-charcoal transition-colors group-hover:text-solar-700 sm:text-[1.05rem]">
          {product.name}
        </h3>

        <div className="mt-3 flex flex-wrap items-end gap-x-2 gap-y-1">
          <span className="text-xl font-bold tracking-tight text-charcoal sm:text-2xl">
            {formatCurrency(pricing.salePrice)}
          </span>
          {pricing.discountPercent > 0 && (
            <>
              <span className="text-sm text-gray-400 line-through">
                {formatCurrency(pricing.originalPrice)}
              </span>
              <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-700 ring-1 ring-emerald-100">
                {pricing.discountPercent}% OFF
              </span>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={onViewDetails}
          className="mt-4 inline-flex w-full min-h-[44px] items-center justify-center gap-2 rounded-xl bg-slate-700 px-4 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:bg-solar-600 hover:text-white hover:shadow-lg hover:shadow-solar-600/20 group-hover:bg-solar-600 group-hover:text-white group-hover:shadow-lg group-hover:shadow-solar-600/20"
        >
          <span className="text-white">View Deal</span>
          <ArrowRight className="h-4 w-4 text-white transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden />
        </button>
      </div>
    </article>
  );
}

function FestivalProductRail({ products, onViewDetails }) {
  return (
    <>
      <div className="festival-product-rail flex gap-4 overflow-x-auto pb-3 pt-1 lg:hidden">
        {products.map((product) => (
          <div
            key={product.id}
            className="w-[82vw] max-w-[300px] shrink-0 snap-start sm:w-[280px]"
          >
            <FestivalProductCard
              product={product}
              onViewDetails={() => onViewDetails(product)}
            />
          </div>
        ))}
      </div>

      <div className="hidden gap-5 lg:grid lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product) => (
          <FestivalProductCard
            key={product.id}
            product={product}
            onViewDetails={() => onViewDetails(product)}
          />
        ))}
      </div>
    </>
  );
}

export default function FestivalSaleSection() {
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const { data, isLoading, isFetching } = useGetActiveFestivalQuery(undefined, {
    refetchOnMountOrArgChange: false,
    refetchOnFocus: false,
    refetchOnReconnect: true,
  });

  const festival = data?.data?.festival;
  const products = data?.data?.products ?? [];
  const remaining = useFestivalCountdown(festival?.endsAt);

  if ((isLoading && !data) || (isFetching && !festival)) {
    return null;
  }

  if (!festival || !remaining || products.length === 0) {
    return null;
  }

  const maxDiscount = Math.max(
    ...products.map((product) => product.festivalDiscountPercent || 0),
    festival.discountPercent || 0,
  );

  return (
    <>
      <section className="relative overflow-hidden">
        <div className="relative bg-gradient-to-br from-slate-800 via-slate-800 to-slate-900 pb-28 pt-8 sm:pb-32 sm:pt-10">
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -left-20 top-0 h-64 w-64 rounded-full bg-solar-500/15 blur-3xl" />
            <div className="absolute -right-16 top-20 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl" />
            <div className="absolute bottom-0 left-1/2 h-40 w-[120%] -translate-x-1/2 bg-gradient-to-t from-solar-600/10 to-transparent" />
            <div
              className="absolute inset-0 opacity-[0.04]"
              style={{
                backgroundImage:
                  'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
                backgroundSize: '28px 28px',
              }}
            />
          </div>

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-6 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-red-500/90 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white shadow-lg shadow-red-500/25">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-70" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
                </span>
                Live Now
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-solar-100 backdrop-blur-sm">
                <Sparkles className="h-3.5 w-3.5 text-solar-300" />
                {festival.name} Festival Sale
              </span>
            </div>

            <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12">
              <div>
                <h2 className="max-w-2xl text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl lg:leading-[1.1]">
                  {festival.title}
                </h2>
                <p className="mt-4 max-w-xl text-base leading-relaxed text-gray-300 sm:text-lg">
                  {festival.description}
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                  {maxDiscount > 0 && (
                    <div className="inline-flex items-center gap-2 rounded-xl border border-emerald-400/30 bg-emerald-500/10 px-4 py-2.5 text-sm font-semibold text-emerald-100">
                      <Tag className="h-4 w-4 text-emerald-300" />
                      Up to {maxDiscount}% off selected solar products
                    </div>
                  )}
                  <div className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-gray-200">
                    <Zap className="h-4 w-4 text-solar-300" />
                    {products.length} deal{products.length === 1 ? '' : 's'} live
                  </div>
                </div>

                <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur-sm sm:p-5">
                  <div className="mb-3 flex items-center gap-2 text-solar-200">
                    <Clock className="h-4 w-4" />
                    <p className="text-xs font-semibold uppercase tracking-[0.18em]">
                      Offer ends in
                    </p>
                  </div>
                  <FestivalCountdown remaining={remaining} variant="sale" />
                </div>

                <Button
                  to="/shop"
                  size="lg"
                  className="mt-8 shadow-xl shadow-solar-600/30"
                >
                  Shop All Deals
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>

              <div className="relative">
                <div className="absolute -inset-3 rounded-[1.75rem] bg-gradient-to-br from-solar-500/30 via-transparent to-emerald-500/20 blur-xl" />
                <div className="relative overflow-hidden rounded-2xl border border-white/15 bg-white/5 p-2 shadow-2xl shadow-slate-900/25 backdrop-blur-sm sm:rounded-3xl sm:p-3">
                  {festival.imageUrl ? (
                    <img
                      src={festival.imageUrl}
                      alt={festival.name}
                      className="aspect-[4/3] w-full rounded-xl object-cover sm:rounded-2xl"
                      loading="eager"
                      decoding="async"
                      fetchPriority="high"
                    />
                  ) : (
                    <div className="flex aspect-[4/3] items-center justify-center rounded-xl bg-gradient-to-br from-solar-900/40 to-slate-800 sm:rounded-2xl">
                      <Sparkles className="h-16 w-16 text-solar-300/60" />
                    </div>
                  )}

                  {maxDiscount > 0 && (
                    <div className="absolute bottom-5 left-5 rounded-2xl bg-white px-4 py-3 shadow-xl">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-solar-600">
                        Festival Offer
                      </p>
                      <p className="text-2xl font-black text-charcoal">
                        {maxDiscount}%
                        <span className="ml-1 text-sm font-bold text-emerald-600">
                          OFF
                        </span>
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 -mt-20 pb-16 sm:-mt-24 sm:pb-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="overflow-hidden rounded-3xl border border-gray-200/80 bg-white shadow-[0_24px_60px_rgba(15,23,42,0.1)]">
              <div className="border-b border-gray-100 bg-gradient-to-r from-gray-50 via-white to-solar-50/40 px-5 py-5 sm:px-8 sm:py-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.16em] text-solar-700">
                      <ChevronRight className="h-3.5 w-3.5" />
                      Top Festival Picks
                    </p>
                    <h3 className="mt-2 text-2xl font-bold text-charcoal sm:text-3xl">
                      Deals You Shouldn&apos;t Miss
                    </h3>
                    <p className="mt-1.5 text-sm text-charcoal-light">
                      Premium solar products at limited-time festival prices
                    </p>
                  </div>
                  <Link
                    to="/shop"
                    className="inline-flex shrink-0 items-center gap-2 self-start rounded-full border border-solar-200 bg-solar-50 px-4 py-2 text-sm font-semibold text-solar-800 transition hover:border-solar-300 hover:bg-solar-100 sm:self-auto"
                  >
                    View all deals
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>

                <p className="mt-4 flex items-center gap-2 text-xs font-medium text-charcoal-light lg:hidden">
                  <span className="inline-block h-1 w-8 rounded-full bg-solar-400" />
                  Swipe to explore festival deals
                </p>
              </div>

              <div className="px-5 py-6 sm:px-8 sm:py-8">
                <FestivalProductRail
                  products={products}
                  onViewDetails={setQuickViewProduct}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <ProductQuickViewModal
        product={quickViewProduct}
        festivalPricing={
          quickViewProduct
            ? {
                discountPercent: quickViewProduct.festivalDiscountPercent,
                festivalName: festival.name,
              }
            : null
        }
        onClose={() => setQuickViewProduct(null)}
      />

      <style>{`
        .festival-product-rail {
          scroll-snap-type: x mandatory;
          scroll-padding-inline: 1.25rem;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .festival-product-rail::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </>
  );
}
