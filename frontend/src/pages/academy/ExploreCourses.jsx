import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { coursesAPI } from '../../utils/api';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { FiSearch, FiLogOut } from 'react-icons/fi';
import { Sun, Moon, GraduationCap, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import RoleBadge from '../../components/academy/RoleBadge';
import SEO from '../../components/SEO';

const ExploreCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');
  const [sortBy, setSortBy] = useState('');
  const { user, logout, loading: authLoading } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const categories = ['Web Development', 'Backend Development', 'Data Science', 'Mobile Development', 'DevOps', 'AI & ML'];

  useEffect(() => {
    fetchCourses();
  }, [searchTerm, category, sortBy]);

  const fetchCourses = async () => {
    try {
      const params = {};
      if (searchTerm) params.search = searchTerm;
      if (category) params.category = category;
      if (sortBy) params.sortBy = sortBy;

      const response = await coursesAPI.getAll(params);
      setCourses(response.data.courses);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/academy/dashboard');
  };

  return (
    <>
      <SEO
        title="Explore Courses | NanoFlows Academy"
        description="Browse and explore comprehensive courses on web development, data science, mobile development, DevOps, AI & ML, and more."
        keywords="courses, online courses, web development courses, data science courses, e-learning, academy courses"
      />
      <div className={`min-h-screen transition-colors duration-300 ${theme === 'dark' ? 'bg-dark-bg' : 'bg-gray-50'}`}>
        <header className={`sticky top-0 z-50 border-b backdrop-blur-md ${
        theme === 'dark' 
          ? 'border-gray-800/50 bg-dark-card/90 shadow-lg shadow-black/20' 
          : 'border-gray-200/50 bg-white/90 shadow-md shadow-gray-200/20'
      }`}>
        <div className="mx-auto max-w-7xl px-3 sm:px-4 py-2.5 sm:py-3 lg:px-8">
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Back Button - Total Left */}
            <motion.button
                onClick={() => navigate('/academy/dashboard')}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              whileHover={{ 
                scale: 1.1, 
                x: -8,
                transition: { duration: 0.2, ease: "easeOut" }
              }}
              whileTap={{ 
                scale: 0.95,
                x: -12,
                transition: { duration: 0.1 }
              }}
              className={`flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl transition-all relative overflow-hidden group ${
                theme === 'dark'
                  ? 'bg-dark-lighter hover:bg-gray-700 text-gray-200 hover:text-electric-green'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-800 hover:text-accent-red'
              }`}
              title="Back to Platform Selection"
              aria-label="Back to Platform Selection"
            >
              <motion.div
                animate={{
                  x: [0, -3, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="flex items-center justify-center"
              >
                <ArrowLeft className="h-5 w-5" />
              </motion.div>
              {/* Animated background effect on hover */}
              <motion.div
                className={`absolute inset-0 rounded-xl ${
                  theme === 'dark' ? 'bg-electric-green/20' : 'bg-accent-red/20'
                }`}
                initial={{ scale: 0, opacity: 0 }}
                whileHover={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
            </motion.button>
            
            <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
            {/* Logo and Branding */}
            <Link to="/academy/dashboard" className="flex items-center gap-2 sm:gap-3 group flex-shrink-0">
              <motion.div 
                whileHover={{ scale: 1.05, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                className={`flex h-9 w-9 sm:h-11 sm:w-11 items-center justify-center rounded-lg bg-gradient-to-br shadow-md transition-all duration-300 ${
                  theme === 'dark'
                    ? 'from-electric-blue to-electric-green shadow-electric-blue/30 group-hover:shadow-electric-blue/50'
                    : 'from-accent-red to-accent-blue shadow-accent-red/30 group-hover:shadow-accent-red/50'
                }`}
              >
                <GraduationCap className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
              </motion.div>
              <div className="hidden sm:block min-w-0">
                <p className={`text-[10px] font-bold uppercase tracking-wider ${
                  theme === 'dark' ? 'text-electric-green' : 'text-accent-red'
                }`}>
                  NanoFlows
                </p>
                <h1 className={`text-sm sm:text-base font-bold leading-tight truncate ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`} style={{ fontFamily: 'Orbitron, sans-serif' }}>
                  Explore Courses
                </h1>
              </div>
            </Link>
            </div>
            
            {/* Search Bar - Centered */}
            <div className="hidden md:flex flex-1 max-w-2xl mx-6">
              <div className="relative w-full">
                <FiSearch className={`pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-900'
                }`} />
                <input
                  type="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search for courses, instructors, or topics..."
                  className={`w-full rounded-lg border px-4 py-2.5 pl-11 pr-4 text-sm transition-all duration-200 focus:outline-none focus:ring-2 ${
                    theme === 'dark'
                      ? 'border-gray-700/50 bg-dark-lighter/50 text-white placeholder:text-gray-500 focus:border-electric-blue/50 focus:ring-electric-blue/20 focus:bg-dark-lighter'
                      : 'border-gray-300/50 bg-gray-50 text-gray-900 placeholder:text-gray-600 focus:border-accent-blue/50 focus:ring-accent-blue/20 focus:bg-white'
                  }`}
                />
              </div>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
              {/* Mobile Search Button */}
              <button
                onClick={() => {
                  const searchInput = document.querySelector('input[type="search"]');
                  if (searchInput) searchInput.focus();
                }}
                className={`md:hidden flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-lg transition-all ${
                  theme === 'dark'
                    ? 'bg-dark-lighter hover:bg-gray-700 text-gray-400 hover:text-electric-blue'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-800 hover:text-accent-blue'
                }`}
                aria-label="Search courses"
              >
                <FiSearch size={16} className="sm:w-[18px] sm:h-[18px]" />
              </button>

              {/* Navigation Links */}
              <div className="hidden lg:flex items-center gap-2">
                <motion.button
                  onClick={() => navigate('/academy/dashboard')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                    theme === 'dark'
                      ? 'bg-electric-green text-black hover:bg-electric-blue'
                      : 'bg-accent-red text-white hover:bg-accent-blue'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  My Learning
                </motion.button>
              </div>

              {/* User Info */}
              <div className={`hidden xl:flex items-center gap-2 px-4 py-2 rounded-lg ${
                theme === 'dark' ? 'bg-dark-lighter/70 border border-electric-blue/30' : 'bg-gray-100/70 border border-accent-blue/30'
              }`}>
                <div className="text-right">
                  <p className={`text-xs font-semibold ${
                    theme === 'dark' 
                      ? 'bg-gradient-to-r from-electric-blue to-electric-green bg-clip-text text-transparent' 
                      : 'bg-gradient-to-r from-accent-red to-accent-blue bg-clip-text text-transparent'
                  }`}>
                    Welcome back
                  </p>
                  <p className={`text-sm font-bold ${
                    theme === 'dark' 
                      ? 'bg-gradient-to-r from-electric-green to-electric-blue bg-clip-text text-transparent' 
                      : 'bg-gradient-to-r from-accent-blue to-accent-red bg-clip-text text-transparent'
                  }`}>
                    {authLoading ? '...' : (user?.name?.split(' ')[0] || 'User')}
                  </p>
                </div>
                {user?.role && <RoleBadge role={user.role} size="sm" />}
              </div>

              {/* Theme Toggle */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleTheme}
                className={`flex h-9 w-9 items-center justify-center rounded-lg transition-all duration-200 ${
                  theme === 'dark'
                    ? 'bg-dark-lighter hover:bg-gray-700 text-electric-blue'
                    : 'bg-gray-100 hover:bg-gray-200 text-accent-blue'
                }`}
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
              </motion.button>
              
              {/* Logout Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  theme === 'dark'
                    ? 'bg-red-600/30 text-red-300 border border-red-500/50 hover:bg-red-600/40 hover:border-red-400 hover:text-red-200'
                    : 'bg-red-100 text-red-700 border border-red-300 hover:bg-red-200 hover:border-red-400 hover:text-red-800'
                }`}
                aria-label="Log out"
              >
                <FiLogOut size={16} />
                <span className="hidden sm:inline">Logout</span>
              </motion.button>
            </div>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden border-t px-4 py-3" style={{
          borderColor: theme === 'dark' ? 'rgba(31, 41, 55, 0.5)' : 'rgba(229, 231, 235, 0.5)'
        }}>
          <div className="relative">
            <FiSearch className={`pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 ${
              theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
            }`} />
            <input
              type="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search courses..."
              className={`w-full rounded-lg border px-4 py-2.5 pl-10 pr-4 text-sm transition-all focus:outline-none focus:ring-2 ${
                theme === 'dark'
                  ? 'border-gray-700/50 bg-dark-lighter/50 text-white placeholder:text-gray-500 focus:border-electric-blue/50 focus:ring-electric-blue/20 focus:bg-dark-lighter'
                  : 'border-gray-300/50 bg-gray-50 text-gray-900 placeholder:text-gray-400 focus:border-accent-blue/50 focus:ring-accent-blue/20 focus:bg-white'
              }`}
            />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <section className={`relative overflow-hidden rounded-xl border-2 p-8 shadow-xl lg:p-12 ${
          theme === 'dark'
            ? 'bg-dark-lighter border-gray-700'
            : 'bg-white border-gray-200'
        }`}>
          <div className={`absolute -right-20 -top-20 h-64 w-64 rounded-full blur-3xl ${
            theme === 'dark' ? 'bg-electric-blue/10' : 'bg-accent-red/10'
          }`} />
          <div className={`absolute -bottom-10 -left-10 h-48 w-48 rounded-full blur-2xl ${
            theme === 'dark' ? 'bg-electric-green/10' : 'bg-accent-blue/10'
          }`} />
          <div className="relative z-10 max-w-2xl space-y-4">
            <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${
              theme === 'dark'
                ? 'border-electric-blue/30 bg-electric-blue/10 text-electric-blue'
                : 'border-accent-red/30 bg-accent-red/10 text-accent-red'
            }`}>
              Learning paths
            </span>
            <h1 className={`text-3xl font-semibold leading-tight sm:text-4xl ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Master AI, engineering, and product innovation with industry-grade courses
            </h1>
            <p className={`text-base ${
              theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
            }`}>
              Build job-ready skills, earn certificates, and accelerate your career with NanoFlows Academy's curated curriculum.
            </p>
            <div className="flex flex-wrap gap-4 text-sm">
              <span className={`inline-flex items-center gap-2 rounded-full border-2 px-4 py-2 ${
                theme === 'dark'
                  ? 'border-gray-700 bg-dark-card text-gray-300'
                  : 'border-gray-200 bg-gray-50 text-gray-800'
              }`}>
                <span className={`h-2 w-2 rounded-full ${
                  theme === 'dark' ? 'bg-electric-blue' : 'bg-accent-blue'
                }`} />
                Fresh content every week
              </span>
              <span className={`inline-flex items-center gap-2 rounded-full border-2 px-4 py-2 ${
                theme === 'dark'
                  ? 'border-gray-700 bg-dark-card text-gray-300'
                  : 'border-gray-200 bg-gray-50 text-gray-800'
              }`}>
                <span className={`h-2 w-2 rounded-full ${
                  theme === 'dark' ? 'bg-electric-blue' : 'bg-accent-blue'
                }`} />
                Guided projects & certifications
              </span>
            </div>
          </div>
        </section>

        <section className="mt-10 space-y-8">
          <div className={`rounded-xl border-2 p-6 shadow-xl ${
            theme === 'dark'
              ? 'bg-dark-lighter border-gray-700'
              : 'bg-white border-gray-200'
          }`}>
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className={`text-2xl font-semibold ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>Explore courses</h2>
                <p className={`mt-1 text-sm ${
                  theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
                }`}>Search full catalog, filter by category, and sort by pricing.</p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <label className={`text-sm ${
                  theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
                }`} htmlFor="sort">
                  Sort by
                </label>
                <select
                  id="sort"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className={`rounded-lg border-2 px-4 py-2 text-sm transition focus:outline-none focus:ring-2 ${
                    theme === 'dark'
                      ? 'bg-dark-card border-gray-700 text-white focus:border-electric-blue focus:ring-electric-blue/20'
                      : 'bg-white border-gray-300 text-gray-900 focus:border-accent-blue focus:ring-accent-blue/20'
                  }`}
                >
                  <option value="">Recommended</option>
                  <option value="price_low">Price: Low to high</option>
                  <option value="price_high">Price: High to low</option>
                </select>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setCategory('')}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  category === ''
                    ? theme === 'dark'
                      ? 'bg-electric-green text-black shadow-lg'
                      : 'bg-accent-red text-white shadow-lg'
                    : theme === 'dark'
                      ? 'bg-dark-card text-gray-200 hover:bg-gray-700 border border-gray-700'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200 border border-gray-200'
                }`}
              >
                All categories
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                    category === cat
                      ? theme === 'dark'
                        ? 'bg-electric-green text-black shadow-lg'
                        : 'bg-accent-red text-white shadow-lg'
                      : theme === 'dark'
                        ? 'bg-dark-card text-gray-400 hover:bg-gray-700 border border-gray-700'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200 border border-gray-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className={`flex items-center justify-center rounded-xl border-2 py-20 shadow-xl ${
              theme === 'dark'
                ? 'border-gray-700 bg-dark-lighter'
                : 'border-gray-200 bg-white'
            }`}>
              <div className={`text-lg ${
                theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
              }`}>Loading courses…</div>
            </div>
          ) : courses.length === 0 ? (
            <div className={`rounded-xl border-2 py-16 text-center shadow-xl ${
              theme === 'dark'
                ? 'border-gray-700 bg-dark-lighter'
                : 'border-gray-200 bg-white'
            }`}>
              <p className={`text-xl font-semibold ${
                theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
              }`}>No courses match your filters.</p>
              <p className={`mt-2 text-sm ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>Try adjusting your search or category selection.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 xl:grid-cols-3 px-2 sm:px-0">
              {courses.map((course) => (
                <div
                  key={course.id}
                  className={`group flex h-full flex-col overflow-hidden rounded-xl border-2 shadow-lg transition hover:-translate-y-1 hover:shadow-xl ${
                    theme === 'dark'
                      ? 'bg-dark-lighter border-gray-700 hover:border-electric-blue hover:shadow-[0_0_30px_rgba(10,186,181,0.3)]'
                      : 'bg-white border-gray-200 hover:border-accent-red hover:shadow-xl'
                  }`}
                >
                  <div className="relative">
                    <img
                      src={course.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3'}
                      alt={course.title}
                      className="h-48 w-full object-cover"
                    />
                    <span className={`absolute right-4 top-4 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${
                      theme === 'dark'
                        ? 'bg-dark-card/80 text-gray-300'
                        : 'bg-white/80 text-gray-800'
                    }`}>
                      {course.level || 'All levels'}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <div className={`text-xs font-semibold uppercase tracking-wider ${
                      theme === 'dark' ? 'text-electric-blue' : 'text-accent-red'
                    }`}>
                      {course.category}
                    </div>
                    <h3 className={`mt-3 text-lg font-semibold ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                      {course.title}
                    </h3>
                    <p className={`mt-2 line-clamp-3 text-sm flex-grow ${
                      theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
                    }`}>{course.description}</p>
                    <div className={`mt-4 flex items-center justify-between text-sm ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-900'
                    }`}>
                      <span>Instructor: {course.instructor_name}</span>
                      <span>{course.duration || 'Self-paced'}</span>
                    </div>
                    <div className="mt-5 flex items-center justify-between">
                      <div className={`text-2xl font-semibold ${
                        theme === 'dark' ? 'text-electric-green' : 'text-accent-red'
                      }`}>₹{course.price}</div>
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        theme === 'dark'
                          ? 'bg-dark-card text-gray-200'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {course.lessons ? `${course.lessons} lessons` : 'On-demand video'}
                      </span>
                    </div>
                    <Link
                      to={`/academy/course/${course.id}`}
                      className={`mt-auto inline-flex w-full items-center justify-center rounded-lg px-4 py-3 text-sm font-semibold text-white shadow-md transition hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 ${
                        theme === 'dark'
                          ? 'bg-electric-green hover:bg-electric-blue shadow-electric-green/30 focus-visible:ring-electric-blue'
                          : 'bg-accent-red hover:bg-accent-blue shadow-accent-red/30 focus-visible:ring-accent-blue'
                      }`}
                    >
                      View course details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
      </div>
    </>
  );
};

export default ExploreCourses;
