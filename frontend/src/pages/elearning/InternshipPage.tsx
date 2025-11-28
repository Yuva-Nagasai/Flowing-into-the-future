import { motion } from 'framer-motion';
import { 
  Briefcase, 
  Clock, 
  Tag,
  ArrowRight,
  Zap,
  Code,
  Bot,
  Share2,
  Webhook,
  Mail,
  ShoppingCart,
  Database,
  Users,
  Target
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import ELearningNav from '../../components/elearning/ELearningNav';
import Footer from '../../components/Footer';

const InternshipPage = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();

  const pageInfo = {
    title: "Internships",
    subtitle: "Hands-on Experience",
    description: "Hands-on internships designed to build real n8n workflows and automation systems."
  };

  const internships = [
    {
      id: 1,
      title: "n8n Workflow Builder Intern",
      duration: "1 Month",
      skillsRequired: "Basic logic",
      learns: "Workflow building",
      tags: ["n8n", "workflow"],
      icon: Zap
    },
    {
      id: 2,
      title: "API Automation Intern",
      duration: "6 Weeks",
      skillsRequired: "API basics",
      learns: "API nodes & tokens",
      tags: ["API", "automation"],
      icon: Code
    },
    {
      id: 3,
      title: "AI Automation Intern",
      duration: "1 Month",
      skillsRequired: "AI basics",
      learns: "GPT workflows",
      tags: ["AI", "GPT"],
      icon: Bot
    },
    {
      id: 4,
      title: "No-Code Automation Intern",
      duration: "2 Months",
      skillsRequired: "No-code mindset",
      learns: "Business automations",
      tags: ["no-code", "automation"],
      icon: Target
    },
    {
      id: 5,
      title: "Social Media Automation Intern",
      duration: "1 Month",
      skillsRequired: "Social media basics",
      learns: "Auto-posting tools",
      tags: ["social media", "automation"],
      icon: Share2
    },
    {
      id: 6,
      title: "CRM Automation Intern",
      duration: "6 Weeks",
      skillsRequired: "CRM basics",
      learns: "Lead tracking workflows",
      tags: ["CRM", "automation"],
      icon: Users
    },
    {
      id: 7,
      title: "Webhook Automation Intern",
      duration: "1 Month",
      skillsRequired: "HTTP basics",
      learns: "Event triggers",
      tags: ["webhooks", "triggers"],
      icon: Webhook
    },
    {
      id: 8,
      title: "Email Automation Intern",
      duration: "1 Month",
      skillsRequired: "Email basics",
      learns: "SMTP & newsletters",
      tags: ["email", "automation"],
      icon: Mail
    },
    {
      id: 9,
      title: "Ecommerce Automation Intern",
      duration: "6 Weeks",
      skillsRequired: "Ecommerce basics",
      learns: "Order → message flows",
      tags: ["ecommerce", "workflow"],
      icon: ShoppingCart
    },
    {
      id: 10,
      title: "Data Automation Intern",
      duration: "1 Month",
      skillsRequired: "Excel/Sheets",
      learns: "Data sync & pipelines",
      tags: ["data", "automation"],
      icon: Database
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
              <Briefcase className="w-4 h-4" />
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
          <div className="grid md:grid-cols-2 gap-6">
            {internships.map((internship, idx) => (
              <motion.div
                key={internship.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className={`group p-6 rounded-2xl border transition-all duration-300 hover:shadow-xl ${
                  theme === 'dark'
                    ? 'bg-dark-card border-gray-800 hover:border-electric-blue/50'
                    : 'bg-white border-gray-200 hover:border-accent-blue/50'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`flex-shrink-0 w-14 h-14 rounded-xl flex items-center justify-center ${
                    theme === 'dark'
                      ? 'bg-electric-blue/20 text-electric-blue'
                      : 'bg-accent-blue/10 text-accent-blue'
                  }`}>
                    <internship.icon className="w-7 h-7" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        {internship.title}
                      </h3>
                      <span className={`flex items-center gap-1 text-sm px-3 py-1 rounded-full ${
                        theme === 'dark'
                          ? 'bg-electric-green/20 text-electric-green'
                          : 'bg-accent-red/10 text-accent-red'
                      }`}>
                        <Clock className="w-3 h-3" />
                        {internship.duration}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className={`text-xs uppercase tracking-wider mb-1 ${
                          theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                        }`}>
                          Skills Required
                        </p>
                        <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                          {internship.skillsRequired}
                        </p>
                      </div>
                      <div>
                        <p className={`text-xs uppercase tracking-wider mb-1 ${
                          theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                        }`}>
                          You Will Learn
                        </p>
                        <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                          {internship.learns}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-2">
                        {internship.tags.map((tag, tagIdx) => (
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
                      
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`flex items-center gap-1 text-sm font-medium ${
                          theme === 'dark' ? 'text-electric-green' : 'text-accent-red'
                        }`}
                      >
                        Apply
                        <ArrowRight className="w-4 h-4" />
                      </motion.button>
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
            className="max-w-4xl mx-auto"
          >
            <div className="text-center mb-12">
              <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Why Intern With Us?
              </h2>
              <p className={`text-lg ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Build real-world skills with hands-on automation projects
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { title: "Real Projects", desc: "Work on actual automation systems for real clients" },
                { title: "Mentorship", desc: "Get guidance from experienced n8n professionals" },
                { title: "Certificate", desc: "Earn a certificate upon successful completion" }
              ].map((benefit, idx) => (
                <div
                  key={idx}
                  className={`p-6 rounded-2xl text-center ${
                    theme === 'dark' ? 'bg-dark-bg' : 'bg-gray-50'
                  }`}
                >
                  <h3 className={`text-xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {benefit.title}
                  </h3>
                  <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                    {benefit.desc}
                  </p>
                </div>
              ))}
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
            <Briefcase className={`w-16 h-16 mx-auto mb-6 ${theme === 'dark' ? 'text-electric-green' : 'text-accent-red'}`} />
            <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Ready to Start Your Automation Career?
            </h2>
            <p className={`text-lg mb-8 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              Apply now and get hands-on experience with n8n automation systems.
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
              Apply for Internship
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default InternshipPage;
