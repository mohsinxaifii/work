/* About: copy from the CV and a facts list. (The portrait lives in the
   hero.) */

import { $, esc } from './utils.js'
import { site } from '../data/site.js'
import { summary, about, languages, education } from '../data/cv.js'

export function initAbout() {
  $('[data-about-lede]').textContent = summary
  $('[data-about-body]').innerHTML = about.map((p) => `<p>${esc(p)}</p>`).join('')

  const tel = site.phone.replace(/[^\d+]/g, '')
  const facts = [
    // Short facts pair up; the two long ones close the list on their own rows.
    ['Based in', esc(site.location)],
    ['Role', esc(site.title)],
    ['Languages', esc(languages.join(', '))],
    ['Phone', `<a href="tel:${esc(tel)}">${esc(site.phone)}</a>`],
    ['Education', `${esc(education[0].qualification)}, ${esc(education[0].org)}`],
    ['Email', `<a href="mailto:${esc(site.email)}">${esc(site.email)}</a>`],
  ]
  $('[data-facts]').innerHTML = facts.map(([k, v]) => `<div><dt class="label">${k}</dt><dd>${v}</dd></div>`).join('')
}
