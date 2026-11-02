# AUDIT-Modus: bestehende Widgets gegen ihre Kapitel prüfen

Zweck: Fehler finden, die Design-Checks nie finden — falsche Rechenlogik, abweichende Konventionen, zu enge Slider, falsche Normzitate, verwaiste oder nach einer Umstrukturierung falsch eingebettete Widgets. Belegfälle: EPS-Monatsgewichte falsch, IAS-36.105-Untergrenze fehlte, Fixkostenanteil um Faktor 100 daneben, Neubewertung vom falschen Buchwert, fehlendes Minus in einer IFRS-16-Kennzahl, Binomial-Widget mit S₀ − X statt V₀ − X und stetiger statt diskreter Verzinsung, Zins-Slider in 0,5-%-Schritten (13,2 % nicht einstellbar), IFRS 18.B46(b) statt B47(c), ein EK/FK-Trainer, der nach dem Umzug des Themas nirgends mehr eingebunden war.

Der Audit **meldet**; Korrekturen erst nach Freigabe durch die Nutzerin/den Nutzer (oder wenn der Auftrag ausdrücklich „prüfen und korrigieren" lautet).

---

## Schritt A1: Inventar und Verwaiste

Im Projektwurzelverzeichnis ausführen:

```bash
python3 -I <skill-dir>/scripts/widget_inventory.py <projekt-root>
```

Das Skript sucht HTML-Dateien in `widgets/` bzw. `assets/` (beliebige Schreibweise) und alle `src=`/`href=`-Verweise in `.qmd` und `.md` (ohne `_site`, `archive`, `alt`). Ausgabe je Zeile:

| Tag | Bedeutung | Status |
|---|---|---|
| `OK` | in mindestens einem `.qmd` eingebettet | weiter mit A2 |
| `MOVED` | Ordnernummer ≠ Nummer des einbettenden Kapitels | ⚠️ prüfen: gewollte Wiederverwendung oder Rest einer Umstrukturierung |
| `ORPHAN` | in keinem `.qmd` und keinem `.md` verlinkt | ❌ |
| `ONLY-MD` | nur in Folien/Notizen (`.md`) verlinkt, nicht im Buch | ⚠️ |
| `CASE` | Pfad unterscheidet sich nur in Groß-/Kleinschreibung — läuft lokal auf macOS, bricht auf GitHub Pages | ❌ |
| `MISSING` | iframe/Link zeigt auf eine nicht existierende Datei | ❌ |
| `DUPLICATE` | gleicher Dateiname in mehreren Ordnern | ⚠️ welche Version ist aktuell, welche eingebettet? |
| `LANGCOPY` | Sprachkopie (`-en`, `/en/`) | ⚠️ zu einer Datei mit `?lang=` zusammenführen (html-builder, „Text Language") |

Für jedes `ORPHAN`: Thema des Widgets bestimmen (Titel, Labels) und per `grep` suchen, wo dieses Thema heute im Kurs steht. Vorschlag: dort einbetten (nach Funktionstest), oder löschen, wenn das Thema entfallen ist. Nie selbst löschen.

## Schritt A2: Jedes eingebettete Widget gegen sein Kapitel

Pro Kapitel (bei vielen Kapiteln parallel, ein Subagent je Kapitel) für jedes `OK`/`MOVED`-Widget:

1. **Kontext lesen:** den Abschnitt um das iframe (bis zur nächsten H2), den Einleitungssatz zum Widget, die zugehörigen Tutoriumsaufgaben (`tutorials/tut_NN_*.qmd`), `_running_case.md` falls vorhanden.
2. **Funktionstest** nach html-builder `references/functional-test.md`: Testtabelle aus dem Kapitel aufstellen, Rechenfunktion mit node testen (ohne `// CALC START`-Marker: im Browser Eingaben setzen und Ergebnis auslesen), Widget einmal im Browser öffnen.
3. **Prüfdimensionen** (je ✅/⚠️/❌):
   - **Zahlen:** Defaults reproduzieren das Rechenbeispiel exakt; Platzhalter = Defaults; der Einleitungstext im Kapitel nennt dieselben Werte, die das Widget zeigt.
   - **Konventionen:** diskret vs. stetig, Vorzeichen, Prozent vs. Dezimal, Einheiten, Zeitpunkte/Monate, verglichene Größe (z. B. V₀ − X), Symbole, Projekt-/Firmen-/Personennamen, Fachbegriffe (z. B. „variance" statt „risk").
   - **Slider/Presets:** min/max/step decken jeden Wert aus Text, Aufgaben und Folien ab; jeder Fallparameter ist einstellbar; Presets für die Fälle des Kapitels.
   - **Normen:** Zitate im Widget gegen den Originaltext (ifrs.org, gesetze-im-internet.de) vor dem Wiki; normative Grenzen (Untergrenzen, Obergrenzen, Wahlrechte) implementiert.
   - **Passung nach Umstrukturierung:** steht das Widget noch beim richtigen Thema, stimmen Kapitelnummer, Querverweise und Begriffe nach Umbenennungen?
4. **Wer hat recht?** Weichen Widget und Kapitel ab, unabhängig nachrechnen (Python). Das Kapitel kann falsch sein — dann als Kapitelfehler melden, nicht das Widget an einen Fehler anpassen.

## Schritt A3: Bericht

```markdown
# Widget-Audit: [Kurs]

## Inventar
- Widgets gesamt: N · eingebettet: N · verwaist: N · fehlende Ziele: N · Sprachkopien: N

## Ergebnis je Widget
| Widget | Kapitel/Abschnitt | Zahlen | Konventionen | Slider/Presets | Normen | Einbettung | Status | Fix |
|---|---|---|---|---|---|---|---|---|
| `assets/ch10/binomial-option-pricer.html` | 10 Real options, Binomialmodell | ❌ 9,77 statt 9,76 | ❌ stetig statt diskret; S₀ − X statt V₀ − X | ❌ kein Input Wartekosten | ✅ | ✅ | ❌ | diskret verzinsen, V₀ und Wartekosten als Inputs, Presets Project P / Kessler Plant 2 |
| `widgets/kapitel-09/widget-ek-fk-trainer.html` | — | ❌ Puttable-Logik | — | — | ⚠️ | ❌ verwaist (Thema jetzt in 08) | ❌ | korrigieren und in 08 einbetten, oder löschen |

Status: ✅ stimmt · ⚠️ prüfen/kleiner Fix · ❌ falsch oder nicht erreichbar

## Fixes (priorisiert)
1. [❌ zuerst: falsche Zahlen, fehlende Dateien, verwaiste Widgets mit aktuellem Thema]
2. [⚠️: Slider-Bereiche, Presets, Begriffe, Sprachkopien]

## Kapitelfehler (Kapitel falsch, Widget richtig)
- [...]

FACT SHEET ADDITIONS
- [neue Werte, die nicht in `_running_case.md` stehen, oder „keine"]
```

## Schritt A4: Korrigieren (nach Freigabe)

- Je Widget: Fix → Funktionstest erneut (node + Browser) → Testtabelle im Bericht aktualisieren.
- Ändert sich, was das Widget zeigt, auch den Einleitungstext im Kapitel, Folien-Notizen und Teaching Note anpassen (gleiche Zahlen überall).
- Sprachkopien zu einer Datei mit `I18N`-Wörterbuch zusammenführen; die EN-Einbettung zeigt auf `widget.html?lang=en`; Kopien erst nach Freigabe entfernen.
- Danach A1 erneut laufen lassen: keine neuen `ORPHAN`/`MISSING`.
