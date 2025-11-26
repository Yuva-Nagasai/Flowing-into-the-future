import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { GraduationCap, Menu, X, Sun, Moon, Globe, Cpu, LayoutGrid, ChevronDown, BookOpen, Briefcase, Award, Calendar } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const topNavItems = [
  { label: '1 Website', to: '/', icon: Globe },
  { label: '2 E-Learning', to: '/elearning', icon: GraduationCap, featured: true },
  { label: '3 AI Tools', to: '/ai-tools', icon: Cpu },
  { label: '4 Digital Hub', to: '/contact', icon: LayoutGrid },
];

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
      
      <nav className={`fixed top-[${topBarHeight}px] left-0 right-0 z-40 transition-all duration-300 ${
        theme === 'dark'
          ? 'bg-dark-card/95 border-b border-gray-800/50'
          : 'bg-white/95 border-b border-gray-200/50'
      } backdrop-blur-lg shadow-lg`} style={{ top: `${topBarHeight}px` }}>
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/elearning" className="flex items-center gap-3 group">
              <motion.div
                whileHover={{ scale: 1.05, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br shadow-lg transition-all duration-300 ${
                  theme === 'dark'
                    ? 'from-electric-blue to-electric-green shadow-electric-blue/30 group-hover:shadow-electric-blue/50'
                    : 'from-accent-red to-accent-blue shadow-accent-red/30 group-hover:shadow-accent-red/50'
                }`}
              >
                <GraduationCap className="h-5 w-5 text-white" />
              </motion.div>
              <div>
                <p className={`text-[10px] font-bold uppercase tracking-wider ${
                  theme === 'dark' ? 'text-electric-green' : 'text-accent-red'
                }`}>
                  NanoFlows
                </p>
                <h1 className={`text-base font-bold leading-tight ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  Academy
                </h1>
              </div>
            </Link>

            {/* Desktop Navigation */}
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
                
                {/* Others Dropdown */}
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

            {/* Actions */}
            <div className="flex items-center gap-2">
              {/* Theme Toggle */}
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

              {/* Login Button */}
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

              {/* Signup Button */}
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

              {/* Mobile Menu Button */}
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

              {/* Mobile Others Dropdown */}
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

              {/* Mobile Login Button */}
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

              {/* Mobile Signup Button */}
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
      </nav>
      
      <div className="h-[140px]" />
    </>
  );
};

export default ELearningNav;
