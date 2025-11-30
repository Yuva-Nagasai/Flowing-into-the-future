import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { aiToolsAPI } from '../../utils/api';
import { useTheme } from '../../context/ThemeContext';
import { FiPlus, FiEdit, FiTrash2, FiSearch, FiZap, FiArrowLeft } from 'react-icons/fi';
import { Brain, Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';

const AdminAIToolsManagement = () => {
  const [tools, setTools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [pricingFilter, setPricingFilter] = useState('all');
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const categories = [
    { id: 'all', label: 'All Categories' },
    { id: 'text', label: 'Text & Writing' },
    { id: 'image', label: 'Image Generation' },
    { id: 'code', label: 'Code Assistant' },
    { id: 'audio', label: 'Audio & Voice' },
    { id: 'video', label: 'Video Creation' },
    { id: 'analysis', label: 'Data Analysis' },
    { id: 'translation', label: 'Translation' }
  ];

  useEffect(() => {
    fetchTools();
  }, []);

  const fetchTools = async () => {
    try {
      const response = await aiToolsAPI.getAllAdmin();
      setTools(response.data.tools);
    } catch (error) {
      console.error('Error fetching tools:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this AI tool?')) return;

    try {
      await aiToolsAPI.delete(id);
      fetchTools();
    } catch (error) {
      alert('Error deleting tool');
    }
  };

  const handleToggleActive = async (tool) => {
    try {
      await aiToolsAPI.update(tool.id, { active: !tool.active });
      fetchTools();
    } catch (error) {
      alert('Error updating tool');
    }
  };

  const filteredTools = tools.filter(tool => {
    const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         tool.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || tool.category === categoryFilter;
    const matchesPricing = pricingFilter === 'all' || tool.pricing_type === pricingFilter;
    return matchesSearch && matchesCategory && matchesPricing;
  });

  return (
    <div className={`min-h-screen transition-colors duration-300 ${theme === 'dark' ? 'bg-slate-950' : 'bg-gray-50'}`}>
      {/* Gradient Background Effects */}
      <div className={`fixed inset-0 pointer-events-none ${
        theme === 'dark' 
          ? 'bg-[radial-gradient(ellipse_at_top_right,_rgba(59,130,246,0.15),transparent_50%),radial-gradient(ellipse_at_bottom_left,_rgba(16,185,129,0.10),transparent_60%)]'
          : 'bg-[radial-gradient(ellipse_at_top,_rgba(59,130,246,0.08),transparent_50%)]'
      }`} />
      <header className={`sticky top-0 z-50 border-b backdrop-blur-2xl ${
        theme === 'dark' 
          ? 'border-slate-800/50 bg-slate-950/80 shadow-2xl shadow-black/30' 
          : 'border-gray-200/80 bg-white/80 shadow-lg shadow-gray-200/50'
      }`}>
        <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.div 
                whileHover={{ scale: 1.05, rotate: 3 }}
                className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br shadow-xl ${
                  theme === 'dark'
                    ? 'from-violet-500 to-purple-600 shadow-violet-500/30'
                    : 'from-blue-500 to-indigo-600 shadow-blue-500/30'
                }`}
              >
                <Brain className="h-7 w-7 text-white" />
              </motion.div>
              <div>
                <p className={`text-xs font-bold uppercase tracking-[0.2em] mb-0.5 ${
                  theme === 'dark' ? 'text-violet-400' : 'text-blue-600'
                }`}>
                  Admin Panel
                </p>
                <h1 className={`text-2xl font-bold tracking-tight ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  AI Tools Management
                </h1>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={toggleTheme}
                className={`p-2.5 rounded-xl transition-all ${
                  theme === 'dark'
                    ? 'bg-slate-800 hover:bg-slate-700 text-violet-400 border border-slate-700'
                    : 'bg-white hover:bg-gray-50 text-blue-600 border border-gray-200 shadow-sm'
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
                  className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 ${
                    theme === 'dark'
                      ? 'bg-slate-800 border border-slate-700 text-gray-300 hover:bg-slate-700 hover:text-white'
                      : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 shadow-sm'
                  }`}
                >
                  <FiArrowLeft size={18} />
                  <span>Back to Dashboard</span>
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className={`text-2xl font-bold tracking-tight ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Manage AI Tools
            </h2>
            <p className={`text-sm mt-1.5 ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Create, edit, and manage AI tools for the showcase page
            </p>
          </div>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Link
              to="/academy/admin/ai-tools/create"
              className={`inline-flex items-center gap-2 rounded-xl px-6 py-3 font-semibold text-white shadow-lg transition-all ${
                theme === 'dark'
                  ? 'bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 shadow-violet-500/25'
                  : 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-blue-500/25'
              }`}
            >
              <FiPlus size={18} />
              Create New Tool
            </Link>
          </motion.div>
        </div>

        <div className={`rounded-2xl p-5 mb-8 ${
          theme === 'dark'
            ? 'bg-slate-900/50 border border-slate-800'
            : 'bg-white border border-gray-200 shadow-sm'
        }`}>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <FiSearch className={`absolute left-4 top-1/2 -translate-y-1/2 ${
                theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
              }`} size={18} />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tools..."
                className={`w-full pl-11 pr-4 py-3 rounded-xl transition-all focus:outline-none focus:ring-2 ${
                  theme === 'dark'
                    ? 'bg-slate-800 border border-slate-700 text-white placeholder:text-gray-500 focus:border-violet-500 focus:ring-violet-500/20'
                    : 'bg-gray-50 border border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500/20'
                }`}
              />
            </div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className={`px-4 py-3 rounded-xl transition-all focus:outline-none focus:ring-2 ${
                theme === 'dark'
                  ? 'bg-slate-800 border border-slate-700 text-white focus:border-violet-500 focus:ring-violet-500/20'
                  : 'bg-gray-50 border border-gray-200 text-gray-900 focus:border-blue-500 focus:ring-blue-500/20'
              }`}
            >
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.label}</option>
              ))}
            </select>
            <select
              value={pricingFilter}
              onChange={(e) => setPricingFilter(e.target.value)}
              className={`px-4 py-3 rounded-xl transition-all focus:outline-none focus:ring-2 ${
                theme === 'dark'
                  ? 'bg-slate-800 border border-slate-700 text-white focus:border-violet-500 focus:ring-violet-500/20'
                  : 'bg-gray-50 border border-gray-200 text-gray-900 focus:border-blue-500 focus:ring-blue-500/20'
              }`}
            >
              <option value="all">All Pricing</option>
              <option value="free">Free</option>
              <option value="paid">Paid</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className={`flex items-center justify-center rounded-2xl py-24 ${
            theme === 'dark'
              ? 'bg-slate-900/50 border border-slate-800'
              : 'bg-white border border-gray-200'
          }`}>
            <div className={`flex items-center gap-4 ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              <div className={`h-8 w-8 animate-spin rounded-full border-4 ${
                theme === 'dark'
                  ? 'border-violet-500/20 border-t-violet-500'
                  : 'border-blue-500/20 border-t-blue-500'
              }`} />
              <span className="text-lg font-medium">Loading tools...</span>
            </div>
          </div>
        ) : filteredTools.length === 0 ? (
          <div className={`rounded-2xl p-16 text-center ${
            theme === 'dark'
              ? 'bg-slate-900/50 border border-slate-800'
              : 'bg-white border border-gray-200'
          }`}>
            <div className={`w-20 h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center ${
              theme === 'dark' ? 'bg-slate-800' : 'bg-gray-100'
            }`}>
              <Brain className={`h-10 w-10 ${
                theme === 'dark' ? 'text-violet-400' : 'text-blue-500'
              }`} />
            </div>
            <h3 className={`text-2xl font-bold mb-3 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>No tools found</h3>
            <p className={`text-base mb-6 ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {tools.length === 0 
                ? 'Create your first AI tool to get started'
                : 'No tools match your search criteria'}
            </p>
            {tools.length === 0 && (
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Link
                  to="/academy/admin/ai-tools/create"
                  className={`inline-flex items-center gap-2 rounded-xl px-6 py-3 font-semibold text-white shadow-lg transition-all ${
                    theme === 'dark'
                      ? 'bg-gradient-to-r from-violet-500 to-purple-600 shadow-violet-500/25'
                      : 'bg-gradient-to-r from-blue-500 to-indigo-600 shadow-blue-500/25'
                  }`}
                >
                  <FiPlus size={18} />
                  Create First Tool
                </Link>
              </motion.div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTools.map((tool, index) => {
              const getCategoryGradient = (category) => {
                const gradients = {
                  'writing': 'from-blue-500 to-cyan-500',
                  'image': 'from-purple-500 to-pink-500',
                  'video': 'from-red-500 to-orange-500',
                  'audio': 'from-green-500 to-emerald-500',
                  'code': 'from-violet-500 to-purple-600',
                  'productivity': 'from-amber-500 to-yellow-500',
                  'research': 'from-indigo-500 to-blue-500',
                  'marketing': 'from-rose-500 to-pink-500',
                  'data': 'from-teal-500 to-cyan-500',
                  'other': 'from-slate-500 to-gray-500'
                };
                return gradients[category?.toLowerCase()] || 'from-violet-500 to-purple-600';
              };
              const gradientClass = getCategoryGradient(tool.category);
              
              return (
              <motion.div
                key={tool.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className={`group relative rounded-2xl p-6 transition-all duration-300 ${
                  theme === 'dark'
                    ? 'bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-slate-700/50 hover:border-violet-500/50 shadow-xl shadow-black/20'
                    : 'bg-white border border-gray-100 hover:border-blue-200 shadow-lg shadow-gray-200/50 hover:shadow-xl'
                }`}
              >
                <div className={`absolute top-0 right-0 w-24 h-24 rounded-full blur-3xl opacity-20 transition-opacity group-hover:opacity-30 bg-gradient-to-br ${gradientClass}`} />
                
                <div className="relative flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-br shadow-lg ${gradientClass}`}>
                    <Brain className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${
                      tool.pricing_type === 'free'
                        ? theme === 'dark'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-green-100 text-green-700'
                        : theme === 'dark'
                          ? 'bg-amber-500/20 text-amber-400'
                          : 'bg-amber-100 text-amber-700'
                    }`}>
                      {tool.pricing_type === 'free' ? 'Free' : 'Paid'}
                    </span>
                    <button
                      onClick={() => handleToggleActive(tool)}
                      className={`text-xs font-bold px-3 py-1.5 rounded-full transition-all ${
                        tool.active
                          ? theme === 'dark'
                            ? 'bg-violet-500/20 text-violet-400 hover:bg-violet-500/30'
                            : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                          : theme === 'dark'
                            ? 'bg-slate-700 text-gray-400 hover:bg-slate-600'
                            : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                      }`}
                    >
                      {tool.active ? 'Active' : 'Inactive'}
                    </button>
                  </div>
                </div>

                <h3 className={`text-lg font-bold mb-2 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  {tool.name}
                </h3>

                <p className={`text-sm mb-4 line-clamp-2 leading-relaxed ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {tool.description}
                </p>

                <div className={`inline-flex items-center gap-2 mb-4 text-xs font-medium px-2.5 py-1 rounded-lg ${
                  theme === 'dark' ? 'bg-slate-800 text-gray-400' : 'bg-gray-100 text-gray-600'
                }`}>
                  <FiZap size={12} />
                  <span className="capitalize">{tool.category}</span>
                </div>

                <div className={`flex items-center gap-2 pt-4 border-t ${
                  theme === 'dark' ? 'border-slate-700/50' : 'border-gray-100'
                }`}>
                  <Link
                    to={`/academy/admin/ai-tools/edit/${tool.id}`}
                    className={`flex-1 flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all ${
                      theme === 'dark'
                        ? 'bg-slate-800 text-violet-400 hover:bg-violet-500/20 border border-slate-700'
                        : 'bg-gray-50 text-blue-600 hover:bg-blue-50 border border-gray-200'
                    }`}
                  >
                    <FiEdit size={16} />
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(tool.id)}
                    className={`p-2.5 rounded-xl transition-all ${
                      theme === 'dark'
                        ? 'bg-slate-800 text-red-400 hover:bg-red-500/20 border border-slate-700'
                        : 'bg-gray-50 text-red-500 hover:bg-red-50 border border-gray-200'
                    }`}
                  >
                    <FiTrash2 size={16} />
                  </button>
                </div>
              </motion.div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminAIToolsManagement;

