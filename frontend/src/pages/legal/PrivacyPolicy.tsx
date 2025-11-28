import { Link } from 'react-router-dom';
import { ArrowLeft, Shield, Sparkles } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { motion } from 'framer-motion';
import { useEffect } from 'react';

const PrivacyPolicy = () => {
  const { theme } = useTheme();

  useEffect(() => {
    document.title = 'Privacy Policy - Nano Flows | Data Protection & Privacy';
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Nano Flows Privacy Policy. Learn how we collect, use, and protect your personal information. Our commitment to data privacy and GDPR compliance.');
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
              <Shield className={`w-5 h-5 ${theme === 'dark' ? 'text-electric-green' : 'text-accent-red'}`} />
              <span className={`font-semibold ${theme === 'dark' ? 'text-electric-blue' : 'text-accent-red'}`}>
                Privacy Policy
              </span>
            </div>
            <h1 className={`text-4xl sm:text-5xl md:text-6xl font-bold mb-6 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`} style={{ fontFamily: 'Orbitron, sans-serif' }}>
              Privacy{' '}
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
                At Nano Flows, we are committed to protecting your privacy and ensuring the security of your personal information. 
                This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our 
                website, use our services, or interact with us.
              </p>
              <p className={`text-base sm:text-lg leading-relaxed ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                By using our services, you agree to the collection and use of information in accordance with this policy. 
                We respect your privacy and are dedicated to maintaining the confidentiality of your personal data.
              </p>
            </motion.div>

            {/* Information We Collect */}
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
                Information We Collect
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className={`text-xl font-semibold mb-3 ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    Personal Information
                  </h3>
                  <p className={`text-base sm:text-lg leading-relaxed mb-4 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    We may collect personal information that you provide directly to us, including:
                  </p>
                  <ul className={`list-disc list-inside space-y-2 ml-4 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    <li>Name, email address, phone number, and mailing address</li>
                    <li>Company name and job title</li>
                    <li>Payment information and billing details</li>
                    <li>Account credentials and preferences</li>
                    <li>Information you provide when contacting us or requesting support</li>
                  </ul>
                </div>
                <div className="mt-6">
                  <h3 className={`text-xl font-semibold mb-3 ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    Automatically Collected Information
                  </h3>
                  <p className={`text-base sm:text-lg leading-relaxed mb-4 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    When you visit our website, we automatically collect certain information, including:
                  </p>
                  <ul className={`list-disc list-inside space-y-2 ml-4 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    <li>IP address and device information</li>
                    <li>Browser type and version</li>
                    <li>Pages visited and time spent on pages</li>
                    <li>Referring website addresses</li>
                    <li>Cookies and similar tracking technologies</li>
                  </ul>
                </div>
              </div>
            </motion.div>

            {/* How We Use Information */}
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
                How We Use Your Information
              </h2>
              <p className={`text-base sm:text-lg leading-relaxed mb-4 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                We use the information we collect for various purposes, including:
              </p>
              <ul className={`list-disc list-inside space-y-2 ml-4 mb-6 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                <li>Providing, maintaining, and improving our services</li>
                <li>Processing transactions and managing your account</li>
                <li>Communicating with you about our services, updates, and promotional offers</li>
                <li>Responding to your inquiries and providing customer support</li>
                <li>Analyzing usage patterns to enhance user experience</li>
                <li>Detecting, preventing, and addressing technical issues and security threats</li>
                <li>Complying with legal obligations and enforcing our terms of service</li>
              </ul>
            </motion.div>

            {/* Data Security */}
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
                Data Security
              </h2>
              <p className={`text-base sm:text-lg leading-relaxed mb-4 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Nano Flows implements industry-standard security measures to protect your personal information from 
                unauthorized access, alteration, disclosure, or destruction. We use encryption, secure servers, and 
                access controls to safeguard your data. However, no method of transmission over the Internet or 
                electronic storage is 100% secure, and we cannot guarantee absolute security.
              </p>
            </motion.div>

            {/* Your Rights */}
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
                Your Privacy Rights
              </h2>
              <p className={`text-base sm:text-lg leading-relaxed mb-4 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Depending on your location, you may have certain rights regarding your personal information, including:
              </p>
              <ul className={`list-disc list-inside space-y-2 ml-4 mb-6 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                <li>The right to access and receive a copy of your personal data</li>
                <li>The right to rectify inaccurate or incomplete information</li>
                <li>The right to request deletion of your personal data</li>
                <li>The right to object to processing of your personal data</li>
                <li>The right to data portability</li>
                <li>The right to withdraw consent at any time</li>
              </ul>
              <p className={`text-base sm:text-lg leading-relaxed ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                To exercise these rights, please contact us at{' '}
                <a href="mailto:privacy@nanoflows.com" className={`underline ${
                  theme === 'dark' ? 'text-electric-blue' : 'text-accent-red'
                }`}>
                  privacy@nanoflows.com
                </a>
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
                Contact Us
              </h3>
              <p className={`text-lg mb-4 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                If you have any questions about this Privacy Policy or our data practices, please contact us:
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

export default PrivacyPolicy;

