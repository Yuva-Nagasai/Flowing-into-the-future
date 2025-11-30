import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sun, Moon, Globe, Cpu, LayoutGrid, ChevronDown, BookOpen, Briefcase, Award, Calendar } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import TopFeatureNav from '../TopFeatureNav';

const othersDropdownItems = [
  { name: 'Blog', path: '/elearning/blog', icon: BookOpen, description: 'Expert articles on n8n automation' },
  { name: 'Internship', path: '/elearning/internship', icon: Briefcase, description: 'Hands-on automation experience' },
  { name: 'Certificate', path: '/elearning/certificate', icon: Award, description: 'Industry-standard credentials' },
  { name: 'Events', path: '/elearning/events', icon: Calendar, description: 'Live workshops & bootcamps' },
];

const ELearningNav = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isOthersOpen, setIsOthersOpen] = useState(false);
  const [isMobileOthersOpen, setIsMobileOthersOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const othersRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (othersRef.current && !othersRef.current.contains(event.target as Node)) {
        setIsOthersOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const [showTopBar, setShowTopBar] = useState(true);

  const navLinks = [
    { name: 'Home', path: '/elearning' },
    { name: 'Courses', path: '/elearning/courses' },
    { name: 'Masterclass', path: '/elearning/masterclass' },
    { name: 'Mahakumbh', path: '/elearning/mahakumbh' },
    { name: 'Freebies', path: '/elearning/freebies' },
    { name: 'About', path: '/elearning/about' },
    { name: 'Contact', path: '/elearning/contact' },
  ];

  const handleNavClick = (path: string) => {
    if (path.startsWith('#')) {
      const element = document.getElementById(path.substring(1));
      element?.scrollIntoView({ behavior: 'smooth' });
    } else if (path.includes('#')) {
      const [route, hash] = path.split('#');
      navigate(route);
      setTimeout(() => {
        const element = document.getElementById(hash);
        element?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      navigate(path);
    }
    setIsMenuOpen(false);
    setIsOthersOpen(false);
    setIsMobileOthersOpen(false);
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
              <Link to="/elearning" className="flex items-center gap-4 group">
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
                    Academy
                  </h1>
                </div>
              </Link>

              <div className="hidden lg:flex items-center gap-6 flex-1 justify-center">
                <div className="flex items-center gap-6 lg:gap-8">
                  {navLinks.map((link) => (
                    <button
                      key={link.name}
                      onClick={() => handleNavClick(link.path)}
                      className={`font-exo font-medium transition-all duration-300 ${
                        theme === 'dark'
                          ? 'text-white hover:text-electric-green'
                          : 'text-black hover:text-accent-red'
                      }`}
                    >
                      {link.name}
                    </button>
                  ))}
                  
                  <div className="relative" ref={othersRef}>
                    <button
                      onClick={() => setIsOthersOpen(!isOthersOpen)}
                      className={`flex items-center gap-1 font-exo font-medium transition-all duration-300 ${
                        theme === 'dark'
                          ? 'text-white hover:text-electric-green'
                          : 'text-black hover:text-accent-red'
                      }`}
                    >
                      Others
                      <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOthersOpen ? 'rotate-180' : ''}`} />
                    </button>
                    
                    <AnimatePresence>
                      {isOthersOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                          className={`absolute top-full right-0 mt-2 w-64 rounded-xl border shadow-xl overflow-hidden ${
                            theme === 'dark'
                              ? 'bg-dark-card border-gray-800'
                              : 'bg-white border-gray-200'
                          }`}
                        >
                          {othersDropdownItems.map((item) => (
                            <button
                              key={item.name}
                              onClick={() => handleNavClick(item.path)}
                              className={`w-full flex items-start gap-3 p-4 transition-all duration-200 ${
                                theme === 'dark'
                                  ? 'hover:bg-dark-lighter'
                                  : 'hover:bg-gray-50'
                              }`}
                            >
                              <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${
                                theme === 'dark'
                                  ? 'bg-electric-blue/20 text-electric-blue'
                                  : 'bg-accent-blue/10 text-accent-blue'
                              }`}>
                                <item.icon className="w-5 h-5" />
                              </div>
                              <div className="text-left">
                                <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                  {item.name}
                                </p>
                                <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                  {item.description}
                                </p>
                              </div>
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
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

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className={`lg:hidden p-2 rounded-lg transition-all ${
                    theme === 'dark'
                      ? 'bg-dark-lighter text-white hover:bg-gray-700'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </motion.button>
              </div>
            </div>
          </nav>
        </div>

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
              <div className="container mx-auto px-4 py-4 space-y-3">
                {navLinks.map((link) => (
                  <button
                    key={link.name}
                    onClick={() => handleNavClick(link.path)}
                    className={`w-full text-left px-4 py-3 rounded-xl font-exo font-medium transition-all duration-300 ${
                      theme === 'dark'
                        ? 'text-white hover:bg-dark-lighter hover:text-electric-green'
                        : 'text-black hover:bg-gray-100 hover:text-accent-red'
                    }`}
                  >
                    {link.name}
                  </button>
                ))}

                <div className="border-t border-b py-3 my-3 ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'}">
                  <button
                    onClick={() => setIsMobileOthersOpen(!isMobileOthersOpen)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-exo font-medium transition-all duration-300 ${
                      theme === 'dark'
                        ? 'text-white hover:bg-dark-lighter'
                        : 'text-black hover:bg-gray-100'
                    }`}
                  >
                    Others
                    <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isMobileOthersOpen ? 'rotate-180' : ''}`} />
                  </button>
                  
                  <AnimatePresence>
                    {isMobileOthersOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="pl-4 space-y-1 mt-2"
                      >
                        {othersDropdownItems.map((item) => (
                          <button
                            key={item.name}
                            onClick={() => handleNavClick(item.path)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                              theme === 'dark'
                                ? 'text-gray-300 hover:bg-dark-lighter hover:text-electric-green'
                                : 'text-gray-700 hover:bg-gray-100 hover:text-accent-red'
                            }`}
                          >
                            <item.icon className="w-5 h-5" />
                            <span className="font-exo font-medium">{item.name}</span>
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    navigate('/academy/login');
                    setIsMenuOpen(false);
                  }}
                  className={`w-full px-4 py-3 rounded-xl font-exo font-medium transition-all duration-300 border-2 ${
                    theme === 'dark'
                      ? 'border-electric-blue text-electric-blue hover:bg-electric-blue/10'
                      : 'border-accent-blue text-accent-blue hover:bg-accent-blue/10'
                  }`}
                >
                  Login
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    navigate('/academy/signup');
                    setIsMenuOpen(false);
                  }}
                  className={`w-full px-4 py-3 rounded-xl font-exo font-medium transition-all duration-300 ${
                    theme === 'dark'
                      ? 'bg-gradient-to-r from-electric-green to-electric-blue text-dark-bg'
                      : 'bg-gradient-to-r from-accent-red to-accent-blue text-white'
                  }`}
                >
                  Sign Up
                </motion.button>
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

export default ELearningNav;
