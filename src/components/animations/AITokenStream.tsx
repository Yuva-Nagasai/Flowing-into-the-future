import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface AITokenStreamProps {
  text: string;
  speed?: number;
  className?: string;
  onComplete?: () => void;
  delay?: number;
}

export const AITokenStream = ({
  text,
  speed = 30,
  className = '',
  onComplete,
  delay = 0,
}: AITokenStreamProps) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (delay > 0) {
      const delayTimeout = setTimeout(() => {
        setCurrentIndex(0);
        setDisplayedText('');
      }, delay);
      return () => clearTimeout(delayTimeout);
    }
  }, [delay]);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + text[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, speed);

      return () => clearTimeout(timeout);
    } else if (currentIndex === text.length && onComplete) {
      onComplete();
    }
  }, [currentIndex, text, speed, onComplete]);

  return (
    <span className={className}>
      {displayedText}
      {currentIndex < text.length && (
        <motion.span
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 0.8, repeat: Infinity }}
          className="inline-block ml-0.5"
        >
          |
        </motion.span>
      )}
    </span>
  );
};
