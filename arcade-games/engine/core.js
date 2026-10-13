/* ===== Arcade core v2 (shared by all games, bilingual DE/EN) ===== */
const W = 640, H = 480;
const cv = document.getElementById('cv');
const ctx = cv.getContext('2d');
const $ = id => document.getElementById(id);
const COL = { bg:'#0b0b2b', grid:'#1a1a55', green:'#39ff14', yellow:'#ffd400', pink:'#ff4df0', cyan:'#00e5ff', orange:'#ff6a00', red:'#ff3355', white:'#f4f4ff', dim:'#8a8ac0' };
const LANE_COLORS = [COL.green, COL.pink, COL.yellow, COL.cyan, COL.orange, COL.red];
const MONO = "'Courier New', Courier, monospace";
const reduceMotion = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
let slow = reduceMotion, muted = true;
const speedF = () => slow ? 0.6 : 1;

/* ---- storage (never fails) ---- */
const store = {
  get(k, d){ try { const v = localStorage.getItem(k); return v === null ? d : v; } catch(e){ return d; } },
  set(k, v){ try { localStorage.setItem(k, v); } catch(e){} }
};

/* ---- language ---- */
const UI = {
  en: { score:'SCORE', lives:'LIVES', paused:'PAUSED', pauseHint:'press P to continue', feedback0:'Feedback appears here after every move.',
        soundOff:'🔇 Sound off', soundOn:'🔊 Sound on', slowOn:'🐢 Slow mode: on', slowOff:'🐢 Slow mode: off', start:'START', again:'PLAY AGAIN',
        win:'YOU WIN!', over:'GAME OVER', best:'Best', accuracy:'Accuracy', highScore:'High score', newHigh:'NEW HIGH SCORE',
        review:'Review: what to remember', flawless:'Flawless run. No mistakes to review.', langBtn:'Deutsch', pauseKey:'P = pause',
        pad:{left:'Move left', right:'Move right', up:'Up', down:'Down', fire:'Fire'}, fireLabel:'FIRE' },
  de: { score:'PUNKTE', lives:'LEBEN', paused:'PAUSE', pauseHint:'P drücken zum Weiterspielen', feedback0:'Hier erscheint nach jedem Zug die Rückmeldung.',
        soundOff:'🔇 Ton aus', soundOn:'🔊 Ton an', slowOn:'🐢 Langsam-Modus: an', slowOff:'🐢 Langsam-Modus: aus', start:'START', again:'NOCH MAL',
        win:'GEWONNEN!', over:'GAME OVER', best:'Bestwert', accuracy:'Treffer', highScore:'Highscore', newHigh:'NEUER HIGHSCORE',
        review:'Zum Wiederholen', flawless:'Fehlerfreier Durchgang. Nichts zu wiederholen.', langBtn:'English', pauseKey:'P = Pause',
        pad:{left:'Nach links', right:'Nach rechts', up:'Hoch', down:'Runter', fire:'Schuss'}, fireLabel:'FEUER' }
};
let lang = (function(){
  const s = store.get('arcade-lang', ''); if (s === 'de' || s === 'en') return s;
  return ((navigator.language || 'en').toLowerCase().indexOf('de') === 0) ? 'de' : 'en';
})();
const U = k => UI[lang][k];
const D = () => DATA[lang];          // content of the current language
const G = k => GT[lang][k];          // generic game strings (defined in each game file)

/* ---- sound ---- */
let ac = null;
function beep(freq, dur, type, vol){
  if (muted) return;
  try {
    ac = ac || new (window.AudioContext || window.webkitAudioContext)();
    const o = ac.createOscillator(), g = ac.createGain();
    o.type = type || 'square'; o.frequency.value = freq; g.gain.value = vol || 0.04;
    o.connect(g); g.connect(ac.destination); o.start();
    g.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + dur); o.stop(ac.currentTime + dur);
  } catch(e){}
}
const sfx = {
  good(){ beep(660, .08); setTimeout(()=>beep(880, .12), 70); }, bad(){ beep(180, .25, 'sawtooth', .05); }, shoot(){ beep(1200, .05, 'square', .02); },
  win(){ [523,659,784,1047].forEach((f,i)=>setTimeout(()=>beep(f,.14),i*110)); }, lose(){ [330,262,196].forEach((f,i)=>setTimeout(()=>beep(f,.2,'sawtooth'),i*160)); }
};

