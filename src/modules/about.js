/* About: a few short facts under the intro line. The intro itself is
   written by experience.js, and the story is the boarding passes. */

import { $, esc } from './utils.js'
import { site } from '../data/site.js'
import { languages, education } from '../data/cv.js'

export function initAbout() {
  const facts = [
    ['Based in', esc(site.location)],
    ['Speaks', esc(languages.join(', '))],
    ['Studied', `${esc(education[0].qualification)}, ${esc(education[0].org)}`],
  ]
  $('[data-facts]').innerHTML = facts.map(([k, v]) => `<div><dt class="label">${k}</dt><dd>${v}</dd></div>`).join('')
}
