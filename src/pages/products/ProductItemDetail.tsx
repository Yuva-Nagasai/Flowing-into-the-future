import { Link, Navigate, useParams } from 'react-router-dom';
import { ArrowLeft, Check, Sparkles } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { productCategories, productItemDetails } from '../../data/productCatalog';

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

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-dark-bg' : 'bg-gray-50'}`}>
      <div
        className={`sticky top-0 z-50 border-b backdrop-blur-xl ${
          theme === 'dark' 
            ? 'bg-dark-card/95 border-electric-blue/20 shadow-lg shadow-electric-blue/5' 
            : 'bg-white/95 border-gray-200 shadow-lg shadow-gray-200/50'
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link
            to="/"
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold ${
              theme === 'dark'
                ? `bg-electric-green text-black ${!shouldReduceMotion && 'transition-all duration-300 transform hover:scale-105 hover:bg-electric-blue hover:shadow-lg hover:shadow-electric-green/30'}`
                : `bg-accent-red text-white ${!shouldReduceMotion && 'transition-all duration-300 transform hover:scale-105 hover:bg-accent-blue hover:shadow-lg hover:shadow-accent-red/30'}`
            }`}
          >
            <ArrowLeft size={18} />
            Back to Website
          </Link>
          <span
            className={`text-xs font-exo uppercase tracking-[0.3em] font-semibold ${
              theme === 'dark' ? 'text-electric-green' : 'text-accent-red'
            }`}
          >
            {detail.categoryTitle}
          </span>
        </div>
      </div>

      <section className={`relative py-16 sm:py-20 md:py-24 overflow-hidden ${
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
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center relative z-10">
          <motion.div
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.6, ease: "easeOut" }}
          >
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 ${
              theme === 'dark'
                ? 'bg-electric-green/20 border border-electric-green/50 text-electric-green'
                : 'bg-accent-red/20 border border-accent-red/50 text-accent-red'
            }`}>
              <Sparkles size={16} />
              <span className="text-xs font-exo uppercase tracking-wider font-bold">
                {detail.categoryTitle}
              </span>
            </div>
            
            <h1 className={`text-4xl sm:text-5xl lg:text-6xl font-orbitron font-bold mb-6 leading-tight ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              {detail.title}
            </h1>
            
            <p className={`text-lg sm:text-xl font-exo mb-8 leading-relaxed ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              {detail.summary}
            </p>
            
            <div className="space-y-3">
              {detail.highlights.map((point, idx) => (
                <motion.div 
                  key={idx} 
                  initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={shouldReduceMotion ? { duration: 0 } : { delay: idx * 0.1, ease: "easeOut" }}
                  className="flex items-start gap-3"
                >
                  <div className={`mt-1 rounded-full p-1 ${
                    theme === 'dark' ? 'bg-electric-green/20' : 'bg-accent-red/20'
                  }`}>
                    <Check className={theme === 'dark' ? 'text-electric-green' : 'text-accent-red'} size={16} />
                  </div>
                  <p className={`text-base font-exo ${
                    theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
                  }`}>
                    {point}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
          
          <motion.div 
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className={`rounded-3xl p-8 backdrop-blur-sm ${
              theme === 'dark' 
                ? 'bg-dark-card/80 border border-electric-blue/30 shadow-2xl shadow-electric-blue/10' 
                : 'bg-white/80 border border-gray-200 shadow-2xl shadow-gray-300/50'
            }`}
          >
            <h3 className={`text-xl font-orbitron font-bold mb-6 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Explore other capabilities
            </h3>
            <div className="grid grid-cols-1 gap-3">
              {siblingItems.map((sibling, idx) => (
                <motion.div
                  key={sibling.slug}
                  initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={shouldReduceMotion ? { duration: 0 } : { delay: 0.3 + idx * 0.1, ease: "easeOut" }}
                >
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
            </div>
          </motion.div>
        </div>
      </section>

      <section className={`py-16 sm:py-20 ${theme === 'dark' ? 'bg-dark-bg' : 'bg-white'}`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto">
            <motion.div
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
              <h2 className={`text-3xl sm:text-4xl font-orbitron font-bold mb-4 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Capabilities tailored for {detail.title}
              </h2>
              <p className={`text-lg font-exo ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Built-in automation, governance, and analytics keep this capability always-on and revenue ready.
              </p>
            </motion.div>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {detail.features.map((feature, idx) => (
              <motion.div
                key={idx}
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
                <h3 className={`text-xl font-orbitron font-bold mb-3 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  Feature #{idx + 1}
                </h3>
                <p className={`text-base font-exo leading-relaxed ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  {feature}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className={`py-16 sm:py-20 ${theme === 'dark' ? 'bg-dark-card/30' : 'bg-gray-50'}`}>
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
            <h3 className={`text-3xl sm:text-4xl font-orbitron font-bold mb-4 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Nano Flows vs Alternatives
            </h3>
            <p className={`text-lg font-exo ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Every differentiator you need to keep {detail.title.toLowerCase()} ahead of the curve.
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
                <tbody className={theme === 'dark' ? 'bg-dark-card' : 'bg-white'}>
                  {detail.comparison.map((row, idx) => (
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
                      <td className={`p-5 ${
                        theme === 'dark' ? 'bg-electric-green/5' : 'bg-green-50'
                      }`}>
                        <div className="flex items-center gap-3">
                          <div className={`rounded-full p-1.5 ${
                            theme === 'dark' ? 'bg-electric-green/20' : 'bg-green-500/20'
                          }`}>
                            <Check className={theme === 'dark' ? 'text-electric-green' : 'text-green-600'} size={16} />
                          </div>
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
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default ProductItemDetail;


