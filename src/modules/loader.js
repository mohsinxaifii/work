/* Agent-run loader. An editorial frame (name, location, role, counter)
   around the name, which decodes letter by letter out of code glyphs into
   the hero's typeface. Underneath, a pipeline - prompt, model, tools,
   shipped - lights up stop by stop while one trace line steps
   through the run and the real numbers. Then the letters lift away and
   the screen wipes up. Repeat visits and recruiter mode play it at
   double speed. */

import { gsap } from 'gsap'
import { $, $$, esc, reducedMotion, isChaos } from './utils.js'
import { site } from '../data/site.js'
import { pit } from '../data/cv.js'

const GLYPHS = '{}[]<>/\\;:=+*#$&%01λ_'
const skills = pit.reduce((n, g) => n + g.items.length, 0)
// Trusted strings: the last line carries markup for the tick.
const LOG = [
  `agent · reading ${skills} skills`,
  'tools · 5 connected · guardrails on',
  'eval · dozens of sites shipped · 8× conversion',
  'run complete · 0 bugs <b>✓</b>',
]
// Pipeline stops along the ruler, at their share of the run.
const STOPS = [[0, 'prompt'], [34, 'model'], [67, 'tools'], [100, 'shipped']]

export function runLoader() {
  const el = $('[data-loader]')
  let seen = false
  try { seen = sessionStorage.getItem('seen') === '1'; sessionStorage.setItem('seen', '1') } catch {}

  if (reducedMotion) {
    el.classList.add('is-done')
    document.documentElement.classList.remove('logo-handoff')
    return Promise.resolve()
  }

  const letters = [...site.name.toUpperCase()]
  el.innerHTML = `
    <div class="cmp">
      <p class="cmp__c cmp__c--tl"><b>${esc(site.fullName)}</b></p>
      <p class="cmp__c cmp__c--tr">${esc(site.location)}</p>
      <p class="cmp__c cmp__c--bl">Software engineer · AI systems</p>
      <p class="cmp__c cmp__c--br" data-cmp-pct>000</p>
      <div class="cmp__core">
        <p class="cmp__name" aria-hidden="true">${letters.map((l) => `<span class="cmp__mask"><span class="cmp__l" data-final="${esc(l)}">${esc(l)}</span></span>`).join('')}</p>
        <div class="cmp__rule">${'<i></i>'.repeat(11)}<b data-cmp-fill></b>${STOPS.map(([at, label]) => `<span class="cmp__stop" style="left:${at}%" data-at="${at}">${label}</span>`).join('')}</div>
        <p class="cmp__log"><span data-cmp-log></span></p>
        <!-- Phones: the same pipeline, run down the screen, one log line per stop. -->
        <ol class="cmp__steps">${STOPS.map(([at, label], i) => `<li class="cmp__step" data-at="${at}"><span class="cmp__step-k">${label}</span><span class="cmp__step-v">${LOG[i]}</span></li>`).join('')}</ol>
      </div>
    </div>`
  const ls = $$('.cmp__l', el)
  const pct = $('[data-cmp-pct]', el)
  const fill = $('[data-cmp-fill]', el)
  const ticks = $$('.cmp__rule i', el)
  const stops = $$('.cmp__stop, .cmp__step', el)
  const log = $('[data-cmp-log]', el)

  // Unresolved letters flicker through code glyphs, a few times a second.
  const pending = new Set(ls)
  let last = 0
  const scramble = (time) => {
    if (time - last < 0.055) return
    last = time
    for (const l of pending) l.textContent = GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
  }

  // The letters are measured in the real face, so wait for it (max ~1.2s).
  const font = Promise.race([
    document.fonts?.load('600 100px Geist'),
    new Promise((r) => setTimeout(r, 1200)),
  ])
  // The header logo is the name's Arabic form: it steps out of the header
  // for the intro (the rest of the header stays hidden), and goes back.
  // Start at the top (index.html also turns off scroll restoration).
  scrollTo(0, 0)
  document.documentElement.classList.add('logo-handoff')
  const logo = $('[data-wordmark]')
  const slot = document.createElement('span')
  slot.className = 'nav__slot'

  // Out of the header: a slot keeps its place, and the logo is fixed over
  // the intro's name at the same shape, scaled up. The WebGL redraws at
  // each size, so it stays sharp all the way down.
  function lift() {
    const r = logo.getBoundingClientRect()
    const name = $('.cmp__name', el).getBoundingClientRect()
    slot.style.width = `${r.width}px`
    slot.style.height = `${r.height}px`
    logo.before(slot)
    const w = name.width
    const h = w * (r.height / r.width)
    // Fully clipped first, so it can't flash before the pour starts.
    gsap.set(logo, { clipPath: 'inset(-10% -5% -10% 105%)' })
    logo.classList.add('is-lifted')
    gsap.set(logo, { left: name.left + name.width / 2 - w / 2, top: name.top + name.height / 2 - h / 2, width: w, height: h })
  }
  // Back in the header: drop the fixed position and the slot.
  function home() {
    if (!slot.isConnected) return
    logo.classList.remove('is-lifted')
    gsap.set(logo, { clearProps: 'left,top,width,height,clipPath' })
    slot.remove()
    document.documentElement.classList.remove('logo-handoff')
  }

  return new Promise((resolve) => {
    const tl = gsap.timeline({
      paused: true,
      onComplete: () => {
        el.classList.add('is-done')
        el.innerHTML = ''
        el.style.backgroundColor = ''
        home()
      },
    })
    tl.timeScale(seen || !isChaos() ? 2 : 1)

    tl.from('.cmp__c', { opacity: 0, y: 6, duration: 0.5, stagger: 0.05, ease: 'power2.out' }, 0)
    tl.from('.cmp__rule', { scaleX: 0, duration: 0.6, ease: 'expo.out' }, 0.05)

    // Decode, left to right.
    ls.forEach((l, i) => tl.call(() => {
      pending.delete(l)
      l.textContent = l.dataset.final
      l.classList.add('is-set')
    }, null, 0.4 + i * 0.17))
    tl.call(() => gsap.ticker.remove(scramble), null, 0.4 + ls.length * 0.17)

    // Progress: counter, ruler and its ticks.
    const n = { v: 0 }
    tl.to(n, {
      v: 100,
      duration: 1.9,
      ease: 'power2.inOut',
      onUpdate: () => {
        pct.textContent = String(Math.round(n.v)).padStart(3, '0')
        gsap.set(fill, { scaleX: n.v / 100 })
        ticks.forEach((t, i) => t.classList.toggle('is-on', n.v >= i * 10))
        stops.forEach((s) => s.classList.toggle('is-on', n.v >= Number(s.dataset.at) - 0.5))
      },
    }, 0)

    // The build log: one line, each step rolling up over the last.
    LOG.forEach((line, i) => {
      const at = 0.1 + i * 0.5
      if (i) tl.to(log, { yPercent: -100, opacity: 0, duration: 0.18, ease: 'power2.in' }, at - 0.18)
      tl.call(() => { log.innerHTML = `› ${line}` }, null, at)
      tl.fromTo(log, { yPercent: 100, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.3, ease: 'power3.out' }, at)
    })

    // Out, in three beats. The English name lifts away right to left while
    // the logo - the name in Arabic - is lifted out of the header, laid over
    // it and poured in from the right (the way Arabic reads). Then the frame
    // fades and the logo shrinks back into its own slot in the header as the
    // page shows through. One name throughout: it never swaps for a copy.
    const out = 2.15
    tl.to([...ls].reverse(), { yPercent: -110, duration: 0.45, stagger: 0.04, ease: 'power3.in' }, out)
    tl.to(['.cmp__rule', '.cmp__log', '.cmp__steps', '.cmp__c'], { opacity: 0, duration: 0.35, ease: 'power2.in' }, out + 0.05)
    tl.call(lift, null, out + 0.1)
    tl.fromTo(logo, { clipPath: 'inset(-10% -5% -10% 105%)' }, { clipPath: 'inset(-10% -5% -10% -5%)', duration: 0.7, ease: 'power2.inOut', immediateRender: false }, out + 0.15)

    const fly = out + 1.05
    tl.to(logo, {
      left: () => slot.getBoundingClientRect().left,
      top: () => slot.getBoundingClientRect().top,
      width: () => slot.offsetWidth,
      height: () => slot.offsetHeight,
      duration: 0.95,
      ease: 'expo.inOut',
    }, fly)
    // Fade the ground in its own colour (to transparent black would go grey).
    const clear = getComputedStyle(el).backgroundColor.replace(/rgba?\(([^,]+),([^,]+),([^,)]+).*/, 'rgba($1,$2,$3, 0)')
    tl.to(el, { backgroundColor: clear, duration: 0.7, ease: 'power2.inOut' }, fly + 0.15)
    tl.add(resolve, fly + 0.3)
    tl.call(home, null, fly + 0.96)

    font.then(() => {
      // Lock each letter's box to its final glyph, so scrambling in the
      // mono face never shifts the word.
      ls.forEach((l) => l.classList.add('is-set'))
      const widths = ls.map((l) => l.getBoundingClientRect().width)
      ls.forEach((l, i) => { l.classList.remove('is-set'); l.style.width = `${widths[i]}px` })
      gsap.ticker.add(scramble)
      tl.play()
    })
  })
}
