/* Testimonials: one founder at a time, set large. The founders sit in a
   row underneath; pick one to read their words. The spotlight moves on by
   itself every few seconds (a bar fills on the active founder) and holds
   still while the pointer or focus is inside. All quotes share one grid
   cell, so the block is as tall as the longest and never jumps. */

import { $, $$, esc, reducedMotion } from './utils.js'
import { testimonials } from '../data/testimonials.js'
import { play } from './sound.js'

const HOLD = 7000
const initials = (name) => name.split(' ').map((w) => w[0]).slice(0, 2).join('')

export function initTestimonials() {
  const mount = $('[data-quotes]')
  mount.style.setProperty('--hold', `${HOLD}ms`)
  mount.innerHTML = `
    <div class="spot__stage" aria-live="polite">
      ${testimonials.map((t, i) => `
        <figure class="spot__quote" id="quote-${i}" ${i ? 'hidden' : ''}>
          <blockquote><p>${esc(t.quote)}</p></blockquote>
          <figcaption class="label">${esc(t.name)} · ${esc(t.role)}, ${esc(t.org)}</figcaption>
        </figure>`).join('')}
    </div>
    <div class="spot__who" role="group" aria-label="Choose a founder">
      ${testimonials.map((t, i) => `
        <button class="spot__pick" type="button" aria-controls="quote-${i}" aria-pressed="${i === 0}">
          <span class="spot__avatar" aria-hidden="true">${esc(initials(t.name))}</span>
          <span class="spot__name">${esc(t.name)}<small class="label">${esc(t.org)}</small></span>
          <i class="spot__timer" aria-hidden="true"></i>
        </button>`).join('')}
    </div>`

  const quotes = $$('.spot__quote', mount)
  const picks = $$('.spot__pick', mount)
  const auto = !reducedMotion
  let current = 0
  let timer = 0
  let paused = false

  const show = (i) => {
    current = (i + quotes.length) % quotes.length
    quotes.forEach((q, j) => { q.hidden = j !== current })
    picks.forEach((p, j) => p.setAttribute('aria-pressed', String(j === current)))
    // On phones the founder row scrolls sideways; keep the active one in it.
    const row = picks[0].parentElement
    if (row.scrollWidth > row.clientWidth) row.scrollTo({ left: picks[current].offsetLeft - row.offsetLeft, behavior: reducedMotion ? 'auto' : 'smooth' })
    // Restart the bar on the newly active founder.
    mount.classList.remove('is-running')
    void mount.offsetWidth
    if (auto && !paused) mount.classList.add('is-running')
  }
  const schedule = () => {
    clearTimeout(timer)
    if (auto && !paused) timer = setTimeout(() => { show(current + 1); schedule() }, HOLD)
  }
  const hold = (on) => {
    paused = on
    if (on) {
      clearTimeout(timer)
      mount.classList.remove('is-running')
    } else {
      show(current)
      schedule()
    }
  }

  picks.forEach((p, i) => p.addEventListener('click', () => { play('click'); show(i); schedule() }))
  if (!auto) return

  mount.addEventListener('pointerenter', () => hold(true))
  mount.addEventListener('pointerleave', () => hold(false))
  mount.addEventListener('focusin', () => hold(true))
  mount.addEventListener('focusout', (e) => { if (!mount.contains(e.relatedTarget)) hold(false) })

  // Only run while the section is on screen.
  new IntersectionObserver(([e]) => {
    if (e.isIntersecting && !paused) { show(current); schedule() }
    else { clearTimeout(timer); mount.classList.remove('is-running') }
  }).observe(mount)
}
