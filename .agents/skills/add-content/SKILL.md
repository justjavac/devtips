---
name: add-content
description: 为 DevTips 站点添加或更新内容（技巧文章、月刊、栏目、工具登记、关于页）。当用户要求写文章、新增技巧/月刊/栏目/工具、或更新 content/ 下任何内容时使用。
---

# 添加内容

## 内容模型

| 内容 | 位置 | 说明 |
|---|---|---|
| 技巧文章 | `content/tips/<slug>.md` | 站点主体，一篇一个技巧 |
| 月刊 | `content/issues/YYYY-MM.md` | 每月汇总 |
| 栏目 | `content/categories.json` | 文章必须归入已登记栏目 |
| 工具 | `content/tools.json` | 文章通过 `tools` 字段关联 |
| 关于页 | `content/about.md` | 纯 Markdown，无 frontmatter |

所有内容在 `pnpm build` 时由 `scripts/lib/content.mjs` 统一校验，**校验失败 = 构建失败 = CI 失败**。改完内容必须跑一次构建。

## 新增技巧文章

### 方式一：脚手架（推荐）

```bash
pnpm new          # 交互式，依次询问各项字段
```

非交互（管道）模式，按行依次提供答案：

```bash
printf '文章标题\nmy-slug\n1\n\nWindows 10 / 11\n2026-11-15\n2026-11-15\nwindows, 效率\n' | pnpm new
```

问题顺序：标题 → slug → 栏目编号 → tools（逗号分隔，可空）→ toolVersion → verifiedAt → publishedAt → tags（逗号分隔，可空）。

### 方式二：手写

在 `content/tips/` 下新建 `<slug>.md`，frontmatter 规范：

| 字段 | 必填 | 规则 |
|---|---|---|
| `title` | 是 | 文章标题 |
| `slug` | 是 | 只允许小写字母、数字、连字符；全站唯一；约定与文件名一致 |
| `summary` | 是 | ≤60 字（按字符数）。一句话结论，渲染在页首"结论"callout 和列表摘要 |
| `category` | 是 | 必须在 `categories.json` 已登记 |
| `tools` | 否 | 数组，每个 slug 必须在 `tools.json` 已登记；没有就写 `[]` |
| `toolVersion` | 是 | 验证时的版本，如 `"Windows 10 / 11"`、`"1.2.3"` |
| `verifiedAt` | 是 | `YYYY-MM-DD`。**必须真实实机验证后填写** |
| `publishedAt` | 是 | `YYYY-MM-DD`，决定排序与月刊归档 |
| `tags` | 否 | 数组，自由词，自动生成标签页；共同 tags/tools 会自动关联"相关技巧"（取前 3 篇） |
| `deprecated` | 否 | 对象，必须含 `atVersion`，用于标记已失效技巧 |

正文要求：

- **至少包含一个 `## ` 二级标题**（构建硬性校验）。
- 推荐结构：`## 操作`（步骤/表格/可复制的命令）→ `## 注意事项`（坑与边界情况）。
- `summary` 就是"一句话技巧"，页面会自动渲染成页首结论 callout，**不要在正文开头重复抄写**。
- "相关技巧"区块由站点按共同 tags/tools 自动生成，无需手写链接列表。
- 代码块标注语言；快捷键用行内代码格式，如 `Win + V`。

## 新增栏目

编辑 `content/categories.json`，追加：

```json
{ "slug": "my-category", "name": "栏目名", "desc": "一句话描述" }
```

slug 规则同文章。**栏目被文章使用后不要改 slug**，已发布外链会失效。

## 登记工具

编辑 `content/tools.json`，追加：

```json
{
  "slug": "my-tool",
  "name": "工具名",
  "desc": "一句话描述",
  "url": "https://官网",
  "pricing": "免费 / 订阅制 $x/月 …",
  "availability": "国内直连可用 / 需要代理 …"
}
```

工具详情页会展示官网、定价、国内可用性，三个字段都要填。登记后文章 frontmatter 的 `tools` 才能引用该 slug。

## 新增月刊

新建 `content/issues/YYYY-MM.md`。frontmatter 全部可省：`month` 默认取文件名（必须 `YYYY-MM` 形式），`title` 默认取 month，`publishedAt` 默认当月 1 号。列表摘要自动取正文第一段（80 字内），第一段请写成整月概览。

## 修改关于页

直接编辑 `content/about.md`，纯 Markdown，无需 frontmatter。

## 验证流程（必做）

1. `pnpm build` —— 内容校验挂在构建里，字段或格式问题会直接报错退出，按错误信息逐个修。
2. `pnpm preview --port 4174`，浏览器抽查首页与新增页面的实际渲染。
3. 推送到 `main` 后 GitHub Actions 会再跑一遍同样的构建，本地红了不要推。

## 常见校验错误速查

| 报错关键词 | 原因与修法 |
|---|---|
| `缺少必填字段` | 对照上方字段表补齐 |
| `slug 非法` | 只允许小写字母、数字、连字符 |
| `slug 重复` | 换 slug；先 `ls content/tips/` 看已有 |
| `summary 超过 60 字` | 精简到 60 字内（标点也算） |
| `category 未在 categories.json 中登记` | 先登记栏目或改用已有 slug |
| `tools 包含未登记的工具` | 先在 tools.json 登记 |
| `必须是 YYYY-MM-DD 格式的日期` | 日期加引号或修正格式 |
| `正文必须包含至少一个二级标题` | 补 `## 操作` 等小节 |

## 编辑原则

- `verifiedAt` 是站点的信誉承诺：实机验证通过后才填写真实日期，不要用占位日期。
- 一篇只讲一个技巧，目标 1–3 分钟读完；细节进"注意事项"，不要堆在操作步骤里。
- 内容面向开发者（不是面向 AI 工具），AI 相关只是栏目之一。
