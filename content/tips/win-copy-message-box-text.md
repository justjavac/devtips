---
title: "Windows：弹窗内容也能 Ctrl + C，报错文本一键带走"
slug: win-copy-message-box-text
summary: "焦点在系统弹窗上按 Ctrl+C，标题、正文、按钮文本整体进剪贴板"
category: dev-basics
tools: []
toolVersion: "Windows 10 / 11"
verifiedAt: 2026-11-15
publishedAt: 2026-11-15
tags: [windows, 剪贴板, 调试]
---

## 操作

Windows 的经典消息框（MsgBox）支持整体复制：

1. 用鼠标点一下弹窗，确保它获得焦点；
2. 按 `Ctrl + C`；
3. 到记事本、聊天框或搜索引擎里 `Ctrl + V`，得到一段整齐文本：

```text
---------------------------
程序标题
---------------------------
具体的报错内容……
---------------------------
确定
---------------------------
```

以后看到报错弹窗不用手敲——复制下来直接搜；搜不到就原样贴给同事或 AI。做 GUI 开发的老手常用它抓取自家程序弹出的报错框。

## 注意事项

- 只对**经典 Win32 消息框**（`MessageBox` API）有效；UWP / 自绘弹窗不一定支持。
- 弹窗文字不可选中不代表不可复制——这正是它隐蔽的地方。
- 想复制任意窗口上的文字（不只弹窗），用 PowerToys 的 **Text Extractor**（`Win + Shift + T`）框选即 OCR，免费开源。
