# SERIE-Modus — einen ganzen Kurs (neu) bauen

Für mehrere oder alle Kapitel eines Kurses, typischerweise als Quarto-Buch. Ersetzt den Checkpoint je Kapitel durch **zwei** Freigaben (Serienplan, Pilot) und macht den kursweiten Konsistenzlauf zur Pflicht.

Warum ein eigener Modus: Ohne ihn umgehen Kurs-Neubauten die Factory — die Sitzung schreibt eigene Briefs für parallele Subagents, die Skills werden nur „gelesen" oder überstimmt, und niemand prüft am Ende den Kurs als Ganzes. Folgen aus zwei Neubauten: Fallunternehmen mit doppelter Entscheidung und Anachronismen, zwei Marktrisikoprämien, drei Schreibweisen eines Symbols, ein Kapitel, das einem anderen widerspricht, Methodenkapitel ohne Anwendung (12 Nacharbeits-Commits nach einem pauschal freigegebenen Pilot).

---

## Phase 0 — Bestand (still)

`_curriculum.md`, `_running_case.md`, `_quarto.yml`, `CLAUDE.md`, Altauflage (`archive/`, alte Kapitel, Tutorien, Fälle, Widgets), Referenzkurse (BUA1/BUA3), Modulhandbuch. Prüfen, dass die Skills der Kette installiert sind (`quarto-lecture`, `tutorial-builder`, `case-builder`, `teaching-note`, `accounting-qa`, `html-builder`/`widget-pipeline`, ggf. `marp-slides`, `moodle-questions`).

## Phase 1 — Serienplan (Checkpoint 1, eine Freigabe für alles)

1. **Curriculum:** `curriculum-architect` INIT (Neubau) oder UPDATE. Liefert Themenauswahl mit Begründungen, Lernziele je Kapitel (kursweit nummeriert), Lehrformat, Kohorte & Vorwissen (tatsächliche Vorkurse erfragt), Material je Kapitel, Selbststudium je Kapitel.
2. **Fallunternehmen** (falls vorgesehen): `_running_case.md` mit Personen, Begriffe/Gremien, Kursweite Parameter und **Zeitachse** (eine datierte Szene je Kapitel). Alle Werte, die ein späteres Kapitel aus einem früheren braucht (z. B. Projektzins aus Kap. 8 für Kap. 9–10), **jetzt** berechnen und eintragen — sonst müssen Kapitel nacheinander statt parallel gebaut werden.
3. **Serienplan** — eine Zeile je Kapitel:

   | Nr | Dateien | Lernziele | Episode / Szene | Kurzfall (Firma, Quelle) | Widgets (behalten / neu) | Folien / Moodle | Welle |
   |---|---|---|---|---|---|---|---|

   Welle 1 = alle unabhängigen Kapitel; eine zweite Welle nur bei echter Abhängigkeit, die sich nicht über `_running_case.md` lösen lässt.
4. **Pilotkapitel** benennen: repräsentativ, nicht das leichteste, mit **mindestens einem Methoden-/Werkzeugabschnitt** (Muster in `quarto-lecture`: Alltagsfrage → Formel mit Intuition → durchgerechnetes Beispiel → Herleitung im Deep Dive → Verweis `**Üben:** Tutorium N, Aufgabe M` / `**Practise it:** Tutorial N, Task M`) und, falls vorhanden, einer Episode des Fallunternehmens.
5. **Skill-Abweichungen:** Jede Skill-Regel, die für diesen Kurs nicht passt, einzeln nennen mit Vorschlag: (a) Skill korrigieren (bevorzugt, wenn die Regel allgemein falsch ist) oder (b) ausdrücklich freigegebene Kurs-Ausnahme. Es gibt keine pauschale Klausel „der Brief geht vor".
6. **Übersetzung** geplant? Dann nach Phase 5 TRANSLATE (`translate-mode.md`).

Alles in **einer** Nachricht vorlegen; eine Freigabe deckt Curriculum, Fact Sheet, Serienplan und Ausnahmen. Spätere Planänderungen brauchen nur für die Änderung eine neue Freigabe.

## Phase 2 — Pilot (Checkpoint 2)

Die Orchestrierung baut den Pilot **selbst** mit genau der Skill-Kette, die später jeder Subagent ausführt:

1. `quarto-lecture` (Book Mode) → Kapitel
2. `tutorial-builder` → Tutorium, Kurzfall über `case-builder` (Kurzfall-Modus)
3. `teaching-note` (Modus TUTORIAL; LECTURE, wenn Folien dazugehören)
4. `accounting-qa`, Modus Inline, Umfang Material-Set
5. laut Plan: Widgets (`html-builder` bzw. `widget-pipeline`), `marp-slides`, `moodle-questions`
6. Pilot rendern (Phase 5 für dieses Kapitel)

**Freigabe mit Musterliste, nicht mit pauschalem „Ja":**

