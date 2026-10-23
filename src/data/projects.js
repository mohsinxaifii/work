/* ==================================================================
   PROJECTS

   One entry per case study, in display order. `slug` becomes
   /work/<slug>. scripts/gen-cases.mjs wipes and regenerates /work on
   every dev and build run, so adding or removing an entry here is all
   it takes.

   Order is hand-picked and is the order the site shows. The first five
   are featured.

   `featured: true` puts it on the index (the first four fill the lead
   block and the closing strip).
   `market` (optional) tags work for a client outside India, e.g. Dubai.
   `category` overrides the filter chip; `status` replaces the live-site
   link with a line of text; `system` adds an "Under the hood" block.
   `live: false` hides the outbound links for work that isn't on its
   domain yet (`url` still feeds the browser bar).
   `upcoming: true` puts it in the "Upcoming Next" slot (pick one).

   Images live in public/work/<slug>/ as WebP: thumb.webp is 5:2 (card + case
   hero), gallery-*.webp are 16:9 desktop captures of the live site.
   `year` is optional - null hides it everywhere.
   ================================================================== */

import { asset } from './asset.js'

const ROLE = 'Design, development & delivery'
const SHOPIFY = ['Shopify', 'Liquid', 'JavaScript', 'CSS']

// Every project follows the same image layout, so build the paths once.
const shots = (slug, count = 3) => ({
  thumb: asset(`/work/${slug}/thumb.webp`),
  gallery: Array.from({ length: count }, (_, i) => asset(`/work/${slug}/gallery-${i + 1}.webp`)),
})

