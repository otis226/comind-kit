#!/usr/bin/env node
// Agent Bridge dispatcher.
// Runs an existing agent definition on a non-native coding CLI (SDK backend).
//
// Usage:
//   node dispatch.mjs (--agent <name> | --skill <name>) --sdk <backend>
//                     [--model <id>] [--effort <level>]
//                     (--scope <text> | --scope-file <path>)
//                     [--needs-browser] [--readonly auto|yes|no] [--schema <path>]
//                     [--cwd <dir>] [--max-turns <n>] [--raw] [--dry-run]
//
// Exit codes: 0 ok | 2 usage/resolution error | 3 BLOCKED (capability gate) | 4 backend failure

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const HOME = os.homedir();

/* ------------------------------------------------------------------ backends */
// Adding a backend = adding one entry here. Nothing else changes.
// browser may be:
//   'verified' / 'unverified' / 'none'
//   { type: 'mcp-doctor', server: '<name>' } for a runtime capability probe.
const BACKENDS = {
  grok: {
    bin: 'grok',
    enabled: true,
    browser: { type: 'mcp-doctor', server: 'chrome-devtools' },
    // Keep this pinned so a bridged run cannot drift with ~/.grok/config.toml.
    defaultModel: 'grok-4.6',
    build(ctx) {
      const args = [
        '--prompt-file', ctx.promptFile,
        '--output-format', 'plain',
        '--sandbox', ctx.readonly ? 'read-only' : 'workspace',
        '--permission-mode', ctx.readonly ? 'dontAsk' : 'bypassPermissions',
        '--max-turns', String(ctx.maxTurns),
        '-m', ctx.model,
      ];
      if (ctx.effort) args.push('--effort', ctx.effort);
      if (ctx.readonly) {
        // Defense in depth: the sandbox is the filesystem boundary; removing edit, shell,
        // and subagent paths prevents a reviewer from bypassing it through another tool.
        args.push('--disallowed-tools', 'search_replace,write_file,run_terminal_cmd,Agent');
      }
      if (ctx.needsBrowser) args.push('--allow', 'MCPTool(chrome-devtools__*)');
      if (ctx.schemaText) args.push('--json-schema', ctx.schemaText);
      return { args, stdin: null, resultFile: null };
    },
  },

  codex: {
    bin: 'codex',
    enabled: true,
    browser: 'unverified',
    defaultModel: 'gpt-5.6-sol',
    build(ctx) {
      const args = ['exec', '-'];
      args.push('-s', ctx.readonly ? 'read-only' : 'workspace-write');
      args.push('-m', ctx.model);
      if (ctx.effort) args.push('-c', 'model_reasoning_effort="' + ctx.effort + '"');
      if (ctx.schemaFile) args.push('--output-schema', ctx.schemaFile);
      args.push('-o', ctx.resultFile);
      return { args, stdin: ctx.prompt, resultFile: ctx.resultFile };
    },
  },

  // Placeholder: no code path is claimed until the CLI exists and has been tested.
  cursor: {
    bin: 'cursor-agent',
    enabled: false,
    browser: 'unverified',
    defaultModel: null,
    build() { throw new Error('cursor backend is not enabled yet'); },
  },
};

/* --------------------------------------------------------------------- utils */
function fail(code, status, message, extra) {
  const envelope = Object.assign({ status, agent: null, sdk: null }, extra || {}, { error: message });
  process.stdout.write(JSON.stringify(envelope, null, 2) + '\n');
  process.exit(code);
}

