#!/usr/bin/env node
/**
 * Repository hygiene guard.
 *
 * This exists because of a specific incident in this repository, and the facts
 * are recorded here so the rules below are not mistaken for generic paranoia.
 *
 * Between 2026-04-30 and 2026-09-03, obfuscated JavaScript was appended to
 * tailwind.config.js on 31 commits across 30 branches. Two variants: 5,294
 * characters carrying a `global['!']` marker, then 30,002 characters of
 * javascript-obfuscator output with `_0x`-named identifiers. tailwind.config.js
 * executes on every `vite build` and on every `npm run dev`.
 *
 * Twenty-nine of those 31 were ordinary single-parent commits: the parent's
 * config was 84 characters, the commit's was 30,002, and the rest of the commit
 * was real work. That is what an injector resident on a developer machine looks
 * like in a history — it rewrites the file between checkout and commit and gets
 * swept in with whatever else was being committed. The other two were written
 * directly into merge commits whose parents were both clean; scripts/guard/
 * merge-injection.mjs is the check for those.
 *
 * Alongside it, `config.bat` was added to .gitignore on 2026-04-24, 04-28,
 * 04-30 and 05-05. Ignoring build output is what .gitignore is for. Ignoring
 * something that *runs* is how a program stays in a working tree without ever
 * appearing in `git status`. It was added four times, so deleting it once is
 * not a fix — this guard is.
 *
 * Five rules:
 *
 *  1. .gitignore may not hide executables or scripts.
 *  2. No executable or script file types committed. This is a Vite/React app;
 *     there is no legitimate .bat, .exe or .dll in it.
 *  3. No CRLF in tracked text files. .gitattributes normalises endings, so this
 *     should never fire — but a guard that only works when the settings are
 *     already right is not a guard.
 *  4. No obfuscation signatures, and no lines long enough to hide a payload.
 *  5. Every build config must still parse. Removing a payload and leaving a
 *     broken config is not a fix.
 *
 * Run: node scripts/guard/repo-hygiene.mjs [--staged]
 *   --staged  check what is about to be committed (the pre-commit hook)
 *             otherwise check every tracked file (CI)
 */

import { execFileSync } from 'node:child_process';
import fs from 'node:fs';

const STAGED = process.argv.includes('--staged');

/** File types that execute. None of these belong in a Vite/React repository. */
const EXECUTABLE = /\.(bat|cmd|com|exe|msi|scr|vbs|vbe|wsf|ps1|psm1|jar|app|dll|so|dylib)$/i;

/**
 * `.sh` is deliberately NOT in that list. Shell scripts are a normal part of a
 * project, and blocking them would train people to reach for `--no-verify` —
 * a guard everyone routinely skips protects nothing.
 */

const git = (...args) => execFileSync('git', args, { encoding: 'utf8', maxBuffer: 256 * 1024 * 1024 });

const problems = [];

// ---------------------------------------------------------------------------
// 1. .gitignore must not conceal anything that runs
// ---------------------------------------------------------------------------
let ignoreText = '';
try {
  ignoreText = fs.readFileSync('.gitignore', 'utf8');
} catch {
  /* no .gitignore is fine */
}

