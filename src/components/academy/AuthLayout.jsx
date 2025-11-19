import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const AuthLayout = ({
  badge = 'NanoFlows Academy',
  headline = 'Master AI and modern development skills',
  description = 'Trusted by teams and professionals who want to skill up with immersive, guided learning experiences.',
  highlights = [],
  stats = [],
  title,
  subtitle,
  children,
  footer
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div
      className={`relative flex min-h-screen overflow-hidden transition-colors duration-500 ${
        isDark ? 'bg-slate-950' : 'bg-slate-50'
      }`}
    >
      <div
        className={`absolute inset-0 transition-opacity duration-500 ${
          isDark
            ? 'bg-[radial-gradient(circle_at_top_right,_rgba(10,186,181,0.15),transparent_50%),radial-gradient(circle_at_bottom_left,_rgba(0,255,127,0.10),transparent_60%)]'
            : 'bg-[radial-gradient(circle_at_top,_rgba(10,186,181,0.20),rgba(255,255,255,0.8)_50%)]'
        }`}
      />
      
      <div
        className={`absolute top-0 right-0 h-[600px] w-[600px] rounded-full blur-3xl transition-all duration-700 ${
          isDark ? 'bg-[#0ABAB5]/10' : 'bg-[#0ABAB5]/15'
        }`}
      />
      <div
        className={`absolute bottom-0 left-0 h-[500px] w-[500px] rounded-full blur-3xl transition-all duration-700 ${
          isDark ? 'bg-[#00FF7F]/10' : 'bg-[#00FF7F]/15'
        }`}
      />

      <div className="relative z-10 flex w-full flex-col lg:h-svh lg:flex-row">
        <motion.section
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className={`flex-1 px-8 py-12 lg:flex lg:flex-col lg:justify-center lg:px-20 lg:py-20 ${
            isDark
              ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white'
              : 'bg-gradient-to-br from-white/95 via-[#0ABAB5]/5 to-slate-100/90 text-slate-900'
          }`}
        >
          <div className="max-w-xl space-y-10">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className={`inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-xs font-bold uppercase tracking-wider backdrop-blur-sm ${
                isDark
                  ? 'border-[#0ABAB5]/30 bg-[#0ABAB5]/10 text-[#00FF7F] shadow-lg shadow-[#0ABAB5]/20'
                  : 'border-[#0ABAB5]/30 bg-white/90 text-[#0ABAB5] shadow-lg shadow-[#0ABAB5]/20'
              }`}
            >
              <span className="relative flex h-2 w-2">
                <span
                  className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${
                    isDark ? 'bg-[#00FF7F]' : 'bg-[#0ABAB5]'
                  }`}
                />
                <span
                  className={`relative inline-flex h-2 w-2 rounded-full ${
                    isDark ? 'bg-[#00FF7F]' : 'bg-[#0ABAB5]'
                  }`}
                />
              </span>
              {badge}
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className={`text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}
              style={{ fontFamily: 'Orbitron, sans-serif' }}
            >
              {headline}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className={`text-lg leading-relaxed ${
                isDark ? 'text-slate-300' : 'text-slate-600'
              }`}
            >
              {description}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="grid gap-6 sm:grid-cols-2"
            >
              {highlights.map(({ icon: Icon, title: itemTitle, description: itemDescription }, index) => (
                <motion.div
                  key={itemTitle}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
                  className={`group rounded-2xl border p-5 backdrop-blur-sm transition-all hover:-translate-y-1 hover:shadow-2xl ${
                    isDark
                      ? 'border-[#0ABAB5]/20 bg-slate-900/40 hover:border-[#0ABAB5]/40 hover:bg-slate-900/60 hover:shadow-[#0ABAB5]/30'
                      : 'border-[#0ABAB5]/20 bg-white/80 shadow-lg shadow-[#0ABAB5]/10 hover:border-[#0ABAB5]/40 hover:shadow-[#0ABAB5]/20'
                  }`}
                >
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-xl transition-all group-hover:scale-110 ${
                      isDark
                        ? 'bg-gradient-to-br from-[#0ABAB5]/20 to-[#00FF7F]/20 text-[#00FF7F]'
                        : 'bg-gradient-to-br from-[#0ABAB5]/15 to-[#00FF7F]/15 text-[#0ABAB5]'
                    }`}
                  >
                    <Icon size={22} strokeWidth={2.5} />
                  </div>
                  <h3
                    className={`mt-4 text-base font-bold ${
                      isDark ? 'text-white' : 'text-slate-900'
                    }`}
                  >
                    {itemTitle}
                  </h3>
                  <p
                    className={`mt-2 text-sm leading-relaxed ${
                      isDark ? 'text-slate-400' : 'text-slate-600'
                    }`}
                  >
                    {itemDescription}
                  </p>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className={`mt-10 border-t pt-6 ${
                isDark ? 'border-slate-800' : 'border-slate-200'
              }`}
            >
              <div
                className={`flex flex-wrap items-center gap-8 ${
                  isDark ? 'text-slate-300' : 'text-slate-600'
                }`}
              >
                {stats.map(({ label, value }) => (
                  <div key={label}>
                    <div
                      className={`text-3xl font-bold ${
                        isDark
                          ? 'bg-gradient-to-r from-[#0ABAB5] to-[#00FF7F] bg-clip-text text-transparent'
                          : 'text-[#0ABAB5]'
                      }`}
                      style={{ fontFamily: 'Orbitron, sans-serif' }}
                    >
                      {value}
                    </div>
                    <div className="mt-1 text-xs font-semibold uppercase tracking-wider">{label}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          className="flex-1 px-6 py-12 lg:flex lg:items-center lg:justify-center lg:px-16 lg:py-20"
        >
          <div className="mx-auto w-full max-w-md">
            <div
              className={`rounded-3xl border p-8 shadow-2xl backdrop-blur-sm transition-all lg:p-10 ${
                isDark
                  ? 'border-[#0ABAB5]/20 bg-slate-900/60 shadow-[#0ABAB5]/20'
                  : 'border-slate-200 bg-white/90 shadow-slate-300/50'
              }`}
            >
              <div
                className={`mb-8 text-right text-sm ${
                  isDark ? 'text-slate-400' : 'text-slate-500'
                }`}
              >
                Need help?{' '}
                <a
                  href="mailto:support@nanoflows.com"
                  className={`font-semibold transition ${
                    isDark
                      ? 'text-[#00FF7F] hover:text-[#0ABAB5]'
                      : 'text-[#0ABAB5] hover:text-[#00FF7F]'
                  }`}
                >
                  Contact support
                </a>
              </div>

              <div className="mb-8">
                <h2
                  className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}
                  style={{ fontFamily: 'Orbitron, sans-serif' }}
                >
                  {title}
                </h2>
                {subtitle && (
                  <p
                    className={`mt-3 text-base ${
                      isDark ? 'text-slate-400' : 'text-slate-600'
                    }`}
                  >
                    {subtitle}
                  </p>
                )}
              </div>

              <div className="space-y-6">{children}</div>

              {footer && <div className="mt-8">{footer}</div>}
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
};

export default AuthLayout;
