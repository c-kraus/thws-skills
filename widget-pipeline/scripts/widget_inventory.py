# Widget-Inventar: verwaiste Widgets, fehlende Ziele, Kapitel-/Sprach-/Doppel-Hinweise
import re, sys, pathlib
root = pathlib.Path(sys.argv[1] if len(sys.argv) > 1 else '.').resolve()
SKIP = {'_site', '_book', '_freeze', 'archive', 'alt', 'node_modules'}
def ok(p): return not any(x in SKIP or x.startswith('.') for x in p.relative_to(root).parts)
def rel(p): return str(p.relative_to(root))
dirs = [d for d in root.iterdir() if d.is_dir() and d.name.lower() in ('widgets', 'assets')]
widgets = {rel(p): p for d in dirs for p in d.rglob('*.html') if ok(p)}
refs = {}                                   # Pfad wie im Quelltext geschrieben -> Fundstellen
for f in (p for e in ('*.qmd', '*.md') for p in root.rglob(e) if ok(p)):
    for m in re.finditer(r'''(?:src|href)=["']([^"'#?]+\.html)''', f.read_text(errors='ignore')):
        if not m.group(1).startswith(('http', '//')):
            t = (f.parent / m.group(1)).resolve()
            if t.is_relative_to(root):
                refs.setdefault(rel(t), set()).add(rel(f))
lower = {k.lower(): k for k in widgets}
for w in sorted(widgets):
    src = refs.get(w, set())
    case = [r for r in refs if r.lower() == w.lower() and r != w]   # nur Groß-/Kleinschreibung anders
    qmd = sorted(s for s in src | {x for r in case for x in refs[r]} if s.endswith('.qmd'))
    tag = 'OK' if src and qmd else 'CASE' if case else 'ONLY-MD' if src else 'ORPHAN'
    m = re.search(r'(?:kapitel-|ch)(\d+)', w)
    chaps = {int(n.group(1)) for q in qmd if (n := re.match(r'(\d+)_', pathlib.Path(q).name))}
    if tag == 'OK' and m and chaps and int(m.group(1)) not in chaps: tag = 'MOVED'
    print(f'{tag:8}', w, '<-', ', '.join(qmd or sorted(src)) or '-')
for r, src in sorted(refs.items()):
    if r not in widgets and r.lower() not in lower and not (root / r).exists():
        print(f'{"MISSING":8}', r, '<-', ', '.join(sorted(src)))
stems = {}
for w, p in widgets.items():
    stems.setdefault(re.sub(r'[-_](en|de)$', '', p.stem), []).append(w)
for k, ws in sorted(stems.items()):
    if len(ws) > 1:
        lang = any(re.search(r'[-_](en|de)\.html$', w) or re.search(r'/(en|de)/', w) for w in ws)
        print(f'{"LANGCOPY" if lang else "DUPLICATE":8}', ', '.join(sorted(ws)))
