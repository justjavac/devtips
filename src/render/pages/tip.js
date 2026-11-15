import { SITE } from '../site.js';
import { escapeAttr, escapeHtml, tipUrl } from '../utils.js';
import { icons } from '../icons.js';
import { layout } from '../layout.js';
import { tipCard } from '../components/tip-card.js';
import { categoryBadge, verifiedBadge } from '../components/badges.js';

export function tipPage(site, assets, tip) {
  const category = site.categoriesBySlug[tip.category];
  const tools = tip.tools.map((slug) => site.toolsBySlug[slug]).filter(Boolean);

  const deprecatedBanner = tip.deprecated
    ? `<div class="alert-deprecated" role="alert">
    ${icons.alert()}
    <div><strong>已于 ${escapeHtml(tip.deprecated.atVersion)} 版本失效。</strong>${tip.deprecated.note ? ` ${escapeHtml(tip.deprecated.note)}` : ''} 本页面保留存档，内容不再更新。</div>
  </div>`
    : '';

  const metaTools = tools.length > 0
    ? `${tools.map((tool) => `<a href="/tools/${escapeAttr(tool.slug)}/"><strong>${escapeHtml(tool.name)}</strong></a>`).join('、')} ${escapeHtml(tip.toolVersion)}`
    : escapeHtml(tip.toolVersion);

  const feedbackUrl = `${SITE.github}/issues/new?title=${encodeURIComponent(`失效反馈：${tip.title}`)}&body=${encodeURIComponent(`技巧链接：${SITE.url}${tipUrl(tip.slug)}\n实测版本：${tip.toolVersion}\n\n问题描述：\n`)}`;

  const related = (tip.related ?? []).map((slug) => site.tipsBySlug[slug]).filter(Boolean);
  const relatedSection = related.length
    ? `<section class="mt-12" aria-label="相关技巧">
    <div class="section-head">
      <h2 class="section-title">相关技巧</h2>
      <span class="section-meta">${related.length}</span>
    </div>
    <div class="tip-list">${related.map((item) => tipCard(item, site)).join('')}</div>
  </section>`
    : '';

  const older = tip.olderSlug ? site.tipsBySlug[tip.olderSlug] : null;
  const newer = tip.newerSlug ? site.tipsBySlug[tip.newerSlug] : null;
  const pager = `<nav class="tip-pager" aria-label="上一篇 / 下一篇">
  ${older ? `<a class="pager-link" href="${tipUrl(older.slug)}"><span class="pager-label">← 上一篇</span><span class="pager-title">${escapeHtml(older.title)}</span></a>` : '<span></span>'}
  ${newer ? `<a class="pager-link pager-next" href="${tipUrl(newer.slug)}"><span class="pager-label">下一篇 →</span><span class="pager-title">${escapeHtml(newer.title)}</span></a>` : '<span></span>'}
</nav>`;

  const body = `
<article>
  <nav class="breadcrumb" aria-label="面包屑">
    <ol>
      <li><a href="/categories/${escapeAttr(category.slug)}/">${escapeHtml(category.name)}</a></li>
      <li aria-hidden="true">${icons.chevronRight()}</li>
      <li aria-current="page"><span>${escapeHtml(tip.title)}</span></li>
    </ol>
  </nav>
  <header class="tip-header">
    <h1 class="tip-title">${escapeHtml(tip.title)}</h1>
    <div class="tip-meta">
      <span>适用：${metaTools}</span>
      ${verifiedBadge(tip)}
      ${categoryBadge(category)}
      ${tip.difficulty ? `<span class="badge tool-badge">${escapeHtml(tip.difficulty)}</span>` : ''}
      <span class="tip-meta-actions">
        <button type="button" class="btn" data-variant="outline" data-size="sm" data-copy-markdown="${tipUrl(tip.slug)}index.md">${icons.copy()} 复制 Markdown</button>
        <a class="btn" data-variant="ghost" data-size="sm" href="${escapeAttr(feedbackUrl)}" target="_blank" rel="noopener">失效了？</a>
      </span>
    </div>
  </header>
  ${deprecatedBanner}
  <div class="summary-box">
    <strong>结论</strong>
    <p>${escapeHtml(tip.summary)}</p>
  </div>
  <div class="prose">${tip.html}</div>
</article>
${relatedSection}
${pager}`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: tip.title,
    description: tip.summary,
    datePublished: tip.publishedAt,
    dateModified: tip.verifiedAt,
    author: { '@type': 'Organization', name: SITE.name, url: SITE.url },
    mainEntityOfPage: `${SITE.url}${tipUrl(tip.slug)}`,
  };

  return layout({
    title: tip.title,
    description: tip.summary,
    path: tipUrl(tip.slug),
    body,
    assets,
    jsonLd,
    ogType: 'article',
  });
}
