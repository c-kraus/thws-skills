# `tutorial-typst` — Format-Spickzettel

In sich geschlossene Kurzreferenz für das Übungsblatt-Format. Verifiziert gegen die Extension
(`_extensions/c-kraus/tutorial/typst-template.typ` + `filter.lua`). Beispielblatt mit Lernziel-Zeilen
und Kurzfall: `~/Dev/10_Lehre/IFRS/tutorials/tut_04_leases.qmd`. Bei Konflikt gewinnt die Extension.

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
- `a) b)` nur als Fließtext-Feingliederung **innerhalb** eines `#### Task`.
- **Lernziel-Zeile** als erste Zeile jedes `## Aufgabe N:`-Blocks:
  `*Lernziele: 7, 8 · ca. 15 Minuten*` bzw. `*Learning objectives: 7, 8 · about 15 minutes*`.

## Seitenbudget

Der Umbruch vor jedem `## Label N:` ist ein „weicher" Seitenumbruch: jeder Block beginnt auf neuer
Seite. Angabenblatt-Seiten ≥ Zahl der Blöcke. Für ca. 4 Seiten: höchstens 4 Blöcke, jeder passt als
Angabe auf eine Seite (grob ≤ 450 Wörter inkl. einer Tabelle). Große Datentabellen nicht vor
Aufgabe 1 stellen, sondern in den Block, der sie braucht. Prüfen: `pdfinfo <datei>.pdf | grep Pages`.

## Typst-Fallen (Pandoc → Typst)

| Falle | Wirkung | Stattdessen |
|---|---|---|
| Getippte „…“ oder “…” | Pandoc macht das schließende Zeichen gerade; Typst setzt es als öffnendes: „Wort„ | Nur gerade `"…"` tippen; Typst setzt sie nach `lang` (de „…“, en “…”) |
| Zelle/Zeile beginnt mit `+ ` | Typst-Nummernliste („1. Zins") | `+36.000` ohne Leerzeichen, „zzgl. Zins", Vorzeichen in eigene Spalte |
| Zelle/Zeile beginnt mit `- ` | Typst-Aufzählung | echtes Minus `−` (U+2212), „abzgl.", `(10.000)` |
| Zelle/Zeile beginnt mit `= ` | Typst-Überschrift | „Summe", `**Summe**` |
| `\+` in Markdown | Pandoc entfernt den Backslash, Problem bleibt | siehe oben |

Fließtext-Absätze sind genauso betroffen wie Tabellenzellen, wenn sie mit diesen Zeichen beginnen.

## Extension-Version prüfen (vor dem ersten Blatt eines Projekts)

```bash
T=_extensions/c-kraus/tutorial/typst-template.typ
grep -c smartquote "$T"        # 0 → Apostrophe/Anführungszeichen in #### Task-Überschriften verschwinden
grep -n '("Dozent"' "$T"       # Treffer → Masthead zeigt auch bei lang: en „Modul/Dozent/Ausgabe"
```

Beide Fehler sind in der Kopie unter `~/Dev/10_Lehre/Finance_Master/_extensions/c-kraus/tutorial/`
behoben (Commit `f95e80a` und die `lang-de`-Abfrage der Masthead-Labels). Die Extension **nicht**
selbst ändern: Befund melden und bis zum Update Apostrophe und Anführungszeichen in
Task-Überschriften vermeiden. Das Task-Label selbst („Aufgabe"/„Task") folgt `lang` in allen Versionen.

## Lösungen (Quarto-nativ, kein Filter)

```markdown
::: {.content-visible when-meta="show_solutions"}
**Lösung:**

…Lösungsweg…

**Grading Notes:** …optional…
:::
```

Sichtbarkeit nur über `show_solutions`. **Keine** `.loesung`/`.aufgabe`-Divs.

## Ablage und Render

- `tutorials/tut_NN_slug.qmd`; Extension unter `_extensions/c-kraus/tutorial/` im Projekt-Root,
  in `tutorials/` als Symlink: `ln -s ../_extensions tutorials/_extensions` (keine Kopie).
- Render aus dem Ordner der Datei (`-o` akzeptiert nur einen Dateinamen). Reihenfolge einhalten:

```bash
cd tutorials
quarto render tut_04_leases.qmd --to tutorial-typst -M show_solutions:false -o tut_04_leases_questions.pdf
quarto render tut_04_leases.qmd --to tutorial-typst -M show_solutions:true     # → tut_04_leases.pdf
```

## Minimalbeispiel

```markdown
---
title: "Tutorium 07: Rückstellungen (IAS 37)"
subtitle: "Ansatz, Bewertung, Sonderfälle"
lang: de
author:
  - name: Prof. Dr. Christian Kraus
    email: christian.kraus@thws.de
    role: Lecturer
    affiliation: THWS Business & Engineering
course: "Rechnungslegung nach IFRS"
semester: "WS 2026/27"
sheet: "07"
date: last-modified
show_solutions: false
format: tutorial-typst
---

# Tutorium 07: Rückstellungen (IAS 37)

## Aufgabe 1: Ansatz und Bewertung

*Lernziele: 31, 32 · ca. 15 Minuten*

Die Specht GmbH wird wegen eines Produktfehlers verklagt. Die Rechtsabteilung schätzt die
Wahrscheinlichkeit einer Verurteilung auf 70 %, den wahrscheinlichen Betrag auf 80.000 Euro.

#### Task 1: Sind die Ansatzkriterien erfüllt?

Prüfen Sie die drei Ansatzkriterien.

::: {.content-visible when-meta="show_solutions"}
**Lösung:**

Alle drei Kriterien sind erfüllt (IAS 37.14): (1) gegenwärtige Verpflichtung aus vergangenem
Ereignis (Produktfehler), (2) wahrscheinlicher Abfluss (70 % > 50 %), (3) verlässlich schätzbar
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

::: {.content-visible when-meta="show_solutions"}
## Lernziel-Abdeckung

| Lernziel | Aufgaben |
|---|---|
| 31 Ansatzkriterien prüfen | 1.1 |
| 32 Rückstellungen bewerten | 1.2 |
:::
```
