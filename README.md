# Impeccable Compact

[English](README.md) | [简体中文](README.zh-CN.md)

An experimental, source-first compaction of
[Impeccable](https://github.com/pbakaus/impeccable).

Impeccable is an unusually capable frontend design skill, but its full
workflow can be expensive in real agent sessions. The original project has a
large reference corpus and several optional paths for comps, generated imagery,
live browser iteration, native platforms, and separate review agents. Once
those instructions and their tool output enter a long conversation, the cost is
repeated at every subsequent model step.

This repository asks a narrower question:

> Can we keep the design judgment that makes Impeccable good while removing
> repeated context, unrelated workflows, and avoidable model turns?

This is an independent derivative. It is not the official Impeccable project
and is not endorsed by its maintainers.

## Goals

Impeccable Compact is designed to:

- preserve product truth, `DESIGN.md`, visual hierarchy, accessibility, and
  real rendered verification;
- load one task-specific playbook instead of a broad reference tree;
- avoid per-request comps, generated style previews, and image pipelines;
- make expensive work explicit rather than automatic;
- keep ordinary website and web-app requests fast.

It deliberately does **not** try to preserve every upstream feature.

## What changed

| Area | Original Impeccable | Impeccable Compact |
|---|---|---|
| Core scope | Web and native, many optional workflows | Responsive websites and web apps |
| Reference loading | Broad multi-file workflow with optional branches | One playbook plus one craft floor |
| Design exploration | May generate comps, plates, and image variants | Build the real surface directly |
| Live variants | `live` and `generate` workflows | Removed |
| Native apps | iOS and Android guidance in the main skill | Moved out; not implemented here |
| High-expression work | Strong-style behavior inside the main skill | Separate `imp-bold` skill |
| Named styles | Generated or interpreted per request | Fixed static catalog |
| Review | Optional separate reviewer pipeline | One detector pass, one corrective patch |

The reduction comes from deleting overlapping paths and reducing workflow
turns, not from reducing the quality floor to a list of colors and fonts.

## Skills

The repository contains three skills:

| Skill | Purpose |
|---|---|
| `imp-compact` | Responsive websites and web apps |
| `imp-style` | Ten fixed visual directions with a static gallery |
| `imp-bold` | Eight explicitly requested high-expression directions |

A native mobile skill is intentionally not implemented yet.

### Core

`imp-compact` contains:

- one entry document;
- four flat playbooks: build, refine, review, and project system;
- a compact crafting floor;
- 19 command metadata entries plus `hooks` and `doctor` routes.

The largest normal editing load is about **15.2 KB**. A route-only load is about
**8 KB**.

### Style atlas

`imp-style` includes ten fixed WebP references:

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

Each style has a short manifest covering use cases, anti-use cases, constraints,
palette, typography, and layout. Selecting a style writes a compact
`.impeccable/style-choice.md` and `.json` handoff. The gallery and catalog are
never loaded wholesale into the implementing model's context.

### Bold

`imp-bold` includes eight fixed references:

- Neo-brutalist
- Maximal Collage
- Kinetic Type
- Retro-futurist
- Spatial Generative
- Narrative Scroll
- Signal Glitch
- Character-led

Its model-facing entry is about **2.6 KB**. The complete apply path, including
its craft floor, is about **5.5 KB**.

## Measured results

The current behavioral evidence comes from `deepseek-v4-flash` against a small
local SaaS fixture:

| Scenario | Result | Steps | Input tokens | Output tokens |
|---|---:|---:|---:|---:|
| Build a new SaaS page | Pass | 10 | 195,656 | 44,062 |
| Refine an existing page | Pass | 7 | 60,991 | 9,393 |
| Read-only critique | Pass | 6 | 27,014 | 7,328 |
| Document DESIGN.md + sidecar | Pass | 11 | 105,951 | 12,533 |
| Apply a selected expressive style | Pass | 10 | 173,771 | 32,008 |

The build scenario is about **90.7% below** the historical Impeccable full-build
measurement of 2.11 million input tokens. This is a cross-model comparison with
an earlier Claude run, not a matched same-model A/B benchmark.

## Use

Repository:
[watermelon-rider/impeccable-compact](https://github.com/watermelon-rider/impeccable-compact)

Give your agent this instruction:

> Install the skills from https://github.com/watermelon-rider/impeccable-compact at paths `skills/imp-compact`, `skills/imp-style`, and `skills/imp-bold`.

Available skills:

| Skill | Install path | Purpose |
|---|---|---|
| [imp-compact](https://github.com/watermelon-rider/impeccable-compact/tree/main/skills/imp-compact) | `skills/imp-compact` | Build or improve a website or web app |
| [imp-style](https://github.com/watermelon-rider/impeccable-compact/tree/main/skills/imp-style) | `skills/imp-style` | Browse and select a named visual direction |
| [imp-bold](https://github.com/watermelon-rider/impeccable-compact/tree/main/skills/imp-bold) | `skills/imp-bold` | Apply an explicitly requested high-expression direction |

After installation, for example:

```text
Use imp-compact to redesign this settings page.
```

Runtime-backed commands such as `context` and `detect` use a compatible
Impeccable engine. If it is unavailable, the skill reports that verification
could not run instead of silently inventing the result.

Browse the static style references:

```sh
skills/imp-style/scripts/style gallery
skills/imp-bold/scripts/bold gallery
```

Select a direction and hand it to core implementation:

```sh
skills/imp-style/scripts/style select editorial path/to/page.tsx
```

or:

```sh
skills/imp-bold/scripts/bold select kinetic-type path/to/page.tsx
```

## Current limits

- Browser-rendered visual A/B against the original skill is still outstanding.
- Behavioral measurements currently cover one provider only.
- Native iOS and Android skills are not implemented.
- These skills do not ship the Impeccable engine binary.
- Style references are intentionally curated and finite; this is not an
  exhaustive catalog of every visual movement.

These limits are explicit because prompt-size reduction alone does not prove
visual quality equivalence.

## Attribution and license

Impeccable Compact is derived from
[pbakaus/impeccable](https://github.com/pbakaus/impeccable), using upstream
source snapshot
[`3671d50f0`](https://github.com/pbakaus/impeccable/commit/3671d50f0ac9a662ce0615e85a256110c9cd720b).

The upstream project is by Paul Bakaus and contributors. This derivative keeps
the same Apache License 2.0 terms; see [LICENSE](LICENSE) and [NOTICE](NOTICE).

This repository is not an official Impeccable distribution.
