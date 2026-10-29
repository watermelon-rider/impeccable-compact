import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
const skillRoot = path.join(root, 'src', 'skills', 'imp-style');
const catalog = JSON.parse(fs.readFileSync(path.join(skillRoot, 'data', 'styles.json'), 'utf8'));
const cli = path.join(skillRoot, 'scripts', 'style.mjs');
const gallery = fs.readFileSync(path.join(skillRoot, 'assets', 'gallery.html'), 'utf8');

test('style catalog contains the approved ten unique directions', () => {
  assert.equal(catalog.length, 10);
  assert.equal(new Set(catalog.map((style) => style.id)).size, 10);
  assert.deepEqual(catalog.map((style) => style.id), [
    'editorial', 'swiss', 'minimal', 'industrial', 'luxury',
    'organic', 'retro-print', 'playful', 'cinematic', 'data-dense',
  ]);
  for (const style of catalog) {
    assert.ok(style.constraints.length >= 4, `${style.id} needs concrete constraints`);
    assert.ok(style.useFor.length && style.avoidFor.length);
  }
});

test('every style ships a fixed non-empty WebP preview', () => {
  for (const style of catalog) {
    const preview = path.join(skillRoot, style.preview);
    assert.ok(fs.existsSync(preview), `missing ${style.preview}`);
    assert.ok(fs.statSync(preview).size > 20_000, `${style.id} preview is unexpectedly small`);
    const header = fs.readFileSync(preview).subarray(0, 12);
    assert.equal(header.subarray(0, 4).toString('ascii'), 'RIFF');
    assert.equal(header.subarray(8, 12).toString('ascii'), 'WEBP');
  }
});

test('gallery exposes every preview without external assets or runtime generation', () => {
  for (const style of catalog) {
    assert.match(gallery, new RegExp(style.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
    assert.ok(gallery.includes(style.preview.replace(/^assets\//, '')));
  }
  assert.doesNotMatch(gallery, /https?:\/\//);
  assert.doesNotMatch(gallery, /<script\b/i);
});

test('catalog CLI lists all styles', () => {
  const output = execFileSync(process.execPath, [cli, 'list'], { encoding: 'utf8' });
  const rows = output.trim().split('\n');
  assert.equal(rows.length, 10);
  assert.match(rows[0], /^editorial\tEditorial\t/);
});

test('selecting a style writes a compact project handoff', () => {
  const project = fs.mkdtempSync(path.join(os.tmpdir(), 'imp-style-choice-'));
  try {
    const output = execFileSync(process.execPath, [cli, 'select', 'editorial', 'app/page.tsx'], {
      cwd: project,
      encoding: 'utf8',
    });
    assert.match(output, /Editorial \(editorial\)/);
    const choice = JSON.parse(fs.readFileSync(
      path.join(project, '.impeccable', 'style-choice.json'),
      'utf8',
    ));
    assert.equal(choice.schemaVersion, 1);
    assert.equal(choice.catalog, 'imp-style');
    assert.equal(choice.target, 'app/page.tsx');
    assert.equal(choice.style.id, 'editorial');
    assert.ok(path.isAbsolute(choice.style.preview));
    assert.match(fs.readFileSync(
      path.join(project, '.impeccable', 'style-choice.md'),
      'utf8',
    ), /# Style direction: Editorial/);
  } finally {
    fs.rmSync(project, { recursive: true, force: true });
  }
});
