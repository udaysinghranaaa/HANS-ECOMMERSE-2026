import { Link } from 'react-router-dom';
import { ArrowRight, PackageOpen, Sparkles } from 'lucide-react';
import Button from '@/components/ui/Button';
import ProductCard from '@/components/shop/ProductCard';
import SectionHeader from '@/components/home/SectionHeader';

export default function RelatedProductsSection({
  products,
  categoryName,
  categorySlug,
}) {
  const subtitle =
    products.length > 0
      ? categoryName
        ? `Explore more ${categoryName} options and compare specs, pricing, and features side by side.`
        : 'Discover similar solar products and compare specs, pricing, and features side by side.'
      : 'Browse our full solar catalogue to compare panels, inverters, batteries, and complete system solutions.';

  return (
    <section
      aria-label="You may also like"
      className="mt-8 border-t border-gray-200 bg-gradient-to-b from-white to-slate-50/80 py-8 sm:mt-12 sm:py-14"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeader
            eyebrow="Compare & Discover"
            title="You May Also Like"
            subtitle={subtitle}
            icon={Sparkles}
            className="max-w-2xl"
          />
          {categorySlug && products.length > 0 && (
            <Button
              to={`/shop/${categorySlug}`}
              variant="secondary"
              size="sm"
              className="shrink-0 rounded-xl border-slate-200"
            >
              View all in {categoryName}
              <ArrowRight className="h-4 w-4" />
            </Button>
          )}
        </div>

        {products.length > 0 ? (
          <>
            <div className="mt-6 grid grid-cols-1 gap-4 sm:mt-8 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4 lg:gap-6">
              {products.map((relatedProduct) => (
                <div key={relatedProduct.id} className="h-full">
                  <ProductCard
                    product={relatedProduct}
                    variant="shop"
                    showKeySpecs
                  />
                </div>
              ))}
            </div>

            {categorySlug && (
              <div className="mt-8 flex justify-center sm:hidden">
                <Link
                  to={`/shop/${categorySlug}`}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-solar-700 hover:text-solar-800"
                >
                  View all in {categoryName}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            )}
          </>
        ) : (
          <div className="mt-10 flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white/80 px-6 py-12 text-center shadow-sm">
            <PackageOpen className="h-11 w-11 text-gray-300" aria-hidden="true" />
            <p className="mt-4 max-w-md text-base font-semibold text-charcoal">
              More products coming soon
            </p>
            <p className="mt-2 max-w-md text-sm text-charcoal-light">
              Explore our shop to discover solar panels, inverters, batteries, and
              complete installation solutions.
            </p>
            <Button to="/shop" variant="secondary" className="mt-6 rounded-xl">
              Browse Shop
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
