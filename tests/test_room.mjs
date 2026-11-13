// Two phones in one room play a 3-player first game through every age change, then score it.
// Usage: node tests/test_room.mjs <baseUrl> <outDir>    (against local wrangler dev: it leaves a game in the archive)
import { chromium } from 'playwright-core';
const [,, BASE, OUT] = process.argv;
const b = await chromium.launch({ channel: 'chrome' });
const mk = async () => {
  const ctx = await b.newContext({ viewport: { width: 375, height: 740 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  const p = await ctx.newPage(); p.errs = [];
  p.on('pageerror', e => p.errs.push(String(e))); p.on('console', m => m.type() === 'error' && !m.text().includes('fonts.g') && !m.text().startsWith('Failed to load resource') && p.errs.push(m.text()));
  p.on('dialog', d => d.accept());
  await p.route(/fonts\.(googleapis|gstatic)\.com/, r => r.abort());
  return p;
};
const A = await mk(), B = await mk();
let fails = 0;
const eq = (name, got, want) => { const ok = JSON.stringify(got) === JSON.stringify(want); if (!ok) fails++; console.log(ok ? 'PASS' : 'FAIL', name, ok ? '' : `got ${JSON.stringify(got)} want ${JSON.stringify(want)}`); };
const wait = ms => new Promise(r => setTimeout(r, ms));
const shot = (p, n, full = false) => p.screenshot({ path: `${OUT}/${n}.png`, fullPage: full });
const noHScroll = p => p.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1);
const sheetTitle = p => p.$eval('#sheet h3', h => h.childNodes[0].textContent).catch(() => null);

await A.goto(BASE); await wait(800); await shot(A, '00_landing');
eq('cover loads', await A.$eval('.cv', i => i.complete && i.naturalWidth > 0), true);
eq('rate link goes to the hub', (await A.getAttribute('.rate-nav', 'href')).startsWith('https://boardgame.leisurecat.cloud/?rate=through-the-ages&back='), true);
eq('teach entry', await A.textContent('.teachgo b'), '第一次玩？6 分钟讲规则');
eq('landing has no horizontal scroll', await noHScroll(A), true);
await A.click('[data-act="create"]');
await A.waitForURL(/\?r=[A-Z0-9]{4}/);
const url = A.url(); console.log('room', url);
await B.goto(url); await B.waitForSelector('.chip');

// setup
eq('defaults: first game, 3 seats', [await A.textContent('[data-act="mode"].on'), await A.$$eval('[data-k^="seat-"]', r => r.length)], ['第一局简化', 3]);
eq('no expansion chips in the first game', await A.$$eval('[data-act="exp"]', c => c.length), 0);
await B.click('[data-act="mode"][data-m="full"]'); await wait(300);
eq('A sees the expansion chips', await A.$$eval('[data-act="exp"]', c => c.map(x => x.textContent)), ['平衡修订', '新军事牌', '不用', '纯扩展', '秘密混合', '公开混合']);
await A.click('[data-act="exp"][data-key="fix"]'); await wait(300);
await A.click('[data-act="setup"]'); await wait(300);
eq('checklist: rebalanced 3-player removal', (await A.textContent('#sheet')).includes('I 3 张、II 2 张、III 1 张'), true);
await shot(A, '01_checklist'); await A.click('#sheet .sheet [data-act="close"]');
await B.click('[data-act="mode"][data-m="first"]'); await wait(300);
await A.fill('[data-name="0"]', '小林'); await B.fill('[data-name="1"]', '阿哲'); await B.press('[data-name="1"]', 'Enter'); await A.fill('[data-name="2"]', '老王'); await A.press('[data-name="2"]', 'Enter'); await wait(700);
eq('B sees names', [await B.inputValue('[data-name="0"]'), await B.inputValue('[data-name="2"]')], ['小林', '老王']);
await A.click('[data-act="first"][data-id="p2"]'); await wait(300);
eq('round 1 actions from the start player', await B.$$eval('.act1', l => l.map(x => x.textContent)), ['第一轮 3 个内政行动点', '第一轮 1 个内政行动点', '第一轮 2 个内政行动点']);
await shot(A, '02_setup', true);
eq('setup has no horizontal scroll', await noHScroll(A), true);
await A.click('[data-act="begin"]'); await wait(500);

// round 1
eq('B: Age A, round 1', await B.textContent('.status .t'), '时代 A · 第1轮');
eq('round 1 card', (await B.textContent('[data-k="r1"]')).includes('不补卡牌列'), true);
await shot(B, '03_round1', true);
await A.click('[data-act="round"]'); await wait(500);
eq('both phones pop up the Age A end', [await sheetTitle(A), await sheetTitle(B)], ['时代 A 结束，时代 I 开始', '时代 A 结束，时代 I 开始']);
await shot(B, '04_ageA');
await B.click('#sheet .sheet .btn:not(.ghost)'); await A.click('#sheet .sheet .btn:not(.ghost)');
eq('status: Age I round 2, remove 2', [await B.textContent('.status .t'), (await B.textContent('.status .s')).includes('前 2 格')], ['时代 I · 第2轮', true]);

// Age I ends on someone's turn
await B.click('[data-act="agego"]'); await wait(200);
eq('confirm sheet', await sheetTitle(B), '时代 I 的内政牌发完了？');
await B.click('[data-act="agedo"]'); await wait(500);
eq('A pops up the Age I end', await sheetTitle(A), '时代 I 结束，时代 II 开始');
const steps = await A.textContent('#sheet .sl');
eq('Age I end: Age A antiquated, lose 2 yellow', [steps.includes('时代 A 牌'), steps.includes('失去 2 个黄色标记')], [true, true]);
await shot(A, '05_ageI');
await A.click('#sheet .sheet .btn:not(.ghost)'); await B.click('#sheet .sheet .btn:not(.ghost)');
await A.click('[data-act="ack"][data-id="p1"]'); await wait(300);
eq('B sees who has done the cleanup', await B.textContent('[data-k="ack-2"] small'), '1/3 人做完');
await A.click('[data-act="undo"]'); await wait(400);
eq('undo the age change: back to Age I, no popup', [await B.textContent('.status .t'), await sheetTitle(B)], ['时代 I · 第2轮', null]);
await B.click('[data-act="agego"]'); await B.click('[data-act="agedo"]'); await wait(500);
await A.click('#sheet .sheet .btn:not(.ghost)'); await B.click('#sheet .sheet .btn:not(.ghost)');
await A.click('[data-act="round"]'); await wait(300);

// Age II ends during someone else's turn: the next round is the last
await A.click('[data-act="agego"]'); await wait(200);
eq('final age asks whose turn', await A.$$eval('[data-act="agedo"]', l => l.map(x => x.textContent)), ['是起始玩家的回合', '是别人的回合']);
await A.click('[data-act="agedo"][data-s="0"]'); await wait(500);
eq('B: last-age steps say next round is last', (await B.textContent('#sheet .sl')).includes('下一轮是最后一轮'), true);
await B.click('#sheet .sheet .btn:not(.ghost)'); await A.click('#sheet .sheet .btn:not(.ghost)');
eq('banner: next round is last', await B.textContent('.banner'), '下一轮是最后一轮');
eq('no resigning in the last age', await B.$eval('[data-act="resignp"]', b => b.disabled), true);
await B.click('[data-act="turn"]'); await wait(200);
eq('turn reference sheet', (await B.textContent('#sheet')).includes('缺 1 食物扣 4 文化'), true);
await shot(B, '06_turnref'); await B.click('#sheet .sheet [data-act="close"]');
await A.click('[data-act="round"]'); await wait(300);
eq('banner: this round is last, ends with the player right of the start', (await B.textContent('.banner')).includes('本轮是最后一轮：小林 打完就结束'), true);
await shot(B, '07_lastround', true);
await B.click('[data-act="end"]'); await wait(500);

// scoring
eq('A banner: game over', (await A.textContent('.banner')).includes('游戏结束'), true);
await A.click('[data-act="goto"]'); await wait(200);
await A.click('[data-act="me"][data-id="p1"]'); await B.click('[data-act="tab"][data-tab="score"]'); await B.click('[data-act="me"][data-id="p2"]'); await wait(300);
const fill = async (p, id, key, digits) => {
  await p.click(`[data-act="cell"][data-id="${id}"][data-key="${key}"]`);
  for (const d of String(digits)) await p.click(`#sheet [data-k="${d}"]`);
  await p.click('#sheet [data-k="ok"]'); await wait(150);
};
for (const [k, v] of Object.entries({ culture: 40, t1: 5, t2: 3, sci: 4, str: 9, happy: 5, prod: 8, col: 1, w2: 1 })) await fill(A, 'p1', k, v);
await A.click('[data-act="gov"][data-id="p1"][data-v="2"]'); await wait(300);
eq('A total = 88', await A.textContent('.ms-tot b'), '88');
await shot(A, '08_myscore', true);
await fill(B, 'p2', 'culture', 50); await fill(B, 'p2', 't2', 2);
await B.click('[data-act="view"][data-v="all"]'); await wait(200);
await fill(B, 'p3', 'culture', 61);
eq('full table totals', await B.$$eval('[data-k="sr-total"] .tt', l => l.map(x => x.textContent)), ['88', '54', '61']);
await shot(B, '09_table', true);
eq('table has no horizontal scroll', await noHScroll(B), true);
await B.click('[data-act="tab"][data-tab="mvp"]'); await wait(300);
eq('winner', await B.textContent('.mvp .nm'), '小林');
eq('achievements', await B.$$eval('.ach .an', l => l.map(x => x.textContent)), ['文明之巅', '一路领跑', '启蒙之光', '铁血军团', '盛世安康', '丰饶之地']);
await shot(B, '10_results', true);
await B.route('https://boardgame.leisurecat.cloud/api/reviews', r => r.fulfill({ status: 200, body: '{"ok":true}', contentType: 'application/json' }));
await B.click('[data-act="save"]'); await B.waitForSelector('.shotv img', { timeout: 15000 });
eq('result image made', await B.$eval('.shotv img', i => i.src.startsWith('data:image/jpeg')), true);
await B.click('.shotv button');

eq('no page errors', [...A.errs, ...B.errs], []);
await b.close();
console.log(fails ? `\n${fails} FAILED` : '\nALL PASS');
process.exit(fails ? 1 : 0);
