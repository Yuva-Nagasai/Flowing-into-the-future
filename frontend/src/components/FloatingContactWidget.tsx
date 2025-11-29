import { useState, useEffect, useCallback } from 'react';
import { FaWhatsapp, FaPhone, FaEnvelope } from 'react-icons/fa';
import { HiChatBubbleLeftRight } from 'react-icons/hi2';
import { X } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

interface ContactAction {
  label: string;
  href: string;
  icon: React.ElementType;
  bgColor: string;
  hoverBg: string;
  external?: boolean;
  isRoute?: boolean;
}

const CONTACT_ACTIONS: ContactAction[] = [
  {
    label: 'WhatsApp',
    href: 'https://wa.me/918019358855',
    icon: FaWhatsapp,
    bgColor: '#25D366',
    hoverBg: '#128C7E',
    external: true,
  },
  {
    label: 'Call Us',
    href: 'tel:+918019358855',
    icon: FaPhone,
    bgColor: '#007AFF',
    hoverBg: '#0056CC',
  },
  {
    label: 'Email Us',
    href: 'mailto:nanoflowsvizag@gmail.com?subject=Project%20Enquiry',
    icon: FaEnvelope,
    bgColor: '#EA4335',
    hoverBg: '#C5221F',
  },
  {
    label: 'Contact Form',
    href: '/#contact',
    icon: HiChatBubbleLeftRight,
    bgColor: '#6366F1',
    hoverBg: '#4F46E5',
    isRoute: true,
  },
];

const FloatingContactWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const handleClickOutside = useCallback((e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (!target.closest('.floating-contact-widget')) {
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

  const handleContactClick = (e: React.MouseEvent, href: string) => {
    if (href.startsWith('/#')) {
      e.preventDefault();
      const sectionId = href.replace('/#', '');
      if (location.pathname !== '/') {
        navigate(`/#${sectionId}`);
        setTimeout(() => {
          scrollToSection(sectionId);
        }, 300);
      } else {
        scrollToSection(sectionId);
      }
      setIsOpen(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
    exit: {
      opacity: 0,
      transition: {
        staggerChildren: 0.05,
        staggerDirection: -1,
      },
    },
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      x: 20,
      scale: 0.8,
    },
    visible: { 
      opacity: 1, 
      x: 0,
      scale: 1,
      transition: {
        type: 'spring' as const,
        stiffness: 300,
        damping: 24,
      },
    },
    exit: { 
      opacity: 0, 
      x: 20,
      scale: 0.8,
      transition: {
        duration: 0.2,
      },
    },
  };

  return (
    <div 
      className="floating-contact-widget fixed left-4 sm:left-6 top-1/2 -translate-y-1/2 z-50"
      aria-label="Contact options"
    >
      <div className="flex flex-col items-start gap-3">
        <AnimatePresence>
          {isOpen && (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="flex flex-col gap-2"
            >
              {CONTACT_ACTIONS.map((action) => {
                const Icon = action.icon;
                const isHovered = hoveredItem === action.label;
                
                const buttonContent = (
                  <motion.div
                    variants={itemVariants}
                    className="flex items-center gap-0 group"
                    onMouseEnter={() => setHoveredItem(action.label)}
                    onMouseLeave={() => setHoveredItem(null)}
                  >
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 group-hover:scale-110"
                      style={{
                        backgroundColor: action.bgColor,
                        boxShadow: isHovered 
                          ? `0 8px 25px ${action.bgColor}60` 
                          : `0 4px 15px ${action.bgColor}40`,
                      }}
                    >
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <AnimatePresence>
                      {isHovered && (
                        <motion.span
                          initial={{ opacity: 0, x: -10, width: 0 }}
                          animate={{ opacity: 1, x: 0, width: 'auto' }}
                          exit={{ opacity: 0, x: -10, width: 0 }}
                          transition={{ duration: 0.2 }}
                          className="ml-3 px-3 py-1.5 text-sm font-medium text-white rounded-lg whitespace-nowrap overflow-hidden"
                          style={{ backgroundColor: action.bgColor }}
                        >
                          {action.label}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );

                if (action.isRoute) {
                  return (
                    <button
                      key={action.label}
                      onClick={(e) => handleContactClick(e, action.href)}
                      className="focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500"
                      aria-label={action.label}
                    >
                      {buttonContent}
                    </button>
                  );
                }

                return (
                  <a
                    key={action.label}
                    href={action.href}
                    target={action.external ? '_blank' : undefined}
                    rel={action.external ? 'noopener noreferrer' : undefined}
                    className="focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500"
                    aria-label={action.label}
                  >
                    {buttonContent}
                  </a>
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
          className="w-14 h-14 rounded-full flex items-center justify-center shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-cyan-500"
          style={{
            background: isOpen 
              ? 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)'
              : 'linear-gradient(135deg, #06B6D4 0%, #0891B2 50%, #0E7490 100%)',
            boxShadow: isOpen 
              ? '0 8px 30px rgba(239, 68, 68, 0.4)'
              : '0 8px 30px rgba(6, 182, 212, 0.4)',
          }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          animate={{ 
            rotate: isOpen ? 0 : 0,
          }}
          aria-expanded={isOpen}
          aria-label={isOpen ? 'Close contact options' : 'Open contact options'}
        >
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <X className="w-6 h-6 text-white" />
              </motion.div>
            ) : (
              <motion.div
                key="chat"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="relative"
              >
                <HiChatBubbleLeftRight className="w-6 h-6 text-white" />
                <motion.span
                  className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white"
                  animate={{
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
    </div>
  );
};

export default FloatingContactWidget;
