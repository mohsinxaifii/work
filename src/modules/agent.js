/* AI section: a bento of five small animated diagrams - an AI hub wired
   into every team, a Gantt of a project shipping sooner, an output chart
   pulling away, a 24-hour clock, and one idea branching into many. Each
   draws itself in once the grid is on screen; the hub keeps pulsing and
   its orbit turns. Reduced motion shows every diagram finished. */

import { gsap } from 'gsap'
import { $, $$, esc, reducedMotion } from './utils.js'
import { teams, tiles } from '../data/agent.js'

const TONES = ['lime', 'pink', 'blue', 'orange', 'violet']
const pt = (cx, cy, r, deg) => [cx + r * Math.cos((deg * Math.PI) / 180), cy + r * Math.sin((deg * Math.PI) / 180)]
const f = (n) => n.toFixed(1)

// An arc segment of a ring, from a1 to a2 degrees (0 = three o'clock).
function arc(cx, cy, r, a1, a2) {
  const [x1, y1] = pt(cx, cy, r, a1)
  const [x2, y2] = pt(cx, cy, r, a2)
  return `M${f(x1)} ${f(y1)}A${r} ${r} 0 0 1 ${f(x2)} ${f(y2)}`
}

function hubSvg() {
  const nodes = teams.map((name, i) => {
    const deg = -90 + (i * 360) / teams.length
    const [x, y] = pt(200, 200, 132, deg)
    const [sx, sy] = pt(200, 200, 40, deg)
    const [tx, ty] = pt(200, 200, 150, deg)
    const anchor = Math.abs(tx - 200) < 8 ? 'middle' : tx > 200 ? 'start' : 'end'
    return { name, x, y, sx, sy, tx, ty: ty + 4, anchor }
  })
  const orbit = Array.from({ length: 36 }, (_, i) => {
    const [x, y] = pt(200, 200, 186, i * 10)
    return `<circle cx="${f(x)}" cy="${f(y)}" r="${i % 3 ? 1.5 : 3}"/>`
  }).join('')
  return `
    <svg class="dg dg--hub" viewBox="0 0 400 400" aria-hidden="true">
      <g class="hub__orbit">${orbit}</g>
      ${nodes.map((n) => `<line class="dg__draw hub__line" pathLength="1" x1="${f(n.sx)}" y1="${f(n.sy)}" x2="${f(n.x)}" y2="${f(n.y)}"/>`).join('')}
      <g class="hub__pulses">${nodes.map((n) => `<circle class="hub__pulse" r="3.5" cx="200" cy="200" data-to="${f(n.x)},${f(n.y)}"/>`).join('')}</g>
      ${nodes.map((n) => `
        <g class="hub__node">
          <circle cx="${f(n.x)}" cy="${f(n.y)}" r="6"/>
          <text x="${f(n.tx)}" y="${f(n.ty)}" text-anchor="${n.anchor}">${esc(n.name)}</text>
        </g>`).join('')}
      <circle class="hub__core" cx="200" cy="200" r="38"/>
      <text class="hub__ai" x="200" y="207" text-anchor="middle">AI</text>
    </svg>`
}

function shipSvg() {
  const row = (y, widths, cls) => {
    let x = 78
    return widths.map((w) => { const r = `<rect class="ship__seg ${cls}" x="${x}" y="${y}" width="${w - 3}" height="20" rx="4"/>`; x += w; return r }).join('')
  }
  return `
    <svg class="dg" viewBox="0 0 300 150" aria-hidden="true">
      <text class="dg__label" x="0" y="44">manual</text>
      <text class="dg__label" x="0" y="94">with AI</text>
      ${row(30, [52, 56, 46, 44], 'ship__seg--old')}
      ${row(80, [20, 22, 18, 20], 'ship__seg--ai')}
      <line class="dg__axis" x1="78" y1="126" x2="296" y2="126"/>
      ${[78, 132, 186, 240, 294].map((x) => `<line class="dg__axis" x1="${x}" y1="126" x2="${x}" y2="130"/>`).join('')}
      <g class="ship__flag">
        <line x1="155" y1="74" x2="155" y2="126"/>
        <path d="M155 60h22l-6 7 6 7h-22z"/>
      </g>
      <text class="dg__label" x="78" y="145">start</text>
      <text class="dg__label" x="155" y="145" text-anchor="middle">launch</text>
    </svg>`
}

