// N-minute teach: a script the teacher reads aloud to start a game, written from CGE's official rulebook and handbook
// (same wording as tools/讲解稿.md). It names every important element in a sentence and leaves the fine rulings to the
// rules assistant. Terms in {text|id} open a note with a picture cropped from the official Simplified Chinese rulebook
// or handbook (img/teach/<icon>.webp); the 「问」 buttons and each note's 「问规则助手」 ask the rules assistant (chat.js).
// Two modes, chosen at the top and remembered: the handbook's first game (default) or the full game.
// A line, question or note is for both, or {f} first game only / {x} full game only.
const ICON = (id, cls = '') => id ? `<img class="ico ${cls}" src="img/teach/${id}.webp" alt="">` : '';

// id: name, where you see it on the table, what it means. icon: a picture in img/teach/.
const TERMS = {
  cardrow: { name: '卡牌列', icon: 'cardrow', where: '桌子中间一长条 13 格的版图，上面一排翻开的内政牌。', what: '大家从这里拿牌。左边 5 格各 1 个内政行动点，中间 4 格 2 个，右边 4 格 3 个。每个回合开头移除最左边几格、左移、补满。' },
  civil: { name: '内政牌', icon: 'civilbacks', where: '浅色背的牌，时代 A、I、II、III 各一叠。', what: '科技、领袖、奇迹、行动牌都是内政牌，从卡牌列拿。当前时代的内政牌堆发完，就进入下一个时代。' },
  military: { name: '军事牌', icon: 'milbacks', where: '深色背的牌，时代 A、I、II、III 各一叠。', what: '回合结束时按剩下的军事行动点抽，手里的数量不能超过军事行动点。里面有事件、侵略、战争、条约、阵型和军事奖励牌。' },
  ageboard: { name: '当前时代版图', icon: 'ageboard', where: '卡牌列旁边的小版图，放当前时代的内政牌堆和军事牌堆。', what: '内政牌堆最后一张发到卡牌列，这个时代就结束了，换上下一个时代的两叠牌。' },
  playerboard: { name: '玩家版图', icon: 'playerboard', where: '每人面前一块，上面印着 6 张起始科技。', what: '下面是蓝色供给区、黄色人口区、工人区和幸福等级。生产阶段的顺序也印在上面。' },
  tokens: { name: '内政和军事行动点', icon: 'tokens', where: '白色和红色的方块，放在政府牌上。', what: '白色是内政行动点，红色是军事行动点。做一件事就拿走一个，回合结束全部放回。专制政府给 4 白 2 红。' },
  gov: { name: '政府', icon: 'despot', where: '玩家版图右上角的专制政府，以后换成橙色的政府牌。', what: '决定你每回合有几个内政和军事行动点，以及每种城市建筑最多建几个。' },
  bluebank: { name: '蓝色供给区', icon: 'bluebank', where: '玩家版图左下的 16 格蓝色方块。', what: '蓝色标记放在农场上是食物，放在矿山上是资源。生产时从这里拿；拿得太空会露出负数，就是腐败。' },
  yellowbank: { name: '黄色人口区', icon: 'yellowbank', where: '玩家版图最下面一排黄色方块，上方印着笑脸数。', what: '增加人口时从最右边拿一个黄色标记变成工人。拿空一段会露出负数，就是每回合要吃的食物；空出的小区上方数字是需要的笑脸。' },
  workers: { name: '工人区', icon: 'workerpool', where: '玩家版图上橙色的一块。', what: '空闲工人放在这里，建造农场、矿山、城市建筑或组建军事单位时把他放到科技卡上。' },
  farm: { name: '农场和矿山', icon: 'farm', where: '棕色科技牌，右上角是麦穗（农场）或锤镐（矿山）。', what: '卡上每个工人就是一座农场或矿山，生产阶段各产 1 个蓝色标记，价值看卡底数字。' },
  urban: { name: '城市建筑', icon: 'urban', where: '灰色科技牌：实验室、神庙、竞技场、图书馆、剧院。', what: '卡上每个工人一座建筑，产科学、笑脸或文化。每种建筑的数量受政府限制。' },
  unit: { name: '军事单位', icon: 'unit', where: '红色科技牌：步兵、骑兵、火炮、空军。', what: '卡上每个工人一个单位，提供军力。组建花军事行动点和资源。' },
  special: { name: '特殊科技', icon: 'special', where: '蓝色科技牌，右上角是天平、拳头、指南针或建筑图标。', what: '不用放工人，打出就有永久效果，比如多给行动点或降低费用。同类只留等级高的。' },
  leader: { name: '领袖', icon: 'leader', where: '绿色的人物牌。', what: '打出花 1 内政行动点，带来特殊能力。同时只能有 1 个；每个时代只能拿 1 张。换领袖拿回 1 个内政行动点。' },
  wonder: { name: '奇迹', icon: 'wonder', where: '紫色横放的牌，底部一排资源数字。', what: '拿了直接进场，一级一级付资源建造，建完才生效。同时只能有 1 个没建完。' },
  action: { name: '行动牌', icon: 'action', where: '黄色的内政牌。', what: '一次性效果，打出花 1 内政行动点。不能在拿到的那个回合打出。' },
  culture: { name: '文化点数', icon: 'cultureboard', where: '文化版图：上面是文化点数，下面是文化增速。', what: '游戏结束时文化最高的人赢。每回合按文化增速得文化，筹划事件、侵略、战争、奇迹等也会加减。' },
  science: { name: '科学点数', icon: 'scienceboard', where: '科学版图：上面是科学点数，下面是科学增速。', what: '每回合按科学增速得科学点数，发展科技时花掉。' },
  happy: { name: '笑脸和幸福等级', icon: 'happy', where: '黄色笑脸标记，在玩家版图的幸福等级条上。', what: '神庙、竞技场、部分奇迹和领袖给笑脸，0–8。人口越多需要越多笑脸，不够就有不满工人，太多会起义。' },
  milboard: { name: '军事版图', icon: 'milboard', where: '桌上红色的竖版图：外圈是军力等级，中间是公共阵型区，下面三叠是未来、当前、过去事件牌堆。', what: '记大家的军力、放公开的阵型，也是事件牌堆的位置。' },
  tactic: { name: '阵型', icon: 'tactic', where: '红色军事牌，下半画着几个军事单位图标。', what: '凑齐上面画的单位就编成一支军队，多加军力。打出后下个回合移到公共阵型区，别人花 2 个军事行动点可以复制。' },
  event: { name: '事件', icon: 'event', where: '绿色军事牌，右上角有事件图标。', what: '政治阶段打出到未来事件牌堆，得文化，再翻开当前事件牌堆顶一张，所有人照卡面执行。' },
  territory: { name: '地区牌（殖民地）', icon: 'territory', where: '绿色军事牌，画着一片新土地。', what: '作为事件被翻出时，大家竞拍殖民：派军事单位（会牺牲）拿下它，得到一次性奖励和永久效果。' },
  bonus: { name: '军事奖励牌', icon: 'bonus', where: '半棕半绿的军事牌，上半防御值、下半殖民值。', what: '被侵略时打出加防御，殖民时打出加殖民军力。' },
  aggression: { name: '侵略', icon: 'aggression', where: '棕色军事牌。', what: '政治阶段打出、马上结算，只能打军力比你低的人；成功就照卡面抢东西。' },
  war: { name: '战争', icon: 'war', where: '灰色军事牌，名字是“为……而战”。', what: '宣告后到你下个回合开头才结算，比军力决定输赢，差得越多效果越大。最后一轮不能宣战。' },
  pact: { name: '条约', icon: 'pact', where: '蓝色军事牌，有握手图标。', what: '向一位玩家提出，对方同意就生效，双方各有好处。每人区域最多 1 张。2 人局没有条约。' },
  discard: { name: '弃多余的军事牌', icon: 'e_discard', where: '玩家版图生产阶段左边第一个图标。', what: '回合结束第一步：手里军事牌超过军事行动点的，弃到上限。弃完下一位就可以开始。' },
  corrupt: { name: '腐败', icon: 'e_corrupt', where: '蓝色供给区每段最左一格的负数。', what: '生产时最左边露出来的负数就是腐败：失去这么多资源，不够扣食物。供给区剩 11 个以上就没有腐败。' },
  consume: { name: '消耗食物', icon: 'e_consume', where: '黄色人口区每段最左一格的负数。', what: '最左边露出来的负数就是每回合要吃的食物；缺 1 个食物扣 4 文化。' },
  draw: { name: '抽军事牌', icon: 'e_draw', where: '玩家版图生产阶段右边的图标。', what: '回合结束时每剩 1 个军事行动点抽 1 张，最多 3 张。' },
  reset: { name: '恢复行动点', icon: 'e_reset', where: '玩家版图生产阶段最右边的图标。', what: '回合最后一步：白色、红色标记全部放回政府牌，下个回合再用。' }
};

