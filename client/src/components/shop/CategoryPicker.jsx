import { useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Check,
  ChevronDown,
  Grid3X3,
  Layers,
  Package,
  X,
} from 'lucide-react';
import { lockBodyScroll, unlockBodyScroll } from '@/utils/bodyScrollLock';

const ALL_CATEGORIES_SLUG = '__all_categories__';

const buildShopLink = (path, searchParams) => {
  const query = searchParams.get('q');

  if (!query) {
    return path;
  }

  return `${path}?q=${encodeURIComponent(query)}`;
};

function CategoryGridItem({ item, isActive, onSelect }) {
  const showAllCategoriesTile = item.slug === ALL_CATEGORIES_SLUG;
  const showAllProductsTile = item.slug === null && item.isAllProducts;

  const content = (
    <>
      <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-slate-100">
        {showAllCategoriesTile ? (
          <div className="flex h-full flex-col items-center justify-center gap-1.5 bg-gradient-to-br from-solar-600 to-emerald-600 px-2 text-white">
            <Grid3X3 className="h-7 w-7 sm:h-8 sm:w-8" aria-hidden="true" />
            <span className="text-[10px] font-bold uppercase tracking-wide sm:text-[11px]">
              Browse All
            </span>
          </div>
        ) : showAllProductsTile ? (
          <div className="flex h-full flex-col items-center justify-center gap-1.5 bg-gradient-to-br from-slate-100 to-solar-50 px-2">
            <Package className="h-7 w-7 text-solar-700 sm:h-8 sm:w-8" aria-hidden="true" />
            <span className="text-[10px] font-bold uppercase tracking-wide text-solar-800 sm:text-[11px]">
              All Products
            </span>
          </div>
        ) : item.image ? (
          <img
            src={item.image}
            alt=""
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-solar-50 to-emerald-50">
            <Layers className="h-8 w-8 text-solar-600/50" />
          </div>
        )}
        {isActive ? (
          <span className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-solar-600 text-white shadow-sm">
            <Check className="h-3.5 w-3.5" aria-hidden="true" />
          </span>
        ) : null}
      </div>
      <p className="mt-2 line-clamp-2 text-sm font-semibold leading-snug text-charcoal group-hover:text-solar-700">
        {item.label}
      </p>
    </>
  );

  return (
    <Link
      to={item.path}
      onClick={onSelect}
      className={`group rounded-2xl border p-2.5 transition-all duration-200 active:scale-[0.98] sm:p-3 ${
        isActive
          ? 'border-solar-300 bg-solar-50/80 ring-1 ring-solar-200'
          : showAllCategoriesTile
            ? 'border-solar-200 bg-solar-50/40 hover:border-solar-300 hover:bg-solar-50/70 hover:shadow-sm'
            : 'border-slate-200 bg-white hover:border-solar-200 hover:bg-solar-50/40 hover:shadow-sm'
      }`}
    >
      {content}
    </Link>
  );
}

