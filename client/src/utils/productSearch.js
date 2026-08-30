const normalizeWhitespace = (value) =>
  String(value ?? '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ');

export const normalizeSearchQuery = (value) => normalizeWhitespace(value);

export const getProductSearchText = (product) => {
  const specificationValues = product.specifications
    ? Object.values(product.specifications)
    : [];

  return [
    product.name,
    product.description,
    product.category?.name,
    product.warranty,
    ...specificationValues,
  ]
    .filter(Boolean)
    .map((entry) => String(entry).toLowerCase())
    .join(' ');
};

export const matchesProductSearch = (product, query) => {
  const normalizedQuery = normalizeSearchQuery(query);

  if (!normalizedQuery) {
    return true;
  }

  const haystack = getProductSearchText(product);
  const terms = normalizedQuery.split(' ');

  return terms.every((term) => haystack.includes(term));
};

export const filterProductsBySearch = (products, query) => {
  const normalizedQuery = normalizeSearchQuery(query);

  if (!normalizedQuery) {
    return products;
  }

  return products.filter((product) => matchesProductSearch(product, normalizedQuery));
};
