import prisma from '../config/prisma.js';
import { getMemoryCached } from '../utils/memoryCache.js';

const ACTIVE_FESTIVAL_CACHE_MS = 60_000;

export const findActiveFestival = async () => {
  return getMemoryCached('active-festival', ACTIVE_FESTIVAL_CACHE_MS, async () => {
    const now = new Date();

    return prisma.festival.findFirst({
      where: {
        isEnabled: true,
        startsAt: { lte: now },
        endsAt: { gte: now },
      },
      orderBy: [{ priority: 'desc' }, { startsAt: 'desc' }],
    });
  });
};

export const isProductInFestival = (product, festival) => {
  if (!festival) {
    return false;
  }

  if (festival.applyToAllProducts) {
    return true;
  }

  return product.festivalId === festival.id;
};

export const getProductFestivalDiscount = (product, festival) => {
  if (!isProductInFestival(product, festival)) {
    return null;
  }

  if (festival.discountPercent) {
    return festival.discountPercent;
  }

  if (product.festivalId === festival.id && product.festivalDiscountPercent) {
    return product.festivalDiscountPercent;
  }

  if (festival.applyToAllProducts) {
    return null;
  }

  return null;
};

export const applyActiveFestivalFields = (formattedProduct, product, festival) => {
  const discount = getProductFestivalDiscount(product, festival);

  if (!discount) {
    return formattedProduct;
  }

  return {
    ...formattedProduct,
    activeFestivalDiscount: discount,
    activeFestival: {
      id: festival.id,
      name: festival.name,
    },
  };
};
