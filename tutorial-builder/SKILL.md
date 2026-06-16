---
name: tutorial-builder
description: "Create concise university exercise sheets (Übungsblätter) and single practice tasks as Quarto .qmd in the tutorial-typst format (single source: PDF question sheet + PDF with solutions from one file, toggled via show_solutions). Structure: few large `## Aufgabe N:` problem blocks with `#### Task N:` subtasks; five task types: numerische Rechenaufgaben, Multiple Choice, Kurzszenario, Verständnis-/Transferfragen, Buchungssatz-/Normanwendung. Use whenever the user wants Übungsaufgaben, ein Übungsblatt, Tutorien-Material, Rechenaufgaben, Wiederholungsfragen, practice problems, worksheet, oder 'Aufgaben zu Kapitel X' — auch ohne das Wort 'Übung'. NOT for: lange narrative Fallstudien (→ case-builder), komplette Klausuren mit Deckblatt und Punkten (→ exam-builder-skill), Moodle-XML-Quizfragen (→ moodle-questions). Trigger phrases: 'Übungsaufgaben erstellen', 'mach mir ein Übungsblatt', 'Tutorial-Blatt', 'Aufgaben für das Tutorium', 'Rechenaufgaben zu', 'Altklausur-Aufgaben variieren', 'noch eine Aufgabe zu', 'worksheet'."
---

# Tutorial Builder

Erzeugt knappe, pointierte Übungsaufgaben im Stil bewährter THWS-Übungsskripte — das Gegenteil des case-builders: **kein narrativer Bogen, max. 2–3 Sätze Kontext pro Aufgabe**, dann die Aufgabe. Die didaktische Strenge des case-builders (verifizierte Zahlen, vollständige Rechenwege, Lernziel-Abgleich) bleibt erhalten.

Output ist **eine** `.qmd` im `tutorial-typst`-Format (Single Source): aus derselben Datei rendert das Angabenblatt (ohne Lösungen) und — mit `-M show_solutions:true` — das Lösungsblatt. Die genauen Format-Regeln stehen unten unter „Harte Format-Regeln"; ein kompakter Spickzettel mit Minimalbeispiel liegt in [references/format-cheatsheet.md](references/format-cheatsheet.md).

## Abgrenzung

