import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Heart, ShoppingCart, Eye } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useShopAuth } from '../../contexts/ShopAuthContext';
import type { Product } from '../../types/shop';

interface ProductGridProps {
  products: Product[];
  loading?: boolean;
  columns?: 2 | 3 | 4;
}

export default function ProductGrid({ products, loading = false, columns = 4 }: ProductGridProps) {
  const { theme } = useTheme();
  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist, isAuthenticated } = useShopAuth();

  const productCardBase =
    theme === 'dark'
      ? 'bg-slate-900/80 border border-slate-700/70 backdrop-blur-sm'
      : 'bg-gradient-to-br from-accent-red/10 to-accent-blue/10 border border-accent-red/30 shadow-lg';
  const productCardHover = theme === 'dark' ? 'hover:border-electric-blue/50' : 'hover:shadow-2xl';

  const gridCols = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  };

  const handleWishlistToggle = async (e: React.MouseEvent, productId: number) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) return;
    if (isInWishlist(productId)) {
      await removeFromWishlist(productId);
    } else {
      await addToWishlist(productId);
    }
  };

  const handleAddToCart = async (e: React.MouseEvent, productId: number) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) return;
    await addToCart(productId, 1);
  };

  if (loading) {
    return (
      <div className={`grid ${gridCols[columns]} gap-6`}>
        {[...Array(columns * 2)].map((_, i) => (
          <div
            key={i}
            className={`rounded-2xl overflow-hidden ${
              theme === 'dark' ? 'bg-slate-800' : 'bg-gray-100'
            }`}
          >
            <div className="aspect-square animate-pulse bg-gray-300 dark:bg-slate-700" />
            <div className="p-4 space-y-3">
              <div className="h-4 rounded animate-pulse bg-gray-300 dark:bg-slate-700" />
              <div className="h-4 w-2/3 rounded animate-pulse bg-gray-300 dark:bg-slate-700" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className={`text-center py-16 rounded-2xl ${theme === 'dark' ? 'bg-slate-800/50' : 'bg-gray-100'}`}>
        <ShoppingCart className={`w-16 h-16 mx-auto mb-4 ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`} />
        <h3 className={`text-xl font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          No Products Found
        </h3>
        <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
          Try adjusting your filters or search terms
        </p>
      </div>
    );
  }

  return (
    <div className={`grid ${gridCols[columns]} gap-6`}>
      {products.map((product, index) => {
        const inWishlist = isInWishlist(product.id);
        const discount = product.comparePrice
          ? Math.round(((parseFloat(product.comparePrice) - parseFloat(product.price)) / parseFloat(product.comparePrice)) * 100)
          : 0;

        return (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Link
              to={`/shop/products/${product.slug}`}
              className={`group block rounded-2xl overflow-hidden transition-all hover:scale-[1.02] flex flex-col h-full ${productCardBase} ${productCardHover}`}
            >
              <div className="aspect-square relative overflow-hidden">
                {product.thumbnail || product.images[0] ? (
                  <img
                    src={product.thumbnail || product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                ) : (
                  <div className={`w-full h-full flex items-center justify-center text-6xl ${
                    theme === 'dark' ? 'bg-slate-700' : 'bg-gray-100'
                  }`}>
                    📦
                  </div>
                )}

                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />

                <div className="absolute top-3 left-3 flex flex-col gap-2">
                  {product.featured && (
                    <span className={`px-2 py-1 text-xs font-semibold rounded ${
                      theme === 'dark' ? 'bg-electric-green text-slate-900' : 'bg-accent-red text-white'
                    }`}>
                      Featured
                    </span>
                  )}
                  {discount > 0 && (
                    <span className="px-2 py-1 text-xs font-semibold rounded bg-red-500 text-white">
                      -{discount}%
                    </span>
                  )}
                  {product.stock === 0 && (
                    <span className="px-2 py-1 text-xs font-semibold rounded bg-gray-500 text-white">
                      Out of Stock
                    </span>
                  )}
                </div>

                <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  {isAuthenticated && (
                    <>
                      <button
                        onClick={(e) => handleWishlistToggle(e, product.id)}
                        className={`p-2 rounded-full transition-colors ${
                          inWishlist
                            ? 'bg-red-500 text-white'
                            : theme === 'dark'
                              ? 'bg-slate-700 text-white hover:bg-red-500'
                              : 'bg-white text-gray-700 hover:bg-red-500 hover:text-white'
                        }`}
                        aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
                      >
                        <Heart className={`w-4 h-4 ${inWishlist ? 'fill-current' : ''}`} />
                      </button>
                      <button
                        onClick={(e) => handleAddToCart(e, product.id)}
                        disabled={product.stock === 0}
                        className={`p-2 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                          theme === 'dark'
                            ? 'bg-electric-green text-slate-900 hover:bg-electric-green/80'
                            : 'bg-accent-blue text-white hover:bg-accent-blue/80'
                        }`}
                        aria-label="Add to cart"
                      >
                        <ShoppingCart className="w-4 h-4" />
                      </button>
                    </>
                  )}
                  <Link
                    to={`/shop/products/${product.slug}`}
                    className={`p-2 rounded-full transition-colors ${
                      theme === 'dark'
                        ? 'bg-slate-700 text-white hover:bg-slate-600'
                        : 'bg-white text-gray-700 hover:bg-gray-100'
                    }`}
                    aria-label="Quick view"
                  >
                    <Eye className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              <div className="p-4 flex flex-col flex-1">
                {product.category && (
                  <p className={`text-xs font-medium uppercase tracking-wide mb-1 flex-shrink-0 ${
                    theme === 'dark' ? 'text-electric-green' : 'text-accent-blue'
                  }`}>
                    {product.category.name}
                  </p>
                )}
                <h3 className={`font-semibold mb-2 line-clamp-1 min-h-[1.5rem] flex-shrink-0 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  {product.name}
                </h3>
                <p className={`text-sm mb-3 line-clamp-2 min-h-[2.5rem] flex-shrink-0 ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {product.shortDescription || product.description}
                </p>

                {product.totalReviews > 0 && (
                  <div className="flex items-center gap-2 mb-3 flex-shrink-0">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < Math.round(parseFloat(product.averageRating))
                              ? 'text-yellow-400 fill-yellow-400'
                              : theme === 'dark' ? 'text-gray-600' : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                      ({product.totalReviews})
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between mt-auto">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-lg font-bold ${
                        theme === 'dark' ? 'text-electric-green' : 'text-accent-blue'
                      }`}
                    >
                      ₹{parseFloat(product.price).toFixed(2)}
                    </span>
                    {product.comparePrice && (
                      <span
                        className={`text-sm line-through ${
                          theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                        }`}
                      >
                        ₹{parseFloat(product.comparePrice).toFixed(2)}
                      </span>
                    )}
                  </div>
                  {product.stock > 0 && product.stock <= 5 && (
                    <span className="text-xs text-orange-500 font-medium">
                      Only {product.stock} left
                    </span>
                  )}
                </div>
              </div>
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
}
