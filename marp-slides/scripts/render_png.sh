#!/bin/bash
# render_png.sh — rendert jede Folie einer MARP-Datei als PNG (deck.001.png, deck.002.png, ...) zur Sichtprüfung.
# Aufruf: render_png.sh AUSGABEVERZEICHNIS datei1.md [datei2.md ...]
# Umgebung: THEME_DIR (Standard ~/.cache/thws-marp-theme), CHROME_PATH (Standard macOS-Chrome)
# Ausgabe pro Deck in AUSGABEVERZEICHNIS/<deckname>/ (vorher geleert). Nicht ins Repo schreiben (Scratch-Verzeichnis nutzen).
# Hängt ein Lauf (Browserstart), wird nur dieser Lauf nach RENDER_TIMEOUT Sekunden (Standard 100) beendet und einmal wiederholt.
OUT="$1"; shift
[ -n "$OUT" ] && [ $# -gt 0 ] || { echo "Aufruf: $0 AUSGABEVERZEICHNIS datei.md ..."; exit 1; }
THEME_DIR="${THEME_DIR:-$HOME/.cache/thws-marp-theme}"
[ -f "$THEME_DIR/thws-pr.css" ] || "$(dirname "$0")/fetch_theme.sh" "$THEME_DIR" >/dev/null
export CHROME_PATH="${CHROME_PATH:-/Applications/Google Chrome.app/Contents/MacOS/Google Chrome}"
mkdir -p "$OUT"; OUT="$(cd "$OUT" && pwd)"
kill_tree() { for c in $(pgrep -P "$1"); do kill_tree "$c"; done; kill "$1" 2>/dev/null; }
render_one() {  # $1 Deck, $2 Zielordner, $3 Name
  ( cd "$(dirname "$1")" && exec npx --no-install @marp-team/marp-cli --theme-set "$THEME_DIR" \
      --images png --html --allow-local-files "$(basename "$1")" -o "$2/$3.png" ) >/dev/null 2>&1 &
  pid=$!
  ( sleep "${RENDER_TIMEOUT:-100}"; kill_tree "$pid" ) &
  watcher=$!
  wait "$pid"; rc=$?
  kill_tree "$watcher"; wait "$watcher" 2>/dev/null
  return $rc
}
for f in "$@"; do
  name="$(basename "${f%.md}")"; dir="$OUT/$name"
  rm -rf "$dir"; mkdir -p "$dir"
  render_one "$f" "$dir" "$name" || { echo "Zeitüberschreitung oder Fehler, zweiter Versuch ..."; rm -f "$dir"/*.png; render_one "$f" "$dir" "$name"; }
  n=$(ls "$dir" | grep -c '\.png$')
  [ "$n" -gt 0 ] && echo "→ $dir/ ($n Folien)" || { echo "FEHLER: keine PNGs für $f erzeugt"; exit 1; }
done
