---
title: "Windows：con、aux、nul 这些名字 40 年前就被占了"
slug: win-reserved-device-names
summary: "CON/AUX/NUL/PRN/COM1~9 是 DOS 保留设备名，今天仍不能用来命名文件。"
category: dev-basics
tools: []
toolVersion: "Windows 10 / 11"
verifiedAt: 2026-11-15
publishedAt: 2026-11-15
tags: [windows, 文件系统, 冷知识]
---

## 操作

在资源管理器或命令行里建一个名为 `con` 的文件夹？系统会直接拒绝。这批保留名继承自 DOS 时代：`CON`（控制台）、`AUX`（辅助设备）、`NUL`（空设备）、`PRN`（打印机），以及 `COM1`~`COM9`、`LPT1`~`LPT9`。

不只是文件夹——连 `con.txt` 这种"带后缀"的名字也不行：`echo hi > con.txt` 不会创建文件，而是写进了 CON 设备，内容直接消失在终端里。

实用角度：

- 写脚本时 `xxx > nul` 是惯用法（把输出丢进空设备）；
- 程序下载、解压遇到这批名字会莫名失败——知道原因少走弯路。

## 注意事项

- 真需要这类名字的文件，可用 `\\?\` 扩展路径前缀绕过：`mkdir "\\?\C:\work\con"`。
- 限制对文件和文件夹一视同仁，Windows 10/11 依旧有效。
- 已实测：本机 `mkdir con/aux/nul/prn/com1/lpt1` 全部被拒；`echo hi > con.txt` 不产生任何文件。
