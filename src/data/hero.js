/* ==================================================================
   HERO - the first screen. A huge headline whose last word cycles
   through `words`, ringed by a collage of small live interfaces, with a
   ticker along the bottom. The rest of the proof is the band under the
   hero (proof in site.js).

   The chat and terminal are illustrations of the kind of work, not
   transcripts from a client; keep them free of figures and names.
   ================================================================== */

export const hero = {
  words: ['sells', 'scales', 'saves hours', 'ships faster'],
  lede: 'Websites, internal systems and AI assistants for growing brands.',

  // The editor card. Highlighted by pitch.js: keywords, strings, comments.
  code: [
    'const launch = async (brand) => {',
    '  const store = await build(brand)',
    '  await automate(store) // hours back',
    "  return grow(store, 'revenue')",
    '}',
  ],

  // The outcomes card flips through these: Arabic, then what it means.
  arabic: [
    ['مبيعات أكثر', 'More sales'],
    ['إطلاق أسرع', 'Faster launches'],
    ['أتمتة ذكية', 'Smart automation'],
    ['نمو مستمر', 'Steady growth'],
  ],

  // The AI assistant card loops through these exchanges.
  chat: [
    ['Do you deliver to Dubai Marina?', 'Yes, we do. Want me to check stock in your size?'],
    ['Where is my order?', 'Packed this morning and out for delivery today.'],
    ['Which one suits dry skin?', 'The night cream. I can add it to your cart.'],
  ],

  // The deploy terminal types these, one per line, then starts over.
  terminal: ['$ git push origin main', '✓ tests passed', '✓ build ready', '✓ live in production'],

  lift: { value: 8, suffix: '×', label: 'Conversion lift, across brands' },

  /* The bottom ticker: skills, with outcomes in Arabic and short
     promises in the serif italic mixed in. `ar` items are [Arabic,
     meaning]; `say` items are the promises. */
  ticker: [
    'Shopify', 'React', { ar: ['مبيعات أكثر', 'more sales'] }, { say: 'Built to convert' },
    'OpenAI', 'Claude', { ar: ['أتمتة', 'automation'] }, { say: 'Systems that run without you' },
    'Node.js', 'Laravel', { ar: ['إطلاق أسرع', 'faster launch'] }, { say: 'One owner, end to end' },
    'AWS', 'Figma', { ar: ['جودة', 'quality'] }, { say: 'From idea to revenue' },
    'Liquid', 'ERP systems', { ar: ['نمو', 'growth'] }, { say: 'Shipped on time' },
  ],
}
