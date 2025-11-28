import { motion } from 'framer-motion';
import { Star, Users, Award } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const InstructorsSection = () => {
  const { theme } = useTheme();

  const instructors = [
    {
      name: 'Dr. Sarah Chen',
      title: 'AI & Machine Learning Expert',
      image: '👩‍💻',
      rating: 4.9,
      students: '50,000+',
      courses: 12
    },
    {
      name: 'Michael Rodriguez',
      title: 'Full Stack Developer',
      image: '👨‍💼',
      rating: 4.8,
      students: '45,000+',
      courses: 15
    },
    {
      name: 'Emily Watson',
      title: 'Data Science Lead',
      image: '👩‍🔬',
      rating: 4.9,
      students: '38,000+',
      courses: 10
    },
    {
      name: 'David Kumar',
      title: 'DevOps Architect',
      image: '👨‍💻',
      rating: 4.7,
      students: '42,000+',
      courses: 8
    }
  ];

  return (
    <section id="instructors" className={`py-20 ${
      theme === 'dark' ? 'bg-dark-bg' : 'bg-white'
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
            Learn from{' '}
            <span className={`bg-gradient-to-r ${
              theme === 'dark'
                ? 'from-electric-green to-electric-blue'
                : 'from-accent-red to-accent-blue'
            } bg-clip-text text-transparent`}>
              Industry Experts
            </span>
          </h2>
          <p className={`text-lg md:text-xl mt-4 max-w-2xl mx-auto ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Our instructors are industry professionals with years of real-world experience
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {instructors.map((instructor, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className={`p-6 rounded-2xl text-center transition-all ${
                theme === 'dark'
                  ? 'bg-dark-card border border-gray-800 hover:border-electric-blue/50'
                  : 'bg-white border border-gray-200 hover:border-accent-blue/50'
              } shadow-lg hover:shadow-xl`}
            >
              {/* Avatar */}
              <div className={`w-24 h-24 mx-auto mb-4 rounded-full flex items-center justify-center text-5xl bg-gradient-to-br ${
                theme === 'dark'
                  ? 'from-electric-blue/20 to-electric-green/20'
                  : 'from-accent-red/20 to-accent-blue/20'
              }`}>
                {instructor.image}
              </div>

              {/* Name & Title */}
              <h3 className={`text-xl font-bold mb-1 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                {instructor.name}
              </h3>
              <p className={`text-sm mb-4 ${
                theme === 'dark' ? 'text-electric-blue' : 'text-accent-blue'
              }`}>
                {instructor.title}
              </p>

              {/* Stats */}
              <div className={`pt-4 border-t ${
                theme === 'dark' ? 'border-gray-800' : 'border-gray-200'
              }`}>
                <div className="flex items-center justify-center gap-1 mb-2">
                  <Star className={`w-4 h-4 fill-current ${
                    theme === 'dark' ? 'text-yellow-400' : 'text-yellow-500'
                  }`} />
                  <span className={`font-semibold ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    {instructor.rating}
                  </span>
                  <span className={`text-sm ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Rating
                  </span>
                </div>
                <div className="flex items-center justify-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4 text-gray-400" />
                    <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                      {instructor.students}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Award className="w-4 h-4 text-gray-400" />
                    <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                      {instructor.courses} Courses
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default InstructorsSection;
