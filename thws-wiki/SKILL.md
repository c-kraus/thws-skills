---
name: thws-wiki
description: |
  KI-gepflegtes Literatur- und Konzept-Wiki für Lehre und Forschung (Wirtschaftsingenieurwesen THWS).
  Basiert auf dem Karpathy LLMWiki-Pattern. Zwei Eingangspfade: Zotero (Fachliteratur)
  und raw/-Ordner (Web-Clips, Grauliteratur, eigene Notizen). Der Agent diskutiert
  nach dem Lesen kurz die wichtigsten Takeaways, bevor er Wiki-Seiten schreibt.

  IMMER verwenden bei:
  - "ingest @citekey" — eine Zotero-Quelle ins Wiki aufnehmen
  - "ingest raw/[datei]" — eine Datei aus dem raw/-Ordner verarbeiten
  - "update wiki" — Bulk-Ingest aller neuen Einträge (Zotero + raw/) seit letztem Log
  - "update wiki: [thema]" — Bulk-Ingest für ein bestimmtes Thema oder Zotero-Tag
  - "query wiki: [frage]" — Wissensbasis abfragen, Antwort mit [[Wikilinks]] synthetisieren
  - "lint wiki" — Integrität prüfen (kaputte Links, Waisen, veraltete Normen)
  - "wiki status" — Schnellübersicht: Seitenzahl, letzte Ingests, Themabereiche, Lücken
  - Nutzer fragt "was sagt meine Literatur zu X", "welche Quellen habe ich zu Y",
    "zeig mir was im Wiki steht zu Z", "bevor ich das Kapitel schreibe: was weiß ich schon"
---

# THWS Wiki Skill

Pflegt ein KI-verwaltetes Wissenswiki für Wirtschaftsingenieurwesen — als kumulative Schicht
zwischen Quellenpool und Lehrproduktion. Zwei Eingangspfade: **Zotero** für formal verwaltete
Literatur (Papers, Bücher, Artikel mit DOI/BibTeX) und **`raw/`** für alles andere
(Web-Clips, Grauliteratur, eigene Notizen, Vorlesungsmitschnitte).

Technisches Schema und Seitenstruktur in `[WIKI-FOLDER]/wiki-schema.md` — diese Datei
**immer vor dem Ingest lesen**.

---

## Trigger-Übersicht

| Befehl | Verhalten |
|--------|-----------|
| `ingest @citekey` | Eine Quelle per Zotero-Citekey verarbeiten (interaktiv) |
| `ingest raw/[datei]` | Eine Datei aus dem raw/-Ordner verarbeiten (interaktiv) |
| `update wiki` | Alle neuen Einträge seit letztem log.md-Datum (Zotero + raw/) |
| `update wiki: [thema]` | Zotero nach Thema/Tag + passende raw/-Dateien, alle Treffer |
| `query wiki: [frage]` | Wiki durchsuchen, Antwort mit [[Wikilinks]] synthetisieren |
| `lint wiki` | Integritätsaudit mit Schweregrad-Klassifikation |
| `wiki status` | Überblick ohne Schreiboperationen |

---

## Ingest-Workflow (gilt für alle Ingest-Trigger)

### Schritt 0 — wiki-schema.md lesen
```
Lese [WIKI-FOLDER]/wiki-schema.md
```
Daraus: Themaordner, Knotentypen, Frontmatter-Schema, Normen-Annotationsregel,
Beziehungsvokabular. Ohne diesen Schritt nicht weiterarbeiten.

---

### Schritt 1a — Quelle aus Zotero holen (`ingest @citekey`)

**Bevorzugt: Zotero MCP Server (Port 23120)**
```bash
curl -s http://127.0.0.1:23120/ping   # → pong erwartet
```

Wenn MCP verfügbar:
```
search(q: "@citekey")          → item key
get_item_by_key(key)           → Metadaten, Abstract, Attachments
get_pdf_content(itemKey)       → Volltext (wenn PDF vorhanden)
get_item_annotations(itemKey)  → Highlights und Annotationen
```

