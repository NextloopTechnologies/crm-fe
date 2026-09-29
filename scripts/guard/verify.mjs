#!/usr/bin/env node
/**
 * Proves the guards actually fire.
 *
 * A security check nobody has seen fail is not a check — it is a file that
 * exits 0. Every rule in repo-hygiene.mjs and merge-injection.mjs is exercised
 * here against a deliberately-bad input, and the clean repository is exercised
 * against all of them to make sure they are not simply always-red.
 *
 * Everything happens inside a throwaway local clone under the system temp
 * directory. This script never writes to your working tree.
 *
 * Run: npm run guard:verify      (exit 0 = every guard behaves as specified)
 */

import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const REPO = process.cwd();
const TMP = fs.mkdtempSync(path.join(os.tmpdir(), 'guard-verify-'));
const WORK = path.join(TMP, 'clone');

const run = (cmd, args, opts = {}) =>
  execFileSync(cmd, args, { encoding: 'utf8', maxBuffer: 256 * 1024 * 1024, ...opts });

const guard = (script, args = []) => {
  try {
    return { code: 0, out: run(process.execPath, [`scripts/guard/${script}`, ...args], { cwd: WORK, stdio: 'pipe' }) };
  } catch (e) {
    return { code: e.status ?? 1, out: String(e.stdout || '') + String(e.stderr || '') };
  }
};

let failures = 0;
const check = (name, { code, out }, wantCode, wantText) => {
  const okCode = code === wantCode;
  const okText = !wantText || out.includes(wantText);
  if (okCode && okText) {
    console.log(`  ok    ${name}`);
  } else {
    failures++;
    console.log(`  FAIL  ${name}`);
    console.log(`          exit ${code}, wanted ${wantCode}${wantText ? `; wanted text "${wantText}"` : ''}`);
    out.split('\n').slice(0, 6).forEach((l) => console.log(`          ${l}`));
  }
};

const write = (rel, text) => {
  const p = path.join(WORK, rel);
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, text);
};
const restore = (rel) => run('git', ['checkout', '--', rel], { cwd: WORK });
const rm = (rel) => fs.rmSync(path.join(WORK, rel), { force: true });

console.log(`\nguard verification (scratch clone: ${WORK})\n`);
run('git', ['clone', '--quiet', '--no-hardlinks', REPO, WORK]);

// Copy the guards as they are ON DISK, not as they are committed. This script
// has to be able to verify a change before it is committed — and a clone of a
// repo where the guards are not yet committed would otherwise "fail" every
// check with MODULE_NOT_FOUND, which looks exactly like a refusal.
fs.mkdirSync(path.join(WORK, 'scripts/guard'), { recursive: true });
for (const f of fs.readdirSync(path.join(REPO, 'scripts/guard'))) {
  fs.copyFileSync(path.join(REPO, 'scripts/guard', f), path.join(WORK, 'scripts/guard', f));
}
for (const f of ['repo-hygiene.mjs', 'merge-injection.mjs']) {
  if (!fs.existsSync(path.join(WORK, 'scripts/guard', f))) {
    console.error(`cannot verify: scripts/guard/${f} is missing`);
    process.exit(2);
  }
}

// Stage them, so `git ls-files` inside repo-hygiene.mjs sees them. Without this
// the guards are untracked in the clone and the guard never scans itself —
// which would make "clean tree passes" quietly weaker than it reads.
run('git', ['add', '-f', 'scripts/guard'], { cwd: WORK });

// --- repo-hygiene -----------------------------------------------------------
console.log('repo-hygiene.mjs');

check('clean tree passes', guard('repo-hygiene.mjs'), 0, 'clean');

const gitignore = fs.readFileSync(path.join(WORK, '.gitignore'), 'utf8');
write('.gitignore', gitignore + '\nconfig.bat\n');
check('.gitignore hiding an executable is refused', guard('repo-hygiene.mjs'), 1, 'hides an executable');
restore('.gitignore');

const tw = fs.readFileSync(path.join(WORK, 'tailwind.config.js'), 'utf8');

write('tailwind.config.js', tw + ' '.repeat(149) + 'const _0x4f2a=1;const _0x5d1e=2;const _0x9a2b=3;const _0x7c3d=4;' + 'q'.repeat(2500) + '\n');
check('obfuscated payload in a build config is refused', guard('repo-hygiene.mjs'), 1, 'hex-named identifiers');
restore('tailwind.config.js');

// 5,000 was the first threshold tried and it is wrong: a 4,217-character
// payload passes it. This case exists so nobody raises the limit back.
write('tailwind.config.js', tw + ' '.repeat(149) + 'y'.repeat(4217) + '\n');
check('4,217-char line is refused (a 5,000 threshold would not)', guard('repo-hygiene.mjs'), 1, 'character line');
restore('tailwind.config.js');

write('tailwind.config.js', tw.trimEnd().slice(0, -2)); // take the closing "};" with the payload
check('build config that no longer parses is refused', guard('repo-hygiene.mjs'), 1, 'does not parse');
restore('tailwind.config.js');

