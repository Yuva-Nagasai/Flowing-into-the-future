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
                <Brain className="h-6 w-6 text-white" />
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
                  AI Tools Management
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
              Manage AI Tools
            </h2>
            <p className={`text-sm mt-1 ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Create, edit, and manage AI tools for the showcase page
            </p>
          </div>
          <Link
            to="/academy/admin/ai-tools/create"
            className={`inline-flex items-center gap-2 rounded-xl px-6 py-3 font-semibold text-white transition ${
              theme === 'dark'
                ? 'bg-electric-green hover:bg-electric-blue'
                : 'bg-accent-red hover:bg-accent-blue'
            }`}
          >
            <FiPlus size={18} />
            Create New Tool
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
                placeholder="Search tools..."
                className={`w-full pl-10 pr-4 py-2.5 rounded-lg border-2 transition focus:outline-none focus:ring-2 ${
                  theme === 'dark'
                    ? 'bg-dark-card border-gray-700 text-white placeholder:text-gray-500 focus:border-electric-blue focus:ring-electric-blue/20'
                    : 'bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-accent-red focus:ring-accent-red/20'
                }`}
              />
            </div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className={`px-4 py-2.5 rounded-lg border-2 transition focus:outline-none focus:ring-2 ${
                theme === 'dark'
                  ? 'bg-dark-card border-gray-700 text-white focus:border-electric-blue focus:ring-electric-blue/20'
                  : 'bg-white border-gray-300 text-gray-900 focus:border-accent-red focus:ring-accent-red/20'
              }`}
            >
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.label}</option>
              ))}
            </select>
            <select
              value={pricingFilter}
              onChange={(e) => setPricingFilter(e.target.value)}
              className={`px-4 py-2.5 rounded-lg border-2 transition focus:outline-none focus:ring-2 ${
                theme === 'dark'
                  ? 'bg-dark-card border-gray-700 text-white focus:border-electric-blue focus:ring-electric-blue/20'
                  : 'bg-white border-gray-300 text-gray-900 focus:border-accent-red focus:ring-accent-red/20'
              }`}
            >
              <option value="all">All Pricing</option>
              <option value="free">Free</option>
              <option value="paid">Paid</option>
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
              Loading tools...
            </div>
          </div>
        ) : filteredTools.length === 0 ? (
          <div className={`rounded-xl border-2 p-12 text-center shadow-xl ${
            theme === 'dark'
              ? 'border-gray-700 bg-dark-lighter'
              : 'border-gray-200 bg-white'
          }`}>
            <Brain className={`h-16 w-16 mx-auto mb-4 ${
              theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
            }`} />
            <h3 className={`text-2xl font-bold mb-2 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>No tools found</h3>
            <p className={`text-base ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {tools.length === 0 
                ? 'Create your first AI tool to get started'
                : 'No tools match your search criteria'}
            </p>
            {tools.length === 0 && (
              <Link
                to="/academy/admin/ai-tools/create"
                className={`mt-6 inline-flex items-center gap-2 rounded-xl px-6 py-3 font-semibold text-white transition ${
                  theme === 'dark'
                    ? 'bg-electric-green hover:bg-electric-blue'
                    : 'bg-accent-red hover:bg-accent-blue'
                }`}
              >
                <FiPlus size={18} />
                Create First Tool
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTools.map((tool, index) => (
              <motion.div
                key={tool.id}
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
                  <div className={`p-3 rounded-lg bg-gradient-to-br ${tool.color}`}>
                    <Brain className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                      tool.pricing_type === 'free'
                        ? theme === 'dark'
                          ? 'bg-electric-green/20 text-electric-green'
                          : 'bg-green-100 text-green-600'
                        : theme === 'dark'
                          ? 'bg-yellow-500/20 text-yellow-400'
                          : 'bg-yellow-100 text-yellow-600'
                    }`}>
                      {tool.pricing_type === 'free' ? 'Free' : 'Paid'}
                    </span>
                    <button
                      onClick={() => handleToggleActive(tool)}
                      className={`text-xs font-semibold px-3 py-1 rounded-full transition ${
                        tool.active
                          ? theme === 'dark'
                            ? 'bg-electric-blue/20 text-electric-blue'
                            : 'bg-blue-100 text-blue-600'
                          : theme === 'dark'
                            ? 'bg-gray-700 text-gray-400'
                            : 'bg-gray-200 text-gray-500'
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

                <p className={`text-sm mb-3 line-clamp-2 ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {tool.description}
                </p>

                <div className={`flex items-center gap-2 mb-4 text-xs ${
                  theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                }`}>
                  <span className="capitalize">{tool.category}</span>
                </div>

                <div className="flex items-center gap-2 pt-4 border-t border-gray-700 dark:border-gray-800">
                  <Link
                    to={`/academy/admin/ai-tools/edit/${tool.id}`}
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
                    onClick={() => handleDelete(tool.id)}
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

export default AdminAIToolsManagement;