// The script: what to read aloud. Every important element gets one sentence; how it is ruled exactly is for the assistant.
const PARTS = [
  { title: '怎么赢', sec: 30, lines: [
    { f: '这局玩《历史巨轮》，按玩家手册的第一局玩法。我先讲一遍主流程，讲完再一条条过注意事项。', x: '这局玩《历史巨轮》完整游戏。我先讲一遍主流程，讲完再一条条过注意事项。' },
    '我们各带领一个文明，从古代一路发展。游戏结束时{文化点数|culture}最高的人赢，平手共享胜利。',
    { f: '第一局只玩时代 A、I、II 三个时代，大家不互相攻击。最后按手册的 7 项再加一次分。', x: '一共四个时代：A、I、II、III。终局时把剩下的时代 III 事件逐张结算加分。' }
  ], ask: ['终局怎么计分？', '平分怎么判胜负？'] },
  { title: '一轮怎么走', sec: 50, lines: [
    '从起始玩家开始顺时针，每人一个回合。起始玩家整局不变。',
    '每个回合四步：先补{卡牌列|cardrow}；政治阶段最多做 1 件事；行动阶段花行动点；回合结束做生产。',
    '每人有白色的内政行动点和红色的军事行动点，就是{这些方块|tokens}，放在{政府|gov}牌上。做一件事拿走一个，回合结束全部放回。',
    '第一轮特殊：起始玩家只有 1 个内政行动点，顺时针下一位 2 个，再下一位 3 个，以此类推；没有军事行动点，只能从卡牌列拿牌。'
  ], ask: ['第一轮能做什么？', '行动点用不完怎么办？'] },
  { title: '卡牌列和手牌', sec: 50, lines: [
    '{卡牌列|cardrow}上的牌越往右越贵：左边 1 个内政行动点，中间 2 个，右边 3 个。',
    '每个回合开头先移除最左边几张：2 人 3 张，3 人 2 张，4 人 1 张；剩下的左移，再从当前时代的{内政牌|civil}补满。房间的进度页会提醒。',
    '内政牌有科技、{领袖|leader}、{奇迹|wonder}、{行动牌|action}。科技拿到手里，再花{科学点数|science}发展才算打出。',
    '手里的内政牌不能超过内政行动点总数；领袖每个时代只能拿 1 张；奇迹拿了直接进场，一级一级付资源建。'
  ], ask: ['奇迹怎么建？', '一个时代能拿几张领袖？'] },
  { title: '工人、建筑和资源', sec: 60, lines: [
    '{玩家版图|playerboard}上印着起始科技。{农场|farm}产食物，矿山产资源，都用蓝色标记表示，从{蓝色供给区|bluebank}拿。',
    '{城市建筑|urban}里实验室产科学，神庙给笑脸和文化，以后还有图书馆、剧院、竞技场。{军事单位|unit}提供军力。',
    '建造就是花 1 内政行动点加资源，把{工人区|workers}的空闲工人放到这张科技卡上。升级、摧毁也各花 1 点。',
    '增加人口花 1 内政行动点加食物，从{黄色人口区|yellowbank}最右边拿一个黄色标记变成工人。人口越多，每回合吃的食物越多，需要的{笑脸|happy}也越多。',
    '{特殊科技|special}不用放工人，打出就有永久效果；换{政府|gov}能多拿行动点。'
  ], ask: ['增加人口要几个食物？', '起义是什么？'] },
  { title: '回合结束：生产', sec: 50, lines: [
    '先{弃多余的军事牌|discard}，弃完下一位就可以开始了。',
    '然后生产：先按增速得科学和文化，再算{腐败|corrupt}，然后农场产食物，再{消耗食物|consume}，最后矿山产资源。腐败和消耗都是看版图上最左边露出来的负数，缺食物每缺 1 个扣 4 文化。',
    '如果不满的工人比空闲工人多，就是起义，整个生产跳过。',
    '最后每剩 1 个军事行动点{抽军事牌|draw}，最多 3 张，再{恢复行动点|reset}。'
  ], ask: ['腐败怎么算？', '回合结束时按什么顺序结算？'] },
  { title: '军事和事件', sec: 60, lines: [
    '{军事牌|military}回合结束时抽。{阵型|tactic}能把军事单位编成军队，多加军力；军力记在{军事版图|milboard}上。',
    '政治阶段可以筹划{事件|event}：把手里的事件放到未来事件牌堆，按时代得文化，再翻开当前事件牌堆顶一张，所有人照着做。',
    '翻出{地区牌|territory}时大家竞拍殖民，派军事单位过去（这些单位会牺牲），可以打{军事奖励牌|bonus}的殖民值。',
    { f: '第一局没有侵略、战争、条约，军力主要用来殖民和应付事件。', x: '政治阶段还可以发动{侵略|aggression}（只能打军力比你低的人）、宣告{战争|war}（下个回合开头结算），或提出{条约|pact}（2 人局没有）。' }
  ], ask: ['殖民怎么竞拍？', '当前事件牌堆翻完了怎么办？'] },
  { title: '时代和游戏结束', sec: 45, lines: [
    '起始玩家第二个回合开头，时代 A 结束，换上时代 I 的牌。之后每当{当前时代版图|ageboard}上的内政牌发完，就进入下一个时代。',
    '时代 I、II、III 结束时，所有人弃掉过时的手牌，移除过时的领袖和没建完的奇迹，每人还要失去 2 个黄色标记。房间里点一下，所有手机都会弹出这张清单。',
    { f: '时代 II 的牌发完就进入收尾：如果正好是起始玩家的回合，这一轮就是最后一轮，否则下一轮是最后一轮。然后按手册的 7 项加分。', x: '时代 III 的牌发完就进入收尾：如果正好是起始玩家的回合，这一轮就是最后一轮，否则下一轮是最后一轮。然后结算剩下的时代 III 事件。' },
    '讲完了。下面一条条过注意事项。'
  ], ask: ['时代结束时要做哪些事？', '游戏什么时候结束？'] }
];

