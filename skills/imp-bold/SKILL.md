---
name: imp-bold
description: "Use only when the user explicitly requests a high-expression website or web-app direction, or names one of its fixed styles: neo-brutalist, maximal collage, kinetic type, retro-futurist, spatial-generative, narrative-scroll, signal-glitch, or character-led. Provides a static catalog and applies one selected direction."
allowed-tools:
  - Bash(scripts/bold *)
  - Bash(scripts/compact *)
  - Read
  - Write
  - Edit
license: Apache 2.0
---

# Imp Bold

This skill owns deliberately high-expression web work. It is invoked
explicitly; ordinary website and web-app requests stay with `imp-compact`.

## Browse

- Open the fixed gallery:
  `<skill-base-dir>/scripts/bold gallery`
- List directions:
  `<skill-base-dir>/scripts/bold list`
- Inspect one direction:
  `<skill-base-dir>/scripts/bold show <id>`

Show the gallery to the user. Do not read every preview into model context.

## Select

Persist the chosen direction before implementation:

```sh
<skill-base-dir>/scripts/bold select <id> [target]
```

This writes `.impeccable/style-choice.json` and `.impeccable/style-choice.md`
using the same compact handoff consumed by `imp-compact`. It does not edit
PRODUCT.md, DESIGN.md, or application source.

## Apply

1. Your first tool call must be
   `<skill-base-dir>/scripts/compact context --target <path>` once. Do not
   list the workspace or read project files before it.
2. Read `.impeccable/style-choice.md` and
   [reference/apply.md](reference/apply.md) once.
3. Read [reference/craft-floor.md](reference/craft-floor.md) immediately before
   the first UI edit.

The style-choice file is the complete selected direction. Do not search the
skill directory for a style source and do not load `expressive.json` or gallery
HTML during implementation.

Use workspace-relative paths for Read, Write, Edit, and Patch. Use the absolute
skill path only in shell commands; never read the same file by both absolute and
relative paths. After context, use the named target instead of `.`. Write the
first implementation once, batch every correction into one patch operation, and
run the detector exactly once.

## Boundaries

- Never generate a new reference image.
- Never invent a style outside the fixed catalog.
- Never let expression erase information hierarchy, task completion,
  accessibility, or performance.
- Do not add `live`, `generate`, comp, or per-request image-generation flows.
