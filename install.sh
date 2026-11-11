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

# Skills in claude-ai-only.txt sind nur über claude.ai aktiv (sonst doppelt)
ONLY_FILE="$REPO_DIR/claude-ai-only.txt"
is_claude_ai_only() {
  [ -f "$ONLY_FILE" ] && grep -v '^#' "$ONLY_FILE" | grep -qx "$1"
}

for skill_dir in "$REPO_DIR"/*/; do
  skill_name=$(basename "$skill_dir")
  [[ "$skill_name" == .* ]] && continue
  [[ "$skill_name" == *-workspace ]] && continue   # Eval-/Test-Workspaces sind keine Skills
  [ -f "$skill_dir/SKILL.md" ] || { echo "⚠️  $skill_name hat keine SKILL.md — übersprungen"; continue; }
  target="$SKILLS_DIR/$skill_name"
  if is_claude_ai_only "$skill_name"; then
    [ -L "$target" ] && rm "$target"
    echo "☁  $skill_name — nur claude.ai, nicht verlinkt"
    continue
  fi
  [ -L "$target" ] && rm "$target" && echo "↺  Update: $skill_name" || true
  [ -d "$target" ] && echo "⚠️  $skill_name existiert als Ordner — übersprungen" && continue
  ln -s "$skill_dir" "$target"
  echo "✓  $skill_name"
done

echo ""
echo "✅ Fertig."
