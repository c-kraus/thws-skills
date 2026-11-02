---
name: teaching-note
description: "Writes a Teaching Note (Dozenten-Vorbereitungsnotiz) as .qmd for one session: German prose with key terms in English in italic brackets, minute plan, expected answers, verified numbers, likely student questions, pitfalls, cross-references, open points. Use when the user wants a note to read BEFORE a lecture or tutorial: 'Teaching Note', 'Dozentennotiz', 'Vorbereitungsnotiz', 'Handreichung für die Vorlesung', 'was muss ich vor der Vorlesung/dem Tutorium wissen', or notes for all chapters of a course. Modes: LECTURE (session taught from a MARP deck, plan tied to slide numbers), TUTORIAL (in-class tutorial without a deck, e.g. Präsenz-Tutorium 90 min: plan from the tasks' tag lines, compact results table, typical errors, short-case guide) and Q&A SESSION (weekly question session in an online course, e.g. BUA1). NOT for student-facing companion texts (slides-to-notes) and NOT for slides (marp-slides)."
---

# Teaching Note — Lecturer Preparation for One Session

## What this skill is

A teaching note is what Prof. Kraus reads 20–30 minutes before a session. It is **not** a script for students and **not** a copy of the slides or the solution sheet. It answers: *What happens in which minute, what will students say, which number must I have ready, what can go wrong, what do I link to, and what should I look at first?*

Language: **German prose, key technical terms in English in italic brackets at first use**, e.g. Standardabweichung (*standard deviation*). Add a glossary table at the end ("Begriffe auf einen Blick"). If the user asks for English only, translate and keep the same structure. Quotation marks around slide titles stay as on the slides (English).

## Modes

| Mode | When | Sections | Length |
|---|---|---|---|
| **LECTURE** | the session is taught from a MARP deck | the 11 sections below; example `references/example_teaching_note.qmd` | 5–7 pages |
| **TUTORIAL** | in-class tutorial (Präsenz-Tutorium) without a deck, built on a tutorial sheet `tutorials/tut_NN_*.qmd` | `references/tutorial_mode.md` | **3–5 pages** |
| **Q&A SESSION** | weekly question session for a self-study chapter (online track) | `references/qa_session_mode.md`; example `references/example_qa_note.qmd` | 6–8 pages |

**Mode detection:** a deck for the session exists (`marp/`, `slides/`) → LECTURE. No deck, and `_curriculum.md` (section Lehrformat) or the user describes an in-class tutorial → TUTORIAL. Online course with a question appointment per chapter → Q&A. If it is still unclear, ask once; never pretend a deck exists. Pages are printed `handout-typst` pages (about 250–300 words per page with tables); check the budget after rendering and cut, do not shrink the font.

## Inputs

1. `_curriculum.md` if present: learning objectives with their **course-wide numbers** (use these, never a chapter-local scheme), Lehrformat (session length, weeks), Kohorte & Vorwissen.
2. `_running_case.md` if present — read it **first** (see Rules).
3. LECTURE: the **MARP deck** of the session — its speaker notes contain the expected answers. TUTORIAL: the tutorial sheet with its solution part and task tag lines. Q&A: see its reference file.
4. The **chapter .qmd** — for background and cross-checks.
5. Widgets (`widgets/NN_*/`) — what each does, which settings to use.
6. Neighbouring chapters (previous/next) for cross-references.

## Output

File: `teaching_notes/NN_<topic>_teaching_note.qmd` next to `chapters/` and `marp/`; in a Quarto book project `_teaching_notes/` (the underscore keeps it out of the book render). YAML:

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

Render with the course's THWS extension (format `handout-typst`, PDF via Typst). Quarto does not find the project-root `_extensions/` from the note folder, so the folder needs a **symlink**, never a copy (a copy goes stale and ends up committed): from the note folder run `ln -s ../_extensions _extensions` (or `ln -s ../tutorials/_extensions _extensions` if the course keeps the extension only there). Commit the symlink only; if a copied `_extensions/` folder is already tracked there, report it so it can be replaced (`git rm -r --cached`, then the link). Level-1 headings are numbered by the template automatically: do NOT type numbers into headings. Use `::: {.merksatz}` for the opening callout. Write quotation marks as plain ASCII pairs (straight double quotes): the Typst template turns typographic German closing quotes into wrong ones. If the table of contents makes the note too long, add `outline-depth: 1` to the YAML. Do not commit PDFs (`*.pdf` is gitignored in the courses).

Start with a short merksatz box stating purpose, source (deck or tutorial sheet) and that all numbers were recomputed.

## Required sections, LECTURE mode (in this order)

