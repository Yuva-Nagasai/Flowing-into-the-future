import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { getTheme } from '../..//themes/theme';
import { GraduationCap, Brain, LogOut, Sun, Moon, Sparkles, TrendingUp, Users, Award, Cpu, Zap, Target, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const PlatformSelection = () => {
  const { user, logout, loading } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const currentTheme = getTheme(theme);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/academy/dashboard');
  };

  // Disable scrolling on mount
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const platforms = [
    {
      id: 'academy',
      title: 'NanoFlows Academy',
      description: 'Access your personalized learning dashboard, explore courses, and track your progress',
      icon: GraduationCap,
      gradient: theme === 'dark' ? 'from-electric-blue to-electric-green' : 'from-accent-red to-accent-blue',
      link: user?.role === 'admin' ? '/academy/admin' : '/academy/dashboard',
      features: [
        { icon: TrendingUp, text: 'Track Learning Progress' },
        { icon: Award, text: 'Earn Certificates' },
        { icon: Users, text: 'Collaborative Learning' }
      ],
      accentColor: theme === 'dark' ? 'text-electric-blue' : 'text-accent-red',
      borderColor: theme === 'dark' ? 'border-electric-blue/30' : 'border-accent-red/30',
      hoverColor: theme === 'dark' ? 'hover:border-electric-blue' : 'hover:border-accent-red',
      shadowColor: theme === 'dark' ? 'hover:shadow-electric-blue/30' : 'hover:shadow-accent-red/30'
    },
    {
      id: 'ai-tools',
      title: 'NanoFlows AI Tools',
      description: 'Explore cutting-edge AI tools and technologies to supercharge your productivity',
      icon: Brain,
      gradient: theme === 'dark' ? 'from-electric-blue to-electric-green' : 'from-accent-red to-accent-blue',
      link: '/ai-tools',
      features: [
        { icon: Cpu, text: 'Advanced AI Models' },
        { icon: Zap, text: 'Real-time Processing' },
        { icon: Target, text: 'Smart Automation' }
      ],
      accentColor: theme === 'dark' ? 'text-electric-blue' : 'text-accent-red',
      borderColor: theme === 'dark' ? 'border-electric-blue/30' : 'border-accent-red/30',
      hoverColor: theme === 'dark' ? 'hover:border-electric-blue' : 'hover:border-accent-red',
      shadowColor: theme === 'dark' ? 'hover:shadow-electric-blue/30' : 'hover:shadow-accent-red/30'
    }
  ];

  // helper to navigate from card or CTA
  const goTo = (link) => {
    if (!link) return;
    navigate(link);
  };

  return (
    <div className={`relative h-screen overflow-hidden ${theme === 'dark' ? 'bg-dark-bg' : 'bg-gray-50'} transition-colors duration-300`}>
      {/* Background Gradient Mesh */}
      <div className={`absolute inset-0 ${theme === 'dark' ? 'bg-gradient-to-b from-dark-bg via-dark-card to-dark-bg' : 'bg-gradient-to-b from-white via-gray-50 to-white'}`} />
      <div className="absolute inset-0 opacity-30">
        <div className={`absolute inset-0 ${theme === 'dark' ? 'gradient-mesh' : 'gradient-mesh-light'}`} />
      </div>
      
      {/* Gradient Blurs */}
      <div className={`absolute right-0 top-0 h-[800px] w-[800px] rounded-full blur-3xl ${theme === 'dark' ? 'bg-electric-blue/10' : 'bg-accent-red/10'}`} />
      <div className={`absolute bottom-0 left-0 h-[700px] w-[700px] rounded-full blur-3xl ${theme === 'dark' ? 'bg-electric-green/10' : 'bg-accent-blue/10'}`} />

      {/* Header */}
      <header className={`relative z-10 border-b backdrop-blur-xl ${theme === 'dark' ? 'border-gray-800 bg-dark-card' : 'border-gray-200 bg-white'}`}>
        <div className="mx-auto max-w-7xl px-3 sm:px-4 py-3 sm:py-4 lg:px-8">
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Back Button - Total Left */}
            <motion.button
              onClick={() => navigate('/academy/login')}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              whileHover={{ 
                scale: 1.1, 
                x: -8,
                transition: { duration: 0.2, ease: "easeOut" }
              }}
              whileTap={{ 
                scale: 0.95,
                x: -12,
                transition: { duration: 0.1 }
              }}
              className={`flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl transition-all relative overflow-hidden group ${
                theme === 'dark'
                  ? 'bg-dark-lighter hover:bg-gray-700 text-gray-200 hover:text-electric-green'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-800 hover:text-accent-red'
              }`}
              title="Back to Sign In"
              aria-label="Back to Sign In"
            >
              <motion.div
                animate={{
                  x: [0, -3, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="flex items-center justify-center"
              >
                <ArrowLeft className="h-5 w-5" />
              </motion.div>
              <motion.div
                className={`absolute inset-0 rounded-xl ${theme === 'dark' ? 'bg-electric-green/20' : 'bg-accent-red/20'}`}
                initial={{ scale: 0, opacity: 0 }}
                whileHover={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
            </motion.button>
            
            <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
              <div className={`flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-gradient-to-br shadow-lg flex-shrink-0 ${
                theme === 'dark'
                  ? 'from-electric-blue to-electric-green shadow-electric-blue/40'
                  : 'from-accent-red to-accent-blue shadow-accent-red/40'
              }`}>
                <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <p className={`text-[10px] sm:text-xs font-bold uppercase tracking-[0.25em] truncate ${theme === 'dark' ? 'text-electric-green' : 'text-accent-red'}`}>
                  NanoFlows Platform
                </p>
                <h1 className={`text-sm sm:text-xl font-bold truncate ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: 'Orbitron, sans-serif' }}>
                  Welcome, {loading ? '...' : (user?.name || 'User')}
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
              {/* Theme Toggle */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleTheme}
                className={`flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl transition-all ${
                  theme === 'dark'
                    ? 'bg-dark-lighter hover:bg-gray-700 text-electric-blue'
                    : 'bg-gray-100 hover:bg-gray-200 text-accent-blue'
                }`}
                title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {theme === 'dark' ? (
                  <Sun className="h-4 w-4 sm:h-5 sm:w-5" />
                ) : (
                  <Moon className="h-4 w-4 sm:h-5 sm:w-5" />
                )}
              </motion.button>

              {/* Logout Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-200 ${
                  theme === 'dark'
                    ? 'bg-red-600/30 text-red-300 border border-red-500/50 hover:bg-red-600/40 hover:border-red-400 hover:text-red-200'
                    : 'bg-red-100 text-red-700 border border-red-300 hover:bg-red-200 hover:border-red-400 hover:text-red-800'
                }`}
                aria-label="Log out"
              >
                <LogOut size={14} className="sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Logout</span>
              </motion.button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 mx-auto max-w-7xl px-3 sm:px-4 py-8 sm:py-12 lg:px-8 h-full overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8 sm:mb-12"
        >
          <h2 className={`text-2xl sm:text-3xl lg:text-4xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-3 sm:mb-4 px-2`} style={{ fontFamily: 'Orbitron, sans-serif' }}>
            Choose Your Platform
          </h2>
          <p className={`text-sm sm:text-base lg:text-lg ${theme === 'dark' ? 'text-gray-300' : 'text-gray-800'} max-w-2xl mx-auto px-4`}>
            Select the platform you want to access. You can switch between them anytime.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2 lg:gap-12 px-2 sm:px-0">
          {platforms.map((platform, index) => (
            <motion.div
              key={platform.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              {/* Make whole card clickable and keyboard accessible */}
              <div
                role="button"
                tabIndex={0}
                onClick={() => goTo(platform.link)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    goTo(platform.link);
                  }
                }}
                className={`group relative block h-full overflow-hidden rounded-xl border-2 p-4 sm:p-6 transition-all duration-300 hover:scale-[1.02] cursor-pointer ${
                  theme === 'dark'
                    ? `bg-dark-lighter border-gray-700 hover:border-electric-blue hover:shadow-[0_0_30px_rgba(10,186,181,0.3)]`
                    : `bg-white border-gray-200 hover:border-accent-red hover:shadow-xl`
                }`}
              >
                {/* Gradient Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${platform.gradient} opacity-0 transition-opacity duration-300 group-hover:opacity-5`} />

                {/* Content */}
                <div className="relative z-10">
                  {/* Icon */}
                  <div className={`mb-6 inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br ${platform.gradient} shadow-lg transition-transform duration-300 group-hover:scale-110`}>
                    <platform.icon className="h-10 w-10 text-white" />
                  </div>

                  {/* Title */}
                  <h3 className={`mb-3 text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: 'Orbitron, sans-serif' }}>
                    {platform.title}
                  </h3>

                  {/* Description */}
                  <p className={`mb-6 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-900'}`}>
                    {platform.description}
                  </p>

                  {/* Features */}
                  <div className="space-y-2 mb-4">
                    {platform.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <div className={`w-1.5 h-1.5 rounded-full ${theme === 'dark' ? 'bg-electric-blue' : 'bg-accent-blue'}`} />
                        <span className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-800'}`}>
                          {feature.text}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* CTA Button (uses navigate, not nested Link) */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation(); // stop outer handler briefly while we navigate — prevents double calls
                      goTo(platform.link);
                    }}
                    className={`w-full py-2.5 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all group/button ${
                      theme === 'dark'
                        ? 'bg-electric-green text-black hover:bg-electric-blue'
                        : 'bg-accent-red text-white hover:bg-accent-blue'
                    }`}
                    aria-label={`Access ${platform.title}`}
                  >
                    <span>Access Platform</span>
                    <span className="transition-transform group-hover/button:translate-x-1">→</span>
                  </button>

                  {/* Role Badge */}
                  {platform.id === 'academy' && user?.role === 'admin' && (
                    <div className="absolute right-6 top-6">
                      <span className="rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-3 py-1 text-xs font-bold text-white shadow-lg">
                        Admin
                      </span>
                    </div>
                  )}
                </div>

                {/* Decorative Elements */}
                <div className={`absolute -right-10 -top-10 h-40 w-40 rounded-full bg-gradient-to-br ${platform.gradient} opacity-10 blur-3xl transition-opacity duration-300 group-hover:opacity-20`} />
                <div className={`absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-gradient-to-br ${platform.gradient} opacity-10 blur-3xl transition-opacity duration-300 group-hover:opacity-20`} />
              </div>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default PlatformSelection;
