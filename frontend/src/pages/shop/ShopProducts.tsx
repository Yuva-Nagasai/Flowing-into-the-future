import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { useShopAuth } from '../../contexts/ShopAuthContext';
import shopApi from '../../utils/shopApi';
import shopSampleProducts from '../../data/shopSampleProducts';
import type { Product, Category } from '../../types/shop';
import ShopNav from '../../components/shop/ShopNav';
import Footer from '../../components/Footer';
import SEOHead from '../../components/shop/SEOHead';
import {
  Search,
  Grid,
  List,
  Sparkles,
  ShoppingCart,
  Heart,
  ArrowRight,
  X,
  Code,
  FileText,
  Video,
  BookOpen,
  Music,
  Image,
  Palette,
  Package,
  SlidersHorizontal,
  Star,
  DollarSign,
  TrendingUp,
  Clock,
  Award,
  Download,
  Play,
  Key,
  ChevronDown,
  ChevronUp,
  BarChart3,
  Languages,
  Shield,
  Brain,
  Zap,
  Users,
  Layers
} from 'lucide-react';

const getCategoryIcon = (categorySlug: string) => {
  const iconMap: Record<string, any> = {
    'software-tools': Code,
    'software': Code,
    'templates': FileText,
    'online-courses': Video,
    'courses': Video,
    'e-books': BookOpen,
    'ebooks': BookOpen,
    'design-assets': Palette,
    'audio-music': Music,
    'audio': Music,
    'graphics': Image,
    'plugins': Code,
    default: Package
  };
  return iconMap[categorySlug] || iconMap.default;
};

const getCategoryColor = (categorySlug: string) => {
  const colorMap: Record<string, string> = {
    'software-tools': 'from-blue-500 to-cyan-600',
    'software': 'from-blue-500 to-cyan-600',
    'templates': 'from-purple-500 to-pink-600',
    'online-courses': 'from-orange-500 to-red-600',
    'courses': 'from-orange-500 to-red-600',
    'e-books': 'from-green-500 to-emerald-600',
    'ebooks': 'from-green-500 to-emerald-600',
    'design-assets': 'from-pink-500 to-rose-600',
    'audio-music': 'from-rose-500 to-pink-600',
    'audio': 'from-rose-500 to-pink-600',
    'graphics': 'from-cyan-500 to-blue-600',
    'plugins': 'from-indigo-500 to-purple-600',
    default: 'from-gray-500 to-gray-600'
  };
  return colorMap[categorySlug] || colorMap.default;
};

// Professional example products for digital hub
const exampleProducts: Product[] = shopSampleProducts;

