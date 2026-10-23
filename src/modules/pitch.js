/* Hero: the pitch and the portrait. Left, a headline whose last word
   cycles, one line, the CTAs and a quiet proof line. Right, the portrait
   with one proof card - the conversion lift - that drifts with the
   cursor. initPitch() builds it; the intro it returns plays after the
   loader. */

import { gsap } from 'gsap'
import { $, $$, esc, reducedMotion, finePointer } from './utils.js'
import { site } from '../data/site.js'
import { hero } from '../data/hero.js'
import { waHref, waIcon } from './whatsapp.js'

const pitchHtml = () => `
  <p class="label hero__eyebrow">${esc(site.fullName)} · ${esc(site.title)} · ${esc(site.city)}</p>
  <h1 class="hero__title">
    <span class="hero__line"><span>I build software</span></span>
    <span class="hero__line"><span>that <span class="hero__swap" data-swap><em>${esc(hero.words[0])}</em></span></span></span>
  </h1>
  <p class="hero__lede">${esc(hero.lede)}</p>
  <div class="hero__ctas">
    <a class="btn btn--ink" href="#work" data-cursor="scroll">See the work <span class="btn__arrow">↓</span></a>
    <a class="btn btn--wa" href="${esc(waHref)}" target="_blank" rel="noopener">${waIcon}WhatsApp me</a>
    <a class="btn btn--line" href="${esc(site.cv)}" download>Download CV</a>
  </div>
  <p class="hero__proof">${hero.proof.map((p) => `<span>${esc(p)}</span>`).join('')}</p>`

const visualHtml = () => `
  <figure class="hero__photo" data-depth="0.5">
    <img src="${esc(site.portrait)}" alt="Mohd Mohsin" width="559" height="559" decoding="async">
  </figure>
  <div class="hero__lift" data-depth="1.4">
    <div class="hero__bars"><i></i><i></i></div>
    <div><b>${esc(hero.lift.value)}</b><p>${esc(hero.lift.label)}</p><small>${esc(hero.lift.note)}</small></div>
  </div>`

export function initPitch() {
  const pitch = $('[data-pitch]')
  const visual = $('[data-visual]')
  if (!pitch || !visual) return () => {}
  pitch.innerHTML = pitchHtml()
  visual.innerHTML = visualHtml()
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

  // The photo and its card drift with the cursor, the card more.
  const layers = $$('[data-depth]', visual)
  if (finePointer) {
    const movers = layers.map((el) => ({ x: gsap.quickTo(el, 'x', { duration: 1, ease: 'power3.out' }), y: gsap.quickTo(el, 'y', { duration: 1, ease: 'power3.out' }), d: Number(el.dataset.depth) }))
    $('.hero').addEventListener('pointermove', (e) => {
      const nx = e.clientX / innerWidth - 0.5
      const ny = e.clientY / innerHeight - 0.5
      movers.forEach((m) => { m.x(nx * 18 * m.d); m.y(ny * 14 * m.d) })
    })
  }

  // Before the intro: everything waits just out of place.
  gsap.set($$('.hero__line > span', pitch), { yPercent: 105 })
  gsap.set(['.hero__eyebrow', '.hero__lede', '.hero__ctas', '.hero__proof'], { opacity: 0, y: 14 })
  // Phones show the photo flat and edge to edge; wider screens tilt it.
  const tilt = matchMedia('(min-width: 601px)').matches
  gsap.set('.hero__photo', { opacity: 0, scale: tilt ? 0.96 : 1.06, rotation: tilt ? -4 : 0 })
  gsap.set('.hero__lift', { opacity: 0, y: 30 })

  return function intro() {
    gsap.set(swap, { width: swap.firstElementChild.offsetWidth })
    gsap.timeline()
      .to('.hero__eyebrow', { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, 0)
      .to($$('.hero__line > span', pitch), { yPercent: 0, duration: 1, stagger: 0.09, ease: 'expo.out' }, 0.05)
      .to(['.hero__lede', '.hero__ctas', '.hero__proof'], { opacity: 1, y: 0, duration: 0.7, stagger: 0.08, ease: 'power3.out' }, 0.35)
      .to('.hero__photo', { opacity: 1, scale: 1, rotation: tilt ? -2 : 0, duration: 1.1, ease: 'expo.out' }, 0.15)
      .to('.hero__lift', { opacity: 1, y: 0, duration: 0.8, ease: 'expo.out' }, 0.6)
      .from('.hero__bars i', { scaleY: 0, transformOrigin: 'bottom', duration: 0.8, stagger: 0.2, ease: 'power3.out' }, 0.8)
      .call(() => setInterval(cycle, 2600), null, 1.2)
  }
}
