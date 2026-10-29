import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
const sourceRoot = path.join(root, 'src', 'skills');
const outputRoot = path.join(root, 'skills');
const stageRoot = path.join(root, '.skills-build');
const engineVersion = fs.readFileSync(path.join(root, 'ENGINE_VERSION'), 'utf8').trim();

fs.rmSync(stageRoot, { recursive: true, force: true });
fs.mkdirSync(stageRoot, { recursive: true });

function copyDir(source, target) {
  fs.mkdirSync(target, { recursive: true });
  for (const entry of fs.readdirSync(source, { withFileTypes: true })) {
    const from = path.join(source, entry.name);
    const to = path.join(target, entry.name);
    if (entry.isDirectory()) {
      copyDir(from, to);
    } else {
      fs.copyFileSync(from, to);
      if (['compact', 'style', 'bold', 'preview'].includes(entry.name)) {
        fs.chmodSync(to, 0o755);
      }
    }
  }
}

function compileBody(body) {
  return body
    .replaceAll('{{scripts_path}}', 'scripts')
    .replaceAll('{{command_prefix}}', '/imp-compact ')
    .replaceAll('{{available_commands}}', 'the routes listed in SKILL.md');
}

const skillDirs = fs.readdirSync(sourceRoot, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .sort();

if (skillDirs.length === 0) {
  throw new Error('No compact skill sources found.');
}

for (const name of skillDirs) {
  const source = path.join(sourceRoot, name);
  const target = path.join(stageRoot, name);
  const skillSource = path.join(source, 'SKILL.src.md');
  if (!fs.existsSync(skillSource)) {
    throw new Error(`${name} has no SKILL.src.md`);
  }

  copyDir(source, target);
  fs.renameSync(path.join(target, 'SKILL.src.md'), path.join(target, 'SKILL.md'));
  const skillPath = path.join(target, 'SKILL.md');
  fs.writeFileSync(skillPath, compileBody(fs.readFileSync(skillPath, 'utf8')));
  fs.writeFileSync(path.join(target, 'scripts', 'VERSION'), `${engineVersion}\n`);
}

const realSkill = fs.realpathSync(path.join(stageRoot, 'imp-compact'));
if (!realSkill.startsWith(fs.realpathSync(stageRoot) + path.sep)) {
  throw new Error('compact skill escaped skills');
}

fs.rmSync(outputRoot, { recursive: true, force: true });
fs.renameSync(stageRoot, outputRoot);
fs.rmSync(path.join(root, 'dist'), { recursive: true, force: true });

console.log(`Built ${skillDirs.length} directly usable compact skill(s) with shared runtime ${engineVersion}.`);

