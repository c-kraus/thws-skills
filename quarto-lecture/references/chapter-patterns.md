# Kapitel-Muster

Laden in Workflow-Schritt 4 (Architect). §1 und §4 gelten immer; §2 und §3 nur, wenn ihre Auslöser zutreffen.

---

## 1. Lernziel-Callout (Pflicht, beide Modi)

**Position:** direkt nach dem H1 (im Book Mode nach der kursiven Untertitelzeile), vor dem Opening.

**Inhalt:** die Lernziele dieses Kapitels **wortgleich und mit ihren Nummern** aus `_curriculum.md`. Die Nummern sind kursweit fortlaufend (Lernziel 1 … N); nie pro Kapitel neu zählen, kein zweites Schema („LO 6.3", „LZ 2.1"). Fehlt `_curriculum.md` oder hat das Kapitel dort keine Lernziele: 3–6 messbare Lernziele mit Bloom-Verben formulieren, lokal 1…n nummerieren und im Report melden („Lernziele nicht aus Curriculum — bitte eintragen").

```
::: {.callout-tip title="Lernziele"}
Nach diesem Kapitel können die Studierenden:

- prüfen, ob ein Vertrag ein Leasingverhältnis enthält (Lernziel 17),
- Nutzungsrecht und Leasingverbindlichkeit erstmalig bewerten und fortschreiben (Lernziel 18),
- die Wirkung von IFRS 16 auf EBITDA und Verschuldung beurteilen (Lernziel 19).
:::
```

```
::: {.callout-tip title="Learning objectives"}
By the end of this chapter, students can:

- value single sums, annuities and growing perpetuities on a timeline (LO 1),
- build a loan amortisation schedule and determine the interest and principal in any instalment (LO 3).
:::
```

**Abdeckung:** Jedes Lernziel des Callouts braucht im Kapitel mindestens ein durchgerechnetes Beispiel, eine Case Study oder eine Übung. Ein Lernziel ohne Gegenstück im Text ist ein Stufe-1-Befund.

---

## 2. Grundlagen- und Vertiefungsblock (Kohorten mit Vorwissen)

**Auslöser:** `_curriculum.md` → *Kohorte & Vorwissen* nennt die Grundlagen des Kapitels als bekannt — für die ganze Kohorte oder eine Teilgruppe (z. B. die englische Gruppe kennt IAS 16, 2, 36 aus BUA1) —, oder der Auftrag verlangt es. Vorwissen nie unterstellen, das dort nicht steht; bei internationalen Kohorten erst recht nicht die deutschen Bachelor-Kurse.

**Aufbau:**

```
## Grundlagen (Wiederholung) {#sec-slug-grundlagen}

Die folgenden drei Fragen prüfen das Grundwissen aus [Kurs/Kapitel]. Wer sie sicher
beantwortet, kann direkt zur Vertiefung in @sec-slug-vertiefung springen.

::: {.quick-check}      ← Eingangs-Check: genau drei Quick-Checks, je einer pro
...                        Grundlage, die die Vertiefung voraussetzt
:::

### [Grundlage 1]          ← knapp: zusammen ca. 1.000–1.500 Wörter
### [Grundlage 2]

## [Erstes Vertiefungsthema] {#sec-slug-vertiefung}
```

EN: `## Foundations (Refresher)` · „If you can answer these three questions confidently, go straight to @sec-…".

**Regeln:**
- Das Opening nennt in einem Satz, dass das Kapitel mit einem Grundlagenblock beginnt und wo die Vertiefung startet.
- Die Eingangs-Check-Distraktoren bilden die typischen Fehler der Grundlagen ab — wer sie besteht, hat die Grundlagen wirklich.
- Die Vertiefung erklärt Grundlagen nicht erneut, sondern verweist mit `@sec-…` zurück.
- Der Grundlagenblock zählt zum Umfang und zur Lesezeit (`book-mode.md`).

---

## 3. Rechtsraum-Exkurs (z. B. HGB) als `.details`-Box

**Auslöser:** Das Kapitel vergleicht mit einem nationalen Recht (HGB in einem IFRS-Kurs, Steuerrecht), das eine andere Sprachfassung oder eine internationale Kohorte nicht braucht.

```
::: {.details}
#### Exkurs: HGB — Herstellungskosten nach § 255 Abs. 2 HGB
[Vergleich in 1–2 Absätzen]
:::
```

**Regeln:**
- Heading-Präfix exakt `#### Exkurs: HGB —` (EN: `#### Excursus: HGB —`), damit eine andere Fassung alle Boxen per `grep -n 'Exkurs: HGB'` findet und streichen kann.
- Platz: direkt nach der IFRS-Regel, die sie kontrastiert; eine Box pro Thema.
- Der Haupttext muss ohne die Box vollständig sein: kein „wie im Exkurs gezeigt", keine Quick-Check-, Drag- oder Case-Lösung, die den Exkurs voraussetzt.
- Zählt als Deep Dive für die Abstandsregel (≥100 Wörter Prosa zwischen zwei `.details`).
- Keine deutschen Wortspiele in Überschriften, wenn eine Übersetzung geplant ist.

---

## 4. Running Case (wenn `_running_case.md` existiert)

- **Vor dem Schreiben lesen.** Nur dessen Zahlen, Daten, Personen, Rollen und Begriffe verwenden (z. B. „management board", nie „executive board"); kursweite Parameter (risikoloser Zins, Marktrisikoprämie, Steuersatz, Wechselkurs, Notation) exakt übernehmen.
- **Zeitachse ist verbindlich:** Die Szene des Kapitels spielt in ihrem datierten Slot; nichts vorwegnehmen, was laut Zeitachse erst später passiert, und keinen früheren Stand widersprechen.
- **Nichts still erfinden.** Braucht das Kapitel einen neuen Wert (eine Person, eine Zahl, einen Termin), ihn sparsam einführen und am Ende des Reports auflisten:

```
FACT SHEET ADDITIONS
- [Kapitel/Abschnitt] [Wert, Person oder Begriff] — [wozu, abgeleitet aus welchen Fakten]
```

  Der Orchestrator trägt sie in `_running_case.md` ein. Keine neuen Werte → `FACT SHEET ADDITIONS: keine`.
- Transfer-Fälle mit anderen Unternehmen sind erlaubt, aber als eigener, benannter Akteur — nie als Variante der Fallfirma mit abweichenden Zahlen.
