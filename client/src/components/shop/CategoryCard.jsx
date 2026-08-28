import { Link } from 'react-router-dom';
import { ArrowRight, Layers } from 'lucide-react';

export default function CategoryCard({
  category,
  compact = false,
  isVisible = true,
  revealDelay = 0,
}) {
  return (
    <Link
      to={`/shop/${category.slug}`}
      style={{ animationDelay: `${revealDelay}ms` }}
      className={`reveal-up group flex shrink-0 flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100/80 transition-all duration-500 ease-out hover:-translate-y-1.5 hover:shadow-xl hover:shadow-solar-600/10 hover:ring-solar-200/70 ${
        isVisible ? 'is-visible' : ''
      } ${compact ? 'w-[260px] sm:w-[280px]' : 'w-full'}`}
    >
      <div className="relative m-3 mb-0 overflow-hidden rounded-xl bg-gray-100">
        <div className="aspect-[4/3] overflow-hidden">
          {category.image ? (
            <img
              src={category.image}
              alt={category.name}
              className="h-full w-full object-cover transition-transform duration-700 ease-out will-change-transform group-hover:scale-110"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-gradient-to-br from-solar-50 via-white to-emerald-50">
              <Layers className="h-12 w-12 text-solar-600/50 transition-transform duration-500 group-hover:scale-110" />
            </div>
          )}
        </div>

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-charcoal/75 via-charcoal/15 to-transparent" />
        <div className="pointer-events-none absolute inset-0 bg-solar-900/0 transition-colors duration-500 group-hover:bg-solar-900/10" />
      </div>

      <div className="flex flex-1 flex-col p-4 pt-5 sm:p-5 sm:pt-6">
        <h3 className="text-base font-semibold tracking-tight text-charcoal transition-colors duration-300 group-hover:text-solar-700 sm:text-lg">
          {category.name}
        </h3>

        <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-solar-700">
          <span className="relative after:absolute after:-bottom-0.5 after:left-0 after:h-px after:w-0 after:bg-solar-600 after:transition-all after:duration-300 group-hover:after:w-full">
            Explore Category
          </span>
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-solar-50 text-solar-700 transition-all duration-300 group-hover:translate-x-0.5 group-hover:bg-solar-600 group-hover:text-white">
            <ArrowRight className="h-3.5 w-3.5" />
          </span>
        </span>
      </div>
    </Link>
  );
}
