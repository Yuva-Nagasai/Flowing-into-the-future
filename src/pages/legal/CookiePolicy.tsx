import { Link } from 'react-router-dom';
import { ArrowLeft, Cookie, Sparkles } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { motion } from 'framer-motion';
import { useEffect } from 'react';

const CookiePolicy = () => {
  const { theme } = useTheme();

  useEffect(() => {
    document.title = 'Cookie Policy - Nano Flows | Cookie Usage & Management';
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Nano Flows Cookie Policy. Learn about how we use cookies and similar technologies on our website. Manage your cookie preferences and understand our data collection practices.');
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
              <Cookie className={`w-5 h-5 ${theme === 'dark' ? 'text-electric-green' : 'text-accent-red'}`} />
              <span className={`font-semibold ${theme === 'dark' ? 'text-electric-blue' : 'text-accent-red'}`}>
                Cookie Policy
              </span>
            </div>
            <h1 className={`text-4xl sm:text-5xl md:text-6xl font-bold mb-6 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`} style={{ fontFamily: 'Orbitron, sans-serif' }}>
              Cookie{' '}
              <span className={theme === 'dark' ? 'text-electric-green' : 'text-accent-red'}>
                Policy
              </span>
            </h1>
            <p className={`text-lg sm:text-xl md:text-2xl mb-8 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 sm:py-16 md:py-20">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            {/* Introduction */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-12 sm:mb-16"
            >
              <p className={`text-base sm:text-lg leading-relaxed mb-6 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                This Cookie Policy explains how Nano Flows uses cookies and similar tracking technologies when you 
                visit our website. It explains what these technologies are, why we use them, and your rights to 
                control our use of them.
              </p>
              <p className={`text-base sm:text-lg leading-relaxed ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                By continuing to use our website, you consent to our use of cookies in accordance with this policy.
              </p>
            </motion.div>

            {/* What Are Cookies */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mb-12 sm:mb-16"
            >
              <h2 className={`text-3xl sm:text-4xl font-bold mb-6 flex items-center gap-3 ${
                theme === 'dark' ? 'text-electric-green' : 'text-accent-red'
              }`} style={{ fontFamily: 'Orbitron, sans-serif' }}>
                <Sparkles className="w-8 h-8" />
                What Are Cookies?
              </h2>
              <p className={`text-base sm:text-lg leading-relaxed mb-4 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Cookies are small text files that are placed on your device when you visit a website. They are widely 
                used to make websites work more efficiently and provide information to website owners. Cookies allow 
                websites to remember your actions and preferences over a period of time.
              </p>
            </motion.div>

            {/* Types of Cookies */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mb-12 sm:mb-16"
            >
              <h2 className={`text-3xl sm:text-4xl font-bold mb-6 flex items-center gap-3 ${
                theme === 'dark' ? 'text-electric-blue' : 'text-accent-blue'
              }`} style={{ fontFamily: 'Orbitron, sans-serif' }}>
                <Sparkles className="w-8 h-8" />
                Types of Cookies We Use
              </h2>
              <div className="space-y-6">
                <div>
                  <h3 className={`text-xl font-semibold mb-3 ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    Essential Cookies
                  </h3>
                  <p className={`text-base sm:text-lg leading-relaxed mb-4 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    These cookies are necessary for the website to function properly. They enable core functionality 
                    such as security, network management, and accessibility. You cannot opt-out of these cookies.
                  </p>
                </div>
                <div>
                  <h3 className={`text-xl font-semibold mb-3 ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    Performance Cookies
                  </h3>
                  <p className={`text-base sm:text-lg leading-relaxed mb-4 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    These cookies help us understand how visitors interact with our website by collecting and reporting 
                    information anonymously. This helps us improve the way our website works.
                  </p>
                </div>
                <div>
                  <h3 className={`text-xl font-semibold mb-3 ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    Functionality Cookies
                  </h3>
                  <p className={`text-base sm:text-lg leading-relaxed mb-4 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    These cookies allow the website to remember choices you make and provide enhanced, personalized 
                    features, such as remembering your preferences and settings.
                  </p>
                </div>
                <div>
                  <h3 className={`text-xl font-semibold mb-3 ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    Targeting Cookies
                  </h3>
                  <p className={`text-base sm:text-lg leading-relaxed mb-4 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    These cookies may be set through our site by our advertising partners to build a profile of your 
                    interests and show you relevant content on other sites.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Managing Cookies */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="mb-12 sm:mb-16"
            >
              <h2 className={`text-3xl sm:text-4xl font-bold mb-6 flex items-center gap-3 ${
                theme === 'dark' ? 'text-electric-green' : 'text-accent-red'
              }`} style={{ fontFamily: 'Orbitron, sans-serif' }}>
                <Sparkles className="w-8 h-8" />
                Managing Cookies
              </h2>
              <p className={`text-base sm:text-lg leading-relaxed mb-4 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                You have the right to decide whether to accept or reject cookies. You can exercise your cookie rights 
                by setting your preferences in our cookie consent banner or by configuring your browser settings.
              </p>
              <p className={`text-base sm:text-lg leading-relaxed mb-4 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Most web browsers allow you to control cookies through their settings preferences. However, limiting 
                cookies may impact your experience on our website, as some features may not function properly.
              </p>
            </motion.div>

            {/* Third-Party Cookies */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.0 }}
              className="mb-12 sm:mb-16"
            >
              <h2 className={`text-3xl sm:text-4xl font-bold mb-6 flex items-center gap-3 ${
                theme === 'dark' ? 'text-electric-green' : 'text-accent-red'
              }`} style={{ fontFamily: 'Orbitron, sans-serif' }}>
                <Sparkles className="w-8 h-8" />
                Third-Party Cookies
              </h2>
              <p className={`text-base sm:text-lg leading-relaxed mb-4 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                In addition to our own cookies, we may also use various third-party cookies to report usage statistics 
                of our website, deliver advertisements, and provide enhanced functionality. These third parties may 
                set their own cookies to collect information about your online activities across different websites.
              </p>
            </motion.div>

            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.2 }}
              className={`rounded-2xl p-8 sm:p-12 ${
                theme === 'dark'
                  ? 'bg-gradient-to-r from-electric-blue/20 to-electric-green/20 border border-electric-blue/30'
                  : 'bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200'
              }`}
            >
              <h3 className={`text-2xl sm:text-3xl font-bold mb-4 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`} style={{ fontFamily: 'Orbitron, sans-serif' }}>
                Questions About Our Cookie Policy?
              </h3>
              <p className={`text-lg mb-4 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                If you have any questions about our use of cookies, please contact us:
              </p>
              <div className={`space-y-2 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                <p><strong>Email:</strong> <a href="mailto:privacy@nanoflows.com" className={`underline ${
                  theme === 'dark' ? 'text-electric-blue' : 'text-accent-red'
                }`}>privacy@nanoflows.com</a></p>
                <p><strong>Address:</strong> Nano Flows, Privacy Department</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CookiePolicy;

