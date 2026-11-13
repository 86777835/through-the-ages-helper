// Game rules shared by the room server (Durable Object) and the page.
// Through the Ages: A New Story of Civilization (CGE 2015), Simplified Chinese edition 《历史巨轮：人类文明新篇章》 (一刻馆);
// expansion New Leaders and Wonders 《新领袖&新奇迹》. Terms follow CGE's official Simplified Chinese rulebook, handbook and
// quick reference. Page numbers: 规 = rulebook (Code of Laws), 手 = handbook, 扩 = expansion rulebook (English only).
// The room tracks only what the whole table shares: the current age, the round, who resigned and when the game ends.
// Everything on the player boards stays on the table.

export const SEATS = ['p1', 'p2', 'p3', 'p4'];
export const SEAT_ZH = { p1: '红', p2: '蓝', p3: '绿', p4: '紫' };   // colours on this site only (the game's player colours are not needed)
export const AGES = ['A', 'I', 'II', 'III', 'IV'];

// How the table plays (手 1, 21, 24).
export const MODES = {
  first: { zh: '第一局简化', short: '第一局', desc: '玩家手册教的第一局：不用时代 III，没有侵略、战争、条约，终局按 7 项固定计分。新手推荐。' },
  full: { zh: '完整游戏', short: '完整', desc: '规则书的完整规则，玩到时代 III 结束。终局结算剩下的时代 III 事件。' },
  short: { zh: '短局变体', short: '短局', desc: '官方变体：只玩两个时代，但用完整规则（含侵略、战争、条约），终局用时代 III 事件计分。' },
  peace: { zh: '和平局变体', short: '和平', desc: '官方变体：完整游戏去掉所有侵略、战争、条约（也可留 4 张不涉及攻击的条约）。' }
};
// Expansion parts (扩 2–5), each usable on its own. lw: how the new leaders and wonders are used.
export const LW = { none: '不用', pure: '纯扩展', secret: '秘密混合', public: '公开混合' };

// The age whose end starts the last rounds: Age III in the full game; Age II when Age III is left out (手 21, 24).
export const finalAge = S => S.mode === 'first' || S.mode === 'short' ? 2 : 3;
export const lastAge = S => finalAge(S) + 1;          // the age that has no cards (IV, or III in a two-age game)
export const seated = S => S.players.slice(0, S.n);
export const ids = S => seated(S).map(p => p.id);
export const inGame = S => ids(S).filter(id => !S.out.includes(id));
// Cards removed from the left of the card row at the start of each turn (规 3): counts only players still in the game.
export const rowRemove = k => ({ 2: 3, 3: 2, 4: 1 })[k] ?? 0;
// Round 1: civil actions by seat from the start player, 1 / 2 / 3 / 4 (规 2).
export const fromStart = S => { const h = ids(S), i = Math.max(0, h.indexOf(S.start)); return [...h.slice(i), ...h.slice(0, i)]; };

export function initialState() {
  return {
    v: 0, stage: 'setup', n: 3, mode: 'first',
    players: SEATS.map(id => ({ id, name: '' })),
    start: 'p1', exp: { fix: false, mil: false, lw: 'none' }, gc: false,
    age: 0, round: 1, out: [], lastRound: null, ages: [], ack: [], back: [], ev: [], score: {}
  };
}

// Whole number ≥ min (≤ 9999); empty counts as 0; anything else is null.
export function num(v, min = 0) {
  if (v === '' || v == null) return 0;
  const n = Number(v);
  return Number.isInteger(n) && n >= min && n <= 9999 ? n : null;
}

const clone = o => JSON.parse(JSON.stringify(o));
const cleanText = (v, max) => String(v ?? '').replace(/[\u0000-\u001f]/g, '').slice(0, max);
const BACK_MAX = 40;   // undo steps kept
const flow = S => ({ stage: S.stage, age: S.age, round: S.round, out: S.out, lastRound: S.lastRound, ages: S.ages, ack: S.ack });
export const usesExp = S => S.mode !== 'first' && (S.exp.fix || S.exp.mil || S.exp.lw !== 'none');