> **Pilot Kapitel NN fertig** — [Dateien, Wörter, Lesezeit vs. Selbststudium]
>
> Dieses Muster übernehmen alle Kapitel. Bitte gezielt ansehen:
> 1. Methodenabschnitt [§ / Überschrift]: Alltagsbeispiel, Deep Dive, Üben-Verweis — passt die Nähe von Werkzeug und Anwendung?
> 2. Umfang und Lesezeit ([N] Wörter, ca. [N] Minuten)
> 3. Tutorium: Aufgabenmix, Zeitbudget (~75 Min.), Lernziel-Zeilen; Kurzfall
> 4. Teaching Note: Tiefe, Minutenplan
> 5. Ton, Element-Dichte, Widgets
>
> Freigeben, oder was soll anders werden?

Kritik am Pilot erst im Pilot umsetzen und für jede Änderung entscheiden: **Skill-Regel** (Skill anpassen, gilt künftig für alle Kurse) oder **Kurs-Regel** (in `_curriculum.md` bzw. Projekt-`CLAUDE.md` eintragen). So erreicht das Muster die Subagents über Dateien und Skills, nicht über Brief-Prosa.

## Phase 3 — Parallelbau (kein Checkpoint je Kapitel)

Je Kapitel ein Subagent (Einheit = Kapitel + Tutorium + Kurzfall + Teaching Note, plus Widgets/Folien/Moodle laut Plan), alle Kapitel einer Welle in einer Nachricht starten.

**Brief-Regeln:**
- Der Brief weist an, die Skills über das Skill-Tool **aufzurufen** — nicht nur ihre SKILL.md zu lesen — und ergänzt nur Kursspezifika (Pfade, Lernziel-Nummern, Episode, Nachbarkapitel, Pilot als Muster, Grenzen, Bericht).
- Ein Brief überstimmt nie einen Skill und wiederholt keine Skill-Regeln. Passt eine Regel nicht: Skill korrigieren oder die Ausnahme dem Autor nennen (Phase 1) und als „freigegebene Ausnahme" in den Brief schreiben. Unterwegs gefundene Konflikte meldet der Subagent unter `SKILL-KONFLIKTE`, statt abzuweichen.

**Brief-Vorlage:**

```markdown
Du baust Kapitel NN des Kurses „[Titel]" in `[Repo]` (Quarto-Buch, [Sprache]).
Andere Agenten bauen parallel andere Kapitel im selben Checkout.

## Skills — Pflicht, über das Skill-Tool aufrufen und vollständig befolgen
1. quarto-lecture → `NN_slug.qmd` (Book Mode)
2. tutorial-builder → `tutorials/tut_NN_slug.qmd`; Kurzfall mit case-builder (Kurzfall-Modus).
   Plan-Checkpoint entfällt (Serienplan freigegeben); Aufgabenplan in den Bericht.
3. teaching-note, Modus [TUTORIAL|LECTURE] → `_teaching_notes/NN_slug_teaching_note.qmd`
4. accounting-qa, Modus Inline, Umfang Material-Set Kap. NN
5. [nur laut Plan: html-builder für …, marp-slides, moodle-questions]
Dieser Brief ergänzt nur Kursspezifika und überstimmt keine Skill-Regel.
Freigegebene Ausnahmen: [Liste aus Phase 1 | keine]. Passt eine Skill-Regel nicht:
nicht abweichen, sondern unter SKILL-KONFLIKTE melden. Lässt sich ein Skill nicht
laden: `~/.claude/skills/<skill>/SKILL.md` und `references/` per Pfad lesen und abarbeiten.

## Kursspezifika
- Zuerst lesen: `_curriculum.md` (Lernziele [a]–[b], Kohorte & Vorwissen, Material-Zeile NN,
  Leitfrage), `_running_case.md` (Szene: [Zeitachsen-Zeile]), `CLAUDE.md`.
- Muster (Pilot): `[Kapitel]`, `[Tutorium]`, `[Teaching Note]`.
- Nachbarkapitel: NN−1 [Titel — Kernidee] · NN+1 [Titel — Kernidee].
- Altquellen: [Pfade]. Kurzfall: [Firma, Quelle]. Widgets: [behalten / neu].

## Grenzen
- Nur eigene Dateien: [Liste]. Nicht ändern: `_curriculum.md`, `_running_case.md`,
  `_quarto.yml`, andere Kapitel, `archive/`.
- Kein git add/commit/push. Buch nicht rendern; Tutorium und Teaching Note selbst rendern.
- Rechenskripte nur in `[Scratchpad]/NN/`.

## Bericht (≤ 300 Wörter)
Dateien mit Wörtern und Lesezeit · aufgerufene Skills (je Skill ja/nein) ·
Lernziel-Abdeckung (LZ → Elemente/Aufgaben) · QA-Ergebnis · FACT SHEET ADDITIONS
(Merkmal | Wert | Herleitung) · SKILL-KONFLIKTE · Vorschläge zu Lernziel-Texten · offene Punkte.
```

