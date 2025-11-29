import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Zap, Users, Shield, Download, Award, Heart, ArrowRight, Code, Sparkles, Globe } from 'lucide-react';
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

  const values = [
    {
      icon: Shield,
      title: 'Quality Assured',
      description: 'Every digital product is rigorously tested and verified before being added to our marketplace.',
    },
    {
      icon: Download,
      title: 'Instant Delivery',
      description: 'Get immediate access to your purchases. No waiting - download and start using right away.',
    },
    {
      icon: Heart,
      title: 'Customer First',
      description: 'Your satisfaction drives everything we do. We\'re committed to your success with our products.',
    },
    {
      icon: Award,
      title: 'Best Value',
      description: 'Premium digital products at competitive prices. Maximize your ROI with every purchase.',
    },
  ];

  const whatWeOffer = [
    {
      icon: Code,
      title: 'Software & Tools',
      description: 'Professional software, plugins, and development tools to supercharge your workflow.',
    },
    {
      icon: Sparkles,
      title: 'Templates & Assets',
      description: 'Ready-to-use templates, design assets, and creative resources for any project.',
    },
    {
      icon: Globe,
      title: 'Digital Courses',
      description: 'Expert-led courses and tutorials to level up your skills and knowledge.',
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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className={`text-4xl md:text-5xl font-bold mb-2 ${
                  theme === 'dark'
                    ? 'text-transparent bg-clip-text bg-gradient-to-r from-electric-blue to-electric-green'
                    : 'text-transparent bg-clip-text bg-gradient-to-r from-accent-red to-accent-blue'
                }`}>
                  {stat.value}
                </div>
                <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                  {stat.label}
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
                Our Story
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
                  className={`p-6 rounded-2xl ${
                    theme === 'dark'
                      ? 'bg-slate-800 border border-slate-700'
                      : 'bg-gray-50 border border-gray-200'
                  }`}
                >
                  <value.icon className={`w-8 h-8 mb-4 ${
                    theme === 'dark' ? 'text-electric-green' : 'text-accent-blue'
                  }`} />
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
              What We Offer
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
                className={`p-8 rounded-2xl text-center ${
                  theme === 'dark'
                    ? 'bg-slate-800 border border-slate-700'
                    : 'bg-white border border-gray-200 shadow-sm'
                }`}
              >
                <div className={`w-16 h-16 mx-auto mb-6 rounded-2xl flex items-center justify-center ${
                  theme === 'dark'
                    ? 'bg-gradient-to-br from-electric-blue/20 to-electric-green/20'
                    : 'bg-gradient-to-br from-accent-red/10 to-accent-blue/10'
                }`}>
                  <item.icon className={`w-8 h-8 ${
                    theme === 'dark' ? 'text-electric-green' : 'text-accent-blue'
                  }`} />
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
              Meet Our Team
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

      <section className="py-20">
        <div className="container mx-auto px-4 lg:px-6">
          <h2 className={`text-3xl font-bold text-center mb-12 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            What Our Customers Say
          </h2>
          <TestimonialsSlider />
        </div>
      </section>

      <section className={`py-20 ${theme === 'dark' ? 'bg-slate-900/50' : 'bg-gray-100'}`}>
        <div className="container mx-auto px-4 lg:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={`text-center p-12 rounded-2xl ${
              theme === 'dark'
                ? 'bg-gradient-to-r from-electric-blue/20 to-electric-green/20'
                : 'bg-gradient-to-r from-accent-red/10 to-accent-blue/10'
            }`}
          >
            <h2 className={`text-3xl font-bold mb-4 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Ready to Explore Digital Products?
            </h2>
            <p className={`text-lg mb-8 max-w-2xl mx-auto ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Discover our curated collection of premium software, templates, courses, and digital tools.
              Instant delivery, lifetime access, and exceptional quality guaranteed.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/shop/products"
                className={`inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-lg transition-all ${
                  theme === 'dark'
                    ? 'bg-gradient-to-r from-electric-blue to-electric-green text-slate-900 hover:shadow-lg'
                    : 'bg-gradient-to-r from-accent-red to-accent-blue text-white hover:shadow-lg'
                }`}
              >
                Browse Products
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/shop/contact"
                className={`inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-lg transition-all border ${
                  theme === 'dark'
                    ? 'border-slate-600 text-white hover:bg-slate-800'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                }`}
              >
                Contact Us
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <NewsletterForm variant="full" />

      <Footer />
    </div>
  );
}
