import fs from 'node:fs';
import path from 'node:path';
import { loadSite, loadSiteCached } from '../scripts/lib/content.mjs';
import { buildRoutes, normalizePath, routeMap, writeRoutes } from '../src/render/index.js';

const CONTENT_TYPES = {
  html: 'text/html; charset=utf-8',
  json: 'application/json; charset=utf-8',
  xml: 'application/xml; charset=utf-8',
  md: 'text/markdown; charset=utf-8',
  txt: 'text/plain; charset=utf-8',
};

// dev 模式下 Rsbuild 输出无 hash 的固定文件名，且 CSS 经 JS 注入
const DEV_ASSETS = { js: ['/static/js/index.js'], css: [] };

function assetsFromManifest(manifest) {
  const initial = manifest?.entries?.index?.initial;
  if (!initial?.js?.length) return null;
  return { js: initial.js, css: initial.css ?? [] };
}

function isPageRequest(normalizedPath) {
  if (normalizedPath.endsWith('/')) return true;
  return !path.posix.basename(normalizedPath).includes('.');
}

export const pluginContent = () => ({
  name: 'plugin-content',
  setup(api) {
    let devAssets = null;

    api.onAfterDevCompile(({ environments }) => {
      devAssets = assetsFromManifest(environments.web?.manifest) ?? devAssets;
    });

    api.onBeforeStartDevServer(({ server }) => {
      server.middlewares.use(async (req, res, next) => {
        if (req.method !== 'GET') return next();
        try {
          const url = new URL(req.url ?? '/', 'http://localhost');
          const pathname = normalizePath(decodeURIComponent(url.pathname));
          if (pathname.startsWith('/static/')) return next();

          const site = await loadSiteCached(api.context.rootPath);
          const routes = routeMap(buildRoutes(site, devAssets ?? DEV_ASSETS));
          const route = routes.get(pathname);
          if (route) {
            res.setHeader('Content-Type', CONTENT_TYPES[route.type] ?? CONTENT_TYPES.html);
            res.end(route.body);
            return;
          }
          if (isPageRequest(pathname)) {
            res.statusCode = 404;
            res.setHeader('Content-Type', CONTENT_TYPES.html);
            res.end(routes.get('/404.html').body);
            return;
          }
          next();
        } catch (error) {
          next(error);
        }
      });
    });

    api.onAfterBuild(async ({ environments }) => {
      const assets =
        assetsFromManifest(environments.web?.manifest) ??
        assetsFromManifest(JSON.parse(fs.readFileSync(path.join(api.context.distPath, 'manifest.json'), 'utf8')));
      if (!assets) throw new Error('[content] 无法从 manifest 中解析入口资产');
      const site = await loadSite(api.context.rootPath);
      const routes = buildRoutes(site, assets);
      await writeRoutes(routes, api.context.distPath);
      api.logger.info(`[content] 已生成 ${routes.length} 个路由`);
    });
  },
});
