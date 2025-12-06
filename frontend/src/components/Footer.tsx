import { useEffect, useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { Link } from 'react-router-dom';
import { ArrowUp } from 'lucide-react';
import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter } from 'react-icons/fa';
import { SiThreads } from 'react-icons/si';

type FooterVariant = 'default' | 'elearning' | 'ai-tools' | 'shop';

type FooterLink = {
  label: string;
  path?: string;
  href?: string;
  external?: boolean;
  scrollTarget?: string;
};

type FooterSection = {
  title: string;
  links: FooterLink[];
};

const footerVariantConfig: Record<FooterVariant, { description: string; title: string; subtitle: string; sections: FooterSection[] }> = {
  default: {
    title: 'NanoFlows',
    subtitle: 'Innovation Studio',
    description:
      'Pioneering the future of digital innovation through AI-powered solutions and seamless user experiences. Flowing into the future, one innovation at a time.',
    sections: [
      {
        title: 'Products',
        links: [
          { label: 'AI Solutions', path: '/products/ai-solutions' },
          { label: 'Cloud Platform', path: '/products/cloud-platform' },
          { label: 'Analytics Tools', path: '/products/analytics-tools' },
          { label: 'Mobile Apps', path: '/products/mobile-apps' },
          { label: 'API Services', path: '/products/api-services' },
        ],
      },
      {
        title: 'Company',
        links: [
          { label: 'About Us', path: '/about' },
          { label: 'Careers', path: '/careers' },
          { label: 'Services', path: '/services' },
          { label: 'Contact us', path: '/contact' },
          { label: 'Partners', path: '/about' },
        ],
      },
      {
        title: 'Resources',
        links: [
          { label: 'Documentation', href: '/docs' },
          { label: 'API Reference', href: '/api-reference' },
          { label: 'Case Studies', path: '/case-studies' },
          { label: 'Webinars', path: '/events' },
          { label: 'Support Center', path: '/contact' },
        ],
      },
      {
        title: 'Legal',
        links: [
          { label: 'Privacy Policy', path: '/legal/privacy-policy' },
          { label: 'Terms of Service', path: '/legal/terms-of-service' },
          { label: 'Cookie Policy', path: '/legal/cookie-policy' },
          { label: 'Security', path: '/legal/security' },
          { label: 'Compliance', path: '/legal/compliance' },
        ],
      },
    ],
  },
  'elearning': {
    title: 'NanoFlows Academy',
    subtitle: 'World-Class Learning',
    description:
      'Empowering learners worldwide with AI-powered curriculum, expert mentors, and real-world projects that accelerate careers and drive measurable impact.',
    sections: [
      {
        title: 'Academy',
        links: [
          { label: 'Home', path: '/elearning' },
          { label: 'Courses', path: '/elearning/courses' },
          { label: 'Masterclass', path: '/elearning/masterclass' },
          { label: 'Summit', path: '/elearning/mahakumbh' },
          { label: 'Freebies', path: '/elearning/freebies' },
        ],
      },
      {
        title: 'Programs',
        links: [
          { label: 'Executive Programs', path: '/academy' },
          { label: 'Bootcamps', path: '/elearning/masterclass' },
          { label: 'Corporate Learning', path: '/services' },
          { label: 'Mentor Support', path: '/elearning/about' },
          { label: 'Community', path: '/elearning/blog' },
        ],
      },
      {
        title: 'Support',
        links: [
          { label: 'Documentation', path: '/docs' },
          { label: 'Tutorials', path: '/elearning/about' },
          { label: 'Help Center', path: '/contact' },
          { label: 'FAQ', path: '/elearning/about#faq' },
          { label: 'Contact us', path: '/contact' },
        ],
      },
      {
        title: 'Legal',
        links: [
          { label: 'Privacy Policy', path: '/legal/privacy-policy' },
          { label: 'Terms of Service', path: '/legal/terms-of-service' },
          { label: 'Cookie Policy', path: '/legal/cookie-policy' },
          { label: 'Security', path: '/legal/security' },
          { label: 'Compliance', path: '/legal/compliance' },
        ],
      },
    ],
  },
  'ai-tools': {
    title: 'NanoFlows AI Tools',
    subtitle: 'Curated Intelligence',
    description:
      'Discover curated AI tools that supercharge creativity, code, and automation. Handpicked for builders who demand high-impact productivity every day.',
    sections: [
      {
        title: 'AI Tools',
        links: [
          { label: 'Explore Tools', path: '/ai-tools/explore' },
          { label: 'Text & Writing', path: '/ai-tools/explore?category=text' },
          { label: 'Image Generation', path: '/ai-tools/explore?category=image' },
          { label: 'Code Assistant', path: '/ai-tools/explore?category=code' },
          { label: 'Audio & Voice', path: '/ai-tools/explore?category=audio' },
        ],
      },
      {
        title: 'Platform',
        links: [
          { label: 'Home', path: '/ai-tools' },
          { label: 'Explore Tools', path: '/ai-tools/explore' },
          { label: 'About', path: '/ai-tools/about' },
          { label: 'Contact', path: '/ai-tools/contact' },
        ],
      },
      {
        title: 'Resources',
        links: [
          { label: 'Documentation', href: '/docs' },
          { label: 'API Reference', href: '/api-reference' },
          { label: 'Tutorials', path: '/academy' },
          { label: 'Blog', path: '/ai-tools/blog' },
          { label: 'Support', path: '/contact' },
        ],
      },
      {
        title: 'Legal',
        links: [
          { label: 'Privacy Policy', path: '/legal/privacy-policy' },
          { label: 'Terms', path: '/legal/terms-of-service' },
          { label: 'Cookie Policy', path: '/legal/cookie-policy' },
          { label: 'Security', path: '/legal/security' },
          { label: 'Compliance', path: '/legal/compliance' },
        ],
      },
    ],
  },
  shop: {
    title: 'Digital Hub',
    subtitle: 'Premium Digital Products',
    description:
      'Discover professionally crafted digital products, templates, and assets designed to accelerate your projects and business growth.',
    sections: [
      {
        title: 'Digital Hub',
        links: [
          { label: 'Home', path: '/shop' },
          { label: 'Products', path: '/shop/products' },
          { label: 'Deals', path: '/shop/deals' },
          { label: 'About', path: '/shop/about' },
          { label: 'Contact', path: '/shop/contact' },
        ],
      },
      {
        title: 'Account',
        links: [
          { label: 'Login', path: '/shop/login' },
          { label: 'Register', path: '/shop/register' },
          { label: 'My Orders', path: '/shop/orders' },
          { label: 'Wishlist', path: '/shop/wishlist' },
          { label: 'Cart', path: '/shop/cart' },
        ],
      },
      {
        title: 'Support',
        links: [
          { label: 'Help Center', path: '/contact' },
          { label: 'Refund Policy', path: '/legal/refund-policy' },
          { label: 'Shipping & Delivery', path: '/shop/about' },
          { label: 'FAQs', path: '/shop/about' },
          { label: 'Order Status', path: '/shop/orders' },
        ],
      },
      {
        title: 'Legal',
        links: [
          { label: 'Privacy Policy', path: '/legal/privacy-policy' },
          { label: 'Terms of Service', path: '/legal/terms-of-service' },
          { label: 'Cookie Policy', path: '/legal/cookie-policy' },
          { label: 'Security', path: '/legal/security' },
          { label: 'Compliance', path: '/legal/compliance' },
        ],
      },
    ],
  },
};

