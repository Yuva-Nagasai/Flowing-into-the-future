import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

interface AIThinkingAnimationProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const AIThinkingAnimation = ({
  size = 'md',
  className = '',
}: AIThinkingAnimationProps) => {
  const { theme } = useTheme();

  const sizeMap = {
    sm: 'h-2 w-2',
    md: 'h-3 w-3',
    lg: 'h-4 w-4',
  };

  const dotClass = `${sizeMap[size]} rounded-full ${
    theme === 'dark' ? 'bg-electric-blue' : 'bg-accent-red'
  }`;

  const containerVariants = {
    start: {
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const dotVariants = {
    start: {
      y: [0, -10, 0],
    },
  };

  const dotTransition = {
    duration: 0.6,
    repeat: Infinity,
    ease: 'easeInOut' as const,
  };

  return (
    <motion.div
      className={`flex items-center gap-2 ${className}`}
      variants={containerVariants}
      initial="start"
      animate="start"
    >
      <motion.div className={dotClass} variants={dotVariants} transition={dotTransition} />
      <motion.div className={dotClass} variants={dotVariants} transition={dotTransition} />
      <motion.div className={dotClass} variants={dotVariants} transition={dotTransition} />
    </motion.div>
  );
};
