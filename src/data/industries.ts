export interface IndustryStat {
  label: string;
  value: string;
}

export interface IndustrySolution {
  title: string;
  description: string;
  bullets: string[];
}

export interface IndustryHighlight {
  title: string;
  description: string;
  icon?: string;
}

export interface IndustryFAQ {
  question: string;
  answer: string;
}

export interface IndustryService {
  title: string;
  description: string;
}

export interface IndustryHero {
  kicker: string;
  title: string;
  subtitle: string;
  description: string;
  bullets: string[];
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
  partnerBadges: string[];
  image: string;
}

export interface EngagementModel {
  title: string;
  description: string;
  badge: string;
}

export interface TechStackCategory {
  name: string;
  items: string[];
}

export type HeroStyle = 'split' | 'centered' | 'overlap';
export type ServicesStyle = 'grid' | 'timeline' | 'stacked';
export type HighlightStyle = 'grid' | 'list';
export type SolutionsStyle = 'cards' | 'panels';

export interface IndustryPresentation {
  heroStyle: HeroStyle;
  servicesStyle: ServicesStyle;
  highlightStyle: HighlightStyle;
  solutionsStyle: SolutionsStyle;
  accent: {
    gradient: [string, string, string];
    primary: string;
    secondary: string;
    surface: string;
    muted: string;
  };
  darkAccent?: {
    primary: string;
    secondary: string;
    surface: string;
    muted: string;
  };
}

export interface IndustryContent {
  slug: string;
  name: string;
  hero: IndustryHero;
  stats: IndustryStat[];
  services: IndustryService[];
  leadership: {
    highlight: string;
    description: string;
    image: string;
  };
  highlights: IndustryHighlight[];
  solutions: IndustrySolution[];
  faqs: IndustryFAQ[];
  engagementModels: EngagementModel[];
  techStacks: TechStackCategory[];
  presentation: IndustryPresentation;
}

const baseStats: IndustryStat[] = [
  { label: 'Projects Delivered', value: '50+' },
  { label: 'Domain Experts', value: '120+' },
  { label: 'Client NPS', value: '92%' },
  { label: 'Avg. Time-to-Market', value: '8 weeks' },
];

const baseTechStacks: TechStackCategory[] = [
  {
    name: 'Frontend',
    items: ['React', 'TypeScript', 'Vue', 'Next.js', 'TailwindCSS'],
  },
  {
    name: 'Backend',
    items: ['Node.js', 'Python', 'Go', 'Java', 'Ruby on Rails'],
  },
  {
    name: 'Cloud & DevOps',
    items: ['AWS', 'Azure', 'GCP', 'Kubernetes', 'Terraform'],
  },
  {
    name: 'Data & AI',
    items: ['TensorFlow', 'PyTorch', 'dbt', 'Snowflake', 'PowerBI'],
  },
  {
    name: 'Productivity',
    items: ['Figma', 'Jira', 'Notion', 'Linear', 'Miro'],
  },
];

const baseFaqs = (name: string): IndustryFAQ[] => [
  {
    question: `How long does it take to build a ${name} solution?`,
    answer:
      'Timelines vary by complexity. For most engagements we deliver a validated prototype within 4–6 weeks and launch in 10–14 weeks with iterative releases afterward.',
  },
  {
    question: `Do you integrate existing tools into the ${name} platform?`,
    answer:
      'Yes. We specialize in API-first architectures, ensuring new modules sync with ERPs, CRMs, analytics suites, or any third-party system you rely on.',
  },
  {
    question: `Can you help with strategy as well as development for ${name}?`,
    answer:
      'Absolutely. Our product strategists assist with discovery workshops, user journey mapping, and prioritization to ensure the roadmap aligns with business outcomes.',
  },
  {
    question: 'How do you ensure security and compliance?',
    answer:
      'We follow SOC 2 aligned practices, perform rigorous QA and penetration testing, enforce role-based access, and comply with relevant standards such as GDPR, HIPAA, or PCI when required.',
  },
];

const baseEngagementModels: EngagementModel[] = [
  {
    title: 'Dedicated Resources',
    description: 'Launch a pod of specialists fully aligned to your roadmap, rituals, and tooling.',
    badge: 'Full-time squad',
  },
  {
    title: 'Team Extension',
    description: 'Augment in-house teams with battle-tested engineers, designers, and PMs.',
    badge: 'Co-build',
  },
  {
    title: 'Project-Based',
    description: 'From discovery to launch, we take ownership of outcomes with fixed milestones.',
    badge: 'End-to-end',
  },
];

interface IndustryConfig {
  slug: string;
  name: string;
  heroImage?: string;
  heroSubtitle?: string;
  heroDescription?: string;
  focusAreas?: string[];
  highlights?: IndustryHighlight[];
  solutions?: IndustrySolution[];
  stats?: IndustryStat[];
  faqs?: IndustryFAQ[];
  services?: IndustryService[];
}

const partnerBadges = [
  'Microsoft Silver Partner',
  'AWS Select Partner',
  'Clutch 4.9★',
  'GoodFirms Recommended',
];

const defaultHeroBullets = [
  '350+ pre-vetted & certified programmers',
  'Strict NDA and compliance-first delivery',
  'Flexible pricing and engagement models',
  'Comprehensive support & maintenance',
];

const buildHero = (
  title: string,
  subtitle: string,
  description: string,
  image: string,
  bullets: string[] = defaultHeroBullets
): IndustryHero => ({
  kicker: 'Industry Expertise',
  title,
  subtitle,
  description,
  bullets,
  primaryCta: { label: 'Call Now', href: 'tel:+18008001234' },
  secondaryCta: { label: 'Get a Free Consultation', href: '/#contact' },
  partnerBadges,
  image,
});

type AccentPalette = IndustryPresentation['accent'];
type DarkAccentPalette = NonNullable<IndustryPresentation['darkAccent']>;

const baseLayoutConfig = {
  heroStyle: 'split' as HeroStyle,
  servicesStyle: 'grid' as ServicesStyle,
  highlightStyle: 'grid' as HighlightStyle,
  solutionsStyle: 'cards' as SolutionsStyle,
};

const createPresentation = (
  accent: AccentPalette,
  darkAccent?: DarkAccentPalette
): IndustryPresentation => ({
  ...baseLayoutConfig,
  accent,
  ...(darkAccent ? { darkAccent } : {}),
});

