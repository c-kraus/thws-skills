# API-Cookbook — Literatursuche

Lauffähige Bausteine für die vier APIs. Alle ohne Key nutzbar; optionale Keys (`S2_API_KEY`, `NCBI_API_KEY`) werden, falls in der Umgebung gesetzt, automatisch mitgeschickt. Immer den höflichen User-Agent verwenden.

Inhalt:
1. Gemeinsame Helfer (HTTP, User-Agent, Keys)
2. Semantic Scholar — Suche, Paper per DOI, Citation-Mining
3. CrossRef — Suche (mit Datums-/Typfilter), DOI-Lookup
4. arXiv — Suche
5. PubMed — esearch + esummary
6. Merge, Dedupe, Ranking-Helfer
7. Beispiel-Pipeline (Standard-Workflow in ~20 Zeilen)
8. OA-Volltext finden (Unpaywall) & automatisch an Zotero anhängen

---

## 1. Gemeinsame Helfer

```python
import urllib.request, urllib.parse, json, os, time

UA = "thws-literatursuche/1.0 (mailto:flaneure.com@gmail.com)"

def _fetch(url, headers=None, timeout=20, retries=2):
    h = {"User-Agent": UA}
    if headers: h.update(headers)
    for attempt in range(retries + 1):
        try:
            req = urllib.request.Request(url, headers=h)
            with urllib.request.urlopen(req, timeout=timeout) as r:
                return r.read().decode("utf-8", "replace")
        except urllib.error.HTTPError as e:
            if e.code == 429 and attempt < retries:   # Rate-Limit → kurz drosseln
                time.sleep(2 * (attempt + 1)); continue
            raise
        except Exception:
            if attempt < retries: time.sleep(1); continue
            raise

def _get(url, headers=None, **kw):       # JSON-APIs (Semantic Scholar, CrossRef, PubMed)
    return json.loads(_fetch(url, headers, **kw))

def _get_text(url, headers=None, **kw):  # XML/Atom (arXiv)
    return _fetch(url, headers, **kw)
```

---

## 2. Semantic Scholar — Hauptsuchmaschine

Felder, die fast immer gebraucht werden: `title,year,authors,venue,citationCount,influentialCitationCount,externalIds,publicationTypes,openAccessPdf,abstract,tldr`.

```python
S2 = "https://api.semanticscholar.org/graph/v1"
def _s2_headers():
    k = os.environ.get("S2_API_KEY")
    return {"x-api-key": k} if k else None

def s2_search(query, limit=20, year_from=None, fields=None, min_citations=None):
    """Relevanz-Suche. year_from z.B. 2024 → nur ab dem Jahr. Gibt Liste von Paper-Dicts."""
    fields = fields or "title,year,authors,venue,citationCount,influentialCitationCount,externalIds,publicationTypes,openAccessPdf,tldr"
    params = {"query": query, "limit": limit, "fields": fields}
    if year_from: params["year"] = f"{year_from}-"
    if min_citations: params["minCitationCount"] = min_citations
    url = f"{S2}/paper/search?" + urllib.parse.urlencode(params)
    return _get(url, headers=_s2_headers()).get("data", []) or []

def s2_by_doi(doi, fields="title,year,authors,venue,citationCount,externalIds,openAccessPdf,abstract,tldr"):
    url = f"{S2}/paper/DOI:{urllib.parse.quote(doi)}?fields={fields}"
    return _get(url, headers=_s2_headers())

def s2_citations(paper_id, limit=30, fields="title,year,authors,venue,citationCount,influentialCitationCount,externalIds"):
    """Citation-Mining: wer zitiert dieses Werk. paper_id = 'DOI:..', 'ARXIV:..' oder S2-paperId.
    Nach influentialCitationCount sortieren, um die einflussreichsten Folgearbeiten zu finden."""
    url = f"{S2}/paper/{urllib.parse.quote(paper_id)}/citations?fields={fields}&limit={limit}"
    rows = _get(url, headers=_s2_headers()).get("data", []) or []
    papers = [r["citingPaper"] for r in rows if r.get("citingPaper")]
    return sorted(papers, key=lambda p: p.get("influentialCitationCount") or 0, reverse=True)
```

