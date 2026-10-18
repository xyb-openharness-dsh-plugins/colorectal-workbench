/* 小畅宝 Colopal · 演示数据生成器（唯一数据源）
   产出：demo/demo-data.sqlite（可 SQL 查询）+ prototypes/v0.2/demo-data.js（原型只读数据层）
   原则：全部患者数据为虚构模拟；试验表为真实登记摘录（状态未核实）。
   运行：node demo/build-demo-data.mjs  —— 改数据只改这里，两个产物一起重生成。 */
import { DatabaseSync } from 'node:sqlite';
import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const P2 = join(ROOT, 'prototypes/v0.2');

/* ---------- 基础数据 ---------- */
const pts = (arr) => arr.map(([d, v, src]) => ({ d, v, src }));
const CAT_COLOR = { '肿瘤标志物': '#1b4f8a', '血象': '#a03d5c', '生化': '#9a6410', '电解质': '#2f6f66', '营养': '#4a6fa5', '治疗毒性': '#c2551f', '贝伐监测': '#33608f' };
const cat = (c) => ({ cat: c, color: CAT_COLOR[c] });
/* 按指标 key 独立配色：一图秀最多 4 条同屏，必须靠色相区分，不能只靠类别色。
   原则：类别大方向不变（血象偏红、生化偏金、电解质偏青、营养偏紫），
   但同屏最常见的组合（CEA/CA19-9/体重/前白蛋白/血压）跨色相拉开。 */
const KEY_COLOR = {
  cea: '#1b4f8a', ca199: '#c2551f',
  hgb: '#a03d5c', wbc: '#c2687f', anc: '#8f2d4a', lym: '#d495a6', plt: '#b3556e',
  alt: '#9a6410', ast: '#b07c2a', alp: '#c9a04e', tbil: '#8a5510', cr: '#7a5c20', bun: '#a58a45',
  k: '#2f6f66', na: '#4d9187', ca: '#6fb0a5', mg: '#1f5c53',
  wt: '#7c5cbf', alb: '#a48ad6', pa: '#6a4aa0',
  neuro: '#b35a1e', hfs: '#c2551f', diarrhea: '#d0784a', mucositis: '#e09568',
  bps: '#33608f', bpd: '#7d97b8', proU: '#24486b'
};