export const projects = [
  {
    slug: 'the-bikaneri-kitchen',
    title: 'The Bikaneri Kitchen',
    client: 'The Bikaneri Kitchen',
    year: null,
    isNew: false,
    featured: true,
    upcoming: false,
    role: ROLE,
    stack: SHOPIFY,
    url: 'https://thebikanerikitchen.com',
    ...shots('the-bikaneri-kitchen', 4),
    thumbAlt: 'The Bikaneri Kitchen - campaign portraits with the bhujia thali and red tin',
    logo: null,
    description:
      'A heritage D2C brand built as a story-led Shopify store, where the '
      + 'narrative is the sales funnel and every chapter ends in a cart.',
    background:
      'The Bikaneri Kitchen sells bhujia made the way it was in the royal '
      + 'kitchen of Maharaja Dungar Singh in 1877. A premium price only holds '
      + 'if the brand feels like that heritage, so I treated the store as a '
      + 'positioning problem first and a build second.',
    story:
      'I owned the build end to end on a custom Shopify theme: editorial '
      + 'product ‘plates’ with add-to-cart inside the story, a Rituals journal, '
      + 'an Archive and profiles of the karigars behind the craft, all as '
      + 'reusable sections the brand team can run without a developer. Heavy '
      + 'campaign photography is served responsively so the store stays fast on '
      + 'mobile, where most orders start.',
  },
  {
    slug: 'solethreads',
    title: 'Solethreads',
    client: 'Solethreads',
    year: null,
    isNew: true,
    featured: true,
    upcoming: false,
    role: 'Research, design & development',
    stack: SHOPIFY,
    // This design isn't on the domain yet, so the case study doesn't link out.
    live: false,
    url: 'https://solethreads.com',
    ...shots('solethreads'),
    thumbAlt: 'Solethreads - "We bring in the sneaker revolution" campaign section',
    logo: null,
    description:
      'End-to-end revamp of a multi-brand footwear label: research, UX, '
      + 'design system and a mobile-first Shopify build for drops, comfort '
      + 'lines and collabs.',
    background:
      'Solethreads runs several sub-brands under one roof, from limited '
      + 'sneaker drops to comfort lines like Gelatoe and Marshmellow, and the '
      + 'old store sold all of them the same way. I led the research and owned '
      + 'the product from information architecture to theme code.',
    story:
      'Designed at 375px first and adapted to desktop, on a component-based '
      + 'design system that gives each sub-brand its own world without forking '
      + 'the theme. Drop countdowns and ‘What’s Hot’ rails build hype, faceted '
      + 'listings and a size guide cut friction and returns, and product pages '
      + 'carry care instructions and reviews, alongside a community page and '
      + 'the full account area.',
  },
  {
    slug: 'kachori-story',
    title: 'The Kachori Story',
    client: 'The Kachori Story',
    year: null,
    isNew: false,
    featured: true,
    upcoming: false,
    role: ROLE,
    stack: ['React', 'Vite', 'JavaScript', 'CSS animation'],
    url: 'https://kachoristory.com',
    ...shots('kachori-story'),
    // Illustrated cover: people round a table sharing kachoris. Cropped
    // from 30% down so the headline and the plate both stay in frame.
    thumb: asset('/work/kachori-story/cover.webp'),
    thumbPosition: '50% 30%',
    thumbAlt: 'The Kachori Story illustration: "From the heart of the streets to your table", a row of people sharing kachoris, chai and samosas',
    logo: null,
    description:
      'A franchise-ready brand site for a street-food chain, built '
      + 'in React to work as both a menu and a lead-generation channel.',
    background:
      'The Kachori Story is growing through franchising, so the site had two '
      + 'jobs: make the food irresistible, and turn the right visitors into '
      + 'franchise enquiries. A template would have flattened a loud, '
      + 'illustrated brand into another restaurant listing.',
    story:
      'I architected and built it from scratch in React on Vite, as a '
      + 'component library mapped to the brand’s illustration system, so every '
      + 'section is art-directed without a heavy CMS in the way. The menu, '
      + 'recommendations, brand story and a dedicated franchise funnel share '
      + 'one navigation, on a lean bundle that loads quickly on mobile.',
  },
  {
    slug: 'the-trost',
    title: 'The Trost',
    client: 'The Trost',
    year: null,
    isNew: false,
    featured: true,
    upcoming: false,
    role: ROLE,
    stack: SHOPIFY,
    url: 'https://thetrost.com',
    ...shots('the-trost'),
    thumbAlt: 'The Trost - Hemp Based Wellness hero over cannabis leaves',
    logo: null,
    description:
      'A premium Shopify store that makes a brand-new wellness category feel '
      + 'safe to buy into, for a hemp brand pairing Ayurveda with Swiss '
      + 'formulation.',
    background:
      'Most of The Trost’s shoppers meet hemp wellness for the first time on '
      + 'this site, so conversion depends on trust before product. I treated '
      + 'education, careful language and calm design as conversion tools, not '
      + 'decoration.',
    story:
      'Built on Shopify with a dark, cinematic design system and a guided '
      + '‘Find Your Calm’ ritual that routes first-timers to the right product. '
      + 'Sub-brands Mello and Kosha get their own space, and the site reaches '
      + 'past the cart into B2B: partner enquiries, a journal and a store '
      + 'locator for offline stockists.',
  },
  {
    slug: 'zinara',
    title: 'Zinara',
    client: 'Zinara',
    year: null,
    isNew: false,
    featured: true,
    upcoming: false,
    role: ROLE,
    stack: ['Shopify', 'Liquid', 'Laravel', 'Admin API', 'Google Sheets API', 'PHP'],
    url: 'https://zinara.in',
    ...shots('zinara'),
    thumbAlt: 'Zinara - Evil Eye Collection hero, look chic while keeping away bad vibes',
    logo: null,
    description:
      'The storefront and the back office behind it: a Shopify store for a '
      + 'lab-grown diamond brand, plus the inventory, reviews and wishlist '
      + 'systems I built to run it.',
    background:
      'Zinara sells IGI- and SGL-certified lab-grown diamond jewellery, '
      + 'hallmarked by BIS. Online, trust has to sit right next to the price, '
      + 'and a variant-heavy catalogue has to stay accurate in Shopify without '
      + 'a team re-typing it by hand.',
    story:
      'On the front end, an editorial Shopify theme puts certification, '
      + 'lifetime exchange and insured shipping where hesitation starts. Behind '
      + 'it sit three services I designed and built. Zinara Inventory is a '
      + 'Laravel app that treats a Google Sheet as the product master and syncs '
      + 'products, variants, prices, stock levels and metafields into Shopify '
      + 'through the Admin API, on queued jobs with retries, rate-limit backoff '
      + 'and a live sync-status dashboard. A reviews bridge pipes Judge.me '
      + 'reviews into the theme’s own native section through webhooks and '
      + 'metaobjects. An HMAC-signed wishlist service keeps a logged-in '
      + 'customer’s list in sync across every device.',
  },
  {
    slug: 'rasayanam',
    title: 'Rasayanam',
    client: 'Rasayanam',
    year: null,
    isNew: false,
    featured: false,
    upcoming: false,
    role: ROLE,
    stack: SHOPIFY,
    url: 'https://rasayanam.in',
    ...shots('rasayanam'),
    thumbAlt: 'Rasayanam - Feel the calm, see the change - ashwagandha hero',
    logo: null,
    description:
      'A high-volume Shopify store for a supplements brand trusted by over a '
      + 'million customers, engineered to convert and to prove what’s in the '
      + 'bottle.',
    background:
      'Rasayanam sells purity-tested supplements at scale, with a 4.5-star '
      + 'average across 20,000+ reviews. In a category crowded with doubtful '
      + 'claims, the store had to sell hard and earn trust in the same scroll.',
    story:
      'Merchandising starts from the customer’s problem: a shop-by-concern '
      + 'rail answers ‘what’s stopping you from feeling your best?’ before '
      + 'showing a single SKU. Build-your-own-box bundles are designed to lift '
      + 'order value, an order-verification page tackles counterfeit worries, '
      + 'and review-led proof runs through every template.',
  },
  {
    slug: 'zinara-back-office',
    title: 'Zinara Back Office',
    client: 'Zinara',
    year: null,
    isNew: true,
    featured: false,
    upcoming: false,
    role: 'Architecture & development',
    stack: ['Laravel', 'PHP', 'Shopify Admin API', 'GraphQL', 'Google Sheets API', 'Webhooks'],
    // Its own filter chip, and no outbound link: it is internal tooling.
    category: 'Systems',
    url: 'https://zinara.in',
    status: 'Internal system, runs the zinara.in store',
    // Its case page is the live "Under the hood" block (src/modules/system.js)
    // instead of a hero image + gallery, so only the card cover is needed.
    system: 'zinara',
    ...shots('zinara-back-office', 0),
    frame: false,
    thumbAlt: 'Zinara Back Office - Google Sheet to Laravel queue to Shopify Admin API, as a live system diagram',
    logo: null,
    description:
      'The back office I architected for a lab-grown diamond brand: a Laravel '
      + 'sync engine, a reviews bridge and a signed wishlist service that keep '
      + 'a Shopify store accurate without manual data entry.',
    background:
      'Zinara’s catalogue is variant-heavy, with metals, sizes and certified '
      + 'stones, and the team manages it in Google Sheets. Re-typing that into '
      + 'Shopify was slow and error-prone, reviews came through a third-party '
      + 'widget that didn’t match the theme, and wishlists vanished between '
      + 'devices.',
    story:
      'I designed and built three services around the store. A Laravel 10 '
      + 'sync engine reads the sheet and writes products, variants, prices, '
      + 'stock and metafields through the Shopify Admin API, on queued jobs '
      + 'with a shared retry layer for rate limits and a status dashboard. A '
      + 'PHP bridge moves Judge.me reviews into native metaobjects through '
      + 'webhooks and a scheduled sync. A wishlist service stores each list on '
      + 'the customer record, secured with short-lived HMAC signatures.',
  },
  {
    slug: 'beyond-beyond',
    title: 'Beyond Beyond',
    client: 'Beyond Beyond Skincare',
    year: null,
    isNew: false,
    featured: false,
    upcoming: false,
    role: ROLE,
    stack: SHOPIFY,
    url: 'https://beyondbeyond.co.in',
    ...shots('beyond-beyond'),
    thumbAlt: 'Beyond Beyond - clean clinical skincare, About hero',
    logo: null,
    description:
      'The launch store for a first-of-its-kind NAD+ skincare line: a clinical, '
      + 'concern-led Shopify build that sells a new ingredient to people who '
      + 'have never heard of it.',
    background:
      'Beyond Beyond had to create the category before it could sell into it. '
      + 'I approached the store as an education-to-checkout funnel: explain '
      + 'NAD+ fast, then make choosing a product effortless.',
    story:
      'A Shopify build on a white, clinical system where the orange packaging '
      + 'does the colour work. Navigation splits by concern, bestsellers and '
      + 'sets; a dedicated NAD+ science page and an expert-guidance module '
      + 'carry the education; and product pages lead with benefits and a '
      + 'free-from strip that answers ingredient questions before they are '
      + 'asked.',
  },
  {
    slug: 'design-dimensions',
    title: 'Design Dimensions',
    client: 'Design Dimensions',
    year: null,
    isNew: false,
    featured: false,
    upcoming: false,
    role: ROLE,
    stack: ['HTML', 'CSS', 'JavaScript', 'GSAP'],
    url: 'https://designdimensions.in',
    ...shots('design-dimensions', 2),
    thumbAlt: 'Design Dimensions - homepage with Snack Factory packaging',
    logo: null,
    description:
      'The web presence of a branding, packaging and spatial-design studio, '
      + 'built to win clients with the work itself: case studies, a Work Diary '
      + 'and a design journal.',
    background:
      'Design Dimensions works with hospitality and FMCG brands, from '
      + 'Suryagarh and Samsara to Snack Factory. As the studio’s sole technical '
      + 'lead, I owned its own site as well as client delivery.',
    story:
      'I shipped an interim portfolio in hand-coded HTML, CSS and GSAP so the '
      + 'work stayed visible during the rebuild, then led the new site: a '
      + 'homepage that opens on the work, a filterable Work Diary, long-form '
      + 'case studies like Samsara, a Design Dialogue journal and an About page '
      + 'built around the founder.',
  },
  {
    slug: 'twisty-designs',
    title: 'Twisty Designs',
    client: 'Twisty Designs',
    year: null,
    isNew: false,
    featured: false,
    upcoming: true,
    role: ROLE,
    stack: ['Webflow', 'JavaScript', 'Interactions'],
    url: 'https://www.twistydesigns.co',
    ...shots('twisty-designs'),
    thumbAlt: 'Twisty Designs - See it, want it, buy it',
    logo: null,
    description:
      'A conversion-focused Webflow site for an e-commerce design agency '
      + 'serving clients across Europe, the USA and Asia.',
    background:
      'Twisty sells product personalisation, visualisation and performance '
      + 'creative to e-commerce brands. An agency that promises to make '
      + 'products irresistible has to prove it in the first scroll, and this '
      + 'site is its main sales asset.',
    story:
      'Built in Webflow with custom JavaScript on top of native interactions: '
      + 'oversized condensed type, live marquees and a ‘See it, want it, buy '
      + 'it!’ voice. Services, a 150+ project portfolio, the team and a '
      + 'consultation-booking flow each have their own section, with a call to '
      + 'action never more than a scroll away.',
  },
  {
    slug: 'niche-star-advertising',
    title: 'Niche Star',
    client: 'Niche Star Advertising',
    year: null,
    market: 'Dubai, UAE',
    isNew: false,
    featured: false,
    upcoming: false,
    role: ROLE,
    stack: ['HTML', 'CSS', 'JavaScript', 'GSAP'],
    url: 'https://nichestaradvertising.com',
    ...shots('niche-star-advertising'),
    thumbAlt: 'Niche Star - Advertising, events, visual merchandising and retail displays',
    logo: null,
    description:
      'A capability site for a Dubai production house, built to win B2B '
      + 'briefs for retail displays, events, fabrication and large-format '
      + 'print.',
    background:
      'Niche Star is the production arm of Niche Marketing Management in the '
      + 'UAE, delivering point-of-sale, exhibition and signage work from its '
      + 'own 4,000 sq ft facility. Its buyers are brand managers and agencies '
      + 'comparing suppliers, so the site has to communicate capacity and '
      + 'reliability at a glance.',
    story:
      'Hand-built in HTML, CSS and GSAP for full control over motion and load '
      + 'time: scroll-driven reveals, eight service lines, a video gallery of '
      + 'delivered work, a five-step process and live Google reviews, all '
      + 'leading to a single enquiry action.',
  },
  {
    slug: 'the-casabella',
    title: 'The Casabella',
    client: 'The Casabella',
    year: null,
    isNew: false,
    featured: false,
    upcoming: false,
    role: ROLE,
    stack: SHOPIFY,
    url: 'https://www.thecasabella.in',
    ...shots('the-casabella'),
    thumbAlt: 'The Casabella - Elevate your walls with timeless elegance',
    logo: null,
    description:
      'A premium Shopify store for artisan home décor, designed with the '
      + 'restraint of a gallery so ornate pieces can carry the sale.',
    background:
      'The Casabella sells hand-carved jharokhas, pichwai and sacred décor at '
      + 'gallery prices. Ornate products need a quiet store, and buyers '
      + 'furnishing a room need to find the right piece fast.',
    story:
      'A Shopify build on warm ivory, with arched product frames that echo '
      + 'the jharokhas themselves. Collections are organised by room and intent '
      + '(wall décor, mirrors and lighting, the wood edit, puja and sacred, '
      + 'gifting), with New Arrivals and Best Sellers rails doing the '
      + 'merchandising.',
  },
  {
    slug: 'ocher-studio',
    title: 'Ocher Studio',
    client: 'Ocher Studio',
    year: null,
    isNew: false,
    featured: false,
    upcoming: false,
    role: ROLE,
    stack: SHOPIFY,
    url: 'https://ocherstudio.in',
    ...shots('ocher-studio'),
    thumbAlt: 'Ocher Studio - Made to live with, handcrafted décor',
    logo: null,
    description:
      'One Shopify store serving two markets: retail shoppers furnishing '
      + 'their homes, and companies placing bulk corporate-gifting orders.',
    background:
      'Ocher Studio makes contemporary craft with artisan communities. Its '
      + 'revenue splits between consumers and B2B gifting, and the two need '
      + 'very different journeys without one cluttering the other.',
    story:
      'A terracotta-and-cream Shopify build where retail shoppers browse by '
      + 'room and by craft, while dedicated Bulk Gifting and For Business '
      + 'journeys, festive edits and Ocher Signature pieces route corporate '
      + 'buyers to an enquiry. One catalogue, two funnels.',
  },
  {
    slug: 'amino-forge',
    title: 'Amino Forge',
    client: 'Amino Forge',
    year: null,
    isNew: true,
    featured: false,
    upcoming: false,
    role: 'Research, design & development',
    stack: SHOPIFY,
    // This design isn't on the domain yet, so the case study doesn't link out.
    live: false,
    url: 'https://aminoforge.in',
    ...shots('amino-forge'),
    // Composed presentation shots (several pages on a brand backdrop), so no browser bar.
    frame: false,
    thumbAlt: 'Amino Forge - AF 9 advance liposomal amino supplement',
    logo: null,
    description:
      'A science-led D2C store for AF 9, positioned as a first-of-its-kind '
      + 'liposomal amino supplement. Research, design and Shopify build.',
    background:
      'Amino Forge launched with a single hero product and a complex '
      + 'scientific story. Supplement buyers are sceptical, so the store had to '
      + 'make the science credible and simple, and put the founders and the '
      + 'formulation up front.',
    story:
      'I designed the information architecture around buyer objections: Our '
      + 'Story introduces the founders, ‘The Science Inside Amino Forge’ turns '
      + 'the research into plain-language benefit cards, and the AF 9 reveal '
      + 'closes the case. A blog on amino acids and recovery and a categorised '
      + 'FAQ answer pre-sale questions before they become support tickets.',
  },
  {
    slug: 'vivahnam',
    title: 'Vivahnam',
    client: 'Vivahnam',
    year: null,
    isNew: false,
    featured: false,
    upcoming: false,
    role: ROLE,
    stack: ['Laravel', 'PHP', 'Bootstrap', 'JavaScript'],
    url: 'https://www.vivahnam.com',
    ...shots('vivahnam'),
    thumbAlt: 'Vivahnam - Estimate your destination wedding cost',
    logo: null,
    description:
      'A destination-wedding platform built on Laravel: 500+ verified venues, '
      + 'availability requests and a live cost estimator.',
    background:
      'Planning a destination wedding usually means weeks of calls to hotels '
      + 'just to learn availability and cost. Vivahnam set out to compress that '
      + 'into a few clicks, and to turn each search into a qualified lead for '
      + 'its planning team.',
    story:
      'I built it as a custom Laravel application: venues browsable by '
      + 'destination and country, a shortlist-and-availability flow that routes '
      + 'date requests to planners, and a cost calculator that turns guest '
      + 'count, rooms and ceremonies into a personalised estimate. '
      + 'Consultations book straight from the page, so every visit ends as a '
      + 'lead with context.',
  },
  {
    slug: 'echo-india',
    title: 'ECHO India',
    client: 'ECHO India',
    year: null,
    isNew: true,
    featured: false,
    upcoming: false,
    role: 'Research, design & development',
    stack: ['UX research', 'Figma', 'WordPress'],
    // This design isn't on the domain yet, so the case study doesn't link out.
    live: false,
    url: 'https://echoindia.in',
    ...shots('echo-india'),
    // Composed presentation shots (several pages on a brand backdrop), so no browser bar.
    frame: false,
    thumbAlt: 'ECHO India - Empowering communities with knowledge',
    logo: null,
    description:
      'A redesign for a national non-profit that trains frontline health, '
      + 'education and livelihood workers. UX research, information '
      + 'architecture and design.',
    background:
      'ECHO India runs the Project ECHO ‘all teach, all learn’ model through '
      + 'hundreds of knowledge hubs. The old site buried that scale, and '
      + 'donors, partners and trainees each needed a clear way in across dozens '
      + 'of programmes.',
    story:
      'I led the research and rebuilt the information architecture across the '
      + 'homepage, Who We Are and every What We Do vertical. Impact data leads '
      + 'each page, the model is explained as a hub-and-spoke diagram, and case '
      + 'studies, a programme timeline and partner logos build trust before the '
      + 'asks: attend, donate, partner, join.',
  },
  {
    slug: 'niche-cape',
    title: 'Niche Cape',
    client: 'Niche Cape Shipping Services',
    year: null,
    market: 'Dubai, UAE',
    isNew: false,
    featured: false,
    upcoming: false,
    role: ROLE,
    stack: ['HTML', 'CSS', 'JavaScript', 'GSAP'],
    url: 'https://nichecape.com',
    ...shots('niche-cape'),
    thumbAlt: 'Niche Cape - Your global logistics partner in excellence',
    logo: null,
    description:
      'A bilingual English and Arabic site for a UAE freight-forwarding '
      + 'company serving 15+ countries across the GCC and beyond.',
    background:
      'Niche Cape is the logistics division of Niche Marketing Management: '
      + 'air, sea and land freight, customs clearance and warehousing. Its '
      + 'buyers read in English and Arabic, and compare rates before they ever '
      + 'pick up the phone.',
    story:
      'Hand-built in HTML, CSS and GSAP with a full English and Arabic '
      + 'interface, including right-to-left layouts. Each service has its own '
      + 'page, and a ‘match rates’ quote request sits in the navigation, so a '
      + 'lead is never more than one click away.',
  },
]

export const featuredProjects = projects.filter((p) => p.featured)
export const upcomingProject = projects.find((p) => p.upcoming) ?? projects[0]

export function projectBySlug(slug) {
  return projects.find((p) => p.slug === slug) ?? null
}

/** The project after this one, wrapping at the end - used by "Next project". */
export function nextProject(slug) {
  const i = projects.findIndex((p) => p.slug === slug)
  if (i === -1) return projects[0]
  return projects[(i + 1) % projects.length]
}

/** "https://www.example.com/" -> "example.com", for display. */
export function domainOf(url) {
  try { return new URL(url).hostname.replace(/^www\./, '') } catch { return '' }
}
