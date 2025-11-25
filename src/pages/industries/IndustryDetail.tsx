import { ElementType, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  Activity,
  ArrowRight,
  Atom,
  BadgeCheck,
  BadgeDollarSign,
  BarChart3,
  Brain,
  Building2,
  CalendarCheck,
  Car,
  CheckCircle2,
  ChevronRight,
  Cloud,
  CloudCog,
  CloudRain,
  Coins,
  Coffee,
  CreditCard,
  FileCode,
  FileCheck,
  Figma,
  Fish,
  Flame,
  FlaskConical,
  Gauge,
  Gem,
  Gift,
  Globe,
  Handshake,
  Heart,
  Infinity,
  KanbanSquare,
  Layers,
  Layers3,
  Leaf,
  Link2,
  Map,
  MessageCircle,
  Network,
  NotebookPen,
  Package,
  PhoneCall,
  RefreshCcw,
  Recycle,
  Rocket,
  Route,
  Rows3,
  Scale,
  Server,
  Shield,
  Settings,
  Snowflake,
  Sparkles,
  StickyNote,
  Stethoscope,
  Target,
  TrendingUp,
  Tv,
  Wifi,
  Users,
  Utensils,
  Wind,
  Zap,
} from 'lucide-react';
import { motion } from 'framer-motion';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useTheme } from '../../context/ThemeContext';
import { getIndustryBySlug } from '../../data/industries';
import {
  sectionContainerVariants,
  staggeredVariants,
  itemVariants,
  scaleHoverVariants,
  glowPulseAnimation,
  viewportConfig
} from '../../utils/motionPresets';

const iconMap: Record<string, ElementType> = {
  Users,
  Rocket,
  Shuffle: RefreshCcw,
  BadgeDollarSign,
  Layers,
  Shield,
  Heart,
  Globe,
  Flask: FlaskConical,
  Sparkles,
  Map,
  Settings,
  RefreshCcw,
  Route,
  Handshake,
  BookOpen: Layers3,
  Wifi,
  TrendingUp,
  Activity,
  Tv,
  CreditCard,
  Gauge,
  Utensils,
  Gift,
  Zap,
  CalendarCheck,
  Coins,
  Stethoscope,
  FileCheck,
  Link: Link2,
  Cpu: Gauge,
  Target,
  Recycle,
  Car,
  Scale,
  MessageCircle,
};

const techItemIcons: Record<string, ElementType> = {
  React: Atom,
  TypeScript: FileCode,
  Vue: Leaf,
  'Next.js': Globe,
  TailwindCSS: Wind,
  'Node.js': Server,
  Python: Infinity,
  Go: Fish,
  Java: Coffee,
  'Ruby on Rails': Gem,
  AWS: CloudCog,
  Azure: CloudRain,
  GCP: Cloud,
  Kubernetes: Network,
  Terraform: Layers,
  TensorFlow: Brain,
  PyTorch: Flame,
  dbt: Package,
  Snowflake: Snowflake,
  PowerBI: BarChart3,
  Figma: Figma,
  Jira: KanbanSquare,
  Notion: NotebookPen,
  Linear: Rows3,
  Miro: StickyNote,
};