**Fallback: Local HTTP API (Port 23119)**
```python
import urllib.request, json
req = urllib.request.Request(
    f'http://localhost:23119/api/users/0/items?q=CITEKEY&limit=5&format=json',
    headers={'Zotero-Allowed-Request': 'true'}
)
with urllib.request.urlopen(req, timeout=10) as r:
    items = json.load(r)
```

**Volltext ist Pflicht — sonst Stopp und Rückfrage.** Eine belastbare Wiki-Seite
entsteht aus dem **Volltext**, nicht aus dem Abstract: Abstracts verschweigen Methode,
Einwände und Differenzierungen, und eine Seite, die vorgibt, aus der Quelle gearbeitet
zu sein, obwohl nur der Abstract vorlag, untergräbt das Vertrauen ins ganze Wiki. Daher:

- **Volltext vorhanden** (PDF-Attachment in Zotero, OA-Quelle oder raw/-Datei) → normal
  ingesten (Metadaten + Abstract + Volltext lesen).
- **Kein Volltext** → **nicht still mit dem Abstract weitermachen.** Den Nutzer warnen
  und fragen, wie zu verfahren ist:
  1. **Volltext beschaffen** — z. B. über den `literatursuche`-Skill den frei verfügbaren
     OA-Volltext (Unpaywall/arXiv) suchen und ans Zotero-Item hängen, dann ingesten;
  2. **ausnahmsweise nur aus Abstract/Metadaten** ingesten — dann die Seite bewusst knapp
     halten und in log.md mit `[kein Volltext]` markieren;
  3. **überspringen.**
  Erst nach der Antwort weiterarbeiten.

Bei Büchern zählt Inhaltsverzeichnis + relevante Kapitel als Volltext.

---

### Schritt 1b — Quelle aus raw/ lesen (`ingest raw/[datei]`)

```
Lese [VAULT-ROOT]/raw/[dateiname]
```

Vollständig lesen. Bei Bildreferenzen im Dokument: Bilder separat lesen wenn sie
inhaltlich relevant sind (`raw/assets/`).

Quellentyp bestimmen (für Frontmatter und log.md):
- `artikel` — Web-Artikel, Blogpost, Online-Quelle
- `paper` — Arbeitspapier, Preprint ohne Zotero-Eintrag
- `notiz` — eigene Notizen, Mitschnitte, Zusammenfassungen
- `bericht` — Unternehmens-/Institutionsberichte, Grauliteratur
- `transkript` — Vorlesungsmitschnitte, Interview-Transkripte

---

### Schritt 2 — Interaktive Takeaway-Diskussion

**Nach dem Lesen, vor dem Schreiben** — immer, außer bei Bulk-Ingest mit
explizitem „ohne Rückfrage"-Flag.

Die 3–5 wichtigsten Erkenntnisse aus der Quelle präsentieren:

> „Aus [Quelle] habe ich folgende Kernpunkte identifiziert:
>
> 1. [Takeaway 1]
> 2. [Takeaway 2]
> 3. [Takeaway 3]
> ...
>
> Gibt es Aspekte, die Sie besonders betonen möchten, oder Themen, die ich
> für diesen Kurs weglassen soll?"

Auf Antwort warten. Anpassungen notieren, dann mit Schritt 3 fortfahren.

**Ausnahme Bulk-Ingest**: Wenn der Nutzer `update wiki` ohne weitere Anweisung
gibt, fragen:
> „Bulk-Ingest: soll ich jede Quelle kurz besprechen (interaktiv) oder alle
> ohne Rückfrage durchlaufen?"

Bei „ohne Rückfrage": Schritt 2 für alle Quellen überspringen und
am Ende einen Gesamt-Report ausgeben.

