import { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Grid, List, ShoppingCart, Heart, Search, X, ChevronDown, Star, 
  SlidersHorizontal, Download, Zap, Shield, FileText, Video, 
  BookOpen, Code, Music, Image, Palette, Package, Eye, 
  TrendingUp, Award, Clock, Check, Sparkles, Filter, ChevronRight
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useShopAuth } from '../../contexts/ShopAuthContext';
import ShopNav from '../../components/shop/ShopNav';
import Footer from '../../components/Footer';

interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  price: string;
  comparePrice?: string;
  category: string;
  categoryId?: number;
  images: string[];
  thumbnail?: string;
  stock: number;
  featured: boolean;
  author?: string;
  rating?: number;
  reviewCount?: number;
  averageRating?: string;
  totalReviews?: number;
  tags?: string[];
  metadata?: {
    fileType?: string;
    fileSize?: string;
    license?: string;
    instantDownload?: boolean;
    format?: string[];
    duration?: string;
    pages?: number;
    lastUpdated?: string;
  };
  createdAt?: string;
}

const categories = [
  { name: 'All Categories', value: '', count: 0, icon: Package },
  { name: 'Software & Tools', value: 'software', count: 45, icon: Code },
  { name: 'Templates', value: 'templates', count: 120, icon: FileText },
  { name: 'Online Courses', value: 'courses', count: 85, icon: Video },
  { name: 'E-Books', value: 'ebooks', count: 200, icon: BookOpen },
  { name: 'Design Assets', value: 'design-assets', count: 150, icon: Palette },
  { name: 'Audio & Music', value: 'audio', count: 75, icon: Music },
  { name: 'Graphics', value: 'graphics', count: 90, icon: Image },
  { name: 'Plugins', value: 'plugins', count: 60, icon: Code },
  { name: 'Other', value: 'other', count: 30, icon: Package },
];

const priceRanges = [
  { label: 'All Prices', min: 0, max: Infinity },
  { label: 'Under $10', min: 0, max: 10 },
  { label: '$10 - $25', min: 10, max: 25 },
  { label: '$25 - $50', min: 25, max: 50 },
  { label: '$50 - $100', min: 50, max: 100 },
  { label: 'Over $100', min: 100, max: Infinity },
];

const ratingFilters = [
  { label: 'All Ratings', value: 0 },
  { label: '4+ Stars', value: 4 },
  { label: '3+ Stars', value: 3 },
  { label: '2+ Stars', value: 2 },
];

const sortOptions = [
  { value: 'newest', label: 'Newest First', icon: Clock },
  { value: 'price-low', label: 'Price: Low to High', icon: TrendingUp },
  { value: 'price-high', label: 'Price: High to Low', icon: TrendingUp },
  { value: 'popular', label: 'Most Popular', icon: TrendingUp },
  { value: 'rating', label: 'Top Rated', icon: Star },
  { value: 'bestseller', label: 'Best Sellers', icon: Award },
];

const productTypes = [
  { label: 'All Types', value: '' },
  { label: 'Downloadable', value: 'downloadable' },
  { label: 'Streaming', value: 'streaming' },
  { label: 'License Key', value: 'license' },
];

const getProductTypeBadge = (category: string) => {
  const typeMap: Record<string, { label: string; color: string; icon: any }> = {
    'software': { label: 'Software', color: 'bg-blue-500', icon: Code },
    'templates': { label: 'Template', color: 'bg-purple-500', icon: FileText },
    'courses': { label: 'Course', color: 'bg-orange-500', icon: Video },
    'ebooks': { label: 'E-Book', color: 'bg-green-500', icon: BookOpen },
    'design-assets': { label: 'Design', color: 'bg-pink-500', icon: Palette },
    'audio': { label: 'Audio', color: 'bg-rose-500', icon: Music },
    'graphics': { label: 'Graphics', color: 'bg-cyan-500', icon: Image },
    'plugins': { label: 'Plugin', color: 'bg-indigo-500', icon: Code },
  };
  return typeMap[category] || { label: 'Digital', color: 'bg-gray-500', icon: Package };
};

