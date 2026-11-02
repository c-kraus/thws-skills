# Prüfschritte (für Subagents und Inline-Modus)

Jeder Abschnitt ist ein vollständiger Prüfauftrag. Im Parallel-Modus bekommt jeder Subagent seinen Abschnitt plus seine Liste aus dem Inhaltsscan; im Inline-Modus arbeitet der ausführende Agent alle Abschnitte nacheinander selbst ab. Die Ausgabeformate gelten in beiden Modi.

Gemeinsame Regeln:
- **Geprüft heißt geprüft.** ✅ nur, wenn der Punkt tatsächlich nachgerechnet oder gegen eine Quelle abgeglichen wurde. Was nicht geprüft wurde, steht als `nicht geprüft` im Report, mit Grund. Nie eine Pauschalzahl („390 Zitate geprüft"), hinter der Stichproben stehen.
- **Quellenrang:** Originaltext (ifrs.org, gesetze-im-internet.de, Verlags-/DOI-Seite) > Kurs-Wiki > Modellwissen. Das Wiki kann falsch sein. Modellwissen nur als Rückfall, immer mit `nicht live geprüft`.
- **Fundstelle immer mit Datei und Zeile/Abschnitt**, auch bei Widgets (`widgets/kapitel-08/x.html:41`).

---

## A — Kalkulationen

**Ziel:** Jede Zahl muss aus dem Sachverhalt folgen, nicht nur aus der abgedruckten Formel. Der Fehler „12 × 3.600 = 43.200" ist arithmetisch richtig und trotzdem falsch, wenn die Laufzeit 11 Monate beträgt.

1. **Parametertabelle bauen** — vor jeder Rechnung, aus dem Sachverhaltstext (nicht aus der Lösung):
   `| Parameter | Wert | Einheit | Quelle (Datei:Zeile) |` — Laufzeit, Beginn- und Enddatum, Zahlungszeitpunkte (vorschüssig/nachschüssig), Beträge, Zins-/Steuer-/Wachstumssätze, Stückzahlen, Nutzungsdauer, Währung/Kurs, Einheit (€, T€, Mio. €).
   Gibt es `_running_case.md`: dessen Kursweite Parameter und Zeitachse sind maßgeblich; Abweichung im Artefakt = ❌.
2. **Unabhängig neu rechnen:** Python-Skript, das **nur** die Parametertabelle verwendet und das Ergebnis selbst herleitet (Bash ausführen). Erst danach mit Text vergleichen — dreifach:
   Sachverhalt → abgedruckte Formel (stimmen die eingesetzten Werte mit der Parametertabelle?) → abgedrucktes Ergebnis.
3. **Pflicht-Checks** (jeweils explizit abhaken, nicht nur „sieht plausibel aus"):
   - **Monate/Perioden zählen:** Beginn und Ende inklusive? (1.2.–31.12. = 11 Monate; Zugang im Juli = 6 Monate AfA pro rata temporis.) Anzahl Zahlungen = Anzahl Perioden der Laufzeit.
   - **Pro rata:** monatsgenau vs. tagesgenau, Tageszählkonvention (30/360, act/365), Zugangs-/Abgangsmonat.
   - **Zeitpunkte:** t = 0 vs. t = 1, vorschüssig/nachschüssig, Abzinsungsexponent = Anzahl Perioden bis zur Zahlung.
   - **Rundung:** Zwischenwerte ungerundet rechnen, Anzeige gerundet; gerundete Aussagen tragen „rund/ca./about". Summen gerundeter Werte ≠ gerundete Summe → als ⚠️ melden, wenn der Text das nicht erklärt.
   - **Einheiten und Vorzeichen:** T€ vs. €, %-Punkte vs. %, Aufwand/Ertrag, Soll = Haben bei Buchungssätzen (Beträge prüfen, Kontierungslogik nur grob).
   - **Tabellen:** Zeilen- und Spaltensummen, Fortschreibung (Endbestand Jahr t = Anfangsbestand t+1).
4. **Konsistenz über Artefakte** (Material-Set/Kurs): dieselbe Größe hat in Kapitel, Lösung, Teaching Note, Folien und Widget denselben Wert (bis auf ausgewiesene Rundung).
5. Toleranz: ±0,01 in der Anzeigeeinheit oder die im Text gezeigte Rundungsstelle.

**Finance-/Quant-Konventionen** (zusätzlich, wenn Finance-Inhalt):
- Verzinsung diskret vs. stetig, jährlich vs. unterjährig — Kapitel, Tutorium und Widget müssen dieselbe Konvention nutzen.
- Nominal vs. real (Fisher exakt oder Näherung — welche, steht im Text?), Steuern vor/nach, Cashflows und Diskontsatz konsistent (nominal/nominal, real/real; FCF ↔ WACC, FTE ↔ Eigenkapitalkosten).
- Ewige Rente mit Wachstum nur bei g < r; Annuitätenfaktor in der Notation des Kurses (z. B. `AF(r, n)`).
- WACC-Gewichte zu Marktwerten; Tax Shield; Beta levered/unlevered nach der im Kapitel genannten Formel; CAPM-Inputs (rf, MRP) aus dem Fact Sheet.
- Erwartungswert/Varianz exakt aus den Szenarien (Grundgesamtheit vs. Stichprobe, `ddof` angeben); Optionen: Binomialmodell diskret wie im Kapitel, Black-Scholes stetig; IRR: Mehrdeutigkeit bei Vorzeichenwechseln prüfen.

Ausgabe:
```
## Kalkulationen ([N] geprüft, [N] nicht geprüft)
Parametertabelle: [kurz oder Verweis; Konflikte mit _running_case.md zuerst]
✅ [Beschreibung] ([Datei:Zeile]): [Herleitung aus Parametern] = [Ergebnis] — korrekt
⚠️ [Beschreibung] ([Datei:Zeile]): [Python-Ergebnis] vs. Text [Textwert] — Rundungsdifferenz / Rundung nicht ausgewiesen
❌ [Beschreibung] ([Datei:Zeile]): Text [Formel = Textwert], aus Sachverhalt folgt [Herleitung = Python-Ergebnis] — FEHLER: [z. B. 12 statt 11 Monate]
```

---

## B — Widgets (HTML/JS)

Für jedes Widget des Umfangs (`widgets/**/*.html|js`). Verwaiste Widgets und kaputte iframes prüft `widget-pipeline` (AUDIT); hier geht es um Zahlen, Parameter und Zitate.

1. **Inputs extrahieren:** jedes `<input>`/Regler mit `id`, `min`, `max`, `step`, `value`; Presets; hart kodierte Konstanten (Zinssatz, Steuersatz, Laufzeit).
2. **Erreichbarkeit:** Jedes Zahlenbeispiel aus Kapitel, Tutorium und Teaching Note, das mit dem Widget nachvollzogen werden soll, muss einstellbar sein: `min ≤ Wert ≤ max` und `(Wert − min) / step` ganzzahlig. (Fehlerbild: Regler endet bei 5.000, Text braucht 10.000.)
3. **Default/Presets:** Reproduzieren die Startwerte bzw. Presets das Beispiel im Text? Wenn nicht, ist das gewollt und erkennbar?
4. **Rechenlogik:** JS-Formel mit den Textwerten ausführen (`node` falls vorhanden, sonst nach Python portieren) und mit dem Text vergleichen. Gleiche Konventionen wie das Kapitel (diskret/stetig, Rundung, Vorzeichen, Tageszählung, Perioden).
5. **Texte im Widget:** Normzitate gehören in Liste B des Normen-Prüfers; Begriffe, Einheiten und Fact-Sheet-Werte wie im Kapitel.

Ausgabe:
```
## Widgets ([N] geprüft)
✅ [Widget] — Beispiel [X] einstellbar, Ergebnis [Wert] = Text
❌ [Widget:Zeile] — FEHLER: Regler `nennwert` max 5000, Kapitel braucht 10.000 → max ≥ 10.000 setzen
```

---

## C — Normen

1. **Nach Norm gruppieren**, nicht nach Fundstelle: alle Zitate eines Standards/Gesetzes (aus Kapitel, Tutorium, Lösung, Teaching Note, Widget, Folien) zusammen. Je Norm den Originaltext **einmal** holen und **alle** Zitate dagegen prüfen.
2. **Quellen** (Primärquellen):
   - IFRS/IAS/IFRIC/Rahmenkonzept: `https://www.ifrs.org/content/dam/ifrs/publications/html-standards/english/<Jahr>/issued/<std>.html` mit `<std>` z. B. `ifrs18`, `ias7`, `ias36`, `ifric1`, `cf` (Conceptual Framework); aktuelles Jahr verwenden. Per `curl -sSL` in den Scratchpad laden, nach Text wandeln, Absatz per `grep` suchen — zuverlässiger als eine zusammenfassende Web-Abfrage. Die „issued"-Fassung enthält bereits herausgegebene, noch nicht verpflichtende Änderungen (z. B. IAS 7 in der Fassung durch IFRS 18) — Erstanwendungszeitpunkt gegen den Berichtszeitraum des Beispiels prüfen. Ersetzte Standards (IAS 1) fehlen dort; die „required"-Fassung braucht ein Login → Modellwissen, `nicht live geprüft`.
   - Deutsche Gesetze: `https://www.gesetze-im-internet.de/<kürzel>/__<nr>.html` (`hgb`, `estg`, `aktg`, `gmbhg`, `inso`; AO = `ao_1977`); Fallback `https://dejure.org/gesetze/HGB/249.html`.
   - `common-norms.md` ist ein Index mit Prüfdatum: Einträge mit Live-Datum jünger als 12 Monate dürfen ohne Fetch verwendet werden; sonst Originaltext.
3. **Je Zitat prüfen:**
   - Existenz und Inhalt: Sagt der Absatz das, wofür er zitiert wird?
   - **Unterbuchstabe/Satz exakt:** z. B. IFRS 18.B46(b) nennt die *Renditeimmobilie als Vermögenswert*, B47(c) die *Mieterträge* — bei Ertragszuordnung ist B47(c) richtig. Granularität (§ 249 HGB vs. § 249 Abs. 1 Satz 1 HGB) nur als ⚠️-Hinweis.
   - **Fassung/Zeitpunkt:** gilt die Norm für den Zeitraum des Beispiels? (IFRS 18 ab 1.1.2027, bis dahin IAS 1; IAS 7.33/34 alt vs. 34A–34D neu.)
   - **Kursweit einheitlich:** derselbe Sachverhalt wird überall mit demselben Absatz zitiert; widersprechende Zitate = ❌ an allen Stellen.
4. **Budget:** kein Trefferlimit. Aufwand begrenzen über Gruppierung (ein Fetch je Norm, nicht je Zitat) und Parallelität. Gibt es mehr Normen als in der Sitzung prüfbar, nach Fehlerrisiko priorisieren (Unterbuchstaben, B-Absätze, neue Standards, Satzzuordnungen) und den Rest namentlich als `nicht geprüft` listen.

Ausgabe:
```
## Normen ([N] Zitate, [N] gegen Originaltext, [N] nur Modellwissen, [N] nicht geprüft)
✅ [Norm] ([Fundstellen]) — [geprüfter Inhalt] · Originaltext [Quelle, Fassung]
⚠️ [Norm] ([Fundstelle]) — [Granularität / Fassungshinweis / nicht live geprüft]
❌ [Norm] ([Fundstellen]) — FEHLER: [Problem]; richtig: [Norm]
```

---

## D — Sachverhalt-Trigger

**Frage:** Löst die Formulierung des Falls unbeabsichtigt eine andere Norm oder einen anderen Absatz aus, der die Musterlösung ändert? (Fehlerbild: „Kundenfinanzierungen" im Sachverhalt → Hauptgeschäftstätigkeit nach IFRS 18.49(b)/65(a) → Zinsaufwand gehört in die betriebliche Kategorie, die Lösung kippt.)

1. Je Fall/Aufgabe die normrelevanten Tatsachen und Signalwörter auflisten.
2. Gegen typische Auslöser prüfen (nicht abschließend):
   - IFRS 18: Kundenfinanzierung, Bank, Leasinggeber mit Finanzierungsleasing, Absatzfinanzierung → 49(b), 65, B32; Renditeimmobilien-/Beteiligungsgesellschaft, Investmentgesellschaft, Versicherer → 49(a), 55–58, B31; Zahlungsmittel bei Banken → 56.
   - IFRS 16: Verlängerungs-/Kündigungs-/Kaufoption → 18–21, Kurzfristigkeit (≤ 12 Monate, Anhang A) und Wahlrecht 5–8; geringwertig → B3–B8.
   - IAS 37/§ 249 HGB: „üblicherweise/öffentlich angekündigt" → faktische Verpflichtung; Instandhaltung „innerhalb von drei Monaten" → § 249 Abs. 1 Satz 2 Nr. 1.
   - IAS 10/§ 252 Abs. 1 Nr. 4 HGB: Information nach dem Stichtag → wertaufhellend vs. wertbegründend.
   - Größenklassen (§§ 267, 267a HGB), nahestehende Personen (IAS 24), nicht konsolidierte Töchter, Sicherungsbeziehungen.
   - Finance: real/nominal, vor/nach Steuern, Zahlung am Periodenanfang, stetige Verzinsung, verschuldetes Unternehmen (Beta), Optionalität (Warten, Abbruch).
3. Wenn ein Auslöser greift: Ändert er die Lösung? Ja → ❌ mit Vorschlag (Sachverhalt klarstellen, z. B. „keine besondere Hauptgeschäftstätigkeit", oder Lösung anpassen). Unklar → ⚠️.
4. **Kapitelübergreifend:** Widerspricht die Behandlung in einem Kapitel der in einem anderen (z. B. Kap. 11 korrigiert latente Steuern in der indirekten KFR, obwohl Kap. 12 nach IFRS 18 vom betrieblichen Ergebnis ausgeht)?

Ausgabe:
```
## Sachverhalt-Trigger ([N] Fälle geprüft)
✅ [Fall/Aufgabe] — keine unbeabsichtigten Auslöser
❌ [Fall:Zeile] — „[Formulierung]" löst [Norm] aus → Lösung [ändert sich wie]; Vorschlag: [Klarstellung]
```

---

## E — Literatur und Fakten

1. **Existenz:** OpenAlex/CrossRef per `curl` (Autor + Jahr + Titelstichwort; DOI auflösen). Nicht gefunden → ⚠️ „nicht verifiziert — bitte manuell prüfen", kein ❌.
2. **Zitierweise** (APA 7, sofern das Projekt — `CLAUDE.md`, `.csl` — nichts anderes vorgibt): Autor(en), Jahr, Titel, Zeitschrift kursiv mit Jahrgang(Heft), Seiten, DOI als `https://doi.org/…`; Auflage bei Büchern; Jahr im Text = Jahr im Literaturverzeichnis.
3. **Abgleich beidseitig:** jedes Zitat im Text hat einen Eintrag in `.bib`/Literaturliste und umgekehrt (Quarto: `@key` gegen `.bib`).
4. **Aktualität:** neuere Auflage/Nachfolgearbeit nur melden, wenn ≥ 3 Jahre neuer und inhaltlich relevant.
5. **Faktische Angaben:** Daten (Inkrafttreten, Herausgabe eines Standards, historische Ereignisse), Statistiken mit Jahr und Quelle, Institutionen und Ämter. Nicht sicher → Websuche; sonst ⚠️ `nicht live geprüft`.
6. **Zeitachse** (wenn `_running_case.md` vorhanden): datierte Szenen im Artefakt = Zeitachse; Reihenfolge der Szenen chronologisch; Dauern/Alter/Fristen passen zu den Daten.

Ausgabe:
```
## Literatur und Fakten ([N] geprüft)
✅ [Autor Jahr] — gefunden: [Titel, Quelle] · APA korrekt
⚠️ [Autor Jahr] — [nicht verifiziert / APA: DOI fehlt / neuere Auflage …]
❌ [Autor Jahr | Faktum] — FEHLER: [z. B. Jahr 2019 statt 2021; IFRS 18 gilt ab 2027, nicht 2026]
```

---

## F — Kurs-Konsistenz (nur Umfang Kurs)

Nach parallelen Builds; läuft beim Hauptagenten, weil er die Extrakte aller Artefakte braucht.

1. **Querschnittstabelle** `| Größe/Parameter/Norm | Kap. | Tutorium | Lösung | Teaching Note | Folien | Widget | Fact Sheet |` für jede Größe, die in mehr als einem Artefakt vorkommt (Zinssätze, Marktrisikoprämie, Steuersatz, Laufzeiten, Ergebniszahlen, Normzitate je Sachverhalt).
2. **`_running_case.md`:** Profil, Personen, Begriffe (z. B. „management board"), Kursweite Parameter, Notation, **Zeitachse** — jede Abweichung im Artefakt ist ❌; neue, nicht eingetragene Werte unter `FACT SHEET ADDITIONS` melden.
3. **Lernziel-Tags:** jede Tag-Zeile (`*Lernziele: 7, 8 · ca. 15 Minuten*` / `*Learning objectives: …*`) verweist auf existierende LO-Nummern aus `_curriculum.md` (kursweit fortlaufend).
4. **Logik über Kapitel:** dieselbe Methode/Norm wird überall gleich angewandt (siehe D.4).

Ausgabe:
```
## Kurs-Konsistenz
❌ [Größe] — Kap. 6: 5,5 %, Tut. 10: 5 %, Fact Sheet: 5 % → Kap. 6 anpassen
FACT SHEET ADDITIONS
- [Wert, wo eingeführt]
```
