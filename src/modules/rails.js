/* Phone decks. On small screens a few long sections become one swipeable
   row (the snap scrolling itself is CSS, under .rail). Here each deck
   gets a progress bar with a count and a "swipe" hint, and its cards a
   focus value (--f, 1 when centred, 0 a card away) that the CSS turns
   into a tilt and dim. Also on phones: cards and rows rise into place as
   they scroll in. */

import { $$, reducedMotion } from './utils.js'

const RAILS = ['.featured', '.exp__track', '.quotes__grid', '.ai-grid']
const RISE = '.ai-tile, .card, .row, .quote, .skills__group, .dir li, .layover'

function deck(rail) {
  const items = [...rail.children]
  if (items.length < 2) return
  const bar = document.createElement('div')
  bar.className = 'rail__bar'
  bar.setAttribute('aria-hidden', 'true')
  bar.innerHTML = `<span class="rail__count">01 / ${String(items.length).padStart(2, '0')}</span><i><b></b></i><span class="rail__hint">Swipe →</span>`
  rail.after(bar)
  const count = bar.firstElementChild
  const fill = bar.querySelector('b')

  let frame = 0
  const update = () => {
    frame = 0
    const mid = rail.scrollLeft + rail.clientWidth / 2
    let best = 0
    let bestD = Infinity
    items.forEach((el, i) => {
      const d = Math.abs(el.offsetLeft + el.offsetWidth / 2 - mid)
      if (d < bestD) { bestD = d; best = i }
      if (!reducedMotion) {
        const f = Math.max(0, 1 - d / el.offsetWidth)
        el.style.setProperty('--f', f.toFixed(3))
        el.style.setProperty('--side', el.offsetLeft + el.offsetWidth / 2 < mid ? -1 : 1)
      }
    })
    count.textContent = `${String(best + 1).padStart(2, '0')} / ${String(items.length).padStart(2, '0')}`
    const max = rail.scrollWidth - rail.clientWidth
    fill.style.transform = `scaleX(${max > 0 ? Math.max(0.08, rail.scrollLeft / max) : 1})`
  }
  rail.addEventListener('scroll', () => {
    bar.classList.add('is-used')
    if (!frame) frame = requestAnimationFrame(update)
  }, { passive: true })
  addEventListener('resize', update)
  update()
}

export function initRails() {
  const phone = matchMedia('(max-width: 600px)')
  if (!phone.matches) return
  RAILS.forEach((sel) => $$(sel).forEach((rail) => { rail.classList.add('rail'); deck(rail) }))

  if (reducedMotion) return
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return
      e.target.classList.add('is-risen')
      io.unobserve(e.target)
    })
  }, { rootMargin: '0px 0px -12% 0px' })
  // Deck cards sit off to the side, so they're left to the deck's focus.
  $$(RISE).filter((el) => !el.parentElement.classList.contains('rail')).forEach((el) => {
    // Siblings arriving together come in one after another.
    const idx = [...el.parentElement.children].indexOf(el)
    el.style.setProperty('--rise-i', Math.min(idx, 6))
    el.classList.add('rise')
    io.observe(el)
  })
}
