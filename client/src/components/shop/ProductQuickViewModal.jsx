import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, X } from 'lucide-react';
import Button from '@/components/ui/Button';
import { ProductCardBadges } from '@/components/shop/ProductBadges';
import { lockBodyScroll, unlockBodyScroll } from '@/utils/bodyScrollLock';
import {
  formatCurrency,
  getEffectiveProductPricing,
  getFestivalProductPricing,
} from '@/utils/format';

export default function ProductQuickViewModal({
  product,
  festivalPricing,
  onClose,
}) {
  useEffect(() => {
    if (!product) {
      return undefined;
    }

    lockBodyScroll();

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      unlockBodyScroll();
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose, product]);

  if (!product) {
    return null;
  }

  const imageUrl = product.images?.[0] || '';
  const pricing = festivalPricing
    ? getFestivalProductPricing(product, festivalPricing.discountPercent)
    : getEffectiveProductPricing(product);
  const resolvedFestivalPricing =
    festivalPricing ||
    (product.activeFestivalDiscount
      ? {
          discountPercent: product.activeFestivalDiscount,
          festivalName: product.activeFestival?.name,
        }
      : null);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6">
      <button
        type="button"
        aria-label="Close product details"
        className="absolute inset-0 bg-charcoal/50 backdrop-blur-[2px]"
        onClick={onClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-quick-view-title"
        className="relative z-10 max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl border border-gray-200 bg-white text-charcoal shadow-2xl"
      >
        <button
          type="button"
          aria-label="Close"
          onClick={onClose}
          className="absolute right-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-white text-charcoal shadow-sm ring-1 ring-gray-200 transition hover:bg-gray-50"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-gray-400">
              No image
            </div>
          )}
          <ProductCardBadges
            product={product}
            festivalPricing={resolvedFestivalPricing}
          />
        </div>

        <div className="p-6 sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-wide text-solar-600">
            {product.category?.name || 'Solar Product'}
          </p>
          <h2
            id="product-quick-view-title"
            className="mt-2 text-2xl font-bold text-charcoal"
          >
            {product.name}
          </h2>

          <div className="mt-4 flex flex-wrap items-end gap-2">
            <span className="text-2xl font-bold text-solar-700">
              {formatCurrency(pricing.salePrice)}
            </span>
            {pricing.discountPercent > 0 && (
              <>
                <span className="text-sm text-gray-400 line-through">
                  {formatCurrency(pricing.originalPrice)}
                </span>
                <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                  {pricing.discountPercent}% OFF
                </span>
              </>
            )}
          </div>

          {product.description && (
            <p className="mt-4 line-clamp-4 text-sm leading-relaxed text-charcoal-light">
              {product.description}
            </p>
          )}

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Button to={`/shop/product/${product.id}`} size="md" className="flex-1">
              View Full Details
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button
              to={`/shop/product/${product.id}`}
              variant="secondary"
              size="md"
              className="flex-1 border-gray-300 text-charcoal hover:bg-gray-50"
            >
              Enquire Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
