import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag, Star, ArrowRight, Sparkles, Truck, Shield, RefreshCw } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
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
  { name: 'Electronics', slug: 'electronics', icon: '📱', color: 'from-blue-500 to-cyan-500' },
  { name: 'Clothing', slug: 'clothing', icon: '👕', color: 'from-pink-500 to-rose-500' },
  { name: 'Home', slug: 'home', icon: '🏠', color: 'from-amber-500 to-orange-500' },
  { name: 'Books', slug: 'books', icon: '📚', color: 'from-green-500 to-emerald-500' },
  { name: 'Sports', slug: 'sports', icon: '⚽', color: 'from-purple-500 to-violet-500' },
  { name: 'Beauty', slug: 'beauty', icon: '💄', color: 'from-rose-500 to-pink-500' },
];

const features = [
  { icon: Truck, title: 'Free Shipping', description: 'On orders over $50' },
  { icon: Shield, title: 'Secure Payment', description: '100% secure checkout' },
  { icon: RefreshCw, title: 'Easy Returns', description: '30-day return policy' },
];

export default function ShopHome() {
  const { theme } = useTheme();
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      const response = await fetch('/api/ecommerce/products?featured=true&limit=4');
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

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-slate-950' : 'bg-gray-50'}`}>
      <ShopNav />
      
      <section className={`relative py-20 overflow-hidden ${
        theme === 'dark'
          ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900'
          : 'bg-gradient-to-br from-white via-blue-50 to-white'
      }`}>
        <div className="absolute inset-0 overflow-hidden">
          <div className={`absolute -top-40 -right-40 w-80 h-80 rounded-full blur-3xl ${
            theme === 'dark' ? 'bg-electric-blue/20' : 'bg-accent-blue/20'
          }`} />
          <div className={`absolute -bottom-40 -left-40 w-80 h-80 rounded-full blur-3xl ${
            theme === 'dark' ? 'bg-electric-green/20' : 'bg-accent-red/20'
          }`} />
        </div>
        
        <div className="container mx-auto px-4 lg:px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6 ${
                theme === 'dark'
                  ? 'bg-electric-green/10 text-electric-green border border-electric-green/30'
                  : 'bg-accent-blue/10 text-accent-blue border border-accent-blue/30'
              }`}>
                <Sparkles className="w-4 h-4" />
                Welcome to NanoFlows Shop
              </span>
              
              <h1 className={`text-4xl md:text-5xl lg:text-6xl font-bold mb-6 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Discover Amazing{' '}
                <span className={`${
                  theme === 'dark'
                    ? 'text-transparent bg-clip-text bg-gradient-to-r from-electric-blue to-electric-green'
                    : 'text-transparent bg-clip-text bg-gradient-to-r from-accent-red to-accent-blue'
                }`}>
                  Products
                </span>
              </h1>
              
              <p className={`text-lg md:text-xl mb-8 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Shop the latest trends in electronics, fashion, home goods, and more. Quality products at competitive prices.
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
                  <ShoppingBag className="w-5 h-5" />
                  Shop Now
                  <ArrowRight className="w-5 h-5" />
                </Link>
                
                <Link
                  to="/shop/categories"
                  className={`inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-lg transition-all border ${
                    theme === 'dark'
                      ? 'border-slate-600 text-gray-300 hover:bg-slate-800'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Browse Categories
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-8 border-y border-gray-200 dark:border-slate-700">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center justify-center gap-4">
                <feature.icon className={`w-8 h-8 ${
                  theme === 'dark' ? 'text-electric-green' : 'text-accent-blue'
                }`} />
                <div>
                  <h3 className={`font-semibold ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    {feature.title}
                  </h3>
                  <p className={`text-sm ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
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
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  to={`/shop/products?category=${category.slug}`}
                  className={`block p-6 rounded-2xl text-center transition-all hover:scale-105 ${
                    theme === 'dark'
                      ? 'bg-slate-800/50 hover:bg-slate-800 border border-slate-700'
                      : 'bg-white hover:bg-gray-50 border border-gray-200 shadow-sm'
                  }`}
                >
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${category.color} flex items-center justify-center text-3xl`}>
                    {category.icon}
                  </div>
                  <h3 className={`font-medium ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    {category.name}
                  </h3>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className={`py-16 ${theme === 'dark' ? 'bg-slate-900/50' : 'bg-white'}`}>
        <div className="container mx-auto px-4 lg:px-6">
          <div className="flex items-center justify-between mb-8">
            <h2 className={`text-2xl md:text-3xl font-bold ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Featured Products
            </h2>
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
              {[...Array(4)].map((_, i) => (
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
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    to={`/shop/products/${product.slug}`}
                    className={`block rounded-2xl overflow-hidden transition-all hover:scale-[1.02] ${
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
                          className="w-full h-full object-cover"
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
                    </div>
                    <div className="p-4">
                      <h3 className={`font-semibold mb-2 line-clamp-1 ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>
                        {product.name}
                      </h3>
                      <p className={`text-sm mb-3 line-clamp-2 ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        {product.shortDescription || product.description}
                      </p>
                      <div className="flex items-center justify-between">
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

      <section className={`py-16 ${
        theme === 'dark'
          ? 'bg-gradient-to-r from-electric-blue/20 to-electric-green/20'
          : 'bg-gradient-to-r from-accent-red/10 to-accent-blue/10'
      }`}>
        <div className="container mx-auto px-4 lg:px-6 text-center">
          <h2 className={`text-2xl md:text-3xl font-bold mb-4 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            Ready to Start Shopping?
          </h2>
          <p className={`text-lg mb-8 max-w-2xl mx-auto ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Create an account to save your favorites, track orders, and get exclusive deals.
          </p>
          <Link
            to="/shop/register"
            className={`inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-lg transition-all ${
              theme === 'dark'
                ? 'bg-white text-slate-900 hover:bg-gray-100'
                : 'bg-gray-900 text-white hover:bg-gray-800'
            }`}
          >
            Create Account
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
