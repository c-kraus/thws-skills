# THWS Skills für Claude Code

Eine Sammlung von [Claude Code Skills](https://docs.anthropic.com/en/docs/claude-code/skills) für die Lehre an der THWS — von der Vorlesungserstellung über interaktive Widgets bis zur Qualitätssicherung.

## Voraussetzungen

- [Claude Code](https://claude.ai/code) installiert (`npm install -g @anthropic-ai/claude-code`)
- macOS oder Linux

## Installation

```bash
git clone <repo-url> ~/Dev/thws-skills
cd ~/Dev/thws-skills
bash install.sh
```

Das Skript legt für jeden Skill-Ordner einen Symlink in `~/.claude/skills/` an. Nach der Installation stehen alle Skills in jeder Claude-Code-Session unter `/skill-name` zur Verfügung.

**Update:** Einfach `git pull` und `bash install.sh` erneut ausführen — bestehende Symlinks werden aktualisiert.

---

## Skills im Überblick

### Vorlesungserstellung

| Skill | Aufruf | Was er tut | Benötigt |
|---|---|---|---|
| **lecture-factory** | `/lecture-factory` | Reiner Orchestrator mit zwei Modi: **CREATE** (Rohmaterial → fertiges `.qmd` + Widgets in einem Zug) und **RE-REVIEW** (bestehendes `.qmd` → Perspektiven-Review + QA + Quality Gate + Render-Check). Verbindlicher Pre-Flight: `_curriculum.md` (Zielgruppe) und `context/`-Wiki. Empfohlener Einstiegspunkt. | `quarto-lecture`, `widget-pipeline`, `accounting-qa`, `curriculum-architect` |
| **quarto-lecture** | `/quarto-lecture` | Schreibt ein hybrides Quarto-Skript für Single Source Publishing (Moodle-Website + PDF-Skriptum) nach der Trinity-of-Depth-Didaktik. Zielgruppen-kalibriert über `_curriculum.md`, Begriffs-Erstnennungsregel und Perspektiven-Review (1 Reviewer, 3 Linsen). Hält die kanonischen Referenzen der Pipeline: `review-protocol.md`, `qmd-quality-gate.md`, `element-placement.md`, `excalidraw-patterns.md`. | — |
| **curriculum-architect** | `/curriculum-architect` | Erstellt und pflegt die `_curriculum.md` — strukturelles Rückgrat eines Kurses: Zielgruppen-Block (Vorwissen, Stolpersteine), Kapitelliste mit Kernthemen, Terminologie-Konventionen. Kalibriert quarto-lecture und den Perspektiven-Review. | — |
| **marp-slides** | `/marp-slides` | Erstellt MARP-Präsentationsfolien im THWS-Corporate-Design aus Gliederungen, Rohmaterial oder fertigen `.qmd`-Kapiteln. | — |
| **slides-to-notes** | `/slides-to-notes` | Wandelt MARP-Folien in ein vollständiges Quarto-Begleitskript (Skriptum) um: Stichpunkte → Fließtext, Inline-Zitate → BibTeX, fehlende Quellen per CrossRef/arXiv automatisch ergänzt. | — |
| **qmd-corrector** | `/qmd-corrector` | Liest ein `.qmd`, findet und behebt alle YAML- und Div-Syntaxfehler in-place (Regeln aus dem kanonischen `qmd-quality-gate.md`), verifiziert per `quarto render` und gibt einen strukturierten Fehlerbericht aus. | `quarto-lecture` (Regeln) |
| **quarto-book-setup** | `/quarto-book-setup` | Wandelt eine Sammlung einzelner `.qmd`-Kapitel in ein vollständiges Quarto-Book-Projekt um: `_quarto.yml`, YAML-Patches, moodle-html-Extension und GitHub-Actions-Workflow für automatisches Deployment auf GitHub Pages. | — |

### Interaktive Widgets

| Skill | Aufruf | Was er tut | Benötigt |
|---|---|---|---|
| **widget-pipeline** | `/widget-pipeline` | Analysiert ein `.qmd` auf Widget-Potenziale, baut die drei didaktisch wertvollsten Widgets als HTML und integriert sie als IFRAMEs. Alternativmodus: reine Analyse ohne Build. | `html-builder`, `widget-analyzer` (Muster) |
| **html-builder** | `/html-builder` | Baut einzelne interaktive HTML/JS-Widgets (Visualisierungen, Simulationen, Lernspiele) als standalone, IFRAME-einbettbare Dateien. | — |
| **widget-analyzer** | `/widget-analyzer` | Standalone-Analyse eines `.qmd` auf Widget-Potenziale mit konkreten Spezifikationen — ohne Build. Kanonische Analyselogik liegt in `widget-pipeline/references/analyzer-patterns.md`. | — |

### Lehrmaterialien & Aufgaben

| Skill | Aufruf | Was er tut | Benötigt |
|---|---|---|---|
| **tutorial-builder** | `/tutorial-builder` | Erstellt knappe Übungsblätter und Einzelaufgaben als `.qmd` mit `show_solutions`-Toggle (eine Datei, Aufgaben- und Lösungsblatt). Fünf Aufgabentypen (Rechnen, MC, Kurzszenario, Verständnis, Buchung/Norm), Schwierigkeitsprogression, Python-Arithmetik-Check, Lernziel-Abgleich. Aufgaben auf Wunsch an `exam-builder` exportierbar. | — |
| **case-builder** | `/case-builder` | Erstellt didaktisch fundierte Business-Fallstudien nach Kupp & Mueller als `.qmd`: Explorations-Interview, Falltext mit integrierter Datentabelle und Aufgaben, Python-Arithmetikprüfung, Dreifach-Perspektiven-Review (Methodiker / Erstleser / Diskussionsleiter) und Teaching Note mit 90-Minuten-Diskussionsplan. Optional: Lernziel-Abgleich mit Begleitvorlesung. | — |
| **moodle-questions** | `/moodle-questions` | Generiert Moodle-XML-Quizfragen (Multiple Choice, Cloze, Matching, Numerisch, Wahr/Falsch, Essay) aus Lehrinhalt. Klärt Fragetyp und Sprache im Vorfeld, prüft Bijektionen bei Matching und verifiziert numerische Lösungen per Python. | — |
| **accounting-qa** | `/accounting-qa` | Qualitätssicherung für Accounting-Kapitel: drei parallele Subagents prüfen Berechnungen (Python-Ausführung), Normverweise (HGB/IFRS/IAS/AktG — bei Unsicherheit Live-Abgleich gegen gesetze-im-internet.de) und Literaturzitate. Standalone oder eingebettet in `lecture-factory`. | — |

### Verwaltung & Kommunikation

| Skill | Aufruf | Was er tut | Benötigt |
|---|---|---|---|
| **thws-brief** | `/thws-brief` | Erstellt THWS-Briefe im Corporate-Design als PDF (Quarto + brief-typst-Extension). Trigger: jeder Hinweis auf einen zu schreibenden Brief oder ein Anschreiben. | — |
| **ba-gutachten** | `/ba-gutachten` | Erstellt akademische Kurzgutachten für Bachelor- und Masterarbeiten an der THWS (Fakultät Wirtschaftsingenieurwesen) als `.qmd`, das als THWS-Hochschulbrief rendert. | — |

### Tools & Integrationen

| Skill | Aufruf | Was er tut | Benötigt |
|---|---|---|---|
| **zotero-skill** | `/zotero-skill` | Zugriff auf die lokale Zotero-7-Bibliothek (localhost:23119) und die Zotero Web API: Quellen suchen, BibTeX exportieren, Sammlungen verwalten. | Zotero 7 läuft lokal |
| **notebooklm** | `/notebooklm` | Vollständiger API-Zugriff auf Google NotebookLM — Notebooks anlegen, Quellen hinzufügen, alle Artefakttypen generieren (inkl. Podcast), Formate herunterladen. Auch für Features, die die Web-UI nicht bietet. | Google-Konto |
| **excalidraw-diagram** | `/excalidraw-diagram` | Erstellt Excalidraw-Diagramme (Workflows, Architekturen, Konzepte) direkt im Excalidraw-MCP — keine JSON-Datei nötig. | Excalidraw MCP |

---

## Typischer Workflow

```
Rohmaterial (PDF, Notizen, RAG-Output)
        ↓
  /lecture-factory          ← Schreibt .qmd + baut Widgets in einem Zug
        ↓
  /accounting-qa            ← Optional: Berechnungen, Normen und Literatur prüfen
        ↓
  /marp-slides              ← Optional: Folien aus dem fertigen Kapitel
        ↓
  /moodle-questions         ← Optional: Prüfungsfragen für Moodle exportieren
```

---

## Moodle-Hinweise

### Klausur vs. Lernstandskontrolle

Der `/moodle-questions`-Skill erzeugt immer vollständiges Feedback im XML. Ob Studierende dieses Feedback sehen, wird nicht im XML, sondern in den **Moodle-Quiz-Einstellungen** unter *Überprüfungsoptionen* gesteuert:

| | Während der Klausur | Direkt danach | Später (Quiz offen) | Nach Abschluss |
|---|:---:|:---:|:---:|:---:|
| Punkte | ✗ | ✗ | ✗ | ✓ |
| Feedback | ✗ | ✗ | ✗ | ✓ |
| Richtige Antwort | ✗ | ✗ | ✗ | ✓ |

**Empfehlung für Klausuren:** Alle Häkchen auf „Nach Abschluss" setzen — Studierende sehen Feedback und Lösungen erst nachdem das Quiz vom Dozenten geschlossen wurde. So können die Fragen auch nach der Klausur als Lernmaterial genutzt werden.

Für **Lernstandskontrollen** (formativ) hingegen „Direkt danach" aktivieren, damit das Feedback sofort als Lernanlass wirkt.

---

## Neuen Skill hinzufügen

1. Ordner `<skill-name>/` im Repo anlegen
2. `SKILL.md` mit YAML-Frontmatter (`name`, `description`) und Skill-Logik schreiben
3. `bash install.sh` ausführen

Skills werden von Claude Code automatisch erkannt sobald der Symlink in `~/.claude/skills/` liegt.

---


