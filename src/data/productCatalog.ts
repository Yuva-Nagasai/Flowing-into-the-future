export type ProductItemStatus = 'supported' | 'limited' | 'not-supported';

export interface ProductItem {
  name: string;
  slug: string;
  description: string;
}

export interface ProductCategory {
  title: string;
  slug: string;
  description: string;
  path: string;
  items: ProductItem[];
}

export interface ProductItemDetail {
  title: string;
  categoryTitle: string;
  summary: string;
  features: string[];
  highlights: string[];
  comparison: {
    name: string;
    sekeltech: { status: ProductItemStatus; text: string };
    others: { status: ProductItemStatus; text: string };
  }[];
}

export const productCategories: ProductCategory[] = [
  {
    title: 'AI Experience Suite',
    slug: 'ai-experience-suite',
    description: 'AI solutions that power automation, intelligence, and smarter experiences.',
    path: '/products/ai-solutions',
    items: [
      {
        name: 'Custom AI Tools & Automation',
        slug: 'custom-ai-tools-automation',
        description: 'Build AI agents, workflows, and automations tailored to your business processes.'
      },
      {
        name: 'AI Consulting & Training',
        slug: 'ai-consulting-training',
        description: 'Design your AI roadmap, upskill your team, and adopt AI safely and effectively.'
      },
      {
        name: 'Predictive Analytics & Forecasting',
        slug: 'predictive-analytics-forecasting',
        description: 'Use machine learning to forecast demand, churn, and performance with confidence.'
      },
      {
        name: 'Intelligent Chatbots & Assistants',
        slug: 'intelligent-chatbots-assistants',
        description: 'Deploy conversational AI for customer support, lead capture, and internal tools.'
      }
    ]
  },
  {
    title: 'Cloud & Performance Platform',
    slug: 'cloud-performance-platform',
    description: 'Modern cloud, DevOps, and performance engineering for reliable scale.',
    path: '/products/cloud-platform',
    items: [
      {
        name: 'Cloud Migration & Modernisation',
        slug: 'cloud-migration-modernisation',
        description: 'Re-platform and modernise your applications on secure, scalable cloud infrastructure.'
      },
      {
        name: 'DevOps & CI/CD Automation',
        slug: 'devops-cicd-automation',
        description: 'Automate builds, testing, and deployments with modern DevOps pipelines.'
      },
      {
        name: 'Performance Optimization Suite',
        slug: 'performance-optimization-suite',
        description: 'Boost speed and reliability with tuning, caching, CDNs, and observability.'
      },
      {
        name: 'Secure API & Microservices',
        slug: 'secure-api-microservices',
        description: 'Design secure, scalable APIs and microservices that connect your entire stack.'
      }
    ]
  },
  {
    title: 'Growth & Analytics Hub',
    slug: 'growth-analytics-hub',
    description: 'Data, analytics, and marketing experiences that grow your brand.',
    path: '/products/analytics-tools',
    items: [
      {
        name: 'Customer Data & Analytics',
        slug: 'customer-data-analytics',
        description: 'Unify customer data into dashboards that reveal behaviour, cohorts, and ROI.'
      },
      {
        name: 'Marketing Performance Dashboard',
        slug: 'marketing-performance-dashboard',
        description: 'Track campaigns, leads, and revenue across every channel in real time.'
      },
      {
        name: 'Social Media & Campaigns',
        slug: 'social-media-campaigns',
        description: 'Plan, publish, and optimise campaigns across major social platforms.'
      },
      {
        name: 'YouTube Promotions',
        slug: 'youtube-promotions',
        description: 'Grow your channel with content strategy, SEO, and performance tracking.'
      }
    ]
  }
];

const detailFromItem = (categoryTitle: string, item: ProductItem): ProductItemDetail => {
  const itemName = item.name;
  return {
    title: itemName,
    categoryTitle,
    summary: item.description,
    features: [
      `${itemName} is managed from a single control center with full audit trails.`,
      `AI-driven recommendations highlight the next best action to improve ${itemName}.`,
      `Real-time dashboards track ${itemName} KPIs across all locations and channels.`,
      `Integrates seamlessly with your existing tools to extend ${itemName} data anywhere.`
    ],
    highlights: [
      `Dedicated workflows designed for ${itemName} owners and collaborators.`,
      `Automation rules ensure ${itemName} stays compliant and up-to-date.`,
      `Insights surface opportunities to optimize ${itemName} for every region.`,
      `Role-based access keeps ${itemName} initiatives secure and auditable.`
    ],
    comparison: [
      {
        name: `${itemName} operations`,
        sekeltech: { status: 'supported', text: `End-to-end orchestration of ${itemName} with automated workflows.` },
        others: { status: 'limited', text: 'Disparate tools and manual processes cause delays.' }
      },
      {
        name: 'Visibility & analytics',
        sekeltech: { status: 'supported', text: `Live dashboards reveal ${itemName} performance across every market.` },
        others: { status: 'limited', text: 'Static reports with little actionable insight.' }
      },
      {
        name: 'Scalability & governance',
        sekeltech: { status: 'supported', text: 'Built-in approvals, versioning, and compliance policies.' },
        others: { status: 'not-supported', text: 'No standardized governance for enterprise scale.' }
      }
    ]
  };
};

export const productItemDetails: Record<string, ProductItemDetail> = productCategories.reduce(
  (acc, category) => {
    category.items.forEach((item) => {
      acc[`${category.slug}/${item.slug}`] = detailFromItem(category.title, item);
    });
    return acc;
  },
  {} as Record<string, ProductItemDetail>
);

