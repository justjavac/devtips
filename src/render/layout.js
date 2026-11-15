import { SITE } from './site.js';
import { icons } from './icons.js';
import { escapeAttr, escapeHtml } from './utils.js';

const themeInitScript = `(function(){try{var s=localStorage.getItem('theme');var d=s?s==='dark':window.matchMedia('(prefers-color-scheme: dark)').matches;document.documentElement.classList.toggle('dark',d);}catch(e){}})();`;

function header(path) {
  const navLinks = SITE.nav.map((item) => {
    const active = item.href === '/' ? path === '/' : path.startsWith(item.href);
    return `<a href="${item.href}" class="nav-link${active ? ' is-active' : ''}"${active ? ' aria-current="page"' : ''}>${item.label}</a>`;
  }).join('');

  return `<header class="site-header">
  <div class="mx-auto flex h-14 max-w-4xl items-center gap-3 px-4">
    <a href="/" class="logo font-mono" aria-label="${SITE.name} 首页">DevTips</a>
    <nav class="hidden items-center gap-1 sm:flex" aria-label="主导航">${navLinks}</nav>
    <div class="ml-auto flex items-center gap-2">
      <button type="button" class="btn" data-variant="outline" data-size="sm" data-search-open>
        ${icons.search()}<kbd class="kbd hidden sm:inline">⌘K</kbd>
      </button>
      <button type="button" class="btn" data-variant="ghost" data-size="icon-sm" data-theme-toggle aria-label="切换深浅色主题">
        <span class="theme-icon-sun">${icons.sun()}</span><span class="theme-icon-moon">${icons.moon()}</span>
      </button>
      <details class="mobile-nav sm:hidden">
        <summary class="btn" data-variant="ghost" data-size="icon-sm" aria-label="打开菜单">${icons.menu()}</summary>
        <nav class="mobile-nav-panel" aria-label="移动端导航">${navLinks}</nav>
      </details>
    </div>
  </div>
</header>`;
}

function footer() {
  const year = new Date().getFullYear();
  return `<footer class="site-footer">
  <div class="mx-auto max-w-4xl px-4 py-10">
    <div class="logo font-mono">DevTips</div>
    <p class="footer-tagline">${escapeHtml(SITE.tagline)}</p>
    <nav class="footer-links mt-4" aria-label="页脚导航">
      <a href="/feed.xml">${icons.rss('footer-icon')} RSS 订阅</a>
      <a href="${escapeAttr(SITE.github)}" target="_blank" rel="noopener">${icons.github('footer-icon')} GitHub 投稿</a>
      <a href="/sitemap.xml">Sitemap</a>
      <a href="/about/">关于</a>
    </nav>
    <p class="footer-copy">© ${year} ${SITE.name} · 每条技巧均经实机验证并标注工具版本与实测日期</p>
  </div>
</footer>`;
}

function searchDialog() {
  return `<dialog id="search-dialog" class="search-dialog" aria-label="搜索技巧">
  <div class="search-panel">
    <div class="search-input-row">
      ${icons.search()}
      <input id="search-input" type="search" placeholder="搜索技巧、工具、标签…" autocomplete="off" spellcheck="false">
      <kbd class="kbd">Esc</kbd>
    </div>
    <ul id="search-results" class="search-results"></ul>
    <div class="search-footer">
      <span><kbd class="kbd">↑</kbd><kbd class="kbd">↓</kbd> 选择</span>
      <span><kbd class="kbd">Enter</kbd> 打开</span>
      <span><kbd class="kbd">Esc</kbd> 关闭</span>
    </div>
  </div>
</dialog>`;
}

export function layout({ title, description = SITE.description, path = '/', body, assets, jsonLd, ogType = 'website' }) {
  const fullTitle = path === '/' ? `${SITE.name} — ${SITE.tagline}` : `${title} · ${SITE.name}`;
  const canonical = `${SITE.url}${path}`;
  const cssTags = (assets?.css ?? []).map((href) => `<link rel="stylesheet" href="${escapeAttr(href)}">`).join('\n  ');
  const jsTags = (assets?.js ?? []).map((src) => `<script src="${escapeAttr(src)}" defer></script>`).join('\n  ');
  const jsonLdTag = jsonLd ? `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>` : '';

  return `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(fullTitle)}</title>
  <meta name="description" content="${escapeAttr(description)}">
  <link rel="canonical" href="${escapeAttr(canonical)}">
  <meta property="og:site_name" content="${SITE.name}">
  <meta property="og:type" content="${escapeAttr(ogType)}">
  <meta property="og:title" content="${escapeAttr(fullTitle)}">
  <meta property="og:description" content="${escapeAttr(description)}">
  <meta property="og:url" content="${escapeAttr(canonical)}">
  <meta name="twitter:card" content="summary">
  <link rel="icon" href="/favicon.svg" type="image/svg+xml">
  <link rel="alternate" type="application/rss+xml" title="${SITE.name} RSS" href="/feed.xml">
  <script>${themeInitScript}</script>
  ${cssTags}
  ${jsonLdTag}
</head>
<body>
  ${header(path)}
  <main class="mx-auto max-w-4xl px-4 py-8">${body}</main>
  ${footer()}
  ${searchDialog()}
  ${jsTags}
</body>
</html>`;
}
