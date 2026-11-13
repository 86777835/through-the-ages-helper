# Through the Ages: A New Story of Civilization（历史巨轮）· BGG 英文社区调研

调研日期：2026-11-13
对象：Through the Ages: A New Story of Civilization（CGE 2015，设计 Vlaada Chvátil）
BGG id **182028 已核实**：https://boardgamegeek.com/boardgame/182028/through-the-ages-a-new-story-of-civilization
（它是 2006 年原版 [25613](https://boardgamegeek.com/boardgame/25613) 的重制版。）
扩展 **New Leaders and Wonders**，BGG id **280833**：https://boardgamegeek.com/boardgame/280833
官方数字版在 BGG 视频游戏库的 id 是 **234379**。

---

## 0. 方法与局限（先读）

- **数据来源**：BGG XML API 需要 token，没用上。改用 BGG 网页前端在用的 JSON 接口 `api.geekdo.com/api/...`，拿到的是原始数据。
- **抓取范围**
  - 基础版各区主题列表全部列出：Rules 581 / General 550 / Strategy 249 / Variants 112 / Reviews 33 / News 20 / Sessions 11。扩展：General 97 / Rules 46 / Strategy 17 / Variants 5。
  - **Rules 区 581 个主题全部抓了正文和全部回帖**，共 4,039 帖。扩展 Rules 46 个主题也全部抓取。
  - General：按“回帖 + 点赞”取前 130 个主题，另加按标题关键词挑的主题（App、时长、组件、教学、扩展、新旧版等），共 262 个。
  - Strategy 取前 60 个，Variants、Reviews、News 全部抓取。
  - 官方 App 论坛（视频游戏条目 234379，General 202 个主题）：只列了标题，又挑 15 个和“实体版对比”相关的主题读了全文。
  - **Files 区：基础版 66 个、扩展 9 个文件，全部列出**（含点赞数）。
  - 合计读入 1,222 个主题、约 15,300 帖。
- **官方身份识别**：发帖人共 1,996 个，逐个查了 BGG 用户资料里的 publisherid / designerid。认定为官方的账号：
  - 设计师 `Vlaada`（designerid 789）
  - CGE 员工（publisherid 7345）：`David4242`、`karel_danek`、`Elwen`、`LoreChase`、`kreten`
  - 以上账号在已抓主题里共发 99 帖，分布在 71 个主题。主力是 David4242（53 帖，多为 App 和扩展相关）。
  - **基础版 Rules 区几乎没有官方答复**：581 个主题里只有 8 个有官方回帖。规则问题基本由资深玩家回答，例如 `grant5`（261 帖）、`Benkyo`（217）、`Picon`（121）、`Qurqirish Dragon`（111）。他们不是官方。
  - `JanaZemankova` 上传了扩展的官方规则书，但她的 publisherid 是 Albi，不是 CGE，因此没有算作官方。
- **规则书 PDF 没有读**。文中涉及的规则细节都转引自论坛里引用规则书的帖子，以及官方账号的回帖，正式做站前要拿实体规则书或官网 PDF 逐条核对。官网 PDF：基础版 Handbook 见 [3429736](https://boardgamegeek.com/thread/3429736) 帖里的链接，扩展规则书见 David4242 在 [2295078](https://boardgamegeek.com/thread/2295078) 给的链接。
- **频次统计是关键词归类**：一个主题可以同时算进多类，数字只是数量级参考，不是精确比例。
- **只查了 BGG**，没有查 App Store、Google Play 或网页上的第三方 companion app，所以“现有工具”一节只反映 BGG 上能看到的情况。

---

## 1. 基本数据（BGG，2026-11-13 读取）

| 项 | 数值 |
|---|---|
| 人数 | 2–4（社区投票 803 票：**最佳 3 人**，2–4 人都推荐） |
| 盒标时长 | 120 分钟（明显偏短，见下方“实际时长”） |
| 年龄 | 14+ |
| 重度 | **4.44 / 5**（1,783 票），属于 BGG 最重的一档 |
| 评分 / 排名 | 平均 8.24，35,331 人评分；**总榜第 19，策略榜第 16** |
| 拥有 / 记录对局 | 40,815 人拥有，155,812 次对局 |
| 语言依赖 | 最高一档：“大量文字，需要大规模翻译才能玩” |
| 机制标签 | Action Points、Auction（含荷兰式拍卖）、Events、Income、Open Drafting、Player Elimination、Take That、Tableau Building |
| 荣誉 | 2015 Golden Geek 年度游戏、最佳策略游戏提名；BGG 名人堂 |
| 数字版 | Steam、iOS、Android（CGE 官方）、Board Game Arena 均有 |

扩展 New Leaders and Wonders：1,936 人评分，平均 8.89，重度 4.23，7,055 人拥有；社区投票同样是最佳 3 人（30 票）。

### 1.1 实际时长（玩家报告）

主要来源：[Playtime? New compared to previous version](https://boardgamegeek.com/thread/1465932)（28 帖）、[Confused about game length](https://boardgamegeek.com/thread/1855755)（22 帖）、[How to play this game two player under four hours?](https://boardgamegeek.com/thread/1768710)、[[POLL] The real playing time](https://boardgamegeek.com/thread/1647910)、[Thoughts and questions after first game](https://boardgamegeek.com/thread/2787266)。

| 情形 | 玩家报告 |
|---|---|
| 熟手 | 最常见的说法是“每人 45 分钟左右，另加摆放和收拾”。也有人说“每人 1 小时 + 1 小时”。一个组报告 2 人 90 分钟、3 人 135 分钟、4 人 210 分钟（含摆放和收拾） |
| 2 人熟手 | 一对夫妻长期稳定在 2 小时 15 分到 2 小时 30 分（含摆放和收拾）；首局 4 小时以上（[2598978](https://boardgamegeek.com/thread/2598978)） |
| 3 人 | 多数报 2.5–4.5 小时 |
| 4 人 | 多数报 3–5 小时 |
| **首局** | 4 人新手 7–9 小时的报告不止一例：9 小时 2 分（[2787266](https://boardgamegeek.com/thread/2787266)），晚 7 点玩到凌晨 5 点（[2033415](https://boardgamegeek.com/thread/2033415)），首局 4 人 8 小时以上。3 人首局常见 5 小时 |
| App 对照 | “4 人局在 App 上 1 小时，实体 4 小时”（[2989390](https://boardgamegeek.com/thread/2989390)）；“上一局实体 4 人 5–6 小时，App 3 人（2 个 AI）30 分钟”（[2256692](https://boardgamegeek.com/thread/2256692)） |

**首局 / 教学**

- 设计师在发售前的帖子里说过新手局的安排（[1454626](https://boardgamegeek.com/thread/1454626)）：首局只玩到时代 II 结束，不用侵略、战争、协定，结束时加一个简单的额外计分。
- 玩家说 Handbook（教学手册）里是这样写的，并且其他变体（含和平变体）在 Handbook 第 24 页（[3429736](https://boardgamegeek.com/thread/3429736)）。
- 首局慢的原因，社区归纳为三点：所有卡都要现读；拿不准规则，要停下来翻书（有人说光“幸福度”一条就查了 30 分钟以上，见 [2033415](https://boardgamegeek.com/thread/2033415)）；还有选择困难的玩家。

---

## 2. 论坛总体与频次

| 分区 | 主题数 | 帖子数 |
|---|---|---|
| Rules | 581 | 4,039 |
| General | 550 | 7,049 |
| Strategy | 249 | 4,238 |
| Variants | 112 | 979 |
| Reviews | 34 | 421 |
| News | 20 | 690 |
| 扩展 General / Rules | 97 / 46 | 1,090 / 290 |
| 官方 App 论坛 General | 202 | 1,759 |

### 2.1 Rules 区 581 个主题按标题关键词归类

可多类重复计数；“回帖”列为回帖合计。

| 类别 | 主题数 | 占比 | 回帖 |
|---|---|---|---|
| **某个具体领袖**（汉谟拉比、荷马、米开朗基罗、贞德、圣彼得大教堂组合等） | 115 | 20% | 727 |
| **生产 / 维护 / 腐败 / 食物消耗 / 蓝色标记 / 付款找零** | 90 | 15% | 592 |
| 事件 / Impact of… / 政治牌 | 80 | 14% | 537 |
| 科技 / 建筑 / 升级 | 76 | 13% | 441 |
| 侵略 / 战争 | 63 | 11% | 318 |
| 某个具体奇迹 | 60 | 10% | 322 |
| 战术 / 军力 / 部队 | 55 | 9% | 299 |
| 卡牌行 / 拿牌 / 手牌上限 / 弃牌 | 51 | 9% | 282 |
| 幸福 / 不满 / 起义 / 黄色标记 | 44 | 8% | 281 |
| 协定 | 41 | 7% | 306 |
| 时代结束 / 过时 / 失去黄色标记 | 38 | 7% | 206 |
| 行动点（白 / 红） | 36 | 6% | 198 |
| 殖民 / 领土拍卖 | 30 | 5% | 168 |
| 终局计分 / 结束时机 | 29 | 5% | 143 |
| 文化 / 科研点（“点数还是速率”） | 24 | 4% | 132 |
| 政府 / 革命 | 20 | 3% | 141 |
| 开局 / 人数 / 首局 / 移除卡牌 | 19 | 3% | 141 |
| App / 数字版与实体差异 | 16 | 3% | 132 |
| 认输 | 4 | 1% | 27 |
| 未归类（多为“几个问题”这类标题） | 52 | 9% | — |

另一种口径是“标题 + 首帖正文”，或在任意回帖里出现：

| 关键词 | 标题 + 首帖 | 任意帖出现 |
|---|---|---|
| culture / science（文化、科研的点数和速率） | 143（25%） | 233 |
| **app / digital / online / BGO / steam** | 45（8%） | **127（22%）** |
| forgot / mistake / wrong（忘了 / 弄错） | 34 | **131** |
| 黄色标记 / 黄色库 | 46 | 120 |
| 协定 pact | 51 | 108 |
| 食物 / 消耗 | 55 | 105 |
| 政府 / 革命 | 44 | 102 |
| 殖民 / 领土 | 56 | 99 |
| war | 56 | 95 |
| 不满 / 起义 / 笑脸 | 49 | 90 |
| 蓝色标记 / 蓝色库 | 46 | 79 |
| 侵略 aggression | 26 | 70 |
| 终局 | 32 | 68 |
| 时代结束 | 25 | 62 |
| 卡牌行 | 21 | 58 |
| 腐败 | 25 | 56 |
| Impact of（时代 III 计分事件） | 24 | 44 |
| 当前 / 未来事件牌堆 | 15 | 36 |

**解读**

- 问得最多的是**具体卡的效果和组合**：领袖 + 奇迹占三成。原因是卡多、字多，而且和规则的交互细。这一类适合放进“卡牌速查”，不适合做进流程。
- **流程类问题集中在回合末的生产和维护**：腐败、消耗、蓝色标记找零、黄色标记、幸福。这正是线下最容易算错的地方。
- **22% 的规则主题提到 App 或线上版**。很多人是先在 App 上玩熟，再转实体，然后发现 App 替他们做的那些事不会做。见第 4 节。
- “忘了 / 弄错”在 131 个主题里出现过。

### 2.2 Rules 区回帖最多的主题

| 回帖 | 点赞 | 主题 |
|---|---|---|
| 84 | 3 | [Patriotism / Max](https://boardgamegeek.com/thread/2245437)（卡牌组合，App 行为和规则书有出入） |
| 65 | 2 | [Asking before proposing a pact](https://boardgamegeek.com/thread/2138271)（结论：提协定前不能私下谈） |
| 35 | **48** | [Frequently Overlooked Rules](https://boardgamegeek.com/thread/1603437)（**玩家整理的“常被忽略规则”清单**，Rules 区点赞最高） |
| 31 | 0 | [Discontent worker question](https://boardgamegeek.com/thread/1531883)（不满工人怎么数） |
| 26 | 1 | [Questions regarding Impact of ...](https://boardgamegeek.com/thread/1467922)（时代 III 计分事件怎么数） |
| 25 | 0 | [Can I choose not to produce?](https://boardgamegeek.com/thread/1607742)（不能选择不生产） |
| 24 | 0 | [end of game](https://boardgamegeek.com/thread/1940587)（游戏何时结束） |
| 22 | 2 | [Do I lose Homer's bonus resource when I replace him?](https://boardgamegeek.com/thread/2217731) |
| 22 | 0 | [Economic Progress Card question](https://boardgamegeek.com/thread/1508044) |
| 21 | 0 | [No resign in age 4](https://boardgamegeek.com/thread/2225259) |
| 21 | 5 | [Revolution Question](https://boardgamegeek.com/thread/1454627) |
| 19 | 1 | [Paying Food and Resources](https://boardgamegeek.com/thread/2169789)（蓝色标记找零） |
| 19 | 3 | [Wealthy Territory 1 - App says 6R, printed card says 5R?](https://boardgamegeek.com/thread/1855887)（**官方答复**：App 与印刷版数值不同） |
| 19 | 0 | [Building with no unused workers available + uprising question](https://boardgamegeek.com/thread/1504208) |
| 19 | 1 | [Emigration Event](https://boardgamegeek.com/thread/2238539) |
| 15 | 0 | [Famine during uprising](https://boardgamegeek.com/thread/2227443) |
| 12 | 2 | [Gaining yellow tokens when yellow bank is full](https://boardgamegeek.com/thread/1455601) |
| 11 | 0 | [Empty politic card stack](https://boardgamegeek.com/thread/1662712)（军事牌堆空了怎么办） |
| 9 | 2 | [Learning game - less ages](https://boardgamegeek.com/thread/1454626)（**设计师答**：首局怎么玩） |

---

## 3. 线下最繁琐、最易错、最易忘的环节

按“对线上助手的价值”排序。每条注明证据。

### 3.1 回合末维护：腐败 → 生产 → 消耗，外加蓝色标记找零 ⭐⭐⭐⭐⭐

**规模**：Rules 区约 90 个主题（15%），是规模最大的流程类问题。“食物 / 消耗”在 105 个主题里出现，“蓝色标记”在 79 个，“腐败”在 56 个。

**易错点**

- **腐败的时机和算法**：新版把腐败改成在维护开始、生产之前判定，看蓝色库里 −2 / −4 / −6 的格子有没有露出来。这是专门为桌面版改的，“让你能直接看到会不会腐败，不用去想象生产和消耗之后的结果”（[1414905](https://boardgamegeek.com/thread/1414905)，BGG 新闻员转载的改版说明，原文以开发方口吻写）。不过新手仍常问资源不够付腐败时怎么办（[2429313](https://boardgamegeek.com/thread/2429313)）。
- **生产不可选**：不能为了省蓝色标记而不生产（[1607742](https://boardgamegeek.com/thread/1607742)，25 帖）。
- **矿和农场上可以堆的标记数不限于工人数**：有玩家误以为不能超过工人数，玩了整局，“难怪时代 III 什么都做不了”（[1573899](https://boardgamegeek.com/thread/1573899)）。
- **付款找零**：高等级的蓝色标记可以换成低等级的；只有在“付不出整数”时才能多付，而且多付后蓝色库必须是空的。规则书第 11 页有说明，但措辞绕。App 的做法和字面规则有细微差别（[2169789](https://boardgamegeek.com/thread/2169789)）。
- **饥荒和起义的交互**：起义时跳过生产，也就跳过了消耗和饥荒（[2227443](https://boardgamegeek.com/thread/2227443)）。
- **一回合一次的额外生产**（协定、跨大陆铁路、远洋邮轮这类效果）容易忘或重复用。Picon 的建议是在对应卡上放一个红色方块作提醒（[1603437](https://boardgamegeek.com/thread/1603437)）。
- **顺序**：有人建议坚持按玩家版图上印的顺序结算，先算文化和科研，再动方块；还要先完成生产，再抽军事牌，否则看牌看入迷就忘了生产（[1550975](https://boardgamegeek.com/thread/1550975)）。

**玩家原话（App 论坛 [1923051](https://boardgamegeek.com/thread/1923051)）**：没有数字化的规则约束时，失误的机会很多：忘了降费科技的折扣、动错方块、算错幸福或战术……多数人在第一次面对面的局里都会出某种操作失误。

### 3.2 卡牌行：每回合开始的移除、滑动、补牌，以及第一轮 ⭐⭐⭐⭐⭐

**规模**：卡牌行 / 拿牌 / 手牌类 51 个主题；“卡牌行”在 58 个主题里出现。

**规则要点**（转引自论坛）

- 每名玩家回合开始时，先移除卡牌行最前面的牌，再把剩下的牌往前滑，然后补满。移除的格数按人数而定：**2 人移除前 3 格、3 人前 2 格、4 人前 1 格**（[1553949](https://boardgamegeek.com/thread/1553949)）。
- **第一轮很特殊**：起始玩家 1 个民事行动，之后每人比上一家多 1 个；这一轮只能拿牌，不补牌；回合末照常生产，但没有红色行动，所以不抽军事牌。起始玩家第二个回合开始时，才第一次用时代 A 的牌补满卡牌行，这一刻时代 A 结束、时代 I 开始。所以**时代 A 的军事牌永远不会被抽到，只用来预先组成事件牌堆**（[1603437](https://boardgamegeek.com/thread/1603437)、[1590523](https://boardgamegeek.com/thread/1590523)、[2307109](https://boardgamegeek.com/thread/2307109)）。
- 有玩家吐槽：“当初就不该把第一轮叫‘第一轮’，应该换个名字，让新手意识到它不是普通的一轮”（[1553949](https://boardgamegeek.com/thread/1553949)）。
- **拿牌数量限制**：领袖每个时代只能拿一张。拿了一张该时代的领袖后，即使没打出来，也不能再拿同时代的其他领袖。奇迹要额外付行动，数量等于已完成的奇迹数；场上同时最多一个未完成的奇迹。民事牌手牌上限等于白色行动总数，而且不能自愿弃牌（[1603437](https://boardgamegeek.com/thread/1603437)）。
- **刚拿到的黄色行动牌当回合不能打**（[1603437](https://boardgamegeek.com/thread/1603437)、[1485308](https://boardgamegeek.com/thread/1485308)）。
- 民事牌堆还剩几张属于公开信息，可以数（[1780424](https://boardgamegeek.com/thread/1780424)、[2711377](https://boardgamegeek.com/thread/2711377)）。App 和 BGO 会直接显示。

**线下痛点**：补牌那一步每个回合都要做，最容易被跳过或做错（移除格数错、忘了滑动）。另外，**卡牌行的拿牌费用**（前 5 格 1 个行动，接下来 4 格 2 个，最后 4 格 3 个，见 [3751710](https://boardgamegeek.com/thread/3751710) 提到的 5/4/4）是印在版图上的，这一点没人抱怨。

### 3.3 政治阶段：当前 / 未来事件牌堆 ⭐⭐⭐⭐

**规模**：事件类 80 个主题；“当前 / 未来事件”在 36 个主题里出现。

**规则要点**（转引）

- 当前事件牌堆的张数是“人数 + 2”。玩家放入（seed）一张事件时，把它放进未来事件牌堆，同时翻开当前事件牌堆顶上的一张来结算。当前事件牌堆用完后，把未来事件牌堆按时代分开洗，旧时代的放上面，作为新的当前事件牌堆（[2152780](https://boardgamegeek.com/thread/2152780)、[2307109](https://boardgamegeek.com/thread/2307109)）。
- 放入一张事件，得到等于该牌时代数的文化分；侵略、宣战、提出协定则不得分（[1603437](https://boardgamegeek.com/thread/1603437)）。
- 每个政治阶段最多一个政治行动；凯撒例外（[3497044](https://boardgamegeek.com/thread/3497044)）。
- 事件需要比较数值时，**平局按“当前玩家，或按顺时针离当前玩家近的人”算较高**；战争和侵略平局则什么都不发生（[1603437](https://boardgamegeek.com/thread/1603437)；David4242 引用规则书原文，见 [2296323](https://boardgamegeek.com/thread/2296323)）。

**线下痛点**

- 从 App 转实体的玩家最容易在这里乱套。有人说：“事件牌堆到底怎么运作？一切都对不上，牌堆在换时代之前就用光了……一团糟。”原因是没理解当前 / 未来两堆的关系（[2307109](https://boardgamegeek.com/thread/2307109)）。
- **App 的“数字规则”改了事件结算时机**：事件在受影响玩家自己的回合开始时结算，不是在翻开时立即结算。所以 App 玩家会以为可以自选结算顺序，桌面规则则必须按翻开顺序结算（[1903676](https://boardgamegeek.com/thread/1903676)、[3654927](https://boardgamegeek.com/thread/3654927)）。
- **自己放进去的牌要靠记忆**：有玩家说，App 最大的好处之一是不用记已经过去的牌、自己放了哪些事件、牌堆里还剩什么（[3199888](https://boardgamegeek.com/thread/3199888)）。
- 军事牌堆用完时，只洗当前时代的弃牌堆；已结算的事件不洗回去，被弃掉的事件要洗回去（[1662712](https://boardgamegeek.com/thread/1662712)、[1525987](https://boardgamegeek.com/thread/1525987)、[2953581](https://boardgamegeek.com/thread/2953581)）。

### 3.4 军事牌：回合末弃牌、抽牌，以及战术板 ⭐⭐⭐⭐

**规模**：“军事牌 / 军事行动”在 127 个主题里出现。

**规则要点**（转引）

- 行动阶段之后、生产之前，把军事牌手牌弃到不超过红色行动总数（用过的和没用的都算）。新版把这一步从“政治阶段后”挪到了“回合末”（[1603437](https://boardgamegeek.com/thread/1603437)、[1452204](https://boardgamegeek.com/thread/1452204)）。
- 回合末抽军事牌：按没用掉的红色行动数抽，**最多 3 张**（[1603437](https://boardgamegeek.com/thread/1603437)）。
- 战术牌打出后归自己独占一轮，下个回合开始时移到中央战术板；其他人花 2 个红色行动就能复制（[1414905](https://boardgamegeek.com/thread/1414905)、[1603437](https://boardgamegeek.com/thread/1603437)）。
- 防守侵略时，打出的防御牌和当作 +1 弃掉的牌加起来，不能超过红色行动总数（[1603437](https://boardgamegeek.com/thread/1603437)）。

**线下痛点**：回合末的“弃 → 维护 → 抽”顺序容易乱；“下回合开始时把战术移到战术板”属于典型的“上家忘了做”。

### 3.5 时代转换：过时与清理 ⭐⭐⭐⭐

**规模**：时代结束类 38 个主题；“时代结束”在 62 个主题里出现。

**时代结束时要做的事**（转引）

- 每人从黄色库失去 2 个黄色标记（时代 A 结束时不扣）（[1603437](https://boardgamegeek.com/thread/1603437)、[1468487](https://boardgamegeek.com/thread/1468487)）。
- 移除过时的领袖、未完成的奇迹，以及手里过时时代的民事牌。时代 III 结束时同样要清理时代 II 的东西（[1786932](https://boardgamegeek.com/thread/1786932)、[2560146](https://boardgamegeek.com/thread/2560146)）。
- 两个时代以前的协定失效（[1603437](https://boardgamegeek.com/thread/1603437)）。

**证据：玩家确实会忘**

- “我们忘了在时代 I、II 结束时扣两个黄色方块，到时代 III 才发现”（[1484818](https://boardgamegeek.com/thread/1484818)）。
- 时代 III 结束时，有人以为不用清理，结果“拿破仑再见了”（[1786932](https://boardgamegeek.com/thread/1786932)）。
- 资深玩家也说：“新时代有时会让我措手不及。”他手里留着一张防御牌，结果时代 IV 来了（[1786932](https://boardgamegeek.com/thread/1786932)）。
- 版图上画了时代 A、I、II 结束时的清理图示，但没画时代 III 的，这是 1786932 帖里出现误会的直接原因。
- 首局最常问的是“时代到底什么时候结束”（[2596456](https://boardgamegeek.com/thread/2596456)、[1553949](https://boardgamegeek.com/thread/1553949)）。

### 3.6 终局：结束时机与时代 III 事件计分 ⭐⭐⭐⭐

**规模**：终局类 29 个主题；“终局”在 68 个主题里出现，“Impact of”在 44 个。

**规则要点**（转引）

- 补牌时时代 III 的民事牌用完，就进入时代 IV（最后阶段）。如果发生在起始玩家的回合，这一轮就是最后一轮；否则先打完本轮，再打一整轮。所有人的回合数相同（[1603437](https://boardgamegeek.com/thread/1603437)、[1940587](https://boardgamegeek.com/thread/1940587)）。
- 游戏结束后，把当前和未来事件牌堆里所有**时代 III 的事件**（都是“Impact of …”计分牌）翻开结算，时代 II 及更早的事件直接忽略。终局结算时的平局，按起始玩家视为较高（[1916851](https://boardgamegeek.com/thread/1916851)、[2438501](https://boardgamegeek.com/thread/2438501)、[2296323](https://boardgamegeek.com/thread/2296323)）。
- 最后一个回合宣战没有意义，因为战争要在下一回合才结算（[1662710](https://boardgamegeek.com/thread/1662710)）。时代 IV 不能认输（[1452204](https://boardgamegeek.com/thread/1452204)、[2225259](https://boardgamegeek.com/thread/2225259)）。
- **Impact of 计分的数法**常被问，例如人口影响要数“满意工人数 − 10”，建筑影响按建筑等级相加（[1467922](https://boardgamegeek.com/thread/1467922)，26 帖）。

**线下痛点**：Impact 计分要逐张翻、逐人数，还要按平局规则判；比尔·盖茨的额外分要在最后再加一次（[1916851](https://boardgamegeek.com/thread/1916851)）。短局（只玩到时代 II）没有时代 III 事件，Files 区有人专门做了[短局计分表](https://boardgamegeek.com/filepage/211461)（6 赞）。

### 3.7 幸福 / 不满工人 / 起义 ⭐⭐⭐

**规模**：44 个主题；“笑脸 / 不满”在 90 个主题里出现。

- 不满工人数的算法是“黄色库里空出的格数，减去笑脸数”，再和空闲工人比较。这是纯算术概念，不是字面上的“哪个工人不开心”（[1531883](https://boardgamegeek.com/thread/1531883)，31 帖；[1603437](https://boardgamegeek.com/thread/1603437) 有完整算法）。
- 一位首局 3 人局的玩家，光查“幸福”相关规则就花了 30 分钟以上（[2033415](https://boardgamegeek.com/thread/2033415)）。

### 3.8 开局摆放 ⭐⭐⭐

**规模**：开局类 19 个主题（3%），回帖不多，但 Files 区的相关文件很受欢迎。

- **按人数移除卡牌**：卡上的人数标记“小得看不清”。[TtA: A New Story List of Cards to Remove for 2-3p](https://boardgamegeek.com/filepage/127224)（38 赞）的作者说，做这份清单就是为了不用眯着眼一张张找。2024 年还有人问同样的问题：“我眼睛不行”（[3301619](https://boardgamegeek.com/thread/3301619)）。清单也不说明同名卡该留几张。
- [Card Reference](https://boardgamegeek.com/filepage/123302)（**228 赞，Files 区第一**）同时列出了每张卡在各人数下的数量。
- **没有起始玩家标记**：社区建议把一张牌压在起始玩家版图下面（[1603437](https://boardgamegeek.com/thread/1603437)、[1461551](https://boardgamegeek.com/thread/1461551)）。
- **扩展让开局更复杂**：要选用哪套领袖和奇迹（原版、平衡版、扩展、公开混合、秘密混合）。混合模式每个时代用 7 个领袖、5 个奇迹，只用基础或只用扩展时是 6 / 4（[2274464](https://boardgamegeek.com/thread/2274464)、[2450888](https://boardgamegeek.com/thread/2450888)）。另外 3–4 人局要加几张额外的民事牌（官方：这是为了平衡游戏长度，见 [2293457](https://boardgamegeek.com/thread/2293457)）。实体扩展带一块小版图和占位卡，用来显示本局有哪些领袖和奇迹（David4242，[2274601](https://boardgamegeek.com/thread/2274601)）。
- 有一份[易忘规则与开局摘要](https://boardgamegeek.com/filepage/241541)（17 赞）。
- 匈牙利玩家把开局步骤拆成了几个单独的文件（[184018](https://boardgamegeek.com/filepage/184018) 等），说明一份清晰的开局步骤有需求。

### 3.9 战争、侵略、协定、殖民拍卖 ⭐⭐

**规模**：侵略 / 战争 63、协定 41、殖民 30 个主题。

- 多数问题是规则理解（侵略 / 战争的区别、平局、协定能不能谈），不是“繁琐”。
- **提协定前不能私下谈条件**（[2138271](https://boardgamegeek.com/thread/2138271)，65 帖）。
- 殖民拍卖：桌面规则是轮流加价；App 的“数字规则”改成一次性暗标，出价最高者只付第二高价（或 +1）。设计师在 App 论坛解释了这种设计（[1851102](https://boardgamegeek.com/thread/1851102)，Vlaada 答）。
- 认输规则：认输时，对你宣战的玩家得 7 分；时代 IV 不能认输（[1452204](https://boardgamegeek.com/thread/1452204)）。“认输”在 General 和 Variants 里争议很大，有专门的长讨论帖。

### 3.10 实体版的物理问题 ⭐⭐⭐

- **小版图多、标记多、容易碰乱**：有人抱怨应该做成一张大版图。反方的理由是，一张大版图被碰一下，所有记录就都乱了；分开的小版图还能按桌子形状摆（[1695778](https://boardgamegeek.com/thread/1695778)）。也有人抱怨玩家版图的卡纸太薄、方块会滑。有人做过激光切割的覆盖板，结果“移动方块更慢了，弃用”（同帖）。Files 区有[3D 打印覆盖板](https://boardgamegeek.com/filepage/187925)，另有 3D 打印全套覆盖板和收纳的主题（[3171998](https://boardgamegeek.com/thread/3171998)，17 赞），以及 6 种官方或第三方收纳盒配件（BGG 配件库）。
- **占桌子**：Files 区最受欢迎的几份文件，都是给每张卡留一个位置的扩展玩家垫，例如 [Ultimate Player Boards](https://boardgamegeek.com/filepage/140017)（78 赞，打印出来 82 × 26 cm）、[Alternate extended player mats](https://boardgamegeek.com/filepage/128700)（61 赞）、[Extended Player Mats](https://boardgamegeek.com/filepage/125778)（35 赞）。后者的作者说，4 人局需要 150 × 80 cm 的桌子。有人因为桌子小，想要一个 App 来记所有人的文化和科研（[1684877](https://boardgamegeek.com/thread/1684877)）。有人把文化、军力、科研三条轨合并成一条[贴纸](https://boardgamegeek.com/filepage/251597)。
- **一次打不完要存档**：有意大利玩家做了[存档表](https://boardgamegeek.com/filepage/249500)，逐项记下每人版图上的东西，下次复原，“比给每个版图拍照省事”。也有人整张桌子铺一个星期，下周接着打（[1662712](https://boardgamegeek.com/thread/1662712)）。
- **隐藏信息靠记忆**
  - 民事牌手牌公开还是不公开，由玩家自定，规则允许两种玩法。App 是公开的，很多人建议实体也公开，“要记的东西已经够多了”（[2007977](https://boardgamegeek.com/thread/2007977)、[1703595](https://boardgamegeek.com/thread/1703595)）。
  - 扩展里诺查丹玛斯、弗莱明这类“偷看隐藏牌”的能力，实体版要么记忆，要么拿纸笔记，被讨论为实体版的特有麻烦（[2283784](https://boardgamegeek.com/thread/2283784)，22 帖）。
- **军事牌不公开，作弊或误操作难以发现**：比如放错牌当事件。社区答复是“没法查，别和作弊的人玩”；误操作能复原多少算多少（[1966361](https://boardgamegeek.com/thread/1966361)）。

---

## 4. 实体版比 App 麻烦在哪（玩家原话归纳）

主要来源：[2256692](https://boardgamegeek.com/thread/2256692)（还有多少人玩实体？）、[3199888](https://boardgamegeek.com/thread/3199888)（不玩数字版值不值？）、[2395600](https://boardgamegeek.com/thread/2395600)（Elegant but full of accounting）、[2989390](https://boardgamegeek.com/thread/2989390)、[2708251](https://boardgamegeek.com/thread/2708251)（最弱的地方在哪）、App 论坛 [1923051](https://boardgamegeek.com/thread/1923051)、[2598978](https://boardgamegeek.com/thread/2598978)、[2098067](https://boardgamegeek.com/thread/2098067)。

1. **记账占大头**：有人估计“60% 的游戏时间是记账：挪卡、挪资源、补卡牌行”（[2256692](https://boardgamegeek.com/thread/2256692)）。在 [2708251](https://boardgamegeek.com/thread/2708251) 里，“游戏最弱的地方”的头几条回复就是“时长”“fiddly”“App 解决了它们”。
2. **时长相差约 3–4 倍**：4 人局 App 约 1 小时，实体约 4 小时（[2989390](https://boardgamegeek.com/thread/2989390)）。
3. **App 帮你强制执行规则**：动错方块、忘了折扣、算错幸福、算错战术，这些在 App 上都不会发生（[1923051](https://boardgamegeek.com/thread/1923051)）。
4. **App 能撤销**：可以先试几种走法再确认（[2098067](https://boardgamegeek.com/thread/2098067)，David4242 也提到“App 里可以撤销重来”；[2708251](https://boardgamegeek.com/thread/2708251)）。
5. **App 替你记牌**：已经过去的事件、自己放了哪些、牌堆剩多少，都不用记（[3199888](https://boardgamegeek.com/thread/3199888)）。
6. **开局和每回合维护，玩 App 学不到**：多人指出，玩 App 能学会规则，但**学不会摆放和每回合的维护**。“我玩了很多次 App，哥哥买了实体版让我教，结果有点尴尬”（[1923051](https://boardgamegeek.com/thread/1923051)）。还有老玩家十年后重拿实体版，事件牌堆全弄乱了（[2307109](https://boardgamegeek.com/thread/2307109)）。
7. **App 的“数字规则”和桌面规则不同**，转实体时会带进错误认知（[3654927](https://boardgamegeek.com/thread/3654927)、[1903676](https://boardgamegeek.com/thread/1903676)、[1923051](https://boardgamegeek.com/thread/1923051)）：
   - 殖民拍卖改成暗标、第二价；
   - 事件在受影响者的回合开始时结算；
   - “Politics of Strength”的效果不同；
   - 这些都可以在 App 选项里切换成桌面规则。
   - 此外，富饶领土 I 的数值，App 是 6，印刷版是 5（官方解释见第 5 节）。
8. **反方意见同样多**：不少人坚持实体，理由是面对面的虚张声势和互动，App 替代不了；“线上打了几百局，只记得最后一局”（[2989390](https://boardgamegeek.com/thread/2989390)）；“我从不觉得这些操作麻烦”（[1923051](https://boardgamegeek.com/thread/1923051)）。几位玩实体的人说法一致：只在 2–3 人玩，不碰 4 人局。
9. **App 玩家太强，线下找不到人玩**（[2989390](https://boardgamegeek.com/thread/2989390)、[3199888](https://boardgamegeek.com/thread/3199888)）。

**对本站的含义**：线下玩家要的是“像 App 那样替我记、替我算、提醒我下一步”，但不能变成在线代打。可做的部分就是维护和流程的提示、计数和记录，第 9 节展开。

---

## 5. 官方答复要点（CGE / 设计师账号）

基础版 Rules 区官方回帖很少，以下按主题列出能找到的全部要点。

| 主题 | 官方 | 要点 |
|---|---|---|
| [Learning game - less ages](https://boardgamegeek.com/thread/1454626) | Vlaada | 首局只玩到时代 II 结束，不用侵略、战争、协定，结束时加简单额外计分；新版只有“首局”和“完整局”两级 |
| [Hammurabi](https://boardgamegeek.com/thread/1475582) | Vlaada | 汉谟拉比的红色行动当民事行动用的细节；他当时正亲自为数字版写这个能力 |
| [Revolting with Gutenberg?](https://boardgamegeek.com/thread/2281901) | Vlaada | 古腾堡的行动算普通民事行动。实践中更方便的做法是：选 +2 军力时，把那个行动方块放到军力标记上作记号（**设计师自己在想办法减少线下记录负担**） |
| [Being unable to fulfil Call to Arms](https://boardgamegeek.com/thread/2279031) | Vlaada | 先失去行动，再按实际失去的行动数抽牌；App 原来做错了，已修复 |
| [digital rules colonization](https://boardgamegeek.com/thread/1851102)（App 论坛） | Vlaada | 数字规则下殖民暗标的设计思路：相当于大家先定好心理价位，再自动模拟一轮拍卖 |
| [Wealthy Territory 1 - App says 6R](https://boardgamegeek.com/thread/1855887) | David4242（转述 Vlaada） | 开发时两个数值都考虑过；App 开发在前，印刷数据定稿时两边不知怎么就不一致了；后来决定保留 6，“感觉更好”，扩展时会附更新 |
| [tied strength](https://boardgamegeek.com/thread/2296323) | David4242 | 引用规则书平局规则：当前玩家或顺时针更近者视为较高；终局结算时起始玩家视为较高 |
| [Himeji Castle and Declaring War](https://boardgamegeek.com/thread/2295078) | David4242 | 引用扩展规则书附录 |
| [Acropolis and ravages of time](https://boardgamegeek.com/thread/3094899)（扩展） | David4242 | 城市建筑上限只在新建时检查；超限时可以升级，不需要拆 |
| [Marlene Dietrich](https://boardgamegeek.com/thread/2295497)、[Nostradamus 2p](https://boardgamegeek.com/thread/2282496)（扩展） | David4242 | 引用扩展规则书附录 |
| [Why the rule "gain an action when replacing your leader"](https://boardgamegeek.com/thread/1466797) | David4242 | 鼓励多换领袖，让每局更有变化 |
| [Charlie Chaplin](https://boardgamegeek.com/thread/1499705)、[Economic Progress + Railroad](https://boardgamegeek.com/thread/1467221) | karel_danek | 单卡澄清 |
| [2 player question](https://boardgamegeek.com/thread/1500986) | karel_danek | 2 人局里“最弱两家”只影响 1 人，规则书有写 |
| [Card size?](https://boardgamegeek.com/thread/1432101) | karel_danek | 卡牌 50 × 73 mm，是非标尺寸，发售时还没有现成的卡套 |
| [Summary of changes](https://boardgamegeek.com/thread/1414905) | （改版说明，开发方口吻） | 腐败改到生产前判定，“主要是为了桌面版”，可以直接看出会不会腐败 |
| [How many cards?](https://boardgamegeek.com/thread/2227545)（扩展） | David4242 | 扩展内容：24 个新领袖、16 个新奇迹、19 张新军事牌、20 张平衡版替换卡、6 张额外民事牌、36 张占位卡，共 121 张；占位卡可选，“除非很有经验，否则不需要” |
| [Number of yellow cards](https://boardgamegeek.com/thread/2293457)（扩展） | David4242 | 引用扩展规则书“游戏长度调整”：数据显示 3 人局平均比 2 人局少一轮，时代 III 结束太快，所以 3–4 人局加了几张民事牌 |
| [Will the new cards be marked?](https://boardgamegeek.com/thread/2261341)（扩展） | David4242 | 扩展卡有两种小图标：一种标平衡版替换卡，一种标新卡 |
| [In stock in Australia](https://boardgamegeek.com/thread/2361992)（扩展） | LoreChase | 2019 年埃森首批扩展有卡背颜色不一致的印刷问题，修正版 2020 年春上市 |
| [Which leaders or wonders seem over/underpowered](https://boardgamegeek.com/thread/2327533)（扩展） | David4242 | 平衡依据是数千局 App 数据，按人数、桌面 / 数字规则、新老玩家分别看过 |
| [So the game is 3 years old, 3rd edition?](https://boardgamegeek.com/thread/2043174) | David4242 | 不会出第三版；不确定要不要买实体，可以先买 App，“它能顺畅地教会你” |

---

## 6. 现有工具

### 6.1 官方数字版（CGE Digital）

- **平台**：iOS / Android 2017-09-15 上线（[1758142](https://boardgamegeek.com/thread/1758142)，David4242）；随后上了 Steam，2024 年还提到 GoG 版本修复（[3251220](https://boardgamegeek.com/thread/3251220)）。
- **模式**：单人对 AI、异步联机、实时联机、同屏轮流（hotseat）。
- **扩展**：2019 年 9 月先在 App 上线，实体版 2020 年 5 月才到美国（[2428048](https://boardgamegeek.com/thread/2428048)，Vlaada）。在一个平台买了扩展，登录 CGE 账号后各平台通用（[2275240](https://boardgamegeek.com/thread/2275240)，Elwen）。
- **开发**：Vlaada 本人参与编程（[1588956](https://boardgamegeek.com/thread/1588956)）。CGE 用 App 对局数据给扩展做平衡。
- **App 独有的东西**
  - 可选“数字规则”：殖民暗标、事件延到受影响者回合开始时结算、Politics of Strength 改动（见第 4 节）；
  - 只有“公开混合”，没有规则书里的“秘密混合”（[3010073](https://boardgamegeek.com/thread/3010073)）；
  - 挑战关卡和成就；锦标赛支持；玩家要求过 Elo 排名，官方说在考虑（[1912706](https://boardgamegeek.com/thread/1912706)）。
- **评价极高**：“可能是所有桌游 App 里最好的实现”“教程很棒”“AI 有挑战性”（[2598978](https://boardgamegeek.com/thread/2598978)、[1849190](https://boardgamegeek.com/thread/1849190)）。大量玩家推荐“先玩 App 再决定买不买实体”，官方也这么建议。
- **对线下的局限**：只能整局在 App 里玩，不能辅助一局实体对局；学不到摆放和维护（第 4 节）。

### 6.2 其他线上平台

- **boardgaming-online.com（BGO）**：老牌网页实现，和 CGE、Vlaada 合作。新版在印刷前就在 BGO 上开发测试，“前 60 名 BGO 玩家在开发期间打了 1000 多局”（karel_danek，[1414905](https://boardgamegeek.com/thread/1414905)）。BGO 会自动替你数牌。有玩家写了 BGO 的界面增强脚本，CGE 员工 karel_danek 亲自提了修改意见（[1560852](https://boardgamegeek.com/thread/1560852)）。BGO 现在是否还运营没有核实。
- **Board Game Arena（BGA）**：BGG 把它列为本作的数字实现。2016 年的帖子说 BGA 上是旧版（[1605787](https://boardgamegeek.com/thread/1605787)）；2022 年以后的帖子在讨论 BGA 上的新版对局；2026-03 有人说 BGA 上有 1,072 局正在进行（[3678549](https://boardgamegeek.com/thread/3678549)）。BGA 上用的是哪个版本、是否含扩展，没有逐项核实。
- BGO 上有一份 3 万局以上的[统计数据](https://boardgamegeek.com/filepage/159744)，被策略区的 [Data-Driven strategy tips](https://boardgamegeek.com/thread/1933554)（98 赞）引用。

### 6.3 BGG Files 区玩家辅助（英文为主，按点赞数排序）

| 赞 | 文件 | 类型 | 说明 |
|---|---|---|---|
| **228** | [Card Reference](https://boardgamegeek.com/filepage/123302) | 卡牌速查 | 所有民事牌和军事牌的一览，含每张卡在各人数下的数量；双面打印，建议过塑 |
| 127 | [Solo/Practice game rules](https://boardgamegeek.com/filepage/128311) | 单人变体 | 作者 kerred；另有西 / 法 / 德译本 |
| 78 | [Ultimate Player Boards](https://boardgamegeek.com/filepage/140017) | 扩展玩家垫 | 给每张卡留位置，82 × 26 cm |
| 65 | [Solo Variant (V1.1)](https://boardgamegeek.com/filepage/144884) | 单人变体 | |
| 62 | [Automa variant](https://boardgamegeek.com/filepage/153085) | 自动机 | 作者 maurogibertoni，兼容扩展；2025 年又出了 [Mautoma](https://boardgamegeek.com/filepage/313147) |
| 61 / 35 | [Alternate extended player mats](https://boardgamegeek.com/filepage/128700) / [Extended Player Mats](https://boardgamegeek.com/filepage/125778) | 扩展玩家垫 | 后者明确说也能帮新手看清可选项 |
| **38** | [List of Cards to Remove for 2-3p](https://boardgamegeek.com/filepage/127224) | **开局清单** | 因为卡上的人数标记太小 |
| 21 | [Even More Leaders and Wonders](https://boardgamegeek.com/filepage/207523) | 粉丝扩展 | |
| **17** | [Summary of the easy-to-forget rules & setup](https://boardgamegeek.com/filepage/241541) | **易忘规则摘要** | |
| 15 | [Card Conversion Guide](https://boardgamegeek.com/filepage/124457) | 旧版转新版 | 作者自己都“不推荐这么做” |
| 15 / 11 | [扩展卡速查](https://boardgamegeek.com/filepage/145132) / [Comprehensive Player Reference](https://boardgamegeek.com/filepage/236238) | 速查 | |
| 6 | [Short game scoring](https://boardgamegeek.com/filepage/211461) | **短局计分表** | |
| 6 | [Combined Culture, Strength and Science Tracker](https://boardgamegeek.com/filepage/251597) | 合并计分轨 | 为了省桌面 |
| 1 | [Scheda di salvataggio](https://boardgamegeek.com/filepage/249500)（意） | **存档表** | 中途收起，下次复原 |
| 1 | [Card Counts](https://boardgamegeek.com/filepage/293343) | 卡牌数量表 | 含扩展 |

**另外**

- 外语版的回合流程卡、开局步骤、提醒卡有好几份：匈牙利语的[回合流程](https://boardgamegeek.com/filepage/184040)、[开局](https://boardgamegeek.com/filepage/184018)、[提醒卡](https://boardgamegeek.com/filepage/184290)，西语的[扩展辅助卡](https://boardgamegeek.com/filepage/243276)，葡语辅助卡等。英文没有一份热门的“回合流程卡”，大概是因为官方玩家版图上已经印了流程。
- **没有找到面向实体对局的 companion app**（计分器、维护计算器、卡牌行提示）。唯一相关的求助帖 [Culture & Science tracking App](https://boardgamegeek.com/thread/1684877)（2016）得到的回复是用索引卡、扑克筹码、计分板、电子表格，没人推荐现成工具。
- 玩家对现有工具的评价：Card Reference 被大量引用，是事实上的标准速查；扩展玩家垫解决了“卡摆哪”的问题，但更占桌子；单人变体和自动机评价两极，常被问“哪个最好”（[2061438](https://boardgamegeek.com/thread/2061438)、[2821187](https://boardgamegeek.com/thread/2821187)），没有共识。

### 6.4 现有工具缺什么（推断，依据是上面各节的抱怨）

1. **一局实体对局的“流程引导”**：轮到谁、本回合卡牌行要移除几格、维护顺序、时代切换时清理什么、何时进入最后一轮。现有的都是静态纸质卡，没有“当前状态”。
2. **维护和腐败的计算辅助**：现有工具全是纸质参考，没有人做“输入本回合数据，告诉你会不会腐败或饥荒、不满几个”的东西。不过，新版腐败本来就设计成可以直接看版图判断，这一项的价值要打折扣，见第 9 节。
3. **事件牌堆状态记录**：当前事件还剩几张，下次翻新堆是什么时候，自己放过哪些（实体版靠记忆）。
4. **按人数和扩展模式生成开局清单**：现有的只有“2–3 人移除卡清单”，没有覆盖扩展的混合模式。
5. **终局 Impact 计分辅助**和短局计分。
6. **中途存档**：现在只有一份意大利语纸质表。
7. **中文**：BGG 上没有中文辅助文件（只有一篇 2019 年的中文机制解析评测，[2135400](https://boardgamegeek.com/thread/2135400)）。

---

## 7. 新老版差异与扩展

### 7.1 新版（2015）相对旧版（2006）的主要改动

来源：[List of rules changes](https://boardgamegeek.com/thread/1452204)（17 赞）、[Summary of changes](https://boardgamegeek.com/thread/1414905)、[list of card changes and discussion](https://boardgamegeek.com/thread/1450917)（66 赞）、[Military, aggressions and wars compared](https://boardgamegeek.com/thread/1505680)、[Sacrificing: Do you miss it?](https://boardgamegeek.com/thread/1494380)（56 帖）。

| 改动 | 社区讨论热度 |
|---|---|
| **战术可以共享**：打出后独占一轮，之后放到战术板，他人花 2 个红色行动复制 | 最高，被认为是最大的改动，大多数人认可 |
| **取消牺牲部队**；防守侵略时可以把任何军事牌当 +1 弃掉，上限为红色行动数 | 高，有人怀念牺牲部队（[1494380](https://boardgamegeek.com/thread/1494380)），总体认为削弱了凯撒速攻 |
| 腐败改到生产前判定；蓝色标记 16 个 | 中，公认更直观 |
| 替换领袖返还 1 个民事行动 | 中（[1466797](https://boardgamegeek.com/thread/1466797) 有官方解释） |
| 取消军力、科研、文化的上限 | 低 |
| 多余军事牌改到回合末弃 | 低 |
| 认输时对你宣战的人得 7 分；时代 IV 不能认输 | 中 |
| 教学：取消旧版的“简单 / 进阶 / 完整”三级，改为“首局（到时代 II）+ 完整局” | 中。旧版三级教学褒贬不一；Picon 把旧版的简单局改编到新版（[1471760](https://boardgamegeek.com/thread/1471760)） |
| 大量卡牌重新平衡，美术和图标重做，卡变大 | 高 |

- **共识**：EndersGame 汇总了大量评论（[1540434](https://boardgamegeek.com/thread/1540434)，489 赞，Reviews 区第一），结论是新版几乎被公认为改进：规则更顺、平衡更好、军事改得更好。主要批评仍是“太长”和“太复杂”。
- 2015 版仍是当前版本，没有第三版（[2883967](https://boardgamegeek.com/thread/2883967)、[2043174](https://boardgamegeek.com/thread/2043174) 官方）。
- 2023 年有人整理了一份新旧版差异参考表（[3166546](https://boardgamegeek.com/thread/3166546)）。
- 旧版卡不建议改造成新版（[124457](https://boardgamegeek.com/filepage/124457)）。

### 7.2 扩展 New Leaders and Wonders（2019 数字版 / 2020 实体版）

- **评分**：8.89（1,936 人），明显高于基础版。官方 App 先上线扩展，被认为是“桌游扩展里少见的、先经过数千局线上数据平衡”的做法（[2274601](https://boardgamegeek.com/thread/2274601)、[2327533](https://boardgamegeek.com/thread/2327533)）。
- **社区最热主题**：[A Look at all the Cards in the Expansion](https://boardgamegeek.com/thread/2274464)（263 帖、140 赞，作者是测试玩家）。要点：
  - 设计本意是把基础和扩展的领袖、奇迹混在一起，随机选一部分，开局前公开；
  - 文化产出明显变多；
  - 多了 8 个不来自殖民的黄色标记，蓝色标记和砖石工艺的价值上升。
- **平衡版替换卡**：共识是**不管用不用扩展，都直接换上平衡版**（[2276910](https://boardgamegeek.com/thread/2276910)），评价是削弱拿破仑、汉谟拉比、圣彼得，加强空中花园、巨像、巴赫。也有人觉得旧版巴赫更好。
- **新玩家要不要一开始就加扩展**（[3689856](https://boardgamegeek.com/thread/3689856)，2026-04）：意见分歧。
  - 一派说：可以直接加，反正只是换一批领袖和奇迹。
  - 多数说：先玩基础版，因为基础版平衡更好，换来换去会让新手更难规划。
  - 折中意见是：平衡版替换卡马上用，新领袖和奇迹过几局再加。
- **扩展给实体版添的麻烦**：
  - 开局多一步选牌，有多种混合模式；
  - 诺查丹玛斯、弗莱明要记隐藏牌（[2283784](https://boardgamegeek.com/thread/2283784)）；
  - 首批印刷的卡背颜色不一致（官方承认）；
  - 扩展不缩短时长（[2232998](https://boardgamegeek.com/thread/2232998)）。
- 扩展的 Rules 区 46 个主题几乎都是单卡澄清（古腾堡、姬路城、诺查丹玛斯、玛丽亚·特蕾莎、Call to Arms 等），其中 5 个有 Vlaada 或 David4242 的官方答复。另有[扩展官方规则书](https://boardgamegeek.com/filepage/197364)，附录里集中做了单卡澄清。

---

## 8. 常见变体与家规

### 8.1 官方

- **首局**：只玩到时代 II 结束，不用侵略、战争、协定，加额外计分（Handbook，[1454626](https://boardgamegeek.com/thread/1454626)）。
- **和平变体**：不用战争和侵略牌，Handbook 第 24 页（[3429736](https://boardgamegeek.com/thread/3429736)、[1553900](https://boardgamegeek.com/thread/1553900)）。有人说 2 人局常用；也有人说“很多事件照样打最弱的人，帮助有限”（[1923385](https://boardgamegeek.com/thread/1923385)）。
- 扩展的几种领袖和奇迹选取模式：原版 / 平衡版 / 扩展 / 公开混合 / 秘密混合。

### 8.2 玩家变体（按热度）

| 变体 | 来源 | 社区反应 |
|---|---|---|
| Zip's Simple Solo Bot | [2265199](https://boardgamegeek.com/thread/2265199)（28 赞） | 单人 / 多人都能用的简单机器人 |
| Automa（Gibertoni） | [1844066](https://boardgamegeek.com/thread/1844066)（23 赞） | 兼容扩展 |
| Alexfrog 改良和平变体 | [1562275](https://boardgamegeek.com/thread/1562275)（19 赞） | 和平变体加上时代末的全面战争；有人认为规则反而更复杂 |
| Even More Leaders and Wonders（粉丝扩展） | [2453620](https://boardgamegeek.com/thread/2453620) | CGE 员工 David4242 逐张点评过 |
| Advanced Through the Ages | [2845696](https://boardgamegeek.com/thread/2845696) | |
| 只玩时代 I 体验 | [1820201](https://boardgamegeek.com/thread/1820201) | 知名讲规则视频作者 Paul Grogan 说，他在展会上的演示都只玩时代 I，“但不能这样计分，就像跑 1000 米只跑 50 米就算成绩” |
| 加快速度：每回合计时 | [1768710](https://boardgamegeek.com/thread/1768710)（每人 3 分钟）、[1467717](https://boardgamegeek.com/thread/1467717)（行动阶段 2 分钟，时代 III 2.5 分钟，每超 1 分钟扣 1 文化）、[2154348](https://boardgamegeek.com/thread/2154348)（“桌子中间放棋钟”）、[2033415](https://boardgamegeek.com/thread/2033415)（棋钟只计时也有用） | 被反复推荐 |
| **重叠回合** | [2033415](https://boardgamegeek.com/thread/2033415)（bubba0077） | 上家行动阶段一结束就开始挪卡牌行；上家弃完军事牌后，下家即可开始，上家同时做生产 |
| 缩短：每回合多移除卡牌行 | [1472094](https://boardgamegeek.com/thread/1472094) | 有人质疑会改变卡牌行的节奏 |
| 2 人局用 4 人牌堆 | [1508152](https://boardgamegeek.com/thread/1508152) | 反对者认为会失去紧张感；多数人说 2 人局“不需要变体，照规则玩” |
| 4 人局只能侵略相邻玩家 | [2063220](https://boardgamegeek.com/thread/2063220) | 回复多认为“1–2 点军力差就被群殴”是规则理解有误 |
| 认输后战争照样结算 / 自动认输 | [3068311](https://boardgamegeek.com/thread/3068311)、[1870612](https://boardgamegeek.com/thread/1870612) | 争议大 |
| 军事牌明牌展示 | [2698473](https://boardgamegeek.com/thread/2698473) | 有人认为会让军事更强 |
| 团队模式（2v2） | [2580598](https://boardgamegeek.com/thread/2580598)、[2050147](https://boardgamegeek.com/thread/2050147) | 小众 |
| 民事牌手牌公开 | [2007977](https://boardgamegeek.com/thread/2007977) | 规则允许自选，很多人推荐公开 |

**长期争议**（General、Strategy、Variants 都有大帖）

- **军事太强，欺负最弱的人**：[1923385](https://boardgamegeek.com/thread/1923385)（95 帖）、[2417428](https://boardgamegeek.com/thread/2417428)、[2709245](https://boardgamegeek.com/thread/2709245)（260 帖）。
- **4 人局后手位置吃亏**：[2265803](https://boardgamegeek.com/thread/2265803)、[2708251](https://boardgamegeek.com/thread/2708251)。
- **认输机制**：[1525663](https://boardgamegeek.com/thread/1525663)、[1823498](https://boardgamegeek.com/thread/1823498)。

---

## 9. 对“线下助手”站的启示（供做 / 不做清单参考，非结论）

### 9.1 线下最繁琐、最易错的前 5 个环节

依据第 2、3 节的频次和抱怨。

1. **回合末维护**（腐败判定、生产、消耗和饥荒、蓝色标记找零、额外生产只能用一次、文化和科研累计）。Rules 区规模最大的流程类问题，App 和实体之间最大的差距也在这里。
2. **每回合开始的卡牌行补牌**（按人数移除几格、滑动、补满）和**特殊的第一轮**（各家行动数递增、不补牌，起始玩家第二回合开始时时代 A 结束）。
3. **时代转换的清理**（扣 2 个黄色标记、移除过时的领袖、未完成奇迹和手牌、协定失效），以及**何时进入最后一轮**。玩家确实会忘，版图上也没有画时代 III 的清理图示。
4. **事件牌堆的运作**（当前堆张数为人数 + 2、放入一张翻一张、用完时按时代排序换堆）和**终局时代 III Impact 计分**。从 App 转实体的人在这里最容易乱。
5. **军事牌的回合末流程**（弃到红色行动数、按未用红色行动抽牌最多 3 张、军事牌堆用完时洗当前时代弃牌）和**战术的移动**（下回合开始时移到战术板）。

第 6 个是**按人数（和扩展模式）开局**：移除卡、混合领袖和奇迹。只在开局用一次，但它是“带新人快速开局”的入口。

### 9.2 可以考虑的功能（按价值排序）

| 功能 | 价值 | 理由 / 注意 |
|---|---|---|
| **开局清单生成器**：按人数和扩展模式（原版 / 平衡版 / 扩展 / 公开混合 / 秘密混合）列出要移除哪些卡、混合模式随机抽本局的领袖和奇迹 | ⭐⭐⭐⭐⭐ | Files 区的“移除卡清单”有 38 赞，2024 年还有人在问；扩展混合模式需要随机抽取，正适合放手机。**卡牌数量必须对照官方卡表核实** |
| **「注意事项」：常被忽略的规则** | ⭐⭐⭐⭐⭐ | [Frequently Overlooked Rules](https://boardgamegeek.com/thread/1603437)（48 赞）和 [easy-to-forget 摘要](https://boardgamegeek.com/filepage/241541)（17 赞）就是现成的需求证明。内容用自己的话写，依据规则书核对 |
| **「数字规则 ≠ 桌面规则」专条** | ⭐⭐⭐⭐ | 很多新手是从 App 来的：殖民拍卖方式、事件结算时机、Politics of Strength、富饶领土 I 的数值 5 / 6、秘密混合 App 里没有 |
| **回合流程提示**（政治 → 行动 → 弃军事牌 → 维护 → 抽军事牌，加卡牌行移除格数，加“下个回合开始移动战术”），以及**时代切换和最后一轮提醒**：一人点“时代 III 牌用完了”，就提示本轮或下一轮是最后一轮 | ⭐⭐⭐⭐ | 解决“上家忘了做某步”；可以做成一个公共的“当前时代 / 当前轮 / 起始玩家”状态。注意不要变成要每人每步点手机的负担 |
| **终局 Impact 计分辅助**和短局计分表 | ⭐⭐⭐ | 只在终局用一次，但规则问题集中（“Impact of”在 44 个主题里出现）。可以做成“逐张 Impact 卡输入各家数值，按平局规则出分” |
| **事件牌堆状态**（当前堆还剩几张、下次换堆的时机） | ⭐⭐ | 要每次放牌都记录，负担大；更适合做成规则说明加一张图 |
| **维护计算器**（输入蓝色库、黄色库、产量，输出腐败、消耗、不满） | ⭐⭐ | 需求真实，但新版腐败本来就设计成看版图即可判断，输入的成本可能比在版图上看还高。**建议先做成“维护顺序清单 + 常见错误”，不做计算器** |
| **中途存档表** | ⭐⭐ | 有需求（意大利玩家做了纸质版），但要录入整个版图，成本高；可以先建议“每人拍照 + 记录事件牌堆顺序”的步骤说明 |
| **单卡速查**（领袖、奇迹、事件，含常见问答） | ⭐⭐⭐（工作量大） | 规则问题里三成是单卡问题，但卡多（基础 + 扩展有上百张领袖、奇迹和事件），且有版权和翻译问题。可以先做“高频问题的 20 张卡” |

### 9.3 建议留在线下的

- 卡牌行本身、拿牌、打牌、方块移动：这些是游戏本体，放到手机上就成了在线数字版。
- 军事牌、殖民拍卖、协定谈判：隐藏信息和面对面互动是线下的价值所在（[2256692](https://boardgamegeek.com/thread/2256692)）。
- 文化、科研、军力轨：实体版图上已有，搬到手机上反而要每回合同步输入。只有桌子小的人提过需求（[1684877](https://boardgamegeek.com/thread/1684877)）。

### 9.4 风险与核实事项

- **定位风险**：官方 App 很强，也便宜，社区常见建议是“先玩 App”。本站的价值只在“已经决定线下玩”的场景，而且主要用户是首局新手。BGG 显示首局 4 人可能要 7–9 小时，建议讲规则页**明确推荐首局 2–3 人、按官方首局玩到时代 II**。
- 本文的规则细节都是论坛转引，**做站前必须用 CGE 官网的 Rules / Handbook / 扩展规则书 PDF 逐条核对**，尤其是：
  - 卡牌行移除格数；
  - 军事牌抽牌上限；
  - 时代结束时失去黄色标记的边界情况（黄色库不足 2 个时怎么办，论坛说法不一，见 [1468487](https://boardgamegeek.com/thread/1468487)）；
  - 终局平局规则；
  - 扩展各模式的领袖和奇迹数量。
- 中文版的名称、译名、版本差异不在本文范围内，需要另做中文社区调研。
