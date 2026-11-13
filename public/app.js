import { SEAT_ZH, AGES, MODES, LW, num, parts, allParts, results, ids, inGame, seated, fromStart, rowRemove, finalAge, lastAge, usesExp, scoreKeys } from './logic.js';
import { setupList, ROUND_ONE, ageSteps, turnRef, dontForget } from './steps.js';

const GAME = 'through-the-ages';   // the hub's review key
const COLORS = { p1: 'var(--p-1)', p2: 'var(--p-2)', p3: 'var(--p-3)', p4: 'var(--p-4)' };
const CATS = [
  { k: 'culture', n: '游戏中文化', c: 'var(--c-track)' }, { k: 'ach', n: '文明成就', c: 'var(--c-gold)' },
  { k: 'events', n: '终局事件', c: 'var(--c-cards)' }, { k: 'bonus', n: '终局奖励', c: 'var(--c-alien)' }
];
// Score sheet rows. First game: 手 21. Full game: 规 1. Short game: 手 24.
const FIELD = {
  culture: { n: '文化点数', hint: '终局计分之前，文化版图上你的文化点数计数器停在几分（绕过一圈的加上）。' },
  t1: { n: '时代 I 科技牌', hint: '场上时代 I 的科技牌张数：农场、矿山、城市建筑、军事单位、特殊科技、政府都算。', mult: 1, count: true },
  t2: { n: '时代 II 科技牌', hint: '场上时代 II 的科技牌张数，算法同上。', mult: 2, count: true },
  sci: { n: '科学增速', hint: '科学版图上你的科学增速标记（圆的那个）停在几。' },
  str: { n: '军力等级', hint: '军事版图上你的军力等级。' },
  happy: { n: '幸福等级', hint: '玩家版图上的幸福等级（0–8）。' },
  prod: { n: '食物和资源产量', hint: '数农场和矿山上的工人，每回合能产多少食物加资源（按卡上数值），不扣腐败和消耗。' },
  col: { n: '殖民地', hint: '面前的殖民地（地区牌）张数。', mult: 3, count: true },
  w2: { n: '已完成的时代 II 奇迹', hint: '已经建完（转正）的时代 II 奇迹张数。', mult: 6, count: true },
  bonus: { n: '终局奖励', hint: '游戏结束时才计分的牌（例如比尔·盖茨）。没有就填 0。' },
  gov: { n: '政府再算一次', hint: '' }
};
const GOV = ['专制（时代 A）', '时代 I', '时代 II'];
const evName = i => S.ev[i] || `事件 ${i + 1}`;
const fieldOf = k => k.startsWith('e') && /^e\d+$/.test(k)
  ? { n: evName(+k.slice(1)), hint: '按这张事件牌的卡面，你在这张牌上得几分文化。' } : FIELD[k];

const $ = s => document.querySelector(s);
const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const store = {
  get(k) { try { return localStorage.getItem(k); } catch { return null; } },
  set(k, v) { try { localStorage.setItem(k, v); } catch {} }
};

let code = cleanCode(new URLSearchParams(location.search).get('r'));
let S = null, noRoom = false, online = false, ws = null, queue = [], retry = 0;
// rn: rename inputs on the results tab; df: "don't forget" open; chk: ticked steps (this phone only); rv: rating form
const ui = { tab: store.get('tta-tab') || 'flow', sheet: null, err: '', busy: false, rooms: null, rn: false, saving: false, df: false, chk: {}, rv: null };

function mine() {
  try { const v = JSON.parse(store.get('tta-mine')); if (Array.isArray(v)) return v; } catch {}
  return [];
}
const remember = c => store.set('tta-mine', JSON.stringify([c, ...mine().filter(x => x !== c)].slice(0, 8)));
const forget = c => store.set('tta-mine', JSON.stringify(mine().filter(x => x !== c)));
function ago(t) {
  const m = Math.floor((Date.now() - t) / 60000);
  return m < 1 ? '刚刚' : m < 60 ? `${m} 分钟前` : m < 1440 ? `${Math.floor(m / 60)} 小时前` : `${Math.floor(m / 1440)} 天前`;
}

async function loadRooms() {
  if (code) return;
  try { const r = await fetch('/api/rooms'); if (r.ok) { ui.rooms = await r.json(); render(); } } catch {}
}
setInterval(() => { if (!code && !document.hidden) loadRooms(); }, 8000);
const pending = new Map(); // debounced text inputs: key -> {timer, flush}

function cleanCode(v) { const c = String(v || '').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 4); return c.length === 4 ? c : null; }

/* ---------- connection ---------- */
function connect() {
  if (!code) return;
  ws = new WebSocket(`${location.protocol === 'https:' ? 'wss' : 'ws'}://${location.host}/api/room/${code}/ws`);
  ws.onopen = () => { retry = 0; online = true; queue.splice(0).forEach(m => ws.send(m)); render(); };
  ws.onmessage = e => {
    if (e.data === 'pong') return;
    const m = JSON.parse(e.data);
    if (m.type === 'state') {
      // A new age began on someone's phone: every phone shows what to do (not on the first load or an undo).
      const fresh = S && S.stage === 'play' && m.state.stage === 'play' && m.state.ages.length > S.ages.length;
      S = m.state; remember(code);
      if (fresh) ui.sheet = { kind: 'age', i: S.ages.length - 1, fresh: true };
      else if (ui.sheet?.kind === 'age' && !S.ages[ui.sheet.i]) ui.sheet = null;
      render();
    }
    else if (m.type === 'error' && m.error === 'noroom') { noRoom = true; forget(code); ws.close(); render(); }
  };
  ws.onclose = () => {
    online = false; render();
    if (!noRoom && code) setTimeout(connect, Math.min(5000, 400 * 2 ** retry++));
  };
}
setInterval(() => { if (ws && ws.readyState === 1) ws.send('ping'); }, 25000);
document.addEventListener('visibilitychange', () => {
  if (!document.hidden && code && !noRoom && (!ws || ws.readyState > 1)) { retry = 0; connect(); }
});
function send(action) {
  const m = JSON.stringify({ action });
  if (ws && ws.readyState === 1) ws.send(m); else queue.push(m);
}
function debounced(key, fn, delay = 350) {
  const old = pending.get(key); if (old) clearTimeout(old.timer);
  const entry = { flush() { clearTimeout(entry.timer); pending.delete(key); fn(); } };
  entry.timer = setTimeout(entry.flush, delay);
  pending.set(key, entry);
}
const flushAll = () => [...pending.values()].forEach(p => p.flush());

