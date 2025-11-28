import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

export const AIGlowBackground = () => {
  const { theme } = useTheme();

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <motion.div
        className={`absolute -left-1/4 -top-1/4 h-96 w-96 rounded-full opacity-20 blur-3xl ${
          theme === 'dark'
            ? 'bg-electric-blue'
            : 'bg-accent-red'
        }`}
        animate={{
          x: [0, 100, 0],
          y: [0, 50, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      
      <motion.div
        className={`absolute -right-1/4 top-1/2 h-96 w-96 rounded-full opacity-20 blur-3xl ${
          theme === 'dark'
            ? 'bg-electric-green'
            : 'bg-pink-500'
        }`}
        animate={{
          x: [0, -100, 0],
          y: [0, -50, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      
      <motion.div
        className={`absolute bottom-0 left-1/2 h-96 w-96 rounded-full opacity-15 blur-3xl ${
          theme === 'dark'
            ? 'bg-accent-yellow'
            : 'bg-orange-400'
        }`}
        animate={{
          x: [0, 50, 0],
          y: [0, -100, 0],
          scale: [1, 1.3, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </div>
  );
};
