/* ==================================================================
   PRINTER - the CV as a thermal receipt. "Print CV" feeds the paper
   out of the slot with a clatter; dragging the receipt down past the
   tear line rips it off and downloads the real PDF. Every other
   [data-cv-download] link downloads directly.
   ================================================================== */

import { gsap } from 'gsap'
import { $, $$, esc, barcode } from './utils.js'
import { site } from '../data/site.js'
import { play } from './sound.js'
import { toast } from './toast.js'

// Vite's dev server answers a missing file with index.html, so check the type.
let cvCheck = null
const cvExists = () => (cvCheck ??= fetch(site.cv, { method: 'HEAD' })
  .then((r) => r.ok && /pdf/i.test(r.headers.get('content-type') || ''))
  .catch(() => false))

export async function downloadCV() {
  if (!(await cvExists())) {
    play('nope')
    toast(`CV PDF isn't uploaded yet. Email ${site.email} and I'll send it.`, 4200)
    return false
  }
  const a = document.createElement('a')
  a.href = site.cv
  a.download = site.cv.split('/').pop()
  document.body.appendChild(a)
  a.click()
  a.remove()
  play('success')
  toast('CV downloaded')
  return true
}

function receiptHTML() {
  const now = new Date()
  const date = new Intl.DateTimeFormat('en-GB', { timeZone: site.timezone, day: '2-digit', month: '2-digit', year: 'numeric' }).format(now)
  const time = new Intl.DateTimeFormat('en-GB', { timeZone: site.timezone, hour: '2-digit', minute: '2-digit' }).format(now)
  const line = (l, r, cls = '') => `<div class="receipt__line ${cls}"><span>${l}</span><span>${r}</span></div>`
  const rule = '<hr class="receipt__rule">'
  const items = [
    ['Software engineering', '✓'],
    ['ERPs + inventory systems', '✓'],
    ['AI assistants', '✓'],
    ['Dozens of live websites', '✓'],
    ['Conversion lifts', '✓'],
    ['Commerce, end to end', '✓'],
    ['Clear communication', '✓'],
  ]
  return `
    <div class="receipt__center">
      <p class="receipt__brand">mohsin &amp; co.</p>
      <p>Full-stack · Shopify · AI</p>
      <p>${esc(site.location)}</p>
      <p>Tel ${esc(site.phone)}</p>
    </div>
    ${rule}
    ${line(`Date ${date}`, `Time ${time}`)}
    ${line('Order #DXB-MM', 'Cashier: Mohsin')}
    ${rule}
    ${items.map(([l, r]) => line(l, r)).join('')}
    ${rule}
    ${line('Availability', 'Immediate')}
    ${line('Location', site.city)}
    ${line('Total', '1 strong hire', 'receipt__total')}
    ${rule}
    <div class="receipt__center">
      <p>Thank you for visiting</p>
      <p class="ar receipt__ar" lang="ar" dir="rtl">شكراً لزيارتكم</p>
      <p>Please come again</p>
    </div>
    <div class="receipt__barcode">${barcode('mohsin-cv', 46)}</div>
    <p class="receipt__center" style="text-transform:none">${esc(site.email)}</p>
    <p class="receipt__tear">✂ - - <b>drag down to tear &amp; download</b> - -</p>`
}

export function initPrinter() {
  $$('[data-cv-download]').forEach((a) => {
    a.href = site.cv
    a.addEventListener('click', (e) => { e.preventDefault(); downloadCV() })
  })

  const paper = $('[data-paper]')
  const receipt = $('[data-receipt]')
  const btn = $('[data-print]')
  const led = $('[data-printer-led]')
  receipt.innerHTML = receiptHTML()

  let state = 'idle'

  function print() {
    if (state === 'printing') return
    state = 'printing'
    receipt.innerHTML = receiptHTML()
    btn.disabled = true
    btn.classList.add('is-pressed')
    led.classList.add('is-on')
    play('click')
    gsap.set(paper, { height: 0, y: 0, rotation: 0, opacity: 1 })
    const h = receipt.offsetHeight
    let lastTick = 0
    gsap.to(paper, {
      height: h,
      duration: h / 190,
      ease: 'none',
      onUpdate() {
        const t = performance.now()
        if (t - lastTick > 55) { play('print'); lastTick = t }
      },
      onComplete() {
        state = 'printed'
        btn.disabled = false
        btn.classList.remove('is-pressed')
        btn.textContent = 'Reprint'
        led.classList.remove('is-on')
        play('success')
        toast('Drag the receipt down to tear it off')
      },
    })
  }
  btn.addEventListener('click', print)

  // ---- tear ----
  let startY = 0
  let dragging = false
  receipt.addEventListener('pointerdown', (e) => {
    if (state !== 'printed') return
    dragging = true
    startY = e.clientY
    receipt.setPointerCapture(e.pointerId)
    receipt.classList.add('is-drag')
  })
  receipt.addEventListener('pointermove', (e) => {
    if (!dragging) return
    const dy = Math.max(0, e.clientY - startY)
    gsap.set(paper, { y: dy * 0.45, rotation: dy * 0.02, transformOrigin: '50% 0%' })
    if (dy > 110) tear()
  })
  const release = () => {
    if (!dragging) return
    dragging = false
    receipt.classList.remove('is-drag')
    if (state === 'printed') gsap.to(paper, { y: 0, rotation: 0, duration: 0.6, ease: 'elastic.out(1, .4)' })
  }
  receipt.addEventListener('pointerup', release)
  receipt.addEventListener('pointercancel', release)

  function tear() {
    if (state !== 'printed') return
    state = 'torn'
    dragging = false
    receipt.classList.remove('is-drag')
    play('tear')
    gsap.to(paper, {
      y: '+=520',
      rotation: 14,
      opacity: 0,
      duration: 0.9,
      ease: 'power2.in',
      onComplete() {
        gsap.set(paper, { height: 0, y: 0, rotation: 0, opacity: 1 })
        btn.textContent = 'Print again'
        state = 'idle'
      },
    })
    downloadCV()
  }
}
