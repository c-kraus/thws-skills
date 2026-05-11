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

| Skill | Aufruf | Was er tut |
|---|---|---|
| **lecture-factory** | `/lecture-factory` | End-to-End-Workflow: Rohmaterial → fertiges `.qmd`-Kapitel mit integrierten Widgets. Orchestriert `quarto-lecture` + `widget-pipeline`. |
| **quarto-lecture** | `/quarto-lecture` | Schreibt ein hybrides Quarto-Skript für Single Source Publishing (Moodle-Website + PDF-Skriptum). |
| **marp-slides** | `/marp-slides` | Erstellt MARP-Präsentationsfolien im THWS-Corporate-Design. |
| **slides-to-notes** | `/slides-to-notes` | Wandelt MARP-Folien in ein vollständiges Quarto-Begleitskript um (Prosa, BibTeX, Quellenverifikation). |
| **qmd-corrector** | `/qmd-corrector` | Liest ein `.qmd` und behebt YAML- und Div-Syntaxfehler; gibt einen strukturierten Fehlerbericht aus. |

### Interaktive Widgets

| Skill | Aufruf | Was er tut |
|---|---|---|
| **widget-pipeline** | `/widget-pipeline` | Analysiert ein `.qmd`, baut die drei didaktisch wertvollsten HTML-Widgets und integriert sie als IFRAMEs. Alternativ: reine Analyse ohne Build. |
| **html-builder** | `/html-builder` | Baut einzelne interaktive HTML/JS-Widgets für Visualisierungen, Simulationen oder Lernspiele. |
| **widget-analyzer** | `/widget-analyzer` | Standalone-Analyse eines `.qmd` auf Widget-Potenziale (ohne Build). |

### Lehrmaterialien & Aufgaben

| Skill | Aufruf | Was er tut |
|---|---|---|
| **case-builder** | `/case-builder` | Erstellt didaktisch fundierte Business-Fallstudien nach Kupp & Mueller als `.qmd`. |
| **moodle-questions** | `/moodle-questions` | Generiert Moodle-XML-Quizfragen (Multiple Choice, Cloze, Matching, numerisch …) aus Lehrinhalt. |
| **accounting-qa** | `/accounting-qa` | Qualitätssicherung für Accounting-Kapitel: prüft Berechnungen (Python), Normen (HGB/IFRS) und Literaturverweise parallel. |

### Verwaltung & Kommunikation

| Skill | Aufruf | Was er tut |
|---|---|---|
| **thws-brief** | `/thws-brief` | Erstellt THWS-Briefe im Corporate-Design als PDF (Quarto + brief-typst-Extension). |
| **ba-gutachten** | `/ba-gutachten` | Erstellt akademische Kurzgutachten für Bachelor-/Masterarbeiten an der THWS als `.qmd`. |

### Tools & Integrationen

| Skill | Aufruf | Was er tut |
|---|---|---|
| **zotero-skill** | `/zotero-skill` | Zugriff auf die lokale Zotero-7-Bibliothek (localhost:23119) und die Zotero Web API. |
| **notebooklm** | `/notebooklm` | Vollständiger API-Zugriff auf Google NotebookLM — Notebooks anlegen, Quellen hinzufügen, Podcasts generieren. |
| **excalidraw-diagram** | `/excalidraw-diagram` | Erstellt Excalidraw-Diagramme (Workflows, Architekturen, Konzepte) als JSON. |

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


