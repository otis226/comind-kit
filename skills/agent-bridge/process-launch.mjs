import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

export function spawnHeadless(command, args, options = {}) {
  return spawnSync(command, args, { ...options, windowsHide: true });
}

function resolveCmdShimTarget(file) {
  let text;
  try {
    text = fs.readFileSync(file, 'utf8');
  } catch {
    return null;
  }

  // npm cmd-shims end in a call shaped like:
  //   "%_prog%" "%dp0%\node_modules\pkg\cli.js" %*
  // or use the older %~dp0 form. Extract only that destination and never
  // pass arbitrary worker arguments back through cmd.exe.
  const match = text.match(/"%(?:~dp0|dp0%)\\([^"]+)"\s+%\*/i);
  if (!match) return null;

  const relative = match[1].replace(/[\\/]+/g, path.sep);
  const target = path.resolve(path.dirname(file), relative);
  if (!fs.existsSync(target)) return null;

  const ext = path.extname(target).toLowerCase();
  if (['.js', '.cjs', '.mjs'].includes(ext)) {
    return { command: process.execPath, preArgs: [target], target, kind: 'npm-node-shim' };
  }
  if (['.exe', '.com'].includes(ext)) {
    return { command: target, preArgs: [], target, kind: 'npm-native-shim' };
  }

  try {
    const firstLine = fs.readFileSync(target, 'utf8').split(/\r?\n/, 1)[0];
    if (/^#!.*\bnode(?:\.exe)?\b/i.test(firstLine)) {
      return { command: process.execPath, preArgs: [target], target, kind: 'npm-node-shim' };
    }
  } catch {
    return null;
  }
  return null;
}

function firstResolvedLine(stdout) {
  return String(stdout || '')
    .split(/\r?\n/)
    .map((line) => line.trim())
    .find(Boolean) || null;
}

export function resolveBin(bin, env = process.env) {
  const probe = process.platform === 'win32'
    ? spawnHeadless('where.exe', [bin], { encoding: 'utf8', env })
    : spawnHeadless('which', [bin], { encoding: 'utf8', env });
  if (probe.status !== 0) return null;

  const resolved = firstResolvedLine(probe.stdout);
  if (!resolved) return null;

  if (process.platform !== 'win32') {
    return { command: resolved, preArgs: [], resolved, kind: 'native' };
  }

  const ext = path.extname(resolved).toLowerCase();
  if (ext === '.cmd' || ext === '.bat') {
    const shim = resolveCmdShimTarget(resolved);
    if (shim) return { ...shim, resolved };
    return {
      command: null,
      preArgs: [],
      resolved,
      kind: 'unsupported-batch-shim',
      error: `Windows launcher ${resolved} is a batch shim that cannot be safely resolved without cmd.exe`,
    };
  }

  return { command: resolved, preArgs: [], resolved, kind: 'native' };
}