const commonNumeric = (sex) => [
  { key: 'wbc', name: '白细胞', unit: '10⁹/L', dec: 1, band: [3.5, 9.5], note: '不同医院参考区间不合并', ...cat('血象'), points: pts([
    ['2026-08-10', 6.2, '术前'], ['2026-09-20', 5.1, '周期1前'], ['2026-09-24', 2.8, '周期1后'], ['2026-10-12', 4.6, '周期2前'], ['2026-10-16', 3.1, '周期2后']]) },
  { key: 'anc', name: '中性粒细胞', unit: '10⁹/L', dec: 2, band: [1.8, 6.3], note: '每周期前必查；偏低时化疗可能推迟', ...cat('血象'), points: pts([
    ['2026-08-10', 3.6, '术前'], ['2026-09-20', 3.4, '周期1前'], ['2026-09-24', 1.2, '周期1后（曾按计划不改期）'], ['2026-10-12', 2.1, '周期2前'], ['2026-10-16', 1.6, '周期2后']]) },
  { key: 'lym', name: '淋巴细胞', unit: '10⁹/L', dec: 2, band: [1.1, 3.2], note: '—', ...cat('血象'), points: pts([
    ['2026-08-10', 1.8, '术前'], ['2026-09-24', 1.1, '周期1后'], ['2026-10-16', 1.0, '周期2后']]) },
  { key: 'plt', name: '血小板', unit: '10⁹/L', dec: 0, band: [125, 350], note: '—', ...cat('血象'), points: pts([
    ['2026-08-10', 246, '术前'], ['2026-09-24', 198, '周期1后'], ['2026-10-16', 176, '周期2后']]) },
  { key: 'alt', name: 'ALT', unit: 'U/L', dec: 0, band: [9, 50], note: '—', ...cat('生化'), points: pts([
    ['2026-08-10', 24, '术前'], ['2026-09-24', 31, '周期1后'], ['2026-10-16', 28, '周期2后']]) },
  { key: 'ast', name: 'AST', unit: 'U/L', dec: 0, band: [15, 40], note: '—', ...cat('生化'), points: pts([
    ['2026-08-10', 22, '术前'], ['2026-10-16', 26, '周期2后']]) },
  { key: 'alp', name: '碱性磷酸酶', unit: 'U/L', dec: 0, band: [45, 125], note: '肝转移或骨转移时需关注（本档案无）', ...cat('生化'), points: pts([
    ['2026-08-10', 82, '术前'], ['2026-10-16', 78, '周期2后']]) },
  { key: 'tbil', name: '总胆红素', unit: 'μmol/L', dec: 1, band: [3.4, 20.5], note: '—', ...cat('生化'), points: pts([
    ['2026-08-10', 11.2, '术前'], ['2026-10-16', 10.8, '周期2后']]) },
  { key: 'cr', name: '肌酐', unit: 'μmol/L', dec: 0, band: sex === '男' ? [57, 111] : [41, 81], note: '—', ...cat('生化'), points: pts([
    ['2026-08-10', sex === '男' ? 74 : 58, '术前'], ['2026-10-16', sex === '男' ? 78 : 61, '周期2后']]) },
  { key: 'bun', name: '尿素', unit: 'mmol/L', dec: 1, band: [2.9, 8.2], note: '—', ...cat('生化'), points: pts([
    ['2026-08-10', 5.4, '术前'], ['2026-10-16', 5.9, '周期2后']]) },
  { key: 'k', name: '血钾', unit: 'mmol/L', dec: 2, band: [3.5, 5.3], note: '腹泻/呕吐后需复查', ...cat('电解质'), points: pts([
    ['2026-08-10', 4.1, '术前'], ['2026-09-24', 3.6, '周期1后'], ['2026-10-16', 3.9, '周期2后']]) },
  { key: 'na', name: '血钠', unit: 'mmol/L', dec: 0, band: [137, 147], note: '—', ...cat('电解质'), points: pts([
    ['2026-08-10', 141, '术前'], ['2026-10-16', 139, '周期2后']]) },
  { key: 'ca', name: '血钙', unit: 'mmol/L', dec: 2, band: [2.11, 2.52], note: '—', ...cat('电解质'), points: pts([
    ['2026-08-10', 2.28, '术前'], ['2026-10-16', 2.24, '周期2后']]) },
  { key: 'mg', name: '血镁', unit: 'mmol/L', dec: 2, band: [0.75, 1.02], note: '奥沙利铂方案关注项', ...cat('电解质'), points: pts([
    ['2026-08-10', 0.86, '术前'], ['2026-09-24', 0.79, '周期1后'], ['2026-10-16', 0.74, '周期2后（医嘱：下周期补镁复查）']]) },
  { key: 'wt', name: '体重', unit: 'kg', dec: 1, band: null, note: '化疗期 ±5% 内波动常见；持续下降需就诊时提出', ...cat('营养'), points: pts([
    ['2026-08-10', sex === '男' ? 68.4 : 57.2, '基线'], ['2026-09-20', sex === '男' ? 65.9 : 56.4, '周期1前'], ['2026-09-24', sex === '男' ? 65.1 : 55.8, '周期1后'], ['2026-10-12', sex === '男' ? 65.4 : 56.2, '周期2前'], ['2026-10-16', sex === '男' ? 64.8 : 55.9, '周期2后']]) },
  { key: 'alb', name: '白蛋白', unit: 'g/L', dec: 0, band: [40, 55], note: '营养与肝脏合成的综合反映', ...cat('营养'), points: pts([
    ['2026-08-10', 39, '术前'], ['2026-09-24', 38, '周期1后'], ['2026-10-16', 40, '周期2后']]) },
  { key: 'pa', name: '前白蛋白', unit: 'mg/L', dec: 0, band: [200, 400], note: '比白蛋白更早反映营养变化', ...cat('营养'), points: pts([
    ['2026-08-10', 218, '术前'], ['2026-09-24', 196, '周期1后'], ['2026-10-16', 225, '周期2后']]) },
];

