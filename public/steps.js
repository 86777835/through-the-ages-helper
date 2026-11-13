// What to do at setup, in round 1, at the end of each age, and on every turn.
// Written in our own words from CGE's official rulebooks; terms from the official Simplified Chinese edition.
// 规 = rulebook (Code of Laws), 手 = handbook, 扩 = New Leaders and Wonders rulebook (English only; its card names stay in English).
import { AGES, finalAge, lastAge, rowRemove, fromStart, inGame } from './logic.js';

const AGE = i => `时代 ${AGES[i]} `;
const realAges = S => S.mode === 'first' || S.mode === 'short' ? [1, 2] : [1, 2, 3];   // civil decks in play after Age A

// Cards to remove from the civil decks for k players (规 2; rebalanced counts 扩 3).
function removal(S, k, ages = realAges(S)) {
  if (k >= 4) return [];
  const fix = S.mode !== 'first' && S.exp.fix;
  const per = fix ? { 3: { 1: 3, 2: 2, 3: 1 }, 2: { 1: 10, 2: 11, 3: 12 } }[k] : { 3: { 1: 3, 2: 3, 3: 3 }, 2: { 1: 9, 2: 9, 3: 9 } }[k];
  const mark = k === 3 ? '标「4」' : '标「3+」或「4」';
  const counts = ages.map(a => `${AGES[a]} ${per[a]} 张`).join('、');
  const out = [{ t: `内政牌堆按人数删牌：删去${mark}的牌（标记在卡牌右上角，很小），${counts}。删掉的牌放回盒子。`, src: fix ? '规 2 · 扩 3' : '规 2' }];
  if (k === 2 && S.mode !== 'first' && S.mode !== 'peace') out.push({ t: `2 人局没有条约：军事牌堆里的条约全部删去${S.exp.mil ? '' : '（时代 I 2 张，时代 II、III 各 4 张）'}。`, src: '规 2' });
  return out;
}

