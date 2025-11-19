import { useState, useEffect, useRef } from 'react';
import {
  Brain,
  Code,
  Cloud,
  Database,
  Shield,
  Zap,
  Youtube,
  Megaphone,
  TrendingUp,
  BookOpen,
  Wrench,
  X,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

const services = [
  {
    icon: Brain,
    title: 'AI & Machine Learning',
    description:
      'Deploy advanced AI solutions for automation, predictive analytics, and natural language systems. Unlock smarter business outcomes and a professional scalable innovation across any industry.',
    popupContent:
      'Nano Flows AI delivers innovative machine learning and artificial intelligence systems that power automation, predictive insights, and advanced language understanding for leading industries worldwide.',
    features: ['Neural Networks', 'Deep Learning', 'Predictive Models', 'NLP Solutions'],
    subserviceExplanations: [
      `Neural networks replicate the human brain’s pattern recognition to learn from complex data. Widely used in automation and computer vision to deliver efficient, accurate data classification.`,
      `Deep learning employs layered neural networks extracting intricate data features, enabling advancements in image recognition, natural speech processing, and autonomous vehicle technology.`,
      `Predictive models utilize analytics on historical data to forecast market trends and consumer behavior, empowering businesses with proactive, data-driven decision-making advantages.`,
      `Natural Language Processing enables computers to understand, interpret, and respond to human language effectively, driving chatbots, voice assistants, and advanced sentiment analyses.`,
    ],
    image: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExY2E3YWVhZW1nbXdpZWE5MGY5NHBwN2g1bXJwYWh4NWoyeWh6OGd5NiZlcD12MV9naWZzX3NlYXJjaCZjdD1n/xTiN0CNHgoRf1Ha7CM/giphy.gif',
  },
  {
    icon: Code,
    title: 'Custom Development',
    description:
      'Launch modern web, mobile, and system applications tailored for speed, security, and seamless integration. Empower your vision through custom development and future-proofed design.',
    popupContent:
      'Nano Flows AI designs and develops full-scale custom applications and enterprise platforms that are secure, scalable, and optimized to meet modern business and user experience demands.',
    features: ['Web Applications', 'Mobile Apps', 'API Development', 'System Integrations'],
    subserviceExplanations: [
      `Web applications deliver secure, scalable, and responsive experiences across browsers, optimizing workflows and enabling online services seamlessly on any device.`,
      `Mobile apps designed for iOS and Android platforms harness device capabilities to provide fast, intuitive customer and enterprise-focused functionalities.`,
      `APIs facilitate secure communication between platforms, enabling smooth data exchange and integration that enhances scalability and maintainability in complex systems.`,
      `System integrations connect disparate software and databases smartly, automating workflows, reducing manual intervention, and improving overall operational efficiency.`,
    ],
    image: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExdWdra2NjemFjbmEzZm8wYmF5NWNtbmQ5aWN0NnJhcTBpaDhxemh5YiZlcD12MV9naWZzX3NlYXJjaCZjdD1n/JqmupuTVZYaQX5s094/giphy.gif',
  },
  {
    icon: Cloud,
    title: 'Cloud Solutions',
    description:
      'Transform your infrastructure with automated cloud adoption, advanced DevOps, and microservices built for rapid scaling and ongoing reliability. Innovate without operational limits.',
    popupContent:
      'Nano Flows AI transforms organizational efficiency through intelligent cloud migrations, process automation, and modular microservice architectures engineered for high performance.',
    features: ['Cloud Migration', 'DevOps Automation', 'Serverless Systems', 'Microservices Design'],
    subserviceExplanations: [
      `Cloud migration securely moves applications and data to cloud platforms, allowing enhanced scalability, reduced costs, and minimal disruptions during transition.`,
      `DevOps automation accelerates software delivery via continuous integration, testing automation, and real-time monitoring, improving agility and reliability of systems.`,
      `Serverless architectures enable applications to automatically scale based on demand, cutting operational overhead and optimizing resource utilization effectively.`,
      `Microservices architecture divides applications into independent components communicating through APIs, fostering flexibility, fault tolerance, and rapid deployment cycles.`,
    ],
    image: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExdmxjaDN6YjMydGFvdTRneWx6eGM3dWV4a3NqbGsxeWR5Z3QweGc2ZSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/3osxYrgM8gi9CDjcPu/giphy.gif',
  },
  {
    icon: Database,
    title: 'Data Analytics',
    description:
      'Visualize and interpret your data with the tailored analytics platforms and predictive dashboards. Empower the decisions with actionable insights and measurable business intelligence.',
    popupContent:
      'Nano Flows AI builds end-to-end analytics ecosystems that process, visualize, and interpret data effectively, helping organizations act confidently on real-time business intelligence.',
    features: ['Big Data Processing', 'Data Visualization', 'BI Dashboards', 'Predictive Analytics'],
    subserviceExplanations: [
      `Big data processing handles enormous datasets at speed, extracting actionable insights that help optimize and streamline business decision-making processes.`,
      `Data visualization translates complex data sets into understandable charts and graphs, enabling quick recognition of trends and anomalies for better strategy.`,
      `Business Intelligence dashboards combine KPIs and analytics into a unified view, offering real-time insights that empower timely and informed leadership actions.`,
      `Predictive analytics applies machine learning to historic data, offering forecasts of future behavior and trends that help manage risk and optimize operations.`,
    ],
    image: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNGNlaThxcWNiMnp0Z21nMmFycWQ3OWJtYnFpZ2k4NXdheHhvenk5dyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/xUA7aWJ33L5vYH7Nao/giphy.gif',
  },
  {
    icon: Shield,
    title: 'Cybersecurity',
    description:
      'Protect digital assets with proactive threat detection, encryption, compliance audits, and 24/7 system monitoring. Ensure business resilience and robust cyber defense strategy implementation.',
    popupContent:
      'Nano Flows AI protects digital ecosystems with next-generation cybersecurity frameworks, compliance integration, and proactive threat prevention for complete operational safety.',
    features: ['Threat Detection', 'Encryption', 'Compliance Audits', 'Security Monitoring'],
    subserviceExplanations: [
      `Threat detection monitors networks continuously to identify malware and intrusions early, protecting data integrity and maintaining business continuity reliably.`,
      `Encryption safeguards hardware and software data by encoding information, ensuring that only authorized parties have access to sensitive communications and files.`,
      `Compliance audits evaluate IT systems against regulations and standards, highlighting weaknesses and ensuring ongoing conformity to avoid penalties and reputational damage.`,
      `Security monitoring provides continuous surveillance of IT infrastructure, identifying unauthorized access attempts promptly and facilitating forensic investigations efficiently.`,
    ],
    image: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExaWJiODd2eWRsdjlnZWV0YzJsa3B5ajB5YzRmMWpuYzE3YjZhcGdsMCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/26tPnAAJxXTvpLwJy/giphy.gif',
  },
  {
    icon: Zap,
    title: 'Performance Optimization',
    description:
      'Maximize efficiency and uptime through code tuning, caching, load balancing, and global CDN deployment. Guarantee fast, reliable digital platforms for seamless scalability.',
    popupContent:
      'Nano Flows AI enhances productivity with code optimization, speed engineering, and system resilience to ensure every platform runs faster, smoother, and with maximum uptime.',
    features: ['Load Balancing', 'Caching Strategies', 'Code Optimization', 'CDN Configuration'],
    subserviceExplanations: [
      `Load balancing optimizes resource use by distributing incoming traffic uniformly across multiple servers, preventing bottlenecks and maintaining uptime under load.`,
      `Caching strategies improve response times and reduce server strain by storing frequently requested data closer to end-users at various layers.`,
      `Code optimization enhances program efficiency by refining algorithms, reducing complexity, and minimizing resource consumption for better maintainability.`,
      `Content Delivery Networks deploy assets worldwide, delivering fast, secure content and mitigating downtime caused by server overloads or DDoS attacks.`,
    ],
    image: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExZXlscG05eWIyazN0cmp1OHBzaDhyeWlrYnBhNWZpdTI3ZGtoZ2pnYyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/l3vRfNA1p0rvhMSvS/giphy.gif',
  },
  {
    icon: Youtube,
    title: 'YouTube Promotions',
    description:
      'Grow your audience with full YouTube channel setup, video SEO, strategic campaigns, and advanced analytics. Maximize your brand’s reach and channel performance for sustained digital growth and long-term business success.',
    popupContent:
      'Nano Flows AI grows your digital influence through strategic YouTube channel management, intelligent SEO integration, audience targeting, and data-driven content analytics.',
    features: ['Channel Setup & Branding', 'Video SEO Optimization', 'Audience Targeting', 'Performance Tracking'],
    subserviceExplanations: [
      `Channel setup involves creating a visually cohesive YouTube presence with branded graphics and layout, building professional appeal that attracts more viewers.`,
      `Video SEO optimization enhances visibility by improving metadata, keywords, and thumbnail designs to rank higher on YouTube search and suggested videos.`,
      `Audience targeting leverages analytics and segmentation tools to serve personalized content and advertisements that effectively engage specific viewer groups.`,
      `Performance tracking monitors vital metrics like watch time, subscriber growth, and engagement rate to provide actionable insights for content improvement.`,
    ],
    image: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExbmZxdHJocHowYmF1OHFtZnEwcWRkZ2EzNzJ2NHk5MmNrNzJiZGYwNSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/l0HlNaQ6gWfllcjDO/giphy.gif',
  },
  {
    icon: Megaphone,
    title: 'Social Media & Campaigns',
    description:
      'Accelerate brand growth with high-impact social campaigns, paid ads, creative content design, and active brand management. Engage and expand your audience everywhere.',
    popupContent:
      'Nano Flows AI amplifies your brand identity using creative social campaigns, audience engagement tactics, targeted promotions, and proactive reputation management strategies.',
    features: ['Social Media Marketing', 'Paid Campaigns', 'Content Creation', 'Brand Management'],
    subserviceExplanations: [
      `Social media marketing boosts brand awareness and community engagement across multiple platforms, utilizing creative posts and influencer partnerships.`,
      `Paid campaigns focus on finely-tuned ad strategies that optimize return on ad spend, driving conversions and measurable traffic growth.`,
      `Content creation produces high-quality visuals, infographics, and videos that effectively communicate your brand story and encourage user sharing.`,
      `Brand management monitors online reputation, responding to feedback proactively and maintaining customer loyalty through strategic communications.`,
    ],
    image: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExdTI3dWI3bGlyY3Z1MHIzcHVzN3doYXM5d3RnYXowOTRnazB2bG4wbiZlcD12MV9naWZzX3NlYXJjaCZjdD1n/l378A8qFW6R3iyX3a/giphy.gif',
  },
  {
    icon: TrendingUp,
    title: 'Digital & SEO Marketing',
    description:
      'Boost visibility and search rankings through expert SEO, in-depth keyword research, local targeting, and technical optimization. Drive measurable web traffic and results with precision to accelerate online business growth.',
    popupContent:
      'Nano Flows AI improves search results through data-backed SEO processes, keyword strategies, and technical enhancements that elevate visibility and maximize online traffic.',
    features: ['On-Page SEO', 'Keyword Research', 'Local SEO', 'Technical Optimization'],
    subserviceExplanations: [
      `On-page SEO optimizes website elements including titles, headers, and meta tags to improve relevance and search engine rankings effectively.`,
      `Keyword research analyzes competitor searches and trends to select phrases that drive targeted, high-quality traffic consistently.`,
      `Local SEO enhances business visibility in geographic searches and local directory listings, expanding local customer reach successfully.`,
      `Technical SEO fixes site speed, mobile usability, and crawlability issues, ensuring high performance and effective indexation.`,
    ],
    image: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExOXU2cjB6YnN6M2JqNXVoNHk1N3RnaG0xd2hpZnJmanI5NGFuaDFrYiZlcD12MV9naWZzX3NlYXJjaCZjdD1n/xT9IgzoKnwFNmISR8I/giphy.gif',
  },
  {
    icon: BookOpen,
    title: 'AI Consulting & Training',
    description:
      'Plan, train, and launch AI adoption with tailored consulting and workforce upskilling for future-ready intelligent enterprises. Enable scalable automation and sustainable innovation for long-term competitive business advantage.',
    popupContent:
      'Nano Flows AI empowers organizations with AI-focused consulting, comprehensive training programs, and digital transformation guidance designed for the future of work.',
    features: ['AI Readiness Assessment', 'AI Integration Strategy', 'Corporate AI Training', 'Process Automation Guidance'],
    subserviceExplanations: [
      `AI readiness assessments analyze organizational systems and culture to chart the best path for successful AI integration and adoption.`,
      `Integration strategies create customized plans aligning AI tools with business goals to maximize productivity and ROI effectively.`,
      `Corporate AI training develops employee expertise with practical, hands-on courses covering machine learning, data ethics, and AI best practices.`,
      `Process automation guidance focuses on identifying tasks suited for AI-driven automation, improving efficiency and workforce agility.`,
    ],
    image: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExZzFpcGw5YXhsdmduaDBoaXpmaDJ6bWgxcXU5NGl0ZTNhZmphd2QzbCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/LaVp0AyqR5bGsC5Cbm/giphy.gif',
  },
  {
    icon: Wrench,
    title: 'Custom AI Tools & Automation',
    description:
      'Unlock efficiency with bespoke AI products, workflow automation, integrated APIs, and advanced bots. Drive digital transformation across business processes for optimal, scalable results.',
    popupContent:
      'Nano Flows AI engineers intelligent automation ecosystems, robust APIs, smart bots, and machine learning models to reinvent business operations and accelerate growth.',
    features: ['Custom AI Tools', 'Workflow Automation', 'API Integrations', 'Bot Development'],
    subserviceExplanations: [
      `Custom AI tools offer tailored analytics and recommendation systems designed to boost enterprise productivity and uncover actionable insights.`,
      `Workflow automation replaces manual processes with smart AI systems capable of scaling efficiently and saving valuable time for businesses.`,
      `API integrations enable secure, real-time data communication between disparate applications, fostering seamless business ecosystem connectivity.`,
      `Bot development delivers automated customer support and internal communication tools operating continuously to enhance productivity.`,
    ],
    image: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExOHBubGNteDFqYzZhdDVmcWF2d3BjeThsNGprNWk0MTM2bWxxMWFweiZlcD12MV9naWZzX3NlYXJjaCZjdD1n/l0IylSajlbPRFxH8Y/giphy.gif',
  },
];

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth < 640 : false
  );

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return isMobile;
};