const PROFILE_A = {
  meta: { name: '陈先生', sex: '男', age: 62, meta: '62 岁 · 乙状结肠癌 ⅢB', headline: '乙状结肠癌 ⅢB（pT3N1bM0）术后，辅助治疗中，临时回肠造口', stage: 'ⅢB 期（pT3N1bM0）',
    mindset: '手术后第一次化疗前比较紧张，想弄清 dMMR 对方案意味着什么。',
    dash_keys: ['cea', 'ca199', 'wt', 'pa', 'hgb', 'anc', 'mg'] },
  path: ['乙状结肠腺癌', 'pT3N1bM0 · ⅢB', 'dMMR / MSI-H', '临时回肠造口（保护性）'],
  molecular: [
    { k: 'MMR / MSI', v: 'dMMR / MSI-H', src: '病理免疫组化 2026-08-16', state: 'ok', note: '错配修复蛋白缺失（MLH1/PMS2）' },
    { k: 'RAS', v: '未检测', src: '—', state: 'na', note: '报告中未见；可在随访时问' },
    { k: 'BRAF', v: '未检测', src: '—', state: 'na', note: '报告中未见；可在随访时问' },
    { k: 'HER2', v: '未检测', src: '—', state: 'na', note: '报告中未见' },
    { k: 'DPYD', v: '未检出致病变异', src: '用药前基因检测 2026-09-15', state: 'ok', note: '氟尿嘧啶类用药前检测' },
    { k: 'PIK3CA', v: '未检测', src: '—', state: 'na', note: 'Ⅲ期可讨论；与阿司匹林二级预防相关，只记录不推荐' }],
  lynch: { title: 'Lynch 综合征筛查（dMMR 触发）', rows: [
    ['2026-08-20', '血样送检：MLH1 / PMS2 胚系检测', '肿瘤科安排，结果未回'],
    ['—', '家属筛查事宜', '待结果回后与医生讨论；本页只记录安排，不做筛查建议']] },
  lines: [
    { name: '手术 · 2026-08-14', detail: '腹腔镜乙状结肠切除术 + 临时回肠造口（保护低位吻合）', done: true },
    { name: '辅助治疗 CAPEOX', detail: '计划 6 周期 · 2026-09-22 开始，现第 2 周期', done: false }],
  cycles: [
    ['第 1 周期', '2026-09-22', '奥沙利铂 + 卡培他滨', '已完成', true],
    ['第 2 周期', '2026-10-13', '奥沙利铂 + 卡培他滨', '进行中', false]],
  rhythm: [
    ['CEA', '每 3 个月，术后 2 年内', 'NCCN 2025', '下次：2027-01（随访窗口以医生安排为准）'],
    ['胸腹盆 CT', '每 6–12 个月，共 5 年', 'CSCO 2025 / NCCN 2025', '下次：2027-02 前后'],
    ['肠镜', '术后 1 年（2027-08）', 'NCCN 2025', '如发现腺瘤，间隔缩短——以医生安排为准'],
    ['体格检查（含直肠指诊）', '每 3–6 个月', 'CSCO 2025', '每次复诊随诊']],
  resect: null,
  stoma: { type: '临时回肠造口（保护性）', site: '右下腹', date: '2026-08-14', plan: '拟术后 6 个月左右评估还纳，以医生安排为准',
    supplies: '两件式造口袋 · 造口底盘每 3–4 天更换',
    diary: [
      ['2026-10-17', '排泄', '正常', '一天 4–5 次，成形'],
      ['2026-10-16', '用品', '正常', '更换底盘，无渗漏'],
      ['2026-10-16', '皮肤', '轻度发红', '周围皮肤泛红，已拍照；无破溃'],
      ['2026-10-15', '排泄', '水样偏多', '一天 6–7 次，进食粥后减少'],
      ['2026-10-15', '用品', '正常', '夜间渗漏一次，已更换'],
      ['2026-10-14', '皮肤', '正常', '—'],
      ['2026-10-13', '皮肤', '正常', '化疗当天由家属协助'],
      ['2026-10-12', '排泄', '正常', '—']],
    thresholds: ['造口周围皮肤破溃、持续渗血', '排泄突然明显减少或停止（伴腹痛腹胀）', '造口颜色变暗发黑'] },
  lars: [
    { d: '2026-09-15', score: 26, band: '重度', note: '还纳前基线自查', self: true },
    { d: '2026-10-10', score: 24, band: '重度', note: '变化不大；还纳后 3、6 个月再各一次', self: true }],
  viewpoints: [
    ['2026-10-14', '有点低落', '化疗后手指发麻那几天比较紧张，想弄清 dMMR 对方案意味着什么。'],
    ['2026-09-21', '平静', '第 1 周期顺利结束，情绪平稳。'],
    ['2026-10-02', '身体形象', '开始自己换造口袋了；出门前会多看一眼衣服遮不遮得住。']],
  extraMetrics: [
    { key: 'cea', name: 'CEA', unit: 'ng/mL', dec: 1, band: [0, 5], note: '同一实验室、同一方法可比；单次升高不特指复发', ...cat('肿瘤标志物'), points: pts([
      ['2026-08-10', 18.6, '术前'], ['2026-08-20', 9.8, '术后'], ['2026-09-20', 6.2, '周期1前'], ['2026-09-24', 5.4, '周期1后'], ['2026-10-12', 3.1, '周期2前'], ['2026-10-16', 2.8, '周期2后']]) },
    { key: 'ca199', name: 'CA19-9', unit: 'U/mL', dec: 0, band: [0, 37], note: '与 CEA 一起看；单次变化不特指复发', ...cat('肿瘤标志物'), points: pts([
      ['2026-08-10', 62, '术前'], ['2026-08-20', 41, '术后'], ['2026-10-12', 22, '周期2前']]) },
    { key: 'hgb', name: '血红蛋白', unit: 'g/L', dec: 0, band: [130, 175], note: '不同医院参考区间不合并', ...cat('血象'), points: pts([
      ['2026-08-10', 121, '术前'], ['2026-09-22', 118, '周期1'], ['2026-09-24', 112, '周期1后'], ['2026-10-13', 124, '周期2'], ['2026-10-16', 119, '周期2后']]) },
    { key: 'neuro', name: '奥沙利铂神经毒性', unit: '', dec: null, kind: 'grade', note: '只记录你的原话，不做分级判断', ...cat('治疗毒性'), points: pts([
      ['2026-09-25', '遇冷手指发麻 1 天', '周期1后自查'], ['2026-10-14', '遇冷手指发麻，2 天缓解；喝凉水也有感觉', '周期2后自查']]) },
    { key: 'hfs', name: '手足综合征（卡培他滨）', unit: '', dec: null, kind: 'grade', note: '只记录你的原话', ...cat('治疗毒性'), points: pts([
      ['2026-10-05', '掌心发红，不痛', '服卡培他滨第 2 周自查']]) },
    { key: 'diarrhea', name: '腹泻', unit: '', dec: null, kind: 'grade', note: '只记录次数与你的原话', ...cat('治疗毒性'), points: pts([
      ['2026-10-15', '水样 4 次/日，服药后好转', '周期2后自查']]) }],
  events: [
    { d: '2026-08-14', label: '手术+造口' }, { d: '2026-09-22', label: 'CAPEOX-1' }, { d: '2026-10-13', label: 'CAPEOX-2' }],
  docs: [
    { id: 'd1', name: '病理报告 · 乙状结肠', date: '2026-08-16', type: '病理', status: '已核对' },
    { id: 'd2', name: '出院小结 · 术后', date: '2026-08-20', type: '住院', status: '已核对' },
    { id: 'd3', name: '基因检测 · DPYD', date: '2026-09-15', type: '检验', status: '已核对' },
    { id: 'd4', name: 'Lynch 胚系检测送检单', date: '2026-08-20', type: '其他', status: '待核对' },
    { id: 'd5', name: '血常规 · 周期2后', date: '2026-10-16', type: '检验', status: '已核对' },
    { id: 'd6', name: '胸腹盆 CT · 术前', date: '2026-08-05', type: '影像', status: '已核对' }],
  candidates: [
    { id: 'c1', name: '脉管侵犯', value: '未见明确脉管侵犯（L0）', source: '病理报告 · 乙状结肠 · 第 2 页', status: 'candidate' },
    { id: 'c2', name: '神经侵犯', value: '未见明确神经侵犯（Pn0）', source: '病理报告 · 乙状结肠 · 第 2 页', status: 'candidate' },
    { id: 'c3', name: 'Lynch 胚系检测结果', value: '报告未回（2026-08-20 送检）', source: 'Lynch 胚系检测送检单 · 第 1 页', status: 'needs_review' }],
  pathology: {
    title: '病理资料 · 乙状结肠',
    status: '模拟转录 · 已核对',
    rows: [
      ['手术日期', '2026-08-14'],
      ['部位', '乙状结肠'],
      ['术式', '腹腔镜乙状结肠切除术 + 临时回肠造口（保护性）'],
      ['分期', 'pT3N1bM0 · ⅢB'],
      ['组织学', '腺癌'],
      ['淋巴结', '1/15 阳性（N1b）'],
      ['切缘', '阴性'],
      ['MMR / MSI', 'dMMR / MSI-H（MLH1/PMS2 缺失）']],
    gaps: [
      ['脉管 / 神经侵犯', '病理报告候选待核对（整理草稿里确认）'],
      ['Lynch 胚系检测', '报告未回；回来后与医生讨论家属筛查'],
      ['RAS / BRAF', '未检测；Ⅲ期可在随访时问是否需要']]},
  nutritionNotes: [
    ['2026-10-15', '粥 + 蒸蛋，排泄 6–7 次偏水样；减少粗纤维后好转。'],
    ['2026-10-13', '化疗第 2 周期当天胃口差，下午加餐酸奶。'],
    ['2026-10-08', '正常三餐，两餐间加营养粉（医生建议过）。']],
  activity: '散步 4 次 × 20 分钟（自记）。',
  familyTalk: 'Lynch 结果回来后，如何和兄弟姐妹讲筛查这件事。'
};

