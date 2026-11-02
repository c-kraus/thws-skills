# Functional Test (Funktionstest)

A widget is done when it computes what the chapter computes. Design checks (compact, orange, single file) never caught a wrong number. Every error below shipped in a real course because nobody compared the widget with its chapter:

| Error that shipped | Check that catches it |
|---|---|
| EPS widget weighted shares with wrong monthly weights | worked example reproduced exactly |
| Impairment allocation without the IAS 36.105 floor | norm rule (floor/cap) built in and tested with a case that hits it |
| Fixed-cost share off by a factor of 100 | percent vs. fraction checked at the default |
| Revaluation computed from the wrong carrying amount | base of every calculation matches the chapter |
| Missing minus sign in an IFRS 16 ratio | sign convention matches the chapter |
| Input placeholders different from the default values | placeholder = value = chapter number |
| Binomial widget compared the option with S₀ − X instead of V₀ − X | the compared quantity is the chapter's |
| Continuous compounding where the chapter discounts discretely | discrete vs. continuous matches |
| No input for the cost of waiting, so the chapter's case could not be set | every case parameter is an input |
| Convertible-bond slider ended at 5,000, the text needs 10,000 | slider ranges cover every value in text and tasks |
| Rate slider in 0.5 % steps, 13.2 % could not be set | step allows every exact value |
| Projects named A–D while the chapter uses other names | names and symbols match |
| Widget text said "risk" where the chapter means "variance" | terms match |
| IFRS 18.B46(b) instead of B47(c) inside a widget | norm citations checked like text citations |
| Trainer with wrong puttable/fixed-for-fixed logic, orphaned after the topic moved | widget is embedded where its topic now lives |

## 1. Before building: collect the test cases

Read, in this order:

1. `_running_case.md` (if it exists in the project root): use only its numbers, dates, persons, company and terms (e.g. "management board"), course-wide parameters (risk-free rate, tax rate, FX) and notation. Introduce nothing new silently; list any new value under `FACT SHEET ADDITIONS` in your report.
2. The chapter section the widget belongs to: the worked example(s), formulas, symbols, sign and rounding conventions.
3. The tutorial tasks on this section (`tutorials/tut_NN_*.qmd`) and the slides, if they use the widget or its numbers.

Write a short test table before writing code:

| Case | Inputs (from chapter/tutorial) | Expected outputs (from chapter) | Source |
|---|---|---|---|
| Default = worked example | e.g. V₀ = 100, cost of waiting = 8, X = 95, σ = 22.3 %, r_f = 2.5 %, T = 1 | option 9.76; build now +5 | ch. 10, worked example |
| Preset 2 = running case | e.g. Kessler Plant 2 values | 22.99 | ch. 10, case |
| Tutorial task | values of Tutorial N, Task M | its solution | tut_10 |
| Edge case | a case that hits a floor/cap/zero (e.g. IAS 36.105) | per norm | norm text |

If the chapter has no worked example for the widget, compute the expected values independently (Python or by hand) and say so. If chapter and your independent calculation disagree, report it; do not silently match the widget to a wrong chapter.

## 2. Build rules that follow from the test table

- **Defaults** reproduce the chapter's worked example exactly; the `value`, the placeholder and the displayed label all show the same number.
- **Slider min/max/step** cover every value used in the chapter text, the tutorial tasks and the slides (e.g. max 10,000 if a task needs 10,000; step 0.1 % if 13.2 % occurs). Where exact values matter, add a number input next to the slider.
- **Presets**: one button per case the chapter or tutorial uses (worked example, running case, notable tutorial case), labelled with the chapter's case name.
- **Every case parameter is an input** — if the chapter's case has a parameter (cost of waiting, residual value, tax rate), the widget must let the reader set it.
- **Same conventions as the chapter**: discrete vs. continuous compounding, sign conventions (outflows negative or not), percent vs. fraction, units (€ thousand vs. € million), timing (beginning vs. end of period, number of months), rounding (compute unrounded, display rounded).
- **Same notation and names**: symbols (V₀, I, X, r_f), project/company/person names, terms ("variance", not "risk", if the chapter says variance).
- **Norm citations** inside the widget (labels, tooltips, result texts) are checked like text citations: against the original norm text (ifrs.org, gesetze-im-internet.de) first, then the course wiki; paragraph and letter must be exact (B47(c), not B46(b)).
- **Norm rules** that bound a result (floors, caps, thresholds, "the lower of") are implemented and covered by an edge-case test.

## 3. Headless test of the calculation (node)

Keep all calculation logic in pure functions between the markers `// CALC START` and `// CALC END` (no DOM access). Then test them with the chapter numbers:

```bash
cat > /tmp/widget_test.js <<'EOF'
const fs = require('fs');
const html = fs.readFileSync(process.argv[2], 'utf8');
const code = html.split('// CALC START')[1].split('// CALC END')[0];
const calc = new Function(code + '; return calc;')();
const cases = [
  // [name, inputs, expected outputs, tolerance]
  ['worked example', { V0: 100, wait: 8, X: 95, sigma: 0.223, rf: 0.025, T: 1 }, { option: 9.76 }, 0.005],
];
let ok = true;
for (const [name, p, exp, tol] of cases) {
  const out = calc(p);
  for (const k in exp) {
    const pass = Math.abs(out[k] - exp[k]) <= tol;
    ok = ok && pass;
    console.log(`${pass ? 'PASS' : 'FAIL'} ${name} ${k}: widget ${out[k]} expected ${exp[k]}`);
  }
}
process.exit(ok ? 0 : 1);
EOF
node /tmp/widget_test.js path/to/widget.html
```

Use the scratchpad directory instead of `/tmp` if the session has one. Tolerance: half a unit of the chapter's last displayed digit. For an existing widget without markers, test in the browser instead (`javascript_tool`/`browser_evaluate`: set the inputs, dispatch `input` events, read the result elements).

## 4. Browser check (once, before reporting done)

Serve the widget folder locally (`python3 -m http.server 8765 --bind 127.0.0.1`, run in the background) and open `http://127.0.0.1:8765/<widget>.html` with whatever browser tool the session has (Claude Browser pane, Playwright, Chrome extension). A `file://` URL may render as a static snapshot without JavaScript. Check, e.g. with a `javascript_tool` call that clicks the presets and reads the result elements:

- no console errors;
- defaults show the expected numbers from the test table;
- each preset loads its case and shows its expected result;
- each slider at min and max: no `NaN`, `Infinity`, overflowing text or broken chart;
- `?lang=en` (and `?lang=de`) if the widget is bilingual: every visible string switches, numbers use the right decimal separator;
- the layout fits an iframe of about 800 px width.

If no browser tool is available, say so in the report ("browser check: not run, no browser tool") — never claim it.

## 5. Report

End with a short block (in the language of the request):

```markdown
Functional test — widget-<name>.html
| Case | Expected | Widget | |
|---|---|---|---|
| Default = Project P (ch. 10) | 9.76 | 9.76 | ✅ |
| Preset Kessler Plant 2 | 22.99 | 22.99 | ✅ |
| Slider ranges cover text/tasks | 0–15 %, step 0.1 | ok | ✅ |
| Conventions (discrete, signs, names) | as chapter | ok | ✅ |
| Norm citations | IFRS 18.B47(c) | ok | ✅ |
Node test: 6/6 PASS · Browser check: done, no console errors

FACT SHEET ADDITIONS
- (new values not yet in _running_case.md, or "none")
```