**Berichte einsammeln:**
- Fehlt im Bericht ein Skill-Aufruf, den Schritt nachholen (per SendMessage an denselben Agent oder selbst) — nicht als erledigt verbuchen.
- `FACT SHEET ADDITIONS` → `curriculum-architect` UPDATE; Widersprüche zu Parametern oder Zeitachse → Autor.
- `SKILL-KONFLIKTE` und Lernziel-Vorschläge sammeln und gebündelt vorlegen.

**Kritik nach dem Parallelbau** (z. B. am Methodenmuster): wie im Pilot — Skill- oder Kurs-Regel festlegen, Pilotkapitel zuerst nachziehen und zeigen, dann eine Nacharbeitswelle mit derselben Brief-Vorlage; dabei vor jedem Entfernen einer Zahl prüfen, wo sie noch verwendet wird (Tutorium, Widgets, Moodle, Folien, Notes).

## Phase 4 — Konsistenzlauf (Pflicht, kursweit)

Erst wenn alle Kapitel fertig sind. `accounting-qa` mit **Umfang Kurs** über alle Dateien (Zahlen, Normzitate mit Live-Verifikation, gleiche Regel = gleiche Fundstelle in allen Kapiteln), dazu diese Prüfungen über Kapitel, Tutorien, Kurzfälle, Moodle, Folien, Teaching Notes und Widgets:

| Prüfung | Wie |
|---|---|
| **Zahlen** | Jeden Parameter und jede Fallzahl aus `_running_case.md` greppen; eine Zahl, ein Wert, gerundete Werte als „rund/ca./about" markiert. Widget-Voreinstellungen eingeschlossen. |
| **Daten & Zeitachse** | Jede datierte Szene gegen *Zeitachse*; jede Entscheidung genau einmal; keine Anachronismen (z. B. Produktion vor dem Bau); veraltete Daten in Moodle-Zieltexten und Feedback. |
| **Notation** | Varianten jedes Symbols greppen (z. B. Annuitätenfaktor in drei Schreibweisen); Formelsammlung = Kapitel. |
| **Begriffe** | *Terminologie-Konventionen* und *Begriffe/Gremien* (z. B. „management board", nie „executive board"); Personen nur aus dem Fact Sheet. |
| **Lernziel-Bezüge** | Callout je Kapitel = Nummern und Texte aus `_curriculum.md`; Tag-Zeilen der Tutorien nennen nur Lernziele ihres Kapitels; jedes Lernziel ≥ 1 Aufgabe; Moodle-Fragennamen und Zieltexte, Folien, Notes mit denselben Nummern; kein zweites Schema. |
| **Kapitelübergreifende Aussagen** | Jedes Thema, das in zwei Kapiteln vorkommt (Abhängigkeiten im *Lernpfad*, Querverweise „Kap. N"), sagt in beiden dasselbe (Beispiel: latente Steuern in der indirekten Kapitalflussrechnung in Kap. 11 vs. 12). Rück- und Ausblicksätze passen zum tatsächlichen Nachbarkapitel. |
| **Verweise** | `**Üben:**`/`**Practise it:**`-Zeilen zeigen auf existierende Aufgaben; Teaching Note = Lösungsblatt (Zahlen, Aufgabennummern). |
| **Widgets** | `widget-pipeline` AUDIT (Zahlen, Presets, Reglerbereiche gegen das Kapitel, verwaiste Widgets). |
| **Lesezeit** | je Kapitel gegen *Selbststudium* aus `_curriculum.md`. |

Befunde direkt in den Quelldateien korrigieren; was eine Entscheidung braucht, geht an den Autor. Ergebnis als Tabelle: Befund · Fundstellen · Korrektur.

## Phase 5 — Render-Check

- Buch: `quarto render` einmal komplett, fehlerfrei; `grep -c '?@' _site/*.html` muss überall 0 sein (unaufgelöste Querverweise).
- Tutorien: zuerst Angabe (`-M show_solutions:false -o tut_NN_slug_questions.pdf`), dann Lösung; PDFs ansehen.
- Teaching Notes: `--to handout-typst`.
- Folien (falls vorhanden): Overflow-Scan aus `marp-slides`. Moodle-XML: `xmllint --noout`.
- Jeder iframe-Pfad existiert.

## Abschluss

```
## Lecture Factory — Serie abgeschlossen ✓
- Kapitel: [N] · Tutorien: [N] · Kurzfälle: [N] · Teaching Notes: [N] · Widgets: [N neu / N geprüft]
- Konsistenzlauf: [N] Befunde korrigiert · [N] offen (Liste)
- Fact Sheet: [N] Ergänzungen eingetragen · Curriculum-Status aktualisiert
- Render: Buch ✓ · Tutorien ✓ · Notes ✓ [· Folien ✓ · Moodle ✓]
- Offene Punkte für den Autor: …
→ Übersetzung geplant: TRANSLATE starten? / Änderungen in [Zielrepo] nachziehen?
```
