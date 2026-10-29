import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
const skillRoot = path.join(root, 'src', 'skills', 'imp-style');
const styles = JSON.parse(fs.readFileSync(path.join(skillRoot, 'data', 'styles.json'), 'utf8'));
const previewRoot = path.join(skillRoot, 'assets', 'previews');
fs.mkdirSync(previewRoot, { recursive: true });

const themeCss = {
  editorial: `
    --bg:#f1eadf;--ink:#191713;--muted:#6e6254;--line:#cec0ad;--accent:#9a3f2d;--accent-ink:#fff8ef;
    --display:Georgia,"Times New Roman",serif;--body:"Avenir Next",Helvetica,sans-serif;--radius:0px;
    --headline:clamp(72px,7.4vw,112px);--headline-tracking:-.055em;--panel-bg:transparent;
  `,
  swiss: `
    --bg:#f8f8f5;--ink:#111;--muted:#575753;--line:#c9c9c4;--accent:#e33d28;--accent-ink:#fff;
    --display:"Helvetica Neue",Arial,sans-serif;--body:"Helvetica Neue",Arial,sans-serif;--radius:0px;
    --headline:clamp(70px,8vw,122px);--headline-tracking:-.07em;--panel-bg:#fff;
  `,
  minimal: `
    --bg:#fbfbf9;--ink:#202124;--muted:#777a78;--line:#e1e3df;--accent:#3452ff;--accent-ink:#fff;
    --display:"Avenir Next","Helvetica Neue",sans-serif;--body:"Avenir Next","Helvetica Neue",sans-serif;--radius:12px;
    --headline:clamp(66px,6.7vw,104px);--headline-tracking:-.05em;--panel-bg:#fff;
  `,
  industrial: `
    --bg:#171a1a;--ink:#eee8da;--muted:#9ca09b;--line:#424a48;--accent:#f06424;--accent-ink:#171a1a;
    --display:"Arial Narrow","Helvetica Neue",Arial,sans-serif;--body:"Avenir Next",Arial,sans-serif;--radius:0px;
    --headline:clamp(76px,8.6vw,132px);--headline-tracking:-.045em;--panel-bg:#202525;
  `,
  luxury: `
    --bg:#21171b;--ink:#f3ecdf;--muted:#b7a9a0;--line:#5b424a;--accent:#b79a62;--accent-ink:#21171b;
    --display:Didot,"Bodoni 72",Baskerville,serif;--body:"Avenir Next",Helvetica,sans-serif;--radius:0px;
    --headline:clamp(78px,8.4vw,128px);--headline-tracking:-.04em;--panel-bg:#2b1e24;
  `,
  organic: `
    --bg:#f0ead8;--ink:#263b2c;--muted:#66715d;--line:#c8c5a9;--accent:#b96747;--accent-ink:#fff7ec;
    --display:"Iowan Old Style",Georgia,serif;--body:"Avenir Next",Helvetica,sans-serif;--radius:28px;
    --headline:clamp(68px,7vw,108px);--headline-tracking:-.045em;--panel-bg:#f8f2e3;
  `,
  'retro-print': `
    --bg:#efe2c4;--ink:#282016;--muted:#6d5942;--line:#8c6c40;--accent:#b3432e;--accent-ink:#fff7df;
    --display:Rockwell,"Roboto Slab",Georgia,serif;--body:"Avenir Next",Arial,sans-serif;--radius:0px;
    --headline:clamp(76px,8vw,120px);--headline-tracking:-.055em;--panel-bg:#f6e9cd;
  `,
  playful: `
    --bg:#fff7e8;--ink:#18234f;--muted:#5a5d74;--line:#243fae;--accent:#ef6048;--accent-ink:#fff;
    --display:"Arial Rounded MT Bold","Avenir Next",sans-serif;--body:"Avenir Next",Helvetica,sans-serif;--radius:16px;
    --headline:clamp(72px,8vw,118px);--headline-tracking:-.06em;--panel-bg:#fff;
  `,
  cinematic: `
    --bg:#07131d;--ink:#dbe7e9;--muted:#8da4aa;--line:#29414b;--accent:#67d7df;--accent-ink:#07131d;
    --display:Baskerville,"Iowan Old Style",serif;--body:"Avenir Next",Helvetica,sans-serif;--radius:2px;
    --headline:clamp(78px,8.3vw,126px);--headline-tracking:-.04em;--panel-bg:#0d202b;
  `,
  'data-dense': `
    --bg:#f7f7f3;--ink:#1d2220;--muted:#626964;--line:#c8ccc5;--accent:#c84b32;--accent-ink:#fff;
    --display:"Avenir Next","Helvetica Neue",sans-serif;--body:"Avenir Next","Helvetica Neue",sans-serif;--radius:2px;
    --headline:clamp(52px,5.3vw,82px);--headline-tracking:-.045em;--panel-bg:#fff;
  `,
};

