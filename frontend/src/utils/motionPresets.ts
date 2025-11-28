import { Variants } from 'framer-motion';

export const sectionContainerVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: 'easeOut'
    }
  }
};

export const staggeredVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1
    }
  }
};

export const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut'
    }
  }
};

export const scaleHoverVariants: Variants = {
  rest: { y: 0, scale: 1 },
  hover: {
    y: -6,
    scale: 1.02,
    transition: { duration: 0.3, ease: 'easeOut' }
  }
};

export const glowPulseAnimation = (theme: string, color: string) => ({
  boxShadow:
    theme === 'dark'
      ? [
          `0 0 0px ${color}00`,
          `0 0 20px ${color}40`,
          `0 0 0px ${color}00`
        ]
      : [
          `0 0 0px ${color}00`,
          `0 0 15px ${color}30`,
          `0 0 0px ${color}00`
        ]
});

export const viewportConfig = { once: true, amount: 0.3 };

