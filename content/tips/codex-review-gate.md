---
title: "Codex：Claude 写、Codex 审，审不过不许收工"
slug: codex-review-gate
summary: "官方插件给 Claude Code 挂审查闸：每次回答结束前须先过 Codex 一轮 review。"
category: workflow
tools: ["codex"]
toolVersion: "codex-plugin-cc（2026-11 官方插件）"
verifiedAt: 2026-11-15
publishedAt: 2026-11-15
tags: [codex, claude-code, 代码审查]
---

## 操作

OpenAI 官方给 Claude Code 出过插件 **codex-plugin-cc**，两个招牌功能：

1. **Review Gate**：开启后挂一个 Stop hook——Claude 每次准备结束回答，都要先让 Codex 针对本轮改动做一轮审查；审出问题，结束就被拦下，Claude 得先把问题改掉。相当于给 Claude 配了一个别家出身的审稿人。
2. **`/codex:transfer` 会话接力**：把当前 Claude Code 会话转成持久的 Codex 线程并打印 `codex resume <session-id>`。Claude 额度见底或想换模型接着推进，把这条命令贴进 Codex 就能续上，来龙去脉不用重讲。

## 注意事项

- 官方写明代价：两家可能来回循环，额度烧得很快——**关键改动时临时打开，别常驻**。
- 适合"写/审分离"工作流：Claude 负责写，Codex 负责挑刺。
- 插件行为随版本变化快，装前看一眼仓库 README 的当前说明。
