# Book Mode (BUA-Stil) vs. Standalone Mode

Laden in Workflow-Schritt 1. Der Modus steuert Dateiname, YAML, Gliederung, Umfang und Schluss. Alle anderen Regeln des Skills gelten in beiden Modi.

## Modus bestimmen

- **Book Mode**, wenn im Zielverzeichnis (oder darüber bis zum Repo-Root) ein `_quarto.yml` mit `project:` → `type: book` liegt, oder der Auftrag das Kapitel ausdrücklich als Buchkapitel bezeichnet. Prüfung: `grep -A3 '^project:' _quarto.yml | grep -q 'type: *book'`.
- Sonst **Standalone Mode**: eine einzelne `.qmd` mit eigenem YAML (bisherige Defaults).
- Den erkannten Modus im ersten Statusbericht nennen.

Referenzkurse für den Book Mode: `~/Dev/10_Lehre/BUA1`, `~/Dev/10_Lehre/BUA3` (Aufbau, Ton, Element-Syntax).

## Konventionen

| | Standalone | Book Mode |
|---|---|---|
| Dateiname | `kap-{nn}-{slug}.qmd` | `NN_slug.qmd` (z. B. `04_leases.qmd`); Tutorium `tutorials/tut_NN_slug.qmd`. Steht das Kapitel schon in `_quarto.yml` oder als Stub, diesen Namen übernehmen. |
| YAML | Pflicht (`frontmatter-template.md`) | **keines** — `lang`, `format`, `toc-depth`, Autor stehen in `_quarto.yml` |
| Kopf | YAML, dann `# Titel` | `# Titel {#sec-slug}` (Titel aus `_curriculum.md`), Leerzeile, eine kursive Untertitelzeile `*…*`, dann der Lernziel-Callout (`chapter-patterns.md` §1) |
| Gliederung | Opening-Absatz + 3–5 H2 | H2 als Rollen-Container mit H3 darunter. Default-Gerüst: `## Opening: …` · `## Theory: …` · `## Norm: …` und/oder `## Method: …` · `## Practice: …` · `## Conclusion: …`. Gibt `_curriculum.md` (Didaktik) ein anderes Gerüst oder deutsche Bezeichnungen vor (z. B. „Einstieg", Themen-H2, „Zusammenfassung"), gilt das Curriculum. `{#sec-…}`-Anker an jeder H2. |
| Umfang | 1.500–3.000 Wörter | **3.500–5.000 Wörter**; bei Zweitsprach-Kohorte (s. u.) untere Hälfte, also 3.500–4.250 |
| Schluss | kein Zusammenfassungsabsatz; Gedanke, offene Frage oder Quick-Check + 1-Satz-Vorausverweis | **kurze Zusammenfassung erlaubt** (ein bis zwei Absätze, optional `.details`-Box „Key Terms"/„Schlüsselbegriffe") + 1-Satz-Vorausverweis auf Kapitel N+1 |
| Element-Obergrenze | max. 3 pro H2 | max. 3 pro H3-Einheit |

**Opening im Book Mode:** Eine Szene (oft als `::: {.details}` mit `#### Story: …`, Running Case), dann ein Absatz mit Rückverweis auf Kapitel N−1 und der Leitfrage aus `_curriculum.md`, dann ein Satz zur Gliederung des Kapitels.

**Zählweise Umfang:** alle Wörter, die Studierende lesen — Fließtext, Callouts, Deep Dives, Fälle, Quick-Checks; ohne Code, Display-Mathe, HTML/iframes und Div-Zäune. Zählskript: `qmd-quality-gate.md` §14. Wer Text in Deep Dives verschiebt, kürzt also nicht.

## Lesezeit-Check (Pflicht im Book Mode, im Standalone Mode empfohlen)

$$\text{Lesezeit (min)} = \frac{\text{Wörter}}{120} + 3 \times \text{interaktive Elemente}$$

- 120 Wörter/Minute für Leser in der Zweitsprache (Fachtext), 150 für Muttersprachler.
- **Zweitsprach-Kohorte:** Kapitelsprache ≠ Erstsprache der Mehrheit laut `_curriculum.md` → *Kohorte & Vorwissen*. Englischsprachige Kurse für internationale Studierende gelten immer als Zweitsprache.
- Interaktive Elemente: `.flip-card`, `.drag-exercise`, `.quick-check`, `.case-study`, `.widget`, `.video`. `.details` und Callouts zählen nicht als Element (ihre Wörter zählen im Umfang).
- **Muss passen** in die Selbststudienzeit pro Kapitel aus `_curriculum.md` → *Lehrformat*. Nennt das Lehrformat nur SWS: Selbststudienzeit pro Kapitel = SWS × 45 Minuten × Vorlesungswochen ÷ Kapitelzahl (bei einem Kapitel pro Woche: 2 SWS ≈ 90 Minuten). Ohne Angabe: 90 Minuten annehmen und das im Report nennen.
- Passt es nicht: kürzen (Wiederholungen, zweite Beispiele, Nebenaspekte streichen), nicht in Deep Dives verschieben. Ergebnis im Report: `Umfang: N Wörter · E Elemente (1 je W Wörter) · Lesezeit ≈ M min von S min`.

Richtwert zur Orientierung: 5.000 Wörter und 10 Elemente ergeben bei 120 W/min rund 72 Minuten — ein Kapitel mit 9.000 Wörtern und 18 Elementen (rund 129 Minuten) sprengt jede 90-Minuten-Woche.
