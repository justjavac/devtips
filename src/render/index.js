import { homePage } from './pages/home.js';
import { tipPage } from './pages/tip.js';
import {
  categoriesIndexPage,
  listingPage,
  tagsIndexPage,
  toolPage,
  toolsIndexPage,
} from './pages/listing.js';
import { issuePage, issuesIndexPage } from './pages/issues.js';
import { aboutPage, notFoundPage } from './pages/about.js';
import { tipCard } from './components/tip-card.js';
import { tipUrl } from './utils.js';
import { buildFeed, buildLlmsTxt, buildSearchIndex, buildSitemap } from '../../scripts/lib/seo.mjs';

export const PAGE_SIZE = 10;

export function buildRoutes(site, assets) {
  const routes = [];
  const push = (path, body, type = 'html') => routes.push({ path, body, type });

  push('/', homePage(site, assets, PAGE_SIZE));

  for (const tip of site.tips) {
    push(tipUrl(tip.slug), tipPage(site, assets, tip));
    push(`${tipUrl(tip.slug)}index.md`, tip.raw, 'md');
  }

  push('/categories/', categoriesIndexPage(site, assets));
  for (const category of site.categories) {
    push(
      `/categories/${category.slug}/`,
      listingPage(site, assets, {
        title: category.name,
        description: category.desc,
        path: `/categories/${category.slug}/`,
        tips: site.byCategory.get(category.slug) ?? [],
      }),
    );
  }

  push('/tools/', toolsIndexPage(site, assets));
  for (const tool of site.tools) {
    push(`/tools/${tool.slug}/`, toolPage(site, assets, tool));
  }

  push('/tags/', tagsIndexPage(site, assets));
  for (const [tag, tips] of site.byTag) {
    const encoded = encodeURIComponent(tag);
    push(
      `/tags/${encoded}/`,
      listingPage(site, assets, {
        title: `标签：${tag}`,
        description: `标签「${tag}」下的技巧。`,
        path: `/tags/${encoded}/`,
        tips,
      }),
    );
  }

  push('/issues/', issuesIndexPage(site, assets));
  for (const issue of site.issues) {
    push(`/issues/${issue.month}/`, issuePage(site, assets, issue));
  }

  push('/about/', aboutPage(site, assets));
  push('/404.html', notFoundPage(site, assets));

  push('/feed.xml', buildFeed(site), 'xml');
  push('/sitemap.xml', buildSitemap(site), 'xml');
  push('/search-index.json', JSON.stringify(buildSearchIndex(site)), 'json');
  push('/llms.txt', buildLlmsTxt(site), 'txt');

  const totalPages = Math.ceil(site.tips.length / PAGE_SIZE);
  for (let page = 2; page <= totalPages; page += 1) {
    const slice = site.tips.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
    push(
      `/page/${page}.json`,
      JSON.stringify({
        html: slice.map((tip) => tipCard(tip, site)).join('\n'),
        next: page < totalPages ? page + 1 : null,
      }),
      'json',
    );
  }

  return routes;
}

export function normalizePath(pathname) {
  let p = pathname;
  if (p.endsWith('/index.html')) p = p.slice(0, -'index.html'.length);
  if (p === '' || p === '/') return '/';
  const last = p.split('/').pop();
  if (last.includes('.')) return p;
  return p.endsWith('/') ? p : `${p}/`;
}

export function routeMap(routes) {
  const map = new Map();
  for (const route of routes) map.set(normalizePath(route.path), route);
  return map;
}

export async function writeRoutes(routes, outDir) {
  const fs = await import('node:fs');
  const path = await import('node:path');
  for (const route of routes) {
    const normalized = normalizePath(route.path);
    const filePath = normalized.endsWith('/')
      ? path.join(outDir, normalized, 'index.html')
      : path.join(outDir, normalized);
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, route.body);
  }
}
