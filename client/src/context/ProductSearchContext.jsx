import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { normalizeSearchQuery } from '@/utils/productSearch';

const DEBOUNCE_MS = 300;

const ProductSearchContext = createContext(null);

export function ProductSearchProvider({ children }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const debounceRef = useRef(null);

  const urlQuery = searchParams.get('q') ?? '';
  const query = normalizeSearchQuery(urlQuery);

  const [inputValue, setInputValue] = useState(urlQuery);
  const [syncedUrlQuery, setSyncedUrlQuery] = useState(urlQuery);

  if (urlQuery !== syncedUrlQuery) {
    setSyncedUrlQuery(urlQuery);
    setInputValue(urlQuery);
  }

  const applyQueryToUrl = useCallback(
    (value, { replace = true } = {}) => {
      const trimmed = normalizeSearchQuery(value);
      const nextParams = new URLSearchParams(searchParams);

      if (trimmed) {
        nextParams.set('q', trimmed);
      } else {
        nextParams.delete('q');
      }

      setSearchParams(nextParams, { replace });
    },
    [searchParams, setSearchParams],
  );

  const handleChange = useCallback(
    (value) => {
      setInputValue(value);

      if (!location.pathname.startsWith('/shop')) {
        return;
      }

      if (debounceRef.current) {
        window.clearTimeout(debounceRef.current);
      }

      debounceRef.current = window.setTimeout(() => {
        applyQueryToUrl(value);
      }, DEBOUNCE_MS);
    },
    [applyQueryToUrl, location.pathname],
  );

  const handleSubmit = useCallback(() => {
    if (debounceRef.current) {
      window.clearTimeout(debounceRef.current);
    }

    const trimmed = normalizeSearchQuery(inputValue);
    const nextPath = location.pathname.startsWith('/shop') ? location.pathname : '/shop';
    const params = new URLSearchParams();

    if (trimmed) {
      params.set('q', trimmed);
    }

    const nextUrl = params.toString() ? `${nextPath}?${params.toString()}` : nextPath;
    navigate(nextUrl);
  }, [inputValue, location.pathname, navigate]);

  const clearSearch = useCallback(() => {
    if (debounceRef.current) {
      window.clearTimeout(debounceRef.current);
    }

    setInputValue('');

    if (location.pathname.startsWith('/shop')) {
      applyQueryToUrl('');
      return;
    }

    if (query) {
      navigate(location.pathname, { replace: true });
    }
  }, [applyQueryToUrl, location.pathname, navigate, query]);

  const value = {
    query,
    inputValue,
    handleChange,
    handleSubmit,
    clearSearch,
    hasQuery: Boolean(query),
  };

  return (
    <ProductSearchContext.Provider value={value}>
      {children}
    </ProductSearchContext.Provider>
  );
}

export default function useProductSearch() {
  const context = useContext(ProductSearchContext);

  if (!context) {
    throw new Error('useProductSearch must be used within ProductSearchProvider');
  }

  return context;
}
