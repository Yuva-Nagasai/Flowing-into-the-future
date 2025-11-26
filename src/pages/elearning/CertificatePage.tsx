import { motion } from 'framer-motion';
import { 
  Award, 
  Tag,
  ArrowRight,
  Zap,
  Code,
  Bot,
  Share2,
  Webhook,
  ShoppingCart,
  Database,
  Users,
  Briefcase,
  CheckCircle,
  Target
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import ELearningNav from '../../components/elearning/ELearningNav';
import Footer from '../../components/Footer';

const CertificatePage = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();

  const pageInfo = {
    title: "Certificates",
    subtitle: "Industry Recognition",
    description: "Industry-standard certificates proving your n8n automation and AI workflow skills."
  };

  const certificates = [
    {
      id: 1,
      title: "n8n Automation Beginner Certificate",
      validates: "Basic workflows",
      jobUse: "Junior automation roles",
      tags: ["n8n", "certificate"],
      icon: Zap,
      level: "Beginner"
    },
    {
      id: 2,
      title: "Advanced API Integration Certificate",
      validates: "API handling",
      jobUse: "API developer",
      tags: ["API", "advanced"],
      icon: Code,
      level: "Advanced"
    },
    {
      id: 3,
      title: "AI Automation Specialist Certificate",
      validates: "GPT automation",
      jobUse: "AI automation engineer",
      tags: ["AI", "automation"],
      icon: Bot,
      level: "Specialist"
    },
    {
      id: 4,
      title: "No-Code Automation Expert Certificate",
      validates: "Multi-tool automation",
      jobUse: "Automation consultant",
      tags: ["no-code", "expert"],
      icon: Target,
      level: "Expert"
    },
    {
      id: 5,
      title: "Data Automation & Pipelines Certificate",
      validates: "ETL flows",
      jobUse: "Data engineer roles",
      tags: ["data", "pipelines"],
      icon: Database,
      level: "Intermediate"
    },
    {
      id: 6,
      title: "Social Media Automation Certificate",
      validates: "Auto-posting workflows",
      jobUse: "Social automation specialist",
      tags: ["social media"],
      icon: Share2,
      level: "Intermediate"
    },
    {
      id: 7,
      title: "Business Workflow Automation Certificate",
      validates: "CRM & sales flows",
      jobUse: "Workflow architect",
      tags: ["business", "CRM"],
      icon: Users,
      level: "Advanced"
    },
    {
      id: 8,
      title: "Webhook Automation Certificate",
      validates: "Trigger-based systems",
      jobUse: "Integration engineer",
      tags: ["webhooks", "triggers"],
      icon: Webhook,
      level: "Intermediate"
    },
    {
      id: 9,
      title: "Productivity Automation Certificate",
      validates: "Workflow optimization",
      jobUse: "Productivity specialist",
      tags: ["productivity", "automation"],
      icon: Briefcase,
      level: "Beginner"
    },
    {
      id: 10,
      title: "E-commerce Automation Certificate",
      validates: "Store automation workflows",
      jobUse: "Ecommerce automation engineer",
      tags: ["ecommerce", "workflows"],
      icon: ShoppingCart,
      level: "Intermediate"
    }
  ];

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner':
        return theme === 'dark' ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-700';
      case 'Intermediate':
        return theme === 'dark' ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-700';
      case 'Advanced':
        return theme === 'dark' ? 'bg-purple-500/20 text-purple-400' : 'bg-purple-100 text-purple-700';
      case 'Expert':
        return theme === 'dark' ? 'bg-orange-500/20 text-orange-400' : 'bg-orange-100 text-orange-700';
      case 'Specialist':
        return theme === 'dark' ? 'bg-pink-500/20 text-pink-400' : 'bg-pink-100 text-pink-700';
      default:
        return theme === 'dark' ? 'bg-gray-500/20 text-gray-400' : 'bg-gray-100 text-gray-700';
    }
  };

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
              <Award className="w-4 h-4" />
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
            {certificates.map((cert, idx) => (
              <motion.div
                key={cert.id}
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
                      ? 'bg-gradient-to-br from-electric-green/20 to-electric-blue/20'
                      : 'bg-gradient-to-br from-accent-red/10 to-accent-blue/10'
                  }`}>
                    <cert.icon className={`w-7 h-7 ${theme === 'dark' ? 'text-electric-blue' : 'text-accent-blue'}`} />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        {cert.title}
                      </h3>
                      <span className={`text-xs font-semibold px-3 py-1 rounded-full ${getLevelColor(cert.level)}`}>
                        {cert.level}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className={`text-xs uppercase tracking-wider mb-1 ${
                          theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                        }`}>
                          Validates
                        </p>
                        <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                          {cert.validates}
                        </p>
                      </div>
                      <div>
                        <p className={`text-xs uppercase tracking-wider mb-1 ${
                          theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                        }`}>
                          Career Use
                        </p>
                        <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                          {cert.jobUse}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-2">
                        {cert.tags.map((tag, tagIdx) => (
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
                        Get Certified
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
                Why Our Certificates Matter
              </h2>
              <p className={`text-lg ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Industry-recognized credentials that boost your career
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              {[
                { title: "Employer Verified", desc: "Certificates come with verification codes employers can check" },
                { title: "LinkedIn Ready", desc: "Digital badges you can add directly to your LinkedIn profile" },
                { title: "Lifetime Valid", desc: "Your certificate never expires once earned" },
                { title: "Skills Tested", desc: "Practical assessments ensure real competency" }
              ].map((benefit, idx) => (
                <div
                  key={idx}
                  className={`flex items-start gap-4 p-6 rounded-2xl ${
                    theme === 'dark' ? 'bg-dark-bg' : 'bg-gray-50'
                  }`}
                >
                  <CheckCircle className={`w-6 h-6 flex-shrink-0 ${theme === 'dark' ? 'text-electric-green' : 'text-accent-red'}`} />
                  <div>
                    <h3 className={`text-lg font-bold mb-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      {benefit.title}
                    </h3>
                    <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                      {benefit.desc}
                    </p>
                  </div>
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
            <Award className={`w-16 h-16 mx-auto mb-6 ${theme === 'dark' ? 'text-electric-green' : 'text-accent-red'}`} />
            <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Start Your Certification Journey
            </h2>
            <p className={`text-lg mb-8 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              Choose a certificate program and prove your automation expertise to employers worldwide.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/elearning/courses')}
              className={`px-8 py-4 rounded-xl font-bold text-lg flex items-center gap-2 mx-auto ${
                theme === 'dark'
                  ? 'bg-gradient-to-r from-electric-green to-electric-blue text-dark-bg'
                  : 'bg-gradient-to-r from-accent-red to-accent-blue text-white'
              }`}
            >
              Browse Certification Courses
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default CertificatePage;
