# MARP-Syntax für THWS (Prof. Kraus)

Verbindliche Syntax-Referenz. Für Struktur und Didaktik: `lecture_design.md`.

## 1. Globaler Header

Jede Datei beginnt mit diesem Block. Der Kursname im `header` ist in **allen** Folien eines Kurses identisch (z. B. `Werteseminar`, in der englischen Fassung `Values Seminar`).

```markdown
---
marp: true
theme: thws-pr
paginate: true
header: '**Kursname** <br> Prof. Dr. Christian Kraus'
math: mathjax
---
```

Kein Zusatz wie „Kapitel 6 · …" in den Header oder in die Titelfolie schreiben.

## 2. Folienklassen

Die Klasse steht als Kommentar direkt unter dem Trenner `---`:

```markdown
---

<!-- _class: structural -->

# Folientitel
```

| Klasse | Verwendung |
|---|---|
| `titlepage` | Nur die erste Folie. Titel `#`, Untertitel `##` (Zeilenumbruch mit `<br>`) |
| `structural` | Übungen, Abstimmungen, Kapitel-Trenner („Anhang"). Dunkler Hintergrund |
| `center` | Zentrierte Thesen, Provokationen, Zitate, „Zum Mitnehmen" |
| `fullscreen` | Vollbild-Bild, zusammen mit `![bg](pfad)` |
| `end` | Inhalt am unteren Rand: Literatur, Schlusszitat |
| `tiny-text` | Kleine Schrift für Tabellen und dichte Folien |
| `small-text` | Mittlere Schrift für mäßig dichte Folien und kurze Tabellen (bis ca. 5 Zeilen) |

Kombination zweier Klassen: `<!-- _class: end tiny-text -->`. Keine anderen Klassen erfinden. **Nicht verwenden:** `img-right`, `img-right small-text`, `large-text` (nur im Syntax-Showcase).

## 3. Bilder

Bilder nur, wenn sie etwas **erklären** (Diagramm, Vergleich, Daten). Keine Stockfotos neben Bullets, **keine Hotlinks** auf fremde Seiten.

```markdown
# Folientitel

- Bullet A
- Bullet B

![bg right 80%](diagrams/kapitel-04/diagramm.png)
```

- `![bg right 80%](pfad)` — Bild rechts, Text links (prozentuale Größe anpassen)
- Vollbild: `<!-- _class: fullscreen -->` plus `![bg 80%](pfad)`
- Bild im Fluss: `![w:1000](pfad)` oder `![h:560](pfad)` (Breite oder Höhe in Pixeln)
- Pfade relativ zur Folien-Datei. Vor dem Rendern prüfen, ob die Datei existiert.
- Bei zweisprachigen Repos zeigen beide Fassungen auf je eigene, vorhandene Dateien (z. B. `diagrams/kapitel-13/` und `diagrams/chapter-13/`).

## 4. Typografie

- `# Titel` — jede Inhaltsfolie hat genau einen Titel
- Hervorhebung `**fett**`, Betonung `*kursiv*`
- Folgerung: eine Zeile `→ **Folge:** …` am Folienende
- Zitate: `> Zitat` (wörtlich nur, wenn geprüft; sonst „sinngemäß")
- Provokation: `# <!-- fit --> Text <br> mit Umbruch` auf einer `center`-Folie (ein- bis zweimal pro Deck)
- Formeln: siehe Abschnitt 5 (MathJax)
- Gedankenstrich im Fließtext als `--`, Pfeil als `→`

## 5. Formeln (MathJax)

Der Header enthält `math: mathjax`. Formeln funktionieren in Folien, Listen und Tabellen.

```markdown
Inline: $\mu_p = w_A \mu_A + w_B \mu_B$

Block:
$$\sigma_p^2 = w_A^2\sigma_A^2 + w_B^2\sigma_B^2 + \underbrace{2\,w_A w_B\,\rho_{AB}\,\sigma_A\sigma_B}_{\text{diversification term}}$$
```

- Operatoren mit `\operatorname{Cov}`, Text mit `\text{...}`, Fettdruck mit `\mathbf{...}`
- Klammern, die mitwachsen: `\left( ... \right)`
- Währungs-Dollarzeichen kollidieren mit Inline-Mathe: `\$` schreiben oder „USD" ausschreiben
- **Keine Nicht-ASCII-Zeichen in Befehlen wie `\mathbf{…}`** (z. B. `\mathbf{€35m}` bricht das Rendern ab). Währung und Einheiten fett **außerhalb** der Formel setzen: `$V \approx$ **€35m**`
- Pro Folie höchstens zwei Blockformeln; eine Herleitung gehört in den Anhang
- Nach dem Rendern mindestens eine Formelfolie ansehen, ob alles erscheint (Skript `overflow_scan.js` prüft nur die Höhe)

## 6. Sprecher-Notizen

Als HTML-Kommentar direkt nach dem Folieninhalt (erscheint nicht in der Folie):

```markdown
<!--
Vorbereitung: Zettel mit Version A und B drucken (Text siehe unten). Ohne Material: Raum in zwei Hälften teilen.
Moderation (ca. 10 min, Folien 2-4): Sofort einsteigen, keine Agenda.
Erwartete Antworten: …
Fallback ohne Rollenkarten: Handzeichen.
Quelle: …; Zahlen vor dem Einsatz prüfen.
-->
```

## 7. Technische Hinweise

- Trenner ist `---` auf eigener Zeile; die Klasse direkt darunter.
- In Tabellen vor und nach dem Block eine Leerzeile.
- Eine sehr lange Tabelle aufteilen (zwei Folien), nicht verkleinern.
- Das Theme (`thws.css`, `thws-pr.css`) liegt unter `https://github.com/c-kraus/thws`; nie eine CSS-Datei erzeugen.
