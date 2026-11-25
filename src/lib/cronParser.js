// Cron 表达式与组件 UI 状态互转（Quartz 格式：秒 分 时 日 月 周 [年]，6 或 7 段）

// 字段 type 取值约定：
// every=每X  none=不指定  cycle=周期 a-b  step=从x开始每y  assign=指定（列表）
// day 专用：nearWork=最近工作日(nW)  lastDay=本月最后一天(L)
// week 专用：nth=第n周星期m(m#n)  lastWeek=本月最后一个星期x(xL)

// 创建面板默认状态：全字段"每X"，周"不指定"，年"不指定"
export function createDefaultState() {
  const y = new Date().getFullYear()
  return {
    second: { type: 'every', cycleStart: 1, cycleEnd: 2, stepStart: 0, stepValue: 1, checked: [] },
    minute: { type: 'every', cycleStart: 1, cycleEnd: 2, stepStart: 0, stepValue: 1, checked: [] },
    hour: { type: 'every', cycleStart: 1, cycleEnd: 2, stepStart: 0, stepValue: 1, checked: [] },
    day: { type: 'every', cycleStart: 1, cycleEnd: 2, stepStart: 1, stepValue: 1, nearWorkDay: 1, checked: [] },
    month: { type: 'every', cycleStart: 1, cycleEnd: 2, stepStart: 1, stepValue: 1, checked: [] },
    week: { type: 'none', cycleStart: 1, cycleEnd: 2, nthWeek: 1, nthWeekDay: 1, lastWeekDay: 1, checked: [] },
    year: { type: 'none', cycleStart: y, cycleEnd: y + 1 }
  }
}

// 解析逗号分隔的数字列表并升序去重
function parseList(str) {
  return [...new Set(str.split(',').map(Number).filter((n) => !Number.isNaN(n)))].sort((a, b) => a - b)
}

// 解析纯数字类字段（秒/分/时/月）：* / a/b / a-b / 数字列表
function parseNumberField(str) {
  if (!str || str === '*' || str === '?') return { type: 'every' }
  let m = str.match(/^(\d+)\/(\d+)$/)
  if (m) return { type: 'step', stepStart: +m[1], stepValue: +m[2] }
  m = str.match(/^(\d+)-(\d+)$/)
  if (m) return { type: 'cycle', cycleStart: +m[1], cycleEnd: +m[2] }
  if (/^[\d,]+$/.test(str)) return { type: 'assign', checked: parseList(str) }
  return { type: 'every' } // 无法识别时回退"每X"，避免面板崩溃
}

// 解析日字段：额外支持 ? / L / nW
function parseDayField(str) {
  if (str === '?') return { type: 'none' }
  if (str === 'L') return { type: 'lastDay' }
  const m = str.match(/^(\d+)W$/)
  if (m) return { type: 'nearWork', nearWorkDay: +m[1] }
  return parseNumberField(str)
}

// 解析周字段：额外支持 n#m（第 n 周的星期 m）与 nL（本月最后一个星期 n）
function parseWeekField(str) {
  if (str === '?') return { type: 'none' }
  if (str === '*') return { type: 'every' }
  let m = str.match(/^(\d+)#(\d+)$/)
  if (m) return { type: 'nth', nthWeekDay: +m[1], nthWeek: +m[2] }
  m = str.match(/^(\d+)L$/)
  if (m) return { type: 'lastWeek', lastWeekDay: +m[1] }
  return parseNumberField(str)
}

// 解析年字段：缺省/?/=不指定，* =每年，仅支持 a-b 周期
function parseYearField(str) {
  if (!str || str === '?' || str === '-') return { type: 'none' }
  if (str === '*') return { type: 'every' }
  const m = str.match(/^(\d+)-(\d+)$/)
  if (m) return { type: 'cycle', cycleStart: +m[1], cycleEnd: +m[2] }
  return { type: 'none' }
}

// 把整条 cron 表达式解析为面板状态；段数不合法返回 null（调用方回退默认状态）
export function parseCronToState(expr) {
  if (typeof expr !== 'string') return null
  const parts = expr.trim().split(/\s+/)
  if (parts.length < 6 || parts.length > 7) return null
  const state = createDefaultState()
  Object.assign(state.second, parseNumberField(parts[0]))
  Object.assign(state.minute, parseNumberField(parts[1]))
  Object.assign(state.hour, parseNumberField(parts[2]))
  Object.assign(state.day, parseDayField(parts[3]))
  Object.assign(state.month, parseNumberField(parts[4]))
  Object.assign(state.week, parseWeekField(parts[5]))
  Object.assign(state.year, parseYearField(parts[6]))
  return state
}

// "指定"值列表转 cron 片段；为空时回退 '*'
function checkedToCron(checked) {
  const arr = parseList(checked.join(','))
  return arr.length ? arr.join(',') : '*'
}

function genNumberField(f) {
  switch (f.type) {
    case 'cycle':
      return `${f.cycleStart}-${f.cycleEnd}`
    case 'step':
      return `${f.stepStart}/${f.stepValue}`
    case 'assign':
      return checkedToCron(f.checked)
    default:
      // every 与 month 的 none 都输出 *（Quartz 月字段不允许 ?）
      return '*'
  }
}

function genDayField(f) {
  switch (f.type) {
    case 'none':
      return '?'
    case 'cycle':
      return `${f.cycleStart}-${f.cycleEnd}`
    case 'step':
      return `${f.stepStart}/${f.stepValue}`
    case 'nearWork':
      return `${f.nearWorkDay}W`
    case 'lastDay':
      return 'L'
    case 'assign':
      return checkedToCron(f.checked)
    default:
      return '*'
  }
}

function genWeekField(f) {
  switch (f.type) {
    case 'none':
      return '?'
    case 'cycle':
      return `${f.cycleStart}-${f.cycleEnd}`
    case 'nth':
      return `${f.nthWeekDay}#${f.nthWeek}`
    case 'lastWeek':
      return `${f.lastWeekDay}L`
    case 'assign':
      return checkedToCron(f.checked)
    default:
      return '*'
  }
}

// 由面板状态生成完整 cron 表达式（年"不指定"时输出 6 段）
export function generateCronFromState(state) {
  let day = genDayField(state.day)
  let week = genWeekField(state.week)
  // Quartz 要求日与周互斥（最多一个生效，另一个必须为 ?），这里统一修正：
  // 周指定具体规则时日让位为 ?；日指定具体规则时周让位为 ?；两者都"每天"则周变 ?；都"不指定"则周变 * 兜底
  const weekSpecific = week !== '*' && week !== '?'
  const daySpecific = day !== '*' && day !== '?'
  if (weekSpecific) day = '?'
  else if (daySpecific) week = '?'
  else if (day === '?' && week === '?') week = '*'
  else if (day === '*' && week === '*') week = '?'
  const parts = [
    genNumberField(state.second),
    genNumberField(state.minute),
    genNumberField(state.hour),
    day,
    genNumberField(state.month),
    week
  ]
  // 年"不指定"输出 6 段表达式
  if (state.year.type === 'cycle') parts.push(`${state.year.cycleStart}-${state.year.cycleEnd}`)
  else if (state.year.type === 'every') parts.push('*')
  return parts.join(' ')
}