const IndustryDetail = () => {
  const { theme } = useTheme();
  const { slug } = useParams();
  const navigate = useNavigate();
  const industry = getIndustryBySlug(slug);

  const headingColor = theme === 'dark' ? 'text-white' : 'text-black';
  const subheadingColor = theme === 'dark' ? 'text-gray-200' : 'text-gray-700';
  const bodyColor = theme === 'dark' ? 'text-gray-300' : 'text-gray-600';
  const kickerTextClass = `text-xs uppercase tracking-[0.2em] font-semibold ${
    theme === 'dark' ? 'text-electric-blue/80' : 'text-accent-red/80'
  }`;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  useEffect(() => {
    if (!industry) {
      navigate('/services', { replace: true });
    }
  }, [industry, navigate]);

  if (!industry) {
    return null;
  }

  const { presentation } = industry;
  const { accent, darkAccent, heroStyle, servicesStyle, highlightStyle, solutionsStyle } =
    presentation;

  // Use darkAccent colors in dark mode if available, otherwise fall back to accent
  const palette = theme === 'dark' && darkAccent ? darkAccent : accent;

  // Helper function to generate industry-specific decorative elements
  const getIndustryDecoration = () => {
    const decorations: Record<string, JSX.Element> = {
      'agritech-application-development': (
        <>
          <div className="absolute top-20 right-10 w-32 h-32 rounded-full opacity-10 blur-2xl" 
               style={{ background: `radial-gradient(circle, ${palette.secondary}, transparent)` }} />
          <div className="absolute bottom-40 left-20 w-24 h-24 rounded-full opacity-10 blur-2xl" 
               style={{ background: `radial-gradient(circle, ${palette.primary}, transparent)` }} />
        </>
      ),
      'dating-app-development': (
        <>
          <div className="absolute top-32 left-16 w-40 h-40 rounded-full opacity-15 blur-3xl" 
               style={{ background: `radial-gradient(circle, ${palette.primary}, transparent)` }} />
          <div className="absolute bottom-20 right-16 w-36 h-36 rounded-full opacity-15 blur-3xl" 
               style={{ background: `radial-gradient(circle, ${palette.secondary}, transparent)` }} />
        </>
      ),
      'healthtech-app-development': (
        <>
          <div className="absolute top-24 right-24 w-28 h-28 rounded-full opacity-12 blur-2xl" 
               style={{ background: `radial-gradient(circle, ${palette.primary}, transparent)` }} />
          <div className="absolute bottom-32 left-12 w-32 h-32 rounded-full opacity-12 blur-2xl" 
               style={{ background: `radial-gradient(circle, ${palette.secondary}, transparent)` }} />
        </>
      ),
      'ecommerce-app-development': (
        <>
          <div className="absolute top-16 right-32 w-36 h-36 rounded-full opacity-15 blur-3xl" 
               style={{ background: `radial-gradient(circle, ${palette.primary}, transparent)` }} />
          <div className="absolute bottom-24 left-16 w-40 h-40 rounded-full opacity-15 blur-3xl" 
               style={{ background: `radial-gradient(circle, ${palette.secondary}, transparent)` }} />
        </>
      ),
      'gaming-app-development': (
        <>
          <div className="absolute top-12 left-24 w-44 h-44 rounded-full opacity-20 blur-3xl" 
               style={{ background: `radial-gradient(circle, ${palette.primary}, transparent)` }} />
          <div className="absolute bottom-16 right-20 w-40 h-40 rounded-full opacity-20 blur-3xl" 
               style={{ background: `radial-gradient(circle, ${palette.secondary}, transparent)` }} />
        </>
      ),
      'fitnesstech-app-development': (
        <>
          <div className="absolute top-28 right-16 w-32 h-32 rounded-full opacity-12 blur-2xl" 
               style={{ background: `radial-gradient(circle, ${palette.primary}, transparent)` }} />
          <div className="absolute bottom-28 left-24 w-36 h-36 rounded-full opacity-12 blur-2xl" 
               style={{ background: `radial-gradient(circle, ${palette.secondary}, transparent)` }} />
        </>
      ),
      'financial-services-software-solutions': (
        <>
          <div className="absolute top-20 left-20 w-32 h-32 rounded-full opacity-10 blur-2xl" 
               style={{ background: `radial-gradient(circle, ${palette.primary}, transparent)` }} />
          <div className="absolute bottom-20 right-20 w-32 h-32 rounded-full opacity-10 blur-2xl" 
               style={{ background: `radial-gradient(circle, ${palette.secondary}, transparent)` }} />
        </>
      ),
    };
    return decorations[slug || ''] || null;
  };

  const heroGradientStyle = {
    backgroundImage: `linear-gradient(135deg, ${accent.gradient[0]}, ${accent.gradient[1]}, ${accent.gradient[2]})`,
  };

  const darkModeGradientStyle = {
    backgroundImage: `linear-gradient(135deg, rgba(15, 23, 42, 0.98), rgba(30, 41, 59, 0.95), rgba(15, 23, 42, 0.98))`,
  };

  const heroBullets = (alignCenter = false) => (
    <motion.ul
      variants={staggeredVariants}
      className={`mt-6 space-y-3 ${alignCenter ? 'max-w-2xl mx-auto' : ''}`}
    >
      {industry.hero.bullets.map((item) => (
        <motion.li
          key={item}
          variants={itemVariants}
          className={`flex items-center gap-3 text-base ${
            alignCenter ? 'justify-center text-center' : ''
          }`}
        >
          <CheckCircle2
            className={theme === 'dark' ? 'text-electric-green' : 'text-accent-red'}
            size={20}
          />
          <span className={theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}>
            {item}
          </span>
        </motion.li>
      ))}
    </motion.ul>
  );

  const heroActions = (alignCenter = false) => (
    <motion.div
      variants={staggeredVariants}
      className={`mt-8 flex flex-wrap gap-4 ${alignCenter ? 'justify-center' : ''}`}
    >
      <motion.a
        variants={itemVariants}
        whileHover={{ scale: 1.05, boxShadow: `0 20px 50px ${palette.primary}40` }}
        whileTap={{ scale: 0.96 }}
        href={industry.hero.primaryCta.href}
        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold shadow-lg transition-all"
        style={{
          backgroundColor: palette.primary,
          color: theme === 'dark' ? '#0f172a' : '#ffffff',
          boxShadow:
            theme === 'dark'
              ? `0 0 25px ${palette.primary}40`
              : `0 15px 40px ${palette.primary}33`,
        }}
      >
        <PhoneCall size={18} />
        {industry.hero.primaryCta.label}
      </motion.a>
      <motion.a
        variants={itemVariants}
        whileHover={{
          scale: 1.03,
          color: theme === 'dark' ? palette.primary : palette.secondary,
        }}
        whileTap={{ scale: 0.97 }}
        href={industry.hero.secondaryCta.href}
        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold border transition-all"
        style={{
          borderColor: palette.secondary,
          color: theme === 'dark' ? '#fff' : palette.secondary,
        }}
      >
        {industry.hero.secondaryCta.label} <ArrowRight size={18} />
      </motion.a>
    </motion.div>
  );

  const heroBadges = (alignCenter = false) => (
    <motion.div
      variants={staggeredVariants}
      className={`mt-8 flex flex-wrap gap-4 ${alignCenter ? 'justify-center' : 'items-center'}`}
    >
      {industry.hero.partnerBadges.map((badge, index) => (
        <motion.span
          key={badge}
          variants={itemVariants}
          whileHover={{ scale: 1.05 }}
          transition={{ delay: index * 0.05 }}
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide px-4 py-2 rounded-full"
          style={
            theme === 'dark'
              ? {
                  backgroundColor: palette.muted,
                  border: `1px solid ${palette.primary}40`,
                  color: palette.primary,
                }
              : { backgroundColor: accent.muted, color: accent.primary }
          }
        >
          <BadgeCheck size={16} />
          {badge}
        </motion.span>
      ))}
    </motion.div>
  );

  const heroTextBlock = (alignCenter = false) => (
    <>
      <motion.p
        variants={itemVariants}
        className={`${kickerTextClass} mb-4 ${alignCenter ? 'text-center' : ''}`}
      >
        {industry.hero.kicker}
      </motion.p>
      <motion.h1
        variants={itemVariants}
        className={`text-2xl lg:text-4xl font-orbitron font-semibold leading-tight ${headingColor} ${
          alignCenter ? 'text-center' : ''
        }`}
      >
        {industry.hero.title}
      </motion.h1>
      <motion.p
        variants={itemVariants}
        className={`mt-3 text-base ${
          theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
        } ${alignCenter ? 'text-center' : ''}`}
      >
        {industry.hero.subtitle}
      </motion.p>
      <motion.p
        variants={itemVariants}
        className={`mt-3 ${bodyColor} ${
          alignCenter ? 'text-center max-w-3xl mx-auto' : ''
        }`}
      >
        {industry.hero.description}
      </motion.p>
      {heroBullets(alignCenter)}
      {heroActions(alignCenter)}
      {heroBadges(alignCenter)}
    </>
  );

  const renderHero = () => {
    if (heroStyle === 'centered') {
      return (
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
          variants={sectionContainerVariants}
          style={theme === 'dark' ? darkModeGradientStyle : heroGradientStyle}
          className={`py-16 relative overflow-hidden ${
            theme === 'dark' ? '' : ''
          }`}
        >
          {theme === 'dark' && (
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: `radial-gradient(circle at 30% 20%, ${palette.primary}50, transparent 60%), radial-gradient(circle at 70% 80%, ${palette.secondary}40, transparent 60%)`,
              }}
            />
          )}
          <div className="container mx-auto px-6 text-center relative z-10">
            {theme === 'dark' && getIndustryDecoration()}
            <motion.div variants={staggeredVariants}>{heroTextBlock(true)}</motion.div>
            <motion.div
              variants={itemVariants}
              className="mt-12 max-w-5xl mx-auto"
              whileHover={{ scale: 1.02 }}
            >
              <div
                className={`rounded-[32px] p-1.5 shadow-2xl ${
                  theme === 'dark' ? '' : ''
                }`}
                style={
                  theme === 'dark'
                    ? {
                        background: `linear-gradient(135deg, ${palette.primary}40, ${palette.secondary}30)`,
                      }
                    : {
                        background: 'white',
                      }
                }
              >
                <motion.img
                  src={industry.hero.image}
                  alt={industry.name}
                  className="rounded-[28px] w-full object-cover"
                  whileHover={{ scale: 1.03 }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                />
              </div>
            </motion.div>
          </div>
        </motion.section>
      );
    }

    if (heroStyle === 'overlap') {
      return (
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
          variants={sectionContainerVariants}
          style={theme === 'dark' ? darkModeGradientStyle : heroGradientStyle}
          className={`py-16 relative overflow-hidden ${theme === 'dark' ? '' : ''}`}
        >
          {theme === 'dark' && (
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: `radial-gradient(circle at 20% 30%, ${palette.primary}50, transparent 60%), radial-gradient(circle at 80% 70%, ${palette.secondary}40, transparent 60%)`,
              }}
            />
          )}
          <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center relative z-10">
            {theme === 'dark' && getIndustryDecoration()}
            <motion.div variants={staggeredVariants}>{heroTextBlock(false)}</motion.div>
            <div className="relative pb-12">
              <motion.div
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                className={`rounded-[32px] p-1.5 shadow-2xl ${
                  theme === 'dark' ? '' : ''
                }`}
                style={
                  theme === 'dark'
                    ? {
                        background: `linear-gradient(135deg, ${palette.primary}40, ${palette.secondary}30)`,
                      }
                    : {
                        background: 'white',
                      }
                }
              >
                <motion.img
                  src={industry.hero.image}
                  alt={industry.name}
                  className="rounded-[28px] w-full object-cover"
                  whileHover={{ scale: 1.04 }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                />
              </motion.div>
              <div className="absolute -bottom-6 left-6 right-6 flex gap-4 flex-wrap">
                {industry.stats.slice(0, 2).map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={viewportConfig}
                    transition={{ delay: 0.1 * index }}
                    className="rounded-2xl px-6 py-5 shadow-2xl border flex-1 min-w-[180px] backdrop-blur-sm"
                    style={
                      theme === 'dark'
                        ? {
                            borderColor: palette.primary,
                            background: `linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.95))`,
                          }
                        : {
                            backgroundColor: accent.surface,
                            borderColor: accent.primary + '30',
                          }
                    }
                  >
                    <p
                      className="text-2xl font-orbitron font-semibold"
                      style={{ color: palette.primary }}
                    >
                      {stat.value}
                    </p>
                    <p
                      className={`text-sm ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}
                    >
                      {stat.label}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.section>
      );
    }

    return (
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={viewportConfig}
        variants={sectionContainerVariants}
        style={theme === 'dark' ? darkModeGradientStyle : heroGradientStyle}
        className={`py-16 relative overflow-hidden ${theme === 'dark' ? '' : ''}`}
      >
        {theme === 'dark' && (
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `radial-gradient(circle at 40% 40%, ${palette.primary}50, transparent 60%), radial-gradient(circle at 60% 80%, ${palette.secondary}40, transparent 60%)`,
            }}
          />
        )}
        <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center relative z-10">
          {theme === 'dark' && getIndustryDecoration()}
          <motion.div variants={staggeredVariants}>{heroTextBlock(false)}</motion.div>
          <div className="relative">
            <motion.div
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              className={`rounded-[32px] p-1.5 shadow-2xl ${
                theme === 'dark' ? '' : ''
              }`}
              style={
                theme === 'dark'
                  ? {
                      background: `linear-gradient(135deg, ${palette.primary}40, ${palette.secondary}30)`,
                    }
                  : {
                      background: 'white',
                    }
              }
            >
              <motion.img
                src={industry.hero.image}
                alt={industry.name}
                className="rounded-[28px] w-full object-cover max-h-[450px]"
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
              />
            </motion.div>
          </div>
        </div>
      </motion.section>
    );
  };

  const servicesCardClass =
    theme === 'dark'
      ? 'bg-dark-card/80 backdrop-blur-sm'
      : 'bg-white border-gray-200 shadow-sm';

  const ServicesIntro = () => (
    <motion.div variants={staggeredVariants} className="text-center max-w-3xl mx-auto">
      <motion.p variants={itemVariants} className={kickerTextClass}>
        Services We Offer
      </motion.p>
      <motion.h2 variants={itemVariants} className={`mt-3 text-2xl font-orbitron font-semibold ${headingColor}`}>
        {industry.name} programs engineered for impact
      </motion.h2>
      <motion.p variants={itemVariants} className={`mt-3 ${bodyColor}`}>
        Cross-functional pods cover discovery, build, and growth initiatives tailored to
        each industry.
      </motion.p>
    </motion.div>
  );

  const renderServices = () => {
    if (servicesStyle === 'timeline') {
      return (
        <motion.section
          className="container mx-auto px-6 mt-10"
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
          variants={sectionContainerVariants}
        >
          <ServicesIntro />
          <motion.div className="mt-8 space-y-4" variants={staggeredVariants}>
            {industry.services.map((service, index) => (
              <motion.div key={service.title} className="flex gap-4" variants={itemVariants}>
                <div className="flex flex-col items-center">
                  <motion.span
                    className="w-10 h-10 rounded-full text-sm font-bold flex items-center justify-center"
                    animate={{
                      boxShadow: glowPulseAnimation(theme, palette.primary).boxShadow,
                    }}
                    transition={{ duration: 3, repeat: Infinity, delay: index * 0.2 }}
                    style={{
                      backgroundColor:
                        theme === 'dark' ? palette.surface : accent.surface,
                      color: theme === 'dark' ? palette.primary : accent.primary,
                    }}
                  >
                    {index + 1}
                  </motion.span>
                  {index !== industry.services.length - 1 && (
                    <span className="w-px flex-1 bg-gradient-to-b from-transparent via-accent-blue to-transparent opacity-40" />
                  )}
                </div>
                <motion.div
                  variants={scaleHoverVariants}
                  initial="rest"
                  whileHover="hover"
                  className={`flex-1 rounded-2xl border px-5 py-4 ${servicesCardClass} transition-all duration-300`}
                  style={
                    theme === 'dark'
                      ? {
                          borderColor: `${palette.primary}40`,
                          boxShadow: `0 0 20px ${palette.primary}15`,
                        }
                      : { backgroundColor: accent.muted }
                  }
                >
                  <h3 className={`text-xl font-semibold ${headingColor}`}>{service.title}</h3>
                  <p className={`mt-2 ${bodyColor}`}>
                    {service.description}
                  </p>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </motion.section>
      );
    }

    if (servicesStyle === 'stacked') {
      return (
        <motion.section
          className="container mx-auto px-6 mt-10"
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
          variants={sectionContainerVariants}
        >
          <ServicesIntro />
          <motion.div className="mt-6 space-y-4" variants={staggeredVariants}>
            {industry.services.map((service) => (
              <motion.div
                key={service.title}
                variants={itemVariants}
                whileHover={{ y: -6 }}
                className={`rounded-3xl border p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4 ${servicesCardClass} hover:shadow-lg transition-all duration-300`}
                style={
                  theme === 'dark'
                    ? {
                        borderColor: `${palette.primary}40`,
                        boxShadow: `0 0 20px ${palette.primary}15`,
                      }
                    : {
                        backgroundColor: accent.surface,
                      }
                }
              >
                <div>
                  <h3 className={`text-xl font-semibold ${headingColor}`}>{service.title}</h3>
                  <p className={`mt-2 ${bodyColor}`}>
                    {service.description}
                  </p>
                </div>
                <span
                  className="px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wide"
                  style={
                    theme === 'dark'
                      ? {
                          border: `1px solid ${palette.primary}`,
                          color: palette.primary,
                        }
                      : {
                          backgroundColor: accent.muted,
                          color: accent.primary,
                        }
                  }
                >
                  Signature program
                </span>
              </motion.div>
            ))}
          </motion.div>
        </motion.section>
      );
    }

    return (
      <motion.section
        className="container mx-auto px-6 mt-10"
        initial="hidden"
        whileInView="visible"
        viewport={viewportConfig}
        variants={sectionContainerVariants}
      >
        <ServicesIntro />
        <motion.div
          className="mt-6 grid md:grid-cols-2 lg:grid-cols-3 gap-4"
          variants={staggeredVariants}
        >
          {industry.services.map((service, index) => (
            <motion.div
              key={service.title}
              variants={itemVariants}
              whileHover={{ y: -6, scale: 1.02 }}
              className={`rounded-2xl border px-4 py-5 ${servicesCardClass} transition-all duration-300`}
              style={
                theme === 'dark'
                  ? {
                      borderColor: `${palette.primary}40`,
                      boxShadow: `0 0 15px ${palette.primary}15`,
                    }
                  : { backgroundColor: '#ffffff' }
              }
            >
              <div className="flex items-center justify-between">
                <span className={kickerTextClass}>
                  {String(index + 1).padStart(2, '0')}
                </span>
                <Layers3 className={theme === 'dark' ? 'text-electric-green' : 'text-accent-red'} size={22} />
              </div>
              <h3 className={`mt-4 text-xl font-semibold leading-tight ${headingColor}`}>
                {service.title}
              </h3>
              <p className={`mt-3 text-sm ${bodyColor}`}>
                {service.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>
    );
  };

  const renderStats = () => (
    <motion.section
      className="mt-12"
      initial="hidden"
      whileInView="visible"
      viewport={viewportConfig}
      variants={sectionContainerVariants}
    >
      <div
        className="py-12"
        style={
          theme === 'dark'
            ? { backgroundColor: '#0f172a' }
            : { backgroundColor: accent.muted }
        }
      >
        <div className="container mx-auto px-6">
          <motion.div className="flex flex-wrap gap-4 justify-center" variants={staggeredVariants}>
            {industry.stats.map((stat) => (
              <motion.div
                key={stat.label}
                variants={itemVariants}
                whileHover={{ y: -5, scale: 1.02 }}
                className={`rounded-2xl px-6 py-4 border ${
                  theme === 'dark'
                    ? 'border-electric-blue/40 text-white'
                    : 'border-white bg-white/70 text-gray-900 shadow-sm'
                }`}
              >
                <p className="text-2xl font-orbitron font-semibold">{stat.value}</p>
                <p className="text-sm opacity-80">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </motion.section>
  );

  const renderLeadership = () => (
    <motion.section
      className="mt-12"
      initial="hidden"
      whileInView="visible"
      viewport={viewportConfig}
      variants={sectionContainerVariants}
    >
      <div
        className="py-12"
        style={
          theme === 'dark'
            ? { backgroundColor: '#0f172a' }
            : { backgroundColor: accent.muted }
        }
      >
        <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-8 items-center">
          <motion.div variants={staggeredVariants}>
            <motion.h3 variants={itemVariants} className={`text-3xl font-orbitron font-semibold ${headingColor}`}>
              {industry.leadership.highlight}
            </motion.h3>
            <motion.p
              variants={itemVariants}
              className={`mt-4 text-base ${
                theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
              }`}
            >
              {industry.leadership.description}
            </motion.p>
            <motion.div variants={itemVariants}>
              <Link
                to="/#contact"
                className="inline-flex items-center gap-2 mt-6 px-6 py-3 rounded-xl font-semibold transition-all hover:opacity-90 shadow-lg"
                style={{
                  backgroundColor: palette.primary,
                  color: theme === 'dark' ? '#0f172a' : '#ffffff',
                  boxShadow: theme === 'dark' ? `0 0 25px ${palette.primary}40` : `0 8px 24px ${palette.primary}33`,
                }}
              >
                Get in touch <ArrowRight size={18} />
              </Link>
            </motion.div>
          </motion.div>
          <motion.div variants={itemVariants} whileHover={{ scale: 1.02 }}>
            <motion.img
              src={industry.leadership.image}
              alt={industry.name}
              className="rounded-[32px] w-full object-cover shadow-2xl"
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </motion.div>
        </div>
      </div>
    </motion.section>
  );

  const highlightCardClass =
    theme === 'dark'
      ? 'bg-dark-card/80 backdrop-blur-sm'
      : 'bg-white border-gray-200 shadow-sm';

  const renderHighlights = () => {
    if (highlightStyle === 'list') {
      return (
        <motion.section
          className="container mx-auto px-6 mt-12"
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
          variants={sectionContainerVariants}
        >
          <h3 className={`text-3xl font-orbitron font-semibold ${headingColor}`}>
            Why choose NanoFlows?
          </h3>
          <motion.div className="mt-6 space-y-4" variants={staggeredVariants}>
            {industry.highlights.map((highlight) => {
              const Icon =
                (highlight.icon && iconMap[highlight.icon]) || Sparkles;
              return (
                <motion.div key={highlight.title} className="flex gap-4" variants={itemVariants}>
                  <div className="flex flex-col items-center">
                    <motion.span
                      className="w-12 h-12 rounded-full flex items-center justify-center"
                      animate={glowPulseAnimation(theme, palette.primary)}
                      transition={{ duration: 3, repeat: Infinity }}
                      style={{
                        backgroundColor:
                          theme === 'dark' ? '#1e293b' : accent.surface,
                        color: theme === 'dark' ? '#fff' : accent.primary,
                      }}
                    >
                      <Icon size={20} />
                    </motion.span>
                    <span className="w-px flex-1 bg-gray-200 dark:bg-electric-blue/40" />
                  </div>
                  <motion.div
                    variants={scaleHoverVariants}
                    initial="rest"
                    whileHover="hover"
                    className={`flex-1 rounded-2xl border p-4 ${highlightCardClass}`}
                    style={
                      theme === 'dark'
                        ? undefined
                        : { backgroundColor: accent.surface }
                    }
                  >
                    <h4 className={`text-xl font-semibold ${headingColor}`}>{highlight.title}</h4>
                    <p className={`mt-2 ${bodyColor}`}>
                      {highlight.description}
                    </p>
                  </motion.div>
                </motion.div>
              );
            })}
          </motion.div>
        </motion.section>
      );
    }

    return (
      <motion.section
        className="container mx-auto px-6 mt-14"
        initial="hidden"
        whileInView="visible"
        viewport={viewportConfig}
        variants={sectionContainerVariants}
      >
        <div className="mb-8">
          <h3 className={`text-3xl font-orbitron font-semibold ${headingColor}`}>
            Why choose NanoFlows?
          </h3>
          <p className={`mt-2 text-lg ${bodyColor}`}>
            Partner with excellence for your {industry.name.toLowerCase()} initiatives
          </p>
        </div>
        <motion.div className="grid lg:grid-cols-2 gap-6" variants={staggeredVariants}>
          {industry.highlights.map((highlight, index) => {
            const Icon =
              (highlight.icon && iconMap[highlight.icon]) || Sparkles;
            return (
              <motion.div
                key={highlight.title}
                variants={itemVariants}
                whileHover={{ y: -6 }}
                className={`rounded-3xl border p-6 flex gap-5 transition-all hover:shadow-lg ${highlightCardClass}`}
                style={
                  theme === 'dark'
                    ? undefined
                    : { backgroundColor: accent.surface }
                }
              >
                <motion.div
                  className={`w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-md ${
                    theme === 'dark' ? '' : ''
                  }`}
                  animate={glowPulseAnimation(theme, palette.primary)}
                  transition={{ duration: 3.5, repeat: Infinity, delay: index * 0.2 }}
                  style={
                    theme === 'dark'
                      ? {
                          background: `linear-gradient(135deg, ${palette.primary}30, ${palette.secondary}20)`,
                        }
                      : {
                          background: `linear-gradient(135deg, ${palette.primary}20, ${palette.secondary}15)`,
                        }
                  }
                >
                  <Icon
                    size={28}
                    style={{ color: palette.primary }}
                  />
                </motion.div>
                <div className="flex-1">
                  <h4 className={`text-xl font-semibold ${headingColor}`}>{highlight.title}</h4>
                  <p
                    className={`mt-2.5 leading-relaxed ${bodyColor}`}
                  >
                    {highlight.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </motion.section>
    );
  };

  const solutionCardClass =
    theme === 'dark'
      ? 'bg-dark-card border-electric-blue/30'
      : 'bg-white border-gray-200 shadow-sm';

  const renderSolutions = () => {
    if (solutionsStyle === 'panels') {
      return (
        <motion.section
          className="container mx-auto px-6 mt-12"
          id="solutions"
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
          variants={sectionContainerVariants}
        >
          <motion.div className="text-center max-w-2xl mx auto mb-8" variants={staggeredVariants}>
            <motion.p variants={itemVariants} className={kickerTextClass}>
              Solution Accelerators
            </motion.p>
            <motion.h3 variants={itemVariants} className={`mt-3 text-3xl font-orbitron font-semibold ${headingColor}`}>
              Comprehensive programs across the lifecycle
            </motion.h3>
          </motion.div>
          <motion.div className="grid md:grid-cols-2 gap-5" variants={staggeredVariants}>
            {industry.solutions.map((solution) => (
              <motion.div
                key={solution.title}
                variants={itemVariants}
                whileHover={{ y: -6 }}
                className={`rounded-3xl border p-5 ${solutionCardClass}`}
                style={
                  theme === 'dark'
                    ? undefined
                    : { backgroundColor: accent.surface }
                }
              >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <Building2 className={theme === 'dark' ? 'text-electric-green' : 'text-accent-red'} />
                    <h4 className={`text-xl font-semibold ${headingColor}`}>{solution.title}</h4>
                  </div>
                  <span
                    className={kickerTextClass}
                    style={{ color: theme === 'dark' ? palette.primary : accent.secondary }}
                  >
                    Launch-ready
                  </span>
                </div>
                <p className={`mt-3 ${bodyColor}`}>
                  {solution.description}
                </p>
                <div className="mt-4 grid sm:grid-cols-3 gap-3">
                  {solution.bullets.map((bullet) => (
                    <motion.div
                      key={bullet}
                      whileHover={{ scale: 1.03 }}
                      className={`rounded-2xl px-4 py-2 text-sm ${
                        theme === 'dark'
                          ? 'bg-white/5 text-white'
                          : 'bg-white text-gray-700 shadow-sm'
                      }`}
                    >
                      {bullet}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.section>
      );
    }

    return (
      <motion.section
        className="container mx-auto px-6 mt-12"
        id="solutions"
        initial="hidden"
        whileInView="visible"
        viewport={viewportConfig}
        variants={sectionContainerVariants}
      >
        <motion.div className="text-center max-w-2xl mx-auto mb-8" variants={staggeredVariants}>
          <motion.p variants={itemVariants} className={kickerTextClass}>
            Solution Accelerators
          </motion.p>
          <motion.h3 variants={itemVariants} className={`mt-4 text-3xl font-orbitron font-semibold ${headingColor}`}>
            Comprehensive programs across the lifecycle
          </motion.h3>
        </motion.div>
        <motion.div className="grid lg:grid-cols-2 gap-5" variants={staggeredVariants}>
          {industry.solutions.map((solution) => (
            <motion.div
              key={solution.title}
              variants={itemVariants}
              whileHover={{ y: -6 }}
              className={`rounded-3xl border p-5 ${solutionCardClass}`}
            >
              <div className="flex items-center gap-3">
                <Building2 className={theme === 'dark' ? 'text-electric-green' : 'text-accent-red'} />
                <h4 className={`text-xl font-semibold ${headingColor}`}>{solution.title}</h4>
              </div>
              <p className={`mt-2 ${bodyColor}`}>
                {solution.description}
              </p>
              <motion.ul className="mt-4 space-y-2" variants={staggeredVariants}>
                {solution.bullets.map((bullet) => (
                  <motion.li
                    key={bullet}
                    variants={itemVariants}
                    className="flex items-center gap-2 text-sm"
                    whileHover={{ x: 4 }}
                  >
                    <CheckCircle2
                      size={16}
                      className={
                        theme === 'dark' ? 'text-electric-green' : 'text-accent-red'
                      }
                    />
                    <span
                      className={
                        theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
                      }
                    >
                      {bullet}
                    </span>
                  </motion.li>
                ))}
              </motion.ul>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>
    );
  };

  return (
    <div
      className={`min-h-screen flex flex-col transition-colors duration-300 ${
        theme === 'dark' ? 'bg-dark-bg' : 'bg-white'
      }`}
    >
      <Header />
      <main className="flex-1 pt-24 lg:pt-32 pb-10">
        {renderHero()}
        {renderStats()}
        {renderServices()}
        {renderHighlights()}
        {renderSolutions()}
        {renderLeadership()}

        {/* Engagement Models */}
        <motion.section
          className="container mx-auto px-6 mt-12"
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
          variants={sectionContainerVariants}
        >
          <motion.div className="grid md:grid-cols-3 gap-4" variants={staggeredVariants}>
            {industry.engagementModels.map((model) => (
              <motion.div
                key={model.title}
                variants={itemVariants}
                whileHover={{ y: -6 }}
                className={`rounded-3xl border p-5 ${
                  theme === 'dark'
                    ? 'bg-dark-card border-electric-blue/30'
                    : 'bg-white border-gray-200 shadow-sm'
                }`}
              >
                <p className={`inline-flex items-center ${kickerTextClass}`}>
                  {model.badge}
                </p>
                <h4 className={`mt-3 text-xl font-semibold ${headingColor}`}>{model.title}</h4>
                <p className={`mt-2 ${bodyColor}`}>
                  {model.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </motion.section>

        {/* Tech Stacks */}
        <motion.section
          className="container mx-auto px-6 mt-12"
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
          variants={sectionContainerVariants}
        >
          <motion.div
            className={`rounded-3xl border p-5 ${
              theme === 'dark'
                ? 'bg-dark-card border-electric-blue/30'
                : 'bg-white border-gray-200 shadow-sm'
            }`}
            variants={staggeredVariants}
          >
            <motion.div className="flex flex-wrap items-center justify-between gap-4 mb-5" variants={itemVariants}>
              <div>
                <p className={kickerTextClass}>
                  Various Technology We Work With
                </p>
                <h4 className={`mt-2 text-2xl font-orbitron font-semibold ${headingColor}`}>
                  Tech stacks, frameworks, and platforms
                </h4>
              </div>
              <span className={`inline-flex items-center gap-2 text-sm font-semibold ${
                theme === 'dark' ? 'text-electric-green' : 'text-accent-red'
              }`}>
                Explore capabilities <ChevronRight size={16} />
              </span>
            </motion.div>
            <motion.div className="grid md:grid-cols-3 gap-4" variants={staggeredVariants}>
      {industry.techStacks.map((category) => {
                return (
                  <motion.div key={category.name} variants={itemVariants}>
                    <h5 className={`font-semibold text-lg mb-3 ${headingColor}`}>{category.name}</h5>
                    <div className="flex flex-wrap gap-2">
                      {category.items.map((item) => {
                        const ItemIcon = techItemIcons[item] || Layers3;
                        return (
                          <motion.span
                            key={item}
                            whileHover={{ scale: 1.07 }}
                            className={`px-3 py-1 rounded-full text-sm border inline-flex items-center gap-2 ${
                              theme === 'dark'
                                ? 'border-electric-blue/30 text-gray-200'
                                : 'border-gray-200 text-gray-700'
                            }`}
                          >
                            <ItemIcon
                              size={14}
                              className={theme === 'dark' ? 'text-electric-green' : 'text-accent-red'}
                            />
                            <span>{item}</span>
                          </motion.span>
                        );
                      })}
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </motion.div>
        </motion.section>

        {/* FAQ */}
        <motion.section
          className="container mx-auto px-6 mt-14"
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
          variants={sectionContainerVariants}
        >
          <motion.div className="mb-6" variants={staggeredVariants}>
            <motion.p variants={itemVariants} className={kickerTextClass}>
              Frequently Asked Questions
            </motion.p>
            <motion.h4 variants={itemVariants} className={`text-2xl font-orbitron font-semibold ${headingColor}`}>
              Answers to common {industry.name} questions
            </motion.h4>
          </motion.div>
          <motion.div className="space-y-3" variants={staggeredVariants}>
            {industry.faqs.map((faq) => (
              <motion.details
                key={faq.question}
                variants={itemVariants}
                whileHover={{ scale: 1.01 }}
                className={`rounded-2xl border px-5 py-3 ${
                  theme === 'dark'
                    ? 'bg-dark-card border-electric-blue/30 text-white'
                    : 'bg-white border-gray-200 text-gray-800 shadow-sm'
                }`}
              >
                <summary className="cursor-pointer font-semibold text-lg">
                  {faq.question}
                </summary>
                <p className="mt-3 text-sm opacity-80 whitespace-nowrap overflow-hidden text-ellipsis">
                  {faq.answer}
                </p>
              </motion.details>
            ))}
          </motion.div>
        </motion.section>
      </main>
      <Footer />
    </div>
  );
};

export default IndustryDetail;