const strip = (s) => s.trim().replace(/^["']|["']$/g, '').trim();
const asList = (v) => (Array.isArray(v) ? v : String(v || '').split(',').map((x) => x.trim()).filter(Boolean));

function parseArgs(argv) {
  const out = { needsBrowser: false, readonly: 'auto', raw: false, dryRun: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    const next = () => argv[++i];
    switch (a) {
      case '--agent': out.agent = next(); break;
      case '--agent-file': out.agentFile = next(); break;
      case '--sdk': out.sdk = next(); break;
      case '--skill': out.skill = next(); break;
      case '--model': out.model = next(); break;
      case '--effort': out.effort = next(); break;
      case '--scope': out.scope = next(); break;
      case '--scope-file': out.scopeFile = next(); break;
      case '--schema': out.schema = next(); break;
      case '--cwd': out.cwd = next(); break;
      case '--max-turns': out.maxTurns = Number(next()); break;
      case '--readonly': out.readonly = next(); break;
      case '--needs-browser': out.needsBrowser = true; break;
      case '--raw': out.raw = true; break;
      case '--dry-run': out.dryRun = true; break;
      default: fail(2, 'ERROR', 'Unknown argument: ' + a);
    }
  }
  return out;
}

function onPath(bin) {
  const probe = process.platform === 'win32' ? 'where' : 'which';
  return spawnSync(probe, [bin], { encoding: 'utf8' }).status === 0;
}

function probeBrowser(backend, cwd) {
  const capability = backend.browser;
  if (capability === 'verified') return { ok: true };
  if (capability && typeof capability === 'object' && capability.type === 'mcp-doctor') {
    const run = spawnSync(backend.bin, ['mcp', 'doctor', capability.server, '--json'], {
      cwd: cwd || process.cwd(),
      encoding: 'utf8',
    });
    if (run.status === 0) return { ok: true };
    const detail = ((run.stderr || run.stdout || '').trim().slice(0, 1200) || 'probe exited with status ' + run.status);
    return { ok: false, detail: 'MCP server "' + capability.server + '" failed runtime probe: ' + detail };
  }
  return { ok: false, detail: 'browser status is "' + String(capability) + '"' };
}

/* ------------------------------------------------- agent definition resolving */
function projectAgentDirs(baseDir) {
  const dirs = [];
  let dir = path.resolve(baseDir || process.cwd());
  for (;;) {
    dirs.push(path.join(dir, '.claude', 'agents'));
    dirs.push(path.join(dir, '.grok', 'agents'));
    const parent = path.dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  return dirs;
}

function agentSearchDirs(baseDir) {
  const claudeHome = process.env.CLAUDE_CONFIG_DIR || path.join(HOME, '.claude');
  const dirs = [
    ...projectAgentDirs(baseDir),
    path.join(claudeHome, 'agents'),
    path.join(HOME, '.grok', 'agents'),
  ];

  // Bounded scan for plugin-provided agent definitions.
  const walk = (dir, depth) => {
    if (depth > 6 || !fs.existsSync(dir)) return;
    let entries = [];
    try { entries = fs.readdirSync(dir, { withFileTypes: true }); } catch { return; }
    for (const e of entries) {
      if (!e.isDirectory()) continue;
      if (e.name === 'agents') dirs.push(path.join(dir, e.name));
      else walk(path.join(dir, e.name), depth + 1);
    }
  };
  walk(path.join(claudeHome, 'plugins'), 0);

  return [...new Set(dirs)].filter((d) => fs.existsSync(d));
}

function resolveAgentFile(name, explicit, baseDir) {
  if (explicit) {
    if (!fs.existsSync(explicit)) fail(2, 'ERROR', 'Agent file not found: ' + explicit);
    return explicit;
  }
  const dirs = agentSearchDirs(baseDir);
  // Resolve per directory in priority order: filename first, then frontmatter name.
  for (const dir of dirs) {
    const byFilename = path.join(dir, name + '.md');
    if (fs.existsSync(byFilename)) return byFilename;
    let entries = [];
    try { entries = fs.readdirSync(dir); } catch { continue; }
    for (const entry of entries) {
      if (!entry.endsWith('.md')) continue;
      const candidate = path.join(dir, entry);
      try {
        if (readAgentDefinition(candidate).meta.name === name) return candidate;
      } catch { /* unreadable definition: skip */ }
    }
  }
  fail(2, 'ERROR',
    'No definition found for agent "' + name + '". Searched: ' + dirs.join(', ') +
    '. Built-in agents without a definition file cannot be bridged; pass --agent-file explicitly.');
}

// Minimal frontmatter reader: scalars, inline lists, block lists. Enough for agent definitions.
function readAgentDefinition(file) {
  const text = fs.readFileSync(file, 'utf8').replace(/^\uFEFF/, '');
  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!m) return { meta: {}, body: text.trim() };

  const meta = {};
  let key = null;
  for (const rawLine of m[1].split(/\r?\n/)) {
    const listItem = rawLine.match(/^\s*-\s+(.*)$/);
    if (listItem && key) {
      if (!Array.isArray(meta[key])) meta[key] = [];
      meta[key].push(strip(listItem[1]));
      continue;
    }
    const kv = rawLine.match(/^([A-Za-z_][\w-]*)\s*:\s*(.*)$/);
    if (!kv) continue;
    key = kv[1];
    const value = kv[2].trim();
    if (value === '' || value === '>' || value === '|' || value === '>-' || value === '|-') meta[key] = [];
    else if (value.charAt(0) === '[') meta[key] = value.replace(/^\[|\]$/g, '').split(',').map(strip).filter(Boolean);
    else meta[key] = strip(value);
  }
  for (const k of Object.keys(meta)) {
    if (Array.isArray(meta[k]) && meta[k].length === 0) meta[k] = '';
  }
  return { meta, body: m[2].trim() };
}

function deriveReadonly(meta, override) {
  if (override === 'yes') return true;
  if (override === 'no') return false;
  const denied = asList(meta.disallowedTools).map((t) => t.toLowerCase());
  if (denied.some((t) => t === 'write' || t === 'edit' || t === 'notebookedit')) return true;
  const allowed = asList(meta.tools);
  if (allowed.length && allowed.indexOf('*') === -1) {
    const lower = allowed.map((t) => t.toLowerCase());
    if (lower.indexOf('write') === -1 && lower.indexOf('edit') === -1) return true;
  }
  return false;
}

/* -------------------------------------------------------------- skill loading */
let SKILL_ROOTS = [];

// Project-scoped skills win over user-scoped ones, nearest directory first.
function skillRoots(baseDir) {
  const roots = [];
  if (process.env.AGENT_SKILLS_ROOT) roots.push(process.env.AGENT_SKILLS_ROOT);
  let dir = path.resolve(baseDir || process.cwd());
  for (;;) {
    roots.push(path.join(dir, '.claude', 'skills'));
    const parent = path.dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  roots.push(path.join(HOME, '.agents', 'skills'));
  roots.push(path.join(process.env.CLAUDE_CONFIG_DIR || path.join(HOME, '.claude'), 'skills'));
  return roots.filter((r) => fs.existsSync(r));
}

function loadSkill(name) {
  for (const root of SKILL_ROOTS) {
    const file = path.join(root, name, 'SKILL.md');
    if (fs.existsSync(file)) return fs.readFileSync(file, 'utf8').trim();
  }
  return null;
}

/* ------------------------------------------------------------------ main flow */
const opts = parseArgs(process.argv.slice(2));
const hasAgentAnchor = Boolean(opts.agent || opts.agentFile);
if (hasAgentAnchor === Boolean(opts.skill)) fail(2, 'ERROR', 'Pass exactly one anchor: --agent/--agent-file or --skill');
if (!opts.sdk) fail(2, 'ERROR', 'Missing --sdk');
if (!['auto', 'yes', 'no'].includes(opts.readonly)) fail(2, 'ERROR', '--readonly must be auto, yes, or no');
if (opts.maxTurns !== undefined && (!Number.isInteger(opts.maxTurns) || opts.maxTurns < 1)) {
  fail(2, 'ERROR', '--max-turns must be a positive integer');
}

const backend = BACKENDS[opts.sdk];
if (!backend) fail(2, 'ERROR', 'Unknown sdk "' + opts.sdk + '". Known: ' + Object.keys(BACKENDS).join(', '));
if (!backend.enabled) {
  fail(3, 'BLOCKED', 'Backend "' + opts.sdk + '" is a placeholder and not enabled in this build.',
    { agent: opts.agent || opts.skill, sdk: opts.sdk });
}
if (!onPath(backend.bin)) {
  fail(3, 'BLOCKED', 'Backend CLI "' + backend.bin + '" is not on PATH.',
    { agent: opts.agent || opts.skill, sdk: opts.sdk });
}
if (opts.needsBrowser) {
  const browser = probeBrowser(backend, opts.cwd);
  if (!browser.ok) {
    fail(3, 'BLOCKED',
      'Task requires browser evidence but backend "' + opts.sdk + '" cannot prove the required browser capability. ' + browser.detail,
      { agent: opts.agent || opts.skill, sdk: opts.sdk });
  }
}

SKILL_ROOTS = skillRoots(opts.cwd);

let agentFile = null;
let parsed = { meta: {}, body: '' };
let agentName;
if (hasAgentAnchor) {
  agentFile = resolveAgentFile(opts.agent, opts.agentFile, opts.cwd);
  parsed = readAgentDefinition(agentFile);
  agentName = parsed.meta.name || opts.agent || path.basename(agentFile, '.md');
} else {
  agentName = opts.skill;
}

const readonly = deriveReadonly(parsed.meta, opts.readonly);
const model = opts.model || backend.defaultModel || null;
if (!model) {
  fail(2, 'ERROR', 'Backend "' + opts.sdk + '" has no pinned default model; pass --model explicitly.',
    { agent: agentName, sdk: opts.sdk });
}

let scope = '';
try {
  scope = opts.scopeFile ? fs.readFileSync(opts.scopeFile, 'utf8') : (opts.scope || '');
} catch (err) {
  fail(2, 'ERROR', 'Could not read scope file: ' + err.message, { agent: agentName, sdk: opts.sdk });
}
if (!scope.trim()) fail(2, 'ERROR', 'Missing --scope or --scope-file', { agent: agentName, sdk: opts.sdk });

const skillNames = asList(parsed.meta.skills);
if (opts.skill && skillNames.indexOf(opts.skill) === -1) skillNames.unshift(opts.skill);
const skills = [];
const missingSkills = [];
for (const name of skillNames) {
  const content = loadSkill(name);
  if (content) skills.push({ name, content });
  else missingSkills.push(name);
}
if (missingSkills.length) {
  fail(2, 'ERROR',
    'Agent "' + agentName + '" declares skills that could not be resolved: ' + missingSkills.join(', ') +
    '. Searched: ' + SKILL_ROOTS.join(', ') +
    '. Install them before bridging, otherwise the run would silently improvise its own workflow.',
    { agent: agentName, sdk: opts.sdk });
}

/* ------------------------------------------------------------ prompt assembly */
const sections = [];
sections.push(
  '# Operating contract\n\n' +
  'You are running ' + (agentFile ? 'as the agent' : 'the workflow') + ' "' + agentName +
  '" on a non-native runtime. The contract below is authoritative. ' +
  'Follow it exactly; do not substitute your own workflow.'
);
if (parsed.body) sections.push('## Agent definition: ' + agentName + '\n\n' + parsed.body);
for (const s of skills) sections.push('## Agent Skill: ' + s.name + '\n\n' + s.content);
if (readonly) {
  sections.push(
    '## Capability boundary\n\n' +
    'This run is READ-ONLY. Do not create, edit, or delete any file in the working tree. ' +
    'If completing the task would require an edit, report that instead of performing it.'
  );
}
sections.push('# Task\n\n' + scope.trim());

let schemaFile = null;
let schemaText = null;
if (opts.schema) {
  schemaFile = path.resolve(opts.schema);
  if (!fs.existsSync(schemaFile)) fail(2, 'ERROR', 'Schema file not found: ' + schemaFile, { agent: agentName, sdk: opts.sdk });
  schemaText = fs.readFileSync(schemaFile, 'utf8');
  sections.push('# Return contract\n\nReturn only JSON matching this schema:\n\n```json\n' + schemaText.trim() + '\n```');
} else {
  sections.push(
    '# Return contract\n\n' +
    'Your final message is the return value, not a chat reply. ' +
    'Report the outcome and the concrete evidence behind it. State anything you could not verify.'
  );
}

const prompt = sections.join('\n\n---\n\n') + '\n';

/* ---------------------------------------------------------------- dispatching */
const stamp = process.pid + '-' + agentName.replace(/[^A-Za-z0-9._-]/g, '_');
const promptFile = path.join(os.tmpdir(), 'agent-bridge-' + stamp + '.prompt.md');
const resultFile = path.join(os.tmpdir(), 'agent-bridge-' + stamp + '.result.txt');
fs.writeFileSync(promptFile, prompt, 'utf8');

const ctx = {
  promptFile,
  resultFile,
  prompt,
  model,
  effort: opts.effort || null,
  readonly,
  needsBrowser: opts.needsBrowser,
  maxTurns: opts.maxTurns || Number(process.env.AGENT_BRIDGE_MAX_TURNS || 40),
  schemaFile,
  schemaText,
};

const plan = backend.build(ctx);
const info = {
  status: 'OK',
  agent: agentName,
  agentFile,
  sdk: opts.sdk,
  model: ctx.model,
  effort: ctx.effort,
  readonly,
  needsBrowser: opts.needsBrowser,
  skills: skills.map((s) => s.name),
  promptBytes: Buffer.byteLength(prompt, 'utf8'),
};

if (opts.dryRun) {
  const preview = Object.assign({}, info, { status: 'DRY_RUN', command: [backend.bin].concat(plan.args) });
  process.stdout.write(JSON.stringify(preview, null, 2) + '\n');
  process.stdout.write('\n----- composed prompt (' + info.promptBytes + ' bytes) -----\n' + prompt);
  fs.rmSync(promptFile, { force: true });
  process.exit(0);
}

const run = spawnSync(backend.bin, plan.args, {
  cwd: opts.cwd || process.cwd(),
  input: plan.stdin || undefined,
  encoding: 'utf8',
  maxBuffer: 64 * 1024 * 1024,
  shell: process.platform === 'win32',
});

let output = run.stdout || '';
if (plan.resultFile && fs.existsSync(plan.resultFile)) {
  output = fs.readFileSync(plan.resultFile, 'utf8');
  fs.rmSync(plan.resultFile, { force: true });
}
fs.rmSync(promptFile, { force: true });

if (opts.raw) {
  process.stdout.write(output);
  process.exit(run.status === 0 ? 0 : 4);
}

const envelope = Object.assign({}, info, {
  status: run.status === 0 ? 'OK' : 'BACKEND_FAILED',
  exitCode: run.status,
  result: output.trim(),
});
if (run.status !== 0) envelope.stderr = (run.stderr || run.error?.message || '').trim().slice(0, 4000);

process.stdout.write(JSON.stringify(envelope, null, 2) + '\n');
process.exit(run.status === 0 ? 0 : 4);
