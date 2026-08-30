import { Link } from 'react-router-dom';
import { ArrowLeft, Grid3X3, ShoppingBag, Sun } from 'lucide-react';

export default function CategoryHero({ category, productCount }) {
  if (!category) {
    return (
      <section className="relative overflow-hidden border-b border-solar-100 bg-gradient-to-br from-solar-50 via-white to-emerald-50/60">
        <div className="pointer-events-none absolute -left-16 top-0 h-56 w-56 rounded-full bg-solar-200/40 blur-3xl" />
        <div className="pointer-events-none absolute -right-12 bottom-0 h-64 w-64 rounded-full bg-emerald-200/30 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8 lg:py-14">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-solar-200 bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-solar-700 shadow-sm">
              <ShoppingBag className="h-3.5 w-3.5" />
              HANS Solar Shop
            </span>
            {productCount > 0 && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-solar-600 px-3 py-1 text-[11px] font-semibold text-white shadow-sm shadow-solar-600/20">
                <Sun className="h-3.5 w-3.5" />
                {productCount} products
              </span>
            )}
          </div>
          <h1 className="mt-4 max-w-3xl text-3xl font-bold tracking-tight text-charcoal sm:text-4xl lg:text-[2.65rem] lg:leading-tight">
            Premium Solar Products
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-charcoal-light sm:text-lg">
            Browse panels, inverters, batteries and complete solar solutions for
            homes, businesses and industries.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="relative overflow-hidden border-b border-gray-200 bg-white">
      <div className="absolute inset-0">
        {category.image ? (
          <img
            src={category.image}
            alt=""
            aria-hidden="true"
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-solar-100 via-white to-emerald-50" />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/88 to-white/75" />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 rounded-full border border-solar-200 bg-white px-3 py-1.5 text-sm font-medium text-solar-700 shadow-sm transition hover:border-solar-300 hover:bg-solar-50"
        >
          <ArrowLeft className="h-4 w-4" />
          All Products
        </Link>

        <div className="mt-5 max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-solar-200 bg-solar-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-solar-700">
            <Grid3X3 className="h-3.5 w-3.5" />
            Category
          </div>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-charcoal sm:text-4xl lg:text-5xl">
            {category.name}
          </h1>
          {category.description && (
            <p className="mt-3 max-w-2xl text-base leading-relaxed text-charcoal-light">
              {category.description}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
