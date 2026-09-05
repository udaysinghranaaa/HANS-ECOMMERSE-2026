import { useLayoutEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  CheckCircle2,
  Loader2,
  Shield,
} from 'lucide-react';
import Button from '@/components/ui/Button';
import GstPriceBreakdown from '@/components/shop/GstPriceBreakdown';
import ProductDescription from '@/components/shop/ProductDescription';
import RelatedProductsSection from '@/components/shop/RelatedProductsSection';
import { ProductDetailBadges } from '@/components/shop/ProductBadges';
import { ProductVideosSection } from '@/components/shop/ProductVideo';
import { useEnquiryModal } from '@/context/EnquiryModalContext';
import {
  useGetPublicProductByIdQuery,
  useGetPublicProductsQuery,
} from '@/services/productsApi';
import { formatCurrency, getAmountSaved, getEffectiveProductPricing, getGstPricing } from '@/utils/format';
import { pickRelatedProducts } from '@/utils/relatedProducts';

function ProductDetailMediaGallery({ product, images }) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const activeImage = images[activeImageIndex] || images[0];

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm sm:rounded-2xl lg:shadow-md">
      <div className="aspect-square max-h-[min(72vw,420px)] bg-gray-100 sm:max-h-none lg:max-h-[min(56vh,520px)]">
        {activeImage ? (
          <img
            src={activeImage}
            alt={product.name}
            className="h-full w-full object-contain sm:object-cover lg:object-contain"
          />
        ) : (
          <div className="flex h-full min-h-[220px] items-center justify-center text-sm text-gray-400">
            No image available
          </div>
        )}
      </div>

      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-2 border-t border-gray-100 p-2.5 sm:grid-cols-5 sm:p-3 lg:grid-cols-4 xl:grid-cols-5">
          {images.map((image, index) => (
            <button
              key={`${image}-${index}`}
              type="button"
              onClick={() => setActiveImageIndex(index)}
              aria-label={`Show image ${index + 1}`}
              aria-pressed={activeImageIndex === index}
              className={`aspect-square min-h-[44px] overflow-hidden rounded-lg border-2 transition ${
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

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [id]);

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
      <div className="flex min-h-[50vh] items-center justify-center bg-gray-50 px-4">
        <Loader2 className="h-8 w-8 animate-spin text-solar-600" />
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:py-20">
        <h1 className="text-xl font-bold text-charcoal sm:text-2xl">Product not found</h1>
        <p className="mt-3 text-sm text-charcoal-light sm:text-base">
          This product may have been removed or is no longer available.
        </p>
        <Button to="/shop" variant="secondary" className="mt-6 min-h-[44px]">
          Back to Shop
        </Button>
      </div>
    );
  }

  const pricing = getEffectiveProductPricing(product);
  const amountSaved = getAmountSaved(pricing);
  const gstPricing = getGstPricing(
    pricing.salePrice,
    product.gstEnabled,
    product.gstPercentage,
  );

  return (
    <div className="bg-gray-50 pb-8 sm:pb-10">
      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 sm:py-4 lg:px-8">
          <Link
            to={product.category?.slug ? `/shop/${product.category.slug}` : '/shop'}
            className="inline-flex min-h-[44px] max-w-full items-center gap-2 text-sm font-medium text-solar-700 transition hover:text-solar-800"
          >
            <ArrowLeft className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span className="truncate">
              Back to {product.category?.name || 'Shop'}
            </span>
          </Link>
        </div>
      </div>

      <div
        id="product-detail"
        className="mx-auto max-w-7xl px-4 py-5 sm:px-6 sm:py-8 lg:px-8 lg:py-10"
      >
        <div
          data-product-detail-layout
          className="grid gap-6 lg:grid-cols-2 lg:gap-10 xl:gap-14"
        >
          <div className="flex min-w-0 flex-col gap-4 sm:gap-6 lg:h-full">
            <div
              data-product-gallery-sticky
              className="w-full space-y-4 sm:space-y-6 lg:sticky lg:top-24 lg:z-10 lg:self-start"
            >
              <ProductDetailMediaGallery key={product.id} product={product} images={images} />
              <ProductVideosSection product={product} poster={videoPoster} />
            </div>
          </div>

          <div className="min-w-0 lg:pt-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-solar-600 sm:text-sm">
              {product.category?.name}
            </p>
            <h1 className="mt-2 break-words text-2xl font-bold leading-tight tracking-tight text-charcoal sm:text-3xl lg:text-4xl">
              {product.name}
            </h1>

            <div className="mt-4 flex flex-wrap items-center gap-2 sm:mt-5 sm:gap-3">
              <ProductDetailBadges product={product} />
              {product.stock > 0 ? (
                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600 sm:text-sm">
                  <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden="true" />
                  In Stock ({product.stock} units)
                </span>
              ) : (
                <span className="text-xs font-medium text-amber-600 sm:text-sm">
                  Made to order
                </span>
              )}
            </div>

            {gstPricing.gstEnabled ? (
              <div className="mt-5 sm:mt-6">
                {pricing.discountPercent > 0 && (
                  <div className="mb-3 flex flex-wrap items-center gap-2">
                    <span className="text-sm text-gray-400 line-through">
                      {formatCurrency(pricing.originalPrice)}
                    </span>
                    <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
                      {pricing.discountPercent}% OFF
                    </span>
                    {amountSaved > 0 && (
                      <span className="text-xs font-medium text-emerald-600">
                        Save {formatCurrency(amountSaved)}
                      </span>
                    )}
                  </div>
                )}
                <GstPriceBreakdown
                  actualPrice={pricing.salePrice}
                  gstPercentage={gstPricing.gstPercentage}
                  gstAmount={gstPricing.gstAmount}
                  finalPrice={gstPricing.finalPrice}
                />
              </div>
            ) : (
              <div className="mt-5 flex flex-wrap items-end gap-x-2 gap-y-1 sm:mt-6 sm:gap-x-3 sm:gap-y-2">
                <span className="text-2xl font-bold text-solar-700 sm:text-3xl">
                  {formatCurrency(pricing.salePrice)}
                </span>
                {pricing.discountPercent > 0 && (
                  <>
                    <span className="text-base text-gray-400 line-through sm:text-lg">
                      {formatCurrency(pricing.originalPrice)}
                    </span>
                    <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700 sm:text-sm">
                      {pricing.discountPercent}% OFF
                    </span>
                    {amountSaved > 0 && (
                      <span className="w-full text-xs font-medium text-emerald-600 sm:w-auto sm:text-sm">
                        Save {formatCurrency(amountSaved)}
                      </span>
                    )}
                  </>
                )}
              </div>
            )}

            <ProductDescription
              description={product.description}
              className="mt-5 sm:mt-6"
            />

            <div className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:flex-wrap">
              <Button
                size="lg"
                className="min-h-[48px] w-full rounded-xl sm:w-auto sm:min-w-[180px]"
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
                className="min-h-[48px] w-full rounded-xl sm:w-auto sm:min-w-[180px]"
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
              <section className="mt-8 rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:mt-10 sm:rounded-2xl sm:p-6">
                <h2 className="text-base font-semibold text-charcoal sm:text-lg">
                  Specifications
                </h2>
                <dl className="mt-3 divide-y divide-gray-100 sm:mt-4">
                  {specifications.map(([key, value]) => (
                    <div
                      key={key}
                      className="flex flex-col gap-1 py-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4"
                    >
                      <dt className="text-sm font-medium text-charcoal">{key}</dt>
                      <dd className="break-words text-sm text-charcoal-light sm:max-w-[60%] sm:text-right">
                        {String(value)}
                      </dd>
                    </div>
                  ))}
                </dl>
              </section>
            )}

            {product.warranty && (
              <section className="mt-5 rounded-xl border border-solar-100 bg-solar-50/60 p-4 sm:mt-6 sm:rounded-2xl sm:p-6">
                <div className="flex items-start gap-3">
                  <Shield className="mt-0.5 h-5 w-5 shrink-0 text-solar-700" aria-hidden="true" />
                  <div className="min-w-0">
                    <h2 className="text-base font-semibold text-charcoal sm:text-lg">
                      Warranty
                    </h2>
                    <p className="mt-2 break-words text-sm leading-relaxed text-charcoal-light">
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
