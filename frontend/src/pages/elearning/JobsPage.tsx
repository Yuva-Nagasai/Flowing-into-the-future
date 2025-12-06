import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  BookOpen, 
  Clock, 
  Star,
  Users,
  Play,
  Search,
  Filter,
  GraduationCap,
  Award,
  TrendingUp
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import ELearningNav from '../../components/elearning/ELearningNav';
import Footer from '../../components/Footer';
import { coursesAPI } from '../../utils/api';

interface Course {
  id: string;
  title: string;
  description: string;
  short_description?: string;
  instructor_name: string;
  category: string;
  price: number;
  thumbnail?: string;
  duration?: number;
  rating?: number;
  students_enrolled?: number;
  free?: boolean;
  level?: string;
}

const sampleCourses: Course[] = [
  {
    id: '1',
    title: 'Complete Web Development Bootcamp',
    description: 'Learn HTML, CSS, JavaScript, React, Node.js, and more in this comprehensive course.',
    short_description: 'Master full-stack development from scratch',
    instructor_name: 'John Smith',
    category: 'Web Development',
    price: 49.99,
    duration: 40,
    rating: 4.8,
    students_enrolled: 12500,
    free: false,
    level: 'Beginner'
  },
  {
    id: '2',
    title: 'Python for Data Science',
    description: 'Master Python programming for data analysis, visualization, and machine learning.',
    short_description: 'Become a data science expert with Python',
    instructor_name: 'Sarah Johnson',
    category: 'Data Science',
    price: 39.99,
    duration: 35,
    rating: 4.9,
    students_enrolled: 8700,
    free: false,
    level: 'Intermediate'
  },
  {
    id: '3',
    title: 'Introduction to AI & Machine Learning',
    description: 'Get started with artificial intelligence and machine learning fundamentals.',
    short_description: 'Start your AI journey here',
    instructor_name: 'Michael Chen',
    category: 'AI & ML',
    price: 0,
    duration: 20,
    rating: 4.7,
    students_enrolled: 15000,
    free: true,
    level: 'Beginner'
  },
  {
    id: '4',
    title: 'UI/UX Design Masterclass',
    description: 'Learn user interface and user experience design principles and tools.',
    short_description: 'Design beautiful and functional interfaces',
    instructor_name: 'Emily Davis',
    category: 'Design',
    price: 44.99,
    duration: 28,
    rating: 4.6,
    students_enrolled: 6300,
    free: false,
    level: 'Beginner'
  },
  {
    id: '5',
    title: 'Advanced React & Next.js',
    description: 'Take your React skills to the next level with advanced patterns and Next.js.',
    short_description: 'Build production-ready React applications',
    instructor_name: 'David Wilson',
    category: 'Web Development',
    price: 54.99,
    duration: 32,
    rating: 4.8,
    students_enrolled: 4200,
    free: false,
    level: 'Advanced'
  },
  {
    id: '6',
    title: 'Digital Marketing Fundamentals',
    description: 'Learn SEO, social media marketing, and content strategy.',
    short_description: 'Master modern marketing techniques',
    instructor_name: 'Lisa Anderson',
    category: 'Marketing',
    price: 0,
    duration: 15,
    rating: 4.5,
    students_enrolled: 9800,
    free: true,
    level: 'Beginner'
  }
];

