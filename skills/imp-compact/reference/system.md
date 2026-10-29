# Project system

Use this reference for `init`, `document`, `extract`, `hooks`, and `doctor`.

## Init

`init` captures product truth in PRODUCT.md. It never chooses the visual world
and never writes DESIGN.md.

Ask one grouped set of questions for facts that cannot be learned from the
brief or project:

- platform and stack
- users and operating context
- product purpose and positioning
- capabilities and constraints
- brand commitments and anti-references
- evidence on hand
- product principles
- accessibility and inclusion

Write only confirmed or clearly labeled inferred facts. Do not invent customer
evidence, metrics, or brand claims.

When an existing PRODUCT.md is present, update only stale or missing durable
facts. Do not reopen confirmed choices without a reason.

## Document

`document` records the incumbent visual system in DESIGN.md plus
`.impeccable/design.json` when tokens exist.

Inspect real source and rendered output before describing it:

- color tokens and their roles
- type families, roles, sizes, weights, measure, and line height
- spacing and radius scales
- elevation and border vocabulary
- layout, container, breakpoint, and density rules
- common component treatments and states
- motion, focus, and browser-surface treatments
- explicit do and do-not rules

DESIGN.md tokens are normative. Prose explains how to apply them. Preserve
incumbent color syntax and token names instead of renaming them to a generic
system.

### DESIGN.md shape

Use YAML frontmatter plus up to these eight canonical H2 sections, in order:
`Overview`, `Colors`, `Typography`, `Layout`, `Elevation & Depth`, `Shapes`,
`Components`, `Do's and Don'ts`. Omit irrelevant sections.

```yaml
---
name: <project title>
description: <one-line system description>
colors:
  <descriptive-role>: <valid CSS color>
typography:
  <role>:
    fontFamily: <family stack>
    fontSize: <CSS size>
    fontWeight: <number>
    lineHeight: <number or CSS size>
    letterSpacing: <CSS size>
rounded:
  <scale-name>: <CSS size>
spacing:
  <scale-name>: <CSS size>
components:
  <variant-name>:
    backgroundColor: "{colors.<role>}"
    textColor: "{colors.<role>}"
    typography: "{typography.<role>}"
    rounded: "{rounded.<scale>}"
    padding: <CSS shorthand>
---
```

Keep only values the project actually uses. Component entries accept only
`backgroundColor`, `textColor`, `typography`, `rounded`, `padding`, `size`,
`height`, and `width`. Put shadows, motion, breakpoints, and full component
markup in the sidecar instead.

### Sidecar shape

When tokens exist, write `.impeccable/design.json` with `schemaVersion: 2`,
`generatedAt`, `title`, non-empty `extensions`, and non-empty `narrative`.

```json
{
  "schemaVersion": 2,
  "generatedAt": "<ISO-8601>",
  "title": "Design System: <Project>",
  "extensions": {
    "colorMeta": {},
    "typographyMeta": {},
    "shadows": [],
    "motion": [],
    "breakpoints": []
  },
  "components": [],
  "narrative": {
    "northStar": "<name>",
    "overview": "<text from DESIGN.md>",
    "keyCharacteristics": [],
    "rules": [],
    "dos": [],
    "donts": []
  }
}
```

Keep narrative values consistent with DESIGN.md. Sidecar component `html` and
`css` snippets must be self-contained for shadow DOM rendering. Do not duplicate
frontmatter token primitives in the sidecar.

For a new project with no visual output, stop. A directional design can be
recorded during `build.md`; do not fabricate token values before they exist.

## Extract

Consolidate repeated values and component patterns only when the evidence shows
real repetition. Prefer existing project tokens. Do not introduce an abstraction
for a single occurrence.

## Hooks

Report the command result. A hook finding is actionable feedback after an edit,
not a reason to run a new design task. Follow project ignores and never bypass
them to silence a valid finding.

## Doctor

Report drift and repair only what the command marks as automatic or the user
explicitly asks to repair. A design task must not turn unrelated drift cleanup
into hidden scope.

