import { Link } from 'react-router-dom';
import { Smartphone, Sparkles, CheckCircle2 } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { motion } from 'framer-motion';
import { useEffect } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import SEO from '../../components/SEO';

const MobileApps = () => {
  const { theme } = useTheme();

  return (
    <>
      <SEO
        title="Mobile Apps Development - NanoFlows | iOS & Android Apps"
        description="NanoFlows creates exceptional mobile applications for iOS and Android. Native and cross-platform app development with beautiful design, robust functionality, and optimal performance."
        keywords="mobile apps, iOS apps, Android apps, mobile development, native apps, cross-platform apps"
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
                <Smartphone className={`w-5 h-5 ${theme === 'dark' ? 'text-electric-green' : 'text-accent-red'}`} />
                <span className={`font-semibold ${theme === 'dark' ? 'text-electric-blue' : 'text-accent-red'}`}>
                  Mobile Apps
                </span>
              </div>
              <h1 className={`text-4xl sm:text-5xl md:text-6xl font-bold mb-6 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`} style={{ fontFamily: 'Orbitron, sans-serif' }}>
                Mobile Application{' '}
                <span className={theme === 'dark' ? 'text-electric-green' : 'text-accent-red'}>
                  Development
                </span>
              </h1>
              <p className={`text-lg sm:text-xl md:text-2xl mb-8 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Create exceptional mobile applications for iOS and Android platforms. Deliver seamless 
                user experiences that engage customers, streamline operations, and drive business growth 
                through cutting-edge mobile technology.
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
                How Nano Flows Relates to Mobile Apps
              </h2>
              <div className={`prose prose-lg max-w-none ${
                theme === 'dark' ? 'prose-invert' : ''
              }`}>
                <p className={`text-base sm:text-lg leading-relaxed mb-4 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Mobile app development has been a cornerstone of Nano Flows' services since our early days. 
                  We understand that mobile applications are often the primary touchpoint between businesses 
                  and their customers. Our team of mobile specialists excels in creating native and 
                  cross-platform applications that combine beautiful design with robust functionality.
                </p>
                <p className={`text-base sm:text-lg leading-relaxed ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  We follow industry best practices for performance, security, and user experience, ensuring 
                  your mobile app stands out in competitive app stores. From concept to deployment, we guide 
                  you through every step of the mobile app development lifecycle, creating apps that users 
                  love and businesses rely on.
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
                  'Develop native iOS and Android apps with optimal performance and platform-specific user experience',
                  'Create cross-platform applications using React Native or Flutter for cost-effective deployment across platforms',
                  'Design intuitive user interfaces that follow platform-specific design guidelines (Material Design, Human Interface Guidelines)',
                  'Implement secure authentication and data encryption to protect user information and comply with regulations',
                  'Integrate mobile apps with existing backend systems and APIs seamlessly for unified business operations',
                  'Optimize app performance for fast loading times, smooth animations, and efficient battery usage',
                  'Provide app store optimization and deployment services to maximize visibility and downloads',
                  'Offer ongoing maintenance, updates, and feature enhancements post-launch to keep your app competitive'
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
                Key Mobile App Features
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                {[
                  'Native iOS & Android Development',
                  'Cross-Platform App Development',
                  'UI/UX Design & Prototyping',
                  'App Store Optimization (ASO)',
                  'Mobile App Security & Encryption',
                  'Push Notifications & Analytics Integration'
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
                Ready to Build Your Mobile App?
              </h3>
              <p className={`text-lg mb-6 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Let's discuss how we can create a mobile app that engages your customers and drives business growth.
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

export default MobileApps;

