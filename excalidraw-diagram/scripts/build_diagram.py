#!/usr/bin/env python3
"""
build_diagram.py — Kompakte Diagramm-Spec → valides .excalidraw-JSON.

Löst die zwei chronischen Probleme handgeschriebener Excalidraw-JSONs:
1. Textbreite wird GEMESSEN (fontFamily 3 = Monospace), Boxen werden
   automatisch auf Textmaß + Padding dimensioniert — kein Overflow, kein
   Padding-Gefrickel.
2. Labels werden als GEBUNDENE Text-Elemente erzeugt (containerId +
   boundElements) und zusätzlich exakt zentriert positioniert — der
   Renderer kann nichts mehr falsch ausrichten.

Aufruf:
    python build_diagram.py spec.json [-o out.excalidraw]

Spec-Format (JSON):
{
  "elements": [
    {"kind": "box",     "id": "a", "x": 100, "y": 100, "label": "Aktiva\nMittelverwendung",
     "role": "primary", "shape": "rectangle"},          # shape: rectangle|ellipse|diamond
    {"kind": "text",    "x": 100, "y": 40, "text": "Die Bilanzgleichung",
     "level": "title"},                                  # level: title|subtitle|body
    {"kind": "arrow",   "from": "a", "to": "b", "label": "führt zu"},
    {"kind": "line",    "points": [[100,300],[500,300]], "dashed": true},
    {"kind": "dot",     "x": 200, "y": 300}
  ]
}

Optionale Felder:
  box:   "w"/"h" (Mindestmaße — werden vergrößert, falls Text nicht passt),
         "fontSize" (default 16), "fill"/"stroke" (überschreiben role)
  text:  "fontSize" überschreibt level-Default, "color" überschreibt level-Farbe,
         "align" (left|center, default left)
  arrow: "fromSide"/"toSide" ("top|bottom|left|right" — Anker auf der Boxseite
             statt Auto-Routing Zentrum→Zentrum),
         "shift" (px, verschiebt beide Anker entlang ihrer Seite — DER Mechanismus
             für Gegenrichtungs-Pfeile zwischen denselben Boxen, s.u.),
         "points" (explizite Wegpunkte — ABSOLUTE Canvas-Koordinaten; die interne
             Relativierung übernimmt der Generator),
         "color", "dashed", "strokeWidth"
  line:  "color", "strokeWidth"

Rezept — bidirektionale Pfeile (Delegation runter, Information hoch):
  {"kind":"arrow","from":"vorstand","to":"bereich","fromSide":"bottom","toSide":"top",
   "shift":-45,"label":"delegiert"},
  {"kind":"arrow","from":"bereich","to":"vorstand","fromSide":"top","toSide":"bottom",
   "shift":45,"dashed":true,"label":"berichtet"}
  → beide Pfeile laufen parallel versetzt, nichts überlappt, keine points-Mathematik.

Rollen (Fill/Stroke aus references/color-palette.md, THWS):
  primary, secondary, tertiary, start, end, warning, decision, ai,
  inactive (gestrichelt), error, evidence (dunkler Code-Block)
"""
import argparse, json, math, random, sys, time
from pathlib import Path

# ---------------------------------------------------------------- Konstanten
ROLES = {
    "primary":   ("#fff0e0", "#ff6a00"),
    "secondary": ("#ffe0c2", "#cc5500"),
    "tertiary":  ("#fdf2e9", "#b34700"),
    "start":     ("#fed7aa", "#c2410c"),
    "end":       ("#a7f3d0", "#047857"),
    "warning":   ("#fee2e2", "#dc2626"),
    "decision":  ("#fef3c7", "#b45309"),
    "ai":        ("#ddd6fe", "#6d28d9"),
    "inactive":  ("#f1f5f9", "#94a3b8"),
    "error":     ("#fecaca", "#b91c1c"),
    "evidence":  ("#1e293b", "#1e293b"),
}
TEXT_LEVELS = {  # level -> (fontSize, color)
    "title":    (28, "#cc5500"),
    "subtitle": (20, "#ff6a00"),
    "body":     (16, "#64748b"),
}
TEXT_ON_LIGHT, TEXT_ON_DARK = "#333333", "#ffffff"
# fontFamily 3 (Code/Monospace): empirische Excalidraw-Metriken
CHAR_W = 0.60   # Zeichenbreite ≈ 0.60 × fontSize
LINE_H = 1.25   # Zeilenhöhe   ≈ 1.25 × fontSize
PAD_X, PAD_Y = 18, 12   # Box-Innenabstand

_rng = random.Random(42)

def _seed():
    return _rng.randint(10_000_000, 99_999_999)

def _now_ms():
    return int(time.time() * 1000)

def measure(text, font_size):
    """(width, height) eines mehrzeiligen Texts in fontFamily 3."""
    lines = text.split("\n")
    w = max((len(l) for l in lines), default=1) * CHAR_W * font_size
    h = len(lines) * LINE_H * font_size
    return math.ceil(w), math.ceil(h)

