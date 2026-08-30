import { Search, X } from 'lucide-react';

export default function ProductSearchInput({
  value,
  onChange,
  onSubmit,
  onClear,
  placeholder = 'Search solar products...',
  className = '',
  inputClassName = '',
  size = 'default',
  variant = 'default',
  id = 'product-search',
}) {
  const isCompact = size === 'compact';
  const isShop = variant === 'shop';

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      onSubmit?.();
    }
  };

  return (
    <div className={`relative ${className}`}>
      <Search
        className={`pointer-events-none absolute top-1/2 -translate-y-1/2 text-solar-600 ${
          isCompact ? 'left-3 h-4 w-4' : isShop ? 'left-4 h-4 w-4' : 'left-4 h-4 w-4'
        }`}
        aria-hidden
      />
      <input
        id={id}
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        aria-label={placeholder}
        className={`w-full text-charcoal outline-none transition placeholder:text-gray-400 ${
          isShop
            ? 'h-12 rounded-xl border border-gray-200 bg-white py-3 pl-12 pr-12 text-sm shadow-sm focus:border-solar-400 focus:ring-2 focus:ring-solar-100 sm:text-base'
            : `rounded-full border border-gray-200 bg-white shadow-sm focus:border-solar-400 focus:ring-2 focus:ring-solar-100 ${
                isCompact ? 'h-10 py-2 pl-9 pr-9 text-sm' : 'h-12 py-3 pl-11 pr-11 text-sm sm:text-base'
              }`
        } ${inputClassName}`}
      />
      {value && (
        <button
          type="button"
          onClick={onClear}
          aria-label="Clear search"
          className={`absolute top-1/2 flex -translate-y-1/2 items-center justify-center rounded-full text-gray-400 transition hover:bg-gray-100 hover:text-charcoal ${
            isCompact ? 'right-2 h-7 w-7' : isShop ? 'right-2.5 h-8 w-8' : 'right-2 h-8 w-8'
          }`}
        >
          <X className={isCompact ? 'h-3.5 w-3.5' : 'h-4 w-4'} />
        </button>
      )}
    </div>
  );
}
