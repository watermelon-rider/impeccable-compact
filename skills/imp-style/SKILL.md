---
name: imp-style
description: "Use only when the user asks to browse, compare, or select a named visual style reference for a website or web app. Shows a fixed local catalog of static previews and returns a compact style brief for imp-compact."
allowed-tools:
  - Bash(scripts/style *)
  - Read
license: Apache 2.0
---

# Imp Style

This skill is a fixed visual reference catalog. It does not generate mockups,
variants, or interactive style demos.

## Browse

- Open the gallery with
  `<skill-base-dir>/scripts/style gallery`.
- List names and one-line summaries with
  `<skill-base-dir>/scripts/style list`.
- Show one entry with
  `<skill-base-dir>/scripts/style show <id>`.

Use the gallery for the user's visual comparison. Do not load every preview
image into model context.

## Select

When the user chooses a style, run:

```sh
<skill-base-dir>/scripts/style select <id> [target]
```

This writes `.impeccable/style-choice.json` and
`.impeccable/style-choice.md` in the project. Report the selected style, its
preview path, and its constraints. Do not create a second design or rewrite
PRODUCT.md / DESIGN.md.

The core skill may use this narrow brief as visual direction. Product truth,
the user's brief, and an established DESIGN.md still take precedence.

## Rules

- Use only the ten fixed catalog entries. Never invent a style.
- Never generate a new reference image or interactive preview.
- Never load all ten previews into model context; the gallery is for the human.
- If the request is to modify an application, route to `imp-compact` after the
  style choice is recorded.
