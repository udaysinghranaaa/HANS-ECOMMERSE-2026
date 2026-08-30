import { BadgeCheck, Home } from 'lucide-react';
import SectionHeader from '@/components/home/SectionHeader';
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
    <section ref={sectionRef} className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className={`reveal-up ${isVisible ? 'is-visible' : ''}`}>
          <SectionHeader
            eyebrow="Solar Installed & Real Customers"
            title="Trusted Installations Across Homes"
            subtitle="Real subsidy installations delivered with quality products and professional support."
            icon={BadgeCheck}
            align="center"
            className="mx-auto"
          />
        </div>

        <div
          className={`reveal-up mt-12 overflow-hidden rounded-3xl border border-solar-100/80 bg-gradient-to-br from-solar-50/80 via-white to-emerald-50/40 p-6 shadow-[0_8px_30px_rgba(15,23,42,0.05)] sm:mt-14 sm:p-8 lg:p-10 ${isVisible ? 'is-visible' : ''}`}
          style={{ animationDelay: '80ms' }}
        >
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-solar-200/80 bg-white px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-solar-700 shadow-sm">
                <Home className="h-3.5 w-3.5" />
                Verified Home Installations
              </div>
              <p className="mt-5 text-3xl font-bold tracking-tight text-slate-800 sm:text-4xl">
                800+ Subsidy Sets Installed in Homes
              </p>
              <p className="mt-3 text-base leading-relaxed text-slate-600 sm:text-lg">
                800+ families are getting the benefits of eligible government
                solar subsidies.
              </p>
            </div>

            <div className="flex shrink-0 gap-8 border-t border-solar-100 pt-6 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
              {[
                { value: '800+', label: 'Installations' },
                { value: 'PM', label: 'Subsidy Ready' },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="text-2xl font-bold tabular-nums text-solar-700 sm:text-3xl">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-xs font-medium uppercase tracking-wider text-slate-500">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div
          className={`reveal-up mt-8 grid grid-cols-2 gap-3 sm:mt-10 sm:grid-cols-4 sm:gap-4 ${isVisible ? 'is-visible' : ''}`}
          style={{ animationDelay: '140ms' }}
        >
          {galleryImages.map((image, index) => (
            <figure
              key={image.src}
              className={`group overflow-hidden rounded-2xl border border-slate-200/80 bg-slate-100 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(15,23,42,0.1)] ${galleryLayout[index]}`}
            >
              <div className="relative h-full w-full overflow-hidden">
                <img
                  src={image.src}
                  alt={image.alt}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading={index === 0 ? 'eager' : 'lazy'}
                  decoding="async"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-900/20 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              </div>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
