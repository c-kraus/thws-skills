---
name: widget-pipeline
description: "Automated end-to-end workflow for widget integration in Quarto lectures. Two modes: (1) FULL — analyze .qmd, build top 3 widgets, save and integrate them; (2) ANALYZE-ONLY — identify opportunities and return specifications without building. Use FULL mode for 'automatische Widget-Integration', 'kompletter Widget-Workflow', 'analysiere und baue Widgets ein'. Use ANALYZE-ONLY for 'welche Widgets passen hier', 'zeig mir Widget-Möglichkeiten', 'Widget-Analyse ohne Umsetzung'."
---

# Widget Pipeline Skill

## Purpose

Fully automated workflow that takes a Quarto .qmd file and:
1. Analyzes it for widget opportunities
2. Creates the top 3 recommended widgets
3. Saves widgets to organized directory structure
4. Integrates iframe codes into the .qmd file
5. Provides summary report

Two modes are available — choose based on the user's request:

- **FULL mode** (default): Analyze → Build → Integrate → Report
- **ANALYZE-ONLY mode**: Analyze → Report specifications only (no files built)

---

## Step 1: Analysis Phase

Load `references/analyzer-patterns.md` and apply its full logic:
- Read the complete .qmd file
- Scan for text patterns matching the three widget categories (Prozesse, Zusammenhänge, Parametervariationen)
- Assess pedagogical value and complexity for each candidate
- Generate prioritized specifications for all identified opportunities
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
- Extract chapter number from .qmd filename (e.g., `kap-03-...qmd` → `kapitel-03`)
- Use descriptive, lowercase, dash-separated names
- Save widgets to `widgets/kapitel-XX/` **relative to the .qmd file's directory**
- Verify each file is saved successfully

---

## Step 4: Integration Phase

Load `references/iframe-template.md` for the canonical iframe syntax.

**For each widget:**
1. Locate the specified insertion point in .qmd
2. Add contextual intro text (1–2 sentences in document language)
3. Insert using the canonical `.widget` Div wrapper from `references/iframe-template.md`
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
✅ Widgets wurden erstellt und integriert
→ Prüfen Sie die .qmd Datei und Widget-Funktionalität
→ quarto render [filename.qmd]
```

**File presentation:**
If `present_files` is available, use it to surface all output files. Otherwise, provide direct `computer://`-links to each file.

---

## Error Handling

**Fewer than 3 high-priority opportunities found:** Use all available high-priority widgets. If fewer than 3 total, supplement with medium-priority. Inform user in summary.

**Widget creation fails:** Skip that widget, continue with the others. Note the failure in the summary.

**Integration fails:** Provide widget files anyway, show intended insertion points, let user integrate manually.

---

## Quality Assurance

Before presenting results, verify:
- ✅ All widget HTML files exist and are valid
- ✅ Each widget follows THWS design system
- ✅ Iframe codes use canonical syntax from `references/iframe-template.md`
- ✅ Document language is consistent throughout
- ✅ No content was accidentally removed from .qmd
- ✅ File paths in iframes match actual file locations

---

## Orchestration Logic

```
INPUT: .qmd filepath + mode (FULL or ANALYZE-ONLY)

↓
STEP 1: Load analyzer-patterns.md → analyze .qmd
↓
[ANALYZE-ONLY: present report, stop]
↓
STEP 2: FOR EACH of top 3 specs:
          html-builder(spec) → .html file
          SAVE to /widgets/kapitel-XX/
↓
STEP 3: FOR EACH widget:
          Load iframe-template.md
          LOCATE insertion point in .qmd
          str_replace to integrate
↓
STEP 4: GENERATE summary report + present_files / computer:// links
```

---

## Notes for Claude

1. **Be efficient:** In FULL mode, don't show intermediate analysis steps to the user
2. **Be surgical:** Use precise `str_replace` operations, never rewrite entire files
3. **Be thorough:** Verify each step before proceeding
4. **Detect language:** Maintain German/English consistency from source .qmd
5. **Prioritize quality:** Better to deliver 2 excellent widgets than 3 mediocre ones
6. **Expected runtime:** 2–5 minutes depending on chapter complexity

## Dependencies

- Analysis logic: `references/analyzer-patterns.md`
- iframe syntax: `references/iframe-template.md`
- Widget implementation: `html-builder` skill
