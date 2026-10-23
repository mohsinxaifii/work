import { defineConfig } from 'vite'
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { resolve } from 'node:path'

const root = import.meta.dirname

/* /in/ is the same page as / for people in India: only the location, phone,
   clock and CV change. It's generated from index.html so the two can never
   drift apart; the region's contact details live in src/data/site.js. */
const india = [
  ['<html lang="en"', '<html lang="en" data-region="in"'],
  ['Software engineer in Dubai', 'Software engineer in New Delhi'],
  ['a software engineer in Dubai who', 'a software engineer in New Delhi who'],
  ['In Dubai, can join immediately.', 'Based in New Delhi, available for work.'],
  ['content="https://mohsinxaifii.github.io/work/">', 'content="https://mohsinxaifii.github.io/work/in/">'],
  ['<meta property="og:image" content="https://mohsinxaifii.github.io/work/og.png">', '<meta property="og:image" content="https://mohsinxaifii.github.io/work/og-in.png">'],
  ['<meta name="twitter:image" content="https://mohsinxaifii.github.io/work/og.png">', '<meta name="twitter:image" content="https://mohsinxaifii.github.io/work/og-in.png">'],
]

function writeIndia() {
  let html = readFileSync(resolve(root, 'index.html'), 'utf8')
  for (const [from, to] of india) {
    if (!html.includes(from)) throw new Error(`vite.config.js: "${from}" not found in index.html - update the /in/ replacements`)
    html = html.replace(from, to)
  }
  mkdirSync(resolve(root, 'in'), { recursive: true })
  writeFileSync(resolve(root, 'in/index.html'), html)
}

const indiaPage = () => ({
  name: 'india-page',
  configureServer(server) {
    server.watcher.on('change', (file) => {
      if (resolve(file) === resolve(root, 'index.html')) writeIndia()
    })
  },
})

// GitHub Pages serves the repo at https://<user>.github.io/<repo>/, so the
// production build is based at /work/. `npm run dev` stays at the root.
// On a custom domain (or a <user>.github.io repo) set BASE_PATH=/ instead.
export default defineConfig(({ command, isPreview }) => {
  writeIndia()
  return {
    base: command === 'build' || isPreview ? (process.env.BASE_PATH || '/work/') : '/',
    plugins: [indiaPage()],
    build: {
      target: 'es2020',
      rollupOptions: {
        input: {
          main: resolve(root, 'index.html'),
          in: resolve(root, 'in/index.html'),
        },
      },
    },
  }
})
