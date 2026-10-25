# 疾病概要 · 结直肠癌

> 本项目实例文件，由 `xyb-workbench-starter` 的 `templates/DISEASE-PRIMER.md` 复制而来。
> 规范：starter `docs/36-DISEASE-PRIMER.md`。四段固定、顺序不变，缺段不合格。

- 项目 / 品牌：小畅宝 Colopal
- 病种：结直肠癌（Colorectal Cancer）
- 最后更新：2026-10-25
- 数据文件：`prototypes/v0.2/primer-data.js`（`window.DISEASE_PRIMER`）
- README 对应段：`## 疾病概要`
- 实现：`prototypes/v0.2/primer.js` + `primer.css`（来自 starter `assets/patterns/`，逻辑未改）
- 探针：`NODE_OPTIONS= node scripts/probe-disease-primer.mjs --port 8132 --url http://127.0.0.1:8132/prototypes/v0.2/index.html` → 9/9

## 0 原件状态（本项目的前提）

| 文件 | 状态 |
|---|---|
| NCCN Guidelines for Patients: Colon Cancer 2025 | **未取得原件**：项目只登记了患者版与中文译本的引用 |
| NCCN 结肠癌指南 V2/V4/V5 中文译本 | **未取得原件**：译本，非原文 |
| CSCO 结直肠癌诊疗指南 2025 | **未取得原件**：医脉通收录件 |
| CSCO 2026 / ESMO 2026 | **未取得原件**，状态未核验 / 原文 DOI 待取得 |
| AJCC 第 8 版 | **未取得原件** |

这一条与 `docs/MONITORING-METRICS.md` 的来源表一致：**没看到原件，不许假装看到了**。所以本文件不引用任何条文原文，只写「哪类内容以它为准」。

## 1 定义（`definition`）

结直肠癌是结肠或直肠黏膜上皮来源的恶性肿瘤的统称。结肠癌与直肠癌在解剖位置、手术方式、放疗适用与随访节奏上分开处理，所以本台从建档起就把「结肠 / 直肠」分成两条线。

- 病理与分期是第一层：TNM 口径来自 AJCC（未取得原件）。
- 分子分型是第二层：MMR / MSI、RAS（KRAS/NRAS）、BRAF、HER2 四项在晚期/转移情形下被列为必测类别（据 NCCN 患者版 2025 与 CSCO 2025 转引）。
- 「缺失」「未检出」「未检测」三态分开记，未检测不等于阴性。
- 部位与是否造口是随访与生活记录的入口，不是严重程度标签。

**来源**：AJCC · Cancer Staging Manual, 8th ed.（2017）· 未取得原件，据二次来源 · 页码待核 ｜ NCCN · NCCN Guidelines for Patients: Colon Cancer（2025，患者版）· 未取得原件，据二次来源 · 页码待核

## 2 医学资料规范和指南情况（`evidence`）

| 机构 | 文件 | 版本 / 年份 | 原件 | 本台的用途 |
|---|---|---|---|---|
| NCCN | NCCN Guidelines for Patients: Colon Cancer | 2025（患者版） | 未取得原件（据患者版与中文译本引用） | 随访频率与生化监测框架 |
| NCCN | NCCN 结肠癌指南（中文译本） | 2025.V2 / V4 / V5 | 未取得原件（中文译本，非原文） | DPYD、PIK3CA、ctDNA/PET 条目的对照 |
| CSCO | CSCO 结直肠癌诊疗指南 | 2025（医脉通收录，直肠癌随访章节） | 未取得原件 | 中国口径的随访频率、肝脏超声、MRI、遗传筛查 |
| CSCO | CSCO 结直肠癌诊疗指南 | 2026 版（状态未核验） | 未取得原件 | 仅作监测入口，不作引用依据 |
| ESMO | ESMO Metastatic Colorectal Cancer guideline 2026 update | 2026（原文/DOI 待取得） | 未取得原件 | 仅作监测入口，不作引用依据 |
| AJCC | Cancer Staging Manual, 8th ed.（结直肠章节） | 2017 | 未取得原件 | TNM 分期口径 |

- 一台一表，不合并；未取得原件的必须标出来。
- 同一机构的不同版本分行列（NCCN 2025.V2 / V4 / V5），不跨版本合并。

**来源**：见上表逐行。

## 3 目前治疗全景概要（`landscape`）

按病期 / 线序分组，只列指南列举过的手段类别，不排序、不比优劣、不含剂量与疗程。

### 3.1 局限期（可以手术时）

- 手术：结肠癌与直肠癌的切除范围与吻合方式不同；是否造口由部位与手术情形决定，本台只记录术式与造口状态。
- 术后辅助化疗：按分期与病理高危因素分层列出。
- 直肠癌放疗：新辅助或辅助放疗在指南结构中被列出；本台只记疗程与日期。
- 非手术等待：直肠癌在特定条件下存在「观察等待」路径，2026 登记里有相关研究；是否适用属医生判断。

### 3.2 局部晚期 / 转移后

- 系统治疗按分子分型与线序分组：化疗、靶向治疗、免疫治疗在不同线序中被列出。MSI-H / dMMR 与 RAS、BRAF V600E、HER2 等标志物决定分组，本台只抄报告原文，不替你选组。
- 肝、肺转移的局部治疗与转化治疗被列出。
- 临床研究：被列为正式选项，不是最后手段。

