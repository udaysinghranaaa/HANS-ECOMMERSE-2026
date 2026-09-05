import { sanitizeDescriptionHtml } from '@/utils/productDescription';

export default function ProductDescription({
  description,
  className = '',
  clamp = false,
}) {
  if (!description) {
    return null;
  }

  const sanitized = sanitizeDescriptionHtml(description);
  if (!sanitized) {
    return null;
  }

  return (
    <div
      className={`product-description break-words text-sm leading-relaxed text-charcoal-light sm:text-base ${
        clamp ? 'product-description-clamp' : ''
      } ${className}`.trim()}
      dangerouslySetInnerHTML={{ __html: sanitized }}
    />
  );
}
