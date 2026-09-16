# Branch rulesets

Two files, applied in order. The order is not cosmetic.

## Why two steps

`02` requires a status check named `guard` to pass before anything merges to
`dev`, `staging` or `master`. GitHub will only accept a required check it has
seen report on the repository. Apply `02` before the workflow in
`.github/workflows/repo-hygiene.yml` has ever run and every pull request sits
at "Expected — Waiting for status to be reported" forever, with no way to merge
the pull request that would fix it. That is a self-inflicted outage, and the way
people get out of it is by disabling the ruleset — after which nothing is
protected at all.

So:

**Step 1 — apply `01-protect-branches.json`, then merge `sec/harden-B`.**

```bash
gh api -X POST repos/NextloopTechnologies/crm-fe/rulesets \
  --input .github/rulesets/01-protect-branches.json
```

This blocks force-pushes and branch deletion and requires a reviewed pull
request. It does not require any status check, so it cannot deadlock. Merging
`sec/harden-B` after this is what makes the workflow exist on `dev` and run for
the first time.

**Step 2 — confirm the check has reported, then apply `02`.**

```bash
gh run list --workflow 'repo hygiene' --branch dev --limit 1
gh api -X POST repos/NextloopTechnologies/crm-fe/rulesets \
  --input .github/rulesets/02-require-hygiene-check.json
```

Only apply `02` once that first command shows a completed run. From then on a
pull request cannot merge unless `guard` passes.

## What each rule is for

| Rule | Reason |
|---|---|
| `deletion` | A protected branch should not vanish. |
| `non_fast_forward` | No force-pushes. A force-push can move a branch back onto a commit that carries a payload, and nothing in the history will show that it happened. |
| `pull_request` | Changes get looked at. `require_last_push_approval` matters here specifically: it means a commit added after approval needs a fresh approval, which is the gap a merge-commit injection would otherwise slip through. |
| `required_status_checks: guard` | `repo-hygiene.mjs` and `merge-injection.mjs` must pass. Without this the workflow reports a failure nobody is obliged to act on. |

## bypass_actors is deliberately empty

Anyone in the bypass list can push past both guards, and the account that would
need to be in it is an admin account — which is the account an attacker with a
stolen token is most likely to be using. Add an entry only for a specific
person, for a specific reason, and remove it afterwards.

## Verifying it took effect

```bash
gh api repos/NextloopTechnologies/crm-fe/rulesets --jq '.[] | "\(.id)  \(.name)  \(.enforcement)"'
```
