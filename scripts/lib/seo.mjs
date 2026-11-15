import { SITE } from '../../src/render/site.js';
import { escapeXml, rfc822, tipUrl } from '../../src/render/utils.js';

export function buildFeed(site) {
  const items = site.tips
    .slice(0, 20)
    .map(
      (tip) => `    <item>
      <title>${escapeXml(tip.title)}</title>
      <link>${SITE.url}${tipUrl(tip.slug)}</link>
      <guid isPermaLink="true">${SITE.url}${tipUrl(tip.slug)}</guid>
      <pubDate>${rfc822(tip.publishedAt)}</pubDate>
      <description>${escapeXml(tip.summary)}</description>
      <category>${escapeXml(site.categoriesBySlug[tip.category].name)}</category>
    </item>`,
    )
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${SITE.name}</title>
    <link>${SITE.url}</link>
    <description>${escapeXml(SITE.description)}</description>
    <language>zh-CN</language>
    <atom:link href="${SITE.url}/feed.xml" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>
`;
}

export function buildSitemap(site) {
  const urls = [];
  const add = (loc, lastmod) => {
    urls.push(`  <url>\n    <loc>${SITE.url}${loc}</loc>${lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : ''}\n  </url>`);
  };

  add('/', site.tips[0]?.publishedAt);
  for (const tip of site.tips) add(tipUrl(tip.slug), tip.verifiedAt);
  add('/categories/');
  for (const category of site.categories) add(`/categories/${category.slug}/`);
  add('/tools/');
  for (const tool of site.tools) add(`/tools/${tool.slug}/`);
  add('/tags/');
  for (const tag of site.byTag.keys()) add(`/tags/${encodeURIComponent(tag)}/`);
  add('/issues/');
  for (const issue of site.issues) add(`/issues/${issue.month}/`);
  add('/about/');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>
`;
}

export function buildSearchIndex(site) {
  return site.tips.map((tip) => ({
    title: tip.title,
    slug: tip.slug,
    summary: tip.summary,
    tools: tip.tools.map((slug) => site.toolsBySlug[slug]?.name ?? slug),
    tags: tip.tags,
    category: tip.category,
    categoryName: site.categoriesBySlug[tip.category].name,
    verifiedAt: tip.verifiedAt,
    publishedAt: tip.publishedAt,
  }));
}

export function buildLlmsTxt(site) {
  const lines = [
    `# ${SITE.name}`,
    '',
    `> ${SITE.description}`,
    '',
    '## 栏目',
    ...site.categories.map((c) => `- [${c.name}](${SITE.url}/categories/${c.slug}/): ${c.desc}`),
    '',
    '## 月刊',
    ...site.issues.map((issue) => `- [${issue.month}《${issue.title}》](${SITE.url}/issues/${issue.month}/)`),
    '',
    '## 技巧（Markdown 版本）',
    ...site.tips.map((tip) => `- [${tip.title}](${SITE.url}${tipUrl(tip.slug)}index.md): ${tip.summary}`),
    '',
  ];
  return lines.join('\n');
}
