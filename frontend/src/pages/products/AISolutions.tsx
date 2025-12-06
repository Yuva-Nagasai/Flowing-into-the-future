import { Link } from 'react-router-dom';
import { Brain, Sparkles, CheckCircle2 } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { motion } from 'framer-motion';
import { useEffect } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import SEO from '../../components/SEO';

const AISolutions = () => {
  const { theme } = useTheme();

  return (
    <>
      <SEO
        title="AI Solutions - NanoFlows | Artificial Intelligence Services"
        description="NanoFlows delivers cutting-edge AI solutions including machine learning, deep learning, NLP, and predictive analytics. Transform your business with intelligent automation."
        keywords="AI solutions, artificial intelligence, machine learning, deep learning, NLP, predictive analytics, intelligent automation"
      />
      <div className={`min-h-screen ${theme === 'dark' ? 'bg-dark-bg' : 'bg-white'}`}>
        <Header />
      <main className="pt-24 lg:pt-32">
        {/* Hero Section */}
        <section className={`relative py-12 sm:py-16 md:py-20 overflow-hidden ${
          theme === 'dark' ? 'bg-dark-bg' : 'bg-gray-50'
        }`}>
          <div className={`absolute inset-0 ${theme === 'dark' ? 'gradient-mesh' : 'gradient-mesh-light'}`} />
          <div className="container mx-auto px-4 sm:px-6 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-4xl mx-auto"
            >
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border mb-6 ${
                theme === 'dark' ? 'border-electric-blue/30 bg-electric-blue/10' : 'border-accent-red/30 bg-accent-red/10'
              }`}>
                <Brain className={`w-5 h-5 ${theme === 'dark' ? 'text-electric-green' : 'text-accent-red'}`} />
                <span className={`font-semibold ${theme === 'dark' ? 'text-electric-blue' : 'text-accent-red'}`}>
                  AI Solutions
                </span>
              </div>
              <h1 className={`text-4xl sm:text-5xl md:text-6xl font-bold mb-6 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`} style={{ fontFamily: 'Orbitron, sans-serif' }}>
                Artificial Intelligence{' '}
                <span className={theme === 'dark' ? 'text-electric-green' : 'text-accent-red'}>
                  Solutions
                </span>
              </h1>
              <p className={`text-lg sm:text-xl md:text-2xl mb-8 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Transform your business with cutting-edge AI solutions powered by machine learning, 
                deep learning, and advanced neural networks. Nano Flows delivers intelligent automation 
                that drives measurable results.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-12 sm:py-16 md:py-20">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-4xl mx-auto">
            {/* How We Relate */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-12 sm:mb-16"
            >
              <h2 className={`text-3xl sm:text-4xl font-bold mb-6 flex items-center gap-3 ${
                theme === 'dark' ? 'text-electric-green' : 'text-accent-red'
              }`} style={{ fontFamily: 'Orbitron, sans-serif' }}>
                <Sparkles className="w-8 h-8" />
                How Nano Flows Relates to AI Solutions
              </h2>
              <div className={`prose prose-lg max-w-none ${
                theme === 'dark' ? 'prose-invert' : ''
              }`}>
                <p className={`text-base sm:text-lg leading-relaxed mb-4 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  As a leading AI innovation company, Nano Flows has been at the forefront of artificial 
                  intelligence development since our inception. We combine deep expertise in machine learning, 
                  neural networks, and natural language processing to create AI solutions that solve real-world 
                  business challenges.
                </p>
                <p className={`text-base sm:text-lg leading-relaxed ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Our team of AI specialists works closely with organizations to understand their unique needs 
                  and develop custom AI systems that drive measurable results. From startups to enterprise-level 
                  companies, we've successfully deployed AI solutions across various industries including healthcare, 
                  finance, e-commerce, and manufacturing.
                </p>
              </div>
            </motion.div>

            {/* How We Help */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mb-12 sm:mb-16"
            >
              <h2 className={`text-3xl sm:text-4xl font-bold mb-6 flex items-center gap-3 ${
                theme === 'dark' ? 'text-electric-blue' : 'text-accent-blue'
              }`} style={{ fontFamily: 'Orbitron, sans-serif' }}>
                <Sparkles className="w-8 h-8" />
                How We Help Your Business
              </h2>
              <div className="space-y-4 sm:space-y-6">
                {[
                  'Develop custom AI models tailored to your specific business requirements and industry needs',
                  'Implement intelligent automation systems that reduce manual work by up to 80% and increase operational efficiency',
                  'Create predictive analytics platforms that forecast trends and optimize decision-making processes',
                  'Build natural language processing systems for chatbots, voice assistants, and advanced content analysis',
                  'Provide comprehensive AI consulting and training to help your team leverage artificial intelligence effectively',
                  'Deploy scalable AI infrastructure that grows with your business needs and handles increasing data volumes'
                ].map((item, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + idx * 0.1 }}
                    className="flex items-start gap-4"
                  >
                    <CheckCircle2 className={`w-6 h-6 flex-shrink-0 mt-1 ${
                      theme === 'dark' ? 'text-electric-green' : 'text-accent-red'
                    }`} />
                    <p className={`text-base sm:text-lg ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      {item}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Key Features */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mb-12 sm:mb-16"
            >
              <h2 className={`text-3xl sm:text-4xl font-bold mb-6 flex items-center gap-3 ${
                theme === 'dark' ? 'text-electric-green' : 'text-accent-red'
              }`} style={{ fontFamily: 'Orbitron, sans-serif' }}>
                <Sparkles className="w-8 h-8" />
                Key AI Features & Capabilities
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                {[
                  'Machine Learning & Deep Learning Models',
                  'Natural Language Processing (NLP)',
                  'Computer Vision & Image Recognition',
                  'Predictive Analytics & Forecasting',
                  'Intelligent Automation & RPA',
                  'AI-Powered Decision Support Systems'
                ].map((feature, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.7 + idx * 0.05 }}
                    className={`p-4 sm:p-6 rounded-lg border ${
                      theme === 'dark'
                        ? 'bg-dark-lighter border-electric-blue/20 hover:border-electric-blue/40'
                        : 'bg-gray-50 border-gray-200 hover:border-accent-red/40'
                    } transition-all duration-300`}
                  >
                    <h3 className={`text-lg font-semibold mb-2 ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                      {feature}
                    </h3>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* CTA Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className={`rounded-2xl p-8 sm:p-12 text-center ${
                theme === 'dark'
                  ? 'bg-gradient-to-r from-electric-blue/20 to-electric-green/20 border border-electric-blue/30'
                  : 'bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200'
              }`}
            >
              <h3 className={`text-2xl sm:text-3xl font-bold mb-4 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`} style={{ fontFamily: 'Orbitron, sans-serif' }}>
                Ready to Transform Your Business with AI?
              </h3>
              <p className={`text-lg mb-6 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Let's discuss how our AI solutions can drive innovation and growth for your organization.
              </p>
              <Link
                to="/#contact"
                className={`inline-block px-8 py-4 rounded-lg font-semibold transition-all duration-300 ${
                  theme === 'dark'
                    ? 'bg-electric-green text-black hover:bg-electric-blue hover:glow-green'
                    : 'bg-accent-red text-white hover:bg-accent-blue hover:glow-red'
                }`}
              >
                Get Started Today
              </Link>
            </motion.div>
          </div>
        </div>
        </section>
      </main>
      <Footer />
      </div>
    </>
  );
};

export default AISolutions;

