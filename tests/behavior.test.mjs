import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

import { pathToFileURL } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
const harnessPath = path.resolve(root, '..', 'tests', 'skill-behavior', 'harness.mjs');
const providersPath = path.resolve(root, '..', 'tests', 'skill-behavior', 'providers.mjs');
const hasUpstreamHarness = fs.existsSync(harnessPath) && fs.existsSync(providersPath);
const harness = hasUpstreamHarness ? await import(pathToFileURL(harnessPath).href) : null;
const providers = hasUpstreamHarness ? await import(pathToFileURL(providersPath).href) : null;
const { runTurn, fileLoaded, summarizeTrace } = harness ?? {};
const { getModel, hasKey, resolveModelList } = providers ?? {};
const distSkill = path.join(root, 'skills', 'imp-compact');
const fixture = path.join(root, 'tests', 'fixtures', 'saas');
const engineVersion = fs.readFileSync(path.join(root, 'ENGINE_VERSION'), 'utf8').trim();
const modelId = hasUpstreamHarness
  ? process.env.IMPECCABLE_COMPACT_MODEL
    || resolveModelList().find((id) => hasKey(id.startsWith('deepseek-') ? 'deepseek' : ''))
    || 'deepseek-v4-flash'
  : 'deepseek-v4-flash';
const provider = modelId.startsWith('deepseek-') ? 'deepseek' : null;
const skip = !hasUpstreamHarness
  ? 'optional behavior harness is only available in the upstream Impeccable checkout'
  : !provider || !hasKey(provider)
  ? 'DEEPSEEK_API_KEY is not configured'
  : !fs.existsSync(path.join(distSkill, 'SKILL.md'))
    ? 'run node scripts/build.mjs first'
    : false;
const runtimeBinary = process.env.IMPECCABLE_BIN
  || path.join(os.homedir(), '.impeccable', 'runtime', engineVersion, 'impeccable');

function prepareCompactWorkspace() {
  const workspace = fs.mkdtempSync(path.join(os.tmpdir(), 'imp-compact-behavior-'));
  fs.cpSync(distSkill, path.join(workspace, '.claude', 'skills', 'imp-compact'), {
    recursive: true,
  });
  for (const name of fs.readdirSync(fixture)) {
    fs.cpSync(path.join(fixture, name), path.join(workspace, name));
  }
  return workspace;
}

function compactSkillBody(workspace) {
  const skillDir = path.join(workspace, '.claude', 'skills', 'imp-compact');
  const body = fs.readFileSync(path.join(
    skillDir,
    'SKILL.md',
  ), 'utf8');
  return `Base directory for this skill (absolute): ${skillDir}\n\n${body}`;
}

