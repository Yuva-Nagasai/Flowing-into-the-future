import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Send, Check, Loader2, ArrowRight } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import shopApi from '../../utils/shopApi';

interface NewsletterFormProps {
  variant?: 'inline' | 'card' | 'full';
  title?: string;
  description?: string;
}

export default function NewsletterForm({
  variant = 'card',
  title = 'Subscribe to Our Newsletter',
  description = 'Get the latest deals, new products, and exclusive offers delivered to your inbox.',
}: NewsletterFormProps) {
  const { theme } = useTheme();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setError('');

    try {
      const res = await shopApi.subscribeNewsletter(email, name || undefined);
      if (res.success) {
        setSuccess(true);
        setEmail('');
        setName('');
        setTimeout(() => setSuccess(false), 5000);
      } else {
        setError(res.error || 'Subscription failed');
      }
    } catch {
      setError('Subscription failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (variant === 'inline') {
    return (
      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="relative flex-1">
          <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
          }`} />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            className={`w-full pl-10 pr-4 py-3 rounded-xl border transition-all focus:outline-none focus:ring-2 ${
              theme === 'dark'
                ? 'bg-slate-800 border-slate-600 text-white placeholder:text-gray-500 focus:border-electric-blue focus:ring-electric-blue/20'
                : 'bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-accent-blue focus:ring-accent-blue/20'
            }`}
          />
        </div>
        <button
          type="submit"
          disabled={loading || success}
          className={`relative group overflow-hidden px-6 py-3 rounded-xl font-semibold transition-all duration-300 disabled:opacity-50 ${
            success
              ? 'bg-green-500 text-white'
              : theme === 'dark'
                ? 'bg-gradient-to-r from-electric-blue to-electric-green text-slate-900 hover:shadow-lg'
                : 'bg-gradient-to-r from-accent-red to-accent-blue text-white hover:shadow-lg'
          }`}
        >
          <span className="relative z-10">
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : success ? (
              <Check className="w-5 h-5" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </span>
          {!success && (
            <div
              className={`absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 ${
                theme === 'dark'
                  ? 'bg-gradient-to-r from-electric-green to-electric-blue'
                  : 'bg-gradient-to-r from-accent-blue to-accent-red'
              }`}
            />
          )}
        </button>
      </form>
    );
  }

  if (variant === 'full') {
    return (
      <div className={`py-16 ${
        theme === 'dark'
          ? 'bg-gradient-to-r from-electric-blue/20 to-electric-green/20'
          : 'bg-gradient-to-r from-accent-red/10 to-accent-blue/10'
      }`}>
        <div className="container mx-auto px-4 lg:px-6">
          <div className="max-w-2xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Mail className={`w-12 h-12 mx-auto mb-4 ${
                theme === 'dark' ? 'text-electric-green' : 'text-accent-blue'
              }`} />
              <h2 className={`text-2xl md:text-3xl font-bold mb-4 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Subscribe to Our{' '}
                <span
                  className={`bg-gradient-to-r ${
                    theme === 'dark'
                      ? 'from-electric-blue to-electric-green'
                      : 'from-accent-red to-accent-blue'
                  } bg-clip-text text-transparent`}
                >
                  Newsletter
                </span>
              </h2>
              <p className={`text-lg mb-8 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
              }`}>
                {description}
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email address"
                    required
                    className={`flex-1 px-4 py-3 rounded-xl border transition-all focus:outline-none focus:ring-2 ${
                      theme === 'dark'
                        ? 'bg-slate-800/50 border-slate-600 text-white placeholder:text-gray-500 focus:border-electric-blue focus:ring-electric-blue/20'
                        : 'bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-accent-blue focus:ring-accent-blue/20'
                    }`}
                  />
                  <button
                    type="submit"
                    disabled={loading || success}
                    className={`relative group overflow-hidden inline-flex items-center justify-center gap-2 px-8 py-3 rounded-xl font-semibold shadow-lg transition-all duration-300 disabled:opacity-50 ${
                      success
                        ? 'bg-green-500 text-white'
                        : theme === 'dark'
                          ? 'bg-gradient-to-r from-electric-green to-electric-blue text-slate-900'
                          : 'bg-gradient-to-r from-accent-red to-accent-blue text-white'
                    }`}
                  >
                    {loading ? (
                      <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                    ) : success ? (
                      <span className="flex items-center gap-2">
                        <Check className="w-5 h-5" />
                        Subscribed!
                      </span>
                    ) : (
                      <>
                        Subscribe
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                    {!success && (
                      <div
                        className={`absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 ${
                          theme === 'dark'
                            ? 'bg-gradient-to-r from-electric-blue to-electric-green'
                            : 'bg-gradient-to-r from-accent-blue to-accent-red'
                        }`}
                      />
                    )}
                  </button>
                </div>

                {error && (
                  <p className="text-red-500 text-sm">{error}</p>
                )}

                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  No spam, unsubscribe anytime.
                </p>
              </form>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`p-6 rounded-2xl ${
      theme === 'dark' ? 'bg-slate-800/50 border border-slate-700' : 'bg-gray-50 border border-gray-200'
    }`}>
      <Mail className={`w-10 h-10 mb-4 ${
        theme === 'dark' ? 'text-electric-green' : 'text-accent-blue'
      }`} />
      <h3 className={`text-xl font-bold mb-2 ${
        theme === 'dark' ? 'text-white' : 'text-gray-900'
      }`}>
        Subscribe to Our{' '}
        <span
          className={`bg-gradient-to-r ${
            theme === 'dark'
              ? 'from-electric-blue to-electric-green'
              : 'from-accent-red to-accent-blue'
          } bg-clip-text text-transparent`}
        >
          Newsletter
        </span>
      </h3>
      <p className={`text-sm mb-4 ${
        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
      }`}>
        {description}
      </p>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name (optional)"
          className={`w-full px-4 py-2 rounded-lg border transition-all focus:outline-none focus:ring-2 ${
            theme === 'dark'
              ? 'bg-slate-700 border-slate-600 text-white placeholder:text-gray-500 focus:border-electric-blue focus:ring-electric-blue/20'
              : 'bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-accent-blue focus:ring-accent-blue/20'
          }`}
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email address"
          required
          className={`w-full px-4 py-2 rounded-lg border transition-all focus:outline-none focus:ring-2 ${
            theme === 'dark'
              ? 'bg-slate-700 border-slate-600 text-white placeholder:text-gray-500 focus:border-electric-blue focus:ring-electric-blue/20'
              : 'bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-accent-blue focus:ring-accent-blue/20'
          }`}
        />
        <button
          type="submit"
          disabled={loading || success}
          className={`relative group overflow-hidden w-full py-2 rounded-lg font-semibold transition-all duration-300 disabled:opacity-50 ${
            success
              ? 'bg-green-500 text-white'
              : theme === 'dark'
                ? 'bg-gradient-to-r from-electric-blue to-electric-green text-slate-900 hover:shadow-lg'
                : 'bg-gradient-to-r from-accent-red to-accent-blue text-white hover:shadow-lg'
          }`}
        >
          <span className="relative z-10">
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin mx-auto" />
            ) : success ? (
              <span className="flex items-center justify-center gap-2">
                <Check className="w-5 h-5" />
                Subscribed!
              </span>
            ) : (
              'Subscribe'
            )}
          </span>
          {!success && (
            <div
              className={`absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 ${
                theme === 'dark'
                  ? 'bg-gradient-to-r from-electric-green to-electric-blue'
                  : 'bg-gradient-to-r from-accent-blue to-accent-red'
              }`}
            />
          )}
        </button>

        {error && (
          <p className="text-red-500 text-sm text-center">{error}</p>
        )}
      </form>
    </div>
  );
}
