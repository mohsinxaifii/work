/* Proof band: four short claims under the hero, set large, each rising
   out of a mask as the band scrolls in. */

import { gsap } from 'gsap'
import { $, $$, esc, reducedMotion } from './utils.js'
import { proof } from '../data/site.js'

// *word* -> the accent.
const accent = (text) => esc(text).replace(/\*([^*]+)\*/g, '<em>$1</em>')

export function initCounters() {
  const mount = $('[data-counters]')
  mount.innerHTML = `<ul class="stats">${proof.map((p) => `
    <li class="stat">
      <p class="stat__claim"><span>${accent(p.claim)}</span></p>
      <p class="label">${esc(p.label)}</p>
    </li>`).join('')}</ul>`

  if (reducedMotion) return
  gsap.from($$('.stat__claim > span', mount), {
    yPercent: 110,
    duration: 1,
    stagger: 0.1,
    ease: 'expo.out',
    scrollTrigger: { trigger: mount, start: 'top 80%', once: true },
  })
}
