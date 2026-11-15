---
title: "Windows：SlideToShutDown，滑一下屏幕就关机"
slug: win-slide-to-shutdown
summary: "系统自带滑动关机：运行 SlideToShutDown.exe，下滑锁屏即关机。"
category: dev-basics
tools: []
toolVersion: "Windows 10 / 11"
verifiedAt: 2026-11-15
publishedAt: 2026-11-15
tags: [windows, 关机, 彩蛋]
---

## 操作

Windows 在 `C:\Windows\System32\` 里藏了一个平板时代的遗产——滑动关机：

1. 桌面右键 → 新建 → 快捷方式；
2. 路径填：`%windir%\System32\SlideToShutDown.exe`，起名"滑动关机"；
3. 双击它，屏幕上半幅垂下锁定画面，**用鼠标（或手指）向下拖动**，松手即关机。

顺手再补两招键盘流关机：

- `Win + X` 调出高级菜单，接着按 `U`、`U`——两步关机（`U` 后按 `R` 是重启）；
- 在桌面按 `Alt + F4`，直接弹出"关闭 Windows"对话框。

## 注意事项

- 滑动关机是**直接关机**：不会逐个询问未保存的文档，执行前确认手头工作都已保存。
- 可以给快捷方式换个图标（属性 → 更改图标），钉到任务栏当"仪式感关机键"。
- 公司域控机器若禁用了关机权限，这个 exe 同样会被策略拦下，属正常现象。