ignoreText.split('\n').forEach((raw, i) => {
  const line = raw.replace(/\r$/, '').trim();
  if (!line || line.startsWith('#')) return;
  const bare = line.replace(/^!?\/*/, '').replace(/\/$/, '');
  if (EXECUTABLE.test(bare)) {
    problems.push(
      `.gitignore:${i + 1} hides an executable or script: "${line}"\n` +
        '    An ignored file never appears in `git status`, so a program can sit\n' +
        '    in a working tree indefinitely without anyone being prompted to look\n' +
        '    at it. If the file is needed, commit it so it can be reviewed. If it\n' +
        '    is not needed, delete it — do not hide it.'
    );
  }
});

// ---------------------------------------------------------------------------
// 2. no executable file types in the tree
// ---------------------------------------------------------------------------
const files = (
  STAGED ? git('diff', '--cached', '--name-only', '--diff-filter=ACMR') : git('ls-files')
)
  .split('\n')
  .map((f) => f.trim())
  .filter(Boolean);

files.forEach((f) => {
  if (EXECUTABLE.test(f)) problems.push(`${f} is an executable/script type and must not be committed`);
});

// ---------------------------------------------------------------------------
// 3. no CRLF in tracked text files
// ---------------------------------------------------------------------------
const TEXT = /\.(ts|tsx|js|jsx|mjs|cjs|json|md|css|scss|html|yml|yaml|xml|txt|svg)$|(^|\/)\.git(ignore|attributes)$/i;

const crlf = files.filter((f) => TEXT.test(f)).filter((f) => {
  try {
    return fs.readFileSync(f).includes('\r\n');
  } catch {
    return false; // deleted or unreadable; not this guard's problem
  }
});

if (crlf.length) {
  problems.push(
    `${crlf.length} file(s) contain CRLF line endings, e.g. ${crlf.slice(0, 3).join(', ')}\n` +
      '    A repo-wide line-ending flip rewrites every line of every file. The\n' +
      '    resulting diff is too large to review, and small changes ride inside\n' +
      '    it unseen — which is how config.bat was re-added here.\n' +
      '    Fix: git add --renormalize .   (with the committed .gitattributes)'
  );
}

// ---------------------------------------------------------------------------
// 4. no obfuscated payloads, and no lines long enough to hide one
//
// The threshold is 2,000 characters, not 5,000. 5,000 was tried first and is
// wrong: a 4,217-character payload passes it cleanly. Nothing this project
// writes by hand comes close to 2,000 — the real source files here top out
// around 200.
// ---------------------------------------------------------------------------
const OBFUSCATION = [
  [/_0x[0-9a-f]{4,6}/g, 'hex-named identifiers (javascript-obfuscator output)'],
  [/global\s*\[\s*['"]!['"]\s*\]/g, "global['!'] marker"],
  [/(\\x[0-9a-fA-F]{2}){20,}/g, 'long runs of hex escapes'],
];

/** Hand-written source. Minified vendor bundles are not in this list. */
const SOURCE = /\.(ts|tsx|js|jsx|mjs|cjs)$/i;
const MAX_LINE = 2000;

/**
 * Icon components. These are inline SVG path data wrapped in JSX, so their
 * lines run to ~4,000 characters legitimately. They are exempt from the
 * long-line rule ONLY — the obfuscation signatures below still apply to them,
 * and a long line here must still look like path data rather than code
 * (see JS_SHAPED). Without that second test this exemption would simply be a
 * new place to put a payload.
 */
const LONG_LINE_EXEMPT = /^src\/assets\/(icons|images)\//i;
const JS_SHAPED = /=>|\bfunction\b|;\s*\w|\)\s*\(|\breturn\b\s*[\w(]/;

/**
 * The test harness is exempt from the SIGNATURE rules only.
 *
 * verify.mjs exists to point every rule at the attack it is meant to catch, so
 * it necessarily contains `_0x`-style identifiers as fixtures. Without this it
 * fails the very guard it tests — and the obvious way out, exempting all of
 * scripts/guard/, would carve out the one directory nobody would think to look
 * in.
 *
 * So: one exact filename, and the long-line rule above STILL APPLIES to it.
 * That is the compensating control. Every fixture in verify.mjs is built at
 * runtime with .repeat(), so its longest line is 211 characters; a real payload
 * pasted into this file would be long and would be refused. The file is short
 * and is meant to be read.
 */
const SIGNATURE_EXEMPT = /^scripts\/guard\/verify\.mjs$/;


files
  .filter((f) => SOURCE.test(f))
  .forEach((f) => {
    let text;
    try {
      text = fs.readFileSync(f, 'utf8');
    } catch {
      return;
    }

    for (const line of text.split('\n')) {
      if (line.length <= MAX_LINE) continue;
      if (LONG_LINE_EXEMPT.test(f) && !JS_SHAPED.test(line)) continue; // SVG path data
      problems.push(
        `${f} has a ${line.length}-character line\n` +
          '    Source files here do not have lines this long. Padding a payload\n' +
          '    past the right edge of the editor is exactly how 30,002 characters\n' +
          '    of obfuscated JavaScript sat in tailwind.config.js unnoticed.'
      );
      break;
    }

    if (SIGNATURE_EXEMPT.test(f)) return; // fixtures; the long-line rule above still applied

    for (const [rx, label] of OBFUSCATION) {
      const n = (text.match(rx) || []).length;
      if (n > 3) problems.push(`${f} contains ${label} (×${n}) — obfuscated code does not belong in source`);
    }
  });

// ---------------------------------------------------------------------------
// 5. every build config must still PARSE
//
// Removing a payload is not enough; the removal has to leave a working file.
// The payload was appended to the same line as the closing "};" behind a run
// of padding spaces, so deleting "that line" takes the closing brace with it
// and the config stops parsing. "the payload is gone" and "the file is valid"
// are two different checks and both are needed.
// ---------------------------------------------------------------------------
const PARSEABLE = /(^|\/)(vite|tailwind|postcss|eslint|vitest)\.config\.[cm]?js$/i;

files
  .filter((f) => PARSEABLE.test(f) && fs.existsSync(f))
  .forEach((f) => {
    try {
      execFileSync(process.execPath, ['--check', f], { stdio: 'pipe' });
    } catch (error) {
      const detail =
        String(error.stderr || error.message)
          .split('\n')
          .find((l) => /Error/.test(l)) || '';
      problems.push(
        `${f} does not parse: ${detail.trim()}\n` +
          '    A build config that does not parse fails every build. If you just\n' +
          '    stripped a payload out of this file, check you did not take the\n' +
          '    closing brace with it — the payload was appended to that line.'
      );
    }
  });

// ---------------------------------------------------------------------------

if (problems.length === 0) {
  console.log(`repo-hygiene: clean (${files.length} file(s) checked)`);
  process.exit(0);
}

console.error('\nrepo-hygiene: REFUSING\n');
problems.forEach((p) => console.error(`  - ${p}\n`));
console.error(
  'This guard exists because obfuscated JavaScript rode tailwind.config.js in\n' +
    'this repository for 127 days, and because config.bat was added to\n' +
    '.gitignore four times. See the header of scripts/guard/repo-hygiene.mjs.\n'
);
process.exit(1);
