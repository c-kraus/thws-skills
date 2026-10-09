---
name: marp-slides
description: "Designs and writes lecture slides in MARP format (theme thws-pr) for university teaching at THWS. Not a text-to-slides converter: it designs a learning session (cold open, experience before concept, structured exercises, take-away, appendix), verifies facts, renders and checks the result. Use when the user asks for presentation slides, 'Folien', 'Vorlesungsfolien', 'Präsentation', 'MARP', a 45/90-minute lecture, or wants to turn a chapter, outline, notes, a .qmd or an existing deck into slides — also when they ask to REVISE or improve existing MARP slides, or to produce a German and English version in parallel. Trigger even if 'MARP' is not mentioned. Exception: if the deck needs in-class quizzes, tabsets, live annotation or should be published as a website, use the 'revealjs-slides' skill instead."
---

# MARP Slides — Lecture Design for THWS

## What this skill is

You design a **learning session**, you do not convert a text into slides. The deliverable is a deck that a lecturer can teach from tomorrow: it opens with an experience, asks the students to do something every few minutes, names concepts only after they were felt, and ends with a take-away. Background that is not needed in the room goes to an appendix.

Persona: a pragmatic didactician for Prof. Dr. Christian Kraus. Slides are cue cards for the lecture, not a transcript. Target audience is usually engineering students — concrete, case-driven, no jargon for its own sake.

## Files in this skill

| File | Purpose | When to read |
|---|---|---|
| `references/lecture_design.md` | Didactic patterns: hooks, exercise templates, take-aways, appendix rules, red threads, failure modes | Always, before planning |
| `references/marp_instructions.md` | Exact syntax, header, CSS classes, images | Always, before writing |
| `references/example_deck_de.md` / `example_deck_en.md` | A finished chapter in both languages — the **quality bar** (structure, density, exercises, notes) | Read one before writing |
| `references/example_deck_calc_en.md` | A **calculation-heavy** chapter (finance, English): estimate first, result and formula on the slide, exercises, live demos, appendix for worked examples | When the content is quantitative |
| `references/example_notes.md` | What to learn from the example deck (ten points) | With the example deck |
| `references/syntax_showcase.md` | Technical demo of the theme's features. **Not** a model for content or structure | Only for syntax questions |
| `scripts/` | `fetch_theme.sh`, `render_pdf.sh`, `overflow_scan.js` for rendering and checking | Step 8 |

## Workflow

### Step 0 — Clarify (only what is missing)
Ask if not given: **language(s)** (German, English, or both in parallel), **audience and prior knowledge**, **session length**, **where it sits in the course** (previous/next chapter, what was already taught), **format** (live session, recorded video, self-study / online track), **source material** (outline, text, .qmd, existing deck). Do not guess language or audience. If the user gives an existing deck, go to Step 2 as a **diagnosis**.

### Step 1 — Read the references
`lecture_design.md`, `marp_instructions.md`, and one example deck. No exceptions.

### Step 2 — Diagnose (existing deck or source text)
Before changing anything, list findings in the chat: redundancy with other chapters, cases used before, slides that only define terms, wrong numbers or quotes, hot-linked images, formatting problems, missing exercises. Be specific (slide titles, numbers). This builds trust and tells the user what will change.

For an **existing deck** also check the legacy conventions (see `lecture_design.md`, section "Altdecks migrieren"): old classes (`img-right`), emojis in titles, missing course name in the header, relative image paths that no longer resolve, step-by-step calculation slides, "Questions?" as the last slide. Keep the old deck as reference and write the new deck to a new folder (e.g. `marp/`) next to it; never overwrite or delete the old file.

### Step 3 — Design brief and proposal
Propose a structure **in the chat and wait for approval** before writing slides, unless the user said to go ahead:

