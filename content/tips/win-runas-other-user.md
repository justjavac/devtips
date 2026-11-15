---
title: "Windows：以其他用户身份运行，低成本隔离流氓软件"
slug: win-runas-other-user
summary: "新建受限账户，用 runas 让不信任的软件在受限身份下跑，扫盘也翻不了天。"
category: dev-basics
tools: []
toolVersion: "Windows 10 / 11"
verifiedAt: 2026-11-15
publishedAt: 2026-11-15
tags: [windows, 安全, 权限]
---

## 操作

1. 建一个权限受限的本地账户（设置 → 账户 → 其他用户）；
2. 对不信任的软件：Shift + 右键其 exe →"以其他用户身份运行"，输入受限账户凭据；
3. 进阶免右键——把快捷方式的目标改成：

```bat
C:\Windows\System32\runas.exe /savecred /user:受限用户名 "程序完整路径"
```

`/savecred` 让系统记住密码，之后双击即用。

软件在受限身份下运行，读写范围被限制在该账户内，污染不到你的日常账户——比开虚拟机轻量，比裸跑稳妥，适合"不得不用但信不过"的软件。

## 注意事项

- runas 弹出的凭据窗口里，别在不信任的环境下误输日常账户密码。
- 软件的配置文件会写到受限账户目录，用之前想好数据放哪。
- 这招隔离的是权限，不是网络行为；要管住联网还得配合防火墙规则。
