import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useWebsiteAuth } from '../contexts/WebsiteAuthContext';
import { useTheme } from '../context/ThemeContext';
import { getTheme } from '../themes/theme';
import { Sparkles, Brain, GraduationCap, Store, Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';
import SEO from '../components/SEO';

const WebsiteLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRobotVerified, setIsRobotVerified] = useState(false);
  const { login } = useWebsiteAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  const currentTheme = getTheme(theme);

  useEffect(() => {
    // Show message when redirected from Signup with { state: { signupSuccess: true } }
    if (location?.state?.signupSuccess) {
      setSuccess('Account created successfully! Please sign in.');
      setError('');
      // optionally clear state so it won't show again on refresh/navigation
      // Note: you can omit this if you prefer
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Clear previous messages
    setError('');
    setSuccess('');

    // Validation order: robot -> email -> password
    if (!isRobotVerified) {
      setError("Please verify you're not a robot.");
      emailRef.current?.focus();
      return;
    }

    if (!email.trim()) {
      setError('Please enter your email address.');
      emailRef.current?.focus();
      return;
    }

    if (!password.trim()) {
      setError('Please enter your password.');
      passwordRef.current?.focus();
      return;
    }

    setLoading(true);

    try {
      const result = await login(email, password);

      if (result && result.success) {
        // Show success message then redirect
        setSuccess('Login successful! Redirecting...');
        setError('');

        setTimeout(() => {
          const fromPath = location?.state?.from?.pathname;
          if (result.user?.role === 'admin') {
            navigate('/academy/admin');
          } else if (fromPath) {
            navigate(fromPath, { replace: true });
          } else {
            // If coming from the main website (no fromPath), stay on the site home
            navigate('/', { replace: true });
          }
        }, 1200);

        return;
      }

      // --- Better error messages for common auth failures ---
      const serverErr = (result && (result.error || '')).toString();

      let friendlyMsg = '';
      if (result && result.code) {
        const code = String(result.code).toUpperCase();
        if (code === 'USER_NOT_FOUND' || code === 'NO_USER' || code === 'ACCOUNT_NOT_FOUND') {
          friendlyMsg = 'No account found for this email. Please sign up first.';
        } else if (code === 'INVALID_PASSWORD' || code === 'WRONG_PASSWORD' || code === 'INVALID_CREDENTIALS') {
          friendlyMsg = "Incorrect password. If you don't have an account, please sign up.";
        } else {
          friendlyMsg = serverErr || 'Sign in failed. Please check your credentials and try again.';
        }
      } else {
        if (/not found|no user|user does not exist|account not found/i.test(serverErr)) {
          friendlyMsg = 'No account found for this email. Please sign up first.';
        } else if (/invalid credentials|incorrect password|wrong password|invalid password/i.test(serverErr)) {
          friendlyMsg = "Invalid email or password. If you don't have an account, please sign up.";
        } else if (serverErr) {
          friendlyMsg = serverErr;
        } else {
          friendlyMsg = 'Sign in failed. Please check your credentials and try again.';
        }
      }

      setError(friendlyMsg);
    } catch (e) {
      setError('An unexpected error occurred while signing in. Please try again.');
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO
        title="Sign In | NanoFlows"
        description="Sign in to your NanoFlows account to access Academy courses, AI Tools platform, and digital products."
        keywords="login, sign in, account, authentication, NanoFlows login"
      />
      <div className={`relative flex h-screen overflow-hidden ${currentTheme.classes.containerBg}`}>
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

      {/* Two-Column Layout */}
      <div className="relative z-10 w-full grid grid-cols-1 lg:grid-cols-2">
        {/* Left Column - Branding */}
        <div className="hidden lg:flex flex-col justify-center items-start p-12 xl:p-16">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-lg"
          >
            <div className={`mb-4 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold uppercase tracking-wider ${currentTheme.classes.badgeGradient}`}>
              <Sparkles className="h-4 w-4 animate-pulse" />
              NanoFlows Hub
            </div>

            <h1 className={`text-4xl xl:text-5xl font-bold mb-6 leading-tight ${currentTheme.classes.headingPrimary}`} style={{ fontFamily: 'Orbitron, sans-serif' }}>
              One sign-in for Academy, AI Tools, and Digital Hub
            </h1>

            <p className={`text-lg mb-8 leading-relaxed ${currentTheme.classes.text}`}>
              Use your NanoFlows account to jump into courses, try AI tools, or shop digital products — all from a single login.
            </p>

            {/* Features List */}
            <div className="space-y-4">
              {[
                { icon: GraduationCap, text: 'Learn in the Academy with guided courses and certificates' },
                { icon: Brain, text: 'Experiment with AI tools tailored to real workflows' },
                { icon: Store, text: 'Purchase and manage digital products securely in the Digital Hub' }
              ].map((feature, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + idx * 0.1, duration: 0.5 }}
                  className="flex items-center gap-3"
                >
                  <div className={`p-2 rounded-lg ${
                    theme === 'dark'
                      ? 'bg-electric-green/20 text-electric-green'
                      : 'bg-accent-red/20 text-accent-red'
                  }`}>
                    <feature.icon className="h-5 w-5" />
                  </div>
                  <span className={`text-sm font-semibold ${currentTheme.classes.headingPrimary}`}>
                    {feature.text}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right Column - Login Form */}
        <div className="flex items-center justify-center p-4 sm:p-8 lg:p-12">
          <div className="w-full max-w-md">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className={`rounded-2xl p-5 sm:p-6 shadow-2xl backdrop-blur-xl ${currentTheme.classes.cardBg} ${currentTheme.classes.border} ${currentTheme.classes.shadow}`}
            >
          {/* Logo & Header */}
          <div className="mb-6 text-center">
            <div className="mx-auto mb-3 h-10 w-20 overflow-hidden flex items-center justify-center rounded-lg">
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
              NanoFlows Hub
            </div>
            <h1 className={`mt-3 text-2xl font-bold ${currentTheme.classes.headingPrimary}`} style={{ fontFamily: 'Orbitron, sans-serif' }}>
              Sign in to continue
            </h1>
            <p className={`mt-1 text-xs ${currentTheme.classes.text}`}>
              One account for everything: jump into Academy courses, explore AI Tools, or shop digital products in the Digital Hub with the same login.
            </p>
          </div>

          {/* Success Message */}
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 rounded-xl px-4 py-3 text-sm bg-green-100 border border-green-300 text-green-900"
              role="status"
            >
              <div className="flex items-center gap-2 font-semibold">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M16.707 5.293a1 1 0 00-1.414 0L9 11.586 6.707 9.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l7-7a1 1 0 000-1.414z" />
                </svg>
                {success}
              </div>
            </motion.div>
          )}

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mb-6 rounded-xl px-4 py-3 text-sm ${currentTheme.classes.errorBorder} ${currentTheme.classes.errorBg} ${currentTheme.classes.errorText}`}
              role="alert"
            >
              <div className="flex items-center gap-2 font-semibold">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            </motion.div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div>
              <label htmlFor="email" className={`mb-2 block text-sm font-semibold ${currentTheme.classes.label}`}>
                Email Address
              </label>
              <input
                id="email"
                ref={emailRef}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full rounded-xl px-3 py-2.5 text-sm shadow-sm transition-all focus:outline-none ${currentTheme.classes.input}`}
                placeholder="your@email.com"
                required
              />
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <label htmlFor="password" className={`block text-sm font-semibold ${currentTheme.classes.label}`}>
                  Password
                </label>
                <a
                  href="mailto:support@nanoflows.com?subject=Password%20Reset"
                  className={`text-xs font-semibold transition ${currentTheme.classes.link}`}
                >
                  Forgot password?
                </a>
              </div>
              <input
                id="password"
                ref={passwordRef}
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full rounded-xl px-3 py-2.5 text-sm shadow-sm transition-all focus:outline-none ${currentTheme.classes.input}`}
                placeholder="••••••••"
                required
              />
            </div>

            {/* I am not a robot checkbox */}
            <div className={`flex items-center gap-2 p-3 rounded-xl border-2 transition-all ${
              theme === 'dark'
                ? isRobotVerified
                  ? 'border-electric-green bg-electric-green/10 shadow-lg shadow-electric-green/20'
                  : 'border-gray-700 bg-dark-lighter'
                : isRobotVerified
                  ? 'border-accent-red bg-accent-red/10 shadow-lg shadow-accent-red/20'
                  : 'border-gray-300 bg-gray-50'
            }`}>
              <div className="relative flex items-center">
                <input
                  type="checkbox"
                  id="robotCheck"
                  checked={isRobotVerified}
                  onChange={(e) => setIsRobotVerified(e.target.checked)}
                  className={`w-5 h-5 rounded border-2 cursor-pointer transition-all ${
                    theme === 'dark'
                      ? isRobotVerified
                        ? 'border-electric-green bg-electric-green'
                        : 'border-gray-600 bg-transparent hover:border-gray-500'
                      : isRobotVerified
                        ? 'border-accent-red bg-accent-red'
                        : 'border-gray-400 bg-white hover:border-gray-500'
                  }`}
                />
                {isRobotVerified && (
                  <motion.svg
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute left-0.5 top-0.5 w-4 h-4 text-white pointer-events-none"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </motion.svg>
                )}
              </div>
              <label
                htmlFor="robotCheck"
                className={`text-sm font-semibold cursor-pointer flex items-center gap-2 flex-1 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}
              >
                <span>I am not a robot</span>
                {isRobotVerified && (
                  <motion.span
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                      theme === 'dark'
                        ? 'bg-electric-green/20 text-electric-green border border-electric-green/30'
                        : 'bg-accent-red/20 text-accent-red border border-accent-red/30'
                    }`}
                  >
                    ✓ Verified
                  </motion.span>
                )}
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              aria-disabled={loading}
              title={loading ? 'Signing in...' : 'Sign in'}
              className={`group relative w-full overflow-hidden rounded-xl px-5 py-2.5 text-sm font-bold shadow-2xl transition-all focus:outline-none ${currentTheme.classes.primaryButton} ${currentTheme.classes.primaryButtonHover} ${currentTheme.classes.primaryButtonDisabled} ${currentTheme.classes.focusRing} ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <span className="relative z-10 flex items-center justify-center gap-2 text-white">
                {loading ? (
                  <>
                    <svg className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Signing you in...
                  </>
                ) : (
                  <>
                    Sign In
                    <span className="transition-transform group-hover:translate-x-1">→</span>
                  </>
                )}
              </span>
              <div className={`absolute inset-0 -z-0 bg-gradient-to-r opacity-0 transition-opacity group-hover:opacity-100 ${currentTheme.classes.reverseGradient}`} />
            </button>
          </form>

          {/* Footer Links */}
          <div className="mt-6 space-y-2 text-center">
            <div className={`flex items-center justify-center gap-2 text-sm ${currentTheme.classes.text}`}>
              Don't have an account?{' '}
              <Link
                to="/signup"
                className={`font-semibold transition ${currentTheme.classes.link}`}
              >
                Sign up
              </Link>
            </div>
            <Link
              to="/"
              className={`inline-flex items-center gap-2 text-sm font-semibold transition ${currentTheme.classes.link}`}
            >
              <span>←</span> Back to Main Website
            </Link>
          </div>
        </motion.div>

        {/* Help Section */}
        <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className={`mt-4 text-center text-xs ${currentTheme.classes.text}`}
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
      </div>
      </div>
    </>
  );
};

export default WebsiteLogin;
