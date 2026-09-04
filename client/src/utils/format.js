export const formatCurrency = (amount) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);

export const getDiscountedPrice = (price, discountPercent) =>
  Math.round(Number(price) * (1 - Number(discountPercent) / 100));

export const getNormalProductPricing = (product) => {
  if (product.isOnSale && product.saleDiscountPercent > 0) {
    return {
      originalPrice: product.price,
      salePrice: getDiscountedPrice(product.price, product.saleDiscountPercent),
      discountPercent: product.saleDiscountPercent,
      type: 'normal',
    };
  }

  return {
    originalPrice: product.price,
    salePrice: product.price,
    discountPercent: 0,
    type: null,
  };
};

export const getFestivalProductPricing = (product, festivalDiscountPercent) => ({
  originalPrice: product.price,
  salePrice: getDiscountedPrice(product.price, festivalDiscountPercent),
  discountPercent: festivalDiscountPercent,
  type: 'festival',
});

export const getEffectiveProductPricing = (product) => {
  if (product.activeFestivalDiscount) {
    return getFestivalProductPricing(product, product.activeFestivalDiscount);
  }

  return getNormalProductPricing(product);
};

export const getAmountSaved = (pricing) =>
  pricing.discountPercent > 0 ? pricing.originalPrice - pricing.salePrice : 0;

export const getGstPricing = (basePrice, gstEnabled, gstPercentage) => {
  const price = Number(basePrice) || 0;
  const enabled = Boolean(gstEnabled);
  const percent =
    enabled && Number.isFinite(Number(gstPercentage))
      ? Number(gstPercentage)
      : 0;
  const gstAmount = enabled ? (price * percent) / 100 : 0;

  return {
    gstEnabled: enabled,
    gstPercentage: enabled ? percent : 0,
    gstAmount,
    finalPrice: price + gstAmount,
  };
};

export const stripMediaUrl = (url) => {
  if (!url) {
    return '';
  }

  if (url.startsWith('/uploads/')) {
    return url.split('?')[0];
  }

  if (url.includes('res.cloudinary.com')) {
    const cleanUrl = url.split('?')[0];
    return cleanUrl.replace(/\/upload\/(?:(?!v\d+\/)[^/]+\/)+/, '/upload/');
  }

  try {
    const parsed = new URL(url);
    return parsed.pathname.startsWith('/uploads/')
      ? parsed.pathname
      : `${parsed.origin}${parsed.pathname}`;
  } catch {
    return url.split('?')[0];
  }
};
