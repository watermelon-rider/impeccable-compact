# Compact architecture

## Runtime boundary

Prompt packages contain instructions and a bootstrap launcher. They do not
contain a platform binary and must not download separate copies per package.

The shared runtime contract is stored in `runtime/contract.json`. Launchers use
`IMPECCABLE_BIN` when provided, then the shared versioned cache. The runtime
cache key is the upstream `ENGINE_VERSION`.

## Skills

Each source skill has a single `SKILL.src.md` entry point and a small, flat
`reference/` directory. There are no recursive reference trees.

The core package has four scenario playbooks:

- `build.md`: a new surface or a replacement visual world
- `refine.md`: an in-scope change to an existing surface
- `review.md`: read-only critique or technical audit
- `system.md`: PRODUCT.md, DESIGN.md, extraction, hooks, and repair

`craft-floor.md` is the only shared tactical reference. It is loaded directly
before editing, never during planning-only work.

## Loading contract

A normal task may load:

1. `SKILL.md`
2. exactly one scenario playbook
3. `craft-floor.md` before the first UI edit

An explicit `critique` or `audit` loads `review.md` and does not edit. A broad
request may ask one blocking question, then proceed without a multi-round
interview. There is no default comp, plate, asset-producer, live, or independent
finish-reviewer phase.

## Source isolation

The compact build reads only `src/skills/` and writes the tracked,
directly-loadable output to `skills/`. Source or generated-output mixing is a
build error.

## Future packages

`imp-style` is implemented as a static catalog: ten named directions,
fixed WebP previews, one gallery, and a compact project-level selection file.
It never generates a style image at request time.

`imp-bold` is also implemented as a fixed catalog plus an explicit
application workflow. Its eight previews and motion constraints are
development-time assets, never runtime generations.

`impeccable-mobile` remains deferred until the core's browser-rendered quality
gate passes. All packages reuse the shared runtime and build tooling rather than
vendoring another engine.

