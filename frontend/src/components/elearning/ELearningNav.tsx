import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sun, Moon, ChevronDown, BookOpen, Briefcase, Award, Calendar, User } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import TopFeatureNav from '../TopFeatureNav';

const othersDropdownItems = [
  { name: 'Blog', path: '/elearning/blog', icon: BookOpen, description: 'Expert articles on n8n automation' },
  { name: 'Internship', path: '/elearning/internship', icon: Briefcase, description: 'Hands-on automation experience' },
  { name: 'Certificate', path: '/elearning/certificate', icon: Award, description: 'Industry-standard credentials' },
  { name: 'Events', path: '/elearning/events', icon: Calendar, description: 'Live workshops & bootcamps' },
];

interface ELearningNavProps {
  onSearch?: (term: string) => void;
  searchTerm?: string;
}

const ELearningNav = ({ onSearch, searchTerm = '' }: ELearningNavProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isOthersOpen, setIsOthersOpen] = useState(false);
  const [isMobileOthersOpen, setIsMobileOthersOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
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

  const isActive = (path: string) => location.pathname === path;

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

  return (
    <>
      <TopFeatureNav />
      <nav className={`sticky top-0 z-40 ${
        theme === 'dark' 
          ? 'bg-slate-900/95 border-slate-700' 
          : 'bg-white/95 border-gray-200'
      } backdrop-blur-md border-b shadow-sm`}>
        <div className="container mx-auto px-4 lg:px-6">
          <div className="flex items-center justify-between h-16">
            <Link to="/elearning" className="flex items-center gap-2">
              <img
                src="/NanoFlows-LOGO-removebg-preview.png"
                alt="NanoFlows logo"
                className="h-10 w-10 object-contain"
              />
              <span className={`text-xl font-bold ${
                theme === 'dark' ? 'text-electric-green' : 'text-accent-red'
              }`}>
                Academy
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-6">
              {navLinks.map(link => (
                <button
                  key={link.path}
                  onClick={() => handleNavClick(link.path)}
                  className={`font-medium transition-colors ${
                    isActive(link.path)
                      ? theme === 'dark' ? 'text-electric-green' : 'text-accent-red'
                      : theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {link.name}
                </button>
              ))}
              
              <div className="relative" ref={othersRef}>
                <button
                  onClick={() => setIsOthersOpen(!isOthersOpen)}
                  className={`flex items-center gap-1 font-medium transition-colors ${
                    theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
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
                          ? 'bg-slate-800 border-slate-700'
                          : 'bg-white border-gray-200'
                      }`}
                    >
                      {othersDropdownItems.map((item) => (
                        <button
                          key={item.name}
                          onClick={() => handleNavClick(item.path)}
                          className={`w-full flex items-start gap-3 p-4 transition-all duration-200 ${
                            theme === 'dark'
                              ? 'hover:bg-slate-700'
                              : 'hover:bg-gray-50'
                          }`}
                        >
                          <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${
                            theme === 'dark'
                              ? 'bg-electric-green/20 text-electric-green'
                              : 'bg-accent-red/10 text-accent-red'
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

            <div className="flex items-center gap-4">
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-lg transition-colors ${
                  theme === 'dark' 
                    ? 'hover:bg-slate-800 text-gray-300' 
                    : 'hover:bg-gray-100 text-gray-600'
                }`}
              >
                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>

              <button
                onClick={() => navigate('/academy/login')}
                className={`hidden md:flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors border ${
                  theme === 'dark'
                    ? 'border-slate-600 text-gray-300 hover:bg-slate-800'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                }`}
              >
                Login
              </button>

              <button
                onClick={() => navigate('/academy/signup')}
                className={`hidden md:flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  theme === 'dark'
                    ? 'bg-electric-green text-slate-900 hover:bg-electric-green/90'
                    : 'bg-accent-red text-white hover:bg-accent-red/90'
                }`}
              >
                <User className="w-4 h-4" />
                Sign Up
              </button>

              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`md:hidden p-2 rounded-lg transition-colors ${
                  theme === 'dark' 
                    ? 'hover:bg-slate-800 text-gray-300' 
                    : 'hover:bg-gray-100 text-gray-600'
                }`}
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {isMenuOpen && (
            <div className={`md:hidden py-4 border-t ${
              theme === 'dark' ? 'border-slate-700' : 'border-gray-200'
            }`}>
              {navLinks.map(link => (
                <button
                  key={link.path}
                  onClick={() => handleNavClick(link.path)}
                  className={`block w-full text-left py-3 font-medium ${
                    isActive(link.path)
                      ? theme === 'dark' ? 'text-electric-green' : 'text-accent-red'
                      : theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                  }`}
                >
                  {link.name}
                </button>
              ))}
              
              <div className={`mt-2 pt-2 border-t ${theme === 'dark' ? 'border-slate-700' : 'border-gray-200'}`}>
                <button
                  onClick={() => setIsMobileOthersOpen(!isMobileOthersOpen)}
                  className={`flex items-center justify-between w-full py-3 font-medium ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                  }`}
                >
                  Others
                  <ChevronDown className={`w-4 h-4 transition-transform ${isMobileOthersOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {isMobileOthersOpen && (
                  <div className="pl-4 space-y-2">
                    {othersDropdownItems.map((item) => (
                      <button
                        key={item.name}
                        onClick={() => handleNavClick(item.path)}
                        className={`block w-full text-left py-2 ${
                          theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'
                        }`}
                      >
                        {item.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              
              <div className={`mt-4 pt-4 border-t space-y-2 ${
                theme === 'dark' ? 'border-slate-700' : 'border-gray-200'
              }`}>
                <button
                  onClick={() => { navigate('/academy/login'); setIsMenuOpen(false); }}
                  className={`w-full py-3 rounded-lg font-medium border ${
                    theme === 'dark'
                      ? 'border-slate-600 text-gray-300'
                      : 'border-gray-300 text-gray-700'
                  }`}
                >
                  Login
                </button>
                <button
                  onClick={() => { navigate('/academy/signup'); setIsMenuOpen(false); }}
                  className={`w-full py-3 rounded-lg font-medium ${
                    theme === 'dark'
                      ? 'bg-electric-green text-slate-900'
                      : 'bg-accent-red text-white'
                  }`}
                >
                  Sign Up
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>
    </>
  );
};

export default ELearningNav;