function tokenReport(name, result) {
  const summary = summarizeTrace(result.trace);
  console.log(JSON.stringify({
    scenario: name,
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
}

function mutatedPaths(trace) {
  return trace.toolCalls.flatMap((call) => call.mutatedPaths || []);
}

for (const scenario of [
  {
    name: 'build',
    prompt: '/imp-compact build settings.html for Harbor Desk. Include notification preferences, role permissions, and a recent audit log with useful empty/error states. Use one explicit Save changes action that updates the page and adds an audit entry. Preserve the existing PRODUCT.md and DESIGN.md world. Do not invent commercial claims. All material decisions are specified; do not ask a question.',
    playbook: 'build.md',
    maxSteps: 12,
    assertResult(trace, workspace) {
      assert.ok(fs.existsSync(path.join(workspace, 'settings.html')));
      assert.ok(mutatedPaths(trace).includes('settings.html'));
      const first = trace.toolCalls[0];
      assert.equal(first?.name, 'bash', 'build must start with the context loader');
      assert.match(first?.input.command ?? '', /compact\s+context\b/,
        'the first tool call must load context');
      assert.ok(mutatedPaths(trace).some((file) => file.startsWith('.impeccable/surfaces/')),
        'build must persist a surface brief');
      assert.ok(fileLoaded(trace, 'craft-floor.md'), 'craft floor must load before the first UI edit');
      assert.equal(trace.readPaths.filter((file) => file.endsWith('build.md')).length, 1,
        'build playbook must be read once');
      assert.equal(trace.readPaths.filter((file) => file.endsWith('craft-floor.md')).length, 1,
        'craft floor must be read once');
      assert.equal(trace.bashCommands.filter((command) =>
        /compact\s+context\b/.test(command)).length, 1, 'context must run once');
      assert.equal(trace.bashCommands.filter((command) =>
        /compact\s+surface-brief\s+write\b/.test(command)).length, 1,
      'surface brief must be written once');
      assert.equal(trace.bashCommands.filter((command) =>
        /compact\s+detect\b/.test(command)).length, 1, 'detector must run once');
      const detectorIndex = trace.toolCalls.findIndex((call) =>
        call.name === 'bash' && /compact\s+detect\b/.test(call.input.command));
      const afterDetector = trace.toolCalls.slice(detectorIndex + 1);
      assert.ok(afterDetector.filter((call) => call.name === 'patch').length <= 1,
        'detector may produce at most one corrective patch batch');
      assert.ok(!afterDetector.some((call) =>
        call.name === 'read' && call.input.path === 'settings.html'),
      'do not reread the whole target after the detector');
      assert.ok(!trace.bashCommands.some((command) => /\s--help(?:\s|$)/.test(command)),
        'known commands must not be rediscovered with --help');
      assert.ok(!trace.bashCommands.some((command) => /\bpython3?\b/.test(command)),
        'build must use the edit tool, not ad hoc scripts');
      assert.ok(!mutatedPaths(trace).includes('DESIGN.md'),
        'an in-world surface must not rewrite the incumbent system');
      assert.ok(!mutatedPaths(trace).some((file) => file.startsWith('.impeccable/mocks/')),
        'compact core must not generate comps');
    },
  },
  {
    name: 'refine',
    prompt: '/imp-compact polish index.html. Improve the visual hierarchy and clarify the primary action. Keep the existing product facts and visual identity.',
    playbook: 'refine.md',
    assertResult(trace, workspace) {
      assert.match(
        fs.readFileSync(path.join(workspace, 'index.html'), 'utf8'),
        /Harbor Desk/,
      );
      assert.ok(mutatedPaths(trace).includes('index.html'));
      assert.ok(!mutatedPaths(trace).includes('DESIGN.md'), 'scoped refinement changed DESIGN.md');
      assert.ok(fileLoaded(trace, 'craft-floor.md'), 'craft floor must load before the first UI edit');
      assert.equal(trace.bashCommands.filter((command) =>
        /compact\s+context\b/.test(command)).length, 1, 'context must run once');
      assert.equal(trace.bashCommands.filter((command) =>
        /compact\s+detect\b/.test(command)).length, 1, 'detector must run once');
      assert.ok(!trace.bashCommands.some((command) =>
        /\b(?:node|python3?)\b/.test(command) && /(?:contrast|HTMLParser|lum\()/i.test(command)),
      'do not substitute ad hoc analyzers for the detector');
    },
  },
  {
    name: 'review',
    prompt: '/imp-compact critique index.html. Give a focused design review with material findings; do not edit.',
    playbook: 'review.md',
    assertResult(trace) {
      assert.deepEqual(trace.writePaths, []);
    },
  },
  {
    name: 'document',
    prompt: '/imp-compact document the incumbent Harbor Desk visual system. Preserve its existing identity, write a complete token-bearing DESIGN.md and schemaVersion 2 sidecar, and do not edit index.html. Do not ask a question.',
    playbook: 'system.md',
    assertResult(trace, workspace) {
      const design = fs.readFileSync(path.join(workspace, 'DESIGN.md'), 'utf8');
      assert.match(design, /^---\n[\s\S]*?\n---/);
      const sidecar = JSON.parse(fs.readFileSync(
        path.join(workspace, '.impeccable', 'design.json'),
        'utf8',
      ));
      assert.equal(sidecar.schemaVersion, 2);
      assert.ok(sidecar.extensions && Object.keys(sidecar.extensions).length);
      assert.ok(sidecar.narrative && Object.keys(sidecar.narrative).length);
      assert.ok(!mutatedPaths(trace).includes('index.html'));
    },
  },
]) {
  test(`compact ${scenario.name}`, { skip }, async () => {
    const workspace = prepareCompactWorkspace();
    try {
      const result = await runTurn({
        workspace,
        model: getModel(modelId),
        userPrompt: scenario.prompt,
        maxSteps: scenario.maxSteps ?? 12,
        maxOutputTokens: modelId.startsWith('deepseek-') ? 65_536 : undefined,
        timeoutMs: 600_000,
        skillBody: compactSkillBody(workspace),
        env: { IMPECCABLE_BIN: runtimeBinary },
        allowedBashCommands: ['context', 'surface-brief', 'detect'],
        disabledTools: scenario.name === 'build' ? ['list'] : [],
        environment: 'This is a local HTML fixture. No browser tool is available in this smoke run; disclose that rendered visual verification remains unverified.',
      });
      tokenReport(scenario.name, result);
      assert.equal(result.outcome, 'complete');
      assert.ok(fileLoaded(result.trace, scenario.playbook),
        `expected ${scenario.playbook}; trace: ${JSON.stringify(result.trace.toolCalls, null, 2)}`);
      scenario.assertResult(result.trace, workspace);
    } finally {
      fs.rmSync(workspace, { recursive: true, force: true });
    }
  });
}
