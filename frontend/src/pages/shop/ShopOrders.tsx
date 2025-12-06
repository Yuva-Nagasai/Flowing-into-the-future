import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Download, ChevronRight, ShoppingBag, Clock, Zap, CheckCircle, XCircle, Filter } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useShopAuth } from '../../contexts/ShopAuthContext';
import ShopNav from '../../components/shop/ShopNav';
import Footer from '../../components/Footer';
import SEOHead from '../../components/shop/SEOHead';
import shopApi from '../../utils/shopApi';
import type { Order } from '../../types/shop';

export default function ShopOrders() {
  const { theme } = useTheme();
  const { isAuthenticated } = useShopAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/shop/login', { state: { from: { pathname: '/shop/orders' } } });
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders();
    }
  }, [isAuthenticated]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await shopApi.getOrders();
      if (res.success && res.data) {
        setOrders(res.data);
      }
    } catch (error) {
      console.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered': return CheckCircle;
      case 'shipped': return Zap;
      case 'processing': return Clock;
      case 'cancelled': return XCircle;
      default: return Download;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-500/20 text-green-500';
      case 'shipped': return 'bg-electric-green/20 text-electric-green';
      case 'processing': return 'bg-yellow-500/20 text-yellow-500';
      case 'pending': return 'bg-gray-500/20 text-gray-500';
      case 'cancelled': return 'bg-red-500/20 text-red-500';
      default: return 'bg-gray-500/20 text-gray-500';
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

  const filteredOrders = orders.filter(order => {
    if (filter === 'all') return true;
    return order.status === filter;
  });

  const filterOptions = [
    { value: 'all', label: 'All Purchases' },
    { value: 'pending', label: 'Pending' },
    { value: 'processing', label: 'Processing' },
    { value: 'shipped', label: 'Available' },
    { value: 'delivered', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' },
  ];

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-slate-950' : 'bg-gray-50'}`}>
      <SEOHead title="My Orders" description="View and track your orders" />
      <ShopNav />

      <div className="container mx-auto px-4 lg:px-6 py-4">
        <nav className="flex items-center gap-2 text-sm">
          <Link to="/shop" className={theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'}>
            Shop
          </Link>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <Link to="/shop/account" className={theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'}>
            Account
          </Link>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <span className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>Orders</span>
        </nav>
      </div>

      <section className="py-8">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className={`text-3xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                My Purchases
              </h1>
              <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                Access and manage your digital products
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Filter className={`w-5 h-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className={`px-4 py-2 rounded-xl border transition-all focus:outline-none ${
                  theme === 'dark'
                    ? 'bg-slate-800 border-slate-700 text-white'
                    : 'bg-white border-gray-200 text-gray-900'
                }`}
              >
                {filterOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className={`h-32 rounded-2xl animate-pulse ${
                  theme === 'dark' ? 'bg-slate-800' : 'bg-gray-100'
                }`} />
              ))}
            </div>
          ) : filteredOrders.length > 0 ? (
            <div className="space-y-4">
              {filteredOrders.map((order, index) => {
                const StatusIcon = getStatusIcon(order.status);
                return (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`p-6 rounded-2xl ${
                      theme === 'dark' ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-gray-200'
                    }`}
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-xl ${
                          theme === 'dark' ? 'bg-slate-700' : 'bg-gray-100'
                        }`}>
                          <StatusIcon className={`w-6 h-6 ${
                            order.status === 'delivered' ? 'text-green-500' :
                            order.status === 'shipped' ? 'text-electric-green' :
                            order.status === 'processing' ? 'text-yellow-500' :
                            order.status === 'cancelled' ? 'text-red-500' :
                            theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                          }`} />
                        </div>
                        <div>
                          <p className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                            Order #{order.orderNumber}
                          </p>
                          <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                            Placed on {new Date(order.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                          {getStatusLabel(order.status)}
                        </span>
                        <span className={`text-lg font-bold ${
                          theme === 'dark' ? 'text-electric-green' : 'text-accent-blue'
                        }`}>
                          ${parseFloat(order.total).toFixed(2)}
                        </span>
                      </div>
                    </div>

                    {order.items && order.items.length > 0 && (
                      <div className={`flex items-center gap-4 py-4 border-t ${
                        theme === 'dark' ? 'border-slate-700' : 'border-gray-200'
                      }`}>
                        <div className="flex -space-x-2">
                          {order.items.slice(0, 3).map((item, i) => (
                            <div
                              key={i}
                              className={`w-12 h-12 rounded-lg flex items-center justify-center border-2 ${
                                theme === 'dark' ? 'bg-slate-700 border-slate-800' : 'bg-gray-100 border-white'
                              }`}
                            >
                              {item.productImage ? (
                                <img src={item.productImage} alt="" className="w-full h-full object-cover rounded-lg" />
                              ) : (
                                <Download className="w-5 h-5 text-gray-400" />
                              )}
                            </div>
                          ))}
                          {order.items.length > 3 && (
                            <div className={`w-12 h-12 rounded-lg flex items-center justify-center border-2 ${
                              theme === 'dark' ? 'bg-slate-700 border-slate-800' : 'bg-gray-100 border-white'
                            }`}>
                              <span className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                                +{order.items.length - 3}
                              </span>
                            </div>
                          )}
                        </div>
                        <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                          {order.items.length} {order.items.length === 1 ? 'product' : 'products'}
                        </p>
                        <Link
                          to={`/shop/orders/${order.orderNumber}`}
                          className={`ml-auto inline-flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition-all ${
                            theme === 'dark'
                              ? 'bg-slate-700 text-white hover:bg-slate-600'
                              : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                          }`}
                        >
                          Access Products
                          <ChevronRight className="w-4 h-4" />
                        </Link>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`text-center py-16 rounded-2xl ${
                theme === 'dark' ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-gray-200'
              }`}
            >
              <ShoppingBag className={`w-20 h-20 mx-auto mb-4 ${
                theme === 'dark' ? 'text-gray-600' : 'text-gray-400'
              }`} />
              <h2 className={`text-2xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                No Purchases Found
              </h2>
              <p className={`mb-6 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                {filter === 'all' 
                  ? "You haven't made any purchases yet" 
                  : `No ${filter === 'shipped' ? 'available' : filter === 'delivered' ? 'completed' : filter} purchases found`
                }
              </p>
              <Link
                to="/shop/products"
                className={`relative group overflow-hidden inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  theme === 'dark'
                    ? 'bg-gradient-to-r from-electric-blue to-electric-green text-slate-900 hover:shadow-lg'
                    : 'bg-gradient-to-r from-accent-red to-accent-blue text-white hover:shadow-lg'
                }`}
              >
                <span className="relative z-10">
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
            </motion.div>
          )}
        </div>
      </section>

      <Footer variant="shop" />
    </div>
  );
}
