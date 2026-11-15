#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import readline from 'node:readline/promises';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const contentDir = path.join(root, 'content');
const categories = JSON.parse(fs.readFileSync(path.join(contentDir, 'categories.json'), 'utf8'));
const tools = JSON.parse(fs.readFileSync(path.join(contentDir, 'tools.json'), 'utf8'));

// 支持两种用法：交互式（TTY）与管道输入（CI/脚本）
let pipedLines = null;
if (!process.stdin.isTTY) {
  const chunks = [];
  for await (const chunk of process.stdin) chunks.push(chunk);
  pipedLines = Buffer.concat(chunks).toString('utf8').split(/\r?\n/);
}

const rl = pipedLines ? null : readline.createInterface({ input: process.stdin, output: process.stdout });
const ask = async (question, fallback) => {
  if (pipedLines) {
    const answer = (pipedLines.shift() ?? '').trim();
    console.log(`${question}：${answer || fallback}`);
    return answer || fallback;
  }
  const suffix = fallback ? `（默认 ${fallback}）` : '';
  const answer = (await rl.question(`${question}${suffix}：`)).trim();
  return answer || fallback;
};

const today = new Date().toLocaleDateString('sv-SE');

const title = await ask('标题');
if (!title) {
  console.error('标题必填');
  process.exit(1);
}
const defaultSlug =
  title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'new-tip';
const slug = await ask('slug', defaultSlug);

console.log('栏目：');
categories.forEach((category, i) => console.log(`  ${i + 1}. ${category.name}（${category.slug}）`));
const categoryIndex = await ask('选择栏目编号', '1');
const category = categories[Number(categoryIndex) - 1]?.slug ?? categories[0].slug;

console.log(`已登记工具：${tools.map((tool) => tool.slug).join(', ')}`);
const toolsInput = await ask('tools（逗号分隔 slug，可空）', '');
const toolList = toolsInput ? toolsInput.split(',').map((s) => s.trim()).filter(Boolean) : [];

const toolVersion = await ask('验证时的工具版本', '1.x');
const verifiedAt = await ask('实测日期（YYYY-MM-DD）', today);
const publishedAt = await ask('发布日期（YYYY-MM-DD）', today);
const tagsInput = await ask('标签（逗号分隔，可空）', '');
const tags = tagsInput ? tagsInput.split(',').map((s) => s.trim()).filter(Boolean) : [];
rl?.close();

const file = path.join(contentDir, 'tips', `${slug}.md`);
if (fs.existsSync(file)) {
  console.error(`文件已存在：${file}`);
  process.exit(1);
}

const content = `---
title: "${title.replace(/"/g, '\\"')}"
slug: ${slug}
summary: "一句话结论，60 字以内"
category: ${category}
tools: [${toolList.join(', ')}]
toolVersion: "${toolVersion}"
verifiedAt: ${verifiedAt}
publishedAt: ${publishedAt}
tags: [${tags.join(', ')}]
---

## 问题

<!-- 读者会遇到的具体场景 -->

## 方案

<!-- 步骤 + 可复制的配置/命令 -->

## 注意事项

<!-- 坑与边界情况 -->

## 相关技巧

<!-- /tips/ 下其他技巧的链接 -->
`;

fs.writeFileSync(file, content);
console.log(`已创建 ${path.relative(root, file)}`);
console.log('写完正文并实机验证后，请确认 verifiedAt 为实际验证日期。');
