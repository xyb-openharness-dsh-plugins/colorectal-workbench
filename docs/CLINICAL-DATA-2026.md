# 2026 结直肠癌临床研究资料包说明

资料包位置：[unified_search_trials/research/colorectal-cancer/README.md](/Users/qinxiaoqiang/Downloads/unified_search_trials/research/colorectal-cancer/README.md)。SQLite 文件为 `colorectal_cancer_trials_2026.sqlite`（sha256 前 16 位 `be472b3358aae1cd`）。

## 设计/开发阶段可用内容

- **480 条** 2026 年首次公示的结直肠癌相关干预性研究：ClinicalTrials.gov 480 条（疾病特异 457 + 广谱篮式 23）；ChinaDrugTrials 与 ChiCTR 本轮未采集。
- 主题覆盖：MSI-H/dMMR 免疫分层、BRAF V600E 一线联合、RAS 突变靶向、HER2、ADC、肝肺转移局部治疗与转化、直肠癌非手术等待、造口与排便功能支持、术后结构化运动（CHALLENGE 落地）。
- 每条记录保存注册库、登记号、首次公示日期、状态/类型、分期、标题、疾病、干预、国家、摘要、入排标准、来源与覆盖声明；未保留 PI 电话/邮箱等直接联系字段。

## 重要限制

1. 年份口径是"首次公示在 2026 年"（2026-01-01 至 2026-10-17），不是试验启动或结果发表年份。
2. 仅干预性研究；观察性研究未采集。
3. **ChinaDrugTrials 与 ChiCTR 未采集**：中国登记 2026 记录数未知，不能推断全量；"未命中"不是"不存在"。
4. 试验登记不证明方案有效、安全、获批或开放入组；涉及具体患者由专业团队判断，并回源核实登记状态与纳排标准。
5. 该库未接入 HTML 原型的临床研究页、结直肠癌工作台业务数据层或 `unified_search_trials` 在线 MCP 注册表；是设计阶段离线资料夹具。原型 `prototypes/v0.1` 临床研究页中的行是**模拟行**，真实接入需另做许可、同步、去重与临床审核。

## 2026 指南监测入口

- ESMO 转移性结直肠癌指南 2026 更新（Annals of Oncology；原文/DOI 待取得）。
- ESMO Open 2026;11(2):106019 —— 局部期结肠癌术后结构化运动 Express Update（doi:10.1016/j.esmoop.2025.106019）。
- CSCO 结直肠癌指南 2026 版状态未核验。

以上来源地区适用边界不同；在取得并核对中国现行指南全文之前，工作台不得生成任何"按最新指南"的治疗解释内容。
