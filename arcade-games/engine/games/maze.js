/* Maze: Pac-Man-style. Walk through the maze and collect only the items that fit the target; wrong items cost a life.
   DATA[lang] = { title, subtitle, keys, rounds: [ { target: 'VALUES', items: [ {label, ok:true|false, why}, ... ] } ] }
   Per round 4-5 ok items and 4-6 wrong items (<= 12 items, labels <= 22 characters). 3 rounds. */
const GT = {
  en: { rules: '<ul class="rules"><li>Walk through the maze with the arrow keys.</li><li>Each round names a <b>target</b>. Collect <b>only the items that fit it</b>.</li><li>Collecting a wrong item costs a life and shows why it does not fit.</li><li>Collect all matching items to finish the round. 3 rounds, 3 lives.</li><li>Keys: ← → ↑ ↓ move. On a phone use the buttons.</li></ul>',
        round:'ROUND', collect:'COLLECT', left:'left', start: t => 'Collect: ' + t, winSub:'All rounds cleared. Bonus: 100 per life left.', loseSub: n => 'Round ' + n + ' of 3', wrongPre:'✖ ', rightPre:'✔ ' },
  de: { rules: '<ul class="rules"><li>Laufe mit den Pfeiltasten durch das Labyrinth.</li><li>Jede Runde nennt ein <b>Ziel</b>. Sammle <b>nur, was dazu passt</b>.</li><li>Ein falscher Gegenstand kostet ein Leben und zeigt, warum er nicht passt.</li><li>Sammle alle passenden Gegenstände, um die Runde zu beenden. 3 Runden, 3 Leben.</li><li>Tasten: ← → ↑ ↓ bewegen. Am Handy die Knöpfe nutzen.</li></ul>',
        round:'RUNDE', collect:'SAMMLE', left:'übrig', start: t => 'Sammle: ' + t, winSub:'Alle Runden geschafft. Bonus: 100 pro übriges Leben.', loseSub: n => 'Runde ' + n + ' von 3', wrongPre:'✖ ', rightPre:'✔ ' }
};
const COLS = 8, ROWS = 5, CW = 80, CH = 72, OY = 36;
const LAYOUT = ['...#....', '.#.#.##.', '.#...#..', '...#.#.#', '.#...#..'];   // '#' = wall
const open = (c, r) => c >= 0 && c < COLS && r >= 0 && r < ROWS && LAYOUT[r][c] !== '#';
let ri, items, pos, moveCd, targetObj, dots, banner;
function startGame(){ resetRun(); run.state = 'play'; ri = 0; loadRound(); }
function openCells(){ const out = []; for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) if (open(c, r)) out.push([c, r]); return out; }
function loadRound(){
  const R = D().rounds[ri]; targetObj = R;
  pos = {c: 0, r: 2, x: 0 * CW + CW/2, y: OY + 2 * CH + CH/2}; moveCd = 0;
  const list = R.items.slice(0, 12); let cells, tries = 0;
  do { cells = shuffle(openCells().filter(([c, r]) => !(c === 0 && r === 2))); tries++; } while (!avoidable(list, cells) && tries < 200);
  items = list.map((it, i) => ({label: it.label, ok: it.ok, why: it.why, c: cells[i][0], r: cells[i][1], gone: false}));
  dots = cells.slice(list.length).map(([c, r]) => ({c, r, gone: false}));
  banner = {t: 2.2, txt: G('round') + ' ' + (ri + 1)}; setMsg('info', G('start')(R.target));
}
/* every ok item must be reachable from the start without stepping on a wrong item */
function avoidable(list, cells){
  const bad = new Set(), ok = [];
  list.forEach((it, i) => { const k = cells[i][0] + ',' + cells[i][1]; (it.ok ? ok : []).push(k); if (!it.ok) bad.add(k); });
  const seen = new Set(['0,2']), q = [[0, 2]];
  while (q.length){ const [c, r] = q.shift(); for (const [dc, dr] of [[1,0],[-1,0],[0,1],[0,-1]]){ const nc = c + dc, nr = r + dr, k = nc + ',' + nr; if (open(nc, nr) && !bad.has(k) && !seen.has(k)){ seen.add(k); q.push([nc, nr]); } } }
  return ok.every(k => seen.has(k));
}
function tryMove(dc, dr){
  const c = pos.c + dc, r = pos.r + dr; if (!open(c, r)) return;
  pos.c = c; pos.r = r; moveCd = 0.14 / Math.max(speedF(), .7);
  const it = items.find(i => !i.gone && i.c === c && i.r === r);
  if (it){
    it.gone = true;
    if (it.ok){ award(100); setMsg('good', G('rightPre') + it.label + ': ' + it.why); }
    else { penalize(it.label, it.why); setMsg('bad', G('wrongPre') + it.label + ': ' + it.why); }
  }
  const d = dots.find(d => !d.gone && d.c === c && d.r === r); if (d){ d.gone = true; run.score += 2; }
}
function update(dt){
  if (banner) banner.t -= dt;
  moveCd -= dt;
  const tx = pos.c * CW + CW/2, ty = OY + pos.r * CH + CH/2; pos.x += (tx - pos.x) * Math.min(1, dt * 16); pos.y += (ty - pos.y) * Math.min(1, dt * 16);
  if (moveCd <= 0){
    if (keys.left || took('left')) tryMove(-1, 0); else if (keys.right || took('right')) tryMove(1, 0);
    else if (keys.up || took('up')) tryMove(0, -1); else if (keys.down || took('down')) tryMove(0, 1);
  }
  if (run.lives <= 0){ endRun(false, G('loseSub')(ri + 1)); return; }
  if (!items.some(i => i.ok && !i.gone)){
    ri++;
    if (ri >= D().rounds.length){ ri = D().rounds.length - 1; run.score += run.lives * 100; endRun(true, G('winSub')); return; }
    loadRound();
  }
}
function draw(dt){
  if (!items) return;
  for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++){
    const x = c * CW, y = OY + r * CH;
    if (LAYOUT[r][c] === '#') box(x + 4, y + 4, CW - 8, CH - 8, '#1a2a8a', '#4060ff');
  }
  ctx.fillStyle = COL.dim; for (const d of dots) if (!d.gone) ctx.fillRect(d.c * CW + CW/2 - 2, OY + d.r * CH + CH/2 - 2, 4, 4);
  for (const it of items) if (!it.gone){
    const x = it.c * CW, y = OY + it.r * CH; box(x + 4, y + 6, CW - 8, CH - 12, '#15154a', COL.cyan);
    const lines = wrap(it.label, CW - 14, 'bold 10px ' + MONO).slice(0, 4);
    lines.forEach((l, i) => text(l, x + CW/2, y + CH/2 + 3 + (i - (lines.length - 1) / 2) * 11, 10, COL.white, 'center'));
  }
  // player (pac-man style)
  const t = Date.now() / 120, mouth = reduceMotion ? .3 : Math.abs(Math.sin(t)) * .5 + .05;
  ctx.fillStyle = COL.yellow; ctx.beginPath(); ctx.moveTo(pos.x, pos.y); ctx.arc(pos.x, pos.y, 17, mouth, Math.PI * 2 - mouth); ctx.closePath(); ctx.fill();
  // target bar
  const left = items.filter(i => i.ok && !i.gone).length;
  box(0, OY + ROWS * CH + 4, W, H - (OY + ROWS * CH + 4), '#06061a');
  text(G('collect') + ':', 12, OY + ROWS * CH + 30, 14, COL.cyan);
  const tl = wrap(targetObj.target, W - 40, 'bold 18px ' + MONO).slice(0, 2); tl.forEach((l, i) => text(l, 12, OY + ROWS * CH + 54 + i * 21, 18, COL.yellow));
  text(left + ' ' + G('left'), W - 12, OY + ROWS * CH + 30, 14, COL.green, 'right');
  hud(run.score, G('round') + ' ' + (ri + 1) + '/' + D().rounds.length, run.lives);
  if (banner && banner.t > 0){ box(120, 170, 400, 70, 'rgba(0,0,0,.88)', COL.cyan); text(banner.txt, W/2, 215, 26, COL.yellow, 'center'); }
}
