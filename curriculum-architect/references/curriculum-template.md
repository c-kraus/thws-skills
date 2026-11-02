<!-- Vorlage für _curriculum.md. Überschriften in der Kurssprache schreiben.
     Englischer Kurs: Lehrformat → Teaching Format · Kohorte & Vorwissen → Cohort & Prior Knowledge ·
     Themenauswahl → Topic Selection · Kapitelübersicht → Chapter Overview · Lernpfad → Learning Path ·
     Lernziele je Kapitel → Learning Objectives by Chapter · Material je Kapitel → Materials by Chapter ·
     Terminologie-Konventionen → Terminology Conventions · Kapitel-Leitfragen → Guiding Questions ·
     Kontext-Verzeichnis → Context Directory · Offene Punkte → Open Items.
     Abschnitte mit „optional" löschen, wenn sie nicht zutreffen. Datei ohne YAML-Frontmatter. -->

# [Kurs-Titel]

**Studiengang:** [z. B. B.Eng. Wirtschaftsingenieurwesen, THWS · 5 ECTS · Klausur 90 Minuten]
**Semester:** [Semester oder —]
**Sprache:** [de / en] [optional: · englische Fassung in `[Pfad]` — Inhaltsänderungen dort nachziehen]
**Wiki:** [`./wiki` oder `none`]
**Normstand:** [optional, z. B. IFRS in der EU-Fassung für Geschäftsjahre ab 1.1.2027]

---

## Lehrformat

- **Aufteilung:** [z. B. 2 SWS Selbststudium mit dem interaktiven Lehrbuch + 2 SWS Präsenz-Tutorium (90 Minuten)]
- **Sitzungen:** [z. B. 13 Wochen: Sitzung N = Kapitel N, Sitzung 13 = Integration]
- **Selbststudium je Kapitel:** [z. B. ca. 120 Minuten] — Prüfwert für das Lesepensum: Prosawörter ÷ 120 Wörter/Minute (Zweitsprache) bzw. ÷ 150 (Muttersprache) + ca. 3 Minuten je interaktivem Element; abweichende Werte je Kapitel stehen in *Material je Kapitel*.
- **Präsenz:** [z. B. Tutorium mit Aufgaben und Kurzfall, ca. 75 Minuten Arbeit + 15 Minuten Puffer]
- **Prüfung:** [Form, Dauer, Hilfsmittel]
- **Kapitelgerüst:** [z. B. Opening · Theorie · Norm/Methode · Praxis · Abschluss]

---

## Kohorte & Vorwissen

<!-- Ersetzt den früheren Abschnitt „Zielgruppe": quarto-lecture und der Perspektiven-Review lesen ihn
     als Zielgruppen-Block; er kalibriert auch die Grundlagenblöcke.
     Vorkurse nur eintragen, wenn die Autorin / der Autor sie bestätigt hat. -->