const presentationThemes: Record<string, IndustryPresentation> = {
  default: createPresentation(
    {
      gradient: ['#f0f9ff', '#dbeafe', '#ffffff'],
      primary: '#0ea5e9',
      secondary: '#f97316',
      surface: '#ffffff',
      muted: '#e8f3ff',
    },
    {
      primary: '#38bdf8',
      secondary: '#fb923c',
      surface: '#1e293b',
      muted: '#334155',
    }
  ),
  'agritech-application-development': createPresentation(
    {
      gradient: ['#fff7ed', '#ffedd5', '#ffffff'],
      primary: '#f97316',
      secondary: '#10b981',
      surface: '#ffffff',
      muted: '#fff7ed',
    },
    {
      primary: '#fb923c',
      secondary: '#34d399',
      surface: '#1e293b',
      muted: '#334155',
    }
  ),
  'dating-app-development': createPresentation(
    {
      gradient: ['#fff0f6', '#ffe4f3', '#ffffff'],
      primary: '#ec4899',
      secondary: '#6366f1',
      surface: '#ffffff',
      muted: '#ffe8f4',
    },
    {
      primary: '#f472b6',
      secondary: '#818cf8',
      surface: '#1e293b',
      muted: '#334155',
    }
  ),
  'ecommerce-app-development': createPresentation(
    {
      gradient: ['#eef2ff', '#e0f2fe', '#f8fbff'],
      primary: '#2563eb',
      secondary: '#9333ea',
      surface: '#f8fafc',
      muted: '#e0f2ff',
    },
    {
      primary: '#60a5fa',
      secondary: '#a78bfa',
      surface: '#1e293b',
      muted: '#334155',
    }
  ),
  'grocery-delivery-app-development': createPresentation(
    {
      gradient: ['#f0fdf4', '#dcfce7', '#ffffff'],
      primary: '#22c55e',
      secondary: '#16a34a',
      surface: '#f9fefb',
      muted: '#dcfce7',
    },
    {
      primary: '#4ade80',
      secondary: '#16a34a',
      surface: '#1e293b',
      muted: '#334155',
    }
  ),
  'educationtech-software-development': createPresentation(
    {
      gradient: ['#f5f3ff', '#ede9fe', '#ffffff'],
      primary: '#7c3aed',
      secondary: '#2563eb',
      surface: '#ffffff',
      muted: '#f4f0ff',
    },
    {
      primary: '#a78bfa',
      secondary: '#60a5fa',
      surface: '#1e293b',
      muted: '#334155',
    }
  ),
  'financial-services-software-solutions': createPresentation(
    {
      gradient: ['#f0fdfa', '#ccfbf1', '#ffffff'],
      primary: '#0f766e',
      secondary: '#0284c7',
      surface: '#f8fffc',
      muted: '#d1fae5',
    },
    {
      primary: '#14b8a6',
      secondary: '#0ea5e9',
      surface: '#1e293b',
      muted: '#334155',
    }
  ),
  'fitnesstech-app-development': createPresentation(
    {
      gradient: ['#fff5f5', '#fee2e2', '#ffffff'],
      primary: '#ef4444',
      secondary: '#f97316',
      surface: '#fff7f7',
      muted: '#fee2e2',
    },
    {
      primary: '#f87171',
      secondary: '#fb923c',
      surface: '#1e293b',
      muted: '#334155',
    }
  ),
  'foodtech-software-solutions': createPresentation(
    {
      gradient: ['#fffbea', '#fef3c7', '#ffffff'],
      primary: '#c2410c',
      secondary: '#eab308',
      surface: '#fffaf0',
      muted: '#fef3c7',
    },
    {
      primary: '#fb923c',
      secondary: '#fde047',
      surface: '#1e293b',
      muted: '#334155',
    }
  ),
  'gaming-app-development': createPresentation(
    {
      gradient: ['#eff6ff', '#e0e7ff', '#ffffff'],
      primary: '#6366f1',
      secondary: '#c026d3',
      surface: '#f5f3ff',
      muted: '#e4e7ff',
    },
    {
      primary: '#818cf8',
      secondary: '#67e8f9',
      surface: '#1e293b',
      muted: '#334155',
    }
  ),
  'healthtech-app-development': createPresentation(
    {
      gradient: ['#ecfeff', '#ccfbf1', '#ffffff'],
      primary: '#14b8a6',
      secondary: '#0ea5e9',
      surface: '#f0fdfa',
      muted: '#ccfbf1',
    },
    {
      primary: '#2dd4bf',
      secondary: '#38bdf8',
      surface: '#1e293b',
      muted: '#334155',
    }
  ),
  'manufacturingtech-software-solutions': createPresentation(
    {
      gradient: ['#eef2ff', '#e0e7ff', '#ffffff'],
      primary: '#4338ca',
      secondary: '#0ea5e9',
      surface: '#f8f9ff',
      muted: '#eaeefe',
    },
    {
      primary: '#818cf8',
      secondary: '#38bdf8',
      surface: '#1e293b',
      muted: '#334155',
    }
  ),
  'car-rental-booking-aggregator': createPresentation(
    {
      gradient: ['#fdf2f8', '#e0f2fe', '#ffffff'],
      primary: '#be185d',
      secondary: '#2563eb',
      surface: '#fff5fa',
      muted: '#f1f5ff',
    },
    {
      primary: '#f472b6',
      secondary: '#60a5fa',
      surface: '#1e293b',
      muted: '#334155',
    }
  ),
};

