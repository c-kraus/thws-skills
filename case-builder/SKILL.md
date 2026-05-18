---
name: case-builder
description: Create pedagogically rigorous business case studies following "The Ultimate Case Guide" methodology (Kupp & Mueller). This skill guides you through the structured "Case Development Funnel" to produce teaching cases that effectively combine compelling narratives (Lead) with specific learning objectives (Need). Output is a `.qmd` file ready for Quarto Single Source Publishing. Works in both German and English. Use this skill whenever the user mentions case studies, Fallstudien, teaching cases, business cases for classroom use, Kupp & Mueller, case method, case development, or wants to create narrative-driven learning materials about a company or business situation. Also trigger when the user wants to write a case for exam preparation, classroom discussion, or executive education, even if they don't explicitly say "case study".
---

## Core Philosophy

A good case study works like two-component epoxy adhesive — it only functions when two elements are firmly bonded:

1. **The Lead (Die Geschichte)**: A compelling event, person, or company — the narrative hook
2. **The Need (Der Bildungsbedarf)**: The specific learning objective (theory, concept, framework) to be taught

Without the Lead, it's a dry textbook exercise. Without the Need, it's just a newspaper article. The case only works when both are present and tightly connected.

Two concepts are easy to confuse but must stay distinct throughout:

- **Immediate Issue**: The concrete, urgent decision the protagonist faces *right now* — the narrative hook
- **Underlying Issue**: The theoretical concept students should learn by analyzing that decision — the actual learning objective

## Phase 1: Exploration Interview

**Fast-path:** If the trigger message already provides answers to all four core questions below (underlying issue/concept, fictional vs. real, protagonist approach, target audience), skip the Q&A. State your assumptions in one short paragraph and proceed directly to Phase 2.

Only ask if something is genuinely missing. Ask all open questions together in one message — never trickle them out one by one.

1. **Educational Need (Underlying Issue)**: Which theoretical concept should students learn? Be specific. Not "innovation" but "Disruptive Innovation nach Christensen" or "Blue Ocean Strategy nach Kim/Mauborgne".

2. **Case Lead**: What's the story? Company, situation, context. A rich real-world scenario works best.

3. **Strategic decisions** to settle:
   - *Protagonist*: Who is the central character? Must be a real, named person the target audience can identify with — not "the management".
   - *Cut-off Point*: When does the case end? Ideally just *before* a critical decision is made, not after.
   - *Immediate Issue*: What specific, time-pressured decision does the protagonist face at that cut-off point?
   - *Target Audience*: Bachelor, Master/MBA, or Executive Education? This determines depth, vocabulary, and theoretical rigor.

4. **Sources & Release**: Is this based on a real, identifiable company? Does the user have internal data or does it rely on public sources? Will case release (company approval) be needed?

5. **Companion Lecture** *(optional)*: Is there an existing `.qmd` lecture file that this case accompanies? If yes, note the path — it enables the learning objective alignment check done inline during drafting.

A case built on vague foundations cannot be fixed in editing.

## Phase 2: Drafting

### Writing Rules

- **Tense**: Past tense throughout — this is a story, not a report
- **Perspective**: Third person, close to the protagonist's viewpoint. Never "I". Never "the company should".
- **Tone**: Neutral, descriptive, never prescriptive. The case asks questions; it never teaches solutions. A case that reveals the "right answer" has failed.
- **Length**: Typically 1,500–3,000 words for the main text. Executive cases can run longer; exam cases shorter.

### Structure

1. **Opening Paragraph** — the most critical part of the entire case. Must contain: protagonist by name, organization, specific point in time, and the immediate issue. Max 200 words. If this paragraph doesn't hook the reader, the case is dead.

2. **Company Background**: Relevant history, business model, key figures. Only what's needed to understand the decision — not a Wikipedia summary.

3. **External Context** *(if relevant)*: Industry dynamics, competitive landscape, regulatory environment. Serves to sharpen the decision's stakes.

