# `tutorial-typst` — Format-Spickzettel

In sich geschlossene Kurzreferenz für das Übungsblatt-Format. Verifiziert gegen die Extension
(`_extensions/tutorial/typst-template.typ` + `filter.lua`) und die Musterdatei
`tutorial-07-real-options.qmd`. Bei Konflikt gewinnt die Extension.

## Heading-Mechanik (was das Template aus den Headings macht)

| Quelle | Rendering |
|---|---|
| `# Titel` (1×, erste Body-Zeile) | **unsichtbar**; nur Level-Anker. Pflicht. Ohne H1 brechen alle Stile. |
| `## Aufgabe 1: Titel` (Label + Zahl + `:.)`) | oranges Nummern-Badge + Kicker-Label + **Seitenumbruch davor** (außer 1.) |
| `## Hinweise` (ohne „Wort N:") | schlichte Teal-Überschrift, **kein** Badge, **kein** Umbruch |
| `### Zwischentitel` | schlichte fette Zwischenüberschrift (Reserve, selten nötig) |
| `#### Task 1: Titel` (nur `Task`/`Aufgabe`) | Teilaufgaben-Kopf; Label folgt `lang` (de→„Aufgabe", en→„Task") |
| `#### Task 2: Titel [4 P]` | wie oben + Punkte-Pille rechts (`[4]`, `[4 Punkte]`, `[4 pts]` ebenso) |

- **Badge-Regex** (H2): `^\s*(.+?)\s+(\d+)\s*[:.)]\s*(.*)$` → Label / Nummer / Resttitel.
- **Punkte-Regex** (am `####`-Zeilenende): `\s*\[\s*(\d+)\s*(?:P|Punkte?|points?|pts)?\s*\]\s*$`.
- `a) b)` nur als Fließtext-Feingliederung **innerhalb** eines `#### Task`, nie auf Teilaufgaben-Ebene.

## Lösungen (Quarto-nativ, kein Filter)

```markdown
::: {.content-visible when-meta="show_solutions"}
**Lösung:**

…Lösungsweg…

**Grading Notes:** …optional…
:::
```

Sichtbarkeit nur über `show_solutions`. **Keine** `.loesung`/`.aufgabe`-Divs — die existieren
nicht mehr.

## Render

```bash
quarto render blatt.qmd --to tutorial-typst                        # Angabe (keine Lösungen)
quarto render blatt.qmd --to tutorial-typst -M show_solutions:true # mit Lösungen
```

Datei muss in einem Projekt mit `_extensions/tutorial/` liegen.

## Minimalbeispiel

```markdown
---
title: "Rückstellungen nach IAS 37"
subtitle: "Ansatz, Bewertung, Sonderfälle"
lang: de
author:
  - name: Prof. Dr. Christian Kraus
    email: christian.kraus@thws.de
    role: Lecturer
    affiliation: THWS Business & Engineering
course: "Internationale Rechnungslegung"
semester: "WS 2025/26"
sheet: "03"
date: last-modified
show_solutions: false
format: tutorial-typst
---

# Rückstellungen nach IAS 37

## Aufgabe 1: Ansatz dem Grunde nach

Die Specht GmbH wird wegen eines Produktfehlers verklagt. Die Rechtsabteilung schätzt die
Wahrscheinlichkeit einer Verurteilung auf 70 %, den wahrscheinlichen Betrag auf 80.000 Euro.

#### Task 1: Sind die Ansatzkriterien erfüllt?

Prüfen Sie die drei Ansatzkriterien des IAS 37.14.

::: {.content-visible when-meta="show_solutions"}
**Lösung:**

Alle drei Kriterien sind erfüllt: (1) gegenwärtige Verpflichtung aus vergangenem Ereignis
(Produktfehler), (2) wahrscheinlicher Abfluss (70 % > 50 %), (3) verlässlich schätzbar
(80.000 Euro). → Rückstellung ist anzusetzen.

**Grading Notes:** alle drei Kriterien benannt und auf den Sachverhalt bezogen.
:::

#### Task 2: Bewertung der Höhe nach

Mit welchem Betrag ist die Rückstellung anzusetzen — und warum nicht mit dem Erwartungswert?

::: {.content-visible when-meta="show_solutions"}
**Lösung:**

Bei einer **Einzelverpflichtung** ist der *best estimate* (wahrscheinlichster Wert),
nicht der Erwartungswert anzusetzen: **80.000 Euro** (IAS 37.40). Der Erwartungswert gilt
nur bei einer großen Grundgesamtheit gleichartiger Verpflichtungen (IAS 37.39).
:::

## Hinweise

Werte stets vor Steuern; Abzinsung hier vernachlässigt (kurze Frist).
```