export const industriesContent: IndustryContent[] = [
  {
    slug: 'agritech-application-development',
    name: 'AgriTech Application Development',
    hero: buildHero(
      'Agriculture Software Development Company',
      'Empowering agribusinesses with smart farming platforms, precision analytics, and resilient supply chains.',
      'We create connected agritech ecosystems that digitize every agricultural touchpoint—from soil to sale—combining IoT, AI, mobility, and cloud-native architecture.',
      '/image1.png'
    ),
    stats: baseStats,
    services: [
      {
        title: 'Custom Agricultural Software Solutions',
        description:
          'Tailor-made farm management systems that unify assets, compliance data, and crop planning workflows.',
      },
      {
        title: 'Agriculture App Development',
        description:
          'Mobility-led experiences for field teams, agronomists, and agribusiness stakeholders with offline-first support.',
      },
      {
        title: 'Agritech Web Development',
        description:
          'Responsive portals for producers, cooperatives, and marketplace operators with analytics baked in.',
      },
      {
        title: 'Smart Farm IoT Platforms',
        description:
          'Sensor ingestion, device orchestration, and alerting pipelines to manage irrigation, soil, and storage.',
      },
      {
        title: 'Agri Supply Chain Visibility',
        description:
          'Cold-chain monitoring, produce tracking, and logistics orchestration for exporters and retailers.',
      },
      {
        title: 'Agri Analytics & AI',
        description:
          'Yield prediction, weather intelligence, and demand forecasting dashboards for CXOs and agronomists.',
      },
    ],
    leadership: {
      highlight: 'Leading Agriculture Software Development Company',
      description:
        'Transform your farming operations with NanoFlows’ advanced agritech solutions. We blend agronomic knowledge with product engineering to modernize farm management, improve crop yield predictions, and optimize resource utilization.',
      image: '/image1.png',
    },
    highlights: [
      {
        title: 'Experienced Dedicated Team',
        description:
          'Agronomists, IoT engineers, and product squads collaborate to ship resilient farm tech.',
        icon: 'Users',
      },
      {
        title: 'Quick Product Delivery',
        description:
          'Agile pods deliver agritech milestones aligned with seasonal cycles and crop calendars.',
        icon: 'Rocket',
      },
      {
        title: 'Transparent & Agile Processes',
        description:
          'Daily rituals, live dashboards, and farmer-first research keep every sprint outcome-driven.',
        icon: 'Shuffle',
      },
      {
        title: 'Competitive Pricing',
        description:
          'Modular accelerators, reusable components, and automation keep total cost predictable.',
        icon: 'BadgeDollarSign',
      },
      {
        title: 'Flexible Engagement Models',
        description:
          'Co-build with your internal IT or spin up independent pods for turnkey delivery.',
        icon: 'Layers',
      },
      {
        title: 'Superior Code Quality',
        description:
          'Cloud-native blueprints, automated testing, and observability ensure resilience in harsh environments.',
        icon: 'Shield',
      },
    ],
    solutions: [
      {
        title: 'Agriculture Farm Management Software',
        description:
          'Optimize farm operations with end-to-end task, asset, and compliance management.',
        bullets: [
          'Daily activity tracking & resource allocation',
          'Real-time field data consolidation',
          'Forecasting for planting and harvest windows',
        ],
      },
      {
        title: 'Weather Monitoring & Predictions Suite',
        description:
          'Hyperlocal weather insights blended with agronomy-driven recommendations.',
        bullets: [
          'IoT sensor + satellite fusion',
          'Alerting for frost, rainfall, and pest outbreaks',
          'Integration with irrigation schedules',
        ],
      },
      {
        title: 'Livestock & Smart Farming Solutions',
        description:
          'Wearables, RFID, and mobile workflows to monitor herd health and automate feeding cycles.',
        bullets: [
          'Bio-signal analytics dashboards',
          'Compliance-ready treatment logs',
          'Inventory-linked feed automation',
        ],
      },
      {
        title: 'Agri Finance & Marketplace Platforms',
        description:
          'Digital lending, insurance, and B2B marketplaces tailored for growers and buyers.',
        bullets: [
          'KYC and subsidy verification',
          'Dynamic pricing and contract management',
          'Wallets, payouts, and settlement engines',
        ],
      },
    ],
    faqs: [
      {
        question: 'What are the major use cases of AI in agriculture?',
        answer:
          'AI powers precision farming, crop health diagnostics, smart irrigation, yield forecasts, and market demand predictions, enabling data-led decisions at every stage.',
      },
      {
        question: 'How is technology leading in agribusiness today?',
        answer:
          'Connected sensors, drones, and satellite imagery feed analytics platforms that highlight anomalies, automate workflows, and support large-scale farm operations.',
      },
      {
        question: 'Why is smart farming important?',
        answer:
          'Smart farming reduces input costs, improves sustainability, ensures traceability, and helps growers respond quickly to climate volatility.',
      },
      {
        question: 'How does agriculture software impact the environment?',
        answer:
          'Digitized operations reduce water usage, optimize chemical applications, and cut transport inefficiencies, contributing to greener supply chains.',
      },
    ],
    engagementModels: baseEngagementModels,
    techStacks: baseTechStacks,
    presentation:
      presentationThemes['agritech-application-development'] ??
      presentationThemes.default,
  },
  {
    slug: 'dating-app-development',
    name: 'Dating App Development Services',
    hero: buildHero(
      'Dating App Development Services',
      'Create human-first matchmaking products with AI safety, immersive media, and viral engagement loops.',
      'We craft dating ecosystems covering onboarding, verification, discovery, chat, monetization, and trust so you can scale communities confidently.',
      '/image2.png',
      [
        'Human-centered UX for every identity',
        'AI-driven matchmaking & safety automation',
        'Subscriptions, gifting, and ad monetization',
        '24/7 DevSecOps & growth analytics',
      ]
    ),
    stats: baseStats,
    services: [
      {
        title: 'Product Discovery & Brand Systems',
        description:
          'Value proposition design, identity systems, and motion libraries built for Gen-Z adoption.',
      },
      {
        title: 'Matchmaking Engine Development',
        description:
          'Interest graphs, machine learning ranking, and affinity scoring to deliver relevant matches.',
      },
      {
        title: 'Real-time Communication Stack',
        description:
          'Video, voice, and chat experiences with moderation hooks, translations, and gifting.',
      },
      {
        title: 'Safety & Trust Infrastructure',
        description:
          'ID verification, AI content filters, reporting flows, and crisis playbooks.',
      },
      {
        title: 'Creator & Events Modules',
        description:
          'Communities, live audio rooms, and ticketing for hybrid meetups.',
      },
      {
        title: 'Monetization & CRM',
        description:
          'Subscriptions, à-la-carte boosts, referral programs, and growth analytics.',
      },
    ],
    leadership: {
      highlight: 'Leading Dating Platform Studio',
      description:
        'From stealth launches to billion-swipe ecosystems, we build performant dating apps with inclusive design, adaptive moderation, and revenue-ready infrastructure.',
      image: '/image2.png',
    },
    highlights: [
      {
        title: 'Culture-first Design',
        description:
          'Research-backed playbooks ensure respectful onboarding, inclusive profiles, and safe interactions.',
        icon: 'Heart',
      },
      {
        title: 'Global Scale Readiness',
        description:
          'Multi-region deployments, latency-optimized messaging, and analytics instrumentation.',
        icon: 'Globe',
      },
      {
        title: 'Advanced Safety Toolkit',
        description:
          'Behavioral scoring, anomaly detection, and real-time monitoring governed by policy squads.',
        icon: 'Shield',
      },
      {
        title: 'Growth Experimentation',
        description:
          'A/B pipelines, referral funnels, and CRM journeys to improve retention and LTV.',
        icon: 'Flask',
      },
    ],
    solutions: [
      {
        title: 'Hyper-personalized Matchmaking',
        description:
          'Graph-based recommendations using interests, intent signals, and conversational cues.',
        bullets: [
          'Compatible cohorts auto-refreshed daily',
          'Time-of-day boosting and ranking controls',
          'Real-time compatibility scoring dashboards',
        ],
      },
      {
        title: 'Immersive Communication Suite',
        description:
          'HD video, live audio rooms, AR filters, and mini-games to reduce chat fatigue.',
        bullets: [
          'Low-latency media servers and CDN tuning',
          'Gift packs, badges, and interactive prompts',
          'AI prompts to keep conversations flowing',
        ],
      },
      {
        title: 'Safety & Compliance Hub',
        description:
          'Trust center with ID verification, biometrics, AML/KYC, and policy automation.',
        bullets: [
          'Document / selfie verification flows',
          'Content intelligence to block scammers',
          'Regional compliance (GDPR, COPPA, etc.)',
        ],
      },
      {
        title: 'Revenue & Partnerships Layer',
        description:
          'Subscription bundles, creator payouts, ads, and affiliate integrations.',
        bullets: [
          'Multi-currency payments & fraud checks',
          'Tiered perks, boosts, and superlikes',
          'Partner storefront and events API',
        ],
      },
    ],
    faqs: baseFaqs('dating app development'),
    engagementModels: baseEngagementModels,
    techStacks: baseTechStacks,
    presentation:
      presentationThemes['dating-app-development'] ?? presentationThemes.default,
  },
  {
    slug: 'ecommerce-app-development',
    name: 'E-commerce App Development',
    hero: buildHero(
      'E-commerce App Development',
      'Launch composable commerce experiences with dazzling storefronts and intelligent operations.',
      'We re-platform retailers onto headless stacks, unify product data, and automate fulfillment while crafting immersive mobile commerce journeys.',
      '/image3.png'
    ),
    stats: baseStats,
    services: [
      {
        title: 'Composable Storefronts',
        description:
          'Next-gen storefronts with edge rendering, personalization, and visual merchandising tools.',
      },
      {
        title: 'Marketplace & Seller Tools',
        description:
          'Onboarding flows, catalog sync, pricing policies, and payout automation for sellers.',
      },
      {
        title: 'Order & Inventory Management',
        description:
          'OMS, IMS, and warehouse control towers for real-time visibility.',
      },
      {
        title: 'Customer Engagement Apps',
        description:
          'Progressive web apps and native mobile commerce apps with loyalty, wallets, and chat.',
      },
      {
        title: 'Payments & Fintech Integrations',
        description:
          'BNPL, multi-currency payments, refunds, and risk controls.',
      },
      {
        title: 'Analytics & Growth',
        description:
          'Customer 360 views, recommendation engines, and marketing automation.',
      },
    ],
    leadership: {
      highlight: 'Leading E-commerce Engineering Partner',
      description:
        'We help D2C, marketplace, and B2B commerce brands modernize stacks, accelerate experimentation, and improve conversion across every channel.',
      image: '/image3.png',
    },
    highlights: [
      {
        title: 'CX Obsessed',
        description:
          'Design systems tailored to brand expression, accessibility, and multi-device journeys.',
        icon: 'Sparkles',
      },
      {
        title: 'Omnichannel Architectures',
        description:
          'Unified product, price, promotion, and inventory data orchestrated across POS, web, and apps.',
        icon: 'Layers',
      },
      {
        title: 'Fulfillment Intelligence',
        description:
          'Micro-fulfillment, routing, and carrier integrations to reduce delivery costs.',
        icon: 'Route',
      },
      {
        title: 'Revenue Operations',
        description:
          'Growth playbooks plus analytics to track CAC, LTV, and contribution margins in real time.',
        icon: 'ChartLine',
      },
    ],
    solutions: [
      {
        title: 'Headless Storefront Experience',
        description:
          'Decoupled UI powered by GraphQL APIs, preview tooling, and edge caching.',
        bullets: [
          'Personalized landing + PLP experiences',
          'BOPIS, BORIS, and curbside flows',
          'A/B testing & merchandising automation',
        ],
      },
      {
        title: 'Unified Commerce Control Tower',
        description:
          'OMS/IMS with demand sensing, safety stock alerts, and vendor collaboration.',
        bullets: [
          'Inventory sync across warehouses & stores',
          'Auto assignment of carriers and slots',
          'Exception management & SLA tracking',
        ],
      },
      {
        title: 'Customer Loyalty & Retention Suite',
        description:
          'Wallets, referral programs, gamification, and CRM campaigns.',
        bullets: [
          'Segment-based offers & communications',
          'Subscription clubs and memberships',
          'Customer support automation',
        ],
      },
      {
        title: 'Analytics & Growth Engine',
        description:
          'Self-service dashboards, predictive recommendations, and marketing mix modeling.',
        bullets: [
          'Attribution & funnel intelligence',
          'Cross-sell & upsell modeling',
          'Real-time business health tiles',
        ],
      },
    ],
    faqs: baseFaqs('e-commerce app development'),
    engagementModels: baseEngagementModels,
    techStacks: baseTechStacks,
    presentation:
      presentationThemes['ecommerce-app-development'] ??
      presentationThemes.default,
  },
  {
    slug: 'grocery-delivery-app-development',
    name: 'Grocery Delivery App Development',
    hero: buildHero(
      'Grocery Delivery App Development',
      'Build hyperlocal delivery platforms with marketplace orchestration, micro-fulfillment, and retention mechanics.',
      'We digitize grocery supply chains—from dark stores and picking apps to consumer UX—so you can launch 10-minute delivery or subscription grocery experiences.',
      '/image4.png'
    ),
    stats: baseStats,
    services: [
      {
        title: 'Consumer Ordering Apps',
        description:
          'Personalized catalog, smart substitutions, and multiple cart flows for households.',
      },
      {
        title: 'Picker & Store Workflows',
        description:
          'Mobile tools for pickers with batching logic, quality checks, and station routing.',
      },
      {
        title: 'Driver & Fleet Management',
        description:
          'Dispatch intelligence, navigation, and incentives for riders and drivers.',
      },
      {
        title: 'Dark Store Ops Suite',
        description:
          'Inventory, slotting, and labor planning dashboards for micro-fulfillment centers.',
      },
      {
        title: 'Merchandising & Promotions',
        description:
          'Vendor-funded campaigns, banners, and recommendation modules.',
      },
      {
        title: 'Customer Success & Loyalty',
        description:
          'CRM journeys, wallet credits, and support automations to boost retention.',
      },
    ],
    leadership: {
      highlight: 'Leading Instant Commerce Studio',
      description:
        'Our grocery specialists build resilient last-mile networks with live inventory sync, accurate substitutions, and proactive customer communications.',
      image: '/image4.png',
    },
    highlights: [
      {
        title: 'Hyperlocal Intelligence',
        description:
          'Micro-zoning, demand prediction, and slot optimization reduce delivery times.',
        icon: 'Map',
      },
      {
        title: 'Ops Automation',
        description:
          'Auto-rebalancing of riders, batching algorithms, and replenishment alerts.',
        icon: 'Settings',
      },
      {
        title: 'Retention Flywheel',
        description:
          'Smart nudges, subscription programs, and service recovery flows.',
        icon: 'RefreshCcw',
      },
      {
        title: 'Partner Ecosystems',
        description:
          'Vendor portals, co-op marketing, and purchase analytics for CPG brands.',
        icon: 'Handshake',
      },
    ],
    solutions: [
      {
        title: 'Customer Ordering & Discovery',
        description:
          'Intuitive mobile/web experiences featuring predictive search and curated bundles.',
        bullets: [
          'Flexible delivery & pickup slots',
          'Smart substitutions with customer control',
          'Nutrition tags and lifestyle filters',
        ],
      },
      {
        title: 'Dark Store Operations Suite',
        description:
          'Back-office modules for inbound logistics, slotting, and quality control.',
        bullets: [
          'Inventory sync with ERP/POS',
          'Pick path optimization & audits',
          'Waste reduction analytics',
        ],
      },
      {
        title: 'Fleet & Route Optimization',
        description:
          'AI-driven dispatch with dynamic clustering, heatmaps, and rider incentives.',
        bullets: [
          'Real-time driver tracking & ETA sharing',
          'Tip management and gamified rewards',
          'Incident response tooling',
        ],
      },
      {
        title: 'Retention & Monetization Hub',
        description:
          'Subscriptions, referral programs, ad placements, and partnership reporting.',
        bullets: [
          'Wallets and gift cards',
          'Campaign attribution for FMCG partners',
          'NPS-driven service recovery',
        ],
      },
    ],
    faqs: baseFaqs('grocery delivery development'),
    engagementModels: baseEngagementModels,
    techStacks: baseTechStacks,
    presentation:
      presentationThemes['grocery-delivery-app-development'] ??
      presentationThemes.default,
  },
  {
    slug: 'educationtech-software-development',
    name: 'EducationTech Software Development',
    hero: buildHero(
      'EducationTech Software Development',
      'Design modern learning experiences for schools, universities, and cohort-based businesses.',
      'Our edtech squads ship outcome-oriented learning platforms combining adaptive content, live classrooms, assessments, and monetization.',
      '/image5.png'
    ),
    stats: baseStats,
    services: [
      {
        title: 'Learning Experience Platforms',
        description: 'Personalized learner journeys with video, cohorts, and community modules.',
      },
      {
        title: 'Assessment & Credentialing',
        description:
          'Authoring tools, proctoring, and certification workflows with secure credential issuance.',
      },
      {
        title: 'School & Campus Management',
        description:
          'Admissions, scheduling, finance, and parent communication portals.',
      },
      {
        title: 'Corporate Training Suites',
        description:
          'Skill frameworks, role-based learning paths, and performance analytics.',
      },
      {
        title: 'Marketplace & Monetization',
        description:
          'Tutor onboarding, revenue sharing, affiliate tracking, and storefronts.',
      },
      {
        title: 'Analytics & Insights',
        description:
          'Learner engagement analytics, predictive dropout alerts, and cohort health dashboards.',
      },
    ],
    leadership: {
      highlight: 'Leading EdTech Transformation Partner',
      description:
        'We blend pedagogy expertise, design thinking, and enterprise-grade engineering to build platforms that increase completion rates and unlock new education revenue streams.',
      image: '/image5.png',
    },
    highlights: [
      {
        title: 'Pedagogy + Product',
        description: 'Instructional designers collaborate with engineers to craft effective learning flows.',
        icon: 'BookOpen',
      },
      {
        title: 'Hybrid Delivery Ready',
        description: 'Live classes, asynchronous learning, and offline sync for low bandwidth regions.',
        icon: 'Wifi',
      },
      {
        title: 'Compliance & Accessibility',
        description: 'FERPA, SOC2, WCAG, and data residency baked into our delivery playbooks.',
        icon: 'Shield',
      },
      {
        title: 'Growth Enablement',
        description: 'Lead funnels, referral programs, and enterprise sales tooling for schools.',
        icon: 'TrendingUp',
      },
    ],
    solutions: [
      {
        title: 'Adaptive Learning Engines',
        description:
          'AI personalization to recommend lessons, projects, and remediation.',
        bullets: [
          'Skill graph modeling & mastery scores',
          'Dynamic pacing and nudges',
          'Educator analytics & interventions',
        ],
      },
      {
        title: 'Live Classroom & Community',
        description:
          'Video classrooms, breakout rooms, polls, and cohort chat stitched with attendance logs.',
        bullets: [
          'One-click event creation & replays',
          'Interactive widgets and gamification',
          'Community moderation & support',
        ],
      },
      {
        title: 'Assessment & Credential Suite',
        description:
          'Secure exams, auto grading, and verifiable credential issuance.',
        bullets: [
          'Item banks & rubric designers',
          'AI-assisted evaluation & plagiarism checks',
          'Wallets for badges & transcripts',
        ],
      },
      {
        title: 'EdTech Commerce Layer',
        description:
          'Multi-tenant storefronts for institutions, tutors, and bootcamps.',
        bullets: [
          'Payment plans & financing options',
          'Revenue share & instructor payouts',
          'Sales dashboard with CRM hooks',
        ],
      },
    ],
    faqs: baseFaqs('edtech development'),
    engagementModels: baseEngagementModels,
    techStacks: baseTechStacks,
    presentation:
      presentationThemes['educationtech-software-development'] ??
      presentationThemes.default,
  },
  {
    slug: 'financial-services-software-solutions',
    name: 'Financial Services Software Solutions',
    hero: buildHero(
      'Financial Services Software Solutions',
      'Digitize banking, lending, and wealth workflows with secure, compliant platforms.',
      'We engineer core banking modernizations, onboarding journeys, and risk intelligence hubs with compliance-first delivery.',
      '/image6.png',
      [
        'Certified fintech & security experts',
        'Compliance-led SDLC (PCI, SOC2, GDPR)',
        'Modular microservices & API ecosystems',
        'Real-time risk monitoring & support',
      ]
    ),
    stats: baseStats,
    services: [
      {
        title: 'Digital Banking Platforms',
        description:
          'Customer 360, digital onboarding, and self-service banking portals.',
      },
      {
        title: 'Lending & Credit Automation',
        description:
          'Loan origination, decisioning, and servicing automation with AI scoring.',
      },
      {
        title: 'Payments & Wallet Engineering',
        description:
          'Real-time payments, cross-border remittance, and merchant services.',
      },
      {
        title: 'Risk, AML & Compliance',
        description:
          'Screening, transaction monitoring, and case management dashboards.',
      },
      {
        title: 'WealthTech & Advisors',
        description:
          'Portfolio management, robo-advisory, and investor communications.',
      },
      {
        title: 'InsurTech Enablement',
        description: 'Policy management, claims automation, and agent tooling.',
      },
    ],
    leadership: {
      highlight: 'Leading Digital Finance Studio',
      description:
        'We help banks, NBFCs, and fintech startups ship compliant platforms faster with accelerator kits, secure infrastructure, and 24/7 managed services.',
      image: '/image6.png',
    },
    highlights: [
      {
        title: 'Compliance-first',
        description: 'PCI DSS, SOC2, ISO 27001, GDPR, and regional mandates baked in.',
        icon: 'BadgeCheck',
      },
      {
        title: 'Secure-by-design',
        description: 'Threat modeling, encryption, and DevSecOps pipelines for every release.',
        icon: 'Shield',
      },
      {
        title: 'Data-driven Decisions',
        description: 'Real-time analytics, risk scoring, and regulatory reporting.',
        icon: 'ChartBar',
      },
      {
        title: 'Legacy Modernization',
        description: 'API wrappers, microservices, and migration playbooks for core systems.',
        icon: 'RefreshCcw',
      },
    ],
    solutions: [
      {
        title: 'Digital Onboarding & KYC',
        description:
          'Frictionless journeys with biometrics, video KYC, and risk scoring.',
        bullets: [
          'Document recognition & OCR',
          'AML / sanctions screening',
          'Case management & reviewer tooling',
        ],
      },
      {
        title: 'Loan Origination & Servicing',
        description:
          'Configurable workflows for personal, SME, and asset-backed lending.',
        bullets: [
          'Rule + ML decisioning engines',
          'Workflow automation with e-sign',
          'Customer portals & notifications',
        ],
      },
      {
        title: 'Payment & Wallet Infrastructure',
        description:
          'Modular payment gateways, POS, and wallets for consumers and merchants.',
        bullets: [
          'Tokenization & fraud analytics',
          'Settlement, reconciliation, and payouts',
          'Support for UPI, RTP, card rails',
        ],
      },
      {
        title: 'Risk Intelligence Dashboards',
        description:
          'Command centers for compliance, treasury, and operations teams.',
        bullets: [
          'Real-time alerts & escalation workflows',
          'Stress testing & scenario planning',
          'Regulatory reporting automation',
        ],
      },
    ],
    faqs: baseFaqs('financial services software'),
    engagementModels: baseEngagementModels,
    techStacks: baseTechStacks,
    presentation:
      presentationThemes['financial-services-software-solutions'] ??
      presentationThemes.default,
  },
  {
    slug: 'fitnesstech-app-development',
    name: 'FitnessTech App Development',
    hero: buildHero(
      'FitnessTech App Development',
      'Give fitness brands connected experiences with wearables, streaming, and habit loops.',
      'We craft personalized coaching apps, interactive content platforms, and studio management suites that keep users motivated.',
      '/image7.png'
    ),
    stats: baseStats,
    services: [
      {
        title: 'Connected Coaching Apps',
        description:
          'Trainer-led programs with wearable sync, biometrics, and progress tracking.',
      },
      {
        title: 'Live & On-demand Streaming',
        description:
          'Video CMS, CDN optimization, and ticketing for virtual classes.',
      },
      {
        title: 'Gym & Studio Management',
        description:
          'Bookings, memberships, access control, and POS for studios.',
      },
      {
        title: 'Nutrition & Habit Platforms',
        description:
          'Meal planning, macro tracking, and behavioral coaching loops.',
      },
      {
        title: 'Marketplace & Creator Tools',
        description:
          'Creator storefronts, subscription bundles, and payouts.',
      },
      {
        title: 'Community & Gamification',
        description:
          'Challenges, leaderboards, chat, and social commerce modules.',
      },
    ],
    leadership: {
      highlight: 'Leading Fitness Product Lab',
      description:
        'We blend sports science, media engineering, and behavioral design to deliver sticky fitness ecosystems that monetize year-round.',
      image: '/image7.png',
    },
    highlights: [
      {
        title: 'Mind-Body Personalization',
        description: 'Adaptive plans based on goals, biometrics, and recovery signals.',
        icon: 'Activity',
      },
      {
        title: 'Immersive Media',
        description: '4K streaming, companion devices, and spatial audio experiences.',
        icon: 'Tv',
      },
      {
        title: 'Community-led Growth',
        description: 'Events, streaks, and social rewards to boost retention.',
        icon: 'Users',
      },
      {
        title: 'Commerce-ready',
        description: 'In-app purchases, equipment bundles, and affiliate flows.',
        icon: 'CreditCard',
      },
    ],
    solutions: [
      {
        title: 'Coaching & Habit Loop Engine',
        description:
          'Program builder with progress dashboards, reminders, and AI nudges.',
        bullets: [
          'Goal-based scheduling & periodization',
          'Wearable integrations (Apple, Garmin, Fitbit)',
          'Recovery & adherence insights',
        ],
      },
      {
        title: 'Content Streaming Platform',
        description:
          'Live + on-demand classes with DRM, multi-language captions, and chat.',
        bullets: [
          'Production-ready CMS',
          'Interactive overlays & polls',
          'Pay-per-view & subscription models',
        ],
      },
      {
        title: 'Hybrid Studio Operations',
        description:
          'Membership, staff, and equipment management for gyms & studios.',
        bullets: [
          'Self check-in kiosks & access control',
          'Trainer rosters & payroll',
          'Inventory + retail POS',
        ],
      },
      {
        title: 'Marketplace & Commerce Layer',
        description:
          'Creator storefronts with bundles, merch sales, and referral payouts.',
        bullets: [
          'Tiered subscriptions & community perks',
          'Coupon, gift card, and wallet support',
          'Affiliate tracking dashboards',
        ],
      },
    ],
    faqs: baseFaqs('fitnesstech development'),
    engagementModels: baseEngagementModels,
    techStacks: baseTechStacks,
    presentation:
      presentationThemes['fitnesstech-app-development'] ??
      presentationThemes.default,
  },
  {
    slug: 'foodtech-software-solutions',
    name: 'FoodTech Software Solutions',
    hero: buildHero(
      'FoodTech Software Solutions',
      'Digitize kitchens, cloud restaurants, and food supply chains with operational excellence.',
      'We partner with QSRs, cloud kitchens, and enterprise caterers to modernize menu engineering, production planning, and delivery orchestration.',
      '/image8.png'
    ),
    stats: baseStats,
    services: [
      {
        title: 'Kitchen & Production Management',
        description:
          'Recipe management, prep planning, and SKU-level costing dashboards.',
      },
      {
        title: 'Menu Engineering & Personalization',
        description:
          'Dynamic menus, upsell logic, and nutritional tagging for every channel.',
      },
      {
        title: 'Multi-brand Delivery Platforms',
        description:
          'Aggregator integrations, virtual brand tooling, and order routing.',
      },
      {
        title: 'Procurement & Inventory Control',
        description:
          'Vendor portals, automated replenishment, and wastage analytics.',
      },
      {
        title: 'Food Safety & Compliance',
        description:
          'HACCP checklists, IoT temperature logs, and audit-ready reporting.',
      },
      {
        title: 'Customer Experience Apps',
        description:
          'Loyalty programs, subscription meals, and experiential dining apps.',
      },
    ],
    leadership: {
      highlight: 'Leading FoodTech Engineering Team',
      description:
        'From ghost kitchens to enterprise cafeterias, we orchestrate food tech platforms with accurate demand planning, real-time kitchen insights, and delightful consumer apps.',
      image: '/image8.png',
    },
    highlights: [
      {
        title: 'Operational Visibility',
        description: 'Dashboards connect procurement, production, and delivery KPIs.',
        icon: 'Gauge',
      },
      {
        title: 'Quality & Compliance',
        description: 'IoT logging, digital SOPs, and recall-ready documentation.',
        icon: 'Shield',
      },
      {
        title: 'Menu Intelligence',
        description: 'A/B testing menus, price elasticity tracking, and bundling.',
        icon: 'Utensils',
      },
      {
        title: 'Guest Retention',
        description: 'CRM journeys, subscription clubs, and VIP experiences.',
        icon: 'Gift',
      },
    ],
    solutions: [
      {
        title: 'Central Kitchen Command Center',
        description:
          'Plan procurement, prep, and distribution across outlets.',
        bullets: [
          'Recipe scaling & costing',
          'Batch-wise production tracking',
          'Delivery slot & rider integration',
        ],
      },
      {
        title: 'Virtual Brand & Marketplace Suite',
        description:
          'Spin up new virtual brands across aggregators with unified dashboards.',
        bullets: [
          'Menu versioning & localization',
          'Outlet-specific availability rules',
          'Promo performance analytics',
        ],
      },
      {
        title: 'Food Safety Automation',
        description:
          'IoT sensors and checklists to ensure HACCP compliance.',
        bullets: [
          'Temperature & hygiene logging',
          'Corrective action workflows',
          'Regulatory audit exports',
        ],
      },
      {
        title: 'Guest Experience Platforms',
        description:
          'White-labeled mobile apps with loyalty, subscription meals, and feedback loops.',
        bullets: [
          'Personalized recommendations',
          'Wallets, prepaid meals, and tipping',
          'Real-time support messaging',
        ],
      },
    ],
    faqs: baseFaqs('foodtech solutions'),
    engagementModels: baseEngagementModels,
    techStacks: baseTechStacks,
    presentation:
      presentationThemes['foodtech-software-solutions'] ??
      presentationThemes.default,
  },
  {
    slug: 'gaming-app-development',
    name: 'Gaming App Development',
    hero: buildHero(
      'Gaming App Development',
      'Ship cross-platform games, creator ecosystems, and LiveOps tooling at lightning speed.',
      'We help studios build multiplayer experiences, LiveOps pipelines, and monetization systems with scalable backend infrastructure.',
      '/image9.png'
    ),
    stats: baseStats,
    services: [
      {
        title: 'Game Design & Prototyping',
        description: 'Concept art, economy design, and prototype validation.',
      },
      {
        title: 'Multiplayer Backend Engineering',
        description: 'Matchmaking, authoritative servers, telemetry, and anti-cheat.',
      },
      {
        title: 'LiveOps & Content Pipelines',
        description: 'CMS, event orchestration, and asset deployment tooling.',
      },
      {
        title: 'Cross-platform Clients',
        description: 'Unity/Unreal builds for mobile, PC, console, and web.',
      },
      {
        title: 'Esports & Community',
        description: 'Leaderboards, tournaments, and creator portals.',
      },
      {
        title: 'Monetization & Payments',
        description: 'IAP, subscriptions, tokenized assets, and marketplaces.',
      },
    ],
    leadership: {
      highlight: 'Leading Gaming Tech Partner',
      description:
        'We empower studios with robust multiplayer stacks, analytics, and LiveOps automation to keep players engaged and monetized.',
      image: '/image9.png',
    },
    highlights: [
      {
        title: 'Low-latency Infra',
        description: 'Edge regions, UDP networking, and rollback netcode expertise.',
        icon: 'Zap',
      },
      {
        title: 'LiveOps Excellence',
        description: 'Event orchestration, experimentation, and segmentation pipelines.',
        icon: 'CalendarCheck',
      },
      {
        title: 'Fair & Secure Play',
        description: 'Anti-cheat, fraud detection, and player safety frameworks.',
        icon: 'Shield',
      },
      {
        title: 'Player Economy Strategy',
        description: 'IAP balancing, token sinks, and auction houses.',
        icon: 'Coins',
      },
    ],
    solutions: [
      {
        title: 'Multiplayer Core Services',
        description:
          'Matchmaking, lobbies, chat, and real-time telemetry for PvP/PvE titles.',
        bullets: [
          'Skill + ping-based lobbies',
          'Party systems & social graph',
          'Observability + alerting dashboards',
        ],
      },
      {
        title: 'LiveOps Automation',
        description:
          'Low-code pipelines for events, rewards, and featured storefronts.',
        bullets: [
          'Content scheduling & localization',
          'In-game messaging & inbox',
          'A/B testing and segmentation',
        ],
      },
      {
        title: 'Gaming Commerce Stack',
        description:
          'Bundles, battle passes, NFT drops, and fiat/crypto payments.',
        bullets: [
          'Fraud protection & refund tooling',
          'Price experimentation & taxes',
          'Marketplace with creator royalties',
        ],
      },
      {
        title: 'Analytics & Player Success',
        description:
          'Funnel analysis, churn modeling, and support integrations.',
        bullets: [
          'Real-time dashboards (DAU/MAU/LTV)',
          'Sentiment and behavioral cohorts',
          'Player care ticketing workflows',
        ],
      },
    ],
    faqs: baseFaqs('gaming app development'),
    engagementModels: baseEngagementModels,
    techStacks: baseTechStacks,
    presentation:
      presentationThemes['gaming-app-development'] ?? presentationThemes.default,
  },
  {
    slug: 'healthtech-app-development',
    name: 'HealthTech App Development',
    hero: buildHero(
      'HealthTech App Development',
      'Deliver patient-centered health platforms with interoperability, security, and compliant UX.',
      'Our teams build telehealth, remote monitoring, and care coordination products aligned with HIPAA, GDPR, and regional mandates.',
      '/image10.png'
    ),
    stats: baseStats,
    services: [
      {
        title: 'Patient Engagement Apps',
        description: 'Onboarding, appointments, messaging, and education flows.',
      },
      {
        title: 'Telemedicine & Virtual Care',
        description: 'Video consults, e-prescriptions, and care plans.',
      },
      {
        title: 'Remote Patient Monitoring',
        description: 'Device connectivity, alerts, and clinician dashboards.',
      },
      {
        title: 'EHR & Interoperability',
        description: 'FHIR APIs, integrations, and clinical data normalization.',
      },
      {
        title: 'Clinical Workflow Automation',
        description: 'Task automation, rounding tools, and staff coordination.',
      },
      {
        title: 'Health Analytics & AI',
        description: 'Predictive insights, triage models, and population health.',
      },
    ],
    leadership: {
      highlight: 'Leading HealthTech Product Studio',
      description:
        'We combine clinical advisory boards, regulatory expertise, and product engineering to ship safe, scalable healthcare platforms.',
      image: '/image10.png',
    },
    highlights: [
      {
        title: 'Regulatory Compliance',
        description: 'HIPAA, GDPR, MDR, and FDA Class II documentation support.',
        icon: 'FileCheck',
      },
      {
        title: 'Interoperability Ready',
        description: 'FHIR, HL7, DICOM, and wearable integrations.',
        icon: 'Link',
      },
      {
        title: 'Clinical UX Research',
        description: 'Usability labs with clinicians, patients, and caregivers.',
        icon: 'Stethoscope',
      },
      {
        title: 'Cybersecurity & Privacy',
        description: 'Zero-trust architecture, PHI encryption, and continuous monitoring.',
        icon: 'Shield',
      },
    ],
    solutions: [
      {
        title: 'Virtual Care & Telehealth Suite',
        description: 'Scheduling, video consults, e-prescriptions, and billing.',
        bullets: [
          'AI triage & intake questionnaires',
          'Provider availability & routing',
          'Claims & payment integrations',
        ],
      },
      {
        title: 'Remote Patient Monitoring Platform',
        description: 'Device integration hub with alerting and care plans.',
        bullets: [
          'Bluetooth & IoT device SDKs',
          'Observation/alert dashboards',
          'Escalation workflows & EMR sync',
        ],
      },
      {
        title: 'Care Coordination Workspace',
        description: 'Multidisciplinary collaboration for hospitals and home care.',
        bullets: [
          'Task & rounding boards',
          'Secure messaging & shared notes',
          'Outcome tracking & analytics',
        ],
      },
      {
        title: 'Patient Engagement & Adherence',
        description: 'Gamified medication reminders, education, and communities.',
        bullets: [
          'Personalized care journeys',
          'Multilingual content & accessibility',
          'Survey & PROM collection',
        ],
      },
    ],
    faqs: baseFaqs('healthtech development'),
    engagementModels: baseEngagementModels,
    techStacks: baseTechStacks,
    presentation:
      presentationThemes['healthtech-app-development'] ??
      presentationThemes.default,
  },
  {
    slug: 'manufacturingtech-software-solutions',
    name: 'ManufacturingTech Software Solutions',
    hero: buildHero(
      'ManufacturingTech Software Solutions',
      'Digitize factories with industrial IoT, production intelligence, and connected worker tools.',
      'We modernize MES, quality, maintenance, and supplier collaboration systems to boost throughput and resilience.',
      '/image11.png'
    ),
    stats: baseStats,
    services: [
      {
        title: 'Smart Factory Platforms',
        description: 'IoT data lakes, digital twins, and OEE dashboards.',
      },
      {
        title: 'Manufacturing Execution Systems',
        description: 'Electronic work instructions, traceability, and WIP tracking.',
      },
      {
        title: 'Predictive Maintenance',
        description: 'Condition monitoring, ML models, and service scheduling.',
      },
      {
        title: 'Quality & Compliance',
        description: 'SPC, e-signatures, audits, and CAPA workflows.',
      },
      {
        title: 'Supplier & Inventory Collaboration',
        description: 'Portals for vendors, logistics, and procurement teams.',
      },
      {
        title: 'Connected Worker Solutions',
        description: 'AR-assisted training, safety apps, and workforce analytics.',
      },
    ],
    leadership: {
      highlight: 'Leading Industry 4.0 Partner',
      description:
        'From discrete manufacturing to process industries, we deliver scalable manufacturing tech with real-time shop-floor visibility and AI optimization.',
      image: '/image11.png',
    },
    highlights: [
      {
        title: 'Industrial IoT Expertise',
        description: 'Edge connectivity, OPC-UA, and secure device management.',
        icon: 'Cpu',
      },
      {
        title: 'Operational Excellence',
        description: 'Lean, Six Sigma, and TPM champions embedded with squads.',
        icon: 'Target',
      },
      {
        title: 'Safety & Sustainability',
        description: 'ESG reporting, safety alerts, and compliance automation.',
        icon: 'Recycle',
      },
      {
        title: 'Legacy Modernization',
        description: 'OT/IT integration, API gateways, and cloud migration.',
        icon: 'RefreshCcw',
      },
    ],
    solutions: [
      {
        title: 'Production Intelligence Platform',
        description: 'Real-time OEE, downtime analytics, and shift orchestration.',
        bullets: [
          'Machine connectivity kits',
          'Digital twins & simulation',
          'Role-based dashboards',
        ],
      },
      {
        title: 'Predictive Maintenance Suite',
        description: 'Asset condition monitoring with ML-driven service recommendations.',
        bullets: [
          'Sensor fusion pipelines',
          'Failure probability modeling',
          'Technician mobile apps',
        ],
      },
      {
        title: 'Supplier Collaboration Hub',
        description: 'Plan, procure, and collaborate with vendors in real time.',
        bullets: [
          'Forecast sharing & ASN tracking',
          'Quality scorecards & audits',
          'Invoice, payment, and logistics sync',
        ],
      },
      {
        title: 'Connected Worker Platform',
        description: 'Digital work instructions, AR guidance, and safety management.',
        bullets: [
          'Skill matrix & certification tracking',
          'Incident reporting & prevention',
          'Wearable integrations for safety',
        ],
      },
    ],
    faqs: baseFaqs('manufacturing tech solutions'),
    engagementModels: baseEngagementModels,
    techStacks: baseTechStacks,
    presentation:
      presentationThemes['manufacturingtech-software-solutions'] ??
      presentationThemes.default,
  },
  {
    slug: 'car-rental-booking-aggregator',
    name: 'Car Rental Booking cum Aggregator',
    hero: buildHero(
      'Car Rental Booking cum Aggregator',
      'Launch multi-brand rental marketplaces with fleet intelligence, pricing engines, and customer delight.',
      'We connect rental partners, fleets, and travelers through white-label booking apps, smart contracts, and operations portals.',
      '/image6.png'
    ),
    stats: baseStats,
    services: [
      {
        title: 'Consumer Booking Apps',
        description: 'Search, compare, and reserve vehicles with add-ons and insurance.',
      },
      {
        title: 'Partner Onboarding Portals',
        description: 'Fleet uploads, rate management, and payout dashboards.',
      },
      {
        title: 'Fleet & Telematics',
        description: 'Vehicle telemetry, maintenance, and asset security.',
      },
      {
        title: 'Dynamic Pricing & Revenue',
        description: 'AI-driven pricing, promotions, and affiliate programs.',
      },
      {
        title: 'Operations & Compliance',
        description: 'KYC, contracts, damage workflows, and regulatory reporting.',
      },
      {
        title: 'Customer Support & Loyalty',
        description: 'CRM, ticketing, and loyalty wallets for repeat renters.',
      },
    ],
    leadership: {
      highlight: 'Leading Mobility Marketplace Partner',
      description:
        'We connect fleets and travelers with stellar booking UX, automation-driven partner operations, and 24/7 customer success tooling.',
      image: '/image6.png',
    },
    highlights: [
      {
        title: 'Marketplace DNA',
        description: 'Supply-demand balancing, partner scoring, and trust programs.',
        icon: 'Scale',
      },
      {
        title: 'Fleet Intelligence',
        description: 'Telematics, geofencing, and preventive maintenance automation.',
        icon: 'Car',
      },
      {
        title: 'Revenue Orchestration',
        description: 'Pricing labs, ancillary upsells, and commission tracking.',
        icon: 'ChartLine',
      },
      {
        title: 'Customer Delight',
        description: '360-support, omnichannel messaging, and VIP care.',
        icon: 'MessageCircle',
      },
    ],
    solutions: [
      {
        title: 'Unified Booking Experience',
        description:
          'Mobile/web journeys with filters, upsells, and instant confirmations.',
        bullets: [
          'Multi-city availability & delivery',
          'Add-on insurance & accessories',
          'Digital contracts & signatures',
        ],
      },
      {
        title: 'Fleet & Partner Command Center',
        description:
          'Operational dashboards for utilization, revenue split, and payouts.',
        bullets: [
          'Partner scorecards & audits',
          'Maintenance & recall alerts',
          'Automated invoicing & settlements',
        ],
      },
      {
        title: 'Pricing & Yield Management',
        description:
          'AI pricing with demand, seasonality, and competitor signals.',
        bullets: [
          'Rule + ML blended strategies',
          'Promo & affiliate attribution',
          'What-if planners for fleet expansion',
        ],
      },
      {
        title: 'Customer Success & Loyalty Hub',
        description:
          'CRM, chat, and loyalty wallets ensure stellar post-booking journeys.',
        bullets: [
          'Self-serve amendments & support',
          'Tiered loyalty & referral rewards',
          'Service recovery automations',
        ],
      },
    ],
    faqs: baseFaqs('car rental marketplace'),
    engagementModels: baseEngagementModels,
    techStacks: baseTechStacks,
    presentation:
      presentationThemes['car-rental-booking-aggregator'] ??
      presentationThemes.default,
  },
  {
    slug: 'n8n-workflow-automation',
    name: 'n8n Workflow Automation & Integration',
    hero: buildHero(
      'Premier n8n Automation & Integration Experts',
      'Transform your business operations with enterprise-grade n8n automation solutions. Connect 400+ apps, automate complex workflows, and integrate everything—all without code.',
      'We are n8n automation specialists delivering cutting-edge workflow orchestration, custom node development, and self-hosted enterprise solutions. Stay ahead with the latest n8n features, AI integrations, and automation best practices powered by our deep n8n expertise.',
      '/image1.png',
      [
        'Expert n8n setup, configuration & optimization',
        'Custom workflow design for any business process',
        'Self-hosted & cloud n8n deployment',
        'Advanced integrations with 400+ apps & APIs',
      ]
    ),
    stats: baseStats,
    services: [
      {
        title: 'n8n Platform Setup & Configuration',
        description:
          'Complete n8n deployment, security hardening, performance tuning, and team onboarding for production-ready automation infrastructure.',
      },
      {
        title: 'Custom Workflow Automation Design',
        description:
          'Sophisticated automation sequences connecting apps, databases, APIs, and services into intelligent, self-executing processes.',
      },
      {
        title: 'Advanced n8n Integrations',
        description:
          'Leverage 400+ pre-built nodes and custom development to connect any tool in your tech stack—from CRMs to AI services.',
      },
      {
        title: 'Self-Hosted n8n Solutions',
        description:
          'Complete control with on-premise deployments, custom security configurations, and enterprise compliance support.',
      },
      {
        title: 'n8n Custom Node Development',
        description:
          'Build proprietary nodes for internal tools, legacy systems, and specialized APIs not covered by standard n8n library.',
      },
      {
        title: 'n8n Migration & Upgrades',
        description:
          'Seamless migration from Zapier, Make, or other automation platforms to n8n with zero downtime and improved performance.',
      },
    ],
    leadership: {
      highlight: 'Leading n8n Automation Partner',
      description:
        'Transform your operations with Nano Flows\' n8n expertise. We architect enterprise automation ecosystems, build custom integrations, and maintain cutting-edge knowledge of n8n\'s latest features and AI capabilities to future-proof your workflow infrastructure.',
      image: '/image1.png',
    },
    highlights: [
      {
        title: 'n8n Certified Experts',
        description:
          'Deep n8n expertise with hundreds of production workflows deployed across industries and enterprise clients.',
        icon: 'Users',
      },
      {
        title: 'Rapid Automation Delivery',
        description:
          'Launch automation workflows in days, not weeks—with agile methodology and n8n best practices baked in.',
        icon: 'Rocket',
      },
      {
        title: 'Future-Ready Architecture',
        description:
          'Stay updated with latest n8n releases, AI integrations, and emerging automation patterns for sustained competitive advantage.',
        icon: 'Sparkles',
      },
      {
        title: 'Enterprise-Grade Security',
        description:
          'Self-hosted deployments, encrypted credentials, role-based access, and compliance-ready configurations.',
        icon: 'Shield',
      },
      {
        title: 'Flexible Engagement Models',
        description:
          'From one-time workflow builds to dedicated automation teams—scale n8n expertise as your needs evolve.',
        icon: 'Layers',
      },
      {
        title: 'Premium Support & Training',
        description:
          'Comprehensive team training, detailed documentation, and ongoing support to maximize your n8n investment.',
        icon: 'Heart',
      },
    ],
    solutions: [
      {
        title: 'Sales & Marketing Automation',
        description:
          'Automate lead capture, CRM updates, email campaigns, and reporting with n8n workflows.',
        bullets: [
          'Lead routing & enrichment automation',
          'Multi-channel campaign orchestration',
          'Real-time dashboard & analytics sync',
        ],
      },
      {
        title: 'Data Integration & ETL Pipelines',
        description:
          'Build robust data pipelines connecting databases, APIs, and analytics platforms with n8n.',
        bullets: [
          'Scheduled & event-driven data sync',
          'Transformation & validation workflows',
          'Error handling & retry logic',
        ],
      },
      {
        title: 'Customer Support Automation',
        description:
          'Streamline ticketing, chatbot handoffs, and internal notifications with intelligent n8n workflows.',
        bullets: [
          'Ticket routing & SLA monitoring',
          'AI-powered response suggestions',
          'Cross-platform support sync',
        ],
      },
      {
        title: 'DevOps & IT Automation',
        description:
          'Automate deployments, monitoring alerts, incident response, and infrastructure management with n8n.',
        bullets: [
          'CI/CD pipeline orchestration',
          'Incident alerting & escalation',
          'Resource provisioning automation',
        ],
      },
    ],
    faqs: [
      {
        question: 'Why choose n8n over Zapier or Make?',
        answer:
          'n8n offers complete data ownership with self-hosted options, unlimited workflow executions, advanced debugging, custom code execution, and no vendor lock-in—all at a fraction of the cost of cloud automation platforms.',
      },
      {
        question: 'Can n8n integrate with our legacy systems and custom APIs?',
        answer:
          'Absolutely. n8n supports HTTP requests, webhooks, custom authentication, and we can build custom nodes for any proprietary system, ensuring seamless integration across your entire tech stack.',
      },
      {
        question: 'How secure is n8n for enterprise use?',
        answer:
          'n8n provides enterprise-grade security with self-hosted deployment options, encrypted credential storage, role-based access control, audit logs, and compliance with GDPR, SOC 2, and other standards when properly configured.',
      },
      {
        question: 'What kind of workflows can n8n automate?',
        answer:
          'From simple data sync to complex multi-step business processes—n8n handles lead routing, invoice processing, inventory sync, customer onboarding, report generation, API orchestration, and virtually any workflow spanning multiple tools and systems.',
      },
    ],
    engagementModels: baseEngagementModels,
    techStacks: baseTechStacks,
    presentation:
      presentationThemes['agritech-application-development'] ??
      presentationThemes.default,
  },
];

export const getIndustryBySlug = (slug?: string) =>
  industriesContent.find((industry) => industry.slug === slug);

