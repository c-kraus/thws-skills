---
name: quarto-lecture
description: "Create hybrid Quarto Markdown (.qmd) lecture scripts for Single Source Publishing (interactive Moodle websites + static PDF textbooks). Use when the user requests: (1) creation of .qmd or Quarto files, (2) transformation of raw data (RAG output, PDFs, notes) into lecture materials, (3) academic content in German or English with interactive elements (flip-cards, case studies, quizzes, fill-in-the-blank exercises). Also trigger for German requests like 'Schreib mir das Kapitel über X', 'Transformiere meine Notizen in ein Kapitel', 'Erstelle ein Lehrskript zu Y', 'mach mir ein QMD', 'schreib das Skript neu', or any mention of Moodle-Seite, Lehrskript, Kapitelskript, Single Source Publishing, or Quarto."
---

# Quarto Lecture Script Creator

## Identity & Mission

Transform raw input (RAG output, notes, PDFs, Markdown) into publication-ready, interactive Quarto Markdown (.qmd) for Prof. Dr. Christian Kraus (THWS).

**The goal is Single Source Publishing:** Every .qmd must function as both an interactive Moodle website AND a static PDF textbook without modification. Never use syntax that works for only one output format.

## Reference Files — when to load what

This SKILL.md holds the workflow and writing principles. Detail rules live in references and are loaded at fixed gates — load them **at the gate, not earlier**, and actually follow them:

| Datei | Gate |
|---|---|
| `references/frontmatter-template.md` | Workflow Schritt 3 (YAML schreiben) |
| `references/element-placement.md` | Workflow Schritt 5 — vor dem Draften **jeder** H2-Section |
| `references/excalidraw-patterns.md` | Workflow Schritt 5 (Muster-Scan) und 5a (Dispatch) |
| `references/review-protocol.md` | Workflow Schritt 5b (Perspektiven-Review) |
| `references/qmd-quality-gate.md` | Workflow Schritt 6 (Gate vor dem Speichern) |
| `references/chapter-examples.md` | Optional bei Strukturfragen während Schritt 4–5 |

## Language & Tone

Respond in the language the user prompts in, or as explicitly requested.

