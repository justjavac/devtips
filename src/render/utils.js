const ESCAPE_MAP = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

export function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, (ch) => ESCAPE_MAP[ch]);
}

export const escapeAttr = escapeHtml;

export function escapeXml(value) {
  return escapeHtml(value);
}

export function shortDate(iso) {
  return String(iso).slice(5);
}

export function rfc822(isoDate) {
  return new Date(`${isoDate}T08:00:00+08:00`).toUTCString();
}

export function tipUrl(slug) {
  return `/tips/${slug}/`;
}
