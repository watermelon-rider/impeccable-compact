---
name: imp-compact
description: "Use when building or improving a responsive website or web app: landing pages, product screens, dashboards, forms, settings, onboarding, documentation surfaces, design critique, accessibility, responsive behavior, UX copy, and DESIGN.md systems. Use imp-bold for explicitly requested high-expression visual work or imp-style for browsing named styles."
allowed-tools:
  - Bash(scripts/compact context *)
  - Bash(scripts/compact surface-brief *)
  - Bash(scripts/compact detect *)
  - Bash(scripts/compact hooks *)
  - Bash(scripts/compact doctor *)
  - Read
  - Write
  - Edit
license: Apache 2.0
---

# Imp Compact

Build responsive websites and web apps that are specific to the product,
complete in their real states, and verified in a rendered browser. High-expression
visual work and named style exploration belong to `imp-bold` and `imp-style`.

## Start

1. Your first tool call must be
   `<skill-base-dir>/scripts/compact context --target <path>` once. Keep the
   project working directory. Do not list the workspace or read project files
   before it. Its output already includes PRODUCT.md and DESIGN.md; do not
   reread them. Reuse the result later in the same session.
   `<skill-base-dir>` applies only to shell commands. Use workspace-relative
   paths for Read, Write, Edit, and Patch. Never read the same file by both an
   absolute and a relative path.
2. Load exactly one playbook:

   | Request | Playbook |
   |---|---|
   | New page, new surface, redesign, replacement brand | `reference/build.md` |
   | Polish, simplify, retype, recolor, relayout, adapt, harden, optimize | `reference/refine.md` |
   | Critique, audit, review, accessibility or performance report | `reference/review.md` |
   | Init, document, extract, hooks, doctor, stale context | `reference/system.md` |

3. Read `reference/craft-floor.md` immediately before the first UI edit. A
   project-file write or edit before this read is invalid. Planning-only work
   does not load it.

If the launcher is unavailable, say once that context loading did not run, then
read the existing PRODUCT.md and DESIGN.md directly. Do not invent missing
project facts.

## Authority

- PRODUCT.md owns product truth.
- DESIGN.md and its sidecar own durable visual decisions.
- A surface brief owns the strategy for one route or artifact.
- When `.impeccable/style-choice.md` exists, it narrows visual direction for
  the requested surface; PRODUCT.md, DESIGN.md, and the current brief still win.
- The current brief owns the requested change and explicit exclusions.
- Refinement preserves the incumbent identity and everything outside scope.
- Redesign replaces the visual world while preserving product truth, content,
  function, and constraints.
- A filename is evidence, not authority. Missing DESIGN.md does not prove that
  the project is greenfield when working code or screenshots already define a
  visual world.

## Visitor goals

Choose from the requested surface, not from the company category.

- **Persuade:** the visitor decides or acts. Marketing, campaign, pricing.
- **Operate:** the visitor completes a task. Dashboard, editor, admin, settings.
- **Read:** the visitor understands something. Docs, help, guides, changelogs.

Persuade earns attention before asking for action. Operate prioritizes scan
speed, predictable controls, real states, and the usage environment. Read
prioritizes hierarchy, measure, navigation, and sustained legibility.

## Design laws

1. **Specificity before decoration.** Composition, language, imagery, and
   interaction must come from this product's facts and audience. A neighboring
   product should not be able to use the page unchanged.
2. **Hierarchy is visible.** One idea owns the first viewport. Scale, position,
   contrast, and whitespace agree about what matters next.
3. **Type carries meaning.** Use an intentional family and role scale, a
   readable measure, obvious weight steps, and real copy at every breakpoint.
4. **Color has a job.** Name which role carries action, state, structure, and
   mood. Body contrast is at least 4.5:1 and large text at least 3:1.
5. **Space creates rhythm.** Tight groups sit together. Sections breathe.
   Spacing patterns repeat instead of drifting per component.
6. **Responsive is a composition, not a shrink.** Recompose navigation,
   content priority, controls, and reading order for narrow and wide contexts.
7. **States are part of the interface.** Default, hover, focus, active,
   disabled, loading, empty, error, and success must be designed where relevant.
8. **Interaction is honest.** Controls use semantic elements, visible focus,
   keyboard access, usable targets, and feedback that names what happened.
9. **Copy is design material.** Labels name actions. Errors name the problem and
   recovery. Claims come from supplied truth or are clearly labeled synthetic.
10. **Rendered evidence wins.** Inspect the actual page at desktop and mobile
    sizes. A source-only judgment cannot certify visual quality.

## Default execution

For a normal task:

1. Inspect the request, incumbent implementation, and available visual evidence.
2. Ask at most one grouped clarification when a missing decision would
   materially change the result.
3. If `.impeccable/style-choice.md` exists, read it once. Record a short
   direction contract in the matching surface brief.
4. Implement the complete requested surface and its relevant states.
5. Run the detector exactly once after the edit batch. Apply actionable findings
   in one batched patch; then stop. Do not reread the target or rerun the
   detector afterward.
6. Capture desktop and mobile renders once, fix the visible issues in one batch,
   and capture again only after material fixes.
7. Update DESIGN.md only for a new world, an approved system change, or an
   explicit documentation request. A scoped refinement never edits the design
   system unless the user explicitly asks for that system change.

Do not generate comps, style previews, plates, or interactive design drafts.
Do not spawn an independent finish reviewer by default. Use `review.md` when the
user asks for a review or when a high-risk task explicitly needs a separate
assessment.

Use the detector and render evidence for mechanical checks; do not write
one-off analyzers.

## Commands

| Command | Route |
|---|---|
| `craft`, `shape` | `reference/build.md` |
| `init`, `document`, `extract`, `hooks`, `doctor` | `reference/system.md` |
| `critique`, `audit` | `reference/review.md` |
| `polish`, `bolder`, `quieter`, `distill`, `clarify` | `reference/refine.md` |
| `layout`, `typeset`, `colorize` | `reference/refine.md` |
| `harden`, `onboard`, `adapt`, `optimize` | `reference/refine.md` |

An explicit command wins over a generic suggestion. `craft` is a compatibility
alias for the ordinary build flow. If two routes genuinely fit, ask once.

## Token discipline

- Load one playbook, not every command reference.
- Do not reread project files already present in fresh context.
- Do not repeat a command after it succeeds; inspect its exit status and continue.
- Prefer one structured question over an interview when the request is already
  specific.
- Batch edits, detector runs, and visual captures.
- Finish the visible fix in one batched patch; then one detector pass, one
  correction, stop.
- Do not call `--help` for commands already specified by this skill.
- Never pipe the detector through another script or summarize it with a custom
  parser; read its direct output once.
- Keep tool output bounded. Never dump a whole generated bundle or screenshot
  collection into the conversation.
- For an explicit deep review, say why the extra evidence is needed before
  spending it.

