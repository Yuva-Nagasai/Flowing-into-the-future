import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingBag, ArrowRight, Sparkles, Zap, Shield, Download, Star, 
  CheckCircle, Quote, TrendingUp, Flame, ChevronLeft, ChevronRight,
  Award, Heart, Headphones, Globe, BookOpen, FileText, Send, Loader2
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import ShopNav from '../../components/shop/ShopNav';
import Footer from '../../components/Footer';

import heroImage1 from '@assets/stock_images/professional_softwar_e2de4ce6.jpg';
import heroImage2 from '@assets/stock_images/digital_marketplace__091cf657.jpg';
import heroImage3 from '@assets/stock_images/cloud_computing_inst_f98e3424.jpg';

interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  price: string;
  comparePrice?: string;
  category: string;
  images: string[];
  thumbnail?: string;
  stock: number;
  featured: boolean;
  author?: string;
  rating?: number;
  reviewCount?: number;
}

interface HeroSlide {
  id: number;
  title: string;
  highlight: string;
  description: string;
  image: string;
  ctaText: string;
  ctaLink: string;
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
}

const categories = [
  { name: 'Software & Tools', slug: 'software', icon: '💻', color: 'from-blue-500 to-cyan-500', count: 45 },
  { name: 'Templates', slug: 'templates', icon: '📄', color: 'from-pink-500 to-rose-500', count: 120 },
  { name: 'Online Courses', slug: 'courses', icon: '🎓', color: 'from-amber-500 to-orange-500', count: 85 },
  { name: 'E-Books', slug: 'ebooks', icon: '📚', color: 'from-green-500 to-emerald-500', count: 200 },
  { name: 'Design Assets', slug: 'design-assets', icon: '🎨', color: 'from-purple-500 to-violet-500', count: 150 },
  { name: 'Audio & Music', slug: 'audio', icon: '🎵', color: 'from-rose-500 to-pink-500', count: 75 },
];

const whyChooseUs = [
  { icon: Zap, title: 'Instant Access', description: 'Download immediately after purchase with no waiting time' },
  { icon: Shield, title: 'Secure Payment', description: '100% secure checkout with multiple payment options' },
  { icon: Download, title: 'Lifetime Access', description: 'Download anytime, forever with free updates included' },
  { icon: Headphones, title: '24/7 Support', description: 'Round-the-clock customer support for all your needs' },
  { icon: Award, title: 'Quality Guaranteed', description: 'All products are vetted for quality before listing' },
  { icon: Globe, title: 'Global Access', description: 'Access your products from anywhere in the world' },
];

const testimonials = [
  {
    id: 1,
    name: 'Sarah Johnson',
    role: 'UI/UX Designer',
    avatar: '👩‍💼',
    rating: 5,
    text: 'The design templates I purchased saved me weeks of work. Excellent quality and instant download - exactly what I needed for my client projects.'
  },
  {
    id: 2,
    name: 'Michael Chen',
    role: 'Software Developer',
    avatar: '👨‍💻',
    rating: 5,
    text: 'Incredible selection of development tools and courses. The quality is top-notch and the customer support team is very responsive.'
  },
  {
    id: 3,
    name: 'Emily Rodriguez',
    role: 'Content Creator',
    avatar: '👩‍🎨',
    rating: 5,
    text: 'I love the audio packs and video templates available here. They have helped me take my content to the next level!'
  },
  {
    id: 4,
    name: 'David Park',
    role: 'Marketing Manager',
    avatar: '👨‍💼',
    rating: 5,
    text: 'The marketing templates and e-books have been invaluable for our campaigns. Great value for money!'
  },
];

