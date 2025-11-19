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
  ShieldCheck,
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
  const { accent, heroStyle, servicesStyle, highlightStyle, solutionsStyle } =
    presentation;

  const heroGradientStyle = {
    backgroundImage: `linear-gradient(135deg, ${accent.gradient[0]}, ${accent.gradient[1]}, ${accent.gradient[2]})`,
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
        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white shadow-lg transition-all"
        style={{
          backgroundColor: accent.primary,
          boxShadow:
            theme === 'dark'
              ? 'none'
              : `0 15px 40px ${accent.primary}33`,
        }}
      >
        <PhoneCall size={18} />
        {industry.hero.primaryCta.label}
      </a>
      <a
        href={industry.hero.secondaryCta.href}
        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold border transition-all"
        style={{
          borderColor: accent.secondary,
          color: theme === 'dark' ? '#fff' : accent.secondary,
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
                  backgroundColor: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  color: '#fff',
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
          style={theme === 'dark' ? undefined : heroGradientStyle}
          className={`py-12 ${theme === 'dark' ? 'bg-dark-card' : ''}`}
        >
          <div className="container mx-auto px-6 text-center">
            {heroTextBlock(true)}
            <div className="mt-8 max-w-4xl mx-auto">
              <div
                className={`rounded-[32px] p-3 ${
                  theme === 'dark'
                    ? 'bg-gradient-to-r from-electric-blue/40 via-purple-500/30 to-electric-green/30'
                    : 'bg-white shadow-2xl'
                }`}
              >
                <img
                  src={industry.hero.image}
                  alt={industry.name}
                  className="rounded-[24px] w-full object-cover"
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
          style={theme === 'dark' ? undefined : heroGradientStyle}
          className={`py-12 ${theme === 'dark' ? 'bg-dark-card' : ''}`}
        >
          <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
            <div>{heroTextBlock(false)}</div>
            <div className="relative pb-10">
              <div
                className={`rounded-[32px] p-2 ${
                  theme === 'dark' ? 'bg-white/5' : 'bg-white shadow-2xl'
                }`}
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
                    className="rounded-2xl px-5 py-4 shadow-lg border flex-1 min-w-[180px]"
                    style={
                      theme === 'dark'
                        ? { borderColor: '#3b82f6', backgroundColor: '#0f172a' }
                        : { backgroundColor: accent.surface, borderColor: accent.muted }
                    }
                  >
                    <p className="text-xl font-orbitron font-semibold">{stat.value}</p>
                    <p className="text-sm opacity-75">{stat.label}</p>
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
        style={theme === 'dark' ? undefined : heroGradientStyle}
        className={`py-12 ${theme === 'dark' ? 'bg-dark-card' : ''}`}
      >
        <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
          <div>{heroTextBlock(false)}</div>
          <div className="relative">
            <div
              className={`rounded-[32px] p-2 ${
                theme === 'dark'
                  ? 'bg-gradient-to-tr from-electric-blue/40 via-purple-500/30 to-electric-green/20'
                  : 'bg-white shadow-xl'
              }`}
            >
              <div
                className={`rounded-[28px] p-4 ${
                  theme === 'dark' ? 'bg-dark-bg' : 'bg-white'
                }`}
              >
                <img
                  src={industry.hero.image}
                  alt={industry.name}
                  className="rounded-2xl w-full object-cover max-h-[420px]"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  };

  const servicesCardClass =
    theme === 'dark'
      ? 'bg-dark-card border-electric-blue/30'
      : 'border-gray-200 shadow-sm';

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
                        theme === 'dark' ? '#1e293b' : accent.surface,
                      color: theme === 'dark' ? '#fff' : accent.primary,
                    }}
                  >
                    {index + 1}
                  </span>
                  {index !== industry.services.length - 1 && (
                    <span className="w-px flex-1 bg-gradient-to-b from-transparent via-accent-blue to-transparent opacity-40" />
                  )}
                </div>
                <div
                  className={`flex-1 rounded-2xl border px-5 py-4 ${servicesCardClass}`}
                  style={
                    theme === 'dark'
                      ? undefined
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
                className={`rounded-3xl border p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4 ${servicesCardClass}`}
                style={
                  theme === 'dark'
                    ? undefined
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
                      ? { border: '1px solid #38bdf8' }
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
              className={`rounded-2xl border px-4 py-5 ${servicesCardClass}`}
              style={
                theme === 'dark'
                  ? undefined
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
                <Layers3 className="text-electric-green" size={22} />
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

  const renderStatsAndLeadership = () => (
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
            <div className="flex flex-wrap gap-4 mb-8">
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
              className="inline-flex items-center gap-2 mt-6 px-6 py-3 rounded-xl font-semibold text-white transition-colors"
              style={{ backgroundColor: accent.primary }}
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
      ? 'bg-dark-card border-electric-blue/30'
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
      <section className="container mx-auto px-6 mt-12">
        <div className="grid lg:grid-cols-2 gap-5">
          {industry.highlights.map((highlight) => {
            const Icon =
              (highlight.icon && iconMap[highlight.icon]) || Sparkles;
            return (
              <div
                key={highlight.title}
                className={`rounded-3xl border p-5 flex gap-4 ${highlightCardClass}`}
              >
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                    theme === 'dark' ? 'bg-electric-blue/20' : 'bg-accent-red/10'
                  }`}
                >
                  <Icon className="text-electric-green" />
                </div>
                <div>
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
                    <Building2 className="text-electric-green" />
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
                <Building2 className="text-electric-green" />
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
        {renderServices()}
        {renderStatsAndLeadership()}
        {renderHighlights()}
        {renderSolutions()}

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
              <span className="inline-flex items-center gap-2 text-sm font-semibold text-electric-green">
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
