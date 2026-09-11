/**
 * 端到端驱动脚本 —— 在真实浏览器里操作游戏并截图。
 *
 * 这不是单元测试：它打开真实页面、用键盘真的把语句块拖走、读回界面上显示的评级。
 * 核心目标是证明「每一种 UI 可达的排列，都在界面上对应一个手写结局」——
 * 也就是用户要求的"故事细节经得起推敲"在真实界面上的样子。
 *
 *   node scripts/drive.mjs [baseUrl] [outDir]
 */
import { mkdir } from 'node:fs/promises'
import { chromium } from 'playwright'

const BASE = process.argv[2] ?? 'http://localhost:5199'
const OUT = process.argv[3] ?? '/tmp/ffwilllife-shots'

const log = (...a) => console.log(...a)
const flat = (s) => s.replace(/\s+/g, ' ').trim()

async function readRating(page) {
  return {
    mark: flat(await page.locator('.panel__rating-mark').innerText()),
    word: flat(await page.locator('.panel__rating-word').innerText()),
  }
}

/** 每个语句块的短标签，用来标识排列 */
async function blockLabels(page) {
  const texts = await page.locator('.letter__blocks .block__text').allInnerTexts()
  return texts.map((t) => flat(t).replace(/[「」]/g, '').slice(0, 7))
}

/** 仅可拖动块的正文，按当前 DOM 顺序 */
async function draggableTexts(page) {
  return (await page.locator('.block--draggable .block__text').allInnerTexts()).map(flat)
}

/**
 * dnd-kit 键盘拖拽：把第 from 个可拖块移到第 to 个位置。
 *
 * 每一步之间必须留出时间：dnd-kit 的 KeyboardSensor 在收到 Space 后
 * 要等一次 React 更新才进入拖拽态，紧接着发方向键会被丢掉。
 * 落地后再校验一次实际顺序，没动成就重试——否则驱动脚本会**静默地什么都没做**，
 * 让"六种排列都指向同一个结局"这种假象看起来像产品缺陷。
 */
async function moveDraggable(page, from, to) {
  if (from === to) return
  for (let attempt = 0; attempt < 3; attempt++) {
    const before = await draggableTexts(page)
    const handle = page.locator('.block--draggable').nth(from)
    await handle.focus()
    await page.waitForTimeout(60)
    await page.keyboard.press('Space')
    await page.waitForTimeout(140) // 等 dnd-kit 进入拖拽态
    const key = to < from ? 'ArrowUp' : 'ArrowDown'
    for (let i = 0; i < Math.abs(to - from); i++) {
      await page.keyboard.press(key)
      await page.waitForTimeout(90)
    }
    await page.keyboard.press('Space')
    await page.waitForTimeout(200)

    const after = await draggableTexts(page)
    if (after.join('|') !== before.join('|')) return
  }
  console.warn(`     ⚠️ 拖拽未生效: ${from} → ${to}`)
}

await mkdir(OUT, { recursive: true })
const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1460, height: 1000 } })

