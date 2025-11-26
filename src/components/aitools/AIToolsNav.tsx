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
  Globe,
  GraduationCap,
  Cpu,
  LayoutGrid
} from 'lucide-react';
import RoleBadge from '../academy/RoleBadge';

const topNavItems = [
  { label: '1 Website', to: '/', icon: Globe },
  { label: '2 E-Learning', to: '/elearning', icon: GraduationCap },
  { label: '3 AI Tools', to: '/ai-tools', icon: Cpu, featured: true },
  { label: '4 Digital Hub', to: '/contact', icon: LayoutGrid },
];

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

  const topBarHeight = 60;

  return (
    <>
      <div className={`fixed top-0 left-0 right-0 z-50 ${
        theme === 'dark'
          ? 'bg-[#030b1f] border-b border-electric-blue/20 shadow-[0_2px_12px_rgba(0,0,0,0.45)]'
          : 'bg-white border-b border-gray-200/80 shadow-[0_2px_12px_rgba(46,55,77,0.08)]'
      } backdrop-blur-[2px]`}>
        <div className="container mx-auto px-6">
          <div
            className="grid grid-cols-4 gap-2 py-3 sm:gap-3 md:flex md:flex-nowrap md:justify-between md:gap-3 lg:gap-4 md:overflow-x-auto no-scrollbar"
            style={{ scrollbarWidth: 'none' as const, msOverflowStyle: 'none' as const }}
          >
            {topNavItems.map(({ label, to, icon: Icon, featured }) => (
              <Link
                key={label}
                to={to}
                className={`flex items-center justify-center rounded-2xl px-1.5 py-2.5 md:px-1 md:py-1.5 flex-1 md:flex-none md:w-[70px] lg:w-[78px] min-w-0 transition-all duration-200 border h-12 md:h-11 shadow-sm ${
                  featured
                    ? theme === 'dark'
                      ? 'bg-gradient-to-r from-electric-green to-electric-blue text-[#041226] border-transparent shadow-[0_8px_18px_rgba(0,240,255,0.25)]'
                      : 'bg-gradient-to-r from-accent-red to-accent-blue text-white border-transparent shadow-[0_8px_18px_rgba(244,63,94,0.25)]'
                    : theme === 'dark'
                    ? 'bg-[#09142b] text-slate-100 border-electric-blue/30 hover:border-electric-green/60 hover:bg-[#0f1f3f]'
                    : 'bg-gray-50 text-slate-800 border-gray-200 hover:border-accent-blue/60 hover:bg-white hover:text-accent-blue'
                }`}
              >
                <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
              </Link>
            ))}
          </div>
        </div>
      </div>

      <nav className={`fixed left-0 right-0 z-40 transition-all duration-300 ${
        theme === 'dark'
          ? 'bg-dark-card/95 backdrop-blur-xl border-b border-gray-800/50'
          : 'bg-white/95 backdrop-blur-xl border-b border-gray-200/50'
      }`} style={{ top: `${topBarHeight}px` }}>
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <motion.button
                onClick={() => navigate('/academy/platform-selection')}
                whileHover={{ scale: 1.05, x: -3 }}
                whileTap={{ scale: 0.95 }}
                className={`flex h-8 w-8 items-center justify-center rounded-lg transition-all ${
                  theme === 'dark'
                    ? 'bg-dark-lighter hover:bg-gray-700 text-gray-400 hover:text-electric-green'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-accent-red'
                }`}
                title="Back to Platform Selection"
              >
                <ArrowLeft className="h-4 w-4" />
              </motion.button>

              <Link to="/ai-tools" className="flex items-center gap-2 group">
                <motion.div
                  whileHover={{ scale: 1.05, rotate: 5 }}
                  className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br shadow-lg ${
                    theme === 'dark'
                      ? 'from-electric-blue to-electric-green shadow-electric-blue/30'
                      : 'from-accent-red to-accent-blue shadow-accent-red/30'
                  }`}
                >
                  <Brain className="h-5 w-5 text-white" />
                </motion.div>
                <div className="hidden sm:block">
                  <p className={`text-[10px] font-bold uppercase tracking-wider ${
                    theme === 'dark' ? 'text-electric-green' : 'text-accent-red'
                  }`}>
                    NanoFlows
                  </p>
                  <h1 className={`text-base font-bold ${
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
                    className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
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

            <div className="flex items-center gap-2">
              <div className={`hidden xl:flex items-center gap-2 px-2 py-1 rounded-lg ${
                theme === 'dark' 
                  ? 'bg-dark-lighter/70 border border-electric-blue/20' 
                  : 'bg-gray-100/70 border border-gray-200'
              }`}>
                <div className="text-right">
                  <p className={`text-[9px] font-semibold ${
                    theme === 'dark' ? 'text-electric-blue' : 'text-accent-blue'
                  }`}>
                    Welcome
                  </p>
                  <p className={`text-xs font-bold ${
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
                className={`flex h-8 w-8 items-center justify-center rounded-lg transition-all ${
                  theme === 'dark'
                    ? 'bg-dark-lighter hover:bg-gray-700 text-electric-blue'
                    : 'bg-gray-100 hover:bg-gray-200 text-accent-blue'
                }`}
              >
                {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  theme === 'dark'
                    ? 'bg-red-600/20 text-red-400 border border-red-500/30 hover:bg-red-600/30'
                    : 'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100'
                }`}
              >
                <LogOut size={14} />
                <span className="hidden md:inline">Logout</span>
              </motion.button>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={`lg:hidden flex h-8 w-8 items-center justify-center rounded-lg transition-all ${
                  theme === 'dark'
                    ? 'bg-dark-lighter hover:bg-gray-700 text-white'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                }`}
              >
                {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
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
            className={`fixed top-[124px] left-0 right-0 z-30 lg:hidden ${
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

      <div className="h-[124px]" />
    </>
  );
};

export default AIToolsNav;
