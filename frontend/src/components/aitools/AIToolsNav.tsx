import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import {
  Menu,
  X,
  Sun,
  Moon,
  Search
} from 'lucide-react';
import TopFeatureNav from '../TopFeatureNav';

interface AIToolsNavProps {
  onSearch?: (term: string) => void;
  searchTerm?: string;
}

const AIToolsNav = ({ onSearch, searchTerm = '' }: AIToolsNavProps) => {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);
  const [showTopBar, setShowTopBar] = useState(true);

  const handleSearchChange = (value: string) => {
    setLocalSearchTerm(value);
    if (onSearch) {
      onSearch(value);
    }
  };

  const navItems = [
    { path: '/ai-tools', label: 'Home' },
    { path: '/ai-tools/explore', label: 'Explore Tools' },
    { path: '/ai-tools/about', label: 'About' },
    { path: '/ai-tools/contact', label: 'Contact' }
  ];

  const topBarHeight = 60;

  useEffect(() => {
    const handleScroll = () => {
      const nearTop = window.scrollY <= 24;
      setShowTopBar(nearTop);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
                      theme === 'dark'
                        ? 'text-white hover:text-electric-green'
                        : 'text-black hover:text-accent-red'
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
              
              {/* Search Bar */}
              <div className="relative">
                <div className={`flex items-center px-3 py-1.5 rounded-lg border ${
                  theme === 'dark'
                    ? 'bg-dark-lighter border-gray-700'
                    : 'bg-gray-100 border-gray-200'
                }`}>
                  <Search className={`w-4 h-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={localSearchTerm}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    className={`ml-2 bg-transparent border-none outline-none text-sm w-32 ${
                      theme === 'dark' ? 'text-white placeholder-gray-400' : 'text-gray-900 placeholder-gray-500'
                    }`}
                  />
                </div>
              </div>
            </div>

              <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleTheme}
                className={`p-2 rounded-lg transition-all ${
                  theme === 'dark'
                    ? 'bg-dark-lighter text-yellow-400 hover:bg-gray-700'
                    : 'bg-gray-100 text-blue-600 hover:bg-gray-200'
                }`}
              >
                {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/academy/login')}
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
                onClick={() => navigate('/academy/signup')}
                className={`hidden lg:block px-4 py-2 rounded-md font-exo font-medium transition-all duration-300 ${
                  theme === 'dark'
                    ? 'bg-gradient-to-r from-electric-green to-electric-blue text-dark-bg hover:shadow-lg hover:shadow-electric-green/30'
                    : 'bg-gradient-to-r from-accent-red to-accent-blue text-white hover:shadow-lg hover:shadow-accent-red/30'
                }`}
              >
                Sign Up
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
                {/* Mobile Search Bar */}
                <div className={`flex items-center px-3 py-2 rounded-lg border mb-4 ${
                  theme === 'dark'
                    ? 'bg-dark-lighter border-gray-700'
                    : 'bg-gray-100 border-gray-200'
                }`}>
                  <Search className={`w-4 h-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={localSearchTerm}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    className={`ml-2 bg-transparent border-none outline-none text-sm flex-1 ${
                      theme === 'dark' ? 'text-white placeholder-gray-400' : 'text-gray-900 placeholder-gray-500'
                    }`}
                  />
                </div>

                <div className="space-y-2">
                  {navItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`block px-4 py-3 rounded-xl font-exo font-medium transition-all duration-300 ${
                        theme === 'dark'
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
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        navigate('/academy/login');
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
                        navigate('/academy/signup');
                      }}
                      className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-exo font-medium transition-all duration-300 ${
                        theme === 'dark'
                          ? 'bg-gradient-to-r from-electric-green to-electric-blue text-dark-bg'
                          : 'bg-gradient-to-r from-accent-red to-accent-blue text-white'
                      }`}
                    >
                      Sign Up
                    </button>
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
            ? `${topBarHeight + 80}`
            : '80px',
        }}
      />
    </>
  );
};

export default AIToolsNav;