// After the script: the points people get wrong, with answers (rulebook, handbook, BGG, see tools/faq.json).
// [title, answer, mode] — mode 'f' first game only, 'x' full game only.
const NOTES = [
  ['回合结束的顺序', '弃多余军事牌 → 起义检查 → 生产（科学和文化 → 腐败 → 生产食物 → 消耗食物 → 生产资源）→ 抽军事牌（最多 3 张）→ 恢复行动点。腐败在生产之前算。'],
  ['腐败和消耗看哪个数', '都是看版图上最左边露出来的那个负数。蓝色供给区剩 11 个以上就没有腐败；没建完的奇迹上的蓝色标记也算拿走了。'],
  ['领袖：每个时代只能拿 1 张', '拿过就算，哪怕后来被换掉。场上同时只能有 1 个领袖，换新的时旧的弃掉，拿回 1 个内政行动点。第一轮拿到的领袖不能当回合打出。'],
  ['奇迹一级一级建', '拿奇迹的费用是格子费用加已完成的奇迹数。之后每次花 1 内政行动点，付最左边那格的资源盖上蓝色标记，全盖满才生效。同时只能有 1 个没建完。'],
  ['行动牌不能当回合打', '黄色行动牌要等以后的回合才能打出，打出时花 1 内政行动点。卡上要求的行动（比如建造、发展科技）不用再另付行动点。'],
  ['手里内政牌满了', '手里内政牌数达到内政行动点总数（政府牌上的白色标记数），就不能再拿非奇迹的牌，但不用弃牌。奇迹直接进场，所以手满了也能拿。'],
  ['城市建筑有上限', '每一种城市建筑（实验室、神庙等，不同等级合计）不能超过政府牌右下角的数字。想多建就要换更好的政府。农场、矿山没有这个限制。'],
  ['卡牌列每回合要移除', '每个回合开头移除最左边 3 / 2 / 1 格（2 / 3 / 4 人）里剩下的牌，再左移、补满。已经空了就不用再移别的。第一轮不补。'],
  ['时代结束要清理', '时代 I、II、III 结束时：弃手里过时的牌，移除过时的领袖、没建完的奇迹和条约，每人失去 2 个黄色标记。科技、殖民地、已完成的奇迹都留着。时代 A 结束只换牌堆。'],
  ['最后一轮怎么定', '最后一个有牌的时代发完时，如果是起始玩家的回合，这一轮就是最后一轮；否则下一轮是。起始玩家右手边的人打完就结束，大家回合数一样。'],
  ['起义照样抽军事牌', '不满工人比空闲工人多就是起义：只跳过生产阶段（科学、文化、腐败、食物、资源都不算），弃多余军事牌和抽军事牌照做。这是新版的改动。'],
  ['阵型下回合才公开', '打出的阵型下个回合开头移到公共阵型区；别人复制花 2 个军事行动点。打出和复制合计每回合一次。'],
  ['事件牌堆翻完了', '把未来事件牌堆洗混，按时代排好（老的在上），变成新的当前事件牌堆。结算完的事件进过去事件牌堆，不会再出现。'],
  ['殖民派出的单位会牺牲', '竞拍出价不能超过你真能派出的殖民军力。派出的单位回黄色人口区。殖民不算拿破仑这类改军力的效果。'],
  ['侵略只能打比你弱的', '对手军力大于或等于你时不能侵略。对手可以打军事奖励牌或弃军事牌（每张 +1）防守。新版不能牺牲单位。', 'x'],
  ['战争下回合才结算', '宣战后到你下个回合开头比军力，双方都不能打军事奖励牌。宣战没有“必须比对方强”的限制，但最后一轮不能宣战。', 'x'],
  ['第一局的终局计分', '在文化点数上加：时代 I 科技每张 1 分、时代 II 科技每张 2 分（政府再算一次）、科学增速、军力等级、幸福等级、食物和资源产量、殖民地每个 3 分、时代 II 奇迹每个 6 分。房间计分页会帮你加。', 'f'],
  ['终局只算时代 III 事件', '当前和未来事件牌堆里剩下的时代 III 事件逐张结算，更早时代的事件不算。再算比尔·盖茨这类终局奖励。', 'x'],
  ['玩过 App 的注意', 'App 的“数字规则”里殖民是暗标、事件在受影响玩家回合开始时结算；纸版是轮流加价竞拍、翻开就结算。富饶之地 I 纸版印 5 资源，App 是 6。']
];

