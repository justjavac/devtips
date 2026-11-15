---
title: "Windows 11：任务栏右键直接\"结束任务\"，卡死不用翻管理器"
slug: win-taskbar-end-task
summary: "开发者选项里打开\"结束任务\"，右键任务栏图标即可干掉卡死进程。"
category: dev-basics
tools: []
toolVersion: "Windows 11"
verifiedAt: 2026-11-15
publishedAt: 2026-11-15
tags: [windows, 任务管理器, 效率]
---

## 操作

1. 设置 → 系统 → 开发者选项 → 打开"结束任务"；
2. 软件无响应时，右键它的任务栏图标 →"结束任务"，一步杀掉。

省去 `Ctrl + Shift + Esc` 再翻进程列表的整个流程，卡死的窗口秒关。

## 注意事项

- 需要 Windows 11 较新版本（22H2+），找不到入口先更新系统。
- 结束的是整个进程，未保存的内容照样丢，点之前确认。
- 任务栏图标右键没反应时，老办法任务管理器仍然兜底。
