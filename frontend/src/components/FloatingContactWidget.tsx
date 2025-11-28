import { useMemo, useState } from 'react';
import { FaWhatsapp, FaPhone, FaEnvelope } from 'react-icons/fa';
import { HiChatBubbleLeftRight } from 'react-icons/hi2';
import { useNavigate, useLocation } from 'react-router-dom';

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

  const buttonStyles = useMemo(
    () =>
      `w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-transform duration-300
       focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500
       hover:scale-110`,
    []
  );

  // Positions arranged in a subtle circular arc above the button
  const arcPositions = useMemo(
    () => [
      { x: 0, y: -70 },
      { x: 60, y: -50 },
      { x: 70, y: 0 },
      { x: 60, y: 50 },
    ],
    []
  );

  return (
    <div
      className="fixed left-6 top-1/2 -translate-y-1/2 transform z-50"
      aria-label="Floating contact widget"
    >
      <div className="relative w-16 h-16">
        {CONTACT_ACTIONS.map((action, index) => {
          const Icon = action.icon;
          const { x, y } = arcPositions[index];

          if (action.isRoute) {
            return (
              <button
                key={action.label}
                onClick={(e) => handleContactClick(e, action.href)}
                className={buttonStyles}
                style={{
                  backgroundColor: action.bgColor,
                  position: 'absolute',
                  bottom: '50%',
                  right: '50%',
                  transform: isOpen
                    ? `translate(${x}px, ${y}px) scale(1)`
                    : 'translate(50%, 50%) scale(0)',
                  transitionProperty: 'transform',
                  transitionDuration: '300ms',
                  transitionDelay: `${index * 75}ms`,
                  boxShadow: `0 6px 20px ${action.bgColor}80`,
                }}
                aria-label={action.label}
                title={action.label}
              >
                <Icon className="w-6 h-6 text-white" />
              </button>
            );
          }

          return (
            <a
              key={action.label}
              href={action.href}
              target={action.external ? '_blank' : undefined}
              rel={action.external ? 'noopener noreferrer' : undefined}
              className={buttonStyles}
              style={{
                backgroundColor: action.bgColor,
                position: 'absolute',
                bottom: '50%',
                right: '50%',
                transform: isOpen
                  ? `translate(${x}px, ${y}px) scale(1)`
                  : 'translate(50%, 50%) scale(0)',
                transitionProperty: 'transform',
                transitionDuration: '300ms',
                transitionDelay: `${index * 75}ms`,
                boxShadow: `0 6px 20px ${action.bgColor}80`,
              }}
              aria-label={action.label}
              title={action.label}
            >
              <Icon className="w-6 h-6 text-white" />
            </a>
          );
        })}
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className={`${buttonStyles} bg-gradient-to-br from-blue-600 to-indigo-700 hover:brightness-110`}
          aria-expanded={isOpen}
          aria-controls="floating-contact-options"
          aria-label="Toggle contact options"
          style={{
            boxShadow: '0 6px 24px rgba(59, 130, 246, 0.5)',
          }}
        >
          <HiChatBubbleLeftRight
            className={`w-6 h-6 text-white transition-transform duration-300 ${
              isOpen ? 'rotate-45' : 'rotate-0'
            }`}
          />
        </button>
      </div>
    </div>
  );
};

export default FloatingContactWidget;
