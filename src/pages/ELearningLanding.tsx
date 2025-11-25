import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  GraduationCap, 
  BookOpen, 
  Users, 
  Award, 
  Filter,
  Code,
  Database,
  Smartphone,
  Cloud,
  Brain,
  Server,
  Palette,
  Shield,
  TrendingUp,
  Cpu,
  Network,
  Mail,
  MapPin,
  Phone,
  Star,
  Search
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import ELearningNav from '../components/elearning/ELearningNav';
import CategoryCard from '../components/elearning/CategoryCard';
import CourseCard from '../components/elearning/CourseCard';
import TestimonialsSlider from '../components/elearning/TestimonialsSlider';
import ELearningFeatures from '../components/elearning/ELearningFeatures';
import InstructorsSection from '../components/elearning/InstructorsSection';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

interface Course {
  id: number;
  title: string;
  description: string;
  category: string;
  level: string;
  duration: number;
  price: number;
  instructor: string;
  thumbnail_url?: string;
  rating?: number;
  students_enrolled?: number;
  is_published: boolean;
}

const ELearningLanding = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const { theme } = useTheme();
  const navigate = useNavigate();

  const categoryList = [
    { name: 'Web Development', icon: Code, courseCount: 45 },
    { name: 'Data Science', icon: TrendingUp, courseCount: 32 },
    { name: 'Mobile Development', icon: Smartphone, courseCount: 28 },
    { name: 'AI & ML', icon: Brain, courseCount: 38 },
    { name: 'Cloud Computing', icon: Cloud, courseCount: 25 },
    { name: 'DevOps', icon: Server, courseCount: 22 },
    { name: 'Database', icon: Database, courseCount: 30 },
    { name: 'Cybersecurity', icon: Shield, courseCount: 18 },
    { name: 'UI/UX Design', icon: Palette, courseCount: 24 },
    { name: 'Backend Development', icon: Network, courseCount: 35 },
    { name: 'IoT', icon: Cpu, courseCount: 15 },
    { name: 'Blockchain', icon: Award, courseCount: 12 }
  ];

  const categories = [
    'All',
    'Web Development',
    'Backend Development', 
    'Data Science',
    'Mobile Development',
    'DevOps',
    'AI & ML',
    'Database',
    'Cloud Computing',
    'Cybersecurity',
    'UI/UX Design',
    'IoT',
    'Blockchain'
  ];

  const levels = ['All', 'Beginner', 'Intermediate', 'Advanced'];

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_URL}/courses`);
      setCourses(response.data.courses.filter((course: Course) => course.is_published));
    } catch (error) {
      console.error('Error fetching courses:', error);
      setError('Unable to load courses. Please check your connection and try again later.');
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredCourses = courses.filter((course) => {
    const courseTitle = (course.title ?? '').toLowerCase();
    const courseDescription = (course.description ?? '').toLowerCase();
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = courseTitle.includes(searchLower) || courseDescription.includes(searchLower);
    const matchesCategory = !selectedCategory || selectedCategory === 'All' || course.category === selectedCategory;
    const matchesLevel = !selectedLevel || selectedLevel === 'All' || course.level === selectedLevel;
    return matchesSearch && matchesCategory && matchesLevel;
  });

  const handleCourseClick = (courseId: number) => {
    navigate(`/academy/login?redirect=/academy/course/${courseId}`);
  };

  const handleCategoryClick = (categoryName: string) => {
    setSelectedCategory(categoryName);
    document.getElementById('courses')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${theme === 'dark' ? 'bg-dark-bg' : 'bg-gray-50'}`}>
      <ELearningNav onSearch={setSearchTerm} searchTerm={searchTerm} />
      
      {/* Hero Section */}
      <section className={`relative overflow-hidden pt-32 pb-20 ${
        theme === 'dark' ? 'bg-gradient-to-br from-dark-bg via-dark-card to-dark-bg' : 'bg-gradient-to-br from-white via-gray-50 to-white'
      }`}>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-electric-green rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-electric-blue rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="flex justify-center mb-6">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className={`p-6 rounded-2xl bg-gradient-to-br ${
                  theme === 'dark' ? 'from-electric-blue to-electric-green' : 'from-accent-red to-accent-blue'
                } shadow-2xl`}
              >
                <GraduationCap className="w-16 h-16 text-white" />
              </motion.div>
            </div>

            <h1 className={`text-5xl md:text-6xl font-bold mb-6 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Transform Your Future with
              <span className={`block mt-2 bg-gradient-to-r ${
                theme === 'dark' 
                  ? 'from-electric-green to-electric-blue' 
                  : 'from-accent-red to-accent-blue'
              } bg-clip-text text-transparent`}>
                NanoFlows Academy
              </span>
            </h1>

            <p className={`text-xl md:text-2xl mb-10 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Master cutting-edge technologies with industry experts. Learn at your own pace.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/academy/signup')}
                className={`px-8 py-4 rounded-xl font-semibold text-lg shadow-lg transition-all ${
                  theme === 'dark'
                    ? 'bg-gradient-to-r from-electric-green to-electric-blue text-dark-bg hover:shadow-electric-green/50'
                    : 'bg-gradient-to-r from-accent-red to-accent-blue text-white hover:shadow-accent-red/50'
                }`}
              >
                Start Learning Today
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => document.getElementById('courses')?.scrollIntoView({ behavior: 'smooth' })}
                className={`px-8 py-4 rounded-xl font-semibold text-lg border-2 transition-all ${
                  theme === 'dark'
                    ? 'border-electric-blue text-electric-blue hover:bg-electric-blue/10'
                    : 'border-accent-blue text-accent-blue hover:bg-accent-blue/10'
                }`}
              >
                Explore Courses
              </motion.button>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 max-w-5xl mx-auto"
          >
            {[
              { icon: BookOpen, label: 'Courses', value: `${courses.length}+` },
              { icon: Users, label: 'Students', value: '10,000+' },
              { icon: Award, label: 'Certificates', value: '5,000+' },
              { icon: Star, label: 'Rating', value: '4.8/5' }
            ].map((stat, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -5 }}
                className={`p-6 rounded-2xl text-center ${
                  theme === 'dark' 
                    ? 'bg-dark-card border border-gray-800' 
                    : 'bg-white border border-gray-200'
                } shadow-lg`}
              >
                <stat.icon className={`w-8 h-8 mx-auto mb-3 ${
                  theme === 'dark' ? 'text-electric-green' : 'text-accent-red'
                }`} />
                <div className={`text-3xl font-bold mb-1 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  {stat.value}
                </div>
                <div className={`text-sm ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Categories Section */}
      <section className={`py-20 ${
        theme === 'dark' ? 'bg-dark-card' : 'bg-white'
      }`}>
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className={`text-4xl md:text-5xl font-bold mb-4 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Explore{' '}
              <span className={`bg-gradient-to-r ${
                theme === 'dark'
                  ? 'from-electric-green to-electric-blue'
                  : 'from-accent-red to-accent-blue'
              } bg-clip-text text-transparent`}>
                Categories
              </span>
            </h2>
            <p className={`text-lg ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Find the perfect course for your learning journey
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {categoryList.map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
              >
                <CategoryCard
                  name={category.name}
                  icon={category.icon}
                  courseCount={category.courseCount}
                  onClick={() => handleCategoryClick(category.name)}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section id="courses" className={`py-20 ${
        theme === 'dark' ? 'bg-dark-bg' : 'bg-gray-50'
      }`}>
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <div className="lg:w-1/4">
              <div className={`sticky top-24 p-6 rounded-2xl ${
                theme === 'dark' ? 'bg-dark-card border border-gray-800' : 'bg-gray-50 border border-gray-200'
              }`}>
                <div className="flex items-center gap-2 mb-6">
                  <Filter className={`w-5 h-5 ${theme === 'dark' ? 'text-electric-green' : 'text-accent-red'}`} />
                  <h3 className={`font-bold text-lg ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    Filters
                  </h3>
                </div>

                {/* Search */}
                <div className="mb-6">
                  <label className={`block text-sm font-medium mb-2 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Search
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search courses..."
                      className={`w-full pl-10 pr-4 py-3 rounded-xl border ${
                        theme === 'dark'
                          ? 'bg-dark-bg border-gray-700 text-white placeholder-gray-500'
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                      } focus:outline-none focus:ring-2 ${
                        theme === 'dark' ? 'focus:ring-electric-blue' : 'focus:ring-accent-blue'
                      }`}
                    />
                  </div>
                </div>

                {/* Category Filter */}
                <div className="mb-6">
                  <label className={`block text-sm font-medium mb-2 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Category
                  </label>
                  <div className="space-y-2">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat === 'All' ? '' : cat)}
                        className={`w-full text-left px-4 py-2.5 rounded-lg transition-all ${
                          (selectedCategory === cat || (!selectedCategory && cat === 'All'))
                            ? theme === 'dark'
                              ? 'bg-electric-blue/20 text-electric-blue border border-electric-blue/30'
                              : 'bg-accent-blue/10 text-accent-blue border border-accent-blue/30'
                            : theme === 'dark'
                              ? 'text-gray-400 hover:bg-dark-lighter hover:text-white'
                              : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Level Filter */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Level
                  </label>
                  <div className="space-y-2">
                    {levels.map((level) => (
                      <button
                        key={level}
                        onClick={() => setSelectedLevel(level === 'All' ? '' : level)}
                        className={`w-full text-left px-4 py-2.5 rounded-lg transition-all ${
                          (selectedLevel === level || (!selectedLevel && level === 'All'))
                            ? theme === 'dark'
                              ? 'bg-electric-green/20 text-electric-green border border-electric-green/30'
                              : 'bg-accent-red/10 text-accent-red border border-accent-red/30'
                            : theme === 'dark'
                              ? 'text-gray-400 hover:bg-dark-lighter hover:text-white'
                              : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                        }`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Courses Grid */}
            <div className="lg:w-3/4">
              <div className="flex items-center justify-between mb-8">
                <h2 className={`text-3xl font-bold ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  Trending Courses
                </h2>
                <div className={`px-4 py-2 rounded-lg ${
                  theme === 'dark' ? 'bg-dark-card' : 'bg-gray-100'
                }`}>
                  <span className={`font-semibold ${
                    theme === 'dark' ? 'text-electric-green' : 'text-accent-red'
                  }`}>
                    {filteredCourses.length}
                  </span>
                  <span className={`ml-2 ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    courses found
                  </span>
                </div>
              </div>

              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <div
                      key={i}
                      className={`p-6 rounded-2xl animate-pulse ${
                        theme === 'dark' ? 'bg-dark-card' : 'bg-gray-100'
                      }`}
                    >
                      <div className={`h-48 rounded-xl mb-4 ${
                        theme === 'dark' ? 'bg-dark-lighter' : 'bg-gray-200'
                      }`}></div>
                      <div className={`h-4 rounded mb-2 ${
                        theme === 'dark' ? 'bg-dark-lighter' : 'bg-gray-200'
                      }`}></div>
                      <div className={`h-4 rounded w-2/3 ${
                        theme === 'dark' ? 'bg-dark-lighter' : 'bg-gray-200'
                      }`}></div>
                    </div>
                  ))}
                </div>
              ) : error ? (
                <div className="text-center py-20">
                  <div className={`mb-6 p-6 rounded-2xl inline-block ${
                    theme === 'dark' ? 'bg-red-900/20 border border-red-800' : 'bg-red-50 border border-red-200'
                  }`}>
                    <BookOpen className={`w-20 h-20 mx-auto mb-4 ${
                      theme === 'dark' ? 'text-red-400' : 'text-red-500'
                    }`} />
                    <p className={`text-xl font-semibold mb-2 ${
                      theme === 'dark' ? 'text-red-300' : 'text-red-600'
                    }`}>
                      {error}
                    </p>
                    <button
                      onClick={fetchCourses}
                      className={`mt-4 px-6 py-2 rounded-lg font-medium transition-all ${
                        theme === 'dark'
                          ? 'bg-electric-blue text-white hover:bg-electric-blue/80'
                          : 'bg-accent-blue text-white hover:bg-accent-blue/80'
                      }`}
                    >
                      Try Again
                    </button>
                  </div>
                </div>
              ) : filteredCourses.length === 0 ? (
                <div className="text-center py-20">
                  <BookOpen className={`w-20 h-20 mx-auto mb-4 ${
                    theme === 'dark' ? 'text-gray-600' : 'text-gray-400'
                  }`} />
                  <p className={`text-xl ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    No courses found. Try adjusting your filters.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredCourses.map((course) => (
                    <CourseCard
                      key={course.id}
                      id={course.id}
                      title={course.title}
                      description={course.description}
                      category={course.category}
                      level={course.level}
                      duration={course.duration}
                      price={course.price}
                      instructor={course.instructor}
                      thumbnailUrl={course.thumbnail_url}
                      rating={course.rating}
                      studentsEnrolled={course.students_enrolled}
                      onClick={handleCourseClick}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <ELearningFeatures />

      {/* Instructors Section */}
      <InstructorsSection />

      {/* Testimonials Section */}
      <TestimonialsSlider />

      {/* Footer */}
      <footer className={`py-16 border-t ${
        theme === 'dark' ? 'bg-dark-card border-gray-800' : 'bg-white border-gray-200'
      }`}>
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            {/* About Section */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${
                  theme === 'dark'
                    ? 'from-electric-blue to-electric-green'
                    : 'from-accent-red to-accent-blue'
                } shadow-lg`}>
                  <GraduationCap className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className={`font-bold text-lg ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    NanoFlows
                  </h3>
                  <p className={`text-xs ${
                    theme === 'dark' ? 'text-electric-green' : 'text-accent-red'
                  }`}>
                    Academy
                  </p>
                </div>
              </div>
              <p className={`text-sm mb-4 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Empowering learners worldwide with cutting-edge technology courses and expert instructors.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className={`font-bold text-lg mb-6 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Quick Links
              </h4>
              <ul className="space-y-3">
                {['About Us', 'Courses', 'Instructors', 'Pricing', 'Blog'].map((link) => (
                  <li key={link}>
                    <a
                      href={`#${link.toLowerCase().replace(' ', '-')}`}
                      className={`text-sm transition-colors ${
                        theme === 'dark'
                          ? 'text-gray-400 hover:text-electric-green'
                          : 'text-gray-600 hover:text-accent-red'
                      }`}
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className={`font-bold text-lg mb-6 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Support
              </h4>
              <ul className="space-y-3">
                {[
                  { name: 'Help Center', href: '/help' },
                  { name: 'FAQs', href: '/faqs' },
                  { name: 'Privacy Policy', href: '/legal/privacy-policy' },
                  { name: 'Terms of Service', href: '/legal/terms-of-service' },
                  { name: 'Contact Us', href: '#contact' }
                ].map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className={`text-sm transition-colors ${
                        theme === 'dark'
                          ? 'text-gray-400 hover:text-electric-green'
                          : 'text-gray-600 hover:text-accent-red'
                      }`}
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className={`font-bold text-lg mb-6 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Contact
              </h4>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <Mail className={`w-5 h-5 mt-0.5 ${
                    theme === 'dark' ? 'text-electric-blue' : 'text-accent-blue'
                  }`} />
                  <div>
                    <p className={`text-sm ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      info@nanoflows.academy
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Phone className={`w-5 h-5 mt-0.5 ${
                    theme === 'dark' ? 'text-electric-blue' : 'text-accent-blue'
                  }`} />
                  <div>
                    <p className={`text-sm ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      +1 (555) 123-4567
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <MapPin className={`w-5 h-5 mt-0.5 ${
                    theme === 'dark' ? 'text-electric-blue' : 'text-accent-blue'
                  }`} />
                  <div>
                    <p className={`text-sm ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      123 Tech Street, Silicon Valley, CA 94025
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className={`pt-8 border-t ${
            theme === 'dark' ? 'border-gray-800' : 'border-gray-200'
          }`}>
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <p className={`text-sm ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                © 2025 NanoFlows Academy. All rights reserved.
              </p>
              <div className="flex items-center gap-6">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`transition-colors ${
                    theme === 'dark'
                      ? 'text-gray-400 hover:text-electric-blue'
                      : 'text-gray-600 hover:text-accent-blue'
                  }`}
                >
                  <span className="sr-only">Facebook</span>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                  </svg>
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`transition-colors ${
                    theme === 'dark'
                      ? 'text-gray-400 hover:text-electric-blue'
                      : 'text-gray-600 hover:text-accent-blue'
                  }`}
                >
                  <span className="sr-only">Twitter</span>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`transition-colors ${
                    theme === 'dark'
                      ? 'text-gray-400 hover:text-electric-blue'
                      : 'text-gray-600 hover:text-accent-blue'
                  }`}
                >
                  <span className="sr-only">LinkedIn</span>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ELearningLanding;