const PROFILE_B = {
  meta: { name: '王女士', sex: '女', age: 55, meta: '55 岁 · 直肠癌 Ⅳ 期（肝转移）', headline: '直肠癌 Ⅳ 期（肝转移）转化治疗中，pMMR/MSS，RAS 突变，贝伐方案', stage: 'Ⅳ 期（肝转移，转化治疗中）',
    mindset: '最担心的是肝转移能不能切；每次 MDT 结论都想留个原文。',
    dash_keys: ['cea', 'ca199', 'bps', 'bpd', 'wt', 'pa', 'anc'] },
  path: ['直肠腺癌', 'cT3N2M1（肝） · Ⅳ', 'pMMR / MSS · KRAS G12D', '转化治疗中'],
  molecular: [
    { k: 'MMR / MSI', v: 'pMMR / MSS', src: '病理免疫组化 2026-07-02', state: 'ok', note: '错配修复蛋白完整' },
    { k: 'RAS', v: 'KRAS G12D 突变', src: 'NGS 报告 2026-07-05', state: 'warn', note: '抗 EGFR 类药物通常不适用（以医生解读为准）' },
    { k: 'BRAF', v: '野生型', src: 'NGS 报告 2026-07-05', state: 'ok', note: '—' },
    { k: 'HER2', v: '阴性（IHC 1+）', src: '免疫组化 2026-07-02', state: 'ok', note: '—' },
    { k: 'DPYD', v: '未检出致病变异', src: '用药前基因检测 2026-07-05', state: 'ok', note: '—' },
    { k: 'PIK3CA', v: '未检测', src: '—', state: 'na', note: '—' }],
  lynch: null,
  lines: [
    { name: '转化治疗 FOLFIRI + 贝伐', detail: '2026-07-10 起，已完成 6 周期；下次 MDT 评估可切除性', done: false },
    { name: '基线', detail: '2026-07-01 确诊；肝转移灶 2 枚（S4/S7）', done: true }],
  cycles: [
    ['第 4 周期', '2026-08-18', 'FOLFIRI + 贝伐', '已完成', true],
    ['第 5 周期', '2026-09-18', 'FOLFIRI + 贝伐', '已完成（中性粒偏低曾推迟 1 周）', true],
    ['第 6 周期', '2026-10-09', 'FOLFIRI + 贝伐', '已完成', true],
    ['第 7 周期', '2026-10-30', '视 10-27 评估结果', '待定', false]],
  rhythm: [
    ['CEA / 影像评估', '治疗中每 6–8 周一次', 'NCCN 2025（Ⅳ期治疗中）', '下次评估：2026-10-27'],
    ['CEA', '稳定期每 3 个月，前 2 年', 'NCCN 2025', '以医生安排为准'],
    ['胸腹盆 CT', '前 2 年每 3–6 个月', 'CSCO 2025', '以医生安排为准'],
    ['血压 / 尿蛋白（贝伐期间）', '每周期前', '用药监测（说明书/共识）', '与血常规同天抽血']],
  resect: { title: '可切除性评估（MDT）', rows: [
    ['2026-10-09', '肝转移灶 2 枚较基线缩小（S4 18mm，S7 12mm）；影像评估原文：PR', '外科：继续 2 周期后复评；原话已存档'],
    ['2026-08-30', '肝转移灶较基线缩小；影像评估原文：SD→PR 之间', '外科：暂不手术，继续转化'],
    ['2026-07-01', '基线：肝 S4/S7 两枚转移灶；原发灶距肛 6cm', 'MDT：先转化治疗']] },
  stoma: null, lars: [],
  viewpoints: [
    ['2026-10-10', '期待又怕落空', 'MDT 说肿瘤在缩小，既高兴又怕下次数值反弹。'],
    ['2026-09-19', '疲惫', '第 5 周期推迟那一周，心里反复想是不是指标不好。'],
    ['2026-09-30', '身体形象', '治疗期间脱发明显，戴了假发，不太想见外人。']],
  extraMetrics: [
    { key: 'cea', name: 'CEA', unit: 'ng/mL', dec: 1, band: [0, 5], note: '转化治疗中每周期评估', ...cat('肿瘤标志物'), points: pts([
      ['2026-07-01', 96.4, '基线'], ['2026-07-10', 88.2, '周期1'], ['2026-08-18', 52.6, '周期4'], ['2026-08-30', 41.2, 'MDT-1'], ['2026-09-18', 26.5, '周期5'], ['2026-10-09', 15.8, 'MDT-2'], ['2026-10-13', 14.2, '周期6后']]) },
    { key: 'ca199', name: 'CA19-9', unit: 'U/mL', dec: 0, band: [0, 37], note: '与 CEA 一起看', ...cat('肿瘤标志物'), points: pts([
      ['2026-07-01', 312, '基线'], ['2026-08-30', 156, 'MDT-1'], ['2026-10-09', 68, 'MDT-2']]) },
    { key: 'hgb', name: '血红蛋白', unit: 'g/L', dec: 0, band: [115, 150], note: '—', ...cat('血象'), points: pts([
      ['2026-07-10', 108, '周期1'], ['2026-08-18', 104, '周期4'], ['2026-09-18', 106, '周期5'], ['2026-10-13', 112, '周期6后']]) },
    { key: 'bps', name: '收缩压', unit: 'mmHg', dec: 0, band: [90, 139], note: '贝伐相关高血压：每周期前测；新发升高需当次告知医生', ...cat('贝伐监测'), points: pts([
      ['2026-07-10', 118, '周期1'], ['2026-07-31', 122, '周期2'], ['2026-08-18', 126, '周期4'], ['2026-09-18', 142, '周期5（当日复测 138）'], ['2026-09-22', 138, '周期5后复测'], ['2026-10-09', 132, '周期6'], ['2026-10-13', 128, '周期6后']]) },
    { key: 'bpd', name: '舒张压', unit: 'mmHg', dec: 0, band: [60, 89], note: '与收缩压同次测量', ...cat('贝伐监测'), points: pts([
      ['2026-07-10', 74, '周期1'], ['2026-08-18', 78, '周期4'], ['2026-09-18', 92, '周期5（当日复测 86）'], ['2026-10-09', 84, '周期6']]) },
    { key: 'proU', name: '尿蛋白', unit: '', dec: null, kind: 'qual', note: '定性结果只按原文记录，不做半定量折算', ...cat('贝伐监测'), points: pts([
      ['2026-07-10', '阴性', '周期1'], ['2026-08-18', '±', '周期4'], ['2026-09-18', '1+', '周期5'], ['2026-09-22', '±', '复查'], ['2026-10-09', '±', '周期6'], ['2026-10-13', '阴性', '周期6后']]) },
    { key: 'neuro', name: '伊立替康胃肠反应', unit: '', dec: null, kind: 'grade', note: '只记录你的原话，不做分级判断', ...cat('治疗毒性'), points: pts([
      ['2026-07-11', '输注当晚腹泻 2 次', '周期1后自查'], ['2026-09-19', '腹泻 3 次，服药后缓解；次日乏力', '周期5后自查']]) },
    { key: 'mucositis', name: '口腔黏膜炎', unit: '', dec: null, kind: 'grade', note: '只记录你的原话', ...cat('治疗毒性'), points: pts([
      ['2026-09-20', '舌边小溃疡，吃酸的疼', '周期5后自查']]) }],
  events: [
    { d: '2026-07-01', label: '基线确诊' }, { d: '2026-07-10', label: 'FOLFIRI+贝伐-1' }, { d: '2026-08-30', label: 'MDT-1' }, { d: '2026-10-09', label: 'MDT-2' }],
  docs: [
    { id: 'd1', name: '病理报告 · 直肠', date: '2026-07-02', type: '病理', status: '已核对' },
    { id: 'd2', name: 'NGS 报告', date: '2026-07-05', type: '检验', status: '已核对' },
    { id: 'd3', name: '影像评估 · MDT-2', date: '2026-10-09', type: '影像', status: '待核对' },
    { id: 'd4', name: '出院小结 · 转化治疗', date: '2026-09-20', type: '住院', status: '已核对' },
    { id: 'd5', name: '血压 / 尿蛋白记录 · 周期6', date: '2026-10-13', type: '检验', status: '已核对' }],
  candidates: [
    { id: 'c1', name: '肝转移灶 S4 大小', value: '18 mm（较基线缩小）', source: '影像评估 · MDT-2 · 第 1 页', status: 'candidate' },
    { id: 'c2', name: '肝转移灶 S7 大小', value: '12 mm（较基线缩小）', source: '影像评估 · MDT-2 · 第 1 页', status: 'candidate' },
    { id: 'c3', name: '影像评估结论', value: 'PR，继续转化 2 周期后复评', source: 'MDT-2 记录 · 第 2 页', status: 'needs_review' }],
  pathology: {
    title: '病理与分子资料 · 直肠',
    status: '模拟转录 · 已核对',
    rows: [
      ['确诊日期', '2026-07-01'],
      ['部位', '直肠（距肛 6 cm）'],
      ['组织学', '腺癌'],
      ['分期', 'cT3N2M1（肝）· Ⅳ'],
      ['MMR / MSI', 'pMMR / MSS'],
      ['RAS', 'KRAS G12D 突变'],
      ['BRAF', '野生型'],
      ['HER2', '阴性（IHC 1+）']],
    gaps: [
      ['影像评估 MDT-2', '候选待核对：肝转移灶大小与结论（整理草稿里确认）'],
      ['可切除性', '待 10-27 复评；外科原话已存档'],
      ['PIK3CA', '未检测；只记录不推荐']]},
  nutritionNotes: [
    ['2026-10-09', 'MDT-2 当天食欲一般；加餐 2 次。'],
    ['2026-09-28', '食欲恢复，正餐正常，体重稳住。'],
    ['2026-08-20', '口腔溃疡期改软食一周。']],
  activity: '每周 3 次 × 15 分钟慢走（自记）。',
  familyTalk: '治疗费用与工作安排，想和女儿谈一次。'
};

