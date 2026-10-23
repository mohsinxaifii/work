/* Nudges: small pills that tell people what they can play with. Each one
   sits on its toy, bobs gently once the toy is on screen, and fades for
   good (remembered in localStorage) the first time it's used. Nudges on
   the fixed header only show on the first screen, for a few seconds.
   They're .toy elements, so simple mode hides them; hover-only ones skip
   touch screens. */

import { gsap } from 'gsap'
import { $, store, finePointer, reducedMotion } from './utils.js'

const ICONS = {
  pointer: '<path d="M6 3l13 7.2-5.9 1.5L10.4 18z"/>',
  tap: '<circle cx="12" cy="12" r="3.2"/><circle cx="12" cy="12" r="7.5" fill="none" stroke="currentColor" stroke-width="1.8"/>',
  drag: '<path d="M12 3v18M3 12h18M12 3 9.5 5.5M12 3l2.5 2.5M12 21l-2.5-2.5M12 21l2.5-2.5M3 12l2.5-2.5M3 12l2.5 2.5M21 12l-2.5-2.5M21 12l-2.5 2.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>',
}

// `on`: what counts as using it. `place`: where the pill sits on the toy.
// `brief`: it's on the fixed header, so it leaves after a few seconds or
// on the first scroll.
const NUDGES = [
  { key: 'wordmark', target: '[data-wordmark]', text: 'Move your cursor over the name', icon: 'pointer', on: 'pointerenter', place: 'below', hover: true, brief: true },
  { key: 'archive', target: '[data-archive]', text: 'Hover a project to preview it', icon: 'pointer', on: 'pointerenter', place: 'top', hover: true },
  { key: 'pit', target: '[data-pit]', text: 'Grab a skill and throw it', icon: 'drag', on: 'pointerdown', place: 'center' },
  { key: 'printer', target: '[data-printer]', text: 'Press Print CV, then pull the receipt', icon: 'tap', on: 'pointerdown', place: 'top' },
  { key: 'bugs', target: '[data-bugs]', text: 'Click the bugs to squash them', icon: 'tap', on: 'pointerdown', place: 'center' },
  { key: 'cord', target: '[data-cord]', text: 'Pull for the lights', icon: 'drag', on: 'pointerdown', place: 'left', brief: true },
  { key: 'sticker', target: '.sticker', text: 'Drag me', icon: 'drag', on: 'pointerdown', place: 'below' },
]

export function initNudges() {
  const seen = store.get('nudged', {})

  for (const n of NUDGES) {
    if (seen[n.key] || (n.hover && !finePointer)) continue
    const target = $(n.target)
    if (!target) continue

    const pill = document.createElement('span')
    pill.className = `nudge toy nudge--${n.place}`
    pill.setAttribute('aria-hidden', 'true')
    pill.innerHTML = `<svg viewBox="0 0 24 24" fill="currentColor">${ICONS[n.icon]}</svg>${n.text}`
    if (getComputedStyle(target).position === 'static') target.style.position = 'relative'
    target.appendChild(pill)

    const hide = () => {
      io.disconnect()
      target.classList.remove('is-nudged')
      if (!pill.isConnected) return
      if (reducedMotion) { pill.remove(); return }
      gsap.to(pill, { opacity: 0, scale: 0.9, duration: 0.3, onComplete: () => pill.remove() })
    }

    const show = () => {
      pill.classList.add('is-on')
      target.classList.add('is-nudged')
    }

    // Header nudges show a beat after the intro, then leave on their own.
    // The rest show once their toy reaches the middle band of the screen
    // (which works for toys taller than the screen too).
    // A shown pill leaves with its toy, and comes back with it.
    const io = new IntersectionObserver(([e]) => {
      pill.classList.toggle('is-on', e.isIntersecting)
      target.classList.toggle('is-nudged', e.isIntersecting)
    }, { rootMargin: '-30% 0px -30% 0px' })
    if (n.brief) {
      setTimeout(show, 1000)
      setTimeout(hide, 8000)
      addEventListener('scroll', () => { if (scrollY > innerHeight * 0.5) hide() }, { passive: true })
    } else {
      io.observe(target)
    }

    // Used once: fade it, and don't show it again.
    target.addEventListener(n.on, () => {
      seen[n.key] = true
      store.set('nudged', seen)
      hide()
    }, { once: true })
  }
}
