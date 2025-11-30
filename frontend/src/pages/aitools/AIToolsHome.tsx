import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { aiToolsAPI } from '../../utils/api';
import AIToolsNav from '../../components/aitools/AIToolsNav';
import Footer from '../../components/Footer';
import {
  Brain,
  Sparkles,
  ArrowRight,
  Zap,
  Shield,
  Clock,
  Star,
  TrendingUp,
  Users,
  Target,
  Rocket,
  Code,
  Image,
  FileText,
  Mic,
  Video,
  BarChart3,
  Languages,
  Play
} from 'lucide-react';
import heroImage1 from '@assets/stock_images/artificial_intellige_f33bc633.jpg';
import heroImage2 from '@assets/stock_images/artificial_intellige_cc95d560.jpg';
import heroImage3 from '@assets/stock_images/technology_coding_pr_24d87b89.jpg';
import featureImage from '@assets/stock_images/artificial_intellige_f7aceee1.jpg';

interface AITool {
  id: string;
  name: string;
  description: string;
  category: string;
  color: string;
  features: string[];
  pricing_type: 'free' | 'paid';
  url: string;
}

const getCategoryIcon = (category: string) => {
  const iconMap: Record<string, any> = {
    text: FileText,
    image: Image,
    code: Code,
    audio: Mic,
    video: Video,
    analysis: BarChart3,
    translation: Languages,
    default: Brain
  };
  return iconMap[category] || iconMap.default;
};

interface HeroSlide {
  image: string;
  title: string;
  highlight: string;
  description: string;
}

