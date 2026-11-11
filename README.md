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
| **lecture-factory** | `/lecture-factory` | Orchestrator mit vier Modi: **CREATE** (Rohmaterial → fertiges Kapitel + Widgets), **RE-REVIEW** (bestehendes `.qmd` → Review + QA + Quality Gate + Render-Check), **SERIE** (ganzen Kurs neu bauen: Plan einmal freigeben, Pilotkapitel als Muster abnehmen, Parallelbau, in dem jeder Subagent die Skills selbst aufruft, kursweiter Konsistenzlauf) und **TRANSLATE** (Zweitsprachfassung in eigenem Repo mit Glossar, Box-Regeln und Strukturabgleich). Pre-Flight: `_curriculum.md`, `_running_case.md`, Wiki. Empfohlener Einstiegspunkt. | `quarto-lecture`, `widget-pipeline`, `accounting-qa`, `curriculum-architect`, `tutorial-builder`, `case-builder`, `teaching-note` |
| **quarto-lecture** | `/quarto-lecture` | Schreibt ein hybrides Quarto-Skript für Single Source Publishing (Moodle-Website + PDF-Skriptum), einzeln oder als Buchkapitel im BUA-Stil (`NN_slug.qmd`, kein YAML, 3.500–5.000 Wörter). Pflicht: Lernziel-Callout, Methodenabschnitte mit Alltagsbeispiel, Herleitung im Deep Dive und Tutoriumsverweis, Rundungsregel, Leselast-Prüfung (`scripts/reading_load.py`). Hält die kanonischen Referenzen der Pipeline: `review-protocol.md`, `qmd-quality-gate.md` (14 Checks), `element-placement.md`, `book-mode.md`, `chapter-patterns.md`. | — |
| **curriculum-architect** | `/curriculum-architect` | Erstellt und pflegt die `_curriculum.md`: Lehrformat, Kohorte & tatsächliches Vorwissen, kritische Themenauswahl, kursweit nummerierte Lernziele je Kapitel, Material je Kapitel, Terminologie. Legt bei durchgehendem Fallunternehmen das Faktenblatt `_running_case.md` mit verbindlicher Zeitachse an und trägt `FACT SHEET ADDITIONS` ein. | — |
| **marp-slides** | `/marp-slides` | Entwirft Lehreinheiten als MARP-Folien im THWS-Design: kalter Einstieg statt Agenda, erst erleben dann benennen, strukturierte Übungen, „Zum Mitnehmen", Anhang, Faktenprüfung und Überlauf-Check. Auch zum Überarbeiten bestehender Folien und für DE/EN parallel. Statisch, ohne Setup — die kürzere Route, wenn keine Interaktion gebraucht wird. | — |
| **revealjs-slides** | `/revealjs-slides` | Erstellt interaktive Quarto-Reveal.js-Folien im THWS-Design (Format-Extension `c-kraus/thws-revealjs`): Zwischenfragen mit Quiz-Plugin, Tabsets, Hervorhebungen, Laserpointer, Speaker Notes und PDF-Handout aus derselben Datei. Für Sitzungen mit Interaktion oder Web-Auslieferung. | `quarto` ≥ 1.9.36 |
| **slides-to-notes** | `/slides-to-notes` | Wandelt MARP-Folien in ein vollständiges Quarto-Begleitskript (Skriptum) um: Stichpunkte → Fließtext, Inline-Zitate → BibTeX, fehlende Quellen per CrossRef/arXiv automatisch ergänzt. | — |
| **qmd-corrector** | `/qmd-corrector` | Liest ein `.qmd`, findet und behebt alle YAML- und Div-Syntaxfehler in-place (Regeln aus dem kanonischen `qmd-quality-gate.md`), verifiziert per `quarto render` und gibt einen strukturierten Fehlerbericht aus. | `quarto-lecture` (Regeln) |
| **quarto-book-setup** | `/quarto-book-setup` | Wandelt eine Sammlung einzelner `.qmd`-Kapitel in ein vollständiges Quarto-Book-Projekt um: `_quarto.yml`, YAML-Patches, moodle-html-Extension und GitHub-Actions-Workflow für automatisches Deployment auf GitHub Pages. | — |

### Interaktive Widgets

| Skill | Aufruf | Was er tut | Benötigt |
|---|---|---|---|
| **widget-pipeline** | `/widget-pipeline` | Analysiert ein `.qmd` auf Widget-Potenziale, baut die drei didaktisch wertvollsten Widgets, testet sie gegen das Kapitel und integriert sie als IFRAMEs. Weitere Modi: reine Analyse; **AUDIT** bestehender Widgets gegen ihre Kapitel inkl. Suche nach verwaisten Widgets (`scripts/widget_inventory.py`). | `html-builder`, `widget-analyzer` (Muster) |
| **html-builder** | `/html-builder` | Baut einzelne interaktive HTML/JS-Widgets als standalone, IFRAME-einbettbare Dateien, eine Datei für alle Sprachen (`?lang=en`). Pflicht-Funktionstest: Standardwerte rechnen das Kapitelbeispiel exakt nach, Regler decken alle Textwerte ab, Konventionen wie im Kapitel. | — |
| **widget-analyzer** | `/widget-analyzer` | Standalone-Analyse eines `.qmd` auf Widget-Potenziale mit konkreten Spezifikationen — ohne Build. Kanonische Analyselogik liegt in `widget-pipeline/references/analyzer-patterns.md`. | — |

