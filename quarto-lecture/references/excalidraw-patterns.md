# Excalidraw-Diagramme — Erkennungsmuster & Dispatch

Statische, konzeptuelle Diagramme (Strukturen, Kausalbeziehungen, Vergleiche, Abläufe ohne Interaktivität). PNG-Ablage: `diagrams/kapitel-{nn}/` relativ zur .qmd-Datei.

## Wann Excalidraw, wann Widget?

| Situation | Tool |
|---|---|
| Statische Struktur, einmaliger Aha-Moment | Excalidraw |
| Interaktive Exploration, Parametervariationen | Widget (html-builder) |
| Schrittweiser Prozess ohne Berechnungen | Excalidraw (Template A/B) |
| Schrittweiser Prozess mit Live-Berechnung | Widget |
| Vergleich zweier Konzepte | Excalidraw (Template D) |
| Bilanzen / Soll-Haben-Gegenüberstellung | Excalidraw (Template C) |

Alles mit Slider, Live-Berechnung oder Nutzerinteraktion → Widget, nie Excalidraw.

## Erkennungsmuster (während des Drafts)

Beim Schreiben jedes Abschnitts auf diese Textmuster scannen:

| Textmuster | Diagramm-Typ | Template |
|---|---|---|
| „X besteht aus A, B und C" | Hub-and-Spoke / Komposition | F |
| „X führt zu Y, was wiederum zu Z führt" | Kausalkette | A oder B (Flow) |
| „Im Gegensatz zu X ist Y…" / Vergleichstabelle | Gegenüberstellung | D (2-column) |
| „Aktiva / Passiva", „Soll / Haben", zwei Seiten | Bilanztrennung | C (Split zone) |
| „Der übergeordnete Begriff umfasst…" | Hierarchie / Taxonomie | Baumstruktur |
| Chronologische Abfolge ohne Interaktivität | Zeitstrahl | E (Vertical timeline) |

## Placeholder-Format

Bei erkannter Opportunity Placeholder einfügen und weiterschreiben:

```markdown
<!-- Excalidraw: [Konzeptbeschreibung] | Typ: [Template A-F / Custom] | Ziel: [Was soll der Studierende sehen?] -->
```

Beispiel:
```markdown
<!-- Excalidraw: Zusammenhang Aktiva/Passiva in der Bilanz | Typ: C (Split zone) | Ziel: Studierende sollen die Gleichgewichtsbedingung visuell erfassen -->
```

## Einbindungssyntax

```markdown
![Bilanzstruktur: Aktiva und Passiva](diagrams/kapitel-{nn}/diagram-name.png){fig-alt="Beschreibung für Barrierefreiheit" width="80%"}
```

## Dispatch-Prompt (ein Subagent pro Placeholder, alle parallel)

```
Erstelle ein Excalidraw-Diagramm für ein Hochschullehrkapitel und binde es ein.

Konzept: [aus Placeholder]
Visueller Typ: [aus Placeholder]
Didaktisches Ziel: [aus Placeholder]
Einfügestelle: Ersetze den Kommentar <!-- Excalidraw: ... --> an seiner Position im QMD.
QMD-Pfad: [vollständiger Dateipfad]
Ausgabe-Verzeichnis: [qmd-verzeichnis]/diagrams/kapitel-{nn}/
Dateiname: diagram-[slug].excalidraw

Vorgehensweise:
1. Lies den excalidraw-diagram Skill (SKILL.md).
2. Erstelle die .excalidraw-Datei im Ausgabe-Verzeichnis.
3. Prüfe ob der Canvas-Server läuft: curl -s http://localhost:3000/health
   - Wenn ja: rendere zu PNG via render_excalidraw.py, speichere PNG.
   - Wenn nein: speichere nur .excalidraw, füge Placeholder-PNG-Pfad ins QMD ein.
4. Ersetze den <!-- Excalidraw: ... -->-Kommentar im QMD mit:
   ![Kurzbeschreibung](diagrams/kapitel-{nn}/diagram-[slug].png){fig-alt="[Barrierefreie Beschreibung]" width="80%"}
5. Melde: Dateiname, PNG-Status (gerendert/ausstehend), Einfügestelle.
```

Nach Rückkehr aller Subagents: prüfen, ob alle Placeholders ersetzt wurden. Lieferte ein Subagent nur .excalidraw ohne PNG, im Abschlussbericht vermerken.
