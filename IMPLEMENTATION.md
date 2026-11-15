# DevTips.cn 实施方案（Rsbuild + Tailwind v4 + shadcn 风格 + 原生 JS）

> 版本：v0.1
> 日期：2026-11-15
> 上游文档：[PLAN.md](PLAN.md)（信息架构以此为准，本方案只做技术落地）

---

## 1. 技术选型决策

| 决策 | 结论 | 理由 |
|---|---|---|
| 站点架构 | **自建 SSG 层 + Rsbuild 资产管线**，以 Rsbuild 插件形式集成 | 用户指定纯 Rsbuild（覆盖 PLAN §7 的 Rspress 建议）；内容站要求纯静态 HTML 输出，原生 JS 栈下自建约 7 种页面模板，规模可控 |
| CSS | Tailwind CSS v4，经官方插件 `@rsbuild/plugin-tailwindcss` 接入 | 官方插件基于 `@tailwindcss/webpack`，不经 PostCSS 转换，构建性能更好（见 [Rsbuild Tailwind 指南](https://rsbuild.rs/guide/styling/tailwindcss)） |
| 组件体系 | **Basecoat**（`basecoat-css` npm 包）= shadcn/ui v4 的原生 HTML/Tailwind 移植 | shadcn/ui 本体是 React 组件库，与"原生 JS"冲突；[Basecoat](https://basecoatui.com) 完整复刻 shadcn 设计令牌与组件类（`btn`/`card`/`badge`/`dialog`…），MIT 协议，主题与 shadcn 完全兼容。只取其 CSS 类，交互行为全部用原生 JS 自写，不引入其可选的 Alpine.js |
| Markdown | `gray-matter`（frontmatter）+ `markdown-it` + `@shikijs/markdown-it` | 均为构建期依赖，浏览器端零成本；Shiki 双主题（亮/暗）靠 CSS 变量切换，无需客户端 JS |
| 包管理器 | pnpm | Rstack 生态惯例，见假设 §10 |
| 部署 | 纯静态产物（`dist/`）→ 静态托管/CDN；ICP 备案前用境外节点，备案后切国内 CDN | 见假设 §10 |

**与 PLAN §7 的对应**：栏目冷启动砍到 4 个（`ai-tools` / `prompting` / `workflow` / `dev-basics`，MCP 与 LLM API 后拆）、难度分级与首页"热门"后置、满 30 篇时出第一期月刊——均按 PLAN 建议执行，本方案不再重复论证。

## 2. 总体架构

```
content/*.md ──► SSG 渲染层（Node，模板字符串函数）──► 静态 HTML
                     ▲                                    │
Rsbuild 打包 src/main.js + src/styles/main.css ──► 带 hash 的 CSS/JS ──► 注入 <link>/<script>
```

- **Rsbuild 只有一个入口** `src/main.js`（全局交互 + 引入 CSS）。不做 MPA——页面由内容驱动，数量动态。
- **SSG 层实现为 Rsbuild 插件** `plugins/rsbuild-plugin-content.mjs`：
  - `rsbuild dev`：`onBeforeStartDevServer` 钩子注册 middleware，按请求路径**按需渲染** HTML 返回；内容文件改动后刷新浏览器即生效，无需重启（配合 `dev.watchFiles` 监听 `content/`）。
  - `rsbuild build`：`output.manifest: true` 生成资产清单，`onAfterBuild` 钩子经 `environments.web.manifest` 读取带 hash 的 JS/CSS 路径（见 [output.manifest](https://rsbuild.rs/config/output/manifest) 与 [插件钩子](https://rsbuild.rs/plugins/dev/hooks)），渲染全部页面写入 `dist/`，同时产出 RSS/sitemap/搜索索引。
- **浏览器端 JS 只有一个 bundle**，目标 gzip < 10KB：主题切换、搜索、复制按钮、加载更多。无框架、无运行时依赖。

## 3. 目录结构

```
devtips/
├── content/
│   ├── tips/*.md                # 技巧正文（frontmatter + 正文）
│   ├── issues/2026-11.md        # 月刊：frontmatter(month, title) + 手写导语
│   ├── tools.json               # 工具档案：名称/官网/定价/国内可用性（手工维护）
│   └── categories.json          # 4 个栏目的名称/slug/一句话描述
├── src/
│   ├── main.js                  # 浏览器端唯一入口：import CSS + 初始化各交互模块
│   ├── js/                      # theme.js / search.js / copy.js / load-more.js
│   ├── styles/
│   │   ├── main.css             # @import "tailwindcss" + basecoat-css + 主题变量
│   │   └── prose.css            # 正文排版（中文打磨、代码块）
│   └── render/                  # ★ 构建期模板层（Node 运行，原生 JS 字符串函数）
│       ├── layout.js            # <html> 骨架：head(meta/OG/JSON-LD/防闪烁脚本)、导航、页脚
│       ├── components/          # tip-card.js / badge.js / code-block.js / breadcrumb.js …
│       └── pages/               # home / tip / category / tool / issue / tag / about / 404
├── plugins/
│   └── rsbuild-plugin-content.mjs   # SSG 插件（dev middleware + build 生成）
├── scripts/
│   ├── lib/                     # markdown.js / validate.js / aggregate.js
│   └── new-tip.mjs              # 写作脚手架：交互式生成带 frontmatter 的 md 文件
├── public/                      # favicon.svg、robots.txt、llms.txt（绝对路径 / 引用）
├── rsbuild.config.ts            # defineConfig + pluginTailwindcss + pluginContent
├── package.json
└── IMPLEMENTATION.md
```

约定（遵循 Rsbuild 最佳实践）：`public/` 只放不参与编译的静态文件，HTML 中以绝对路径（如 `/favicon.svg`）引用；源码管理的资产一律 import。

## 4. 内容模型与管线

### 4.1 Frontmatter Schema（构建期强校验）

在 PLAN §2.1 基础上增加 `publishedAt`（月刊按月聚合与"最新"排序需要，`verifiedAt` 表示实测日期、两者语义不同）：

```yaml
---
title: "Claude Code：用 hooks 在提交前自动跑 lint"   # 必填
slug: claude-code-hooks-precommit-lint               # 必填，全站唯一，[a-z0-9-]
summary: "一句话结论，60 字内"                        # 必填，卡片与结论框共用
category: workflow                                   # 必填，∈ categories.json
tools: [claude-code]                                 # 可选，∈ tools.json（dev-basics 可空）
toolVersion: "2.x"                                   # 必填
verifiedAt: 2026-11-10                               # 必填，实测日期
publishedAt: 2026-11-12                              # 必填，发布日期（月刊/排序依据）
tags: [hooks, git, 质量]                              # 可选
deprecated:                                          # 可选：PLAN §2.3 失效标记
  atVersion: "3.0"
  note: "该配置项已在 3.0 移除"
---
```

构建时校验（`scripts/lib/validate.js`，任一不满足则构建失败并报出文件名）：

- 必填字段齐全；`slug` 全站唯一；`category`/`tools` 值在字典内
- `summary` ≤ 60 字；`verifiedAt`/`publishedAt` 为合法日期
- 正文必须包含至少一个二级标题（保证"问题→方案"结构）

### 4.2 渲染管线

1. 读取 `content/tips/*.md` → `gray-matter` 解析 → 校验。
2. `markdown-it` 渲染正文：
   - `@shikijs/markdown-it` 做**构建期**代码高亮，双主题输出（Shiki 的 `css-variable-theme` 类方案，亮/暗由 CSS 变量驱动）。
   - 自定义 fence 渲染器：代码块外层包裹工具条（语言标注 + `data-copy` 复制按钮占位），支持 `{1,3-5}` 行高亮语法。
   - 标题自动加 `id` 锚点；外链加 `target="_blank" rel="noopener"`；中西文混排在文本节点自动补空格。
3. 聚合计算：按 `publishedAt` 倒序的全量列表；category / tool / tag 三个索引；按 `publishedAt` 月份归并月刊。
4. 产物清单（`onAfterBuild` 写入 `dist/`）：

| 路径 | 内容 |
|---|---|
| `/index.html` | 首页：定位语 + 搜索框 + 卡片流（首屏 10 条）+ 栏目入口 4 格 + 工具徽章云 |
| `/tips/:slug/index.html` | 详情页（BLUF 结构，见 PLAN §5.3） |
| `/tips/:slug/index.md` | 同篇 Markdown 原文（"复制 Markdown"按钮的 fetch 目标 + AI 爬虫友好） |
| `/categories/:cat/`、`/tools/:tool/`、`/tags/:tag/` | 聚合页 |
| `/issues/:yyyy-mm/` | 月刊页：导语 + 当月 tip 按栏目分组 |
| `/about/`、`/404.html` | 静态页 |
| `/feed.xml` | RSS（最新 20 条，模板字符串手写 XML） |
| `/sitemap.xml` | 全部页面 + lastmod |
| `/search-index.json` | `[{title, slug, summary, tools, tags, category, publishedAt}]`，搜索数据源 |
| `/page/:n.json` | 首页"加载更多"的分页数据（每页 10 条卡片 HTML 片段或 JSON） |

### 4.3 开发体验

- `pnpm dev` → `rsbuild dev`：CSS/JS 改动走 HMR；`content/` 改动由 middleware 按需重渲染，刷新可见。
- `pnpm build` → `rsbuild build`：一次性产出完整静态站。
- `pnpm preview` → `rsbuild preview`：本地验证产物。
- `pnpm new` → `node scripts/new-tip.mjs`：问答式生成 tip 骨架（自动填 `publishedAt` 当天、slug 转写）。

## 5. 样式方案

### 5.1 接入

```bash
pnpm add -D @rsbuild/core @rsbuild/plugin-tailwindcss tailwindcss basecoat-css
```

```ts
// rsbuild.config.ts
import { defineConfig } from '@rsbuild/core';
import { pluginTailwindcss } from '@rsbuild/plugin-tailwindcss';
import { pluginContent } from './plugins/rsbuild-plugin-content.mjs';

export default defineConfig({
  plugins: [pluginTailwindcss(), pluginContent()],
  source: { entry: { index: './src/main.js' } },
  output: { manifest: true },
});
```

```css
/* src/styles/main.css */
@import 'tailwindcss';
@import 'basecoat-css';            /* shadcn 设计令牌 + btn/card/badge/dialog 等组件类 */
@custom-variant dark (&:where(.dark, .dark *));   /* class 策略暗色模式 */

@theme { /* 覆盖 shadcn 变量：靛蓝主色、绿色实测徽章、圆角等 */ }
```

### 5.2 设计令牌（落实 PLAN §6）

- **主色**：靛蓝系 `--primary`；实测徽章用绿色（`bg-emerald-*` 语义化封装为 `.badge-verified`），作为唯一品牌记忆点。
- **字体**：
  - 正文：`system-ui, "PingFang SC", "Microsoft YaHei", sans-serif`（霞鹜文楷作为可选 webfont 后置）
  - 代码/Logo/徽章：`"Maple Mono NF CN", "JetBrains Mono", monospace`，经 `@fontsource` 自托管 import（不进 public）
- **排版**：正文 1.75 倍行高、段落间距 `1em`、正文最大宽 `~70ch`、代码行宽 ≤ 75 字符。
- **暗色**：默认跟随系统，手动切换存 `localStorage`；`layout.js` 的 `<head>` 内联一段 200 字节防闪烁脚本（在 CSS 加载前决定 `<html class>`）。

### 5.3 组件映射（Basecoat 类 + 原生 JS 行为）

| UI | 实现 |
|---|---|
| Tip 卡片 / 徽章 / 面包屑 / 按钮 | 纯 Basecoat CSS 类，模板函数输出 class |
| 搜索浮层 | Basecoat `dialog` 类 + 原生 JS（`<dialog>` 元素，`showModal()`） |
| 移动端导航 | `details/summary` 或原生 JS 切换，零依赖 |
| 主题切换 | 原生 JS 切换 `<html class="dark">` |

## 6. 浏览器端交互（`src/main.js`，全部原生）

按模块懒加载，事件全部委托到 `document`：

1. **theme.js**：读取 `localStorage` → 切换 class → 写回；监听系统主题变化。
2. **search.js**：`Cmd/Ctrl+K` 或点击搜索框打开 `<dialog>`；首次打开时 `fetch('/search-index.json')`；输入时按 标题(3) > 工具/标签(2) > summary(1) 加权打分，渲染前 10 条；↑↓ 键选择、Enter 跳转。自写约 100 行，不引第三方库。
3. **copy.js**：点击 `[data-copy]` → 读取相邻代码块文本 → `navigator.clipboard.writeText` → 按钮变 ✓ 1.5s。详情页"复制 Markdown"按钮 fetch 同路径 `.md` 复制全文。
4. **load-more.js**：首页滚动到底部时 fetch `/page/:n+1.json`，append 卡片。

## 7. SEO / GEO 基建（PLAN §8.3，随骨架一并落地）

- 每页：`<title>`、meta description（取 `summary`）、canonical、OG/Twitter Card、JSON-LD（`TechArticle`，含 `dateModified: verifiedAt`）。
- `robots.txt`：放行并显式 Allow 主流 AI 爬虫（GPTBot、ClaudeBot、PerplexityBot 等）。
- `llms.txt`：站点简介 + 栏目/月刊索引链接（放 `public/`）。
- 每篇 tip 的 `.md` 版本与页面同路径共存，供 AI 工具直接抓取。
- `feed.xml` + `sitemap.xml` 构建期生成；上线后提交 Google/Bing Search Console。
- 评论区：后置，候选 giscus（GitHub Discussions 驱动，与"GitHub 投稿"闭环）。

## 8. 里程碑（目标 1 周上线骨架，30 篇内容并行推进）

| 阶段 | 内容 | 验收 |
|---|---|---|
| M1 骨架（D1） | 初始化仓库；Rsbuild + Tailwind 插件 + Basecoat 接通；layout/导航/页脚；暗色模式 | `pnpm dev` 首页可见导航与主题切换；`pnpm build` 通过 |
| M2 内容管线（D2–D3） | frontmatter 校验、markdown-it + Shiki、7 种页面模板、聚合索引、RSS/sitemap/search-index、dev middleware | 用 3 篇示例 tip 跑通：`build` 产出全部 URL 类型；`preview` 下卡片/详情/栏目/月刊可点通 |
| M3 交互与排版（D4） | 搜索、复制、加载更多；中文排版打磨；移动端适配 | Lighthouse 移动版四项 ≥ 95；窄屏代码块可横滚不破版 |
| M4 内容与上线（D5–D7） | `new-tip` 脚手架 + 写作模板；30 篇冷启动内容（AI 20 + 传统 10）；CI（GitHub Actions build）+ 部署；备案启动 | 线上 URL 可访问；sitemap/RSS 可订阅；30 篇全部带 `verifiedAt` |

故障排查约定：配置异常先 `DEBUG=rsbuild pnpm dev`，再看 `dist/.rsbuild` 生成的最终配置。

## 9. 风险与缓解

| 风险 | 缓解 |
|---|---|
| 自建 SSG 层的维护成本 | 页面类型固定为 7 种，模板为纯字符串函数；渲染层与 Rsbuild 解耦，未来可平滑迁回 Rspress（内容格式不变） |
| Basecoat 版本较新（0.3.x） | 只消费其 CSS 产物，行为全自写；锁定版本，升级前人工 diff |
| Shiki 拖慢构建 | 只注册实际用到的语言子集；30–100 篇规模下构建期高亮总耗时可忽略 |
| 首页"加载更多"的 SEO 空洞 | 首屏 10 条为静态 HTML，分页 JSON 仅为增强；另有 sitemap 覆盖全部 tip |

## 10. 假设（未与用户确认，按默认值推进）

1. 用户指定的"Rsbuild + 原生 JS"覆盖 PLAN §7 建议的 Rspress 方案。
2. "shadcn" 在原生 JS 语境下落地为 Basecoat（shadcn 设计系统），不引入 React。
3. frontmatter 增加 `publishedAt` 字段（月刊聚合与排序需要）。
4. 栏目按 PLAN 建议冷启动砍到 4 个；难度分级、热门排序后置。
5. 包管理器用 pnpm；部署目标（Vercel/Cloudflare Pages/国内 CDN）在 M4 前另行确认。
6. 评论区后置，不计入 1 周里程碑。
