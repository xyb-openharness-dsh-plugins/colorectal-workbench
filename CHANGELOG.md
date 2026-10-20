# 变更记录

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
