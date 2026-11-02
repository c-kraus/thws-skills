# Kurzfall (short decision case) — templates

Two ways to deliver a Kurzfall. Both use `tutorial-typst` heading rules: one `## Label N:` block
(badge + page break before it), tasks as `#### Task N:`, solutions in
`::: {.content-visible when-meta="show_solutions"}`. Typst pitfalls (quotes, `+ `/`- `/`= ` at the
start of a table cell) and render commands: `~/.claude/skills/tutorial-builder/references/format-cheatsheet.md`.

## A. Embedded in a tutorial sheet (default)

The block goes into `tutorials/tut_NN_slug.qmd`, usually as the last block. The block's tag line is
the tutorial's unit of planning, so it carries the LOs of all its tasks and the 30 minutes.

```markdown
## Aufgabe 4: Kurzfall — Hartmann Logistik GmbH

*Lernziele: 18, 21 · ca. 30 Minuten*

[Opening paragraph, ≤ 100 words: protagonist by name, organisation, date, immediate issue.]

[Background: only what the decision needs. 1–2 short paragraphs.]

[Closing paragraph: the protagonist just before the decision — an unanswered message, a meeting
tomorrow. Ends mid-thought.]

**Anlage: [Titel]** (one table, all numbers the tasks need)

| Posten | Wert |
|---|---:|
| … | … |

#### Task 1: [Analyse — identify / classify]

[Question]

::: {.content-visible when-meta="show_solutions"}
**Lösung:** [full derivation, norm reference here, not in the narrative]

**Grading Notes:** [typical errors, follow-on errors]
:::

#### Task 2: [Rechnung]

…

#### Task 3: Urteil — [the decision]

[Beurteilen Sie … Was sollte [Protagonist] tun? Begründen Sie Ihre Empfehlung.]

::: {.content-visible when-meta="show_solutions"}
**Lösung:** Erwartet wird ein begründetes Urteil; die folgenden Punkte gehören hinein. …

**Grading Notes:** which arguments are required, which positions are defensible and how they must
be argued.
:::
```

EN: `## Exercise 4: Short case — <Company>`, `*Learning objectives: 18, 21 · about 30 minutes*`,
`**Exhibit: …**`, `**Solution:**`.

## B. Standalone file (case pool, Moodle download)

Same block, alone in its file. Each task then carries its own tag line directly under its heading,
because there is no surrounding sheet:

```markdown
---
title: "[Punchy title]"
subtitle: "Kurzfall — [Firma] (Kapitel N)"
lang: de
author: "[Kurs], THWS"
date: last-modified
show_solutions: false
format: tutorial-typst
---

# [Punchy title]

## Kurzfall 1: [Firma]

[Narrative ≤ 400 words, one Anlage]

#### Task 1: [Titel]

*Lernziele: 18 · ca. 10 Minuten*

…
```

## Short teaching-note part

Not a full case teaching note. Embedded: the solution divs carry the answers; the session note
(`teaching-note`, tutorial mode) carries the rest. Standalone: one page at most, `handout-typst`.

```markdown
**Ablauf (30 Minuten):** 5 Lesen · 15 Tasks in Kleingruppen · 10 Besprechung und Urteil

| Task | Erwartete Antwort / Kernzahl | Typische Fehler |
|---|---|---|
| 1 | A, B bilanzieren; C, D Ausnahme; E kein Leasing | Laptops mitgerechnet; E als Leasing; C mit 12 statt 11 Monatsraten |
| 2 | Leasingverbindlichkeit 3.690.202 €; Verschuldungsgrad 3,42 | Faktor vorschüssig statt nachschüssig; C oder D mitgerechnet |
| 3 | Urteil: 11-Monats-Leasing trägt nicht (Laufzeit mit Optionen), Covenant neu verhandeln | nur Bilanzlogik, kein wirtschaftliches Argument |

**Für die Diskussion:** [one or two prompts if the class gets stuck; which position the minority
usually takes.]
```

## Word count check (narrative only)

Count the narrative between the block heading and the exhibit label, without tag line, table,
tasks and solutions:

```bash
python3 -I - tutorials/tut_04_leases.qmd <<'PY'
import re, sys
t = open(sys.argv[1], encoding="utf-8").read()
m = re.search(r"^## \S+ \d+[:.)] *(Kurzfall|Short case).*?$(.*?)^\*\*(Anlage|Exhibit)", t, re.S | re.M)
body = re.sub(r"^\*(Lernziele|Learning objectives):.*$", "", m.group(2), flags=re.M)
print(len(body.split()), "words")
PY
```

Limit: 400 (DE) / 450 (EN). Over the limit → cut background, never the decision or the stakes.