const socialLinks = [
  { icon: FaFacebook, href: 'https://www.facebook.com/nanoflows', label: 'Facebook', color: '#1877F2' },
  { icon: FaInstagram, href: 'https://www.instagram.com/nanoflows/', label: 'Instagram', color: '#E4405F' },
  { icon: FaLinkedin, href: 'https://www.linkedin.com/in/nanoflows', label: 'LinkedIn', color: '#0077B5' },
  { icon: FaTwitter, href: 'https://x.com/NanoFlows', label: 'Twitter', color: '#1DA1F2' },
  { icon: SiThreads, href: 'https://www.threads.com/@nanoflows', label: 'Threads', color: '#000000' },
];

interface FooterProps {
  variant?: FooterVariant;
}

const Footer = ({ variant = 'default' }: FooterProps) => {
  const { theme } = useTheme();
  const [showScrollTop, setShowScrollTop] = useState(false);
  const { title, subtitle, description, sections } = footerVariantConfig[variant];

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 600);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80; // Offset for sticky header
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const renderLink = (link: FooterLink) => {
    const commonClasses = `text-sm font-exo transition-all duration-300 hover:translate-x-1 inline-block focus:outline-none focus:underline ${
      theme === 'dark' ? 'text-gray-100 hover:text-electric-green' : 'text-black hover:text-accent-red'
    }`;

    if (link.scrollTarget) {
      return (
        <button
          onClick={() => scrollToSection(link.scrollTarget!)}
          className={`${commonClasses} text-left`}
        >
          {link.label}
        </button>
      );
    }

    if (link.href) {
      return (
        <a
          href={link.href}
          target={link.external ? '_blank' : undefined}
          rel={link.external ? 'noopener noreferrer' : undefined}
          className={commonClasses}
        >
          {link.label}
        </a>
      );
    }

    if (link.path) {
      return (
        <Link to={link.path} className={commonClasses}>
          {link.label}
        </Link>
      );
    }

    return <span className={commonClasses}>{link.label}</span>;
  };

  // Use a single background style for all variants so that
  // the shop footer visually matches the AI tools footer.
  const bgClass =
    theme === 'dark'
      ? 'bg-black border-t border-electric-blue/20'
      : 'bg-gray-50 border-t border-gray-200';

  return (
    <footer className={`relative overflow-hidden ${bgClass}`} role="contentinfo">
      <div
        className={`absolute inset-0 ${
          theme === 'dark' ? 'gradient-mesh' : 'gradient-mesh-light'
        }`}
        aria-hidden="true"
      />

      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-8 mb-8 sm:mb-12">
          <div className="lg:col-span-2">
            <div className="flex items-center justify-center lg:justify-start mb-4">
              <img
                src="/NanoFlows-LOGO-removebg-preview.png"
                alt="Nano Flows Logo"
                className="h-28 w-28 sm:h-36 sm:w-36 object-contain"
                loading="lazy"
              />
            </div>
            <div className="text-center lg:text-left">
              <h3 className={`text-2xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-black'}`}>{subtitle}</h3>
            </div>
            <p className={`text-sm font-exo leading-relaxed mb-6 max-w-sm mx-auto lg:mx-0 ${theme === 'dark' ? 'text-gray-100' : 'text-black'}`}>
              {description}
            </p>
            <div className="flex space-x-4 justify-center lg:justify-start">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Follow us on ${social.label}`}
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                      theme === 'dark' ? 'focus:ring-electric-blue' : 'focus:ring-accent-red'
                    }`}
                    style={{
                      backgroundColor: social.label === 'Instagram' ? 'transparent' : social.color,
                      background:
                        social.label === 'Instagram'
                          ? 'linear-gradient(135deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)'
                          : social.color,
                    }}
                    tabIndex={0}
                  >
                    <Icon size={20} color="white" />
                  </a>
                );
              })}
            </div>
          </div>

          {sections.map((section) => (
            <div key={section.title} className="text-center sm:text-left">
              <h4 className={`font-orbitron font-bold mb-4 text-sm sm:text-base ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
                {section.title}
              </h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.label}>{renderLink(link)}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div
          className={`pt-6 sm:pt-8 border-t flex flex-col md:flex-row items-center justify-between gap-4 ${
            theme === 'dark' ? 'border-electric-blue/20' : 'border-gray-200'
          }`}
        >
          <p className={`text-xs sm:text-sm font-exo text-center md:text-left ${theme === 'dark' ? 'text-gray-100' : 'text-black'}`}>
            © {new Date().getFullYear()} {title}. All rights reserved.
          </p>
          <nav className="flex items-center space-x-4 sm:space-x-6" aria-label="Footer legal links">
            <Link
              to="/legal/privacy-policy"
              className={`text-xs sm:text-sm font-exo transition-all duration-300 focus:outline-none focus:underline ${
                theme === 'dark' ? 'text-gray-100 hover:text-electric-blue' : 'text-black hover:text-accent-red'
              }`}
            >
              Privacy
            </Link>
            <Link
              to="/legal/terms-of-service"
              className={`text-xs sm:text-sm font-exo transition-all duration-300 focus:outline-none focus:underline ${
                theme === 'dark' ? 'text-gray-100 hover:text-electric-blue' : 'text-black hover:text-accent-red'
              }`}
            >
              Terms
            </Link>
            <Link
              to="/legal/cookie-policy"
              className={`text-xs sm:text-sm font-exo transition-all duration-300 focus:outline-none focus:underline ${
                theme === 'dark' ? 'text-gray-100 hover:text-electric-blue' : 'text-black hover:text-accent-red'
              }`}
            >
              Cookies
            </Link>
          </nav>
        </div>
      </div>

      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className={`fixed bottom-24 sm:bottom-28 right-6 sm:right-8 w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center z-50 transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
            theme === 'dark'
              ? 'bg-dark-card text-electric-blue border border-electric-blue/30 hover:bg-electric-blue hover:text-black hover:glow-blue focus:ring-electric-blue'
              : 'bg-white text-accent-red border border-accent-red/30 hover:bg-accent-red hover:text-white hover:glow-red shadow-lg focus:ring-accent-red'
          }`}
          aria-label="Scroll to top of page"
        >
          <ArrowUp size={20} />
        </button>
      )}
    </footer>
  );
};

export default Footer;