function outputSvg() {
  const ai = 'M20 122C90 114 170 74 284 24'
  return `
    <svg class="dg" viewBox="0 0 300 150" aria-hidden="true">
      <line class="dg__axis" x1="20" y1="130" x2="290" y2="130"/>
      <line class="dg__axis" x1="20" y1="10" x2="20" y2="130"/>
      <path class="out__area" d="${ai}L284 130L20 130Z"/>
      <path class="dg__draw out__team" pathLength="1" d="M20 122C90 120 180 116 284 110"/>
      <path class="dg__draw out__ai" pathLength="1" d="${ai}"/>
      <circle class="out__dot" cx="284" cy="24" r="5"/>
      <g class="dg__legend">
        <circle class="out__key out__key--ai" cx="34" cy="18" r="4"/><text class="dg__label" x="44" y="22">team + AI</text>
        <circle class="out__key" cx="34" cy="36" r="4"/><text class="dg__label" x="44" y="40">team</text>
      </g>
      <text class="dg__label" x="284" y="145" text-anchor="end">time →</text>
    </svg>`
}

function clockSvg() {
  const seg = (r, i) => arc(100, 100, r, -90 + i * 15 + 1.2, -90 + i * 15 + 13.8)
  const hours = Array.from({ length: 24 }, (_, i) => `<path class="clock__hour${i >= 9 && i < 18 ? ' is-office' : ''}" d="${seg(78, i)}"/>`).join('')
  const ai = Array.from({ length: 24 }, (_, i) => `<path class="clock__ai" d="${seg(58, i)}"/>`).join('')
  return `
    <svg class="dg dg--clock" viewBox="0 0 200 200" aria-hidden="true">
      ${hours}${ai}
      <text class="clock__big" x="100" y="104" text-anchor="middle">24h</text>
      <text class="dg__label" x="100" y="122" text-anchor="middle">every day</text>
    </svg>`
}

function ideasSvg() {
  const seed = [22, 80]
  const mids = [[132, 26], [132, 80], [132, 134]]
  const curve = ([x1, y1], [x2, y2]) => { const m = (x1 + x2) / 2; return `M${x1} ${y1}C${m} ${y1} ${m} ${y2} ${x2} ${y2}` }
  const leaves = mids.flatMap(([x, y]) => [-17, 0, 17].map((d) => [262, y + d]))
  return `
    <svg class="dg" viewBox="0 0 300 160" aria-hidden="true">
      ${mids.map((m) => `<path class="dg__draw ideas__l1" pathLength="1" d="${curve(seed, m)}"/>`).join('')}
      ${leaves.map((l, i) => `<path class="dg__draw ideas__l2" pathLength="1" d="${curve(mids[Math.floor(i / 3)], l)}"/>`).join('')}
      <circle class="ideas__seed" cx="${seed[0]}" cy="${seed[1]}" r="9"/>
      ${mids.map(([x, y]) => `<circle class="ideas__mid" cx="${x}" cy="${y}" r="6"/>`).join('')}
      ${leaves.map(([x, y], i) => `<circle class="ideas__leaf" data-tone="${TONES[i % TONES.length]}" cx="${x}" cy="${y}" r="6.5"/>`).join('')}
    </svg>`
}

const tile = (key, svg) => `
  <article class="ai-tile ai-tile--${key}">
    <header class="ai-tile__head"><span class="label">${esc(tiles[key].label)}</span><h3>${esc(tiles[key].title)}</h3></header>
    ${svg}
  </article>`

