// Past-games archive + landing layout. Plays a 2-player full game over the room WebSocket, then checks
// /api/games and the history page, undo/redo/reset behavior, and that create/join stay on screen with many rooms.
// Usage: node tests/test_history.mjs <base-url> <shots-dir> [--many-rooms | --live]
// The full run leaves an archived game behind, so run it against a local `wrangler dev`.
// --live stops after the undo check, so the test game's record is removed again (safe on the live site).
import { chromium } from 'playwright-core';
const [base, out, flag] = process.argv.slice(2);
const many = flag === '--many-rooms', live = flag === '--live';
const api = p => new URL(p, base).href;
let fails = 0;
const eq = (name, got, want) => { const ok = JSON.stringify(got) === JSON.stringify(want); if (!ok) fails++; console.log(ok ? 'PASS' : 'FAIL', name, ok ? '' : `got ${JSON.stringify(got)} want ${JSON.stringify(want)}`); };
const wait = ms => new Promise(r => setTimeout(r, ms));
const games = async q => (await fetch(api('/api/games' + (q ? '?q=' + encodeURIComponent(q) : '')))).json();

const { code } = await (await fetch(api('/api/room'), { method: 'POST' })).json();
const ws = new WebSocket(api(`/api/room/${code}/ws`).replace(/^http/, 'ws'));
let S = null; ws.onmessage = e => { const m = JSON.parse(e.data); if (m.type === 'state') S = m.state; };
await new Promise(r => ws.onopen = r);
const send = async action => { const v = S?.v ?? -1; ws.send(JSON.stringify({ action })); for (let i = 0; i < 100 && !(S && S.v > v); i++) await wait(30); };
await wait(300);
const name = '测试' + code;
await send({ t: 'setN', n: 2 });
await send({ t: 'mode', mode: 'full' });
await send({ t: 'player', i: 0, name });
await send({ t: 'player', i: 1, name: '对手' });
await send({ t: 'begin' });
eq('game id set at start', typeof S.gid, 'string');
const [p1, p2] = S.players.slice(0, 2).map(p => p.id);
await send({ t: 'round', round: 1 }); await send({ t: 'age', age: 1 }); await send({ t: 'age', age: 2 }); await send({ t: 'age', age: 3, starter: false });
await send({ t: 'round', round: S.round }); await send({ t: 'end' });
eq('Age IV, next round was last, then over', [S.stage, S.age, S.round], ['over', 4, 3]);
await send({ t: 'ev', list: ['科学影响'] });
await send({ t: 'score', id: p1, key: 'culture', value: '80' });
await send({ t: 'score', id: p1, key: 'e0', value: '14' });
await send({ t: 'score', id: p2, key: 'culture', value: '70' });
await send({ t: 'score', id: p2, key: 'e0', value: '7' });
let g;
for (let i = 0; i < 20 && !(g?.players[0].total === 94 && g?.players[1].total === 77); i++) { await wait(300); g = (await games(code))[0]; }   // archive write lands after the broadcast
eq('archived by room code', g?.code, code);
eq('winner first, culture and events kept', [g?.players[0].name, g?.players[0].total, g?.players[0].place, g?.players[0].culture, g?.players[0].events], [name, 94, 1, 80, 14]);
eq('runner-up', [g?.players[1].name, g?.players[1].total, g?.players[1].events], ['对手', 77, 7]);
eq('mode and rounds recorded', [g?.n, g?.exp, g?.rounds], [2, 'full', 3]);
eq('search by mode', (await games('完整')).some(x => x.gid === g.gid), true);
eq('search by player name', (await games(name)).some(x => x.gid === g.gid), true);
eq('search miss', (await games('不存在的玩家xyz')).length, 0);
const stats = async name => (await fetch(api('/api/stats' + (name ? '?name=' + encodeURIComponent(name) : '')))).json();
{ const g2 = (await stats(name)).find(x => x.n === 2 && x.exp === 'full');
  eq('stats: 2-player full-game group has this player', [g2?.games >= 1, g2?.me], [true, { games: 1, best: 94, avg: 94 }]); }

const b = await chromium.launch({ channel: 'chrome' });
const page = await (await b.newContext({ viewport: { width: 375, height: 667 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true })).newPage();
const errs = []; page.on('pageerror', e => errs.push(e.message));
await page.goto(base); await page.click('a[href="history"]'); await page.waitForSelector('.game');
await page.fill('#q', name); await page.click('#search button'); await wait(600);
eq('history page search shows 1 game', await page.$$eval('.game', x => x.length), 1);
eq('score references show this player', (await page.textContent('.st')).includes('最高 94'), true);
eq('summary winner score', await page.textContent('.game .gp .win em'), '94');
eq('summary names the expansion', (await page.textContent('.game .gh span')).includes('2 人 · 完整游戏 · 3 轮'), true);
await page.screenshot({ path: out + '/h_list.png' });
await page.click('.game summary'); await wait(200);
eq('details rows', await page.$$eval('.game .gd .row', x => x.length), 2);
await page.screenshot({ path: out + '/h_open.png' });

await send({ t: 'undo' }); await wait(400);
eq('undoing the end of the game removes the record', (await games(code)).length, 0);
if (live) { await send({ t: 'reset' }); ws.close();   // back to setup so the room leaves the public list
  await b.close(); eq('no page errors', errs, []); console.log(fails ? `${fails} FAILED` : 'ALL PASS'); process.exit(fails ? 1 : 0); }
await send({ t: 'end' }); await wait(400);
eq('ending again restores record with scores', (await games(code))[0]?.players[0].total, 94);
await send({ t: 'reset' }); await wait(400);
eq('reset keeps record', (await games(code)).length, 1);
ws.close();

if (many) {
  for (let i = 0; i < 12; i++) { const r = await (await fetch(api('/api/room'), { method: 'POST' })).json(); const w = new WebSocket(api(`/api/room/${r.code}/ws`).replace(/^http/, 'ws')); await new Promise(res => w.onopen = res); }
  await wait(500);
}
await page.goto(base); await page.waitForSelector('.lobby'); await wait(300);
const box = async sel => (await page.$(sel)).boundingBox();
const bottom = Math.max(...await Promise.all(['[data-act="create"]', '[data-act="join"]', 'a[href="history"]'].map(async s => { const r = await box(s); return r.y + r.height; })));
eq('create/join/history on first screen', bottom <= 667, true);
console.log('rooms listed:', await page.$$eval('.lobby', x => x.length), 'lowest button bottom:', Math.round(bottom));
await page.screenshot({ path: out + '/h_landing.png' });
eq('no page errors', errs, []);
await b.close();
console.log(fails ? `${fails} FAILED` : 'ALL PASS');
process.exit(fails ? 1 : 0);
