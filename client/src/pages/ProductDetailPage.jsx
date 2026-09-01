import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  CheckCircle2,
  Loader2,
  Shield,
} from 'lucide-react';
import Button from '@/components/ui/Button';
import RelatedProductsSection from '@/components/shop/RelatedProductsSection';
import { ProductDetailBadges } from '@/components/shop/ProductBadges';
import { ProductVideosSection } from '@/components/shop/ProductVideo';
import { useEnquiryModal } from '@/context/EnquiryModalContext';
import {
  useGetPublicProductByIdQuery,
  useGetPublicProductsQuery,
} from '@/services/productsApi';
import { formatCurrency, getAmountSaved, getEffectiveProductPricing } from '@/utils/format';
import { pickRelatedProducts } from '@/utils/relatedProducts';

function ProductDetailMediaGallery({ product, images }) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const activeImage = images[activeImageIndex] || images[0];

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="aspect-square bg-gray-100">
        {activeImage ? (
          <img
            src={activeImage}
            alt={product.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-gray-400">
            No image available
          </div>
        )}
      </div>

      {images.length > 1 && (
        <div className="grid grid-cols-5 gap-2 border-t border-gray-100 p-3">
          {images.map((image, index) => (
            <button
              key={image}
              type="button"
              onClick={() => setActiveImageIndex(index)}
              className={`aspect-square overflow-hidden rounded-lg border-2 transition ${
                activeImageIndex === index
                  ? 'border-solar-600 ring-2 ring-solar-100'
                  : 'border-transparent hover:border-gray-200'
              }`}
            >
              <img
                src={image}
                alt={`${product.name} view ${index + 1}`}
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ProductDetailPage() {
  const { id } = useParams();
  const { openEnquiryModal } = useEnquiryModal();
  const { data, isLoading, isError } = useGetPublicProductByIdQuery(id);
  const { data: catalogData } = useGetPublicProductsQuery();

  const product = data?.data?.product;

  const recommendations = useMemo(() => {
    if (!product) {
      return [];
    }

    const relatedFromApi = data?.data?.relatedProducts ?? [];
    const catalog = catalogData?.data?.products ?? [];

    if (relatedFromApi.length > 0) {
      return relatedFromApi.filter((item) => item.id !== product.id);
    }

    return pickRelatedProducts(catalog, product);
  }, [data, catalogData, product]);
  const images = product?.images ?? [];
  const specifications = product?.specifications
    ? Object.entries(product.specifications)
    : [];
  const videoPoster = images[0] || '';

  if (isLoading) {
    return (
      <div className="flex min-h-[480px] items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-solar-600" />
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-charcoal">Product not found</h1>
        <p className="mt-3 text-charcoal-light">
          This product may have been removed or is no longer available.
        </p>
        <Button to="/shop" variant="secondary" className="mt-6">
          Back to Shop
        </Button>
      </div>
    );
  }

  const pricing = getEffectiveProductPricing(product);
  const amountSaved = getAmountSaved(pricing);

  return (
    <div className="bg-gray-50">
      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <Link
            to={product.category?.slug ? `/shop/${product.category.slug}` : '/shop'}
            className="inline-flex items-center gap-2 text-sm font-medium text-solar-700 transition hover:text-solar-800"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to {product.category?.name || 'Shop'}
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-start lg:gap-14">
          <div className="space-y-6 lg:sticky lg:top-24 lg:z-10 lg:self-start">
            <ProductDetailMediaGallery key={product.id} product={product} images={images} />
            <ProductVideosSection product={product} poster={videoPoster} />
          </div>

          <div className="min-w-0">
            <p className="text-sm font-semibold uppercase tracking-wide text-solar-600">
              {product.category?.name}
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-charcoal sm:text-4xl">
              {product.name}
            </h1>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <ProductDetailBadges product={product} />
              {product.stock > 0 ? (
                <span className="inline-flex items-center gap-1.5 text-sm font-medium text-emerald-600">
                  <CheckCircle2 className="h-4 w-4" />
                  In Stock ({product.stock} units)
                </span>
              ) : (
                <span className="text-sm font-medium text-amber-600">
                  Made to order
                </span>
              )}
            </div>

            <div className="mt-6 flex flex-wrap items-end gap-3">
              <span className="text-3xl font-bold text-solar-700">
                {formatCurrency(pricing.salePrice)}
              </span>
              {pricing.discountPercent > 0 && (
                <>
                  <span className="text-lg text-gray-400 line-through">
                    {formatCurrency(pricing.originalPrice)}
                  </span>
                  <span className="rounded-full bg-amber-50 px-2.5 py-1 text-sm font-semibold text-amber-700">
                    {pricing.discountPercent}% OFF
                  </span>
                  {amountSaved > 0 && (
                    <span className="text-sm font-medium text-emerald-600">
                      Save {formatCurrency(amountSaved)}
                    </span>
                  )}
                </>
              )}
            </div>

            <p className="mt-6 text-base leading-relaxed text-charcoal-light">
              {product.description}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button
                size="lg"
                onClick={() =>
                  openEnquiryModal({
                    enquiryType: 'product',
                    productName: product.name,
                  })
                }
              >
                Enquire Now
              </Button>
              <Button
                variant="secondary"
                size="lg"
                onClick={() =>
                  openEnquiryModal({
                    enquiryType: 'quote',
                    productName: product.name,
                  })
                }
              >
                Get a Quote
              </Button>
            </div>

            {specifications.length > 0 && (
              <section className="mt-10 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-charcoal">
                  Specifications
                </h2>
                <dl className="mt-4 divide-y divide-gray-100">
                  {specifications.map(([key, value]) => (
                    <div
                      key={key}
                      className="flex flex-col gap-1 py-3 sm:flex-row sm:justify-between"
                    >
                      <dt className="text-sm font-medium text-charcoal">{key}</dt>
                      <dd className="text-sm text-charcoal-light sm:text-right">
                        {String(value)}
                      </dd>
                    </div>
                  ))}
                </dl>
              </section>
            )}

            {product.warranty && (
              <section className="mt-6 rounded-2xl border border-solar-100 bg-solar-50/60 p-6">
                <div className="flex items-start gap-3">
                  <Shield className="mt-0.5 h-5 w-5 shrink-0 text-solar-700" />
                  <div>
                    <h2 className="text-lg font-semibold text-charcoal">
                      Warranty
                    </h2>
                    <p className="mt-2 text-sm leading-relaxed text-charcoal-light">
                      {product.warranty}
                    </p>
                  </div>
                </div>
              </section>
            )}
          </div>
        </div>
      </div>

      <RelatedProductsSection
        products={recommendations}
        categoryName={product.category?.name}
        categorySlug={product.category?.slug}
      />
    </div>
  );
}
