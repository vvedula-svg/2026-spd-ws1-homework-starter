import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, symlinkSync, rmSync, renameSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

const hook = resolve('.claude/hooks/protect-migrations.mjs');
function git(root, ...args) {
  const result = spawnSync('git', args, { cwd: root, encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr);
  return result.stdout.trim();
}

function fixture(t) {
  const root = mkdtempSync(join(tmpdir(), 'migration-guard-'));
  mkdirSync(join(root, 'db/migrations'), { recursive: true });
  writeFileSync(join(root, 'db/migrations/001_existing.sql'), 'select 1;');
  git(root, 'init', '-q');
  git(root, 'add', 'db/migrations/001_existing.sql');
  git(root, '-c', 'user.name=Fixture', '-c', 'user.email=fixture@example.test', 'commit', '-qm', 'Baseline');
  symlinkSync(join(root, 'db/migrations/001_existing.sql'), join(root, 'alias.sql'));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  return root;
}

function run(root, payload) {
  return spawnSync(process.execPath, [hook], {
    cwd: root, env: { ...process.env, CLAUDE_PROJECT_DIR: root },
    input: typeof payload === 'string' ? payload : JSON.stringify(payload), encoding: 'utf8',
  });
}

for (const tool_name of ['Edit', 'Write', 'MultiEdit']) {
  test(`${tool_name} blocks an existing migration with a reason`, t => {
    const result = run(fixture(t), { tool_name, tool_input: { file_path: 'db/migrations/001_existing.sql' } });
    assert.equal(result.status, 2);
    assert.match(result.stderr, /existing migration.*new migration/i);
  });
}

test('normalizes absolute, traversal, Windows separator and symlink paths', t => {
  const root = fixture(t);
  for (const file_path of [join(root, 'db/migrations/001_existing.sql'),
    'db/migrations/../migrations/001_existing.sql', 'db\\migrations\\001_existing.sql', 'alias.sql']) {
    assert.equal(run(root, { tool_name: 'Write', tool_input: { file_path } }).status, 2, file_path);
  }
});

test('allows a new migration, unrelated edit and reading an old migration', t => {
  const root = fixture(t);
  for (const [tool_name, file_path] of [['Write', 'db/migrations/003_new.sql'], ['Edit', 'lib/tasks.ts'],
    ['Read', 'db/migrations/001_existing.sql']]) {
    assert.equal(run(root, { tool_name, tool_input: { file_path } }).status, 0);
  }
});

test('fails closed on malformed JSON and missing write path', t => {
  const root = fixture(t);
  assert.equal(run(root, '{broken').status, 2);
  assert.equal(run(root, { tool_name: 'Write', tool_input: {} }).status, 2);
});


test('blocks upper-case SQL aliases and recreating a deleted tracked migration', t => {
  const root = fixture(t);
  assert.equal(run(root, { tool_name: 'Write', tool_input: { file_path: 'db/migrations/001_existing.SQL' } }).status, 2);
  rmSync(join(root, 'db/migrations/001_existing.sql'));
  assert.equal(run(root, { tool_name: 'Write', tool_input: { file_path: 'db/migrations/001_existing.sql' } }).status, 2);
});

test('allows editing an untracked draft, then protects it once tracked', t => {
  const root = fixture(t);
  writeFileSync(join(root, 'db/migrations/003_draft.sql'), 'select 3;');
  const payload = { tool_name: 'Edit', tool_input: { file_path: 'db/migrations/003_draft.sql' } };
  assert.equal(run(root, payload).status, 0);
  git(root, 'add', 'db/migrations/003_draft.sql');
  assert.equal(run(root, payload).status, 2);
});

const sedInPlace = process.platform === 'darwin' ? "sed -i '' 's/1/2/'" : "sed -i 's/1/2/'";
for (const command of [
  `${sedInPlace} db/migrations/001_existing.sql`,
  `cd db/migrations && ${sedInPlace} 001_existing.sql`,
  'echo changed > db/migrations/001_existing.sql',
  "sed 's/1/2/' db/migrations/001_existing.sql > changed.sql && mv changed.sql db/migrations/001_existing.sql",
  "cd db/migrations && printf changed | tee 001_existing.sql >/dev/null",
  'rm db/migrations/001_existing.sql',
  'echo changed > db/migrations/001_existing.sql && git add db/migrations',
  'echo changed > db/migrations/001_existing.sql; exit 1',
]) {
  test(`post-tool check detects shell change: ${command}`, t => {
    const root = fixture(t);
    const shell = spawnSync('/bin/sh', ['-c', command], { cwd: root });
    const result = run(root, { hook_event_name: shell.status ? 'PostToolUseFailure' : 'PostToolUse',
      tool_name: 'Bash', tool_input: { command } });
    assert.equal(result.status, 2);
    assert.match(result.stderr, /001_existing.sql/);
  });
}

test('post-tool check allows new migrations and unrelated changes', t => {
  const root = fixture(t);
  writeFileSync(join(root, 'db/migrations/003_draft.sql'), 'select 3;');
  writeFileSync(join(root, 'notes.txt'), 'notes');
  git(root, 'add', '.');
  assert.equal(run(root, { hook_event_name: 'PostToolUse', tool_name: 'Bash' }).status, 0);
});

test('CI detects a committed rename against the base', t => {
  const root = fixture(t);
  const base = git(root, 'rev-parse', 'HEAD');
  renameSync(join(root, 'db/migrations/001_existing.sql'), join(root, 'db/migrations/004_renamed.sql'));
  git(root, 'add', '-A');
  git(root, '-c', 'user.name=Fixture', '-c', 'user.email=fixture@example.test', 'commit', '-qm', 'Rename');
  const result = spawnSync(process.execPath, [hook, '--base', base], { cwd: root, encoding: 'utf8' });
  assert.equal(result.status, 2);
  assert.match(result.stderr, /001_existing.sql/);
});

test('CI accepts a committed new migration', t => {
  const root = fixture(t);
  const base = git(root, 'rev-parse', 'HEAD');
  writeFileSync(join(root, 'db/migrations/003_new.sql'), 'select 3;');
  git(root, 'add', '.');
  git(root, '-c', 'user.name=Fixture', '-c', 'user.email=fixture@example.test', 'commit', '-qm', 'Add');
  const result = spawnSync(process.execPath, [hook, '--base', base], { cwd: root, encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr);
});

test('CI detects committed content changes and rejects an invalid base', t => {
  const root = fixture(t);
  const base = git(root, 'rev-parse', 'HEAD');
  writeFileSync(join(root, 'db/migrations/001_existing.sql'), 'select 2;');
  git(root, 'add', '.');
  git(root, '-c', 'user.name=Fixture', '-c', 'user.email=fixture@example.test', 'commit', '-qm', 'Modify');
  for (const revision of [base, 'missing-revision']) {
    const result = spawnSync(process.execPath, [hook, '--base', revision], { cwd: root, encoding: 'utf8' });
    assert.equal(result.status, 2);
  }
});
