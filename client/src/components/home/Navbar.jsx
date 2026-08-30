import { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { ChevronDown, Layers, Menu, X } from 'lucide-react';
import Button from '@/components/ui/Button';
import ProductSearchInput from '@/components/shop/ProductSearchInput';
import useProductSearch from '@/hooks/useProductSearch';
import { navDropdowns, navLinks } from '@/constants/homeContent';
import { useGetPublicCategoriesQuery } from '@/services/categoriesApi';
import { useGetSiteMediaQuery } from '@/services/siteMediaApi';
import { useEnquiryModal } from '@/context/EnquiryModalContext';

function NavDropdown({ label, items, mobile = false, onNavigate }) {
  const [open, setOpen] = useState(false);

  if (mobile) {
    return (
      <div className="border-b border-slate-100">
        <button
          type="button"
          className="flex w-full items-center justify-between py-3.5 text-left text-[15px] font-medium text-slate-800"
          onClick={() => setOpen((prev) => !prev)}
        >
          {label}
          <ChevronDown
            className={`h-4 w-4 text-slate-500 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          />
        </button>
        <div
          className={`overflow-hidden transition-all duration-300 ease-out ${
            open ? 'max-h-96 pb-3 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="max-h-72 space-y-0.5 overflow-y-auto pl-3">
            {items.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={onNavigate}
                className="block rounded-lg px-3 py-2.5 text-sm text-slate-600 transition-colors hover:bg-solar-50 hover:text-solar-700"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        className="group flex items-center gap-1 rounded-lg px-3 py-2 text-[15px] font-medium text-slate-700 transition-colors hover:bg-slate-50 hover:text-solar-700"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
      >
        {label}
        <ChevronDown
          className={`h-3.5 w-3.5 text-slate-400 transition-transform duration-200 group-hover:text-solar-600 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      <div
        className={`absolute left-1/2 top-full z-50 min-w-[280px] -translate-x-1/2 pt-2 transition-all duration-200 ease-out ${
          open
            ? 'pointer-events-auto translate-y-0 opacity-100'
            : 'pointer-events-none -translate-y-1 opacity-0'
        }`}
      >
        <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_16px_40px_rgba(15,23,42,0.1)]">
          <div className="max-h-80 overflow-y-auto">
            {items.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="block border-b border-slate-50 px-4 py-3.5 transition-colors last:border-b-0 hover:bg-solar-50/80"
              >
                <p className="text-sm font-semibold text-slate-800">{item.label}</p>
                {item.description && (
                  <p className="mt-0.5 text-xs leading-relaxed text-slate-500">
                    {item.description}
                  </p>
                )}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function CategoriesNavDropdown({ mobile = false, onNavigate }) {
  const [open, setOpen] = useState(false);
  const { data } = useGetPublicCategoriesQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const categories = data?.data?.categories ?? [];

  const items = [
    {
      label: 'View All Categories',
      path: '/shop',
      description: 'Browse the complete solar product catalogue',
    },
    ...categories.map((category) => ({
      label: category.name,
      path: `/shop/${category.slug}`,
      image: category.image,
    })),
  ];

  if (mobile) {
    return (
      <div className="border-b border-slate-100">
        <button
          type="button"
          className="flex w-full items-center justify-between py-3.5 text-left text-[15px] font-medium text-slate-800"
          onClick={() => setOpen((prev) => !prev)}
        >
          Categories
          <ChevronDown
            className={`h-4 w-4 text-slate-500 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          />
        </button>
        <div
          className={`overflow-hidden transition-all duration-300 ease-out ${
            open ? 'max-h-[28rem] pb-3 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="max-h-72 space-y-0.5 overflow-y-auto pl-3">
            {items.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={onNavigate}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-solar-50"
              >
                {item.image ? (
                  <img
                    src={item.image}
                    alt=""
                    className="h-9 w-9 rounded-lg object-cover ring-1 ring-slate-200/80"
                  />
                ) : (
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-solar-50 text-solar-700">
                    <Layers className="h-4 w-4" />
                  </span>
                )}
                <span className="text-sm font-medium text-slate-600 hover:text-solar-700">
                  {item.label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        className="group flex items-center gap-1 rounded-lg px-3 py-2 text-[15px] font-medium text-slate-700 transition-colors hover:bg-slate-50 hover:text-solar-700"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
      >
        Categories
        <ChevronDown
          className={`h-3.5 w-3.5 text-slate-400 transition-transform duration-200 group-hover:text-solar-600 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      <div
        className={`absolute left-1/2 top-full z-50 w-[min(92vw,360px)] -translate-x-1/2 pt-2 transition-all duration-200 ease-out ${
          open
            ? 'pointer-events-auto translate-y-0 opacity-100'
            : 'pointer-events-none -translate-y-1 opacity-0'
        }`}
      >
        <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_16px_40px_rgba(15,23,42,0.1)]">
          <div className="max-h-96 overflow-y-auto">
            {items.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="flex items-center gap-3 border-b border-slate-50 px-4 py-3.5 transition-colors last:border-b-0 hover:bg-solar-50/80"
              >
                {item.image ? (
                  <img
                    src={item.image}
                    alt=""
                    className="h-11 w-11 shrink-0 rounded-lg object-cover ring-1 ring-slate-200/80"
                  />
                ) : (
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-solar-50 text-solar-700">
                    <Layers className="h-5 w-5" />
                  </span>
                )}
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-800">
                    {item.label}
                  </p>
                  {item.description && (
                    <p className="mt-0.5 line-clamp-2 text-xs leading-relaxed text-slate-500">
                      {item.description}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const navLinkClass = ({ isActive }) =>
  [
    'relative rounded-lg px-3 py-2 text-[15px] font-medium transition-all duration-200',
    isActive
      ? 'bg-solar-50 text-solar-700'
      : 'text-slate-700 hover:bg-slate-50 hover:text-solar-700',
  ].join(' ');

export default function Navbar() {
  const { openEnquiryModal } = useEnquiryModal();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const { data: siteMediaResponse } = useGetSiteMediaQuery();
  const logoSrc = siteMediaResponse?.data?.logo ?? '/logo.jpg';
  const {
    inputValue,
    handleChange,
    handleSubmit,
    clearSearch,
  } = useProductSearch();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 12);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  const closeMobile = () => setMobileOpen(false);

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-all duration-300 ${
        scrolled
          ? 'border-slate-200/80 bg-white/95 shadow-[0_4px_24px_rgba(15,23,42,0.06)] backdrop-blur-md'
          : 'border-slate-100 bg-white'
      }`}
    >
      <div className="mx-auto grid h-[4.5rem] max-w-7xl grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 px-4 sm:gap-4 sm:px-6 lg:grid-cols-[auto_minmax(0,1fr)_auto] lg:gap-6 lg:px-8">
        <Link to="/" className="flex shrink-0 items-center">
          {!logoError ? (
            <img
              src={logoSrc}
              alt="HANS Solar"
              className="h-10 w-auto max-w-[148px] object-contain object-left sm:h-11"
              onError={() => setLogoError(true)}
            />
          ) : (
            <span className="text-xl font-bold tracking-tight text-solar-700">
              HANS Solar
            </span>
          )}
        </Link>

        <div className="flex min-w-0 items-center justify-center gap-2 lg:gap-4">
          <ProductSearchInput
            id="navbar-product-search-mobile"
            value={inputValue}
            onChange={handleChange}
            onSubmit={handleSubmit}
            onClear={clearSearch}
            size="compact"
            placeholder="Search products..."
            className="min-w-0 flex-1 lg:hidden"
          />

          <nav className="hidden shrink-0 items-center gap-0.5 lg:flex">
            {navLinks.map(({ label, path }) => (
              <NavLink key={path} to={path} end={path === '/'} className={navLinkClass}>
                {label}
              </NavLink>
            ))}
            <CategoriesNavDropdown />
            {navDropdowns.map((dropdown) => (
              <NavDropdown key={dropdown.label} {...dropdown} />
            ))}
          </nav>

          <ProductSearchInput
            id="navbar-product-search-desktop"
            value={inputValue}
            onChange={handleChange}
            onSubmit={handleSubmit}
            onClear={clearSearch}
            size="compact"
            placeholder="Search products..."
            className="hidden min-w-0 max-w-xs flex-1 lg:block xl:max-w-sm"
          />
        </div>

        <div className="hidden justify-end lg:flex">
          <Button
            size="sm"
            className="rounded-xl px-5 shadow-sm shadow-solar-600/20 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:shadow-solar-600/25"
            onClick={() => openEnquiryModal({ enquiryType: 'distributor' })}
          >
            Become a Distributor
          </Button>
        </div>

        <button
          type="button"
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200/80 text-slate-700 transition-colors hover:bg-slate-50 lg:hidden"
          onClick={() => setMobileOpen((prev) => !prev)}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {mobileOpen && (
        <>
          <button
            type="button"
            aria-label="Close menu overlay"
            className="fixed inset-0 top-[4.5rem] z-40 bg-slate-900/40 backdrop-blur-[2px] lg:hidden"
            onClick={closeMobile}
          />
          <div className="fixed left-0 right-0 top-[4.5rem] z-50 max-h-[calc(100vh-4.5rem)] overflow-y-auto border-b border-slate-200 bg-white px-5 py-4 shadow-xl lg:hidden">
            {navLinks.map(({ label, path }) => (
              <Link
                key={path}
                to={path}
                onClick={closeMobile}
                className="block border-b border-slate-100 py-3.5 text-[15px] font-medium text-slate-800 transition-colors hover:text-solar-700"
              >
                {label}
              </Link>
            ))}
            <CategoriesNavDropdown mobile onNavigate={closeMobile} />
            {navDropdowns.map((dropdown) => (
              <NavDropdown
                key={dropdown.label}
                {...dropdown}
                mobile
                onNavigate={closeMobile}
              />
            ))}
            <div className="pt-5 pb-2">
              <Button
                className="w-full rounded-xl shadow-sm shadow-solar-600/20"
                onClick={() => {
                  closeMobile();
                  openEnquiryModal({ enquiryType: 'distributor' });
                }}
              >
                Become a Distributor
              </Button>
            </div>
          </div>
        </>
      )}
    </header>
  );
}
