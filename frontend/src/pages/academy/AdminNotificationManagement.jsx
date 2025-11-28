import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { notificationsAPI } from '../../utils/api';
import { useTheme } from '../../context/ThemeContext';
import { 
  FiArrowLeft, FiBell, FiMail, FiSend, FiCheckCircle, FiClock,
  FiFilter, FiSearch, FiUser, FiBook, FiDollarSign, FiAward, FiRefreshCw
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const AdminNotificationManagement = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await notificationsAPI.getAllAdmin();
      console.log('Notifications response:', response.data);
      
      if (response.data && response.data.notifications) {
        setNotifications(response.data.notifications);
      } else {
        setNotifications([]);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setError('Failed to load notifications. Please try again.');
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredNotifications = notifications.filter(notif => {
    const matchesQuery = !searchQuery || 
      notif.recipient?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notif.recipient_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notif.subject?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = typeFilter === 'all' || notif.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || notif.status === statusFilter;

    return matchesQuery && matchesType && matchesStatus;
  });

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'signup':
        return <FiUser size={18} />;
      case 'payment':
      case 'payment_success':
        return <FiDollarSign size={18} />;
      case 'course_update':
        return <FiBook size={18} />;
      case 'certificate':
      case 'certificate_issued':
        return <FiAward size={18} />;
      default:
        return <FiMail size={18} />;
    }
  };

  const getNotificationTypeLabel = (type) => {
    switch (type) {
      case 'signup':
        return 'Signup Email';
      case 'payment':
      case 'payment_success':
        return 'Payment Success';
      case 'course_update':
        return 'Course Update';
      case 'certificate':
      case 'certificate_issued':
        return 'Certificate Issued';
      default:
        return 'Notification';
    }
  };

  const getNotificationTypeColor = (type) => {
    switch (type) {
      case 'signup':
        return theme === 'dark' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'bg-blue-100 text-blue-700 border border-blue-300';
      case 'payment':
      case 'payment_success':
        return theme === 'dark' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-green-100 text-green-700 border border-green-300';
      case 'course_update':
        return theme === 'dark' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' : 'bg-yellow-100 text-yellow-700 border border-yellow-300';
      case 'certificate':
      case 'certificate_issued':
        return theme === 'dark' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' : 'bg-purple-100 text-purple-700 border border-purple-300';
      default:
        return theme === 'dark' ? 'bg-gray-500/20 text-gray-400 border border-gray-500/30' : 'bg-gray-100 text-gray-700 border border-gray-300';
    }
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${theme === 'dark' ? 'bg-dark-bg' : 'bg-gray-50'}`}>
        <div className="text-center">
          <div className={`h-12 w-12 animate-spin rounded-full border-4 mx-auto mb-4 ${
            theme === 'dark' ? 'border-electric-blue/20 border-t-electric-blue' : 'border-accent-red/20 border-t-accent-red'
          }`} />
          <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Loading notifications...</p>
        </div>
      </div>
    );
  }

  return (
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
            <div className="flex items-center gap-4">
              <Link
                to="/academy/admin"
                className={`p-2 rounded-lg transition-all ${
                  theme === 'dark' ? 'text-gray-400 hover:bg-gray-800 hover:text-electric-blue' : 'text-gray-600 hover:bg-gray-100 hover:text-accent-red'
                }`}
              >
                <FiArrowLeft size={20} />
              </Link>
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br shadow-lg ${
                theme === 'dark'
                  ? 'from-electric-blue to-electric-green shadow-electric-blue/30'
                  : 'from-accent-red to-accent-blue shadow-accent-red/30'
              }`}>
                <FiBell className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className={`text-xs font-bold uppercase tracking-[0.2em] ${
                  theme === 'dark' ? 'text-electric-green' : 'text-accent-red'
                }`}>
                  NanoFlows Academy
                </p>
                <h1 className={`text-xl font-bold ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`} style={{ fontFamily: 'Orbitron, sans-serif' }}>
                  Notification Management
                </h1>
              </div>
            </div>
            <button
              onClick={fetchNotifications}
              className={`p-2 rounded-lg transition-all ${
                theme === 'dark'
                  ? 'bg-dark-lighter hover:bg-gray-700 text-electric-blue hover:text-electric-green'
                  : 'bg-gray-100 hover:bg-gray-200 text-accent-blue hover:text-accent-red'
              }`}
              title="Refresh"
            >
              <FiRefreshCw size={20} />
            </button>
          </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mb-6 p-4 rounded-xl border-2 ${
              theme === 'dark' ? 'bg-red-500/20 text-red-400 border-red-500/30' : 'bg-red-100 text-red-700 border-red-300'
            }`}
          >
            {error}
          </motion.div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`relative overflow-hidden rounded-2xl border-2 p-6 shadow-xl ${
              theme === 'dark'
                ? 'bg-dark-card border-electric-green/30'
                : 'bg-white border-gray-200'
            }`}
          >
            <div className={`absolute -right-10 -top-10 h-32 w-32 rounded-full blur-2xl ${
              theme === 'dark' ? 'bg-electric-green/20' : 'bg-green-100'
            }`} />
            <div className="relative z-10">
              <p className={`text-sm font-semibold mb-2 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Total Sent
              </p>
              <p className={`text-3xl font-bold ${
                theme === 'dark' ? 'text-electric-green' : 'text-green-600'
              }`} style={{ fontFamily: 'Orbitron, sans-serif' }}>
                {notifications.filter(n => n.status === 'sent').length}
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={`relative overflow-hidden rounded-2xl border-2 p-6 shadow-xl ${
              theme === 'dark'
                ? 'bg-dark-card border-electric-blue/30'
                : 'bg-white border-gray-200'
            }`}
          >
            <div className={`absolute -right-10 -top-10 h-32 w-32 rounded-full blur-2xl ${
              theme === 'dark' ? 'bg-electric-blue/20' : 'bg-blue-100'
            }`} />
            <div className="relative z-10">
              <p className={`text-sm font-semibold mb-2 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Signup Emails
              </p>
              <p className={`text-3xl font-bold ${
                theme === 'dark' ? 'text-electric-blue' : 'text-accent-blue'
              }`} style={{ fontFamily: 'Orbitron, sans-serif' }}>
                {notifications.filter(n => n.type === 'signup').length}
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={`relative overflow-hidden rounded-2xl border-2 p-6 shadow-xl ${
              theme === 'dark'
                ? 'bg-dark-card border-yellow-400/30'
                : 'bg-white border-gray-200'
            }`}
          >
            <div className={`absolute -right-10 -top-10 h-32 w-32 rounded-full blur-2xl ${
              theme === 'dark' ? 'bg-yellow-400/20' : 'bg-yellow-100'
            }`} />
            <div className="relative z-10">
              <p className={`text-sm font-semibold mb-2 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Payment Emails
              </p>
              <p className={`text-3xl font-bold ${
                theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'
              }`} style={{ fontFamily: 'Orbitron, sans-serif' }}>
                {notifications.filter(n => n.type === 'payment' || n.type === 'payment_success').length}
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className={`relative overflow-hidden rounded-2xl border-2 p-6 shadow-xl ${
              theme === 'dark'
                ? 'bg-dark-card border-purple-400/30'
                : 'bg-white border-gray-200'
            }`}
          >
            <div className={`absolute -right-10 -top-10 h-32 w-32 rounded-full blur-2xl ${
              theme === 'dark' ? 'bg-purple-400/20' : 'bg-purple-100'
            }`} />
            <div className="relative z-10">
              <p className={`text-sm font-semibold mb-2 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Course Updates
              </p>
              <p className={`text-3xl font-bold ${
                theme === 'dark' ? 'text-purple-400' : 'text-purple-600'
              }`} style={{ fontFamily: 'Orbitron, sans-serif' }}>
                {notifications.filter(n => n.type === 'course_update').length}
              </p>
            </div>
          </motion.div>
        </div>

        {/* Filters Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className={`mb-6 rounded-2xl border-2 p-6 shadow-xl ${
            theme === 'dark' ? 'bg-dark-card border-gray-700' : 'bg-white border-gray-200'
          }`}
        >
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative flex-1 min-w-[200px]">
              <FiSearch className={`absolute left-3 top-1/2 -translate-y-1/2 ${
                theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
              }`} size={18} />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by recipient or subject..."
                className={`w-full pl-10 pr-4 py-3 rounded-xl border-2 text-sm transition-all ${
                  theme === 'dark'
                    ? 'bg-dark-lighter border-gray-700 text-white placeholder:text-gray-500 focus:border-electric-blue focus:ring-2 focus:ring-electric-blue/20'
                    : 'bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-accent-red focus:ring-2 focus:ring-accent-red/20'
                }`}
              />
            </div>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className={`px-4 py-3 rounded-xl border-2 text-sm font-semibold transition-all ${
                theme === 'dark'
                  ? 'bg-dark-lighter border-gray-700 text-white focus:border-electric-blue focus:ring-2 focus:ring-electric-blue/20'
                  : 'bg-white border-gray-300 text-gray-900 focus:border-accent-red focus:ring-2 focus:ring-accent-red/20'
              }`}
            >
              <option value="all">All Types</option>
              <option value="signup">Signup</option>
              <option value="payment">Payment</option>
              <option value="course_update">Course Update</option>
              <option value="certificate">Certificate</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className={`px-4 py-3 rounded-xl border-2 text-sm font-semibold transition-all ${
                theme === 'dark'
                  ? 'bg-dark-lighter border-gray-700 text-white focus:border-electric-blue focus:ring-2 focus:ring-electric-blue/20'
                  : 'bg-white border-gray-300 text-gray-900 focus:border-accent-red focus:ring-2 focus:ring-accent-red/20'
              }`}
            >
              <option value="all">All Status</option>
              <option value="sent">Sent</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>
          </div>
        </motion.div>

        {/* Notifications List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className={`rounded-2xl border-2 p-6 shadow-xl ${
            theme === 'dark' ? 'bg-dark-card border-gray-700' : 'bg-white border-gray-200'
          }`}
        >
          {filteredNotifications.length > 0 ? (
            <div className="space-y-4">
              <AnimatePresence>
                {filteredNotifications.map((notification, index) => (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.05 }}
                    className={`p-5 rounded-xl border-2 transition-all ${
                      theme === 'dark'
                        ? 'bg-dark-lighter border-gray-700 hover:border-electric-blue hover:shadow-lg hover:shadow-electric-blue/10'
                        : 'bg-gray-50 border-gray-200 hover:border-accent-red hover:shadow-lg hover:shadow-accent-red/10'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        <div className={`p-3 rounded-xl ${
                          theme === 'dark'
                            ? 'bg-electric-blue/20 text-electric-blue'
                            : 'bg-accent-red/20 text-accent-red'
                        }`}>
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2 flex-wrap">
                            <h3 className={`font-bold text-lg ${
                              theme === 'dark' ? 'text-white' : 'text-gray-900'
                            }`} style={{ fontFamily: 'Orbitron, sans-serif' }}>
                              {notification.subject || notification.title || 'Notification'}
                            </h3>
                            <span className={`px-3 py-1 rounded-lg text-xs font-semibold ${getNotificationTypeColor(notification.type)}`}>
                              {getNotificationTypeLabel(notification.type)}
                            </span>
                          </div>
                          <div className="space-y-1.5">
                            <p className={`text-sm ${
                              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                            }`}>
                              <span className="font-semibold">To:</span> {notification.recipient_name || 'Unknown'} ({notification.recipient || 'N/A'})
                            </p>
                            {notification.course_title && (
                              <p className={`text-sm ${
                                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                              }`}>
                                <span className="font-semibold">Course:</span> {notification.course_title}
                              </p>
                            )}
                            {notification.certificate_id && (
                              <p className={`text-sm ${
                                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                              }`}>
                                <span className="font-semibold">Certificate ID:</span> {notification.certificate_id}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${
                          notification.status === 'sent'
                            ? theme === 'dark'
                              ? 'bg-electric-green/20 text-electric-green border border-electric-green/30'
                              : 'bg-green-100 text-green-700 border border-green-300'
                            : theme === 'dark'
                              ? 'bg-yellow-400/20 text-yellow-400 border border-yellow-400/30'
                              : 'bg-yellow-100 text-yellow-700 border border-yellow-300'
                        }`}>
                          {notification.status === 'sent' ? (
                            <>
                              <FiCheckCircle size={14} />
                              Sent
                            </>
                          ) : (
                            <>
                              <FiClock size={14} />
                              Pending
                            </>
                          )}
                        </span>
                        <p className={`text-xs ${
                          theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                        }`}>
                          {notification.sent_at 
                            ? new Date(notification.sent_at).toLocaleString()
                            : 'N/A'}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <div className="text-center py-16">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200 }}
              >
                <FiBell className={`mx-auto mb-4 ${
                  theme === 'dark' ? 'text-gray-600' : 'text-gray-400'
                }`} size={64} />
              </motion.div>
              <p className={`text-xl font-bold mb-2 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`} style={{ fontFamily: 'Orbitron, sans-serif' }}>
                {searchQuery || typeFilter !== 'all' || statusFilter !== 'all'
                  ? 'No notifications found'
                  : 'No notifications yet'}
              </p>
              <p className={`text-sm ${
                theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
              }`}>
                {searchQuery || typeFilter !== 'all' || statusFilter !== 'all'
                  ? 'Try adjusting your filters'
                  : 'Notifications will appear here once emails are sent to students'}
              </p>
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
};

export default AdminNotificationManagement;