### 3.3 贯穿全程

- 随访节奏：按分期取值，CEA 与影像间隔在 NCCN 2025 与 CSCO 2025 里都有条目；本台只显示「指南节奏 / 你最近一次 / 参考窗口」，不发提醒。
- ctDNA 与 PET：NCCN 2025.V5 明确为「不做常规随访手段（仅限临床试验）」，CSCO 2025 列为可选/有争议；本台呈现为空态说明，不进待办、不画趋势。
- 造口与排便功能、营养与运动：ESMO Open 2026 有局部期结肠癌术后结构化运动的 Express Update；本台只记「做了没有、感受如何」。

**固定出口（原话照抄）**：

> 以上是文献与指南里列出的手段，按病期与线序排列，不代表任何一项适合你。选哪一个，这一句需要问你的医生。

**来源**：NCCN · NCCN Guidelines for Patients: Colon Cancer（2025）· 未取得原件，据二次来源 · 页码待核 ｜ CSCO · CSCO 结直肠癌诊疗指南（2025）· 未取得原件，据二次来源 · 页码待核

## 4 发展趋势（`trend`）

只写已发生的事实，每条带日期或版本号。

1. 2025 年：本项目登记的 NCCN 结肠癌指南中文译本出现 V2、V4、V5 三个版本号（译本，非原文）。
2. 2025 年：CSCO 结直肠癌诊疗指南 2025 版（医脉通收录）为本项目现用的中国口径来源。
3. 2026 年：ESMO 转移性结直肠癌指南 2026 更新（原文/DOI 待取得）；CSCO 2026 版状态未核验。
4. 2026 年：ESMO Open 2026;11(2):106019 发表局部期结肠癌术后结构化运动 Express Update（doi:10.1016/j.esmoop.2025.106019）。
5. 截至 2026-10-17：ClinicalTrials.gov 可检索到 2026 年首次公示的结直肠癌相关干预性研究 480 条（疾病特异 457 + 广谱篮式 23）；ChinaDrugTrials 与 ChiCTR 本轮未采集，中国登记数未知。

**未写**：没有核实过任何 NMPA 批件，也没有拿到 ESMO 2026 原文，所以批件类事实一条都没写，ESMO 只以「DOI 已发表」的形式出现。

**来源**：NCCN 中文译本（2025.V2 / V4 / V5）· 未取得原件 · 页码待核 ｜ CSCO 2025 · 未取得原件 · 页码待核 ｜ ESMO Open 2026;11(2):106019 · DOI:10.1016/j.esmoop.2025.106019 ｜ ClinicalTrials.gov · 检索日 2026-10-17 · 一手登记数据，本项目自采

## 5 落地清单

- [x] `prototypes/v0.2/primer.css`（starter 原样复制）
- [x] `prototypes/v0.2/primer.js`（starter 原样复制，逻辑未改）
- [x] `prototypes/v0.2/primer-data.js`（四段数据）
- [x] `index.html` 三处引用：`primer.css`、`primer-data.js`、`primer.js`
- [x] 顶栏「?」由模块自动插入 `.top-actions`（未手写按钮）
- [x] README 的 `## 疾病概要` 四段正文（位置：项目简介之后、`## 当前状态` 之前）
- [x] `NODE_OPTIONS= node scripts/probe-disease-primer.mjs --port 8132 --url …/prototypes/v0.2/index.html` → 9/9 PASS
- [x] `node /Users/qinxiaoqiang/Downloads/xyb-workbench-starter/scripts/check-conformance.mjs .` → primer/* 四项无失败

## 6 验收（P1–P8）

| 编号 | 判据 | 结果 |
|---|---|---|
| P1 | 顶栏有可点「?」，aria-label 说明四段 | ✅ text="?" label="疾病概要：定义、医学资料与指南情况、治疗全景、发展趋势" |
| P2 | 整页面板，四段顺序 定义 → 指南 → 治疗全景 → 趋势 | ✅ definition › evidence › landscape › trend |
| P3 | 面板宽高 ≥ 视口 90% | ✅ 1249×829 / 视口 1280×860 |
| P4 | 打开压一条 history，`history.back()` 收起 | ✅ history.length=3；返回后 open=false |
| P5 | 「返回」「关闭」两个独立入口 | ✅ back=true close=true same=false |
| P6 | 关闭后焦点回触发按钮、滚动位置不变 | ✅ focusOnTrigger=true scrollY=260→260 |
| P7 | Esc 只退一层 | ✅ open=false，URL 仍在 /prototypes/v0.2/index.html |
| P8 | 四段齐全、每段有来源、趋势段无禁止词 | ✅ |

## 7 本项目教训

- **患者版指南不能当专业版用**：`docs/MONITORING-METRICS.md` 的来源表把「NCCN 患者版」与「中文译本」分开列。写证据表时照抄了这个拆法，没有把两者合并成一行「NCCN 2025」。
- **同一个 2025 年里有三个版本号**：V2 / V4 / V5 都是译本。第一稿写「NCCN 2025 版」是想省事，但省掉版本号就等于抹掉条目差异；改成逐版本列出。
- **480 条必须带「单通道」**：ChinaDrugTrials 与 ChiCTR 未采集。只写 480 会让人以为是全国全量，所以趋势段末尾把两个未采集渠道一并写了。