// Icon reference at the bottom, grouped by where they are on the table. [group, ids, mode]
const GROUPS = [
  ['公共版图', ['cardrow', 'ageboard', 'culture', 'science', 'milboard']],
  ['你面前', ['playerboard', 'gov', 'tokens', 'bluebank', 'yellowbank', 'workers', 'happy']],
  ['内政牌', ['civil', 'farm', 'urban', 'unit', 'special', 'leader', 'wonder', 'action']],
  ['军事牌', ['military', 'tactic', 'event', 'territory', 'bonus', 'aggression', 'war', 'pact']],
  ['回合结束', ['discard', 'corrupt', 'consume', 'draw', 'reset']]
];

const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const term = (text, id) => `<button type="button" class="term" data-t="${id}">${ICON(TERMS[id].icon)}${esc(text)}</button>`;
const line = s => esc(s).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>').replace(/\{([^|}]+)\|(\w+)\}/g, (_, t, id) => term(t, id));
// inside a button the terms show their icon but are not buttons themselves
const label = s => esc(s).replace(/\{([^|}]+)\|(\w+)\}/g, (_, t, id) => `<span class="tlab">${ICON(TERMS[id].icon)}${esc(t)}</span>`);
const askBtn = (text, q) => `<button type="button" class="tq" data-q="${esc(q)}">问 <span>${label(text)}</span></button>`;

