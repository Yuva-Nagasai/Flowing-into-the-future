import { ElementType, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  Activity,
  ArrowRight,
  BadgeCheck,
  BadgeDollarSign,
  Building2,
  CalendarCheck,
  Car,
  CheckCircle2,
  ChevronRight,
  Coins,
  CreditCard,
  FlaskConical,
  FileCheck,
  Gauge,
  Gift,
  Globe,
  Handshake,
  Heart,
  Layers,
  Layers3,
  Link2,
  Map,
  MessageCircle,
  PhoneCall,
  RefreshCcw,
  Recycle,
  Rocket,
  Route,
  Scale,
  Settings,
  Shield,
  Sparkles,
  Stethoscope,
  Target,
  TrendingUp,
  Tv,
  Users,
  Utensils,
  Wifi,
  Zap,
} from 'lucide-react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useTheme } from '../../context/ThemeContext';
import { getIndustryBySlug } from '../../data/industries';

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

const IndustryDetail = () => {
  const { theme } = useTheme();
  const { slug } = useParams();
  const navigate = useNavigate();
  const industry = getIndustryBySlug(slug);

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
    <ul className={`mt-6 space-y-3 ${alignCenter ? 'max-w-2xl mx-auto' : ''}`}>
      {industry.hero.bullets.map((item) => (
        <li
          key={item}
          className={`flex items-center gap-3 text-base ${
            alignCenter ? 'justify-center text-center' : ''
          }`}
        >
          <CheckCircle2
            className={theme === 'dark' ? 'text-electric-green' : 'text-accent-red'}
            size={20}
          />
          <span
            className={theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}
          >
            {item}
          </span>
        </li>
      ))}
    </ul>
  );

  const heroActions = (alignCenter = false) => (
    <div className={`mt-8 flex flex-wrap gap-4 ${alignCenter ? 'justify-center' : ''}`}>
      <a
        href={industry.hero.primaryCta.href}
        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold shadow-lg transition-all hover:opacity-90"
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
      </a>
      <a
        href={industry.hero.secondaryCta.href}
        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold border transition-all hover:opacity-80"
        style={{
          borderColor: palette.secondary,
          color: theme === 'dark' ? '#fff' : palette.secondary,
        }}
      >
        {industry.hero.secondaryCta.label} <ArrowRight size={18} />
      </a>
    </div>
  );

  const heroBadges = (alignCenter = false) => (
    <div className={`mt-8 flex flex-wrap gap-4 ${alignCenter ? 'justify-center' : 'items-center'}`}>
      {industry.hero.partnerBadges.map((badge) => (
        <span
          key={badge}
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
        </span>
      ))}
    </div>
  );

  const heroTextBlock = (alignCenter = false) => (
    <>
      <p
        className={`text-sm uppercase tracking-[0.35em] font-orbitron mb-4 ${
          theme === 'dark' ? 'text-electric-blue' : 'text-accent-red'
        } ${alignCenter ? 'text-center' : ''}`}
      >
        {industry.hero.kicker}
      </p>
      <h1
        className={`text-2xl lg:text-4xl font-orbitron font-semibold leading-tight ${
          alignCenter ? 'text-center' : ''
        }`}
      >
        {industry.hero.title}
      </h1>
      <p
        className={`mt-3 text-base ${
          theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
        } ${alignCenter ? 'text-center' : ''}`}
      >
        {industry.hero.subtitle}
      </p>
      <p
        className={`mt-3 ${
          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
        } ${alignCenter ? 'text-center max-w-3xl mx-auto' : ''}`}
      >
        {industry.hero.description}
      </p>
      {heroBullets(alignCenter)}
      {heroActions(alignCenter)}
      {heroBadges(alignCenter)}
    </>
  );

  const renderHero = () => {
    if (heroStyle === 'centered') {
      return (
        <section
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
            {heroTextBlock(true)}
            <div className="mt-12 max-w-5xl mx-auto">
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
                <img
                  src={industry.hero.image}
                  alt={industry.name}
                  className="rounded-[28px] w-full object-cover"
                />
              </div>
            </div>
          </div>
        </section>
      );
    }

    if (heroStyle === 'overlap') {
      return (
        <section
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
            <div>{heroTextBlock(false)}</div>
            <div className="relative pb-12">
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
                <img
                  src={industry.hero.image}
                  alt={industry.name}
                  className="rounded-[28px] w-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 left-6 right-6 flex gap-4 flex-wrap">
                {industry.stats.slice(0, 2).map((stat) => (
                  <div
                    key={stat.label}
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
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      );
    }

    return (
      <section
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
          <div>{heroTextBlock(false)}</div>
          <div className="relative">
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
              <img
                src={industry.hero.image}
                alt={industry.name}
                className="rounded-[28px] w-full object-cover max-h-[450px]"
              />
            </div>
          </div>
        </div>
      </section>
    );
  };

  const servicesCardClass =
    theme === 'dark'
      ? 'bg-dark-card/80 backdrop-blur-sm'
      : 'bg-white border-gray-200 shadow-sm';

  const servicesIntro = (
    <div className="text-center max-w-3xl mx-auto">
      <p
        className={`text-sm font-orbitron uppercase tracking-[0.4em] ${
          theme === 'dark' ? 'text-electric-blue' : 'text-accent-red'
        }`}
      >
        Services We Offer
      </p>
      <h2 className="mt-3 text-2xl font-orbitron font-semibold">
        {industry.name} programs engineered for impact
      </h2>
      <p
        className={`mt-3 ${
          theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
        }`}
      >
        Cross-functional pods cover discovery, build, and growth initiatives tailored to
        each industry.
      </p>
    </div>
  );

  const renderServices = () => {
    if (servicesStyle === 'timeline') {
      return (
        <section className="container mx-auto px-6 mt-10">
          {servicesIntro}
          <div className="mt-8 space-y-4">
            {industry.services.map((service, index) => (
              <div key={service.title} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <span
                    className="w-10 h-10 rounded-full text-sm font-bold flex items-center justify-center"
                    style={{
                      backgroundColor:
                        theme === 'dark' ? palette.surface : accent.surface,
                      color: theme === 'dark' ? palette.primary : accent.primary,
                    }}
                  >
                    {index + 1}
                  </span>
                  {index !== industry.services.length - 1 && (
                    <span className="w-px flex-1 bg-gradient-to-b from-transparent via-accent-blue to-transparent opacity-40" />
                  )}
                </div>
                <div
                  className={`flex-1 rounded-2xl border px-5 py-4 ${servicesCardClass} hover:shadow-lg transition-all duration-300`}
                  style={
                    theme === 'dark'
                      ? {
                          borderColor: `${palette.primary}40`,
                          boxShadow: `0 0 20px ${palette.primary}15`,
                        }
                      : { backgroundColor: accent.muted }
                  }
                >
                  <h3 className="text-xl font-semibold">{service.title}</h3>
                  <p
                    className={`mt-2 ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}
                  >
                    {service.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      );
    }

    if (servicesStyle === 'stacked') {
      return (
        <section className="container mx-auto px-6 mt-10">
          {servicesIntro}
          <div className="mt-6 space-y-4">
            {industry.services.map((service) => (
              <div
                key={service.title}
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
                  <h3 className="text-xl font-semibold">{service.title}</h3>
                  <p
                    className={`mt-2 ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                    }`}
                  >
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
              </div>
            ))}
          </div>
        </section>
      );
    }

    return (
      <section className="container mx-auto px-6 mt-10">
        {servicesIntro}
        <div className="mt-6 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {industry.services.map((service, index) => (
            <div
              key={service.title}
              className={`rounded-2xl border px-4 py-5 ${servicesCardClass} hover:shadow-lg hover:scale-[1.02] transition-all duration-300`}
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
                <span
                  className={`text-xs font-orbitron tracking-[0.4em] ${
                    theme === 'dark' ? 'text-electric-blue' : 'text-accent-red'
                  }`}
                >
                  {String(index + 1).padStart(2, '0')}
                </span>
                <Layers3 className={theme === 'dark' ? 'text-electric-green' : 'text-accent-red'} size={22} />
              </div>
              <h3 className="mt-4 text-xl font-semibold leading-tight">
                {service.title}
              </h3>
              <p
                className={`mt-3 text-sm ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                }`}
              >
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </section>
    );
  };

  const renderStats = () => (
    <section className="mt-12">
      <div
        className="py-12"
        style={
          theme === 'dark'
            ? { backgroundColor: '#0f172a' }
            : { backgroundColor: accent.muted }
        }
      >
        <div className="container mx-auto px-6">
          <div className="flex flex-wrap gap-4 justify-center">
            {industry.stats.map((stat) => (
              <div
                key={stat.label}
                className={`rounded-2xl px-6 py-4 border ${
                  theme === 'dark'
                    ? 'border-electric-blue/40 text-white'
                    : 'border-white bg-white/70 text-gray-900 shadow-sm'
                }`}
              >
                <p className="text-2xl font-orbitron font-semibold">{stat.value}</p>
                <p className="text-sm opacity-80">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );

  const renderLeadership = () => (
    <section className="mt-12">
      <div
        className="py-12"
        style={
          theme === 'dark'
            ? { backgroundColor: '#0f172a' }
            : { backgroundColor: accent.muted }
        }
      >
        <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-8 items-center">
          <div>
            <h3 className="text-3xl font-orbitron font-semibold">
              {industry.leadership.highlight}
            </h3>
            <p
              className={`mt-4 text-base ${
                theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
              }`}
            >
              {industry.leadership.description}
            </p>
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
          </div>
          <div>
            <img
              src={industry.leadership.image}
              alt={industry.name}
              className="rounded-[32px] w-full object-cover shadow-2xl"
            />
          </div>
        </div>
      </div>
    </section>
  );

  const highlightCardClass =
    theme === 'dark'
      ? 'bg-dark-card/80 backdrop-blur-sm'
      : 'bg-white border-gray-200 shadow-sm';

  const renderHighlights = () => {
    if (highlightStyle === 'list') {
      return (
        <section className="container mx-auto px-6 mt-12">
          <h3 className="text-3xl font-orbitron font-semibold">
            Why choose HashStudioz?
          </h3>
          <div className="mt-6 space-y-4">
            {industry.highlights.map((highlight) => {
              const Icon =
                (highlight.icon && iconMap[highlight.icon]) || Sparkles;
              return (
                <div key={highlight.title} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <span
                      className="w-12 h-12 rounded-full flex items-center justify-center"
                      style={{
                        backgroundColor:
                          theme === 'dark' ? '#1e293b' : accent.surface,
                        color: theme === 'dark' ? '#fff' : accent.primary,
                      }}
                    >
                      <Icon size={20} />
                    </span>
                    <span className="w-px flex-1 bg-gray-200 dark:bg-electric-blue/40" />
                  </div>
                  <div
                    className={`flex-1 rounded-2xl border p-4 ${highlightCardClass}`}
                    style={
                      theme === 'dark'
                        ? undefined
                        : { backgroundColor: accent.surface }
                    }
                  >
                    <h4 className="text-xl font-semibold">{highlight.title}</h4>
                    <p
                      className={`mt-2 ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                      }`}
                    >
                      {highlight.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      );
    }

    return (
      <section className="container mx-auto px-6 mt-14">
        <div className="mb-8">
          <h3 className="text-3xl font-orbitron font-semibold">
            Why choose NanoFlows?
          </h3>
          <p className={`mt-2 text-lg ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
            Partner with excellence for your {industry.name.toLowerCase()} initiatives
          </p>
        </div>
        <div className="grid lg:grid-cols-2 gap-6">
          {industry.highlights.map((highlight) => {
            const Icon =
              (highlight.icon && iconMap[highlight.icon]) || Sparkles;
            return (
              <div
                key={highlight.title}
                className={`rounded-3xl border p-6 flex gap-5 transition-all hover:shadow-lg ${highlightCardClass}`}
                style={
                  theme === 'dark'
                    ? undefined
                    : { backgroundColor: accent.surface }
                }
              >
                <div
                  className={`w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-md ${
                    theme === 'dark' ? '' : ''
                  }`}
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
                </div>
                <div className="flex-1">
                  <h4 className="text-xl font-semibold">{highlight.title}</h4>
                  <p
                    className={`mt-2.5 leading-relaxed ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                    }`}
                  >
                    {highlight.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    );
  };

  const solutionCardClass =
    theme === 'dark'
      ? 'bg-dark-card border-electric-blue/30'
      : 'bg-white border-gray-200 shadow-sm';

  const renderSolutions = () => {
    if (solutionsStyle === 'panels') {
      return (
        <section className="container mx-auto px-6 mt-12" id="solutions">
          <div className="text-center max-w-2xl mx auto mb-8">
            <p
              className={`text-sm font-orbitron uppercase tracking-[0.4em] ${
                theme === 'dark' ? 'text-electric-blue' : 'text-accent-red'
              }`}
            >
              Solution Accelerators
            </p>
            <h3 className="mt-3 text-3xl font-orbitron font-semibold">
              Comprehensive programs across the lifecycle
            </h3>
          </div>
          <div className="grid md:grid-cols-2 gap-5">
            {industry.solutions.map((solution) => (
              <div
                key={solution.title}
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
                    <h4 className="text-xl font-semibold">{solution.title}</h4>
                  </div>
                  <span
                    className="text-xs uppercase tracking-[0.3em]"
                    style={{ color: accent.secondary }}
                  >
                    Launch-ready
                  </span>
                </div>
                <p
                  className={`mt-3 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                  }`}
                >
                  {solution.description}
                </p>
                <div className="mt-4 grid sm:grid-cols-3 gap-3">
                  {solution.bullets.map((bullet) => (
                    <div
                      key={bullet}
                      className={`rounded-2xl px-4 py-2 text-sm ${
                        theme === 'dark'
                          ? 'bg-white/5 text-white'
                          : 'bg-white text-gray-700 shadow-sm'
                      }`}
                    >
                      {bullet}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      );
    }

    return (
      <section className="container mx-auto px-6 mt-12" id="solutions">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <p
            className={`text-sm font-orbitron uppercase tracking-[0.4em] ${
              theme === 'dark' ? 'text-electric-blue' : 'text-accent-red'
            }`}
          >
            Solution Accelerators
          </p>
          <h3 className="mt-4 text-3xl font-orbitron font-semibold">
            Comprehensive programs across the lifecycle
          </h3>
        </div>
        <div className="grid lg:grid-cols-2 gap-5">
          {industry.solutions.map((solution) => (
            <div
              key={solution.title}
              className={`rounded-3xl border p-5 ${solutionCardClass}`}
            >
              <div className="flex items-center gap-3">
                <Building2 className={theme === 'dark' ? 'text-electric-green' : 'text-accent-red'} />
                <h4 className="text-xl font-semibold">{solution.title}</h4>
              </div>
              <p
                className={`mt-2 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                }`}
              >
                {solution.description}
              </p>
              <ul className="mt-4 space-y-2">
                {solution.bullets.map((bullet) => (
                  <li key={bullet} className="flex items-center gap-2 text-sm">
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
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    );
  };

  return (
    <div
      className={`min-h-screen flex flex-col transition-colors duration-300 ${
        theme === 'dark' ? 'bg-dark-bg' : 'bg-white'
      }`}
    >
      <Header />
      <main className="flex-1 pt-16 pb-10">
        {renderHero()}
        {renderStats()}
        {renderServices()}
        {renderHighlights()}
        {renderSolutions()}
        {renderLeadership()}

        {/* Engagement Models */}
        <section className="container mx-auto px-6 mt-12">
          <div className="grid md:grid-cols-3 gap-4">
            {industry.engagementModels.map((model) => (
              <div
                key={model.title}
                className={`rounded-3xl border p-5 ${
                  theme === 'dark'
                    ? 'bg-dark-card border-electric-blue/30'
                    : 'bg-white border-gray-200 shadow-sm'
                }`}
              >
                <p
                  className={`inline-flex items-center text-xs font-orbitron uppercase tracking-[0.4em] ${
                    theme === 'dark' ? 'text-electric-blue' : 'text-accent-red'
                  }`}
                >
                  {model.badge}
                </p>
                <h4 className="mt-3 text-xl font-semibold">{model.title}</h4>
                <p
                  className={`mt-2 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                  }`}
                >
                  {model.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Tech Stacks */}
        <section className="container mx-auto px-6 mt-12">
          <div
            className={`rounded-3xl border p-5 ${
              theme === 'dark'
                ? 'bg-dark-card border-electric-blue/30'
                : 'bg-white border-gray-200 shadow-sm'
            }`}
          >
            <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
              <div>
                <p
                  className={`text-xs font-orbitron uppercase tracking-[0.4em] ${
                    theme === 'dark' ? 'text-electric-blue' : 'text-accent-red'
                  }`}
                >
                  Various Technology We Work With
                </p>
                <h4 className="mt-2 text-2xl font-orbitron font-semibold">
                  Tech stacks, frameworks, and platforms
                </h4>
              </div>
              <span className={`inline-flex items-center gap-2 text-sm font-semibold ${
                theme === 'dark' ? 'text-electric-green' : 'text-accent-red'
              }`}>
                Explore capabilities <ChevronRight size={16} />
              </span>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              {industry.techStacks.map((category) => (
                <div key={category.name}>
                  <h5 className="font-semibold text-lg mb-3">{category.name}</h5>
                  <div className="flex flex-wrap gap-2">
                    {category.items.map((item) => (
                      <span
                        key={item}
                        className={`px-3 py-1 rounded-full text-sm border ${
                          theme === 'dark'
                            ? 'border-electric-blue/30 text-gray-200'
                            : 'border-gray-200 text-gray-700'
                        }`}
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="container mx-auto px-6 mt-14">
          <div className="mb-6">
            <p
              className={`text-xs font-orbitron uppercase tracking-[0.4em] ${
                theme === 'dark' ? 'text-electric-blue' : 'text-accent-red'
              }`}
            >
              Frequently Asked Questions
            </p>
            <h4 className="text-2xl font-orbitron font-semibold">
              Answers to common {industry.name} questions
            </h4>
          </div>
          <div className="space-y-3">
            {industry.faqs.map((faq) => (
              <details
                key={faq.question}
                className={`rounded-2xl border px-5 py-3 ${
                  theme === 'dark'
                    ? 'bg-dark-card border-electric-blue/30 text-white'
                    : 'bg-white border-gray-200 text-gray-800 shadow-sm'
                }`}
              >
                <summary className="cursor-pointer font-semibold text-lg">
                  {faq.question}
                </summary>
                <p className="mt-3 text-sm opacity-80">{faq.answer}</p>
              </details>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default IndustryDetail;
