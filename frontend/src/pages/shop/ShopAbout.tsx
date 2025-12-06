import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Zap, Users, Shield, Download, Award, Heart, ArrowRight, Code, Sparkles, Globe, ShoppingCart, Package, Star } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import ShopNav from '../../components/shop/ShopNav';
import Footer from '../../components/Footer';
import SEOHead from '../../components/shop/SEOHead';
import TestimonialsSlider from '../../components/shop/TestimonialsSlider';
import NewsletterForm from '../../components/shop/NewsletterForm';

export default function ShopAbout() {
  const { theme } = useTheme();

  const stats = [
    { value: '50K+', label: 'Happy Customers' },
    { value: '500+', label: 'Digital Products' },
    { value: '99.9%', label: 'Uptime' },
    { value: '24/7', label: 'Support' },
  ];

  const metrics = [
    { icon: Users, label: 'Happy Customers', value: '50,000+', change: '+12%', color: 'from-blue-500 to-cyan-500' },
    { icon: ShoppingCart, label: 'Orders Completed', value: '125,000+', change: '+8%', color: 'from-green-500 to-emerald-500' },
    { icon: Package, label: 'Products Delivered', value: '180,000+', change: '+15%', color: 'from-purple-500 to-violet-500' },
    { icon: Star, label: 'Average Rating', value: '4.9/5', change: '+0.2', color: 'from-amber-500 to-orange-500' },
  ];

  const values = [
    {
      icon: Shield,
      title: 'Quality Assured',
      description: 'Every digital product is rigorously tested and verified before being added to our marketplace.',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Download,
      title: 'Instant Delivery',
      description: 'Get immediate access to your purchases. No waiting - download and start using right away.',
      color: 'from-pink-500 to-rose-500'
    },
    {
      icon: Heart,
      title: 'Customer First',
      description: 'Your satisfaction drives everything we do. We\'re committed to your success with our products.',
      color: 'from-emerald-500 to-green-500'
    },
    {
      icon: Award,
      title: 'Best Value',
      description: 'Premium digital products at competitive prices. Maximize your ROI with every purchase.',
      color: 'from-purple-500 to-violet-500'
    },
  ];

  const whatWeOffer = [
    {
      icon: Code,
      title: 'Software & Tools',
      description: 'Professional software, plugins, and development tools to supercharge your workflow.',
      color: 'from-blue-500 via-cyan-500 to-blue-600'
    },
    {
      icon: Sparkles,
      title: 'Templates & Assets',
      description: 'Ready-to-use templates, design assets, and creative resources for any project.',
      color: 'from-rose-500 via-pink-500 to-red-500'
    },
    {
      icon: Globe,
      title: 'Digital Courses',
      description: 'Expert-led courses and tutorials to level up your skills and knowledge.',
      color: 'from-emerald-500 via-green-500 to-teal-500'
    },
  ];

  const team = [
    { name: 'Alex Chen', role: 'Founder & CEO', avatar: '' },
    { name: 'Sarah Miller', role: 'Head of Product', avatar: '' },
    { name: 'David Kim', role: 'Customer Success', avatar: '' },
    { name: 'Emma Wilson', role: 'Marketing Lead', avatar: '' },
  ];

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-slate-950' : 'bg-gray-50'}`}>
      <SEOHead
        title="About Us - Digital Hub"
        description="Learn about Digital Hub - your premier destination for high-quality digital products including software, templates, courses, and more."
      />
      <ShopNav />

      <section className={`py-20 ${
        theme === 'dark'
          ? 'bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900'
          : 'bg-gradient-to-br from-gray-50 via-white to-gray-50'
      }`}>
        <div className="container mx-auto px-4 lg:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <Zap className={`w-16 h-16 mx-auto mb-6 ${
              theme === 'dark' ? 'text-electric-green' : 'text-accent-blue'
            }`} />
            <h1 className={`text-4xl md:text-5xl font-bold mb-6 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              About{' '}
              <span className={`${
                theme === 'dark'
                  ? 'text-transparent bg-clip-text bg-gradient-to-r from-electric-blue to-electric-green'
                  : 'text-transparent bg-clip-text bg-gradient-to-r from-accent-red to-accent-blue'
              }`}>
                Digital Hub
              </span>
            </h1>
            <p className={`text-xl ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              Your premier destination for high-quality digital products. We curate and deliver
              the best software, templates, courses, and digital tools to help you succeed.
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
                className={`p-6 rounded-2xl border ${
                  theme === 'dark'
                    ? 'bg-slate-900/80 border-slate-700/70 backdrop-blur-sm'
                    : 'bg-gradient-to-br from-accent-red/10 to-accent-blue/10 border-accent-red/30 backdrop-blur-sm shadow-lg'
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

      <section className={`py-20 ${theme === 'dark' ? 'bg-slate-900/50' : 'bg-white'}`}>
        <div className="container mx-auto px-4 lg:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className={`text-3xl font-bold mb-6 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Our{' '}
                <span
                  className={`bg-gradient-to-r ${
                    theme === 'dark'
                      ? 'from-electric-blue to-electric-green'
                      : 'from-accent-red to-accent-blue'
                  } bg-clip-text text-transparent`}
                >
                  Story
                </span>
              </h2>
              <div className={`space-y-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                <p>
                  Digital Hub was born from a simple vision: to create a trusted marketplace
                  where creators and consumers can connect through high-quality digital products.
                  We saw the growing demand for digital assets and the need for a curated platform.
                </p>
                <p>
                  Unlike traditional e-commerce, we specialize exclusively in digital products -
                  from software and development tools to templates, courses, and creative assets.
                  Every product is carefully vetted to ensure quality and value.
                </p>
                <p>
                  Today, Digital Hub serves thousands of customers worldwide, providing instant
                  access to premium digital products that help businesses and individuals achieve
                  their goals faster and more efficiently.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 gap-4"
            >
              {values.map((value) => (
                <div
                  key={value.title}
                  className={`p-6 rounded-2xl border ${
                    theme === 'dark'
                      ? 'bg-slate-900/80 border-slate-700/70 backdrop-blur-sm'
                      : 'bg-gradient-to-br from-accent-red/10 to-accent-blue/10 border-accent-red/30 backdrop-blur-sm shadow-lg'
                  }`}
                >
                  <div className={`w-14 h-14 mb-4 rounded-2xl flex items-center justify-center bg-gradient-to-br ${value.color}`}>
                    <value.icon className="w-7 h-7 text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.25)]" />
                  </div>
                  <h3 className={`font-semibold mb-2 ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    {value.title}
                  </h3>
                  <p className={`text-sm ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {value.description}
                  </p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4 lg:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <Download className={`w-12 h-12 mx-auto mb-4 ${
              theme === 'dark' ? 'text-electric-green' : 'text-accent-blue'
            }`} />
            <h2 className={`text-3xl font-bold mb-4 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              What We{' '}
              <span className={`bg-gradient-to-r ${
                theme === 'dark'
                  ? 'from-electric-green to-electric-blue'
                  : 'from-accent-red to-accent-blue'
              } bg-clip-text text-transparent`}>
                Offer
              </span>
            </h2>
            <p className={`max-w-2xl mx-auto ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Premium digital products across multiple categories
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {whatWeOffer.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`p-8 rounded-2xl text-center border ${
                  theme === 'dark'
                    ? 'bg-slate-900/80 border-slate-700/70 backdrop-blur-sm'
                    : 'bg-gradient-to-br from-accent-red/10 to-accent-blue/10 border-accent-red/30 backdrop-blur-sm shadow-lg'
                }`}
              >
                <div className={`w-16 h-16 mx-auto mb-6 rounded-2xl flex items-center justify-center bg-gradient-to-br ${item.color}`}>
                  <item.icon className="w-8 h-8 text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.25)]" />
                </div>
                <h3 className={`text-xl font-semibold mb-3 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  {item.title}
                </h3>
                <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className={`py-20 ${theme === 'dark' ? 'bg-slate-900/50' : 'bg-gray-100'}`}>
        <div className="container mx-auto px-4 lg:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <Users className={`w-12 h-12 mx-auto mb-4 ${
              theme === 'dark' ? 'text-electric-green' : 'text-accent-blue'
            }`} />
            <h2 className={`text-3xl font-bold mb-4 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Meet Our{' '}
              <span className={`bg-gradient-to-r ${
                theme === 'dark'
                  ? 'from-electric-green to-electric-blue'
                  : 'from-accent-red to-accent-blue'
              } bg-clip-text text-transparent`}>
                Team
              </span>
            </h2>
            <p className={`max-w-2xl mx-auto ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
            }`}>
              The passionate people behind Digital Hub
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className={`w-24 h-24 mx-auto mb-4 rounded-full flex items-center justify-center text-3xl font-bold ${
                  theme === 'dark'
                    ? 'bg-gradient-to-br from-electric-blue to-electric-green text-slate-900'
                    : 'bg-gradient-to-br from-accent-red to-accent-blue text-white'
                }`}>
                  {member.name.charAt(0)}
                </div>
                <h3 className={`font-semibold ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  {member.name}
                </h3>
                <p className={`text-sm ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {member.role}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <NewsletterForm variant="full" />

      <Footer variant="shop" />
    </div>
  );
}
