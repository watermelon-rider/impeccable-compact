import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
const skillRoot = path.join(root, 'src', 'skills', 'imp-compact');
const skill = fs.readFileSync(path.join(skillRoot, 'SKILL.src.md'), 'utf8');
const referenceDir = path.join(skillRoot, 'reference');
const readReference = (name) => fs.readFileSync(path.join(referenceDir, name), 'utf8');
const metadata = JSON.parse(fs.readFileSync(
  path.join(skillRoot, 'scripts', 'command-metadata.json'),
  'utf8',
));
const engineVersion = fs.readFileSync(path.join(root, 'ENGINE_VERSION'), 'utf8').trim();
const runtimeBinary = process.env.IMPECCABLE_BIN
  || path.join(os.homedir(), '.impeccable', 'runtime', engineVersion, 'impeccable');
const hasRuntime = fs.existsSync(runtimeBinary);

test('core prompt describes only the web product boundary', () => {
  assert.match(skill, /responsive websites and web apps/i);
  assert.match(skill, /imp-bold[\s\S]*imp-style/i);
  assert.doesNotMatch(skill, /\breference\/(?:ios|android|audit\.native|adapt\.native)\.md\b/i);
});

test('removed interactive and generated-design commands are absent', () => {
  for (const removed of ['live', 'generate', 'overdrive', 'delight', 'animate']) {
    assert.equal(metadata[removed], undefined, `${removed} must not be a core command`);
  }
  const coreText = [
    skill,
    ...fs.readdirSync(referenceDir)
      .filter((name) => name.endsWith('.md'))
      .map(readReference),
  ].join('\n');
  assert.doesNotMatch(coreText, /`(?:live|generate|overdrive|delight|animate)`/);
});

test('every routed playbook exists and is flat', () => {
  const references = fs.readdirSync(referenceDir);
  for (const name of references) {
    assert.match(name, /^[a-z0-9-]+\.md$/, `unexpected nested or non-markdown reference: ${name}`);
  }
  for (const name of ['build', 'refine', 'review', 'system', 'craft-floor', 'new-work', 'init']) {
    assert.ok(references.includes(`${name}.md`), `missing ${name}.md`);
  }
});

test('every internal reference link resolves', () => {
  const files = [path.join(skillRoot, 'SKILL.src.md'), ...fs.readdirSync(referenceDir)
    .filter((name) => name.endsWith('.md'))
    .map((name) => path.join(referenceDir, name))];

  for (const file of files) {
    const source = fs.readFileSync(file, 'utf8');
    for (const match of source.matchAll(/\]\(([^)#]+\.md)(?:#[^)]+)?\)/g)) {
      const target = path.resolve(path.dirname(file), match[1]);
      assert.ok(fs.existsSync(target), `${path.relative(root, file)} links to missing ${match[1]}`);
    }
  }
});

test('command metadata stays sync with the compact command surface', () => {
  assert.equal(Object.keys(metadata).length, 19);
  for (const command of ['craft', 'shape', 'init', 'document', 'extract', 'critique',
    'audit', 'polish', 'bolder', 'quieter', 'distill', 'harden', 'onboard',
    'colorize', 'typeset', 'layout', 'clarify', 'adapt', 'optimize']) {
    assert.ok(metadata[command], `missing command metadata for ${command}`);
  }
});

test('command table and metadata expose the same core commands', () => {
  const section = skill.match(/## Commands\n([\s\S]*?)(?=\n## |$)/)?.[1];
  assert.ok(section, 'SKILL.src.md must contain a Commands section');

  const metaCommands = new Set(['doctor', 'hooks']);
  const routed = section.split('\n')
    .filter((line) => /^\|\s*`[^`]+`/.test(line))
    .flatMap((line) => [...line.split('|')[1].matchAll(/`([^`]+)`/g)].map((match) => match[1]))
    .filter((command) => !metaCommands.has(command))
    .sort();

  assert.deepEqual(routed, Object.keys(metadata).sort(),
    'the command table and command-metadata.json must describe the same core commands');
});

test('build writes a validated surface brief before implementation', () => {
  const build = readReference('build.md');
  assert.match(build, /surface-brief write <target> <body-file>/);
  assert.match(build, /exit status validates the brief/);
  assert.match(build, /Do not create comps or a parallel\s+prototype/);
  assert.match(build, /Do not call `--help`/);
  assert.match(build, /Run the detector exactly once/);
});

test('core requires context before project exploration', () => {
  assert.match(skill, /Your first tool call must be/);
  assert.match(skill, /Do not list the workspace or read project files\s+before it/);
  assert.match(skill, /do not\s+reread them/);
  assert.match(skill, /Never read the same file by both an\s+absolute and a relative path/);
});

test('refinement preserves the design system and batches verification', () => {
  const refine = readReference('refine.md');
  assert.match(refine, /Do not edit DESIGN\.md or its sidecar during a scoped refinement/);
  assert.match(refine, /Run the detector exactly once after the edit batch/);
  assert.match(refine, /do not rerun the detector to prove the fix/);
});

test('documentation preserves machine-readable system contracts', () => {
  const system = readReference('system.md');
  for (const heading of ['Overview', 'Colors', 'Typography', 'Layout',
    'Elevation & Depth', 'Shapes', 'Components', "Do's and Don'ts"]) {
    assert.ok(system.includes(`\`${heading}\``), `system.md must name the ${heading} section`);
  }
  assert.match(system, /schemaVersion: 2/);
  assert.match(system, /"extensions"[\s\S]*"narrative"/);
  assert.match(system, /Component entries accept only/);
});

test('runtime binaries are not stored inside prompt packages', () => {
  const walk = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });
  const files = [path.join(root, 'src'), path.join(root, 'dist')]
    .filter((dir) => fs.existsSync(dir))
    .flatMap((dir) => walk(dir));
  assert.equal(files.some((file) => /\/bin\/[^/]+\/impeccable(?:\.exe)?$/.test(file)), false);
});