def base(el_type, x, y, w, h, **over):
    e = {
        "id": over.pop("id", f"{el_type}_{_seed()}"),
        "type": el_type,
        "x": x, "y": y, "width": w, "height": h,
        "angle": 0,
        "strokeColor": "#1e1e1e",
        "backgroundColor": "transparent",
        "fillStyle": "solid",
        "strokeWidth": 2,
        "strokeStyle": "solid",
        "roughness": 0,
        "opacity": 100,
        "groupIds": [],
        "frameId": None,
        "roundness": None,
        "seed": _seed(),
        "version": 1,
        "versionNonce": _seed(),
        "isDeleted": False,
        "boundElements": [],
        "updated": _now_ms(),
        "link": None,
        "locked": False,
    }
    e.update(over)
    return e

def text_el(x, y, text, font_size, color, container_id=None, align="left", width=None):
    w, h = measure(text, font_size)
    w = width or w
    e = base("text", x, y, w, h,
             strokeColor=color,
             text=text, originalText=text,
             fontSize=font_size, fontFamily=3,
             textAlign="center" if container_id else align,
             verticalAlign="middle" if container_id else "top",
             containerId=container_id,
             lineHeight=LINE_H,
             baseline=round(h - 0.25 * font_size))
    e["boundElements"] = None
    return e

# ---------------------------------------------------------------- Builder
def build(spec):
    elements, by_id, errors = [], {}, []

    # Pass 1: Shapes, freier Text, Linien, Dots
    for s in spec.get("elements", []):
        kind = s.get("kind")
        if kind == "box":
            label = s.get("label", "")
            fs = s.get("fontSize", 16)
            shape = s.get("shape", "rectangle")
            tw, th = measure(label, fs) if label else (0, 0)
            # Diamant/Ellipse brauchen mehr Raum um denselben Text
            factor = 1.6 if shape in ("diamond", "ellipse") else 1.0
            w = max(s.get("w", 0), math.ceil(tw * factor) + 2 * PAD_X)
            h = max(s.get("h", 0), math.ceil(th * factor) + 2 * PAD_Y)
            fill, stroke = ROLES.get(s.get("role", "primary"), ROLES["primary"])
            fill = s.get("fill", fill); stroke = s.get("stroke", stroke)
            el = base(shape, s["x"], s["y"], w, h,
                      id=s.get("id") or f"box_{_seed()}",
                      strokeColor=stroke, backgroundColor=fill,
                      strokeStyle="dashed" if s.get("role") == "inactive" else "solid",
                      roundness={"type": 3} if shape == "rectangle" else None)
            if label:
                tcolor = TEXT_ON_DARK if s.get("role") == "evidence" else s.get("textColor", TEXT_ON_LIGHT)
                tx = el["x"] + (w - tw) / 2
                ty = el["y"] + (h - th) / 2
                t = text_el(tx, ty, label, fs, tcolor, container_id=el["id"])
                el["boundElements"].append({"id": t["id"], "type": "text"})
                elements.append(el); elements.append(t)
            else:
                elements.append(el)
            by_id[el["id"]] = el
        elif kind == "text":
            lvl = TEXT_LEVELS.get(s.get("level", "body"), TEXT_LEVELS["body"])
            fs = s.get("fontSize", lvl[0]); color = s.get("color", lvl[1])
            elements.append(text_el(s["x"], s["y"], s["text"], fs, color,
                                    align=s.get("align", "left")))
        elif kind == "line":
            pts = s["points"]
            xs, ys = [p[0] for p in pts], [p[1] for p in pts]
            x0, y0 = min(xs), min(ys)
            el = base("line", x0, y0, max(xs) - x0, max(ys) - y0,
                      strokeColor=s.get("color", "#64748b"),
                      strokeWidth=s.get("strokeWidth", 1),
                      strokeStyle="dashed" if s.get("dashed") else "solid",
                      points=[[p[0] - x0, p[1] - y0] for p in pts],
                      lastCommittedPoint=None,
                      startBinding=None, endBinding=None,
                      startArrowhead=None, endArrowhead=None)
            elements.append(el)
        elif kind == "dot":
            r = s.get("r", 7)
            el = base("ellipse", s["x"] - r, s["y"] - r, 2 * r, 2 * r,
                      strokeColor="#ff6a00", backgroundColor="#ff6a00")
            elements.append(el)
        elif kind == "arrow":
            pass  # Pass 2
        else:
            errors.append(f"Unbekannter kind: {kind!r}")

    # Pass 2: Pfeile (brauchen die Shape-Geometrie)
    def border_anchor(el, towards):
        """Punkt auf dem Rand von el in Richtung des Punkts `towards`."""
        cx, cy = el["x"] + el["width"] / 2, el["y"] + el["height"] / 2
        dx, dy = towards[0] - cx, towards[1] - cy
        if dx == dy == 0:
            return cx, cy
        sx = (el["width"] / 2) / abs(dx) if dx else math.inf
        sy = (el["height"] / 2) / abs(dy) if dy else math.inf
        t = min(sx, sy)
        return cx + dx * t, cy + dy * t

    def side_anchor(el, side, shift=0):
        """Mittelpunkt der genannten Boxseite, optional entlang der Seite verschoben."""
        x, y, w, h = el["x"], el["y"], el["width"], el["height"]
        return {
            "top":    (x + w / 2 + shift, y),
            "bottom": (x + w / 2 + shift, y + h),
            "left":   (x, y + h / 2 + shift),
            "right":  (x + w, y + h / 2 + shift),
        }[side]

    for s in spec.get("elements", []):
        if s.get("kind") != "arrow":
            continue
        src, dst = by_id.get(s.get("from")), by_id.get(s.get("to"))
        shift = s.get("shift", 0)
        if s.get("points"):
            pts = [list(p) for p in s["points"]]  # absolute Canvas-Koordinaten
        elif src and dst and (s.get("fromSide") or s.get("toSide")):
            start = side_anchor(src, s.get("fromSide", "bottom"), shift)
            end = side_anchor(dst, s.get("toSide", "top"), shift)
            pts = [list(start), list(end)]
        elif src and dst:
            scx = (src["x"] + src["width"] / 2, src["y"] + src["height"] / 2)
            dcx = (dst["x"] + dst["width"] / 2, dst["y"] + dst["height"] / 2)
            start = border_anchor(src, dcx)
            end = border_anchor(dst, scx)
            pts = [list(start), list(end)]
        else:
            errors.append(f"Arrow {s.get('from')}→{s.get('to')}: Quelle/Ziel fehlt")
            continue
        x0, y0 = min(p[0] for p in pts), min(p[1] for p in pts)
        color = s.get("color") or (src and src["strokeColor"]) or "#ff6a00"
        arr = base("arrow", x0, y0,
                   max(p[0] for p in pts) - x0, max(p[1] for p in pts) - y0,
                   id=s.get("id") or f"arrow_{_seed()}",
                   strokeColor=color,
                   strokeWidth=s.get("strokeWidth", 2),
                   strokeStyle="dashed" if s.get("dashed") else "solid",
                   points=[[p[0] - x0, p[1] - y0] for p in pts],
                   lastCommittedPoint=None,
                   startBinding={"elementId": src["id"], "focus": 0, "gap": 4} if src else None,
                   endBinding={"elementId": dst["id"], "focus": 0, "gap": 4} if dst else None,
                   startArrowhead=None, endArrowhead="arrow")
        if src: src["boundElements"].append({"id": arr["id"], "type": "arrow"})
        if dst: dst["boundElements"].append({"id": arr["id"], "type": "arrow"})
        if s.get("label"):
            fs = s.get("fontSize", 14)
            mx = (pts[0][0] + pts[-1][0]) / 2
            my = (pts[0][1] + pts[-1][1]) / 2
            tw, th = measure(s["label"], fs)
            t = text_el(mx - tw / 2, my - th / 2, s["label"], fs, "#64748b",
                        container_id=arr["id"])
            arr["boundElements"] = [{"id": t["id"], "type": "text"}]
            elements.append(arr); elements.append(t)
        else:
            elements.append(arr)

    doc = {
        "type": "excalidraw",
        "version": 2,
        "source": "https://excalidraw.com",
        "elements": elements,
        "appState": {"viewBackgroundColor": spec.get("background", "#ffffff"),
                     "gridSize": 20},
        "files": {},
    }
    return doc, errors

