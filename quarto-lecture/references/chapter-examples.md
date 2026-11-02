# Chapter Structure Example

This is a minimal but complete example of a well-structured chapter opening in **Standalone Mode**. It demonstrates: frontmatter, the learning-objective callout, prose opening, a flip-card cluster, a details excursus, an inline case study, a formula, and a closing quick-check. In **Book Mode** the YAML block is dropped and the H1 is followed by an italic subtitle line (`references/book-mode.md`); for a complete book chapter see `~/Dev/10_Lehre/BUA1/03_transactions.qmd`.

---

```markdown
---
title: "Accounting"
subtitle: "Provisions and Contingent Liabilities"
date: last-modified
lang: de
toc-depth: 1
author:
  - name: Prof. Dr. Christian Kraus
    email: christian.kraus@thws.de
    role: Program Lead
    affiliation: THWS Business & Engineering
format:
  moodle-html
---

# Rückstellungen und ungewisse Verbindlichkeiten

::: {.callout-tip title="Lernziele"}
Nach diesem Kapitel können die Studierenden:

- Rückstellungen von Verbindlichkeiten und Eventualverbindlichkeiten abgrenzen (Lernziel 12),
- eine Rückstellung nach § 253 Abs. 1 Satz 2 HGB bewerten und abzinsen (Lernziel 13).
:::

Bilanzen lügen nicht — aber sie verschweigen gerne. Rückstellungen sind der Bereich, in dem kaufmännische Vorsicht auf juristische Unschärfe trifft: Eine Verbindlichkeit existiert, ihr Betrag oder ihr Fälligkeitszeitpunkt steht jedoch noch nicht fest. Wer diesen Mechanismus versteht, liest Jahresabschlüsse anders.

## Begriffliche Grundlagen

::: {.flip-card}
#### Rückstellung (Provision)
Passivposten für Verbindlichkeiten, die dem Grunde oder der Höhe nach ungewiss sind (§ 249 HGB). Abzugrenzen von Verbindlichkeiten (Grund und Höhe sicher) und Eventualverbindlichkeiten (nur im Anhang).
:::

::: {.flip-card}
#### Vorsichtsprinzip
Das übergeordnete Prinzip der HGB-Rechnungslegung (§ 252 Abs. 1 Nr. 4 HGB): Verluste werden antizipiert, Gewinne erst bei Realisierung erfasst.
:::

Das Vorsichtsprinzip ist nicht Pessimismus, sondern Gläubigerschutz — eine strukturelle Entscheidung des deutschen Gesetzgebers gegen das angelsächsische Fair-Value-Denken.

::: {.details}
#### Exkurs: § 249 Abs. 1 HGB — Passivierungspflicht

Für Rückstellungen gilt nach § 249 Abs. 1 HGB eine **Passivierungspflicht** (nicht nur ein Wahlrecht) bei:

- ungewissen Verbindlichkeiten gegenüber Dritten,
- drohenden Verlusten aus schwebenden Geschäften,
- unterlassenen Instandhaltungen (nachgeholt innerhalb von 3 Monaten des Folgejahres),
- Abraumbeseitigung (nachgeholt im Folgejahr).

Das Passivierungswahlrecht des alten Rechts wurde durch das BilMoG 2009 weitgehend abgeschafft.
:::

## Bewertung

Die Bewertung ist keine Schätzung ins Blaue: § 253 Abs. 1 Satz 2 HGB verlangt den **nach vernünftiger kaufmännischer Beurteilung notwendigen Erfüllungsbetrag** — inklusive Preissteigerungen bis zum Erfüllungszeitpunkt. Bei Laufzeiten über einem Jahr ist der Barwertansatz Pflicht.

$$
\text{Barwert} = \frac{E}{(1 + i)^n}
$$

wobei $E$ der Erfüllungsbetrag, $i$ der Abzinsungssatz (§ 253 Abs. 2 HGB: 7-Jahres-Durchschnitt der Bundesbank), und $n$ die Restlaufzeit in Jahren.

::: {.drag-exercise}
Der Erfüllungsbetrag ist der Betrag, der zur *Erfüllung der Verpflichtung* voraussichtlich *aufgewendet* werden muss.
:::

## Praxis: Die Müller GmbH

::: {.case-study}
#### Case: Garantierückstellung vergessen

Die Müller GmbH verkauft im Dezember Maschinen mit zweijähriger Garantie. Der Buchhalter erfasst keine Rückstellung, da noch kein Schadensfall gemeldet wurde.

::: {.solution}
**Fehler:** § 249 Abs. 1 HGB schreibt die Passivierung einer Garantierückstellung **unabhängig vom Eintritt eines konkreten Schadensfalls** vor. Maßstab ist die Eintrittswahrscheinlichkeit auf Basis der Erfahrungswerte (z. B. 2 % der Umsätze). Der Abschluss verletzt das Vollständigkeitsprinzip (§ 246 Abs. 1 HGB).
:::
:::

::: {.quick-check}
Welche Aussage ist korrekt?

- Rückstellungen dürfen nur gebildet werden, wenn der Schadensfall bereits eingetreten ist.
- **Rückstellungen sind für ungewisse Verbindlichkeiten zu passivieren, auch ohne konkreten Schadensfall.**
- Das Vorsichtsprinzip erlaubt beliebig hohe Rückstellungen als stilles Polster.
:::
```

---

## Key observations from this example

- The learning-objective callout comes first, with the course-wide numbers from `_curriculum.md` (`references/chapter-patterns.md` §1).
- The opening paragraph has no heading — it flows directly into the topic.
- Flip-cards appear in a cluster for closely related concepts, then prose resumes.
- The `details` excursus handles §-level legal depth without disrupting the main argument.
- The display formula uses `$$...$$` with variable definitions immediately following.
- The `drag-exercise` reinforces the formula's key terminology.
- The excerpt ends with a `quick-check` — no summary paragraph (Standalone Mode; a Book Mode chapter may close with a short summary).
- The formula section is a Norm section, not a Method section; a section that introduces a tool follows the Method pattern in `references/element-placement.md` (everyday question first, derivation in a Deep Dive, tutorial pointer last).
- Element count: 5 interactive elements (2 flip-cards, 1 drag-exercise, 1 case-study, 1 quick-check) across ~500 words — about one per 100 words. That density only demonstrates the syntax; a real chapter keeps one per 400–600 words (`references/qmd-quality-gate.md` §14).