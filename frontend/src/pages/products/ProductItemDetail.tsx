import { Link, Navigate, useParams } from 'react-router-dom';
import { Check, Sparkles } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { productCategories, productItemDetails } from '../../data/productCatalog';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import {
  sectionContainerVariants,
  staggeredVariants,
  itemVariants,
  scaleHoverVariants,
  glowPulseAnimation,
  viewportConfig
} from '../../utils/motionPresets';

const ProductItemDetail = () => {
  const { category, item } = useParams();
  const { theme } = useTheme();
  const shouldReduceMotion = useReducedMotion();
  const detailKey = `${category}/${item}`;
  const detail = productItemDetails[detailKey];
  if (!detail) {
    return <Navigate to="/" replace />;
  }

  const siblingItems =
    productCategories.find((cat) => cat.slug === category)?.items ?? [];
  const shouldAnimate = !shouldReduceMotion;

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-dark-bg' : 'bg-gray-50'}`}>
      <Header />
      <main className="pt-24 lg:pt-32">
        <motion.section
          className={`relative py-16 sm:py-20 md:py-24 overflow-hidden ${
            theme === 'dark'
              ? 'bg-gradient-to-br from-dark-card via-dark-bg to-black'
              : 'bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30'
          }`}
          {...(shouldAnimate
            ? {
                initial: 'hidden' as const,
                whileInView: 'visible' as const,
                viewport: viewportConfig,
                variants: sectionContainerVariants
              }
            : {})}
        >
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className={`absolute -top-40 -right-40 w-96 h-96 rounded-full blur-3xl opacity-20 ${
            theme === 'dark' ? 'bg-electric-blue' : 'bg-accent-blue'
          }`} />
          <div className={`absolute -bottom-40 -left-40 w-96 h-96 rounded-full blur-3xl opacity-20 ${
            theme === 'dark' ? 'bg-electric-green' : 'bg-accent-red'
          }`} />
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center relative z-10">
          <motion.div variants={shouldAnimate ? staggeredVariants : undefined}>
            <motion.div
              variants={shouldAnimate ? itemVariants : undefined}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 ${
                theme === 'dark'
                  ? 'bg-electric-green/20 border border-electric-green/50 text-electric-green'
                  : 'bg-accent-red/20 border border-accent-red/50 text-accent-red'
              }`}
            >
              <Sparkles size={16} />
              <span className="text-xs font-exo uppercase tracking-wider font-bold">
                {detail.categoryTitle}
              </span>
            </motion.div>

            <motion.h1
              variants={shouldAnimate ? itemVariants : undefined}
              className={`text-4xl sm:text-5xl lg:text-6xl font-orbitron font-bold mb-6 leading-tight ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}
            >
              {detail.title}
            </motion.h1>

            <motion.p
              variants={shouldAnimate ? itemVariants : undefined}
              className={`text-lg sm:text-xl font-exo mb-8 leading-relaxed ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}
            >
              {detail.summary}
            </motion.p>

            <motion.div variants={shouldAnimate ? staggeredVariants : undefined} className="space-y-3">
              {detail.highlights.map((point, idx) => (
                <motion.div
                  key={idx}
                  variants={shouldAnimate ? itemVariants : undefined}
                  className="flex items-start gap-3"
                >
                  <motion.div
                    className={`mt-1 rounded-full p-1 ${
                      theme === 'dark' ? 'bg-electric-green/20' : 'bg-accent-red/20'
                    }`}
                    animate={
                      shouldAnimate
                        ? glowPulseAnimation(
                            theme,
                            theme === 'dark' ? '#22d3ee' : '#ff6f3c'
                          )
                        : undefined
                    }
                    transition={shouldAnimate ? { duration: 3, repeat: Infinity } : undefined}
                  >
                    <Check className={theme === 'dark' ? 'text-electric-green' : 'text-accent-red'} size={16} />
                  </motion.div>
                  <p
                    className={`text-base font-exo ${
                      theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
                    }`}
                  >
                    {point}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
          
          <motion.div
            variants={shouldAnimate ? itemVariants : undefined}
            className={`rounded-3xl p-8 backdrop-blur-sm ${
              theme === 'dark' 
                ? 'bg-dark-card/80 border border-electric-blue/30 shadow-2xl shadow-electric-blue/10' 
                : 'bg-white/80 border border-gray-200 shadow-2xl shadow-gray-300/50'
            }`}
          >
            <motion.h3
              variants={shouldAnimate ? itemVariants : undefined}
              className={`text-xl font-orbitron font-bold mb-6 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}
            >
              Explore other capabilities
            </motion.h3>
            <motion.div
              className="grid grid-cols-1 gap-3"
              variants={shouldAnimate ? staggeredVariants : undefined}
            >
              {siblingItems.map((sibling, idx) => (
                <motion.div key={sibling.slug} variants={shouldAnimate ? itemVariants : undefined}>
                  <Link
                    to={`/products/${category}/${sibling.slug}`}
                    className={`block px-5 py-4 rounded-xl border text-sm font-exo font-medium ${
                      theme === 'dark'
                        ? `border-electric-blue/20 bg-dark-bg/50 text-gray-200 ${!shouldReduceMotion && 'transition-all duration-300 hover:border-electric-blue hover:bg-electric-blue/10 hover:text-electric-green hover:shadow-lg hover:shadow-electric-blue/20'}`
                        : `border-gray-200 bg-gray-50 text-gray-700 ${!shouldReduceMotion && 'transition-all duration-300 hover:border-accent-red hover:bg-accent-red/5 hover:text-accent-red hover:shadow-lg hover:shadow-accent-red/20'}`
                    } ${sibling.slug === item ? 'pointer-events-none opacity-50' : (!shouldReduceMotion && 'transform hover:scale-[1.02]')}`}
                  >
                    {sibling.name}
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

        <motion.section
          className={`py-16 sm:py-20 ${theme === 'dark' ? 'bg-dark-bg' : 'bg-white'}`}
          {...(shouldAnimate
            ? {
                initial: 'hidden' as const,
                whileInView: 'visible' as const,
                viewport: viewportConfig,
                variants: sectionContainerVariants
              }
            : {})}
        >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto">
            <motion.div variants={shouldAnimate ? staggeredVariants : undefined}>
              <motion.div
                variants={shouldAnimate ? itemVariants : undefined}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4 ${
                  theme === 'dark'
                    ? 'bg-electric-blue/20 border border-electric-blue/50 text-electric-blue'
                    : 'bg-accent-blue/20 border border-accent-blue/50 text-accent-blue'
                }`}
              >
                <span className="text-xs font-exo uppercase tracking-wider font-bold">
                  Capabilities
                </span>
              </motion.div>
              <motion.h2
                variants={shouldAnimate ? itemVariants : undefined}
                className={`text-3xl sm:text-4xl font-orbitron font-bold mb-4 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}
              >
                Capabilities tailored for {detail.title}
              </motion.h2>
              <motion.p
                variants={shouldAnimate ? itemVariants : undefined}
                className={`text-lg font-exo ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                }`}
              >
                Built-in automation, governance, and analytics keep this capability always-on and revenue ready.
              </motion.p>
            </motion.div>
          </div>
          <motion.div className="grid md:grid-cols-2 gap-6" variants={shouldAnimate ? staggeredVariants : undefined}>
            {detail.features.map((feature, idx) => (
              <motion.div
                key={idx}
                variants={
                  shouldAnimate
                    ? {
                        ...itemVariants,
                        hover: scaleHoverVariants.hover
                      }
                    : undefined
                }
                whileHover={shouldAnimate ? 'hover' : undefined}
                className={`group p-6 sm:p-8 rounded-2xl border ${
                  theme === 'dark' 
                    ? `bg-gradient-to-br from-dark-card to-dark-bg border-electric-blue/20 ${!shouldReduceMotion && 'transition-all duration-300 hover:border-electric-blue/50 hover:shadow-xl hover:shadow-electric-blue/10'}`
                    : `bg-white border-gray-200 ${!shouldReduceMotion && 'transition-all duration-300 hover:border-accent-blue/50 hover:shadow-xl hover:shadow-accent-blue/10'}`
                }`}
              >
                <motion.div
                  className={`w-12 h-12 rounded-xl mb-4 flex items-center justify-center ${
                    theme === 'dark'
                      ? 'bg-gradient-to-br from-electric-blue/20 to-electric-green/20'
                      : 'bg-gradient-to-br from-accent-red/20 to-accent-blue/20'
                  }`}
                  animate={
                    shouldAnimate
                      ? glowPulseAnimation(
                          theme,
                          theme === 'dark' ? '#22d3ee' : '#1d4ed8'
                        )
                      : undefined
                  }
                  transition={shouldAnimate ? { duration: 3.5, repeat: Infinity, delay: idx * 0.1 } : undefined}
                >
                  <Check className={theme === 'dark' ? 'text-electric-green' : 'text-accent-red'} size={24} />
                </motion.div>
                <motion.h3
                  variants={shouldAnimate ? itemVariants : undefined}
                  className={`text-xl font-orbitron font-bold mb-3 ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}
                >
                  Feature #{idx + 1}
                </motion.h3>
                <motion.p
                  variants={shouldAnimate ? itemVariants : undefined}
                  className={`text-base font-exo leading-relaxed ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}
                >
                  {feature}
                </motion.p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      <motion.section
        className={`py-16 sm:py-20 ${theme === 'dark' ? 'bg-dark-card/30' : 'bg-gray-50'}`}
        {...(shouldAnimate
          ? {
              initial: 'hidden' as const,
              whileInView: 'visible' as const,
              viewport: viewportConfig,
              variants: sectionContainerVariants
            }
          : {})}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="text-center mb-12" variants={shouldAnimate ? staggeredVariants : undefined}>
            <motion.div
              variants={shouldAnimate ? itemVariants : undefined}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4 ${
                theme === 'dark'
                  ? 'bg-electric-green/20 border border-electric-green/50 text-electric-green'
                  : 'bg-accent-red/20 border border-accent-red/50 text-accent-red'
              }`}
            >
              <span className="text-xs font-exo uppercase tracking-wider font-bold">
                Comparison
              </span>
            </motion.div>
            <motion.h3
              variants={shouldAnimate ? itemVariants : undefined}
              className={`text-3xl sm:text-4xl font-orbitron font-bold mb-4 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}
            >
              Nano Flows vs Alternatives
            </motion.h3>
            <motion.p
              variants={shouldAnimate ? itemVariants : undefined}
              className={`text-lg font-exo ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
              }`}
            >
              Every differentiator you need to keep {detail.title.toLowerCase()} ahead of the curve.
            </motion.p>
          </motion.div>
          
          <motion.div
            className={`overflow-hidden rounded-2xl border ${
              theme === 'dark' ? 'border-electric-blue/30' : 'border-gray-200'
            }`}
            variants={shouldAnimate ? itemVariants : undefined}
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className={`p-5 text-left font-orbitron font-extrabold ${
                      theme === 'dark' 
                        ? 'bg-electric-blue text-black' 
                        : 'bg-accent-red text-white'
                    }`}>
                      Capability
                    </th>
                    <th className={`p-5 text-left font-orbitron font-extrabold ${
                      theme === 'dark' 
                        ? 'bg-electric-green text-black' 
                        : 'bg-accent-blue text-white'
                    }`}>
                      Nano Flows
                    </th>
                    <th className={`p-5 text-left font-orbitron font-bold ${
                      theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-900'
                    }`}>
                      Others
                    </th>
                  </tr>
                </thead>
                <motion.tbody
                  className={theme === 'dark' ? 'bg-dark-card' : 'bg-white'}
                  variants={shouldAnimate ? staggeredVariants : undefined}
                >
                  {detail.comparison.map((row, idx) => (
                    <motion.tr
                      key={row.name}
                      variants={shouldAnimate ? itemVariants : undefined}
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
                      <td className={`p-5 ${
                        theme === 'dark' ? 'bg-electric-green/5' : 'bg-green-50'
                      }`}>
                        <div className="flex items-center gap-3">
                          <motion.div
                            className={`rounded-full p-1.5 ${
                              theme === 'dark' ? 'bg-electric-green/20' : 'bg-green-500/20'
                            }`}
                            animate={
                              shouldAnimate
                                ? glowPulseAnimation(
                                    theme,
                                    theme === 'dark' ? '#22d3ee' : '#22c55e'
                                  )
                                : undefined
                            }
                            transition={shouldAnimate ? { duration: 3, repeat: Infinity, delay: idx * 0.05 } : undefined}
                          >
                            <Check className={theme === 'dark' ? 'text-electric-green' : 'text-green-600'} size={16} />
                          </motion.div>
                          <span className={`text-sm font-exo font-medium ${
                            theme === 'dark' ? 'text-white' : 'text-gray-800'
                          }`}>
                            {row.sekeltech.text}
                          </span>
                        </div>
                      </td>
                      <td className={`p-5 ${
                        theme === 'dark' ? 'bg-dark-bg/50' : 'bg-red-50'
                      }`}>
                        <span className={`text-sm font-exo ${
                          theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                          {row.others.text}
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </motion.tbody>
              </table>
            </div>
          </motion.div>
        </div>
        </motion.section>
      </main>
      <Footer />
    </div>
  );
};

export default ProductItemDetail;


