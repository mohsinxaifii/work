/* Hero: a huge headline whose last word cycles, ringed by a collage of
   small live interfaces - a code editor, outcomes flipping in Arabic, an
   AI chat that types, a deploy terminal and the conversion chart. Each
   card drifts with the
   cursor at its own depth, can be picked up and dropped (double-click
   sends it home), and scatters outward as the page scrolls, which is
   the pull to keep going. A ticker of skills, outcomes and promises and a
   scroll cue sit on the bottom edge. initPitch() builds it; the intro it returns plays after
   the loader. */

import { gsap } from 'gsap'
import { $, $$, esc, reducedMotion, finePointer, isChaos, whileVisible } from './utils.js'
import { site } from '../data/site.js'
import { hero } from '../data/hero.js'
import { waHref, waIcon } from './whatsapp.js'
import { play } from './sound.js'

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
const clock = () => new Intl.DateTimeFormat('en-GB', { timeZone: site.timezone, hour: '2-digit', minute: '2-digit' }).format(new Date())

const pitchHtml = () => `
  <p class="hero__eyebrow">
    <span class="hero__status"><i></i>Open to work</span>
    <span class="label">${esc(site.fullName)} · ${esc(site.title)} · ${esc(site.city)} <span data-clock>${clock()}</span></span>
  </p>
  <h1 class="hero__title">
    <span class="hero__line"><span>I build software</span></span>
    <span class="hero__line"><span>that <span class="hero__swap" data-swap><em>${esc(hero.words[0])}</em></span></span></span>
  </h1>
  <p class="hero__lede">${esc(hero.lede)}</p>
  <div class="hero__ctas">
    <a class="btn btn--ink" href="#work" data-cursor="scroll">See the work <span class="btn__arrow">↓</span></a>
    <a class="btn btn--wa" href="${esc(waHref)}" target="_blank" rel="noopener">${waIcon}WhatsApp me</a>
    <a class="btn btn--line" href="${esc(site.cv)}" download>Download CV</a>
  </div>`

// One card: the outer box is placed by CSS and moved by scroll and drag;
// the float inside takes the cursor drift; the UI inside that bobs.
const card = (kind, depth, inner, attrs = '') => `
  <div class="hero__card hero__card--${kind}" ${attrs}>
    <div class="hero__float" data-depth="${depth}"><div class="hero__ui">${inner}</div></div>
  </div>`

