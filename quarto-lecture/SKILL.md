---
name: quarto-lecture
description: "Create hybrid Quarto Markdown (.qmd) lecture scripts for Single Source Publishing (interactive Moodle websites + static PDF textbooks). Use when the user requests: (1) creation of .qmd or Quarto files, (2) transformation of raw data (RAG output, PDFs, notes) into lecture materials, (3) academic content in German or English with interactive elements (flip-cards, case studies, quizzes, fill-in-the-blank exercises). Also trigger for German requests like 'Schreib mir das Kapitel über X', 'Transformiere meine Notizen in ein Kapitel', 'Erstelle ein Lehrskript zu Y', 'mach mir ein QMD', 'schreib das Skript neu', or any mention of Moodle-Seite, Lehrskript, Kapitelskript, Single Source Publishing, or Quarto."
---

# Quarto Lecture Script Creator

## Identity & Mission

Transform raw input (RAG output, notes, PDFs, Markdown) into publication-ready, interactive Quarto Markdown (.qmd) for Prof. Dr. Christian Kraus (THWS).

**The goal is Single Source Publishing:** Every .qmd must function as both an interactive Moodle website AND a static PDF textbook without modification. Never use syntax that works for only one output format.

## Language & Tone

Respond in the language the user prompts in, or as explicitly requested (e.g., "Create this chapter in English").

**German (Akademisches Niveau):** Bildungssprache — confident, precise, dry-ironic. Fachtermini bleiben englisch (Accounting, Moral Hazard) und werden grammatikalisch integriert ("des Moral Hazards"). Kein Denglisch-Gewirr, kein Beamtendeutsch. Paragraphen statt Bullet-Point-Wüsten; Listen (max. 5 Punkte) nur bei echten Aufzählungen.

**English (HBR Style):** Smart Casual Academic. Direct, active, business-oriented. Strong verbs ("This illustrates..." not "This serves to illustrate..."). No passive textbook-slang, no legalese. Same rule on lists: prefer connected prose.

**Both modes:** Aesthetics come from intellectual sharpness, not decorative adjectives. Write the way a McKinsey senior partner who reads Feuilletons would lecture.

**Citations — no namedropping:** Sources belong at the end of a sentence, not at its grammatical subject. State the content first, cite at the end:
- Wrong: »Freeman zeigt, dass Stakeholder-Theorie...« / »Schwerk hat argumentiert, dass CG und CSR...[@Schwerk]«
- Right: »Die Stakeholder-Theorie besagt, dass... [@Freeman1984]« / »CG und CSR sind keine getrennten Bereiche [@Schwerk]«

Author names as the subject of the main clause are almost always superfluous — the content is what matters, not who wrote it. Name an author explicitly only when the attribution IS the point: contrasting philosophical positions where Position A vs. Position B is the structure of the argument.

## RAG & Clean-Up Protocol

Before structuring, aggressively clean the input:

1. **Remove all source markers:** [12], 【4†source】, (Meier 2020) → delete. This is a textbook, not a seminar paper.
2. **Remove meta-comments:** "Here is a summary", "Based on the documents" → cut. Start the content directly.
3. **Resolve contradictions:** When input conflicts, anchor to legal norms (HGB/IFRS/StGB).

## The "Trinity of Depth" (Content Architecture)

Each chapter weaves three dimensions — theory without norm is speculation, norm without practice is dead letter:

1. **Theory:** The abstract model (e.g., Principal-Agent Theory, Matching Principle)
2. **Norm:** The hard anchor (HGB, IFRS, StGB) — cite paragraphs precisely (§ 249 Abs. 1 HGB)
3. **Practice:** A grounding real-world case (Wirecard, Enron, VW, or a compact fictional case)

## YAML Frontmatter

Always begin the .qmd with complete frontmatter. Load `references/frontmatter-template.md` for the canonical template and field documentation. The minimum required structure is:

```yaml
---
title: "..."
subtitle: "..."
date: last-modified
lang: de          # or 'en'
toc-depth: 1
author:
  - name: Prof. Dr. Christian Kraus
    email: christian.kraus@thws.de
    role: Program Lead
    affiliation: THWS Business & Engineering
format:
  moodle-html
---
```

