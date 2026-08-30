import { Building2, MapPin, Navigation } from 'lucide-react';
import Button from '@/components/ui/Button';
import SectionHeader from '@/components/home/SectionHeader';
import useRevealOnScroll from '@/hooks/useRevealOnScroll';
import { corporateOffice } from '@/constants/homeContent';

export default function CorporateOfficeSection() {
  const { ref: sectionRef, isVisible } = useRevealOnScroll();

  return (
    <section ref={sectionRef} className="border-t border-slate-100 bg-slate-50/70 py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className={`reveal-up ${isVisible ? 'is-visible' : ''}`}>
          <SectionHeader
            eyebrow="Our Office"
            title="Visit Our Corporate Office"
            subtitle="Meet our team in Bulandshahr for product guidance, subsidy support and solar consultations."
            align="center"
            className="mx-auto"
          />
        </div>

        <div
          className={`reveal-up mt-12 overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-[0_8px_40px_rgba(15,23,42,0.06)] lg:mt-14 ${isVisible ? 'is-visible' : ''}`}
          style={{ animationDelay: '90ms' }}
        >
          <div className="grid lg:grid-cols-2">
            <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-10 xl:p-12">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-solar-50 text-solar-700 ring-1 ring-solar-100">
                <Building2 className="h-6 w-6" aria-hidden="true" />
              </div>

              <h3 className="mt-6 text-xl font-semibold text-slate-800 sm:text-2xl">
                HANS Solar Corporate Office
              </h3>

              <div className="mt-5 flex items-start gap-3 rounded-2xl border border-slate-100 bg-slate-50/80 p-4">
                <MapPin
                  className="mt-0.5 h-5 w-5 shrink-0 text-solar-600"
                  aria-hidden="true"
                />
                <p className="text-sm leading-relaxed text-slate-600 sm:text-base">
                  {corporateOffice.address}
                </p>
              </div>

              <Button
                href={corporateOffice.directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                size="lg"
                className="mt-8 w-full rounded-xl sm:w-auto"
              >
                <Navigation className="h-4 w-4" />
                Get Directions
              </Button>
            </div>

            <div className="relative min-h-[280px] border-t border-slate-100 bg-slate-100 sm:min-h-[360px] lg:min-h-[420px] lg:border-l lg:border-t-0">
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
