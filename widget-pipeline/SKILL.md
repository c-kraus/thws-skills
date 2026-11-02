---
name: widget-pipeline
description: "Automated workflow for widgets in Quarto lectures. Modes: FULL (analyze a .qmd, build the top 3 widgets, test them against the chapter, integrate), ANALYZE-ONLY (opportunities and specs without building), AUDIT (check existing widgets of a chapter or course against their chapters: numbers, conventions, slider ranges, norm citations; find orphaned widgets and broken iframes). FULL: 'automatische Widget-Integration', 'kompletter Widget-Workflow', 'analysiere und baue Widgets ein'. ANALYZE-ONLY: 'welche Widgets passen hier', 'zeig mir Widget-Möglichkeiten', 'Widget-Analyse ohne Umsetzung'. AUDIT: 'prüf die Widgets', 'Widget-Audit', 'stimmen die Widgets noch', 'rechnen die Widgets richtig', 'verwaiste Widgets', 'warum wird Widget X nirgends genutzt', 'Widgets nach der Umstrukturierung prüfen', 'audit the widgets', also after a course rebuild or restructuring."
---

# Widget Pipeline Skill

## Purpose

Fully automated workflow that takes a Quarto .qmd file and:
1. Analyzes it for widget opportunities
2. Creates the top 3 recommended widgets
3. Saves widgets to organized directory structure
4. Tests each widget against the chapter and integrates the iframe codes into the .qmd file
5. Provides summary report

Three modes are available — choose based on the user's request:

- **FULL mode** (default): Analyze → Build → Test & Integrate → Report
- **ANALYZE-ONLY mode**: Analyze → Report specifications only (no files built)
- **AUDIT mode**: Inventory → Compare each existing widget with its chapter → Report table with ✅/⚠️/❌ and fixes. Follow `references/audit-mode.md`; Steps 1–5 below do not apply. Fixes only after the user's go-ahead.

If the project has `_running_case.md`, read it before Step 1: widgets use only its numbers, names and terms; new values go into the report under `FACT SHEET ADDITIONS`.

---

## Step 1: Analysis Phase

Load `references/analyzer-patterns.md` and apply its full logic:
- Read the complete .qmd file
- Scan for text patterns matching the three widget categories (Prozesse, Zusammenhänge, Parametervariationen)
- Assess pedagogical value and complexity for each candidate
- Generate prioritized specifications for all identified opportunities, each with its test cases (worked example inputs → expected outputs, slider ranges needed by text and tutorial tasks, presets)
- Extract top 3 high-priority recommendations

**In FULL mode:** Internal processing only — do not show the full analysis to the user yet.

**In ANALYZE-ONLY mode:** Present the full analysis report to the user and stop here.

---

## Step 2: Widget Creation Phase (FULL mode only)

