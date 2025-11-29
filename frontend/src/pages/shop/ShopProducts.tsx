import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Filter, Grid, List, ShoppingCart, Heart, Search } from 'lucide-react';
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
}

const categories = [
  { name: 'All', value: '' },
  { name: 'Software & Tools', value: 'software' },
  { name: 'Templates', value: 'templates' },
  { name: 'Online Courses', value: 'courses' },
  { name: 'E-Books', value: 'ebooks' },
  { name: 'Design Assets', value: 'design-assets' },
  { name: 'Audio & Music', value: 'audio' },
  { name: 'Graphics', value: 'graphics' },
  { name: 'Plugins', value: 'plugins' },
  { name: 'Other', value: 'other' },
];

export default function ShopProducts() {
  const { theme } = useTheme();
  const { addToCart } = useShopAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const selectedCategory = searchParams.get('category') || '';

  useEffect(() => {
    fetchProducts();
  }, [searchParams]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      const category = searchParams.get('category');
      const search = searchParams.get('search');
      
      if (category) params.append('category', category);
      if (search) params.append('search', search);
      
      const response = await fetch(`/api/ecommerce/products?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setProducts(data.data?.items || data.products || []);
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
    setShowFilters(false);
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

  const clearFilters = () => {
    setSearchParams(new URLSearchParams());
    setSearchQuery('');
  };

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product.id);
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-slate-950' : 'bg-gray-50'}`}>
      <ShopNav />
      
      <div className="container mx-auto px-4 lg:px-6 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className={`text-3xl font-bold ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Digital Products
            </h1>
            <p className={`mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              {products.length} digital products found
            </p>
          </div>
          
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative">
              <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search digital products..."
                className={`pl-10 pr-4 py-2 rounded-lg border w-full md:w-64 ${
                  theme === 'dark'
                    ? 'bg-slate-800 border-slate-700 text-white placeholder-gray-500'
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                }`}
              />
            </div>
            <button
              type="submit"
              className={`px-4 py-2 rounded-lg font-medium ${
                theme === 'dark'
                  ? 'bg-electric-green text-slate-900'
                  : 'bg-accent-blue text-white'
              }`}
            >
              Search
            </button>
          </form>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`lg:hidden flex items-center justify-center gap-2 px-4 py-3 rounded-lg border ${
              theme === 'dark'
                ? 'bg-slate-800 border-slate-700 text-white'
                : 'bg-white border-gray-300 text-gray-900'
            }`}
          >
            <Filter className="w-5 h-5" />
            Filters
          </button>

          <aside className={`${showFilters ? 'block' : 'hidden'} lg:block lg:w-64 flex-shrink-0`}>
            <div className={`rounded-2xl p-6 sticky top-24 ${
              theme === 'dark'
                ? 'bg-slate-900 border border-slate-700'
                : 'bg-white border border-gray-200 shadow-sm'
            }`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className={`font-semibold ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  Categories
                </h3>
                {(selectedCategory || searchParams.get('search')) && (
                  <button
                    onClick={clearFilters}
                    className={`text-sm ${
                      theme === 'dark' ? 'text-electric-green' : 'text-accent-blue'
                    }`}
                  >
                    Clear all
                  </button>
                )}
              </div>
              
              <div className="space-y-2">
                {categories.map((cat) => (
                  <button
                    key={cat.value}
                    onClick={() => handleCategoryChange(cat.value)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      selectedCategory === cat.value
                        ? theme === 'dark'
                          ? 'bg-electric-green/20 text-electric-green'
                          : 'bg-accent-blue/10 text-accent-blue'
                        : theme === 'dark'
                          ? 'text-gray-300 hover:bg-slate-800'
                          : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          <main className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg ${
                    viewMode === 'grid'
                      ? theme === 'dark' ? 'bg-slate-700 text-white' : 'bg-gray-200 text-gray-900'
                      : theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg ${
                    viewMode === 'list'
                      ? theme === 'dark' ? 'bg-slate-700 text-white' : 'bg-gray-200 text-gray-900'
                      : theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
              
              <select
                className={`px-4 py-2 rounded-lg border ${
                  theme === 'dark'
                    ? 'bg-slate-800 border-slate-700 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              >
                <option value="newest">Newest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="popular">Most Popular</option>
              </select>
            </div>

            {loading ? (
              <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
                {[...Array(6)].map((_, i) => (
                  <div key={i} className={`rounded-2xl overflow-hidden ${
                    theme === 'dark' ? 'bg-slate-800' : 'bg-white border border-gray-200'
                  }`}>
                    <div className="aspect-square animate-pulse bg-gray-300 dark:bg-slate-700" />
                    <div className="p-4 space-y-3">
                      <div className="h-4 rounded animate-pulse bg-gray-300 dark:bg-slate-700" />
                      <div className="h-4 w-2/3 rounded animate-pulse bg-gray-300 dark:bg-slate-700" />
                    </div>
                  </div>
                ))}
              </div>
            ) : products.length > 0 ? (
              <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
                {products.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link
                      to={`/shop/products/${product.slug}`}
                      className={`group block rounded-2xl overflow-hidden transition-all hover:shadow-lg ${
                        viewMode === 'list' ? 'flex' : ''
                      } ${
                        theme === 'dark'
                          ? 'bg-slate-800 hover:bg-slate-800/80 border border-slate-700'
                          : 'bg-white hover:bg-gray-50 border border-gray-200'
                      }`}
                    >
                      <div className={`relative overflow-hidden ${
                        viewMode === 'list' ? 'w-48 flex-shrink-0' : 'aspect-square'
                      }`}>
                        {product.thumbnail || product.images[0] ? (
                          <img
                            src={product.thumbnail || product.images[0]}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                        ) : (
                          <div className={`w-full h-full flex items-center justify-center text-6xl ${
                            theme === 'dark' ? 'bg-slate-700' : 'bg-gray-100'
                          }`}>
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
                      </div>
                      
                      <div className={`p-4 flex-1 ${viewMode === 'list' ? 'flex flex-col justify-between' : ''}`}>
                        <div>
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <h3 className={`font-semibold line-clamp-1 ${
                              theme === 'dark' ? 'text-white' : 'text-gray-900'
                            }`}>
                              {product.name}
                            </h3>
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                              }}
                              className={`p-1.5 rounded-lg transition-colors ${
                                theme === 'dark'
                                  ? 'hover:bg-slate-700 text-gray-400 hover:text-red-400'
                                  : 'hover:bg-gray-100 text-gray-500 hover:text-red-500'
                              }`}
                            >
                              <Heart className="w-5 h-5" />
                            </button>
                          </div>
                          
                          <p className={`text-sm mb-3 ${viewMode === 'list' ? 'line-clamp-2' : 'line-clamp-2'} ${
                            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                          }`}>
                            {product.shortDescription || product.description}
                          </p>
                          
                          <span className={`inline-block text-xs font-medium px-2 py-1 rounded ${
                            theme === 'dark'
                              ? 'bg-slate-700 text-gray-300'
                              : 'bg-gray-100 text-gray-600'
                          }`}>
                            {product.category}
                          </span>
                        </div>
                        
                        <div className={`flex items-center justify-between ${viewMode === 'list' ? 'mt-4' : 'mt-4'}`}>
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
                          
                          <button
                            onClick={(e) => handleAddToCart(e, product)}
                            className={`flex items-center gap-1 px-3 py-2 rounded-lg font-medium text-sm transition-colors ${
                              theme === 'dark'
                                ? 'bg-electric-green text-slate-900 hover:bg-electric-green/90'
                                : 'bg-accent-blue text-white hover:bg-accent-blue/90'
                            }`}
                          >
                            <ShoppingCart className="w-4 h-4" />
                            Add
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
                <Search className={`w-16 h-16 mx-auto mb-4 ${
                  theme === 'dark' ? 'text-gray-600' : 'text-gray-400'
                }`} />
                <h3 className={`text-xl font-semibold mb-2 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  No Products Found
                </h3>
                <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                  Try adjusting your search or filters.
                </p>
                <button
                  onClick={clearFilters}
                  className={`mt-4 px-4 py-2 rounded-lg font-medium ${
                    theme === 'dark'
                      ? 'bg-electric-green text-slate-900'
                      : 'bg-accent-blue text-white'
                  }`}
                >
                  Clear Filters
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
