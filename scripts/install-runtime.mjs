import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
const version = fs.readFileSync(path.join(root, 'ENGINE_VERSION'), 'utf8').trim();
const requested = process.argv[2] === '--binary' ? process.argv[3] : null;
const envBinary = (process.env.IMPECCABLE_BIN ?? '').trim();
const source = requested || envBinary;
const home = process.env.IMPECCABLE_HOME || path.join(os.homedir(), '.impeccable');
const targetDir = path.join(home, 'runtime', version);
const target = path.join(targetDir, 'impeccable');

if (fs.existsSync(target)) {
  console.log(`Shared Impeccable runtime ${version} already installed: ${target}`);
  process.exit(0);
}

if (!source || !fs.existsSync(source)) {
  console.error('No runtime binary found.');
  console.error('Pass `--binary /absolute/path/to/impeccable` or set IMPECCABLE_BIN.');
  console.error('Get a compatible runtime from an Impeccable engine release.');
  process.exit(1);
}

if (!fs.statSync(source).isFile()) {
  console.error(`Runtime source is not a file: ${source}`);
  process.exit(1);
}

fs.mkdirSync(targetDir, { recursive: true });
const staging = path.join(targetDir, `.impeccable.part.${process.pid}`);

try {
  fs.copyFileSync(source, staging, fs.constants.COPYFILE_EXCL);
  fs.chmodSync(staging, 0o755);
  fs.renameSync(staging, target);
} finally {
  fs.rmSync(staging, { force: true });
}

console.log(`Installed shared Impeccable runtime ${version}: ${target}`);

