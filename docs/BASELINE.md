# Baseline

## Historical full-build evidence

The current skill's recorded Claude full-build runs in
`tests/skill-behavior/README.md` provide the initial reference:

- 2.11 million input tokens and 50 thousand output tokens in 31 steps
- 2.95 million input tokens and 53 thousand output tokens in a broader run
- 623 to 637 seconds for the completed builds

These are historical observations, not a fresh A/B run. They are sufficient to
reject changes that only trim a few kilobytes of prose.

## Required scenario families

Before the compact core replaces the current skill, measure the same model and
fixture for:

1. Greenfield marketing page
2. Existing SaaS surface refinement
3. Read-only design critique
4. Existing design-system documentation

Each scenario records total input tokens, output tokens, model/tool steps,
elapsed time, and final behavior checks. The 90% gate applies per scenario, not
to a pooled average.

## Current blocker

No provider API key is present in the repository or process environment.
Historical numbers and static source measurements can be recorded now. A fresh
paid A/B run must wait for credentials or an isolated baseline runner.

## Compact static checkpoint

The first compact core checkpoint records these source loads:

| Scenario | Loaded source | Bytes |
|---|---|---:|
| route only | SKILL | 7,740 |
| build/redesign | SKILL + build + craft floor | 14,922 |
| refine | SKILL + refine + craft floor | 13,414 |
| review/audit | SKILL + review | 9,693 |
| init/document/system | SKILL + system | 11,817 |

The aggregate compact source is 23,838 bytes. These numbers prove the prompt
inventory has fallen sharply; they do not prove the 90% end-to-end token target,
because tool output, rendered evidence, model retries, and conversation growth
remain unmeasured.

## DeepSeek behavior checkpoint

On 2026-10-29, the compact package ran against `deepseek-v4-flash` with the
same local SaaS fixture:

| Scenario | Outcome | Steps | Input tokens | Output tokens |
|---|---|---:|---:|---:|
| build new surface | complete | 10 | 195,656 | 44,062 |
| refine existing page | complete | 7 | 60,991 | 9,393 |
| review, read-only | complete | 6 | 27,014 | 7,328 |
| document DESIGN + sidecar | complete | 11 | 105,951 | 12,533 |

The build scenario records a 90.7% input-token reduction against the historical
2.11 million Claude baseline. This is a cross-model comparison, not a matched
A/B run. The smoke harness has no browser tool, so rendered desktop/mobile
visual quality is still unverified; behavior, artifact, scope, and tool-loop
assertions passed.

## Expressive behavior checkpoint

The compact expressive package ran one selected Kinetic Type refinement against
the same local SaaS fixture:

| Scenario | Outcome | Steps | Input tokens | Output tokens |
|---|---|---:|---:|---:|
| expressive refinement | complete | 10 | 173,771 | 32,008 |

The run loaded one style brief, one apply reference, and one craft floor; ran
context and the detector once each; wrote the page once; and used two batched
patch operations. It did not read the gallery or invent another style. Browser
rendered quality remains a separate outstanding check.

