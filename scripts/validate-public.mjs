import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const required = [
  'README.md', 'LICENSE', 'CHANGELOG.md', 'CONTRIBUTING.md', 'SECURITY.md',
  'AGENTS.md', 'CLAUDE.md', '.claude-plugin/plugin.json', '.claude-plugin/marketplace.json',
];
const errors = [];
for (const relative of required) {
  if (!fs.existsSync(path.join(root, relative))) errors.push(`Missing required file: ${relative}`);
}
if (fs.existsSync(path.join(root, 'agents'))) {
  errors.push('Permanent runtime specialist agents are not part of the public architecture; use Agent Skills.');
}
function walk(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === '.git' || entry.name === 'node_modules') continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full)); else if (entry.isFile()) out.push(full);
  }
  return out;
}
const skillsRoot = path.join(root, 'skills');
if (!fs.existsSync(skillsRoot)) errors.push('Missing skills/ directory.');
else {
  for (const entry of fs.readdirSync(skillsRoot, { withFileTypes: true })) {
    if (entry.isFile() && entry.name.endsWith('.md')) errors.push(`Legacy flat skill file is not allowed: ${entry.name}`);
    if (!entry.isDirectory()) continue;
    const skillFile = path.join(skillsRoot, entry.name, 'SKILL.md');
    if (!fs.existsSync(skillFile)) { errors.push(`Skill package missing SKILL.md: ${entry.name}`); continue; }
    const skillText = fs.readFileSync(skillFile, 'utf8');
    const nameMatch = skillText.match(/^name:\s*([^\n]+)$/m);
    if (!nameMatch || nameMatch[1].trim() !== entry.name) errors.push(`Skill frontmatter name does not match directory: ${entry.name}`);
    if (skillText.includes('INSTRUCTIONS.md') && !fs.existsSync(path.join(skillsRoot, entry.name, 'INSTRUCTIONS.md'))) errors.push(`SKILL.md references missing INSTRUCTIONS.md: ${entry.name}`);
  }
}
const globalForbidden = [
  [/otis226\/comind(?!-kit)/i, 'private repository reference'],
  [/\.comind[\\/]repo/i, 'private local mirror reference'],
  [/\bcomind-context\b/i, 'private context skill reference'],
  [/\bsync-repo\b/i, 'private sync skill reference'],
  [/(?:^|[\s"'(])projects[\\/](?:<project>|[A-Za-z0-9._-]+)/im, 'private project-pack path'],
  [/[A-Za-z]:\\(?:Users|Workspace)\\/i, 'machine-specific Windows path'],
  [/\/(?:Users|home)\/[A-Za-z0-9._-]+\//i, 'machine-specific home path'],
];
const runtimeForbidden = [[/skills\/[a-z0-9-]+\.md\b/i, 'legacy flat skill path']];
const vietnameseSignals = /\b(?:Mục đích|Dùng khi|Nguyên tắc|Không|Nếu|Khi nào|Trước khi|Sau khi|Đây là|phải|được)\b/i;
for (const file of walk(root)) {
  const relative = path.relative(root, file).replaceAll('\\', '/');
  if (relative === 'scripts/validate-public.mjs') continue;
  if (!/\.(?:md|json|mjs|yml|yaml)$/i.test(file)) continue;
  const text = fs.readFileSync(file, 'utf8');
  for (const [pattern, label] of globalForbidden) if (pattern.test(text)) errors.push(`${relative}: ${label}`);
  const isRuntimeInstruction = relative.startsWith('skills/');
  if (isRuntimeInstruction) {
    for (const [pattern, label] of runtimeForbidden) if (pattern.test(text)) errors.push(`${relative}: ${label}`);
    if (relative.endsWith('.md') && vietnameseSignals.test(text)) errors.push(`${relative}: reusable runtime instructions should be English-first`);
  }
}
for (const relative of ['.claude-plugin/plugin.json', '.claude-plugin/marketplace.json']) {
  const file = path.join(root, relative);
  if (!fs.existsSync(file)) continue;
  try { JSON.parse(fs.readFileSync(file, 'utf8')); } catch (error) { errors.push(`${relative}: invalid JSON (${error.message})`); }
}
if (errors.length) { console.error('Public validation FAILED:\n- ' + errors.join('\n- ')); process.exit(1); }
console.log('Public validation PASS');
