# Widget-Analyzer-Muster

Vollständige Analyse-Logik für die Identifikation von Widget-Opportunities in Quarto-Lehrkapiteln.

---

## Kontext

- Zielgruppe: Bachelor-Studierende Wirtschaftsingenieurwesen, THWS
- Pädagogik: "Trinity of Depth" (Theorie / Norm / Praxis)
- Sprache: Deutsch oder Englisch (aus .qmd-Inhalt erkennen, alle Outputs anpassen)
- Widgets ergänzen das Verständnis — sie sind keine Dekoration

**Nicht als HTML-Widget vorschlagen:** Flip-Cards, Progressive Disclosure, Quiz/Selbsttests — diese sind nativ im quarto-lecture Skill verfügbar.

---

## Widget-Kategorien

### 1. Prozesse/Abläufe
**Zweck:** Sequenzielle Schritte, zeitliche Abläufe oder Verfahrenswissen visualisieren

**Beispiele:**
- Buchungssatz-Ablauf (Analyse → Kontenzuordnung → Buchung)
- Geschäftsprozessschritte
- Entscheidungsbäume
- Algorithmusausführung

**Widget-Typen:** Step-by-step-Animationen mit Navigation, Timeline-Visualisierungen, interaktive Flowcharts

**Interaktionsmuster:** Vor/Zurück-Navigation, Schritt-Highlighting

---

### 2. Zusammenhänge/Abhängigkeiten
**Zweck:** Vernetzungen, Kausalbeziehungen oder systemische Effekte zeigen

**Beispiele:**
- Bilanzbeziehungen (Aktiva/Passiva)
- Gewinn vs. Cashflow-Abhängigkeiten
- Marktgleichgewichtsdynamiken
- System-Feedback-Schleifen

**Widget-Typen:** Interaktive Netzwerkdiagramme, Sankey-Flussdiagramme, dynamische Verbindungsvisualisierungen

**Interaktionsmuster:** Hover für Details, Click zum Auf-/Zuklappen, Pfade hervorheben

---

### 3. Parametervariationen
**Zweck:** Auswirkungen von Variablenänderungen demonstrieren

**Beispiele:**
- ROI-Berechnung mit variablen Zinssätzen
- Break-even-Analyse mit Kostenvariationen
- NPV-Sensitivitätsanalyse
- Formel-Demonstrationen

**Widget-Typen:** Slider-Steuerung + Live-Diagramme, What-if-Rechner, interaktive Formeln

**Interaktionsmuster:** Slider/Eingaben anpassen, Echtzeit-Ergebnisaktualisierung, Szenarien vergleichen

---

## Textmuster-Erkennung

### Indikatoren für Prozesse/Abläufe
- Sequenz-Marker: "Schritt 1, 2, 3...", "zunächst... dann... schließlich..."
- Prozess-Sprache: "Der Ablauf ist...", "Das Verfahren umfasst...", "Die Reihenfolge..."
- Temporale Konnektoren: "anschließend", "danach", "im nächsten Schritt"
- Instruktions-Verben: "wird durchgeführt", "erfolgt", "wird vorgenommen"

### Indikatoren für Zusammenhänge/Abhängigkeiten
- Kausal-Sprache: "beeinflusst", "wirkt sich aus auf", "führt zu", "bewirkt"
- Relational: "steht in Beziehung zu", "hängt ab von", "korreliert mit"
- Bedingte Aussagen: "Je mehr X, desto...", "wenn... dann...", "bei steigendem..."
- Systembeschreibungen: "das System besteht aus", "die Komponenten interagieren"

### Indikatoren für Parametervariationen
- Variablen-Nennungen: "bei unterschiedlichen Werten", "variiert zwischen... und..."
- Hypothetische Szenarien: "Angenommen der Zinssatz beträgt...", "Bei einem Wert von..."
- Formel-Präsentationen: mathematische Ausdrücke mit Variablen
- Sensitivitäts-Sprache: "reagiert empfindlich auf", "ist abhängig von"
- Bereichsangaben: "zwischen X und Y", "von... bis..."

---

## Analyse-Workflow

### Phase 1: Content-Scan
1. Vollständiges .qmd-Kapitel lesen
2. Abschnittsstruktur und Lernziele identifizieren
3. Inhalte auf Trinity of Depth mappen
4. Vorhandene visuelle Elemente notieren (Tabellen, Abbildungen)

### Phase 2: Mustererkennung
Für jeden Inhaltsabschnitt:
1. Auf Textmuster der drei Widget-Kategorien scannen
2. Komplexität einschätzen: Ist das Konzept aus dem Text allein schwer zu erfassen?
3. Pädagogischen Wert bewerten: Verbessert die Visualisierung das Verständnis erheblich?
4. Kognitive Last berücksichtigen: Vereinfacht oder verkompliziert sie?

### Phase 3: Widget-Spezifikation
Für jede identifizierte Opportunity erstellen:

```markdown
## Widget [N]: [Beschreibender Titel]

**Stelle:** [Abschnitt/Absatz-Identifier aus dem .qmd]
**Kategorie:** [Prozesse | Zusammenhänge | Parametervariationen]
**Priorität:** [Hoch | Mittel | Niedrig]

**Didaktisches Ziel:**
[1–2 Sätze: Was sollen Studierende durch dieses Widget verstehen?]

**Widget-Konzept:**
[2–3 Sätze: Was zeigt das Widget und wie funktioniert es?]

**Hauptmerkmale:**
- Hauptinteraktion: [z. B. "Slider passt Zinssatz an, Diagramm aktualisiert sich"]
- Angezeigte Daten: [z. B. "ROI-Werte von 0–20 %"]
- Visueller Typ: [z. B. "Liniendiagramm" oder "Netzwerkdiagramm"]

**Integration:**
- Dateiname: `widgets/kapitel-XX/widget-[name].html`
- Platzierung: [Vor/nach welcher Überschrift]
- Einleitungstext: "[1–2 Sätze, die das Widget in der Dokumentsprache einführen]"
```

### Phase 4: Priorisierung
- **Hoch:** Kernkonzept, hoher didaktischer Wert, klares Interaktionsmuster
- **Mittel:** Hilfreich aber nicht essenziell, oder technisch aufwändig
- **Niedrig:** Nice-to-have, marginale Verbesserung gegenüber dem Text

---

## Qualitätskriterien

Ein guter Widget-Vorschlag sollte:
- ✅ Ein echtes Verständnisproblem adressieren
- ✅ Interaktivität bieten, die Text/statische Bilder nicht leisten können
- ✅ Technisch machbar in HTML/CSS/JavaScript sein
- ✅ Natürlich in den Erzählfluss passen
- ✅ Kognitive Last respektieren (nicht überfordern)
- ✅ Über Geräte hinweg funktionieren (responsives Design)

## Anti-Patterns

- ❌ Widgets zur Dekoration ohne pädagogischen Wert
- ❌ Überkomplizierte Interaktionen, die eher verwirren
- ❌ Redundante Widgets, die nur den Text wiederholen
- ❌ Unterbrechung des Erzählflusses durch abrupte Einschübe
- ❌ Technologie-Showcase ohne Lernziel
- ❌ Widgets, die nur auf bestimmten Browsern/Geräten funktionieren