For each of the top 3 widget specifications:
- Follow the `html-builder` skill to create the widget
- Follow exact specifications from the analysis
- Ensure THWS branding consistency (primary: #ff6a00, font: Inter)
- Create production-ready, self-contained HTML files
- **Include the postMessage auto-resize sender** directly before `</body>` in every widget HTML (see `references/iframe-template.md` → "Auto-Resize via postMessage")
- One file for all languages (`I18N` dictionary, `?lang=` parameter, see html-builder "Text Language") — never a copied widget per language

---

## Step 3: File Organization Phase

**Directory Structure:**
```
[qmd-directory]/
└── widgets/
    └── kapitel-XX/
        ├── widget-[name-1].html
        ├── widget-[name-2].html
        └── widget-[name-3].html
```

**Rules:**
- If the project already has a widget folder convention (e.g. `assets/chNN/`), use it; otherwise `widgets/kapitel-XX/`
- Extract chapter number from .qmd filename (e.g., `04_leases.qmd` or `kap-04-...qmd` → `kapitel-04`)
- Use descriptive, lowercase, dash-separated names
- Save widgets **relative to the .qmd file's directory**
- Verify each file is saved successfully

---

## Step 4: Test & Integration Phase

**Functional test first (per widget, before inserting):** run the html-builder functional test (`html-builder/references/functional-test.md`): defaults reproduce the chapter's worked example exactly, slider ranges cover every value in text and tutorial tasks, presets for the chapter's cases, same conventions/notation/names as the chapter, norm citations checked, node test of the calculation passes, widget opened once in a browser. A widget that fails is fixed before integration, never integrated "for now".

Load `references/iframe-template.md` for the canonical iframe syntax.

**For each widget:**
1. Locate the specified insertion point in .qmd
2. Add contextual intro text (1–2 sentences in document language) that names the default case and the number it shows (e.g. "The defaults are Project P; the widget shows the €9.76 million of the tree.")
3. Insert using the canonical `.widget` Div wrapper from `references/iframe-template.md` (English book of a bilingual course: `src="...html?lang=en"`)
4. Add blank line after the closing `:::` for readability
5. Use `str_replace` to make precise, surgical edits — never rewrite entire files

**Integration Strategy:**
- Identify unique text anchors near insertion points
- Use `str_replace` for each widget insertion separately
- Preserve all existing content and formatting
- Maintain document flow and structure

---

## Step 5: Verification & Summary

Create a summary report for the user:

```markdown
# Widget Pipeline: Abgeschlossen

## Verarbeitete Datei
- **Quelldatei:** [filename.qmd]
- **Kapitel:** [chapter number/title]
- **Sprache:** [Deutsch/English]

## Erstellte Widgets
1. **[Widget 1 Name]**
   - Datei: `widgets/kapitel-XX/widget-name-1.html`
   - Kategorie: [Prozesse/Zusammenhänge/Parametervariationen]
   - Eingefügt: [nach Abschnitt/vor Überschrift]
   - Funktionstest: [Default = Beispiel X.Y → erwartet 9,76 / Widget 9,76 ✅ · Presets ✅ · Slider ✅ · Node-Test n/n · Browser ✅]

2. **[Widget 2 Name]**
   - Datei: `widgets/kapitel-XX/widget-name-2.html`
   - Kategorie: [...]
   - Eingefügt: [...]

3. **[Widget 3 Name]**
   - Datei: `widgets/kapitel-XX/widget-name-3.html`
   - Kategorie: [...]
   - Eingefügt: [...]

## Dateipfade
- Widgets: `[qmd-directory]/widgets/kapitel-XX/`
- Aktualisierte .qmd: [filepath]

## Nächste Schritte
✅ Widgets wurden erstellt, gegen das Kapitel getestet und integriert
→ quarto render [filename.qmd]

FACT SHEET ADDITIONS
- [nur falls `_running_case.md` existiert: neue Werte, oder „keine"]
```

**File presentation:**
If `present_files` is available, use it to surface all output files. Otherwise, provide direct `computer://`-links to each file.

---

## Error Handling

**Fewer than 3 high-priority opportunities found:** Use all available high-priority widgets. If fewer than 3 total, supplement with medium-priority. Inform user in summary.

**Widget creation fails:** Skip that widget, continue with the others. Note the failure in the summary.

**Functional test fails and cannot be fixed:** Do not integrate the widget; report the failing case (expected vs. widget value).

**Integration fails:** Provide widget files anyway, show intended insertion points, let user integrate manually.

---

## Quality Assurance

Before presenting results, verify:
- ✅ All widget HTML files exist and are valid
- ✅ Each widget follows THWS design system
- ✅ Iframe codes use canonical syntax from `references/iframe-template.md`
- ✅ Document language is consistent throughout
- ✅ No content was accidentally removed from .qmd
- ✅ File paths in iframes match actual file locations (exact case — GitHub Pages is case-sensitive)
- ✅ Functional test passed for every integrated widget (numbers, slider ranges, presets, conventions, citations; node + browser)
- ✅ No new orphans: `scripts/widget_inventory.py` shows no `ORPHAN`/`MISSING` for this chapter

---

## Orchestration Logic

```
INPUT: .qmd filepath (or course root for AUDIT) + mode (FULL, ANALYZE-ONLY or AUDIT)

[AUDIT: follow references/audit-mode.md (inventory script → per-widget check → table → fixes after go-ahead), stop]
↓
STEP 1: Read _running_case.md (if any); load analyzer-patterns.md → analyze .qmd
↓
[ANALYZE-ONLY: present report, stop]
↓
STEP 2: FOR EACH of top 3 specs:
          html-builder(spec) → .html file
          SAVE to the project's widget folder
↓
STEP 3: FOR EACH widget:
          functional test (html-builder references/functional-test.md) → fix until it passes
          Load iframe-template.md
          LOCATE insertion point in .qmd
          str_replace to integrate
↓
STEP 4: Run scripts/widget_inventory.py; GENERATE summary report + present_files / computer:// links
```

---

## Notes for Claude

1. **Be efficient:** In FULL mode, don't show intermediate analysis steps to the user
2. **Be surgical:** Use precise `str_replace` operations, never rewrite entire files
3. **Be thorough:** Verify each step before proceeding
4. **Detect language:** Maintain German/English consistency from source .qmd
5. **Prioritize quality:** Better to deliver 2 excellent widgets than 3 mediocre ones
6. **Expected runtime:** 2–5 minutes depending on chapter complexity (AUDIT of a whole course: one subagent per chapter, in parallel)

## Dependencies

- Analysis logic: `references/analyzer-patterns.md`
- iframe syntax: `references/iframe-template.md`
- Audit procedure: `references/audit-mode.md`, inventory script `scripts/widget_inventory.py`
- Widget implementation and functional test: `html-builder` skill (`references/functional-test.md`)
