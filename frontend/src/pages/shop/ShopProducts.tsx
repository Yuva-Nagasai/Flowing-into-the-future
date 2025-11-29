import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Grid, List, ShoppingCart, Heart, Search, X, ChevronDown, Star, SlidersHorizontal } from 'lucide-react';
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
  images: string[];
  thumbnail?: string;
  stock: number;
  featured: boolean;
  author?: string;
  rating?: number;
  reviewCount?: number;
}

const categories = [
  { name: 'All Categories', value: '', count: 0 },
  { name: 'Software & Tools', value: 'software', count: 45 },
  { name: 'Templates', value: 'templates', count: 120 },
  { name: 'Online Courses', value: 'courses', count: 85 },
  { name: 'E-Books', value: 'ebooks', count: 200 },
  { name: 'Design Assets', value: 'design-assets', count: 150 },
  { name: 'Audio & Music', value: 'audio', count: 75 },
  { name: 'Graphics', value: 'graphics', count: 90 },
  { name: 'Plugins', value: 'plugins', count: 60 },
  { name: 'Other', value: 'other', count: 30 },
];

const priceRanges = [
  { label: 'All Prices', min: 0, max: Infinity },
  { label: 'Under $10', min: 0, max: 10 },
  { label: '$10 - $25', min: 10, max: 25 },
  { label: '$25 - $50', min: 25, max: 50 },
  { label: '$50 - $100', min: 50, max: 100 },
  { label: 'Over $100', min: 100, max: Infinity },
];

const sortOptions = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'popular', label: 'Most Popular' },
  { value: 'rating', label: 'Top Rated' },
];

