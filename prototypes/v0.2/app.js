'use strict';
/* 小畅宝 Colopal v0.1.0 — 交互原型。患者数据全部为模拟；临床试验列表为真实登记摘录（状态未核实）。
   不读写真实文件、不调用模型或宿主 API。视觉体系沿用家族原型（淋巴瘤 v0.1），品牌色重映射为 Awareness 深蓝。 */

const APP_INFO = {
  version: '0.1.0',
  build: '2026-10-18',
  channel: 'prototype',
  channelLabel: '交互原型 · 未接入 DSH'
};
APP_INFO.displayVersion = `v${APP_INFO.version}`;

const $ = (s, root = document) => root.querySelector(s);
const $$ = (s, root = document) => Array.from(root.querySelectorAll(s));
const esc = (v) => String(v ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
let uidSeq = 0;
const uid = (p) => p + (++uidSeq);

/* ---------------- icons & nav ---------------- */
const icons = {
  home: 'M3 10 12 3l9 7M5 9v12h5v-7h4v7h5V9',
  badge: 'M12 3l7 4v10l-7 4-7-4V7ZM9 12l2 2 4-4',
  drip: 'M12 3v6m0 0a5 5 0 1 0 0 10 5 5 0 0 0 0-10ZM7 7h10',
  stoma: 'M12 3a7 7 0 0 1 7 7c0 5-4 7-4 11h-6c0-4-4-6-4-11a7 7 0 0 1 7-7ZM10 21v-4m4 4v-4',
  lab: 'M9 3h6M10 3v6l-5 9a2 2 0 0 0 2 3h10a2 2 0 0 0 2-3l-5-9V3M7 15h10',
  chart: 'M4 3v17h17M7 14l4-5 4 3 5-7',
  leaf: 'M20 4c-9.4 0-15 4.1-15 9.6A5.4 5.4 0 0 0 10.4 19C16 19 20 13.4 20 4ZM5.5 18.6C8 13.4 12 10.6 17 9.6',
  heart: 'M12 20.3c-4.6-2.9-7.4-5.6-7.4-9A4.1 4.1 0 0 1 12 8.4a4.1 4.1 0 0 1 7.4 2.9c0 3.4-2.8 6.1-7.4 9Z',
  calendar: 'M4 5h16v16H4ZM8 3v4m8-4v4M4 10h16m-12 4h2m4 0h2m-8 3h2',
  flask: 'M9 3h6v5l5 9a2 2 0 0 1-2 3H6a2 2 0 0 1-2-3l5-9Z',
  folder: 'M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z'
};
const icon = (k) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${icons[k]}"/></svg>`;

const PAGES = [
  ['dashboard', '看板', 'home'], ['records', '病情整理', 'folder'], ['subtype', '我的分型', 'badge'], ['treatment', '治疗历程', 'drip'],
  ['stoma', '肠道功能与造口', 'stoma'], ['labs', '检查与指标', 'lab'], ['timeline', '病情一图秀', 'chart'],
  ['nutrition', '营养支持', 'leaf'], ['mind', '心理支持', 'heart'], ['review', '复诊准备', 'calendar'],
  ['trials', '临床研究', 'flask']
];
const SUBPAGES = {
  records: ['资料库', '整理草稿 / 核对', '病情档案', '指标检测', '病情汇总'],
  subtype: ['分子分型矩阵', '分期与病理', 'Lynch 筛查', '会诊与二次意见'],
  treatment: ['治疗线与方案', '周期与用药', '可切除性评估'],
  stoma: ['造口档案', '三键日记', 'LARS 自查', '肠镜与息肉随访'],
  labs: ['肿瘤标志物', '治疗期安全监测', '影像评估'],
  timeline: ['数值曲线', '分类与事件', '数据口径'],
  nutrition: ['进食与体重', '饮食笔记', '运动与生活'],
  mind: ['当下感受', '身体形象', '家庭沟通'],
  review: ['监测节奏', '就诊准备'],
  trials: ['2026 线索', '已收藏', '入组问题']
};
const SUBTITLES = {
  dashboard: '分型、造口与每一次复查放在一起，让下一次讨论有据可查。',
  records: '上传 → 解析 → 确认指标 → 入库；原件永远保留，接受之前都只是候选。',
  subtype: '分子分型是方案选择的起点；这里保存依据原文，不替你解释病理。',
  treatment: '按治疗线整理方案、周期与评估，改过的计划也留痕。',
  stoma: '造口与肠道功能是每天的事；每条记录 30 秒内，漏记不催不补。',
  labs: '同一个指标按时间排好，换医院、换方法都标出来。',
  timeline: '治疗、检验与造口事件放回同一段时间里，看见变化发生在哪一步。',
  nutrition: '吃得下、吃得够、体重稳，是治疗期间最实际的一件事；不需要计算每一口。',
  mind: '害怕、疲惫、不想说话都算正常反应；这里的内容默认只属于你。',
  review: '该带什么、该问什么，提前写下来，诊室里就不用凭记忆。',
  trials: '线索不是推荐；先弄清入组条件，再决定要不要问。'
};

/* ---------------- 数据层（由 demo/build-demo-data.mjs 生成；改数据请改生成器重跑） ---------------- */
const D = window.DEMO_DATA;
const PROFILES = {}, METRICS = {}, EVENTS = {}, DASH_KEYS = {}, DOCS = {}, CANDS = {};
for (const [k, p] of Object.entries(D.profiles)) {
  PROFILES[k] = { name: p.name, sex: p.sex, age: p.age, meta: p.meta, headline: p.headline, stage: p.stage, mindset: p.mindset,
    molecular: p.molecular, lynch: p.lynch, path: p.path, lines: p.lines, cycles: p.cycles, rhythm: p.rhythm,
    resect: p.resect, stoma: p.stoma, lars: p.lars, viewpoints: p.viewpoints,
    nutritionNotes: p.nutritionNotes, activity: p.activity, familyTalk: p.familyTalk,
    docs: p.docs || [], candidates: p.candidates || [], pathology: p.pathology || null };
  METRICS[k] = {};
  for (const m of p.metrics) METRICS[k][m.key] = m;
  EVENTS[k] = p.events;
  DASH_KEYS[k] = p.dash_keys;
  DOCS[k] = (p.docs || []).map(d => ({ ...d }));
  CANDS[k] = (p.candidates || []).map(c => ({ ...c }));
}
const TRIALS = D.trials;

/* ---------------- state ---------------- */
const state = { view: 'dashboard', profile: 'A', agentOpen: false, agentSize: 'std', sel: ['cea', 'ca199', 'wt'],
  range: 'all', zoom: 100, toggles: { treatment: true, keypoints: true }, pin: null, saved: [], sub: {},
  query: '', parsing: false, parseError: false, loaded: {} };
const defaultSel = (k) => (DASH_KEYS[k] || []).filter(c => { const m = METRICS[k][c]; return m && typeof m.points.find(p => typeof p.v === 'number')?.v === 'number'; }).slice(0, 3);
const P = () => PROFILES[state.profile];
const M = () => METRICS[state.profile];

/* ---------------- helpers ---------------- */
const fmtDate = (d) => d;
const delta = (m) => {
  if (!m.points || m.points.length < 2) return null;
  const a = m.points[m.points.length - 1], b = m.points[m.points.length - 2];
  if (typeof a.v !== 'number' || typeof b.v !== 'number') return null;
  const d = a.v - b.v;
  return { text: (d > 0 ? '+' : '') + d.toFixed(m.dec ?? 1), up: d > 0, from: b.d };
};
function sparkline(m, w = 200, h = 44) {
  const pts = (m.points || []).filter(p => typeof p.v === 'number');
  if (pts.length < 2) return '';
  const vs = pts.map(p => p.v);
  let lo = Math.min(...vs), hi = Math.max(...vs); if (hi === lo) { hi += 1; lo -= 1; }
  const X = i => 4 + (w - 8) * i / (pts.length - 1);
  const Y = v => h - 5 - (h - 10) * (v - lo) / (hi - lo);
  const path = pts.map((p, i) => `${i ? 'L' : 'M'}${X(i).toFixed(1)},${Y(p.v).toFixed(1)}`).join('');
  const dots = pts.map((p, i) => `<circle class="sp-dot" cx="${X(i).toFixed(1)}" cy="${Y(p.v).toFixed(1)}" r="2.6" fill="${m.color}"/>`).join('');
  return `<svg class="spark" viewBox="0 0 ${w} ${h}" aria-hidden="true"><path class="base" d="M4 ${h - 5}H${w - 4}"/><path class="sp-line" d="${path}" stroke="${m.color}"/>${dots}</svg>`;
}
function flipCard(key) {
  const el = document.querySelector(`[data-mcard="${key}"]`);
  if (el) el.setAttribute('aria-pressed', el.getAttribute('aria-pressed') === 'true' ? 'false' : 'true');
}
function mcard(key, m) {
  const last = (m.points || []).slice(-1)[0];
  if (!last) return '';
  const numeric = typeof last.v === 'number' && m.dec !== null;
  const d = delta(m);
  const cat = `<span class="cat"><i style="background:${m.color}"></i>${esc(m.cat)}</span>`;
  if (!numeric) {
    return `<button class="mcard" data-mcard="${key}" data-static="1" aria-pressed="false" title="分类记录，不翻面">
      <span class="mface front">${cat}<span class="name">${esc(m.name)}</span>
      <span class="na">${esc(last.v)}</span>
      <span class="meta"><span>${esc(last.src)}</span><span class="hint">分类记录</span></span></span></button>`;
  }
  const band = m.band ? `<span class="rec">参考 ${m.band[0]}–${m.band[1]} ${esc(m.unit)}</span>` : `<span class="rec">${esc(last.d)} · ${esc(last.src)}</span>`;
  return `<button class="mcard" data-mcard="${key}" aria-pressed="false" onclick="flipCard('${key}')" title="轻点翻面看参考区间与说明">
    <span class="mcard-inner">
    <span class="mface front">${cat}<span class="name">${esc(m.name)}</span>
      <span class="val"><span data-countup="${last.v}" data-dec="${m.dec ?? 1}">${last.v.toFixed(m.dec ?? 1)}</span><small>${esc(m.unit)}</small></span>
      ${d ? `<span class="delta">较上次 <em>${d.text}${m.unit ? ' ' + esc(m.unit) : ''}</em>（${esc(d.from)}）</span>` : ''}
      ${band}</span>
    <span class="mface back">${cat}<span class="name">${esc(m.name)}</span>
      ${sparkline(m, 190, 40)}
      <span class="meta"><span>${esc(m.note)}</span><span class="hint">轻点翻回</span></span></span>
    </span></button>`;
}
/* ---------------- 一图秀引擎（统一画布 · 多序列归一化 · 移植淋巴瘤基因） ---------------- */
const CW = 980, CH = 420, CX0 = 62, CX1 = 954, CY0 = 132, CY1 = 366;
const CAT_ORDER = ['肿瘤标志物', '血象', '生化', '电解质', '营养', '贝伐监测', '治疗毒性'];
const fmtNum = (v, dec) => typeof v === 'number' ? v.toFixed(dec ?? 1) : String(v ?? '');
const shortDate = (d) => d.slice(5).replace('-', '.');
const longDate = (d) => d;
const numPts = (m) => (m.points || []).filter(p => typeof p.v === 'number');
const addDays = (d, n) => new Date(Date.parse(d) + n * 86400000).toISOString().slice(0, 10);

function dataBounds() {
  const ds = [];
  for (const m of Object.values(M())) for (const p of m.points) ds.push(p.d);
  for (const e of (EVENTS[state.profile] || [])) ds.push(e.d);
  ds.sort();
  return [Date.parse(ds[0]), Date.parse(ds[ds.length - 1])];
}
function domain() {
  const [s, e] = dataBounds();
  const months = { '3m': 3, '6m': 6, '12m': 12 }[state.range];
  const start = months ? new Date(new Date(e).setMonth(new Date(e).getMonth() - months)) : new Date(s);
  const span = e - start.getTime();
  const kept = span * state.zoom / 100;
  return [e - kept, e];
}
const inDomain = (d, t0, t1) => { const t = Date.parse(d); return t >= t0 && t <= t1; };
const xOf = (t, t0, t1) => CX0 + (t - t0) / Math.max(1, t1 - t0) * (CX1 - CX0);

/* 单调三次插值（Fritsch-Carlson，同 d3 curveMonotoneX）：
   只平滑折线，且保证曲线段不越过相邻数据点的 y 范围——不会出现"过冲鼓包"式变形 */
function smoothPath(coords) {
  const n = coords.length;
  if (!n) return '';
  if (n === 1) return `M ${coords[0].x.toFixed(1)} ${coords[0].y.toFixed(1)}`;
  const dx = [], slope = [];
  for (let i = 0; i < n - 1; i++) {
    const ddx = coords[i + 1].x - coords[i].x;
    dx.push(ddx);
    slope.push(ddx ? (coords[i + 1].y - coords[i].y) / ddx : 0);
  }
  const tan = [slope[0]];
  for (let i = 1; i < n - 1; i++) {
    if (slope[i - 1] * slope[i] <= 0) tan.push(0);           // 拐点处切线置平，防鼓包
    else {
      const w1 = 2 * dx[i] + dx[i - 1], w2 = dx[i] + 2 * dx[i - 1];
      tan.push((w1 + w2) / (w1 / slope[i - 1] + w2 / slope[i])); // 调和加权，保证单调
    }
  }
  tan.push(slope[n - 2]);
  let d = `M ${coords[0].x.toFixed(1)} ${coords[0].y.toFixed(1)}`;
  for (let i = 0; i < n - 1; i++) {
    const c1x = coords[i].x + dx[i] / 3, c1y = coords[i].y + tan[i] * dx[i] / 3;
    const c2x = coords[i + 1].x - dx[i] / 3, c2y = coords[i + 1].y - tan[i + 1] * dx[i] / 3;
    d += ` C ${c1x.toFixed(1)} ${c1y.toFixed(1)} ${c2x.toFixed(1)} ${c2y.toFixed(1)} ${coords[i + 1].x.toFixed(1)} ${coords[i + 1].y.toFixed(1)}`;
  }
  return d;
}

/* 治疗条：周期带（化疗周期）+ 评估标记（手术/MDT/基线），两行独立于数据区 */
function bandsFor(t0, t1) {
  const p = P(), items = [];
  p.cycles.forEach((c, i) => {
    const from = c[1];
    const to = c[4] && p.cycles[i + 1] ? p.cycles[i + 1][1] : addDays(from, 21);
    items.push({ kind: 'cycle', from, to, label: c[0], color: '#1b4f8a' });
  });
  (EVENTS[state.profile] || []).forEach((e) => {
    if (/手术|MDT|基线/.test(e.label)) items.push({ kind: 'mark', from: e.d, to: e.d, label: e.label, color: e.label.includes('手术') ? '#a03d5c' : '#9a6410' });
  });
  return items.filter((tr) => Date.parse(tr.to) >= t0 && Date.parse(tr.from) <= t1)
    .sort((a, b) => Date.parse(a.from) - Date.parse(b.from))
    .map((tr, lane) => { const s = Math.max(Date.parse(tr.from), t0), e2 = Math.min(Date.parse(tr.to), t1); return { ...tr, x1: xOf(s, t0, t1), x2: xOf(e2, t0, t1), lane }; });
}

function monthTicks(t0, t1) {
  const out = []; const d = new Date(t0); let cur = new Date(d.getFullYear(), d.getMonth(), 1);
  if (cur.getTime() < t0) cur.setMonth(cur.getMonth() + 1);
  while (cur.getTime() <= t1) {
    const x = xOf(cur.getTime(), t0, t1);
    if (x > CX0 + 6 && x < CX1 - 6) out.push({ x, label: `${cur.getMonth() + 1}月` });
    cur = new Date(cur.getFullYear(), cur.getMonth() + 1, 1);
  }
  if (out.length > 7) return out.filter((_, i) => i % 2 === 0);
  return out;
}

function seriesFor(code, t0, t1) {
  const m = M()[code];
  const all = numPts(m).map((p) => p.v);
  const lo = Math.min(...all), hi = Math.max(...all);
  const span = hi - lo || Math.max(Math.abs(hi) * 0.08, 1);
  const pts = numPts(m).filter((p) => inDomain(p.d, t0, t1));
  return { code, m, lo, hi, span, pts };
}

function chartSVG(t0, t1) {
  const bands = state.toggles.treatment ? bandsFor(t0, t1) : [];
  const series = state.sel.filter((c) => M()[c]).map((c) => seriesFor(c, t0, t1)).filter((s) => s.pts.length);
  if (!series.length) return `<div class="empty"><h3>这个时间窗里没有所选指标</h3><p>扩大时间范围，或在左侧加选一个指标。</p></div>`;
  const yOf = (s, v) => CY1 - (v - s.lo) / s.span * (CY1 - CY0);
  const grid = [0, 1, 2, 3, 4].map((i) => { const y = CY0 + i * (CY1 - CY0) / 4; return `<line class="grid" x1="${CX0}" x2="${CX1}" y1="${y}" y2="${y}"/>`; }).join('');

  const strip = bands.map((b) => {
    if (b.kind === 'mark') {
      const x = b.x1.toFixed(1), row = 64;
      return `<g><path d="M ${x} ${row - 4} l4 4 -4 4 -4 -4 Z" fill="${b.color}"/>
        <text x="${(+x + 8).toFixed(1)}" y="${row + 3.5}" font-size="9.5" fill="${b.color}" font-weight="600">${esc(b.label)}</text></g>`;
    }
    const w = Math.max(b.x2 - b.x1, 7).toFixed(1);
    return `<g><rect x="${b.x1.toFixed(1)}" y="36" width="${w}" height="8" rx="4" fill="${b.color}" opacity=".3"/>
      <text x="${(b.x1 + 1).toFixed(1)}" y="30" font-size="9" fill="${b.color}" font-weight="500">${esc(b.label)}</text></g>`;
  }).join('');

  const markLines = bands.filter((b) => b.kind === 'mark').map((b) =>
    `<line x1="${b.x1.toFixed(1)}" x2="${b.x1.toFixed(1)}" y1="${CY0}" y2="${CY1}" stroke="${b.color}" stroke-width="1.2" stroke-dasharray="3 6" opacity=".45"/>`).join('');

  // 末点标签：按 y 排序强制最小间距 13px，右端左锚定，防叠字
  const lastPos = series.map((s) => {
    const c = s.pts.map((p) => ({ x: xOf(Date.parse(p.d), t0, t1), y: yOf(s, p.v) }));
    const last = c[c.length - 1];
    return { s, x: last.x, y: last.y, v: s.pts[s.pts.length - 1].v };
  }).sort((a, b) => a.y - b.y);
  let cursor = -Infinity;
  for (const it of lastPos) { it.ly = Math.max(it.y, cursor + 13); cursor = it.ly; }
  const overflow = lastPos.length ? Math.max(0, lastPos[lastPos.length - 1].ly - (CY1 + 2)) : 0;
  if (overflow) for (const it of lastPos) it.ly -= overflow;

  const lines = series.map((s) => {
    const coords = s.pts.map((p) => ({ x: xOf(Date.parse(p.d), t0, t1), y: yOf(s, p.v) }));
    const path = s.pts.length > 1 ? `<path class="line" d="${smoothPath(coords)}" stroke="${s.m.color}" pathLength="1"/>` : '';
    const points = coords.map((c, i) => {
      const p = s.pts[i];
      const isLast = i === s.pts.length - 1;
      const r = isLast ? 5.2 : (i === 0 ? 4.6 : 4);
      const active = state.pin && state.pin.code === s.code && state.pin.date === p.d;
      return `<circle class="pt${active ? ' active' : ''}" cx="${c.x.toFixed(1)}" cy="${c.y.toFixed(1)}" r="${r}" fill="${s.m.color}" data-action="pin" data-code="${s.code}" data-date="${p.d}"/>`;
    }).join('');
    const lp = lastPos.find((x) => x.s === s);
    const nearRight = lp.x > CX1 - 44;
    const lx = nearRight ? lp.x - 8 : lp.x + 8;
    const label = state.toggles.keypoints
      ? `<text class="delta-tag" x="${lx.toFixed(1)}" y="${(lp.ly + 4).toFixed(1)}" text-anchor="${nearRight ? 'end' : 'start'}" fill="${s.m.color}">${fmtNum(lp.v, s.m.dec)}</text>` : '';
    return `<g>${path}${points}${label}</g>`;
  }).join('');

  const ticks = monthTicks(t0, t1).map((t) => `<line class="axis" x1="${t.x.toFixed(1)}" x2="${t.x.toFixed(1)}" y1="${CY1}" y2="${CY1 + 5}"/><text class="tick" x="${t.x.toFixed(1)}" y="${CY1 + 18}" text-anchor="middle">${t.label}</text>`).join('');
  const rowLabels = state.toggles.treatment
    ? `<text x="6" y="34" font-size="9" fill="#8fa1b5">周期</text><text x="6" y="68" font-size="9" fill="#8fa1b5">评估</text>`
    : '';

  return `<svg class="chart" viewBox="0 0 ${CW} ${CH}" role="img" aria-label="所选指标的时序图，共 ${series.length} 条序列">
    ${grid}${ticks}${markLines}${strip}${rowLabels}${lines}
    <text class="tick" x="${CX0}" y="${CY1 + 36}">各序列按自身全部记录的最小值–最大值归一化，不代表数值可比</text>
  </svg>`;
}

const pageHead = (sub) => `<div class="page-head"><div><h1>${esc(PAGES.find(p => p[0] === state.view)[1])}</h1><p>${esc(SUBTITLES[state.view])}</p></div></div>${sub ? `<div class="subnav" role="tablist">${SUBPAGES[state.view].map((s, i) => `<button role="tab" aria-selected="${(state.sub[state.view] || 0) === i}" data-sub="${i}">${esc(s)}</button>`).join('')}</div>` : ''}`;
const row = (b, p, right = '') => `<div class="row"><div class="row-main"><div><b>${b}</b>${p ? `<p>${p}</p>` : ''}</div></div>${right}</div>`;
const pill = (t, c = '') => `<span class="pill ${c}">${esc(t)}</span>`;

/* ---------------- views ---------------- */
function vDashboard() {
  const p = P(), m = M();
  const next = p.rhythm[0];
  const alertNext = `<div class="alert-strip"><div><b>下一次节点：${esc(next[0])}</b><p>${esc(next[3])}</p></div><button class="soft" data-action="go-review">看监测节奏</button></div>`;
  const tasks = [];
  if (p.stoma) tasks.push(['stoma', '今天的造口日记', '三键记录：用品 / 皮肤 / 排泄，约 30 秒', 'go-stoma']);
  tasks.push(['records', '报告看不懂？先理资料', '上传 → 解析 → 核对 → 入库，原件始终保留', 'go-records']);
  tasks.push(['review', '准备下次复诊清单', '想问的事 + 我的看法，两区分开导出', 'go-review']);
  tasks.push(['labs', '本周期检验结果', '第 2 周期血象已录入', 'go-labs']);
  const taskCards = tasks.map(t => `<button class="task-entry" data-action="${t[3]}"><span class="entry-icon">${icon(t[0])}</span><b>${t[1]}</b><span>${t[2]}</span><span class="arrow">›</span></button>`).join('');
  const rhythm = `<div class="card"><div class="card-head"><h2>监测节奏（按 ${esc(p.stage)} 取值）</h2><span class="source-link">NCCN 2025 · CSCO 2025</span></div>
    ${p.rhythm.map(r => row(`<b>${r[0]}</b>`, `${r[1]} — ${r[2]}`, `<small>${esc(r[3])}</small>`)).join('')}
    <p class="small-note">以上为指南常见节奏摘录，仅供准备讨论；实际安排以你的医生为准。</p></div>`;
  const cards = (DASH_KEYS[state.profile] || []).filter(k => m[k]).map(k => mcard(k, m[k])).join('');
  return `<div class="page-enter">${pageHead()}
  <div class="hero"><div><span class="eyebrow">当前情况</span><h1>${esc(p.headline)}</h1><p>${esc(p.mindset)}</p>
    <div class="actions"><button class="primary" data-action="go-timeline">看病情一图秀</button><button class="soft" data-action="go-subtype">我的分子分型</button></div></div>
    <div class="hero-mascot" aria-hidden="true"><span style="font-size:56px">🫂</span></div></div>
  ${alertNext}
  <div class="intent"><i>✓</i><span>工作台只做<b>记录与整理</b>；诊断、方案调整由医生决定。页面里全部资料为<b>演示数据</b>。</span></div>
  <div class="section-title"><h2>接下来可以做的事</h2></div>
  <div class="task-grid">${taskCards}</div>
  <div class="dash-cols"><div class="stack">${rhythm}
    <div class="card"><div class="card-head"><h2>指南不推荐常规做</h2></div>
      ${row('<b>ctDNA / MRD</b>', 'NCCN 2025：不常规推荐用于复发监测（仅临床试验场景）。不设趋势、不进待办。')}
      ${row('<b>PET-CT</b>', '不常规用于复发筛查；仅在医生针对具体情况安排时使用。')}
      <p class="small-note">看到这两项检查的宣传或焦虑信息时，可在这里回看，避免过度检查。</p></div></div>
  <div class="stack"><div class="card"><div class="card-head"><h2>最近指标</h2><span class="source-link">轻点卡片翻面</span></div>
    <div class="metric-grid">${cards}</div></div></div></div></div>`;
}

function vSubtype() {
  const p = P();
  const matrix = p.molecular.map(x => `<div class="row"><div class="row-main"><div><b>${esc(x.k)}</b><p>${esc(x.note)}</p></div></div>
    <div style="text-align:right">${pill(x.v, x.state === 'ok' ? 'green' : x.state === 'warn' ? 'yellow' : 'grey')}<small style="display:block;margin-top:4px">${esc(x.src)}</small></div></div>`).join('');
  const lynch = p.lynch ? `<div class="card accent"><div class="card-head"><h2>${esc(p.lynch.title)}</h2>${pill('只记录安排，不做筛查建议', 'violet')}</div>
    ${p.lynch.rows.map(r => row(`<b>${esc(r[1])}</b>`, esc(r[2]), `<small>${esc(r[0])}</small>`)).join('')}</div>` : '';
  return `<div class="page-enter">${pageHead(true)}
  <div class="subtype-hero"><div><span class="code">病理与分期档案</span><h2>${esc(p.stage)}</h2><span class="en">${esc(p.path[0])} · 依据：病理报告原件（已归档）</span>
    <div class="subtype-meta">${p.path.map(s => pill(s, 'violet')).join('')}</div></div>
    <div class="path-tree">${p.path.map((s, i) => `<div class="${i === 0 ? 'on' : ''} ${i > 0 ? 'lv' + Math.min(i, 3) : ''}">${esc(s)}</div>`).join('')}</div></div>
  <div class="section-title"><h2>分子分型矩阵</h2><span class="source-link">未检测 ≠ 阴性</span></div>
  <div class="card">${matrix}<p class="small-note">矩阵里每一项独立成立：未检测的项目原样显示"未检测"，不补成阴性；每项可在原件里回溯。</p></div>
  ${lynch ? `<div class="section-title"><h2>遗传筛查</h2></div>${lynch}` : ''}
  <div class="section-title"><h2>会诊与二次意见</h2></div>
  <div class="card">${row('<b>2026-08-30 · 肿瘤科</b>', '制定辅助/转化方案；记录医生原话要点。', pill('已存档', 'green'))}
  ${row('<b>2026-09-05 · 营养科</b>', p.stoma ? '造口饮食过渡指导；记录要点。' : '治疗期营养指导；记录要点。', pill('已存档', 'green'))}</div></div>`;
}

function vTreatment() {
  const p = P();
  const lines = p.lines.map((l, i) => `<button class="line-chip" aria-pressed="${i === 0}">${esc(l.name)}</button>`).join('');
  const cycles = `<div class="table-wrap"><table class="cycle-table"><thead><tr><th>周期</th><th>日期</th><th>用药</th><th>状态</th></tr></thead><tbody>
    ${p.cycles.map(c => `<tr class="${c[4] ? 'done' : 'next'}"><td><b>${esc(c[0])}</b></td><td class="num">${esc(c[1])}</td><td>${esc(c[2])}</td><td>${pill(c[3], c[4] ? 'green' : 'violet')}</td></tr>`).join('')}</tbody></table></div>
    <p class="small-note">周期记录来自出院小结与输液记录原件；更正只新增版本，不覆盖旧记录。</p>`;
  const resect = p.resect ? `<div class="section-title"><h2>${esc(p.resect.title)}</h2></div><div class="card">
    <p class="small-note" style="margin-top:0">影像评估与外科结论分列留痕；每次评估都是新记录，不改写历史。</p>
    ${p.resect.rows.map(r => row(`<b>${esc(r[0])}</b>`, esc(r[1]), `<small style="max-width:220px;text-align:right">${esc(r[2])}</small>`)).join('')}</div>` : '';
  return `<div class="page-enter">${pageHead(true)}
  <div class="line-strip">${lines}<button class="line-chip" data-action="add-line">+ 治疗线</button></div>
  <div class="plan-card"><div><span class="eyebrow">当前方案</span><div class="big">${esc(p.lines[0].name)}<small>${esc(p.lines[0].detail)}</small></div>
    <div class="progress"><i style="width:${Math.round(p.cycles.filter(c => c[4]).length / Math.max(p.cycles.length, 1) * 100)}%"></i></div></div>
    <button class="primary" data-action="go-timeline">与指标对照</button></div>
  <div class="section-title"><h2>周期与用药</h2></div><div class="card">${cycles}</div>${resect}</div>`;
}

function vStoma() {
  const p = P();
  if (!p.stoma) return `<div class="page-enter">${pageHead(true)}
    <div class="empty"><h3>本档案没有造口记录</h3><p>王女士当前为转化治疗路径，未行造口。如后续手术方式变化，可在这里建档。</p>
    <div class="actions" style="justify-content:center"><button class="soft" data-action="go-labs">去看检查与指标</button></div></div>
    <div class="section-title"><h2>LARS 自查</h2></div>
    <div class="empty"><p>无 LARS 自查记录。LARS 适用于保肛术后排便功能自查；如医生安排相关评估，会出现在这里。</p></div></div>`;
  const s = p.stoma;
  const diary = s.diary.map(d => row(`<b>${esc(d[0])} · ${esc(d[1])}：${esc(d[2])}</b>`, esc(d[3]), '')).join('');
  const lars = p.lars.map(l => `<div class="dv on"><span>${esc(l.d)} 自查</span><b>${l.score}</b><p>${esc(l.band)}（0–42 分）</p></div>`).join('');
  return `<div class="page-enter">${pageHead(true)}
  <div class="ww-hero"><span class="eyebrow">造口档案</span><div class="big">${esc(s.type)}</div>
    <p>${esc(s.site)} · ${esc(s.date)} 手术。还纳计划：${esc(s.plan)}。当前用品：${esc(s.supplies)}。</p>
    <div class="actions"><button class="primary" data-action="add-diary">记一条（30 秒）</button><button class="soft" data-action="export-stoma">就诊时展示</button></div></div>
  <div class="section-title"><h2>三键日记</h2><span class="source-link">漏记不催不补</span></div>
  <div class="card">${diary}</div>
  <div class="section-title"><h2>求助门槛清单</h2></div>
  <div class="notice warn"><b>出现以下情况建议尽快联系造口门诊或主管医生：</b><div class="flag-list">${s.thresholds.map(t => `<div>${esc(t)}</div>`).join('')}</div>
  <p class="small-note">这份清单来自造口护理常规资料（原件已归档）；它不判断你现在的情况，只帮你识别何时求助。</p></div>
  <div class="section-title"><h2>LARS 排便功能自查</h2><span class="source-link">自查记录，不是医生评估</span></div>
  <div class="card"><div class="dv-row">${lars}</div><p class="small-note">LARS 评分 0–42：0–20 无／轻度，21–29 中度，30–42 重度；这里只存自查结果与日期。</p></div></div>`;
}

function vLabs() {
  const p = P();
  const img = p.resect ? row('<b>2026-10-09 · 胸腹盆增强 CT</b>', '肝转移灶 2 枚较前缩小；原文已归档。', pill('PR', 'green')) : row('<b>2026-10-12 · 胸腹盆 CT</b>', '术后改变，未见明确复发征象（影像原文为准）。', pill('已归档', 'green'));
  return `<div class="page-enter">${pageHead(true)}${metricSections()}
  <div class="section-title"><h2>影像评估</h2></div><div class="card">${img}</div>
  <p class="small-note">指标卡轻点翻面看参考区间与口径说明；分类记录（神经毒性、尿蛋白等）不翻面、不连线。</p></div>`;
}

function vTimeline() {
  const m = M();
  const [t0, t1] = domain();
  const series = state.sel.filter((c) => m[c]).map((c) => seriesFor(c, t0, t1)).filter((s) => s.pts.length);
  const groups = CAT_ORDER.map((cat) => ({ cat, codes: Object.keys(m).filter((k) => m[k].cat === cat) })).filter((g) => g.codes.length);
  const pinData = state.pin && m[state.pin.code] ? m[state.pin.code].points.find((p) => p.d === state.pin.date) : null;
  const [bs, be] = dataBounds();
  const rng = `${shortDate(new Date(bs).toISOString().slice(0, 10))} – ${shortDate(new Date(be).toISOString().slice(0, 10))}`;
  return `<div class="page-enter">${pageHead(true)}
  <div class="chips" style="margin:0 0 14px" aria-label="时间范围">${[['3m', '近 3 月'], ['6m', '近 6 月'], ['12m', '近 12 月'], ['all', '全期']].map(([k, l]) => `<button class="chip" aria-pressed="${state.range === k}" data-action="range" data-range="${k}">${l}</button>`).join('')}</div>
  <div class="overview">
    <aside class="rail" aria-label="筛选与指标选择">
      <details class="pick" ${state.sel.length && (typeof window !== 'undefined' && window.innerWidth > 900 ? 'open' : '')}>
        <summary>选择指标 <small>最多 4 个 · 已选 ${state.sel.length}</small></summary>
        <div class="metric-list">
          ${groups.map((g) => `<div class="cat-label">${esc(g.cat)}</div>${g.codes.filter((c) => numPts(m[c]).length).map((c) => `<label class="metric-pick"><input type="checkbox" ${state.sel.includes(c) ? 'checked' : ''} data-pick="${c}"><i style="background:${m[c].color}"></i><span>${esc(m[c].name)}</span><small>${numPts(m[c]).length} 次</small></label>`).join('')}`).join('')}
        </div>
      </details>
      <section><h3>显示</h3>
        <div class="chips">
          <button class="chip" aria-pressed="${state.toggles.treatment}" data-action="toggle" data-key="treatment">治疗节点</button>
          <button class="chip" aria-pressed="${state.toggles.keypoints}" data-action="toggle" data-key="keypoints">末点数值</button>
        </div>
      </section>
      <section><h3>时间窗缩放</h3>
        <div class="zoom"><input type="range" min="40" max="100" value="${state.zoom}" data-action="zoom" aria-label="时间窗缩放"><span>${state.zoom}%</span></div>
        <p class="small-note">右端锚定最新记录；40% 表示只看最近四成时间。</p>
      </section>
      <section><h3>口径</h3><p class="small-note">每条线按该指标全部记录的最小值–最大值归一化，只用于同屏回顾，不能比较不同指标的绝对值；换医院、换方法的结果以来源标注区分。</p></section>
    </aside>
    <div class="timeline-main">
      <div class="chart-panel">
        <div class="chart-top">
          <div><h2 style="font-size:15px">${series.length} 条序列 · ${state.range === 'all' ? '全期' : '近 ' + state.range.replace('m', ' 月')}</h2><p class="small-note">点击数据点固定详情；治疗条与数据区分离，不压曲线。</p></div>
          <span class="pill grey">${rng}</span>
        </div>
        <div class="legend">${series.map((s) => `<span><i style="background:${s.m.color}"></i><b>${esc(s.m.name)}</b><span class="range">${fmtNum(s.lo, s.m.dec)}–${fmtNum(s.hi, s.m.dec)} ${esc(s.m.unit)}</span></span>`).join('')}</div>
        <p class="scroll-hint small-note">图表可左右滑动</p>
        <div class="chart-wrap">${chartSVG(t0, t1)}</div>
        ${pinData ? `<div class="pin"><div><b>${esc(m[state.pin.code].name)} · ${fmtNum(pinData.v, m[state.pin.code].dec)} ${esc(m[state.pin.code].unit)}</b><p>${esc(longDate(pinData.d))} · 来源：${esc(pinData.src)}</p></div><button class="icon-button" data-action="unpin" aria-label="关闭详情">×</button></div>` : ''}
      </div>
      <div class="section-title"><h2>指标卡片</h2><span class="source-link">点一张卡翻到背面；每张卡互不影响</span></div>
      ${groups.map((g) => `<div class="metric-group"><div class="metric-group-head"><h3>${esc(g.cat)}</h3><span>${g.codes.length} 项</span></div><div class="metric-grid">${g.codes.map((k) => mcard(k, m[k])).join('')}</div></div>`).join('')}
    </div>
  </div></div>`;
}

function vNutrition() {
  const m = M(), p = P();
  return `<div class="page-enter">${pageHead(true)}
  <div class="hero" style="grid-template-columns:minmax(0,1fr)"><div><span class="eyebrow">进食与体重</span><h1>吃得下、吃得够，就是这一阶段最重要的事</h1><p>工作台只记录体重、白蛋白/前白蛋白与你的饮食笔记，不计算每一口，也不提供营养处方。</p>
  <div class="actions"><button class="primary" data-action="add-meal">记一笔饮食</button><button class="soft" data-action="go-labs">看营养指标</button></div></div></div>
  <div class="dash-cols"><div class="stack">
    <div class="card"><div class="card-head"><h2>体重 / 白蛋白 / 前白蛋白</h2><span class="source-link">数值线 · 翻面看参考区间</span></div>
      <div class="metric-grid">${mcard('wt', m.wt)}${m.alb ? mcard('alb', m.alb) : ''}${m.pa ? mcard('pa', m.pa) : ''}</div></div>
    <div class="card"><div class="card-head"><h2>饮食笔记</h2></div>
      ${p.nutritionNotes.map(n => row(`<b>${esc(n[0])}</b>`, esc(n[1]))).join('')}
      <p class="small-note">只记"吃了什么、身体反应"，不做食材替换建议。</p></div></div>
  <div class="stack"><div class="card"><div class="card-head"><h2>运动与生活</h2><span class="source-link">NCCN 2025 已纳入辅助治疗原则</span></div>
    ${row('<b>本周活动</b>', esc(p.activity))}
    ${row('<b>补充剂 / 其他用药</b>', '只记医嘱原文与起止，工作台不做推荐。', pill('无在用', 'grey'))}
    <p class="small-note">运动以你能承受的强度为准；是否调整由医生或康复师决定。</p></div></div></div></div>`;
}

function vMind() {
  const p = P();
  const feels = p.viewpoints.filter(v => v[1] !== '身体形象');
  const body = p.viewpoints.find(v => v[1] === '身体形象');
  return `<div class="page-enter">${pageHead(true)}
  <div class="notice violet">这里的内容<b>默认私密</b>：不进导出、不进看板摘要；只有你显式开放时才会出现在就诊材料里。</div>
  <div class="dash-cols"><div class="stack">
    <div class="card"><div class="card-head"><h2>当下感受</h2>${pill('私密', 'violet')}</div>
      ${feels.map(v => row(`<b>${esc(v[0])} · ${esc(v[1])}</b>`, esc(v[2]), pill('不是医生结论', 'grey'))).join('')}
      <div class="actions"><button class="soft" data-action="add-viewpoint">记一条感受</button></div></div></div>
  <div class="stack"><div class="card"><div class="card-head"><h2>身体形象与社交</h2>${pill('私密', 'violet')}</div>
      ${body ? row(`<b>${esc(body[0])}</b>`, esc(body[2])) : row('<b>暂无记录</b>', '愿意的时候再写；这条只属于你。')}
      <p class="small-note">这些记录只属于你；是否与家人、医生分享由你决定。</p></div>
    <div class="card"><div class="card-head"><h2>想对家人说 / 家庭沟通</h2></div>
      ${row('<b>待沟通</b>', esc(p.familyTalk))}</div></div></div></div>`;
}

function vReview() {
  const p = P();
  const qs = [
    ['下次想问的事', ['辅助治疗要满 6 个周期吗？剂量调整过会影响效果吗？', '肠镜复查是术后 1 年做，还是提前？', p.stoma ? '造口还纳的评估时间和条件？' : '肝转移灶如果可以切除，手术方式和恢复期？']],
    ['我的看法（不是医生结论）', ['我觉得化疗反应可控，能按计划进行。', '希望尽量在本地复查，减少往返。']]
  ];
  return `<div class="page-enter">${pageHead(true)}
  <div class="section-title"><h2>监测节奏（${esc(p.stage)}）</h2><span class="source-link">NCCN 2025 · CSCO 2025</span></div>
  <div class="card">${p.rhythm.map(r => row(`<b>${r[0]}</b>`, `${r[1]} — ${r[2]}`, `<small>${esc(r[3])}</small>`)).join('')}
  <p class="small-note"> ctDNA / PET-CT 指南不推荐常规使用，本页不设提醒。节奏摘录仅供准备讨论，实际以医生安排为准。</p></div>
  <div class="dash-cols"><div class="stack"><div class="card"><div class="card-head"><h2>想问的事</h2><span class="source-link">导出时不合并</span></div>
    ${qs[0][1].map((q, i) => row(`<b>${i + 1}. ${esc(q)}</b>`, '', `<button class="text-button" data-action="toggle-ask" data-i="${i}">已问过 ✓</button>`)).join('')}</div></div>
  <div class="stack"><div class="card"><div class="card-head"><h2>我的看法</h2>${pill('不是医生结论', 'grey')}</div>
    ${qs[1][1].map(q => row(`<b>${esc(q)}</b>`, '')).join('')}
    <p class="small-note">你的判断按"一条信息"记录，会与事实区明确分开，不进趋势、不进摘要事实。</p></div>
  <div class="card"><div class="card-head"><h2>就诊准备</h2></div>
    <div class="actions"><button class="primary" data-action="export-review">生成 Markdown（预览）</button><button class="soft" data-action="go-trials">浏览临床研究线索</button></div>
    <p class="small-note">导出分两区（事实 / 想问与看法），私密条目默认不含。</p></div></div></div></div>`;
}

function vTrials() {
  const saved = new Set(state.saved);
  const list = TRIALS.map(t => `<div class="saved-item"><b>${esc(t.title)}</b>
    <p>${esc(t.phase)} · ${esc(t.status)} · 申办：${esc(t.sponsor)}</p>
    <small>NCT ${esc(t.id)} · 含中国中心 · <a href="${t.url}" target="_blank" rel="noopener">登记页原文 ↗</a></small>
    <div class="actions" style="margin-top:8px">${pill('登记摘录 · 状态未核实', 'yellow')}<button class="soft" data-action="save-trial" data-id="${t.id}">${saved.has(t.id) ? '已收藏 ✓' : '收藏'}</button><button class="text-button" data-action="ask-trial" data-id="${t.id}">加入入组问题</button></div></div>`).join('');
  return `<div class="page-enter">${pageHead(true)}
  <div class="notice plain"><b>这是 2026 年首次公示研究的本地资料摘录</b>（ClinicalTrials.gov，采集于 2026-10-18；中国注册库本轮未采集）。线索不排序、不推荐、不预测获益；入组资格以研究中心答复为准。</div>
  <div class="toolbar"><div class="chips"><button class="chip" aria-pressed="true">全部 ${TRIALS.length}</button><button class="chip" aria-pressed="false">招募中</button><button class="chip" aria-pressed="false">含中国中心</button></div>
    <input type="search" placeholder="搜索标题 / 药物 / NCT 号（原型内不生效）" aria-label="搜索"></div>
  ${list}
  <div class="section-title"><h2>入组问题清单</h2></div>
  <div class="card">${state.questions ? state.questions.map(q => row(`<b>${esc(q)}</b>`, '')).join('') : '<div class="empty" style="margin-top:0"><p>还没有添加问题。点任意试验的「加入入组问题」，把想问研究中心的问题先写在这里。</p></div>'}</div></div>`;
}

/* ---------------- 病情整理（records）：上传 → 解析 → 确认指标 → 入库 ---------------- */
function flowSteps(cur) {
  const steps = ['文件上传', '文件解析', '确认指标', '导入数据库'];
  return `<div class="flow-steps">${steps.map((s) => `<span class="${s === cur ? 'on' : ''}">${s}</span>`).join('<span class="fs-arrow">→</span>')}</div>`;
}
function docsTable() {
  const docs = DOCS[state.profile].filter((d) => !state.query || d.name.includes(state.query) || d.type.includes(state.query));
  return `<div class="table-wrap"><table><thead><tr><th>材料名称</th><th>日期</th><th>类型</th><th>整理状态</th><th>操作</th></tr></thead><tbody>
    ${docs.map((d) => `<tr><td><b>${esc(d.name)}</b><br><small>模拟资料 · 无真实文件</small></td><td>${esc(d.date)}</td><td>${esc(d.type)}</td>
      <td>${pill(d.status, d.status === '已核对' ? 'green' : 'yellow')}</td>
      <td><button class="source-link" data-action="source" data-source="${esc(d.name)}">原文</button> ${d.status === '待核对' ? `<button class="source-link" data-action="go-rec-sub" data-sub-i="1">看草稿</button>` : ''}</td></tr>`).join('')}
  </tbody></table></div>${!docs.length ? '<div class="empty"><h3>没有找到这份材料</h3><p>试试「病理」「检验」或清空搜索。</p></div>' : ''}`;
}
function candidateRows() {
  return CANDS[state.profile].map((c) => `<tr><td>${esc(c.name)}</td><td>${esc(c.value)}</td>
    <td><button class="source-link" data-action="source" data-source="${esc(c.source)}">${esc(c.source.split('·').slice(-1)[0].trim())} ↗</button></td>
    <td>${pill(c.status === 'accepted' ? '已核对' : c.status === 'needs_review' ? '需要确认' : '未核对', c.status === 'accepted' ? 'green' : 'yellow')}</td>
    <td><button class="source-link" data-action="candidate" data-id="${esc(c.id)}">查看 / 更正</button></td></tr>`).join('');
}
function pathologyCard() {
  const pa = P().pathology;
  if (!pa) return '';
  return `<div class="grid two">
    <section class="card"><div class="card-head"><h2>${esc(pa.title)}</h2>${pill(pa.status, 'green')}</div>
      <dl style="display:grid;grid-template-columns:104px 1fr;gap:8px 10px;font-size:12.5px;margin:0">
        ${pa.rows.map((r) => `<dt style="color:var(--muted)">${esc(r[0])}</dt><dd style="margin:0">${esc(r[1])}</dd>`).join('')}
      </dl></section>
    <section class="card"><h2>这份档案还缺什么</h2><p>缺项表示尚未录入，不代表需要补做检查。</p>
      ${pa.gaps.map((g) => row(`<b>${esc(g[0])}</b>`, esc(g[1]), pill('待补', 'yellow'))).join('')}
      <button class="source-link" data-action="go-rec-sub" data-sub-i="1">继续整理材料 →</button></section>
  </div>`;
}
function metricSections() {
  const m = M();
  return CAT_ORDER.map((c) => {
    const ks = Object.keys(m).filter((k) => m[k].cat === c);
    if (!ks.length) return '';
    const tag = c === '肿瘤标志物' ? '<span class="source-link">同一实验室可比</span>' : c === '治疗毒性' ? '<span class="source-link">只记原话，不分级</span>' : c === '电解质' ? '<span class="source-link">方案相关关注项</span>' : '';
    return `<div class="section-title"><h2>${c}</h2>${tag}</div><div class="metric-grid">${ks.map((k) => mcard(k, m[k])).join('')}</div>`;
  }).join('');
}
function vRecords() {
  const sub = SUBPAGES.records[state.sub.records || 0]; let body = '';
  if (sub === '资料库') {
    body = `<div class="toolbar"><input aria-label="搜索模拟材料" placeholder="搜索材料名称或类型" value="${esc(state.query)}" data-action="records-search">
      <div class="actions">${pill('全部为模拟数据', 'violet')}<button class="primary" data-action="load-report">载入模拟报告</button><button class="soft" data-action="parse-fail">演示解析失败</button></div></div>
      ${state.parsing ? '<div class="card" role="status">正在解析模拟材料（演示）：上传 → 解析 → 出候选…</div>' : ''}
      ${state.parseError ? `<div class="notice warn">模拟解析失败。材料仍保留在资料库，不产生候选，可重试或手工核对。<button class="source-link" data-action="retry">重试</button></div>` : ''}
      <div class="card" id="docs-table">${docsTable()}</div>
      ${flowSteps('文件解析')}
      <div class="help-box">演示链路：文件上传 → 解析出候选字段 → 在「整理草稿 / 核对」逐项确认 → 接受后才写入数据库。解析失败不产生候选，原件不删、随时可重试；「载入模拟报告」会完整走一遍成功链路。</div>`;
  } else if (sub === '整理草稿 / 核对') {
    const pending = CANDS[state.profile].filter((c) => c.status !== 'accepted').length;
    body = `${flowSteps('确认指标')}
      <div class="notice ${pending ? 'warn' : ''}">${pending ? `整理草稿 · 仍有 ${pending} 项未核对。可以先看轮廓，暂时不处理疑点。` : '整理草稿 · 这一档的候选都已核对。'}</div>
      <div class="card"><div class="card-head"><h2>从材料里抽出来的候选字段</h2><span class="source-link">解析结果 · 候选不是结论</span></div>
      <p>候选只表示"解析读到了这一项"；接受 = 你逐字核对过转录，不等于医学审核。接受后写入演示数据库（record + 事实表），原始候选不覆盖、留版本。</p>
      <div class="table-wrap"><table><thead><tr><th>项目</th><th>材料中的内容</th><th>来源</th><th>状态</th><th>操作</th></tr></thead><tbody>${candidateRows()}</tbody></table></div>
      <div class="actions" style="margin-top:12px"><button class="soft" data-action="go-rec-sub" data-sub-i="0">回到资料库</button><button class="primary" data-action="add-review-question">保留核实问题</button></div></div>
      <div class="help-box">解析失败的文件不会出现在这里（不产生候选）；这里的每一项都能跳回原文出处。</div>`;
  } else if (sub === '病情档案') {
    body = `<div class="notice">不同标本、时间与来源的结果分别保留。不能用一份最新报告覆盖全部历史；未检测不等于阴性。</div>${pathologyCard()}`;
  } else if (sub === '指标检测') {
    body = `<div class="notice">以下为模拟数值。趋势只呈现记录，不代表疗效、复发或诊断判断；不同单位与方法需分开核对。</div>${metricSections()}
      <div class="help-box">点卡片会在原位翻转看参考区间；分类记录（神经毒性、尿蛋白等）不翻面、不连线。</div>`;
  } else {
    const docs = DOCS[state.profile], cands = CANDS[state.profile];
    const checked = cands.filter((c) => c.status === 'accepted').length;
    body = `<div class="grid two">
      <section class="card"><div class="card-head"><h2>就诊摘要预览</h2>${pill('模拟资料', 'violet')}</div>
        <p>范围：${docs.length ? docs[0].date : '—'} 至 2026-10-18 · 本次只预览资料组织与分享选择。</p>
        <div class="row"><div><b>病情与治疗材料</b><p>${docs.length} 份材料，保留各自日期与核对状态（待核对 ${docs.filter((d) => d.status !== '已核对').length} 份）。</p></div></div>
        <div class="row"><div><b>候选字段</b><p>${cands.length} 项中已核对 ${checked} 项；未核对项在导出里保留"未核对"标记。</p></div></div>
        <div class="row"><div><b>准备讨论的问题</b><p>${(state.questions || []).length} 个，可编辑与选择。</p></div></div>
        <div class="notice">心理与「我的看法」默认不进入这份摘要。</div>
        <button class="primary" data-action="export-review">编辑并导出问题清单</button></section>
      <section class="card"><h2>分享之前，再看一眼</h2>
        <p>未核对内容与来源状态在所有格式中都要保留。原型下载只包含主动选择的问题。</p>
        <div class="notice plain" style="margin-top:14px">一期只做 Markdown 导出；PDF/DOCX 等格式需逐格式验收，未实现。</div>
        <details><summary>导出会包含什么</summary><p>资料范围、来源版本、已核对与草稿区分、选入的问题；不含病历原文与私密记录。</p></details></section></div>`;
  }
  return `<div class="page-enter">${pageHead(true)}${body}</div>`;
}

const VIEWS = { dashboard: vDashboard, records: vRecords, subtype: vSubtype, treatment: vTreatment, stoma: vStoma, labs: vLabs, timeline: vTimeline, nutrition: vNutrition, mind: vMind, review: vReview, trials: vTrials };

/* ---------------- agent dock（dsh 原生会话挂载位） ---------------- */
const FORBIDDEN = ['建议治疗', '可能复发', '预后良好', '治愈率', '可以停药', '无需就医', '推荐方案', '生存率'];
const PAGE_CONTEXT = {
  dashboard: () => ({ facts: [`${P().name}：${P().headline}`, '监测节奏卡按分期取值并标注 NCCN 2025 / CSCO 2025 来源'], missing: ['RAS / BRAF / HER2 / PIK3CA 未检测（A 档案）', '下次 CT 具体日期'] }),
  subtype: () => ({ facts: P().molecular.map(x => `${x.k}：${x.v}（${x.src}）`), missing: P().molecular.filter(x => x.state === 'na').map(x => `${x.k} 检测状态`) }),
  treatment: () => ({ facts: P().cycles.map(c => `${c[0]} ${c[1]} ${c[2]}（${c[3]}）`), missing: P().resect ? ['下次 MDT 评估是否手术的具体结论'] : ['第 3 周期起日期'] }),
  stoma: () => ({ facts: P().stoma ? [`造口：${P().stoma.type}（${P().stoma.date}）`, `日记最近一条：${P().stoma.diary[0].join(' · ')}`] : ['本档案无造口'], missing: P().stoma ? ['造口门诊最近一次记录'] : [] }),
  labs: () => ({ facts: Object.values(M()).filter(m => m.points && m.points.length).map(m => `${m.name} 最近：${String(m.points.slice(-1)[0].v)}（${m.points.slice(-1)[0].d}）`), missing: ['CA19-9（A 档案未查）'] }),
  timeline: () => ({ facts: ['一图秀当前勾选：' + state.sel.map(k => M()[k].name).join('、')], missing: [] }),
  nutrition: () => ({ facts: [`体重最近：${M().wt.points.slice(-1)[0].v} kg（${M().wt.points.slice(-1)[0].d}）`], missing: ['营养科随诊记录'] }),
  mind: () => ({ facts: ['本页内容默认私密，提示词不携带具体感受原文'], missing: [] }),
  review: () => ({ facts: P().rhythm.map(r => `${r[0]}：${r[1]}（${r[2]}）`), missing: ['想问清单中 1 条待确认'] }),
  trials: () => ({ facts: ['2026 线索共 ' + TRIALS.length + ' 条（真实登记摘录，状态未核实）'], missing: [] })
};
function buildPrompt() {
  const ctx = PAGE_CONTEXT[state.view]();
  const title = PAGES.find(p => p[0] === state.view)[1];
  return [`【来自小畅宝工作台 · ${title}页】`, `档案：${P().name}（${P().meta}）——演示数据`, '',
    '本页已核对的事实：', ...ctx.facts.map(f => '- ' + f), '',
    '尚未核对 / 待确认：', ...(ctx.missing.length ? ctx.missing.map(f => '- ' + f) : ['- （无）']), '',
    '边界：以上是记录整理，不是医疗建议；请基于原文与医生沟通，不要求工作台外推结论。'].join('\n');
}
function mockReply() {
  return '根据你整理的本页事实：这些记录显示治疗在按计划推进，监测节奏也有依据。你提到的未确认事项（未检测标志物、下次影像日期），适合在下次门诊清单里逐条向医生确认。本回复不构成医疗建议。';
}
function renderAgent() {
  const dock = $('#agent-dock'), grid = $('#work-grid'), btn = $('#agent-toggle');
  dock.hidden = !state.agentOpen;
  grid.classList.toggle('agent-open', state.agentOpen);
  grid.classList.toggle('agent-wide', state.agentOpen && state.agentSize === 'wide');
  btn.setAttribute('aria-expanded', String(state.agentOpen));
  $('#agent-state').textContent = state.agentOpen ? '已打开' : '未进入激活';
  $('#agent-toggle i').classList.toggle('grey', !state.agentOpen);
  $('#agent-toggle i').classList.toggle('on', state.agentOpen);
  $('#agent-dot').classList.toggle('on', state.agentOpen);
  $$('.agent-sizes button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.size === state.agentSize)));
  const body = $('#agent-body');
  if (!body.dataset.built) {
    body.innerHTML = `<div class="agent-note"><b>dsh 原生会话挂载位</b><br>原生会话仅在 DSH Desktop 内可用；当前为浏览器预览，这里保留宿主会话的挂载点（#dsh-conversation-slot），不模拟聊天窗口。</div>
      <div id="dsh-conversation-slot" aria-live="polite"></div>`;
    body.dataset.built = '1';
  }
}
function agentBuild() {
  const slot = $('#dsh-conversation-slot');
  slot.innerHTML = `<div class="agent-card"><h4>提示词预览（发送前可读 · 由你在宿主会话发送）</h4><pre>${esc(buildPrompt())}</pre></div>`;
}
function agentDemo() {
  const slot = $('#dsh-conversation-slot');
  const text = mockReply();
  const hits = FORBIDDEN.filter(w => text.includes(w));
  slot.innerHTML = `<div class="agent-card"><h4>模拟回复 · 红线自检</h4><pre>${esc(text)}</pre>
    <div class="agent-check">${hits.length ? hits.map(h => `<span class="hit">命中禁用词：${esc(h)}</span>`).join('') : '<span class="pass">✓ 未命中禁用词表（' + FORBIDDEN.length + ' 项）</span><span class="pass">✓ 免责语句在否定语境中出现</span>'}</div></div>`;
}

/* ---------------- dialogs / toast ---------------- */
let toastTimer;
function toast(msg) { const t = $('#toast'); t.textContent = msg; t.classList.add('visible'); clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove('visible'), 2200); }
function openDialog(eyebrow, title, body, foot = '') {
  $('#dialog-eyebrow').textContent = eyebrow; $('#dialog-title').textContent = title;
  $('#dialog-body').innerHTML = body; $('#dialog-foot').innerHTML = foot;
  $('#dialog').showModal();
}
const closeDialog = () => $('#dialog').close();

function dlgProfiles() {
  openDialog('小畅宝', '切换演示档案', Object.entries(PROFILES).map(([k, p]) => `
    <button class="profile-row ${state.profile === k ? 'on' : ''}" data-pick-profile="${k}">
      <div><b>${esc(p.name)}的资料</b><p>${esc(p.meta)} · ${esc(p.headline)}</p></div><span class="profile-caret">${state.profile === k ? '当前' : '切换'}</span></button>`).join(''),
    '<button data-action="close">取消</button>');
}
function dlgSettings() {
  openDialog('小畅宝', '设置', `<div class="cfg-tabs" role="tablist">
  <button role="tab" aria-selected="true" data-action="cfg-tab" data-tab="ws">资料目录</button><button role="tab" aria-selected="false" data-action="cfg-tab" data-tab="parse">文档解析</button><button role="tab" aria-selected="false" data-action="cfg-tab" data-tab="kb">临床数据库</button></div>
  <div class="cfg-block" style="margin-top:16px" data-tab="ws"><h3>工作区资料目录</h3><div class="path-row"><code>~/Documents/ColopalWorkspace（演示值）</code><button class="soft">选择…</button></div>
  <p class="small-note">患者数据只存入你明确选择的目录；工作台不把资料上传云端。</p></div>
  <div class="cfg-block" style="margin-top:12px" data-tab="parse" hidden><h3>文档解析（MinerU）</h3><div class="token-row"><code class="masked">MINERU_TOKEN 已配置（掩码：mr-****）</code></div>
  <p class="small-note">Token 只存本机 .secrets/（mode 600）；解析结果永远是候选，核对后才入档。</p></div>
  <div class="cfg-block" style="margin-top:12px" data-tab="kb" hidden><h3>2026 临床数据库</h3><div class="path-row"><code>colorectal_cancer_trials_2026.sqlite · 480 条（演示）</code></div>
  <p class="small-note">离线快照；中国注册库未采集，覆盖未知。</p></div>`, '<button class="primary" data-action="close">完成</button>');
}
function dlgAbout() {
  openDialog('小畅宝', '关于', `<div class="about"><div class="brand no-mark" style="zoom:2.2"></div><div class="about-meta">
    <div class="about-ver"><b>v${APP_INFO.version}</b>${pill(APP_INFO.channelLabel, 'violet')}</div>
    <dl><div><dt>构建</dt><dd>${APP_INFO.build}</dd></div><div><dt>形态</dt><dd>交互原型（单机多文件）· 全部患者数据为模拟</dd></div>
    <div><dt>数据</dt><dd>2026 临床试验：真实登记摘录（ClinicalTrials.gov），状态未核实</dd></div>
    <div><dt>家族</dt><dd>小 X 宝家族 · Colopal 小畅宝（品牌占位名）</dd></div></dl></div></div>`, '<button class="primary" data-action="close">关闭</button>');
}
function dlgHelp() {
  openDialog('小畅宝', '原型操作说明', `<div class="cfg-block">顶栏「AI 对话」按钮打开右侧<b>原生会话挂载位</b>（可 × 隐藏、窄/标准/宽三档）。「整理本页要点」生成发送前可读的提示词；「模拟回复自检」演示文本层红线扫描。</div>
  <div class="cfg-block" style="margin-top:12px">「检查与指标」「看板」里的数值卡<b>轻点翻面</b>看参考区间；分类记录（神经毒性、尿蛋白）不翻面、不连线。「病情一图秀」左侧可勾选指标、拖动缩放。</div>
  <div class="cfg-block" style="margin-top:12px">左上角头像可切换<b>两个演示档案</b>：陈先生（ⅢB 术后 · 造口 · dMMR）、王女士（Ⅳ 期转化 · 贝伐监测）。</div>`, '<button class="primary" data-action="close">知道了</button>');
}
function dlgExport() {
  const p = P();
  const md = ['# 复诊准备（演示导出）', '', `档案：${p.name}（${p.meta}）`, '', '## 事实区（已核对）', ...p.rhythm.map(r => `- ${r[0]}：${r[1]}（${r[2]}）`), '', '## 想问的事 / 我的看法（不是医生结论）', '- （按页面勾选结果导出；私密条目默认不含）', '', '> 本文件由工作台整理，不构成医疗建议。'].join('\n');
  openDialog('小畅宝', '导出预览（Markdown）', `<div class="agent-card"><pre>${esc(md)}</pre></div><p class="small-note">导出分两区；「我的看法」永远带"不是医生结论"标注。</p>`, '<button class="soft" data-action="close">取消</button><button class="primary" data-action="close">保存到资料目录</button>');
}

/* ---------------- render root ---------------- */
/* 数字刷动：渲染后从 0 滚动到目标值（easeOutCubic，650ms；reduced-motion 直接显示终值） */
function animateCountups(root) {
  if (!root || typeof root.querySelectorAll !== 'function' || typeof requestAnimationFrame !== 'function') return;
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const DUR = 650;
  root.querySelectorAll('[data-countup]').forEach((el) => {
    const target = parseFloat(el.dataset.countup);
    if (!isFinite(target)) return;
    const dec = el.dataset.dec === undefined ? 1 : +el.dataset.dec;
    const t0 = performance.now();
    const step = (t) => {
      const k = Math.min(1, (t - t0) / DUR);
      const ease = 1 - Math.pow(1 - k, 3);
      el.textContent = (target * ease).toFixed(dec);
      if (k < 1) requestAnimationFrame(step); else el.textContent = target.toFixed(dec);
    };
    el.textContent = (0).toFixed(dec);
    requestAnimationFrame(step);
  });
}

function render() {
  const p = P();
  $('#nav').innerHTML = PAGES.map(([id, label, ic]) => {
    const count = id === 'trials' ? TRIALS.length : id === 'stoma' && !p.stoma ? 0 : null;
    return `<button class="nav-button" data-nav="${id}" ${state.view === id ? 'aria-current="page"' : ''}>${icon(ic)}<span>${esc(label)}</span>${count ? `<span class="nav-count">${count}</span>` : ''}</button>`;
  }).join('');
  $('#breadcrumb').textContent = PAGES.find(x => x[0] === state.view)[1];
  $('#profile-name').textContent = `${p.name}的资料`;
  $('#profile-meta').textContent = p.meta;
  $('#profile-avatar').textContent = p.name[0];
  $('#main').innerHTML = (VIEWS[state.view] || vDashboard)();
  $('#main').classList.remove('page-enter');
  animateCountups($('#main'));
  renderAgent();
  if (state.agentOpen) $('#agent-body').dataset.built = ''; // 换页后重建挂载位提示
}

/* ---------------- events ---------------- */
document.addEventListener('click', (e) => {
  const nav = e.target.closest('[data-nav]');
  if (nav) { state.view = nav.dataset.nav; location.hash = state.view; render(); $('#main').focus({ preventScroll: true }); window.scrollTo(0, 0); return; }
  const sub = e.target.closest('[data-sub]');
  if (sub) { state.sub[state.view] = +sub.dataset.sub; render(); return; }
  const pick = e.target.closest('[data-pick]');
  if (pick) {
    const k = pick.dataset.pick;
    if (pick.checked) {
      if (state.sel.length >= 4) { pick.checked = false; toast('最多同时看 4 个指标；取消一个再加。'); return; }
      if (!state.sel.includes(k)) state.sel.push(k);
    } else {
      if (state.sel.length === 1) { pick.checked = true; toast('至少留一个指标。'); return; }
      state.sel = state.sel.filter(x => x !== k);
    }
    render(); return;
  }
  const pp = e.target.closest('[data-pick-profile]');
  if (pp) { state.profile = pp.dataset.pickProfile; state.sel = defaultSel(pp.dataset.pickProfile); state.pin = null; closeDialog(); render(); toast(`已切换到 ${P().name}的资料（演示）`); return; }
  const act = e.target.closest('[data-action]')?.dataset.action;
  if (!act) return;
  const map = {
    profiles: dlgProfiles, settings: dlgSettings, about: dlgAbout, help: dlgHelp,
    close: closeDialog, 'open-store': () => toast('资料目录已激活（演示）'),
    'go-review': () => { state.view = 'review'; location.hash = 'review'; render(); },
    'go-stoma': () => { state.view = 'stoma'; location.hash = 'stoma'; render(); },
    'go-labs': () => { state.view = 'labs'; location.hash = 'labs'; render(); },
    'go-timeline': () => { state.view = 'timeline'; location.hash = 'timeline'; render(); },
    'go-subtype': () => { state.view = 'subtype'; location.hash = 'subtype'; render(); },
    'go-trials': () => { state.view = 'trials'; location.hash = 'trials'; render(); },
    'go-records': () => { state.view = 'records'; location.hash = 'records'; render(); },
    'go-rec-sub': (el) => { state.view = 'records'; state.sub.records = +el.dataset.subI; location.hash = 'records'; render(); },
    source: (el) => openDialog('小畅宝', '原文出处', `<p style="font-size:12.5px">${esc(el.dataset.source)}</p><p class="small-note">原件存放在你选的资料目录 imports/ 下（演示：不展示文件内容）。工作台不改动原文，也不替你解释它。</p>`, '<button class="primary" data-action="close">关闭</button>'),
    'load-report': () => {
      if (state.parsing) return;
      if (state.loaded[state.profile]) { toast('模拟报告已载入，没有重复新增'); return; }
      state.parsing = true; state.parseError = false; render();
      setTimeout(() => {
        DOCS[state.profile].push({ id: 'dx' + state.profile, name: '复查记录 · 新模拟报告', date: '2026-10-18', type: '其他', status: '待核对' });
        CANDS[state.profile].push({ id: 'cx' + state.profile, name: '下次随访安排', value: '2027-01 前后（示例，以医生安排为准）', source: '复查记录 · 新模拟报告 · 第 1 页', status: 'candidate' });
        state.loaded[state.profile] = true; state.parsing = false;
        if (state.view === 'records') render();
        toast('解析完成：候选已放入「整理草稿 / 核对」');
      }, 900);
    },
    'parse-fail': () => { state.parseError = true; render(); },
    retry: () => { state.parseError = false; toast('模拟重试完成；原件始终保留'); render(); },
    candidate: (el) => {
      const c = CANDS[state.profile].find((x) => x.id === el.dataset.id);
      if (!c) return;
      openDialog('小畅宝', '核对这一项内容',
        `<div class="notice">核对表示"转录已逐字检查过"，不等于医学审核。</div>
        <label style="display:block;margin-top:10px"><span class="form-label">${esc(c.name)}</span><input id="cand-input" style="width:100%" value="${esc(c.value)}" maxlength="160"></label>
        <p class="small-note">来源：${esc(c.source)}。暂时不确定就保留待核对状态，不会丢。</p>`,
        `<button class="soft" data-action="close">现在先不核对</button><button class="primary" data-action="cand-save" data-id="${esc(c.id)}">接受这条记录</button>`);
    },
    'cand-save': (el) => {
      const c = CANDS[state.profile].find((x) => x.id === el.dataset.id);
      const v = $('#cand-input') ? $('#cand-input').value.trim() : '';
      if (c && v) { c.value = v; c.status = 'accepted'; }
      closeDialog(); render(); toast('已接受：写入演示数据库（record + 事实表），候选留版本不覆盖');
    },
    'add-review-question': () => {
      const q = state.profile === 'A' ? '请帮我核实：病理报告的脉管 / 神经侵犯结论，以及 Lynch 胚系检测是否出结果了。' : '请帮我核实：MDT-2 影像评估的肝转移灶大小与结论原文。';
      state.questions = state.questions || [];
      if (!state.questions.includes(q)) state.questions.push(q);
      render(); toast('已加入复诊准备的问题清单');
    },
    'add-diary': () => toast('原型内不落库；真实版在这里 30 秒记一条'),
    'add-meal': () => toast('原型内不落库；真实版在这里记一笔饮食'),
    'add-viewpoint': () => toast('感受会记为"一条信息"，标注不是医生结论'),
    'add-line': () => toast('新增治疗线需核对方案原件后建立'),
    'export-stoma': () => toast('就诊展示：最近 7 天日记（演示）'),
    'export-review': dlgExport,
    'toggle-ask': (el) => { el.textContent = el.textContent.includes('✓') ? '标记已问' : '已问过 ✓'; },
    'save-trial': (el) => { const id = el.closest('[data-action]').dataset.id ?? el.dataset.id; if (state.saved.includes(id)) { state.saved = state.saved.filter(x => x !== id); } else state.saved.push(id); render(); },
    'ask-trial': (el) => { const id = el.closest('[data-action]').dataset.id ?? el.dataset.id; const t = TRIALS.find(x => x.id === id); state.questions = state.questions || []; const q = `${t.id}：入组条件是否包含我的分期与既往治疗？`; if (!state.questions.includes(q)) state.questions.push(q); render(); toast('已加入入组问题清单'); },
    range: (el) => { state.range = el.dataset.range; render(); },
    toggle: (el) => { state.toggles[el.dataset.key] = !state.toggles[el.dataset.key]; render(); },
    pin: (el) => { state.pin = { code: el.dataset.code, date: el.dataset.date }; render(); },
    unpin: () => { state.pin = null; render(); },
    zoom: () => {},
    agent: () => { state.agentOpen = !state.agentOpen; renderAgent(); },
    'agent-build': agentBuild,
    'agent-demo': agentDemo
  };
  if (act === 'agent-size') { state.agentSize = e.target.closest('[data-action]').dataset.size; renderAgent(); return; }
  if (act === 'cfg-tab') {
    const el = e.target.closest('[data-action]');
    document.querySelectorAll('.cfg-tabs [role=tab]').forEach((b) => b.setAttribute('aria-selected', String(b === el)));
    document.querySelectorAll('.cfg-block[data-tab]').forEach((b) => { b.hidden = b.dataset.tab !== el.dataset.tab; });
    return;
  }
  if (map[act]) map[act](e.target.closest('[data-action]'));
});
document.addEventListener('input', (e) => {
  if (e.target.matches('[data-action="zoom"]')) { const sib = e.target.nextElementSibling; if (sib) sib.textContent = e.target.value + '%'; }
  if (e.target.matches('[data-action="records-search"]')) {
    state.query = e.target.value;
    const wrap = $('#docs-table'); if (wrap) wrap.innerHTML = docsTable();
  }
});
document.addEventListener('change', (e) => {
  const el = e.target.closest('[data-action]');
  if (el && el.dataset.action === 'zoom') { state.zoom = Number(el.value); render(); }
});
document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && $('#dialog').open) closeDialog(); });
$('#font-toggle').addEventListener('click', () => { const on = document.body.classList.toggle('large'); $('#font-toggle').setAttribute('aria-pressed', String(on)); });
window.addEventListener('hashchange', () => { const v = location.hash.slice(1); if (v && v !== state.view && VIEWS[v]) { state.view = v; render(); } });

const initialHash = location.hash.slice(1);
if (VIEWS[initialHash]) state.view = initialHash;
render();
