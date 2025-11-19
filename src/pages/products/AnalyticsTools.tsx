import { Link } from 'react-router-dom';
import { ArrowLeft, BarChart3, Sparkles, CheckCircle2 } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { motion } from 'framer-motion';
import { useEffect } from 'react';

const AnalyticsTools = () => {
  const { theme } = useTheme();

  useEffect(() => {
    document.title = 'Analytics Tools - Nano Flows | Business Intelligence & Data Analytics';
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Nano Flows develops powerful analytics tools and business intelligence platforms. Transform data into actionable insights with real-time dashboards, predictive analytics, and big data processing.');
    }
  }, []);

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-dark-bg' : 'bg-white'}`}>
      {/* Back Button */}
      <div className={`sticky top-0 z-50 border-b backdrop-blur-md ${
        theme === 'dark' ? 'bg-dark-card/90 border-gray-800' : 'bg-white/90 border-gray-200'
      }`}>
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <Link
            to="/"
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
              theme === 'dark'
                ? 'bg-electric-green text-black hover:bg-electric-blue hover:glow-green'
                : 'bg-accent-red text-white hover:bg-accent-blue hover:glow-red'
            }`}
          >
            <ArrowLeft size={20} />
            <span>Back to Website</span>
          </Link>
        </div>
      </div>

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
              <BarChart3 className={`w-5 h-5 ${theme === 'dark' ? 'text-electric-green' : 'text-accent-red'}`} />
              <span className={`font-semibold ${theme === 'dark' ? 'text-electric-blue' : 'text-accent-red'}`}>
                Analytics Tools
              </span>
            </div>
            <h1 className={`text-4xl sm:text-5xl md:text-6xl font-bold mb-6 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`} style={{ fontFamily: 'Orbitron, sans-serif' }}>
              Analytics & Business{' '}
              <span className={theme === 'dark' ? 'text-electric-green' : 'text-accent-red'}>
                Intelligence
              </span>
            </h1>
            <p className={`text-lg sm:text-xl md:text-2xl mb-8 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Transform raw data into actionable insights with powerful analytics tools. Enable data-driven 
              decision-making and strategic business intelligence across all levels of your organization 
              with real-time dashboards and predictive analytics.
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
                How Nano Flows Relates to Analytics Tools
              </h2>
              <div className={`prose prose-lg max-w-none ${
                theme === 'dark' ? 'prose-invert' : ''
              }`}>
                <p className={`text-base sm:text-lg leading-relaxed mb-4 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Data analytics is at the core of Nano Flows' expertise. We specialize in building 
                  comprehensive analytics platforms that process, visualize, and interpret complex datasets. 
                  Our analytics tools are designed to handle everything from real-time business metrics 
                  to historical trend analysis.
                </p>
                <p className={`text-base sm:text-lg leading-relaxed ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  We combine advanced data processing techniques with intuitive visualization to make 
                  complex data accessible to everyone. Our solutions help organizations understand their 
                  performance, identify opportunities, and make informed strategic decisions. From startups 
                  to Fortune 500 companies, we've built analytics systems that process millions of data 
                  points daily.
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
                  'Build custom analytics dashboards that provide real-time insights into your business metrics and KPIs',
                  'Implement big data processing systems that handle millions of data points efficiently and cost-effectively',
                  'Create predictive analytics models that forecast future trends and behaviors with high accuracy',
                  'Develop data visualization tools that make complex information easy to understand and act upon',
                  'Integrate analytics across all your business systems for unified reporting and comprehensive insights',
                  'Provide data consulting services to identify key performance indicators and metrics that matter most',
                  'Enable self-service analytics so your team can explore data independently without technical barriers'
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
                Key Analytics Features
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                {[
                  'Real-Time Business Intelligence Dashboards',
                  'Big Data Processing & Analytics',
                  'Predictive Modeling & Forecasting',
                  'Data Visualization & Reporting',
                  'Custom KPI Tracking Systems',
                  'Data Integration & ETL Pipelines'
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
                Ready to Unlock Your Data's Potential?
              </h3>
              <p className={`text-lg mb-6 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Let's discuss how our analytics tools can transform your data into strategic insights.
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
    </div>
  );
};

export default AnalyticsTools;

