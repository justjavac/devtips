---
title: "Windows：资源管理器变卡？连按两次 F11 有奇效"
slug: win-f11-explorer-fix
summary: "资源管理器里按 F11 全屏再退出，切目录卡顿、缩略图慢加载明显改善。"
category: dev-basics
tools: []
toolVersion: "Windows 10 / 11"
verifiedAt: 2026-11-15
publishedAt: 2026-11-15
tags: [windows, 资源管理器, 冷知识]
---

## 操作

资源管理器窗口里**按一下 F11 全屏，再按一下退出**——就这一进一出，切换目录时那一下空窗卡顿消失了，图片文件夹的缩略图加载也明显变快。

原因可能是全屏切换重置了窗口的某些渲染状态；GitHub 上有现成的 AutoHotkey 脚本（ExplorerF11Fix）帮你自动完成这套动作，开机常驻。

## 注意事项

- 属"玄学"类经验：多数人有效，但不是官方功能，机理不明。
- 新开窗口可能又变卡，按一次就好。
- 想根治卡顿，先排查：缩略图缓存、预览窗格、第三方 shell 扩展。
