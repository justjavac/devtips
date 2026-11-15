import { SITE } from '../site.js';
import { escapeAttr, escapeHtml } from '../utils.js';
import { layout } from '../layout.js';
import { tipCard } from '../components/tip-card.js';
import { dirList } from '../components/dir-list.js';

export function homePage(site, assets, pageSize) {
  const { tips, categories, tools } = site;
  const firstPage = tips.slice(0, pageSize);
  const totalPages = Math.ceil(tips.length / pageSize);

  const categoryRows = dirList(
    categories.map((category) => ({
      href: `/categories/${category.slug}/`,
      name: category.name,
      desc: category.desc,
      meta: `${site.byCategory.get(category.slug)?.length ?? 0} 篇`,
    })),
  );

  const toolCloud = tools
    .map((tool) => ({ tool, count: site.byTool.get(tool.slug)?.length ?? 0 }))
    .filter(({ count }) => count > 0)
    .map(
      ({ tool, count }) =>
        `<a class="badge tool-badge" href="/tools/${escapeAttr(tool.slug)}/">${escapeHtml(tool.name)} <span class="tool-count">${count}</span></a>`,
    )
    .join('');

  const body = `
<section aria-label="最新技巧">
  <div class="section-head">
    <h2 class="section-title">最新</h2>
    <span class="section-meta">${tips.length} 条</span>
  </div>
  <div id="tip-list" class="tip-list">
    ${firstPage.map((tip) => tipCard(tip, site)).join('\n    ')}
  </div>
  ${totalPages > 1 ? `<div id="load-more" class="load-more" data-next="2">// 下拉加载更多</div>` : ''}
</section>
<section class="mt-12" aria-label="栏目">
  <div class="section-head">
    <h2 class="section-title">栏目</h2>
    <span class="section-meta">${categories.length} 个</span>
  </div>
  ${categoryRows}
</section>
<section class="mt-12" aria-label="按工具浏览">
  <div class="section-head">
    <h2 class="section-title">按工具浏览</h2>
  </div>
  <div class="tool-cloud">${toolCloud}</div>
</section>`;

  return layout({ title: SITE.tagline, path: '/', body, assets });
}
