/* ==================================================================
   SCROLL - Lenis smooth scroll driven by GSAP's ticker, anchor links,
   reveal-on-scroll, split headlines, nav state and the mobile menu.
   ================================================================== */

import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { $, $$, reducedMotion } from './utils.js'
import { play } from './sound.js'

gsap.registerPlugin(ScrollTrigger)

export let lenis = null

export function initScroll() {
  if (!reducedMotion) {
    lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 1 })
    lenis.on('scroll', ScrollTrigger.update)
    gsap.ticker.add((t) => lenis.raf(t * 1000))
    gsap.ticker.lagSmoothing(0)
  }

  // Anchor links go through Lenis so they glide instead of jump.
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]')
    if (!a || a.hasAttribute('data-open')) return
    const id = a.getAttribute('href')
    if (!/^#[\w-]+$/.test(id)) return
    const target = id === '#top' ? 0 : $(id)
    if (target == null) return
    e.preventDefault()
    closeMenu()
    if (lenis) lenis.scrollTo(target, { offset: id === '#top' ? 0 : -8, duration: 1.4 })
    else if (target === 0) window.scrollTo(0, 0)
    else target.scrollIntoView()
  })

  initNav()
  initMenu()
}

export const stopScroll = () => lenis?.stop()
export const startScroll = () => lenis?.start()

/* Split headlines into masked words. An accent (<em>) is split too, each
   word keeping its <em>, so long accents wrap like the rest. */
export function splitHeadings() {
  $$('[data-split]').forEach((el) => {
    let i = 0
    const wrap = (html) => `<span class="split-w"><span style="--i:${i++}">${html}</span></span>`
    const out = []
    el.childNodes.forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        node.textContent.split(/(\s+)/).forEach((part) => {
          if (!part) return
          out.push(/^\s+$/.test(part) ? ' ' : wrap(part))
        })
      } else if (node.nodeName === 'EM') {
        node.textContent.split(/(\s+)/).forEach((part) => {
          if (!part) return
          out.push(/^\s+$/.test(part) ? ' ' : wrap(`<em>${part}</em>`))
        })
      } else {
        out.push(wrap(node.outerHTML))
      }
    })
    el.innerHTML = out.join('')
  })
}

/* Toggle .is-in once as elements come on screen. */
export function initReveals() {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return
      entry.target.classList.add('is-in')
      io.unobserve(entry.target)
    })
  }, { rootMargin: '0px 0px -8% 0px' })
  $$('[data-reveal], [data-split]').forEach((el) => io.observe(el))
}

function initNav() {
  const nav = $('[data-nav]')
  let lastY = 0
  const onScroll = () => {
    const y = window.scrollY
    nav.classList.toggle('is-scrolled', y > 40)
    nav.classList.toggle('is-hidden', y > 400 && y > lastY + 4 && !document.body.classList.contains('menu-open'))
    if (y < lastY - 4 || y < 400) nav.classList.remove('is-hidden')
    lastY = y
  }
  addEventListener('scroll', onScroll, { passive: true })
  onScroll()

  // Highlight the section currently in view.
  const links = $$('[data-nav-link]')
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return
      const id = entry.target.id
      links.forEach((a) => a.classList.toggle('is-active', a.dataset.navLink === id))
    })
  }, { rootMargin: '-45% 0px -50% 0px' })
  $$('main > section[id]').forEach((s) => io.observe(s))

  links.forEach((a) => a.addEventListener('mouseenter', () => play('hover')))
}

function initMenu() {
  const btn = $('[data-menu-toggle]')
  const menu = $('[data-menu]')
  btn.addEventListener('click', () => (menu.hidden ? openMenu() : closeMenu()))
  addEventListener('keydown', (e) => e.key === 'Escape' && !menu.hidden && closeMenu())
}
function openMenu() {
  const menu = $('[data-menu]')
  menu.hidden = false
  document.body.classList.add('menu-open')
  $('[data-menu-toggle]').setAttribute('aria-expanded', 'true')
  $('[data-menu-toggle]').textContent = 'Close'
  gsap.fromTo(menu.children, { yPercent: 60, opacity: 0 }, { yPercent: 0, opacity: 1, stagger: 0.05, duration: 0.7, ease: 'expo.out' })
  stopScroll()
  play('click')
}
function closeMenu() {
  const menu = $('[data-menu]')
  if (menu.hidden) return
  menu.hidden = true
  document.body.classList.remove('menu-open')
  $('[data-menu-toggle]').setAttribute('aria-expanded', 'false')
  $('[data-menu-toggle]').textContent = 'Menu'
  startScroll()
}
