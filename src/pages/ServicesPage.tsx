import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { 
  Code,
  Cloud,
  Zap,
  Shield,
  Database,
  Brain,
  Megaphone,
  Youtube,
  BookOpen,
  Wrench,
  Check, 
  X, 
  Minus,
  ArrowRight,
} from 'lucide-react';
import { motion } from 'framer-motion';

// Service comparison data structure
interface ComparisonFeature {
  name: string;
  sekeltech: { status: 'supported' | 'not-supported' | 'limited'; text: string };
  others: { status: 'supported' | 'not-supported' | 'limited'; text: string };
}

interface ServiceData {
  id: string;
  title: string;
  icon: any;
  description: string;
  features: string[];
  image: string;
  cta: string;
  comparison: ComparisonFeature[];
  whyChooseUs: string[];
}

const services: ServiceData[] = [
  {
    id: 'custom-development',
    title: 'Custom Development',
    icon: Code,
    description: 'Launch modern web, mobile, and system applications tailored for speed, security, and seamless integration. Empower your vision through custom development and future-proofed design.',
    features: [
      'Web Applications',
      'Mobile Apps',
      'API Development',
      'System Integrations'
    ],
    image: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExdWdra2NjemFjbmEzZm8wYmF5NWNtbmQ5aWN0NnJhcTBpaDhxemh5YiZlcD12MV9naWZzX3NlYXJjaCZjdD1n/JqmupuTVZYaQX5s094/giphy.gif',
    cta: 'Get Started',
    comparison: [
      {
        name: 'Full-stack development capabilities',
        sekeltech: { status: 'supported', text: 'Complete end-to-end development' },
        others: { status: 'limited', text: 'Limited to specific technologies' }
      },
      {
        name: 'Cross-platform mobile apps',
        sekeltech: { status: 'supported', text: 'Native iOS, Android & React Native' },
        others: { status: 'limited', text: 'Single platform focus' }
      },
      {
        name: 'Custom API development',
        sekeltech: { status: 'supported', text: 'RESTful, GraphQL, WebSocket APIs' },
        others: { status: 'limited', text: 'Basic API support only' }
      },
      {
        name: 'Enterprise-grade security',
        sekeltech: { status: 'supported', text: 'Built-in security best practices' },
        others: { status: 'limited', text: 'Additional security costs extra' }
      },
      {
        name: 'Scalable architecture',
        sekeltech: { status: 'supported', text: 'Microservices & cloud-native design' },
        others: { status: 'limited', text: 'Monolithic architecture' }
      },
      {
        name: '24/7 support & maintenance',
        sekeltech: { status: 'supported', text: 'Included in service package' },
        others: { status: 'not-supported', text: 'Separate maintenance contracts' }
      }
    ],
    whyChooseUs: [
      'Expert team with 10+ years of experience in custom software development',
      'Agile development methodology ensuring faster time-to-market',
      'Comprehensive testing and quality assurance processes',
      'Post-launch support and maintenance included',
      'Scalable solutions that grow with your business',
      'Transparent communication and regular progress updates'
    ]
  },
  {
    id: 'cloud-solutions',
    title: 'Cloud Solutions',
    icon: Cloud,
    description: 'Transform your infrastructure with automated cloud adoption, advanced DevOps, and microservices built for rapid scaling and ongoing reliability. Innovate without operational limits.',
    features: [
      'Cloud Migration',
      'DevOps Automation',
      'Serverless Systems',
      'Microservices Design'
    ],
    image: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExdmxjaDN6YjMydGFvdTRneWx6eGM3dWV4a3NqbGsxeWR5Z3QweGc2ZSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/3osxYrgM8gi9CDjcPu/giphy.gif',
    cta: 'Explore Cloud',
    comparison: [
      {
        name: 'Multi-cloud support',
        sekeltech: { status: 'supported', text: 'AWS, Azure, GCP support' },
        others: { status: 'limited', text: 'Single cloud provider only' }
      },
      {
        name: 'Automated DevOps pipelines',
        sekeltech: { status: 'supported', text: 'CI/CD automation included' },
        others: { status: 'limited', text: 'Manual setup required' }
      },
      {
        name: 'Serverless architecture',
        sekeltech: { status: 'supported', text: 'Full serverless implementation' },
        others: { status: 'not-supported', text: 'Traditional server-based' }
      },
      {
        name: 'Cost optimization',
        sekeltech: { status: 'supported', text: 'Automated cost monitoring & optimization' },
        others: { status: 'limited', text: 'Manual cost management' }
      },
      {
        name: 'Disaster recovery',
        sekeltech: { status: 'supported', text: 'Automated backup & recovery' },
        others: { status: 'limited', text: 'Basic backup only' }
      },
      {
        name: 'Real-time monitoring',
        sekeltech: { status: 'supported', text: 'Advanced monitoring & alerting' },
        others: { status: 'limited', text: 'Basic monitoring tools' }
      }
    ],
    whyChooseUs: [
      'Certified cloud architects with expertise across AWS, Azure, and GCP',
      'Zero-downtime migration strategies for seamless transitions',
      'Automated infrastructure management reducing operational costs',
      '24/7 cloud monitoring and proactive issue resolution',
      'Cost optimization strategies saving up to 40% on cloud expenses',
      'Compliance-ready infrastructure meeting industry standards'
    ]
  },
  {
    id: 'performance-optimization',
    title: 'Performance Optimization',
    icon: Zap,
    description: 'Maximize efficiency and uptime through code tuning, caching, load balancing, and global CDN deployment. Guarantee fast, reliable digital platforms for seamless scalability.',
    features: [
      'Load Balancing',
      'Caching Strategies',
      'Code Optimization',
      'CDN Configuration'
    ],
    image: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExZXlscG05eWIyazN0cmp1OHBzaDhyeWlrYnBhNWZpdTI3ZGtoZ2pnYyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/l3vRfNA1p0rvhMSvS/giphy.gif',
    cta: 'Optimize Now',
    comparison: [
      {
        name: 'Advanced caching strategies',
        sekeltech: { status: 'supported', text: 'Multi-layer caching system' },
        others: { status: 'limited', text: 'Basic caching only' }
      },
      {
        name: 'Global CDN deployment',
        sekeltech: { status: 'supported', text: 'Worldwide CDN network' },
        others: { status: 'limited', text: 'Regional CDN coverage' }
      },
      {
        name: 'Code optimization',
        sekeltech: { status: 'supported', text: 'Automated code analysis & optimization' },
        others: { status: 'limited', text: 'Manual optimization' }
      },
      {
        name: 'Database query optimization',
        sekeltech: { status: 'supported', text: 'Advanced query tuning & indexing' },
        others: { status: 'limited', text: 'Basic optimization' }
      },
      {
        name: 'Performance monitoring',
        sekeltech: { status: 'supported', text: 'Real-time performance dashboards' },
        others: { status: 'limited', text: 'Periodic reports only' }
      },
      {
        name: 'Auto-scaling capabilities',
        sekeltech: { status: 'supported', text: 'Intelligent auto-scaling' },
        others: { status: 'limited', text: 'Manual scaling required' }
      }
    ],
    whyChooseUs: [
      'Performance improvements of up to 300% in page load times',
      'Advanced caching strategies reducing server load by 60%',
      'Global CDN deployment ensuring fast content delivery worldwide',
      'Automated performance monitoring and optimization',
      'Database optimization improving query speeds by 10x',
      'Proven track record with measurable ROI improvements'
    ]
  },
  {
    id: 'cybersecurity',
    title: 'Cybersecurity',
    icon: Shield,
    description: 'Protect digital assets with proactive threat detection, encryption, compliance audits, and 24/7 system monitoring. Ensure business resilience and robust cyber defense strategy implementation.',
    features: [
      'Threat Detection',
      'Encryption',
      'Compliance Audits',
      'Security Monitoring'
    ],
    image: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExaWJiODd2eWRsdjlnZWV0YzJsa3B5ajB5YzRmMWpuYzE3YjZhcGdsMCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/26tPnAAJxXTvpLwJy/giphy.gif',
    cta: 'Secure Now',
    comparison: [
      {
        name: 'AI-powered threat detection',
        sekeltech: { status: 'supported', text: 'Advanced AI threat analysis' },
        others: { status: 'limited', text: 'Rule-based detection only' }
      },
      {
        name: 'End-to-end encryption',
        sekeltech: { status: 'supported', text: 'AES-256 encryption standard' },
        others: { status: 'limited', text: 'Basic encryption' }
      },
      {
        name: 'Compliance certifications',
        sekeltech: { status: 'supported', text: 'GDPR, HIPAA, SOC 2 compliant' },
        others: { status: 'limited', text: 'Limited compliance support' }
      },
      {
        name: '24/7 security monitoring',
        sekeltech: { status: 'supported', text: 'Round-the-clock monitoring' },
        others: { status: 'limited', text: 'Business hours only' }
      },
      {
        name: 'Penetration testing',
        sekeltech: { status: 'supported', text: 'Regular security audits included' },
        others: { status: 'not-supported', text: 'Additional cost service' }
      },
      {
        name: 'Incident response',
        sekeltech: { status: 'supported', text: 'Automated incident response' },
        others: { status: 'limited', text: 'Manual response process' }
      }
    ],
    whyChooseUs: [
      'Multi-layered security approach protecting against all threat vectors',
      'Compliance expertise ensuring GDPR, HIPAA, and SOC 2 compliance',
      'AI-powered threat detection identifying risks before they impact',
      'Round-the-clock security monitoring and incident response',
      'Regular security audits and penetration testing included',
      'Industry-leading encryption standards protecting sensitive data'
    ]
  },
  {
    id: 'data-analytics',
    title: 'Data Analytics',
    icon: Database,
    description: 'Visualize and interpret your data with the tailored analytics platforms and predictive dashboards. Empower the decisions with actionable insights and measurable business intelligence.',
    features: [
      'Big Data Processing',
      'Data Visualization',
      'BI Dashboards',
      'Predictive Analytics'
    ],
    image: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNGNlaThxcWNiMnp0Z21nMmFycWQ3OWJtYnFpZ2k4NXdheHhvenk5dyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/xUA7aWJ33L5vYH7Nao/giphy.gif',
    cta: 'Analyze Data',
    comparison: [
      {
        name: 'Real-time data processing',
        sekeltech: { status: 'supported', text: 'Streaming data analytics' },
        others: { status: 'limited', text: 'Batch processing only' }
      },
      {
        name: 'Advanced visualization',
        sekeltech: { status: 'supported', text: 'Interactive dashboards & reports' },
        others: { status: 'limited', text: 'Static reports' }
      },
      {
        name: 'Predictive analytics',
        sekeltech: { status: 'supported', text: 'ML-powered predictions' },
        others: { status: 'limited', text: 'Basic trend analysis' }
      },
      {
        name: 'Data integration',
        sekeltech: { status: 'supported', text: 'Multi-source data integration' },
        others: { status: 'limited', text: 'Limited integration options' }
      },
      {
        name: 'Custom BI dashboards',
        sekeltech: { status: 'supported', text: 'Fully customizable dashboards' },
        others: { status: 'limited', text: 'Template-based only' }
      },
      {
        name: 'Data governance',
        sekeltech: { status: 'supported', text: 'Complete data governance framework' },
        others: { status: 'limited', text: 'Basic data management' }
      }
    ],
    whyChooseUs: [
      'Real-time data processing enabling instant business insights',
      'Custom BI dashboards tailored to your specific KPIs',
      'Advanced predictive analytics powered by machine learning',
      'Seamless integration with existing data sources and systems',
      'Data governance framework ensuring data quality and compliance',
      'Actionable insights driving measurable business growth'
    ]
  },
  {
    id: 'ai-machine-learning',
    title: 'AI & Machine Learning',
    icon: Brain,
    description: 'Deploy advanced AI solutions for automation, predictive analytics, and natural language systems. Unlock smarter business outcomes and a professional scalable innovation across any industry.',
    features: [
      'Neural Networks',
      'Deep Learning',
      'Predictive Models',
      'NLP Solutions'
    ],
    image: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExY2E3YWVhZW1nbXdpZWE5MGY5NHBwN2g1bXJwYWh4NWoyeWh6OGd5NiZlcD12MV9naWZzX3NlYXJjaCZjdD1n/xTiN0CNHgoRf1Ha7CM/giphy.gif',
    cta: 'Explore AI',
    comparison: [
      {
        name: 'Custom AI model development',
        sekeltech: { status: 'supported', text: 'Tailored AI models for your business' },
        others: { status: 'limited', text: 'Pre-built models only' }
      },
      {
        name: 'Deep learning frameworks',
        sekeltech: { status: 'supported', text: 'TensorFlow, PyTorch, Keras support' },
        others: { status: 'limited', text: 'Limited framework support' }
      },
      {
        name: 'Natural Language Processing',
        sekeltech: { status: 'supported', text: 'Advanced NLP & sentiment analysis' },
        others: { status: 'limited', text: 'Basic text processing' }
      },
      {
        name: 'Computer vision',
        sekeltech: { status: 'supported', text: 'Image & video recognition' },
        others: { status: 'not-supported', text: 'Not available' }
      },
      {
        name: 'Model training & optimization',
        sekeltech: { status: 'supported', text: 'Automated hyperparameter tuning' },
        others: { status: 'limited', text: 'Manual tuning required' }
      },
      {
        name: 'AI model deployment',
        sekeltech: { status: 'supported', text: 'Production-ready deployment' },
        others: { status: 'limited', text: 'Limited deployment options' }
      }
    ],
    whyChooseUs: [
      'Custom AI models trained specifically for your business needs',
      'Expert team with deep expertise in TensorFlow, PyTorch, and Keras',
      'End-to-end AI solutions from development to deployment',
      'Advanced NLP and computer vision capabilities',
      'Automated model optimization reducing development time',
      'Production-ready AI solutions with proven scalability'
    ]
  },
  {
    id: 'social-media-campaigns',
    title: 'Social Media & Campaigns',
    icon: Megaphone,
    description: 'Accelerate brand growth with high-impact social campaigns, paid ads, creative content design, and active brand management. Engage and expand your audience everywhere.',
    features: [
      'Social Media Marketing',
      'Paid Campaigns',
      'Content Creation',
      'Brand Management'
    ],
    image: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExdTI3dWI3bGlyY3Z1MHIzcHVzN3doYXM5d3RnYXowOTRnazB2bG4wbiZlcD12MV9naWZzX3NlYXJjaCZjdD1n/l378A8qFW6R3iyX3a/giphy.gif',
    cta: 'Start Campaign',
    comparison: [
      {
        name: 'Multi-platform management',
        sekeltech: { status: 'supported', text: 'All major platforms integrated' },
        others: { status: 'limited', text: 'Limited platform support' }
      },
      {
        name: 'AI-powered content creation',
        sekeltech: { status: 'supported', text: 'Automated content generation' },
        others: { status: 'not-supported', text: 'Manual content creation' }
      },
      {
        name: 'Advanced audience targeting',
        sekeltech: { status: 'supported', text: 'AI-driven audience segmentation' },
        others: { status: 'limited', text: 'Basic demographic targeting' }
      },
      {
        name: 'Real-time campaign analytics',
        sekeltech: { status: 'supported', text: 'Live performance tracking' },
        others: { status: 'limited', text: 'Delayed reporting' }
      },
      {
        name: 'Automated A/B testing',
        sekeltech: { status: 'supported', text: 'Intelligent campaign optimization' },
        others: { status: 'limited', text: 'Manual testing required' }
      },
      {
        name: 'Crisis management',
        sekeltech: { status: 'supported', text: '24/7 brand monitoring & response' },
        others: { status: 'not-supported', text: 'Reactive approach only' }
      }
    ],
    whyChooseUs: [
      'Multi-platform expertise managing campaigns across all social channels',
      'AI-powered content creation reducing production time by 70%',
      'Advanced audience targeting increasing engagement rates by 3x',
      'Real-time campaign optimization maximizing ROI',
      'Crisis management and brand reputation protection',
      'Proven track record with 200% average ROI improvement'
    ]
  },
  {
    id: 'youtube-promotions',
    title: 'YouTube Promotions',
    icon: Youtube,
    description: 'Grow your audience with full YouTube channel setup, video SEO, strategic campaigns, and advanced analytics. Maximize your brand\'s reach and channel performance for sustained digital growth and long-term business success.',
    features: [
      'Channel Setup & Branding',
      'Video SEO Optimization',
      'Audience Targeting',
      'Performance Tracking'
    ],
    image: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExbmZxdHJocHowYmF1OHFtZnEwcWRkZ2EzNzJ2NHk5MmNrNzJiZGYwNSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/l0HlNaQ6gWfllcjDO/giphy.gif',
    cta: 'Grow Channel',
    comparison: [
      {
        name: 'Complete channel optimization',
        sekeltech: { status: 'supported', text: 'Full channel audit & optimization' },
        others: { status: 'limited', text: 'Basic setup only' }
      },
      {
        name: 'Advanced video SEO',
        sekeltech: { status: 'supported', text: 'AI-powered keyword research & optimization' },
        others: { status: 'limited', text: 'Basic SEO techniques' }
      },
      {
        name: 'Thumbnail design & testing',
        sekeltech: { status: 'supported', text: 'Data-driven thumbnail optimization' },
        others: { status: 'limited', text: 'Basic design templates' }
      },
      {
        name: 'YouTube Ads management',
        sekeltech: { status: 'supported', text: 'Full campaign management & optimization' },
        others: { status: 'limited', text: 'Basic ad setup' }
      },
      {
        name: 'Analytics & insights',
        sekeltech: { status: 'supported', text: 'Advanced analytics dashboard' },
        others: { status: 'limited', text: 'Standard YouTube analytics' }
      },
      {
        name: 'Content strategy',
        sekeltech: { status: 'supported', text: 'Data-driven content planning' },
        others: { status: 'limited', text: 'Generic content recommendations' }
      }
    ],
    whyChooseUs: [
      'Complete YouTube channel optimization from setup to growth',
      'AI-powered SEO strategies increasing video visibility by 400%',
      'Data-driven thumbnail and content optimization',
      'Full YouTube Ads management maximizing ad performance',
      'Advanced analytics providing actionable insights',
      'Proven results with average subscriber growth of 300%'
    ]
  },
  {
    id: 'ai-consulting-training',
    title: 'AI Consulting & Training',
    icon: BookOpen,
    description: 'Plan, train, and launch AI adoption with tailored consulting and workforce upskilling for future-ready intelligent enterprises. Enable scalable automation and sustainable innovation for long-term competitive business advantage.',
    features: [
      'AI Readiness Assessment',
      'AI Integration Strategy',
      'Corporate AI Training',
      'Process Automation Guidance'
    ],
    image: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExZzFpcGw5YXhsdmduaDBoaXpmaDJ6bWgxcXU5NGl0ZTNhZmphd2QzbCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/LaVp0AyqR5bGsC5Cbm/giphy.gif',
    cta: 'Get Consultation',
    comparison: [
      {
        name: 'Comprehensive AI assessment',
        sekeltech: { status: 'supported', text: 'Full organizational AI readiness audit' },
        others: { status: 'limited', text: 'Basic questionnaire only' }
      },
      {
        name: 'Custom training programs',
        sekeltech: { status: 'supported', text: 'Tailored curriculum for your team' },
        others: { status: 'limited', text: 'Generic training courses' }
      },
      {
        name: 'Hands-on workshops',
        sekeltech: { status: 'supported', text: 'Interactive practical sessions' },
        others: { status: 'limited', text: 'Theory-based training' }
      },
      {
        name: 'AI strategy development',
        sekeltech: { status: 'supported', text: 'Long-term AI roadmap creation' },
        others: { status: 'limited', text: 'Short-term recommendations' }
      },
      {
        name: 'Ongoing support',
        sekeltech: { status: 'supported', text: 'Continuous consultation & support' },
        others: { status: 'not-supported', text: 'One-time consultation only' }
      },
      {
        name: 'Certification programs',
        sekeltech: { status: 'supported', text: 'Industry-recognized certifications' },
        others: { status: 'limited', text: 'Basic completion certificates' }
      }
    ],
    whyChooseUs: [
      'Comprehensive AI readiness assessment identifying opportunities',
      'Custom training programs tailored to your team\'s skill level',
      'Hands-on workshops with practical, real-world applications',
      'Long-term AI strategy development for sustainable growth',
      'Ongoing support ensuring successful AI adoption',
      'Industry-recognized certifications enhancing team capabilities'
    ]
  },
  {
    id: 'custom-ai-tools-automation',
    title: 'Custom AI Tools & Automation',
    icon: Wrench,
    description: 'Unlock efficiency with bespoke AI products, workflow automation, integrated APIs, and advanced bots. Drive digital transformation across business processes for optimal, scalable results.',
    features: [
      'Custom AI Tools',
      'Workflow Automation',
      'API Integrations',
      'Bot Development'
    ],
    image: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExOHBubGNteDFqYzZhdDVmcWF2d3BjeThsNGprNWk0MTM2bWxxMWFweiZlcD12MV9naWZzX3NlYXJjaCZjdD1n/l0IylSajlbPRFxH8Y/giphy.gif',
    cta: 'Automate Now',
    comparison: [
      {
        name: 'Custom AI tool development',
        sekeltech: { status: 'supported', text: 'Bespoke AI solutions for your needs' },
        others: { status: 'limited', text: 'Pre-built tools only' }
      },
      {
        name: 'Workflow automation',
        sekeltech: { status: 'supported', text: 'End-to-end process automation' },
        others: { status: 'limited', text: 'Basic task automation' }
      },
      {
        name: 'Intelligent chatbots',
        sekeltech: { status: 'supported', text: 'AI-powered conversational bots' },
        others: { status: 'limited', text: 'Rule-based chatbots' }
      },
      {
        name: 'API integration',
        sekeltech: { status: 'supported', text: 'Seamless third-party integrations' },
        others: { status: 'limited', text: 'Limited integration capabilities' }
      },
      {
        name: 'Process optimization',
        sekeltech: { status: 'supported', text: 'AI-driven process improvement' },
        others: { status: 'not-supported', text: 'Manual process analysis' }
      },
      {
        name: 'Scalable automation',
        sekeltech: { status: 'supported', text: 'Enterprise-grade automation' },
        others: { status: 'limited', text: 'Small-scale automation only' }
      }
    ],
    whyChooseUs: [
      'Bespoke AI tools designed specifically for your workflows',
      'End-to-end automation reducing manual work by 80%',
      'Intelligent chatbots providing 24/7 customer support',
      'Seamless API integrations connecting all your systems',
      'AI-driven process optimization improving efficiency',
      'Enterprise-grade automation scaling with your business needs'
    ]
  }
];

