// owner: @vvedula-svg · why: protect tracked migration history across file and shell tools · review-by: 2027-03-25
import { existsSync, readFileSync, realpathSync } from 'node:fs';
import { dirname, basename, resolve } from 'node:path';
import { execFileSync } from 'node:child_process';

function block(reason) {
  console.error(`Blocked: ${reason}`);
  process.exit(2);
}

function git(root, ...args) {
  return execFileSync('git', ['-C', root, ...args], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
}

function isMigration(path) {
  const lower = path.replaceAll('\\', '/').toLowerCase();
  return lower.startsWith('db/migrations/') && lower.endsWith('.sql');
}

// Resolve aliases even when a tracked target was deleted and is being recreated.
function canonical(path) {
  const missing = [];
  while (!existsSync(path)) {
    const parent = dirname(path);
    if (parent === path) throw new Error('Cannot resolve path');
    missing.unshift(basename(path));
    path = parent;
  }
  return resolve(realpathSync(path), ...missing).toLowerCase();
}

function checkDiff(root, base) {
  // No rename detection: renaming old history must be reported as a deletion.
  const changed = git(root, 'diff', '--no-ext-diff', '--no-renames', '--name-only',
    '--diff-filter=DMRTUXB', '-z', ...(base ? [base] : []), '--').split('\0').filter(isMigration);
  if (changed.length) block(`tracked migration history changed: ${changed.join(', ')}. Stop and ask the human to review/recover it; do not commit or silently revert user work.`);
}

try {
  if (process.argv[2] === '--base') {
    const base = process.argv[3];
    if (!base || base.startsWith('-')) block('a valid base revision is required.');
    checkDiff(process.cwd(), base);
    process.exit(0);
  }
  const payload = JSON.parse(readFileSync(0, 'utf8'));
  const root = process.env.CLAUDE_PROJECT_DIR || process.cwd();
  if (['PostToolUse', 'PostToolUseFailure'].includes(payload.hook_event_name)) {
    checkDiff(root, 'HEAD');
    checkDiff(root); // Also catch unstaged rewrites of newly staged migrations.
    process.exit(0);
  }
  if (!['Edit', 'Write', 'MultiEdit'].includes(payload?.tool_name)) process.exit(0);
  const file = payload.tool_input?.file_path;
  if (typeof file !== 'string' || !file) block('write operation has no valid file_path.');
  const target = canonical(resolve(payload.cwd || root, file.replaceAll('\\', '/')));
  const tracked = git(root, 'ls-files', '--cached', '-z').split('\0').filter(isMigration);
  if (tracked.some(path => canonical(resolve(root, path)) === target)) {
    block('cannot rewrite an existing migration tracked in Git. Create a new migration instead; schema history is immutable.');
  }
} catch {
  block('migration guard could not validate its input or Git state; fix the payload/repository before retrying.');
}
