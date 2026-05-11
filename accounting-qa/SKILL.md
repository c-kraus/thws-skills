---
name: accounting-qa
description: "Quality assurance for accounting lecture content. Checks calculations (Python), legal references (HGB, IFRS, IAS, StGB, AktG), and literature citations. Spawns three parallel subagents and produces a structured QA report. Use standalone or integrated into lecture-factory. Trigger phrases: 'QA für das Kapitel', 'Berechnungen prüfen', 'Normen checken', 'Qualitätssicherung Rechnungswesen', 'accounting QA', 'check my calculations', 'Zahlen prüfen'."
---

# Accounting QA Skill

Qualitätssicherung für Accounting-Lehrkapitel. Prüft drei Dimensionen unabhängig und parallel:

1. **Kalkulationen** — alle Berechnungen und Zahlenbeispiele rechnerisch verifizieren
2. **Normen** — alle Rechtsquellen-Verweise (HGB, IFRS, IAS, StGB, AktG …) auf Existenz und Inhaltsgenauigkeit prüfen
3. **Literatur** — alle Literaturverweise auf Existenz und Aktualität prüfen

---

## Auslöser

Den Skill aufrufen wenn:
- Zahlenbeispiele, Formeln oder Berechnungen im Text vorhanden sind
- §§ oder IFRS/IAS-Normen zitiert werden
- Literaturverweise vorhanden sind
- Mindestens eine der drei Dimensionen relevant ist — nicht zwingend alle drei

---

## Schritt 1: Inhaltsscan (still, vor dem Dispatch)

QMD lesen und drei Listen erstellen:

**Liste A — Kalkulationen:**
Alle Passagen mit numerischen Berechnungen, Formeln mit konkreten Werten, Buchungssätzen mit Beträgen. Format: `{Zeile/Abschnitt, Formel, erwartetes Ergebnis laut Text}`.

**Liste B — Normen:**
Alle Rechtsquellen-Verweise extrahieren. Regex-Muster:
- HGB: `§ \d+[a-z]?(\s+Abs\.\s+\d+)?(\s+Satz\s+\d+)?(\s+Nr\.\s+\d+)?\s+HGB`
- IFRS/IAS: `(IFRS|IAS)\s+\d+[A-Z]?(\.\d+[A-Z]?)?`
- Sonstige: `§ \d+\s+(AktG|GmbHG|StGB|EStG|KStG|UStG|InsO|BGB|HGBalt)`

Format: `{Norm, Behauptung im Text, Fundstelle}`.

**Liste C — Literatur:**
Alle Literaturverweise (Autor Jahr, Fußnoten, Quellenangaben). Nur prüfen wenn ≥1 Verweis gefunden.

Wenn eine Liste leer ist: den entsprechenden Subagent nicht starten, im Report vermerken.

---

## Schritt 2: Paralleler Subagent-Dispatch

Alle drei Subagents **gleichzeitig** starten. Prompt-Templates:

---

### Subagent 1 — Kalkulations-Prüfer

```
Du prüfst Berechnungen in einem Accounting-Lehrkapitel.

QMD-Pfad: [Pfad]
Berechnungen zum Prüfen:
[Liste A aus dem Inhaltsscan]

Vorgehensweise:
1. Schreibe für jede Berechnung ein kurzes Python-Skript, das die Formel mit den
   gegebenen Werten ausführt und das Ergebnis zurückgibt.
2. Führe das Skript via Bash aus.
3. Vergleiche das Python-Ergebnis mit dem im Text angegebenen Ergebnis.
4. Toleranzgrenze: ±0,01 € / ±0,01 % — kleinere Differenzen als korrekt werten.
5. Achte auf Rundungskonventionen (kaufmännisch vs. mathematisch).

Ausgabe-Format (exakt einhalten):
## Kalkulationen ([N] geprüft)
✅ [Beschreibung] (Abschn. [X]): [Formel] = [Ergebnis] — korrekt
⚠️ [Beschreibung] (Abschn. [X]): [Formel] = [Python-Ergebnis], Text gibt [Textwert] an — Rundungsdifferenz, akzeptabel
❌ [Beschreibung] (Abschn. [X]): [Formel] = [Python-Ergebnis], Text gibt [Textwert] an — FEHLER
```

---

### Subagent 2 — Normen-Prüfer

