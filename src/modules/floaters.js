/* Always-on contact: WhatsApp + email buttons pinned bottom-right, and the
   Shopify Partner badge mid-page that turns as the page scrolls. Neither
   is a .toy - recruiter mode keeps both. */

import { gsap } from 'gsap'
import { $, esc, reducedMotion } from './utils.js'
import { site } from '../data/site.js'
import { play } from './sound.js'
import { waHref, waIcon } from './whatsapp.js'

// Solid glyphs (WhatsApp mark, Phosphor paper plane) to sit inside the
// capsule like the nav's Recruiter / Chaos switch.
const ICONS = {
  mail: `<svg viewBox="0 0 256 256" aria-hidden="true" fill="currentColor"><path d="M231.4,44.34s0,.1,0,.15l-58.2,191.94a15.88,15.88,0,0,1-14,11.51q-.69.06-1.38.06a15.86,15.86,0,0,1-14.42-9.15L107,164.15a4,4,0,0,1,.77-4.58l57.92-57.92a8,8,0,0,0-11.31-11.31L96.43,148.26a4,4,0,0,1-4.58.77L17.08,112.64a16,16,0,0,1,2.49-29.8l191.94-58.2.15,0A16,16,0,0,1,231.4,44.34Z"/></svg>`,
}

export function initFloaters() {
  const mount = $('[data-floaters]')
  mount.innerHTML = `
    <a class="floater floater--wa" href="${esc(waHref)}" target="_blank" rel="noopener" aria-label="Message me on WhatsApp">
      ${waIcon}<span class="floater__tip">WhatsApp</span>
    </a>
    <a class="floater floater--mail" href="mailto:${esc(site.email)}" aria-label="Email ${esc(site.email)}">
      ${ICONS.mail}<span class="floater__tip">Email</span>
    </a>`
  mount.querySelectorAll('.floater').forEach((a) => a.addEventListener('mouseenter', () => play('hover')))

  initVisibility(mount)
  initPartnerBadge()
}

/* Keep the capsule off content. Wide desktops park it in the empty right
   margin (CSS). Everywhere it steps aside on the hero, which has its own
   buttons, and once Contact is on screen, whose tiles do the same job.
   Below 1600px, where there's no margin to park in, it also hides while
   scrolling down (reading) and comes back on scroll up. */
function initVisibility(el) {
  const wide = matchMedia('(min-width: 1600px)')
  const reasons = new Set()
  const sync = () => el.classList.toggle('is-off', reasons.size > 0)
  const flag = (key, on) => { reasons[on ? 'add' : 'delete'](key); sync() }

  new IntersectionObserver(([e]) => flag('hero', e.intersectionRatio > 0.35), { threshold: [0, 0.35, 1] })
    .observe($('#hero'))
  // Contact counts once its top passes 60% of the way up the screen.
  new IntersectionObserver(([e]) => flag('contact', e.isIntersecting), { rootMargin: '0px 0px -40% 0px' })
    .observe($('#contact'))

  let lastY = scrollY
  addEventListener('scroll', () => {
    const y = scrollY
    if (Math.abs(y - lastY) < 8) return
    flag('reading', !wide.matches && y > lastY)
    lastY = y
  }, { passive: true })
  wide.addEventListener('change', () => flag('reading', false))
}

/* The badge sits on the About/Work seam. While it crosses the screen it
   drifts down a little and makes one and a half turns, both scrubbed to
   the scroll so it moves exactly with the page. */
function initPartnerBadge() {
  const badge = $('[data-partner]')
  if (!badge || reducedMotion) return
  gsap.fromTo(badge, { y: -40, rotation: -90 }, {
    y: 140,
    rotation: 450,
    ease: 'none',
    scrollTrigger: { trigger: badge.parentElement, start: 'top bottom', end: 'bottom top', scrub: 0.6 },
  })
}
