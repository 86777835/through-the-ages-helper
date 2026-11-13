import { SEAT_ZH, EXP_ZH } from './logic.js';

const COLORS = { p1: 'var(--p-1)', p2: 'var(--p-2)', p3: 'var(--p-3)', p4: 'var(--p-4)' };
const CATS = [
  { k: 'culture', n: '游戏中文化', c: 'var(--c-track)' }, { k: 'ach', n: '文明成就', c: 'var(--c-gold)' },
  { k: 'events', n: '终局事件与奖励', c: 'var(--c-cards)' }
];
const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const pname = p => p.name || `${SEAT_ZH[p.id]}色玩家`;
const por = (p, cls) => `<span class="por ${cls}" style="--c:${COLORS[p.id]}" data-c="${p.id}"><b>${esc((p.name || SEAT_ZH[p.id]).slice(0, 1))}</b></span>`;
const when = t => new Date(t).toLocaleString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false });

function game(g) {
  const ps = g.players;
  const max = Math.max(1, ...ps.map(p => CATS.reduce((a, c) => a + Math.max(0, p[c.k]), 0)));
  return `<details class="card game">
    <summary><div class="gh"><b>${esc(g.code)}</b><span>${when(g.ended)} · ${g.n} 人 · ${EXP_ZH[g.exp]} · ${g.rounds} 轮${g.out ? ` · ${g.out} 人退出` : ''}</span></div>
      <div class="gp">${ps.map(p => `<span class="${p.place === 1 && g.n > 1 ? 'win' : ''}">${por(p, 'xs')}<i>${esc(pname(p))}</i><em>${p.total}</em></span>`).join('')}</div></summary>
    <div class="gd rk">${ps.map(p => `
      <div class="row"><div class="stepn">${p.place}</div>${por(p, 'sm')}
        <div class="who"><div class="nm">${esc(pname(p))}</div>
          <div class="stack">${CATS.map(c => `<i style="width:${Math.max(0, p[c.k]) / max * 100}%;background:${c.c}"></i>`).join('')}</div>
          <div class="parts">${CATS.filter(c => p[c.k]).map(c => `<em style="background:${c.c}"></em>${c.n} ${p[c.k]}`).join(' ')}</div></div>
        <div class="tot">${p.total}</div></div>`).join('')}</div>
  </details>`;
}

async function load(q) {
  const box = document.getElementById('games');
  box.innerHTML = '<div class="empty">加载中…</div>';
  try {
    const r = await fetch('/api/games' + (q ? '?q=' + encodeURIComponent(q) : ''));
    if (!r.ok) throw new Error(r.status);
    const list = await r.json();
    box.innerHTML = list.length ? list.map(game).join('') : `<div class="empty">${q ? '没有找到相关对局' : '暂无记录'}</div>`;
  } catch {
    box.innerHTML = '<div class="empty">加载失败，请稍后重试</div>';
  }
}

// Score references per player count × expansion; with a searched name, that player's own best and average.
async function stats(name) {
  const box = document.getElementById('stats');
  try {
    const r = await fetch('/api/stats' + (name ? '?name=' + encodeURIComponent(name) : ''));
    if (!r.ok) throw new Error(r.status);
    const list = await r.json();
    const mine = name && list.some(g => g.me.games);
    box.innerHTML = list.length ? `<table class="st"><thead><tr><th>配置</th><th>局数</th><th>平均分</th><th>冠军平均</th><th>最高分</th>${mine ? `<th>${esc(name)}</th>` : ''}</tr></thead><tbody>${list.map(g => `
      <tr><td>${g.n} 人<small>${EXP_ZH[g.exp]}</small></td><td>${g.games}</td><td>${g.avg}</td><td>${g.n > 1 ? g.avgWin : '—'}</td>
        <td><b>${g.best.total}</b><small>${esc(g.best.name || SEAT_ZH[g.best.id] + '色玩家')}</small></td>
        ${mine ? `<td>${g.me.games ? `最高 <b>${g.me.best}</b><small>平均 ${g.me.avg} · ${g.me.games} 局</small>` : '—'}</td>` : ''}</tr>`).join('')}</tbody></table>
      ${name && !mine ? `<p class="note">没有名为「${esc(name)}」的玩家记录；个人成绩按玩家名完全一致统计。</p>` : ''}` : '<div class="empty">暂无记录</div>';
  } catch {
    box.innerHTML = '<div class="empty">加载失败，请稍后重试</div>';
  }
}

document.getElementById('search').addEventListener('submit', e => { e.preventDefault(); const q = document.getElementById('q').value.trim(); load(q); stats(q); });
load('');
stats('');
