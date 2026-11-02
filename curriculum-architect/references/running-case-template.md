<!-- Vorlage für _running_case.md — nur anlegen, wenn der Kurs ein durchgehendes Fallunternehmen hat.
     Inhalte in der Kurssprache; die Abschnittsnamen bleiben wie hier (die anderen Skills suchen danach).
     Alle Werte fiktiv. Datei ohne YAML-Frontmatter. -->

# Fallunternehmen — [Firma]

Einzige Quelle für jede Zahl, jedes Datum, jede Person und jeden Begriff von [Firma]. Kapitel, Tutorien, Kurzfälle, Moodle-Fragen, Folien, Teaching Notes und Widgets übernehmen Werte **nur aus dieser Datei**. Ein Skill, der einen neuen Wert braucht, erfindet ihn konsistent zu dieser Datei und meldet ihn am Ende unter `FACT SHEET ADDITIONS`; eingetragen wird er von der Orchestrierung (curriculum-architect UPDATE), nicht vom einzelnen Skill.

Rechenregel: Zwischenwerte ungerundet rechnen, gerundet anzeigen; gerundete Aussagen kennzeichnen („rund", „ca.", „about"). Jede abgeleitete Zahl steht mit ihrer Herleitung in dieser Datei.

---

## Profil (Profile)

| Merkmal | Wert |
|---|---|
| Name | [Firma, Rechtsform] |
| Sitz | [Ort] |
| Geschäft | [Branche, Produkte] |
| Geschichte | [2–3 Fakten] |
| Umsatz [Jahr] | [Betrag] |
| Mitarbeitende | [Zahl] |
| Geschäftsjahr / Bewertungsstichtag | [z. B. Kalenderjahr; Stichtag 1.1.2027 = $t = 0$] |

**Kernobjekt** (Projekt, Vermögenswert oder Transaktion, um das sich der Fall dreht):

| Merkmal | Wert | Herleitung | Eingeführt in |
|---|---|---|---|
| [z. B. Investition $I_0$] | [Wert] | [Formel oder „gesetzt"] | Kap. [Nr] |

---

## Personen (People)

| Person | Rolle | Gremium | Tritt auf in |
|---|---|---|---|
| [Name] | [Funktion] | [z. B. Vorstand / management board] | Kap. [Nr] |

Keine weiteren Personen der Firma ohne Eintrag hier.

---

## Begriffe/Gremien (Terms/Bodies)

| Begriff | Verwenden | Nie verwenden |
|---|---|---|
| [Gremium, z. B. Vorstand] | [z. B. „management board"] | [z. B. „executive board"] |
| [Projektname] | [genaue Schreibweise, z. B. „Plant 2"] | [Varianten] |

---

## Kursweite Parameter (Course-wide parameters)

| Parameter | Symbol / Schreibweise | Wert | Gilt ab | Ausnahme |
|---|---|---|---|---|
| [z. B. risikoloser Zins] | $r_f$ | [2,5 %] | Kap. [Nr] | [nur wenn eine Aufgabe es ausdrücklich sagt] |
| [z. B. Marktrisikoprämie] | $E[r_m] - r_f$ | [5 %] | Kap. [Nr] | — |
| [z. B. Steuersatz] | $\tau$ | [30 %] | Kap. [Nr] | — |
| [z. B. Wechselkurs] | [EUR/USD] | [1,10 USD je EUR] | Kap. [Nr] | — |
| [Notation, z. B. Rentenbarwertfaktor] | [eine Schreibweise, z. B. `AF(r, n)`] | — | Kap. [Nr] | — |

Jeder Parameter hat genau einen Wert und genau eine Schreibweise. Ändert sich ein Wert im Kursverlauf (z. B. Hurdle Rate 8,0 % → Projektzins 8,6 %), steht der Wechsel mit Kapitel in der Spalte „Gilt ab" und in der Zeitachse.

---

## Zeitachse (Timeline)

Verbindlich für alle Materialien. Jede datierte Szene in Kapitel, Tutorium, Kurzfall, Moodle oder Folien muss hier stehen.

| Datum | Ereignis | Kapitel |
|---|---|---|
| [Datum] | [Szene, z. B. Entscheidungsvorlage des CEO] | Kap. [Nr] |
| [Datum] | [z. B. **Grundsatzbeschluss** des Aufsichtsrats; endgültige Entscheidung am …] | Kap. [Nr] |

Regeln: Jede Entscheidung fällt genau einmal (Datum und Gremium). Kein Kapitel nutzt ein Ereignis, bevor es in der Zeitachse stattgefunden hat (z. B. keine Produktion vor dem Bau). Konventionen, die die Chronologie bewusst vereinfachen (z. B. „Bauzeit wird ignoriert"), stehen hier ausdrücklich.

---

## Fall-Sitzungen (Case sessions)

| Sitzung | Kapitel | Fall / Episode | Lernziele |
|---|---|---|---|
| [Nr] | [Nr] | [Fallunternehmen-Episode oder Kurzfall mit anderer Firma] | [z. B. 22–26] |

---

## Additions by chapter

Je Kapitel die Werte, die es eingeführt hat (aus `FACT SHEET ADDITIONS`), mit Herleitung. Neue Einträge vor dem Eintragen gegen *Kursweite Parameter* und *Zeitachse* prüfen; ein Widerspruch geht an die Autorin / den Autor, nicht stillschweigend in die Datei.

### Kapitel [Nr] — [Titel]

| Merkmal | Wert | Herleitung |
|---|---|---|
| [Merkmal] | [Wert] | [Formel] |