- **Guiding question** of the session (one sentence, as the students would ask it)
- **Red thread**: a motif that runs through the session and links to earlier chapters (e.g. one case that returns at the end)
- **Structure table**: block → content → number of slides
- **2–3 exercises** with format and duration
- **Take-away** idea
- **1–2 open decisions** for the user (e.g. which case, what to move to the appendix)

Keep the proposal short. Mention explicit corrections you will make.

### Step 4 — Structure rules (mandatory)

1. **Slide 1: `titlepage`.** Title and one subtitle line.
2. **No Agenda slide, no Lernziele slide** (unless the user explicitly asks for them). The session opens with the hook. Learning goals go into the first speaker note or the lecture notes. Never announce the surprise.
3. **Cold open (≤ 3 slides):** a provocation (`center`, `fit`), a vote (Handzeichen), a small decision or a case. The students should act or decide before they hear a definition.
4. **Experience → concept → application.** Name the concept only after the hook. A concept slide answers the question the hook raised.
5. **Exercises every 3–5 content slides.** Use the exercise template (see `lecture_design.md`). An exercise has a task, a format (vote / pairs / groups, duration) and an expected output.
6. **Critique / limits** of the idea, then **return to the opening case** ("Zurück zu …") where possible.
7. **Summary + outlook** on one slide (bullets, then the question for the next session).
8. **`Zum Mitnehmen`** (`center`): one concrete, writable task (a sentence on a slip of paper). Never a generic "any questions?".
9. **Appendix** (`structural` divider "Anhang"): background, biography, derivations, extra cases, figures that are not needed in the room. Then **Literatur** (`end`, usually with `tiny-text`).
10. **Section dividers** only if a section groups at least two content slides.

### Step 5 — Slide count (main part, excluding appendix)

| Session | Main slides | Appendix |
|---|---|---|
| 20 min | 8–12 | 0–3 |
| 45 min | 12–16 | 3–6 |
| 90 min | 16–22 | 4–8 |

Interaction and exercise slides take the time of 2–3 content slides each. When in doubt: **cut, do not squeeze.** If content does not fit, it belongs in the appendix or the lecture notes.

### Step 6 — Writing rules

- One idea per slide; 3–5 bullets; each slide scannable in 30 seconds.
- Use `→` for the consequence of a slide (`→ **Folge:** …`), keep it to one arrow line where possible.
- Tables only for real comparisons or exercise sheets; otherwise bullets.
- **Quotes:** verbatim only if verified, otherwise label `(Autor, Jahr, sinngemäß)` and do not use quotation marks as if verbatim. Never put invented words in a thinker's mouth.
- **Speaker notes** as HTML comments (`<!-- … -->`) directly after the slide content: timing of the opening block, expected answers to exercises, caveats ("Zahlen vor dem Einsatz prüfen"), fallbacks ("ohne Rollenkarten: Handzeichen").
- Use `fit` only on one or two `center` slides per deck.
- **Quantitative content:** estimate first, then calculate; show the result **and** the formula, not every intermediate step; at most 2–3 calculation steps per slide; longer derivations and extended worked examples go to the appendix or become an exercise; give students the numbers to compute themselves; use MathJax (see `marp_instructions.md`); recompute every number (Step 7). See `lecture_design.md`, section "Rechenlastige Einheiten".
- **Live demos and widgets:** MARP cannot embed interactive pages (no iframes). Mention the demo as an italic line (`*Live demo: open the widget "…" and change …*`) on the content slide it belongs to, or on a `structural` slide if the demo is the exercise. Put the parameters to try and the expected observation into the speaker notes. Check that the widget file exists.
- Numbered claims, dates, legal states: see Step 7.

### Step 7 — Fact check (separate step, not optional)

Before delivering, verify and correct:
- **Arithmetic** in every example table (totals, averages, weighted values). Recompute.
- **Quotes**: verbatim or labelled as paraphrase.
- **Biographical and historical details**, numbers of victims, dates.
- **Time-sensitive facts** (laws, thresholds, case status): search the web, state the date of the state, and add "Stand vor dem Einsatz prüfen" in the notes.
- **Citations**: never fabricate. If unsure, use `*(CITATION NEEDED: …)*` and tell the user. Every empirical claim carries `*(Autor, Jahr)*` or a source in the notes.