/* ---------- helpers ---------- */
const P = id => S.players.find(p => p.id === id);
const pname = id => P(id).name || `${SEAT_ZH[id]}色玩家`;
const por = (id, cls = '') => `<span class="por ${cls}" style="--c:${COLORS[id]}" data-c="${id}"><b>${esc((P(id).name || SEAT_ZH[id]).slice(0, 1))}</b></span>`;
const modeName = s => MODES[s.mode].zh + (usesExp(s) ? ' · 带扩展' : '');
const AGE = i => `时代 ${AGES[i]}`;
function toast(t) { const el = $('#toast'); el.innerHTML = `<div class="toast">${esc(t)}</div>`; clearTimeout(toast.t); toast.t = setTimeout(() => el.innerHTML = '', 1800); }
const src = s => s ? `<i class="src">${esc(s)}</i>` : '';
const stepList = (items, key) => `<ul class="steps">${items.map((it, i) => {
  const k = key && `${key}-${i}`, on = k && ui.chk[k];
  return `<li class="${key ? 'ck' : ''}${on ? ' on' : ''}" ${key ? `data-act="chk" data-ck="${k}"` : ''}>${key ? '<span class="box"></span>' : ''}<span>${it.t}${src(it.src)}</span></li>`;
}).join('')}</ul>`;

/* ---------- render (DOM morph keeps focus and typed text) ---------- */
function morph(a, b) {
  const ac = [...a.childNodes], bc = [...b.childNodes];
  bc.forEach((y, i) => {
    const x = ac[i];
    if (!x) { a.appendChild(y); return; }
    if (x.nodeType !== y.nodeType || x.nodeName !== y.nodeName || (x.nodeType === 1 && x.getAttribute('data-k') !== y.getAttribute('data-k'))) { a.replaceChild(y, x); return; }
    if (x.nodeType !== 1) { if (x.nodeValue !== y.nodeValue) x.nodeValue = y.nodeValue; return; }
    for (const at of [...x.attributes]) if (!y.hasAttribute(at.name)) x.removeAttribute(at.name);
    for (const at of [...y.attributes]) if (x.getAttribute(at.name) !== at.value) x.setAttribute(at.name, at.value);
    if (x.tagName === 'INPUT') {
      const v = y.getAttribute('value') ?? '';
      if (x !== document.activeElement && !pending.has(x.dataset.pk) && x.value !== v) x.value = v;
      return;
    }
    if ('disabled' in x) x.disabled = y.hasAttribute('disabled');
    morph(x, y);
  });
  while (a.childNodes.length > bc.length) a.removeChild(a.lastChild);
}
function render() {
  const t = document.createElement('div');
  t.innerHTML = view();
  morph($('#app'), t);
  $('#sheet').innerHTML = ui.sheet ? sheetView() : '';
}

function view() {
  if (!code) return landing();
  if (noRoom) return `${hero()}<div class="wrap"><h2 class="h">房间 ${code} 不存在</h2><p class="note">房间码可能输错了，或者房间已失效。</p><button class="btn" data-act="leave">返回首页</button></div>`;
  if (!S) return `${hero()}<div class="wrap"><h2 class="h">正在连接房间 ${code}…</h2></div>`;
  return bar() + `<div class="wrap" data-k="stage-${S.stage === 'setup' ? 'setup' : 'play'}">` + (S.stage === 'setup' ? setupView() : playView()) + '</div>';
}
const homeNav = () => `<div class="back-row"><button class="back-nav" data-act="leave" data-html2canvas-ignore>‹ 首页</button></div>`;
const hero = () => `<div class="hero with-back" data-k="hero">${homeNav()}<div class="en">THROUGH THE AGES</div><h1>历史巨轮小助手</h1><div class="orn"></div></div><div class="band"></div>`;
const bar = () => `<div class="bar" data-k="bar">${homeNav()}<span class="ttl">历史巨轮</span>
  <button class="room" data-act="share"><small>房间</small>${code}<small>邀请</small></button><span class="conn ${online ? 'on' : ''}" title="${online ? '已连接' : '重新连接中'}"></span></div>`;

function landing() {
  const rooms = ui.rooms;
  const stageText = r => r.stage === 'setup' ? '准备中' : r.stage === 'over' ? '已结束' : `${AGE(r.age)} · 第 ${r.round} 轮`;
  const my = mine();
  const tag = c => my.includes(c) ? '<em>我的</em>' : '';
  const listed = rooms && rooms.slice().sort((a, b) => my.includes(b.code) - my.includes(a.code));
  const unlisted = rooms ? my.filter(c => !rooms.some(r => r.code === c)) : [];
  const lp = p => `<span class="por xs" style="--c:${COLORS[p.id]}" data-c="${p.id}"><b>${esc((p.name || SEAT_ZH[p.id]).slice(0, 1))}</b></span>`;
  const roomList = rooms === null ? '<div class="empty">加载中…</div>' : listed.length + unlisted.length ? listed.map(r => `
      <button class="card lobby" data-act="rejoin" data-code="${r.code}" data-k="lb-${r.code}">
        <span class="lc">${r.code}${tag(r.code)}</span>
        <span class="lp">${r.players.map(lp).join('')}</span>
        <span class="ls"><b class="st st-${r.stage}">${stageText(r)}</b><small>${r.online ? `<i class="od on"></i>${r.online} 人在线` : ago(r.updated)}</small></span>
      </button>`).join('') + unlisted.map(c => `
      <button class="card lobby" data-act="rejoin" data-code="${c}" data-k="lb-${c}">
        <span class="lc">${c}${tag(c)}</span><span class="lp"></span><span class="ls"><small>点击进入</small></span>
      </button>`).join('') : '<div class="empty">暂无进行中的房间</div>';
  return `<div class="hero-art cover" data-k="hero"><div class="back-row"><a class="back-nav" href="https://boardgame.leisurecat.cloud" data-html2canvas-ignore>‹ 全部游戏</a></div><div class="back-row rate-row"><a class="back-nav rate-nav" href="https://boardgame.leisurecat.cloud/?rate=${GAME}&back=${encodeURIComponent(location.href)}" data-html2canvas-ignore>★ 写评价</a></div><img src="img/cover-bg.jpg" alt=""><img class="cv" src="img/cover.jpg" alt="《历史巨轮》游戏盒封面"><div class="ht">
      <div class="hz">历史巨轮小助手</div><div class="hs">开局不漏 · 时代不乱 · 计分不错</div></div></div>
    <div class="wrap" data-k="landing">
    <div class="card start">
      <button class="btn" data-act="create" ${ui.busy ? 'disabled' : ''}>创建新房间</button>
      <div class="or">或输入房间码加入</div>
      <div class="join"><input id="joinCode" maxlength="4" autocomplete="off" autocapitalize="characters" placeholder="房间码"><button class="btn navy" data-act="join">加入</button></div>
      ${ui.err ? `<div class="err">${esc(ui.err)}</div>` : ''}
    </div>
    <a class="card teachgo" href="teach"><span class="tg-i">讲</span><span><b>第一次玩？${TEACH_MIN} 分钟讲规则</b>照着念就能开局，不懂的词点一下</span><i>›</i></a>
    <div class="tiles">
      <a class="card tile" href="guide"><span class="ti rec">问</span><span><b>常见问题</b>易错规则与回合速查</span></a>
      <a class="card tile" href="history"><span class="ti rec">录</span><span><b>往期对局</b>战绩与成绩参照</span></a>
    </div>
    <h2 class="h">房间<small>${rooms && rooms.length ? `${rooms.length} 个` : ''}</small></h2>
    <div class="list">${roomList}</div>
    <footer>非官方玩家工具 · 封面版权归 Czech Games Edition 和一刻馆所有</footer></div>`;
}
const TEACH_MIN = 6;

