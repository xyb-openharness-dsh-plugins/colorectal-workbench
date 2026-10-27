/* 小畅宝 Colopal · 疾病概要数据（36 号）
 * 口径：docs/DISEASE-PRIMER.md；规范：starter docs/36-DISEASE-PRIMER.md。
 * 全部内容属第 ② 层（解释）：只写定义、文件、指南列举过的手段、已发生的变化。
 * 任何「你该怎么办」的判断都不在这里，固定出口是「这一句需要问你的医生」。
 *
 * 原件状态照实写（2026-10-27 回补 L1–L6）：
 * - NCCN 患者版 PDF 是官方免费文件，可直接下载；临床版全文需注册，只给官方入口页。
 * - CSCO 2025 官方无公开免费全文；2026 版仅有 MedSci 收录摘要（二次来源）。
 * - ESMO 2026 更新原文/DOI 未取得；AJCC 8th ed 为付费手册，结直肠章节 DOI 已 Deleted。
 */
window.DISEASE_PRIMER = {
  brand: '小畅宝 Colopal',
  name: '结直肠癌',
  en: 'Colorectal Cancer',
  updated: '2026-10-27',
  sections: [
    {
      id: 'definition',
      title: '定义',
      intro: '结直肠癌是结肠或直肠黏膜上皮来源的恶性肿瘤的统称。结肠癌与直肠癌在解剖位置、手术方式、'
        + '放疗适用与随访节奏上分开处理，所以这台工作台从建档起就把「结肠 / 直肠」分成两条线。',
      points: [
        '病理诊断与分期是档案的第一层：TNM 分期的口径来自 AJCC，本项目未取得原件，页码待核。',
        '分子分型是第二层：MMR / MSI、RAS（KRAS/NRAS）、BRAF、HER2 四项在晚期/转移情形下被指南列为必测类别（据 NCCN 患者版与 CSCO 2025 转引）。',
        '本台只把病理与分子报告的原文抄进档案；「缺失」「未检出」「未检测」三态分开记，未检测不等于阴性。',
        '肿瘤部位（结肠 / 直肠）与手术方式（是否造口）是随访与生活记录的入口，不是严重程度标签。'
      ],
      sources: [
        { org: 'NCCN', doc: 'NCCN Guidelines for Patients: Colon Cancer', version: '2025（患者版）', original: true, kind: 'pdf', page: '页码待核', url: 'https://www.nccn.org/patients/guidelines/content/PDF/colon-patient.pdf', note: '官方患者版 PDF，56 页，可直接下载' },
        { org: 'AJCC', doc: 'Cancer Staging Manual, 8th ed.（结直肠章节）', version: '2017', nolink: true, note: '付费手册；官方免费仅第 1 章 PDF（headless 校验为 THIN），结直肠章节 DOI 已 Deleted' }
      ]
    },
    {
      id: 'evidence',
      title: '医学资料规范和指南情况',
      intro: '这台工作台里出现的每一条「多久复查、查什么、分子要不要测」，都应能追到下面某一份文件。'
        + '原件取得情况逐行照实标：能直接打开的给文件链接，需要注册的给官方入口页，拿不到的写清原因。',
      table: {
        head: ['机构', '文件', '版本 / 年份', '原件', '本台的用途'],
        rows: [
          ['NCCN', 'NCCN Guidelines for Patients: Colon Cancer', '2025（患者版）', { text: '已取得：官方患者版 PDF', kind: 'pdf', url: 'https://www.nccn.org/patients/guidelines/content/PDF/colon-patient.pdf' }, '随访频率与生化监测框架'],
          ['NCCN', 'NCCN Guidelines for Patients: Rectal Cancer', '2025（患者版）', { text: '已取得：官方患者版 PDF', kind: 'pdf', url: 'https://www.nccn.org/patients/guidelines/content/PDF/rectal-patient.pdf' }, '直肠癌手术、放疗与随访路径'],
          ['NCCN', 'NCCN Guidelines · Colon Cancer（临床版）', '版本以官网为准', { text: '官方入口 · 需自行注册', kind: 'hub', note: '临床版全文需在 NCCN 官网注册后取得；本台未取得该版原件', url: 'https://www.nccn.org/guidelines/guidelines-detail?category=1&id=1428' }, '条目级出处；以注册后的临床版原文为准'],
          ['NCCN', 'NCCN Guidelines · Rectal Cancer（临床版）', '版本以官网为准', { text: '官方入口 · 需自行注册', kind: 'hub', note: '临床版全文需在 NCCN 官网注册后取得；本台未取得该版原件', url: 'https://www.nccn.org/guidelines/guidelines-detail?category=1&id=1461' }, '直肠癌条目级出处；以注册后的临床版原文为准'],
          ['CSCO', 'CSCO 结直肠癌诊疗指南', '2025（医脉通收录，直肠癌随访章节）', { text: '未取得原件', nolink: true, note: 'CSCO 官方无公开免费全文；医脉通收录页需登录，未取得可验证链接' }, '中国口径的随访频率、肝脏超声、MRI、遗传筛查'],
          ['CSCO', 'CSCO 结直肠癌诊疗指南', '2026 版（MedSci 收录摘要）', { text: '未取得原件 · 二次来源（MedSci 收录）', kind: 'hub', note: 'MedSci 指南摘要页，非 CSCO 官方全文', url: 'https://www.medsci.cn/guideline/show_article.do?id=f47a61c00523818e' }, '仅作版本监测入口，不作引用依据'],
          ['ESMO', 'ESMO Metastatic Colorectal Cancer guideline 2026 update', '2026（原文/DOI 待取得）', { text: '未取得原件', nolink: true, note: 'ESMO 官网仅栏目页；2026 更新原文/DOI 未取得' }, '仅作监测入口，不作引用依据'],
          ['AJCC', 'Cancer Staging Manual, 8th ed.（结直肠章节）', '2017', { text: '未取得原件', nolink: true, note: '付费手册；官方免费仅第 1 章 PDF，章节 DOI 已 Deleted' }, 'TNM 分期口径']
        ]
      },
      points: [
        '指南版本号必须写清：NCCN 2025 年内就有 V2 / V4 / V5 三个译本版本，条目会变。',
        '未取得原件的文件只记「存在」与「大致讲什么」，不引用其具体条文，页码写「页码待核」。',
        'CSCO 2026 版与 ESMO 2026 更新在本项目里只到「存在」这一层，不能写成「已按最新指南」。'
      ],
      sources: [
        { org: 'NCCN', doc: 'NCCN Guidelines for Patients: Colon Cancer', version: '2025（患者版）', original: true, kind: 'pdf', page: '页码待核', url: 'https://www.nccn.org/patients/guidelines/content/PDF/colon-patient.pdf', note: '官方患者版 PDF，56 页' },
        { org: 'NCCN', doc: 'NCCN Guidelines · Colon Cancer（临床版）', version: '版本以官网为准', entry: true, kind: 'hub', url: 'https://www.nccn.org/guidelines/guidelines-detail?category=1&id=1428', note: '临床版全文需在 NCCN 官网注册后取得；本台未取得该版原件' },
        { org: 'CSCO', doc: 'CSCO 结直肠癌诊疗指南', version: '2025', nolink: true, note: '官方无公开免费全文；医脉通收录页需登录' },
        { org: 'ESMO', doc: 'ESMO Metastatic Colorectal Cancer guideline 2026 update', version: '2026', nolink: true, note: '原文/DOI 待取得' }
      ]
    },
    {
      id: 'landscape',
      title: '目前治疗全景概要',
      intro: '下面按期别与线序列出指南里出现过的手段类别。这是「世界上大致有哪些办法」的地图，不是给你排的先后顺序，'
        + '也不含剂量、疗程与适用条件——那些必须由医生按你的分期、部位与分子结果决定。',
      groups: [
        {
          label: '局限期（可以手术时）',
          points: [
            '手术：结肠癌与直肠癌的切除范围与吻合方式不同；是否造口由部位与手术情形决定，本台只记录术式与造口状态。',
            '术后辅助化疗：按分期与病理高危因素分层列出，属医生判断。',
            '直肠癌放疗：新辅助或辅助放疗在指南结构中被列出；本台只记疗程与日期。',
            '非手术等待：直肠癌在特定条件下存在「观察等待」路径，本项目 2026 登记里有相关研究；是否适用属医生判断。'
          ]
        },
        {
          label: '局部晚期 / 转移后',
          points: [
            '系统治疗按分子分型与线序分组：化疗、靶向治疗、免疫治疗在不同线序中被列出。MSI-H / dMMR 与 RAS、BRAF V600E、HER2 等标志物决定分组，本台只抄报告原文，不替你选组。',
            '肝、肺转移的局部治疗与转化治疗在指南结构中被列出；具体能不能做、先后顺序属医生判断。',
            '临床研究：指南把「参加登记良好的临床试验」列为一项正式选项，不是最后手段。'
          ]
        },
        {
          label: '贯穿全程的三件事',
          points: [
            '随访节奏：按分期取值，CEA 与影像间隔在 NCCN 2025 与 CSCO 2025 里都有条目；本台只显示「指南节奏 / 你最近一次 / 参考窗口」，不发提醒。',
            'ctDNA 与 PET：NCCN 2025.V5 把 ctDNA 明确为「不做常规随访手段（仅限临床试验）」，CSCO 2025 列为可选/有争议；本台呈现为空态说明，不进待办、不画趋势。',
            '造口与排便功能、营养与运动：属随访与生活记录内容；ESMO Open 2026 有局部期结肠癌术后结构化运动的 Express Update，本台只记「做了没有、感受如何」。'
          ]
        }
      ],
      points: [
        '以上是文献与指南里列出的手段，按病期与线序排列，不代表任何一项适合你。选哪一个，这一句需要问你的医生。'
      ],
      sources: [
        { org: 'NCCN', doc: 'NCCN Guidelines for Patients: Colon Cancer', version: '2025（患者版）', original: true, kind: 'pdf', page: '页码待核', url: 'https://www.nccn.org/patients/guidelines/content/PDF/colon-patient.pdf', note: '官方患者版 PDF，56 页' },
        { org: 'CSCO', doc: 'CSCO 结直肠癌诊疗指南', version: '2025', nolink: true, note: '官方无公开免费全文；医脉通收录页需登录' }
      ]
    },
    {
      id: 'trend',
      title: '发展趋势',
      intro: '这一段只写已经发生的事：哪一版换了、哪一天公示、哪个渠道查不到。不写预测，不做评价，也不给任何倾向。',
      points: [
        '2025 年：本项目登记的 NCCN 结肠癌指南中文译本出现 V2、V4、V5 三个版本号（译本，非原文）。',
        '2025 年：CSCO 结直肠癌诊疗指南 2025 版（医脉通收录）为本项目现用的中国口径来源。',
        '2026 年：ESMO 转移性结直肠癌指南 2026 更新（Annals of Oncology；原文/DOI 待取得）；CSCO 结直肠癌指南 2026 版见 MedSci 收录摘要（状态未核验）。',
        '2026 年：ESMO Open 2026;11(2):106019 发表局部期结肠癌术后结构化运动的 Express Update（doi:10.1016/j.esmoop.2025.106019）。',
        '截至 2026-10-17：ClinicalTrials.gov 可检索到 2026 年首次公示的结直肠癌相关干预性研究 480 条，其中疾病特异 457 条、广谱篮式 23 条；ChinaDrugTrials 与 ChiCTR 本轮未采集，中国登记数未知。'
      ],
      sources: [
        { org: 'NCCN', doc: 'NCCN 结肠癌指南中文译本', version: '2025.V2 / V4 / V5', nolink: true, note: '译本，非原文；未见公开可验证页' },
        { org: 'CSCO', doc: 'CSCO 结直肠癌诊疗指南', version: '2025', nolink: true, note: '官方无公开免费全文；医脉通收录页需登录' },
        { org: 'ESMO', doc: 'ESMO Open 2026;11(2):106019（Express Update）', version: '2026', nolink: true, note: 'DOI 页在 headless 浏览器中 0 字符（THIN），按验活规则不写入；DOI:10.1016/j.esmoop.2025.106019' },
        { org: 'ClinicalTrials.gov', doc: '2026 年首次公示的结直肠癌相关干预性研究检索（2026-01-01–2026-10-17）', version: '检索日 2026-10-17', original: true, kind: 'registry', url: 'https://clinicaltrials.gov/search?cond=Colorectal+Cancer&aggFilters=studyType:int&firstPost=2026-01-01,2026-10-17', note: '一手登记检索入口；本项目自采快照' }
      ]
    }
  ]
}
