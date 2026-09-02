import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, Loader2, Mail, MapPin, Phone } from 'lucide-react';
import Button from '@/components/ui/Button';
import { contactInfo, corporateOffice } from '@/constants/homeContent';
import { useEnquiryModal } from '@/context/EnquiryModalContext';
import { useGetPublicCategoriesQuery } from '@/services/categoriesApi';
import { useGetSiteMediaQuery } from '@/services/siteMediaApi';

const quickLinks = [
  { label: 'Home', path: '/' },
  { label: 'Shop', path: '/shop' },
  { label: 'All Categories', path: '/shop/categories' },
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

function FooterCollapsibleSection({ title, defaultOpen = false, children }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-white/8 py-4 lg:border-b-0 lg:py-0">
      <button
        type="button"
        className="flex min-h-[44px] w-full items-center justify-between text-left lg:pointer-events-none lg:min-h-0"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
      >
        <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-300">
          {title}
        </h3>
        <ChevronDown
          className={`h-4 w-4 text-slate-500 transition-transform duration-200 lg:hidden ${open ? 'rotate-180' : ''}`}
          aria-hidden="true"
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 lg:block lg:max-h-none lg:opacity-100 ${
          open ? 'max-h-[640px] opacity-100' : 'max-h-0 opacity-0 lg:max-h-none'
        }`}
      >
        <div className="pb-1 pt-3 lg:pb-0 lg:pt-4">{children}</div>
      </div>
    </div>
  );
}

function FooterLinkList({ links, onOpenEnquiry }) {
  return (
    <ul className="space-y-2.5">
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
      <ul className="space-y-2.5">
        <li>
          <Link
            to="/shop/categories"
            className="text-sm text-slate-400 transition-colors hover:text-white"
          >
            Browse Categories
          </Link>
        </li>
      </ul>
    );
  }

  return (
    <ul className="space-y-2.5">
      <li>
        <Link
          to="/shop/categories"
          className="text-sm font-medium text-solar-300 transition-colors hover:text-white"
        >
          All Categories
        </Link>
      </li>
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
  const apiLogo = siteMediaResponse?.data?.logo;
  const [logoSrc, setLogoSrc] = useState(apiLogo ?? '/logo.jpg');
  const [logoError, setLogoError] = useState(false);

  useEffect(() => {
    if (apiLogo) {
      setLogoSrc(apiLogo);
      setLogoError(false);
    }
  }, [apiLogo]);

  const handleLogoError = () => {
    if (logoSrc !== '/logo.jpg') {
      setLogoSrc('/logo.jpg');
      return;
    }

    setLogoError(true);
  };

  const handleOpenEnquiry = (enquiryType) => {
    openEnquiryModal({ enquiryType });
  };

  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="border-b border-white/8 bg-slate-800/40">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
          <div className="flex flex-col gap-5 rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:flex-row sm:items-center sm:justify-between sm:p-7">
            <div className="min-w-0">
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
              className="min-h-[44px] shrink-0 rounded-xl"
            >
              Get Directions
            </Button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-14">
        <div className="grid gap-2 lg:grid-cols-12 lg:gap-10">
          <div className="pb-4 lg:col-span-4 lg:pb-0">
            <Link to="/" className="inline-flex items-center">
              {!logoError ? (
                <span className="inline-flex rounded-xl bg-white px-3 py-2.5 shadow-sm ring-1 ring-white/10">
                  <img
                    src={logoSrc}
                    alt="HANS Solar Energy"
                    className="h-9 w-auto max-w-[150px] object-contain sm:h-10"
                    onError={handleLogoError}
                  />
                </span>
              ) : (
                <span className="text-lg font-bold text-white sm:text-xl">
                  HANS Solar Energy
                </span>
              )}
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-400">
              HANS Solar delivers trusted solar products and complete energy
              solutions for homes, businesses and industries — powering a cleaner,
              brighter future.
            </p>
            <a
              href={`tel:+91${contactInfo.phone}`}
              className="mt-4 inline-flex min-h-[44px] items-center gap-2 text-sm font-medium text-slate-300 transition-colors hover:text-white"
            >
              <Phone className="h-4 w-4 shrink-0 text-solar-400" />
              {contactInfo.phoneDisplay}
            </a>
          </div>

          <div className="lg:col-span-2">
            <FooterCollapsibleSection title="Quick Links" defaultOpen>
              <FooterLinkList links={quickLinks} onOpenEnquiry={handleOpenEnquiry} />
            </FooterCollapsibleSection>
          </div>

          <div className="lg:col-span-2">
            <FooterCollapsibleSection title="Products">
              <FooterCategories />
            </FooterCollapsibleSection>
          </div>

          <div className="lg:col-span-4">
            <FooterCollapsibleSection title="Contact & Support">
              <ul className="space-y-3">
                <li>
                  <a
                    href={`mailto:${contactInfo.email}`}
                    className="inline-flex items-start gap-3 text-sm text-slate-400 transition-colors hover:text-white"
                  >
                    <Mail className="mt-0.5 h-4 w-4 shrink-0 text-solar-400" />
                    <span className="break-all">{contactInfo.email}</span>
                  </a>
                </li>
                <li className="inline-flex items-start gap-3 text-sm text-slate-400">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-solar-400" />
                  <span className="leading-relaxed">{corporateOffice.address}</span>
                </li>
              </ul>

              <div className="mt-5 border-t border-white/8 pt-4">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                  Support
                </p>
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
            </FooterCollapsibleSection>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-4 border-t border-white/8 pt-6 sm:mt-10 sm:flex-row sm:items-center sm:justify-between sm:pt-8">
          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} HANS Solar. All rights reserved.
          </p>
          <div className="flex flex-wrap gap-x-4 gap-y-2">
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
