import { defineConfig } from '@rsbuild/core';
import { pluginTailwindcss } from '@rsbuild/plugin-tailwindcss';
import { pluginContent } from './plugins/rsbuild-plugin-content.mjs';

export default defineConfig({
  plugins: [pluginTailwindcss(), pluginContent()],
  source: {
    entry: { index: './src/main.js' },
  },
  tools: {
    // 所有 HTML 由 pluginContent 生成，关闭内置 HTML 插件
    htmlPlugin: false,
  },
  output: {
    manifest: true,
  },
});
