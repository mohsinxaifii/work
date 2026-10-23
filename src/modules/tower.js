/* ==================================================================
   TOWER - the "mohsin" easter egg. Stack sliding floors into a Dubai
   tower: whatever hangs over the floor below is sliced off, so the
   tower narrows as it climbs, like the Burj. A drop within a few
   pixels is "perfect" and keeps the full width. Click, tap or Space
   to drop; Esc closes. Best score is kept per visitor.
   ================================================================== */

import { $, store } from './utils.js'
import { play } from './sound.js'

const L = 400         // logical canvas width
const H = 600         // logical canvas height
const FLOOR = 26      // floor height
const BASE_Y = H - 70 // top of the ground floor on screen
const PERFECT = 5     // px of slack that still counts as perfect
const BURJ = 163

let open = false

export function openTower() {
  if (open) return
  open = true

  const overlay = document.createElement('div')
  overlay.className = 'tower-overlay'
  overlay.setAttribute('role', 'dialog')
  overlay.setAttribute('aria-label', 'Build the tower: a stacking game')
  overlay.innerHTML = `
    <div class="tower">
      <div class="tower__hud">
        <span class="label">Build the Burj <span class="ar" lang="ar">برج</span></span>
        <span class="label">Floors <b data-tower-score>0</b> · Best <b data-tower-best>${store.get('tower-best', 0)}</b></span>
      </div>
      <canvas class="tower__canvas" data-tower-canvas></canvas>
      <p class="tower__hint label" data-tower-hint>click, tap or space to drop a floor</p>
      <div class="tower__over" data-tower-over hidden>
        <p class="tower__big" data-tower-result></p>
        <p class="tower__sub" data-tower-sub></p>
        <div class="tower__actions">
          <button class="btn btn--sm btn--line" type="button" data-tower-again>Again</button>
          <a class="btn btn--sm btn--accent" href="#enquiry" data-tower-close>Let's build something real →</a>
        </div>
      </div>
      <button class="tower__x" type="button" data-tower-close aria-label="Close">✕</button>
    </div>`
  document.body.appendChild(overlay)
  requestAnimationFrame(() => overlay.classList.add('is-on'))
  play('whoosh')

  const canvas = $('[data-tower-canvas]', overlay)
  const ctx = canvas.getContext('2d')
  const scoreEl = $('[data-tower-score]', overlay)
  const bestEl = $('[data-tower-best]', overlay)
  const overEl = $('[data-tower-over]', overlay)
  const hintEl = $('[data-tower-hint]', overlay)

  const size = () => {
    const r = canvas.getBoundingClientRect()
    const dpr = Math.min(devicePixelRatio, 2)
    canvas.width = Math.round(r.width * dpr)
    canvas.height = Math.round(r.height * dpr)
    ctx.setTransform(canvas.width / L, 0, 0, canvas.height / H, 0, 0)
  }
  size()
  addEventListener('resize', size)

  let floors, cur, debris, cam, over, flash, raf, last

  function reset() {
    floors = [{ x: L * 0.2, w: L * 0.6, perfect: false }]
    debris = []
    cam = 0
    over = false
    flash = 0
    spawn()
    scoreEl.textContent = '0'
    overEl.hidden = true
    hintEl.hidden = false
  }

  function spawn() {
    const top = floors.at(-1)
    const fromLeft = floors.length % 2 === 1
    cur = {
      x: fromLeft ? -top.w * 0.4 : L - top.w * 0.6,
      w: top.w,
      dir: fromLeft ? 1 : -1,
      speed: 2.2 + (floors.length - 1) * 0.11,
    }
  }

  function drop() {
    if (over) return
    hintEl.hidden = true
    const top = floors.at(-1)
    if (Math.abs(cur.x - top.x) <= PERFECT) {
      floors.push({ x: top.x, w: top.w, perfect: true })
      flash = 1
      play('success')
    } else {
      const left = Math.max(cur.x, top.x)
      const right = Math.min(cur.x + cur.w, top.x + top.w)
      const overlap = right - left
      const level = floors.length
      if (overlap <= 0) {
        debris.push({ x: cur.x, w: cur.w, level, vy: 0, rot: 0, spin: cur.dir * 0.02 })
        return end()
      }
      // Slice off the overhang and let it tumble.
      const cutX = cur.x < top.x ? cur.x : right
      debris.push({ x: cutX, w: cur.w - overlap, level, vy: 0, rot: 0, spin: (cur.x < top.x ? -1 : 1) * 0.03 })
      floors.push({ x: left, w: overlap, perfect: false })
      play('tick')
    }
    scoreEl.textContent = String(floors.length - 1)
    spawn()
  }

  function end() {
    over = true
    play('nope')
    const n = floors.length - 1
    const best = Math.max(n, store.get('tower-best', 0))
    store.set('tower-best', best)
    bestEl.textContent = String(best)
    $('[data-tower-result]', overlay).textContent = `${n} floor${n === 1 ? '' : 's'}.`
    $('[data-tower-sub]', overlay).textContent = n >= BURJ
      ? 'Taller than the Burj. Okay, you should be building with me.'
      : `The Burj has ${BURJ}. Imagine what we'd build together.`
    overEl.hidden = false
  }

  const screenY = (level) => BASE_Y - level * FLOOR + cam

  function drawFloor(x, y, w, perfect) {
    ctx.fillStyle = perfect ? '#3FB97A' : '#F1F0E8'
    ctx.fillRect(x, y, w, FLOOR - 2)
    // Windows, so it reads as a building rather than a bar.
    ctx.fillStyle = perfect ? 'rgba(13,13,11,.28)' : 'rgba(13,13,11,.18)'
    for (let wx = x + 5; wx < x + w - 6; wx += 11) ctx.fillRect(wx, y + 7, 5, 9)
  }

  function frame(t) {
    const dt = Math.min(2.5, (t - (last || t)) / 16.67)
    last = t

    if (!over) {
      cur.x += cur.speed * cur.dir * dt
      if (cur.x > L - cur.w * 0.25) cur.dir = -1
      if (cur.x < -cur.w * 0.75) cur.dir = 1
    }
    // Keep the top of the tower around the middle of the screen.
    const target = Math.max(0, (floors.length + 1) * FLOOR - H * 0.5)
    cam += (target - cam) * 0.08 * dt
    flash = Math.max(0, flash - 0.04 * dt)

    ctx.clearRect(0, 0, L, H)
    ctx.fillStyle = '#12120F'
    ctx.fillRect(0, 0, L, H)
    if (flash) { ctx.fillStyle = `rgba(212,255,58,${flash * 0.12})`; ctx.fillRect(0, 0, L, H) }

    // Ground.
    ctx.fillStyle = '#2A2A26'
    ctx.fillRect(0, screenY(0) + FLOOR, L, H)

    floors.forEach((f, i) => drawFloor(f.x, screenY(i), f.w, f.perfect))
    if (!over) drawFloor(cur.x, screenY(floors.length), cur.w, false)

    debris = debris.filter((d) => {
      d.vy += 0.5 * dt
      d.level -= d.vy * dt / FLOOR
      d.rot += d.spin * dt
      const y = screenY(d.level)
      ctx.save()
      ctx.translate(d.x + d.w / 2, y + FLOOR / 2)
      ctx.rotate(d.rot)
      ctx.globalAlpha = 0.85
      drawFloor(-d.w / 2, -FLOOR / 2, d.w, false)
      ctx.restore()
      return y < H + 60
    })

    raf = requestAnimationFrame(frame)
  }

  const onKey = (e) => {
    if (e.key === 'Escape') close()
    else if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); over ? reset() : drop() }
  }
  canvas.addEventListener('pointerdown', (e) => { e.preventDefault(); over ? reset() : drop() })
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay || e.target.closest('[data-tower-close]')) close()
    if (e.target.closest('[data-tower-again]')) reset()
  })
  addEventListener('keydown', onKey)

  function close() {
    cancelAnimationFrame(raf)
    removeEventListener('keydown', onKey)
    removeEventListener('resize', size)
    overlay.classList.remove('is-on')
    setTimeout(() => { overlay.remove(); open = false }, 400)
  }

  reset()
  raf = requestAnimationFrame(frame)
}
