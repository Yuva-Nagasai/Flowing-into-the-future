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
    bgColor: '#FF6B35',
    hoverBg: '#E55A2B',
  },
  {
    label: 'Email Us',
    href: 'mailto:nanoflowsvizag@gmail.com?subject=Project%20Enquiry',
    icon: FaEnvelope,
    bgColor: '#F59E0B',
    hoverBg: '#D97706',
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

  const radius = 70;
  const startAngle = -90;
  const angleSpread = 90;
  const itemCount = CONTACT_ACTIONS.length;
  
  const getItemPosition = (index: number) => {
    const angleStep = angleSpread / (itemCount - 1);
    const angle = startAngle + (index * angleStep);
    const radian = (angle * Math.PI) / 180;
    
    const x = Math.cos(radian) * radius;
    const y = Math.sin(radian) * radius;
    
    return { x, y };
  };

  return (
    <div 
      className="floating-contact-widget fixed left-6 top-1/2 -translate-y-1/2 z-50"
      aria-label="Contact options"
      style={{ overflow: 'visible' }}
    >
      <div className="relative" style={{ width: '56px', height: '56px' }}>
        <AnimatePresence>
          {isOpen && CONTACT_ACTIONS.map((action, index) => {
            const Icon = action.icon;
            const isHovered = hoveredItem === action.label;
            const position = getItemPosition(index);
            
            const buttonContent = (
              <motion.div
                initial={{ 
                  opacity: 0, 
                  scale: 0,
                  x: 0,
                  y: 0,
                }}
                animate={{ 
                  opacity: 1, 
                  scale: 1,
                  x: position.x,
                  y: position.y,
                }}
                exit={{ 
                  opacity: 0, 
                  scale: 0,
                  x: 0,
                  y: 0,
                }}
                transition={{
                  type: 'spring',
                  stiffness: 400,
                  damping: 20,
                  delay: index * 0.05,
                }}
                className="absolute flex items-center group"
                style={{
                  left: '50%',
                  top: '50%',
                  marginLeft: '-24px',
                  marginTop: '-24px',
                }}
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
                  style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%', background: 'transparent', border: 'none', cursor: 'pointer' }}
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
                style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%' }}
              >
                {buttonContent}
              </a>
            );
          })}
        </AnimatePresence>

        <motion.button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen((prev) => !prev);
          }}
          className="absolute w-14 h-14 rounded-full flex items-center justify-center shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-cyan-500"
          style={{
            left: 0,
            top: 0,
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
            rotate: isOpen ? 90 : 0,
          }}
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 20,
          }}
          aria-expanded={isOpen}
          aria-label={isOpen ? 'Close contact options' : 'Open contact options'}
        >
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.15 }}
              >
                <X className="w-6 h-6 text-white" />
              </motion.div>
            ) : (
              <motion.div
                key="chat"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.15 }}
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
