import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { GraduationCap, Menu, X, Sun, Moon, Home, BookOpen, Award, Users, Mail } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const ELearningNav = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const navLinks = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Courses', path: '#courses', icon: BookOpen },
    { name: 'About', path: '#about', icon: Award },
    { name: 'Instructors', path: '#instructors', icon: Users },
    { name: 'Contact', path: '#contact', icon: Mail },
  ];

  const handleNavClick = (path: string) => {
    if (path.startsWith('#')) {
      const element = document.getElementById(path.substring(1));
      element?.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate(path);
    }
    setIsMenuOpen(false);
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      theme === 'dark'
        ? 'bg-dark-card/95 border-b border-gray-800/50'
        : 'bg-white/95 border-b border-gray-200/50'
    } backdrop-blur-lg shadow-lg`}>
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/elearning" className="flex items-center gap-3 group">
            <motion.div
              whileHover={{ scale: 1.05, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br shadow-lg transition-all duration-300 ${
                theme === 'dark'
                  ? 'from-electric-blue to-electric-green shadow-electric-blue/30 group-hover:shadow-electric-blue/50'
                  : 'from-accent-red to-accent-blue shadow-accent-red/30 group-hover:shadow-accent-red/50'
              }`}
            >
              <GraduationCap className="h-6 w-6 text-white" />
            </motion.div>
            <div>
              <p className={`text-xs font-bold uppercase tracking-wider ${
                theme === 'dark' ? 'text-electric-green' : 'text-accent-red'
              }`}>
                NanoFlows
              </p>
              <h1 className={`text-lg font-bold leading-tight ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Academy
              </h1>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => handleNavClick(link.path)}
                className={`flex items-center gap-2 font-medium transition-all duration-200 ${
                  theme === 'dark'
                    ? 'text-gray-300 hover:text-electric-green'
                    : 'text-gray-700 hover:text-accent-red'
                }`}
              >
                <link.icon className="w-4 h-4" />
                {link.name}
              </button>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleTheme}
              className={`p-3 rounded-xl transition-all ${
                theme === 'dark'
                  ? 'bg-dark-lighter text-yellow-400 hover:bg-gray-700'
                  : 'bg-gray-100 text-blue-600 hover:bg-gray-200'
              }`}
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </motion.button>

            {/* Login Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/academy/login')}
              className={`hidden lg:block px-6 py-2.5 rounded-xl font-semibold transition-all ${
                theme === 'dark'
                  ? 'bg-gradient-to-r from-electric-green to-electric-blue text-dark-bg hover:shadow-lg hover:shadow-electric-green/30'
                  : 'bg-gradient-to-r from-accent-red to-accent-blue text-white hover:shadow-lg hover:shadow-accent-red/30'
              }`}
            >
              Login
            </motion.button>

            {/* Mobile Menu Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`lg:hidden p-3 rounded-xl transition-all ${
                theme === 'dark'
                  ? 'bg-dark-lighter text-white hover:bg-gray-700'
                  : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
              }`}
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className={`lg:hidden border-t ${
              theme === 'dark' ? 'border-gray-800 bg-dark-card' : 'border-gray-200 bg-white'
            }`}
          >
            <div className="container mx-auto px-4 py-4 space-y-2">
              {navLinks.map((link) => (
                <button
                  key={link.name}
                  onClick={() => handleNavClick(link.path)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                    theme === 'dark'
                      ? 'text-gray-300 hover:bg-dark-lighter hover:text-electric-green'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-accent-red'
                  }`}
                >
                  <link.icon className="w-5 h-5" />
                  {link.name}
                </button>
              ))}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  navigate('/academy/login');
                  setIsMenuOpen(false);
                }}
                className={`w-full px-4 py-3 rounded-xl font-semibold transition-all ${
                  theme === 'dark'
                    ? 'bg-gradient-to-r from-electric-green to-electric-blue text-dark-bg'
                    : 'bg-gradient-to-r from-accent-red to-accent-blue text-white'
                }`}
              >
                Login
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default ELearningNav;