# ---------------------------------------------------------------- Checks
def sanity(doc):
    """Strukturelle Selbstprüfung — gibt Befundliste zurück."""
    issues = []
    ids = {e["id"] for e in doc["elements"]}
    for e in doc["elements"]:
        if e["type"] == "text" and e.get("containerId"):
            if e["containerId"] not in ids:
                issues.append(f"Text {e['id']}: containerId {e['containerId']} existiert nicht")
        for b in (e.get("boundElements") or []):
            if b["id"] not in ids:
                issues.append(f"{e['id']}: boundElement {b['id']} existiert nicht")
        if e["type"] == "arrow":
            for side in ("startBinding", "endBinding"):
                bind = e.get(side)
                if bind and bind["elementId"] not in ids:
                    issues.append(f"Arrow {e['id']}: {side} auf fehlendes Element")
    # Text-in-Box-Überlauf (darf nach Auto-Sizing nie auftreten)
    by_id = {e["id"]: e for e in doc["elements"]}
    for e in doc["elements"]:
        if e["type"] == "text" and e.get("containerId") in by_id:
            c = by_id[e["containerId"]]
            if c["type"] in ("rectangle",) and (e["width"] > c["width"] or e["height"] > c["height"]):
                issues.append(f"Text {e['id']} überläuft Container {c['id']}")
    return issues

# ---------------------------------------------------------------- CLI
if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("spec")
    ap.add_argument("-o", "--out", default=None)
    args = ap.parse_args()
    spec = json.loads(Path(args.spec).read_text(encoding="utf-8"))
    doc, errors = build(spec)
    issues = sanity(doc)
    out = Path(args.out or Path(args.spec).with_suffix(".excalidraw"))
    out.write_text(json.dumps(doc, ensure_ascii=False, indent=1), encoding="utf-8")
    print(f"✓ {out} — {len(doc['elements'])} Elemente")
    for msg in errors + issues:
        print(f"⚠️ {msg}")
    sys.exit(1 if errors else 0)
