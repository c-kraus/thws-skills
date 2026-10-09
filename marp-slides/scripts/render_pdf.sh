#!/bin/bash
# render_pdf.sh — rendert MARP-Dateien einzeln als PDF (marp erlaubt -o nicht bei mehreren Dateien).
# Aufruf: render_pdf.sh AUSGABEVERZEICHNIS datei1.md [datei2.md ...]
# Umgebung: THEME_DIR (Standard ~/.cache/thws-marp-theme), CHROME_PATH (Standard macOS-Chrome)
# Hängt ein Lauf (Browserstart), wird er nach RENDER_TIMEOUT Sekunden (Standard 100) beendet und einmal wiederholt.
set -e
OUT="$1"; shift
[ -n "$OUT" ] && [ $# -gt 0 ] || { echo "Aufruf: $0 AUSGABEVERZEICHNIS datei.md ..."; exit 1; }
THEME_DIR="${THEME_DIR:-$HOME/.cache/thws-marp-theme}"
[ -f "$THEME_DIR/thws-pr.css" ] || "$(dirname "$0")/fetch_theme.sh" "$THEME_DIR" >/dev/null
export CHROME_PATH="${CHROME_PATH:-/Applications/Google Chrome.app/Contents/MacOS/Google Chrome}"
mkdir -p "$OUT"; OUT="$(cd "$OUT" && pwd)"
render_one() {
  ( cd "$(dirname "$1")" && npx --no-install @marp-team/marp-cli --theme-set "$THEME_DIR" \
      --pdf --html --allow-local-files "$(basename "$1")" -o "$OUT/$2" ) &
  pid=$!
  ( sleep "${RENDER_TIMEOUT:-100}"; pkill -f "marp-cli" 2>/dev/null; pkill -f "bin/marp" 2>/dev/null ) &
  watcher=$!
  wait $pid; rc=$?
  kill $watcher 2>/dev/null
  return $rc
}
for f in "$@"; do
  name="$(basename "${f%.md}").pdf"
  rm -f "$OUT/$name"
  render_one "$f" "$name" || { echo "Zeitüberschreitung oder Fehler, zweiter Versuch ..."; render_one "$f" "$name"; }
  [ -s "$OUT/$name" ] && echo "→ $OUT/$name" || { echo "FEHLER: $OUT/$name wurde nicht erzeugt"; exit 1; }
done
