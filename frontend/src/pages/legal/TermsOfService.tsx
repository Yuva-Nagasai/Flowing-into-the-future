import { Link } from 'react-router-dom';
import { ArrowLeft, FileText, Sparkles } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { motion } from 'framer-motion';
import { useEffect } from 'react';

const TermsOfService = () => {
  const { theme } = useTheme();

  useEffect(() => {
    document.title = 'Terms of Service - Nano Flows | Legal Terms & Conditions';
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Nano Flows Terms of Service. Read our terms and conditions for using our services, website, and products. Understand your rights and obligations.');
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
              <FileText className={`w-5 h-5 ${theme === 'dark' ? 'text-electric-green' : 'text-accent-red'}`} />
              <span className={`font-semibold ${theme === 'dark' ? 'text-electric-blue' : 'text-accent-red'}`}>
                Terms of Service
              </span>
            </div>
            <h1 className={`text-4xl sm:text-5xl md:text-6xl font-bold mb-6 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`} style={{ fontFamily: 'Orbitron, sans-serif' }}>
              Terms of{' '}
              <span className={theme === 'dark' ? 'text-electric-green' : 'text-accent-red'}>
                Service
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
                Welcome to Nano Flows. These Terms of Service ("Terms") govern your access to and use of our website, 
                services, and products. Please read these Terms carefully before using our services.
              </p>
              <p className={`text-base sm:text-lg leading-relaxed ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                By accessing or using our services, you agree to be bound by these Terms. If you do not agree to these 
                Terms, you may not access or use our services.
              </p>
            </motion.div>

            {/* Acceptance of Terms */}
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
                Acceptance of Terms
              </h2>
              <p className={`text-base sm:text-lg leading-relaxed mb-4 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                By creating an account, accessing our website, or using any of our services, you acknowledge that you 
                have read, understood, and agree to be bound by these Terms and our Privacy Policy. These Terms apply 
                to all users of our services, including visitors, customers, and contributors.
              </p>
            </motion.div>

            {/* Use of Services */}
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
                Use of Services
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className={`text-xl font-semibold mb-3 ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    Permitted Use
                  </h3>
                  <p className={`text-base sm:text-lg leading-relaxed mb-4 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    You may use our services only for lawful purposes and in accordance with these Terms. You agree not to:
                  </p>
                  <ul className={`list-disc list-inside space-y-2 ml-4 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    <li>Violate any applicable laws or regulations</li>
                    <li>Infringe upon the rights of others</li>
                    <li>Transmit any harmful, offensive, or illegal content</li>
                    <li>Attempt to gain unauthorized access to our systems</li>
                    <li>Interfere with or disrupt our services or servers</li>
                    <li>Use automated systems to access our services without permission</li>
                  </ul>
                </div>
              </div>
            </motion.div>

            {/* Account Responsibilities */}
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
                Account Responsibilities
              </h2>
              <p className={`text-base sm:text-lg leading-relaxed mb-4 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                If you create an account with us, you are responsible for:
              </p>
              <ul className={`list-disc list-inside space-y-2 ml-4 mb-6 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                <li>Maintaining the confidentiality of your account credentials</li>
                <li>All activities that occur under your account</li>
                <li>Providing accurate and complete information</li>
                <li>Notifying us immediately of any unauthorized use</li>
                <li>Ensuring you have the legal capacity to enter into these Terms</li>
              </ul>
            </motion.div>

            {/* Intellectual Property */}
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
                Intellectual Property
              </h2>
              <p className={`text-base sm:text-lg leading-relaxed mb-4 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                All content, features, and functionality of our services, including but not limited to text, graphics, 
                logos, icons, images, and software, are the exclusive property of Nano Flows and are protected by 
                copyright, trademark, and other intellectual property laws.
              </p>
              <p className={`text-base sm:text-lg leading-relaxed ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                You may not reproduce, distribute, modify, or create derivative works from our content without our 
                express written permission.
              </p>
            </motion.div>

            {/* Limitation of Liability */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.2 }}
              className="mb-12 sm:mb-16"
            >
              <h2 className={`text-3xl sm:text-4xl font-bold mb-6 flex items-center gap-3 ${
                theme === 'dark' ? 'text-electric-blue' : 'text-accent-blue'
              }`} style={{ fontFamily: 'Orbitron, sans-serif' }}>
                <Sparkles className="w-8 h-8" />
                Limitation of Liability
              </h2>
              <p className={`text-base sm:text-lg leading-relaxed mb-4 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                To the maximum extent permitted by law, Nano Flows shall not be liable for any indirect, incidental, 
                special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred 
                directly or indirectly, or any loss of data, use, goodwill, or other intangible losses resulting from 
                your use of our services.
              </p>
            </motion.div>

            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.4 }}
              className={`rounded-2xl p-8 sm:p-12 ${
                theme === 'dark'
                  ? 'bg-gradient-to-r from-electric-blue/20 to-electric-green/20 border border-electric-blue/30'
                  : 'bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200'
              }`}
            >
              <h3 className={`text-2xl sm:text-3xl font-bold mb-4 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`} style={{ fontFamily: 'Orbitron, sans-serif' }}>
                Questions About These Terms?
              </h3>
              <p className={`text-lg mb-4 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                If you have any questions about these Terms of Service, please contact us:
              </p>
              <div className={`space-y-2 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                <p><strong>Email:</strong> <a href="mailto:legal@nanoflows.com" className={`underline ${
                  theme === 'dark' ? 'text-electric-blue' : 'text-accent-red'
                }`}>legal@nanoflows.com</a></p>
                <p><strong>Address:</strong> Nano Flows, Legal Department</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TermsOfService;

