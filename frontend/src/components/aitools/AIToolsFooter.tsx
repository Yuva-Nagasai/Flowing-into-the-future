import { useEffect, useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Link } from 'react-router-dom';
import { ArrowUp, Brain, Sparkles } from 'lucide-react';
import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter } from 'react-icons/fa';
import { SiThreads } from 'react-icons/si';

const AIToolsFooter = () => {
  const { theme } = useTheme();
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 600);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const footerSections = [
    { 
      title: 'AI Tools', 
      links: [
        { label: 'Explore Tools', path: '/ai-tools/explore' },
        { label: 'Text & Writing', path: '/ai-tools/explore?category=text' },
        { label: 'Image Generation', path: '/ai-tools/explore?category=image' },
        { label: 'Code Assistant', path: '/ai-tools/explore?category=code' },
        { label: 'Audio & Voice', path: '/ai-tools/explore?category=audio' }
      ]
    },
    { 
      title: 'Platform', 
      links: [
        { label: 'Home', path: '/ai-tools' },
        { label: 'About', path: '/ai-tools/about' },
        { label: 'Academy', path: '/academy' },
        { label: 'Main Site', path: '/' },
        { label: 'Contact', path: '/contact' }
      ]
    },
    { 
      title: 'Resources', 
      links: [
        { label: 'Documentation', path: '#' },
        { label: 'API Reference', path: '#' },
        { label: 'Tutorials', path: '/academy' },
        { label: 'Blog', path: '/ai-tools/blog' },
        { label: 'Support', path: '/contact' }
      ]
    },
    { 
      title: 'Legal', 
      links: [
        { label: 'Privacy Policy', path: '/legal/privacy-policy' },
        { label: 'Terms of Service', path: '/legal/terms-of-service' },
        { label: 'Cookie Policy', path: '/legal/cookie-policy' },
        { label: 'Security', path: '/legal/security' },
        { label: 'Compliance', path: '/legal/compliance' }
      ]
    }
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
      className={`relative overflow-hidden ${
        theme === 'dark' 
          ? 'bg-dark-bg border-t border-electric-blue/20' 
          : 'bg-gray-50 border-t border-gray-200'
      }`}
      role="contentinfo"
    >
      <div className={`absolute inset-0 opacity-50 ${
        theme === 'dark' ? 'bg-gradient-to-br from-dark-bg via-dark-card to-dark-bg' : ''
      }`} aria-hidden="true" />

      <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-16 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-8 mb-12">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className={`p-2 rounded-xl ${
                theme === 'dark' 
                  ? 'bg-gradient-to-br from-electric-blue/20 to-electric-green/20' 
                  : 'bg-gradient-to-br from-accent-red/10 to-accent-blue/10'
              }`}>
                <Brain className={`w-8 h-8 ${
                  theme === 'dark' ? 'text-electric-blue' : 'text-accent-red'
                }`} />
              </div>
              <div>
                <h3 className={`text-xl font-bold ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`} style={{ fontFamily: 'Orbitron, sans-serif' }}>AI Tools</h3>
              </div>
            </div>
            
            <p className={`text-sm leading-relaxed mb-6 max-w-sm ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Discover and explore the most powerful AI tools to supercharge your productivity. 
              From content creation to code assistance, find the perfect AI solution for every task.
            </p>

            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border mb-6 ${
              theme === 'dark'
                ? 'border-electric-blue/30 bg-electric-blue/10'
                : 'border-accent-red/30 bg-accent-red/10'
            }`}>
              <Sparkles className={`w-4 h-4 ${
                theme === 'dark' ? 'text-electric-green' : 'text-accent-red'
              }`} />
              <span className={`text-xs font-semibold ${
                theme === 'dark' ? 'text-electric-blue' : 'text-accent-blue'
              }`}>
                AI-Powered Platform
              </span>
            </div>

            <div className="flex space-x-3">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Follow us on ${social.label}`}
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 ${
                      theme === 'dark' 
                        ? 'bg-dark-card border border-gray-700 hover:border-electric-blue' 
                        : 'bg-white border border-gray-200 hover:border-accent-red shadow-sm'
                    }`}
                  >
                    <Icon size={18} className={
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                    } />
                  </a>
                );
              })}
            </div>
          </div>

          {footerSections.map((section, idx) => (
            <div key={idx} className="text-center sm:text-left">
              <h4 className={`font-bold mb-4 text-sm ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`} style={{ fontFamily: 'Orbitron, sans-serif' }}>
                {section.title}
              </h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.path}
                      className={`text-sm transition-all duration-300 hover:translate-x-1 inline-block ${
                        theme === 'dark' 
                          ? 'text-gray-400 hover:text-electric-green' 
                          : 'text-gray-600 hover:text-accent-red'
                      }`}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        <div className={`pt-8 border-t flex flex-col md:flex-row items-center justify-between gap-4 ${
          theme === 'dark' ? 'border-gray-800' : 'border-gray-200'
        }`}>
          <div className="flex items-center gap-2">
            <img 
              src="/NanoFlows-LOGO-removebg-preview.png" 
              alt="Nano Flows Logo" 
              className="h-10 w-10 object-contain" 
              loading="lazy"
            />
            <p className={`text-xs sm:text-sm ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              © {new Date().getFullYear()} Nano Flows. All rights reserved.
            </p>
          </div>
          
          <nav className="flex items-center space-x-4 sm:space-x-6" aria-label="Footer legal links">
            <Link 
              to="/legal/privacy-policy" 
              className={`text-xs sm:text-sm transition-all duration-300 ${
                theme === 'dark' ? 'text-gray-400 hover:text-electric-blue' : 'text-gray-600 hover:text-accent-red'
              }`}
            >
              Privacy
            </Link>
            <Link 
              to="/legal/terms-of-service" 
              className={`text-xs sm:text-sm transition-all duration-300 ${
                theme === 'dark' ? 'text-gray-400 hover:text-electric-blue' : 'text-gray-600 hover:text-accent-red'
              }`}
            >
              Terms
            </Link>
            <Link 
              to="/legal/cookie-policy" 
              className={`text-xs sm:text-sm transition-all duration-300 ${
                theme === 'dark' ? 'text-gray-400 hover:text-electric-blue' : 'text-gray-600 hover:text-accent-red'
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
          className={`fixed bottom-24 right-6 sm:bottom-28 sm:right-8 w-12 h-12 rounded-full flex items-center justify-center z-40 transition-all duration-300 hover:scale-110 shadow-lg ${
            theme === 'dark'
              ? 'bg-electric-blue text-black hover:bg-electric-green'
              : 'bg-accent-red text-white hover:bg-accent-blue'
          }`}
          aria-label="Scroll to top of page"
        >
          <ArrowUp size={20} />
        </button>
      )}
    </footer>
  );
};

export default AIToolsFooter;
