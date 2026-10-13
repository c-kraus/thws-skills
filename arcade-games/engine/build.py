#!/usr/bin/env python3
"""Build one standalone, bilingual (DE/EN) arcade game HTML.
Usage: build.py --type invaders|drop|hopper|maze|breakout --data data.js --out out.html
The data file must define:  const GAME_KEY = 'course-chNN-name';  const DATA = { en: {...}, de: {...} };
(see games/<type>.js header for the structure of DATA[lang])."""
import argparse, os
here = os.path.dirname(os.path.abspath(__file__))
ap = argparse.ArgumentParser()
ap.add_argument('--type', required=True, choices=['invaders', 'drop', 'hopper', 'maze', 'breakout'])
ap.add_argument('--data', required=True); ap.add_argument('--out', required=True)
a = ap.parse_args()
rd = lambda p: open(p, encoding='utf-8').read()
pads = {
 'lr': '<button data-k="left">◀</button><button data-k="fire">FIRE</button><button data-k="right">▶</button>',
 'all': '<button data-k="left">◀</button><button data-k="up">▲</button><button data-k="down">▼</button><button data-k="right">▶</button>'}
pad = {'invaders': 'lr', 'breakout': 'lr'}.get(a.type, 'all')
html = rd(os.path.join(here, 'template.html')).replace('{{PAD}}', pads[pad])
html = html.replace('{{DATA}}', rd(a.data)).replace('{{CORE}}', rd(os.path.join(here, 'core.js'))).replace('{{GAME}}', rd(os.path.join(here, 'games', a.type + '.js')))
os.makedirs(os.path.dirname(os.path.abspath(a.out)), exist_ok=True)
open(a.out, 'w', encoding='utf-8').write(html); print('wrote', a.out, len(html), 'bytes')