// Applies one action. Returns the new state, or null when the action is invalid or stale.
export function reduce(s, a) {
  if (!a || typeof a !== 'object') return null;
  const S = clone(s);
  const done = () => { S.v = s.v + 1; return S; };
  const setup = S.stage === 'setup', play = S.stage === 'play';
  const save = () => { S.back = [...S.back.slice(1 - BACK_MAX), flow(s)]; };

  switch (a.t) {
    case 'setN':
      if (!setup || ![2, 3, 4].includes(a.n)) return null;
      S.n = a.n;
      if (!ids(S).includes(S.start)) S.start = S.players[0].id;
      return done();

    case 'mode':
      if (!setup || !MODES[a.mode]) return null;
      S.mode = a.mode;
      if (a.mode !== 'peace') S.gc = false;
      return done();

    case 'exp': {   // fix: rebalanced cards; mil: new military decks; lw: new leaders and wonders (扩 2–5)
      if (!setup || S.mode === 'first') return null;
      if (a.key === 'lw') { if (!LW[a.v]) return null; S.exp.lw = a.v; }
      else if (['fix', 'mil'].includes(a.key) && typeof a.v === 'boolean') S.exp[a.key] = a.v;
      else return null;
      return done();
    }

    case 'gc':      // Global Conflicts, an option of the peaceful game (手 24)
      if (!setup || S.mode !== 'peace' || typeof a.on !== 'boolean') return null;
      S.gc = a.on; return done();

    case 'player': {
      const p = S.players[a.i]; if (!p || a.i >= S.n || a.name === undefined) return null;
      p.name = cleanText(a.name, 12).trim();
      return done();
    }

    case 'move': {
      const { i, j } = a;
      if (!setup || ![i, j].every(k => Number.isInteger(k) && k >= 0 && k < S.n)) return null;
      [S.players[i], S.players[j]] = [S.players[j], S.players[i]];
      return done();
    }

    case 'first':   // the start player; never changes during the game (规 2)
      if (!setup || !ids(S).includes(a.id)) return null;
      S.start = a.id; return done();

    case 'begin':
      if (!setup) return null;
      Object.assign(S, { stage: 'play', age: 0, round: 1, out: [], lastRound: null, ages: [], ack: [], back: [], ev: [], score: {},
        gid: Date.now().toString(36) + Math.random().toString(36).slice(2, 6) });   // gid names this game in the archive
      return done();

    case 'round': { // the start player begins a new round. Round 2: Age A ends at the first card-row refill (规 3, 手 8)
      if (!play || a.round !== S.round || (S.lastRound && S.round >= S.lastRound)) return null;
      save();
      S.round += 1;
      if (S.round === 2 && S.age === 0) { S.age = 1; S.ages = [...S.ages, { age: 1, round: 2 }]; S.ack = []; }
      return done();
    }

    case 'age': {   // the current civil deck ran out while refilling the card row: the next age begins (规 3)
      if (!play || a.age !== S.age || S.age < 1 || S.age >= lastAge(S)) return null;
      const next = S.age + 1, ending = next === lastAge(S);
      if (ending && typeof a.starter !== 'boolean') return null;   // was it the start player's turn? decides the last round
      save();
      S.age = next;
      S.ages = [...S.ages, { age: next, round: S.round, out: S.out.length }];
      S.ack = [];
      if (ending) S.lastRound = a.starter ? S.round : S.round + 1;
      return done();
    }

    case 'ack': {   // this player has done the end-of-age steps (this phone only shows who)
      if (!play || a.age !== S.age || !inGame(S).includes(a.id) || S.ack.includes(a.id)) return null;
      S.ack = [...S.ack, a.id];
      return done();
    }

    case 'resign': { // resign (规 4): not in the last age; one left wins
      if (!play || !inGame(S).includes(a.id) || S.age >= lastAge(S)) return null;
      save();
      S.out = [...S.out, a.id];
      S.ack = S.ack.filter(x => x !== a.id);
      if (inGame(S).length === 1) S.stage = 'over';
      return done();
    }

    case 'end':     // the last round is over (or only one civilization is left): final scoring
      if (!play || !(S.lastRound && S.round >= S.lastRound)) return null;
      save();
      S.stage = 'over';
      return done();

    case 'undo':
      if (!S.back.length) return null;
      Object.assign(S, S.back.pop());   // flow only: scores and the events list stay
      return done();

    case 'ev': {    // the events scored at the end (Age III events left in the current and future decks; 规 1)
      if (setup || !Array.isArray(a.list) || a.list.length > 30) return null;
      const list = a.list.map(x => cleanText(x, 20).trim());
      if (list.some(x => !x)) return null;
      if (a.del !== undefined) {   // one event removed: the values typed for the later ones move up with them
        if (!Number.isInteger(a.del) || a.del < 0 || a.del >= S.ev.length || list.length !== S.ev.length - 1) return null;
        for (const d of Object.values(S.score)) {
          for (let i = a.del; i < S.ev.length; i++) { if (i + 1 < S.ev.length && d['e' + (i + 1)] !== undefined) d['e' + i] = d['e' + (i + 1)]; else delete d['e' + i]; }
        }
      }
      S.ev = list;
      return done();
    }

    case 'score': {
      if (setup || !ids(S).includes(a.id) || !scoreKeys(S).includes(a.key)) return null;
      (S.score[a.id] ||= {})[a.key] = cleanText(a.value, 6);
      return done();
    }

    case 'reset':   // back to setup, keeping players and options
      Object.assign(S, { stage: 'setup', age: 0, round: 1, out: [], lastRound: null, ages: [], ack: [], back: [], ev: [], score: {} });
      return done();
  }
  return null;
}

