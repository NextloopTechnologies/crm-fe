#!/usr/bin/env node
/**
 * Detects code injected directly into merge commits.
 *
 * A merge commit normally contains nothing of its own — every line comes from
 * one parent or the other. Git records content in the merge itself only when a
 * human resolved a conflict. So content in a merge commit that appears in
 * NEITHER parent was, by definition, hand-written into the merge.
 *
 * That happened twice in this repository:
 *
 *   cb8bc04cf9bc  2026-07-11  "Merge branch 'dev' of ..."
 *     parent 16ea5ae1  tailwind.config.js = 84 chars   clean
 *     parent 0b53fa28  tailwind.config.js = 84 chars   clean
 *     result            tailwind.config.js = 30,002 chars
 *
 *   8191fbeea895  2026-07-29  "Merge pull request #38 ..."
 *     parent d041d040  84 chars   clean
 *     parent 6191c9b8  84 chars   clean
 *     result            30,002 chars
 *
 * The second one is the merge that put the payload on `dev`, where it stayed
 * for 36 days until 4b44822 cleared it on 2026-09-03.
 *
 * This hiding place is chosen because it is invisible to ordinary review:
 *
 *   - `git log -S<string>` skips merge commits by default, so searching the
 *     history for the payload finds nothing.
 *   - GitHub's "Files changed" tab diffs the branch against its base. The merge
 *     commit's own content is not shown there.
 *   - `git log -p` likewise omits merge diffs unless asked.
 *
 * `git show --cc` is the exception: the combined diff shows exactly what
 * differs from all parents — the conflict resolution and nothing else. On an
 * honest merge that is small and about conflicting edits. Here it was a
 * 30,002-character line.
 *
 * Run:
 *   node scripts/guard/merge-injection.mjs              # merges on HEAD not in origin/dev
 *   node scripts/guard/merge-injection.mjs <rev-range>  # explicit range
 *   node scripts/guard/merge-injection.mjs --commit <sha>
 *   node scripts/guard/merge-injection.mjs --all        # every merge on every ref
 */

import { execFileSync } from 'node:child_process';

const git = (...args) => {
  try {
    return execFileSync('git', args, { encoding: 'utf8', maxBuffer: 256 * 1024 * 1024 });
  } catch {
    return '';
  }
};

const args = process.argv.slice(2);
let commits;

if (args[0] === '--commit') {
  commits = [args[1]];
} else if (args[0] === '--all') {
  commits = git('rev-list', '--merges', '--all').split('\n').filter(Boolean);
} else {
  commits = git('rev-list', '--merges', args[0] || 'origin/dev..HEAD').split('\n').filter(Boolean);
}

/** Content this size in a conflict resolution is not a conflict resolution. */
const MAX_RESOLUTION_LINE = 2000;