/* 组装档案（公共指标按档案复制，避免交叉污染） */
function assemble(P, sex, prefixDateBase) {
  const metrics = [...P.extraMetrics, ...commonNumeric(sex)].map((m) => ({ ...m, color: KEY_COLOR[m.key] || m.color }));
  return { ...P.meta, path: P.path, molecular: P.molecular, lynch: P.lynch, lines: P.lines, cycles: P.cycles,
    rhythm: P.rhythm, resect: P.resect, stoma: P.stoma, lars: P.lars, viewpoints: P.viewpoints,
    metrics, events: P.events, docs: P.docs, candidates: P.candidates, pathology: P.pathology,
    nutritionNotes: P.nutritionNotes, activity: P.activity, familyTalk: P.familyTalk };
}
const DATA = {
  profiles: { A: assemble(PROFILE_A, '男'), B: assemble(PROFILE_B, '女') },
  trials: [
    ['NCT07549399', '短程放疗+化疗靶向免疫新辅助治疗高危 pMMR/MSS 局晚期直肠癌', 'Ⅲ期', '招募中', '中山大学附属第六医院'],
    ['NCT07505472', '短程放疗序贯 CapeOX+特瑞普利单抗 ± 舒法替尼新辅助治疗中低位局晚期直肠癌', 'Ⅱ/Ⅲ期', '招募中', '吉林大学第一医院'],
    ['NCT07361003', 'Suvemcitug + FTD/TPI 用于难治性转移性结直肠癌（Ib/Ⅲ期）', 'Ⅲ期', '招募中', '先声药业'],
    ['NCT07595276', 'Enlituo® vs Erbitux®+FOLFOX（RAS/BRAF 野生型 MSS/pMMR）', 'Ⅲ期', '招募中', '泰州迈博太蔻药业'],
    ['NCT07462143', 'RC148 联合化疗一线治疗不可切除或转移性结直肠癌', 'Ⅱ/Ⅲ期', '招募中', '荣昌生物'],
    ['NCT07729605', 'FOLFIRI + 贝伐珠单抗 + QL1706 二线治疗 mCRC', 'Ⅲ期', '尚未招募', '中山大学'],
    ['NCT07730489', 'BL-M07D1 vs 医生选择（HER2 IHC3+ 后线）', 'Ⅲ期', '尚未招募', '四川百利药业'],
    ['NCT07483684', 'TQB2102 治疗 HER2 IHC3+ 晚期结直肠癌（后线）', 'Ⅲ期', '尚未招募', '正大天晴'],
    ['NCT07877597', '化疗 ± 短程放疗新辅助治疗高危局晚期 pMMR/MSS 结肠癌', 'Ⅲ期', '尚未招募', '复旦大学'],
    ['NCT07585279', '脂质体伊立替康 mCRC 二线治疗', 'Ⅱ/Ⅲ期', '尚未招募', '河北医科大学第四医院']
  ].map(([id, title, phase, status, sponsor]) => ({ id, title, phase, status, sponsor, url: 'https://clinicaltrials.gov/study/' + id }))
};

