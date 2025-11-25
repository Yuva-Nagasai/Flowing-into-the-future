import { useState, useEffect } from 'react';
import { Target, Users, Rocket, TrendingUp, ExternalLink, Handshake, Building2, Briefcase, Globe, Cloud, Database, Zap, Cpu, Code, Brain, Shield, LucideIcon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { aboutAPI } from '../utils/api.js';

type CompanyLogoType = {
  name: string;
  logo: string;
  industry: string;
  icon: LucideIcon;
};

type SectionImage = {
  url: string;
  title?: string;
  description?: string;
  name?: string;
  role?: string;
  portfolio?: string;
};

type SectionData = {
  icon_name?: string;
  section_type?: string;
  title?: string;
  content?: string;
  images?: Array<{
    image_url?: string;
    url?: string;
    title?: string;
    description?: string;
  }>;
  team_members?: Array<{
    image_url?: string;
    url?: string;
    name?: string;
    role?: string;
    portfolio_url?: string;
    portfolio?: string;
  }>;
  company_logos?: Array<{
    icon_name?: string;
    company_name?: string;
    name?: string;
    logo_url?: string;
    logo?: string;
    industry?: string;
  }>;
};

type TransformedSection = {
  icon: LucideIcon;
  title: string;
  content: string;
  images: SectionImage[] | CompanyLogoType[];
  type: string;
};

const CompanyLogo = ({ company, theme }: { company: CompanyLogoType, theme: 'dark' | 'light' }) => {
  const [imageError, setImageError] = useState(false);
  const IconComponent = company.icon;

  return (
    <div className={`w-20 h-20 sm:w-24 sm:h-24 mb-3 rounded-lg flex items-center justify-center transition-all duration-300 ${
      theme === 'dark' ? 'bg-dark-card' : 'bg-gray-50'
    } group-hover:bg-opacity-80 relative`}>
      {!imageError ? (
        <img
          src={company.logo}
          alt={company.name}
          className="w-full h-full object-contain p-2 filter grayscale group-hover:grayscale-0 transition-all duration-300"
          loading="lazy"
          onError={() => setImageError(true)}
        />
      ) : (
        <IconComponent
          className={`w-10 h-10 sm:w-12 sm:h-12 transition-all duration-300 ${
            theme === 'dark'
              ? 'text-electric-blue group-hover:text-electric-green'
              : 'text-accent-red group-hover:text-red-600'
          }`}
        />
      )}
    </div>
  );
};

const About = () => {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState(0);
  const [sections, setSections] = useState<TransformedSection[]>([]);
  const [loading, setLoading] = useState(true);
  const fallbackSections: TransformedSection[] = [
    {
      icon: Target,
      title: 'Our Mission',
      content:
        'We design AI-native experiences that help universities, enterprises, and fast-growing teams reimagine how they learn, operate, and collaborate. Every engagement blends rigorous research, ethical AI practices, and measurable business outcomes.',
      images: [
        {
          url: '/image1.png',
          title: 'Responsible AI Labs',
          description: 'Building explainable, bias-tested learning copilots.'
        },
        {
          url: '/image4.png',
          title: 'Immersive Onboarding',
          description: 'Adaptive journeys that personalize every learner touchpoint.'
        }
      ],
      type: 'mission'
    },
    {
      icon: Users,
      title: 'Our Team',
      content:
        'A 200+ person collective of learning scientists, cloud architects, storytellers, and data engineers distributed across four continents and united by an obsession with elegant problem solving.',
      images: [
        {
          url: 'https://images.unsplash.com/photo-1544723795-3fb6469f5b39',
          name: 'Maya Patel',
          role: 'Chief AI Scientist',
          portfolio: 'https://www.linkedin.com'
        },
        {
          url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1',
          name: 'Lucas Wright',
          role: 'VP, Learning Experience',
          portfolio: 'https://www.behance.net'
        },
        {
          url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2',
          name: 'Jiwoo Han',
          role: 'Head of Platform Engineering',
          portfolio: 'https://github.com'
        }
      ],
      type: 'team'
    },
    {
      icon: Rocket,
      title: 'Our Vision',
      content:
        'To become the most trusted partner for lifelong learning, where every learner has a personalized mentor and every organization can prove the ROI of its knowledge investments.',
      images: [
        {
          url: '/image7.png',
          title: 'NanoFlows Campus',
          description: 'Always-on simulations that mirror the real workplace.'
        },
        {
          url: '/image6.png',
          title: 'Autonomous Delivery',
          description: 'Pipelines that turn research into shipped features weekly.'
        }
      ],
      type: 'vision'
    },
    {
      icon: TrendingUp,
      title: 'Our Growth',
      content:
        'What started as a 5-person studio in 2018 now powers 60+ enterprise academies, 1.4M monthly learners, and a partner network across EdTech, finance, manufacturing, and healthcare.',
      images: [
        {
          url: '/image3.png',
          title: 'Global Delivery Pods',
          description: 'Follow-the-sun execution with pods in Austin, London, and Bengaluru.'
        },
        {
          url: '/image5.png',
          title: 'Impact Dashboards',
          description: 'Live ROI reporting that correlates talent, revenue, and retention.'
        }
      ],
      type: 'growth'
    },
    {
      icon: Handshake,
      title: 'Our Clients',
      content:
        'We co-create with future-facing universities, unicorns, and Fortune 500 teams that treat learning as a competitive advantage.',
      images: [
        {
          name: 'Apex Motors',
          logo: '/case1.jpg',
          industry: 'Autonomous Mobility',
          icon: Building2
        },
        {
          name: 'Helix Bank',
          logo: '/case4.jpg',
          industry: 'FinTech Infrastructure',
          icon: Briefcase
        },
        {
          name: 'Northstar Health',
          logo: '/case6.jpg',
          industry: 'Healthcare AI',
          icon: Shield
        },
        {
          name: 'Orbital University',
          logo: '/case3.jpg',
          industry: 'Higher Education',
          icon: Globe
        }
      ],
      type: 'clients'
    }
  ];

  // Icon mapping
  const iconMap: { [key: string]: LucideIcon } = {
    Target,
    Users,
    Rocket,
    TrendingUp,
    Handshake
  };

  // Fallback icon mapping for company logos
  const logoIconMap: { [key: string]: LucideIcon } = {
    Building2, Briefcase, Globe, Cloud, Database, Zap, Cpu, Code, Brain, Shield
  };

  useEffect(() => {
    fetchSections();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchSections = async () => {
    try {
      const response = await aboutAPI.getAll();
      const fetchedSections = response.data.sections || [];
      
      // Transform sections to match the expected format
      const transformedSections = fetchedSections.map((section: SectionData): TransformedSection => {
        const iconName = section.icon_name || 
          (section.section_type === 'mission' ? 'Target' :
           section.section_type === 'team' ? 'Users' :
           section.section_type === 'vision' ? 'Rocket' :
           section.section_type === 'growth' ? 'TrendingUp' :
           section.section_type === 'clients' ? 'Handshake' : 'Target');
        
        const Icon = iconMap[iconName] || Target;
        
        // Transform images
        let images: SectionImage[] = [];
        if (section.images && section.images.length > 0) {
          images = section.images.map((img) => ({
            url: img.image_url || img.url || '',
            title: img.title || '',
            description: img.description || ''
          }));
        }
        
        // Transform team members
        if (section.section_type === 'team' && section.team_members) {
          images = section.team_members.map((member) => ({
            url: member.image_url || member.url || '',
            name: member.name || '',
            role: member.role || '',
            portfolio: member.portfolio_url || member.portfolio || '#'
          }));
        }
        
        // Transform company logos
        if (section.section_type === 'clients' && section.company_logos) {
          images = section.company_logos.map((logo): CompanyLogoType => {
            const iconName = logo.icon_name || 'Building2';
            const Icon = logoIconMap[iconName] || Building2;
            return {
              name: logo.company_name || logo.name || '',
              logo: logo.logo_url || logo.logo || '',
              industry: logo.industry || '',
              icon: Icon
            };
          });
        }
        
        return {
          icon: Icon,
          title: section.title || '',
          content: section.content || '',
          images: images,
          type: section.section_type
        };
      });
      
      // Ensure we have all 5 sections, use defaults if missing
      const sectionTypes = ['mission', 'team', 'vision', 'growth', 'clients'];
      const finalSections = sectionTypes.map(type => {
        const found = transformedSections.find((s) => s.type === type);
        return found || fallbackSections.find(s => s.type === type)!;
      });
      
      setSections(finalSections);
    } catch (error) {
      console.error('Error fetching about sections:', error);
      // Use fallback sections on error
      setSections(fallbackSections);
    } finally {
      setLoading(false);
    }
  };

  const tabs = sections;

  return (
    <section
      id="about"
      className={`py-12 sm:py-16 md:py-20 lg:py-24 relative overflow-hidden w-full min-h-[400px] sm:min-h-[500px] ${
        theme === 'dark' ? 'bg-dark-bg' : 'bg-gray-50'
      }`}
    >
      <div
        className={`absolute inset-0 ${
          theme === 'dark' ? 'gradient-mesh' : 'gradient-mesh-light'
        }`}
        aria-hidden="true"
      />

      <div className="container mx-auto px-4 sm:px-6 relative z-10 w-full">
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <h2
            className={`text-3xl sm:text-4xl md:text-5xl font-orbitron font-bold mb-4 ${
              theme === 'dark' ? 'text-white' : 'text-black'
            }`}
          >
            About{' '}
            <span className={theme === 'dark' ? 'text-electric-green' : 'text-accent-red'}>
              Nano Flows
            </span>
          </h2>
          <p
            className={`text-base sm:text-lg font-exo max-w-2xl mx-auto ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-800'
            }`}
          >
            Pioneering the future of digital innovation through AI-powered solutions and seamless
            user experiences
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 md:gap-12 items-center mb-8 sm:mb-12 md:mb-16">
          <div
            className={`rounded-2xl p-6 sm:p-8 transition-all duration-500 hover:scale-105 ${
              theme === 'dark'
                ? 'bg-dark-card/50 border border-electric-blue/20'
                : 'bg-white/80 shadow-xl'
            }`}
          >
            <div className="relative h-48 sm:h-64 rounded-xl overflow-hidden">
              <div className={`w-full h-full ${
                theme === 'dark' 
                  ? 'bg-gradient-to-br from-electric-blue/20 via-electric-green/10 to-dark-bg' 
                  : 'bg-gradient-to-br from-accent-blue/20 via-accent-red/10 to-gray-100'
              } flex flex-col items-center justify-center p-6`}>
                <div className={`text-5xl sm:text-6xl mb-4 ${
                  theme === 'dark' ? 'text-electric-blue/40' : 'text-accent-red/40'
                }`}>
                  🤖
                </div>
                <h4 className={`font-orbitron font-bold text-xl sm:text-2xl text-center mb-2 ${
                  theme === 'dark' ? 'text-white' : 'text-black'
                }`}>
                  AI-Powered Solutions
                </h4>
                <p className={`text-sm sm:text-base text-center ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-800'
                }`}>
                  Transforming businesses through intelligent innovation
                </p>
              </div>
            </div>
          </div>

          <div>
            <h3
              className={`text-2xl sm:text-3xl font-orbitron font-bold mb-4 sm:mb-6 ${
                theme === 'dark' ? 'text-electric-green' : 'text-accent-red'
              }`}
            >
              Transforming Ideas Into Reality
            </h3>
            <p
              className={`text-sm sm:text-base font-exo mb-4 leading-relaxed ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-800'
              }`}
            >
              Founded on the principle that technology should flow seamlessly with business needs,
              Nano Flows has become a trusted partner for organizations seeking to harness the
              power of AI and digital innovation.
            </p>
            <p
              className={`text-sm sm:text-base font-exo mb-6 leading-relaxed ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-800'
              }`}
            >
              Our approach combines cutting-edge technology with human-centered design, ensuring
              every solution we create is both powerful and intuitive. We don't just build products;
              we craft experiences that evolve with your business.
            </p>

            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {[
                { label: 'Founded', value: '2018' },
                { label: 'Team Size', value: '200+' },
                { label: 'Projects', value: '1000+' },
                { label: 'Awards', value: '25+' },
              ].map((item, index) => (
                <div
                  key={index}
                  className={`p-3 sm:p-4 rounded-lg text-center transition-all duration-300 hover:scale-105 ${
                    theme === 'dark'
                      ? 'bg-dark-lighter border border-electric-blue/20'
                      : 'bg-gray-100'
                  }`}
                >
                  <div
                    className={`text-xl sm:text-2xl font-orbitron font-bold mb-1 ${
                      theme === 'dark' ? 'text-electric-blue' : 'text-accent-blue'
                    }`}
                  >
                    {item.value}
                  </div>
                  <div
                    className={`text-xs sm:text-sm font-exo ${
                      theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
                    }`}
                  >
                    {item.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div
          className={`rounded-2xl p-4 sm:p-6 md:p-8 w-full ${
            theme === 'dark'
              ? 'bg-dark-card/50 border border-electric-blue/20'
              : 'bg-white/80 shadow-xl'
          }`}
        >
          <nav className="flex flex-wrap gap-2 sm:gap-3 md:gap-4 mb-4 sm:mb-6 md:mb-8 justify-center" role="tablist">
            {tabs.map((tab, index) => {
              const Icon = tab.icon;
              return (
                <button
                  key={index}
                  onClick={() => setActiveTab(index)}
                  role="tab"
                  aria-selected={activeTab === index}
                  aria-controls={`tabpanel-${index}`}
                  className={`flex items-center space-x-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-full font-exo font-semibold text-sm sm:text-base transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                    activeTab === index
                      ? theme === 'dark'
                        ? 'bg-electric-blue text-black glow-blue scale-105 focus:ring-electric-blue'
                        : 'bg-accent-red text-white glow-red scale-105 focus:ring-accent-red'
                      : theme === 'dark'
                      ? 'bg-dark-lighter text-gray-300 hover:bg-dark-bg focus:ring-electric-blue/50'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200 focus:ring-accent-red/50'
                  }`}
                >
                  <Icon size={18} aria-hidden="true" />
                  <span className="hidden sm:inline">{tab.title}</span>
                  <span className="sm:hidden">{tab.title.split(' ')[1] || tab.title.split(' ')[0]}</span>
                </button>
              );
            })}
          </nav>

          <div 
            id={`tabpanel-${activeTab}`}
            role="tabpanel"
            aria-labelledby={`tab-${activeTab}`}
            className="max-w-5xl mx-auto w-full"
          >
            {loading ? (
              <div className="text-center py-8 min-h-[200px] flex items-center justify-center">
                <div className={`inline-block animate-spin rounded-full h-8 w-8 border-4 border-t-transparent ${
                  theme === 'dark' ? 'border-electric-blue' : 'border-accent-red'
                }`}></div>
              </div>
            ) : (
              <>
                {tabs[activeTab] && tabs.length > 0 ? (
                  <>
                    <p
                      className={`text-sm sm:text-base md:text-lg font-exo leading-relaxed mb-6 sm:mb-8 text-center px-2 ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-800'
                      }`}
                    >
                      {tabs[activeTab].content}
                    </p>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <p className={`text-base ${theme === 'dark' ? 'text-gray-400' : 'text-gray-900'}`}>
                      No content available
                    </p>
                  </div>
                )}

            {/* Scrolling Images Section */}
            <div className="relative w-full overflow-hidden">
              {tabs[activeTab]?.type === 'clients' ? (
                // Company logos scrolling - duplicated for seamless loop
                <div className="overflow-x-auto pb-4 scrollbar-hide scroll-container w-full">
                <div className="flex gap-3 sm:gap-4 md:gap-6 animate-scroll">
                    {[...(tabs[activeTab]?.images || []), ...(tabs[activeTab]?.images || [])].map((company: CompanyLogoType, idx: number) => (
                      <div
                        key={idx}
                        className={`group relative w-56 sm:w-64 flex-shrink-0 rounded-xl overflow-hidden transition-all duration-300 hover:scale-105 ${
                          theme === 'dark' ? 'bg-dark-lighter' : 'bg-white shadow-lg'
                        }`}
                      >
                        <div className="p-6 flex flex-col items-center justify-center">
                          <CompanyLogo company={company} theme={theme} />
                          <h4 className={`font-orbitron font-bold text-base text-center mb-1 ${
                            theme === 'dark' ? 'text-white' : 'text-gray-900'
                          }`}>
                            {company.name}
                          </h4>
                          <p className={`text-xs text-center ${
                            theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
                          }`}>
                            {company.industry}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : tabs[activeTab]?.type === 'team' ? (
                    // Team members with portfolio links - duplicated for seamless loop
                <div className="overflow-x-auto pb-4 scrollbar-hide scroll-container w-full">
                  <div className="flex gap-3 sm:gap-4 md:gap-6 animate-scroll">
                    {[...(tabs[activeTab]?.images || []), ...(tabs[activeTab]?.images || [])].map((member: SectionImage, idx: number) => (
                      <div
                        key={idx}
                        className={`relative group w-48 sm:w-56 rounded-xl overflow-hidden transition-all duration-300 hover:scale-105 ${
                          theme === 'dark' ? 'bg-dark-lighter' : 'bg-white shadow-lg'
                        }`}
                      >
                        <div className="aspect-square overflow-hidden">
                          <img
                            src={member.url}
                            alt={member.name}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            loading="lazy"
                          />
                        </div>
                        <div className={`p-3 sm:p-4 ${theme === 'dark' ? 'bg-dark-card' : 'bg-white'}`}>
                          <h4 className={`font-orbitron font-bold text-base sm:text-lg mb-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                            {member.name}
                          </h4>
                          <p className={`text-xs sm:text-sm mb-2 sm:mb-3 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                            {member.role}
                          </p>
                          <a
                            href={member.portfolio}
                            className={`inline-flex items-center gap-2 text-xs sm:text-sm font-semibold transition-colors ${
                              theme === 'dark' ? 'text-electric-blue hover:text-electric-green' : 'text-accent-red hover:text-red-700'
                            }`}
                          >
                            View Portfolio <ExternalLink size={12} />
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                  ) : (
                    // Regular images with titles and descriptions - duplicated for seamless loop
                <div className="overflow-x-auto pb-4 scrollbar-hide scroll-container w-full">
                  <div className="flex gap-3 sm:gap-4 md:gap-6 animate-scroll">
                    {[...(tabs[activeTab]?.images || []), ...(tabs[activeTab]?.images || [])].map((img: SectionImage, idx: number) => (
                      <div
                        key={idx}
                        className={`relative group w-72 sm:w-80 flex-shrink-0 rounded-xl overflow-hidden transition-all duration-300 hover:scale-105 ${
                          theme === 'dark' ? 'bg-dark-lighter' : 'bg-white shadow-lg'
                        }`}
                      >
                        <div className="aspect-video overflow-hidden">
                          <img
                            src={img.url}
                            alt={img.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            loading="lazy"
                          />
                        </div>
                        <div className={`absolute inset-0 bg-gradient-to-t ${
                          theme === 'dark' ? 'from-black/90 via-black/50 to-transparent' : 'from-black/80 via-black/40 to-transparent'
                        } opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6`}>
                          <h4 className="text-white font-orbitron font-bold text-xl mb-2">
                            {img.title}
                          </h4>
                          <p className="text-gray-200 text-sm">
                            {img.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
