import { escapeAttr, escapeHtml, shortDate, tipUrl } from '../utils.js';
import { toolBadge, verifiedBadge } from './badges.js';

export function tipCard(tip, site) {
  const tools = tip.tools
    .map((slug) => site.toolsBySlug[slug])
    .filter(Boolean)
    .map(toolBadge)
    .join('');
  return `<article class="tip-item">
  <time class="tip-item-date" datetime="${escapeAttr(tip.publishedAt)}">${escapeHtml(shortDate(tip.publishedAt))}</time>
  <div class="tip-item-body">
    <h2 class="tip-item-title"><a href="${tipUrl(tip.slug)}">${escapeHtml(tip.title)}</a></h2>
    <p class="tip-item-summary">${escapeHtml(tip.summary)}</p>
    <footer class="tip-item-meta">${tools}${verifiedBadge(tip)}</footer>
  </div>
</article>`;
}