// Setup checklist, in sections: [{ h: heading, items: [{ t: text, src }] }]
export function setupList(S, name = id => id) {
  const N = S.n, fx = S.mode !== 'first';
  const decks = [
    { t: '摆好版图：卡牌列、文化版图、科学版图、军事版图、当前时代版图，放在大家都看得清的地方。', src: '规 2' },
    { t: '所有牌按背面分成 <b>8 叠</b>：时代 A、I、II、III 各一叠内政牌、一叠军事牌。', src: '规 2' },
    ...removal(S, N)
  ];
  if (S.mode === 'first') decks.push(
    { t: '第一局不用时代 III：时代 III 的内政牌和军事牌<b>两叠都放回盒子</b>。', src: '手 4' },
    { t: '时代 I、II 的军事牌只留三种：事件和地区牌（绿色）、阵型牌（红色，下半是军事单位图标）、军事奖励牌（半棕半绿）。侵略、战争、条约放回盒子。', src: '手 4' });
  if (S.mode === 'peace') decks.push({ t: '和平局：所有军事牌堆里的侵略、战争、条约全部删去（喜欢条约的话，可以留 4 张不涉及攻击的条约）。', src: '手 24' });
  if (S.mode === 'short') decks.push(
    { t: '短局：把时代 III 军事牌里的<b>所有事件</b>拿出来洗混，每人面朝下发 2 张放在玩家版图旁，<b>时代 I 结束前不能看</b>。', src: '手 24' },
    { t: '再翻开 3 张时代 III 事件，放在大家都看得到的地方；另从时代 III 军事牌里拿 1 张“为文化而战”明放在旁边。', src: '手 24' },
    { t: '其余时代 III 军事牌和时代 III 内政牌都不用。', src: '手 24' });
  const exp = [];
  if (fx && S.exp.fix) exp.push(
    { t: '平衡修订：带修订图标的 7 张领袖、5 张奇迹，替换基础版的同名牌。', src: '扩 3' },
    { t: '科技牌：Communism、Fundamentalism 各换 1 张；Republic、Professional Sports 两张都换（原来有一张标「4」，现在标「3+」）；Military Theory 只换标「4」的那张，另一张保留。', src: '扩 3' },
    { t: '加入 6 张标「3+」的黄色行动牌（时代 I 1 张、II 2 张、III 3 张）。上面的删牌张数已经按修订后的牌算。', src: '扩 3' });
  if (fx && S.exp.mil) exp.push({ t: '新军事牌：基础版的军事牌全部留在盒里，换成扩展的整套军事牌堆（背面才一致）。Wealthy Territory I 已改成电子版的数值。', src: '扩 4' });
  if (fx && S.exp.lw === 'pure') exp.push({ t: '纯扩展：所有基础版领袖、奇迹换成扩展的新领袖、新奇迹，每叠数量和原来一样。', src: '扩 4' });
  if (fx && (S.exp.lw === 'secret' || S.exp.lw === 'public')) {
    const [l, w] = N === 2 ? [6, 4] : [7, 5];
    exp.push({ t: `把基础版和扩展的领袖、奇迹全部拿出来，按时代分成 8 叠（每个时代领袖一叠、奇迹一叠），各自洗匀，每个时代随机抽 <b>${l} 张领袖、${w} 张奇迹</b>，其余放回盒子。`, src: '扩 4–5' });
    if (S.exp.lw === 'secret') exp.push({ t: '秘密混合：抽到的牌不看，直接洗进对应时代的内政牌堆。', src: '扩 4' });
    else exp.push(
      { t: '公开混合：时代 A 抽到的领袖、奇迹洗进时代 A 内政牌堆。', src: '扩 5' },
      { t: `时代 I、II、III 的内政牌堆里放<b>代理牌</b>代替真牌：${N === 2 ? '领袖代理 1–6、奇迹代理 1–4（标「3+」的代理牌不用）' : '领袖代理 1–7、奇迹代理 1–5 全用'}。`, src: '扩 4' },
      { t: `领袖板、奇迹板用${N === 2 ? ' 2 人' : ' 3–4 人'}那一面，放在卡牌列上方。时代 I 抽到的领袖、奇迹放上板子的格子（顺序无所谓）；时代 II、III 的正面朝上放在旁边，谁都能看。`, src: '扩 4–5' },
      { t: '代理牌一发到卡牌列，马上换成板上同号的真牌，代理牌放进该时代的内政弃牌堆。', src: '扩 5' });
  }
  if (exp.length) exp.push({ t: '扩展没有简体中文规则书，这里按英文规则书整理，卡名保留英文。', src: '扩' });
  const row = [
    { t: `事件牌堆：洗时代 A 军事牌，抽 <b>${N + 2} 张</b>（人数 + 2）面朝下放在军事版图的“当前事件”位；其余时代 A 军事牌<b>不看</b>，直接放回盒子。`, src: '规 2' },
    { t: '卡牌列：洗时代 A 内政牌，翻开 <b>13 张</b>放进卡牌列，其余放在当前时代版图浅色的一半。其他时代的牌放在一边，之后才用。', src: '规 2' }
  ];
  const order = fromStart(S);
  const players = [
    { t: '每人选一种颜色，拿这个颜色的 4 个等级标记、2 个点数计数器、1 面阵型旗，再拿一块玩家版图（上面印着 6 张起始科技）。', src: '规 2' },
    { t: '<b>蓝色标记 16 个</b>放满蓝色供给区。', src: '规 2' },
    { t: '<b>黄色标记</b>：18 个放满黄色人口区；6 个放在起始科技上（步兵 1、农场 2、矿山 2、实验室 1）；1 个放在工人区。', src: '规 2 · 手 2' },
    { t: '4 个白色、2 个红色标记放在专制政府<b>旁边</b>（先不放上去）。', src: '规 2' },
    { t: '科学增速 1、文化增速 0、军力等级 1、幸福等级 0；科学点数和文化点数都从 0 开始。阵型旗放在军事版图的公共阵型区，表示还没有阵型。', src: '规 2' },
    { t: `起始玩家 <b>${name(S.start)}</b>，整局不变${fx && usesMarker(S) ? '（扩展里有起始玩家标记）' : '，可以把一张不用的时代 A 军事牌塞在他的玩家版图下面做记号'}。`, src: S.exp.lw !== 'none' || S.exp.fix || S.exp.mil ? '规 2 · 扩 2' : '规 2' },
    { t: `第一轮内政行动点（白色标记放上专制政府）：${order.map((id, i) => `${name(id)} <b>${i + 1} 个</b>`).join('，')}。第一轮<b>没有军事行动</b>。`, src: '规 2' }
  ];
  const out = [{ h: '公共区域：牌堆', items: decks }];
  if (exp.length) out.push({ h: '扩展《新领袖&新奇迹》', items: exp });
  out.push({ h: '公共区域：事件和卡牌列', items: row }, { h: '玩家', items: players });
  return out;
}
const usesMarker = S => S.mode !== 'first' && (S.exp.fix || S.exp.mil || S.exp.lw !== 'none');

