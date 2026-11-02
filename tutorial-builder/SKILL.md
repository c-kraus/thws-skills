---
name: tutorial-builder
description: "Creates concise university exercise sheets (Übungsblätter) and single tasks as Quarto .qmd in tutorial-typst format (one source, PDF question sheet + PDF with solutions via show_solutions). Plans from the chapter's learning objectives in _curriculum.md: LO tag line per task, coverage table, time budget for a 90-minute session. Few large `## Aufgabe N:` blocks with `#### Task N:` subtasks; task types: Rechenaufgabe, Multiple Choice, Kurzszenario, Verständnis-/Transferfrage, Buchungssatz-/Normanwendung, Kurzfall (via case-builder). Series mode for all sheets of a course. Use for Übungsaufgaben, Übungsblatt, Tutorien-Material, Rechenaufgaben, Wiederholungsfragen, practice problems, worksheet, 'Aufgaben zu Kapitel X', 'Tutorien für alle Kapitel', 'Altklausur-Aufgaben variieren', 'noch eine Aufgabe zu', also without the word 'Übung'. NOT for long narrative cases (case-builder), full exams (exam-builder-skill) or Moodle XML (moodle-questions)."
---

# Tutorial Builder

Erzeugt knappe, pointierte Übungsaufgaben im Stil bewährter THWS-Übungsskripte — das Gegenteil der langen Fallstudie: **kein narrativer Bogen, max. 2–3 Sätze Kontext pro Aufgabe**, dann die Aufgabe. Einzige Ausnahme ist der Kurzfall (Typ 6). Das Blatt bildet die **Lernziele des Kapitels** ab, nicht bloß seine Konzepte; die Zahlen sind verifiziert, die Rechenwege vollständig.

Output ist **eine** `.qmd` im `tutorial-typst`-Format (Single Source): aus derselben Datei rendert das Angabenblatt (ohne Lösungen) und — mit `-M show_solutions:true` — das Lösungsblatt. Die Format-Regeln stehen unten unter „Harte Format-Regeln"; Spickzettel mit Minimalbeispiel, Typst-Fallen und Prüfbefehlen: [references/format-cheatsheet.md](references/format-cheatsheet.md). Vorlagen für Aufgabenplan, Abdeckungstabelle und Serienplan: [references/plan-templates.md](references/plan-templates.md).

## Abgrenzung

