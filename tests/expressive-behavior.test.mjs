import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath, pathToFileURL } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
const harnessPath = path.resolve(root, '..', 'tests', 'skill-behavior', 'harness.mjs');
const providersPath = path.resolve(root, '..', 'tests', 'skill-behavior', 'providers.mjs');
const hasUpstreamHarness = fs.existsSync(harnessPath) && fs.existsSync(providersPath);
const harness = hasUpstreamHarness ? await import(pathToFileURL(harnessPath).href) : null;
const providers = hasUpstreamHarness ? await import(pathToFileURL(providersPath).href) : null;
const { runTurn, fileLoaded, summarizeTrace } = harness ?? {};
const { getModel, hasKey } = providers ?? {};
const sourceSkill = path.join(root, 'src', 'skills', 'imp-bold');
const distSkill = path.join(root, 'skills', 'imp-bold');
const fixture = path.join(root, 'tests', 'fixtures', 'saas');
const engineVersion = fs.readFileSync(path.join(root, 'ENGINE_VERSION'), 'utf8').trim();
const runtimeBinary = process.env.IMPECCABLE_BIN
  || path.join(os.homedir(), '.impeccable', 'runtime', engineVersion, 'impeccable');
const modelId = process.env.IMPECCABLE_EXPRESSIVE_MODEL || 'deepseek-v4-flash';
const skip = !hasUpstreamHarness
  ? 'optional behavior harness is only available in the upstream Impeccable checkout'
  : !modelId.startsWith('deepseek-') || !hasKey('deepseek')
  ? 'DEEPSEEK_API_KEY is not configured'
  : false;

function prepareWorkspace() {
  const workspace = fs.mkdtempSync(path.join(os.tmpdir(), 'imp-bold-behavior-'));
  fs.cpSync(distSkill, path.join(workspace, '.claude', 'skills', 'imp-bold'), {
    recursive: true,
  });
  for (const name of fs.readdirSync(fixture)) {
    fs.cpSync(path.join(fixture, name), path.join(workspace, name));
  }
  execFileSync(process.execPath, [
    path.join(sourceSkill, 'scripts', 'bold.mjs'),
    'select',
    'kinetic-type',
    'index.html',
  ], { cwd: workspace, encoding: 'utf8' });
  return workspace;
}

function skillBody(workspace) {
  const skillDir = path.join(workspace, '.claude', 'skills', 'imp-bold');
  return `Base directory for this skill (absolute): ${skillDir}\nReplace every <skill-base-dir> placeholder with this exact absolute path.\n\n${fs.readFileSync(
    path.join(skillDir, 'SKILL.md'),
    'utf8',
  )}`;
}

test('expressive applies a selected fixed direction without workflow bloat', { skip }, async () => {
  const workspace = prepareWorkspace();
  try {
    const result = await runTurn({
      workspace,
      model: getModel(modelId),
      userPrompt: 'Use the selected Kinetic Type direction to redesign index.html as a complete expressive page. Keep the Harbor Desk product truth and working content. Do not ask a question; make every material decision yourself.',
      maxSteps: 12,
      maxOutputTokens: 65_536,
      timeoutMs: 360_000,
      skillBody: skillBody(workspace),
      env: { IMPECCABLE_BIN: runtimeBinary },
      skillName: 'imp-bold',
      allowedBashCommands: ['context', 'detect'],
      disabledTools: ['list', 'edit'],
      environment: 'This is a local HTML fixture. No browser tool is available; disclose that rendered visual verification remains unverified.',
    });
    const summary = summarizeTrace(result.trace);
    console.log(JSON.stringify({
      scenario: 'expressive-refine',
      model: modelId,
      outcome: result.outcome,
      steps: result.steps,
      inputTokens: result.usage?.inputTokens ?? null,
      outputTokens: result.usage?.outputTokens ?? null,
      totalTokens: result.usage?.totalTokens ?? null,
      toolCalls: summary.byName,
      readPaths: summary.readPaths,
      writePaths: summary.writePaths,
    }));
    assert.equal(result.outcome, 'complete');
    assert.ok(fileLoaded(result.trace, 'apply.md'));
    assert.equal(result.trace.readPaths.filter((file) => file.endsWith('apply.md')).length, 1);
    assert.equal(result.trace.readPaths.filter((file) => file.endsWith('craft-floor.md')).length, 1);
    assert.ok(result.trace.readPaths.includes('.impeccable/style-choice.md'));
    assert.ok(result.trace.toolCalls.flatMap((call) => call.mutatedPaths || []).includes('index.html'));
    assert.equal(result.trace.toolCalls.filter((call) => call.name === 'edit').length, 0);
    assert.equal(result.trace.bashCommands.filter((command) =>
      /compact\s+context\b/.test(command)).length, 1);
    assert.equal(result.trace.bashCommands.filter((command) =>
      /compact\s+detect\b/.test(command)).length, 1);
    assert.ok(!result.trace.toolCalls.flatMap((call) => call.mutatedPaths || []).includes('DESIGN.md'));
  } finally {
    fs.rmSync(workspace, { recursive: true, force: true });
  }
});