4. **The Core Problem Area**: The section that develops the underlying issue without naming it explicitly. This is where analytical depth lives.

5. **The Decision**: The options available to the protagonist at the cut-off point. Present them fairly — the case must allow multiple defensible positions.

6. **Closing Paragraph**: Returns to the protagonist and the immediate issue. Creates urgency. Often ends mid-thought, with a question hanging in the air, or the protagonist staring at an email they haven't yet answered.

### Quarto File Template

```qmd
---
title: "[Case Title: Punchy Subtitle]"
subtitle: "Teaching Case"
author: "[Author Name]"
date: last-modified
lang: de
format:
  handout-typst
---

# [Case Title]

[Opening Paragraph – max 200 words. Protagonist + organization + time point + immediate issue. Hook the reader immediately.]

[Unternehmenshintergrund — no heading. Run straight into the narrative. If you need a visual label, use **Unternehmenshintergrund** in bold, but only if the transition would be abrupt without it.]

[Markt- und Wettbewerbsumfeld — same: no heading, prose or **bold label** at most.]

[Core problem section — develops the underlying issue implicitly. No heading. Bold labels if needed.]

## Aufgabe 1 — [Analysefeld]

[Brief narrative context that sets up this specific task — 2–4 sentences max, no subheadings.]

[Data table inline, if relevant:]

| Spalte A | Spalte B |
|----------|----------|
| Wert     | Wert     |

a) [Question sub-part]
b) [Question sub-part]
c) [Question sub-part]

---

## Aufgabe 2 — [Analysefeld]

[Brief narrative context — continues the story to the next decision point.]

a) [Question sub-part]
b) [Question sub-part]

---

## Aufgabe 3 — [Analysefeld]

[Closing narrative context. Returns to protagonist. Creates urgency. Ends before the decision.]

a) [Question sub-part]
b) [Question sub-part]
```

### Heading Hierarchy Discipline

The heading hierarchy separates **story from task**:

- **Story and background sections** (Unternehmenshintergrund, Marktumfeld, analytical context) use **no headings** — prose only, with **bold labels** at most for visual anchors. Reason: these are continuous narrative; sub-divisions create a table-of-contents feel that interrupts the story and competes with the task structure.
- **Aufgaben** (the numbered tasks) are the H2 heading level. There should be no H2 headings in the story sections at all — if a story section carries an H2, it will visually compete with the task headings and make the numbering feel inconsistent.
- Within an Aufgabe, sub-questions use lowercase `a) b) c)` — not H3 headings, not bold bullets, just lettered items. Keep the format consistent across all Aufgaben.

If an H2 section contains only a single H3 subsection, the H3 level is unnecessary — promote the content to H2 and eliminate the empty nesting. A heading level is only justified when there are at least two siblings.

### Case Architecture for Lecture Use: Integrated Structure

The most important structural principle is **locality**: data and questions belong at the point in the text where they are needed, not in separate sections at the end.

**Why this matters in the classroom:** When a case separates narrative, exhibits, and discussion questions into three distinct blocks, students must read the whole thing, then re-read to connect questions to narrative, then flip to exhibits to find the numbers. In a lecture hall, this creates friction and breaks the discussion flow. The instructor has to say "go back to page 2" and "see exhibit 3 on page 5" — the case is fighting the teaching.

The integrated structure solves this:

```
[Sachverhalt A — narrative + any data needed for this section]

[Discussion question(s) for Sachverhalt A]

---

[Sachverhalt B — narrative + any data needed for this section]

[Discussion question(s) for Sachverhalt B]
```

This means:
- **Inline data tables**: Place tables, figures, and key numbers directly inside the narrative section they belong to — not in a separate "Exhibit" section at the end. A table appears where the protagonist encounters it, where the student needs it.
- **Questions follow their section**: Each discussion question appears immediately after the section it tests. The student reads the scenario, sees the question, and has everything in one place.

