import { useEffect } from 'react';
import { Database, Shield, Server, Cpu } from 'lucide-react';
import ProductCategoryTemplate from '../../components/products/ProductCategoryTemplate';
import SEO from '../../components/SEO';

const platformFeatures = [
  {
    title: 'Connected Data Fabric',
    description:
      'Ingest customer, dealer, product, and engagement signals from ERPs, commerce engines, POS, and marketing systems.'
  },
  {
    title: 'Real-time Activation',
    description:
      'Push unified profiles to CRM, marketing automation, analytics, and BI destinations with event-level governance.'
  },
  {
    title: '360° Access Control',
    description:
      'Define roles, permissions, and audit logs across internal teams, agencies, and franchise networks at scale.'
  },
  {
    title: 'Cloud Native Infrastructure',
    description:
      'Built on scalable microservices with automated failover, encryption, and compliance-ready observability.'
  }
];

const platformEnhancements = [
  'Single source of truth for profile, consent, and engagement data.',
  'No-code data pipelines with connectors for 50+ enterprise systems.',
  'AI-powered identity resolution with deterministic and probabilistic matching.',
  'Data quality scorecards highlighting anomalies and remediation actions.',
  'Built-in consent orchestration meeting GDPR, CCPA, and industry mandates.',
  'Developer-first APIs, webhooks, and event streams for custom workflows.'
];

const comparisonData = [
  {
    name: 'Data Integration',
    sekeltech: { status: 'supported', text: 'Unified profiles across online, offline, and partner data.' },
    others: { status: 'limited', text: 'Point-to-point connectors with data silos.' }
  },
  {
    name: 'STP Automation',
    sekeltech: { status: 'supported', text: 'Straight-through processing for onboarding and updates.' },
    others: { status: 'limited', text: 'Manual ETL jobs with delays.' }
  },
  {
    name: 'Data Activation',
    sekeltech: { status: 'supported', text: 'Real-time destinations for marketing, sales, and analytics.' },
    others: { status: 'limited', text: 'Batch-based exports only.' }
  },
  {
    name: 'Cloud Infrastructure',
    sekeltech: { status: 'supported', text: 'Multi-region, auto-scaled, and monitored 24/7.' },
    others: { status: 'limited', text: 'Single-region deployments with manual scaling.' }
  },
  {
    name: 'Security & Compliance',
    sekeltech: { status: 'supported', text: 'Role-based access, encryption, audit logs, and consent vault.' },
    others: { status: 'not-supported', text: 'Basic authentication without enterprise governance.' }
  },
  {
    name: 'Role-based Access',
    sekeltech: { status: 'supported', text: 'Granular permissions for teams, partners, and agencies.' },
    others: { status: 'limited', text: 'All-or-nothing access models.' }
  }
];

const iconHighlights = [
  {
    icon: Database,
    title: 'Connected Data Fabric',
    description: 'Unify CRM, ERP, POS, commerce, and partner data into a governed customer graph.'
  },
  {
    icon: Shield,
    title: 'Security & Compliance',
    description: 'Consent vault, encryption, audit logs, and policy controls ready for any regulator.'
  },
  {
    icon: Server,
    title: 'Cloud Native Scale',
    description: 'Multi-region resiliency with auto-scaling, monitoring, and failover baked in.'
  },
  {
    icon: Cpu,
    title: 'Real-time Activation',
    description: 'Stream intelligence to marketing, sales, analytics, and custom apps in seconds.'
  }
];

const stats = [
  { label: 'Profiles unified', value: '50M+', helper: 'Identity resolution at enterprise scale' },
  { label: 'Connectors & APIs', value: '50+', helper: 'Pre-built pipelines with STP automation' }
];

const pageContent = {
  badgeLabel: 'Unified Data Platform',
  badgeIcon: Database,
  heroEyebrow: 'Connected customer operating system',
  heroTitle: 'One data plane. Every journey.',
  heroDescription:
    'Orchestrate customer, dealer, and inventory data in real time. Nano Flows transforms isolated systems into a living intelligence layer powering activation, analytics, and AI-led personalisation.',
  stats,
  iconHighlights,
  featureCards: platformFeatures,
  featureHeading: 'Platform capabilities',
  enhancements: platformEnhancements,
  enhancementsHeading: 'Operational advantages delivered',
  comparison: comparisonData,
  comparisonHeading: 'Nano Flows vs traditional data platforms',
  cta: {
    title: 'Turn disconnected signals into governed intelligence',
    description: 'Connect every system once, activate everywhere, and keep regulators satisfied automatically.',
    buttonLabel: 'Schedule data workshop',
    buttonLink: '/#contact'
  }
};

const UnifiedDataPlatform = () => {
  useEffect(() => {
    document.title = 'Unified Data Platform - Nano Flows Products';
  }, []);

  return (
    <>
      <SEO
        title="Unified Data Platform - NanoFlows"
        description="Connected data fabric, real-time activation, 360° access control, and cloud-native infrastructure for unified customer data management."
        keywords="unified data platform, data fabric, customer data platform, CDP, data integration, data management"
      />
      <ProductCategoryTemplate {...pageContent} />
    </>
  );
};

export default UnifiedDataPlatform;


