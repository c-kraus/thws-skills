---
name: lecture-factory
description: "End-to-end workflow for creating or reviewing widget-enhanced Quarto lectures, one chapter or a whole course (Quarto book). Modes: CREATE (raw content → production-ready chapter with widgets), RE-REVIEW (existing .qmd → review, accounting-qa, quality gate, improvements), SERIE (rebuild a whole course: plan approved once, pilot chapter with tutorial, short case, teaching note and method section approved as the pattern, parallel build in which every subagent invokes the content skills, course-wide consistency pass, render check), TRANSLATE (second-language edition in a separate repo: glossary, box rules, structure check, source errors reported back, changes kept in sync). Triggers: 'komplettes Kapitel mit Widgets', 'baue mir eine komplette Vorlesung', 'full workflow', 'mach alles'; 'review', 'prüf das Kapitel', 'überarbeite das Kapitel' or an existing .qmd path; 'baue den ganzen Kurs neu', 'alle Kapitel', 'Neuauflage', 'rebuild the course'; 'übersetze den Kurs', 'englische Fassung', 'translate the book'."
---

# Lecture Factory

Reiner **Orchestrator**: Diese Datei enthält keine inhaltlichen Regeln. Alle Schreib-, Review- und Syntaxregeln leben in `quarto-lecture` und seinen Referenzen — die Factory bestimmt nur Reihenfolge, Checkpoints und Reporting. Regeln hier nie restaten oder improvisieren; immer die kanonische Quelle laden.

**Kanonische Quellen** (Pfade lösen über `~/.claude/skills/` auf):

| Was | Quelle |
|---|---|
| Schreiben, Kontext, Workflow | `quarto-lecture/SKILL.md` |
| Perspektiven-Review | `quarto-lecture/references/review-protocol.md` |
| Syntax-/Element-Regeln | `quarto-lecture/references/qmd-quality-gate.md` |
| Accounting-Prüfung | `accounting-qa` Skill |
| Widget-Analyse & -Bau | `widget-pipeline` Skill |
| Buchmodus (Dateinamen, YAML, Umfang, Lesezeit) | `quarto-lecture/references/book-mode.md` |
| Tutorium, Kurzfall, Teaching Note | `tutorial-builder`, `case-builder` (Kurzfall-Modus), `teaching-note` |
| Curriculum, Fallunternehmen | `curriculum-architect` Skill (`_curriculum.md`, `_running_case.md`) |
| Kurs bauen / übersetzen | `references/series-mode.md`, `references/translate-mode.md` (dieser Skill) |

## Modus-Erkennung (vor allem anderen)

**Arbeitsmodus:**
- **CREATE** (Default): Rohinhalt für **ein** Kapitel wird übergeben → komplette Pipeline.
- **RE-REVIEW**: Ein Pfad zu einer bestehenden `.qmd` wird übergeben, oder Formulierungen wie „nochmal ansehen", „review", „prüf das Kapitel" — und kein neuer Rohinhalt. → Nur Review-Stränge, kein Neuschreiben.
- **SERIE**: mehrere oder alle Kapitel eines Kurses (Neuauflage, „alle Kapitel", „ganzen Kurs neu bauen"). → `references/series-mode.md`. Nie stattdessen CREATE je Kapitel mit eigenen Briefs nachbauen.
- **TRANSLATE**: ein Kurs soll in eine zweite Sprache (eigenes Repo), oder Änderungen der Quelle sollen in die Übersetzung. → `references/translate-mode.md`.

**Prüfniveau — bewusst zweistufig entlang des Arbeitsmodus:**
- **CREATE prüft schnell (inline):** QA und Perspektiven-Review laufen in einem Durchgang — keine Subagents, keine Live-Fetches (Normen gegen `accounting-qa/references/common-norms.md`), dieselben Prüfprotokolle und Ausgabeformate. Ziel ist der schnelle Weg zum lesbaren Entwurf; die Person liest das Kapitel ohnehin vor der Veröffentlichung.
- **RE-REVIEW prüft gründlich:** Subagent-Dispatch + Live-Norm-Verifikation. Das ist der Finalisierungsschritt vor der Veröffentlichung — wer prüfen lässt, will Gründlichkeit.

