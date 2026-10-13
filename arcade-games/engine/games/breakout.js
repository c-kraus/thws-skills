/* Breakout: a question is shown; bounce the ball into the brick with the right answer; wrong bricks cost a life.
   DATA[lang] = { title, subtitle, keys, prompts: [ { prompt, options: [ {label, ok:true|false, why}, ... (>= 4, exactly one ok) ] }, ... (>= 8) ] } */
const GT = {
  en: { rules: '<ul class="rules"><li>A question appears at the top. Bricks show possible answers.</li><li>Move the paddle and bounce the ball into the <b>right brick</b>.</li><li>A wrong brick shows the rule and counts as a strike. <b>Two strikes cost a life.</b> Losing the ball only resets it (no penalty).</li><li>8 questions, 3 lives.</li><li>Keys: ← → move the paddle, SPACE or ↑ launches the ball. On a phone use the buttons.</li></ul>',
        strike:'Strike', q:'Q', start:'Hit the brick with the right answer.', launch:'SPACE / ↑ to launch', winSub:'All questions answered. Bonus: 100 per life left.', loseSub: n => 'Question ' + n + ' of 8' },
  de: { rules: '<ul class="rules"><li>Oben erscheint eine Frage. Die Steine zeigen mögliche Antworten.</li><li>Bewege den Schläger und lenke den Ball in den <b>richtigen Stein</b>.</li><li>Ein falscher Stein zeigt die Regel und zählt als Fehler. <b>Zwei Fehler kosten ein Leben.</b> Den Ball zu verlieren setzt ihn nur zurück (ohne Strafe).</li><li>8 Fragen, 3 Leben.</li><li>Tasten: ← → Schläger bewegen, LEERTASTE oder ↑ startet den Ball. Am Handy die Knöpfe nutzen.</li></ul>',
        strike:'Fehler', q:'F', start:'Triff den Stein mit der richtigen Antwort.', launch:'LEERTASTE / ↑ zum Start', winSub:'Alle Fragen beantwortet. Bonus: 100 pro übriges Leben.', loseSub: n => 'Frage ' + n + ' von 8' }
};
const TOTAL_Q = 8, PAD_Y = 450, PAD_W = 96, BR = 7, TOP_WALL = 74, BRICK_Y = 84, BRICK_H = 76;
let qs, qi, bricks, ball, padx, launched, launchT, strikes;
function startGame(){ resetRun(); run.state = 'play'; qs = shuffle(D().prompts).slice(0, TOTAL_Q); qi = 0; padx = W/2; strikes = 0; loadQ(); }
function loadQ(){
  const p = qs[qi], right = p.options.find(o => o.ok), others = shuffle(p.options.filter(o => !o.ok)).slice(0, 5), opts = shuffle([right, ...others]);
  const w = (W - 20) / opts.length;
  bricks = opts.map((o, i) => ({o, x: 10 + i * w, w: w - 4, y: BRICK_Y, h: BRICK_H, gone: false}));
  resetBall(); setMsg('info', G('start'));
}
function resetBall(){ launched = false; launchT = 1.2; ball = {x: padx, y: PAD_Y - BR - 2, vx: 0, vy: 0}; }
function launch(){ const a = (Math.random() * 0.8 - 0.4); const sp = 270 * speedF(); ball.vx = sp * Math.sin(a); ball.vy = -sp * Math.cos(a); launched = true; }
function update(dt){
  if (keys.left) padx -= 380 * dt; if (keys.right) padx += 380 * dt; padx = Math.max(PAD_W/2, Math.min(W - PAD_W/2, padx));
  if (!launched){ ball.x = padx; ball.y = PAD_Y - BR - 2; launchT -= dt; if (took('fire') || took('up')) launch(); return; }
  ball.x += ball.vx * dt; ball.y += ball.vy * dt;
  if (ball.x < BR){ ball.x = BR; ball.vx = Math.abs(ball.vx); } if (ball.x > W - BR){ ball.x = W - BR; ball.vx = -Math.abs(ball.vx); }
  if (ball.y < TOP_WALL + BR){ ball.y = TOP_WALL + BR; ball.vy = Math.abs(ball.vy); }
  if (ball.vy > 0 && ball.y + BR >= PAD_Y && ball.y + BR <= PAD_Y + 14 && ball.x > padx - PAD_W/2 - BR && ball.x < padx + PAD_W/2 + BR){
    const rel = (ball.x - padx) / (PAD_W/2), sp = Math.hypot(ball.vx, ball.vy); ball.vx = sp * rel * .8; ball.vy = -Math.sqrt(Math.max(sp*sp - ball.vx*ball.vx, 1)); ball.y = PAD_Y - BR;
  }
  if (ball.y > H + 20){ resetBall(); return; }
  for (const b of bricks) if (!b.gone && ball.x + BR > b.x && ball.x - BR < b.x + b.w && ball.y + BR > b.y && ball.y - BR < b.y + b.h){
    const fromSide = Math.min(ball.x + BR - b.x, b.x + b.w - (ball.x - BR)) < Math.min(ball.y + BR - b.y, b.y + b.h - (ball.y - BR));
    if (fromSide) ball.vx = -ball.vx; else ball.vy = -ball.vy;
    b.gone = true;
    if (b.o.ok){ award(100); setMsg('good', '✔ ' + b.o.label + ': ' + b.o.why); qi++; if (qi >= qs.length){ qi = qs.length - 1; run.score += run.lives * 100; endRun(true, G('winSub')); return; } loadQ(); return; }
    strikes++; run.streak = 0; run.wrong++; run.misses.push({item: qs[qi].prompt + ' → ' + b.o.label, explanation: b.o.why}); sfx.bad();
    if (strikes % 2 === 0) run.lives--;
    setMsg('bad', '✖ ' + b.o.label + ': ' + b.o.why + ' (' + G('strike') + ' ' + (strikes % 2 === 0 ? 2 : 1) + '/2)');
    if (run.lives <= 0){ endRun(false, G('loseSub')(qi + 1)); return; }
    break;
  }
}
function draw(dt){
  if (!bricks) return;
  box(0, 30, W, 42, '#06061a');
  const pl = wrap(qs[qi].prompt, W - 20, 'bold 14px ' + MONO).slice(0, 2); pl.forEach((l, i) => text(l, W/2, 49 + i * 17 - (pl.length > 1 ? 7 : 0), 14, COL.yellow, 'center'));
  for (const b of bricks) if (!b.gone){
    box(b.x, b.y, b.w, b.h, '#15154a', COL.cyan);
    const lines = wrap(b.o.label, b.w - 12, 'bold 11px ' + MONO).slice(0, 5);
    lines.forEach((l, i) => text(l, b.x + b.w/2, b.y + b.h/2 + 4 + (i - (lines.length - 1) / 2) * 13, 11, COL.white, 'center'));
  }
  box(padx - PAD_W/2, PAD_Y, PAD_W, 12, COL.orange, COL.yellow);
  ctx.fillStyle = COL.white; ctx.beginPath(); ctx.arc(ball.x, ball.y, BR, 0, Math.PI * 2); ctx.fill();
  if (!launched) text(G('launch'), W/2, PAD_Y - 28, 13, COL.cyan, 'center');
  hud(run.score, G('q') + ' ' + (qi + 1) + '/' + qs.length, run.lives);
}
