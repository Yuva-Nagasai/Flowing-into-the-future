import React, { useState, useEffect, useRef } from 'react';
import { FaWhatsapp, FaPhone, FaEnvelope } from 'react-icons/fa';
import { HiChatBubbleLeftRight } from 'react-icons/hi2';
import { useNavigate, useLocation } from 'react-router-dom';

type ContactLabel = 'WhatsApp' | 'Phone' | 'Email' | 'Message';

const iconBgColors: Record<ContactLabel, string> = {
  WhatsApp: '#25D366',
  Phone: '#007AFF',
  Email: '#EA4335',
  Message: '#6366F1',
};

const SMALL_ICON_SIZE = 40;
const ICON_SIZE = 24;
const TOUCH_RESET_MS = 350;

const contactLinks = [
  { icon: FaWhatsapp, href: 'https://wa.me/918019358855', label: 'WhatsApp' as ContactLabel, external: true },
  { icon: FaPhone, href: 'tel:+918019358855', label: 'Phone' as ContactLabel },
  { icon: FaEnvelope, href: 'mailto:nanoflowsvizag@gmail.com?subject=Project%20Enquiry', label: 'Email' as ContactLabel },
  { icon: HiChatBubbleLeftRight, href: '/#contact', label: 'Message' as ContactLabel, isRoute: true },
];

const ContactBar: React.FC = () => {
  const [activeLabel, setActiveLabel] = useState<string | null>(null);
  const [canHover, setCanHover] = useState<boolean>(true);
  const touchResetTimers = useRef<Record<string, number | null>>({});
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const mq = typeof window !== 'undefined' && window.matchMedia
      ? window.matchMedia('(hover: hover) and (pointer: fine)')
      : null;

    const setFromQuery = () => {
      setCanHover(!!mq?.matches);
    };

    setFromQuery();
    if (mq && mq.addEventListener) {
      mq.addEventListener('change', setFromQuery);
      return () => mq.removeEventListener('change', setFromQuery);
    } else if (mq && mq.addListener) {
      mq.addListener(setFromQuery);
      return () => mq.removeListener(setFromQuery);
    }
    return;
  }, []);

  const triggerTouchActive = (label: string) => {
    if (touchResetTimers.current[label]) {
      window.clearTimeout(touchResetTimers.current[label] as number);
    }
    setActiveLabel(label);
    touchResetTimers.current[label] = window.setTimeout(() => {
      setActiveLabel((cur) => (cur === label ? null : cur));
      touchResetTimers.current[label] = null;
    }, TOUCH_RESET_MS);
  };

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

  const handleClick = (e: React.MouseEvent, href: string, isRoute?: boolean) => {
    if (isRoute && href.startsWith('/#')) {
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
    }
  };

  return (
    <div
      className="contact-bar"
      style={{ display: 'flex', flexDirection: 'column', gap: '0px', alignItems: 'center' }}
    >
      {contactLinks.map(({ icon: Icon, href, label, external, isRoute }) => {
        const isActive = activeLabel === label;
        const transformOrigin = canHover ? 'right center' : 'left center';
        const transform = isActive ? 'scaleX(1.35)' : 'scaleX(1)';

        const commonProps = {
          key: label,
          'aria-label': label,
          className: 'group',
          style: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: SMALL_ICON_SIZE,
            height: SMALL_ICON_SIZE,
            borderRadius: 0,
            margin: 0,
            padding: 0,
            background: iconBgColors[label],
            transformOrigin,
            transition: 'transform 0.28s ease, filter 0.28s ease',
            willChange: 'transform' as const,
            transform,
            filter: isActive ? 'brightness(1.06)' : 'brightness(1)',
          },
          onMouseEnter: () => {
            if (canHover) {
              setActiveLabel(label);
            }
          },
          onMouseLeave: () => {
            if (canHover) {
              setActiveLabel(null);
            }
          },
          onTouchStart: () => {
            if (!canHover) {
              triggerTouchActive(label);
            }
          },
        };

        if (isRoute) {
          return (
            <button
              {...commonProps}
              onClick={(e) => handleClick(e as any, href, isRoute)}
            >
              <Icon size={ICON_SIZE} color="white" />
            </button>
          );
        }

        return (
          <a
            {...commonProps}
            href={href}
            target={external ? '_blank' : undefined}
            rel={external ? 'noopener noreferrer' : undefined}
          >
            <Icon size={ICON_SIZE} color="white" />
          </a>
        );
      })}
    </div>
  );
};

export default ContactBar;
