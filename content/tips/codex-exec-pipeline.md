---
title: "Codex：codex exec 当函数用，输出结构化 JSON 还能接力"
slug: codex-exec-pipeline
summary: "codex exec 非交互执行：按 JSON Schema 输出到文件，resume --last 两段式接力。"
category: ai-tools
tools: ["codex"]
toolVersion: "Codex CLI（2026-11 官方文档）"
verifiedAt: 2026-11-15
publishedAt: 2026-11-15
tags: [codex, cli, 自动化]
---

## 操作

`codex exec` 是非交互模式，适合被脚本调用：

```bash
codex exec "Extract project metadata" \
  --output-schema ./schema.json \
  -o ./project-metadata.json
```

- `--output-schema`：让 Codex 按你给的 JSON Schema 输出，脚本直接解析；
- `-o`：结果写进文件，不落终端。

更妙的是**两段式流水线**：

```bash
codex exec "review the change for race conditions"
codex exec resume --last "fix the race conditions you found"
```

第二步接着第一步的上下文跑，"你找到的问题"指什么它自己知道。两步之间还能插一道人工确认或脚本检查，通过后再让它动手修。

## 注意事项

- 非交互模式没有人工确认环节，给的权限越宽越要在上游做校验。
- schema 写得越具体（字段、类型、枚举），输出越稳定。
- 适合接进 CI、pre-commit 或批处理脚本；交互式探索还是回 `codex` 对话框。