const AIToolsHome = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [featuredTools, setFeaturedTools] = useState<AITool[]>([]);
  const [loading, setLoading] = useState(true);
  const [toolCount, setToolCount] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);

  const heroSlides: HeroSlide[] = [
    {
      image: heroImage1,
      title: 'Supercharge Your',
      highlight: 'Productivity',
      description: 'Discover a curated collection of the most powerful AI tools. From content creation to data analysis, find the perfect tool for every task.'
    },
    {
      image: heroImage2,
      title: 'Transform Ideas Into',
      highlight: 'Reality',
      description: 'Leverage cutting-edge AI technology to bring your creative visions to life. Generate images, write content, and automate workflows effortlessly.'
    },
    {
      image: heroImage3,
      title: 'Code Smarter With',
      highlight: 'AI Assistance',
      description: 'Boost your development workflow with AI-powered coding tools. Get intelligent suggestions, debug faster, and ship quality code.'
    }
  ];

  useEffect(() => {
    fetchTools();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [heroSlides.length]);

  const sampleTools: AITool[] = [
    { id: '1', name: 'ChatGPT', description: 'Advanced AI chatbot for conversations, coding help, and content creation', category: 'text', color: 'from-green-500 to-emerald-600', features: ['Natural Language Processing', 'Code Generation', 'Content Writing'], pricing_type: 'free', url: 'https://chat.openai.com' },
    { id: '2', name: 'Midjourney', description: 'AI image generation tool that creates stunning artwork from text prompts', category: 'image', color: 'from-purple-500 to-pink-600', features: ['Text to Image', 'Style Variations', 'High Resolution'], pricing_type: 'paid', url: 'https://midjourney.com' },
    { id: '3', name: 'GitHub Copilot', description: 'AI-powered code completion tool that helps developers write code faster', category: 'code', color: 'from-gray-600 to-gray-800', features: ['Code Suggestions', 'Multi-language Support', 'IDE Integration'], pricing_type: 'paid', url: 'https://github.com/features/copilot' },
    { id: '4', name: 'ElevenLabs', description: 'AI voice synthesis and text-to-speech with natural sounding voices', category: 'audio', color: 'from-blue-500 to-indigo-600', features: ['Voice Cloning', 'Multiple Languages', 'Realistic Speech'], pricing_type: 'free', url: 'https://elevenlabs.io' },
    { id: '5', name: 'Runway ML', description: 'AI video generation and editing tool for creative professionals', category: 'video', color: 'from-cyan-500 to-blue-600', features: ['Video Generation', 'Background Removal', 'Motion Tracking'], pricing_type: 'paid', url: 'https://runwayml.com' },
    { id: '6', name: 'Tableau AI', description: 'AI-powered data analysis and visualization platform', category: 'analysis', color: 'from-orange-500 to-red-600', features: ['Auto Insights', 'Data Visualization', 'Predictive Analytics'], pricing_type: 'paid', url: 'https://tableau.com' }
  ];

  const fetchTools = async () => {
    try {
      const response = await aiToolsAPI.getAll({ active: 'true' });
      const tools = response.data.tools || [];
      if (tools.length > 0) {
        setToolCount(tools.length);
        setFeaturedTools(tools.slice(0, 6));
      } else {
        setToolCount(sampleTools.length);
        setFeaturedTools(sampleTools);
      }
    } catch (error) {
      console.error('Error fetching tools:', error);
      setToolCount(sampleTools.length);
      setFeaturedTools(sampleTools);
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    { icon: Brain, value: toolCount.toString() + '+', label: 'AI Tools Available' },
    { icon: Users, value: '50K+', label: 'Active Users' },
    { icon: TrendingUp, value: '99%', label: 'Satisfaction Rate' },
    { icon: Clock, value: '24/7', label: 'Availability' }
  ];

  const features = [
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Access powerful AI tools instantly with our optimized platform'
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Your data is protected with enterprise-grade security'
    },
    {
      icon: Target,
      title: 'Purpose Built',
      description: 'Tools designed for specific tasks to maximize productivity'
    },
    {
      icon: Rocket,
      title: 'Always Updated',
      description: 'New AI tools added regularly to keep you ahead'
    }
  ];

  const categories = [
    { id: 'text', label: 'Text & Writing', icon: FileText, count: 8 },
    { id: 'image', label: 'Image Generation', icon: Image, count: 6 },
    { id: 'code', label: 'Code Assistant', icon: Code, count: 5 },
    { id: 'audio', label: 'Audio & Voice', icon: Mic, count: 4 },
    { id: 'video', label: 'Video Creation', icon: Video, count: 3 },
    { id: 'analysis', label: 'Data Analysis', icon: BarChart3, count: 4 }
  ];

  return (
    <div className={`min-h-screen w-full max-w-full overflow-x-hidden ${
      theme === 'dark' ? 'bg-dark-bg' : 'bg-gray-50'
    }`}>
      <AIToolsNav />

      <section className="relative min-h-[600px] overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7 }}
            className="absolute inset-0"
          >
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${heroSlides[currentSlide]?.image || heroImage1})` }}
            />
            <div className={`absolute inset-0 ${
              theme === 'dark' 
                ? 'bg-gradient-to-r from-dark-bg/95 via-dark-bg/80 to-transparent' 
                : 'bg-gradient-to-r from-white/95 via-white/80 to-transparent'
            }`} />
          </motion.div>
        </AnimatePresence>

        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className={`absolute -top-40 -right-40 w-80 h-80 rounded-full blur-3xl ${
            theme === 'dark' ? 'bg-electric-blue/20' : 'bg-accent-blue/20'
          }`} />
          <div className={`absolute -bottom-40 -left-40 w-80 h-80 rounded-full blur-3xl ${
            theme === 'dark' ? 'bg-electric-green/20' : 'bg-accent-red/20'
          }`} />
        </div>

        <div className="container mx-auto px-4 lg:px-6 relative z-10 pt-28 pb-20">
          <div className="max-w-2xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <div className="mb-6">
                  <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${
                    theme === 'dark'
                      ? 'bg-electric-green/10 text-electric-green border border-electric-green/30'
                      : 'bg-accent-red/10 text-accent-red border border-accent-red/30'
                  }`}>
                    <Sparkles className="w-4 h-4" />
                    AI-Powered Tools Platform
                  </span>
                </div>

                <h1 className={`text-4xl md:text-5xl lg:text-6xl font-bold mb-6 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  {heroSlides[currentSlide].title}{' '}
                  <span className={`${
                    theme === 'dark' 
                      ? 'text-electric-green' 
                      : 'bg-gradient-to-r from-accent-red to-accent-blue bg-clip-text text-transparent'
                  }`}>
                    {heroSlides[currentSlide].highlight}
                  </span>
                </h1>

                <p className={`text-lg md:text-xl mb-8 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  {heroSlides[currentSlide].description}
                </p>

                <div className="flex flex-col sm:flex-row items-start gap-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate('/ai-tools/explore')}
                    className={`inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-lg transition-all ${
                      theme === 'dark'
                        ? 'bg-gradient-to-r from-electric-blue to-electric-green text-slate-900 hover:shadow-lg hover:shadow-electric-blue/25'
                        : 'bg-gradient-to-r from-accent-red to-accent-blue text-white hover:shadow-lg hover:shadow-accent-red/25'
                    }`}
                  >
                    <Zap className="w-5 h-5" />
                    Explore All Tools
                    <ArrowRight className="w-5 h-5" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate('/ai-tools/about')}
                    className={`inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-lg transition-all border ${
                      theme === 'dark'
                        ? 'border-slate-600 text-gray-300 hover:bg-slate-800'
                        : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Play className="w-5 h-5" />
                    Learn More
                  </motion.button>
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="flex items-center gap-3 mt-10">
              {heroSlides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    currentSlide === idx
                      ? theme === 'dark'
                        ? 'w-8 bg-electric-green'
                        : 'w-8 bg-accent-red'
                      : theme === 'dark'
                        ? 'w-2 bg-white/30 hover:bg-white/50'
                        : 'w-2 bg-gray-900/30 hover:bg-gray-900/50'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className={`py-12 ${
        theme === 'dark' ? 'bg-dark-card' : 'bg-white'
      }`}>
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
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
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl mb-3 ${
                    theme === 'dark'
                      ? 'bg-electric-blue/20 text-electric-blue'
                      : 'bg-accent-red/10 text-accent-red'
                  }`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <p className={`text-3xl font-bold mb-1 ${
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

      <section className={`py-20 ${
        theme === 'dark' ? 'bg-dark-bg' : 'bg-gray-50'
      }`}>
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
              Browse by Category
            </h2>
            <p className={`text-lg max-w-2xl mx-auto ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Find the perfect AI tool for your needs across various categories
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category, index) => {
              const Icon = category.icon;
              return (
                <motion.button
                  key={category.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  onClick={() => navigate(`/ai-tools/explore?category=${category.id}`)}
                  className={`p-6 rounded-2xl text-center transition-all ${
                    theme === 'dark'
                      ? 'bg-dark-card border border-gray-800 hover:border-electric-blue hover:shadow-[0_0_30px_rgba(0,240,255,0.2)]'
                      : 'bg-white border border-gray-200 hover:border-accent-red hover:shadow-xl'
                  }`}
                >
                  <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl mb-4 ${
                    theme === 'dark'
                      ? 'bg-gradient-to-br from-electric-blue/20 to-electric-green/20'
                      : 'bg-gradient-to-br from-accent-red/10 to-accent-blue/10'
                  }`}>
                    <Icon className={`w-7 h-7 ${
                      theme === 'dark' ? 'text-electric-blue' : 'text-accent-red'
                    }`} />
                  </div>
                  <h3 className={`font-semibold mb-1 ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>{category.label}</h3>
                  <p className={`text-sm ${
                    theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                  }`}>{category.count} tools</p>
                </motion.button>
              );
            })}
          </div>
        </div>
      </section>

      <section className={`py-20 ${
        theme === 'dark' ? 'bg-dark-card' : 'bg-white'
      }`}>
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between mb-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className={`text-3xl md:text-4xl font-bold mb-2 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`} style={{ fontFamily: 'Orbitron, sans-serif' }}>
                Featured AI Tools
              </h2>
              <p className={`text-lg ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Most popular tools loved by our users
              </p>
            </motion.div>
            <Link
              to="/ai-tools/explore"
              className={`mt-4 md:mt-0 flex items-center gap-2 font-semibold transition-all ${
                theme === 'dark'
                  ? 'text-electric-blue hover:text-electric-green'
                  : 'text-accent-red hover:text-accent-blue'
              }`}
            >
              View All Tools
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className={`p-6 rounded-2xl animate-pulse ${
                    theme === 'dark' ? 'bg-dark-lighter' : 'bg-gray-100'
                  }`}
                >
                  <div className={`w-14 h-14 rounded-xl mb-4 ${
                    theme === 'dark' ? 'bg-dark-bg' : 'bg-gray-200'
                  }`} />
                  <div className={`h-6 rounded mb-3 ${
                    theme === 'dark' ? 'bg-dark-bg' : 'bg-gray-200'
                  }`} />
                  <div className={`h-16 rounded ${
                    theme === 'dark' ? 'bg-dark-bg' : 'bg-gray-200'
                  }`} />
                </div>
              ))}
            </div>
          ) : featuredTools.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredTools.map((tool, index) => {
                const Icon = getCategoryIcon(tool.category);
                return (
                  <motion.div
                    key={tool.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -8 }}
                    onClick={() => navigate(`/ai-tools/tool/${tool.id}`)}
                    className={`group p-6 rounded-2xl cursor-pointer transition-all ${
                      theme === 'dark'
                        ? 'bg-dark-lighter border border-gray-800 hover:border-electric-blue hover:shadow-[0_0_30px_rgba(0,240,255,0.2)]'
                        : 'bg-gray-50 border border-gray-200 hover:border-accent-red hover:shadow-xl'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className={`p-3 rounded-xl bg-gradient-to-br ${tool.color}`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                        tool.pricing_type === 'free'
                          ? theme === 'dark'
                            ? 'bg-electric-green/20 text-electric-green'
                            : 'bg-green-100 text-green-600'
                          : theme === 'dark'
                            ? 'bg-yellow-500/20 text-yellow-400'
                            : 'bg-yellow-100 text-yellow-600'
                      }`}>
                        {tool.pricing_type === 'free' ? 'Free' : 'Paid'}
                      </span>
                    </div>

                    <h3 className={`text-xl font-bold mb-2 ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>{tool.name}</h3>

                    <p className={`text-sm mb-4 line-clamp-2 ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>{tool.description}</p>

                    <div className="space-y-2 mb-4">
                      {tool.features.slice(0, 3).map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <div className={`w-1.5 h-1.5 rounded-full ${
                            theme === 'dark' ? 'bg-electric-blue' : 'bg-accent-blue'
                          }`} />
                          <span className={`text-xs ${
                            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                          }`}>{feature}</span>
                        </div>
                      ))}
                    </div>

                    <div className={`flex items-center gap-2 text-sm font-semibold ${
                      theme === 'dark' ? 'text-electric-blue' : 'text-accent-red'
                    } group-hover:gap-3 transition-all`}>
                      View Details
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className={`text-center py-16 rounded-2xl ${
              theme === 'dark' ? 'bg-dark-lighter' : 'bg-gray-100'
            }`}>
              <Brain className={`w-16 h-16 mx-auto mb-4 ${
                theme === 'dark' ? 'text-gray-600' : 'text-gray-400'
              }`} />
              <h3 className={`text-xl font-bold mb-2 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>No tools available yet</h3>
              <p className={`text-sm ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>Check back soon for exciting AI tools!</p>
            </div>
          )}
        </div>
      </section>

      <section className={`py-20 ${
        theme === 'dark' ? 'bg-dark-bg' : 'bg-gray-50'
      }`}>
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <img
                src={featureImage}
                alt="AI Technology"
                className="rounded-3xl shadow-2xl w-full object-cover aspect-[4/3]"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className={`text-3xl md:text-4xl font-bold mb-6 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`} style={{ fontFamily: 'Orbitron, sans-serif' }}>
                Why Choose Our AI Tools Platform?
              </h2>

              <div className="space-y-6">
                {features.map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className="flex gap-4"
                    >
                      <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center ${
                        theme === 'dark'
                          ? 'bg-electric-blue/20 text-electric-blue'
                          : 'bg-accent-red/10 text-accent-red'
                      }`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className={`text-lg font-bold mb-1 ${
                          theme === 'dark' ? 'text-white' : 'text-gray-900'
                        }`}>{feature.title}</h3>
                        <p className={`text-sm ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                        }`}>{feature.description}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className={`py-20 ${
        theme === 'dark' ? 'bg-dark-card' : 'bg-white'
      }`}>
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
                Ready to Transform Your Workflow?
              </h2>
              <p className={`text-lg mb-8 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Join thousands of users who are already leveraging AI to work smarter, 
                create faster, and achieve more. Start exploring our tools today!
              </p>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/ai-tools/explore')}
                className={`px-10 py-4 rounded-xl font-bold flex items-center gap-2 mx-auto ${
                  theme === 'dark'
                    ? 'bg-gradient-to-r from-electric-blue to-electric-green text-black'
                    : 'bg-gradient-to-r from-accent-red to-accent-blue text-white'
                } shadow-lg`}
              >
                <Rocket className="w-5 h-5" />
                Get Started Now
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer variant="ai-tools" />
    </div>
  );
};

export default AIToolsHome;
