import { Building2, MapPin, Navigation } from 'lucide-react';
import Button from '@/components/ui/Button';
import useRevealOnScroll from '@/hooks/useRevealOnScroll';
import { corporateOffice } from '@/constants/homeContent';

export default function CorporateOfficeSection() {
  const { ref: sectionRef, isVisible } = useRevealOnScroll();

  return (
    <section ref={sectionRef} className="bg-gray-50 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div
          className={`reveal-up mx-auto max-w-2xl text-center ${isVisible ? 'is-visible' : ''}`}
        >
          <p className="text-sm font-semibold uppercase tracking-wider text-solar-600">
            Our Office
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-charcoal sm:text-4xl">
            Visit Our Corporate Office
          </h2>
          <p className="mt-4 text-base text-charcoal-light sm:text-lg">
            Meet our team in Bulandshahr for product guidance, subsidy support
            and solar consultations.
          </p>
        </div>

        <div
          className={`reveal-up mt-10 overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm lg:mt-12 ${isVisible ? 'is-visible' : ''}`}
          style={{ animationDelay: '90ms' }}
        >
          <div className="grid lg:grid-cols-2">
            <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-10">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-solar-50 text-solar-700">
                <Building2 className="h-6 w-6" aria-hidden="true" />
              </div>

              <h3 className="mt-5 text-xl font-semibold text-charcoal sm:text-2xl">
                HANS Solar Corporate Office
              </h3>

              <div className="mt-4 flex items-start gap-3">
                <MapPin
                  className="mt-1 h-5 w-5 shrink-0 text-solar-600"
                  aria-hidden="true"
                />
                <p className="text-sm leading-relaxed text-charcoal-light sm:text-base">
                  {corporateOffice.address}
                </p>
              </div>

              <Button
                href={corporateOffice.directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                size="lg"
                className="mt-8 w-full sm:w-auto"
              >
                <Navigation className="h-4 w-4" />
                Get Directions
              </Button>
            </div>

            <div className="relative min-h-[280px] bg-gray-100 sm:min-h-[360px] lg:min-h-[420px]">
              <iframe
                title="HANS Solar corporate office location"
                src={corporateOffice.embedUrl}
                className="absolute inset-0 h-full w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
