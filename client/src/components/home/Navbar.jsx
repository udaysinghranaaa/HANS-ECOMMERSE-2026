import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import {
  ArrowRight,
  ChevronDown,
  Grid3X3,
  Home,
  Layers,
  Mail,
  Menu,
  MessageCircle,
  Phone,
  Search,
  ShoppingBag,
  X,
} from 'lucide-react';
import Button from '@/components/ui/Button';
import ProductSearchInput from '@/components/shop/ProductSearchInput';
import useProductSearch from '@/hooks/useProductSearch';
import { contactInfo, navDropdowns, navLinks } from '@/constants/homeContent';
import { useGetPublicCategoriesQuery } from '@/services/categoriesApi';
import { useGetSiteMediaQuery } from '@/services/siteMediaApi';
import { useEnquiryModal } from '@/context/EnquiryModalContext';
import { lockBodyScroll, unlockBodyScroll } from '@/utils/bodyScrollLock';

const navLinkIcons = {
  Home,
  ShoppingBag,
  MessageCircle,
};

const navLinkClass = ({ isActive }) =>
  [
    'group relative inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2.5 text-[15px] font-medium transition-all duration-200 lg:gap-2 lg:px-4 lg:py-3 lg:text-[16px]',
    isActive
      ? 'text-solar-700'
      : 'text-slate-600 hover:bg-slate-50/80 hover:text-solar-700',
  ].join(' ');

function NavLinkIndicator({ isActive }) {
  return (
    <span
      className={`absolute inset-x-2 bottom-0 h-[2px] origin-center rounded-full bg-solar-600 transition-all duration-300 ease-out ${
        isActive
          ? 'scale-x-100 opacity-100'
          : 'scale-x-0 opacity-0 group-hover:scale-x-100 group-hover:opacity-70'
      }`}
      aria-hidden="true"
    />
  );
}

function NavIcon({ iconName, isActive }) {
  const Icon = navLinkIcons[iconName];

  if (!Icon) {
    return null;
  }

  return (
    <Icon
      className={`h-4 w-4 shrink-0 transition-all duration-200 ${
        isActive
          ? 'text-solar-600'
          : 'text-slate-400 group-hover:-translate-y-0.5 group-hover:text-solar-600'
      }`}
      aria-hidden="true"
    />
  );
}

