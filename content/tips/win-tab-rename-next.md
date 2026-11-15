---
title: "Windows：重命名按 Tab 接力，批量改名一条链走完"
slug: win-tab-rename-next
summary: "F2 改名时按 Tab 确认当前并跳到下一个文件继续改，全程键盘"
category: dev-basics
tools: []
toolVersion: "Windows 10 / 11"
verifiedAt: 2026-11-15
publishedAt: 2026-11-15
tags: [windows, 文件管理, 批量]
---

## 操作

要"逐个起不同名"时，比全选批量编号更顺：

1. 选中第一个文件按 `F2`，输入新名；
2. 按 `Tab`——当前文件改名完成，光标直接落到**下一个文件**的重命名框；
3. 继续输入、`Tab`……最后一个按 `Enter` 收尾；
4. 中途 `Esc` 只取消当前这一个，已确认的不会回滚。

`Shift + Tab` 反向跳回上一个文件。

## 注意事项

- 适合"每个名字都不一样"的场景；要"同名 + 序号"请用 F2 全选批量改名（另见批量重命名篇）。
- 链式顺序 = 列表当前顺序，先排好序再改名。
- 该链式操作在 Windows 11 新资源管理器同样有效。
