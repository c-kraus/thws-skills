---
name: html-builder
description: Create standalone HTML/JS widgets for academic visualization, embedded via IFRAME in lecture notes. Use when the user requests interactive visualizations, educational widgets, demonstrations, simulations, or any standalone HTML-based academic content. Trigger phrases include "create an HTML widget", "build an interactive visualization", "make an IFRAME-embeddable demo", "HTML for lecture notes", or any request for educational web-based interactivity.
---

# HTML Builder - Academic Visualization Widgets
Create simple, focused HTML/JS widgets that complement and clarify lecture content through visualization and interaction.
Philosophy
Widgets are supplements, not replacements:

Visualize ONE concept clearly
Keep it simple and focused
No author credits, metadata, or unnecessary text
The surrounding lecture text provides context
The widget computes exactly what the chapter computes

Before You Build
A widget belongs to a chapter section. Read that section, its tutorial tasks and `_running_case.md` (if the project has one) first, and write a small test table: the chapter's worked example and cases with their inputs and expected outputs. Defaults, presets, slider ranges, conventions and names follow from it. Details: `references/functional-test.md`, sections 1–2.

Design System (THWS Brand)
Colors:

Primary: #ff6a00 (THWS Orange) - buttons, active states, highlights
Text: #333333 (Dark Grey)
Background: #ffffff (White)

Typography:
cssfont-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
File Structure
Single HTML file with embedded CSS and JavaScript:
html<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>[Short Widget Title]</title>
    <style>
        /* CSS here */
    </style>
</head>
<body>
    <!-- Content here -->
    <script>
        // JavaScript here
    </script>
</body>
</html>
Layout Requirements
Keep It Compact

Target height: 400-500px (fits well in IFRAME without scrolling)
Width: Responsive, but optimize for 700-800px

Minimal Styling
cssbody {
    margin: 0;
    padding: 20px;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    box-sizing: border-box;
}

.widget-container {
    max-width: 800px;
    margin: 0 auto;
}

button {
    background: #ff6a00;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 4px;
    cursor: pointer;
    font-weight: 600;
}

button:hover {
    opacity: 0.9;
}
Content Guidelines
What to Include

✅ Interactive visualization
✅ Minimal controls (sliders, buttons)
✅ Live feedback/results
✅ Brief labels (1-3 words)

What to Exclude

