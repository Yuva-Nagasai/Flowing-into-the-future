import { useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { KeyRound, Lock, Eye, EyeOff, Loader2, Check, AlertCircle, ArrowLeft } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import ShopNav from '../../components/shop/ShopNav';
import Footer from '../../components/Footer';
import SEOHead from '../../components/shop/SEOHead';
import shopApi from '../../utils/shopApi';

export default function ShopResetPassword() {
  const { theme } = useTheme();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token') || '';
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const passwordRequirements = [
    { label: 'At least 8 characters', met: password.length >= 8 },
    { label: 'Contains a number', met: /\d/.test(password) },
    { label: 'Contains uppercase', met: /[A-Z]/.test(password) },
    { label: 'Passwords match', met: password === confirmPassword && password.length > 0 },
  ];

  const allRequirementsMet = passwordRequirements.every((r) => r.met);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!allRequirementsMet) {
      setError('Please meet all password requirements');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await shopApi.resetPassword(token, password);
      if (res.success) {
        setSuccess(true);
        setTimeout(() => navigate('/shop/login'), 3000);
      } else {
        setError(res.error || 'Failed to reset password');
      }
    } catch {
      setError('Failed to reset password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className={`min-h-screen ${theme === 'dark' ? 'bg-slate-950' : 'bg-gray-50'}`}>
        <SEOHead title="Reset Password" description="Reset your NanoFlows Digital Hub password" />
        <ShopNav />

        <section className="py-16">
          <div className="container mx-auto px-4 lg:px-6">
            <div className="max-w-md mx-auto text-center">
              <AlertCircle className={`w-16 h-16 mx-auto mb-4 ${
                theme === 'dark' ? 'text-red-400' : 'text-red-500'
              }`} />
              <h1 className={`text-2xl font-bold mb-2 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Invalid Reset Link
              </h1>
              <p className={`mb-6 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                This password reset link is invalid or has expired.
              </p>
              <Link
                to="/shop/forgot-password"
                className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
                  theme === 'dark'
                    ? 'bg-electric-green text-slate-900 hover:bg-electric-green/90'
                    : 'bg-accent-blue text-white hover:bg-accent-blue/90'
                }`}
              >
                Request New Link
              </Link>
            </div>
          </div>
        </section>

        <Footer variant="shop" />
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-slate-950' : 'bg-gray-50'}`}>
      <SEOHead title="Reset Password" description="Reset your NanoFlows Shop password" />
      <ShopNav />

      <section className="py-16">
        <div className="container mx-auto px-4 lg:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md mx-auto"
          >
            <div className={`p-8 rounded-2xl ${
              theme === 'dark'
                ? 'bg-slate-800 border border-slate-700'
                : 'bg-white border border-gray-200 shadow-lg'
            }`}>
              <div className="text-center mb-8">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 ${
                  theme === 'dark'
                    ? 'bg-gradient-to-br from-electric-blue to-electric-green'
                    : 'bg-gradient-to-br from-accent-red to-accent-blue'
                }`}>
                  <KeyRound className="w-8 h-8 text-white" />
                </div>
                <h1 className={`text-2xl font-bold mb-2 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  Set New Password
                </h1>
                <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                  Enter your new password below.
                </p>
              </div>

              {success ? (
                <div className="text-center">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
                    theme === 'dark' ? 'bg-electric-green/20' : 'bg-green-100'
                  }`}>
                    <Check className={`w-8 h-8 ${
                      theme === 'dark' ? 'text-electric-green' : 'text-green-600'
                    }`} />
                  </div>
                  <h3 className={`text-lg font-semibold mb-2 ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    Password Reset Successful
                  </h3>
                  <p className={`mb-6 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    Redirecting you to login...
                  </p>
                </div>
              ) : (
                <>
                  {error && (
                    <div className="flex items-center gap-2 p-3 mb-6 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500">
                      <AlertCircle className="w-5 h-5 flex-shrink-0" />
                      <p className="text-sm">{error}</p>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        New Password
                      </label>
                      <div className="relative">
                        <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                        }`} />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          placeholder="Enter new password"
                          className={`w-full pl-12 pr-12 py-3 rounded-xl border transition-all focus:outline-none focus:ring-2 ${
                            theme === 'dark'
                              ? 'bg-slate-700 border-slate-600 text-white placeholder:text-gray-500 focus:border-electric-blue focus:ring-electric-blue/20'
                              : 'bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-accent-blue focus:ring-accent-blue/20'
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className={`absolute right-4 top-1/2 -translate-y-1/2 ${
                            theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-700'
                          }`}
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className={`block text-sm font-medium mb-2 ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        Confirm New Password
                      </label>
                      <div className="relative">
                        <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                        }`} />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          required
                          placeholder="Confirm new password"
                          className={`w-full pl-12 pr-4 py-3 rounded-xl border transition-all focus:outline-none focus:ring-2 ${
                            theme === 'dark'
                              ? 'bg-slate-700 border-slate-600 text-white placeholder:text-gray-500 focus:border-electric-blue focus:ring-electric-blue/20'
                              : 'bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-accent-blue focus:ring-accent-blue/20'
                          }`}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      {passwordRequirements.map((req) => (
                        <div key={req.label} className="flex items-center gap-2">
                          <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                            req.met
                              ? theme === 'dark' ? 'bg-electric-green' : 'bg-green-500'
                              : theme === 'dark' ? 'bg-slate-600' : 'bg-gray-300'
                          }`}>
                            {req.met && <Check className="w-3 h-3 text-white" />}
                          </div>
                          <span className={`text-sm ${
                            req.met
                              ? theme === 'dark' ? 'text-electric-green' : 'text-green-600'
                              : theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                          }`}>
                            {req.label}
                          </span>
                        </div>
                      ))}
                    </div>

                    <button
                      type="submit"
                      disabled={loading || !allRequirementsMet}
                      className={`relative group overflow-hidden w-full flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 disabled:opacity-50 ${
                        theme === 'dark'
                          ? 'bg-gradient-to-r from-electric-blue to-electric-green text-slate-900 hover:shadow-lg hover:shadow-electric-blue/25'
                          : 'bg-gradient-to-r from-accent-red to-accent-blue text-white hover:shadow-lg hover:shadow-accent-red/25'
                      }`}
                    >
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        {loading ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          'Reset Password'
                        )}
                      </span>
                      <div
                        className={`absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 ${
                          theme === 'dark'
                            ? 'bg-gradient-to-r from-electric-green to-electric-blue'
                            : 'bg-gradient-to-r from-accent-blue to-accent-red'
                        }`}
                      />
                    </button>
                  </form>

                  <div className="mt-6 text-center">
                    <Link
                      to="/shop/login"
                      className={`inline-flex items-center gap-2 font-medium ${
                        theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Back to login
                    </Link>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      <Footer variant="shop" />
    </div>
  );
}