/* ---- helpers ---- */
function shuffle(a){ a = a.slice(); for (let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; }
function wrap(t, maxW, font){
  ctx.font = font; const words = String(t).split(' '), lines = []; let cur = '';
  for (const w of words){ const x = cur ? cur + ' ' + w : w; if (ctx.measureText(x).width > maxW && cur){ lines.push(cur); cur = w; } else cur = x; }
  if (cur) lines.push(cur); return lines;
}
function box(x, y, w, h, fill, stroke){ ctx.fillStyle = fill; ctx.fillRect(x, y, w, h); if (stroke){ ctx.strokeStyle = stroke; ctx.lineWidth = 2; ctx.strokeRect(x+1, y+1, w-2, h-2); } }
function text(t, x, y, size, color, align){ ctx.font = 'bold ' + size + 'px ' + MONO; ctx.fillStyle = color || COL.white; ctx.textAlign = align || 'left'; ctx.textBaseline = 'alphabetic'; ctx.fillText(t, x, y); }
function hud(score, mid, lives){
  box(0, 0, W, 30, '#06061a');
  text(U('score') + ' ' + String(score).padStart(5,'0'), 10, 21, 15, COL.yellow);
  text(mid, W/2, 21, 15, COL.cyan, 'center');
  text(U('lives') + ' ' + '♥'.repeat(Math.max(lives,0)) + '·'.repeat(Math.max(3-lives,0)), W-10, 21, 15, COL.pink, 'right');
}
let stars = Array.from({length: 40}, () => ({x: Math.random()*W, y: Math.random()*H, s: Math.random()*1.5+.5}));
function background(dt){
  ctx.fillStyle = COL.bg; ctx.fillRect(0, 0, W, H); ctx.fillStyle = COL.grid;
  for (const s of stars){ if (!reduceMotion && dt){ s.y += s.s * 8 * dt; if (s.y > H){ s.y = 0; s.x = Math.random()*W; } } ctx.fillRect(s.x, s.y, s.s, s.s); }
}
const esc = s => String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

/* ---- run state ---- */
const run = { state:'title', score:0, lives:3, streak:0, right:0, wrong:0, misses:[], hsKey:'' };
function resetRun(){ run.score=0; run.lives=3; run.streak=0; run.right=0; run.wrong=0; run.misses=[]; setMsg('', ''); }
function award(base){ run.streak++; run.right++; run.score += base + Math.min(run.streak-1, 5) * 10; sfx.good(); }
function penalize(item, explanation){ run.lives--; run.streak = 0; run.wrong++; if (item) run.misses.push({item, explanation}); sfx.bad(); }
function setMsg(kind, t){ const el = $('msg'); el.className = kind; el.textContent = t; }
function showOverlay(html){ const o = $('overlay'); o.innerHTML = html; o.hidden = false; o.scrollTop = 0; }
function hideOverlay(){ $('overlay').hidden = true; }
function langButtonHtml(){ return '<p><button id="olang" class="btn alt" aria-label="Language / Sprache">🌐 ' + U('langBtn') + '</button></p>'; }
function bindLang(rerender){ const b = $('olang'); if (b) b.onclick = () => { setLang(lang === 'de' ? 'en' : 'de'); rerender(); }; }

function endRun(won, sub){
  run.state = 'end';
  const best = parseInt(store.get(run.hsKey, '0'), 10) || 0;
  const isBest = run.score > best; if (isBest) store.set(run.hsKey, String(run.score));
  const total = run.right + run.wrong, acc = total ? Math.round(100 * run.right / total) : 0;
  const render = () => {
    let review = '';
    if (run.misses.length) review = '<h3>' + U('review') + '</h3><ul>' + run.misses.map(m => '<li><b>' + esc(m.item) + '</b><br>' + esc(m.explanation) + '</li>').join('') + '</ul>';
    else if (won) review = '<p>' + U('flawless') + '</p>';
    showOverlay('<h2>' + (won ? U('win') : U('over')) + '</h2>' + (sub ? '<p>' + esc(sub) + '</p>' : '') +
      '<p class="big">' + U('score') + ' ' + run.score + (isBest ? ' &nbsp;★ ' + U('newHigh') : '') + '</p>' +
      '<p>' + U('best') + ': ' + Math.max(best, run.score) + ' &nbsp;·&nbsp; ' + U('accuracy') + ': ' + acc + '%</p>' + review +
      '<p><button id="again" class="btn">' + U('again') + '</button></p>' + langButtonHtml());
    $('again').onclick = () => { hideOverlay(); startGame(); }; bindLang(render); $('again').focus();
  };
  won ? sfx.win() : sfx.lose();
  endSub = sub; render();
}
let endSub = '';

/* ---- input ---- */
const keys = {}, pressed = {};
function press(k){ if (!keys[k]) pressed[k] = true; keys[k] = true; }
function release(k){ keys[k] = false; }
const KEYMAP = {ArrowLeft:'left', ArrowRight:'right', ArrowUp:'up', ArrowDown:'down', ' ':'fire', a:'left', d:'right', w:'up', s:'down', p:'pause', P:'pause'};
addEventListener('keydown', e => { const k = KEYMAP[e.key]; if (!k) return; if (!$('overlay').hidden && e.key === ' ') return; e.preventDefault(); press(k); });
addEventListener('keyup', e => { const k = KEYMAP[e.key]; if (k && k !== 'pause') release(k); });
document.querySelectorAll('[data-k]').forEach(b => {
  const k = b.dataset.k, on = e => { e.preventDefault(); press(k); }, off = e => { e.preventDefault(); release(k); };
  b.addEventListener('touchstart', on, {passive:false}); b.addEventListener('touchend', off, {passive:false});
  b.addEventListener('mousedown', on); b.addEventListener('mouseup', off); b.addEventListener('mouseleave', off);
});
function took(k){ if (pressed[k]){ pressed[k] = false; return true; } return false; }

/* ---- static texts and toggles ---- */
function applyStatic(){
  document.documentElement.lang = lang;
  $('muteBtn').textContent = muted ? U('soundOff') : U('soundOn');
  $('slowBtn').textContent = slow ? U('slowOn') : U('slowOff');
  $('langBtn').textContent = '🌐 ' + U('langBtn');
  $('hint').textContent = (D().keys ? D().keys + ' · ' : '') + U('pauseKey');
  document.title = D().title;
  document.querySelectorAll('[data-k]').forEach(b => { const k = b.dataset.k; b.setAttribute('aria-label', U('pad')[k] || k); if (k === 'fire') b.textContent = U('fireLabel'); });
  if (!$('msg').className) $('msg').textContent = U('feedback0');
}
function setLang(l){ lang = l; store.set('arcade-lang', l); applyStatic(); }
$('muteBtn').onclick = () => { muted = !muted; applyStatic(); if (!muted) beep(880, .08); };
$('slowBtn').onclick = () => { slow = !slow; applyStatic(); };
$('langBtn').onclick = () => { setLang(lang === 'de' ? 'en' : 'de'); if (run.state === 'play' || run.state === 'paused' || run.state === 'end'){ run.state = 'title'; setMsg('', ''); $('msg').textContent = U('feedback0'); startTitle(); } else if (run.state === 'title') startTitle(); };

/* ---- main loop ---- */
let last = 0;
function frame(t){
  const dt = Math.min((t - last) / 1000 || 0, 0.05); last = t;
  if (took('pause') && (run.state === 'play' || run.state === 'paused')) run.state = run.state === 'play' ? 'paused' : 'play';
  if (run.state === 'play') update(dt);
  background(run.state === 'play' ? dt : 0);
  if (run.state !== 'title') draw(dt);
  if (run.state === 'paused'){ box(150, 200, 340, 70, 'rgba(0,0,0,.85)', COL.cyan); text(U('paused'), W/2, 232, 22, COL.cyan, 'center'); text(U('pauseHint'), W/2, 256, 13, COL.white, 'center'); }
  for (const k in pressed) pressed[k] = false;
  requestAnimationFrame(frame);
}
function startTitle(){
  run.state = 'title';
  const best = parseInt(store.get(run.hsKey, '0'), 10) || 0;
  showOverlay('<h1>' + esc(D().title) + '</h1><p class="sub">' + esc(D().subtitle) + '</p>' + G('rules') +
    '<p>' + U('highScore') + ': ' + best + '</p><p><button id="go" class="btn">' + U('start') + '</button></p>' + langButtonHtml());
  $('go').onclick = () => { hideOverlay(); startGame(); }; bindLang(startTitle); $('go').focus();
  applyStatic();
}
function boot(){ run.hsKey = GAME_KEY; startTitle(); requestAnimationFrame(frame); }
