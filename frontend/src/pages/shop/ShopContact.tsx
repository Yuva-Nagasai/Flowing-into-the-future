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
  {
    icon: Globe,
    title: 'Monthly Reach',
    value: '128.4K',
    change: '+12.4%',
    description: 'Visitors touched the store',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Users,
    title: 'Qualified Leads',
    value: '3,240',
    change: '+8.1%',
    description: 'Forms & demos requested',
    color: 'from-emerald-500 to-green-500',
  },
  {
    icon: MessageCircle,
    title: 'Conversation Rate',
    value: '27%',
    change: '+3.2%',
    description: 'Chats that became sales calls',
    color: 'from-purple-500 to-violet-500',
  },
  {
    icon: Clock,
    title: 'Avg. Response',
    value: '1h 12m',
    change: '-18m',
    description: 'Median reply time',
    color: 'from-amber-500 to-orange-500',
  },
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
    {
      icon: Mail,
      label: 'Email Us',
      value: 'nanoflowsvizag@gmail.com',
      href: 'mailto:nanoflowsvizag@gmail.com',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Phone,
      label: 'Call Us',
      value: '+91 8019358855',
      href: 'tel:+918019358855',
      color: 'from-pink-500 to-rose-500'
    },
    { icon: Clock, label: 'Support Hours', value: 'Mon-Sat, 9:30 AM - 6:30 PM IST', href: '#', color: 'from-amber-500 to-orange-500' },
    { icon: Globe, label: 'Website', value: 'www.nanoflows.com', href: 'https://www.nanoflows.com', color: 'from-emerald-500 to-green-500' },
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
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-8">
            <div>
              <p
                className={`text-xs font-semibold tracking-[0.25em] uppercase mb-2 ${
                  theme === 'dark' ? 'text-electric-green' : 'text-accent-blue'
                }`}
              >
                Engagement Pulse
              </p>
              <h2
                className={`text-2xl md:text-3xl font-bold ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}
              >
                See how people reach out before they even submit a form.
              </h2>
            </div>

            <div className="inline-flex items-center gap-2 self-start">
              {['7 days', '30 days', '90 days'].map((label) => {
                const isActive = label === '30 days';
                return (
                  <button
                    key={label}
                    type="button"
                    className={`px-3.5 py-2 rounded-full text-xs font-medium border transition-all ${
                      isActive
                        ? theme === 'dark'
                          ? 'bg-orange-500/20 border-orange-500 text-orange-200'
                          : 'bg-orange-500 text-white border-orange-500 shadow-sm'
                        : theme === 'dark'
                          ? 'border-slate-700 text-gray-400 hover:bg-slate-800'
                          : 'border-gray-300 text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {metrics.map((metric, index) => {
              const Icon = metric.icon;
              const isNegative = metric.change.trim().startsWith('-');

              return (
                <motion.div
                  key={metric.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className={`p-6 rounded-2xl border ${
                    theme === 'dark'
                      ? 'bg-slate-900/80 border-slate-700/70 backdrop-blur-sm'
                      : 'bg-gradient-to-br from-accent-red/10 to-accent-blue/10 border-accent-red/30 backdrop-blur-sm shadow-lg'
                  }`}
                >
                  <div className="flex items-center justify-between mb-6">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br ${metric.color} shadow-lg`}
                    >
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <span
                      className={`text-xs font-semibold px-2 py-1 rounded-full ${
                        isNegative
                          ? theme === 'dark'
                            ? 'bg-red-500/10 text-red-400'
                            : 'bg-red-100 text-red-600'
                          : theme === 'dark'
                            ? 'bg-emerald-500/10 text-emerald-300'
                            : 'bg-emerald-100 text-emerald-600'
                      }`}
                    >
                      {metric.change}
                    </span>
                  </div>

                  <p
                    className={`text-sm mb-1 ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                    }`}
                  >
                    {metric.title}
                  </p>
                  <p
                    className={`text-3xl font-bold mb-1 ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}
                  >
                    {metric.value}
                  </p>
                  <p
                    className={`text-xs ${
                      theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
                    }`}
                  >
                    {metric.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`p-6 rounded-2xl border ${
                theme === 'dark'
                  ? 'bg-slate-900/80 border-slate-700/70 backdrop-blur-sm'
                  : 'bg-gradient-to-br from-accent-red/10 to-accent-blue/10 border-accent-red/30 backdrop-blur-sm shadow-lg'
              }`}
            >
              <h3 className={`text-lg font-semibold mb-6 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Monthly{' '}
                <span className={
                  theme === 'dark'
                    ? 'text-transparent bg-clip-text bg-gradient-to-r from-electric-green to-electric-blue'
                    : 'text-transparent bg-clip-text bg-gradient-to-r from-accent-red to-accent-blue'
                }>
                  Sales Performance
                </span>
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
              className={`p-6 rounded-2xl border ${
                theme === 'dark'
                  ? 'bg-slate-900/80 border-slate-700/70 backdrop-blur-sm'
                  : 'bg-gradient-to-br from-accent-red/10 to-accent-blue/10 border-accent-red/30 backdrop-blur-sm shadow-lg'
              }`}
            >
              <h3 className={`text-lg font-semibold mb-6 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Category{' '}
                <span className={
                  theme === 'dark'
                    ? 'text-transparent bg-clip-text bg-gradient-to-r from-electric-green to-electric-blue'
                    : 'text-transparent bg-clip-text bg-gradient-to-r from-accent-red to-accent-blue'
                }>
                  Performance
                </span>
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
              <div className={`p-6 rounded-2xl border ${
                theme === 'dark'
                  ? 'bg-slate-900/80 border-slate-700/70 backdrop-blur-sm'
                  : 'bg-gradient-to-br from-accent-red/10 to-accent-blue/10 border-accent-red/30 backdrop-blur-sm shadow-lg'
              }`}>
                <h3 className={`text-xl font-bold mb-6 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  Contact{' '}
                  <span className={
                    theme === 'dark'
                      ? 'text-transparent bg-clip-text bg-gradient-to-r from-electric-green to-electric-blue'
                      : 'text-transparent bg-clip-text bg-gradient-to-r from-accent-red to-accent-blue'
                  }>
                    Information
                  </span>
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
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center bg-gradient-to-br ${item.color} shadow-lg`}>
                        <item.icon className="w-5 h-5 text-white" />
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

              <div className={`rounded-2xl overflow-hidden border ${
                theme === 'dark'
                  ? 'bg-slate-900/80 border-slate-700/70 backdrop-blur-sm'
                  : 'bg-gradient-to-br from-accent-red/10 to-accent-blue/10 border-accent-red/30 backdrop-blur-sm shadow-lg'
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
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3798.7308590340035!2d83.20767237517455!3d17.80434178315571!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a39678013ee404f%3A0x184b35589f4bb765!2sNanoflows%20AI%20Software%20Technologies%20Private%20Limited!5e0!3m2!1sen!2sin!4v1762760607244!5m2!1sen!2sin"
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
                    TF-301, 1-152, Sapthagiri Nagar, Revenue Ward-70, Near Chinamushidiwada, Visakhapatnam - 530051
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`p-8 rounded-2xl border ${
                theme === 'dark'
                  ? 'bg-slate-900/80 border-slate-700/70 backdrop-blur-sm'
                  : 'bg-gradient-to-br from-accent-red/10 to-accent-blue/10 border-accent-red/30 backdrop-blur-sm shadow-lg'
              }`}
            >
              <h2 className={`text-2xl font-bold mb-2 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Send Us a{' '}
                <span className={
                  theme === 'dark'
                    ? 'text-transparent bg-clip-text bg-gradient-to-r from-electric-green to-electric-blue'
                    : 'text-transparent bg-clip-text bg-gradient-to-r from-accent-red to-accent-blue'
                }>
                  Message
                </span>
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
                  className={`relative group overflow-hidden w-full flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 disabled:opacity-50 ${
                    success
                      ? 'bg-green-500 text-white'
                      : theme === 'dark'
                        ? 'bg-gradient-to-r from-electric-blue to-electric-green text-slate-900 hover:shadow-lg hover:shadow-electric-blue/25'
                        : 'bg-gradient-to-r from-accent-red to-accent-blue text-white hover:shadow-lg hover:shadow-accent-red/25'
                  }`}
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
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
                  </span>
                  {!success && (
                    <div
                      className={`absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 ${
                        theme === 'dark'
                          ? 'bg-gradient-to-r from-electric-green to-electric-blue'
                          : 'bg-gradient-to-r from-accent-blue to-accent-red'
                      }`}
                    />
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer variant="shop" />
    </div>
  );
}
