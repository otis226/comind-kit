import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const validator = fileURLToPath(new URL('../validate-public.mjs', import.meta.url));

function fixture(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'public-validator-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  for (const name of ['README.md', 'LICENSE', 'CHANGELOG.md', 'CONTRIBUTING.md', 'SECURITY.md', 'AGENTS.md', 'CLAUDE.md']) {
    fs.writeFileSync(path.join(root, name), 'Public toolkit\n');
  }
  fs.mkdirSync(path.join(root, '.claude-plugin'));
  for (const name of ['plugin.json', 'marketplace.json']) fs.writeFileSync(path.join(root, '.claude-plugin', name), '{}\n');
  const skill = path.join(root, 'skills', 'ui-review');
  fs.mkdirSync(skill, { recursive: true });
  fs.writeFileSync(path.join(skill, 'SKILL.md'), '---\nname: ui-review\n---\n<!-- comind-managed-skill: ui-review -->\nRead `INSTRUCTIONS.md` and `IMPLEMENTATION_HANDOFF.md`.\n');
  for (const name of ['INSTRUCTIONS.md', 'IMPLEMENTATION_HANDOFF.md']) fs.writeFileSync(path.join(skill, name), 'Review workflow\n');
  return { root, skill };
}

function validate(root) {
  return spawnSync(process.execPath, [validator], { cwd: root, encoding: 'utf8' });
}

test('complete public skill package passes', (t) => {
  const { root } = fixture(t);
  const result = validate(root);
  assert.equal(result.status, 0, result.stderr);
});

for (const name of ['INSTRUCTIONS.md', 'IMPLEMENTATION_HANDOFF.md']) {
  test(`missing ${name} fails`, (t) => {
    const { root, skill } = fixture(t);
    fs.unlinkSync(path.join(skill, name));
    const result = validate(root);
    assert.equal(result.status, 1);
    assert.ok(result.stderr.includes(name));
  });
}

test('directory cannot stand in for a referenced document', (t) => {
  const { root, skill } = fixture(t);
  fs.unlinkSync(path.join(skill, 'IMPLEMENTATION_HANDOFF.md'));
  fs.mkdirSync(path.join(skill, 'IMPLEMENTATION_HANDOFF.md'));
  assert.equal(validate(root).status, 1);
});

for (const replacement of ['', '<!-- comind-managed-skill: wrong-name -->']) {
  test(`missing or mismatched ownership marker fails: ${replacement || 'absent'}`, (t) => {
    const { root, skill } = fixture(t);
    const file = path.join(skill, 'SKILL.md');
    fs.writeFileSync(file, fs.readFileSync(file, 'utf8').replace('<!-- comind-managed-skill: ui-review -->', replacement));
    const result = validate(root);
    assert.equal(result.status, 1);
    assert.match(result.stderr, /ownership marker: ui-review/);
  });
}

test('ownership validation covers every skill, not just the first entry', (t) => {
  const { root } = fixture(t);
  const extra = path.join(root, 'skills', 'zz-extra');
  fs.mkdirSync(extra);
  fs.writeFileSync(path.join(extra, 'SKILL.md'), '---\nname: zz-extra\n---\n');
  const result = validate(root);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /ownership marker: zz-extra/);
});
