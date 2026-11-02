---
name: accounting-qa
description: "Quality assurance for accounting, finance and other quantitative lecture material: chapter, tutorial and solution, teaching note, case, widget HTML/JS, or a whole course. Rebuilds every number from the case facts (Python), checks widget defaults and slider ranges, norm citations (HGB, IFRS/IAS incl. IFRS 18, IAS 7, EStG, AktG, InsO, AO) against the original text, fact patterns that trigger other norms, literature (APA) and dates. Scopes: Datei, Material-Set, Kurs (course-wide consistency incl. _running_case.md). Runs with subagents or inline inside a subagent or brief (call the skill, do not paraphrase it). Triggers: 'QA für das Kapitel', 'Berechnungen prüfen', 'Normen checken', 'Zahlen prüfen', 'accounting QA', 'check my calculations', 'Finance-Kapitel prüfen', 'NPV/WACC/CAPM prüfen', 'Quellen prüfen', 'APA check', 'Tutorium und Lösung prüfen', 'Widget-Werte prüfen', 'Kurs-QA', 'kursweite Konsistenz prüfen'."
---

# Accounting QA Skill

Qualitätssicherung für Lehrmaterial mit Zahlen, Normen und Quellen — Rechnungswesen (HGB/IFRS) ebenso wie Finance und andere quantitative Fächer. Prüfdimensionen:

1. **Kalkulationen** — jede Zahl aus den Sachverhaltsdaten neu herleiten, nicht nur die abgedruckte Formel nachrechnen
2. **Widgets** — Regler, Defaults, Presets und JS-Rechenlogik gegen die Beispiele im Text
3. **Normen** — Zitate gegen den Originaltext (Existenz, Inhalt, Unterbuchstabe, Fassung)
4. **Sachverhalt-Trigger** — löst die Fallformulierung unbeabsichtigt eine andere Norm aus, die die Lösung ändert?
5. **Literatur und Fakten** — Existenz, APA-Zitierweise, Daten und Zeitachse
6. **Kurs-Konsistenz** — dieselbe Größe, Norm, Parameter ist in allen Artefakten identisch (nur Umfang Kurs)

Die Prüfaufträge im Detail stehen in `references/pruefschritte.md` (Abschnitte A–F). Diese Datei ist für Subagents und Inline-Modus dieselbe.

**Fachmodus ergibt sich aus dem Inhalt:** Accounting (Normen, Buchungssätze) oder Finance/quantitativ (meist keine Normen; dafür Finance-Konventionen in A, Literatur und Fakten in E). Beides kann zusammen vorkommen. Ein Kurs ohne Normzitate ist kein Grund, den Skill nicht aufzurufen.

---

## Auslöser

Aufrufen, sobald mindestens eins zutrifft: Zahlenbeispiele/Formeln/Buchungssätze, Normzitate, Literaturverweise, datierte Fakten, Widgets mit Rechenlogik — im Kapitel, Tutorium, in der Lösung, Teaching Note, Fallstudie oder im Widget.

---

## Umfang

| Umfang | Was | Wann |
|---|---|---|
| **Datei** | eine `.qmd`/`.html`/`.md` | Einzelprüfung, lecture-factory CREATE |
| **Material-Set** | Kapitel `NN_slug.qmd` + `tutorials/tut_NN_slug.qmd` (mit Lösung) + Teaching Note(s) + Fall/Kurzfall + `widgets/kapitel-NN/*` (+ Folien, Moodle-XML, falls vorhanden) | nach dem Bau eines Kapitels samt Begleitmaterial |
| **Kurs** | alle Material-Sets + `_curriculum.md` + `_running_case.md` | nach parallelen Builds, vor Veröffentlichung |

Ohne Angabe: Material-Set, wenn zum Kapitel Begleitdateien existieren, sonst Datei. Im Umfang Kurs zusätzlich Abschnitt F (Kurs-Konsistenz).

---

## Ausführungsmodus

