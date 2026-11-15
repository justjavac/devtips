import { escapeAttr, escapeHtml } from '../utils.js';
import { layout } from '../layout.js';
import { tipCard } from '../components/tip-card.js';
import { dirList } from '../components/dir-list.js';

function tipList(tips, site) {
  if (tips.length === 0) {
    return '<p class="listing-desc">这里还没有内容，敬请期待。</p>';
  }
  return `<div class="tip-list">${tips.map((tip) => tipCard(tip, site)).join('\n')}</div>`;
}

export function listingPage(site, assets, { title, description, path, introHtml, tips }) {
  const body = `
<header class="listing-header">
  <div class="section-head">
    <h1 class="listing-title">${escapeHtml(title)}</h1>
    <span class="section-meta">${tips.length} 篇</span>
  </div>
  ${introHtml ?? `<p class="listing-desc">${escapeHtml(description)}</p>`}
</header>
${tipList(tips, site)}`;
  return layout({ title, description, path, body, assets });
}

export function categoriesIndexPage(site, assets) {
  const rows = dirList(
    site.categories.map((category) => ({
      href: `/categories/${category.slug}/`,
      name: category.name,
      desc: category.desc,
      meta: `${site.byCategory.get(category.slug)?.length ?? 0} 篇`,
    })),
  );
  const body = `
<header class="listing-header">
  <div class="section-head">
    <h1 class="listing-title">栏目</h1>
    <span class="section-meta">${site.categories.length} 个</span>
  </div>
  <p class="listing-desc">每条技巧只属于一个栏目，URL 与分类保持稳定。</p>
</header>
${rows}`;
  return layout({ title: '栏目', description: 'DevTips 栏目：AI 编程工具、Prompt 与上下文工程、AI 工作流、基础开发技巧。', path: '/categories/', body, assets });
}

export function toolsIndexPage(site, assets) {
  const rows = dirList(
    site.tools.map((tool) => ({
      href: `/tools/${tool.slug}/`,
      name: tool.name,
      desc: tool.desc,
      meta: `${site.byTool.get(tool.slug)?.length ?? 0} 篇`,
    })),
  );
  const body = `
<header class="listing-header">
  <div class="section-head">
    <h1 class="listing-title">工具</h1>
    <span class="section-meta">${site.tools.length} 个</span>
  </div>
  <p class="listing-desc">按工具浏览技巧。每个工具页附官网、定价与国内可用性档案。</p>
</header>
${rows}`;
  return layout({ title: '工具', description: '按开发工具浏览实测技巧：Cursor、Claude Code、Kimi CLI、Git、Copilot 等。', path: '/tools/', body, assets });
}

export function toolPage(site, assets, tool) {
  const tips = site.byTool.get(tool.slug) ?? [];
  const profile = `
<div class="tool-profile">
  <dl class="tool-profile-grid">
    <div><dt>官网</dt><dd><a href="${escapeAttr(tool.url)}" target="_blank" rel="noopener">${escapeHtml(tool.url.replace(/^https?:\/\//, ''))}</a></dd></div>
    <div><dt>定价</dt><dd>${escapeHtml(tool.pricing)}</dd></div>
    <div><dt>国内可用性</dt><dd>${escapeHtml(tool.availability)}</dd></div>
  </dl>
</div>`;
  const body = `
<header class="listing-header">
  <div class="section-head">
    <h1 class="listing-title">${escapeHtml(tool.name)}</h1>
    <span class="section-meta">${tips.length} 篇</span>
  </div>
  <p class="listing-desc">${escapeHtml(tool.desc)}</p>
</header>
${profile}
<div class="mt-8">${tipList(tips, site)}</div>`;
  return layout({
    title: `${tool.name} 使用技巧`,
    description: `${tool.name} 实测技巧合集：${tool.desc}`,
    path: `/tools/${tool.slug}/`,
    body,
    assets,
  });
}

export function tagsIndexPage(site, assets) {
  const items = [...site.byTag.entries()]
    .sort((a, b) => b[1].length - a[1].length)
    .map(([tag, tips]) => `<a class="badge tool-badge" href="/tags/${encodeURIComponent(tag)}/">${escapeHtml(tag)} <span class="tool-count">${tips.length}</span></a>`)
    .join('\n');
  const body = `
<header class="listing-header">
  <div class="section-head">
    <h1 class="listing-title">标签</h1>
    <span class="section-meta">${site.byTag.size} 个</span>
  </div>
  <p class="listing-desc">标签只做横向串联，不进主导航。</p>
</header>
<div class="tool-cloud">${items}</div>`;
  return layout({ title: '标签', description: 'DevTips 全部标签。', path: '/tags/', body, assets });
}