const heroSlides: HeroSlide[] = [
  {
    id: 1,
    title: 'Premium Digital',
    highlight: 'Products',
    description: 'Discover top-quality software, templates, courses, and digital tools. Instant access after purchase with lifetime downloads.',
    image: heroImage1,
    ctaText: 'Browse Products',
    ctaLink: '/shop/products',
    secondaryCtaText: 'View Categories',
    secondaryCtaLink: '/shop/categories'
  },
  {
    id: 2,
    title: 'Exclusive Digital',
    highlight: 'Deals',
    description: 'Get up to 50% off on premium digital products. Limited time offers on top-rated software, templates, and courses!',
    image: heroImage2,
    ctaText: 'View Deals',
    ctaLink: '/shop/deals',
    secondaryCtaText: 'See All Products',
    secondaryCtaLink: '/shop/products'
  },
  {
    id: 3,
    title: 'Instant Access',
    highlight: 'Guaranteed',
    description: 'Every digital product is carefully vetted for quality. Get immediate access after purchase with dedicated support.',
    image: heroImage3,
    ctaText: 'Explore Now',
    ctaLink: '/shop/products',
    secondaryCtaText: 'Learn More',
    secondaryCtaLink: '/shop/about'
  }
];

export default function ShopHome() {
  const { theme } = useTheme();
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [requestForm, setRequestForm] = useState({ name: '', email: '', product: '', message: '' });
  const [requestSubmitting, setRequestSubmitting] = useState(false);
  const [requestSuccess, setRequestSuccess] = useState(false);

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      const response = await fetch('/api/ecommerce/products?featured=true&limit=8');
      if (response.ok) {
        const data = await response.json();
        setFeaturedProducts(data.products || []);
      }
    } catch (error) {
      console.error('Failed to fetch featured products');
    } finally {
      setLoading(false);
    }
  };


  const handleRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRequestSubmitting(true);
    try {
      const response = await fetch('/api/ecommerce/product-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestForm)
      });
      if (response.ok) {
        setRequestSuccess(true);
        setRequestForm({ name: '', email: '', product: '', message: '' });
        setTimeout(() => setRequestSuccess(false), 5000);
      }
    } catch (error) {
      console.error('Failed to submit request');
    } finally {
      setRequestSubmitting(false);
    }
  };

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-slate-950' : 'bg-gray-50'}`}>
      <ShopNav />
      
      <section className="relative min-h-[600px] overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7 }}
            className="absolute inset-0"
          >
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${heroSlides[currentSlide].image})` }}
            />
            <div className={`absolute inset-0 ${
              theme === 'dark'
                ? 'bg-gradient-to-r from-slate-950/95 via-slate-900/80 to-transparent'
                : 'bg-gradient-to-r from-white/95 via-white/80 to-transparent'
            }`} />
          </motion.div>
        </AnimatePresence>

        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className={`absolute -top-40 -right-40 w-80 h-80 rounded-full blur-3xl ${
            theme === 'dark' ? 'bg-electric-blue/20' : 'bg-accent-blue/20'
          }`} />
          <div className={`absolute -bottom-40 -left-40 w-80 h-80 rounded-full blur-3xl ${
            theme === 'dark' ? 'bg-electric-green/20' : 'bg-accent-red/20'
          }`} />
        </div>
        
        <div className="container mx-auto px-4 lg:px-6 relative z-10 py-20">
          <div className="max-w-2xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6 ${
                  theme === 'dark'
                    ? 'bg-electric-green/10 text-electric-green border border-electric-green/30'
                    : 'bg-accent-blue/10 text-accent-blue border border-accent-blue/30'
                }`}>
                  <Sparkles className="w-4 h-4" />
                  Welcome to Digital Hub
                </span>
                
                <h1 className={`text-4xl md:text-5xl lg:text-6xl font-bold mb-6 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  {heroSlides[currentSlide].title}{' '}
                  <span className={`${
                    theme === 'dark'
                      ? 'text-transparent bg-clip-text bg-gradient-to-r from-electric-blue to-electric-green'
                      : 'text-transparent bg-clip-text bg-gradient-to-r from-accent-red to-accent-blue'
                  }`}>
                    {heroSlides[currentSlide].highlight}
                  </span>
                </h1>
                
                <p className={`text-lg md:text-xl mb-8 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  {heroSlides[currentSlide].description}
                </p>
                
                <div className="flex flex-col sm:flex-row items-start gap-4">
                  <Link
                    to={heroSlides[currentSlide].ctaLink}
                    className={`inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-lg transition-all ${
                      theme === 'dark'
                        ? 'bg-gradient-to-r from-electric-blue to-electric-green text-slate-900 hover:shadow-lg hover:shadow-electric-blue/25'
                        : 'bg-gradient-to-r from-accent-red to-accent-blue text-white hover:shadow-lg hover:shadow-accent-red/25'
                    }`}
                  >
                    <ShoppingBag className="w-5 h-5" />
                    {heroSlides[currentSlide].ctaText}
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                  
                  {heroSlides[currentSlide].secondaryCtaLink && (
                    <Link
                      to={heroSlides[currentSlide].secondaryCtaLink!}
                      className={`inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-lg transition-all border ${
                        theme === 'dark'
                          ? 'border-slate-600 text-gray-300 hover:bg-slate-800'
                          : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {heroSlides[currentSlide].secondaryCtaText}
                    </Link>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="flex items-center gap-3 mt-10">
              {heroSlides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`h-3 rounded-full transition-all duration-300 ${
                    currentSlide === index
                      ? theme === 'dark'
                        ? 'bg-electric-green w-8'
                        : 'bg-accent-red w-8'
                      : theme === 'dark'
                        ? 'bg-gray-600 w-3 hover:bg-gray-500'
                        : 'bg-gray-300 w-3 hover:bg-gray-400'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={prevSlide}
          className={`absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full transition-all z-20 ${
            theme === 'dark'
              ? 'bg-slate-800/80 text-white hover:bg-slate-700'
              : 'bg-white/80 text-gray-900 hover:bg-white shadow-lg'
          }`}
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={nextSlide}
          className={`absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full transition-all z-20 ${
            theme === 'dark'
              ? 'bg-slate-800/80 text-white hover:bg-slate-700'
              : 'bg-white/80 text-gray-900 hover:bg-white shadow-lg'
          }`}
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </section>

      <section className={`py-20 ${theme === 'dark' ? 'bg-slate-900/50' : 'bg-white'}`}>
        <div className="container mx-auto px-4 lg:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6 ${
                theme === 'dark'
                  ? 'bg-electric-blue/10 text-electric-blue border border-electric-blue/30'
                  : 'bg-accent-red/10 text-accent-red border border-accent-red/30'
              }`}>
                <BookOpen className="w-4 h-4" />
                Our Story
              </span>
              <h2 className={`text-3xl md:text-4xl font-bold mb-6 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Empowering Creators with{' '}
                <span className={
                  theme === 'dark'
                    ? 'text-transparent bg-clip-text bg-gradient-to-r from-electric-blue to-electric-green'
                    : 'text-transparent bg-clip-text bg-gradient-to-r from-accent-red to-accent-blue'
                }>
                  Premium Digital Products
                </span>
              </h2>
              <p className={`text-lg mb-6 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                Digital Hub was founded with a simple mission: to provide creators, developers, and businesses 
                with the highest quality digital products at affordable prices. We believe that great tools 
                shouldn't be out of reach.
              </p>
              <p className={`text-lg mb-8 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                Every product in our marketplace goes through a rigorous quality check to ensure you get 
                the best value for your investment. From templates to software, courses to e-books - we've 
                got everything you need to succeed.
              </p>
              <div className="grid grid-cols-3 gap-6">
                <div className="text-center">
                  <div className={`text-3xl font-bold ${
                    theme === 'dark' ? 'text-electric-green' : 'text-accent-blue'
                  }`}>50K+</div>
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Happy Customers</p>
                </div>
                <div className="text-center">
                  <div className={`text-3xl font-bold ${
                    theme === 'dark' ? 'text-electric-green' : 'text-accent-blue'
                  }`}>1,200+</div>
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Products</p>
                </div>
                <div className="text-center">
                  <div className={`text-3xl font-bold ${
                    theme === 'dark' ? 'text-electric-green' : 'text-accent-blue'
                  }`}>4.9</div>
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Avg Rating</p>
                </div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className={`rounded-2xl overflow-hidden ${
                theme === 'dark' ? 'bg-slate-800' : 'bg-gray-100'
              }`}>
                <img 
                  src={heroImage1} 
                  alt="Our Story" 
                  className="w-full h-[400px] object-cover"
                />
              </div>
              <div className={`absolute -bottom-6 -left-6 p-6 rounded-2xl ${
                theme === 'dark' ? 'bg-slate-800 border border-slate-700' : 'bg-white shadow-xl'
              }`}>
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-xl ${
                    theme === 'dark' ? 'bg-electric-green/20' : 'bg-accent-blue/10'
                  }`}>
                    <TrendingUp className={`w-6 h-6 ${
                      theme === 'dark' ? 'text-electric-green' : 'text-accent-blue'
                    }`} />
                  </div>
                  <div>
                    <p className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      Growing Every Day
                    </p>
                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      100+ new products monthly
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="text-center mb-12">
            <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6 ${
              theme === 'dark'
                ? 'bg-electric-green/10 text-electric-green border border-electric-green/30'
                : 'bg-accent-blue/10 text-accent-blue border border-accent-blue/30'
            }`}>
              <Award className="w-4 h-4" />
              Why Choose Us
            </span>
            <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              The Digital Hub Advantage
            </h2>
            <p className={`text-lg max-w-2xl mx-auto ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              We go above and beyond to ensure you have the best experience with our digital products
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {whyChooseUs.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`p-6 rounded-2xl transition-all hover:scale-[1.02] ${
                  theme === 'dark'
                    ? 'bg-slate-800/50 border border-slate-700 hover:border-electric-blue/50'
                    : 'bg-white border border-gray-200 shadow-sm hover:shadow-lg'
                }`}
              >
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 ${
                  theme === 'dark' ? 'bg-electric-blue/20' : 'bg-accent-blue/10'
                }`}>
                  <item.icon className={`w-7 h-7 ${
                    theme === 'dark' ? 'text-electric-blue' : 'text-accent-blue'
                  }`} />
                </div>
                <h3 className={`text-lg font-semibold mb-2 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  {item.title}
                </h3>
                <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className={`py-20 ${theme === 'dark' ? 'bg-slate-900/50' : 'bg-white'}`}>
        <div className="container mx-auto px-4 lg:px-6">
          <div className="flex items-center justify-between mb-8">
            <h2 className={`text-2xl md:text-3xl font-bold ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Shop by Category
            </h2>
            <Link
              to="/shop/categories"
              className={`flex items-center gap-1 font-medium ${
                theme === 'dark' ? 'text-electric-green hover:text-electric-green/80' : 'text-accent-blue hover:text-accent-blue/80'
              }`}
            >
              View All
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category, index) => (
              <motion.div
                key={category.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  to={`/shop/products?category=${category.slug}`}
                  className={`block p-6 rounded-2xl text-center transition-all hover:scale-105 ${
                    theme === 'dark'
                      ? 'bg-slate-800/50 hover:bg-slate-800 border border-slate-700'
                      : 'bg-gray-50 hover:bg-white border border-gray-200 shadow-sm'
                  }`}
                >
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${category.color} flex items-center justify-center text-3xl`}>
                    {category.icon}
                  </div>
                  <h3 className={`font-medium mb-1 ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    {category.name}
                  </h3>
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                    {category.count} products
                  </p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Flame className={`w-6 h-6 ${
                theme === 'dark' ? 'text-electric-green' : 'text-accent-red'
              }`} />
              <h2 className={`text-2xl md:text-3xl font-bold ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Featured Products
              </h2>
            </div>
            <Link
              to="/shop/products"
              className={`flex items-center gap-1 font-medium ${
                theme === 'dark' ? 'text-electric-green hover:text-electric-green/80' : 'text-accent-blue hover:text-accent-blue/80'
              }`}
            >
              View All
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className={`rounded-2xl overflow-hidden ${
                  theme === 'dark' ? 'bg-slate-800' : 'bg-gray-100'
                }`}>
                  <div className="aspect-square animate-pulse bg-gray-300 dark:bg-slate-700" />
                  <div className="p-4 space-y-3">
                    <div className="h-4 rounded animate-pulse bg-gray-300 dark:bg-slate-700" />
                    <div className="h-4 w-2/3 rounded animate-pulse bg-gray-300 dark:bg-slate-700" />
                  </div>
                </div>
              ))}
            </div>
          ) : featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link
                    to={`/shop/products/${product.slug}`}
                    className={`group block rounded-2xl overflow-hidden transition-all hover:scale-[1.02] ${
                      theme === 'dark'
                        ? 'bg-slate-800 hover:bg-slate-800/80 border border-slate-700'
                        : 'bg-white hover:bg-gray-50 border border-gray-200 shadow-sm'
                    }`}
                  >
                    <div className="aspect-square bg-gray-100 dark:bg-slate-700 relative overflow-hidden">
                      {product.thumbnail || product.images[0] ? (
                        <img
                          src={product.thumbnail || product.images[0]}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-6xl">
                          📦
                        </div>
                      )}
                      {product.featured && (
                        <span className={`absolute top-3 left-3 px-2 py-1 text-xs font-semibold rounded ${
                          theme === 'dark'
                            ? 'bg-electric-green text-slate-900'
                            : 'bg-accent-red text-white'
                        }`}>
                          Featured
                        </span>
                      )}
                      {product.comparePrice && (
                        <span className="absolute top-3 right-3 px-2 py-1 text-xs font-semibold rounded bg-red-500 text-white">
                          Sale
                        </span>
                      )}
                      <button className={`absolute bottom-3 right-3 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all ${
                        theme === 'dark' ? 'bg-slate-900/80 text-white' : 'bg-white/80 text-gray-900 shadow'
                      }`}>
                        <Heart className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="p-4">
                      <p className={`text-xs mb-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                        {product.category}
                      </p>
                      <h3 className={`font-semibold mb-1 line-clamp-1 ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>
                        {product.name}
                      </h3>
                      {product.author && (
                        <p className={`text-sm mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                          by {product.author}
                        </p>
                      )}
                      <div className="flex items-center gap-1 mb-3">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < (product.rating || 4)
                                ? 'text-yellow-400 fill-yellow-400'
                                : theme === 'dark' ? 'text-gray-600' : 'text-gray-300'
                            }`}
                          />
                        ))}
                        <span className={`text-xs ml-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                          ({product.reviewCount || 0})
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className={`text-lg font-bold ${
                            theme === 'dark' ? 'text-electric-green' : 'text-accent-blue'
                          }`}>
                            ${parseFloat(product.price).toFixed(2)}
                          </span>
                          {product.comparePrice && (
                            <span className="text-sm text-gray-500 line-through">
                              ${parseFloat(product.comparePrice).toFixed(2)}
                            </span>
                          )}
                        </div>
                        <button className={`p-2 rounded-lg transition-colors ${
                          theme === 'dark'
                            ? 'bg-electric-green/20 text-electric-green hover:bg-electric-green hover:text-slate-900'
                            : 'bg-accent-blue/10 text-accent-blue hover:bg-accent-blue hover:text-white'
                        }`}>
                          <ShoppingBag className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className={`text-center py-16 rounded-2xl ${
              theme === 'dark' ? 'bg-slate-800/50' : 'bg-gray-100'
            }`}>
              <ShoppingBag className={`w-16 h-16 mx-auto mb-4 ${
                theme === 'dark' ? 'text-gray-600' : 'text-gray-400'
              }`} />
              <h3 className={`text-xl font-semibold mb-2 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                No Products Yet
              </h3>
              <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                Check back soon for amazing products!
              </p>
            </div>
          )}
        </div>
      </section>

      <section className={`py-20 ${theme === 'dark' ? 'bg-slate-900/50' : 'bg-white'}`}>
        <div className="container mx-auto px-4 lg:px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6 ${
                theme === 'dark'
                  ? 'bg-electric-blue/10 text-electric-blue border border-electric-blue/30'
                  : 'bg-accent-red/10 text-accent-red border border-accent-red/30'
              }`}>
                <FileText className="w-4 h-4" />
                Product Request
              </span>
              <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Can't Find What You Need?
              </h2>
              <p className={`text-lg ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Let us know what digital product you're looking for and we'll try to source it for you
              </p>
            </div>

            <form onSubmit={handleRequestSubmit} className={`p-8 rounded-2xl ${
              theme === 'dark' ? 'bg-slate-800 border border-slate-700' : 'bg-gray-50 border border-gray-200'
            }`}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>Your Name</label>
                  <input
                    type="text"
                    value={requestForm.name}
                    onChange={(e) => setRequestForm({ ...requestForm, name: e.target.value })}
                    required
                    className={`w-full px-4 py-3 rounded-xl border ${
                      theme === 'dark'
                        ? 'bg-slate-700 border-slate-600 text-white'
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>Your Email</label>
                  <input
                    type="email"
                    value={requestForm.email}
                    onChange={(e) => setRequestForm({ ...requestForm, email: e.target.value })}
                    required
                    className={`w-full px-4 py-3 rounded-xl border ${
                      theme === 'dark'
                        ? 'bg-slate-700 border-slate-600 text-white'
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                    placeholder="john@example.com"
                  />
                </div>
              </div>
              <div className="mb-6">
                <label className={`block text-sm font-medium mb-2 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>Product You're Looking For</label>
                <input
                  type="text"
                  value={requestForm.product}
                  onChange={(e) => setRequestForm({ ...requestForm, product: e.target.value })}
                  required
                  className={`w-full px-4 py-3 rounded-xl border ${
                    theme === 'dark'
                      ? 'bg-slate-700 border-slate-600 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  placeholder="e.g., React Dashboard Template"
                />
              </div>
              <div className="mb-6">
                <label className={`block text-sm font-medium mb-2 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>Additional Details</label>
                <textarea
                  value={requestForm.message}
                  onChange={(e) => setRequestForm({ ...requestForm, message: e.target.value })}
                  rows={4}
                  className={`w-full px-4 py-3 rounded-xl border resize-none ${
                    theme === 'dark'
                      ? 'bg-slate-700 border-slate-600 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  placeholder="Tell us more about what you're looking for..."
                />
              </div>
              <button
                type="submit"
                disabled={requestSubmitting || requestSuccess}
                className={`w-full flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold text-lg transition-all ${
                  requestSuccess
                    ? 'bg-green-500 text-white'
                    : theme === 'dark'
                      ? 'bg-gradient-to-r from-electric-blue to-electric-green text-slate-900 hover:shadow-lg'
                      : 'bg-gradient-to-r from-accent-red to-accent-blue text-white hover:shadow-lg'
                }`}
              >
                {requestSubmitting ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : requestSuccess ? (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    Request Submitted!
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Submit Request
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="text-center mb-12">
            <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6 ${
              theme === 'dark'
                ? 'bg-electric-green/10 text-electric-green border border-electric-green/30'
                : 'bg-accent-blue/10 text-accent-blue border border-accent-blue/30'
            }`}>
              <Quote className="w-4 h-4" />
              Testimonials
            </span>
            <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              What Our Customers Say
            </h2>
            <p className={`text-lg max-w-2xl mx-auto ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Don't just take our word for it - hear from our satisfied customers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`p-6 rounded-2xl ${
                  theme === 'dark'
                    ? 'bg-slate-800/50 border border-slate-700'
                    : 'bg-white border border-gray-200 shadow-sm'
                }`}
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className={`mb-6 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                  "{testimonial.text}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-electric-blue to-electric-green flex items-center justify-center text-2xl">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <p className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      {testimonial.name}
                    </p>
                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className={`py-20 ${
        theme === 'dark'
          ? 'bg-gradient-to-r from-electric-blue/20 to-electric-green/20'
          : 'bg-gradient-to-r from-accent-red/10 to-accent-blue/10'
      }`}>
        <div className="container mx-auto px-4 lg:px-6 text-center">
          <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            Ready to Get Started?
          </h2>
          <p className={`text-lg mb-8 max-w-2xl mx-auto ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Join thousands of satisfied customers who have transformed their projects with our premium digital products
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/shop/products"
              className={`inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-lg transition-all ${
                theme === 'dark'
                  ? 'bg-gradient-to-r from-electric-blue to-electric-green text-slate-900 hover:shadow-lg hover:shadow-electric-blue/25'
                  : 'bg-gradient-to-r from-accent-red to-accent-blue text-white hover:shadow-lg hover:shadow-accent-red/25'
              }`}
            >
              Browse Products
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/shop/register"
              className={`inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-lg transition-all border ${
                theme === 'dark'
                  ? 'border-slate-600 text-white hover:bg-slate-800'
                  : 'border-gray-300 text-gray-700 hover:bg-white'
              }`}
            >
              Create Account
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
