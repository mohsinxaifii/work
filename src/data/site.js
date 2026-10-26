/* ==================================================================
   SITE CONTENT - identity, contact and the bits of copy that aren't
   projects (projects.js) or work history (cv.js).
   ================================================================== */

import { asset } from './asset.js'

/* Per-region contact details. The main page is Dubai; /in/ (generated from
   index.html by vite.config.js, tagged <html data-region="in">) is India.
   Everything else on the page is shared. Until a CV PDF exists at its
   path, the download buttons say so instead of serving a 404. */
const regions = {
  ae: {
    location: 'Dubai, UAE',
    city: 'Dubai',
    timezone: 'Asia/Dubai',
    status: 'In Dubai · can join immediately',
    phone: '+971 54 127 3247',
    cv: asset('/cv/Mohd-Mohsin-CV.pdf'),
  },
  in: {
    location: 'New Delhi, India',
    city: 'New Delhi',
    timezone: 'Asia/Kolkata',
    status: 'Available for work',
    phone: '+91 93196 17848',
    cv: asset('/cv/Mohd-Mohsin-CV-India.pdf'),
  },
}
const region = regions[globalThis.document?.documentElement.dataset.region] ?? regions.ae

export const site = {
  name: 'Mohsin',
  fullName: 'Mohd Mohsin',
  nameAr: 'محسن',
  ...region,
  email: 'mohsinxaifi@gmail.com',
  title: 'Software Engineer',
  portrait: asset('/me.webp'),

  socials: [
    { label: 'LinkedIn', url: 'https://linkedin.com/in/mohsinxaifi' },
    { label: 'GitHub', url: 'https://github.com/mohsinxaifii' },
  ],

  /* Contact form delivery. Each message goes to both at once and counts as
     sent when either one confirms. `formspree` is the form endpoint
     (formspree.io -> the form -> Integration); `sheetUrl` is the Web app
     URL of scripts/enquiry-inbox.gs, which saves a row to a Google Sheet
     and emails you. Leave either empty to drop that route. */
  enquiry: {
    formspree: 'https://formspree.io/f/xaeqdreo',
    sheetUrl: 'https://script.google.com/macros/s/AKfycbxpCWTUgIdM9JaNPR6LVv3_Hj6XCJNfJu464_UYyVC52NoqWrD1Hiy_8w3_mO4c_EZz/exec',
  },

  /* Umami Cloud (cloud.umami.is): paste the Website ID from Settings ->
     Websites. Empty turns analytics off. It only loads in production
     builds, and only counts visits on `domains`. */
  analytics: {
    umamiId: 'a07b98d2-591a-40db-8632-38449a7d0f32',
    domains: 'mohsinxaifii.github.io',
  },
}

/* Proof band: four short claims under the hero, set as large as the
   headlines. *Starred* words take the accent. Words, not figures: each
   one says what keeps happening, not a single result. */
export const proof = [
  { claim: 'Conversion, *multiplied*', label: 'Storefronts rebuilt until they sell, brand after brand' },
  { claim: '*Dozens* of launches', label: 'Websites designed, built and shipped, then kept selling' },
  { claim: 'Systems, built *solo*', label: 'ERPs, inventory and operations, from a blank page' },
  { claim: 'AI on *every shift*', label: 'Assistants that answer, qualify leads and support customers' },
]

/* Draggable stickers. `at` is where each starts inside the section named
   by `in`: [x as % of the section width, y in px from its top]. Pixels
   for y keep them in the whitespace above each headline. */
export const stickers = [
  { text: 'references on request', tone: 'ink', in: 'impact', at: [84, 18], rot: -6 },
  { text: 'dozens of live sites', tone: 'pink', in: 'work', at: [48, -18], rot: 5 },
  { text: '3+ years', tone: 'lime', in: 'about', at: [58, -18], rot: -8 },
  { text: 'Shopify Partner', tone: 'blue', in: 'skills', at: [76, -18], rot: 7 },
  { text: 'replies within a day', tone: 'pink', in: 'contact', at: [62, 150], rot: -5 },
]
