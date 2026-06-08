# MARP Syntax Guide für THWS (Prof. Kraus)

Dies ist die verbindliche Syntax-Referenz.

## 1. Global Header
Jede Datei muss mit diesem Block beginnen:

---
marp: true
theme: thws-pr
paginate: true
header: '**Modul Name** <br> Prof. Dr. Christian Kraus'
math: mathjax
---

## 2. Slide Classes (Design)
Nutze diese Klassen, indem du `` unter den Trenner `---` schreibst.

| Klasse | Syntax | Beschreibung |
| :--- | :--- | :--- |
| **Titlepage** | `<!-- _class: titlepage -->` | Nur für die allererste Folie. Petrol Hintergrund. |
| **Structural** | `<!-- _class: structural -->` | Für Agenda, Lernziele, Kapitel-Trenner & Interaktionen. Petrol Hintergrund. |
| **Fullscreen** | `<!-- _class: fullscreen -->` | Vollbild-Foto mit Caption. |
| **Center** | `<!-- _class: center -->` | Zentrierter Text (für Zitate/Thesen). |
| **End** | `<!-- _class: end -->` | Inhalt am unteren Rand. |
| **Tiny Text** | `<!-- _class: tiny-text -->` | Kleinere Schrift — immer bei Tabellen verwenden. |

**Nicht mehr verwenden:** `img-right`, `img-right small-text`, `small-text` — stattdessen `bg`-Direktive für Bilder und `tiny-text` für Tabellen.

## 3. Umgang mit Bildern

Bilder werden über die MARP `bg`-Direktive platziert — **nicht** über `img-right`-Klassen.

```markdown
# Folientitel

- Bullet A
- Bullet B

![bg right 80%](../diagrams/kapitel-03/diagram-erp-crm-scm-dw.svg)
```

- `![bg right 80%](path)` — Bild rechts, Text links (kein extra class nötig)
- Prozentwert anpassen: `60%`, `70%`, `80%` je nach Bildgröße
- Vollbild: `<!-- _class: fullscreen -->` + `![bg](path)`
- Unsplash: `https://source.unsplash.com/featured/?begriff`

## 4. Typografie
- Nutze `# Headline` damit Überschriften automatisch skalieren.
- Zitate: `> Zitattext`
- Formeln: `$$a = b + c$$`