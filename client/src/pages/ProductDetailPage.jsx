import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  CheckCircle2,
  Loader2,
  PlayCircle,
  Shield,
} from 'lucide-react';
import Button from '@/components/ui/Button';
import ProductCard from '@/components/shop/ProductCard';
import { ProductDetailBadges } from '@/components/shop/ProductBadges';
import { useGetPublicProductByIdQuery } from '@/services/productsApi';
import { formatCurrency } from '@/utils/format';

export default function ProductDetailPage() {
  const { id } = useParams();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const { data, isLoading, isError } = useGetPublicProductByIdQuery(id);

  const product = data?.data?.product;
  const relatedProducts = data?.data?.relatedProducts ?? [];
  const images = product?.images ?? [];
  const specifications = product?.specifications
    ? Object.entries(product.specifications)
    : [];

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

  const activeImage = images[activeImageIndex] || images[0];

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
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
          <div>
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

            {product.videoUrl && (
              <div className="mt-6 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                <div className="flex items-center gap-2 border-b border-gray-100 px-4 py-3">
                  <PlayCircle className="h-5 w-5 text-solar-600" />
                  <h2 className="text-sm font-semibold text-charcoal">
                    Product Video
                  </h2>
                </div>
                <video
                  controls
                  className="aspect-video w-full bg-black"
                  poster={activeImage}
                >
                  <source src={product.videoUrl} />
                  Your browser does not support the video tag.
                </video>
              </div>
            )}
          </div>

          <div>
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
              <span className="text-lg text-gray-400 line-through">
                {formatCurrency(product.originalPrice ?? product.price)}
              </span>
              <span className="text-3xl font-bold text-solar-700">
                {formatCurrency(product.discountedPrice)}
              </span>
            </div>

            <p className="mt-6 text-base leading-relaxed text-charcoal-light">
              {product.description}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button to="/contact" size="lg">
                Enquire Now
              </Button>
              <Button to="/quote" variant="secondary" size="lg">
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

        {relatedProducts.length > 0 && (
          <section className="mt-16 border-t border-gray-200 pt-12">
            <div className="mb-8 flex items-end justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-charcoal">
                  Related Products
                </h2>
                <p className="mt-2 text-sm text-charcoal-light">
                  More products from {product.category?.name}
                </p>
              </div>
              {product.category?.slug && (
                <Link
                  to={`/shop/${product.category.slug}`}
                  className="hidden text-sm font-semibold text-solar-700 hover:text-solar-800 sm:inline"
                >
                  View all
                </Link>
              )}
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
