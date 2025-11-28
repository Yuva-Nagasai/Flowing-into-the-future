import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { certificatesAPI } from '../../utils/api';
import { useTheme } from '../../context/ThemeContext';
import { 
  FiArrowLeft, FiAward, FiSearch, FiDownload, FiEye, FiUser, FiBook
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const AdminCertificateManagement = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();

  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [courseFilter, setCourseFilter] = useState('all');

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    setLoading(true);
    try {
      const response = await certificatesAPI.getUserCertificates();
      setCertificates(response.data.certificates || []);
    } catch (error) {
      console.error('Error fetching certificates:', error);
      setCertificates([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredCertificates = certificates.filter(cert => {
    const matchesQuery = !searchQuery || 
      cert.user_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cert.course_title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cert.certificate_id?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCourse = courseFilter === 'all' || cert.course_id === parseInt(courseFilter);

    return matchesQuery && matchesCourse;
  });

  const uniqueCourses = [...new Set(certificates.map(c => ({ id: c.course_id, title: c.course_title })))];

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${theme === 'dark' ? 'bg-dark-bg' : 'bg-gray-50'}`}>
        <div className="text-center">
          <div className={`h-12 w-12 animate-spin rounded-full border-4 mx-auto mb-4 ${
            theme === 'dark' ? 'border-electric-blue/20 border-t-electric-blue' : 'border-accent-red/20 border-t-accent-red'
          }`} />
          <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Loading certificates...</p>
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
                <FiAward className="h-6 w-6 text-white" />
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
                  Certificate Management
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
                Total Certificates
              </p>
              <p className={`text-3xl font-bold ${
                theme === 'dark' ? 'text-electric-green' : 'text-green-600'
              }`} style={{ fontFamily: 'Orbitron, sans-serif' }}>
                {certificates.length}
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
                Unique Students
              </p>
              <p className={`text-3xl font-bold ${
                theme === 'dark' ? 'text-electric-blue' : 'text-accent-blue'
              }`} style={{ fontFamily: 'Orbitron, sans-serif' }}>
                {new Set(certificates.map(c => c.user_id)).size}
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
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
                Courses
              </p>
              <p className={`text-3xl font-bold ${
                theme === 'dark' ? 'text-purple-400' : 'text-purple-600'
              }`} style={{ fontFamily: 'Orbitron, sans-serif' }}>
                {uniqueCourses.length}
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
                placeholder="Search by student, course, or certificate ID..."
                className={`w-full pl-10 pr-4 py-3 rounded-xl border-2 text-sm transition-all ${
                  theme === 'dark'
                    ? 'bg-dark-lighter border-gray-700 text-white placeholder:text-gray-500 focus:border-electric-blue focus:ring-2 focus:ring-electric-blue/20'
                    : 'bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-accent-red focus:ring-2 focus:ring-accent-red/20'
                }`}
              />
            </div>
            <select
              value={courseFilter}
              onChange={(e) => setCourseFilter(e.target.value)}
              className={`px-4 py-3 rounded-xl border-2 text-sm font-semibold transition-all ${
                theme === 'dark'
                  ? 'bg-dark-lighter border-gray-700 text-white focus:border-electric-blue focus:ring-2 focus:ring-electric-blue/20'
                  : 'bg-white border-gray-300 text-gray-900 focus:border-accent-red focus:ring-2 focus:ring-accent-red/20'
              }`}
            >
              <option value="all">All Courses</option>
              {uniqueCourses.map(course => (
                <option key={course.id} value={course.id}>{course.title}</option>
              ))}
            </select>
          </div>
        </motion.div>

        {/* Certificates Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className={`rounded-2xl border-2 p-6 shadow-xl ${
            theme === 'dark' ? 'bg-dark-card border-gray-700' : 'bg-white border-gray-200'
          }`}
        >
          {filteredCertificates.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className={`border-b-2 ${
                    theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
                  }`}>
                    <th className={`text-left py-4 px-4 text-xs font-bold uppercase tracking-wider ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      Certificate ID
                    </th>
                    <th className={`text-left py-4 px-4 text-xs font-bold uppercase tracking-wider ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      Student
                    </th>
                    <th className={`text-left py-4 px-4 text-xs font-bold uppercase tracking-wider ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      Course
                    </th>
                    <th className={`text-center py-4 px-4 text-xs font-bold uppercase tracking-wider ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      Issued Date
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
                    {filteredCertificates.map((certificate, index) => (
                      <motion.tr
                        key={certificate.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ delay: index * 0.05 }}
                        className={`border-b transition-colors ${
                          theme === 'dark' ? 'border-gray-800 hover:bg-gray-800/50' : 'border-gray-100 hover:bg-gray-50'
                        }`}
                      >
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <FiAward className={theme === 'dark' ? 'text-electric-green' : 'text-green-600'} size={18} />
                            <p className={`font-mono text-sm font-semibold ${
                              theme === 'dark' ? 'text-white' : 'text-gray-900'
                            }`}>
                              {certificate.certificate_id || 'N/A'}
                            </p>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <FiUser className={theme === 'dark' ? 'text-gray-500' : 'text-gray-400'} size={16} />
                            <p className={`font-semibold ${
                              theme === 'dark' ? 'text-white' : 'text-gray-900'
                            }`}>
                              {certificate.user_name || 'Unknown User'}
                            </p>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <FiBook className={theme === 'dark' ? 'text-gray-500' : 'text-gray-400'} size={16} />
                            <p className={`font-medium ${
                              theme === 'dark' ? 'text-white' : 'text-gray-900'
                            }`}>
                              {certificate.course_title || 'Unknown Course'}
                            </p>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <p className={`text-sm ${
                            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                          }`}>
                            {new Date(certificate.issued_at).toLocaleDateString()}
                          </p>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {certificate.certificate_url && (
                              <>
                                <a
                                  href={certificate.certificate_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className={`p-2 rounded-lg transition-all ${
                                    theme === 'dark'
                                      ? 'text-electric-blue hover:bg-gray-800 hover:text-electric-green'
                                      : 'text-accent-red hover:bg-gray-100 hover:text-accent-blue'
                                  }`}
                                  title="View Certificate"
                                >
                                  <FiEye size={18} />
                                </a>
                                <a
                                  href={certificate.certificate_url}
                                  download
                                  className={`p-2 rounded-lg transition-all ${
                                    theme === 'dark'
                                      ? 'text-electric-green hover:bg-gray-800 hover:text-electric-blue'
                                      : 'text-green-600 hover:bg-gray-100 hover:text-green-700'
                                  }`}
                                  title="Download Certificate"
                                >
                                  <FiDownload size={18} />
                                </a>
                              </>
                            )}
                          </div>
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
                <FiAward className={`mx-auto mb-4 ${
                  theme === 'dark' ? 'text-gray-600' : 'text-gray-400'
                }`} size={64} />
              </motion.div>
              <p className={`text-xl font-bold mb-2 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`} style={{ fontFamily: 'Orbitron, sans-serif' }}>
                No certificates found
              </p>
              <p className={`text-sm ${
                theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
              }`}>
                {searchQuery || courseFilter !== 'all'
                  ? 'Try adjusting your filters'
                  : 'Certificates will appear here once students complete courses'}
              </p>
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
};

export default AdminCertificateManagement;
