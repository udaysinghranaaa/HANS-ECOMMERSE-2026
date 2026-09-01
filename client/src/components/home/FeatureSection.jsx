import {
  BatteryCharging,
  Layers,
  Sun,
  Zap,
} from 'lucide-react';
import SectionHeader from '@/components/home/SectionHeader';
import useRevealOnScroll from '@/hooks/useRevealOnScroll';
import { trustFeatures } from '@/constants/homeContent';

const iconMap = {
  Sun,
  Zap,
  BatteryCharging,
  Layers,
};

export default function FeatureSection() {
  const { ref: sectionRef, isVisible } = useRevealOnScroll();

  return (
    <section ref={sectionRef} className="border-y border-slate-100 bg-slate-50/70 py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className={`reveal-up ${isVisible ? 'is-visible' : ''}`}>
          <SectionHeader
            title="HANS Solar at a Glance"
            subtitle="From premium panels to complete system support — everything you need for a dependable solar journey."
            align="center"
          />
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 sm:gap-6 xl:grid-cols-4">
          {trustFeatures.map(({ title, description, icon }, index) => {
            const Icon = iconMap[icon];
            return (
              <article
                key={title}
                style={{ animationDelay: `${80 + index * 60}ms` }}
                className={`reveal-up group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-6 shadow-[0_4px_24px_rgba(15,23,42,0.04)] transition-all duration-300 hover:-translate-y-1 hover:border-solar-200 hover:shadow-[0_12px_32px_rgba(22,163,74,0.08)] sm:p-7 ${isVisible ? 'is-visible' : ''}`}
              >
                <div className="absolute inset-x-0 top-0 h-0.5 scale-x-0 bg-solar-500 transition-transform duration-300 group-hover:scale-x-100" />

                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-solar-50 text-solar-700 ring-1 ring-solar-100 transition-all duration-300 group-hover:bg-solar-600 group-hover:text-white group-hover:ring-solar-600">
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
                <p className="mt-2.5 text-sm leading-relaxed text-slate-600">
                  {description}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
