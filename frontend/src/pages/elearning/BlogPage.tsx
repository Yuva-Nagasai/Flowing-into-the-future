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
  Webhook,
  AlertTriangle,
  Share2,
  Cloud
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import ELearningNav from '../../components/elearning/ELearningNav';
import Footer from '../../components/Footer';

const BlogPage = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();

  const pageInfo = {
    title: "Blog",
    subtitle: "Expert Insights & Tutorials",
    description: "Expert-written articles on n8n automation, workflow building, integrations, no-code systems, and AI-powered productivity."
  };

  const blogPosts = [
    {
      id: 1,
      title: "Getting Started With n8n: A Beginner's Guide",
      summary: "Learn to build your first automation workflow easily.",
      tags: ["n8n", "beginners", "workflow"],
      icon: BookOpen,
      readTime: "8 min read"
    },
    {
      id: 2,
      title: "Top 10 n8n Workflows Every Beginner Should Learn",
      summary: "Essential workflows to boost productivity fast.",
      tags: ["workflows", "productivity", "automation"],
      icon: Zap,
      readTime: "12 min read"
    },
    {
      id: 3,
      title: "How to Connect n8n With Any API",
      summary: "A simple guide to using API nodes and headers.",
      tags: ["API", "integrations", "n8n"],
      icon: Code,
      readTime: "10 min read"
    },
    {
      id: 4,
      title: "n8n vs Zapier: Which One Should You Choose in 2026?",
      summary: "Detailed comparison of major automation tools.",
      tags: ["n8n", "zapier", "comparison"],
      icon: Lightbulb,
      readTime: "15 min read"
    },
    {
      id: 5,
      title: "Building AI Agents With n8n and OpenAI",
      summary: "Create GPT-powered automation systems.",
      tags: ["AI", "GPT", "n8n"],
      icon: Bot,
      readTime: "14 min read"
    },
    {
      id: 6,
      title: "25 Real-Life Automation Ideas for Students & Professionals",
      summary: "Practical workflow ideas ready to implement.",
      tags: ["automation ideas", "productivity"],
      icon: Lightbulb,
      readTime: "18 min read"
    },
    {
      id: 7,
      title: "How to Use Webhooks in n8n Like a Pro",
      summary: "Trigger workflows using webhooks efficiently.",
      tags: ["webhooks", "triggers", "n8n"],
      icon: Webhook,
      readTime: "11 min read"
    },
    {
      id: 8,
      title: "Fixing Common Errors in n8n (2026 Edition)",
      summary: "Solutions to the most common n8n issues.",
      tags: ["troubleshooting", "error fixes"],
      icon: AlertTriangle,
      readTime: "9 min read"
    },
    {
      id: 9,
      title: "Automating Social Media With n8n",
      summary: "Build automated posting & scheduling workflows.",
      tags: ["social media", "automation"],
      icon: Share2,
      readTime: "13 min read"
    },
    {
      id: 10,
      title: "The Complete Guide to n8n Cloud vs Self-Hosted",
      summary: "Understand hosting types and features.",
      tags: ["n8n cloud", "hosting"],
      icon: Cloud,
      readTime: "16 min read"
    }
  ];

  return (
    <div className={`min-h-screen transition-colors duration-300 ${theme === 'dark' ? 'bg-dark-bg' : 'bg-gray-50'}`}>
      <ELearningNav />
      
      <section className={`pt-32 pb-20 ${theme === 'dark' ? 'bg-gradient-to-b from-dark-card to-dark-bg' : 'bg-gradient-to-b from-white to-gray-50'}`}>
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto text-center"
          >
            <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-6 ${
              theme === 'dark'
                ? 'bg-electric-green/20 text-electric-green border border-electric-green/30'
                : 'bg-accent-red/10 text-accent-red border border-accent-red/30'
            }`}>
              <BookOpen className="w-4 h-4" />
              {pageInfo.subtitle}
            </span>
            
            <h1 className={`text-4xl md:text-6xl font-bold mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              {pageInfo.title}
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
                className={`group p-6 rounded-2xl border cursor-pointer transition-all duration-300 hover:shadow-xl ${
                  theme === 'dark'
                    ? 'bg-dark-card border-gray-800 hover:border-electric-blue/50'
                    : 'bg-white border-gray-200 hover:border-accent-blue/50'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    theme === 'dark'
                      ? 'bg-electric-blue/20 text-electric-blue'
                      : 'bg-accent-blue/10 text-accent-blue'
                  }`}>
                    <post.icon className="w-6 h-6" />
                  </div>
                  <span className={`flex items-center gap-1 text-xs ${
                    theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                  }`}>
                    <Clock className="w-3 h-3" />
                    {post.readTime}
                  </span>
                </div>
                
                <h3 className={`text-xl font-bold mb-3 group-hover:${theme === 'dark' ? 'text-electric-green' : 'text-accent-red'} transition-colors ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  {post.title}
                </h3>
                
                <p className={`mb-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  {post.summary}
                </p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {post.tags.map((tag, tagIdx) => (
                    <span
                      key={tagIdx}
                      className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full ${
                        theme === 'dark'
                          ? 'bg-dark-lighter text-gray-400'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      <Tag className="w-3 h-3" />
                      {tag}
                    </span>
                  ))}
                </div>
                
                <div className={`flex items-center gap-2 text-sm font-medium ${
                  theme === 'dark' ? 'text-electric-green' : 'text-accent-red'
                }`}>
                  Read More
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
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
            <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Want to Contribute?
            </h2>
            <p className={`text-lg mb-8 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              Share your n8n knowledge with our community. Submit your article ideas and become a guest author.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/elearning/contact')}
              className={`px-8 py-4 rounded-xl font-bold text-lg flex items-center gap-2 mx-auto ${
                theme === 'dark'
                  ? 'bg-gradient-to-r from-electric-green to-electric-blue text-dark-bg'
                  : 'bg-gradient-to-r from-accent-red to-accent-blue text-white'
              }`}
            >
              Submit Article Idea
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default BlogPage;
