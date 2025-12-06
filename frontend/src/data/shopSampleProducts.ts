import type { Product, Category } from '../types/shop';

const categoryLibrary: Record<
  'softwareTools' | 'cybersecurity' | 'dataPlatforms' | 'operations' | 'analytics',
  Category
> = {
  softwareTools: {
    id: 10,
    name: 'Software Tools',
    slug: 'software-tools',
    isActive: true,
    sortOrder: 1,
    createdAt: '',
    updatedAt: ''
  },
  cybersecurity: {
    id: 11,
    name: 'Cybersecurity',
    slug: 'cybersecurity',
    isActive: true,
    sortOrder: 2,
    createdAt: '',
    updatedAt: ''
  },
  dataPlatforms: {
    id: 12,
    name: 'Data Platforms',
    slug: 'data-platforms',
    isActive: true,
    sortOrder: 3,
    createdAt: '',
    updatedAt: ''
  },
  operations: {
    id: 13,
    name: 'Operations',
    slug: 'operations',
    isActive: true,
    sortOrder: 4,
    createdAt: '',
    updatedAt: ''
  },
  analytics: {
    id: 14,
    name: 'Analytics & AI',
    slug: 'analytics',
    isActive: true,
    sortOrder: 5,
    createdAt: '',
    updatedAt: ''
  }
};

