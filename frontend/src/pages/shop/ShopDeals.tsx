import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Tag, Clock, ArrowRight, Percent, Sparkles } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import ShopNav from '../../components/shop/ShopNav';
import Footer from '../../components/Footer';
import SEOHead from '../../components/shop/SEOHead';
import shopApi from '../../utils/shopApi';
import type { Deal } from '../../types/shop';

export default function ShopDeals() {
  const { theme } = useTheme();
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDeals();
  }, []);

  const fetchDeals = async () => {
    setLoading(true);
    try {
      const res = await shopApi.getDeals();
      if (res.success && res.data) {
        setDeals(res.data);
      }
    } catch (error) {
      console.error('Failed to fetch deals');
    } finally {
      setLoading(false);
    }
  };

  const getTimeRemaining = (endDate: string) => {
    const end = new Date(endDate).getTime();
    const now = new Date().getTime();
    const diff = end - now;

    if (diff <= 0) return 'Expired';

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (days > 0) return `${days}d ${hours}h left`;
    return `${hours}h left`;
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-slate-950' : 'bg-gray-50'}`}>
      <SEOHead
        title="Deals & Offers"
        description="Check out our latest deals and special offers. Save big on your favorite products!"
      />
      <ShopNav />

      <section className={`py-16 ${
        theme === 'dark'
          ? 'bg-gradient-to-r from-electric-blue/20 to-electric-green/20'
          : 'bg-gradient-to-r from-accent-red/10 to-accent-blue/10'
      }`}>
        <div className="container mx-auto px-4 lg:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6 ${
              theme === 'dark'
                ? 'bg-electric-green/10 text-electric-green border border-electric-green/30'
                : 'bg-accent-blue/10 text-accent-blue border border-accent-blue/30'
            }`}>
              <Sparkles className="w-4 h-4" />
              Limited Time Offers
            </span>
            <h1 className={`text-4xl md:text-5xl font-bold mb-4 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Hot{' '}
              <span className={`${
                theme === 'dark'
                  ? 'text-transparent bg-clip-text bg-gradient-to-r from-electric-blue to-electric-green'
                  : 'text-transparent bg-clip-text bg-gradient-to-r from-accent-red to-accent-blue'
              }`}>
                Deals
              </span>{' '}
              & Offers
            </h1>
            <p className={`text-lg max-w-2xl mx-auto ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Don't miss out on these amazing discounts. Limited time only!
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4 lg:px-6">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className={`rounded-2xl overflow-hidden animate-pulse ${
                    theme === 'dark' ? 'bg-slate-800' : 'bg-gray-100'
                  }`}
                >
                  <div className="h-48 bg-gray-300 dark:bg-slate-700" />
                  <div className="p-6 space-y-3">
                    <div className="h-6 rounded bg-gray-300 dark:bg-slate-700" />
                    <div className="h-4 w-2/3 rounded bg-gray-300 dark:bg-slate-700" />
                  </div>
                </div>
              ))}
            </div>
          ) : deals.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {deals.map((deal, index) => (
                <motion.div
                  key={deal.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`group rounded-2xl overflow-hidden transition-all hover:scale-[1.02] ${
                    theme === 'dark'
                      ? 'bg-slate-800 border border-slate-700 hover:border-electric-blue/50'
                      : 'bg-white border border-gray-200 shadow-sm hover:shadow-lg'
                  }`}
                >
                  {deal.bannerImage ? (
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={deal.bannerImage}
                        alt={deal.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-4 left-4 right-4">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="px-2 py-1 text-sm font-bold rounded bg-red-500 text-white flex items-center gap-1">
                            <Percent className="w-3 h-3" />
                            {deal.discountType === 'percentage'
                              ? `${deal.discountValue}% OFF`
                              : `$${deal.discountValue} OFF`}
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className={`h-48 flex items-center justify-center ${
                      theme === 'dark'
                        ? 'bg-gradient-to-br from-electric-blue/20 to-electric-green/20'
                        : 'bg-gradient-to-br from-accent-red/10 to-accent-blue/10'
                    }`}>
                      <Tag className={`w-16 h-16 ${
                        theme === 'dark' ? 'text-electric-green' : 'text-accent-blue'
                      }`} />
                    </div>
                  )}

                  <div className="p-6">
                    <h3 className={`text-xl font-bold mb-2 ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                      {deal.title}
                    </h3>
                    {deal.description && (
                      <p className={`text-sm mb-4 line-clamp-2 ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        {deal.description}
                      </p>
                    )}

                    <div className="flex items-center justify-between">
                      <div className={`flex items-center gap-2 text-sm ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        <Clock className="w-4 h-4" />
                        {getTimeRemaining(deal.endDate)}
                      </div>

                      <Link
                        to={deal.productId ? `/shop/product/${deal.productId}` : deal.categoryId ? `/shop/category/${deal.categoryId}` : '/shop/products'}
                        className={`inline-flex items-center gap-1 font-medium ${
                          theme === 'dark'
                            ? 'text-electric-green hover:text-electric-green/80'
                            : 'text-accent-blue hover:text-accent-blue/80'
                        }`}
                      >
                        Shop Now
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className={`text-center py-16 rounded-2xl ${
              theme === 'dark' ? 'bg-slate-800/50' : 'bg-gray-100'
            }`}>
              <Tag className={`w-16 h-16 mx-auto mb-4 ${
                theme === 'dark' ? 'text-gray-600' : 'text-gray-400'
              }`} />
              <h3 className={`text-xl font-semibold mb-2 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                No Active Deals
              </h3>
              <p className={`mb-6 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Check back soon for amazing offers!
              </p>
              <Link
                to="/shop/products"
                className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
                  theme === 'dark'
                    ? 'bg-electric-green text-slate-900 hover:bg-electric-green/90'
                    : 'bg-accent-blue text-white hover:bg-accent-blue/90'
                }`}
              >
                Browse Products
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