**Volltext-Regel gilt auch im Bulk-Modus** (s. Schritt 1a): Quellen **ohne** Volltext
werden im Automatik-Lauf **nicht** still aus dem Abstract ingestet, sondern
übersprungen und am Ende gesammelt gemeldet („N Quellen ohne Volltext —
beschaffen/nur-Abstract/überspringen?"). So entscheidet der Nutzer gebündelt,
statt dass dünne Abstract-Seiten unbemerkt ins Wiki wandern.

---

### Schritt 3 — Index lesen und Bestand prüfen
```
Lese [WIKI-FOLDER]/index.md
```
Prüfen: Gibt es bereits Seiten zu den Konzepten/Standards/Entitäten der neuen Quelle?
Falls ja: aktualisieren statt neu anlegen.

---

### Schritt 4 — Konzepte, Standards und Entitäten identifizieren

Aus Quelle extrahieren (gefiltert durch die Anpassungen aus Schritt 2):
- **Konzepte**: Theorien, Modelle, Methoden, Prinzipien (z.B. "Deckungsbeitrag",
  "Bullwhip-Effekt", "Lean Management")
- **Standards/Normen**: Gesetze, Rechnungslegungsstandards, technische Normen, die
  direkt zitiert werden (z.B. "HGB § 253", "IFRS 16", "ISO 9001")
- **Entitäten**: Personen (Autoren, Theoretiker), Institutionen, Unternehmen als
  Fallbeispiele

Themaordner aus wiki-schema.md abgleichen. Max. ~15 Seiten pro Ingest-Lauf.

**Kanonisierung (eine Seite pro Begriff)**: Ein Konzept bekommt **genau eine** Seite in
**einer** Sprache (deutsch primär; der englische/andere Fachterm steht als Synonym im ersten
Satz und im `tags:`-Feld, **nicht** als eigene Seite). Also `Bilanz` mit „(Balance Sheet)" im
Text — **keine** zweite Seite `Balance Sheet`. Personen/Institutionen: offizielle Vollform als
Titel, Kürzel als Synonym (`Neue Institutionenökonomik`, nicht zusätzlich `NIÖ`).

**Granularität (Seite vs. Abschnitt)**: Eine eigene Seite nur, wenn der Begriff (a) eigen-
ständige Substanz für ≥3 Kernaspekte trägt **und** (b) quellenübergreifend referenziert wird.
Sonst wird er ein `###`-Abschnitt der Elternseite. Reine Lehrbuch-/Skript-Gliederungspunkte
(einzelne Kapitelüberschriften) sind **keine** automatischen Seitenkandidaten.

---

### Schritt 5 — Wiki-Seiten schreiben / aktualisieren

Jede neue Seite nach Seitenvorlage aus wiki-schema.md:

```markdown
---
type: wiki-page
wiki-category: konzept          # konzept | standard | entitaet | fallstudie | synthese
thema: [Thema1, Thema2]
quellen: ["@citekey1"]          # bei raw/-Quellen: ["raw/dateiname.md"]
kurs: []                        # optional: Lehrveranstaltungen
created: YYYY-MM-DD
updated: YYYY-MM-DD
---

# [Titel]

## Definition / Einordnung

## Kernaspekte

## Bezüge & Kontroversen

## Verwandte Konzepte
[[Wikilink1]] · [[Wikilink2]]

## Quellen
[[@citekey1]]
```

**Tiefe & Altitude (Konzept-Atom, nicht Paper-Exzerpt)**: Eine Seite gehört dem *Begriff*,
nicht der Quelle. Richtwert **500–850 Wörter**, **3 (max. 4)** `###`-Kernaspekte; kanonische Lesart
statt Nacherzählung einer Quelle; **kein Citekey hinter jedem Satz** und keine Referenten-Stimme
(„die Autoren zeigen…"); Tabellen/Hausstil erwünscht. Kommt später ein weiteres Schlüsselwerk dazu →
bestehende Seite **ergänzen** (`quellen:` erweitern), keine Parallelseite. Vollständige Kriterien +
Red Flags: **`wiki-schema.md` → „Tiefenstandard & Altitude"**.

**Normen-Annotation**: Aussagen, die direkt auf einer Rechtsnorm, einem
Rechnungslegungsstandard oder einer technischen Norm beruhen:
```
> [!norm] 📐 [Normtyp] · [Referenz]
> [Kurzer Kommentar: Verbindlichkeit, Geltungsbereich, ggf. Änderungsstand]
```
Normtypen: `HGB` · `IFRS/IAS` · `AktG/GmbHG` · `ISO/DIN` · `EU-RL` · `BGB` · `GoB`

**Pflichtcheck vor jedem `[!norm]`-Callout**: Enthält der tatsächliche Quelltext
(PDF, Artikel, Notiz) eine explizite Zitation dieser Norm — z.B. „§ 253 HGB",
„IFRS 16", „ISO 9001:2015 Kap. 8.4"? Falls nein → kein Callout setzen.
Keinen Callout ableiten aus: Themenähnlichkeit, Branchenkontext oder eigenem
Hintergrundwissen. Lieber keinen Callout als einen ungedeckten.

**[[Wikilinks]]**: Alle zentralen Aussagen mit Wikilinks belegen.
Beziehungsvokabular aus wiki-schema.md verwenden (basiert_auf, konkretisiert,
widerspricht, ergänzt, angewendet_in).

**Bei Widersprüchen zu bestehenden Seiten**: vorhandene Seite aktualisieren,
Widerspruch mit beiden Quellen explizit dokumentieren — nicht glätten.

**Keine Synthese-Seiten beim Ingest**: Synthese-Seiten (`wiki-category: synthese`)
entstehen ausschließlich über `query wiki:` (Schritt 5 dort). Beim Ingest werden
nur Konzept-, Standard-, Entitäts- oder Fallstudie-Seiten angelegt.

---

### Schritt 6 — index.md aktualisieren

Neue Seiten in die thematisch passende Sektion von `[WIKI-FOLDER]/index.md` eintragen.

---

### Schritt 7 — log.md Eintrag anhängen

Für Zotero-Ingest:
```
- **Ingest** `@citekey` ([Kurztitel])
  → erstellt: [[Seitenname1]], [[Seitenname2]]
  → aktualisiert: [[Seitenname3]]
  → Thema: Thema1, Thema2
  → [kein Volltext]   ← nur wenn zutreffend
```

Für raw/-Ingest:
```
- **Ingest** `raw/dateiname.md` ([Kurztitel], Typ: artikel|paper|notiz|bericht|transkript)
  → erstellt: [[Seitenname1]], [[Seitenname2]]
  → aktualisiert: [[Seitenname3]]
  → Thema: Thema1, Thema2
```

---

## Update Wiki — Bulk-Ingest

### `update wiki`
1. Lese `[WIKI-FOLDER]/log.md` → letztes Ingest-Datum ermitteln
2. **Zotero**: alle Einträge seit diesem Datum suchen
3. **raw/**: alle Dateien in `[VAULT-ROOT]/raw/` (ohne `raw/assets/`) listen;
   per log.md prüfen welche noch nicht verarbeitet wurden
4. Beide Listen zusammenführen → Nutzer nach interaktivem oder automatischem
   Modus fragen (s. Schritt 2)
5. Pro Eintrag: Standard-Ingest-Workflow (Schritte 0–7)
6. Token-Budget beachten: bei absehbarem Limit in log.md mit
   `[unterbrochen nach N Quellen, N ausstehend]` dokumentieren

**Konsolidierungs-Barrier (Pflicht im Automatik-/Parallelmodus)**: Läuft der Bulk-Ingest ohne
interaktive Schritt-2-Filterung, **vor dem Schreiben** alle vorgeschlagenen Seiten über alle
Quellen sammeln und **semantisch** deduplizieren (nicht nur exakter Titel):
- Sprach-/Übersetzungsvarianten zusammenführen (`Income Statement` → `Gewinn- und Verlustrechnung`)
- Klammer-/Kürzel-Varianten gegen Bestand matchen (`Neue Institutionenökonomik` ↔ `… (NIÖ)`)
- mehrere Quellen zum selben Begriff → **eine** Seite mit gesammelten `quellen:`
Erst nach dieser Barrier schreiben. Ohne sie entsteht Near-Duplikat-Wildwuchs (v.a. bei
Lehrbuchquellen). Gilt analog für parallele Multi-Agent-Läufe: Extrahieren → **Dedup-Barrier**
→ Schreiben.

Am Ende des Bulk-Ingests Gesamt-Report ausgeben:
```
Bulk-Ingest abgeschlossen: N Quellen verarbeitet
→ erstellt: N neue Seiten
→ aktualisiert: N Seiten
→ Widersprüche gefunden: N (siehe [[Seitenname]])
```

### `update wiki: [thema]`
Wie `update wiki`, aber Zotero-Suche auf das angegebene Thema/Tag eingrenzen
und raw/-Dateien nur wenn Dateiname oder Inhalt das Thema enthält:
```
search(q: "THEMA", tags: "TAG")
grep -rl "THEMA" [VAULT-ROOT]/raw/ --include="*.md"
```

---

## Query Wiki

### Schritt 1 — Index lesen
`[WIKI-FOLDER]/index.md` → thematisch relevante Seiten identifizieren.

### Schritt 2 — Grep-Suche
Schlüsselbegriffe aus der Frage extrahieren. Immer deutsch + englische Varianten:
```bash
grep -rl "Deckungsbeitrag\|contribution margin\|Teilkostenrechnung" \
  "[WIKI-FOLDER]/" --include="*.md"
```
Synonyme und verwandte Begriffe aktiv mitsuchen.

### Schritt 3 — Quellen zusammenführen
Index-Treffer + Grep-Treffer zusammenführen, Duplikate entfernen.
[[Wikilinks]] auf thematisch relevanten Seiten verfolgen.
Cap: max. 10–12 Seiten lesen; bei mehr nach Relevanz filtern.

### Schritt 4 — Antwort synthetisieren

| Fragetyp | Format |
|----------|--------|
| Faktenfrage | Direkte Antwort + Belege |
| Vergleichsfrage | Strukturierter Vergleich |
| Explorative Frage | Thematischer Überblick mit Verweisen |
| Listenfrage | Annotierte Liste |

Jede zentrale Aussage mit `[[Wikilink]]` belegen. Widersprüche zwischen Quellen
explizit benennen, nicht glätten. Wissenslücken klar ausweisen + `ingest`-Hinweis geben.

**Strenge Wiki/Eigenwissen-Trennung**: `query wiki:` fragt das Wiki ab, nicht das
Trainings-Wissen. Für jede Aussage in der Antwort gilt eine von zwei Zuordnungen:

- **Wiki-belegt**: Aussage stammt aus einer gelesenen Wiki-Seite → `[[Wikilink]]` oder Quellenangabe
- **Nicht im Wiki**: eigenes Hintergrundwissen → explizit kennzeichnen:
  `*Anmerkung: nicht im Wiki belegt — eigenes Hintergrundwissen*`

Diese Trennung ist nicht optional. Sie macht Wissenslücken im Wiki sichtbar und
schützt vor dem impliziten Einschmuggeln von unkuratiertem Wissen.

### Schritt 5 — Synthese-Seite anbieten
Nach der Antwort fragen:
> „Soll ich diese Analyse als Synthese-Seite im Wiki speichern?"

Bei Ja:
- Dateiname: `Synthese - [beschreibender Titel].md`
- wiki-category: `synthese`
- Frontmatter mit allen referenzierten Citekeys / raw/-Dateien in `quellen:`
- Ablage in passendem Themaordner
- index.md und log.md aktualisieren

---

## Wiki Status

Ohne Schreiboperationen:
1. `[WIKI-FOLDER]/index.md` lesen → Seitenzahl pro Themaordner zählen
2. `[WIKI-FOLDER]/log.md` lesen → letzte 5 Ingests, letzter Lint-Lauf
3. `[VAULT-ROOT]/raw/` scannen → unverarbeitete Dateien zählen

Ausgabe:
```
## Wiki Status — YYYY-MM-DD

Seiten gesamt: N  |  Letzte Aktualisierung: DATUM

Themaordner:
- [Ordner1]: N Seiten
- [Ordner2]: N Seiten

Letzte Ingests: @citekey1, @citekey2, raw/artikel.md
Letzter Lint: DATUM (N Fehler, N Warnungen)
Unverarbeitete raw/-Dateien: N

Empfehlung: [z.B. "lint wiki fällig" | "N Dateien in raw/ warten auf Ingest"]
```

---

## Lint Wiki

Integritätsaudit mit drei Schweregraden.

### Fehler (müssen behoben werden)
- **Kaputte Wikilinks**: `[[Seite]]` ohne existierende Datei
  (Aliase nach `|` und Anker nach `#` vor dem Dateisystemcheck abschneiden)
- **Index-Inkonsistenz**: Einträge in index.md ohne Datei, oder Dateien mit
  `type: wiki-page` die nicht in index.md stehen

### Warnungen (sollten behoben werden)
- **Waisen-Seiten**: `type: wiki-page` ohne eingehende Links von anderen Seiten
- **Veraltete Norm-Annotationen**: `[!norm]`-Callouts auf Standards/Normen, die laut
  neueren Ingests geändert wurden, ohne dass die Seite aktualisiert wurde
- **Fehlende Seiten**: Begriffe, die auf ≥3 Seiten per `[[Wikilink]]` referenziert
  werden, aber keine eigene Datei haben
- **Frontmatter-Drift**: Seite hat `[!norm]`-Callout, aber der Standard steht nicht
  im `normen:`-Feld
- **Unverarbeitete raw/-Dateien**: Dateien in `raw/` die älter als 7 Tage sind
  und noch nicht im log.md auftauchen

### Info (Verbesserungspotenzial)
- **Dünne Abdeckung**: Seiten mit < 2 Quellen in `quellen:`
- **Fehlende Querlinks**: Seiten zum selben `thema:` ohne gegenseitige Verlinkung
- **Seiten ohne Frontmatter**: Dateien in Wiki-Ordnern ohne `type: wiki-page`

### Ausgabeformat
```
## Lint-Ergebnis — YYYY-MM-DD

### Fehler (N)
- [[Seitenname]]: kaputter Link zu [[NichtExistierendeSeite]]

### Warnungen (N)
- [[Seitenname]]: Waisen-Seite (keine eingehenden Links)
- [[Seitenname]]: [!norm]-Callout auf IFRS 16 — Standard wurde 2024 geändert
- raw/artikel.md: seit 12 Tagen unverarbeitet

### Info (N)
- [[Seitenname]]: nur 1 Quelle, Thema dünn abgedeckt
```

Ergebnis **immer** in log.md eintragen — auch wenn keine Fehler gefunden wurden:
`- **Lint** — N Fehler, N Warnungen, N Info`
Lint ohne log.md-Eintrag ist unvollständig.

**Empfohlener Rhythmus**: Nach jedem 10. Ingest oder monatlich.

---

## Integration mit lecture-factory

`lecture-factory`/`quarto-lecture` binden das Wiki über einen **skill-verwalteten Pointer** ein:
die Metazeile `**Wiki:** <pfad>` in `_curriculum.md`. Der Nutzer trägt sie **nicht von Hand** ein —
fehlt sie, fragt der Skill **einmal** „Wo liegt das Wiki? (Pfad / keins)" und schreibt die Antwort
selbst hinein (`**Wiki:** <pfad>` bzw. `**Wiki:** none`). Danach gilt: Pfad → **Wiki-Modus**;
`none` → klassischer Ablauf ohne jede Wiki-Erwähnung (Kolleg:innen ohne Wiki merken nichts, und es
wird nicht erneut gefragt).

**Ablauf im Wiki-Modus** (vor dem Schreiben jedes Kapitels):
1. `query wiki: [Kapitelthema]` gegen den Pointer-Pfad ausführen → **Wissensbriefing**. Die
   strenge Wiki/Eigenwissen-Trennung (s. „Query Wiki", Schritt 4) liefert pro Aussage schon die
   Provenienz: *Wiki-belegt* `[[Wikilink]]` vs. *nicht im Wiki* (Eigenwissen).
2. **Hybrid-Grounding-Vertrag:** wiki-belegte Definitionen/Normen sind **bindend** (überschreiben
   generisches Modellwissen); Didaktik, Beispiele und Aufbau dürfen frei aus Trainingswissen kommen.
   Jede **harte** neue Fachaussage/Norm, die nur aus Trainingswissen stammt, wird im Draft markiert:
   `<!-- ergänzt (nicht im Wiki): [Begriff] -->` (render-unsichtbar, grepbar). Widersprüche nicht glätten.
3. **Rückfluss:** Nach dem Schreiben die Marker greppen → Lücken-Report, dann `update wiki`/`ingest`
   anbieten, damit das Wiki beim Vorlesungsschreiben wächst.

Wenn das Wiki zu einem Thema leer ist → nicht-blockierender Hinweis:
> „Das Wiki hat noch keine Seiten zu [Thema]. Soll ich relevante Zotero-Quellen
> suchen oder raw/-Dateien verarbeiten, bevor wir das Kapitel schreiben?"

Expliziter manueller Aufruf bleibt möglich:
```
query wiki: Was sagt meine Literatur zu Deckungsbeitragsrechnung?
→ [Synthese aus Wiki]  →  lecture-factory [Kapitel KLR]
```

---

## Qualitätsstandards

- **Substanziell**: Wiki-Seiten sind akademisch belastbar — nicht nur zusammenfassend,
  sondern klassifizierend, differenzierend und vernetzend (min. 4–6 Sätze pro Abschnitt)
- **Quellenehrlich**: Jede zentrale Aussage mit [[Wikilink]] oder Quellenangabe belegt
- **Lücken transparent**: Fehlende Abdeckung klar ausweisen, nicht kaschieren
- **Normen aktuell**: Bei Gesetzen/Standards Datum des Geltungsstands im `[!norm]`-Callout
- **Max. 15 Seiten pro Ingest**: Lieber weniger und gründlich als viele und flach
- **raw/ ist Eingang, nicht Ablage**: Verarbeitete Dateien bleiben in raw/, werden
  aber nicht nochmal ingested (Schutz via log.md-Check)

---

## Setup-Checkliste (Ersteinrichtung)

- [ ] Obsidian Vault vorhanden
- [ ] `raw/` und `raw/assets/` Ordner im Vault-Root anlegen
- [ ] `[WIKI-FOLDER]/wiki-schema.md` aus `references/wiki-schema.md` kopieren und anpassen
- [ ] `[WIKI-FOLDER]/index.md` aus `references/index-template.md` anlegen
- [ ] `[WIKI-FOLDER]/log.md` aus `references/log-template.md` anlegen
- [ ] Themaordner in wiki-schema.md eintragen (z.B. `Rechnungswesen/`, `IFRS/`, `Ethik/`)
- [ ] Zotero 7 läuft lokal mit MCP-Plugin (Port 23120)
- [ ] Obsidian Web Clipper installiert, Zielordner auf `raw/` konfiguriert
- [ ] Ersten Ingest testen: `ingest @[beliebiger Citekey]` oder `ingest raw/[erste Datei]`

### Migration bestehender Vaults
Wenn Ethik-Vault und IFRS-Vault zusammengeführt werden:
1. Seiten aus Ethik-Vault → `[WIKI-FOLDER]/Ethik/` verschieben
2. Seiten aus IFRS-Vault → `[WIKI-FOLDER]/IFRS/` verschieben
3. CLAUDE.md konsolidieren (wiki-schema.md als einzige Referenz)
4. `lint wiki` laufen lassen → kaputte Cross-Vault-Links finden und reparieren
5. index.md und log.md manuell zusammenführen