const shopSampleProducts: Product[] = [
  {
    id: 2001,
    name: 'FlowOps Enterprise Automation Suite',
    slug: 'flowops-enterprise-automation-suite',
    description:
      'Unified orchestration layer for automating cross-team processes, approvals, and data syncs across 80+ SaaS platforms. Includes visual workflow builder, AI policy guardrails, and SLA monitoring for mission-critical operations.',
    shortDescription: 'Enterprise-grade orchestration for finance, HR, and ops teams',
    price: '329.00',
    comparePrice: '429.00',
    categoryId: categoryLibrary.softwareTools.id,
    category: categoryLibrary.softwareTools,
    images: ['/image1.png', '/image2.png'],
    thumbnail: '/image1.png',
    stock: 250,
    featured: true,
    isActive: true,
    tags: ['Automation', 'Workflow', 'AI'],
    metadata: {
      fileType: 'license',
      fileSize: '1.4 GB',
      license: 'Enterprise License',
      instantDownload: true,
      format: ['Windows', 'macOS', 'Linux'],
      duration: 'Perpetual with support'
    },
    averageRating: '4.9',
    totalReviews: 212,
    createdAt: '2025-02-10T00:00:00Z',
    updatedAt: '2025-02-18T00:00:00Z'
  },
  {
    id: 2002,
    name: 'Sentia Threat Intelligence Cloud',
    slug: 'sentia-threat-intelligence-cloud',
    description:
      'Real-time threat graph platform combining telemetry, MITRE ATT&CK mappings, and automated response playbooks. Built for SecOps teams who need actionable intelligence with zero noise.',
    shortDescription: 'Proactive detection plus guided incident response in one pane',
    price: '499.00',
    comparePrice: '599.00',
    categoryId: categoryLibrary.cybersecurity.id,
    category: categoryLibrary.cybersecurity,
    images: ['/image3.png', '/image4.png'],
    thumbnail: '/image3.png',
    stock: 120,
    featured: true,
    isActive: true,
    tags: ['Security', 'Threat Intel', 'Automation'],
    metadata: {
      fileType: 'license',
      fileSize: '2.1 GB',
      license: 'SOC License',
      instantDownload: false,
      format: ['SaaS', 'On-Prem Appliance'],
      duration: 'Annual'
    },
    averageRating: '4.8',
    totalReviews: 141,
    createdAt: '2025-01-28T00:00:00Z',
    updatedAt: '2025-02-18T00:00:00Z'
  },
  {
    id: 2003,
    name: 'Lumen DataFabric Studio',
    slug: 'lumen-datafabric-studio',
    description:
      'Low-code environment for building governed data products, semantic layers, and real-time APIs. Features lineage tracking, cataloging, and secure sharing for distributed data teams.',
    shortDescription: 'Design, govern, and ship data products without engineering bottlenecks',
    price: '289.00',
    comparePrice: '369.00',
    categoryId: categoryLibrary.dataPlatforms.id,
    category: categoryLibrary.dataPlatforms,
    images: ['/image5.png'],
    thumbnail: '/image5.png',
    stock: 400,
    featured: false,
    isActive: true,
    tags: ['Data Fabric', 'APIs', 'Governance'],
    metadata: {
      fileType: 'license',
      fileSize: '950 MB',
      license: 'Team License',
      instantDownload: true,
      format: ['Windows', 'Linux'],
      duration: 'Perpetual'
    },
    averageRating: '4.7',
    totalReviews: 188,
    createdAt: '2025-02-01T00:00:00Z',
    updatedAt: '2025-02-15T00:00:00Z'
  },
  {
    id: 2004,
    name: 'PulseXR Product Analytics Hub',
    slug: 'pulsexr-product-analytics-hub',
    description:
      'End-to-end analytics environment featuring event pipelines, behavior modeling, feature flagging, and generative insight feeds. Purpose-built for product-led growth teams.',
    shortDescription: 'All-in-one product intelligence stack with AI-powered narratives',
    price: '259.00',
    comparePrice: '329.00',
    categoryId: categoryLibrary.analytics.id,
    category: categoryLibrary.analytics,
    images: ['/image6.png'],
    thumbnail: '/image6.png',
    stock: 520,
    featured: false,
    isActive: true,
    tags: ['Analytics', 'Feature Flags', 'AI'],
    metadata: {
      fileType: 'license',
      fileSize: '1.1 GB',
      license: 'Product Team License',
      instantDownload: true,
      format: ['macOS', 'Windows'],
      duration: 'Annual'
    },
    averageRating: '4.6',
    totalReviews: 163,
    createdAt: '2025-02-08T00:00:00Z',
    updatedAt: '2025-02-21T00:00:00Z'
  },
  {
    id: 2005,
    name: 'Nimbus DevSecOps Control Plane',
    slug: 'nimbus-devsecops-control-plane',
    description:
      'Policy-as-code command center that unifies CI/CD visibility, SBOM management, and automated compliance attestations. Includes prebuilt connectors for GitHub, GitLab, Azure, and Kubernetes.',
    shortDescription: 'Continuous delivery hardened with automated governance layers',
    price: '379.00',
    comparePrice: '459.00',
    categoryId: categoryLibrary.cybersecurity.id,
    category: categoryLibrary.cybersecurity,
    images: ['/image7.png', '/image8.png'],
    thumbnail: '/image7.png',
    stock: 310,
    featured: true,
    isActive: true,
    tags: ['DevSecOps', 'Compliance', 'CI/CD'],
    metadata: {
      fileType: 'license',
      fileSize: '1.8 GB',
      license: 'Enterprise License',
      instantDownload: true,
      format: ['Linux', 'Docker'],
      duration: 'Annual'
    },
    averageRating: '4.9',
    totalReviews: 97,
    createdAt: '2025-01-15T00:00:00Z',
    updatedAt: '2025-02-12T00:00:00Z'
  },
  {
    id: 2006,
    name: 'NovaCX Experience Automation',
    slug: 'novacx-experience-automation',
    description:
      'Customer journey brain that merges NPS, product telemetry, and revenue signals to prioritize interventions. Includes AI recommendation builder, service playbooks, and executive dashboards.',
    shortDescription: 'Operationalizes CX strategies with closed-loop automation',
    price: '299.00',
    comparePrice: '389.00',
    categoryId: categoryLibrary.operations.id,
    category: categoryLibrary.operations,
    images: ['/image9.png'],
    thumbnail: '/image9.png',
    stock: 460,
    featured: false,
    isActive: true,
    tags: ['CX', 'Automation', 'Dashboards'],
    metadata: {
      fileType: 'license',
      fileSize: '780 MB',
      license: 'Growth License',
      instantDownload: true,
      format: ['SaaS'],
      duration: 'Annual'
    },
    averageRating: '4.7',
    totalReviews: 88,
    createdAt: '2025-02-05T00:00:00Z',
    updatedAt: '2025-02-19T00:00:00Z'
  },
  {
    id: 2007,
    name: 'Atlas Supply Chain Control Tower',
    slug: 'atlas-supply-chain-control-tower',
    description:
      'Digital command center for global supply and logistics teams. Provides predictive ETAs, resilience scoring, multi-tier supplier visibility, and SAP/Oracle integrations.',
    shortDescription: 'Predictive visibility plus adaptive planning for complex supply chains',
    price: '549.00',
    comparePrice: '629.00',
    categoryId: categoryLibrary.operations.id,
    category: categoryLibrary.operations,
    images: ['/image10.png'],
    thumbnail: '/image10.png',
    stock: 95,
    featured: true,
    isActive: true,
    tags: ['Supply Chain', 'Planning', 'Predictive'],
    metadata: {
      fileType: 'license',
      fileSize: '2.7 GB',
      license: 'Enterprise License',
      instantDownload: false,
      format: ['Windows Server', 'SaaS'],
      duration: 'Annual'
    },
    averageRating: '4.8',
    totalReviews: 55,
    createdAt: '2025-01-05T00:00:00Z',
    updatedAt: '2025-02-20T00:00:00Z'
  },
  {
    id: 2008,
    name: 'Aether Digital Twin Studio',
    slug: 'aether-digital-twin-studio',
    description:
      'Professional modeling toolkit for designing industrial digital twins, running scenario simulations, and syncing OT data streams. Includes WebGL viewer, physics engine, and API connectors.',
    shortDescription: 'Build, simulate, and deploy industrial twins in record time',
    price: '439.00',
    comparePrice: '519.00',
    categoryId: categoryLibrary.dataPlatforms.id,
    category: categoryLibrary.dataPlatforms,
    images: ['/image11.png'],
    thumbnail: '/image11.png',
    stock: 180,
    featured: false,
    isActive: true,
    tags: ['Digital Twin', 'Simulation', 'OT'],
    metadata: {
      fileType: 'license',
      fileSize: '3.2 GB',
      license: 'Professional License',
      instantDownload: true,
      format: ['Windows', 'Linux'],
      duration: 'Annual'
    },
    averageRating: '4.6',
    totalReviews: 61,
    createdAt: '2025-02-14T00:00:00Z',
    updatedAt: '2025-02-21T00:00:00Z'
  },
  {
    id: 2009,
    name: 'Quanta Finance Modeling Workbench',
    slug: 'quanta-finance-modeling-workbench',
    description:
      'Advanced FP&A environment featuring multi-scenario forecasting, Monte Carlo stress testing, and automated board-ready narrative exports. Built for finance teams handling complex portfolios.',
    shortDescription: 'Next-gen FP&A modeling with AI narratives and automated reporting',
    price: '309.00',
    comparePrice: '389.00',
    categoryId: categoryLibrary.analytics.id,
    category: categoryLibrary.analytics,
    images: ['/nanoflows-image.png'],
    thumbnail: '/nanoflows-image.png',
    stock: 275,
    featured: false,
    isActive: true,
    tags: ['FP&A', 'Forecasting', 'Reporting'],
    metadata: {
      fileType: 'license',
      fileSize: '640 MB',
      license: 'Finance Pod License',
      instantDownload: true,
      format: ['Windows', 'macOS'],
      duration: 'Annual'
    },
    averageRating: '4.8',
    totalReviews: 134,
    createdAt: '2025-01-30T00:00:00Z',
    updatedAt: '2025-02-17T00:00:00Z'
  },
  {
    id: 2010,
    name: 'VectorEdge Vision AI Suite',
    slug: 'vectoredge-vision-ai-suite',
    description:
      'Full-stack computer vision toolkit with AutoML model builder, MLOps deployment pipelines, and on-device optimization for edge AI workloads across manufacturing and retail.',
    shortDescription: 'Deploy production-ready vision AI pipelines on edge hardware',
    price: '469.00',
    comparePrice: '549.00',
    categoryId: categoryLibrary.softwareTools.id,
    category: categoryLibrary.softwareTools,
    images: ['/image2.png'],
    thumbnail: '/image2.png',
    stock: 205,
    featured: true,
    isActive: true,
    tags: ['AI', 'Computer Vision', 'Edge'],
    metadata: {
      fileType: 'license',
      fileSize: '2.4 GB',
      license: 'Pro License',
      instantDownload: true,
      format: ['Linux', 'Windows'],
      duration: 'Annual'
    },
    averageRating: '4.9',
    totalReviews: 176,
    createdAt: '2025-02-03T00:00:00Z',
    updatedAt: '2025-02-22T00:00:00Z'
  }
];

export default shopSampleProducts;

