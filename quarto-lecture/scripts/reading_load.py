#!/usr/bin/env python3
"""Umfang, Element-Dichte und Lesezeit eines Quarto-Kapitels.

Aufruf: python3 -I reading_load.py KAPITEL.qmd [...] [--budget MINUTEN] [--l1]

--budget: Selbststudienzeit pro Kapitel; Urteil nach L2-Lesezeit, mit --l1 nach L1.

Wörter = alles, was Studierende lesen (Fließtext, Callouts, Deep Dives, Fälle,
Quick-Checks); ohne YAML, Kommentare, Code, Display-Mathe, iframes, Div-Zäune.
Elemente = flip-card, drag-exercise, quick-check, case-study, widget, video.
Lesezeit = Wörter / 120 (Zweitsprache) bzw. / 150 (Erstsprache) + 3 min je Element.
"""
import re
import sys

ELEMENTS = r'flip-card|drag-exercise|quick-check|case-study|widget|video'


def measure(path):
    t = open(path, encoding='utf-8').read()
    t = re.sub(r'\A---\n.*?\n---\n', '', t, flags=re.S)
    t = re.sub(r'<!--.*?-->', '', t, flags=re.S)
    t = re.sub(r'```.*?```', '', t, flags=re.S)
    t = re.sub(r'\$\$.*?\$\$', '', t, flags=re.S)
    t = re.sub(r'<iframe.*?</iframe>', '', t, flags=re.S)
    el = len(re.findall(r'^:::+ *\{\.(?:' + ELEMENTS + r')\b', t, flags=re.M))
    t = re.sub(r'^:::.*$', '', t, flags=re.M)
    words = len(re.findall(r"[^\W_][\w.,'’-]*", t))
    return words, el


def main(argv):
    budget = None
    native = '--l1' in argv
    argv = [a for a in argv if a != '--l1']
    if '--budget' in argv:
        i = argv.index('--budget')
        budget = float(argv[i + 1])
        argv = argv[:i] + argv[i + 2:]
    if not argv:
        sys.exit(__doc__)
    for f in argv:
        w, el = measure(f)
        l2, l1 = w / 120 + 3 * el, w / 150 + 3 * el
        dens = 'Dichte ok' if el and 400 <= w / el <= 600 else 'Dichte prüfen'
        line = (f"{f}: {w} Wörter · {el} Elemente · 1 je {w // max(el, 1)} Wörter · "
                f"{dens} · Lesezeit ≈ {l2:.0f} min (L2) / {l1:.0f} min (L1)")
        if budget is not None:
            need = l1 if native else l2
            verdict = 'passt' if need <= budget else 'ZU LANG'
            line += f" · Budget {budget:.0f} min → {verdict}"
        print(line)


if __name__ == '__main__':
    main(sys.argv[1:])