```
Du prüfst Rechtsquellen-Verweise in einem Accounting-Lehrkapitel.

QMD-Pfad: [Pfad]
Normen zum Prüfen:
[Liste B aus dem Inhaltsscan]

Referenz: Lade accounting-qa/references/common-norms.md als Schnellreferenz.

Vorgehensweise für jeden Verweis:
1. Existenz prüfen: Gibt es diesen Paragraphen / diese Norm?
2. Inhaltsabgleich: Stimmt die Behauptung im Text mit dem tatsächlichen Normeninhalt überein?
   - Bei HGB: primär aus Trainingswissen (umfassend); bei Unklarheit: ifrs.org oder dejure.org-URL
     als Quelle vermerken (aber NICHT fetchen — nur als Hinweis für den Nutzer angeben)
   - Bei IFRS/IAS: primär aus Trainingswissen; Stand beachten (IFRS-Standards können sich ändern)
3. Granularität prüfen: Wenn "§ 249 HGB" zitiert wird, aber "§ 249 Abs. 1 Satz 1 HGB" gemeint ist —
   als Hinweis markieren, nicht als Fehler.
4. Veraltete Fassungen: Wenn eine Norm nach 2020 wesentlich geändert wurde und die Version relevant ist,
   als Hinweis markieren.

Ausgabe-Format (exakt einhalten):
## Normen ([N] geprüft)
✅ [Norm] — [Kurzbeschreibung des geprüften Inhalts]: korrekt referenziert
⚠️ [Norm] — [Kurzbeschreibung]: [Präzisierungshinweis oder Granularitätshinweis]
❌ [Norm] — FEHLER: [Beschreibung des Problems und ggf. korrekter Verweis]
```

---

### Subagent 3 — Literatur-Prüfer

```
Du prüfst Literaturverweise in einem Accounting-Lehrkapitel.

QMD-Pfad: [Pfad]
Literatur zum Prüfen:
[Liste C aus dem Inhaltsscan]

Vorgehensweise für jeden Verweis:
1. Existenz prüfen: Suche über OpenAlex (curl, siehe unten) oder aus Trainingswissen nach
   Autor + Jahr + ggf. Titelstichwort.
2. Aktualität prüfen: Gibt es eine neuere Auflage oder Nachfolgearbeit, die der Text
   nicht berücksichtigt? (Relevanz: nur wenn ≥3 Jahre neuer und substantiell abweichend)
3. Wenn eine Quelle nicht gefunden wird: als ⚠️ markieren mit Hinweis
   "Nicht verifiziert — bitte manuell prüfen", NICHT als Fehler.
4. Keine Zotero-Integration in diesem Schritt — nur Verifikation.

Ausgabe-Format (exakt einhalten):
## Literatur ([N] geprüft)
✅ [Autor Jahr] — gefunden: [Titel, Quelle]
⚠️ [Autor Jahr] — nicht verifiziert (bitte manuell prüfen)
⚠️ [Autor Jahr] — neuere Auflage verfügbar: [Autor neueJahr] — [Titel]
❌ [Autor Jahr] — FEHLER: [z. B. Jahreszahl falsch, Autor nicht gefunden]
```

---

## Schritt 3: Report zusammenführen

Nach Rückkehr aller Subagents den Gesamt-Report zusammenstellen:

```markdown
---
## Accounting QA — [filename.qmd]

### Kalkulationen
[Output Subagent 1, oder: "— keine Berechnungen gefunden"]

### Normen
[Output Subagent 2, oder: "— keine Normen gefunden"]

### Literatur
[Output Subagent 3, oder: "— keine Literaturverweise gefunden"]

### Zusammenfassung
[Anzahl ✅ korrekt] · [Anzahl ⚠️ Hinweise] · [Anzahl ❌ Fehler]

[Wenn Fehler > 0:]
→ Bitte die markierten Fehler vor Veröffentlichung korrigieren.

[Wenn nur Hinweise:]
→ Hinweise prüfen — kein zwingender Handlungsbedarf, aber empfohlen.

[Wenn alles grün:]
→ Alle geprüften Punkte korrekt. Bereit zur Veröffentlichung.
---
```

---

## Fehlerbehandlung

**Subagent 1 scheitert (Python-Fehler):** Berechnung als `⚠️ nicht prüfbar (Skript-Fehler)` markieren, manuell prüfen empfehlen.

**Subagent 2: Norm unbekannt:** Als `⚠️ nicht in Referenzdatenbank — Quelle: [dejure.org/gesetze/HGB/...]` markieren.

**Subagent 3: OpenAlex nicht erreichbar:** Literaturprüfung aus Trainingswissen durchführen, im Report vermerken: `Literaturprüfung basiert auf Trainingswissen — keine Live-Suche`.

---

## Standalone vs. integriert

**Standalone:** Direkt mit einem QMD-Pfad oder -Inhalt aufrufen. Report wird dem Nutzer präsentiert.

**Integriert in lecture-factory:** Report wird in den Checkpoint-Output eingebettet. Der Nutzer sieht QMD + QA-Ergebnis, bevor er über die Widget-Pipeline entscheidet.

---

## Qualitäts-Hinweise für Claude

- Subagents nicht auf Vollständigkeit drängen — besser 3 verifizierte Normen als 10 halbgare
- Normen-Prüfer: Trainingswissen ist für HGB sehr zuverlässig; IFRS-Stand-Datum beachten
- Kalkulations-Prüfer: Buchungssätze (Soll/Haben) nur auf Betragskorrektheit prüfen, nicht auf Kontierungslogik
- Bei sehr langen Kapiteln (>3000 Wörter): Nur die ersten 5 Treffer jeder Kategorie dispatch-en, Rest als "weitere [N] nicht geprüft" vermerken
