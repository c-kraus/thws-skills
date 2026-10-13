const GAME = {
  hsKey: 'bua1-ch03-hopper',
  title: 'Cycle Hopper',
  subtitle: 'BUA1 · Chapter 3 · From Transactions to Financial Statements',
  rules: '<ul class="rules"><li>Cross the river by hopping onto the <b>correct log</b> in every row.</li><li>Round 1: put the eight stations of the accounting cycle in order. Round 2: name the adjusting entry type for each situation.</li><li>Logs drift sideways. Line up under the right one and press ↑. Water or a wrong log costs a life.</li><li>3 lives for both rounds. Keys: ← → move, ↑ hop. On a phone use the buttons.</li></ul>'
};
const ROW_H = 42, TOP = 76, LOG_W = 150, LOG_H = 34, BANK_Y = TOP + 8 * ROW_H + 4;
let rounds, ri, rows, cur, frog, banner;

function startGame(){
  resetRun(); run.state = 'play';
  rounds = [
    { name: 'ROUND 1 · THE ACCOUNTING CYCLE', build: () => STATIONS.map((s, k) => ({
        prompt: 'Which station comes at position ' + (k + 1) + ' of 8?',
        right: s[0], why: s[0] + ': ' + s[1],
        options: shuffle([s[0], ...shuffle(STATIONS.map(x => x[0]).filter(n => n !== s[0])).slice(0, 2)]),
        explain: n => '"' + n + '" is station ' + (STATIONS.findIndex(x => x[0] === n) + 1) + ', not ' + (k + 1) + '. ' + STATIONS.find(x => x[0] === n)[1] })) },
    { name: 'ROUND 2 · ADJUSTING ENTRIES', build: () => shuffle(SCENARIOS).slice(0, 6).map(sc => ({
        prompt: sc[0], right: sc[1], why: sc[1] + ': ' + FAMILIES[sc[1]],
        options: shuffle([sc[1], ...shuffle(Object.keys(FAMILIES).filter(n => n !== sc[1])).slice(0, 2)]),
        explain: n => '"' + n + '" does not fit. ' + n + ': ' + FAMILIES[n] + ' The right answer is ' + sc[1] + '.' })) }
  ];
  ri = 0; loadRound();
}
function loadRound(){
  rows = rounds[ri].build().map((q, i) => {
    const dir = i % 2 ? -1 : 1, base = 28 + (i * 7) % 20;
    const period = W + 80, offset = Math.random() * period;
    return Object.assign(q, { dir, speed: base, offset, solved: false, logs: q.options.map((o, k) => ({ label: o, k })) });
  });
  cur = 0; frog = { x: W / 2, y: BANK_Y + 18 };
  banner = { t: 2.2, txt: rounds[ri].name };
  setMsg('info', rounds[ri].name + ': hop onto the correct log in each row.');
}
function rowY(i){ return TOP + (rows.length - 1 - i) * ROW_H; }   // row 0 is closest to the bank
function logX(row, k){
  const period = W + 80, spacing = period / 3;
  const base = row.solved ? row.frozen : row.offset;
  return ((base + k * spacing) % period) - 80;
}
function update(dt){
  banner && (banner.t -= dt);
  const sp = speedF();
  for (const r of rows){ if (!r.solved) r.offset = (r.offset + r.dir * r.speed * sp * dt + (W + 80) * 10) % (W + 80); }
  if (keys.left) frog.x -= 200 * dt; if (keys.right) frog.x += 200 * dt;
  frog.x = Math.max(16, Math.min(W - 16, frog.x));
  if (took('up')){
    const r = rows[cur], hit = r.logs.find(l => { const x = logX(r, l.k); return frog.x >= x && frog.x <= x + LOG_W; });
    if (!hit){ penalize(r.prompt, 'You fell in the water. Wait until a log is right under the frog, then hop.'); setMsg('bad', '✖ Splash! No log there. Line the frog up with a log first.'); }
    else if (hit.label !== r.right){ penalize(r.prompt + ' → ' + hit.label, r.explain(hit.label)); setMsg('bad', '✖ ' + r.explain(hit.label)); }
    else {
      award(100); r.solved = true; r.frozen = r.offset; setMsg('good', '✔ ' + r.why);
      cur++; frog.y = rowY(cur - 1) + LOG_H / 2;
      if (cur >= rows.length){ ri++; if (ri >= rounds.length){ run.score += run.lives * 100; endRun(true, 'You crossed both rivers. Bonus: 100 per life left.'); return; } loadRound(); return; }
    }
    if (run.lives <= 0){ endRun(false, rounds[ri].name.toLowerCase()); return; }
  }
}
function draw(dt){
  if (!rows) return;
  // question banner
  const q = rows[Math.min(cur, rows.length - 1)];
  box(0, 30, W, 42, '#06061a');
  wrap(q.prompt, W - 20, 'bold 14px ' + MONO).slice(0, 2).forEach((l, i) => text(l, W/2, 49 + i * 17 - (wrap(q.prompt, W - 20, 'bold 14px ' + MONO).length > 1 ? 7 : 0), 14, COL.yellow, 'center'));
  // water rows
  rows.forEach((r, i) => {
    const y = rowY(i);
    box(0, y, W, ROW_H - 2, i === cur ? '#0d2b66' : (r.solved ? '#0a3d2a' : '#0a1f4a'));
    for (const l of r.logs){
      const x = logX(r, l.k);
      const col = r.solved ? (l.label === r.right ? COL.green : '#2b2b55') : '#8a5a2b';
      box(x, y + 4, LOG_W, LOG_H, col, r.solved && l.label === r.right ? COL.white : '#c98a4b');
      const lines = wrap(l.label, LOG_W - 10, 'bold 11px ' + MONO);
      lines.slice(0, 2).forEach((ln, k) => text(ln, x + LOG_W / 2, y + 4 + LOG_H / 2 + 4 + (k - (Math.min(lines.length, 2) - 1) / 2) * 12, 11, COL.white, 'center'));
    }
  });
  box(0, BANK_Y, W, H - BANK_Y, '#1c3a1c');
  // frog
  const fy = cur === 0 ? BANK_Y + 18 : rowY(cur - 1) + 4 + LOG_H / 2;
  frog.y = fy;
  ctx.fillStyle = '#000'; ctx.beginPath(); ctx.arc(frog.x, fy, 14, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = COL.yellow; ctx.beginPath(); ctx.arc(frog.x, fy, 11, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = COL.white; ctx.fillRect(frog.x - 7, fy - 9, 5, 5); ctx.fillRect(frog.x + 2, fy - 9, 5, 5);
  ctx.fillStyle = '#000'; ctx.fillRect(frog.x - 5, fy - 8, 2, 2); ctx.fillRect(frog.x + 4, fy - 8, 2, 2);
  text('ROW ' + Math.min(cur + 1, rows.length) + '/' + rows.length, W/2, H - 8, 13, COL.yellow, 'center');
  hud(run.score, 'ROUND ' + (ri + 1) + '/2', run.lives);
  if (banner && banner.t > 0){ box(70, 190, 500, 80, 'rgba(0,0,0,.85)', COL.cyan); text(banner.txt, W/2, 238, 22, COL.yellow, 'center'); }
}
