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
  showKeySpecs = false,
  maxKeySpecs = 3,
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

  const keySpecs =
    showKeySpecs && product.specifications
      ? Object.entries(product.specifications).slice(0, maxKeySpecs)
      : [];

  const cardClassName = isShop
    ? 'group flex h-full flex-col overflow-hidden rounded-xl border border-slate-200/90 bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-solar-200 hover:shadow-md hover:shadow-solar-600/10 active:scale-[0.99] sm:rounded-2xl sm:hover:-translate-y-1 sm:hover:shadow-lg'
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

      <div className={`flex flex-1 flex-col ${isShop ? 'p-2.5 sm:p-4' : 'p-5'}`}>
        <p
          className={`font-semibold uppercase tracking-wide text-solar-600 ${
            isShop
              ? 'text-[10px] tracking-[0.1em] sm:text-[11px] sm:tracking-[0.12em]'
              : 'text-xs font-medium'
          }`}
        >
          {product.category?.name || 'Solar Product'}
        </p>

        <h3
          className={`mt-1 line-clamp-2 font-bold text-charcoal transition-colors group-hover:text-solar-700 ${
            isShop
              ? 'min-h-[2.5rem] text-sm leading-snug sm:min-h-[2.75rem] sm:text-base'
              : 'text-lg font-semibold'
          }`}
        >
          <Link to={`/shop/product/${product.id}`}>{product.name}</Link>
        </h3>

        {keySpecs.length > 0 && (
          <ul className="mt-3 space-y-1.5 border-t border-gray-100 pt-3">
            {keySpecs.map(([key, value]) => (
              <li
                key={key}
                className="flex items-start justify-between gap-2 text-[11px] leading-snug sm:text-xs"
              >
                <span className="shrink-0 font-medium text-charcoal">{key}</span>
                <span className="truncate text-right text-charcoal-light">
                  {String(value)}
                </span>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-2 flex flex-wrap items-end gap-x-1.5 gap-y-0.5 sm:mt-3 sm:gap-x-2 sm:gap-y-1">
          <span
            className={`font-bold tracking-tight ${
              isShop ? 'text-lg text-solar-700 sm:text-xl lg:text-2xl' : 'text-xl text-solar-700'
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
          <div className="mt-auto flex flex-col gap-1.5 pt-2.5 sm:gap-2 sm:pt-3">
            <Link
              to={`/shop/product/${product.id}`}
              className="inline-flex min-h-[40px] w-full items-center justify-center gap-1 rounded-lg bg-solar-600 px-2.5 py-2 text-center text-[11px] font-semibold leading-snug text-white transition-all duration-200 hover:bg-solar-700 sm:min-h-[44px] sm:rounded-xl sm:px-3 sm:text-xs"
            >
              <span className="whitespace-nowrap">View Details</span>
              <ArrowRight className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" aria-hidden />
            </Link>
            <button
              type="button"
              onClick={handleEnquire}
              className="inline-flex min-h-[40px] w-full items-center justify-center gap-1 rounded-lg border border-solar-200 bg-solar-50 px-2.5 py-2 text-center text-[11px] font-semibold leading-snug text-solar-800 transition-all duration-200 hover:border-solar-300 hover:bg-solar-100 sm:min-h-[44px] sm:rounded-xl sm:px-3 sm:text-xs"
            >
              <MessageCircle className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" aria-hidden />
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
