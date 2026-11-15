---
title: "Codex：--profile 叠加配置，按任务换模型底座"
slug: codex-profile-provider
summary: "用 --profile 叠加 config.toml 按任务切模型底座，subagent 各配各的模型。"
category: ai-tools
tools: ["codex"]
toolVersion: "Codex CLI（2026-11 官方文档）"
verifiedAt: 2026-11-15
publishedAt: 2026-11-15
tags: [codex, 配置, 模型]
---

## 操作

`codex --profile 名字` 会先加载 `~/.codex/config.toml`，再把 `~/.codex/名字.config.toml` 叠加上去。把不同底座写进不同 profile，按任务分次运行：

```bash
codex --profile deepseek    # 跑便宜的 DeepSeek
codex --profile default     # 回 OpenAI 主力模型
```

`model_providers` 不限于 OpenAI——官方示例里就有指向 Mistral 官方 API 和本地 Ollama 的写法。跨 provider 的组合（"GPT 写、别家模型审"）全程都在 Codex 里完成。

**搭配 subagent 更省**：自定义 agent 文件可以给子任务单独设**模型**和指令——翻代码、找文件的 explorer 用便宜快模型，代码审查把推理强度拉高，钱花在刀刃上。

## 注意事项

- subagent 的权限、provider 和 MCP server **继承父会话**，agent 文件改不了这些——跨厂商换底座要走 `--profile`。
- 第三方 provider 需兼容 Codex 的 Responses API 调用。
- 切换 profile 后建议新开对话，避免旧上下文带着旧底座的假设。
