import { ArrowRight, BadgeCheck, Shield, Sun, Zap } from 'lucide-react';
import Button from '@/components/ui/Button';
import useCountUp from '@/hooks/useCountUp';
import useRevealOnScroll from '@/hooks/useRevealOnScroll';
import {
  pmSuryaGharHomeCompany,
  pmSuryaGharHomeDisclaimer,
  pmSuryaGharHomeSubsidyCards,
  pmSuryaGharStats,
} from '@/constants/pmSuryaGharContent';

const formatIndianCurrency = (value) =>
  new Intl.NumberFormat('en-IN').format(value);

function SubsidyAmount({ value, prefix, isVisible }) {
  const count = useCountUp(value, isVisible, 1200);

  return (
    <span className="tabular-nums tracking-tight">
      {prefix}
      {formatIndianCurrency(count)}
      <span className="align-super text-[0.45em] font-bold text-solar-600/75">*</span>
    </span>
  );
}

function SubsidyCard({ card, isVisible, index }) {
  const isHighlighted = card.highlighted;
  const isFullWidthMobile = index === 2;

  return (
    <article
      style={{ animationDelay: `${70 + index * 60}ms` }}
      className={`reveal-up group relative overflow-hidden rounded-2xl border bg-white p-4 transition-all duration-300 active:scale-[0.99] sm:p-5 lg:p-6 ${
        isVisible ? 'is-visible' : ''
      } ${
        isFullWidthMobile ? 'col-span-2 sm:col-span-1' : ''
      } ${
        isHighlighted
          ? 'border-solar-400/80 bg-gradient-to-br from-solar-50 via-white to-emerald-50/60 shadow-[0_12px_36px_rgba(22,163,74,0.14)] ring-2 ring-solar-500/35 hover:-translate-y-1 hover:shadow-[0_18px_44px_rgba(22,163,74,0.18)]'
          : 'border-solar-100/90 shadow-[0_6px_24px_rgba(15,23,42,0.05)] hover:-translate-y-0.5 hover:border-solar-200 hover:shadow-[0_12px_32px_rgba(22,163,74,0.1)]'
      }`}
    >
      <div
        className={`absolute inset-x-0 top-0 h-1 ${
          isHighlighted
            ? 'bg-gradient-to-r from-solar-500 via-emerald-400 to-solar-600'
            : 'bg-gradient-to-r from-solar-400/70 to-solar-600/70 opacity-80 group-hover:opacity-100'
        }`}
      />

      {card.badge && (
        <span className="absolute right-3 top-3 rounded-full bg-solar-600 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white shadow-sm sm:text-[11px]">
          {card.badge}
        </span>
      )}

      <div className="flex items-center justify-between gap-2">
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider sm:text-[11px] ${
            isHighlighted
              ? 'bg-solar-600 text-white'
              : 'bg-solar-50 text-solar-700 ring-1 ring-solar-100'
          }`}
        >
          <Sun className="h-3 w-3 shrink-0" aria-hidden="true" />
          {card.capacity}
        </span>
        {isHighlighted && (
          <Zap className="h-4 w-4 text-solar-600 sm:h-5 sm:w-5" aria-hidden="true" />
        )}
      </div>

      <p
        className={`mt-4 font-bold text-solar-700 sm:mt-5 ${
          isHighlighted
            ? 'text-[2rem] leading-none sm:text-4xl lg:text-[2.75rem]'
            : 'text-[1.75rem] leading-none sm:text-3xl lg:text-4xl'
        }`}
      >
        <SubsidyAmount
          value={card.amountValue}
          prefix={card.amountPrefix}
          isVisible={isVisible}
        />
      </p>

      <p className="mt-2 text-xs font-semibold text-charcoal sm:text-sm">{card.label}</p>
    </article>
  );
}

export default function PmSuryaGharHomeSection() {
  const { ref: sectionRef, isVisible } = useRevealOnScroll();
  const installCount = useCountUp(pmSuryaGharStats.installations, isVisible, 1300);

  return (
    <section
      ref={sectionRef}
      aria-labelledby="pm-surya-ghar-home-heading"
      className="relative overflow-x-hidden border-b border-solar-100/80 bg-gradient-to-b from-solar-50/95 via-white to-emerald-50/15 py-12 sm:py-16 lg:py-20"
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-20 top-0 h-56 w-56 rounded-full bg-solar-200/25 blur-3xl" />
        <div className="absolute -right-12 bottom-0 h-64 w-64 rounded-full bg-emerald-200/20 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div
          className={`reveal-up mx-auto max-w-3xl text-center ${isVisible ? 'is-visible' : ''}`}
        >
          <div className="rounded-2xl border border-solar-200/80 bg-white/90 px-4 py-3 shadow-sm ring-1 ring-solar-100/70 sm:px-5 sm:py-4">
            <p className="text-[11px] font-bold uppercase leading-snug tracking-[0.08em] text-charcoal sm:text-xs sm:tracking-[0.1em]">
              {pmSuryaGharHomeCompany.name}
            </p>
            <p className="mt-1.5 inline-flex items-center justify-center gap-1.5 text-sm font-semibold text-solar-700 sm:text-base">
              <BadgeCheck className="h-4 w-4 shrink-0 text-solar-600" aria-hidden="true" />
              {pmSuryaGharHomeCompany.vendorLabel}
            </p>
          </div>

          <h2
            id="pm-surya-ghar-home-heading"
            className="mt-5 text-[1.65rem] font-bold leading-tight tracking-tight text-charcoal sm:mt-6 sm:text-4xl lg:text-[2.5rem]"
          >
            PM Surya Ghar Yojana – Government Solar Subsidy
          </h2>

          <p className="mt-3 text-sm leading-relaxed text-charcoal-light sm:mt-4 sm:text-base sm:leading-7">
            Install rooftop solar with an authorized partner and claim eligible
            central government subsidy on your home solar system.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-3 sm:mt-10 sm:grid-cols-3 sm:gap-4 lg:gap-5">
          {pmSuryaGharHomeSubsidyCards.map((card, index) => (
            <SubsidyCard
              key={card.capacity}
              card={card}
              index={index}
              isVisible={isVisible}
            />
          ))}
        </div>

        <p
          className={`reveal-up mx-auto mt-4 max-w-2xl text-center text-[11px] leading-relaxed text-charcoal-light sm:mt-5 sm:text-xs ${isVisible ? 'is-visible' : ''}`}
          style={{ animationDelay: '220ms' }}
        >
          {pmSuryaGharHomeDisclaimer}
        </p>

        <div
          className={`reveal-up mt-6 rounded-2xl border border-solar-200/80 bg-gradient-to-r from-solar-600 to-solar-700 px-5 py-5 text-center text-white shadow-[0_10px_32px_rgba(22,163,74,0.2)] sm:mt-8 sm:px-8 sm:py-6 ${isVisible ? 'is-visible' : ''}`}
          style={{ animationDelay: '260ms' }}
        >
          <div className="flex flex-col items-center gap-2 sm:flex-row sm:justify-center sm:gap-4">
            <Shield className="hidden h-8 w-8 shrink-0 text-white/90 sm:block" aria-hidden="true" />
            <div>
              <p className="text-4xl font-bold tabular-nums tracking-tight sm:text-5xl">
                {installCount}+
              </p>
              <p className="mt-1 text-sm font-semibold text-solar-50 sm:text-base">
                Subsidy Solar Sets Installed
              </p>
            </div>
          </div>
        </div>

        <div
          className={`reveal-up mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:justify-center sm:gap-4 ${isVisible ? 'is-visible' : ''}`}
          style={{ animationDelay: '300ms' }}
        >
          <Button
            to="/subsidy/pm-surya-ghar"
            size="lg"
            className="min-h-[48px] w-full rounded-xl text-base sm:min-w-[260px] sm:w-auto"
          >
            Check Subsidy Eligibility
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Button>
          <Button
            to="/shop"
            variant="secondary"
            size="lg"
            className="min-h-[48px] w-full rounded-xl border-solar-200 text-base sm:min-w-[220px] sm:w-auto"
          >
            View Solar Sets
          </Button>
        </div>
      </div>
    </section>
  );
}
