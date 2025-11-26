import { useMemo, useState } from 'react';
import { PhoneCall, Mail, Contact, QrCode } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

type ThemedClass = {
  light: string;
  dark: string;
};

interface ContactAction {
  label: string;
  href: string;
  icon?: typeof PhoneCall;
  iconComponent?: typeof FaWhatsapp;
  classes: ThemedClass;
  external?: boolean;
  isRoute?: boolean;
}

const CONTACT_ACTIONS: ContactAction[] = [
  {
    label: 'Call NanoFlows',
    href: 'tel:+918019358855',
    icon: PhoneCall,
    classes: {
      light: 'bg-gradient-to-br from-accent-red to-accent-blue text-white shadow-[0_8px_18px_rgba(244,63,94,0.35)]',
      dark: 'bg-gradient-to-br from-electric-green to-electric-blue text-[#041226] shadow-[0_8px_18px_rgba(14,255,197,0.45)]'
    }
  },
  {
    label: 'Email NanoFlows',
    href: 'mailto:nanoflowsvizag@gmail.com?subject=Project%20Enquiry',
    icon: Mail,
    classes: {
      light: 'bg-white text-gray-900 border border-gray-200 shadow-[0_10px_24px_rgba(37,99,235,0.15)]',
      dark: 'bg-[#0b1430] text-white border border-electric-blue/30 shadow-[0_10px_24px_rgba(16,185,129,0.25)]'
    }
  },
  {
    label: 'Contact Form',
    href: '/#contact',
    icon: Contact,
    classes: {
      light: 'bg-accent-blue text-white shadow-[0_8px_18px_rgba(37,99,235,0.35)]',
      dark: 'bg-electric-blue text-black shadow-[0_8px_18px_rgba(59,130,246,0.45)]'
    },
    isRoute: true,
  },
  {
    label: 'WhatsApp',
    href: 'https://wa.me/918019358855',
    iconComponent: FaWhatsapp,
    classes: {
      light: 'bg-gradient-to-br from-emerald-400 to-emerald-500 text-white shadow-[0_10px_22px_rgba(16,185,129,0.35)]',
      dark: 'bg-gradient-to-br from-emerald-300 to-emerald-500 text-black shadow-[0_10px_22px_rgba(16,185,129,0.45)]'
    },
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
      `w-11 h-11 rounded-full flex items-center justify-center shadow-md transition-all duration-300
      focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
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
          const IconComponent = action.iconComponent;
          const { x, y } = arcPositions[index];
          const themedClasses = action.classes[theme];
          
          const buttonContent = Icon ? (
            <Icon className="w-4 h-4" />
          ) : IconComponent ? (
            <IconComponent className="w-4 h-4" />
          ) : null;

          if (action.isRoute) {
            return (
              <button
                key={action.label}
                onClick={(e) => handleContactClick(e, action.href)}
                className={`${buttonStyles} absolute left-1/2 top-1/2 ${themedClasses}`}
                style={{
                  transform: isOpen
                    ? `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) scale(1)`
                    : 'translate(-50%, -50%) scale(0)',
                  transitionDelay: `${index * 60}ms`,
                }}
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
              className={`${buttonStyles} absolute left-1/2 top-1/2 ${themedClasses}`}
              style={{
                transform: isOpen
                  ? `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) scale(1)`
                  : 'translate(-50%, -50%) scale(0)',
                transitionDelay: `${index * 60}ms`,
              }}
              aria-label={action.label}
            >
              {buttonContent}
            </a>
          );
        })}

        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className={`${buttonStyles} absolute left-0 top-1/2 -translate-y-1/2 ${
            theme === 'dark'
              ? 'bg-gradient-to-br from-electric-green to-electric-blue text-[#041226]'
              : 'bg-gradient-to-br from-accent-red to-accent-blue text-white'
          } hover:brightness-110 shadow-[0_12px_24px_rgba(0,0,0,0.25)]`}
          aria-label="Toggle quick contact options"
        >
          <QrCode className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default FloatingContactWidget;

