---
name: curriculum-architect
description: "Creates and maintains _curriculum.md, the backbone of a Quarto lecture course (usually a Quarto book), and, if the course has a running case company, its fact sheet _running_case.md. INIT: reads briefing, Modulhandbuch, old edition and wiki, proposes a critical topic selection (keep/drop/add with reasons), interviews the author (teaching format, cohort and actual prior courses, running case) and writes course-wide numbered learning objectives per chapter. UPDATE: add chapter, update status, revise learning objectives, enter FACT SHEET ADDITIONS. Triggers: 'Erstelle ein Curriculum', 'leg ein Curriculum an', 'aktualisiere das Curriculum', 'füge ein Kapitel ins Curriculum ein', 'markiere Kapitel X als fertig', 'neuer Kurs aufsetzen', 'Kurs neu aufbauen', 'Fallunternehmen anlegen', 'running case', or any new Quarto lecture project without _curriculum.md. Also called by lecture-factory (Pre-Flight, SERIE)."
---

# Curriculum Architect

A focused skill for creating and maintaining `_curriculum.md` — the single source of truth for a course's chapter structure, learning objectives, teaching format, cohort, terminology and status — and the optional `_running_case.md` fact sheet.

## Why These Files Matter

`_curriculum.md` actively drives the content skills:

- **lecture-factory** reads it for chapter transitions, the series plan (SERIE mode) and the materials per chapter.
- **quarto-lecture** takes the chapter's learning-objective callout, the cohort block and the terminology from it; **tutorial-builder** tags tasks with its LO numbers; **teaching-note** and **moodle-questions** reference the same numbers.
- `_running_case.md` is the only source for the running company's numbers, dates, people and terms. Without it, parallel chapters drift: the same decision taken twice, a market risk premium of 5 % in one chapter and 6 % in another, three spellings of one symbol.

A missing or stale curriculum produces disconnected chapters; a missing fact sheet produces a running case that contradicts itself.

**Templates (use exactly, do not invent another structure):**

| File | Template |
|---|---|
| `_curriculum.md` | `references/curriculum-template.md` |
| `_running_case.md` | `references/running-case-template.md` |

---

## Mode Detection

**INIT mode** — no `_curriculum.md` in the project, or: "neues Curriculum", "Curriculum anlegen", "Kurs aufsetzen", "Kurs neu aufbauen", or lecture-factory's Pre-Flight / SERIE mode asks for one.

**UPDATE mode** — an existing `_curriculum.md` should change: chapter registered or status changed (📋 → 🔄 → ✅), "Kapitel hinzufügen", "Lernziele anpassen", "Kernthemen ergänzen", "neuer Teil", or FACT SHEET ADDITIONS to enter into `_running_case.md`.

If a `_curriculum.md` exists but the request sounds like INIT, ask first: "Es gibt bereits eine `_curriculum.md` — soll ich die bestehende aktualisieren oder eine neue anlegen?" (A rebuild of an existing course is INIT on top of the old file: read it as the old edition.)

---

## Pre-Flight: Read Before Asking

Silently gather what is available; report the findings in one or two sentences.

1. **Existing curriculum / fact sheet:** `_curriculum.md`, `_running_case.md`. In UPDATE mode the primary input.
2. **Briefing and Modulhandbuch:** `raw/briefing.md`, `raw/brief.md`, any `raw/*.md` that looks like a brief, the module description if present.
3. **Wiki:** `wiki/index.md`. If found, derive chapter themes from it and record its path for the `**Wiki:**` metaline. No wiki → `**Wiki:** none`.
4. **Existing chapters:** `_quarto.yml` (book? chapter list, parts), `NN_*.qmd` in the project root (title from the `# H1`, book chapters have no YAML), legacy `kap-*.qmd` (title from YAML), `archive/`, old tutorials and cases. A file that exists is at least 🔄 aktiv.
5. **Conventions:** `CLAUDE.md`, `context/shared/` (glossary, terminology).

---

## INIT Mode: Structured Interview

Ask in blocks. Present what Pre-Flight derived for confirmation instead of asking from scratch; only ask for gaps. When lecture-factory SERIE mode calls this skill, all blocks may be presented as **one plan for one approval**.

### Block 1 — Kursdaten & Lehrformat

