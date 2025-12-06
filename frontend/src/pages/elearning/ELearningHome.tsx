import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  GraduationCap, 
  BookOpen, 
  Users, 
  Award, 
  Play,
  Star,
  Clock,
  TrendingUp,
  CheckCircle,
  ArrowRight,
  Zap,
  Target,
  Shield,
  Sparkles
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import ELearningNav from '../../components/elearning/ELearningNav';
import CourseCard from '../../components/elearning/CourseCard';
import TestimonialsSlider from '../../components/elearning/TestimonialsSlider';
import { coursesAPI } from '../../utils/api';

import heroImage1 from '@assets/stock_images/professional_e-learn_9e7fdc74.jpg';
import heroImage2 from '@assets/stock_images/professional_e-learn_64dcaf64.jpg';
import heroImage3 from '@assets/stock_images/professional_e-learn_6fb000a8.jpg';
import instructorImage1 from '@assets/stock_images/professional_instruc_7306e577.jpg';
import instructorImage2 from '@assets/stock_images/professional_instruc_7274a63f.jpg';
import instructorImage3 from '@assets/stock_images/professional_instruc_823125aa.jpg';
import codingImage1 from '@assets/stock_images/technology_coding_pr_24d87b89.jpg';
import codingImage2 from '@assets/stock_images/technology_coding_pr_d5622045.jpg';
import Footer from '../../components/Footer';

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

