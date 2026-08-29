import { BadgeCheck, Home } from 'lucide-react';
import useRevealOnScroll from '@/hooks/useRevealOnScroll';
import { installationGalleryImages } from '@/constants/homeContent';
import { useGetSiteMediaQuery } from '@/services/siteMediaApi';

const galleryLayout = [
  'col-span-2 row-span-2 min-h-[220px] sm:min-h-[280px]',
  'col-span-1 row-span-1 min-h-[140px] sm:min-h-[160px]',
  'col-span-1 row-span-1 min-h-[140px] sm:min-h-[160px]',
  'col-span-1 row-span-1 min-h-[140px] sm:min-h-[160px]',
  'col-span-1 row-span-1 min-h-[140px] sm:min-h-[160px]',
  'col-span-1 row-span-1 min-h-[140px] sm:min-h-[160px]',
  'col-span-1 row-span-1 min-h-[140px] sm:min-h-[160px]',
  'col-span-1 row-span-1 min-h-[140px] sm:min-h-[160px]',
  'col-span-1 row-span-1 min-h-[140px] sm:min-h-[160px]',
  'col-span-1 row-span-1 min-h-[140px] sm:min-h-[160px]',
  'col-span-1 row-span-1 min-h-[140px] sm:min-h-[160px]',
];

export default function InstallationGallerySection() {
  const { ref: sectionRef, isVisible } = useRevealOnScroll();
  const { data: siteMediaResponse } = useGetSiteMediaQuery();
  const galleryImages =
    siteMediaResponse?.data?.gallery ?? installationGalleryImages;

  return (
    <section ref={sectionRef} className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div
          className={`reveal-up mx-auto max-w-3xl text-center ${isVisible ? 'is-visible' : ''}`}
        >
          <p className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-solar-600">
            <BadgeCheck className="h-4 w-4" />
            Solar Installed & Real Customers
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-charcoal sm:text-4xl">
            Trusted Installations Across Homes
          </h2>
          <p className="mt-4 text-base text-charcoal-light sm:text-lg">
            Real subsidy installations delivered with quality products and
            professional support.
          </p>
        </div>

        <div
          className={`reveal-up mt-10 overflow-hidden rounded-3xl border border-solar-100 bg-gradient-to-br from-solar-50 via-white to-solar-50 p-6 shadow-sm sm:mt-12 sm:p-8 ${isVisible ? 'is-visible' : ''}`}
          style={{ animationDelay: '80ms' }}
        >
          <div className="mx-auto max-w-3xl text-center lg:max-w-none lg:text-left">
            <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wider text-solar-700 ring-1 ring-solar-100">
              <Home className="h-3.5 w-3.5" />
              Verified Home Installations
            </div>
            <p className="mt-4 text-3xl font-bold tracking-tight text-charcoal sm:text-4xl">
              800+ Subsidy Sets Installed in Homes
            </p>
            <p className="mt-3 text-base leading-relaxed text-charcoal-light sm:text-lg">
              800+ families are getting the benefits of eligible government
              solar subsidies.
            </p>
          </div>
        </div>

        <div
          className={`reveal-up mt-8 grid grid-cols-2 gap-3 sm:mt-10 sm:grid-cols-4 sm:gap-4 ${isVisible ? 'is-visible' : ''}`}
          style={{ animationDelay: '140ms' }}
        >
          {galleryImages.map((image, index) => (
            <figure
              key={image.src}
              className={`group overflow-hidden rounded-2xl border border-gray-100 bg-gray-50 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg ${galleryLayout[index]}`}
            >
              <img
                src={image.src}
                alt={image.alt}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading={index === 0 ? 'eager' : 'lazy'}
                decoding="async"
              />
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
