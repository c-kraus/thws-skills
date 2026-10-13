/* ===== Arcade core (shared by all games) ===== */
const W = 640, H = 480;
const cv = document.getElementById('cv');
const ctx = cv.getContext('2d');
const $ = id => document.getElementById(id);
const COL = { bg:'#0b0b2b', grid:'#1a1a55', green:'#39ff14', yellow:'#ffd400', pink:'#ff4df0', cyan:'#00e5ff', orange:'#ff6a00', red:'#ff3355', white:'#f4f4ff', dim:'#8a8ac0' };
const MONO = "'Courier New', Courier, monospace";
const reduceMotion = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
let slow = reduceMotion;           // slow mode: calmer speeds
let muted = true;                  // sound off by default
const speedF = () => slow ? 0.6 : 1;

/* ---- storage (never fails) ---- */
const store = {
  get(k, d){ try { const v = localStorage.getItem(k); return v === null ? d : v; } catch(e){ return d; } },
  set(k, v){ try { localStorage.setItem(k, v); } catch(e){} }
};

/* ---- sound ---- */
let ac = null;
function beep(freq, dur, type, vol){
  if (muted) return;
  try {
    ac = ac || new (window.AudioContext || window.webkitAudioContext)();
    const o = ac.createOscillator(), g = ac.createGain();
    o.type = type || 'square'; o.frequency.value = freq;
    g.gain.value = vol || 0.04;
    o.connect(g); g.connect(ac.destination);
    o.start(); g.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + dur);
    o.stop(ac.currentTime + dur);
  } catch(e){}
}
const sfx = {
  good(){ beep(660, .08); setTimeout(()=>beep(880, .12), 70); },
  bad(){ beep(180, .25, 'sawtooth', .05); },
  shoot(){ beep(1200, .05, 'square', .02); },
  win(){ [523,659,784,1047].forEach((f,i)=>setTimeout(()=>beep(f,.14),i*110)); },
  lose(){ [330,262,196].forEach((f,i)=>setTimeout(()=>beep(f,.2,'sawtooth'),i*160)); }
};

/* ---- helpers ---- */
function shuffle(a){ a = a.slice(); for (let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; }
function wrap(text, maxW, font){
  ctx.font = font;
  const words = text.split(' '), lines = []; let cur = '';
  for (const w of words){
    const t = cur ? cur + ' ' + w : w;
    if (ctx.measureText(t).width > maxW && cur){ lines.push(cur); cur = w; } else cur = t;
  }
  if (cur) lines.push(cur);
  return lines;
}
function box(x, y, w, h, fill, stroke){
  ctx.fillStyle = fill; ctx.fillRect(x, y, w, h);
  if (stroke){ ctx.strokeStyle = stroke; ctx.lineWidth = 2; ctx.strokeRect(x+1, y+1, w-2, h-2); }
}
function text(t, x, y, size, color, align){
  ctx.font = 'bold ' + size + 'px ' + MONO;
  ctx.fillStyle = color || COL.white; ctx.textAlign = align || 'left'; ctx.textBaseline = 'alphabetic';
  ctx.fillText(t, x, y);
}
function hud(score, mid, lives){
  box(0, 0, W, 30, '#06061a');
  text('SCORE ' + String(score).padStart(5,'0'), 10, 21, 15, COL.yellow);
  text(mid, W/2, 21, 15, COL.cyan, 'center');
  text('LIVES ' + '♥'.repeat(Math.max(lives,0)) + '·'.repeat(Math.max(3-lives,0)), W-10, 21, 15, COL.pink, 'right');
}
let stars = Array.from({length: 40}, () => ({x: Math.random()*W, y: Math.random()*H, s: Math.random()*1.5+.5}));
function background(dt){
  ctx.fillStyle = COL.bg; ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = COL.grid;
  for (const s of stars){ if (!reduceMotion && dt){ s.y += s.s * 8 * dt; if (s.y > H) { s.y = 0; s.x = Math.random()*W; } } ctx.fillRect(s.x, s.y, s.s, s.s); }
}

/* ---- run state shared by all games ---- */
const run = { state:'title', score:0, lives:3, streak:0, right:0, wrong:0, misses:[], hsKey:'' };
function resetRun(){ run.score=0; run.lives=3; run.streak=0; run.right=0; run.wrong=0; run.misses=[]; setMsg('', ''); }
function award(base){ run.streak++; run.right++; const bonus = Math.min(run.streak-1, 5) * 10; run.score += base + bonus; sfx.good(); }
function penalize(item, explanation){ run.lives--; run.streak = 0; run.wrong++; if (item) run.misses.push({item, explanation}); sfx.bad(); }
function setMsg(kind, txt){
  const el = $('msg'); el.className = kind; el.textContent = txt;
}
function showOverlay(html){ const o = $('overlay'); o.innerHTML = html; o.hidden = false; }
function hideOverlay(){ $('overlay').hidden = true; }
function endRun(won, title){
  run.state = 'end';
  const best = parseInt(store.get(run.hsKey, '0'), 10) || 0;
  const isBest = run.score > best; if (isBest) store.set(run.hsKey, String(run.score));
  const total = run.right + run.wrong;
  const acc = total ? Math.round(100 * run.right / total) : 0;
  let review = '';
  if (run.misses.length){
    review = '<h3>Review: what to remember</h3><ul>' + run.misses.map(m => '<li><b>' + esc(m.item) + '</b><br>' + esc(m.explanation) + '</li>').join('') + '</ul>';
  } else if (won) review = '<p>Flawless run. No mistakes to review.</p>';
  won ? sfx.win() : sfx.lose();
  showOverlay('<h2>' + (won ? 'YOU WIN!' : 'GAME OVER') + '</h2>' +
    (title ? '<p>' + esc(title) + '</p>' : '') +
    '<p class="big">SCORE ' + run.score + (isBest ? ' &nbsp;★ NEW HIGH SCORE' : '') + '</p>' +
    '<p>Best: ' + Math.max(best, run.score) + ' &nbsp;·&nbsp; Accuracy: ' + acc + '%</p>' + review +
    '<p><button id="again" class="btn">PLAY AGAIN</button></p>');
  $('again').onclick = () => { hideOverlay(); startGame(); };
  $('again').focus();
}
function esc(s){ return String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])); }