// Round 1 is different (规 3, 5; 手 6–7).
export const ROUND_ONE = [
  { t: '跳过回合开始和政治阶段，<b>不补卡牌列</b>。', src: '规 3' },
  { t: '行动阶段<b>只能从卡牌列拿牌</b>。拿奇迹就直接放进场，成为未完成奇迹。', src: '规 5' },
  { t: '领袖拿进手里，第一轮不能打出。', src: '手 6' },
  { t: '回合结束照常生产：科学 +1，农场产 2 食物，矿山产 2 资源。没有军事行动，所以不抽军事牌。', src: '手 7' }
];

// What changes when an age begins. change: { age, round, out } as stored in S.ages.
export function ageSteps(S, change) {
  const a = change.age, old = a - 2, final = a === lastAge(S), k = S.n - (change.out || 0), war = S.mode === 'full' || S.mode === 'short';
  const out = [];
  if (a === 1) {
    out.push(
      { t: '起始玩家第 2 回合开头第一次补卡牌列，时代 A 就结束了。补完后，剩下的时代 A 内政牌移出游戏。', src: '规 3' },
      { t: '洗时代 I 的内政牌和军事牌，放上当前时代版图。时代 A 的牌不够补满卡牌列时，接着用时代 I 的补。', src: '规 3' },
      { t: '时代 A 结束<b>只做这些</b>：不弃牌、不扣黄色标记。', src: '手 21' },
      { t: `从这一轮起：每个回合开头先补卡牌列（${k} 人移除最左边 <b>${rowRemove(k)} 格</b>，其余左移，再从左补满）；有政治阶段；有军事行动，回合末抽军事牌。`, src: '规 3' });
    if (S.mode === 'short') out.push({ t: '短局：手里的 2 张时代 III 事件还不能看，时代 I 结束时再看。', src: '手 24' });
    return out;
  }
  out.push(
    { t: `<b>所有人</b>弃掉手里的${AGE(old)}牌。`, src: '规 3' },
    { t: `移除场上${AGE(old)}的领袖、未完成奇迹（上面的蓝色标记退回蓝色供给区）${S.mode === 'first' ? '' : '和条约'}。`, src: '规 3' },
    { t: '其他在场的牌即使过时也保留：科技、殖民地、已完成奇迹、阵型、已宣告的战争。', src: '规 3' },
    { t: '<b>每人失去 2 个黄色标记</b>：从黄色人口区放回盒子。', src: '规 3' });
  if (S.gc) out.push({ t: '全球冲突：每人得文化 = 自己的军力等级 − 最弱文明的军力等级。', src: '手 24' });
  if (S.mode === 'short' && a === 2) out.push({ t: '短局：每人看自己的 2 张时代 III 事件，面朝下弃 1 张、留 1 张。谁都不能看别人留下或弃掉的牌。', src: '手 24' });
  if (!final) {
    if (change.out) out.push({ t: `有人体面退出过：先按剩余的 <b>${k} 人</b>给${AGE(a)}的牌堆重新删牌（跟开局一样，含 2 人局删条约），再洗。`, src: '规 4' });
    out.push({ t: `洗${AGE(a)}内政牌放上当前时代版图，卡牌列没补满就接着补。移走${AGE(a - 1)}的军事牌堆，洗${AGE(a)}军事牌放上。`, src: '规 3' });
    if (S.mode !== 'first' && S.exp.lw === 'public') out.push({ t: `公开混合：把${AGE(a)}的领袖、奇迹放上领袖板和奇迹板。`, src: '扩 5' });
  } else {
    out.push(
      { t: `${AGE(a)}没有牌：移走${AGE(a - 1)}的军事牌堆。卡牌列<b>不再补牌</b>（每回合照样移除、左移，右边空着）。<b>不能再抽军事牌</b>。`, src: S.mode === 'first' || S.mode === 'short' ? '手 21' : '规 3' },
      { t: S.lastRound === change.round ? '是在起始玩家的回合发完的：<b>本轮就是最后一轮</b>。' : '不是在起始玩家的回合发完的：本轮打完后，<b>下一轮是最后一轮</b>。', src: '规 1' },
      { t: `${war ? '最后一轮不能宣告战争；' : ''}这个时代起不能体面退出。起始玩家右手边的人打完最后一回合，游戏结束，大家回合数一样。`, src: '规 1 · 4' });
  }
  out.push({ t: '当前和未来事件牌堆不受时代结束影响。', src: '手 21' });
  return out;
}

