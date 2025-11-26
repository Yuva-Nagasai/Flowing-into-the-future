import { useMemo, useState } from 'react';
import { FaWhatsapp, FaPhone, FaEnvelope } from 'react-icons/fa';
import { HiChatBubbleLeftRight } from 'react-icons/hi2';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

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
    label: 'Call NanoFlows',
    href: 'tel:+918019358855',
    icon: FaPhone,
    bgColor: '#007AFF',
    hoverBg: '#0056CC',
  },
  {
    label: 'Email NanoFlows',
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
  {
    label: 'WhatsApp',
    href: 'https://wa.me/918019358855',
    icon: FaWhatsapp,
    bgColor: '#25D366',
    hoverBg: '#128C7E',
    external: true,
  },
];

const FloatingContactWidget = () => {
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const scrollToSection = (sectionId: string) => {
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

  const buttonStyles = useMemo(
    () =>
      `w-11 h-11 rounded-full flex items-center justify-center shadow-lg transition-all duration-300
      focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 hover:scale-110
      ${theme === 'dark' ? 'ring-offset-[#01050f]' : 'ring-offset-white'}`,
    [theme]
  );

  const arcPositions = useMemo(
    () => [
      { x: 20, y: -70 },
      { x: 35, y: -25 },
      { x: 35, y: 22 },
      { x: 22, y: 70 },
    ],
    []
  );

  return (
    <div className="fixed top-1/2 left-4 -translate-y-1/2 z-[70]">
      <div className="relative w-40 h-[220px]">
        {CONTACT_ACTIONS.map((action, index) => {
          const Icon = action.icon;
          const { x, y } = arcPositions[index];
          
          if (action.isRoute) {
            return (
              <button
                key={action.label}
                onClick={(e) => handleContactClick(e, action.href)}
                className={`${buttonStyles} absolute left-1/2 top-1/2`}
                style={{
                  backgroundColor: action.bgColor,
                  transform: isOpen
                    ? `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) scale(1)`
                    : 'translate(-50%, -50%) scale(0)',
                  transitionDelay: `${index * 60}ms`,
                  boxShadow: `0 4px 15px ${action.bgColor}50`,
                }}
                aria-label={action.label}
              >
                <Icon className="w-5 h-5 text-white" />
              </button>
            );
          }

          return (
            <a
              key={action.label}
              href={action.href}
              target={action.external ? '_blank' : undefined}
              rel={action.external ? 'noopener noreferrer' : undefined}
              className={`${buttonStyles} absolute left-1/2 top-1/2`}
              style={{
                backgroundColor: action.bgColor,
                transform: isOpen
                  ? `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) scale(1)`
                  : 'translate(-50%, -50%) scale(0)',
                transitionDelay: `${index * 60}ms`,
                boxShadow: `0 4px 15px ${action.bgColor}50`,
              }}
              aria-label={action.label}
            >
              <Icon className="w-5 h-5 text-white" />
            </a>
          );
        })}

        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className={`${buttonStyles} absolute left-0 top-1/2 -translate-y-1/2 ${
            theme === 'dark'
              ? 'bg-gradient-to-br from-emerald-400 to-cyan-500'
              : 'bg-gradient-to-br from-blue-500 to-indigo-600'
          } hover:brightness-110`}
          style={{
            boxShadow: theme === 'dark' 
              ? '0 4px 20px rgba(16, 185, 129, 0.4)' 
              : '0 4px 20px rgba(59, 130, 246, 0.4)',
          }}
          aria-label="Toggle quick contact options"
        >
          <HiChatBubbleLeftRight 
            className={`w-5 h-5 text-white transition-transform duration-300 ${isOpen ? 'rotate-90' : ''}`} 
          />
        </button>
      </div>
    </div>
  );
};

export default FloatingContactWidget;
