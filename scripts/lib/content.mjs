import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { createMarkdownRenderer } from './markdown.mjs';

let rendererPromise = null;
function getRenderer() {
  rendererPromise ||= createMarkdownRenderer();
  return rendererPromise;
}

function fail(file, message) {
  throw new Error(`[content] ${file}: ${message}`);
}

function normalizeDate(value, field, file) {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString().slice(0, 10);
  }
  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value.trim())) {
    return value.trim();
  }
  fail(file, `${field} 必须是 YYYY-MM-DD 格式的日期`);
}

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function validateTip(fm, file, dict) {
  for (const field of ['title', 'slug', 'summary', 'category', 'toolVersion', 'verifiedAt', 'publishedAt']) {
    if (fm[field] === undefined || fm[field] === null || fm[field] === '') {
      fail(file, `缺少必填字段 ${field}`);
    }
  }
  if (!SLUG_RE.test(String(fm.slug))) fail(file, `slug 非法：${fm.slug}（只允许小写字母、数字、连字符）`);
  const summaryLength = [...String(fm.summary)].length;
  if (summaryLength > 60) fail(file, `summary 超过 60 字（当前 ${summaryLength} 字）`);
  if (!dict.categorySlugs.has(fm.category)) fail(file, `category 未在 categories.json 中登记：${fm.category}`);
  const tools = fm.tools ?? [];
  if (!Array.isArray(tools)) fail(file, 'tools 必须是数组');
  for (const tool of tools) {
    if (!dict.toolSlugs.has(tool)) fail(file, `tools 包含未登记的工具：${tool}`);
  }
  if (fm.tags !== undefined && !Array.isArray(fm.tags)) fail(file, 'tags 必须是数组');
  if (fm.deprecated !== undefined) {
    if (typeof fm.deprecated !== 'object' || !fm.deprecated?.atVersion) {
      fail(file, 'deprecated 需要 atVersion 字段');
    }
  }
}

function pushMap(map, key, value) {
  if (!map.has(key)) map.set(key, []);
  map.get(key).push(value);
}

export async function loadSite(root) {
  const contentDir = path.join(root, 'content');
  const categories = JSON.parse(fs.readFileSync(path.join(contentDir, 'categories.json'), 'utf8'));
  const tools = JSON.parse(fs.readFileSync(path.join(contentDir, 'tools.json'), 'utf8'));
  const dict = {
    categorySlugs: new Set(categories.map((c) => c.slug)),
    toolSlugs: new Set(tools.map((t) => t.slug)),
  };
  const md = await getRenderer();

  const tipsDir = path.join(contentDir, 'tips');
  const seenSlugs = new Set();
  const tips = [];
  if (fs.existsSync(tipsDir)) {
    for (const file of fs.readdirSync(tipsDir).filter((f) => f.endsWith('.md')).sort()) {
      const raw = fs.readFileSync(path.join(tipsDir, file), 'utf8');
      const { data: fm, content } = matter(raw);
      validateTip(fm, file, dict);
      if (seenSlugs.has(fm.slug)) fail(file, `slug 重复：${fm.slug}`);
      seenSlugs.add(fm.slug);
      if (!/^##\s/m.test(content)) fail(file, '正文必须包含至少一个二级标题（## 问题 → 方案 …）');
      tips.push({
        ...fm,
        slug: String(fm.slug),
        title: String(fm.title),
        summary: String(fm.summary),
        tools: fm.tools ?? [],
        tags: (fm.tags ?? []).map(String),
        verifiedAt: normalizeDate(fm.verifiedAt, 'verifiedAt', file),
        publishedAt: normalizeDate(fm.publishedAt, 'publishedAt', file),
        html: md.render(content),
        raw,
      });
    }
  }
  tips.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt) || a.slug.localeCompare(b.slug));

  tips.forEach((tip, i) => {
    tip.olderSlug = tips[i + 1]?.slug ?? null;
    tip.newerSlug = tips[i - 1]?.slug ?? null;
  });
  for (const tip of tips) {
    const sameTool = tips.filter((t) => t.slug !== tip.slug && t.tools.some((tool) => tip.tools.includes(tool)));
    const sameTag = tips.filter((t) => t.slug !== tip.slug && t.tags.some((tag) => tip.tags.includes(tag)));
    tip.related = [...new Set([...sameTool, ...sameTag])].slice(0, 3).map((t) => t.slug);
  }

  const issuesDir = path.join(contentDir, 'issues');
  const issues = [];
  if (fs.existsSync(issuesDir)) {
    for (const file of fs.readdirSync(issuesDir).filter((f) => f.endsWith('.md')).sort()) {
      const raw = fs.readFileSync(path.join(issuesDir, file), 'utf8');
      const { data: fm, content } = matter(raw);
      const month = String(fm.month ?? file.replace(/\.md$/, ''));
      if (!/^\d{4}-\d{2}$/.test(month)) fail(file, `month 必须是 YYYY-MM 形式：${month}`);
      const firstParagraph = content.trim().split(/\n\s*\n/)[0] ?? '';
      issues.push({
        month,
        title: String(fm.title ?? month),
        summary: firstParagraph.replace(/[#*>\[\]()`]/g, '').slice(0, 80),
        publishedAt: fm.publishedAt ? normalizeDate(fm.publishedAt, 'publishedAt', file) : `${month}-01`,
        html: md.render(content),
      });
    }
  }
  issues.sort((a, b) => b.month.localeCompare(a.month));

  const aboutFile = path.join(contentDir, 'about.md');
  const about = fs.existsSync(aboutFile)
    ? { html: md.render(matter(fs.readFileSync(aboutFile, 'utf8')).content) }
    : { html: '<p>关于页面内容缺失。</p>' };

  const byCategory = new Map();
  const byTool = new Map();
  const byTag = new Map();
  const byMonth = new Map();
  for (const tip of tips) {
    pushMap(byCategory, tip.category, tip);
    pushMap(byMonth, tip.publishedAt.slice(0, 7), tip);
    for (const tool of tip.tools) pushMap(byTool, tool, tip);
    for (const tag of tip.tags) pushMap(byTag, tag, tip);
  }

  return {
    tips,
    categories,
    tools,
    issues,
    about,
    tipsBySlug: Object.fromEntries(tips.map((t) => [t.slug, t])),
    categoriesBySlug: Object.fromEntries(categories.map((c) => [c.slug, c])),
    toolsBySlug: Object.fromEntries(tools.map((t) => [t.slug, t])),
    byCategory,
    byTool,
    byTag,
    byMonth,
  };
}

// dev 模式缓存：content 目录有文件变动才重建
let cache = null;

export async function loadSiteCached(root) {
  const fingerprint = dirFingerprint(path.join(root, 'content'));
  if (cache && cache.fingerprint === fingerprint) return cache.site;
  const site = await loadSite(root);
  cache = { fingerprint, site };
  return site;
}

function dirFingerprint(dir) {
  if (!fs.existsSync(dir)) return 'empty';
  const parts = [];
  const walk = (current) => {
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const full = path.join(current, entry.name);
      if (entry.isDirectory()) {
        walk(full);
      } else {
        const stat = fs.statSync(full);
        parts.push(`${full}:${stat.mtimeMs}:${stat.size}`);
      }
    }
  };
  walk(dir);
  return parts.sort().join('|');
}
