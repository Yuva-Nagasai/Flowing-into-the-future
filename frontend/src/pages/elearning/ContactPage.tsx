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
  ArrowRight
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import ELearningNav from '../../components/elearning/ELearningNav';

const ContactPage = () => {
  const { theme } = useTheme();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email Us',
      value: 'support@nanoflows.academy',
      description: 'We reply within 24 hours'
    },
    {
      icon: Phone,
      title: 'Call Us',
      value: '+1 (555) 123-4567',
      description: 'Mon-Fri, 9am-6pm EST'
    },
    {
      icon: MapPin,
      title: 'Visit Us',
      value: '123 Tech Street, Suite 100',
      description: 'San Francisco, CA 94102'
    },
    {
      icon: Globe,
      title: 'Social Media',
      value: '@nanoflowsacademy',
      description: 'Follow us for updates'
    }
  ];

  const faqs = [
    {
      question: 'How do I get started with a course?',
      answer: 'Simply create an account, browse our catalog, and enroll in any course that interests you. You can start learning immediately after enrollment.'
    },
    {
      question: 'Are certificates recognized by employers?',
      answer: 'Yes! Our certificates are recognized by leading tech companies worldwide. Many of our students have successfully used them in their job applications.'
    },
    {
      question: 'Can I get a refund if I\'m not satisfied?',
      answer: 'We offer a 30-day money-back guarantee on all paid courses. If you\'re not satisfied, contact our support team for a full refund.'
    },
    {
      question: 'Do you offer corporate training?',
      answer: 'Yes, we offer customized corporate training programs. Contact our enterprise team for more information about bulk pricing and custom courses.'
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
    <div className={`min-h-screen transition-colors duration-300 ${
      theme === 'dark' ? 'bg-dark-bg' : 'bg-gray-50'
    }`}>
      <ELearningNav />

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
            }`}>
              We'd Love to{' '}
              <span className={theme === 'dark' ? 'text-electric-green' : 'text-accent-red'}>
                Hear from You
              </span>
            </h1>

            <p className={`text-xl ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Have questions about our courses or need help? Our team is here to assist you 
              on your learning journey.
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
                    : 'bg-gray-50 border-gray-200 hover:border-accent-blue'
                }`}
              >
                <div className={`w-14 h-14 mx-auto rounded-xl flex items-center justify-center mb-4 ${
                  theme === 'dark'
                    ? 'bg-electric-blue/20 text-electric-blue'
                    : 'bg-accent-blue/10 text-accent-blue'
                }`}>
                  <info.icon className="w-7 h-7" />
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
              }`}>
                Send us a{' '}
                <span className={theme === 'dark' ? 'text-electric-green' : 'text-accent-red'}>
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
                    <option value="support">Technical Support</option>
                    <option value="billing">Billing Question</option>
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
                  className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                    isSubmitting
                      ? 'opacity-70 cursor-not-allowed'
                      : ''
                  } ${
                    theme === 'dark'
                      ? 'bg-gradient-to-r from-electric-green to-electric-blue text-dark-bg'
                      : 'bg-gradient-to-r from-accent-red to-accent-blue text-white'
                  }`}
                >
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
              }`}>
                Frequently Asked{' '}
                <span className={theme === 'dark' ? 'text-electric-blue' : 'text-accent-blue'}>
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
                    className={`p-6 rounded-2xl border-2 ${
                      theme === 'dark'
                        ? 'bg-dark-card border-gray-800'
                        : 'bg-white border-gray-200'
                    }`}
                  >
                    <h3 className={`text-lg font-bold mb-2 ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                      {faq.question}
                    </h3>
                    <p className={`text-sm ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {faq.answer}
                    </p>
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
            }`}>
              Ready to Start Learning?
            </h2>
            <p className={`text-lg mb-8 max-w-2xl mx-auto ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Join thousands of students already transforming their careers with NanoFlows Academy.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.location.href = '/academy/signup'}
              className={`px-8 py-4 rounded-xl font-bold flex items-center gap-2 mx-auto ${
                theme === 'dark'
                  ? 'bg-gradient-to-r from-electric-green to-electric-blue text-dark-bg'
                  : 'bg-gradient-to-r from-accent-red to-accent-blue text-white'
              }`}
            >
              Get Started Free
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className={`py-8 border-t ${
        theme === 'dark' ? 'bg-dark-bg border-gray-800' : 'bg-gray-50 border-gray-200'
      }`}>
        <div className="container mx-auto px-4 lg:px-8">
          <p className={`text-center text-sm ${
            theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
          }`}>
            © 2024 NanoFlows Academy. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default ContactPage;