const errors = []
page.on('console', (m) => {
  if (m.type() === 'error') errors.push(m.text())
})
page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`))

await page.goto(BASE, { waitUntil: 'networkidle' })
await page.waitForSelector('.letter__blocks .block')

log('=== 1. 初始状态 ===')
log('信件标题:', await page.locator('.letter__title').innerText())
log('锚点:', flat(await page.locator('.letter__anchor').innerText()))
const base = await blockLabels(page)
base.forEach((t, i) => log(`  ${i + 1}. ${t}`))
const initial = await readRating(page)
log('初始评级:', initial.mark, '·', initial.word)
await page.screenshot({ path: `${OUT}/01-initial.png`, fullPage: true })

// ---------------------------------------------------------------------------
log('\n=== 2. 穷举全部 6 种排列（每次重载页面后重新摆位）===')
const draggableCount = await page.locator('.block--draggable').count()
log(`可拖动块: ${draggableCount} 个 → ${[1, 2, 3, 4].slice(0, draggableCount).reduce((a, b) => a * b, 1)} 种排列`)

// 用"把第 from 个可拖块移到第 to 位"的原子操作拼出目标排列
const perms = []
const permute = (arr, cur = []) => {
  if (arr.length === 0) return perms.push([...cur])
  for (let i = 0; i < arr.length; i++) {
    cur.push(arr[i])
    permute([...arr.slice(0, i), ...arr.slice(i + 1)], cur)
    cur.pop()
  }
}
permute([0, 1, 2])

const observed = []
for (const perm of perms) {
  await page.reload({ waitUntil: 'networkidle' })
  await page.waitForSelector('.block--draggable')

  // 用语句正文（在同一封信里唯一）而不是角色名来定位，
  // 否则「烈风」出现两次会导致 indexOf 取错块。
  const home = await draggableTexts(page)
  for (let target = 0; target < perm.length; target++) {
    const want = home[perm[target]]
    const current = await draggableTexts(page)
    const at = current.indexOf(want)
    if (at !== target) await moveDraggable(page, at, target)
  }

  const actual = await draggableTexts(page)
  const labels = actual.map((t) => t.slice(0, 6).replace(/[「」]/g, '')).join(' | ')
  const rating = await readRating(page)
  observed.push({ labels, ...rating })
  log(`  [${labels}] → ${rating.mark}  ${rating.word}`)
}

log(`\n共 ${perms.length} 种排列，得到 ${new Set(observed.map((o) => o.mark)).size} 种不同评级`)
const distinctEndings = new Set(observed.map((o) => o.word))
log(`对应 ${distinctEndings.size} 个不同结局名`)
if (distinctEndings.size !== perms.length) {
  log('⚠️ 存在多个排列指向同一结局：')
  for (const o of observed) log(`   [${o.perm}] → ${o.mark} ${o.word}`)
}
await page.screenshot({ path: `${OUT}/02-enumerated.png`, fullPage: true })

// ---------------------------------------------------------------------------
log('\n=== 3. 结算 ===')
await page.reload({ waitUntil: 'networkidle' })
await page.waitForSelector('.block--draggable')
await moveDraggable(page, 0, 1) // 摆出一个非初始排列
const preview = await readRating(page)
log('结算前预览:', preview.mark, '·', preview.word)
await page.locator('button.primary').click()
await page.waitForTimeout(250)
log('结算正文:', flat(await page.locator('.panel__body').innerText()).slice(0, 76), '…')
const tendency = await page.locator('.panel__tendency li').allInnerTexts()
log('角色倾向变化:')
tendency.forEach((t) => log('   ', flat(t)))
await page.screenshot({ path: `${OUT}/03-settled.png`, fullPage: true })

log('\n结算后拖动块是否已锁定:', (await page.locator('.block--draggable').count()) === 0 ? '是（已变为只读）' : '否')

// ---------------------------------------------------------------------------
log('\n=== 4. 黑话注释 ===')
const terms = page.locator('.term')
const termCount = await terms.count()
log('可悬停黑话数量:', termCount)
for (let i = 0; i < termCount; i++) {
  const el = terms.nth(i)
  log(`  「${await el.innerText()}」 → ${await el.getAttribute('title')}`)
}
if (termCount > 0) {
  await terms.first().click() // 这一句在结算后点击，验证锁定的块里黑话仍可交互
  await page.waitForTimeout(120)
  log('  点击后已学术语数:', await page.locator('.glossary-fab__count').innerText())
}

// ---------------------------------------------------------------------------
log('\n=== 5. 术语图鉴 ===')
await page.locator('.glossary-fab').click()
await page.waitForSelector('.glossary')
log('条目数:', await page.locator('.glossary__list li').count())
log('分类数:', await page.locator('.glossary__nav button').count())
log('默认选中:', await page.locator('.glossary__detail h3').innerText())
await page.locator('.glossary__head input').fill('渡劫')
await page.waitForTimeout(150)
log('搜索「渡劫」命中:', await page.locator('.glossary__list li').count())
if ((await page.locator('.glossary__list li').count()) > 0) {
  await page.locator('.glossary__list li button').first().click()
  log('  详情:', flat(await page.locator('.glossary__detail-text').innerText()).slice(0, 50), '…')
}
await page.screenshot({ path: `${OUT}/04-glossary.png`, fullPage: true })
await page.locator('.glossary__close').click()

// ---------------------------------------------------------------------------
log('\n=== 6. 全注释模式 ===')
await page.locator('.toggle input').check()
await page.waitForTimeout(150)
log('行内释义数量:', await page.locator('.term__inline').count())
await page.screenshot({ path: `${OUT}/05-full-annotation.png`, fullPage: true })

log('\n=== 7. 角色面板 ===')
const cards = await page.locator('.roster__card').allInnerTexts()
cards.forEach((c) => log('  ', flat(c).slice(0, 110)))

log('\n=== 控制台错误 ===')
log(errors.length === 0 ? '无' : errors.join('\n'))

await browser.close()
log(`\n截图已保存到 ${OUT}`)
