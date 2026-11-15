---
title: "Windows：Win + Shift + ←/→，窗口瞬间搬到另一块屏"
slug: win-move-window-across-monitors
summary: "多显示器下 Win+Shift+方向键，窗口原样移到左/右显示器，免缩放拖拽"
category: dev-basics
tools: []
toolVersion: "Windows 10 / 11"
verifiedAt: 2026-11-15
publishedAt: 2026-11-15
tags: [windows, 多显示器, 窗口管理]
---

## 操作

窗口处于焦点时：

- `Win + Shift + ←` —— 移到左边那块显示器；
- `Win + Shift + →` —— 移到右边那块显示器。

搬过去的窗口位置和尺寸保持，不需要先还原、拖过去、再最大化。IDE 开在副屏、想临时搬回主屏看效果时，一秒完成。

## 注意事项

- 需要**两台及以上显示器**，方向按"设置 → 系统 → 显示"里的物理排列。
- 单显示器上按了不会报错，窗口原地不动——别以为自己按错了。
- 笔记本 + 扩展坞的通勤场景最常用：拔插外屏前后一键归位。
