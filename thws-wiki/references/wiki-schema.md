---
type: wiki-schema
updated: 2026-06-17
---

# Wiki Schema — THWS Wirtschaftsingenieurwesen

Technische Referenz für den Agenten. Wird bei jedem Ingest gelesen.

---

## Frontmatter-Schema

Pflichtfelder für alle Wiki-Seiten:

```yaml
---
type: wiki-page
wiki-category: konzept | standard | entitaet | fallstudie | synthese
thema: [Thema1, Thema2]          # Themaordner-Zuordnung (s.u.)
quellen: ["@citekey1", "@citekey2"]
kurs: []                          # optional: Lehrveranstaltungen (z.B. "KLR", "BWL I")
created: YYYY-MM-DD
updated: YYYY-MM-DD
normen: []                        # optional: direkt zitierte Normen/Standards
literaturstand: YYYY-MM-DD        # optional: Datum letzter vollständiger Literaturprüfung
---
```

Das `normen:`-Feld (optional) macht Norm-Referenzen maschinenlesbar für den Lint:
```yaml
normen:
  - "HGB § 253"
  - "IFRS 16"
  - "ISO 9001:2015 Kap. 8.4"
```

---

## Seitentypen

**Kanonische Benennung**: Pro Begriff genau eine Seite in einer Sprache (deutsch primär;
Fremdterm als Synonym im Text + `tags:`). Keine Übersetzungs-, Kürzel- oder Klammer-Dubletten
(`Bilanz`, nicht zusätzlich `Balance Sheet`; `Neue Institutionenökonomik`, nicht `… (NIÖ)`).
Im Bulk-/Parallelmodus vor dem Schreiben semantisch gegen Bestand deduplizieren.

### Konzept-Seite
Für: Theorien, Modelle, Methoden, Prinzipien, betriebswirtschaftliche Konzepte.
- Namensschema: `[Begriff].md` (z.B. `Deckungsbeitragsrechnung.md`, `Bullwhip-Effekt.md`)
- `wiki-category: konzept`

### Standard-Seite
Für: Einzelne Paragraphen oder Abschnitte von Gesetzen, Rechnungslegungsstandards,
technischen Normen — wenn das Konzept maßgeblich durch die Norm definiert wird.
- Namensschema: `[Norm] [Referenz].md` (z.B. `HGB § 253.md`, `IFRS 16.md`, `ISO 9001.md`)
- `wiki-category: standard`
- Immer `[!norm]`-Callout mit Geltungsdatum
- Konzeptseiten verlinken hierher statt Normen im Fließtext zu benennen

### Entität-Seite
Für: Personen (Theoretiker, Autoren), Institutionen, Unternehmen als Fallbeispiele.
- Namensschema: Personen `Nachname Vorname.md`, Institutionen Kurzbezeichnung
- `wiki-category: entitaet`

### Fallstudie-Seite
Für: Aufbereitete Fallstudien (auch aus `case-builder`-Output), Unternehmensbeispiele.
- Namensschema: `[Unternehmen] - [Thema].md` (z.B. `Toyota - Lean Production.md`)
- `wiki-category: fallstudie`
- Optional: `kurs:`-Feld mit Lehrveranstaltungen, in denen die Fallstudie eingesetzt wird

### Synthese-Seite
Für: Themenübergreifende Zusammenführung mehrerer Quellen, erzeugt durch `query wiki:`.
- Namensschema: `Synthese - [beschreibender Titel].md`
- `wiki-category: synthese`

---

## Seitenvorlage

```markdown
---
type: wiki-page
wiki-category: [konzept|standard|entitaet|fallstudie|synthese]
thema: [Thema]
quellen: ["@citekey"]
kurs: []
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
[[@citekey1]], [[@citekey2]]
```

---

## Tiefenstandard & Altitude

Wiki-Seiten sind akademisch substanziell — klassifizierend, differenzierend, vernetzend —
aber **Konzeptseiten, keine Paper-Exzerpte**.

**Umfang**: Richtwert **500–850 Wörter** Fließtext. Unter ~350 ist die Seite zu dünn;
über ~900 kippt sie in ein Literaturreferat. Lieber **3 dichte Kernaspekte als 5 dünne**.

