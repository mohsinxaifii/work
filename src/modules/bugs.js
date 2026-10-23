/* Footer mini-game: bugs wander the strip and scatter from the cursor.
   Squash them. The score resets daily, as bug counts should. */

import { gsap } from 'gsap'
import { $, store, whileVisible, isChaos } from './utils.js'
import { play } from './sound.js'
import { toast } from './toast.js'

const BUG = `<svg viewBox="0 0 24 24" aria-hidden="true">
  <ellipse cx="12" cy="14" rx="6" ry="7.5"/><circle cx="12" cy="5.5" r="3"/>
  <path d="M6 11 2 8.5M6 14.5H1.5M6.5 18.5 3 21M18 11l4-2.5M18 14.5h4.5M17.5 18.5 21 21M10.5 3 9 .5M13.5 3 15 .5"
    stroke="currentColor" stroke-width="1.6" fill="none" stroke-linecap="round"/></svg>`

const COUNT = 6

export function initBugs() {
  const area = $('[data-bugs]')
  const scoreEl = $('[data-bug-score]')
  const today = new Date().toDateString()
  let score = store.get('bugs', {}).day === today ? store.get('bugs', {}).n : 0
  scoreEl.textContent = score

  let W = area.clientWidth
  let H = area.clientHeight
  new ResizeObserver(() => { W = area.clientWidth; H = area.clientHeight }).observe(area)

  const mouse = { x: -999, y: -999 }
  area.addEventListener('pointermove', (e) => {
    const r = area.getBoundingClientRect()
    mouse.x = e.clientX - r.left
    mouse.y = e.clientY - r.top
  })
  area.addEventListener('pointerleave', () => { mouse.x = mouse.y = -999 })

  const spawn = (b) => {
    b.x = Math.random() < 0.5 ? -20 : W + 20
    b.y = 30 + Math.random() * (H - 60)
    b.a = b.x < 0 ? 0 : Math.PI
    b.speed = 0.8 + Math.random() * 0.9
    b.dead = false
    b.el.classList.remove('is-squashed')
    gsap.set(b.el, { scale: 1, opacity: 1 })
  }

  const bugs = Array.from({ length: COUNT }, () => {
    const el = document.createElement('button')
    el.type = 'button'
    el.className = 'bug'
    el.setAttribute('aria-label', 'Squash bug')
    el.innerHTML = BUG
    area.appendChild(el)
    const b = { el, x: 0, y: 0, a: 0, speed: 1, dead: false }
    spawn(b)
    b.x = Math.random() * W
    el.addEventListener('pointerdown', (e) => { e.preventDefault(); squash(b) })
    el.addEventListener('click', () => squash(b))
    return b
  })

  function squash(b) {
    if (b.dead) return
    b.dead = true
    b.el.classList.add('is-squashed')
    play('squash')
    score++
    scoreEl.textContent = score
    store.set('bugs', { day: today, n: score })
    if (score === 10) toast('10 bugs fixed')
    if (score === 50) toast('50 bugs fixed. Impressive.')

    const splat = document.createElement('span')
    splat.className = 'splat'
    splat.style.left = `${b.x}px`
    splat.style.top = `${b.y}px`
    area.appendChild(splat)
    gsap.fromTo(splat, { scale: 0.2 }, { scale: 1.4, opacity: 0, duration: 0.9, ease: 'expo.out', onComplete: () => splat.remove() })
    gsap.to(b.el, { scaleY: 0.2, scaleX: 1.4, opacity: 0, duration: 0.35, onComplete: () => setTimeout(() => spawn(b), 900) })
  }

  const tick = (_t, dt) => {
    const k = dt / 16.67
    for (const b of bugs) {
      if (b.dead) continue
      const dx = b.x - mouse.x
      const dy = b.y - mouse.y
      const d = Math.hypot(dx, dy)
      let speed = b.speed
      if (d < 110) {
        // Turn away from the cursor and sprint.
        const away = Math.atan2(dy, dx)
        b.a += Math.atan2(Math.sin(away - b.a), Math.cos(away - b.a)) * 0.25
        speed *= 3
      } else {
        b.a += (Math.random() - 0.5) * 0.35
      }
      b.x += Math.cos(b.a) * speed * k
      b.y += Math.sin(b.a) * speed * k
      if (b.y < 20 || b.y > H - 20) { b.a = -b.a; b.y = Math.max(20, Math.min(H - 20, b.y)) }
      if (b.x < -30 || b.x > W + 30) spawn(b)
      b.el.style.transform = `translate3d(${b.x}px, ${b.y}px, 0) rotate(${b.a + Math.PI / 2}rad)`
    }
  }

  let running = false
  whileVisible(area,
    () => { if (!running && isChaos()) { running = true; gsap.ticker.add(tick) } },
    () => { running = false; gsap.ticker.remove(tick) })
}
