import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star, ShoppingCart } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useShopAuth } from '../../contexts/ShopAuthContext';
import type { Product } from '../../types/shop';

interface FeaturedCarouselProps {
  products: Product[];
  autoPlay?: boolean;
  interval?: number;
}

export default function FeaturedCarousel({ products, autoPlay = true, interval = 5000 }: FeaturedCarouselProps) {
  const { theme } = useTheme();
  const { addToCart, isAuthenticated } = useShopAuth();
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!autoPlay || products.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % products.length);
    }, interval);
    return () => clearInterval(timer);
  }, [autoPlay, interval, products.length]);

  const goTo = (index: number) => {
    setCurrentIndex(index);
  };

  const goPrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? products.length - 1 : prev - 1));
  };

  const goNext = () => {
    setCurrentIndex((prev) => (prev + 1) % products.length);
  };

  const handleAddToCart = async (e: React.MouseEvent, productId: number) => {
    e.preventDefault();
    if (!isAuthenticated) return;
    await addToCart(productId, 1);
  };

  if (products.length === 0) return null;

  const current = products[currentIndex];

  return (
    <div className="relative overflow-hidden rounded-2xl">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.3 }}
          className={`relative min-h-[400px] ${
            theme === 'dark' ? 'bg-slate-800' : 'bg-gray-100'
          }`}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8 lg:p-12">
            <div className="flex flex-col justify-center">
              {current.category && (
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-4 w-fit ${
                  theme === 'dark'
                    ? 'bg-electric-green/20 text-electric-green'
                    : 'bg-accent-blue/10 text-accent-blue'
                }`}>
                  {current.category.name}
                </span>
              )}

              <h2 className={`text-3xl lg:text-4xl font-bold mb-4 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                {current.name}
              </h2>

              <p className={`text-lg mb-6 line-clamp-3 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
              }`}>
                {current.shortDescription || current.description}
              </p>

              {current.totalReviews > 0 && (
                <div className="flex items-center gap-2 mb-6">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < Math.round(parseFloat(current.averageRating))
                            ? 'text-yellow-400 fill-yellow-400'
                            : theme === 'dark' ? 'text-gray-600' : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>
                    ({current.totalReviews} reviews)
                  </span>
                </div>
              )}

              <div className="flex items-center gap-4 mb-8">
                <span
                  className={`text-3xl font-bold ${
                    theme === 'dark' ? 'text-electric-green' : 'text-accent-blue'
                  }`}
                >
                  ₹{parseFloat(current.price).toFixed(2)}
                </span>
                {current.comparePrice && (
                  <span
                    className={`text-xl line-through ${
                      theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                    }`}
                  >
                    ₹{parseFloat(current.comparePrice).toFixed(2)}
                  </span>
                )}
                {current.comparePrice && (
                  <span className="px-2 py-1 text-sm font-semibold rounded bg-red-500 text-white">
                    Save ₹{(parseFloat(current.comparePrice) - parseFloat(current.price)).toFixed(2)}
                  </span>
                )}
              </div>

              <div className="flex flex-wrap gap-4">
                <Link
                  to={`/shop/products/${current.slug}`}
                  className={`relative group overflow-hidden inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                    theme === 'dark'
                      ? 'bg-gradient-to-r from-electric-blue to-electric-green text-slate-900 hover:shadow-lg hover:shadow-electric-blue/25'
                      : 'bg-gradient-to-r from-accent-red to-accent-blue text-white hover:shadow-lg hover:shadow-accent-red/25'
                  }`}
                >
                  <span className="relative z-10">
                    View Details
                  </span>
                  <div
                    className={`absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 ${
                      theme === 'dark'
                        ? 'bg-gradient-to-r from-electric-green to-electric-blue'
                        : 'bg-gradient-to-r from-accent-blue to-accent-red'
                    }`}
                  />
                </Link>
                {isAuthenticated && current.stock > 0 && (
                  <button
                    onClick={(e) => handleAddToCart(e, current.id)}
                    className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all border ${
                      theme === 'dark'
                        ? 'border-slate-600 text-white hover:bg-slate-700'
                        : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <ShoppingCart className="w-5 h-5" />
                    Add to Cart
                  </button>
                )}
              </div>
            </div>

            <div className="flex items-center justify-center">
              <div className="relative w-full max-w-md aspect-square rounded-2xl overflow-hidden">
                {current.thumbnail || current.images[0] ? (
                  <img
                    src={current.thumbnail || current.images[0]}
                    alt={current.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className={`w-full h-full flex items-center justify-center text-9xl ${
                    theme === 'dark' ? 'bg-slate-700' : 'bg-gray-200'
                  }`}>
                    📦
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {products.length > 1 && (
        <>
          <button
            onClick={goPrev}
            className={`absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full transition-all ${
              theme === 'dark'
                ? 'bg-slate-700/80 text-white hover:bg-slate-600'
                : 'bg-white/80 text-gray-800 hover:bg-white shadow-md'
            }`}
            aria-label="Previous product"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={goNext}
            className={`absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full transition-all ${
              theme === 'dark'
                ? 'bg-slate-700/80 text-white hover:bg-slate-600'
                : 'bg-white/80 text-gray-800 hover:bg-white shadow-md'
            }`}
            aria-label="Next product"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {products.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className={`w-3 h-3 rounded-full transition-all ${
                  i === currentIndex
                    ? theme === 'dark' ? 'bg-electric-green w-8' : 'bg-accent-blue w-8'
                    : theme === 'dark' ? 'bg-gray-600 hover:bg-gray-500' : 'bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Go to product ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
