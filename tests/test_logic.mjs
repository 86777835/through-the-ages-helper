// Rules unit tests (no server). Usage: node tests/test_logic.mjs
import { initialState, reduce, parts, results, gameRecord, inGame, fromStart, rowRemove, lastAge, scoreKeys } from '../public/logic.js';
import { setupList, ageSteps, turnRef, dontForget } from '../public/steps.js';

let fails = 0;
const eq = (name, got, want) => { const ok = JSON.stringify(got) === JSON.stringify(want); if (!ok) fails++; console.log(ok ? 'PASS' : 'FAIL', name, ok ? '' : `got ${JSON.stringify(got)} want ${JSON.stringify(want)}`); };
const run = (s, ...acts) => acts.reduce((x, a) => { const y = reduce(x, a); if (!y) throw new Error('rejected ' + JSON.stringify(a)); return y; }, s);
const text = secs => secs.flatMap(s => s.items.map(i => i.t)).join('\n');

// setup
let S = initialState();
eq('defaults: 3 players, first game', [S.n, S.mode], [3, 'first']);
eq('2–4 players only', [reduce(S, { t: 'setN', n: 1 }), reduce(S, { t: 'setN', n: 5 })], [null, null]);
eq('no expansion in the first game', reduce(S, { t: 'exp', key: 'fix', v: true }), null);
S = run(S, { t: 'setN', n: 4 }, { t: 'first', id: 'p3' });
eq('round 1 actions from the start player', fromStart(S), ['p3', 'p4', 'p1', 'p2']);
eq('card row removal by players', [2, 3, 4].map(rowRemove), [3, 2, 1]);

// setup checklist
let L = text(setupList(S));
eq('first game: Age III decks back in the box', L.includes('两叠都放回盒子'), true);
eq('4 players: no card removal', L.includes('删去标'), false);
eq('events deck = players + 2', L.includes('<b>6 张</b>（人数 + 2）'), true);
let F = run(initialState(), { t: 'mode', mode: 'full' }, { t: 'setN', n: 2 });
L = text(setupList(F));
eq('2 players: 9 cards per age and pacts', [L.includes('I 9 张、II 9 张、III 9 张'), L.includes('条约全部删去')], [true, true]);
F = run(F, { t: 'exp', key: 'fix', v: true }, { t: 'exp', key: 'lw', v: 'public' });
L = text(setupList(F));
eq('rebalanced 2-player removal 10 / 11 / 12', L.includes('I 10 张、II 11 张、III 12 张'), true);
eq('public mix: 2-player proxies', L.includes('领袖代理 1–6、奇迹代理 1–4'), true);
F = run(F, { t: 'setN', n: 3 });
eq('rebalanced 3-player removal 3 / 2 / 1', text(setupList(F)).includes('I 3 张、II 2 张、III 1 张'), true);
eq('peaceful game drops aggressions, wars, pacts', text(setupList(run(initialState(), { t: 'mode', mode: 'peace' }))).includes('侵略、战争、条约全部删去'), true);
eq('short game deals Age III events', text(setupList(run(initialState(), { t: 'mode', mode: 'short' }))).includes('每人面朝下发 2 张'), true);

// play: first game, 3 players
let G = run(initialState(), { t: 'first', id: 'p2' }, { t: 'begin' });
eq('starts in Age A round 1', [G.stage, G.age, G.round], ['play', 0, 1]);
eq('age cannot change in Age A', reduce(G, { t: 'age', age: 0 }), null);
G = run(G, { t: 'round', round: 1 });
eq('round 2 ends Age A', [G.round, G.age, G.ages], [2, 1, [{ age: 1, round: 2 }]]);
eq('Age A end: decks only', ageSteps(G, G.ages[0]).map(i => i.t).join('').includes('不扣黄色标记'), true);
eq('stale round rejected', reduce(G, { t: 'round', round: 1 }), null);
G = run(G, { t: 'round', round: 2 }, { t: 'round', round: 3 }, { t: 'age', age: 1 });
eq('Age II begins', [G.age, G.ages.at(-1)], [2, { age: 2, round: 4, out: 0 }]);
let A = ageSteps(G, G.ages.at(-1)).map(i => i.t).join('\n');
eq('Age I ends: Age A antiquated, lose 2 yellow', [A.includes('时代 A 牌'), A.includes('失去 2 个黄色标记')], [true, true]);
eq('first game has no pacts to remove', A.includes('和条约'), false);
G = run(G, { t: 'ack', age: 2, id: 'p1' });
eq('ack recorded once', [G.ack, reduce(G, { t: 'ack', age: 2, id: 'p1' })], [['p1'], null]);
eq('final age needs whose turn', reduce(G, { t: 'age', age: 2 }), null);
G = run(G, { t: 'round', round: 4 }, { t: 'age', age: 2, starter: false });
eq('first game: Age III is the last age, next round is the last', [G.age, lastAge(G), G.lastRound, G.ack], [3, 3, 6, []]);
eq('cannot end before the last round', reduce(G, { t: 'end' }), null);
eq('no resigning in the last age', reduce(G, { t: 'resign', id: 'p1' }), null);
A = ageSteps(G, G.ages.at(-1)).map(i => i.t).join('\n');
eq('last-age steps: no new decks, next round last', [A.includes('不再补牌'), A.includes('下一轮是最后一轮'), A.includes('宣告战争')], [true, true, false]);
G = run(G, { t: 'round', round: 5 });
eq('no new round after the last', reduce(G, { t: 'round', round: 6 }), null);
G = run(G, { t: 'end' });
eq('game over', G.stage, 'over');
G = run(G, { t: 'undo' });
eq('undo goes back to play', [G.stage, G.round], ['play', 6]);
G = run(G, { t: 'end' });

