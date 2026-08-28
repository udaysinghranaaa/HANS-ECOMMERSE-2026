import { Tag, Zap } from 'lucide-react';

export function ProductDiscountBadge({ discountPercent = 18, size = 'sm' }) {
  const classes =
    size === 'lg'
      ? 'px-3 py-1 text-sm'
      : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full bg-red-500 font-bold text-white shadow-sm ${classes}`}
    >
      <Tag className={size === 'lg' ? 'h-4 w-4' : 'h-3 w-3'} />
      {discountPercent}% OFF
    </span>
  );
}

export function ProductSaleBadge({ saleDiscountPercent, size = 'sm' }) {
  if (!saleDiscountPercent) {
    return null;
  }

  const classes =
    size === 'lg'
      ? 'px-3 py-1 text-sm'
      : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 font-bold uppercase tracking-wide text-white shadow-sm ${classes}`}
    >
      <Zap className={size === 'lg' ? 'h-4 w-4' : 'h-3 w-3'} />
      Sale {saleDiscountPercent}% Off
    </span>
  );
}

export function ProductCardBadges({ product }) {
  const discountPercent = product.discountPercent ?? 18;
  const showSale = product.isOnSale && product.saleDiscountPercent;

  return (
    <div className="pointer-events-none absolute inset-x-3 top-3 z-10 flex items-start justify-between gap-2">
      <ProductDiscountBadge discountPercent={discountPercent} />
      {showSale ? (
        <ProductSaleBadge saleDiscountPercent={product.saleDiscountPercent} />
      ) : (
        <span aria-hidden="true" />
      )}
    </div>
  );
}

export function ProductDetailBadges({ product }) {
  const discountPercent = product.discountPercent ?? 18;
  const showSale = product.isOnSale && product.saleDiscountPercent;

  return (
    <div className="flex flex-wrap items-center gap-3">
      <ProductDiscountBadge discountPercent={discountPercent} size="lg" />
      {showSale && (
        <ProductSaleBadge
          saleDiscountPercent={product.saleDiscountPercent}
          size="lg"
        />
      )}
    </div>
  );
}
