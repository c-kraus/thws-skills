# Showcase: THWS Reveal.js

Dein Gold-Standard für Aufbau und Rhythmus. Das Beispiel ist ein
90-Minuten-Deck aus einer Anfängervorlesung — gekürzt auf die Stellen, an
denen eine Entscheidung getroffen wurde. Die kursiven Kommentare erklären
**warum**; sie gehören nicht ins Deck.

---

## Der Rhythmus einer 90-Minuten-Sitzung

```
Titel
# Einstieg
   Agenda                        ← nur Kapitelüberschriften, keine Zeiten
   Lernziele {.structural}       ← Bloom-Verben, drei Stufen
   Ankerfall {.center}           ← Frage stellen, NICHT auflösen
   Relevanz
   Übersichtstabelle {.tiny-text}
# Block A
   Abbildung + Attribution
   Vergleichstabelle {.small-text}
   Kontrast in zwei Spalten
   Zwischenfrage {.structural .quiz-question}
   Auflösung des Ankerfalls      ← die Pointe der ersten halben Stunde
# Block B
   Konzept in drei Spalten
   Beispiel
   Exkurs im Tabset
   …
# Abschluss
   Was bleibt {.end}
   Ausblick {.structural}
   Literatur {.tiny-text}
```

Alle 3–5 Inhaltsfolien eine Interaktion. Der Ankerfall trägt über den ersten
Block hinweg — das ist der stärkste Baustein im Werkzeugkasten.

---

## Titel und Einstieg

*Die Titelfolie wird nie von Hand geschrieben — Quarto baut sie aus dem YAML.*

```markdown
# Einstieg

## Agenda

1. Warum Recht in der Sozialen Arbeit?
2. Brauch, Sitte, Moral — und Recht
3. Wie die Rechtsordnung sortiert ist

::: {.notes}
90 Minuten. Blöcke 1–3 bis zur Pause. Die Agenda bewusst ohne Zeitangaben —
sonst wird jede Verzögerung zum Thema.
:::
```

*Keine Zeitangaben, keine Methodenbegriffe. Steht „Provokation" in der
Agenda, ist die Provokation verbrannt.*

```markdown
## Lernziele {.structural}

Nach dieser Einheit können Sie …

- **erklären**, worin sich Rechtsnormen von Brauch, Sitte und Moral unterscheiden
- die **Normenhierarchie** auf einen Regelungskonflikt **anwenden**
- **beurteilen**, wo Auslegung endet und Analogie beginnt
```

*Drei bis fünf Ziele, aufsteigende Bloom-Stufen, Verben fett.*

---

## Der Ankerfall

```markdown
## Ein Fall zum Anfangen {.center}

> Anna macht Karriere, ist finanziell abgesichert. Ihr Bruder Bert verliert
> Arbeit und Gesundheit — die Familie steht vor dem Ruin.

**Muss Anna ihren Bruder finanziell unterstützen?**

::: {.notes}
Kurz ins Plenum, 60 Sekunden, Handzeichen. Nicht auflösen — die Auflösung
kommt nach dem Normen-Block. Erwartbar: die meisten sagen „ja, natürlich".
Genau dieser Reflex ist der Einstieg in die Unterscheidung Moral / Recht.
:::
```

*`{.center}` lässt die Frage atmen. Der Fall bleibt zwei Blöcke lang offen.
Die Auflösung ist später eine eigene Folie:*

```markdown
## Auflösung: Anna und Bert

**§ 1601 BGB** — Unterhaltspflicht nur für Verwandte **in gerader Linie**.

- Eltern → Kinder: ja
- Kinder → Eltern: ja
- Geschwister untereinander: **nein**

→ Anna trifft **keine Rechtspflicht**. Eine moralische Verpflichtung kann sie
gleichwohl empfinden.

::: {.notes}
Das ist der didaktische Kern der ersten halben Stunde: Moral und Recht laufen
oft parallel, aber eben nicht immer. In der Beratungspraxis ist genau diese
Trennung entscheidend.
:::
```

---

## Abbildung mit Quelle

```markdown
## Vier Stufen der Verbindlichkeit

![](images/normen-brauch-sitte-moral-recht.png)

::: {.attribution}
nach Trenczek/Tammen u. a. 2023
:::

::: {.notes}
Die Achse unten ist der Kern der Grafik: Verbindlichkeit und soziale Kontrolle
steigen von links nach rechts.
:::
```

