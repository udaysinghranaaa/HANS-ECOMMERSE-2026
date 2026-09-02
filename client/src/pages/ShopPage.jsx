import { useMemo } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import {
  AlertCircle,
  Loader2,
  PackageOpen,
  SearchX,
} from 'lucide-react';
import CategoryHero from '@/components/shop/CategoryHero';
import CategoryPicker from '@/components/shop/CategoryPicker';
import ProductCard from '@/components/shop/ProductCard';
import ProductSearchInput from '@/components/shop/ProductSearchInput';
import useProductSearch from '@/hooks/useProductSearch';
import { useGetPublicCategoriesQuery } from '@/services/categoriesApi';
import { useGetPublicProductsQuery } from '@/services/productsApi';
import { filterProductsBySearch, normalizeSearchQuery } from '@/utils/productSearch';

const buildShopLink = (path, searchParams) => {
  const query = searchParams.get('q');

  if (!query) {
    return path;
  }

  return `${path}?q=${encodeURIComponent(query)}`;
};

function ShopStateCard({ children, className = '' }) {
  return (
    <div
      className={`flex min-h-[240px] flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 py-10 text-center sm:min-h-[280px] sm:px-8 ${className}`}
    >
      {children}
    </div>
  );
}

export default function ShopPage() {
  const { category: categorySlug } = useParams();
  const [searchParams] = useSearchParams();
  const {
    query: searchQuery,
    inputValue,
    handleChange,
    handleSubmit,
    clearSearch,
    hasQuery,
  } = useProductSearch();

  const { data: categoriesData, isLoading: categoriesLoading } =
    useGetPublicCategoriesQuery();
  const {
    data: productsData,
    isLoading: productsLoading,
    isError,
  } = useGetPublicProductsQuery(hasQuery ? undefined : categorySlug);

  const activeCategory = useMemo(
    () =>
      categoriesData?.data?.categories?.find(
        (category) => category.slug === categorySlug,
      ),
    [categoriesData, categorySlug],
  );

  const allProducts = productsData?.data?.products ?? [];

  const filteredProducts = useMemo(
    () => filterProductsBySearch(allProducts, searchQuery),
    [allProducts, searchQuery],
  );

  const categories = categoriesData?.data?.categories ?? [];

  const isLoading = categoriesLoading || productsLoading;
  const normalizedSearch = normalizeSearchQuery(searchQuery);

  const pageTitle = hasQuery
    ? 'Search Results'
    : activeCategory
      ? activeCategory.name
      : 'All Products';

  return (
    <div className="min-h-screen bg-slate-50">
      <CategoryHero
        category={activeCategory}
        productCount={hasQuery ? filteredProducts.length : allProducts.length}
      />

      <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 sm:py-7 lg:px-8">
        <div className="rounded-2xl border border-slate-200/90 bg-white shadow-sm">
          <div className="overflow-hidden rounded-t-2xl border-b border-slate-100 bg-gradient-to-r from-solar-50/60 via-white to-emerald-50/30 px-3.5 py-3.5 sm:px-5 sm:py-4">
            <ProductSearchInput
              id="shop-product-search"
              value={inputValue}
              onChange={handleChange}
              onSubmit={handleSubmit}
              onClear={clearSearch}
              variant="shop"
              placeholder="Search products..."
            />
            {hasQuery && (
              <p className="mt-2 text-center text-xs font-medium text-solar-700 sm:text-sm">
                Searching across all products
              </p>
            )}
          </div>

          <div className="relative z-20 px-3.5 py-3 sm:px-5 sm:py-3.5">
            <CategoryPicker
              categories={categories}
              activeCategorySlug={categorySlug}
            />
          </div>
        </div>

        <div className="mt-4 sm:mt-5">
          <div className="mb-3 flex flex-col gap-1 sm:mb-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-solar-600 sm:text-xs">
                {activeCategory ? 'Category' : 'Shop'}
              </p>
              <h2 className="text-lg font-bold text-charcoal sm:text-xl lg:text-2xl">
                {pageTitle}
              </h2>
            </div>
            {!isLoading && !isError && filteredProducts.length > 0 && (
              <p className="text-xs text-charcoal-light sm:text-sm">
                {filteredProducts.length} product
                {filteredProducts.length === 1 ? '' : 's'}
                {hasQuery ? ` for "${normalizedSearch}"` : ''}
              </p>
            )}
          </div>

          {isLoading ? (
            <ShopStateCard>
              <Loader2 className="h-8 w-8 animate-spin text-solar-600" />
              <p className="mt-3 text-sm font-medium text-charcoal-light">
                Loading products...
              </p>
            </ShopStateCard>
          ) : isError ? (
            <ShopStateCard className="border-red-100 bg-red-50/40">
              <AlertCircle className="h-10 w-10 text-red-400" />
              <h2 className="mt-3 text-base font-bold text-charcoal sm:text-lg">
                Unable to load products
              </h2>
              <p className="mt-2 max-w-md text-sm text-red-700">
                Something went wrong while fetching the catalogue. Please try
                again in a moment.
              </p>
            </ShopStateCard>
          ) : filteredProducts.length === 0 ? (
            <ShopStateCard className="border-dashed border-slate-300 bg-white">
              {hasQuery ? (
                <>
                  <SearchX className="h-10 w-10 text-slate-300" />
                  <h2 className="mt-3 text-base font-bold text-charcoal sm:text-lg">
                    No products found
                  </h2>
                  <p className="mt-2 max-w-md text-sm text-charcoal-light">
                    No products match &ldquo;{normalizedSearch}&rdquo;. Try a
                    different keyword or clear your search.
                  </p>
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="mt-4 min-h-[44px] rounded-xl bg-solar-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-solar-700"
                  >
                    Clear search
                  </button>
                </>
              ) : (
                <>
                  <PackageOpen className="h-10 w-10 text-slate-300" />
                  <h2 className="mt-3 text-base font-bold text-charcoal sm:text-lg">
                    No products yet
                  </h2>
                  <p className="mt-2 max-w-md text-sm text-charcoal-light">
                    {categorySlug
                      ? 'No products are available in this category right now. Browse all products or check back soon.'
                      : 'Products added from the admin dashboard will appear here automatically.'}
                  </p>
                  {categorySlug && (
                    <Link
                      to={buildShopLink('/shop', searchParams)}
                      className="mt-4 inline-flex min-h-[44px] items-center rounded-xl bg-solar-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-solar-700"
                    >
                      View all products
                    </Link>
                  )}
                </>
              )}
            </ShopStateCard>
          ) : (
            <div className="grid grid-cols-2 gap-2.5 sm:gap-4 lg:grid-cols-3 lg:gap-5 xl:grid-cols-4">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  variant="shop"
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
