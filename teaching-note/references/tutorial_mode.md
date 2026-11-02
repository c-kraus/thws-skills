# Tutorium-Modus (Präsenz-Tutorium ohne Foliensatz)

Verwenden, wenn die Sitzung ein **Präsenz-Tutorium** ist (z. B. 2 SWS Tutorium neben dem Selbststudium mit dem Lehrbuch, 90 Minuten) und es **keinen Foliensatz** gibt. Grundlage ist das Übungsblatt `tutorials/tut_NN_slug.qmd` mit Lösungsteil (tutorial-builder, Format `tutorial-typst`). Ergebnis: `_teaching_notes/NN_slug_teaching_note.qmd`, YAML wie im Hauptskill, Untertitel z. B. `"<Kurs> -- Vorbereitung für das Präsenz-Tutorium (90 min), deutsch mit englischen Fachbegriffen"`, `outline-depth: 1`.

**Umfang: 3--5 gedruckte Seiten** (ca. 800--1.400 Wörter). Die Musterlösung steht im Lösungsblatt; die Note rechnet sie nicht noch einmal vor. Was über 5 Seiten hinausgeht, gehört ins Lösungsblatt oder fällt weg.

## Eingaben

1. `_running_case.md` (falls vorhanden) zuerst: Zahlen, Personen, Begriffe, Zeitachse, Fall-Sitzungen.
2. `_curriculum.md`: Lernziele des Kapitels mit **kursweiter Nummer**, Lehrformat (Dauer, Woche der Sitzung).
3. Übungsblatt mit Lösungen (rendern mit `quarto render tutorials/tut_NN_slug.qmd -M show_solutions:true`, PDF nicht committen). Unter jeder Aufgabe steht die Tag-Zeile `*Lernziele: 7, 8 · ca. 15 Minuten*` (EN `*Learning objectives: 7, 8 · about 15 minutes*`).
4. Kapitel-`.qmd` (Verweise `**Üben:** Tutorium N, Aufgabe M`), Nachbarkapitel, Widgets.

## Merksatz-Box am Anfang

Zweck (20--30 Minuten vor dem Tutorium lesen), Quelle (Übungsblatt und Kapitel, **kein Foliensatz**), Hinweis "Alle Zahlen mit Python nachgerechnet, identisch mit dem Lösungsblatt", "Vertraulich: nicht an Studierende weitergeben".

## Pflichtabschnitte (in dieser Reihenfolge)

1. **Auf einen Blick**: Tabelle mit Leitfrage, Lernziele (Nummer + Kurztext aus `_curriculum.md`), Vorwissen, Material (Übungsblatt; Lösungsblatt für die Lehrperson; Widget falls eingesetzt), Fallbezug (welche Szene der Zeitachse; welcher Fall in dieser Sitzung laut Fall-Sitzungen), Vorbereitung mit Zeitangabe (z. B. "Lösungsblatt rendern, Aufgabe 2 nachrechnen, 10 min").
2. **Zeitplan (Minuten)**: Tabelle Min. | Aufgabe | Lernziele | Format (Einzel/Paare/Gruppen/Plenum). Die Aufgabenzeiten kommen **aus den Tag-Zeilen** und summieren sich auf **ca. 75 Minuten**; der Rest (ca. 15 min) ist Einstieg, Besprechung und Abschluss. Nie exakt 90 Minuten Aufgaben planen. Weichen die Tag-Zeilen deutlich von ca. 75 Minuten ab, nicht still umplanen, sondern unter Offene Punkte melden. Darunter **Wenn die Zeit knapp wird**: welche Teilaufgabe zuerst entfällt oder als Hausaufgabe bleibt, in Reihenfolge, mit dem Hinweis, welches Lernziel dann trotzdem abgedeckt ist.
3. **Ablauf je Aufgabe**: pro Aufgabe 2--4 Stichpunkte: Ziel und Pointe, wie anleiten (was zurückhalten, wann auflösen), Impuls, wenn die Gruppe hängt.
4. **Ergebnisse auf einen Blick**: **kompakte Tabelle** Aufgabe/Teilaufgabe | Ergebnis (Zahl, Buchungssatz, Entscheidung in einer Zeile) | Kontrollgröße, darunter der Satz "Vollständige Lösungen: Lösungsblatt, Aufgabe N". Keine Herleitung, keine Rechenwege. Jede Zahl mit Python geprüft und identisch mit dem Lösungsblatt; Rundung wie im Lösungsblatt.
5. **Typische Fehler**: Tabelle Fehler | woran erkennbar | Gegenmittel (5--8 Zeilen, aus den Stolpersteinen in Kapitel und Lösungsblatt abgeleitet, nicht erfunden). Dazu 3--5 **wahrscheinliche Rückfragen** mit Antwort in 1--2 Sätzen.
6. **Kurzfall: Diskussionsführung** (falls das Blatt einen Kurzfall enthält; ca. 30 Minuten, max. 400 Wörter Fallnarrativ, eine Entscheidung, endet vor der Entscheidung): Ablauf in Minuten (Lesen, Gruppenarbeit, Plenum), Einstiegsfrage, Tafelbild-Struktur, Tabelle Task | erwarteter Kern der Antwort | typischer Fehler, Abstimmung über die Entscheidung des Protagonisten und die Schlussfrage. Kein vollständiger Case-Teaching-Note-Aufbau.
7. **Querverweise**: eine Zeile zurück (was aus früheren Kapiteln/Tutorien vorausgesetzt wird), eine Zeile voraus; Kapitelabschnitt je Aufgabe.
8. **Offene Punkte**: nur Offenes (Widersprüche zwischen Kapitel und Lösungsblatt, ungeprüfte Normstellen, Zeitplan passt nicht). Keine Änderungshistorie.
9. **Begriffe auf einen Blick**: Deutsch/Englisch, höchstens 10 Zeilen.

Nicht in diesem Modus: eigene Abschnitte "Zahlen zum Nachschlagen" (steckt in Abschnitt 4), "Was Sie sich vorab ansehen sollten" (eine Zeile in Abschnitt 1) und "Vertiefung" (Normen und Quellen stehen im Lösungsblatt und im Kapitel).

## Regeln

- Reihenfolge der Fälle und Szenen aus `_running_case.md` (Zeitachse, Fall-Sitzungen) übernehmen, nie aus den Kapitelnummern ableiten; nur dort verankerte Zahlen, Daten und Personen verwenden. Neue Werte im Bericht unter `FACT SHEET ADDITIONS`.
- Lernziele nur mit der kursweiten Nummer aus `_curriculum.md` nennen.
- Nach dem Rendern die Seitenzahl prüfen; bei mehr als 5 Seiten kürzen (Ablauf je Aufgabe straffen, Rückfragen reduzieren), nicht die Schrift verkleinern.