Hinweis Autorenformat: `p["authors"]` ist eine Liste `[{"name": "..."}]`. Kurzform: `", ".join(a["name"] for a in p.get("authors", [])[:3])`.

---

## 3. CrossRef — etablierte Werke, Bücher, Verifikation

```python
CR = "https://api.crossref.org/works"

def crossref_search(query, rows=20, year_from=None, type_filter=None):
    """type_filter z.B. 'journal-article' oder 'book'. Gibt CrossRef-Items."""
    params = {"query": query, "rows": rows,
              "select": "DOI,title,author,issued,container-title,type,is-referenced-by-count,publisher",
              "mailto": "flaneure.com@gmail.com"}
    filters = []
    if year_from: filters.append(f"from-pub-date:{year_from}-01-01")
    if type_filter: filters.append(f"type:{type_filter}")
    if filters: params["filter"] = ",".join(filters)
    url = f"{CR}?" + urllib.parse.urlencode(params)
    return _get(url).get("message", {}).get("items", []) or []

def crossref_by_doi(doi):
    """DOI-Verifikation / vollständige Metadaten."""
    return _get(f"{CR}/{urllib.parse.quote(doi)}?mailto=flaneure.com@gmail.com").get("message", {})
```

CrossRef-Felder: Titel = `item["title"][0]`; Jahr = `item["issued"]["date-parts"][0][0]`; Zitationen = `item.get("is-referenced-by-count")`; Autoren = `item.get("author", [])` mit `family`/`given`; Venue = `item.get("container-title", [""])[0]`.

---

## 4. arXiv — Preprints (CS/KI/Stats/q-fin)

arXiv liefert Atom-XML, kein JSON.

```python
import xml.etree.ElementTree as ET

def arxiv_search(query, max_results=15, recent_first=True):
    ns = {"a": "http://www.w3.org/2005/Atom"}
    params = {"search_query": f"all:{query}", "max_results": max_results,
              "sortBy": "submittedDate" if recent_first else "relevance", "sortOrder": "descending"}
    url = "http://export.arxiv.org/api/query?" + urllib.parse.urlencode(params)
    xml = _get_text(url)                   # Atom-XML
    root = ET.fromstring(xml)
    out = []
    for e in root.findall("a:entry", ns):
        arxiv_id = e.find("a:id", ns).text.rsplit("/", 1)[-1]
        doi_el = e.find("a:doi", ns)      # gesetzt, wenn das Preprint publiziert wurde
        out.append({
            "title": " ".join(e.find("a:title", ns).text.split()),
            "year": (e.find("a:published", ns).text or "")[:4],
            "authors": [{"name": a.find("a:name", ns).text} for a in e.findall("a:author", ns)],
            "venue": "arXiv (Preprint)",
            "externalIds": {"ArXiv": arxiv_id, **({"DOI": doi_el.text} if doi_el is not None else {})},
            "openAccessPdf": {"url": f"https://arxiv.org/pdf/{arxiv_id}"},
            "is_preprint": True,
        })
    return out
```

Themen-Filter über arXiv-Kategorien direkt in der Query: `cat:cs.LG`, `cat:cs.DB`, `cat:cs.AI`, `cat:q-fin.*` mit `AND` kombinieren, z. B. `search_query=all:explainability AND cat:cs.LG`.

---

## 5. PubMed — nur biomed./bioethisch

```python
EU = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils"
def _ncbi_key(): 
    k = os.environ.get("NCBI_API_KEY"); return f"&api_key={k}" if k else ""

def pubmed_search(query, retmax=15, year_from=None):
    term = query + (f" AND {year_from}:3000[dp]" if year_from else "")
    url = f"{EU}/esearch.fcgi?db=pubmed&term={urllib.parse.quote(term)}&retmax={retmax}&retmode=json&sort=relevance" + _ncbi_key()
    ids = _get(url)["esearchresult"]["idlist"]
    if not ids: return []
    s = _get(f"{EU}/esummary.fcgi?db=pubmed&id={','.join(ids)}&retmode=json" + _ncbi_key())["result"]
    out = []
    for i in s.get("uids", []):
        d = s[i]
        doi = next((x["value"] for x in d.get("articleids", []) if x["idtype"] == "doi"), None)
        out.append({"title": d.get("title"), "year": (d.get("pubdate") or "")[:4],
                    "authors": [{"name": a["name"]} for a in d.get("authors", [])[:3]],
                    "venue": d.get("fulljournalname") or d.get("source"),
                    "externalIds": {"PMID": i, **({"DOI": doi} if doi else {})}})
    return out
```

