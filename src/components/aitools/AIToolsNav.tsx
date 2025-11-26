import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import {
  Brain,
  Home,
  Compass,
  Info,
  Menu,
  X,
  Sun,
  Moon,
  LogOut,
  ArrowLeft,
  Sparkles,
  ChevronDown
} from 'lucide-react';
import RoleBadge from '../academy/RoleBadge';

const AIToolsNav = () => {
  const { theme, toggleTheme } = useTheme();
  const { user, logout, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/academy/platform-selection');
  };

  const navItems = [
    { path: '/ai-tools', label: 'Home', icon: Home },
    { path: '/ai-tools/explore', label: 'Explore Tools', icon: Compass },
    { path: '/ai-tools/about', label: 'About', icon: Info }
  ];

  const isActive = (path: string) => {
    if (path === '/ai-tools') {
      return location.pathname === '/ai-tools';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        theme === 'dark'
          ? 'bg-dark-card/95 backdrop-blur-xl border-b border-gray-800/50'
          : 'bg-white/95 backdrop-blur-xl border-b border-gray-200/50'
      }`}>
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            <div className="flex items-center gap-3">
              <motion.button
                onClick={() => navigate('/academy/platform-selection')}
                whileHover={{ scale: 1.05, x: -3 }}
                whileTap={{ scale: 0.95 }}
                className={`flex h-9 w-9 items-center justify-center rounded-xl transition-all ${
                  theme === 'dark'
                    ? 'bg-dark-lighter hover:bg-gray-700 text-gray-400 hover:text-electric-green'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-accent-red'
                }`}
                title="Back to Platform Selection"
              >
                <ArrowLeft className="h-5 w-5" />
              </motion.button>

              <Link to="/ai-tools" className="flex items-center gap-3 group">
                <motion.div
                  whileHover={{ scale: 1.05, rotate: 5 }}
                  className={`flex h-10 w-10 lg:h-12 lg:w-12 items-center justify-center rounded-xl bg-gradient-to-br shadow-lg ${
                    theme === 'dark'
                      ? 'from-electric-blue to-electric-green shadow-electric-blue/30'
                      : 'from-accent-red to-accent-blue shadow-accent-red/30'
                  }`}
                >
                  <Brain className="h-5 w-5 lg:h-6 lg:w-6 text-white" />
                </motion.div>
                <div className="hidden sm:block">
                  <p className={`text-[10px] font-bold uppercase tracking-wider ${
                    theme === 'dark' ? 'text-electric-green' : 'text-accent-red'
                  }`}>
                    NanoFlows
                  </p>
                  <h1 className={`text-lg font-bold ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`} style={{ fontFamily: 'Orbitron, sans-serif' }}>
                    AI Tools
                  </h1>
                </div>
              </Link>
            </div>

            <div className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`relative flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
                      active
                        ? theme === 'dark'
                          ? 'text-electric-green bg-electric-green/10'
                          : 'text-accent-red bg-accent-red/10'
                        : theme === 'dark'
                          ? 'text-gray-400 hover:text-white hover:bg-white/5'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                    {active && (
                      <motion.div
                        layoutId="navIndicator"
                        className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full ${
                          theme === 'dark' ? 'bg-electric-green' : 'bg-accent-red'
                        }`}
                      />
                    )}
                  </Link>
                );
              })}
            </div>

            <div className="flex items-center gap-2 lg:gap-3">
              <div className={`hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-lg ${
                theme === 'dark' 
                  ? 'bg-dark-lighter/70 border border-electric-blue/20' 
                  : 'bg-gray-100/70 border border-gray-200'
              }`}>
                <div className="text-right">
                  <p className={`text-[10px] font-semibold ${
                    theme === 'dark' ? 'text-electric-blue' : 'text-accent-blue'
                  }`}>
                    Welcome
                  </p>
                  <p className={`text-sm font-bold ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    {authLoading ? '...' : (user?.name?.split(' ')[0] || 'User')}
                  </p>
                </div>
                {user?.role && <RoleBadge role={user.role} size="sm" />}
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleTheme}
                className={`flex h-9 w-9 items-center justify-center rounded-xl transition-all ${
                  theme === 'dark'
                    ? 'bg-dark-lighter hover:bg-gray-700 text-electric-blue'
                    : 'bg-gray-100 hover:bg-gray-200 text-accent-blue'
                }`}
              >
                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className={`hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                  theme === 'dark'
                    ? 'bg-red-600/20 text-red-400 border border-red-500/30 hover:bg-red-600/30'
                    : 'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100'
                }`}
              >
                <LogOut size={16} />
                <span className="hidden md:inline">Logout</span>
              </motion.button>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={`lg:hidden flex h-9 w-9 items-center justify-center rounded-xl transition-all ${
                  theme === 'dark'
                    ? 'bg-dark-lighter hover:bg-gray-700 text-white'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                }`}
              >
                {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`fixed top-16 left-0 right-0 z-40 lg:hidden ${
              theme === 'dark'
                ? 'bg-dark-card/98 backdrop-blur-xl border-b border-gray-800'
                : 'bg-white/98 backdrop-blur-xl border-b border-gray-200'
            }`}
          >
            <div className="container mx-auto px-4 py-4">
              <div className="space-y-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.path);
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                        active
                          ? theme === 'dark'
                            ? 'text-electric-green bg-electric-green/10'
                            : 'text-accent-red bg-accent-red/10'
                          : theme === 'dark'
                            ? 'text-gray-400 hover:text-white hover:bg-white/5'
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      {item.label}
                    </Link>
                  );
                })}

                <div className={`pt-2 mt-2 border-t ${
                  theme === 'dark' ? 'border-gray-800' : 'border-gray-200'
                }`}>
                  <button
                    onClick={handleLogout}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                      theme === 'dark'
                        ? 'text-red-400 hover:bg-red-600/10'
                        : 'text-red-600 hover:bg-red-50'
                    }`}
                  >
                    <LogOut className="w-5 h-5" />
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="h-16 lg:h-20" />
    </>
  );
};

export default AIToolsNav;
