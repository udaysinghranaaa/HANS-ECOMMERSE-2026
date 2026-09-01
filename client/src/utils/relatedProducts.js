const sortByRelevance = (a, b) => {
  if (Boolean(b.isTrending) !== Boolean(a.isTrending)) {
    return Number(b.isTrending) - Number(a.isTrending);
  }

  const bUpdated = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
  const aUpdated = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;

  return bUpdated - aUpdated;
};

export const pickRelatedProducts = (products, currentProduct, limit = 4) => {
  if (!currentProduct?.id || !Array.isArray(products)) {
    return [];
  }

  const candidates = products.filter(
    (product) => product?.id && product.id !== currentProduct.id,
  );

  if (candidates.length === 0) {
    return [];
  }

  const sameCategory = candidates
    .filter((product) => product.categoryId === currentProduct.categoryId)
    .sort(sortByRelevance);

  const otherCategories = candidates
    .filter((product) => product.categoryId !== currentProduct.categoryId)
    .sort(sortByRelevance);

  return [...sameCategory, ...otherCategories].slice(0, limit);
};