export default function CategoryPicker({
  categories = [],
  activeCategorySlug,
}) {
  const [open, setOpen] = useState(false);
  const [isMobileSheet, setIsMobileSheet] = useState(false);
  const panelRef = useRef(null);
  const triggerRef = useRef(null);
  const [searchParams] = useSearchParams();

  const activeCategory = categories.find(
    (category) => category.slug === activeCategorySlug,
  );

  const items = [
    {
      label: 'All Categories',
      path: buildShopLink('/shop/categories', searchParams),
      slug: ALL_CATEGORIES_SLUG,
    },
    {
      label: 'All Products',
      path: buildShopLink('/shop', searchParams),
      slug: null,
      isAllProducts: true,
    },
    ...categories.map((category) => ({
      label: category.name,
      path: buildShopLink(`/shop/${category.slug}`, searchParams),
      slug: category.slug,
      image: category.image,
    })),
  ];

  const closePicker = () => setOpen(false);

  useEffect(() => {
    const media = window.matchMedia('(max-width: 767px)');
    const syncViewport = () => setIsMobileSheet(media.matches);
    syncViewport();
    media.addEventListener('change', syncViewport);
    return () => media.removeEventListener('change', syncViewport);
  }, []);

  useEffect(() => {
    if (!open || isMobileSheet) {
      return undefined;
    }

    const handlePointerDown = (event) => {
      if (
        panelRef.current?.contains(event.target) ||
        triggerRef.current?.contains(event.target)
      ) {
        return;
      }

      closePicker();
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        closePicker();
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [open, isMobileSheet]);

  useEffect(() => {
    if (!open || !isMobileSheet) {
      return undefined;
    }

    lockBodyScroll();

    return () => {
      unlockBodyScroll();
    };
  }, [open, isMobileSheet]);

  return (
    <div className="relative">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wider text-charcoal-light">
            Current view
          </p>
          <p className="mt-0.5 truncate text-base font-bold text-charcoal sm:text-lg">
            {activeCategory?.name ?? 'All Products'}
          </p>
        </div>

        <button
          ref={triggerRef}
          type="button"
          aria-expanded={open}
          aria-haspopup="dialog"
          onClick={() => setOpen((prev) => !prev)}
          className={`inline-flex min-h-[44px] w-full shrink-0 items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition-all duration-200 sm:w-auto ${
            open
              ? 'border-solar-300 bg-solar-50 text-solar-800 shadow-sm'
              : 'border-slate-200 bg-white text-charcoal hover:border-solar-200 hover:bg-solar-50/60'
          }`}
        >
          <Grid3X3 className="h-4 w-4 text-solar-600" aria-hidden="true" />
          All Categories
          {categories.length > 0 ? (
            <span className="rounded-full bg-solar-100 px-2 py-0.5 text-[11px] font-bold text-solar-700">
              {categories.length}
            </span>
          ) : null}
          <ChevronDown
            className={`h-4 w-4 text-slate-500 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
            aria-hidden="true"
          />
        </button>
      </div>

      {isMobileSheet ? (
        <>
          <div
            className={`fixed inset-0 z-40 bg-slate-900/45 backdrop-blur-[2px] transition-opacity duration-300 ${
              open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
            }`}
            aria-hidden={!open}
            onClick={closePicker}
          />

          <div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label="All categories"
            className={`fixed inset-x-0 bottom-0 z-50 flex max-h-[min(88vh,720px)] flex-col rounded-t-3xl border border-slate-200 bg-white shadow-[0_-16px_48px_rgba(15,23,42,0.14)] transition-transform duration-300 ease-out ${
              open ? 'translate-y-0' : 'pointer-events-none translate-y-full'
            }`}
          >
            <div className="flex shrink-0 items-center justify-between border-b border-slate-100 px-4 py-3.5">
              <div>
                <p className="text-sm font-bold text-charcoal">All Categories</p>
                <p className="text-xs text-charcoal-light">
                  {categories.length > 0
                    ? `${categories.length} categories available`
                    : 'Select a category to browse'}
                </p>
              </div>
              <button
                type="button"
                aria-label="Close categories"
                onClick={closePicker}
                className="flex h-9 w-9 items-center justify-center rounded-full text-slate-600 transition hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="panel-scroll min-h-0 flex-1 overflow-x-hidden overflow-y-auto overscroll-contain px-4 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {items.map((item) => (
                  <CategoryGridItem
                    key={item.slug ?? item.path}
                    item={item}
                    isActive={
                      item.slug === ALL_CATEGORIES_SLUG
                        ? false
                        : item.slug
                          ? activeCategorySlug === item.slug
                          : !activeCategorySlug
                    }
                    onSelect={closePicker}
                  />
                ))}
              </div>
            </div>
          </div>
        </>
      ) : (
        <div
          ref={panelRef}
          className={`absolute right-0 top-[calc(100%+0.5rem)] z-50 w-[min(100vw-2rem,560px)] transition-all duration-200 ease-out sm:left-auto sm:right-0 ${
            open
              ? 'pointer-events-auto translate-y-0 opacity-100'
              : 'pointer-events-none -translate-y-1 opacity-0'
          }`}
        >
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_20px_50px_rgba(15,23,42,0.12)]">
            <div className="border-b border-slate-100 px-4 py-3">
              <p className="text-sm font-bold text-charcoal">All Categories</p>
              <p className="text-xs text-charcoal-light">
                {categories.length > 0
                  ? `Browse all ${categories.length} product categories`
                  : 'Choose a category to filter products'}
              </p>
            </div>

            <div className="panel-scroll max-h-[min(65vh,520px)] overflow-y-auto overscroll-contain p-3">
              <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                {items.map((item) => (
                  <CategoryGridItem
                    key={item.slug ?? item.path}
                    item={item}
                    isActive={
                      item.slug === ALL_CATEGORIES_SLUG
                        ? false
                        : item.slug
                          ? activeCategorySlug === item.slug
                          : !activeCategorySlug
                    }
                    onSelect={closePicker}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
