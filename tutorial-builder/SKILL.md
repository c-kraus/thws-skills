---
name: tutorial-builder
description: "Create concise university exercise sheets (Übungsblätter) and single practice tasks as Quarto .qmd with toggleable solutions (show_solutions). Five task types: numerische Rechenaufgaben mit Teilfragen a)-x), Multiple Choice, Kurzszenario, Verständnis-/Transferfragen, Buchungssatz-/Normanwendung. Use whenever the user wants Übungsaufgaben, ein Übungsblatt, Tutorien-Material, Rechenaufgaben, Wiederholungsfragen, practice problems, oder 'Aufgaben zu Kapitel X' — auch ohne das Wort 'Übung'. NOT for: lange narrative Fallstudien (→ case-builder), komplette Klausuren mit Deckblatt und Punkten (→ exam-builder-skill), Moodle-XML-Quizfragen (→ moodle-questions). Trigger phrases: 'Übungsaufgaben erstellen', 'mach mir ein Übungsblatt', 'Aufgaben für das Tutorium', 'Rechenaufgaben zu', 'Altklausur-Aufgaben variieren', 'noch eine Aufgabe zu'."
---

# Tutorial Builder

Erzeugt knappe, pointierte Übungsaufgaben im Stil bewährter THWS-Übungsskripte — das Gegenteil des case-builders: **kein narrativer Bogen, max. 2–3 Sätze Kontext pro Aufgabe**, dann die Aufgabe. Die didaktische Strenge des case-builders (verifizierte Zahlen, vollständige Rechenwege, Lernziel-Abgleich) bleibt erhalten.

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
2. **Umfang**: Übungsblatt (Default: 5–10 Aufgaben) oder Einzelaufgabe(n) — bei Einzelaufgaben: in welche bestehende Datei einfügen?
3. **Aufgabentyp-Mix**: Default themengetrieben (Rechenthemen → überwiegend numerisch + 1–2 MC; Normthemen → Buchung/Norm + Verständnis); explizite Wünsche übernehmen
4. **Sprache**: aus Quelle ableiten, bei Ambiguität fragen

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

## Datei-Konventionen

Eine Datei, Aufgaben **und** Lösungen zusammen; Lösungen per Toggle:

```yaml
---
title: "[Kurs]"
subtitle: "Übung: [Thema]"
lang: de
author:
  - name: Prof. Dr. Christian Kraus
    email: christian.kraus@thws.de
    role: Program Lead
    affiliation: THWS Business & Engineering
format:
  handout-typst
show_solutions: false
---
```

Bewusst **ohne** `date`, `semester` und `version` — Übungsblätter werden über Jahrgänge wiederverwendet; ein Datum oder Semester im Kopf veraltet nur und stiftet bei Studierenden Verwirrung („ist das das aktuelle Blatt?").

`show_solutions: false` ist der **Standard** (Aufgabenblatt); das Lösungsblatt entsteht durch Rendern mit `-M show_solutions:true`. Dateiname: `uebung-{nn}-{topic-slug}.qmd` (lowercase, keine Umlaute), Ablage im Projektverzeichnis der Person oder `outputs/`.

## Aufgaben-Struktur

```markdown
## [Prägnanter Aufgabentitel — benennt das Konzept/Analysefeld]

[Kontext: max. 2–3 Sätze. Trockener Humor erwünscht — siehe Tonalität.]

a)  [Teilfrage]

b)  [Teilfrage]

::: {.content-visible when-meta="show_solutions"}
**Lösung [N]: [Aufgabentitel]**

[Vollständiger Lösungsweg — siehe Lösungsqualität]
:::
```

- H1 nur als Blatt-/Kapiteltitel (`# Übung: [Thema]`), H2 = eine Aufgabe. Keine tieferen Headings.
- Teilfragen `a) b) c)` — konsistent über das ganze Blatt, nie Bullet-Listen.
- Datentabellen **inline in der Aufgabe**, nie als Anhang am Ende (Lokalitätsprinzip aus dem case-builder).
- Lösungsnummer = Aufgabennummer; Titel identisch zum H2.
- Formeln in LaTeX-Math; **keine Währungssymbole in Mathblöcken** (Betrag als Zahl, „Euro" im Text — Konvention der gesamten Pipeline).

## Tonalität

Kontexte im Stil der bewährten Übungsskripte: trocken-ironisch, alltagsnah, in 2–3 Sätzen erledigt — Kevin-Marvins Sparbuch, die Kneipe „Specht", das zinslose Scheidungs-Darlehen als „Wiedereingliederungshilfe". Der Humor liegt im Szenario, nie in der Aufgabenstellung selbst; Zahlen und Fragen bleiben präzise. Kein Humor-Zwang: Eine MC-Faktenfrage braucht gar keinen Kontext. Keine realen, identifizierbaren Personen.

## Aufgabentypen

**1. Numerische Rechenaufgabe** (Brot und Butter): Kontext → gegebene Größen → Teilfragen a)–x) mit steigendem Anspruch innerhalb der Aufgabe. Spätere Teilfragen dürfen auf früheren aufbauen; dann muss jede Teilfrage auch mit dem Zwischenergebnis der Musterlösung lösbar sein (Folgefehler-Fairness).

