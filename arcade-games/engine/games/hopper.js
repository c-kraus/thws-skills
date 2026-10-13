/* Hopper: Frogger-style. In each row hop onto the correct log. Rounds of rows.
   DATA[lang] = { title, subtitle, keys, rounds: [ { name, rows: [ { prompt, options: [ {label, ok:true|false, why}, ... >= 3, exactly one ok ] }, ... (6-8 rows) ] } ] } */
const GT = {
  en: { rules: '<ul class="rules"><li>Cross the river by hopping onto the <b>correct log</b> in every row.</li><li>Read the question at the top. Logs drift sideways: line the frog up under the right one and press ↑.</li><li>Water or a wrong log costs a life and shows the rule.</li><li>3 lives for all rounds. Keys: ← → move, ↑ hop. On a phone use the buttons.</li></ul>',
        round:'ROUND', row:'ROW', start: n => n + ': hop onto the correct log in each row.', splash:'✖ Splash! No log there. Line the frog up with a log first.', water:'You fell in the water. Wait until a log is right under the frog, then hop.',
        winSub:'You crossed every river. Bonus: 100 per life left.', loseSub: n => n },
  de: { rules: '<ul class="rules"><li>Überquere den Fluss, indem du in jeder Reihe auf den <b>richtigen Baumstamm</b> springst.</li><li>Lies die Frage oben. Die Stämme treiben seitwärts: stell den Frosch unter den richtigen und drück ↑.</li><li>Wasser oder ein falscher Stamm kostet ein Leben und zeigt die Regel.</li><li>3 Leben für alle Runden. Tasten: ← → bewegen, ↑ springen. Am Handy die Knöpfe nutzen.</li></ul>',
        round:'RUNDE', row:'REIHE', start: n => n + ': spring in jeder Reihe auf den richtigen Stamm.', splash:'✖ Platsch! Da ist kein Stamm. Stell den Frosch erst unter einen Stamm.', water:'Du bist ins Wasser gefallen. Warte, bis ein Stamm direkt unter dem Frosch ist, dann spring.',
        winSub:'Alle Flüsse überquert. Bonus: 100 pro übriges Leben.', loseSub: n => n }
};
const ROW_H = 42, TOP = 76, LOG_W = 150, LOG_H = 34, BANK_Y = TOP + 8 * ROW_H + 4;
let ri, rows, cur, frog, banner;
function startGame(){ resetRun(); run.state = 'play'; ri = 0; loadRound(); }
function loadRound(){
  const R = D().rounds[ri];
  rows = R.rows.map((q, i) => {
    const right = q.options.find(o => o.ok), others = shuffle(q.options.filter(o => !o.ok)).slice(0, 2);
    return { prompt: q.prompt, right, logs: shuffle([right, ...others]).map((o, k) => ({o, k})), dir: i % 2 ? -1 : 1, speed: 28 + (i * 7) % 20, offset: Math.random() * (W + 80), solved: false };
  });
  cur = 0; frog = {x: W/2}; banner = {t: 2.2, txt: R.name}; setMsg('info', G('start')(R.name));
}
const rowY = i => TOP + (rows.length - 1 - i) * ROW_H;
function logX(row, k){ const period = W + 80, sp = period / 3, base = row.solved ? row.frozen : row.offset; return ((base + k * sp) % period) - 80; }
function update(dt){
  if (banner) banner.t -= dt;
  const sp = speedF();
  for (const r of rows) if (!r.solved) r.offset = (r.offset + r.dir * r.speed * sp * dt + (W + 80) * 10) % (W + 80);
  if (keys.left) frog.x -= 200 * dt; if (keys.right) frog.x += 200 * dt;
  frog.x = Math.max(16, Math.min(W - 16, frog.x));
  if (took('up')){
    const r = rows[cur], hit = r.logs.find(l => { const x = logX(r, l.k); return frog.x >= x && frog.x <= x + LOG_W; });
    if (!hit){ penalize(r.prompt, G('water')); setMsg('bad', G('splash')); }
    else if (!hit.o.ok){ penalize(r.prompt + ' → ' + hit.o.label, hit.o.why); setMsg('bad', '✖ ' + hit.o.why); }
    else {
      award(100); r.solved = true; r.frozen = r.offset; setMsg('good', '✔ ' + r.right.why); cur++;
      if (cur >= rows.length){ ri++; if (ri >= D().rounds.length){ ri = D().rounds.length - 1; cur = rows.length; run.score += run.lives * 100; endRun(true, G('winSub')); return; } loadRound(); return; }
    }
    if (run.lives <= 0) endRun(false, G('loseSub')(D().rounds[ri].name));
  }
}
function draw(dt){
  if (!rows) return;
  const q = rows[Math.min(cur, rows.length - 1)];
  box(0, 30, W, 42, '#06061a');
  const pl = wrap(q.prompt, W - 20, 'bold 14px ' + MONO).slice(0, 2);
  pl.forEach((l, i) => text(l, W/2, 49 + i * 17 - (pl.length > 1 ? 7 : 0), 14, COL.yellow, 'center'));
  rows.forEach((r, i) => {
    const y = rowY(i); box(0, y, W, ROW_H - 2, i === cur ? '#0d2b66' : (r.solved ? '#0a3d2a' : '#0a1f4a'));
    for (const l of r.logs){
      const x = logX(r, l.k), good = l.o === r.right, col = r.solved ? (good ? COL.green : '#2b2b55') : '#8a5a2b';
      box(x, y + 4, LOG_W, LOG_H, col, r.solved && good ? COL.white : '#c98a4b');
      const lines = wrap(l.o.label, LOG_W - 10, 'bold 11px ' + MONO).slice(0, 2);
      lines.forEach((ln, k) => text(ln, x + LOG_W / 2, y + 4 + LOG_H / 2 + 4 + (k - (lines.length - 1) / 2) * 12, 11, COL.white, 'center'));
    }
  });
  box(0, BANK_Y, W, H - BANK_Y, '#1c3a1c');
  const fy = cur === 0 ? BANK_Y + 18 : rowY(Math.min(cur, rows.length) - 1) + 4 + LOG_H / 2;
  ctx.fillStyle = '#000'; ctx.beginPath(); ctx.arc(frog.x, fy, 14, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = COL.yellow; ctx.beginPath(); ctx.arc(frog.x, fy, 11, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = COL.white; ctx.fillRect(frog.x - 7, fy - 9, 5, 5); ctx.fillRect(frog.x + 2, fy - 9, 5, 5);
  ctx.fillStyle = '#000'; ctx.fillRect(frog.x - 5, fy - 8, 2, 2); ctx.fillRect(frog.x + 4, fy - 8, 2, 2);
  text(G('row') + ' ' + Math.min(cur + 1, rows.length) + '/' + rows.length, W/2, H - 8, 13, COL.yellow, 'center');
  hud(run.score, G('round') + ' ' + (ri + 1) + '/' + D().rounds.length, run.lives);
  if (banner && banner.t > 0){ box(40, 190, 560, 80, 'rgba(0,0,0,.85)', COL.cyan); wrap(banner.txt, 540, 'bold 22px ' + MONO).slice(0, 2).forEach((l, i) => text(l, W/2, 232 + i * 26, 22, COL.yellow, 'center')); }
}
