# 变更记录

## 2026-10-20 · 开发快照（包版本 0.1.0）

- 新增独立业务服务、SQLite迁移草案、工作区与读模型、前端页面及测试；更新模拟资料生成器与开发检查脚本。schema冻结登记和模拟档案parity尚未通过，按开发分支保存。
- `npm run check`：未通过（退出码1）。
- `npm test`：未通过（退出码1）；tests=20, pass=19, fail=1。
- 已知问题：`schema/0001_initial.sql`缺冻结合同登记；`profiles`读模型与demo-data.js的parity测试不一致。未代填审批/冻结记录，未修改测试来绕过失败。
- 详细范围见 [Git同步记录](docs/GIT-SYNC-2026-10-20.md)；本次未创建正式发布tag。
