---
name: arcade-games
description: "Builds small arcade-style knowledge-check games (Space-Invaders shooter, falling-cards sorter, Frogger river crossing, Pac-Man maze, Breakout, timing meter) as standalone single-file bilingual (German/English) HTML for e-learning gimmicks. Content comes from verified course material (chapters, slides, Moodle question banks); every item carries a short explanation. Output goes into a `Spiele/` folder of the course repo, NOT embedded in the chapters. Use when the user asks for 'Spiele', 'Arcade', 'Wissenskontrollspiel', 'Quiz-Spiel', 'Gamification', 'Gimmick fürs eLearning', or 'ein Spiel zu Kapitel X'."
---

# Arcade Games for Knowledge Checks (engine v2, bilingual)

Retro-arcade mini-games that test a chapter's key ideas. One game = one self-contained `.html` file (no external dependencies, no server, no tracking), small enough to upload to Moodle or open from disk. German and English in the same file with a language button (default: browser language, remembered in `localStorage`).

## Conventions (decided with the user)

- **Where:** subfolder `Spiele/` in the course repo, one file per game, named `NN_<topic>_<type>.html` (e.g. `Spiele/04_deontologie_invaders.html`). Keep the sources (data files) in `Spiele/_src/NN_<topic>.data.js`. **Do not embed games into chapters or slides** and do not add them to a book project. They are optional extras ("Gimmick") that the user packs into the e-learning course by hand.
- The first three BUA1 games (chapters 1–3, English only, engine v1) sit in `BUA1/Widgets/kapitel-0N/` and are embedded; leave them as they are.
- **Content:** only from verified course material (chapter text, deck, Moodle questions, teaching notes). Each item has a one-sentence explanation in both languages. No invented facts; facts that are only partly verified do not go into a game. German and English items must correspond one-to-one (same order and structure); write each language naturally.
- **Quality:** no time pressure beyond slow, readable movement; slow mode and pause; keyboard plus on-screen buttons; sound off by default; high score only in `localStorage` (wrapped in try/catch).

## Files

- `engine/template.html`, `engine/core.js`: page shell and shared engine (input, sound, storage, HUD, overlays, language switch, end screen with review list, main loop).
- `engine/games/{invaders,drop,hopper,maze,breakout}.js`: the five mechanics. Each contains the generic strings in both languages (`GT`) and the structure of the data it expects (header comment).
- `engine/build.py`: `python3 engine/build.py --type invaders|drop|hopper|maze|breakout|meter --data Spiele/_src/NN_x.data.js --out Spiele/NN_x_type.html`
- `examples/sample_*.js`: minimal bilingual data fixtures for each type (test content, not course content).

## Data file contract

```js
const GAME_KEY = 'werte-ch04-invaders';          // high-score key, unique per game
const DATA = { en: { title, subtitle, keys, ...content }, de: { title, subtitle, keys, ...content } };
```
`keys` is the short control hint shown under the board. Content by type:

| type | `DATA[lang]` content |
|---|---|
| invaders | `statements: [[text, isTrue, why], ...]` (>= 9 true and >= 9 false; text <= ~110 characters) |
| drop | `levels: [{ name, lanes: ['A','B',...] (2–5), items: [[card, laneIndex, why], ...] (>= 8) }]` (1–3 levels) |
| hopper | `rounds: [{ name, rows: [{ prompt, options: [{label, ok, why}, ...] (>= 3, exactly one ok) }] (6–8 rows) }]` |
| maze | `rounds: [{ target, items: [{label, ok, why}, ...] (4–5 ok + 4–6 wrong, <= 12, labels <= 22 characters) }]` (3 rounds) |
| meter | `axis: ['TOO LITTLE','TOO MUCH']`, `rounds: [{ situation, mean: 0-4, options: [{label, why} x5] }]` (>= 8 rounds, `mean` varied across rounds; a marker swings over the 5 zones and is stopped; neighbouring zone = "close") |
| breakout | `prompts: [{ prompt, options: [{label, ok, why}, ...] (>= 4, exactly one ok) }]` (>= 8) |

## Choosing the mechanic

| Content type | Game |
|---|---|
| Statements to judge true/false, misconceptions | invaders |
| Items to classify into categories | drop |
| Steps in order, or situation → category | hopper |
| Collect everything that fits a category, avoid the rest | maze |
| Match a question or definition to the right answer | breakout |
| Find the appropriate degree between too little and too much (virtue as the mean, proportionate response) | meter |
| End of course | invaders with statements from all chapters ("Boss Level") |

## Workflow

1. Read the chapter, the deck, the Moodle questions and the teaching note (verified facts) of the chapter; pick unambiguous items. Every item gets an explanation that teaches.
2. Write the data file with both languages, build into `Spiele/`.
3. Test without real-time play (a browser pane tab can be hidden, so `requestAnimationFrame` may stand still): load the file, call `startGame()` and drive `update(dt)` and `draw()` in a loop with a scripted perfect player and a scripted bad player (see the per-type hints below); both must reach the end screen with no console errors. Also click the language button and check that the title changes. Look at one screenshot per game. Real-time feel and touch need a manual try-out by the user: say so.
   - invaders: aim the ship under the first false card and fire; bad player never fires.
   - drop: set `lane = card.lane` (perfect) or another lane (bad).
   - hopper: set `frog.x` to the centre of the ok log (`logX(row, log.k) + LOG_W/2`) and set `pressed.up = true` before each `update`; skip steps when the log is off-screen.
   - maze: BFS path to the next ok item avoiding wrong items (call `tryMove` with `moveCd = 0`); the engine guarantees that wrong items can be avoided.
   - meter: set `phase` so that the marker is over the mean zone (`phase = Math.asin((zoneCentre - W/2)/(W/2-14))`), set `pressed.fire = true`, call `update`; call `update(2)` to move to the next round.
   - breakout: `launch()` once, then teleport the ball under the target brick; the bad player targets wrong bricks.
4. Commit in the course repo (only `Spiele/`); do not touch chapters. Report the items for proofreading.