*Abbildungen aus dem Skript extrahieren, nicht nachbauen. Die Attribution
kurz halten — sie läuft senkrecht an der Folienkante.*

*Nach einer Abbildung gehört oft eine „Was die Grafik erzählt"-Folie: die
Grafik zeigt, die Folgefolie ordnet ein.*

---

## Tabellen

```markdown
## Was die vier unterscheidet {.small-text}

| | Definition | Sanktion bei Verstoß |
|:---|:---|:---|
| **Brauch** | regelmäßig wiederkehrende Verhaltensweise | subtiler sozialer Druck |
| **Sitte** | über Generationen überliefert | sozialer Druck |
| **Recht** | allgemeinverbindliche Vorschrift | **staatlicher Zwang** |

→ Recht ist Ausdruck des staatlichen **Gewaltmonopols**.
```

*Ab vier Spalten oder langen Zellen `{.tiny-text}` statt `{.small-text}`.
Die `→`-Zeile darunter zieht die Konsequenz — sie ist der Grund, warum die
Tabelle auf der Folie steht.*

```markdown
## Handlungsfeld und rechtlicher Rahmen {.tiny-text}

| Handlungsfeld | Rechtlicher Rahmen |
|:---|:---|
| Gefährdetenhilfe, Resozialisierung | StGB, StPO, JGG, BayStVollzG |
| Migrationsgesellschaft | GG, AsylG, AsylbLG, AufenthG |

::: {.notes}
Nicht vorlesen. Kurz zeigen, ein bis zwei Beispiele herausgreifen, die zum
Interesse der Gruppe passen. Botschaft: „Jedes Feld hat sein Gesetzbuch."
:::
```

*Nachschlagefolien sind erlaubt — aber die Notiz muss sagen, dass sie nicht
vorgetragen werden.*

---

## Kontrast in Spalten

```markdown
## Der Unterschied im Alltag

::: {.columns}
::: {.column width="50%"}
**Brauch**

Student S schmatzt in der Mensa.

→ Er sitzt oft allein. Keine Rechtsfolge, aber spürbar.
:::
::: {.column width="50%"}
**Recht ohne Moral**

Die Straßenverkehrsordnung beruht auf keiner Moralvorstellung.

→ Trotzdem verbindlich.
:::
:::

**Inhaltlich sind die vier Kategorien nicht deckungsgleich.**
```

*Zwei Spalten für einen echten Gegensatz, drei für eine Trias
(Privatrecht / Öffentliches Recht / Strafrecht). Mehr als drei nie.*

---

## Zwischenfrage

```markdown
## Zwischenfrage {.structural .quiz-question}

Was macht eine Vorschrift zu einer **Rechtsnorm**?

- Sie wird von einer großen Mehrheit für richtig gehalten.
- [Sie ist allgemeinverbindlich und notfalls staatlich durchsetzbar.]{.correct}
- Sie ist seit Generationen überliefert.
- Sie ist in einem Buch aufgeschrieben.

::: {.notes}
`c` prüft, `q` setzt zurück. Ablenker 4 lohnt die Nachbesprechung:
Gewohnheitsrecht ist nirgends aufgeschrieben und trotzdem Recht — das kommt
im Rechtsquellen-Block wieder.
:::
```

*Die Ablenker sind nicht Füllmaterial: jeder greift eine der drei anderen
Normkategorien auf. Die Notiz sagt, welcher Ablenker sich zu besprechen
lohnt.*

*`{.structural}` macht die Frage auch optisch zur Zäsur.*

---

## Übung ohne Quiz

*Nicht jede Interaktion braucht Buttons.*

```markdown
## Übung: Welche Regel greift? {.structural}

Eine bayerische **Rechtsverordnung** widerspricht einem **Bundesgesetz**.

Und: Zwei **Bundesgesetze** aus 1998 und 2024 regeln dieselbe Frage
unterschiedlich.

**Welche Kollisionsregel lösen Sie jeweils an — und mit welchem Ergebnis?**

::: {.notes}
Zwei Minuten Murmelgruppe. Auflösung: (1) lex superior, verstärkt durch
Art. 31 GG. (2) lex posterior — sofern das jüngere Gesetz nicht seinerseits
das speziellere ist; dann ginge lex specialis vor. Genau dieser Vorrang ist
die Pointe.
:::
```

