import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
const skillRoot = path.join(root, 'src', 'skills', 'imp-bold');
const styles = JSON.parse(fs.readFileSync(path.join(skillRoot, 'data', 'expressive.json'), 'utf8'));
const previewRoot = path.join(skillRoot, 'assets', 'previews');
fs.mkdirSync(previewRoot, { recursive: true });

const themes = {
  'neo-brutalist': {
    vars: `--bg:#e9ff3f;--ink:#111;--muted:#353535;--line:#111;--accent:#ff493b;--panel:#f6f1df;--display:"Arial Narrow","Helvetica Neue",sans-serif;--body:"Helvetica Neue",Arial,sans-serif;--radius:0px;`,
    css: `
      body:before{content:"";position:fixed;width:420px;height:420px;right:-70px;top:60px;background:#ff493b;transform:rotate(12deg);border:6px solid #111}
      .page{padding-top:25px}.hero{margin-top:70px;grid-template-columns:minmax(0,1.05fr) minmax(430px,.95fr);gap:46px}
      h1{text-transform:uppercase;font-size:clamp(76px,8.3vw,126px);line-height:.84;text-shadow:7px 7px 0 #fff}
      h1 span{display:inline;background:#111;color:#e9ff3f;padding:0 .12em .04em;box-decoration-break:clone}
      .panel{border:5px solid #111;box-shadow:14px 14px 0 #ff493b;transform:rotate(-1deg)}
      .actions a{background:#111;color:#e9ff3f;border:4px solid #111;box-shadow:6px 6px 0 #ff493b}
    `,
  },
  'maximal-collage': {
    vars: `--bg:#16141b;--ink:#f4ead8;--muted:#b6a8bd;--line:#7c697f;--accent:#ff4fa3;--panel:#241e2a;--display:"Bodoni 72",Didot,Georgia,serif;--body:"Avenir Next",Helvetica,sans-serif;--radius:0px;`,
    css: `
      body{overflow:hidden}.page:before{content:"HANDOFF";position:fixed;right:-30px;bottom:-35px;font:900 170px/1 "Helvetica Neue";letter-spacing:-.09em;color:rgba(255,79,163,.11)}
      .topbar{transform:rotate(-.5deg);border:2px solid var(--ink);padding:14px 18px}
      .hero{margin-top:58px;grid-template-columns:minmax(0,1fr) minmax(450px,.9fr);gap:35px}
      h1{font-size:clamp(82px,8.8vw,134px);line-height:.82;transform:rotate(-2deg)}
      h1 span{display:inline;background:#ff4fa3;color:#16141b;padding:0 .08em;box-decoration-break:clone}
      .panel{background:#f2e8d5;color:#171519;transform:rotate(2deg);border:2px solid #171519;box-shadow:-15px 15px 0 #2455ff}
      .sub,.actions span{color:#f4ead8}.actions a{background:#2455ff;color:white;border:2px solid #f4ead8}
    `,
  },
  'kinetic-type': {
    vars: `--bg:#f7f4ed;--ink:#0d0d0f;--muted:#65646b;--line:#bdb9b1;--accent:#3156ff;--panel:#ffffff;--display:"Helvetica Neue",Arial,sans-serif;--body:"Helvetica Neue",Arial,sans-serif;--radius:0px;`,
    css: `
      body:before{content:"MOVE";position:fixed;left:-34px;top:105px;font:900 210px/1 Arial;letter-spacing:-.12em;color:transparent;-webkit-text-stroke:1px #c7c3bb;transform:rotate(-7deg);pointer-events:none}
      .hero{margin-top:82px;grid-template-columns:minmax(0,1.15fr) minmax(415px,.85fr);gap:58px}
      h1{font-size:clamp(90px,10vw,150px);line-height:.78;letter-spacing:-.09em}
      h1 span{color:var(--accent);text-transform:uppercase;transform:translateX(52px)}
      .topbar{text-transform:uppercase;letter-spacing:.08em}
      .panel{border-left:8px solid var(--accent);box-shadow:none}
      .actions a{background:#ff603d;color:#0d0d0f}
    `,
  },
  'retro-futurist': {
    vars: `--bg:#090d0d;--ink:#d6ff65;--muted:#8d9a7c;--line:#526063;--accent:#f8a91c;--panel:#101818;--display:"Arial Narrow","Helvetica Neue",sans-serif;--body:"SF Mono",Menlo,monospace;--radius:0px;`,
    css: `
      body:after{content:"";position:fixed;inset:0;background:repeating-linear-gradient(0deg,rgba(214,255,101,.035) 0 1px,transparent 1px 4px);pointer-events:none}
      .page{position:relative;max-width:1320px}.topbar{border:1px solid var(--line);padding:14px 18px;text-transform:uppercase}
      .hero{margin-top:70px;grid-template-columns:minmax(0,.92fr) minmax(510px,1.08fr);gap:44px}
      h1{font-size:clamp(76px,7.7vw,118px);line-height:.88;text-transform:uppercase;text-shadow:0 0 24px rgba(214,255,101,.2)}
      h1 span{color:var(--accent)}
      .panel{border:1px solid #d6ff65;box-shadow:0 0 45px rgba(214,255,101,.08)}
      .panel:before{content:"SYS / ACTIVE";display:block;margin:-22px -22px 16px;padding:7px 12px;background:#d6ff65;color:#090d0d;font-size:10px;letter-spacing:.12em}
      .actions a{background:#d6ff65;color:#090d0d;border-radius:0}
    `,
  },
  'spatial-generative': {
    vars: `--bg:#05131f;--ink:#e0eef0;--muted:#8faeb4;--line:#2d5660;--accent:#35d0c6;--panel:#0a2430;--display:"Helvetica Neue",Arial,sans-serif;--body:"Avenir Next",Helvetica,sans-serif;--radius:18px;`,
    css: `
      body:before{content:"";position:fixed;width:640px;height:640px;border-radius:50%;right:40px;top:80px;background:radial-gradient(circle at 42% 40%,#7c61ff 0,#1b6470 24%,transparent 58%);filter:blur(2px);opacity:.72}
      .page{position:relative}.hero{margin-top:76px;grid-template-columns:minmax(0,1fr) minmax(440px,.9fr);gap:68px}
      h1{font-size:clamp(78px,8vw,124px);line-height:.88}
      h1 span{color:var(--accent)}
      .panel{background:rgba(10,36,48,.82);border:1px solid rgba(53,208,198,.38);box-shadow:0 0 90px rgba(53,208,198,.12)}
      .actions a{background:var(--accent);color:#05131f}
    `,
  },
  'narrative-scroll': {
    vars: `--bg:#111418;--ink:#dec79f;--muted:#a7a6a1;--line:#59534a;--accent:#ff7b3d;--panel:#191d21;--display:Baskerville,"Iowan Old Style",serif;--body:"Avenir Next",Helvetica,sans-serif;--radius:0px;`,
    css: `
      body{background:linear-gradient(#111418 0 56%,#2b201a 100%)}.page{max-width:1260px}
      body:before{content:"";position:fixed;width:760px;height:760px;border-radius:50%;left:-310px;bottom:-510px;background:#ff7b3d;opacity:.12;filter:blur(80px)}
      .topbar{border-bottom:1px solid var(--line);letter-spacing:.06em}
      .hero{margin-top:90px;grid-template-columns:minmax(0,1fr) minmax(430px,.9fr);gap:74px}
      h1{font-size:clamp(82px,8.5vw,132px);line-height:.82}
      h1 span{display:block;color:var(--accent);font-style:italic}
      .panel{border-top:2px solid var(--accent);border-bottom:1px solid var(--line);padding:20px 0 14px}
      .panel-head,.data-row,.panel-foot{padding-left:0;padding-right:0}
      .actions a{border:1px solid var(--accent);color:var(--accent);background:transparent}
    `,
  },
  'signal-glitch': {
    vars: `--bg:#050607;--ink:#f4f4ef;--muted:#91949c;--line:#2e3338;--accent:#41e8f2;--panel:#0b0e10;--display:"Arial Narrow","Helvetica Neue",sans-serif;--body:"Avenir Next",Helvetica,sans-serif;--radius:0px;`,
    css: `
      body:before{content:"SIGNAL";position:fixed;right:-60px;top:24px;font:900 150px/1 Arial;letter-spacing:-.08em;color:#41e8f2;opacity:.08}
      body:after{content:"";position:fixed;inset:0;background:repeating-linear-gradient(0deg,transparent 0 5px,rgba(65,232,242,.03) 5px 6px);pointer-events:none}
      .page{position:relative}.topbar{border-bottom:2px solid #41e8f2}
      .hero{margin-top:70px;grid-template-columns:minmax(0,1fr) minmax(460px,.9fr);gap:52px}
      h1{font-size:clamp(82px,8.6vw,132px);line-height:.86;text-transform:uppercase;text-shadow:5px 0 #ff3d64,-5px 0 #41e8f2}
      h1 span{color:#41e8f2}
      .panel{border:1px solid #41e8f2;box-shadow:8px 0 0 rgba(255,61,100,.45)}
      .actions a{background:#41e8f2;color:#050607}
    `,
  },
  'character-led': {
    vars: `--bg:#fff2d8;--ink:#22332f;--muted:#58706a;--line:#9fc3b7;--accent:#ff685c;--panel:#fff8e9;--display:"Arial Rounded MT Bold","Avenir Next",sans-serif;--body:"Avenir Next",Helvetica,sans-serif;--radius:30px;`,
    css: `
      body:before{content:"";position:fixed;width:440px;height:440px;border-radius:50%;right:-90px;top:-100px;background:#0b8f82;opacity:.19}
      .hero{margin-top:64px;grid-template-columns:minmax(0,.98fr) minmax(440px,1.02fr);gap:42px}
      h1{font-size:clamp(76px,8.2vw,122px);line-height:.87}
      h1 span{color:var(--accent)}
      .panel{border:3px solid var(--ink);box-shadow:9px 9px 0 #0b8f82;transform:rotate(.8deg)}
      .actions a{background:var(--coral, #ff685c);color:white;border:3px solid var(--ink);box-shadow:5px 5px 0 var(--ink)}
      .character{position:fixed;right:32px;bottom:22px;width:92px;height:110px;z-index:3}
    `,
  },
};