---

## 6. Merge, Dedupe, Ranking

```python
def _key(p):
    ext = p.get("externalIds") or {}
    if ext.get("DOI"): return "doi:" + ext["DOI"].lower()
    if ext.get("ArXiv"): return "arxiv:" + ext["ArXiv"].lower()
    return "title:" + "".join(c for c in (p.get("title") or "").lower() if c.isalnum())[:60]

def merge_dedupe(*lists):
    """Mehrere API-Trefferlisten zusammenführen; reichste Variante je Schlüssel behalten."""
    best = {}
    for lst in lists:
        for p in lst or []:
            k = _key(p)
            if k not in best or (p.get("citationCount") or 0) > (best[k].get("citationCount") or 0):
                best[k] = {**best.get(k, {}), **{kk: vv for kk, vv in p.items() if vv}}
    return list(best.values())

def rank_for_teaching(papers, current_year=2026):
    """Mix-Score: belohnt sowohl hohe Zitationszahl (Grundlagen) als auch Aktualität (letzte 2 Jahre)."""
    import math
    def score(p):
        cites = p.get("citationCount") or 0
        try: yr = int(str(p.get("year"))[:4])
        except: yr = 0
        recency = 2.0 if yr >= current_year - 2 else (1.0 if yr >= current_year - 5 else 0.0)
        return math.log1p(cites) + 2.5 * recency
    return sorted(papers, key=score, reverse=True)
```

Das Ranking ist ein **Vorschlag**, keine Maschine: Die Funktion bringt Grundlagen und Aktuelles nach oben, aber die finale Shortlist (5–8) wird redaktionell zusammengestellt — bewusst je etwas von Grundlage / aktuell / Standardwerk, nicht stur die Top-Scores.

---

## 7. Beispiel-Pipeline (Standard-Workflow)

```python
topic = "Explainable AI"
grundlagen = s2_search(topic, limit=20, min_citations=100)          # meistzitiert
aktuell    = s2_search(topic, limit=20, year_from=2024)             # frontier
buecher    = crossref_search(topic, rows=10, type_filter="book")    # Standardwerke
# arXiv nur bei CS/KI-Themen:
preprints  = arxiv_search(f"{topic} AND cat:cs.LG", max_results=10)

pool = merge_dedupe(grundlagen, aktuell, preprints,
                    [{"title": b["title"][0], "year": b.get("issued",{}).get("date-parts",[[0]])[0][0],
                      "authors": [{"name": f"{a.get('family','')}"} for a in b.get("author",[])],
                      "venue": (b.get("container-title") or [b.get("publisher","")])[0],
                      "citationCount": b.get("is-referenced-by-count"),
                      "externalIds": {"DOI": b.get("DOI")}} for b in buecher])
ranked = rank_for_teaching(pool)
# → daraus redaktionell 5–8 für die Shortlist wählen (Mix der Typen), DOIs bei Bedarf via crossref_by_doi prüfen.
```

---

## 8. OA-Volltext finden & automatisch an Zotero anhängen

**Prinzip:** Beim Übernahme-Befehl gehört der frei verfügbare Volltext dazu. Für jedes Werk mit DOI per **Unpaywall** den offenen PDF-Link suchen; ist einer da, das PDF herunterladen und als gespeichertes Attachment ans Zotero-Item hängen — genau wie Zoteros „Add Available PDF". Paywalled? Dann nur Metadaten, ohne Drama.

```python
def unpaywall_pdf(doi, email="flaneure.com@gmail.com"):
    """Gibt die beste OA-PDF-URL zurück oder None."""
    try:
        d = _get(f"https://api.unpaywall.org/v2/{urllib.parse.quote(doi)}?email={email}")
    except Exception:
        return None
    loc = d.get("best_oa_location") or {}
    return loc.get("url_for_pdf") if d.get("is_oa") else None
```

