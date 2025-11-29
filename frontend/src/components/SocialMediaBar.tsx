import React, { useState, useEffect, useRef } from 'react';
import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter } from 'react-icons/fa';
import { SiThreads } from 'react-icons/si';

type SocialLabel = 'Facebook' | 'Instagram' | 'LinkedIn' | 'Twitter' | 'Threads';

const iconBgColors: Record<SocialLabel, string> = {
  Facebook: '#1877f2',
  Instagram:
    'linear-gradient(135deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
  LinkedIn: '#0077B5',
  Twitter: '#1DA1F2',
  Threads: '#000000',
};

const SMALL_ICON_SIZE = 40;
const ICON_SIZE = 24;
const TOUCH_RESET_MS = 350;

const socialLinks = [
  { icon: FaFacebook, href: 'https://www.facebook.com/nanoflows', label: 'Facebook' },
  { icon: FaInstagram, href: 'https://www.instagram.com/nanoflows/', label: 'Instagram' },
  { icon: FaLinkedin, href: 'https://www.linkedin.com/in/nanoflows', label: 'LinkedIn' },
  { icon: FaTwitter, href: 'https://x.com/NanoFlows', label: 'Twitter' },
  { icon: SiThreads, href: 'https://www.threads.com/@nanoflows', label: 'Threads' },
];

const SocialMediaBar: React.FC = () => {
  const [activeLabel, setActiveLabel] = useState<string | null>(null);
  const [canHover, setCanHover] = useState<boolean>(true);
  const touchResetTimers = useRef<Record<string, number | null>>({});

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

  return (
    <div
      className="social-bar"
      style={{ display: 'flex', gap: '0px', alignItems: 'center' }}
    >
      {socialLinks.map(({ icon: Icon, href, label }) => {
        const isActive = activeLabel === label;
        const transformOrigin = canHover ? 'left center' : 'right center';
        const transform = isActive ? 'scaleX(1.35)' : 'scaleX(1)';

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
              width: SMALL_ICON_SIZE,
              height: SMALL_ICON_SIZE,
              borderRadius: 0,
              margin: 0,
              padding: 0,
              background:
                label === 'Instagram'
                  ? iconBgColors.Instagram
                  : label === 'Threads'
                  ? iconBgColors.Threads
                  : iconBgColors[label as SocialLabel],
              transformOrigin,
              transition: 'transform 0.28s ease, filter 0.28s ease',
              willChange: 'transform',
              transform,
              filter: isActive ? 'brightness(1.06)' : 'brightness(1)',
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
            <Icon size={ICON_SIZE} color="white" />
          </a>
        );
      })}
    </div>
  );
};

export default SocialMediaBar;
