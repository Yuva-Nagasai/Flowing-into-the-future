import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { coursesAPI, purchasesAPI, progressAPI, modulesAPI } from '../../utils/api';
import { useAuth } from '../../contexts/AuthContext';
import AdminAnalytics from './AdminAnalytics';
import { useTheme } from '../../context/ThemeContext';
import {
  FiPlus,
  FiEdit,
  FiTrash2,
  FiLogOut,
  FiDollarSign,
  FiUsers,
  FiBook,
  FiTrendingUp,
  FiFilter,
  FiSearch,
  FiZap,
  FiSliders,
  FiBriefcase,
  FiBarChart2,
  FiHome,
  FiMenu,
  FiX,
  FiActivity,
  FiClock,
  FiArrowUpRight,
  FiArrowDownRight,
  FiCheckCircle,
  FiAlertCircle,
  FiFileText,
  FiVideo,
  FiAward,
  FiLayers,
  FiHelpCircle,
  FiUserPlus,
  FiAward as FiCertificate
} from 'react-icons/fi';
import { Sun, Moon, Bell, Settings, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Modal from '../../components/Modal';
import ConfirmModal from '../../components/ConfirmModal';

const AdminDashboard = () => {
  const [courses, setCourses] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [studentProgress, setStudentProgress] = useState([]);
  const [signups, setSignups] = useState([]);
  const [elearningStats, setElearningStats] = useState({
    totalModules: 0,
    totalLessons: 0,
    avgProgress: 0,
    completedCourses: 0
  });
  const [stats, setStats] = useState({ 
    totalRevenue: 0, 
    totalCourses: 0, 
    totalPurchases: 0,
    monthlyRevenue: 0,
    monthlyPurchases: 0
  });
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [activeView, setActiveView] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteCourseId, setDeleteCourseId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [successModal, setSuccessModal] = useState({ open: false, message: '' });
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'cards'
  const { logout, user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  // Refresh courses when returning to courses view
  useEffect(() => {
    if (activeView === 'courses') {
      fetchData();
    }
  }, [activeView]);

  const fetchData = async () => {
    try {
      const [coursesRes, purchasesRes] = await Promise.all([
        coursesAPI.getAllAdmin(),
        purchasesAPI.getAllPurchases()
      ]);

      setCourses(coursesRes.data.courses);
      setPurchases(purchasesRes.data.purchases);

      // Fetch eLearning-specific data
      try {
        const [progressRes, modulesRes] = await Promise.all([
          progressAPI.getAllProgress().catch(() => ({ data: { courses: [] } })),
          Promise.all(coursesRes.data.courses.map(course => 
            modulesAPI.getByCourse(course.id).catch(() => ({ data: { modules: [] } }))
          ))
        ]);

        const allProgress = progressRes.data.courses || [];
        setStudentProgress(allProgress);
        setSignups(progressRes.data.signups || []);

        // Calculate eLearning stats
        let totalModules = 0;
        let totalLessons = 0;
        modulesRes.forEach(res => {
          // Handle different response formats
          const modules = res.data?.modules || res.data || [];
          totalModules += Array.isArray(modules) ? modules.length : 0;
          if (Array.isArray(modules)) {
            modules.forEach(module => {
              totalLessons += (module.lessons?.length || 0);
            });
          }
        });

        const avgProgress = allProgress.length > 0
          ? Math.round(allProgress.reduce((sum, p) => sum + (p.progress_percentage || 0), 0) / allProgress.length)
          : 0;

        const completedCourses = allProgress.filter(p => p.progress_percentage >= 100).length;

        setElearningStats({
          totalModules,
          totalLessons,
          avgProgress,
          completedCourses
        });
      } catch (elearningError) {
        console.error('Error fetching eLearning data:', elearningError);
      }

      const totalRevenue = purchasesRes.data.purchases.reduce(
        (sum, purchase) => sum + parseFloat(purchase.amount || 0),
        0
      );

      // Calculate monthly stats
      const now = new Date();
      const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const monthlyPurchases = purchasesRes.data.purchases.filter(
        p => new Date(p.purchased_at) >= thisMonth
      );
      const monthlyRevenue = monthlyPurchases.reduce(
        (sum, purchase) => sum + parseFloat(purchase.amount || 0),
        0
      );

      setStats({
        totalRevenue,
        totalCourses: coursesRes.data.courses.length,
        totalPurchases: purchasesRes.data.purchases.length,
        monthlyRevenue,
        monthlyPurchases: monthlyPurchases.length
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCourse = async () => {
    if (!deleteCourseId) return;
    
    setDeleteLoading(true);
    try {
      await coursesAPI.delete(deleteCourseId);
      setDeleteModalOpen(false);
      setDeleteCourseId(null);
      setSuccessModal({ open: true, message: 'Course deleted successfully!' });
      fetchData();
    } catch (error) {
      setSuccessModal({ open: true, message: 'Error deleting course' });
    } finally {
      setDeleteLoading(false);
    }
  };

  const openDeleteModal = (id) => {
    setDeleteCourseId(id);
    setDeleteModalOpen(true);
  };

  const handleTogglePublish = async (course) => {
    try {
      await coursesAPI.update(course.id, { published: !course.published });
      setSuccessModal({ 
        open: true, 
        message: `Course ${course.published ? 'unpublished' : 'published'} successfully!` 
      });
      fetchData();
    } catch (error) {
      setSuccessModal({ open: true, message: 'Error updating course' });
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/academy/dashboard');
  };

  const filteredCourses = courses.filter((course) => {
    const normalizedQuery = query.trim().toLowerCase();
    const matchesQuery =
      !normalizedQuery ||
      course.title.toLowerCase().includes(normalizedQuery) ||
      course.instructor_name?.toLowerCase().includes(normalizedQuery);

    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'published' && course.published) ||
      (statusFilter === 'draft' && !course.published);

    return matchesQuery && matchesStatus;
  });

  // Build recent activity feed combining signups and enrollments
  const activityFeed = (() => {
    const signupItems = (signups || []).map((signup) => ({
      type: 'signup',
      id: `signup-${signup.user_id}-${signup.created_at}`,
      name: signup.user_name || 'New Student',
      detail: signup.user_email || 'N/A',
      date: signup.created_at
    }));

    const enrollmentItems = (purchases || []).map((purchase) => ({
      type: 'enrollment',
      id: `enrollment-${purchase.id}`,
      name: purchase.user_name || 'Student',
      detail: purchase.course_title || 'Course enrollment',
      amount: purchase.amount,
      date: purchase.purchased_at
    }));

    return [...signupItems, ...enrollmentItems]
      .filter((item) => !!item.date)
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 10);
  })();

  // Calculate growth percentage (mock for now, can be enhanced)
  const revenueGrowth = stats.monthlyRevenue > 0 ? 18 : 0;
  const enrollmentGrowth = stats.monthlyPurchases > 0 ? 12 : 0;

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: FiHome },
    { id: 'courses', label: 'Courses', icon: FiBook },
    { id: 'students', label: 'Student Progress', icon: FiUsers },
    { id: 'analytics', label: 'Analytics', icon: FiBarChart2 },
  ];

  const StatCard = ({ icon: Icon, label, value, subtitle, trend, trendValue, gradient }) => {
    const isPositive = trend === 'up';
    const gradientColors = {
      blue: 'from-blue-500 to-cyan-500',
      green: 'from-emerald-500 to-teal-500',
      purple: 'from-purple-500 to-violet-500',
      orange: 'from-orange-500 to-amber-500',
      pink: 'from-pink-500 to-rose-500',
    };
    const gradientClass = gradientColors[gradient] || (theme === 'dark' ? 'from-electric-blue to-electric-green' : 'from-accent-red to-accent-blue');
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -4, transition: { duration: 0.2 } }}
        className={`group relative overflow-hidden rounded-2xl p-6 transition-all duration-300 ${
          theme === 'dark'
            ? 'bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-slate-700/50 hover:border-electric-blue/50 shadow-xl shadow-black/20 hover:shadow-electric-blue/10'
            : 'bg-white border border-gray-100 hover:border-gray-200 shadow-lg shadow-gray-200/50 hover:shadow-xl'
        }`}
      >
        <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-20 transition-opacity group-hover:opacity-30 bg-gradient-to-br ${gradientClass}`} />
        
        <div className="relative flex items-start justify-between">
          <div className="flex-1">
            <p className={`text-xs font-bold uppercase tracking-wider mb-3 ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
            }`}>
              {label}
            </p>
            <p className={`text-3xl font-bold mb-1.5 tracking-tight ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              {value}
            </p>
            {subtitle && (
              <p className={`text-sm font-medium ${
                theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
              }`}>
                {subtitle}
              </p>
            )}
            {trend && (
              <div className={`mt-4 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                isPositive
                  ? theme === 'dark' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-green-100 text-green-700'
                  : theme === 'dark' ? 'bg-red-500/20 text-red-400' : 'bg-red-100 text-red-700'
              }`}>
                {isPositive ? <FiArrowUpRight size={14} /> : <FiArrowDownRight size={14} />}
                {trendValue}
              </div>
            )}
          </div>
          <div className={`flex h-14 w-14 items-center justify-center rounded-2xl shadow-lg transition-all duration-300 bg-gradient-to-br ${gradientClass}`}>
            <Icon size={24} className="text-white" />
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 flex ${
      theme === 'dark' ? 'bg-dark-bg' : 'bg-gray-50'
    }`}>
      {/* Sidebar */}
      <aside className={`hidden lg:flex flex-col w-64 border-r transition-colors duration-300 ${
        theme === 'dark' ? 'border-gray-800 bg-dark-card' : 'border-gray-200 bg-white'
      }`}>
        {/* Logo */}
        <div className={`flex items-center gap-3 px-6 py-6 border-b ${
          theme === 'dark' ? 'border-gray-800' : 'border-gray-200'
        }`}>
          <motion.div 
            whileHover={{ scale: 1.05, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
            className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br shadow-lg transition-all duration-300 ${
              theme === 'dark'
                ? 'from-electric-blue to-electric-green shadow-electric-blue/40'
                : 'from-accent-red to-accent-blue shadow-accent-red/40'
            }`}
          >
            <Shield className="h-6 w-6 text-white" />
          </motion.div>
          <div>
            <p className={`text-sm font-bold uppercase tracking-[0.2em] ${
              theme === 'dark' ? 'text-electric-green' : 'text-accent-red'
            }`}>
              NanoFlows
            </p>
            <p className={`text-xl font-bold ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`} style={{ fontFamily: 'Orbitron, sans-serif' }}>
              Admin Panel
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all ${
                  isActive
                    ? theme === 'dark'
                      ? 'bg-electric-green text-black shadow-lg shadow-electric-green/30'
                      : 'bg-accent-red text-white shadow-lg shadow-accent-red/30'
                    : theme === 'dark'
                      ? 'text-gray-400 hover:bg-gray-800 hover:text-white'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <Icon size={20} />
                {item.label}
              </button>
            );
          })}
          
          {/* Separator Line */}
          <div className={`my-4 border-t ${
            theme === 'dark' ? 'border-gray-800' : 'border-gray-200'
          }`} />
          
          {/* Student Management */}
          <Link
            to="/academy/admin/students"
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all ${
              theme === 'dark'
                ? 'text-gray-400 hover:bg-gray-800 hover:text-white'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            }`}
          >
            <FiUsers size={20} />
            Student Management
          </Link>
          
          {/* Payment Management */}
          <Link
            to="/academy/admin/payments"
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all ${
              theme === 'dark'
                ? 'text-gray-400 hover:bg-gray-800 hover:text-white'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            }`}
          >
            <FiDollarSign size={20} />
            Payment Management
          </Link>
          
          {/* Certificate Management */}
          <Link
            to="/academy/admin/certificates"
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all ${
              theme === 'dark'
                ? 'text-gray-400 hover:bg-gray-800 hover:text-white'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            }`}
          >
            <FiCertificate size={20} />
            Certificate Management
          </Link>
          
          {/* Notification Management */}
          <Link
            to="/academy/admin/notifications"
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all ${
              theme === 'dark'
                ? 'text-gray-400 hover:bg-gray-800 hover:text-white'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            }`}
          >
            <Bell size={20} />
            Notification Management
          </Link>
          
          {/* Separator Line */}
          <div className={`my-4 border-t ${
            theme === 'dark' ? 'border-gray-800' : 'border-gray-200'
          }`} />
          
          {/* AI Tools */}
          <Link
            to="/academy/admin/ai-tools"
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all ${
              theme === 'dark'
                ? 'text-gray-400 hover:bg-gray-800 hover:text-white'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            }`}
          >
            <FiZap size={20} />
            AI Tools
          </Link>
          
          {/* About Sections */}
          <Link
            to="/academy/admin/about"
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all ${
              theme === 'dark'
                ? 'text-gray-400 hover:bg-gray-800 hover:text-white'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            }`}
          >
            <FiBook size={20} />
            About Sections
          </Link>

          {/* Hero Slides */}
          <Link
            to="/academy/admin/hero-slides"
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all ${
              theme === 'dark'
                ? 'text-gray-400 hover:bg-gray-800 hover:text-white'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            }`}
          >
            <FiSliders size={20} />
            Hero Slides
          </Link>
          
          {/* Manage Jobs */}
          <Link
            to="/academy/admin/jobs"
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all ${
              theme === 'dark'
                ? 'text-gray-400 hover:bg-gray-800 hover:text-white'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            }`}
          >
            <FiBriefcase size={20} />
            Manage Jobs
          </Link>
        </nav>


        {/* User Section */}
        <div className={`px-4 py-4 border-t ${
          theme === 'dark' ? 'border-gray-800 bg-dark-lighter' : 'border-gray-200 bg-gray-50'
        }`}>
          <div className={`flex items-center gap-3 px-4 py-3 rounded-xl ${
            theme === 'dark' ? 'bg-dark-lighter' : 'bg-white'
          }`}>
            <div className={`flex h-10 w-10 items-center justify-center rounded-full ${
              theme === 'dark' ? 'bg-electric-blue/20 text-electric-blue' : 'bg-accent-red/20 text-accent-red'
            }`}>
              <FiUsers size={18} />
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-semibold truncate ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                {user?.name || 'Admin'}
              </p>
              <p className={`text-xs truncate ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`}>
                Administrator
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              className={`fixed left-0 top-0 z-50 h-full w-64 flex flex-col ${
                theme === 'dark' ? 'bg-dark-card border-r border-gray-800' : 'bg-white border-r border-gray-200'
              } lg:hidden`}
            >
              {/* Same sidebar content as desktop but with close button */}
              <div className={`flex items-center justify-between px-6 py-6 border-b ${
                theme === 'dark' ? 'border-gray-800' : 'border-gray-200'
              }`}>
                <div className="flex items-center gap-3">
                  <motion.div 
                    whileHover={{ scale: 1.05, rotate: 5 }}
                    whileTap={{ scale: 0.95 }}
                    className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br shadow-lg transition-all duration-300 ${
                      theme === 'dark'
                        ? 'from-electric-blue to-electric-green shadow-electric-blue/40'
                        : 'from-accent-red to-accent-blue shadow-accent-red/40'
                    }`}
                  >
                    <Shield className="h-6 w-6 text-white" />
                  </motion.div>
                  <div>
                    <p className={`text-sm font-bold uppercase tracking-[0.2em] ${
                      theme === 'dark' ? 'text-electric-green' : 'text-accent-red'
                    }`}>
                      NanoFlows
                    </p>
                    <p className={`text-xl font-bold ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`} style={{ fontFamily: 'Orbitron, sans-serif' }}>Admin Panel</p>
                  </div>
                </div>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className={`p-2 rounded-lg ${
                    theme === 'dark' ? 'text-gray-400 hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <FiX size={20} />
                </button>
              </div>
              <nav className="flex-1 px-4 py-6 space-y-2">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeView === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveView(item.id);
                        setSidebarOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold ${
                        isActive
                          ? theme === 'dark'
                            ? 'bg-electric-green text-black'
                            : 'bg-accent-red text-white'
                          : theme === 'dark'
                            ? 'text-gray-400 hover:bg-gray-800'
                            : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <Icon size={20} />
                      {item.label}
                    </button>
                  );
                })}
                
                {/* Separator Line */}
                <div className={`my-4 border-t ${
                  theme === 'dark' ? 'border-gray-800' : 'border-gray-200'
                }`} />
                
                {/* Student Management */}
                <Link
                  to="/academy/admin/students"
                  onClick={() => setSidebarOpen(false)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all ${
                    theme === 'dark'
                      ? 'text-gray-400 hover:bg-gray-800 hover:text-white'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <FiUsers size={20} />
                  Student Management
                </Link>
                
                {/* Payment Management */}
                <Link
                  to="/academy/admin/payments"
                  onClick={() => setSidebarOpen(false)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all ${
                    theme === 'dark'
                      ? 'text-gray-400 hover:bg-gray-800 hover:text-white'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <FiDollarSign size={20} />
                  Payment Management
                </Link>
                
                {/* Certificate Management */}
                <Link
                  to="/academy/admin/certificates"
                  onClick={() => setSidebarOpen(false)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all ${
                    theme === 'dark'
                      ? 'text-gray-400 hover:bg-gray-800 hover:text-white'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <FiCertificate size={20} />
                  Certificate Management
                </Link>
                
                {/* Notification Management */}
                <Link
                  to="/academy/admin/notifications"
                  onClick={() => setSidebarOpen(false)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all ${
                    theme === 'dark'
                      ? 'text-gray-400 hover:bg-gray-800 hover:text-white'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <Bell size={20} />
                  Notification Management
                </Link>
                
                {/* Separator Line */}
                <div className={`my-4 border-t ${
                  theme === 'dark' ? 'border-gray-800' : 'border-gray-200'
                }`} />
                
                {/* AI Tools */}
                <Link
                  to="/academy/admin/ai-tools"
                  onClick={() => setSidebarOpen(false)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all ${
                    theme === 'dark'
                      ? 'text-gray-400 hover:bg-gray-800 hover:text-white'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <FiZap size={20} />
                  AI Tools
                </Link>
                
                {/* About Sections */}
                <Link
                  to="/academy/admin/about"
                  onClick={() => setSidebarOpen(false)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all ${
                    theme === 'dark'
                      ? 'text-gray-400 hover:bg-gray-800 hover:text-white'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <FiBook size={20} />
                  About Sections
                </Link>
                
                {/* Hero Slides */}
                <Link
                  to="/academy/admin/hero-slides"
                  onClick={() => setSidebarOpen(false)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all ${
                    theme === 'dark'
                      ? 'text-gray-400 hover:bg-gray-800 hover:text-white'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <FiSliders size={20} />
                  Hero Slides
                </Link>
                
                {/* Manage Jobs */}
                <Link
                  to="/academy/admin/jobs"
                  onClick={() => setSidebarOpen(false)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all ${
                    theme === 'dark'
                      ? 'text-gray-400 hover:bg-gray-800 hover:text-white'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <FiBriefcase size={20} />
                  Manage Jobs
                </Link>
              </nav>
              
              {/* User Section */}
              <div className={`px-4 py-4 border-t ${
                theme === 'dark' ? 'border-gray-800 bg-dark-lighter' : 'border-gray-200 bg-gray-50'
              }`}>
                <div className={`flex items-center gap-3 px-4 py-3 rounded-xl ${
                  theme === 'dark' ? 'bg-dark-lighter' : 'bg-white'
                }`}>
                  <div className={`flex h-10 w-10 items-center justify-center rounded-full ${
                    theme === 'dark' ? 'bg-electric-blue/20 text-electric-blue' : 'bg-accent-red/20 text-accent-red'
                  }`}>
                    <FiUsers size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-semibold truncate ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                      {user?.name || 'Admin'}
                    </p>
                    <p className={`text-xs truncate ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      Administrator
                    </p>
                  </div>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className={`sticky top-0 z-30 border-b backdrop-blur-xl ${
          theme === 'dark' ? 'border-gray-800 bg-dark-card/95' : 'border-gray-200 bg-white/95'
        }`}>
          <div className="flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className={`lg:hidden p-2 rounded-lg ${
                  theme === 'dark' ? 'text-gray-400 hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <FiMenu size={24} />
              </button>
              <div>
                <h1 className={`text-xl font-bold ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`} style={{ fontFamily: 'Orbitron, sans-serif' }}>
                  {menuItems.find(m => m.id === activeView)?.label || 'Dashboard'}
                </h1>
                <p className={`text-sm ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-xl transition-all ${
                  theme === 'dark'
                    ? 'bg-dark-lighter hover:bg-gray-800 text-electric-blue'
                    : 'bg-gray-100 hover:bg-gray-200 text-accent-red'
                }`}
              >
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <motion.button
                onClick={handleLogout}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 ${
                  theme === 'dark'
                    ? 'bg-red-500/20 border-2 border-red-500/50 text-red-400 hover:bg-red-500 hover:text-white hover:border-red-500 hover:shadow-lg hover:shadow-red-500/30'
                    : 'bg-red-50 border-2 border-red-200 text-red-600 hover:bg-red-500 hover:text-white hover:border-red-500 hover:shadow-lg hover:shadow-red-500/30'
                }`}
              >
                <FiLogOut size={18} />
                <span className="hidden sm:inline">Logout</span>
              </motion.button>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link
                  to="/"
                  className={`hidden sm:inline-flex items-center gap-2.5 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 border-2 ${
                    theme === 'dark'
                      ? 'bg-transparent border-electric-blue/50 text-electric-blue hover:bg-electric-blue hover:text-black hover:border-electric-blue hover:shadow-lg hover:shadow-electric-blue/30'
                      : 'bg-transparent border-accent-red/50 text-accent-red hover:bg-accent-red hover:text-white hover:border-accent-red hover:shadow-lg hover:shadow-accent-red/30'
                  }`}
                >
                  <FiHome size={18} />
                  <span>Main Site</span>
                  <FiArrowUpRight size={16} className="opacity-70" />
                </Link>
              </motion.div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            {/* Overview Dashboard */}
            {activeView === 'overview' && (
              <div className="space-y-6">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                  <StatCard
                    icon={FiDollarSign}
                    label="Total Revenue"
                    value={`₹${stats.totalRevenue.toLocaleString()}`}
                    subtitle="All time earnings"
                    trend="up"
                    trendValue={`+${revenueGrowth}% this month`}
                    gradient="green"
                  />
                  <StatCard
                    icon={FiBook}
                    label="Total Courses"
                    value={stats.totalCourses}
                    subtitle="Active programs"
                    gradient="blue"
                  />
                  <StatCard
                    icon={FiUsers}
                    label="Total Students"
                    value={stats.totalPurchases}
                    subtitle="Total enrollments"
                    trend="up"
                    trendValue={`+${enrollmentGrowth}% this month`}
                    gradient="purple"
                  />
                  <StatCard
                    icon={FiTrendingUp}
                    label="Monthly Revenue"
                    value={`₹${stats.monthlyRevenue.toLocaleString()}`}
                    subtitle={`${stats.monthlyPurchases} purchases this month`}
                    gradient="orange"
                  />
                </div>

                {/* eLearning Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mt-6">
                  <StatCard
                    icon={FiFileText}
                    label="Total Modules"
                    value={elearningStats.totalModules}
                    subtitle={`${elearningStats.totalLessons} lessons`}
                    gradient="blue"
                  />
                  <StatCard
                    icon={FiVideo}
                    label="Total Lessons"
                    value={elearningStats.totalLessons}
                    subtitle="Across all courses"
                    gradient="purple"
                  />
                  <StatCard
                    icon={FiTrendingUp}
                    label="Avg Progress"
                    value={`${elearningStats.avgProgress}%`}
                    subtitle="Student completion rate"
                    gradient="green"
                  />
                  <StatCard
                    icon={FiAward}
                    label="Completed"
                    value={elearningStats.completedCourses}
                    subtitle="Courses fully completed"
                    gradient="pink"
                  />
                </div>

                {/* Quick Actions & Recent Activity */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Quick Actions */}
                  <div className={`lg:col-span-1 rounded-2xl border-2 p-6 ${
                    theme === 'dark'
                      ? 'bg-dark-card border-gray-700'
                      : 'bg-white border-gray-200'
                  }`}>
                    <h3 className={`text-lg font-bold mb-5 ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`} style={{ fontFamily: 'Orbitron, sans-serif' }}>
                      Quick Actions
                    </h3>
                    <div className="space-y-3">
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Link
                          to="/academy/admin/create-course"
                          className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all ${
                            theme === 'dark'
                              ? 'bg-electric-green text-black hover:bg-electric-blue shadow-lg shadow-electric-green/20'
                              : 'bg-accent-red text-white hover:bg-accent-blue shadow-lg shadow-accent-red/20'
                          }`}
                        >
                          <FiPlus size={18} />
                          Create Course
                        </Link>
                      </motion.div>
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Link
                          to="/academy/admin/students"
                          className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 font-semibold transition-all ${
                            theme === 'dark'
                              ? 'border-gray-700 text-gray-300 hover:border-electric-blue hover:bg-gray-800 hover:text-white'
                              : 'border-gray-200 text-gray-800 hover:border-accent-red hover:bg-gray-100 hover:text-gray-900'
                          }`}
                        >
                          <FiUsers size={18} />
                          Student Management
                        </Link>
                      </motion.div>
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <button
                          onClick={() => setActiveView('courses')}
                          className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl border-2 font-semibold transition-all ${
                            theme === 'dark'
                              ? 'border-gray-700 text-gray-300 hover:border-electric-blue hover:bg-gray-800 hover:text-white'
                              : 'border-gray-200 text-gray-800 hover:border-accent-red hover:bg-gray-100 hover:text-gray-900'
                          }`}
                        >
                          <FiLayers size={18} />
                          Manage Courses
                        </button>
                      </motion.div>
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Link
                          to="/academy/admin/ai-tools"
                          className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 font-semibold transition-all ${
                            theme === 'dark'
                              ? 'border-gray-700 text-gray-300 hover:border-electric-blue hover:bg-gray-800 hover:text-white'
                              : 'border-gray-200 text-gray-800 hover:border-accent-red hover:bg-gray-100 hover:text-gray-900'
                          }`}
                        >
                          <FiZap size={18} />
                          Manage AI Tools
                        </Link>
                      </motion.div>
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Link
                          to="/academy/admin/hero-slides"
                          className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 font-semibold transition-all ${
                            theme === 'dark'
                              ? 'border-gray-700 text-gray-300 hover:border-electric-blue hover:bg-gray-800 hover:text-white'
                              : 'border-gray-200 text-gray-800 hover:border-accent-red hover:bg-gray-100 hover:text-gray-900'
                          }`}
                        >
                          <FiSliders size={18} />
                          Manage Hero Slides
                        </Link>
                      </motion.div>
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Link
                          to="/academy/admin/jobs"
                          className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 font-semibold transition-all ${
                            theme === 'dark'
                              ? 'border-gray-700 text-gray-300 hover:border-electric-blue hover:bg-gray-800 hover:text-white'
                              : 'border-gray-200 text-gray-800 hover:border-accent-red hover:bg-gray-100 hover:text-gray-900'
                          }`}
                        >
                          <FiBriefcase size={18} />
                          Manage Jobs
                        </Link>
                      </motion.div>
                    </div>
                  </div>

                  {/* Recent Activity */}
                  <div className={`lg:col-span-2 rounded-2xl border-2 p-6 ${
                    theme === 'dark'
                      ? 'bg-dark-card border-gray-700'
                      : 'bg-white border-gray-200'
                  }`}>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className={`text-lg font-bold ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`} style={{ fontFamily: 'Orbitron, sans-serif' }}>
                        Recent Activity
                      </h3>
                      <FiActivity className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} size={20} />
                    </div>
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {activityFeed.length > 0 ? (
                        activityFeed.map((event) => {
                          const isSignup = event.type === 'signup';
                          return (
                            <div
                              key={event.id}
                              className={`flex items-center gap-4 p-4 rounded-xl transition-all ${
                                theme === 'dark'
                                  ? 'bg-dark-lighter hover:bg-gray-800'
                                  : 'bg-gray-50 hover:bg-gray-100'
                              }`}
                            >
                              <div className={`flex-shrink-0 flex h-10 w-10 items-center justify-center rounded-full ${
                                theme === 'dark'
                                  ? isSignup
                                    ? 'bg-electric-blue/20 text-electric-blue'
                                    : 'bg-electric-green/20 text-electric-green'
                                  : isSignup
                                    ? 'bg-accent-blue/20 text-accent-blue'
                                    : 'bg-accent-red/20 text-accent-red'
                              }`}>
                                {isSignup ? <FiUserPlus size={18} /> : <FiCheckCircle size={18} />}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className={`text-sm font-semibold ${
                                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                                }`}>
                                  {isSignup ? `${event.name} joined NanoFlows` : `${event.name} enrolled in`}
                                </p>
                                <p className={`text-sm truncate ${
                                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                                }`}>
                                  {event.detail}
                                </p>
                              </div>
                              <div className="flex-shrink-0 text-right">
                                {isSignup ? (
                                  <span className={`inline-flex items-center justify-center rounded-full px-3 py-1 text-xs font-bold ${
                                    theme === 'dark'
                                      ? 'bg-electric-blue/10 text-electric-blue border border-electric-blue/40'
                                      : 'bg-blue-100 text-blue-700 border border-blue-200'
                                  }`}>
                                    New signup
                                  </span>
                                ) : (
                                  <p className={`text-sm font-bold ${
                                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                                  }`}>
                                    ₹{event.amount}
                                  </p>
                                )}
                                <p className={`text-xs mt-1 ${
                                  theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                                }`}>
                                  {new Date(event.date).toLocaleString()}
                                </p>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <div className={`text-center py-8 ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          <FiActivity size={48} className="mx-auto mb-2 opacity-50" />
                          <p>No recent activity</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Courses Dashboard */}
            {activeView === 'courses' && (
              <div className="space-y-6">
                <div className={`rounded-2xl border-2 p-6 ${
                  theme === 'dark'
                    ? 'bg-dark-card border-gray-700'
                    : 'bg-white border-gray-200'
                }`}>
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between mb-6">
                    <div>
                      <h3 className={`text-2xl font-bold mb-2 ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`} style={{ fontFamily: 'Orbitron, sans-serif' }}>
                        Course Catalog
                      </h3>
                      <p className={`text-sm ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        Manage curriculum, publishing status, and pricing
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                      <div className="relative">
                        <FiFilter className={`pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 ${
                          theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                        }`} />
                        <select
                          value={statusFilter}
                          onChange={(e) => setStatusFilter(e.target.value)}
                          className={`rounded-xl border-2 pl-9 pr-4 py-2.5 text-sm font-medium transition-all focus:outline-none focus:ring-4 ${
                            theme === 'dark'
                              ? 'bg-dark-lighter border-gray-700 text-white focus:border-electric-blue focus:ring-electric-blue/20'
                              : 'bg-white border-gray-300 text-gray-800 focus:border-accent-red focus:ring-accent-red/20'
                          }`}
                        >
                          <option value="all">All Courses</option>
                          <option value="published">Published</option>
                          <option value="draft">Draft</option>
                        </select>
                      </div>
                      <div className="relative">
                        <FiSearch className={`pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 ${
                          theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                        }`} />
                        <input
                          type="search"
                          value={query}
                          onChange={(e) => setQuery(e.target.value)}
                          placeholder="Search courses..."
                          className={`rounded-xl border-2 pl-9 pr-4 py-2.5 text-sm font-medium transition-all focus:outline-none focus:ring-4 ${
                            theme === 'dark'
                              ? 'bg-dark-lighter border-gray-700 text-white placeholder:text-gray-500 focus:border-electric-blue focus:ring-electric-blue/20'
                              : 'bg-white border-gray-300 text-gray-800 placeholder:text-gray-400 focus:border-accent-red focus:ring-accent-red/20'
                          }`}
                        />
                      </div>
                      <button
                        onClick={() => {
                          setLoading(true);
                          fetchData();
                        }}
                        disabled={loading}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold transition-all disabled:opacity-50 ${
                          theme === 'dark'
                            ? 'bg-dark-lighter text-white hover:bg-gray-700 border-2 border-gray-700'
                            : 'bg-gray-100 text-gray-800 hover:bg-gray-200 border-2 border-gray-300'
                        }`}
                        title="Refresh courses list"
                      >
                        <FiActivity size={18} className={loading ? 'animate-spin' : ''} />
                        Refresh
                      </button>
                      <Link
                        to="/academy/admin/create-course"
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold transition-all ${
                          theme === 'dark'
                            ? 'bg-electric-green text-black hover:bg-electric-blue shadow-lg shadow-electric-green/20'
                            : 'bg-accent-red text-white hover:bg-accent-blue shadow-lg shadow-accent-red/20'
                        }`}
                      >
                        <FiPlus size={18} />
                        New Course
                      </Link>
                    </div>
                  </div>

                  {loading ? (
                    <div className={`flex min-h-[200px] items-center justify-center ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      <div className="flex items-center gap-3">
                        <div className={`h-6 w-6 animate-spin rounded-full border-4 ${
                          theme === 'dark'
                            ? 'border-electric-blue/20 border-t-electric-blue'
                            : 'border-accent-red/20 border-t-accent-red'
                        }`} />
                        Loading courses...
                      </div>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="min-w-full text-left text-sm">
                        <thead className={`text-xs font-bold uppercase tracking-wide ${
                          theme === 'dark'
                            ? 'bg-dark-lighter text-gray-300'
                            : 'bg-gray-50 text-gray-600'
                        }`}>
                          <tr>
                            <th className="px-6 py-4">Course</th>
                            <th className="px-6 py-4">Category</th>
                            <th className="px-6 py-4">Price</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Actions</th>
                          </tr>
                        </thead>
                        <tbody className={`divide-y ${
                          theme === 'dark' ? 'divide-gray-800' : 'divide-gray-200'
                        }`}>
                          {filteredCourses.map((course) => (
                            <tr key={course.id} className={`transition-colors ${
                              theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-50'
                            }`}>
                              <td className="px-6 py-4">
                                <p className={`font-bold ${
                                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                                }`}>{course.title}</p>
                                <p className={`mt-1 text-xs ${
                                  theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                                }`}>{course.instructor_name}</p>
                              </td>
                              <td className="px-6 py-4">
                                <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                                  theme === 'dark'
                                    ? 'bg-dark-lighter text-gray-300'
                                    : 'bg-gray-100 text-gray-800'
                                }`}>
                                  {course.category}
                                </span>
                              </td>
                              <td className={`px-6 py-4 font-bold ${
                                theme === 'dark' ? 'text-white' : 'text-gray-900'
                              }`}>₹{course.price}</td>
                              <td className="px-6 py-4">
                                <button
                                  onClick={() => handleTogglePublish(course)}
                                  className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold transition-all ${
                                    course.published
                                      ? theme === 'dark'
                                        ? 'bg-electric-green text-black shadow-lg shadow-electric-green/30'
                                        : 'bg-accent-red text-white shadow-lg shadow-accent-red/30'
                                      : theme === 'dark'
                                        ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                                        : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                                  }`}
                                >
                                  {course.published ? '✓ Published' : 'Draft'}
                                </button>
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex flex-col gap-2">
                                  <div className="flex items-center gap-2">
                                    <Link
                                      to={`/academy/admin/course/${course.id}/content`}
                                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border-2 transition-all text-xs font-semibold ${
                                        theme === 'dark'
                                          ? 'border-electric-green text-electric-green hover:border-electric-green hover:bg-electric-green/10'
                                          : 'border-green-600 text-green-600 hover:border-green-600 hover:bg-green-50'
                                      }`}
                                      title="Manage Modules, Lessons, Quizzes & Assignments"
                                    >
                                      <FiFileText size={14} />
                                      Content
                                    </Link>
                                  <Link
                                    to={`/academy/admin/edit-course/${course.id}`}
                                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border-2 transition-all text-xs font-semibold ${
                                      theme === 'dark'
                                          ? 'border-electric-blue text-electric-blue hover:border-electric-blue hover:bg-electric-blue/10'
                                          : 'border-accent-red text-accent-red hover:border-accent-red hover:bg-accent-red/10'
                                    }`}
                                      title="Edit course details"
                                  >
                                      <FiEdit size={14} />
                                      Edit
                                  </Link>
                                  </div>
                                  <button
                                    onClick={() => openDeleteModal(course.id)}
                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border-2 transition-all text-xs font-semibold w-fit ${
                                      theme === 'dark'
                                        ? 'border-red-400 text-red-400 hover:border-red-500 hover:bg-red-500/10'
                                        : 'border-red-500 text-red-500 hover:border-red-400 hover:bg-red-50'
                                    }`}
                                    title="Delete course"
                                  >
                                    <FiTrash2 size={14} />
                                    Delete
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                          {!filteredCourses.length && (
                            <tr>
                              <td colSpan={5} className="px-6 py-12 text-center">
                                <div className="flex flex-col items-center gap-3">
                                  <div className={`flex h-16 w-16 items-center justify-center rounded-2xl ${
                                    theme === 'dark' ? 'bg-dark-lighter' : 'bg-gray-100'
                                  }`}>
                                    <FiBook className={`h-8 w-8 ${
                                      theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                                    }`} />
                                  </div>
                                  <p className={`text-sm font-semibold ${
                                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                                  }`}>
                                    No courses found matching your criteria
                                  </p>
                                </div>
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Analytics Dashboard */}
            {activeView === 'analytics' && (
              <AdminAnalytics />
            )}

            {/* Student Progress Dashboard */}
            {activeView === 'students' && (
              <div className="space-y-6">
                <div className={`rounded-2xl border-2 p-6 ${
                  theme === 'dark'
                    ? 'bg-dark-card border-gray-700'
                    : 'bg-white border-gray-200'
                }`}>
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between mb-6">
                    <div>
                      <h3 className={`text-2xl font-bold mb-2 ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`} style={{ fontFamily: 'Orbitron, sans-serif' }}>
                        Student Progress Tracking
                      </h3>
                      <p className={`text-sm ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        Monitor student enrollment, progress, and completion rates across all courses
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <FiSearch className={`pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 ${
                          theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                        }`} />
                        <input
                          type="search"
                          value={query}
                          onChange={(e) => setQuery(e.target.value)}
                          placeholder="Search students..."
                          className={`rounded-xl border-2 pl-9 pr-4 py-2.5 text-sm font-medium transition-all focus:outline-none focus:ring-4 ${
                            theme === 'dark'
                              ? 'bg-dark-lighter border-gray-700 text-white placeholder:text-gray-500 focus:border-electric-blue focus:ring-electric-blue/20'
                              : 'bg-white border-gray-300 text-gray-800 placeholder:text-gray-400 focus:border-accent-red focus:ring-accent-red/20'
                          }`}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Student Progress Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className={`border-b-2 ${
                          theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
                        }`}>
                          <th className={`text-left py-3 px-4 text-sm font-bold uppercase tracking-wider ${
                            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                          }`}>
                            Student
                          </th>
                          <th className={`text-left py-3 px-4 text-sm font-bold uppercase tracking-wider ${
                            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                          }`}>
                            Course
                          </th>
                          <th className={`text-center py-3 px-4 text-sm font-bold uppercase tracking-wider ${
                            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                          }`}>
                            Progress
                          </th>
                          <th className={`text-center py-3 px-4 text-sm font-bold uppercase tracking-wider ${
                            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                          }`}>
                            Time Spent
                          </th>
                          <th className={`text-center py-3 px-4 text-sm font-bold uppercase tracking-wider ${
                            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                          }`}>
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {studentProgress.length > 0 ? (
                          studentProgress
                            .filter(progress => {
                              if (!query) return true;
                              const searchLower = query.toLowerCase();
                              return (
                                progress.user_name?.toLowerCase().includes(searchLower) ||
                                progress.course_title?.toLowerCase().includes(searchLower)
                              );
                            })
                            .map((progress) => {
                              const progressValue = Number(progress.progress_percentage) || 0;
                              const isEnrolled = Boolean(progress.course_id);
                              const joinedDate = progress.signup_date
                                ? new Date(progress.signup_date).toLocaleDateString()
                                : null;
                              const enrolledDate = progress.enrollment_date
                                ? new Date(progress.enrollment_date).toLocaleDateString()
                                : null;
                              const statusKey = progress.status || (!isEnrolled
                                ? 'not_enrolled'
                                : progressValue >= 100
                                  ? 'completed'
                                  : progressValue > 0
                                    ? 'in_progress'
                                    : 'enrolled');

                              const statusConfig = {
                                not_enrolled: {
                                  label: 'Not Enrolled',
                                  icon: <FiUserPlus size={14} />,
                                  className: theme === 'dark'
                                    ? 'bg-gray-800 text-gray-300 border border-gray-700'
                                    : 'bg-gray-100 text-gray-600 border border-gray-200'
                                },
                                enrolled: {
                                  label: 'Enrolled',
                                  icon: <FiAlertCircle size={14} />,
                                  className: theme === 'dark'
                                    ? 'bg-gray-700 text-gray-200'
                                    : 'bg-gray-200 text-gray-700'
                                },
                                in_progress: {
                                  label: 'In Progress',
                                  icon: <FiClock size={14} />,
                                  className: theme === 'dark'
                                    ? 'bg-electric-blue/20 text-electric-blue'
                                    : 'bg-blue-100 text-blue-700'
                                },
                                completed: {
                                  label: 'Completed',
                                  icon: <FiCheckCircle size={14} />,
                                  className: theme === 'dark'
                                    ? 'bg-electric-green/20 text-electric-green'
                                    : 'bg-green-100 text-green-700'
                                }
                              }[statusKey] || {
                                label: 'Enrolled',
                                icon: <FiAlertCircle size={14} />,
                                className: theme === 'dark'
                                  ? 'bg-gray-700 text-gray-200'
                                  : 'bg-gray-200 text-gray-700'
                              };

                              return (
                              <tr
                                key={progress.id}
                                className={`border-b transition-all hover:bg-opacity-50 ${
                                  theme === 'dark'
                                    ? 'border-gray-800 hover:bg-gray-800'
                                    : 'border-gray-100 hover:bg-gray-50'
                                }`}
                              >
                                <td className="py-4 px-4">
                                  <div className={`font-semibold ${
                                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                                  }`}>
                                    {progress.user_name || 'Unknown User'}
                                  </div>
                                  <div className={`text-xs mt-1 ${
                                    theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                                  }`}>
                                    {progress.user_email || 'N/A'}
                                  </div>
                                  {joinedDate && (
                                    <div className={`text-xs mt-0.5 ${
                                      theme === 'dark' ? 'text-gray-600' : 'text-gray-500'
                                    }`}>
                                      Joined {joinedDate}
                                    </div>
                                  )}
                                </td>
                                <td className="py-4 px-4">
                                  <div className={`font-medium ${
                                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                                  }`}>
                                    {progress.course_title || 'Not enrolled yet'}
                                  </div>
                                  {enrolledDate && (
                                    <div className={`text-xs mt-1 ${
                                      theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                                    }`}>
                                      Enrolled {enrolledDate}
                                    </div>
                                  )}
                                </td>
                                <td className="py-4 px-4 text-center">
                                  <div className="flex flex-col items-center gap-2">
                                    <span className={`text-sm font-bold ${
                                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                                    }`}>
                                      {isEnrolled ? `${progressValue}%` : '—'}
                                    </span>
                                    <div className={`h-2 w-24 overflow-hidden rounded-full ${
                                      theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200'
                                    }`}>
                                      <div
                                        className={`h-full rounded-full bg-gradient-to-r ${
                                          theme === 'dark'
                                            ? 'from-electric-blue to-electric-green'
                                            : 'from-accent-red to-accent-blue'
                                        } ${!isEnrolled ? 'opacity-30' : ''}`}
                                        style={{ width: isEnrolled ? `${progressValue}%` : '0%' }}
                                      />
                                    </div>
                                  </div>
                                </td>
                                <td className="py-4 px-4 text-center">
                                  <span className={`text-sm ${
                                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                                  }`}>
                                    {isEnrolled && progress.total_time_spent
                                      ? `${Math.round(Number(progress.total_time_spent) / 60)}m`
                                      : '—'}
                                  </span>
                                </td>
                                <td className="py-4 px-4 text-center">
                                  <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold border ${
                                    statusConfig.className
                                  }`}>
                                    {statusConfig.icon}
                                    {statusConfig.label}
                                  </span>
                                </td>
                              </tr>
                              );
                            })
                        ) : (
                          <tr>
                            <td colSpan="5" className="py-12 text-center">
                              <div className={`flex flex-col items-center gap-3 ${
                                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                              }`}>
                                <FiUsers size={48} className="opacity-50" />
                                <p className="text-lg font-semibold">No student progress data available</p>
                                <p className="text-sm">Student progress will appear here once they start learning</p>
                              </div>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setDeleteCourseId(null);
        }}
        onConfirm={handleDeleteCourse}
        title="Delete Course"
        message="Are you sure you want to delete this course? This action cannot be undone and will remove all associated videos and resources."
        confirmText="Delete Course"
        cancelText="Cancel"
        variant="danger"
        isLoading={deleteLoading}
      />

      {/* Success Modal */}
      <Modal
        isOpen={successModal.open}
        onClose={() => setSuccessModal({ open: false, message: '' })}
        title="Notification"
        size="sm"
      >
        <div className="flex items-start gap-4">
          <div className={`flex-shrink-0 flex h-10 w-10 items-center justify-center rounded-full ${
            theme === 'dark' ? 'bg-electric-green/20 text-electric-green' : 'bg-green-100 text-green-600'
          }`}>
            <FiCheckCircle size={20} />
          </div>
          <div className="flex-1">
            <p className={`text-sm ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-800'
            }`}>
              {successModal.message}
            </p>
          </div>
        </div>
        <div className="flex justify-end mt-6">
          <button
            onClick={() => setSuccessModal({ open: false, message: '' })}
            className={`px-6 py-2 rounded-lg font-semibold transition-all ${
              theme === 'dark'
                ? 'bg-electric-green text-black hover:bg-electric-blue'
                : 'bg-accent-red text-white hover:bg-accent-blue'
            }`}
          >
            OK
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default AdminDashboard;
