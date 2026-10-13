---
name: arcade-games
description: "Builds small arcade-style knowledge-check games (Space-Invaders, falling-cards sorter, Frogger-style river crossing) as standalone single-file HTML for e-learning gimmicks. Content comes from verified course material (chapters, slides, Moodle question banks); every item carries a short explanation. Output goes into a `Spiele/` folder of the course repo, NOT embedded in the chapters. Use when the user asks for 'Spiele', 'Arcade', 'Wissenskontrollspiel', 'Quiz-Spiel', 'Gamification', 'Gimmick fürs eLearning', or 'ein Spiel zu Kapitel X'."
---

# Arcade Games for Knowledge Checks

Retro-arcade mini-games that test a chapter's key ideas. One game = one self-contained `.html` file (no external dependencies, no server, no tracking), small enough to upload to Moodle or open from disk.

## Conventions (decided with the user)

- **Where:** a subfolder `Spiele/` in the course repo (create it), one file per game, named `NN_<short-name>.html` (e.g. `Spiele/04_deontology_invaders.html`). **Do not embed games into chapters or slides** and do not add them to the book project. They are optional extras ("Gimmick") that the user packs into the e-learning course by hand.
- The first three BUA1 games (chapters 1–3) are the exception: they sit in `BUA1/Widgets/kapitel-0N/` and are embedded; leave them as they are.
- **Language:** English only unless the user asks for a German/English switch. A language switch means: put all UI strings and item texts in a `{de:…, en:…}` structure and add a toggle button in the overlay; keep the item order identical in both languages.
- **Content:** only from verified course material (chapter text, deck, Moodle questions, teaching notes). Write each statement or item with a one-sentence explanation. No invented facts. Facts that are only partly verified do not go into a game.
- **Quality:** no time pressure beyond slow, readable movement; slow mode and pause; keyboard plus on-screen buttons; sound off by default; high score only in `localStorage` (wrapped in try/catch).

## Files

- `engine/template.html`: page shell (screen, feedback line, on-screen pad, toggles).
- `engine/core.js`: shared engine (input, sound, storage, HUD, overlays, end screen with review list, main loop).
- `engine/build.py`: `python3 engine/build.py --title "…" --data data.js --game game.js --out Spiele/NN_name.html [--pad lr|all] [--keys "…"]`
- `examples/`: three finished games (data + game logic): `invaders_*` (true/false shooter), `drop_*` (cards fall into lanes; several levels), `hopper_*` (river crossing: hop onto the correct log; rounds of ordering or classifying).

## Game contract (what a `game.js` must define)

```js
const GAME = { hsKey:'<course>-chNN-<name>', title:'…', subtitle:'…', rules:'<ul class="rules">…</ul>' };
function startGame(){ resetRun(); run.state='play'; /* init */ }
function update(dt){ /* only called while run.state==='play' */ }
function draw(dt){ /* background is already painted; draw the game; hud(score, mid, lives) last */ }
```

Helpers from `core.js`: `award(points)`, `penalize(item, explanation)`, `setMsg('good'|'bad'|'info', text)`, `endRun(won, subtitle)` (shows score, accuracy, review list of mistakes), `keys`, `took('left'|'right'|'up'|'down'|'fire')`, `wrap`, `box`, `text`, `shuffle`, `speedF()` (slow mode factor), `MONO`, `COL`. The data file defines plain arrays (`STATEMENTS`, `LEVELS`, `STATIONS`, …).

## Choosing the mechanic

| Content type | Game |
|---|---|
| Statements to judge true/false, misconceptions | invaders |
| Items to classify (types, categories, theories, debit/credit) | drop |
| Steps in order, or situation → category | hopper |
| End of course | combine items from several chapters in one of the above |

## Workflow

1. Read the chapter, the deck and the Moodle questions of the chapter; pick 15–30 items that are unambiguous. For true/false, aim for equal numbers of true and false. Every item gets an explanation that teaches.
2. Write `data.js` (and, if needed, adapt a copy of an example `game.js`), build into `Spiele/`.
3. Test without real-time play (browser pane tabs can be hidden, so `requestAnimationFrame` may stand still): load the file, call `startGame()` and drive `update(dt)`/`draw()` in a loop with a scripted perfect player and a scripted bad player; both must reach the end screen with no console errors. Look at one screenshot per game. Real-time feel and touch need a manual try-out by the user: say so.
4. Commit (the course repo); do not touch the chapters. Report the items for proofreading.