// first-game scoring (手 21)
eq('first-game score keys', scoreKeys(G), ['culture', 't1', 't2', 'gov', 'sci', 'str', 'happy', 'prod', 'col', 'w2']);
const sc = (id, o) => Object.entries(o).map(([key, value]) => ({ t: 'score', id, key, value: String(value) }));
G = run(G, ...sc('p1', { culture: 40, t1: 5, t2: 3, gov: 2, sci: 4, str: 9, happy: 5, prod: 8, col: 1, w2: 1 }),
  ...sc('p2', { culture: 50, t1: 2, t2: 2 }), ...sc('p3', { culture: 61 }));
eq('p1 = 40 + 5 + 6 + 2 + 4 + 9 + 5 + 8 + 3 + 6', parts(G, 'p1').total, 88);
eq('p2 = 50 + 2 + 4', parts(G, 'p2').total, 56);
eq('happiness above 8 is invalid', parts(run(G, ...sc('p3', { happy: 9 })), 'p3'), null);
let R = results(G);
eq('ranking', R.rows.map(r => [r.id, r.place]), [['p1', 1], ['p3', 2], ['p2', 3]]);
G = run(G, ...sc('p3', { culture: 88 }));
eq('ties share the victory', results(G).rows.filter(r => r.place === 1).map(r => r.id).sort(), ['p1', 'p3']);
eq('archive record', gameRecord(G).players.map(p => [p.id, p.total]), [['p1', 88], ['p3', 88], ['p2', 56]]);

// full game: resign, events list, event scores
let H = run(initialState(), { t: 'mode', mode: 'full' }, { t: 'setN', n: 4 }, { t: 'begin' }, { t: 'round', round: 1 }, { t: 'resign', id: 'p4' });
eq('resigned player is out', inGame(H), ['p1', 'p2', 'p3']);
eq('turn reference uses players left', turnRef(H)[0].items[0].t.includes('<b>2 格</b>'), true);
H = run(H, { t: 'age', age: 1 });
eq('after a resignation the new age deck is trimmed again', ageSteps(H, H.ages.at(-1)).map(i => i.t).join('').includes('剩余的 <b>3 人</b>'), true);
H = run(H, { t: 'age', age: 2 }, { t: 'age', age: 3, starter: true });
eq('full game: Age IV, this round is last', [H.age, H.lastRound], [4, H.round]);
H = run(H, { t: 'end' }, { t: 'ev', list: ['科学影响', '事件 2', '事件 3'] });
eq('full-game keys follow the events', scoreKeys(H), ['culture', 'e0', 'e1', 'e2', 'bonus']);
H = run(H, ...sc('p1', { culture: 100, e0: 14, e1: 3, e2: 0, bonus: 0 }), ...sc('p2', { culture: 90, e0: 7, e2: 9 }));
eq('p1 total', parts(H, 'p1').total, 117);
H = run(H, { t: 'ev', list: ['科学影响', '事件 3'], del: 1 });
eq('deleting an event moves the later values up', [H.score.p1.e1, H.score.p2.e1, H.score.p1.e2], ['0', '9', undefined]);
eq('resigned players are not scored', Object.keys(results(H).rows.reduce((o, r) => ({ ...o, [r.id]: 1 }), {})), ['p1', 'p2', 'p3']);
eq('last one standing wins', run(initialState(), { t: 'setN', n: 2 }, { t: 'begin' }, { t: 'resign', id: 'p1' }).stage, 'over');
eq('short game scores Age II wonders', scoreKeys(run(initialState(), { t: 'mode', mode: 'short' }, { t: 'begin' })), ['culture', 'w2', 'bonus']);
eq('war reminders only where wars exist', [dontForget(G).some(i => i.t.includes('侵略')), dontForget(H).some(i => i.t.includes('侵略'))], [false, true]);
eq('reset keeps players', run(H, { t: 'reset' }).stage, 'setup');

console.log(fails ? `\n${fails} FAILED` : '\nALL PASS');
process.exit(fails ? 1 : 0);
