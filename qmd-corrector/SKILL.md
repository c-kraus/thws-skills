---
name: qmd-corrector
description: "Audit and fix existing Quarto lecture files (.qmd) for YAML and Div syntax errors. Use this skill whenever the user wants to check, validate, lint, or correct a .qmd file — even if they just say 'schau mal drüber', 'prüf das mal', 'fix the formatting', or 'something looks broken'. Also trigger when the user pastes a .qmd path and asks if it's correct, or when quarto render fails. The skill reads the file, systematically checks every element type, fixes all violations in-place, saves the corrected file, and outputs a structured Quality Report showing exactly what was wrong and what was fixed."
---

# QMD Corrector

A surgical audit-and-fix skill for Quarto lecture files. The goal is zero silent failures: broken Div syntax won't throw an error in the editor, but it will silently break the Moodle Lua filter or the PDF renderer. This skill catches and fixes those problems before they reach students.

## Canonical Rules

All element rules (YAML, flip-card, drag-exercise, quick-check, case-study, details, video, widget/iframe, LaTeX currency, heading hierarchy, norm citation granularity) live in **one** canonical file shared across the pipeline:

→ Load `quarto-lecture/references/qmd-quality-gate.md` (resolves via `~/.claude/skills/quarto-lecture/references/qmd-quality-gate.md`) **before auditing**. Do not rely on memorized rules — the canonical file is maintained there and may be newer than this skill.

For currency in math blocks, apply the **"Beim Korrigieren"** rule (minimal-invasive `\text{€}` repair), not the "Beim Schreiben" rule.

## Intake

The user provides a file path. If none is given, ask for one. Check that the file exists before proceeding.

Optional: `--save-as <path>` saves the corrected version separately, preserving the original.

## Workflow

1. Load the canonical rules file (see above)
2. Read the target .qmd
3. Work through checklists 1→11 in order. For each element type, scan the **entire file** for all instances before moving on — completeness beats speed here
4. For each violation: note it, apply the fix using the "Korrektur" guidance from the canonical file
5. Apply fixes with surgical Edit operations — never rewrite whole sections; preserve all original content text exactly, change only structure/syntax
6. **Verify by render (if Quarto is available):** run `quarto render <file> --to html` in a temp output dir. If it fails, read the error, fix, re-render. If Quarto is not installed, note "Render-Verifikation übersprungen (kein Quarto)" in the report
7. Output the Quality Report, then save
8. Confirm: "Saved. N issues fixed. See report above."

## Decision Rules

- **Auto-fix** clear syntax violations (heading level, blank lines, missing attributes, bare €)
- **Fix + flag for manual review** when the fix requires a content judgment: bolding a quick-check answer that wasn't marked, adding a `**Lösung:** TODO` placeholder, rewriting an ambiguous (commutative) drag-exercise
- **Flag only** when unsure whether something is a violation or an intentional stylistic choice

## Quality Report Format

```
## QMD Corrector — Quality Report
**File:** [filename]
**Date:** [today]
**Render check:** [✓ passed | ✗ failed: reason | übersprungen]

### Summary
- Issues found: N · fixed: N · manual review: N

### Fixed Automatically
| # | Element | Location | Problem | Fix Applied |
|---|---|---|---|---|

### Requires Manual Review
| # | Element | Location | Problem | Recommendation |
|---|---|---|---|---|

### No Issues Found
- [element types that passed] ✓
```

If the file is clean, still output the report with all checks ✓ — a clean bill of health is valuable feedback too.
