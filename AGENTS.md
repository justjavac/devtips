# DevTips 项目指南

写给开发者的每日实测技巧站。Rsbuild + Tailwind CSS v4 + Basecoat + 原生 JS，SSG 构建到 `dist/`。内容全部在 `content/`（Markdown + JSON），构建时统一校验并生成页面。

## 常用命令

- `pnpm dev` — 本地开发
- `pnpm build` — 构建（**含内容校验**，内容不合法直接失败）
- `pnpm preview` — 预览构建产物
- `pnpm new` — 交互式新建技巧文章（支持管道输入，见 skill）

## 添加内容

任何内容改动（新增技巧文章、月刊、栏目、工具登记、修改关于页）**必须使用 `add-content` skill**（`.agents/skills/add-content/SKILL.md`），其中有完整的 frontmatter 规范、脚手架用法和错误速查。核心规则速览：

- 技巧文章在 `content/tips/<slug>.md`，必填 frontmatter：title / slug / summary(≤60字) / category / toolVersion / verifiedAt / publishedAt。
- slug 只允许小写字母、数字、连字符，全站唯一；category 与 tools 必须先在 `categories.json` / `tools.json` 登记。
- 正文至少一个 `## ` 二级标题，推荐 `## 操作` + `## 注意事项` 结构。
- `verifiedAt` 必须实机验证后如实填写，禁止占位日期——这是本站的信誉承诺。
- 月刊在 `content/issues/YYYY-MM.md`；关于页是 `content/about.md`。

## 提交与 CI

- 小步提交，使用 `chore/feat/docs/ci` 等 conventional 前缀，内容文章用 `feat(content)`。
- push 到 `main` 或 PR 会触发 GitHub Actions 执行 `pnpm build`（即内容校验），本地构建红了不要推。
