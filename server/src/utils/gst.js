import ApiError from './ApiError.js';

const isGstEnabledValue = (value) => value === true;

export const normalizeGstFields = (gstEnabled, gstPercentage) => {
  if (!isGstEnabledValue(gstEnabled)) {
    return { gstEnabled: false, gstPercentage: 0 };
  }

  if (gstPercentage === undefined || gstPercentage === null || gstPercentage === '') {
    throw new ApiError(400, 'GST percentage is required when GST is enabled');
  }

  const percent = Number(gstPercentage);

  if (!Number.isFinite(percent) || percent < 0 || percent > 100) {
    throw new ApiError(400, 'GST percentage must be between 0 and 100');
  }

  return { gstEnabled: true, gstPercentage: percent };
};

export const calculateGstPricing = (basePrice, gstEnabled, gstPercentage) => {
  const price = Number(basePrice) || 0;
  const enabled = Boolean(gstEnabled);
  const percent =
    enabled && Number.isFinite(Number(gstPercentage)) ? Number(gstPercentage) : 0;
  const gstAmount = enabled ? (price * percent) / 100 : 0;

  return {
    gstEnabled: enabled,
    gstPercentage: enabled ? percent : 0,
    gstAmount,
    finalPrice: price + gstAmount,
  };
};