export default function ShopProducts() {
  const { theme } = useTheme();
  const { addToCart } = useShopAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedPriceRange, setSelectedPriceRange] = useState(0);
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'newest');
  const selectedCategory = searchParams.get('category') || '';

  useEffect(() => {
    fetchProducts();
  }, [searchParams, selectedPriceRange, sortBy]);

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
        
        setProducts(fetchedProducts);
      }
    } catch (error) {
      console.error('Failed to fetch products');
    } finally {
      setLoading(false);
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
    setSortBy('newest');
  };

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product.id);
  };

  const activeFiltersCount = (selectedCategory ? 1 : 0) + (selectedPriceRange > 0 ? 1 : 0) + (searchParams.get('search') ? 1 : 0);

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-slate-950' : 'bg-gray-50'}`}>
      <ShopNav />
      
      <div className="container mx-auto px-4 lg:px-6 py-8">
        <div className={`rounded-2xl p-6 mb-8 ${
          theme === 'dark' ? 'bg-slate-900/50 border border-slate-800' : 'bg-white border border-gray-200 shadow-sm'
        }`}>
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <h1 className={`text-3xl font-bold ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Digital Products
              </h1>
              <p className={`mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                {loading ? 'Loading...' : `${products.length} products found`}
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <form onSubmit={handleSearch} className="relative flex-1 sm:flex-initial">
                <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                }`} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className={`pl-10 pr-4 py-3 rounded-xl border w-full sm:w-64 transition-all focus:outline-none focus:ring-2 ${
                    theme === 'dark'
                      ? 'bg-slate-800 border-slate-700 text-white placeholder-gray-500 focus:border-electric-blue focus:ring-electric-blue/20'
                      : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400 focus:border-accent-blue focus:ring-accent-blue/20'
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
                <SlidersHorizontal className="w-5 h-5" />
                Filters
                {activeFiltersCount > 0 && (
                  <span className={`px-2 py-0.5 text-xs rounded-full ${
                    theme === 'dark' ? 'bg-electric-green text-slate-900' : 'bg-accent-blue text-white'
                  }`}>
                    {activeFiltersCount}
                  </span>
                )}
              </button>

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 p-1 rounded-lg bg-gray-100 dark:bg-slate-800">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-md transition-colors ${
                      viewMode === 'grid'
                        ? theme === 'dark' ? 'bg-slate-700 text-white' : 'bg-white text-gray-900 shadow-sm'
                        : theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'
                    }`}
                  >
                    <Grid className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-md transition-colors ${
                      viewMode === 'list'
                        ? theme === 'dark' ? 'bg-slate-700 text-white' : 'bg-white text-gray-900 shadow-sm'
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
                    className={`appearance-none pl-4 pr-10 py-3 rounded-xl border cursor-pointer ${
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
          <aside className="hidden lg:block lg:w-72 flex-shrink-0">
            <div className={`rounded-2xl p-6 sticky top-24 ${
              theme === 'dark'
                ? 'bg-slate-900 border border-slate-700'
                : 'bg-white border border-gray-200 shadow-sm'
            }`}>
              <div className="flex items-center justify-between mb-6">
                <h3 className={`font-semibold text-lg ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  Filters
                </h3>
                {activeFiltersCount > 0 && (
                  <button
                    onClick={clearFilters}
                    className={`text-sm font-medium ${
                      theme === 'dark' ? 'text-electric-green hover:text-electric-green/80' : 'text-accent-blue hover:text-accent-blue/80'
                    }`}
                  >
                    Clear all
                  </button>
                )}
              </div>

              <div className="mb-8">
                <h4 className={`font-medium mb-4 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Categories
                </h4>
                <div className="space-y-2">
                  {categories.map((cat) => (
                    <button
                      key={cat.value}
                      onClick={() => handleCategoryChange(cat.value)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors text-left ${
                        selectedCategory === cat.value
                          ? theme === 'dark'
                            ? 'bg-electric-green/20 text-electric-green'
                            : 'bg-accent-blue/10 text-accent-blue'
                          : theme === 'dark'
                            ? 'text-gray-300 hover:bg-slate-800'
                            : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <span>{cat.name}</span>
                      {cat.count > 0 && (
                        <span className={`text-sm ${
                          theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                        }`}>
                          {cat.count}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h4 className={`font-medium mb-4 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Price Range
                </h4>
                <div className="space-y-2">
                  {priceRanges.map((range, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedPriceRange(index)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-left ${
                        selectedPriceRange === index
                          ? theme === 'dark'
                            ? 'bg-electric-green/20 text-electric-green'
                            : 'bg-accent-blue/10 text-accent-blue'
                          : theme === 'dark'
                            ? 'text-gray-300 hover:bg-slate-800'
                            : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                        selectedPriceRange === index
                          ? theme === 'dark'
                            ? 'border-electric-green'
                            : 'border-accent-blue'
                          : theme === 'dark'
                            ? 'border-gray-600'
                            : 'border-gray-300'
                      }`}>
                        {selectedPriceRange === index && (
                          <div className={`w-2 h-2 rounded-full ${
                            theme === 'dark' ? 'bg-electric-green' : 'bg-accent-blue'
                          }`} />
                        )}
                      </div>
                      <span>{range.label}</span>
                    </button>
                  ))}
                </div>
              </div>
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
                      <h3 className={`font-semibold text-lg ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>
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
                        className={`w-full mb-6 py-2 rounded-lg text-sm font-medium ${
                          theme === 'dark'
                            ? 'bg-slate-800 text-electric-green'
                            : 'bg-gray-100 text-accent-blue'
                        }`}
                      >
                        Clear all filters
                      </button>
                    )}

                    <div className="mb-8">
                      <h4 className={`font-medium mb-4 ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        Categories
                      </h4>
                      <div className="space-y-2">
                        {categories.map((cat) => (
                          <button
                            key={cat.value}
                            onClick={() => handleCategoryChange(cat.value)}
                            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors text-left ${
                              selectedCategory === cat.value
                                ? theme === 'dark'
                                  ? 'bg-electric-green/20 text-electric-green'
                                  : 'bg-accent-blue/10 text-accent-blue'
                                : theme === 'dark'
                                  ? 'text-gray-300 hover:bg-slate-800'
                                  : 'text-gray-700 hover:bg-gray-100'
                            }`}
                          >
                            <span>{cat.name}</span>
                            {cat.count > 0 && (
                              <span className={`text-sm ${
                                theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                              }`}>
                                {cat.count}
                              </span>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className={`font-medium mb-4 ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        Price Range
                      </h4>
                      <div className="space-y-2">
                        {priceRanges.map((range, index) => (
                          <button
                            key={index}
                            onClick={() => setSelectedPriceRange(index)}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-left ${
                              selectedPriceRange === index
                                ? theme === 'dark'
                                  ? 'bg-electric-green/20 text-electric-green'
                                  : 'bg-accent-blue/10 text-accent-blue'
                                : theme === 'dark'
                                  ? 'text-gray-300 hover:bg-slate-800'
                                  : 'text-gray-700 hover:bg-gray-100'
                            }`}
                          >
                            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                              selectedPriceRange === index
                                ? theme === 'dark'
                                  ? 'border-electric-green'
                                  : 'border-accent-blue'
                                : theme === 'dark'
                                  ? 'border-gray-600'
                                  : 'border-gray-300'
                            }`}>
                              {selectedPriceRange === index && (
                                <div className={`w-2 h-2 rounded-full ${
                                  theme === 'dark' ? 'bg-electric-green' : 'bg-accent-blue'
                                }`} />
                              )}
                            </div>
                            <span>{range.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={() => setShowMobileFilters(false)}
                      className={`w-full mt-8 py-3 rounded-xl font-semibold ${
                        theme === 'dark'
                          ? 'bg-electric-green text-slate-900'
                          : 'bg-accent-blue text-white'
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
                    <div className="aspect-square animate-pulse bg-gray-300 dark:bg-slate-700" />
                    <div className="p-4 space-y-3">
                      <div className="h-4 rounded animate-pulse bg-gray-300 dark:bg-slate-700" />
                      <div className="h-4 w-2/3 rounded animate-pulse bg-gray-300 dark:bg-slate-700" />
                      <div className="h-4 w-1/2 rounded animate-pulse bg-gray-300 dark:bg-slate-700" />
                    </div>
                  </div>
                ))}
              </div>
            ) : products.length > 0 ? (
              <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'}`}>
                {products.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03 }}
                  >
                    <Link
                      to={`/shop/products/${product.slug}`}
                      className={`group block rounded-2xl overflow-hidden transition-all hover:shadow-xl ${
                        viewMode === 'list' ? 'flex' : ''
                      } ${
                        theme === 'dark'
                          ? 'bg-slate-800 hover:bg-slate-800/80 border border-slate-700 hover:border-electric-blue/50'
                          : 'bg-white hover:bg-gray-50 border border-gray-200'
                      }`}
                    >
                      <div className={`relative overflow-hidden ${
                        viewMode === 'list' ? 'w-56 flex-shrink-0' : 'aspect-square'
                      }`}>
                        {product.thumbnail || product.images[0] ? (
                          <img
                            src={product.thumbnail || product.images[0]}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        ) : (
                          <div className={`w-full h-full flex items-center justify-center text-6xl ${
                            theme === 'dark' ? 'bg-slate-700' : 'bg-gray-100'
                          }`}>
                            📦
                          </div>
                        )}
                        
                        <div className="absolute top-3 left-3 flex flex-col gap-2">
                          {product.featured && (
                            <span className={`px-2 py-1 text-xs font-semibold rounded ${
                              theme === 'dark'
                                ? 'bg-electric-green text-slate-900'
                                : 'bg-accent-red text-white'
                            }`}>
                              Featured
                            </span>
                          )}
                          {product.comparePrice && (
                            <span className="px-2 py-1 text-xs font-semibold rounded bg-red-500 text-white">
                              {Math.round((1 - parseFloat(product.price) / parseFloat(product.comparePrice)) * 100)}% OFF
                            </span>
                          )}
                        </div>

                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                          }}
                          className={`absolute top-3 right-3 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all ${
                            theme === 'dark'
                              ? 'bg-slate-900/80 text-white hover:bg-slate-900 hover:text-red-400'
                              : 'bg-white/80 text-gray-900 shadow hover:bg-white hover:text-red-500'
                          }`}
                        >
                          <Heart className="w-5 h-5" />
                        </button>
                      </div>
                      
                      <div className={`p-5 flex-1 ${viewMode === 'list' ? 'flex flex-col justify-between' : ''}`}>
                        <div>
                          <span className={`inline-block text-xs font-medium px-2 py-1 rounded mb-2 ${
                            theme === 'dark'
                              ? 'bg-slate-700 text-gray-300'
                              : 'bg-gray-100 text-gray-600'
                          }`}>
                            {product.category}
                          </span>
                          
                          <h3 className={`font-semibold text-lg mb-1 line-clamp-1 group-hover:text-electric-green dark:group-hover:text-electric-green transition-colors ${
                            theme === 'dark' ? 'text-white' : 'text-gray-900'
                          }`}>
                            {product.name}
                          </h3>
                          
                          {product.author && (
                            <p className={`text-sm mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                              by {product.author}
                            </p>
                          )}
                          
                          <p className={`text-sm mb-3 ${viewMode === 'list' ? 'line-clamp-2' : 'line-clamp-2'} ${
                            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                          }`}>
                            {product.shortDescription || product.description}
                          </p>
                          
                          <div className="flex items-center gap-2 mb-3">
                            <div className="flex items-center gap-0.5">
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
                            </div>
                            <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                              ({product.reviewCount || 0} reviews)
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-slate-700">
                          <div className="flex items-center gap-2">
                            <span className={`text-xl font-bold ${
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
                          
                          <button
                            onClick={(e) => handleAddToCart(e, product)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                              theme === 'dark'
                                ? 'bg-electric-green text-slate-900 hover:bg-electric-green/90'
                                : 'bg-accent-blue text-white hover:bg-accent-blue/90'
                            }`}
                          >
                            <ShoppingCart className="w-4 h-4" />
                            Add to Cart
                          </button>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className={`text-center py-16 rounded-2xl ${
                theme === 'dark' ? 'bg-slate-800/50' : 'bg-white border border-gray-200'
              }`}>
                <Search className={`w-16 h-16 mx-auto mb-4 ${
                  theme === 'dark' ? 'text-gray-600' : 'text-gray-400'
                }`} />
                <h3 className={`text-xl font-semibold mb-2 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  No Products Found
                </h3>
                <p className={`mb-6 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  Try adjusting your search or filters to find what you're looking for.
                </p>
                <button
                  onClick={clearFilters}
                  className={`px-6 py-3 rounded-xl font-medium ${
                    theme === 'dark'
                      ? 'bg-electric-green text-slate-900'
                      : 'bg-accent-blue text-white'
                  }`}
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
}
