---
name: moodle-questions
description: "Generiert valides Moodle-XML aus Lehrinhalt, Fallstudien oder Konzepten — direkt importierbar in Moodle 4.x/5.x. Unterstützt alle Fragetypen: Multiple Choice, Zuordnung (match), Numerisch, Lückentext (cloze), Freitext (essay), Wahr/Falsch. Immer verwenden wenn: Moodle-Fragen oder Prüfungsfragen benötigt werden, Lehrinhalt in ein Quiz umgewandelt werden soll, Moodle-XML exportiert werden soll, oder Klausuraufgaben erstellt werden sollen. Trigger-Phrasen: 'Erstelle Moodle-Fragen', 'mach mir Prüfungsfragen', 'Klausuraufgaben für Moodle', 'Quiz aus dem Kapitel', 'Generate Moodle XML', 'Export as Moodle XML', 'Fragen für die Klausur', 'erstell mir ein Quiz', 'Testfragen zu', 'baue Übungsfragen', 'Moodle-Quiz', 'Prüfungsfragen exportieren'."
---

# Moodle Question Generator

Wandelt Lehrinhalt in valides Moodle-XML um — direkt importierbar in Moodle 4.x/5.x.

---

## Schritt 0: Klärungsabfrage

Bevor du XML generierst, prüfe ob diese Parameter bekannt sind. Wenn mindestens einer unklar ist, stelle **eine einzige kurze Frage** mit allen offenen Punkten auf einmal:

| Parameter | Unklar wenn... | Default (wenn nicht nachgefragt) |
|---|---|---|
| **Sprache** | Input gemischt oder explizit keine Sprache genannt | Sprache des Inputs übernehmen |
| **Anzahl** | Keine Zahl genannt | 5 Fragen |
| **Fragetyp** | Kein Typ erwähnt, Inhalt nicht eindeutig | Auto-Detect (siehe unten) |
| **Schwierigkeitsgrad** | Mehrere Niveaus möglich | Mittel (Bachelor-Niveau) |

