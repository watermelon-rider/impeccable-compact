import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
const skillRoot = path.join(root, 'src', 'skills', 'imp-compact');
const referenceRoot = path.join(skillRoot, 'reference');
const expressiveRoot = path.join(root, 'src', 'skills', 'imp-bold');

const limits = {
  'SKILL.src.md': 9_000,
  'reference/craft-floor.md': 5_000,
  'reference/build.md': 7_000,
  'reference/refine.md': 6_000,
  'reference/review.md': 6_000,
  'reference/system.md': 7_000,
};

const loads = {
  route: ['SKILL.src.md', 8_000],
  build: ['SKILL.src.md', 'reference/build.md', 'reference/craft-floor.md', 16_000],
  refine: ['SKILL.src.md', 'reference/refine.md', 'reference/craft-floor.md', 15_000],
  review: ['SKILL.src.md', 'reference/review.md', 12_000],
  system: ['SKILL.src.md', 'reference/system.md', 15_000],
};

let failed = false;
let total = 0;

for (const [relative, limit] of Object.entries(limits)) {
  const file = path.join(skillRoot, relative);
  const bytes = fs.statSync(file).size;
  total += bytes;
  const state = bytes <= limit ? 'ok' : 'OVER';
  console.log(`${state.padEnd(4)} ${String(bytes).padStart(6)} / ${String(limit).padStart(6)}  ${relative}`);
  if (bytes > limit) failed = true;
}

const referenceBytes = fs.readdirSync(referenceRoot)
  .filter((name) => name.endsWith('.md'))
  .reduce((sum, name) => sum + fs.statSync(path.join(referenceRoot, name)).size, 0);

console.log(`reference aggregate: ${referenceBytes} bytes`);
if (referenceBytes > 35_000) failed = true;

for (const [name, spec] of Object.entries(loads)) {
  const limit = spec.at(-1);
  const bytes = spec.slice(0, -1)
    .reduce((sum, relative) => sum + fs.statSync(path.join(skillRoot, relative)).size, 0);
  const state = bytes <= limit ? 'ok' : 'OVER';
  console.log(`${state.padEnd(4)} ${String(bytes).padStart(6)} / ${String(limit).padStart(6)}  load:${name}`);
  if (bytes > limit) failed = true;
}

const expressiveLimits = {
  route: 3_000,
  apply: 5_500,
};
for (const [name, limit] of Object.entries(expressiveLimits)) {
  const files = name === 'route'
    ? ['SKILL.src.md']
    : ['SKILL.src.md', 'reference/apply.md', 'reference/craft-floor.md'];
  const bytes = files.reduce((sum, relative) => sum + fs.statSync(path.join(expressiveRoot, relative)).size, 0);
  const state = bytes <= limit ? 'ok' : 'OVER';
  console.log(`${state.padEnd(4)} ${String(bytes).padStart(6)} / ${String(limit).padStart(6)}  expressive:${name}`);
  if (bytes > limit) failed = true;
}

const expressiveCatalogBytes = fs.statSync(path.join(expressiveRoot, 'data', 'expressive.json')).size;
if (expressiveCatalogBytes > 10_000) {
  console.error(`Expressive catalog is too large: ${expressiveCatalogBytes} bytes`);
  failed = true;
}

if (failed) {
  console.error('Compact source budget exceeded.');
  process.exit(1);
}

console.log(`Compact source budget passed (${total} bytes in primary files).`);

