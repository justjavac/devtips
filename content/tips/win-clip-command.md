---
title: "Windows：ipconfig | clip，命令输出直接进剪贴板"
slug: win-clip-command
summary: "任意命令后面接 | clip，结果不进屏幕直接进剪贴板，Ctrl+V 就能贴。"
category: dev-basics
tools: []
toolVersion: "Windows 10 / 11"
verifiedAt: 2026-11-15
publishedAt: 2026-11-15
tags: [windows, 命令行, 剪贴板]
---

## 操作

Windows 自带 `clip.exe`，把上游输出截进剪贴板：

```bat
ipconfig | clip         :: 网络配置整段复制
dir | clip              :: 当前目录文件列表
type error.log | clip   :: 整份日志
systeminfo | clip       :: 整机配置信息
```

配合 `Win + V` 剪贴板历史（本站另篇）更香——历史里躺着的就是干净文本，贴进工单、聊天框或文档都行。

## 注意事项

- clip 只收文本；输出乱码多半是代码页问题，先 `chcp 65001` 再执行。
- 已实测：echo 内容经 `| clip` 后剪贴板原样取回。
