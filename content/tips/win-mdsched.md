---
title: "Windows：mdsched 内存诊断，蓝屏先查内存"
slug: win-mdsched
summary: "Win+R 输 mdsched 进内存诊断，重启后自动跑测试，排查蓝屏元凶。"
category: dev-basics
tools: []
toolVersion: "Windows 10 / 11"
verifiedAt: 2026-11-15
publishedAt: 2026-11-15
tags: [windows, 硬件, 救急]
---

## 操作

电脑频繁蓝屏、程序莫名崩溃、怀疑内存不稳时：

1. `Win + R` → 输入 `mdsched` → 回车；
2. 选"立即重新启动并检查问题"（手头工作先保存，它会直接重启）；
3. 重启后系统自动跑标准内存测试，按 `F1` 可切换成扩展模式，完成后自动进入系统并弹出结果。

## 注意事项

- 测试前务必保存所有工作——它说重启就重启。
- 系统诊断没查出问题但症状还在，可用 MemTest86 跑一轮更彻底的。
- 多根内存条可逐条单插排查，定位到具体哪根出问题。
- 已实测：`%SystemRoot%\System32\MdSched.exe` 存在于本机，命令入口有效。
