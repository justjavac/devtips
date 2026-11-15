---
title: "Windows：mklink 符号链接，一个路径两个门"
slug: win-mklink
summary: "mklink /D 软链目录、/H 硬链文件，C 盘路径指到 D 盘数据，老项目无感。"
category: dev-basics
tools: []
toolVersion: "Windows 10 / 11"
verifiedAt: 2026-11-15
publishedAt: 2026-11-15
tags: [windows, 命令行, 文件系统]
---

## 操作

`mklink` 是 cmd 内建命令（PowerShell 里要调 `cmd /c mklink`）：

```bat
mklink /D "C:\Users\me\Videos" "D:\Library\Videos"   :: 目录软链接
mklink /H "C:\a.txt" "D:\real\a.txt"                 :: 文件硬链接
```

- 软链接 `/D`：访问左边路径实际落到右边——把视频、桌面、文档等大文件夹挪出 C 盘后，老项目记住的绝对路径依然有效；
- 硬链接 `/H`：两个文件名指向同一份数据，改任一边同步生效，删一个另一个还在（仅同一文件系统内支持）；
- GUI 党可用 Link Shell Extension 在右键菜单里创建（开源，SourceForge）。

## 注意事项

- 创建符号链接默认需要管理员权限；开启"开发者模式"后可免提权。
- 软链接可跨盘符，硬链接不能跨盘。
- 资源管理器移动/复制软链接时默认"跟随"到目标内容，打包归档前留意。
- 已实测：目录软链与文件硬链创建、读取均正常（`Get-Item` 显示 `LinkType=HardLink`）。