/* ---------- setup ---------- */
function setupView() {
  const chip = (on, act, attrs, label) => `<button class="chip${on ? ' on' : ''}" data-act="${act}" ${attrs}>${label}</button>`;
  const order = fromStart(S);
  return `
    <h2 class="h">玩法</h2>
    <div class="chips wrap2">${Object.entries(MODES).map(([k, m]) => chip(S.mode === k, 'mode', `data-m="${k}"`, m.zh)).join('')}</div>
    <p class="note">${MODES[S.mode].desc}${S.mode === 'first' ? ' 第一局 4 个新手可能要打好几个小时，建议 2–3 人。' : ''}</p>
    ${S.mode === 'peace' ? `<div class="chips" style="margin-top:8px">${chip(S.gc, 'gc', `data-on="${!S.gc}"`, '加全球冲突')}</div>
      <p class="note">全球冲突：时代 I、II、III 结束时，每人得文化 = 自己军力 − 最弱文明军力。</p>` : ''}
    ${S.mode === 'first' ? '' : `<h2 class="h">扩展<small>新领袖&amp;新奇迹 · 三部分可分开用</small></h2>
      <div class="chips">${chip(S.exp.fix, 'exp', `data-key="fix" data-v="${!S.exp.fix}"`, '平衡修订')}${chip(S.exp.mil, 'exp', `data-key="mil" data-v="${!S.exp.mil}"`, '新军事牌')}</div>
      <div class="chips" style="margin-top:8px">${Object.entries(LW).map(([k, n]) => chip(S.exp.lw === k, 'exp', `data-key="lw" data-v="${k}"`, n)).join('')}</div>
      <p class="note">第三排是新领袖、新奇迹的用法。社区普遍建议直接用“平衡修订”；新领袖新奇迹等大家熟悉基础游戏再加。教新人时官方建议先玩基础版。</p>`}
    <h2 class="h">玩家人数</h2>
    <div class="chips">${[2, 3, 4].map(k => chip(k === S.n, 'n', `data-n="${k}"`, `${k} 人`)).join('')}</div>
    <h2 class="h">座位<small>按顺时针排列</small></h2>
    <div class="list">${seated(S).map((p, i) => `
      <div class="card row" data-k="seat-${i}">
        <div class="stepn">${i + 1}</div>
        ${por(p.id)}
        <div class="who">
          <input class="pn" data-pk="name-${i}" data-name="${i}" value="${esc(p.name)}" placeholder="玩家名" maxlength="12" enterkeyhint="done">
          <div class="dots"><button class="fst${S.start === p.id ? ' on' : ''}" data-act="first" data-id="${p.id}">${S.start === p.id ? '起始玩家' : '设为起始'}</button>
            <small class="act1">第一轮 ${order.indexOf(p.id) + 1} 个内政行动点</small></div>
        </div>
        <button class="ib" data-act="move" data-i="${i}" data-j="${i - 1}" ${i === 0 ? 'disabled' : ''} aria-label="上移">↑</button>
        <button class="ib" data-act="move" data-i="${i}" data-j="${i + 1}" ${i === S.n - 1 ? 'disabled' : ''} aria-label="下移">↓</button>
      </div>`).join('')}</div>
    <p class="note">起始玩家整局不变。第一轮从起始玩家起顺时针，内政行动点依次 1、2、3、4 个。</p>
    <div class="btns"><button class="btn ghost" data-act="order">手指轮盘 / 抽签定起始玩家 ›</button></div>
    <button class="btn ghost" data-act="setup">看开局清单</button>
    <button class="btn" data-act="begin">开始游戏</button>`;
}

/* ---------- play ---------- */
function playView() {
  const tabs = [['flow', '进度'], ['score', '计分'], ['mvp', '结算']];
  if (!tabs.some(t => t[0] === ui.tab)) ui.tab = 'flow';
  return `<div class="tabs">${tabs.map(([k, n]) => `<button class="tab${ui.tab === k ? ' on' : ''}" data-act="tab" data-tab="${k}">${n}</button>`).join('')}</div>
    ${status()}${banner()}
    <div data-k="tab-${ui.tab}">${ui.tab === 'flow' ? flowTab() : ui.tab === 'score' ? scoreTab() : mvpTab()}</div>`;
}

function status() {
  if (S.stage === 'over') return `<div class="status"><span class="medal">终</span><div><div class="t">游戏结束</div><div class="s">${inGame(S).length === 1 && S.n > 1 ? '其他人都体面退出了' : '最后一轮已打完，开始终局计分'}</div></div></div>`;
  const k = inGame(S).length;
  const pips = AGES.slice(0, lastAge(S) + 1).map((a, i) => `<i class="${i < S.age ? 'done' : i === S.age ? 'cur' : ''}">${a}</i>`).join('');
  return `<div class="status"><span class="medal ag">${AGES[S.age]}</span>
    <div><div class="t">${AGE(S.age)} · 第<b>${S.round}</b>轮</div><div class="s">${S.round === 1 ? '第一轮不补卡牌列' : `每回合开头移除卡牌列前 <b>${rowRemove(k)}</b> 格`}</div></div>
    <div class="pips ages">${pips}</div></div>`;
}

function banner() {
  if (S.stage === 'over' && ui.tab !== 'mvp')
    return `<div class="banner"><div style="flex:1"><b>游戏结束</b>，请填写终局计分</div><button data-act="goto" data-tab="${ui.tab === 'score' ? 'mvp' : 'score'}">${ui.tab === 'score' ? '看结算' : '去计分'}</button></div>`;
  if (S.stage === 'play' && S.lastRound) {
    const last = S.round >= S.lastRound, right = fromStart(S).filter(id => inGame(S).includes(id)).at(-1);
    return `<div class="banner"><div style="flex:1">${last ? `<b>本轮是最后一轮</b>：${esc(pname(right))} 打完就结束` : '<b>下一轮是最后一轮</b>'}</div></div>`;
  }
  return '';
}

