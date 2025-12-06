import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { useAIToolsAuth } from '../../contexts/AIToolsAuthContext';
import { aiToolsAPI } from '../../utils/api';
import AIToolsNav from '../../components/aitools/AIToolsNav';
import Footer from '../../components/Footer';
import SEO from '../../components/SEO';
import {
  Brain,
  Search,
  Grid,
  List,
  Sparkles,
  Zap,
  ArrowRight,
  X,
  Code,
  Image,
  FileText,
  Mic,
  Video,
  BarChart3,
  Languages,
  SlidersHorizontal,
  Lock,
  Check
} from 'lucide-react';

interface AITool {
  id: string;
  name: string;
  description: string;
  category: string;
  color: string;
  features: string[];
      pricing_type: 'free' | 'paid';
  // Optional numeric price for future price-based filtering
  price?: number;
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

const AIToolsExplore = () => {
  const { theme } = useTheme();
  const { user } = useAIToolsAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [tools, setTools] = useState<AITool[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [selectedPricing, setSelectedPricing] = useState('all');
  const [sortBy, setSortBy] = useState<
    'newest' | 'price-low' | 'price-high' | 'popular' | 'top-rated'
  >('newest');
  const [selectedCapability, setSelectedCapability] = useState<
    'all' | 'writing' | 'image' | 'code' | 'audio' | 'video' | 'analysis' | 'translation'
  >('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [pendingToolId, setPendingToolId] = useState<string | null>(null);

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

  const pricingOptions = [
    { id: 'all', label: 'All Pricing' },
    { id: 'free', label: 'Free Tools' },
    { id: 'paid', label: 'Premium Tools' }
  ];

  const sampleTools: AITool[] = [
    { id: '1', name: 'ChatGPT', description: 'Advanced AI chatbot for conversations, coding help, and content creation', category: 'text', color: 'from-green-500 to-emerald-600', features: ['Natural Language Processing', 'Code Generation', 'Content Writing'], pricing_type: 'free', url: 'https://chat.openai.com' },
    { id: '2', name: 'Midjourney', description: 'AI image generation tool that creates stunning artwork from text prompts', category: 'image', color: 'from-purple-500 to-pink-600', features: ['Text to Image', 'Style Variations', 'High Resolution'], pricing_type: 'paid', url: 'https://midjourney.com' },
    { id: '3', name: 'GitHub Copilot', description: 'AI-powered code completion tool that helps developers write code faster', category: 'code', color: 'from-gray-600 to-gray-800', features: ['Code Suggestions', 'Multi-language Support', 'IDE Integration'], pricing_type: 'paid', url: 'https://github.com/features/copilot' },
    { id: '4', name: 'ElevenLabs', description: 'AI voice synthesis and text-to-speech with natural sounding voices', category: 'audio', color: 'from-blue-500 to-indigo-600', features: ['Voice Cloning', 'Multiple Languages', 'Realistic Speech'], pricing_type: 'free', url: 'https://elevenlabs.io' },
    { id: '5', name: 'Runway ML', description: 'AI video generation and editing tool for creative professionals', category: 'video', color: 'from-cyan-500 to-blue-600', features: ['Video Generation', 'Background Removal', 'Motion Tracking'], pricing_type: 'paid', url: 'https://runwayml.com' },
    { id: '6', name: 'Tableau AI', description: 'AI-powered data analysis and visualization platform', category: 'analysis', color: 'from-orange-500 to-red-600', features: ['Auto Insights', 'Data Visualization', 'Predictive Analytics'], pricing_type: 'paid', url: 'https://tableau.com' },
    { id: '7', name: 'DALL-E 3', description: 'OpenAIs latest image generation model with enhanced understanding', category: 'image', color: 'from-teal-500 to-green-600', features: ['High Fidelity', 'Text Understanding', 'Creative Control'], pricing_type: 'paid', url: 'https://openai.com/dall-e-3' },
    { id: '8', name: 'Claude', description: 'Anthropics AI assistant for helpful, harmless conversations', category: 'text', color: 'from-amber-500 to-orange-600', features: ['Long Context', 'Safety Focused', 'Reasoning'], pricing_type: 'free', url: 'https://claude.ai' }
  ];

  useEffect(() => {
    fetchTools();
  }, []);

  useEffect(() => {
    const category = searchParams.get('category');
    if (category) {
      setSelectedCategory(category);
    }
  }, [searchParams]);

  const fetchTools = async () => {
    try {
      const response = await aiToolsAPI.getAll({ active: 'true' });
      const tools = response.data.tools || [];
      if (tools.length > 0) {
        setTools(tools);
      } else {
        setTools(sampleTools);
      }
    } catch (error) {
      console.error('Error fetching tools:', error);
      setTools(sampleTools);
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

  const filteredTools = useMemo(() => {
    const baseWithIndex = tools
      .map((tool, index) => ({ tool, index }))
      .filter(({ tool }) => {
        const matchesCategory = selectedCategory === 'all' || tool.category === selectedCategory;
        const matchesPricing = selectedPricing === 'all' || tool.pricing_type === selectedPricing;
        const matchesCapability = (() => {
          if (selectedCapability === 'all') return true;
          const cat = tool.category;
          const featureText = tool.features.join(' ').toLowerCase();
          switch (selectedCapability) {
            case 'writing':
              return (
                cat === 'text' ||
                featureText.includes('writing') ||
                featureText.includes('copy') ||
                featureText.includes('content')
              );
            case 'image':
              return cat === 'image' || featureText.includes('image') || featureText.includes('visual');
            case 'code':
              return cat === 'code' || featureText.includes('code') || featureText.includes('developer');
            case 'audio':
              return cat === 'audio' || featureText.includes('audio') || featureText.includes('voice');
            case 'video':
              return cat === 'video' || featureText.includes('video');
            case 'analysis':
              return cat === 'analysis' || featureText.includes('analysis') || featureText.includes('analytics');
            case 'translation':
              return cat === 'translation' || featureText.includes('translate') || featureText.includes('language');
            default:
              return true;
          }
        })();
        const q = searchQuery.toLowerCase();
        const matchesSearch =
          tool.name.toLowerCase().includes(q) ||
          tool.description.toLowerCase().includes(q) ||
          tool.features.some((f) => f.toLowerCase().includes(q));
        return matchesCategory && matchesPricing && matchesCapability && matchesSearch;
      });

    const sortedWithIndex = [...baseWithIndex].sort((a, b) => {
      const priceA = a.tool.price;
      const priceB = b.tool.price;

      switch (sortBy) {
        case 'newest':
          // Newest first based on original order (later index = newer)
          return b.index - a.index;
        case 'price-low':
          return (priceA ?? Number.POSITIVE_INFINITY) - (priceB ?? Number.POSITIVE_INFINITY) ||
            a.index - b.index;
        case 'price-high':
          return (priceB ?? -1) - (priceA ?? -1) || a.index - b.index;
        case 'popular':
        case 'top-rated':
        default:
          // Fallback to original ordering when we don't have specific metrics yet
          return a.index - b.index;
      }
    });

    return sortedWithIndex.map(({ tool }) => tool);
  }, [tools, selectedCategory, selectedPricing, selectedCapability, searchQuery, sortBy]);

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    if (categoryId === 'all') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', categoryId);
    }
    setSearchParams(searchParams);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedPricing('all');
    setSelectedCapability('all');
    setSearchParams({});
  };

  const hasActiveFilters =
    searchQuery || selectedCategory !== 'all' || selectedPricing !== 'all' || selectedCapability !== 'all';

  return (
    <>
      <SEO
        title="Explore AI Tools | NanoFlows"
        description="Browse and discover powerful AI tools for text, image, code, audio, video, and more. Filter by category, pricing, and capabilities."
        keywords="explore AI tools, AI tools directory, text generation tools, image AI, code AI, audio AI, video AI"
      />
      <div className={`min-h-screen w-full max-w-full overflow-x-hidden flex flex-col ${theme === 'dark' ? 'bg-dark-bg' : 'bg-gray-50'}`}>
        <AIToolsNav />

      <section className={`py-12 ${theme === 'dark' ? 'bg-dark-card' : 'bg-white'}`}>
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center mb-8"
          >
            <h1 className={`text-3xl md:text-4xl font-bold mb-4 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`} style={{ fontFamily: 'Orbitron, sans-serif' }}>
              Explore{' '}
              <span className={`bg-gradient-to-r ${
                theme === 'dark'
                  ? 'from-electric-green to-electric-blue'
                  : 'from-accent-red to-accent-blue'
              } bg-clip-text text-transparent`}>
                AI Tools
              </span>
            </h1>
            <p className={`text-lg max-w-2xl mx-auto ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Discover and use powerful AI tools to enhance your productivity
            </p>
          </motion.div>

          <div className="max-w-3xl mx-auto mb-8">
            <div className={`flex items-center gap-3 p-2 rounded-2xl ${
              theme === 'dark'
                ? 'bg-dark-lighter'
                : 'bg-gradient-to-br from-accent-red/10 via-white/80 to-accent-blue/10 border border-accent-red/30 shadow-[0_20px_60px_rgba(15,23,42,0.12)]'
            }`}>
              <div className="relative flex-1">
                <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${
                  theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                }`} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search AI tools by name, description, or features..."
                  className={`w-full pl-12 pr-4 py-3 rounded-xl border-0 focus:outline-none focus:ring-2 ${
                    theme === 'dark'
                      ? 'bg-dark-card text-white placeholder-gray-500 focus:ring-electric-blue/30'
                      : 'bg-white text-gray-900 placeholder-gray-400 focus:ring-accent-red/30'
                  }`}
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className={`absolute right-4 top-1/2 -translate-y-1/2 ${
                      theme === 'dark' ? 'text-gray-500 hover:text-white' : 'text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowFilters(!showFilters)}
                className={`relative group overflow-hidden flex items-center gap-2 px-4 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  showFilters || hasActiveFilters
                    ? theme === 'dark'
                      ? 'bg-gradient-to-r from-electric-blue to-electric-green text-slate-900 shadow-lg shadow-electric-blue/25'
                      : 'bg-gradient-to-r from-accent-red to-accent-blue text-white shadow-lg shadow-accent-red/25'
                    : theme === 'dark'
                      ? 'bg-dark-card text-gray-400 hover:text-white'
                      : 'bg-white text-gray-600 hover:text-gray-900'
                }`}
              >
                <span className="relative z-10 flex items-center gap-2">
                  <SlidersHorizontal className="w-5 h-5" />
                  <span className="hidden sm:inline">Filters</span>
                </span>
                {(showFilters || hasActiveFilters) && (
                  <div
                    className={`absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 ${
                      theme === 'dark'
                        ? 'bg-gradient-to-r from-electric-green to-electric-blue'
                        : 'bg-gradient-to-r from-accent-blue to-accent-red'
                    }`}
                  />
                )}
              </motion.button>
            </div>

            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className={`mt-4 p-6 rounded-2xl ${
                    theme === 'dark' ? 'bg-dark-card border border-gray-800' : 'bg-white border border-gray-200'
                  }`}
                >
                  <div className="space-y-6">
                    <div>
                      <h3
                        className={`text-sm font-semibold mb-3 ${
                          theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                        }`}
                      >
                        Pricing
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {pricingOptions.map((option) => (
                          <motion.button
                            key={option.id}
                            whileHover={{ scale: selectedPricing === option.id ? 1.05 : 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setSelectedPricing(option.id)}
                            className={`relative group overflow-hidden px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${
                              selectedPricing === option.id
                                ? theme === 'dark'
                                  ? 'bg-gradient-to-r from-electric-blue to-electric-green text-slate-900 shadow-lg shadow-electric-blue/25'
                                  : 'bg-gradient-to-r from-accent-red to-accent-blue text-white shadow-lg shadow-accent-red/25'
                                : theme === 'dark'
                                  ? 'bg-dark-lighter text-gray-400 hover:text-white'
                                  : 'bg-gray-100 text-gray-600 hover:text-gray-900'
                            }`}
                          >
                            <span className="relative z-10">{option.label}</span>
                            {selectedPricing === option.id && (
                              <div
                                className={`absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 ${
                                  theme === 'dark'
                                    ? 'bg-gradient-to-r from-electric-green to-electric-blue'
                                    : 'bg-gradient-to-r from-accent-blue to-accent-red'
                                }`}
                              />
                            )}
                          </motion.button>
                        ))}
                      </div>

                      <div className="mt-6">
                        <h3
                          className={`text-sm font-semibold mb-3 ${
                            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                          }`}
                        >
                          Capabilities
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {[
                            { id: 'all', label: 'All capabilities' },
                            { id: 'writing', label: 'Text & Writing' },
                            { id: 'image', label: 'Image & Design' },
                            { id: 'code', label: 'Code & Dev' },
                            { id: 'audio', label: 'Audio & Voice' },
                            { id: 'video', label: 'Video' },
                            { id: 'analysis', label: 'Data & Analysis' },
                            { id: 'translation', label: 'Translation' }
                          ].map((capability) => (
                            <motion.button
                              key={capability.id}
                              whileHover={{
                                scale: selectedCapability === capability.id ? 1.05 : 1.02
                              }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() =>
                                setSelectedCapability(capability.id as typeof selectedCapability)
                              }
                              className={`relative group overflow-hidden px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300 ${
                                selectedCapability === capability.id
                                  ? theme === 'dark'
                                    ? 'bg-gradient-to-r from-electric-blue to-electric-green text-slate-900 shadow-lg shadow-electric-blue/25'
                                    : 'bg-gradient-to-r from-accent-red to-accent-blue text-white shadow-lg shadow-accent-red/25'
                                  : theme === 'dark'
                                    ? 'bg-dark-lighter text-gray-400 hover:text-white'
                                    : 'bg-gray-100 text-gray-600 hover:text-gray-900'
                              }`}
                            >
                              <span className="relative z-10">{capability.label}</span>
                              {selectedCapability === capability.id && (
                                <div
                                  className={`absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 ${
                                    theme === 'dark'
                                      ? 'bg-gradient-to-r from-electric-green to-electric-blue'
                                      : 'bg-gradient-to-r from-accent-blue to-accent-red'
                                  }`}
                                />
                              )}
                            </motion.button>
                          ))}
                        </div>
                      </div>

                      <div className="mt-6">
                        <h3
                          className={`text-sm font-semibold mb-3 ${
                            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                          }`}
                        >
                          Sort By
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {[
                            { id: 'newest', label: 'Newest First' },
                            { id: 'price-low', label: 'Price: Low to High' },
                            { id: 'price-high', label: 'Price: High to Low' },
                            { id: 'popular', label: 'Most Popular' },
                            { id: 'top-rated', label: 'Top Rated' }
                          ].map((option) => (
                            <motion.button
                              key={option.id}
                              whileHover={{ scale: sortBy === option.id ? 1.05 : 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => setSortBy(option.id as typeof sortBy)}
                              className={`relative group overflow-hidden px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300 ${
                                sortBy === option.id
                                  ? theme === 'dark'
                                    ? 'bg-gradient-to-r from-electric-blue to-electric-green text-slate-900 shadow-lg shadow-electric-blue/25'
                                    : 'bg-gradient-to-r from-accent-red to-accent-blue text-white shadow-lg shadow-accent-red/25'
                                  : theme === 'dark'
                                    ? 'bg-dark-lighter text-gray-400 hover:text-white'
                                    : 'bg-gray-100 text-gray-600 hover:text-gray-900'
                              }`}
                            >
                              <span className="relative z-10">{option.label}</span>
                              {sortBy === option.id && (
                                <div
                                  className={`absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 ${
                                    theme === 'dark'
                                      ? 'bg-gradient-to-r from-electric-green to-electric-blue'
                                      : 'bg-gradient-to-r from-accent-blue to-accent-red'
                                  }`}
                                />
                              )}
                            </motion.button>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-end">
                      {hasActiveFilters && (
                        <button
                          onClick={clearFilters}
                          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium ${
                            theme === 'dark'
                              ? 'text-red-400 hover:bg-red-500/10'
                              : 'text-red-600 hover:bg-red-50'
                          }`}
                        >
                          <X className="w-4 h-4" />
                          Clear All Filters
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex flex-wrap justify-center gap-2 mb-4">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <motion.button
                  key={category.id}
                  whileHover={{ scale: selectedCategory === category.id ? 1.05 : 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleCategoryChange(category.id)}
                  className={`relative group overflow-hidden flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${
                    selectedCategory === category.id
                      ? theme === 'dark'
                        ? 'bg-gradient-to-r from-electric-blue to-electric-green text-slate-900 shadow-lg shadow-electric-blue/25'
                        : 'bg-gradient-to-r from-accent-red to-accent-blue text-white shadow-lg shadow-accent-red/25'
                      : theme === 'dark'
                        ? 'bg-dark-lighter text-gray-400 hover:text-white hover:bg-gray-700'
                        : 'bg-gray-100 text-gray-600 hover:text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  <span className="relative z-10 flex items-center gap-2">
                    <Icon className="w-4 h-4" />
                    {category.label}
                  </span>
                  {selectedCategory === category.id && (
                    <div
                      className={`absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 ${
                        theme === 'dark'
                          ? 'bg-gradient-to-r from-electric-green to-electric-blue'
                          : 'bg-gradient-to-r from-accent-blue to-accent-red'
                      }`}
                    />
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>
      </section>

      <section className={`py-12 ${theme === 'dark' ? 'bg-dark-bg' : 'bg-gray-50'}`}>
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <span className={`px-4 py-2 rounded-lg text-sm ${
                theme === 'dark' ? 'bg-dark-card text-gray-400' : 'bg-white text-gray-600'
              }`}>
                <span className={`font-bold ${
                  theme === 'dark' ? 'text-electric-blue' : 'text-accent-red'
                }`}>{filteredTools.length}</span> tools found
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === 'grid'
                    ? theme === 'dark'
                      ? 'bg-electric-blue/20 text-electric-blue'
                      : 'bg-accent-red/10 text-accent-red'
                    : theme === 'dark'
                      ? 'text-gray-500 hover:text-white'
                      : 'text-gray-400 hover:text-gray-900'
                }`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === 'list'
                    ? theme === 'dark'
                      ? 'bg-electric-blue/20 text-electric-blue'
                      : 'bg-accent-red/10 text-accent-red'
                    : theme === 'dark'
                      ? 'text-gray-500 hover:text-white'
                      : 'text-gray-400 hover:text-gray-900'
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>

          {loading ? (
            <div className={`grid ${
              viewMode === 'grid' 
                ? 'md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                : 'grid-cols-1'
            } gap-6`}>
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className={`p-6 rounded-2xl animate-pulse ${
                    theme === 'dark' ? 'bg-dark-card' : 'bg-white'
                  }`}
                >
                  <div className={`w-14 h-14 rounded-xl mb-4 ${
                    theme === 'dark' ? 'bg-dark-lighter' : 'bg-gray-200'
                  }`} />
                  <div className={`h-6 rounded mb-3 ${
                    theme === 'dark' ? 'bg-dark-lighter' : 'bg-gray-200'
                  }`} />
                  <div className={`h-16 rounded ${
                    theme === 'dark' ? 'bg-dark-lighter' : 'bg-gray-200'
                  }`} />
                </div>
              ))}
            </div>
          ) : filteredTools.length > 0 ? (
            <AnimatePresence mode="wait">
              <motion.div
                key={viewMode + selectedCategory + selectedPricing + searchQuery}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`grid ${
                  viewMode === 'grid'
                    ? 'md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                    : 'grid-cols-1'
                } gap-6`}
              >
                {filteredTools.map((tool, index) => {
                  const Icon = getCategoryIcon(tool.category);

                  if (viewMode === 'list') {
                    return (
                      <motion.div
                        key={tool.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.03 }}
                        whileHover={{ x: 5 }}
                        onClick={() => handleProtectedNavigate(tool.id)}
                        className={`group flex items-center gap-6 p-6 rounded-2xl cursor-pointer transition-all border shadow-sm hover:shadow-xl ${
                          theme === 'dark'
                            ? 'bg-dark-card border-gray-800 hover:border-electric-blue'
                            : 'bg-gradient-to-br from-accent-red/10 to-accent-blue/10 border-accent-red/30 hover:border-accent-red/60'
                        }`}
                      >
                        <div className={`flex-shrink-0 p-4 rounded-xl bg-gradient-to-br ${tool.color}`}>
                          <Icon className="w-8 h-8 text-white" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className={`text-xl font-bold ${
                              theme === 'dark' ? 'text-white' : 'text-gray-900'
                            }`}>{tool.name}</h3>
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
                          <p className={`text-sm line-clamp-2 mb-2 ${
                            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                          }`}>{tool.description}</p>
                          <div className="flex flex-wrap gap-2">
                            {tool.features.slice(0, 3).map((feature, idx) => (
                              <span
                                key={idx}
                                className={`text-xs px-2 py-1 rounded ${
                                  theme === 'dark' ? 'bg-dark-lighter text-gray-400' : 'bg-gray-100 text-gray-600'
                                }`}
                              >
                                {feature}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className={`flex items-center gap-2 text-sm font-semibold ${
                          theme === 'dark' ? 'text-electric-blue' : 'text-accent-red'
                        } group-hover:gap-3 transition-all`}>
                          View
                          <ArrowRight className="w-5 h-5" />
                        </div>
                      </motion.div>
                    );
                  }

                  return (
                      <motion.div
                      key={tool.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.03 }}
                      whileHover={{ y: -8 }}
                        onClick={() => handleProtectedNavigate(tool.id)}
                      className={`group flex flex-col h-full p-6 rounded-2xl cursor-pointer transition-all border ${
                        theme === 'dark'
                          ? 'bg-dark-card border-gray-800 hover:border-electric-blue hover:shadow-[0_0_30px_rgba(0,240,255,0.2)]'
                          : 'bg-gradient-to-br from-accent-red/10 to-accent-blue/10 border-accent-red/30 hover:border-accent-red/60 hover:shadow-xl'
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

                      <h3 className={`text-lg font-bold mb-2 ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>{tool.name}</h3>

                      <p className={`text-sm mb-4 line-clamp-2 flex-grow ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                      }`}>{tool.description}</p>

                      <div className="space-y-1.5 mb-4">
                        {tool.features.slice(0, 3).map((feature, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <div className={`w-1 h-1 rounded-full ${
                              theme === 'dark' ? 'bg-electric-blue' : 'bg-accent-blue'
                            }`} />
                            <span className={`text-xs ${
                              theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                            }`}>{feature}</span>
                          </div>
                        ))}
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/ai-tools/tool/${tool.id}`);
                        }}
                        className={`relative group overflow-hidden w-full mt-auto py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all duration-300 ${
                          theme === 'dark'
                            ? 'bg-gradient-to-r from-electric-green to-electric-blue text-dark-bg'
                            : 'bg-gradient-to-r from-accent-red to-accent-blue text-white'
                        }`}
                      >
                        <span className="relative z-10 flex items-center gap-2">
                          <Zap className="w-4 h-4" />
                          View Details
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
              </motion.div>
            </AnimatePresence>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`text-center py-20 rounded-2xl ${
                theme === 'dark' ? 'bg-dark-card' : 'bg-white'
              }`}
            >
              <Search className={`w-16 h-16 mx-auto mb-4 ${
                theme === 'dark' ? 'text-gray-600' : 'text-gray-400'
              }`} />
              <h3 className={`text-xl font-bold mb-2 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>No tools found</h3>
              <p className={`text-sm mb-6 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Try adjusting your search or filter criteria
              </p>
              <button
                onClick={clearFilters}
                className={`px-6 py-3 rounded-xl font-semibold ${
                  theme === 'dark'
                    ? 'bg-electric-blue text-black'
                    : 'bg-accent-red text-white'
                }`}
              >
                Clear All Filters
              </button>
            </motion.div>
          )}
        </div>
      </section>

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

export default AIToolsExplore;