**Konzept-Atom, nicht Paper-Exzerpt** (wichtigster Punkt): Die Seite gehört dem *Begriff*,
nicht der Quelle. Eine Quelle darf die Seite verankern, aber:
- Schreibe die **kanonische Lesart** des Konzepts, keine Nacherzählung eines Papers. Übernimm
  **nicht** die quellenspezifische Notation, Figuren-/Fußnoten-/Abschnittsnummern einer einzelnen
  Quelle („Figur 9", „Fußnote 22", „in Abschnitt 3.6").
- Stelle den **Sachverhalt** dar, nicht das Paper. Vermeide die **Referenten-Stimme** als Default
  („die Autoren zeigen…", „nach Aussage der Autoren", „das Paper").
- Belege auf **Abschnitts-/Kernaussagen-Ebene**, **nicht hinter jedem Satz**. Ein Citekey pro
  Absatz bzw. pro zentraler Aussage genügt.
- Schreibe so, dass `quellen:` **wachsen** kann. Bei einem kanonischen Begriff mit mehreren
  Schlüsselwerken ist eine Ein-Quellen-Seite ein Zwischenstand: kommt später ein weiteres Werk
  dazu → bestehende Seite **ergänzen** (`quellen:` erweitern), keine Parallelseite anlegen.

**Quellenlocator** (optional, für die Lehre): Eine präzise Fundstelle darf angegeben werden, damit
Leser die Stelle im Paper finden — aber **nur am Zitat-Bracket**, nie als Fließtext-Gerüst. Format
Pandoc/Quarto-citeproc-kompatibel: `[@citekey, S. 77]` · `[@citekey, Gl. 1]` · `[@citekey, Tab. 9]` ·
`[@citekey, Abschn. 4]`. Nur an **überprüfbare Spezifika** (wörtliches Zitat, konkrete Zahl, benannte
Formel/Theorem), sparsam (~2–4 pro Seite). Quelleninterne Nummern im **Fließtext** bleiben verboten —
der Locator reitet auf der Zitatklammer, nicht in der Prosa.

**Tiefe je Abschnitt**:
- **Definition / Einordnung**: 1 Absatz (4–6 Sätze). Was es ist, Herkunft/Entwicklung, Abgrenzung.
- **Kernaspekte**: **3 (max. 4)** benannte `###`-Abschnitte à 3–5 Sätze, je mit konkretem Inhalt
  (Mechanismus, Kennzahl, Argument) — nicht generischer Beschreibung. Konkrete Normreferenzen wo relevant.
- **Bezüge & Kontroversen**: ≥2 konkrete Streit-/Abgrenzungspunkte.
- **Verwandte Konzepte**: ≥3 Wikilinks, davon ≥1 themenübergreifend, mit Beziehungsvokabular.

**Hausstil**: Das Skelett (Definition → Kernaspekte → Bezüge & Kontroversen → Verwandte Konzepte →
Quellen) ist Standard, aber **nicht heilig** — Sektionsnamen dürfen *themengetrieben* sein, wenn der
Stoff es trägt. **Tabellen, fette Run-in-Lead-ins und kompakte Bullets sind erwünscht**, wo sie Stoff
klarer fassen als Fließtext. Prüfe bei jedem Ingest, ob **eine Tabelle** einen Kernaspekt besser darstellt.

**Red Flags — du schreibst ein Paper-Exzerpt statt einer Konzeptseite**:
hinter (fast) jedem Satz derselbe Citekey · „die Autoren zeigen…/das Paper" als Default-Stimme ·
Figuren-/Fußnoten-/Abschnittsnummern einer Quelle **im Fließtext** (statt am Zitat-Bracket) · > 900 Wörter oder 5+ `###` · eine kanonische
Theorie hängt an genau einer Quelle.
→ **Gegenmittel**: Sachverhalt voranstellen, Quelle zurücknehmen, auf 3 Kernaspekte verdichten, Tabelle erwägen.

---

## Normen-Annotation

Aussagen, die direkt auf einer Rechtsnorm, einem Rechnungslegungsstandard oder
einer technischen Norm beruhen, werden mit einem `[!norm]`-Callout annotiert.
Der Callout steht *unterhalb* der betreffenden Aussage.

### Format

```
> [!norm] 📐 [Normtyp] · [Referenz]
> [Kurzer Kommentar: Verbindlichkeit, Geltungsbereich, Änderungsstand]
```

**Normtypen:**

| Kürzel | Anwendung |
|--------|-----------|
| `HGB` | Handelsgesetzbuch (Buchführung, Bilanzierung) |
| `IFRS` / `IAS` | International Financial Reporting Standards |
| `AktG` / `GmbHG` | Gesellschaftsrecht |
| `BGB` | Bürgerliches Gesetzbuch |
| `ISO` / `DIN` | Technische Normen, Qualitätsmanagement |
| `EU-RL` | EU-Richtlinien (transponiert oder direkt anwendbar) |
| `GoB` | Grundsätze ordnungsmäßiger Buchführung (nicht kodifiziert) |

**Beispiele:**

```
> [!norm] 📐 HGB · § 253 Abs. 1 HGB
> Niederstwertprinzip für Umlaufvermögen; zwingend für alle Kaufleute.
> Stand: HGB i.d.F. Bilanzrechtsmodernisierungsgesetz (BilMoG) 2009.

> [!norm] 📐 IFRS · IFRS 16 (gültig ab 01.01.2019)
> Leasingnehmer aktiviert Nutzungsrecht und Verbindlichkeit; Operating Lease
> entfällt als eigenständige Kategorie. Ersetzt IAS 17.

> [!norm] 📐 ISO · ISO 9001:2015 Abschnitt 8.4
> Steuerung extern bereitgestellter Prozesse, Produkte und Dienstleistungen
> (Lieferantenmanagement). Revidiert 2015, aktuelle Version ohne Übergangsfrist.
```

**Wann setzen:**
- ✅ Bei Aussagen, die direkt auf einer konkreten Norm oder einem Standard beruhen
- ✅ Bei Definitionen, die aus Gesetzestexten oder Standards stammen
- ❌ Nicht bei allgemeinen Lehrmeinungen oder Interpretationen
- ❌ Nicht bei jeder Aussage auf einer Seite — nur für normgestützte Kernaussagen

**Normen-Aktualität**: Bei Gesetzen/Standards immer Datum oder Version angeben.
Bei Änderungen durch neuere Ingests: betroffene Callouts mit Hinweis ergänzen:
```
> ⚠️ Geändert durch [Referenz] ab [Datum] — Seite aktualisieren.
```

---

## Beziehungsvokabular (Typed Wikilinks)

Beziehungen zwischen Konzepten werden im Fließtext mit einem kontrollierten
Relationsverb vor dem Wikilink ausgedrückt. Human-readable, grep-fähig für `query wiki:`.

| Verb | Bedeutung |
|------|-----------|
| **basiert_auf** | Theorie/Modell X baut auf Y auf |
| **konkretisiert** | X ist eine Anwendung/Verfeinerung von Y |
| **widerspricht** | X steht im Widerspruch zu Y (mit Quellenbeleg) |
| **ergänzt** | X und Y sind komplementär |
| **angewendet_in** | Konzept X wird in Fallstudie/Kontext Y eingesetzt |
| **definiert_durch** | X ist normativ durch Standard Y definiert |
| **ersetzt** | X hat Y abgelöst (bei Standards: mit Datum) |
| **abgeleitet_von** | X ist eine Ableitung/Variante von Y |

Beispiele im Fließtext:
```
Die [[Grenzplankostenrechnung]] **konkretisiert** [[Teilkostenrechnung]] für
industrielle Fertigungsprozesse mit starren Plankosten.

IFRS 16 **ersetzt** [[IAS 17]] ab dem Geschäftsjahr 2019 vollständig.

Der [[Bullwhip-Effekt]] **widerspricht** der Annahme rationaler Nachfrageglättung
in klassischen Bestandsmodellen (vgl. [[Lee et al. 1997]]).
```

---

## Themaordner

*(Hier eigene Themaordner eintragen — eine Zeile pro Ordner)*

Beispielstruktur für WI/Rechnungswesen:
```
[WIKI-FOLDER]/Rechnungswesen/       ← KLR, Buchführung, Bilanzierung, Steuern
[WIKI-FOLDER]/Unternehmenssteuerung/ ← Controlling, Strategie, Organisation
[WIKI-FOLDER]/SCM/                  ← Supply Chain, Logistik, Operations
[WIKI-FOLDER]/Wirtschaftsrecht/     ← HGB, AktG, GmbHG, Vertragsrecht
[WIKI-FOLDER]/Methoden/             ← Statistik, Optimierung, Simulation
[WIKI-FOLDER]/Didaktik/             ← Hochschullehre, Fallstudien, Prüfungsformate
```

Eigene Nicht-Wiki-Ordner (Inbox, Projekte, Tagesnotizen etc.) bleiben ausgeschlossen.

Neuen Ordner anlegen wenn: Quelle kann keinem bestehenden Ordner sinnvoll zugeordnet
werden und mindestens 2–3 Konzepte dieses Themas absehbar. Dann:
1. Ordner anlegen, Hub-Datei `[Thema].md` erstellen
2. Ordner in diese wiki-schema.md eintragen
3. index.md-Sektion anlegen
4. log.md-Eintrag: `- **Neuer Ordner** [Thema]/ angelegt`

---

## Zotero MCP Tools (Referenz)

Für Ingests: Zotero MCP Server (Port 23120), Tools als `mcp__zotero__*` aufrufbar.

| Tool | Verwendung |
|------|-----------|
| `search` | Item per @citekey oder Thema finden → gibt item key |
| `find_item_by_identifier` | Item per DOI oder ISBN finden |
| `get_item_by_key` | Vollständige Metadaten, Abstract, Attachment-Liste |
| `get_pdf_content` | PDF-Volltext extrahieren (Parameter: itemKey, optional page) |
| `get_item_annotations` | PDF-Highlights und Annotationen |
| `get_item_notes` | Zotero-Notizen zu einem Item |
| `get_collections` | Alle Sammlungen (für Bulk-Ingest) |
| `get_collection_items` | Alle Items einer Sammlung |

Fallback auf Local HTTP API (Port 23119) nur wenn MCP nicht antwortet.

---

## Ingest-Checkliste

Vor dem Schreiben:
- [ ] `wiki-schema.md` gelesen?
- [ ] `index.md` gelesen, Bestand geprüft?
- [ ] Zotero-Item vollständig geholt (Metadaten + Abstract + Volltext)?
- [ ] Konzepte, Standards und Entitäten aus Quelle identifiziert?
- [ ] Bestehende Seiten auf Aktualisierungsbedarf geprüft?

Beim Schreiben:
- [ ] Frontmatter vollständig (alle Pflichtfelder)?
- [ ] Inhalt auf Basis des tatsächlichen Quelltexts (nicht nur Titel/Abstract)?
- [ ] `[!norm]`-Callouts mit Datum/Version bei Norm-Aussagen?
- [ ] [[Wikilinks]] mit Beziehungsvokabular gesetzt?
- [ ] `updated`-Datum aktualisiert?

Nach dem Schreiben:
- [ ] `index.md` aktualisiert?
- [ ] `log.md`-Eintrag angehängt?
- [ ] Neuer Themaordner? → wiki-schema.md und CLAUDE.md aktualisieren

---

## log.md-Syntax

```
## YYYY-MM-DD

- **Ingest** `@citekey` ([Kurztitel])
  → erstellt: [[Seitenname1]], [[Seitenname2]]
  → aktualisiert: [[Seitenname3]]
  → Thema: Thema1, Thema2
  → [kein Volltext]   ← wenn kein PDF/HTML vorhanden

- **Bulk-Ingest** ([N] Quellen, Thema: [Thema])
  → [N] neue Seiten, [N] aktualisiert

- **Query** "[Frage]" → [[Synthese - Titel]] erstellt

- **Lint** — [N] Fehler, [N] Warnungen, [N] Info

- **Neuer Ordner** `[Thema]/` angelegt
```

Unterbrochene Sessions:
`[unterbrochen nach N Quellen, N ausstehend]`

---

## Nicht-Wiki-Seitentypen

Alle `.md`-Dateien im Wiki-Ordner tragen einen `type`-Eintrag:

| type | Bedeutung |
|------|-----------|
| `wiki-page` | Reguläre Wiki-Seite (unterliegt Tiefenstandard und Lint) |
| `wiki-schema` | Diese Datei |
| `wiki-index` | index.md |
| `wiki-log` | log.md |
| `hub` | Thema-Übersichtsseite (Dateiname = Ordnername) |
| `quelle` | Zotero-Quellen-Übersicht (`tags: [literatur]`) |
| `notiz` | Sonstige Notizen ohne Wiki-Status |

Nur `type: wiki-page`-Seiten werden von Ingest/Lint-Routinen erfasst.
