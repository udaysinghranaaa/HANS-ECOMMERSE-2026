import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Loader2, Mail, MapPin } from 'lucide-react';
import Button from '@/components/ui/Button';
import { contactInfo, corporateOffice } from '@/constants/homeContent';
import { useEnquiryModal } from '@/context/EnquiryModalContext';
import { useGetPublicCategoriesQuery } from '@/services/categoriesApi';
import { useGetSiteMediaQuery } from '@/services/siteMediaApi';

const quickLinks = [
  { label: 'Home', path: '/' },
  { label: 'Shop', path: '/shop' },
  { label: 'Contact', path: '/contact' },
  { label: 'Learn', path: '/learn/solar-buying-guide' },
  { label: 'Subsidy', path: '/subsidy/pm-surya-ghar' },
  { label: 'Become a Distributor', enquiryType: 'distributor' },
];

const supportLinks = [
  { label: 'Contact Us', path: '/contact' },
  { label: 'Get a Quote', enquiryType: 'quote' },
  { label: 'Distributor Enquiry', enquiryType: 'distributor' },
];

const legalLinks = [
  { label: 'Privacy Policy', path: '/privacy-policy' },
  { label: 'Terms & Conditions', path: '/terms-and-conditions' },
];

function FooterLinkList({ title, links, onOpenEnquiry }) {
  return (
    <div>
      <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-300">
        {title}
      </h3>
      <ul className="mt-4 space-y-2.5">
        {links.map((link) => (
          <li key={link.label}>
            {link.enquiryType ? (
              <button
                type="button"
                onClick={() => onOpenEnquiry(link.enquiryType)}
                className="text-sm text-slate-400 transition-colors hover:text-white"
              >
                {link.label}
              </button>
            ) : (
              <Link
                to={link.path}
                className="text-sm text-slate-400 transition-colors hover:text-white"
              >
                {link.label}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

function FooterCategories() {
  const { data, isLoading } = useGetPublicCategoriesQuery();

  const categories = data?.data?.categories ?? [];

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-sm text-slate-500">
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
            className="text-sm text-slate-400 transition-colors hover:text-white"
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
            className="text-sm text-slate-400 transition-colors hover:text-white"
          >
            {category.name}
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default function Footer() {
  const { openEnquiryModal } = useEnquiryModal();
  const { data: siteMediaResponse } = useGetSiteMediaQuery();
  const logoSrc = siteMediaResponse?.data?.logo ?? '/logo.jpg';
  const [logoError, setLogoError] = useState(false);

  const handleOpenEnquiry = (enquiryType) => {
    openEnquiryModal({ enquiryType });
  };

  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="border-b border-white/8 bg-slate-800/40">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6 rounded-2xl border border-white/10 bg-white/[0.03] p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-solar-300">
                Visit Our Office
              </p>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-400">
                {corporateOffice.address}
              </p>
            </div>
            <Button
              href={corporateOffice.directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              variant="white"
              size="sm"
              className="shrink-0 rounded-xl"
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
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-400">
              HANS Solar delivers trusted solar products and complete energy
              solutions for homes, businesses and industries — powering a cleaner,
              brighter future.
            </p>
          </div>

          <div className="lg:col-span-2">
            <FooterLinkList
              title="Quick Links"
              links={quickLinks}
              onOpenEnquiry={handleOpenEnquiry}
            />
          </div>

          <div className="lg:col-span-2">
            <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-300">
              Products & Categories
            </h3>
            <FooterCategories />
          </div>

          <div className="lg:col-span-4">
            <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-300">
              Contact
            </h3>
            <ul className="mt-4 space-y-4">
              <li>
                <a
                  href={`mailto:${contactInfo.email}`}
                  className="inline-flex items-start gap-3 text-sm text-slate-400 transition-colors hover:text-white"
                >
                  <Mail className="mt-0.5 h-4 w-4 shrink-0 text-solar-400" />
                  <span>{contactInfo.email}</span>
                </a>
              </li>
              <li className="inline-flex items-start gap-3 text-sm text-slate-400">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-solar-400" />
                <span className="leading-relaxed">{corporateOffice.address}</span>
              </li>
            </ul>

            <div className="mt-6">
              <h4 className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                Support
              </h4>
              <ul className="mt-3 space-y-2.5">
                {supportLinks.map((link) => (
                  <li key={link.label}>
                    {link.enquiryType ? (
                      <button
                        type="button"
                        onClick={() => handleOpenEnquiry(link.enquiryType)}
                        className="text-sm text-slate-400 transition-colors hover:text-white"
                      >
                        {link.label}
                      </button>
                    ) : (
                      <Link
                        to={link.path}
                        className="text-sm text-slate-400 transition-colors hover:text-white"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-white/8 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} HANS Solar. All rights reserved.
          </p>
          <div className="flex flex-wrap gap-4">
            {legalLinks.map(({ label, path }) => (
              <Link
                key={path}
                to={path}
                className="text-sm text-slate-500 transition-colors hover:text-white"
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
