---
title: "Windows：Win + PrtSc 全屏截图，自动存成图片文件"
slug: win-printscreen-save
summary: "Win+PrtSc 全屏截图直接存盘，省去框选、粘贴、另存为。"
category: dev-basics
tools: []
toolVersion: "Windows 10 / 11"
verifiedAt: 2026-11-15
publishedAt: 2026-11-15
tags: [windows, 截图]
---

## 操作

`Win + PrtSc` 一按，屏幕闪一下，全屏截图已经存进 `图片\屏幕截图` 文件夹——PNG 格式、自动编号，和手机截图体验一致，再也不用"截图 → 开画图 → 粘贴 → 另存为"。

配套三兄弟各管一段：

| 快捷键 | 行为 |
| --- | --- |
| `PrtSc` | 全屏 → 剪贴板（需自己粘贴） |
| `Alt + PrtSc` | 仅当前窗口 → 剪贴板 |
| `Win + Shift + S` | 框选任意区域 → 剪贴板 + 截图工具编辑 |
| `Win + PrtSc` | 全屏 → 直接存文件 |

## 注意事项

- 装了 OneDrive 并开启"自动保存屏幕截图"时，单按 `PrtSc` 会被接管成自动存盘（存到 OneDrive 目录），`Win + PrtSc` 行为不变。
- 截图文件按"屏幕截图 (1).png"递增编号，记得定期清理。
- 笔记本的 PrtSc 常与功能键复用，可能需要配合 `Fn` 键。
