import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Loader2, Mail, MapPin } from 'lucide-react';
import Button from '@/components/ui/Button';
import { contactInfo, corporateOffice } from '@/constants/homeContent';
import { useGetPublicCategoriesQuery } from '@/services/categoriesApi';
import { useGetSiteMediaQuery } from '@/services/siteMediaApi';

const quickLinks = [
  { label: 'Home', path: '/' },
  { label: 'Shop', path: '/shop' },
  { label: 'Contact', path: '/contact' },
  { label: 'Learn', path: '/learn/solar-buying-guide' },
  { label: 'Subsidy', path: '/subsidy/pm-surya-ghar' },
  { label: 'Become a Distributor', path: '/distributor' },
];

const supportLinks = [
  { label: 'Contact Us', path: '/contact' },
  { label: 'Get a Quote', path: '/quote' },
  { label: 'Distributor Enquiry', path: '/distributor' },
];

const legalLinks = [
  { label: 'Privacy Policy', path: '/privacy-policy' },
  { label: 'Terms & Conditions', path: '/terms-and-conditions' },
];

function FooterLinkList({ title, links }) {
  return (
    <div>
      <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
        {title}
      </h3>
      <ul className="mt-4 space-y-2.5">
        {links.map(({ label, path }) => (
          <li key={path}>
            <Link
              to={path}
              className="text-sm text-gray-300 transition-colors hover:text-white"
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function FooterCategories() {
  const { data, isLoading } = useGetPublicCategoriesQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const categories = data?.data?.categories ?? [];

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-sm text-gray-400">
        <Loader2 className="h-4 w-4 animate-spin" />
        Loading categories...
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <ul className="mt-4 space-y-2.5">
        <li>
          <Link
            to="/shop"
            className="text-sm text-gray-300 transition-colors hover:text-white"
          >
            Browse Shop
          </Link>
        </li>
      </ul>
    );
  }

  return (
    <ul className="mt-4 space-y-2.5">
      {categories.map((category) => (
        <li key={category.id}>
          <Link
            to={`/shop/${category.slug}`}
            className="text-sm text-gray-300 transition-colors hover:text-white"
          >
            {category.name}
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default function Footer() {
  const { data: siteMediaResponse } = useGetSiteMediaQuery();
  const logoSrc = siteMediaResponse?.data?.logo ?? '/logo.jpg';
  const [logoError, setLogoError] = useState(false);

  return (
    <footer className="bg-charcoal text-gray-300">
      <div className="border-b border-white/10 bg-charcoal-light/20">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6 rounded-2xl border border-white/10 bg-white/5 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-solar-200">
                Visit Our Office
              </p>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-gray-300">
                {corporateOffice.address}
              </p>
            </div>
            <Button
              href={corporateOffice.directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              variant="white"
              size="sm"
              className="shrink-0"
            >
              Get Directions
            </Button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Link to="/" className="inline-flex items-center">
              {!logoError ? (
                <img
                  src={logoSrc}
                  alt="HANS Solar"
                  className="h-10 w-auto max-w-[140px] brightness-0 invert object-contain"
                  onError={() => setLogoError(true)}
                />
              ) : (
                <span className="text-xl font-bold text-white">HANS Solar</span>
              )}
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-gray-400">
              HANS Solar delivers trusted solar products and complete energy
              solutions for homes, businesses and industries — powering a cleaner,
              brighter future.
            </p>
          </div>

          <div className="lg:col-span-2">
            <FooterLinkList title="Quick Links" links={quickLinks} />
          </div>

          <div className="lg:col-span-2">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              Products & Categories
            </h3>
            <FooterCategories />
          </div>

          <div className="lg:col-span-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              Contact
            </h3>
            <ul className="mt-4 space-y-4">
              <li>
                <a
                  href={`mailto:${contactInfo.email}`}
                  className="inline-flex items-start gap-3 text-sm text-gray-300 transition-colors hover:text-white"
                >
                  <Mail className="mt-0.5 h-4 w-4 shrink-0 text-solar-400" />
                  <span>{contactInfo.email}</span>
                </a>
              </li>
              <li className="inline-flex items-start gap-3 text-sm text-gray-300">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-solar-400" />
                <span className="leading-relaxed">{corporateOffice.address}</span>
              </li>
            </ul>

            <div className="mt-6">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                Support
              </h4>
              <ul className="mt-3 space-y-2.5">
                {supportLinks.map(({ label, path }) => (
                  <li key={path}>
                    <Link
                      to={path}
                      className="text-sm text-gray-300 transition-colors hover:text-white"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} HANS Solar. All rights reserved.
          </p>
          <div className="flex flex-wrap gap-4">
            {legalLinks.map(({ label, path }) => (
              <Link
                key={path}
                to={path}
                className="text-sm text-gray-400 transition-colors hover:text-white"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