/* ---- input ---- */
const keys = {}; const pressed = {};
function press(k){ if (!keys[k]) pressed[k] = true; keys[k] = true; }
function release(k){ keys[k] = false; }
addEventListener('keydown', e => {
  const map = {ArrowLeft:'left', ArrowRight:'right', ArrowUp:'up', ArrowDown:'down', ' ':'fire', a:'left', d:'right', w:'up', s:'down', p:'pause', P:'pause'};
  const k = map[e.key]; if (!k) return;
  if (!$('overlay').hidden && e.key === ' ') return;   // let the focused button handle space
  e.preventDefault(); press(k);
});
addEventListener('keyup', e => {
  const map = {ArrowLeft:'left', ArrowRight:'right', ArrowUp:'up', ArrowDown:'down', ' ':'fire', a:'left', d:'right', w:'up', s:'down'};
  const k = map[e.key]; if (k) release(k);
});
document.querySelectorAll('[data-k]').forEach(b => {
  const k = b.dataset.k;
  const on = e => { e.preventDefault(); press(k); }, off = e => { e.preventDefault(); release(k); };
  b.addEventListener('touchstart', on, {passive:false}); b.addEventListener('touchend', off, {passive:false});
  b.addEventListener('mousedown', on); b.addEventListener('mouseup', off); b.addEventListener('mouseleave', off);
});
function took(k){ if (pressed[k]){ pressed[k] = false; return true; } return false; }

/* ---- toggles ---- */
$('muteBtn').onclick = () => { muted = !muted; $('muteBtn').textContent = muted ? '🔇 Sound off' : '🔊 Sound on'; if (!muted) beep(880, .08); };
$('slowBtn').onclick = () => { slow = !slow; $('slowBtn').textContent = slow ? '🐢 Slow mode: on' : '🐢 Slow mode: off'; };
$('slowBtn').textContent = slow ? '🐢 Slow mode: on' : '🐢 Slow mode: off';

/* ---- main loop ---- */
let last = 0;
function frame(t){
  const dt = Math.min((t - last) / 1000 || 0, 0.05); last = t;
  if (took('pause') && (run.state === 'play' || run.state === 'paused')){
    run.state = run.state === 'play' ? 'paused' : 'play';
  }
  if (run.state === 'play') update(dt);
  background(run.state === 'play' ? dt : 0);
  draw(dt);
  if (run.state === 'paused'){ box(180, 200, 280, 70, 'rgba(0,0,0,.8)', COL.cyan); text('PAUSED', W/2, 232, 22, COL.cyan, 'center'); text('press P to continue', W/2, 256, 13, COL.white, 'center'); }
  for (const k in pressed) pressed[k] = false;
  requestAnimationFrame(frame);
}
function startTitle(){
  const best = parseInt(store.get(run.hsKey, '0'), 10) || 0;
  showOverlay('<h1>' + GAME.title + '</h1><p class="sub">' + GAME.subtitle + '</p>' + GAME.rules +
    '<p>High score: ' + best + '</p><p><button id="go" class="btn">START</button></p>');
  $('go').onclick = () => { hideOverlay(); startGame(); }; $('go').focus();
}
function boot(){ run.hsKey = GAME.hsKey; startTitle(); requestAnimationFrame(frame); }
