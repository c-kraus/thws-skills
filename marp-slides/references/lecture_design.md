# Lecture Design — Muster für gute Lehrfolien

Dieses Dokument beschreibt, **wie** eine Einheit aufgebaut wird. Es ist aus der Überarbeitung von 14 Kapiteln des Werteseminars (Deutsch und Englisch) entstanden. Das Beispiel-Deck `example_deck_de.md` / `example_deck_en.md` zeigt die Muster in der Praxis.

## 1. Grundhaltung

- **Lernerfahrung entwerfen, nicht Text umwandeln.** Fragen: Was sollen die Studierenden nach 90 Minuten anders tun oder sagen können? Was erleben sie in der ersten Minute?
- **Zielgruppe ernst nehmen.** Ingenieur:innen mögen konkrete Fälle, Zahlen, Entscheidungen. Abstrakte Theorie wird über einen Fall erschlossen, nicht umgekehrt.
- **Weniger ist mehr.** Was die Lehrperson sagen kann, steht nicht auf der Folie. Hintergrund gehört in den Anhang oder ins Skript.

## 2. Der Bogen einer Einheit

```
Titel
  Kalter Einstieg (1–3 Folien):  Provokation / Abstimmung / Fall / kleine Entscheidung
  Block A:  Erlebnis → Begriff → Anwendung (+ Übung)
  Block B:  Erlebnis → Begriff → Anwendung (+ Übung)
  Kritik / Grenzen
  Rückkehr zum Ausgangsfall
  Zusammenfassung + Ausblick (eine Folie)
  Zum Mitnehmen
  Anhang (Trenner, Vertiefung, Literatur)
```

Keine Agenda, keine Lernziele-Folie. Der Einstieg zeigt, worum es geht, durch das Tun. Ziele stehen in der ersten Sprecher-Notiz oder im Skript.

## 3. Einstiege (Hooks)

| Typ | Beispiel | Wann |
|---|---|---|
| **Provokation** (`center`, `fit`) | „Mathematik ist nicht rassistisch." | Ein klares Thema mit Widerspruch |
| **Abstimmung** | Drei Optionen, Handzeichen: *Sicher, günstig, schnell, zwei dürfen Sie behalten.* | Eine Wertung, die gleich sortiert wird |
| **Schätzfrage** | „Von 100 Kindern aus Akademikerfamilien studieren wie viele?" (anonym aufschreiben, dann auflösen) | Wenn eine überraschende Zahl existiert |
| **Fall mit Entscheidung** | „Freitagabend, Designfehler, Abgabe Montag: Was tun Sie?" | Die Einheit beantwortet, wie man so entscheidet |
| **Rollenspiel / Wahl** | Hinter dem Schleier eine Gesellschaft wählen, dann Rollen ziehen | Wenn der Begriff durch das Erlebnis klar wird |
| **Klassifizieren** | Drei Praktiken sortieren: erlaubt, Grauzone, Täuschung | Wenn die Grenze das Thema ist |

