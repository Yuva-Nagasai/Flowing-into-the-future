import { useState, useEffect, useCallback, Fragment, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Sun, Moon, ChevronDown } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { productCategories } from '../data/productCatalog';
import TopFeatureNav from './TopFeatureNav';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProductsOpen, setIsProductsOpen] = useState(false);
  const [isMobileProductsOpen, setIsMobileProductsOpen] = useState(false);
  const [isIndustriesOpen, setIsIndustriesOpen] = useState(false);
  const [isMobileIndustriesOpen, setIsMobileIndustriesOpen] = useState(false);
  const [showTopBar, setShowTopBar] = useState(() => {
    if (typeof window === 'undefined') return true;
    return window.scrollY <= 24;
  });
  const productCloseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const productHoldUntil = useRef<number | null>(null);
  const productsMenuRef = useRef<HTMLDivElement | null>(null);
  const industriesMenuRef = useRef<HTMLDivElement | null>(null);

  const closeProductsMenu = useCallback(() => {
    if (productCloseTimer.current) {
      clearTimeout(productCloseTimer.current);
      productCloseTimer.current = null;
    }
    productHoldUntil.current = null;
    setIsProductsOpen(false);
  }, []);

  const openProductsMenuWithHold = useCallback((duration = 6000) => {
    if (productCloseTimer.current) {
      clearTimeout(productCloseTimer.current);
    }
    productHoldUntil.current = Date.now() + duration;
    setIsProductsOpen(true);
    productCloseTimer.current = setTimeout(() => {
      productHoldUntil.current = null;
      setIsProductsOpen(false);
      productCloseTimer.current = null;
    }, duration);
  }, []);
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeAnchor, setActiveAnchor] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const nearTop = window.scrollY <= 24;
      setShowTopBar(nearTop);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    return () => {
      closeProductsMenu();
    };
  }, [closeProductsMenu]);

  // Handle smooth scroll to section
  const scrollToSection = useCallback((sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (!element) return;

    const header = document.getElementById('site-header');
    const headerHeight = header?.offsetHeight ?? 0;
    const safetyGap = window.innerWidth < 1024 ? 24 : 16; // give the section breathing room
    const offset = headerHeight + safetyGap;

    const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
    const offsetPosition = elementPosition - offset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  }, []);

  // Handle anchor link navigation
  const handleAnchorClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const sectionId = href.replace('#', '');
    setActiveAnchor(sectionId);
    
    if (location.pathname !== '/') {
      // If not on home page, navigate to home with hash
      navigate(`/#${sectionId}`);
      // Wait for navigation, then scroll
      setTimeout(() => {
        scrollToSection(sectionId);
      }, 300);
    } else {
      // Already on home page, just scroll
      scrollToSection(sectionId);
    }
    setIsMobileMenuOpen(false);
  };

  // Handle hash scrolling when page loads with hash
  useEffect(() => {
    if (location.pathname === '/' && location.hash) {
      const sectionId = location.hash.replace('#', '');
      setActiveAnchor(sectionId);
      setTimeout(() => {
        scrollToSection(sectionId);
      }, 100);
    } else if (location.pathname !== '/') {
      setActiveAnchor(null);
    }
  }, [location, scrollToSection]);

  const navLinks = [
    { name: 'Home', href: '#home', type: 'anchor' },
    { name: 'Services', href: '/services', type: 'route' },
    { name: 'How it Works', href: '/how-it-works', type: 'route' },
    { name: 'Careers', href: '/careers', type: 'route' },
    { name: 'Contact', href: '/contact', type: 'route' }
  ];

  const isRouteActive = (href: string) => {
    if (!href.startsWith('/')) return false;
    if (href === '/') return false;
    return location.pathname === href || location.pathname.startsWith(`${href}/`);
  };

  const getLinkClasses = (isActive: boolean) => {
    if (theme === 'dark') {
      return isActive ? 'text-electric-green' : 'text-white hover:text-electric-green';
    }
    return isActive ? 'text-accent-red' : 'text-black hover:text-accent-red';
  };

  const handleProductsButtonClick = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
    }

    if (isProductsOpen) {
      closeProductsMenu();
      return;
    }

    openProductsMenuWithHold();
  };

  const industriesColumns = {
    primary: [
      { label: 'AgriTech Application Development', slug: 'agritech-application-development' },
      { label: 'Dating App Development Services', slug: 'dating-app-development' },
      { label: 'E-commerce App Development', slug: 'ecommerce-app-development' },
      { label: 'Grocery Delivery App Development', slug: 'grocery-delivery-app-development' },
      { label: 'EducationTech Software Development', slug: 'educationtech-software-development' },
      { label: 'Financial Services Software Solutions', slug: 'financial-services-software-solutions' }
    ],
    more: [
      { label: 'FitnessTech App Development', slug: 'fitnesstech-app-development' },
      { label: 'FoodTech Software Solutions', slug: 'foodtech-software-solutions' },
      { label: 'Gaming App Development', slug: 'gaming-app-development' },
      { label: 'HealthTech App Development', slug: 'healthtech-app-development' },
      { label: 'ManufacturingTech Software Solutions', slug: 'manufacturingtech-software-solutions' },
      { label: 'Car Rental Booking cum Aggregator', slug: 'car-rental-booking-aggregator' }
    ]
  };

  useEffect(() => {
    const handleOutsideInteraction = (event: MouseEvent | TouchEvent) => {
      if (
        industriesMenuRef.current &&
        !industriesMenuRef.current.contains(event.target as Node)
      ) {
        setIsIndustriesOpen(false);
      }
    };

    if (isIndustriesOpen) {
      document.addEventListener('mousedown', handleOutsideInteraction);
      document.addEventListener('touchstart', handleOutsideInteraction);
    }

    return () => {
      document.removeEventListener('mousedown', handleOutsideInteraction);
      document.removeEventListener('touchstart', handleOutsideInteraction);
    };
  }, [isIndustriesOpen]);

  const handleProductsMouseLeave = () => {
    if (productHoldUntil.current && Date.now() < productHoldUntil.current) {
      return;
    }
    closeProductsMenu();
  };

  useEffect(() => {
    const handleOutsideInteraction = (event: MouseEvent | TouchEvent) => {
      if (
        productsMenuRef.current &&
        !productsMenuRef.current.contains(event.target as Node)
      ) {
        closeProductsMenu();
      }
    };

    if (isProductsOpen) {
      document.addEventListener('mousedown', handleOutsideInteraction);
      document.addEventListener('touchstart', handleOutsideInteraction);
    }

    return () => {
      document.removeEventListener('mousedown', handleOutsideInteraction);
      document.removeEventListener('touchstart', handleOutsideInteraction);
    };
  }, [isProductsOpen, closeProductsMenu]);

  return (
    <header
      id="site-header"
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500 bg-transparent"
    >
      <div
        className={`transition-[max-height,opacity] duration-500 ease-in-out ${
          showTopBar ? 'max-h-32 opacity-100' : 'max-h-0 opacity-0 pointer-events-none'
        }`}
      >
        <TopFeatureNav />
      </div>
      <div
        className={`${
          theme === 'dark'
            ? 'bg-[#030b1f] border-t border-b border-electric-blue/20 shadow-[0_6px_18px_rgba(0,0,0,0.35)]'
            : 'bg-white border-t border-b border-gray-200 shadow-[0_6px_18px_rgba(46,55,77,0.12)]'
        }`}
      >
        <nav className="container mx-auto px-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img
              src="/NanoFlows-LOGO-removebg-preview.png"
              alt="Logo"
              className="h-16 w-18"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-10 lg:space-x-12">
            {navLinks.map((link) => (
              <Fragment key={link.name}>
                {link.type === 'anchor' ? (
                  <a
                    href={link.href}
                    onClick={(e) => handleAnchorClick(e, link.href)}
                    className={`font-exo font-medium transition-all duration-300 cursor-pointer ${getLinkClasses(
                      // Do not show "Home" as an active/selected state (to match e-learning nav behavior)
                      link.name === 'Home' ? false : activeAnchor === link.href.replace('#', '')
                    )}`}
                  >
                    {link.name}
                  </a>
                ) : link.type === 'external' ? (
                  <a
                    href={link.href}
                    className={`font-exo font-medium transition-all duration-300 ${
                      theme === 'dark'
                        ? 'text-white hover:text-electric-green'
                        : 'text-black hover:text-accent-red'
                    }`}
                  >
                    {link.name}
                  </a>
                ) : (
                  <Link
                    to={link.href}
                    className={`font-exo font-medium transition-all duration-300 ${getLinkClasses(
                      isRouteActive(link.href)
                    )}`}
                  >
                    {link.name}
                  </Link>
                )}

                {link.name === 'How it Works' && (
                <div
                  className="relative"
                  onMouseLeave={handleProductsMouseLeave}
                  ref={productsMenuRef}
                >
                    <button
                      type="button"
                      onClick={handleProductsButtonClick}
                    className={`flex items-center gap-1 font-exo font-medium transition-colors duration-300 ${
                      location.pathname.startsWith('/products')
                        ? theme === 'dark'
                          ? 'text-electric-green'
                          : 'text-accent-red'
                        : theme === 'dark'
                        ? 'text-white hover:text-electric-green'
                        : 'text-black hover:text-accent-red'
                    }`}
                    >
                      Products <ChevronDown size={18} className="mt-0.5" />
                    </button>
                    {isProductsOpen && (
                      <div
                        className={`absolute top-full mt-2 rounded-lg shadow-lg border ${
                          theme === 'dark'
                            ? 'bg-dark-card border-electric-blue/20'
                            : 'bg-white border-gray-200'
                        } w-[580px] p-2`}
                      >
                        <div className="grid grid-cols-3 gap-3 items-stretch">
                          {productCategories.map((category) => {
                            const items = category.items.slice(0, 4);
                            return (
                              <div
                                key={category.title}
                                className={`rounded-lg p-3 text-left h-full flex flex-col min-h-[220px] ${
                                  theme === 'dark'
                                    ? 'bg-dark-bg/40 border border-electric-blue/20'
                                    : 'bg-gray-50 border border-gray-200'
                                }`}
                              >
                                <Link
                                  to={category.path}
                                  onClick={() => closeProductsMenu()}
                                  className={`font-orbitron text-sm font-semibold inline-flex items-center justify-between px-2 py-1 rounded-md transition-colors w-full ${
                                    theme === 'dark'
                                      ? 'text-white hover:bg-electric-blue/20'
                                      : 'text-black hover:bg-accent-red/10'
                                  }`}
                                >
                                  {category.title}
                                </Link>
                                <div
                                  className={`mt-2 flex-1 grid grid-rows-4 w-full divide-y ${
                                    theme === 'dark'
                                      ? 'divide-electric-blue/15'
                                      : 'divide-gray-200/80'
                                  }`}
                                >
                                  {items.map((item) => (
                                    <Link
                                      key={item.slug}
                                      to={`/products/${category.slug}/${item.slug}`}
                                      onClick={() => closeProductsMenu()}
                                      className={`text-xs font-exo flex items-center justify-between px-2 transition-colors text-left ${
                                        theme === 'dark'
                                          ? 'text-gray-200 hover:text-electric-green'
                                          : 'text-gray-700 hover:text-accent-red'
                                      }`}
                                      style={{ minHeight: '36px' }}
                                    >
                                      {item.name}
                                    </Link>
                                  ))}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </Fragment>
            ))}

            {/* Industries Dropdown */}
            <div className="relative" ref={industriesMenuRef}>
              <button
                type="button"
                onClick={() => setIsIndustriesOpen((prev) => !prev)}
                className={`flex items-center gap-1 font-exo font-medium transition-colors duration-300 ${
                  location.pathname.startsWith('/industries')
                    ? theme === 'dark'
                      ? 'text-electric-green'
                      : 'text-accent-red'
                    : theme === 'dark'
                    ? 'text-white hover:text-electric-green'
                    : 'text-black hover:text-accent-red'
                }`}
              >
                Industries <ChevronDown size={18} className="mt-0.5" />
              </button>

              {isIndustriesOpen && (
                <div
                  className={`absolute top-full right-0 mt-2 rounded-lg shadow-lg border ${
                    theme === 'dark'
                      ? 'bg-dark-card border-electric-blue/20'
                      : 'bg-white border-gray-200'
                  } w-[520px] p-2`}
                >
                  <div className="grid grid-cols-2 gap-3 items-stretch">
                    <div
                      className={`rounded-lg p-3 text-left h-full flex flex-col min-h-[220px] ${
                        theme === 'dark'
                          ? 'bg-dark-bg/40 border border-electric-blue/20'
                          : 'bg-gray-50 border border-gray-200'
                      }`}
                    >
                      <h4
                        className={`mb-2 text-sm font-orbitron font-semibold uppercase tracking-wide ${
                          theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
                        }`}
                      >
                        Industries
                      </h4>
                      <div
                        className={`mt-1 flex-1 grid grid-rows-6 w-full divide-y ${
                          theme === 'dark'
                            ? 'divide-electric-blue/15'
                            : 'divide-gray-200/80'
                        }`}
                      >
                        {industriesColumns.primary.map((item) => (
                          <Link
                            key={item.slug}
                            to={`/industries/${item.slug}`}
                            onClick={() => setIsIndustriesOpen(false)}
                            className={`text-xs font-exo flex items-center justify-between px-2 text-left transition-colors ${
                              theme === 'dark'
                                ? 'text-gray-200 hover:text-electric-green'
                                : 'text-gray-700 hover:text-accent-red'
                            }`}
                            style={{ minHeight: '32px' }}
                          >
                            {item.label}
                          </Link>
                        ))}
                      </div>
                    </div>

                    <div
                      className={`rounded-lg p-3 text-left h-full flex flex-col min-h-[220px] ${
                        theme === 'dark'
                          ? 'bg-dark-bg/40 border border-electric-blue/20'
                          : 'bg-gray-50 border border-gray-200'
                      }`}
                    >
                      <h4
                        className={`mb-2 text-sm font-orbitron font-semibold uppercase tracking-wide ${
                          theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
                        }`}
                      >
                        More Industries
                      </h4>
                      <div
                        className={`mt-1 flex-1 grid grid-rows-6 w-full divide-y ${
                          theme === 'dark'
                            ? 'divide-electric-blue/15'
                            : 'divide-gray-200/80'
                        }`}
                      >
                        {industriesColumns.more.map((item) => (
                          <Link
                            key={item.slug}
                            to={`/industries/${item.slug}`}
                            onClick={() => setIsIndustriesOpen(false)}
                            className={`text-xs font-exo flex items-center justify-between px-2 text-left transition-colors ${
                              theme === 'dark'
                                ? 'text-gray-200 hover:text-electric-green'
                                : 'text-gray-700 hover:text-accent-red'
                            }`}
                            style={{ minHeight: '32px' }}
                          >
                            {item.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Website Login Button (website auth) */}
            <Link
              to="/login"
              className={`font-exo font-medium px-4 py-2 rounded-md transition-all duration-300 ${
                theme === 'dark'
                  ? 'bg-electric-green text-black hover:bg-electric-blue'
                  : 'bg-accent-red text-white hover:bg-accent-blue'
              }`}
            >
              Login
            </Link>
          </div>

          {/* Theme Toggle & Mobile Menu Button */}
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-full transition-all duration-300 ${
                theme === 'dark'
                  ? 'bg-dark-card hover:bg-dark-lighter text-electric-blue hover:glow-blue'
                  : 'bg-gray-100 hover:bg-gray-200 text-accent-red hover:glow-red'
              }`}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`md:hidden p-2 rounded-lg ${
                theme === 'dark' ? 'text-white' : 'text-black'
              }`}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div
            className={`md:hidden mt-4 py-4 rounded-lg ${
              theme === 'dark' ? 'bg-dark-card' : 'bg-white shadow-lg'
            }`}
          >
            {navLinks.map((link) => (
              <Fragment key={link.name}>
                {link.type === 'anchor' ? (
                  <a
                    href={link.href}
                    onClick={(e) => handleAnchorClick(e, link.href)}
                    className={`block px-4 py-3 font-exo transition-all duration-300 cursor-pointer ${
                      // Do not show "Home" as an active/selected state (to match e-learning nav behavior)
                      link.name === 'Home'
                        ? theme === 'dark'
                          ? 'text-white hover:text-electric-green hover:bg-dark-lighter'
                          : 'text-black hover:text-accent-red hover:bg-gray-50'
                        : activeAnchor === link.href.replace('#', '')
                        ? theme === 'dark'
                          ? 'text-electric-green bg-dark-lighter/40'
                          : 'text-accent-red bg-gray-50'
                        : theme === 'dark'
                        ? 'text-white hover:text-electric-green hover:bg-dark-lighter'
                        : 'text-black hover:text-accent-red hover:bg-gray-50'
                    }`}
                  >
                    {link.name}
                  </a>
                ) : link.type === 'external' ? (
                  <a
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`block px-4 py-3 font-exo transition-all duration-300 ${
                      theme === 'dark'
                        ? 'text-white hover:text-electric-green hover:bg-dark-lighter'
                        : 'text-black hover:text-accent-red hover:bg-gray-50'
                    }`}
                  >
                    {link.name}
                  </a>
                ) : (
                  <Link
                    to={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`block px-4 py-3 font-exo transition-all duration-300 ${
                      isRouteActive(link.href)
                        ? theme === 'dark'
                          ? 'text-electric-green bg-dark-lighter/40'
                          : 'text-accent-red bg-gray-50'
                        : theme === 'dark'
                        ? 'text-white hover:text-electric-green hover:bg-dark-lighter'
                        : 'text-black hover:text-accent-red hover:bg-gray-50'
                    }`}
                  >
                    {link.name}
                  </Link>
                )}

                {link.name === 'How it Works' && (
                  <div className="border-t border-b border-gray-200/30">
                    <button
                      onClick={() => setIsMobileProductsOpen(!isMobileProductsOpen)}
                      className={`w-full flex items-center justify-between px-4 py-3 font-exo font-medium ${
                        theme === 'dark'
                          ? 'text-white hover:text-electric-green'
                          : 'text-black hover:text-accent-red'
                      }`}
                    >
                      <span>Products</span>
                      <ChevronDown
                        size={18}
                        className={`transition-transform ${
                          isMobileProductsOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    {isMobileProductsOpen && (
                      <div className="px-4 pb-4 space-y-3">
                        {productCategories.map((category) => {
                          const items = category.items.slice(0, 4);
                          return (
                            <div
                              key={category.title}
                              className={`rounded-lg border px-4 py-3 text-left ${
                                theme === 'dark'
                                  ? 'bg-dark-lighter border-electric-blue/20 text-white'
                                  : 'bg-gray-50 border-gray-200 text-black'
                              }`}
                            >
                              <Link
                                to={category.path}
                                onClick={() => {
                                  setIsMobileMenuOpen(false);
                                  setIsMobileProductsOpen(false);
                                }}
                                className="font-orbitron font-semibold mb-1 block text-sm"
                              >
                                {category.title}
                              </Link>
                              <div
                                className={`pl-2 mt-1 grid grid-rows-4 divide-y ${
                                  theme === 'dark'
                                    ? 'divide-electric-blue/15'
                                    : 'divide-gray-200/80'
                                }`}
                              >
                                {items.map((item) => (
                                  <Link
                                    key={item.slug}
                                    to={`/products/${category.slug}/${item.slug}`}
                                    onClick={() => {
                                      setIsMobileMenuOpen(false);
                                      setIsMobileProductsOpen(false);
                                    }}
                                    className={`text-xs font-exo flex items-center justify-between py-1.5 transition-colors text-left ${
                                      theme === 'dark'
                                        ? 'text-gray-300 hover:text-electric-green'
                                        : 'text-gray-600 hover:text-accent-red'
                                    }`}
                                  >
                                    {item.name}
                                  </Link>
                                ))}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </Fragment>
            ))}

            {/* Mobile Industries Dropdown */}
            <div className="border-t border-b border-gray-200/30">
              <button
                onClick={() => setIsMobileIndustriesOpen((prev) => !prev)}
                className={`w-full flex items-center justify-between px-4 py-3 font-exo font-medium ${
                  theme === 'dark'
                    ? 'text-white hover:text-electric-green'
                    : 'text-black hover:text-accent-red'
                }`}
              >
                <span>Industries</span>
                <ChevronDown
                  size={18}
                  className={`transition-transform ${
                    isMobileIndustriesOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {isMobileIndustriesOpen && (
                <div className="px-4 pb-4 grid grid-cols-1 gap-4">
                  <div>
                    <h4
                      className={`mb-2 text-xs font-orbitron font-semibold uppercase tracking-wide ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                      }`}
                    >
                      Industries
                    </h4>
                    <ul className="space-y-1">
                      {industriesColumns.primary.map((item) => (
                        <li key={item.slug}>
                          <Link
                            to={`/industries/${item.slug}`}
                            onClick={() => {
                              setIsMobileIndustriesOpen(false);
                              setIsMobileMenuOpen(false);
                            }}
                            className={`block text-sm font-exo ${
                              theme === 'dark'
                                ? 'text-gray-200 hover:text-electric-green'
                                : 'text-gray-700 hover:text-accent-red'
                            }`}
                          >
                            {item.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4
                      className={`mb-2 text-xs font-orbitron font-semibold uppercase tracking-wide ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                      }`}
                    >
                      More Industries
                    </h4>
                    <ul className="space-y-1">
                      {industriesColumns.more.map((item) => (
                        <li key={item.slug}>
                          <Link
                            to={`/industries/${item.slug}`}
                            onClick={() => {
                              setIsMobileIndustriesOpen(false);
                              setIsMobileMenuOpen(false);
                            }}
                            className={`block text-sm font-exo ${
                              theme === 'dark'
                                ? 'text-gray-200 hover:text-electric-green'
                                : 'text-gray-700 hover:text-accent-red'
                            }`}
                          >
                            {item.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>

            {/* Website Login Button (website auth) */}
            <Link
              to="/login"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`block px-4 py-3 mt-2 font-exo font-medium rounded-md text-center transition-all duration-300 ${
                theme === 'dark'
                  ? 'bg-electric-green text-black hover:bg-electric-blue'
                  : 'bg-accent-red text-white hover:bg-accent-blue'
              }`}
            >
              Login
            </Link>
          </div>
        )}
      </nav>
      </div>
    </header>
  );
};

export default Header;
