# Refine an existing surface

Refinement preserves the incumbent identity, content, behavior, and everything
outside the requested scope. A new visual world belongs to `build.md`.

## Evidence pass

1. Read the current target, relevant components, tokens, and surface brief.
2. Compare the request with the rendered current state when available.
3. Identify the smallest coherent change that solves the named problem.
4. State what must remain unchanged before editing.

Run an assessment first only when the user asks for one or when the correct
change depends on evidence that source alone cannot provide.

## Command intent

| Intent | Change |
|---|---|
| `polish` | Fix remaining hierarchy, alignment, type, state, and consistency defects |
| `bolder` | Amplify the existing system's strongest motif without changing identity |
| `quieter` | Reduce intensity through hierarchy, restraint, and fewer competing signals |
| `distill` | Remove complexity while preserving task completion and required content |
| `clarify` | Rewrite labels, instructions, errors, empty states, and recovery paths |
| `layout` | Repair composition, spacing, rhythm, grouping, and responsive priority |
| `typeset` | Repair family roles, scale, measure, weight, line breaks, and legibility |
| `colorize` | Give color a coherent job in hierarchy, action, state, and wayfinding |
| `harden` | Cover errors, overflow, i18n, edge data, interrupted actions, and resilience |
| `onboard` | Improve first-run context, activation, empty states, and progressive disclosure |
| `adapt` | Recompose for viewport, input method, orientation, and content pressure |
| `optimize` | Fix measured UI performance problems without changing product truth |

## Edit pass

- Make one coherent batch across the target and the shared systems it actually
  needs.
- Do not touch unrelated files, copy, or visual decisions.
- Preserve semantic structure and accessibility while changing presentation.
- Keep the existing component and token system unless the task proves it cannot
  express the requested change.
- Add a shared token or component when the change would otherwise create another
  one-off implementation.
- Remove dead styles or variants created by the change.
- Do not edit DESIGN.md or its sidecar during a scoped refinement. If the work
  reveals a durable system change, report it and wait for an explicit request.

## Verify pass

Run the detector exactly once after the edit batch. Apply actionable findings in
one follow-up edit batch, then stop; do not rerun the detector to prove the fix.
Inspect desktop and mobile renders once after the final edit batch. Do not rerun
visual inspection after writing the response.
Verify the requested change, all affected states, keyboard focus, overflow, and
everything explicitly marked as untouched.

Leave the design system unchanged and report what was checked.

