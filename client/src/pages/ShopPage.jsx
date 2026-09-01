import { useMemo } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import {
  AlertCircle,
  Loader2,
  PackageOpen,
  SearchX,
  SlidersHorizontal,
} from 'lucide-react';
import CategoryHero from '@/components/shop/CategoryHero';
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
      className={`flex min-h-[320px] flex-col items-center justify-center rounded-2xl border border-gray-200 bg-white p-8 text-center sm:p-10 ${className}`}
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

  return (
    <div className="min-h-screen bg-gray-50">
      <CategoryHero
        category={activeCategory}
        productCount={hasQuery ? filteredProducts.length : allProducts.length}
      />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-100 bg-gradient-to-r from-solar-50/50 via-white to-emerald-50/30 px-4 py-5 sm:px-6 sm:py-6">
            <ProductSearchInput
              id="shop-product-search"
              value={inputValue}
              onChange={handleChange}
              onSubmit={handleSubmit}
              onClear={clearSearch}
              variant="shop"
              placeholder="Search by product name, category or keyword..."
            />
            {hasQuery && (
              <p className="mt-2.5 text-center text-sm font-medium text-solar-700">
                Searching across all products
              </p>
            )}
          </div>

          <div className="border-b border-gray-100 px-4 py-4 sm:px-6">
            <div className="mb-2.5 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-charcoal-light">
              <SlidersHorizontal className="h-3.5 w-3.5 text-solar-600" />
              Browse by category
            </div>
            <div className="flex gap-2 overflow-x-auto pb-0.5 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
              <Link
                to={buildShopLink('/shop', searchParams)}
                className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200 ${
                  !categorySlug
                    ? 'bg-solar-600 text-white shadow-sm shadow-solar-600/25'
                    : 'border border-gray-200 bg-white text-charcoal-light hover:border-solar-200 hover:bg-solar-50 hover:text-solar-800'
                }`}
              >
                All Products
              </Link>
              {categories.map((category) => (
                <Link
                  key={category.id}
                  to={buildShopLink(`/shop/${category.slug}`, searchParams)}
                  className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200 ${
                    categorySlug === category.slug
                      ? 'bg-solar-600 text-white shadow-sm shadow-solar-600/25'
                      : 'border border-gray-200 bg-white text-charcoal-light hover:border-solar-200 hover:bg-solar-50 hover:text-solar-800'
                  }`}
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="px-4 py-6 sm:px-6 sm:py-8">
            {isLoading ? (
              <ShopStateCard>
                <Loader2 className="h-9 w-9 animate-spin text-solar-600" />
                <p className="mt-4 text-sm font-medium text-charcoal-light">
                  Loading products...
                </p>
              </ShopStateCard>
            ) : isError ? (
              <ShopStateCard className="border-red-100 bg-red-50/40">
                <AlertCircle className="h-11 w-11 text-red-400" />
                <h2 className="mt-4 text-lg font-bold text-charcoal sm:text-xl">
                  Unable to load products
                </h2>
                <p className="mt-2 max-w-md text-sm text-red-700">
                  Something went wrong while fetching the catalogue. Please try
                  again in a moment.
                </p>
              </ShopStateCard>
            ) : filteredProducts.length === 0 ? (
              <ShopStateCard className="border-dashed border-gray-300 bg-gray-50/50">
                {hasQuery ? (
                  <>
                    <SearchX className="h-11 w-11 text-gray-300" />
                    <h2 className="mt-4 text-lg font-bold text-charcoal sm:text-xl">
                      No products found
                    </h2>
                    <p className="mt-2 max-w-md text-sm text-charcoal-light">
                      No products match &ldquo;{normalizedSearch}&rdquo;. Try a
                      different keyword or clear your search.
                    </p>
                    <button
                      type="button"
                      onClick={clearSearch}
                      className="mt-5 rounded-full bg-solar-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-solar-700"
                    >
                      Clear search
                    </button>
                  </>
                ) : (
                  <>
                    <PackageOpen className="h-11 w-11 text-gray-300" />
                    <h2 className="mt-4 text-lg font-bold text-charcoal sm:text-xl">
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
                        className="mt-5 rounded-full bg-solar-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-solar-700"
                      >
                        View all products
                      </Link>
                    )}
                  </>
                )}
              </ShopStateCard>
            ) : (
              <>
                <div className="mb-5 flex flex-col gap-1.5 sm:mb-6 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-solar-600">
                      Shop catalogue
                    </p>
                    <h2 className="mt-0.5 text-xl font-bold text-charcoal sm:text-2xl">
                      {hasQuery
                        ? 'Search Results'
                        : activeCategory
                          ? activeCategory.name
                          : 'All Products'}
                    </h2>
                  </div>
                  <p className="text-sm text-charcoal-light">
                    {filteredProducts.length} product
                    {filteredProducts.length === 1 ? '' : 's'}
                    {hasQuery ? ` for "${normalizedSearch}"` : ''}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
                  {filteredProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      variant="shop"
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
