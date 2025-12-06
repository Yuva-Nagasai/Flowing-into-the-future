import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Brain, 
  Sparkles, 
  Zap, 
  ExternalLink,
  Search,
  Filter,
  Star,
  ArrowRight,
  Bot,
  Code,
  Palette,
  FileText,
  Music,
  Video,
  Image,
  MessageSquare
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import ELearningNav from '../../components/elearning/ELearningNav';
import Footer from '../../components/Footer';
import { aiToolsAPI } from '../../utils/api';

interface AITool {
  id: number;
  name: string;
  description: string;
  category: string;
  url: string;
  image_url: string;
  is_featured: boolean;
  is_active: boolean;
}

const categoryIcons: { [key: string]: React.ElementType } = {
  'Chatbots': MessageSquare,
  'Code Generation': Code,
  'Image Generation': Image,
  'Video Generation': Video,
  'Audio & Music': Music,
  'Writing': FileText,
  'Design': Palette,
  'Productivity': Zap,
  'default': Brain
};

const sampleTools: AITool[] = [
  {
    id: 1,
    name: 'ChatGPT',
    description: 'Advanced AI chatbot by OpenAI for conversations, coding help, and content creation.',
    category: 'Chatbots',
    url: 'https://chat.openai.com',
    image_url: '',
    is_featured: true,
    is_active: true
  },
  {
    id: 2,
    name: 'GitHub Copilot',
    description: 'AI-powered code completion tool that helps developers write code faster.',
    category: 'Code Generation',
    url: 'https://github.com/features/copilot',
    image_url: '',
    is_featured: true,
    is_active: true
  },
  {
    id: 3,
    name: 'Midjourney',
    description: 'AI image generation tool that creates stunning artwork from text prompts.',
    category: 'Image Generation',
    url: 'https://midjourney.com',
    image_url: '',
    is_featured: true,
    is_active: true
  },
  {
    id: 4,
    name: 'Notion AI',
    description: 'AI writing assistant integrated into Notion for enhanced productivity.',
    category: 'Writing',
    url: 'https://notion.so',
    image_url: '',
    is_featured: false,
    is_active: true
  },
  {
    id: 5,
    name: 'Figma AI',
    description: 'AI-powered design features in Figma for faster prototyping and design.',
    category: 'Design',
    url: 'https://figma.com',
    image_url: '',
    is_featured: false,
    is_active: true
  },
  {
    id: 6,
    name: 'Runway ML',
    description: 'AI video generation and editing tool for creative professionals.',
    category: 'Video Generation',
    url: 'https://runwayml.com',
    image_url: '',
    is_featured: false,
    is_active: true
  }
];

