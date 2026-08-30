import { useEffect } from 'react';
import {
  Activity,
  BookOpen,
  CheckCircle2,
  Gauge,
  Home,
  IndianRupee,
  Shield,
  Sun,
  Wrench,
  Zap,
} from 'lucide-react';
import Button from '@/components/ui/Button';
import ContactEnquiryForm from '@/components/contact/ContactEnquiryForm';
import useRevealOnScroll from '@/hooks/useRevealOnScroll';
import {
  solarBuyingChecklist,
  solarBuyingGuideSections,
  solarBuyingGuideSeo,
  solarBuyingMistakes,
} from '@/constants/solarBuyingGuideContent';

const sectionIconMap = {
  Gauge,
  Sun,
  Zap,
  Home,
  IndianRupee,
  Shield,
  Wrench,
  Activity,
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

export default function SolarBuyingGuidePage() {
  const { ref: heroRef, isVisible: heroVisible } = useRevealOnScroll();
  const { ref: contentRef, isVisible: contentVisible } = useRevealOnScroll();

  useEffect(() => {
    document.title = solarBuyingGuideSeo.title;

    let meta = document.querySelector('meta[name="description"]');

    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', 'description');
      document.head.appendChild(meta);
    }

    meta.setAttribute('content', solarBuyingGuideSeo.description);

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
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
          <SectionShell isVisible={heroVisible}>
            <p className="text-sm font-semibold uppercase tracking-wider text-white/80">
              Learn
            </p>
            <h1 className="mt-3 max-w-3xl text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
              Solar Buying Guide
            </h1>
            <p className="mt-4 max-w-2xl text-base text-white/90 sm:text-lg">
              A practical guide to help you choose the right rooftop solar system
              — from capacity and products to pricing, installation and net
              metering.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button to="/shop" size="lg" variant="white">
                Browse Solar Products
              </Button>
              <Button
                href="#contact-form"
                size="lg"
                variant="secondary"
                className="border-white/30 bg-white/10 text-white hover:bg-white/20"
              >
                Talk to Expert
              </Button>
            </div>
          </SectionShell>
        </div>
      </section>

      <section ref={contentRef} className="py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 md:grid-cols-2">
            {solarBuyingGuideSections.map((section, index) => {
              const Icon = sectionIconMap[section.icon];

              return (
                <SectionShell
                  key={section.id}
                  isVisible={contentVisible}
                  delay={index * 40}
                >
                  <article className="h-full rounded-3xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-solar-50 text-solar-700">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h2 className="mt-4 text-xl font-bold text-charcoal sm:text-2xl">
                      {section.title}
                    </h2>
                    <p className="mt-3 text-sm leading-relaxed text-charcoal-light sm:text-base">
                      {section.description}
                    </p>
                    <ul className="mt-4 space-y-2">
                      {section.points.map((point) => (
                        <li
                          key={point}
                          className="flex gap-3 text-sm leading-relaxed text-charcoal-light"
                        >
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-solar-600" />
                          {point}
                        </li>
                      ))}
                    </ul>
                  </article>
                </SectionShell>
              );
            })}
          </div>
        </div>
      </section>

      <section className="pb-12 sm:pb-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-2">
            <SectionShell isVisible={contentVisible} delay={80}>
              <div className="h-full rounded-3xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
                <div className="flex items-center gap-3">
                  <BookOpen className="h-6 w-6 text-solar-600" />
                  <h2 className="text-2xl font-bold text-charcoal sm:text-3xl">
                    Buying Checklist
                  </h2>
                </div>
                <ul className="mt-5 space-y-3">
                  {solarBuyingChecklist.map((item) => (
                    <li
                      key={item}
                      className="flex gap-3 text-sm leading-relaxed text-charcoal-light sm:text-base"
                    >
                      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-solar-600" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </SectionShell>

            <SectionShell isVisible={contentVisible} delay={120}>
              <div className="h-full rounded-3xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
                <h2 className="text-2xl font-bold text-charcoal sm:text-3xl">
                  Common Mistakes to Avoid
                </h2>
                <div className="mt-5 space-y-4">
                  {solarBuyingMistakes.map((item) => (
                    <article
                      key={item.title}
                      className="rounded-2xl border border-gray-100 bg-gray-50 p-4"
                    >
                      <h3 className="text-sm font-semibold text-charcoal sm:text-base">
                        {item.title}
                      </h3>
                      <p className="mt-1 text-sm leading-relaxed text-charcoal-light">
                        {item.description}
                      </p>
                    </article>
                  ))}
                </div>
              </div>
            </SectionShell>
          </div>
        </div>
      </section>

      <section id="contact-form" className="border-t border-gray-200 pb-12 pt-12 sm:pb-16 sm:pt-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-solar-700">
              Get Expert Guidance
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-charcoal sm:text-4xl">
              Contact HANS Solar
            </h2>
            <p className="mt-4 text-base text-charcoal-light sm:text-lg">
              Share your requirement and our team will help you choose the right
              solar solution.
            </p>
          </div>
          <ContactEnquiryForm idPrefix="buying-guide" />
        </div>
      </section>
    </div>
  );
}
