import { useState, useEffect, useCallback } from 'react';
import { FaHome, FaTools, FaCog, FaEnvelope, FaPhone } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';

interface MenuItem {
  id: string;
  label: string;
  icon: React.ElementType;
  href?: string;
  action?: string;
  external?: boolean;
}

const MENU_ITEMS: MenuItem[] = [
  {
    id: 'home',
    label: 'Home',
    icon: FaHome,
    href: '/',
  },
  {
    id: 'services',
    label: 'Services',
    icon: FaTools,
    href: '/#services',
  },
  {
    id: 'contact',
    label: 'Contact',
    icon: FaEnvelope,
    href: '/#contact',
  },
  {
    id: 'call',
    label: 'Call Us',
    icon: FaPhone,
    href: 'tel:+918019358855',
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: FaCog,
    action: 'settings',
  },
];

const GridIcon = () => (
  <svg 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="3" y="3" width="8" height="8" rx="2" fill="currentColor" />
    <rect x="13" y="3" width="8" height="8" rx="2" fill="currentColor" />
    <rect x="3" y="13" width="8" height="8" rx="2" fill="currentColor" />
    <rect x="13" y="13" width="8" height="8" rx="2" fill="currentColor" />
  </svg>
);

const FloatingContactWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const handleClickOutside = useCallback((e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (!target.closest('.floating-action-button')) {
      setIsOpen(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('click', handleClickOutside);
    }
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isOpen, handleClickOutside]);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  const handleItemClick = (e: React.MouseEvent, item: MenuItem) => {
    if (item.href?.startsWith('/#')) {
      e.preventDefault();
      const sectionId = item.href.replace('/#', '');
      if (location.pathname !== '/') {
        navigate('/');
        setTimeout(() => {
          scrollToSection(sectionId);
        }, 300);
      } else {
        scrollToSection(sectionId);
      }
      setIsOpen(false);
    } else if (item.href === '/') {
      e.preventDefault();
      navigate('/');
      setIsOpen(false);
    } else if (item.action === 'settings') {
      e.preventDefault();
      setIsOpen(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.06,
        delayChildren: 0.05,
      },
    },
    exit: {
      opacity: 0,
      transition: {
        staggerChildren: 0.04,
        staggerDirection: -1,
      },
    },
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      x: 30,
      scale: 0.5,
    },
    visible: { 
      opacity: 1, 
      x: 0,
      scale: 1,
      transition: {
        type: 'spring' as const,
        stiffness: 400,
        damping: 20,
      },
    },
    exit: { 
      opacity: 0, 
      x: 30,
      scale: 0.5,
      transition: {
        duration: 0.15,
      },
    },
  };

  return (
    <div 
      className="floating-action-button fixed right-4 sm:right-6 top-1/2 -translate-y-1/2 z-50"
      aria-label="Quick actions menu"
    >
      <div className="flex items-center gap-3">
        <AnimatePresence>
          {isOpen && (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="flex items-center gap-2"
            >
              {MENU_ITEMS.map((item) => {
                const Icon = item.icon;
                const isHovered = hoveredItem === item.id;

                const buttonContent = (
                  <motion.div
                    variants={itemVariants}
                    className="relative group"
                    onMouseEnter={() => setHoveredItem(item.id)}
                    onMouseLeave={() => setHoveredItem(null)}
                  >
                    <motion.div
                      className="w-10 h-10 rounded-full flex items-center justify-center bg-white shadow-lg cursor-pointer"
                      style={{
                        boxShadow: isHovered 
                          ? '0 8px 25px rgba(0, 0, 0, 0.25)' 
                          : '0 4px 15px rgba(0, 0, 0, 0.15)',
                      }}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Icon className="w-4 h-4 text-gray-700" />
                    </motion.div>
                    <AnimatePresence>
                      {isHovered && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          transition={{ duration: 0.15 }}
                          className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-900 text-white text-xs font-medium rounded whitespace-nowrap"
                        >
                          {item.label}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );

                if (item.href && !item.href.startsWith('/#') && item.href !== '/') {
                  return (
                    <a
                      key={item.id}
                      href={item.href}
                      target={item.external ? '_blank' : undefined}
                      rel={item.external ? 'noopener noreferrer' : undefined}
                      className="focus:outline-none"
                      aria-label={item.label}
                      onClick={() => setIsOpen(false)}
                    >
                      {buttonContent}
                    </a>
                  );
                }

                return (
                  <button
                    key={item.id}
                    onClick={(e) => handleItemClick(e, item)}
                    className="focus:outline-none"
                    aria-label={item.label}
                  >
                    {buttonContent}
                  </button>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen((prev) => !prev);
          }}
          className="w-16 h-16 rounded-full flex items-center justify-center shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-amber-500"
          style={{
            backgroundColor: '#F9A825',
            boxShadow: '0 6px 24px rgba(249, 168, 37, 0.4)',
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-expanded={isOpen}
          aria-label={isOpen ? 'Close menu' : 'Open menu'}
        >
          <motion.div
            animate={{ 
              rotate: isOpen ? 45 : 0,
            }}
            transition={{ 
              type: 'spring',
              stiffness: 300,
              damping: 20,
            }}
            className="text-black"
          >
            <GridIcon />
          </motion.div>
        </motion.button>
      </div>
    </div>
  );
};

export default FloatingContactWidget;
