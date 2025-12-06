import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import AIToolsNav from '../../components/aitools/AIToolsNav';
import Footer from '../../components/Footer';
import SEO from '../../components/SEO';
import {
  Brain,
  Sparkles,
  Zap,
  Shield,
  Target,
  Rocket,
  Users,
  Award,
  TrendingUp,
  CheckCircle,
  ArrowRight,
  Globe,
  Clock,
  HeartHandshake
} from 'lucide-react';
import aboutImage from '@assets/stock_images/modern_technology_wo_7f70cc19.jpg';
import featureImage from '@assets/stock_images/artificial_intellige_cc95d560.jpg';

const AIToolsAbout = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();

  const values = [
    {
      icon: Target,
      title: 'Purpose-Driven',
      description: 'We curate tools that solve real problems and enhance productivity meaningfully.'
    },
    {
      icon: Shield,
      title: 'Quality Assured',
      description: 'Every tool is vetted for reliability, security, and user experience before inclusion.'
    },
    {
      icon: HeartHandshake,
      title: 'User First',
      description: 'Our platform is designed with users in mind, making AI accessible to everyone.'
    },
    {
      icon: Rocket,
      title: 'Innovation',
      description: 'We stay ahead of the curve, continuously adding the latest AI breakthroughs.'
    }
  ];

  const stats = [
    { icon: Brain, value: '50+', label: 'AI Tools' },
    { icon: Users, value: '50K+', label: 'Active Users' },
    { icon: Globe, value: '100+', label: 'Countries' },
    { icon: Award, value: '4.9', label: 'User Rating' }
  ];

  const benefits = [
    'Curated collection of the best AI tools',
    'Regular updates with new tools and features',
    'Detailed information and honest reviews',
    'Easy-to-use interface for all skill levels',
    'Category-based organization for quick discovery',
    'Free and premium tool options',
    'Secure and trusted recommendations',
    'Dedicated support and community'
  ];

  const timeline = [
    {
      year: '2023',
      title: 'Platform Launch',
      description: 'Started with 20 carefully selected AI tools'
    },
    {
      year: '2024',
      title: 'Rapid Growth',
      description: 'Expanded to 50+ tools with 50K+ users'
    },
    {
      year: 'Future',
      title: 'AI Integration',
      description: 'Building direct AI tool integrations'
    }
  ];

  return (
    <>
      <SEO
        title="About | NanoFlows AI Tools"
        description="Learn about NanoFlows AI Tools platform - your gateway to powerful AI solutions for productivity and creativity."
        keywords="AI tools about, artificial intelligence platform, AI solutions, productivity tools"
      />
      <div className={`min-h-screen w-full max-w-full overflow-x-hidden flex flex-col ${theme === 'dark' ? 'bg-dark-bg' : 'bg-gray-50'}`}>
        <AIToolsNav />

      <section className="relative overflow-hidden py-20 lg:py-28">
        <div className={`absolute inset-0 ${
          theme === 'dark'
            ? 'bg-gradient-to-br from-dark-bg via-dark-card to-dark-bg'
            : 'bg-gradient-to-br from-white via-gray-50 to-white'
        }`} />
        <div className={`absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-3xl opacity-20 ${
          theme === 'dark' ? 'bg-electric-blue' : 'bg-accent-red'
        }`} />

        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border mb-6 ${
                  theme === 'dark'
                    ? 'border-electric-blue/30 bg-electric-blue/10'
                    : 'border-accent-red/30 bg-accent-red/10'
                }`}
              >
                <Sparkles className={`w-4 h-4 ${
                  theme === 'dark' ? 'text-electric-green' : 'text-accent-red'
                }`} />
                <span className={`text-sm font-semibold ${
                  theme === 'dark' ? 'text-electric-blue' : 'text-accent-blue'
                }`}>
                  About Our Platform
                </span>
              </motion.div>

              <h1 className={`text-4xl md:text-5xl font-bold mb-6 leading-tight ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`} style={{ fontFamily: 'Orbitron, sans-serif' }}>
                Empowering You with{' '}
                <span className={`bg-gradient-to-r ${
                  theme === 'dark'
                    ? 'from-electric-green to-electric-blue'
                    : 'from-accent-red to-accent-blue'
                } bg-clip-text text-transparent`}>
                  AI Innovation
                </span>
              </h1>

              <p className={`text-lg md:text-xl mb-8 leading-relaxed ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
              }`}>
                NanoFlows AI Tools Platform is your gateway to the world's most powerful 
                artificial intelligence tools. We curate, organize, and present the best 
                AI solutions to help you work smarter, create faster, and achieve more.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate('/ai-tools/explore')}
                  className={`relative group overflow-hidden px-8 py-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg transition-all duration-300 ${
                    theme === 'dark'
                      ? 'bg-gradient-to-r from-electric-blue to-electric-green text-black'
                      : 'bg-gradient-to-r from-accent-red to-accent-blue text-white'
                  }`}
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                  <Zap className="w-5 h-5" />
                  Explore Tools
                  </span>
                  <div
                    className={`absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 ${
                      theme === 'dark'
                        ? 'bg-gradient-to-r from-electric-green to-electric-blue'
                        : 'bg-gradient-to-r from-accent-blue to-accent-red'
                    }`}
                  />
                </motion.button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <img
                src={aboutImage}
                alt="AI Technology"
                className="rounded-3xl shadow-2xl w-full object-cover aspect-[4/3]"
              />
            </motion.div>
          </div>
        </div>
      </section>

      <section className={`py-16 ${theme === 'dark' ? 'bg-dark-card' : 'bg-white'}`}>
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4 ${
                    theme === 'dark'
                      ? 'bg-electric-blue/20 text-electric-blue'
                      : 'bg-accent-red/10 text-accent-red'
                  }`}>
                    <Icon className="w-7 h-7" />
                  </div>
                  <p className={`text-4xl font-bold mb-1 ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`} style={{ fontFamily: 'Orbitron, sans-serif' }}>
                    {stat.value}
                  </p>
                  <p className={`text-sm ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>{stat.label}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section className={`py-20 ${theme === 'dark' ? 'bg-dark-bg' : 'bg-gray-50'}`}>
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`} style={{ fontFamily: 'Orbitron, sans-serif' }}>
              Our{' '}
              <span className={`bg-gradient-to-r ${
                theme === 'dark'
                  ? 'from-electric-green to-electric-blue'
                  : 'from-accent-red to-accent-blue'
              } bg-clip-text text-transparent`}>
                Mission
              </span>
            </h2>
            <p className={`text-lg max-w-3xl mx-auto ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              We believe AI should be accessible to everyone. Our mission is to demystify 
              artificial intelligence by providing a curated platform where anyone can 
              discover, learn about, and use the best AI tools available.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className={`p-6 rounded-2xl transition-all border ${
                    theme === 'dark'
                      ? 'bg-slate-900/80 border-slate-700/70 backdrop-blur-sm hover:border-electric-blue'
                      : 'bg-gradient-to-br from-accent-red/10 to-accent-blue/10 border-accent-red/30 backdrop-blur-sm hover:border-accent-blue/60 shadow-lg'
                  }`}
                >
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4 ${
                    theme === 'dark'
                      ? 'bg-gradient-to-br from-electric-blue/20 to-electric-green/20 text-electric-blue'
                      : 'bg-gradient-to-br from-accent-red/10 to-accent-blue/10 text-accent-red'
                  }`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className={`text-lg font-bold mb-2 ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>{value.title}</h3>
                  <p className={`text-sm ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>{value.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section className={`py-20 ${theme === 'dark' ? 'bg-dark-card' : 'bg-white'}`}>
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className={`text-3xl md:text-4xl font-bold mb-6 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`} style={{ fontFamily: 'Orbitron, sans-serif' }}>
                Why Choose{' '}
                <span className={`bg-gradient-to-r ${
                  theme === 'dark'
                    ? 'from-electric-green to-electric-blue'
                    : 'from-accent-red to-accent-blue'
                } bg-clip-text text-transparent`}>
                  Us?
                </span>
              </h2>
              <p className={`text-lg mb-8 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                We're not just another AI directory. We're your trusted partner in 
                navigating the rapidly evolving world of artificial intelligence.
              </p>

              <div className="grid sm:grid-cols-2 gap-4">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center gap-3"
                  >
                    <CheckCircle className={`w-5 h-5 flex-shrink-0 ${
                      theme === 'dark' ? 'text-electric-green' : 'text-green-500'
                    }`} />
                    <span className={`text-sm ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>{benefit}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <img
                src={featureImage}
                alt="AI Features"
                className="rounded-3xl shadow-2xl w-full object-cover aspect-[4/3]"
              />
            </motion.div>
          </div>
        </div>
      </section>

      <section className={`py-20 ${theme === 'dark' ? 'bg-dark-bg' : 'bg-gray-50'}`}>
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`} style={{ fontFamily: 'Orbitron, sans-serif' }}>
              Our{' '}
              <span className={`bg-gradient-to-r ${
                theme === 'dark'
                  ? 'from-electric-green to-electric-blue'
                  : 'from-accent-red to-accent-blue'
              } bg-clip-text text-transparent`}>
                Journey
              </span>
            </h2>
            <p className={`text-lg max-w-2xl mx-auto ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              From a simple idea to a comprehensive AI tools platform
            </p>
          </motion.div>

          <div className="max-w-3xl mx-auto">
            <div className="relative">
              <div className={`absolute left-6 top-0 bottom-0 w-0.5 ${
                theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'
              }`} />

              {timeline.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15 }}
                  className="relative flex gap-6 pb-10 last:pb-0"
                >
                  <div className={`relative z-10 flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${
                    theme === 'dark'
                      ? 'bg-electric-blue text-black'
                      : 'bg-accent-red text-white'
                  }`}>
                    <Clock className="w-5 h-5" />
                  </div>
                  <div className={`flex-1 p-6 rounded-2xl border ${
                    theme === 'dark'
                      ? 'bg-slate-900/80 border-slate-700/70 backdrop-blur-sm'
                      : 'bg-gradient-to-br from-accent-red/10 to-accent-blue/10 border-accent-red/30 backdrop-blur-sm shadow-lg'
                  }`}>
                    <span className={`text-sm font-bold ${
                      theme === 'dark' ? 'text-electric-green' : 'text-accent-red'
                    }`}>{item.year}</span>
                    <h3 className={`text-xl font-bold mt-1 mb-2 ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>{item.title}</h3>
                    <p className={`text-sm ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className={`py-20 ${theme === 'dark' ? 'bg-dark-card' : 'bg-white'}`}>
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={`relative overflow-hidden rounded-3xl p-8 md:p-12 lg:p-16 ${
              theme === 'dark'
                ? 'bg-gradient-to-br from-electric-blue/20 to-electric-green/20'
                : 'bg-gradient-to-br from-accent-red/10 to-accent-blue/10'
            }`}
          >
            <div className="relative z-10 text-center max-w-3xl mx-auto">
              <Sparkles className={`w-12 h-12 mx-auto mb-6 ${
                theme === 'dark' ? 'text-electric-green' : 'text-accent-red'
              }`} />
              <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`} style={{ fontFamily: 'Orbitron, sans-serif' }}>
                Start Exploring{' '}
                <span className={`bg-gradient-to-r ${
                  theme === 'dark'
                    ? 'from-electric-green to-electric-blue'
                    : 'from-accent-red to-accent-blue'
                } bg-clip-text text-transparent`}>
                  Today
                </span>
              </h2>
              <p className={`text-lg mb-8 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Join thousands of users who have already discovered the power of AI. 
                Find the perfect tool for your needs and transform the way you work.
              </p>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/ai-tools/explore')}
                className={`relative group overflow-hidden px-10 py-4 rounded-xl font-bold flex items-center gap-2 mx-auto shadow-lg transition-all duration-300 ${
                  theme === 'dark'
                    ? 'bg-gradient-to-r from-electric-blue to-electric-green text-black'
                    : 'bg-gradient-to-r from-accent-red to-accent-blue text-white'
                }`}
              >
                <span className="relative z-10 flex items-center gap-2">
                <Rocket className="w-5 h-5" />
                Browse All Tools
                <ArrowRight className="w-5 h-5" />
                </span>
                <div
                  className={`absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 ${
                    theme === 'dark'
                      ? 'bg-gradient-to-r from-electric-green to-electric-blue'
                      : 'bg-gradient-to-r from-accent-blue to-accent-red'
                  }`}
                />
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer variant="ai-tools" />
      </div>
    </>
  );
};

export default AIToolsAbout;
