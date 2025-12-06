import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { 
  purchasesAPI, progressAPI, certificatesAPI, coursesAPI, paymentsAPI 
} from '../../utils/api';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { 
  FiPlay, FiLogOut, FiCheckCircle, FiAward, FiTrendingUp, FiBook, 
  FiSearch, FiUser, FiClock, FiStar, FiFilter, FiDollarSign, FiCreditCard,
  FiDownload, FiArrowRight, FiHome, FiShoppingBag, FiSettings, FiMessageCircle,
  FiBarChart2, FiCalendar, FiFileText, FiVideo, FiLayers, FiTarget
} from 'react-icons/fi';
import { Sun, Moon, GraduationCap, Zap, Building2, Trophy, Users, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import RoleBadge from '../../components/academy/RoleBadge';
import SEO from '../../components/SEO';

const UserDashboard = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState('home');
  const [purchases, setPurchases] = useState([]);
  const [filteredPurchases, setFilteredPurchases] = useState([]);
  const [allCourses, setAllCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [progress, setProgress] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [payments, setPayments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [courseSearchTerm, setCourseSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [coursesLoading, setCoursesLoading] = useState(false);
  
  // Course filters
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [priceFilter, setPriceFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const coursesPerPage = 9;

  const { user, logout, loading: authLoading } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const categories = ['All', 'Web Development', 'Backend Development', 'Data Science', 'Mobile Development', 'DevOps', 'AI & ML'];
  const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced'];
  const priceRanges = ['All', 'Free', 'Under ₹1000', '₹1000-5000', 'Above ₹5000'];

  useEffect(() => {
    fetchData();
    
    // Check if tab is specified in URL
    const tab = searchParams.get('tab');
    if (tab && ['home', 'learning', 'courses', 'profile'].includes(tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  // Fetch courses for Popular Courses section when on home tab
  useEffect(() => {
    if (activeTab === 'home' && allCourses.length === 0 && !coursesLoading) {
      const fetchPopularCourses = async () => {
        setCoursesLoading(true);
        try {
          const response = await coursesAPI.getAll({});
          const courses = response.data.courses || [];
          setAllCourses(courses);
        } catch (error) {
          console.error('Error fetching popular courses:', error);
          setAllCourses([]);
        } finally {
          setCoursesLoading(false);
        }
      };
      fetchPopularCourses();
    }
  }, [activeTab, allCourses.length, coursesLoading]);

  useEffect(() => {
    if (activeTab === 'courses') {
      fetchAllCourses();
    }
  }, [activeTab, categoryFilter, difficultyFilter, priceFilter, sortBy, courseSearchTerm]);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredPurchases(purchases);
    } else {
      const filtered = purchases.filter((purchase) => {
        const searchLower = searchTerm.toLowerCase();
        return (
          purchase.course_title?.toLowerCase().includes(searchLower) ||
          purchase.course_description?.toLowerCase().includes(searchLower) ||
          purchase.course_category?.toLowerCase().includes(searchLower)
        );
      });
      setFilteredPurchases(filtered);
    }
  }, [searchTerm, purchases]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [purchasesRes, progressRes, certificatesRes, paymentsRes] = await Promise.all([
        purchasesAPI.getUserPurchases(),
        progressAPI.getUserProgress(),
        certificatesAPI.getUserCertificates(),
        paymentsAPI.getHistory()
      ]);
      
      setPurchases(purchasesRes.data.purchases || []);
      setFilteredPurchases(purchasesRes.data.purchases || []);
      setProgress(progressRes.data.courses || []);
      setCertificates(certificatesRes.data.certificates || []);
      setPayments(paymentsRes.data.payments || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      // Set empty arrays on error to prevent crashes
      setPurchases([]);
      setFilteredPurchases([]);
      setProgress([]);
      setCertificates([]);
      setPayments([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllCourses = async () => {
    setCoursesLoading(true);
    try {
      const params = {};
      if (courseSearchTerm) params.search = courseSearchTerm;
      if (categoryFilter !== 'all') params.category = categoryFilter;
      if (sortBy) params.sortBy = sortBy;

      const response = await coursesAPI.getAll(params);
      let courses = response.data.courses || [];

      // Apply difficulty filter
      if (difficultyFilter !== 'all') {
        courses = courses.filter(c => c.level?.toLowerCase() === difficultyFilter.toLowerCase());
      }

      // Apply price filter
      if (priceFilter !== 'all') {
        courses = courses.filter(c => {
          const price = parseFloat(c.price || 0);
          if (priceFilter === 'Free') return price === 0;
          if (priceFilter === 'Under ₹1000') return price > 0 && price < 1000;
          if (priceFilter === '₹1000-5000') return price >= 1000 && price <= 5000;
          if (priceFilter === 'Above ₹5000') return price > 5000;
          return true;
        });
      }

      setAllCourses(courses);
      setFilteredCourses(courses);
    } catch (error) {
      console.error('Error fetching courses:', error);
      setAllCourses([]);
      setFilteredCourses([]);
    } finally {
      setCoursesLoading(false);
    }
  };

  const getProgressForCourse = (courseId) => {
    const courseProgress = progress.find(p => p.course_id === courseId);
    return courseProgress?.progress_percentage || 0;
  };

  const getTotalProgress = () => {
    if (progress.length === 0) return 0;
    const total = progress.reduce((sum, p) => sum + (p.progress_percentage || 0), 0);
    return Math.round(total / progress.length);
  };

  const handleLogout = () => {
    logout();
    navigate('/academy/dashboard');
  };

  // Pagination
  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = filteredCourses.slice(indexOfFirstCourse, indexOfLastCourse);
  const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);

  if (authLoading || loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${theme === 'dark' ? 'bg-dark-bg' : 'bg-gray-50'}`}>
        <div className="text-center">
          <div className={`h-12 w-12 animate-spin rounded-full border-4 mx-auto mb-4 ${
            theme === 'dark' ? 'border-electric-blue/20 border-t-electric-blue' : 'border-accent-red/20 border-t-accent-red'
          }`} />
          <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO
        title="Dashboard | NanoFlows Academy"
        description="Access your learning dashboard, track course progress, view certificates, and manage your Academy account."
        keywords="academy dashboard, learning dashboard, course progress, certificates, student portal"
      />
      <div className={`min-h-screen transition-colors duration-300 ${theme === 'dark' ? 'bg-dark-bg' : 'bg-gray-50'}`}>
        {/* Gradient Background Effects */}
      <div className={`fixed inset-0 pointer-events-none ${
        theme === 'dark' 
          ? 'bg-[radial-gradient(circle_at_top_right,_rgba(0,240,255,0.15),transparent_50%),radial-gradient(circle_at_bottom_left,_rgba(0,232,129,0.10),transparent_60%)]'
          : 'bg-[radial-gradient(circle_at_top,_rgba(235,50,50,0.20),rgba(255,255,255,0.8)_50%)]'
      }`} />

      {/* Header */}
      <header className={`sticky top-0 z-50 border-b backdrop-blur-xl ${
        theme === 'dark' 
          ? 'border-electric-blue/20 bg-dark-card/90 shadow-lg shadow-black/20' 
          : 'border-gray-200/50 bg-white/90 shadow-md shadow-gray-200/20'
      }`}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link to="/academy/dashboard" className="flex items-center gap-3 group">
              <motion.div 
                whileHover={{ scale: 1.05, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br shadow-lg transition-all duration-300 ${
                  theme === 'dark'
                    ? 'from-electric-blue to-electric-green shadow-electric-blue/30 group-hover:shadow-electric-blue/50'
                    : 'from-accent-red to-accent-blue shadow-accent-red/30 group-hover:shadow-accent-red/50'
                }`}
              >
                <GraduationCap className="h-6 w-6 text-white" />
              </motion.div>
              <div className="hidden sm:block">
                <p className={`text-xs font-bold uppercase tracking-wider ${
                  theme === 'dark' ? 'text-electric-green' : 'text-accent-red'
                }`} style={{ fontFamily: 'Orbitron, sans-serif' }}>
                  NanoFlows
                </p>
                <h1 className={`text-lg font-bold leading-tight ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`} style={{ fontFamily: 'Orbitron, sans-serif' }}>
                  Academy
                </h1>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-2 flex-1 ml-8">
              {[
                { id: 'home', label: 'Home', icon: FiHome },
                { id: 'learning', label: 'My Learning', icon: FiBook },
                { id: 'courses', label: 'Browse Courses', icon: FiShoppingBag },
                { id: 'profile', label: 'Profile', icon: FiUser }
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <motion.button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`relative flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                      activeTab === tab.id
                        ? theme === 'dark'
                          ? 'bg-gradient-to-r from-electric-blue to-electric-green text-black shadow-lg shadow-electric-green/30'
                          : 'bg-accent-blue text-white shadow-lg shadow-accent-blue/30'
                        : theme === 'dark'
                          ? 'text-gray-400 hover:text-white hover:bg-dark-lighter'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <Icon size={18} />
                    {tab.label}
                  </motion.button>
                );
              })}
            </nav>

            {/* Right Side Actions */}
            <div className="flex items-center gap-3 ml-auto">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleTheme}
                className={`flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-200 ${
                  theme === 'dark'
                    ? 'bg-dark-lighter hover:bg-gray-800 text-electric-blue border border-electric-blue/20'
                    : 'bg-gray-100 hover:bg-gray-200 text-accent-blue border border-accent-blue/20'
                }`}
              >
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  theme === 'dark'
                    ? 'bg-red-600/20 text-red-300 border border-red-500/30 hover:bg-red-600/30'
                    : 'bg-red-100 text-red-700 border border-red-300 hover:bg-red-200'
                }`}
              >
                <FiLogOut size={18} />
                <span className="hidden sm:inline">Logout</span>
              </motion.button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className={`md:hidden border-t ${
          theme === 'dark' ? 'border-electric-blue/20' : 'border-gray-200'
        }`}>
          <div className="flex gap-2 overflow-x-auto px-4 py-3 scrollbar-hide">
            {[
              { id: 'home', label: 'Home', icon: FiHome },
              { id: 'learning', label: 'Learning', icon: FiBook },
              { id: 'courses', label: 'Courses', icon: FiShoppingBag },
              { id: 'profile', label: 'Profile', icon: FiUser }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  whileTap={{ scale: 0.95 }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
                    activeTab === tab.id
                      ? theme === 'dark'
                        ? 'bg-gradient-to-r from-electric-blue to-electric-green text-black shadow-lg'
                        : 'bg-accent-blue text-white shadow-lg'
                      : theme === 'dark'
                        ? 'text-gray-400 hover:text-white hover:bg-dark-lighter'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <Icon size={16} />
                  {tab.label}
                </motion.button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <AnimatePresence mode="wait">
          {/* HOME TAB */}
          {activeTab === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              {/* Hero Section */}
              <section className={`relative overflow-hidden rounded-3xl border-2 p-8 lg:p-12 shadow-2xl ${
                theme === 'dark'
                  ? 'bg-dark-card border-electric-blue/30'
                  : 'bg-white border-gray-200'
              }`}>
                {/* Animated Background Gradients */}
                <div className={`absolute -right-32 -top-32 h-96 w-96 rounded-full blur-3xl animate-pulse-slow ${
                  theme === 'dark' ? 'bg-electric-blue/20' : 'bg-accent-red/20'
                }`} />
                <div className={`absolute -bottom-24 -left-24 h-80 w-80 rounded-full blur-3xl animate-pulse-slow ${
                  theme === 'dark' ? 'bg-electric-green/20' : 'bg-accent-blue/20'
                }`} style={{ animationDelay: '1s' }} />
                
                <div className="relative z-10 grid lg:grid-cols-2 gap-8 items-center">
                  <div className="space-y-6">
                    <motion.div 
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-xs font-bold uppercase tracking-wider ${
                        theme === 'dark'
                          ? 'border-electric-blue/40 bg-electric-blue/10 text-electric-blue'
                          : 'border-accent-red/40 bg-accent-red/10 text-accent-red'
                      }`}
                    >
                      <Sparkles className="h-4 w-4" />
                      Welcome Back, {user?.name?.split(' ')[0] || 'Student'}!
                    </motion.div>
                    <h1 className={`text-4xl lg:text-6xl font-bold leading-tight ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`} style={{ fontFamily: 'Orbitron, sans-serif' }}>
                      Master Skills That{' '}
                      <span className={`${
                        theme === 'dark' ? 'text-electric-green' : 'text-accent-red'
                      }`}>
                        Matter
                      </span>
                    </h1>
                    <p className={`text-lg leading-relaxed ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      Join thousands of students learning cutting-edge technologies. Get certified, get hired, and transform your career.
                    </p>
                    <div className="flex flex-wrap gap-4">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setActiveTab('courses')}
                        className={`inline-flex items-center gap-2 rounded-xl px-8 py-4 font-bold text-white shadow-2xl transition-all ${
                          theme === 'dark'
                            ? 'bg-gradient-to-r from-electric-blue to-electric-green hover:shadow-electric-green/50'
                            : 'bg-gradient-to-r from-accent-red to-accent-blue hover:shadow-accent-red/50'
                        }`}
                      >
                        Explore Courses
                        <FiArrowRight size={20} />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setActiveTab('learning')}
                        className={`inline-flex items-center gap-2 rounded-xl px-8 py-4 font-bold border-2 transition-all ${
                          theme === 'dark'
                            ? 'border-electric-blue text-electric-blue hover:bg-electric-blue/10'
                            : 'border-accent-blue text-accent-blue hover:bg-accent-blue/10'
                        }`}
                      >
                        <FiPlay size={20} />
                        Continue Learning
                      </motion.button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { label: 'Enrolled', value: purchases.length, icon: FiBook, color: theme === 'dark' ? 'electric-blue' : 'accent-blue' },
                      { label: 'Progress', value: `${getTotalProgress()}%`, icon: FiTrendingUp, color: theme === 'dark' ? 'electric-green' : 'accent-red' },
                      { label: 'Certificates', value: certificates.length, icon: FiAward, color: 'yellow-400' },
                      { label: 'Time Spent', value: `${Math.round(progress.reduce((sum, p) => sum + (p.total_time_spent || 0), 0) / 60)}h`, icon: FiClock, color: 'purple-400' }
                    ].map((stat, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className={`p-6 rounded-2xl border-2 ${
                          theme === 'dark'
                            ? 'bg-dark-lighter border-gray-800'
                            : 'bg-white border-gray-200'
                        }`}
                      >
                        <div className={`flex items-center justify-center w-12 h-12 rounded-xl mb-3 ${
                          stat.color === 'electric-blue' ? 'bg-electric-blue/20 text-electric-blue' :
                          stat.color === 'electric-green' ? 'bg-electric-green/20 text-electric-green' :
                          stat.color === 'accent-blue' ? 'bg-accent-blue/20 text-accent-blue' :
                          stat.color === 'accent-red' ? 'bg-accent-red/20 text-accent-red' :
                          stat.color === 'yellow-400' ? 'bg-yellow-400/20 text-yellow-400' :
                          'bg-purple-400/20 text-purple-400'
                        }`}>
                          <stat.icon size={24} />
                        </div>
                        <p className={`text-2xl font-bold mb-1 ${
                          theme === 'dark' ? 'text-white' : 'text-gray-900'
                        }`} style={{ fontFamily: 'Orbitron, sans-serif' }}>
                          {stat.value}
                        </p>
                        <p className={`text-xs ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          {stat.label}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </section>

              {/* Popular Courses Section */}
              <section>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className={`text-3xl font-bold mb-2 ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`} style={{ fontFamily: 'Orbitron, sans-serif' }}>
                      Popular{' '}
                      <span className={theme === 'dark' ? 'text-electric-green' : 'text-accent-red'}>
                        Courses
                      </span>
                    </h2>
                    <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                      Trending courses students are enrolling in
                    </p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveTab('courses')}
                    className={`hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition-all ${
                      theme === 'dark'
                        ? 'text-electric-blue hover:bg-electric-blue/10'
                        : 'text-accent-blue hover:bg-accent-blue/10'
                    }`}
                  >
                    View All
                    <FiArrowRight size={18} />
                  </motion.button>
                </div>
                {coursesLoading ? (
                  <div className="flex justify-center py-12">
                    <div className={`h-8 w-8 animate-spin rounded-full border-4 ${
                      theme === 'dark' ? 'border-electric-blue/20 border-t-electric-blue' : 'border-accent-red/20 border-t-accent-red'
                    }`} />
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {allCourses.slice(0, 6).map((course) => (
                      <motion.div
                        key={course.id}
                        whileHover={{ y: -5 }}
                        className={`group rounded-2xl border-2 overflow-hidden transition-all ${
                          theme === 'dark'
                            ? 'bg-dark-card border-gray-800 hover:border-electric-blue/50'
                            : 'bg-white border-gray-200 hover:border-accent-red/50'
                        }`}
                      >
                        <Link to={`/academy/course/${course.id}`}>
                          <div className="relative h-48 overflow-hidden">
                            <img
                              src={course.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3'}
                              alt={course.title}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                            <div className={`absolute inset-0 bg-gradient-to-t ${
                              theme === 'dark' ? 'from-black/80 to-transparent' : 'from-black/60 to-transparent'
                            }`} />
                            <div className="absolute bottom-4 left-4 right-4">
                              <span className={`inline-block px-3 py-1 rounded-lg text-xs font-bold ${
                                theme === 'dark'
                                  ? 'bg-electric-green/20 text-electric-green border border-electric-green/30'
                                  : 'bg-accent-red/20 text-accent-red border border-accent-red/30'
                              }`}>
                                {course.category}
                              </span>
                            </div>
                          </div>
                          <div className="p-5">
                            <h3 className={`font-bold text-lg mb-2 line-clamp-2 ${
                              theme === 'dark' ? 'text-white' : 'text-gray-900'
                            }`}>
                              {course.title}
                            </h3>
                            <p className={`text-sm mb-4 line-clamp-2 ${
                              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                            }`}>
                              {course.description}
                            </p>
                            <div className="flex items-center justify-between">
                              <span className={`text-xl font-bold ${
                                theme === 'dark' ? 'text-electric-green' : 'text-accent-red'
                              }`}>
                                ₹{course.price}
                              </span>
                              <div className="flex items-center gap-1">
                                <FiStar className={theme === 'dark' ? 'text-yellow-400' : 'text-yellow-500'} size={16} />
                                <span className={`text-sm ${
                                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                                }`}>
                                  {course.rating || '4.5'}
                                </span>
                              </div>
                            </div>
                          </div>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                )}
                {allCourses.length === 0 && !coursesLoading && (
                  <div className={`text-center py-12 rounded-2xl border-2 ${
                    theme === 'dark' ? 'bg-dark-card border-gray-800' : 'bg-white border-gray-200'
                  }`}>
                    <FiBook className={`mx-auto mb-4 ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`} size={48} />
                    <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                      No courses available yet
                    </p>
                  </div>
                )}
              </section>

              {/* Student Success Stories */}
              <section>
                <h2 className={`text-3xl font-bold mb-6 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`} style={{ fontFamily: 'Orbitron, sans-serif' }}>
                  Student{' '}
                  <span className={theme === 'dark' ? 'text-electric-green' : 'text-accent-red'}>
                    Success Stories
                  </span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { name: 'Sarah Johnson', role: 'Software Engineer', company: 'Google', quote: 'NanoFlows Academy transformed my career. The hands-on projects were incredible!', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah' },
                    { name: 'Michael Chen', role: 'Data Scientist', company: 'Microsoft', quote: 'Best investment I\'ve made. Landed my dream job within 3 months.', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael' },
                    { name: 'Emily Rodriguez', role: 'Full Stack Developer', company: 'Amazon', quote: 'The courses are comprehensive and the instructors are top-notch!', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily' }
                  ].map((story, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className={`p-6 rounded-2xl border-2 ${
                        theme === 'dark'
                          ? 'bg-dark-card border-gray-800'
                          : 'bg-white border-gray-200'
                      }`}
                    >
                      <div className="flex items-center gap-4 mb-4">
                        <div className="relative">
                          <img
                            src={story.avatar}
                            alt={story.name}
                            className="w-12 h-12 rounded-full border-2 border-gray-600"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                          <div className={`hidden w-12 h-12 rounded-full bg-gradient-to-br items-center justify-center ${
                            theme === 'dark'
                              ? 'from-electric-blue to-electric-green'
                              : 'from-accent-red to-accent-blue'
                          }`}>
                            <FiUser className="text-white" size={20} />
                          </div>
                        </div>
                        <div>
                          <p className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                            {story.name}
                          </p>
                          <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                            {story.role} at {story.company}
                          </p>
                        </div>
                      </div>
                      <p className={`text-sm italic ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        "{story.quote}"
                      </p>
                    </motion.div>
                  ))}
                </div>
              </section>
            </motion.div>
          )}

          {/* MY LEARNING TAB */}
          {activeTab === 'learning' && (
            <motion.div
              key="learning"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div>
                <h2 className={`text-3xl font-bold mb-2 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`} style={{ fontFamily: 'Orbitron, sans-serif' }}>
                  My{' '}
                  <span className={theme === 'dark' ? 'text-electric-green' : 'text-accent-red'}>
                    Learning
                  </span>
                </h2>
                <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                  Continue your learning journey
                </p>
              </div>

              {/* Search */}
              <div className="relative">
                <FiSearch className={`absolute left-4 top-1/2 -translate-y-1/2 ${
                  theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                }`} size={20} />
                <input
                  type="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search your courses..."
                  className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 ${
                    theme === 'dark'
                      ? 'bg-dark-card border-gray-800 text-white placeholder:text-gray-500'
                      : 'bg-white border-gray-200 text-gray-900 placeholder:text-gray-400'
                  }`}
                />
              </div>

              {/* Enrolled Courses */}
              {filteredPurchases.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredPurchases.map((purchase) => {
                    const courseProgress = getProgressForCourse(purchase.course_id);
                    return (
                      <motion.div
                        key={purchase.purchase_id || purchase.id}
                        whileHover={{ y: -5 }}
                        className={`group rounded-2xl border-2 overflow-hidden transition-all ${
                          theme === 'dark'
                            ? 'bg-dark-card border-gray-800 hover:border-electric-blue/50'
                            : 'bg-white border-gray-200 hover:border-accent-red/50'
                        }`}
                      >
                        <Link to={`/academy/course/${purchase.course_id}/learn`}>
                          <div className="relative h-40 overflow-hidden">
                            <img
                              src={purchase.course_thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3'}
                              alt={purchase.course_title}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                            <div className={`absolute inset-0 bg-gradient-to-t ${
                              theme === 'dark' ? 'from-black/80 to-transparent' : 'from-black/60 to-transparent'
                            }`} />
                            <div className="absolute top-4 right-4">
                              <span className={`px-3 py-1 rounded-lg text-xs font-bold ${
                                courseProgress === 100
                                  ? theme === 'dark'
                                    ? 'bg-electric-green/20 text-electric-green border border-electric-green/30'
                                    : 'bg-green-500/20 text-green-600 border border-green-500/30'
                                  : theme === 'dark'
                                    ? 'bg-electric-blue/20 text-electric-blue border border-electric-blue/30'
                                    : 'bg-accent-blue/20 text-accent-blue border border-accent-blue/30'
                              }`}>
                                {courseProgress}% Complete
                              </span>
                            </div>
                          </div>
                          <div className="p-5">
                            <h3 className={`font-bold text-lg mb-2 line-clamp-2 ${
                              theme === 'dark' ? 'text-white' : 'text-gray-900'
                            }`}>
                              {purchase.course_title}
                            </h3>
                            <div className="mb-4">
                              <div className={`h-2 rounded-full overflow-hidden ${
                                theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200'
                              }`}>
                                <div
                                  className={`h-full rounded-full transition-all ${
                                    theme === 'dark'
                                      ? 'bg-gradient-to-r from-electric-blue to-electric-green'
                                      : 'bg-gradient-to-r from-accent-red to-accent-blue'
                                  }`}
                                  style={{ width: `${courseProgress}%` }}
                                />
                              </div>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className={`text-sm ${
                                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                              }`}>
                                {purchase.course_category}
                              </span>
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold ${
                                  theme === 'dark'
                                    ? 'bg-electric-green text-black hover:bg-electric-blue'
                                    : 'bg-accent-red text-white hover:bg-accent-blue'
                                }`}
                              >
                                <FiPlay size={16} />
                                Continue
                              </motion.button>
                            </div>
                          </div>
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>
              ) : (
                <div className={`text-center py-16 rounded-2xl border-2 ${
                  theme === 'dark' ? 'bg-dark-card border-gray-800' : 'bg-white border-gray-200'
                }`}>
                  <FiBook className={`mx-auto mb-4 ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`} size={64} />
                  <p className={`text-lg font-semibold mb-2 ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {searchTerm ? 'No courses found' : 'No enrolled courses yet'}
                  </p>
                  <p className={`text-sm mb-6 ${
                    theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                  }`}>
                    {searchTerm ? 'Try a different search term' : 'Browse courses to get started'}
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveTab('courses')}
                    className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold ${
                      theme === 'dark'
                        ? 'bg-gradient-to-r from-electric-blue to-electric-green text-black'
                        : 'bg-gradient-to-r from-accent-red to-accent-blue text-white'
                    }`}
                  >
                    Browse Courses
                    <FiArrowRight size={18} />
                  </motion.button>
                </div>
              )}
            </motion.div>
          )}

          {/* BROWSE COURSES TAB */}
          {activeTab === 'courses' && (
            <motion.div
              key="courses"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div>
                <h2 className={`text-3xl font-bold mb-2 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`} style={{ fontFamily: 'Orbitron, sans-serif' }}>
                  Browse All{' '}
                  <span className={theme === 'dark' ? 'text-electric-green' : 'text-accent-red'}>
                    Courses
                  </span>
                </h2>
                <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                  Discover courses across all domains and skill levels
                </p>
              </div>

              {/* Filters */}
              <div className={`p-6 rounded-2xl border-2 ${
                theme === 'dark' ? 'bg-dark-card border-gray-800' : 'bg-white border-gray-200'
              }`}>
                <div className="flex flex-wrap items-center gap-4">
                  <div className="relative flex-1 min-w-[200px]">
                    <FiSearch className={`absolute left-3 top-1/2 -translate-y-1/2 ${
                      theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                    }`} />
                    <input
                      type="search"
                      value={courseSearchTerm}
                      onChange={(e) => setCourseSearchTerm(e.target.value)}
                      placeholder="Search courses..."
                      className={`w-full pl-10 pr-4 py-2.5 rounded-xl border-2 ${
                        theme === 'dark'
                          ? 'bg-dark-lighter border-gray-800 text-white placeholder:text-gray-500'
                          : 'bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400'
                      }`}
                    />
                  </div>
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className={`px-4 py-2.5 rounded-xl border-2 font-semibold ${
                      theme === 'dark'
                        ? 'bg-dark-lighter border-gray-800 text-white'
                        : 'bg-white border-gray-200 text-gray-900'
                    }`}
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat === 'All' ? 'all' : cat}>{cat}</option>
                    ))}
                  </select>
                  <select
                    value={difficultyFilter}
                    onChange={(e) => setDifficultyFilter(e.target.value)}
                    className={`px-4 py-2.5 rounded-xl border-2 font-semibold ${
                      theme === 'dark'
                        ? 'bg-dark-lighter border-gray-800 text-white'
                        : 'bg-white border-gray-200 text-gray-900'
                    }`}
                  >
                    {difficulties.map(diff => (
                      <option key={diff} value={diff === 'All' ? 'all' : diff}>{diff}</option>
                    ))}
                  </select>
                  <select
                    value={priceFilter}
                    onChange={(e) => setPriceFilter(e.target.value)}
                    className={`px-4 py-2.5 rounded-xl border-2 font-semibold ${
                      theme === 'dark'
                        ? 'bg-dark-lighter border-gray-800 text-white'
                        : 'bg-white border-gray-200 text-gray-900'
                    }`}
                  >
                    {priceRanges.map(price => (
                      <option key={price} value={price === 'All' ? 'all' : price}>{price}</option>
                    ))}
                  </select>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className={`px-4 py-2.5 rounded-xl border-2 font-semibold ${
                      theme === 'dark'
                        ? 'bg-dark-lighter border-gray-800 text-white'
                        : 'bg-white border-gray-200 text-gray-900'
                    }`}
                  >
                    <option value="newest">Newest First</option>
                    <option value="price_low">Price: Low to High</option>
                    <option value="price_high">Price: High to Low</option>
                  </select>
                </div>
              </div>

              {/* Courses Grid */}
              {coursesLoading ? (
                <div className="flex justify-center py-12">
                  <div className={`h-8 w-8 animate-spin rounded-full border-4 ${
                    theme === 'dark' ? 'border-electric-blue/20 border-t-electric-blue' : 'border-accent-red/20 border-t-accent-red'
                  }`} />
                </div>
              ) : currentCourses.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {currentCourses.map((course) => {
                      const isEnrolled = purchases.some(p => p.course_id === course.id);
                      return (
                        <motion.div
                          key={course.id}
                          whileHover={{ y: -5 }}
                          className={`group rounded-2xl border-2 overflow-hidden transition-all ${
                            theme === 'dark'
                              ? 'bg-dark-card border-gray-800 hover:border-electric-blue/50'
                              : 'bg-white border-gray-200 hover:border-accent-red/50'
                          }`}
                        >
                          <Link to={`/academy/course/${course.id}`}>
                            <div className="relative h-48 overflow-hidden">
                              <img
                                src={course.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3'}
                                alt={course.title}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                              />
                              <div className={`absolute inset-0 bg-gradient-to-t ${
                                theme === 'dark' ? 'from-black/80 to-transparent' : 'from-black/60 to-transparent'
                              }`} />
                              <div className="absolute top-4 left-4">
                                <span className={`inline-block px-3 py-1 rounded-lg text-xs font-bold ${
                                  theme === 'dark'
                                    ? 'bg-electric-green/20 text-electric-green border border-electric-green/30'
                                    : 'bg-accent-red/20 text-accent-red border border-accent-red/30'
                                }`}>
                                  {course.category}
                                </span>
                              </div>
                              {isEnrolled && (
                                <div className="absolute top-4 right-4">
                                  <span className={`inline-block px-3 py-1 rounded-lg text-xs font-bold ${
                                    theme === 'dark'
                                      ? 'bg-electric-blue/20 text-electric-blue border border-electric-blue/30'
                                      : 'bg-accent-blue/20 text-accent-blue border border-accent-blue/30'
                                  }`}>
                                    Enrolled
                                  </span>
                                </div>
                              )}
                            </div>
                            <div className="p-5">
                              <h3 className={`font-bold text-lg mb-2 line-clamp-2 ${
                                theme === 'dark' ? 'text-white' : 'text-gray-900'
                              }`}>
                                {course.title}
                              </h3>
                              <p className={`text-sm mb-4 line-clamp-2 ${
                                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                              }`}>
                                {course.description}
                              </p>
                              <div className="flex items-center justify-between mb-4">
                                <span className={`text-xl font-bold ${
                                  theme === 'dark' ? 'text-electric-green' : 'text-accent-red'
                                }`}>
                                  ₹{course.price}
                                </span>
                                <div className="flex items-center gap-1">
                                  <FiStar className={theme === 'dark' ? 'text-yellow-400' : 'text-yellow-500'} size={16} />
                                  <span className={`text-sm ${
                                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                                  }`}>
                                    {course.rating || '4.5'}
                                  </span>
                                </div>
                              </div>
                              {isEnrolled ? (
                                <Link
                                  to={`/academy/course/${course.id}/learn`}
                                  className={`block w-full text-center py-2.5 rounded-xl font-semibold ${
                                    theme === 'dark'
                                      ? 'bg-electric-blue text-black hover:bg-electric-green'
                                      : 'bg-accent-blue text-white hover:bg-accent-red'
                                  }`}
                                >
                                  Continue Learning
                                </Link>
                              ) : (
                                <Link
                                  to={`/academy/checkout/${course.id}`}
                                  className={`block w-full text-center py-2.5 rounded-xl font-semibold ${
                                    theme === 'dark'
                                      ? 'bg-gradient-to-r from-electric-blue to-electric-green text-black'
                                      : 'bg-gradient-to-r from-accent-red to-accent-blue text-white'
                                  }`}
                                >
                                  Enroll Now
                                </Link>
                              )}
                            </div>
                          </Link>
                        </motion.div>
                      );
                    })}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                        className={`px-4 py-2 rounded-xl font-semibold transition-all disabled:opacity-50 ${
                          theme === 'dark'
                            ? 'bg-dark-lighter text-white disabled:cursor-not-allowed'
                            : 'bg-gray-100 text-gray-900 disabled:cursor-not-allowed'
                        }`}
                      >
                        Previous
                      </button>
                      <span className={`px-4 py-2 ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        Page {currentPage} of {totalPages}
                      </span>
                      <button
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        disabled={currentPage === totalPages}
                        className={`px-4 py-2 rounded-xl font-semibold transition-all disabled:opacity-50 ${
                          theme === 'dark'
                            ? 'bg-dark-lighter text-white disabled:cursor-not-allowed'
                            : 'bg-gray-100 text-gray-900 disabled:cursor-not-allowed'
                        }`}
                      >
                        Next
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className={`text-center py-16 rounded-2xl border-2 ${
                  theme === 'dark' ? 'bg-dark-card border-gray-800' : 'bg-white border-gray-200'
                }`}>
                  <FiBook className={`mx-auto mb-4 ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`} size={64} />
                  <p className={`text-lg font-semibold mb-2 ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    No courses found
                  </p>
                  <p className={`text-sm ${
                    theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                  }`}>
                    Try adjusting your filters
                  </p>
                </div>
              )}
            </motion.div>
          )}

          {/* PROFILE TAB */}
          {activeTab === 'profile' && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div>
                <h2 className={`text-3xl font-bold mb-2 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`} style={{ fontFamily: 'Orbitron, sans-serif' }}>
                  My{' '}
                  <span className={theme === 'dark' ? 'text-electric-green' : 'text-accent-red'}>
                    Profile
                  </span>
                </h2>
                <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                  Manage your account and view your achievements
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* User Info Card */}
                <div className={`lg:col-span-2 p-6 rounded-2xl border-2 ${
                  theme === 'dark' ? 'bg-dark-card border-gray-800' : 'bg-white border-gray-200'
                }`}>
                  <div className="flex items-center gap-6 mb-6">
                    <div className={`w-24 h-24 rounded-full bg-gradient-to-br flex items-center justify-center ${
                      theme === 'dark'
                        ? 'from-electric-blue to-electric-green'
                        : 'from-accent-red to-accent-blue'
                    }`}>
                      <FiUser className="text-white" size={40} />
                    </div>
                    <div>
                      <h3 className={`text-2xl font-bold mb-1 ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`} style={{ fontFamily: 'Orbitron, sans-serif' }}>
                        {user?.name || 'User'}
                      </h3>
                      <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                        {user?.email || 'No email'}
                      </p>
                      <RoleBadge role={user?.role || 'user'} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className={`p-4 rounded-xl ${
                      theme === 'dark' ? 'bg-dark-lighter' : 'bg-gray-50'
                    }`}>
                      <p className={`text-sm mb-1 ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        Courses Enrolled
                      </p>
                      <p className={`text-2xl font-bold ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>
                        {purchases.length}
                      </p>
                    </div>
                    <div className={`p-4 rounded-xl ${
                      theme === 'dark' ? 'bg-dark-lighter' : 'bg-gray-50'
                    }`}>
                      <p className={`text-sm mb-1 ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        Certificates
                      </p>
                      <p className={`text-2xl font-bold ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>
                        {certificates.length}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className={`p-6 rounded-2xl border-2 ${
                  theme === 'dark' ? 'bg-dark-card border-gray-800' : 'bg-white border-gray-200'
                }`}>
                  <h4 className={`font-bold mb-4 ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    Quick Stats
                  </h4>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className={`text-sm ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          Overall Progress
                        </span>
                        <span className={`text-sm font-bold ${
                          theme === 'dark' ? 'text-electric-green' : 'text-accent-red'
                        }`}>
                          {getTotalProgress()}%
                        </span>
                      </div>
                      <div className={`h-2 rounded-full overflow-hidden ${
                        theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200'
                      }`}>
                        <div
                          className={`h-full rounded-full ${
                            theme === 'dark'
                              ? 'bg-gradient-to-r from-electric-blue to-electric-green'
                              : 'bg-gradient-to-r from-accent-red to-accent-blue'
                          }`}
                          style={{ width: `${getTotalProgress()}%` }}
                        />
                      </div>
                    </div>
                    <div className={`pt-4 border-t ${
                      theme === 'dark' ? 'border-gray-800' : 'border-gray-200'
                    }`}>
                      <p className={`text-sm mb-2 ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        Time Spent Learning
                      </p>
                      <p className={`text-xl font-bold ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>
                        {Math.round(progress.reduce((sum, p) => sum + (p.total_time_spent || 0), 0) / 60)}h
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Certificates Section */}
              <div>
                <h3 className={`text-2xl font-bold mb-4 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`} style={{ fontFamily: 'Orbitron, sans-serif' }}>
                  My{' '}
                  <span className={theme === 'dark' ? 'text-electric-green' : 'text-accent-red'}>
                    Certificates
                  </span>
                </h3>
                {certificates.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {certificates.map((cert) => (
                      <motion.div
                        key={cert.id}
                        whileHover={{ y: -5 }}
                        className={`p-6 rounded-2xl border-2 ${
                          theme === 'dark'
                            ? 'bg-dark-card border-gray-800 hover:border-electric-green/50'
                            : 'bg-white border-gray-200 hover:border-accent-red/50'
                        }`}
                      >
                        <div className={`flex items-center justify-center w-16 h-16 rounded-xl mb-4 ${
                          theme === 'dark'
                            ? 'bg-electric-green/20 text-electric-green'
                            : 'bg-accent-red/20 text-accent-red'
                        }`}>
                          <FiAward size={32} />
                        </div>
                        <h4 className={`font-bold mb-2 ${
                          theme === 'dark' ? 'text-white' : 'text-gray-900'
                        }`}>
                          {cert.course_title || 'Course Certificate'}
                        </h4>
                        <p className={`text-sm mb-4 ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          Certificate ID: {cert.certificate_id}
                        </p>
                        {cert.certificate_url && (
                          <a
                            href={cert.certificate_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl font-semibold ${
                              theme === 'dark'
                                ? 'bg-electric-green text-black hover:bg-electric-blue'
                                : 'bg-accent-red text-white hover:bg-accent-blue'
                            }`}
                          >
                            <FiDownload size={16} />
                            Download
                          </a>
                        )}
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className={`text-center py-12 rounded-2xl border-2 ${
                    theme === 'dark' ? 'bg-dark-card border-gray-800' : 'bg-white border-gray-200'
                  }`}>
                    <FiAward className={`mx-auto mb-4 ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`} size={48} />
                    <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                      No certificates yet. Complete courses to earn certificates!
                    </p>
                  </div>
                )}
              </div>

              {/* Billing History */}
              <div>
                <h3 className={`text-2xl font-bold mb-4 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`} style={{ fontFamily: 'Orbitron, sans-serif' }}>
                  Billing{' '}
                  <span className={theme === 'dark' ? 'text-electric-green' : 'text-accent-red'}>
                    History
                  </span>
                </h3>
                {payments.length > 0 ? (
                  <div className={`rounded-2xl border-2 overflow-hidden ${
                    theme === 'dark' ? 'bg-dark-card border-gray-800' : 'bg-white border-gray-200'
                  }`}>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className={theme === 'dark' ? 'bg-dark-lighter' : 'bg-gray-50'}>
                          <tr>
                            <th className={`px-6 py-4 text-left text-sm font-bold ${
                              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                            }`}>
                              Course
                            </th>
                            <th className={`px-6 py-4 text-left text-sm font-bold ${
                              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                            }`}>
                              Amount
                            </th>
                            <th className={`px-6 py-4 text-left text-sm font-bold ${
                              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                            }`}>
                              Date
                            </th>
                            <th className={`px-6 py-4 text-left text-sm font-bold ${
                              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                            }`}>
                              Status
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y" style={{
                          borderColor: theme === 'dark' ? 'rgba(31, 41, 55, 0.5)' : 'rgba(229, 231, 235, 0.5)'
                        }}>
                          {payments.map((payment) => (
                            <tr key={payment.id} className={theme === 'dark' ? 'hover:bg-dark-lighter' : 'hover:bg-gray-50'}>
                              <td className={`px-6 py-4 ${
                                theme === 'dark' ? 'text-white' : 'text-gray-900'
                              }`}>
                                {payment.course_title || 'N/A'}
                              </td>
                              <td className={`px-6 py-4 font-bold ${
                                theme === 'dark' ? 'text-electric-green' : 'text-accent-red'
                              }`}>
                                ₹{payment.amount || 0}
                              </td>
                              <td className={`px-6 py-4 ${
                                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                              }`}>
                                {payment.created_at ? new Date(payment.created_at).toLocaleDateString() : 'N/A'}
                              </td>
                              <td className="px-6 py-4">
                                <span className={`inline-block px-3 py-1 rounded-lg text-xs font-bold ${
                                  payment.status === 'paid' || payment.status === 'completed'
                                    ? theme === 'dark'
                                      ? 'bg-electric-green/20 text-electric-green border border-electric-green/30'
                                      : 'bg-green-500/20 text-green-600 border border-green-500/30'
                                    : theme === 'dark'
                                      ? 'bg-yellow-400/20 text-yellow-400 border border-yellow-400/30'
                                      : 'bg-yellow-500/20 text-yellow-600 border border-yellow-500/30'
                                }`}>
                                  {payment.status || 'Pending'}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  <div className={`text-center py-12 rounded-2xl border-2 ${
                    theme === 'dark' ? 'bg-dark-card border-gray-800' : 'bg-white border-gray-200'
                  }`}>
                    <FiCreditCard className={`mx-auto mb-4 ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`} size={48} />
                    <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                      No payment history yet
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      </div>
    </>
  );
};

export default UserDashboard;
