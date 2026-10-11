---
name: teaching-note
description: "Writes a Teaching Note (Dozenten-Vorbereitungsnotiz) as .qmd for a lecture session: German prose with the key technical terms in English in italic brackets, a minute-by-minute plan, expected answers to every exercise, verified numbers, likely student questions, pitfalls, cross-references to other chapters, things to look at beforehand, and sources. Use when the user wants a note to read BEFORE a lecture, 'Teaching Note', 'Dozentennotiz', 'Vorbereitungsnotiz', 'Handreichung für die Vorlesung', 'was muss ich vor der Vorlesung wissen', or asks for such notes for all chapters of a course. Two modes: LECTURE (default, minute-by-minute plan for a session with slides) and Q&A SESSION (weekly question session in an online course, e.g. BUA1; see references/qa_session_mode.md: anticipated student questions with answers, diagnostic polls, live worked example, exam pitfalls from mock-exam data). Typically built from an existing MARP deck (marp-slides skill) plus the chapter .qmd, or from the chapter, tutorials and question bank for Q&A mode. NOT for student-facing companion texts (use slides-to-notes) and NOT for slides (use marp-slides)."
---

# Teaching Note — Lecturer Preparation for One Session

## What this skill is

A teaching note is what Prof. Kraus reads 20–30 minutes before a session. It is **not** a script for students and **not** a copy of the slides. It answers: *What happens in which minute, what will students say, which number must I have ready, what can go wrong, what do I link to, and what should I look at first?*

Language: **German prose, key technical terms in English in italic brackets at first use**, e.g. Standardabweichung (*standard deviation*). Add a glossary table at the end ("Begriffe auf einen Blick"). If the user asks for English only, translate and keep the same structure. Quotation marks around slide titles stay as on the slides (English).

## Modes

- **Lecture mode** (default): this file.
- **Q&A-session mode**: when the session is a weekly question appointment for a self-study chapter (online track), read `references/qa_session_mode.md` and follow its section list instead of the 11 sections below. Example: `references/example_qa_note.qmd`.

## Inputs

1. The **MARP deck** of the session (`marp/NN_*_slides.md`) — its speaker notes contain the expected answers.
2. The **chapter .qmd** (`chapters/NN_*.qmd`) — for background and cross-checks.
3. Widgets (`widgets/NN_*/`) — what each does, which settings to use.
4. Neighbouring chapters (previous/next) for cross-references; `_curriculum.md` if present.

If there is no deck, tell the user and either propose to use marp-slides first or build the note from the chapter alone (without the minute-by-minute plan tied to slide numbers).

## Output

File: `teaching_notes/NN_<topic>_teaching_note.qmd` next to `chapters/` and `marp/`. YAML:

```yaml
---
title: "Teaching Note N: <Chapter title>"
subtitle: "<Course> -- Vorbereitung für Dozent:in (90 min), deutsch mit englischen Fachbegriffen"
lang: de
format: handout-typst
author: "Prof. Dr. Christian Kraus, THWS"
date: last-modified
---
```

Render with the course's THWS extension (format `handout-typst`, PDF via Typst): the note folder needs its own `_extensions/` copy of the `c-kraus` extensions (copy it from `Tutorials/_extensions` or `tutorials/_extensions`; Quarto does not find the project-root copy from this folder). Level-1 headings are numbered by the template automatically: do NOT type numbers into headings. Use `::: {.merksatz}` for the opening callout. Write quotation marks as plain ASCII pairs (straight double quotes): the Typst template turns typographic German closing quotes into wrong ones. If the table of contents makes the note too long, add `outline-depth: 1` to the YAML. Do not commit PDFs (`*.pdf` is gitignored in the courses).

Start with a short merksatz box stating purpose, source deck and that all numbers were recomputed.

## Required sections (in this order)

1. **Auf einen Blick** — table: Leitfrage, Roter Faden (which case returns where), Lernziele, Vorwissen, Material (say clearly if none; if paper/slips are needed, give the text to print and a no-material fallback), number of slides main/appendix.
2. **Zeitplan (Minuten)** — table: minutes, slide number(s), block, format. Totals to the session length. Add one sentence **"Puffer"**: what to cut if time runs short.
3. **Ablauf im Detail** — one subsection per block: what to do, what to hold back (e.g. reveal the answer only on slide N), **expected student answers**, the **pointe** of each exercise, how to handle the vote. Copy the expected answers from the deck's speaker notes and expand them.
4. **Zahlen zum Nachschlagen** — table of all numbers used (inputs, results, rounded and, where useful, exact). **Recompute every number** (Python); note the method (e.g. "400,000 simulation runs").
5. **Typische Rückfragen und Antworten** — 5–8 questions students really ask, with an answer the lecturer can give in 2–3 sentences. Where the honest answer is "it depends", say on what.
6. **Fallstricke** — tool pitfalls (Excel `RAND()`), sign conventions, wrong-but-common intuitions, widget behaviour (random variation is intended).
7. **Querverweise** — back to earlier chapters (what to recall), forward (what to seed). Name the chapter numbers and the concept.
8. **Was Sie sich vorab ansehen sollten** — concrete list with time estimates: widgets to open (with the settings), a calculation to redo (give a short runnable Python or Excel snippet, **run it**), a document or news item to check if the topic is time-sensitive.
9. **Offene Punkte** — only what is still open: unverified claims, gaps in chapter/tutorial/widgets, things to research or decide. **No change history** (no old-vs-new, no 'corrected on', no dates of corrections): fixed items simply disappear from the note.
10. **Vertiefung (geprüfte Quellen)** — only references that appear in the deck or are verified; APA style; mark time-sensitive facts (laws, thresholds) with "Stand vor der Vorlesung prüfen".
11. **Begriffe auf einen Blick** — two-column table Deutsch / English for the terms of this chapter.

## Rules

- **No invented facts, quotes or citations.** If a news example or current figure would help, say "vor der Vorlesung recherchieren", do not make one up.
- Every number in the note must match the deck and the (corrected) chapter. If you find a mismatch, fix the note, report the discrepancy to the user, and list it in section 9 only while it is still open.
- **No change history in the note.** State facts in their correct form; never write that something was changed or corrected.
- Run all code snippets before including them.
- Expected answers must be complete enough that the lecturer can judge a student answer without opening the deck.
- Keep it scannable: tables for plan/numbers, short paragraphs elsewhere; target 3–5 printed pages.
- Do not change `.qmd` chapters or slides from within this skill; report findings instead.
- Series mode: agree the pattern once (language, location, naming), then run through chapters; check consistency of terms across notes (same English term for the same German term).

## Workflow

1. Read the deck (all speaker notes), the chapter, the example `references/example_teaching_note.qmd`.
2. Recompute all numbers and any simulation (Python).
3. Draft sections 1–11; fill the time plan from the deck's slide order.
4. Cross-check against neighbouring chapters (terms, notation).
5. Write the file; optionally render with `quarto render` to confirm it compiles.
6. If a git repo: commit per note (`Add teaching note for chapter N`) and push, pull --rebase first.
7. Report briefly: what is in the note, which discrepancies were found, what the lecturer should research before the session.

## Checklist

- German prose, English terms in italic brackets at first use, glossary at the end?
- Time plan sums to session length, with a cut suggestion?
- Expected answers for every exercise and vote?
- Numbers recomputed, code run?
- Cross-references to the previous and next chapter?
- Time-sensitive facts flagged?
- No invented examples or quotes?
