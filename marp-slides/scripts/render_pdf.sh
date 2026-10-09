#!/bin/bash
# render_pdf.sh — rendert MARP-Dateien einzeln als PDF (marp erlaubt -o nicht bei mehreren Dateien).
# Aufruf: render_pdf.sh AUSGABEVERZEICHNIS datei1.md [datei2.md ...]
# Umgebung: THEME_DIR (Standard ~/.cache/thws-marp-theme), CHROME_PATH (Standard macOS-Chrome)
# Hängt ein Lauf (Browserstart), den Prozess beenden und einmal wiederholen.
set -e
OUT="$1"; shift
[ -n "$OUT" ] && [ $# -gt 0 ] || { echo "Aufruf: $0 AUSGABEVERZEICHNIS datei.md ..."; exit 1; }
THEME_DIR="${THEME_DIR:-$HOME/.cache/thws-marp-theme}"
[ -f "$THEME_DIR/thws-pr.css" ] || "$(dirname "$0")/fetch_theme.sh" "$THEME_DIR" >/dev/null
export CHROME_PATH="${CHROME_PATH:-/Applications/Google Chrome.app/Contents/MacOS/Google Chrome}"
mkdir -p "$OUT"; OUT="$(cd "$OUT" && pwd)"
for f in "$@"; do
  name="$(basename "${f%.md}").pdf"
  ( cd "$(dirname "$f")" && npx --no-install @marp-team/marp-cli --theme-set "$THEME_DIR" \
      --pdf --html --allow-local-files "$(basename "$f")" -o "$OUT/$name" )
  echo "→ $OUT/$name"
done
