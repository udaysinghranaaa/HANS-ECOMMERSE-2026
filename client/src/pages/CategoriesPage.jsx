import { useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  AlertCircle,
  ArrowRight,
  Grid3X3,
  Layers,
  Loader2,
  Package,
} from 'lucide-react';
import CategoryCard from '@/components/shop/CategoryCard';
import SectionHeader from '@/components/home/SectionHeader';
import useRevealOnScroll from '@/hooks/useRevealOnScroll';
import { useGetPublicCategoriesQuery } from '@/services/categoriesApi';

export default function CategoriesPage() {
  const { ref: sectionRef, isVisible } = useRevealOnScroll();
  const [searchParams] = useSearchParams();
  const { data, isLoading, isError } = useGetPublicCategoriesQuery();

  const categories = data?.data?.categories ?? [];
  const searchQuery = searchParams.get('q');
  const shopBase = searchQuery
    ? `/shop?q=${encodeURIComponent(searchQuery)}`
    : '/shop';

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
      <section className="relative overflow-hidden border-b border-slate-100 bg-white">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-20 top-0 h-64 w-64 rounded-full bg-solar-100/40 blur-3xl" />
          <div className="absolute -right-16 bottom-0 h-56 w-56 rounded-full bg-emerald-100/30 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
          <Link
            to={shopBase}
            className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-solar-200 bg-white px-3.5 py-2 text-sm font-medium text-solar-700 shadow-sm transition hover:border-solar-300 hover:bg-solar-50"
          >
            <Package className="h-4 w-4" aria-hidden="true" />
            Browse All Products
          </Link>

          <div className="mt-5 max-w-2xl">
            <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-solar-600">
              <Grid3X3 className="h-3.5 w-3.5" aria-hidden="true" />
              Product Categories
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight text-charcoal sm:text-3xl lg:text-4xl">
                All Solar Categories
              </h1>
              {!isLoading && !isError && categories.length > 0 ? (
                <span className="inline-flex items-center rounded-full bg-solar-600 px-3 py-1 text-xs font-bold text-white shadow-sm">
                  {categories.length} categories
                </span>
              ) : null}
            </div>
            <p className="mt-3 text-sm leading-relaxed text-charcoal-light sm:text-base">
              Explore every product category — panels, inverters, batteries,
              accessories and complete solar solutions for every need.
            </p>
          </div>
        </div>
      </section>

      <section
        ref={sectionRef}
        className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12"
      >
        {isLoading ? (
          <div className="flex min-h-[280px] flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white">
            <Loader2 className="h-8 w-8 animate-spin text-solar-600" />
            <p className="mt-3 text-sm text-charcoal-light">Loading categories...</p>
          </div>
        ) : isError ? (
          <div className="flex min-h-[280px] flex-col items-center justify-center rounded-2xl border border-red-100 bg-red-50/60 p-8 text-center">
            <AlertCircle className="h-10 w-10 text-red-400" />
            <p className="mt-3 text-sm font-medium text-red-700">
              Unable to load categories right now.
            </p>
          </div>
        ) : categories.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
            <Layers className="mx-auto h-10 w-10 text-slate-300" />
            <p className="mt-3 text-sm text-charcoal-light">
              Categories will appear here once added from the admin dashboard.
            </p>
            <Link
              to={shopBase}
              className="mt-5 inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-solar-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-solar-700"
            >
              Visit Shop
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <>
            <SectionHeader
              eyebrow="Browse"
              title="Choose a Category"
              subtitle={`All ${categories.length} categories are listed below. Tap any category to view its products.`}
              className="max-w-xl"
            />

            <div className="mt-6 grid grid-cols-2 gap-3 sm:mt-8 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 lg:gap-5">
              {categories.map((category, index) => (
                <CategoryCard
                  key={category.id}
                  category={category}
                  isVisible={isVisible}
                  revealDelay={80 + index * 60}
                />
              ))}
            </div>
          </>
        )}
      </section>
    </div>
  );
}
