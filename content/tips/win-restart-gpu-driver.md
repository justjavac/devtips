---
title: "Windows：Win + Ctrl + Shift + B，一秒重启显卡驱动"
slug: win-restart-gpu-driver
summary: "外接屏不亮、花屏、切游戏黑屏时按它，重启显卡驱动不用整机重启。"
category: dev-basics
tools: []
toolVersion: "Windows 10 / 11"
verifiedAt: 2026-11-15
publishedAt: 2026-11-15
tags: [windows, 显卡, 救急]
---

## 操作

画面异常但系统还活着时：

```text
Win + Ctrl + Shift + B
```

屏幕黑一秒、听到一声"嘟"，显卡驱动完成重启——外接显示器点不亮、窗口拖动花屏、全屏游戏切回桌面黑屏，大部分情况直接复活。远程帮人修电脑时最常用的一招。

## 注意事项

- 只重启显卡驱动，不动你的数据；但正在全屏渲染的程序可能闪退，存档党先存盘。
- 按了没反应，说明卡死的不是显卡，走 `Ctrl + Shift + Esc` 查进程。
- 经常需要按就要查根因：线材、驱动版本、刷新率/色深设置。
