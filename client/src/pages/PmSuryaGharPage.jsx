import { useEffect, useState } from 'react';
import {
  BadgeCheck,
  ChevronDown,
  ClipboardCheck,
  Gauge,
  Headphones,
  Home,
  IndianRupee,
  Leaf,
  PiggyBank,
  Sun,
  TrendingDown,
  UserPlus,
  Wrench,
  Zap,
} from 'lucide-react';
import Button from '@/components/ui/Button';
import { useEnquiryModal } from '@/context/EnquiryModalContext';
import useCountUp from '@/hooks/useCountUp';
import useRevealOnScroll from '@/hooks/useRevealOnScroll';
import {
  pmSuryaGharBenefits,
  pmSuryaGharCapacityGuide,
  pmSuryaGharDisclaimer,
  pmSuryaGharDocuments,
  pmSuryaGharEligibility,
  pmSuryaGharFaqs,
  pmSuryaGharFlowSteps,
  pmSuryaGharProcess,
  pmSuryaGharSeo,
  pmSuryaGharStats,
  pmSuryaGharSubsidyTable,
  pmSuryaGharWhyChoose,
} from '@/constants/pmSuryaGharContent';

const flowIconMap = {
  UserPlus,
  Sun,
  BadgeCheck,
  Home,
  ClipboardCheck,
  Gauge,
  IndianRupee,
};

const whyChooseIconMap = {
  BadgeCheck,
  Home,
  IndianRupee,
  Wrench,
  Gauge,
  Headphones,
};

const benefitIconMap = {
  TrendingDown,
  IndianRupee,
  Leaf,
  PiggyBank,
  Zap,
};