**File naming convention:** `kap-{nn}-{topic-slug}.qmd` — e.g., `kap-03-rueckstellungen.qmd`, `kap-07-ifrs-goodwill.qmd`. Lowercase, hyphens, no Umlauts in filenames.

## Chapter Structure & Element Density

A well-structured chapter follows this rhythm — not a rigid template, but a reliable architecture:

1. **Opening paragraph** (no heading): 2–4 sentences that name the intellectual stakes. Why does this topic matter?
2. **H2 sections** (3–5 per chapter): Each covers one coherent idea. Total prose length: 1,500–3,000 words.
3. **Element placement per section:** before drafting each H2 section, run the **Element Placement Protocol** (see below) — the section's Trinity role determines which elements are mandatory and where. Do not place elements by feel.
4. **Element density:** ~1 interactive element per 400–600 words of prose. Never more than 3 interactive elements per H2 section.
5. **Closing:** A strong thought, open question, or Quick-Check. Never a summary paragraph ("In summary...", "Zusammenfassend lässt sich sagen...").
6. **Heading hierarchy discipline:** If an H2 section contains only a single H3 subsection, the H3 level is unnecessary — promote the content to H2 and eliminate the empty nesting. The same applies at every level: a heading level is only justified when there are at least two siblings. This keeps the table of contents clean and prevents artificial hierarchy.

For a concrete example of this structure in action, load `references/chapter-example.md`.

## Syntax & Interactions

Use exclusively these Div containers. They trigger Lua filters for PDF rendering and JavaScript for Moodle interactivity.

### A. Deep Dives

For technical concepts, legal text, or supplementary depth that would disrupt reading flow. Use `.callout-note` with a descriptive title:

```markdown
::: {.callout-note title="Deep Dive: [Concept Name]"}
Explanation...
:::
```

**Title convention:** German — `"Deep Dive: Marktversagen"` / `"Deep Dive: § 249 HGB"`. English — `"Deep Dive: Market Failure"`. The title should name the concept, not describe what the box does.

**Density rule:** One deep dive per major concept — not for every technical term. If a term can be explained in one sentence in the flow, do that instead. Deep dives are for content that would take a paragraph and break the argument.

**Legacy format:** Older chapters may use `::: {.details}` with `#### Exkurs: ...` heading — that's the Lua-filter variant for the BUA accounting course. Use `.callout-note` for all new chapters.

### B. Inline Case Studies

For mini-cases embedded in the chapter (1–2 paragraphs, quick illustration). For a full standalone teaching case following Kupp/Mueller methodology, use the `fallstudien` skill — see "Inline Case Study vs. Full Fallstudie" below.

```markdown
::: {.case-study}
#### Case: Müller GmbH
Mr. Müller forgot to create the provision.

::: {.solution}
**Solution:** According to § 249 HGB, he must capitalize it.
:::
:::
```

### C. Fill-in-the-Blank (Active Recall)

One or two sentences where the key terms students must supply are marked in *italics*. The Lua filter converts each italicized word/phrase into a draggable blank. Good for reinforcing core definitions, formula components, and key vocabulary.

**Rules for drag-exercise:**
- **No heading inside the div** — the div needs no `####`, just the sentence(s)
- **1–2 sentences max** — this is a focused recall prompt, not a paragraph
- **Italics = fillable term** — use `*term*` for every word/phrase the student drags in
- **No bullet lists** — must be flowing sentence form

```markdown
::: {.drag-exercise}
The balance sheet is a *point-in-time statement*, the P&L is a *period statement*.
:::
```

**Wrong — do not do this:**
```markdown
::: {.drag-exercise}
#### Fill in the blanks          ← NO heading inside
- The balance sheet shows *assets*
- The P&L shows *revenues*       ← NO list format
:::
```

### D. Quick-Check (Quiz)

List with checkbox logic. Mark the correct answer in bold.

```markdown
::: {.quick-check}
Which principle dominates in HGB?
- Fair Value
- **Vorsichtsprinzip (Prudence Principle)**
- Matching Principle
:::
```

### E. Flip-Cards (Definitions)

For core concepts. H4 title = front of card; body = back of card.

