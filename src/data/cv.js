/* ==================================================================
   CV - work history, education and skills, taken from the PDF at
   public/cv/Mohd-Mohsin-CV.pdf. Newest first. `code` is the three-letter
   "airport code" printed on each boarding pass in Experience.
   ================================================================== */

export const experience = [
  {
    code: 'DDM',
    role: 'Software Developer',
    org: 'Design Dimensions',
    from: 'Jul 2026',
    to: 'Oct 2026',
    points: [
      'Owned the entire technology function for the studio and its full client portfolio as the sole technical decision-maker.',
      'Built and deployed AI chat assistants trained on studio and client data to answer product queries, qualify leads and resolve first-line support.',
      'Designed sales tracking and analytics systems giving leadership real-time visibility into pipeline, revenue attribution and campaigns.',
    ],
  },
  {
    code: 'OYL',
    role: 'Software Developer',
    org: 'Oyela Technologies',
    from: 'Apr 2026',
    to: 'Jul 2026',
    points: [
      "Built the company's internal ERP system from scratch, replacing manual processes across departments.",
      'Partnered with data and BI teams on internal reporting, and optimised the Shopify storefront for performance and conversion.',
      'Developed internal tools and workflows that cut dependency on manual processes.',
    ],
  },
  {
    code: 'RWT',
    role: 'Lead Software Developer',
    org: 'Radiant Web Tech',
    from: 'Jul 2024',
    to: 'Apr 2026',
    points: [
      'Led end-to-end delivery on custom e-commerce builds, owning architecture, development and launches.',
      'Built backend workflows, custom middleware and headless implementations on Shopify Admin, REST and AJAX APIs.',
      'Managed and mentored a cross-functional team while owning client relationships directly.',
    ],
  },
  {
    code: 'AYC',
    role: 'Full Stack Web Developer',
    org: 'The Ayurveda Co.',
    from: 'Aug 2023',
    to: 'Jul 2024',
    points: [
      'Rebuilt the entire store from scratch on a custom theme, sharply cutting load times and driving an 8x increase in conversion rate.',
      'Improved UX, Core Web Vitals and customer journeys with product and marketing teams.',
      'Integrated marketing tools, subscription models and tracking pixels for better attribution.',
    ],
  },
  {
    code: 'LPR',
    role: 'Web Developer & Designer',
    org: 'LPPR',
    from: 'Feb 2023',
    to: 'May 2023',
    points: [
      'Delivered a responsive, accessible, SEO-optimised website end to end, translating Figma and Illustrator layouts into scalable production code.',
    ],
  },
]

export const education = [
  { qualification: 'Bachelor of Computer Applications', org: 'IGNOU', years: '2023–26' },
  { qualification: 'Higher Secondary School', org: 'S.B.V. Noor Nagar', years: '2023' },
  { qualification: 'Secondary School', org: 'J.N. International School', years: '2021' },
]

export const languages = ['English', 'Hindi', 'Urdu']

export const skills = [
  {
    group: 'E-commerce',
    items: [
      'Shopify Theme Development', 'Custom Shopify Development', 'Liquid',
      'Shopify Admin API', 'Storefront API', 'Shopify Apps', 'Metafields',
      'Headless Commerce', 'Checkout', 'Subscriptions', 'Third-Party Integrations',
    ],
  },
  {
    group: 'Development',
    items: [
      'JavaScript (ES6+)', 'React', 'HTML5', 'CSS3', 'AJAX', 'Node.js',
      'REST APIs', 'Webhooks', 'MySQL', 'Database Design', 'System Architecture',
      'Internal Tools', 'ERP Systems', 'Inventory Systems',
    ],
  },
  {
    group: 'AI & Automation',
    items: [
      'OpenAI', 'Claude', 'AI Assistants', 'Prompt Engineering', 'LLM Integration',
      'Workflow Automation', 'AI-Powered Support', 'Lead Qualification Automation',
    ],
  },
  {
    group: 'Design & UX',
    items: [
      'Figma', 'Adobe Illustrator', 'UI Design', 'UX Design', 'Responsive Design',
      'Design Systems', 'Wireframing', 'Prototyping', 'UX Research',
      'User Journey Analysis', 'Competitor Research',
    ],
  },
  {
    group: 'Cloud & Infrastructure',
    items: [
      'AWS EC2', 'AWS RDS', 'Linux', 'Deployment', 'Hosting',
      'Domain & DNS Configuration', 'Production Environments',
    ],
  },
  {
    group: 'Performance & Analytics',
    items: [
      'Conversion Rate Optimisation', 'Website Audits', 'A/B Testing', 'GA4',
      'Conversion Tracking', 'Core Web Vitals', 'Frontend Performance',
      'Attribution', 'Customer Journey Analysis',
    ],
  },
]

/* Tools that show up in the project stacks but not in the CV skill list. */
export const alsoUsed = ['GSAP', 'Webflow', 'Laravel', 'PHP', 'Vite', 'Bootstrap']

/* Ball labels for the Stack pit. Anything not listed uses its full name;
   the full name still shows in the pit caption on hover. */
const SHORT = {
  'Shopify Theme Development': 'Shopify Themes',
  'Custom Shopify Development': 'Custom Shopify',
  'Shopify Admin API': 'Admin API',
  'Headless Commerce': 'Headless',
  'Third-Party Integrations': 'Integrations',
  'JavaScript (ES6+)': 'JavaScript',
  'Database Design': 'DB Design',
  'System Architecture': 'Architecture',
  'ERP Systems': 'ERP',
  'Inventory Systems': 'Inventory',
  'Prompt Engineering': 'Prompting',
  'LLM Integration': 'LLMs',
  'Workflow Automation': 'Automation',
  'AI-Powered Support': 'AI Support',
  'Lead Qualification Automation': 'Lead Qual.',
  'Adobe Illustrator': 'Illustrator',
  'Responsive Design': 'Responsive',
  'User Journey Analysis': 'User Journeys',
  'Competitor Research': 'Competitor Research',
  'Domain & DNS Configuration': 'DNS',
  'Production Environments': 'Production',
  'Conversion Rate Optimisation': 'CRO',
  'Website Audits': 'Audits',
  'A/B Testing': 'A/B Tests',
  'Conversion Tracking': 'Tracking',
  'Frontend Performance': 'Perf',
  'Customer Journey Analysis': 'CJ Analysis',
}

const TONES = ['lime', 'ink', 'pink', 'blue', 'orange', 'paper', 'violet']

/* Pit groups: every CV skill, plus the extra project tools. */
export const pit = [...skills, { group: 'Also shipped with', items: alsoUsed }].map((g, i) => ({
  group: g.group,
  tone: TONES[i % TONES.length],
  items: g.items.map((full) => ({ full, label: SHORT[full] || full })),
}))