/* ---------- 产 1：SQLite ---------- */
const db = new DatabaseSync(join(ROOT, 'demo/demo-data.sqlite'));
db.exec(`
DROP TABLE IF EXISTS metric_points; DROP TABLE IF EXISTS metrics; DROP TABLE IF EXISTS molecular;
DROP TABLE IF EXISTS events; DROP TABLE IF EXISTS rhythm; DROP TABLE IF EXISTS cycles; DROP TABLE IF EXISTS treatment_lines;
DROP TABLE IF EXISTS stoma_diary; DROP TABLE IF EXISTS lars; DROP TABLE IF EXISTS resect_rows; DROP TABLE IF EXISTS lynch_rows;
DROP TABLE IF EXISTS viewpoints; DROP TABLE IF EXISTS nutrition_notes; DROP TABLE IF EXISTS trials; DROP TABLE IF EXISTS subjects; DROP TABLE IF EXISTS demo_meta;
DROP TABLE IF EXISTS documents; DROP TABLE IF EXISTS candidate_fields; DROP TABLE IF EXISTS pathology_rows;
CREATE TABLE subjects (profile_key TEXT PRIMARY KEY, name TEXT, sex TEXT, age INTEGER, meta TEXT, headline TEXT, stage TEXT, mindset TEXT, dash_keys TEXT, path TEXT);
CREATE TABLE metrics (profile_key TEXT, key TEXT, name TEXT, unit TEXT, cat TEXT, color TEXT, dec INTEGER, kind TEXT, band_low REAL, band_high REAL, note TEXT, PRIMARY KEY(profile_key, key));
CREATE TABLE metric_points (profile_key TEXT, metric_key TEXT, d TEXT, v_num REAL, v_text TEXT, src TEXT, ord INTEGER, PRIMARY KEY(profile_key, metric_key, d, ord));
CREATE TABLE molecular (profile_key TEXT, k TEXT, v TEXT, src TEXT, state TEXT, note TEXT, ord INTEGER);
CREATE TABLE events (profile_key TEXT, d TEXT, label TEXT);
CREATE TABLE rhythm (profile_key TEXT, item TEXT, freq TEXT, guideline TEXT, next TEXT, ord INTEGER);
CREATE TABLE cycles (profile_key TEXT, name TEXT, date TEXT, drugs TEXT, status TEXT, done INTEGER, ord INTEGER);
CREATE TABLE treatment_lines (profile_key TEXT, name TEXT, detail TEXT, done INTEGER, ord INTEGER);
CREATE TABLE stoma_diary (profile_key TEXT, d TEXT, kind TEXT, finding TEXT, detail TEXT, ord INTEGER);
CREATE TABLE lars (profile_key TEXT, d TEXT, score INTEGER, band TEXT, note TEXT, self INTEGER);
CREATE TABLE resect_rows (profile_key TEXT, d TEXT, imaging TEXT, surgical TEXT, ord INTEGER);
CREATE TABLE lynch_rows (profile_key TEXT, d TEXT, item TEXT, note TEXT, ord INTEGER);
CREATE TABLE viewpoints (profile_key TEXT, d TEXT, mood TEXT, text TEXT, ord INTEGER);
CREATE TABLE nutrition_notes (profile_key TEXT, d TEXT, text TEXT, ord INTEGER);
CREATE TABLE trials (nct_id TEXT PRIMARY KEY, title TEXT, phase TEXT, status TEXT, sponsor TEXT, url TEXT);
CREATE TABLE demo_meta (k TEXT PRIMARY KEY, v TEXT);
CREATE TABLE documents (profile_key TEXT, id TEXT, name TEXT, date TEXT, type TEXT, status TEXT, ord INTEGER, PRIMARY KEY(profile_key, id));
CREATE TABLE candidate_fields (profile_key TEXT, id TEXT, name TEXT, value TEXT, source TEXT, status TEXT, ord INTEGER, PRIMARY KEY(profile_key, id));
CREATE TABLE pathology_rows (profile_key TEXT, kind TEXT, a TEXT, b TEXT, ord INTEGER);
CREATE INDEX idx_points ON metric_points(profile_key, metric_key);
`);
for (const [k, p] of Object.entries(DATA.profiles)) {
  db.prepare('INSERT INTO subjects VALUES (?,?,?,?,?,?,?,?,?,?)').run(k, p.name, p.sex, p.age, p.meta, p.headline, p.stage, p.mindset, JSON.stringify(p.dash_keys), JSON.stringify(p.path));
  for (const m of p.metrics) {
    db.prepare('INSERT INTO metrics VALUES (?,?,?,?,?,?,?,?,?,?,?)').run(k, m.key, m.name, m.unit, m.cat, m.color, m.dec, m.dec === null ? (m.kind || 'qual') : 'numeric', m.band ? m.band[0] : null, m.band ? m.band[1] : null, m.note);
    m.points.forEach((pt, i) => db.prepare('INSERT INTO metric_points VALUES (?,?,?,?,?,?,?)').run(k, m.key, pt.d, typeof pt.v === 'number' ? pt.v : null, typeof pt.v === 'number' ? null : pt.v, pt.src, i));
  }
  p.molecular.forEach((x, i) => db.prepare('INSERT INTO molecular VALUES (?,?,?,?,?,?,?)').run(k, x.k, x.v, x.src, x.state, x.note, i));
  p.events.forEach(e => db.prepare('INSERT INTO events VALUES (?,?,?)').run(k, e.d, e.label));
  p.rhythm.forEach((r, i) => db.prepare('INSERT INTO rhythm VALUES (?,?,?,?,?,?)').run(k, r[0], r[1], r[2], r[3], i));
  p.cycles.forEach((c, i) => db.prepare('INSERT INTO cycles VALUES (?,?,?,?,?,?,?)').run(k, c[0], c[1], c[2], c[3], c[4] ? 1 : 0, i));
  p.lines.forEach((l, i) => db.prepare('INSERT INTO treatment_lines VALUES (?,?,?,?,?)').run(k, l.name, l.detail, l.done ? 1 : 0, i));
  if (p.stoma) p.stoma.diary.forEach((d, i) => db.prepare('INSERT INTO stoma_diary VALUES (?,?,?,?,?,?)').run(k, d[0], d[1], d[2], d[3], i));
  p.lars.forEach(l => db.prepare('INSERT INTO lars VALUES (?,?,?,?,?,?)').run(k, l.d, l.score, l.band, l.note, l.self ? 1 : 0));
  if (p.resect) p.resect.rows.forEach((r, i) => db.prepare('INSERT INTO resect_rows VALUES (?,?,?,?,?)').run(k, r[0], r[1], r[2], i));
  if (p.lynch) p.lynch.rows.forEach((r, i) => db.prepare('INSERT INTO lynch_rows VALUES (?,?,?,?,?)').run(k, r[0], r[1], r[2], i));
  p.viewpoints.forEach((v, i) => db.prepare('INSERT INTO viewpoints VALUES (?,?,?,?,?)').run(k, v[0], v[1], v[2], i));
  p.nutritionNotes.forEach((n, i) => db.prepare('INSERT INTO nutrition_notes VALUES (?,?,?,?)').run(k, n[0], n[1], i));
  p.docs.forEach((d, i) => db.prepare('INSERT INTO documents VALUES (?,?,?,?,?,?,?)').run(k, d.id, d.name, d.date, d.type, d.status, i));
  p.candidates.forEach((c, i) => db.prepare('INSERT INTO candidate_fields VALUES (?,?,?,?,?,?,?)').run(k, c.id, c.name, c.value, c.source, c.status, i));
  p.pathology.rows.forEach((r, i) => db.prepare('INSERT INTO pathology_rows VALUES (?,?,?,?,?)').run(k, 'row', r[0], r[1], i));
  p.pathology.gaps.forEach((r, i) => db.prepare('INSERT INTO pathology_rows VALUES (?,?,?,?,?)').run(k, 'gap', r[0], r[1], i));
}
DATA.trials.forEach(t => db.prepare('INSERT INTO trials VALUES (?,?,?,?,?,?)').run(t.id, t.title, t.phase, t.status, t.sponsor, t.url));
[['disclaimer', '全部患者数据为虚构模拟，仅供原型演示；trials 表为真实登记摘录，状态未核实'],
 ['generated_at', new Date().toISOString()], ['source', 'demo/build-demo-data.mjs（唯一数据源）'],
 ['subjects', '2'], ['metrics_rows', String(Object.values(DATA.profiles).reduce((a, p) => a + p.metrics.length, 0))],
 ['points_rows', String(Object.values(DATA.profiles).reduce((a, p) => a + p.metrics.reduce((b, m) => b + m.points.length, 0), 0))]]
  .forEach(([k, v]) => db.prepare('INSERT INTO demo_meta VALUES (?,?)').run(k, v));
db.close();

/* ---------- 产 2：原型数据层 ---------- */
const js = '/* 由 demo/build-demo-data.mjs 生成；勿手改，改数据请改生成器后重新运行。 */\nwindow.DEMO_DATA = ' + JSON.stringify(DATA) + ';\n';
writeFileSync(join(P2, 'demo-data.js'), js);

const nMetrics = Object.values(DATA.profiles).reduce((a, p) => a + p.metrics.length, 0);
const nPoints = Object.values(DATA.profiles).reduce((a, p) => a + p.metrics.reduce((b, m) => b + m.points.length, 0), 0);
console.log(`demo-data.sqlite + demo-data.js 生成完毕：2 档案 / ${nMetrics} 项指标 / ${nPoints} 个数据点 / ${DATA.trials.length} 条试验`);
