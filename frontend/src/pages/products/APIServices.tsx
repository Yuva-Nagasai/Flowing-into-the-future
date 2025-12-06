import { Link } from 'react-router-dom';
import { Code, Sparkles, CheckCircle2 } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { motion } from 'framer-motion';
import { useEffect } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import SEO from '../../components/SEO';

const APIServices = () => {
  const { theme } = useTheme();

  return (
    <>
      <SEO
        title="API Services - NanoFlows | RESTful & GraphQL API Development"
        description="NanoFlows provides robust API development and integration services. RESTful and GraphQL APIs with security, scalability, and comprehensive documentation for seamless system integration."
        keywords="API services, RESTful API, GraphQL API, API development, API integration, web services"
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
                <Code className={`w-5 h-5 ${theme === 'dark' ? 'text-electric-green' : 'text-accent-red'}`} />
                <span className={`font-semibold ${theme === 'dark' ? 'text-electric-blue' : 'text-accent-red'}`}>
                  API Services
                </span>
              </div>
              <h1 className={`text-4xl sm:text-5xl md:text-6xl font-bold mb-6 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`} style={{ fontFamily: 'Orbitron, sans-serif' }}>
                API Development &{' '}
                <span className={theme === 'dark' ? 'text-electric-green' : 'text-accent-red'}>
                  Integration
                </span>
              </h1>
              <p className={`text-lg sm:text-xl md:text-2xl mb-8 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Enable seamless communication between systems, applications, and services with robust API 
                development and integration services. Power modern digital ecosystems with reliable, scalable 
                API solutions.
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
                How Nano Flows Relates to API Services
              </h2>
              <div className={`prose prose-lg max-w-none ${
                theme === 'dark' ? 'prose-invert' : ''
              }`}>
                <p className={`text-base sm:text-lg leading-relaxed mb-4 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  APIs are the backbone of modern software architecture, and Nano Flows has extensive experience 
                  in designing, developing, and maintaining high-performance API services. We understand that 
                  well-designed APIs enable businesses to integrate with partners, connect internal systems, 
                  and create extensible platforms.
                </p>
                <p className={`text-base sm:text-lg leading-relaxed ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Our API services are built with security, scalability, and developer experience in mind, 
                  ensuring they can handle high traffic loads while remaining easy to use and maintain. 
                  We've developed APIs that process millions of requests daily, serving everything from 
                  mobile apps to enterprise systems, with 99.9% uptime guarantees.
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
                  'Design RESTful and GraphQL APIs that follow industry best practices and standards for optimal performance',
                  'Develop secure API endpoints with authentication, authorization, and rate limiting to protect your systems',
                  'Create comprehensive API documentation that makes integration straightforward for developers',
                  'Build API gateways that manage traffic, monitor usage, and ensure reliability under high load',
                  'Integrate third-party APIs into your existing systems and workflows seamlessly',
                  'Implement API versioning strategies to maintain backward compatibility as your services evolve',
                  'Provide API testing, monitoring, and performance optimization services for continuous improvement',
                  'Offer API consulting to help you design the right API architecture for your specific needs'
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
                Key API Features
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                {[
                  'RESTful & GraphQL API Development',
                  'API Gateway & Management',
                  'API Security & Authentication',
                  'API Documentation & Developer Portals',
                  'Third-Party API Integration',
                  'API Performance Optimization & Monitoring'
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
                Ready to Build Powerful APIs?
              </h3>
              <p className={`text-lg mb-6 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Let's discuss how our API services can connect your systems and enable seamless integrations.
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

export default APIServices;

