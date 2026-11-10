## 0.1.3（2026-11-11，AI 对话面板激活修复）

- 会话判定改用宿主归属 `ownedSession()`（`ownsSession(currentSession())`），不再用 `Boolean(conversation)`（customFrame 下没会话也会传隐藏容器 → 判断恒为真 → 点了没反应）。
- 创建路径改 `service.newSession(workspaceId)`，工作区取 `service.defaultWorkspace?.()?.workspaceId`；无可用工作区时由宿主提示选目录；不再用 `ensureSession({})`。
- 取消目录选择不留空会话并提示可重试；创建失败在工作台内显示原因；订阅会话变化触发重渲染；草稿仍只填不发。
- 版本与生成物同步 0.1.3；新增 `scripts/check-agent-pane-contract.mjs` 入 check 链。
- **界面加载与真机点击待人工**（需退出重开 DSH Desktop 后新建会话走查）。

# 变更记录

## 2026-10-27 · 36 号 v2 补齐（指南可点+状态卡）· v0.1.1

- **指南原件链接补齐（L1–L6 / §2.5）**：`primer-data.js` 的 sources 与 evidence 表逐行改为可点链接或显式 `nolink`+note。
  - 已取得：NCCN 患者版结肠癌 PDF（56 页）、直肠癌 PDF（64 页），`kind: 'pdf'`；均实测 HTTP 200 + `application/pdf`。
  - 官方入口页：NCCN 临床版 Colon Cancer（id=1428）与 Rectal Cancer（id=1461），`entry: true` + `kind: 'hub'`，注明需自行注册。
  - 二次来源：CSCO 2026 版 MedSci 收录摘要页（`kind: 'hub'`，注明非官方全文）；ClinicalTrials.gov 检索入口（`kind: 'registry'`）。
  - 未取得（`nolink`+note）：CSCO 2025（官方无公开免费全文）、ESMO 2026 更新（原文/DOI 待取得）、AJCC 8th ed（付费手册，章节 DOI 已 Deleted）、NCCN 中文译本。
  - 链接断言 29 项结构全过；`--http` 实测 PDF 均为 `application/pdf`。
- **状态卡四件（§2.6）**：看板首卡新增 `D+N 状态卡`，含卡头、锚点派生大字天数、现状行（阶段原文+状态+下次）、出口按钮排（主按钮进治疗周期 + 「疾病概要：结直肠癌是什么？」）；无锚点时显示「待初始化」并指向三步初始化。天数由档案日期派生，不手填。
- **顶栏「?」手写（L40/L41）**：原型与开发版 `.top-actions` / `.tb-actions` 各手写一个最小 `data-primer-open` 按钮，不补 class/aria（由模块接管补齐）；`index.html` 其余骨架保持原样。
- **模式件同步**：`primer.js` / `primer.css` 覆盖为 starter 2026-10-27 版（含 §2.5 链接渲染、§4.3 排版、P9 对齐）；开发版 `public/` 同步同一份三件套。
- **闸门**：新增 `scripts/check-primer-links.mjs`（starter L1–L12 版）并接入 `npm run check`；`scripts/probe-disease-primer.mjs` 更新为 P1–P9 + E0。

## 2026-10-21 · 装机目标更正（仍是 v0.1.0 开发版，不升版本）

- **更正 2026-10-20 的装机结论**：DSH Desktop 0.12.0 实际加载的是 app **自己**的 Harness `~/Library/Application Support/dsh-desktop/harness/profiles/web`；`~/.dsh/profiles/*` 是 CLI 侧另一份 Harness，Desktop 不读。判据两条：全部已装工作台都在前者；app 写的 `desktop-workbenches/market-installs.json` 只在它下面。
- `scripts/check-install.mjs` 改为**自动探测基准目录**（Desktop Harness → `DSH_HOME` → `~/.dsh`，逐个打印判定依据），新增 `--profile`，并核对 `market-installs.json` 以区分「市场安装 / 手工 native 安装」。正反两例已在本机验证（exit 0 / exit 1）。
- `docs/RELEASE.md` 装机段同步改为 `DSH_HOME` + `profiles/web`；换机器、换 Desktop 版本或用户改过 Harness 位置时，先跑脚本看基准目录，不要照抄命令。

## 2026-10-20 · 开发版 v0.1.0（需求确认后第一轮）

按 [docs/DEV-REQUIREMENTS-2026-10-20.md](docs/DEV-REQUIREMENTS-2026-10-20.md) 的七条要求落地：

- **一图秀/指标卡与原型同源**：`public/` 与 `prototypes/v0.2/` 逐视图 HTML 比对（11 视图 × 2 档案 × 全部二级页签）；指标卡改为 3D 合同（整卡 180°、`perspective:1100`、480ms、双面 `backface-visibility`、隐藏面 `aria-hidden`、Enter/Space 可翻、分类记录不翻）。
- **双档案 6 个月**：A/B 两套演示数据覆盖 2026-04-20 → 2026-10-18，420 个数据点；化验/体征 2–4 周一记，影像按真实频率。
- **顶栏三段式 + AI 面板可调宽**：品牌+版本 chip 归左、一句说明居中、操作组贴右；主按钮五态；面板 25%–45% 可拖、可 ←/→、可窄/标准/宽、松手记忆（来源 `lib/layout.js` 的 `AGENT_PANE`）。
- **DSH 加载链路**：`dsh/index.js` 在 `/api/colorectal` 下挂 `/bootstrap`、`/health`、`/ui/*`；`lib/client.js` 用 iframe 指向同一份 UI；前端按自身路径推接口基址。
- **装机不再装错位置**：新增 `scripts/check-install.mjs` 与 `docs/RELEASE.md` 装机段，明确 `dsh.client.platform="web"` 是运行环境、装机目录必须是 `~/.dsh/profiles/desktop`。
- 修复：读模型按 rowid 还原插入顺序（metrics/trials/日记），`band` 字段统一显式出现；图标别名兜底（`records/review/labs`），不再产生 `d="undefined"` 的空 path；页脚贴底。

校验：`npm run check` 全过（21 个单测 0 失败、文案红线 0 处、schema 冻结合同一致、包结构 staticPass）。

## 2026-10-20 · 开发快照（包版本 0.1.0）

- 新增独立业务服务、SQLite迁移草案、工作区与读模型、前端页面及测试；更新模拟资料生成器与开发检查脚本。schema冻结登记和模拟档案parity尚未通过，按开发分支保存。
- `npm run check`：未通过（退出码1）。
- `npm test`：未通过（退出码1）；tests=20, pass=19, fail=1。
- 已知问题：`schema/0001_initial.sql`缺冻结合同登记；`profiles`读模型与demo-data.js的parity测试不一致。未代填审批/冻结记录，未修改测试来绕过失败。
- 详细范围见 [Git同步记录](docs/GIT-SYNC-2026-10-20.md)；本次未创建正式发布tag。
