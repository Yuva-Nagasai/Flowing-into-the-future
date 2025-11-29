import React, { useState, useEffect, useRef } from 'react';
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaXTwitter } from 'react-icons/fa6';
import { SiThreads } from 'react-icons/si';
import { useTheme } from '../context/ThemeContext';

type SocialLabel = 'Facebook' | 'Instagram' | 'LinkedIn' | 'Twitter' | 'Threads';

interface SocialLink {
  icon: React.ElementType;
  href: string;
  label: SocialLabel;
  brandColor: string;
}

const socialLinks: SocialLink[] = [
  { icon: FaFacebookF, href: 'https://www.facebook.com/nanoflows', label: 'Facebook', brandColor: '#1877f2' },
  { icon: FaInstagram, href: 'https://www.instagram.com/nanoflows/', label: 'Instagram', brandColor: '#E4405F' },
  { icon: FaLinkedinIn, href: 'https://www.linkedin.com/in/nanoflows', label: 'LinkedIn', brandColor: '#0A66C2' },
  { icon: FaXTwitter, href: 'https://x.com/NanoFlows', label: 'Twitter', brandColor: '#000000' },
  { icon: SiThreads, href: 'https://www.threads.com/@nanoflows', label: 'Threads', brandColor: '#000000' },
];

const ICON_CONTAINER_SIZE = 42;
const ICON_SIZE = 18;
const TOUCH_RESET_MS = 350;

const SocialMediaBar: React.FC = () => {
  const { theme } = useTheme();
  const [activeLabel, setActiveLabel] = useState<string | null>(null);
  const [canHover, setCanHover] = useState<boolean>(true);
  const touchResetTimers = useRef<Record<string, number | null>>({});

  const isDark = theme === 'dark';

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

  const getIconStyle = (label: SocialLabel, isActive: boolean) => {
    const link = socialLinks.find(l => l.label === label);
    const brandColor = link?.brandColor || '#666';
    
    if (isActive) {
      return {
        background: brandColor,
        borderColor: brandColor,
        iconColor: '#ffffff',
      };
    }
    
    if (isDark) {
      return {
        background: 'rgba(255, 255, 255, 0.08)',
        borderColor: 'rgba(255, 255, 255, 0.15)',
        iconColor: 'rgba(255, 255, 255, 0.85)',
      };
    }
    
    return {
      background: 'rgba(0, 0, 0, 0.04)',
      borderColor: 'rgba(0, 0, 0, 0.12)',
      iconColor: 'rgba(0, 0, 0, 0.7)',
    };
  };

  return (
    <div
      className="social-bar"
      style={{ 
        display: 'flex', 
        flexDirection: 'column',
        gap: '8px', 
        alignItems: 'center',
        padding: '12px 8px',
        borderRadius: '0 12px 12px 0',
        background: isDark 
          ? 'rgba(15, 23, 42, 0.85)' 
          : 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(12px)',
        boxShadow: isDark
          ? '4px 0 24px rgba(0, 0, 0, 0.4)'
          : '4px 0 24px rgba(0, 0, 0, 0.08)',
        border: isDark
          ? '1px solid rgba(255, 255, 255, 0.08)'
          : '1px solid rgba(0, 0, 0, 0.06)',
        borderLeft: 'none',
      }}
    >
      {socialLinks.map(({ icon: Icon, href, label }) => {
        const isActive = activeLabel === label;
        const transformOrigin = canHover ? 'left center' : 'right center';
        const styles = getIconStyle(label, isActive);

        return (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            className="group"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: ICON_CONTAINER_SIZE,
              height: ICON_CONTAINER_SIZE,
              borderRadius: '10px',
              margin: 0,
              padding: 0,
              background: styles.background,
              border: `1.5px solid ${styles.borderColor}`,
              transformOrigin,
              transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
              willChange: 'transform, background, border-color',
              transform: isActive ? 'scale(1.1)' : 'scale(1)',
            }}
            onMouseEnter={() => {
              if (canHover) {
                setActiveLabel(label);
              }
            }}
            onMouseLeave={() => {
              if (canHover) {
                setActiveLabel(null);
              }
            }}
            onTouchStart={() => {
              if (!canHover) {
                triggerTouchActive(label);
              }
            }}
          >
            <Icon 
              size={ICON_SIZE} 
              style={{ 
                color: styles.iconColor,
                transition: 'color 0.25s ease',
              }} 
            />
          </a>
        );
      })}
    </div>
  );
};

export default SocialMediaBar;
