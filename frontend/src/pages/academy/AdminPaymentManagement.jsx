import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { paymentsAPI } from '../../utils/api';
import { useTheme } from '../../context/ThemeContext';
import { 
  FiArrowLeft, FiDollarSign, FiSearch, FiCheckCircle, FiXCircle,
  FiClock, FiFilter, FiDownload, FiEye, FiTrendingUp
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { GraduationCap } from 'lucide-react';

const AdminPaymentManagement = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();

  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const response = await paymentsAPI.getHistory();
      setPayments(response.data.payments || []);
    } catch (error) {
      console.error('Error fetching payments:', error);
      setPayments([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredPayments = payments.filter(payment => {
    const matchesQuery = !searchQuery || 
      payment.course_title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.razorpay_order_id?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;
    
    const matchesDate = dateFilter === 'all' || (() => {
      const paymentDate = new Date(payment.created_at);
      const now = new Date();
      if (dateFilter === 'today') {
        return paymentDate.toDateString() === now.toDateString();
      } else if (dateFilter === 'week') {
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return paymentDate >= weekAgo;
      } else if (dateFilter === 'month') {
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        return paymentDate >= monthAgo;
      }
      return true;
    })();

    return matchesQuery && matchesStatus && matchesDate;
  });

  const totalRevenue = filteredPayments
    .filter(p => p.status === 'paid')
    .reduce((sum, p) => sum + parseFloat(p.amount || 0), 0);

  const totalPending = filteredPayments
    .filter(p => p.status === 'pending')
    .reduce((sum, p) => sum + parseFloat(p.amount || 0), 0);

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${theme === 'dark' ? 'bg-dark-bg' : 'bg-gray-50'}`}>
        <div className="text-center">
          <div className={`h-12 w-12 animate-spin rounded-full border-4 mx-auto mb-4 ${
            theme === 'dark' ? 'border-electric-blue/20 border-t-electric-blue' : 'border-accent-red/20 border-t-accent-red'
          }`} />
          <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Loading payments...</p>
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
                <FiDollarSign className="h-6 w-6 text-white" />
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
                  Payment Management
                </h1>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
                Total Revenue
              </p>
              <p className={`text-3xl font-bold ${
                theme === 'dark' ? 'text-electric-green' : 'text-green-600'
              }`} style={{ fontFamily: 'Orbitron, sans-serif' }}>
                ₹{totalRevenue.toLocaleString()}
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
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
                Pending Payments
              </p>
              <p className={`text-3xl font-bold ${
                theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'
              }`} style={{ fontFamily: 'Orbitron, sans-serif' }}>
                ₹{totalPending.toLocaleString()}
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
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
                Total Transactions
              </p>
              <p className={`text-3xl font-bold ${
                theme === 'dark' ? 'text-electric-blue' : 'text-accent-blue'
              }`} style={{ fontFamily: 'Orbitron, sans-serif' }}>
                {filteredPayments.length}
              </p>
            </div>
          </motion.div>
        </div>

        {/* Filters Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
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
                placeholder="Search by course or order ID..."
                className={`w-full pl-10 pr-4 py-3 rounded-xl border-2 text-sm transition-all ${
                  theme === 'dark'
                    ? 'bg-dark-lighter border-gray-700 text-white placeholder:text-gray-500 focus:border-electric-blue focus:ring-2 focus:ring-electric-blue/20'
                    : 'bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-accent-red focus:ring-2 focus:ring-accent-red/20'
                }`}
              />
            </div>
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
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className={`px-4 py-3 rounded-xl border-2 text-sm font-semibold transition-all ${
                theme === 'dark'
                  ? 'bg-dark-lighter border-gray-700 text-white focus:border-electric-blue focus:ring-2 focus:ring-electric-blue/20'
                  : 'bg-white border-gray-300 text-gray-900 focus:border-accent-red focus:ring-2 focus:ring-accent-red/20'
              }`}
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">Last 7 Days</option>
              <option value="month">Last 30 Days</option>
            </select>
          </div>
        </motion.div>

        {/* Payments Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className={`rounded-2xl border-2 p-6 shadow-xl ${
            theme === 'dark' ? 'bg-dark-card border-gray-700' : 'bg-white border-gray-200'
          }`}
        >
          {filteredPayments.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className={`border-b-2 ${
                    theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
                  }`}>
                    <th className={`text-left py-4 px-4 text-xs font-bold uppercase tracking-wider ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      Order ID
                    </th>
                    <th className={`text-left py-4 px-4 text-xs font-bold uppercase tracking-wider ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      Course
                    </th>
                    <th className={`text-center py-4 px-4 text-xs font-bold uppercase tracking-wider ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      Amount
                    </th>
                    <th className={`text-center py-4 px-4 text-xs font-bold uppercase tracking-wider ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      Status
                    </th>
                    <th className={`text-center py-4 px-4 text-xs font-bold uppercase tracking-wider ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      Date
                    </th>
                    <th className={`text-right py-4 px-4 text-xs font-bold uppercase tracking-wider ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {filteredPayments.map((payment, index) => (
                      <motion.tr
                        key={payment.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ delay: index * 0.05 }}
                        className={`border-b transition-colors ${
                          theme === 'dark' ? 'border-gray-800 hover:bg-gray-800/50' : 'border-gray-100 hover:bg-gray-50'
                        }`}
                      >
                        <td className="py-4 px-4">
                          <p className={`font-mono text-sm font-semibold ${
                            theme === 'dark' ? 'text-white' : 'text-gray-900'
                          }`}>
                            {payment.razorpay_order_id || 'N/A'}
                          </p>
                        </td>
                        <td className="py-4 px-4">
                          <p className={`font-semibold ${
                            theme === 'dark' ? 'text-white' : 'text-gray-900'
                          }`}>
                            {payment.course_title || 'Unknown Course'}
                          </p>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <p className={`font-bold text-lg ${
                            theme === 'dark' ? 'text-electric-green' : 'text-green-600'
                          }`}>
                            ₹{parseFloat(payment.amount || 0).toLocaleString()}
                          </p>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${
                            payment.status === 'paid'
                              ? theme === 'dark'
                                ? 'bg-electric-green/20 text-electric-green border border-electric-green/30'
                                : 'bg-green-100 text-green-700 border border-green-300'
                              : payment.status === 'pending'
                              ? theme === 'dark'
                                ? 'bg-yellow-400/20 text-yellow-400 border border-yellow-400/30'
                                : 'bg-yellow-100 text-yellow-700 border border-yellow-300'
                              : theme === 'dark'
                                ? 'bg-red-400/20 text-red-400 border border-red-400/30'
                                : 'bg-red-100 text-red-700 border border-red-300'
                          }`}>
                            {payment.status === 'paid' ? (
                              <>
                                <FiCheckCircle size={14} />
                                Paid
                              </>
                            ) : payment.status === 'pending' ? (
                              <>
                                <FiClock size={14} />
                                Pending
                              </>
                            ) : (
                              <>
                                <FiXCircle size={14} />
                                Failed
                              </>
                            )}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <p className={`text-sm ${
                            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                          }`}>
                            {new Date(payment.created_at).toLocaleDateString()}
                          </p>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <button
                            className={`p-2 rounded-lg transition-all ${
                              theme === 'dark'
                                ? 'text-electric-blue hover:bg-gray-800 hover:text-electric-green'
                                : 'text-accent-red hover:bg-gray-100 hover:text-accent-blue'
                            }`}
                            title="View Details"
                          >
                            <FiEye size={18} />
                          </button>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-16">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200 }}
              >
                <FiDollarSign className={`mx-auto mb-4 ${
                  theme === 'dark' ? 'text-gray-600' : 'text-gray-400'
                }`} size={64} />
              </motion.div>
              <p className={`text-xl font-bold mb-2 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`} style={{ fontFamily: 'Orbitron, sans-serif' }}>
                No payments found
              </p>
              <p className={`text-sm ${
                theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
              }`}>
                {searchQuery || statusFilter !== 'all' || dateFilter !== 'all'
                  ? 'Try adjusting your filters'
                  : 'Payments will appear here once transactions are made'}
              </p>
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
};

export default AdminPaymentManagement;
