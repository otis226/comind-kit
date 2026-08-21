#!/usr/bin/env node
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const DIR = path.dirname(fileURLToPath(import.meta.url));
const DIRECT = path.join(DIR, 'dispatch-direct.mjs');
const CLAUDE = path.join(DIR, 'claude-worker.mjs');
const SECRET_RE = /(KEY|TOKEN|SECRET|PASSWORD|CREDENTIAL|AUTH|COOKIE|SESSION|ASKPASS|PRIVATE)/i;
const ENV_RE = /^[A-Za-z_][A-Za-z0-9_]*$/;
const CLAUDE_ENV = [
  'ANTHROPIC_BASE_URL','ANTHROPIC_API_KEY','ANTHROPIC_AUTH_TOKEN','CLAUDE_CODE_OAUTH_TOKEN',
  'ANTHROPIC_MODEL','ANTHROPIC_DEFAULT_OPUS_MODEL','ANTHROPIC_DEFAULT_SONNET_MODEL','ANTHROPIC_DEFAULT_HAIKU_MODEL',
];

function die(code, status, error, extra = {}) {
  process.stdout.write(JSON.stringify({ status, ...extra, error }, null, 2) + '\n');
  process.exit(code);
}

function parseScalar(raw) {
  const s = raw.trim();
  if (!s) return {};
  if ((s.startsWith('"') && s.endsWith('"')) || (s.startsWith("'") && s.endsWith("'"))) return s.slice(1,-1);
  if (s === 'true') return true;
  if (s === 'false') return false;
  if (s === 'null' || s === '~') return null;
  if (/^-?\d+$/.test(s)) return Number(s);
  return s;
}

function parseYaml(text, file) {
  const root = {};
  const stack = [{ indent: -2, value: root }];
  const lines = text.split(/\r?\n/);
  for (let n = 0; n < lines.length; n++) {
    const raw = lines[n];
    if (!raw.trim() || raw.trimStart().startsWith('#')) continue;
    if (/\t/.test(raw)) die(2,'ERROR',`${file}:${n+1}: tabs are not supported in worker config`);
    const indent = raw.match(/^ */)[0].length;
    if (indent % 2) die(2,'ERROR',`${file}:${n+1}: indentation must use two spaces`);
    const m = raw.trim().match(/^([A-Za-z0-9_.-]+):(?:\s+(.*))?$/);
    if (!m) die(2,'ERROR',`${file}:${n+1}: only map-style YAML is supported`);
    while (stack.length && indent <= stack.at(-1).indent) stack.pop();
    if (!stack.length || indent !== stack.at(-1).indent + 2) die(2,'ERROR',`${file}:${n+1}: invalid nesting`);
    const parent = stack.at(-1).value;
    if (Object.hasOwn(parent, m[1])) die(2,'ERROR',`${file}:${n+1}: duplicate key ${m[1]}`);
    const value = parseScalar(m[2] ?? '');
    parent[m[1]] = value;
    if (value && typeof value === 'object') stack.push({ indent, value });
  }
  return root;
}

function cli(argv) {
  const out = { passthrough: [] };
  const valueFlags = new Set(['--agent','--agent-file','--skill','--worker-config','--profile','--sdk','--model','--effort','--scope','--scope-file','--schema','--cwd','--max-turns','--readonly']);
  for (let i=0;i<argv.length;i++) {
    const a = argv[i];
    if (valueFlags.has(a)) {
      const v = argv[++i];
      if (v === undefined) die(2,'ERROR',`Missing value for ${a}`);
      const key = a.slice(2).replace(/-([a-z])/g,(_,c)=>c.toUpperCase());
      out[key] = v;
      if (!['--worker-config','--profile'].includes(a)) out.passthrough.push(a,v);
    } else {
      if (a === '--needs-browser') out.needsBrowser = true;
      out.passthrough.push(a);
    }
  }
  return out;
}

function defaultConfig() {
  if (process.env.AGENT_BRIDGE_WORKER_CONFIG) return process.env.AGENT_BRIDGE_WORKER_CONFIG;
  const base = process.env.XDG_CONFIG_HOME || path.join(os.homedir(), '.config');
  return path.join(base, 'comind', 'worker-profiles.yaml');
}

function loadConfig(explicit) {
  const file = explicit || defaultConfig();
  if (!fs.existsSync(file)) return { file: null, data: null };
  const data = parseYaml(fs.readFileSync(file,'utf8'), file);
  if (data.version !== 1) die(2,'ERROR',`${file}: version must be 1`);
  return { file: path.resolve(file), data };
}

function profileNameFor(data, args) {
  if (args.profile) return args.profile;
  if (!data) return null;
  if (args.agent) {
    const v = data.agents?.[args.agent];
    return typeof v === 'string' ? v : v?.profile || null;
  }
  if (args.skill) {
    const v = data.skills?.[args.skill];
    return typeof v === 'string' ? v : v?.profile || null;
  }
  return null;
}

