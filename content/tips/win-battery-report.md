---
title: "Windows：powercfg /batteryreport，一键生成电池损耗报告"
slug: win-battery-report
summary: "命令行运行 powercfg /batteryreport，生成 HTML 报告看电池健康度。"
category: dev-basics
tools: []
toolVersion: "Windows 10 / 11"
verifiedAt: 2026-11-15
publishedAt: 2026-11-15
tags: [windows, 命令行, 电池]
---

## 操作

1. 以管理员身份打开终端（开始菜单搜 cmd → 右键"以管理员身份运行"）；
2. 执行：

```bat
powercfg /batteryreport /output "%USERPROFILE%\Desktop\battery.html"
```

3. 双击生成的 `battery.html`，浏览器里打开报告；
4. 重点看两栏：`DESIGN CAPACITY`（设计容量）和 `FULL CHARGE CAPACITY`（当前满充容量），两者一除就是健康度——比如设计 50000 mWh、满充 43500 mWh，就是 87%。

报告里还有最近几天的使用/待机时长和耗电记录。数据来自电池自身固件上报，比第三方电池软件更准。

## 注意事项

- 台式机或无电池设备也会生成报告但内容为空——这条命令服务的是笔记本。
- 健康度掉到 80% 以下续航会明显崩，该考虑换电池了。
- 已实测：本机（Windows 11 build 26300）命令成功生成报告文件。