Regel: **Erst entscheiden, dann benennen.** Der Fachbegriff erscheint auf der Folie, nachdem die Studierenden das Problem erlebt haben („Das war der Schleier des Nichtwissens.").

## 4. Übungsvorlage

Eine Übungsfolie (`structural`) enthält:

```markdown
---

<!-- _class: structural -->

# Übung: <Handlungsbezogener Titel>

<Ausgangslage in 1–2 Sätzen, konkret>

**Gruppen (5 Minuten):**

1. <Frage, die ein Urteil verlangt>
2. <Zweite Frage>
3. <Dritte Frage>

*Pro Gruppe ein Satz Begründung.*

<!--
Erwartete Antworten: …
Auswertung: …
Fallback: …
-->
```

Formate: **Handzeichen** (1 Minute), **Zweiergruppen** (2–3 Minuten), **Gruppen** (5–8 Minuten), **Stille Folie** (2 Minuten Nachdenken). Eine Übung verlangt ein **Urteil** oder eine **Entscheidung**, nicht das Wiedergeben von Definitionen. Gute Übungen lassen verschiedene Gruppen zu verschiedenen Ergebnissen kommen, und die Auswertung zeigt, warum (z. B. subjektive Punktzahlen bei Nutzenrechnung).

## 5. Fälle wiederverwenden

Ein Fall, der mehrere Einheiten trägt, wird jedes Mal unter einer **neuen Frage** gestellt (z. B. Boeing: erst Haltung, dann Struktur). Kein Fall wird ein drittes Mal mit denselben Fakten ausgebreitet. Querbezüge in einem Satz herstellen („Kennen Sie aus Kapitel 4").

## 6. Zusammenfassung, Ausblick, Mitnehmen

- **Zusammenfassung:** ein Spiegelstrich pro Kernaussage, danach eine Zeile „Nächste Einheit: …" mit der Anschlussfrage.
- **Zum Mitnehmen** (`center`): eine schreibbare, persönliche Aufgabe. Beispiele: „Eine Gewohnheit ab morgen." „Wer wird in meiner Rechnung nicht mitgezählt?" „Mein Worst Case in drei Sätzen." Abgabe am Ausgang, anonym, wo es persönlich wird.
- **Letzte Folie vor dem Anhang** ist „Zum Mitnehmen", nicht die Literatur.

## 7. Anhang

Der Anhang beginnt mit einer `structural`-Folie „Anhang" (+ Untertitel) und enthält:
- Biografien, Herleitungen, Details, weitere Fälle, ausführliche Tabellen
- Hintergrund, der im Raum nicht gebraucht wird, aber nicht verloren gehen soll
- Zuletzt **Literatur** (`end tiny-text`)

Die Entscheidung „Hauptteil oder Anhang" trifft die Frage: *Brauchen die Studierenden das in diesem Moment, um die nächste Übung zu lösen?* Wenn nein, Anhang.

## 8. Dichte und Lesbarkeit

- 3–5 Aufzählungspunkte pro Folie, eine Tabelle pro Folie, höchstens eine Grafik.
- Tabellen > 5 Zeilen: `tiny-text` oder auf zwei Folien teilen.
- Bei Überlauf: erst `tiny-text`, dann Inhalt kürzen. Nie die Schriftgröße beliebig verkleinern.
- Fachbegriffe nur, wenn sie später gebraucht werden; sonst in den Anhang.

## 9. Typische Fehler (aus der Überarbeitung)

| Fehler | Besser |
|---|---|
| Agenda und Lernziele vor dem Einstieg | Kalter Einstieg |
| Definitionsketten (Begriff → Begriff → Begriff) | Fall → Begriff → Übung |
| Dasselbe Beispiel in drei Einheiten | Neue Frage, Querverweis |
| Gleiche Aussage auf Folie 7 und Folie 22 | Einmal sagen, im Anhang vertiefen |
| Rechenbeispiele ohne Nachrechnen (Summen, Gewichtungen) | Jede Tabelle neu rechnen |
| Zitate aus dem Gedächtnis in Anführungszeichen | Original prüfen oder „sinngemäß" |
| Biografien im Hauptteil | Eine Zeile Hauptteil, Rest im Anhang |
| Hotlink auf Stockfoto oder Presse | Lokales Diagramm oder weglassen |
| Tabelle mit 12 Zeilen auf einer Folie | Zwei Folien |
| Veraltete Rechtsstände ohne Datum | Stand nennen, Hinweis in Notiz |
| Kein Abschluss | „Zum Mitnehmen" |

## 10. Mehrere Einheiten desselben Kurses

- Gemeinsamer Header, gleiche Klassen, gleiche Kapitelnummerierung.
- Rote Fäden über die Einheiten: ein Motiv, das zurückkehrt (Freiheit, Schleier, Boeing, Worst Case).
- Beim Überarbeiten bestehender Kurse zuerst eine **Doppelungsübersicht** erstellen (welcher Fall, welche Folie, welches Rahmenwerk steht wo), dann umbauen. Wenn zwei Einheiten dieselbe Frage beantworten, zusammenlegen, wenn sie verschiedene Fragen beantworten, schärfer abgrenzen.

## 11. Rechenlastige Einheiten (Finance, Rechnungswesen, Statistik)

Muster aus dem Kapitel „Portfolio Theory" (`example_deck_calc_en.md`):

- **Schätzen, dann rechnen.** Der Einstieg ist eine Schätzfrage mit Handzeichen („Liegt das Portfoliorisiko darunter, gleich oder darüber?"). Die Rechnung kommt danach und bestätigt oder widerlegt die Schätzung.
- **Ergebnis und Formel auf die Folie, nicht jeden Zwischenschritt.** Eine Folie zeigt entweder die Formel mit Erklärung oder ein durchgerechnetes Beispiel in höchstens 2–3 Schritten.
- **Ein Rechenbeispiel trägt die ganze Einheit.** Gleiche Zahlen (A und B) kehren in Einstieg, Tabelle, Übung und „Zurück zum Ausgangsfall" wieder. Keine neuen Zahlen auf jeder Folie.
- **Studierende rechnen selbst.** Übungen geben die Formel oder die Gleichung vor und verlangen ein **Urteil** („Welche Korrelation brauchen Sie?"), nicht das Nachrechnen einer gezeigten Lösung. Erwartete Ergebnisse stehen in der Sprecher-Notiz mit Rechenweg.
- **Der Einfluss einer Größe als kleine Tabelle** (5 Zeilen, `tiny-text`), nicht als fünf Folien.
- **Erweiterte Beispiele in den Anhang:** n-Fälle, Matrixform, Schritt-für-Schritt-Beispiele mit Excel- oder Python-Hinweis.
- **Jede Zahl nachrechnen** (Summen, Gewichte, Quadratwurzeln, gewichtete Mittel). Fehler in Altdecks sind häufig (z. B. ungewichtete Summen).
- **Intuition vor Formel:** Ein Alltagsbild (Airline und Ölkonzern) erklärt, warum die Formel so aussieht.
- **Formeln** in MathJax (siehe `marp_instructions.md`), ein bis zwei Blockformeln pro Folie.

## 12. Live-Demos und Widgets

Marp kann keine interaktiven Seiten einbetten. Muster:

- Die Folie nennt die Demo in einer kursiven Zeile: *Live demo: open the widget "…" and move …*
- In der Sprecher-Notiz: **Parameter zum Ausprobieren** und **erwartete Beobachtung** (z. B. „ρ von +1 auf −1 stellen: Risiko fällt von 6,6 % auf 4,2 %").
- Ist die Demo selbst die Übung, bekommt sie eine `structural`-Folie mit Aufgabe und Zeit.
- Vor dem Schreiben prüfen, ob die Widget-Datei existiert und was sie kann.

## 13. Altdecks migrieren

Vorgehen, wenn bereits Folien existieren:

1. **Altdeck als Vorlage lassen.** Neue Folien in einen neuen Ordner (z. B. `marp/`), nichts überschreiben oder löschen.
2. **Befund auflisten** (Folientitel, Zahlen): Länge, Rechenfehler, doppelte Beispiele, Agenda und „Questions?", Hotlinks.
3. **Konventionen angleichen:**

| Altdeck | Neu |
|---|---|
| `img-right`, `img-right small-text` | `![bg right 80%](pfad)` oder weglassen |
| Emojis in Titeln | weglassen (konsistent mit den anderen Decks) |
| Header ohne Kursnamen oder „Modul Name" | `'**Kursname** <br> Prof. Dr. Christian Kraus'` |
| Bildpfad `../Assets/…` | lokale Datei im Repo, Pfad prüfen |
| „Recap", „Excel Tip", „Step 1/2a/2b/3" als einzelne Folien | ein durchgerechnetes Beispiel, Rest in Anhang oder Übung |
| „Questions?" als Schlussfolie | „Zum Mitnehmen" |

4. **Inhalte neu ordnen, nicht abschreiben.** Zuerst der Haken, dann Begriff, dann Übung. Vom Altdeck bleibt, was didaktisch trägt (z. B. ein gutes Rechenbeispiel).
5. **Quelltext (.qmd, Skript) mitlesen.** Dort stehen oft Fälle, Lösungen und Widgets. Fehlen Lösungen („TODO"), selbst ableiten und in den Notizen belegen.

