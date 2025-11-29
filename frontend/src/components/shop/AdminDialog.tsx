import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertTriangle, Info, CheckCircle } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface AdminDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  variant?: 'default' | 'danger' | 'success' | 'info';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showCloseButton?: boolean;
  children?: React.ReactNode;
  footer?: React.ReactNode;
}

export default function AdminDialog({
  isOpen,
  onClose,
  title,
  description,
  variant = 'default',
  size = 'md',
  showCloseButton = true,
  children,
  footer,
}: AdminDialogProps) {
  const { theme } = useTheme();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
  };

  const iconComponents = {
    default: null,
    danger: AlertTriangle,
    success: CheckCircle,
    info: Info,
  };

  const iconColors = {
    default: '',
    danger: 'text-red-500 bg-red-500/10',
    success: theme === 'dark' ? 'text-electric-green bg-electric-green/10' : 'text-green-500 bg-green-500/10',
    info: theme === 'dark' ? 'text-electric-blue bg-electric-blue/10' : 'text-accent-blue bg-accent-blue/10',
  };

  const IconComponent = iconComponents[variant];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className={`relative w-full ${sizeClasses[size]} rounded-2xl shadow-2xl ${
              theme === 'dark' ? 'bg-slate-800 border border-slate-700' : 'bg-white'
            }`}
          >
            {showCloseButton && (
              <button
                onClick={onClose}
                className={`absolute top-4 right-4 p-2 rounded-full transition-colors ${
                  theme === 'dark' ? 'hover:bg-slate-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
                }`}
              >
                <X className="w-5 h-5" />
              </button>
            )}

            <div className="p-6">
              <div className="flex items-start gap-4">
                {IconComponent && (
                  <div className={`p-3 rounded-full flex-shrink-0 ${iconColors[variant]}`}>
                    <IconComponent className="w-6 h-6" />
                  </div>
                )}
                <div className="flex-1">
                  <h3 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {title}
                  </h3>
                  {description && (
                    <p className={`mt-2 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      {description}
                    </p>
                  )}
                </div>
              </div>

              {children && (
                <div className="mt-6">
                  {children}
                </div>
              )}
            </div>

            {footer && (
              <div className={`px-6 py-4 rounded-b-2xl border-t ${
                theme === 'dark' ? 'border-slate-700 bg-slate-800/50' : 'border-gray-100 bg-gray-50'
              }`}>
                {footer}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'default';
  loading?: boolean;
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'default',
  loading = false,
}: ConfirmDialogProps) {
  const { theme } = useTheme();

  return (
    <AdminDialog
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      description={description}
      variant={variant === 'danger' ? 'danger' : 'info'}
      size="sm"
      footer={
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              theme === 'dark'
                ? 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 ${
              variant === 'danger'
                ? 'bg-red-500 text-white hover:bg-red-600'
                : theme === 'dark'
                  ? 'bg-electric-green text-slate-900 hover:bg-electric-green/90'
                  : 'bg-accent-blue text-white hover:bg-accent-blue/90'
            }`}
          >
            {loading ? 'Loading...' : confirmText}
          </button>
        </div>
      }
    />
  );
}
