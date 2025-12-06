import { motion } from 'framer-motion';
import { 
  Gift, 
  Download,
  FileText,
  Workflow,
  CheckCircle,
  BookOpen,
  Zap,
  Star,
  Users,
  Sparkles,
  Mail,
  Calendar,
  Database,
  MessageSquare,
  Share2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import ELearningNav from '../../components/elearning/ELearningNav';
import Footer from '../../components/Footer';
import SEO from '../../components/SEO';

const FreebiesPage = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();

  const overview = {
    title: "FREEBIES — n8n Starter Kit",
    subtitle: "Free Resources",
    description: "Jumpstart your automation journey with our carefully curated collection of free resources. Get workflow templates, beginner guides, and essential tools to start building automations right away.",
    highlights: [
      "100% Free forever",
      "No credit card required",
      "Instant download access",
      "Perfect for beginners"
    ]
  };

  const downloadableFreebies = [
    {
      icon: Workflow,
      title: "n8n Quick Start Guide",
      description: "A comprehensive PDF guide to get you from zero to your first working automation in under an hour.",
      format: "PDF",
      pages: "25 pages",
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: FileText,
      title: "Automation Ideas Checklist",
      description: "100+ automation ideas organized by category to inspire your next project.",
      format: "PDF",
      pages: "15 pages",
      color: 'from-pink-500 to-rose-500'
    },
    {
      icon: BookOpen,
      title: "n8n Node Reference Card",
      description: "A handy reference sheet with all essential nodes and their use cases.",
      format: "PDF",
      pages: "2 pages",
      color: 'from-purple-500 to-violet-500'
    },
    {
      icon: Zap,
      title: "Troubleshooting Flowchart",
      description: "Visual guide to debugging common n8n issues and errors.",
      format: "PDF",
      pages: "1 page",
      color: 'from-amber-500 to-orange-500'
    },
    {
      icon: Star,
      title: "Best Practices Handbook",
      description: "Pro tips and patterns for building maintainable, efficient workflows.",
      format: "PDF",
      pages: "20 pages",
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: Database,
      title: "API Integration Cheatsheet",
      description: "Common API patterns and authentication methods explained simply.",
      format: "PDF",
      pages: "10 pages",
      color: 'from-indigo-500 to-blue-500'
    }
  ];

  const workflowTemplates = [
    {
      icon: Mail,
      title: "Email Automation Starter",
      description: "Send automated welcome emails when someone fills out a form. Includes Gmail and SMTP versions.",
      difficulty: "Beginner",
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Calendar,
      title: "Calendar Sync Workflow",
      description: "Sync events between Google Calendar and Notion automatically.",
      difficulty: "Beginner",
      color: 'from-pink-500 to-rose-500'
    },
    {
      icon: MessageSquare,
      title: "Slack Notification Bot",
      description: "Get Slack alerts when important events happen in your apps.",
      difficulty: "Beginner",
      color: 'from-purple-500 to-violet-500'
    },
    {
      icon: Database,
      title: "Google Sheets Data Sync",
      description: "Automatically update Google Sheets with data from various sources.",
      difficulty: "Beginner",
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: Share2,
      title: "Social Media Scheduler",
      description: "Basic social media post scheduler template to get you started.",
      difficulty: "Intermediate",
      color: 'from-amber-500 to-orange-500'
    },
    {
      icon: FileText,
      title: "Form to CRM",
      description: "Capture form submissions and add them as leads in your CRM.",
      difficulty: "Beginner",
      color: 'from-indigo-500 to-blue-500'
    }
  ];

  const guides = [
    {
      title: "Getting Started with n8n",
      description: "Step-by-step setup guide for installing and configuring n8n on any platform.",
      topics: ["Installation options", "First-time setup", "Interface overview", "Creating your first workflow"]
    },
    {
      title: "Understanding Triggers",
      description: "Complete guide to all trigger types and when to use each one.",
      topics: ["Webhook triggers", "Schedule triggers", "Manual triggers", "App-specific triggers"]
    },
    {
      title: "Data Transformation 101",
      description: "Learn how to manipulate data as it flows through your workflows.",
      topics: ["JSON basics", "Expressions", "Function nodes", "Common transformations"]
    },
    {
      title: "Error Handling Guide",
      description: "How to handle errors gracefully and build robust automations.",
      topics: ["Error workflow setup", "Retry strategies", "Fallback logic", "Alert notifications"]
    }
  ];

  const benefits = [
    {
      icon: Zap,
      title: "Start Building Immediately",
      description: "No lengthy learning curve. Our templates and guides get you building real automations from day one.",
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: BookOpen,
      title: "Learn by Example",
      description: "Study working workflow templates to understand how automation logic works in practice.",
      color: 'from-pink-500 to-rose-500'
    },
    {
      icon: Users,
      title: "Join a Growing Community",
      description: "Connect with other beginners and get help when you need it through our free community.",
      color: 'from-purple-500 to-violet-500'
    },
    {
      icon: Star,
      title: "Professional Quality Resources",
      description: "All materials are created by experienced automation professionals, not recycled generic content.",
      color: 'from-amber-500 to-orange-500'
    }
  ];

  const perfectForBeginners = [
    "You have never used any automation tool before",
    "You have heard about n8n but do not know where to start",
    "You want to automate tasks but feel overwhelmed by options",
    "You prefer learning with ready-made examples and templates",
    "You want to explore automation without any financial commitment",
    "You are a student or hobbyist looking to learn new skills"
  ];

  return (
    <>
      <SEO
        title="Freebies | NanoFlows Academy"
        description="Get free n8n resources, templates, and starter kits to kickstart your automation journey."
        keywords="free resources, n8n templates, free automation tools, starter kit, freebies"
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
              <Gift className="w-4 h-4" />
              {overview.subtitle}
            </span>
            
            <h1 className={`text-4xl md:text-6xl font-bold mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              FREEBIES —{' '}
              <span className={`bg-gradient-to-r ${
                theme === 'dark'
                  ? 'from-electric-green to-electric-blue'
                  : 'from-accent-red to-accent-blue'
              } bg-clip-text text-transparent`}>
                n8n Starter Kit
              </span>
            </h1>
            
            <p className={`text-xl mb-8 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              {overview.description}
            </p>
            
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              {overview.highlights.map((highlight, idx) => (
                <span
                  key={idx}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                    theme === 'dark' ? 'bg-dark-lighter text-gray-300' : 'bg-white text-gray-700 shadow-sm'
                  }`}
                >
                  <CheckCircle className={`w-4 h-4 ${theme === 'dark' ? 'text-electric-green' : 'text-accent-red'}`} />
                  {highlight}
                </span>
              ))}
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/academy/signup')}
              className={`relative group overflow-hidden px-8 py-4 rounded-xl font-bold text-lg flex items-center gap-2 mx-auto transition-all duration-300 ${
                theme === 'dark'
                  ? 'bg-gradient-to-r from-electric-green to-electric-blue text-dark-bg'
                  : 'bg-gradient-to-r from-accent-red to-accent-blue text-white'
              }`}
            >
              <span className="relative z-10 flex items-center gap-2">
              <Download className="w-5 h-5" />
              Get Free Access
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

      <section className={`py-20 ${theme === 'dark' ? 'bg-dark-bg' : 'bg-gray-50'}`}>
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Downloadable{' '}
              <span className={`bg-gradient-to-r ${
                theme === 'dark'
                  ? 'from-electric-green to-electric-blue'
                  : 'from-accent-red to-accent-blue'
              } bg-clip-text text-transparent`}>
                Freebies
              </span>
            </h2>
            <p className={`text-lg ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Essential resources to kickstart your automation journey
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {downloadableFreebies.map((freebie, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className={`p-6 rounded-2xl border flex flex-col h-full ${
                  theme === 'dark'
                    ? 'bg-dark-card border-gray-800'
                    : 'bg-white border-gray-200 shadow-md'
                }`}
              >
                <div className="flex items-start justify-between mb-4 flex-shrink-0">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br ${freebie.color}`}>
                    <freebie.icon className="w-6 h-6 text-white" />
                  </div>
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                    theme === 'dark'
                      ? 'bg-electric-green/20 text-electric-green'
                      : 'bg-accent-red/10 text-accent-red'
                  }`}>
                    {freebie.format} - {freebie.pages}
                  </span>
                </div>
                <h3 className={`text-xl font-bold mb-2 min-h-[3rem] line-clamp-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {freebie.title}
                </h3>
                <p className={`flex-grow ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  {freebie.description}
                </p>
              </motion.div>
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
            className="text-center mb-12"
          >
            <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Workflow Templates{' '}
              <span className={`bg-gradient-to-r ${
                theme === 'dark'
                  ? 'from-electric-green to-electric-blue'
                  : 'from-accent-red to-accent-blue'
              } bg-clip-text text-transparent`}>
                Included
              </span>
            </h2>
            <p className={`text-lg ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Ready-to-import templates to start automating instantly
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workflowTemplates.map((template, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className={`p-6 rounded-2xl border ${
                  theme === 'dark'
                    ? 'bg-dark-bg border-gray-800'
                    : 'bg-gradient-to-br from-accent-red/10 to-accent-blue/10 border-accent-red/30'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br ${template.color}`}>
                    <template.icon className="w-6 h-6 text-white" />
                  </div>
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                    template.difficulty === 'Beginner'
                      ? theme === 'dark'
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-green-100 text-green-700'
                      : theme === 'dark'
                        ? 'bg-yellow-500/20 text-yellow-400'
                        : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {template.difficulty}
                  </span>
                </div>
                <h3 className={`text-xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {template.title}
                </h3>
                <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                  {template.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className={`py-20 ${theme === 'dark' ? 'bg-dark-bg' : 'bg-gray-50'}`}>
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Guides{' '}
              <span className={`bg-gradient-to-r ${
                theme === 'dark'
                  ? 'from-electric-green to-electric-blue'
                  : 'from-accent-red to-accent-blue'
              } bg-clip-text text-transparent`}>
                Included
              </span>
            </h2>
            <p className={`text-lg ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Step-by-step guides to master automation fundamentals
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto space-y-6">
            {guides.map((guide, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className={`p-6 rounded-2xl border ${
                  theme === 'dark'
                    ? 'bg-dark-card border-gray-800'
                    : 'bg-gradient-to-br from-accent-red/10 to-accent-blue/10 border-accent-red/30'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg ${
                    theme === 'dark'
                      ? 'bg-gradient-to-br from-electric-green to-electric-blue text-dark-bg'
                      : 'bg-gradient-to-br from-accent-red to-accent-blue text-white'
                  }`}>
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className={`text-xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      {guide.title}
                    </h3>
                    <p className={`mb-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      {guide.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {guide.topics.map((topic, topicIdx) => (
                        <span
                          key={topicIdx}
                          className={`text-xs px-3 py-1 rounded-full ${
                            theme === 'dark'
                              ? 'bg-dark-lighter text-gray-300'
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
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
            className="text-center mb-12"
          >
            <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              <span className={`bg-gradient-to-r ${
                theme === 'dark'
                  ? 'from-electric-green to-electric-blue'
                  : 'from-accent-red to-accent-blue'
              } bg-clip-text text-transparent`}>
                Benefits
              </span>
            </h2>
            <p className={`text-lg ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Why our free starter kit is worth your time
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className={`p-6 rounded-2xl border text-center ${
                  theme === 'dark'
                    ? 'bg-dark-bg border-gray-800'
                    : 'bg-gradient-to-br from-accent-red/10 to-accent-blue/10 border-accent-red/30'
                }`}
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 bg-gradient-to-br ${benefit.color}`}>
                  <benefit.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className={`text-lg font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {benefit.title}
                </h3>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  {benefit.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className={`py-20 ${theme === 'dark' ? 'bg-dark-bg' : 'bg-gray-50'}`}>
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <div className="text-center mb-12">
              <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Perfect for{' '}
                <span className={`bg-gradient-to-r ${
                  theme === 'dark'
                    ? 'from-electric-green to-electric-blue'
                    : 'from-accent-red to-accent-blue'
                } bg-clip-text text-transparent`}>
                  Beginners
                </span>
              </h2>
              <p className={`text-lg ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                This starter kit is made especially for you if...
              </p>
            </div>

            <div className={`p-8 rounded-3xl border ${
              theme === 'dark'
                ? 'bg-dark-card border-gray-800'
                : 'bg-gradient-to-br from-accent-red/10 to-accent-blue/10 border-accent-red/30'
            }`}>
              <div className="space-y-4">
                {perfectForBeginners.map((item, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.05 }}
                    className={`flex items-start gap-3 p-4 rounded-xl ${
                      theme === 'dark' ? 'bg-dark-bg' : 'bg-gray-50'
                    }`}
                  >
                    <Sparkles className={`w-5 h-5 mt-0.5 flex-shrink-0 ${theme === 'dark' ? 'text-electric-green' : 'text-accent-red'}`} />
                    <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                      {item}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
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
            <Gift className={`w-16 h-16 mx-auto mb-6 ${theme === 'dark' ? 'text-electric-green' : 'text-accent-red'}`} />
            <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Get Your Free{' '}
              <span className={`bg-gradient-to-r ${
                theme === 'dark'
                  ? 'from-electric-green to-electric-blue'
                  : 'from-accent-red to-accent-blue'
              } bg-clip-text text-transparent`}>
                Starter Kit Now
              </span>
            </h2>
            <p className={`text-lg mb-8 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              Sign up for free and instantly access all resources. No credit card required.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/academy/signup')}
              className={`relative group overflow-hidden px-8 py-4 rounded-xl font-bold text-lg flex items-center gap-2 mx-auto transition-all duration-300 ${
                theme === 'dark'
                  ? 'bg-gradient-to-r from-electric-green to-electric-blue text-dark-bg'
                  : 'bg-gradient-to-r from-accent-red to-accent-blue text-white'
              }`}
            >
              <span className="relative z-10 flex items-center gap-2">
              <Download className="w-5 h-5" />
              Download Free Starter Kit
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

export default FreebiesPage;
