import MarkdownIt from 'markdown-it';
import Shiki from '@shikijs/markdown-it';
import { transformerMetaHighlight } from '@shikijs/transformers';

const CJK = '[\\u2e80-\\u2eff\\u2f00-\\u2fdf\\u3040-\\u309f\\u30a0-\\u30ff\\u3100-\\u312f\\u3200-\\u32ff\\u3400-\\u4dbf\\u4e00-\\u9fff\\uf900-\\ufaff\\uff01-\\uff5e]';
const CJK_BEFORE_ASCII = new RegExp(`(${CJK})([A-Za-z0-9])`, 'g');
const ASCII_BEFORE_CJK = new RegExp(`([A-Za-z0-9])(${CJK})`, 'g');

function addCjkSpacing(text) {
  return text.replace(CJK_BEFORE_ASCII, '$1 $2').replace(ASCII_BEFORE_CJK, '$1 $2');
}

function escapeHtml(value) {
  return String(value ?? '').replace(
    /[&<>"']/g,
    (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[ch],
  );
}

function slugifyHeading(text) {
  return text
    .trim()
    .toLowerCase()
    .replace(/[`~!@#$%^&*()+=[\]{}|\\:;"'<>,.?/！？，。、；：「」『』（）《》·—…￥]/g, '')
    .replace(/\s+/g, '-');
}

const copyIcon = `<svg class="icon-copy" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>`;
const checkIcon = `<svg class="icon-check" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>`;

export async function createMarkdownRenderer() {
  const md = MarkdownIt({ html: false, linkify: true });

  const shikiPlugin = await Shiki({
    themes: { light: 'github-light', dark: 'github-dark' },
    defaultColor: false,
    transformers: [transformerMetaHighlight()],
  });
  md.use(shikiPlugin);

  // 标题 id 锚点（同页去重）
  md.core.ruler.push('heading_ids', (state) => {
    const used = new Set();
    for (let i = 0; i < state.tokens.length; i += 1) {
      const token = state.tokens[i];
      if (token.type !== 'heading_open') continue;
      const inline = state.tokens[i + 1];
      if (inline?.type !== 'inline') continue;
      const base = slugifyHeading(inline.content) || 'section';
      let id = base;
      let n = 1;
      while (used.has(id)) {
        n += 1;
        id = `${base}-${n}`;
      }
      used.add(id);
      token.attrSet('id', id);
    }
  });

  // 外链新窗口打开
  const renderToken = (tokens, idx, options, env, self) => self.renderToken(tokens, idx, options);
  const defaultLinkOpen = md.renderer.rules.link_open ?? renderToken;
  md.renderer.rules.link_open = (tokens, idx, options, env, self) => {
    const href = tokens[idx].attrGet('href') ?? '';
    if (/^https?:\/\//.test(href)) {
      tokens[idx].attrSet('target', '_blank');
      tokens[idx].attrSet('rel', 'noopener');
    }
    return defaultLinkOpen(tokens, idx, options, env, self);
  };

  // 中西文混排自动补空格（只作用于普通文本 token，不影响代码）
  const defaultText = md.renderer.rules.text ?? ((tokens, idx) => escapeHtml(tokens[idx].content));
  md.renderer.rules.text = (tokens, idx, options, env, self) =>
    addCjkSpacing(defaultText(tokens, idx, options, env, self));

  // 代码块外层包裹工具条（语言标注 + 复制按钮）
  const shikiFence = md.renderer.rules.fence;
  md.renderer.rules.fence = (tokens, idx, options, env, self) => {
    const info = tokens[idx].info.trim();
    const lang = (info.split(/[\s{]/)[0] || 'text').toLowerCase();
    const highlighted = shikiFence(tokens, idx, options, env, self);
    return `<div class="code-block" data-lang="${escapeHtml(lang)}"><div class="code-toolbar"><span class="code-lang">${escapeHtml(lang)}</span><button type="button" class="code-copy" data-copy aria-label="复制代码">${copyIcon}${checkIcon}<span>复制</span></button></div>${highlighted}</div>`;
  };

  return md;
}
