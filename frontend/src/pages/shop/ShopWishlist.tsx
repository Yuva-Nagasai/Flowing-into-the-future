import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, ShoppingCart, Trash2, Package, ArrowRight } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useShopAuth } from '../../contexts/ShopAuthContext';
import ShopNav from '../../components/shop/ShopNav';
import Footer from '../../components/Footer';
import SEOHead from '../../components/shop/SEOHead';
import shopApi from '../../utils/shopApi';
import type { WishlistItem, Product } from '../../types/shop';

export default function ShopWishlist() {
  const { theme } = useTheme();
  const { isAuthenticated, user } = useShopAuth();
  const navigate = useNavigate();
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState<number | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/shop/login?redirect=/shop/wishlist');
      return;
    }
    fetchWishlist();
  }, [isAuthenticated, navigate]);

  const fetchWishlist = async () => {
    setLoading(true);
    try {
      const res = await shopApi.getWishlist();
      if (res.success) {
        setWishlist(res.data);
      }
    } catch (error) {
      console.error('Failed to fetch wishlist');
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (productId: number) => {
    try {
      await shopApi.removeFromWishlist(productId);
      setWishlist(prev => prev.filter(item => item.productId !== productId));
    } catch (error) {
      console.error('Failed to remove from wishlist');
    }
  };

  const handleAddToCart = async (productId: number) => {
    setAddingToCart(productId);
    try {
      await shopApi.addToCart(productId, 1);
      await shopApi.removeFromWishlist(productId);
      setWishlist(prev => prev.filter(item => item.productId !== productId));
    } catch (error) {
      console.error('Failed to add to cart');
    } finally {
      setAddingToCart(null);
    }
  };

  const handleMoveAllToCart = async () => {
    for (const item of wishlist) {
      if (item.product) {
        await handleAddToCart(item.productId);
      }
    }
  };

  if (!isAuthenticated) return null;

  return (
    <div className={`min-h-screen flex flex-col ${theme === 'dark' ? 'bg-slate-950' : 'bg-gray-50'}`}>
      <SEOHead title="My Wishlist" description="View and manage your saved products" />
      <ShopNav />

      <div className="container mx-auto px-4 lg:px-6 py-8 flex-1">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className={`text-3xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              My Wishlist
            </h1>
            <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
              {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} saved for later
            </p>
          </div>

          {wishlist.length > 0 && (
            <button
              onClick={handleMoveAllToCart}
              className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                theme === 'dark'
                  ? 'bg-electric-green text-black hover:bg-electric-green/90'
                  : 'bg-accent-blue text-white hover:bg-accent-blue/90'
              }`}
            >
              <ShoppingCart className="w-5 h-5" />
              Move All to Cart
            </button>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className={`rounded-2xl p-4 animate-pulse ${
                  theme === 'dark' ? 'bg-slate-800' : 'bg-white'
                }`}
              >
                <div className={`aspect-square rounded-xl mb-4 ${theme === 'dark' ? 'bg-slate-700' : 'bg-gray-200'}`} />
                <div className={`h-4 rounded mb-2 ${theme === 'dark' ? 'bg-slate-700' : 'bg-gray-200'}`} />
                <div className={`h-4 rounded w-1/2 ${theme === 'dark' ? 'bg-slate-700' : 'bg-gray-200'}`} />
              </div>
            ))}
          </div>
        ) : wishlist.length === 0 ? (
          <div className={`text-center py-16 rounded-2xl ${
            theme === 'dark' ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-gray-200'
          }`}>
            <Heart className={`w-16 h-16 mx-auto mb-4 ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`} />
            <h2 className={`text-xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Your wishlist is empty
            </h2>
            <p className={`mb-6 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Save items you love by clicking the heart icon on products
            </p>
            <Link
              to="/shop/products"
              className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium ${
                theme === 'dark'
                  ? 'bg-electric-green text-black hover:bg-electric-green/90'
                  : 'bg-accent-blue text-white hover:bg-accent-blue/90'
              }`}
            >
              Browse Products
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlist.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`group rounded-2xl overflow-hidden ${
                  theme === 'dark'
                    ? 'bg-slate-800 border border-slate-700'
                    : 'bg-white border border-gray-200 shadow-sm'
                }`}
              >
                {item.product && (
                  <>
                    <Link to={`/shop/products/${item.product.slug}`} className="block relative">
                      <div className="aspect-square overflow-hidden">
                        {item.product.thumbnail ? (
                          <img
                            src={item.product.thumbnail}
                            alt={item.product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className={`w-full h-full flex items-center justify-center ${
                            theme === 'dark' ? 'bg-slate-700' : 'bg-gray-100'
                          }`}>
                            <Package className="w-12 h-12 text-gray-400" />
                          </div>
                        )}
                      </div>

                      {item.product.comparePrice && (
                        <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-lg text-xs font-medium">
                          {Math.round((1 - parseFloat(item.product.price) / parseFloat(item.product.comparePrice)) * 100)}% OFF
                        </div>
                      )}
                    </Link>

                    <div className="p-4">
                      <Link to={`/shop/products/${item.product.slug}`}>
                        <h3 className={`font-semibold mb-2 line-clamp-2 group-hover:underline ${
                          theme === 'dark' ? 'text-white' : 'text-gray-900'
                        }`}>
                          {item.product.name}
                        </h3>
                      </Link>

                      <div className="flex items-center gap-2 mb-4">
                        <span className={`text-lg font-bold ${
                          theme === 'dark' ? 'text-electric-green' : 'text-accent-blue'
                        }`}>
                          ${parseFloat(item.product.price).toFixed(2)}
                        </span>
                        {item.product.comparePrice && (
                          <span className={`text-sm line-through ${
                            theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                          }`}>
                            ${parseFloat(item.product.comparePrice).toFixed(2)}
                          </span>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => handleAddToCart(item.productId)}
                          disabled={addingToCart === item.productId || item.product.stock === 0}
                          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
                            item.product.stock === 0
                              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                              : theme === 'dark'
                                ? 'bg-electric-green text-black hover:bg-electric-green/90'
                                : 'bg-accent-blue text-white hover:bg-accent-blue/90'
                          }`}
                        >
                          {addingToCart === item.productId ? (
                            <span className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <>
                              <ShoppingCart className="w-4 h-4" />
                              {item.product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                            </>
                          )}
                        </button>

                        <button
                          onClick={() => handleRemove(item.productId)}
                          className={`p-2 rounded-xl transition-colors ${
                            theme === 'dark'
                              ? 'bg-slate-700 text-gray-400 hover:bg-red-900/50 hover:text-red-400'
                              : 'bg-gray-100 text-gray-500 hover:bg-red-100 hover:text-red-500'
                          }`}
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </motion.div>
            ))}
          </div>
        )}

        <div className="mt-12">
          <Link
            to="/shop/products"
            className={`inline-flex items-center gap-2 text-sm font-medium ${
              theme === 'dark' ? 'text-electric-green' : 'text-accent-blue'
            }`}
          >
            <ArrowRight className="w-4 h-4 rotate-180" />
            Continue Shopping
          </Link>
        </div>
      </div>

      <Footer variant="shop" />
    </div>
  );
}
