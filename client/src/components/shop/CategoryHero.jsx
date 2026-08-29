import { Link } from 'react-router-dom';
import { ArrowLeft, ShoppingBag } from 'lucide-react';

export default function CategoryHero({ category }) {
  if (!category) {
    return (
      <section className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-14 lg:px-8">
          <div className="flex items-center gap-3 text-solar-600">
            <ShoppingBag className="h-6 w-6" />
            <span className="text-sm font-semibold uppercase tracking-wider">
              HANS Solar Shop
            </span>
          </div>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-charcoal sm:text-4xl">
            All Solar Products
          </h1>
          <p className="mt-3 max-w-2xl text-base text-charcoal-light sm:text-lg">
            Browse our complete range of solar panels, inverters, batteries and
            accessories.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="relative overflow-hidden border-b border-gray-200">
      <div className="absolute inset-0">
        {category.image ? (
          <img
            src={category.image}
            alt=""
            aria-hidden="true"
            className="h-full w-full scale-105 object-cover"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-solar-700 via-solar-600 to-emerald-700" />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal/90 via-charcoal/70 to-charcoal/45" />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/40 via-transparent to-transparent" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 text-sm font-medium text-white/80 transition-colors hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Shop
        </Link>

        <div className="mt-6 max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white/90 backdrop-blur-sm">
            <ShoppingBag className="h-3.5 w-3.5" />
            Category
          </div>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
            {category.name}
          </h1>
        </div>
      </div>
    </section>
  );
}