export function initAgent() {
  const root = $('[data-ai-grid]')
  if (!root) return
  root.innerHTML = tile('hub', hubSvg()) + tile('ship', shipSvg()) + tile('output', outputSvg()) + tile('clock', clockSvg()) + tile('ideas', ideasSvg())

  const tl = gsap.timeline({ paused: true })
  const q = (sel) => $$(sel, root)

  // Hub: lines draw out, teams appear, then pulses run for good.
  tl.to(q('.hub__line'), { strokeDashoffset: 0, duration: 0.6, stagger: 0.06, ease: 'power2.out' }, 0)
  tl.from(q('.hub__node'), { opacity: 0, scale: 0.6, transformOrigin: 'center', duration: 0.4, stagger: 0.06, ease: 'back.out(2)' }, 0.3)
  tl.from(q('.hub__core, .hub__ai'), { scale: 0, transformOrigin: 'center', duration: 0.5, ease: 'back.out(2.4)' }, 0)
  tl.call(() => q('.hub__pulse').forEach((c, i) => {
    const [x, y] = c.dataset.to.split(',').map(Number)
    gsap.fromTo(c, { attr: { cx: 200, cy: 200 }, opacity: 1 }, { attr: { cx: x, cy: y }, opacity: 0.15, duration: 1.3, ease: 'power1.in', repeat: -1, repeatDelay: 0.6, delay: i * 0.22 })
  }), null, 0.9)

  // Ship: the manual plan crawls, the AI plan races, the flag drops.
  tl.from(q('.ship__seg--old'), { scaleX: 0, transformOrigin: 'left center', duration: 0.45, stagger: 0.4, ease: 'none' }, 0.2)
  tl.from(q('.ship__seg--ai'), { scaleX: 0, transformOrigin: 'left center', duration: 0.18, stagger: 0.16, ease: 'none' }, 0.2)
  tl.from('.ship__flag', { y: -24, opacity: 0, duration: 0.5, ease: 'bounce.out' }, 0.9)

  // Output: both lines draw, the gap fills in.
  tl.to(q('.out__team, .out__ai'), { strokeDashoffset: 0, duration: 1.4, ease: 'power1.inOut' }, 0.3)
  tl.from('.out__area', { opacity: 0, duration: 0.8 }, 1.1)
  tl.from('.out__dot', { scale: 0, transformOrigin: 'center', duration: 0.4, ease: 'back.out(3)' }, 1.6)

  // Clock: office hours, then the AI ring fills every hour.
  tl.from(q('.clock__hour'), { opacity: 0, duration: 0.2, stagger: 0.025 }, 0.2)
  tl.from(q('.clock__ai'), { opacity: 0, scale: 0.85, transformOrigin: '100px 100px', duration: 0.25, stagger: 0.05, ease: 'back.out(2)' }, 0.8)

  // Ideas: one seed, three branches, nine directions.
  tl.from('.ideas__seed', { scale: 0, transformOrigin: 'center', duration: 0.4, ease: 'back.out(3)' }, 0.2)
  tl.to(q('.ideas__l1'), { strokeDashoffset: 0, duration: 0.5, stagger: 0.08 }, 0.45)
  tl.from(q('.ideas__mid'), { scale: 0, transformOrigin: 'center', duration: 0.3, stagger: 0.08, ease: 'back.out(3)' }, 0.85)
  tl.to(q('.ideas__l2'), { strokeDashoffset: 0, duration: 0.5, stagger: 0.04 }, 1.05)
  tl.from(q('.ideas__leaf'), { scale: 0, transformOrigin: 'center', duration: 0.35, stagger: 0.04, ease: 'back.out(3)' }, 1.4)

  if (reducedMotion) { tl.progress(1); gsap.killTweensOf(q('.hub__pulse')); return }

  const io = new IntersectionObserver(([e]) => {
    if (!e.isIntersecting) return
    tl.play()
    io.disconnect()
  }, { threshold: 0.25 })
  io.observe(root)
}