- **Wer:** [z. B. internationale Master-Studierende mit Erststudium in BWL, VWL oder Ingenieurwesen]
- **Tatsächlich belegte Vorkurse:** [z. B. BUA1 Financial Accounting (THWS, englisch) — oder: „heterogen, kein gemeinsamer Vorkurs"] (bestätigt am [Datum])
- **Bekannt (darf vorausgesetzt werden):** [konkrete Normen/Themen, z. B. IAS 16, IAS 2, IAS 36, Kapitalwert]
- **Nicht vorausgesetzt (muss erklärt werden):** [z. B. Statistik jenseits des Mittelwerts, HGB]
- **Sprache der Kohorte:** [Muttersprache / Zweitsprache → Lesetempo 150 / 120 Wörter pro Minute]
- **Heterogenität:** [optional, z. B. „ein Teil kennt IAS 16/36/2/37 aus BUA1" → Grundlagen-/Vertiefungsblock in Kap. 2, 3, 5, 7]
- **Typische Stolpersteine:** [optional — Missverständnisse aus früheren Kohorten; speist Quick-Check-Distraktoren]

---

## Themenauswahl

<!-- Ergebnis der kritischen Themenauswahl (INIT Block 3). Nur Entscheidungen der Autorin / des Autors. -->

| Thema | Entscheidung | Begründung | Freigabe |
|---|---|---|---|
| [Thema] | behalten / straffen / streichen / neu / zusammenlegen / teilen | [ein Satz] | [Datum] |

---

## Kapitelübersicht — Teil I · [Titel]

| Nr | Titel | Datei | Status | Kernthemen |
|---|---|---|---|---|
| 01 | [Kapitel-Titel] | `01_[slug].qmd` | 📋 geplant | [Thema1, Thema2, Thema3] |
| 02 | [Kapitel-Titel] | `02_[slug].qmd` | 📋 geplant | **Grundlagen:** [Themen] · **Vertiefung:** [Themen] |

## Kapitelübersicht — Teil II · [Titel]  ← löschen, wenn es keine Teile gibt

| Nr | Titel | Datei | Status | Kernthemen |
|---|---|---|---|---|
| 03 | [Kapitel-Titel] | `03_[slug].qmd` | 📋 geplant | [Thema1, Thema2, Thema3] |

**Status-Legende:** ✅ fertig · 🔄 aktiv · 📋 geplant · ⏸ pausiert

---

## Lernpfad

```
Teil I   Kap. 1  [Kernidee in einer Zeile]
           → Kap. 2  [Kernidee]
Teil II  Kap. 3  [Kernidee]
```

**Übergänge:** Jedes Kapitel beginnt mit einem Satz Rückbezug auf das Vorgängerkapitel und endet mit einem Satz Ausblick. [Abhängigkeiten, z. B. „Kap. 3 setzt Kap. 2 voraus, Kap. 11 greift Beispiele aus Kap. 2, 4 und 7 auf".]

**Grundlagen + Vertiefung (optional, Kap. [Nr]):** Der Grundlagenblock steht am Kapitelanfang in einem abgegrenzten Abschnitt „Grundlagen (Wiederholung)" mit Eingangs-Check (3 Fragen). Wer ihn sicher löst, springt zur Vertiefung. Vertiefung und Tutorium sind für alle gleich.

---

## Lernziele je Kapitel

<!-- Kursweit fortlaufend nummeriert (1 … N), nie je Kapitel neu, kein zweites Schema (kein „LO c.k").
     Tutorien taggen dieselben Nummern: *Lernziele: 7, 8 · ca. 15 Minuten*.
     Englischer Kurs: „After this unit, students will be able to:" -->

Nach dieser Einheit können die Studierenden:

**Teil I — [Titel]**

*Kapitel 1 — [Titel]*
1. [Verb-Phrase, z. B. die Rolle von IASB und EU-Endorsement erklären,]
2. […]
3. […]

*Kapitel 2 — [Titel]*
4. […]
5. […]
6. […]

---

## Material je Kapitel

| Nr | Kapitel | Tutorium | Kurzfall | Teaching Note | Widgets | Selbststudium |
|---|---|---|---|---|---|---|
| 01 | `01_[slug].qmd` | `tutorials/tut_01_[slug].qmd` | [Firma — neu / gekürzt aus `[Pfad]`] | `_teaching_notes/01_[slug]_teaching_note.qmd` | `widgets/kapitel-01/` ([n] vorhanden, [n] neu) | [ca. 120 Min.] |

[optional: Folien `slides/NN_[slug]_slides.md`, Moodle-Paket `moodle/…` als weitere Spalten.]

---

## Fallunternehmen  ← optional, nur mit durchgehendem Fall

Alle Zahlen, Daten, Personen und Begriffe von **[Firma]** stehen in `_running_case.md`. Neue Werte kommen zuerst dorthin.

---

## Terminologie-Konventionen

- **[ABK]** = [Langform] — [Verwendungshinweis]
- Englische Fachtermini beim ersten Vorkommen kursiv in Klammern: Buchwert (*carrying amount*)
- [Zahlenformat, z. B. 1.250.000 € / €1,250,000; keine Währungszeichen in Formeln]
- [Symbole und Schreibweisen, die kursweit gleich bleiben, z. B. Rentenbarwertfaktor `RBF(i, n)`]
- [Personenbezeichnungen, z. B. neutrale Formen oder Genderzeichen `:innen`]

---

## Kapitel-Leitfragen

| Nr | Leitfrage |
|---|---|
| 01 | [Frage, die Studierende vor dem Kapitel stellen würden] |
| 02 | … |

---

## Kontext-Verzeichnis

```
[Projekt]/
├── _curriculum.md                 ← diese Datei
├── _running_case.md               ← nur mit Fallunternehmen
├── _quarto.yml                    ← Buch
├── index.qmd
├── 01_[slug].qmd … NN_[slug].qmd
├── tutorials/tut_NN_[slug].qmd
├── _teaching_notes/NN_[slug]_teaching_note.qmd
├── widgets/kapitel-NN/
└── archive/[alte Auflage]/
```

Wiki (Second Brain): `[absoluter Pfad]`
Raw Sources: `[absoluter Pfad]/raw/`

---

## Offene Punkte  ← optional

- ❓ [offene Frage an die Autorin / den Autor]
- ✅ [entschieden am Datum: …]
