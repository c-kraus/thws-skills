/* Invaders: statements fall; shoot the FALSE ones, let the TRUE ones pass.
   DATA[lang] = { title, subtitle, keys, statements: [[text, isTrue, why], ...] }  (>= 9 true and >= 9 false) */
const GT = {
  en: { rules: '<ul class="rules"><li>Statements fall from the sky.</li><li><b>Shoot the FALSE ones</b> before they reach your ship.</li><li><b>Let the TRUE ones pass.</b> Shooting a true statement costs a life.</li><li>3 waves, 6 statements each (3 true, 3 false), 3 lives.</li><li>Keys: ← → move, SPACE fires. On a phone use the buttons.</li></ul>',
        wave:'WAVE', legend:'SHOOT FALSE  ·  LET TRUE PASS', start:'Shoot the false statements. Let the true ones pass.',
        shotTrue:'✖ That statement was TRUE. ', hit:'✔ Hit! ', passed:'✔ Let through correctly. ', leaked:'✖ A FALSE statement got through. ',
        winSub:'All 3 waves cleared. Bonus: 100 per life left.', loseSub: n => 'Wave ' + n + ' of 3' },
  de: { rules: '<ul class="rules"><li>Aussagen fallen vom Himmel.</li><li><b>Schieß die FALSCHEN ab</b>, bevor sie dein Schiff erreichen.</li><li><b>Lass die RICHTIGEN durch.</b> Eine richtige Aussage abzuschießen kostet ein Leben.</li><li>3 Wellen mit je 6 Aussagen (3 richtig, 3 falsch), 3 Leben.</li><li>Tasten: ← → bewegen, LEERTASTE schießt. Am Handy die Knöpfe nutzen.</li></ul>',
        wave:'WELLE', legend:'FALSCH ABSCHIESSEN  ·  RICHTIG DURCHLASSEN', start:'Schieß die falschen Aussagen ab. Lass die richtigen durch.',
        shotTrue:'✖ Diese Aussage war RICHTIG. ', hit:'✔ Treffer! ', passed:'✔ Richtig durchgelassen. ', leaked:'✖ Eine FALSCHE Aussage ist durchgekommen. ',
        winSub:'Alle 3 Wellen geschafft. Bonus: 100 pro übriges Leben.', loseSub: n => 'Welle ' + n + ' von 3' }
};
const LANES = 3, CARD_W = 196, SHIP_Y = 424, FONT = 'bold 12px ' + MONO;
let ship, bullets, cards, queue, wave, spawnT, cooldown, banner, waves;
function pickWaves(){
  const all = D().statements, t = shuffle(all.filter(s => s[1])).slice(0, 9), f = shuffle(all.filter(s => !s[1])).slice(0, 9), out = [];
  for (let w = 0; w < 3; w++) out.push(shuffle([...t.slice(w*3, w*3+3), ...f.slice(w*3, w*3+3)]));
  return out;
}
function startGame(){
  resetRun(); run.state = 'play'; ship = {x: W/2}; bullets = []; cards = []; wave = 0; waves = pickWaves(); queue = waves[0].slice(); spawnT = 1.2; cooldown = 0;
  banner = {t: 2, txt: G('wave') + ' 1'}; setMsg('info', G('start'));
}
function spawn(){
  const s = queue.shift(); if (!s) return;
  const lines = wrap(s[0], CARD_W - 16, FONT), h = lines.length * 15 + 14, laneX = i => 10 + i * (CARD_W + 7);
  let best = 0, bestY = -1e9;
  for (let i = 0; i < LANES; i++){
    const inLane = cards.filter(c => c.lane === i), lowest = inLane.length ? Math.min(...inLane.map(c => c.y)) : 1e9, free = Math.min(lowest, 1e6) + Math.random();
    if (free > bestY){ bestY = free; best = i; }
  }
  cards.push({txt: s[0], isTrue: s[1], why: s[2], lines, h, x: laneX(best), lane: best, y: 34 - h});
}
function update(dt){
  const sp = speedF();
  if (keys.left) ship.x -= 300 * dt * Math.max(sp, .8);
  if (keys.right) ship.x += 300 * dt * Math.max(sp, .8);
  ship.x = Math.max(20, Math.min(W - 20, ship.x)); cooldown -= dt;
  if ((keys.fire || took('fire')) && cooldown <= 0){ bullets.push({x: ship.x, y: SHIP_Y - 12}); cooldown = .35; sfx.shoot(); }
  bullets.forEach(b => b.y -= 440 * dt); bullets = bullets.filter(b => b.y > 20);
  spawnT -= dt; if (queue.length && spawnT <= 0){ spawn(); spawnT = (6.5 - wave * .6) / sp; }
  const fall = (15 + wave * 4) * sp; for (const c of cards) c.y += fall * dt;
  for (const b of bullets) for (const c of cards){
    if (!c.dead && b.x > c.x && b.x < c.x + CARD_W && b.y > c.y && b.y < c.y + c.h){
      b.y = -99; c.dead = true;
      if (c.isTrue){ penalize(c.txt, c.why); setMsg('bad', G('shotTrue') + c.why); } else { award(100); setMsg('good', G('hit') + c.why); }
    }
  }
  for (const c of cards) if (!c.dead && c.y + c.h >= SHIP_Y - 14){
    c.dead = true;
    if (c.isTrue){ award(50); setMsg('good', G('passed') + c.why); } else { penalize(c.txt, c.why); setMsg('bad', G('leaked') + c.why); }
  }
  cards = cards.filter(c => !c.dead);
  if (run.lives <= 0){ endRun(false, G('loseSub')(wave + 1)); return; }
  if (!queue.length && !cards.length){
    wave++;
    if (wave >= 3){ run.score += run.lives * 100; endRun(true, G('winSub')); return; }
    queue = waves[wave].slice(); spawnT = 1.5; banner = {t: 2, txt: G('wave') + ' ' + (wave + 1)};
  }
  if (banner) banner.t -= dt;
}
function draw(dt){
  if (!ship) return;
  for (const c of cards){
    box(c.x, c.y, CARD_W, c.h, '#15154a', COL.cyan);
    ctx.font = FONT; ctx.fillStyle = COL.white; ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
    c.lines.forEach((l, i) => ctx.fillText(l, c.x + 8, c.y + 18 + i * 15));
  }
  ctx.fillStyle = COL.yellow; bullets.forEach(b => ctx.fillRect(b.x - 2, b.y, 4, 12));
  hud(run.score, G('wave') + ' ' + Math.min(wave + 1, 3) + '/3', run.lives);
  ctx.fillStyle = COL.green; ctx.beginPath(); ctx.moveTo(ship.x, SHIP_Y - 14); ctx.lineTo(ship.x - 18, SHIP_Y + 10); ctx.lineTo(ship.x + 18, SHIP_Y + 10); ctx.closePath(); ctx.fill();
  ctx.fillStyle = COL.orange; ctx.fillRect(ship.x - 22, SHIP_Y + 10, 44, 5);
  ctx.fillStyle = COL.pink; ctx.fillRect(0, SHIP_Y + 22, W, 2);
  text(G('legend'), W/2, H - 18, 14, COL.yellow, 'center');
  if (banner && banner.t > 0) text(banner.txt, W/2, 240, 34, COL.yellow, 'center');
}