Anhängen via Zotero Web API (vierstufiger Upload-Flow; braucht `ZOTERO_API_KEY`/`ZOTERO_USER_ID`):

```python
import hashlib

def zotero_attach_pdf(parent_key, pdf_bytes, filename, key=None, uid=None):
    """Hängt pdf_bytes als gespeichertes 'Full Text PDF' an parent_key. Idempotent:
    Zotero dedupliziert per MD5 → existiert die Datei schon, wird sie nur verknüpft."""
    key = key or os.environ["ZOTERO_API_KEY"]; uid = uid or os.environ["ZOTERO_USER_ID"]
    H = {"Zotero-API-Key": key, "Zotero-API-Version": "3"}
    def _api(method, path, data=None, extra=None):
        h = dict(H); h.update(extra or {})
        req = urllib.request.Request(f"https://api.zotero.org{path}", data=data, headers=h, method=method)
        with urllib.request.urlopen(req, timeout=120) as r:
            b = r.read(); return r.status, (json.loads(b) if b else {})
    md5 = hashlib.md5(pdf_bytes).hexdigest(); size = len(pdf_bytes); mtime = 0
    # 1) Attachment-Item anlegen
    att = [{"itemType": "attachment", "parentItem": parent_key, "linkMode": "imported_file",
            "title": "Full Text PDF", "filename": filename, "contentType": "application/pdf",
            "charset": "", "note": "", "tags": [], "relations": {}}]
    _, res = _api("POST", f"/users/{uid}/items", json.dumps(att).encode(), {"Content-Type": "application/json"})
    attkey = res["success"]["0"]
    # 2) Upload-Autorisierung
    form = urllib.parse.urlencode({"md5": md5, "filename": filename, "filesize": size,
                                   "mtime": mtime, "params": 1}).encode()
    _, auth = _api("POST", f"/users/{uid}/items/{attkey}/file", form,
                   {"Content-Type": "application/x-www-form-urlencoded", "If-None-Match": "*"})
    if auth.get("exists"):
        return attkey  # Datei schon im Storage → bereits verknüpft, fertig
    # 3) zum Storage hochladen (prefix + Datei + suffix)
    body = auth["prefix"].encode() + pdf_bytes + auth["suffix"].encode()
    req = urllib.request.Request(auth["url"], data=body, headers={"Content-Type": auth["contentType"]}, method="POST")
    urllib.request.urlopen(req, timeout=180)
    # 4) Upload registrieren
    reg = urllib.parse.urlencode({"upload": auth["uploadKey"]}).encode()
    _api("POST", f"/users/{uid}/items/{attkey}/file", reg,
         {"Content-Type": "application/x-www-form-urlencoded", "If-None-Match": "*"})
    return attkey

def attach_oa_fulltext(parent_key, doi, filename):
    """Komfort: OA suchen → laden → anhängen. Gibt 'attached' | 'no-oa' | 'error:..'."""
    url = unpaywall_pdf(doi)
    if not url: return "no-oa"
    try:
        data = urllib.request.urlopen(urllib.request.Request(url, headers={"User-Agent": UA}), timeout=60).read()
        if data[:5] != b"%PDF-": return "no-oa"      # HTML-Landingpage statt PDF
        zotero_attach_pdf(parent_key, data, filename)
        return "attached"
    except Exception as e:
        return f"error:{type(e).__name__}"
```

**Dateiname** sprechend wählen, z. B. `f"{erstautor} {jahr} - {kurztitel}.pdf"` (Sonderzeichen entfernen), statt einer kryptischen ID — das erleichtert die spätere Nutzung in Zotero.

**Reihenfolge im Handoff:** Item via `crossref_by_doi` + Zotero-`POST /items` anlegen → Item-Key merken → `attach_oa_fulltext(item_key, doi, filename)`. Ist kein OA da, bleibt es bei den Metadaten (kein Fehler). So kommt der Volltext beim Übernehmen automatisch mit.
