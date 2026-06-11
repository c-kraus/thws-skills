---
name: lecture-factory
description: "Full end-to-end workflow for creating OR reviewing a complete, widget-enhanced Quarto lecture. Two modes: (1) CREATE — takes raw content (notes, PDFs, RAG output) and produces a production-ready .qmd with widgets; (2) RE-REVIEW — takes an existing .qmd path and runs a full review: Perspektiven-Review + accounting-qa + QMD quality gate, then applies improvements. Trigger CREATE for: 'Erstelle mir ein komplettes Kapitel mit Widgets', 'baue mir eine komplette Vorlesung', 'full workflow', 'mach alles', 'von Anfang bis Ende'. Trigger RE-REVIEW for: 'nochmal ansehen', 'review', 'quality gate darüber laufen lassen', 'prüf das Kapitel', 'überarbeite das bestehende Kapitel', 'verbessere das Kapitel', or any request where an existing .qmd path is provided instead of raw content."
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
| Curriculum-Anlage | `curriculum-architect` Skill |

## Modus-Erkennung (vor allem anderen)

**Arbeitsmodus:**
- **CREATE** (Default): Rohinhalt wird übergeben → komplette Pipeline.
- **RE-REVIEW**: Ein Pfad zu einer bestehenden `.qmd` wird übergeben, oder Formulierungen wie „nochmal ansehen", „review", „prüf das Kapitel" — und kein neuer Rohinhalt. → Nur Review-Stränge, kein Neuschreiben.

**Prüfniveau — bewusst zweistufig entlang des Arbeitsmodus:**
- **CREATE prüft schnell (inline):** QA und Perspektiven-Review laufen in einem Durchgang — keine Subagents, keine Live-Fetches (Normen gegen `accounting-qa/references/common-norms.md`), dieselben Prüfprotokolle und Ausgabeformate. Ziel ist der schnelle Weg zum lesbaren Entwurf; die Person liest das Kapitel ohnehin vor der Veröffentlichung.
- **RE-REVIEW prüft gründlich:** Subagent-Dispatch + Live-Norm-Verifikation. Das ist der Finalisierungsschritt vor der Veröffentlichung — wer prüfen lässt, will Gründlichkeit.

Es gibt keinen separaten „Full"-Trigger in CREATE: Der Weg zum Veröffentlichungsniveau ist immer der anschließende RE-REVIEW („prüf das Kapitel"). Der Checkpoint weist darauf hin.

---

## CREATE Mode

### Pre-Flight (verbindlich, vor dem Intake)

1. **Curriculum:** `_curriculum.md` im Ausgabe-/Projektverzeichnis suchen. Gefunden → still laden: Zielgruppen-Block, Vorgänger-/Nachfolger-Kapitel (Titel + Kernthemen), Terminologie-Konventionen. Nicht gefunden → **einmalig aktiv fragen**: „Ich habe keine `_curriculum.md` gefunden — sie definiert Zielgruppe, Kapitelfolge und Terminologie. Soll ich sie mit dem `curriculum-architect` Skill anlegen?" Bei Nein: mit Default-Zielgruppe fortfahren (siehe quarto-lecture).
2. **Kontext-Materialien:** `context/kapitel-{nn}/` suchen. Gefunden und nicht leer → Dateiliste zeigen, fragen ob als Quellen verwenden. Enthält der Ordner `wiki/` (second-brain-Output): diese Dateien mit **höherem Gewicht** behandeln als rohe PDFs/Notizen — Wiki-Definitionen sind kursverbindlich. `context/shared/` immer mitlesen, falls vorhanden.

### Intake

Vor der ersten Zeile klären (aus Kontext ziehen, wo schon klar):

| Was | Woher |
|---|---|
| Rohinhalt | Notizen, RAG-Output, PDF-Text — was die Person liefert |
| Kapitelnummer | z. B. „Kapitel 3" → `kap-03-…qmd`, `widgets/kapitel-03/` |
| Thema / Slug | z. B. „Rückstellungen" → `kap-03-rueckstellungen.qmd` |
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

