# Element Placement Protocol

Vor dem Schreiben **jeder Section** durchlaufen — Elementplatzierung ist eine Planungsentscheidung, kein redaktioneller Nachgedanke.

**Einheit:** Standalone Mode: jede H2. Book Mode: die H2 sind Rollen-Container (Theory/Norm/Method/Practice), das Protokoll läuft pro H3; der Pflicht-Quick-Check einer Rolle steht am Ende ihrer H2, nicht unter jeder H3. Die Dichte (~1 Element je 400–600 Wörter, `qmd-quality-gate.md` §14) gilt immer und geht vor: Pflicht-Elemente so wählen, dass sie in die Dichte passen.

## Step 1 — Trinity-Rolle der Section bestimmen

| Rolle | Charakteristik |
|---|---|
| **Theory** | Abstraktes Modell, Definition, Framework, Konzept |
| **Norm** | Rechtlicher Anker: § HGB, IAS, IFRS, AktG |
| **Method** | Methode, Formel, Rechenverfahren, Werkzeug (z. B. Barwert, Annuität, Varianz, CAPM) |
| **Practice** | Anwendungsfall, Konsequenz, Entscheidung, Berechnung |

Eine Section kann zwei Rollen mischen, aber eine dominiert. Vor dem Schreiben benennen.

## Step 2 — Section Learning Objective (SLO) formulieren

Vervollständige: *„Nach diesem Abschnitt können Studierende ___."*

Der Satz wird **nicht** in den Text geschrieben — er steuert nur die Elementwahl.

- Theory-SLO: „…den Unterschied zwischen Rückstellung und Verbindlichkeit erklären."
- Norm-SLO: „…§ 249 Abs. 1 HGB korrekt auf einen Sachverhalt anwenden."
- Method-SLO: „…den Barwert einer wachsenden Rente für eine neue Situation berechnen."
- Practice-SLO: „…beurteilen, ob im vorliegenden Fall ein Ansatzverstoß vorliegt."

## Step 3 — Pflicht-Elemente nach Rolle

### Theory-Section

| Element | Regel |
|---|---|
| Flip-card | Eine pro neuem Kernkonzept (max. 3 pro Section) |
| Drag-exercise | Nach der ersten Definition oder Formel der Section |
| Deep Dive | **Pflicht**, wenn ein Konzept wichtige Nuancen/Ausnahmen hat, die den Lesefluss unterbrechen würden |
| Quick-check | **Pflicht** am Sektionsende — testet das SLO: „Was bedeutet X?" |

### Norm-Section

| Element | Regel |
|---|---|
| Deep Dive | **Pflicht** für jeden § oder IAS/IFRS-Absatz, der im Kapitel **zum ersten Mal** zitiert wird — direkt nach dem Zitationssatz |
| Drag-exercise | Ein Schlüsselbegriff/-phrase aus dem Normtext |
| Quick-check | **Pflicht** am Sektionsende — „Welche Norm gilt wenn …?" |

### Method-Section — Werkzeug-Muster (Pflicht)