**When to still use a labeled block** (call it "Daten" or "Zahlen", not "Anlage"): If a table is large and would interrupt the narrative flow, you may place it as a labeled sub-block within the same section — still inline, just visually set off. Never put it at the end of the case.

**Exception — pure narrative/strategy cases**: If the case contains no quantitative data and the questions are open-ended strategic choices, it can work to place all questions at the end. But as soon as numbers appear, integrate them.

**Template for an integrated, quantitative case section:**

```markdown
[Story narrative for this task — 2–4 sentences max. No subheadings inside this story block.]

**Anlage N: [Titel]** ← bold label, not a heading

| Spalte A | Spalte B |
|----------|----------|
| Wert     | Wert     |

*[Optional: brief italic note about the data if needed]*

## Aufgabe N — [Analysefeld]

a) [Question sub-part]
b) [Question sub-part]
c) [Question sub-part]

---
```

The `---` separator signals "this section is complete, next begins."

**German-language cases (THWS/IFRS context):** Use `## Aufgabe N — [Analysefeld]` for task headings (H2 level, consistent with the rest of the case). Use `**Anlage N: [Titel]**` (bold, not a heading) for data tables — they appear in the narrative block before the Aufgabe heading. Task titles name the analytical field, not the theory. Sub-questions use `a) b) c)` lettering consistently across all Aufgaben.

## Phase 3: Gap Analysis

After completing the draft, run through this checklist before presenting to the user:

- Does the opening paragraph contain all four required elements (protagonist, organization, time, immediate issue)?
- Is the cut-off point clearly defined — does the case end *before* the decision?
- Are immediate issue and underlying issue clearly distinct, and does the case never explicitly name the underlying issue?
- Does the protagonist feel like a real person with real stakes, or like a placeholder?
- Does every discussion question appear immediately after the section it relates to — not batched at the end?
- Is every data table or figure placed inline at the point where it is needed in the narrative — not in a separate exhibit section?
- Can a student answer each question without having to flip to another part of the document?
- Does the closing paragraph create genuine urgency?

Flag anything missing and propose additions.

## Phase 3b: Arithmetic Quality Check (for quantitative cases)

**Do this before presenting the draft to the user.** Quantitative cases fail silently — a wrong number in the data section produces a wrong "correct answer" in the teaching note, and the error only surfaces when a student finds the inconsistency in class. That is embarrassing and undermines trust in the material.

For every number in the case, verify:

1. **Run calculations in Python via Bash** — for every number students are expected to derive, write and execute a short Python script. Do not mentally verify; compute. Example:
   ```python
   # Kapitalwert-Verifikation
   import numpy as np
   cf = [-180000, 45000, 45000, 45000, 45000, 45000]
   npv = np.npv(0.08, cf)  # or manual: sum(cf[i]/(1.08**i) for i in range(6))
   print(f"NPV: {npv:.2f}")
   ```
   Only if the Python result matches the number in the case → that number is correct.

2. **Internal consistency of input data**: Do all line items in tables sum to their stated totals? Run the sums in Python — do not eyeball.

3. **Derivation chain**: Work through the model solution using only the data provided in the case. If you need a number that isn't there, add it.

4. **Cross-reference**: Same number used in narrative, table, and solution must be identical.

5. **Pro-rata and rounding**: For time-based calculations, apply pro-rata explicitly. State rounding convention if results differ.

6. **Conceptual correctness**: Does the numerical setup embed the right conceptual structure? A number that "works out" under a wrong concept teaches the wrong framework — worse than a wrong number.

Flag any discrepancy and resolve it in the case *before* writing the teaching note solution.

## Phase 3c: Review

**Standard (kein Subagent-Overhead):** Führe den Review als Self-Checklist durch. Gehe die Liste einmal durch und notiere gefundene Probleme direkt — kein Agent-Start, keine Wartephase.

