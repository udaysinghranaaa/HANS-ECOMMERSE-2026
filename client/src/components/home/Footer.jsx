import { useState } from 'react';
import { Link } from 'react-router-dom';

const quickLinks = [
  { label: 'Home', path: '/' },
  { label: 'Shop', path: '/shop' },
  { label: 'Contact', path: '/contact' },
  { label: 'Learn', path: '/learn/solar-buying-guide' },
  { label: 'Subsidy', path: '/subsidy/pm-surya-ghar' },
  { label: 'Become a Distributor', path: '/distributor' },
];

const productLinks = [
  { label: 'Solar Panels', path: '/shop/solar-panels' },
  { label: 'Inverters', path: '/shop/solar-inverters' },
  { label: 'Batteries', path: '/shop/solar-batteries' },
  { label: 'Solar Accessories', path: '/shop/solar-accessories' },
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

export default function Footer() {
  const [logoError, setLogoError] = useState(false);

  return (
    <footer className="bg-charcoal text-gray-300">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Link to="/" className="inline-flex items-center">
              {!logoError ? (
                <img
                  src="/logo.jpg"
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

          <FooterLinkList title="Quick Links" links={quickLinks} />
          <FooterLinkList title="Products" links={productLinks} />
          <FooterLinkList title="Support" links={supportLinks} />
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