**2. Multiple Choice** („Welche der folgenden Aussagen sind richtig?"): 5–7 Optionen, 1–3 korrekte, letzte Option stets „Alle Aussagen sind falsch". Distraktoren bilden **typische Missverständnisse** ab, keine Zufallsfehler. Lösung: alle Optionen wiederholen, korrekte **fett**, je 1 Satz Begründung bei nicht offensichtlichen.

**3. Kurzszenario**: 3–6 Sätze Sachverhalt (benannter Akteur, konkrete Zahlen), dann 2–4 Teilfragen, die den Sachverhalt aus verschiedenen Winkeln durcharbeiten. Kein Cut-off-Drama, keine offene Entscheidung — das ist case-builder-Territorium.

**4. Verständnis-/Transferfrage**: Offene Kurzantwort („Begründen Sie…", „Was ändert sich, wenn…"). Lösung nennt die erwarteten Kernpunkte als knappe Prosa — keine Bullet-Wüste — plus akzeptable Alternativargumentationen.

**5. Buchungssatz-/Normanwendung**: Sachverhalt → „Welcher Buchungssatz?" / „Nach welcher Norm und mit welchem Betrag?". Lösung: Buchungssatz in der Form `Konto Betrag an Konto Betrag` plus §-Referenz mit Absatz/Satz-Granularität.

## Schwierigkeitsprogression

Innerhalb **gleichartiger Themengebiete** staffeln: Die erste Aufgabe eines Konzepts prüft die Grundmechanik (eine Formel, direkte Anwendung), die folgenden kombinieren, variieren Randbedingungen oder kehren die Fragerichtung um (gegeben Ergebnis, gesucht Parameter). Faustregel fürs Blatt: ~30 % Grundmechanik, ~50 % Anwendung/Kombination, ~20 % Transfer/Umkehrung. Die schwerste Aufgabe eines Themas entspricht Klausurniveau.

## Lösungsqualität (derive, don't assert)

- **Jeder Rechenschritt sichtbar**: `(181.500 − 15.000) ÷ 8 = 20.812,50` — nie nur das Ergebnis. Gegebene Größen zu Beginn der Lösung benennen (`K₀ = …; i = …; n = …`).
- **Alternative Lösungswege** aufzeigen, wo sie didaktisch etwas zeigen (z. B. Einzelabzinsung vs. RBWF) — als „Lösungsweg 1 / Lösungsweg 2" oder „oder:". Nicht erzwingen; ein Weg genügt, wenn der zweite nur Fleißarbeit wäre.
- **Rundungskonvention** nennen, wenn Zwischenrundung das Ergebnis beeinflusst; akzeptable Ergebnisspannen angeben.
- Bei Normanwendung: §-Referenz, die die Studierenden lernen sollen, steht in der Lösung — nicht in der Aufgabe.

## Qualitätssicherung (vor dem Präsentieren, in dieser Reihenfolge)

**1. Python-Arithmetik-Check — für jede Zahl, ohne Ausnahme:** Für jedes Ergebnis und jedes Zwischenergebnis der Musterlösungen ein kurzes Python-Skript via Bash ausführen. Nicht mental verifizieren — rechnen. Tabellensummen nachsummieren. Eine falsche Zahl im Übungsblatt fällt erst im Tutorium auf — vor 40 Studierenden.

**2. Lernziel-Abgleich (wenn Vorlesungs-QMD bekannt):** Inline beim Formulieren jeder Aufgabe prüfen: Ist das Konzept in der Vorlesung eingeführt? Jeder Fachbegriff dort erklärt? Nur echte Lücken im finalen Output melden (⚠️ ein Satz pro Punkt).

**3. Self-Review-Checkliste (kein Subagent):**
- Deckt das Blatt den freigegebenen Aufgabenplan ab — kein Konzept stillschweigend entfallen?
- Jede Aufgabe self-contained — lösbar ohne Blättern, alle benötigten Daten in der Aufgabe?
- Teilfragen-Progression: bauen sie sinnvoll aufeinander auf, Folgefehler-fair?
- MC: genau die markierten Optionen korrekt? „Alle falsch"-Option vorhanden?
- Lösungsnummern und -titel stimmen mit den Aufgaben überein?
- Kontexte ≤3 Sätze (Kurzszenario ≤6)? Kein versehentlicher Fallstudien-Plot?
- `show_solutions`-Divs syntaktisch korrekt (`::: {.content-visible when-meta="show_solutions"}` … `:::`)?
- Schwierigkeitsprogression über das Blatt erkennbar?

Gefundene Probleme direkt beheben, dann speichern.

## Einzelaufgaben-Modus

Bei „noch eine Aufgabe zu X" in bestehende Datei: Numerierung fortführen, Stil und Schwierigkeitslücke des Blatts beachten (was fehlt — Grundmechanik oder Transfer?), per gezieltem Edit einfügen, Arithmetik-Check nur für die neue Aufgabe.

## Klausur-Export

Auf Wunsch („mach daraus Klausuraufgaben", „für die Klausur exportieren") ausgewählte Aufgaben für den `exam-builder-skill` aufbereiten: Humor-Kontexte auf sachlich straffen, Punktevorschlag je Teilfrage ergänzen (Faustregel: 1 Punkt pro Rechenschritt/Argument), und der Person die Übergabe an exam-builder anbieten — die exam-typst-Formatierung übernimmt dort der exam-builder, nicht dieser Skill.

## Output

Speichern, dann kompakt melden: Datei, Aufgabenzahl je Typ, Progression, Arithmetik-Check-Ergebnis (N Berechnungen ✅), ggf. ⚠️ aus dem Lernziel-Abgleich. Renderhinweis mitgeben:

```
quarto render uebung-03-rueckstellungen.qmd                          # Aufgabenblatt
quarto render uebung-03-rueckstellungen.qmd -M show_solutions:true   # Lösungsblatt
```
