import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface AIPulseButtonProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
}

export const AIPulseButton = ({
  children,
  onClick,
  className = '',
  variant = 'primary',
  size = 'md',
  disabled = false,
}: AIPulseButtonProps) => {
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  const variantClasses = {
    primary: 'bg-gradient-to-r from-electric-blue via-electric-green to-accent-yellow dark:from-electric-blue dark:via-electric-green dark:to-accent-yellow text-black font-semibold',
    secondary: 'bg-electric-green dark:bg-electric-green text-black',
    outline: 'border-2 border-electric-blue dark:border-electric-blue text-electric-blue dark:text-electric-blue bg-transparent',
  };

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      className={`relative overflow-hidden rounded-lg font-exo transition-all ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0"
        animate={{
          x: ['-100%', '100%'],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
      
      <motion.div
        className="absolute inset-0 rounded-lg blur-md opacity-50"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        style={{
          background: 'inherit',
          filter: 'blur(8px)',
        }}
      />
      
      <span className="relative z-10 flex items-center justify-center gap-2">{children}</span>
    </motion.button>
  );
};