/* ---------- final scoring ---------- */
// First game (手 21): culture already scored, plus civilization achievements.
// t1 / t2: Age I / II technologies in play, government included; gov: the government's level, which counts a second time.
export const FIRST_KEYS = ['culture', 't1', 't2', 'gov', 'sci', 'str', 'happy', 'prod', 'col', 'w2'];
export const FIRST_MULT = { culture: 1, t1: 1, t2: 2, gov: 1, sci: 1, str: 1, happy: 1, prod: 1, col: 3, w2: 6 };
// Full / peaceful game (规 1): culture, the Age III events left in the decks (one value per event), end-of-game bonuses.
// Short game (手 24): also 6 culture per completed Age II wonder.
export const scoreKeys = S => S.mode === 'first' ? FIRST_KEYS
  : ['culture', ...(S.mode === 'short' ? ['w2'] : []), ...S.ev.map((_, i) => 'e' + i), 'bonus'];
const EV_MIN = 0;

// One player's score parts, or null if a field is invalid.
export function parts(S, id) {
  const d = S.score[id] || {};
  if (S.mode === 'first') {
    const v = {};
    for (const k of FIRST_KEYS) { v[k] = num(d[k]); if (v[k] === null) return null; }
    if (v.gov > 2 || v.happy > 8) return null;
    const ach = v.t1 + v.t2 * 2 + v.gov + v.sci + v.str + v.happy + v.prod + v.col * 3 + v.w2 * 6;
    return { culture: v.culture, events: 0, ach, bonus: 0, total: v.culture + ach, v };
  }
  const culture = num(d.culture), bonus = num(d.bonus), w2 = S.mode === 'short' ? num(d.w2) : 0;
  if (culture === null || bonus === null || w2 === null) return null;
  let events = 0;
  for (let i = 0; i < S.ev.length; i++) { const e = num(d['e' + i], EV_MIN); if (e === null) return null; events += e; }
  const ach = w2 * 6;
  return { culture, events, ach, bonus, total: culture + events + ach + bonus };
}
export function allParts(S) {
  const out = {};
  for (const id of inGame(S)) { const p = parts(S, id); if (!p) return null; out[id] = p; }
  return out;
}

// Final standings: most culture wins, ties share the victory (规 1). Resigned players are not ranked.
export function results(S) {
  const P = allParts(S);
  if (!P) return { error: true };
  const rows = inGame(S).map(id => ({ id, ...P[id] })).sort((a, b) => b.total - a.total);
  rows.forEach((r, i) => { const p = rows[i - 1]; r.place = p && p.total === r.total ? p.place : i + 1; });
  const best = (val, label) => {
    const vs = rows.map(val), max = Math.max(...vs);
    if (!(max > 0) || (rows.length > 1 && vs.every(v => v === max))) return [];
    return rows.filter((r, i) => vs[i] === max).map(r => r.id);
  };
  const multi = rows.length > 1, first = S.mode === 'first';
  const ach = [
    { k: 'mvp', ch: '冠', name: '文明之巅', desc: '最终文化最高', who: multi ? rows.filter(r => r.place === 1).map(r => r.id) : [] },
    { k: 'culture', ch: '文', name: '一路领跑', desc: '终局计分前文化最高', who: multi ? best(r => r.culture) : [] },
    ...(first ? [
      { k: 'sci', ch: '科', name: '启蒙之光', desc: '科学增速最高', who: multi ? best(r => r.v.sci) : [] },
      { k: 'str', ch: '军', name: '铁血军团', desc: '军力等级最高', who: multi ? best(r => r.v.str) : [] },
      { k: 'happy', ch: '乐', name: '盛世安康', desc: '幸福等级最高', who: multi ? best(r => r.v.happy) : [] },
      { k: 'prod', ch: '产', name: '丰饶之地', desc: '食物和资源产量最高', who: multi ? best(r => r.v.prod) : [] }
    ] : [
      { k: 'events', ch: '史', name: '青史留名', desc: '终局事件得分最多', who: multi ? best(r => r.events) : [] }
    ])
  ].filter(a => a.who.length);
  return { rows, ach };
}

// Which content a game used, for the archive and the score references.
export const expKey = S => S.mode === 'first' ? 'first' : S.mode + (usesExp(S) ? '-x' : '');
export const EXP_ZH = { first: '第一局简化', full: '完整游戏', 'full-x': '完整 · 带扩展', short: '短局', 'short-x': '短局 · 带扩展', peace: '和平局', 'peace-x': '和平局 · 带扩展' };

// What the archive keeps for a finished game. Null while a score field is invalid.
export function gameRecord(S) {
  const R = results(S);
  if (R.error) return null;
  return {
    gid: S.gid, n: S.n, exp: expKey(S), rounds: S.round, out: S.out.length,
    players: R.rows.map(r => {
      const p = S.players.find(x => x.id === r.id);
      return { id: r.id, name: p.name, place: r.place, total: r.total, culture: r.culture, events: r.events + r.bonus, ach: r.ach };
    })
  };
}
