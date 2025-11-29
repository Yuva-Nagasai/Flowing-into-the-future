import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import {
  Menu,
  X,
  Sun,
  Moon,
  Search,
  User
} from 'lucide-react';
import TopFeatureNav from '../TopFeatureNav';

interface AIToolsNavProps {
  onSearch?: (term: string) => void;
  searchTerm?: string;
}

const AIToolsNav = ({ onSearch, searchTerm = '' }: AIToolsNavProps) => {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);

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

  const isActive = (path: string) => location.pathname === path;

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
            <Link to="/ai-tools" className="flex items-center gap-2">
              <img
                src="/NanoFlows-LOGO-removebg-preview.png"
                alt="NanoFlows logo"
                className="h-10 w-10 object-contain"
              />
              <span className={`text-xl font-bold ${
                theme === 'dark' ? 'text-electric-green' : 'text-accent-red'
              }`}>
                AI Tools
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-6">
              {navItems.map(link => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`font-medium transition-colors ${
                    isActive(link.path)
                      ? theme === 'dark' ? 'text-electric-green' : 'text-accent-red'
                      : theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-4">
              <div className={`hidden md:flex items-center px-3 py-1.5 rounded-lg border ${
                theme === 'dark'
                  ? 'bg-slate-800 border-slate-700'
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
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={`md:hidden p-2 rounded-lg transition-colors ${
                  theme === 'dark' 
                    ? 'hover:bg-slate-800 text-gray-300' 
                    : 'hover:bg-gray-100 text-gray-600'
                }`}
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {mobileMenuOpen && (
            <div className={`md:hidden py-4 border-t ${
              theme === 'dark' ? 'border-slate-700' : 'border-gray-200'
            }`}>
              <div className={`flex items-center px-3 py-2 rounded-lg border mb-4 ${
                theme === 'dark'
                  ? 'bg-slate-800 border-slate-700'
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

              {navItems.map(link => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block py-3 font-medium ${
                    isActive(link.path)
                      ? theme === 'dark' ? 'text-electric-green' : 'text-accent-red'
                      : theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              
              <div className={`mt-4 pt-4 border-t space-y-2 ${
                theme === 'dark' ? 'border-slate-700' : 'border-gray-200'
              }`}>
                <button
                  onClick={() => { navigate('/academy/login'); setMobileMenuOpen(false); }}
                  className={`w-full py-3 rounded-lg font-medium border ${
                    theme === 'dark'
                      ? 'border-slate-600 text-gray-300'
                      : 'border-gray-300 text-gray-700'
                  }`}
                >
                  Login
                </button>
                <button
                  onClick={() => { navigate('/academy/signup'); setMobileMenuOpen(false); }}
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

export default AIToolsNav;
