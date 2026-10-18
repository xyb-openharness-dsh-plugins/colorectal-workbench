// Community AI-panel contract example. No host API calls, no session creation, no authorization.
// Why this file exists: the workbench never implements its own chat. It asks the DSH host for a
// native conversation node and mounts it. This file only decides *when* that slot may be shown,
// *what* the panel says about its own state, and *what exact prompt text* would be handed over.

export const AGENT_PANEL = Object.freeze({
  // DSH contract 02 §布局先选再实现: "用户主动请求 AI 才显示宿主传入的 conversation 节点".
  // So the panel starts closed on every launch; remembering it in localStorage is a UI preference,
  // never evidence that a session exists.
  defaultOpen: false,
  minWidthPx: 320,
  maxWidthPx: 520,
  defaultWidthPx: 400,
  // Below this viewport width the docked column would squeeze the business area into overflow,
  // so the panel becomes an overlay drawer instead of stealing layout space.
  drawerBelowPx: 900,
  promptVersion: '1.0.0',
  allowedOutput: ['事实摘要', '需核实内容', '可执行的下一步', '来源'],
})

const clampWidth = (px) => Math.min(AGENT_PANEL.maxWidthPx, Math.max(AGENT_PANEL.minWidthPx, Math.round(px)))

/**
 * @param {object} input
 * @param {boolean} input.requested  user pressed the AI button in this instance
 * @param {{code:string,tone:string,label:string}} input.sessionView  session part of deriveWorkbenchStatus()
 * @param {number} input.viewportPx
 * @param {number} input.widthPx
 * @param {boolean} input.slotReady  host handed over (or will hand over) a conversation node
 */
export function deriveAgentPanel(input = {}) {
  const {
    requested = false,
    sessionView = { code: 'session-none', tone: 'neutral', label: '尚无原生对话' },
    viewportPx = 1440,
    widthPx = AGENT_PANEL.defaultWidthPx,
    slotReady = false,
  } = input

  const visible = requested === true
  const mode = !visible ? 'hidden' : viewportPx < AGENT_PANEL.drawerBelowPx ? 'drawer' : 'docked'

  if (!visible) {
    return {
      visible: false, mode: 'hidden', widthPx: clampWidth(widthPx),
      canSend: false, header: { tone: 'neutral', label: '未显示' },
      notice: null, primaryAction: null, secondaryAction: null,
    }
  }

  const width = clampWidth(widthPx)
  const bound = sessionView.code === 'session-bound'
  const canSend = bound && slotReady === true

  let notice = null
  let primaryAction = null
  let secondaryAction = null

  if (canSend) {
    notice = { tone: 'neutral', label: '已挂载宿主会话', hint: '消息从宿主的会话窗口发出；本工作台不代发、不代读聊天内容。' }
    primaryAction = { kind: 'compose', label: '整理本页要点并放入草稿' }
  } else if (sessionView.code === 'session-preview') {
    notice = {
      tone: 'neutral',
      label: sessionView.label,
      hint: '桌面端之外没有宿主会话。业务功能全部可用，对话需回到 Desktop 打开本工作台。',
    }
  } else if (sessionView.code === 'session-unavailable') {
    notice = { tone: 'warning', label: sessionView.label, hint: '归属校验暂不可用。不反复新建会话，避免旧会话被替换。' }
    secondaryAction = { kind: 'retry', label: '重试一次检查' }
  } else if (sessionView.code === 'session-no-project') {
    notice = { tone: 'neutral', label: sessionView.label, hint: '先在工作台选择一个业务项目，再绑定会话。' }
  } else if (sessionView.code === 'session-other') {
    notice = { tone: 'warning', label: sessionView.label, hint: '项目已有会话，但当前对话不是它。' }
    secondaryAction = { kind: 'resume', label: '打开该项目的会话' }
  } else if (sessionView.code === 'session-bound') {
    notice = { tone: 'warning', label: '会话已绑定但未拿到会话节点', hint: '宿主尚未传入 conversation 节点；此时不显示可用输入框。' }
    secondaryAction = { kind: 'retry', label: '重新取一次' }
  } else {
    notice = { tone: 'neutral', label: sessionView.label, hint: '需要时再建；业务浏览与记录不受影响。' }
    secondaryAction = { kind: 'create', label: '新建本次会话' }
  }

  return { visible, mode, widthPx: width, canSend, header: sessionView, notice, primaryAction, secondaryAction }
}

/**
 * Builds the exact text that would be handed to the host draft. All fields are explicit so the
 * user can read it before sending; nothing is scraped from the DOM.
 */
export function buildPagePrompt(input = {}) {
  const {
    taskType = 'page-advice',
    subjectId = 'unknown-subject',
    page = 'unknown-page',
    promptVersion = AGENT_PANEL.promptVersion,
    facts = [],
    missing = [],
    question = '',
    sources = [],
    allowedOutput = AGENT_PANEL.allowedOutput,
    boundary = [
      '只使用上面列出的事实；没有记录到的就说"未记录"，不要推断。',
      '不做诊断、不做分期判读、不做疗效评价、不给治疗或处置建议。',
      '输出分四段，不要输出超出四段的内容。',
    ],
  } = input

  const line = (v) => (String(v).trim() === '' ? '（未填写）' : String(v))
  const factLines = facts.length
    ? facts.map((f) => `- ${f.label}：${f.value}${f.unit ? ' ' + f.unit : ''}｜日期 ${f.date ?? '未记录'}｜来源 ${f.source ?? '未记录'}`).join('\n')
    : '- 无'

  return [
    `任务类型：${taskType}`,
    `对象：${subjectId}｜页面：${page}｜提示词版本：${promptVersion}`,
    '',
    '【已确认事实】',
    factLines,
    '',
    '【缺失/不确定】',
    missing.length ? missing.map((m) => `- ${m}`).join('\n') : '- 无',
    '',
    '【来源清单】',
    sources.length ? sources.map((s) => `- ${s}`).join('\n') : '- 无',
    '',
    '【我的问题】',
    line(question),
    '',
    '【输出结构】',
    allowedOutput.map((o, i) => `${i + 1}. ${o}`).join('\n'),
    '',
    '【边界】',
    boundary.map((b, i) => `${i + 1}. ${b}`).join('\n'),
  ].join('\n')
}

/** Text-level boundary check. Catches copy that slipped in; it does not judge reply quality. */
export function scanBoundaryViolations(text, forbidden = FORBIDDEN_PHRASES) {
  const hits = []
  for (const phrase of forbidden) if (String(text).includes(phrase)) hits.push(phrase)
  return hits
}

export const FORBIDDEN_PHRASES = Object.freeze([
  '建议治疗', '推荐治疗', '可以停药', '无需就医', '可能复发', '预后良好', '治愈率', '生存率百分比',
])