❌ Long explanatory text (that's in the lecture)
❌ Author credits, copyright notices
❌ "About this widget" sections
❌ Redundant titles (the lecture heading covers it)
❌ Instructions paragraphs (if controls are self-explanatory)

Text Language
One file serves every language. Never copy a widget to translate it.

All UI strings live in one `I18N` dictionary (`de`, `en`); elements carry `data-i18n="key"`
The language comes from the URL parameter `?lang=en`, else from `<html lang>`, else the course language
Numbers via `Intl.NumberFormat` (`de-DE`: 1.234,5 · `en-GB`: 1,234.5)
Case names, norm citations and units belong in the dictionary too
An English book embeds `widget-name.html?lang=en`; a translation adds an `en` block to the dictionary
Fill only the languages the course needs; the structure stays the same
Use minimal text - let interaction speak

Widget Patterns
Pattern 1: Parameter Explorer
Purpose: Show how changing parameters affects outcomes
html<!-- Slider + Live Chart -->
<div>
    <label>Zinssatz: <span id="rate">5</span>%</label>
    <input type="range" min="0" max="20" value="5" id="rateSlider">
    <canvas id="chart"></canvas>
</div>
Pattern 2: Process Visualization
Purpose: Show steps in a sequence
html<!-- Step-by-step with navigation -->
<div id="step-display"></div>
<button onclick="prevStep()">← Zurück</button>
<button onclick="nextStep()">Weiter →</button>
Pattern 3: Interactive Diagram
Purpose: Explore relationships
html<!-- Clickable elements that highlight connections -->
<svg id="diagram"></svg>
<div id="info"></div>
Technical Requirements
JavaScript

Use vanilla JS (no frameworks)
CDN libraries only if absolutely necessary
Keep code simple and readable
Put all calculations in pure functions between `// CALC START` and `// CALC END` (no DOM access), so they can be tested with node
Presets: one button per chapter case (worked example, running case), labelled with the chapter's case name

Canvas/SVG

Use Canvas for charts and animations
Use SVG for diagrams and networks
No external chart libraries unless essential

Responsiveness

Works in IFRAME context
No fixed pixel widths (use %, max-width)
Touch-friendly controls (mobile)

Output Format (CRITICAL)
Write the widget to a file (path from the caller or the project's widget folder, e.g. `widgets/kapitel-NN/` or `assets/chNN/`). If there is no file system, output one code block.

Single Code Block
```html
<!DOCTYPE html>
...entire widget...
</html>
```
Do NOT split the code. One continuous block from <!DOCTYPE> to </html>.
No explanations around the code. The only text after it is the short functional-test report (`references/functional-test.md`, section 5), including `FACT SHEET ADDITIONS` if `_running_case.md` exists.
Example: Simple Widget
html<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ROI</title>
    <style>
        body {
            margin: 0;
            padding: 20px;
            font-family: 'Inter', sans-serif;
        }
        .container {
            max-width: 700px;
            margin: 0 auto;
        }
        input[type="range"] {
            width: 100%;
            margin: 10px 0;
        }
        .presets button {
            background: white;
            color: #ff6a00;
            border: 1px solid #ff6a00;
            padding: 4px 12px;
            border-radius: 4px;
            cursor: pointer;
        }
        #result {
            font-size: 2rem;
            color: #ff6a00;
            font-weight: bold;
            margin: 20px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="presets">
            <button type="button" data-preset="ex31" data-i18n="ex31"></button>
            <button type="button" data-preset="task2" data-i18n="task2"></button>
        </div>

        <label><span data-i18n="investment"></span>: <span id="inv"></span> €</label>
        <input type="range" id="invSlider" min="1000" max="50000" value="10000" step="500">

        <label><span data-i18n="profit"></span>: <span id="profit"></span> €</label>
        <input type="range" id="profitSlider" min="0" max="10000" value="2000" step="50">

        <div id="result"></div>
    </div>

    <script>
        // CALC START
        function calc(p) {
            return { roi: p.profit / p.inv };
        }
        // CALC END

        const I18N = {
            de: { investment: 'Investition', profit: 'Gewinn', ex31: 'Beispiel 3.1', task2: 'Aufgabe 2' },
            en: { investment: 'Investment', profit: 'Profit', ex31: 'Example 3.1', task2: 'Task 2' }
        };
        const LANG = (new URLSearchParams(location.search).get('lang') || document.documentElement.lang || 'de').slice(0, 2);
        const T = I18N[LANG] || I18N.de;
        document.documentElement.lang = LANG;
        document.querySelectorAll('[data-i18n]').forEach(el => el.textContent = T[el.dataset.i18n]);
        const fmt = new Intl.NumberFormat(LANG === 'de' ? 'de-DE' : 'en-GB', { maximumFractionDigits: 1 });

        // Presets = the chapter's cases; defaults (HTML values) = Beispiel 3.1
        const PRESETS = { ex31: { inv: 10000, profit: 2000 }, task2: { inv: 24500, profit: 3150 } };

        const invSlider = document.getElementById('invSlider');
        const profitSlider = document.getElementById('profitSlider');

        function update() {
            const p = { inv: +invSlider.value, profit: +profitSlider.value };
            document.getElementById('inv').textContent = fmt.format(p.inv);
            document.getElementById('profit').textContent = fmt.format(p.profit);
            document.getElementById('result').textContent = 'ROI: ' + fmt.format(calc(p).roi * 100) + ' %';
        }

        document.querySelectorAll('[data-preset]').forEach(btn => btn.addEventListener('click', () => {
            const c = PRESETS[btn.dataset.preset];
            invSlider.value = c.inv;
            profitSlider.value = c.profit;
            update();
        }));
        invSlider.addEventListener('input', update);
        profitSlider.addEventListener('input', update);
        update();
    </script>
</body>
</html>
Quality Checklist
Before delivering a widget, verify both parts.

Form

✅ Compact (fits ~500px height)
✅ No author/metadata sections
✅ Minimal text (UI labels only)
✅ One clear purpose
✅ THWS orange for primary actions
✅ Single HTML file
✅ Works standalone in IFRAME
✅ All UI text in the `I18N` dictionary; `?lang=` switches it

Function (Funktionstest — `references/functional-test.md`)

✅ Defaults reproduce the chapter's worked example exactly (state the numbers checked)
✅ Placeholders, values and labels show the same default numbers
✅ Slider min/max/step cover every value in text, tutorial tasks and slides
✅ Presets for the chapter's cases
✅ Same conventions as the chapter: discrete vs. continuous, signs, percent vs. fraction, units, timing
✅ Same symbols, names and terms as the chapter and `_running_case.md`
✅ Norm citations and norm rules (floors, caps) checked against the original norm text
✅ Node test of the CALC functions with the chapter numbers passes
✅ Opened once in a browser: no console errors, presets and slider extremes work (or report that no browser tool was available)

Remember
Simplicity is key. The lecture text does the teaching - the widget just makes one concept visual and interactive, with the chapter's own numbers.