// mode: 'f' the handbook's first game (default), 'x' the full game; remembered in this browser
let mode = 'f';
try { if (localStorage.getItem('tta-teach-mode') === 'x') mode = 'x'; } catch {}
const pick = x => typeof x === 'string' ? x : x[mode];          // a line or question for both modes, or {f, x}
const only = list => list.map(pick).filter(Boolean);
const notes = () => NOTES.filter(n => !n[2] || n[2] === mode);
const FM = 'https://filemanager.czechgames.com/storage/files/through-the-ages-a-new-story-of-civilization';
const RULES_ZH = `${FM}/rules/through-the-ages-new-story-rules-zh-s.pdf`;
const HB_ZH = `${FM}/other-downloads/handbook/through-the-ages-new-story-handbook-zh-s.pdf`;

function render() {
  const total = PARTS.reduce((t, p) => t + p.sec, 0) / 60;
  document.getElementById('teach').innerHTML = `
  <div class="tmode" role="group" aria-label="这局怎么玩"><span>这局</span>
    <button type="button" data-mode="f" aria-pressed="${mode === 'f'}">第一局简化</button><button type="button" data-mode="x" aria-pressed="${mode === 'x'}">完整游戏</button></div>
  <p class="tlead">讲的人照着念，约 ${Math.round(total)} 分钟就能开局。<b>带下划线的词</b>点一下看图和解释；有疑问点「问」，规则助手马上回答。${mode === 'f' ? '新手第一局建议 2–3 人。' : ''}</p>
  <nav class="tnav">${PARTS.map((p, i) => `<a href="#p${i + 1}"><i>${i + 1}</i>${p.title}</a>`).join('')}<a href="#later">注意事项</a><a href="#icons">图标速查</a></nav>
  ${PARTS.map((p, i) => `<section class="card tpart" id="p${i + 1}">
    <h2 class="h"><span><i>${i + 1}</i>${p.title}</span><small>约 ${p.sec} 秒</small></h2>
    ${only(p.lines).map(s => `<p class="tline">${line(s)}</p>`).join('')}
    <div class="tasks"><em>桌上常见疑问</em>${only(p.ask).map(q => askBtn(q, q)).join('')}</div>
  </section>`).join('')}
  <section class="card tpart" id="later">
    <h2 class="h"><span><i>!</i>注意事项</span><small>${notes().length} 条</small></h2>
    <p class="tnote">流程讲完后，一条一条过一遍。这些是主流程之外容易出错、容易争的地方，点开念答案。</p>
    ${notes().map(([t, a, m], i) => `<details class="fq tnotei"><summary><i>${i + 1}</i>${esc(t)}${m === 'x' ? '<em class="tnw">完整</em>' : m === 'f' ? '<em class="tnw">第一局</em>' : ''}</summary><p>${esc(a)}</p>
      <button type="button" class="tq tmore" data-q="${esc(`「${t}」这一条我还有疑问，请再讲讲。`)}">还有疑问？问规则助手</button></details>`).join('')}
    <p class="tnote">注意事项里没有的，点右下角「规则」问 AI，本站资料查不到会联网找。</p>
  </section>
  <a class="btn tgo" href="/">讲完了，去建房间</a>
  <h2 class="h" id="icons">图标速查<small>点图标看解释</small></h2>
  ${GROUPS.filter(g => !g[2] || g[2] === mode).map(([g, ids]) => `<div class="card tgrid"><h3>${g}</h3><div>${ids.map(id => `<button type="button" class="tic" data-t="${id}">${ICON(TERMS[id].icon)}<span>${TERMS[id].name}</span></button>`).join('')}</div></div>`).join('')}
  <footer>依据 CGE 官方规则书和玩家手册 · 图片截自 CGE 官方简体中文版<a href="${RULES_ZH}" target="_blank" rel="noopener">规则书</a>和<a href="${HB_ZH}" target="_blank" rel="noopener">玩家手册</a>，版权归 Czech Games Edition 所有 · 非官方玩家工具</footer>`;
}
render();

