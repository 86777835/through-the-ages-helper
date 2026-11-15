// 「打印」 on the results tab: a 1200×1800 photo poster with every player's name and total in finishing order.
// Plays a 2-player first game, a 3-player short game and a 4-player full game over the room WebSocket, then prints each.
// Usage: node tests/test_poster.mjs <base-url> <shots-dir>   (local wrangler dev only: it leaves games in the archive)
import { chromium } from 'playwright-core';
import { writeFileSync } from 'node:fs';
const [base, out] = process.argv.slice(2);
const api = p => new URL(p, base).href;
const wait = ms => new Promise(r => setTimeout(r, ms));
let fails = 0; const eq = (n, g, w) => { const ok = JSON.stringify(g) === JSON.stringify(w); if (!ok) fails++; console.log(ok ? 'PASS' : 'FAIL', n, ok ? '' : `got ${JSON.stringify(g)} want ${JSON.stringify(w)}`); };

async function play(n, mode, names, scores) {
  const { code } = await (await fetch(api('/api/room'), { method: 'POST' })).json();
  const ws = new WebSocket(api(`/api/room/${code}/ws`).replace(/^http/, 'ws'));
  let S = null; ws.onmessage = e => { const m = JSON.parse(e.data); if (m.type === 'state') S = m.state; };
  await new Promise(r => ws.onopen = r); await wait(300);
  const send = async action => { const v = S?.v ?? -1; ws.send(JSON.stringify({ action })); for (let i = 0; i < 100 && !(S && S.v > v); i++) await wait(30); };
  await send({ t: 'setN', n }); await send({ t: 'mode', mode });
  for (const [i, nm] of names.entries()) await send({ t: 'player', i, name: nm });
  await send({ t: 'begin' }); await send({ t: 'round', round: 1 });
  const last = mode === 'first' ? 2 : 3;
  for (let a = 1; a < last; a++) await send({ t: 'age', age: a });
  await send({ t: 'age', age: last, starter: true }); await send({ t: 'end' });
  if (mode !== 'first') await send({ t: 'ev', list: ['科学影响', '文化影响'] });
  for (const [i, sc] of scores.entries()) for (const [key, value] of Object.entries(sc)) await send({ t: 'score', id: S.players[i].id, key, value: String(value) });
  ws.close();
  return code;
}

const b = await chromium.launch({ channel: 'chrome' });
async function print(code, label, want) {
  const page = await (await b.newContext({ viewport: { width: 375, height: 740 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true })).newPage();
  const errs = []; page.on('pageerror', e => errs.push(e.message));
  await page.route('https://boardgame.leisurecat.cloud/api/reviews', r => r.fulfill({ status: 200, body: '{"ok":true}', contentType: 'application/json' }));
  await page.route(/fonts\.(googleapis|gstatic)\.com/, r => r.abort());
  await page.addInitScript(() => localStorage.setItem('tta-tab', 'mvp'));
  await page.goto(api(`/?r=${code}`)); await page.waitForSelector('[data-act="poster"]');
  // keep the poster's text: the page removes the poster node after capturing it
  await page.evaluate(() => { new MutationObserver(ms => ms.forEach(m => m.addedNodes.forEach(n => { if (n.id === 'poster') setTimeout(() => { window.__poster = { names: [...n.querySelectorAll('.pw b')].map(x => x.textContent), totals: [...n.querySelectorAll('.pt')].map(x => x.textContent), places: [...n.querySelectorAll('.pp')].map(x => x.textContent), minFont: Math.min(...[...n.querySelectorAll('*')].filter(x => x.textContent.trim() && !x.children.length && !x.matches('.pu')).map(x => parseFloat(getComputedStyle(x).fontSize))), gap: (() => { const ch = n.querySelector('.pch'), rs = [...n.querySelectorAll('.pr')], f = n.querySelector('.pf').getBoundingClientRect(); return Math.min(ch ? rs[0].getBoundingClientRect().top - ch.getBoundingClientRect().bottom : 99, f.top - rs.at(-1).getBoundingClientRect().bottom); })(), edge: Math.min(...[...n.querySelectorAll('.pr,.pf')].flatMap(x => { const r = x.getBoundingClientRect(), p = n.getBoundingClientRect(); return [r.left - p.left, p.right - r.right, r.top - p.top, p.bottom - r.bottom]; })) }; }, 0); }))).observe(document.documentElement, { childList: true, subtree: true }); });
  eq(`${label}: print button on the results tab`, await page.textContent('[data-act="poster"]'), '打印');
  await page.click('[data-act="poster"]'); await page.waitForSelector('.shotv img', { timeout: 20000 });
  const img = await page.$eval('.shotv img', i => new Promise(r => i.complete ? r([i.naturalWidth, i.naturalHeight, i.src]) : i.onload = () => r([i.naturalWidth, i.naturalHeight, i.src])));
  eq(`${label}: 1200×1800 JPEG`, [img[0], img[1], img[2].startsWith('data:image/jpeg')], [1200, 1800, true]);
  writeFileSync(`${out}/poster_${label}.jpg`, Buffer.from(img[2].split(',')[1], 'base64'));
  const P = await page.evaluate(() => window.__poster);
  eq(`${label}: names and totals in finishing order`, [P.names, P.totals, P.places], want);
  eq(`${label}: text at least 20 CSS px (40 px printed)`, P.minFont >= 20, true);
  eq(`${label}: player rows and footer at least 30 CSS px (60 px) from the edges`, P.edge >= 30, true);
  eq(`${label}: nothing overlaps (medallion, rows, footer)`, P.gap >= 8, true);
  eq(`${label}: download name and hint`, [await page.getAttribute('.shotv a', 'download'), await page.textContent('.sv-top span')], [`历史巨轮海报-${code}.jpg`, '长按保存到相册，用打印机 App 选 3 寸相纸打印']);
  eq(`${label}: poster node removed afterwards`, await page.$('#poster'), null);
  eq(`${label}: no page errors`, errs, []);
  await page.context().close();
}

const c2 = await play(2, 'first', ['小林', '阿哲'], [{ culture: 52, t1: 4, t2: 2, gov: 1, sci: 5, str: 6, happy: 4, prod: 9, col: 1, w2: 1 }, { culture: 61, t1: 3, sci: 3, str: 4 }]);
await print(c2, '2p', [['小林', '阿哲'], ['94', '71'], ['冠', '2']]);
const c3 = await play(3, 'short', ['甲', '乙乙', '丙丙丙'], [{ culture: 90, w2: 2, e0: 5 }, { culture: 95, e1: 8 }, { culture: 70 }]);
await print(c3, '3p', [['甲', '乙乙', '丙丙丙'], ['107', '103', '70'], ['冠', '2', '3']]);
const c4 = await play(4, 'full', ['欧阳长名字', '老王', '小美', 'Kevin'], [{ culture: 180, e0: 14, e1: 7 }, { culture: 196, e0: 7, e1: 14, bonus: 6 }, { culture: 150, e0: 0, e1: 0 }, { culture: 201 }]);
await print(c4, '4p', [['老王', '欧阳长名字', 'Kevin', '小美'], ['223', '201', '201', '150'], ['冠', '2', '2', '4']]);
await b.close();
console.log(fails ? `${fails} FAILED` : 'ALL PASS');
process.exit(fails ? 1 : 0);
