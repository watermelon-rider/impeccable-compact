#!/usr/bin/env node
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const skillRoot = path.resolve(here, '..');
const dataPath = path.join(skillRoot, 'data', 'styles.json');
const galleryPath = path.join(skillRoot, 'assets', 'gallery.html');
const styles = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
const byId = new Map(styles.map((style) => [style.id, style]));
const [command, id, target] = process.argv.slice(2);

function fail(message) {
  console.error(message);
  process.exit(1);
}

function openFile(file) {
  const command = process.platform === 'darwin' ? 'open'
    : process.platform === 'win32' ? 'cmd'
      : 'xdg-open';
  const args = process.platform === 'win32' ? ['/c', 'start', '', file] : [file];
  const child = spawn(command, args, { detached: true, stdio: 'ignore' });
  child.unref();
}

function format(style) {
  return [
    `${style.name} (${style.id})`,
    style.summary,
    `Use for: ${style.useFor.join(', ')}`,
    `Avoid for: ${style.avoidFor.join(', ')}`,
    `Constraints: ${style.constraints.join(' ')}`,
    `Preview: ${style.preview}`,
  ].join('\n');
}

if (command === 'list') {
  for (const style of styles) console.log(`${style.id}\t${style.name}\t${style.summary}`);
} else if (command === 'show') {
  const style = byId.get(id);
  if (!style) fail(`Unknown style: ${id}`);
  console.log(JSON.stringify({
    ...style,
    preview: path.resolve(skillRoot, style.preview),
  }, null, 2));
} else if (command === 'gallery') {
  if (!fs.existsSync(galleryPath)) fail(`Gallery has not been generated: ${galleryPath}`);
  console.log(galleryPath);
  openFile(galleryPath);
} else if (command === 'select') {
  const style = byId.get(id);
  if (!style) fail(`Unknown style: ${id}`);
  const projectRoot = process.cwd();
  const outputDir = path.join(projectRoot, '.impeccable');
  fs.mkdirSync(outputDir, { recursive: true });
  const payload = {
    schemaVersion: 1,
    selectedAt: new Date().toISOString(),
    catalog: 'imp-style',
    target: target || null,
    style: {
      ...style,
      preview: path.resolve(skillRoot, style.preview),
    },
  };
  fs.writeFileSync(path.join(outputDir, 'style-choice.json'), `${JSON.stringify(payload, null, 2)}\n`);
  const targetLine = target ? `\nTarget: ${target}\n` : '';
  fs.writeFileSync(path.join(outputDir, 'style-choice.md'), [
    `# Style direction: ${style.name}`,
    '',
    style.summary,
    targetLine,
    '## Constraints',
    ...style.constraints.map((constraint) => `- ${constraint}`),
    '',
    '## Reference',
    path.resolve(skillRoot, style.preview),
    '',
  ].join('\n'));
  console.log(format(style));
} else {
  fail('usage: style <list|show|select|gallery> [style-id] [target]');
}