// The last age change, if it still needs everyone's cleanup (Age A's end needs none).
const pendingAge = () => { const c = S.ages.at(-1); return c && c.age === S.age && c.age >= 2 ? c : null; };

function flowTab() {
  const k = inGame(S).length, final = S.age >= lastAge(S);
  const tools = `<div class="btns"><button class="btn ghost" data-act="turn">回合速查</button><button class="btn ghost" data-act="setup">开局清单</button></div>
    <div class="btns"><button class="btn ghost" data-act="undo" ${S.back.length ? '' : 'disabled'}>撤销上一步</button><button class="btn ghost" data-act="resignp" ${S.stage === 'play' && !final && k > 1 ? '' : 'disabled'}>有人体面退出</button><button class="btn ghost" data-act="reset">重新开局</button></div>`;
  const seats = `<div class="track"><div class="t">座位 · 从起始玩家起顺时针</div><div class="slots">${fromStart(S).map((id, i) => `
    <div class="slot${S.out.includes(id) ? ' out' : ''}" data-k="slot-${id}"><div class="o">${i + 1}</div>${por(id)}<div class="n">${esc(pname(id))}</div>${S.out.includes(id) ? '<span class="m">已退出</span>' : i === 0 ? '<span class="m">起始</span>' : S.round === 1 ? `<span class="m">${i + 1} 个行动</span>` : ''}</div>`).join('')}</div></div>`;
  if (S.stage === 'over') return seats + tools;
  const pa = pendingAge();
  const ackCard = pa ? `<div class="card ph cur" data-k="ack-${pa.age}"><div class="phh"><span class="phn">!</span><b>${AGE(pa.age - 1)} 结束了</b><small>${S.ack.length}/${k} 人做完</small></div><div class="phb">
      <p>每人按清单做完，点一下自己的名字。</p>
      <div class="pick passes">${inGame(S).map(id => `<button class="${S.ack.includes(id) ? 'on' : ''}" data-act="ack" data-id="${id}" ${S.ack.includes(id) ? 'disabled' : ''}>${por(id, 'sm')}<span>${esc(pname(id))}${S.ack.includes(id) ? ' · 做完了' : ''}</span></button>`).join('')}</div>
      <button class="btn ghost" data-act="ageview" data-i="${S.ages.length - 1}">看时代转换清单</button></div></div>` : '';
  const r1 = S.round === 1 ? `<div class="card ph cur" data-k="r1"><div class="phh"><span class="phn">1</span><b>第一轮和别的轮不一样</b></div><div class="phb">${stepList(ROUND_ONE)}</div></div>` : '';
  const nextAge = S.age + 1;
  const ageCard = S.age === 0 ? `<div class="card ph" data-k="age-a"><div class="phh"><span class="phn">A</span><b>时代 A</b><small>起始玩家第 2 回合开头结束</small></div>
      <div class="phb"><p>起始玩家开始第 2 回合时点下面的“开始第 2 轮”，时代 A 会一起结束，所有手机弹出换牌堆的步骤。</p></div></div>`
    : final ? `<div class="card ph" data-k="age-final"><div class="phh"><span class="phn">${AGES[S.age]}</span><b>${AGE(S.age)} · 最后的时代</b></div>
      <div class="phb"><p>没有新牌了：卡牌列只移除、左移，不再补；不能抽军事牌；不能体面退出。</p></div></div>`
    : `<div class="card ph" data-k="age-${S.age}"><div class="phh"><span class="phn">${AGES[S.age]}</span><b>${AGE(S.age)}</b><small>补卡牌列时内政牌堆发完就结束</small></div>
      <div class="phb"><p>补卡牌列时，${AGE(S.age)} 内政牌堆<b>最后一张发到卡牌列</b>，${AGE(nextAge)} 就开始了（可能在任何人的回合）。${nextAge === lastAge(S) ? `这会决定最后一轮${S.mode === 'first' || S.mode === 'short' ? '：本局不用时代 III 的牌，时代 III 一开始就进入收尾' : ''}。` : ''}</p>
      <button class="btn" data-act="agego">${AGE(S.age)} 的内政牌发完了</button></div></div>`;
  const last = S.lastRound && S.round >= S.lastRound;
  const roundCard = `<div class="card ph" data-k="round"><div class="phh"><span class="phn">${S.round}</span><b>第 ${S.round} 轮</b><small>起始玩家开始新回合时点</small></div><div class="phb">
      ${last ? `<p>最后一轮：起始玩家右手边的人打完最后一回合，就进入终局计分。</p><button class="btn" data-act="end">最后一轮打完了，去计分</button>`
        : `<button class="btn ghost" data-act="round">起始玩家开始第 ${S.round + 1} 轮${S.round === 1 ? '（时代 A 结束）' : ''}</button>`}</div></div>`;
  const df = `<button class="tbh df" data-act="df"><b>别忘了</b><span>${ui.df ? '收起' : `展开 ${dontForget(S).length} 条`}</span></button>${ui.df ? stepList(dontForget(S)) : ''}`;
  return `${seats}${ackCard}${r1}${ageCard}${roundCard}<div class="card ph" data-k="df"><div class="phb">${df}</div></div>${tools}`;
}

/* ---------- scoring ---------- */
const meKey = () => `tta-me-${code}`;
const myId = () => { const m = store.get(meKey()); return inGame(S).includes(m) ? m : null; };

function scoreTab() {
  const views = [['me', '我的计分'], ['all', '全桌总览']];
  const view = views.some(v => v[0] === ui.view) ? ui.view : 'me', me = myId();
  const seg = `<div class="seg">${views.map(([k, n]) => `<button class="${k === view ? 'on' : ''}" data-act="view" data-v="${k}">${n}</button>`).join('')}</div>`;
  const evs = S.mode === 'first' ? '' : eventsCard();
  if (view === 'me' && !me) return seg + `<h2 class="h">你是哪位玩家？</h2><p class="note">选好后这台手机只填你自己的分数，其他人在各自手机上填，结果实时汇总。</p>
    <div class="pick me">${inGame(S).map(id => `<button data-act="me" data-id="${id}">${por(id, 'sm')}<span>${esc(pname(id))}</span></button>`).join('')}</div>`;
  return seg + (view === 'me' ? evs + myScore(me) : evs + fullTable());
}

// The Age III events left in the current and future events decks, shared by the table (规 1; 短局 手 24).
function eventsCard() {
  const how = S.mode === 'short' ? '公开的 3 张时代 III 事件，加上每人留下的那张，逐张结算。' : '当前事件牌堆和未来事件牌堆里剩下的<b>时代 III 事件</b>逐张结算（更早时代的事件不算）。';
  return `<div class="card ph" data-k="evs"><div class="phh"><span class="phn">事</span><b>终局事件</b><small>${S.ev.length} 张 · 全桌共用</small></div><div class="phb">
    <p>${how}按卡面算出每人得几分文化，各自填在下面。平手时起始玩家算当前玩家，离他顺时针近的人算“更多”。</p>
    <div class="evl">${S.ev.map((n, i) => `<span class="evn"><button data-act="evren" data-i="${i}">${esc(n)}</button><button class="x" data-act="evdel" data-i="${i}" aria-label="删除">×</button></span>`).join('')}
      <button class="evadd" data-act="evadd">+ 加一张事件</button></div></div></div>`;
}

