---
name: lecture-factory
description: "Full end-to-end workflow for creating a complete, widget-enhanced Quarto lecture from raw content. Orchestrates quarto-lecture (write the .qmd), then widget-pipeline (analyze, build, and integrate interactive widgets) with a review checkpoint in between. Use when the user wants to go from raw notes, PDFs, or RAG output to a production-ready lecture chapter with interactive HTML widgets — all in one command. Trigger for German requests like 'Erstelle mir ein komplettes Kapitel mit Widgets', 'Vollständiger Vorlesungsworkflow', 'baue mir eine komplette Vorlesung', 'Kapitel komplett mit allem Drum und Dran', or any request that combines lecture creation with widget integration. Also trigger when the user provides raw content and says something like 'mach alles' or 'full workflow' or 'von Anfang bis Ende'."
---

# Lecture Factory

A meta-skill that takes raw content and produces a finished, widget-enhanced Quarto lecture in two clearly separated stages with a review checkpoint in the middle.

## What This Skill Does

**Stage 1:** Write the lecture (.qmd file) from raw input, following the quarto-lecture skill's standards — Trinity of Depth pedagogy, correct Div syntax, THWS branding, YAML frontmatter.

**Checkpoint:** Show the finished .qmd to the user and ask: "Looks good? Should I now run the widget pipeline?"

**Stage 2:** If confirmed, run the widget-pipeline — analyze the .qmd for interactive visualization opportunities, build the top 3 widgets as self-contained HTML files, and integrate them into the .qmd using `.widget` Div wrappers.

## Pre-Flight: Curriculum & Kontext

Bevor Intake gesammelt wird, zwei Checks — in dieser Reihenfolge, still im Hintergrund.

### Check 1: Curriculum

Suche `_curriculum.md` im Ausgabe-Verzeichnis (oder einem von der Person genannten Projektpfad).

**Gefunden:** Lade die Datei sofort und still. Extrahiere:
- Den Vorgänger-Eintrag (Kapitel Nr - 1): Titel + Kernthemen
- Den Nachfolger-Eintrag (Kapitel Nr + 1): Titel + Kernthemen
- Kursweite Terminologie-Konventionen (falls definiert)

Diese Informationen fließen in Stage 1 ein (siehe "Curriculum-bewusstes Schreiben" unten).

**Nicht gefunden:** Einmalig fragen:
> "Ich habe keine `_curriculum.md` im Projektverzeichnis gefunden. Diese Datei listet alle Kapitel in Reihenfolge und ermöglicht konsistente Vor-/Rückverweise. Soll ich sie anlegen? Vorlage: `lecture-factory/references/curriculum-template.md`."
>
> Antwortet die Person mit Nein oder ignoriert es, einfach ohne Curriculum fortfahren.

---

### Check 2: Kontext-Materialien

Suche `context/kapitel-{nn}/` im Projektverzeichnis (Kapitelnummer aus dem Intake ableiten).

**Gefunden und nicht leer:** Dateiliste anzeigen und fragen:
> "Ich habe Kontext-Materialien für Kapitel {nn} gefunden:
> - [Datei 1]
> - [Datei 2]
> Soll ich diese als Quellen für das Kapitel verwenden?"

Bei **Ja**: Alle Dateien laden. Enthält der Ordner ein `wiki/`-Unterverzeichnis (second-brain-Output), diese Dateien als vorstrukturiertes Wissen mit höherem Gewicht behandeln als rohe PDFs/Notizen.

Bei **Nein** oder **nicht gefunden**: Mit dem nutzerbereitgestellten Input fortfahren.

`context/shared/` (falls vorhanden) immer mitlesen — dort liegen kursweite Normen und Glossare.

---

## Intake: What to Collect Before Starting

Before writing a single line, confirm these with the user (pull from context if already clear):

| What you need | How to get it |
|---|---|
| **Raw content** | Notes, RAG output, PDF text, or bullet points — anything the user pastes or attaches |
| **Chapter number** | e.g., "Kapitel 3" → determines filename `kap-03-...qmd` and widget folder `widgets/kapitel-03/` |
| **Topic / slug** | e.g., "Rückstellungen" → filename `kap-03-rueckstellungen.qmd` |
| **Subtitle** | Brief explanatory subtitle for the YAML frontmatter; derive from topic if not given |
| **Language** | Detect from content; confirm if ambiguous |
| **Output directory** | Where to save the .qmd — default to user's project path or `outputs/` |

