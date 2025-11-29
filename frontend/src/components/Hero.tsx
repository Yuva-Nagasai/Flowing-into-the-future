import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useNavigate, useLocation } from 'react-router-dom';
// @ts-expect-error - legacy JS module
import { heroSlidesAPI } from '../utils/api.js';

const slideOneImageUrl = '/nanoflows-image.png';

type SlideBase = {
  backgroundImage?: string;
  backgroundOverlay?: string;
};

type DefaultSlide = SlideBase & {
  variant: 'default';
  title: string;
  highlight: string;
  subtitle: string;
  buttonText: string;
};

type ShowcaseSlide = SlideBase & {
  variant: 'showcase';
  preHeading: string;
  heading: string;
  highlight: string;
  description: string;
  categories: string[];
  primaryCta: { label: string; route: string };
  secondaryCta?: { label: string; route: string };
  trustBadges: string[];
};

type ServiceButton = {
  label: string;
  description?: string;
  route: string;
};

type ServicesSlide = SlideBase & {
  variant: 'services';
  title: string;
  subtitle?: string;
  description?: string;
  services: ServiceButton[];
};

type HeroSlide = DefaultSlide | ShowcaseSlide | ServicesSlide;

type HeroSlideApi = {
  id: number;
  variant: 'default' | 'showcase' | 'services';
  backgroundImage?: string;
  background_image?: string;
  backgroundOverlay?: string;
  background_overlay?: string;
  title?: string;
  highlight?: string;
  subtitle?: string;
  buttonText?: string;
  button_text?: string;
  preHeading?: string;
  pre_heading?: string;
  heading?: string;
  description?: string;
  categories?: string[] | string;
  primaryCtaLabel?: string;
  primary_cta_label?: string;
  primaryCtaRoute?: string;
  primary_cta_route?: string;
  secondaryCtaLabel?: string;
  secondary_cta_label?: string;
  secondaryCtaRoute?: string;
  secondary_cta_route?: string;
  trustBadges?: string[] | string;
  trust_badges?: string[] | string;
  services?: Array<{
    label?: string;
    description?: string;
    route?: string;
  }>;
};

const isDefaultSlide = (slide: HeroSlide): slide is DefaultSlide => slide.variant === 'default';

const fallbackDefaultSlide: DefaultSlide = {
  variant: 'default',
  title: 'Flowing Into',
  highlight: 'The Future',
  subtitle:
    'Experience seamless innovation with Nano Flows. We deliver cutting-edge AI-powered solutions that transform your digital presence through dynamic personalization and continuous evolution.',
  buttonText: 'Get Started',
};

const fallbackServicesSlide: ServicesSlide = {
  variant: 'services',
  title: 'Every Capability You Need in One Studio',
  subtitle: 'NanoFlows Services',
  description: '',
  services: [
    {
      label: 'Custom Development',
      description: 'Web, mobile & API platforms',
      route: '/services#custom-development',
    },
    {
      label: 'Cloud Solutions',
      description: 'Migrations, DevOps & microservices',
      route: '/services#cloud-solutions',
    },
    {
      label: 'AI & ML Engineering',
      description: 'Intelligent automation & data models',
      route: '/services#ai-machine-learning',
    },
    {
      label: 'Performance Optimization',
      description: 'Speed, reliability & scalability',
      route: '/services#performance-optimization',
    },
    {
      label: 'Marketing & Campaigns',
      description: 'Growth marketing and brand reach',
      route: '/services#social-media-campaigns',
    },
    {
      label: 'YouTube Promotions',
      description: 'Channel growth & video SEO',
      route: '/services#youtube-promotions',
    },
  ],
};

