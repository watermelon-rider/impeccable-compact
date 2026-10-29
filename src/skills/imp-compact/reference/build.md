# Build or redesign

Use this flow for a new web surface, a new page inside an existing product, or
an approved replacement visual world.

## 1. Resolve the starting state

Inspect the target and the incumbent system before deciding what to build.

- Read the loaded PRODUCT.md, DESIGN.md, config, and surface brief.
- Inspect the actual target, nearby surfaces, components, tokens, and assets.
- If the app cannot run, use committed screenshots or visual-regression
  fixtures and disclose the evidence gap.
- Decide whether this is an extension, a new surface inside an established
  world, or a replacement world.

Do not treat a missing DESIGN.md as permission to replace a working identity.

## 2. Ask only blocking questions

Ask one grouped question when the request lacks a decision that would materially
change the page: its primary action, required content, or whether to preserve or
replace an existing visual world.

When the brief is already specific, proceed. Do not run a multi-round design
interview. For a structured simulated user, complete the matching answer flow
before implementation.

## 3. Write the direction contract

Write the contract body in a temporary file, then persist it through the runtime:

```sh
{{scripts_path}}/compact surface-brief write <target> <body-file>
```

Use this body shape:

```md
## Surface
<path, route, or artifact>

## Visitor mode
Persuade | Operate | Read

## User outcome
<what this surface must help the visitor do or understand>

## Content truth
<supplied facts, evidence, and labeled placeholders>

## Structural thesis
<the composition and reading order in one or two sentences>

## Distinctive move
<the specific, product-grounded idea this surface will be remembered for>

## Style reference
<selected style id and its binding constraints, or "none">

## Required states
<states that materially belong to this surface>

## Scope
<what changes and what must remain untouched>
```

Keep the contract short. It records decisions; it is not an essay. The command's
exit status validates the brief; do not spend another step rereading it.
Run this write command only once.

## 4. Build the real surface

Implement the requested page directly. Do not create comps or a parallel
prototype.

- The target path is already known; do not list or measure the workspace first.
- Make the first implementation complete enough to avoid exploratory rebuilds.
- Apply several corrections with one batched patch operation; do not use one-off
  scripts to patch or validate the generated page.
- Do not call `--help` for commands already specified by this skill.
- Use real or clearly labeled synthetic content.
- Preserve existing product copy unless the task changes it.
- Build the page hierarchy before decorative detail.
- Use the project's framework, components, tokens, and conventions.
- Implement responsive behavior and relevant interaction states in the same
  edit batch.
- Use real assets when supplied. If imagery is required and unavailable, use a
  deliberate composition that does not pretend placeholder chrome is content.
- Do not invent customer names, quotes, metrics, certifications, or evidence.

## 5. Verify

Run the detector exactly once after the main edit batch. Apply actionable
findings in one follow-up edit batch, then stop; do not rerun the detector.
Never pipe its output through Python, Node, or another summarizer.
After that corrective patch, do not reread the target or patch it again. Report
any remaining finding without attempting a second correction.

Then inspect the actual result at one representative desktop and one narrow
mobile viewport. Check:

- first-viewport hierarchy and product specificity
- real copy at both widths
- navigation and reading order
- keyboard focus and interactive states
- overflow, clipping, and text scaling
- contrast, spacing rhythm, and control targets

Fix the visible problems together. Recapture only after material corrections.
When browser evidence is unavailable, report exactly what remains unverified.

## 6. Record durable decisions

Update DESIGN.md and the sidecar when this task establishes a new visual world
or an approved system change. An ordinary extension compares the result with
the incumbent system and reports no-change rather than rewriting it.

Finish only when the requested surface exists, the relevant states work, the
final render matches the current source, and documented claims are traceable to
supplied evidence.

