import Modal from './Modal';
import { useTheme } from '../context/ThemeContext';
import { AlertTriangle } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
  isLoading?: boolean;
}

const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
  isLoading = false
}: ConfirmModalProps) => {
  const { theme } = useTheme();

  const variantStyles = {
    danger: {
      button: theme === 'dark'
        ? 'bg-red-500 hover:bg-red-600 text-white'
        : 'bg-red-500 hover:bg-red-600 text-white',
      icon: 'text-red-500',
      bg: theme === 'dark' ? 'bg-red-500/10' : 'bg-red-50'
    },
    warning: {
      button: theme === 'dark'
        ? 'bg-yellow-500 hover:bg-yellow-600 text-black'
        : 'bg-yellow-500 hover:bg-yellow-600 text-black',
      icon: 'text-yellow-500',
      bg: theme === 'dark' ? 'bg-yellow-500/10' : 'bg-yellow-50'
    },
    info: {
      button: theme === 'dark'
        ? 'bg-electric-blue hover:bg-electric-blue/80 text-black'
        : 'bg-accent-blue hover:bg-accent-blue/90 text-white',
      icon: theme === 'dark' ? 'text-electric-blue' : 'text-accent-blue',
      bg: theme === 'dark' ? 'bg-electric-blue/10' : 'bg-accent-blue/10'
    }
  };

  const style = variantStyles[variant];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <div className="space-y-6">
        <div className={`flex items-start gap-4 rounded-xl p-4 ${style.bg}`}>
          <div className={`flex-shrink-0 ${style.icon}`}>
            <AlertTriangle size={24} />
          </div>
          <p className={`flex-1 text-sm leading-relaxed ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-800'
          }`}>
            {message}
          </p>
        </div>

        <div className="flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              theme === 'dark'
                ? 'border-2 border-gray-700 text-gray-300 hover:bg-gray-800'
                : 'border-2 border-gray-200 text-gray-800 hover:bg-gray-100'
            } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`px-6 py-2 rounded-lg font-semibold transition-all shadow-lg ${style.button} ${
              isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Processing...
              </span>
            ) : (
              confirmText
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmModal;