---

## Tabset für Parallelstrukturen

```markdown
## Der Auslegungskanon nach v. Savigny {.small-text}

::: {.panel-tabset}

### Wortlaut

*Wie ist die Vorschrift bei natürlichem Sprachgebrauch zu verstehen?*

**§ 212 StGB** setzt voraus, dass ein anderer Mensch **getötet** wird. Wird
das Opfer „nur" lebensgefährlich verletzt, scheidet Totschlag schon nach dem
Wortlaut aus.

### Systematik

*Welcher Sinn ergibt sich aus der Stellung im Gesamtgefüge?*

**§ 224 StGB** ist eine Qualifikation zu § 223 StGB. „Körperverletzung" kann
dort nichts anderes bedeuten als in § 223.

### Telos

*Welche Auslegung entspricht Sinn und Zweck?*

**§ 244 Abs. 1 Nr. 2 StGB** schützt auch die häusliche Privatsphäre. Ein
Hotelzimmer kann deshalb „Wohnung" sein — eine Gartenlaube nicht.

:::

::: {.notes}
Die Reiter nacheinander aufschlagen. Zur Historie der Klausurhinweis: einen
einheitlichen „Willen des Gesetzgebers" gibt es meist ohnehin nicht.
:::
```

*Vier gleichrangige Methoden, jede mit genau einem Beispiel — das ist der
Fall, für den Tabsets gebaut sind. Für sequenzielle Inhalte nicht geeignet.*

---

## Hervorhebung

```markdown
## Subsumtion

Die Prüfung, ob ein **Lebenssachverhalt** den Anwendungsbereich einer
**Rechtsvorschrift** eröffnet.

→ Nicht jede Vorschrift ist aus dem Stand verständlich. Sie bedarf der
[Auslegung]{.rn-fragment rn-type=circle rn-color="#FF6A00"}.

::: {.notes}
Hier den Bogen spannen: Alles bisherige war Landkarte. Jetzt kommt das
Werkzeug, mit dem man tatsächlich arbeitet.
:::
```

*Eine, höchstens zwei Annotationen pro Deck — auf dem Wort, das die Folie
trägt.*

---

## Abschluss

```markdown
## Was bleibt {.end}

- Recht unterscheidet sich von Moral durch **Allgemeinverbindlichkeit** und
  **staatlichen Zwang**
- Bei Konflikten gilt: **lex superior**, **lex specialis**, **lex posterior**
- Analogie und Umkehrschluss trennt eine einzige Frage: war die Lücke
  **geplant**?
```

*Die Zusammenfassung spiegelt die Lernziele — jedes Ziel findet hier seine
Antwort.*

```markdown
## Ausblick: Kapitel 2 {.structural}

### Staatsrechtliche Bezüge

- Entstehung und Änderung des **Grundgesetzes**
- **Staatsprinzipien**: Republik, Demokratie, Rechtsstaat, Sozialstaat

→ Zur Vorbereitung: Art. 20 GG lesen.
```

*Der Ausblick endet mit einer konkreten Vorbereitungsaufgabe, nicht mit
„bis nächste Woche".*

```markdown
## Literatur {.tiny-text}

Rüthers/Fischer/Birk, *Rechtstheorie*, 12. Aufl. 2022

Trenczek/Tammen/Behlert/von Boetticher, *Grundzüge des Rechts*, 6. Aufl. 2023

::: {.tiny}
Folien nach dem Skript „Recht I" von Prof. Dr. Achim Förster, THWS Fakultät
Angewandte Sozialwissenschaften.
:::
```

*Wird das Deck aus fremdem Material gebaut, gehört die Zuschreibung sichtbar
auf die Literaturfolie — und die Autorschaft im YAML gehört der Person, von
der der Inhalt stammt.*

---

## Was dieses Deck NICHT tut

- keine Zeitangaben in der Agenda
- keine dekorativen Stockfotos neben Aufzählungen
- keine Folie, die vorgelesen werden könnte — was gesagt wird, steht in den Notes
- keine Interaktion ohne didaktischen Zweck
- keine erfundene Quelle
