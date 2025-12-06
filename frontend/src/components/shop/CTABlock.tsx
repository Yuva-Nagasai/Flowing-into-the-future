import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, ShoppingBag, Zap } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface CTABlockProps {
  variant?: 'primary' | 'secondary' | 'gradient';
  title: string;
  description?: string;
  primaryAction?: {
    label: string;
    href: string;
  };
  secondaryAction?: {
    label: string;
    href: string;
  };
  icon?: 'sparkles' | 'shopping' | 'zap' | 'none';
}

export default function CTABlock({
  variant = 'primary',
  title,
  description,
  primaryAction,
  secondaryAction,
  icon = 'sparkles',
}: CTABlockProps) {
  const { theme } = useTheme();

  const IconComponent = {
    sparkles: Sparkles,
    shopping: ShoppingBag,
    zap: Zap,
    none: null,
  }[icon];

  const bgClasses = {
    primary: theme === 'dark'
      ? 'bg-slate-800 border border-slate-700'
      : 'bg-white border border-gray-200 shadow-lg',
    secondary: theme === 'dark'
      ? 'bg-slate-900'
      : 'bg-gray-100',
    gradient: theme === 'dark'
      ? 'bg-gradient-to-r from-electric-blue/20 via-electric-green/10 to-electric-blue/20'
      : 'bg-gradient-to-r from-accent-red/10 via-accent-blue/5 to-accent-red/10',
  }[variant];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`rounded-2xl p-8 md:p-12 ${bgClasses}`}
    >
      <div className="max-w-3xl mx-auto text-center">
        {IconComponent && (
          <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6 ${
            theme === 'dark'
              ? 'bg-electric-green/20 text-electric-green'
              : 'bg-accent-blue/10 text-accent-blue'
          }`}>
            <IconComponent className="w-8 h-8" />
          </div>
        )}

        <h2 className={`text-2xl md:text-3xl lg:text-4xl font-bold mb-4 ${
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}>
          {title}
        </h2>

        {description && (
          <p className={`text-lg mb-8 ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
          }`}>
            {description}
          </p>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          {primaryAction && (
            <Link
              to={primaryAction.href}
              className={`relative group overflow-hidden inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 ${
                theme === 'dark'
                  ? 'bg-gradient-to-r from-electric-blue to-electric-green text-slate-900 hover:shadow-lg hover:shadow-electric-blue/25'
                  : 'bg-gradient-to-r from-accent-red to-accent-blue text-white hover:shadow-lg hover:shadow-accent-red/25'
              }`}
            >
              <span className="relative z-10 flex items-center gap-2">
                {primaryAction.label}
                <ArrowRight className="w-5 h-5" />
              </span>
              <div
                className={`absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 ${
                  theme === 'dark'
                    ? 'bg-gradient-to-r from-electric-green to-electric-blue'
                    : 'bg-gradient-to-r from-accent-blue to-accent-red'
                }`}
              />
            </Link>
          )}

          {secondaryAction && (
            <Link
              to={secondaryAction.href}
              className={`inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-lg transition-all border ${
                theme === 'dark'
                  ? 'border-slate-600 text-white hover:bg-slate-800'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-100'
              }`}
            >
              {secondaryAction.label}
            </Link>
          )}
        </div>
      </div>
    </motion.div>
  );
}
