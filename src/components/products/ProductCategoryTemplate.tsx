import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Check } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export type ProductStatus = 'supported' | 'limited' | 'not-supported';

export interface ProductComparisonRow {
  name: string;
  sekeltech: { status: ProductStatus; text: string };
  others: { status: ProductStatus; text: string };
}

export interface ProductStat {
  label: string;
  value: string;
  helper?: string;
}

export interface ProductHighlightCard {
  icon: LucideIcon;
  title: string;
  description: string;
}

export interface ProductFeatureCard {
  title: string;
  description: string;
}

export interface ProductCTAConfig {
  title: string;
  description: string;
  buttonLabel: string;
  buttonLink: string;
}

interface ProductCategoryTemplateProps {
  badgeLabel: string;
  badgeIcon?: LucideIcon;
  heroEyebrow: string;
  heroTitle: string | ReactNode;
  heroDescription: string;
  stats?: ProductStat[];
  iconHighlights?: ProductHighlightCard[];
  featureCards: ProductFeatureCard[];
  featureHeading?: string;
  enhancements: string[];
  enhancementsHeading?: string;
  comparison: ProductComparisonRow[];
  comparisonHeading?: string;
  cta: ProductCTAConfig;
}

const StatusIcon = ({ status }: { status: ProductStatus }) => {
  if (status === 'supported') {
    return (
      <div className="w-6 h-6 rounded-full bg-electric-green/20 flex items-center justify-center">
        <Check className="w-4 h-4 text-electric-green" />
      </div>
    );
  }
  if (status === 'limited') {
    return (
      <div className="w-6 h-6 rounded-full bg-yellow-400/20 flex items-center justify-center">
        <div className="w-2 h-2 rounded-full bg-yellow-500" />
      </div>
    );
  }
  return (
    <div className="w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center">
      <div className="w-2 h-2 rounded-full bg-red-500" />
    </div>
  );
};

