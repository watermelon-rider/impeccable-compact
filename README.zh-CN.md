# Impeccable Compact

[English](README.md) | [简体中文](README.zh-CN.md)

Impeccable Compact 是
[Impeccable](https://github.com/pbakaus/impeccable)
的实验性压缩衍生版，并坚持 source-first 的维护方式。

Impeccable 是一个能力很强的前端设计 skill，但完整工作流在真实 coding
agent 会话中可能产生较高成本。原项目包含大量参考资料，以及 comp、
图像生成、浏览器内实时迭代、原生平台和独立评审 agent 等可选路径。
这些指令和相关工具输出一旦进入长对话，后续每一步都会反复承担上下文成本。

本仓库试图回答一个更窄的问题：

> 能否保留 Impeccable 真正有价值的设计判断，同时移除重复上下文、
> 无关工作流和可避免的模型回合？

这是一个独立衍生项目，不是官方 Impeccable，也未获得上游维护者背书。

## 目标

Impeccable Compact 旨在：

- 保留产品事实、`DESIGN.md`、视觉层级、无障碍和真实渲染验证；
- 只加载一个与当前任务相关的 playbook，而不是整棵参考树；
- 避免每次请求都生成 comp、风格预览和图像资产；
- 把高成本工作变成显式选择，而不是默认自动执行；
- 让一般网站和网页应用任务保持轻量、快速。

它不会刻意保留上游的每一项能力。

## 主要变化

| 领域 | 原版 Impeccable | Impeccable Compact |
|---|---|---|
| 核心范围 | Web、原生端及大量可选工作流 | 仅响应式 Web |
| 参考加载 | 多文件宽范围工作流及可选分支 | 一个 playbook 加一个 craft floor |
| 设计探索 | 可能生成 comp、plate 和图像变体 | 直接构建真实界面 |
| Live 变体 | `live` 和 `generate` 工作流 | 已移除 |
| 原生应用 | 主 skill 包含 iOS 和 Android 指南 | 已移出，本项目暂不实现 |
| 强表现力设计 | 主 skill 内含强风格行为 | 独立为 `imp-bold` |
| 命名风格 | 每次请求生成或解释 | 固定静态目录 |
| 评审 | 可选的独立 reviewer 流程 | 一次 detector，一次修正补丁 |

压缩来自删除重叠路径和减少工作回合，不等于把质量标准降成一组颜色和字体。

## 三个 skill

仓库包含三个 skill：

| Skill | 用途 |
|---|---|
| `imp-compact` | 响应式网站和网页应用 |
| `imp-style` | 十种固定视觉方向及静态 gallery |
| `imp-bold` | 八种显式调用的高表现力方向 |

原生移动端 skill 暂不提供。

### Core

`imp-compact` 包含：

- 一个入口文档；
- 四个扁平 playbook：build、refine、review 和 system；
- 一个精简 craft floor；
- 19 个 command metadata，以及 `hooks` 和 `doctor` 路由。

最大的常规编辑场景约加载 **15.2 KB**，仅路由场景约 **8 KB**。

### Style atlas

`imp-style` 包含十种固定 WebP 参考：

- Editorial
- Swiss
- Minimal
- Industrial
- Luxury
- Organic
- Retro Print
- Playful
- Cinematic
- Data-dense

每种风格都有一份简短 manifest，说明适用场景、反例、约束、调色板、
字体和布局。选择风格会写入精简的 `.impeccable/style-choice.md` 和
`.json` handoff。gallery 和 catalog 不会整体进入实现模型的上下文。

### Bold

`imp-bold` 包含八种固定参考：

- Neo-brutalist
- Maximal Collage
- Kinetic Type
- Retro-futurist
- Spatial Generative
- Narrative Scroll
- Signal Glitch
- Character-led

它的模型入口约 **2.6 KB**。包含 craft floor 在内的完整 apply 路径约
**5.5 KB**。

## 实测结果

当前行为测试使用 `deepseek-v4-flash`，目标是一个小型本地 SaaS fixture：

| 场景 | 结果 | 步数 | Input tokens | Output tokens |
|---|---:|---:|---:|---:|
| 新建 SaaS 页面 | 通过 | 10 | 195,656 | 44,062 |
| 改进已有页面 | 通过 | 7 | 60,991 | 9,393 |
| 只读 critique | 通过 | 6 | 27,014 | 7,328 |
| 生成 DESIGN.md 和 sidecar | 通过 | 11 | 105,951 | 12,533 |
| 应用选定的 expressive 风格 | 通过 | 10 | 173,771 | 32,008 |

新建页面场景比历史 Impeccable 完整构建测量的 211 万 input tokens
低约 **90.7%**。这是与早期 Claude 运行结果的跨模型比较，不是同模型 A/B。

## 使用

仓库：
[watermelon-rider/impeccable-compact](https://github.com/watermelon-rider/impeccable-compact)

把下面这句话交给 agent：

> 从 https://github.com/watermelon-rider/impeccable-compact 安装 `skills/imp-compact`、`skills/imp-style` 和 `skills/imp-bold` 三个 skill。

| Skill | 安装路径 | 用途 |
|---|---|---|
| [imp-compact](https://github.com/watermelon-rider/impeccable-compact/tree/main/skills/imp-compact) | `skills/imp-compact` | 构建或改进网站和网页应用 |
| [imp-style](https://github.com/watermelon-rider/impeccable-compact/tree/main/skills/imp-style) | `skills/imp-style` | 浏览并选择命名视觉方向 |
| [imp-bold](https://github.com/watermelon-rider/impeccable-compact/tree/main/skills/imp-bold) | `skills/imp-bold` | 应用显式指定的高表现力方向 |

安装后，例如：

```text
使用 imp-compact 重新设计这个设置页面。
```

`context`、`detect` 等依赖 runtime 的命令会调用兼容的 Impeccable engine。
如果 engine 不可用，skill 会明确报告验证没有执行，而不是编造结果。

浏览静态风格参考：

```sh
skills/imp-style/scripts/style gallery
skills/imp-bold/scripts/bold gallery
```

选择方向并交给核心实现：

```sh
skills/imp-style/scripts/style select editorial path/to/page.tsx
```

或：

```sh
skills/imp-bold/scripts/bold select kinetic-type path/to/page.tsx
```

## 当前限制

- 尚未完成与原版 skill 的浏览器渲染视觉 A/B；
- 行为测试目前只覆盖一个 provider；
- 暂未实现原生 iOS 和 Android skill；
- 不附带 Impeccable engine binary；
- 风格参考是刻意筛选的有限集合，不是完整的视觉流派目录。

这些限制需要明确保留，因为 prompt 体积下降本身不能证明视觉质量等价。

## 归属与许可

Impeccable Compact 派生自
[pbakaus/impeccable](https://github.com/pbakaus/impeccable)，
上游快照为
[`3671d50f0`](https://github.com/pbakaus/impeccable/commit/3671d50f0ac9a662ce0615e85a256110c9cd720b)。

上游项目作者为 Paul Bakaus 及贡献者。本衍生项目继续采用 Apache License 2.0；
详见 [LICENSE](LICENSE) 和 [NOTICE](NOTICE)。

本仓库不是官方 Impeccable 发行版。
