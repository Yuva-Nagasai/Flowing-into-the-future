import { Link, Navigate, useParams } from 'react-router-dom';
import { ArrowLeft, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { productCategories, productItemDetails } from '../../data/productCatalog';

const ProductItemDetail = () => {
  const { category, item } = useParams();
  const { theme } = useTheme();
  const detailKey = `${category}/${item}`;
  const detail = productItemDetails[detailKey];

  if (!detail) {
    return <Navigate to="/" replace />;
  }

  const siblingItems =
    productCategories.find((cat) => cat.slug === category)?.items ?? [];

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-dark-bg' : 'bg-white'}`}>
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
            {detail.categoryTitle}
          </span>
        </div>
      </div>

      <section className={`py-14 sm:py-16 md:py-20 ${
        theme === 'dark' ? 'bg-gradient-to-b from-dark-card to-dark-bg' : 'bg-gradient-to-b from-white to-gray-50'
      }`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <p className={`text-xs font-exo uppercase tracking-[0.4em] mb-4 ${
              theme === 'dark' ? 'text-electric-green' : 'text-accent-red'
            }`}>
              {detail.categoryTitle}
            </p>
            <h1 className={`text-4xl sm:text-5xl font-orbitron font-bold mb-4 ${
              theme === 'dark' ? 'text-white' : 'text-black'
            }`}>
              {detail.title}
            </h1>
            <p className={`text-base sm:text-lg font-exo mb-6 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              {detail.summary}
            </p>
            <div className="space-y-2">
              {detail.highlights.map((point, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <Check className={theme === 'dark' ? 'text-electric-green' : 'text-accent-red'} size={18} />
                  <p className={`text-sm font-exo ${
                    theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
                  }`}>
                    {point}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div className={`rounded-3xl p-6 ${
            theme === 'dark' ? 'bg-dark-card border border-electric-blue/20' : 'bg-white border border-gray-200'
          } shadow-xl`}>
            <h3 className={`text-lg font-orbitron font-semibold mb-4 ${
              theme === 'dark' ? 'text-white' : 'text-black'
            }`}>
              Explore other capabilities
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {siblingItems.map((sibling) => (
                <Link
                  key={sibling.slug}
                  to={`/products/${category}/${sibling.slug}`}
                  className={`px-4 py-3 rounded-xl border text-sm font-exo transition-colors ${
                    theme === 'dark'
                      ? 'border-electric-blue/20 text-gray-200 hover:border-electric-blue hover:text-electric-green'
                      : 'border-gray-200 text-gray-700 hover:border-accent-red hover:text-accent-red'
                  } ${sibling.slug === item ? 'pointer-events-none opacity-60' : ''}`}
                >
                  {sibling.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className={`text-3xl font-orbitron font-bold mb-4 ${
            theme === 'dark' ? 'text-white' : 'text-black'
          }`}>
            Capabilities tailored for {detail.title}
          </h2>
          <p className={`text-base font-exo ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Built-in automation, governance, and analytics keep this capability always-on and revenue ready.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {detail.features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className={`p-5 rounded-2xl border ${
                theme === 'dark' ? 'bg-dark-card border-electric-blue/20' : 'bg-white border-gray-200'
              } shadow-lg`}
            >
              <h3 className={`text-xl font-orbitron font-semibold mb-3 ${
                theme === 'dark' ? 'text-white' : 'text-black'
              }`}>
                {detail.title}
              </h3>
              <p className={`text-sm font-exo ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                {feature}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <h3 className={`text-3xl font-orbitron font-bold mb-3 ${
            theme === 'dark' ? 'text-white' : 'text-black'
          }`}>
            Nano Flows vs Alternatives
          </h3>
          <p className={`text-sm font-exo ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Every differentiator you need to keep {detail.title.toLowerCase()} ahead of the curve.
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className={`p-4 text-left font-orbitron font-bold border ${
                  theme === 'dark' ? 'bg-electric-blue text-black border-gray-700' : 'bg-accent-red text-white border-gray-300'
                }`}>
                  Capability
                </th>
                <th className={`p-4 text-left font-orbitron font-bold border ${
                  theme === 'dark' ? 'bg-electric-blue text-black border-gray-700' : 'bg-accent-red text-white border-gray-300'
                }`}>
                  Nano Flows
                </th>
                <th className={`p-4 text-left font-orbitron font-bold border ${
                  theme === 'dark' ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-200 text-black border-gray-300'
                }`}>
                  Others
                </th>
              </tr>
            </thead>
            <tbody>
              {detail.comparison.map((row) => (
                <tr key={row.name} className={`border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                  <td className={`p-4 font-exo border-r ${theme === 'dark' ? 'text-white border-gray-700' : 'text-gray-800 border-gray-300'}`}>
                    {row.name}
                  </td>
                  <td className={`p-4 border-r ${theme === 'dark' ? 'bg-dark-lighter border-gray-700' : 'bg-green-50 border-gray-300'}`}>
                    <div className={`flex items-center gap-3 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                      <span className="text-sm font-exo">
                        {row.sekeltech.text}
                      </span>
                    </div>
                  </td>
                  <td className={theme === 'dark' ? 'p-4 bg-dark-lighter/40 text-white' : 'p-4 bg-red-50'}>
                    <div className={`flex items-center gap-3 ${theme === 'dark' ? 'text-white' : 'text-gray-700'}`}>
                      <span className="text-sm font-exo">
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
    </div>
  );
};

export default ProductItemDetail;


