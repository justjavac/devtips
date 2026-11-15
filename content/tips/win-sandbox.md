---
title: "Windows：Windows 沙盒，一次性干净系统随便造"
slug: win-sandbox
summary: "可疑文件丢进沙盒里运行，关闭即焚毁全部痕迹，不留任何数据。"
category: dev-basics
tools: []
toolVersion: "Windows 10 / 11 专业版"
verifiedAt: 2026-11-15
publishedAt: 2026-11-15
tags: [windows, 安全, 沙盒]
---

## 操作

1. `Win + R` → 输入 `optionalfeatures` → 勾选"Windows 沙盒"（或管理员 PowerShell 执行 `Enable-WindowsOptionalFeature -Online -FeatureName Containers-DisposableClientVM`）；
2. 重启后，开始菜单启动"Windows 沙盒"；
3. 把可疑安装包、来路不明的文件**拖进**沙盒窗口运行，随便折腾；
4. 关闭沙盒窗口——里面发生的一切灰飞烟灭。

它本质是一个跑精简版 Windows 的轻量 Hyper-V 虚拟机，每次打开都是全新系统。

## 注意事项

- 需要**专业版/企业版**并开启虚拟化（BIOS 里的 VT-x/AMD-V），家庭版没有这个功能。
- 沙盒与宿主机隔离：剪贴板可传递，文件拖入即等于拷贝进沙盒。
- 进阶玩法是 `.wsb` 配置文件，可挂载宿主机目录、预装软件（适合演示环境）。
