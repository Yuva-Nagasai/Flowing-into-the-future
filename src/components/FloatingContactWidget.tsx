import { useState, useCallback } from 'react';
import { FaWhatsapp, FaPhone, FaEnvelope } from 'react-icons/fa';
import { HiChatBubbleLeftRight } from 'react-icons/hi2';
import { IoClose } from 'react-icons/io5';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

interface ContactAction {
  id: string;
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
    id: 'whatsapp',
    label: 'WhatsApp',
    href: 'https://wa.me/918019358855',
    icon: FaWhatsapp,
    bgColor: '#25D366',
    hoverBg: '#128C7E',
    external: true,
  },
  {
    id: 'call',
    label: 'Call Us',
    href: 'tel:+918019358855',
    icon: FaPhone,
    bgColor: '#007AFF',
    hoverBg: '#0056CC',
  },
  {
    id: 'email',
    label: 'Email',
    href: 'mailto:nanoflowsvizag@gmail.com?subject=Project%20Enquiry',
    icon: FaEnvelope,
    bgColor: '#EA4335',
    hoverBg: '#C5221F',
  },
  {
    id: 'contact',
    label: 'Contact Form',
    href: '/#contact',
    icon: HiChatBubbleLeftRight,
    bgColor: '#6366F1',
    hoverBg: '#4F46E5',
    isRoute: true,
  },
];

const FloatingContactWidget = () => {
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const scrollToSection = useCallback((sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  }, []);

  const handleContactClick = useCallback((e: React.MouseEvent, action: ContactAction) => {
    if (action.isRoute && action.href.startsWith('/#')) {
      e.preventDefault();
      const sectionId = action.href.replace('/#', '');
      if (location.pathname !== '/') {
        navigate('/');
        setTimeout(() => {
          scrollToSection(sectionId);
        }, 300);
      } else {
        scrollToSection(sectionId);
      }
      setIsOpen(false);
    }
  }, [location.pathname, navigate, scrollToSection]);

  const toggleMenu = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  const isDark = theme === 'dark';

  return (
    <div className="fixed right-0 top-1/2 -translate-y-1/2 z-[9999]">
      <div className="relative flex flex-col items-end">
        {isOpen && (
          <div 
            className="fixed inset-0 z-[9998]"
            onClick={() => setIsOpen(false)}
          />
        )}

        <div
          className={`
            flex flex-col gap-0 overflow-hidden transition-all duration-300 ease-out z-[9999]
            ${isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full pointer-events-none'}
          `}
          style={{
            borderRadius: '12px 0 0 12px',
            boxShadow: isOpen ? '-4px 0 20px rgba(0,0,0,0.15)' : 'none',
          }}
        >
          {CONTACT_ACTIONS.map((action, index) => {
            const Icon = action.icon;
            const isHovered = hoveredItem === action.id;
            
            return action.isRoute ? (
              <button
                key={action.id}
                onClick={(e) => handleContactClick(e, action)}
                onMouseEnter={() => setHoveredItem(action.id)}
                onMouseLeave={() => setHoveredItem(null)}
                className="group relative flex items-center justify-end transition-all duration-200"
                style={{
                  backgroundColor: isHovered ? action.hoverBg : action.bgColor,
                  transitionDelay: isOpen ? `${index * 50}ms` : '0ms',
                }}
                aria-label={action.label}
              >
                <span 
                  className={`
                    whitespace-nowrap text-white text-sm font-medium pl-4 transition-all duration-200
                    ${isHovered ? 'opacity-100 max-w-32' : 'opacity-0 max-w-0'}
                  `}
                  style={{ overflow: 'hidden' }}
                >
                  {action.label}
                </span>
                <div className="flex items-center justify-center w-12 h-12">
                  <Icon className="w-5 h-5 text-white" />
                </div>
              </button>
            ) : (
              <a
                key={action.id}
                href={action.href}
                target={action.external ? '_blank' : undefined}
                rel={action.external ? 'noopener noreferrer' : undefined}
                onMouseEnter={() => setHoveredItem(action.id)}
                onMouseLeave={() => setHoveredItem(null)}
                className="group relative flex items-center justify-end transition-all duration-200"
                style={{
                  backgroundColor: isHovered ? action.hoverBg : action.bgColor,
                  transitionDelay: isOpen ? `${index * 50}ms` : '0ms',
                }}
                aria-label={action.label}
              >
                <span 
                  className={`
                    whitespace-nowrap text-white text-sm font-medium pl-4 transition-all duration-200
                    ${isHovered ? 'opacity-100 max-w-32' : 'opacity-0 max-w-0'}
                  `}
                  style={{ overflow: 'hidden' }}
                >
                  {action.label}
                </span>
                <div className="flex items-center justify-center w-12 h-12">
                  <Icon className="w-5 h-5 text-white" />
                </div>
              </a>
            );
          })}
        </div>

        <button
          type="button"
          onClick={toggleMenu}
          className={`
            relative w-12 h-12 flex items-center justify-center transition-all duration-300
            hover:scale-105 active:scale-95 z-[9999]
            ${isOpen ? 'rounded-full mr-2 mt-2' : 'rounded-l-xl'}
          `}
          style={{
            backgroundColor: isOpen 
              ? (isDark ? '#374151' : '#1F2937')
              : (isDark ? '#10B981' : '#3B82F6'),
            boxShadow: '-4px 0 15px rgba(0,0,0,0.2)',
          }}
          aria-label={isOpen ? 'Close contact menu' : 'Open contact menu'}
        >
          <div className="relative w-6 h-6">
            <HiChatBubbleLeftRight 
              className={`
                absolute inset-0 w-6 h-6 text-white transition-all duration-300
                ${isOpen ? 'opacity-0 rotate-90 scale-0' : 'opacity-100 rotate-0 scale-100'}
              `}
            />
            <IoClose 
              className={`
                absolute inset-0 w-6 h-6 text-white transition-all duration-300
                ${isOpen ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-0'}
              `}
            />
          </div>
          
          {!isOpen && (
            <span 
              className={`
                absolute -top-1 -left-1 w-3 h-3 rounded-full animate-pulse
                ${isDark ? 'bg-emerald-400' : 'bg-red-500'}
              `}
            />
          )}
        </button>
      </div>
    </div>
  );
};

export default FloatingContactWidget;
