---
name: quarto-book-setup
description: "Converts a collection of standalone Quarto lecture files (.qmd) into a Quarto book project with GitHub Actions deployment to GitHub Pages. Use this skill when the user says 'turn this into a book', 'set up a quarto book project', 'add github actions to my quarto files', 'combine my chapters into a book', 'deploy my lecture to github pages', or similar. The skill scans existing .qmd files, proposes a chapter structure, asks three short questions (directory, repo URL, format), then writes _quarto.yml, patches .qmd files (removes front YAML that causes duplicate titles), adds the moodle-html extension with inline-SVG logo fix, writes the GitHub Actions workflow, and updates .gitignore."
---

# Quarto Book Setup

Converts a folder of standalone Quarto lecture files into a deployable Quarto book project — with THWS branding, moodle-html format, and GitHub Actions publish-to-Pages workflow.

This skill encodes hard-won lessons from the BUA3 project: the absolute-path logo bug, the CSS `img vs svg` issue with inline SVGs, the front-YAML-causes-duplicate-title problem, and the three-layer header positioning bug (z-index conflict, timing, Quarto JS override). Don't let the next project discover those the hard way.

---

## Step 1 — Scan the directory

Read the working directory. Find all `.qmd` files (exclude `index.qmd` for now — we'll handle it separately).

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

## Step 2 — Intake: three questions

Ask all three in one message (don't split into separate rounds):

1. **Directory:** "Should I set up the book project in the current directory, or in a new folder? If a new folder, what should it be called?"

2. **GitHub repo URL:** "What is the GitHub repository URL? (e.g. `https://github.com/username/repo`) — needed for the sidebar repo link and Actions deployment."

3. **Title and author:** "Book title, subtitle (optional), and author name?"

If the user is already in the project directory and `.qmd` files are there, default to "current directory" and say so.

---

## Step 3 — Write `_quarto.yml`

Use this template (adapt to the confirmed chapter structure, title, author, and repo URL):

```yaml
project:
  type: book
  output-dir: _site

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
    style: "docked"
    background: light
    collapse-level: 1
    search: true
  repo-url: [GitHub URL]
  repo-actions: [issue]

format:
  moodle-html

execute:
  echo: false
  warning: false
```

**Parts:** If there is only one logical group of chapters (no natural split), omit the `part:` structure and list chapters directly. If the user proposed parts in Step 2, use those.

**`index.qmd`:** If it doesn't exist, create a minimal one:
```markdown
# Preface {.unnumbered}

Welcome to [Book Title].
```

---

## Step 4 — Strip front YAML from chapter files

**Why:** When Quarto renders a book, chapter titles come from `_quarto.yml` and the first heading in the file. If a chapter also has `title:` in its own YAML frontmatter, the title appears **twice** in the rendered HTML — once from the YAML and once from the heading.

**Fix:** Remove the entire `---` frontmatter block from every chapter `.qmd` that has one. Preserve all content below it exactly.

For each file with front YAML:
1. Read the file
2. Identify the opening `---` ... `---` block
3. Remove it entirely (including both delimiter lines)
4. Save the file
5. Note the file in the report

**Exception:** `index.qmd` may keep frontmatter if it has `{.unnumbered}` or other book-specific metadata — check and keep if appropriate.

---

## Step 5 — Set up the moodle-html extension

Check whether `_extensions/c-kraus/moodle/` already exists in the project directory.

**If it exists:** Skip this step (don't overwrite).

**If it does not exist:** Tell the user:

> "The moodle-html format requires the `_extensions/c-kraus/moodle/` extension. I don't see it here. Options:
> 1. Copy it from another project (give me the path)
> 2. Skip moodle-html and use `html` format instead (simpler, no THWS branding)
>
> Which do you prefer?"

If the user provides a source path: copy the entire `_extensions/c-kraus/moodle/` directory.

Then apply the logo fix (Step 5a) regardless of whether you just copied it or it was already there.

### Step 5a — Logo fix (inline SVG)

**Why this is needed:** Quarto copies extension assets to `_site/_extensions/...`. When `inject-header.lua` references `logo_en.svg` via a relative path from the Lua script, the browser tries to load it relative to the HTML page URL — which doesn't match the `_site/_extensions/...` path. The fix is to read the SVG at render time and embed it inline in the HTML.

Check `inject-header.lua`. If it already reads and inlines the SVG (look for `f:read("*all")` and `svg_content`), it's already fixed — skip.

If it uses an `<img src="...">` tag or any external path reference, replace it with the correct inline-SVG pattern below.

**This is the canonical, fully-debugged version.** Three non-obvious bugs are baked into it — see the Pitfalls table at the bottom for the reasoning behind each decision:

```lua
local function inject_header(doc)
  local ext_dir = pandoc.path.directory(PANDOC_SCRIPT_FILE)
  local logo_path = pandoc.path.join({ext_dir, "logo_en.svg"})

  -- Read and inline the SVG so no external path is needed in the browser
  local svg_content = ""
  local f = io.open(logo_path, "r")
  if f then
    svg_content = f:read("*all")
    f:close()
  end

  local header_html = '<div id="custom-header">' .. svg_content .. '</div>\n' ..
    '<script>\n' ..
    '(function() {\n' ..
    '  var h  = document.getElementById("custom-header");\n' ..
    '  var qh = document.getElementById("quarto-header");\n' ..
    '\n' ..
    '  function updatePositions() {\n' ..
    '    if (!h) return;\n' ..
    '    var thwsH = h.offsetHeight;\n' ..
    '    if (qh) qh.style.top = thwsH + "px";\n' ..
    '    var totalH = thwsH + (qh ? qh.offsetHeight : 0);\n' ..
    '    document.body.style.marginTop = totalH + "px";\n' ..
    '    document.documentElement.style.setProperty("--sidebar-top", totalH + "px");\n' ..
    '  }\n' ..
    '\n' ..
    '  if (document.readyState === "loading") {\n' ..
    '    document.addEventListener("DOMContentLoaded", updatePositions);\n' ..
    '  } else {\n' ..
    '    updatePositions();\n' ..
    '  }\n' ..
    '  window.addEventListener("load", updatePositions);\n' ..
    '\n' ..
    '  window.onscroll = function() {\n' ..
    '    var scrolled = document.body.scrollTop > 50 || document.documentElement.scrollTop > 50;\n' ..
    '    h.classList.toggle("shrink", scrolled);\n' ..
    '    requestAnimationFrame(updatePositions);\n' ..
    '  };\n' ..
    '})();\n' ..
    '</script>\n'

  local header_block = pandoc.RawBlock("html", header_html)
  local blocks = pandoc.List{header_block}
  blocks:extend(doc.blocks)
  return pandoc.Pandoc(pandoc.Blocks(blocks), doc.meta)
end

return { { Pandoc = inject_header } }
```

### Step 5b — CSS fixes for inline SVG sizing and header stacking

**Why (SVG sizing):** The SCSS file targets `#custom-header img` for logo sizing. When the logo is an inline `<svg>` element (not an `<img>`), those rules don't apply and the SVG defaults to 100% container width — making it enormous.

**Why (z-index):** Bootstrap sets `#quarto-header` (the secondary nav shown on mobile/tablet) to `z-index: 1030`. The THWS banner must be `1031` or higher, otherwise the Quarto nav appears on top of it.

**Why (sidebar top via CSS custom property):** The sticky sidebars need `top` equal to the combined height of all fixed headers. Setting `style.top` directly via JS doesn't work because Quarto's own sidebar JS resets it afterward. The fix is a CSS custom property (`--sidebar-top`) set by JS, with `!important` in the stylesheet so the CSS rule wins over Quarto's JS.

Open `thws-styles.scss` and ensure these rules are present:

```scss
// Sidebars must sit below the fixed THWS header — JS sets this variable
#quarto-sidebar,
#quarto-margin-sidebar {
  top: var(--sidebar-top, 85px) !important;
}

// Header Bar
#custom-header {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 1031;          // must be > Bootstrap's 1030
  background-color: $_teal;
  width: 100vw;
  padding: 0.5em;
  transition: all 0.2s ease-in-out;
}

#custom-header img,
#custom-header svg {
  height: 4em;
  width: auto;
  margin-left: 2em;
  transition: transform 0.2s ease-in-out;
}

#custom-header.shrink {
  height: 3.2em;
  padding: 0.2em;
}

#custom-header.shrink img,
#custom-header.shrink svg {
  transform: scale(0.8);
  margin-top: -0.5em;
}

body {
  margin-top: 6em;        // JS overrides this dynamically via updatePositions()
}

html {
  scroll-padding-top: 7em;
}
```

If `z-index: 1031` and `var(--sidebar-top)` are already present, skip.

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
          to: moodle-html

      - name: Setup Pages
        uses: actions/configure-pages@v5

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: '_site'

      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

**Note:** If the user chose `html` format instead of `moodle-html` in Step 5, change `to: moodle-html` to `to: html`.

Create `.github/workflows/` directories as needed.

---

## Step 7 — Update `.gitignore`

Ensure these entries are present in `.gitignore` (add any that are missing):

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

If `.gitignore` doesn't exist, create it with all entries above.

---

## Step 8 — Final report

Present a summary of everything done:

```
## Quarto Book Setup — Complete

### Files created / modified
- _quarto.yml ✓ (book structure, [N] chapters, moodle-html format)
- index.qmd ✓ [created / already existed]
- .github/workflows/publish.yml ✓
- .gitignore ✓ [created / updated]

### Chapter files patched (front YAML removed)
- chapter1.qmd — removed YAML block
- chapter2.qmd — removed YAML block
- ... (N files total)

### Extension fixes applied
- inject-header.lua — inline SVG logo fix [applied / already correct]
- thws-styles.scss — svg selector added [applied / already correct]

### Next steps
1. Enable GitHub Pages in your repo:
   Settings → Pages → Source: GitHub Actions
2. Run `quarto render` locally to verify output
3. Commit and push — the Action will deploy automatically

### Known GitHub requirement
The Actions workflow needs Pages to be set to "GitHub Actions" source
(not "Deploy from branch"). Do this once in your repo settings before pushing.
```

---

## Pitfalls Reference

These are real bugs encountered in the BUA3 project — check for them proactively:

| Pitfall | Symptom | Fix |
|---|---|---|
| `<img src="logo.svg">` in Lua filter | Logo renders locally but is broken on GitHub Pages | Inline the SVG with `f:read("*all")` |
| `#custom-header img` only in SCSS | Inline SVG is enormous (defaults to 100% width) | Add `#custom-header svg` to all logo size rules |
| Front YAML in chapter files | Chapter title appears twice in rendered HTML | Remove `---` frontmatter block from each chapter |
| `excalidraw.log` committed | Unrelated binary blob pollutes the repo | Add to `.gitignore` |
| `output-dir: _book` vs `_site` | GitHub Pages Action uploads wrong folder | Use `_site` and match in `path: '_site'` |
| `quarto-dev/quarto-actions/render@v2` with no `to:` | Renders to default format, not moodle-html | Add `to: moodle-html` explicitly |
| `z-index: 1000` on `#custom-header` | On mobile/tablet, Quarto's breadcrumb nav (z-index 1030) appears on top of THWS banner | Use `z-index: 1031`; push `#quarto-header` down via JS (`qh.style.top = thwsH + "px"`) |
| Calling `updatePositions()` immediately in inline script | `h.offsetHeight` is 0 at parse time → sidebars get `top: 0px` | Fire on `DOMContentLoaded` + `load` event instead |
| Setting sidebar `style.top` directly in JS | Quarto's own sidebar JS resets it back to 0 afterward | Use CSS custom property `--sidebar-top` on `:root` with `!important` in stylesheet — stylesheet `!important` beats Quarto's inline JS |
| `pandoc.Pandoc(blocks, doc.meta)` with `pandoc.List` | Lua LSP type warning (not runtime error, but noisy) | Cast: `pandoc.Pandoc(pandoc.Blocks(blocks), doc.meta)` |
