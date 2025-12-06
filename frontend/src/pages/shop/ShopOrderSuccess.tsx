import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Download, ArrowRight, Zap, Loader2 } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import ShopNav from '../../components/shop/ShopNav';
import Footer from '../../components/Footer';
import SEOHead from '../../components/shop/SEOHead';
import shopApi from '../../utils/shopApi';
import type { Order } from '../../types/shop';

export default function ShopOrderSuccess() {
  const { theme } = useTheme();
  const [searchParams] = useSearchParams();
  const orderNumber = searchParams.get('order');
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orderNumber) {
      fetchOrder();
    } else {
      setLoading(false);
    }
  }, [orderNumber]);

  const fetchOrder = async () => {
    try {
      const res = await shopApi.getOrder(orderNumber!);
      if (res.success && res.data) {
        setOrder(res.data);
      }
    } catch (error) {
      console.error('Failed to fetch order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-slate-950' : 'bg-gray-50'}`}>
      <SEOHead title="Order Confirmed" description="Your order has been placed successfully" />
      <ShopNav />

      <section className="py-16">
        <div className="container mx-auto px-4 lg:px-6">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className={`w-8 h-8 animate-spin ${theme === 'dark' ? 'text-electric-green' : 'text-accent-blue'}`} />
            </div>
          ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', duration: 0.5 }}
              className={`inline-flex items-center justify-center w-24 h-24 rounded-full mb-8 ${
                theme === 'dark' ? 'bg-electric-green/20' : 'bg-green-100'
              }`}
            >
              <CheckCircle className={`w-14 h-14 ${
                theme === 'dark' ? 'text-electric-green' : 'text-green-600'
              }`} />
            </motion.div>

            <h1 className={`text-3xl md:text-4xl font-bold mb-4 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Thank You for Your Purchase!
            </h1>
            <p className={`text-lg mb-8 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              Your digital products are now available. Check your email for download links and access instructions.
            </p>

            {order && (
              <div className={`p-6 rounded-2xl mb-8 text-left ${
                theme === 'dark' ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-gray-200'
              }`}>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                      Order Number
                    </p>
                    <p className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      {order.orderNumber}
                    </p>
                  </div>
                  <div className={`px-4 py-2 rounded-full text-sm font-medium ${
                    order.paymentStatus === 'completed'
                      ? 'bg-green-500/20 text-green-500'
                      : order.paymentStatus === 'pending'
                        ? 'bg-yellow-500/20 text-yellow-500'
                        : 'bg-red-500/20 text-red-500'
                  }`}>
                    {order.paymentStatus === 'completed' ? 'Payment Confirmed' : order.paymentStatus}
                  </div>
                </div>

                <div className={`grid grid-cols-2 gap-4 py-4 border-y ${
                  theme === 'dark' ? 'border-slate-700' : 'border-gray-200'
                }`}>
                  <div>
                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                      Purchase Date
                    </p>
                    <p className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                      Access Status
                    </p>
                    <p className="text-green-500 font-medium flex items-center gap-1">
                      <Zap className="w-4 h-4" />
                      Available Now
                    </p>
                  </div>
                </div>

                {order.items && order.items.length > 0 && (
                  <div className="py-4 space-y-3">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          theme === 'dark' ? 'bg-slate-700' : 'bg-gray-100'
                        }`}>
                          {item.productImage ? (
                            <img src={item.productImage} alt="" className="w-full h-full object-cover rounded-lg" />
                          ) : (
                            <Download className="w-6 h-6 text-gray-400" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                            {item.productName}
                          </p>
                          <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                            License x {item.quantity} - ${parseFloat(item.price).toFixed(2)}
                          </p>
                        </div>
                        <span className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                          ${parseFloat(item.total).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                <div className={`pt-4 border-t ${theme === 'dark' ? 'border-slate-700' : 'border-gray-200'}`}>
                  <div className="flex justify-between mb-2">
                    <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Subtotal</span>
                    <span className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>
                      ${parseFloat(order.subtotal).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Delivery</span>
                    <span className="text-green-500">
                      Instant Access
                    </span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Tax</span>
                    <span className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>
                      ${parseFloat(order.tax).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-dashed">
                    <span className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Total</span>
                    <span className={`font-bold ${theme === 'dark' ? 'text-electric-green' : 'text-accent-blue'}`}>
                      ${parseFloat(order.total).toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className={`mt-4 p-4 rounded-lg ${theme === 'dark' ? 'bg-electric-green/10 border border-electric-green/30' : 'bg-green-50 border border-green-200'}`}>
                  <p className={`text-sm font-medium mb-1 flex items-center gap-2 ${theme === 'dark' ? 'text-electric-green' : 'text-green-700'}`}>
                    <Download className="w-4 h-4" />
                    How to Access Your Products:
                  </p>
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                    Your download links have been sent to {order.shippingAddress?.email || 'your email'}. 
                    You can also access all your purchases from your account dashboard.
                  </p>
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/shop/account"
                className={`relative group overflow-hidden inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  theme === 'dark'
                    ? 'bg-gradient-to-r from-electric-blue to-electric-green text-slate-900 hover:shadow-lg'
                    : 'bg-gradient-to-r from-accent-red to-accent-blue text-white hover:shadow-lg'
                }`}
              >
                <span className="relative z-10 flex items-center gap-2">
                  <Download className="w-5 h-5" />
                  Access Downloads
                </span>
                <div
                  className={`absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 ${
                    theme === 'dark'
                      ? 'bg-gradient-to-r from-electric-green to-electric-blue'
                      : 'bg-gradient-to-r from-accent-blue to-accent-red'
                  }`}
                />
              </Link>
              <Link
                to="/shop/products"
                className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all border ${
                  theme === 'dark'
                    ? 'border-slate-600 text-white hover:bg-slate-800'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                }`}
              >
                Browse More Products
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </motion.div>
          )}
        </div>
      </section>

      <Footer variant="shop" />
    </div>
  );
}