**Parallel (Standard):** Hauptagent macht den Inhaltsscan, startet je Prüfdimension einen Subagent (bei großem Umfang zusätzlich nach Kapiteln aufteilen), führt den Report zusammen. Abschnitt F bleibt beim Hauptagenten.

**Inline:** dieselben Schritte A–F nacheinander selbst, ohne Subagents. Pflicht, wenn der Skill in einem Subagent läuft, von einem Orchestrator-Brief aufgerufen wird oder kein Agent-Tool verfügbar ist. Gleiche Prüftiefe, gleiche Ausgabeformate — Inline heißt nicht „kürzer".

**Regel für Orchestrator-Briefs:** Der Brief **ruft den Skill auf** („Führe `accounting-qa` aus, Modus Inline, Umfang Material-Set Kap. 4"), er ersetzt ihn nicht durch eine eigene Kurzfassung und macht ihn nicht optional („wenn er bei dir läuft"). Kann der Subagent den Skill nicht laden, liest er `SKILL.md` und `references/` dieses Skills per Pfad und arbeitet sie ab. Der QA-Report gehört in die Rückmeldung an den Orchestrator.

---

## Schritt 1: Inhaltsscan (still)

Alle Dateien des Umfangs lesen und Listen anlegen (Fundstelle immer `Datei:Zeile`):

- **Liste A — Kalkulationen:** jede Rechnung, Formel mit Werten, Tabelle mit Summen, Buchungssatz mit Betrag; dazu die **Sachverhaltsdaten** (Laufzeiten, Daten, Beträge, Sätze), aus denen die Parametertabelle gebaut wird. Bei `_running_case.md`: Kursweite Parameter und Zeitachse übernehmen.
- **Liste W — Widgets:** je Widget alle Inputs (`id`, `min`, `max`, `step`, `value`), Presets, Konstanten, Rechenfunktion; dazu die Textbeispiele, die mit dem Widget nachvollzogen werden.
- **Liste B — Normen:** alle Zitate, **gruppiert nach Norm** (alle IFRS-18-Zitate zusammen usw.), auch aus Widgets und Folien. Muster:
  - HGB/Gesetze: `§ \d+[a-z]?(\s+Abs\.\s+\d+[a-z]?)?(\s+Satz\s+\d+)?(\s+Nr\.\s+\d+)?\s+(HGB|AktG|GmbHG|StGB|EStG|KStG|UStG|InsO|BGB|AO)`
  - IFRS/IAS: `(IFRS|IAS|IFRIC|SIC)\s+\d+[A-Z]?(\.[A-Z]{0,2}\d+[A-Z]?(\([a-z]+\))*(\([ivx]+\))?)?`, Rahmenkonzept: `(CF|Conceptual Framework|Rahmenkonzept)\s+\d+\.\d+`
- **Liste T — Sachverhalte:** jeder Fall- oder Aufgabentext mit normrelevanten Tatsachen.
- **Liste C — Literatur und Fakten:** Zitate/`@keys`, Literaturverzeichnis/`.bib`, datierte Fakten, Statistiken.

Leere Liste → Dimension entfällt, im Report vermerken.

---

## Schritt 2: Prüfen

Je Dimension den Abschnitt aus `references/pruefschritte.md` abarbeiten: A Kalkulationen (Liste A), B Widgets (Liste W), C Normen (Liste B), D Sachverhalt-Trigger (Listen T + B), E Literatur und Fakten (Liste C), F Kurs-Konsistenz (alle Listen, nur Umfang Kurs).

**Subagent-Prompt (Parallel-Modus):**

```
Du prüfst [Dimension] in Lehrmaterial ([Fach], [Sprache]).
Umfang: [Dateipfade]
Fact Sheet: [Pfad zu _running_case.md oder „keins"]
Prüfauftrag: Lies [Pfad zu accounting-qa]/references/pruefschritte.md, Abschnitt [A–E],
und arbeite ihn vollständig ab. Normen: zusätzlich references/common-norms.md.
Zu prüfen:
[Liste aus dem Inhaltsscan]
Gib exakt das Ausgabeformat des Abschnitts zurück. Nichts als geprüft melden, was nicht geprüft wurde.
```