function cellBtn(id, key) {
  const f = fieldOf(key), d = (S.score[id] || {})[key];
  const filled = d !== undefined && d !== '';
  const bad = filled && num(d) === null;
  return `<button class="cell ${filled ? '' : 'empty'} ${bad ? 'bad' : ''}" data-act="cell" data-id="${id}" data-key="${key}">${filled ? esc(d) + (f?.count ? '<small>张</small>' : '') : '0'}</button>`;
}
const rowName = k => { const f = fieldOf(k); return `${esc(f.n)}${f.mult > 1 ? `<small>每张 ×${f.mult}</small>` : ''}`; };

function govPick(id) {
  const v = num((S.score[id] || {}).gov) ?? 0;
  return `<div class="card ms" data-k="ms-gov"><div class="ms-t"><b>政府再算一次</b><div class="ms-h">政府也是科技牌，已经算在上面；这里按它的时代再加一次（时代 I +1、时代 II +2）。</div></div></div>
    <div class="gpos">${GOV.map((n, i) => `<button class="${v === i ? 'on' : ''}" data-act="gov" data-id="${id}" data-v="${i}">${n}<small>+${i}</small></button>`).join('')}</div>`;
}

function myScore(id) {
  const p = parts(S, id);
  const item = k => `<div class="card ms" data-k="ms-${k}"><div class="ms-t"><b>${rowName(k)}</b><div class="ms-h">${fieldOf(k).hint}</div></div>${cellBtn(id, k)}</div>`;
  const keys = scoreKeys(S).filter(k => k !== 'gov');
  const others = inGame(S).filter(o => o !== id).map(o => { const q = parts(S, o); return `<span>${por(o, 'xs')}${esc(pname(o))} <b>${q ? q.total : '—'}</b></span>`; }).join('');
  const body = S.mode === 'first'
    ? `<div class="list" style="margin-top:10px">${item('culture')}</div>
      <h2 class="h">文明成就<small>第一局终局计分 · 玩家手册第 21 页</small></h2>
      <div class="list">${['t1', 't2'].map(item).join('')}${govPick(id)}${['sci', 'str', 'happy', 'prod', 'col', 'w2'].map(item).join('')}</div>`
    : `<div class="list" style="margin-top:10px">${keys.map(item).join('')}</div>
      ${S.ev.length ? '' : '<p class="note">先在上面“终局事件”里加上要结算的时代 III 事件，这里会出现每张事件的填写格。</p>'}`;
  return `<div class="ms-who">${por(id, 'sm')}<div><b>${esc(pname(id))}</b><small>只填你自己的分数</small></div><button class="tbh" data-act="me" data-id=""><span>换人</span></button></div>
    ${body}
    <div class="ms-tot card"><span>我的合计</span><b data-tt="${id}">${p ? p.total : '—'}</b></div>
    <div class="ms-others">${others}</div>`;
}

function fullTable() {
  const order = inGame(S), all = allParts(S);
  const row = k => `<tr data-k="sr-${k}"><th>${rowName(k)}</th>${order.map(id => `<td>${k === 'gov'
    ? `<button class="cell" data-act="govs" data-id="${id}">+${num((S.score[id] || {}).gov) ?? 0}</button>` : cellBtn(id, k)}</td>`).join('')}</tr>`;
  return `<table class="sc"><thead><tr><th></th>${order.map(id => `<th><div class="pv">${por(id, 'xs')}<span>${esc(pname(id))}</span></div></th>`).join('')}</tr></thead>
    <tbody>${scoreKeys(S).map(row).join('')}
    <tr data-k="sr-total"><th>合计</th>${order.map(id => `<td class="tt" data-tt="${id}">${all ? all[id].total : '—'}</td>`).join('')}</tr></tbody></table>
    <p class="legend">没手机的玩家可以由别人在这里代填。点格子输入数字。</p>`;
}

/* ---------- results ---------- */
function mvpTab() {
  const R = results(S);
  if (R.error) return `<p class="note">计分里有无效数字，请先到「计分」修正。</p>`;
  const top = R.rows.filter(r => r.place === 1), champ = top[0];
  const maxSum = Math.max(1, ...R.rows.map(r => CATS.reduce((a, c) => a + Math.max(0, r[c.k]), 0)));
  const rkRow = r => `
      <div class="card row" data-k="rk-${r.id}"><div class="stepn">${r.place}</div>${por(r.id, 'sm')}
        <div class="who"><div class="nm">${esc(pname(r.id))}</div>
          <div class="stack">${CATS.map(c => `<i style="width:${Math.max(0, r[c.k]) / maxSum * 100}%;background:${c.c}"></i>`).join('')}</div>
          <div class="parts">${CATS.filter(c => r[c.k]).map(c => `<em style="background:${c.c}"></em>${c.n} ${r[c.k]}`).join(' ')}</div></div>
        <div class="tot">${r.total}</div></div>`;
  const outs = S.out.map(id => `<span>${por(id, 'xs')}${esc(pname(id))}</span>`).join('');
  return `<div id="shot">
    <div class="mvp" style="margin-top:8px">
      <div class="crown">${top.length > 1 ? '并 列 第 一' : '文 明 之 巅'}</div>
      ${por(champ.id)}
      <div class="nm">${top.map(r => esc(pname(r.id))).join(' · ')}</div>
      <div class="fg">${S.n} 人局 · ${modeName(S)} · ${S.round} 轮</div>
      <div class="pts">${champ.total}<small>文化</small></div>
    </div>
    <div class="btns sv" data-html2canvas-ignore><button class="btn ghost" data-act="rn">${ui.rn ? '收起改名' : '修改玩家名'}</button><button class="btn navy" data-act="save" ${ui.saving ? 'disabled' : ''}>${ui.saving ? '正在生成…' : '保存结算长图'}</button></div>
    ${ui.rn ? `<div class="card" data-k="rn" data-html2canvas-ignore style="margin-top:8px;padding:2px 10px 8px">${ids(S).map(id => { const i = S.players.findIndex(p => p.id === id); return `<div class="tb">${por(id, 'xs')}<input class="pn" data-pk="name-${i}" data-name="${i}" value="${esc(P(id).name)}" placeholder="玩家名" maxlength="12" enterkeyhint="done"></div>`; }).join('')}</div>` : ''}
    ${top.length > 1 ? '<p class="note">文化最高的人平手，就共享胜利（规则书第 1 页）。</p>' : ''}
    <h2 class="h">排名与得分构成</h2>
    <div class="list rk">${R.rows.map(rkRow).join('')}</div>
    ${outs ? `<p class="legend">体面退出：${outs}</p>` : ''}
    <p class="legend">${CATS.filter(c => R.rows.some(r => r[c.k])).map(c => `<em class="lg" style="background:${c.c}"></em>${c.n}`).join(' ')}</p>
    ${R.ach.length ? `<h2 class="h">成就</h2>
    <div class="achs">${R.ach.map(a => `
      <div class="card ach" data-k="ach-${a.k}"><span class="medal">${a.ch}</span><div style="min-width:0"><div class="an">${a.name}</div><div class="ad">${a.desc}</div>
        <div class="aw">${a.who.map(id => por(id, 'xs')).join('')}${a.who.length === 1 ? `<span class="fg" style="align-self:center;margin-left:3px">${esc(pname(a.who[0]))}</span>` : ''}</div></div></div>`).join('')}</div>` : ''}</div>
    ${reviewCard()}`;
}

