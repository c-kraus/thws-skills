# QMD Quality Gate — Kanonische Element-Regeln

Die **einzige** Quelle für Syntax- und Strukturregeln aller interaktiven Elemente. Genutzt von:
- `quarto-lecture` — als Gate vor dem Speichern (alle Verstöße inline beheben)
- `lecture-factory` — im RE-REVIEW-Strang
- `qmd-corrector` — als Audit-Checkliste für bestehende Dateien

Verstöße brechen den Moodle-Lua-Filter oder den PDF-Renderer meist **still** — deshalb wird jedes Element systematisch geprüft, nicht stichprobenartig.

---

## 1. YAML Frontmatter

Pflichtfelder und Formate:

```yaml
---
title: "..."          # quoted string
subtitle: "..."       # quoted string
date: last-modified   # living docs; festes ISO-Datum nur für archivierte
lang: de              # oder 'en' — steuert Hyphenation und Moodle-Lokalisierung
toc-depth: 1          # 2 bei langen Kapiteln mit H3-Untersektionen
author:
  - name: Prof. Dr. Christian Kraus
    email: christian.kraus@thws.de
    role: Program Lead
    affiliation: THWS Business & Engineering
format:
  moodle-html
---
```

| Problem | Korrektur |
|---|---|
| `format: moodle-html` als String statt Block-Key | `format:\n  moodle-html` |
| `author` als String statt Liste | Listenform mit `-` |
| `subtitle`, `toc-depth` oder `lang` fehlt | Ergänzen (`lang` aus Inhaltssprache ableiten) |
| `date: today` / hartes Datum auf living doc | `date: last-modified` |

---

## 2. Flip-Cards `{.flip-card}`

H4-Heading = Vorderseite (Begriff), Body = Rückseite (Definition). Der Lua-Filter verlangt das Heading als erstes Element, Body **direkt** in der nächsten Zeile.

| Regel | Korrekt | Falsch |
|---|---|---|
| Heading-Ebene | `#### Begriff` | `### Begriff`, `**Begriff**` |
| Leerzeile nach Heading | Keine | Leerzeile bricht den Filter still |
| Body | Ein prägnanter Definitionsabsatz | Mehrere Absätze, Headings, Listen |
| Mehrere Cards | Separate, benachbarte Divs | Verschachtelung |

```
✓ ::: {.flip-card}
  #### Moral Hazard
  Risiko, dass der Agent nach Vertragsschluss Handlungen vornimmt, die der Prinzipal nicht beobachten kann.
  :::
```

**Korrektur:** Leerzeile entfernen; `###`/`**…**` zu `####` machen.

---

## 3. Drag-Exercises `{.drag-exercise}`

Lückentext: Studierende ziehen die kursiv markierten Terme in Lücken.

| Regel | Korrekt | Falsch |
|---|---|---|
| Kein Heading innen | Nur Fließtext | Jedes `####`/`###` |
| Format | 1–2 Fließsätze | Bullet-Listen, Tabellen |
| Ausfüllbare Terme | `*kursiv*` | Unmarkiert oder `**fett**` |
| **Eindeutige Lücken** | Jede Lücke ist durch den Satzkontext eindeutig bestimmt | Vertauschbare Terme |

**Kommutativitätsregel (wichtig):** Der Filter wertet jede Lücke positionsfest. Sind zwei Lücken logisch vertauschbar — symmetrische Aufzählungen wie *„Eine Bilanz besteht aus \*Aktiva\* und \*Passiva\*"* —, wird die fachlich ebenso richtige Reihenfolge als falsch gewertet (a+b = b+a). Deshalb: Jede Lücke braucht einen eindeutigen Anker im Satz, der genau einen Term zulässt.

```
✗ FALSCH — Lücken vertauschbar:
Eine Bilanz gliedert sich in *Aktiva* und *Passiva*.

✓ KORREKT — jede Lücke eindeutig verankert:
Die Mittelverwendung zeigt die *Aktivseite*, die Mittelherkunft die *Passivseite*.
```

**Korrektur:** Heading löschen; Listen zu Fließsatz umformen; bei fehlenden Markierungen die 2–4 wichtigsten Fachterme kursiv setzen; vertauschbare Lücken umformulieren (eindeutiger Anker) oder auf eine Lücke reduzieren.

---

## 4. Quick-Checks `{.quick-check}`

| Regel | Korrekt | Falsch |
|---|---|---|
| Leerzeile nach Frage | Pflicht — zwischen Fragetext und erster `- Option` | Frage und Liste kleben zusammen (bricht Frage-Erkennung) |
| Antwortformat | Bullet-Liste `- Option` | Nummerierte Liste, Fließtext |
| Korrekte Antwort | Genau eine Option `**fett**` | Keine oder mehrere fett |
| Kein Heading innen | Nur Frage + Liste | `####`/`###` innen |

**Korrektur:** Leerzeile einfügen; bei fehlender Fett-Markierung die plausibelste Option fetten und **im Report zur manuellen Prüfung markieren**.

---

## 5. Case Studies `{.case-study}`

Ohne `.solution`-Block rendert der Moodle-Filter die Lösung offen — Studierende sehen die Antwort sofort.

