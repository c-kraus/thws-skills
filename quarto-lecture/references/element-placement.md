# Element Placement Protocol

Vor dem Schreiben **jeder H2-Section** durchlaufen — Elementplatzierung ist eine Planungsentscheidung, kein redaktioneller Nachgedanke.

## Step 1 — Trinity-Rolle der Section bestimmen

| Rolle | Charakteristik |
|---|---|
| **Theory** | Abstraktes Modell, Definition, Framework, Konzept |
| **Norm** | Rechtlicher Anker: § HGB, IAS, IFRS, AktG |
| **Practice** | Anwendungsfall, Konsequenz, Entscheidung, Berechnung |

Eine Section kann zwei Rollen mischen, aber eine dominiert. Vor dem Schreiben benennen.

## Step 2 — Section Learning Objective (SLO) formulieren

Vervollständige: *„Nach diesem Abschnitt können Studierende ___."*

Der Satz wird **nicht** in den Text geschrieben — er steuert nur die Elementwahl.

- Theory-SLO: „…den Unterschied zwischen Rückstellung und Verbindlichkeit erklären."
- Norm-SLO: „…§ 249 Abs. 1 HGB korrekt auf einen Sachverhalt anwenden."
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

### Practice-Section

| Element | Regel |
|---|---|
| Case Study | **Pflicht** — wendet die Norm aus der vorangehenden Norm-Section an oder verletzt sie. Das `.solution`-Div **muss** den zuvor etablierten § referenzieren. Bei Accounting-Kapiteln: mit Berechnung, Buchungssatz oder Entscheidungsergebnis. |
| Quick-check | **Pflicht** am Sektionsende — Transferfrage: „Was wäre wenn …?" / „Welcher Buchungssatz folgt?" |

### Mixed Section (zwei Rollen)

Pflicht-Elemente beider Rollen. Würde die Summe 3 Elemente überschreiten: Norm-Regeln > Practice-Regeln > Theory-Regeln.

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

**Optional:**
- Historischer Kontext oder Herleitung, die das Verständnis schärft
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
- **Konkreter Akteur:** benanntes Unternehmen, fiktive aber benannte GmbH, namentliche Entscheidungsperson
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

Was als bekannt gilt, bestimmt der Zielgruppen-Block aus `_curriculum.md` plus die Kernthemen der Vorgänger-Kapitel — nicht das Bauchgefühl des Autors.
