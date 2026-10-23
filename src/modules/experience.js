/* ==================================================================
   EXPERIENCE - each job is a boarding pass, newest first, flying
   from its company code to the next job's. The last pass is an open seat
   ("YOU?") that doubles as the hire CTA. On desktop the row is pinned
   and scrubbed sideways; tablets stack it, phones swipe it (rails.js).
   ================================================================== */

import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { $, esc, barcode } from './utils.js'
import { experience, education } from '../data/cv.js'
import { site } from '../data/site.js'
import { play } from './sound.js'

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const toMonths = (s) => {
  if (/present/i.test(s)) { const d = new Date(); return d.getFullYear() * 12 + d.getMonth() }
  const [m, y] = s.split(' ')
  return Number(y) * 12 + MONTHS.indexOf(m)
}
const duration = (from, to) => {
  const n = Math.max(1, toMonths(to) - toMonths(from) + (/present/i.test(to) ? 1 : 0))
  const y = Math.floor(n / 12)
  const m = n % 12
  return [y && `${y} yr`, m && `${m} mo`].filter(Boolean).join(' ')
}

export function initExperience() {
  // Newest first (cv.js order), so the current job leads the row.
  const trips = experience
  const current = experience.find((j) => j.current)

  const latest = current ?? experience[0]
  $('[data-current]').innerHTML = current
    ? `Currently ${esc(current.role)} at <strong>${esc(current.org)}</strong>, since ${esc(current.from)}.`
    : `${experience.length} stops so far, most recently <strong>${esc(latest.org)}</strong>. ` +
      `Now open to work, and the next seat is yours.`

  const passes = trips.map((job, i) => {
    // Each pass flies to the job that came after it; the current one flies to you.
    const next = trips[i - 1]
    const destination = next ? next.code : 'YOU'
    const flight = String(trips.length - i).padStart(3, '0')
    return `
      <article class="pass${job.current ? ' pass--current' : ''}">
        <div class="pass__main">
          <div class="pass__top"><span>Boarding pass <span class="ar" lang="ar">بطاقة صعود</span></span><span>Flight MM${flight}</span></div>
          <div class="pass__route">
            <p class="pass__code">${esc(job.code)}<small>${esc(job.from)}</small></p>
            <div class="pass__line" aria-hidden="true"></div>
            <p class="pass__code" style="text-align:right">${esc(destination)}<small>${esc(job.to)}</small></p>
          </div>
          <div>
            <p class="pass__role">${esc(job.role)}</p>
            <p class="label" style="color:inherit;opacity:.7;margin-top:6px">${esc(job.org)}</p>
          </div>
          <ul class="pass__points">${job.points.map((p) => `<li>${esc(p)}</li>`).join('')}</ul>
          <dl class="pass__fields">
            <div><dt>Passenger</dt><dd>M. Mohsin</dd></div>
            <div><dt>Duration</dt><dd>${duration(job.from, job.to)}</dd></div>
            <div><dt>Status</dt><dd>${job.current ? '<span class="pass__status--live">In flight</span>' : 'Landed'}</dd></div>
          </dl>
        </div>
        <div class="pass__stub" aria-hidden="true">
          <span class="pass__stub-code">${esc(job.code)}</span>
          <div class="barcode">${barcode(job.org, 22)}</div>
        </div>
      </article>`
  })

  passes.push(`
    <article class="pass pass--cta">
      <div class="pass__main">
        <div class="pass__top"><span>Next departure</span><span>Gate open</span></div>
        <p class="pass__code" style="font-size:clamp(64px,8vw,112px)">YOU<em style="color:var(--accent)">?</em></p>
        <p class="pass__summary">Your team, your stack, your numbers. Open to full-time roles and serious projects, from ${esc(site.location)} or remote.</p>
        <div class="pass__cta"><a class="btn btn--accent" href="mailto:${esc(site.email)}?subject=Seat%20on%20the%20next%20flight" data-cursor="board">Book a seat →</a></div>
      </div>
      <div class="pass__stub" aria-hidden="true">
        <span class="pass__stub-code">NXT</span>
        <div class="barcode">${barcode('next', 22)}</div>
      </div>
    </article>`)

  const track = $('[data-exp-track]')
  track.innerHTML = passes.join('')
  track.querySelectorAll('.pass').forEach((p) => p.addEventListener('mouseenter', () => play('hover')))

  $('[data-education]').innerHTML = `
    <div>
      <h3 class="h3">Lay<em>overs</em></h3>
      <p class="label" style="margin-top:8px">Education</p>
    </div>
    <div class="layovers__list">
      ${education.map((e) => `
        <div class="layover">
          <span class="layover__q">${esc(e.qualification)}</span>
          <span class="layover__org">${esc(e.org)}</span>
          <span class="label">${esc(e.years)}</span>
        </div>`).join('')}
    </div>`

  const pin = $('[data-exp-pin]')
  const mm = gsap.matchMedia()
  mm.add('(min-width: 901px) and (prefers-reduced-motion: no-preference)', () => {
    const dist = () => Math.max(0, track.scrollWidth - innerWidth)
    let lastIdx = -1
    gsap.to(track, {
      x: () => -dist(),
      ease: 'none',
      scrollTrigger: {
        trigger: pin,
        start: 'center center',
        end: () => `+=${dist()}`,
        pin: true,
        scrub: 0.8,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          // A little ticket-stamp tick as each pass slides past.
          const idx = Math.round(self.progress * (passes.length - 1))
          if (idx !== lastIdx) { if (lastIdx !== -1) play('tick'); lastIdx = idx }
        },
      },
    })
  })
  // Fonts change pass widths; re-measure once they're in.
  document.fonts?.ready.then(() => ScrollTrigger.refresh())
}
