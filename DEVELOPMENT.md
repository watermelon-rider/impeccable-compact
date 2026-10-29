# Development

The repository ships ready-to-use skills under `skills/`. Normal users and
agents should load those directories directly.

Maintainers edit `src/skills/` and regenerate the tracked output:

```sh
npm run build
```

Run the static validation suite:

```sh
npm test --silent
```

The build copies source skills, renames `SKILL.src.md` to `SKILL.md`, resolves
the script path placeholders, and writes the result to `skills/`.

Optional paid behavior checks:

```sh
npm run test:behavior
npm run test:bold-behavior
```

They use DeepSeek by default and read credentials from `.env`, which is
gitignored. They require the upstream Impeccable development harness; standalone
checkouts skip them.