Es gibt keinen separaten „Full"-Trigger in CREATE: Der Weg zum Veröffentlichungsniveau ist immer der anschließende RE-REVIEW („prüf das Kapitel"). Der Checkpoint weist darauf hin. In SERIE übernimmt der kursweite Konsistenzlauf (accounting-qa, Umfang Kurs) diese Rolle.

**Buchmodus:** Liegt ein `_quarto.yml` mit `type: book` vor, gelten die Konventionen aus `quarto-lecture/references/book-mode.md` (Kapitel `NN_slug.qmd` ohne YAML, Tutorien `tutorials/tut_NN_slug.qmd`, 3.500–5.000 Wörter, kurze Zusammenfassung erlaubt). Die Factory prüft am Checkpoint bzw. im Konsistenzlauf die Lesezeit (Prosawörter ÷ 120 bei Zweitsprach-, ÷ 150 bei Muttersprach-Kohorte + ca. 3 Minuten je interaktivem Element) gegen das *Selbststudium* je Kapitel aus `_curriculum.md`. Quellenrang für Normen und Fakten: Originaltext der Norm (ifrs.org, gesetze-im-internet.de) > Kurs-Wiki > Modellwissen — auch das Wiki kann irren.

---

## CREATE Mode

### Pre-Flight (verbindlich, vor dem Intake)

