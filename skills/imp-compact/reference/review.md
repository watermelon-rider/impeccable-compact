# Review or audit

Review and audit are read-only unless the user also asks for fixes.

## Evidence

1. Read the requested target, PRODUCT.md, DESIGN.md, and relevant source.
2. Run the detector once with the appropriate scope.
3. Inspect the rendered target at desktop and mobile sizes when a browser is
   available.
4. Separate observed evidence from inference and missing coverage.

Do not invent prerequisites. A narrow review may proceed from the target and
incumbent implementation.

## Design critique

Assess the surface against its visitor goal:

- product specificity
- first-viewport hierarchy
- information architecture and scan path
- composition and spacing
- typography and reading measure
- color, contrast, and depth
- interaction states and feedback
- accessibility and input methods
- responsive recomposition
- copy clarity and evidence honesty

Prioritize only material findings. For each finding include:

- severity: P0 blocker, P1 release blocker, P2 meaningful defect, or P3 polish
- evidence location
- why it affects the user
- the concrete repair

Do not pad the report with generic advice or ten forced scores.

## Technical audit

Check:

- semantic HTML and keyboard operation
- labels, names, focus, and state announcements
- contrast, text scaling, reduced motion, and target size
- horizontal overflow and real long content
- responsive behavior and touch interaction
- token consistency and theme behavior
- render and bundle costs that are visible in the available evidence
- failed or broken assets, controls, links, and states

Report the smallest evidence-backed action plan. Do not claim that a static scan
proves runtime success.

## Close

Deliver the report in the response. Persist a snapshot only when the project
already uses critique history or the user asks for one.

If the user wants implementation, switch to `refine.md` or `build.md` in a new
edit phase. Review does not silently turn into editing.

