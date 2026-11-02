# TRANSLATE-Modus — einen Kurs in eine zweite Sprache übertragen

Quellkurs (z. B. `~/Dev/10_Lehre/IFRS`, de) → Zielkurs in einem **eigenen Repo** (z. B. `~/Dev/10_Lehre/IFRS-EN`). Die Quelle ist inhaltlich führend; die Übersetzung ändert keinen Inhalt.

Warum Regeln vorab: Ohne gemeinsames Glossar entscheiden parallele Übersetzer jeder für sich (Länderboxen gelöscht oder ersetzt, „Worked Example" neben „Standard:", erfundene Abkürzungen) und müssen nachträglich angeglichen werden. Umgekehrt ist das Übersetzen die gründlichste Lesung des Quellkurses — es findet Fehler, die dorthin zurückgehören.

---

## Schritt 1 — Bestand und Zielkohorte

- Beide Repos lesen: `_curriculum.md`, `_quarto.yml`, `CLAUDE.md`. Fehlt das Zielcurriculum: `curriculum-architect` INIT mit gleicher Struktur, gleichen Lernziel-Nummern und eigener *Kohorte & Vorwissen* (die Zielkohorte kann mehr wissen → Grundlagenblöcke kürzen, Vertiefung und Tutorium bleiben gleich).
- 1:1 bleiben: Dateinamen, `{#sec-…}`-/`{#eq-…}`-/`{#tbl-…}`-Anker, Lernziel-Nummern, Widget-Dateinamen, Aufgabennummern.
- Umfang festlegen: Kapitel, Tutorien, Widgets, Moodle; Teaching Notes (bleiben oft in der Quellsprache und nur im Quellrepo).

## Schritt 2 — Glossar zuerst (Checkpoint, eine Freigabe)

`_glossary.md` im Zielrepo (Unterstrich: wird nicht gerendert). Vollständig **vor** dem Dispatch, gebaut aus einem Scan der Quelle: Terminologie-Konventionen, fett gesetzte Fachbegriffe, alle `####`-Elementtitel, Abkürzungen, Zahlenformate.

| Abschnitt | Inhalt |
|---|---|
| **Fachbegriffe** | Quelle → Ziel, mit Herkunft des Zielbegriffs (amtliche Fassung, z. B. Buchwert → *carrying amount*, GuV → *statement of profit or loss*) |
| **Abkürzungen** | je Abkürzung genau eine Zielform oder „ausschreiben"; keine Abkürzungen erfinden, die der Standard nicht verwendet |
| **Element-Labels** | Lernziel-Callout und Einleitungssatz („After this unit, students will be able to:"), `#### Story:`, `#### Deep Dive:`, Fall-/Lösungstitel, Beispiel-Label (eine Wahl, z. B. nur „Worked Example"), Tag-Zeile `*Learning objectives: 7, 8 · about 15 minutes*`, Verweis `**Practise it:** Tutorial N, Task M`, Aufgaben-Überschriften nach `tutorial-builder` |
| **Formate** | Zahlen (1.250.000 € → €1,250,000; T€ → €k; 8,6 % → 8.6%), Daten, Schreibvariante (z. B. britisch) |
| **Box-Regeln** | je länderspezifischem Boxtyp eine Regel, s. u. |

