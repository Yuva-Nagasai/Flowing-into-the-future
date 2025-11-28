import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export const AICursorGlow = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      setIsVisible(true);
    };

    const handleMouseLeave = () => setIsVisible(false);

    window.addEventListener('mousemove', updateMousePosition);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <motion.div
      className="pointer-events-none fixed z-50 hidden md:block"
      animate={{
        x: mousePosition.x - 25,
        y: mousePosition.y - 25,
      }}
      transition={{
        type: 'spring',
        damping: 30,
        stiffness: 200,
        mass: 0.5,
      }}
    >
      <div className="h-12 w-12 rounded-full opacity-30 blur-xl bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600" />
    </motion.div>
  );
};
