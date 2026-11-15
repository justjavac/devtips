---
title: "Windows：任务管理器里 Ctrl +\"运行新任务\"＝直接开 CMD"
slug: win-taskmgr-run-cmd
summary: "任务管理器按住 Ctrl 点\"运行新任务\"，跳过输入框直接弹出命令提示符。"
category: dev-basics
tools: []
toolVersion: "Windows 10 / 11"
verifiedAt: 2026-11-15
publishedAt: 2026-11-15
tags: [windows, 任务管理器, 冷知识]
---

## 操作

任务管理器 → 文件 → 运行新任务：平时点它会弹出输入框；**按住 Ctrl 再点**，直接弹出命令提示符窗口。

桌面环境崩了的时候特别好用——`Ctrl + Shift + Esc` 开任务管理器，Ctrl+运行新任务唤出 cmd，输入 `explorer` 回车，桌面原地复活。

## 注意事项

- 打开的 cmd 权限等同当前会话；任务管理器本身以管理员运行时，cmd 也是管理员。
- 有未保存数据时别拿它乱试进程操作。
- 这是系统深藏的组合习惯之一，知道的人不多。
