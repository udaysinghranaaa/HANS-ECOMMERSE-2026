export const formatCurrency = (amount) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);

export const stripMediaUrl = (url) => {
  if (!url) {
    return '';
  }

  if (url.startsWith('/uploads/')) {
    return url.split('?')[0];
  }

  try {
    const parsed = new URL(url);
    return parsed.pathname;
  } catch {
    return url.split('?')[0];
  }
};

export const calculateDiscountedPrice = (price, discountPercent = 18) =>
  Math.round(price * (1 - discountPercent / 100));
