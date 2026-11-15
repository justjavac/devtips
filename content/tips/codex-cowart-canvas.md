---
title: "Codex：装上 Cowart 画布，画个箭头就能指哪改哪"
slug: codex-cowart-canvas
summary: "Cowart 插件给 Codex 加 tldraw 无限画布：框选尺寸生图、画箭头批注精准改图。"
category: ai-tools
tools: ["codex"]
toolVersion: "Cowart（2026-11）"
verifiedAt: 2026-11-15
publishedAt: 2026-11-15
tags: [codex, 插件, 设计]
---

## 操作

Cowart 是开源的 Codex 插件（GitHub: zhongerxin/cowart），装好后 Codex 旁边多一块基于 tldraw 的本地无限画布，数据全留在项目文件夹里。

两个核心玩法：

1. **AI Image Holder**：在画布上拉一个线框、写好提示词，Codex 读取框的尺寸比例，把生成的图片精准塞进这个位置——不再手算长宽比；
2. **画箭头，指哪改哪**：用画笔指着图上的元素手写批注（如"这里换成亚洲人"），点"按标注修改"，Codex 看懂批注并准确定位修改位置。

懒得敲命令的话，直接把这段话丢给 Codex：

> 请从 https://github.com/zhongerxin/cowart.git 安装 Cowart Codex 插件。请 clone 仓库到 ~/plugins/cowart，确认 .codex-plugin/plugin.json 存在，把插件加入 personal marketplace，然后运行 codex plugin add cowart@personal。安装后请校验插件，并告诉我是否需要开启一个新对话来加载新技能和 MCP 工具。

## 注意事项

- 插件跑在本地，但生成图片仍消耗对应模型的额度。
- 装完**新开对话**再试，旧会话不会自动加载新技能。
- 第三方插件升级勤快，版本差异大，遇到报错先看仓库 issue。
