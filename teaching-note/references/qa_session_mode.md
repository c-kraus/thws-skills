# Q&A-Session-Modus (Fragentermin im Online-Studiengang)

Verwenden, wenn die Sitzung **kein Vortrag** ist, sondern ein wöchentlicher Fragentermin zu einem Kapitel, das die Studierenden im Selbststudium bearbeitet haben (z. B. BUA1, Online-Track). Das Ergebnis heißt `NN_<topic>_qa_note.qmd` im Ordner `teaching_notes/` des Kurses. Gleiche Sprachregel wie im Hauptskill (Deutsch, englische Fachbegriffe kursiv in Klammern, Glossar).

## Eingaben

1. Kapitel-`.qmd` (vollständig lesen), `_curriculum.md` (Lernziele, Verbindungen zu Nachbarkapiteln), `Objectives/`, `Further_Learning/`.
2. Übungsmaterial: `tutorials/`, Moodle-Fragenbank (`moodlequestions/`), Widgets (`Widgets/`), Probeklausur/Klausurdateien (`assessment/`), Prüfungsauswertungen (z. B. `*MockExam_Results*`): daraus **echte Fehlerquoten** übernehmen.
3. Nachbarkapitel für Rückgriffe und Ausblick.

## Annahmen, die in der Note offen stehen (Callout am Anfang)

Dauer (Default 60 min), Plattform (Videokonferenz mit Chat), Vorlauf (Fragen vorab per Forum/Umfrage), Vorwissen der Teilnehmenden. Beim ersten Mal beim Nutzer bestätigen lassen und im Skill-Verzeichnis oder im Kursordner festhalten.

## Pflichtabschnitte (in dieser Reihenfolge)

1. **Auf einen Blick**: Kapitel, Wochenfokus, Lernziele (Nummern aus dem Curriculum), Material der Studierenden, typische Schwachstelle, Vorbereitungsaufwand.
2. **Ablaufvorschlag** mit Minuten: Ankommen/Umfrage, kurze Erklärung der häufigsten Missverständnisse (max. 10 min), Fragen der Studierenden (Kern, ca. 25 min), Live-Rechenbeispiel (10--12 min), Mini-Quiz (5--6 min), Ausblick. Dazu: *Wenn viele Fragen kommen* / *Wenn kaum Fragen kommen*, und ein Tipp zum Online-Format (Chat sortieren, Umfragen, Screen-Share).
3. **Erwartbare Fragen und Antworten**: 10--14 Fragen, die Studierende wirklich stellen, jede mit einer Antwort in 2--4 Sätzen, mit Zahlenbeispiel, wo möglich. Aus dem Kapiteltext, den Flip-Cards, den Tutorials und den Moodle-Fragen ableiten; Verständnisfragen und Rechenfragen mischen.
4. **Missverständnisse und Diagnosefragen**: Eingangsumfrage mit richtiger Antwort, Mini-Quiz (3--4 Fragen mit Lösung), Tabelle Fehlkonzept -> Gegenmittel.
5. **Live-Rechenbeispiel**: ein vollständig durchgerechnetes Beispiel (Tabelle), das die Studierenden im Chat mitentwickeln können; Endstand und Kontrollrechnung. **Alle Zahlen mit Python nachrechnen**; Musterlösungen des Kapitels nie ungeprüft übernehmen.
6. **Wenn kaum Fragen kommen**: 3--4 Aktivierungsfragen oder Aufgaben.
7. **Verweise im Material**: Tabelle Frage -> Kapitelabschnitt -> Tutorial-Aufgabe -> Widget/Moodle-Frage.
8. **Prüfungsbezug**: Fehlerquoten aus Probeklausur/Klausur zum Kapitel, Klausurfallen, Hinweis, welche Moodle-Fragen als Übung taugen. Keine Zahlen erfinden; wenn keine Daten vorliegen, schreiben.
9. **Quellenbefunde**: Fehler und Unschärfen im Kapitel, in den Lösungen und in den Tutorials (nicht korrigieren, außer der Nutzer bittet darum).
10. **Normen und Quellen** (vor Gebrauch prüfen): Standards mit Namen; Absatznummern nur, wenn verifiziert, sonst kennzeichnen.
11. **Begriffe auf einen Blick**: Deutsch/Englisch.

## Regeln

- Fragen, die Studierende stellen werden, aus dem Material ableiten (Stolpersteine, Widersprüche zwischen Kapitel und Tutorial, Auslassungen), nicht aus Allgemeinwissen erfinden.
- Antworten so formulieren, dass sie zum Kapitel passen (gleiche Beispiele, gleiche Begriffe); wo das Kapitel verkürzt, die genauere Antwort geben **und** kennzeichnen, was prüfungsrelevant ist.
- Normverweise (IFRS, HGB, Gesetze): nicht aus dem Gedächtnis zitieren, wenn Absatznummern gefordert wären; sonst Standard und Thema nennen und "vor Gebrauch prüfen" setzen. Bei Rechnungswesen optional den Skill `accounting-qa` nutzen.
- Reihenfolge der Kapitel einhalten; Rückgriffe und Ausblick (eine Zeile) einbauen.
- Länge: 3--5 gedruckte Seiten. Render-Check: Datei in ein Temp-Verzeichnis kopieren und `quarto render` ausführen (nicht im Buchprojekt, das erzeugt Build-Output).
