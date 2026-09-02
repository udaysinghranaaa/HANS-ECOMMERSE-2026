import { useState } from 'react';
import { ArrowRight, BadgeCheck, ExternalLink, Youtube } from 'lucide-react';
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
      className="relative overflow-x-hidden border-b border-slate-100 bg-gradient-to-b from-slate-50/60 via-white to-white py-6 sm:py-8 lg:border-b-slate-200/80 lg:bg-gradient-to-br lg:from-slate-50 lg:via-white lg:to-solar-50/30 lg:py-10"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-1/4 h-48 w-48 rounded-full bg-solar-100/30 blur-3xl lg:h-64 lg:w-64 lg:bg-solar-100/35" />
        <div className="absolute -right-16 bottom-0 h-40 w-40 rounded-full bg-emerald-100/20 blur-3xl lg:h-56 lg:w-56 lg:bg-emerald-100/25" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-5 lg:grid-cols-[1.08fr_0.92fr] lg:gap-8 xl:gap-10">
          <div
            className={`reveal-up mx-auto w-full max-w-xl lg:mx-0 lg:max-w-none ${isVisible ? 'is-visible' : ''}`}
          >
            <img
              src="/new.jpg"
              alt="Happy family with rooftop solar installation by HANS Solar Energy"
              className={`subsidy-hero-image aspect-[4/3] w-full rounded-2xl object-cover shadow-[0_20px_48px_rgba(15,23,42,0.14)] transition-transform duration-500 hover:scale-[1.01] sm:rounded-3xl lg:aspect-[16/10] lg:shadow-[0_24px_56px_rgba(15,23,42,0.16)] ${isVisible ? 'is-visible' : 'opacity-0'}`}
              loading="lazy"
              decoding="async"
            />
          </div>

          <div
            className={`reveal-up flex max-w-xl flex-col justify-center lg:max-w-none ${isVisible ? 'is-visible' : ''}`}
            style={{ animationDelay: '90ms' }}
          >
            <div className="flex items-center gap-4 sm:gap-5">
              {!logoError ? (
                <div className="flex shrink-0 items-center justify-center rounded-2xl border border-solar-100 bg-white p-2 shadow-sm sm:p-2.5">
                  <img
                    src={logoSrc}
                    alt="HANS Solar Energy logo"
                    className="h-14 w-auto max-w-[148px] object-contain sm:h-16 sm:max-w-[168px] lg:h-[4.75rem] lg:max-w-[188px]"
                    onError={() => setLogoError(true)}
                  />
                </div>
              ) : null}
              <div className="min-w-0">
                <h2 className="text-xl font-bold uppercase tracking-[0.06em] text-charcoal sm:text-2xl lg:text-[1.85rem] lg:leading-tight">
                  {pmSuryaGharHomeCompany.brandName}
                </h2>
                <p className="mt-1.5 inline-flex items-center gap-2 text-sm font-bold text-solar-800 sm:text-[15px]">
                  <BadgeCheck className="h-4 w-4 shrink-0 text-solar-600 sm:h-[1.125rem] sm:w-[1.125rem]" aria-hidden="true" />
                  {pmSuryaGharHomeCompany.vendorLabel}
                </p>
              </div>
            </div>

            <h3
              id="pm-surya-ghar-home-heading"
              className="mt-3 text-xl font-bold leading-snug tracking-tight text-charcoal sm:text-2xl lg:mt-3.5 lg:text-[1.75rem]"
            >
              PM Surya Ghar — Government Solar Subsidy
            </h3>

            <p className="mt-2.5 text-sm leading-relaxed text-charcoal-light sm:text-[15px] sm:leading-7 lg:max-w-xl lg:text-base">
              Install rooftop solar with an authorized partner and claim eligible
              central government subsidy on your home system — with end-to-end
              guidance from system selection to installation support.
            </p>

            <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-sm font-semibold text-solar-800 sm:gap-x-5 sm:text-[15px]">
              {pmSuryaGharHomeSubsidyCards.map((card) => (
                <li key={card.capacity} className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-solar-500" aria-hidden="true" />
                  <span>
                    {card.capacity}: {card.amountPrefix}
                    {formatIndianCurrency(card.amountValue)}
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-4 flex flex-col gap-2.5 sm:flex-row sm:flex-wrap">
              <Button
                to="/subsidy/pm-surya-ghar"
                size="lg"
                className="min-h-[44px] w-full rounded-xl sm:w-auto sm:min-w-[210px]"
              >
                Check Subsidy Eligibility
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Button>
              <Button
                to="/shop"
                variant="secondary"
                size="lg"
                className="min-h-[44px] w-full rounded-xl border-solar-200 sm:w-auto sm:min-w-[170px]"
              >
                View Solar Sets
              </Button>
            </div>

            <a
              href={pmSuryaGharHomeCompany.youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-4 block overflow-hidden rounded-2xl border border-slate-200/90 bg-gradient-to-br from-white via-white to-red-50/50 p-4 shadow-sm transition-all duration-300 hover:border-red-200 hover:shadow-md hover:shadow-red-100/50 sm:p-5"
            >
              <div className="flex items-start gap-3.5 sm:gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-600 text-white shadow-lg shadow-red-600/25 transition-transform duration-300 group-hover:scale-105 sm:h-14 sm:w-14">
                  <Youtube className="h-6 w-6 sm:h-7 sm:w-7" aria-hidden="true" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-red-600 sm:text-xs">
                    HANS Solar on YouTube
                  </p>
                  <p className="mt-1 text-sm font-bold text-charcoal sm:text-base">
                    {pmSuryaGharHomeCompany.youtubeCtaLabel}
                  </p>
                  <p className="mt-1.5 text-xs leading-relaxed text-charcoal-light sm:text-sm">
                    {pmSuryaGharHomeCompany.youtubePromoMessage}
                  </p>
                  <span className="mt-3 inline-flex min-h-[36px] items-center gap-2 rounded-lg bg-red-600 px-3.5 py-1.5 text-xs font-bold text-white transition group-hover:bg-red-700 sm:text-sm">
                    Visit Our YouTube Channel
                    <ExternalLink className="h-3.5 w-3.5 opacity-90" aria-hidden="true" />
                  </span>
                </div>
              </div>
            </a>

            <p className="mt-3 max-w-lg text-[11px] leading-relaxed text-charcoal-light sm:text-xs">
              {pmSuryaGharHomeDisclaimer}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
