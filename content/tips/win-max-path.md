---
title: "Windows：解除 260 字符路径限制（LongPathsEnabled）"
slug: win-max-path
summary: "注册表 LongPathsEnabled=1 让系统放开 MAX_PATH 260 字符限制。"
category: dev-basics
tools: []
toolVersion: "Windows 10 / 11"
verifiedAt: 2026-11-15
publishedAt: 2026-11-15
tags: [windows, 开发环境, 注册表]
---

## 操作

1. `Win + R` → `regedit`，定位 `HKLM\SYSTEM\CurrentControlSet\Control\FileSystem`；
2. 把 `LongPathsEnabled`（DWORD）改为 `1`；
3. 或管理员 PowerShell 一行搞定：

```powershell
New-ItemProperty -Path 'HKLM:\SYSTEM\CurrentControlSet\Control\FileSystem' -Name LongPathsEnabled -Value 1 -PropertyType DWORD -Force
```

4. 重启生效。

这解除了系统的 260 字符（`MAX_PATH`）限制。前提是应用本身声明支持长路径（带 `longPathAware` 清单）——git、Node.js、VS Code 等主流工具链开启后都正常；个别老程序依旧报"路径太长"时只能手动缩短目录层级。

## 注意事项

- 已实测：本机该值已为 `1`（部分新系统出厂默认开启）。
- 组策略等效项：计算机配置 → 管理模板 → 系统 → 文件系统 → "启用 Win32 长路径"。
- 注册表只是"放行"，具体应用不吃这套时还得看它自己的设置（如 `git config --system core.longpaths true`）。
