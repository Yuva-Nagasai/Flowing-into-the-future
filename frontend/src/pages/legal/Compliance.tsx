import { Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Sparkles, CheckCircle2 } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { motion } from 'framer-motion';
import { useEffect } from 'react';

const Compliance = () => {
  const { theme } = useTheme();

  useEffect(() => {
    document.title = 'Compliance - Nano Flows | Regulatory Compliance & Standards';
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Nano Flows Compliance. Learn about our commitment to regulatory compliance, industry standards, and certifications including GDPR, SOC 2, and ISO 27001.');
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
              <CheckCircle className={`w-5 h-5 ${theme === 'dark' ? 'text-electric-green' : 'text-accent-red'}`} />
              <span className={`font-semibold ${theme === 'dark' ? 'text-electric-blue' : 'text-accent-red'}`}>
                Compliance
              </span>
            </div>
            <h1 className={`text-4xl sm:text-5xl md:text-6xl font-bold mb-6 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`} style={{ fontFamily: 'Orbitron, sans-serif' }}>
              Regulatory{' '}
              <span className={theme === 'dark' ? 'text-electric-green' : 'text-accent-red'}>
                Compliance
              </span>
            </h1>
            <p className={`text-lg sm:text-xl md:text-2xl mb-8 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Nano Flows is committed to maintaining the highest standards of regulatory compliance and 
              industry certifications to ensure the security and privacy of your data.
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
                Our Compliance Commitment
              </h2>
              <p className={`text-base sm:text-lg leading-relaxed mb-6 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                At Nano Flows, compliance is not just a requirement—it's a fundamental part of how we operate. 
                We are committed to meeting and exceeding regulatory requirements and industry standards to ensure 
                the highest levels of data protection, security, and privacy for our customers.
              </p>
            </motion.div>

            {/* Compliance Standards */}
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
                Compliance Standards & Certifications
              </h2>
              <div className="space-y-6">
                <div>
                  <h3 className={`text-xl font-semibold mb-3 ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    GDPR (General Data Protection Regulation)
                  </h3>
                  <p className={`text-base sm:text-lg leading-relaxed mb-4 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    We comply with the European Union's GDPR, ensuring that personal data of EU residents is 
                    processed lawfully, transparently, and securely. We respect your rights to access, rectify, 
                    and delete your personal data.
                  </p>
                </div>
                <div>
                  <h3 className={`text-xl font-semibold mb-3 ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    SOC 2 Type II
                  </h3>
                  <p className={`text-base sm:text-lg leading-relaxed mb-4 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Our systems and processes are audited annually for SOC 2 Type II compliance, demonstrating 
                    our commitment to security, availability, processing integrity, confidentiality, and privacy.
                  </p>
                </div>
                <div>
                  <h3 className={`text-xl font-semibold mb-3 ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    ISO 27001
                  </h3>
                  <p className={`text-base sm:text-lg leading-relaxed mb-4 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    We follow ISO 27001 information security management standards, implementing comprehensive 
                    security controls and risk management practices.
                  </p>
                </div>
                <div>
                  <h3 className={`text-xl font-semibold mb-3 ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    Industry-Specific Compliance
                  </h3>
                  <p className={`text-base sm:text-lg leading-relaxed mb-4 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    We work with customers in various industries and help ensure compliance with industry-specific 
                    regulations including HIPAA (healthcare), PCI DSS (payment processing), and others as required.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Compliance Practices */}
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
                Our Compliance Practices
              </h2>
              <div className="space-y-4 sm:space-y-6">
                {[
                  'Regular compliance audits and assessments to ensure ongoing adherence to standards',
                  'Comprehensive documentation of policies, procedures, and controls',
                  'Employee training programs on compliance requirements and best practices',
                  'Continuous monitoring and improvement of our compliance posture',
                  'Third-party vendor assessments to ensure our partners meet compliance standards',
                  'Incident response procedures aligned with regulatory requirements',
                  'Data processing agreements and contracts that comply with applicable regulations',
                  'Transparent reporting and communication about our compliance status'
                ].map((item, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + idx * 0.1 }}
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

            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className={`rounded-2xl p-8 sm:p-12 ${
                theme === 'dark'
                  ? 'bg-gradient-to-r from-electric-blue/20 to-electric-green/20 border border-electric-blue/30'
                  : 'bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200'
              }`}
            >
              <h3 className={`text-2xl sm:text-3xl font-bold mb-4 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`} style={{ fontFamily: 'Orbitron, sans-serif' }}>
                Compliance Questions?
              </h3>
              <p className={`text-lg mb-4 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                For questions about our compliance practices or certifications, please contact us:
              </p>
              <div className={`space-y-2 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                <p><strong>Email:</strong> <a href="mailto:compliance@nanoflows.com" className={`underline ${
                  theme === 'dark' ? 'text-electric-blue' : 'text-accent-red'
                }`}>compliance@nanoflows.com</a></p>
                <p><strong>Address:</strong> Nano Flows, Compliance Department</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Compliance;

