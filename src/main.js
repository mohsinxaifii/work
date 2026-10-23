/* ==================================================================
   ENTRY - render content from src/data, wire interactions, then play
   the loader. Content lives in src/data/*.js; each section's behaviour
   lives in its own module under src/modules/.
   ================================================================== */

import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { $ } from './modules/utils.js'
import { site } from './data/site.js'
import { initPrefs } from './modules/prefs.js'
import { initScroll, splitHeadings, initReveals } from './modules/scroll.js'
import { initCounters } from './modules/counters.js'
import { initAbout } from './modules/about.js'
import { initAgent } from './modules/agent.js'
import { initPitch } from './modules/pitch.js'
import { initWordmark } from './modules/wordmark.js'
import { initWork } from './modules/work.js'
import { initCase } from './modules/case.js'
import { initTestimonials } from './modules/testimonials.js'
import { initExperience } from './modules/experience.js'
import { initStack } from './modules/stack.js'
import { initPrinter } from './modules/printer.js'
import { initStickers } from './modules/stickers.js'
import { initToys } from './modules/toys.js'
import { initBugs } from './modules/bugs.js'
import { initCursor } from './modules/cursor.js'
import { initFloaters } from './modules/floaters.js'
import { initEnquiry } from './modules/enquiry.js'
import { runLoader } from './modules/loader.js'
import { initNudges } from './modules/nudges.js'
import { initRails } from './modules/rails.js'
import { initAnalytics } from './modules/analytics.js'

initAnalytics()
initPrefs()
initScroll()
initToys()
initCounters()
const pitchIntro = initPitch()
initAbout()
initAgent()
initWork()
const openFromHash = initCase()
initTestimonials()
initExperience()
initStack()
initPrinter()
initStickers()
initBugs()
initCursor()
initFloaters()
initEnquiry()
splitHeadings()
initRails()
initWordmark(site.nameAr)

runLoader().then(() => {
  pitchIntro()
  initNudges()
  initReveals()
  ScrollTrigger.refresh()
  openFromHash()
})

addEventListener('modechange', () => requestAnimationFrame(() => ScrollTrigger.refresh()))

/* Pinned sections (Experience) measure their scroll positions up front.
   Anything that changes the page height later - lazy screenshots loading,
   fonts, the receipt printing - would leave the pin starting in the wrong
   place, so re-measure whenever <main> changes height. */
let lastHeight = 0
let refreshTimer
new ResizeObserver(([entry]) => {
  const h = Math.round(entry.contentRect.height)
  if (Math.abs(h - lastHeight) < 2) return
  lastHeight = h
  clearTimeout(refreshTimer)
  refreshTimer = setTimeout(() => ScrollTrigger.refresh(), 120)
}).observe($('main'))