// Just enough highlighting for the editor card: comments, strings, keywords, calls.
const highlight = (line) => esc(line)
  .replace(/(\/\/.*)$/, '<i class="c">$1</i>')
  .replace(/(&#39;[^&]*&#39;)/g, '<i class="s">$1</i>')
  .replace(/\b(const|async|await|return)\b/g, '<i class="k">$1</i>')
  .replace(/\b(\w+)(?=\()/g, '<i class="f">$1</i>')

const arWord = ([ar, means], i) => `
  <span class="hero__word${i ? '' : ' is-on'}">
    <b class="ar" lang="ar" dir="rtl">${esc(ar)}</b>
    <span class="hero__say">${esc(means)}</span>
  </span>`

const stageHtml = () => [
  card('code', 0.8, `
    <span class="hero__bar hero__bar--dark"><i></i><i></i><i></i><span>launch.js</span></span>
    <pre class="hero__code">${hero.code.map((l, n) => `<span><u>${n + 1}</u>${highlight(l)}</span>`).join('\n')}<b class="hero__caret"></b></pre>`),
  card('ar', 1.3, `
    <span class="label">What you get</span>
    <span class="hero__words" data-words>${hero.arabic.map(arWord).join('')}</span>`),
  card('chat', 1.6, `
    <span class="hero__head"><b class="hero__bot">AI</b>Store assistant<i class="hero__live"></i></span>
    <div class="hero__msgs" data-chat></div>`),
  card('term', 1.1, `
    <span class="hero__bar hero__bar--dark"><i></i><i></i><i></i><span>deploy</span></span>
    <pre class="hero__term" data-term></pre>`),
  card('lift', 2, `
    <span class="label">${esc(hero.lift.label)}</span>
    <b class="hero__big"><span data-lift>${hero.lift.value}</span>${esc(hero.lift.suffix)}</b>
    <svg class="hero__chart" viewBox="0 0 200 70" preserveAspectRatio="none" aria-hidden="true">
      <path class="hero__area" d="M0 66 C40 64 70 60 100 50 S160 20 200 4 V70 H0Z"/>
      <path class="hero__line-path" pathLength="1" d="M0 66 C40 64 70 60 100 50 S160 20 200 4"/>
    </svg>`),
].join('')

const tickerItem = (t) => {
  if (typeof t === 'string') return `<span class="tk">${esc(t)}</span>`
  if (t.ar) return `<span class="tk tk--ar"><span class="ar" lang="ar" dir="rtl">${esc(t.ar[0])}</span><small>${esc(t.ar[1])}</small></span>`
  return `<span class="tk tk--say">${esc(t.say)}</span>`
}

const footHtml = () => {
  const items = hero.ticker.map(tickerItem).join('<i>✦</i>')
  return `
    <a class="hero__cue" href="#impact" aria-label="Scroll to the work"><span class="hero__mouse"><i></i></span>Scroll</a>
    <div class="hero__ticker" aria-hidden="true"><div class="hero__track">${items}<i>✦</i>${items}<i>✦</i></div></div>`
}

/* Long Arabic phrases shrink until they fit the card's width. */
function fitWords(box) {
  const fit = () => $$('.ar', box).forEach((el) => {
    el.style.fontSize = ''
    const room = el.parentElement.clientWidth
    if (el.scrollWidth > room) el.style.fontSize = `${(parseFloat(getComputedStyle(el).fontSize) * room) / el.scrollWidth}px`
  })
  fit()
  document.fonts?.ready.then(fit)
  addEventListener('resize', fit)
}

/* The Arabic card: one word at a time, flipping to the next. */
function wordLoop(box) {
  const words = $$('.hero__word', box)
  let i = 0
  const next = () => {
    words[i].classList.remove('is-on')
    i = (i + 1) % words.length
    words[i].classList.add('is-on')
  }
  let timer = 0
  whileVisible(box, () => { timer = setInterval(next, 2400) }, () => clearInterval(timer))
}

/* The chat: a question pops in, the assistant "types", then its answer
   writes itself out. Loops while on screen; `run` changes to cancel. */
function chatLoop(box) {
  let run = 0
  const bubble = (cls, text = '') => {
    const b = document.createElement('p')
    b.className = `hero__msg hero__msg--${cls}`
    b.textContent = text
    box.appendChild(b)
    return b
  }
  async function loop(id) {
    for (let i = 0; run === id; i = (i + 1) % hero.chat.length) {
      const [q, a] = hero.chat[i]
      box.replaceChildren()
      bubble('me', q)
      await sleep(700)
      if (run !== id) return
      const dots = bubble('ai hero__msg--dots', '')
      dots.innerHTML = '<i></i><i></i><i></i>'
      await sleep(1100)
      if (run !== id) return
      dots.remove()
      const out = bubble('ai')
      for (const ch of a) {
        if (run !== id) return
        out.textContent += ch
        await sleep(22)
      }
      await sleep(2600)
    }
  }
  if (reducedMotion) {
    const [q, a] = hero.chat[0]
    bubble('me', q)
    bubble('ai', a)
    return
  }
  whileVisible(box, () => loop(++run), () => run++)
}

/* The terminal: each line types out, then the run starts over. */
function termLoop(pre) {
  let run = 0
  async function loop(id) {
    while (run === id) {
      pre.textContent = ''
      for (const line of hero.terminal) {
        const span = document.createElement('span')
        if (line.startsWith('✓')) span.className = 'ok'
        pre.appendChild(span)
        for (const ch of `${line}\n`) {
          if (run !== id) return
          span.textContent += ch
          await sleep(line.startsWith('$') ? 45 : 12)
        }
        await sleep(420)
      }
      await sleep(2400)
    }
  }
  if (reducedMotion) { pre.innerHTML = hero.terminal.map((l) => `<span class="${l.startsWith('✓') ? 'ok' : ''}">${esc(l)}\n</span>`).join(''); return }
  whileVisible(pre, () => loop(++run), () => run++)
}

/* Pick a card up and drop it anywhere; double-click sends it home. A
   drag that moved never counts as a click. */
function draggable(el) {
  let start = null
  let moved = false
  let dx = 0
  let dy = 0
  el.addEventListener('pointerdown', (e) => {
    if (!isChaos() || e.button) return
    e.preventDefault()
    el.setPointerCapture(e.pointerId)
    start = { x: e.clientX - dx, y: e.clientY - dy }
    moved = false
    el.classList.add('is-drag')
  })
  el.addEventListener('pointermove', (e) => {
    if (!start) return
    dx = e.clientX - start.x
    dy = e.clientY - start.y
    if (!moved && Math.hypot(dx, dy) > 4) { moved = true; play('pop') }
    el.style.translate = `${dx}px ${dy}px`
  })
  const drop = () => {
    if (!start) return
    start = null
    el.classList.remove('is-drag')
    if (moved) play('drop')
  }
  el.addEventListener('pointerup', drop)
  el.addEventListener('pointercancel', drop)
  el.addEventListener('click', (e) => { if (moved) { e.preventDefault(); e.stopPropagation(); moved = false } })
  el.addEventListener('dblclick', () => {
    dx = dy = 0
    el.animate([{ translate: el.style.translate || '0 0' }, { translate: '0 0' }], { duration: 500, easing: 'cubic-bezier(.2,.7,0,1)' })
    el.style.translate = ''
    play('whoosh')
  })
}

export function initPitch() {
  const pitch = $('[data-pitch]')
  const stage = $('[data-visual]')
  const foot = $('[data-hero-foot]')
  if (!pitch || !stage) return () => {}
  pitch.innerHTML = pitchHtml()
  stage.innerHTML = stageHtml()
  if (foot) foot.innerHTML = footHtml()

  chatLoop($('[data-chat]', stage))
  termLoop($('[data-term]', stage))
  fitWords($('[data-words]', stage))
  if (!reducedMotion) wordLoop($('[data-words]', stage))
  const tick = $('[data-clock]', pitch)
  setInterval(() => { tick.textContent = clock() }, 15000)

  const cards = $$('.hero__card', stage)
  const floats = $$('.hero__float', stage)
  if (finePointer) cards.forEach(draggable)
  if (reducedMotion) return () => {}

  // The headline's last word cycles; its box eases to each word's width.
  const swap = $('[data-swap]', pitch)
  let wi = 0
  const cycle = () => {
    const em = swap.firstElementChild
    const next = document.createElement('em')
    next.textContent = hero.words[(wi = (wi + 1) % hero.words.length)]
    gsap.timeline()
      .to(em, { yPercent: -100, opacity: 0, duration: 0.4, ease: 'power3.in', onComplete: () => em.remove() })
      .add(() => {
        swap.appendChild(next)
        gsap.to(swap, { width: next.offsetWidth, duration: 0.45, ease: 'power3.out' })
      })
      .from(next, { yPercent: 100, opacity: 0, duration: 0.5, ease: 'power3.out' })
  }

  // Cards drift with the cursor, the deeper ones further.
  if (finePointer) {
    const movers = floats.map((el) => ({ x: gsap.quickTo(el, 'x', { duration: 1.1, ease: 'power3.out' }), y: gsap.quickTo(el, 'y', { duration: 1.1, ease: 'power3.out' }), d: Number(el.dataset.depth) }))
    $('.hero').addEventListener('pointermove', (e) => {
      const nx = e.clientX / innerWidth - 0.5
      const ny = e.clientY / innerHeight - 0.5
      movers.forEach((m) => { m.x(nx * -28 * m.d); m.y(ny * -22 * m.d) })
    })
  }

  // Scrolling away: each card flies outward from the middle and the
  // headline sinks back, so the first scroll visibly does something.
  const scatter = gsap.timeline({ scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 0.6, invalidateOnRefresh: true } })
  // Which way is "out" comes from layout boxes, so it ignores transforms.
  const side = (c) => Math.sign(c.offsetLeft + c.offsetWidth / 2 - stage.clientWidth / 2) || 1
  const half = (c) => Math.sign(c.offsetTop + c.offsetHeight / 2 - stage.clientHeight / 2) || -1
  cards.forEach((c) => {
    scatter.to(c, {
      x: () => side(c) * innerWidth * 0.32,
      y: () => half(c) * innerHeight * 0.18 - innerHeight * 0.1,
      rotation: () => side(c) * 14,
      ease: 'none',
    }, 0)
  })
  scatter.to('.hero__main', { yPercent: 18, scale: 0.94, opacity: 0.2, ease: 'none' }, 0)

  // Before the intro: everything waits just out of place.
  gsap.set($$('.hero__line > span', pitch), { yPercent: 105 })
  gsap.set(['.hero__eyebrow', '.hero__lede', '.hero__ctas', '.hero__foot'], { opacity: 0, y: 14 })
  gsap.set(floats, { opacity: 0, scale: 0.7, y: 60 })
  gsap.set('.hero__line-path', { strokeDashoffset: 1 })
  $('[data-lift]', stage).textContent = '0'

  return function intro() {
    gsap.set(swap, { width: swap.firstElementChild.offsetWidth })
    const lift = $('[data-lift]', stage)
    const n = { v: 0 }
    gsap.timeline()
      .to('.hero__eyebrow', { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, 0)
      .to($$('.hero__line > span', pitch), { yPercent: 0, duration: 1, stagger: 0.09, ease: 'expo.out' }, 0.05)
      .to(['.hero__lede', '.hero__ctas', '.hero__foot'], { opacity: 1, y: 0, duration: 0.7, stagger: 0.08, ease: 'power3.out' }, 0.35)
      .to(floats, { opacity: 1, scale: 1, y: 0, duration: 1.1, stagger: { each: 0.08, from: 'random' }, ease: 'back.out(1.6)' }, 0.3)
      .to('.hero__line-path', { strokeDashoffset: 0, duration: 1.4, ease: 'power2.inOut' }, 0.9)
      .to(n, { v: hero.lift.value, duration: 1.4, ease: 'power2.out', onUpdate: () => { lift.textContent = Math.round(n.v) } }, 0.9)
      .call(() => setInterval(cycle, 2600), null, 1.2)
  }
}
