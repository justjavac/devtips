import { escapeAttr, escapeHtml, shortDate } from '../utils.js';
import { icons } from '../icons.js';

export function toolBadge(tool) {
  return `<a class="badge tool-badge" href="/tools/${escapeAttr(tool.slug)}/">${escapeHtml(tool.name)}</a>`;
}

export function categoryBadge(category) {
  return `<a class="badge tool-badge" href="/categories/${escapeAttr(category.slug)}/">${escapeHtml(category.name)}</a>`;
}

export function verifiedBadge(tip) {
  return `<span class="badge badge-verified" title="本技巧于 ${escapeAttr(tip.verifiedAt)} 在 ${escapeAttr(tip.toolVersion)} 上实机验证">${icons.check('badge-icon')}实测于 ${shortDate(tip.verifiedAt)}</span>`;
}

export function versionBadge(tip) {
  return `<span class="badge tool-badge">${escapeHtml(tip.toolVersion)}</span>`;
}
