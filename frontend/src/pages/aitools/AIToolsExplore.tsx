import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { aiToolsAPI } from '../../utils/api';
import AIToolsNav from '../../components/aitools/AIToolsNav';
import AIToolsFooter from '../../components/aitools/AIToolsFooter';
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
  SlidersHorizontal
} from 'lucide-react';

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

const AIToolsExplore = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [tools, setTools] = useState<AITool[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [selectedPricing, setSelectedPricing] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);

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

  const filteredTools = useMemo(() => {
    return tools.filter((tool) => {
      const matchesCategory = selectedCategory === 'all' || tool.category === selectedCategory;
      const matchesPricing = selectedPricing === 'all' || tool.pricing_type === selectedPricing;
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        tool.name.toLowerCase().includes(q) ||
        tool.description.toLowerCase().includes(q) ||
        tool.features.some((f) => f.toLowerCase().includes(q));
      return matchesCategory && matchesPricing && matchesSearch;
    });
  }, [tools, selectedCategory, selectedPricing, searchQuery]);

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
    setSearchParams({});
  };

  const hasActiveFilters = searchQuery || selectedCategory !== 'all' || selectedPricing !== 'all';

  return (
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
              Explore AI Tools
            </h1>
            <p className={`text-lg max-w-2xl mx-auto ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Discover and use powerful AI tools to enhance your productivity
            </p>
          </motion.div>

          <div className="max-w-3xl mx-auto mb-8">
            <div className={`flex items-center gap-3 p-2 rounded-2xl ${
              theme === 'dark' ? 'bg-dark-lighter' : 'bg-gray-100'
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
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl font-medium transition-all ${
                  showFilters || hasActiveFilters
                    ? theme === 'dark'
                      ? 'bg-electric-blue text-black'
                      : 'bg-accent-red text-white'
                    : theme === 'dark'
                      ? 'bg-dark-card text-gray-400 hover:text-white'
                      : 'bg-white text-gray-600 hover:text-gray-900'
                }`}
              >
                <SlidersHorizontal className="w-5 h-5" />
                <span className="hidden sm:inline">Filters</span>
              </button>
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
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className={`text-sm font-semibold mb-3 ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}>Pricing</h3>
                      <div className="flex flex-wrap gap-2">
                        {pricingOptions.map((option) => (
                          <button
                            key={option.id}
                            onClick={() => setSelectedPricing(option.id)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                              selectedPricing === option.id
                                ? theme === 'dark'
                                  ? 'bg-electric-blue text-black'
                                  : 'bg-accent-red text-white'
                                : theme === 'dark'
                                  ? 'bg-dark-lighter text-gray-400 hover:text-white'
                                  : 'bg-gray-100 text-gray-600 hover:text-gray-900'
                            }`}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-end justify-end">
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
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleCategoryChange(category.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    selectedCategory === category.id
                      ? theme === 'dark'
                        ? 'bg-electric-blue text-black shadow-lg shadow-electric-blue/30'
                        : 'bg-accent-red text-white shadow-lg shadow-accent-red/30'
                      : theme === 'dark'
                        ? 'bg-dark-lighter text-gray-400 hover:text-white hover:bg-gray-700'
                        : 'bg-gray-100 text-gray-600 hover:text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {category.label}
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
                        onClick={() => navigate(`/ai-tools/tool/${tool.id}`)}
                        className={`group flex items-center gap-6 p-6 rounded-2xl cursor-pointer transition-all ${
                          theme === 'dark'
                            ? 'bg-dark-card border border-gray-800 hover:border-electric-blue'
                            : 'bg-white border border-gray-200 hover:border-accent-red'
                        } shadow-sm hover:shadow-xl`}
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
                      onClick={() => navigate(`/ai-tools/tool/${tool.id}`)}
                      className={`group flex flex-col h-full p-6 rounded-2xl cursor-pointer transition-all ${
                        theme === 'dark'
                          ? 'bg-dark-card border border-gray-800 hover:border-electric-blue hover:shadow-[0_0_30px_rgba(0,240,255,0.2)]'
                          : 'bg-white border border-gray-200 hover:border-accent-red hover:shadow-xl'
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

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/ai-tools/tool/${tool.id}`);
                        }}
                        className={`w-full mt-auto py-2.5 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all ${
                          theme === 'dark'
                            ? 'bg-electric-blue/10 text-electric-blue hover:bg-electric-blue hover:text-black'
                            : 'bg-accent-red/10 text-accent-red hover:bg-accent-red hover:text-white'
                        }`}
                      >
                        <Zap className="w-4 h-4" />
                        View Details
                      </button>
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

      <AIToolsFooter />
    </div>
  );
};

export default AIToolsExplore;