Checkliste:
- Eröffnungsabsatz: Protagonist (Name) + Organisation + Zeitpunkt + Immediate Issue — alle vier vorhanden?
- Endet der Fall VOR der Entscheidung (cut-off), nicht danach?
- Werden Immediate Issue und Underlying Issue klar getrennt gehalten? Wird Letzteres nie explizit benannt?
- Hat der Protagonist echte Handlungsoptionen — mindestens zwei vertretbare Positionen?
- Sind alle Fragen self-contained (kein Blättern nötig)?
- Ist jede Datentabelle inline dort platziert, wo sie gebraucht wird?
- Erzeugt der Schluss echte Dringlichkeit?
- Protagonist mit echten persönlichen Stakes (nicht nur Funktion)?
- Fachbegriffe erklärt oder aus Kontext ableitbar?
- Passt der Diskussionsstoff realistisch in die vorgesehene Lehrzeit?

Behebe gefundene Probleme direkt. Maximal 5 Änderungen — Rest als offene Punkte im finalen Output melden.

**Optionaler Subagent-Review:** Nur starten wenn (a) der Nutzer explizit darum bittet oder (b) der Falltext > 3.000 Wörter umfasst und es sich um einen hochstakigen Einsatz handelt (Prüfung, Publikation). In diesem Fall die drei Subagents wie ursprünglich dokumentiert dispatchen.

---

## Phase 3d: Lernziel-Abgleich mit Vorlesung

Wenn eine Companion-QMD bekannt ist, führe den Abgleich **inline während des Schreibens** durch — nicht als eigene Phase. Prüfe beim Formulieren jeder Aufgabe: Ist das verwendete Konzept in der Vorlesung eingeführt? Sind alle Fachbegriffe dort erklärt?

Melde nur echte Lücken im finalen Output — kompakt, ein Satz pro Punkt:
- ✅ Konzept X ist in der Vorlesung abgedeckt (keine Erwähnung nötig)
- ⚠️ Begriff Y fehlt in der Vorlesung — Hinweis an Nutzer
- ⚠️ Aufgabe N setzt Konzept Z voraus, das erst in Session K behandelt wird — Hinweis an Nutzer
- ❌ Underlying Issue nicht in der Vorlesung — Hinweis an Nutzer

## Phase 4: Teaching Note

After the case draft is approved (and the arithmetic check has passed), offer to create the Teaching Note. This is a separate `.qmd` file — confidential, for the instructor only, never distributed to students.

A Teaching Note makes the difference between a case that gets used once and one that becomes a course staple. It answers: "How do I actually run this in class?"

### Structure principle: mirror the case

The teaching note discussion plan must follow the same question order as the case itself. If the case has questions Q1–Q5 each after their section, the discussion plan covers Q1–Q5 in that order. Do not reorganize into "Einstieg / Vertiefung / Theoriebrücke" phases that cut across the question structure — this forces the instructor to mentally remap case to teaching note while standing at the board.

For each question in the case, the teaching note provides:
- The **model solution** (for quantitative questions: full worked calculation with intermediate steps)
- **Common errors** students make on this question and how to address them
- **Discussion prompts** to move the class forward if they get stuck
- **Time allocation**

### Teaching Note Template