/* ---------- rating this game (stars + comment), shown on the hub boardgame.leisurecat.cloud ---------- */
const REVIEW_API = 'https://boardgame.leisurecat.cloud/api/reviews';
const STAR_TXT = ['点星星打分', '不推荐', '一般', '还行', '好玩', '超好玩'];
const savedReview = () => { try { return JSON.parse(store.get('tta-rv-' + code)) || {}; } catch { return {}; } };
function reviewCard() {
  if (ui.rv?.room !== code) ui.rv = { who: myId(), stars: 0, text: '', state: '', err: '', ...savedReview(), room: code };
  const rv = ui.rv;
  if (rv.state === 'sent') return `<div class="card rv" data-k="rv"><div class="rv-done">${'★'.repeat(rv.stars)}${'☆'.repeat(5 - rv.stars)}</div>
    <p>谢谢 ${esc(rv.who && ids(S).includes(rv.who) ? pname(rv.who) : '')} 的评价！</p><div class="btns"><button class="btn ghost" data-act="rv-edit">修改评价</button><a class="btn navy" href="https://boardgame.leisurecat.cloud">看大家的评价</a></div></div>`;
  return `<h2 class="h">给这款游戏打个分</h2><div class="card rv" data-k="rv">
    <div class="rv-l">我是</div><div class="rv-who">${ids(S).map(id => `<button class="${rv.who === id ? 'on' : ''}" data-act="rv-who" data-id="${id}">${por(id, 'xs')}<span>${esc(pname(id))}</span></button>`).join('')}</div>
    <div class="rv-st">${[1, 2, 3, 4, 5].map(n => `<button class="${n <= rv.stars ? 'on' : ''}" data-act="rv-star" data-n="${n}" aria-label="${n} 星">★</button>`).join('')}<span>${STAR_TXT[rv.stars]}</span></div>
    <textarea data-rv placeholder="说说这局的感受（可不填）" maxlength="300">${esc(rv.text)}</textarea>
    <button class="btn" data-act="rv-send" ${!rv.who || !rv.stars || rv.state === 'sending' ? 'disabled' : ''}>${rv.state === 'sending' ? '提交中…' : '提交评价'}</button>
    ${rv.err ? `<p class="err">${esc(rv.err)}</p>` : ''}
    <p class="note">评价和玩家名会显示在「桌游小助手」首页，并计入这款游戏的整体评分。同一局再次提交会覆盖之前的评价。</p></div>`;
}
async function sendReview() {
  const rv = ui.rv;
  rv.state = 'sending'; rv.err = ''; render();
  try {
    const r = await fetch(REVIEW_API, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ game: GAME, stars: rv.stars, name: pname(rv.who), text: rv.text, room: code }) });
    if (!r.ok) throw new Error((await r.json().catch(() => ({}))).error || `提交失败（${r.status}）`);
    rv.state = 'sent';
    store.set('tta-rv-' + code, JSON.stringify({ who: rv.who, stars: rv.stars, text: rv.text, state: 'sent' }));
  } catch (e) {
    rv.state = ''; rv.err = e.message === 'Failed to fetch' ? '网络连接失败，请稍后再试' : e.message;
  }
  render();
}

/* ---------- results as one long image ---------- */
const loadScript = src => new Promise((ok, fail) => {
  if (window.html2canvas) return ok();
  const el = document.createElement('script');
  el.src = src; el.onload = ok; el.onerror = () => fail(new Error('截图组件加载失败'));
  document.head.appendChild(el);
});
async function saveImage() {
  ui.saving = true; render();
  try {
    await loadScript('vendor/html2canvas.min.js');
    const canvas = await window.html2canvas($('#shot'), {
      scale: Math.max(2, window.devicePixelRatio || 1), backgroundColor: '#f3ecdf',
      onclone: doc => {
        const c = doc.getElementById('shot');
        c.style.cssText = 'margin:0 -14px;padding:18px 14px 14px';   // grow outward so the content keeps its on-screen width
        c.insertAdjacentHTML('afterbegin', `<div style="text-align:center;padding-bottom:6px"><div style="font:900 22px var(--serif);color:var(--red);letter-spacing:4px">历史巨轮</div>
          <div style="font:500 12px var(--sans);color:var(--ink2);margin-top:4px">终局结算 · 房间 ${code} · ${new Date().toLocaleDateString('zh-CN')}</div></div>`);
        c.insertAdjacentHTML('beforeend', `<div style="text-align:center;font:500 11px var(--sans);color:var(--ink2);margin-top:16px">历史巨轮小助手 · ${location.host}</div>`);
      }
    });
    showImage(canvas.toDataURL('image/jpeg', 0.92));
  } catch (e) { toast('生成长图失败：' + e.message); }
  ui.saving = false; render();
}
function showImage(url) {
  const el = document.createElement('div');
  el.className = 'shotv';
  el.innerHTML = `<div class="sv-top"><span>长按图片保存到相册</span><a href="${url}" download="历史巨轮结算-${code}.jpg">下载</a><button type="button">关闭</button></div><img src="${url}" alt="结算长图">`;
  el.querySelector('button').onclick = () => el.remove();
  document.body.appendChild(el);
}

/* ---------- start player: the hub's finger chooser / bag draw, then 「返回」 comes back here ---------- */
const orderUrl = n => `https://boardgame.leisurecat.cloud/?order=${n}&back=${encodeURIComponent(location.href)}`;