const Services = () => {
  const { theme } = useTheme();
  const [showAll, setShowAll] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [selectedSubservice, setSelectedSubservice] = useState<number | null>(null);
  const [warning, setWarning] = useState('');
  const isMobile = useIsMobile();

  const initialCount = 6;
  const displayedServices = showAll ? services : services.slice(0, initialCount);

  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeDot, setActiveDot] = useState(0);
  const totalGroups = 3;

  // Fixed scroll tracking logic for pagination
  useEffect(() => {
    if (!isMobile || !scrollRef.current) return;
    const container = scrollRef.current;

    const onScroll = () => {
      requestAnimationFrame(() => {
        const scrollLeft = container.scrollLeft;
        const maxScroll = container.scrollWidth - container.clientWidth;
        const progress = maxScroll > 0 ? scrollLeft / maxScroll : 0;
        const index = Math.round(progress * (totalGroups - 1));
        setActiveDot(index);
      });
    };

    container.addEventListener('scroll', onScroll);
    return () => container.removeEventListener('scroll', onScroll);
  }, [isMobile]);

  const openPopupAtIndex = (index: number) => {
    setSelectedIndex(index);
    setSelectedSubservice(null);
    setWarning('');
  };

  const closePopup = () => {
    setSelectedIndex(null);
    setSelectedSubservice(null);
    setWarning('');
  };

  const goToPrevious = () => {
    if (selectedIndex === null || selectedIndex === 0) {
      setWarning('');
      return;
    }
    setSelectedIndex(selectedIndex - 1);
    setSelectedSubservice(null);
    setWarning('');
  };

  const goToNext = () => {
    if (selectedIndex === null) return;
    if (selectedIndex === services.length - 1) {
      setWarning('No more services');
    } else {
      setSelectedIndex(selectedIndex + 1);
      setSelectedSubservice(null);
      setWarning('');
    }
  };

  useEffect(() => {
    if (selectedIndex !== null) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedIndex]);

  return (
    <section
      id="services"
      className={`py-24 relative overflow-hidden ${theme === 'dark' ? 'bg-dark-bg' : 'bg-white'}`}
    >
      <div className={`absolute inset-0 ${theme === 'dark' ? 'gradient-mesh' : 'gradient-mesh-light'}`} />
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2
            className={`text-4xl md:text-5xl font-orbitron font-bold mb-4 ${
              theme === 'dark' ? 'text-white' : 'text-black'
            }`}
          >
            Our{' '}
            <span className={theme === 'dark' ? 'text-electric-green' : 'text-accent-red'}>
              Services
            </span>
          </h2>
          <p
            className={`text-lg font-exo max-w-2xl mx-auto ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-800'
            }`}
          >
            Comprehensive solutions designed to drive innovation and accelerate your digital transformation journey
          </p>
        </div>

        {/* Desktop Grid View */}
        {!isMobile && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayedServices.map((service, index) => {
              const Icon = service.icon;
              return (
                <div
                  key={index}
                  className={`group flex flex-col h-full rounded-2xl p-6 transition-transform duration-300 hover:scale-105 hover:-translate-y-2 ${
                    theme === 'dark'
                      ? 'bg-dark-bg/50 border border-electric-blue/20 hover:border-electric-blue/50 hover:glow-blue'
                      : 'bg-gray-50/80 shadow-lg hover:shadow-2xl hover:glow-red'
                  }`}
                >
                  <div
                    className={`w-16 h-16 rounded-xl flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110 ${
                      theme === 'dark'
                        ? 'bg-electric-blue/20 text-electric-blue group-hover:bg-electric-blue group-hover:text-black'
                        : 'bg-accent-red/20 text-accent-red group-hover:bg-accent-red group-hover:text-white'
                    }`}
                  >
                    <Icon size={32} />
                  </div>
                  <h3
                    className={`text-2xl font-orbitron font-bold mb-4 ${
                      theme === 'dark' ? 'text-white' : 'text-black'
                    }`}
                  >
                    {service.title}
                  </h3>
                  <p
                    className={`text-base font-exo mb-6 leading-relaxed flex-grow ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-800'
                    }`}
                  >
                    {service.description}
                  </p>
                  <div className="space-y-2 mb-6">
                    {service.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center space-x-2">
                        <div
                          className={`w-1.5 h-1.5 rounded-full ${
                            theme === 'dark' ? 'bg-electric-green' : 'bg-accent-blue'
                          }`}
                        />
                        <span
                          className={`text-sm font-exo transition-all duration-300 group-hover:font-semibold ${
                            theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
                          }`}
                        >
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => openPopupAtIndex(index)}
                    className={`mt-auto w-full py-3 rounded-lg font-exo font-semibold transition-colors duration-300 ${
                      theme === 'dark'
                        ? 'bg-dark-lighter text-electric-blue border border-electric-blue/30 hover:bg-electric-blue hover:text-black'
                        : 'bg-white text-accent-red border border-accent-red/30 hover:bg-accent-red hover:text-white'
                    }`}
                  >
                    Learn More
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* Mobile Carousel View */}
       {isMobile && (
  <>
    <div
      ref={scrollRef}
      className="flex overflow-x-auto scroll-smooth snap-x snap-mandatory no-scrollbar"
      style={{ touchAction: 'pan-x' }}
    >
      {displayedServices.map((service, index) => {
        const Icon = service.icon;
        return (
          <div
            key={index}
            className={`group service-card snap-center flex-shrink-0 rounded-2xl p-6 max-w-[350px] w-full mx-3 transition-transform duration-300
              ${theme === 'dark' ? 'bg-dark-bg/50 border border-electric-blue/20' : 'bg-gray-50/80 shadow-lg'}`}
          >
                    <div
                      className={`w-16 h-16 rounded-xl flex items-center justify-center mb-6 ${
                        theme === 'dark'
                          ? 'bg-electric-blue/20 text-electric-blue'
                          : 'bg-accent-red/20 text-accent-red'
                      }`}
                    >
                      <Icon size={32} />
                    </div>
                    <h3
                      className={`text-2xl font-orbitron font-bold mb-4 ${
                        theme === 'dark' ? 'text-white' : 'text-black'
                      }`}
                    >
                      {service.title}
                    </h3>
                    <p
                      className={`text-base font-exo mb-6 leading-relaxed ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-800'
                      }`}
                    >
                      {service.description}
                    </p>
                    <div className="space-y-2">
                      {service.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center space-x-2">
                          <div
                            className={`w-1.5 h-1.5 rounded-full ${
                              theme === 'dark' ? 'bg-electric-green' : 'bg-accent-blue'
                            }`}
                          />
                          <span
                            className={`text-sm font-exo transition-all duration-300 group-hover:font-semibold ${
                              theme === 'dark' ? 'text-gray-200' : 'text-gray-900'
                            }`}
                          >
                            {feature}
                          </span>
                        </div>
                      ))}
                    </div>
                    <button
                    onClick={() => openPopupAtIndex(index)}
                    className={`mt-6 w-full py-3 rounded-lg font-exo font-semibold transition-colors duration-300 ${
                      theme === 'dark'
                        ? 'bg-dark-lighter text-electric-blue border border-electric-blue/30 hover:bg-electric-blue hover:text-black'
                        : 'bg-white text-accent-red border border-accent-red/30 hover:bg-accent-red hover:text-white'
                    }`}
                  >
                    Learn More
                  </button>
                  </div>
                );
              })}
            </div>

            {/* Fixed Pagination */}
            <div className="flex items-center justify-center mt-5 space-x-2">
              {[...Array(totalGroups)].map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    if (!scrollRef.current) return;
                    const container = scrollRef.current;
                    const maxScroll = container.scrollWidth - container.clientWidth;
                    const scrollTo = (idx / (totalGroups - 1)) * maxScroll;
                    container.scrollTo({ left: scrollTo, behavior: 'smooth' });
                  }}
                  className={`transition-all duration-300 rounded-full ${
                    activeDot === idx
                      ? theme === 'dark'
                        ? 'bg-electric-green w-5 h-3'
                        : 'bg-accent-red w-5 h-3'
                      : theme === 'dark'
                      ? 'bg-gray-600 w-3 h-3'
                      : 'bg-gray-300 w-3 h-3'
                  }`}
                  aria-label={`Go to section ${idx + 1}`}
                />
              ))}
            </div>
          </>
        )}

        {/* View More Button - only show on non-mobile */}
        {!isMobile && (
          <div className="mt-16 text-center">
            <button
              onClick={() => {
                if (showAll) {
                  setShowAll(false);
                  setTimeout(() => {
                    const element = document.getElementById('services');
                    element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }, 100);
                } else {
                  setShowAll(true);
                }
              }}
              className={`px-8 py-4 rounded-full font-exo font-semibold text-lg transition-all duration-300 hover:scale-105 ${
                theme === 'dark'
                  ? 'bg-electric-green text-black hover:glow-green'
                  : 'bg-accent-red text-white hover:glow-red'
              }`}
            >
              {showAll ? 'View Less Services' : 'View All Services'}
            </button>
          </div>
        )}
      </div>

      {/* Pop-up Modal */}
      <AnimatePresence>
        {selectedIndex !== null && (
          <motion.div
            key={selectedIndex}
            className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4 sm:p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className={`relative w-full max-w-[1400px] mx-auto p-8 rounded-none shadow-2xl overflow-hidden ${
                theme === 'dark' ? 'bg-dark-card text-white' : 'bg-white text-black'
              }`}
              initial={{ scale: 0.8, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 30 }}
              transition={{ duration: 0.3 }}
            >
              <button
                onClick={closePopup}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-dark-lighter"
              >
                <X size={22} />
              </button>

              {isMobile ? (
                <>
                  <img
                    src={services[selectedIndex].image}
                    alt={services[selectedIndex].title}
                    className="w-full h-auto max-h-[450px] object-contain rounded-md mb-8"
                  />
                  <h3 className="text-3xl font-orbitron font-bold mb-4 text-center">
                    {services[selectedIndex].title}
                  </h3>
                  <p
                    className={`text-base font-exo mb-6 text-center ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-800'
                    }`}
                  >
                    {selectedSubservice !== null
                      ? services[selectedIndex].subserviceExplanations[selectedSubservice]
                      : services[selectedIndex].popupContent}
                  </p>
                  <div className="grid grid-cols-1 gap-2">
                    {services[selectedIndex].features.map((feature, idx) => (
                      <motion.button
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className={`text-sm font-exo px-3 py-2 rounded-md border cursor-pointer ${
                          selectedSubservice === idx
                            ? theme === 'dark'
                              ? 'bg-electric-blue text-black border-electric-blue/60'
                              : 'bg-accent-red text-white border-accent-red/60'
                            : theme === 'dark'
                            ? 'border-electric-blue/30 text-electric-blue'
                            : 'border-accent-red/30 text-accent-red'
                        }`}
                        onClick={() =>
                          setSelectedSubservice(selectedSubservice === idx ? null : idx)
                        }
                      >
                        {feature}
                      </motion.button>
                    ))}
                  </div>
                  <div className="mt-8 flex justify-center space-x-4">
                    <button
                      onClick={goToPrevious}
                      disabled={selectedIndex === 0}
                      className={`px-6 py-2 rounded-full font-exo font-semibold ${
                        theme === 'dark'
                          ? selectedIndex === 0
                            ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                            : 'bg-electric-blue text-black hover:bg-electric-green hover:glow-green'
                          : selectedIndex === 0
                          ? 'bg-gray-300 text-gray-400 cursor-not-allowed'
                          : 'bg-accent-red text-white hover:bg-accent-red/90'
                      }`}
                    >
                      Previous
                    </button>
                    <button
                      onClick={goToNext}
                      className={`px-6 py-2 rounded-full font-exo font-semibold ${
                        theme === 'dark'
                          ? 'bg-electric-blue text-black hover:bg-electric-green hover:glow-green'
                          : 'bg-accent-red text-white hover:bg-accent-red/90'
                      }`}
                    >
                      Next
                    </button>
                  </div>
                  {warning && (
                    <p
                      className={`mt-4 text-center font-exo font-semibold ${
                        theme === 'dark' ? 'text-electric-green' : 'text-accent-red'
                      }`}
                    >
                      {warning}
                    </p>
                  )}
                </>
              ) : (
                <>
                  <div className="flex flex-row items-start gap-8">
                    <img
                      src={services[selectedIndex].image}
                      alt={services[selectedIndex].title}
                      className="w-1/3 h-auto max-h-[450px] object-contain rounded-md"
                    />
                    <div className="w-2/3 min-h-[450px] flex flex-col justify-center">
                      <h3 className="text-3xl font-orbitron font-bold mb-4">
                        {services[selectedIndex].title}
                      </h3>
                      <p
                        className={`text-base font-exo mb-6 ${
                          theme === 'dark' ? 'text-gray-300' : 'text-gray-800'
                        }`}
                      >
                        {selectedSubservice !== null
                          ? services[selectedIndex].subserviceExplanations[selectedSubservice]
                          : services[selectedIndex].popupContent}
                      </p>
                      <div className="grid grid-cols-2 gap-2">
                        {services[selectedIndex].features.map((feature, idx) => (
                          <motion.button
                            key={idx}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className={`text-sm font-exo px-3 py-2 rounded-md border cursor-pointer ${
                              selectedSubservice === idx
                                ? theme === 'dark'
                                  ? 'bg-electric-blue text-black border-electric-blue/60'
                                  : 'bg-accent-red text-white border-accent-red/60'
                                : theme === 'dark'
                                ? 'border-electric-blue/30 text-electric-blue'
                                : 'border-accent-red/30 text-accent-red'
                            }`}
                            onClick={() =>
                              setSelectedSubservice(selectedSubservice === idx ? null : idx)
                            }
                          >
                            {feature}
                          </motion.button>
                        ))}
                      </div>
                      <div className="mt-8 flex justify-start space-x-4">
                        <button
                          onClick={goToPrevious}
                          disabled={selectedIndex === 0}
                          className={`px-6 py-2 rounded-full font-exo font-semibold ${
                            theme === 'dark'
                              ? selectedIndex === 0
                                ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                                : 'bg-electric-blue text-black hover:bg-electric-green hover:glow-green'
                              : selectedIndex === 0
                              ? 'bg-gray-300 text-gray-400 cursor-not-allowed'
                              : 'bg-accent-red text-white hover:bg-accent-red/90'
                          }`}
                        >
                          Previous
                        </button>
                        <button
                          onClick={goToNext}
                          className={`px-6 py-2 rounded-full font-exo font-semibold ${
                            theme === 'dark'
                              ? 'bg-electric-blue text-black hover:bg-electric-green hover:glow-green'
                              : 'bg-accent-red text-white hover:bg-accent-red/90'
                          }`}
                        >
                          Next
                        </button>
                      </div>
                      {warning && (
                        <p
                          className={`mt-4 font-exo font-semibold ${
                            theme === 'dark' ? 'text-electric-green' : 'text-accent-red'
                          }`}
                        >
                          {warning}
                        </p>
                      )}
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Services;
