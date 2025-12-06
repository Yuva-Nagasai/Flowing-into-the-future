import { Link } from 'react-router-dom';
import { Cloud, Sparkles, CheckCircle2 } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { motion } from 'framer-motion';
import { useEffect } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import SEO from '../../components/SEO';

const CloudPlatform = () => {
  const { theme } = useTheme();

  return (
    <>
      <SEO
        title="Cloud Platform Solutions - NanoFlows | Cloud Migration & DevOps"
        description="NanoFlows offers comprehensive cloud platform solutions including cloud migration, serverless architecture, DevOps automation, and multi-cloud strategies. Scale effortlessly with modern cloud technologies."
        keywords="cloud platform, cloud migration, serverless architecture, DevOps automation, multi-cloud, cloud solutions"
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
                <Cloud className={`w-5 h-5 ${theme === 'dark' ? 'text-electric-green' : 'text-accent-red'}`} />
                <span className={`font-semibold ${theme === 'dark' ? 'text-electric-blue' : 'text-accent-red'}`}>
                  Cloud Platform
                </span>
              </div>
              <h1 className={`text-4xl sm:text-5xl md:text-6xl font-bold mb-6 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`} style={{ fontFamily: 'Orbitron, sans-serif' }}>
                Cloud Platform{' '}
                <span className={theme === 'dark' ? 'text-electric-green' : 'text-accent-red'}>
                  Solutions
                </span>
              </h1>
              <p className={`text-lg sm:text-xl md:text-2xl mb-8 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Scale effortlessly with comprehensive cloud platform solutions. Reduce infrastructure costs, 
                achieve operational efficiency, and leverage modern cloud technologies including AWS, Azure, 
                and Google Cloud.
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
                How Nano Flows Relates to Cloud Platforms
              </h2>
              <div className={`prose prose-lg max-w-none ${
                theme === 'dark' ? 'prose-invert' : ''
              }`}>
                <p className={`text-base sm:text-lg leading-relaxed mb-4 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Nano Flows has extensive experience in cloud architecture and migration, helping hundreds 
                  of organizations transition to cloud-based infrastructures. We understand the complexities 
                  of cloud deployment, from initial assessment to full-scale migration and ongoing optimization.
                </p>
                <p className={`text-base sm:text-lg leading-relaxed ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Our cloud platform expertise spans all major providers including AWS, Azure, and Google Cloud, 
                  ensuring we can recommend and implement the best solution for your specific needs. We've 
                  successfully migrated enterprise applications, databases, and entire IT infrastructures to the cloud, 
                  reducing costs by an average of 40% while improving scalability and reliability.
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
                  'Design and implement scalable cloud architectures that support business growth and handle traffic spikes',
                  'Execute seamless cloud migrations with minimal downtime and zero data loss through proven methodologies',
                  'Optimize cloud costs through intelligent resource management, auto-scaling, and reserved instance strategies',
                  'Implement DevOps practices and CI/CD pipelines for faster deployment cycles and improved collaboration',
                  'Provide 24/7 cloud monitoring and support to ensure maximum uptime and proactive issue resolution',
                  'Build serverless applications that automatically scale based on demand, reducing operational overhead',
                  'Create hybrid and multi-cloud solutions for enhanced flexibility, redundancy, and compliance requirements'
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
                Key Cloud Platform Features
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                {[
                  'Cloud Migration & Strategy',
                  'Serverless Architecture',
                  'Container Orchestration (Kubernetes, Docker)',
                  'DevOps & CI/CD Automation',
                  'Cloud Security & Compliance',
                  'Multi-Cloud & Hybrid Solutions'
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
                Ready to Move to the Cloud?
              </h3>
              <p className={`text-lg mb-6 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Let's discuss your cloud migration strategy and how we can help you scale efficiently.
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

export default CloudPlatform;