Gilt für **jede** Einheit, die eine Methode, Formel oder ein Werkzeug einführt (Book Mode: jede H3 „Tool N: …" unter `## Method`), auch wenn sie in einer Theory- oder Norm-Section steht. Werkzeuge nicht abstrakt einführen und erst Abschnitte später anwenden — Anwendung gehört an die Stelle der Einführung. Reihenfolge fest:

| # | Baustein | Regel |
|---|---|---|
| 1 | **Alltagsfrage** | 2–4 Sätze: eine konkrete Situation aus dem Running Case oder dem Alltag (Ratenkredit, Miete, ETF-Sparplan, Bäckerei, Handwerksbetrieb, Sportverein), die eine echte Frage stellt. Steht **vor** der Formel. Ein abstraktes „Projekt P" darf zweites Beispiel sein, nie das einzige. Pro Kapitel variieren; keine erfundenen Fakten über reale Firmen, Personen oder Gesetze. |
| 2 | **Formel + Intuition** | Display-Formel mit `{#eq-…}` im Haupttext (nie im Deep Dive), Variablen im Folgesatz, Intuition in **einem** Satz. |
| 3 | **Durchgerechnetes Beispiel** | Die Alltagsfrage mit den Kapitelzahlen vollständig gelöst, Zwischenschritte sichtbar, Rundung nach `qmd-quality-gate.md` §13. Danach höchstens **ein** interaktives Element (Quick-Check, Widget oder Flip-Card). |
| 4 | **Herleitung im Deep Dive** | `::: {.details}` mit `#### Deep Dive: Woher die Formel kommt` (EN: `Where … Comes From`). Nur wenn echte Algebra oder ein nicht offensichtliches Argument existiert — keinen Deep Dive erfinden, wo nichts herzuleiten ist. Im Haupttext keine Herleitung über eine Zeile hinaus. |
| 5 | **Tutoriumsverweis** | Letzte Zeile der Einheit, exakt: DE `**Üben:** Tutorium N, Aufgabe M` · EN `**Practise it:** Tutorial N, Task M` — optional mit Link auf die Tutoriumsseite und kurzer Klammer zum Inhalt. Zielaufgabe in `tutorials/tut_NN_*.qmd` nachsehen (Lernziel-Zeile der Aufgabe). Übt keine Aufgabe das Werkzeug: Zeile weglassen und die Lücke im Report melden — nie eine Aufgabe erfinden. Tutorium existiert noch nicht: `<!-- Üben: Tutorium N, Aufgabe ? -->` setzen und melden. |

Ein Einleitungsabsatz der Method-Section kündigt das Muster in einem Satz an (jedes Werkzeug beginnt mit einer Alltagsfrage, wird durchgerechnet und endet mit dem Tutoriumsverweis; Herleitungen stehen in Deep Dives).

### Practice-Section

| Element | Regel |
|---|---|
| Case Study | **Pflicht** — wendet die Norm/Methode aus der vorangehenden Section an oder verletzt sie. Das `.solution`-Div **muss** den zuvor etablierten § bzw. die Formel (`@eq-…`) referenzieren. Bei Accounting-Kapiteln: mit Berechnung, Buchungssatz oder Entscheidungsergebnis. |
| Quick-check | **Pflicht** am Sektionsende — Transferfrage: „Was wäre wenn …?" / „Welcher Buchungssatz folgt?" |
| Tutoriumsverweis | Nach dem letzten Element, Format wie Method-Baustein 5 (meist auf den Kurzfall). |

### Mixed Section (zwei Rollen)

Pflicht-Elemente beider Rollen. Würde die Summe 3 Elemente überschreiten: Norm-Regeln > Method-Regeln > Practice-Regeln > Theory-Regeln.

---

## Quick-Check Writing Rules (alle Rollen)

1. **Frage vor der Prosa formulieren** — sie ist das Exit-Kriterium der Section, kein Nachgedanke
2. Die Frage testet direkt das SLO aus Step 2
3. Genau 3 Optionen: 1 korrekte + 2 Distraktoren, die **typische Studierenden-Missverständnisse** abbilden

**Guter Distraktor (misconception-basiert):** Statt „§ 249 HGB" wird „§ 252 Abs. 1 Nr. 4 HGB" angeboten — Studierende verwechseln häufig Rückstellungsnorm und Vorsichtsprinzip.

**Schlechter Distraktor (zufällig):** „§ 89 HGB" — kein Student käme darauf, kein Lernwert.

---

## Deep Dive Trigger Rules

**Pflicht:**
- Ein § oder IAS/IFRS-Absatz wird im Kapitel **zum ersten Mal** zitiert (Accounting)
- Ein Fachbegriff außerhalb des allgemeinen Sprachgebrauchs wird eingeführt und braucht mehr als einen Satz (alle Disziplinen)
- Ein theoretisches Konzept hat Nuancen/Ausnahmen/Unterarten, die den Lesefluss unterbrechen würden
- Die Herleitung oder der Beweis einer Formel aus einer Method-Section (Baustein 4) — Herleitungen stehen nie im Haupttext
- Ein Rechtsraum-Vergleich (HGB in einem IFRS-Kapitel) steht immer in einer Box `#### Exkurs: HGB — …` nach `chapter-patterns.md` §3

**Optional:**
- Historischer Kontext, der das Verständnis schärft
- Grenzfall für Fortgeschrittene
- Vergleich zweier häufig verwechselter Konzepte

**Nie:**
- Als erstes Element einer Section — Prosa-Kontext kommt zuerst
- Zwei Deep Dives hintereinander ohne mindestens 100 Wörter Prosa dazwischen
- Für Begriffe, die ein Satz im Fließtext erklärt

---

## Case Study Writing Rules

- **Minimum 1 pro Kapitel**, in der Practice-Section
- Beantwortet: „Was passiert, wenn die Norm angewendet — oder verletzt — wird?"
- **Konkreter Akteur:** benanntes Unternehmen, fiktive aber benannte GmbH, namentliche Entscheidungsperson. Existiert `_running_case.md`: dessen Firma, Personen und Zahlen (`chapter-patterns.md` §4)
- Struktur: Sachverhalt → Komplikation → Lösung (`.solution`-Div mit §-Referenz)
- Länge: 2–4 Absätze
- **Keine generischen Fälle** („Ein Unternehmen hat …") — jede Case Study braucht einen Namen und eine konkrete Konsequenz

---

## Begriffs-Erstnennungsregel (alle Rollen)

Beim Draften jeder Section ein laufendes **Begriffs-Inventar** führen: Welche Fachbegriffe verwendet die Section, die (a) im Kapitel noch nicht erklärt wurden und (b) laut Zielgruppen-Vorwissen nicht vorausgesetzt werden dürfen?

Für jeden solchen Begriff bei der **ersten Verwendung**:
- Erklärung in einem Satz im Fließtext, **oder**
- Flip-Card (wenn der Begriff ein Kernkonzept ist), **oder**
- Deep Dive (wenn ein Satz nicht reicht)

Was als bekannt gilt, bestimmt `_curriculum.md` (Zielgruppe bzw. *Kohorte & Vorwissen*) plus die Kernthemen der Vorgänger-Kapitel — nicht das Bauchgefühl des Autors.

**Ein Begriff pro Konzept:** Ist ein Begriff eingeführt, bleibt er im ganzen Kapitel derselbe (keine Synonyme zur Abwechslung). Vorgaben aus `_curriculum.md` (Terminologie) und `_running_case.md` (Begriffe/Gremien) gehen vor. Für Leser in der Zweitsprache ist ein wechselndes Wort ein neues Konzept.
