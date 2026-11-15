---
title: "Windows：PowerToys Run，Alt + 空格调出全能启动器"
slug: win-powertoys-run
summary: "PowerToys 的 Alt+Space 启动器：搜应用、搜文件、算式、单位换算一步到位。"
category: dev-basics
tools: ["powertoys"]
toolVersion: "0.8x"
verifiedAt: 2026-11-15
publishedAt: 2026-11-15
tags: [windows, 效率, 工具]
---

## 操作

1. 安装（微软官方开源免费）：

```bat
winget install Microsoft.PowerToys
```

2. 装完直接按 `Alt + Space` 呼出输入框；
3. 输入即搜：

| 输入 | 结果 |
| --- | --- |
| 程序名 | 回车启动 |
| 文件名 | 直接打开所在位置 |
| `= 128*46+8` | 即时算式结果 |
| `10cm in inch` | 单位换算 |

可视为 Windows 版的 Spotlight / Alfred，装上就回不去。

## 注意事项

- 首次使用在 PowerToys 设置里确认"PowerToys Run"已启用，可换激活键。
- 与部分软件的 Alt+Space 冲突时，在设置里改组合键。
- 工具箱里还有窗口置顶（`Win + Ctrl + T`）、文本提取器（`Win + Shift + T`）等模块，按需在设置里开关。
