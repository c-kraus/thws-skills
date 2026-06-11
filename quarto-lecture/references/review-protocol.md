# Perspektiven-Review — Kanonisches Protokoll

Dies ist die **einzige** Quelle für den Perspektiven-Review. `quarto-lecture` (Workflow-Schritt „Review") und `lecture-factory` (CREATE und RE-REVIEW) laden diese Datei und folgen ihr — keine eigenen Prompt-Varianten pflegen.

## Design-Entscheidung: Ein Reviewer, drei Linsen

Statt drei paralleler Subagents (3× voller Kapiteltext im Kontext) läuft **ein** Subagent, der nacheinander drei Perspektiven einnimmt und am Ende selbst synthetisiert. Das spart ~2/3 der Review-Tokens bei nahezu gleichem Befundbild — die Linsen prüfen disjunkte Dimensionen, echte Unabhängigkeit bringt hier wenig.

Der Reviewer liefert eine **fertig priorisierte Verbesserungsliste**; der aufrufende Agent wendet sie nur noch an.

## Wann der Review läuft

- Genau **einmal** pro Kapitel-Durchlauf — nach Fertigstellung des Drafts (und nach Excalidraw-Dispatch), vor dem Checkpoint. Wird der Review von `lecture-factory` orchestriert, ruft `quarto-lecture` ihn **nicht** zusätzlich auf.
- **Skip** wenn das Kapitel <500 Wörter hat oder die Person explizit verzichtet.

## Input-Vorbereitung

Dem Reviewer mitgeben:

1. Vollständigen Kapiteltext (.qmd-Inhalt)
2. **Zielgruppen-Block** aus `_curriculum.md` (Studiengang, Semester, Vorwissen) — falls vorhanden. Ohne Curriculum: Default „Bachelor Wirtschaftsingenieurwesen, 4. Semester, Grundlagen BWL/ReWe vorhanden".
3. Kernthemen des Vorgänger-Kapitels (falls Curriculum vorhanden) — damit der Reviewer beurteilen kann, was als bekannt vorausgesetzt werden darf.

## Subagent-Prompt

```
Du reviewst ein Quarto-Vorlesungskapitel in drei nacheinander eingenommenen Perspektiven.
Arbeite jede Linse vollständig ab, bevor du zur nächsten wechselst. Keine Lobhudeleien —
nur tatsächlich verbesserungswürdige Befunde.

ZIELGRUPPE: [Zielgruppen-Block aus _curriculum.md oder Default]
VORWISSEN AUS FRÜHEREN KAPITELN: [Kernthemen Vorgänger-Kapitel, oder „unbekannt"]

KAPITELTEXT:
[vollständiger .qmd-Inhalt]

---

LINSE 1 — Kritischer Professor (Fachgebiet: Thema des Kapitels):
1. Inhaltliche Korrektheit — Sind alle Aussagen fachlich präzise? Kippen Vereinfachungen ins Falsche?
2. Normgenauigkeit — Werden §§ / IAS / IFRS mit der richtigen Granularität zitiert? Fehlen relevante Normen?
3. Trinity-Vollständigkeit — Sind Theorie, Norm und Praxis wirklich abgedeckt oder nur angedeutet?
4. Intellektuelle Tiefe — Wo ist es für Hochschulniveau zu oberflächlich?
→ Max. 5 Befunde. Format: Abschnitt → Problem → konkreter Verbesserungsvorschlag.

LINSE 2 — Sehr guter Student (will tief verstehen und auf neue Fälle transferieren):
1. Logischer Aufbau — Bauen die Sektionen aufeinander auf? Gibt es verwirrende Sprünge?
2. Beispiel-Qualität — Sind Case Studies und Flip-Cards erhellend oder ersetzbar durch Stärkeres?
3. Lernzielkontrollen — Testen die Quick-Checks das Gelehrte, oder wirken sie zufällig platziert?
4. Transferpotenzial — Kann ich danach einen unbekannten Fall selbst einordnen?
→ Max. 4 Befunde. Format: „In [Abschnitt] hätte ich mir gewünscht, dass … — weil …"

LINSE 3 — Mittelmäßiger Student (kämpft mit Fachbegriffen und Tempo; Vorwissen exakt
gemäß ZIELGRUPPE — nicht mehr):
1. Einstiegshürden — Wo hättest du aufgehört zu lesen? Warum?
2. Begriffs-Erstnennung — Liste JEDEN Fachbegriff, der verwendet wird, bevor er erklärt wurde
   oder ohne dass er laut Vorwissen bekannt sein kann. Diese Prüfung ist vollständig
   durchzuführen, nicht stichprobenartig.
3. Ankerpunkte — Genug Flip-Cards/Drag-Exercises zur Sicherung der Kernbegriffe? Oder zu viele auf einmal?
4. Praxisbezug — Ist die Case Study ohne Spezialwissen über das zitierte Unternehmen verständlich?
→ Max. 4 Befunde plus die vollständige Begriffsliste aus Punkt 2.
   Format: „An [Stelle] wäre ich verloren, weil … — Lösung: …"

---

SYNTHESE (nach allen drei Linsen):
1. Konfliktanalyse: Wo widersprechen sich die Linsen? Auflösungsregel: Was der Professor
   als „zu flach" kritisiert und der schwächere Student als „zu dicht" empfindet, gehört in
   ein `.details`-Div — Haupttext für den Durchschnitt, Tiefe für die Starken.
2. Priorisierung:
   - Stufe 1 (zwingend): Faktenfehler, falsche/fehlende Normen, unerklärte Erstnennungen
   - Stufe 2 (wichtig): Strukturprobleme, fehlende Ankerpunkte, zufällig wirkende Quick-Checks
   - Stufe 3 (optional): Anreicherungen, stärkere Beispiele

AUSGABE (exakt dieses Format):
## Verbesserungsliste (priorisiert, max. 7)
1. [Stufe 1|2|3] [Abschnitt] → [präzise Änderungsanweisung] (Linse: [P|S+|S])
…
## Begriffs-Erstnennungen ohne Erklärung
- [Begriff] — erste Verwendung in [Abschnitt], Erklärung fehlt/kommt erst in [Abschnitt]
## Nicht aufgenommene Befunde
- [Befund] — [Grund der Nichtaufnahme]
```

## Anwendung durch den aufrufenden Agent

1. **Alle Stufe-1-Punkte umsetzen** — ohne Ausnahme. Unerklärte Erstnennungen: Erklärung in einem Satz im Fließtext bei der ersten Verwendung, oder Flip-Card/Deep Dive, wenn ein Satz nicht reicht.
2. Stufe 2 umsetzen, solange die Gesamtzahl der Änderungen ≤7 bleibt.
3. Stufe 3 nur bei verbleibendem Budget.
4. Für jede Änderung notieren: Abschnitt + was geändert + aus welcher Linse.

## Report an die Person

> **Perspektiven-Review abgeschlossen.** [N] Befunde · [N] Verbesserungen angewandt ([N] Stufe 1 · [N] Stufe 2 · [N] Stufe 3).
> Wichtigste Änderungen: [2–3 Sätze]
> Nicht adressiert: [falls vorhanden, mit Begründung]

## Eskalation: Drei unabhängige Subagents

Nur auf explizite Anforderung (z. B. „voller Review vor Veröffentlichung"): die drei Linsen als drei parallele Subagents mit jeweils nur ihrer Linse dispatchen, Synthese dann durch den aufrufenden Agent nach denselben Regeln. Standardfall bleibt der Ein-Reviewer-Modus.
