import { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { useAIToolsAuth } from '../../contexts/AIToolsAuthContext';
import {
  Menu,
  X,
  Sun,
  Moon,
  User,
  LogOut,
  Settings
} from 'lucide-react';
import TopFeatureNav from '../TopFeatureNav';

const AIToolsNav = () => {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAIToolsAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showTopBar, setShowTopBar] = useState(true);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const navItems = [
    { path: '/ai-tools', label: 'Home' },
    { path: '/ai-tools/explore', label: 'Explore Tools' },
    { path: '/ai-tools/about', label: 'About' },
    { path: '/ai-tools/blog', label: 'Blog' },
    { path: '/ai-tools/contact', label: 'Contact' }
  ];

  const isActivePath = (path: string) => {
    if (!path) return false;
    if (path === '/ai-tools') {
      return false;
    }
    return (
      location.pathname === path ||
      location.pathname.startsWith(`${path}/`)
    );
  };

  const topBarHeight = 68;

  useEffect(() => {
    const handleScroll = () => {
      const nearTop = window.scrollY <= 24;
      setShowTopBar(nearTop);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const avatarLabel = useMemo(() => {
    if (!user?.name && !user?.email) return 'U';
    const source = user?.name || user?.email || '';
    return (source.charAt(0) || 'U').toUpperCase();
  }, [user]);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50">
        <div
          className={`transition-[max-height,opacity] duration-500 ease-in-out ${
            showTopBar ? 'max-h-32 opacity-100' : 'max-h-0 opacity-0 pointer-events-none'
          }`}
        >
          <TopFeatureNav />
        </div>
        <div
          className={`transition-all duration-300 ${
            theme === 'dark'
              ? 'bg-dark-card/95 border-b border-gray-800/50'
              : 'bg-white/95 border-b border-gray-200/50'
          } backdrop-blur-lg shadow-lg`}
        >
          <nav className="container mx-auto px-6">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
            <Link to="/ai-tools" className="flex items-center gap-4 group">
              <img
                src="/NanoFlows-LOGO-removebg-preview.png"
                alt="NanoFlows logo"
                className="h-16 w-18 object-contain"
              />
              <div className="leading-tight">
                <h1
                  className={`text-lg font-bold uppercase tracking-wide bg-clip-text text-transparent ${
                    theme === 'dark'
                      ? 'bg-gradient-to-r from-electric-green via-electric-blue to-electric-green'
                      : 'bg-gradient-to-r from-accent-red via-accent-blue to-accent-red'
                  }`}
                >
                  AI Tools
                </h1>
              </div>
            </Link>

              {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-6 flex-1 justify-center">
              <div className="flex items-center gap-8 lg:gap-10">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`font-exo font-medium transition-all duration-300 ${
                      isActivePath(item.path)
                        ? theme === 'dark'
                          ? 'text-electric-green'
                          : 'text-accent-red'
                        : theme === 'dark'
                          ? 'text-white hover:text-electric-green'
                          : 'text-black hover:text-accent-red'
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

              <div className="flex items-center gap-2 relative">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleTheme}
                aria-label="Toggle theme"
                className={`p-2 rounded-full transition-all duration-300 ${
                  theme === 'dark'
                    ? 'bg-dark-card hover:bg-dark-lighter text-electric-blue hover:glow-blue'
                    : 'bg-gray-100 hover:bg-gray-200 text-accent-red hover:glow-red'
                }`}
              >
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              </motion.button>

              {!user && (
                <>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate('/ai-tools/login')}
                    className={`hidden lg:block px-4 py-2 rounded-md font-exo font-medium transition-all duration-300 border ${
                      theme === 'dark'
                        ? 'border-electric-blue text-electric-blue hover:bg-electric-blue/10'
                        : 'border-accent-blue text-accent-blue hover:bg-accent-blue/10'
                    }`}
                  >
                    Login
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate('/ai-tools/signup')}
                    className={`hidden lg:block relative group overflow-hidden px-4 py-2 rounded-md font-exo font-medium shadow-lg transition-all duration-300 ${
                      theme === 'dark'
                        ? 'bg-gradient-to-r from-electric-green to-electric-blue text-dark-bg'
                        : 'bg-gradient-to-r from-accent-red to-accent-blue text-white'
                    }`}
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      Sign Up
                    </span>
                    <div
                      className={`absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 ${
                        theme === 'dark'
                          ? 'bg-gradient-to-r from-electric-blue to-electric-green'
                          : 'bg-gradient-to-r from-accent-blue to-accent-red'
                      }`}
                    />
                  </motion.button>
                </>
              )}

              {user && (
                <div className="relative">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setShowUserMenu((prev) => !prev)}
                    className={`hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all ${
                      theme === 'dark'
                        ? 'border-gray-700 bg-dark-lighter hover:border-electric-blue'
                        : 'border-gray-200 bg-gray-50 hover:border-accent-red'
                    }`}
                  >
                    <div
                      className={`h-8 w-8 rounded-full flex items-center justify-center font-semibold ${
                        theme === 'dark'
                          ? 'bg-electric-blue/20 text-electric-blue'
                          : 'bg-accent-red/10 text-accent-red'
                      }`}
                    >
                      {avatarLabel}
                    </div>
                    <div className="text-left leading-tight">
                      <p className={`text-xs font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        {user.name || 'AI Tools User'}
                      </p>
                      <p className={`text-[11px] ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        {user.email}
                      </p>
                    </div>
                    <User size={16} className={theme === 'dark' ? 'text-electric-blue' : 'text-accent-red'} />
                  </motion.button>

                  <AnimatePresence>
                    {showUserMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        className={`absolute right-0 mt-2 w-56 rounded-2xl shadow-lg border backdrop-blur-sm ${
                          theme === 'dark'
                            ? 'bg-slate-900/80 border-slate-700/70'
                            : 'bg-gradient-to-br from-accent-red/10 to-accent-blue/10 border-accent-red/30'
                        }`}
                      >
                        <div className="px-4 py-3 border-b border-gray-700/20">
                          <p className={`text-sm font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                            {user.name || 'AI Tools User'}
                          </p>
                          <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                            {user.email}
                          </p>
                        </div>
                        <div className="py-2">
                          <button
                            onClick={() => {
                              setShowUserMenu(false);
                              navigate('/ai-tools/explore');
                            }}
                            className={`w-full flex items-center gap-2 px-4 py-2 text-sm font-medium transition ${
                              theme === 'dark'
                                ? 'text-slate-900 bg-gradient-to-r from-electric-blue to-electric-green hover:opacity-95'
                                : 'text-white bg-gradient-to-r from-accent-red/80 to-accent-blue/80 hover:opacity-95'
                            }`}
                          >
                            <Settings size={16} />
                            Manage Tools
                          </button>
                          <button
                            onClick={() => {
                              setShowUserMenu(false);
                              logout();
                              navigate('/ai-tools');
                            }}
                            className={`w-full flex items-center gap-2 px-4 py-2 text-sm transition ${
                              theme === 'dark'
                                ? 'text-red-300 hover:bg-red-500/10'
                                : 'text-red-600 hover:bg-red-50'
                            }`}
                          >
                            <LogOut size={16} />
                            Sign out
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

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
          </nav>
        </div>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`lg:hidden border-t ${
                theme === 'dark'
                  ? 'border-gray-800 bg-dark-card'
                  : 'border-gray-200 bg-white'
              }`}
            >
              <div className="container mx-auto px-4 py-4">
                <div className="space-y-2">
                  {navItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`block px-4 py-3 rounded-xl font-exo font-medium transition-all duration-300 ${
                        isActivePath(item.path)
                          ? theme === 'dark'
                            ? 'text-electric-green bg-dark-lighter/70'
                            : 'text-accent-red bg-gray-100'
                          : theme === 'dark'
                            ? 'text-white hover:bg-dark-lighter hover:text-electric-green'
                            : 'text-black hover:bg-gray-100 hover:text-accent-red'
                      }`}
                    >
                      {item.label}
                    </Link>
                  ))}

                  <div className={`pt-2 mt-2 border-t space-y-2 ${
                    theme === 'dark' ? 'border-gray-800' : 'border-gray-200'
                  }`}>
                    {!user && (
                      <>
                        <button
                          onClick={() => {
                            setMobileMenuOpen(false);
                            navigate('/ai-tools/login');
                          }}
                          className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-exo font-medium transition-all duration-300 border ${
                            theme === 'dark'
                              ? 'border-electric-blue text-electric-blue hover:bg-electric-blue/10'
                              : 'border-accent-blue text-accent-blue hover:bg-accent-blue/10'
                          }`}
                        >
                          Login
                        </button>
                        <button
                          onClick={() => {
                            setMobileMenuOpen(false);
                            navigate('/ai-tools/signup');
                          }}
                          className={`relative group overflow-hidden w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-exo font-medium transition-all duration-300 ${
                            theme === 'dark'
                              ? 'bg-gradient-to-r from-electric-green to-electric-blue text-dark-bg'
                              : 'bg-gradient-to-r from-accent-red to-accent-blue text-white'
                          }`}
                        >
                          <span className="relative z-10">
                          Sign Up
                          </span>
                          <div
                            className={`absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 ${
                              theme === 'dark'
                                ? 'bg-gradient-to-r from-electric-blue to-electric-green'
                                : 'bg-gradient-to-r from-accent-blue to-accent-red'
                            }`}
                          />
                        </button>
                      </>
                    )}

                    {user && (
                      <>
                        <div className="flex items-center gap-3 px-4 py-2 rounded-xl">
                          <div
                            className={`h-10 w-10 rounded-full flex items-center justify-center font-semibold ${
                              theme === 'dark'
                                ? 'bg-electric-blue/20 text-electric-blue'
                                : 'bg-accent-red/10 text-accent-red'
                            }`}
                          >
                            {avatarLabel}
                          </div>
                          <div className="text-left">
                            <p className={`text-sm font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                              {user.name || 'AI Tools User'}
                            </p>
                            <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                              {user.email}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            setMobileMenuOpen(false);
                            navigate('/ai-tools/explore');
                          }}
                          className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-exo font-medium transition-all duration-300 border ${
                            theme === 'dark'
                              ? 'border-transparent text-slate-900 bg-gradient-to-r from-electric-blue to-electric-green hover:opacity-95'
                              : 'border-gray-200 text-white bg-gradient-to-r from-accent-red/80 to-accent-blue/80 hover:opacity-95'
                          }`}
                        >
                          <Settings size={16} />
                          Manage Tools
                        </button>
                        <button
                          onClick={() => {
                            setMobileMenuOpen(false);
                            logout();
                            navigate('/ai-tools');
                          }}
                          className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-exo font-medium transition-all duration-300 ${
                            theme === 'dark'
                              ? 'text-red-300 hover:bg-red-500/10'
                              : 'text-red-600 hover:bg-red-50'
                          }`}
                        >
                          <LogOut size={16} />
                          Sign out
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <div
        className="w-full"
        style={{
          height: showTopBar
            ? `${topBarHeight + 64}px`
            : '64px',
        }}
      />
    </>
  );
};

export default AIToolsNav;
