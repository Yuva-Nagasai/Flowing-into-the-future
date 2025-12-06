import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { useAIToolsAuth } from '../../contexts/AIToolsAuthContext';
import { aiToolsAPI } from '../../utils/api';
import AIToolsNav from '../../components/aitools/AIToolsNav';
import Footer from '../../components/Footer';
import SEO from '../../components/SEO';
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
  Play,
  Quote,
  CheckCircle2,
  Lock,
  X,
  Check
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
  const { user } = useAIToolsAuth();
  const navigate = useNavigate();
  const [featuredTools, setFeaturedTools] = useState<AITool[]>([]);
  const [loading, setLoading] = useState(true);
  const [toolCount, setToolCount] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [pendingToolId, setPendingToolId] = useState<string | null>(null);

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

  const handleProtectedNavigate = (toolId: string) => {
    if (!user) {
      setPendingToolId(toolId);
      setShowLoginModal(true);
      return;
    }
    navigate(`/ai-tools/tool/${toolId}`);
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
      description: 'Access powerful AI tools instantly with our optimized platform',
      color: 'bg-gradient-to-br from-blue-500 to-cyan-500'
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Your data is protected with enterprise-grade security',
      color: 'bg-gradient-to-br from-purple-500 to-indigo-500'
    },
    {
      icon: Target,
      title: 'Purpose Built',
      description: 'Tools designed for specific tasks to maximize productivity',
      color: 'bg-gradient-to-br from-amber-500 to-orange-500'
    },
    {
      icon: Rocket,
      title: 'Always Updated',
      description: 'New AI tools added regularly to keep you ahead',
      color: 'bg-gradient-to-br from-emerald-500 to-green-500'
    }
  ];

  const categories = [
    { id: 'text', label: 'Text & Writing', icon: FileText, count: 8, color: 'from-blue-500 to-cyan-500' },
    { id: 'image', label: 'Image Generation', icon: Image, count: 6, color: 'from-pink-500 to-purple-500' },
    { id: 'code', label: 'Code Assistant', icon: Code, count: 5, color: 'from-amber-500 to-orange-500' },
    { id: 'audio', label: 'Audio & Voice', icon: Mic, count: 4, color: 'from-emerald-500 to-green-500' },
    { id: 'video', label: 'Video Creation', icon: Video, count: 3, color: 'from-indigo-500 to-blue-600' },
    { id: 'analysis', label: 'Data Analysis', icon: BarChart3, count: 4, color: 'from-fuchsia-500 to-rose-500' }
  ];
  const loopingCategories = [...categories, ...categories, ...categories];

  return (
    <>
      <SEO
        title="AI Tools Platform | NanoFlows"
        description="Discover and use powerful AI tools for text generation, image creation, code assistance, and more. Boost your productivity with curated AI solutions."
        keywords="AI tools, artificial intelligence, text generation, image creation, code assistance, productivity tools, AI platform"
      />
      <div className={`min-h-screen w-full max-w-full overflow-x-hidden flex flex-col ${
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
                    className={`relative group overflow-hidden inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 ${
                      theme === 'dark'
                        ? 'bg-gradient-to-r from-electric-blue to-electric-green text-slate-900 hover:shadow-lg hover:shadow-electric-blue/25'
                        : 'bg-gradient-to-r from-accent-red to-accent-blue text-white hover:shadow-lg hover:shadow-accent-red/25'
                    }`}
                  >
                    <span className="relative z-10 flex items-center gap-2">
                    <Zap className="w-5 h-5" />
                    Explore All Tools
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
              Browse by{' '}
              <span className={`bg-gradient-to-r ${
                theme === 'dark'
                  ? 'from-electric-green to-electric-blue'
                  : 'from-accent-red to-accent-blue'
              } bg-clip-text text-transparent`}>
                Category
              </span>
            </h2>
            <p className={`text-lg max-w-2xl mx-auto ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Find the perfect AI tool for your needs across various categories
            </p>
          </motion.div>

          <div className="relative overflow-hidden pb-4">
            <div
              className="flex gap-4 w-max animate-categories-marquee hover:[animation-play-state:paused]"
              style={{ willChange: 'transform', backfaceVisibility: 'hidden', transform: 'translateZ(0)' }}
            >
              {loopingCategories.map((category, index) => {
                const Icon = category.icon;
                return (
                  <motion.button
                    key={`${category.id}-${index}`}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: (index % categories.length) * 0.05 }}
                    onClick={() => navigate(`/ai-tools/explore?category=${category.id}`)}
                  className={`min-w-[220px] snap-center p-6 rounded-2xl text-center transition-all border ${
                    theme === 'dark'
                      ? 'bg-slate-900/80 border-slate-700/70 backdrop-blur-sm'
                      : 'bg-gradient-to-br from-accent-red/10 to-accent-blue/10 border-accent-red/30 backdrop-blur-sm shadow-lg'
                  }`}
                  >
                    <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl mb-4 bg-gradient-to-br ${category.color}`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <h3
                      className={`font-semibold mb-1 ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}
                    >
                      {category.label}
                    </h3>
                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                      {category.count} tools
                    </p>
                  </motion.button>
                );
              })}
            </div>
            <div
              className="pointer-events-none absolute inset-y-0 left-0 w-24"
              style={{
                background:
                  theme === 'dark'
                    ? 'linear-gradient(to right, rgba(2,6,23,1), rgba(2,6,23,0))'
                    : 'linear-gradient(to right, rgba(249,250,251,1), rgba(249,250,251,0))'
              }}
            />
            <div
              className="pointer-events-none absolute inset-y-0 right-0 w-24"
              style={{
                background:
                  theme === 'dark'
                    ? 'linear-gradient(to left, rgba(2,6,23,1), rgba(2,6,23,0))'
                    : 'linear-gradient(to left, rgba(249,250,251,1), rgba(249,250,251,0))'
              }}
            />
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
                Featured{' '}
                <span className={`bg-gradient-to-r ${
                  theme === 'dark'
                    ? 'from-electric-green to-electric-blue'
                    : 'from-accent-red to-accent-blue'
                } bg-clip-text text-transparent`}>
                  AI Tools
                </span>
              </h2>
              <p className={`text-lg ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Most popular tools loved by our users
              </p>
            </motion.div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/ai-tools/explore')}
              className={`relative group overflow-hidden mt-4 md:mt-0 px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all duration-300 ${
                theme === 'dark'
                  ? 'bg-gradient-to-r from-electric-green to-electric-blue text-dark-bg'
                  : 'bg-gradient-to-r from-accent-red to-accent-blue text-white'
              }`}
            >
              <span className="relative z-10 flex items-center gap-2">
                View All Tools
                <ArrowRight className="w-5 h-5" />
              </span>
              <div
                className={`absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 ${
                  theme === 'dark'
                    ? 'bg-gradient-to-r from-electric-blue to-electric-green'
                    : 'bg-gradient-to-r from-accent-blue to-accent-red'
                }`}
              />
            </motion.button>
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
                    onClick={() => handleProtectedNavigate(tool.id)}
                    className={`group p-6 rounded-2xl cursor-pointer transition-all border flex flex-col h-full ${
                      theme === 'dark'
                        ? 'bg-slate-900/80 border-slate-700/70 backdrop-blur-sm hover:border-electric-blue hover:shadow-[0_0_30px_rgba(0,240,255,0.2)]'
                        : 'bg-gradient-to-br from-accent-red/10 to-accent-blue/10 border-accent-red/30 backdrop-blur-sm hover:border-accent-blue/60 shadow-lg'
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

                    <h3 className={`text-xl font-bold mb-2 min-h-[3rem] line-clamp-2 ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>{tool.name}</h3>

                    <p className={`text-sm mb-4 line-clamp-2 min-h-[2.5rem] flex-shrink-0 ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>{tool.description}</p>

                    <div className="space-y-2 mb-4 flex-shrink-0">
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

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleProtectedNavigate(tool.id);
                      }}
                      className={`relative group overflow-hidden w-full mt-auto py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all duration-300 ${
                        theme === 'dark'
                          ? 'bg-gradient-to-r from-electric-green to-electric-blue text-dark-bg'
                          : 'bg-gradient-to-r from-accent-red to-accent-blue text-white'
                      }`}
                    >
                      <span className="relative z-10 flex items-center gap-2">
                        View Details
                        <ArrowRight className="w-4 h-4" />
                      </span>
                      <div
                        className={`absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 ${
                          theme === 'dark'
                            ? 'bg-gradient-to-r from-electric-blue to-electric-green'
                            : 'bg-gradient-to-r from-accent-blue to-accent-red'
                        }`}
                      />
                    </motion.button>
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
                Why Choose Our{' '}
                <span className={`bg-gradient-to-r ${
                  theme === 'dark'
                    ? 'from-electric-green to-electric-blue'
                    : 'from-accent-red to-accent-blue'
                } bg-clip-text text-transparent`}>
                  AI Tools Platform?
                </span>
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
                      <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center ${feature.color}`}>
                        <Icon className="w-6 h-6 text-white" />
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

      {/* Reviews Section */}
      <section className={`py-20 ${
        theme === 'dark' ? 'bg-dark-bg' : 'bg-gray-50'
      }`}>
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className={`text-4xl md:text-5xl font-bold mb-4 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`} style={{ fontFamily: 'Orbitron, sans-serif' }}>
                What Our{' '}
                <span className={`bg-gradient-to-r ${
                  theme === 'dark'
                    ? 'from-electric-green to-electric-blue'
                    : 'from-accent-red to-accent-blue'
                } bg-clip-text text-transparent`}>
                  Users Say
                </span>
              </h2>
              <p className={`text-lg ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Join thousands of professionals who are transforming their work with AI tools
              </p>
            </motion.div>
          </div>

          <div className="relative overflow-hidden pb-4">
            <div
              className="flex gap-6 w-max animate-reviews-marquee hover:[animation-play-state:paused]"
              style={{ willChange: 'transform', backfaceVisibility: 'hidden', transform: 'translateZ(0)' }}
            >
              {[
                {
                  name: 'Sarah Chen',
                  role: 'Content Creator',
                  company: 'Digital Media Co',
                  image: 'https://i.pravatar.cc/150?img=5',
                  rating: 5,
                  text: 'The AI writing tools have revolutionized my content creation process. I can now produce high-quality articles in half the time. Game changer!',
                  tool: 'AI Writing Assistant'
                },
                {
                  name: 'Michael Rodriguez',
                  role: 'Marketing Director',
                  company: 'Tech Solutions Inc',
                  image: 'https://i.pravatar.cc/150?img=12',
                  rating: 5,
                  text: 'The image generation tools are incredible. We\'ve cut our design costs by 60% and our creative output has never been better. Highly recommended!',
                  tool: 'AI Image Generator'
                },
                {
                  name: 'Priya Sharma',
                  role: 'Software Developer',
                  company: 'Innovation Labs',
                  image: 'https://i.pravatar.cc/150?img=1',
                  rating: 5,
                  text: 'The code generation tools have accelerated our development workflow significantly. It\'s like having a senior developer pair programming with you.',
                  tool: 'AI Code Assistant'
                },
                {
                  name: 'David Kim',
                  role: 'Data Analyst',
                  company: 'Analytics Pro',
                  image: 'https://i.pravatar.cc/150?img=13',
                  rating: 5,
                  text: 'The data analysis tools have made complex insights accessible. I can now generate comprehensive reports in minutes instead of hours.',
                  tool: 'AI Analytics Tool'
                },
                {
                  name: 'Emily Johnson',
                  role: 'Product Manager',
                  company: 'Startup Hub',
                  image: 'https://i.pravatar.cc/150?img=9',
                  rating: 5,
                  text: 'These AI tools have transformed how we work. From brainstorming to execution, everything is faster and more efficient. Best investment we\'ve made!',
                  tool: 'AI Productivity Suite'
                },
                {
                  name: 'James Wilson',
                  role: 'Video Producer',
                  company: 'Creative Studios',
                  image: 'https://i.pravatar.cc/150?img=11',
                  rating: 5,
                  text: 'The video editing AI tools are mind-blowing. What used to take days now takes hours. The quality is outstanding and the workflow is seamless.',
                  tool: 'AI Video Editor'
                },
                {
                  name: 'Lisa Anderson',
                  role: 'Social Media Manager',
                  company: 'Brand Agency',
                  image: 'https://i.pravatar.cc/150?img=47',
                  rating: 5,
                  text: 'The AI content tools have transformed our social media strategy. We can create engaging posts faster and maintain consistent quality across all platforms.',
                  tool: 'AI Social Media Tool'
                },
                {
                  name: 'Robert Taylor',
                  role: 'Business Analyst',
                  company: 'Enterprise Corp',
                  image: 'https://i.pravatar.cc/150?img=33',
                  rating: 5,
                  text: 'These tools have streamlined our entire workflow. The automation capabilities are impressive and the ROI has been exceptional.',
                  tool: 'AI Automation Suite'
                }
              ].concat([
                {
                  name: 'Sarah Chen',
                  role: 'Content Creator',
                  company: 'Digital Media Co',
                  image: 'https://i.pravatar.cc/150?img=5',
                  rating: 5,
                  text: 'The AI writing tools have revolutionized my content creation process. I can now produce high-quality articles in half the time. Game changer!',
                  tool: 'AI Writing Assistant'
                },
                {
                  name: 'Michael Rodriguez',
                  role: 'Marketing Director',
                  company: 'Tech Solutions Inc',
                  image: 'https://i.pravatar.cc/150?img=12',
                  rating: 5,
                  text: 'The image generation tools are incredible. We\'ve cut our design costs by 60% and our creative output has never been better. Highly recommended!',
                  tool: 'AI Image Generator'
                },
                {
                  name: 'Priya Sharma',
                  role: 'Software Developer',
                  company: 'Innovation Labs',
                  image: 'https://i.pravatar.cc/150?img=1',
                  rating: 5,
                  text: 'The code generation tools have accelerated our development workflow significantly. It\'s like having a senior developer pair programming with you.',
                  tool: 'AI Code Assistant'
                },
                {
                  name: 'David Kim',
                  role: 'Data Analyst',
                  company: 'Analytics Pro',
                  image: 'https://i.pravatar.cc/150?img=13',
                  rating: 5,
                  text: 'The data analysis tools have made complex insights accessible. I can now generate comprehensive reports in minutes instead of hours.',
                  tool: 'AI Analytics Tool'
                },
                {
                  name: 'Emily Johnson',
                  role: 'Product Manager',
                  company: 'Startup Hub',
                  image: 'https://i.pravatar.cc/150?img=9',
                  rating: 5,
                  text: 'These AI tools have transformed how we work. From brainstorming to execution, everything is faster and more efficient. Best investment we\'ve made!',
                  tool: 'AI Productivity Suite'
                },
                {
                  name: 'James Wilson',
                  role: 'Video Producer',
                  company: 'Creative Studios',
                  image: 'https://i.pravatar.cc/150?img=11',
                  rating: 5,
                  text: 'The video editing AI tools are mind-blowing. What used to take days now takes hours. The quality is outstanding and the workflow is seamless.',
                  tool: 'AI Video Editor'
                },
                {
                  name: 'Lisa Anderson',
                  role: 'Social Media Manager',
                  company: 'Brand Agency',
                  image: 'https://i.pravatar.cc/150?img=47',
                  rating: 5,
                  text: 'The AI content tools have transformed our social media strategy. We can create engaging posts faster and maintain consistent quality across all platforms.',
                  tool: 'AI Social Media Tool'
                },
                {
                  name: 'Robert Taylor',
                  role: 'Business Analyst',
                  company: 'Enterprise Corp',
                  image: 'https://i.pravatar.cc/150?img=33',
                  rating: 5,
                  text: 'These tools have streamlined our entire workflow. The automation capabilities are impressive and the ROI has been exceptional.',
                  tool: 'AI Automation Suite'
                }
              ]).map((review, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className={`flex-shrink-0 flex flex-col p-7 rounded-3xl border ${
                      theme === 'dark'
                        ? 'bg-dark-card border-gray-700/50 backdrop-blur-sm'
                        : 'bg-gradient-to-br from-accent-red/10 to-accent-blue/10 border-accent-red/30 backdrop-blur-sm'
                    } shadow-xl hover:shadow-2xl transition-all duration-300`}
                    style={{ width: '380px', minWidth: '380px', flexShrink: 0 }}
                  >
                    {/* Quote Icon */}
                    <div className={`mb-4 inline-flex items-center justify-center w-10 h-10 rounded-xl ${
                      theme === 'dark'
                        ? 'bg-electric-green/10'
                        : 'bg-accent-red/10'
                    }`}>
                      <Quote className={`w-5 h-5 ${
                        theme === 'dark' ? 'text-electric-green' : 'text-accent-red'
                      }`} />
                    </div>

                    {/* Rating */}
                    <div className="flex items-center gap-1 mb-5">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            theme === 'dark'
                              ? 'fill-electric-green text-electric-green'
                              : 'fill-accent-red text-accent-red'
                          }`}
                        />
                      ))}
                      <span className={`ml-2 text-xs font-medium ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        Verified
                      </span>
                    </div>

                    {/* Review Text */}
                    <p className={`text-base mb-6 leading-relaxed flex-grow ${
                      theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
                    }`}>
                      {review.text}
                    </p>

                    {/* Tool Badge */}
                    <div className={`mb-5 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold w-fit ${
                      theme === 'dark'
                        ? 'bg-electric-blue/10 text-electric-blue border border-electric-blue/20'
                        : 'bg-accent-blue/10 text-accent-blue border border-accent-blue/20'
                    }`}>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {review.tool}
                    </div>

                    {/* User Info */}
                    <div className={`flex items-center gap-4 pt-5 border-t ${
                      theme === 'dark' ? 'border-gray-700/50' : 'border-gray-200/50'
                    }`}>
                      <div className="relative">
                        <img
                          src={review.image}
                          alt={review.name}
                          className={`w-12 h-12 rounded-full object-cover ring-2 ${
                            theme === 'dark' ? 'ring-electric-green/20' : 'ring-accent-red/20'
                          }`}
                        />
                        <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 ${
                          theme === 'dark'
                            ? 'bg-electric-green border-dark-card'
                            : 'bg-accent-red border-white'
                        }`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className={`text-sm font-bold mb-0.5 truncate ${
                          theme === 'dark' ? 'text-white' : 'text-gray-900'
                        }`}>
                          {review.name}
                        </h4>
                        <p className={`text-xs font-medium mb-0.5 ${
                          theme === 'dark' ? 'text-electric-blue' : 'text-accent-blue'
                        }`}>
                          {review.role}
                        </p>
                        <p className={`text-xs truncate ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                          {review.company}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
            </div>

            <div
              className="pointer-events-none absolute inset-y-0 left-0 w-24"
              style={{
                background:
                  theme === 'dark'
                    ? 'linear-gradient(to right, rgba(15,23,42,1), rgba(15,23,42,0))'
                    : 'linear-gradient(to right, rgba(248,250,252,1), rgba(248,250,252,0))'
              }}
            />
            <div
              className="pointer-events-none absolute inset-y-0 right-0 w-24"
              style={{
                background:
                  theme === 'dark'
                    ? 'linear-gradient(to left, rgba(15,23,42,1), rgba(15,23,42,0))'
                    : 'linear-gradient(to left, rgba(249,250,251,1), rgba(249,250,251,0))'
              }}
            />
          </div>
        </div>
      </section>

      <style>{`
        @keyframes categoriesMarquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.333333%); }
        }
        .animate-categories-marquee {
          animation: categoriesMarquee 25s linear infinite;
          will-change: transform;
          backface-visibility: hidden;
          -webkit-font-smoothing: antialiased;
        }
        @keyframes reviewsMarquee {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-50%, 0, 0); }
        }
        .animate-reviews-marquee {
          animation: reviewsMarquee 40s linear infinite;
          will-change: transform;
          backface-visibility: hidden;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          scroll-behavior: smooth;
        }
      `}</style>

      <Footer variant="ai-tools" />

      {/* Login Required Modal */}
      <AnimatePresence>
        {showLoginModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowLoginModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className={`relative w-full max-w-md rounded-2xl shadow-2xl ${
                theme === 'dark'
                  ? 'bg-dark-card border border-gray-700'
                  : 'bg-white border border-gray-200'
              }`}
            >
              {/* Close Button */}
              <button
                onClick={() => setShowLoginModal(false)}
                className={`absolute right-4 top-4 p-2 rounded-lg transition-all ${
                  theme === 'dark'
                    ? 'text-gray-400 hover:text-white hover:bg-gray-700'
                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <X className="w-5 h-5" />
              </button>

              <div className="p-8">
                <div
                  className={`mx-auto mb-6 w-16 h-16 rounded-2xl flex items-center justify-center ${
                    theme === 'dark' ? 'bg-electric-green/20' : 'bg-accent-red/20'
                  }`}
                >
                  <Lock
                    className={`w-8 h-8 ${
                      theme === 'dark' ? 'text-electric-green' : 'text-accent-red'
                    }`}
                  />
                </div>

                <h2
                  className={`text-2xl font-bold text-center mb-3 ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}
                  style={{ fontFamily: 'Orbitron, sans-serif' }}
                >
                  Login Required
                </h2>

                <p
                  className={`text-center mb-6 ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}
                >
                  Please sign in to access AI Tools and continue exploring.
                </p>

                <div
                  className={`mb-6 p-4 rounded-xl ${
                    theme === 'dark' ? 'bg-dark-lighter' : 'bg-gray-50'
                  }`}
                >
                  <p
                    className={`text-sm font-semibold mb-3 ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}
                  >
                    By logging in, you'll get:
                  </p>
                  <ul className="space-y-2">
                    {[
                      'Access to all AI Tools',
                      'Track your favorite tools',
                      'Save your preferences',
                      'Get personalized recommendations'
                    ].map((benefit, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <Check
                          className={`w-4 h-4 flex-shrink-0 ${
                            theme === 'dark' ? 'text-electric-green' : 'text-green-600'
                          }`}
                        />
                        <span
                          className={`text-sm ${
                            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                          }`}
                        >
                          {benefit}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setShowLoginModal(false);
                      navigate('/ai-tools/login', {
                        state: { from: { pathname: pendingToolId ? `/ai-tools/tool/${pendingToolId}` : '/ai-tools' } }
                      });
                    }}
                    className={`relative group overflow-hidden flex-1 py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg transition-all duration-300 ${
                      theme === 'dark'
                        ? 'bg-gradient-to-r from-electric-blue to-electric-green text-black'
                        : 'bg-gradient-to-r from-accent-red to-accent-blue text-white'
                    }`}
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      <Brain className="w-5 h-5" />
                      Sign In
                    </span>
                    <div
                      className={`absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 ${
                        theme === 'dark'
                          ? 'bg-gradient-to-r from-electric-green to-electric-blue'
                          : 'bg-gradient-to-r from-accent-blue to-accent-red'
                      }`}
                    />
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setShowLoginModal(false);
                      navigate('/ai-tools/signup', {
                        state: { from: { pathname: pendingToolId ? `/ai-tools/tool/${pendingToolId}` : '/ai-tools' } }
                      });
                    }}
                    className={`px-6 py-3 rounded-xl font-semibold border-2 transition-all ${
                      theme === 'dark'
                        ? 'border-gray-700 text-gray-300 hover:border-electric-blue hover:text-electric-blue'
                        : 'border-gray-300 text-gray-700 hover:border-accent-red hover:text-accent-red'
                    }`}
                  >
                    Create Account
                  </motion.button>
                </div>

                <p
                  className={`text-xs text-center mt-4 ${
                    theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                  }`}
                >
                  Don't have an account? Sign up is free and takes less than a minute.
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      </div>
    </>
  );
};

export default AIToolsHome;