const themeTweaks = {
  editorial: `
    .hero{grid-template-columns:minmax(0,1.08fr) minmax(390px,.92fr)}
    h1 span{font-style:italic;color:var(--accent)}
    .panel{border-top:2px solid var(--ink);border-bottom:1px solid var(--ink);padding:22px 0 18px}
    .panel-head,.data-row,.panel-foot{padding-left:0;padding-right:0}
    .topbar{border-bottom:1px solid var(--line)}
    .actions a{border:1px solid var(--ink);border-radius:0}
  `,
  swiss: `
    .hero{grid-template-columns:minmax(0,1.16fr) minmax(430px,.84fr);gap:56px}
    h1{text-transform:uppercase;line-height:.86;max-width:850px}
    h1 span{color:var(--accent)}
    .topbar{border-bottom:8px solid var(--ink)}
    .panel{border:0;border-top:10px solid var(--accent);border-radius:0;padding:16px 0 0}
    .data-row{border-bottom:1px solid var(--ink)}
    .actions a{background:var(--accent);color:var(--accent-ink)}
  `,
  minimal: `
    .hero{grid-template-columns:minmax(0,1.15fr) minmax(390px,.85fr);gap:88px;margin-top:130px}
    h1{font-weight:500}
    h1 span{color:var(--muted)}
    .panel{border:1px solid var(--line);box-shadow:0 24px 80px rgba(32,33,36,.07)}
    .actions a{border:1px solid var(--ink);border-radius:999px;background:transparent;color:var(--ink)}
  `,
  industrial: `
    body{text-transform:none}
    .hero{grid-template-columns:minmax(0,.92fr) minmax(500px,1.08fr);gap:50px}
    h1{text-transform:uppercase;line-height:.9}
    h1 span{color:var(--accent)}
    .topbar{border-bottom:1px solid var(--line);font-family:var(--body)}
    .panel{border:1px solid var(--line);border-top:4px solid var(--accent)}
    .data-row:nth-child(2){background:rgba(240,100,36,.08)}
    .actions a{background:var(--accent);color:var(--accent-ink);text-transform:uppercase;letter-spacing:.08em}
  `,
  luxury: `
    .page{max-width:1260px;padding-left:52px;padding-right:52px}
    .hero{grid-template-columns:minmax(0,1.02fr) minmax(400px,.98fr);gap:80px;margin-top:112px}
    h1{font-weight:400;line-height:.9}
    h1 span{display:block;color:var(--accent);font-style:italic}
    .topbar{border-bottom:1px solid var(--line);letter-spacing:.08em}
    .panel{border:1px solid var(--line);background:linear-gradient(145deg,var(--panel-bg),#24171c)}
    .actions a{border:1px solid var(--accent);background:transparent;color:var(--accent)}
  `,
  organic: `
    body:before{content:"";position:fixed;width:420px;height:420px;border-radius:50%;right:-130px;top:-180px;background:rgba(152,167,122,.35)}
    .page{position:relative}
    .hero{grid-template-columns:minmax(0,1.03fr) minmax(405px,.97fr);gap:62px}
    h1 span{color:var(--accent)}
    .panel{border:1px solid rgba(38,59,44,.15);transform:rotate(1.1deg)}
    .actions a{background:var(--accent);color:var(--accent-ink)}
  `,
  'retro-print': `
    body:after{content:"";position:fixed;inset:0;pointer-events:none;opacity:.13;background-image:radial-gradient(var(--ink) .7px,transparent .7px);background-size:8px 8px}
    .page{position:relative}
    .hero{grid-template-columns:minmax(0,1.1fr) minmax(410px,.9fr);gap:54px}
    h1{text-transform:uppercase;line-height:.9}
    h1 span{color:var(--accent)}
    .topbar{border-top:8px solid var(--ink);border-bottom:3px solid var(--ink);padding-top:15px}
    .panel{border:3px solid var(--ink);box-shadow:9px 9px 0 var(--mustard)}
    .actions a{border:2px solid var(--ink);background:var(--mustard);color:var(--ink)}
  `,
  playful: `
    body{background:linear-gradient(110deg,var(--bg) 0 64%,#f0c735 64%)}
    .hero{grid-template-columns:minmax(0,1.1fr) minmax(410px,.9fr);gap:48px}
    h1 span{display:inline-block;background:var(--cobalt);color:white;padding:0 .12em .05em;transform:rotate(-1.5deg)}
    .topbar{border-bottom:3px solid var(--kelp)}
    .panel{border:3px solid var(--kelp);box-shadow:10px 10px 0 var(--coral);transform:rotate(.8deg)}
    .actions a{background:var(--coral);border:3px solid var(--kelp);color:white;box-shadow:5px 5px 0 var(--kelp)}
  `,
  cinematic: `
    body{background:radial-gradient(circle at 78% 38%,#143f4b 0,#0b202c 24%,var(--bg) 58%)}
    .hero{grid-template-columns:minmax(0,1.04fr) minmax(420px,.96fr);gap:76px;margin-top:118px}
    h1{line-height:.91}
    h1 span{color:var(--accent)}
    .topbar{border-bottom:1px solid rgba(219,231,233,.18)}
    .panel{border:1px solid rgba(103,215,223,.28);box-shadow:0 0 90px rgba(103,215,223,.11);background:rgba(13,32,43,.8)}
    .actions a{background:var(--accent);color:var(--accent-ink);box-shadow:0 0 30px rgba(103,215,223,.2)}
  `,
  'data-dense': `
    .page{width:100%;max-width:none;display:grid;grid-template-columns:218px minmax(0,1fr);padding:0}
    .page-body{padding:24px 34px 36px;min-width:0}
    .rail{display:flex}
    .hero{gap:34px;margin-top:54px;grid-template-columns:minmax(0,.66fr) minmax(690px,1.34fr)}
    h1{font-size:54px;line-height:.98}
    h1 span{color:var(--accent)}
    .sub{max-width:520px}
    .data-row{padding-top:10px;padding-bottom:10px;font-size:12px}
    .panel{padding:16px 18px 12px;box-shadow:none}
    .topbar{padding-bottom:14px;border-bottom:1px solid var(--line)}
    .topbar .brand{display:none}
    .actions a{background:var(--ink);color:white;border-radius:2px}
  `,
};

