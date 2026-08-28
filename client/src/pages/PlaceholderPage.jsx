import { Link } from 'react-router-dom';
import Button from '@/components/ui/Button';

export default function PlaceholderPage({ title, description, ctaLabel, ctaPath }) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4 py-16">
      <div className="max-w-lg text-center">
        <p className="text-sm font-semibold uppercase tracking-wider text-solar-600">
          HANS Solar
        </p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-charcoal sm:text-4xl">
          {title}
        </h1>
        <p className="mt-4 text-base leading-relaxed text-charcoal-light">
          {description}
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Button to={ctaPath ?? '/'}>{ctaLabel ?? 'Back to Home'}</Button>
          <Button to="/contact" variant="secondary">
            Contact Us
          </Button>
        </div>
        <p className="mt-6 text-sm text-charcoal-light">
          This page is ready for content integration.{' '}
          <Link to="/" className="font-medium text-solar-700 hover:underline">
            Return home
          </Link>
        </p>
      </div>
    </div>
  );
}
