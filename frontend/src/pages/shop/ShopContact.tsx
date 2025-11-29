import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Globe, HelpCircle, Send, Clock, MessageCircle, Loader2, Check, Zap, FileQuestion, RefreshCw } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import ShopNav from '../../components/shop/ShopNav';
import Footer from '../../components/Footer';
import SEOHead from '../../components/shop/SEOHead';
import shopApi from '../../utils/shopApi';

export default function ShopContact() {
  const { theme } = useTheme();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    category: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await shopApi.submitProductRequest({
        name: formData.name,
        email: formData.email,
        productName: formData.subject,
        description: formData.message,
        category: formData.category,
        budget: '',
      });
      if (res.success) {
        setSuccess(true);
        setFormData({ name: '', email: '', subject: '', message: '', category: '' });
        setTimeout(() => setSuccess(false), 5000);
      } else {
        setError(res.error || 'Failed to submit message');
      }
    } catch {
      setError('Failed to submit message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const contactInfo = [
    { icon: Mail, label: 'Email', value: 'support@digitalhub.store', href: 'mailto:support@digitalhub.store' },
    { icon: Globe, label: 'Website', value: 'www.digitalhub.store', href: '#' },
    { icon: Clock, label: 'Support Hours', value: '24/7 Digital Support', href: '#' },
    { icon: HelpCircle, label: 'Help Center', value: 'Browse FAQs & Guides', href: '#' },
  ];

  const faqs = [
    {
      q: 'How do I access my purchased products?',
      a: 'After purchase, you\'ll receive instant access via email and your account dashboard. All digital products are available for immediate download.',
    },
    {
      q: 'What is your refund policy?',
      a: 'We offer a 30-day money-back guarantee on most digital products. If you\'re not satisfied, contact us for a full refund.',
    },
    {
      q: 'Do I get lifetime access to my purchases?',
      a: 'Yes! Once purchased, you have lifetime access to your digital products including all future updates.',
    },
    {
      q: 'Can I use products for commercial projects?',
      a: 'License terms vary by product. Check the product description for specific licensing details. Most products include commercial use rights.',
    },
  ];

  const supportCategories = [
    {
      icon: FileQuestion,
      title: 'Pre-Sales Questions',
      description: 'Have questions before purchasing? We\'re happy to help you choose the right product.',
    },
    {
      icon: RefreshCw,
      title: 'Technical Support',
      description: 'Need help with installation, setup, or using your digital products? Our team is ready to assist.',
    },
    {
      icon: Zap,
      title: 'Feature Requests',
      description: 'Have ideas for new products or features? We love hearing from our customers.',
    },
  ];

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-slate-950' : 'bg-gray-50'}`}>
      <SEOHead
        title="Contact Us - Digital Hub"
        description="Get in touch with Digital Hub. We're here to help with your digital product questions, support, and feedback."
      />
      <ShopNav />

      <section className="py-16">
        <div className="container mx-auto px-4 lg:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto mb-12"
          >
            <MessageCircle className={`w-16 h-16 mx-auto mb-6 ${
              theme === 'dark' ? 'text-electric-green' : 'text-accent-blue'
            }`} />
            <h1 className={`text-4xl md:text-5xl font-bold mb-4 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Get in{' '}
              <span className={`${
                theme === 'dark'
                  ? 'text-transparent bg-clip-text bg-gradient-to-r from-electric-blue to-electric-green'
                  : 'text-transparent bg-clip-text bg-gradient-to-r from-accent-red to-accent-blue'
              }`}>
                Touch
              </span>
            </h1>
            <p className={`text-lg ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              Have questions about our digital products? Need technical support?
              We'd love to hear from you!
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {supportCategories.map((category, index) => (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-6 rounded-2xl text-center ${
                  theme === 'dark'
                    ? 'bg-slate-800 border border-slate-700'
                    : 'bg-white border border-gray-200 shadow-sm'
                }`}
              >
                <div className={`w-14 h-14 mx-auto mb-4 rounded-xl flex items-center justify-center ${
                  theme === 'dark' ? 'bg-electric-blue/20' : 'bg-accent-blue/10'
                }`}>
                  <category.icon className={`w-7 h-7 ${
                    theme === 'dark' ? 'text-electric-blue' : 'text-accent-blue'
                  }`} />
                </div>
                <h3 className={`font-semibold mb-2 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  {category.title}
                </h3>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  {category.description}
                </p>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-1 space-y-6"
            >
              {contactInfo.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className={`flex items-start gap-4 p-4 rounded-xl transition-colors ${
                    theme === 'dark'
                      ? 'bg-slate-800 hover:bg-slate-700 border border-slate-700'
                      : 'bg-white hover:bg-gray-50 border border-gray-200 shadow-sm'
                  }`}
                >
                  <div className={`p-3 rounded-lg ${
                    theme === 'dark' ? 'bg-electric-blue/20' : 'bg-accent-blue/10'
                  }`}>
                    <item.icon className={`w-6 h-6 ${
                      theme === 'dark' ? 'text-electric-blue' : 'text-accent-blue'
                    }`} />
                  </div>
                  <div>
                    <h3 className={`font-medium ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                      {item.label}
                    </h3>
                    <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                      {item.value}
                    </p>
                  </div>
                </a>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`lg:col-span-2 p-8 rounded-2xl ${
                theme === 'dark'
                  ? 'bg-slate-800 border border-slate-700'
                  : 'bg-white border border-gray-200 shadow-sm'
              }`}
            >
              <h2 className={`text-2xl font-bold mb-6 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Send Us a Message
              </h2>
              <p className={`mb-6 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Fill out the form below and our team will get back to you within 24 hours.
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Your Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className={`w-full px-4 py-3 rounded-xl border transition-all focus:outline-none focus:ring-2 ${
                        theme === 'dark'
                          ? 'bg-slate-700 border-slate-600 text-white focus:border-electric-blue focus:ring-electric-blue/20'
                          : 'bg-white border-gray-300 text-gray-900 focus:border-accent-blue focus:ring-accent-blue/20'
                      }`}
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Your Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className={`w-full px-4 py-3 rounded-xl border transition-all focus:outline-none focus:ring-2 ${
                        theme === 'dark'
                          ? 'bg-slate-700 border-slate-600 text-white focus:border-electric-blue focus:ring-electric-blue/20'
                          : 'bg-white border-gray-300 text-gray-900 focus:border-accent-blue focus:ring-accent-blue/20'
                      }`}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Category
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-xl border transition-all focus:outline-none focus:ring-2 ${
                        theme === 'dark'
                          ? 'bg-slate-700 border-slate-600 text-white focus:border-electric-blue focus:ring-electric-blue/20'
                          : 'bg-white border-gray-300 text-gray-900 focus:border-accent-blue focus:ring-accent-blue/20'
                      }`}
                    >
                      <option value="">Select a category</option>
                      <option value="pre-sales">Pre-Sales Question</option>
                      <option value="technical">Technical Support</option>
                      <option value="billing">Billing & Payments</option>
                      <option value="refund">Refund Request</option>
                      <option value="feature">Feature Request</option>
                      <option value="partnership">Partnership Inquiry</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Subject *
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      placeholder="Brief subject of your message"
                      className={`w-full px-4 py-3 rounded-xl border transition-all focus:outline-none focus:ring-2 ${
                        theme === 'dark'
                          ? 'bg-slate-700 border-slate-600 text-white placeholder:text-gray-500 focus:border-electric-blue focus:ring-electric-blue/20'
                          : 'bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-accent-blue focus:ring-accent-blue/20'
                      }`}
                    />
                  </div>
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Your Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    placeholder="Tell us how we can help you..."
                    className={`w-full px-4 py-3 rounded-xl border transition-all focus:outline-none focus:ring-2 resize-none ${
                      theme === 'dark'
                        ? 'bg-slate-700 border-slate-600 text-white placeholder:text-gray-500 focus:border-electric-blue focus:ring-electric-blue/20'
                        : 'bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-accent-blue focus:ring-accent-blue/20'
                    }`}
                  />
                </div>

                {error && (
                  <p className="text-red-500 text-sm">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={loading || success}
                  className={`w-full flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold text-lg transition-all disabled:opacity-50 ${
                    success
                      ? 'bg-green-500 text-white'
                      : theme === 'dark'
                        ? 'bg-gradient-to-r from-electric-blue to-electric-green text-slate-900 hover:shadow-lg hover:shadow-electric-blue/25'
                        : 'bg-gradient-to-r from-accent-red to-accent-blue text-white hover:shadow-lg hover:shadow-accent-red/25'
                  }`}
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : success ? (
                    <>
                      <Check className="w-5 h-5" />
                      Message Sent!
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      <section className={`py-16 ${theme === 'dark' ? 'bg-slate-900/50' : 'bg-gray-100'}`}>
        <div className="container mx-auto px-4 lg:px-6">
          <div className="max-w-3xl mx-auto">
            <h2 className={`text-2xl font-bold text-center mb-8 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {faqs.map((faq, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className={`p-6 rounded-xl ${
                    theme === 'dark' ? 'bg-slate-800' : 'bg-white shadow-sm'
                  }`}
                >
                  <h3 className={`font-semibold mb-2 ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    {faq.q}
                  </h3>
                  <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                    {faq.a}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
