import { FaPhoneAlt, FaWhatsapp } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';
import { RiQrCodeLine } from 'react-icons/ri';
import { BsMicrosoftTeams } from 'react-icons/bs';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCallback } from 'react';

interface ContactButton {
  id: string;
  label: string;
  href: string;
  icon: React.ElementType;
  bgGradient: string;
  shadowColor: string;
  external?: boolean;
  isRoute?: boolean;
}

const CONTACT_BUTTONS: ContactButton[] = [
  {
    id: 'phone',
    label: 'Call Us',
    href: 'tel:+918019358855',
    icon: FaPhoneAlt,
    bgGradient: 'linear-gradient(135deg, #FF512F 0%, #F09819 100%)',
    shadowColor: 'rgba(255, 81, 47, 0.4)',
  },
  {
    id: 'email',
    label: 'Email Us',
    href: 'mailto:nanoflowsvizag@gmail.com?subject=Project%20Enquiry',
    icon: MdEmail,
    bgGradient: 'linear-gradient(135deg, #FF8C33 0%, #FFB347 100%)',
    shadowColor: 'rgba(255, 140, 51, 0.4)',
  },
  {
    id: 'qrcode',
    label: 'Contact Form',
    href: '/#contact',
    icon: RiQrCodeLine,
    bgGradient: 'linear-gradient(135deg, #FF9A44 0%, #FFB74D 100%)',
    shadowColor: 'rgba(255, 154, 68, 0.4)',
    isRoute: true,
  },
  {
    id: 'teams',
    label: 'Microsoft Teams',
    href: 'https://teams.microsoft.com/l/chat/0/0?users=nanoflowsvizag@gmail.com',
    icon: BsMicrosoftTeams,
    bgGradient: 'linear-gradient(135deg, #5558AF 0%, #6264A7 100%)',
    shadowColor: 'rgba(98, 100, 167, 0.4)',
    external: true,
  },
  {
    id: 'whatsapp',
    label: 'WhatsApp',
    href: 'https://wa.me/918019358855',
    icon: FaWhatsapp,
    bgGradient: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
    shadowColor: 'rgba(37, 211, 102, 0.4)',
    external: true,
  },
];

const FloatingContactWidget = () => {
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

  const handleClick = useCallback((e: React.MouseEvent, button: ContactButton) => {
    if (button.isRoute && button.href.startsWith('/#')) {
      e.preventDefault();
      const sectionId = button.href.replace('/#', '');
      if (location.pathname !== '/') {
        navigate('/');
        setTimeout(() => {
          scrollToSection(sectionId);
        }, 300);
      } else {
        scrollToSection(sectionId);
      }
    }
  }, [location.pathname, navigate, scrollToSection]);

  return (
    <div 
      className="fixed left-0 top-1/2 -translate-y-1/2 z-[9999] hidden lg:flex flex-col gap-3"
      style={{ paddingLeft: 'clamp(8px, 1.5vw, 24px)' }}
    >
      {CONTACT_BUTTONS.map((button, index) => {
        const Icon = button.icon;
        const staggerOffset = index * 8;
        
        return button.isRoute ? (
          <button
            key={button.id}
            onClick={(e) => handleClick(e, button)}
            className="group relative flex items-center justify-center w-14 h-14 rounded-full transition-all duration-300 hover:scale-110 hover:translate-x-2 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2"
            style={{
              background: button.bgGradient,
              boxShadow: `0 8px 24px ${button.shadowColor}, 0 4px 8px rgba(0,0,0,0.1)`,
              transform: `translateX(${staggerOffset}px)`,
            }}
            aria-label={button.label}
          >
            <Icon className="w-6 h-6 text-white drop-shadow-sm" />
            <span className="absolute left-full ml-3 px-3 py-1.5 bg-gray-900 text-white text-sm font-medium rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap shadow-lg">
              {button.label}
              <span className="absolute right-full top-1/2 -translate-y-1/2 border-8 border-transparent border-r-gray-900" />
            </span>
          </button>
        ) : (
          <a
            key={button.id}
            href={button.href}
            target={button.external ? '_blank' : undefined}
            rel={button.external ? 'noopener noreferrer' : undefined}
            className="group relative flex items-center justify-center w-14 h-14 rounded-full transition-all duration-300 hover:scale-110 hover:translate-x-2 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2"
            style={{
              background: button.bgGradient,
              boxShadow: `0 8px 24px ${button.shadowColor}, 0 4px 8px rgba(0,0,0,0.1)`,
              transform: `translateX(${staggerOffset}px)`,
            }}
            aria-label={button.label}
          >
            <Icon className="w-6 h-6 text-white drop-shadow-sm" />
            <span className="absolute left-full ml-3 px-3 py-1.5 bg-gray-900 text-white text-sm font-medium rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap shadow-lg">
              {button.label}
              <span className="absolute right-full top-1/2 -translate-y-1/2 border-8 border-transparent border-r-gray-900" />
            </span>
          </a>
        );
      })}
    </div>
  );
};

export default FloatingContactWidget;
