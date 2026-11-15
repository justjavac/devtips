import { layout } from '../layout.js';

export function aboutPage(site, assets) {
  const body = `
<header class="listing-header">
  <h1 class="listing-title">关于 DevTips</h1>
</header>
<div class="prose">${site.about.html}</div>`;
  return layout({
    title: '关于',
    description: 'DevTips 站点介绍与投稿说明。',
    path: '/about/',
    body,
    assets,
  });
}

export function notFoundPage(site, assets) {
  const body = `
<div class="notfound">
  <div class="notfound-code">404</div>
  <p>页面不存在。试试搜索，或者回到首页看看最新技巧。</p>
  <a class="btn" data-variant="primary" href="/">回到首页</a>
</div>`;
  return layout({ title: '页面不存在', path: '/404.html', body, assets });
}
