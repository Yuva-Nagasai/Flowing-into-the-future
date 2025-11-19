import React, { useState, useEffect } from 'react';
import {
  Cpu,
  Activity,
  HardDrive,
  Layers,
  Server,
  Cloud,
  Database,
  Lock,
  Shield,
  Key,
  Fingerprint,
  Smartphone,
  Tablet,
  Monitor,
  Wifi,
  Globe,
  MapPin,
  Satellite,
  LineChart,
  BarChart2,
  PieChart,
  TrendingUp,
  Bot,
  PlugZap,
  ShieldCheck,
  SmartphoneCharging,
  Globe2,
  BarChart3,
  CheckCircle2,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

type Theme = 'dark' | 'light';

const nodeColors = [
  'text-electric-blue',
  'text-accent-red',
  'text-electric-green',
  'text-accent-yellow',
];

type Feature = {
  title: string;
  description: string;
  details: string;
  icons: React.ElementType[];
  stats: { label: string; value: string }[];
  professionalIcon: React.ElementType;
  points: string[];
};

const features: Feature[] = [
  {
    title: 'AI-Powered Intelligence',
    description:
      'Leverage advanced machine learning algorithms that continuously adapt and improve based on user interactions and data patterns.',
    details:
      'Nano Flows presents an advanced AI framework designed to redefine automation and intelligence. Our system learns dynamically from user data, delivering real-time insights and predictive capabilities that evolve with every interaction.',
    icons: [Cpu, Activity, HardDrive, Shield],
    stats: [
      { label: 'Accuracy', value: '99.8%' },
      { label: 'Response Time', value: '< 100ms' },
    ],
    professionalIcon: Bot,
    points: [
      'Self-learning algorithms that evolve continuously',
      'AI-assisted automation reducing manual effort',
      'Adaptive models built for enterprise data environments',
    ],
  },
  {
    title: 'n8n Workflow Automation',
    description:
      'Expert n8n automation solutions connecting 400+ apps and services. Build powerful workflows, automate complex processes, and integrate everything without code—all while maintaining complete control.',
    details:
      'Nano Flows is your premier n8n automation partner. We architect enterprise-grade workflow automation ecosystems with n8n, delivering custom integrations, self-hosted solutions, and cutting-edge automation strategies that keep your business ahead of the curve.',
    icons: [Layers, Server, Cloud, Database],
    stats: [
      { label: 'n8n Apps', value: '400+' },
      { label: 'Setup Time', value: '< 1 day' },
    ],
    professionalIcon: PlugZap,
    points: [
      'n8n platform setup, configuration & optimization',
      'Custom workflow automation for any business process',
      'Self-hosted & cloud n8n deployments with full security',
      'Advanced integrations connecting your entire tech stack',
    ],
  },
  {
    title: 'Enterprise Security',
    description:
      'Bank-grade encryption and security protocols protect your data at every layer. Compliant with GDPR, SOC2, and ISO 27001.',
    details:
      'Nano Flows ensures enterprise-grade protection through encryption, compliance, and active monitoring. Our architecture is engineered to maintain zero-trust access, safeguarding every transaction and data stream.',
    icons: [Lock, Shield, Key, Fingerprint],
    stats: [
      { label: 'Uptime', value: '99.99%' },
      { label: 'Compliance', value: '100%' },
    ],
    professionalIcon: ShieldCheck,
    points: [
      'End-to-end encryption with AES-256 and TLS 1.3',
      'Compliance with SOC 2, ISO 27001, and GDPR standards',
      '24/7 monitoring and automated threat response systems',
    ],
  },
  {
    title: 'Mobile-First Design',
    description:
      'Optimized experiences across all devices. Our responsive design ensures pixel-perfect rendering on any screen size.',
    details:
      'Nano Flows champions mobile-first innovation—crafted for flexibility, speed, and clarity across all devices. Every pixel is tuned for fluid navigation and accessibility without compromising performance.',
    icons: [Smartphone, Tablet, Monitor, Wifi],
    stats: [
      { label: 'Devices', value: 'All' },
      { label: 'Performance', value: 'A+' },
    ],
    professionalIcon: SmartphoneCharging,
    points: [
      'Progressive design optimized for any screen size',
      'Cross-device UI consistency and fast load performance',
      'Touch-responsive layouts and adaptive visuals',
    ],
  },
  {
    title: 'Global Scalability',
    description:
      'Built to scale from startup to enterprise. Our infrastructure handles millions of requests with consistent performance.',
    details:
      'Nano Flows provides a globally distributed architecture with seamless scalability. Whether serving startups or global enterprises, our infrastructure maintains uptime and low-latency delivery worldwide.',
    icons: [Globe, MapPin, Satellite, Wifi],
    stats: [
      { label: 'Regions', value: '25+' },
      { label: 'Latency', value: '< 50ms' },
    ],
    professionalIcon: Globe2,
    points: [
      'Distributed edge computing for global coverage',
      'Elastic scaling during high-demand periods',
      'Load balancing for uninterrupted user experiences',
    ],
  },
  {
    title: 'Real-Time Analytics',
    description:
      'Gain instant insights with comprehensive analytics dashboards. Track KPIs, user behavior, and system performance in real-time.',
    details:
      'Nano Flows transforms analytics into real-time intelligence. Our platform empowers organizations to act instantly on live data, improving decision-making and operational performance at every level.',
    icons: [LineChart, BarChart2, PieChart, TrendingUp],
    stats: [
      { label: 'Metrics', value: '50+' },
      { label: 'Updates', value: 'Live' },
    ],
    professionalIcon: BarChart3,
    points: [
      'Instant dashboards with live metrics and KPIs',
      'Predictive insights powered by streaming analytics',
      'Custom visualizations for actionable intelligence',
    ],
  },
];

const AnimatedWorkflow = ({
  icons,
  theme,
  isActive,
  activeBlinkingNode,
}: {
  icons: React.ElementType[];
  theme: Theme;
  isActive: boolean;
  activeBlinkingNode: number;
}) => {
  return (
    <div className="flex flex-wrap items-center justify-center mb-4 gap-2 sm:gap-4">
      {icons.map((Icon, idx) => {
        const isBlinking = isActive && activeBlinkingNode === idx;
        const isFirstNode = idx === 0;
        const isThirdNode = idx === 2;

        const iconColor = isFirstNode
          ? '#708090'
          : isThirdNode
          ? '#1e90ff'
          : 'currentColor';

        return (
          <React.Fragment key={idx}>
            <div className="relative flex items-center justify-center">
              <div
                className={`
                  w-8 h-8 sm:w-16 sm:h-16 rounded-lg border-2 sm:border-4 flex items-center justify-center transition-all duration-300 shadow-md bg-white
                  ${nodeColors[idx % nodeColors.length]}
                  ${isBlinking ? 'scale-110' : ''}
                  ${
                    theme === 'dark'
                      ? 'border-electric-blue'
                      : 'border-accent-red'
                  }
                `}
              >
                <div
                  className={`
                    flex items-center justify-center w-6 h-6 sm:w-12 sm:h-12 rounded-full transition duration-300
                    ${
                      isBlinking
                        ? theme === 'dark'
                          ? 'bg-electric-blue/40'
                          : 'bg-accent-red/40'
                        : 'bg-gray-200/60'
                    }
                  `}
                >
                  <Icon size={16} className="sm:w-8 sm:h-8" color={iconColor} />
                </div>
              </div>
            </div>
            {idx < icons.length - 1 && (
              <div
                className={`h-1 sm:h-2 w-5 sm:w-12 transition-colors duration-300 ${
                  isBlinking
                    ? theme === 'dark'
                      ? 'bg-electric-blue'
                      : 'bg-accent-red'
                    : 'bg-gray-400/50'
                }`}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

const Features: React.FC = () => {
  const { theme } = useTheme() as { theme: Theme };
  const totalNodes = features.length * 4;
  const [blinkingNodeGlobalIndex, setBlinkingNodeGlobalIndex] = useState(0);
  const [expandedWeb, setExpandedWeb] = useState(false);
  const [expandedMobile, setExpandedMobile] = useState(false);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const breakpoint = 640;
  const isMobile = screenWidth < breakpoint;
  const [rotationActive, setRotationActive] = useState(true);

  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!rotationActive) return;
    const timer = setInterval(() => {
      setBlinkingNodeGlobalIndex((prev) => (prev + 1) % totalNodes);
    }, 800);
    return () => clearInterval(timer);
  }, [totalNodes, rotationActive]);

  const activeFeatureIndex = Math.floor(blinkingNodeGlobalIndex / 4);
  const activeFeature = features[activeFeatureIndex];

  const handleToggleExpand = () => {
    if (isMobile) {
      setExpandedMobile((prev) => !prev);
      setRotationActive((prev) => !prev);
    } else {
      setExpandedWeb((prev) => !prev);
      setRotationActive((prev) => !prev);
    }
  };

  const expanded = isMobile ? expandedMobile : expandedWeb;

  // ✅ Use first icon when collapsed, professionalIcon when expanded
  const ActiveIcon = expanded
    ? activeFeature.professionalIcon
    : activeFeature.icons[0];

  return (
    <section
      id="features"
      className={`py-12 px-4 sm:py-16 sm:px-6 relative overflow-hidden ${
        theme === 'dark' ? 'bg-dark-bg' : 'bg-white'
      }`}
    >
      <div
        className={`absolute inset-0 ${
          theme === 'dark' ? 'gradient-mesh' : 'gradient-mesh-light'
        }`}
      />
      <div className="container mx-auto px-4 sm:px-6 relative z-10 max-w-7xl flex flex-col items-center">
        <div className="text-center mb-12 sm:mb-16 mt-10 sm:mt-8">
          <h2
            className={`text-3xl sm:text-4xl md:text-5xl font-orbitron font-bold mb-4 ${
              theme === 'dark' ? 'text-white' : 'text-black'
            }`}
          >
            Powerful{' '}
            <span
              className={
                theme === 'dark' ? 'text-electric-green' : 'text-accent-red'
              }
            >
              Features
            </span>
          </h2>
          <p
            className={`text-base sm:text-lg font-exo max-w-xl sm:max-w-2xl mx-auto ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-800'
            }`}
          >
            Experience the next generation of digital innovation with features
            designed for performance, security, and scalability
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 gap-y-8 sm:grid-cols-2 sm:gap-12 items-center justify-items-center w-full">
          {features.map((feature, featureIndex) => {
            const startIndex = featureIndex * 4;
            const activeNodeForFeature =
              blinkingNodeGlobalIndex >= startIndex &&
              blinkingNodeGlobalIndex < startIndex + 4
                ? blinkingNodeGlobalIndex - startIndex
                : -1;

            return (
              <div
                key={featureIndex}
                className={`
                  cursor-pointer rounded-xl p-4 sm:p-6 transition-transform duration-300 max-w-full
                  flex flex-col items-center justify-center w-full sm:w-auto h-full
                  ${
                    blinkingNodeGlobalIndex >= startIndex &&
                    blinkingNodeGlobalIndex < startIndex + 4
                      ? theme === 'dark'
                        ? 'bg-dark-card border-2 border-electric-blue glow-blue scale-105'
                        : 'bg-white border-2 border-accent-red glow-red scale-105 shadow-xl'
                      : theme === 'dark'
                      ? 'bg-dark-card/50 border border-electric-blue/20 hover:border-electric-blue/50'
                      : 'bg-white/80 border border-gray-200 hover:border-accent-red/50 shadow-md'
                  }
                `}
              >
                <h3
                  className={`text-lg sm:text-xl font-orbitron font-bold mb-4 ${
                    theme === 'dark' ? 'text-white' : 'text-black'
                  }`}
                >
                  {feature.title}
                </h3>
                <AnimatedWorkflow
                  icons={feature.icons}
                  theme={theme}
                  isActive={rotationActive}
                  activeBlinkingNode={activeNodeForFeature}
                />
              </div>
            );
          })}
        </div>

        {/* Explore Card */}
        <div
          className={`rounded-2xl p-6 sm:p-8 mt-12 sm:mt-16 max-w-xl sm:max-w-3xl mx-auto transform transition-all duration-700 ease-in-out ${
            expanded
              ? `${isMobile ? 'scale-[1.06]' : 'scale-[1.15]'} z-50 shadow-2xl`
              : 'scale-100 z-0'
          } ${
            theme === 'dark'
              ? 'bg-dark-card/50 border border-electric-blue/20'
              : 'bg-white/80 shadow-xl'
          }`}
        >
          <div className={`${expanded ? 'px-2 sm:px-6 text-left' : 'text-center'}`}>
            {/* Icon Above Title */}
            <div
              className={`w-16 h-16 sm:w-24 sm:h-24 mx-auto rounded-full mb-4 sm:mb-6 flex items-center justify-center transition-all duration-500 ${
                expanded
                  ? theme === 'dark'
                    ? 'bg-gradient-to-tr from-electric-blue via-electric-green to-accent-yellow shadow-lg'
                    : 'bg-gradient-to-tr from-accent-red via-pink-500 to-orange-400 shadow-lg'
                  : theme === 'dark'
                  ? 'bg-electric-blue/20'
                  : 'bg-accent-red/20'
              }`}
            >
              <ActiveIcon
                size={36}
                color={
                  expanded
                    ? '#ffffff'
                    : theme === 'dark'
                    ? '#00FFFF'
                    : '#FF3B3B'
                }
              />
            </div>

            <h3
              className={`text-2xl sm:text-3xl font-orbitron font-bold mb-4 ${
                theme === 'dark' ? 'text-white' : 'text-black'
              } text-center`}
            >
              {activeFeature.title}
            </h3>

            <p
              className={`text-sm sm:text-base font-exo leading-relaxed mb-6 sm:mb-8 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-800'
              }`}
            >
              {expanded ? activeFeature.details : activeFeature.description}
            </p>

            {expanded && (
              <ul className="space-y-3 mb-6 sm:mb-8 text-left max-w-lg">
                {activeFeature.points.map((point, idx) => (
                  <li
                    key={idx}
                    className={`flex items-start gap-3 text-sm sm:text-base font-exo ${
                      theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
                    }`}
                  >
                    <CheckCircle2
                      size={18}
                      className={`mt-1 ${
                        theme === 'dark'
                          ? 'text-electric-green'
                          : 'text-accent-red'
                      }`}
                    />
                    {point}
                  </li>
                ))}
              </ul>
            )}

            {!expanded && (
              <div className="grid grid-cols-2 gap-3 sm:gap-4 justify-items-center mb-8">
                {activeFeature.stats.map((stat, idx) => (
                  <div
                    key={idx}
                    className={`p-3 sm:p-4 rounded-lg ${
                      theme === 'dark'
                        ? 'bg-dark-lighter border border-electric-blue/20'
                        : 'bg-gray-50 border border-gray-200'
                    }`}
                  >
                    <div
                      className={`text-xl sm:text-2xl font-orbitron font-bold mb-1 ${
                        theme === 'dark'
                          ? 'text-electric-green'
                          : 'text-accent-red'
                      }`}
                    >
                      {stat.value}
                    </div>
                    <div
                      className={`text-xs sm:text-sm font-exo ${
                        theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
                      }`}
                    >
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={handleToggleExpand}
            className={`w-full py-2 sm:py-3 rounded-lg font-exo font-semibold transition-transform duration-300 hover:scale-105 ${
              theme === 'dark'
                ? 'bg-electric-green text-black hover:glow-green'
                : 'bg-accent-red text-white hover:glow-red'
            }`}
          >
            {expanded ? 'Show Less' : 'Explore This Feature'}
          </button>
        </div>
      </div>
    </section>
  );
};

export default Features;