function exampleHtml(style) {
  const denseRows = style.id === 'data-dense' ? `
          <div class="data-row"><span class="shipment">HD-2014 · Zeebrugge</span><span class="route">West Dock</span><time class="eta">05:40</time><span class="status"><i></i>Late</span></div>
          <div class="data-row"><span class="shipment">HD-1988 · Tilburg</span><span class="route">South Gate</span><time class="eta">05:52</time><span class="status"><i></i>Assigned</span></div>
          <div class="data-row"><span class="shipment">HD-2051 · Ghent</span><span class="route">East Dock</span><time class="eta">06:03</time><span class="status"><i></i>Recovery</span></div>
          <div class="data-row"><span class="shipment">HD-1880 · Delft</span><span class="route">North Quay</span><time class="eta">06:18</time><span class="status"><i></i>Review</span></div>` : '';
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${style.name} — Harbor Desk</title>
  <style>
    *{box-sizing:border-box}
    :root{${themeCss[style.id]}}
    html,body{margin:0;min-height:100%;background:var(--bg);color:var(--ink)}
    body{font-family:var(--body);-webkit-font-smoothing:antialiased}
    a{color:inherit;text-decoration:none}
    .page{width:min(1280px,calc(100% - 72px));min-height:900px;margin:0 auto;padding:28px 0 42px}
    .page-body{min-width:0}
    .rail{display:none;flex-direction:column;gap:28px;padding:26px 22px;border-right:1px solid var(--line);background:var(--panel-bg)}
    .rail .brand{font-size:16px}
    .rail nav{display:flex;flex-direction:column;gap:0;font-size:12px}
    .rail nav a{display:flex;justify-content:space-between;gap:12px;padding:9px 0;border-bottom:1px solid var(--line)}
    .rail nav b{color:var(--accent);font-variant-numeric:tabular-nums}
    .rail p{margin:auto 0 0;color:var(--muted);font-size:11px;line-height:1.55}
    .topbar{display:grid;grid-template-columns:1fr auto auto;align-items:center;gap:30px;padding:0 0 20px;font-size:13px}
    .brand{font-weight:760;letter-spacing:-.02em;font-size:17px}
    .brand small{display:block;margin-top:2px;color:var(--muted);font-size:10px;font-weight:550;letter-spacing:.08em;text-transform:uppercase}
    nav{display:flex;gap:25px;color:var(--muted)}nav a:hover{color:var(--ink)}
    .console{font-weight:650;border-bottom:1px solid currentColor;padding-bottom:3px}
    .hero{display:grid;align-items:center;gap:70px;margin-top:96px}
    h1{margin:0;font-family:var(--display);font-size:var(--headline);font-weight:600;line-height:.94;letter-spacing:var(--headline-tracking)}
    h1 span{display:block}
    .sub{max-width:590px;margin:28px 0 0;color:var(--muted);font-size:18px;line-height:1.55}
    .actions{display:flex;align-items:center;gap:24px;margin-top:34px}
    .actions a{display:inline-flex;align-items:center;min-height:48px;padding:0 20px;border-radius:var(--radius);font-weight:700;font-size:14px}
    .actions span{color:var(--muted);font-size:13px}
    .panel{border-radius:var(--radius);background:var(--panel-bg);padding:22px;box-shadow:0 18px 60px rgba(20,20,20,.08)}
    .panel-head{display:flex;justify-content:space-between;align-items:center;gap:24px;padding-bottom:16px;border-bottom:1px solid var(--line);font-size:13px;font-weight:720}
    .panel-head span:last-child{color:var(--accent);font-variant-numeric:tabular-nums}
    .data-row{display:grid;grid-template-columns:minmax(0,1.4fr) .75fr .7fr auto;gap:14px;align-items:center;padding:17px 0;border-bottom:1px solid var(--line);font-size:13px}
    .data-row:last-of-type{border-bottom:0}
    .shipment{font-weight:660}.route,.eta{color:var(--muted)}.eta{font-variant-numeric:tabular-nums}
    .status{display:inline-flex;align-items:center;gap:7px;font-weight:700;white-space:nowrap}
    .status i{width:7px;height:7px;border-radius:50%;background:var(--accent);display:inline-block}
    .panel-foot{display:flex;justify-content:space-between;gap:20px;border-top:1px solid var(--line);padding-top:15px;color:var(--muted);font-size:12px}
    .proof{display:grid;grid-template-columns:.8fr 1.2fr;gap:60px;align-items:start;margin-top:74px;padding-top:24px;border-top:1px solid var(--line)}
    .proof strong{display:block;font-family:var(--display);font-size:28px;font-weight:600;letter-spacing:-.03em}
    .proof p{margin:6px 0 0;color:var(--muted);font-size:14px;line-height:1.5}
    .steps{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;margin:0;padding:0;list-style:none}
    .steps li{font-size:12px;color:var(--muted);border-top:1px solid var(--line);padding-top:9px}
    .steps b{display:block;color:var(--ink);font-size:13px;margin-bottom:3px}
    ${themeTweaks[style.id]}
  </style>
</head>
<body class="style-${style.id}">
  <div class="page">
    <aside class="rail" aria-label="Workspace navigation">
      <a class="brand" href="#">Harbor Desk<small>North Quay dispatch</small></a>
      <nav aria-label="Workspace"><a href="#">Exceptions <b>4</b></a><a href="#">Assignments</a><a href="#">Recovery</a><a href="#">Audit log</a><a href="#">Settings</a></nav>
      <p>Shift 04:00–12:00<br>Updated 18 sec ago</p>
    </aside>
    <div class="page-body">
    <header class="topbar">
      <a class="brand" href="#">Harbor Desk<small>Freight operations, clarified</small></a>
      <nav aria-label="Primary"><a href="#">Product</a><a href="#">Method</a><a href="#">Pricing</a><a href="#">Docs</a></nav>
      <a class="console" href="#queue">Open console ↗</a>
    </header>
    <main>
      <section class="hero" aria-labelledby="headline">
        <div>
          <h1 id="headline">Every exception.<span>One clear handoff.</span></h1>
          <p class="sub">Harbor Desk turns late shipments, scattered follow-ups, and recovery notes into one operational thread your whole dock can trust.</p>
          <div class="actions"><a href="#queue">Open exception queue</a><span>Built for decisions made under pressure.</span></div>
        </div>
        <section class="panel" id="queue" aria-label="Live exception queue">
          <div class="panel-head"><span>Live exception queue</span><span>4 open</span></div>
          <div class="data-row"><span class="shipment">HD-1842 · Rotterdam</span><span class="route">North Quay</span><time class="eta">04:15</time><span class="status"><i></i>Late</span></div>
          <div class="data-row"><span class="shipment">HD-1907 · Antwerp</span><span class="route">South Gate</span><time class="eta">04:42</time><span class="status"><i></i>Assigned</span></div>
          <div class="data-row"><span class="shipment">HD-1764 · Hamburg</span><span class="route">East Dock</span><time class="eta">05:08</time><span class="status"><i></i>Recovery</span></div>
          <div class="data-row"><span class="shipment">HD-1931 · Le Havre</span><span class="route">North Quay</span><time class="eta">05:26</time><span class="status"><i></i>Review</span></div>
          ${denseRows}
          <div class="panel-foot"><span>Every change writes to the audit trail.</span><span>Shift · 04:00–12:00</span></div>
        </section>
      </section>
      <section class="proof">
        <div><strong>One shared record.</strong><p>From first flag to confirmed recovery, every operator sees the same evidence and next action.</p></div>
        <ol class="steps"><li><b>Spot</b>Exceptions surface before the cutoff.</li><li><b>Assign</b>One owner takes the next action.</li><li><b>Close</b>Recovery and evidence stay linked.</li></ol>
      </section>
    </main>
    </div>
  </div>
</body>
</html>`;
}

const browser = await chromium.launch({
  headless: true,
  executablePath: process.env.IMPECCABLE_BROWSER_EXECUTABLE
    || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
});

try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
  for (const style of styles) {
    await page.setContent(exampleHtml(style), { waitUntil: 'load' });
    const output = path.join(previewRoot, `${style.id}.webp`);
    await page.screenshot({ path: output, type: 'webp', quality: 92 });
    console.log(`generated ${style.id}: ${path.relative(root, output)}`);
  }
} finally {
  await browser.close();
}

const cards = styles.map((style) => {
  const localPreview = style.preview.replace(/^assets\//, '');
  return `
  <article class="style-card">
    <a href="${localPreview}"><img src="${localPreview}" alt="${style.name} style preview"></a>
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
  <title>Impeccable Style Atlas</title>
  <style>
    *{box-sizing:border-box}html{background:#ecebe5;color:#171714}body{margin:0;font:15px/1.5 "Avenir Next",Helvetica,sans-serif}
    header{max-width:1320px;margin:0 auto;padding:64px 32px 34px;border-bottom:1px solid #bdbcb4}
    h1{font:500 clamp(48px,7vw,92px)/.92 Georgia,serif;letter-spacing:-.055em;margin:0}
    header p{max-width:720px;color:#66655e;font-size:17px;margin:22px 0 0}
    main{max-width:1320px;margin:0 auto;padding:34px 32px 80px;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:36px}
    .style-card{background:#f8f7f2;border:1px solid #cbc9c0}
    .style-card img{display:block;width:100%;aspect-ratio:8/5;object-fit:cover;background:#ddd}
    .style-copy{padding:20px 22px 24px}.style-title{display:flex;align-items:baseline;justify-content:space-between;gap:16px}
    h2{font:600 25px/1.1 Georgia,serif;margin:0}code{font:11px/1 "SF Mono",Menlo,monospace;color:#77736a}
    .style-copy p{margin:10px 0 0;color:#5f5c54}.tags{display:flex;flex-wrap:wrap;gap:6px}
    .tags span{border:1px solid #c8c4b9;padding:2px 7px;font-size:11px;color:#5e5a51;background:#fff}
    @media(max-width:760px){main{grid-template-columns:1fr;padding:24px 18px 60px}header{padding:42px 18px 24px}}
  </style>
</head>
<body>
  <header><h1>Visual direction, without the guesswork.</h1><p>Ten fixed references for the same Harbor Desk surface. Choose a direction by name; the core skill receives only its compact brief and constraints.</p></header>
  <main>${cards}</main>
</body>
</html>`;

const galleryPath = path.join(skillRoot, 'assets', 'gallery.html');
fs.mkdirSync(path.dirname(galleryPath), { recursive: true });
fs.writeFileSync(galleryPath, gallery);
console.log(`generated gallery: ${path.relative(root, galleryPath)}`);