**Box-Regeln** (vom Autor einmal entschieden, nie je Kapitel vom Übersetzer):
- Länderspezifische Exkurse stehen in der Quelle als eigene `.details`-Box (z. B. „Exkurs: HGB").
- Default für die Zielfassung: **streichen**.
- **Verdichtet behalten**, wo ein Lernziel sie braucht (z. B. IFRS–HGB-Vergleich in Kap. 1).
- **Durch einen Satz ersetzen** nur, wo der Haupttext auf die Box Bezug nimmt.
- Jede Abweichung von der Box-Regel steht im Bericht des Übersetzers.

Glossar, Box-Regeln und Umfang zusammen vorlegen; eine Freigabe.

## Schritt 3 — Übersetzen (parallel möglich)

Je Kapitel ein Subagent (Kapitel + Tutorium + Widgets). Brief nach der Vorlage in `series-mode.md`, angepasst:
- Skills aufrufen für die **Form** in der Zielsprache: `quarto-lecture` (Quality Gate, Element-Syntax), `tutorial-builder` (Format-Regeln). Kein Neuschreiben des Inhalts.
- `_glossary.md` ist bindend; neue Begriffe nicht selbst festlegen, sondern unter `GLOSSAR-LÜCKEN` melden.
- Inhaltsfehler der Quelle **nicht** still in der Zielfassung korrigieren, sondern unter `SOURCE ERRORS` melden (Datei, Stelle, Fehler, Korrekturvorschlag) und vorerst 1:1 übersetzen.
- Bericht: Dateien · Box-Entscheidungen · GLOSSAR-LÜCKEN · SOURCE ERRORS.

Glossar-Lücken entscheidet die Orchestrierung einmal, trägt sie ins Glossar ein und gleicht alle Kapitel an.

## Schritt 4 — Strukturprüfung Quelle ↔ Ziel

Je Datei: Div-Zäune je Klasse, Überschriften je Ebene, Anker, iframes, Lernziel-Nummern. Unterschiede nur dort, wo eine Box-Regel oder ein laut Zielcurriculum gekürzter Grundlagenblock sie erklärt; jede andere Abweichung ist ein Übersetzungsfehler.

```bash
SRC=~/Dev/10_Lehre/IFRS; TGT=~/Dev/10_Lehre/IFRS-EN
for f in $(cd "$SRC" && ls [0-9][0-9]_*.qmd tutorials/tut_*.qmd); do
  for cls in details case-study solution flip-card quick-check drag-exercise widget callout; do
    s=$(grep -cE "^:{3,} *\{\.$cls" "$SRC/$f"); t=$(grep -cE "^:{3,} *\{\.$cls" "$TGT/$f")
    [ "$s" != "$t" ] && echo "$f  .$cls  $s → $t"
  done
  diff <(grep -oE '\{#(sec|eq|tbl|fig)-[^}]*\}' "$SRC/$f") \
       <(grep -oE '\{#(sec|eq|tbl|fig)-[^}]*\}' "$TGT/$f") >/dev/null || echo "$f  Anker weichen ab"
done
```

Dazu: verbotene Varianten aus dem Glossar im Zielrepo greppen (z. B. zweites Beispiel-Label, erfundene Abkürzungen); Zahlen je Datei vergleichen (nach Formatumstellung gleiche Werte). Dann Render-Check wie in `series-mode.md` Phase 5, im Zielrepo.

## Schritt 5 — Fehler zurück in die Quelle

`SOURCE ERRORS` zuerst **im Quellkurs** korrigieren (mit `accounting-qa` prüfen), dort committen (z. B. „Korrekturen aus der Übersetzung"), dann in die Zielfassung übernehmen. Nie nur im Ziel korrigieren. Die gefundenen Fehler im Abschlussbericht dem Autor nennen.

## Schritt 6 — Synchron halten

- Beide `_curriculum.md` (Zeile `**Sprache:**`) und beide `CLAUDE.md` nennen die jeweils andere Fassung: „Inhaltsänderungen dort nachziehen".
- Jede Inhaltsänderung in der Quelle (auch aus RE-REVIEW, SERIE-Konsistenzlauf oder Einzelkorrekturen) wird übertragen. Am Ende jedes Laufs, der die Quelle ändert, fragen: „Änderungen in [Zielrepo] nachziehen?"
- **Sync-Lauf** („Änderungen in die EN-Fassung übernehmen"): `git -C "$SRC" log <letzter-sync>..HEAD --stat -- '*.qmd' widgets/` → geänderte Stellen mit dem Glossar übertragen, Strukturprüfung für diese Dateien, im Ziel-Commit die gespiegelten Quell-Commits nennen („Mirror of abc1234"), damit der nächste Sync weiß, wo er beginnt.