1. **Auf einen Blick** — table: Leitfrage, Roter Faden (which case returns where), Lernziele (course-wide numbers), Vorwissen, Material (say clearly if none; if paper/slips are needed, give the text to print and a no-material fallback), number of slides main/appendix.
2. **Zeitplan (Minuten)** — table: minutes, slide number(s), block, format. Totals to the session length. Add one sentence **"Puffer"**: what to cut if time runs short.
3. **Ablauf im Detail** — one subsection per block: what to do, what to hold back (e.g. reveal the answer only on slide N), **expected student answers**, the **pointe** of each exercise, how to handle the vote. Copy the expected answers from the deck's speaker notes and expand them.
4. **Zahlen zum Nachschlagen** — table of all numbers used (inputs, results, rounded and, where useful, exact). **Recompute every number** (Python); note the method (e.g. "400,000 simulation runs").
5. **Typische Rückfragen und Antworten** — 5–8 questions students really ask, with an answer the lecturer can give in 2–3 sentences. Where the honest answer is "it depends", say on what.
6. **Fallstricke** — tool pitfalls (Excel `RAND()`), sign conventions, wrong-but-common intuitions, widget behaviour (random variation is intended).
7. **Querverweise** — back to earlier chapters (what to recall), forward (what to seed). Name the chapter numbers and the concept.
8. **Was Sie sich vorab ansehen sollten** — concrete list with time estimates: widgets to open (with the settings), a calculation to redo (give a short runnable Python or Excel snippet, **run it**), a document or news item to check if the topic is time-sensitive.
9. **Offene Punkte** — only what is still open: unverified claims, gaps in chapter/tutorial/widgets, things to research or decide.
10. **Vertiefung (geprüfte Quellen)** — only references that appear in the deck or are verified; APA style; mark time-sensitive facts (laws, thresholds) with "Stand vor der Vorlesung prüfen".
11. **Begriffe auf einen Blick** — two-column table Deutsch / English for the terms of this chapter.

## Rules

- **No invented facts, quotes or citations.** If a news example or current figure would help, say "vor der Vorlesung recherchieren", do not make one up.
- **Running case:** if `_running_case.md` exists, use only its numbers, dates, persons and terms (e.g. "management board", never a synonym) and introduce nothing new silently. Take the **order of case sessions** from it (Zeitachse, Fall-Sitzungen) and from the Lehrformat in `_curriculum.md`, never from chapter numbers: when the note says when a case is discussed or what students already know of it, check that session order. New values you had to introduce go into the final report under the heading `FACT SHEET ADDITIONS`.
- Every number in the note must match the deck or solution sheet and the chapter. If you find a mismatch, report it to the user and list it under Offene Punkte only while it is still open.
- **No change history in the note.** State facts in their correct form; never write that something was changed or corrected (no old-vs-new, no "korrigiert am", no dates of corrections). Fixed items simply disappear.
- Run all code snippets before including them.
- Expected answers must be complete enough that the lecturer can judge a student answer without opening the deck. In TUTORIAL mode the solution sheet carries the full solutions: the note gives results and pointers, not a second derivation.
- Keep it scannable: tables for plan/numbers, short paragraphs elsewhere; stay within the page budget of the mode.
- Do not change `.qmd` chapters, tutorials or slides from within this skill; report findings instead.
- Series mode: agree the pattern once (mode, language, location, naming), then run through chapters; check consistency of terms across notes (same English term for the same German term).

## Workflow

1. Determine the mode. Read `_running_case.md` and `_curriculum.md`, then the deck (all speaker notes) or the tutorial sheet with solutions, the chapter, and the example or mode reference.
2. Recompute all numbers and any simulation (Python).
3. Draft the sections of the mode; fill the time plan from the deck's slide order (LECTURE) or the tasks' tag lines (TUTORIAL).
4. Cross-check against neighbouring chapters (terms, notation) and the case session order.
5. Write the file; render with `quarto render` to confirm it compiles and check the page count against the budget.
6. If a git repo and nobody (user or orchestrating brief) said otherwise: commit per note (`Add teaching note for chapter N`) and push, pull --rebase first.
7. Report briefly: what is in the note, which discrepancies were found, what the lecturer should research before the session, `FACT SHEET ADDITIONS` if any.

## Checklist

- Mode right, page budget met?
- German prose, English terms in italic brackets at first use, glossary at the end?
- Time plan sums to session length, with a cut suggestion?
- Expected answers (LECTURE) or results table (TUTORIAL) for every exercise and vote?
- Numbers recomputed, code run, identical to deck/solution sheet?
- Running-case facts and case session order as in `_running_case.md`?
- Cross-references to the previous and next chapter?
- Time-sensitive facts flagged? No invented examples or quotes? No change history?
- `_extensions` in the note folder is a symlink, not a copy?
