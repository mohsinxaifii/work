/* ==================================================================
   PREFERENCES - theme (light/dark), mode (chaos/recruiter), sound.
   The initial values are applied by the inline script in index.html
   before first paint; this wires the controls and broadcasts changes.
   ================================================================== */

import { $, store } from './utils.js'
import { play, sound } from './sound.js'
import { toast } from './toast.js'

const root = document.documentElement

export function setTheme(theme) {
  root.dataset.theme = theme
  store.set('theme', theme)
  $('meta[name="theme-color"]').content = theme === 'dark' ? '#1E1E1E' : '#F4F4F0'
  dispatchEvent(new CustomEvent('themechange', { detail: theme }))
}
export const toggleTheme = () => setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark')

export function setMode(mode) {
  root.dataset.mode = mode
  store.set('mode', mode)
  root.classList.toggle('sound-on', sound.on && mode === 'chaos')
  dispatchEvent(new CustomEvent('modechange', { detail: mode }))
}

export function initPrefs() {
  root.classList.toggle('sound-on', sound.on && root.dataset.mode === 'chaos')

  $('[data-mode-toggle]').addEventListener('click', () => {
    const next = root.dataset.mode === 'chaos' ? 'recruiter' : 'chaos'
    setMode(next)
    if (next === 'chaos') { play('chaos'); toast('Interactive mode on') }
    else toast('Simple mode: content only')
  })

  $('[data-sound-toggle]').addEventListener('click', () => {
    if (root.dataset.mode === 'recruiter') { toast('Sound is available in interactive mode'); return }
    sound.set(!sound.on)
    toast(sound.on ? 'Sound on' : 'Sound off')
  })

  $('[data-theme-toggle]').addEventListener('click', toggleTheme)
}
