---
name: academic-research
description: |
  Multi-source academic literature search for accounting, finance, IFRS, and business topics.
  Searches SSRN, OpenAlex, CrossRef, and Semantic Scholar in parallel.
  Use when the user wants papers, citations, a bibliography, or literature for a lecture chapter.
  Trigger phrases: "suche Paper zu", "Literatur zu", "find literature on", "welche Studien gibt es zu",
  "Quellen für", "Literaturrecherche", "bibliography for", "Standardwerke zu", "was gibt es zu IFRS",
  "neueste Forschung zu", "search for papers on", "Zitate zu", "Literaturliste".
---

# Academic Research Skill

## Designprinzipien

1. **Parallel, nicht sequenziell** — alle Quellen gleichzeitig abfragen
2. **Früh filtern** — maximal 10 Ergebnisse zeigen, strikt nach Relevanz
3. **Schnell abbrechen** — wenn eine Quelle >15 s nicht antwortet, überspringen
4. **Claude-Fallback zuerst anbieten** — bei MCP-Ausfall sofort Kernliteratur aus Trainingswissen liefern
5. **Domänen-Shortcuts** — für Accounting/IFRS vordefinierte Suchstrategien

---

## Schritt 0: MCP-Verfügbarkeit prüfen (still, sofort)

```bash
# Einmalig zu Beginn jeder Session prüfen:
claude mcp list 2>/dev/null | grep -E "jina|academix"
```

| Ergebnis | Vorgehen |
|---|---|
| Beide verfügbar | Vollmodus: Jina + Academix parallel |
| Nur Academix | Academix + OpenAlex-curl parallel |
| Nur Jina | Jina (SSRN + Web) |
| Keiner | → sofort **Claude-Fallback** (Schritt 4) |

Nicht warten, nicht nachfragen — direkt mit dem verfügbaren Modus starten.

---

## Schritt 1: Query vorbereiten (max. 30 Sek.)

### 1a. Domäne erkennen

Gehört das Thema zu einer dieser Kategorien?

| Domäne | Primärquelle | Query-Boost |
|---|---|---|
| IFRS / IAS | SSRN + OpenAlex | Standardnummer hinzufügen (z.B. "IFRS 17") |
| HGB / deutsches Bilanzrecht | SSRN (German Law eJournal) + OpenAlex | "HGB" + englischen Begriff |
| Finanzwirtschaft / Corporate Finance | SSRN Finance + Semantic Scholar | |
| Wirtschaftsprüfung / Audit | SSRN Accounting + OpenAlex | |
| Business Ethics | SSRN + OpenAlex (J. Business Ethics) | |
| Allgemein / Unbekannt | Alle Quellen gleichgewichtig | |

### 1b. Query-Varianten generieren (ohne `expand_query`-Tool)

Für jedes Thema intern 3 Varianten formulieren:
- **Eng:** exakter Fachbegriff (z.B. "IFRS 17 insurance contracts")
- **Breit:** übergeordnetes Konzept (z.B. "insurance accounting IFRS")
- **Deutsch+Englisch:** bei HGB-Themen beide Sprachen (z.B. "Rückstellungen provisions HGB")

### 1c. Filter festlegen

Default-Filter (anpassen wenn Nutzer anderes nennt):
- **Zeitraum:** letzten 15 Jahre (aktuell: 2010–2025)
- **Mindest-Zitationen:** ≥5 (außer SSRN Working Papers: keine Untergrenze)
- **Sprache:** Englisch bevorzugt; Deutsch wenn HGB/deutsches Recht

---

## Schritt 2: Parallele Suche

**Alle verfügbaren Quellen gleichzeitig abfragen** — ein Tool-Call pro Quelle im selben Zug.

### Vollmodus (Jina + Academix)

```
Parallel dispatchen:
[1] search_ssrn: query="{enge Variante}"
[2] search_ssrn: query="{breite Variante}"  
[3] academic_search_papers: query="{enge Variante}", limit=15, sort="cited_by_count"
[4] academic_search_papers: query="{breite Variante}", limit=10
```

Nicht auf [1] warten bevor [2] startet — alle vier gleichzeitig.

### Nur Academix

```
Parallel:
[1] academic_search_papers: query="{enge Variante}", limit=20, sort="cited_by_count"
[2] academic_search_papers: query="{breite Variante}", limit=15
[3] curl OpenAlex (siehe Schritt 2a)
```

### Nur Jina

```
Parallel:
[1] search_ssrn: query="{enge Variante}"
[2] search_ssrn: query="{breite Variante}"
[3] search_web: query="{enge Variante} site:ssrn.com OR site:papers.nber.org"
```

### 2a. OpenAlex curl (Fallback ohne MCPs, immer nutzbar)

```bash
python3 - <<'EOF'
import urllib.request, urllib.parse, json, sys

query = "{QUERY}"
url = f"https://api.openalex.org/works?search={urllib.parse.quote(query)}&filter=publication_year:2010-2025&sort=cited_by_count:desc&per_page=15&mailto=christian.kraus@thws.de"

try:
    with urllib.request.urlopen(url, timeout=12) as r:
        data = json.load(r)
    for w in data.get("results", [])[:10]:
        title = w.get("title", "?")
        year = w.get("publication_year", "?")
        cites = w.get("cited_by_count", 0)
        doi = w.get("doi") or w.get("id", "-")
        venue = (w.get("primary_location") or {}).get("source", {}) or {}
        venue_name = venue.get("display_name", "-")
        print(f"{year} | {cites} cit. | {title[:80]} | {venue_name} | {doi}")
except Exception as e:
    print(f"OpenAlex error: {e}", file=sys.stderr)
EOF
```

---

## Schritt 3: Filtern und ausgeben