const vite = fs.readFileSync(path.join(WORK, 'vite.config.ts'), 'utf8');
write('vite.config.ts', vite.replace(/\n/g, '\r\n'));
check('CRLF reintroduced in a tracked file is refused', guard('repo-hygiene.mjs'), 1, 'CRLF line endings');
restore('vite.config.ts');

write('config.bat', '@echo off\n');
run('git', ['add', '-f', 'config.bat'], { cwd: WORK });
check('an executable committed to the tree is refused', guard('repo-hygiene.mjs'), 1, 'executable/script type');
run('git', ['rm', '-f', '--cached', '-q', 'config.bat'], { cwd: WORK });
rm('config.bat');

// The icon exemption must let real path data through and nothing else.
const ICON = 'src/assets/icons/components/__verify.tsx';
write(ICON, `export const P = () => (\n  <svg viewBox="0 0 24 24">\n    <path d="${'M0 0L1 1'.repeat(600)}" />\n  </svg>\n);\n`);
run('git', ['add', '-f', ICON], { cwd: WORK });
check('long SVG path data in an icon component is allowed', guard('repo-hygiene.mjs'), 0, 'clean');

write(ICON, `export const P = () => (\n  <svg viewBox="0 0 24 24">\n    <path d="M0 0" />\n  </svg>\n);\n${' '.repeat(149)}const _0x4f2a=1;const _0x5d1e=2;const _0x9a2b=3;const _0x7c3d=4;${'z'.repeat(2200)}\n`);
check('a payload hidden in that same exempt path is refused', guard('repo-hygiene.mjs'), 1, 'hex-named identifiers');
run('git', ['rm', '-f', '--cached', '-q', ICON], { cwd: WORK });
rm(ICON);

// This file is exempt from the SIGNATURE rules (its fixtures have to look like
// the attack) but NOT from the long-line rule. That is the whole compensating
// control for the exemption, so it is pinned here.
const self = fs.readFileSync(path.join(WORK, 'scripts/guard/verify.mjs'), 'utf8');
write('scripts/guard/verify.mjs', self + ' '.repeat(149) + 'q'.repeat(2500) + '\n');
check('a long line in the exempt harness itself is still refused', guard('repo-hygiene.mjs'), 1, 'character line');
fs.writeFileSync(path.join(WORK, 'scripts/guard/verify.mjs'), self);

check('tree is clean again', guard('repo-hygiene.mjs'), 0, 'clean');

// --- merge-injection --------------------------------------------------------
console.log('\nmerge-injection.mjs');

check(
  'known history is acknowledged, not reported as new',
  guard('merge-injection.mjs', ['--all']),
  0,
  'no NEW injection'
);

// bac9c542d REMOVES a payload inside a merge. A guard that measures the whole
// combined diff instead of only its additions flags that as an attack.
check(
  'a merge that REMOVES a payload is not flagged',
  guard('merge-injection.mjs', ['--commit', 'bac9c542db1b3d28468e47c6077732ea7f174e35']),
  0,
  'no NEW injection'
);

// A fresh injection: two clean parents, payload written into the merge itself.
const g = (...a) => run('git', a, { cwd: WORK });
g('checkout', '-q', '-b', 'verify-base');
g('checkout', '-q', '-b', 'verify-l');
write('VERIFY_L.txt', 'left\n');
g('add', 'VERIFY_L.txt');
g('-c', 'user.email=v@v', '-c', 'user.name=v', 'commit', '-q', '-m', 'left');
g('checkout', '-q', 'verify-base');
g('checkout', '-q', '-b', 'verify-r');
write('VERIFY_R.txt', 'right\n');
g('add', 'VERIFY_R.txt');
g('-c', 'user.email=v@v', '-c', 'user.name=v', 'commit', '-q', '-m', 'right');
g('-c', 'user.email=v@v', '-c', 'user.name=v', 'merge', '-q', '--no-ff', 'verify-l', '-m', 'merge');
// Assembled at runtime so the marker never appears as a literal anywhere in
// this file. If it did, `git log -S` would find THIS file in the probe commits
// and the invisibility check below would fail for the wrong reason.
const MARK = '_0x' + 'ab' + 'cd' + '99';
write(
  'tailwind.config.js',
  tw + ' '.repeat(149) + `const ${MARK}=1;const ${MARK}f=2;const ${MARK}e=3;const ${MARK}d=4;` + 'q'.repeat(2500) + '\n'
);
g('add', 'tailwind.config.js');
g('-c', 'user.email=v@v', '-c', 'user.name=v', 'commit', '-q', '--amend', '--no-edit');

const invisible = g('log', `-S${MARK}`, '--oneline', 'verify-base..HEAD').trim();
check(
  '`git log -S` cannot see the injection (this is why the guard exists)',
  { code: invisible === '' ? 0 : 1, out: invisible || 'log -S found nothing' },
  0
);
check('a NEW merge injection is refused', guard('merge-injection.mjs', ['verify-base..HEAD']), 1, 'REFUSING');

// ---------------------------------------------------------------------------
fs.rmSync(TMP, { recursive: true, force: true });

if (failures) {
  console.error(`\nguard verification: ${failures} check(s) FAILED — the guards do not do what they claim\n`);
  process.exit(1);
}
console.log('\nguard verification: every guard fires on its own attack and stays quiet otherwise\n');
process.exit(0);
