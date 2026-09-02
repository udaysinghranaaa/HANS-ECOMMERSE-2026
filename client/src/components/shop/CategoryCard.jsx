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
      className={`reveal-up group flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100/80 transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-lg hover:shadow-solar-600/10 hover:ring-solar-200/70 active:scale-[0.99] ${
        isVisible ? 'is-visible' : ''
      } ${compact ? 'w-[260px] sm:w-[280px]' : 'w-full'}`}
    >
      <div className="relative m-2.5 mb-0 overflow-hidden rounded-xl bg-gray-100 sm:m-3">
        <div className="aspect-[4/3] overflow-hidden">
          {category.image ? (
            <img
              src={category.image}
              alt={category.name}
              className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-gradient-to-br from-solar-50 via-white to-emerald-50">
              <Layers className="h-10 w-10 text-solar-600/50 sm:h-12 sm:w-12" />
            </div>
          )}
        </div>

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-charcoal/70 via-charcoal/10 to-transparent" />
      </div>

      <div className="flex flex-1 flex-col p-3 pt-4 sm:p-4 sm:pt-5">
        <h3 className="line-clamp-2 text-sm font-semibold leading-snug tracking-tight text-charcoal transition-colors duration-300 group-hover:text-solar-700 sm:text-base">
          {category.name}
        </h3>

        <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-solar-700 sm:mt-4 sm:text-sm">
          <span className="relative after:absolute after:-bottom-0.5 after:left-0 after:h-px after:w-0 after:bg-solar-600 after:transition-all after:duration-300 group-hover:after:w-full">
            Explore
          </span>
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-solar-50 text-solar-700 transition-all duration-300 group-hover:translate-x-0.5 group-hover:bg-solar-600 group-hover:text-white sm:h-7 sm:w-7">
            <ArrowRight className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
          </span>
        </span>
      </div>
    </Link>
  );
}
