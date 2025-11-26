import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, Mail, MessageCircle, X } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

interface ContactItem {
  id: string;
  label: string;
  href: string;
  icon: React.ReactNode;
  brandColor: string;
  hoverColor: string;
  external?: boolean;
  isRoute?: boolean;
}

const FloatingContactWidget = () => {
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isDark = theme === 'dark';

  const contactItems: ContactItem[] = [
    {
      id: 'whatsapp',
      label: 'WhatsApp',
      href: 'https://wa.me/918019358855',
      icon: <FaWhatsapp className="w-5 h-5" />,
      brandColor: '#25D366',
      hoverColor: '#128C7E',
      external: true,
    },
    {
      id: 'phone',
      label: 'Call Us',
      href: 'tel:+918019358855',
      icon: <Phone className="w-5 h-5" />,
      brandColor: isDark ? '#00F0FF' : '#007BFF',
      hoverColor: isDark ? '#00E881' : '#0056b3',
    },
    {
      id: 'email',
      label: 'Email',
      href: 'mailto:nanoflowsvizag@gmail.com?subject=Project%20Enquiry',
      icon: <Mail className="w-5 h-5" />,
      brandColor: isDark ? '#00E881' : '#EB3232',
      hoverColor: isDark ? '#00F0FF' : '#c82333',
    },
    {
      id: 'contact',
      label: 'Contact Form',
      href: '/#contact',
      icon: <MessageCircle className="w-5 h-5" />,
      brandColor: isDark ? '#00F0FF' : '#007BFF',
      hoverColor: isDark ? '#00E881' : '#0056b3',
      isRoute: true,
    },
  ];

  const scrollToSection = useCallback((sectionId: string) => {
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
  }, []);

  const handleContactClick = useCallback(
    (e: React.MouseEvent, item: ContactItem) => {
      if (item.isRoute && item.href.startsWith('/#')) {
        e.preventDefault();
        const sectionId = item.href.replace('/#', '');
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
    },
    [location.pathname, navigate, scrollToSection]
  );

  const toggleOpen = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

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
      x: 60,
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
      x: 40,
      scale: 0.8,
      transition: {
        duration: 0.2,
      },
    },
  };

  const fabVariants = {
    closed: {
      rotate: 0,
      scale: 1,
    },
    open: {
      rotate: 180,
      scale: 1.1,
    },
  };

  return (
    <div className="fixed right-0 top-1/2 -translate-y-1/2 z-[70] flex items-center">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="flex flex-col gap-3 mr-3"
          >
            {contactItems.map((item) => (
              <motion.div
                key={item.id}
                variants={itemVariants}
                className="relative group"
              >
                {item.isRoute ? (
                  <button
                    onClick={(e) => handleContactClick(e, item)}
                    className={`
                      flex items-center gap-3 px-4 py-3 rounded-xl
                      backdrop-blur-md transition-all duration-300
                      ${isDark 
                        ? 'bg-[#071021]/90 border border-[#00F0FF]/20 hover:border-[#00F0FF]/60' 
                        : 'bg-white/95 border border-gray-200 hover:border-gray-400 shadow-lg'
                      }
                      hover:scale-105 hover:shadow-xl
                    `}
                    style={{
                      boxShadow: `0 4px 20px ${item.brandColor}30`,
                    }}
                  >
                    <span
                      className="flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300"
                      style={{ 
                        backgroundColor: `${item.brandColor}20`,
                        color: item.brandColor,
                      }}
                    >
                      {item.icon}
                    </span>
                    <span className={`font-medium text-sm whitespace-nowrap ${isDark ? 'text-white' : 'text-gray-800'}`}>
                      {item.label}
                    </span>
                  </button>
                ) : (
                  <a
                    href={item.href}
                    target={item.external ? '_blank' : undefined}
                    rel={item.external ? 'noopener noreferrer' : undefined}
                    className={`
                      flex items-center gap-3 px-4 py-3 rounded-xl
                      backdrop-blur-md transition-all duration-300
                      ${isDark 
                        ? 'bg-[#071021]/90 border border-[#00F0FF]/20 hover:border-[#00F0FF]/60' 
                        : 'bg-white/95 border border-gray-200 hover:border-gray-400 shadow-lg'
                      }
                      hover:scale-105 hover:shadow-xl
                    `}
                    style={{
                      boxShadow: `0 4px 20px ${item.brandColor}30`,
                    }}
                  >
                    <span
                      className="flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300"
                      style={{ 
                        backgroundColor: `${item.brandColor}20`,
                        color: item.brandColor,
                      }}
                    >
                      {item.icon}
                    </span>
                    <span className={`font-medium text-sm whitespace-nowrap ${isDark ? 'text-white' : 'text-gray-800'}`}>
                      {item.label}
                    </span>
                  </a>
                )}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={toggleOpen}
        variants={fabVariants}
        animate={isOpen ? 'open' : 'closed'}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className={`
          relative flex items-center justify-center
          w-16 h-20 rounded-l-2xl
          transition-all duration-300
          focus:outline-none focus-visible:ring-4
          ${isDark 
            ? 'bg-gradient-to-b from-[#00F0FF] to-[#00E881] text-[#071021] focus-visible:ring-[#00F0FF]/50' 
            : 'bg-gradient-to-b from-[#007BFF] to-[#0056b3] text-white focus-visible:ring-[#007BFF]/50'
          }
          shadow-[-8px_0_30px_rgba(0,0,0,0.25)]
          hover:shadow-[-12px_0_40px_rgba(0,0,0,0.35)]
        `}
        aria-label={isOpen ? 'Close contact options' : 'Open contact options'}
      >
        <motion.div
          className="absolute inset-0 rounded-l-2xl overflow-hidden"
        >
          <motion.div
            className="absolute inset-0"
            animate={{
              background: isDark 
                ? [
                    'linear-gradient(180deg, rgba(0,240,255,0.1) 0%, rgba(0,232,129,0.1) 100%)',
                    'linear-gradient(180deg, rgba(0,232,129,0.1) 0%, rgba(0,240,255,0.1) 100%)',
                    'linear-gradient(180deg, rgba(0,240,255,0.1) 0%, rgba(0,232,129,0.1) 100%)',
                  ]
                : [
                    'linear-gradient(180deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.05) 100%)',
                    'linear-gradient(180deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.2) 100%)',
                    'linear-gradient(180deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.05) 100%)',
                  ],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </motion.div>
        
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="relative z-10"
        >
          {isOpen ? (
            <X className="w-7 h-7" strokeWidth={2.5} />
          ) : (
            <MessageCircle className="w-7 h-7" strokeWidth={2} />
          )}
        </motion.div>

        {!isOpen && (
          <>
            <motion.div
              className={`absolute -left-1 top-1/2 -translate-y-1/2 w-1.5 h-10 rounded-full ${isDark ? 'bg-[#00F0FF]' : 'bg-white/80'}`}
              animate={{
                opacity: [0.4, 1, 0.4],
                scaleY: [0.7, 1, 0.7],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
            <motion.span
              className={`absolute -bottom-1 left-1/2 -translate-x-1/2 text-[10px] font-bold tracking-wide ${isDark ? 'text-[#071021]' : 'text-white'}`}
              style={{ writingMode: 'horizontal-tb' }}
            >
              Chat
            </motion.span>
          </>
        )}
      </motion.button>
    </div>
  );
};

export default FloatingContactWidget;
