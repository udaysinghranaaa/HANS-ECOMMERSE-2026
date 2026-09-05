import DOMPurify from 'dompurify';

const SANITIZE_CONFIG = {
  ALLOWED_TAGS: [
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
  ALLOWED_ATTR: ['href', 'target', 'rel', 'style', 'data-color'],
  ALLOWED_URI_REGEXP:
    /^(?:(?:https?|mailto):|[^a-z]|[a-z+.-]+(?:[^a-z+.\-:]|$))/i,
};

const HTML_TAG_PATTERN = /<\/?[a-z][\s\S]*?>/i;

function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function isDescriptionEmpty(value = '') {
  if (!value?.trim()) {
    return true;
  }

  const stripped = value
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  return !stripped;
}

export function plainTextToDescriptionHtml(text = '') {
  const trimmed = text.trim();
  if (!trimmed) {
    return '';
  }

  const paragraphs = trimmed.split(/\n{2,}/);

  return paragraphs
    .map((paragraph) => {
      const lines = paragraph.split('\n').map((line) => escapeHtml(line));
      return `<p>${lines.join('<br>')}</p>`;
    })
    .join('');
}

export function prepareDescriptionHtml(value = '') {
  const trimmed = String(value ?? '').trim();
  if (!trimmed) {
    return '';
  }

  if (HTML_TAG_PATTERN.test(trimmed)) {
    return trimmed;
  }

  return plainTextToDescriptionHtml(trimmed);
}

export function sanitizeDescriptionHtml(value = '') {
  const prepared = prepareDescriptionHtml(value);
  if (!prepared) {
    return '';
  }

  return DOMPurify.sanitize(prepared, SANITIZE_CONFIG);
}