// One turn, for the reference sheet (规 3–6; 快速参考).
export function turnRef(S) {
  const war = S.mode === 'full' || S.mode === 'short';
  const k = inGame(S).length;
  return [
    { h: '回合开始', items: [
      { t: `补卡牌列：移除最左边 ${k} 人对应的 <b>${rowRemove(k)} 格</b>（2 / 3 / 4 人分别是 3 / 2 / 1 格；已经空了就不用再移别的），其余左移不留空，再从当前时代内政牌堆从左补满。`, src: '规 3' },
      ...(war ? [{ t: '你宣告过的战争在这时结算：比军力，高的照卡面执行，平手无事；双方都不能打军事奖励牌。', src: '规 3' }] : []),
      { t: '你上回合打出的专属阵型，移到军事版图的公共阵型区（阵型旗留在上面，仍是你的阵型）。', src: '规 3' }
    ] },
    { h: '政治阶段：最多做 1 件', items: [
      { t: '筹划事件：手里一张事件面朝下放到未来事件牌堆顶，得文化 = 它的时代（A 0、I 1、II 2、III 3），再翻开当前事件牌堆顶一张结算。', src: '规 4' },
      ...(war ? [
        { t: '发动侵略：付卡上军事行动点，只能打<b>军力比你低</b>的对手；对手可以打军事奖励牌或弃军事牌（每张 +1）防守。', src: '规 4' },
        { t: '宣告战争：付军事行动点，放在面前，<b>下个回合开头</b>结算。最后一轮不能宣战。', src: '规 4' }
      ] : []),
      ...(S.mode !== 'first' && S.mode !== 'peace' && k > 2 ? [{ t: '提出条约 / 取缔条约（2 人局没有条约）。', src: '规 4' }] : []),
      { t: '体面退出（最后一个时代不能）。', src: '规 4' }
    ] },
    { h: '行动阶段：花白色（内政）和红色（军事）行动点', items: [
      { t: '从卡牌列拿牌：1 / 2 / 3 个内政行动点（看格子下方）。拿奇迹再加上已完成奇迹数，直接进场。', src: '规 5' },
      { t: '增加人口：1 内政 + 食物（黄色人口区最右边有标记那一段下方的数字）。', src: '规 5' },
      { t: '建造、升级、摧毁农场 / 矿山 / 城市建筑；打出领袖；建造奇迹的一个等级；发展科技（付科学点数）；打出行动牌：各 1 内政。', src: '规 5–6' },
      { t: '组建、升级、解散军事单位：各 1 军事。打出阵型 1 军事；复制公共阵型 2 军事，两者合计每回合一次。', src: '规 6' },
      { t: '宣告革命：花掉<b>全部</b>内政行动点 + 政府牌上较低的科学点数，换政府。', src: '规 6' }
    ] },
    { h: '回合结束：按顺序', items: [
      { t: '① 手里军事牌多于军事行动点总数的，弃到上限（面朝下）。弃完下一位就可以开始。', src: '规 6' },
      { t: '② 起义检查：不满工人多于空闲工人，<b>跳过整个生产</b>（照样抽军事牌）。', src: '规 6' },
      { t: '③ 生产：得科学点数和文化点数 → 腐败（蓝色供给区最左边露出的负数，扣资源，不够扣食物）→ 生产食物 → 消耗食物（黄色人口区最左边露出的负数，<b>缺 1 食物扣 4 文化</b>）→ 生产资源。', src: '规 6' },
      { t: '④ 每剩 1 个军事行动点抽 1 张当前时代军事牌，<b>最多 3 张</b>。最后一个时代不抽。', src: '规 6' },
      { t: '⑤ 白色、红色标记全部放回政府牌。', src: '规 6' }
    ] },
    { h: '事件牌堆', items: [
      { t: '当前事件牌堆最后一张翻完时：把未来事件牌堆洗混，按时代排好（老时代在上），面朝下成为新的当前事件牌堆。', src: '规 4' },
      { t: '结算完的事件放进过去事件牌堆，不会再出现；地区牌被拍下就成为殖民地。', src: '规 7' },
      { t: `结算事件时平手：当前玩家或顺时针离他更近的人算“更多”。${k === 2 ? '2 人局“最强 / 最弱的两个文明”读作“最强 / 最弱的那个”。' : ''}`, src: '规 7' }
    ] }
  ];
}

