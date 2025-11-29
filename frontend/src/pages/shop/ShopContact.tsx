import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Mail, Globe, Send, Clock, MessageCircle, Loader2, Check, 
  MapPin, Phone, Users, ShoppingCart, Package, Star
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import ShopNav from '../../components/shop/ShopNav';
import Footer from '../../components/Footer';
import SEOHead from '../../components/shop/SEOHead';
import shopApi from '../../utils/shopApi';

const metrics = [
  { icon: Users, label: 'Happy Customers', value: '50,000+', change: '+12%', color: 'from-blue-500 to-cyan-500' },
  { icon: ShoppingCart, label: 'Orders Completed', value: '125,000+', change: '+8%', color: 'from-green-500 to-emerald-500' },
  { icon: Package, label: 'Products Delivered', value: '180,000+', change: '+15%', color: 'from-purple-500 to-violet-500' },
  { icon: Star, label: 'Average Rating', value: '4.9/5', change: '+0.2', color: 'from-amber-500 to-orange-500' },
];

const salesData = [
  { month: 'Jan', value: 65 },
  { month: 'Feb', value: 78 },
  { month: 'Mar', value: 90 },
  { month: 'Apr', value: 81 },
  { month: 'May', value: 95 },
  { month: 'Jun', value: 110 },
];

const categoryProgress = [
  { name: 'Software & Tools', percentage: 85, color: 'from-blue-500 to-cyan-500' },
  { name: 'Templates', percentage: 72, color: 'from-pink-500 to-rose-500' },
  { name: 'Online Courses', percentage: 90, color: 'from-amber-500 to-orange-500' },
  { name: 'E-Books', percentage: 65, color: 'from-green-500 to-emerald-500' },
  { name: 'Design Assets', percentage: 78, color: 'from-purple-500 to-violet-500' },
];