// The note for a term: a sheet from the bottom with the picture, where it is and what it means.
const sheet = document.createElement('div');
sheet.className = 'tsheet hidden';
document.body.appendChild(sheet);
const close = () => sheet.classList.add('hidden');
function show(id) {
  const t = TERMS[id];
  sheet.innerHTML = `<div class="tsbg"></div><div class="tsbox" role="dialog" aria-label="${esc(t.name)}">
    <div class="tshd">${ICON(t.icon, 'big')}<b>${esc(t.name)}</b><button type="button" class="tsx" aria-label="关闭">×</button></div>
    <p><em>在哪儿看到</em>${esc(t.where)}</p><p><em>什么意思</em>${esc(t.what)}</p>
    <button type="button" class="btn navy tsask" data-q="${esc(`「${t.name}」是什么，怎么用？`)}">还不懂？问规则助手</button></div>`;
  sheet.classList.remove('hidden');
}
const ask = q => { close(); window.askRules?.(q); };
document.addEventListener('click', e => {
  const m = e.target.closest('[data-mode]');
  if (m) {
    if (m.dataset.mode === mode) return;
    mode = m.dataset.mode;
    try { localStorage.setItem('tta-teach-mode', mode); } catch {}
    return render();
  }
  const t = e.target.closest('[data-t]');
  if (t) return show(t.dataset.t);
  const q = e.target.closest('[data-q]');
  if (q) return ask(q.dataset.q);
  if (e.target.closest('.tsx,.tsbg')) close();
});
addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
