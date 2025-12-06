import { motion } from 'framer-motion';
import { 
  Clock,
  Target,
  CheckCircle,
  Users,
  Zap,
  Award,
  ArrowRight,
  MessageCircle,
  Trophy,
  FileText,
  Shield,
  Star,
  Globe
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import ELearningNav from '../../components/elearning/ELearningNav';
import Footer from '../../components/Footer';
import SEO from '../../components/SEO';

const MahakumbhPage = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();

  const overview = {
    title: "Summit — n8n Intensive Program",
    subtitle: "10 Days of Deep Learning",
    description: "The most comprehensive n8n training program available. Dive deep into advanced automation concepts, build enterprise-grade workflows, and become a certified n8n expert ready for any challenge.",
    highlights: [
      "10 intensive sessions",
      "Advanced automation techniques",
      "Enterprise-level projects",
      "Lifetime community access"
    ]
  };

  const features = [
    {
      icon: Clock,
      title: "10 Comprehensive Sessions",
      description: "Extended learning covering everything from basics to advanced enterprise automation",
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Target,
      title: "Advanced Project Building",
      description: "Build 10+ real-world automation projects for your portfolio",
      color: 'from-pink-500 to-rose-500'
    },
    {
      icon: Users,
      title: "1-on-1 Mentorship",
      description: "Personal guidance from certified n8n experts",
      color: 'from-purple-500 to-violet-500'
    },
    {
      icon: Zap,
      title: "Live Coding Sessions",
      description: "Watch experts build complex workflows in real-time",
      color: 'from-amber-500 to-orange-500'
    },
    {
      icon: Globe,
      title: "API & Integration Mastery",
      description: "Master connecting any application through APIs",
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Learn best practices for secure, production-ready automations",
      color: 'from-indigo-500 to-blue-500'
    }
  ];

  const sessions = [
    {
      session: "Session 1",
      title: "Automation Fundamentals",
      topics: [
        "Understanding the automation landscape",
        "n8n architecture and design philosophy",
        "Setting up a professional development environment",
        "Node types, triggers, and execution flow",
        "Building your first 5 automations"
      ]
    },
    {
      session: "Session 2",
      title: "Data Mastery",
      topics: [
        "Working with different data formats (JSON, XML, CSV)",
        "Data transformation with expressions",
        "Advanced Function node techniques",
        "Data validation and sanitization",
        "Handling complex nested data structures"
      ]
    },
    {
      session: "Session 3",
      title: "Integration Deep Dive",
      topics: [
        "Google Workspace automation suite",
        "Microsoft 365 integrations",
        "Slack and team communication tools",
        "CRM systems (HubSpot, Salesforce, Zoho)",
        "Building custom integrations"
      ]
    },
    {
      session: "Session 4",
      title: "API Mastery",
      topics: [
        "Understanding REST and GraphQL APIs",
        "Authentication methods (OAuth, API keys, JWT)",
        "Making HTTP requests with custom headers",
        "Handling pagination and rate limits",
        "Building API-first workflows"
      ]
    },
    {
      session: "Session 5",
      title: "Advanced Logic & Flow Control",
      topics: [
        "Complex conditional branching strategies",
        "Parallel execution and merge patterns",
        "Subworkflows and workflow chaining",
        "Recursive workflows and loops",
        "State management in workflows"
      ]
    },
    {
      session: "Session 6",
      title: "Database & Storage",
      topics: [
        "SQL database operations (MySQL, PostgreSQL)",
        "NoSQL databases (MongoDB, Firebase)",
        "Cloud storage integrations (S3, Google Cloud)",
        "Data backup and sync workflows",
        "Building data pipelines"
      ]
    },
    {
      session: "Session 7",
      title: "Error Handling & Monitoring",
      topics: [
        "Advanced error handling patterns",
        "Retry strategies and fallback logic",
        "Workflow monitoring and alerting",
        "Logging and debugging best practices",
        "Building self-healing workflows"
      ]
    },
    {
      session: "Session 8",
      title: "AI & Automation",
      topics: [
        "Integrating OpenAI and GPT models",
        "Building AI-powered content generators",
        "Automated document processing",
        "Chatbot and conversational AI workflows",
        "Sentiment analysis and text processing"
      ]
    },
    {
      session: "Session 9",
      title: "Enterprise Solutions",
      topics: [
        "Designing scalable automation architecture",
        "Version control and deployment strategies",
        "Team collaboration best practices",
        "Security and compliance considerations",
        "Performance optimization at scale"
      ]
    },
    {
      session: "Session 10",
      title: "Capstone & Certification",
      topics: [
        "Full enterprise project implementation",
        "Code review and optimization session",
        "Portfolio presentation",
        "Final certification exam",
        "Career guidance and next steps"
      ]
    }
  ];

  const extraBenefits = [
    {
      icon: MessageCircle,
      title: "Private Community Access",
      description: "Join our exclusive Slack/Discord community of n8n professionals. Network, share ideas, get help, and collaborate on projects with fellow automation experts.",
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Trophy,
      title: "Monthly Hackathon",
      description: "Participate in monthly automation hackathons with prizes. Build innovative solutions, showcase your skills, and win recognition from the community.",
      color: 'from-amber-500 to-yellow-500'
    },
    {
      icon: FileText,
      title: "50+ Premium Templates",
      description: "Get instant access to our library of battle-tested workflow templates. Save hours of development time with ready-to-use solutions for common automation tasks.",
      color: 'from-purple-500 to-violet-500'
    },
    {
      icon: Users,
      title: "Peer Study Groups",
      description: "Form study groups with fellow learners. Weekly group sessions for project reviews, brainstorming, and collaborative learning.",
      color: 'from-pink-500 to-rose-500'
    },
    {
      icon: Star,
      title: "Guest Expert Sessions",
      description: "Exclusive webinars with industry experts sharing real-world automation success stories and advanced techniques.",
      color: 'from-orange-500 to-red-500'
    },
    {
      icon: Globe,
      title: "Job Board Access",
      description: "Exclusive access to automation job opportunities shared directly by our partner companies looking for certified n8n professionals.",
      color: 'from-green-500 to-emerald-500'
    }
  ];

  const certificateDetails = {
    title: "Certified n8n Automation Expert",
    features: [
      "Globally recognized certification",
      "Digital badge for LinkedIn and portfolios",
      "Physical certificate delivered to your address",
      "Verification portal for employers",
      "Valid for lifetime with your unique credential ID",
      "Access to certified professionals directory"
    ]
  };

  return (
    <>
      <SEO
        title="Summit | NanoFlows Academy"
        description="Join our 10-day n8n intensive program. The most comprehensive n8n training to become a certified expert."
        keywords="summit, n8n intensive, advanced automation, n8n certification, enterprise automation"
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
              <Trophy className="w-4 h-4" />
              {overview.subtitle}
            </span>
            
            <h1 className={`text-4xl md:text-6xl font-bold mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Summit —{' '}
              <span className={`bg-gradient-to-r ${
                theme === 'dark'
                  ? 'from-electric-green to-electric-blue'
                  : 'from-accent-red to-accent-blue'
              } bg-clip-text text-transparent`}>
                n8n Intensive Program
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
                Join Summit
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

      <section className={`py-20 ${theme === 'dark' ? 'bg-dark-bg' : 'bg-gray-50'}`}>
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Program{' '}
              <span className={`bg-gradient-to-r ${
                theme === 'dark'
                  ? 'from-electric-green to-electric-blue'
                  : 'from-accent-red to-accent-blue'
              } bg-clip-text text-transparent`}>
                Features
              </span>
            </h2>
            <p className={`text-lg ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Everything included in your 10-day intensive journey
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className={`p-6 rounded-2xl border ${
                  theme === 'dark'
                    ? 'bg-dark-card border-gray-800'
                    : 'bg-gradient-to-br from-accent-red/10 to-accent-blue/10 border-accent-red/30'
                }`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 bg-gradient-to-br ${feature.color}`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className={`text-xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {feature.title}
                </h3>
                <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                  {feature.description}
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
              Session-wise{' '}
              <span className={`bg-gradient-to-r ${
                theme === 'dark'
                  ? 'from-electric-green to-electric-blue'
                  : 'from-accent-red to-accent-blue'
              } bg-clip-text text-transparent`}>
                Breakdown
              </span>
            </h2>
            <p className={`text-lg ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Your complete roadmap from beginner to certified expert
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto space-y-6">
            {sessions.map((session, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                className={`p-6 rounded-2xl border ${
                  theme === 'dark'
                    ? 'bg-dark-bg border-gray-800'
                    : 'bg-gradient-to-br from-accent-red/10 to-accent-blue/10 border-accent-red/30'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`flex-shrink-0 w-20 h-16 rounded-xl flex flex-col items-center justify-center font-bold ${
                    theme === 'dark'
                      ? 'bg-gradient-to-br from-electric-green to-electric-blue text-dark-bg'
                      : 'bg-gradient-to-br from-accent-red to-accent-blue text-white'
                  }`}>
                    <span className="text-xs">{session.session}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className={`text-xl font-bold mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      {session.title}
                    </h3>
                    <ul className="space-y-2">
                      {session.topics.map((topic, topicIdx) => (
                        <li key={topicIdx} className={`flex items-start gap-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                          <CheckCircle className={`w-4 h-4 mt-1 flex-shrink-0 ${theme === 'dark' ? 'text-electric-green' : 'text-accent-red'}`} />
                          {topic}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
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
              Extra{' '}
              <span className={`bg-gradient-to-r ${
                theme === 'dark'
                  ? 'from-electric-green to-electric-blue'
                  : 'from-accent-red to-accent-blue'
              } bg-clip-text text-transparent`}>
                Benefits
              </span>
            </h2>
            <p className={`text-lg ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Beyond the curriculum, you get exclusive perks
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {extraBenefits.map((benefit, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className={`p-6 rounded-2xl border ${
                  theme === 'dark'
                    ? 'bg-dark-card border-gray-800'
                    : 'bg-gradient-to-br from-accent-red/10 to-accent-blue/10 border-accent-red/30'
                }`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 bg-gradient-to-br ${benefit.color}`}>
                  <benefit.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className={`text-xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {benefit.title}
                </h3>
                <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                  {benefit.description}
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
            className="max-w-3xl mx-auto"
          >
            <div className="text-center mb-12">
              <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Certificate{' '}
                <span className={`bg-gradient-to-r ${
                  theme === 'dark'
                    ? 'from-electric-green to-electric-blue'
                    : 'from-accent-red to-accent-blue'
                } bg-clip-text text-transparent`}>
                  Details
                </span>
              </h2>
              <p className={`text-lg ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Earn a globally recognized certification
              </p>
            </div>

            <div className={`p-8 rounded-3xl border text-center ${
              theme === 'dark'
                ? 'bg-dark-card border-gray-800'
                : 'bg-gradient-to-br from-accent-red/5 to-accent-blue/5 border-accent-red/30'
            }`}>
              <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 ${
                theme === 'dark'
                  ? 'bg-gradient-to-br from-electric-green to-electric-blue'
                  : 'bg-gradient-to-br from-accent-red to-accent-blue'
              }`}>
                <Award className="w-10 h-10 text-white" />
              </div>
              
              <h3 className={`text-2xl font-bold mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {certificateDetails.title}
              </h3>
              
              <div className="grid sm:grid-cols-2 gap-4">
                {certificateDetails.features.map((feature, idx) => (
                  <div
                    key={idx}
                    className={`flex items-center gap-3 p-4 rounded-xl ${
                      theme === 'dark' ? 'bg-dark-bg' : 'bg-white shadow-sm'
                    }`}
                  >
                    <CheckCircle className={`w-5 h-5 flex-shrink-0 ${theme === 'dark' ? 'text-electric-green' : 'text-accent-red'}`} />
                    <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className={`py-20 ${theme === 'dark' ? 'bg-dark-bg' : 'bg-gray-50'}`}>
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
              Ready for the Ultimate{' '}
              <span className={`bg-gradient-to-r ${
                theme === 'dark'
                  ? 'from-electric-green to-electric-blue'
                  : 'from-accent-red to-accent-blue'
              } bg-clip-text text-transparent`}>
                n8n Journey?
              </span>
            </h2>
            <p className={`text-lg mb-8 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              Join the Summit and become a certified n8n expert in just 10 days.
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
                Enroll in Summit
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

export default MahakumbhPage;
