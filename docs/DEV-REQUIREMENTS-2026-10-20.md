# 开发版需求清单（2026-10-20 确认，v0.1.0 开发基线）

原型 `prototypes/v0.2/` 已确认通过（G2）。以下是进入开发版时开发者逐条点名的要求，开发与验收都以此为准；每条都写了「做什么」和「怎么验」，验收不靠"看起来差不多"。

| # | 要求 | 做什么 | 怎么验 |
| --- | --- | --- | --- |
| 1 | tar 包登记目标必须是 **Desktop 实际加载的 Harness profile**（2026-10-21 更正：原写"固定 `~/.dsh/profiles/desktop`"是错的——那是 CLI 侧的 desktop profile，Desktop 不读） | `dsh.client.platform` 按官方检查器要求保持 `"web"`（指客户端运行环境，与装机目录无关）；装机目录＝Desktop 自己 Harness 的活动 profile，本机为 `~/Library/Application Support/dsh-desktop/harness/profiles/web`，并写进**那个** profile 的 `dsh.profile.bundles` | `node scripts/check-install.mjs`：自动探测基准目录，dependencies + bundles 都有本包才返回 0；装在别处会报错并打印本机正确命令 |
| 2 | 保留 **2 套模拟数据**，时间跨度 **6 个月** | A 陈先生（ⅢB / dMMR / 临时回肠造口）、B 王女士（Ⅳ 期 / KRAS G12D / 转化治疗），都覆盖 2026-04-20 → 2026-10-18；化验/体征每 2–4 周一点，影像按真实频率 | `test/store.test.mjs` ③ parity（库 ↔ demo-data.js 逐字段一致）+ 档案切换后看板/一图秀都能渲染 |
| 3 | **一图秀严格按设计原型** | 统一画布常量、单调三次插值、每指标独立配色、治疗泳道与评估标记、末点防叠字、缩放 40–100%、pin 详情，逐项与原型一致 | `test/ui-parity.test.mjs` ① 逐视图比 HTML（含 timeline 全子页签 × 2 档案）；配色/无过冲另由 `/tmp/check-monotone.mjs` 一类专项脚本守 |
| 4 | 首页右上角控制区 **严格按 starter 设计**；AI 按钮可 **打开 / 隐藏 / 调宽** | 顶栏三段式（左定位＝品牌+版本 chip、中一句说明、右主操作组贴右缘）；主按钮五态文案固定；面板 25%–45% 可拖、可键盘 ←/→、可窄/标准/宽预设、松开记忆 | `test/ui-parity.test.mjs` ⑨：三段顺序、chip 在左、`flex:1`/`margin-left:auto`、五态文案、`role="separator"` + aria 区间、拖动/键盘/记忆代码齐备；真机再验一遍拖动手感 |
| 5 | 3D 指标卡按 **24-METRIC-TREND-TAB-DESIGN** | 整卡点击 180° 翻面（再点返回）、`perspective:1100px`、480ms `cubic-bezier(.2,.7,.2,1)`、双面 `backface-visibility:hidden`、隐藏面 `aria-hidden`、键盘 Enter/Space 可翻、分类记录不翻不连线 | 卡片 HTML：`role="group" tabindex="0" data-flipped`；样式：`.mcard[data-flipped="true"]` 规则；`prefers-reduced-motion` 直接切终态 |
| 6 | hero 区 AI 入口不能是竖块 | 图标与文字同一行（`inline-flex` + svg 定尺寸） | 看板 hero 三个按钮等高、同一基线；`test/ui-parity.test.mjs` ① 覆盖（原型同步修，两份一致） |
| 7 | 顶栏中间不许出现说明外的文字 | 说明只放 `#top-hint` 一句；不渲染注释/TODO/提示条 | ⑨ 断言中区只有 `.tb-hint`；截图核对 |

## 与本清单同时生效的家族约定

- **数据唯一来源**：`demo/build-demo-data.mjs` → `prototypes/v0.2/demo-data.js` + `demo/demo-data.sqlite`；开发版从 `GET /api/bootstrap` 读同一份结构，读模型不得"顺手优化"字段。
- **接口基址**：页面在 `/` 时为空串，在 `/api/colorectal/ui/` 时为 `/api/colorectal`（`dsh/index.js` 的 `API_PREFIX` 是唯一来源）。
- **面板参数**：`lib/layout.js` 的 `PANEL` / `AGENT_PANE` 是唯一来源；客户端里的字面量由测试比对，不许各写一份。
- **文案红线**：不写"建议治疗 / 可能复发 / 可以停药 / 无需就医"这类处置性表述；`npm run check` 会扫。
- **不替代临床判断**：所有分级/趋势都是派生展示，页面上的"我的看法"始终标注不是医生结论。

## 本版明确未做（不许在验收里算通过）

- DSH 真机装机（V2）：需要打 tar、装进 desktop profile、重启 Desktop 后人工确认；本清单只保证"装错位置会被脚本拦下"。
- 定制顶栏与可拖会话栏在 **DSH 标准分栏下的宿主侧行为**：宿主只认注册时的 `businessWidth`，页面内的拖动只作用于页面自绘面板（dev-server / 预览）。要在 Desktop 里拥有可拖会话栏，得改 `customFrame=true` 并接管原生会话节点——留给 M5 决策。
- MinerU 真实解析、导出 PDF/DOCX、云端同步：均未实现。