const ShopProducts = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist, isAuthenticated } = useShopAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [selectedRating, setSelectedRating] = useState(0);
  const [selectedType, setSelectedType] = useState('');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [openPrice, setOpenPrice] = useState(true);
  const [openCategory, setOpenCategory] = useState(true);
  const [openRating, setOpenRating] = useState(true);
  const [openType, setOpenType] = useState(true);
  const [openSort, setOpenSort] = useState(true);
  const [selectedSegment, setSelectedSegment] = useState<SegmentId>('all');
  const [showAllSegments, setShowAllSegments] = useState(false);

  const MIN_PRICE = 0;
  const MAX_PRICE = 200;
  const [maxPrice, setMaxPrice] = useState<number>(MAX_PRICE);

  const ratingFilters = [
    { label: 'All Ratings', value: 0 },
    { label: '4+ Stars', value: 4 },
    { label: '3+ Stars', value: 3 },
    { label: '2+ Stars', value: 2 }
  ];

  const productTypes = [
    { label: 'All Types', value: '', icon: Package },
    { label: 'Downloadable', value: 'downloadable', icon: Download },
    { label: 'Streaming', value: 'streaming', icon: Play },
    { label: 'License Key', value: 'license', icon: Key }
  ];

  const sortOptions = [
    { value: 'newest', label: 'Newest First', icon: Clock },
    { value: 'price-low', label: 'Price: Low to High', icon: TrendingUp },
    { value: 'price-high', label: 'Price: High to Low', icon: TrendingUp },
    { value: 'popular', label: 'Most Popular', icon: TrendingUp },
    { value: 'rating', label: 'Top Rated', icon: Star },
    { value: 'bestseller', label: 'Best Sellers', icon: Award }
  ];

  const softwareSegments = [
    { id: 'all', label: 'All Products', icon: Sparkles },
    { id: 'productivity', label: 'Productivity & Collaboration', icon: Grid },
    { id: 'devtools', label: 'Developer Tools', icon: Code },
    { id: 'devops', label: 'DevOps & Infrastructure', icon: Package },
    { id: 'security', label: 'Security & Compliance', icon: Shield },
    { id: 'data', label: 'Data & Analytics', icon: BarChart3 },
    { id: 'ai', label: 'AI & Machine Learning', icon: Brain },
    { id: 'automation', label: 'Automation & Integration', icon: Zap },
    { id: 'support', label: 'Customer Support & CRM', icon: Users },
    { id: 'marketing', label: 'Marketing & Growth Tools', icon: TrendingUp },
    { id: 'finance', label: 'Finance & Operations', icon: DollarSign }
  ] as const;

  type SegmentId = (typeof softwareSegments)[number]['id'];

  const segmentProductMap: Record<Exclude<SegmentId, 'all'>, number[]> = {
    productivity: [2001, 2006],
    devtools: [2002, 2005, 2010],
    devops: [2001, 2005],
    security: [2002, 2005],
    data: [2003, 2004, 2007, 2009],
    ai: [2003, 2008, 2010],
    automation: [2001, 2006, 2008],
    support: [2006],
    marketing: [2004, 2006],
    finance: [2007, 2009]
  };

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  useEffect(() => {
    const category = searchParams.get('category');
    if (category) {
      setSelectedCategory(category);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, maxPrice, selectedRating, selectedType, sortBy, searchQuery]);

  const fetchCategories = async () => {
    try {
      const response = await shopApi.getCategories();
      if (response.success && response.data) {
        setCategories(response.data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params: any = {
        limit: 100
      };
      
      if (selectedCategory !== 'all') {
        params.category = selectedCategory;
      }
      
      if (searchQuery) {
        params.search = searchQuery;
      }
      
      const response = await shopApi.getProducts(params);
      
      let fetchedProducts: Product[] = [];
      
      if (response.success && response.data && response.data.length > 0) {
        fetchedProducts = response.data;
      } else {
        // If no products from API, use example products
        fetchedProducts = exampleProducts;
        }

      // Apply price filter using slider-style max price
      if (maxPrice < MAX_PRICE) {
        fetchedProducts = fetchedProducts.filter((p: Product) => {
          const price = parseFloat(p.price);
          return price >= MIN_PRICE && price <= maxPrice;
        });
      }

      // Apply rating filter
        if (selectedRating > 0) {
          fetchedProducts = fetchedProducts.filter((p: Product) => {
          const rating = parseFloat(p.averageRating || '0');
            return rating >= selectedRating;
          });
        }
        
      // Apply sort
      if (sortBy === 'newest') {
        fetchedProducts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      } else if (sortBy === 'price-low') {
        fetchedProducts.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
      } else if (sortBy === 'price-high') {
        fetchedProducts.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
      } else if (sortBy === 'rating') {
        fetchedProducts.sort((a, b) => parseFloat(b.averageRating || '0') - parseFloat(a.averageRating || '0'));
      } else if (sortBy === 'popular') {
        fetchedProducts.sort((a, b) => (b.totalReviews || 0) - (a.totalReviews || 0));
      } else if (sortBy === 'bestseller') {
        fetchedProducts.sort(
          (a, b) =>
            (b.totalSales || b.totalReviews || 0) - (a.totalSales || a.totalReviews || 0)
        );
      }

      setProducts(fetchedProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
      // On error, show example products
      setProducts(exampleProducts);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory = selectedCategory === 'all' || 
        product.category?.slug === selectedCategory ||
        product.category?.name?.toLowerCase().replace(/\s+/g, '-') === selectedCategory;
      
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        product.name.toLowerCase().includes(q) ||
        product.description.toLowerCase().includes(q) ||
        (product.shortDescription && product.shortDescription.toLowerCase().includes(q)) ||
        (product.tags && product.tags.some((tag) => tag.toLowerCase().includes(q)));
      
      // Rating filter is already applied in fetchProducts, but keep for consistency
      const matchesRating = selectedRating === 0 || parseFloat(product.averageRating || '0') >= selectedRating;
      
      // Product type filter (based on metadata or category)
      let matchesType = true;
      if (selectedType !== '') {
        if (selectedType === 'downloadable') {
          matchesType = product.metadata?.instantDownload === true || product.metadata?.fileType !== undefined;
        } else if (selectedType === 'streaming') {
          matchesType = product.metadata?.instantDownload === false && product.category?.slug === 'courses';
        } else if (selectedType === 'license') {
          matchesType = product.metadata?.license !== undefined;
        }
      }

      // Software segment filter (AI tools-style categories)
      let matchesSegment = true;
      if (selectedSegment !== 'all') {
        const allowedIds = segmentProductMap[selectedSegment as Exclude<SegmentId, 'all'>] || [];
        matchesSegment = allowedIds.includes(product.id);
      }
      
      return matchesCategory && matchesSearch && matchesRating && matchesType && matchesSegment;
    });
  }, [products, selectedCategory, selectedRating, selectedType, searchQuery, selectedSegment]);

  const handleCategoryChange = (categorySlug: string) => {
    setSelectedCategory(categorySlug);
    if (categorySlug === 'all') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', categorySlug);
    }
    setSearchParams(searchParams);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setMaxPrice(MAX_PRICE);
    setSelectedRating(0);
    setSelectedType('');
    setSortBy('newest');
    setSelectedSegment('all');
    setShowAllSegments(false);
    setSearchParams({});
  };

  const hasActiveFilters =
    searchQuery ||
    selectedCategory !== 'all' ||
    maxPrice < MAX_PRICE ||
    selectedRating > 0 ||
    selectedType !== '' ||
    selectedSegment !== 'all';

  const handleAddToCart = async (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      navigate('/shop/login', { state: { from: '/shop/products' } });
      return;
    }
    try {
      await addToCart(product.id, 1);
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const handleToggleWishlist = async (e: React.MouseEvent, productId: number) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      navigate('/shop/login', { state: { from: '/shop/products' } });
      return;
    }
    try {
      if (isInWishlist(productId)) {
        await removeFromWishlist(productId);
      } else {
        await addToWishlist(productId);
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
    }
  };

  const allCategories = [
    { id: 'all', label: 'All Products', icon: Sparkles, slug: 'all' },
    ...categories.map(cat => ({
      id: cat.slug,
      label: cat.name,
      icon: getCategoryIcon(cat.slug),
      slug: cat.slug
    }))
  ];

    return (
    <div className={`min-h-screen w-full max-w-full overflow-x-hidden flex flex-col ${theme === 'dark' ? 'bg-dark-bg' : 'bg-gray-50'}`}>
      <SEOHead
        title="Products - Digital Hub"
        description="Discover premium digital products including software, templates, courses, e-books, and design assets."
      />
      <ShopNav />

      <section className={`py-12 ${theme === 'dark' ? 'bg-dark-card' : 'bg-white'}`}>
        <div className="container mx-auto px-4 lg:px-8">
      <motion.div
            initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
      >
            <h1 className={`text-4xl md:text-5xl font-bold mb-4 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`} style={{ fontFamily: 'Orbitron, sans-serif' }}>
              Explore{' '}
              <span className={`bg-gradient-to-r ${
          theme === 'dark'
                  ? 'from-electric-green to-electric-blue'
                  : 'from-accent-red to-accent-blue'
              } bg-clip-text text-transparent`}>
                Digital Products
                </span>
            </h1>
            <p className={`text-lg md:text-xl max-w-3xl mx-auto ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
              Discover premium digital products, templates, and assets designed to accelerate your projects and business growth
            </p>
          </motion.div>

          <div className="max-w-3xl mx-auto mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className={`flex items-center gap-3 p-2 rounded-2xl ${
                theme === 'dark'
                  ? 'bg-dark-lighter'
                  : 'bg-gradient-to-br from-accent-red/10 via-white/80 to-accent-blue/10 border border-accent-red/30 shadow-[0_20px_60px_rgba(15,23,42,0.12)]'
              }`}
            >
              <div className="relative flex-1">
                <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${
                  theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                }`} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products by name, description, or tags..."
                  className={`w-full pl-12 pr-4 py-3 rounded-xl border-0 focus:outline-none focus:ring-2 ${
                    theme === 'dark'
                      ? 'bg-dark-card text-white placeholder-gray-500 focus:ring-electric-blue/30'
                      : 'bg-white text-gray-900 placeholder-gray-400 focus:ring-accent-red/30'
                  }`}
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className={`absolute right-4 top-1/2 -translate-y-1/2 ${
                      theme === 'dark'
                        ? 'text-gray-500 hover:text-white'
                        : 'text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowFilters(!showFilters)}
                className={`relative group overflow-hidden flex items-center gap-2 px-4 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  showFilters || hasActiveFilters
                    ? theme === 'dark'
                      ? 'bg-gradient-to-r from-electric-blue to-electric-green text-slate-900 shadow-lg shadow-electric-blue/25'
                      : 'bg-gradient-to-r from-accent-red to-accent-blue text-white shadow-lg shadow-accent-red/25'
                    : theme === 'dark'
                      ? 'bg-dark-card text-gray-400 hover:text-white'
                      : 'bg-white text-gray-600 hover:text-gray-900'
                }`}
              >
                <span className="relative z-10 flex items-center gap-2">
                  <SlidersHorizontal className="w-5 h-5" />
                  <span className="hidden sm:inline">Filters</span>
                </span>
                {(showFilters || hasActiveFilters) && (
                  <div
                    className={`absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 ${
                      theme === 'dark'
                        ? 'bg-gradient-to-r from-electric-green to-electric-blue'
                        : 'bg-gradient-to-r from-accent-blue to-accent-red'
                    }`}
                  />
                )}
              </motion.button>
            </motion.div>

            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className={`mt-4 p-6 rounded-2xl ${
                    theme === 'dark'
                      ? 'bg-dark-card border border-gray-800'
                      : 'bg-white border border-gray-200'
                  }`}
                >
                  <div className="space-y-6">

                    {/* Other Filters Grid */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {/* Price Range (collapsible, professional styling) */}
                      <div
                        className={`pt-3 border-t ${
                          theme === 'dark' ? 'border-gray-800/60' : 'border-gray-200'
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => setOpenPrice(!openPrice)}
                          className="w-full flex items-center justify-between py-2.5"
                        >
                          <span
                            className={`text-sm font-semibold flex items-center gap-2 ${
                              theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
                            }`}
                          >
                            <DollarSign className="w-4 h-4" />
                            Price
                          </span>
                          {openPrice ? (
                            <ChevronUp className="w-4 h-4 text-gray-500" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-gray-500" />
                          )}
                        </button>
                        {openPrice && (
                          <div className="mt-3 space-y-2 w-full md:max-w-sm">
                            <div
                              className={`flex items-center justify-between text-xs ${
                                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                              }`}
                            >
                              <span>₹{MIN_PRICE}</span>
                              <span>₹{maxPrice}</span>
                            </div>
                            <div className="relative w-full">
                              <input
                                type="range"
                                min={MIN_PRICE}
                                max={MAX_PRICE}
                                value={maxPrice}
                                onChange={(e) => setMaxPrice(Number(e.target.value))}
                                className={`w-full cursor-pointer appearance-none h-1.5 rounded-full
                                  ${
                                    theme === 'dark'
                                      ? 'bg-gradient-to-r from-electric-green/70 to-electric-blue/70'
                                      : 'bg-gradient-to-r from-accent-red/70 to-accent-blue/70'
                                  }
                                  [&::-webkit-slider-thumb]:appearance-none
                                  [&::-webkit-slider-thumb]:h-4
                                  [&::-webkit-slider-thumb]:w-4
                                  [&::-webkit-slider-thumb]:rounded-full
                                  [&::-webkit-slider-thumb]:border-2
                                  [&::-webkit-slider-thumb]:border-slate-950
                                  [&::-webkit-slider-thumb]:shadow
                                  ${
                                    theme === 'dark'
                                      ? '[&::-webkit-slider-thumb]:bg-electric-blue'
                                      : '[&::-webkit-slider-thumb]:bg-accent-red'
                                  }
                                  [&::-moz-range-thumb]:h-4
                                  [&::-moz-range-thumb]:w-4
                                  [&::-moz-range-thumb]:rounded-full
                                  [&::-moz-range-thumb]:border-2
                                  [&::-moz-range-thumb]:border-slate-950
                                  ${
                                    theme === 'dark'
                                      ? '[&::-moz-range-thumb]:bg-electric-blue'
                                      : '[&::-moz-range-thumb]:bg-accent-red'
                                  }
                                `}
                              />
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Rating (collapsible) */}
                      <div
                        className={`pt-3 border-t ${
                          theme === 'dark' ? 'border-gray-800/60' : 'border-gray-200'
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => setOpenRating(!openRating)}
                          className="w-full flex items-center justify-between py-2.5"
                        >
                          <span
                            className={`text-sm font-semibold flex items-center gap-2 ${
                              theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
                            }`}
                          >
                            <Star className="w-4 h-4" />
                            Rating
                          </span>
                          {openRating ? (
                            <ChevronUp className="w-4 h-4 text-gray-500" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-gray-500" />
                          )}
                        </button>
                        {openRating && (
                          <div className="mt-3 space-y-2">
                            {ratingFilters.map((filter) => {
                              const active = selectedRating === filter.value;
                              return (
                                <button
                                  key={filter.value}
                                  onClick={() => setSelectedRating(filter.value)}
                                  className={`relative group overflow-hidden w-full rounded-md px-4 py-2 text-xs sm:text-sm font-semibold transition-all duration-300 ${
                                    active
                                      ? theme === 'dark'
                                        ? 'bg-gradient-to-r from-electric-green to-electric-blue text-slate-900 shadow-lg shadow-electric-blue/25'
                                        : 'bg-gradient-to-r from-accent-red to-accent-blue text-white shadow-lg shadow-accent-red/25'
                                      : theme === 'dark'
                                        ? 'bg-dark-lighter text-gray-300 hover:text-white'
                                        : 'bg-gray-100 text-gray-700 hover:text-gray-900'
                                  }`}
                                >
                                  <span className="relative z-10 flex items-center justify-between">
                                    <span>{filter.label}</span>
                                    {active && (
                                      <span className="text-[10px] font-semibold opacity-80">✓</span>
                                    )}
                                  </span>
                                  {active && (
                                    <div
                                      className={`absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 ${
                                        theme === 'dark'
                                          ? 'bg-gradient-to-r from-electric-blue to-electric-green'
                                          : 'bg-gradient-to-r from-accent-blue to-accent-red'
                                      }`}
                                    />
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>

                      {/* Product Type (collapsible) */}
                      <div
                        className={`pt-3 border-t ${
                          theme === 'dark' ? 'border-gray-800/60' : 'border-gray-200'
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => setOpenType(!openType)}
                          className="w-full flex items-center justify-between py-2.5"
                        >
                          <span
                            className={`text-sm font-semibold flex items-center gap-2 ${
                              theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
                            }`}
                          >
                            <Layers className="w-4 h-4" />
                            Product Type
                          </span>
                          {openType ? (
                            <ChevronUp className="w-4 h-4 text-gray-500" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-gray-500" />
                          )}
                        </button>
                        {openType && (
                          <div className="mt-3 space-y-2">
                            {productTypes.map((type) => {
                              const active = selectedType === type.value;
                              return (
                                <button
                                  key={type.value || 'all'}
                                  onClick={() => setSelectedType(type.value)}
                                  className={`relative group overflow-hidden w-full rounded-md px-4 py-2 text-xs sm:text-sm font-semibold transition-all duration-300 ${
                                    active
                                      ? theme === 'dark'
                                        ? 'bg-gradient-to-r from-electric-green to-electric-blue text-slate-900 shadow-lg shadow-electric-blue/25'
                                        : 'bg-gradient-to-r from-accent-red to-accent-blue text-white shadow-lg shadow-accent-red/25'
                                      : theme === 'dark'
                                        ? 'bg-dark-lighter text-gray-300 hover:text-white'
                                        : 'bg-gray-100 text-gray-700 hover:text-gray-900'
                                  }`}
                                >
                                  <span className="relative z-10 flex items-center justify-between">
                                    <span className="flex items-center gap-2">
                                      {type.icon && <type.icon className="w-3.5 h-3.5" />}
                                      {type.label}
                                    </span>
                                    {active && (
                                      <span className="text-[10px] font-semibold opacity-80">✓</span>
                                    )}
                                  </span>
                                  {active && (
                                    <div
                                      className={`absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 ${
                                        theme === 'dark'
                                          ? 'bg-gradient-to-r from-electric-blue to-electric-green'
                                          : 'bg-gradient-to-r from-accent-blue to-accent-red'
                                      }`}
                                    />
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Sort By */}
                    <div
                      className={`pt-3 border-t ${
                        theme === 'dark' ? 'border-gray-800/60' : 'border-gray-200'
                      }`}
                    >
                      <h3
                        className={`text-sm font-semibold mb-3 ${
                          theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
                        }`}
                      >
                        Sort By
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {[
                          { id: 'newest', label: 'Newest First' },
                          { id: 'price-low', label: 'Price: Low to High' },
                          { id: 'price-high', label: 'Price: High to Low' },
                          { id: 'popular', label: 'Most Popular' },
                          { id: 'rating', label: 'Top Rated' },
                          { id: 'bestseller', label: 'Best Sellers' }
                        ].map((option) => (
                          <motion.button
                            key={option.id}
                            whileHover={{ scale: sortBy === option.id ? 1.05 : 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setSortBy(option.id as typeof sortBy)}
                            className={`relative group overflow-hidden px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300 ${
                              sortBy === option.id
                                ? theme === 'dark'
                                  ? 'bg-gradient-to-r from-electric-blue to-electric-green text-slate-900 shadow-lg shadow-electric-blue/25'
                                  : 'bg-gradient-to-r from-accent-red to-accent-blue text-white shadow-lg shadow-accent-red/25'
                                : theme === 'dark'
                                  ? 'bg-dark-lighter text-gray-400 hover:text-white'
                                  : 'bg-gray-100 text-gray-600 hover:text-gray-900'
                            }`}
                          >
                            <span className="relative z-10">{option.label}</span>
                            {sortBy === option.id && (
                              <div
                                className={`absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 ${
                                  theme === 'dark'
                                    ? 'bg-gradient-to-r from-electric-green to-electric-blue'
                                    : 'bg-gradient-to-r from-accent-blue to-accent-red'
                                }`}
                              />
                            )}
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    {/* Clear All Filters */}
                    <div className="flex items-center justify-end">
                      {hasActiveFilters && (
                        <button
                          onClick={clearFilters}
                          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium ${
                            theme === 'dark'
                              ? 'text-red-400 hover:bg-red-500/10'
                              : 'text-red-600 hover:bg-red-50'
                          }`}
                        >
                          <X className="w-4 h-4" />
                          Clear All Filters
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* AI Tools-style software segments (with View More) */}
            <div className="mt-4 mb-2 flex flex-wrap justify-center gap-2">
              {(showAllSegments ? softwareSegments : softwareSegments.slice(0, 6)).map((segment) => {
                const Icon = segment.icon;
                const isSelected = selectedSegment === segment.id;
                return (
                  <motion.button
                    key={segment.id}
                    whileHover={{ scale: isSelected ? 1.05 : 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedSegment(segment.id)}
                    className={`relative group overflow-hidden flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${
                      isSelected
                        ? theme === 'dark'
                          ? 'bg-gradient-to-r from-electric-blue to-electric-green text-slate-900 shadow-lg shadow-electric-blue/25'
                          : 'bg-gradient-to-r from-accent-red to-accent-blue text-white shadow-lg shadow-accent-red/25'
                        : theme === 'dark'
                          ? 'bg-dark-lighter text-gray-400 hover:text-white hover:bg-gray-700'
                          : 'bg-gray-100 text-gray-600 hover:text-gray-900 hover:bg-gray-200'
                    }`}
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      <Icon className="w-4 h-4" />
                      {segment.label}
                    </span>
                    {isSelected && (
                      <div
                        className={`absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 ${
                          theme === 'dark'
                            ? 'bg-gradient-to-r from-electric-green to-electric-blue'
                            : 'bg-gradient-to-r from-accent-blue to-accent-red'
                        }`}
                      />
                    )}
                  </motion.button>
                );
              })}
            </div>
            {softwareSegments.length > 6 && (
              <div className="mb-4 flex justify-center">
                <button
                  type="button"
                  onClick={() => setShowAllSegments(!showAllSegments)}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                    theme === 'dark'
                      ? 'border-gray-700 text-gray-400 hover:text-white hover:border-electric-blue'
                      : 'border-gray-300 text-gray-600 hover:text-gray-900 hover:border-accent-red'
                  }`}
                >
                  {showAllSegments ? 'View less' : 'View more'}
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className={`py-12 ${theme === 'dark' ? 'bg-dark-bg' : 'bg-gray-50'}`}>
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <span className={`px-4 py-2 rounded-lg text-sm ${
                theme === 'dark' ? 'bg-dark-card text-gray-400' : 'bg-white text-gray-600'
              }`}>
                <span className={`font-bold ${
                  theme === 'dark' ? 'text-electric-blue' : 'text-accent-red'
                }`}>{filteredProducts.length}</span> products found
                      </span>
            </div>
            <div className="flex items-center gap-2">
                  <button
                    onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-all ${
                      viewMode === 'grid'
                    ? theme === 'dark'
                      ? 'bg-electric-blue/20 text-electric-blue'
                      : 'bg-accent-red/10 text-accent-red'
                    : theme === 'dark'
                      ? 'text-gray-500 hover:text-white'
                      : 'text-gray-400 hover:text-gray-900'
                    }`}
                  >
                    <Grid className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-all ${
                      viewMode === 'list'
                    ? theme === 'dark'
                      ? 'bg-electric-blue/20 text-electric-blue'
                      : 'bg-accent-red/10 text-accent-red'
                    : theme === 'dark'
                      ? 'text-gray-500 hover:text-white'
                      : 'text-gray-400 hover:text-gray-900'
                    }`}
                  >
                    <List className="w-5 h-5" />
                  </button>
            </div>
                </div>

          {loading ? (
            <div className={`grid ${
              viewMode === 'grid' 
                ? 'md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                : 'grid-cols-1'
            } gap-6`}>
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className={`rounded-2xl overflow-hidden animate-pulse ${
                    theme === 'dark'
                      ? 'bg-dark-card/85 border border-gray-800/60 backdrop-blur-sm shadow-[0_25px_90px_rgba(0,0,0,0.5)]'
                      : 'bg-gradient-to-br from-accent-red/5 via-white to-accent-blue/10 border border-accent-red/30 shadow-[0_25px_80px_rgba(15,23,42,0.15)]'
                  }`}
                >
                  <div className={`aspect-square ${
                    theme === 'dark' ? 'bg-dark-lighter' : 'bg-gray-200'
                  }`} />
                  <div className="p-5 space-y-3">
                    <div className={`h-4 w-1/4 rounded ${
                      theme === 'dark' ? 'bg-dark-lighter' : 'bg-gray-200'
                    }`} />
                    <div className={`h-6 rounded ${
                      theme === 'dark' ? 'bg-dark-lighter' : 'bg-gray-200'
                    }`} />
                    <div className={`h-4 rounded ${
                      theme === 'dark' ? 'bg-dark-lighter' : 'bg-gray-200'
                    }`} />
                    <div className={`h-4 w-3/4 rounded ${
                      theme === 'dark' ? 'bg-dark-lighter' : 'bg-gray-200'
                    }`} />
                    <div className={`h-10 rounded mt-4 ${
                      theme === 'dark' ? 'bg-dark-lighter' : 'bg-gray-200'
                  }`} />
                </div>
              </div>
              ))}
            </div>
          ) : filteredProducts.length > 0 ? (
            <AnimatePresence mode="wait">
              <motion.div
                key={viewMode + selectedCategory + maxPrice + selectedRating + selectedType + sortBy + searchQuery}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`grid ${
                  viewMode === 'grid'
                    ? 'md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                    : 'grid-cols-1'
                } gap-6`}
              >
                {filteredProducts.map((product, index) => {
                  const categorySlug = product.category?.slug || 'default';
                  const Icon = getCategoryIcon(categorySlug);
                  const color = getCategoryColor(categorySlug);

                  if (viewMode === 'list') {
                    const listDiscount = product.comparePrice
                      ? Math.round(((parseFloat(product.comparePrice) - parseFloat(product.price)) / parseFloat(product.comparePrice)) * 100)
                      : 0;

                    return (
                <motion.div
                        key={product.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.03 }}
                        whileHover={{ x: 5 }}
                        className={`group flex items-center gap-6 p-6 rounded-2xl cursor-pointer transition-all border shadow-sm hover:shadow-xl overflow-hidden ${
                          theme === 'dark'
                            ? 'bg-dark-card border-gray-800 hover:border-electric-blue'
                            : 'bg-white border-gray-200 hover:border-accent-red/60'
                  }`}
                >
                        {/* Product Image */}
                        <div 
                          className="relative flex-shrink-0 w-32 h-32 rounded-xl overflow-hidden bg-gray-100 dark:bg-slate-800"
                          onClick={() => navigate(`/shop/products/${product.slug}`)}
                        >
                          {product.thumbnail || product.images?.[0] ? (
                            <img
                              src={product.thumbnail || product.images[0]}
                              alt={product.name}
                              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                            />
                          ) : (
                            <div className={`w-full h-full flex items-center justify-center ${
                              theme === 'dark' ? 'bg-slate-700' : 'bg-gray-200'
                            }`}>
                              <div className={`p-3 rounded-lg bg-gradient-to-br ${color}`}>
                                <Icon className="w-8 h-8 text-white" />
                    </div>
                  </div>
            )}
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                          
                          {/* Badges on image */}
                          <div className="absolute top-2 left-2 flex flex-col gap-1">
                            {product.featured && (
                              <span className={`px-2 py-0.5 text-xs font-bold rounded ${
                                theme === 'dark'
                                  ? 'bg-electric-green text-slate-900'
                                  : 'bg-accent-red text-white'
                  }`}>
                                Featured
                              </span>
                            )}
                            {listDiscount > 0 && (
                              <span className="px-2 py-0.5 text-xs font-bold rounded bg-red-500 text-white">
                                -{listDiscount}%
                              </span>
                            )}
                      </div>
                      </div>

                        {/* Product Info */}
                        <div className="flex-1 min-w-0">
                          {product.category && (
                            <p className={`text-xs font-semibold uppercase tracking-wide mb-1 ${
                              theme === 'dark' ? 'text-electric-green' : 'text-accent-blue'
                            }`}>
                              {product.category.name}
                            </p>
                          )}
                          <div className="flex items-start gap-3 mb-2">
                            <h3 
                              className={`text-xl font-bold line-clamp-1 cursor-pointer hover:underline ${
                                theme === 'dark' ? 'text-white' : 'text-gray-900'
                              }`}
                              onClick={() => navigate(`/shop/products/${product.slug}`)}
                            >
                              {product.name}
                            </h3>
                    </div>
                          <p className={`text-sm line-clamp-2 mb-3 ${
                            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                          }`}>
                            {product.shortDescription || product.description}
                          </p>
                          <div className="flex items-center gap-4 flex-wrap">
                            <div className="flex items-center gap-2">
                              <span className={`text-xl font-bold ${
                                theme === 'dark' ? 'text-electric-green' : 'text-accent-red'
                              }`}>
                                ${parseFloat(product.price).toFixed(2)}
                              </span>
                              {product.comparePrice && (
                                <span className={`text-sm line-through ${
                                  theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                                }`}>
                                  ${parseFloat(product.comparePrice).toFixed(2)}
                                </span>
                              )}
                  </div>
                            {product.averageRating && parseFloat(product.averageRating) > 0 && (
                              <div className="flex items-center gap-1">
                                <div className="flex items-center gap-0.5">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`w-4 h-4 ${
                                        i < Math.round(parseFloat(product.averageRating || '0'))
                                          ? 'text-yellow-400 fill-yellow-400'
                                          : theme === 'dark' ? 'text-gray-600' : 'text-gray-300'
                                      }`}
                                    />
                ))}
              </div>
                                <span className={`text-sm ${
                                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                                }`}>
                                  {parseFloat(product.averageRating).toFixed(1)} ({product.totalReviews || 0})
                                </span>
                </div>
                            )}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-3 flex-shrink-0">
                          {isAuthenticated && (
                            <>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={(e) => handleAddToCart(e, product)}
                                className={`p-3 rounded-lg transition-colors ${
                      theme === 'dark'
                                    ? 'bg-electric-blue/20 text-electric-blue hover:bg-electric-blue/30'
                                    : 'bg-accent-red/10 text-accent-red hover:bg-accent-red/20'
                                }`}
                              >
                                <ShoppingCart className="w-5 h-5" />
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={(e) => handleToggleWishlist(e, product.id)}
                                className={`p-3 rounded-lg transition-colors ${
                                  isInWishlist(product.id)
                                    ? 'text-red-500 bg-red-500/10'
                                    : theme === 'dark'
                                      ? 'text-gray-400 hover:text-red-500 hover:bg-red-500/10'
                                      : 'text-gray-600 hover:text-red-500 hover:bg-red-500/10'
                    }`}
                  >
                                <Heart className={`w-5 h-5 ${isInWishlist(product.id) ? 'fill-current' : ''}`} />
                              </motion.button>
                            </>
                          )}
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => navigate(`/shop/products/${product.slug}`)}
                            className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-semibold transition-all ${
                      theme === 'dark'
                                ? 'bg-gradient-to-r from-electric-green to-electric-blue text-dark-bg'
                                : 'bg-gradient-to-r from-accent-red to-accent-blue text-white'
                    }`}
                  >
                            View
                            <ArrowRight className="w-4 h-4" />
                          </motion.button>
                </div>
              </motion.div>
                    );
                  }

                  const discount = product.comparePrice
                    ? Math.round(((parseFloat(product.comparePrice) - parseFloat(product.price)) / parseFloat(product.comparePrice)) * 100)
                    : 0;

                  return (
            <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.03 }}
                      whileHover={{ y: -8 }}
                      className={`group flex flex-col h-full rounded-2xl overflow-hidden cursor-pointer transition-all ${
                        theme === 'dark'
                          ? 'bg-dark-card/90 border border-gray-800/60 backdrop-blur-md shadow-[0_25px_90px_rgba(0,0,0,0.55)] hover:border-electric-blue/60 hover:shadow-[0_15px_60px_rgba(0,240,255,0.25)]'
                          : 'bg-gradient-to-br from-accent-red/5 via-white to-accent-blue/10 border border-accent-red/30 shadow-[0_25px_80px_rgba(15,23,42,0.12)] hover:border-accent-red/60 hover:shadow-[0_25px_90px_rgba(15,23,42,0.2)]'
                }`}
              >
                      {/* Product Image */}
                      <div 
                        className="relative aspect-[4/3] overflow-hidden bg-gray-100 dark:bg-slate-800"
                        onClick={() => navigate(`/shop/products/${product.slug}`)}
                      >
                        {product.thumbnail || product.images?.[0] ? (
                    <img
                            src={product.thumbnail || product.images[0]}
                            alt={product.name}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                          <div className={`w-full h-full flex items-center justify-center ${
                            theme === 'dark' ? 'bg-slate-700' : 'bg-gray-200'
                    }`}>
                            <div className={`p-4 rounded-lg bg-gradient-to-br ${color}`}>
                              <Icon className="w-8 h-8 text-white" />
                    </div>
                </div>
                        )}

                        {/* Overlay on hover */}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />

                        {/* Badges */}
                        <div className="absolute top-2 left-2 flex flex-col gap-1.5 z-10">
                          {product.featured && (
                            <span className={`px-2 py-0.5 text-xs font-bold rounded shadow-lg ${
                              theme === 'dark'
                                ? 'bg-electric-green text-slate-900'
                                : 'bg-accent-red text-white'
                      }`}>
                        Featured
                      </span>
                    )}
                          {discount > 0 && (
                            <span className="px-2 py-0.5 text-xs font-bold rounded bg-red-500 text-white shadow-lg">
                              -{discount}%
                            </span>
                          )}
                  </div>

                        {/* Quick Actions */}
                        <div className="absolute top-2 right-2 flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                          {isAuthenticated && (
                            <>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={(e) => handleToggleWishlist(e, product.id)}
                                className={`p-2 rounded-full shadow-lg transition-colors ${
                                  isInWishlist(product.id)
                                    ? 'bg-red-500 text-white'
                                    : theme === 'dark'
                                      ? 'bg-slate-800/90 text-white hover:bg-red-500'
                                      : 'bg-white/90 text-gray-700 hover:bg-red-500 hover:text-white'
                                }`}
                              >
                                <Heart className={`w-3.5 h-3.5 ${isInWishlist(product.id) ? 'fill-current' : ''}`} />
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={(e) => handleAddToCart(e, product)}
                                className={`p-2 rounded-full shadow-lg transition-colors ${
                                  theme === 'dark'
                                    ? 'bg-electric-green text-slate-900 hover:bg-electric-green/80'
                                    : 'bg-accent-blue text-white hover:bg-accent-blue/80'
                                }`}
                              >
                                <ShoppingCart className="w-3.5 h-3.5" />
                              </motion.button>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Product Info */}
                      <div className="p-4 flex flex-col flex-1">
                        {/* Category */}
                        {product.category && (
                          <p className={`text-xs font-semibold uppercase tracking-wide mb-1 ${
                            theme === 'dark' ? 'text-electric-green' : 'text-accent-blue'
                          }`}>
                            {product.category.name}
                    </p>
                  )}

                        {/* Title */}
                        <h3 
                          className={`text-base font-bold mb-1.5 line-clamp-2 cursor-pointer hover:underline ${
                            theme === 'dark' ? 'text-white' : 'text-gray-900'
                          }`}
                          onClick={() => navigate(`/shop/products/${product.slug}`)}
                        >
                          {product.name}
                        </h3>

                        {/* Description */}
                        <p className={`text-xs mb-3 line-clamp-2 flex-grow ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          {product.shortDescription || product.description}
                        </p>

                        {/* Rating */}
                        {product.averageRating && parseFloat(product.averageRating) > 0 && (
                          <div className="flex items-center gap-1.5 mb-3">
                    <div className="flex items-center gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                                  className={`w-3 h-3 ${
                                    i < Math.round(parseFloat(product.averageRating || '0'))
                              ? 'text-yellow-400 fill-yellow-400'
                              : theme === 'dark' ? 'text-gray-600' : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                            <span className={`text-xs ${
                              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                            }`}>
                              {parseFloat(product.averageRating).toFixed(1)} ({product.totalReviews || 0})
                    </span>
                  </div>
                        )}

                        {/* Price and CTA */}
                        <div className="mt-auto pt-3 border-t border-gray-200 dark:border-gray-800">
                          <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                              <span className={`text-xl font-bold ${
                                theme === 'dark' ? 'text-electric-green' : 'text-accent-red'
                              }`}>
                                ${parseFloat(product.price).toFixed(2)}
                      </span>
                              {product.comparePrice && (
                                <span className={`text-xs line-through ${
                                  theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                        }`}>
                                  ${parseFloat(product.comparePrice).toFixed(2)}
                          </span>
                        )}
                      </div>
                  </div>

                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                      onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/shop/products/${product.slug}`);
                      }}
                            className={`relative group overflow-hidden w-full py-2.5 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-300 ${
                        theme === 'dark'
                                ? 'bg-gradient-to-r from-electric-green to-electric-blue text-dark-bg'
                                : 'bg-gradient-to-r from-accent-red to-accent-blue text-white'
                            }`}
                          >
                            <span className="relative z-10 flex items-center gap-2">
                              <ShoppingCart className="w-3.5 h-3.5" />
                              View Details
                            </span>
                            <div
                              className={`absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 ${
                                theme === 'dark'
                                  ? 'bg-gradient-to-r from-electric-blue to-electric-green'
                                  : 'bg-gradient-to-r from-accent-blue to-accent-red'
                              }`}
                            />
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            </AnimatePresence>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`text-center py-20 rounded-2xl ${
                theme === 'dark' ? 'bg-dark-card' : 'bg-white'
              }`}
            >
              <Search className={`w-16 h-16 mx-auto mb-4 ${
                theme === 'dark' ? 'text-gray-600' : 'text-gray-400'
              }`} />
              <h3 className={`text-xl font-bold mb-2 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>No products found</h3>
              <p className={`text-sm mb-6 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Try adjusting your search or filter criteria
              </p>
              <button
                onClick={clearFilters}
                className={`px-6 py-3 rounded-xl font-semibold ${
                        theme === 'dark'
                    ? 'bg-electric-blue text-black'
                    : 'bg-accent-red text-white'
                      }`}
                    >
                Clear All Filters
              </button>
            </motion.div>
        )}
        </div>
      </section>

      <Footer variant="shop" />
    </div>
  );
};

export default ShopProducts;