const ProductCategoryTemplate = ({
  badgeLabel,
  badgeIcon: BadgeIcon,
  heroEyebrow,
  heroTitle,
  heroDescription,
  stats = [],
  iconHighlights = [],
  featureCards,
  featureHeading = 'Platform capabilities',
  enhancements,
  enhancementsHeading = 'Where it helps',
  comparison,
  comparisonHeading = 'Nano Flows vs others',
  cta
}: ProductCategoryTemplateProps) => {
  const { theme } = useTheme();

  const heroBackground =
    theme === 'dark'
      ? 'bg-gradient-to-br from-dark-card via-black to-dark-bg'
      : 'bg-gradient-to-br from-white via-gray-100 to-gray-50';

  const surfaceCard =
    theme === 'dark'
      ? 'bg-dark-card/70 border border-electric-blue/20'
      : 'bg-white border border-gray-200';

  const mutedText = theme === 'dark' ? 'text-gray-300' : 'text-gray-700';

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-dark-bg' : 'bg-white'}`}>
      {/* Top Bar */}
      <div
        className={`sticky top-0 z-50 border-b backdrop-blur-md ${
          theme === 'dark' ? 'bg-dark-card/90 border-gray-800' : 'bg-white/90 border-gray-200'
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link
            to="/"
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
              theme === 'dark'
                ? 'bg-electric-green text-black hover:bg-electric-blue hover:glow-green'
                : 'bg-accent-red text-white hover:bg-accent-blue hover:glow-red'
            }`}
          >
            <ArrowLeft size={18} />
            Back to Website
          </Link>
          <span
            className={`text-xs font-exo uppercase tracking-[0.3em] ${
              theme === 'dark' ? 'text-electric-green' : 'text-accent-red'
            }`}
          >
            {badgeLabel}
          </span>
        </div>
      </div>

      {/* Hero */}
      <section className={`relative overflow-hidden py-14 sm:py-16 md:py-20 ${heroBackground}`}>
        <div className="absolute inset-0">
          <div className="absolute -top-24 -right-10 w-64 h-64 rounded-full bg-electric-blue/10 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-56 h-56 rounded-full bg-electric-green/10 blur-3xl" />
        </div>
        <div className="container mx-auto px-4 sm:px-6 relative z-10 grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <div
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border mb-6 ${
                theme === 'dark'
                  ? 'border-electric-blue/40 bg-electric-blue/10 text-electric-blue'
                  : 'border-accent-red/30 bg-accent-red/10 text-accent-red'
              }`}
            >
              {BadgeIcon && <BadgeIcon className="w-5 h-5" />}
              <span className="font-semibold tracking-wide">{badgeLabel}</span>
            </div>
            <p
              className={`text-xs font-exo uppercase tracking-[0.4em] mb-3 ${
                theme === 'dark' ? 'text-electric-green/80' : 'text-accent-red'
              }`}
            >
              {heroEyebrow}
            </p>
            <h1
              className={`text-4xl sm:text-5xl font-orbitron font-bold mb-4 ${
                theme === 'dark' ? 'text-white' : 'text-black'
              }`}
            >
              {heroTitle}
            </h1>
            <p className={`text-base sm:text-lg font-exo mb-6 ${mutedText}`}>{heroDescription}</p>

            {stats.length > 0 && (
              <div className="grid sm:grid-cols-2 gap-4">
                {stats.map((stat) => (
                  <div key={stat.label} className={`rounded-2xl px-4 py-3 shadow-lg ${surfaceCard}`}>
                    <p className="text-xs font-exo uppercase tracking-wide text-gray-500">{stat.label}</p>
                    <p
                      className={`text-2xl font-orbitron font-bold ${
                        theme === 'dark' ? 'text-white' : 'text-black'
                      }`}
                    >
                      {stat.value}
                    </p>
                    {stat.helper && <p className={`text-xs font-exo ${mutedText}`}>{stat.helper}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>
          {iconHighlights.length > 0 && (
            <div className="grid sm:grid-cols-2 gap-4">
              {iconHighlights.map((highlight, index) => (
                <motion.div
                  key={highlight.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className={`rounded-2xl p-5 shadow-lg ${surfaceCard}`}
                >
                  <highlight.icon
                    className={theme === 'dark' ? 'text-electric-blue' : 'text-accent-red'}
                    size={28}
                  />
                  <p className={`mt-4 font-orbitron font-semibold ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
                    {highlight.title}
                  </p>
                  <p className={`text-sm font-exo mt-2 ${mutedText}`}>{highlight.description}</p>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Features */}
      <section className="py-12 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <p className={`text-xs font-exo uppercase tracking-[0.4em] mb-3 ${mutedText}`}>Capabilities</p>
            <h2
              className={`text-3xl font-orbitron font-bold mb-3 ${
                theme === 'dark' ? 'text-white' : 'text-black'
              }`}
            >
              {featureHeading}
            </h2>
            <p className={`text-base font-exo ${mutedText}`}>
              Precision-built modules that bring strategy, operations, and experience into one platform.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {featureCards.map((feature) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className={`p-6 rounded-2xl border shadow-lg ${surfaceCard}`}
              >
                <h3 className={`text-xl font-orbitron font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
                  {feature.title}
                </h3>
                <p className={`text-sm font-exo ${mutedText}`}>{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhancements */}
      <section className={`${theme === 'dark' ? 'bg-dark-card/50' : 'bg-gray-50'} py-12`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-4">
            <h3 className={`text-2xl font-orbitron font-bold ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
              {enhancementsHeading}
            </h3>
            <p className={`text-sm md:text-base font-exo ${mutedText}`}>
              Operational improvements that convert your strategy into tangible impact.
            </p>
            <Link
              to="/#contact"
              className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
                theme === 'dark'
                  ? 'bg-electric-green text-black hover:bg-electric-blue hover:glow-green'
                  : 'bg-accent-red text-white hover:bg-accent-blue hover:glow-red'
              }`}
            >
              Talk to our team
            </Link>
          </div>
          <div className="space-y-3">
            {enhancements.map((point) => (
              <div key={point} className={`p-4 rounded-xl border flex items-start gap-3 ${surfaceCard}`}>
                <Check className={theme === 'dark' ? 'text-electric-green' : 'text-accent-red'} size={20} />
                <p className={`text-sm font-exo ${mutedText}`}>{point}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <p className={`text-xs font-exo uppercase tracking-[0.4em] mb-3 ${mutedText}`}>Comparison</p>
          <h3 className={`text-3xl font-orbitron font-bold mb-3 ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
            {comparisonHeading}
          </h3>
          <p className={`text-sm font-exo ${mutedText}`}>
            Evaluate how Nano Flows simplifies execution compared to fragmented stacks.
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th
                  className={`p-4 text-left font-orbitron font-bold border ${
                    theme === 'dark' ? 'bg-electric-blue text-black border-gray-700' : 'bg-accent-red text-white border-gray-300'
                  }`}
                >
                  Feature
                </th>
                <th
                  className={`p-4 text-left font-orbitron font-bold border ${
                    theme === 'dark' ? 'bg-electric-blue text-black border-gray-700' : 'bg-accent-red text-white border-gray-300'
                  }`}
                >
                  Nano Flows
                </th>
                <th
                  className={`p-4 text-left font-orbitron font-bold border ${
                    theme === 'dark' ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-200 text-black border-gray-300'
                  }`}
                >
                  Others
                </th>
              </tr>
            </thead>
            <tbody>
              {comparison.map((row) => (
                <tr key={row.name} className={`border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                  <td className={`p-4 font-exo border-r ${theme === 'dark' ? 'text-white border-gray-700' : 'text-gray-800 border-gray-300'}`}>
                    {row.name}
                  </td>
                  <td
                    className={`p-4 border-r ${
                      theme === 'dark' ? 'bg-dark-lighter border-gray-700' : 'bg-green-50 border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-3 text-white">
                      <StatusIcon status={row.sekeltech.status} />
                      <span className={`text-sm font-exo ${theme === 'dark' ? 'text-white' : mutedText}`}>
                        {row.sekeltech.text}
                      </span>
                    </div>
                  </td>
                  <td className={theme === 'dark' ? 'p-4 bg-dark-lighter/40 text-white' : 'p-4 bg-red-50'}>
                    <div className="flex items-center gap-3">
                      <StatusIcon status={row.others.status} />
                      <span className={`text-sm font-exo ${theme === 'dark' ? 'text-white' : mutedText}`}>
                        {row.others.text}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* CTA */}
      <section className="pb-16">
        <div
          className={`container mx-auto px-4 sm:px-6 lg:px-8 rounded-3xl p-10 text-center shadow-2xl ${
            theme === 'dark'
              ? 'bg-gradient-to-r from-electric-blue/20 to-electric-green/20 border border-electric-blue/30'
              : 'bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200'
          }`}
        >
          <h3 className={`text-3xl font-orbitron font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            {cta.title}
          </h3>
          <p className={`text-lg font-exo mb-6 ${mutedText}`}>{cta.description}</p>
          <Link
            to={cta.buttonLink}
            className={`inline-flex items-center justify-center px-8 py-4 rounded-lg font-semibold transition-all duration-300 ${
              theme === 'dark'
                ? 'bg-electric-green text-black hover:bg-electric-blue hover:glow-green'
                : 'bg-accent-red text-white hover:bg-accent-blue hover:glow-red'
            }`}
          >
            {cta.buttonLabel}
          </Link>
        </div>
      </section>
    </div>
  );
};

export default ProductCategoryTemplate;