function NavDropdown({ label, items, mobile = false, onNavigate }) {
  const [open, setOpen] = useState(false);

  if (mobile) {
    return (
      <div className="border-b border-slate-100/90">
        <button
          type="button"
          className="flex min-h-[48px] w-full items-center justify-between py-3 text-left text-[15px] font-medium text-slate-800"
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
                className="block min-h-[44px] rounded-lg px-3 py-2.5 text-sm text-slate-600 transition-colors hover:bg-solar-50 hover:text-solar-700"
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
        className="group relative flex items-center gap-1 rounded-lg px-3 py-2.5 text-[14px] font-medium text-slate-600 transition-colors duration-200 hover:text-solar-700 lg:text-[15px]"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
      >
        {label}
        <ChevronDown
          className={`h-3.5 w-3.5 text-slate-400 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:text-solar-600 ${open ? 'rotate-180' : ''}`}
        />
        <span
          className={`absolute inset-x-2 bottom-0 h-[2px] origin-center rounded-full bg-solar-600 transition-all duration-300 ease-out ${
            open
              ? 'scale-x-100 opacity-100'
              : 'scale-x-0 opacity-0 group-hover:scale-x-100 group-hover:opacity-70'
          }`}
          aria-hidden="true"
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

function ProductsNavMegaMenu() {
  const [open, setOpen] = useState(false);
  const { data } = useGetPublicCategoriesQuery();
  const categories = data?.data?.categories ?? [];

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <NavLink to="/shop/categories" end className={navLinkClass}>
        {({ isActive }) => (
          <>
            <Layers
              className={`h-4 w-4 shrink-0 transition-all duration-200 ${
                isActive
                  ? 'text-solar-600'
                  : 'text-slate-400 group-hover:-translate-y-0.5 group-hover:text-solar-600'
              }`}
              aria-hidden="true"
            />
            Products
            <ChevronDown
              className={`h-3.5 w-3.5 text-slate-400 transition-all duration-200 group-hover:text-solar-600 ${open ? 'rotate-180' : ''}`}
              aria-hidden="true"
            />
            <NavLinkIndicator isActive={isActive} />
          </>
        )}
      </NavLink>

      <div
        className={`absolute right-0 top-full z-50 pt-2 transition-all duration-200 ease-out ${
          open
            ? 'pointer-events-auto translate-y-0 opacity-100'
            : 'pointer-events-none -translate-y-1 opacity-0'
        }`}
      >
        <div className="flex w-[min(92vw,680px)] max-h-[min(70vh,480px)] flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_20px_50px_rgba(15,23,42,0.12)]">
          <div className="shrink-0 border-b border-slate-100 bg-gradient-to-r from-solar-50/80 via-white to-emerald-50/40 px-4 py-3.5">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm font-bold text-slate-900">Product Categories</p>
                <p className="text-xs text-slate-500">Browse our complete solar catalogue</p>
              </div>
              <Link
                to="/shop/categories"
                className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-solar-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-solar-700"
              >
                View All Categories
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          <div className="panel-scroll min-h-0 flex-1 overflow-y-auto overscroll-contain p-3">
            <div className="grid grid-cols-3 gap-2">
              <Link
                to="/shop/categories"
                className="group col-span-3 flex items-center gap-3 rounded-xl border border-solar-200 bg-gradient-to-r from-solar-50 to-emerald-50/60 p-3 transition-all duration-200 hover:border-solar-300 hover:shadow-md hover:shadow-solar-600/10 sm:col-span-1 sm:flex-col sm:items-start sm:p-3.5"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-solar-600 text-white shadow-sm transition group-hover:scale-105">
                  <Grid3X3 className="h-5 w-5" />
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-900 group-hover:text-solar-800">
                    All Categories
                  </p>
                  <p className="mt-0.5 hidden text-xs text-slate-500 sm:block">
                    View full catalogue
                  </p>
                </div>
              </Link>

              {categories.map((category) => (
                <Link
                  key={category.id}
                  to={`/shop/${category.slug}`}
                  className="group overflow-hidden rounded-xl border border-slate-100 bg-white transition-all duration-200 hover:-translate-y-0.5 hover:border-solar-200 hover:shadow-md hover:shadow-solar-600/10"
                >
                  <div className="aspect-[4/3] overflow-hidden bg-slate-100">
                    {category.image ? (
                      <img
                        src={category.image}
                        alt=""
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-gradient-to-br from-solar-50 to-emerald-50">
                        <Layers className="h-6 w-6 text-solar-600/50" />
                      </div>
                    )}
                  </div>
                  <p className="truncate px-2.5 py-2 text-xs font-semibold text-slate-800 group-hover:text-solar-700">
                    {category.name}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TopContactBar({ onBookSurvey }) {
  return (
    <div className="border-b border-slate-200/70 bg-slate-50/95">
      <div className="mx-auto flex h-11 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:h-12 lg:px-8">
        <div className="flex min-w-0 items-center gap-3 text-xs font-medium text-slate-600">
          <a
            href={`tel:+91${contactInfo.phone}`}
            className="inline-flex items-center gap-1.5 transition-colors hover:text-solar-700"
          >
            <Phone className="h-3.5 w-3.5 shrink-0 text-solar-600" aria-hidden="true" />
            <span className="truncate">{contactInfo.phoneDisplay}</span>
          </a>
          <span className="hidden h-3.5 w-px shrink-0 bg-slate-300 md:block" aria-hidden="true" />
          <a
            href={`mailto:${contactInfo.email}`}
            className="hidden min-w-0 items-center gap-1.5 transition-colors hover:text-solar-700 md:inline-flex"
          >
            <Mail className="h-3.5 w-3.5 shrink-0 text-solar-600" aria-hidden="true" />
            <span className="truncate">{contactInfo.email}</span>
          </a>
        </div>

        <button
          type="button"
          onClick={onBookSurvey}
          className="shrink-0 rounded-lg bg-solar-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm shadow-solar-600/20 transition-all duration-200 hover:bg-solar-700 hover:shadow-md hover:shadow-solar-600/25"
        >
          Book FREE Site Survey
        </button>
      </div>
    </div>
  );
}

function DesktopNavbar({
  scrolled,
  logoSrc,
  logoError,
  setLogoError,
  inputValue,
  handleChange,
  handleSubmit,
  clearSearch,
  onBookSurvey,
  onDistributor,
}) {
  return (
    <div className="hidden lg:block">
      <TopContactBar onBookSurvey={onBookSurvey} />

      <header
        className={`sticky top-0 z-50 transition-all duration-300 ease-out ${
          scrolled
            ? 'border-b border-slate-200/60 bg-white/92 shadow-[0_8px_32px_rgba(15,23,42,0.07)] backdrop-blur-md'
            : 'bg-gradient-to-b from-slate-50/80 to-white/50'
        }`}
      >
        <div className="mx-auto max-w-7xl px-3 py-3 sm:px-4 lg:px-6">
          <div
            className={`rounded-2xl border bg-white transition-all duration-300 ease-out ${
              scrolled
                ? 'border-slate-200/90 shadow-[0_12px_40px_rgba(15,23,42,0.09)]'
                : 'border-slate-200/70 shadow-[0_8px_30px_rgba(15,23,42,0.06)]'
            }`}
          >
            <div className="flex h-[4.25rem] items-center gap-3 px-3 sm:h-[4.5rem] sm:gap-4 sm:px-5 lg:px-6">
              <Link to="/" className="flex shrink-0 items-center">
                {!logoError ? (
                  <img
                    src={logoSrc}
                    alt="HANS Solar Energy"
                    className="h-11 w-auto max-w-[156px] object-contain object-left sm:h-12 sm:max-w-[172px] lg:h-[3.25rem] lg:max-w-[188px]"
                    onError={() => setLogoError(true)}
                  />
                ) : (
                  <span className="text-lg font-bold tracking-tight text-solar-700 sm:text-xl">
                    HANS Solar
                  </span>
                )}
              </Link>

              <div className="flex min-w-0 flex-1 items-center justify-end gap-0.5 xl:gap-1">
                <nav className="flex shrink-0 items-center">
                  {navLinks.map(({ label, path, icon }) => (
                    <NavLink key={path} to={path} end={path === '/'} className={navLinkClass}>
                      {({ isActive }) => (
                        <>
                          <NavIcon iconName={icon} isActive={isActive} />
                          {label}
                          <NavLinkIndicator isActive={isActive} />
                        </>
                      )}
                    </NavLink>
                  ))}
                  <ProductsNavMegaMenu />
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
                  className="ml-2 hidden w-44 xl:block 2xl:w-52"
                />

                <Button
                  size="sm"
                  className="ml-2 shrink-0 rounded-xl px-4 shadow-sm shadow-solar-600/20 transition-all duration-200 hover:-translate-y-px hover:shadow-md hover:shadow-solar-600/25 xl:ml-3 xl:px-5"
                  onClick={onDistributor}
                >
                  Become a Distributor
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}

function MobileNavbar({
  scrolled,
  logoSrc,
  logoError,
  setLogoError,
  inputValue,
  handleChange,
  handleSubmit,
  clearSearch,
  onBookSurvey,
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!menuOpen) {
      return undefined;
    }

    lockBodyScroll();

    return () => {
      unlockBodyScroll();
    };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  const toggleSearch = () => {
    setSearchOpen((prev) => !prev);
    if (menuOpen) {
      setMenuOpen(false);
    }
  };

  const openMenu = () => {
    setMenuOpen(true);
    setSearchOpen(false);
  };

  const handleBookSurvey = () => {
    closeMenu();
    onBookSurvey();
  };

  return (
    <div className="lg:hidden">
      <header
        className={`sticky top-0 z-50 border-b bg-white transition-all duration-300 ease-out ${
          scrolled
            ? 'border-slate-200/80 shadow-[0_4px_20px_rgba(15,23,42,0.08)] backdrop-blur-md'
            : 'border-slate-100'
        }`}
      >
        <div className="mx-auto flex h-[3.75rem] max-w-7xl items-center gap-3 px-4">
          <Link to="/" className="flex min-w-0 shrink items-center">
            {!logoError ? (
              <img
                src={logoSrc}
                alt="HANS Solar Energy"
                className="h-10 w-auto max-w-[142px] object-contain object-left sm:max-w-[150px]"
                onError={() => setLogoError(true)}
              />
            ) : (
              <span className="truncate text-base font-bold text-solar-700">
                HANS Solar
              </span>
            )}
          </Link>

          <div className="ml-auto flex items-center gap-1.5">
            <button
              type="button"
              aria-label={searchOpen ? 'Close search' : 'Open search'}
              aria-expanded={searchOpen}
              className={`flex h-11 w-11 items-center justify-center rounded-xl transition-all duration-200 ${
                searchOpen
                  ? 'bg-solar-50 text-solar-700 ring-1 ring-solar-200'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-solar-700'
              }`}
              onClick={toggleSearch}
            >
              {searchOpen ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
            </button>
            <button
              type="button"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              className={`flex h-11 w-11 items-center justify-center rounded-xl transition-all duration-200 ${
                menuOpen
                  ? 'bg-solar-50 text-solar-700 ring-1 ring-solar-200'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-solar-700'
              }`}
              onClick={() => (menuOpen ? closeMenu() : openMenu())}
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <div
          className={`overflow-hidden border-t border-slate-100 transition-all duration-300 ease-out ${
            searchOpen ? 'max-h-20 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="px-4 py-2.5">
            <ProductSearchInput
              id="navbar-product-search-mobile"
              value={inputValue}
              onChange={handleChange}
              onSubmit={() => {
                handleSubmit();
                setSearchOpen(false);
              }}
              onClear={clearSearch}
              size="compact"
              placeholder="Search products..."
            />
          </div>
        </div>
      </header>

      <div
        className={`fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-[2px] transition-opacity duration-300 ${
          menuOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
        aria-hidden={!menuOpen}
        onClick={closeMenu}
      />

      <div
        className={`fixed inset-y-0 right-0 z-50 flex w-[min(100vw-2rem,20rem)] flex-col border-l border-slate-200 bg-white shadow-2xl transition-transform duration-300 ease-out ${
          menuOpen
            ? 'translate-x-0'
            : 'pointer-events-none translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3.5">
          <p className="text-sm font-semibold text-slate-800">Menu</p>
          <button
            type="button"
            aria-label="Close menu"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-600 transition-colors hover:bg-slate-100"
            onClick={closeMenu}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-3">
          <div className="mb-4 space-y-2.5 rounded-xl border border-slate-100 bg-slate-50/80 p-3">
            <a
              href={`tel:+91${contactInfo.phone}`}
              className="flex min-h-[44px] items-center gap-2.5 text-sm font-medium text-slate-700"
            >
              <Phone className="h-4 w-4 shrink-0 text-solar-600" />
              {contactInfo.phoneDisplay}
            </a>
            <a
              href={`mailto:${contactInfo.email}`}
              className="flex min-h-[44px] items-center gap-2.5 text-sm font-medium text-slate-700"
            >
              <Mail className="h-4 w-4 shrink-0 text-solar-600" />
              <span className="break-all">{contactInfo.email}</span>
            </a>
          </div>

          {navLinks.map(({ label, path, icon }) => {
            const Icon = navLinkIcons[icon];

            return (
              <Link
                key={path}
                to={path}
                onClick={closeMenu}
                className="flex min-h-[48px] items-center gap-2.5 border-b border-slate-100 py-3 text-[15px] font-medium text-slate-800 transition-colors active:bg-solar-50"
              >
                {Icon && <Icon className="h-4 w-4 text-solar-600" aria-hidden="true" />}
                {label}
              </Link>
            );
          })}
          <Link
            to="/shop/categories"
            onClick={closeMenu}
            className="flex min-h-[48px] items-center gap-2.5 border-b border-slate-100 py-3 text-[15px] font-medium text-slate-800 transition-colors active:bg-solar-50"
          >
            <Layers className="h-4 w-4 text-solar-600" aria-hidden="true" />
            Products
          </Link>
          {navDropdowns.map((dropdown) => (
            <NavDropdown
              key={dropdown.label}
              {...dropdown}
              mobile
              onNavigate={closeMenu}
            />
          ))}
        </div>

        <div className="border-t border-slate-100 p-4">
          <Button
            variant="secondary"
            className="w-full rounded-xl"
            onClick={handleBookSurvey}
          >
            Book FREE Site Survey
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function Navbar() {
  const { openEnquiryModal } = useEnquiryModal();
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

  const handleBookSurvey = () => {
    openEnquiryModal({ enquiryType: 'quote', formSource: 'siteSurvey' });
  };

  const handleDistributor = () => {
    openEnquiryModal({ enquiryType: 'distributor' });
  };

  const sharedProps = {
    scrolled,
    logoSrc,
    logoError,
    setLogoError,
    inputValue,
    handleChange,
    handleSubmit,
    clearSearch,
    onBookSurvey: handleBookSurvey,
  };

  return (
    <>
      <DesktopNavbar {...sharedProps} onDistributor={handleDistributor} />
      <MobileNavbar {...sharedProps} />
    </>
  );
}
