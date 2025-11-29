import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Store, Users, Shield, Truck, Award, Heart, ArrowRight } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import ShopNav from '../../components/shop/ShopNav';
import Footer from '../../components/Footer';
import SEOHead from '../../components/shop/SEOHead';
import TestimonialsSlider from '../../components/shop/TestimonialsSlider';
import NewsletterForm from '../../components/shop/NewsletterForm';

export default function ShopAbout() {
  const { theme } = useTheme();

  const stats = [
    { value: '10K+', label: 'Happy Customers' },
    { value: '5K+', label: 'Products' },
    { value: '99%', label: 'Satisfaction Rate' },
    { value: '24/7', label: 'Support' },
  ];

  const values = [
    {
      icon: Shield,
      title: 'Quality First',
      description: 'Every product is carefully curated and quality-checked before reaching your hands.',
    },
    {
      icon: Truck,
      title: 'Fast Delivery',
      description: 'We partner with top carriers to ensure your orders arrive quickly and safely.',
    },
    {
      icon: Heart,
      title: 'Customer Love',
      description: 'Your satisfaction is our priority. We go above and beyond for our customers.',
    },
    {
      icon: Award,
      title: 'Best Prices',
      description: 'Competitive pricing without compromising on quality. Value for every penny.',
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
        title="About Us"
        description="Learn about NanoFlows Shop - our mission, values, and the team behind your favorite shopping destination."
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
            <Store className={`w-16 h-16 mx-auto mb-6 ${
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
                NanoFlows Shop
              </span>
            </h1>
            <p className={`text-xl ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              We're on a mission to make online shopping delightful. Quality products,
              exceptional service, and a community that cares.
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
                  NanoFlows Shop started with a simple idea: make online shopping better.
                  We noticed that customers were tired of poor quality products, slow shipping,
                  and unhelpful customer service.
                </p>
                <p>
                  So we built something different. A shopping platform where every product is
                  handpicked for quality, every order is shipped with care, and every customer
                  is treated like family.
                </p>
                <p>
                  Today, we serve thousands of happy customers worldwide and continue to grow
                  our catalog with amazing products that make life better.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 gap-4"
            >
              {values.map((value, index) => (
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
              The passionate people behind NanoFlows Shop
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

      <section className={`py-20 ${theme === 'dark' ? 'bg-slate-900/50' : 'bg-gray-100'}`}>
        <div className="container mx-auto px-4 lg:px-6">
          <h2 className={`text-3xl font-bold text-center mb-12 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            What Our Customers Say
          </h2>
          <TestimonialsSlider />
        </div>
      </section>

      <section className="py-20">
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
              Ready to Start Shopping?
            </h2>
            <p className={`text-lg mb-8 max-w-2xl mx-auto ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Join thousands of happy customers and discover amazing products at great prices.
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