| Bedarf | Skill |
|---|---|
| Übungsblatt, Einzelaufgaben, Tutorienmaterial | **tutorial-builder** (dieser Skill) |
| Narrative Fallstudie mit Protagonist und Diskussionsplan | `case-builder` |
| Klausur mit Deckblatt, Punktesummen, exam-typst | `exam-builder-skill` — tutorial-builder-Aufgaben sind dorthin exportierbar (siehe „Klausur-Export") |
| Moodle-XML-Quiz | `moodle-questions` |

## Intake (eine Nachricht, nicht tröpfeln)

Aus Kontext ziehen, was schon klar ist; nur Fehlendes fragen:

1. **Thema/Kapitel** und **Quelle**: Vorlesungs-QMD (Pfad), Notizen, oder bestehende Aufgaben als Stil-/Variationsvorlage
2. **Umfang**: Übungsblatt (Default: 5–10 Aufgaben/Teilaufgaben) oder Einzelaufgabe(n) — bei Einzelaufgaben: in welche bestehende Datei einfügen?
3. **Aufgabentyp-Mix**: Default themengetrieben (Rechenthemen → überwiegend numerisch + 1–2 MC; Normthemen → Buchung/Norm + Verständnis); explizite Wünsche übernehmen
4. **Sprache** (`lang`): aus Quelle ableiten, bei Ambiguität fragen — steuert Logo, Eyebrow, Datumsformat und die `#### Task`-/Punkte-Labels
5. **Punkte?** Default **nein** (siehe „Punkte"). Nur bei ausdrücklichem Wunsch nach Klausurnähe einplanen.
6. **Kopf-Metadaten**: `course`, `semester`, `sheet`-Nummer — aus Kontext ziehen, sonst knapp erfragen oder Platzhalter setzen.

## Aufgabenplan — Checkpoint vor dem Schreiben (Pflicht bei Übungsblättern)

Nach dem Intake, **bevor** eine einzige Aufgabe geschrieben wird:

1. **Konzept-Inventar aus der Quelle extrahieren:** Welche prüfbaren Konzepte enthält das Kapitel? (Definitionen, Ansatzkriterien, Bewertungsregeln, Rechenverfahren, Sonderfälle, Abgrenzungen.) Vollständig listen — gerade die unscheinbaren Sonderfälle (z. B. *best estimate* bei Einzelverpflichtung vs. Erwartungswert bei großer Grundgesamtheit) sind oft die klausurrelevantesten.
2. **Plan vorlegen** in kompakter Tabellenform:

> | # | Konzept | Aufgabentyp | Niveau |
> |---|---|---|---|
> | 1 | [Konzept] | MC | Grundmechanik |
> | … | | | |
>
> **Nicht eingeplant:** [Konzepte aus dem Inventar, die kein Aufgaben-Slot abdeckt — mit einem Wort Begründung]
>
> Passt die Auswahl — oder soll etwas dazu, raus, oder anders gewichtet werden?

3. **Auf Antwort warten.** Erst nach Freigabe (oder Anpassung) schreiben. Die Person kennt ihre Klausurschwerpunkte und Kohorten-Schwächen — dieser Checkpoint ist billiger als ein verworfenes Blatt.

Bei **Einzelaufgaben** entfällt der Checkpoint — dort ist das Konzept ja schon benannt.

## Harte Format-Regeln (sonst greifen die Stile der Extension nicht)

Diese Regeln sind gegen die `tutorial-typst`-Extension verifiziert. Strikt einhalten.

1. **Erste Body-Zeile MUSS `# <Titel>` sein** (H1), Titeltext **identisch zu `title:`** im YAML. Der H1 erscheint nicht im Text (der Masthead zeigt den Titel), **verankert aber die Heading-Level**. Ohne H1 schiebt Quarto alle Level um eins hoch und Badges/Stile brechen.
2. **Große Aufgabe / Aufgabenblock = `## Label N: Titel`** → bekommt automatisch ein oranges Nummern-Badge + Kicker (= „Label") + **Seitenumbruch davor** (außer beim ersten). Label frei wählbar (`Aufgabe`, `Case Study`, `Fallstudie`, …), Label und Nummer werden geparst. Das Template erwartet das Muster `Label<Leerzeichen>Zahl<Trenner :.)>Resttitel`, z. B. `## Aufgabe 1: Rückstellungen ansetzen`.
3. **Info-/Zwischenabschnitt = `## Titel` ohne „Wort N:"** → schlichte Überschrift, **kein** Badge, **kein** Umbruch (z. B. `## Hinweise`, `## When to Use Which Method?`). Gut für Vorbemerkungen, Formelsammlung, Übersicht.
4. **Teilaufgabe = `#### Task N: Titel`** (oder `#### Aufgabe N: …`) — H4. Nur die Wörter `Task`/`Aufgabe` werden erkannt; das **gerenderte Label folgt `lang`** (de → „Aufgabe", en → „Task"), unabhängig vom geschriebenen Wort. Kontext/Angabe stehen **direkt unter der `##` bzw. `####`** — kein Zwischen-`###` nötig (`###` ist Reserve und rendert nur als schlichte fette Zwischenüberschrift).
5. **`a) b)` nur zur Feingliederung INNERHALB eines Tasks** — als Fließtext-Unterpunkte, wenn ein einzelner `#### Task` mehrere eng zusammengehörige Mini-Fragen hat. Die Teilaufgaben-Ebene selbst ist immer `#### Task N:`, nicht `a) b) c)`.
6. **Lösung pro Teilaufgabe** in einen nativen Quarto-Block direkt nach dem `####`-Text:
   ```
   ::: {.content-visible when-meta="show_solutions"}
   **Lösung:** …

   **Grading Notes:** … (optional, Korrekturhilfe)
   :::
   ```
   Beginne mit `**Lösung:**` (de) bzw. `**Solution:**` (en). Sichtbarkeit allein über `show_solutions` (YAML oder `-M show_solutions:true`). **KEINEN** Filter/Div wie `.loesung`/`.aufgabe` verwenden — die gibt es in dieser Extension nicht mehr.

## Punkte — standardmäßig WEGLASSEN

- **Default: keine Punkte.** Übungsblätter entstehen in der Regel ohne Punktangaben.
- Nur wenn die Person ausdrücklich Punkte/Klausurnähe will: Punkte am **Ende der `####`-Zeile** in eckigen Klammern, z. B. `#### Task 2: Barwert berechnen [4 P]`. Das rendert als Pille; `[4]`, `[4 Punkte]`, `[4 pts]` werden ebenfalls erkannt. Dann **konsequent bei allen Teilaufgaben** setzen. (Eine reine Korrekturhilfe ohne Pille gehört in die `**Grading Notes:**` der Lösung.)

## Datei-Konventionen

Eine Datei, Aufgaben **und** Lösungen zusammen; Lösungen per Toggle. YAML-Kopf:

```yaml
---
title: "[Titel]"                  # identisch zur ersten H1 im Body
subtitle: "[Untertitel]"
lang: de                          # de oder en — Logo, Eyebrow, Datum, Task-/P-Label
author:
  - name: Prof. Dr. Christian Kraus
    email: christian.kraus@thws.de
    role: Lecturer
    affiliation: THWS Business & Engineering
course: "[Modul]"                 # Masthead MODUL + Kopfzeile links
semester: "[z. B. WS 2025/26]"    # Kopfzeile rechts
sheet: "[Nr., z. B. 03]"          # Eyebrow „… · Nr. 03"
date: last-modified
show_solutions: false
format: tutorial-typst
---
```

- **Logo-Pfade NICHT angeben** — die Extension löst sie selbst auf.
- `date: last-modified` aktualisiert sich beim Rendern selbst; `semester` benennt den Jahrgang explizit. (Das frühere bewusste Weglassen von Datum/Semester entfällt mit diesem Format — beide Felder werden vom Template aktiv genutzt.)
- `show_solutions: false` ist der **Standard** (Angabenblatt); das Lösungsblatt entsteht durch Rendern mit `-M show_solutions:true`.
- Dateiname: `tutorial-{nn}-{topic-slug}.qmd` bzw. `uebung-{nn}-{topic-slug}.qmd` (lowercase, keine Umlaute), Ablage im Projektverzeichnis der Person oder `outputs/`.
- Die Datei muss in einem Projekt liegen, das die Extension unter `_extensions/tutorial/` enthält (z. B. aus `99_Templates/thwsII_quarto/` übernehmen), sonst schlägt das Rendern fehl.

## Aufgaben-Struktur

```markdown
# [Titel]                         <- Pflicht-H1, identisch zu title:, unsichtbar

## Aufgabe 1: [Konzept/Analysefeld benennen]

[Kontext: max. 2–3 Sätze. Trockener Humor erwünscht — siehe Tonalität.]
[Gegebene Größen / Datentabelle inline, falls nötig.]

#### Task 1: [Teilaufgabe]

[Aufgabenstellung. Bei Feingliederung optional a) … b) … als Fließtext-Unterpunkte.]

::: {.content-visible when-meta="show_solutions"}
**Lösung:**

[Vollständiger Lösungsweg — siehe Lösungsqualität.]

**Grading Notes:** [optional, Korrekturhilfe]
:::

#### Task 2: [Teilaufgabe, baut ggf. auf Task 1 auf]

…

::: {.content-visible when-meta="show_solutions"}
**Lösung:** …
:::
```

- **Wenige `## Aufgabe N:` (Themen-/Aufgabenblöcke), darunter mehrere `#### Task N:`.** Jede `## Aufgabe N:` erzeugt einen Seitenumbruch — kurze Faktenfragen also nicht je in ein eigenes `##` zwängen, sondern unter einem gemeinsamen Block als `#### Task` bündeln.
- Datentabellen **inline in der Aufgabe**, nie als Anhang am Ende (Lokalitätsprinzip aus dem case-builder).
- Formeln in LaTeX-Math (`$…$` / `$$…$$`); **keine Währungssymbole in Mathblöcken** (Betrag als Zahl, „Euro" im Text — Konvention der gesamten Pipeline).
- Mathe, Tabellen, Code-Blöcke und Hinweis-Zitate (`>`) rendern korrekt und sind erwünscht, wo sie didaktisch tragen.

## Tonalität

Kontexte im Stil der bewährten Übungsskripte: trocken-ironisch, alltagsnah, in 2–3 Sätzen erledigt — Kevin-Marvins Sparbuch, die Kneipe „Specht", das zinslose Scheidungs-Darlehen als „Wiedereingliederungshilfe". Der Humor liegt im Szenario, nie in der Aufgabenstellung selbst; Zahlen und Fragen bleiben präzise. Kein Humor-Zwang: Eine MC-Faktenfrage braucht gar keinen Kontext. Keine realen, identifizierbaren Personen.

## Aufgabentypen

Ein Aufgabentyp füllt je nach Umfang einen ganzen `## Aufgabe N:`-Block oder einzelne `#### Task N:` darunter.

**1. Numerische Rechenaufgabe** (Brot und Butter): Kontext + gegebene Größen unter der `## Aufgabe`, dann `#### Task`-Teilaufgaben mit steigendem Anspruch. Spätere Tasks dürfen auf früheren aufbauen; dann muss jeder Task auch mit dem Zwischenergebnis der Musterlösung lösbar sein (Folgefehler-Fairness).

**2. Multiple Choice** („Welche der folgenden Aussagen sind richtig?"): 5–7 Optionen, 1–3 korrekte, letzte Option stets „Alle Aussagen sind falsch". Distraktoren bilden **typische Missverständnisse** ab, keine Zufallsfehler. Lösung: alle Optionen wiederholen, korrekte **fett**, je 1 Satz Begründung bei nicht offensichtlichen. Passt gut als einzelner `#### Task` oder als eigener kleiner Block.

**3. Kurzszenario**: 3–6 Sätze Sachverhalt (benannter Akteur, konkrete Zahlen) unter der `## Aufgabe`, dann 2–4 `#### Task`, die den Sachverhalt aus verschiedenen Winkeln durcharbeiten. Kein Cut-off-Drama, keine offene Entscheidung — das ist case-builder-Territorium.

**4. Verständnis-/Transferfrage**: Offene Kurzantwort („Begründen Sie…", „Was ändert sich, wenn…"). Lösung nennt die erwarteten Kernpunkte als knappe Prosa — keine Bullet-Wüste — plus akzeptable Alternativargumentationen.

**5. Buchungssatz-/Normanwendung**: Sachverhalt → „Welcher Buchungssatz?" / „Nach welcher Norm und mit welchem Betrag?". Lösung: Buchungssatz in der Form `Konto Betrag an Konto Betrag` plus §-Referenz mit Absatz/Satz-Granularität.

## Schwierigkeitsprogression

Innerhalb **gleichartiger Themengebiete** staffeln: Der erste Task eines Konzepts prüft die Grundmechanik (eine Formel, direkte Anwendung), die folgenden kombinieren, variieren Randbedingungen oder kehren die Fragerichtung um (gegeben Ergebnis, gesucht Parameter). Faustregel fürs Blatt: ~30 % Grundmechanik, ~50 % Anwendung/Kombination, ~20 % Transfer/Umkehrung. Der schwerste Task eines Themas entspricht Klausurniveau.

## Lösungsqualität (derive, don't assert)

- **Jeder Rechenschritt sichtbar**: `(181.500 − 15.000) ÷ 8 = 20.812,50` — nie nur das Ergebnis. Gegebene Größen zu Beginn der Lösung benennen (`K₀ = …; i = …; n = …`).
- **Alternative Lösungswege** aufzeigen, wo sie didaktisch etwas zeigen (z. B. Einzelabzinsung vs. RBWF) — als „Lösungsweg 1 / Lösungsweg 2" oder „oder:". Nicht erzwingen; ein Weg genügt, wenn der zweite nur Fleißarbeit wäre.
- **Rundungskonvention** nennen, wenn Zwischenrundung das Ergebnis beeinflusst; akzeptable Ergebnisspannen angeben.
- Bei Normanwendung: §-Referenz, die die Studierenden lernen sollen, steht in der Lösung — nicht in der Aufgabe.
- **`**Grading Notes:**`** am Ende eines Lösungs-Divs sind optional und tragen die Korrekturhilfe (worauf bei der Bewertung zu achten ist) — gerade nützlich, wenn keine Punkte-Pillen gesetzt sind.

## Qualitätssicherung (vor dem Präsentieren, in dieser Reihenfolge)

**1. Python-Arithmetik-Check — für jede Zahl, ohne Ausnahme:** Für jedes Ergebnis und jedes Zwischenergebnis der Musterlösungen ein kurzes Python-Skript via Bash ausführen. Nicht mental verifizieren — rechnen. Tabellensummen nachsummieren. Eine falsche Zahl im Übungsblatt fällt erst im Tutorium auf — vor 40 Studierenden.

**2. Lernziel-Abgleich (wenn Vorlesungs-QMD bekannt):** Inline beim Formulieren jeder Aufgabe prüfen: Ist das Konzept in der Vorlesung eingeführt? Jeder Fachbegriff dort erklärt? Nur echte Lücken im finalen Output melden (⚠️ ein Satz pro Punkt).

**3. Self-Review-Checkliste (kein Subagent):**
- **Erste Body-Zeile ist `# <Titel>`** (H1), identisch zu `title:`?
- `## Label N: Titel` korrekt geformt (Label + Zahl + Trenner `:.)`), sodass das Badge greift?
- Reine Info-Abschnitte ohne „Wort N:" (kein versehentliches Badge/Umbruch)?
- Teilaufgaben als `#### Task N:` (nicht als a)-Liste auf Teilaufgaben-Ebene)?
- Deckt das Blatt den freigegebenen Aufgabenplan ab — kein Konzept stillschweigend entfallen?
- Jede Aufgabe self-contained — lösbar ohne Blättern, alle benötigten Daten in der Aufgabe?
- Task-Progression: bauen sie sinnvoll aufeinander auf, Folgefehler-fair?
- MC: genau die markierten Optionen korrekt? „Alle falsch"-Option vorhanden?
- Pro `#### Task` ein Lösungs-Div, Syntax korrekt (`::: {.content-visible when-meta="show_solutions"}` … `:::`)?
- Keine Punkte-Pillen — außer Punkte wurden explizit gewünscht, dann konsequent bei allen Tasks?
- Kontexte ≤3 Sätze (Kurzszenario ≤6)? Kein versehentlicher Fallstudien-Plot?
- Schwierigkeitsprogression über das Blatt erkennbar?

Gefundene Probleme direkt beheben, dann speichern.

## Einzelaufgaben-Modus

Bei „noch eine Aufgabe zu X" in bestehende Datei: Numerierung der `## Aufgabe N:` bzw. `#### Task N:` fortführen, Stil und Schwierigkeitslücke des Blatts beachten (was fehlt — Grundmechanik oder Transfer?), per gezieltem Edit einfügen, Arithmetik-Check nur für die neue Aufgabe. Format-Regeln (H1 bleibt unberührt, Lösungs-Div pro Task) einhalten.

## Klausur-Export

Auf Wunsch („mach daraus Klausuraufgaben", „für die Klausur exportieren") ausgewählte Aufgaben für den `exam-builder-skill` aufbereiten: Humor-Kontexte auf sachlich straffen, Punktevorschlag je Teilaufgabe ergänzen (Faustregel: 1 Punkt pro Rechenschritt/Argument), und der Person die Übergabe an exam-builder anbieten — die exam-typst-Formatierung übernimmt dort der exam-builder, nicht dieser Skill.

## Output

Speichern, dann kompakt melden: Datei, Aufgabenzahl je Typ, Progression, Arithmetik-Check-Ergebnis (N Berechnungen ✅), ggf. ⚠️ aus dem Lernziel-Abgleich. Renderhinweis mitgeben:

```
quarto render tutorial-03-rueckstellungen.qmd --to tutorial-typst                        # Angabenblatt
quarto render tutorial-03-rueckstellungen.qmd --to tutorial-typst -M show_solutions:true # Lösungsblatt
```
