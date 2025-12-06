import { useState } from 'react';
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
  Target,
  X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import ELearningNav from '../../components/elearning/ELearningNav';
import Footer from '../../components/Footer';

type Internship = {
  id: number;
  title: string;
  duration: string;
  skillsRequired: string;
  learns: string;
  tags: string[];
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  color: string;
};

const InternshipPage = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [isApplyOpen, setIsApplyOpen] = useState(false);
  const [selectedInternship, setSelectedInternship] = useState<Internship | null>(null);
  const handleApplySubmit = (e: any) => {
    e.preventDefault();
    setIsApplyOpen(false);
    setSelectedInternship(null);
  };

  const pageInfo = {
    title: "Internships",
    subtitle: "Hands-on Experience",
    description: "Hands-on internships designed to build real n8n workflows and automation systems."
  };

  const internships: Internship[] = [
    {
      id: 1,
      title: "n8n Workflow Builder Intern",
      duration: "1 Month",
      skillsRequired: "Basic logic",
      learns: "Workflow building",
      tags: ["n8n", "workflow"],
      icon: Zap,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 2,
      title: "API Automation Intern",
      duration: "6 Weeks",
      skillsRequired: "API basics",
      learns: "API nodes & tokens",
      tags: ["API", "automation"],
      icon: Code,
      color: 'from-purple-500 to-indigo-500'
    },
    {
      id: 3,
      title: "AI Automation Intern",
      duration: "1 Month",
      skillsRequired: "AI basics",
      learns: "GPT workflows",
      tags: ["AI", "GPT"],
      icon: Bot,
      color: 'from-emerald-500 to-lime-500'
    },
    {
      id: 4,
      title: "No-Code Automation Intern",
      duration: "2 Months",
      skillsRequired: "No-code mindset",
      learns: "Business automations",
      tags: ["no-code", "automation"],
      icon: Target,
      color: 'from-amber-500 to-orange-500'
    },
    {
      id: 5,
      title: "Social Media Automation Intern",
      duration: "1 Month",
      skillsRequired: "Social media basics",
      learns: "Auto-posting tools",
      tags: ["social media", "automation"],
      icon: Share2,
      color: 'from-pink-500 to-rose-500'
    },
    {
      id: 6,
      title: "CRM Automation Intern",
      duration: "6 Weeks",
      skillsRequired: "CRM basics",
      learns: "Lead tracking workflows",
      tags: ["CRM", "automation"],
      icon: Users,
      color: 'from-indigo-500 to-blue-500'
    },
    {
      id: 7,
      title: "Webhook Automation Intern",
      duration: "1 Month",
      skillsRequired: "HTTP basics",
      learns: "Event triggers",
      tags: ["webhooks", "triggers"],
      icon: Webhook,
      color: 'from-teal-500 to-cyan-500'
    },
    {
      id: 8,
      title: "Email Automation Intern",
      duration: "1 Month",
      skillsRequired: "Email basics",
      learns: "SMTP & newsletters",
      tags: ["email", "automation"],
      icon: Mail,
      color: 'from-red-500 to-orange-500'
    },
    {
      id: 9,
      title: "Ecommerce Automation Intern",
      duration: "6 Weeks",
      skillsRequired: "Ecommerce basics",
      learns: "Order → message flows",
      tags: ["ecommerce", "workflow"],
      icon: ShoppingCart,
      color: 'from-fuchsia-500 to-purple-500'
    },
    {
      id: 10,
      title: "Data Automation Intern",
      duration: "1 Month",
      skillsRequired: "Excel/Sheets",
      learns: "Data sync & pipelines",
      tags: ["data", "automation"],
      icon: Database,
      color: 'from-slate-500 to-gray-600'
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
              <span className={`bg-gradient-to-r ${
                theme === 'dark'
                  ? 'from-electric-green to-electric-blue'
                  : 'from-accent-red to-accent-blue'
              } bg-clip-text text-transparent`}>
                Internships
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
          <div className="grid md:grid-cols-2 gap-6">
            {internships.map((internship, idx) => (
              <motion.div
                key={internship.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className={`group p-6 rounded-2xl border transition-all duration-300 hover:shadow-xl flex flex-col h-full ${
                  theme === 'dark'
                    ? 'bg-dark-card border-gray-800 hover:border-electric-blue/50'
                    : 'bg-white border-gray-200 hover:border-accent-red/50 shadow-md'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`flex-shrink-0 w-14 h-14 rounded-xl flex items-center justify-center bg-gradient-to-br ${internship.color}`}>
                    <internship.icon className="w-7 h-7 text-white" />
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
                    
                    <div className="flex items-center justify-between mt-auto">
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
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => {
                          setSelectedInternship(internship);
                          setIsApplyOpen(true);
                        }}
                        className={`relative group overflow-hidden px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-1 transition-all duration-300 flex-shrink-0 ${
                          theme === 'dark'
                            ? 'bg-gradient-to-r from-electric-green to-electric-blue text-dark-bg hover:shadow-md hover:shadow-electric-blue/25'
                            : 'bg-gradient-to-r from-accent-red to-accent-blue text-white hover:shadow-md hover:shadow-accent-red/25'
                        }`}
                      >
                        <span className="relative z-10 flex items-center gap-1">
                          Apply
                          <ArrowRight className="w-4 h-4" />
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
                Why Intern{' '}
                <span className={`bg-gradient-to-r ${
                  theme === 'dark'
                    ? 'from-electric-green to-electric-blue'
                    : 'from-accent-red to-accent-blue'
                } bg-clip-text text-transparent`}>
                  With Us?
                </span>
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
                    theme === 'dark'
                      ? 'bg-dark-bg'
                      : 'bg-gradient-to-br from-accent-red/10 to-accent-blue/10'
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
              Ready to Start Your{' '}
              <span className={`bg-gradient-to-r ${
                theme === 'dark'
                  ? 'from-electric-green to-electric-blue'
                  : 'from-accent-red to-accent-blue'
              } bg-clip-text text-transparent`}>
                Automation Career?
              </span>
            </h2>
            <p className={`text-lg mb-8 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              Apply now and get hands-on experience with n8n automation systems.
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
              Apply for Internship
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

      {/* Apply popup card */}
      {isApplyOpen && selectedInternship && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className={`relative w-full max-w-xl rounded-3xl p-5 md:p-6 shadow-2xl border ${
              theme === 'dark'
                ? 'bg-dark-card border-electric-blue/40'
                : 'bg-white border-gray-200'
            }`}
          >
            <button
              onClick={() => {
                setIsApplyOpen(false);
                setSelectedInternship(null);
              }}
              className={`absolute right-4 top-4 rounded-full p-1.5 text-sm ${
                theme === 'dark'
                  ? 'text-gray-400 hover:text-white hover:bg-dark-lighter'
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
              }`}
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>

            <form onSubmit={handleApplySubmit} className="space-y-6">
              <div className="flex items-start gap-4">
                <div
                  className={`flex-shrink-0 w-14 h-14 rounded-xl flex items-center justify-center bg-gradient-to-br ${selectedInternship.color}`}
                >
                  <selectedInternship.icon className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1">
                  <h2
                    className={`text-2xl md:text-3xl font-bold mb-1 ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}
                  >
                    Apply for this position
                  </h2>
                  <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
                    {selectedInternship.title} • {selectedInternship.duration}
                  </p>
                </div>
              </div>

              <div className="grid gap-4">
                <div>
                  <label
                    className={`block text-sm font-medium mb-1 ${
                      theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
                    }`}
                  >
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    className={`w-full rounded-lg border px-3 py-2 text-sm outline-none transition ${
                      theme === 'dark'
                        ? 'bg-dark-bg border-gray-700 text-white focus:border-electric-blue'
                        : 'bg-white border-gray-300 text-gray-900 focus:border-accent-blue'
                    }`}
                  />
                </div>

                <div>
                  <label
                    className={`block text-sm font-medium mb-1 ${
                      theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
                    }`}
                  >
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    className={`w-full rounded-lg border px-3 py-2 text-sm outline-none transition ${
                      theme === 'dark'
                        ? 'bg-dark-bg border-gray-700 text-white focus:border-electric-blue'
                        : 'bg-white border-gray-300 text-gray-900 focus:border-accent-blue'
                    }`}
                  />
                </div>

                <div>
                  <label
                    className={`block text-sm font-medium mb-1 ${
                      theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
                    }`}
                  >
                    Phone <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    className={`w-full rounded-lg border px-3 py-2 text-sm outline-none transition ${
                      theme === 'dark'
                        ? 'bg-dark-bg border-gray-700 text-white focus:border-electric-blue'
                        : 'bg-white border-gray-300 text-gray-900 focus:border-accent-blue'
                    }`}
                  />
                </div>

                <div>
                  <label
                    className={`block text-sm font-medium mb-1 ${
                      theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
                    }`}
                  >
                    Cover Letter <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={4}
                    className={`w-full rounded-lg border px-3 py-2 text-sm resize-y outline-none transition ${
                      theme === 'dark'
                        ? 'bg-dark-bg border-gray-700 text-white focus:border-electric-blue'
                        : 'bg-white border-gray-300 text-gray-900 focus:border-accent-blue'
                    }`}
                  />
                </div>

                <div>
                  <label
                    className={`block text-sm font-medium mb-1 ${
                      theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
                    }`}
                  >
                    Upload CV/Resume <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    required
                    className="block w-full text-sm text-gray-500 file:mr-4 file:rounded-md file:border-0 file:bg-gray-100 file:px-3 file:py-2 file:text-sm file:font-medium hover:file:bg-gray-200"
                  />
                  <p className="mt-1 text-xs text-gray-400">
                    Allowed types: .pdf, .doc, .docx
                  </p>
                </div>

                <label className="flex items-start gap-2 text-xs">
                  <input type="checkbox" required className="mt-1" />
                  <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                    By using this form you agree with the storage and handling of your data by this
                    website. <span className="text-red-500">*</span>
                  </span>
                </label>
              </div>

              <div className="flex justify-end pt-2">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  type="submit"
                  className={`px-6 py-2.5 rounded-lg text-sm font-semibold ${
                    theme === 'dark'
                      ? 'bg-electric-green text-dark-bg hover:bg-electric-blue'
                      : 'bg-accent-red text-white hover:bg-accent-blue'
                  }`}
                >
                  Submit
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      <Footer variant="elearning" />
    </div>
  );
};

export default InternshipPage;
