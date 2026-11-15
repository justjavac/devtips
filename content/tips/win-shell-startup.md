---
title: "Windows：shell:startup 直达启动文件夹，开机自启一拖搞定"
slug: win-shell-startup
summary: "Win+R 输 shell:startup 打开启动文件夹，快捷方式拖进去就开机自启。"
category: dev-basics
tools: []
toolVersion: "Windows 10 / 11"
verifiedAt: 2026-11-15
publishedAt: 2026-11-15
tags: [windows, 启动, 效率]
---

## 操作

1. `Win + R` → 输入 `shell:startup` → 回车；
2. 把程序的快捷方式拖进去（或在文件夹里右键 → 新建 → 快捷方式，指向目标 exe）；
3. 下次登录 Windows 它自动运行；想取消就删掉那个快捷方式。

比任务管理器的"启动应用"页直观，适合本身没有"开机启动"选项的软件。

## 注意事项

- 这个位置只影响**当前用户**；要所有用户都启动，用 `shell:common startup`。
- 已实测：本机该路径即 `%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup`，真实存在。
- 别把太多东西丢进去，开机变慢先查这里和任务管理器的启动页。
