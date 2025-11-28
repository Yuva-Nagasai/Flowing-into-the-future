import { motion } from 'framer-motion';
import { Video, FileText, Award, Clock, Users, Smartphone, Globe, HeadphonesIcon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const ELearningFeatures = () => {
  const { theme } = useTheme();

  const features = [
    {
      icon: Video,
      title: 'HD Video Lessons',
      description: 'Learn with crystal-clear video content from industry experts'
    },
    {
      icon: FileText,
      title: 'Rich Resources',
      description: 'Access downloadable materials, code samples, and documentation'
    },
    {
      icon: Award,
      title: 'Certificates',
      description: 'Earn recognized certificates upon course completion'
    },
    {
      icon: Clock,
      title: 'Learn at Your Pace',
      description: 'Lifetime access to courses, study anytime, anywhere'
    },
    {
      icon: Users,
      title: 'Expert Instructors',
      description: 'Learn from industry professionals with real-world experience'
    },
    {
      icon: Smartphone,
      title: 'Mobile Friendly',
      description: 'Access courses on any device - desktop, tablet, or mobile'
    },
    {
      icon: Globe,
      title: 'Global Community',
      description: 'Join thousands of learners from around the world'
    },
    {
      icon: HeadphonesIcon,
      title: '24/7 Support',
      description: 'Get help whenever you need it from our support team'
    }
  ];

  return (
    <section id="about" className={`py-20 ${
      theme === 'dark' ? 'bg-dark-lighter' : 'bg-gray-100'
    }`}>
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className={`text-4xl md:text-5xl font-bold mb-4 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            Why Choose{' '}
            <span className={`bg-gradient-to-r ${
              theme === 'dark'
                ? 'from-electric-green to-electric-blue'
                : 'from-accent-red to-accent-blue'
            } bg-clip-text text-transparent`}>
              NanoFlows Academy
            </span>
          </h2>
          <p className={`text-lg md:text-xl mt-4 max-w-2xl mx-auto ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Everything you need to master new skills and advance your career
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className={`p-6 rounded-2xl transition-all ${
                theme === 'dark'
                  ? 'bg-dark-card border border-gray-800 hover:border-electric-blue/50'
                  : 'bg-white border border-gray-200 hover:border-accent-blue/50'
              } shadow-lg hover:shadow-xl`}
            >
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 bg-gradient-to-br ${
                theme === 'dark'
                  ? 'from-electric-blue/20 to-electric-green/20'
                  : 'from-accent-red/20 to-accent-blue/20'
              }`}>
                <feature.icon className={`w-7 h-7 ${
                  theme === 'dark' ? 'text-electric-green' : 'text-accent-red'
                }`} />
              </div>
              <h3 className={`text-xl font-bold mb-2 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                {feature.title}
              </h3>
              <p className={`${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ELearningFeatures;