function validateProfile(name, p) {
  if (!p || typeof p !== 'object') die(2,'ERROR',`Worker profile "${name}" does not exist`);
  if (!p.runtime || typeof p.runtime !== 'string') die(2,'ERROR',`Profile "${name}" requires runtime`);
  if (!p.model || typeof p.model !== 'string') die(2,'ERROR',`Profile "${name}" requires an explicit model`);
  if (p.api_key) die(2,'ERROR',`Profile "${name}" must not contain api_key; use api_key_env`);
  if (p.env && typeof p.env !== 'object') die(2,'ERROR',`Profile "${name}" env must be a map`);
  if (p.env_from && typeof p.env_from !== 'object') die(2,'ERROR',`Profile "${name}" env_from must be a map`);
  for (const [k,v] of Object.entries(p.env || {})) {
    if (!ENV_RE.test(k)) die(2,'ERROR',`Profile "${name}" has invalid env name ${k}`);
    if (SECRET_RE.test(k)) die(2,'ERROR',`Profile "${name}" must not store secret-like ${k} in YAML; use env_from`);
    if (typeof v === 'object') die(2,'ERROR',`Profile "${name}" env.${k} must be scalar`);
  }
  for (const [target,source] of Object.entries(p.env_from || {})) {
    if (!ENV_RE.test(target) || !ENV_RE.test(String(source))) die(2,'ERROR',`Profile "${name}" has invalid env_from mapping`);
  }
  if (p.runtime === 'claude-code') {
    const authTargets = Object.keys(p.env_from || {});
    const hasAuthBinding = Boolean(p.api_key_env) || authTargets.some((k) => k === 'ANTHROPIC_AUTH_TOKEN' || k === 'ANTHROPIC_API_KEY');
    if (!hasAuthBinding) die(2,'ERROR',`Claude Code profile "${name}" requires api_key_env or env_from binding for ANTHROPIC_AUTH_TOKEN/ANTHROPIC_API_KEY; owner credentials are never inherited`);
  }
}

function workerEnv(name, p) {
  const env = { ...process.env };
  if (p.runtime === 'claude-code') {
    for (const k of Object.keys(env)) if (SECRET_RE.test(k)) delete env[k];
    for (const k of CLAUDE_ENV) delete env[k];
  }
  for (const [k,v] of Object.entries(p.env || {})) env[k] = String(v);
  if (p.base_url) env.ANTHROPIC_BASE_URL = String(p.base_url);
  if (p.api_key_env) {
    const source = String(p.api_key_env);
    if (!ENV_RE.test(source)) die(2,'ERROR',`Profile "${name}" api_key_env must be an environment variable name`);
    const secret = process.env[source];
    if (!secret) die(3,'BLOCKED',`Profile "${name}" requires environment variable ${source}`, { profile:name });
    const target = p.api_key_mode === 'api-key' ? 'ANTHROPIC_API_KEY' : 'ANTHROPIC_AUTH_TOKEN';
    env[target] = secret;
  }
  for (const [target,sourceRaw] of Object.entries(p.env_from || {})) {
    const source = String(sourceRaw);
    const secret = process.env[source];
    if (!secret) die(3,'BLOCKED',`Profile "${name}" requires environment variable ${source}`, { profile:name });
    env[target] = secret;
  }
  return env;
}

function setFlag(args, flag, value) {
  const i = args.indexOf(flag);
  if (i >= 0) args.splice(i,2);
  if (value !== undefined && value !== null && value !== '') args.push(flag,String(value));
}
function setBool(args, flag, enabled) {
  const i = args.indexOf(flag);
  if (i >= 0) args.splice(i,1);
  if (enabled) args.push(flag);
}

const args = cli(process.argv.slice(2));
if (!!args.agent === !!args.skill && !args.agentFile) die(2,'ERROR','Pass exactly one anchor: --agent/--agent-file or --skill');

if (args.sdk) {
  const run = spawnSync(process.execPath,[DIRECT,...args.passthrough],{encoding:'utf8',env:process.env});
  process.stdout.write(run.stdout || ''); process.stderr.write(run.stderr || ''); process.exit(run.status ?? 4);
}

const { file: configFile, data } = loadConfig(args.workerConfig);
const name = profileNameFor(data,args);
if (!name) {
  process.stdout.write(JSON.stringify({status:'NATIVE',agent:args.agent || args.skill || null,sdk:'claude',profile:null,workerConfig:configFile,reason:configFile?'No configured mapping for this agent/skill.':'No worker config found.'},null,2)+'\n');
  process.exit(0);
}
const profile = data?.profiles?.[name];
validateProfile(name, profile);
const runtime = String(profile.runtime);
const out = [...args.passthrough];
setFlag(out,'--model', args.model || profile.model);
setFlag(out,'--effort', args.effort || profile.effort);
setFlag(out,'--readonly', args.readonly || (profile.readonly === true ? 'yes' : profile.readonly === false ? 'no' : profile.readonly));
setFlag(out,'--max-turns', args.maxTurns || profile.max_turns);
setBool(out,'--needs-browser', args.needsBrowser || profile.needs_browser === true);
const env = workerEnv(name,profile);
env.AGENT_BRIDGE_PROFILE = name;
env.AGENT_BRIDGE_WORKER_CONFIG_RESOLVED = configFile || '';

let command;
if (runtime === 'claude-code') command = [process.execPath, CLAUDE, ...out];
else command = [process.execPath, DIRECT, ...out, '--sdk', runtime];

const run = spawnSync(command[0],command.slice(1),{cwd:args.cwd || process.cwd(),encoding:'utf8',env,maxBuffer:64*1024*1024});
process.stdout.write(run.stdout || '');
process.stderr.write(run.stderr || '');
process.exit(run.status ?? 4);