const ELearningHome = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);
  const [courseFilter, setCourseFilter] = useState<'all' | 'beginner' | 'intermediate' | 'advanced'>('all');
  const { theme } = useTheme();
  const navigate = useNavigate();

  const defaultHeroSlides = [
    {
      id: 1,
      title: 'Master In-Demand',
      highlight: 'Skills',
      subtitle: 'Transform Your Career',
      description: 'Learn from industry experts and gain practical skills that employers value most.',
      image_url: heroImage1,
      cta_text: 'Start Learning',
      cta_link: '/academy/signup'
    },
    {
      id: 2,
      title: 'Learn at Your Own',
      highlight: 'Pace',
      subtitle: 'Flexible Learning',
      description: 'Access courses anytime, anywhere. Study on your schedule with lifetime access.',
      image_url: heroImage2,
      cta_text: 'Explore Courses',
      cta_link: '/elearning#courses'
    },
    {
      id: 3,
      title: 'Get',
      highlight: 'Certified',
      subtitle: 'Industry Recognition',
      description: 'Earn certificates recognized by top companies and boost your career prospects.',
      image_url: heroImage3,
      cta_text: 'View Certificates',
      cta_link: '/academy/signup'
    }
  ];

  const features = [
    {
      icon: Zap,
      title: 'Learn Faster',
      description: 'Our AI-powered learning system adapts to your pace and style.',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Target,
      title: 'Career Focused',
      description: 'Courses designed with industry requirements in mind.',
      color: 'from-pink-500 to-rose-500'
    },
    {
      icon: Shield,
      title: 'Verified Skills',
      description: 'Earn certificates that validate your expertise.',
      color: 'from-amber-500 to-orange-500'
    },
    {
      icon: Users,
      title: 'Expert Mentors',
      description: 'Learn from professionals with real-world experience.',
      color: 'from-green-500 to-emerald-500'
    }
  ];

  const stats = [
    { value: '50+', label: 'Expert Courses', icon: BookOpen },
    { value: '10,000+', label: 'Active Students', icon: Users },
    { value: '95%', label: 'Success Rate', icon: TrendingUp },
    { value: '4.9', label: 'Average Rating', icon: Star }
  ];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const coursesRes = await coursesAPI.getAll({});
        setCourses(coursesRes.data.courses?.filter((c: Course) => c.is_published) || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredCourses = courses.filter((course) => {
    if (courseFilter === 'all') return true;
    const level = (course.level || '').toLowerCase();
    if (courseFilter === 'beginner') return level.includes('beginner');
    if (courseFilter === 'intermediate') return level.includes('intermediate');
    if (courseFilter === 'advanced') return level.includes('advanced');
    return true;
  });

  // Simple 3-slide rotation using the local defaultHeroSlides only
  useEffect(() => {
    const totalSlides = defaultHeroSlides.length;
    if (totalSlides <= 1) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 6000);

    return () => clearInterval(timer);
  }, [defaultHeroSlides.length]);

  const handleCourseClick = (courseId: number) => {
    navigate(`/academy/login?redirect=/academy/course/${courseId}`);
  };

  return (
    <div className={`min-h-screen overflow-x-hidden transition-colors duration-300 ${theme === 'dark' ? 'bg-dark-bg' : 'bg-gray-50'}`}>
      <ELearningNav />
      
      {/* Hero Section with 3 professional slides (local only) */}
      <section className="relative min-h-[600px] overflow-hidden">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7 }}
          className="absolute inset-0"
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${defaultHeroSlides[currentSlide].image_url})` }}
          />
          <div
            className={`absolute inset-0 ${
              theme === 'dark'
                ? 'bg-gradient-to-r from-dark-bg/95 via-dark-bg/80 to-transparent'
                : 'bg-gradient-to-r from-white/95 via-white/80 to-transparent'
            }`}
          />
        </motion.div>

        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className={`absolute -top-40 -right-40 w-80 h-80 rounded-full blur-3xl ${
            theme === 'dark' ? 'bg-electric-blue/20' : 'bg-accent-blue/20'
          }`} />
          <div className={`absolute -bottom-40 -left-40 w-80 h-80 rounded-full blur-3xl ${
            theme === 'dark' ? 'bg-electric-green/20' : 'bg-accent-red/20'
          }`} />
        </div>

        <div className="container mx-auto px-4 lg:px-6 relative z-10 pt-28 pb-20">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="mb-6">
                <span
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${
                    theme === 'dark'
                      ? 'bg-electric-green/10 text-electric-green border border-electric-green/30'
                      : 'bg-accent-red/10 text-accent-red border border-accent-red/30'
                  }`}
                >
                  <Sparkles className="w-4 h-4" />
                  {defaultHeroSlides[currentSlide].subtitle}
                </span>
              </div>

              <h1
                className={`text-4xl md:text-5xl lg:text-6xl font-bold mb-6 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}
              >
                {defaultHeroSlides[currentSlide].title}{' '}
                {defaultHeroSlides[currentSlide].highlight && (
                  <span
                    className={`bg-gradient-to-r ${
                      theme === 'dark'
                        ? 'from-electric-green to-electric-blue'
                        : 'from-accent-red to-accent-blue'
                    } bg-clip-text text-transparent`}
                  >
                    {defaultHeroSlides[currentSlide].highlight}
                  </span>
                )}
              </h1>

              <p
                className={`text-lg md:text-xl mb-8 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                }`}
              >
                {defaultHeroSlides[currentSlide].description}
              </p>

              <div className="flex flex-col sm:flex-row items-start gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() =>
                    navigate(defaultHeroSlides[currentSlide].cta_link || '/academy/signup')
                  }
                  className={`relative group overflow-hidden inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 ${
                    theme === 'dark'
                      ? 'bg-gradient-to-r from-electric-blue to-electric-green text-slate-900 hover:shadow-lg hover:shadow-electric-blue/25'
                      : 'bg-gradient-to-r from-accent-red to-accent-blue text-white hover:shadow-lg hover:shadow-accent-red/25'
                  }`}
                >
                  <span className="relative z-10 flex items-center gap-2">
                    {defaultHeroSlides[currentSlide].cta_text}
                    <ArrowRight className="w-5 h-5" />
                  </span>
                  <div
                    className={`absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 ${
                      theme === 'dark'
                        ? 'bg-gradient-to-r from-electric-green to-electric-blue'
                        : 'bg-gradient-to-r from-accent-blue to-accent-red'
                    }`}
                  />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() =>
                    document.getElementById('courses')?.scrollIntoView({ behavior: 'smooth' })
                  }
                  className={`inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-lg transition-all border ${
                    theme === 'dark'
                      ? 'border-slate-600 text-gray-300 hover:bg-slate-800'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Play className="w-5 h-5" />
                  Watch Demo
                </motion.button>
              </div>
              </motion.div>

            {/* Slide Navigation - Bottom Left */}
            <div className="flex items-center gap-3 mt-10">
              {defaultHeroSlides.map((slide) => (
                <button
                  key={slide.id}
                  onClick={() => setCurrentSlide(slide.id - 1)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    currentSlide === slide.id - 1
                      ? theme === 'dark'
                        ? 'w-8 bg-electric-green'
                        : 'w-8 bg-accent-red'
                      : theme === 'dark'
                        ? 'w-2 bg-white/30 hover:bg-white/50'
                        : 'w-2 bg-gray-900/30 hover:bg-gray-900/50'
                  }`}
                  aria-label={`Go to e-learning slide ${slide.id}`}
                />
              ))}
            </div>
          </div>
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
                <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center ${
                  theme === 'dark' 
                    ? 'bg-electric-green/20 text-electric-green' 
                    : 'bg-accent-red/10 text-accent-red'
                }`}>
                  <stat.icon className="w-8 h-8" />
                </div>
                <div className={`text-4xl font-bold mb-2 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
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

      {/* Features Section */}
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
              Why Choose Us
            </span>
            <h2 className={`text-4xl md:text-5xl font-bold mb-4 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              The NanoFlows{' '}
              <span className={`bg-gradient-to-r ${
                theme === 'dark'
                  ? 'from-electric-green to-electric-blue'
                  : 'from-accent-red to-accent-blue'
              } bg-clip-text text-transparent`}>
                Advantage
              </span>
            </h2>
            <p className={`text-xl max-w-2xl mx-auto ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Experience world-class education with cutting-edge technology and expert guidance.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -10 }}
                className={`p-8 rounded-2xl border-2 transition-all ${
                  theme === 'dark'
                    ? 'bg-dark-card border-gray-800 hover:border-electric-blue'
                    : 'bg-gradient-to-br from-accent-red/10 to-accent-blue/10 border-accent-red/30 hover:border-accent-blue'
                }`}
              >
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 bg-gradient-to-br ${feature.color}`}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className={`text-xl font-bold mb-3 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
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

      {/* Featured Courses Section */}
      <section id="courses" className={`py-20 ${theme === 'dark' ? 'bg-dark-card' : 'bg-white'}`}>
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col gap-6 md:gap-4 md:flex-row md:items-end md:justify-between mb-12"
          >
            <div>
              <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold mb-4 ${
                theme === 'dark'
                  ? 'bg-electric-green/20 text-electric-green'
                  : 'bg-accent-red/10 text-accent-red'
              }`}>
                Popular Courses
              </span>
              <h2 className={`text-4xl md:text-5xl font-bold ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Trending{' '}
                <span className={`bg-gradient-to-r ${
                  theme === 'dark'
                    ? 'from-electric-green to-electric-blue'
                    : 'from-accent-red to-accent-blue'
                } bg-clip-text text-transparent`}>
                  Courses
                </span>
              </h2>
            </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 md:gap-4">
              <div className="flex items-center gap-3">
                <div className="flex flex-col">
                  <span
                    className={`text-xs font-semibold uppercase tracking-wide ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                    }`}
                  >
                    Filter
                  </span>
                  <span
                    className={`text-sm font-medium ${
                      theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
                    }`}
                  >
                    By Level
                  </span>
                </div>
                <div className="relative">
                  <select
                    value={courseFilter}
                    onChange={(e) =>
                      setCourseFilter(
                        e.target.value as 'all' | 'beginner' | 'intermediate' | 'advanced'
                      )
                    }
                    className={`appearance-none rounded-xl border px-4 py-2.5 text-sm pr-10 shadow-sm transition-all focus:outline-none ${
                      theme === 'dark'
                        ? 'bg-dark-bg border-gray-700 text-gray-100 focus:border-electric-blue focus:ring-2 focus:ring-electric-blue/40'
                        : 'bg-white border-gray-300 text-gray-800 focus:border-accent-blue focus:ring-2 focus:ring-accent-blue/30'
                    }`}
                  >
                    <option value="all">All levels</option>
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                  <span
                    className={`pointer-events-none absolute inset-y-0 right-3 flex items-center ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                    }`}
                  >
                    ▼
                  </span>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/academy/login')}
                className={`relative group overflow-hidden inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 ${
                  theme === 'dark'
                    ? 'bg-gradient-to-r from-electric-blue to-electric-green text-slate-900 hover:shadow-lg hover:shadow-electric-blue/25'
                    : 'bg-gradient-to-r from-accent-red to-accent-blue text-white hover:shadow-lg hover:shadow-accent-red/25'
                }`}
              >
                <span className="relative z-10 flex items-center gap-2">
                  View All Courses
                  <ArrowRight className="w-4 h-4" />
                </span>
                <div
                  className={`absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 ${
                    theme === 'dark'
                      ? 'bg-gradient-to-r from-electric-green to-electric-blue'
                      : 'bg-gradient-to-r from-accent-blue to-accent-red'
                  }`}
                />
              </motion.button>
            </div>
          </motion.div>

          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className={`p-6 rounded-2xl animate-pulse ${
                    theme === 'dark' ? 'bg-dark-lighter' : 'bg-gray-100'
                  }`}
                >
                  <div className={`h-48 rounded-xl mb-4 ${
                    theme === 'dark' ? 'bg-dark-bg' : 'bg-gray-200'
                  }`} />
                  <div className={`h-4 rounded mb-2 ${
                    theme === 'dark' ? 'bg-dark-bg' : 'bg-gray-200'
                  }`} />
                  <div className={`h-4 rounded w-2/3 ${
                    theme === 'dark' ? 'bg-dark-bg' : 'bg-gray-200'
                  }`} />
                </div>
              ))}
            </div>
          ) : filteredCourses.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredCourses.slice(0, 6).map((course) => (
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
          ) : (
            <div className={`text-center py-16 rounded-2xl ${
              theme === 'dark' ? 'bg-dark-lighter' : 'bg-gray-100'
            }`}>
              <BookOpen className={`w-16 h-16 mx-auto mb-4 ${
                theme === 'dark' ? 'text-gray-600' : 'text-gray-400'
              }`} />
              <p className={`text-xl ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Courses coming soon. Stay tuned!
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Learning Path Section */}
      <section className={`py-20 ${theme === 'dark' ? 'bg-dark-bg' : 'bg-gray-50'}`}>
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
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
                How It Works
              </span>
              <h2 className={`text-4xl md:text-5xl font-bold mb-6 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Your Learning{' '}
                <span className={`bg-gradient-to-r ${
                  theme === 'dark'
                    ? 'from-electric-green to-electric-blue'
                    : 'from-accent-red to-accent-blue'
                } bg-clip-text text-transparent`}>
                  Journey
                </span>
              </h2>
              <p className={`text-lg mb-8 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Follow our structured path to master new skills and advance your career.
              </p>

              <div className="space-y-6">
                {[
                  { step: 1, title: 'Choose Your Course', desc: 'Browse our catalog and find the perfect course for your goals.' },
                  { step: 2, title: 'Learn at Your Pace', desc: 'Watch video lessons, complete quizzes, and build projects.' },
                  { step: 3, title: 'Earn Certification', desc: 'Complete the course and receive your verified certificate.' },
                  { step: 4, title: 'Advance Your Career', desc: 'Apply your new skills and land your dream job.' }
                ].map((item, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex gap-4"
                  >
                    <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg ${
                      theme === 'dark'
                        ? 'bg-electric-green/20 text-electric-green'
                        : 'bg-accent-red/10 text-accent-red'
                    }`}>
                      {item.step}
                    </div>
                    <div>
                      <h3 className={`text-xl font-bold mb-1 ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>
                        {item.title}
                      </h3>
                      <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                        {item.desc}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
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
                src={codingImage1}
                alt="Learning journey"
                className="relative rounded-2xl shadow-2xl w-full"
              />
              <div className={`absolute -bottom-6 -right-6 p-6 rounded-2xl shadow-xl ${
                theme === 'dark' ? 'bg-dark-card' : 'bg-white'
              }`}>
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl ${
                    theme === 'dark' ? 'bg-electric-green/20' : 'bg-accent-red/10'
                  }`}>
                    <Award className={`w-8 h-8 ${
                      theme === 'dark' ? 'text-electric-green' : 'text-accent-red'
                    }`} />
                  </div>
                  <div>
                    <div className={`text-2xl font-bold ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                      5,000+
                    </div>
                    <div className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                      Certificates Issued
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <TestimonialsSlider />

      <Footer variant="elearning" />
    </div>
  );
};

export default ELearningHome;
