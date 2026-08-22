#!/usr/bin/env node
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const DIR = path.dirname(fileURLToPath(import.meta.url));
const DIRECT = path.join(DIR, 'dispatch-direct.mjs');
const CLAUDE = path.join(DIR, 'claude-worker.mjs');
const SECRET_RE = /(KEY|TOKEN|SECRET|PASSWORD|CREDENTIAL|AUTH|COOKIE|SESSION|ASKPASS|PRIVATE)/i;
const ENV_RE = /^[A-Za-z_][A-Za-z0-9_]*$/;
const CLAUDE_ENV = [
  'ANTHROPIC_BASE_URL', 'ANTHROPIC_API_KEY', 'ANTHROPIC_AUTH_TOKEN', 'CLAUDE_CODE_OAUTH_TOKEN',
  'ANTHROPIC_MODEL', 'ANTHROPIC_DEFAULT_OPUS_MODEL', 'ANTHROPIC_DEFAULT_SONNET_MODEL', 'ANTHROPIC_DEFAULT_HAIKU_MODEL',
];

function die(code, status, error, extra = {}) {
  process.stdout.write(JSON.stringify({ status, ...extra, error }, null, 2) + '\n');
  process.exit(code);
}

function spawnHeadless(command, args, options = {}) {
  return spawnSync(command, args, { ...options, windowsHide: true });
}

function cli(argv) {
  const out = { passthrough: [] };
  const valueFlags = new Set([
    '--agent', '--agent-file', '--skill', '--sdk', '--model', '--effort', '--scope', '--scope-file',
    '--schema', '--cwd', '--max-turns', '--readonly', '--base-url', '--api-key-env', '--api-key-mode',
  ]);
  const wrapperOnly = new Set(['--sdk', '--base-url', '--api-key-env', '--api-key-mode']);
  const removed = new Set(['--worker-config', '--profile']);

  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (removed.has(a)) {
      die(2, 'ERROR', `${a} is no longer supported. Choose the role with --agent/--skill and select external execution explicitly with --sdk and --model.`);
    }
    if (valueFlags.has(a)) {
      const v = argv[++i];
      if (v === undefined) die(2, 'ERROR', `Missing value for ${a}`);
      const key = a.slice(2).replace(/-([a-z])/g, (_, c) => c.toUpperCase());
      out[key] = v;
      if (!wrapperOnly.has(a)) out.passthrough.push(a, v);
      continue;
    }
    if (a === '--needs-browser') out.needsBrowser = true;
    out.passthrough.push(a);
  }
  return out;
}

const args = cli(process.argv.slice(2));
const hasAgent = Boolean(args.agent || args.agentFile);
const hasSkill = Boolean(args.skill);
if (hasAgent === hasSkill) die(2, 'ERROR', 'Pass exactly one anchor: --agent/--agent-file or --skill');

if (!args.sdk) {
  process.stdout.write(JSON.stringify({
    status: 'NATIVE',
    agent: args.agent || args.skill || args.agentFile || null,
    sdk: null,
    model: null,
    reason: 'No external runtime selected. Use the role in the native runtime/context.',
  }, null, 2) + '\n');
  process.exit(0);
}

if (!args.model) {
  die(2, 'ERROR', 'External execution requires an explicit --model. CoMind does not resolve runtime/model from persistent role mappings.', { sdk: args.sdk });
}

let run;
if (args.sdk === 'claude-code') {
  if (!args.apiKeyEnv) {
    die(2, 'ERROR', 'External Claude Code requires --api-key-env <ENV_NAME> so it cannot inherit the main owner credential route.', { sdk: args.sdk, model: args.model });
  }
  if (!ENV_RE.test(args.apiKeyEnv)) {
    die(2, 'ERROR', '--api-key-env must be an environment variable name, not a literal secret.', { sdk: args.sdk, model: args.model });
  }
  const mode = args.apiKeyMode || 'auth-token';
  if (!['auth-token', 'api-key'].includes(mode)) {
    die(2, 'ERROR', '--api-key-mode must be auth-token or api-key.', { sdk: args.sdk, model: args.model });
  }
  const secret = process.env[args.apiKeyEnv];
  if (!secret) {
    die(3, 'BLOCKED', `External Claude Code requires environment variable ${args.apiKeyEnv}.`, { sdk: args.sdk, model: args.model });
  }

  const env = { ...process.env };
  for (const key of Object.keys(env)) if (SECRET_RE.test(key)) delete env[key];
  for (const key of CLAUDE_ENV) delete env[key];
  if (args.baseUrl) env.ANTHROPIC_BASE_URL = args.baseUrl;
  env[mode === 'api-key' ? 'ANTHROPIC_API_KEY' : 'ANTHROPIC_AUTH_TOKEN'] = secret;
  env.AGENT_BRIDGE_EXTERNAL = '1';

  run = spawnHeadless(process.execPath, [CLAUDE, ...args.passthrough], {
    cwd: args.cwd || process.cwd(),
    encoding: 'utf8',
    env,
    maxBuffer: 64 * 1024 * 1024,
  });
} else {
  if (args.baseUrl || args.apiKeyEnv || args.apiKeyMode) {
    die(2, 'ERROR', '--base-url, --api-key-env, and --api-key-mode are only supported by the external claude-code route.', { sdk: args.sdk, model: args.model });
  }
  run = spawnHeadless(process.execPath, [DIRECT, ...args.passthrough, '--sdk', args.sdk], {
    cwd: args.cwd || process.cwd(),
    encoding: 'utf8',
    env: process.env,
    maxBuffer: 64 * 1024 * 1024,
  });
}

process.stdout.write(run.stdout || '');
process.stderr.write(run.stderr || '');
process.exit(run.status ?? 4);