| Regel | Korrekt | Falsch |
|---|---|---|
| Heading | `#### Case: [Titel]` (H4) | Fehlend oder andere Ebene |
| Lösung | Verschachteltes `::: {.solution}` mit `**Lösung:**`/`**Solution:**`-Lead | Lösung offen im Text |

```
✓ ::: {.case-study}
  #### Case: Müller GmbH
  Sachverhalt...

  ::: {.solution}
  **Lösung:** Nach § 249 Abs. 1 HGB ...
  :::
  :::
```

**Korrektur:** Inline-Lösungstext in `.solution`-Div einwickeln; fehlt jede Lösung: Platzhalter `**Lösung:** TODO` einfügen und zur manuellen Prüfung markieren.

---

## 6. Deep Dives `{.details}`

| Regel | Korrekt | Falsch |
|---|---|---|
| Heading | `#### Deep Dive: [Konzept]` oder `#### Exkurs: [Titel]` (H4) | Fehlend, andere Ebene |

**Korrektur:** H4-Heading mit passendem Präfix ergänzen oder Ebene anpassen.

---

## 7. Videos `{.video}`

Quarto-Shortcode, kein rohes HTML:

```
::: {.video}
{{< video https://youtu.be/ID >}}
:::
```

**Korrektur:** Rohe YouTube-URLs oder `<iframe>`/`<video>`-Tags in Shortcode umwandeln.

---

## 8. Widgets `{.widget}` + IFrame-Syntax

| Regel | Korrekt | Falsch |
|---|---|---|
| Wrapper | `::: {.widget}` um jedes iframe | Bare iframe |
| `src` | Relativer Pfad (`widgets/kapitel-NN/…`) | `http://…`, absolute Dateisystempfade |
| Attribute | `width="100%"`, `height="…px"`, `frameborder="0"`, `title="…"` | Fehlende Attribute |

**Korrektur:** Absolute Pfade auf relative kürzen; fehlende Attribute ergänzen (`title` barrierefrei, in Dokumentsprache); bare iframes wrappen.

---

## 9. LaTeX Math — Währungszeichen

Zwei Situationen, zwei Regeln:

**Beim Schreiben neuer Inhalte (quarto-lecture, lecture-factory):** Währungssymbole gehören **nicht in die Formel**. Beträge als reine Zahl im Mathblock, Währung im umgebenden Fließtext. Das ist über alle Renderer hinweg die robusteste Form:

```
**Beispiel:** Anschaffungskosten 110.000 €, Restwert 5.000 €, Nutzungsdauer 5 Jahre.

$$\text{Jährliche AfA} = \frac{110{,}000 - 5{,}000}{5} = 21{,}000$$
```

**Beim Korrigieren bestehender Inhalte (qmd-corrector):** Steht bereits ein `€` in einem Mathblock, nicht umbauen, sondern minimal-invasiv reparieren — bare `€` → `\text{€}`:

| Problem | Korrektur |
|---|---|
| `\mathbf{€\,500}` | `\mathbf{\text{€}\,500}` |
| `= €\,363` in `$...$` | `= \text{€}\,363` |
| `\text{€}` bereits vorhanden | ✓ keine Aktion |
| `€` außerhalb von Math | ✓ keine Aktion |

**Hintergrund:** LaTeX/MathJax kennt `€` nicht als Math-Symbol — bare `€` erzeugt einen Math-Output-Fehler (aufgetreten in BUA3 Part 2, Kap. 5–9). `\text{€}` funktioniert im Projekt-Setup, ist aber nicht über alle Renderer garantiert — deshalb bei Neuschreibungen die Währung ganz aus der Formel halten.

---

## 10. Heading-Hierarchie

Eine Heading-Ebene ist nur gerechtfertigt, wenn mindestens zwei Geschwister auf ihr existieren. Enthält eine H2-Section genau eine H3-Untersektion, den Inhalt auf H2-Ebene heben und die leere Verschachtelung eliminieren.

---

## 11. Normzitat-Granularität

Definiert `_curriculum.md` eine Zitierkonvention (z. B. „Normzitate immer mit Absatz"), jedes §-Zitat im Dokument dagegen prüfen. Ohne Konvention gilt als Default: Die **erste** Zitation einer Norm im Kapitel nennt Absatz (und Satz, wenn die Aussage satzspezifisch ist); Folgezitate derselben Stelle dürfen verkürzt sein, sofern eindeutig.

| Korrekt | Falsch (korrigieren) |
|---|---|
| „§ 249 Abs. 1 Satz 1 HGB verpflichtet …" (Erstnennung) | „§ 249 HGB verpflichtet …" (Erstnennung ohne Abs., obwohl die Aussage absatzspezifisch ist) |

**Korrektur:** Absatz/Satz aus dem Kontext bzw. `accounting-qa/references/common-norms.md` ergänzen; bei Unklarheit zur manuellen Prüfung markieren statt raten.

---

## Anwendung

**Als Gate (vor dem Speichern):** Alle 11 Abschnitte prüfen, jeden Verstoß sofort inline beheben, dann erst speichern.

**Als Audit (qmd-corrector):** Checklisten in Reihenfolge 1→11 abarbeiten, alle Instanzen je Elementtyp erfassen, Fixes anwenden, Quality Report ausgeben (Format im qmd-corrector SKILL.md).
