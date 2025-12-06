import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { purchasesAPI, certificatesAPI, paymentsAPI, progressAPI } from '../../utils/api';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { 
  FiUser, FiBook, FiAward, FiCreditCard, FiLogOut, FiDownload,
  FiCheckCircle, FiTrendingUp, FiCalendar, FiDollarSign
} from 'react-icons/fi';
import { motion } from 'framer-motion';
import SEO from '../../components/SEO';

const Profile = () => {
  const { user, logout } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('overview');
  const [purchases, setPurchases] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [payments, setPayments] = useState([]);
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [purchasesRes, certificatesRes, paymentsRes, progressRes] = await Promise.all([
        purchasesAPI.getUserPurchases(),
        certificatesAPI.getUserCertificates(),
        paymentsAPI.getHistory(),
        progressAPI.getUserProgress()
      ]);

      setPurchases(purchasesRes.data.purchases || []);
      setCertificates(certificatesRes.data.certificates || []);
      setPayments(paymentsRes.data.payments || []);
      setProgress(progressRes.data.courses || []);
    } catch (error) {
      console.error('Error fetching profile data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/academy/dashboard');
  };

  const totalSpent = payments
    .filter(p => p.status === 'paid')
    .reduce((sum, p) => sum + parseFloat(p.amount || 0), 0);

  const coursesCompleted = certificates.length;
  const totalCourses = purchases.length;

  const tabs = [
    { id: 'overview', label: 'Overview', icon: FiUser },
    { id: 'courses', label: 'My Courses', icon: FiBook },
    { id: 'certificates', label: 'Certificates', icon: FiAward },
    { id: 'billing', label: 'Billing History', icon: FiCreditCard }
  ];

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${theme === 'dark' ? 'bg-dark-bg' : 'bg-gray-50'}`}>
        <div className={`text-xl ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Loading profile...</div>
      </div>
    );
  }

  return (
    <>
      <SEO
        title="Profile | NanoFlows Academy"
        description="Manage your Academy profile, view purchase history, certificates, and account settings."
        keywords="academy profile, account settings, purchase history, certificates, user profile"
      />
      <div className={`min-h-screen ${theme === 'dark' ? 'bg-dark-bg' : 'bg-gray-50'}`}>
        {/* Header */}
      <header className={`sticky top-0 z-50 border-b backdrop-blur-md ${
        theme === 'dark' 
          ? 'border-gray-800/50 bg-dark-card/90' 
          : 'border-gray-200/50 bg-white/90'
      }`}>
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              My Profile
            </h1>
            <button
              onClick={handleLogout}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
                theme === 'dark'
                  ? 'bg-red-600/30 text-red-300 border border-red-500/50 hover:bg-red-600/40'
                  : 'bg-red-100 text-red-700 border border-red-300 hover:bg-red-200'
              }`}
            >
              <FiLogOut /> Logout
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* User Info Card */}
        <div className={`rounded-xl border-2 p-6 mb-8 shadow-xl ${
          theme === 'dark'
            ? 'bg-dark-card border-gray-700'
            : 'bg-white border-gray-200'
        }`}>
          <div className="flex items-center gap-6">
            <div className={`w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold ${
              theme === 'dark'
                ? 'bg-electric-blue/20 text-electric-blue'
                : 'bg-accent-red/20 text-accent-red'
            }`}>
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="flex-1">
              <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {user?.name || 'User'}
              </h2>
              <p className={`mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                {user?.email}
              </p>
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className={`text-2xl font-bold ${
                  theme === 'dark' ? 'text-electric-green' : 'text-accent-red'
                }`}>
                  {totalCourses}
                </div>
                <div className={`text-xs mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  Courses
                </div>
              </div>
              <div>
                <div className={`text-2xl font-bold ${
                  theme === 'dark' ? 'text-electric-green' : 'text-accent-red'
                }`}>
                  {coursesCompleted}
                </div>
                <div className={`text-xs mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  Certificates
                </div>
              </div>
              <div>
                <div className={`text-2xl font-bold ${
                  theme === 'dark' ? 'text-electric-green' : 'text-accent-red'
                }`}>
                  ₹{totalSpent.toLocaleString()}
                </div>
                <div className={`text-xs mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  Spent
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all whitespace-nowrap ${
                  isActive
                    ? theme === 'dark'
                      ? 'bg-electric-green text-black'
                      : 'bg-accent-red text-white'
                    : theme === 'dark'
                      ? 'bg-dark-card text-gray-400 hover:text-white'
                      : 'bg-white text-gray-600 hover:text-gray-900'
                }`}
              >
                <Icon /> {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div>
          {/* Overview */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className={`rounded-xl border-2 p-6 ${
                  theme === 'dark' ? 'bg-dark-card border-gray-700' : 'bg-white border-gray-200'
                }`}>
                  <div className={`flex items-center gap-3 mb-2 ${
                    theme === 'dark' ? 'text-electric-blue' : 'text-accent-red'
                  }`}>
                    <FiTrendingUp size={24} />
                    <h3 className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      Learning Progress
                    </h3>
                  </div>
                  <p className={`text-2xl font-bold mt-2 ${
                    theme === 'dark' ? 'text-electric-green' : 'text-accent-red'
                  }`}>
                    {progress.length > 0
                      ? Math.round(progress.reduce((sum, p) => sum + p.progress_percentage, 0) / progress.length)
                      : 0}%
                  </p>
                  <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    Average completion
                  </p>
                </div>

                <div className={`rounded-xl border-2 p-6 ${
                  theme === 'dark' ? 'bg-dark-card border-gray-700' : 'bg-white border-gray-200'
                }`}>
                  <div className={`flex items-center gap-3 mb-2 ${
                    theme === 'dark' ? 'text-electric-blue' : 'text-accent-red'
                  }`}>
                    <FiAward size={24} />
                    <h3 className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      Certificates
                    </h3>
                  </div>
                  <p className={`text-2xl font-bold mt-2 ${
                    theme === 'dark' ? 'text-electric-green' : 'text-accent-red'
                  }`}>
                    {certificates.length}
                  </p>
                  <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    Earned certificates
                  </p>
                </div>

                <div className={`rounded-xl border-2 p-6 ${
                  theme === 'dark' ? 'bg-dark-card border-gray-700' : 'bg-white border-gray-200'
                }`}>
                  <div className={`flex items-center gap-3 mb-2 ${
                    theme === 'dark' ? 'text-electric-blue' : 'text-accent-red'
                  }`}>
                    <FiDollarSign size={24} />
                    <h3 className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      Total Spent
                    </h3>
                  </div>
                  <p className={`text-2xl font-bold mt-2 ${
                    theme === 'dark' ? 'text-electric-green' : 'text-accent-red'
                  }`}>
                    ₹{totalSpent.toLocaleString()}
                  </p>
                  <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    On courses
                  </p>
                </div>
              </div>

              {/* Recent Courses */}
              <div className={`rounded-xl border-2 p-6 ${
                theme === 'dark' ? 'bg-dark-card border-gray-700' : 'bg-white border-gray-200'
              }`}>
                <h3 className={`text-xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  Recent Courses
                </h3>
                <div className="space-y-3">
                  {purchases.slice(0, 5).map(purchase => {
                    const courseProgress = progress.find(p => p.course_id === purchase.course_id);
                    return (
                      <Link
                        key={purchase.id}
                        to={`/academy/player/${purchase.course_id}`}
                        className={`block p-4 rounded-lg transition-all ${
                          theme === 'dark'
                            ? 'bg-dark-lighter hover:bg-gray-800 border border-gray-700'
                            : 'bg-gray-50 hover:bg-gray-100 border border-gray-200'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h4 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                              {purchase.course_title || purchase.course?.title}
                            </h4>
                            {courseProgress && (
                              <div className="mt-2">
                                <div className={`w-full h-2 rounded-full overflow-hidden ${
                                  theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200'
                                }`}>
                                  <div 
                                    className={`h-full transition-all ${
                                      theme === 'dark' 
                                        ? 'bg-gradient-to-r from-electric-blue to-electric-green'
                                        : 'bg-gradient-to-r from-accent-red to-accent-blue'
                                    }`}
                                    style={{ width: `${courseProgress.progress_percentage}%` }}
                                  />
                                </div>
                                <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                  {courseProgress.progress_percentage}% Complete
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Courses */}
          {activeTab === 'courses' && (
            <div className={`rounded-xl border-2 p-6 ${
              theme === 'dark' ? 'bg-dark-card border-gray-700' : 'bg-white border-gray-200'
            }`}>
              <h3 className={`text-xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                My Enrolled Courses ({purchases.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {purchases.map(purchase => {
                  const courseProgress = progress.find(p => p.course_id === purchase.course_id);
                  return (
                    <Link
                      key={purchase.id}
                      to={`/academy/player/${purchase.course_id}`}
                      className={`block rounded-lg overflow-hidden border-2 transition-all hover:scale-105 ${
                        theme === 'dark'
                          ? 'bg-dark-lighter border-gray-700 hover:border-electric-blue'
                          : 'bg-white border-gray-200 hover:border-accent-red'
                      }`}
                    >
                      <div className="aspect-video bg-gradient-to-br from-blue-500 to-purple-500" />
                      <div className="p-4">
                        <h4 className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                          {purchase.course_title || purchase.course?.title}
                        </h4>
                        {courseProgress && (
                          <div className="mt-3">
                            <div className={`w-full h-2 rounded-full overflow-hidden ${
                              theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200'
                            }`}>
                              <div 
                                className={`h-full transition-all ${
                                  theme === 'dark' 
                                    ? 'bg-gradient-to-r from-electric-blue to-electric-green'
                                    : 'bg-gradient-to-r from-accent-red to-accent-blue'
                                }`}
                                style={{ width: `${courseProgress.progress_percentage}%` }}
                              />
                            </div>
                            <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                              {courseProgress.progress_percentage}% Complete
                            </p>
                          </div>
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {/* Certificates */}
          {activeTab === 'certificates' && (
            <div className={`rounded-xl border-2 p-6 ${
              theme === 'dark' ? 'bg-dark-card border-gray-700' : 'bg-white border-gray-200'
            }`}>
              <h3 className={`text-xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                My Certificates ({certificates.length})
              </h3>
              {certificates.length === 0 ? (
                <div className={`text-center py-12 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  <FiAward size={64} className="mx-auto mb-4 opacity-50" />
                  <p className="text-lg">No certificates yet</p>
                  <p className="text-sm mt-2">Complete courses to earn certificates</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {certificates.map(cert => (
                    <div
                      key={cert.id}
                      className={`p-6 rounded-lg border-2 ${
                        theme === 'dark'
                          ? 'bg-dark-lighter border-electric-blue/30'
                          : 'bg-gray-50 border-accent-red/30'
                      }`}
                    >
                      <div className={`flex items-center gap-3 mb-3 ${
                        theme === 'dark' ? 'text-electric-green' : 'text-accent-red'
                      }`}>
                        <FiAward size={24} />
                        <h4 className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                          {cert.course_title}
                        </h4>
                      </div>
                      <p className={`text-sm mb-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        Certificate ID: {cert.certificate_id}
                      </p>
                      <p className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                        Issued: {new Date(cert.issued_at).toLocaleDateString()}
                      </p>
                      {cert.certificate_url && (
                        <a
                          href={cert.certificate_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-lg font-semibold transition-all ${
                            theme === 'dark'
                              ? 'bg-electric-green text-black hover:bg-electric-blue'
                              : 'bg-accent-red text-white hover:bg-accent-blue'
                          }`}
                        >
                          <FiDownload /> Download
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Billing History */}
          {activeTab === 'billing' && (
            <div className={`rounded-xl border-2 p-6 ${
              theme === 'dark' ? 'bg-dark-card border-gray-700' : 'bg-white border-gray-200'
            }`}>
              <h3 className={`text-xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Billing History
              </h3>
              {payments.length === 0 ? (
                <div className={`text-center py-12 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  <FiCreditCard size={64} className="mx-auto mb-4 opacity-50" />
                  <p className="text-lg">No payments yet</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className={`border-b ${
                        theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
                      }`}>
                        <th className={`text-left py-3 px-4 font-semibold ${
                          theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                        }`}>Date</th>
                        <th className={`text-left py-3 px-4 font-semibold ${
                          theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                        }`}>Course</th>
                        <th className={`text-left py-3 px-4 font-semibold ${
                          theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                        }`}>Amount</th>
                        <th className={`text-left py-3 px-4 font-semibold ${
                          theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                        }`}>Status</th>
                        <th className={`text-left py-3 px-4 font-semibold ${
                          theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                        }`}>Order ID</th>
                      </tr>
                    </thead>
                    <tbody>
                      {payments.map(payment => (
                        <tr
                          key={payment.id}
                          className={`border-b ${
                            theme === 'dark' ? 'border-gray-800' : 'border-gray-100'
                          }`}
                        >
                          <td className={`py-3 px-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                            {new Date(payment.created_at).toLocaleDateString()}
                          </td>
                          <td className={`py-3 px-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                            {payment.course_title || 'N/A'}
                          </td>
                          <td className={`py-3 px-4 font-semibold ${
                            theme === 'dark' ? 'text-white' : 'text-gray-900'
                          }`}>
                            ₹{parseFloat(payment.amount || 0).toLocaleString()}
                          </td>
                          <td className="py-3 px-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              payment.status === 'paid'
                                ? theme === 'dark'
                                  ? 'bg-electric-green/20 text-electric-green'
                                  : 'bg-green-100 text-green-700'
                                : theme === 'dark'
                                  ? 'bg-yellow-500/20 text-yellow-400'
                                  : 'bg-yellow-100 text-yellow-700'
                            }`}>
                              {payment.status}
                            </span>
                          </td>
                          <td className={`py-3 px-4 text-xs font-mono ${
                            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                          }`}>
                            {payment.razorpay_order_id}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      </div>
    </>
  );
};

export default Profile;

