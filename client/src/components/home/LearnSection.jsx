import { ArrowRight, BookOpen, FileText, Lightbulb } from 'lucide-react';
import Button from '@/components/ui/Button';
import { learnCards } from '@/constants/homeContent';

const iconMap = { BookOpen, Lightbulb, FileText };

export default function LearnSection() {
  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-charcoal sm:text-4xl">
            Learn About Solar Energy
          </h2>
          <p className="mt-4 text-base text-charcoal-light sm:text-lg">
            Practical guides to help you understand, evaluate and adopt solar
            with confidence.
          </p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {learnCards.map(({ title, path, description, icon }) => {
            const Icon = iconMap[icon];
            return (
              <article
                key={path}
                className="group overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex h-40 items-center justify-center bg-gradient-to-br from-solar-50 to-white">
                  <Icon
                    className="h-14 w-14 text-solar-600 transition-transform duration-300 group-hover:scale-110"
                    aria-hidden="true"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-charcoal">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-charcoal-light">
                    {description}
                  </p>
                  <Button
                    to={path}
                    variant="secondary"
                    size="sm"
                    className="mt-5"
                  >
                    Learn More
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
