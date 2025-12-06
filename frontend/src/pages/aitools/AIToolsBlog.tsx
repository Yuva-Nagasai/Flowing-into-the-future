import { motion } from 'framer-motion';
import { 
  BookOpen, 
  Clock, 
  Tag,
  ArrowRight,
  Zap,
  Code,
  Bot,
  Lightbulb,
  Image as ImageIcon,
  Mic,
  Sparkles,
  TrendingUp,
  Share2,
  Brain,
  Rocket
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import AIToolsNav from '../../components/aitools/AIToolsNav';
import Footer from '../../components/Footer';
import SEO from '../../components/SEO';

const AIToolsBlog = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();

  const pageInfo = {
    title: "AI Tools Blog",
    subtitle: "Expert Insights & Guides",
    description: "Discover the latest AI tools, learn best practices, and stay ahead of the curve with expert-written articles on artificial intelligence, automation, and productivity."
  };

  const blogPosts = [
    {
      id: 1,
      title: "The Ultimate Guide to AI Writing Tools in 2025",
      summary:
        "Explore the best AI writing assistants that can help you create compelling content, improve your writing style, and boost productivity. Compare features, pricing, and use cases.",
      tags: ["AI Writing", "Productivity", "Content Creation"],
      icon: BookOpen,
      readTime: "12 min read",
      color: 'from-blue-500 to-cyan-500',
      image: '/case1.jpg'
    },
    {
      id: 2,
      title: "Top 10 AI Image Generation Tools You Need to Know",
      summary:
        "From DALL-E to Midjourney, discover the most powerful AI image generators that are revolutionizing design, marketing, and creative workflows. Learn which tool fits your needs.",
      tags: ["Image Generation", "Design", "AI Art"],
      icon: ImageIcon,
      readTime: "15 min read",
      color: 'from-pink-500 to-rose-500',
      image: '/case2.jpg'
    },
    {
      id: 3,
      title: "How to Choose the Right AI Code Assistant for Your Workflow",
      summary:
        "Compare GitHub Copilot, ChatGPT, and other AI coding tools. Learn how to integrate AI assistants into your development process and maximize your coding efficiency.",
      tags: ["Coding", "Developer Tools", "AI Assistants"],
      icon: Code,
      readTime: "14 min read",
      color: 'from-amber-500 to-orange-500',
      image: '/case3.jpg'
    },
    {
      id: 4,
      title: "AI Voice Cloning: The Future of Audio Content Creation",
      summary:
        "Dive deep into AI voice synthesis tools that can clone voices, generate natural speech, and transform how we create podcasts, audiobooks, and voiceovers.",
      tags: ["Voice AI", "Audio", "Content Creation"],
      icon: Mic,
      readTime: "11 min read",
      color: 'from-purple-500 to-violet-500',
      image: '/case4.jpg'
    },
    {
      id: 5,
      title: "Building Your First AI-Powered Workflow: A Step-by-Step Guide",
      summary:
        "Learn how to combine multiple AI tools to create powerful automation workflows that save time and enhance productivity. Real-world examples and templates included.",
      tags: ["Automation", "Workflows", "Productivity"],
      icon: Zap,
      readTime: "18 min read",
      color: 'from-emerald-500 to-green-500',
      image: '/case5.jpg'
    },
    {
      id: 6,
      title: "The Business Case for AI Tools: ROI and Productivity Metrics",
      summary:
        "Understand how AI tools can transform your business operations. Learn to measure ROI, track productivity gains, and make data-driven decisions about AI adoption.",
      tags: ["Business", "ROI", "Strategy"],
      icon: TrendingUp,
      readTime: "16 min read",
      color: 'from-sky-500 to-blue-600',
      image: '/case6.jpg'
    },
    {
      id: 7,
      title: "Free vs. Paid AI Tools: When to Upgrade Your Plan",
      summary:
        "Navigate the landscape of free and premium AI tools. Discover when free tiers are sufficient and when investing in paid plans delivers real value.",
      tags: ["Pricing", "Comparison", "Value"],
      icon: Lightbulb,
      readTime: "10 min read",
      color: 'from-indigo-500 to-blue-700',
      image: '/case7.jpg'
    },
    {
      id: 8,
      title: "AI Tools for Content Creators: Boost Your Creative Output",
      summary:
        "Discover AI tools specifically designed for content creators. From video editing to social media management, learn how AI can amplify your creative process.",
      tags: ["Content Creation", "Creators", "Social Media"],
      icon: Share2,
      readTime: "13 min read",
      color: 'from-red-500 to-orange-500',
      image: '/image8.png'
    },
    {
      id: 9,
      title: "The Ethics of AI Tools: Privacy, Bias, and Responsible Use",
      summary:
        "Explore the ethical considerations when using AI tools. Learn about data privacy, algorithmic bias, and best practices for responsible AI implementation.",
      tags: ["Ethics", "Privacy", "Responsible AI"],
      icon: Brain,
      readTime: "17 min read",
      color: 'from-fuchsia-500 to-pink-500',
      image: '/image9.png'
    },
    {
      id: 10,
      title: "Getting Started with AI: A Beginner's Roadmap",
      summary:
        "New to AI tools? This comprehensive guide walks you through everything you need to know to get started, from understanding AI basics to choosing your first tools.",
      tags: ["Beginners", "Getting Started", "Tutorial"],
      icon: Rocket,
      readTime: "20 min read",
      color: 'from-teal-500 to-cyan-500',
      image: '/image10.png'
    },
    {
      id: 11,
      title: "AI Tools for Data Analysis: Transform Your Business Intelligence",
      summary:
        "Discover how AI-powered analytics tools can help you extract insights from data faster and more accurately than traditional methods. Case studies and examples included.",
      tags: ["Data Analysis", "Analytics", "Business Intelligence"],
      icon: TrendingUp,
      readTime: "14 min read",
      color: 'from-blue-600 to-indigo-600',
      image: '/case1.jpg'
    },
    {
      id: 12,
      title: "The Future of AI Tools: Trends to Watch in 2025 and Beyond",
      summary:
        "Stay ahead of the curve with insights into emerging AI tool trends. From multimodal AI to agentic systems, explore what's coming next in the AI landscape.",
      tags: ["Future Trends", "Innovation", "Technology"],
      icon: Sparkles,
      readTime: "15 min read",
      color: 'from-violet-500 to-purple-600',
      image: '/case2.jpg'
    }
  ];

  return (
    <>
      <SEO
        title="Blog | NanoFlows AI Tools"
        description="Expert insights, guides, and updates about AI tools, automation, and productivity. Stay informed about the latest in artificial intelligence."
        keywords="AI tools blog, AI insights, automation guides, productivity tips, artificial intelligence news"
      />
      <div className={`min-h-screen w-full max-w-full overflow-x-hidden flex flex-col ${theme === 'dark' ? 'bg-dark-bg' : 'bg-gray-50'}`}>
        <AIToolsNav />
      
      <section className={`relative overflow-hidden pt-32 pb-20 ${theme === 'dark' ? 'bg-gradient-to-b from-dark-card to-dark-bg' : 'bg-gradient-to-b from-white to-gray-50'}`}>
        <div className={`absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-3xl opacity-20 ${
          theme === 'dark' ? 'bg-electric-blue' : 'bg-accent-red'
        }`} />
        
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto text-center"
          >
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-6 ${
                theme === 'dark'
                  ? 'bg-electric-green/20 text-electric-green border border-electric-green/30'
                  : 'bg-accent-red/10 text-accent-red border border-accent-red/30'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              {pageInfo.subtitle}
            </motion.div>
            
            <h1 className={`text-4xl md:text-6xl font-bold mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: 'Orbitron, sans-serif' }}>
              <span className={`bg-gradient-to-r ${
                theme === 'dark'
                  ? 'from-electric-green to-electric-blue'
                  : 'from-accent-red to-accent-blue'
              } bg-clip-text text-transparent`}>
                {pageInfo.title}
              </span>
            </h1>
            
            <p className={`text-xl mb-8 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              {pageInfo.description}
            </p>
          </motion.div>
        </div>
      </section>

      <section className={`py-20 ${theme === 'dark' ? 'bg-dark-bg' : 'bg-gray-50'}`}>
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogPosts.map((post, idx) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className={`group rounded-2xl border cursor-pointer transition-all duration-300 overflow-hidden hover:shadow-xl flex flex-col h-full ${
                  theme === 'dark'
                    ? 'bg-dark-card border-gray-800 hover:border-electric-blue/50'
                    : 'bg-white border-gray-200 hover:border-accent-red/50 shadow-md'
                }`}
              >
                {/* Thumbnail image */}
                {post.image && (
                  <div className="relative h-40 md:h-44 w-full overflow-hidden">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                    <div className="absolute top-3 left-3 flex items-center gap-2">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br ${post.color} shadow-lg`}>
                        <post.icon className="w-5 h-5 text-white" />
                      </div>
                    </div>
                    <span className={`absolute top-3 right-3 inline-flex items-center gap-1 text-[11px] px-2 py-1 rounded-full backdrop-blur-sm ${
                      theme === 'dark'
                        ? 'bg-black/60 text-gray-200'
                        : 'bg-white/80 text-gray-800'
                    }`}>
                      <Clock className="w-3 h-3" />
                      {post.readTime}
                    </span>
                  </div>
                )}

                <div className="p-6 flex flex-col flex-1">
                  <h3
                    className={`text-xl font-bold mb-3 transition-colors line-clamp-2 min-h-[3.5rem] ${
                      theme === 'dark'
                        ? 'text-white group-hover:text-electric-green'
                        : 'text-gray-900 group-hover:text-accent-red'
                    }`}
                    style={{ fontFamily: 'Orbitron, sans-serif' }}
                  >
                    {post.title}
                  </h3>

                  <p
                    className={`mb-4 text-sm leading-relaxed line-clamp-3 min-h-[4.5rem] flex-shrink-0 ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}
                  >
                    {post.summary}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4 min-h-[2rem] flex-shrink-0">
                    {post.tags.map((tag, tagIdx) => (
                      <span
                        key={tagIdx}
                        className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full ${
                          theme === 'dark'
                            ? 'bg-dark-lighter text-gray-400 border border-gray-700'
                            : 'bg-gray-100 text-gray-600 border border-gray-200'
                        }`}
                      >
                        <Tag className="w-3 h-3" />
                        {tag}
                      </span>
                    ))}
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className={`relative group overflow-hidden mt-auto w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${
                      theme === 'dark'
                        ? 'bg-gradient-to-r from-electric-green to-electric-blue text-dark-bg hover:shadow-md hover:shadow-electric-blue/25'
                        : 'bg-gradient-to-r from-accent-red to-accent-blue text-white hover:shadow-md hover:shadow-accent-red/25'
                    }`}
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      Read More
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
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
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className={`py-20 ${theme === 'dark' ? 'bg-dark-card' : 'bg-white'}`}>
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={`max-w-3xl mx-auto text-center p-12 rounded-3xl ${
              theme === 'dark'
                ? 'bg-gradient-to-br from-electric-blue/20 to-electric-green/20 border border-electric-blue/30'
                : 'bg-gradient-to-br from-accent-red/10 to-accent-blue/10 border border-accent-red/30'
            }`}
          >
            <Sparkles className={`w-12 h-12 mx-auto mb-6 ${
              theme === 'dark' ? 'text-electric-green' : 'text-accent-red'
            }`} />
            <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: 'Orbitron, sans-serif' }}>
              Want to{' '}
              <span className={`bg-gradient-to-r ${
                theme === 'dark'
                  ? 'from-electric-green to-electric-blue'
                  : 'from-accent-red to-accent-blue'
              } bg-clip-text text-transparent`}>
                Contribute?
              </span>
            </h2>
            <p className={`text-lg mb-8 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              Share your AI tools expertise with our community. Submit your article ideas and become a guest author on our blog.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/ai-tools/contact')}
              className={`relative group overflow-hidden px-8 py-4 rounded-xl font-bold text-lg flex items-center gap-2 mx-auto transition-all duration-300 ${
                theme === 'dark'
                  ? 'bg-gradient-to-r from-electric-green to-electric-blue text-dark-bg'
                  : 'bg-gradient-to-r from-accent-red to-accent-blue text-white'
              }`}
            >
              <span className="relative z-10 flex items-center gap-2">
                Submit Article Idea
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
          </motion.div>
        </div>
      </section>

      <Footer variant="ai-tools" />
      </div>
    </>
  );
};

export default AIToolsBlog;

