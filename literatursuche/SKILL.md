---
name: literatursuche
description: |
  Wissenschaftliche Literaturrecherche über Semantic Scholar, CrossRef, arXiv und PubMed — findet die wichtigsten Werke zu einem Thema, kuratiert sie nach Lehrrelevanz und übergibt auf Wunsch an Zotero und das thws-wiki.
  Diesen Skill IMMER verwenden, wenn der Nutzer nach Literatur, Quellen, Papern, dem Forschungsstand oder aktuellen Entwicklungen zu einem Thema fragt — auch ohne das Wort „Literatursuche".
  Trigger-Phrasen: „suche Literatur zu X", „was sind die wichtigsten Werke zu Y", „finde Paper über Z", „Forschungsstand zu X", „aktuelle Paper zu Y", „was gibt es Neues zu Z", „wer zitiert X", „einflussreichste Arbeiten zu Y", „gib mir die Grundlagenliteratur zu X", „ich bereite eine Vorlesung zu Y vor, was sollte ich lesen", „such mir Quellen für mein Kapitel über Z",
  „search literature on X", „what are the key works on Y", „find papers about Z", „state of the art in X", „recent papers on Y", „what's new in Z", „who cites X", „most influential work on Y".
  Auch auslösen bei: einem Thema + Lehr-/Recherche-Kontext, einer DOI/einem Titel mit der Bitte um verwandte oder neuere Arbeiten, oder wenn der Nutzer eine Lücke im Zotero/Wiki füllen will.
  NICHT für: Durchsuchen der EIGENEN Zotero-Bibliothek (→ zotero-skill) oder Wiki-Abfragen (→ thws-wiki). Dieser Skill sucht EXTERN im wissenschaftlichen Web.
---

# Literatursuche

Externe wissenschaftliche Literatur über vier offene APIs finden, nach **Lehrrelevanz** kuratieren und nahtlos in den bestehenden Workflow (Zotero → thws-wiki) überführen. Gedacht für die Vorbereitung von Vorlesungen und das Aktuell-Bleiben in den Feldern **Ethik** (v. a. Technik-/KI-Ethik), **Rechnungswesen & Finance** und **Business Intelligence**.

## Kernprinzipien

