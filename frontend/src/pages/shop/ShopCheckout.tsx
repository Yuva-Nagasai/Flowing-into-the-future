import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CreditCard, Zap, ShoppingBag, ChevronRight, Lock, Loader2, AlertCircle, Download } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useShopAuth } from '../../contexts/ShopAuthContext';
import ShopNav from '../../components/shop/ShopNav';
import Footer from '../../components/Footer';
import SEOHead from '../../components/shop/SEOHead';
import shopApi from '../../utils/shopApi';

export default function ShopCheckout() {
  const { theme } = useTheme();
  const { cart, cartTotal, isAuthenticated, user, clearCart } = useShopAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'razorpay'>('stripe');
  const [contactInfo, setContactInfo] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/shop/login', { state: { from: { pathname: '/shop/checkout' } } });
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (user) {
      setContactInfo({
        name: user.name,
        email: user.email,
      });
    }
  }, [user]);

  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setContactInfo({ ...contactInfo, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');

    try {
      const res = await shopApi.checkout({
        contactInfo: {
          name: contactInfo.name,
          email: contactInfo.email,
        },
        paymentMethod,
      });

      if (res.success && res.data) {
        if (paymentMethod === 'stripe') {
          const sessionRes = await shopApi.createStripeSession(res.data.id);
          if (sessionRes.success && sessionRes.data?.url) {
            window.location.href = sessionRes.data.url;
          } else {
            setError('Failed to create payment session');
          }
        } else {
          await clearCart();
          navigate(`/shop/order-success?order=${res.data.orderNumber}`);
        }
      } else {
        setError(res.error || 'Checkout failed');
      }
    } catch {
      setError('Checkout failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const subtotal = cartTotal;
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  if (cart.length === 0) {
    return (
      <div className={`min-h-screen ${theme === 'dark' ? 'bg-slate-950' : 'bg-gray-50'}`}>
        <SEOHead title="Checkout" description="Complete your purchase" />
        <ShopNav />
        <div className="container mx-auto px-4 lg:px-6 py-20">
          <div
            className={`max-w-md mx-auto text-center py-16 rounded-2xl ${
              theme === 'dark'
                ? 'bg-gradient-to-br from-electric-blue/15 to-electric-green/15 border border-electric-blue/30'
                : 'bg-gradient-to-br from-accent-red/10 to-accent-blue/10 border border-accent-red/30'
            }`}
          >
            <ShoppingBag
              className={`w-20 h-20 mx-auto mb-4 ${
                theme === 'dark' ? 'text-electric-green' : 'text-accent-red'
              }`}
            />
            <h1
              className={`text-2xl font-bold mb-2 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}
            >
              Your Cart is Empty
            </h1>
            <p
              className={`mb-6 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
              }`}
            >
              Add some items to checkout
            </p>
            <Link
              to="/shop/products"
              className={`relative group overflow-hidden inline-flex items-center gap-2 px-8 py-3 rounded-xl font-semibold shadow-lg transition-all duration-300 ${
                theme === 'dark'
                  ? 'bg-gradient-to-r from-electric-blue to-electric-green text-black'
                  : 'bg-gradient-to-r from-accent-red to-accent-blue text-white'
              }`}
            >
              <span className="relative z-10 flex items-center gap-2">
                <ShoppingBag className="w-5 h-5" />
                Browse Products
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
        </div>
        <Footer variant="shop" />
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-slate-950' : 'bg-gray-50'}`}>
      <SEOHead title="Checkout" description="Complete your purchase" />
      <ShopNav />

      <div className="container mx-auto px-4 lg:px-6 py-4">
        <nav className="flex items-center gap-2 text-sm">
          <Link to="/shop" className={theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'}>
            Shop
          </Link>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <Link to="/shop/cart" className={theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'}>
            Cart
          </Link>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <span className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>Checkout</span>
        </nav>
      </div>

      <section className="py-8">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-6 rounded-2xl ${
                  theme === 'dark' ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-gray-200'
                }`}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    theme === 'dark' ? 'bg-electric-green text-slate-900' : 'bg-accent-blue text-white'
                  }`}>
                    <Zap className="w-5 h-5" />
                  </div>
                  <h2 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    Account Information
                  </h2>
                </div>

                <div className={`p-4 rounded-xl mb-6 ${
                  theme === 'dark' ? 'bg-electric-green/10 border border-electric-green/30' : 'bg-green-50 border border-green-200'
                }`}>
                  <div className="flex items-center gap-3">
                    <Download className={`w-5 h-5 ${theme === 'dark' ? 'text-electric-green' : 'text-green-600'}`} />
                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                      <strong>Instant Access:</strong> Your digital products will be available for download immediately after payment.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={contactInfo.name}
                      onChange={handleContactChange}
                      required
                      className={`w-full px-4 py-3 rounded-xl border transition-all focus:outline-none focus:ring-2 ${
                        theme === 'dark'
                          ? 'bg-slate-700 border-slate-600 text-white focus:border-electric-blue focus:ring-electric-blue/20'
                          : 'bg-white border-gray-300 text-gray-900 focus:border-accent-blue focus:ring-accent-blue/20'
                      }`}
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                      Email (for download link) *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={contactInfo.email}
                      onChange={handleContactChange}
                      required
                      className={`w-full px-4 py-3 rounded-xl border transition-all focus:outline-none focus:ring-2 ${
                        theme === 'dark'
                          ? 'bg-slate-700 border-slate-600 text-white focus:border-electric-blue focus:ring-electric-blue/20'
                          : 'bg-white border-gray-300 text-gray-900 focus:border-accent-blue focus:ring-accent-blue/20'
                      }`}
                    />
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className={`p-6 rounded-2xl ${
                  theme === 'dark' ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-gray-200'
                }`}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    theme === 'dark' ? 'bg-electric-green text-slate-900' : 'bg-accent-blue text-white'
                  }`}>
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <h2 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    Payment Method
                  </h2>
                </div>

                <div className="space-y-3">
                  <label className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${
                    paymentMethod === 'stripe'
                      ? theme === 'dark'
                        ? 'border-electric-green bg-electric-green/10'
                        : 'border-accent-blue bg-accent-blue/10'
                      : theme === 'dark' ? 'border-slate-600 hover:border-slate-500' : 'border-gray-200 hover:border-gray-300'
                  }`}>
                    <input
                      type="radio"
                      name="payment"
                      value="stripe"
                      checked={paymentMethod === 'stripe'}
                      onChange={() => setPaymentMethod('stripe')}
                      className="sr-only"
                    />
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      paymentMethod === 'stripe'
                        ? theme === 'dark' ? 'border-electric-green' : 'border-accent-blue'
                        : theme === 'dark' ? 'border-slate-500' : 'border-gray-300'
                    }`}>
                      {paymentMethod === 'stripe' && (
                        <div className={`w-2.5 h-2.5 rounded-full ${
                          theme === 'dark' ? 'bg-electric-green' : 'bg-accent-blue'
                        }`} />
                      )}
                    </div>
                    <div className="flex-1">
                      <span className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        Credit/Debit Card
                      </span>
                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                        Secure payment via Stripe
                      </p>
                    </div>
                  </label>

                  <label className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${
                    paymentMethod === 'razorpay'
                      ? theme === 'dark'
                        ? 'border-electric-green bg-electric-green/10'
                        : 'border-accent-blue bg-accent-blue/10'
                      : theme === 'dark' ? 'border-slate-600 hover:border-slate-500' : 'border-gray-200 hover:border-gray-300'
                  }`}>
                    <input
                      type="radio"
                      name="payment"
                      value="razorpay"
                      checked={paymentMethod === 'razorpay'}
                      onChange={() => setPaymentMethod('razorpay')}
                      className="sr-only"
                    />
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      paymentMethod === 'razorpay'
                        ? theme === 'dark' ? 'border-electric-green' : 'border-accent-blue'
                        : theme === 'dark' ? 'border-slate-500' : 'border-gray-300'
                    }`}>
                      {paymentMethod === 'razorpay' && (
                        <div className={`w-2.5 h-2.5 rounded-full ${
                          theme === 'dark' ? 'bg-electric-green' : 'bg-accent-blue'
                        }`} />
                      )}
                    </div>
                    <div className="flex-1">
                      <span className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        Razorpay
                      </span>
                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                        UPI, Cards, Wallets, Net Banking
                      </p>
                    </div>
                  </label>
                </div>
              </motion.div>
            </div>

            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className={`sticky top-24 p-6 rounded-2xl ${
                  theme === 'dark' ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-gray-200'
                }`}
              >
                <h3 className={`text-lg font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  Order Summary
                </h3>

                <div className="space-y-3 mb-6">
                  {cart.map((item) => (
                    <div key={item.id} className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        theme === 'dark' ? 'bg-slate-700' : 'bg-gray-100'
                      }`}>
                        {item.product?.thumbnail ? (
                          <img src={item.product.thumbnail} alt="" className="w-full h-full object-cover rounded-lg" />
                        ) : (
                          <span className="text-lg">📦</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium truncate ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                          {item.product?.name}
                        </p>
                        <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <span className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        ${(parseFloat(item.product?.price || '0') * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className={`space-y-2 py-4 border-y ${theme === 'dark' ? 'border-slate-700' : 'border-gray-200'}`}>
                  <div className="flex justify-between">
                    <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Subtotal</span>
                    <span className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Delivery</span>
                    <span className="text-green-500">Instant Access</span>
                  </div>
                  <div className="flex justify-between">
                    <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Tax</span>
                    <span className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>${tax.toFixed(2)}</span>
                  </div>
                </div>

                <div className="flex justify-between py-4">
                  <span className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Total</span>
                  <span className={`text-lg font-bold ${theme === 'dark' ? 'text-electric-green' : 'text-accent-blue'}`}>
                    ${total.toFixed(2)}
                  </span>
                </div>

                {error && (
                  <div className="flex items-center gap-2 p-3 mb-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <p className="text-sm">{error}</p>
                  </div>
                )}

                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className={`relative group overflow-hidden w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-semibold text-lg transition-all duration-300 disabled:opacity-50 ${
                    theme === 'dark'
                      ? 'bg-gradient-to-r from-electric-blue to-electric-green text-slate-900 hover:shadow-lg'
                      : 'bg-gradient-to-r from-accent-red to-accent-blue text-white hover:shadow-lg'
                  }`}
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {loading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <Lock className="w-5 h-5" />
                        Place Order
                      </>
                    )}
                  </span>
                  <div
                    className={`absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 ${
                      theme === 'dark'
                        ? 'bg-gradient-to-r from-electric-green to-electric-blue'
                        : 'bg-gradient-to-r from-accent-blue to-accent-red'
                    }`}
                  />
                </button>

                <p className={`text-xs text-center mt-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  Your payment is secured with SSL encryption
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      <Footer variant="shop" />
    </div>
  );
}
