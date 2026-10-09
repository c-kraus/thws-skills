#!/bin/bash
# fetch_theme.sh — lädt das THWS-MARP-Theme (thws.css, thws-pr.css) in ein lokales Verzeichnis.
# Aufruf: fetch_theme.sh [ZIELVERZEICHNIS]   (Standard: ~/.cache/thws-marp-theme)
set -e
DIR="${1:-$HOME/.cache/thws-marp-theme}"
BASE="https://raw.githubusercontent.com/c-kraus/thws/refs/heads/main"
mkdir -p "$DIR"
for f in thws.css thws-pr.css; do
  curl -sSfL -o "$DIR/$f" "$BASE/$f"
done
echo "$DIR"
