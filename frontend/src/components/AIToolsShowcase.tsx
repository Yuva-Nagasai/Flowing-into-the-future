import { useState, useMemo, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { getTheme } from '../themes/theme';
import { aiToolsAPI } from '../utils/api';
import {
  ArrowLeft,
  Search,
  Brain,
  Image,
  FileText,
  Code,
  Video,
  Sparkles,
  Zap,
  Mic,
  Languages,
  BarChart3,
  Moon,
  Sun,
  LogOut
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import RoleBadge from './academy/RoleBadge';

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

const AIToolsShowcase = () => {
  const { theme, toggleTheme } = useTheme();
  const authContext = useAuth() as any;
  const { user, logout, loading: authLoading } = authContext || { user: null, logout: () => {}, loading: false };
  const navigate = useNavigate();
  const currentTheme = getTheme(theme);
  const [tools, setTools] = useState<AITool[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = () => {
    if (logout && typeof logout === 'function') {
      logout();
    }
    navigate('/academy/dashboard');
  };

  useEffect(() => {
    fetchTools();
  }, []);

  const fetchTools = async () => {
    try {
      const response = await aiToolsAPI.getAll({ active: 'true' });
      setTools(response.data.tools || []);
    } catch (error) {
      console.error('Error fetching tools:', error);
      setTools([]);
    } finally {
      setLoading(false);
    }
  };

  // Use the icons you already imported. Fallback to Brain.
  const getCategoryIcon = (category: string) => {
    const iconMap: Record<string, any> = {
      all: Sparkles,
      text: FileText,
      image: Image,
      code: Code,
      audio: Mic,
      video: Video,
      analysis: BarChart3,
      translation: Languages
    };
    return iconMap[category] || Brain;
  };

  const categories = [
    { id: 'all', label: 'All Tools', icon: Sparkles },
    { id: 'text', label: 'Text & Writing', icon: FileText },
    { id: 'image', label: 'Image Generation', icon: Image },
    { id: 'code', label: 'Code Assistant', icon: Code },
    { id: 'audio', label: 'Audio & Voice', icon: Mic },
    { id: 'video', label: 'Video Creation', icon: Video },
    { id: 'analysis', label: 'Data Analysis', icon: BarChart3 },
    { id: 'translation', label: 'Translation', icon: Languages }
  ];

  const filteredTools = useMemo(() => {
    return tools.filter(tool => {
      const matchesCategory = selectedCategory === 'all' || tool.category === selectedCategory;
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        tool.name.toLowerCase().includes(q) ||
        tool.description.toLowerCase().includes(q) ||
        tool.features.some(f => f.toLowerCase().includes(q));
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery, tools]);

  const handleToolClick = (tool: AITool) => {
    if (tool.url) {
      window.open(tool.url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className={`relative min-h-screen overflow-hidden ${currentTheme.classes.containerBg}`}>
      {/* Background Gradient Mesh */}
      <div className={`absolute inset-0 ${currentTheme.classes.mesh}`} />

      {/* Gradient Blurs */}
      <div className={`absolute right-0 top-0 h-[600px] w-[600px] rounded-full blur-3xl ${currentTheme.classes.blurPrimary}`} />
      <div className={`absolute bottom-0 left-0 h-[500px] w-[500px] rounded-full blur-3xl ${currentTheme.classes.blurSecondary}`} />

      <div className={`relative z-10 border-b backdrop-blur-md ${
        theme === 'dark'
          ? 'border-gray-800/50 bg-dark-card/90 shadow-lg shadow-black/20'
          : 'border-gray-200/50 bg-white/90 shadow-md shadow-gray-200/20'
      }`}>
        <div className="mx-auto max-w-7xl px-3 sm:px-4 py-2.5 sm:py-3 lg:px-8">
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Back Button - Total Left */}
            <motion.button
              onClick={() => navigate('/academy/dashboard')}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              whileHover={{
                scale: 1.1,
                x: -8,
                transition: { duration: 0.2, ease: "easeOut" }
              }}
              whileTap={{
                scale: 0.95,
                x: -12,
                transition: { duration: 0.1 }
              }}
              className={`flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl transition-all relative overflow-hidden group ${
                theme === 'dark'
                  ? 'bg-dark-lighter hover:bg-gray-700 text-gray-400 hover:text-electric-green'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-800 hover:text-accent-red'
              }`}
              title="Back to Platform Selection"
              aria-label="Back to Platform Selection"
            >
              <motion.div
                animate={{
                  x: [0, -3, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="flex items-center justify-center"
              >
                <ArrowLeft className="h-5 w-5" />
              </motion.div>
              <motion.div
                className={`absolute inset-0 rounded-xl ${theme === 'dark' ? 'bg-electric-green/20' : 'bg-accent-red/20'}`}
                initial={{ scale: 0, opacity: 0 }}
                whileHover={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
            </motion.button>

            <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
              {/* Logo and Branding */}
              <Link to="/ai-tools" className="flex items-center gap-2 sm:gap-3 group flex-shrink-0">
                <motion.div
                  whileHover={{ scale: 1.05, rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex h-9 w-9 sm:h-11 sm:w-11 items-center justify-center rounded-lg bg-gradient-to-br shadow-md transition-all duration-300 ${
                    theme === 'dark'
                      ? 'from-electric-blue to-electric-green shadow-electric-blue/30 group-hover:shadow-electric-blue/50'
                      : 'from-accent-red to-accent-blue shadow-accent-red/30 group-hover:shadow-accent-red/50'
                  }`}
                >
                  <Brain className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                </motion.div>
                <div className="hidden sm:block min-w-0">
                  <p className={`text-[10px] font-bold uppercase tracking-wider ${
                    theme === 'dark' ? 'text-electric-green' : 'text-accent-red'
                  }`}>
                    NanoFlows
                  </p>
                  <h1 className={`text-sm sm:text-base font-bold leading-tight truncate ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`} style={{ fontFamily: 'Orbitron, sans-serif' }}>
                    AI Tools
                  </h1>
                </div>
              </Link>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
              {/* User Info */}
              <div className={`hidden xl:flex items-center gap-2 px-4 py-2 rounded-lg ${
                theme === 'dark' ? 'bg-dark-lighter/70 border border-electric-blue/30' : 'bg-gray-100/70 border border-accent-blue/30'
              }`}>
                <div className="text-right">
                  <p className={`text-xs font-semibold ${
                    theme === 'dark'
                      ? 'bg-gradient-to-r from-electric-blue to-electric-green bg-clip-text text-transparent'
                      : 'bg-gradient-to-r from-accent-red to-accent-blue bg-clip-text text-transparent'
                  }`}>
                    Welcome back
                  </p>
                  <p className={`text-sm font-bold ${
                    theme === 'dark'
                      ? 'bg-gradient-to-r from-electric-green to-electric-blue bg-clip-text text-transparent'
                      : 'bg-gradient-to-r from-accent-blue to-accent-red bg-clip-text text-transparent'
                  }`}>
                    {authLoading ? '...' : (user?.name?.split(' ')[0] || 'User')}
                  </p>
                </div>
                {user?.role && <RoleBadge role={user.role} size="sm" />}
              </div>

              {/* Theme Toggle */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleTheme}
                className={`flex h-9 w-9 items-center justify-center rounded-lg transition-all duration-200 ${
                  theme === 'dark'
                    ? 'bg-dark-lighter hover:bg-gray-700 text-electric-blue'
                    : 'bg-gray-100 hover:bg-gray-200 text-accent-blue'
                }`}
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
              </motion.button>

              {/* Logout Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  theme === 'dark'
                    ? 'bg-red-600/30 text-red-300 border border-red-500/50 hover:bg-red-600/40 hover:border-red-400 hover:text-red-200'
                    : 'bg-red-100 text-red-700 border border-red-300 hover:bg-red-200 hover:border-red-400 hover:text-red-800'
                }`}
                aria-label="Log out"
              >
                <LogOut size={16} />
                <span className="hidden sm:inline">Logout</span>
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10">
        <div className="container mx-auto px-6 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border mb-6"
              style={{
                borderColor: theme === 'dark' ? '#0ABAB5' : '#EB3232'
              }}
            >
              <Sparkles className={`w-5 h-5 ${theme === 'dark' ? 'text-electric-green' : 'text-accent-red'}`} />
              <span className={`font-semibold ${theme === 'dark' ? 'text-electric-blue' : 'text-accent-blue'}`}>
                Free AI Tools Platform
              </span>
            </motion.div>

            <h1 className={`text-4xl md:text-6xl font-bold font-orbitron mb-6 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Unleash the Power of{' '}
              <span className={theme === 'dark' ? 'text-electric-green text-glow-green' : 'text-accent-red'}>
                AI Tools
              </span>
            </h1>

            <p className={`text-xl md:text-2xl mb-8 max-w-3xl mx-auto ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-800'
            }`}>
              Explore our collection of cutting-edge AI tools designed to boost your productivity and creativity.
              All tools are free to use and powered by advanced AI technology.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <div className="relative w-full sm:w-96">
                <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-900'
                }`} />
                <input
                  type="text"
                  placeholder="Search AI tools..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowDropdown(e.target.value.length > 0);
                  }}
                  onFocus={() => searchQuery.length > 0 && setShowDropdown(true)}
                  onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                  className={`w-full pl-12 pr-4 py-3 rounded-lg border-2 focus:outline-none transition-all ${
                    theme === 'dark'
                      ? 'bg-dark-lighter border-gray-700 text-white focus:border-electric-blue'
                      : 'bg-white border-gray-300 text-gray-900 focus:border-accent-blue'
                  }`}
                />

                {showDropdown && searchQuery.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className={`absolute top-full mt-2 w-full rounded-lg border-2 max-h-96 overflow-y-auto z-50 shadow-2xl ${
                      theme === 'dark'
                        ? 'bg-dark-card border-gray-700'
                        : 'bg-white border-gray-300'
                    }`}
                  >
                    {filteredTools.length > 0 ? (
                      <div className="p-2">
                        {filteredTools.map((tool) => {
                          const Icon = getCategoryIcon(tool.category);
                          return (
                            <button
                              key={tool.id}
                              onClick={() => {
                                handleToolClick(tool);
                                setShowDropdown(false);
                              }}
                              className={`w-full p-3 rounded-lg flex items-center gap-3 transition-all mb-1 ${
                                theme === 'dark'
                                  ? 'hover:bg-dark-lighter text-white'
                                  : 'hover:bg-gray-100 text-gray-900'
                              }`}
                            >
                              <div className={`p-2 rounded-lg bg-gradient-to-br ${tool.color} flex-shrink-0`}>
                                <Icon className="w-4 h-4 text-white" />
                              </div>
                              <div className="flex-1 text-left">
                                <div className="font-semibold text-sm">{tool.name}</div>
                                <div className={`text-xs ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
                                  {tool.category}
                                </div>
                              </div>
                              <Sparkles className={`w-4 h-4 flex-shrink-0 ${
                                theme === 'dark' ? 'text-electric-green' : 'text-accent-red'
                              }`} />
                            </button>
                          );
                        })}
                      </div>
                    ) : (
                      <div className={`p-6 text-center ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
                        <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">No tools found matching "{searchQuery}"</p>
                      </div>
                    )}
                  </motion.div>
                )}
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                  setShowDropdown(false);
                }}
                className={`px-8 py-3 rounded-lg font-semibold flex items-center gap-2 ${
                  theme === 'dark'
                    ? 'bg-electric-green text-black hover:bg-electric-blue'
                    : 'bg-accent-red text-white hover:bg-accent-blue'
                }`}
              >
                <Zap className="w-5 h-5" />
                Explore All Tools
              </motion.button>
            </div>

            {/* Categories row - centered */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <motion.button
                    key={category.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full font-semibold transition-all ${
                      selectedCategory === category.id
                        ? theme === 'dark'
                          ? 'bg-electric-blue text-black shadow-lg'
                          : 'bg-accent-red text-white shadow-lg'
                        : theme === 'dark'
                          ? 'bg-dark-lighter text-gray-400 hover:bg-gray-700 border border-gray-700'
                          : 'bg-white text-gray-800 hover:bg-gray-100 border border-gray-200'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {category.label}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>

          {loading ? (
            <div className={`flex items-center justify-center py-20 rounded-xl border-2 ${
              theme === 'dark'
                ? 'bg-dark-lighter border-gray-700'
                : 'bg-white border-gray-200'
            }`}>
              <div className={`text-lg ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>Loading AI tools...</div>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedCategory + searchQuery}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 px-2 sm:px-0"
              >
                {filteredTools.map((tool, index) => {
                  const Icon = getCategoryIcon(tool.category);
                  return (
                    <motion.div
                      key={tool.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.05 }}
                      whileHover={{ y: -8, transition: { duration: 0.2 } }}
                      onClick={() => handleToolClick(tool)}
                      className={`flex flex-col h-full rounded-xl p-6 cursor-pointer border-2 transition-all ${
                        theme === 'dark'
                          ? 'bg-dark-lighter border-gray-700 hover:border-electric-blue hover:shadow-[0_0_30px_rgba(10,186,181,0.3)]'
                          : 'bg-white border-gray-200 hover:border-accent-red hover:shadow-xl'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className={`p-3 rounded-lg bg-gradient-to-br ${tool.color}`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex items-center gap-2">
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
                          <Sparkles className={`w-5 h-5 ${theme === 'dark' ? 'text-electric-green' : 'text-accent-red'}`} />
                        </div>
                      </div>

                      <h3 className={`text-xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        {tool.name}
                      </h3>

                      <p className={`text-sm mb-4 flex-grow ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
                        {tool.description}
                      </p>

                      <div className="space-y-2 mb-4">
                        {tool.features.map((feature, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <div className={`w-1.5 h-1.5 rounded-full ${theme === 'dark' ? 'bg-electric-blue' : 'bg-accent-blue'}`} />
                            <span className={`text-xs ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                              {feature}
                            </span>
                          </div>
                        ))}
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToolClick(tool);
                        }}
                        className={`mt-auto w-full py-2.5 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all ${
                          theme === 'dark'
                            ? 'bg-electric-green text-black hover:bg-electric-blue'
                            : 'bg-accent-red text-white hover:bg-accent-blue'
                        }`}
                      >
                        <Brain className="w-4 h-4" />
                        Use Now
                      </motion.button>
                    </motion.div>
                  );
                })}
              </motion.div>
            </AnimatePresence>
          )}

          {!loading && filteredTools.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <Search className={`w-16 h-16 mx-auto mb-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`} />
              <h3 className={`text-2xl font-bold mb-2 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
                No tools found
              </h3>
              <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                Try adjusting your search or filters
              </p>
            </motion.div>
          )}
        </div>
      </div>

      <div className={`relative z-10 border-t ${theme === 'dark' ? 'bg-dark-card/80 backdrop-blur-sm border-gray-800' : 'bg-white/80 backdrop-blur-sm border-gray-200'}`}>
        <div className="container mx-auto px-6 py-12">
          <div className={`rounded-2xl p-8 md:p-12 text-center ${
            theme === 'dark'
              ? 'bg-gradient-to-r from-electric-blue/10 to-electric-green/10 border border-electric-blue/30'
              : 'bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200'
          }`}>
            <Brain className={`w-16 h-16 mx-auto mb-6 ${theme === 'dark' ? 'text-electric-green' : 'text-accent-red'}`} />
            <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Ready to Transform Your Workflow?
            </h2>
            <p className={`text-lg md:text-xl mb-8 max-w-2xl mx-auto ${theme === 'dark' ? 'text-gray-300' : 'text-gray-800'}`}>
              Join thousands of users leveraging our AI tools to boost productivity and unlock creative potential.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className={`px-8 py-3 rounded-lg font-semibold ${
                  theme === 'dark'
                    ? 'bg-electric-green text-black hover:bg-electric-blue'
                    : 'bg-accent-red text-white hover:bg-accent-blue'
                }`}
              >
                Get Started Free
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/')}
                className={`px-8 py-3 rounded-lg font-semibold border-2 ${
                  theme === 'dark'
                    ? 'border-electric-blue text-electric-blue hover:bg-electric-blue hover:text-black'
                    : 'border-accent-blue text-accent-blue hover:bg-accent-blue hover:text-white'
                }`}
              >
                Learn More
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIToolsShowcase;