const ServicesPage = () => {
  const { theme } = useTheme();
  const [activeService, setActiveService] = useState(services[0].id);

  const currentService = services.find(s => s.id === activeService) || services[0];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeService]);

  const StatusIcon = ({ status }: { status: string }) => {
    if (status === 'supported') {
      return <Check className="w-5 h-5 text-green-500" />;
    } else if (status === 'not-supported') {
      return <X className="w-5 h-5 text-red-500" />;
    } else {
      return <Minus className="w-5 h-5 text-yellow-500" />;
    }
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-dark-bg' : 'bg-white'}`}>
      <Header />
      <div className="pt-20">
        <div className="container mx-auto px-6 py-18">
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className={`text-5xl md:text-6xl font-orbitron font-bold mb-4 ${
              theme === 'dark' ? 'text-white' : 'text-black'
            }`}>
              Our <span className={theme === 'dark' ? 'text-electric-green' : 'text-accent-red'}>Services</span>
            </h1>
            <p className={`text-lg font-exo max-w-3xl mx-auto ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Comprehensive solutions designed to drive innovation and accelerate your digital transformation journey
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Navigation */}
            <aside
              className={`lg:w-80 flex-shrink-0 lg:self-start ${
                theme === 'dark'
                  ? 'bg-dark-card border border-electric-blue/20'
                  : 'bg-white border border-gray-200'
              } rounded-2xl p-6 pb-4 shadow-xl`}
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p
                    className={`text-xs font-exo uppercase tracking-widest mb-1 ${
                      theme === 'dark' ? 'text-electric-green' : 'text-accent-red'
                    }`}
                  >
                    Service Navigator
                  </p>
                  <h2
                    className={`text-xl font-orbitron font-bold ${
                      theme === 'dark' ? 'text-white' : 'text-black'
                    }`}
                  >
                    Explore Offerings
                  </h2>
                </div>
                <div
                  className={`hidden sm:flex items-center justify-center w-10 h-10 rounded-full ${
                    theme === 'dark'
                      ? 'bg-electric-blue/20 text-electric-blue'
                      : 'bg-accent-red/10 text-accent-red'
                  }`}
                >
                  •
                </div>
              </div>
              <p
                className={`text-xs font-exo mb-4 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                }`}
              >
                Jump between detailed service modules and discover how each capability
                elevates your website experience.
              </p>
              <nav className="flex flex-col gap-2.5">
                {services.map((service) => {
                  const Icon = service.icon;
                  const isActive = activeService === service.id;
                  const subTextClass = isActive
                    ? theme === 'dark'
                      ? 'text-black/80'
                      : 'text-white/80'
                    : theme === 'dark'
                    ? 'text-gray-200/80'
                    : 'text-gray-600';
                  return (
                    <button
                      key={service.id}
                      onClick={() => setActiveService(service.id)}
                      className={`w-full rounded-xl border flex items-center justify-between px-4 py-3 transition-all duration-300 ${
                        theme === 'dark'
                          ? isActive
                            ? 'bg-electric-blue text-black border-electric-blue'
                            : 'border-electric-blue/20 text-gray-200 hover:bg-dark-lighter'
                          : isActive
                          ? 'bg-accent-red text-white border-accent-red'
                          : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-3 text-left">
                        <div
                          className={`p-2 rounded-lg ${
                            theme === 'dark'
                              ? isActive
                                ? 'bg-black/20'
                                : 'bg-electric-blue/10'
                              : isActive
                              ? 'bg-white/20'
                              : 'bg-accent-red/10'
                          }`}
                        >
                          <Icon size={18} />
                        </div>
                        <div>
                          <p className="font-exo text-sm font-semibold leading-tight">
                            {service.title}
                          </p>
                          <span className={`text-[11px] font-exo ${subTextClass}`}>
                            {service.features[0]}
                          </span>
                        </div>
                      </div>
                      <div
                        className={`w-2 h-2 rounded-full ${
                          isActive
                            ? theme === 'dark'
                              ? 'bg-black'
                              : 'bg-white'
                            : theme === 'dark'
                            ? 'bg-electric-blue/40'
                            : 'bg-accent-red/40'
                        }`}
                      />
                    </button>
                  );
                })}
              </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1">
              <motion.div
                key={activeService}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`${theme === 'dark' ? 'bg-dark-card' : 'bg-white'} rounded-2xl p-8 shadow-lg`}
              >
                <div className={`flex flex-col lg:flex-row gap-8 mb-8 ${
                  services.findIndex(s => s.id === activeService) % 2 === 1 ? 'lg:flex-row-reverse' : ''
                }`}>
                  <div className="lg:w-1/2">
                    <div className={`w-16 h-16 rounded-xl flex items-center justify-center mb-6 ${
                      theme === 'dark'
                        ? 'bg-electric-blue/20 text-electric-blue'
                        : 'bg-accent-red/20 text-accent-red'
                    }`}>
                      <currentService.icon size={32} />
                    </div>
                    <h2 className={`text-4xl font-orbitron font-bold mb-4 ${
                      theme === 'dark' ? 'text-white' : 'text-black'
                    }`}>
                      {currentService.title}
                    </h2>
                    <p className={`text-lg font-exo leading-relaxed mb-6 ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      {currentService.description}
                    </p>
                    <button className={`px-8 py-3 rounded-lg font-exo font-semibold transition-all duration-300 hover:scale-105 ${
                      theme === 'dark'
                        ? 'bg-electric-green text-black hover:glow-green'
                        : 'bg-accent-red text-white hover:glow-red'
                    }`}>
                      {currentService.cta} <ArrowRight className="inline ml-2" size={20} />
                    </button>
                  </div>
                  <div className="lg:w-1/2">
                    <img
                      src={currentService.image}
                      alt={currentService.title}
                      className="w-full h-auto rounded-lg object-cover"
                    />
                  </div>
                </div>

                <div className="mt-8">
                  <h3 className={`text-2xl font-orbitron font-bold mb-6 ${
                    theme === 'dark' ? 'text-white' : 'text-black'
                  }`}>
                    Key Features
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {currentService.features.map((feature, index) => (
                      <div
                        key={index}
                        className={`flex items-start space-x-3 p-4 rounded-lg ${
                          theme === 'dark' ? 'bg-dark-lighter' : 'bg-gray-50'
                        }`}
                      >
                        <Check className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                          theme === 'dark' ? 'text-electric-green' : 'text-accent-red'
                        }`} />
                        <span className={`font-exo ${
                          theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Why Choose Us Section */}
                <div className="mt-12">
                  <h3 className={`text-3xl font-orbitron font-bold mb-6 ${
                    theme === 'dark' ? 'text-white' : 'text-black'
                  }`}>
                    Why Choose Us
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {currentService.whyChooseUs.map((reason, index) => (
                      <div
                        key={index}
                        className={`flex items-start space-x-3 p-4 rounded-lg ${
                          theme === 'dark' ? 'bg-dark-lighter border border-electric-blue/20' : 'bg-gray-50 border border-accent-red/20'
                        }`}
                      >
                        <Check className={`w-6 h-6 mt-0.5 flex-shrink-0 ${
                          theme === 'dark' ? 'text-electric-green' : 'text-accent-red'
                        }`} />
                        <span className={`font-exo text-base ${
                          theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                          {reason}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Comparison Table Section */}
                <div className="mt-12">
                  <div className="mb-8">
                    <h3 className={`text-3xl font-orbitron font-bold mb-2 ${
                      theme === 'dark' ? 'text-white' : 'text-black'
                    }`}>
                      {currentService.title}
                    </h3>
                    <h4 className={`text-xl font-orbitron font-bold mb-4 ${
                      theme === 'dark' ? 'text-electric-green' : 'text-accent-red'
                    }`}>
                      Nano Flows VS Others
                    </h4>
                    <p className={`font-exo ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      What makes Nano Flows apart from other service providers in the market for {currentService.title.toLowerCase()}.
                    </p>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr>
                          <th className={`p-4 text-left font-orbitron font-bold border ${
                            theme === 'dark' ? 'bg-electric-blue text-black border-gray-700' : 'bg-accent-red text-white border-gray-300'
                          }`}>
                            Feature
                          </th>
                          <th className={`p-4 text-left font-orbitron font-bold border ${
                            theme === 'dark' ? 'bg-electric-blue text-black border-gray-700' : 'bg-accent-red text-white border-gray-300'
                          }`}>
                          Nano Flows
                          </th>
                          <th className={`p-4 text-left font-orbitron font-bold border ${
                            theme === 'dark' ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-200 text-black border-gray-300'
                          }`}>
                            Others
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentService.comparison.map((feature, featIndex) => (
                          <tr
                            key={featIndex}
                            className={`border-b ${
                              theme === 'dark' ? 'border-gray-700 hover:bg-dark-lighter/50' : 'border-gray-200 hover:bg-gray-50'
                            } transition-colors`}
                          >
                            <td className={`p-4 font-exo border-r ${
                              theme === 'dark' ? 'text-gray-300 border-gray-700' : 'text-gray-700 border-gray-300'
                            }`}>
                              {feature.name}
                            </td>
                            <td className={`p-4 border-r ${
                              theme === 'dark' ? 'bg-dark-lighter border-gray-700' : 'bg-gray-50 border-gray-300'
                            }`}>
                              <div className="flex items-center space-x-3">
                                <StatusIcon status={feature.sekeltech.status} />
                                <span className={`font-exo text-sm ${
                                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                                }`}>
                                  {feature.sekeltech.text}
                                </span>
                              </div>
                            </td>
                            <td className={`p-4 ${
                              theme === 'dark' ? 'bg-dark-lighter' : 'bg-gray-50'
                            }`}>
                              <div className="flex items-center space-x-3">
                                <StatusIcon status={feature.others.status} />
                                <span className={`font-exo text-sm ${
                                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                                }`}>
                                  {feature.others.text}
                                </span>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className={`mt-8 p-6 rounded-lg flex flex-col md:flex-row items-center justify-between gap-4 ${
                    theme === 'dark' ? 'bg-dark-lighter' : 'bg-gray-100'
                  }`}>
                    <p className={`font-exo font-semibold text-center md:text-left ${
                      theme === 'dark' ? 'text-white' : 'text-black'
                    }`}>
                      {currentService.title} without all these.
                    </p>
                    <ArrowRight className={`w-6 h-6 flex-shrink-0 ${
                      theme === 'dark' ? 'text-electric-green' : 'text-accent-red'
                    }`} />
                    <p className={`font-exo font-semibold text-center md:text-right ${
                      theme === 'dark' ? 'text-electric-green' : 'text-accent-red'
                    }`}>
                      If you don&apos;t have all these you don&apos;t truly have {currentService.title.toLowerCase()}.
                    </p>
                  </div>
                </div>
              </motion.div>
            </main>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ServicesPage;