const CoursesPage = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [priceFilter, setPriceFilter] = useState('all');

  const categories = ['all', 'Web Development', 'Data Science', 'AI & ML', 'Design', 'Marketing', 'Mobile Development'];
  const levels = ['all', 'Beginner', 'Intermediate', 'Advanced'];
  const priceOptions = ['all', 'free', 'paid'];

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const response = await coursesAPI.getAll({});
      const fetchedCourses = response.data.courses || [];
      setCourses(fetchedCourses.length > 0 ? fetchedCourses : sampleCourses);
    } catch (err) {
      console.error('Error fetching courses:', err);
      setCourses(sampleCourses);
    } finally {
      setLoading(false);
    }
  };

  const filteredCourses = courses.filter((course) => {
    const matchesSearch = 
      course.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.instructor_name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || course.category === selectedCategory;
    const matchesLevel = selectedLevel === 'all' || course.level === selectedLevel;
    const matchesPrice = priceFilter === 'all' || 
      (priceFilter === 'free' && course.free) || 
      (priceFilter === 'paid' && !course.free);
    return matchesSearch && matchesCategory && matchesLevel && matchesPrice;
  });

  const handleCourseClick = (courseId: string) => {
    navigate(`/academy/login?redirect=/academy/course/${courseId}`);
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      theme === 'dark' ? 'bg-dark-bg' : 'bg-gray-50'
    }`}>
      <ELearningNav />

      {/* Hero Section */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className={`absolute inset-0 ${
          theme === 'dark'
            ? 'bg-gradient-to-br from-dark-bg via-dark-card to-dark-bg'
            : 'bg-gradient-to-br from-white via-gray-50 to-white'
        }`} />
        <div className="absolute top-20 right-10 w-80 h-80 bg-electric-blue/20 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-64 h-64 bg-electric-green/20 rounded-full blur-3xl" />

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
              <BookOpen className="w-4 h-4" />
              Learning Paths
            </span>

            <h1 className={`text-5xl md:text-6xl font-bold mb-6 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Explore Our{' '}
              <span className={`bg-gradient-to-r ${
                theme === 'dark'
                  ? 'from-electric-green to-electric-blue'
                  : 'from-accent-red to-accent-blue'
              } bg-clip-text text-transparent`}>
                Courses
              </span>
            </h1>

            <p className={`text-xl mb-10 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Discover a wide range of courses designed to help you learn new skills, 
              advance your career, and achieve your goals.
            </p>

            {/* Search Bar */}
            <div className={`max-w-2xl mx-auto p-2 rounded-2xl ${
              theme === 'dark' ? 'bg-dark-card' : 'bg-white'
            } shadow-2xl`}>
              <div className="flex flex-col md:flex-row gap-2">
                <div className="flex-1 relative">
                  <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${
                    theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                  }`} />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search courses, topics, or instructors..."
                    className={`w-full pl-12 pr-4 py-4 rounded-xl border-0 focus:outline-none focus:ring-2 ${
                      theme === 'dark'
                        ? 'bg-dark-lighter text-white placeholder-gray-500 focus:ring-electric-blue/30'
                        : 'bg-gray-50 text-gray-900 placeholder-gray-400 focus:ring-accent-blue/30'
                    }`}
                  />
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`relative group overflow-hidden px-8 py-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all duration-300 ${
                    theme === 'dark'
                      ? 'bg-gradient-to-r from-electric-green to-electric-blue text-dark-bg'
                      : 'bg-gradient-to-r from-accent-red to-accent-blue text-white'
                  }`}
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                  <Search className="w-5 h-5" />
                  Search
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
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className={`py-8 ${theme === 'dark' ? 'bg-dark-card' : 'bg-white'}`}>
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: courses.length || '100+', label: 'Available Courses', icon: BookOpen },
              { value: '50+', label: 'Expert Instructors', icon: Users },
              { value: '10,000+', label: 'Active Students', icon: GraduationCap },
              { value: '95%', label: 'Completion Rate', icon: Award }
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="text-center"
              >
                <stat.icon className={`w-8 h-8 mx-auto mb-2 ${
                  theme === 'dark' ? 'text-electric-green' : 'text-accent-red'
                }`} />
                <div className={`text-2xl font-bold ${
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
          </div>
        </div>
      </section>

      {/* Courses Listing */}
      <section className={`py-16 ${theme === 'dark' ? 'bg-dark-bg' : 'bg-gray-50'}`}>
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <div className="lg:w-1/4">
              <div className={`sticky top-24 p-6 rounded-2xl ${
                theme === 'dark' ? 'bg-dark-card border border-gray-800' : 'bg-white border border-gray-200'
              }`}>
                <div className="flex items-center gap-2 mb-6">
                  <Filter className={`w-5 h-5 ${
                    theme === 'dark' ? 'text-electric-green' : 'text-accent-red'
                  }`} />
                  <h3 className={`font-bold text-lg ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    Filters
                  </h3>
                </div>

                {/* Category Filter */}
                <div className="mb-6">
                  <label className={`block text-sm font-medium mb-3 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Category
                  </label>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`w-full text-left px-4 py-2.5 rounded-lg text-sm transition-all ${
                          selectedCategory === category
                            ? theme === 'dark'
                              ? 'bg-electric-blue/20 text-electric-blue border border-electric-blue/30'
                              : 'bg-accent-blue/10 text-accent-blue border border-accent-blue/30'
                            : theme === 'dark'
                              ? 'text-gray-400 hover:bg-dark-lighter hover:text-white'
                              : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                        }`}
                      >
                        {category === 'all' ? 'All Categories' : category}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Level Filter */}
                <div className="mb-6">
                  <label className={`block text-sm font-medium mb-3 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Level
                  </label>
                  <div className="space-y-2">
                    {levels.map((level) => (
                      <button
                        key={level}
                        onClick={() => setSelectedLevel(level)}
                        className={`w-full text-left px-4 py-2.5 rounded-lg text-sm transition-all ${
                          selectedLevel === level
                            ? theme === 'dark'
                              ? 'bg-electric-green/20 text-electric-green border border-electric-green/30'
                              : 'bg-accent-red/10 text-accent-red border border-accent-red/30'
                            : theme === 'dark'
                              ? 'text-gray-400 hover:bg-dark-lighter hover:text-white'
                              : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                        }`}
                      >
                        {level === 'all' ? 'All Levels' : level}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Filter */}
                <div>
                  <label className={`block text-sm font-medium mb-3 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Price
                  </label>
                  <div className="space-y-2">
                    {priceOptions.map((option) => (
                      <button
                        key={option}
                        onClick={() => setPriceFilter(option)}
                        className={`w-full text-left px-4 py-2.5 rounded-lg text-sm transition-all ${
                          priceFilter === option
                            ? theme === 'dark'
                              ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                              : 'bg-purple-100 text-purple-600 border border-purple-300'
                            : theme === 'dark'
                              ? 'text-gray-400 hover:bg-dark-lighter hover:text-white'
                              : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                        }`}
                      >
                        {option === 'all' ? 'All Prices' : option === 'free' ? 'Free Courses' : 'Paid Courses'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Courses List */}
            <div className="lg:w-3/4">
              <div className="flex items-center justify-between mb-6">
                <h2 className={`text-2xl font-bold ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  Available{' '}
                  <span className={`bg-gradient-to-r ${
                    theme === 'dark'
                      ? 'from-electric-green to-electric-blue'
                      : 'from-accent-red to-accent-blue'
                  } bg-clip-text text-transparent`}>
                    Courses
                  </span>
                </h2>
                <span className={`px-4 py-2 rounded-lg text-sm ${
                  theme === 'dark' ? 'bg-dark-card text-gray-400' : 'bg-white text-gray-600'
                }`}>
                  <span className={`font-semibold ${
                    theme === 'dark' ? 'text-electric-green' : 'text-accent-red'
                  }`}>
                    {filteredCourses.length}
                  </span>
                  {' '}courses found
                </span>
              </div>

              {loading ? (
                <div className="grid md:grid-cols-2 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <div
                      key={i}
                      className={`rounded-2xl overflow-hidden animate-pulse ${
                        theme === 'dark' ? 'bg-dark-card' : 'bg-white'
                      }`}
                    >
                      <div className={`h-48 ${
                        theme === 'dark' ? 'bg-dark-lighter' : 'bg-gray-200'
                      }`} />
                      <div className="p-6">
                        <div className={`h-6 rounded w-3/4 mb-4 ${
                          theme === 'dark' ? 'bg-dark-lighter' : 'bg-gray-200'
                        }`} />
                        <div className={`h-4 rounded w-1/2 ${
                          theme === 'dark' ? 'bg-dark-lighter' : 'bg-gray-200'
                        }`} />
                      </div>
                    </div>
                  ))}
                </div>
              ) : filteredCourses.length > 0 ? (
                <div className="grid md:grid-cols-2 gap-6">
                  {filteredCourses.map((course, idx) => (
                    <motion.div
                      key={course.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      whileHover={{ y: -5 }}
                      onClick={() => handleCourseClick(course.id)}
                      className={`rounded-2xl overflow-hidden border-2 transition-all cursor-pointer flex flex-col h-full ${
                        theme === 'dark'
                          ? 'bg-dark-card border-gray-800 hover:border-electric-blue'
                          : 'bg-white border-gray-200 hover:border-accent-blue'
                      } shadow-lg hover:shadow-xl`}
                    >
                      {/* Course Thumbnail */}
                      <div className={`relative h-48 ${
                        theme === 'dark'
                          ? 'bg-gradient-to-br from-electric-blue/30 to-electric-green/30'
                          : 'bg-gradient-to-br from-accent-red/20 to-accent-blue/20'
                      }`}>
                        {course.thumbnail ? (
                          <img 
                            src={course.thumbnail} 
                            alt={course.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <BookOpen className={`w-16 h-16 ${
                              theme === 'dark' ? 'text-electric-blue/50' : 'text-accent-blue/50'
                            }`} />
                          </div>
                        )}
                        
                        {course.free && (
                          <span className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold ${
                            theme === 'dark'
                              ? 'bg-electric-green text-dark-bg'
                              : 'bg-green-500 text-white'
                          }`}>
                            FREE
                          </span>
                        )}
                        
                        <div className={`absolute bottom-4 right-4 px-3 py-1 rounded-full text-xs font-medium ${
                          theme === 'dark'
                            ? 'bg-dark-bg/80 text-white'
                            : 'bg-white/90 text-gray-900'
                        }`}>
                          {course.level || 'All Levels'}
                        </div>
                      </div>

                      {/* Course Content */}
                      <div className="p-6 flex flex-col flex-1">
                        <div className="flex items-center gap-2 mb-3 flex-shrink-0">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            theme === 'dark'
                              ? 'bg-dark-lighter text-gray-400'
                              : 'bg-gray-100 text-gray-600'
                          }`}>
                            {course.category}
                          </span>
                        </div>
                        
                        <h3 className={`text-xl font-bold mb-2 line-clamp-2 min-h-[3.5rem] ${
                          theme === 'dark' ? 'text-white' : 'text-gray-900'
                        }`}>
                          {course.title}
                        </h3>
                        
                        <p className={`text-sm mb-4 line-clamp-2 min-h-[2.5rem] flex-shrink-0 ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          {course.short_description || course.description}
                        </p>

                        <div className={`flex items-center gap-4 mb-4 text-sm flex-shrink-0 ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          <span className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {course.students_enrolled?.toLocaleString() || '0'}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {course.duration || '10'}h
                          </span>
                          {course.rating && (
                            <span className="flex items-center gap-1">
                              <Star className={`w-4 h-4 ${
                                theme === 'dark' ? 'text-yellow-400' : 'text-yellow-500'
                              }`} />
                              {course.rating}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700 mt-auto">
                          <div>
                            <p className={`text-xs ${
                              theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                            }`}>
                              Instructor
                            </p>
                            <p className={`font-medium ${
                              theme === 'dark' ? 'text-electric-green' : 'text-accent-red'
                            }`}>
                              {course.instructor_name}
                            </p>
                          </div>
                          <div className="text-right">
                            {course.free ? (
                              <span className={`text-xl font-bold ${
                                theme === 'dark' ? 'text-electric-green' : 'text-green-600'
                              }`}>
                                Free
                              </span>
                            ) : (
                              <span className={`text-xl font-bold ${
                                theme === 'dark' ? 'text-white' : 'text-gray-900'
                              }`}>
                                ${course.price}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className={`text-center py-16 rounded-2xl ${
                  theme === 'dark' ? 'bg-dark-card' : 'bg-white'
                }`}>
                  <BookOpen className={`w-16 h-16 mx-auto mb-4 ${
                    theme === 'dark' ? 'text-gray-600' : 'text-gray-400'
                  }`} />
                  <h3 className={`text-xl font-bold mb-2 ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    No courses found
                  </h3>
                  <p className={`text-sm ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Try adjusting your search or filter criteria
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={`py-16 ${theme === 'dark' ? 'bg-dark-card' : 'bg-white'}`}>
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={`text-center p-12 rounded-3xl ${
              theme === 'dark'
                ? 'bg-gradient-to-br from-electric-blue/20 to-electric-green/20'
                : 'bg-gradient-to-br from-accent-red/10 to-accent-blue/10'
            }`}
          >
            <TrendingUp className={`w-12 h-12 mx-auto mb-4 ${
              theme === 'dark' ? 'text-electric-green' : 'text-accent-red'
            }`} />
            <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Ready to Start{' '}
              <span className={`bg-gradient-to-r ${
                theme === 'dark'
                  ? 'from-electric-green to-electric-blue'
                  : 'from-accent-red to-accent-blue'
              } bg-clip-text text-transparent`}>
                Learning?
              </span>
            </h2>
            <p className={`text-lg mb-8 max-w-2xl mx-auto ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Join thousands of students who are already learning with us. 
              Get access to all courses and start your journey today.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/academy/signup')}
              className={`relative group overflow-hidden px-8 py-4 rounded-xl font-bold flex items-center gap-2 mx-auto transition-all duration-300 ${
                theme === 'dark'
                  ? 'bg-gradient-to-r from-electric-green to-electric-blue text-dark-bg'
                  : 'bg-gradient-to-r from-accent-red to-accent-blue text-white'
              }`}
            >
              <span className="relative z-10 flex items-center gap-2">
              <Play className="w-5 h-5" />
              Start Learning Now
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
  );
};

export default CoursesPage;
