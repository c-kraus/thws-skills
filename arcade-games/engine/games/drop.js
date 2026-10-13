/* Drop: a card falls; steer it into the right lane. Several levels.
   DATA[lang] = { title, subtitle, keys, levels: [ { name, lanes: ['LANE A', 'LANE B', ...(2-5)], items: [[card, laneIndex, why], ...] } ] }  (>= 8 items per level) */
const GT = {
  en: { rules: '<ul class="rules"><li>Cards fall from the top. Steer each one into the <b>right lane</b>.</li><li>Each level has its own sorting rule. A wrong lane costs a life and shows the rule.</li><li>8 cards per level, 3 lives.</li><li>Keys: ← → pick the lane, ↓ drops faster. On a phone use the buttons.</li></ul>',
        level:'LV', start: n => n + ': steer each card into the right lane.', belongs:' belongs in ', winSub:'All levels cleared. Bonus: 100 per life left.', loseSub: n => 'Stopped at ' + n },
  de: { rules: '<ul class="rules"><li>Karten fallen von oben. Steuere jede in die <b>richtige Spur</b>.</li><li>Jedes Level hat eine eigene Sortierregel. Eine falsche Spur kostet ein Leben und zeigt die Regel.</li><li>8 Karten pro Level, 3 Leben.</li><li>Tasten: ← → Spur wählen, ↓ schneller fallen. Am Handy die Knöpfe nutzen.</li></ul>',
        level:'LV', start: n => n + ': steuere jede Karte in die richtige Spur.', belongs:' gehört in ', winSub:'Alle Level geschafft. Bonus: 100 pro übriges Leben.', loseSub: n => 'Gestoppt bei ' + n }
};
const PER_LEVEL = 8, LANE_TOP = 330, CARD_H = 44;
let lvl, deck, card, lane, intro;
function startGame(){ resetRun(); run.state = 'play'; lvl = 0; loadLevel(); }
function loadLevel(){
  const L = D().levels[lvl]; deck = shuffle(L.items).slice(0, PER_LEVEL); lane = Math.floor(L.lanes.length / 2); card = null; intro = 2.2;
  setMsg('info', G('start')(L.name));
}
function nextCard(){
  const it = deck.shift();
  if (!it){ lvl++; if (lvl >= D().levels.length){ lvl = D().levels.length - 1; deck = []; run.score += run.lives * 100; endRun(true, G('winSub')); return; } loadLevel(); return; }
  card = {name: it[0], lane: it[1], why: it[2], y: 40, x: W/2};
}
const laneW = () => W / D().levels[lvl].lanes.length;
function update(dt){
  const L = D().levels[lvl];
  if (intro > 0){ intro -= dt; return; }
  if (!card){ nextCard(); return; }
  if (took('left')) lane = Math.max(0, lane - 1);
  if (took('right')) lane = Math.min(L.lanes.length - 1, lane + 1);
  card.x += ((lane * laneW() + laneW() / 2) - card.x) * Math.min(1, dt * 14);
  card.y += (46 + lvl * 14) * speedF() * (keys.down ? 3.4 : 1) * dt;
  if (card.y + CARD_H >= LANE_TOP){
    const ok = lane === card.lane, laneName = L.lanes[card.lane];
    if (ok){ award(100 + (keys.down ? 20 : 0)); setMsg('good', '✔ ' + card.name + ' → ' + laneName + '. ' + card.why); }
    else { penalize(card.name + ' → ' + laneName, card.why); setMsg('bad', '✖ ' + card.name + G('belongs') + laneName + '. ' + card.why); }
    card = null; if (run.lives <= 0) endRun(false, G('loseSub')(L.name));
  }
}
function draw(dt){
  if (!deck) return;
  const L = D().levels[lvl], n = L.lanes.length, w = laneW(), total = D().levels.length;
  for (let i = 0; i < n; i++){
    const x = i * w, sel = i === lane, col = LANE_COLORS[i % LANE_COLORS.length], size = n > 3 ? 13 : 17;
    box(x + 3, LANE_TOP, w - 6, H - LANE_TOP - 6, sel ? 'rgba(255,255,255,.14)' : 'rgba(255,255,255,.04)', col);
    wrap(L.lanes[i], w - 16, 'bold ' + size + 'px ' + MONO).forEach((ln, k) => text(ln, x + w/2, LANE_TOP + 46 + k * (size + 4), size, col, 'center'));
    if (sel) text('▲', x + w/2, H - 16, 20, COL.white, 'center');
  }
  if (card){
    const lines = wrap(card.name, 190, 'bold 15px ' + MONO), h = Math.max(CARD_H, lines.length * 18 + 14);
    box(card.x - 100, card.y, 200, h, '#15154a', COL.yellow);
    lines.forEach((l, i) => text(l, card.x, card.y + 24 + i * 18 - (lines.length - 1) * 4, 15, COL.white, 'center'));
  }
  hud(run.score, G('level') + ' ' + (lvl + 1) + '/' + total + ' · ' + Math.max(0, PER_LEVEL - deck.length - (card ? 1 : 0)) + '/' + PER_LEVEL, run.lives);
  if (intro > 0){ box(40, 150, 560, 90, 'rgba(0,0,0,.85)', COL.cyan); wrap(L.name, 540, 'bold 22px ' + MONO).slice(0, 2).forEach((l, i) => text(l, W/2, 195 + i * 26, 22, COL.yellow, 'center')); }
}
