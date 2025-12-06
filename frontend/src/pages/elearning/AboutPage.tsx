import { motion } from 'framer-motion';
import { 
  GraduationCap, 
  Target, 
  Heart, 
  Users, 
  Award,
  Globe,
  BookOpen,
  Lightbulb,
  CheckCircle,
  ArrowRight,
  Linkedin,
  Twitter,
  Mail
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import ELearningNav from '../../components/elearning/ELearningNav';
import Footer from '../../components/Footer';
import SEO from '../../components/SEO';

import instructorImage1 from '@assets/stock_images/professional_instruc_7306e577.jpg';
import instructorImage2 from '@assets/stock_images/professional_instruc_7274a63f.jpg';
import instructorImage3 from '@assets/stock_images/professional_instruc_823125aa.jpg';
import codingImage from '@assets/stock_images/technology_coding_pr_d5622045.jpg';

const AboutPage = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();

  const values = [
    {
      icon: Target,
      title: 'Excellence',
      description: 'We strive for the highest quality in everything we do, from course content to student support.',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Heart,
      title: 'Passion',
      description: 'We are passionate about education and believe in the transformative power of learning.',
      color: 'from-pink-500 to-rose-500'
    },
    {
      icon: Users,
      title: 'Community',
      description: 'We foster a supportive community where learners and educators grow together.',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: Lightbulb,
      title: 'Innovation',
      description: 'We continuously innovate to provide the best learning experience using cutting-edge technology.',
      color: 'from-purple-500 to-violet-500'
    }
  ];

  const team = [
    {
      name: 'Dr. Sarah Chen',
      role: 'CEO & Founder',
      image: instructorImage1,
      bio: 'Former Google engineer with 15+ years in tech education.',
      linkedin: '#',
      twitter: '#'
    },
    {
      name: 'Michael Rodriguez',
      role: 'Head of Curriculum',
      image: instructorImage2,
      bio: 'EdTech specialist who has designed courses for 100,000+ students.',
      linkedin: '#',
      twitter: '#'
    },
    {
      name: 'Emily Johnson',
      role: 'Chief Technology Officer',
      image: instructorImage3,
      bio: 'Full-stack developer passionate about building learning platforms.',
      linkedin: '#',
      twitter: '#'
    }
  ];

  const milestones = [
    { year: '2020', title: 'Founded', description: 'NanoFlows Academy was born with a vision to democratize tech education.' },
    { year: '2021', title: '10,000 Students', description: 'Reached our first major milestone of 10,000 enrolled students.' },
    { year: '2022', title: '50+ Courses', description: 'Expanded our catalog to cover all major tech domains.' },
    { year: '2023', title: 'Global Reach', description: 'Students from 100+ countries learning with us.' },
    { year: '2024', title: 'AI Integration', description: 'Launched AI-powered personalized learning paths.' }
  ];

  const stats = [
    { value: '50+', label: 'Expert Courses' },
    { value: '10,000+', label: 'Students Worldwide' },
    { value: '100+', label: 'Countries' },
    { value: '95%', label: 'Success Rate' }
  ];

  return (
    <>
      <SEO
        title="About | NanoFlows Academy"
        description="Learn about NanoFlows Academy - your gateway to professional development, skill enhancement, and world-class e-learning."
        keywords="about academy, e-learning platform, online education, professional development"
      />
      <div className={`min-h-screen transition-colors duration-300 ${
        theme === 'dark' ? 'bg-dark-bg' : 'bg-gray-50'
      }`}>
      <ELearningNav />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className={`absolute inset-0 ${
          theme === 'dark'
            ? 'bg-gradient-to-br from-dark-bg via-dark-card to-dark-bg'
            : 'bg-gradient-to-br from-white via-gray-50 to-white'
        }`} />
        <div className="absolute top-20 right-10 w-96 h-96 bg-electric-blue/20 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-80 h-80 bg-electric-green/20 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-4xl mx-auto"
          >
            <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-6 ${
              theme === 'dark'
                ? 'bg-electric-green/20 text-electric-green'
                : 'bg-accent-red/10 text-accent-red'
            }`}>
              <GraduationCap className="w-4 h-4" />
              About NanoFlows Academy
            </span>

            <h1 className={`text-5xl md:text-6xl font-bold mb-6 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Empowering the Next Generation of{' '}
              <span className={`bg-gradient-to-r ${
                theme === 'dark'
                  ? 'from-electric-green to-electric-blue'
                  : 'from-accent-red to-accent-blue'
              } bg-clip-text text-transparent`}>
                Tech Leaders
              </span>
            </h1>

            <p className={`text-xl mb-10 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
            }`}>
              We're on a mission to make quality tech education accessible to everyone, 
              everywhere. Our platform combines expert instruction with cutting-edge 
              technology to create transformative learning experiences.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className={`py-16 ${theme === 'dark' ? 'bg-dark-card' : 'bg-white'}`}>
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="text-center"
              >
                <div className={`text-5xl font-bold mb-2 ${
                  theme === 'dark' ? 'text-electric-green' : 'text-accent-red'
                }`}>
                  {stat.value}
                </div>
                <div className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className={`py-20 ${theme === 'dark' ? 'bg-dark-bg' : 'bg-gray-50'}`}>
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold mb-4 ${
                theme === 'dark'
                  ? 'bg-electric-blue/20 text-electric-blue'
                  : 'bg-accent-blue/10 text-accent-blue'
              }`}>
                Our Mission
              </span>
              <h2 className={`text-4xl md:text-5xl font-bold mb-6 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Breaking Barriers in{' '}
                <span className={`bg-gradient-to-r ${
                  theme === 'dark'
                    ? 'from-electric-green to-electric-blue'
                    : 'from-accent-red to-accent-blue'
                } bg-clip-text text-transparent`}>
                  Tech Education
                </span>
              </h2>
              <p className={`text-lg mb-6 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                At NanoFlows Academy, we believe that everyone deserves access to quality 
                education. We're committed to creating a world where geographic location, 
                financial background, or prior experience don't limit your potential.
              </p>
              <ul className="space-y-4">
                {[
                  'Industry-relevant curriculum designed by experts',
                  'Affordable pricing with flexible payment options',
                  'Personalized learning paths powered by AI',
                  'Community support and mentorship programs'
                ].map((item, idx) => (
                  <motion.li
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <CheckCircle className={`w-5 h-5 flex-shrink-0 ${
                      theme === 'dark' ? 'text-electric-green' : 'text-accent-red'
                    }`} />
                    <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                      {item}
                    </span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className={`absolute -inset-4 rounded-3xl blur-xl ${
                theme === 'dark' ? 'bg-electric-blue/20' : 'bg-accent-blue/20'
              }`} />
              <img
                src={codingImage}
                alt="Our mission"
                className="relative rounded-2xl shadow-2xl w-full"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className={`py-20 ${theme === 'dark' ? 'bg-dark-card' : 'bg-white'}`}>
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold mb-4 ${
              theme === 'dark'
                ? 'bg-electric-green/20 text-electric-green'
                : 'bg-accent-red/10 text-accent-red'
            }`}>
              Our Values
            </span>
            <h2 className={`text-4xl md:text-5xl font-bold ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              What Drives{' '}
              <span className={`bg-gradient-to-r ${
                theme === 'dark'
                  ? 'from-electric-green to-electric-blue'
                  : 'from-accent-red to-accent-blue'
              } bg-clip-text text-transparent`}>
                Us Forward
              </span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -10 }}
                className={`p-8 rounded-2xl border-2 text-center transition-all ${
                  theme === 'dark'
                    ? 'bg-dark-lighter border-gray-800 hover:border-electric-blue'
                    : 'bg-gradient-to-br from-accent-red/10 to-accent-blue/10 border-accent-red/30 hover:border-accent-blue'
                }`}
              >
                <div className={`w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-6 bg-gradient-to-br ${value.color}`}>
                  <value.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className={`text-xl font-bold mb-3 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  {value.title}
                </h3>
                <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className={`py-20 ${theme === 'dark' ? 'bg-dark-bg' : 'bg-gray-50'}`}>
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold mb-4 ${
              theme === 'dark'
                ? 'bg-electric-blue/20 text-electric-blue'
                : 'bg-accent-blue/10 text-accent-blue'
            }`}>
              Our Journey
            </span>
            <h2 className={`text-4xl md:text-5xl font-bold ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Milestones That{' '}
              <span className={`bg-gradient-to-r ${
                theme === 'dark'
                  ? 'from-electric-green to-electric-blue'
                  : 'from-accent-red to-accent-blue'
              } bg-clip-text text-transparent`}>
                Define Us
              </span>
            </h2>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            {milestones.map((milestone, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: idx % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className={`flex gap-6 mb-8 ${idx % 2 === 0 ? '' : 'flex-row-reverse'}`}
              >
                <div className={`flex-shrink-0 w-24 text-right ${idx % 2 === 0 ? '' : 'text-left'}`}>
                  <span className={`text-2xl font-bold ${
                    theme === 'dark' ? 'text-electric-green' : 'text-accent-red'
                  }`}>
                    {milestone.year}
                  </span>
                </div>
                <div className="relative">
                  <div className={`w-4 h-4 rounded-full ${
                    theme === 'dark' ? 'bg-electric-blue' : 'bg-accent-blue'
                  }`} />
                  <div className={`absolute top-4 left-1/2 -translate-x-1/2 w-0.5 h-full ${
                    idx === milestones.length - 1 ? 'hidden' : ''
                  } ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'}`} />
                </div>
                <div className={`flex-1 p-6 rounded-2xl ${
                  theme === 'dark'
                    ? 'bg-dark-card'
                    : 'bg-gradient-to-br from-accent-red/10 to-accent-blue/10'
                } shadow-lg`}>
                  <h3 className={`text-xl font-bold mb-2 ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    {milestone.title}
                  </h3>
                  <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                    {milestone.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section id="team" className={`py-20 ${theme === 'dark' ? 'bg-dark-card' : 'bg-white'}`}>
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold mb-4 ${
              theme === 'dark'
                ? 'bg-electric-green/20 text-electric-green'
                : 'bg-accent-red/10 text-accent-red'
            }`}>
              Our Team
            </span>
            <h2 className={`text-4xl md:text-5xl font-bold mb-4 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Meet the{' '}
              <span className={`bg-gradient-to-r ${
                theme === 'dark'
                  ? 'from-electric-green to-electric-blue'
                  : 'from-accent-red to-accent-blue'
              } bg-clip-text text-transparent`}>
                Experts
              </span>
            </h2>
            <p className={`text-xl max-w-2xl mx-auto ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Our leadership team brings decades of combined experience in technology and education.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -10 }}
                className={`rounded-2xl overflow-hidden border-2 transition-all ${
                  theme === 'dark'
                    ? 'bg-dark-lighter border-gray-800 hover:border-electric-blue'
                    : 'bg-gradient-to-br from-accent-red/10 to-accent-blue/10 border-accent-red/30 hover:border-accent-blue'
                }`}
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <h3 className={`text-xl font-bold mb-1 ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    {member.name}
                  </h3>
                  <p className={`text-sm font-medium mb-3 ${
                    theme === 'dark' ? 'text-electric-green' : 'text-accent-red'
                  }`}>
                    {member.role}
                  </p>
                  <p className={`text-sm mb-4 ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {member.bio}
                  </p>
                  <div className="flex gap-3">
                    <a href={member.linkedin} className={`p-2 rounded-lg transition-colors ${
                      theme === 'dark'
                        ? 'bg-dark-card hover:bg-electric-blue/20 text-gray-400 hover:text-electric-blue'
                        : 'bg-gray-100 hover:bg-accent-blue/10 text-gray-600 hover:text-accent-blue'
                    }`}>
                      <Linkedin className="w-4 h-4" />
                    </a>
                    <a href={member.twitter} className={`p-2 rounded-lg transition-colors ${
                      theme === 'dark'
                        ? 'bg-dark-card hover:bg-electric-blue/20 text-gray-400 hover:text-electric-blue'
                        : 'bg-gray-100 hover:bg-accent-blue/10 text-gray-600 hover:text-accent-blue'
                    }`}>
                      <Twitter className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={`py-20 ${theme === 'dark' ? 'bg-dark-bg' : 'bg-gray-50'}`}>
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={`text-center p-12 md:p-20 rounded-3xl ${
              theme === 'dark'
                ? 'bg-gradient-to-br from-electric-blue/20 to-electric-green/20'
                : 'bg-gradient-to-br from-accent-red/10 to-accent-blue/10'
            }`}
          >
            <h2 className={`text-4xl md:text-5xl font-bold mb-6 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Ready to Join Our{' '}
              <span className={`bg-gradient-to-r ${
                theme === 'dark'
                  ? 'from-electric-green to-electric-blue'
                  : 'from-accent-red to-accent-blue'
              } bg-clip-text text-transparent`}>
                Community?
              </span>
            </h2>
            <p className={`text-xl mb-10 max-w-2xl mx-auto ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Start your learning journey today and become part of a global community of tech enthusiasts.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/academy/signup')}
              className={`relative group overflow-hidden px-10 py-5 rounded-xl font-bold text-lg flex items-center gap-2 mx-auto shadow-2xl transition-all duration-300 ${
                theme === 'dark'
                  ? 'bg-gradient-to-r from-electric-green to-electric-blue text-dark-bg hover:shadow-electric-green/50'
                  : 'bg-gradient-to-r from-accent-red to-accent-blue text-white hover:shadow-accent-red/50'
              }`}
            >
              <span className="relative z-10 flex items-center gap-2">
              Get Started Free
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

export default AboutPage;