export default function ShopContact() {
  const { theme } = useTheme();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
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
        category: 'contact',
        budget: '',
      });
      if (res.success) {
        setSuccess(true);
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
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
    { icon: Mail, label: 'Email Us', value: 'support@digitalhub.store', href: 'mailto:support@digitalhub.store' },
    { icon: Phone, label: 'Call Us', value: '+1 (555) 123-4567', href: 'tel:+15551234567' },
    { icon: Clock, label: 'Support Hours', value: '24/7 Digital Support', href: '#' },
    { icon: Globe, label: 'Website', value: 'www.digitalhub.store', href: '#' },
  ];

  const maxSalesValue = Math.max(...salesData.map(d => d.value));

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-slate-950' : 'bg-gray-50'}`}>
      <SEOHead
        title="Contact Us - Digital Hub"
        description="Get in touch with Digital Hub. We're here to help with your digital product questions, support, and feedback."
      />
      <ShopNav />

      <section className={`py-16 ${
        theme === 'dark'
          ? 'bg-gradient-to-b from-electric-blue/10 to-slate-950'
          : 'bg-gradient-to-b from-accent-blue/5 to-gray-50'
      }`}>
        <div className="container mx-auto px-4 lg:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6 ${
              theme === 'dark'
                ? 'bg-gradient-to-br from-electric-blue/20 to-electric-green/20'
                : 'bg-gradient-to-br from-accent-red/10 to-accent-blue/10'
            }`}>
              <MessageCircle className={`w-8 h-8 ${
                theme === 'dark' ? 'text-electric-green' : 'text-accent-blue'
              }`} />
            </div>
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
              Have questions about our digital products? Need support? We'd love to hear from you!
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {metrics.map((metric, index) => (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-6 rounded-2xl ${
                  theme === 'dark'
                    ? 'bg-slate-800/50 border border-slate-700'
                    : 'bg-white border border-gray-200 shadow-sm'
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br ${metric.color}`}>
                    <metric.icon className="w-6 h-6 text-white" />
                  </div>
                  <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                    theme === 'dark' ? 'bg-electric-green/20 text-electric-green' : 'bg-green-100 text-green-600'
                  }`}>
                    {metric.change}
                  </span>
                </div>
                <h3 className={`text-2xl font-bold mb-1 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  {metric.value}
                </h3>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  {metric.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`p-6 rounded-2xl ${
                theme === 'dark'
                  ? 'bg-slate-800/50 border border-slate-700'
                  : 'bg-white border border-gray-200 shadow-sm'
              }`}
            >
              <h3 className={`text-lg font-semibold mb-6 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Monthly Sales Performance
              </h3>
              <div className="flex items-end justify-between h-48 gap-4">
                {salesData.map((data, index) => (
                  <div key={data.month} className="flex-1 flex flex-col items-center gap-2">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${(data.value / maxSalesValue) * 100}%` }}
                      transition={{ delay: index * 0.1, duration: 0.5 }}
                      className={`w-full rounded-t-lg bg-gradient-to-t ${
                        theme === 'dark'
                          ? 'from-electric-blue to-electric-green'
                          : 'from-accent-red to-accent-blue'
                      }`}
                      style={{ minHeight: '20px' }}
                    />
                    <span className={`text-xs font-medium ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {data.month}
                    </span>
                  </div>
                ))}
              </div>
              <div className={`mt-4 pt-4 border-t ${
                theme === 'dark' ? 'border-slate-700' : 'border-gray-200'
              }`}>
                <div className="flex items-center justify-between">
                  <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    Total Growth
                  </span>
                  <span className={`text-lg font-bold ${
                    theme === 'dark' ? 'text-electric-green' : 'text-accent-blue'
                  }`}>
                    +45%
                  </span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`p-6 rounded-2xl ${
                theme === 'dark'
                  ? 'bg-slate-800/50 border border-slate-700'
                  : 'bg-white border border-gray-200 shadow-sm'
              }`}
            >
              <h3 className={`text-lg font-semibold mb-6 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Category Performance
              </h3>
              <div className="space-y-5">
                {categoryProgress.map((category, index) => (
                  <div key={category.name}>
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-sm font-medium ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        {category.name}
                      </span>
                      <span className={`text-sm font-semibold ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>
                        {category.percentage}%
                      </span>
                    </div>
                    <div className={`h-3 rounded-full overflow-hidden ${
                      theme === 'dark' ? 'bg-slate-700' : 'bg-gray-200'
                    }`}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${category.percentage}%` }}
                        transition={{ delay: index * 0.1, duration: 0.6 }}
                        className={`h-full rounded-full bg-gradient-to-r ${category.color}`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div className={`p-6 rounded-2xl ${
                theme === 'dark'
                  ? 'bg-slate-800/50 border border-slate-700'
                  : 'bg-white border border-gray-200 shadow-sm'
              }`}>
                <h3 className={`text-xl font-bold mb-6 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  Contact Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {contactInfo.map((item) => (
                    <a
                      key={item.label}
                      href={item.href}
                      className={`flex items-start gap-4 p-4 rounded-xl transition-colors ${
                        theme === 'dark'
                          ? 'bg-slate-700/50 hover:bg-slate-700'
                          : 'bg-gray-50 hover:bg-gray-100'
                      }`}
                    >
                      <div className={`p-3 rounded-lg ${
                        theme === 'dark' ? 'bg-electric-blue/20' : 'bg-accent-blue/10'
                      }`}>
                        <item.icon className={`w-5 h-5 ${
                          theme === 'dark' ? 'text-electric-blue' : 'text-accent-blue'
                        }`} />
                      </div>
                      <div>
                        <h4 className={`font-medium ${
                          theme === 'dark' ? 'text-white' : 'text-gray-900'
                        }`}>
                          {item.label}
                        </h4>
                        <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                          {item.value}
                        </p>
                      </div>
                    </a>
                  ))}
                </div>
              </div>

              <div className={`rounded-2xl overflow-hidden ${
                theme === 'dark'
                  ? 'bg-slate-800/50 border border-slate-700'
                  : 'bg-white border border-gray-200 shadow-sm'
              }`}>
                <div className={`p-4 border-b ${
                  theme === 'dark' ? 'border-slate-700' : 'border-gray-200'
                }`}>
                  <div className="flex items-center gap-2">
                    <MapPin className={`w-5 h-5 ${
                      theme === 'dark' ? 'text-electric-green' : 'text-accent-blue'
                    }`} />
                    <h3 className={`font-semibold ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                      Our Location
                    </h3>
                  </div>
                </div>
                <div className={`h-64 ${theme === 'dark' ? 'bg-slate-700' : 'bg-gray-200'}`}>
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3024.2219901290355!2d-74.00369368400567!3d40.71312937933185!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2sin!4v1639988293073!5m2!1sen!2sin"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Office Location"
                  />
                </div>
                <div className={`p-4 ${theme === 'dark' ? 'bg-slate-800' : 'bg-gray-50'}`}>
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    123 Digital Hub Street, Tech District, NY 10001, USA
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`p-8 rounded-2xl ${
                theme === 'dark'
                  ? 'bg-slate-800 border border-slate-700'
                  : 'bg-white border border-gray-200 shadow-sm'
              }`}
            >
              <h2 className={`text-2xl font-bold mb-2 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Send Us a Message
              </h2>
              <p className={`mb-6 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Fill out the form below and we'll get back to you within 24 hours.
              </p>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
                          : 'bg-gray-50 border-gray-300 text-gray-900 focus:border-accent-blue focus:ring-accent-blue/20'
                      }`}
                      placeholder="John Doe"
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
                          : 'bg-gray-50 border-gray-300 text-gray-900 focus:border-accent-blue focus:ring-accent-blue/20'
                      }`}
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-xl border transition-all focus:outline-none focus:ring-2 ${
                        theme === 'dark'
                          ? 'bg-slate-700 border-slate-600 text-white focus:border-electric-blue focus:ring-electric-blue/20'
                          : 'bg-gray-50 border-gray-300 text-gray-900 focus:border-accent-blue focus:ring-accent-blue/20'
                      }`}
                      placeholder="+1 (555) 123-4567"
                    />
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
                      className={`w-full px-4 py-3 rounded-xl border transition-all focus:outline-none focus:ring-2 ${
                        theme === 'dark'
                          ? 'bg-slate-700 border-slate-600 text-white focus:border-electric-blue focus:ring-electric-blue/20'
                          : 'bg-gray-50 border-gray-300 text-gray-900 focus:border-accent-blue focus:ring-accent-blue/20'
                      }`}
                      placeholder="How can we help?"
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
                    className={`w-full px-4 py-3 rounded-xl border transition-all focus:outline-none focus:ring-2 resize-none ${
                      theme === 'dark'
                        ? 'bg-slate-700 border-slate-600 text-white focus:border-electric-blue focus:ring-electric-blue/20'
                        : 'bg-gray-50 border-gray-300 text-gray-900 focus:border-accent-blue focus:ring-accent-blue/20'
                    }`}
                    placeholder="Tell us more about your inquiry..."
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

      <Footer />
    </div>
  );
}