Wenn alle Parameter klar sind (z.B. „5 deutsche MC-Fragen zu IFRS 15"), direkt zur Generierung springen — keine Rückfrage.

---

## Schritt 0a: Kurskontext lesen (wenn vorhanden)

- **`_running_case.md`** zuerst: Fragen mit Fallbezug verwenden nur dessen Zahlen, Daten (Zeitachse), Personen und Begriffe (z. B. "management board", nie ein Synonym). Nichts still neu erfinden; neue Werte am Ende unter der Überschrift `FACT SHEET ADDITIONS` melden.
- **`_curriculum.md`**: Lernziele des Kapitels mit **kursweiter Nummer und Text** übernehmen (LO 1 … N, fortlaufend über den Kurs; nie eine kapitellokale Zählung wie "LO 6.3"). Jede Frage bekommt das Lernziel, das sie prüft (siehe Namenskonvention).

**Beispiel-Abfrage** (nur wenn nötig):
> „Kurz bevor ich loslege: Wie viele Fragen brauchst du, in welcher Sprache sollen sie sein, und soll ich den Fragetyp automatisch wählen oder möchtest du einen bestimmten Typ?"

---

## Fragetyp-Erkennung (Auto-Detect)

| Inhalt / Kontext | Fragetyp |
|---|---|
| Definitionen ↔ Begriffe zuordnen | `match` |
| Berechnungen mit konkreten Zahlen | `numerical` |
| Wahr/Falsch-Aussagen | `truefalse` |
| Buchungssätze, Lückentexte | `cloze` |
| Diskussion, Analyse, offene Fragen | `essay` |
| Alles andere | `multichoice` (Default) |

---

## Schritt 0b: Qualitätssicherung vor dem XML-Export

Bevor du das XML ausgibst, prüfe still für jede Frage:

### Numerical — Berechnung verifizieren (immer)
Führe die Rechnung per Python via Bash aus, bevor du die Antwort ins XML schreibst. Beispiel:
```python
investment = 10000; profit = 2000; roi = profit / investment * 100; print(roi)
```
Nur wenn Python-Ergebnis und dein vorgesehener Antwortwert übereinstimmen → Frage fertigstellen. Bei Abweichung: Aufgabenstellung oder Antwort korrigieren.

### Multichoice — Eindeutigkeit der Antworten prüfen
Für jede Frage gedanklich durchgehen:
- Gibt es **genau eine** klar richtige Antwort? (Wenn zwei Optionen plausibel wirken → Frage schärfer formulieren oder Distraktoren anpassen)
- Sind die falschen Antworten **eindeutig falsch** — nicht nur „weniger richtig"? Ein guter Distraktor ist ein häufiger Denkfehler, keine Fangfrage.

### Matching — Bijektivität sicherstellen
Jeder Begriff muss genau **eine** passende Definition haben — keine Überschneidungen. Kurz prüfen: Könnte Begriff A auch zu Definition B passen? Falls ja → Definitionen präzisieren.

---

## Ausgabe

1. **XML-Block** (vollständig, `<?xml ...?>` bis `</quiz>`); im Kursprojekt als Datei je Kapitel (z. B. `moodle/questions/ch06_slug.xml`)
2. **Kurze Zusammenfassung** danach (1–2 Zeilen): Anzahl, Typen, Sprache, Abdeckung Lernziel → Anzahl Fragen — damit der User weiß was er bekommt, ohne ins XML schauen zu müssen
3. Keine Einleitungstexte vor dem XML-Block
4. Bei Dateien: XML lokal parsen (`python3 -c "import xml.etree.ElementTree as E; r=E.parse('datei.xml').getroot(); print(len(r.findall('question')))"`) und die Zahl gegen die erwartete Fragenzahl (plus Kategorie-Einträge) prüfen
5. Hinweis auf den **Testimport** (siehe "Vor der Freigabe")

---

## XML-Grundstruktur

```xml
<?xml version="1.0" encoding="UTF-8"?>
<quiz>
  <!-- Fragen hier -->
</quiz>
```

**Universelle Pflichtfelder je Frage:**
- `<name><text>Thema - Aspekt</text></name>` (im Kurskontext mit Lernziel, siehe unten)
- `<questiontext format="html"><text><![CDATA[...]]></text></questiontext>`
- `<defaultgrade>1</defaultgrade>`

**CDATA-Regel:** Alle Fragen- und Feedbacktexte in `<![CDATA[ ... ]]>` einwickeln — HTML in CDATA ist erlaubt.

### Namenskonvention und Lernziel-Tags (Kurskontext)

- Datei beginnt mit einer Kategorie: `<question type="category"><category><text>$course$/top/<Kurs>/CH06 - <Kapiteltitel></text></category></question>`.
- Fragename: `CH06 - Q07 - LO 24 - <Aspekt>` (EN) bzw. `K06 - F07 - LZ 24 - <Aspekt>` (DE). Kapitel- und Fragenummer immer zweistellig (sonst sortiert Moodle Q10 vor Q2). LO/LZ = kursweite Nummer aus `_curriculum.md`; prüft eine Frage mehrere Lernziele, steht das wichtigste im Namen.
- Zusätzlich je Lernziel ein Moodle-Tag, damit sich Quizze nach Lernziel exakt filtern lassen (die Namenssuche nach "LO 2" findet auch "LO 24"):

```xml
<tags>
  <tag><text>LO 24</text></tag>
  <tag><text>LO 25</text></tag>
</tags>
```

Das `<tags>`-Element steht innerhalb von `<question>` nach den übrigen Feldern (DE: `LZ 24`).

---

## Fragetyp-Templates

### MULTICHOICE

```xml
<question type="multichoice">
  <name><text>Thema - Konzept</text></name>
  <questiontext format="html">
    <text><![CDATA[<p>Fragentext hier...</p>]]></text>
  </questiontext>
  <defaultgrade>1</defaultgrade>
  <penalty>0</penalty>
  <single>true</single>
  <shuffleanswers>1</shuffleanswers>
  <answernumbering>abc</answernumbering>
  <answer fraction="100" format="html">
    <text><![CDATA[Richtige Antwort]]></text>
    <feedback><text><![CDATA[Korrekt! Begründung warum richtig.]]></text></feedback>
  </answer>
  <answer fraction="0" format="html">
    <text><![CDATA[Falscher Distraktor 1]]></text>
    <feedback><text><![CDATA[Falsch, weil ...]]></text></feedback>
  </answer>
  <answer fraction="0" format="html">
    <text><![CDATA[Falscher Distraktor 2]]></text>
    <feedback><text><![CDATA[Falsch, weil ...]]></text></feedback>
  </answer>
  <answer fraction="0" format="html">
    <text><![CDATA[Falscher Distraktor 3]]></text>
    <feedback><text><![CDATA[Falsch, weil ...]]></text></feedback>
  </answer>
</question>
```

Standard: 4 Optionen (1 richtig, 3 Distraktoren). Bei negativem Scoring: `<penalty>0.3333333</penalty>`.

---

### MATCH (Zuordnung)

> **Wichtig:** Der Typ heißt `match`, nicht `matching` — `matching` wird von Moodle nicht erkannt und führt zu stillen Importfehlern.

```xml
<question type="match">
  <name><text>Thema - Zuordnungsübung</text></name>
  <questiontext format="html">
    <text><![CDATA[<p>Ordnen Sie die Begriffe den Definitionen zu:</p>]]></text>
  </questiontext>
  <defaultgrade>1</defaultgrade>
  <shuffleanswers>true</shuffleanswers>
  <subquestion format="html">
    <text><![CDATA[Begriff A]]></text>
    <answer><text><![CDATA[Definition A]]></text></answer>
  </subquestion>
  <subquestion format="html">
    <text><![CDATA[Begriff B]]></text>
    <answer><text><![CDATA[Definition B]]></text></answer>
  </subquestion>
  <subquestion format="html">
    <text><![CDATA[Begriff C]]></text>
    <answer><text><![CDATA[Definition C]]></text></answer>
  </subquestion>
</question>
```

---

### NUMERICAL (Berechnung)

```xml
<question type="numerical">
  <name><text>Thema - Berechnung</text></name>
  <questiontext format="html">
    <text><![CDATA[<p>Berechnen Sie den ROI. Angaben: Investment = 10.000 €, Gewinn = 2.000 €</p>]]></text>
  </questiontext>
  <defaultgrade>1</defaultgrade>
  <answer fraction="100">
    <text>20</text>
    <tolerance>0.01</tolerance>
    <feedback><text><![CDATA[Korrekt! ROI = (Gewinn / Investment) × 100 = 20 %]]></text></feedback>
  </answer>
</question>
```

---

### TRUEFALSE (Wahr/Falsch)

```xml
<question type="truefalse">
  <name><text>Thema - Aussage</text></name>
  <questiontext format="html">
    <text><![CDATA[<p>Die zu bewertende Aussage.</p>]]></text>
  </questiontext>
  <defaultgrade>1</defaultgrade>
  <answer fraction="100" format="html">
    <text>true</text>
    <feedback><text><![CDATA[Korrekt! Begründung.]]></text></feedback>
  </answer>
  <answer fraction="0" format="html">
    <text>false</text>
    <feedback><text><![CDATA[Falsch. Begründung.]]></text></feedback>
  </answer>
</question>
```

---

### CLOZE (Lückentext)

```xml
<question type="cloze">
  <name><text>Thema - Lückentext</text></name>
  <questiontext format="html">
    <text><![CDATA[<p>Ergänzen Sie: Soll {1:SHORTANSWER:=Kasse} an Haben {1:SHORTANSWER:=Umsatzerlöse}.</p>]]></text>
  </questiontext>
  <defaultgrade>1</defaultgrade>
</question>
```

---

### ESSAY (Freitext mit Musterlösung)

```xml
<question type="essay">
  <name><text>Thema - Analyse</text></name>
  <questiontext format="html">
    <text><![CDATA[<p>Diskutieren Sie ...</p>]]></text>
  </questiontext>
  <defaultgrade>1</defaultgrade>
  <answer fraction="0">
    <text></text>
  </answer>
  <graderinfo format="html">
    <text><![CDATA[
      <p><strong>Bewertungshinweise:</strong></p>
      <ul>
        <li>Aspekt 1: ... (X Punkte)</li>
        <li>Aspekt 2: ... (X Punkte)</li>
      </ul>
    ]]></text>
  </graderinfo>
  <responseformat>editor</responseformat>
  <responserequired>1</responserequired>
</question>
```

---

## Fallstudien

Bei mehrteiligen Aufgaben aus einem Falltext:

1. Erst `<question type="description">` mit dem Falltext (`<defaultgrade>0</defaultgrade>`)
2. Dann die eigentlichen Fragen nummeriert

**Namenskonvention:**
- `[Thema] - 00_Kontext`
- `[Thema] - Q1_[Aspekt]`, `[Thema] - Q2_[Aspekt]`, …

---

## Feedback-Qualität

Jede Antwort braucht Feedback, das erklärt **warum** sie richtig oder falsch ist — nicht nur „Korrekt!" oder „Leider falsch!". Falsche Antworten sollen Lernmomente sein.

**Gut:** „Falsch. Die lineare Abschreibung verteilt den Aufwand gleichmäßig — die degressive Methode wendet einen konstanten Prozentsatz auf den sinkenden Restbuchwert an."

**Schlecht:** „Leider falsch."

---

## Integration mit Quarto-Kapiteln

Wenn ein `.qmd`-Kapitel als Quelle angegeben wird:
1. Kapitel lesen; Lernziele mit kursweiter Nummer aus `_curriculum.md` übernehmen (nur wenn es keins gibt, aus der Lernziel-Box des Kapitels)
2. Pro Lernziel mindestens eine Frage, jede mit LO-Nummer im Namen und als Tag
3. Mix aus Wissens-, Verständnis- und Anwendungsfragen (Bloom-Taxonomie)
4. Fachterminologie aus dem Kapitel wörtlich übernehmen; Fallzahlen und -daten aus `_running_case.md`

---

## Vor der Freigabe: Testimport

Lokales Parsen findet nur XML-Fehler, nicht, was Moodle daraus macht. Deshalb dem User **immer empfehlen**, jede neue oder geänderte Datei zuerst in einen **Moodle-Sandbox-Kurs** zu importieren (Fragensammlung → Import → Moodle-XML), bevor sie in den echten Kurs geht. Dort prüfen:

- importierte Anzahl = Anzahl in der Datei; Kategorie richtig angelegt
- Vorschau je Fragetyp einmal: Formeln, Tabellen, Sonderzeichen, Cloze-Lücken, Zuordnungen
- Numerical: richtige Antwort und Toleranz in der Vorschau getestet, auch eine knapp falsche Eingabe
- Tags vorhanden (Filter nach `LO 24` findet die erwarteten Fragen)

Erst danach als freigegeben melden; ohne Testimport im Bericht "nicht testimportiert" vermerken.

---

## Nach Änderungen an Zeitachse oder Parametern

Ändern sich `_running_case.md` (Zeitachse, Personen, kursweite Parameter wie Zinssatz oder Steuersatz) oder Zahlen im Kapitel, sind bestehende Fragen veraltet, auch wenn das XML gültig bleibt:

1. Alle Fragendateien des Kurses und die übrigen Moodle-Texte mit Fallbezug (z. B. `moodle/objectives/`) nach den alten Werten durchsuchen (`grep -rn "November 2026" moodle/`): Datumsangaben, Beträge, Namen, Gremien.
2. Betroffene Fragentexte und Feedbacks anpassen, numerische Antworten mit Python neu rechnen.
3. Geänderte Dateien wieder testimportieren und im Bericht auflisten.