// The rules players get wrong most (BGG rules forum, B 站 comments, see docs/调研), checked against the rulebook.
export function dontForget(S) {
  const war = S.mode === 'full' || S.mode === 'short';
  return [
    { t: '每个时代只能拿 <b>1 张领袖</b>，拿过就算（哪怕后来离场）。换领袖时拿回 1 个内政行动点。', src: '规 5–6' },
    { t: '奇迹一级一级建：每次 1 内政 + 最左边没盖住那格的资源。同时只能有 1 个未完成奇迹。', src: '规 5–6' },
    { t: '行动牌<b>不能在拿到的那个回合</b>打出。', src: '规 6' },
    { t: '手里内政牌数 ≥ 内政行动点总数时，不能再拿非奇迹的牌（不用弃）。', src: '规 5 · 8' },
    { t: '腐败在生产食物和资源<b>之前</b>结算；未完成奇迹上的蓝色标记也算从供给区拿走的。', src: '规 6 · 手 20' },
    { t: '时代 I、II、III 结束时<b>每人失去 2 个黄色标记</b>，过时的领袖、未完成奇迹、手牌要清掉（本页“时代转换”会提醒）。', src: '规 3' },
    ...(war ? [{ t: '侵略只能打军力比你低的；战争下回合开头结算，没有这个限制，但最后一轮不能宣战。', src: '规 3–4' }] : []),
    { t: '新打出的阵型下个回合开头移到公共阵型区；复制公共阵型花 2 军事行动点。', src: '规 3 · 6' },
    { t: '殖民不能用拿破仑这类改军力的效果，派出的单位要牺牲。', src: '规 7' }
  ];
}
