const GAME = {
  hsKey: 'bua1-ch02-drop',
  title: 'Account Drop',
  subtitle: 'BUA1 · Chapter 2 · The Accounting System: Double-Entry',
  rules: '<ul class="rules"><li>Accounts fall from the top. Steer each one into the <b>right lane</b>.</li><li>Level 1: which of the five account types? Level 2: debit or credit normal balance? Level 3: does a debit or credit increase or decrease the account?</li><li>8 cards per level, 3 lives. A wrong lane costs a life and shows the rule.</li><li>Keys: ← → pick the lane, ↓ drops faster. On a phone use the buttons.</li></ul>'
};
const PER_LEVEL = 8, LANE_TOP = 330, CARD_H = 44;
let lvl, deck, card, lane, intro, ended;

function startGame(){
  resetRun(); run.state = 'play'; lvl = 0; ended = false;
  loadLevel();
}
function loadLevel(){
  deck = shuffle(LEVELS[lvl].items).slice(0, PER_LEVEL);
  lane = Math.floor(LEVELS[lvl].lanes.length / 2);
  card = null; intro = 2.2;
  setMsg('info', LEVELS[lvl].name + ': steer each card into the right lane.');
}
function nextCard(){
  const it = deck.shift();
  if (!it){
    lvl++;
    if (lvl >= LEVELS.length){ lvl = LEVELS.length - 1; deck = []; run.score += run.lives * 100; endRun(true, 'All 3 levels cleared. Bonus: 100 per life left.'); return; }
    loadLevel(); return;
  }
  card = {name: it[0], lane: it[1], why: it[2], y: 40, x: W/2};
}
function laneW(){ return W / LEVELS[lvl].lanes.length; }
function update(dt){
  const L = LEVELS[lvl];
  if (intro > 0){ intro -= dt; return; }
  if (!card){ nextCard(); return; }
  if (took('left')) lane = Math.max(0, lane - 1);
  if (took('right')) lane = Math.min(L.lanes.length - 1, lane + 1);
  const target = lane * laneW() + laneW() / 2;
  card.x += (target - card.x) * Math.min(1, dt * 14);
  const v = (46 + lvl * 14) * speedF() * (keys.down ? 3.4 : 1);
  card.y += v * dt;
  if (card.y + CARD_H >= LANE_TOP){
    const ok = lane === card.lane, laneName = L.lanes[card.lane][0];
    if (ok){ award(100 + (keys.down ? 20 : 0)); setMsg('good', '✔ ' + card.name + ' → ' + laneName + '. ' + card.why); }
    else { penalize(card.name + ' → ' + laneName, card.why); setMsg('bad', '✖ ' + card.name + ' belongs in ' + laneName + '. ' + card.why); }
    card = null;
    if (run.lives <= 0) endRun(false, 'Reached ' + L.name.toLowerCase());
  }
}
function draw(dt){
  if (!deck) return;
  const L = LEVELS[lvl], n = L.lanes.length, w = laneW();
  for (let i = 0; i < n; i++){
    const x = i * w, sel = i === lane;
    box(x + 3, LANE_TOP, w - 6, H - LANE_TOP - 6, sel ? 'rgba(255,255,255,.14)' : 'rgba(255,255,255,.04)', L.lanes[i][1]);
    const label = L.lanes[i][0];
    const size = n > 3 ? 13 : 17;
    wrap(label, w - 16, 'bold ' + size + 'px ' + MONO).forEach((ln, k) => text(ln, x + w/2, LANE_TOP + 46 + k * (size + 4), size, L.lanes[i][1], 'center'));
    if (sel) text('▲', x + w/2, H - 16, 20, COL.white, 'center');
  }
  if (card){
    const lines = wrap(card.name, 190, 'bold 15px ' + MONO), h = Math.max(CARD_H, lines.length * 18 + 14);
    box(card.x - 100, card.y, 200, h, '#15154a', COL.yellow);
    lines.forEach((l, i) => text(l, card.x, card.y + 24 + i * 18 - (lines.length - 1) * 4, 15, COL.white, 'center'));
  }
  hud(run.score, 'LV ' + (lvl + 1) + '/3 · ' + (PER_LEVEL - deck.length - (card ? 1 : 0)) + '/' + PER_LEVEL, run.lives);
  if (intro > 0){ box(70, 150, 500, 90, 'rgba(0,0,0,.85)', COL.cyan); text(L.name, W/2, 205, 24, COL.yellow, 'center'); }
}