### 3a. Deduplizieren

DOI-Overlap und Titel-Ähnlichkeit prüfen. Bei Duplikat: Eintrag mit mehr Metadaten behalten.

### 3b. Relevanzfilter (hart)

Jeden Treffer bewerten — nur behalten wenn **mindestens 2** Kriterien erfüllt:
- Titel enthält Keyword aus der Suchanfrage
- Jahr ≥ 2010 (außer explizit nach Klassikern gefragt)
- Zitationen ≥ 5 (SSRN Working Papers ausgenommen)
- Venue ist peer-reviewed oder bekannte Fachzeitschrift

### 3c. Ausgabe — maximal 10 Treffer, immer dieselbe Tabelle

```markdown
## Literatur zu: [Thema]
*Quellen: [genutzte MCPs/APIs] · Zeitraum: [Filter] · [N] von [M] Treffern gezeigt*

| # | Titel | Autor(en) | Jahr | Zit. | Quelle | Link |
|---|---|---|---|---|---|---|
| 1 | ... | ... | 2023 | 142 | J. Accounting Research | doi:... |
| 2 | ... | ... | 2022 | 38 | SSRN Working Paper | ssrn:... |
```

**Direkt danach** — immer diese drei Angebote:

> **Nächste Schritte:**
> - `BibTeX exportieren` — für alle oder ausgewählte Treffer
> - `Tiefer einsteigen` — Zitationsnetzwerk eines Eintrags erkunden
> - `Zotero` — Treffer in Zotero-Kollektion speichern (zotero-skill)

---

## Schritt 4: Claude-Fallback (wenn MCPs nicht verfügbar oder Ergebnis < 3 Treffer)

**Sofort ausführen** — nicht zuerst lange auf MCP-Ergebnisse warten.

Bei MCP-Ausfall direkt Kernliteratur aus Trainingswissen liefern, klar markiert:

```markdown
## Kernliteratur zu: [Thema]
*⚠️ Aus Trainingswissen (Stand ≤ Mai 2025) — keine Live-Suche. Bitte DOIs vor Zitation verifizieren.*

**Standardwerke:**
- [Autor(en) (Jahr). Titel. Zeitschrift/Verlag.]
- ...

**Aktuelle Forschungsrichtungen** (Stand 2024/25):
- [Kurzbeschreibung der dominierenden Diskussionsstränge]

**Empfohlene Suchbegriffe für manuelle Suche:**
- scholar.google.com: "[Begriff1]" "[Begriff2]"
- SSRN: [Vorschlag]
```

Fallback liefert sofort Wert — und ist oft schneller als wartende MCPs.

---

## Schnellpfade für häufige Accounting-Anfragen

### IFRS-Standard suchen

Suche nach: `"{IFRS/IAS N} + Implementierung OR Herausforderungen OR Empirical evidence"` auf SSRN (IASB-Kommentare, Big4-Analysen) + OpenAlex (Published Journals).
Zeitfilter: ab Veröffentlichungsjahr des Standards.

### HGB-Thema suchen

Zwei Querys parallel: Deutschen Begriff (`"Rückstellungen HGB"`) und englischen Begriff (`"provisions German GAAP"`).
SSRN German Law eJournal gezielt einschließen.

### Standardwerk + aktuelle Entwicklungen

1. Erst Klassiker identifizieren (Zitationen ≥ 100, Erstpublikation ≥ 10 Jahre alt)
2. Dann Forward Citations des Klassikers für aktuelle Weiterentwicklung

### Literaturliste für Lehrkapitel

Query = Kapitelthema. Ausgabeformat: fertige Literaturliste nach Relevanz sortiert, bereit für Quarto-Frontmatter oder Zotero-Import.

---

## BibTeX-Export

**Mit Academix MCP:**
```
academic_get_bibtex: paper_ids=["doi1", "doi2", ...]
```

**Ohne MCP (manuell konstruiert):**
```bibtex
@article{AutorJahr,
  author  = {Nachname, Vorname},
  title   = {Titel},
  journal = {Zeitschrift},
  year    = {Jahr},
  volume  = {N},
  pages   = {XX--YY},
  doi     = {10.xxxx/...}
}
```

SSRN-only Working Papers:
```bibtex
@techreport{AutorJahr,
  author      = {Nachname, Vorname},
  title       = {Titel},
  year        = {Jahr},
  institution = {SSRN},
  type        = {Working Paper},
  url         = {https://ssrn.com/abstract=XXXXXXX}
}
```

---

## Qualitätskriterien für Ergebnisse

Vor der Ausgabe prüfen:
- ✅ Mindestens 3 Treffer gefunden
- ✅ Treffer passen thematisch (keine False Positives durch gleiche Abkürzungen)
- ✅ Kein Eintrag ohne DOI oder URL (nicht nachprüfbar)
- ✅ Zeitraum passt zum Filter
- ✅ Wenn <3 Treffer: sofort Fallback ergänzen

---

## MCP-Setup (Einmalig — nur wenn noch nicht konfiguriert)

**Jina MCP** (SSRN, Web, arXiv):
```bash
export JINA_API_KEY="jina_..."
claude mcp add-json jina '{"type":"streamable-http","url":"https://mcp.jina.ai/v1?exclude_tags=parallel","headers":{"Authorization":"Bearer '${JINA_API_KEY}'"}}'
```

**Academix MCP** (OpenAlex, CrossRef, Semantic Scholar):
```bash
uv tool install academix
export ACADEMIX_EMAIL="christian.kraus@thws.de"
claude mcp add-json academix '{"type":"stdio","command":"uvx","args":["academix"],"env":{"ACADEMIX_EMAIL":"'${ACADEMIX_EMAIL}'"}}'
```
