import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showCloseButton?: boolean;
}

const Modal = ({ isOpen, onClose, title, children, size = 'md', showCloseButton = true }: ModalProps) => {
  const { theme } = useTheme();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl'
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', duration: 0.3 }}
            className={`fixed inset-0 z-50 flex items-center justify-center p-4`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={`relative w-full ${sizeClasses[size]} max-h-[90vh] overflow-hidden rounded-2xl shadow-2xl ${
              theme === 'dark'
                ? 'bg-dark-card border-2 border-electric-blue/30'
                : 'bg-white border-2 border-gray-200'
            }`}>
              {/* Header */}
              <div className={`flex items-center justify-between border-b px-6 py-4 ${
                theme === 'dark' ? 'border-gray-800' : 'border-gray-200'
              }`}>
                <h2 className={`text-xl font-bold ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`} style={{ fontFamily: 'Orbitron, sans-serif' }}>
                  {title}
                </h2>
                {showCloseButton && (
                  <button
                    onClick={onClose}
                    className={`p-2 rounded-lg transition-all ${
                      theme === 'dark'
                        ? 'text-gray-400 hover:bg-gray-800 hover:text-white'
                        : 'text-gray-800 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    <X size={20} />
                  </button>
                )}
              </div>

              {/* Content */}
              <div className="overflow-y-auto max-h-[calc(90vh-80px)] p-6">
                {children}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Modal;

