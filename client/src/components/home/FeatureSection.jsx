import {
  BatteryCharging,
  Layers,
  Sun,
  Zap,
} from 'lucide-react';
import { trustFeatures } from '@/constants/homeContent';

const iconMap = {
  Sun,
  Zap,
  BatteryCharging,
  Layers,
};

export default function FeatureSection() {
  return (
    <section className="bg-gray-50 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-charcoal sm:text-4xl">
            HANS Solar at a Glance
          </h2>
          <p className="mt-4 text-base text-charcoal-light sm:text-lg">
            From premium panels to complete system support — everything you
            need for a dependable solar journey.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {trustFeatures.map(({ title, description, icon }) => {
            const Icon = iconMap[icon];
            return (
              <article
                key={title}
                className="group rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-solar-200 hover:shadow-lg hover:shadow-solar-100/50"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-solar-50 text-solar-700 transition-colors group-hover:bg-solar-600 group-hover:text-white">
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <h3 className="text-lg font-semibold text-charcoal">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-charcoal-light">
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
