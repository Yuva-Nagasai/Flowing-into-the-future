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
  shadowColor: string;
  external?: boolean;
  isRoute?: boolean;
}

const CONTACT_ACTIONS: ContactAction[] = [
  {
    label: 'Call Us',
    href: 'tel:+918019358855',
    icon: FaPhone,
    bgColor: '#FF6B35',
    shadowColor: 'rgba(255, 107, 53, 0.5)',
  },
  {
    label: 'Email Us',
    href: 'mailto:nanoflowsvizag@gmail.com?subject=Project%20Enquiry',
    icon: FaEnvelope,
    bgColor: '#F59E0B',
    shadowColor: 'rgba(245, 158, 11, 0.5)',
  },
  {
    label: 'Contact Form',
    href: '/#contact',
    icon: HiChatBubbleLeftRight,
    bgColor: '#8B5CF6',
    shadowColor: 'rgba(139, 92, 246, 0.5)',
    isRoute: true,
  },
  {
    label: 'WhatsApp',
    href: 'https://wa.me/918019358855',
    icon: FaWhatsapp,
    bgColor: '#25D366',
    shadowColor: 'rgba(37, 211, 102, 0.5)',
    external: true,
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

  const getItemFinalPosition = (index: number) => {
    const verticalSpacing = 56;
    const horizontalOffset = index * 6;
    
    return {
      x: horizontalOffset,
      y: -(index + 1) * verticalSpacing,
    };
  };

  const getCircularPath = (index: number, finalPos: { x: number; y: number }) => {
    const baseRadius = 40;
    const radiusGrowth = 12;
    const radius = baseRadius + (index * radiusGrowth);
    
    const angle1 = 30;
    const angle2 = 60;
    
    const mid1X = Math.cos(angle1 * Math.PI / 180) * radius;
    const mid1Y = -Math.sin(angle1 * Math.PI / 180) * radius;
    
    const mid2X = Math.cos(angle2 * Math.PI / 180) * radius * 0.7;
    const mid2Y = -Math.sin(angle2 * Math.PI / 180) * radius * 1.2;
    
    return {
      x: [0, mid1X, mid2X, finalPos.x],
      y: [0, mid1Y, mid2Y, finalPos.y],
      rotate: [-180, -90, -30, 0],
    };
  };

  const labelVariants = {
    hidden: { 
      opacity: 0, 
      x: -8,
      scale: 0.9,
    },
    visible: { 
      opacity: 1, 
      x: 0,
      scale: 1,
      transition: {
        type: 'spring' as const,
        stiffness: 300,
        damping: 25,
      }
    },
    exit: { 
      opacity: 0, 
      x: -8,
      scale: 0.9,
      transition: {
        duration: 0.15,
      }
    },
  };

  return (
    <div 
      className="floating-contact-widget fixed left-5 top-1/2 -translate-y-1/2 z-50"
      aria-label="Contact options"
      style={{ overflow: 'visible' }}
    >
      <div className="relative" style={{ width: '56px', height: '56px' }}>
        <AnimatePresence mode="sync">
          {isOpen && CONTACT_ACTIONS.map((action, index) => {
            const Icon = action.icon;
            const isHovered = hoveredItem === action.label;
            const finalPosition = getItemFinalPosition(index);
            const totalItems = CONTACT_ACTIONS.length;
            const delay = index * 0.1;
            const exitDelay = (totalItems - 1 - index) * 0.06;
            const path = getCircularPath(index, finalPosition);
            
            const buttonContent = (
              <motion.div
                initial={{ 
                  opacity: 0, 
                  scale: 0,
                  x: 0,
                  y: 0,
                  rotate: -180,
                }}
                animate={{ 
                  opacity: 1, 
                  scale: 1,
                  x: path.x,
                  y: path.y,
                  rotate: path.rotate,
                }}
                exit={{ 
                  opacity: 0, 
                  scale: 0,
                  x: [...path.x].reverse(),
                  y: [...path.y].reverse(),
                  rotate: [...path.rotate].reverse(),
                  transition: {
                    duration: 0.5,
                    delay: exitDelay,
                    ease: [0.4, 0, 0.2, 1],
                    times: [0, 0.3, 0.6, 1],
                  }
                }}
                transition={{
                  duration: 0.7,
                  delay: delay,
                  ease: [0.22, 1, 0.36, 1],
                  times: [0, 0.25, 0.6, 1],
                }}
                className="absolute flex items-center group cursor-pointer"
                style={{
                  left: '7px',
                  top: '7px',
                  zIndex: totalItems - index,
                }}
                onMouseEnter={() => setHoveredItem(action.label)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <motion.div
                  className="w-11 h-11 rounded-full flex items-center justify-center relative overflow-hidden"
                  style={{
                    backgroundColor: action.bgColor,
                    boxShadow: isHovered 
                      ? `0 8px 32px ${action.shadowColor}, 0 0 0 3px rgba(255,255,255,0.2)` 
                      : `0 4px 20px ${action.shadowColor}`,
                  }}
                  whileHover={{ 
                    scale: 1.15,
                    transition: { type: 'spring', stiffness: 400, damping: 17 }
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  <motion.div
                    className="absolute inset-0 bg-white"
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 0.15 }}
                    transition={{ duration: 0.2 }}
                  />
                  <Icon className="w-5 h-5 text-white relative z-10" />
                </motion.div>
                
                <AnimatePresence>
                  {isHovered && (
                    <motion.span
                      variants={labelVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="ml-3 px-4 py-2 text-sm font-semibold text-white rounded-xl whitespace-nowrap backdrop-blur-sm"
                      style={{ 
                        backgroundColor: action.bgColor,
                        boxShadow: `0 4px 15px ${action.shadowColor}`,
                      }}
                    >
                      {action.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>
            );

            if (action.isRoute) {
              return (
                <div key={action.label} style={{ position: 'absolute', left: 0, top: 0 }}>
                  <div 
                    onClick={(e) => handleContactClick(e, action.href)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && handleContactClick(e as unknown as React.MouseEvent, action.href)}
                    aria-label={action.label}
                  >
                    {buttonContent}
                  </div>
                </div>
              );
            }

            return (
              <a
                key={action.label}
                href={action.href}
                target={action.external ? '_blank' : undefined}
                rel={action.external ? 'noopener noreferrer' : undefined}
                aria-label={action.label}
                style={{ position: 'absolute', left: 0, top: 0 }}
              >
                {buttonContent}
              </a>
            );
          })}
        </AnimatePresence>

        <motion.div
          className="absolute"
          style={{ left: 0, top: 0 }}
        >
          {!isOpen && (
            <motion.div
              className="absolute w-14 h-14 rounded-full"
              style={{
                left: 0,
                top: 0,
                background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.4) 0%, rgba(14, 116, 144, 0.4) 100%)',
              }}
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.6, 0.2, 0.6],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          )}
          
          <motion.button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen((prev) => !prev);
            }}
            className="relative w-14 h-14 rounded-full flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-cyan-500"
            style={{
              background: isOpen 
                ? 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)'
                : 'linear-gradient(135deg, #06B6D4 0%, #0891B2 50%, #0E7490 100%)',
              boxShadow: isOpen 
                ? '0 8px 32px rgba(239, 68, 68, 0.5), inset 0 1px 0 rgba(255,255,255,0.2)'
                : '0 8px 32px rgba(6, 182, 212, 0.5), inset 0 1px 0 rgba(255,255,255,0.2)',
            }}
            animate={{
              rotate: isOpen ? 90 : 0,
            }}
            whileHover={{ 
              scale: 1.08,
              boxShadow: isOpen 
                ? '0 12px 40px rgba(239, 68, 68, 0.6)'
                : '0 12px 40px rgba(6, 182, 212, 0.6)',
            }}
            whileTap={{ scale: 0.92 }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 20,
            }}
            aria-expanded={isOpen}
            aria-label={isOpen ? 'Close contact options' : 'Open contact options'}
          >
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{
                background: 'linear-gradient(180deg, rgba(255,255,255,0.15) 0%, transparent 50%)',
              }}
            />
            
            <AnimatePresence mode="wait">
              {isOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
                  animate={{ rotate: 0, opacity: 1, scale: 1 }}
                  exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
                  transition={{ 
                    type: 'spring',
                    stiffness: 300,
                    damping: 20,
                  }}
                  className="relative z-10"
                >
                  <X className="w-6 h-6 text-white" strokeWidth={2.5} />
                </motion.div>
              ) : (
                <motion.div
                  key="chat"
                  initial={{ rotate: 90, opacity: 0, scale: 0.5 }}
                  animate={{ rotate: 0, opacity: 1, scale: 1 }}
                  exit={{ rotate: -90, opacity: 0, scale: 0.5 }}
                  transition={{ 
                    type: 'spring',
                    stiffness: 300,
                    damping: 20,
                  }}
                  className="relative z-10"
                >
                  <HiChatBubbleLeftRight className="w-6 h-6 text-white" />
                  <motion.span
                    className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white"
                    animate={{
                      scale: [1, 1.3, 1],
                      boxShadow: [
                        '0 0 0 0 rgba(74, 222, 128, 0.7)',
                        '0 0 0 6px rgba(74, 222, 128, 0)',
                        '0 0 0 0 rgba(74, 222, 128, 0)',
                      ],
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
        </motion.div>
      </div>
    </div>
  );
};

export default FloatingContactWidget;
