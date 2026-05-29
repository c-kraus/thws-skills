---
name: quarto-book-setup
description: "Converts a collection of standalone Quarto lecture files (.qmd) into a Quarto book project with GitHub Actions deployment to GitHub Pages. Use this skill when the user says 'turn this into a book', 'set up a quarto book project', 'add github actions to my quarto files', 'combine my chapters into a book', 'deploy my lecture to github pages', or similar. The skill scans existing .qmd files, proposes a chapter structure, asks short intake questions (directory, repo URL, format, title), then writes _quarto.yml, patches .qmd files (removes front YAML that causes duplicate titles), installs the chosen extension (moodle-html or uninovis-html), writes the GitHub Actions workflow, and updates .gitignore."
---

# Quarto Book Setup

Converts a folder of standalone Quarto lecture files into a deployable Quarto book project — with THWS or UNINOVIS branding and GitHub Actions publish-to-Pages workflow.

The hard-won fixes (inline SVG logo, scroll behaviour, widget iframe resize) are already baked into the extensions. This skill wires everything together.

---

## Step 1 — Scan the directory

Read the working directory. Find all `.qmd` files (exclude `index.qmd` — handled separately).

For each `.qmd` found, extract:
- The `title:` from its YAML frontmatter (if any)
- The first H1 or H2 heading as a fallback title
- Whether it has front YAML at all

Print a proposed chapter structure:

```
Found 9 .qmd files. Proposed book structure:

  index.qmd         → Preface / Introduction
  chapter1.qmd      → [extracted title or heading]
  chapter2.qmd      → [extracted title or heading]
  ...

Does this structure look right? If you want to reorder, rename, split into parts,
or exclude a file, tell me now. Otherwise I'll use this as-is.
```

Wait for confirmation or edits before proceeding.

---

## Step 2 — Intake: four questions

Ask all four in one message:

1. **Directory:** "Should I set up the book project in the current directory, or in a new folder? If a new folder, what should it be called?"

