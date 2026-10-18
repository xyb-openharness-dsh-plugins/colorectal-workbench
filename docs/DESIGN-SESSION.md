# 互动设计记录

状态：设计者待对齐。继承用户已明确的决定，未核实的配置素材不自动视为设计确认。
当前阶段/范围：designer-alignment → research → scenarios → specification → independent-review → prototype → implementation；已有项目从当前未决项继续，不重复重置。
设计提示词：docs/DESIGN-PROMPT.md；设计者章程：docs/DESIGNER-BRIEF.md；实际独立审查：docs/DESIGN-REVIEW.md。
权威内容：docs/BRIEF.md、docs/SPEC.md；UI 与数据设计链接：...

| 决策 ID | 待解决的问题 | 用户已确认内容/来源 | Agent 建议及原因 | 待确认项 | 确认人/日期 | 影响功能 ID |
| --- | --- | --- | --- | --- | --- | --- |
| DESIGN-01 | ... | ... | ... | ... | ... | ... |

本轮已写入的章节：...
下一轮最关键的问题（1–3 个相关问题）：...
确认时展示的原型版本/hash、实际预览方式：...
变更：旧决定 → 新决定、原因、受影响数据/API/原型/验收项：...

用户回答后由 Agent 更新对应文档；本记录只保留决策和指向，不重复复制完整需求。

HTML原型关口：路径/版本/hash、实际预览证据、用户确认范围/原话/日期；未确认则业务开发待开始。
数据演进关口：SCHEMA变化矩阵、领域/流程/读模型边界、兼容与迁移未决项。

# 设计会话台账 · Colopal 结直肠癌

## 2026-10-18（首轮，与胃癌/食管癌/宫颈癌同批）

- **D1（用户要求）**：四癌种同批启动，「样板先行+批量」；结直肠癌为样板，本轮走 SPEC→demo→2026 数据→SQLite 完整链路。
- **D2（用户要求）**：差异化力度「中等：共享骨架+专属模块」；用户原话要点："场景核心是对该癌肿的患者关键信息维度，要体现，不能4个内容，分类细节几乎一样"。
- **D3（产品决定，待 G1 签认）**：结直肠癌第一决策点=分期+分子分型（MMR/MSI/RAS/BRAF）+转移可切除性；专属一级模块=「肠道功能与造口」；CEA 为默认主指标。
- **D4（用户要求）**：品牌走 Awareness 深蓝+文字标识（Colopal 小畅宝为占位名），Logo 位预留。
- **D5（环境事实）**：ai-spec 技能本机不存在，用 starter 的 SPEC 流程替代；taste 技能可用（demo 阶段）。
- 未决：LARS 自查是否放一期（倾向放，G1 审）；造口日记是否带照片（倾向二期，隐私与容量）。

## 2026-10-18（第二轮·demo 审阅反馈）

- **D6（用户反馈，G2 内）**：demo v0.1 一级入口细节密度不足（对照乳腺癌 demo）；动态显示与指标卡翻转未用；指标太少；未充分对齐指南。
- **D7（本轮产出）**：`docs/MONITORING-METRICS.md`——六类指标体系（A 治疗期安全 / B 疗效评估 / C 术后监测节奏 / D 分子与遗传 / E 功能长程 / F 营养生活方式），来源=NCCN 2025 patients + NCCN 2025.V2/.V4/.V5 译本 + CSCO 2025 + 五指南对比综述；二手低可信网页（CEA 每月一次等）弃用并留痕。ctDNA/PET 呈现为"指南不推荐常规"，防过度检查焦虑。
- **D8（发现的真实缺口）**：画像 A 为 dMMR，按 CSCO ≤70 岁 CRC 均进入 Lynch 筛查——demo 漏了；画像 B 用贝伐，血压/蛋白尿序列漏了。v0.2 回填。
- **AI 面板（上一需求，进行中）**：右侧 dsh 原生会话挂载位——CSS 已进 demo 文件，`examples/agent-panel.mjs` 状态机/prompt 纯函数已写；demo 内 JS 接线与文档待做，与 v0.2 回填一起交付。

- **D9（用户确认后执行，2026-10-18）**：仓库纳管 —— `github.com/xyb-openharness-dsh-plugins/colorectal-workbench`（private、MIT、main 分支，SSH samqin123）；`package.json` repository 字段由 `xyb-community/*` 占位改为 org 实址，license 由 UNLICENSED 改为 MIT 与 LICENSE 文件对齐；README 参照 xyb-workbench 体例新写（致谢小x宝社区志愿者 sam）。git 推送 ≠ 市场投稿，将来若需 public 另行授权。

- **D10（用户反馈，2026-10-18）**：v0.2 视觉风格被否定（"太丑"），指定参考淋巴瘤 demo。执行：多文件原型 v0.2 目录，CSS 以淋巴瘤为基底色值重映射，交互基因全量继承；家族视觉体系统一自此确立（后续胃/食管/宫颈批量直接复用此 style.css 映射方法）。教训：**新癌种 demo 应在首轮就继承已确认的家族视觉，不要另起炉灶**。