- **Keine erfundenen Quellen.** Jeder genannte Titel, Autor, Jahr und DOI stammt aus einer tatsächlichen API-Antwort. Niemals aus dem Gedächtnis zitieren. Bei Unsicherheit über eine DOI → via CrossRef gegenprüfen. Das ist die wichtigste Regel: eine plausibel klingende, aber halluzinierte Referenz ist schlimmer als gar keine.
- **Lehrrelevanz vor Vollständigkeit.** Ziel ist nicht der erschöpfende Review, sondern die kuratierte Shortlist, die eine Vorlesung trägt: ein paar Grundlagenwerke, das aktuell Wichtige, ein verlässliches Standardwerk.
- **Höflicher Zugriff.** Alle vier APIs gehen ohne Key. Bei jedem Request einen „polite" User-Agent mit Mail setzen: `thws-literatursuche/1.0 (mailto:flaneure.com@gmail.com)`. Das hebt CrossRef in den schnelleren „Polite Pool" und ist gute Praxis.
- **Übernahme nie automatisch.** Nach der Trefferliste immer explizit fragen, was als Nächstes passieren soll (siehe „Übernahme"). Nichts ungefragt nach Zotero oder ins Wiki schreiben.

## Die vier APIs

| API | Stärke | Wofür |
|---|---|---|
| **Semantic Scholar** | Zitationszahlen, citing/cited, Relevanz-Ranking, TLDR, OA-PDF-Link | Haupt-Suchmaschine + Citation-Mining |
| **CrossRef** | DOI→Metadaten, Bücher & Journals, Verifikation, Datums-/Typfilter | Etablierte Werke, Bücher, DOI-Gegencheck |
| **arXiv** | Preprints inkl. Volltext (CS/KI, Stats) | Frontier in KI/ML/Data Science |
| **PubMed** | Biomed./MeSH | **Nur** bei biomedizinischen oder bioethischen Themen |

Die konkreten, lauffähigen Aufrufe stehen in **`references/api-cookbook.md`** — diese Datei beim Such-Schritt **einmal lesen** und die Funktionen daraus verwenden (sie hält SKILL.md schlank).

## Feld-Routing

Welche APIs dominieren, hängt vom Thema ab:

- **Ethik / KI-Ethik / Technikphilosophie:** Semantic Scholar + CrossRef (Philosophie-Journals, Bücher) + arXiv (technische KI-Sicherheit, FAccT-Umfeld). Bei **Bioethik/Medizinethik** zusätzlich PubMed.
- **Rechnungswesen & Finance:** CrossRef + Semantic Scholar (Journals wie *The Accounting Review*, *Journal of Finance*); Standardwerke/Lehrbücher meist nur über CrossRef. arXiv nur bei quant-finance (`q-fin`).
- **Business Intelligence / Data Science:** Semantic Scholar + arXiv (`cs.DB`, `cs.LG`, `cs.AI`) für Methodik; CrossRef für IS-Journals (*MIS Quarterly*, *DSS*).

Im Zweifel breit über Semantic Scholar starten und mit CrossRef anreichern.

## Workflow — Standard

1. **Scope klären (nur wenn nötig).** Ist das Thema klar, direkt suchen. Bei Mehrdeutigkeit kurz nachfragen: Teilgebiet, Zeitfenster, Sprache, eher Überblick oder Spezialfrage. Nicht mit Fragen aufhalten, wenn die Absicht eindeutig ist.
2. **Fan-out-Suche.** Themen-Query gegen die fürs Feld passenden APIs (siehe Routing). Für den Aktualitäts-Teil Semantic Scholar mit `year`-Filter (z. B. letzte 2 Jahre), für Grundlagen nach `citationCount` sortiert. Cookbook nutzen.
3. **Merge & Dedupe.** Treffer über alle APIs einsammeln, per DOI (bzw. normalisiertem Titel) deduplizieren, mit Zitationszahl + Venue + Jahr + OA-PDF-Status anreichern (Semantic Scholar liefert das am dichtesten).
4. **Kuratieren & Ranken** (siehe nächster Abschnitt) → **Shortlist von 5–8 Werken** im Ausgabeformat.
5. **Rückfrage „tiefer graben?"** mit den drei Modi (Citation-Mining · Volltext-Zusammenfassung · Lücken & Kontroversen) — und der Übernahme-Option.

## Ranking

„Wichtigste Werke" = bewusster **Mix** aus drei Typen, nicht nur das Meistzitierte:

- **Grundlagen / meistzitiert** — die kanonischen Arbeiten, an denen man im Feld nicht vorbeikommt (hohe `citationCount`, oft älter).
- **Sehr aktuell (1–2 Jahre)** — der aktuelle Stand, fürs Vorlesungs-Update. Hier zählt Aktualität mehr als Zitationszahl; junge Paper hatten noch keine Zeit, zitiert zu werden.
- **Standard-/Lehrbücher** — etablierte Referenzwerke und Lehrbücher (meist über CrossRef, `type:book`), die einen Überblick geben.

Eine gute Shortlist enthält von jedem Typ etwas. Survey-/Review-Artikel sind kein Selbstzweck — nur aufnehmen, wenn sie didaktisch wirklich der beste Einstieg sind.

## Ausgabeformat

Die Shortlist als kompakte, scanbare Liste. Pro Eintrag: Autor(en) (Jahr) · Titel · Venue · Zitationen · DOI/Link · ein bis zwei Sätze **warum für die Lehre relevant** und welcher Typ (Grundlage/aktuell/Standard). Preprints klar als solche markieren.

```
**Die wichtigsten Werke zu [Thema]**

1. **Autor et al. (Jahr)** — *Titel*. Venue. [~N Zitationen · DOI:… ]
   → Warum relevant: … (Grundlagenwerk / aktuell / Standardwerk)
2. …
（5–8 Einträge, gemischt nach Typ）

Tiefer graben? Ich kann (a) Citation-Mining (wer baut darauf auf / einflussreichste
Folgearbeiten), (b) ein Paper im Volltext zusammenfassen, oder (c) Lücken & Kontroversen
im Thema herausarbeiten. Und/oder ausgewählte Werke nach Zotero bzw. ins Wiki übernehmen.
```

Bei mehr als ~8 starken Treffern: die besten 5–8 zeigen und anbieten, die Liste zu erweitern — nicht stillschweigend abschneiden.

## Aktualitäts-Modus („Was ist neu zu X")

Wenn der Nutzer auf dem Stand bleiben will („was gibt's Neues zu Y", „Entwicklungen seit 2024"):
`year`-gefilterte Suche (Semantic Scholar, jüngstes zuerst) **plus** Citation-Mining der bekannten Schlüsselwerke (wer zitiert sie kürzlich?). Ergebnis als kompaktes **Was-ist-neu-Briefing**: 3–6 jüngste relevante Arbeiten + ein, zwei Sätze zum erkennbaren Trend. Klar trennen zwischen Peer-Reviewed und Preprint.

## Tiefer graben

- **Citation-Mining.** Zu einem Ankerwerk die einflussreichsten Folgearbeiten ziehen (Semantic Scholar `citations`, sortiert/gefiltert über `influentialCitationCount`). Beantwortet „wer baut darauf auf" und deckt die jüngste Entwicklung eines Strangs auf.
- **Volltext-Zusammenfassung.** Bei OA/arXiv den Volltext holen und inhaltlich zusammenfassen. Pfad: PDF-URL aus Semantic Scholar (`openAccessPdf`) oder arXiv → mit WebFetch holen; landet die PDF lokal, mit dem Read-Tool seitenweise lesen (genau wie in dieser Bibliothek bei Gabriel/Amodei gemacht). Niemals aus dem Abstract eine Volltext-Zusammenfassung erfinden.
- **Lücken & Kontroversen.** Aus den Top-Treffern offene Fragen, Streitpunkte und unterbelichtete Aspekte synthetisieren — was wäre eine gute Diskussions- oder Prüfungsfrage. Jede Aussage an konkreten Treffern festmachen.

## Übernahme nach Zotero / Wiki (immer explizit fragen)

Nach der Trefferliste anbieten — und auf Antwort warten, bevor irgendetwas geschrieben wird:

1. **Nach Zotero** (über den `zotero-skill`): Ausgewählte Werke anlegen. Vorgehen reuse aus dem zotero-skill — `POST https://api.zotero.org/users/{uid}/items` mit Creds aus `ZOTERO_API_KEY`/`ZOTERO_USER_ID`; Ziel-Collection vorher erfragen und ihren Key im Feld `collections` mitgeben. Sind die Web-API-Creds nicht gesetzt, den lokalen Connector-Pfad des zotero-skill nutzen. Itemtyp korrekt setzen (`journalArticle`, `book`, `preprint`) und DOI/arXiv-ID füllen, damit später ein Volltext-Abgleich möglich ist.
2. **Ins thws-wiki** (über den `thws-wiki`-Skill): Erst nachdem das Werk in Zotero liegt und einen Better-BibTeX-Citekey hat, den Trigger **`ingest @citekey`** anbieten. Themaordner-Mapping: **Ethik** → `wiki/Ethik/`, **Rechnungswesen/Finance** → `wiki/Rechnungswesen/`. Für **Business Intelligence** existiert noch **kein** Themaordner — hier den Nutzer auf die Wiki-Expansionsregel hinweisen (neuer Ordner ab ~2–3 absehbaren Konzepten), statt BI gewaltsam in einen bestehenden Ordner zu pressen.

Reihenfolge der Kette: **Suche → (fragen) Zotero → (fragen) Wiki-Ingest.** Jeder Schritt einzeln bestätigt.

## Qualität & Fehlerbehandlung

- **Peer-Reviewed bevorzugen, Preprints kennzeichnen.** Für die Lehre zählt Verlässlichkeit; ein arXiv-Preprint ist als solcher zu markieren.
- **Dedupe ernst nehmen.** Dasselbe Paper taucht oft in mehreren APIs auf (DOI vs. arXiv-ID vs. leicht abweichender Titel) — über DOI und normalisierten Titel zusammenführen.
- **Leere/fehlerhafte Antworten abfangen.** Timeout oder 0 Treffer → Query variieren (Synonyme, engl. statt dt.), nicht abbrechen. Rate-Limit (HTTP 429) bei Semantic Scholar → kurz drosseln/seriell statt parallel.
- **Graceful Degradation.** Der ungekeyte Semantic-Scholar-Pool ist geteilt und antwortet bei viel Verkehr mit 429. Das ist kein Abbruchgrund: **CrossRef + arXiv** tragen die Suche allein, und CrossRefs `is-referenced-by-count` dient dann als Zitationszahl-Ersatz. Citation-Mining (S2-spezifisch) ggf. später nachholen, wenn der Pool wieder frei ist.
- **Keys optional.** Alles läuft ohne Key. Für höheren Durchsatz lassen sich optional hinterlegen: `S2_API_KEY` (Semantic Scholar), `NCBI_API_KEY` (PubMed). Wenn gesetzt, im Header mitschicken (siehe Cookbook); wenn nicht, einfach ohne weitermachen.

## Schnellreferenz — Endpoints

```
Semantic Scholar  https://api.semanticscholar.org/graph/v1/paper/search?query=...&fields=...
                  .../paper/DOI:<doi>?fields=...        .../paper/<id>/citations?fields=...
CrossRef          https://api.crossref.org/works?query=...&filter=from-pub-date:...,type:journal-article
                  https://api.crossref.org/works/<doi>
arXiv             http://export.arxiv.org/api/query?search_query=all:...&sortBy=submittedDate&max_results=...
PubMed            https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=...&retmode=json
                  .../esummary.fcgi?db=pubmed&id=...&retmode=json
```

Details, Felderlisten und fertige Python-Funktionen: **`references/api-cookbook.md`**.