```qmd
---
title: "Teaching Note: [Case Title]"
subtitle: "Vertraulich — nur für Lehrende"
author: "[Author]"
date: last-modified
lang: de
format:
  handout-typst
---

# Lernziele

Nach der Diskussion sollen Studierende in der Lage sein:

1. [Lernziel 1 — konkret und messbar, direkt auf eine Frage des Falls abbildbar]
2. [Lernziel 2]
3. [Lernziel 3]

# Synopsis

[2–3 Sätze: Worum geht es im Fall? Welches theoretische Konzept steht im Zentrum?]

# Theoretischer Rahmen

**Underlying Issue:** [Name des Konzepts]

[Kurze Darstellung des theoretischen Frameworks. Literaturhinweise.]

# Vollständige Lösung

## Aufgabe [N] — [Titel, identisch zur Aufgaben-Überschrift im Falltext]

**Musterlösung:**

[For quantitative questions: complete worked solution showing every step.
Show the derivation chain, not just the result.
Example format:
  Rechnungsbetrag gesamt:  185.000 €
  ./. Training (IAS 16.19): (3.500) €
  ─────────────────────────────────
  Anschaffungskosten:      181.500 €
]

**Typische Fehler:**
- [Fehler 1 und warum er passiert]
- [Fehler 2]

**Diskussionsimpulse:** [What to ask if the class is stuck or going in the wrong direction]

**Zeitbedarf:** ca. [N] Min.

---

## Aufgabe [N+1] — [Titel]

[Same structure — one block per Aufgabe]

---

# Diskussionsplan (Zeitübersicht)

Target: **90 minutes total**, including instructor explanations. Typical split: ~10 min opening/framing, ~60–65 min for Aufgaben discussion, ~10 min synthesis/closing, ~5 min buffer. Do not plan more than 90 minutes — the Diskussionsleiter has one session.

| Phase | Inhalt | Dauer |
|-------|--------|-------|
| Einstieg | [Opening framing + cold start question] | 10 Min. |
| Aufgabe 1 | [Title — including instructor explanation time] | [N] Min. |
| Aufgabe 2 | [Title — including instructor explanation time] | [N] Min. |
| Aufgabe 3 | [Title — including instructor explanation time] | [N] Min. |
| Synthese | Abschluss, Theoriebrücke, nächstes Thema | 10 Min. |
| **Gesamt** | | **90 Min.** |

# Tafelbild (Board Plan)

[Sketch or description of how the board should look at the end of discussion. What concepts, numbers, and conclusions land where. For quantitative cases: show the final calculation structure.]

# Instructor Alerts

[2–4 numbered points flagging the hardest conceptual traps in this case — the moments where students most commonly get it wrong and why. These are the teaching moments worth preparing for explicitly.]
```

### Model solution quality for quantitative questions

The model solution is the most failure-prone part of a teaching note. To write it correctly:

- **Derive, don't assert**: Show every arithmetic step. A solution that says "Annual depreciation: €20,813" without showing `(181,500 − 15,000) ÷ 8 = 20,812.50` is not a model solution — it's a result that the instructor can't verify at a glance.
- **State what's excluded and why**: For every amount not included (e.g., training costs), give the IAS/IFRS paragraph reference. This is what the student needs to learn.
- **Show acceptable ranges for rounded results**: If a calculation involves intermediate rounding, state which values are acceptable (e.g., "€4,440–€4,442 depending on rounding").
- **Cross-check the solution against the case data before writing it**: Use only numbers that appear in the case. If you find yourself needing a number that isn't in the case, go back and add it.

## Best Practices

**What separates a strong case from a weak one:** The strong case has a protagonist who feels trapped — the decision is genuinely hard, the stakes are real, and there is no obvious right answer. Students should be able to argue multiple positions and all of them should be defensible.

**The most common failure mode:** The case teaches instead of provoking. Phrases like "this shows that...", "the correct approach would be...", "management made the mistake of..." — all of these destroy the case method. Cut them without mercy.

**The second most common failure mode:** The immediate issue and underlying issue get conflated. The protagonist deciding whether to launch a product in China is an immediate issue. Porter's Five Forces applied to the Chinese market is the underlying issue. The case presents the former; students discover the latter.

## Output

Save both files to the project's `Fallstudien/` directory (relative to the working directory), or to the path the user specifies.

File naming convention:
- Case: `fallstudie_[unternehmensname]_[jahr].qmd`
- Teaching Note: `teaching_note_[unternehmensname]_[jahr].qmd`
