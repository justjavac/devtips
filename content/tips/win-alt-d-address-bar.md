---
title: "Windows：Alt + D 直达地址栏，整条路径粘贴回车"
slug: win-alt-d-address-bar
summary: "Alt+D 选中地址栏（资源管理器/浏览器通用），粘路径回车直达深层目录"
category: dev-basics
tools: []
toolVersion: "Windows 10 / 11"
verifiedAt: 2026-11-15
publishedAt: 2026-11-15
tags: [windows, 资源管理器, 路径]
---

## 操作

1. `Win + E` 打开资源管理器；
2. `Alt + D` 选中地址栏里的现有路径；
3. 粘贴完整路径，如 `D:\Code\devtips\content\tips`，回车直达。

配合 `Shift + 右键 → 复制为路径` 正好闭环：别人发来的深层共享目录、报错日志里的路径——复制 → `Win + E` → `Alt + D` → 粘 → 回车，不用一层层点。浏览器里 `Alt + D` 同样选中地址栏（等价 `Ctrl + L`），输网址、搜关键词都通用。

## 注意事项

- 路径不区分大小写，斜杠方向打错了多数情况也能识别。
- 需要资源管理器窗口处于前台，`Alt + D` 不会替你唤起窗口。
- 贴带引号的路径（`"D:\..."`）也能正常识别。
