import { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { ChevronDown, Menu, X } from 'lucide-react';
import Button from '@/components/ui/Button';
import { navDropdowns, navLinks } from '@/constants/homeContent';

function NavDropdown({ label, items, mobile = false, onNavigate }) {
  const [open, setOpen] = useState(false);

  if (mobile) {
    return (
      <div className="border-b border-gray-100">
        <button
          type="button"
          className="flex w-full items-center justify-between py-3.5 text-left text-[15px] font-medium text-charcoal"
          onClick={() => setOpen((prev) => !prev)}
        >
          {label}
          <ChevronDown
            className={`h-4 w-4 text-charcoal-light transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          />
        </button>
        <div
          className={`overflow-hidden transition-all duration-300 ease-out ${
            open ? 'max-h-96 pb-3 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="space-y-0.5 pl-3">
            {items.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={onNavigate}
                className="block rounded-lg px-3 py-2.5 text-sm text-charcoal-light transition-colors hover:bg-solar-50 hover:text-solar-700"
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
        className="group flex items-center gap-1 px-3.5 py-2 text-[15px] font-medium text-charcoal transition-colors hover:text-solar-700"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
      >
        {label}
        <ChevronDown
          className={`h-3.5 w-3.5 text-charcoal-light transition-transform duration-200 group-hover:text-solar-600 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      <div
        className={`absolute left-1/2 top-full z-50 min-w-[280px] -translate-x-1/2 pt-3 transition-all duration-200 ease-out ${
          open
            ? 'pointer-events-auto translate-y-0 opacity-100'
            : 'pointer-events-none -translate-y-2 opacity-0'
        }`}
      >
        <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-xl shadow-gray-200/50">
          {items.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="block border-b border-gray-50 px-4 py-3 transition-colors last:border-b-0 hover:bg-solar-50"
            >
              <p className="text-sm font-semibold text-charcoal">{item.label}</p>
              <p className="mt-0.5 text-xs leading-relaxed text-charcoal-light">
                {item.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

const navLinkClass = ({ isActive }) =>
  [
    'relative px-3.5 py-2 text-[15px] font-medium transition-colors duration-200',
    'after:absolute after:bottom-0 after:left-3.5 after:right-3.5 after:h-0.5 after:rounded-full after:bg-solar-600 after:transition-transform after:duration-200',
    isActive
      ? 'text-solar-700 after:scale-x-100'
      : 'text-charcoal hover:text-solar-700 after:scale-x-0 hover:after:scale-x-100',
  ].join(' ');

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [logoError, setLogoError] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
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
      className={`sticky top-0 z-50 border-b bg-white transition-all duration-300 ${
        scrolled
          ? 'border-gray-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.06)]'
          : 'border-gray-100 shadow-[0_1px_3px_rgba(0,0,0,0.04)]'
      }`}
    >
      <div className="mx-auto grid h-20 max-w-7xl grid-cols-[auto_1fr_auto] items-center gap-4 px-4 sm:px-6 lg:px-8">
        {/* Logo — left */}
        <Link to="/" className="flex shrink-0 items-center">
          {!logoError ? (
            <img
              src="/logo.jpg"
              alt="HANS Solar"
              className="h-11 w-auto max-w-[150px] object-contain object-left"
              onError={() => setLogoError(true)}
            />
          ) : (
            <span className="text-xl font-bold tracking-tight text-solar-700">
              HANS Solar
            </span>
          )}
        </Link>

        {/* Navigation — center (desktop) */}
        <nav className="hidden items-center justify-center gap-0.5 lg:flex">
          {navLinks.map(({ label, path }) => (
            <NavLink key={path} to={path} end={path === '/'} className={navLinkClass}>
              {label}
            </NavLink>
          ))}
          {navDropdowns.map((dropdown) => (
            <NavDropdown key={dropdown.label} {...dropdown} />
          ))}
        </nav>

        {/* CTA — right (desktop) */}
        <div className="hidden justify-end lg:flex">
          <Button
            to="/distributor"
            size="sm"
            className="shadow-sm shadow-solar-600/25 transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-md hover:shadow-solar-600/30"
          >
            Become a Distributor
          </Button>
        </div>

        {/* Hamburger — mobile */}
        <button
          type="button"
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          className="ml-auto flex h-10 w-10 items-center justify-center rounded-lg text-charcoal transition-colors hover:bg-gray-50 lg:hidden"
          onClick={() => setMobileOpen((prev) => !prev)}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <>
          <button
            type="button"
            aria-label="Close menu overlay"
            className="fixed inset-0 top-20 z-40 bg-charcoal/40 backdrop-blur-[2px] lg:hidden"
            onClick={closeMobile}
          />
          <div className="fixed left-0 right-0 top-20 z-50 max-h-[calc(100vh-5rem)] overflow-y-auto border-b border-gray-200 bg-white px-5 py-3 shadow-xl lg:hidden">
            {navLinks.map(({ label, path }) => (
              <Link
                key={path}
                to={path}
                onClick={closeMobile}
                className="block border-b border-gray-100 py-3.5 text-[15px] font-medium text-charcoal transition-colors hover:text-solar-700"
              >
                {label}
              </Link>
            ))}
            {navDropdowns.map((dropdown) => (
              <NavDropdown
                key={dropdown.label}
                {...dropdown}
                mobile
                onNavigate={closeMobile}
              />
            ))}
            <div className="pt-5 pb-3">
              <Button
                to="/distributor"
                className="w-full shadow-sm shadow-solar-600/25"
                onClick={closeMobile}
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
