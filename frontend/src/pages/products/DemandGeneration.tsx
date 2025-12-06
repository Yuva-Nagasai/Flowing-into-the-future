import { useEffect } from 'react';
import { Megaphone, Target, BarChart2, Zap } from 'lucide-react';
import ProductCategoryTemplate from '../../components/products/ProductCategoryTemplate';
import SEO from '../../components/SEO';

const demandFeatures = [
  {
    title: 'Full-Funnel Campaigns',
    description:
      'Plan, launch, and optimise awareness, consideration, and conversion campaigns across search, social, video, and marketplaces.'
  },
  {
    title: 'Audience Intelligence',
    description:
      'Build lookalike, geo-fenced, and behaviour-based segments leveraging unified data from CRM, CDP, POS, and offline signals.'
  },
  {
    title: 'Performance Studio',
    description:
      'Visualise ROI by store, creative, audience, and platform with live dashboards, pacing alerts, and predictive forecasting.'
  },
  {
    title: 'Commerce Acceleration',
    description:
      'Connect campaigns to Store 2 Door experiences, click-to-call, WhatsApp commerce, and immersive product storytelling.'
  }
];

const demandEnhancements = [
  'Marketing automation with pre-built playbooks for launch, promos, and seasonal pushes.',
  'Cross-channel reporting combining online, offline, and in-store conversion data.',
  'Creative intelligence benchmarking message, visuals, and offers across markets.',
  'Budget orchestration that reallocates spend based on live performance signals.',
  'Sales enablement workflows with lead routing, remarketing triggers, and IVR.',
  'Partner ecosystem for agencies, resellers, and franchise growth teams.'
];

const comparisonData = [
  {
    name: 'Campaign Orchestration',
    sekeltech: { status: 'supported', text: 'Unified dashboard for search, social, video, and retail media.' },
    others: { status: 'limited', text: 'Channel-specific tools without shared intelligence.' }
  },
  {
    name: 'Audience Targeting',
    sekeltech: { status: 'supported', text: 'AI-driven cohorts, lookalikes, and geo-fenced segments.' },
    others: { status: 'limited', text: 'Manual targeting with basic demographics.' }
  },
  {
    name: 'SellrApp & Store2Door',
    sekeltech: { status: 'supported', text: 'Instant commerce journeys with shoppable chat and last-mile tracking.' },
    others: { status: 'not-supported', text: 'Requires multiple third-party tools.' }
  },
  {
    name: 'Planogram & Merchandising',
    sekeltech: { status: 'supported', text: 'Digital twin for shelves, offers, and content variants.' },
    others: { status: 'limited', text: 'Spreadsheet-based planograms without campaign sync.' }
  },
  {
    name: 'Real-time Sales Analytics',
    sekeltech: { status: 'supported', text: 'Revenue, leads, and attribution in a single pane.' },
    others: { status: 'limited', text: 'Disconnected reports with manual reconciliation.' }
  },
  {
    name: 'Automation & Alerts',
    sekeltech: { status: 'supported', text: 'Proactive insights, pacing controls, and SLA monitoring.' },
    others: { status: 'not-supported', text: 'Reactive checks with limited governance.' }
  }
];

const iconHighlights = [
  {
    icon: Megaphone,
    title: 'Full-funnel orchestration',
    description: 'AI-assisted planning across search, social, video, and retail media with shared intelligence.'
  },
  {
    icon: Target,
    title: 'Audience intelligence',
    description: 'Lookalikes, geo-fences, and behaviour-based cohorts powered by unified customer data.'
  },
  {
    icon: BarChart2,
    title: 'Revenue analytics',
    description: 'Pacing, ROAS, and attribution dashboards linking every impression to commerce.'
  },
  {
    icon: Zap,
    title: 'Commerce acceleration',
    description: 'Store2Door, WhatsApp commerce, and shoppable chat journeys ready out of the box.'
  }
];

const stats = [
  { label: 'Campaigns automated', value: '5K+', helper: 'Omnichannel launches & optimisations' },
  { label: 'Avg. ROAS uplift', value: '3.2x', helper: 'Dynamic budgets & creative intelligence' }
];

const pageContent = {
  badgeLabel: 'Demand Generation',
  badgeIcon: Megaphone,
  heroEyebrow: 'Precision marketing acceleration',
  heroTitle: 'Precision campaigns. Measurable revenue.',
  heroDescription:
    'Activate campaigns that connect discovery with commerce. Nano Flows unifies creative, media, data, and storefront experiences so every impression can be attributed to revenue.',
  stats,
  iconHighlights,
  featureCards: demandFeatures,
  featureHeading: 'Growth suite capabilities',
  enhancements: demandEnhancements,
  enhancementsHeading: 'Where teams feel the impact',
  comparison: comparisonData,
  comparisonHeading: 'Nano Flows vs traditional media stacks',
  cta: {
    title: 'Move from impressions to accountable revenue',
    description: 'Launch once, scale everywhere, and tie every decision to live sales and lead data.',
    buttonLabel: 'Talk to a growth expert',
    buttonLink: '/#contact'
  }
};

const DemandGeneration = () => {
  useEffect(() => {
    document.title = 'Demand Generation - Nano Flows Products';
  }, []);

  return (
    <>
      <SEO
        title="Demand Generation Platform - NanoFlows"
        description="Full-funnel marketing campaigns, audience intelligence, and performance analytics to accelerate commerce and drive conversions."
        keywords="demand generation, marketing automation, campaign management, audience intelligence, performance analytics"
      />
      <ProductCategoryTemplate {...pageContent} />
    </>
  );
};

export default DemandGeneration;

