import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Package, ChevronRight, CheckCircle, Clock, XCircle, Mail, CreditCard, ArrowLeft, Download, Zap } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useShopAuth } from '../../contexts/ShopAuthContext';
import ShopNav from '../../components/shop/ShopNav';
import Footer from '../../components/Footer';
import SEOHead from '../../components/shop/SEOHead';
import shopApi from '../../utils/shopApi';
import type { Order } from '../../types/shop';

export default function ShopOrderDetail() {
  const { theme } = useTheme();
  const { orderNumber } = useParams<{ orderNumber: string }>();
  const { isAuthenticated } = useShopAuth();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/shop/login', { state: { from: { pathname: `/shop/orders/${orderNumber}` } } });
    }
  }, [isAuthenticated, navigate, orderNumber]);

  useEffect(() => {
    if (isAuthenticated && orderNumber) {
      fetchOrder();
    }
  }, [isAuthenticated, orderNumber]);

  const fetchOrder = async () => {
    setLoading(true);
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-500/20 text-green-500 border-green-500/30';
      case 'shipped': return 'bg-electric-green/20 text-electric-green border-electric-green/30';
      case 'processing': return 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30';
      case 'pending': return 'bg-gray-500/20 text-gray-500 border-gray-500/30';
      case 'cancelled': return 'bg-red-500/20 text-red-500 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-500 border-gray-500/30';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'delivered': return 'Completed';
      case 'shipped': return 'Available';
      case 'processing': return 'Processing';
      case 'pending': return 'Pending';
      case 'cancelled': return 'Cancelled';
      default: return status;
    }
  };

  const trackingSteps = [
    { status: 'pending', label: 'Order Placed', icon: Package },
    { status: 'processing', label: 'Processing', icon: Clock },
    { status: 'shipped', label: 'Available for Download', icon: Download },
    { status: 'delivered', label: 'Completed', icon: CheckCircle },
  ];

  const getCurrentStep = (status: string) => {
    if (status === 'cancelled') return -1;
    const index = trackingSteps.findIndex(step => step.status === status);
    return index >= 0 ? index : 0;
  };

  if (loading) {
    return (
      <div className={`min-h-screen ${theme === 'dark' ? 'bg-slate-950' : 'bg-gray-50'}`}>
        <ShopNav />
        <div className="container mx-auto px-4 lg:px-6 py-8">
          <div className="space-y-6">
            <div className={`h-8 w-48 rounded animate-pulse ${theme === 'dark' ? 'bg-slate-800' : 'bg-gray-200'}`} />
            <div className={`h-64 rounded-2xl animate-pulse ${theme === 'dark' ? 'bg-slate-800' : 'bg-gray-200'}`} />
          </div>
        </div>
        <Footer variant="shop" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className={`min-h-screen ${theme === 'dark' ? 'bg-slate-950' : 'bg-gray-50'}`}>
        <ShopNav />
        <div className="container mx-auto px-4 lg:px-6 py-16 text-center">
          <XCircle className={`w-16 h-16 mx-auto mb-4 ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`} />
          <h1 className={`text-2xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Order Not Found
          </h1>
          <p className={`mb-6 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
            The order you're looking for doesn't exist or you don't have permission to view it.
          </p>
          <Link
            to="/shop/orders"
            className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
              theme === 'dark'
                ? 'bg-electric-green text-slate-900 hover:bg-electric-green/90'
                : 'bg-accent-blue text-white hover:bg-accent-blue/90'
            }`}
          >
            View All Purchases
          </Link>
        </div>
        <Footer variant="shop" />
      </div>
    );
  }

  const currentStep = getCurrentStep(order.status);

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-slate-950' : 'bg-gray-50'}`}>
      <SEOHead title={`Order #${order.orderNumber}`} description="View order details" />
      <ShopNav />

      <div className="container mx-auto px-4 lg:px-6 py-4">
        <nav className="flex items-center gap-2 text-sm">
          <Link to="/shop" className={theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'}>
            Shop
          </Link>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <Link to="/shop/orders" className={theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'}>
            Purchases
          </Link>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <span className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>#{order.orderNumber}</span>
        </nav>
      </div>

      <section className="py-8">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="mb-8">
            <Link
              to="/shop/orders"
              className={`inline-flex items-center gap-2 text-sm font-medium mb-4 ${
                theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Purchases
            </Link>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className={`text-3xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  Order #{order.orderNumber}
                </h1>
                <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                  Placed on {new Date(order.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
              <span className={`px-4 py-2 rounded-full text-sm font-medium border ${getStatusColor(order.status)}`}>
                {getStatusLabel(order.status)}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {order.status !== 'cancelled' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-6 rounded-2xl ${
                    theme === 'dark' ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-gray-200'
                  }`}
                >
                  <h2 className={`text-lg font-bold mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    Access Status
                  </h2>
                  <div className="relative">
                    <div className={`absolute left-6 top-6 bottom-6 w-0.5 ${
                      theme === 'dark' ? 'bg-slate-700' : 'bg-gray-200'
                    }`} />
                    <div className="space-y-8">
                      {trackingSteps.map((step, index) => {
                        const isCompleted = index <= currentStep;
                        const isCurrent = index === currentStep;
                        return (
                          <div key={step.status} className="flex items-center gap-4 relative">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center z-10 ${
                              isCompleted
                                ? theme === 'dark' ? 'bg-electric-green text-slate-900' : 'bg-accent-blue text-white'
                                : theme === 'dark' ? 'bg-slate-700 text-gray-500' : 'bg-gray-200 text-gray-400'
                            }`}>
                              <step.icon className="w-5 h-5" />
                            </div>
                            <div>
                              <p className={`font-medium ${
                                isCompleted
                                  ? theme === 'dark' ? 'text-white' : 'text-gray-900'
                                  : theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                              }`}>
                                {step.label}
                              </p>
                              {isCurrent && (
                                <p className={`text-sm ${theme === 'dark' ? 'text-electric-green' : 'text-accent-blue'}`}>
                                  Current Status
                                </p>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              )}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className={`p-6 rounded-2xl ${
                  theme === 'dark' ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-gray-200'
                }`}
              >
                <h2 className={`text-lg font-bold mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  Purchased Products
                </h2>
                <div className="space-y-4">
                  {order.items?.map((item) => (
                    <div key={item.id} className="flex items-center gap-4">
                      <div className={`w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        theme === 'dark' ? 'bg-slate-700' : 'bg-gray-100'
                      }`}>
                        {item.productImage ? (
                          <img src={item.productImage} alt="" className="w-full h-full object-cover rounded-xl" />
                        ) : (
                          <Package className="w-6 h-6 text-gray-400" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                          {item.productName}
                        </p>
                        <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                          {item.quantity > 1 ? `${item.quantity} licenses` : '1 license'} x ${parseFloat(item.price).toFixed(2)}
                        </p>
                      </div>
                      <span className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        ${parseFloat(item.total).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className={`p-6 rounded-2xl ${
                    theme === 'dark' ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <Mail className={theme === 'dark' ? 'text-electric-green' : 'text-accent-blue'} />
                    <h3 className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      Download Access
                    </h3>
                  </div>
                  <div className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                    <p className="font-medium mb-2">{order.shippingAddress?.name || order.billingAddress?.name}</p>
                    <p className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      {order.shippingAddress?.email || order.billingAddress?.email}
                    </p>
                    <div className={`mt-3 p-3 rounded-lg ${theme === 'dark' ? 'bg-electric-green/10' : 'bg-green-50'}`}>
                      <p className={`text-xs flex items-center gap-1 ${theme === 'dark' ? 'text-electric-green' : 'text-green-600'}`}>
                        <Zap className="w-3 h-3" />
                        Download links sent to email
                      </p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className={`p-6 rounded-2xl ${
                    theme === 'dark' ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <CreditCard className={theme === 'dark' ? 'text-electric-green' : 'text-accent-blue'} />
                    <h3 className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      Payment Info
                    </h3>
                  </div>
                  <div className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                    <p>Method: <span className="font-medium capitalize">{order.paymentMethod}</span></p>
                    <p>Status: <span className={`font-medium capitalize ${
                      order.paymentStatus === 'completed' ? 'text-green-500' :
                      order.paymentStatus === 'pending' ? 'text-yellow-500' : 'text-red-500'
                    }`}>{order.paymentStatus}</span></p>
                  </div>
                </motion.div>
              </div>
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

                <div className={`space-y-3 pb-4 border-b ${theme === 'dark' ? 'border-slate-700' : 'border-gray-200'}`}>
                  <div className="flex justify-between">
                    <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Subtotal</span>
                    <span className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>
                      ${parseFloat(order.subtotal).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Delivery</span>
                    <span className={`text-green-500 flex items-center gap-1`}>
                      <Zap className="w-3 h-3" />
                      Instant
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Tax</span>
                    <span className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>
                      ${parseFloat(order.tax).toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between py-4">
                  <span className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Total</span>
                  <span className={`text-lg font-bold ${theme === 'dark' ? 'text-electric-green' : 'text-accent-blue'}`}>
                    ${parseFloat(order.total).toFixed(2)}
                  </span>
                </div>

                <div className="space-y-3 mt-4">
                  <Link
                    to="/shop/products"
                    className={`relative group overflow-hidden w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                      theme === 'dark'
                        ? 'bg-gradient-to-r from-electric-blue to-electric-green text-slate-900 hover:shadow-lg'
                        : 'bg-gradient-to-r from-accent-red to-accent-blue text-white hover:shadow-lg'
                    }`}
                  >
                    <span className="relative z-10">
                      Continue Shopping
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
                    to="/shop/contact"
                    className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all border ${
                      theme === 'dark'
                        ? 'border-slate-600 text-white hover:bg-slate-700'
                        : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    Need Help?
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      <Footer variant="shop" />
    </div>
  );
}
