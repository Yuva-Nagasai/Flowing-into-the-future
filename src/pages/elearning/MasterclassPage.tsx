import { motion } from 'framer-motion';
import { 
  GraduationCap, 
  Calendar,
  Clock,
  Target,
  CheckCircle,
  Users,
  Zap,
  Award,
  BookOpen,
  ArrowRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import ELearningNav from '../../components/elearning/ELearningNav';
import Footer from '../../components/Footer';

const MasterclassPage = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();

  const overview = {
    title: "MASTERCLASS — n8n Automation",
    subtitle: "5-Day Bootcamp",
    description: "Transform your workflow automation skills in just 5 intensive days. This comprehensive bootcamp takes you from complete beginner to confident n8n user, ready to build powerful automations for any business need.",
    highlights: [
      "Live instructor-led sessions",
      "Hands-on practical exercises",
      "Real-world automation projects",
      "Certificate of completion"
    ]
  };

  const features = [
    {
      icon: Clock,
      title: "5 Days of Intensive Learning",
      description: "Focused, structured curriculum designed for maximum knowledge retention"
    },
    {
      icon: Target,
      title: "Practical Hands-On Approach",
      description: "Build real automations from day one, not just theory"
    },
    {
      icon: Users,
      title: "Small Batch Sizes",
      description: "Personalized attention with limited seats per batch"
    },
    {
      icon: Zap,
      title: "Live Doubt Sessions",
      description: "Get your questions answered in real-time by experts"
    },
    {
      icon: BookOpen,
      title: "Comprehensive Resources",
      description: "Access to recordings, templates, and reference materials"
    },
    {
      icon: Award,
      title: "Completion Certificate",
      description: "Industry-recognized certificate upon successful completion"
    }
  ];

  const syllabus = [
    {
      day: "Day 1",
      title: "Foundation & Setup",
      topics: [
        "Introduction to workflow automation and its business impact",
        "Understanding n8n interface and core concepts",
        "Setting up your n8n environment",
        "Your first automation: Simple data transfer between apps",
        "Understanding nodes, triggers, and connections"
      ]
    },
    {
      day: "Day 2",
      title: "Core Building Blocks",
      topics: [
        "Deep dive into trigger nodes (webhooks, schedules, manual)",
        "Working with popular integrations (Google Sheets, Slack, Email)",
        "Data transformation and manipulation",
        "Using the Function node for custom logic",
        "Error handling basics"
      ]
    },
    {
      day: "Day 3",
      title: "Advanced Workflows",
      topics: [
        "Conditional logic with IF nodes and Switch nodes",
        "Looping and iteration techniques",
        "Working with APIs and HTTP requests",
        "Data merging and splitting strategies",
        "Building multi-step complex workflows"
      ]
    },
    {
      day: "Day 4",
      title: "Real-World Projects",
      topics: [
        "Project 1: Automated lead capture and CRM integration",
        "Project 2: Social media content scheduler",
        "Project 3: Email automation and follow-up sequences",
        "Debugging and troubleshooting workflows",
        "Performance optimization tips"
      ]
    },
    {
      day: "Day 5",
      title: "Mastery & Certification",
      topics: [
        "Advanced error handling and recovery strategies",
        "Workflow version control and best practices",
        "Building reusable workflow templates",
        "Final capstone project",
        "Certification exam and completion"
      ]
    }
  ];

  const learningOutcomes = [
    "Build complete workflow automations from scratch with confidence",
    "Connect and integrate multiple applications seamlessly",
    "Handle data transformation and complex logic flows",
    "Debug and optimize workflows for production use",
    "Create reusable templates for common automation tasks",
    "Understand automation best practices and design patterns",
    "Apply n8n to solve real business problems",
    "Earn an industry-recognized certification"
  ];

  const whoIsThisFor = [
    {
      title: "Beginners",
      description: "No coding or automation experience required. Start from zero and build your skills step by step."
    },
    {
      title: "Business Professionals",
      description: "Looking to automate repetitive tasks and boost productivity in your daily work."
    },
    {
      title: "Entrepreneurs & Startups",
      description: "Want to build efficient systems without hiring developers."
    },
    {
      title: "Freelancers",
      description: "Add automation services to your offerings and increase your earning potential."
    },
    {
      title: "Marketers & Sales Teams",
      description: "Automate lead generation, follow-ups, and reporting."
    },
    {
      title: "Career Changers",
      description: "Looking to enter the growing field of automation and workflow optimization."
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
              <GraduationCap className="w-4 h-4" />
              {overview.subtitle}
            </span>
            
            <h1 className={`text-4xl md:text-6xl font-bold mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              {overview.title}
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
              className={`px-8 py-4 rounded-xl font-bold text-lg flex items-center gap-2 mx-auto ${
                theme === 'dark'
                  ? 'bg-gradient-to-r from-electric-green to-electric-blue text-dark-bg'
                  : 'bg-gradient-to-r from-accent-red to-accent-blue text-white'
              }`}
            >
              Enroll Now
              <ArrowRight className="w-5 h-5" />
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
              Full Feature List
            </h2>
            <p className={`text-lg ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Everything included in your 5-day bootcamp experience
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
                    : 'bg-white border-gray-200'
                }`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                  theme === 'dark'
                    ? 'bg-electric-blue/20 text-electric-blue'
                    : 'bg-accent-blue/10 text-accent-blue'
                }`}>
                  <feature.icon className="w-6 h-6" />
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
              Day-by-Day Syllabus
            </h2>
            <p className={`text-lg ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Your structured path from beginner to automation expert
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto space-y-6">
            {syllabus.map((day, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className={`p-6 rounded-2xl border ${
                  theme === 'dark'
                    ? 'bg-dark-bg border-gray-800'
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`flex-shrink-0 w-16 h-16 rounded-xl flex flex-col items-center justify-center font-bold ${
                    theme === 'dark'
                      ? 'bg-gradient-to-br from-electric-green to-electric-blue text-dark-bg'
                      : 'bg-gradient-to-br from-accent-red to-accent-blue text-white'
                  }`}>
                    <Calendar className="w-5 h-5" />
                    <span className="text-xs">{day.day}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className={`text-xl font-bold mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      {day.title}
                    </h3>
                    <ul className="space-y-2">
                      {day.topics.map((topic, topicIdx) => (
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
              Learning Outcomes
            </h2>
            <p className={`text-lg ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              What you will achieve by the end of this bootcamp
            </p>
          </motion.div>

          <div className="max-w-3xl mx-auto">
            <div className="grid md:grid-cols-2 gap-4">
              {learningOutcomes.map((outcome, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.05 }}
                  className={`flex items-start gap-3 p-4 rounded-xl ${
                    theme === 'dark' ? 'bg-dark-card' : 'bg-white shadow-sm'
                  }`}
                >
                  <CheckCircle className={`w-5 h-5 mt-0.5 flex-shrink-0 ${theme === 'dark' ? 'text-electric-green' : 'text-accent-red'}`} />
                  <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                    {outcome}
                  </span>
                </motion.div>
              ))}
            </div>
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
              Who This Is For
            </h2>
            <p className={`text-lg ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              This bootcamp is perfect for you if you are...
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {whoIsThisFor.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className={`p-6 rounded-2xl border text-center ${
                  theme === 'dark'
                    ? 'bg-dark-bg border-gray-800'
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 ${
                  theme === 'dark'
                    ? 'bg-electric-green/20 text-electric-green'
                    : 'bg-accent-red/10 text-accent-red'
                }`}>
                  <Users className="w-6 h-6" />
                </div>
                <h3 className={`text-lg font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {item.title}
                </h3>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  {item.description}
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
            className={`max-w-3xl mx-auto text-center p-12 rounded-3xl ${
              theme === 'dark'
                ? 'bg-gradient-to-br from-electric-blue/20 to-electric-green/20 border border-electric-blue/30'
                : 'bg-gradient-to-br from-accent-red/10 to-accent-blue/10 border border-accent-red/30'
            }`}
          >
            <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Ready to Master n8n Automation?
            </h2>
            <p className={`text-lg mb-8 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              Join our next batch and transform your workflow automation skills in just 5 days.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/academy/signup')}
              className={`px-8 py-4 rounded-xl font-bold text-lg flex items-center gap-2 mx-auto ${
                theme === 'dark'
                  ? 'bg-gradient-to-r from-electric-green to-electric-blue text-dark-bg'
                  : 'bg-gradient-to-r from-accent-red to-accent-blue text-white'
              }`}
            >
              Enroll in Masterclass
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default MasterclassPage;
