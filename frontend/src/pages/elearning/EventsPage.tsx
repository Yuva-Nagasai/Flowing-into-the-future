import { motion } from 'framer-motion';
import { 
  Calendar, 
  Tag,
  ArrowRight,
  Zap,
  Code,
  Bot,
  Share2,
  Webhook,
  ShoppingCart,
  Users,
  Cloud,
  Briefcase,
  MapPin,
  Clock,
  Video
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import ELearningNav from '../../components/elearning/ELearningNav';
import Footer from '../../components/Footer';

const EventsPage = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();

  const pageInfo = {
    title: "Events",
    subtitle: "Live Learning Experiences",
    description: "Live workshops and bootcamps focused on n8n automation and AI workflows."
  };

  const events = [
    {
      id: 1,
      title: "n8n Automation Bootcamp",
      type: "Bootcamp",
      takeaway: "Build 10 workflows",
      tags: ["n8n", "bootcamp"],
      icon: Zap,
      date: "Jan 15-19, 2026",
      format: "Online"
    },
    {
      id: 2,
      title: "API Integrations 101",
      type: "Webinar",
      takeaway: "Learn API basics",
      tags: ["API", "integrations"],
      icon: Code,
      date: "Jan 22, 2026",
      format: "Online"
    },
    {
      id: 3,
      title: "AI Workflows With n8n",
      type: "Workshop",
      takeaway: "Create GPT automations",
      tags: ["AI", "GPT"],
      icon: Bot,
      date: "Jan 28, 2026",
      format: "Online"
    },
    {
      id: 4,
      title: "Webhook Mastery Workshop",
      type: "Workshop",
      takeaway: "Trigger workflows",
      tags: ["webhooks"],
      icon: Webhook,
      date: "Feb 5, 2026",
      format: "Online"
    },
    {
      id: 5,
      title: "Social Media Automation Day",
      type: "Webinar",
      takeaway: "Automate posting",
      tags: ["social media"],
      icon: Share2,
      date: "Feb 12, 2026",
      format: "Online"
    },
    {
      id: 6,
      title: "Ecommerce Automation Workshop",
      type: "Workshop",
      takeaway: "Order → message flows",
      tags: ["ecommerce"],
      icon: ShoppingCart,
      date: "Feb 20, 2026",
      format: "Online"
    },
    {
      id: 7,
      title: "Daily Routine Automation Bootcamp",
      type: "Bootcamp",
      takeaway: "Automate 25 tasks",
      tags: ["productivity"],
      icon: Briefcase,
      date: "Mar 1-5, 2026",
      format: "Online"
    },
    {
      id: 8,
      title: "n8n Cloud vs Self-Hosted Webinar",
      type: "Webinar",
      takeaway: "Setup & hosting",
      tags: ["hosting", "n8n"],
      icon: Cloud,
      date: "Mar 10, 2026",
      format: "Online"
    },
    {
      id: 9,
      title: "CRM Automation Workshop",
      type: "Workshop",
      takeaway: "Lead → follow-up flows",
      tags: ["CRM"],
      icon: Users,
      date: "Mar 18, 2026",
      format: "Online"
    },
    {
      id: 10,
      title: "Automation Career Roadmap 2026",
      type: "Webinar",
      takeaway: "Jobs, salaries, roadmap",
      tags: ["career", "automation"],
      icon: MapPin,
      date: "Mar 25, 2026",
      format: "Online"
    }
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Bootcamp':
        return theme === 'dark' ? 'bg-purple-500/20 text-purple-400 border-purple-500/30' : 'bg-purple-100 text-purple-700 border-purple-200';
      case 'Workshop':
        return theme === 'dark' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' : 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Webinar':
        return theme === 'dark' ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-green-100 text-green-700 border-green-200';
      default:
        return theme === 'dark' ? 'bg-gray-500/20 text-gray-400 border-gray-500/30' : 'bg-gray-100 text-gray-700 border-gray-200';
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
              <Calendar className="w-4 h-4" />
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
            {events.map((event, idx) => (
              <motion.div
                key={event.id}
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
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    theme === 'dark'
                      ? 'bg-electric-blue/20 text-electric-blue'
                      : 'bg-accent-blue/10 text-accent-blue'
                  }`}>
                    <event.icon className="w-6 h-6" />
                  </div>
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${getTypeColor(event.type)}`}>
                    {event.type}
                  </span>
                </div>
                
                <h3 className={`text-xl font-bold mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {event.title}
                </h3>
                
                <div className="space-y-2 mb-4">
                  <div className={`flex items-center gap-2 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    <Clock className="w-4 h-4" />
                    {event.date}
                  </div>
                  <div className={`flex items-center gap-2 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    <Video className="w-4 h-4" />
                    {event.format}
                  </div>
                </div>
                
                <div className={`p-3 rounded-lg mb-4 ${
                  theme === 'dark' ? 'bg-dark-bg' : 'bg-gray-50'
                }`}>
                  <p className={`text-xs uppercase tracking-wider mb-1 ${
                    theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                  }`}>
                    You'll Learn
                  </p>
                  <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {event.takeaway}
                  </p>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-2">
                    {event.tags.map((tag, tagIdx) => (
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
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full mt-4 py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-all ${
                    theme === 'dark'
                      ? 'bg-electric-blue/20 text-electric-blue hover:bg-electric-blue/30'
                      : 'bg-accent-blue/10 text-accent-blue hover:bg-accent-blue/20'
                  }`}
                >
                  Register Now
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
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
                Event Types
              </h2>
              <p className={`text-lg ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Choose the learning format that works best for you
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { 
                  title: "Bootcamps", 
                  desc: "Multi-day intensive programs with hands-on projects and live mentorship",
                  color: theme === 'dark' ? 'from-purple-500/20 to-purple-600/20' : 'from-purple-100 to-purple-200'
                },
                { 
                  title: "Workshops", 
                  desc: "Half-day focused sessions on specific automation topics with exercises",
                  color: theme === 'dark' ? 'from-blue-500/20 to-blue-600/20' : 'from-blue-100 to-blue-200'
                },
                { 
                  title: "Webinars", 
                  desc: "1-2 hour online sessions with expert presentations and Q&A",
                  color: theme === 'dark' ? 'from-green-500/20 to-green-600/20' : 'from-green-100 to-green-200'
                }
              ].map((type, idx) => (
                <div
                  key={idx}
                  className={`p-6 rounded-2xl text-center bg-gradient-to-br ${type.color}`}
                >
                  <h3 className={`text-xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {type.title}
                  </h3>
                  <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                    {type.desc}
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
            <Calendar className={`w-16 h-16 mx-auto mb-6 ${theme === 'dark' ? 'text-electric-green' : 'text-accent-red'}`} />
            <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Never Miss an Event
            </h2>
            <p className={`text-lg mb-8 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              Subscribe to get notified about upcoming workshops, bootcamps, and webinars.
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
              Subscribe to Events
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default EventsPage;