/* ---------- sheets ---------- */
function sheetView() {
  const s = ui.sheet;
  const close = '<div class="mask" data-act="close"></div>';
  if (s.kind === 'setup') {
    const secs = setupList(S, pname);
    return `${close}<div class="sheet tall"><h3>开局清单</h3>
      <div class="hint">${S.n} 人 · ${modeName(S)}。点一条勾一条，只在这台手机上记。来源页码：规 = 规则书，手 = 玩家手册，扩 = 扩展规则书。</div>
      <div class="sl">${secs.map((sec, i) => `<h4>${sec.h}</h4>${stepList(sec.items, `s${i}`)}`).join('')}</div>
      <button class="btn ghost" data-act="close">关闭</button></div>`;
  }
  if (s.kind === 'turn') {
    return `${close}<div class="sheet tall"><h3>回合速查</h3>
      <div class="hint">${inGame(S).length} 人 · ${modeName(S)}。每个回合按这个顺序；腐败、消耗、增加人口的数字都印在玩家版图上。</div>
      <div class="sl">${turnRef(S).map(sec => `<h4>${sec.h}</h4>${stepList(sec.items)}`).join('')}</div>
      <button class="btn ghost" data-act="close">关闭</button></div>`;
  }
  if (s.kind === 'age') {
    const c = S.ages[s.i];
    if (!c) return '';
    const title = c.age === 1 ? '时代 A 结束，时代 I 开始' : `${AGE(c.age - 1)} 结束，${AGE(c.age)} 开始`;
    return `${close}<div class="sheet tall"><h3>${title}<small>第 ${c.round} 轮</small></h3>
      <div class="hint">${c.age >= 2 ? `所有人一起做。${AGE(c.age - 2)} 的牌过时了。` : '只换牌堆。'}</div>
      <div class="sl">${stepList(ageSteps(S, c), `age${c.age}`)}</div>
      <div class="btns"><button class="btn ghost" data-act="ask" data-q="${esc(`${title}时要做哪些事？`)}">问规则助手</button><button class="btn" data-act="close">知道了</button></div></div>`;
  }
  if (s.kind === 'agego') {   // the civil deck ran out: confirm, and for the final age ask whose turn it was
    const next = S.age + 1, ending = next === lastAge(S);
    return `${close}<div class="sheet"><h3>${AGE(S.age)} 的内政牌发完了？</h3>
      <div class="hint">补卡牌列时，当前内政牌堆最后一张发到了卡牌列，${AGE(next)} 马上开始。所有手机会弹出要做的事。</div>
      ${ending ? `<p class="note">这决定最后一轮：是在<b>起始玩家（${esc(pname(S.start))}）的回合</b>发完的吗？</p>
        <div class="btns"><button class="btn" data-act="agedo" data-s="1">是起始玩家的回合</button><button class="btn" data-act="agedo" data-s="0">是别人的回合</button></div>`
        : `<button class="btn" data-act="agedo">确认，${AGE(next)} 开始</button>`}
      <button class="btn ghost" data-act="close">取消</button></div>`;
  }
  if (s.kind === 'resign') {
    return `${close}<div class="sheet"><h3>谁体面退出了？</h3>
      <div class="hint">退出的人弃掉手牌、场上的牌全部移除，参与的条约也移除；对他宣战的人移除战争牌，各得 7 文化。只剩 1 人时他获胜。之后换时代前，按剩余人数重新删牌。</div>
      <div class="pick">${inGame(S).map(id => `<button data-act="resign" data-id="${id}">${por(id, 'sm')}<span>${esc(pname(id))}</span></button>`).join('')}</div>
      <button class="btn ghost" data-act="close">取消</button></div>`;
  }
  if (s.kind === 'govs') {
    const v = num((S.score[s.id] || {}).gov) ?? 0;
    return `${close}<div class="sheet"><h3>${esc(pname(s.id))} · 政府再算一次</h3><div class="hint">按政府牌的时代：时代 I +1、时代 II +2，专制 +0。</div>
      <div class="gpos">${GOV.map((n, i) => `<button class="${v === i ? 'on' : ''}" data-act="gov" data-id="${s.id}" data-v="${i}">${n}<small>+${i}</small></button>`).join('')}</div>
      <button class="btn ghost" data-act="close" style="margin-top:12px">完成</button></div>`;
  }
  if (s.kind === 'evname') {
    return `${close}<div class="sheet"><h3>${s.i === undefined ? '加一张事件' : '改事件名'}</h3><div class="hint">写上卡名，方便大家对照（例如“科学影响”）。不写就叫“事件 ${s.i === undefined ? S.ev.length + 1 : s.i + 1}”。</div>
      <input class="pn evin" id="evName" maxlength="20" value="${esc(s.i === undefined ? '' : S.ev[s.i])}" placeholder="事件名" enterkeyhint="done">
      <div class="btns" style="margin-top:12px"><button class="btn ghost" data-act="close">取消</button><button class="btn" data-act="evsave">保存</button></div></div>`;
  }
  const f = fieldOf(s.key);
  return `${close}<div class="sheet">
    <h3>${esc(pname(s.id))} · ${esc(f.n)}</h3><div class="hint">${f.hint}</div>
    <div class="disp"><div class="ex">${esc(s.cur) || '&nbsp;'}</div><div class="cur">= ${Number(s.cur || 0)}${f.mult > 1 ? ` 张 · ${Number(s.cur || 0) * f.mult} 分` : ''}</div></div>
    <div class="keys">
      <button data-act="k" data-k="7">7</button><button data-act="k" data-k="8">8</button><button data-act="k" data-k="9">9</button><button class="fn" data-act="k" data-k="clr">清空</button>
      <button data-act="k" data-k="4">4</button><button data-act="k" data-k="5">5</button><button data-act="k" data-k="6">6</button><button class="fn" data-act="k" data-k="bs">⌫</button>
      <button data-act="k" data-k="1">1</button><button data-act="k" data-k="2">2</button><button data-act="k" data-k="3">3</button>
      <button class="ok" data-act="k" data-k="ok">完成</button>
      <button class="fn" data-act="k" data-k="none" disabled></button><button data-act="k" data-k="0">0</button><button class="fn" data-act="k" data-k="none" disabled></button>
    </div></div>`;
}

function keypad(k) {
  const s = ui.sheet;
  if (/^\d$/.test(k)) { if (s.cur.length < 4) s.cur = (s.cur === '0' ? '' : s.cur) + k; }
  else if (k === 'bs') s.cur = s.cur.slice(0, -1);
  else if (k === 'clr') s.cur = '';
  else if (k === 'ok') { send({ t: 'score', id: s.id, key: s.key, value: s.cur }); ui.sheet = null; }
  render();
}