> Ich brauche einige Grunddaten. Kurze Antworten reichen:
>
> 1. Kurs-Titel (wie im Modulhandbuch)? ECTS, Prüfungsform?
> 2. Sprache (de / en)? Ist eine Übersetzung geplant (Zielrepo)?
> 3. Lehrformat: Aufteilung Selbststudium/Präsenz (z. B. 2 SWS Selbststudium mit dem Lehrbuch + 2 SWS Präsenz-Tutorium), Zahl der Sitzungen, Minuten Selbststudium je Kapitel?
> 4. Semester oder Zeitrahmen (oder „—")?
> 5. Liegt ein thws-wiki vor? Absoluter Pfad — oder „keins".

Wiki path given: (a) `ln -sfn <pfad> wiki` in the project, (b) add `wiki` to `.gitignore`, (c) write **`**Wiki:** ./wiki`** (relative) in the header. "keins" → `**Wiki:** none`. Only the symlink is machine-local; lecture-factory never asks again.

### Block 2 — Kohorte & Vorwissen

Ask explicitly which courses the cohort **actually took** — never infer it from the programme name:

> Welche Vorkurse hat die Kohorte tatsächlich belegt, und welche Normen/Themen kennt sie daraus (z. B. IAS 16, 2, 36)? Ist die Kohorte heterogen (z. B. ein Teil kennt die Grundlagen schon)?

For international or English-taught cohorts, never assume the German bachelor courses (e.g. BUA3): ask. If part of the cohort already knows a topic, propose a **Grundlagen-/Vertiefungsblock** for those chapters (short "Grundlagen (Wiederholung)" section with an Eingangs-Check of 3 questions and a skip link to the Vertiefung; Vertiefung and tutorial are the same for everyone). Record the answer with its date in *Kohorte & Vorwissen*.

### Block 3 — Themenauswahl (kritisch, vor dem Schreiben)

Compare Modulhandbuch, old edition and cohort knowledge, then propose — do not just copy the old chapter list:

> | Thema | Vorschlag | Begründung |
> |---|---|---|
> | [z. B. Abschlussanalyse] | streichen | wird in BUA1 Kap. 10 behandelt |
> | [z. B. IFRS 15] | neu | Nachfolger der Fertigungsaufträge, klausurrelevant |
> | [z. B. Kap. 1 + 2] | zusammenlegen? | Überschneidung mit dem Vorkurs |
>
> Welche Vorschläge übernehmen Sie?

Proposals are options, not decisions: never merge, split or drop chapters without the author's explicit yes (a refused merge stays refused). Record the decisions in *Themenauswahl*.

### Block 4 — Kapitelstruktur & Material

Present the chapter list derived from Block 3. For each chapter:
- `Nr` — 2-digit (`01` … `12`); optional parts (Teil I …).
- `Titel` — short, in the course language.
- `Datei` — `NN_slug.qmd`, slug English, lowercase, underscores (`04_leases.qmd`), so a translation maps 1:1. Tutorials `tutorials/tut_NN_slug.qmd`, teaching notes `_teaching_notes/NN_slug_teaching_note.qmd`. In an existing project with another naming scheme, keep it unless the author decides to rename.
- `Kernthemen` — 3–6 terms; for chapters with a Grundlagenblock: `**Grundlagen:** … · **Vertiefung:** …`.
- **Material** — chapter, tutorial, Kurzfall (new or shortened from an old case), teaching note, widgets (existing/new), optional slides and Moodle; plus **self-study minutes** (from Block 1).

### Block 5 — Lernziele je Kapitel

> Soll ich die Lernziele je Kapitel aus den Kernthemen ableiten, oder formulieren Sie sie selbst?

Rules:
- **Per chapter**, 3–6 objectives, **numbered course-wide and consecutively** (1 … N) — never restarting per chapter, never a second scheme (no "LO c.k"). Tutorials, Moodle and teaching notes use these numbers.
- In the course language, one lead sentence ("Nach dieser Einheit können die Studierenden:" / "After this unit, students will be able to:") followed by verb phrases.
- Bloom verbs, measurable; every chapter has at least one objective at the level analysieren/beurteilen (evaluate/judge); Master courses lean higher (beurteilen, entwerfen).
- Every core theme is covered by an objective; an objective that no tutorial task can test is rewritten.

### Block 6 — Fallunternehmen (running case)

> Soll ein durchgehendes Fallunternehmen alle Kapitel verbinden? Wenn ja: Firma, Branche, zentrale Entscheidung — oder soll ich etwas vorschlagen?

Yes → create `_running_case.md` from `references/running-case-template.md` **before** any chapter is written: Profil, Personen, Begriffe/Gremien, Kursweite Parameter (rates, tax rate, FX, notation), **Zeitachse** with one dated scene per chapter, Fall-Sitzungen, empty *Additions by chapter*. Check the timeline for chronology (one date per decision, no event before its prerequisite). No → omit the file and the *Fallunternehmen* section.

### Block 7 — Terminologie

> Gibt es Fachtermini, Abkürzungen, Symbole oder Schreibweisen, die kursweit gleich bleiben sollen?

Derive from briefing/wiki/old edition; present for confirmation. Format: `- **ABK** = Langform — Verwendungshinweis`. Include number format, symbol spellings, person forms (as in the existing material; default neutral forms or `:innen`).

### Block 8 — Leitfragen

Offer to derive one guiding question per chapter: a question a student might ask before the chapter, not giving away the answer, starting with "Was/Wie/Wer/Warum/Wann…" (EN: What/How/Why/When…).

---

## INIT Mode: Generate the Files

Fill `references/curriculum-template.md` (headings in the course language, mapping in the template's comment) and save as `[projekt]/_curriculum.md`. If Block 6 said yes, fill `references/running-case-template.md` and save as `_running_case.md`. Optionally, if the author agrees, mirror the terminology into `context/shared/glossary.md`.

Confirmation:

> **Curriculum gespeichert: `_curriculum.md`** [· `_running_case.md`]
>
> [N] Kapitel · [N] Teile · Lernziele 1–[N] · [N] Grundlagenblöcke · Selbststudium [N] Min./Kapitel
>
> Stimmen Themenauswahl, Lernziele und Lehrformat? Das ist die Basis für alle lecture-factory-Läufe.

---

## UPDATE Mode

Read the existing file(s) fully; ask only targeted questions.

- **Status update:** set the chapter's status (✅ fertig etc.), update the context directory. Report: **"Kapitel [N] — [Titel] als ✅ fertig markiert."**
- **New chapter:** ask number, title, core themes, part; insert into the overview, *Lernpfad*, *Lernziele je Kapitel*, *Material je Kapitel*, *Leitfragen*. Inserting objectives shifts the course-wide numbers of all later chapters: before renumbering, grep every file that cites LO numbers (chapter callouts, `*Lernziele: …*` / `*Learning objectives: …*` tag lines, Moodle names and objectives pages, slides, teaching notes), list them and ask; after the yes, renumber everywhere in one pass (or hand the list to lecture-factory's consistency pass).
- **Revised objectives:** "Welche Lernziele sollen geändert werden? Alt und neu?" Same grep for files quoting the old text.
- **Terminology addition:** append to *Terminologie-Konventionen*.
- **FACT SHEET ADDITIONS:** enter each reported value under *Additions by chapter* with its derivation. Before entering, check it against *Kursweite Parameter*, *Begriffe/Gremien* and *Zeitachse*; a conflict (other value, second decision date, new person) goes to the author, never silently into the file.

Confirmation: **"Curriculum aktualisiert."** + what changed in 1–2 sentences.

---

## Integration with lecture-factory

| Moment | Who | What |
|---|---|---|
| No `_curriculum.md` | lecture-factory Pre-Flight | asks whether to run curriculum-architect INIT |
| Course rebuild | lecture-factory SERIE, phase 1 | INIT; curriculum + series plan approved together |
| Chapter built | lecture-factory checkpoint / final report | UPDATE: status, FACT SHEET ADDITIONS |
| Chapter written | quarto-lecture / tutorial-builder | read LOs, cohort, terminology, materials, `_running_case.md` |

---

## Quality Checklist

Before saving, verify:

- [ ] Header has Studiengang, Semester, Sprache, `**Wiki:**`; *Lehrformat* and *Kohorte & Vorwissen* are filled (prior courses confirmed by the author, not assumed)
- [ ] *Themenauswahl* records the author's decisions (no merge/drop without a yes)
- [ ] Chapter numbers 2-digit; files `NN_slug.qmd` (English lowercase slug, underscores); tutorials `tutorials/tut_NN_slug.qmd`
- [ ] Learning objectives per chapter, numbered course-wide 1 … N without gaps or restarts, no second scheme, in the course language; each chapter has ≥ 1 analysieren/beurteilen objective
- [ ] *Material je Kapitel* has one row per chapter incl. Kurzfall source and self-study minutes
- [ ] Grundlagenblöcke (if any) are marked in Kernthemen and explained in *Lernpfad*
- [ ] Status emojis exactly ✅ 🔄 📋 ⏸; legend after the overview
- [ ] Terminology entries `**ABK** = Langform — Hinweis`; one spelling per symbol
- [ ] One guiding question per chapter
- [ ] With a running case: `_running_case.md` exists, every chapter has a dated scene in *Zeitachse*, each decision has exactly one date
- [ ] Context directory matches the files present (check with `ls`)
- [ ] No YAML front matter in either file