**Critical rules for flip-card:**
- Use **H4 (`####`) for the term** — not H3, not H2, not bold text
- **No blank line between `####` heading and the body text** — the Lua filter depends on the heading being immediately followed by the definition text
- Body should be **one concise paragraph** — a definition, not a multi-section explanation
- Multiple flip-cards for related concepts: write them as **separate adjacent divs**, not nested

```markdown
::: {.flip-card}
#### Rückstellung (Provision)
A liability that is uncertain in terms of its basis or amount.
:::
```

**Wrong — do not do this:**
```markdown
::: {.flip-card}
#### Rückstellung (Provision)
                                 ← NO blank line here — breaks the filter
A liability that is uncertain in terms of its basis or amount.
:::

::: {.flip-card}
### Vorsichtsprinzip             ← NO — must be H4 (####), not H3
Content here.
:::
```

### F. Videos

Wrap video shortcodes so they render as a contained box in the PDF.

```markdown
::: {.video}
{{< video https://youtu.be/ID >}}
:::
```

### G. HTML Widgets (Interactive Visualizations)

For widgets created with the `html-builder` skill. Store widget files in a `widgets/` subfolder alongside the .qmd file. The `.widget` container renders as an embedded box in both HTML and PDF.

For the canonical iframe syntax and attribute rules, load `references/iframe-template.md` (shared with `widget-pipeline`). Minimal example:

```markdown
::: {.widget}
<iframe src="widgets/kapitel-{nn}/widget-{name}.html"
        width="100%" height="420px"
        frameborder="0" style="border:none;"
        title="Interaktive Visualisierung">
</iframe>
:::
```

### H. Excalidraw-Diagramme (Statische Visualisierungen)

Für **statische, konzeptuelle Diagramme** — Strukturen, Kausalbeziehungen, Vergleiche, einfache Abläufe ohne Interaktivitätsbedarf. Diagramme werden als PNG neben der .qmd-Datei gespeichert.

```markdown
![Bilanzstruktur: Aktiva und Passiva](diagrams/kapitel-{nn}/diagram-name.png){fig-alt="Beschreibung für Barrierefreiheit" width="80%"}
```

**Verzeichniskonvention:** `diagrams/kapitel-{nn}/` relativ zur .qmd-Datei. Gleiche Kapitel-Ableitung wie bei Widgets (`kap-03-...qmd` → `kapitel-03`).

#### Wann Excalidraw, wann Widget?

| Situation | Tool |
|---|---|
| Statische Struktur, einmaliger Aha-Moment | Excalidraw-Diagramm |
| Interaktive Exploration, Parametervariationen | Widget (html-builder) |
| Schrittweiser Prozess ohne Berechnungen | Excalidraw (Template A/B) |
| Schrittweiser Prozess mit Live-Berechnung | Widget |
| Vergleich zweier Konzepte | Excalidraw (Template D) |
| Bilanzen / Soll-Haben-Gegenüberstellung | Excalidraw (Template C) |

#### Erkennungsmuster (während des Drafts)

Beim Schreiben jedes Abschnitts auf folgende Muster scannen:

| Textmuster | Diagramm-Typ | Excalidraw-Template |
|---|---|---|
| "X besteht aus A, B und C" | Hub-and-Spoke / Komposition | F (Hub and spoke) |
| "X führt zu Y, was wiederum zu Z führt" | Kausalkette | A oder B (Flow) |
| "Im Gegensatz zu X ist Y..." / Vergleichstabelle | Gegenüberstellung | D (2-column) |
| "Aktiva / Passiva", "Soll / Haben", zwei Seiten | Bilanztrennung | C (Split zone) |
| "Der übergeordnete Begriff umfasst..." | Hierarchie / Taxonomie | Baumstruktur |
| Chronologische Abfolge ohne Interaktivität | Zeitstrahl | E (Vertical timeline) |

**Nicht als Excalidraw-Diagramm:** Alles was Slider, Live-Berechnung oder Nutzerinteraktion braucht → Widget.

#### Placeholder-Kommentare während des Drafts

Wenn beim Schreiben eine Diagramm-Opportunity erkannt wird, Placeholder einfügen und weiter schreiben:

```markdown
<!-- Excalidraw: [Konzeptbeschreibung] | Typ: [Template A-F / Custom] | Ziel: [Was soll der Studierende sehen?] -->
```

