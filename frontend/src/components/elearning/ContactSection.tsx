import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const ContactSection = () => {
  const { theme } = useTheme();

  return (
    <section id="contact" className={`py-20 ${
      theme === 'dark' ? 'bg-dark-card' : 'bg-gray-50'
    }`}>
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className={`text-4xl md:text-5xl font-bold mb-4 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Get in{' '}
              <span className={`bg-gradient-to-r ${
                theme === 'dark'
                  ? 'from-electric-green to-electric-blue'
                  : 'from-accent-red to-accent-blue'
              } bg-clip-text text-transparent`}>
                Touch
              </span>
            </h2>
            <p className={`text-lg mb-8 ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Have questions? We're here to help you succeed in your learning journey.
            </p>

            <div className="space-y-6">
              {[
                { icon: Mail, label: 'Email', value: 'nanoflowsvizag@gmail.com' },
                { icon: Phone, label: 'Phone', value: '+91 8019358855' },
                {
                  icon: MapPin,
                  label: 'Location',
                  value:
                    'TF-301, 1-152, Sapthagiri Nagar, Revenue Ward-70, Near Chinamushidiwada, Visakhapatnam - 530051'
                }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  whileHover={{ x: 5 }}
                  className="flex items-start gap-4"
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br ${
                    theme === 'dark'
                      ? 'from-electric-blue/20 to-electric-green/20'
                      : 'from-accent-red/20 to-accent-blue/20'
                  }`}>
                    <item.icon className={`w-6 h-6 ${
                      theme === 'dark' ? 'text-electric-green' : 'text-accent-red'
                    }`} />
                  </div>
                  <div>
                    <p className={`text-sm font-medium mb-1 ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {item.label}
                    </p>
                    <p className={`text-lg font-semibold ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                      {item.value}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className={`p-8 rounded-2xl ${
              theme === 'dark'
                ? 'bg-dark-lighter border border-gray-800'
                : 'bg-white border border-gray-200'
            } shadow-xl`}
          >
            <form className="space-y-6">
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Name
                </label>
                <input
                  type="text"
                  placeholder="Your name"
                  className={`w-full px-4 py-3 rounded-xl border ${
                    theme === 'dark'
                      ? 'bg-dark-bg border-gray-700 text-white placeholder-gray-500'
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                  } focus:outline-none focus:ring-2 ${
                    theme === 'dark' ? 'focus:ring-electric-blue' : 'focus:ring-accent-blue'
                  }`}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Email
                </label>
                <input
                  type="email"
                  placeholder="your.email@example.com"
                  className={`w-full px-4 py-3 rounded-xl border ${
                    theme === 'dark'
                      ? 'bg-dark-bg border-gray-700 text-white placeholder-gray-500'
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                  } focus:outline-none focus:ring-2 ${
                    theme === 'dark' ? 'focus:ring-electric-blue' : 'focus:ring-accent-blue'
                  }`}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Message
                </label>
                <textarea
                  rows={4}
                  placeholder="How can we help you?"
                  className={`w-full px-4 py-3 rounded-xl border ${
                    theme === 'dark'
                      ? 'bg-dark-bg border-gray-700 text-white placeholder-gray-500'
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                  } focus:outline-none focus:ring-2 ${
                    theme === 'dark' ? 'focus:ring-electric-blue' : 'focus:ring-accent-blue'
                  } resize-none`}
                ></textarea>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className={`relative group overflow-hidden w-full px-6 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all duration-300 ${
                  theme === 'dark'
                    ? 'bg-gradient-to-r from-electric-green to-electric-blue text-dark-bg hover:shadow-lg hover:shadow-electric-green/30'
                    : 'bg-gradient-to-r from-accent-red to-accent-blue text-white hover:shadow-lg hover:shadow-accent-red/30'
                }`}
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                <Send className="w-5 h-5" />
                Send Message
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
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
