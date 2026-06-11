#!/bin/bash
# install.sh — Verlinkt alle Skills dieses Repos in ~/.claude/skills/
set -e

SKILLS_DIR="$HOME/.claude/skills"
REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Migration: falls ~/.claude/skills noch ein Symlink ist
if [ -L "$SKILLS_DIR" ]; then
  echo "⚠️  ~/.claude/skills ist ein Symlink — wird zu echtem Ordner konvertiert..."
  rm "$SKILLS_DIR"
  mkdir -p "$SKILLS_DIR"
fi

mkdir -p "$SKILLS_DIR"

for skill_dir in "$REPO_DIR"/*/; do
  skill_name=$(basename "$skill_dir")
  [[ "$skill_name" == .* ]] && continue
  [[ "$skill_name" == *-workspace ]] && continue   # Eval-/Test-Workspaces sind keine Skills
  [ -f "$skill_dir/SKILL.md" ] || { echo "⚠️  $skill_name hat keine SKILL.md — übersprungen"; continue; }
  target="$SKILLS_DIR/$skill_name"
  [ -L "$target" ] && rm "$target" && echo "↺  Update: $skill_name" || true
  [ -d "$target" ] && echo "⚠️  $skill_name existiert als Ordner — übersprungen" && continue
  ln -s "$skill_dir" "$target"
  echo "✓  $skill_name"
done

echo ""
echo "✅ Fertig."
