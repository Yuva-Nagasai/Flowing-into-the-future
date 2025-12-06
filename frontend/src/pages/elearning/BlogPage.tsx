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
import SEO from '../../components/SEO';

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
      summary:
        "Set up n8n from scratch, understand the core building blocks (nodes, triggers and executions) and ship your first real automation in under an hour.",
      tags: ["n8n", "beginners", "workflow"],
      icon: BookOpen,
      readTime: "8 min read",
      color: 'from-blue-500 to-cyan-500',
      image: '/case1.jpg'
    },
    {
      id: 2,
      title: "Top 10 n8n Workflows Every Beginner Should Learn",
      summary:
        "From lead capture to Slack alerts, discover 10 plug‑and‑play workflows that give you immediate productivity gains without writing a single line of code.",
      tags: ["workflows", "productivity", "automation"],
      icon: Zap,
      readTime: "12 min read",
      color: 'from-pink-500 to-rose-500',
      image: '/case2.jpg'
    },
    {
      id: 3,
      title: "How to Connect n8n With Any API",
      summary:
        "Learn a repeatable framework for authenticating, sending requests and handling responses so you can integrate n8n with almost any SaaS or internal API.",
      tags: ["API", "integrations", "n8n"],
      icon: Code,
      readTime: "10 min read",
      color: 'from-amber-500 to-orange-500',
      image: '/case3.jpg'
    },
    {
      id: 4,
      title: "n8n vs Zapier: Which One Should You Choose in 2026?",
      summary:
        "Deep-dive into pricing, flexibility, scalability and developer experience to decide whether n8n or Zapier is the right automation backbone for your team.",
      tags: ["n8n", "zapier", "comparison"],
      icon: Lightbulb,
      readTime: "15 min read",
      color: 'from-purple-500 to-violet-500',
      image: '/case4.jpg'
    },
    {
      id: 5,
      title: "Building AI Agents With n8n and OpenAI",
      summary:
        "Combine OpenAI, memory, tools and conditional logic in n8n to design robust AI agents that can research, decide and execute actions on your behalf.",
      tags: ["AI", "GPT", "n8n"],
      icon: Bot,
      readTime: "14 min read",
      color: 'from-emerald-500 to-green-500',
      image: '/case5.jpg'
    },
    {
      id: 6,
      title: "25 Real-Life Automation Ideas for Students & Professionals",
      summary:
        "Steal 25 battle‑tested automation ideas for resumes, client delivery, habit tracking, learning, side‑projects and more—each mapped to a concrete n8n workflow.",
      tags: ["automation ideas", "productivity"],
      icon: Lightbulb,
      readTime: "18 min read",
      color: 'from-sky-500 to-blue-600',
      image: '/case6.jpg'
    },
    {
      id: 7,
      title: "How to Use Webhooks in n8n Like a Pro",
      summary:
        "Master inbound and outbound webhooks, security best practices and performance tips so your n8n workflows can react to events in real time.",
      tags: ["webhooks", "triggers", "n8n"],
      icon: Webhook,
      readTime: "11 min read",
      color: 'from-indigo-500 to-blue-700',
      image: '/case7.jpg'
    },
    {
      id: 8,
      title: "Fixing Common Errors in n8n (2026 Edition)",
      summary:
        "Troubleshoot failed executions, rate‑limits, OAuth issues and timeouts with a clear checklist you can use whenever a workflow suddenly breaks.",
      tags: ["troubleshooting", "error fixes"],
      icon: AlertTriangle,
      readTime: "9 min read",
      color: 'from-red-500 to-orange-500',
      image: '/image8.png'
    },
    {
      id: 9,
      title: "Automating Social Media With n8n",
      summary:
        "Design an end‑to‑end content pipeline that drafts, approves, schedules and republishes your posts across multiple platforms using n8n.",
      tags: ["social media", "automation"],
      icon: Share2,
      readTime: "13 min read",
      color: 'from-fuchsia-500 to-pink-500',
      image: '/image9.png'
    },
    {
      id: 10,
      title: "The Complete Guide to n8n Cloud vs Self-Hosted",
      summary:
        "Compare cost, security, maintenance and scaling trade‑offs between n8n Cloud and self‑hosting so you can make a confident long‑term decision.",
      tags: ["n8n cloud", "hosting"],
      icon: Cloud,
      readTime: "16 min read",
      color: 'from-teal-500 to-cyan-500',
      image: '/image10.png'
    }
  ];

  return (
    <>
      <SEO
        title="Blog | NanoFlows Academy"
        description="Expert insights, tutorials, and articles on automation, workflow building, integrations, and AI-powered productivity."
        keywords="academy blog, e-learning blog, automation tutorials, workflow guides, AI productivity"
      />
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
              <span className={`bg-gradient-to-r ${
                theme === 'dark'
                  ? 'from-electric-green to-electric-blue'
                  : 'from-accent-red to-accent-blue'
              } bg-clip-text text-transparent`}>
                Blog
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
            <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
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
              Share your n8n knowledge with our community. Submit your article ideas and become a guest author.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/elearning/contact')}
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

      <Footer variant="elearning" />
      </div>
    </>
  );
};

export default BlogPage;