| Bedarf | Skill |
|---|---|
| Übungsblatt, Einzelaufgaben, Tutorienmaterial | **tutorial-builder** (dieser Skill) |
| Kurzfall (≤ 400 Wörter, eine Entscheidung, ca. 30 Minuten) als Block im Blatt | Erzählteil nach `case-builder`, Modus **Kurzfall**; eingebettet hier als Typ 6 |
| Lange Fallstudie (1.500–3.000 Wörter, 90 Minuten) mit Diskussionsplan | `case-builder`, Modus Langfall |
| Klausur mit Deckblatt, Punktesummen, exam-typst | `exam-builder-skill` — Aufgaben sind dorthin exportierbar (siehe „Klausur-Export") |
| Moodle-XML-Quiz | `moodle-questions` |

## Intake (eine Nachricht, nicht tröpfeln)

Zuerst die Kursdateien lesen, falls vorhanden — sie beantworten die meisten Fragen:

- **`_curriculum.md`**: Lernziele des Kapitels (kursweit durchnummeriert, LZ 1 … N), **Lehrformat** (Präsenzzeit je Sitzung), **Kohorte & Vorwissen** (was bekannt ist, wird nicht noch einmal geübt).
- **`_running_case.md`** (nur wenn der Kurs eine durchgehende Fallfirma hat): siehe „Durchgehender Fall".
- Das Kapitel selbst (Quelle der Begriffe, Notation und Beispielzahlen, die das Blatt **nicht** wiederverwendet).

Dann nur Fehlendes fragen:

1. **Thema/Kapitel** und **Quelle**: Kapitel-QMD (Pfad), Notizen, oder bestehende Aufgaben als Stil-/Variationsvorlage.
2. **Umfang**: Übungsblatt, Serie (alle Blätter eines Kurses, siehe „Serienmodus") oder Einzelaufgabe(n) — bei Einzelaufgaben: in welche Datei einfügen?
3. **Zeitrahmen**: Default ist das Präsenz-Tutorium mit **90 Minuten**: 3 Aufgabenblöcke (zusammen ca. 45–50 Minuten) + 1 Kurzfall (ca. 30 Minuten), Summe **ca. 75 Minuten**. Anderes Lehrformat aus `_curriculum.md` übernehmen.
4. **Sprache** (`lang`): aus Quelle ableiten, bei Ambiguität fragen — steuert Logo, Eyebrow, Datumsformat, Labels und Anführungszeichen.
5. **Punkte?** Default **nein** (siehe „Punkte"). Nur bei ausdrücklichem Wunsch nach Klausurnähe.
6. **Kopf-Metadaten**: `course`, `semester`, `sheet`-Nummer — aus Kontext ziehen, sonst knapp erfragen oder Platzhalter setzen.

## Aufgabenplan — Checkpoint vor dem Schreiben

Nach dem Intake, **bevor** eine Aufgabe geschrieben wird:

1. **Lernziele holen.** Die Lernziele des Kapitels mit ihren Nummern aus `_curriculum.md`. Fehlt die Datei: 3–6 prüfbare Lernziele aus dem Kapitel ableiten (Bloom-Verb + Gegenstand), im Plan als **abgeleitet** kennzeichnen und `curriculum-architect` empfehlen. Keine eigene zweite Nummerierung erfinden.
2. **Konzepte je Lernziel** sammeln: Definitionen, Ansatzkriterien, Bewertungsregeln, Rechenverfahren, Sonderfälle, Abgrenzungen. Gerade die unscheinbaren Sonderfälle (z. B. *best estimate* bei Einzelverpflichtung vs. Erwartungswert bei großer Grundgesamtheit) sind oft die klausurrelevantesten.
3. **Plan bauen** (Vorlage in [references/plan-templates.md](references/plan-templates.md)): Tabelle Aufgabe × Lernziele × Typ × Bloom-Stufe × Minuten, darunter die **Abdeckungstabelle** Lernziel × Aufgabe. Regeln:
   - **Jedes Lernziel des Kapitels** wird von mindestens einer Aufgabe geübt; was nicht passt, steht unter „Nicht eingeplant" mit Begründung.
   - **Höchstens 2–3 Lernziele je Aufgabe.** Ein Block, der fünf Lernziele „abdeckt", übt keines richtig; bei Integrationssitzungen lieber mehr, kleinere Blöcke.
   - **Mindestens eine Aufgabe auf Bloom-Stufe Beurteilen** („Beurteilen Sie…", „Was empfehlen Sie…", mit Begründung) — meist der Urteils-Task im Kurzfall.
   - **Zeitbudget ca. 75 von 90 Minuten**, nie exakt 90; ~15 Minuten bleiben für Einstieg, Besprechung, Abschluss. Passt der Plan nur mit Arbeitsteilung oder „Kürzen, wenn die Zeit drängt", ist er zu groß: jetzt kürzen.
4. **Vorlegen und auf Antwort warten.** Erst nach Freigabe (oder Anpassung) schreiben. Die Person kennt ihre Klausurschwerpunkte und Kohorten-Schwächen.

**Ausnahmen vom Checkpoint:** Einzelaufgaben (das Konzept ist benannt); Serienmodus nach Freigabe des Serienplans; ein Auftrag, der Format und Umfang schon freigibt (z. B. Brief eines Orchestrators). Dann den Plan nicht vorlegen, sondern **im Abschlussbericht** mitliefern.

## Serienmodus (mehrere Blätter, z. B. ganzer Kurs)

Ein Checkpoint pro Blatt ist bei 12–13 Blättern unpraktisch. Stattdessen:

1. Für **alle** Blätter einen Serienplan vorlegen (eine Zeile je Blatt: Lernziele, Aufgabenblöcke mit Typ und Minuten, Kurzfall-Firma und -Entscheidung; Vorlage in den References). Dabei kursweit prüfen: jedes Lernziel des Kurses genau in seinem Kapitel abgedeckt, Kurzfall-Firmen und -Branchen nicht doppelt, Schwierigkeit steigt über das Semester.
2. **Einmal** freigeben lassen, dann alle Blätter ohne weiteren Checkpoint schreiben (parallel möglich: je Blatt ein Agent mit Serienplan-Zeile + diesem Skill).
3. Jedes Blatt meldet im Abschlussbericht seine Plantabelle; Abweichungen vom Serienplan begründen.

## Harte Format-Regeln (sonst greifen die Stile der Extension nicht)

Gegen die `tutorial-typst`-Extension verifiziert. Strikt einhalten.

1. **Erste Body-Zeile MUSS `# <Titel>` sein** (H1), Titeltext **identisch zu `title:`**. Der H1 erscheint nicht im Text (der Masthead zeigt den Titel), **verankert aber die Heading-Level**. Ohne H1 schiebt Quarto alle Level um eins hoch, und Badges/Stile brechen.
2. **Aufgabenblock = `## Label N: Titel`** → oranges Nummern-Badge + Kicker (= „Label") + **Seitenumbruch davor** (außer beim ersten). Muster `Label<Leerzeichen>Zahl<Trenner :.)>Resttitel`, z. B. `## Aufgabe 1: Rückstellungen ansetzen`, `## Aufgabe 4: Kurzfall — Hartmann Logistik GmbH`.
3. **Lernziel-Zeile** direkt unter jeder `## Aufgabe N:`-Überschrift, als erste Zeile des Blocks:
   - DE: `*Lernziele: 7, 8 · ca. 15 Minuten*`
   - EN: `*Learning objectives: 7, 8 · about 15 minutes*`

   Nummern = kursweite Nummern aus `_curriculum.md`; die Minuten der Blöcke ergeben zusammen die Plan-Summe (ca. 75).
4. **Info-Abschnitt = `## Titel` ohne „Wort N:"** → schlichte Überschrift, **kein** Badge, **kein** Umbruch (z. B. `## Hinweise`).
5. **Teilaufgabe = `#### Task N: Titel`** (oder `#### Aufgabe N: …`) — H4. Nur die Wörter `Task`/`Aufgabe` werden erkannt; das gerenderte Label folgt `lang` (de → „Aufgabe", en → „Task"). Kontext/Angabe stehen direkt unter `##` bzw. `####`; `###` ist Reserve.
6. **`a) b)` nur zur Feingliederung INNERHALB eines Tasks**, nie auf Teilaufgaben-Ebene.
7. **Lösung pro Teilaufgabe** in einen nativen Quarto-Block direkt nach dem `####`-Text:
   ```
   ::: {.content-visible when-meta="show_solutions"}
   **Lösung:** …

   **Grading Notes:** … (optional, Korrekturhilfe)
   :::
   ```
   `**Lösung:**` (de) bzw. `**Solution:**` (en). **KEINE** `.loesung`/`.aufgabe`-Divs — die gibt es nicht mehr.
8. **Abdeckungstabelle** am Ende des Blatts, nur im Lösungsblatt: `::: {.content-visible when-meta="show_solutions"}` mit `## Lernziel-Abdeckung` (EN `## Learning objective coverage`) und der Tabelle Lernziel | Aufgaben; die Beurteilen-Aufgabe markieren.
9. **Seitenbudget:** Weil jeder `## Aufgabe N:`-Block auf neuer Seite beginnt, hat das Angabenblatt mindestens so viele Seiten wie Blöcke. Ziel **ca. 4 Seiten**: höchstens 4 Blöcke, jeder Block (Angabe ohne Lösungen) passt auf eine Seite, keine langen Daten vor Aufgabe 1 (Daten gehören in den Block, der sie braucht). Nach dem Rendern die Seitenzahl prüfen.
10. **Typst-Fallen** (Details und Prüfbefehle im Spickzettel):
    - Anführungszeichen **nur gerade** `"…"` tippen; Typst setzt sie nach `lang` (de „…“, en “…”). Getippte „…“ kommen als „…„ heraus.
    - Keine Tabellenzelle und keine Zeile beginnt mit `+ `, `- ` oder `= ` (Typst macht daraus Liste bzw. Überschrift; `\+` hilft nicht). Stattdessen `+36.000` ohne Leerzeichen, „zzgl."/„abzgl." oder das echte Minus `−`.
    - Apostrophe/Anführungszeichen in `####`-Überschriften und englische Masthead-Labels hängen von der Extension-Version ab: vor dem ersten Blatt mit dem Befehl aus dem Spickzettel prüfen. Fehlt der Fix, die Extension **nicht** selbst ändern, sondern den Befund melden und Apostrophe in Überschriften vermeiden.

## Punkte — standardmäßig WEGLASSEN

- **Default: keine Punkte.**
- Nur wenn Punkte/Klausurnähe ausdrücklich gewünscht: am **Ende der `####`-Zeile** in eckigen Klammern, z. B. `#### Task 2: Barwert berechnen [4 P]` (rendert als Pille; `[4]`, `[4 Punkte]`, `[4 pts]` ebenso). Dann **konsequent bei allen Teilaufgaben**. Korrekturhilfe ohne Pille gehört in die `**Grading Notes:**`.

## Datei-Konventionen

Eine Datei, Aufgaben **und** Lösungen zusammen; Lösungen per Toggle. YAML-Kopf:

```yaml
---
title: "Tutorium 04: Leasing (IFRS 16)"   # identisch zur ersten H1; EN "Tutorial 04: …"
subtitle: "[Untertitel]"
lang: de                          # de oder en — Logo, Eyebrow, Datum, Labels, Anführungszeichen
author:
  - name: Prof. Dr. Christian Kraus
    email: christian.kraus@thws.de
    role: Lecturer
    affiliation: THWS Business & Engineering
course: "[Modul]"                 # Masthead + Kopfzeile links
semester: "[z. B. WS 2026/27]"    # Kopfzeile rechts
sheet: "04"                       # Eyebrow „… · Nr. 04"
date: last-modified
show_solutions: false
format: tutorial-typst
---
```

- **Logo-Pfade NICHT angeben** — die Extension löst sie selbst auf. `show_solutions: false` ist Standard (Angabenblatt).
- **Dateiname (BUA-Schema):** `tutorials/tut_NN_slug.qmd`, zweistellige Kapitelnummer, englischer Slug in Kleinbuchstaben mit Unterstrichen (z. B. `tut_04_leases.qmd`). PDFs: `tut_NN_slug_questions.pdf` (Angabe) und `tut_NN_slug.pdf` (mit Lösungen). Bestehendes Schema eines Projekts hat Vorrang.
- **Extension:** liegt im Projekt unter `_extensions/c-kraus/tutorial/`. Quarto sucht `_extensions` im Ordner der Datei (bzw. im Projekt-Root). In Buchprojekten deshalb in `tutorials/` einen **Symlink** anlegen, keine Kopie: `ln -s ../_extensions tutorials/_extensions` (so in BUA1, BUA3, Finance). Fehlt die Extension ganz: aus einem Schwesterkurs bzw. `~/Dev/99_Templates/` übernehmen und melden.

## Durchgehender Fall (`_running_case.md`)

Gibt es eine `_running_case.md`, zuerst lesen. Nur deren Zahlen, Daten, Personen und Begriffe verwenden (z. B. „management board", nie „executive board"); Szenen passen zur **Zeitachse** des Kapitels. Nichts stillschweigend neu einführen. Braucht eine Aufgabe einen neuen Wert, ihn konsistent definieren und am Ende unter der Überschrift `FACT SHEET ADDITIONS` melden (Posten | Wert | Kapitel/Aufgabe). Aufgaben ohne Fallfirma dürfen eigene, kurze Akteure haben.

## Aufgaben-Struktur

```markdown
# [Titel]                         <- Pflicht-H1, identisch zu title:, unsichtbar

## Aufgabe 1: [Konzept/Analysefeld benennen]

*Lernziele: 7, 8 · ca. 15 Minuten*

[Kontext: max. 2–3 Sätze. Trockener Humor erwünscht — siehe Tonalität.]
[Gegebene Größen / Datentabelle inline, falls nötig.]

#### Task 1: [Teilaufgabe]

[Aufgabenstellung. Bei Feingliederung optional a) … b) … als Fließtext-Unterpunkte.]

::: {.content-visible when-meta="show_solutions"}
**Lösung:**

[Vollständiger Lösungsweg — siehe Lösungsqualität.]
:::

#### Task 2: [Teilaufgabe, baut ggf. auf Task 1 auf]

…

## Aufgabe 4: Kurzfall — [Firma]

*Lernziele: 9, 10 · ca. 30 Minuten*

[Erzählteil nach case-builder, Modus Kurzfall; eine Anlage; 2–3 Tasks mit Lösungs-Divs]

::: {.content-visible when-meta="show_solutions"}
## Lernziel-Abdeckung

[Tabelle Lernziel | Aufgaben]
:::
```

- **Wenige `## Aufgabe N:`-Blöcke, darunter mehrere `#### Task N:`.** Kurze Faktenfragen unter einem gemeinsamen Block bündeln, nicht je in ein eigenes `##` (Seitenumbruch).
- Datentabellen **inline in der Aufgabe**, nie als Anhang am Ende.
- Formeln in LaTeX-Math (`$…$` / `$$…$$`); **keine Währungssymbole in Mathblöcken** (Betrag als Zahl, „Euro" im Text).

## Tonalität

Kontexte im Stil der bewährten Übungsskripte: trocken-ironisch, alltagsnah, in 2–3 Sätzen erledigt — Kevin-Marvins Sparbuch, die Kneipe „Specht", das zinslose Scheidungs-Darlehen als „Wiedereingliederungshilfe". Der Humor liegt im Szenario, nie in der Aufgabenstellung; Zahlen und Fragen bleiben präzise. Kein Humor-Zwang: Eine MC-Faktenfrage braucht keinen Kontext. Keine realen, identifizierbaren Personen.

## Aufgabentypen

Ein Aufgabentyp füllt je nach Umfang einen ganzen `## Aufgabe N:`-Block oder einzelne `#### Task N:`.

**1. Numerische Rechenaufgabe** (Brot und Butter): Kontext + gegebene Größen unter der `## Aufgabe`, dann `#### Task`-Teilaufgaben mit steigendem Anspruch. Bauen Tasks aufeinander auf, muss jeder auch mit dem Zwischenergebnis der Musterlösung lösbar sein (Folgefehler-Fairness).

**2. Multiple Choice** („Welche der folgenden Aussagen sind richtig?"): 5–7 Optionen, 1–3 korrekte, letzte Option stets „Alle Aussagen sind falsch". Distraktoren bilden **typische Missverständnisse** ab, keine Zufallsfehler. Lösung: korrekte Optionen **fett**, je 1 Satz Begründung bei nicht offensichtlichen.

**3. Kurzszenario**: 3–6 Sätze Sachverhalt (benannter Akteur, konkrete Zahlen), dann 2–4 `#### Task`, die ihn aus verschiedenen Winkeln durcharbeiten. Keine offene Entscheidung — dafür gibt es Typ 6.

**4. Verständnis-/Transferfrage**: Offene Kurzantwort („Begründen Sie…", „Was ändert sich, wenn…"). Lösung nennt die erwarteten Kernpunkte als knappe Prosa plus akzeptable Alternativargumentationen.

**5. Buchungssatz-/Normanwendung**: Sachverhalt → „Welcher Buchungssatz?" / „Nach welcher Norm und mit welchem Betrag?". Lösung: `Konto Betrag an Konto Betrag` plus Normverweis mit Absatz/Satz-Granularität.

**6. Kurzfall** (ein Block je Blatt, ca. 30 Minuten): Den Erzählteil nach **case-builder, Modus Kurzfall** schreiben (dort die harten Grenzen: Erzählteil ≤ 400 Wörter, EN ≤ 450, eine Person mit echtem Entscheidungsdruck, eine Entscheidung, endet **vor** der Entscheidung, nennt die Norm nicht, höchstens eine Anlage). Hier im Blatt: eigener Block `## Aufgabe N: Kurzfall — <Firma>` mit Lernziel-Zeile, 2–3 `#### Task` mit Lösungs-Divs, davon einer mit begründetem Urteil (Bloom: Beurteilen). Eine Kurzfall-Firma aus einem Altfall darf gekürzt übernommen werden (Firma, Person, Kernproblem bleiben).

## Schwierigkeitsprogression

Innerhalb **gleichartiger Themengebiete** staffeln: Der erste Task eines Konzepts prüft die Grundmechanik, die folgenden kombinieren, variieren Randbedingungen oder kehren die Fragerichtung um. Faustregel fürs Blatt: ~30 % Grundmechanik, ~50 % Anwendung/Kombination, ~20 % Transfer/Urteil. Der schwerste Task eines Themas entspricht Klausurniveau.

## Zahlen und Sachverhalte

- **Jede Zahl folgt aus den genannten Fakten.** Laufzeit 11 Monate → 11 Monatsraten, nicht 12; „ab 1.7." → halbes Jahr. Beim Schreiben der Lösung prüfen, ob sie nur Angaben der Aufgabe nutzt.
- **Unrundet rechnen, gerundet zeigen**; gerundete Aussagen kennzeichnen („rund", „ca."); bei Zwischenrundung die akzeptable Spanne nennen.
- **Neue Zahlen**, nicht die Beispiele des Kapitels; auch keine Kombination aus echten Klausuren.
- **Sachverhalts-Trigger-Check:** Jedes Detail im Sachverhalt darauf prüfen, ob es unbeabsichtigt eine andere Norm, Ausnahme oder ein Wahlrecht auslöst und die Lösung kippt. Beispiel: Ein Zinsswap „damit der Zinsaufwand dem variablen Zins ihrer Kundenfinanzierungen folgt" macht Kundenfinanzierung zur möglichen Hauptgeschäftstätigkeit (IFRS 18.65(a)) und verschiebt die GuV-Kategorie. Lösung: das Detail streichen oder ausdrücklich ausschließen („finanziert keine Kunden").

## Lösungsqualität (derive, don't assert)

- **Jeder Rechenschritt sichtbar**: `(181.500 − 15.000) ÷ 8 = 20.812,50` — nie nur das Ergebnis. Gegebene Größen zu Beginn der Lösung benennen.
- **Alternative Lösungswege** zeigen, wo sie didaktisch etwas zeigen (z. B. Einzelabzinsung vs. RBWF); nicht erzwingen.
- Bei Normanwendung steht der Normverweis in der Lösung, nicht in der Aufgabe. Quelle für Normen: Originaltext (ifrs.org, gesetze-im-internet.de) vor Kurs-Wiki vor Modellwissen.
- **`**Grading Notes:**`** optional am Ende eines Lösungs-Divs (worauf bei der Bewertung zu achten ist, Folgefehler).

## Qualitätssicherung (vor dem Präsentieren, in dieser Reihenfolge)

**1. Python-Arithmetik-Check — für jede Zahl, ohne Ausnahme:** Für jedes Ergebnis und Zwischenergebnis ein kurzes Python-Skript ausführen (`python3 -I`, Skripte ins Scratchpad, nicht ins Repo). Nicht mental verifizieren — rechnen. Tabellensummen nachsummieren.

**2. Lernziel-Abdeckung:** Jede Lernziel-Zeile stimmt mit dem freigegebenen Plan überein; jedes Lernziel des Kapitels kommt in der Abdeckungstabelle vor; ≤ 3 Lernziele je Block; ≥ 1 Beurteilen-Aufgabe; Minuten summieren sich auf ca. 75 (bzw. das Budget des Lehrformats). Zusätzlich: Ist jedes verwendete Konzept und jeder Fachbegriff im Kapitel eingeführt? Echte Lücken im Output melden (⚠️ ein Satz pro Punkt).

**3. Sachverhalt und Fall:** Trigger-Check (siehe oben) für jeden Sachverhalt; Werte der Fallfirma gegen `_running_case.md` abgleichen.

**4. Rendern und ansehen** (beide Fassungen, Befehle unter „Output"): Laufen beide fehlerfrei? Angabenblatt ca. 4 Seiten? Anführungszeichen, `+`/`−` in Tabellen, Apostrophe in Task-Überschriften, Masthead-Labels in der richtigen Sprache? Seitenzahl z. B. mit `pdfinfo tut_NN_slug_questions.pdf | grep Pages`.

**5. Self-Review-Checkliste (kein Subagent):**
- Erste Body-Zeile `# <Titel>`, identisch zu `title:`?
- `## Label N: Titel` korrekt geformt; Info-Abschnitte ohne „Wort N:"?
- Lernziel-Zeile unter jedem `## Aufgabe N:`, im exakten Format?
- Teilaufgaben als `#### Task N:`; pro Task ein Lösungs-Div mit korrekter Syntax?
- Jede Aufgabe self-contained — alle Daten in der Aufgabe, nur aus ihnen ableitbar?
- Task-Progression folgefehler-fair? MC: genau die markierten Optionen korrekt, „Alle falsch"-Option vorhanden?
- Kontexte ≤ 3 Sätze (Kurzszenario ≤ 6); Kurzfall-Erzählteil ≤ 400 Wörter (EN ≤ 450), endet vor der Entscheidung?
- Keine Punkte-Pillen — außer ausdrücklich gewünscht, dann bei allen Tasks?
- Abdeckungstabelle im Lösungsblatt?

Gefundene Probleme direkt beheben, dann speichern.

## Einzelaufgaben-Modus

Bei „noch eine Aufgabe zu X" in bestehende Datei: Nummerierung der `## Aufgabe N:` bzw. `#### Task N:` fortführen, Stil und Schwierigkeitslücke des Blatts beachten, per gezieltem Edit einfügen, Lernziel-Zeile setzen und Abdeckungstabelle nachführen, Arithmetik-Check für die neue Aufgabe. Zeitbudget des Blatts im Blick behalten: eine neue Aufgabe verdrängt ggf. eine alte.

## Klausur-Export

Auf Wunsch („mach daraus Klausuraufgaben") ausgewählte Aufgaben für den `exam-builder-skill` aufbereiten: Humor-Kontexte straffen, Punktevorschlag je Teilaufgabe (Faustregel: 1 Punkt pro Rechenschritt/Argument), Übergabe an exam-builder anbieten — die exam-typst-Formatierung macht dort der exam-builder.

## Output

Speichern, beide Fassungen rendern, dann kompakt melden: Datei, Plantabelle (Aufgabe | Lernziele | Typ | Minuten) und Abdeckung, Kurzfall-Wortzahl, Seitenzahl des Angabenblatts, Arithmetik-Check (N Berechnungen ✅), ⚠️ aus Lernziel- und Trigger-Check, ggf. `FACT SHEET ADDITIONS`.

Render aus dem Ordner der Datei (`-o` nimmt nur einen Dateinamen); **zuerst** die Angabe mit eigenem Namen, **dann** die Lösungsfassung — sonst überschreiben sich die PDFs:

```bash
cd tutorials
quarto render tut_04_leases.qmd --to tutorial-typst -M show_solutions:false -o tut_04_leases_questions.pdf
quarto render tut_04_leases.qmd --to tutorial-typst -M show_solutions:true     # → tut_04_leases.pdf
```
