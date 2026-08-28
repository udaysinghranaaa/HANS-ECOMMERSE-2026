import { ArrowRight, BatteryCharging, Package, Sun, Zap } from 'lucide-react';
import Button from '@/components/ui/Button';
import { productCategories } from '@/constants/homeContent';

const iconMap = { Sun, Zap, BatteryCharging, Package };

const gradientMap = {
  Sun: 'from-amber-100 to-orange-50',
  Zap: 'from-solar-100 to-emerald-50',
  BatteryCharging: 'from-blue-100 to-cyan-50',
  Package: 'from-gray-100 to-slate-50',
};

export default function ProductShowcase() {
  return (
    <section className="bg-gray-50 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-charcoal sm:text-4xl">
            Explore Our Solar Products
          </h2>
          <p className="mt-4 text-base text-charcoal-light sm:text-lg">
            Browse our product categories and explore solar solutions for every
            need.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {productCategories.map(({ name, slug, description, icon }) => {
            const Icon = iconMap[icon];
            return (
              <article
                key={slug}
                className="group overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <div
                  className={`flex h-44 items-center justify-center bg-gradient-to-br ${gradientMap[icon]}`}
                >
                  <Icon
                    className="h-16 w-16 text-solar-700/80 transition-transform duration-300 group-hover:scale-110"
                    aria-hidden="true"
                  />
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-semibold text-charcoal">{name}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-charcoal-light">
                    {description}
                  </p>
                  <Button
                    to={`/shop/${slug}`}
                    variant="secondary"
                    size="sm"
                    className="mt-4"
                  >
                    View Products
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
