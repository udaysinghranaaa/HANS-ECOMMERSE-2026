import { Link } from 'react-router-dom';
import { ArrowRight, Loader2 } from 'lucide-react';
import Button from '@/components/ui/Button';
import CategoryCard from '@/components/shop/CategoryCard';
import SectionHeader from '@/components/home/SectionHeader';
import useRevealOnScroll from '@/hooks/useRevealOnScroll';
import { useGetPublicCategoriesQuery } from '@/services/categoriesApi';

const HOMEPAGE_CATEGORY_LIMIT = 4;

export default function ProductShowcase() {
  const { ref: sectionRef, isVisible: sectionVisible } = useRevealOnScroll();
  const { data, isLoading, isError } = useGetPublicCategoriesQuery();

  const categories = data?.data?.categories ?? [];
  const featuredCategories = categories.slice(0, HOMEPAGE_CATEGORY_LIMIT);
  const hasMoreCategories = categories.length > HOMEPAGE_CATEGORY_LIMIT;

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden border-t border-slate-100 bg-gradient-to-b from-white via-slate-50/30 to-white py-10 sm:py-12 lg:py-14"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -right-20 top-0 h-56 w-56 rounded-full bg-solar-100/30 blur-3xl" />
        <div className="absolute -left-16 bottom-0 h-48 w-48 rounded-full bg-emerald-100/20 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div
          className={`reveal-up flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between ${sectionVisible ? 'is-visible' : ''}`}
        >
          <SectionHeader
            eyebrow="Product Categories"
            title="Shop Solar by Category"
            subtitle="Panels, inverters, batteries and accessories — curated for every installation need."
            showAccent
            className="max-w-2xl"
          />
          {categories.length > 0 ? (
            <Button
              to="/shop/categories"
              variant="secondary"
              size="sm"
              className="min-h-[44px] shrink-0 rounded-xl border-solar-200 px-5"
            >
              View All Categories
              <ArrowRight className="h-4 w-4" />
            </Button>
          ) : null}
        </div>

        {isLoading ? (
          <div className="mt-8 flex min-h-52 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-solar-600" />
          </div>
        ) : isError ? (
          <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-8 text-center text-red-700">
            Unable to load categories right now.
          </div>
        ) : categories.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white/80 p-8 text-center sm:p-10">
            <p className="text-sm text-slate-600">
              Categories added from the admin dashboard will appear here
              automatically.
            </p>
            <Link
              to="/shop"
              className="mt-4 inline-flex min-h-[44px] items-center gap-1 text-sm font-semibold text-solar-700 hover:text-solar-800"
            >
              Visit Shop
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <>
            <div className="mt-6 grid grid-cols-2 gap-3 sm:mt-8 sm:gap-4 lg:grid-cols-4 lg:gap-5">
              {featuredCategories.map((category, index) => (
                <CategoryCard
                  key={category.id}
                  category={category}
                  isVisible={sectionVisible}
                  revealDelay={100 + index * 70}
                />
              ))}
            </div>

            {hasMoreCategories ? (
              <div className="mt-6 flex justify-center sm:mt-8">
                <Link
                  to="/shop/categories"
                  className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-solar-200 bg-white px-5 py-2.5 text-sm font-semibold text-solar-800 shadow-sm transition hover:border-solar-300 hover:bg-solar-50"
                >
                  View All {categories.length} Categories
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            ) : null}
          </>
        )}
      </div>
    </section>
  );
}
