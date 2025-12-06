import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useShopAuth } from '../../contexts/ShopAuthContext';
import { useTheme } from '../../context/ThemeContext';
import { getTheme } from '../../themes/theme';
import { Sparkles, ShoppingBag, Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';

const ShopRegister = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register, isAuthenticated } = useShopAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  
  const currentTheme = getTheme(theme);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/shop', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    const result = await register({ name, email, password });

    if (result.success) {
      navigate('/shop/login', { state: { signupSuccess: true } });
    } else {
      setError(result.error || 'Registration failed');
    }

    setLoading(false);
  };

  return (
    <div className={`relative flex h-screen items-center justify-center overflow-hidden ${currentTheme.classes.containerBg}`}>
      {/* Background Gradient Mesh */}
      <div className={`absolute inset-0 ${currentTheme.classes.mesh}`} />
      
      {/* Gradient Blurs */}
      <div className={`absolute right-0 top-0 h-[600px] w-[600px] rounded-full blur-3xl ${currentTheme.classes.blurPrimary}`} />
      <div className={`absolute bottom-0 left-0 h-[500px] w-[500px] rounded-full blur-3xl ${currentTheme.classes.blurSecondary}`} />

      {/* Theme Toggle Button - Fixed Position */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        onClick={toggleTheme}
        className={`fixed right-4 top-4 sm:right-6 sm:top-6 z-50 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl backdrop-blur-sm transition-all hover:scale-110 hover:shadow-lg ${currentTheme.classes.themeToggleBg} ${currentTheme.classes.themeToggleBorder} ${currentTheme.classes.themeToggleHover}`}
        title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      >
        {theme === 'dark' ? (
          <Sun className={`h-5 w-5 ${currentTheme.classes.themeToggleIcon}`} />
        ) : (
          <Moon className={`h-5 w-5 ${currentTheme.classes.themeToggleIcon}`} />
        )}
      </motion.button>

      {/* Signup Container - Centered */}
      <div className="relative z-10 mx-auto w-full max-w-sm px-4 sm:px-6 py-4 sm:py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={`rounded-2xl p-5 sm:p-6 shadow-2xl backdrop-blur-xl ${currentTheme.classes.cardBg} ${currentTheme.classes.border} ${currentTheme.classes.shadow}`}
        >
          {/* Logo & Header */}
          <div className="mb-5 text-center">
            <div className="mx-auto mb-2 h-10 w-20 overflow-hidden flex items-center justify-center rounded-lg">
              <motion.div
                className="w-full h-full"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ 
                  opacity: 1, 
                  scale: 1
                }}
                transition={{
                  opacity: { duration: 0.5 },
                  scale: { duration: 0.5 }
                }}
              >
                <img 
                  src="/NanoFlows-LOGO-removebg-preview.png" 
                  alt="Nano Flows Icon" 
                  className="w-full h-auto"
                  style={{ objectPosition: 'center top', transform: 'translateY(0px)' }}
                />
              </motion.div>
            </div>
            <div className={`mb-2 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${currentTheme.classes.badgeGradient}`}>
              <Sparkles className="h-3 w-3 animate-pulse" />
              NanoFlows Digital Hub
            </div>
            <h1 className={`mt-2 text-xl font-bold ${currentTheme.classes.headingPrimary}`} style={{ fontFamily: 'Orbitron, sans-serif' }}>
              Create Your Account
            </h1>
            <p className={`mt-1 text-xs ${currentTheme.classes.text}`}>
              Join NanoFlows Digital Hub to access digital products, exclusive deals, and start shopping
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mb-4 rounded-xl px-3 py-2 text-xs ${currentTheme.classes.errorBorder} ${currentTheme.classes.errorBg} ${currentTheme.classes.errorText}`}
              role="alert"
            >
              <div className="flex items-center gap-2 font-semibold">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            </motion.div>
          )}

          {/* Signup Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label htmlFor="name" className={`mb-2 block text-sm font-semibold ${currentTheme.classes.label}`}>
                Full Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`w-full rounded-xl px-3 py-2.5 text-sm shadow-sm transition-all focus:outline-none ${currentTheme.classes.input}`}
                placeholder="Alex Doe"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className={`mb-2 block text-sm font-semibold ${currentTheme.classes.label}`}>
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full rounded-xl px-3 py-2.5 text-sm shadow-sm transition-all focus:outline-none ${currentTheme.classes.input}`}
                placeholder="your@email.com"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className={`mb-2 block text-sm font-semibold ${currentTheme.classes.label}`}>
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full rounded-xl px-3 py-2.5 text-sm shadow-sm transition-all focus:outline-none ${currentTheme.classes.input}`}
                placeholder="Create a strong password"
                required
              />
            </div>

            <div>
              <label htmlFor="confirm-password" className={`mb-2 block text-sm font-semibold ${currentTheme.classes.label}`}>
                Confirm Password
              </label>
              <input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`w-full rounded-xl px-3 py-2.5 text-sm shadow-sm transition-all focus:outline-none ${currentTheme.classes.input}`}
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`group relative w-full overflow-hidden rounded-xl px-5 py-2.5 text-sm font-bold shadow-2xl transition-all focus:outline-none ${currentTheme.classes.primaryButton} ${currentTheme.classes.primaryButtonHover} ${currentTheme.classes.primaryButtonDisabled} ${currentTheme.classes.focusRing}`}
            >
              <span className="relative z-10 flex items-center justify-center gap-2 text-white">
                {loading ? (
                  <>
                    <svg className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Creating your account...
                  </>
                ) : (
                  <>
                    Create Account
                    <span className="transition-transform group-hover:translate-x-1">→</span>
                  </>
                )}
              </span>
              <div className={`absolute inset-0 -z-0 bg-gradient-to-r opacity-0 transition-opacity group-hover:opacity-100 ${currentTheme.classes.reverseGradient}`} />
            </button>
          </form>

          {/* Footer Links */}
          <div className="mt-4 space-y-2 text-center">
            <div className={`flex items-center justify-center gap-2 text-sm ${currentTheme.classes.text}`}>
              Already have an account?{' '}
              <Link
                to="/shop/login"
                className={`font-semibold transition ${currentTheme.classes.link}`}
              >
                Sign in
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Help Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className={`mt-3 text-center text-xs ${currentTheme.classes.text}`}
        >
          Need help?{' '}
          <a
            href="mailto:support@nanoflows.com"
            className={`font-semibold transition ${currentTheme.classes.link}`}
          >
            Contact support
          </a>
        </motion.div>
      </div>
    </div>
  );
};

export default ShopRegister;
