import sanitizeHtml from 'sanitize-html';

const SANITIZE_OPTIONS = {
  allowedTags: [
    'p',
    'br',
    'h1',
    'h2',
    'h3',
    'strong',
    'b',
    'em',
    'i',
    'u',
    's',
    'strike',
    'ul',
    'ol',
    'li',
    'a',
    'span',
    'mark',
  ],
  allowedAttributes: {
    a: ['href', 'target', 'rel'],
    span: ['style'],
    p: ['style'],
    h1: ['style'],
    h2: ['style'],
    h3: ['style'],
    li: ['style'],
    mark: ['style', 'data-color'],
  },
  allowedStyles: {
    '*': {
      'text-align': [/^left$/, /^right$/, /^center$/, /^justify$/],
      color: [
        /^#[0-9a-fA-F]{3,8}$/,
        /^rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)$/,
        /^rgba\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*(?:0|1|0?\.\d+)\s*\)$/,
      ],
      'background-color': [
        /^#[0-9a-fA-F]{3,8}$/,
        /^rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)$/,
        /^rgba\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*(?:0|1|0?\.\d+)\s*\)$/,
      ],
    },
  },
  allowedSchemes: ['http', 'https', 'mailto'],
  transformTags: {
    a: sanitizeHtml.simpleTransform('a', {
      target: '_blank',
      rel: 'noopener noreferrer',
    }),
  },
};

export function stripDescriptionText(value = '') {
  return sanitizeHtml(value, {
    allowedTags: [],
    allowedAttributes: {},
  })
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function sanitizeProductDescription(value = '') {
  const trimmed = String(value ?? '').trim();
  if (!trimmed) {
    return '';
  }

  return sanitizeHtml(trimmed, SANITIZE_OPTIONS).trim();
}

export function assertDescriptionPresent(value = '') {
  if (!stripDescriptionText(value)) {
    throw new Error('Product description is required');
  }
}
