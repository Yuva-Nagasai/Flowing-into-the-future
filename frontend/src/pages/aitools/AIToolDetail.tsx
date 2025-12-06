import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { useAIToolsAuth } from '../../contexts/AIToolsAuthContext';
import { aiToolsAPI } from '../../utils/api';
import AIToolsNav from '../../components/aitools/AIToolsNav';
import Footer from '../../components/Footer';
import SEO from '../../components/SEO';
import {
  Brain,
  ArrowLeft,
  ExternalLink,
  Star,
  Check,
  Sparkles,
  Zap,
  Shield,
  Clock,
  Code,
  Image,
  FileText,
  Mic,
  Video,
  BarChart3,
  Languages,
  ArrowRight,
  Copy,
  Lock,
  X
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

const getCategoryLabel = (category: string) => {
  const labels: Record<string, string> = {
    text: 'Text & Writing',
    image: 'Image Generation',
    code: 'Code Assistant',
    audio: 'Audio & Voice',
    video: 'Video Creation',
    analysis: 'Data Analysis',
    translation: 'Translation'
  };
  return labels[category] || category;
};

const AIToolDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { theme } = useTheme();
  const { user } = useAIToolsAuth();
  const navigate = useNavigate();
  const [tool, setTool] = useState<AITool | null>(null);
  const [relatedTools, setRelatedTools] = useState<AITool[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const sampleTools: AITool[] = [
    { id: '1', name: 'ChatGPT', description: 'Advanced AI chatbot for conversations, coding help, and content creation. Powered by OpenAI, ChatGPT can help with writing, analysis, coding, math, and creative tasks. It understands context and can engage in natural conversations on virtually any topic.', category: 'text', color: 'from-green-500 to-emerald-600', features: ['Natural Language Processing', 'Code Generation', 'Content Writing', 'Multi-turn Conversations', 'Context Understanding'], pricing_type: 'free', url: 'https://chat.openai.com' },
    { id: '2', name: 'Midjourney', description: 'AI image generation tool that creates stunning artwork from text prompts. Known for its artistic quality and unique aesthetic style, Midjourney transforms your ideas into beautiful visual art.', category: 'image', color: 'from-purple-500 to-pink-600', features: ['Text to Image', 'Style Variations', 'High Resolution', 'Artistic Quality', 'Community Gallery'], pricing_type: 'paid', url: 'https://midjourney.com' },
    { id: '3', name: 'GitHub Copilot', description: 'AI-powered code completion tool that helps developers write code faster. Trained on billions of lines of code, Copilot suggests whole lines or entire functions as you type.', category: 'code', color: 'from-gray-600 to-gray-800', features: ['Code Suggestions', 'Multi-language Support', 'IDE Integration', 'Context Awareness', 'Test Generation'], pricing_type: 'paid', url: 'https://github.com/features/copilot' },
    { id: '4', name: 'ElevenLabs', description: 'AI voice synthesis and text-to-speech with natural sounding voices. Create realistic voiceovers, clone voices, and generate speech in multiple languages with stunning quality.', category: 'audio', color: 'from-blue-500 to-indigo-600', features: ['Voice Cloning', 'Multiple Languages', 'Realistic Speech', 'Emotion Control', 'API Access'], pricing_type: 'free', url: 'https://elevenlabs.io' },
    { id: '5', name: 'Runway ML', description: 'AI video generation and editing tool for creative professionals. From text-to-video to advanced video editing, Runway provides cutting-edge AI tools for filmmakers and content creators.', category: 'video', color: 'from-cyan-500 to-blue-600', features: ['Video Generation', 'Background Removal', 'Motion Tracking', 'Gen-2 Model', 'Real-time Editing'], pricing_type: 'paid', url: 'https://runwayml.com' },
    { id: '6', name: 'Tableau AI', description: 'AI-powered data analysis and visualization platform. Automatically discover insights, create visualizations, and make data-driven decisions with intelligent analytics.', category: 'analysis', color: 'from-orange-500 to-red-600', features: ['Auto Insights', 'Data Visualization', 'Predictive Analytics', 'Natural Language Queries', 'Dashboard Creation'], pricing_type: 'paid', url: 'https://tableau.com' },
    { id: '7', name: 'DALL-E 3', description: 'OpenAIs latest image generation model with enhanced understanding of prompts and ability to create highly detailed, accurate images from text descriptions.', category: 'image', color: 'from-teal-500 to-green-600', features: ['High Fidelity', 'Text Understanding', 'Creative Control', 'Inpainting', 'Outpainting'], pricing_type: 'paid', url: 'https://openai.com/dall-e-3' },
    { id: '8', name: 'Claude', description: 'Anthropics AI assistant designed to be helpful, harmless, and honest. Claude excels at long-form content, analysis, and thoughtful conversations.', category: 'text', color: 'from-amber-500 to-orange-600', features: ['Long Context', 'Safety Focused', 'Reasoning', 'Document Analysis', 'Code Review'], pricing_type: 'free', url: 'https://claude.ai' }
  ];

  useEffect(() => {
    if (id) {
      fetchTool();
    }
  }, [id]);

  const fetchTool = async () => {
    try {
      const response = await aiToolsAPI.getById(id!);
      const fetchedTool = response.data.tool;
      if (fetchedTool) {
        setTool(fetchedTool);
        const allToolsResponse = await aiToolsAPI.getAll({ active: 'true' });
        const allTools = allToolsResponse.data.tools || [];
        const related = allTools
          .filter((t: AITool) => t.category === fetchedTool.category && String(t.id) !== String(fetchedTool.id))
          .slice(0, 3);
        setRelatedTools(related);
      } else {
        const sampleTool = sampleTools.find(t => String(t.id) === String(id));
        if (sampleTool) {
          setTool(sampleTool);
          const related = sampleTools
            .filter(t => t.category === sampleTool.category && t.id !== sampleTool.id)
            .slice(0, 3);
          setRelatedTools(related);
        }
      }
    } catch (error) {
      console.error('Error fetching tool:', error);
      const sampleTool = sampleTools.find(t => String(t.id) === String(id));
      if (sampleTool) {
        setTool(sampleTool);
        const related = sampleTools
          .filter(t => t.category === sampleTool.category && t.id !== sampleTool.id)
          .slice(0, 3);
        setRelatedTools(related);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share && tool) {
      try {
        await navigator.share({
          title: tool.name,
          text: tool.description,
          url: window.location.href,
        });
      } catch (err) {
        // ignore share cancellation
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleUseTool = () => {
    // Check if user is authenticated
    if (!user) {
      setShowLoginModal(true);
      return;
    }
    
    // User is authenticated, proceed to use the tool
    if (tool?.url) {
      window.open(tool.url, '_blank', 'noopener,noreferrer');
    }
  };

  const handleLogin = () => {
    setShowLoginModal(false);
    navigate('/ai-tools/login', { state: { from: { pathname: `/ai-tools/tool/${id}` } } });
  };

  if (loading) {
    return (
      <div className={`min-h-screen w-full max-w-full overflow-x-hidden ${theme === 'dark' ? 'bg-dark-bg' : 'bg-gray-50'}`}>
        <AIToolsNav />
        <div className="container mx-auto px-4 lg:px-8 py-20">
          <div className={`max-w-4xl mx-auto p-8 rounded-3xl animate-pulse ${
            theme === 'dark' ? 'bg-dark-card' : 'bg-white'
          }`}>
            <div className={`w-20 h-20 rounded-2xl mb-6 ${
              theme === 'dark' ? 'bg-dark-lighter' : 'bg-gray-200'
            }`} />
            <div className={`h-10 rounded mb-4 w-2/3 ${
              theme === 'dark' ? 'bg-dark-lighter' : 'bg-gray-200'
            }`} />
            <div className={`h-24 rounded ${
              theme === 'dark' ? 'bg-dark-lighter' : 'bg-gray-200'
            }`} />
          </div>
        </div>
      </div>
    );
  }

  if (!tool) {
    return (
      <div className={`min-h-screen w-full max-w-full overflow-x-hidden ${theme === 'dark' ? 'bg-dark-bg' : 'bg-gray-50'}`}>
        <AIToolsNav />
        <div className="container mx-auto px-4 lg:px-8 py-20">
          <div className="text-center">
            <Brain className={`w-20 h-20 mx-auto mb-6 ${
              theme === 'dark' ? 'text-gray-600' : 'text-gray-400'
            }`} />
            <h1 className={`text-3xl font-bold mb-4 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>Tool Not Found</h1>
            <p className={`mb-8 ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>The AI tool you're looking for doesn't exist or has been removed.</p>
            <button
              onClick={() => navigate('/ai-tools/explore')}
              className={`px-6 py-3 rounded-xl font-semibold ${
                theme === 'dark'
                  ? 'bg-electric-blue text-black'
                  : 'bg-accent-red text-white'
              }`}
            >
              Browse All Tools
            </button>
          </div>
        </div>
      </div>
    );
  }

  const Icon = getCategoryIcon(tool.category);

  const detailCardClass =
    theme === 'dark'
      ? 'bg-dark-card/95 border border-gray-700/60 backdrop-blur-sm shadow-[0_25px_90px_rgba(0,0,0,0.65)]'
      : 'bg-gradient-to-br from-accent-red/10 via-white to-accent-blue/15 border border-accent-red/30 shadow-[0_25px_90px_rgba(15,23,42,0.15)] backdrop-blur-sm';

  return (
    <>
      <SEO
        title={tool ? `${tool.name} | AI Tools` : 'AI Tool Details | NanoFlows'}
        description={tool ? tool.description : 'Discover powerful AI tools and automation solutions.'}
        keywords={tool ? `AI tool, ${tool.category}, ${tool.name}, automation` : 'AI tools, automation, artificial intelligence'}
      />
      <div className={`min-h-screen w-full max-w-full overflow-x-hidden flex flex-col ${theme === 'dark' ? 'bg-dark-bg' : 'bg-gray-50'}`}>
        <AIToolsNav />

      <div className="container mx-auto px-4 lg:px-8 py-8">
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/ai-tools/explore')}
          className={`relative group overflow-hidden mb-8 inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-exo font-medium shadow-lg transition-all duration-300 ${
            theme === 'dark'
              ? 'bg-gradient-to-r from-electric-green to-electric-blue text-dark-bg'
              : 'bg-gradient-to-r from-accent-red to-accent-blue text-white'
          }`}
        >
          <span className="relative z-10 flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Tools
          </span>
          <div
            className={`absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 ${
              theme === 'dark'
                ? 'bg-gradient-to-r from-electric-blue to-electric-green'
                : 'bg-gradient-to-r from-accent-blue to-accent-red'
            }`}
          />
        </motion.button>

        <div className="grid lg:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2"
          >
            <div className={`p-8 rounded-3xl ${detailCardClass}`}>
              <div className="flex flex-col sm:flex-row sm:items-start gap-6 mb-8">
                <div className={`flex-shrink-0 p-5 rounded-2xl bg-gradient-to-br ${tool.color} shadow-lg`}>
                  <Icon className="w-12 h-12 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3 mb-3">
                    <h1 className={`text-3xl md:text-4xl font-bold ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`} style={{ fontFamily: 'Orbitron, sans-serif' }}>
                      {tool.name}
                    </h1>
                    <span className={`text-sm font-semibold px-3 py-1 rounded-full ${
                      tool.pricing_type === 'free'
                        ? theme === 'dark'
                          ? 'bg-electric-green/20 text-electric-green'
                          : 'bg-green-100 text-green-600'
                        : theme === 'dark'
                          ? 'bg-yellow-500/20 text-yellow-400'
                          : 'bg-yellow-100 text-yellow-600'
                    }`}>
                      {tool.pricing_type === 'free' ? 'Free' : 'Premium'}
                    </span>
                  </div>
                  <Link
                    to={`/ai-tools/explore?category=${tool.category}`}
                    className={`inline-flex items-center gap-2 text-sm font-medium transition-all ${
                      theme === 'dark'
                        ? 'text-electric-blue hover:text-electric-green'
                        : 'text-accent-red hover:text-accent-blue'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {getCategoryLabel(tool.category)}
                  </Link>
                </div>
              </div>

              <p className={`text-lg mb-8 leading-relaxed ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
              }`}>
                {tool.description}
              </p>

              <div className="mb-8">
                <h2 className={`text-xl font-bold mb-4 flex items-center gap-2 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  <Sparkles className={`w-5 h-5 ${
                    theme === 'dark' ? 'text-electric-green' : 'text-accent-red'
                  }`} />
                  Key Features
                </h2>
                <div className="grid sm:grid-cols-2 gap-3">
                  {tool.features.map((feature, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`flex items-center gap-3 p-4 rounded-xl ${
                        theme === 'dark' ? 'bg-dark-lighter' : 'bg-gray-50'
                      }`}
                    >
                      <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${
                        theme === 'dark'
                          ? 'bg-electric-green/20 text-electric-green'
                          : 'bg-green-100 text-green-600'
                      }`}>
                        <Check className="w-4 h-4" />
                      </div>
                      <span className={`text-sm ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}>{feature}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleUseTool}
                  className={`relative group overflow-hidden flex-1 py-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg transition-all duration-300 ${
                    theme === 'dark'
                      ? 'bg-gradient-to-r from-electric-blue to-electric-green text-black'
                      : 'bg-gradient-to-r from-accent-red to-accent-blue text-white'
                  }`}
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                  <Zap className="w-5 h-5" />
                  Use This Tool
                  <ExternalLink className="w-5 h-5" />
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
                  onClick={handleShare}
                  className={`px-6 py-4 rounded-xl font-semibold flex items-center justify-center gap-2 border-2 ${
                    theme === 'dark'
                      ? 'border-gray-700 text-gray-300 hover:border-electric-blue hover:text-electric-blue'
                      : 'border-gray-300 text-gray-700 hover:border-accent-red hover:text-accent-red'
                  }`}
                >
                  {copied ? (
                    <>
                      <Check className="w-5 h-5" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-5 h-5" />
                      Share
                    </>
                  )}
                </motion.button>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-6"
          >
            <div className={`p-6 rounded-2xl ${detailCardClass}`}>
              <h3 className={`text-lg font-bold mb-4 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>Quick Info</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${
                    theme === 'dark' ? 'bg-dark-lighter' : 'bg-gray-100'
                  }`}>
                    <Star className={`w-5 h-5 ${
                      theme === 'dark' ? 'text-yellow-400' : 'text-yellow-500'
                    }`} />
                  </div>
                  <div>
                    <p className={`text-sm font-medium ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>Rating</p>
                    <p className={`text-xs ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                    }`}>Highly Rated</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${
                    theme === 'dark' ? 'bg-dark-lighter' : 'bg-gray-100'
                  }`}>
                    <Shield className={`w-5 h-5 ${
                      theme === 'dark' ? 'text-electric-green' : 'text-green-500'
                    }`} />
                  </div>
                  <div>
                    <p className={`text-sm font-medium ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>Verified</p>
                    <p className={`text-xs ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                    }`}>Trusted Tool</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${
                    theme === 'dark' ? 'bg-dark-lighter' : 'bg-gray-100'
                  }`}>
                    <Clock className={`w-5 h-5 ${
                      theme === 'dark' ? 'text-electric-blue' : 'text-blue-500'
                    }`} />
                  </div>
                  <div>
                    <p className={`text-sm font-medium ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>Availability</p>
                    <p className={`text-xs ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                    }`}>24/7 Access</p>
                  </div>
                </div>
              </div>
            </div>

            {relatedTools.length > 0 && (
              <div className={`p-6 rounded-2xl ${detailCardClass}`}>
                <h3 className={`text-lg font-bold mb-4 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>Related Tools</h3>
                <div className="space-y-3">
                  {relatedTools.map((relatedTool) => {
                    const RelatedIcon = getCategoryIcon(relatedTool.category);
                    return (
                      <motion.div
                        key={relatedTool.id}
                        whileHover={{ x: 3 }}
                        onClick={() => navigate(`/ai-tools/tool/${relatedTool.id}`)}
                        className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${
                          theme === 'dark'
                            ? 'bg-dark-lighter hover:bg-gray-700'
                            : 'bg-gray-50 hover:bg-gray-100'
                        }`}
                      >
                        <div className={`p-2 rounded-lg bg-gradient-to-br ${relatedTool.color}`}>
                          <RelatedIcon className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-medium truncate ${
                            theme === 'dark' ? 'text-white' : 'text-gray-900'
                          }`}>{relatedTool.name}</p>
                          <p className={`text-xs ${
                            theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                          }`}>
                            {relatedTool.pricing_type === 'free' ? 'Free' : 'Paid'}
                          </p>
                        </div>
                        <ArrowRight className={`w-4 h-4 ${
                          theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                        }`} />
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>

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
                {/* Icon */}
                <div className={`mx-auto mb-6 w-16 h-16 rounded-2xl flex items-center justify-center ${
                  theme === 'dark'
                    ? 'bg-electric-green/20'
                    : 'bg-accent-red/20'
                }`}>
                  <Lock className={`w-8 h-8 ${
                    theme === 'dark' ? 'text-electric-green' : 'text-accent-red'
                  }`} />
                </div>

                {/* Title */}
                <h2 className={`text-2xl font-bold text-center mb-3 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`} style={{ fontFamily: 'Orbitron, sans-serif' }}>
                  Login Required
                </h2>

                {/* Description */}
                <p className={`text-center mb-6 ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  You need to be logged in to use AI Tools. Sign in to your account to access this feature and explore all available tools.
                </p>

                {/* Benefits List */}
                <div className={`mb-6 p-4 rounded-xl ${
                  theme === 'dark' ? 'bg-dark-lighter' : 'bg-gray-50'
                }`}>
                  <p className={`text-sm font-semibold mb-3 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
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
                        <Check className={`w-4 h-4 flex-shrink-0 ${
                          theme === 'dark' ? 'text-electric-green' : 'text-green-600'
                        }`} />
                        <span className={`text-sm ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          {benefit}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleLogin}
                    className={`relative group overflow-hidden flex-1 py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg transition-all duration-300 ${
                      theme === 'dark'
                        ? 'bg-gradient-to-r from-electric-blue to-electric-green text-black'
                        : 'bg-gradient-to-r from-accent-red to-accent-blue text-white'
                    }`}
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      <Zap className="w-5 h-5" />
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
                      navigate('/academy/signup', { state: { from: { pathname: `/ai-tools/tool/${id}` } } });
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

                {/* Footer Text */}
                <p className={`text-xs text-center mt-4 ${
                  theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                }`}>
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

export default AIToolDetail;
