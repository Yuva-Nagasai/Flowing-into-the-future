import { Link } from 'react-router-dom';
import { ArrowLeft, Shield, Sparkles, CheckCircle2 } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { motion } from 'framer-motion';
import { useEffect } from 'react';

const Security = () => {
  const { theme } = useTheme();

  useEffect(() => {
    document.title = 'Security - Nano Flows | Data Security & Protection';
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Nano Flows Security. Learn about our comprehensive security measures, data protection practices, and commitment to keeping your information safe and secure.');
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
                Security
              </span>
            </div>
            <h1 className={`text-4xl sm:text-5xl md:text-6xl font-bold mb-6 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`} style={{ fontFamily: 'Orbitron, sans-serif' }}>
              Security &{' '}
              <span className={theme === 'dark' ? 'text-electric-green' : 'text-accent-red'}>
                Data Protection
              </span>
            </h1>
            <p className={`text-lg sm:text-xl md:text-2xl mb-8 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              At Nano Flows, security is our top priority. We implement comprehensive security measures to protect 
              your data and ensure the highest levels of protection for our services.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 sm:py-16 md:py-20">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            {/* Our Commitment */}
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
                Our Security Commitment
              </h2>
              <p className={`text-base sm:text-lg leading-relaxed mb-6 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Nano Flows is committed to maintaining the highest standards of security and data protection. 
                We understand that your trust is essential, and we work continuously to safeguard your information 
                against unauthorized access, disclosure, alteration, and destruction.
              </p>
            </motion.div>

            {/* Security Measures */}
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
                Security Measures
              </h2>
              <div className="space-y-4 sm:space-y-6">
                {[
                  'Encryption: All data in transit is encrypted using TLS/SSL protocols, and sensitive data at rest is encrypted using industry-standard encryption algorithms',
                  'Access Controls: We implement strict access controls and authentication mechanisms to ensure only authorized personnel can access your data',
                  'Regular Security Audits: We conduct regular security assessments, penetration testing, and vulnerability scans to identify and address potential security issues',
                  'Secure Infrastructure: Our services are hosted on secure, compliant cloud infrastructure with redundant systems and 24/7 monitoring',
                  'Data Backup: We maintain regular automated backups of your data to ensure business continuity and data recovery capabilities',
                  'Incident Response: We have established incident response procedures to quickly address and mitigate any security incidents',
                  'Employee Training: Our team undergoes regular security training to stay updated on the latest threats and best practices',
                  'Compliance: We adhere to industry standards and regulations including GDPR, SOC 2, and ISO 27001 where applicable'
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

            {/* Data Protection */}
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
                Data Protection Practices
              </h2>
              <p className={`text-base sm:text-lg leading-relaxed mb-4 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                We follow industry best practices for data protection:
              </p>
              <ul className={`list-disc list-inside space-y-2 ml-4 mb-6 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                <li>Minimal data collection - we only collect data necessary for providing our services</li>
                <li>Data retention policies - we retain data only as long as necessary for business purposes</li>
                <li>Secure data deletion - when data is no longer needed, it is securely deleted</li>
                <li>Third-party security - we carefully vet and monitor third-party service providers</li>
                <li>Privacy by design - security and privacy considerations are built into our systems from the ground up</li>
              </ul>
            </motion.div>

            {/* Reporting Security Issues */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="mb-12 sm:mb-16"
            >
              <h2 className={`text-3xl sm:text-4xl font-bold mb-6 flex items-center gap-3 ${
                theme === 'dark' ? 'text-electric-blue' : 'text-accent-blue'
              }`} style={{ fontFamily: 'Orbitron, sans-serif' }}>
                <Sparkles className="w-8 h-8" />
                Reporting Security Issues
              </h2>
              <p className={`text-base sm:text-lg leading-relaxed mb-4 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                If you discover a security vulnerability or have concerns about our security practices, please 
                report it to us immediately. We take all security reports seriously and will investigate promptly.
              </p>
              <p className={`text-base sm:text-lg leading-relaxed ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Please email security concerns to:{' '}
                <a href="mailto:security@nanoflows.com" className={`underline ${
                  theme === 'dark' ? 'text-electric-blue' : 'text-accent-red'
                }`}>
                  security@nanoflows.com
                </a>
              </p>
            </motion.div>

            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.0 }}
              className={`rounded-2xl p-8 sm:p-12 ${
                theme === 'dark'
                  ? 'bg-gradient-to-r from-electric-blue/20 to-electric-green/20 border border-electric-blue/30'
                  : 'bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200'
              }`}
            >
              <h3 className={`text-2xl sm:text-3xl font-bold mb-4 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`} style={{ fontFamily: 'Orbitron, sans-serif' }}>
                Security Questions?
              </h3>
              <p className={`text-lg mb-4 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                For questions about our security practices, please contact us:
              </p>
              <div className={`space-y-2 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                <p><strong>Email:</strong> <a href="mailto:security@nanoflows.com" className={`underline ${
                  theme === 'dark' ? 'text-electric-blue' : 'text-accent-red'
                }`}>security@nanoflows.com</a></p>
                <p><strong>Address:</strong> Nano Flows, Security Department</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Security;

