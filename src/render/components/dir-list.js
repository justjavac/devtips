import { escapeAttr, escapeHtml } from '../utils.js';

export function dirRow({ href, name, desc, meta }) {
  return `<a class="dir-row" href="${escapeAttr(href)}">
  <span class="dir-row-head">
    <span class="dir-row-name">${escapeHtml(name)}</span>
    <span class="dir-row-count">${escapeHtml(meta)}</span>
  </span>
  <span class="dir-row-desc">${escapeHtml(desc)}</span>
</a>`;
}

export function dirList(items) {
  return `<div class="dir-list">${items.map(dirRow).join('\n')}</div>`;
}
