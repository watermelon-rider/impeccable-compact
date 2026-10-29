#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const skillRoot = path.resolve(here, '..');
const styles = JSON.parse(fs.readFileSync(path.join(skillRoot, 'data', 'expressive.json'), 'utf8'));
const byId = new Map(styles.map((style) => [style.id, style]));
const galleryPath = path.join(skillRoot, 'assets', 'gallery.html');
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

if (command === 'list') {
  for (const style of styles) console.log(`${style.id}\t${style.name}\t${style.summary}`);
} else if (command === 'show') {
  const style = byId.get(id);
  if (!style) fail(`Unknown expressive style: ${id}`);
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
  if (!style) fail(`Unknown expressive style: ${id}`);
  const outputDir = path.join(process.cwd(), '.impeccable');
  fs.mkdirSync(outputDir, { recursive: true });
  const payload = {
    schemaVersion: 1,
    selectedAt: new Date().toISOString(),
    catalog: 'imp-bold',
    target: target || null,
    style: {
      ...style,
      preview: path.resolve(skillRoot, style.preview),
    },
  };
  fs.writeFileSync(path.join(outputDir, 'style-choice.json'), `${JSON.stringify(payload, null, 2)}\n`);
  fs.writeFileSync(path.join(outputDir, 'style-choice.md'), [
    `# Expressive direction: ${style.name}`,
    '',
    style.summary,
    target ? `\nTarget: ${target}\n` : '',
    '## Constraints',
    ...style.constraints.map((constraint) => `- ${constraint}`),
    '',
    '## Motion',
    style.motion,
    '',
    '## Reference',
    path.resolve(skillRoot, style.preview),
    '',
  ].join('\n'));
  console.log([
    `${style.name} (${style.id})`,
    style.summary,
    `Motion: ${style.motion}`,
    `Preview: ${path.resolve(skillRoot, style.preview)}`,
  ].join('\n'));
} else {
  fail('usage: bold <list|show|select|gallery> [style-id] [target]');
}