test('launchers resolve one shared runtime cache', () => {
  const launcher = fs.readFileSync(path.join(skillRoot, 'scripts', 'compact'), 'utf8');
  assert.match(launcher, /runtime\/\$version\/impeccable/);
  assert.match(launcher, /\$cache_root\/runtime\/\$version\/impeccable/);
  assert.doesNotMatch(launcher, /curl|wget/);
});

test('runtime installer is idempotent and targets the shared cache', () => {
  const installer = fs.readFileSync(path.join(root, 'scripts', 'install-runtime.mjs'), 'utf8');
  assert.match(installer, /runtime', version/);
  assert.match(installer, /already installed/);
  assert.match(installer, /IMPECCABLE_BIN/);
});

test('compiled package has no unexpanded placeholders or removed references', () => {
  const distSkillRoot = path.join(root, 'skills', 'imp-compact');
  if (!fs.existsSync(distSkillRoot)) return;

  const compiled = fs.readFileSync(path.join(distSkillRoot, 'SKILL.md'), 'utf8');
  assert.doesNotMatch(compiled, /\{\{[^}]+\}\}/);
  assert.match(compiled, /<skill-base-dir>\/scripts\/compact context/);
  assert.equal(fs.readFileSync(path.join(distSkillRoot, 'scripts', 'VERSION'), 'utf8'), `${engineVersion}\n`);

  for (const removed of ['live.md', 'generate.md', 'ios.md', 'android.md',
    'audit.native.md', 'adapt.native.md', 'visualize.md', 'region-map.md']) {
    assert.equal(fs.existsSync(path.join(distSkillRoot, 'reference', removed)), false,
      `${removed} must not ship in the compact core`);
  }
});

test('shared runtime loads compact context from the compact skill directory',
  { skip: !hasRuntime && `runtime ${engineVersion} is not installed` }, () => {
    const launcher = path.join(skillRoot, 'scripts', 'compact');
    const fixture = path.join(root, 'tests', 'fixtures', 'saas');
    const output = execFileSync('/bin/sh', [launcher, 'context', '--target', 'index.html'], {
      cwd: fixture,
      encoding: 'utf8',
      env: { ...process.env, IMPECCABLE_BIN: runtimeBinary },
    });

    assert.match(output, /RESOLVED_CONTEXT:/);
    assert.match(output, /"targetPath": "index\.html"/);
    assert.match(output, /"projectRoot":/);
  });

test('shared runtime writes a validated compact surface brief',
  { skip: !hasRuntime && `runtime ${engineVersion} is not installed` }, () => {
    const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'impeccable-compact-'));
    try {
      fs.writeFileSync(path.join(temp, 'index.html'), '<main>Fixture</main>\n');
      fs.writeFileSync(path.join(temp, 'body.md'), '# Surface\n\nindex.html\n');
      const launcher = path.join(skillRoot, 'scripts', 'compact');
      execFileSync('/bin/sh', [launcher, 'surface-brief', 'write', 'index.html', 'body.md'], {
        cwd: temp,
        encoding: 'utf8',
        env: { ...process.env, IMPECCABLE_BIN: runtimeBinary },
      });

      const brief = fs.readFileSync(
        path.join(temp, '.impeccable', 'surfaces', 'index-html.md'),
        'utf8',
      );
      assert.match(brief, /^---\nversion: 1/m);
      assert.match(brief, /^primary_target: "index\.html"$/m);
      assert.match(brief, /# Surface/);
    } finally {
      fs.rmSync(temp, { recursive: true, force: true });
    }
  });