function SectionShell({ children, className = '', delay = 0, isVisible }) {
  return (
    <div
      className={`reveal-up ${isVisible ? 'is-visible' : ''} ${className}`}
      style={delay ? { animationDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
}

function StatCounter({ target, isVisible, suffix = '+' }) {
  const count = useCountUp(target, isVisible);

  return (
    <span>
      {count}
      {suffix}
    </span>
  );
}

function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="divide-y divide-gray-100 rounded-2xl border border-gray-100 bg-white shadow-sm">
      {pmSuryaGharFaqs.map((item, index) => {
        const isOpen = openIndex === index;

        return (
          <div key={item.question}>
            <button
              type="button"
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left sm:px-6 sm:py-5"
              onClick={() => setOpenIndex(isOpen ? -1 : index)}
              aria-expanded={isOpen}
            >
              <span className="text-sm font-semibold text-charcoal sm:text-base">
                {item.question}
              </span>
              <ChevronDown
                className={`h-5 w-5 shrink-0 text-solar-600 transition-transform ${isOpen ? 'rotate-180' : ''}`}
              />
            </button>
            {isOpen && (
              <div className="px-5 pb-5 text-sm leading-relaxed text-charcoal-light sm:px-6 sm:pb-6">
                {item.answer}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function PmSuryaGharPage() {
  const { openEnquiryModal } = useEnquiryModal();
  const { ref: heroRef, isVisible: heroVisible } = useRevealOnScroll();
  const { ref: statsRef, isVisible: statsVisible } = useRevealOnScroll();
  const { ref: trustRef, isVisible: trustVisible } = useRevealOnScroll();

  useEffect(() => {
    document.title = pmSuryaGharSeo.title;

    let meta = document.querySelector('meta[name="description"]');

    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', 'description');
      document.head.appendChild(meta);
    }

    meta.setAttribute('content', pmSuryaGharSeo.description);

    return () => {
      document.title = 'HANS Solar';
    };
  }, []);

  return (
    <div className="bg-gray-50">
      <section
        ref={heroRef}
        className="border-b border-gray-200 bg-gradient-to-br from-solar-700 via-solar-600 to-emerald-700"
      >
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-18 lg:px-8 lg:py-20">
          <SectionShell isVisible={heroVisible}>
            <p className="text-sm font-semibold uppercase tracking-wider text-white/80">
              Government of India Rooftop Solar Initiative
            </p>
            <h1 className="mt-3 max-w-4xl text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
              PM Surya Ghar: Muft Bijli Yojana
            </h1>
            <p className="mt-4 max-w-3xl text-lg font-medium text-white/95 sm:text-xl">
              Install Rooftop Solar &amp; Get Government Subsidy of Up to ₹78,000
            </p>
            <p className="mt-5 max-w-3xl text-base leading-relaxed text-white/90 sm:text-lg">
              PM Surya Ghar: Muft Bijli Yojana is a Government of India initiative
              designed to encourage residential rooftop solar adoption and help
              households reduce their electricity expenses through clean and
              renewable energy.
            </p>
            <p className="mt-4 max-w-3xl text-sm leading-relaxed text-white/85 sm:text-base">
              Eligible residential consumers can receive Central Financial
              Assistance (CFA) based on the installed rooftop solar capacity.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button
                size="lg"
                variant="white"
                onClick={() => openEnquiryModal({ enquiryType: 'quote' })}
              >
                Get Solar Quote
              </Button>
              <Button
                to="/contact"
                size="lg"
                variant="secondary"
                className="border-white/30 bg-white/10 text-white hover:bg-white/20"
              >
                Talk to Expert
              </Button>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[
                'Up to ₹78,000 Government Subsidy',
                'Hans Solar – Authorized/Registered PM Surya Ghar Solar Partner',
                '800+ Subsidy-Linked Solar Sets Delivered/Installed',
              ].map((highlight) => (
                <div
                  key={highlight}
                  className="rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-sm font-medium text-white backdrop-blur-sm"
                >
                  {highlight}
                </div>
              ))}
            </div>
          </SectionShell>
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionShell isVisible={heroVisible} delay={80}>
            <div className="overflow-hidden rounded-3xl border border-solar-200 bg-gradient-to-br from-solar-50 via-white to-emerald-50 p-6 shadow-sm sm:p-8 lg:p-10">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                <div className="max-w-3xl">
                  <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wider text-solar-700 ring-1 ring-solar-100">
                    <BadgeCheck className="h-3.5 w-3.5" />
                    Verified Vendor Support
                  </div>
                  <h2 className="mt-4 text-2xl font-bold text-charcoal sm:text-3xl">
                    Hans Solar – Authorized/Registered PM Surya Ghar Solar Partner
                  </h2>
                  <p className="mt-3 text-base leading-relaxed text-charcoal-light">
                    Hans Solar is an authorized/registered PM Surya Ghar solar
                    partner, helping eligible residential customers with rooftop
                    solar installation and the applicable government subsidy
                    process.
                  </p>
                </div>
                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-solar-600 text-white shadow-lg shadow-solar-600/25">
                  <BadgeCheck className="h-10 w-10" />
                </div>
              </div>
            </div>
          </SectionShell>
        </div>
      </section>

      <section ref={statsRef} className="pb-12 sm:pb-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionShell isVisible={statsVisible}>
            <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white p-8 text-center shadow-sm sm:p-10">
              <p className="text-5xl font-bold tracking-tight text-solar-700 sm:text-6xl lg:text-7xl">
                <StatCounter
                  target={pmSuryaGharStats.installations}
                  isVisible={statsVisible}
                />
              </p>
              <p className="mt-3 text-xl font-semibold text-charcoal sm:text-2xl">
                {pmSuryaGharStats.installationsLabel}
              </p>
              <p className="mx-auto mt-3 max-w-2xl text-base text-charcoal-light">
                {pmSuryaGharStats.installationsDescription}
              </p>
            </div>
          </SectionShell>
        </div>
      </section>

      <section className="pb-12 sm:pb-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionShell isVisible={statsVisible} delay={60}>
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-charcoal sm:text-4xl">
                How Much PM Surya Ghar Subsidy Can You Get?
              </h2>
            </div>

            <div className="mt-8 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
              <table className="min-w-full divide-y divide-gray-100">
                <thead className="bg-solar-50">
                  <tr>
                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-solar-800">
                      Solar Capacity
                    </th>
                    <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-solar-800">
                      Central Subsidy
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {pmSuryaGharSubsidyTable.map((row) => (
                    <tr key={row.capacity} className="hover:bg-gray-50/80">
                      <td className="px-5 py-4 text-sm font-medium text-charcoal">
                        {row.capacity}
                      </td>
                      <td className="px-5 py-4 text-right text-sm font-semibold text-solar-700">
                        {row.subsidy}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-6 rounded-3xl border border-solar-200 bg-gradient-to-br from-solar-600 to-emerald-700 p-6 text-white shadow-lg sm:p-8">
              <p className="text-sm font-semibold uppercase tracking-wider text-white/80">
                Maximum Central Financial Assistance
              </p>
              <p className="mt-2 text-4xl font-bold sm:text-5xl">Get up to ₹78,000</p>
              <p className="mt-1 text-lg font-medium text-white/90">
                Government Subsidy
              </p>
              <p className="mt-4 max-w-3xl text-sm leading-relaxed text-white/90 sm:text-base">
                The maximum Central Financial Assistance for an individual
                residential consumer is ₹78,000 under the applicable central
                subsidy structure.
              </p>
              <ul className="mt-5 space-y-2 text-sm text-white/90 sm:text-base">
                <li>• ₹30,000/kW for the first 2 kW</li>
                <li>• ₹18,000 for the additional 1 kW</li>
                <li>
                  • Central subsidy is capped at ₹78,000 for residential consumers
                  under the applicable scheme structure
                </li>
              </ul>
            </div>
          </SectionShell>
        </div>
      </section>

      <section className="pb-12 sm:pb-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionShell isVisible={statsVisible} delay={80}>
            <h2 className="text-center text-3xl font-bold tracking-tight text-charcoal sm:text-4xl">
              How the Subsidy Works
            </h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
              {pmSuryaGharFlowSteps.map((step, index) => {
                const Icon = flowIconMap[step.icon];

                return (
                  <div key={step.title} className="relative">
                    <article className="h-full rounded-2xl border border-gray-100 bg-white p-4 text-center shadow-sm">
                      <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-solar-50 text-solar-700">
                        <Icon className="h-5 w-5" />
                      </div>
                      <p className="mt-3 text-sm font-semibold text-charcoal">
                        {step.title}
                      </p>
                    </article>
                    {index < pmSuryaGharFlowSteps.length - 1 && (
                      <span
                        className="absolute -right-2 top-1/2 hidden -translate-y-1/2 text-solar-400 xl:block"
                        aria-hidden
                      >
                        →
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
            <p className="mx-auto mt-6 max-w-3xl text-center text-sm leading-relaxed text-charcoal-light sm:text-base">
              Hans Solar helps customers navigate the rooftop solar installation
              and subsidy process, including documentation and coordination required
              during the applicable installation and DISCOM process.
            </p>
          </SectionShell>
        </div>
      </section>

      <section className="pb-12 sm:pb-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-2">
            <SectionShell isVisible={statsVisible} delay={100}>
              <div className="h-full rounded-3xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
                <h2 className="text-2xl font-bold text-charcoal sm:text-3xl">
                  Who Can Apply for PM Surya Ghar Subsidy?
                </h2>
                <ul className="mt-5 space-y-3">
                  {pmSuryaGharEligibility.map((item) => (
                    <li
                      key={item}
                      className="flex gap-3 text-sm leading-relaxed text-charcoal-light sm:text-base"
                    >
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-solar-600" />
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="mt-5 text-xs leading-relaxed text-charcoal-light sm:text-sm">
                  Eligibility and subsidy are subject to the latest Government of
                  India, MNRE and applicable DISCOM guidelines.
                </p>
              </div>
            </SectionShell>

            <SectionShell isVisible={statsVisible} delay={140}>
              <div className="h-full rounded-3xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
                <h2 className="text-2xl font-bold text-charcoal sm:text-3xl">
                  Why Choose Hans Solar?
                </h2>
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  {pmSuryaGharWhyChoose.map((item) => {
                    const Icon = whyChooseIconMap[item.icon];

                    return (
                      <article
                        key={item.title}
                        className="rounded-2xl border border-gray-100 bg-gray-50 p-4"
                      >
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-solar-50 text-solar-700">
                          <Icon className="h-5 w-5" />
                        </div>
                        <h3 className="mt-3 text-sm font-semibold text-charcoal">
                          {item.title}
                        </h3>
                        <p className="mt-1 text-xs leading-relaxed text-charcoal-light">
                          {item.description}
                        </p>
                      </article>
                    );
                  })}
                </div>
              </div>
            </SectionShell>
          </div>
        </div>
      </section>

      <section className="pb-12 sm:pb-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionShell isVisible={statsVisible} delay={120}>
            <h2 className="text-center text-3xl font-bold tracking-tight text-charcoal sm:text-4xl">
              Solar Capacity Guide
            </h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {pmSuryaGharCapacityGuide.map((item) => (
                <article
                  key={item.capacity}
                  className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
                >
                  <p className="text-lg font-bold text-charcoal">{item.capacity}</p>
                  <p className="mt-1 text-sm font-semibold text-solar-700">
                    {item.subsidy}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-charcoal-light">
                    {item.description}
                  </p>
                </article>
              ))}
            </div>
          </SectionShell>
        </div>
      </section>

      <section className="bg-white py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionShell isVisible={statsVisible}>
            <h2 className="text-center text-3xl font-bold tracking-tight text-charcoal sm:text-4xl">
              Benefits of Installing Solar Under PM Surya Ghar
            </h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              {pmSuryaGharBenefits.map((item) => {
                const Icon = benefitIconMap[item.icon];

                return (
                  <article
                    key={item.title}
                    className="rounded-2xl border border-gray-100 bg-gray-50 p-5 shadow-sm"
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-solar-50 text-solar-700">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="mt-4 text-base font-semibold text-charcoal">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-charcoal-light">
                      {item.description}
                    </p>
                  </article>
                );
              })}
            </div>
          </SectionShell>
        </div>
      </section>

      <section className="pb-12 sm:pb-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-2">
            <SectionShell isVisible={statsVisible} delay={80}>
              <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
                <h2 className="text-2xl font-bold text-charcoal sm:text-3xl">
                  What is Net Metering?
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-charcoal-light sm:text-base">
                  With a grid-connected rooftop solar system, electricity generated
                  by your solar panels can be used by your home. Depending on
                  applicable state/DISCOM regulations, surplus electricity may be
                  exported to the electricity grid through the approved metering
                  mechanism.
                </p>
                <div className="mt-6 space-y-4 rounded-2xl bg-solar-50 p-5">
                  <div className="flex flex-wrap items-center justify-center gap-2 text-sm font-medium text-charcoal">
                    <span className="rounded-full bg-white px-3 py-1.5 ring-1 ring-solar-100">
                      Solar Panels
                    </span>
                    <span className="text-solar-600">→</span>
                    <span className="rounded-full bg-white px-3 py-1.5 ring-1 ring-solar-100">
                      Inverter
                    </span>
                    <span className="text-solar-600">→</span>
                    <span className="rounded-full bg-white px-3 py-1.5 ring-1 ring-solar-100">
                      Home
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center justify-center gap-2 text-sm font-medium text-charcoal">
                    <span className="rounded-full bg-white px-3 py-1.5 ring-1 ring-solar-100">
                      Surplus Power
                    </span>
                    <span className="text-solar-600">→</span>
                    <span className="rounded-full bg-white px-3 py-1.5 ring-1 ring-solar-100">
                      Grid
                    </span>
                  </div>
                </div>
              </div>
            </SectionShell>

            <SectionShell isVisible={statsVisible} delay={120}>
              <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
                <h2 className="text-2xl font-bold text-charcoal sm:text-3xl">
                  Documents &amp; Information Required
                </h2>
                <ul className="mt-5 space-y-2.5">
                  {pmSuryaGharDocuments.map((item) => (
                    <li
                      key={item}
                      className="flex gap-3 text-sm text-charcoal-light sm:text-base"
                    >
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-solar-600" />
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="mt-5 text-xs leading-relaxed text-charcoal-light sm:text-sm">
                  Exact requirements may vary depending on the DISCOM and applicable
                  government guidelines.
                </p>
              </div>
            </SectionShell>
          </div>
        </div>
      </section>

      <section className="pb-12 sm:pb-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionShell isVisible={statsVisible}>
            <h2 className="text-center text-3xl font-bold tracking-tight text-charcoal sm:text-4xl">
              Hans Solar Process
            </h2>
            <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {pmSuryaGharProcess.map((item) => (
                <article
                  key={item.step}
                  className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
                >
                  <p className="text-sm font-bold text-solar-600">{item.step}</p>
                  <h3 className="mt-2 text-lg font-semibold text-charcoal">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-charcoal-light">
                    {item.description}
                  </p>
                </article>
              ))}
            </div>
          </SectionShell>
        </div>
      </section>

      <section ref={trustRef} className="pb-12 sm:pb-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionShell isVisible={trustVisible}>
            <div className="overflow-hidden rounded-3xl border border-solar-100 bg-gradient-to-br from-solar-50 via-white to-emerald-50 px-6 py-10 text-center shadow-sm sm:px-10 sm:py-12">
              <h2 className="text-3xl font-bold tracking-tight text-charcoal sm:text-4xl">
                Trusted by 800+ Solar Customers
              </h2>
              <p className="mt-4 text-5xl font-bold text-solar-700 sm:text-6xl">
                <StatCounter
                  target={pmSuryaGharStats.installations}
                  isVisible={trustVisible}
                />
              </p>
              <p className="mt-3 text-lg font-medium text-charcoal">
                Subsidy-linked solar sets delivered by Hans Solar.
              </p>
              <p className="mx-auto mt-3 max-w-2xl text-base text-charcoal-light">
                Join households across India moving towards clean and affordable
                solar energy.
              </p>
            </div>
          </SectionShell>
        </div>
      </section>

      <section className="pb-12 sm:pb-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionShell isVisible={trustVisible} delay={60}>
            <div className="rounded-3xl border border-gray-100 bg-white px-6 py-10 text-center shadow-sm sm:px-10 sm:py-12">
              <h2 className="text-3xl font-bold tracking-tight text-charcoal sm:text-4xl">
                Ready to Switch to Solar?
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-base text-charcoal-light sm:text-lg">
                Check your eligibility and discover the right rooftop solar solution
                for your home under PM Surya Ghar.
              </p>
              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <Button
                  size="lg"
                  onClick={() => openEnquiryModal({ enquiryType: 'quote' })}
                >
                  Get Solar Quote
                </Button>
                <Button to="/contact" variant="secondary" size="lg">
                  Talk to Expert
                </Button>
              </div>
            </div>
          </SectionShell>
        </div>
      </section>

      <section className="pb-12 sm:pb-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <SectionShell isVisible={trustVisible} delay={80}>
            <h2 className="text-center text-3xl font-bold tracking-tight text-charcoal sm:text-4xl">
              Frequently Asked Questions
            </h2>
            <div className="mt-8">
              <FaqAccordion />
            </div>
          </SectionShell>
        </div>
      </section>

      <section className="border-t border-gray-200 pb-12 pt-8 sm:pb-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <p className="text-xs leading-relaxed text-charcoal-light sm:text-sm">
            {pmSuryaGharDisclaimer}
          </p>
        </div>
      </section>
    </div>
  );
}