**Budget statt Trefferlimit:** Es wird nicht nach den ersten N Treffern abgeschnitten. Aufwand sparen über Gruppierung (Normen: ein Originaltext je Norm, alle Zitate dagegen; Kalkulationen: eine Parametertabelle je Fall) und Parallelität (Subagents nach Kapiteln). Reicht die Sitzung trotzdem nicht, nach Fehlerrisiko priorisieren und den Rest **namentlich** als `nicht geprüft` listen.

**Quellen:** Originaltext zuerst — IFRS über ifrs.org (Issued Standards, aktuelles Jahr), deutsche Gesetze über gesetze-im-internet.de; URL-Muster in `references/pruefschritte.md` C.2. Kurs-Wiki und Modellwissen nur als Rückfall, dann mit `nicht live geprüft` markieren — nie ein unsicheres ✅.

---

## Schritt 3: Report

```markdown
---
## Accounting QA — [Datei | Material-Set Kap. NN | Kurs]
Modus: [Parallel | Inline] · Umfang: [Dateiliste]

### Kalkulationen
### Widgets
### Normen
### Sachverhalt-Trigger
### Literatur und Fakten
### Kurs-Konsistenz          ← nur Umfang Kurs
[je Abschnitt die Ausgabe aus pruefschritte.md, oder: "— nichts gefunden"]

### Nicht geprüft
[Punkt — Grund]  ← leer lassen nur, wenn wirklich alles geprüft wurde

### Zusammenfassung
[N] ✅ · [N] ⚠️ · [N] ❌ · [N] nicht geprüft · Normen: [N] gegen Originaltext, [N] nur Modellwissen

→ Fehler > 0: vor Veröffentlichung korrigieren (Fundstellen oben, alle betroffenen Artefakte).
→ nur Hinweise: prüfen empfohlen.
→ alles grün und nichts offen: bereit zur Veröffentlichung.
---
```

Wenn die QA selbst korrigieren soll: jeden Fehler in **allen** Artefakten beheben, in denen dieselbe Größe oder dasselbe Zitat steht (Kapitel, Tutorium, Lösung, Teaching Note, Widget, Folien).

---

## Fehlerbehandlung

- **Python-Fehler:** `⚠️ nicht prüfbar (Skript-Fehler)` und unter „Nicht geprüft" führen.
- **Originaltext nicht abrufbar** (404, Login, Bot-Schutz): Fallback-Quelle versuchen; sonst Modellwissen mit `⚠️ nicht live geprüft — Quelle: [URL]`.
- **OpenAlex/CrossRef nicht erreichbar:** Literatur aus Modellwissen, Vermerk `Literaturprüfung ohne Live-Suche`.

---

## Standalone vs. integriert

**Standalone:** mit Pfad(en) und optional Umfang aufrufen; Report an den Nutzer.

**Integriert in lecture-factory:** Report in den Checkpoint-Output; Zusammenfassungszeile im Format `{N} ✅ · {N} ⚠️ · {N} ❌`. Im schnellen CREATE-Durchgang ohne Fetches gelten nur `common-norms.md`-Einträge mit gültigem Prüfdatum als verifiziert; alles andere ist `nicht live geprüft`.

---

## Qualitäts-Hinweise für Claude

- Die Parametertabelle kommt vor der Rechnung. Wer nur die abgedruckte Formel nachrechnet, bestätigt Folgefehler.
- Zahlen in Lösungen und Teaching Notes sind genauso fehleranfällig wie im Kapitel — oft mehr, weil sie zuletzt geschrieben werden.
- Unterbuchstaben und B-Absätze (IFRS 18.B46 vs. B47) sind die häufigste Normfehlerquelle; immer gegen den Text, nie aus dem Gedächtnis.
- `common-norms.md` ist ein Index mit Prüfdatum, kein Ersatz für den Originaltext bei abweichenden Behauptungen.
- Lieber weniger Punkte sauber geprüft und den Rest offen benannt als eine hohe „geprüft"-Zahl ohne Deckung.