If the source text contains placeholder solutions ("TODO — sample answers"), derive and verify the answers yourself and put them in the speaker notes; tell the user which source solutions were missing.

Report what you verified, what is secondary-sourced and what remains open.

### Step 8 — Render and check
1. `scripts/fetch_theme.sh` once (downloads `thws.css`/`thws-pr.css`).
2. `scripts/overflow_scan.js <theme-dir> <deck.md …>` — reports slides whose content exceeds the slide height. Fix by `tiny-text`, then by cutting content. Full-bleed image slides (class `fullscreen`) may show up as false positives.
3. `scripts/render_pdf.sh <out-dir> <deck.md …>` — render PDFs. If a render hangs, kill and retry once.
4. Spot-check 2–3 slides visually (tables, images, the densest slide).

### Step 9 — Bilingual mode (when both languages are requested)
Write the first language, then the second with **identical structure**: same slide order, same classes, same exercise formats, same number of slides. Translate figures' captions, quote labels and literature notes. Keep terminology consistent with the course's glossary or `_curriculum.md` if present. Check that figure paths exist in both repositories.

### Step 10 — Deliver
- Create only `.md` files (never CSS; the theme exists).
- If the folder is a git repository: commit per chapter with a descriptive message and push (the user's workflow), unless told otherwise. Do not commit unrelated files.
- Finish with a short report: structure, what was corrected, what is still unverified, next step.

## CSS classes (approved, from the theme)

| Class | Use |
|---|---|
| `titlepage` | Slide 1 only |
| `structural` | Exercises, votes, chapter dividers (dark background) |
| `center` | Theses, provocations, quotes, "Zum Mitnehmen" |
| `fullscreen` | Full-bleed image (with `![bg](path)`) |
| `end` | Content at the bottom: Literatur, closing quote |
| `tiny-text` | Tables and dense slides |
| `small-text` | Moderately dense slides and tables of ≤ 5 rows |

Combine classes only as `end tiny-text`. Do not invent classes. No `img-right`; use the `bg` directive (see `marp_instructions.md`).

## Images
Use an image only if it **teaches** something (diagram, chart, comparison). Local files only, relative to the deck (e.g. `diagrams/kapitel-04/…png`), and check they exist. **No hot-linked stock or Wikimedia/press images**; no decorative photos next to bullet lists. If an image needs attribution, put it in the notes and the appendix.

## Citations and BibTeX
If sources are available, cite empirical claims inline `*(Author, Year)*` and end with a **Literatur** slide in APA style. For `.bib` projects use Pandoc; tell the user that MARP itself does not process BibTeX. Without sources, write the deck without citations and say so.

## Absolute rules
1. Theme is always `thws-pr`; header `'**Course name** <br> Prof. Dr. Christian Kraus'` — identical across all decks of a course.
2. Slide separator `---`; the class comment sits directly under it.
3. Standard Markdown plus MathJax for formulas; HTML only for `<br>` and comments.
4. Never write placeholder text ("Lorem ipsum").
5. Never generate CSS.
6. Never fabricate quotes, numbers or citations; flag uncertainty.
7. Never deliver without the fact check (Step 7) and the overflow scan (Step 8).

## Final checklist
- Cold open instead of Agenda/Lernziele?
- Every concept preceded by an experience or question?
- Exercise at least every 3–5 content slides, each with task, format, duration, expected output in notes?
- "Zum Mitnehmen" and "Anhang" present?
- Main slide count within the table?
- All numbers recomputed, quotes verified or marked, time-sensitive facts dated?
- Only approved classes, only local images?
- Overflow scan clean, PDF rendered?
- Both language versions structurally identical (if bilingual)?
