---
name: curriculum-architect
description: "Creates and maintains the _curriculum.md file — the structural backbone of a Quarto lecture course. Two modes: (1) INIT — interviews the author and reads any available briefing/wiki files to create a new _curriculum.md from scratch; (2) UPDATE — reads an existing _curriculum.md and applies targeted changes (add chapter, update status, revise themes or learning objectives). Trigger for: 'Erstelle ein Curriculum', 'leg ein Curriculum an', 'aktualisiere das Curriculum', 'füge ein Kapitel ins Curriculum ein', 'markiere Kapitel X als fertig', 'neuer Kurs aufsetzen', or any new Quarto lecture project where no _curriculum.md exists. Also triggered by lecture-factory's Pre-Flight when _curriculum.md is missing."
---

# Curriculum Architect

A focused skill for creating and maintaining the `_curriculum.md` file — the single source of truth for a lecture course's chapter structure, learning objectives, terminology conventions, and completion status.

## Why This File Matters

`_curriculum.md` is not just documentation — it actively drives the lecture-factory workflow:

- **lecture-factory** reads it to write coherent chapter transitions: backward references to the previous chapter's core idea, forward references to what comes next. Without it, each chapter re-introduces concepts the previous one already established.
- **quarto-lecture** uses it to enforce terminological consistency — no chapter should invent vocabulary that contradicts earlier chapters.
- It is the answer to the question: "What does this course cover, in what order, and how far along are we?"

A missing or stale `_curriculum.md` produces disconnected chapters that feel like separate documents rather than a coherent course.

---

## Mode Detection

**INIT mode** — triggered when:
- No `_curriculum.md` exists in the project's output directory
- User says: "neues Curriculum", "Curriculum anlegen", "Kurs aufsetzen", "leg das Curriculum an", "starte den Kurs"
- lecture-factory's Pre-Flight reports `_curriculum.md` not found and user agrees to create one

**UPDATE mode** — triggered when:
- An existing `_curriculum.md` is found and the user wants to change something
- A chapter was just created with lecture-factory and needs to be registered
- A chapter's status changes (📋 → 🔄 → ✅)
- User says: "Kapitel hinzufügen", "Status aktualisieren", "Kapitel N als fertig markieren", "Lernziele anpassen", "Kernthemen ergänzen", "neues Modul anlegen"

If you detect an existing `_curriculum.md` but the user phrased the request as INIT, ask first: "Es gibt bereits eine `_curriculum.md` — soll ich die bestehende aktualisieren oder eine neue anlegen?"

---

## Pre-Flight: Read Before Asking

Before presenting any questions, silently gather what's already available. Report findings in one sentence at the start.

**Step 1 — Existing curriculum**: Read `[output-dir]/_curriculum.md` if it exists. In UPDATE mode, this is the primary input.

**Step 2 — Briefing file**: Check for `raw/briefing.md`, `raw/brief.md`, or any `raw/*.md` that looks like a course brief. Read it. It likely contains course concept, target audience, module structure, and learning objectives. Extract what you can before asking.

**Step 3 — Wiki index**: Check for `wiki/index.md`. If found, read it. Synthesis and concept pages may reveal the course's conceptual architecture. Use this to derive chapter themes.

**Step 4 — Existing .qmd files**: List all `kap-*.qmd` in the output directory. For each, read the YAML frontmatter (title, subtitle) to derive chapter names, slugs, and tentative status. A file that exists is at least 🔄 aktiv; use judgment based on file content.

**Step 5 — context/shared**: Check `context/shared/` for existing terminology conventions or glossary files.

---

## INIT Mode: Structured Interview

Ask questions in logical blocks. Use Pre-Flight findings first — only ask for what you couldn't derive. Present derived information for confirmation rather than asking from scratch.

### Block 1 — Course Identity

If not derivable from Pre-Flight sources, ask as a single grouped question:

> Ich brauche einige Grunddaten für das Curriculum. Kurze Antworten reichen:
>
> 1. Kurs-Titel (vollständiger Name, wie auf dem Zeugnis)?
> 2. ECTS / Semesterwochenstunden?
> 3. Zielgruppe: Studiengang, Niveau, Was bringen die Studierenden mit?
> 4. Sprache (de / en / zweisprachig)?
> 5. Semester oder Zeitrahmen (oder „—" wenn offen)?

If the briefing file answered some of these, show the derived values and only ask about gaps:
> "Aus der Briefing-Datei habe ich abgeleitet: [Kurs-Titel], [ECTS], [Zielgruppe]. Stimmt das — oder gibt es Korrekturen?"

### Block 2 — Module & Chapter Structure

If a briefing or wiki provided a chapter outline, present it immediately:

> Ich habe folgende Kapitelstruktur aus [briefing.md / wiki] abgeleitet. Stimmt das so, oder fehlt etwas / muss etwas umbenannt werden?
>
> | Nr | Titel | Kernthemen (vorläufig) |
> |---|---|---|
> | 01 | [Titel] | [Themen] |
> …

If no structure is available, ask:

> Wie viele Module und Kapitel soll der Kurs haben? Eine grobe Liste reicht — Kapiteltitel und 3–4 Stichworte pro Kapitel.

For each chapter, derive:
- `Nr` — 2-stellig, nullgefüllt: `01`, `02`, … `10`
- `Titel` — kurz, prägnant, deutsch
- `Datei` — `kap-{Nr}-{slug}.qmd` (slug = kebab-case aus Titel, Umlaute umschreiben: ü→ue, ä→ae, ö→oe)
- `Status` — `✅ fertig` wenn .qmd-Datei existiert und vollständig wirkt, sonst `📋 geplant`
- `Kernthemen` — 3–5 Fachbegriffe, kommasepariert, aus briefing/wiki ableiten wenn möglich

### Block 3 — Learning Objectives

Per Modul anbieten:

> Was sollen Studierende nach Modul [N] können? Ich kann die Lernziele auch aus den Kernthemen ableiten — soll ich das tun, oder formulierst du sie lieber selbst?

If user says "leite ab": Derive from key themes using standard Bloom action verbs:
- Niveau 1 (Erinnern/Verstehen): benennen, beschreiben, erklären, zusammenfassen
- Niveau 2 (Anwenden): anwenden, einordnen, klassifizieren, zuordnen
- Niveau 3 (Analysieren/Beurteilen): unterscheiden, beurteilen, kritisch einordnen, vergleichen

Aim for 4–6 Lernziele per Modul as numbered "Die Studierenden können…" statements.

### Block 4 — Terminology Conventions

Ask:

> Gibt es Fachtermini, die kursübergreifend konsistent verwendet werden sollen — z.B. Abkürzungen, Gendering-Stil, englische Terme im Original oder übersetzt?

Derive from briefing/wiki glossaries if available. Present for confirmation. Standard defaults (use unless overridden):
- Genderzeichen `:innen` (Entwickler:innen, Nutzer:innen)
- Englische Fachtermini kursiv beim ersten Vorkommen + deutsche Erklärung
- Abkürzungen beim ersten Vorkommen ausschreiben

Format each convention as:
```
- **ABKÜRZUNG** = Langform — Verwendungshinweis
```

### Block 5 — Guiding Questions (offer to derive)

> Jedes Kapitel kann eine rhetorische Leitfrage haben — soll ich diese aus den Kapitel­titeln und -themen ableiten, oder formulierst du sie selbst?

Each guiding question should:
- Be a direct question a student might ask before the chapter
- Not give away the answer
- Start with "Was…", "Wie…", "Wer…", "Warum…", or "Wann…"

---

## INIT Mode: Generate _curriculum.md

After all blocks are complete (or as much as the user provided), generate the file using this exact template. Do not invent a different structure.

````markdown
# [Kurs-Titel]

**Studiengang:** [Studiengang / z.B. Micro-Credential (X ECTS), interdisziplinär]
**Semester:** [Semester oder —]
**Sprache:** [de / en]

---

## Kapitelübersicht — [Modul 1 Titel]

| Nr | Titel | Datei | Status | Kernthemen |
|---|---|---|---|---|
| 01 | [Titel] | kap-01-[slug].qmd | [Status] | [Thema1, Thema2, Thema3] |

**Status-Legende:** ✅ fertig · 🔄 aktiv · 📋 geplant · ⏸ pausiert

---

## Kapitelübersicht — [Modul 2 Titel]  ← (nur wenn Modul 2 existiert)

| Nr | Titel | Datei | Status | Kernthemen |
|---|---|---|---|---|
| 06 | [Titel] | kap-06-[slug].qmd | [Status] | [Thema1, Thema2, Thema3] |

**Status-Legende:** ✅ fertig · 🔄 aktiv · 📋 geplant · ⏸ pausiert

---

## Kursweite Lernziele

**[Modul 1 Titel]**

1. [Lernziel — Die Studierenden können…]
2. …

**[Modul 2 Titel]**

6. [Lernziel]
…

---

## Terminologie-Konventionen

- **KI** = Künstliche Intelligenz — beim ersten Vorkommen im Kapitel ausschreiben
- [weitere Konventionen…]
- Personenbezeichnungen: Genderzeichen `:innen` (Entwickler:innen, Nutzer:innen)

---

## Kapitel-Leitfragen

| Nr | Leitfrage |
|---|---|
| 01 | [Frage] |
…

---

## Kontext-Verzeichnis

```
output/
├── _curriculum.md                    ← diese Datei
├── kap-01-[slug].qmd                 [✅ / 📋]
…
├── widgets/
│   ├── kapitel-01/
│   └── …
└── diagrams/
    ├── kapitel-01/
    └── …
```

Wiki (Second Brain): `[absoluter Pfad zum wiki/]`
Raw Sources: `[absoluter Pfad zum raw/]`
````

Save to `[output-dir]/_curriculum.md`.

### Also update context/shared (optional but recommended)

If the user agrees, create `context/shared/glossary.md` with the terminology conventions in machine-readable format. lecture-factory reads this directory for course-wide norms.

### Confirmation Report

After saving, present:

> **Curriculum gespeichert: `_curriculum.md`**
>
> [N] Kapitel · [N] Module · [N] Lernziele · [N] Terminologie-Konventionen
>
> Schau kurz drüber — stimmen Struktur und Lernziele? Das ist die Basis für alle lecture-factory-Aufrufe.

---

## UPDATE Mode

Read the existing `_curriculum.md` fully. Identify what needs to change. Ask only targeted questions — no full re-interview.

### Status update (most common)

When a chapter was just completed with lecture-factory:

1. Find the chapter in the table
2. Change `📋 geplant` or `🔄 aktiv` to `✅ fertig`
3. Update the context directory entry to show `✅` and add widget/diagram entries if applicable
4. Save

Report: **"Kapitel [N] — [Titel] als ✅ fertig markiert."**

### New chapter

Ask only:
> Kapitel-Nummer? Titel? Kernthemen (3–5)? In welches Modul gehört es?

Then:
1. Insert at the correct position in the chapter table
2. Add a guiding question in the Leitfragen table
3. Add a Lernziel to the corresponding module's learning objectives block
4. Update the context directory

### New module

Like new chapter, but also:
1. Add a new `## Kapitelübersicht — [Modul-Titel]` section with status legend
2. Add a new **[Modul-Titel]** block in Kursweite Lernziele

### Revised learning objectives

Ask: "Welche Lernziele sollen geändert werden? Zeig mir den alten und neuen Text."

### Terminology addition

Ask: "Welchen Begriff mit welcher Konvention?" Then append to Terminologie-Konventionen.

### Confirmation after UPDATE

> **Curriculum aktualisiert.** [Was geändert wurde in 1–2 Sätzen.]

---

## Integration with lecture-factory

lecture-factory reads `_curriculum.md` in its Pre-Flight step (Step 1). The two skills interact as follows:

| Moment | Wer handelt | Was passiert |
|---|---|---|
| Neues Projekt, kein _curriculum.md | lecture-factory Pre-Flight | Fragt: "Soll ich curriculum-architect aufrufen?" |
| Kapitel neu erstellt | lecture-factory (Checkpoint) | Hinweis: "_curriculum.md aktualisieren mit /curriculum-architect" |
| Kapitel als ✅ fertig markiert | Nutzer ruft curriculum-architect UPDATE auf | Status im curriculum aktualisieren |
| lecture-factory liest Curriculum | lecture-factory Pre-Flight | Extrahiert: Vorgänger-Kapitel, Nachfolger-Kapitel, Terminologie-Konventionen |

lecture-factory uses from `_curriculum.md`:
- **Predecessor chapter** (Nr - 1): title + key themes → used in chapter opening's 1-sentence backward reference
- **Successor chapter** (Nr + 1): title + key themes → used in chapter closing's 1-sentence forward reference
- **Terminology conventions**: enforced throughout the new chapter text

---

## Quality Checklist

Before saving, verify:

- [ ] All chapter numbers are 2-digit zero-padded (01, 02, … 10, 11, …)
- [ ] Filenames use `kap-{Nr}-{slug}.qmd` with kebab-case slug (no umlauts: ü→ue, ä→ae, ö→oe, ß→ss)
- [ ] Status emojis use exactly: ✅ 🔄 📋 ⏸ (no other variants)
- [ ] Status legend line appears after every chapter table
- [ ] Learning objectives are numbered consecutively across all modules (Modul 1: 1–5, Modul 2: 6–10, etc.)
- [ ] Learning objectives use "Die Studierenden können…" phrasing
- [ ] Terminology entries follow: `**ABKÜRZUNG** = Langform — Verwendungshinweis`
- [ ] Guiding questions table has one entry per chapter
- [ ] Context directory tree reflects actual files present (check with ls)
- [ ] The file has no YAML frontmatter (it's a plain Markdown file, not a Quarto document)