export default function ShopProducts() {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist, isAuthenticated } = useShopAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedPriceRange, setSelectedPriceRange] = useState(0);
  const [selectedRating, setSelectedRating] = useState(0);
  const [selectedType, setSelectedType] = useState('');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'newest');
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const selectedCategory = searchParams.get('category') || '';

  useEffect(() => {
    fetchProducts();
    fetchFeaturedProducts();
  }, [searchParams, selectedPriceRange, sortBy, selectedRating, selectedType]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      const category = searchParams.get('category');
      const search = searchParams.get('search');
      
      if (category) params.append('category', category);
      if (search) params.append('search', search);
      params.append('sort', sortBy);
      
      const response = await fetch(`/api/ecommerce/products?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        let fetchedProducts = data.data?.items || data.products || [];
        
        const priceRange = priceRanges[selectedPriceRange];
        if (priceRange.min > 0 || priceRange.max < Infinity) {
          fetchedProducts = fetchedProducts.filter((p: Product) => {
            const price = parseFloat(p.price);
            return price >= priceRange.min && price <= priceRange.max;
          });
        }

        if (selectedRating > 0) {
          fetchedProducts = fetchedProducts.filter((p: Product) => {
            const rating = p.rating || parseFloat(p.averageRating || '0');
            return rating >= selectedRating;
          });
        }
        
        setProducts(fetchedProducts);
      }
    } catch (error) {
      console.error('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const fetchFeaturedProducts = async () => {
    try {
      const response = await fetch('/api/ecommerce/products?featured=true&limit=6');
      if (response.ok) {
        const data = await response.json();
        setFeaturedProducts(data.products || data.data?.items || []);
      }
    } catch (error) {
      console.error('Failed to fetch featured products');
    }
  };

  const handleCategoryChange = (category: string) => {
    if (category) {
      searchParams.set('category', category);
    } else {
      searchParams.delete('category');
    }
    setSearchParams(searchParams);
    setShowMobileFilters(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      searchParams.set('search', searchQuery.trim());
    } else {
      searchParams.delete('search');
    }
    setSearchParams(searchParams);
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
    searchParams.set('sort', value);
    setSearchParams(searchParams);
  };

  const clearFilters = () => {
    setSearchParams(new URLSearchParams());
    setSearchQuery('');
    setSelectedPriceRange(0);
    setSelectedRating(0);
    setSelectedType('');
    setSortBy('newest');
  };

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product.id);
  };

  const handleToggleWishlist = async (e: React.MouseEvent, productId: number) => {
    e.preventDefault();
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
      console.error('Failed to update wishlist');
    }
  };

  const activeFiltersCount = (selectedCategory ? 1 : 0) + (selectedPriceRange > 0 ? 1 : 0) + (searchParams.get('search') ? 1 : 0) + (selectedRating > 0 ? 1 : 0) + (selectedType ? 1 : 0);

  const trustIndicators = [
    { icon: Download, label: 'Instant Download', description: 'Get your files immediately' },
    { icon: Shield, label: 'Secure Payment', description: '100% protected checkout' },
    { icon: Zap, label: 'Lifetime Access', description: 'Download anytime, forever' },
    { icon: Award, label: 'Quality Assured', description: 'Verified digital products' },
  ];

  const renderProductCard = (product: Product, index: number) => {
    const typeBadge = getProductTypeBadge(product.category);
    const CategoryIcon = typeBadge.icon;
    const productRating = product.rating || parseFloat(product.averageRating || '4.5');
    const reviewCount = product.reviewCount || product.totalReviews || 0;
    const isWishlisted = isInWishlist(product.id);
    const discountPercent = product.comparePrice 
      ? Math.round((1 - parseFloat(product.price) / parseFloat(product.comparePrice)) * 100)
      : 0;

    return (
      <motion.div
        key={product.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.02 }}
        className="group"
      >
        <div className={`relative rounded-2xl overflow-hidden transition-all duration-300 ${
          viewMode === 'list' ? 'flex' : ''
        } ${
          theme === 'dark'
            ? 'bg-slate-800/80 border border-slate-700 hover:border-electric-blue/50 hover:shadow-lg hover:shadow-electric-blue/10'
            : 'bg-white border border-gray-200 hover:border-blue-300 hover:shadow-xl'
        }`}>
          <Link
            to={`/shop/products/${product.slug}`}
            className={`block ${viewMode === 'list' ? 'flex flex-1' : ''}`}
          >
            <div className={`relative overflow-hidden ${
              viewMode === 'list' ? 'w-56 flex-shrink-0' : 'aspect-[4/3]'
            }`}>
              {product.thumbnail || product.images?.[0] ? (
                <img
                  src={product.thumbnail || product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className={`w-full h-full flex items-center justify-center ${
                  theme === 'dark' ? 'bg-slate-700' : 'bg-gray-100'
                }`}>
                  <CategoryIcon className={`w-16 h-16 ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`} />
                </div>
              )}
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                <span className={`px-2.5 py-1 text-xs font-semibold rounded-full flex items-center gap-1 text-white ${typeBadge.color}`}>
                  <CategoryIcon className="w-3 h-3" />
                  {typeBadge.label}
                </span>
                {product.featured && (
                  <span className={`px-2.5 py-1 text-xs font-semibold rounded-full flex items-center gap-1 ${
                    theme === 'dark'
                      ? 'bg-electric-green text-slate-900'
                      : 'bg-amber-400 text-amber-900'
                  }`}>
                    <Sparkles className="w-3 h-3" />
                    Featured
                  </span>
                )}
                {discountPercent > 0 && (
                  <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-red-500 text-white">
                    -{discountPercent}%
                  </span>
                )}
              </div>

              <div className="absolute top-3 right-3 flex flex-col gap-2">
                <button
                  onClick={(e) => handleToggleWishlist(e, product.id)}
                  className={`p-2 rounded-full transition-all ${
                    isWishlisted
                      ? 'bg-red-500 text-white'
                      : theme === 'dark'
                        ? 'bg-slate-900/80 text-white hover:bg-red-500'
                        : 'bg-white/90 text-gray-900 shadow-sm hover:bg-red-500 hover:text-white'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
                </button>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setQuickViewProduct(product);
                  }}
                  className={`p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all ${
                    theme === 'dark'
                      ? 'bg-slate-900/80 text-white hover:bg-electric-blue'
                      : 'bg-white/90 text-gray-900 shadow-sm hover:bg-blue-500 hover:text-white'
                  }`}
                >
                  <Eye className="w-4 h-4" />
                </button>
              </div>

              <div className="absolute bottom-3 left-3 right-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                  theme === 'dark' ? 'bg-slate-900/90 text-white' : 'bg-white/90 text-gray-900'
                }`}>
                  <Download className="w-3 h-3" />
                  Instant Download
                </div>
                {product.metadata?.license && (
                  <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                    theme === 'dark' ? 'bg-slate-900/90 text-white' : 'bg-white/90 text-gray-900'
                  }`}>
                    <Check className="w-3 h-3" />
                    {product.metadata.license}
                  </div>
                )}
              </div>
            </div>
            
            <div className={`p-5 flex-1 flex flex-col ${viewMode === 'list' ? '' : ''}`}>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(productRating)
                            ? 'text-yellow-400 fill-yellow-400'
                            : theme === 'dark' ? 'text-gray-600' : 'text-gray-300'
                        }`}
                      />
                    ))}
                    <span className={`text-sm ml-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                      ({reviewCount})
                    </span>
                  </div>
                  {product.metadata?.fileType && (
                    <span className={`text-xs px-2 py-0.5 rounded ${
                      theme === 'dark' ? 'bg-slate-700 text-gray-300' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {product.metadata.fileType.toUpperCase()}
                    </span>
                  )}
                </div>
                
                <h3 className={`font-semibold text-lg mb-1 line-clamp-2 group-hover:text-electric-blue transition-colors ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  {product.name}
                </h3>
                
                {product.author && (
                  <p className={`text-sm mb-2 flex items-center gap-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                    <span className="w-5 h-5 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs">
                      {product.author.charAt(0).toUpperCase()}
                    </span>
                    {product.author}
                  </p>
                )}
                
                <p className={`text-sm mb-4 line-clamp-2 ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {product.shortDescription || product.description}
                </p>

                {product.metadata && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {product.metadata.pages && (
                      <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded ${
                        theme === 'dark' ? 'bg-slate-700/50 text-gray-300' : 'bg-gray-50 text-gray-600'
                      }`}>
                        <BookOpen className="w-3 h-3" />
                        {product.metadata.pages} pages
                      </span>
                    )}
                    {product.metadata.duration && (
                      <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded ${
                        theme === 'dark' ? 'bg-slate-700/50 text-gray-300' : 'bg-gray-50 text-gray-600'
                      }`}>
                        <Clock className="w-3 h-3" />
                        {product.metadata.duration}
                      </span>
                    )}
                    {product.metadata.fileSize && (
                      <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded ${
                        theme === 'dark' ? 'bg-slate-700/50 text-gray-300' : 'bg-gray-50 text-gray-600'
                      }`}>
                        <Download className="w-3 h-3" />
                        {product.metadata.fileSize}
                      </span>
                    )}
                  </div>
                )}
              </div>
              
              <div className={`flex items-center justify-between pt-4 border-t ${
                theme === 'dark' ? 'border-slate-700' : 'border-gray-100'
              }`}>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className={`text-2xl font-bold ${
                      theme === 'dark' ? 'text-electric-green' : 'text-blue-600'
                    }`}>
                      ${parseFloat(product.price).toFixed(2)}
                    </span>
                    {product.comparePrice && (
                      <span className="text-sm text-gray-500 line-through">
                        ${parseFloat(product.comparePrice).toFixed(2)}
                      </span>
                    )}
                  </div>
                  <span className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                    One-time purchase
                  </span>
                </div>
                
                <button
                  onClick={(e) => handleAddToCart(e, product)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all transform hover:scale-105 ${
                    theme === 'dark'
                      ? 'bg-electric-green text-slate-900 hover:bg-electric-green/90 shadow-lg shadow-electric-green/20'
                      : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-600/20'
                  }`}
                >
                  <ShoppingCart className="w-4 h-4" />
                  Add to Cart
                </button>
              </div>
            </div>
          </Link>
        </div>
      </motion.div>
    );
  };

  const renderFilterSection = () => (
    <>
      <div className="mb-8">
        <h4 className={`font-semibold mb-4 flex items-center gap-2 ${
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}>
          <Package className="w-4 h-4" />
          Categories
        </h4>
        <div className="space-y-1">
          {categories.map((cat) => {
            const IconComponent = cat.icon;
            return (
              <button
                key={cat.value}
                onClick={() => handleCategoryChange(cat.value)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all ${
                  selectedCategory === cat.value
                    ? theme === 'dark'
                      ? 'bg-electric-green/20 text-electric-green border border-electric-green/30'
                      : 'bg-blue-50 text-blue-600 border border-blue-200'
                    : theme === 'dark'
                      ? 'text-gray-300 hover:bg-slate-800'
                      : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span className="flex items-center gap-2">
                  <IconComponent className="w-4 h-4" />
                  {cat.name}
                </span>
                {cat.count > 0 && (
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    selectedCategory === cat.value
                      ? theme === 'dark' ? 'bg-electric-green/30' : 'bg-blue-100'
                      : theme === 'dark' ? 'bg-slate-700' : 'bg-gray-100'
                  }`}>
                    {cat.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mb-8">
        <h4 className={`font-semibold mb-4 flex items-center gap-2 ${
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}>
          <Star className="w-4 h-4" />
          Rating
        </h4>
        <div className="space-y-1">
          {ratingFilters.map((rating, index) => (
            <button
              key={index}
              onClick={() => setSelectedRating(rating.value)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                selectedRating === rating.value
                  ? theme === 'dark'
                    ? 'bg-electric-green/20 text-electric-green border border-electric-green/30'
                    : 'bg-blue-50 text-blue-600 border border-blue-200'
                  : theme === 'dark'
                    ? 'text-gray-300 hover:bg-slate-800'
                    : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                selectedRating === rating.value
                  ? theme === 'dark' ? 'border-electric-green' : 'border-blue-600'
                  : theme === 'dark' ? 'border-gray-600' : 'border-gray-300'
              }`}>
                {selectedRating === rating.value && (
                  <div className={`w-2 h-2 rounded-full ${
                    theme === 'dark' ? 'bg-electric-green' : 'bg-blue-600'
                  }`} />
                )}
              </div>
              <span className="flex items-center gap-1">
                {rating.label}
                {rating.value > 0 && (
                  <span className="flex items-center">
                    {[...Array(rating.value)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                    ))}
                  </span>
                )}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="mb-8">
        <h4 className={`font-semibold mb-4 flex items-center gap-2 ${
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}>
          <TrendingUp className="w-4 h-4" />
          Price Range
        </h4>
        <div className="space-y-1">
          {priceRanges.map((range, index) => (
            <button
              key={index}
              onClick={() => setSelectedPriceRange(index)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                selectedPriceRange === index
                  ? theme === 'dark'
                    ? 'bg-electric-green/20 text-electric-green border border-electric-green/30'
                    : 'bg-blue-50 text-blue-600 border border-blue-200'
                  : theme === 'dark'
                    ? 'text-gray-300 hover:bg-slate-800'
                    : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                selectedPriceRange === index
                  ? theme === 'dark' ? 'border-electric-green' : 'border-blue-600'
                  : theme === 'dark' ? 'border-gray-600' : 'border-gray-300'
              }`}>
                {selectedPriceRange === index && (
                  <div className={`w-2 h-2 rounded-full ${
                    theme === 'dark' ? 'bg-electric-green' : 'bg-blue-600'
                  }`} />
                )}
              </div>
              <span>{range.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="mb-8">
        <h4 className={`font-semibold mb-4 flex items-center gap-2 ${
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}>
          <Download className="w-4 h-4" />
          Product Type
        </h4>
        <div className="space-y-1">
          {productTypes.map((type, index) => (
            <button
              key={index}
              onClick={() => setSelectedType(type.value)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                selectedType === type.value
                  ? theme === 'dark'
                    ? 'bg-electric-green/20 text-electric-green border border-electric-green/30'
                    : 'bg-blue-50 text-blue-600 border border-blue-200'
                  : theme === 'dark'
                    ? 'text-gray-300 hover:bg-slate-800'
                    : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                selectedType === type.value
                  ? theme === 'dark' ? 'border-electric-green' : 'border-blue-600'
                  : theme === 'dark' ? 'border-gray-600' : 'border-gray-300'
              }`}>
                {selectedType === type.value && (
                  <div className={`w-2 h-2 rounded-full ${
                    theme === 'dark' ? 'bg-electric-green' : 'bg-blue-600'
                  }`} />
                )}
              </div>
              <span>{type.label}</span>
            </button>
          ))}
        </div>
      </div>
    </>
  );

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-slate-950' : 'bg-gray-50'}`}>
      <ShopNav />
      
      <div className={`py-3 ${
        theme === 'dark' 
          ? 'bg-gradient-to-r from-electric-blue/20 via-electric-green/20 to-electric-blue/20'
          : 'bg-gradient-to-r from-blue-50 via-purple-50 to-blue-50'
      }`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-8 overflow-x-auto py-1">
            {trustIndicators.map((item, index) => (
              <div key={index} className="flex items-center gap-2 whitespace-nowrap">
                <item.icon className={`w-4 h-4 ${
                  theme === 'dark' ? 'text-electric-green' : 'text-blue-600'
                }`} />
                <span className={`text-sm font-medium ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {featuredProducts.length > 0 && !selectedCategory && !searchParams.get('search') && (
        <section className={`py-10 ${
          theme === 'dark' ? 'bg-slate-900/50' : 'bg-white'
        }`}>
          <div className="container mx-auto px-4 lg:px-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className={`text-2xl font-bold flex items-center gap-2 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  <Sparkles className={`w-6 h-6 ${theme === 'dark' ? 'text-electric-green' : 'text-amber-500'}`} />
                  Featured Products
                </h2>
                <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  Hand-picked digital products for you
                </p>
              </div>
              <Link
                to="/shop/products?featured=true"
                className={`flex items-center gap-1 text-sm font-medium ${
                  theme === 'dark' ? 'text-electric-green hover:text-electric-green/80' : 'text-blue-600 hover:text-blue-700'
                }`}
              >
                View All
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProducts.slice(0, 3).map((product, index) => renderProductCard(product, index))}
            </div>
          </div>
        </section>
      )}

      <div className="container mx-auto px-4 lg:px-6 py-8">
        <div className={`rounded-2xl p-6 mb-8 ${
          theme === 'dark' ? 'bg-slate-900/50 border border-slate-800' : 'bg-white border border-gray-200 shadow-sm'
        }`}>
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <h1 className={`text-3xl font-bold ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                {selectedCategory 
                  ? categories.find(c => c.value === selectedCategory)?.name || 'Products'
                  : 'All Digital Products'
                }
              </h1>
              <p className={`mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                {loading ? 'Loading...' : `${products.length} products found`}
                {activeFiltersCount > 0 && ` • ${activeFiltersCount} filter${activeFiltersCount > 1 ? 's' : ''} applied`}
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <form onSubmit={handleSearch} className="relative flex-1 sm:flex-initial">
                <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                }`} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search digital products..."
                  className={`pl-12 pr-4 py-3 rounded-xl border w-full sm:w-72 transition-all focus:outline-none focus:ring-2 ${
                    theme === 'dark'
                      ? 'bg-slate-800 border-slate-700 text-white placeholder-gray-500 focus:border-electric-blue focus:ring-electric-blue/20'
                      : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500/20'
                  }`}
                />
              </form>

              <button
                onClick={() => setShowMobileFilters(true)}
                className={`lg:hidden flex items-center justify-center gap-2 px-4 py-3 rounded-xl border font-medium ${
                  theme === 'dark'
                    ? 'bg-slate-800 border-slate-700 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              >
                <Filter className="w-5 h-5" />
                Filters
                {activeFiltersCount > 0 && (
                  <span className={`px-2 py-0.5 text-xs rounded-full ${
                    theme === 'dark' ? 'bg-electric-green text-slate-900' : 'bg-blue-600 text-white'
                  }`}>
                    {activeFiltersCount}
                  </span>
                )}
              </button>

              <div className="flex items-center gap-3">
                <div className={`flex items-center gap-1 p-1 rounded-xl ${
                  theme === 'dark' ? 'bg-slate-800' : 'bg-gray-100'
                }`}>
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2.5 rounded-lg transition-colors ${
                      viewMode === 'grid'
                        ? theme === 'dark' ? 'bg-electric-green text-slate-900' : 'bg-white text-gray-900 shadow-sm'
                        : theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'
                    }`}
                  >
                    <Grid className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2.5 rounded-lg transition-colors ${
                      viewMode === 'list'
                        ? theme === 'dark' ? 'bg-electric-green text-slate-900' : 'bg-white text-gray-900 shadow-sm'
                        : theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'
                    }`}
                  >
                    <List className="w-5 h-5" />
                  </button>
                </div>

                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => handleSortChange(e.target.value)}
                    className={`appearance-none pl-4 pr-10 py-3 rounded-xl border cursor-pointer font-medium ${
                      theme === 'dark'
                        ? 'bg-slate-800 border-slate-700 text-white'
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  >
                    {sortOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className={`absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                  }`} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="hidden lg:block lg:w-80 flex-shrink-0">
            <div className={`rounded-2xl p-6 sticky top-24 ${
              theme === 'dark'
                ? 'bg-slate-900 border border-slate-700'
                : 'bg-white border border-gray-200 shadow-sm'
            }`}>
              <div className="flex items-center justify-between mb-6">
                <h3 className={`font-bold text-lg flex items-center gap-2 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  <SlidersHorizontal className="w-5 h-5" />
                  Filters
                </h3>
                {activeFiltersCount > 0 && (
                  <button
                    onClick={clearFilters}
                    className={`text-sm font-medium px-3 py-1 rounded-lg transition-colors ${
                      theme === 'dark' 
                        ? 'text-electric-green bg-electric-green/10 hover:bg-electric-green/20' 
                        : 'text-blue-600 bg-blue-50 hover:bg-blue-100'
                    }`}
                  >
                    Clear all
                  </button>
                )}
              </div>

              {renderFilterSection()}
            </div>
          </aside>

          <AnimatePresence>
            {showMobileFilters && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setShowMobileFilters(false)}
                  className="lg:hidden fixed inset-0 bg-black/50 z-40"
                />
                <motion.div
                  initial={{ x: '-100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '-100%' }}
                  transition={{ type: 'spring', damping: 25 }}
                  className={`lg:hidden fixed left-0 top-0 h-full w-80 z-50 overflow-y-auto ${
                    theme === 'dark' ? 'bg-slate-900' : 'bg-white'
                  }`}
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className={`font-bold text-lg flex items-center gap-2 ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>
                        <SlidersHorizontal className="w-5 h-5" />
                        Filters
                      </h3>
                      <button
                        onClick={() => setShowMobileFilters(false)}
                        className={`p-2 rounded-lg ${
                          theme === 'dark' ? 'hover:bg-slate-800 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
                        }`}
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    {activeFiltersCount > 0 && (
                      <button
                        onClick={clearFilters}
                        className={`w-full mb-6 py-2.5 rounded-xl text-sm font-medium ${
                          theme === 'dark'
                            ? 'bg-slate-800 text-electric-green border border-electric-green/30'
                            : 'bg-blue-50 text-blue-600 border border-blue-200'
                        }`}
                      >
                        Clear all filters ({activeFiltersCount})
                      </button>
                    )}

                    {renderFilterSection()}

                    <button
                      onClick={() => setShowMobileFilters(false)}
                      className={`w-full mt-6 py-3.5 rounded-xl font-semibold ${
                        theme === 'dark'
                          ? 'bg-electric-green text-slate-900'
                          : 'bg-blue-600 text-white'
                      }`}
                    >
                      Show {products.length} Results
                    </button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>

          <main className="flex-1">
            {loading ? (
              <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'}`}>
                {[...Array(9)].map((_, i) => (
                  <div key={i} className={`rounded-2xl overflow-hidden ${
                    theme === 'dark' ? 'bg-slate-800' : 'bg-white border border-gray-200'
                  }`}>
                    <div className="aspect-[4/3] animate-pulse bg-gray-300 dark:bg-slate-700" />
                    <div className="p-5 space-y-3">
                      <div className="flex gap-2">
                        <div className="h-5 w-16 rounded-full animate-pulse bg-gray-300 dark:bg-slate-700" />
                        <div className="h-5 w-12 rounded-full animate-pulse bg-gray-300 dark:bg-slate-700" />
                      </div>
                      <div className="h-5 rounded animate-pulse bg-gray-300 dark:bg-slate-700" />
                      <div className="h-4 w-2/3 rounded animate-pulse bg-gray-300 dark:bg-slate-700" />
                      <div className="h-4 w-full rounded animate-pulse bg-gray-300 dark:bg-slate-700" />
                      <div className="pt-4 border-t border-gray-200 dark:border-slate-700 flex justify-between">
                        <div className="h-8 w-20 rounded animate-pulse bg-gray-300 dark:bg-slate-700" />
                        <div className="h-10 w-28 rounded-xl animate-pulse bg-gray-300 dark:bg-slate-700" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : products.length > 0 ? (
              <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'}`}>
                {products.map((product, index) => renderProductCard(product, index))}
              </div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`text-center py-20 rounded-2xl ${
                  theme === 'dark' ? 'bg-slate-800/50 border border-slate-700' : 'bg-white border border-gray-200'
                }`}
              >
                <div className={`w-20 h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center ${
                  theme === 'dark' ? 'bg-slate-700' : 'bg-gray-100'
                }`}>
                  <Package className={`w-10 h-10 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`} />
                </div>
                <h3 className={`text-2xl font-bold mb-3 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  No Products Found
                </h3>
                <p className={`mb-6 max-w-md mx-auto ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  We couldn't find any products matching your criteria. Try adjusting your filters or search query.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={clearFilters}
                    className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                      theme === 'dark'
                        ? 'bg-electric-green text-slate-900 hover:bg-electric-green/90'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    Clear All Filters
                  </button>
                  <Link
                    to="/shop"
                    className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                      theme === 'dark'
                        ? 'bg-slate-700 text-white hover:bg-slate-600'
                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                    }`}
                  >
                    Browse All Products
                  </Link>
                </div>
              </motion.div>
            )}
          </main>
        </div>
      </div>

      <AnimatePresence>
        {quickViewProduct && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setQuickViewProduct(null)}
              className="fixed inset-0 bg-black/70 z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className={`fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl max-h-[90vh] overflow-y-auto z-50 rounded-2xl ${
                theme === 'dark' ? 'bg-slate-900' : 'bg-white'
              }`}
            >
              <button
                onClick={() => setQuickViewProduct(null)}
                className={`absolute top-4 right-4 p-2 rounded-full z-10 ${
                  theme === 'dark' ? 'bg-slate-800 text-white hover:bg-slate-700' : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                }`}
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex flex-col md:flex-row">
                <div className="md:w-1/2 relative">
                  {quickViewProduct.thumbnail || quickViewProduct.images?.[0] ? (
                    <img
                      src={quickViewProduct.thumbnail || quickViewProduct.images[0]}
                      alt={quickViewProduct.name}
                      className="w-full aspect-square object-cover"
                    />
                  ) : (
                    <div className={`w-full aspect-square flex items-center justify-center ${
                      theme === 'dark' ? 'bg-slate-800' : 'bg-gray-100'
                    }`}>
                      <Package className={`w-24 h-24 ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`} />
                    </div>
                  )}
                </div>

                <div className="md:w-1/2 p-8">
                  <div className="flex flex-wrap gap-2 mb-4">
                    {(() => {
                      const typeBadge = getProductTypeBadge(quickViewProduct.category);
                      const CategoryIcon = typeBadge.icon;
                      return (
                        <span className={`px-3 py-1 text-sm font-semibold rounded-full flex items-center gap-1 text-white ${typeBadge.color}`}>
                          <CategoryIcon className="w-4 h-4" />
                          {typeBadge.label}
                        </span>
                      );
                    })()}
                    {quickViewProduct.featured && (
                      <span className={`px-3 py-1 text-sm font-semibold rounded-full flex items-center gap-1 ${
                        theme === 'dark' ? 'bg-electric-green text-slate-900' : 'bg-amber-400 text-amber-900'
                      }`}>
                        <Sparkles className="w-4 h-4" />
                        Featured
                      </span>
                    )}
                  </div>

                  <h2 className={`text-2xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {quickViewProduct.name}
                  </h2>

                  {quickViewProduct.author && (
                    <p className={`text-sm mb-4 flex items-center gap-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                      <span className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs">
                        {quickViewProduct.author.charAt(0).toUpperCase()}
                      </span>
                      by {quickViewProduct.author}
                    </p>
                  )}

                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${
                            i < Math.floor(quickViewProduct.rating || parseFloat(quickViewProduct.averageRating || '4.5'))
                              ? 'text-yellow-400 fill-yellow-400'
                              : theme === 'dark' ? 'text-gray-600' : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                      ({quickViewProduct.reviewCount || quickViewProduct.totalReviews || 0} reviews)
                    </span>
                  </div>

                  <p className={`mb-6 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                    {quickViewProduct.shortDescription || quickViewProduct.description}
                  </p>

                  <div className={`grid grid-cols-2 gap-3 mb-6 p-4 rounded-xl ${
                    theme === 'dark' ? 'bg-slate-800' : 'bg-gray-50'
                  }`}>
                    <div className="flex items-center gap-2">
                      <Download className={`w-5 h-5 ${theme === 'dark' ? 'text-electric-green' : 'text-blue-600'}`} />
                      <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                        Instant Download
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Shield className={`w-5 h-5 ${theme === 'dark' ? 'text-electric-green' : 'text-blue-600'}`} />
                      <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                        Secure Payment
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Zap className={`w-5 h-5 ${theme === 'dark' ? 'text-electric-green' : 'text-blue-600'}`} />
                      <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                        Lifetime Access
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Award className={`w-5 h-5 ${theme === 'dark' ? 'text-electric-green' : 'text-blue-600'}`} />
                      <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                        Quality Verified
                      </span>
                    </div>
                  </div>

                  <div className={`flex items-center justify-between p-4 rounded-xl mb-6 ${
                    theme === 'dark' ? 'bg-slate-800' : 'bg-gray-50'
                  }`}>
                    <div>
                      <div className="flex items-center gap-3">
                        <span className={`text-3xl font-bold ${
                          theme === 'dark' ? 'text-electric-green' : 'text-blue-600'
                        }`}>
                          ${parseFloat(quickViewProduct.price).toFixed(2)}
                        </span>
                        {quickViewProduct.comparePrice && (
                          <span className="text-lg text-gray-500 line-through">
                            ${parseFloat(quickViewProduct.comparePrice).toFixed(2)}
                          </span>
                        )}
                      </div>
                      <span className={`text-sm ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                        One-time purchase
                      </span>
                    </div>
                    {quickViewProduct.comparePrice && (
                      <span className="px-3 py-1 text-sm font-semibold rounded-full bg-red-500 text-white">
                        Save {Math.round((1 - parseFloat(quickViewProduct.price) / parseFloat(quickViewProduct.comparePrice)) * 100)}%
                      </span>
                    )}
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={(e) => {
                        handleAddToCart(e, quickViewProduct);
                        setQuickViewProduct(null);
                      }}
                      className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold transition-all ${
                        theme === 'dark'
                          ? 'bg-electric-green text-slate-900 hover:bg-electric-green/90'
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                    >
                      <ShoppingCart className="w-5 h-5" />
                      Add to Cart
                    </button>
                    <button
                      onClick={(e) => handleToggleWishlist(e, quickViewProduct.id)}
                      className={`p-3.5 rounded-xl transition-all ${
                        isInWishlist(quickViewProduct.id)
                          ? 'bg-red-500 text-white'
                          : theme === 'dark'
                            ? 'bg-slate-800 text-white hover:bg-red-500'
                            : 'bg-gray-100 text-gray-900 hover:bg-red-500 hover:text-white'
                      }`}
                    >
                      <Heart className={`w-5 h-5 ${isInWishlist(quickViewProduct.id) ? 'fill-current' : ''}`} />
                    </button>
                    <Link
                      to={`/shop/products/${quickViewProduct.slug}`}
                      onClick={() => setQuickViewProduct(null)}
                      className={`p-3.5 rounded-xl transition-all ${
                        theme === 'dark'
                          ? 'bg-slate-800 text-white hover:bg-slate-700'
                          : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                      }`}
                    >
                      <Eye className="w-5 h-5" />
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
