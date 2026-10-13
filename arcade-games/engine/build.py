#!/usr/bin/env python3
"""Build one standalone arcade game HTML.
Usage: build.py --title "Game Title" --data data.js --game game.js --out out.html [--pad lr|all] [--keys "text"]
  --pad lr  : on-screen buttons LEFT / FIRE / RIGHT (shooter style)
  --pad all : LEFT / UP / DOWN / RIGHT
"""
import argparse, os
here = os.path.dirname(os.path.abspath(__file__))
ap = argparse.ArgumentParser()
ap.add_argument('--title', required=True); ap.add_argument('--data', required=True)
ap.add_argument('--game', required=True); ap.add_argument('--out', required=True)
ap.add_argument('--pad', default='all'); ap.add_argument('--keys', default='← → move · ↑ ↓ · SPACE')
a = ap.parse_args()
rd = lambda p: open(p, encoding='utf-8').read()
pads = {
 'lr': '<button data-k="left" aria-label="Move left">◀</button><button data-k="fire" aria-label="Fire">FIRE</button><button data-k="right" aria-label="Move right">▶</button>',
 'all': '<button data-k="left" aria-label="Move left">◀</button><button data-k="up" aria-label="Up">▲</button><button data-k="down" aria-label="Down">▼</button><button data-k="right" aria-label="Move right">▶</button>'}
html = rd(os.path.join(here, 'template.html')).replace('{{TITLE}}', a.title).replace('{{PAD}}', pads[a.pad]).replace('{{KEYS}}', a.keys)
html = html.replace('{{DATA}}', rd(a.data)).replace('{{CORE}}', rd(os.path.join(here, 'core.js'))).replace('{{GAME}}', rd(a.game))
os.makedirs(os.path.dirname(os.path.abspath(a.out)), exist_ok=True)
open(a.out, 'w', encoding='utf-8').write(html); print('wrote', a.out, len(html), 'bytes')
