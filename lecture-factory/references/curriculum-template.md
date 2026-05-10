# Curriculum-Vorlage

Speichere diese Datei als `_curriculum.md` im Projektverzeichnis (neben deinen .qmd-Dateien).
Die lecture-factory liest sie automatisch beim Start und nutzt sie für konsistente Vor-/Rückverweise.

---

# Lehrveranstaltung: [Name der Lehrveranstaltung]

**Studiengang:** [z. B. Wirtschaftsingenieurwesen B.Sc.]
**Semester:** [z. B. 3. Semester]
**Sprache:** [de / en]

## Kapitelübersicht

| Nr | Titel | Datei | Status | Kernthemen |
|---|---|---|---|---|
| 01 | [Kapitelname] | kap-01-[slug].qmd | ✅ fertig | [Schlagwort1, Schlagwort2] |
| 02 | [Kapitelname] | kap-02-[slug].qmd | ✅ fertig | [Schlagwort1, Schlagwort2] |
| 03 | [Kapitelname] | kap-03-[slug].qmd | 🔄 aktiv | [Schlagwort1, Schlagwort2] |
| 04 | [Kapitelname] | kap-04-[slug].qmd | 📋 geplant | [Schlagwort1, Schlagwort2] |
| 05 | [Kapitelname] | kap-05-[slug].qmd | 📋 geplant | [Schlagwort1, Schlagwort2] |

**Status-Legende:** ✅ fertig · 🔄 aktiv (wird gerade geschrieben) · 📋 geplant · ⏸ pausiert

## Kursweite Lernziele

[Optional: 3–5 übergeordnete Kompetenzen, die Studierende am Kursende haben sollen]

## Terminologie-Konventionen

[Optional: Begriffe und Abkürzungen, die im Kurs einheitlich verwendet werden — verhindert
Inkonsistenzen über Kapitel hinweg. Beispiel:]

- **JÜ** = Jahresüberschuss (nicht "Gewinn" oder "Reingewinn")
- **HGB** wird immer ausgeschrieben beim ersten Vorkommen im Kapitel
- Englische Fachtermini werden kursiviert: *Matching Principle*, *Prudence Principle*

## Kontext-Verzeichnis

[Optional: Pfad zum context/-Ordner, falls er nicht im selben Verzeichnis liegt]

```
[Projektverzeichnis]/
├── _curriculum.md          ← diese Datei
├── kap-01-[slug].qmd
├── kap-02-[slug].qmd
├── context/
│   ├── kapitel-01/         ← Rohmaterial für Kap. 01
│   │   ├── raw/            ← PDFs, Notizen, Artikel
│   │   └── wiki/           ← Optional: second-brain Output
│   ├── kapitel-02/
│   └── shared/             ← Kursweite Referenzen (Normen, Glossar)
│       ├── normen.md
│       └── glossar.md
└── widgets/
    └── kapitel-01/
```
