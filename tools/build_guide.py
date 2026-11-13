# Builds public/guide.html (常见问题 + 回合速查) from the FAQ list.
# Usage: python3 tools/build_guide.py tools/faq.json public/guide.html
# The turn reference is rendered on the page from public/steps.js (turnRef), so it stays in step with the room page.
import html, sys, json
faq_src, out = sys.argv[1], sys.argv[2]
FM = 'https://filemanager.czechgames.com/storage/files/'
TTA = FM + 'through-the-ages-a-new-story-of-civilization/'
SRC = {'rb': ('规则书', TTA + 'rules/through-the-ages-new-story-rules-zh-s.pdf'),
       'hb': ('玩家手册', TTA + 'other-downloads/handbook/through-the-ages-new-story-handbook-zh-s.pdf'),
       'exp': ('《新领袖&新奇迹》英文规则书', FM + 'through-the-ages-new-leaders-and-wonders/rules/through-the-ages-expansion-rules-en.pdf'),
       'bgg': ('BGG 讨论', None)}
faq = json.load(open(faq_src))
def cite(f):
    name, url = SRC[f['src']]
    url = f.get('url') or url
    label = f'来源：{name}' + (f'第 {f["p"]} 页' if f.get('p') else '')
    return f'<a href="{url}" target="_blank" rel="noopener">{label}</a>'
cats = list(dict.fromkeys(f['cat'] for f in faq))
faq_html = ''.join(f'<h3 class="fq-cat">{html.escape(c)}</h3>' + ''.join(
    f'<details class="card fq"><summary>{html.escape(f["q"])}</summary><p>{html.escape(f["a"])} {cite(f)}</p></details>'
    for f in faq if f['cat'] == c) for c in cats)
toc = ''.join(f'<a href="#c{i}">{html.escape(c)}</a>' for i, c in enumerate(cats)) + '<a class="fqa" href="#turn">回合速查</a>'
for i, c in enumerate(cats):
    faq_html = faq_html.replace(f'<h3 class="fq-cat">{html.escape(c)}</h3>', f'<h3 class="fq-cat" id="c{i}">{html.escape(c)}</h3>', 1)
open(out, 'w').write(f'''<!doctype html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="theme-color" content="#2e1f13">
<title>常见问题 · 历史巨轮</title>
<meta property="og:title" content="常见问题 · 历史巨轮">
<meta property="og:image" content="https://tta.leisurecat.cloud/img/icon-512.jpg">
<link rel="icon" href="img/icon-64.png">
<link rel="apple-touch-icon" href="img/icon-180.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Oswald:wght@500;600&family=Noto+Serif+SC:wght@600;900&display=swap" rel="stylesheet">
<link rel="stylesheet" href="style.css">
</head>
<body>
<div style="position:absolute;width:0;height:0;overflow:hidden"><img src="img/icon-512.jpg" alt=""></div>
<div class="hero with-back"><div class="back-row"><a class="back-nav" href="/" data-html2canvas-ignore>‹ 返回</a></div><div class="en">THROUGH THE AGES</div><h1>常见问题</h1><div class="orn"></div></div><div class="band"></div>
<div class="wrap guide">
<p class="note">依据 CGE 官方规则书和玩家手册（简体中文版）、扩展英文规则书，用自己的话整理，有疑问以规则书为准。官方规则书可在 <a href="https://www.czechgames.com/games/through-the-ages-a-new-story-of-civilization" target="_blank" rel="noopener">CGE 官网</a>下载。第一次玩先看 <a href="teach">6 分钟讲规则</a>。</p>
<nav class="toc">{toc}</nav>
<h2 class="h" id="faq">常见问题<small>{len(faq)} 条</small></h2>
{faq_html}
<h2 class="h" id="turn">回合速查<small>完整游戏 · 4 人</small></h2>
<p class="note">房间里的「回合速查」会按你们的人数和玩法显示。</p>
<div id="turnref"></div>
<a class="btn" href="./">返回首页</a>
<footer>非官方玩家工具 · 规则版权归 Czech Games Edition 所有</footer>
</div>
<script type="module">
import {{ initialState }} from './logic.js';
import {{ turnRef }} from './steps.js';
const S = {{ ...initialState(), mode: 'full', n: 4 }};
const li = a => `<ul class="steps">${{a.map(it => `<li><span>${{it.t}}<i class="src">${{it.src}}</i></span></li>`).join('')}}</ul>`;
document.getElementById('turnref').innerHTML = turnRef(S).map(sec => `<details class="card fq" open><summary>${{sec.h}}</summary><div class="spx">${{li(sec.items)}}</div></details>`).join('');
</script>
<script type="module" src="chat.js"></script>
</body>
</html>
''')
