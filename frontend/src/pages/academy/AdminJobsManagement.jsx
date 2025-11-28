import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { jobsAPI } from '../../utils/api';
import { useTheme } from '../../context/ThemeContext';
import { FiPlus, FiEdit, FiTrash2, FiLogOut, FiSearch, FiZap, FiBriefcase, FiArrowLeft } from 'react-icons/fi';
import { Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';

const AdminJobsManagement = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const departments = [
    'Engineering',
    'AI Engineer',
    'Design',
    'Education',
    'Infrastructure',
    'Marketing',
    'Customer Success',
    'Sales',
    'Operations',
    'Product',
    'HR'
  ];

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await jobsAPI.getAllAdmin();
      setJobs(response.data.jobs);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this job posting?')) return;

    try {
      await jobsAPI.delete(id);
      fetchJobs();
    } catch (error) {
      alert('Error deleting job');
    }
  };

  const handleToggleActive = async (job) => {
    try {
      await jobsAPI.update(job.id, { active: !job.active });
      fetchJobs();
    } catch (error) {
      alert('Error updating job');
    }
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         job.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDepartment = departmentFilter === 'all' || job.department === departmentFilter;
    return matchesSearch && matchesDepartment;
  });

  return (
    <div className={`min-h-screen transition-colors duration-300 ${theme === 'dark' ? 'bg-dark-bg' : 'bg-gray-50'}`}>
      {/* Gradient Background Effects */}
      <div className={`fixed inset-0 pointer-events-none ${
        theme === 'dark' 
          ? 'bg-[radial-gradient(circle_at_top_right,_rgba(0,240,255,0.15),transparent_50%),radial-gradient(circle_at_bottom_left,_rgba(0,232,129,0.10),transparent_60%)]'
          : 'bg-[radial-gradient(circle_at_top,_rgba(235,50,50,0.20),rgba(255,255,255,0.8)_50%)]'
      }`} />
      <header className={`sticky top-0 z-50 border-b backdrop-blur-xl ${
        theme === 'dark' ? 'border-electric-blue/20 bg-dark-card/90 shadow-lg shadow-black/20' : 'border-gray-200/50 bg-white/90 shadow-md shadow-gray-200/20'
      }`}>
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br shadow-lg ${
                theme === 'dark'
                  ? 'from-electric-blue to-electric-green shadow-electric-blue/40'
                  : 'from-accent-red to-accent-blue shadow-accent-red/40'
              }`}>
                <FiBriefcase className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className={`text-xs font-bold uppercase tracking-[0.25em] ${
                  theme === 'dark' ? 'text-electric-green' : 'text-accent-red'
                }`}>
                  NanoFlows Academy
                </p>
                <h1 className={`text-xl font-bold ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`} style={{ fontFamily: 'Orbitron, sans-serif' }}>
                  Job Postings Management
                </h1>
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
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link
                  to="/academy/admin"
                  className={`inline-flex items-center gap-0 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 border-2 ${
                    theme === 'dark'
                      ? 'bg-transparent border-electric-blue/50 text-electric-blue hover:bg-electric-blue hover:text-black hover:border-electric-blue hover:shadow-lg hover:shadow-electric-blue/30'
                      : 'bg-transparent border-accent-red/50 text-accent-red hover:bg-accent-red hover:text-white hover:border-accent-red hover:shadow-lg hover:shadow-accent-red/30'
                  }`}
                >
                  <FiArrowLeft size={18} />
                  <span className="ml-1">Back</span>
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className={`text-2xl font-bold ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`} style={{ fontFamily: 'Orbitron, sans-serif' }}>
              Manage Job Postings
            </h2>
            <p className={`text-sm mt-1 ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Create, edit, and manage job postings for the careers page
            </p>
          </div>
          <Link
            to="/academy/admin/jobs/create"
            className={`inline-flex items-center gap-2 rounded-xl px-6 py-3 font-semibold text-white transition ${
              theme === 'dark'
                ? 'bg-electric-green hover:bg-electric-blue'
                : 'bg-accent-red hover:bg-accent-blue'
            }`}
          >
            <FiPlus size={18} />
            Create New Job
          </Link>
        </div>

        <div className={`rounded-xl border-2 p-6 shadow-xl mb-6 ${
          theme === 'dark'
            ? 'bg-dark-lighter border-gray-700'
            : 'bg-white border-gray-200'
        }`}>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <FiSearch className={`absolute left-3 top-1/2 -translate-y-1/2 ${
                theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
              }`} />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search jobs..."
                className={`w-full pl-10 pr-4 py-2.5 rounded-lg border-2 transition focus:outline-none focus:ring-2 ${
                  theme === 'dark'
                    ? 'bg-dark-card border-gray-700 text-white placeholder:text-gray-500 focus:border-electric-blue focus:ring-electric-blue/20'
                    : 'bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-accent-red focus:ring-accent-red/20'
                }`}
              />
            </div>
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className={`px-4 py-2.5 rounded-lg border-2 transition focus:outline-none focus:ring-2 ${
                theme === 'dark'
                  ? 'bg-dark-card border-gray-700 text-white focus:border-electric-blue focus:ring-electric-blue/20'
                  : 'bg-white border-gray-300 text-gray-900 focus:border-accent-red focus:ring-accent-red/20'
              }`}
            >
              <option value="all">All Departments</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div className={`flex items-center justify-center rounded-xl border-2 py-20 shadow-xl ${
            theme === 'dark'
              ? 'border-gray-700 bg-dark-lighter'
              : 'border-gray-200 bg-white'
          }`}>
            <div className={`flex items-center gap-3 ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              <div className={`h-6 w-6 animate-spin rounded-full border-4 ${
                theme === 'dark'
                  ? 'border-electric-blue/20 border-t-electric-blue'
                  : 'border-accent-red/20 border-t-accent-red'
              }`} />
              Loading jobs...
            </div>
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className={`rounded-xl border-2 p-12 text-center shadow-xl ${
            theme === 'dark'
              ? 'border-gray-700 bg-dark-lighter'
              : 'border-gray-200 bg-white'
          }`}>
            <FiBriefcase className={`h-16 w-16 mx-auto mb-4 ${
              theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
            }`} />
            <h3 className={`text-2xl font-bold mb-2 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>No jobs found</h3>
            <p className={`text-base ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {jobs.length === 0 
                ? 'Create your first job posting to get started'
                : 'No jobs match your search criteria'}
            </p>
            {jobs.length === 0 && (
              <Link
                to="/academy/admin/jobs/create"
                className={`mt-6 inline-flex items-center gap-2 rounded-xl px-6 py-3 font-semibold text-white transition ${
                  theme === 'dark'
                    ? 'bg-electric-green hover:bg-electric-blue'
                    : 'bg-accent-red hover:bg-accent-blue'
                }`}
              >
                <FiPlus size={18} />
                Create First Job
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.map((job, index) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className={`rounded-xl border-2 p-6 shadow-lg transition hover:shadow-xl ${
                  theme === 'dark'
                    ? 'bg-dark-lighter border-gray-700 hover:border-electric-blue'
                    : 'bg-white border-gray-200 hover:border-accent-red'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                    theme === 'dark'
                      ? 'bg-electric-blue/20 text-electric-blue'
                      : 'bg-accent-red/20 text-accent-red'
                  }`}>
                    {job.department}
                  </span>
                  <button
                    onClick={() => handleToggleActive(job)}
                    className={`text-xs font-semibold px-3 py-1 rounded-full transition ${
                      job.active
                        ? theme === 'dark'
                          ? 'bg-electric-green/20 text-electric-green'
                          : 'bg-green-100 text-green-600'
                        : theme === 'dark'
                          ? 'bg-gray-700 text-gray-400'
                          : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {job.active ? 'Active' : 'Inactive'}
                  </button>
                </div>

                <h3 className={`text-lg font-bold mb-2 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  {job.title}
                </h3>

                <div className={`flex flex-wrap gap-2 mb-3 text-xs ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  <span>{job.location}</span>
                  <span>•</span>
                  <span>{job.type}</span>
                </div>

                <p className={`text-sm mb-4 line-clamp-2 ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {job.description}
                </p>

                <div className="flex items-center gap-2 pt-4 border-t border-gray-700 dark:border-gray-800">
                  <Link
                    to={`/academy/admin/jobs/edit/${job.id}`}
                    className={`flex-1 flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition ${
                      theme === 'dark'
                        ? 'border-gray-700 text-electric-blue hover:border-electric-blue hover:bg-electric-blue/10'
                        : 'border-gray-200 text-accent-red hover:border-accent-red hover:bg-accent-red/10'
                    } border-2`}
                  >
                    <FiEdit size={16} />
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(job.id)}
                    className={`p-2 rounded-lg border-2 transition ${
                      theme === 'dark'
                        ? 'border-gray-700 text-red-400 hover:border-red-500 hover:bg-red-500/10'
                        : 'border-gray-200 text-red-500 hover:border-red-400 hover:bg-red-50'
                    }`}
                  >
                    <FiTrash2 size={16} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminJobsManagement;

