import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Tag, Clock, ArrowRight, Percent, Sparkles, X, Copy, Check, Gift, Ticket, Zap, ShoppingBag, Calendar } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import ShopNav from '../../components/shop/ShopNav';
import Footer from '../../components/Footer';
import SEOHead from '../../components/shop/SEOHead';
import shopApi from '../../utils/shopApi';
import type { Deal } from '../../types/shop';

interface DealModalProps {
  deal: Deal | null;
  isOpen: boolean;
  onClose: () => void;
  theme: string;
}

function DealModal({ deal, isOpen, onClose, theme }: DealModalProps) {
  const [copied, setCopied] = useState(false);

  const copyCode = () => {
    if (deal?.code) {
      navigator.clipboard.writeText(deal.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!deal) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className={`w-full max-w-lg rounded-2xl overflow-hidden ${
              theme === 'dark' ? 'bg-slate-900' : 'bg-white'
            }`}>
              <div className={`relative h-48 ${
                theme === 'dark'
                  ? 'bg-gradient-to-br from-electric-blue/30 to-electric-green/30'
                  : 'bg-gradient-to-br from-accent-red/20 to-accent-blue/20'
              }`}>
                {deal.bannerImage ? (
                  <img
                    src={deal.bannerImage}
                    alt={deal.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Gift className={`w-20 h-20 ${
                      theme === 'dark' ? 'text-electric-green/50' : 'text-accent-blue/50'
                    }`} />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 p-2 rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="absolute bottom-4 left-4">
                  <span className="px-3 py-1.5 text-sm font-bold rounded-full bg-red-500 text-white flex items-center gap-1">
                    <Percent className="w-4 h-4" />
                    {deal.discountType === 'percentage'
                      ? `${deal.discountValue}% OFF`
                      : `$${deal.discountValue} OFF`}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <h2 className={`text-2xl font-bold mb-2 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  {deal.title}
                </h2>
                {deal.description && (
                  <p className={`mb-6 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    {deal.description}
                  </p>
                )}

                {deal.code && (
                  <div className="mb-6">
                    <p className={`text-sm font-medium mb-2 ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Promo Code
                    </p>
                    <div className={`flex items-center gap-2 p-3 rounded-xl border-2 border-dashed ${
                      theme === 'dark' ? 'border-electric-green/50 bg-electric-green/10' : 'border-accent-blue/50 bg-accent-blue/5'
                    }`}>
                      <code className={`flex-1 text-lg font-mono font-bold tracking-wider ${
                        theme === 'dark' ? 'text-electric-green' : 'text-accent-blue'
                      }`}>
                        {deal.code}
                      </code>
                      <button
                        onClick={copyCode}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                          copied
                            ? 'bg-green-500 text-white'
                            : theme === 'dark'
                              ? 'bg-electric-green text-slate-900 hover:bg-electric-green/90'
                              : 'bg-accent-blue text-white hover:bg-accent-blue/90'
                        }`}
                      >
                        {copied ? (
                          <>
                            <Check className="w-4 h-4" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4" />
                            Copy
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}

                <div className={`flex items-center gap-6 mb-6 text-sm ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>Valid until {new Date(deal.endDate).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Link
                    to={deal.productId ? `/shop/products/${deal.productId}` : '/shop/products'}
                    className={`relative group overflow-hidden flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                      theme === 'dark'
                        ? 'bg-gradient-to-r from-electric-blue to-electric-green text-slate-900 hover:shadow-lg'
                        : 'bg-gradient-to-r from-accent-red to-accent-blue text-white hover:shadow-lg'
                    }`}
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      <ShoppingBag className="w-5 h-5" />
                      Shop Now
                    </span>
                    <div
                      className={`absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 ${
                        theme === 'dark'
                          ? 'bg-gradient-to-r from-electric-green to-electric-blue'
                          : 'bg-gradient-to-r from-accent-blue to-accent-red'
                      }`}
                    />
                  </Link>
                  <button
                    onClick={onClose}
                    className={`px-6 py-3 rounded-xl font-semibold border transition-all ${
                      theme === 'dark'
                        ? 'border-slate-700 text-gray-300 hover:bg-slate-800'
                        : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

const dealIcons = [Gift, Ticket, Zap, Tag, Percent, Sparkles];

export default function ShopDeals() {
  const { theme } = useTheme();
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

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
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) return `${days}d ${hours}h remaining`;
    if (hours > 0) return `${hours}h ${minutes}m remaining`;
    return `${minutes}m remaining`;
  };

  const openDealModal = (deal: Deal) => {
    setSelectedDeal(deal);
    setModalOpen(true);
  };

  const closeDealModal = () => {
    setModalOpen(false);
    setTimeout(() => setSelectedDeal(null), 200);
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-slate-950' : 'bg-gray-50'}`}>
      <SEOHead
        title="Deals & Offers"
        description="Check out our latest deals and special offers. Save big on your favorite products!"
      />
      <ShopNav />

      <section className={`py-20 ${
        theme === 'dark'
          ? 'bg-gradient-to-b from-electric-blue/10 via-slate-950 to-slate-950'
          : 'bg-gradient-to-b from-accent-blue/5 via-gray-50 to-gray-50'
      }`}>
        <div className="container mx-auto px-4 lg:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-6 ${
              theme === 'dark'
                ? 'bg-gradient-to-br from-electric-blue/20 to-electric-green/20'
                : 'bg-gradient-to-br from-accent-red/10 to-accent-blue/10'
            }`}>
              <Tag className={`w-10 h-10 ${
                theme === 'dark' ? 'text-electric-green' : 'text-accent-blue'
              }`} />
            </div>
            <h1 className={`text-4xl md:text-5xl lg:text-6xl font-bold mb-6 ${
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
            <p className={`text-lg md:text-xl max-w-2xl mx-auto ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Don't miss out on these amazing discounts. Limited time offers on premium digital products!
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
                    theme === 'dark' ? 'bg-slate-800' : 'bg-white border border-gray-200'
                  }`}
                >
                  <div className="p-6">
                    <div className="w-14 h-14 rounded-xl mb-4 bg-gray-300 dark:bg-slate-700" />
                    <div className="h-6 rounded mb-2 bg-gray-300 dark:bg-slate-700" />
                    <div className="h-4 w-2/3 rounded mb-4 bg-gray-300 dark:bg-slate-700" />
                    <div className="h-10 rounded bg-gray-300 dark:bg-slate-700" />
                  </div>
                </div>
              ))}
            </div>
          ) : deals.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {deals.map((deal, index) => {
                const IconComponent = dealIcons[index % dealIcons.length];
                const isExpired = new Date(deal.endDate).getTime() < Date.now();
                
                return (
                  <motion.div
                    key={deal.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => !isExpired && openDealModal(deal)}
                    className={`group rounded-2xl overflow-hidden transition-all cursor-pointer flex flex-col h-full ${
                      isExpired ? 'opacity-60' : 'hover:scale-[1.02] hover:shadow-xl'
                    } ${
                      theme === 'dark'
                        ? 'bg-slate-800 border border-slate-700 hover:border-electric-blue/50'
                        : 'bg-white border border-gray-200 shadow-sm hover:shadow-lg'
                    }`}
                  >
                    <div className="p-6 flex flex-col flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${
                          theme === 'dark'
                            ? 'bg-gradient-to-br from-electric-blue/20 to-electric-green/20'
                            : 'bg-gradient-to-br from-accent-red/10 to-accent-blue/10'
                        }`}>
                          <IconComponent className={`w-7 h-7 ${
                            theme === 'dark' ? 'text-electric-green' : 'text-accent-blue'
                          }`} />
                        </div>
                        <span className={`px-3 py-1 text-sm font-bold rounded-full ${
                          isExpired
                            ? 'bg-gray-200 text-gray-500 dark:bg-slate-700 dark:text-gray-400'
                            : 'bg-red-500 text-white'
                        }`}>
                          {deal.discountType === 'percentage'
                            ? `${deal.discountValue}% OFF`
                            : `$${deal.discountValue} OFF`}
                        </span>
                      </div>

                      <h3 className={`text-xl font-bold mb-2 min-h-[3rem] line-clamp-2 ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>
                        {deal.title}
                      </h3>
                      
                      {deal.description && (
                        <p className={`text-sm mb-4 line-clamp-2 min-h-[2.5rem] flex-shrink-0 ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          {deal.description}
                        </p>
                      )}

                      {deal.code && (
                        <div className={`mb-4 p-3 rounded-lg border-2 border-dashed text-center flex-shrink-0 ${
                          theme === 'dark'
                            ? 'border-slate-600 bg-slate-700/50'
                            : 'border-gray-200 bg-gray-50'
                        }`}>
                          <p className={`text-xs mb-1 ${
                            theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                          }`}>
                            Use Code
                          </p>
                          <code className={`text-lg font-mono font-bold tracking-wider ${
                            theme === 'dark' ? 'text-electric-green' : 'text-accent-blue'
                          }`}>
                            {deal.code}
                          </code>
                        </div>
                      )}

                      <div className="flex items-center justify-between mt-auto flex-shrink-0">
                        <div className={`flex items-center gap-2 text-sm ${
                          isExpired
                            ? 'text-red-500'
                            : theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                          <Clock className="w-4 h-4" />
                          {isExpired ? 'Expired' : getTimeRemaining(deal.endDate)}
                        </div>
                        <div className={`flex items-center gap-2 text-sm ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                          <Calendar className="w-4 h-4" />
                          {new Date(deal.endDate).toLocaleDateString()}
                        </div>
                      </div>
                    </div>

                    <div className={`px-6 py-4 border-t ${
                      theme === 'dark' ? 'border-slate-700' : 'border-gray-200'
                    }`}>
                      <div className={`flex items-center justify-center gap-2 font-medium ${
                        isExpired
                          ? theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                          : theme === 'dark'
                            ? 'text-electric-green group-hover:text-electric-green'
                            : 'text-accent-blue group-hover:text-accent-blue'
                      }`}>
                        {isExpired ? 'Deal Expired' : (
                          <>
                            View Details
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                          </>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div
              className={`text-center py-20 rounded-2xl ${
                theme === 'dark'
                  ? 'bg-slate-800/50'
                  : 'bg-gradient-to-r from-accent-red/10 to-accent-blue/10 border border-accent-red/30'
              }`}
            >
              <div className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-6 ${
                theme === 'dark' ? 'bg-slate-700' : 'bg-gray-100'
              }`}>
                <Tag className={`w-10 h-10 ${
                  theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                }`} />
              </div>
              <h3 className={`text-2xl font-bold mb-2 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                No Active{' '}
                <span
                  className={`bg-gradient-to-r ${
                    theme === 'dark'
                      ? 'from-electric-blue to-electric-green'
                      : 'from-accent-red to-accent-blue'
                  } bg-clip-text text-transparent`}
                >
                  Deals
                </span>
              </h3>
              <p className={`mb-8 text-lg ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Check back soon for amazing offers and discounts!
              </p>
              <Link
                to="/shop/products"
                className={`relative group overflow-hidden inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 ${
                  theme === 'dark'
                    ? 'bg-gradient-to-r from-electric-blue to-electric-green text-slate-900 hover:shadow-lg'
                    : 'bg-gradient-to-r from-accent-red to-accent-blue text-white hover:shadow-lg'
                }`}
              >
                <span className="relative z-10 flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5" />
                  Browse Products
                  <ArrowRight className="w-5 h-5" />
                </span>
                <div
                  className={`absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 ${
                    theme === 'dark'
                      ? 'bg-gradient-to-r from-electric-green to-electric-blue'
                      : 'bg-gradient-to-r from-accent-blue to-accent-red'
                  }`}
                />
              </Link>
            </div>
          )}
        </div>
      </section>

      <section
        className={`py-16 ${
          theme === 'dark'
            ? 'bg-gradient-to-r from-electric-blue/20 to-electric-green/20'
            : 'bg-gradient-to-r from-accent-red/10 to-accent-blue/10'
        }`}
      >
        <div className="container mx-auto px-4 lg:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className={`text-2xl md:text-3xl font-bold mb-4 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Never Miss a{' '}
              <span
                className={`bg-gradient-to-r ${
                  theme === 'dark'
                    ? 'from-electric-blue to-electric-green'
                    : 'from-accent-red to-accent-blue'
                } bg-clip-text text-transparent`}
              >
                Deal
              </span>
            </h2>
            <p className={`mb-8 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Subscribe to our newsletter and be the first to know about exclusive offers and discounts
            </p>
            <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className={`flex-1 px-4 py-3 rounded-xl border transition-all focus:outline-none focus:ring-2 ${
                  theme === 'dark'
                    ? 'bg-slate-800 border-slate-700 text-white focus:border-electric-blue focus:ring-electric-blue/20'
                    : 'bg-gray-50 border-gray-300 text-gray-900 focus:border-accent-blue focus:ring-accent-blue/20'
                }`}
              />
              <button
                type="submit"
                className={`relative group overflow-hidden inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold shadow-lg transition-all duration-300 ${
                  theme === 'dark'
                    ? 'bg-gradient-to-r from-electric-green to-electric-blue text-slate-900'
                    : 'bg-gradient-to-r from-accent-red to-accent-blue text-white'
                }`}
              >
                <span className="relative z-10 flex items-center gap-2">
                  Subscribe
                  <ArrowRight className="w-4 h-4" />
                </span>
                <div
                  className={`absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 ${
                    theme === 'dark'
                      ? 'bg-gradient-to-r from-electric-blue to-electric-green'
                      : 'bg-gradient-to-r from-accent-blue to-accent-red'
                  }`}
                />
              </button>
            </form>
          </div>
        </div>
      </section>

      <DealModal
        deal={selectedDeal}
        isOpen={modalOpen}
        onClose={closeDealModal}
        theme={theme}
      />

      <Footer variant="shop" />
    </div>
  );
}
