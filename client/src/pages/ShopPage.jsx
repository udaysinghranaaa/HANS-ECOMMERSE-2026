import { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Loader2, PackageOpen } from 'lucide-react';
import CategoryHero from '@/components/shop/CategoryHero';
import ProductCard from '@/components/shop/ProductCard';
import { useGetPublicCategoriesQuery } from '@/services/categoriesApi';
import { useGetPublicProductsQuery } from '@/services/productsApi';

export default function ShopPage() {
  const { category: categorySlug } = useParams();
  const { data: categoriesData, isLoading: categoriesLoading } =
    useGetPublicCategoriesQuery();
  const {
    data: productsData,
    isLoading: productsLoading,
    isError,
  } = useGetPublicProductsQuery(categorySlug, {
    refetchOnMountOrArgChange: true,
  });

  const categories = categoriesData?.data?.categories ?? [];
  const products = productsData?.data?.products ?? [];

  const activeCategory = useMemo(
    () => categories.find((category) => category.slug === categorySlug),
    [categories, categorySlug],
  );

  const isLoading = categoriesLoading || productsLoading;

  return (
    <div className="bg-gray-50">
      <CategoryHero category={activeCategory} />

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-wrap gap-2">
          <Link
            to="/shop"
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              !categorySlug
                ? 'bg-solar-600 text-white shadow-sm'
                : 'bg-white text-charcoal-light ring-1 ring-gray-200 hover:bg-solar-50 hover:text-solar-700'
            }`}
          >
            All Products
          </Link>
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/shop/${category.slug}`}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                categorySlug === category.slug
                  ? 'bg-solar-600 text-white shadow-sm'
                  : 'bg-white text-charcoal-light ring-1 ring-gray-200 hover:bg-solar-50 hover:text-solar-700'
              }`}
            >
              {category.name}
            </Link>
          ))}
        </div>

        {isLoading ? (
          <div className="flex min-h-[320px] items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-solar-600" />
          </div>
        ) : isError ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center text-red-700">
            Unable to load products. Please try again later.
          </div>
        ) : products.length === 0 ? (
          <div className="flex min-h-[320px] flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center">
            <PackageOpen className="h-12 w-12 text-gray-300" />
            <h2 className="mt-4 text-xl font-semibold text-charcoal">
              No products yet
            </h2>
            <p className="mt-2 max-w-md text-sm text-charcoal-light">
              {categorySlug
                ? 'No products are available in this category right now. Check back soon or browse all products.'
                : 'Products added from the admin dashboard will appear here automatically.'}
            </p>
            {categorySlug && (
              <Link
                to="/shop"
                className="mt-5 text-sm font-semibold text-solar-700 hover:text-solar-800"
              >
                View all products
              </Link>
            )}
          </div>
        ) : (
          <>
            <p className="mb-6 text-sm text-charcoal-light">
              Showing {products.length} product{products.length === 1 ? '' : 's'}
              {activeCategory ? ` in ${activeCategory.name}` : ''}
            </p>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