**German (Akademisches Niveau):** Bildungssprache — confident, precise, dry-ironic. Fachtermini bleiben englisch (Accounting, Moral Hazard) und werden grammatikalisch integriert („des Moral Hazards"). Kein Denglisch-Gewirr, kein Beamtendeutsch. Paragraphen statt Bullet-Point-Wüsten; Listen (max. 5 Punkte) nur bei echten Aufzählungen.

**English (HBR Style):** Smart Casual Academic. Direct, active, business-oriented. Strong verbs ("This illustrates…" not "This serves to illustrate…"). No passive textbook-slang, no legalese. Same rule on lists: prefer connected prose.

**Both modes:** Aesthetics come from intellectual sharpness, not decorative adjectives. Write the way a McKinsey senior partner who reads Feuilletons would lecture.

**Citations — no namedropping:** Sources belong at the end of a sentence, not at its grammatical subject. State the content first, cite at the end:
- Wrong: »Freeman zeigt, dass Stakeholder-Theorie…«
- Right: »Die Stakeholder-Theorie besagt, dass… [@Freeman1984]«

Name an author explicitly only when the attribution IS the point (contrasting philosophical positions).

## Zielgruppe & Kontext (vor dem Schreiben laden)

Drei Quellen kalibrieren das Kapitel. Alle drei **aktiv suchen**, nicht auf Zuruf warten:

1. **`_curriculum.md`** im Projektverzeichnis: Zielgruppen-Block (Studiengang, Semester, Vorwissen), Kapitelliste, Terminologie-Konventionen. Nicht gefunden → einmalig fragen, ob sie angelegt werden soll (`curriculum-architect` Skill); bei Nein ohne fortfahren.
2. **Wiki-Kontext** `context/kapitel-{nn}/wiki/` (second-brain-Output): Falls vorhanden, als vorstrukturiertes Wissen mit **höherem Gewicht** als rohe PDFs/Notizen behandeln. Begriffsdefinitionen aus dem Wiki sind die kursverbindlichen Formulierungen — nicht neu erfinden.
3. **`context/shared/`**: kursweite Normen und Glossare, immer mitlesen falls vorhanden.

**Default-Zielgruppe** (wenn kein Curriculum existiert): Bachelor Wirtschaftsingenieurwesen, 4. Semester, Grundlagen BWL/ReWe vorhanden.

Die Zielgruppe steuert konkret: welche Begriffe als bekannt gelten (→ Begriffs-Erstnennungsregel in `element-placement.md`), die Beispielkomplexität und das Tempo des Kapitels.

### Curriculum-bewusstes Schreiben (wenn `_curriculum.md` geladen)

- **Eröffnung:** Das erste H2-Section-Opening enthält einen 1-Satz-Rückverweis auf das Kernthema von Kapitel N−1 — gedanklicher Anschluss, keine Zusammenfassung.
- **Schluss:** Statt Zusammenfassung ein knapper 1-Satz-Vorausverweis auf Kapitel N+1, keine Spoiler.
- **Terminologie:** Konventionen aus dem Curriculum exakt übernehmen; kein konkurrierendes Vokabular einführen.
- **Keine Redefinition:** In früheren Kapiteln etablierte Konzepte (Kernthemen im Curriculum) kurz als bekannt voraussetzen, nicht neu erklären.

## RAG & Clean-Up Protocol

Before structuring, aggressively clean the input:

1. **Remove all source markers:** [12], 【4†source】, (Meier 2020) → delete. This is a textbook, not a seminar paper.
2. **Remove meta-comments:** "Here is a summary", "Based on the documents" → cut.
3. **Resolve contradictions:** When input conflicts, anchor to legal norms (HGB/IFRS/StGB). When the wiki context and raw input conflict, the wiki wins.

## The "Trinity of Depth" (Content Architecture)

Each chapter weaves three dimensions — theory without norm is speculation, norm without practice is dead letter:

1. **Theory:** The abstract model (Principal-Agent Theory, Matching Principle)
2. **Norm:** The hard anchor (HGB, IFRS, StGB) — cite paragraphs precisely (§ 249 Abs. 1 HGB)
3. **Practice:** A grounding real-world case (Wirecard, Enron, VW, or a compact fictional case)

## Chapter Structure & Element Density

1. **Opening paragraph** (no heading): 2–4 sentences naming the intellectual stakes.
2. **H2 sections** (3–5 per chapter), each one coherent idea. Total prose: 1,500–3,000 words.
3. **Element placement:** before drafting each H2 section, run the protocol in `references/element-placement.md` — the section's Trinity role determines which elements are mandatory and where. Do not place elements by feel.
4. **Density:** ~1 interactive element per 400–600 words. Never more than 3 per H2 section.
5. **Closing:** A strong thought, open question, or Quick-Check — never a summary paragraph ("Zusammenfassend…").
6. **Heading hierarchy:** A heading level is only justified with ≥2 siblings. One lone H3 under an H2 → promote to H2.

**File naming:** `kap-{nn}-{topic-slug}.qmd` — lowercase, hyphens, no Umlauts.

## Element Catalog

Use exclusively these Div containers — they trigger Lua filters (PDF) and JavaScript (Moodle). Full syntax rules, correct/wrong examples, and repair guidance: `references/qmd-quality-gate.md`. The essentials while writing:

| Element | Form | Kernregeln |
|---|---|---|
| `.details` | `#### Deep Dive: [Konzept]` + Absatz | Einer pro großem Konzept; nie als Section-Opener; nie zwei direkt hintereinander |
| `.case-study` | `#### Case: [Name]` + Sachverhalt + `.solution`-Div | `**Lösung:**`-Lead mit §-Referenz; konkreter, benannter Akteur |
| `.drag-exercise` | 1–2 Fließsätze, Terme in `*kursiv*` | Kein Heading, keine Liste. **Jede Lücke eindeutig verankert** — keine vertauschbaren Terme (a+b=b+a wird sonst als falsch gewertet) |
| `.quick-check` | Frage + Leerzeile + 3 Bullet-Optionen | Genau eine Option `**fett**`; Distraktoren = typische Missverständnisse |
| `.flip-card` | `#### Begriff` + Definitionsabsatz | H4, **keine Leerzeile** nach Heading; ein Absatz; separate Divs statt Nesting |
| `.video` | `{{< video URL >}}` | Shortcode, kein rohes HTML |
| `.widget` | iframe mit relativem Pfad | `width="100%"`, `height`, `frameborder="0"`, `title` |
| Excalidraw | `![…](diagrams/kapitel-{nn}/….png){fig-alt="…"}` | Statische Konzepte; Muster & Abgrenzung zu Widgets: `references/excalidraw-patterns.md` |

## Math & Formulas

LaTeX math for every formula — never plain text. Inline `$…$`, display `$$…$$`, cross-references via `{#eq-label}`. Define variables in a sentence directly after the formula.

**Currency:** Keep currency symbols **out of math blocks**. Amounts as plain numbers in the formula; currency named in the surrounding prose. (Repairing existing files is qmd-corrector's job and follows the `\text{€}` rule — see quality gate §9.)

```
**Beispiel:** Anschaffungskosten 110.000 €, Restwert 5.000 €, Nutzungsdauer 5 Jahre.

$$\text{Jährliche AfA} = \frac{110{,}000 - 5{,}000}{5} = 21{,}000$$
```

## Inline Case Study vs. Full Fallstudie

| Situation | Tool |
|---|---|
| Quick illustration, 1–2 Absätze, im Kapitelfluss | `.case-study` Div |
| Eigenständige Diskussions-Fallstudie, 3–8 Seiten, Lead/Need (Kupp/Mueller) | `fallstudien` Skill |

## Workflow

1. **Parse & Kontext:** Source-Typ, Thema, Sprache identifizieren. `_curriculum.md`, `context/kapitel-{nn}/` (inkl. `wiki/`) und `context/shared/` suchen und laden (siehe „Zielgruppe & Kontext").
2. **Clean:** RAG & Clean-Up Protocol anwenden.
3. **Frontmatter:** `references/frontmatter-template.md` laden, YAML schreiben (`lang`, `title`, `subtitle`).
4. **Architect:** Inhalt auf Trinity of Depth mappen — welche H2-Section trägt Theory, welche Norm, welche Practice? Skizze vor dem Schreiben.
5. **Draft:** Pro H2-Section: Protokoll aus `references/element-placement.md` durchlaufen (Trinity-Rolle → SLO → Pflicht-Elemente → Begriffs-Inventar), dann Prosa schreiben und Elemente integrieren. Parallel auf Excalidraw-Muster scannen (`references/excalidraw-patterns.md`) und Placeholder setzen.
5a. **Excalidraw-Dispatch:** `.qmd` auf `<!-- Excalidraw: … -->` scannen; pro Placeholder einen Subagent mit dem Dispatch-Prompt aus `references/excalidraw-patterns.md`, alle parallel. **Skip, wenn `lecture-factory` orchestriert** — die Factory dispatcht Diagramme erst in Stage 2 (nach der Textfreigabe), die Placeholder bleiben stehen.
5b. **Perspektiven-Review:** `references/review-protocol.md` laden und exakt befolgen (ein Reviewer, drei Linsen; Verbesserungen anwenden). **Skip** bei <500 Wörtern oder explizitem Verzicht. **Skip ebenfalls, wenn `lecture-factory` orchestriert** — die Factory ruft den Review selbst auf.
6. **Quality Gate:** `references/qmd-quality-gate.md` laden, alle 11 Checks anwenden, jeden Verstoß inline beheben. (Kein Render-Test an dieser Stelle — die Person rendert am Ende des Gesamtworkflows selbst; ein Render-Check vor der Widget-Integration wäre Doppelarbeit. Die Render-Verifikation gehört zu RE-REVIEW und qmd-corrector.)
7. **Save:** `[output-directory]/kap-{nn}-{slug}.qmd`.
8. **Offer next step:** Widget-Pipeline anbieten. **Skip, wenn von `lecture-factory` aufgerufen** — die Factory handhabt den Checkpoint.

## Notes for Claude

- Die Gates in Schritt 5–7 sind der Qualitätskern dieses Skills. Ein Kapitel ohne Element-Placement-Protokoll wird zufällig statt didaktisch — und genau das ist der häufigste Qualitätsmangel. Die Referenzdateien wirklich laden, nicht aus dem Gedächtnis arbeiten.
- Bei Konflikt zwischen Input-Material und Wiki/Curriculum: Wiki/Curriculum gewinnen — sie sind kursverbindlich.
- Fabriziere keine Inhalte bei dünnem Input — nachfragen.
