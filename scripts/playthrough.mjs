/**
 * 自动试玩 —— 在真实浏览器里按顺序通关若干封信，然后打开倾听者手记。
 *
 * 目的不是"跑测试"，而是回答三个只有真的玩过才知道的问题：
 *   1. 解锁链是否真的能推进（结算完一封，下一封是否出现在侧栏并可点击）
 *   2. 玩家能不能靠试排拿到高评级（引擎与 UI 的评级是否一致）
 *   3. 牵制引擎在真实游玩数据下会不会真的触发
 *
 *   node scripts/playthrough.mjs [baseUrl] [outDir] [maxLetters]
 */
import { mkdir } from 'node:fs/promises'
import { chromium } from 'playwright'

const BASE = process.argv[2] ?? 'http://localhost:5199'
const OUT = process.argv[3] ?? '/tmp/ffwilllife-shots'
const MAX = Number(process.argv[4] ?? 12)

const log = (...a) => console.log(...a)
const flat = (s) => s.replace(/\s+/g, ' ').trim()
const RANK = { S: 5, A: 4, B: 3, C: 2, D: 1, X: 0, echo: 0 }

async function rating(page) {
  return flat(await page.locator('.panel__rating-mark').innerText())
}
async function order(page) {
  return (await page.locator('.letter__blocks .block__text').allInnerTexts()).map(flat)
}
async function draggables(page) {
  return (await page.locator('.block--draggable .block__text').allInnerTexts()).map(flat)
}

async function moveDraggable(page, from, to) {
  if (from === to) return
  for (let attempt = 0; attempt < 3; attempt++) {
    const before = await draggables(page)
    await page.locator('.block--draggable').nth(from).focus()
    await page.waitForTimeout(50)
    await page.keyboard.press('Space')
    await page.waitForTimeout(130)
    const key = to < from ? 'ArrowUp' : 'ArrowDown'
    for (let i = 0; i < Math.abs(to - from); i++) {
      await page.keyboard.press(key)
      await page.waitForTimeout(80)
    }
    await page.keyboard.press('Space')
    await page.waitForTimeout(170)
    const after = await draggables(page)
    if (after.join('|') !== before.join('|')) return
  }
}

await mkdir(OUT, { recursive: true })
const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1460, height: 1020 } })
const errors = []
page.on('pageerror', (e) => errors.push('pageerror: ' + e.message))
page.on('console', (m) => {
  if (m.type() === 'error') errors.push(m.text())
})

await page.goto(BASE, { waitUntil: 'networkidle' })
await page.waitForSelector('.letter__blocks .block')

log('=== 侧栏初始状态 ===')
const groups = await page.locator('.channel-group').all()
log(`章节数: ${groups.length}`)
for (const g of groups) {
  const head = flat(await g.locator('.channel-group__head').innerText())
  const links = await g.locator('.letter-link').count()
  const locked = await g.locator('.letter-link--locked').count()
  log(`  ${head}  (${links} 封，锁 ${locked})`)
}

const tour = []
for (let n = 0; n < MAX; n++) {
  const title = flat(await page.locator('.letter__title').innerText())

  // 贪心试排：只要看到 S 或 A 就停下，否则继续换排列
  let best = await rating(page)
  let tries = 0
  while (RANK[best] < 4 && tries < 10) {
    const count = await page.locator('.block--draggable').count()
    if (count < 2) break
    await moveDraggable(page, tries % count, (tries + 1) % count)
    const now = await rating(page)
    if (RANK[now] > RANK[best]) best = now
    tries++
  }
  const final = await rating(page)

  await page.locator('button.primary').click()
  await page.waitForTimeout(220)

  const tendency = await page.locator('.panel__tendency li').allInnerTexts()
  tour.push({ title, rating: final, tries, tendency: tendency.map(flat) })
  log(`\n[${n + 1}] 《${title}》 试排 ${tries} 次 → ${final}`)
  for (const t of tour[tour.length - 1].tendency) log('     ', t)

  const next = page.locator('.panel__actions button.primary')
  if ((await next.count()) === 0) {
    log('      （没有下一封了）')
    break
  }
  const nextLabel = flat(await next.innerText())
  log(`      → ${nextLabel}`)
  await next.click()
  await page.waitForTimeout(200)
}

log('\n=== 试玩小结 ===')
for (const t of tour) log(`  ${t.rating}  《${t.title}》`)

log('\n=== 打开倾听者手记 ===')
await page.locator('.topbar__finale').click()
await page.waitForSelector('.finale')
await page.waitForTimeout(300)

log('\n--- 手记 ---')
log(flat(await page.locator('.finale__notebook').innerText()).slice(0, 200))

log('\n--- 维度 ---')
for (const row of await page.locator('.finale__stats dl > div').all()) {
  log('  ', flat(await row.innerText()))
}

log('\n--- 角色结局（牵制前 → 后）---')
for (const li of await page.locator('.outcome').all()) log('  ', flat(await li.innerText()))

log('\n--- 谁压住了谁 ---')
const pressures = await page.locator('.finale__pressure li').allInnerTexts()
log(pressures.length ? pressures.map((t) => '  ' + flat(t)).join('\n') : '  （未触发牵制）')

const coexists = await page.locator('.finale__coexist li').allInnerTexts()
log('\n--- 共存结局 ---')
log(coexists.length ? coexists.map((t) => '  ' + flat(t)).join('\n') : '  （未触发）')

await page.screenshot({ path: `${OUT}/08-playthrough-finale.png`, fullPage: true })
log('\n控制台错误:', errors.length ? errors.join('\n') : '无')
await browser.close()