Beispiel:
```markdown
<!-- Excalidraw: Zusammenhang Aktiva/Passiva in der Bilanz | Typ: C (Split zone) | Ziel: Studierende sollen die Gleichgewichtsbedingung visuell erfassen -->
```

Nach dem Speichern des Drafts werden alle Placeholders durch Subagent-Dispatch aufgelöst (siehe Workflow Schritt 5a).

---

## Element Placement Protocol

Run this protocol **before drafting each H2 section** — not after. Element placement is a planning decision, not an editorial afterthought.

### Step 1 — Identify the section's Trinity role

Every H2 section carries one dominant dimension:

| Role | Charakteristik |
|---|---|
| **Theory** | Abstraktes Modell, Definition, Framework, Konzept |
| **Norm** | Rechtlicher Anker: § HGB, IAS, IFRS, AktG |
| **Practice** | Anwendungsfall, Konsequenz, Entscheidung, Berechnung |

A section may blend two roles, but one dominates. Name it before writing.

### Step 2 — Formulate the Section Learning Objective (SLO)

Complete: *„Nach diesem Abschnitt können Studierende ___."*

Do **not** write this sentence into the text — it drives element choices only.

Examples:
- Theory SLO: „…den Unterschied zwischen Rückstellung und Verbindlichkeit erklären."
- Norm SLO: „…§ 249 Abs. 1 HGB korrekt auf einen Sachverhalt anwenden."
- Practice SLO: „…beurteilen, ob im vorliegenden Fall ein Ansatzverstoß vorliegt."

### Step 3 — Mandatory elements by role

#### Theory section

| Element | Regel |
|---|---|
| Flip-card | Eine pro neuem Kernkonzept (max. 3 pro Section) |
| Drag-exercise | Nach der ersten Definition oder Formel der Section |
| Deep Dive | **Mandatory** wenn ein Konzept wichtige Nuancen oder Ausnahmen hat, die den Lesefluss unterbrechen würden |
| Quick-check | **Mandatory** am Sektionsende — testet das SLO: „Was bedeutet X?" |

#### Norm section

| Element | Regel |
|---|---|
| Deep Dive | **Mandatory** für jeden § oder IAS/IFRS-Absatz, der im Kapitel **zum ersten Mal** zitiert wird — unmittelbar nach dem Zitationssatz platzieren |
| Drag-exercise | Einen Schlüsselbegriff oder eine Schlüsselphrase aus dem Normtext |
| Quick-check | **Mandatory** am Sektionsende — „Welche Norm gilt wenn …?" |

#### Practice section

| Element | Regel |
|---|---|
| Case Study | **Mandatory** — die Case Study wendet die Norm aus der vorangehenden Norm-Section an oder verletzt sie. Das `.solution`-Div **muss** den spezifischen § referenzieren, der zuvor etabliert wurde. Bei Accounting-Kapiteln: die Case Study enthält eine Berechnung, einen Buchungssatz oder ein Entscheidungsergebnis. |
| Quick-check | **Mandatory** am Sektionsende — Transferfrage: „Was wäre wenn …?" oder „Welcher Buchungssatz folgt?" |

#### Mixed section (zwei Rollen)

Mandatory-Elemente beider Rollen anwenden. Wenn die Summe 3 Elemente überschreiten würde: Norm-Regeln > Practice-Regeln > Theory-Regeln.

---

### Quick-Check Writing Rules (alle Rollen)

1. **Formuliere die Frage vor dem Schreiben der Prosa** — sie ist das Exit-Kriterium der Section, kein Nachgedanke
2. Die Frage testet direkt das SLO aus Step 2
3. Genau 3 Antwortoptionen: 1 korrekte + 2 Distraktoren, die **typische Studierenden-Missverständnisse** abbilden — keine zufälligen Falschantworten

**Guter Distraktor (missconception-basiert):** Statt „§ 249 HGB" wird „§ 252 Abs. 1 Nr. 4 HGB" angeboten — Studierende verwechseln häufig Rückstellungsnorm und Vorsichtsprinzip.

**Schlechter Distraktor (zufällig):** „§ 89 HGB" — kein Student käme darauf, kein Lernwert.

---

### Deep Dive Trigger Rules

