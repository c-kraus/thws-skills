#!/usr/bin/env node
// overflow_scan.js — meldet Folien, deren Inhalt über den unteren Rand hinausreicht.
// Aufruf: node overflow_scan.js THEME_DIR datei1.md [datei2.md ...]
// Voraussetzung: @marp-team/marp-cli global installiert (npm i -g @marp-team/marp-cli), Chrome vorhanden.
// Rendert die Dateien in Chrome, meldet Überlauf und Renderfehler (Exit-Code 1 bei Fehler).
// Hinweise: Vollbild-Bildfolien (class: fullscreen) können als Fehlalarm erscheinen.
//           Schwelle: Inhalt bis weniger als 12 px vor dem Folienrand wird gemeldet.
const fs = require('fs'), path = require('path'), { execSync } = require('child_process');
const [themeDir, ...files] = process.argv.slice(2);
if (!themeDir || files.length === 0) { console.error('Aufruf: node overflow_scan.js THEME_DIR datei.md ...'); process.exit(1); }
const root = execSync('npm root -g').toString().trim();
const base = path.join(root, '@marp-team/marp-cli/node_modules/');
const { Marp } = require(base + '@marp-team/marp-core');
const puppeteer = require(base + 'puppeteer-core');
const chrome = process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
(async () => {
  const browser = await puppeteer.launch({ executablePath: chrome, headless: 'new', args: ['--allow-file-access-from-files'] });
  const tmp = path.join(require('os').tmpdir(), 'marp_scan.html');
  for (const f of files) {
    const marp = new Marp({ html: true, math: 'mathjax' });
    marp.themeSet.add(fs.readFileSync(path.join(themeDir, 'thws.css'), 'utf8'));
    marp.themeSet.add(fs.readFileSync(path.join(themeDir, 'thws-pr.css'), 'utf8'));
    // Renderfehler (z. B. MathJax) abfangen: Marp meldet sie nur auf console.error und rendert weiter.
    const errors = [];
    const saved = { error: console.error, warn: console.warn, log: console.log, write: process.stderr.write.bind(process.stderr) };
    const grab = (...a) => { errors.push(a.map(String).join(' ').split('\n')[0]); };
    console.error = grab; console.warn = grab; console.log = grab;
    process.stderr.write = (chunk) => { errors.push(String(chunk).split('\n')[0]); return true; };
    let rendered;
    try { rendered = marp.render(fs.readFileSync(f, 'utf8')); } catch (e) { errors.push(String(e).split('\n')[0]); }
    console.error = saved.error; console.warn = saved.warn; console.log = saved.log; process.stderr.write = saved.write;
    if (errors.length) { console.log(path.basename(f) + ': FEHLER beim Rendern: ' + [...new Set(errors)].join(' | ')); process.exitCode = 1; }
    if (!rendered) continue;
    const { html, css } = rendered;
    fs.writeFileSync(tmp, `<!doctype html><meta charset=utf-8><base href="file://${path.dirname(path.resolve(f))}/"><style>${css}</style>${html}`);
    const page = await browser.newPage();
    await page.setViewport({ width: 1400, height: 900 });
    await page.goto('file://' + tmp, { waitUntil: 'networkidle2', timeout: 60000 }).catch(() => {});
    await new Promise(r => setTimeout(r, 1500));
    const res = await page.evaluate(() => [...document.querySelectorAll('section')].map((s, i) => {
      const r = s.getBoundingClientRect(); let max = 0;
      s.querySelectorAll('*').forEach(e => { const b = e.getBoundingClientRect(); if (b.height > 0 && b.width > 0) max = Math.max(max, b.bottom - r.top); });
      return { i: i + 1, h: r.height, max: Math.round(max), over: Math.round(max - r.height), t: (s.querySelector('h1,h2,h3') || {}).textContent || '' };
    }).filter(x => x.over > -12));
    console.log(path.basename(f) + ': ' + (res.length ? res.map(r => `#${r.i} "${r.t.trim().slice(0, 40)}" (Inhalt bis ${r.max}px von ${r.h}px)`).join('; ') : 'ok'));
    await page.close();
  }
  await browser.close();
})();
