import { useState } from 'react';
import { ArrowRight, BadgeCheck } from 'lucide-react';
import Button from '@/components/ui/Button';
import useRevealOnScroll from '@/hooks/useRevealOnScroll';
import {
  pmSuryaGharHomeCompany,
  pmSuryaGharHomeDisclaimer,
  pmSuryaGharHomeSubsidyCards,
} from '@/constants/pmSuryaGharContent';
import { useGetSiteMediaQuery } from '@/services/siteMediaApi';

const formatIndianCurrency = (value) =>
  new Intl.NumberFormat('en-IN').format(value);

export default function PmSuryaGharHomeSection() {
  const { ref: sectionRef, isVisible } = useRevealOnScroll();
  const { data: siteMediaResponse } = useGetSiteMediaQuery();
  const logoSrc = siteMediaResponse?.data?.logo ?? '/logo.jpg';
  const [logoError, setLogoError] = useState(false);

  return (
    <section
      ref={sectionRef}
      aria-labelledby="pm-surya-ghar-home-heading"
      className="relative overflow-x-hidden border-b border-slate-100 bg-gradient-to-b from-white via-slate-50/40 to-white py-10 sm:py-12 lg:py-16"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-1/4 h-56 w-56 rounded-full bg-solar-100/30 blur-3xl" />
        <div className="absolute -right-16 bottom-0 h-48 w-48 rounded-full bg-emerald-100/20 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:gap-14 xl:gap-16">
          <div
            className={`reveal-up mx-auto w-full max-w-xl lg:mx-0 lg:max-w-none ${isVisible ? 'is-visible' : ''}`}
          >
            <img
              src="/new.jpg"
              alt="Happy family with rooftop solar installation by HANS Solar Energy"
              className={`subsidy-hero-image aspect-[4/3] w-full rounded-2xl object-cover shadow-[0_28px_64px_rgba(15,23,42,0.16)] transition-transform duration-500 hover:scale-[1.01] sm:rounded-3xl lg:max-w-[580px] xl:max-w-[620px] ${isVisible ? 'is-visible' : 'opacity-0'}`}
              loading="lazy"
              decoding="async"
            />
          </div>

          <div
            className={`reveal-up max-w-xl lg:max-w-none ${isVisible ? 'is-visible' : ''}`}
            style={{ animationDelay: '90ms' }}
          >
            <div className="flex items-center gap-3 sm:gap-4">
              {!logoError ? (
                <img
                  src={logoSrc}
                  alt=""
                  className="h-10 w-auto max-w-[118px] object-contain sm:h-11 sm:max-w-[132px]"
                  onError={() => setLogoError(true)}
                />
              ) : null}
              <p className="text-2xl font-bold tracking-tight text-charcoal sm:text-[1.75rem] lg:text-3xl">
                {pmSuryaGharHomeCompany.brandName}
              </p>
            </div>

            <p className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-solar-800 sm:text-base">
              <BadgeCheck className="h-5 w-5 shrink-0 text-solar-600" aria-hidden="true" />
              {pmSuryaGharHomeCompany.vendorLabel}
            </p>

            <h2
              id="pm-surya-ghar-home-heading"
              className="mt-5 text-2xl font-bold leading-tight tracking-tight text-charcoal sm:text-3xl"
            >
              PM Surya Ghar — Government Solar Subsidy
            </h2>

            <p className="mt-4 text-base leading-relaxed text-charcoal-light sm:text-[17px] sm:leading-7">
              Install rooftop solar with an authorized partner and claim eligible
              central government subsidy on your home system — with end-to-end
              guidance from system selection to installation support.
            </p>

            <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold text-solar-800 sm:text-[15px]">
              {pmSuryaGharHomeSubsidyCards.map((card) => (
                <li key={card.capacity} className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-solar-500" aria-hidden="true" />
                  <span>
                    {card.capacity}: {card.amountPrefix}
                    {formatIndianCurrency(card.amountValue)}
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Button
                to="/subsidy/pm-surya-ghar"
                size="lg"
                className="min-h-[46px] w-full rounded-xl sm:w-auto sm:min-w-[220px]"
              >
                Check Subsidy Eligibility
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Button>
              <Button
                to="/shop"
                variant="secondary"
                size="lg"
                className="min-h-[46px] w-full rounded-xl border-solar-200 sm:w-auto sm:min-w-[180px]"
              >
                View Solar Sets
              </Button>
            </div>

            <p className="mt-4 max-w-lg text-[11px] leading-relaxed text-charcoal-light sm:text-xs">
              {pmSuryaGharHomeDisclaimer}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
