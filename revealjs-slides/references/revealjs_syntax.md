# Reveal.js Syntax Guide für THWS (Prof. Kraus)

Verbindliche Syntax-Referenz für die Quarto-Format-Extension
[`c-kraus/thws-revealjs`](https://github.com/c-kraus/thws-revealjs).

Sie überträgt die MARP-Themes `thws.css` / `thws-pr.css` auf Reveal.js:
Inter 300, Orange `#FF6A00`, Dunkelblau `#003366` (Titelfolie), Anthrazit
`#343A40` (Strukturfolien), Logo oben links, Foliengröße 1280 × 720.

---

## 1. Setup

Neues Deck in einem bestehenden Ordner:

```bash
quarto add c-kraus/thws-revealjs --no-prompt
```

Neues Projekt von Grund auf (legt zusätzlich ein Starter-Deck an):

```bash
quarto use template c-kraus/thws-revealjs
```

Beides installiert alles unter `_extensions/c-kraus/`. Voraussetzung:
**Quarto ≥ 1.9.36** (das `a11y`-Plugin verlangt diese Version).

Zusätzlich im Projektordner nötig:

- `speaker-notes.css` — siehe Abschnitt 8
- `images/` für Abbildungen

---

## 2. Der YAML-Block

Dieser Block ist der Ausgangspunkt jedes Decks. Übernimm ihn und passe nur
Titel, Autor:in, Footer und ggf. die Plugin-Auswahl an.

```yaml
---
title: "Titel der Vorlesung"
subtitle: "Kapitel 3 — Untertitel"
author: "Prof. Dr. Christian Kraus"
institute: "THWS — Fakultät Wirtschaftsingenieurwesen"
date: today
date-format: "D. MMMM YYYY"
lang: de
speaker_notes_style: speaker-notes.css
format:
  thws-revealjs:
    footer: "Modulname · Kapitel 3"

revealjs-plugins:
  - attribution        # Bildquellen an der Folienkante
  - pointer            # Laserpointer (Taste p)
  - verticator         # Punkte für vertikale Folienstapel
  - quiz               # Multiple-Choice im Hörsaal
  - tabset             # echte Tabsets auf Folien
  - a11y               # Skip-Links, Fokus, Reduced Motion

filters:
  - roughnotation      # animierte Hervorhebungen
  - code-fullscreen    # Vollbild-Button an Codeblöcken
  - style-speaker-note # gestaltete Speaker Notes

pointer:
  key: "p"             # NICHT "q" — das belegt das Quiz-Plugin
  color: "#FF6A00"
  pointerSize: 18
verticator:
  color: "#FF6A00"
  debug: false
  tooltip: true
quiz:
  checkKey: "c"
  resetKey: "q"
  shuffleOptions: true
  includeScore: false
---
```

Optional zusätzlich verfügbar (im Repo enthalten, standardmäßig aus):

| Plugin | Aktivierung | Zweck |
|:---|:---|:---|
| `spotlight` | `revealjs-plugins` | Maus-Scheinwerfer; `toggleSpotlightOnMouseDown: false` und `spotlightOnKeyPressAndHold: 17` setzen, sonst frisst es jeden Klick |
| `simplemenu` | `revealjs-plugins` | Kapitelleiste; braucht zusätzliches Markup |
| `codefocus` | `revealjs-plugins` | Fragmente und Code-Highlights synchron |
| `reveal-auto-agenda` | `filters` | Agenda automatisch aus allen `#`-Überschriften |

`excalidraw` ist **nicht** mitgeliefert (10 MB React-Bundle). Bei Bedarf:
`quarto add parmsam/quarto-excalidraw`.

---

## 3. Folienstruktur

| Ebene | Ergebnis |
|:---|:---|
| `# Überschrift` | **Kapitel-Trennfolie**, automatisch im `structural`-Look (anthrazit, orange, vertikal zentriert) |
| `## Überschrift` | Inhaltsfolie |

Die Titelfolie erzeugt Quarto aus dem YAML — **niemals von Hand schreiben**.

```markdown
# Einstieg

## Agenda

1. Ausgangsfrage
2. Konzeptioneller Rahmen
```

---

## 4. Folienklassen

Klassen werden als Attribut an die Überschrift gehängt.

| Klasse | Syntax | Wirkung |
|:---|:---|:---|
| `structural` | `## Agenda {.structural}` | anthrazit, orange H1, weißer Text |
| `center` | `## {.center}` | Inhalt vertikal zentriert |
| `end` | `## Was bleibt {.end}` | Inhalt am unteren Rand |
| `fullscreen` | siehe Abschnitt 6 | Vollbild, ohne Logo und Foliennummer |
| `tiny-text` | `## Tabelle {.tiny-text}` | 18 px — **immer bei Tabellen** |
| `small-text` / `large-text` | dito | 22 px / 28 px |
| `titlepage` | `## … {.titlepage}` | Dunkelblau wie die Titelfolie |
| `no-structural` | `# Kapitel {.no-structural}` | verhindert die automatische Trennfolie |
| `no-logo` | `## … {.no-logo}` | Logo und Foliennummer ausblenden |

Inline: `[Text]{.tiny}`, `{.small}`, `{.large}`, `{.orange}`, `{.muted}`.

Quartos eigenes `{.smaller}` funktioniert und ist auf die THWS-Skala umgebogen.

Mehrere Klassen kombinieren: `## Zwischenfrage {.structural .quiz-question}`

---

## 5. Spalten

```markdown
::: {.columns}
::: {.column width="55%"}
- Bullet A
- Bullet B
:::
::: {.column width="45%"}
![](images/diagramm.svg)
:::
:::
```

---

## 6. Bilder

**Im Textfluss** — normale Markdown-Syntax, Bildhöhe ist auf 450 px begrenzt:

```markdown
![](images/normenpyramide.png)
```

**Vollbild mit Bildunterschrift:**

```markdown
## Bildtitel {.fullscreen background-image="images/foto.jpg" background-size="cover"}

##### Kontext zum Bild im weißen Kasten
```

**Bildquelle** — läuft senkrecht an der rechten Folienkante:

```markdown
::: {.attribution}
nach Trenczek/Tammen u. a. 2023
:::
```

⚠️ **Maximal ca. 40 Zeichen.** Längere Angaben laufen oben aus dem Bild.

---

## 7. Interaktion

### Zwischenfrage (Quiz)

Die Klasse gehört an die **Folie**, die richtige Antwort ist ein Span:

```markdown
## Zwischenfrage {.structural .quiz-question}

Welche Aussage trifft zu?

- Verfahren A ist immer genauer als B.
- [Die Wahl hängt vom Analysezweck ab.]{.correct}
- Beide Verfahren sind austauschbar.

::: {.notes}
Antwort anklicken, `c` prüft, `q` setzt zurück. Ablenker 3 lohnt die
Nachbesprechung, weil …
:::
```

Mehrfachauswahl: zusätzlich `.quiz-multiple` an die Folie.
Die Optionen werden gemischt — formuliere sie so, dass keine Reihenfolge
vorausgesetzt wird ("keine der obigen" funktioniert nicht).

### Tabset

```markdown
## Zwei Perspektiven {.small-text}

::: {.panel-tabset}

### Theorie

- Modellannahme 1

### Praxis

- Beobachtung aus dem Feld

:::
```

Im PDF wird **jeder Reiter zu einer eigenen Seite** — das Handout bleibt
vollständig.

### Roughnotation

```markdown
Der entscheidende Punkt ist [die Wechselwirkung]{.rn-fragment rn-type=circle rn-color="#FF6A00"}, nicht die Summe.
```

Die Annotation erscheint beim Weiterklicken (Fragment).
`rn-type`: `underline`, `circle`, `box`, `highlight`, `strike-through`,
`crossed-off`, `bracket`.

⚠️ **`[Text]{.rn-fragment}` — Span, nicht `[Text]()`.** Mit runden Klammern
entsteht ein Link mit leerem Ziel, der orange unterstrichen rendert und wie
ein kaputter Verweis aussieht.

### Fragmente und Aufzählungen

```markdown
::: {.incremental}
1. Erster Punkt
2. Zweiter Punkt
:::
```

---

## 8. Speaker Notes

```markdown
::: {.notes}
Zwei Minuten Murmelgruppe. Auflösung: lex superior, verstärkt durch Art. 31 GG.
:::
```

Sichtbar in der Speaker View (Taste `s`).

⚠️ **`speaker_notes_style: speaker-notes.css` muss im YAML stehen**, sonst
bricht der Render-Lauf ab (der Filter `style-speaker-note` stringifiziert den
Metadaten-Wert vor der nil-Prüfung). Die Datei muss existieren; ein Minimum:

```css
.speaker-controls-notes, .reveal .speaker-notes {
  font-family: "Inter", sans-serif;
  font-size: 20px;
  font-weight: 300;
  line-height: 1.45;
}
.speaker-controls-notes strong { font-weight: 700; color: #ff6a00; }
```

Die vollständige Datei liegt als `assets/speaker-notes.css` in diesem Skill —
einfach in den Projektordner kopieren.

---

## 9. Typografie und Sonstiges

- Zitate: `> Zitattext` — orange, 32 px, fett; auf `{.center}` besonders wirksam
- Formeln: `$\bar{x} = \frac{1}{n}\sum x_i$` bzw. `$$…$$`
- Konsequenzen sichtbar machen: `→ **Folge:** …` als eigene Zeile
- Tabellen: **immer** `{.tiny-text}` an die Folie
- Code:

  ````markdown
  ```{.python code-line-numbers="1|3-4"}
  import numpy as np
  ```
  ````

- Literaturverzeichnis: `bibliography: references.bib` im YAML, `[@citekey]`
  im Text, `::: {#refs} :::` auf der Literaturfolie

---

## 10. Rendern und PDF

```bash
quarto render folien.qmd
```

PDF-Handout: im Deck `e` drücken und drucken, oder `folien.html?print-pdf`
öffnen. Im Druck sind Fragmente ausgeklappt und Tabsets aufgeteilt.

**Tasten im Hörsaal:** `p` Laserpointer · `c` Quiz prüfen · `q` Quiz
zurücksetzen · `s` Speaker View · `e` Druckansicht · `f` Vollbild ·
`o` Übersicht

---

## 11. Stolperfallen — Checkliste vor der Übergabe

| Symptom | Ursache | Lösung |
|:---|:---|:---|
| Render bricht mit `Cannot get Attr from TypeNil` ab | `speaker_notes_style` fehlt | ins YAML aufnehmen, Datei anlegen |
| Laserpointer und Quiz-Reset stören sich | beide auf `q` | `pointer: key: "p"` |
| Hervorhebung rendert als orange unterstrichener Link | `[Text]()` statt `[Text]{…}` | runde Klammern entfernen |
| Quiz zeigt Häkchen statt Buttons | `.quiz-question` fehlt an der Folie oder `[…]{.correct}` fehlt | Abschnitt 7 |
| Bildquelle läuft oben aus dem Bild | Attribution zu lang | auf ca. 40 Zeichen kürzen |
| Überschrift wirkt zu groß auf `{.smaller}`-Folien | Quarto-Klasse skaliert die Sektion | `{.small-text}` verwenden |
| Jede Folie ist eine Kapitel-Trennfolie | Deck nutzt nur `#` | Inhaltsfolien mit `##` schreiben |
| Tabelle läuft über den Rand | `{.tiny-text}` fehlt | ergänzen |