const OBFUSCATION = [
  [/_0x[0-9a-f]{4,6}/g, 'hex-named identifiers (javascript-obfuscator)'],
  [/global\s*\[\s*['"]!['"]\s*\]/g, "global['!'] marker"],
  [/(\\x[0-9a-fA-F]{2}){20,}/g, 'long hex-escape runs'],
  [/createRequire\s*\(/g, 'createRequire shim in ESM'],
  [/\beval\s*\(/g, 'eval('],
  [/child_process/g, 'child_process'],
];

/**
 * Commits already known to carry the payload.
 *
 * These are in the published history. Nothing removes them from a branch that
 * descends from them short of rewriting history and having everyone re-clone —
 * a coordinated decision, not something a CI check should force. Until that
 * happens this guard would fail every build for a fact everybody already knows,
 * and a check that is always red gets ignored, which defeats the point of it.
 *
 * So they are listed by exact SHA, with what each one is. The list is not a
 * pattern: a new injection cannot hide behind it. Full 40-character SHAs,
 * matched exactly — a 7-character prefix is 28 bits, short enough that a
 * crafted commit could be made to collide with an allowlisted one, which would
 * turn this allowlist into a way to smuggle a payload past the guard.
 *
 * WHAT AN ENTRY HERE MEANS: this commit is known-bad, it is in history, and the
 * content is gone at every branch tip. It is NOT a claim that the commit is
 * harmless, and it suppresses nothing at the tip — repo-hygiene.mjs checks the
 * working tree independently and never consults this list.
 *
 * Collected by scanning all 176 commits on all 47 refs, not by hand, so this is
 * the full set rather than what happened to be noticed. 31 of the 34 introduced
 * the payload; 3 inherited it from a parent and are listed so the range reads
 * completely. Two are merge-injections; the rest are ordinary single-parent
 * commits, which is what a compromised workstation looks like in a history.
 *
 * Author names are as recorded in the commits. Commit metadata is forgeable and
 * is not attribution — only GitHub's audit log records who actually pushed.
 */
const KNOWN_COMPROMISED = new Map([
  ['b21155588c48d2d43ddb4d4b0b1932574376287d', '2026-04-30  ishika-sahu-1          5294-char  direct commit'],
  ['16cdb8d8d7b7f7feee8ea96487c3603231c14a86', '2026-05-05  ishika-sahu-1          5294-char  inherited from parent'],
  ['2d98b5c0776db259ce3b73c38426e122fc361e7c', '2026-05-06  ishika-sahu-1          5294-char  inherited from parent'],
  ['6439872f625c3bba518b4d5c90b348296c934da4', '2026-05-18  ishika-sahu-1         30002-char  direct commit'],
  ['b133e95450401b444cb225708d056fd798f95c4c', '2026-05-20  ishika-sahu-1         30002-char  direct commit'],
  ['7a30ad35e6ec9a387b9cba5ff33c825b3921f66a', '2026-05-21  ishika-sahu-1         30002-char  direct commit'],
  ['4064f32ea6750f665e4fde00d0020c77347f7a0d', '2026-05-26  ishika-sahu-1         30002-char  direct commit'],
  ['be24fa4cb0197675743ae1ae318e4fde38e3eea5', '2026-05-26  ishika-sahu-1         30002-char  direct commit'],
  ['15a15a98be2c39eb7ed35c89369d34cfc85e7f44', '2026-05-27  ishika-sahu-1         30002-char  direct commit'],
  ['10dc70588c63037e354c1ae628af7285cad508b6', '2026-05-29  ishika-sahu-1         30002-char  direct commit'],
  ['88e2260e31211f4f73c9e856980c8ac315eea2cc', '2026-06-01  ishika-sahu-1         30002-char  direct commit'],
  ['51bcda9a77d77f9c4702ad4903bf4df12afcf379', '2026-06-03  ishika-sahu-1         30002-char  direct commit'],
  ['f472da5957783485859801144ae85914d20e3f9c', '2026-06-04  ishika-sahu-1         30002-char  direct commit'],
  ['1b3fd9c9f2cfeca95918494658bc5e21166ae468', '2026-06-08  ishika-sahu-1         30002-char  direct commit'],
  ['41bf222b2ebad512afc2909cf9c1c27efc0f7e0d', '2026-06-09  ishika-sahu-1         30002-char  direct commit'],
  ['c2f34ca3610dd448f9a8a7a8d4dd126fcd0f1c27', '2026-06-09  ishika-sahu-1         30002-char  direct commit'],
  ['0eed14131415c22a06059565c973b7f6c9265e1e', '2026-06-11  ishika-sahu-1         30002-char  direct commit'],
  ['95f60f7b1bf997c39cf5dc64eefa5a984cc171aa', '2026-06-11  ishika-sahu-1         30002-char  direct commit'],
  ['78caaac2776cf57bed2221cef03f8aa6a8a915a0', '2026-06-12  ishika-sahu-1         30002-char  direct commit'],
  ['94d568c9c331215a205bffcc89425f185290fa8e', '2026-06-24  tanmay-nextloop       30002-char  direct commit'],
  ['a4852c09d667eed79c4f3541f4908f764268b084', '2026-06-25  ishika-sahu-1         30002-char  direct commit'],
  ['6be2aa25e61d73e7f5e1798c67ebe4c085a56a22', '2026-06-30  ishika-sahu-1         30002-char  direct commit'],
  ['d1afd3973eeaf62850ef6f09bb6449b81d5763f8', '2026-07-03  ishika-sahu-1         30002-char  direct commit'],
  ['a39092f88d7ec23edf5ae73747614350e269257a', '2026-07-06  ishika-sahu-1         30002-char  direct commit'],
  ['89cbfb58d9dad55b52373431a3063f12040c13fc', '2026-07-07  ishika-sahu-1         30002-char  direct commit'],
  ['48023c9c1beeef6307497b6e7c226487bb8df14c', '2026-07-10  ishika-sahu-1         30002-char  direct commit'],
  ['200f21ed5bcb80d6b97ca2ed9001c13425790b24', '2026-07-11  ishika-sahu-1         30002-char  direct commit'],
  ['cb8bc04cf9bc37a74fb3fb0396ed7c189337d425', '2026-07-11  ishika-sahu-1         30002-char  merge-injection'],
  ['06e5758d46b4e9612178a64ddca0eec34c79de7d', '2026-07-14  ishika-sahu-1         30002-char  direct commit'],
  ['9482581f18ad43319afba3ccac6a197f1961dad0', '2026-07-14  ishika-sahu-1         30002-char  direct commit'],
  ['da7e601b7ef85406b3be86c5ad85481da3e82922', '2026-07-27  ishika-sahu-Nextloop  30002-char  direct commit'],
  ['516024389c53013f9c5aa8a137bb15853f1a6a67', '2026-07-28  ishika-sahu-Nextloop  30002-char  direct commit'],
  ['8191fbeea895c34a56c6084597653ad483f368f4', '2026-07-29  ishika-sahu-NextLoop  30002-char  merge-injection'],
  ['21696a92d31fb08613f4dc7303ce93907d01be67', '2026-09-03  ishika-sahu-Nextloop  30002-char  inherited from parent'],
]);

const problems = [];
const acknowledged = [];

for (const sha of commits) {
  // The combined diff: only content differing from ALL parents.
  const cc = git('show', '--cc', '--no-color', '--format=', sha);
  if (!cc.trim()) continue; // honest merge, nothing of its own

  // In a combined diff the prefix is one column PER PARENT. A line whose prefix
  // contains '+' is content the merge introduced relative to that parent; a line
  // whose prefix is only '-' was removed by the merge.
  //
  // Measuring the whole combined diff instead of just the added lines is a real
  // bug, not a theoretical one: bac9c542d (2026-05-05) REMOVES a 5,294-character
  // payload inside a merge, and a guard that measures removals flags that commit
  // as an attack. Cleaning up is the behaviour this guard should be encouraging.
  const nParents = (git('rev-list', '--parents', '-n1', sha).trim().split(/\s+/).length - 1) || 1;
  const added = cc
    .split('\n')
    .filter((l) => !/^(diff |index |--- |\+\+\+ |@@|new file|deleted file|similarity|rename )/.test(l))
    .filter((l) => l.slice(0, nParents).includes('+'))
    .map((l) => l.slice(nParents));

  const meta = git('log', '-1', '--format=%s%n%an%n%ad', '--date=short', sha).split('\n');
  const where = `${sha.slice(0, 9)}  ${meta[1] || '?'}  ${meta[2] || '?'}  ${(meta[0] || '').slice(0, 44)}`;

  const reasons = [];

  const longest = Math.max(...added.map((l) => l.length), 0);
  if (longest > MAX_RESOLUTION_LINE) reasons.push(`a ${longest}-character line`);

  const addedText = added.join('\n');
  for (const [rx, label] of OBFUSCATION) {
    const n = (addedText.match(rx) || []).length;
    if (n) reasons.push(`${label} ×${n}`);
  }

  if (!reasons.length) continue;

  // Exact match only — see the note on the list above.
  if (KNOWN_COMPROMISED.has(sha)) {
    acknowledged.push(`${sha.slice(0, 9)}  ${KNOWN_COMPROMISED.get(sha)}`);
    continue;
  }

  const files = git('show', '--cc', '--name-only', '--format=', sha).split('\n').filter(Boolean);
  problems.push(
    `${where}\n      introduces, in the merge itself: ${reasons.join('; ')}\n` +
      `      files: ${files.slice(0, 6).join(', ')}\n` +
      `      inspect with: git show --cc ${sha.slice(0, 9)}`
  );
}

if (acknowledged.length) {
  console.log('merge-injection: known-compromised history present (documented, not a new finding):');
  acknowledged.forEach((a) => console.log(`  ! ${a}`));
  console.log('  These stay in history until it is rewritten. Branch tips are clean.\n');
}

if (problems.length === 0) {
  console.log(`merge-injection: no NEW injection (${commits.length} merge commit(s) checked)`);
  process.exit(0);
}

console.error('\nmerge-injection: REFUSING\n');
problems.forEach((p) => console.error(`  - ${p}\n`));
console.error(
  "Content in a merge commit that is in neither parent was hand-written into\n" +
    "the merge. It is invisible to `git log -S` and to GitHub's Files-changed\n" +
    'tab, which is how an obfuscated payload reached `dev` on 2026-07-29 and\n' +
    'stayed there for 36 days. See the header of scripts/guard/merge-injection.mjs.\n'
);
process.exit(1);