If critical info is missing (especially the raw content), ask before proceeding. If the chapter number is not given, pick a reasonable default and mention it.

## Stage 1: Writing the Lecture

Follow the **quarto-lecture** skill in full:

1. Clean the input (strip source markers, remove meta-comments, resolve contradictions)
2. Write YAML frontmatter (lang, title, subtitle, author, format)
3. Architect the chapter structure using Trinity of Depth (Theory → Norm → Practice)
4. Write 1,500–3,000 words of prose with correct element density (~1 interactive element per 400–600 words)
5. Use correct Div syntax: `.details`, `.case-study`, `.drag-exercise`, `.quick-check`, `.flip-card`, `.video`, `.widget`
6. Save to `[output-directory]/kap-{nn}-{slug}.qmd`

### Curriculum-bewusstes Schreiben

Wenn `_curriculum.md` geladen wurde, gelten zusätzlich:

- **Eröffnungssatz (falls Vorgänger-Kapitel existiert):** Das erste H2-Section-Opening enthält einen 1-Satz-Rückverweis: *„Aufbauend auf [Kernthema aus Kapitel N-1] ..."* — nicht als Zusammenfassung, sondern als gedanklichen Anschluss.
- **Schlusspunkt (falls Nachfolger-Kapitel existiert):** Das Kapitel endet statt mit einer Zusammenfassung mit einem knappen Vorausverweis: *„[Thema des nächsten Kapitels] wird zeigen, wie ..."* — 1 Satz, keine Spoiler.
- **Terminologie-Konsistenz:** Begriffe aus `_curriculum.md` → Terminologie-Konventionen werden genau so verwendet. Kein eigenes Vokabular einführen, das mit dem Kurs bricht.
- **Keine Redefinition:** Konzepte, die in früheren Kapiteln etabliert wurden (erkennbar an den Kernthemen im Curriculum), werden nicht neu erklärt — stattdessen kurz als bekannt vorausgesetzt.

Do NOT use widget iframes in Stage 1 — those come in Stage 2. Placeholder comments are fine if a visualization is obviously needed:
```markdown
<!-- Widget placeholder: ROI calculator goes here -->
```

### Heading Hierarchy Discipline

Before saving, verify: if any H2 section contains only a single H3 subsection, promote the content to H2 and eliminate the empty nesting. A heading level is only justified when there are at least two siblings at that level.

### QMD Quality Gate (run before saving)

After drafting the .qmd but **before saving or presenting it**, load `quarto-lecture/references/qmd-quality-gate.md` and apply all checks. Fix every flip-card and drag-exercise violation inline before proceeding.

### Accounting QA (nach Quality Gate)

Scanne den fertigen Entwurf auf Accounting-Indikatoren: Zahlenbeispiele, Buchungssätze, §§-Verweise (HGB/IFRS/AktG/…), Literaturzitate. Mindestens ein Indikator reicht, um den Skill aufzurufen.

**Wenn Accounting-Indikatoren vorhanden:** `accounting-qa` Skill aufrufen.
- Skill dispatcht bis zu drei Subagents parallel (Kalkulationen, Normen, Literatur)
- QA-Report abwarten und in den Checkpoint-Output integrieren (kompakte Zusammenfassung: Anzahl ✅/⚠️/❌)
- Bei ❌ Fehlern: Fehler direkt im QMD korrigieren, bevor der Checkpoint dem Nutzer präsentiert wird
- Bei ⚠️ Hinweisen: im Checkpoint anzeigen, Nutzer entscheidet

**Wenn keine Indikatoren:** Schritt überspringen, Checkpoint direkt starten.

---

### Checkpoint

After saving the .qmd, present it to the user and ask:

> **Kapitel gespeichert als `kap-{nn}-{slug}.qmd`** (~{word-count} Wörter)**.**
>
> [Wenn Perspektiven-Review gelaufen:] **Review:** {N} Verbesserungen angewandt (Professor · Sehr guter Student · Mittelmäßiger Student) — Details oben.
>
> [Wenn Accounting QA gelaufen:] **QA-Ergebnis:** {N} ✅ korrekt · {N} ⚠️ Hinweise · {N} ❌ Fehler (Details im QA-Report oben)
>
> Möchtest du, dass ich jetzt die Widget-Pipeline starte? Ich analysiere das Kapitel, baue die Top 3 interaktiven Widgets und binde sie direkt ein.
>
> *(English: Chapter saved. Want me to run the widget pipeline now — analyze the chapter, build the top 3 interactive widgets, and integrate them?)*

Wait for explicit confirmation before proceeding to Stage 2. If the user says no, or wants to edit first, stop here and let them.

## Stage 2: Widget Pipeline

Only runs after the user says yes at the checkpoint.

Follow the **widget-pipeline** skill in full (FULL mode):

0. **Pre-scan for placeholders:** Before running the analysis, scan the .qmd for `<!-- Widget placeholder: ... -->` comments left by Stage 1. Treat each placeholder location as a highest-priority candidate; the widget-pipeline analysis fills remaining slots up to 3 total.
1. **Analyze** the saved .qmd for widget opportunities (load `widget-pipeline/references/analyzer-patterns.md`)
2. **Build** the top 3 high-priority widgets as standalone HTML files using THWS design system
3. **Save** widgets to `[qmd-directory]/widgets/kapitel-{nn}/widget-{name}.html`
4. **Integrate** each widget into the .qmd at the correct location:

```markdown
::: {.widget}
<iframe src="widgets/kapitel-{nn}/widget-{name}.html"
        width="100%" height="[appropriate]px" frameborder="0"
        title="[Accessible title in document language]">
</iframe>
:::
```

5. Replace any placeholder comments from Stage 1 with actual widget integrations where applicable.

### Final Summary

After Stage 2 completes, present:

```
## Lecture Factory: Abgeschlossen ✓

### Kapitel
- Datei: kap-{nn}-{slug}.qmd
- Wörter: ~[count]
- Interaktive Elemente (nativ): [count flip-cards, quick-checks, etc.]

### Widgets
1. [Widget Name] — widgets/kapitel-{nn}/widget-{name-1}.html
   Eingebunden nach: [section heading]
2. [Widget Name] — widgets/kapitel-{nn}/widget-{name-2}.html
   Eingebunden nach: [section heading]
3. [Widget Name] — widgets/kapitel-{nn}/widget-{name-3}.html
   Eingebunden nach: [section heading]

### Nächste Schritte
→ Prüfen Sie das Kapitel auf inhaltliche Korrektheit
→ Testen Sie die Widgets im Browser
→ quarto render kap-{nn}-{slug}.qmd
```

If `present_files` is available, use it to surface all output files.

## Error Handling

**Stage 1 fails (no/poor raw content):** Ask the user to provide better input. Don't fabricate content.

**Checkpoint declined:** Save the .qmd and stop. The user can run the widget pipeline manually later.

**Stage 2: fewer than 3 high-priority widgets found:** Build what's available (minimum 1). Explain in the summary why fewer were built.

**Stage 2: widget creation fails:** Skip that widget, continue with the others. Note the failure in the summary.

## Quality Bar

The output of this skill must meet the same standard as if both skills had been run independently by an expert:

- .qmd renders without errors in both HTML (Moodle) and PDF output
- All Div containers use correct syntax (no bare HTML, no broken divs)
- **Every `.flip-card` div:** `####` heading immediately followed by body (no blank line), H4 level only, one paragraph body
- **Every `.drag-exercise` div:** no heading inside, 1–2 sentences, fillable terms in `*italics*`
- Widget iframes use relative paths and are wrapped in `.widget` Div
- No content was accidentally removed or corrupted during widget integration
- Document language (German/English) is consistent throughout, including widget UI text

## Notes for Claude

- This skill does not replace quarto-lecture or widget-pipeline — it orchestrates them. Follow those skills' logic in full rather than improvising.
- The checkpoint is non-negotiable. Never auto-proceed to Stage 2 without user confirmation.
- If the user is using the `lecture-factory` skill but only wants the lecture (no widgets), tell them `quarto-lecture` is the right skill for that.
- Keep intermediate status updates brief — the user cares about the finished product, not the pipeline steps.
