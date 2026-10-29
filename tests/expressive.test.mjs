import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
const skillRoot = path.join(root, 'src', 'skills', 'imp-bold');
const catalog = JSON.parse(fs.readFileSync(path.join(skillRoot, 'data', 'expressive.json'), 'utf8'));
const cli = path.join(skillRoot, 'scripts', 'bold.mjs');
const gallery = fs.readFileSync(path.join(skillRoot, 'assets', 'gallery.html'), 'utf8');

test('expressive catalog contains eight unique high-expression directions', () => {
  assert.equal(catalog.length, 8);
  assert.equal(new Set(catalog.map((style) => style.id)).size, 8);
  assert.deepEqual(catalog.map((style) => style.id), [
    'neo-brutalist', 'maximal-collage', 'kinetic-type', 'retro-futurist',
    'spatial-generative', 'narrative-scroll', 'signal-glitch', 'character-led',
  ]);
  for (const style of catalog) {
    assert.ok(style.constraints.length >= 4, `${style.id} needs concrete constraints`);
    assert.ok(style.motion, `${style.id} needs a motion grammar`);
  }
});

test('expressive keeps a compact model-loading surface', () => {
  const skillBytes = fs.statSync(path.join(skillRoot, 'SKILL.src.md')).size;
  const applyBytes = fs.statSync(path.join(skillRoot, 'reference', 'apply.md')).size;
  const floorBytes = fs.statSync(path.join(skillRoot, 'reference', 'craft-floor.md')).size;
  assert.ok(skillBytes <= 3_000, `SKILL.src.md is ${skillBytes} bytes`);
  assert.ok(skillBytes + applyBytes + floorBytes <= 5_500,
    `apply load is ${skillBytes + applyBytes + floorBytes} bytes`);
  assert.equal(fs.existsSync(path.join(skillRoot, 'scripts', 'preview')), false,
    'unreferenced preview wrapper must not ship');
});

test('every expressive style ships a fixed non-empty WebP preview', () => {
  for (const style of catalog) {
    const preview = path.join(skillRoot, style.preview);
    assert.ok(fs.existsSync(preview), `missing ${style.preview}`);
    assert.ok(fs.statSync(preview).size > 20_000, `${style.id} preview is unexpectedly small`);
    const header = fs.readFileSync(preview).subarray(0, 12);
    assert.equal(header.subarray(0, 4).toString('ascii'), 'RIFF');
    assert.equal(header.subarray(8, 12).toString('ascii'), 'WEBP');
  }
});

test('expressive gallery is static and exposes every preview', () => {
  for (const style of catalog) {
    assert.match(gallery, new RegExp(style.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
    assert.ok(gallery.includes(style.preview.replace(/^assets\//, '')));
  }
  assert.doesNotMatch(gallery, /https?:\/\//);
  assert.doesNotMatch(gallery, /<script\b/i);
});

test('expressive catalog CLI lists all approved styles', () => {
  const output = execFileSync(process.execPath, [cli, 'list'], { encoding: 'utf8' });
  const rows = output.trim().split('\n');
  assert.equal(rows.length, 8);
  assert.match(rows[0], /^neo-brutalist\tNeo-brutalist\t/);
});

test('expressive selection writes the shared core handoff', () => {
  const project = fs.mkdtempSync(path.join(os.tmpdir(), 'imp-bold-choice-'));
  try {
    const output = execFileSync(process.execPath, [cli, 'select', 'kinetic-type', 'app/page.tsx'], {
      cwd: project,
      encoding: 'utf8',
    });
    assert.match(output, /Kinetic Type \(kinetic-type\)/);
    const choice = JSON.parse(fs.readFileSync(
      path.join(project, '.impeccable', 'style-choice.json'),
      'utf8',
    ));
    assert.equal(choice.schemaVersion, 1);
    assert.equal(choice.catalog, 'imp-bold');
    assert.equal(choice.target, 'app/page.tsx');
    assert.equal(choice.style.id, 'kinetic-type');
    assert.match(choice.style.motion, /reading order|marquee/i);
    assert.ok(path.isAbsolute(choice.style.preview));
    assert.match(fs.readFileSync(
      path.join(project, '.impeccable', 'style-choice.md'),
      'utf8',
    ), /# Expressive direction: Kinetic Type/);
  } finally {
    fs.rmSync(project, { recursive: true, force: true });
  }
});
