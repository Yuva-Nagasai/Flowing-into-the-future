import { useEffect, useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { Link } from 'react-router-dom';
import { ArrowUp } from 'lucide-react';
import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter } from 'react-icons/fa';
import { SiThreads } from 'react-icons/si';

const productRoutes: { [key: string]: string } = {
  'AI Solutions': '/products/ai-solutions',
  'Cloud Platform': '/products/cloud-platform',
  'Analytics Tools': '/products/analytics-tools',
  'Mobile Apps': '/products/mobile-apps',
  'API Services': '/products/api-services'
};

const legalRoutes: { [key: string]: string } = {
  'Privacy Policy': '/legal/privacy-policy',
  'Terms of Service': '/legal/terms-of-service',
  'Cookie Policy': '/legal/cookie-policy',
  'Security': '/legal/security',
  'Compliance': '/legal/compliance'
};

const Footer = () => {
  const { theme } = useTheme();
  const [showScrollTop, setShowScrollTop] = useState(false);

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

  const companySectionMap: { [key: string]: string } = {
    'About Us': 'about',
    'Careers': 'careers',
    'Services': 'services',
    'Contact us': 'contact',
    'Partners': 'about' // Scrolls to about section where "Our Clients" tab is
  };

  const footerSections = [
    { title: 'Products', links: ['AI Solutions', 'Cloud Platform', 'Analytics Tools', 'Mobile Apps', 'API Services'] },
    { title: 'Company', links: ['About Us', 'Careers', 'Services', 'Contact us', 'Partners'] },
    { title: 'Resources', links: ['Documentation', 'API Reference', 'Case Studies', 'Webinars', 'Support Center'] },
    { title: 'Legal', links: ['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'Security', 'Compliance'] },
  ];

  const socialLinks = [
    { icon: FaFacebook, href: 'https://www.facebook.com/nanoflows', label: 'Facebook', color: '#1877F2' },
    { icon: FaInstagram, href: 'https://www.instagram.com/nanoflows/', label: 'Instagram', color: '#E4405F' },
    { icon: FaLinkedin, href: 'https://www.linkedin.com/in/nanoflows', label: 'LinkedIn', color: '#0077B5' },
    { icon: FaTwitter, href: 'https://x.com/NanoFlows', label: 'Twitter', color: '#1DA1F2' },
    { icon: SiThreads, href: 'https://www.threads.com/@nanoflows', label: 'Threads', color: '#000000' },
  ];



  return (
    <footer 
      className={`relative overflow-hidden ${theme === 'dark' ? 'bg-black border-t border-electric-blue/20' : 'bg-gray-50 border-t border-gray-200'}`}
      role="contentinfo"
    >
      <div className={`absolute inset-0 ${theme === 'dark' ? 'gradient-mesh' : 'gradient-mesh-light'}`} aria-hidden="true" />

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
            <p className={`text-sm font-exo leading-relaxed mb-6 max-w-sm mx-auto lg:mx-0 text-center lg:text-left ${theme === 'dark' ? 'text-gray-100' : 'text-black'}`}>
              Pioneering the future of digital innovation through AI-powered solutions and seamless
              user experiences. Flowing into the future, one innovation at a time.
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
                      backgroundColor: social.label === 'Instagram' 
                        ? 'transparent'
                        : social.color,
                      background: social.label === 'Instagram'
                        ? 'linear-gradient(135deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)'
                        : social.color
                    }}
                    tabIndex={0}
                  >
                    <Icon size={20} color="white" />
                  </a>
                );
              })}
            </div>
          </div>

          {footerSections.map((section, idx) => (
            <div key={idx} className="text-center sm:text-left">
              <h4 className={`font-orbitron font-bold mb-4 text-sm sm:text-base ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
                {section.title}
              </h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link}>
                    {section.title === 'Products' && productRoutes[link] ? (
                      <Link
                        to={productRoutes[link]}
                        className={`text-sm font-exo transition-all duration-300 hover:translate-x-1 inline-block focus:outline-none focus:underline ${
                          theme === 'dark' ? 'text-gray-100 hover:text-electric-green' : 'text-black hover:text-accent-red'
                        }`}
                      >
                        {link}
                      </Link>
                    ) : section.title === 'Legal' && legalRoutes[link] ? (
                      <Link
                        to={legalRoutes[link]}
                        className={`text-sm font-exo transition-all duration-300 hover:translate-x-1 inline-block focus:outline-none focus:underline ${
                          theme === 'dark' ? 'text-gray-100 hover:text-electric-green' : 'text-black hover:text-accent-red'
                        }`}
                      >
                        {link}
                      </Link>
                    ) : section.title === 'Company' && companySectionMap[link] ? (
                      <button
                        onClick={() => scrollToSection(companySectionMap[link])}
                        className={`text-sm font-exo transition-all duration-300 hover:translate-x-1 inline-block focus:outline-none focus:underline text-left ${
                          theme === 'dark' ? 'text-gray-100 hover:text-electric-green' : 'text-black hover:text-accent-red'
                        }`}
                      >
                        {link}
                      </button>
                    ) : (
                      <a
                        href="#"
                        className={`text-sm font-exo transition-all duration-300 hover:translate-x-1 inline-block focus:outline-none focus:underline ${
                          theme === 'dark' ? 'text-gray-100 hover:text-electric-green' : 'text-black hover:text-accent-red'
                        }`}
                      >
                        {link}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        <div className={`pt-6 sm:pt-8 border-t flex flex-col md:flex-row items-center justify-between gap-4 ${theme === 'dark' ? 'border-electric-blue/20' : 'border-gray-200'}`}>
          <p className={`text-xs sm:text-sm font-exo text-center md:text-left ${theme === 'dark' ? 'text-gray-100' : 'text-black'}`}>
            © {new Date().getFullYear()} Nano Flows. All rights reserved.
          </p>
          <nav className="flex items-center space-x-4 sm:space-x-6" aria-label="Footer legal links">
            <Link to="/legal/privacy-policy" className={`text-xs sm:text-sm font-exo transition-all duration-300 focus:outline-none focus:underline ${theme === 'dark' ? 'text-gray-100 hover:text-electric-blue' : 'text-black hover:text-accent-red'}`}>Privacy</Link>
            <Link to="/legal/terms-of-service" className={`text-xs sm:text-sm font-exo transition-all duration-300 focus:outline-none focus:underline ${theme === 'dark' ? 'text-gray-100 hover:text-electric-blue' : 'text-black hover:text-accent-red'}`}>Terms</Link>
            <Link to="/legal/cookie-policy" className={`text-xs sm:text-sm font-exo transition-all duration-300 focus:outline-none focus:underline ${theme === 'dark' ? 'text-gray-100 hover:text-electric-blue' : 'text-black hover:text-accent-red'}`}>Cookies</Link>
          </nav>
        </div>
      </div>
      
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className={`fixed bottom-20 sm:bottom-24 right-6 sm:right-8 w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center z-40 transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
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