const fallbackShowcaseSlides: ShowcaseSlide[] = [
  {
    variant: 'showcase',
    preHeading: 'Welcome to NanoFlows',
    heading: 'Innovating Smarter Solutions with',
    highlight: 'Trusted Intelligence',
    description:
      'Engineering interactive and secure digital products across AI, automation, cloud, and data. Our pods blend strategy, design, and delivery to accelerate real business outcomes.',
    categories: ['AI', 'IoT', 'Digital Engineering', 'Data Analytics', 'Travel Tech', 'Web & Cloud'],
    primaryCta: { label: 'Consult our expert', route: '/contact' },
    secondaryCta: { label: 'Explore services', route: '/services' },
    trustBadges: [],
  },
  {
    variant: 'showcase',
    preHeading: 'NanoFlows Academy',
    heading: 'Master In-Demand Skills with',
    highlight: 'E-Learning',
    description:
      'Transform your career with expert-led courses. Learn at your own pace with lifetime access, earn industry-recognized certificates, and join thousands of successful learners.',
    categories: ['Web Development', 'AI & Machine Learning', 'Cloud Computing', 'Data Science', 'DevOps', 'Cybersecurity'],
    primaryCta: { label: 'Start Learning', route: '/elearning' },
    secondaryCta: { label: 'View All Courses', route: '/elearning#courses' },
    trustBadges: ['Industry Experts', 'Certificates', 'Lifetime Access'],
  },
  {
    variant: 'showcase',
    preHeading: 'AI-Powered Productivity',
    heading: 'Supercharge Your Workflow with',
    highlight: 'AI Tools',
    description:
      'Discover a curated collection of the most powerful AI tools. From content creation to data analysis, code generation to image synthesis – find the perfect tool for every task.',
    categories: ['Text Generation', 'Image Creation', 'Code Assistant', 'Audio & Video', 'Data Analysis', 'Automation'],
    primaryCta: { label: 'Explore AI Tools', route: '/ai-tools' },
    secondaryCta: { label: 'Browse Categories', route: '/ai-tools#categories' },
    trustBadges: ['Free Tools', 'Premium Options', 'Expert Curated'],
  },
  {
    variant: 'showcase',
    preHeading: 'NanoFlows Store',
    heading: 'Premium Digital Products for',
    highlight: 'E-Commerce',
    description:
      'Shop our exclusive collection of digital products, templates, and solutions. Built with cutting-edge technology to accelerate your business growth and digital transformation.',
    categories: ['Templates', 'UI Kits', 'Plugins', 'Source Code', 'Digital Assets', 'Business Tools'],
    primaryCta: { label: 'Visit Shop', route: '/shop' },
    secondaryCta: { label: 'View Best Sellers', route: '/shop#featured' },
    trustBadges: ['Secure Checkout', 'Instant Download', 'Premium Support'],
  },
  {
    variant: 'showcase',
    preHeading: 'Hire NanoFlows Squads',
    heading: 'Build AI-Native Products with',
    highlight: 'Dedicated Teams',
    description:
      'Spin up high-performance squads across product, engineering, and data science. From discovery to remote onboarding, we align every sprint with your KPIs.',
    categories: ['Product Strategy', 'Platform Engineering', 'DevSecOps', 'Mobility', 'Analytics', 'Customer Success'],
    primaryCta: { label: 'Book a strategy call', route: '/how-it-works' },
    secondaryCta: { label: 'View success stories', route: '/industries/technology' },
    trustBadges: [],
  },
];

const fallbackSlides: HeroSlide[] = [
  fallbackDefaultSlide,
  fallbackServicesSlide,
  ...fallbackShowcaseSlides,
];

const mapBackgroundFields = (
  slide: HeroSlideApi,
  fallback?: SlideBase
): Pick<SlideBase, 'backgroundImage' | 'backgroundOverlay'> => ({
  backgroundImage: slide.backgroundImage || slide.background_image || fallback?.backgroundImage,
  backgroundOverlay: slide.backgroundOverlay || slide.background_overlay || fallback?.backgroundOverlay,
});

const splitTitleForHighlight = (title: string): { primary: string; highlight: string } => {
  const words = title.trim().split(/\s+/);
  if (words.length <= 1) {
    return { primary: title, highlight: '' };
  }
  const primary = words.slice(0, -2).join(' ') || words[0];
  const highlight = words.slice(-2).join(' ');
  return { primary, highlight };
};

