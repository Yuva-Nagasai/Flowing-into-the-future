import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Send,
  MessageSquare,
  Clock,
  Globe,
  CheckCircle,
  ArrowRight,
  ChevronDown,
  Brain
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import AIToolsNav from '../../components/aitools/AIToolsNav';
import Footer from '../../components/Footer';
import SEO from '../../components/SEO';

const AIToolsContact = () => {
  const { theme } = useTheme();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email Us',
      value: 'nanoflowsvizag@gmail.com',
      description: 'We reply within 24 hours',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Phone,
      title: 'Call Us',
      value: '+91 8019358855',
      description: 'Mon-Sat, 9:30 AM - 6:30 PM IST',
      color: 'from-pink-500 to-rose-500'
    },
    {
      icon: MapPin,
      title: 'Visit Us',
      value: 'TF-301, 1-152, Sapthagiri Nagar, Revenue Ward-70, Near Chinamushidiwada, Visakhapatnam - 530051',
      description: 'Visakhapatnam, Andhra Pradesh, India',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: Globe,
      title: 'Social Media',
      value: '@nanoflowsai',
      description: 'Follow us for updates',
      color: 'from-purple-500 to-violet-500'
    }
  ];

  const faqs = [
    {
      question: 'How do I submit a new AI tool?',
      answer: 'We welcome tool submissions! Please use our contact form with the subject "Tool Submission" and include details about the tool, its features, and why it would benefit our community.'
    },
    {
      question: 'Are all tools free to use?',
      answer: 'No, we curate both free and premium AI tools. Each tool listing clearly indicates its pricing model. You can filter tools by pricing type on our explore page.'
    },
    {
      question: 'How do I report an issue with a tool?',
      answer: 'If you encounter any issues with a listed tool, please contact us with the tool name and a description of the problem. We\'ll investigate and update the listing accordingly.'
    },
    {
      question: 'Do you offer API access?',
      answer: 'Yes, we offer API access for developers who want to integrate our tool database. Contact us with "API Access" as the subject for more information about pricing and documentation.'
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    setFormData({ name: '', email: '', subject: '', message: '' });
    
    setTimeout(() => setIsSubmitted(false), 5000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <>
      <SEO
        title="Contact Us | NanoFlows AI Tools"
        description="Get in touch with NanoFlows AI Tools team. Contact us for support, inquiries, or partnership opportunities."
        keywords="AI tools contact, support, inquiry, help, get in touch"
      />
      <div className={`min-h-screen w-full max-w-full overflow-x-hidden flex flex-col transition-colors duration-300 ${
        theme === 'dark' ? 'bg-dark-bg' : 'bg-gray-50'
      }`}>
      <AIToolsNav />

      {/* Hero Section */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className={`absolute inset-0 ${
          theme === 'dark'
            ? 'bg-gradient-to-br from-dark-bg via-dark-card to-dark-bg'
            : 'bg-gradient-to-br from-white via-gray-50 to-white'
        }`} />
        <div className="absolute top-20 right-10 w-80 h-80 bg-electric-blue/20 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-64 h-64 bg-electric-green/20 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-4xl mx-auto"
          >
            <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-6 ${
              theme === 'dark'
                ? 'bg-electric-green/20 text-electric-green'
                : 'bg-accent-red/10 text-accent-red'
            }`}>
              <MessageSquare className="w-4 h-4" />
              Get in Touch
            </span>

            <h1 className={`text-5xl md:text-6xl font-bold mb-6 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`} style={{ fontFamily: 'Orbitron, sans-serif' }}>
              We'd Love to{' '}
              <span className={`bg-gradient-to-r ${
                theme === 'dark'
                  ? 'from-electric-green to-electric-blue'
                  : 'from-accent-red to-accent-blue'
              } bg-clip-text text-transparent`}>
                Hear from You
              </span>
            </h1>

            <p className={`text-xl ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Have questions about our AI tools or need help? Our team is here to assist you 
              in finding the perfect tools for your needs.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className={`py-16 ${theme === 'dark' ? 'bg-dark-card' : 'bg-white'}`}>
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfo.map((info, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -5 }}
                className={`p-6 rounded-2xl border-2 text-center transition-all ${
                  theme === 'dark'
                    ? 'bg-dark-lighter border-gray-800 hover:border-electric-blue'
                    : 'bg-gradient-to-br from-accent-red/10 to-accent-blue/10 border-accent-red/30 hover:border-accent-blue'
                }`}
              >
                <div className={`w-14 h-14 mx-auto rounded-xl flex items-center justify-center mb-4 bg-gradient-to-br ${info.color}`}>
                  <info.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className={`text-lg font-bold mb-1 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  {info.title}
                </h3>
                <p className={`font-medium mb-1 ${
                  theme === 'dark' ? 'text-electric-green' : 'text-accent-red'
                }`}>
                  {info.value}
                </p>
                <p className={`text-sm ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {info.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & FAQ */}
      <section className={`py-20 ${theme === 'dark' ? 'bg-dark-bg' : 'bg-gray-50'}`}>
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className={`text-3xl font-bold mb-6 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`} style={{ fontFamily: 'Orbitron, sans-serif' }}>
                Send us a{' '}
                <span className={`bg-gradient-to-r ${
                  theme === 'dark'
                    ? 'from-electric-green to-electric-blue'
                    : 'from-accent-red to-accent-blue'
                } bg-clip-text text-transparent`}>
                  Message
                </span>
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Your Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className={`w-full px-4 py-3 rounded-xl border-2 transition-all focus:outline-none focus:ring-2 ${
                        theme === 'dark'
                          ? 'bg-dark-card border-gray-700 text-white focus:border-electric-blue focus:ring-electric-blue/20'
                          : 'bg-white border-gray-200 text-gray-900 focus:border-accent-blue focus:ring-accent-blue/20'
                      }`}
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className={`w-full px-4 py-3 rounded-xl border-2 transition-all focus:outline-none focus:ring-2 ${
                        theme === 'dark'
                          ? 'bg-dark-card border-gray-700 text-white focus:border-electric-blue focus:ring-electric-blue/20'
                          : 'bg-white border-gray-200 text-gray-900 focus:border-accent-blue focus:ring-accent-blue/20'
                      }`}
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Subject
                  </label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className={`w-full px-4 py-3 rounded-xl border-2 transition-all focus:outline-none focus:ring-2 ${
                      theme === 'dark'
                        ? 'bg-dark-card border-gray-700 text-white focus:border-electric-blue focus:ring-electric-blue/20'
                        : 'bg-white border-gray-200 text-gray-900 focus:border-accent-blue focus:ring-accent-blue/20'
                    }`}
                  >
                    <option value="">Select a subject</option>
                    <option value="general">General Inquiry</option>
                    <option value="tool-submission">Tool Submission</option>
                    <option value="support">Technical Support</option>
                    <option value="api">API Access</option>
                    <option value="partnership">Partnership Opportunity</option>
                    <option value="feedback">Feedback</option>
                  </select>
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Message
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className={`w-full px-4 py-3 rounded-xl border-2 transition-all focus:outline-none focus:ring-2 resize-none ${
                      theme === 'dark'
                        ? 'bg-dark-card border-gray-700 text-white focus:border-electric-blue focus:ring-electric-blue/20'
                        : 'bg-white border-gray-200 text-gray-900 focus:border-accent-blue focus:ring-accent-blue/20'
                    }`}
                    placeholder="How can we help you?"
                  />
                </div>

                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`relative group overflow-hidden w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all duration-300 ${
                    isSubmitting
                      ? 'opacity-70 cursor-not-allowed'
                      : ''
                  } ${
                    theme === 'dark'
                      ? 'bg-gradient-to-r from-electric-green to-electric-blue text-dark-bg'
                      : 'bg-gradient-to-r from-accent-red to-accent-blue text-white'
                  }`}
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : isSubmitted ? (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      Message Sent!
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Send Message
                    </>
                  )}
                  </span>
                  <div
                    className={`absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 ${
                      theme === 'dark'
                        ? 'bg-gradient-to-r from-electric-blue to-electric-green'
                        : 'bg-gradient-to-r from-accent-blue to-accent-red'
                    }`}
                  />
                </motion.button>
              </form>
            </motion.div>

            {/* FAQ */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className={`text-3xl font-bold mb-6 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`} style={{ fontFamily: 'Orbitron, sans-serif' }}>
                Frequently Asked{' '}
                <span className={`bg-gradient-to-r ${
                  theme === 'dark'
                    ? 'from-electric-green to-electric-blue'
                    : 'from-accent-red to-accent-blue'
                } bg-clip-text text-transparent`}>
                  Questions
                </span>
              </h2>

              <div className="space-y-4">
                {faqs.map((faq, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className={`rounded-2xl border-2 overflow-hidden ${
                      theme === 'dark'
                        ? 'bg-dark-card border-gray-800'
                        : 'bg-gradient-to-br from-accent-red/10 to-accent-blue/10 border-accent-red/30'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() =>
                        setOpenFaqIndex(openFaqIndex === idx ? null : idx)
                      }
                      className="w-full flex items-center justify-between gap-4 px-6 py-4 text-left"
                    >
                      <h3
                        className={`text-base md:text-lg font-semibold ${
                          theme === 'dark' ? 'text-white' : 'text-gray-900'
                        }`}
                      >
                        {faq.question}
                      </h3>
                      <span
                        className={`flex-shrink-0 rounded-full border p-1.5 transition-all ${
                          theme === 'dark'
                            ? openFaqIndex === idx
                              ? 'bg-electric-blue/20 border-electric-blue text-electric-blue rotate-180'
                              : 'bg-dark-bg border-gray-700 text-gray-400'
                            : openFaqIndex === idx
                              ? 'bg-accent-blue/10 border-accent-blue text-accent-blue rotate-180'
                              : 'bg-white border-gray-300 text-gray-500'
                        }`}
                      >
                        <ChevronDown className="w-4 h-4" />
                      </span>
                    </button>
                    {openFaqIndex === idx && (
                      <div className="px-6 pb-5">
                        <p
                          className={`text-sm ${
                            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                          }`}
                        >
                          {faq.answer}
                        </p>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>

              <div className={`mt-8 p-6 rounded-2xl ${
                theme === 'dark'
                  ? 'bg-electric-blue/10 border border-electric-blue/30'
                  : 'bg-accent-blue/5 border border-accent-blue/20'
              }`}>
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-xl ${
                    theme === 'dark' ? 'bg-electric-blue/20' : 'bg-accent-blue/10'
                  }`}>
                    <Clock className={`w-6 h-6 ${
                      theme === 'dark' ? 'text-electric-blue' : 'text-accent-blue'
                    }`} />
                  </div>
                  <div>
                    <h4 className={`font-bold mb-1 ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                      Quick Response Time
                    </h4>
                    <p className={`text-sm ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      Our support team typically responds within 2-4 hours during business hours. 
                      For urgent issues, use our live chat feature.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={`py-16 ${theme === 'dark' ? 'bg-dark-card' : 'bg-white'}`}>
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={`text-center p-12 rounded-3xl ${
              theme === 'dark'
                ? 'bg-gradient-to-br from-electric-blue/20 to-electric-green/20'
                : 'bg-gradient-to-br from-accent-red/10 to-accent-blue/10'
            }`}
          >
            <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`} style={{ fontFamily: 'Orbitron, sans-serif' }}>
              Ready to Explore{' '}
              <span className={`bg-gradient-to-r ${
                theme === 'dark'
                  ? 'from-electric-green to-electric-blue'
                  : 'from-accent-red to-accent-blue'
              } bg-clip-text text-transparent`}>
                AI Tools?
              </span>
            </h2>
            <p className={`text-lg mb-8 max-w-2xl mx-auto ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Discover powerful AI tools that can transform your workflow and boost your productivity.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.location.href = '/ai-tools/explore'}
              className={`relative group overflow-hidden px-8 py-4 rounded-xl font-bold flex items-center gap-2 mx-auto transition-all duration-300 ${
                theme === 'dark'
                  ? 'bg-gradient-to-r from-electric-green to-electric-blue text-dark-bg'
                  : 'bg-gradient-to-r from-accent-red to-accent-blue text-white'
              }`}
            >
              <span className="relative z-10 flex items-center gap-2">
                <Brain className="w-5 h-5" />
                Explore All Tools
                <ArrowRight className="w-5 h-5" />
              </span>
              <div
                className={`absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 ${
                  theme === 'dark'
                    ? 'bg-gradient-to-r from-electric-blue to-electric-green'
                    : 'bg-gradient-to-r from-accent-blue to-accent-red'
                }`}
              />
            </motion.button>
          </motion.div>
        </div>
      </section>

      <Footer variant="ai-tools" />
      </div>
    </>
  );
};

export default AIToolsContact;