### Lehrmaterialien & Aufgaben

| Skill | Aufruf | Was er tut | Benötigt |
|---|---|---|---|
| **tutorial-builder** | `/tutorial-builder` | Erstellt knappe Übungsblätter als `.qmd` im **`tutorial-typst`**-Format (Single Source: Angabe- + Lösungsblatt über `show_solutions`). Plant aus den Lernzielen in `_curriculum.md`: Lernziel- und Minutenzeile je Aufgabe, Abdeckungstabelle, ca. 75 von 90 Minuten. Sechs Aufgabentypen inkl. Kurzfall, Serienmodus für alle Blätter, Python-Arithmetik-Check, Typst-Fallen. | `tutorial-typst`-Extension im Projekt (`_extensions/c-kraus/tutorial/`) |
| **exam-builder-skill** | `/exam-builder-skill` | Erstellt vollständige Klausuren als `.qmd` mit der **`exam-typst`**-Extension: Fallstudie nach Kupp & Mueller, Deckblatt, automatische Punktsummen, strukturierte Aufgaben. DE und EN. | `exam-typst`-Extension im Projekt |
| **case-builder** | `/case-builder` | Erstellt Business-Fallstudien nach Kupp & Mueller als `.qmd`. Zwei Modi: **Kurzfall** (max. 400 Wörter, eine Entscheidung, ca. 30 Minuten, Standard fürs Tutorium) und **Langfall** (1.500–3.000 Wörter, Teaching Note mit 90-Minuten-Plan). Python-Arithmetikprüfung, Lernziel-Tags, Faktenblatt-Regel. | — |
| **moodle-questions** | `/moodle-questions` | Generiert Moodle-XML-Quizfragen (Multiple Choice, Cloze, Matching, Numerisch, Wahr/Falsch, Essay) aus Lehrinhalt. Klärt Fragetyp und Sprache im Vorfeld, prüft Bijektionen bei Matching und verifiziert numerische Lösungen per Python. | — |
| **accounting-qa** | `/accounting-qa` | Qualitätssicherung für Accounting-, Finance- und andere quantitative Inhalte: Zahlen per Python aus den Sachverhaltsangaben neu herleiten, Widget-Werte und Regler, Normzitate gegen den Originaltext (ifrs.org, gesetze-im-internet.de), Sachverhalts-Trigger, Literatur (APA). Umfang: Datei, Material-Set oder ganzer Kurs; parallel oder inline. | — |

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
| **excalidraw-diagram** | `/excalidraw-diagram` | Erstellt Excalidraw-Diagramme (Workflows, Architekturen, Konzepte). Datei-Pipeline läuft über `scripts/build_diagram.py`: kompakte Spec → fertiges `.excalidraw` mit gemessenen Textmaßen, auto-dimensionierten Boxen und gebundenen Labels — ein Verifikationsrender statt Korrektur-Loop. Live-Canvas via Excalidraw-MCP weiterhin möglich. | Canvas-Server für PNG-Render |

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



---

## Abgleich mit claude.ai

Die Repos sind maßgeblich, claude.ai erhält Kopien (Upload über *Anpassungen → Skills → Hinzufügen → Skill hochladen*, „Hochladen und ersetzen“ behält die Versionshistorie).

Skills in `claude-ai-only.txt` werden von `install.sh` nicht nach `~/.claude/skills` verlinkt, weil sie über claude.ai bereits aktiv sind (sonst sieht Claude sie doppelt). `skill-sync-check.py` vergleicht sie direkt mit dem Repo-Ordner.

`tools/skill-sync-check.py` vergleicht jeden Skill in `~/.claude/skills` mit der Kopie, die die Claude-Desktop-App von deinen claude.ai-Skills anlegt, und meldet je Skill: *gleich*, *Repo neuer* (hochladen), *claude.ai neuer* (ins Repo holen) oder *nur claude.ai*.

```bash
python3 tools/skill-sync-check.py          # vollständiger Bericht
python3 tools/skill-sync-check.py --all    # inkl. Skills, die nur lokal existieren
python3 tools/skill-sync-check.py --hook   # nur Abweichungen (für den SessionStart-Hook)
```

Als SessionStart-Hook in `~/.claude/settings.json` meldet der Check Abweichungen beim Start jeder Claude-Code-Session. Skills, die bewusst nicht abgeglichen werden, kommen zeilenweise in `~/.claude/skill-sync-ignore`. Die Kopie der Desktop-App wird erst nach deren nächster Synchronisierung aktuell — frische Uploads erscheinen also ggf. noch als „Repo neuer“.