const Hero = () => {
  const { theme } = useTheme();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slideAnimationStage, setSlideAnimationStage] = useState<
    'show' | 'slideLeft' | 'showImage'
  >('show');
  const navigate = useNavigate();
  const location = useLocation();

  const [slides, setSlides] = useState<HeroSlide[]>(fallbackSlides);
  const [typewriterText, setTypewriterText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const activeSlide = slides[currentSlide];
  const isServicesSlide = activeSlide?.variant === 'services';
  const hasCustomBackground = Boolean(activeSlide?.backgroundImage);
  const backgroundOverlayColor =
    activeSlide?.backgroundOverlay ||
    (theme === 'dark' ? 'rgba(0, 0, 0, 0.78)' : 'rgba(255, 255, 255, 0.82)');
  const gradientMeshClass = theme === 'dark' ? 'gradient-mesh' : 'gradient-mesh-light';
  const defaultSlide = useMemo<DefaultSlide>(() => {
    const firstDefault = slides.find(isDefaultSlide);
    return firstDefault || fallbackDefaultSlide;
  }, [slides]);
  useEffect(() => {
    let isMounted = true;
    const fetchSlides = async () => {
      try {
        const response = await heroSlidesAPI.getAll();
        const apiSlides: HeroSlideApi[] = response.data.slides || [];
        if (!isMounted || !Array.isArray(apiSlides)) return;

        const parseStringArray = (value?: string[] | string): string[] => {
          if (!value) return [];
          if (Array.isArray(value)) return value;
          if (typeof value === 'string') {
            return value
              .split(',')
              .map((item) => item.trim())
              .filter(Boolean);
          }
          return [];
        };

        const mappedSlides: HeroSlide[] = apiSlides
          .map((slide) => {
            if (slide.variant === 'default') {
              const background = mapBackgroundFields(slide, fallbackDefaultSlide);
              return {
                variant: 'default',
                ...background,
                title: slide.title || fallbackDefaultSlide.title,
                highlight: slide.highlight || fallbackDefaultSlide.highlight,
                subtitle: slide.subtitle || fallbackDefaultSlide.subtitle,
                buttonText: slide.buttonText || slide.button_text || fallbackDefaultSlide.buttonText,
              };
            }

            if (slide.variant === 'showcase') {
              const background = mapBackgroundFields(slide, fallbackShowcaseSlides[0]);
              return {
                variant: 'showcase',
                ...background,
                preHeading: slide.preHeading || slide.pre_heading || 'NanoFlows Spotlight',
                heading: slide.heading || 'Build Next-Gen Products with',
                highlight: slide.highlight || 'NanoFlows',
                description:
                  slide.description ||
                  'We architect secure, scalable digital platforms with AI-native thinking and measurable impact.',
                categories: parseStringArray(slide.categories),
                primaryCta: {
                  label: slide.primaryCtaLabel || slide.primary_cta_label || 'Talk to us',
                  route: slide.primaryCtaRoute || slide.primary_cta_route || '/contact',
                },
                secondaryCta:
                  slide.secondaryCtaLabel || slide.secondary_cta_label
                    ? {
                        label: slide.secondaryCtaLabel || slide.secondary_cta_label,
                        route: slide.secondaryCtaRoute || slide.secondary_cta_route || '/',
                      }
                    : undefined,
                trustBadges: parseStringArray(slide.trustBadges || slide.trust_badges),
              };
            }

            if (slide.variant === 'services') {
              const background = mapBackgroundFields(slide, fallbackServicesSlide);
              const servicesFromApi = Array.isArray(slide.services)
                ? slide.services
                    .filter((service) => service?.route)
                    .map((service) => ({
                      label: service.label || 'Service',
                      description: service.description || 'Explore this capability',
                      route: service.route || '/services',
                    }))
                : null;

              return {
                variant: 'services',
                ...background,
                title: slide.title || fallbackServicesSlide.title,
                subtitle: slide.subtitle ?? fallbackServicesSlide.subtitle,
                description: slide.description ?? fallbackServicesSlide.description,
                services: servicesFromApi?.length ? servicesFromApi : fallbackServicesSlide.services,
              };
            }
            return null;
          })
          .filter(Boolean) as HeroSlide[];

        const hasDefault = mappedSlides.some(isDefaultSlide);
        if (!hasDefault) {
          mappedSlides.unshift(fallbackDefaultSlide);
        }

        if (mappedSlides.length) {
          setSlides(mappedSlides);
          setCurrentSlide(0);
        }
      } catch (error) {
        console.error('Failed to load hero slides, using fallback data.', error);
        setSlides(fallbackSlides);
      }
    };

    fetchSlides();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
    }> = [];

    const particleCount = 100;
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 1,
      });
    }

    let animationFrameId: number;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle, i) => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle =
          theme === 'dark'
            ? `rgba(10, 186, 181, ${0.3 + Math.random() * 0.3})`
            : `rgba(0, 123, 255, ${0.2 + Math.random() * 0.2})`;
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[j].x - particle.x;
          const dy = particles[j].y - particle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 100) {
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle =
              theme === 'dark'
                ? `rgba(0, 255, 127, ${0.2 - distance / 500})`
                : `rgba(255, 0, 0, ${0.15 - distance / 700})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [theme]);

  useEffect(() => {
    if (currentSlide === 0) {
      setSlideAnimationStage('show');
      const slideLeftTimer = setTimeout(() => {
        setSlideAnimationStage('slideLeft');
      }, 2000);
      const showImageTimer = setTimeout(() => {
        setSlideAnimationStage('showImage');
      }, 3500);

      return () => {
        clearTimeout(slideLeftTimer);
        clearTimeout(showImageTimer);
      };
    } else {
      setSlideAnimationStage('show');
    }
  }, [currentSlide]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const typewriterPhrase = 'Powering Your Growth with Intelligent Automation';
  const typingSpeed = 120;
  const deletingSpeed = 60;
  const pauseDuration = 1400;

  useEffect(() => {
    if (!isServicesSlide) {
      setTypewriterText('');
      setIsDeleting(false);
    }
  }, [isServicesSlide]);

  useEffect(() => {
    if (!isServicesSlide) return;

    let timeout: ReturnType<typeof setTimeout> | undefined;

    if (!isDeleting && typewriterText.length < typewriterPhrase.length) {
      timeout = setTimeout(() => {
        setTypewriterText(typewriterPhrase.slice(0, typewriterText.length + 1));
      }, typingSpeed);
    } else if (!isDeleting && typewriterText.length === typewriterPhrase.length) {
      timeout = setTimeout(() => setIsDeleting(true), pauseDuration);
    } else if (isDeleting && typewriterText.length > 0) {
      timeout = setTimeout(() => {
        setTypewriterText(typewriterPhrase.slice(0, typewriterText.length - 1));
      }, deletingSpeed);
    } else if (isDeleting && typewriterText.length === 0) {
      setIsDeleting(false);
    }

    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [typewriterText, isDeleting, isServicesSlide]);

  const handleButtonClick = () => {
    navigate('/academy/login');
  };

  const scrollToElementById = (elementId: string) => {
    const element = document.getElementById(elementId);
    if (!element) return;
    const offset = 80;
    const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
    window.scrollTo({
      top: elementPosition - offset,
      behavior: 'smooth',
    });
  };

  const handleNavigate = (route: string) => {
    if (route.includes('#')) {
      const [path, hashFragment] = route.split('#');
      const targetPath = path || location.pathname;
      const hash = hashFragment;

      if (!hash) {
        navigate(targetPath);
        return;
      }

      if (location.pathname === targetPath) {
        if (location.hash !== `#${hash}`) {
          window.history.replaceState(null, '', `${targetPath}#${hash}`);
        }
        scrollToElementById(hash);
      } else {
        navigate(`${targetPath}#${hash}`);
        setTimeout(() => {
          scrollToElementById(hash);
        }, 200);
      }
      return;
    }

    navigate(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const textSlideLeftClass =
    slideAnimationStage === 'slideLeft' || slideAnimationStage === 'showImage'
      ? 'md:-translate-x-1/4 transition-transform duration-700 ease-in-out'
      : 'translate-x-0';

  const imageSlideInClass =
    slideAnimationStage === 'slideLeft' || slideAnimationStage === 'showImage'
      ? 'translate-x-0 opacity-100 transition-all duration-700 ease-in-out'
      : 'translate-x-full opacity-0';

  const renderShowcaseSlide = (slide: ShowcaseSlide) => {
    const secondaryCta = slide.secondaryCta;
    return (
    <div className="max-w-5xl mx-auto text-center md:text-left space-y-6">
      <div
        className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold tracking-[0.4em] uppercase ${
          theme === 'dark'
            ? 'text-electric-green bg-electric-green/10 border border-electric-green/30'
            : 'text-accent-blue bg-accent-blue/10 border border-accent-blue/20'
        }`}
      >
        {slide.preHeading}
      </div>
      <h1
        className={`text-4xl md:text-6xl font-orbitron font-bold leading-tight ${
          theme === 'dark' ? 'text-white text-glow-blue' : 'text-gray-900'
        }`}
      >
        {slide.heading}{' '}
        <span
          className={
            theme === 'dark' ? 'text-electric-green text-glow-green' : 'text-accent-red'
          }
        >
          {slide.highlight}
        </span>
      </h1>
      <p
        className={`text-base md:text-xl font-exo ${
          theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
        }`}
      >
        {slide.description}
      </p>
      <div
        className={`flex flex-wrap items-center justify-center md:justify-start gap-3 text-sm font-semibold uppercase tracking-widest ${
          theme === 'dark' ? 'text-gray-100' : 'text-gray-800'
        }`}
      >
        {slide.categories.map((item) => (
          <span
            key={item}
            className={`px-4 py-2 rounded-full ${
              theme === 'dark'
                ? 'bg-dark-card border border-electric-blue/30'
                : 'bg-white border border-gray-200 shadow-sm'
            }`}
          >
            {item}
          </span>
        ))}
      </div>
      <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
        <button
          onClick={() => handleNavigate(slide.primaryCta.route)}
          className={`group px-8 py-4 rounded-full font-exo font-semibold text-lg transition-all duration-300 flex items-center space-x-2 ${
            theme === 'dark'
              ? 'bg-electric-green text-black hover:glow-green hover:scale-105'
              : 'bg-accent-red text-white hover:glow-red hover:scale-105'
          }`}
        >
          <span>{slide.primaryCta.label}</span>
          <ArrowRight
            size={20}
            className="group-hover:translate-x-1 transition-transform duration-300"
          />
        </button>
        {secondaryCta && (
          <button
            onClick={() => handleNavigate(secondaryCta.route)}
            className={`px-8 py-4 rounded-full font-exo font-semibold text-lg border-2 transition-all duration-300 hover:scale-105 ${
              theme === 'dark'
                ? 'border-electric-blue text-electric-blue hover:bg-electric-blue hover:text-black'
                : 'border-accent-blue text-accent-blue hover:bg-accent-blue hover:text-white'
            }`}
          >
            {secondaryCta.label}
          </button>
        )}
      </div>
      <div
        className={`flex flex-wrap items-center justify-center md:justify-start gap-4 pt-4 ${
          theme === 'dark' ? 'text-gray-200' : 'text-gray-600'
        }`}
      >
        {slide.trustBadges.map((badge) => (
          <div
            key={badge}
            className={`px-5 py-2 rounded-xl text-sm font-semibold ${
              theme === 'dark'
                ? 'bg-dark-card border border-electric-blue/30'
                : 'bg-white border border-gray-200 shadow-sm'
            }`}
          >
            {badge}
          </div>
        ))}
      </div>
    </div>
  );
  };

  const renderServicesSlide = (slide: ServicesSlide) => {
    const { primary, highlight } = splitTitleForHighlight(slide.title);
    return (
      <div className="max-w-5xl mx-auto text-center space-y-6">
        <div
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold tracking-[0.4em] uppercase ${
            theme === 'dark'
              ? 'text-electric-green bg-electric-green/10 border border-electric-green/30'
              : 'text-accent-blue bg-accent-blue/10 border border-accent-blue/20'
          }`}
        >
          {slide.subtitle}
        </div>
        <h1
          className={`text-4xl md:text-6xl font-orbitron font-bold leading-tight ${
            theme === 'dark' ? 'text-white text-glow-blue' : 'text-gray-900'
          }`}
        >
          {primary}{' '}
          {highlight && (
            <span
              className={
                theme === 'dark' ? 'text-electric-green text-glow-green' : 'text-accent-red'
              }
            >
              {highlight}
            </span>
          )}
        </h1>
        {slide.description && (
          <p
            className={`text-base md:text-xl font-exo max-w-3xl mx-auto ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}
          >
            {slide.description}
          </p>
        )}
        <div className="flex flex-col items-center gap-4">
          <div className="typewriter-wrapper">
            <span
              className={`typewriter-text font-semibold ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}
            >
              {typewriterText}
            </span>
            <span
              className={`typewriter-cursor ${
                theme === 'dark' ? 'bg-electric-green' : 'bg-accent-red'
              }`}
            />
          </div>
        </div>
        <div
          className={`mt-8 flex flex-wrap items-center justify-center gap-3 text-sm font-semibold uppercase tracking-widest ${
            theme === 'dark' ? 'text-gray-100' : 'text-gray-800'
          }`}
        >
          {slide.services.map((service) => (
            <button
              key={service.label}
              onClick={() => handleNavigate(service.route)}
              className={`px-4 py-2 rounded-full border transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
                theme === 'dark'
                  ? 'bg-dark-card border-electric-blue/30 hover:border-electric-green focus-visible:ring-electric-green/60 focus-visible:ring-offset-black'
                  : 'bg-white border-gray-200 shadow-sm hover:border-accent-blue focus-visible:ring-accent-blue/60 focus-visible:ring-offset-white'
              }`}
            >
              {service.label}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-center justify-center gap-4 pt-6">
          <button
            onClick={() => handleNavigate('/contact')}
            className={`group px-8 py-4 rounded-full font-exo font-semibold text-lg transition-all duration-300 flex items-center space-x-2 ${
              theme === 'dark'
                ? 'bg-electric-green text-black hover:glow-green hover:scale-105'
                : 'bg-accent-red text-white hover:glow-red hover:scale-105'
            }`}
          >
            <span>Consult our expert</span>
            <ArrowRight
              size={20}
              className="group-hover:translate-x-1 transition-transform duration-300"
            />
          </button>
          <button
            onClick={() => handleNavigate('/services')}
            className={`px-8 py-4 rounded-full font-exo font-semibold text-lg border-2 transition-all duration-300 hover:scale-105 ${
              theme === 'dark'
                ? 'border-electric-blue text-electric-blue hover:bg-electric-blue hover:text-black'
                : 'border-accent-blue text-accent-blue hover:bg-accent-blue hover:text-white'
            }`}
          >
            Explore services
          </button>
        </div>
      </div>
    );
  };

  return (
    <section
      id="home"
      className={`relative min-h-screen flex items-center justify-center overflow-hidden ${
        theme === 'dark' ? 'bg-black' : 'bg-white'
      }`}
    >
      {hasCustomBackground && (
        <>
          <div
            className="absolute inset-0"
            aria-hidden="true"
            style={{
              backgroundImage: `url(${activeSlide?.backgroundImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              zIndex: 0,
              pointerEvents: 'none',
            }}
          />
          <div
            className="absolute inset-0"
            aria-hidden="true"
            style={{
              backgroundColor: backgroundOverlayColor,
              zIndex: 1,
              pointerEvents: 'none',
            }}
          />
        </>
      )}

      <canvas
        ref={canvasRef}
        className="particle-bg"
        style={{ zIndex: hasCustomBackground ? 2 : undefined }}
      />

      {!hasCustomBackground && <div className={`absolute inset-0 ${gradientMeshClass}`} />}

      <div className="container mx-auto px-6 py-20 md:py-1 relative z-10 max-w-4xl text-center">
        {activeSlide.variant === 'default' && (
          <div className="mb-6 inline-flex items-center space-x-2 px-4 py-2 rounded-full border animate-pulse-slow justify-center">
            <Sparkles
              size={20}
              className={theme === 'dark' ? 'text-electric-green' : 'text-accent-red'}
            />
            <span
              className={`text-sm font-exo ${
                theme === 'dark' ? 'text-electric-blue' : 'text-accent-blue'
              }`}
            >
              AI-Powered Innovation Platform
            </span>
          </div>
        )}

        {activeSlide.variant === 'default' ? (
          slideAnimationStage === 'show' ? (
            <div className="flex flex-col items-center justify-center min-h-[300px]">
              <h1
                className={`text-4xl md:text-7xl font-orbitron font-bold mb-6 animate-float ${
                  theme === 'dark' ? 'text-white text-glow-blue' : 'text-black'
                }`}
              >
                {defaultSlide.title}
                <br />
                <span
                  className={
                    theme === 'dark'
                      ? 'text-electric-green text-glow-green'
                      : 'text-accent-red'
                  }
                >
                  {defaultSlide.highlight}
                </span>
              </h1>
              <p
                className={`text-base md:text-xl font-exo mb-12 max-w-full px-4 md:max-w-2xl ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-800'
                }`}
              >
                {defaultSlide.subtitle}
              </p>
            </div>
          ) : (
            <div className="flex flex-col md:flex-row justify-center items-center gap-6 md:gap-8">
              <div
                className={`max-w-full md:max-w-xl text-center md:text-left flex flex-col justify-center ${textSlideLeftClass}`}
                style={{ minHeight: '300px' }}
              >
                <h1
                  className={`text-4xl md:text-7xl font-orbitron font-bold mb-6 animate-float ${
                    theme === 'dark' ? 'text-white text-glow-blue' : 'text-black'
                  }`}
                >
                {defaultSlide.title}
                  <br />
                  <span
                    className={
                      theme === 'dark'
                        ? 'text-electric-green text-glow-green'
                        : 'text-accent-red'
                    }
                  >
                    {defaultSlide.highlight}
                  </span>
                </h1>
                <p
                  className={`text-base md:text-xl font-exo mb-12 max-w-full px-4 md:max-w-2xl ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-800'
                  }`}
                >
                  {defaultSlide.subtitle}
                </p>
              </div>
             <img
  src={slideOneImageUrl}
  alt="Nano Flows AI Illustration"
  className={`max-w-xs md:max-w-sm rounded-lg shadow-lg ${imageSlideInClass} mx-auto md:mx-0`}
  style={{
    display: 'block',
    marginBottom: '1.5rem', // adds space below the image
    marginTop: '-4rem',   // moves the image slightly up
  }}
/>

            </div>
          )
        ) : activeSlide.variant === 'services' ? (
          renderServicesSlide(activeSlide)
        ) : (
          renderShowcaseSlide(activeSlide as ShowcaseSlide)
        )}

        {activeSlide.variant === 'default' && (
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {/* Apply waves animation to the slide buttons only */}
            <button
              onClick={handleButtonClick}
              className={`group px-8 py-4 rounded-full font-exo font-semibold text-lg transition-all duration-300 flex items-center space-x-2 ${
                theme === 'dark'
                  ? 'bg-electric-green text-black hover:glow-green hover:scale-105 waves-animation-dark'
                  : 'bg-accent-red text-white hover:glow-red hover:scale-105 waves-animation-light'
              }`}
            >
              <span>{activeSlide.buttonText}</span>
              <ArrowRight
                size={20}
                className="group-hover:translate-x-1 transition-transform duration-300"
              />
            </button>

            {/* Explore Solutions button without waves animation */}
            <button
              onClick={() => navigate('/academy/login')}
              className={`px-8 py-4 rounded-full font-exo font-semibold text-lg border-2 transition-all duration-300 hover:scale-105 ${
                theme === 'dark'
                  ? 'border-electric-blue text-electric-blue hover:bg-electric-blue hover:text-black'
                  : 'border-accent-blue text-accent-blue hover:bg-accent-blue hover:text-white'
              }`}
            >
              Explore Solutions
            </button>
          </div>
        )}

        <div className="flex justify-center space-x-4 mt-6 px-4 sm:px-0">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
              className={`w-4 h-4 rounded-full transition ${
                currentSlide === index
                  ? theme === 'dark'
                    ? 'bg-electric-green'
                    : 'bg-accent-red'
                  : theme === 'dark'
                  ? 'bg-gray-600'
                  : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes wavePulseDark {
          0% {
            box-shadow: 0 0 0 0 rgba(0, 255, 127, 0.7);
          }
          70% {
            box-shadow: 0 0 0 10px rgba(0, 255, 127, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(0, 255, 127, 0);
          }
        }

        @keyframes wavePulseLight {
          0% {
            box-shadow: 0 0 0 0 rgba(255, 0, 0, 0.7);
          }
          70% {
            box-shadow: 0 0 0 10px rgba(255, 0, 0, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(255, 0, 0, 0);
          }
        }

        .waves-animation-dark {
          animation: wavePulseDark 2.5s infinite;
          border-radius: 9999px;
          position: relative;
          z-index: 1;
        }

        .waves-animation-light {
          animation: wavePulseLight 2.5s infinite;
          border-radius: 9999px;
          position: relative;
          z-index: 1;
        }

        .typewriter-wrapper {
          font-family: 'Exo', 'Courier New', monospace;
          font-size: 1.125rem;
          display: flex;
          align-items: center;
          gap: 0.25rem;
          min-height: 2rem;
        }

        .typewriter-text {
          letter-spacing: 0.05em;
          text-align: center;
        }

        .typewriter-cursor {
          width: 2px;
          height: 1.25em;
          display: inline-block;
          animation: cursorBlink 1s steps(1) infinite;
        }

        @keyframes cursorBlink {
          0%, 49% {
            opacity: 1;
          }
          50%, 100% {
            opacity: 0;
          }
        }
      `}</style>
    </section>
  );
};

export default Hero;
