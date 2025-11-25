import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { Check } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import Header from '../Header';
import Footer from '../Footer';

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
  const shouldReduceMotion = useReducedMotion();

  const mutedText = theme === 'dark' ? 'text-gray-300' : 'text-gray-700';
  const eyebrowTextClass = `text-xs uppercase tracking-[0.2em] font-semibold ${
    theme === 'dark' ? 'text-electric-green/80' : 'text-accent-red/80'
  }`;

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-dark-bg' : 'bg-gray-50'}`}>
      <Header />
      <main className="pt-24 lg:pt-32">
        {/* Hero */}
        <section className={`relative overflow-hidden py-16 sm:py-20 md:py-24 ${
        theme === 'dark'
          ? 'bg-gradient-to-br from-dark-card via-dark-bg to-black'
          : 'bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30'
      }`}>
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className={`absolute -top-40 -right-40 w-96 h-96 rounded-full blur-3xl opacity-20 ${
            theme === 'dark' ? 'bg-electric-blue' : 'bg-accent-blue'
          }`} />
          <div className={`absolute -bottom-40 -left-40 w-96 h-96 rounded-full blur-3xl opacity-20 ${
            theme === 'dark' ? 'bg-electric-green' : 'bg-accent-red'
          }`} />
        </div>
        <div className="container mx-auto px-4 sm:px-6 relative z-10 grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.6, ease: "easeOut" }}
          >
            <div
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border mb-6 ${
                theme === 'dark'
                  ? 'border-electric-blue/40 bg-electric-blue/10 text-electric-blue'
                  : 'border-accent-red/30 bg-accent-red/10 text-accent-red'
              }`}
            >
              {BadgeIcon && <BadgeIcon className="w-5 h-5" />}
              <span className="font-semibold tracking-wide text-sm">{badgeLabel}</span>
            </div>
            <p className={`${eyebrowTextClass} mb-4`}>
              {heroEyebrow}
            </p>
            <h1
              className={`text-4xl sm:text-5xl lg:text-6xl font-orbitron font-bold mb-6 leading-tight ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}
            >
              {heroTitle}
            </h1>
            <p className={`text-lg sm:text-xl font-exo mb-8 leading-relaxed ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>{heroDescription}</p>

            {stats.length > 0 && (
              <div className="grid sm:grid-cols-2 gap-4">
                {stats.map((stat, idx) => (
                  <motion.div 
                    key={stat.label} 
                    initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={shouldReduceMotion ? { duration: 0 } : { delay: 0.3 + idx * 0.1, ease: "easeOut" }}
                    className={`rounded-2xl px-5 py-4 backdrop-blur-sm ${
                      theme === 'dark'
                        ? 'bg-dark-card/80 border border-electric-blue/30 shadow-xl shadow-electric-blue/10'
                        : 'bg-white/80 border border-gray-200 shadow-xl shadow-gray-300/50'
                    }`}
                  >
                    <p className={`text-xs font-exo uppercase tracking-wide font-semibold ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>{stat.label}</p>
                    <p
                      className={`text-3xl font-orbitron font-bold mt-1 ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}
                    >
                      {stat.value}
                    </p>
                    {stat.helper && <p className={`text-xs font-exo mt-1 ${mutedText}`}>{stat.helper}</p>}
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
          {iconHighlights.length > 0 && (
            <div className="grid sm:grid-cols-2 gap-4">
              {iconHighlights.map((highlight, index) => (
                <motion.div
                  key={highlight.title}
                  initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={shouldReduceMotion ? { duration: 0 } : { delay: 0.4 + index * 0.1, ease: "easeOut" }}
                  className={`rounded-2xl p-6 backdrop-blur-sm ${
                    theme === 'dark'
                      ? `bg-dark-card/80 border border-electric-blue/30 ${!shouldReduceMotion && 'transition-all duration-300 hover:border-electric-blue/50 hover:shadow-xl hover:shadow-electric-blue/10'}`
                      : `bg-white/80 border border-gray-200 ${!shouldReduceMotion && 'transition-all duration-300 hover:border-accent-blue/50 hover:shadow-xl hover:shadow-accent-blue/10'}`
                  }`}
                >
                  <div className={`w-12 h-12 rounded-xl mb-4 flex items-center justify-center ${
                    theme === 'dark'
                      ? 'bg-gradient-to-br from-electric-blue/20 to-electric-green/20'
                      : 'bg-gradient-to-br from-accent-red/20 to-accent-blue/20'
                  }`}>
                    <highlight.icon
                      className={theme === 'dark' ? 'text-electric-blue' : 'text-accent-red'}
                      size={24}
                    />
                  </div>
                  <p className={`font-orbitron font-bold text-lg mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {highlight.title}
                  </p>
                  <p className={`text-sm font-exo ${mutedText}`}>{highlight.description}</p>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Features */}
      <section className={`py-16 sm:py-20 ${theme === 'dark' ? 'bg-dark-bg' : 'bg-white'}`}>
        <div className="container mx-auto px-4 sm:px-6">
          <motion.div 
            className="text-center max-w-3xl mx-auto mb-12"
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={shouldReduceMotion ? { duration: 0 } : { ease: "easeOut" }}
          >
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4 ${
              theme === 'dark'
                ? 'bg-electric-blue/20 border border-electric-blue/50 text-electric-blue'
                : 'bg-accent-blue/20 border border-accent-blue/50 text-accent-blue'
            }`}>
              <span className="text-xs font-exo uppercase tracking-wider font-bold">
                Capabilities
              </span>
            </div>
            <h2
              className={`text-3xl sm:text-4xl font-orbitron font-bold mb-4 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}
            >
              {featureHeading}
            </h2>
            <p className={`text-lg font-exo ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Precision-built modules that bring strategy, operations, and experience into one platform.
            </p>
          </motion.div>
          <div className="grid md:grid-cols-2 gap-6">
            {featureCards.map((feature, idx) => (
              <motion.div
                key={feature.title}
                initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={shouldReduceMotion ? { duration: 0 } : { delay: idx * 0.1, ease: "easeOut" }}
                className={`group p-6 sm:p-8 rounded-2xl border ${
                  theme === 'dark'
                    ? `bg-gradient-to-br from-dark-card to-dark-bg border-electric-blue/20 ${!shouldReduceMotion && 'transition-all duration-300 hover:border-electric-blue/50 hover:shadow-xl hover:shadow-electric-blue/10'}`
                    : `bg-white border-gray-200 ${!shouldReduceMotion && 'transition-all duration-300 hover:border-accent-blue/50 hover:shadow-xl hover:shadow-accent-blue/10'}`
                }`}
              >
                <div className={`w-12 h-12 rounded-xl mb-4 flex items-center justify-center ${
                  theme === 'dark'
                    ? 'bg-gradient-to-br from-electric-blue/20 to-electric-green/20'
                    : 'bg-gradient-to-br from-accent-red/20 to-accent-blue/20'
                }`}>
                  <Check className={theme === 'dark' ? 'text-electric-green' : 'text-accent-red'} size={24} />
                </div>
                <h3 className={`text-xl font-orbitron font-bold mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {feature.title}
                </h3>
                <p className={`text-base font-exo leading-relaxed ${mutedText}`}>{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhancements */}
      <section className={`py-16 sm:py-20 ${theme === 'dark' ? 'bg-dark-card/30' : 'bg-gray-50'}`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
          <motion.div 
            className="space-y-6"
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={shouldReduceMotion ? { duration: 0 } : { ease: "easeOut" }}
          >
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mb-2 ${
              theme === 'dark'
                ? 'bg-electric-green/20 border border-electric-green/50 text-electric-green'
                : 'bg-accent-red/20 border border-accent-red/50 text-accent-red'
            }`}>
              <span className="text-xs font-exo uppercase tracking-wider font-bold">
                Benefits
              </span>
            </div>
            <h3 className={`text-3xl sm:text-4xl font-orbitron font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              {enhancementsHeading}
            </h3>
            <p className={`text-lg font-exo leading-relaxed ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Operational improvements that convert your strategy into tangible impact.
            </p>
            <Link
              to="/#contact"
              className={`inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold ${
                theme === 'dark'
                  ? `bg-electric-green text-black ${!shouldReduceMotion && 'transition-all duration-300 transform hover:scale-105 hover:bg-electric-blue hover:shadow-lg hover:shadow-electric-green/30'}`
                  : `bg-accent-red text-white ${!shouldReduceMotion && 'transition-all duration-300 transform hover:scale-105 hover:bg-accent-blue hover:shadow-lg hover:shadow-accent-red/30'}`
              }`}
            >
              Talk to our team
            </Link>
          </motion.div>
          <div className="space-y-4">
            {enhancements.map((point, idx) => (
              <motion.div 
                key={point}
                initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={shouldReduceMotion ? { duration: 0 } : { delay: idx * 0.1, ease: "easeOut" }}
                className={`p-5 rounded-xl border flex items-start gap-4 ${
                  theme === 'dark'
                    ? `bg-dark-card/80 border-electric-blue/20 ${!shouldReduceMotion && 'transition-all duration-300 hover:border-electric-blue/40 hover:shadow-lg hover:shadow-electric-blue/10'}`
                    : `bg-white border-gray-200 ${!shouldReduceMotion && 'transition-all duration-300 hover:border-accent-blue/40 hover:shadow-lg hover:shadow-accent-blue/10'}`
                }`}
              >
                <div className={`mt-0.5 rounded-full p-1.5 ${
                  theme === 'dark' ? 'bg-electric-green/20' : 'bg-accent-red/20'
                }`}>
                  <Check className={theme === 'dark' ? 'text-electric-green' : 'text-accent-red'} size={18} />
                </div>
                <p className={`text-base font-exo ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>{point}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison */}
      <section className={`py-16 sm:py-20 ${theme === 'dark' ? 'bg-dark-bg' : 'bg-white'}`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-12"
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={shouldReduceMotion ? { duration: 0 } : { ease: "easeOut" }}
          >
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4 ${
              theme === 'dark'
                ? 'bg-electric-green/20 border border-electric-green/50 text-electric-green'
                : 'bg-accent-red/20 border border-accent-red/50 text-accent-red'
            }`}>
              <span className="text-xs font-exo uppercase tracking-wider font-bold">
                Comparison
              </span>
            </div>
            <h3 className={`text-3xl sm:text-4xl font-orbitron font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              {comparisonHeading}
            </h3>
            <p className={`text-lg font-exo ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Evaluate how Nano Flows simplifies execution compared to fragmented stacks.
            </p>
          </motion.div>
          
          <motion.div 
            className={`overflow-hidden rounded-2xl border ${
              theme === 'dark' ? 'border-electric-blue/30' : 'border-gray-200'
            }`}
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={shouldReduceMotion ? { duration: 0 } : { ease: "easeOut" }}
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr>
                    <th
                      className={`p-5 text-left font-orbitron font-extrabold ${
                        theme === 'dark'
                          ? 'bg-electric-blue text-black'
                          : 'bg-accent-red text-white'
                      }`}
                    >
                      Feature
                    </th>
                    <th
                      className={`p-5 text-left font-orbitron font-extrabold ${
                        theme === 'dark'
                          ? 'bg-electric-green text-black'
                          : 'bg-accent-blue text-white'
                      }`}
                    >
                      Nano Flows
                    </th>
                    <th
                      className={`p-5 text-left font-orbitron font-bold ${
                        theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-900'
                      }`}
                    >
                      Others
                    </th>
                  </tr>
                </thead>
                <tbody className={theme === 'dark' ? 'bg-dark-card' : 'bg-white'}>
                  {comparison.map((row, idx) => (
                    <motion.tr
                      key={row.name}
                      initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={shouldReduceMotion ? { duration: 0 } : { delay: idx * 0.05, ease: "easeOut" }}
                      className={`border-b ${
                        theme === 'dark'
                          ? `border-electric-blue/10 ${!shouldReduceMotion && 'transition-colors hover:bg-electric-blue/5'}`
                          : `border-gray-100 ${!shouldReduceMotion && 'transition-colors hover:bg-gray-50'}`
                      }`}
                    >
                      <td className={`p-5 font-exo font-medium ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>
                        {row.name}
                      </td>
                      <td
                        className={`p-5 ${
                          theme === 'dark' ? 'bg-electric-green/5' : 'bg-green-50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <StatusIcon status={row.sekeltech.status} />
                          <span className={`text-sm font-exo font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                            {row.sekeltech.text}
                          </span>
                        </div>
                      </td>
                      <td className={`p-5 ${
                        theme === 'dark' ? 'bg-dark-bg/50' : 'bg-red-50'
                      }`}>
                        <div className="flex items-center gap-3">
                          <StatusIcon status={row.others.status} />
                          <span className={`text-sm font-exo ${
                            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                          }`}>
                            {row.others.text}
                          </span>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className={`py-20 ${theme === 'dark' ? 'bg-dark-card/30' : 'bg-gray-50'}`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={shouldReduceMotion ? { duration: 0 } : { ease: "easeOut" }}
            className={`relative overflow-hidden rounded-3xl p-12 sm:p-16 text-center ${
              theme === 'dark'
                ? 'bg-gradient-to-br from-electric-blue/10 via-dark-card to-electric-green/10 border border-electric-blue/30'
                : 'bg-gradient-to-br from-blue-50 via-white to-purple-50 border border-blue-200'
            } shadow-2xl`}
          >
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className={`absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl opacity-20 ${
                theme === 'dark' ? 'bg-electric-blue' : 'bg-accent-blue'
              }`} />
              <div className={`absolute bottom-0 left-0 w-64 h-64 rounded-full blur-3xl opacity-20 ${
                theme === 'dark' ? 'bg-electric-green' : 'bg-accent-red'
              }`} />
            </div>
            
            <div className="relative z-10">
              <h3 className={`text-3xl sm:text-4xl font-orbitron font-bold mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {cta.title}
              </h3>
              <p className={`text-lg sm:text-xl font-exo mb-8 max-w-2xl mx-auto ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
              }`}>{cta.description}</p>
              <Link
                to={cta.buttonLink}
                className={`inline-flex items-center justify-center px-8 py-4 rounded-xl font-bold text-lg ${
                  theme === 'dark'
                    ? `bg-electric-green text-black ${!shouldReduceMotion && 'transition-all duration-300 transform hover:scale-105 hover:bg-electric-blue hover:shadow-xl hover:shadow-electric-green/30'}`
                    : `bg-accent-red text-white ${!shouldReduceMotion && 'transition-all duration-300 transform hover:scale-105 hover:bg-accent-blue hover:shadow-xl hover:shadow-accent-red/30'}`
                }`}
              >
                {cta.buttonLabel}
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
    <Footer />
  </div>
  );
};

export default ProductCategoryTemplate;

