import {
  Award,
  Headphones,
  IndianRupee,
  ShieldCheck,
  TrendingUp,
  Wrench,
} from 'lucide-react';
import { whyChooseBenefits } from '@/constants/homeContent';

const iconMap = {
  Award,
  ShieldCheck,
  Headphones,
  TrendingUp,
  IndianRupee,
  Wrench,
};

export default function WhyChooseUs() {
  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-charcoal sm:text-4xl">
            Why Choose HANS Solar?
          </h2>
          <p className="mt-4 text-base text-charcoal-light sm:text-lg">
            A partner focused on quality, trust and long-term solar performance
            for every customer and distributor.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {whyChooseBenefits.map(({ title, description, icon }) => {
            const Icon = iconMap[icon];
            return (
              <article
                key={title}
                className="rounded-2xl border border-gray-100 p-6 transition-shadow hover:shadow-md"
              >
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-solar-100 text-solar-700">
                  <Icon className="h-5 w-5" aria-hidden="true" />
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
