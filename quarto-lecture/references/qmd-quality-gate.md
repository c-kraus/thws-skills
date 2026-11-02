# QMD Quality Gate — Kanonische Element-Regeln

Die **einzige** Quelle für Syntax- und Strukturregeln aller interaktiven Elemente. Genutzt von:
- `quarto-lecture` — als Gate vor dem Speichern (alle Verstöße inline beheben)
- `lecture-factory` — im RE-REVIEW-Strang
- `qmd-corrector` — als Audit-Checkliste für bestehende Dateien

Verstöße brechen den Moodle-Lua-Filter oder den PDF-Renderer meist **still** — deshalb wird jedes Element systematisch geprüft, nicht stichprobenartig.

---

## 1. YAML Frontmatter

**Zuerst den Modus bestimmen** (`book-mode.md`): Liegt ein `_quarto.yml` mit `project: type: book` vor, hat ein Buchkapitel **kein** YAML — die erste Zeile ist `# Titel {#sec-…}`. Vorhandenes Kapitel-YAML in einem Buch ist ein Verstoß (doppelte Titel): entfernen, `lang`/`format` gehören in `_quarto.yml`. Niemals YAML in ein Buchkapitel einfügen. Die folgenden Regeln gelten nur im Standalone Mode.

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

## 12. Lernziel-Callout

Direkt nach dem H1 (Book Mode: nach der kursiven Untertitelzeile) steht ein `::: {.callout-tip title="Lernziele"}` bzw. `title="Learning objectives"` — Format in `chapter-patterns.md` §1.

| Prüfung | Korrektur |
|---|---|
| Callout fehlt | Aus `_curriculum.md` ergänzen; ohne Curriculum: zur manuellen Prüfung markieren |
| Nummern/Texte weichen von `_curriculum.md` ab, lokale Nummerierung (1, 2, 3 in Kapitel 7) oder zweites Schema („LO 6.3") | Kursweite Nummern und Wortlaut aus dem Curriculum übernehmen |
| Lernziel ohne Beispiel, Fall oder Übung im Kapitel | Im Report melden (Stufe 1) |

---

## 13. Zahlen & Rundung

Zwischenwerte **ungerundet** weiterrechnen, erst die angezeigten Werte runden. Jede Zahl mit Python nachrechnen (`python3 -I`, Skripte im Scratchpad, nicht im Repo) — auch Tabellensummen und Zahlen in Quick-Checks, Drag-Exercises und Lösungen.

| Regel | Korrekt | Falsch |
|---|---|---|
| Tabellen | Spalten aus ungerundeten Werten berechnet; Summenzeile = Summe der ungerundeten Werte, gerundet | Varianz aus bereits gerundeten Abweichungen; Summe der angezeigten Rundungswerte |
| Kennzeichnung | Gerundete Aussage mit „rund"/„ca."/„about": „ein Terminkurs von rund 1,19" (exakt 1,1857) | „Der Terminkurs beträgt 1,19" |
| Konsistenz | Dieselbe Größe überall mit demselben gerundeten Wert (Text, Tabelle, Quick-Check, Widget-Default, Tutorium) | Erwartungswert 24,2 Mio. € im Text, 24,3 Mio. € in der Tabelle; σ 15,5 % hier, 15,4 % dort |
| Stellen | Eine Rundungsstufe je Größe im Kapitel (z. B. Zinssätze 2 Nachkommastellen, Beträge in Tsd. € ohne Nachkommastellen) | Wechselnde Stellenzahl für dieselbe Größe |
| Fakten → Zahl | Jede Zahl folgt aus den genannten Sachverhaltsdaten: 11 Monate Laufzeit → 11 Monatsraten | 12 Raten, weil „ein Jahr" gemeint war; Werte aus einer anderen Fassung des Falls |

**Korrektur:** Neu rechnen, Anzeige aus dem ungerundeten Ergebnis ableiten, „rund"/„about" ergänzen; bei Abweichung zu `_running_case.md` dessen Wert verwenden oder unter `FACT SHEET ADDITIONS` melden.

---

## 14. Umfang, Dichte & Lesezeit

Zählen, nicht schätzen:

```bash
python3 -I ~/.claude/skills/quarto-lecture/scripts/reading_load.py NN_slug.qmd --budget [Selbststudienzeit in min]
```

(Skript liegt im Skill-Ordner unter `scripts/`; `--l1` bei Erstsprach-Kohorte.)

| Prüfung | Soll | Bei Verstoß |
|---|---|---|
| Umfang | Standalone 1.500–3.000 · Book Mode 3.500–5.000 Wörter (Zweitsprache: 3.500–4.250) | Kürzen — Wiederholungen, zweite Beispiele, Nebenaspekte; nicht in Deep Dives verschieben (zählen mit) |
| Dichte | 1 interaktives Element je 400–600 Wörter, max. 3 pro Einheit (Standalone H2, Book Mode H3) | Zu dicht (< 400): schwächste Elemente streichen — Flip-Cards für Begriffe, die ein Satz erklärt, doppelte Quick-Checks zum selben Punkt. Zu dünn (> 600): Pflicht-Elemente nach `element-placement.md` ergänzen |
| Lesezeit | ≤ Selbststudienzeit pro Kapitel (`book-mode.md`) | Kürzen, bis es passt |

Ergebnis im Report: `Umfang: N Wörter · E Elemente (1 je W Wörter) · Lesezeit ≈ M min von S min`.

---

## Anwendung

**Als Gate (vor dem Speichern):** Alle 14 Abschnitte prüfen, jeden Verstoß sofort inline beheben, dann erst speichern.

**Als Audit (qmd-corrector):** Checklisten in Reihenfolge 1→14 abarbeiten (12–14 nur melden, nicht umschreiben, wenn der Auftrag eine reine Syntaxkorrektur ist), alle Instanzen je Elementtyp erfassen, Fixes anwenden, Quality Report ausgeben (Format im qmd-corrector SKILL.md).