const AIToolsPage = () => {
  const { theme } = useTheme();
  const [tools, setTools] = useState<AITool[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    'all',
    'Chatbots',
    'Code Generation',
    'Image Generation',
    'Video Generation',
    'Audio & Music',
    'Writing',
    'Design',
    'Productivity'
  ];

  useEffect(() => {
    fetchTools();
  }, []);

  const fetchTools = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await aiToolsAPI.getAll({});
      const fetchedTools = response.data.tools || [];
      setTools(fetchedTools.length > 0 ? fetchedTools : sampleTools);
    } catch (err) {
      console.error('Error fetching AI tools:', err);
      setTools(sampleTools);
      setError('Unable to load AI tools from server. Showing popular tools.');
    } finally {
      setLoading(false);
    }
  };

  const filteredTools = tools.filter((tool) => {
    const matchesSearch = 
      tool.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tool.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || tool.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredTools = filteredTools.filter(tool => tool.is_featured);
  const regularTools = filteredTools.filter(tool => !tool.is_featured);

  const getCategoryIcon = (category: string) => {
    return categoryIcons[category] || categoryIcons['default'];
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      theme === 'dark' ? 'bg-dark-bg' : 'bg-gray-50'
    }`}>
      <ELearningNav />

      {/* Hero Section */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className={`absolute inset-0 ${
          theme === 'dark'
            ? 'bg-gradient-to-br from-dark-bg via-dark-card to-dark-bg'
            : 'bg-gradient-to-br from-white via-gray-50 to-white'
        }`} />
        <div className="absolute top-20 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-4xl mx-auto"
          >
            <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-6 ${
              theme === 'dark'
                ? 'bg-purple-500/20 text-purple-400'
                : 'bg-purple-100 text-purple-600'
            }`}>
              <Brain className="w-4 h-4" />
              AI Tools Directory
            </span>

            <h1 className={`text-5xl md:text-6xl font-bold mb-6 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Discover the Best{' '}
              <span className={`bg-gradient-to-r ${
                theme === 'dark'
                  ? 'from-purple-400 to-blue-400'
                  : 'from-purple-600 to-blue-600'
              } bg-clip-text text-transparent`}>
                AI Tools
              </span>
            </h1>

            <p className={`text-xl mb-10 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Explore our curated collection of the most powerful AI tools to supercharge 
              your productivity, creativity, and learning journey.
            </p>

            {/* Search Bar */}
            <div className={`max-w-2xl mx-auto p-2 rounded-2xl ${
              theme === 'dark' ? 'bg-dark-card' : 'bg-white'
            } shadow-2xl`}>
              <div className="flex flex-col md:flex-row gap-2">
                <div className="flex-1 relative">
                  <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${
                    theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                  }`} />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search AI tools..."
                    className={`w-full pl-12 pr-4 py-4 rounded-xl border-0 focus:outline-none focus:ring-2 ${
                      theme === 'dark'
                        ? 'bg-dark-lighter text-white placeholder-gray-500 focus:ring-purple-500/30'
                        : 'bg-gray-50 text-gray-900 placeholder-gray-400 focus:ring-purple-500/30'
                    }`}
                  />
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`px-8 py-4 rounded-xl font-semibold flex items-center justify-center gap-2 ${
                    theme === 'dark'
                      ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
                      : 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                  }`}
                >
                  <Search className="w-5 h-5" />
                  Search
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section className={`py-8 ${theme === 'dark' ? 'bg-dark-card' : 'bg-white'}`}>
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => {
              const Icon = getCategoryIcon(category);
              return (
                <motion.button
                  key={category}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-5 py-2.5 rounded-xl font-medium text-sm flex items-center gap-2 transition-all ${
                    selectedCategory === category
                      ? theme === 'dark'
                        ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/30'
                        : 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                      : theme === 'dark'
                        ? 'bg-dark-lighter text-gray-400 hover:text-white hover:bg-gray-700'
                        : 'bg-gray-100 text-gray-600 hover:text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {category === 'all' ? 'All Tools' : category}
                </motion.button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Tools */}
      {featuredTools.length > 0 && (
        <section className={`py-16 ${theme === 'dark' ? 'bg-dark-bg' : 'bg-gray-50'}`}>
          <div className="container mx-auto px-4 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-3 mb-8"
            >
              <Star className={`w-6 h-6 ${
                theme === 'dark' ? 'text-yellow-400' : 'text-yellow-500'
              }`} />
              <h2 className={`text-2xl font-bold ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Featured Tools
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredTools.map((tool, idx) => {
                const Icon = getCategoryIcon(tool.category);
                return (
                  <motion.a
                    key={tool.id}
                    href={tool.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    whileHover={{ y: -10 }}
                    className={`group relative overflow-hidden rounded-2xl border-2 transition-all ${
                      theme === 'dark'
                        ? 'bg-dark-card border-purple-500/30 hover:border-purple-500'
                        : 'bg-white border-purple-200 hover:border-purple-500'
                    } shadow-lg hover:shadow-2xl`}
                  >
                    <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold ${
                      theme === 'dark'
                        ? 'bg-yellow-400/20 text-yellow-400'
                        : 'bg-yellow-100 text-yellow-600'
                    }`}>
                      Featured
                    </div>
                    
                    <div className="p-6">
                      <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 ${
                        theme === 'dark'
                          ? 'bg-gradient-to-br from-purple-500 to-blue-500'
                          : 'bg-gradient-to-br from-purple-600 to-blue-600'
                      }`}>
                        <Icon className="w-7 h-7 text-white" />
                      </div>
                      
                      <h3 className={`text-xl font-bold mb-2 ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>
                        {tool.name}
                      </h3>
                      
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-3 ${
                        theme === 'dark'
                          ? 'bg-dark-lighter text-gray-400'
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {tool.category}
                      </span>
                      
                      <p className={`text-sm mb-4 line-clamp-3 ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        {tool.description}
                      </p>
                      
                      <div className={`flex items-center gap-2 text-sm font-semibold ${
                        theme === 'dark' ? 'text-purple-400' : 'text-purple-600'
                      } group-hover:gap-3 transition-all`}>
                        Try it now
                        <ExternalLink className="w-4 h-4" />
                      </div>
                    </div>
                  </motion.a>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* All Tools */}
      <section className={`py-16 ${theme === 'dark' ? 'bg-dark-card' : 'bg-white'}`}>
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className={`text-2xl font-bold ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              All AI Tools
            </h2>
            <span className={`px-4 py-2 rounded-lg text-sm ${
              theme === 'dark' ? 'bg-dark-lighter text-gray-400' : 'bg-gray-100 text-gray-600'
            }`}>
              <span className={`font-semibold ${
                theme === 'dark' ? 'text-purple-400' : 'text-purple-600'
              }`}>
                {filteredTools.length}
              </span>
              {' '}tools found
            </span>
          </div>

          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className={`p-6 rounded-2xl animate-pulse ${
                    theme === 'dark' ? 'bg-dark-lighter' : 'bg-gray-100'
                  }`}
                >
                  <div className={`w-14 h-14 rounded-xl mb-4 ${
                    theme === 'dark' ? 'bg-dark-bg' : 'bg-gray-200'
                  }`} />
                  <div className={`h-5 rounded mb-2 ${
                    theme === 'dark' ? 'bg-dark-bg' : 'bg-gray-200'
                  }`} />
                  <div className={`h-4 rounded w-2/3 ${
                    theme === 'dark' ? 'bg-dark-bg' : 'bg-gray-200'
                  }`} />
                </div>
              ))}
            </div>
          ) : regularTools.length > 0 || featuredTools.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {(regularTools.length > 0 ? regularTools : featuredTools).map((tool, idx) => {
                const Icon = getCategoryIcon(tool.category);
                return (
                  <motion.a
                    key={tool.id}
                    href={tool.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.05 }}
                    whileHover={{ y: -5, scale: 1.02 }}
                    className={`group p-6 rounded-2xl border-2 transition-all ${
                      theme === 'dark'
                        ? 'bg-dark-lighter border-gray-800 hover:border-purple-500'
                        : 'bg-gray-50 border-gray-200 hover:border-purple-500'
                    } shadow-md hover:shadow-xl`}
                  >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                      theme === 'dark'
                        ? 'bg-purple-500/20 text-purple-400'
                        : 'bg-purple-100 text-purple-600'
                    } group-hover:scale-110 transition-transform`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    
                    <h3 className={`text-lg font-bold mb-1 ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                      {tool.name}
                    </h3>
                    
                    <span className={`inline-block text-xs font-medium mb-2 ${
                      theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                    }`}>
                      {tool.category}
                    </span>
                    
                    <p className={`text-sm line-clamp-2 ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {tool.description}
                    </p>
                    
                    <div className={`mt-4 flex items-center gap-2 text-xs font-semibold ${
                      theme === 'dark' ? 'text-purple-400' : 'text-purple-600'
                    }`}>
                      Explore
                      <ExternalLink className="w-3 h-3" />
                    </div>
                  </motion.a>
                );
              })}
            </div>
          ) : (
            <div className={`text-center py-16 rounded-2xl ${
              theme === 'dark' ? 'bg-dark-lighter' : 'bg-gray-100'
            }`}>
              <Bot className={`w-16 h-16 mx-auto mb-4 ${
                theme === 'dark' ? 'text-gray-600' : 'text-gray-400'
              }`} />
              <h3 className={`text-xl font-bold mb-2 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                No tools found
              </h3>
              <p className={`text-sm ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Try adjusting your search or filter criteria
              </p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className={`py-16 ${theme === 'dark' ? 'bg-dark-bg' : 'bg-gray-50'}`}>
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={`text-center p-12 rounded-3xl ${
              theme === 'dark'
                ? 'bg-gradient-to-br from-purple-500/20 to-blue-500/20'
                : 'bg-gradient-to-br from-purple-100 to-blue-100'
            }`}
          >
            <Sparkles className={`w-12 h-12 mx-auto mb-4 ${
              theme === 'dark' ? 'text-purple-400' : 'text-purple-600'
            }`} />
            <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Learn to Build with AI
            </h2>
            <p className={`text-lg mb-8 max-w-2xl mx-auto ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Master AI tools and technologies with our comprehensive courses. 
              Learn prompt engineering, AI integration, and more.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.location.href = '/elearning'}
              className={`px-8 py-4 rounded-xl font-bold flex items-center gap-2 mx-auto ${
                theme === 'dark'
                  ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
                  : 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
              }`}
            >
              Explore AI Courses
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </motion.div>
        </div>
      </section>

      <Footer variant="elearning" />
    </div>
  );
};

export default AIToolsPage;