/* ---------- events ---------- */
async function createRoom() {
  ui.busy = true; ui.err = ''; render();
  try {
    const r = await fetch('/api/room', { method: 'POST' });
    const j = await r.json();
    if (!r.ok) throw new Error(j.error || '创建失败');
    enterRoom(j.code);
  } catch (e) { ui.err = '创建房间失败：' + e.message; }
  ui.busy = false; render();
}
function enterRoom(c) {
  code = c; noRoom = false; S = null; ui.err = ''; ui.chk = {};
  history.replaceState(null, '', '/?r=' + c);
  connect(); render();
}
function leave() {
  code = null; S = null; noRoom = false; if (ws) { ws.onclose = null; ws.close(); }
  history.replaceState(null, '', '/'); ui.rooms = null; render(); loadRooms();
}
async function share() {
  const url = `${location.origin}/?r=${code}`;
  const text = `历史巨轮小助手｜开局不漏，时代不乱，计分不错\n邀请你加入《历史巨轮》房间 ${code}，点开链接就能和大家同步进度与计分（无需下载）：`;
  if (navigator.share) { try { await navigator.share({ title: '历史巨轮 · 房间 ' + code, text, url }); return; } catch (e) { if (e.name === 'AbortError') return; } }
  try { await navigator.clipboard.writeText(`${text}\n${url}`); toast('邀请已复制，发给朋友即可'); } catch { toast('房间码 ' + code); }
}
function openCell(id, key) {
  const n0 = num((S.score[id] || {})[key]);
  ui.sheet = { kind: 'key', id, key, cur: n0 ? String(n0) : '' };
  render();
}
function saveEvent() {
  const s = ui.sheet, v = $('#evName').value.trim();
  const list = [...S.ev];
  if (s.i === undefined) list.push(v || `事件 ${list.length + 1}`); else list[s.i] = v || `事件 ${s.i + 1}`;
  send({ t: 'ev', list });
  ui.sheet = null; render();
}

document.addEventListener('click', e => {
  const t = e.target.closest('[data-act]'); if (!t || t.disabled) return;
  const d = t.dataset;
  switch (d.act) {
    case 'create': createRoom(); break;
    case 'join': { const c = cleanCode($('#joinCode').value); if (c) enterRoom(c); else { ui.err = '请输入 4 位房间码'; render(); } break; }
    case 'rejoin': enterRoom(d.code); break;
    case 'leave': leave(); break;
    case 'share': share(); break;
    case 'n': send({ t: 'setN', n: +d.n }); break;
    case 'mode': send({ t: 'mode', mode: d.m }); break;
    case 'gc': send({ t: 'gc', on: d.on === 'true' }); break;
    case 'exp': send({ t: 'exp', key: d.key, v: d.key === 'lw' ? d.v : d.v === 'true' }); break;
    case 'first': send({ t: 'first', id: d.id }); break;
    case 'move': flushAll(); send({ t: 'move', i: +d.i, j: +d.j }); break;
    case 'order': flushAll(); setTimeout(() => { location.href = orderUrl(S.n); }, 150); break;   // let the name edits reach the room first
    case 'begin': flushAll(); ui.chk = {}; send({ t: 'begin' }); break;
    case 'setup': ui.sheet = { kind: 'setup' }; render(); break;
    case 'turn': ui.sheet = { kind: 'turn' }; render(); break;
    case 'tab': ui.tab = d.tab; store.set('tta-tab', d.tab); render(); window.scrollTo(0, 0); break;
    case 'goto': ui.tab = d.tab; render(); window.scrollTo(0, 0); break;
    case 'df': ui.df = !ui.df; render(); break;
    case 'chk': ui.chk[d.ck] = !ui.chk[d.ck]; render(); break;
    case 'rn': ui.rn = !ui.rn; render(); break;
    case 'save': if (!ui.saving) saveImage(); break;
    case 'round': send({ t: 'round', round: S.round }); window.scrollTo({ top: 0, behavior: 'smooth' }); break;
    case 'agego': ui.sheet = { kind: 'agego' }; render(); break;
    case 'agedo': send(d.s === undefined ? { t: 'age', age: S.age } : { t: 'age', age: S.age, starter: d.s === '1' }); ui.sheet = null; render(); break;
    case 'ageview': ui.sheet = { kind: 'age', i: +d.i }; render(); break;
    case 'ack': send({ t: 'ack', age: S.age, id: d.id }); break;
    case 'resignp': ui.sheet = { kind: 'resign' }; render(); break;
    case 'resign': if (confirm(`确认 ${pname(d.id)} 体面退出？`)) { send({ t: 'resign', id: d.id }); ui.sheet = null; render(); } break;
    case 'end': send({ t: 'end' }); ui.tab = 'score'; render(); window.scrollTo(0, 0); break;
    case 'undo': send({ t: 'undo' }); break;
    case 'reset': if (confirm('重新开局？本房间的进度和计分都会清空，所有人同步。')) send({ t: 'reset' }); break;
    case 'ask': ui.sheet = null; render(); window.askRules?.(d.q); break;
    case 'view': ui.view = d.v; render(); break;
    case 'me': store.set(meKey(), d.id); ui.view = 'me'; render(); window.scrollTo(0, 0); break;
    case 'gov': send({ t: 'score', id: d.id, key: 'gov', value: d.v }); if (ui.sheet?.kind === 'govs') { ui.sheet = null; render(); } break;
    case 'govs': ui.sheet = { kind: 'govs', id: d.id }; render(); break;
    case 'evadd': ui.sheet = { kind: 'evname' }; render(); setTimeout(() => $('#evName')?.focus(), 50); break;
    case 'evren': ui.sheet = { kind: 'evname', i: +d.i }; render(); break;
    case 'evsave': saveEvent(); break;
    case 'evdel': if (confirm(`删除“${S.ev[+d.i]}”？大家在这张事件上填的分数也会清掉。`)) send({ t: 'ev', list: S.ev.filter((_, i) => i !== +d.i), del: +d.i }); break;
    case 'rv-who': ui.rv.who = d.id; render(); break;
    case 'rv-star': ui.rv.stars = +d.n; render(); break;
    case 'rv-send': sendReview(); break;
    case 'rv-edit': ui.rv.state = ''; render(); break;
    case 'cell': openCell(d.id, d.key); break;
    case 'k': keypad(d.k); break;
    case 'close': ui.sheet = null; render(); break;
  }
});

document.addEventListener('input', e => {
  const el = e.target, d = el.dataset;
  if (d.name !== undefined) debounced(d.pk, () => send({ t: 'player', i: +d.name, name: el.value }));
  else if (d.rv !== undefined) ui.rv.text = el.value;
});
document.addEventListener('focusout', e => { const k = e.target.dataset?.pk; if (k) pending.get(k)?.flush(); });
document.addEventListener('keydown', e => {
  if (e.key === 'Enter' && e.target.id === 'joinCode') document.querySelector('[data-act="join"]').click();
  if (e.key === 'Enter' && e.target.id === 'evName') saveEvent();
  if (e.key === 'Enter' && e.target.dataset?.pk) e.target.blur();
});

render();
connect();
loadRooms();
