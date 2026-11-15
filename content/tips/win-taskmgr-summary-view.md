---
title: "Windows：任务管理器变监控小窗，置顶看 CPU 内存"
slug: win-taskmgr-summary-view
summary: "性能页右键切\"摘要视图\"，任务管理器缩成精简监控窗，还能置顶。"
category: dev-basics
tools: []
toolVersion: "Windows 10 / 11"
verifiedAt: 2026-11-15
publishedAt: 2026-11-15
tags: [windows, 任务管理器, 性能]
---

## 操作

1. `Ctrl + Shift + Esc` 打开任务管理器 → 性能页；
2. 在图表区域**右键 → 摘要视图**；
3. 界面缩成只有 CPU / 内存 / 磁盘 / 网络四组数字的小窗；
4. 再右键勾选"置于顶层"，它就是一块常驻的迷你监控屏。

压测、编译、跑批的时候放屏幕角落盯着，比整页的性能监视器轻量得多。

## 注意事项

- 摘要视图下单击某个图表，会只保留那一项指标，双击恢复。
- 重启后小窗不会自动恢复，需要重新设置一次。
- 想要历史曲线和详细计数器，还是"性能监视器"（perfmon）更专业。
