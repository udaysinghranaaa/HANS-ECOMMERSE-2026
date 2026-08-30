import { ArrowRight, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ProductCardBadges } from '@/components/shop/ProductBadges';
import { useEnquiryModal } from '@/context/EnquiryModalContext';
import {
  formatCurrency,
  getAmountSaved,
  getEffectiveProductPricing,
  getFestivalProductPricing,
} from '@/utils/format';

export default function ProductCard({
  product,
  festivalPricing,
  inFestivalSection = false,
  onViewDetails,
  variant = 'default',
}) {
  const { openEnquiryModal } = useEnquiryModal();
  const imageUrl = product.images?.[0] || '';
  const pricing = festivalPricing
    ? getFestivalProductPricing(product, festivalPricing.discountPercent)
    : getEffectiveProductPricing(product);
  const hasDiscount = pricing.discountPercent > 0;
  const amountSaved = getAmountSaved(pricing);
  const isShop = variant === 'shop';
  const resolvedFestivalPricing =
    festivalPricing ||
    (product.activeFestivalDiscount
      ? {
          discountPercent: product.activeFestivalDiscount,
          festivalName: product.activeFestival?.name,
        }
      : null);

  const cardClassName = isShop
    ? 'group flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-solar-200 hover:shadow-lg hover:shadow-solar-600/10'
    : `group flex h-full flex-col overflow-hidden rounded-2xl border bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
        inFestivalSection
          ? 'border-gray-200 text-charcoal'
          : 'border-gray-100'
      }`;

  const handleEnquire = (event) => {
    event.preventDefault();
    event.stopPropagation();
    openEnquiryModal({
      enquiryType: 'product',
      productName: product.name,
    });
  };

  return (
    <article className={cardClassName}>
      <Link
        to={`/shop/product/${product.id}`}
        className="relative isolate block aspect-[4/3] overflow-hidden bg-gray-50"
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={product.name}
            className={`h-full w-full object-cover transition-transform duration-500 ${
              isShop ? 'group-hover:scale-110' : 'group-hover:scale-105'
            }`}
            loading="lazy"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-gray-400">
            No image
          </div>
        )}

        {isShop && (
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-solar-900/10 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        )}

        <ProductCardBadges
          product={product}
          festivalPricing={resolvedFestivalPricing}
        />

        {isShop && amountSaved > 0 && (
          <div className="absolute bottom-2.5 left-2.5 z-10 rounded-md border border-solar-100 bg-white/95 px-2 py-1 text-[10px] font-bold text-solar-700 shadow-sm backdrop-blur-sm sm:text-[11px]">
            Save {formatCurrency(amountSaved)}
          </div>
        )}
      </Link>

      <div className={`flex flex-1 flex-col ${isShop ? 'p-3 sm:p-5' : 'p-5'}`}>
        <p
          className={`font-semibold uppercase tracking-wide text-solar-600 ${
            isShop
              ? 'text-[11px] tracking-[0.12em]'
              : 'text-xs font-medium'
          }`}
        >
          {product.category?.name || 'Solar Product'}
        </p>

        <h3
          className={`mt-1.5 line-clamp-2 font-bold text-charcoal transition-colors group-hover:text-solar-700 ${
            isShop
              ? 'min-h-[2.75rem] text-base leading-snug sm:text-[1.05rem]'
              : 'text-lg font-semibold'
          }`}
        >
          <Link to={`/shop/product/${product.id}`}>{product.name}</Link>
        </h3>

        <div className="mt-3 flex flex-wrap items-end gap-x-2 gap-y-1">
          <span
            className={`font-bold tracking-tight ${
              isShop ? 'text-xl text-solar-700 sm:text-2xl' : 'text-xl text-solar-700'
            }`}
          >
            {formatCurrency(pricing.salePrice)}
          </span>
          {hasDiscount && (
            <>
              <span className="text-sm text-gray-400 line-through">
                {formatCurrency(pricing.originalPrice)}
              </span>
              <span
                className={`font-semibold ${
                  isShop
                    ? 'rounded-md bg-solar-50 px-2 py-0.5 text-[10px] text-solar-700 ring-1 ring-solar-100 sm:text-[11px]'
                    : 'rounded-full bg-amber-50 px-2 py-0.5 text-xs text-amber-700'
                }`}
              >
                {pricing.discountPercent}% OFF
              </span>
            </>
          )}
        </div>

        {isShop ? (
          <div className="mt-auto flex flex-col gap-2 pt-3 sm:pt-4">
            <Link
              to={`/shop/product/${product.id}`}
              className="inline-flex min-h-[40px] w-full items-center justify-center gap-1.5 rounded-xl bg-solar-600 px-3 py-2.5 text-center text-xs font-semibold leading-snug text-white transition-all duration-200 hover:bg-solar-700 hover:shadow-md hover:shadow-solar-600/20 sm:text-sm"
            >
              <span className="whitespace-nowrap">View Details</span>
              <ArrowRight className="h-4 w-4 shrink-0" aria-hidden />
            </Link>
            <button
              type="button"
              onClick={handleEnquire}
              className="inline-flex min-h-[40px] w-full items-center justify-center gap-1.5 rounded-xl border border-solar-200 bg-solar-50 px-3 py-2.5 text-center text-xs font-semibold leading-snug text-solar-800 transition-all duration-200 hover:border-solar-300 hover:bg-solar-100 sm:text-sm"
            >
              <MessageCircle className="h-4 w-4 shrink-0" aria-hidden />
              <span className="whitespace-nowrap">Enquire</span>
            </button>
          </div>
        ) : onViewDetails ? (
          <button
            type="button"
            onClick={onViewDetails}
            className={`mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200 ${
              inFestivalSection
                ? 'bg-solar-600 text-white hover:bg-solar-700'
                : 'border border-solar-600 bg-white text-solar-700 hover:bg-solar-50'
            }`}
          >
            View Details
            <ArrowRight className="h-4 w-4" />
          </button>
        ) : (
          <Link
            to={`/shop/product/${product.id}`}
            className={`mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200 ${
              inFestivalSection
                ? 'bg-solar-600 text-white hover:bg-solar-700'
                : 'border border-solar-600 bg-white text-solar-700 hover:bg-solar-50'
            }`}
          >
            View Details
            <ArrowRight className="h-4 w-4" />
          </Link>
        )}
      </div>
    </article>
  );
}