**Mandatory:**
- Ein § oder IAS/IFRS-Absatz wird im Kapitel **zum ersten Mal** zitiert (Accounting)
- Ein Fachbegriff, der *nicht im allgemeinen Sprachgebrauch* ist, wird eingeführt und braucht mehr als einen Satz Erklärung (alle Disziplinen)
- Ein theoretisches Konzept hat wichtige Nuancen, Ausnahmen oder Unterarten, die den Lesefluss des Haupttextes unterbrechen würden

**Optional:**
- Historischer Kontext oder Herleitung, die das Verständnis schärft
- Grenzfall, der nur fortgeschrittene Studierende betrifft
- Vergleich zweier verwandter Konzepte, die Studierende häufig verwechseln

**Nie:**
- Als erstes Element einer Section — der Prosa-Kontext muss zuerst kommen
- Zwei Deep Dives hintereinander ohne mindestens 100 Wörter Prosa dazwischen
- Für Begriffe, die in einem Satz im Fließtext erklärt werden können

---

### Case Study Writing Rules

- **Minimum 1 pro Kapitel**, positioniert in der Practice-Section
- Beantwortet: „Was passiert, wenn die Norm angewendet — oder verletzt — wird?"
- Verwendet einen **konkreten Akteur**: benanntes Unternehmen, fiktive aber benannte GmbH, namentliche Entscheidungsperson
- Struktur: Sachverhalt → Komplikation → Lösung (`.solution`-Div mit §-Referenz)
- Länge: 2–4 Absätze
- **Keine generischen Fälle** („Ein Unternehmen hat eine Verbindlichkeit…") — jede Case Study braucht einen Namen und eine konkrete Konsequenz

---

## Math & Formulas

Quarto supports LaTeX math. Use it for any accounting formula, financial ratio, or mathematical relationship — do not express formulas as plain text.

- **Inline:** `$ROE = \frac{\text{Jahresüberschuss}}{\text{Eigenkapital}}$`
- **Display block:**

```
$$
\text{Working Capital} = \text{Umlaufvermögen} - \text{kurzfristige Verbindlichkeiten}
$$
```

- **Cross-referenced equation:** append `{#eq-label}` after the closing `$$` for `@eq-label` references elsewhere in the chapter.
- Always define variables in a sentence immediately following the formula.
- **Never place currency symbols (€, $, £) inside `$$` math blocks.** LaTeX/MathJax does not render `€` correctly in math mode and produces a math input error. Write the result as a plain number inside the formula; state the currency in the surrounding prose or in a `\text{}` suffix — but even `\text{€}` is unreliable across renderers. Preferred pattern:

```
<!-- ✓ CORRECT: currency in surrounding text, not in formula -->
**Example:** Cost €110,000, residual value €5,000, useful life 5 years.

$$\text{Annual Depreciation} = \frac{110{,}000 - 5{,}000}{5} = 21{,}000 \text{ per year}$$

<!-- ✗ WRONG: € inside $$ block causes math input error -->
$$\text{Annual Depreciation} = \frac{110{,}000 - 5{,}000}{5} = €21{,}000 \text{ per year}$$
```

## Inline Case Study vs. Full Fallstudie

Two distinct instruments — choose based on scope:

| Situation | Tool |
|---|---|
| Quick illustration, 1–2 paragraphs, embedded in chapter flow | `.case-study` Div (§B above) |
| Full classroom discussion case, narrative arc, 3–8 pages, Lead/Need structure (Kupp/Mueller) | `fallstudien` Skill |

When the user asks for a "Fallstudie" or "teaching case" as a standalone document, switch to the `fallstudien` skill. When a brief grounding example fits inside a chapter, use the `.case-study` Div.

## Layout Rules

1. **Headings:** H1 for the chapter title, H2 for sections, H3 for sub-sections. No manual numbering — Quarto handles this automatically.
2. **Quotes:** Use blockquotes (`>`) for key takeaways and memorable citations.
3. **Tables:** Standard Markdown tables. Keep simple — 4–6 columns max. Use for comparisons (HGB vs. IFRS), not for data dumps.
4. **No conclusion paragraph:** Do not close with "In summary..." or "Zusammenfassend...". End with a strong thought or a Quick-Check.

## Workflow

1. **Parse input:** Identify source type (RAG, PDF, notes), topic domain, and target language.
2. **Clean:** Apply RAG & Clean-Up Protocol — strip source markers, meta-text, contradictory noise.
3. **Open with frontmatter:** Start the .qmd with correct YAML (see `references/frontmatter-template.md`). Set `lang`, `title`, `subtitle`.
4. **Architect:** Map content to Trinity of Depth. Sketch the H2 sections before writing — which section carries Theory, which Norm, which Practice?
5. **Draft:** Before writing each H2 section: run the **Element Placement Protocol** (Step 1–3 above) — identify Trinity role, formulate SLO, determine mandatory elements. Then write the prose and integrate elements accordingly. Load `references/chapter-example.md` as a structural reference if needed.
5a. **Excalidraw-Dispatch:** After completing the draft, scan the .qmd for `<!-- Excalidraw: ... -->` placeholder comments. For each placeholder, spawn a subagent with the following prompt template — all subagents run in parallel:

```
Erstelle ein Excalidraw-Diagramm für ein Hochschullehrkapitel und binde es ein.

Konzept: [aus Placeholder]
Visueller Typ: [aus Placeholder]
Didaktisches Ziel: [aus Placeholder]
Einfügestelle: Ersetze den Kommentar <!-- Excalidraw: ... --> an seiner Position im QMD.
QMD-Pfad: [vollständiger Dateipfad]
Ausgabe-Verzeichnis: [qmd-verzeichnis]/diagrams/kapitel-{nn}/
Dateiname: diagram-[slug].excalidraw

Vorgehensweise:
1. Lies den excalidraw-diagram Skill (SKILL.md).
2. Erstelle die .excalidraw-Datei im Ausgabe-Verzeichnis.
3. Prüfe ob der Canvas-Server läuft: curl -s http://localhost:3000/health
   - Wenn ja: rendere zu PNG via render_excalidraw.py, speichere PNG.
   - Wenn nein: speichere nur .excalidraw, füge Placeholder-PNG-Pfad ins QMD ein.
4. Ersetze den <!-- Excalidraw: ... -->-Kommentar im QMD mit:
   ![Kurzbeschreibung](diagrams/kapitel-{nn}/diagram-[slug].png){fig-alt="[Barrierefreie Beschreibung]" width="80%"}
5. Melde: Dateiname, PNG-Status (gerendert/ausstehend), Einfügestelle.
```

Nach Rückkehr aller Subagents: prüfe ob alle Placeholders ersetzt wurden. Wenn ein Subagent nur .excalidraw ohne PNG geliefert hat, vermerke es im Abschlussbericht.

5b. **Perspektiven-Review:** After completing the draft (and after Excalidraw-Dispatch), dispatch three subagents **simultaneously** — one per stakeholder perspective. All three run in parallel; wait for all before synthesizing.

---

**Subagent A — Kritischer Professor**

```
Du reviewst ein Quarto-Vorlesungskapitel aus der Perspektive eines kritischen Hochschulprofessors
(Fachgebiet: [Thema des Kapitels, aus dem Frontmatter]).

Prüfe ausschließlich diese vier Dimensionen:
1. Inhaltliche Korrektheit — Sind alle Aussagen fachlich präzise? Gibt es Vereinfachungen, die ins Falsche kippen?
2. Normgenauigkeit — Werden §§ / IAS / IFRS mit der richtigen Granularität zitiert? Fehlen relevante Normen?
3. Trinity-Vollständigkeit — Sind alle drei Dimensionen (Theorie / Norm / Praxis) wirklich abgedeckt oder nur angedeutet?
4. Intellektuelle Tiefe — Gibt es Stellen, die für Hochschulniveau zu oberflächlich sind?

QMD-Inhalt: [vollständiger Kapiteltext]

Ausgabe: Maximal 5 nummerierte Kritikpunkte.
Format je Punkt: Abschnitt → Problem → konkreter Verbesserungsvorschlag.
Keine Lobhudeleien. Nur tatsächlich verbesserungswürdige Befunde.
```

---

**Subagent B — Sehr guter Student**

```
Du reviewst ein Vorlesungskapitel aus der Perspektive eines sehr guten Studierenden
(4. Semester, solides Vorwissen, möchte tief verstehen und auf neue Fälle transferieren).

Prüfe:
1. Logischer Aufbau — Bauen die Sektionen aufeinander auf? Gibt es Sprünge, die verwirren?
2. Beispiel-Qualität — Sind Case Studies und Flip-Cards wirklich erhellend, oder könnten sie durch stärkere Beispiele ersetzt werden?
3. Lernzielkontrollen — Testen die Quick-Checks tatsächlich das Gelehrte — oder wirken sie zufällig platziert?
4. Transferpotenzial — Kann ich nach diesem Kapitel einen unbekannten Fall selbst einordnen?

QMD-Inhalt: [vollständiger Kapiteltext]

Ausgabe: Maximal 4 Verbesserungsvorschläge.
Format: "In [Abschnitt] hätte ich mir gewünscht, dass ... — weil ..."
```

---

**Subagent C — Mittelmäßiger Student**

```
Du reviewst ein Vorlesungskapitel aus der Perspektive eines durchschnittlichen Studierenden
(4. Semester, Grundkenntnisse vorhanden, kämpft manchmal mit Fachbegriffen und Tempo).

Prüfe:
1. Einstiegshürden — Gibt es Stellen, an denen du aufgehört hättest weiterzulesen? Warum?
2. Unerklärete Begriffe — Werden Fachbegriffe verwendet, bevor sie erklärt wurden?
3. Ankerpunkte — Gibt es genug Flip-Cards und Drag-Exercises, um Kernbegriffe zu sichern? Oder zu viele auf einmal?
4. Praxisbezug — Ist die Case Study verständlich ohne spezifisches Vorwissen über das zitierte Unternehmen / den genannten Fall?

QMD-Inhalt: [vollständiger Kapiteltext]

Ausgabe: Maximal 4 konkrete Stellen.
Format: "An dieser Stelle [kurzes Zitat oder Beschreibung] wäre ich verloren, weil ... — Lösung: ..."
```

---

**Synthese nach Rückkehr aller drei Subagents:**

1. **Konfliktanalyse:** Wo widersprechen sich die Perspektiven?
   → Auflösungsregel: Was der Professor als "zu flach" kritisiert und der schwächere Student als "zu dicht" empfindet, gehört in ein `.details`-Div — Haupttext für den Durchschnittsstudenten, Tiefe für den Starken.

2. **Priorisierung der Verbesserungen:**
   - Stufe 1 (sofort korrigieren): Faktenfehler, falsche oder fehlende Normen
   - Stufe 2 (anpassen): Strukturprobleme, fehlende Ankerpunkte, zufällig wirkende Quick-Checks
   - Stufe 3 (optional): Anreicherungen, stärkere Beispiele, Tiefe-Exkurse

3. **Max. 5 Verbesserungen anwenden.** Für jede Änderung notieren: Abschnitt + was geändert wurde + aus welcher Perspektive der Impuls kam.

4. **Kompakter Report an den Nutzer** nach Abschluss:
   > **Perspektiven-Review abgeschlossen.** 3 Sichtweisen · [N] Kritikpunkte · [N] Verbesserungen angewandt.
   > Zusammenfassung: [2–3 Sätze zu den wichtigsten Änderungen]
   > Offene Punkte (nicht adressiert): [falls vorhanden — mit Begründung warum nicht]

**Skip step 5b** wenn das Kapitel <500 Wörter hat oder wenn der Nutzer explizit darauf verzichtet. Wird dieser Schritt von `lecture-factory` aufgerufen, läuft der Review ebenfalls — das Ergebnis fließt in den Checkpoint-Output der Factory ein.

6. **Quality Gate:** Before saving, load `references/qmd-quality-gate.md` and apply all checks. Fix every flip-card and drag-exercise violation inline before proceeding.
7. **Save:** Write file to `outputs/kap-{nn}-{slug}.qmd`. Use the file naming convention.
8. **Offer next step:** After saving, offer the widget pipeline — *"Das Kapitel ist gespeichert. Soll ich jetzt die Widget-Pipeline starten und interaktive Visualisierungen automatisch identifizieren und einbauen?"* (or in English: *"Chapter saved. Would you like me to run the widget pipeline?"*)

   **Skip step 8 if called from `lecture-factory`** — the factory handles the checkpoint itself.