2. **Format:** "Which extension format?
   - `moodle-html` — THWS branding (teal header, THWS logo)
   - `uninovis-html` — UNINOVIS branding (Core Blue #4E6470 header, UNINOVIS+THWS logo, node pattern in sidebar)"

3. **GitHub repo URL:** "What is the GitHub repository URL? (e.g. `https://github.com/username/repo`) — needed for the sidebar repo link and Actions deployment."

4. **Title and author:** "Book title, subtitle (optional), and author name?"

If the user is already in the project directory, default to "current directory" and say so.

Use the chosen format (referred to as `[FORMAT]` below) throughout all following steps.

---

## Step 3 — Write `_quarto.yml`

Use this template (adapt chapter structure, title, author, repo URL, and format):

```yaml
project:
  type: book
  output-dir: _site

lang: de
number-sections: true

book:
  title: "[Book Title]"
  subtitle: "[Subtitle]"
  author: "[Author]"
  date: "last-modified"
  chapters:
    - index.qmd
    - part: [Part 1 Title]
      chapters:
        - chapter1.qmd
        - chapter2.qmd
    - part: [Part 2 Title]
      chapters:
        - chapter3.qmd

  sidebar:
    style: docked
    background: light
    collapse-level: 1
    search: true
  repo-url: [GitHub URL]
  repo-actions: [issue]

format:
  [FORMAT]

execute:
  echo: false
  warning: false
```

**Parts:** Omit `part:` structure if there is only one logical group of chapters.

**`index.qmd`:** If it doesn't exist, create a minimal one:
```markdown
# Preface {.unnumbered}

Welcome to [Book Title].
```

---

## Step 4 — Strip front YAML from chapter files

**Why:** When Quarto renders a book, chapter titles come from `_quarto.yml` and the first heading. If a chapter also has `title:` in its YAML frontmatter, the title appears **twice** in the rendered HTML.

**Fix:** Remove the entire `---` frontmatter block from every chapter `.qmd` that has one. Preserve all content below it exactly.

For each file with front YAML:
1. Read the file
2. Identify the opening `---` … `---` block
3. Remove it entirely (including both delimiter lines)
4. Save the file
5. Note it in the final report

**Exception:** `index.qmd` may keep frontmatter if it contains `{.unnumbered}` or other book-specific metadata.

---

## Step 5 — Install the extension

The chosen format requires an extension. Check whether it already exists:

| Format | Expected path |
|---|---|
| `moodle-html` | `_extensions/c-kraus/moodle/` |
| `uninovis-html` | `_extensions/c-kraus/uninovis/` |

**If the extension directory exists:** Skip installation.

**If it does not exist:** Ask the user:

> "The `[FORMAT]` format requires an extension I don't see here. Options:
> 1. Copy it from another project (give me the path)
> 2. Install it via `quarto add` — run `quarto add c-kraus/uninovis_quarto` (uninovis) or `quarto add c-kraus/thws_quarto` (moodle) in your terminal
>
> Which do you prefer?"

If the user provides a source path: copy the entire extension directory.

**No further patching needed.** Both extensions already ship with:
- Inline SVG logo (no broken image on GitHub Pages)
- `addEventListener('scroll')` + `window.pageYOffset` (robust scroll handling)
- `#custom-header img, #custom-header svg` selectors (correct logo sizing)
- Widget iframe auto-resize via `postMessage`

---

## Step 6 — GitHub Actions workflow

Create `.github/workflows/publish.yml`:

```yaml
name: Quarto Publish HTML

on:
  push:
    branches: main
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build-deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Check out repository
        uses: actions/checkout@v4

      - name: Set up Quarto
        uses: quarto-dev/quarto-actions/setup@v2

      - name: Render Quarto Project
        uses: quarto-dev/quarto-actions/render@v2
        with:
          to: [FORMAT]
          path: book

      - name: Setup Pages
        uses: actions/configure-pages@v5

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: 'book/_site'

      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

Replace `[FORMAT]` with `moodle-html` or `uninovis-html` as chosen.

**Note on `path: book`:** If the `.qmd` files are in the repo root (not a `book/` subfolder), remove the `path: book` line and change `path: 'book/_site'` to `path: '_site'`.

Create `.github/workflows/` directories as needed.

---

## Step 7 — Update `.gitignore`

Ensure these entries are present (add any that are missing):

```
/.quarto/
/_site/
/_book/
.DS_Store
.ipynb_checkpoints/
__pycache__/
/.luarc.json
excalidraw.log
```

---

## Step 8 — Final report

```
## Quarto Book Setup — Complete

### Files created / modified
- _quarto.yml ✓ (book structure, [N] chapters, [FORMAT] format)
- index.qmd ✓ [created / already existed]
- .github/workflows/publish.yml ✓
- .gitignore ✓ [created / updated]

### Chapter files patched (front YAML removed)
- chapter1.qmd — removed YAML block
- chapter2.qmd — removed YAML block
- ... (N files total)

### Extension
- [FORMAT] extension [installed from path / already present]

### Next steps
1. Enable GitHub Pages in your repo:
   Settings → Pages → Source: GitHub Actions
2. Run `quarto render` locally to verify output
3. Commit and push — the Action will deploy automatically

### Known GitHub requirement
The Actions workflow needs Pages set to "GitHub Actions" source
(not "Deploy from branch"). Do this once in repo settings before pushing.
```

---

## Pitfalls Reference

| Pitfall | Symptom | Fix |
|---|---|---|
| Front YAML in chapter files | Chapter title appears twice in rendered HTML | Remove `---` frontmatter block from each chapter (Step 4) |
| `excalidraw.log` committed | Unrelated binary blob pollutes the repo | Add to `.gitignore` |
| `output-dir: _book` vs `_site` | GitHub Pages Action uploads wrong folder | Use `_site` and match in `path: 'book/_site'` |
| `quarto-dev/quarto-actions/render@v2` with no `to:` | Renders to default format, not the branded extension | Always set `to: [FORMAT]` explicitly |
| Dynamic `img src` in JS pointing to extension assets | Image missing on GitHub Pages with `self-contained: true` | Embed as base64 via Lua filter at render time (already done in uninovis extension) |