const motifs = {
  'maximal-collage': `<div class="motif motif-collage"><i></i><b></b><em></em></div>`,
  'spatial-generative': `<div class="motif motif-orbit"><i></i><b></b></div>`,
  'narrative-scroll': `<div class="motif motif-sun"></div>`,
  'signal-glitch': `<div class="motif motif-scan"></div>`,
  'character-led': `<svg class="character" viewBox="0 0 92 110" aria-hidden="true"><path d="M13 95Q3 58 21 31Q37 6 65 18Q87 28 80 61Q76 85 58 102Z" fill="#ff685c" stroke="#22332f" stroke-width="4"/><circle cx="36" cy="53" r="5" fill="#22332f"/><circle cx="66" cy="53" r="5" fill="#22332f"/><path d="M39 72Q50 81 61 72" fill="none" stroke="#22332f" stroke-width="4" stroke-linecap="round"/><path d="M21 27L12 8L34 17M62 16L76 2L80 23" fill="#fff2d8" stroke="#22332f" stroke-width="4" stroke-linejoin="round"/></svg>`,
};

function exampleHtml(style) {
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${style.name} — Harbor Desk</title>
<style>
*{box-sizing:border-box}:root{${themes[style.id].vars}}
html,body{margin:0;min-height:100%;background:var(--bg);color:var(--ink)}
body{font-family:var(--body);-webkit-font-smoothing:antialiased}a{color:inherit;text-decoration:none}
.page{position:relative;width:min(1280px,calc(100% - 72px));min-height:900px;margin:auto;padding:28px 0 42px}
.topbar{display:grid;grid-template-columns:1fr auto auto;align-items:center;gap:28px;padding-bottom:18px;font-size:12px}
.brand{font-weight:800;letter-spacing:-.02em;font-size:17px}.brand small{display:block;font-size:9px;letter-spacing:.12em;text-transform:uppercase;color:var(--muted)}
nav{display:flex;gap:22px;color:var(--muted)}.console{font-weight:700;border-bottom:1px solid currentColor;padding-bottom:3px}
.hero{display:grid;align-items:center;gap:58px;margin-top:82px}h1{margin:0;font-family:var(--display);font-size:clamp(74px,8vw,122px);line-height:.88;letter-spacing:-.06em;font-weight:700}
h1 span{display:block}.sub{max-width:600px;margin:25px 0 0;color:var(--muted);font-size:17px;line-height:1.55}
.actions{display:flex;align-items:center;gap:20px;margin-top:30px}.actions a{display:inline-flex;align-items:center;min-height:48px;padding:0 18px;border-radius:var(--radius);font-size:13px;font-weight:800}.actions span{color:var(--muted);font-size:12px}
.panel{position:relative;background:var(--panel);border-radius:var(--radius);padding:21px}
.panel-head{display:flex;justify-content:space-between;gap:20px;padding-bottom:14px;border-bottom:1px solid var(--line);font-size:12px;font-weight:800}.panel-head span:last-child{color:var(--accent)}
.data-row{display:grid;grid-template-columns:minmax(0,1.4fr) .7fr .68fr auto;gap:12px;align-items:center;padding:16px 0;border-bottom:1px solid var(--line);font-size:12px}.data-row:last-of-type{border-bottom:0}.shipment{font-weight:760}.route,.eta{color:var(--muted)}.eta{font-variant-numeric:tabular-nums}.status{display:inline-flex;align-items:center;gap:6px;white-space:nowrap;font-weight:760}.status i{display:block;width:7px;height:7px;border-radius:50%;background:var(--accent)}
.panel-foot{display:flex;justify-content:space-between;gap:18px;padding-top:13px;border-top:1px solid var(--line);color:var(--muted);font-size:11px}
.proof{display:grid;grid-template-columns:.75fr 1.25fr;gap:48px;margin-top:68px;padding-top:20px;border-top:1px solid var(--line)}.proof strong{font-family:var(--display);font-size:27px;letter-spacing:-.03em}.proof p{margin:6px 0 0;color:var(--muted);font-size:12px;line-height:1.5}.steps{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:repeat(3,1fr);gap:18px}.steps li{font-size:11px;color:var(--muted);border-top:1px solid var(--line);padding-top:8px}.steps b{display:block;color:var(--ink);font-size:12px;margin-bottom:2px}
.motif{position:fixed;pointer-events:none}.motif-collage i,.motif-collage b,.motif-collage em{position:absolute;display:block;border:2px solid #f4ead8}.motif-collage i{width:190px;height:120px;background:#ff4fa3;left:110px;bottom:40px;transform:rotate(-9deg)}.motif-collage b{width:140px;height:180px;background:#2455ff;left:265px;bottom:10px;transform:rotate(8deg)}.motif-collage em{width:90px;height:70px;background:#ffb52f;left:380px;bottom:75px;transform:rotate(-14deg)}
.motif-orbit{border:1px solid rgba(53,208,198,.35);border-radius:50%;width:620px;height:240px;right:70px;top:320px;transform:rotate(-18deg)}.motif-orbit i{position:absolute;inset:48px 150px;border:1px solid rgba(124,97,255,.5);border-radius:50%}.motif-orbit b{position:absolute;width:16px;height:16px;border-radius:50%;background:#35d0c6;right:38px;top:62px;box-shadow:0 0 30px #35d0c6}
.motif-sun{width:320px;height:320px;border-radius:50%;background:#ff7b3d;right:-80px;top:150px;opacity:.11}
.motif-scan{inset:0;background:linear-gradient(90deg,transparent 0 44%,rgba(65,232,242,.11) 44% 44.4%,transparent 44.4% 78%,rgba(255,61,100,.08) 78% 78.3%,transparent 78.3%)}
${themes[style.id].css}
</style></head><body class="style-${style.id}">${motifs[style.id] || ''}
<div class="page">
  <header class="topbar"><a class="brand" href="#">Harbor Desk<small>Freight operations, clarified</small></a><nav><a href="#">Product</a><a href="#">Method</a><a href="#">Pricing</a><a href="#">Docs</a></nav><a class="console" href="#queue">Open console ↗</a></header>
  <main><section class="hero"><div><h1>Every exception.<span>One clear handoff.</span></h1><p class="sub">Harbor Desk turns late shipments, scattered follow-ups, and recovery notes into one operational thread your whole dock can trust.</p><div class="actions"><a href="#queue">Open exception queue</a><span>Built for decisions made under pressure.</span></div></div>
  <section class="panel" id="queue" aria-label="Live exception queue"><div class="panel-head"><span>Live exception queue</span><span>4 open</span></div>
  <div class="data-row"><span class="shipment">HD-1842 · Rotterdam</span><span class="route">North Quay</span><time class="eta">04:15</time><span class="status"><i></i>Late</span></div>
  <div class="data-row"><span class="shipment">HD-1907 · Antwerp</span><span class="route">South Gate</span><time class="eta">04:42</time><span class="status"><i></i>Assigned</span></div>
  <div class="data-row"><span class="shipment">HD-1764 · Hamburg</span><span class="route">East Dock</span><time class="eta">05:08</time><span class="status"><i></i>Recovery</span></div>
  <div class="data-row"><span class="shipment">HD-1931 · Le Havre</span><span class="route">North Quay</span><time class="eta">05:26</time><span class="status"><i></i>Review</span></div>
  <div class="panel-foot"><span>Every change writes to the audit trail.</span><span>Shift · 04:00–12:00</span></div></section></section>
  <section class="proof"><div><strong>One shared record.</strong><p>From first flag to confirmed recovery, every operator sees the same evidence and next action.</p></div><ol class="steps"><li><b>Spot</b>Exceptions surface before the cutoff.</li><li><b>Assign</b>One owner takes the next action.</li><li><b>Close</b>Recovery and evidence stay linked.</li></ol></section></main>
</div></body></html>`;
}

const browser = await chromium.launch({
  headless: true,
  executablePath: process.env.IMPECCABLE_BROWSER_EXECUTABLE
    || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
});
try {
  const browserPage = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
  for (const style of styles) {
    await browserPage.setContent(exampleHtml(style), { waitUntil: 'load' });
    const output = path.join(previewRoot, `${style.id}.webp`);
    await browserPage.screenshot({ path: output, type: 'webp', quality: 92 });
    console.log(`generated ${style.id}: ${path.relative(root, output)}`);
  }
} finally {
  await browser.close();
}

const cards = styles.map((style) => {
  const localPreview = style.preview.replace(/^assets\//, '');
  return `
  <article class="style-card">
    <a href="${localPreview}"><img src="${localPreview}" alt="${style.name} expressive style preview"></a>
    <div class="style-copy">
      <div class="style-title"><h2>${style.name}</h2><code>${style.id}</code></div>
      <p>${style.summary}</p>
      <p class="tags">${style.keywords.map((keyword) => `<span>${keyword}</span>`).join('')}</p>
    </div>
  </article>`;
}).join('\n');

const gallery = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Impeccable Expressive Atlas</title>
  <style>
    *{box-sizing:border-box}html{background:#0b0b0c;color:#f1eee7}body{margin:0;font:15px/1.5 "Avenir Next",Helvetica,sans-serif}
    header{max-width:1320px;margin:auto;padding:64px 32px 34px;border-bottom:1px solid #3a3937}
    h1{font:500 clamp(50px,7vw,96px)/.9 "Bodoni 72",Georgia,serif;letter-spacing:-.06em;margin:0}
    header p{max-width:760px;color:#a6a29a;font-size:17px;margin:22px 0 0}
    main{max-width:1320px;margin:auto;padding:34px 32px 80px;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:36px}
    .style-card{background:#171719;border:1px solid #3b3a38}.style-card img{display:block;width:100%;aspect-ratio:8/5;object-fit:cover;background:#222}
    .style-copy{padding:20px 22px 24px}.style-title{display:flex;align-items:baseline;justify-content:space-between;gap:16px}
    h2{font:600 25px/1.1 "Bodoni 72",Georgia,serif;margin:0}code{font:11px/1 "SF Mono",Menlo,monospace;color:#8d8982}
    .style-copy p{margin:10px 0 0;color:#aaa59d}.tags{display:flex;flex-wrap:wrap;gap:6px}.tags span{border:1px solid #46433e;padding:2px 7px;font-size:11px;color:#bcb6ad}
    @media(max-width:760px){main{grid-template-columns:1fr;padding:24px 18px 60px}header{padding:42px 18px 24px}}
  </style>
</head>
<body><header><h1>Expression, at full commitment.</h1><p>Eight fixed high-expression directions for explicitly requested experimental web work. These are references and constraints, not prompts for generating new artwork.</p></header><main>${cards}</main></body>
</html>`;

const galleryPath = path.join(skillRoot, 'assets', 'gallery.html');
fs.mkdirSync(path.dirname(galleryPath), { recursive: true });
fs.writeFileSync(galleryPath, gallery);
console.log(`generated gallery: ${path.relative(root, galleryPath)}`);
