import { useEffect } from 'react';
import { MapPin, Compass, Globe, Route } from 'lucide-react';
import ProductCategoryTemplate from '../../components/products/ProductCategoryTemplate';
import SEO from '../../components/SEO';

const discoveryFeatures = [
  {
    title: 'Omni-channel Visibility',
    description:
      'Centralise and synchronise all store data across search engines, maps, marketplaces, voice assistants, and partner directories.'
  },
  {
    title: 'Real-time Store Locator',
    description:
      'Deliver precise directions with GPS, traffic, and inventory context so nearby customers can discover and visit the closest outlet instantly.'
  },
  {
    title: 'Micro-site Builder',
    description:
      'Generate responsive store micro-sites with branded layouts, promotions, catalogues, reviews, and lead capture forms—no code required.'
  },
  {
    title: 'Reputation Suite',
    description:
      'Monitor, respond, and automate review workflows at scale with AI-powered sentiment tracking and compliance-ready audit logs.'
  }
];

const discoveryEnhancements = [
  'Automated listing governance across 200+ publishers and partners.',
  'Bulk updates for hours, inventory, offers, and service availability.',
  'Geo-fenced campaigns that connect search demand with localised landing pages.',
  'Insights dashboard revealing discovery, engagement, and conversion patterns.',
  'Role-based controls for regional teams, agencies, and franchise partners.',
  'API-first architecture to plug directly into your CMS, CRM, or commerce stack.'
];

const comparisonData = [
  {
    name: 'Listing Management',
    sekeltech: { status: 'supported', text: 'Automated multi-network sync with governance alerts.' },
    others: { status: 'limited', text: 'Manual updates and inconsistent data health.' }
  },
  {
    name: 'Store Locator',
    sekeltech: { status: 'supported', text: 'Real-time GPS, traffic, and inventory context.' },
    others: { status: 'limited', text: 'Basic map embedding without live signals.' }
  },
  {
    name: 'Store Microsites',
    sekeltech: { status: 'supported', text: 'Brand-ready templates, dynamic catalogues, and lead flows.' },
    others: { status: 'not-supported', text: 'Requires complex custom development.' }
  },
  {
    name: 'Review Management',
    sekeltech: { status: 'supported', text: 'Unified inbox with AI response assistance and sentiment analytics.' },
    others: { status: 'limited', text: 'Fragmented monitoring without automation.' }
  },
  {
    name: 'Content Optimisation',
    sekeltech: { status: 'supported', text: 'Guided SEO recommendations for every location page.' },
    others: { status: 'limited', text: 'Manual keyword updates and static copy.' }
  },
  {
    name: 'Compliance & Audit',
    sekeltech: { status: 'supported', text: 'Complete audit trails, approvals, and SLA dashboards.' },
    others: { status: 'not-supported', text: 'No built-in compliance workflows.' }
  }
];

const iconHighlights = [
  {
    icon: MapPin,
    title: 'Verified Listings',
    description: 'Consistent name, address, and content across every search, map, and commerce partner.'
  },
  {
    icon: Compass,
    title: 'Smart Navigation',
    description: 'Live GPS, traffic, and routing signals so local customers reach the closest store instantly.'
  },
  {
    icon: Globe,
    title: 'Global Scale',
    description: 'Launch multilingual microsites, offers, and seasonal campaigns across every territory.'
  },
  {
    icon: Route,
    title: 'Journey Insights',
    description: 'Connect searches, calls, chats, and store visits into one measurable funnel.'
  }
];

const stats = [
  { label: 'Directories managed', value: '200+', helper: 'Search, maps, marketplaces, & voice' },
  { label: 'Listing accuracy', value: '99.8%', helper: 'Automated governance & alerts' }
];

const pageContent = {
  badgeLabel: 'Get Discovery',
  badgeIcon: MapPin,
  heroEyebrow: 'Hyperlocal discovery automation',
  heroTitle: 'Be discovered locally. Be chosen instantly.',
  heroDescription:
    'Connect every store, dealer, and franchise to search-ready experiences. Nano Flows automates listings, microsites, reputation, and analytics so your brand stays consistent wherever customers are searching.',
  stats,
  iconHighlights,
  featureCards: discoveryFeatures,
  featureHeading: 'Hyperlocal suite capabilities',
  enhancements: discoveryEnhancements,
  enhancementsHeading: 'Where it eliminates friction',
  comparison: comparisonData,
  comparisonHeading: 'Nano Flows vs directory management tools',
  cta: {
    title: 'Launch discovery once and scale everywhere',
    description: 'Unify listings, microsites, and reviews with a single governance-ready control tower.',
    buttonLabel: 'Schedule hyperlocal demo',
    buttonLink: '/#contact'
  }
};

const GetDiscovery = () => {
  useEffect(() => {
    document.title = 'Get Discovery - Nano Flows Products';
  }, []);

  return (
    <>
      <SEO
        title="Get Discovery Platform - NanoFlows"
        description="Omni-channel store visibility, real-time store locator, micro-site builder, and reputation management to help customers discover your business."
        keywords="store discovery, store locator, omni-channel visibility, reputation management, micro-site builder"
      />
      <ProductCategoryTemplate {...pageContent} />
    </>
  );
};

export default GetDiscovery;