1. **Curriculum:** `_curriculum.md` im Ausgabe-/Projektverzeichnis suchen. Gefunden → still laden: *Kohorte & Vorwissen* (Zielgruppen-Block), *Lehrformat* (Selbststudium je Kapitel), Lernziele und Material-Zeile des Kapitels, Vorgänger-/Nachfolger-Kapitel (Titel + Kernthemen), Terminologie-Konventionen sowie die Metazeile `**Wiki:** <pfad>`. Liegt `_running_case.md` vor: ebenfalls laden und an alle Stufen weitergeben — nur dessen Zahlen, Daten, Personen und Begriffe verwenden; neue Werte sammelt der Checkpoint unter `FACT SHEET ADDITIONS`. **Wiki-Erkennung (fragen & merken, portabel):**
   - Zeile gesetzt **und** Pfad (relativ zum `_curriculum.md`-Ordner) existiert → **Wiki-Modus** (siehe Schritt 3).
   - Zeile gesetzt, aber Pfad existiert **nicht** (z.B. Kolleg:in ohne lokalen Symlink) **oder** `**Wiki:** none` → klassischer Ablauf, **nicht fragen**.
   - Zeile **fehlt ganz → einmal fragen** „Wo liegt das Wiki für diesen Kurs? (absoluter Pfad — oder ‚keins')". Bei genanntem Pfad: (a) einen `wiki`-Symlink im Projektordner auf diesen Pfad anlegen (`ln -sfn <pfad> wiki`), (b) `wiki` in die `.gitignore` des Projekts eintragen, (c) **`**Wiki:** ./wiki`** (relativ!) unter `**Sprache:**` ins `_curriculum.md` schreiben. Bei „keins": `**Wiki:** none` schreiben. So bleibt nur der Symlink maschinen-lokal (gitignored), die Curriculum-Zeile ist portabel/pushbar — der Nutzer editiert nie von Hand und wird nie wieder gefragt.
   - Kein `_curriculum.md` gefunden → **einmalig aktiv fragen**: „Ich habe keine `_curriculum.md` gefunden — sie definiert Zielgruppe, Kapitelfolge und Terminologie. Soll ich sie mit dem `curriculum-architect` Skill anlegen?" Bei Nein: mit Default-Zielgruppe fortfahren (siehe quarto-lecture).
2. **Kontext-Materialien:** `context/kapitel-{nn}/` suchen. Gefunden und nicht leer → Dateiliste zeigen, fragen ob als Quellen verwenden. Enthält der Ordner `wiki/` (second-brain-Output): diese Dateien mit **höherem Gewicht** behandeln als rohe PDFs/Notizen — Wiki-Definitionen sind kursverbindlich. `context/shared/` immer mitlesen, falls vorhanden.
3. **Wiki-Vorwissen (nur im Wiki-Modus, sonst diesen Schritt überspringen):** Den `query wiki:`-Ablauf des `thws-wiki` Skills (Index → Grep → Synthese mit Provenienz) auf das Kapitelthema gegen den `**Wiki:**`-Pfad ausführen. Ergebnis ist ein **Wissensbriefing**, das jede Aussage trennt in *Wiki-belegt* (`[[Wikilink]]`) und *nicht im Wiki* (Eigenwissen) — diese Markierung wird in Stage 1 weitergetragen. Das Briefing geht als höchstgewichtetes Material in Stage 1 ein. Hat das Wiki zum Thema **keine** Seiten → nicht-blockierender Hinweis: „Das Wiki ist zu [Thema] noch leer — erst relevante Quellen ingesten (`update wiki`), oder ohne Wiki-Grundierung fortfahren?"

### Intake

Vor der ersten Zeile klären (aus Kontext ziehen, wo schon klar):

| Was | Woher |
|---|---|
| Rohinhalt | Notizen, RAG-Output, PDF-Text — was die Person liefert |
| Kapitelnummer | z. B. „Kapitel 3" → `03_…qmd`, `widgets/kapitel-03/` |
| Thema / Slug | aus `_curriculum.md`, sonst englischer Slug, z. B. „Rückstellungen" → `03_provisions.qmd` (Standalone-Projekt ohne Buch: `kap-03-rueckstellungen.qmd` laut quarto-lecture) |
| Untertitel | Aus dem Thema ableiten, falls nicht gegeben |
| Sprache | Aus dem Inhalt erkennen; bei Ambiguität fragen |
| Ausgabe-Verzeichnis | Projektpfad der Person oder `outputs/` |

Fehlt der Rohinhalt: fragen, nichts fabrizieren.

### Plannotator-Integration (optional, an zwei Punkten)

Verfügbarkeit prüfen (Plannotator-Plugin: Slash-Command bzw. MCP-Tools). Nicht verfügbar → denselben Inhalt im Chat zur Freigabe zeigen; der Ablauf bleibt identisch.

1. **Gliederungs-Freigabe (vor dem Draft):** Nach quarto-lecture Schritt 4 (Architect) entsteht die Kapitel-Skizze — H2-Sections mit Trinity-Rolle, SLO je Section, geplante Elemente, Diagramm-/Widget-Kandidaten. Diese Skizze als Plan im Plannotator öffnen und fragen: „Gliederung freigeben oder annotieren?" Annotationen einarbeiten, dann erst Schritt 5 (Draft) starten. Bei „direkt schreiben": ohne Freigabe fortfahren.
2. **Kapitel-Annotation (am Checkpoint):** siehe Checkpoint-Frage unten. Annotationen als **eine gebündelte Revision** anwenden, danach Quality Gate nur auf den geänderten Stellen.

### Stage 1 — Kapitel schreiben

`quarto-lecture` SKILL.md laden und dessen Workflow **vollständig** ausführen (Schritte 1–8), mit Orchestrierungs-Hinweisen:

- **Wiki-Modus:** Das Wissensbriefing (Pre-Flight 3) als höchstgewichtetes Material übergeben. **Hybrid-Regel:** wiki-belegte Definitionen/Normen sind **bindend** und überschreiben generisches Modellwissen; Didaktik, Beispiele, Aufbau und Breite kommen frei aus dem Trainingswissen. Wo eine **harte** neue Fachaussage oder Norm aus Trainingswissen ergänzt wird (im Wiki nicht belegt), dahinter einen render-unsichtbaren Marker setzen: `<!-- ergänzt (nicht im Wiki): [Begriff] -->`. Widersprüche Wiki↔Training nicht glätten, sondern im Text ausweisen. Kein Wiki-Modus → dieser Punkt entfällt.
- Nach Schritt 4 (Architect): Gliederungs-Freigabe via Plannotator anbieten (siehe oben), bevor Schritt 5 startet.
- Schritt 5a (Excalidraw-Dispatch), 5b (Review) und Schritt 8 (Widget-Angebot) übernimmmt die Factory — quarto-lecture überspringt sie laut eigener Skip-Regel. Excalidraw-Placeholder bleiben im Draft stehen.
- Nach quarto-lecture Schritt 7 (Save) führt die Factory aus:

**1d — QA + Perspektiven-Review (inline, auf dem gespeicherten Draft):**

Beide Prüfungen in einem Durchgang — erst QA-Scan nach accounting-qa-Protokoll (`accounting-qa` im Modus Inline: Zahlen per Python aus den Sachverhaltsangaben neu herleiten, Normen mit ✔-Eintrag in `common-norms.md` ohne Fetch, alle übrigen gegen den Originaltext), dann die drei Review-Linsen nach `quarto-lecture/references/review-protocol.md` selbst durchlaufen. Anwendung: ❌-Fehler sofort korrigieren; ⚠️ für den Checkpoint sammeln; Review-Verbesserungen als **eine gebündelte Edit-Runde** anwenden (nicht pro Befund einzeln editieren). Review läuft genau **einmal** pro Durchlauf.

**1e — Gate-Wiederholung nach Änderungen:** Haben QA oder Review Änderungen ausgelöst, das Quality Gate (`qmd-quality-gate.md`) nur auf den **geänderten Stellen** erneut anwenden. Kein Render-Test in CREATE — die Person rendert nach der Widget-Integration ohnehin selbst.

### Checkpoint (nicht verhandelbar)

> **Kapitel gespeichert als `{nn}_{slug}.qmd`** (~{Wörter} Wörter · Lesezeit ~{N} Min. bei {N} Min. Selbststudium laut Curriculum).
>
> **Review:** {N} Verbesserungen angewandt ({N} Stufe 1 · {N} Stufe 2 · {N} Stufe 3)
> **Accounting QA:** {N} ✅ · {N} ⚠️ · {N} ❌ [oder: keine Indikatoren]
> **FACT SHEET ADDITIONS:** {Liste oder „keine"} → per `curriculum-architect` UPDATE in `_running_case.md` eintragen? [nur mit Fallunternehmen]
>
> Wie weiter?
> **(a)** Visualisierungen bauen — Top 3 Widgets **und** die {N} Excalidraw-Diagramme aus den Placeholdern, parallel. [Diagramm-Anzahl aus den `<!-- Excalidraw: … -->`-Placeholdern zählen und konkret nennen; bei 0 Placeholdern nur Widgets anbieten]
> **(b)** Kapitel im Plannotator öffnen — Sie annotieren, ich arbeite die Anmerkungen ein. [nur anbieten, wenn Plannotator verfügbar]
> **(c)** Hier stoppen.
>
> *Hinweis: Vor der Veröffentlichung empfiehlt sich ein gründlicher Durchlauf mit Live-Norm-Verifikation — einfach „prüf das Kapitel" sagen (RE-REVIEW).*

Nach einer Plannotator-Runde (b): Annotationen einarbeiten, Gate auf geänderte Stellen, dann den Checkpoint erneut stellen (ohne Option b, falls keine weiteren Anmerkungen zu erwarten sind).

Auf explizite Bestätigung warten. Bei Nein oder „erst selbst ansehen": stoppen — die Pipeline kann später fortgesetzt werden.

### Stage 2 — Visualisierungen: Widgets + Excalidraw (nur nach Bestätigung)

Beide Visualisierungsarten entstehen erst **nach** der Textfreigabe — so wird keine Arbeit in Abschnitte investiert, die im Review noch umgebaut werden. Die Bestätigung von Checkpoint-Option (a) deckt **beide** ab — der Excalidraw-Dispatch braucht keine eigene Rückfrage mehr und darf nicht stillschweigend entfallen.

1. **Excalidraw-Dispatch:** `.qmd` auf `<!-- Excalidraw: … -->`-Placeholder scannen; pro Placeholder einen Subagent mit dem Dispatch-Prompt aus `quarto-lecture/references/excalidraw-patterns.md` — alle parallel, gleichzeitig mit Schritt 2. Verbleibt am Ende ein unaufgelöster Placeholder, im Summary ausweisen — nie kommentarlos stehen lassen.
2. **Widget-Pipeline:** `widget-pipeline` Skill (FULL mode) vollständig ausführen. Vorab-Scan: `<!-- Widget placeholder: … -->`-Kommentare aus Stage 1 als Kandidaten höchster Priorität behandeln; die Analyse füllt die restlichen Slots bis maximal 3. Die Pipeline übernimmt Analyse, Bau, Integration, postMessage-Listener und Verifikation gemäß ihrer eigenen SKILL.md.

### Final Summary

```
## Lecture Factory: Abgeschlossen ✓

### Kapitel
- Datei: {nn}_{slug}.qmd · ~[N] Wörter
- Interaktive Elemente (nativ): [Zählung]

### Visualisierungen
1. [Widget-Name] — widgets/kapitel-{nn}/widget-[name].html · eingebunden nach: [Section]
2. [Diagramm-Name] — diagrams/kapitel-{nn}/diagram-[slug].png · [gerendert / PNG ausstehend]
3. …

### Wiki-Lücken (nur Wiki-Modus, sonst weglassen)
- [Begriff] — aus Trainingswissen ergänzt, noch nicht im Wiki belegt

### Nächste Schritte
→ Kapitel inhaltlich prüfen · Widgets im Browser testen · quarto render {nn}_{slug}.qmd
→ Übersetzung vorhanden: Änderungen dort nachziehen (TRANSLATE-Sync)
```

**Wiki-Modus — Rückfluss:** Vor dem Summary das fertige `.qmd` nach `<!-- ergänzt (nicht im Wiki): … -->`-Markern greppen → diese Begriffe als „Wiki-Lücken" listen und anbieten: „Sollen diese Begriffe jetzt via `update wiki`/`ingest` ins Wiki aufgenommen werden?" — so wächst das Wiki beim Schreiben. Ohne Wiki-Modus entfällt der Block ersatzlos.

Wenn `present_files` verfügbar: alle Output-Dateien präsentieren.

---

## RE-REVIEW Mode

Ersetzt Pre-Flight, Intake, Stage 1 und Stage 2 vollständig.

1. **QMD lesen** — vollständig. Falls `_curriculum.md` im selben Projekt existiert: *Kohorte & Vorwissen* und die Lernziele des Kapitels für den Review laden; `_running_case.md` gegen die Fallzahlen des Kapitels halten.
2. **Drei Prüfstränge:**
   - **Perspektiven-Review:** `quarto-lecture/references/review-protocol.md` laden und befolgen (ein Reviewer, drei Linsen).
   - **Accounting QA** (konditional, parallel dispatchbar): bei Accounting-Indikatoren `accounting-qa` aufrufen.
   - **Quality Gate:** `qmd-quality-gate.md` laden, alle 14 Checks.
3. **Synthese:** Alle Gate-Violations sofort korrigieren. QA-❌ sofort korrigieren, ⚠️ der Person anzeigen. Review-Verbesserungsliste anwenden (Stufe-1 vollständig, dann 2, dann 3 — gemäß review-protocol.md).
4. **Render-Verifikation:** Wenn Quarto verfügbar, rendern und Fehler beheben.
5. **Report:**

> **Re-Review abgeschlossen: `[datei].qmd`**
>
> **Perspektiven-Review:** {N} Verbesserungen angewandt · {offene Punkte}
> **Accounting QA:** {N} ✅ · {N} ⚠️ · {N} ❌ [oder: keine Indikatoren]
> **Quality Gate:** {N} Violations korrigiert [oder: keine]
> **Render-Check:** ✓ / übersprungen
>
> [Je Verbesserung: Abschnitt → was geändert → aus welcher Linse]

Kein Widget-Angebot nach RE-REVIEW, außer die Person fragt explizit.

---

## SERIE Mode (ganzer Kurs)

Ablauf und Vorlagen: `references/series-mode.md` laden und befolgen. Kurzfassung:

1. **Serienplan** — `curriculum-architect` (Curriculum, ggf. `_running_case.md` mit Zeitachse und kursweiten Parametern), Serienplan je Kapitel, Pilotwahl, Skill-Abweichungen → **eine Freigabe** für alles.
2. **Pilot** — ein Kapitel mit Tutorium, Kurzfall und Teaching Note, mit mindestens einem Methoden-/Werkzeugabschnitt; mit derselben Skill-Kette gebaut wie die Serie; Freigabe anhand einer Musterliste.
3. **Parallelbau** — je Kapitel ein Subagent; der Brief lässt die Skills **aufrufen** (`quarto-lecture`, `tutorial-builder`, `case-builder`, `teaching-note`, `accounting-qa` Modus Inline, `html-builder` laut Plan) und ergänzt nur Kursspezifika. Ein Brief überstimmt nie einen Skill: passt eine Regel nicht, den Skill korrigieren oder die Ausnahme dem Autor ausdrücklich nennen.
4. **Konsistenzlauf** (Pflicht) — kursweit Zahlen, Daten, Notation, Begriffe, Lernziel-Bezüge, Zeitachse des Fallunternehmens, kapitelübergreifende Aussagen; über Kapitel, Tutorien, Moodle, Folien, Notes, Widgets; `accounting-qa` mit Umfang Kurs.
5. **Render-Check** — Buch, Tutorien (Angabe vor Lösung), Notes, ggf. Folien und Moodle-XML.

Kein Checkpoint je Kapitel; die zwei Freigaben (Plan, Pilot) sind nicht verhandelbar.

---

## TRANSLATE Mode (zweite Sprache)

Ablauf: `references/translate-mode.md` laden und befolgen — Glossar (Begriffe, Abkürzungen, Element-Labels, Formate) und Box-Regeln für länderspezifische Exkurse **vor** dem Übersetzen freigeben lassen; Struktur 1:1 (Dateinamen, Anker, Lernziel-Nummern); Div-Zählung Quelle ↔ Ziel; gefundene Fehler zuerst in der Quelle korrigieren; Inhaltsänderungen der Quelle immer nachziehen.

---

## Error Handling

- **Stage 1, dünner Input:** Nachfragen, nichts fabrizieren.
- **Checkpoint abgelehnt:** .qmd ist gespeichert, sauber stoppen.
- **Stage 2, <3 hochwertige Widgets:** Bauen was trägt (min. 1), im Summary begründen.
- **Widget-Bau scheitert:** Widget überspringen, weitermachen, im Summary vermerken.
- **Render scheitert wiederholt (>3 Versuche):** Stoppen, Fehler und bisherige Fixes der Person zeigen.

## Notes for Claude

- Der Checkpoint ist nicht verhandelbar — nie ohne Bestätigung in Stage 2. In SERIE ersetzen Serienplan- und Pilot-Freigabe die Checkpoints je Kapitel.
- Will die Person nur das Kapitel ohne Widgets: `quarto-lecture` ist der richtige Skill.
- Statusmeldungen knapp halten — die Person interessiert das Ergebnis, nicht die Pipeline-Schritte.
- Jede geladene Referenz gilt: wirklich befolgen, nicht paraphrasieren.
