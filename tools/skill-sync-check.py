#!/usr/bin/env python3
"""Vergleicht die lokalen Skills (Git-Repos, verlinkt in ~/.claude/skills)
mit den eigenen Skills in claude.ai.

Die Desktop-App spiegelt claude.ai-Skills nach
~/Library/Application Support/Claude/local-agent-mode-sessions/skills-plugin/…
(manifest.json + skills/<name>/). Diese Kopie ist die Vergleichsbasis.

Aufruf:
  skill-sync-check.py          Bericht über alle Skills
  skill-sync-check.py --hook   nur Abweichungen, still wenn alles gleich ist
                               (für den SessionStart-Hook von Claude Code)
  skill-sync-check.py --all    zusätzlich Skills, die nur lokal existieren

Ausnahmen: Skill-Namen (einer pro Zeile) in ~/.claude/skill-sync-ignore.
"""
import datetime as dt
import glob
import hashlib
import json
import os
import subprocess
import sys

HOME = os.path.expanduser("~")
LOCAL_DIR = os.path.join(HOME, ".claude", "skills")
CACHE_GLOB = os.path.join(
    HOME, "Library", "Application Support", "Claude",
    "local-agent-mode-sessions", "skills-plugin", "*", "*")
IGNORE_FILE = os.path.join(HOME, ".claude", "skill-sync-ignore")
REPO_DIR = os.path.dirname(os.path.dirname(os.path.realpath(__file__)))
# Skills, die nur über claude.ai aktiv sind (nicht in ~/.claude/skills verlinkt);
# verglichen wird dann direkt der Ordner im Repo.
CLAUDE_AI_ONLY_FILE = os.path.join(REPO_DIR, "claude-ai-only.txt")
SKIP_NAMES = {".git", ".DS_Store", "__pycache__", ".claude-plugin"}


def tree_hash(root):
    """Hash über relative Pfade und Inhalte aller Dateien eines Skills."""
    h = hashlib.sha256()
    for dirpath, dirnames, filenames in os.walk(root, followlinks=True):
        dirnames[:] = sorted(d for d in dirnames
                             if d not in SKIP_NAMES and not d.endswith("-workspace"))
        for name in sorted(filenames):
            if name in SKIP_NAMES or name.endswith(".pyc"):
                continue
            path = os.path.join(dirpath, name)
            h.update(os.path.relpath(path, root).encode())
            with open(path, "rb") as f:
                h.update(hashlib.sha256(f.read()).digest())
    return h.hexdigest()


def latest_cache():
    """Das zuletzt aktualisierte claude.ai-Spiegelverzeichnis."""
    best = None
    for d in glob.glob(CACHE_GLOB):
        try:
            with open(os.path.join(d, "manifest.json")) as f:
                manifest = json.load(f)
        except (OSError, ValueError):
            continue
        if best is None or manifest.get("lastUpdated", 0) > best[1].get("lastUpdated", 0):
            best = (d, manifest)
    return best


def local_change_time(path):
    """Zeitpunkt der letzten Änderung im Repo; uncommittete Änderungen = jetzt."""
    real = os.path.realpath(path)
    try:
        dirty = subprocess.run(["git", "-C", real, "status", "--porcelain", "--", "."],
                               capture_output=True, text=True, timeout=10).stdout.strip()
        if dirty:
            return dt.datetime.now(dt.timezone.utc), True
        out = subprocess.run(["git", "-C", real, "log", "-1", "--format=%cI", "--", "."],
                             capture_output=True, text=True, timeout=10).stdout.strip()
        if out:
            return dt.datetime.fromisoformat(out), False
    except (OSError, subprocess.SubprocessError):
        pass
    return dt.datetime.fromtimestamp(os.path.getmtime(real), dt.timezone.utc), False


def main():
    hook = "--hook" in sys.argv
    show_local_only = "--all" in sys.argv

    found = latest_cache()
    if not found:
        if not hook:
            print("Keine claude.ai-Skill-Kopie der Desktop-App gefunden.")
        return
    cache_dir, manifest = found
    cache_date = dt.datetime.fromtimestamp(manifest.get("lastUpdated", 0) / 1000)

    ignore = set()
    if os.path.exists(IGNORE_FILE):
        with open(IGNORE_FILE) as f:
            ignore = {l.strip() for l in f if l.strip() and not l.startswith("#")}

    remote = {s["name"]: s for s in manifest.get("skills", [])
              if s.get("creatorType") == "user" and s.get("enabled", True)
              and s["name"] not in ignore}
    local = {n: os.path.join(LOCAL_DIR, n) for n in os.listdir(LOCAL_DIR)
             if n not in ignore and os.path.isfile(os.path.join(LOCAL_DIR, n, "SKILL.md"))}
    if os.path.exists(CLAUDE_AI_ONLY_FILE):
        with open(CLAUDE_AI_ONLY_FILE) as f:
            for n in (l.strip() for l in f):
                if n and not n.startswith("#") and n not in ignore and n not in local \
                        and os.path.isfile(os.path.join(REPO_DIR, n, "SKILL.md")):
                    local[n] = os.path.join(REPO_DIR, n)

    rows = []
    for name in sorted(set(remote) | set(local)):
        r, l = remote.get(name), local.get(name)
        r_path = os.path.join(cache_dir, "skills", name)
        if r and not l:
            rows.append((name, "nur claude.ai", "ins Repo holen"))
        elif l and not r:
            if show_local_only:
                rows.append((name, "nur lokal", "bei Bedarf hochladen"))
        elif not os.path.isdir(r_path):
            rows.append((name, "claude.ai-Kopie fehlt", "Desktop-App neu synchronisieren"))
        elif tree_hash(l) == tree_hash(r_path):
            if not hook:
                rows.append((name, "gleich", ""))
        else:
            r_time = dt.datetime.fromisoformat(r["updatedAt"].replace("Z", "+00:00"))
            l_time, dirty = local_change_time(l)
            if r_time > l_time:
                rows.append((name, "claude.ai neuer", "ins Repo holen"))
            else:
                state = "Repo neuer (uncommittet)" if dirty else "Repo neuer"
                rows.append((name, state, "nach claude.ai hochladen"))

    drift = [r for r in rows if r[1] not in ("gleich", "nur lokal")]
    if hook and not drift:
        return

    if hook:
        print(f"Skill-Drift zwischen Repos und claude.ai (Stand der claude.ai-Kopie: "
              f"{cache_date:%d.%m.%Y %H:%M}):")
    else:
        print(f"claude.ai-Kopie: {cache_dir}\nStand: {cache_date:%d.%m.%Y %H:%M}\n")
    width = max((len(r[0]) for r in rows), default=10)
    for name, state, action in rows if not hook else drift:
        print(f"  {name:<{width}}  {state:<26} {action}")
    if hook:
        print("Abgleich: Repo ist maßgeblich. Weise den Nutzer kurz darauf hin.")


if __name__ == "__main__":
    main()