- Nach Schritt 4 (Architect): Gliederungs-Freigabe via Plannotator anbieten (siehe oben), bevor Schritt 5 startet.
- Schritt 5a (Excalidraw-Dispatch), 5b (Review) und Schritt 8 (Widget-Angebot) übernimmmt die Factory — quarto-lecture überspringt sie laut eigener Skip-Regel. Excalidraw-Placeholder bleiben im Draft stehen.
- Nach quarto-lecture Schritt 7 (Save) führt die Factory aus:

**1d — QA + Perspektiven-Review (inline, auf dem gespeicherten Draft):**

Beide Prüfungen in einem Durchgang — erst QA-Scan nach accounting-qa-Protokoll (Berechnungen per Python verifizieren, Normen gegen `common-norms.md`, keine Fetches), dann die drei Review-Linsen nach `quarto-lecture/references/review-protocol.md` selbst durchlaufen. Anwendung: ❌-Fehler sofort korrigieren; ⚠️ für den Checkpoint sammeln; Review-Verbesserungen als **eine gebündelte Edit-Runde** anwenden (nicht pro Befund einzeln editieren). Review läuft genau **einmal** pro Durchlauf.

**1e — Gate-Wiederholung nach Änderungen:** Haben QA oder Review Änderungen ausgelöst, das Quality Gate (`qmd-quality-gate.md`) nur auf den **geänderten Stellen** erneut anwenden. Kein Render-Test in CREATE — die Person rendert nach der Widget-Integration ohnehin selbst.

### Checkpoint (nicht verhandelbar)

> **Kapitel gespeichert als `kap-{nn}-{slug}.qmd`** (~{Wörter} Wörter).
>
> **Review:** {N} Verbesserungen angewandt ({N} Stufe 1 · {N} Stufe 2 · {N} Stufe 3)
> **Accounting QA:** {N} ✅ · {N} ⚠️ · {N} ❌ [oder: keine Indikatoren]
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
- Datei: kap-{nn}-{slug}.qmd · ~[N] Wörter
- Interaktive Elemente (nativ): [Zählung]

### Visualisierungen
1. [Widget-Name] — widgets/kapitel-{nn}/widget-[name].html · eingebunden nach: [Section]
2. [Diagramm-Name] — diagrams/kapitel-{nn}/diagram-[slug].png · [gerendert / PNG ausstehend]
3. …

### Nächste Schritte
→ Kapitel inhaltlich prüfen · Widgets im Browser testen · quarto render kap-{nn}-{slug}.qmd
```

Wenn `present_files` verfügbar: alle Output-Dateien präsentieren.

---

## RE-REVIEW Mode

Ersetzt Pre-Flight, Intake, Stage 1 und Stage 2 vollständig.

1. **QMD lesen** — vollständig. Falls `_curriculum.md` im selben Projekt existiert: Zielgruppen-Block für den Review laden.
2. **Drei Prüfstränge:**
   - **Perspektiven-Review:** `quarto-lecture/references/review-protocol.md` laden und befolgen (ein Reviewer, drei Linsen).
   - **Accounting QA** (konditional, parallel dispatchbar): bei Accounting-Indikatoren `accounting-qa` aufrufen.
   - **Quality Gate:** `qmd-quality-gate.md` laden, alle 11 Checks.
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

## Error Handling

- **Stage 1, dünner Input:** Nachfragen, nichts fabrizieren.
- **Checkpoint abgelehnt:** .qmd ist gespeichert, sauber stoppen.
- **Stage 2, <3 hochwertige Widgets:** Bauen was trägt (min. 1), im Summary begründen.
- **Widget-Bau scheitert:** Widget überspringen, weitermachen, im Summary vermerken.
- **Render scheitert wiederholt (>3 Versuche):** Stoppen, Fehler und bisherige Fixes der Person zeigen.

## Notes for Claude

- Der Checkpoint ist nicht verhandelbar — nie ohne Bestätigung in Stage 2.
- Will die Person nur das Kapitel ohne Widgets: `quarto-lecture` ist der richtige Skill.
- Statusmeldungen knapp halten — die Person interessiert das Ergebnis, nicht die Pipeline-Schritte.
- Jede geladene Referenz gilt: wirklich befolgen, nicht paraphrasieren.
