import { ArrowRight, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '@/components/ui/Button';
import { formatCurrency } from '@/utils/format';

export default function ProductCard({ product }) {
  const imageUrl = product.images?.[0] || '';
  const discountLabel = `${product.discountPercent ?? 18}% OFF`;

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <Link
        to={`/shop/product/${product.id}`}
        className="relative block aspect-[4/3] overflow-hidden bg-gray-100"
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-gray-400">
            No image
          </div>
        )}
        <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-red-500 px-2.5 py-1 text-xs font-bold text-white shadow-sm">
          <Tag className="h-3 w-3" />
          {discountLabel}
        </span>
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs font-medium uppercase tracking-wide text-solar-600">
          {product.category?.name || 'Solar Product'}
        </p>
        <h3 className="mt-1 line-clamp-2 text-lg font-semibold text-charcoal">
          <Link
            to={`/shop/product/${product.id}`}
            className="transition-colors hover:text-solar-700"
          >
            {product.name}
          </Link>
        </h3>

        <div className="mt-3 flex flex-wrap items-end gap-2">
          <span className="text-sm text-gray-400 line-through">
            {formatCurrency(product.originalPrice ?? product.price)}
          </span>
          <span className="text-xl font-bold text-solar-700">
            {formatCurrency(product.discountedPrice)}
          </span>
        </div>

        <Button
          to={`/shop/product/${product.id}`}
          variant="secondary"
          size="sm"
          className="mt-5 w-full"
        >
          View Details
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </article>
  );
}
