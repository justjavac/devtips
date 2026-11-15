import { escapeHtml } from '../utils.js';
import { layout } from '../layout.js';
import { tipCard } from '../components/tip-card.js';
import { dirList } from '../components/dir-list.js';

function monthLabel(month) {
  const [year, m] = month.split('-');
  return `${year} 年 ${Number(m)} 月`;
}

export function issuesIndexPage(site, assets) {
  const rows = dirList(
    site.issues.map((issue) => ({
      href: `/issues/${issue.month}/`,
      name: `${monthLabel(issue.month)} · ${issue.title}`,
      desc: issue.summary,
      meta: `${site.byMonth.get(issue.month)?.length ?? 0} 篇`,
    })),
  );
  const body = `
<header class="listing-header">
  <div class="section-head">
    <h1 class="listing-title">月刊</h1>
    <span class="section-meta">${site.issues.length} 期</span>
  </div>
  <p class="listing-desc">每月精选归档，适合整期转发传播。</p>
</header>
${rows}`;
  return layout({ title: '月刊', description: 'DevTips 月刊：每月实测技巧精选。', path: '/issues/', body, assets });
}

export function issuePage(site, assets, issue) {
  const tips = site.byMonth.get(issue.month) ?? [];
  const groups = site.categories
    .map((category) => ({ category, tips: tips.filter((tip) => tip.category === category.slug) }))
    .filter(({ tips: groupTips }) => groupTips.length > 0);

  const sections = groups
    .map(
      ({ category, tips: groupTips }) => `<section class="issue-group">
  <div class="section-head">
    <h2 class="section-title">${escapeHtml(category.name)}</h2>
    <span class="section-meta">${groupTips.length} 篇</span>
  </div>
  <div class="tip-list">${groupTips.map((tip) => tipCard(tip, site)).join('\n')}</div>
</section>`,
    )
    .join('\n');

  const body = `
<header class="listing-header">
  <div class="section-head">
    <h1 class="listing-title">${monthLabel(issue.month)}《${escapeHtml(issue.title)}》</h1>
    <span class="section-meta">${tips.length} 篇</span>
  </div>
</header>
<div class="prose">${issue.html}</div>
${sections}`;

  return layout({
    title: `${monthLabel(issue.month)} 月刊《${issue.title}》`,
    description: issue.summary,
    path: `/issues/${issue.month}/`,
    body,
    assets,
  });
}
