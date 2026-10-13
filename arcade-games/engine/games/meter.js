/* Meter: a marker swings across a bar of 5 behaviours (from too little to too much). Stop it (SPACE / UP / DOWN / FIRE)
   in the zone that is appropriate. The right zone differs per situation (e.g. virtue as the mean). The neighbouring zone
   is "close" (no penalty, no points); everything further away costs a life.
   DATA[lang] = { title, subtitle, keys, axis: ['TOO LITTLE', 'TOO MUCH'], rounds: [ { situation, mean: 0-4,
     options: [ {label, why} x5 ] } ] }  (>= 8 rounds; one mean index per round, varied across rounds; labels <= ~60 characters) */
const GT = {
  en: { rules: '<ul class="rules"><li>A situation appears. Below it a bar shows five possible reactions, from too little to too much.</li><li>A marker swings across the bar. <b>Stop it</b> in the zone that fits the situation best.</li><li>Exact zone: points. Neighbouring zone: "close", no points, no penalty. Further away: a life is lost.</li><li>The right zone changes from situation to situation.</li><li>Keys: SPACE (or ↑ ↓) stops the marker. On a phone use the FIRE button.</li></ul>',
        round:'ROUND', stop:'SPACE = STOP', hit:'✔ Exact! ', close:'≈ Close, but not quite. ', miss:'✖ ', better:' Better here: ', winSub:'All situations done. Bonus: 100 per life left.', loseSub: n => 'Situation ' + n, start:'Stop the marker in the zone that fits the situation.' },
  de: { rules: '<ul class="rules"><li>Eine Situation erscheint. Darunter zeigt eine Leiste fünf mögliche Reaktionen, von zu wenig bis zu viel.</li><li>Ein Zeiger pendelt über die Leiste. <b>Stopp ihn</b> in der Zone, die zur Situation am besten passt.</li><li>Genau getroffen: Punkte. Nachbarzone: „knapp daneben", keine Punkte, keine Strafe. Weiter weg: ein Leben weniger.</li><li>Die richtige Zone ist in jeder Situation eine andere.</li><li>Tasten: LEERTASTE (oder ↑ ↓) stoppt den Zeiger. Am Handy den FEUER-Knopf nutzen.</li></ul>',
        round:'RUNDE', stop:'LEERTASTE = STOPP', hit:'✔ Genau! ', close:'≈ Knapp daneben. ', miss:'✖ ', better:' Besser hier: ', winSub:'Alle Situationen geschafft. Bonus: 100 pro übriges Leben.', loseSub: n => 'Situation ' + n, start:'Stoppe den Zeiger in der Zone, die zur Situation passt.' }
};
const TOTAL = 8, BAR_Y = 206, BAR_H = 62, ZONES = 5, ZW = (W - 20) / ZONES;
let rs, ri, phase, omega, stopped, wait, shown;
function startGame(){ resetRun(); run.state = 'play'; rs = shuffle(D().rounds).slice(0, TOTAL); ri = 0; omega = 1.25; newRound(); }
function newRound(){ phase = Math.random() * Math.PI * 2; stopped = false; wait = 0; shown = null; setMsg('info', G('start')); }
const markerX = () => W/2 + (W/2 - 14) * Math.sin(phase);
function zoneOf(x){ return Math.max(0, Math.min(ZONES - 1, Math.floor((x - 10) / ZW))); }
function update(dt){
  if (stopped){ wait -= dt; if (wait <= 0){ if (run.lives <= 0){ endRun(false, G('loseSub')(ri + 1)); return; } ri++; if (ri >= rs.length){ ri = rs.length - 1; run.score += run.lives * 100; endRun(true, G('winSub')); return; } newRound(); } return; }
  phase += omega * speedF() * dt * (1 + ri * 0.06);
  if (took('fire') || took('up') || took('down')){
    stopped = true; wait = 1.6; const r = rs[ri], z = zoneOf(markerX()), d = Math.abs(z - r.mean); shown = z;
    if (d === 0){ award(100); setMsg('good', G('hit') + r.options[z].label + ': ' + r.options[z].why); }
    else if (d === 1){ run.streak = 0; setMsg('info', G('close') + r.options[z].why + G('better') + r.options[r.mean].label); }
    else { penalize(r.situation + ' → ' + r.options[z].label, r.options[z].why + G('better') + r.options[r.mean].label); setMsg('bad', G('miss') + r.options[z].label + ': ' + r.options[z].why + G('better') + r.options[r.mean].label); }
  }
}
function draw(dt){
  if (!rs) return;
  const r = rs[ri];
  box(10, 40, W - 20, 96, '#15154a', COL.cyan);
  wrap(r.situation, W - 44, 'bold 16px ' + MONO).slice(0, 4).forEach((l, i) => text(l, W/2, 66 + i * 21, 16, COL.white, 'center'));
  text(D().axis[0] + ' ◀', 14, 184, 13, COL.cyan);
  text('▶ ' + D().axis[1], W - 14, 184, 13, COL.pink, 'right');
  for (let i = 0; i < ZONES; i++){
    const x = 10 + i * ZW, t = i / (ZONES - 1);
    const col = 'rgb(' + Math.round(0 + 255 * t) + ',' + Math.round(229 - 150 * t) + ',' + Math.round(255 - 15 * t) + ')';
    ctx.globalAlpha = (stopped && shown !== null) ? (i === shown ? 1 : (i === r.mean ? 0.9 : 0.35)) : 0.75;
    box(x + 2, BAR_Y, ZW - 4, BAR_H, col);
    ctx.globalAlpha = 1;
    if (stopped && i === r.mean) { ctx.strokeStyle = COL.green; ctx.lineWidth = 4; ctx.strokeRect(x + 2, BAR_Y, ZW - 4, BAR_H); }
    wrap(r.options[i].label, ZW - 10, 'bold 12px ' + MONO).slice(0, 8).forEach((l, k) => text(l, x + ZW/2, BAR_Y + BAR_H + 26 + k * 14, 12, COL.white, 'center'));
  }
  const mx = markerX();
  ctx.fillStyle = COL.yellow; ctx.fillRect(mx - 3, BAR_Y - 14, 6, BAR_H + 16);
  ctx.beginPath(); ctx.moveTo(mx - 10, BAR_Y - 14); ctx.lineTo(mx + 10, BAR_Y - 14); ctx.lineTo(mx, BAR_Y - 2); ctx.closePath(); ctx.fill();
  text(G('stop'), W/2, H - 12, 13, COL.yellow, 'center');
  hud(run.score, G('round') + ' ' + (ri + 1) + '/' + rs.length, run.lives);
}
