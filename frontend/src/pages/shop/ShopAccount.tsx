import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Package, Heart, Settings, LogOut, ShoppingBag, ChevronRight, Star, MapPin, Bell, Shield, Edit } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useShopAuth } from '../../contexts/ShopAuthContext';
import ShopNav from '../../components/shop/ShopNav';
import Footer from '../../components/Footer';
import SEOHead from '../../components/shop/SEOHead';
import shopApi from '../../utils/shopApi';
import type { Order } from '../../types/shop';

export default function ShopAccount() {
  const { theme } = useTheme();
  const { user, isAuthenticated, logout, wishlist } = useShopAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'wishlist' | 'settings'>('overview');
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/shop/login', { state: { from: { pathname: '/shop/account' } } });
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders();
    }
  }, [isAuthenticated]);

  const fetchOrders = async () => {
    setOrdersLoading(true);
    try {
      const res = await shopApi.getOrders();
      if (res.success && res.data) {
        setOrders(res.data);
      }
    } catch (error) {
      console.error('Failed to fetch orders');
    } finally {
      setOrdersLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/shop');
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'orders', label: 'Orders', icon: Package },
    { id: 'wishlist', label: 'Wishlist', icon: Heart },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-500/20 text-green-500';
      case 'shipped': return 'bg-blue-500/20 text-blue-500';
      case 'processing': return 'bg-yellow-500/20 text-yellow-500';
      case 'pending': return 'bg-gray-500/20 text-gray-500';
      case 'cancelled': return 'bg-red-500/20 text-red-500';
      default: return 'bg-gray-500/20 text-gray-500';
    }
  };

  if (!user) return null;

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-slate-950' : 'bg-gray-50'}`}>
      <SEOHead title="My Account" description="Manage your account, orders, and preferences" />
      <ShopNav />

      <section className="py-8">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <aside className={`lg:col-span-1 ${theme === 'dark' ? '' : ''}`}>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className={`p-6 rounded-2xl ${
                  theme === 'dark' ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-gray-200'
                }`}
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold ${
                    theme === 'dark'
                      ? 'bg-gradient-to-br from-electric-blue to-electric-green text-slate-900'
                      : 'bg-gradient-to-br from-accent-red to-accent-blue text-white'
                  }`}>
                    {user.avatar ? (
                      <img src={user.avatar} alt="" className="w-full h-full object-cover rounded-full" />
                    ) : (
                      user.name.charAt(0)
                    )}
                  </div>
                  <div>
                    <h2 className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      {user.name}
                    </h2>
                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                      {user.email}
                    </p>
                  </div>
                </div>

                <nav className="space-y-1">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-colors ${
                        activeTab === tab.id
                          ? theme === 'dark'
                            ? 'bg-electric-green/10 text-electric-green'
                            : 'bg-accent-blue/10 text-accent-blue'
                          : theme === 'dark'
                            ? 'text-gray-300 hover:bg-slate-700'
                            : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <tab.icon className="w-5 h-5" />
                      {tab.label}
                      {tab.id === 'wishlist' && wishlist.length > 0 && (
                        <span className={`ml-auto text-xs px-2 py-0.5 rounded-full ${
                          theme === 'dark' ? 'bg-slate-600' : 'bg-gray-200'
                        }`}>
                          {wishlist.length}
                        </span>
                      )}
                    </button>
                  ))}
                  <button
                    onClick={handleLogout}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-colors text-red-500 hover:bg-red-500/10`}
                  >
                    <LogOut className="w-5 h-5" />
                    Sign Out
                  </button>
                </nav>
              </motion.div>
            </aside>

            <main className="lg:col-span-3">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {[
                        { label: 'Total Orders', value: orders.length, icon: Package },
                        { label: 'Wishlist Items', value: wishlist.length, icon: Heart },
                        { label: 'Member Since', value: new Date(user.createdAt).getFullYear(), icon: Star },
                      ].map((stat) => (
                        <div
                          key={stat.label}
                          className={`p-6 rounded-2xl ${
                            theme === 'dark' ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-gray-200'
                          }`}
                        >
                          <stat.icon className={`w-8 h-8 mb-3 ${
                            theme === 'dark' ? 'text-electric-green' : 'text-accent-blue'
                          }`} />
                          <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                            {stat.value}
                          </p>
                          <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>
                            {stat.label}
                          </p>
                        </div>
                      ))}
                    </div>

                    <div className={`p-6 rounded-2xl ${
                      theme === 'dark' ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-gray-200'
                    }`}>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                          Recent Orders
                        </h3>
                        <button
                          onClick={() => setActiveTab('orders')}
                          className={`text-sm font-medium ${
                            theme === 'dark' ? 'text-electric-green' : 'text-accent-blue'
                          }`}
                        >
                          View All
                        </button>
                      </div>

                      {orders.slice(0, 3).map((order) => (
                        <Link
                          key={order.id}
                          to={`/shop/account/orders/${order.orderNumber}`}
                          className={`flex items-center justify-between p-4 rounded-xl mb-2 last:mb-0 transition-colors ${
                            theme === 'dark' ? 'hover:bg-slate-700' : 'hover:bg-gray-50'
                          }`}
                        >
                          <div>
                            <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                              Order #{order.orderNumber}
                            </p>
                            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                              {new Date(order.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(order.status)}`}>
                              {order.status}
                            </span>
                            <ChevronRight className="w-4 h-4 text-gray-400" />
                          </div>
                        </Link>
                      ))}

                      {orders.length === 0 && (
                        <div className="text-center py-8">
                          <ShoppingBag className={`w-12 h-12 mx-auto mb-3 ${
                            theme === 'dark' ? 'text-gray-600' : 'text-gray-400'
                          }`} />
                          <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>
                            No orders yet
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {activeTab === 'orders' && (
                  <div className={`p-6 rounded-2xl ${
                    theme === 'dark' ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-gray-200'
                  }`}>
                    <h3 className={`text-lg font-bold mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      Order History
                    </h3>

                    {ordersLoading ? (
                      <div className="space-y-4">
                        {[...Array(3)].map((_, i) => (
                          <div key={i} className={`h-20 rounded-xl animate-pulse ${
                            theme === 'dark' ? 'bg-slate-700' : 'bg-gray-100'
                          }`} />
                        ))}
                      </div>
                    ) : orders.length > 0 ? (
                      <div className="space-y-4">
                        {orders.map((order) => (
                          <div
                            key={order.id}
                            className={`p-4 rounded-xl border ${
                              theme === 'dark' ? 'border-slate-600' : 'border-gray-200'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-3">
                              <div>
                                <p className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                  Order #{order.orderNumber}
                                </p>
                                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                  {new Date(order.createdAt).toLocaleDateString()}
                                </p>
                              </div>
                              <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(order.status)}`}>
                                {order.status}
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className={`font-medium ${theme === 'dark' ? 'text-electric-green' : 'text-accent-blue'}`}>
                                ${parseFloat(order.total).toFixed(2)}
                              </span>
                              <Link
                                to={`/shop/account/orders/${order.orderNumber}`}
                                className={`text-sm font-medium ${
                                  theme === 'dark' ? 'text-electric-green' : 'text-accent-blue'
                                }`}
                              >
                                View Details
                              </Link>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <Package className={`w-16 h-16 mx-auto mb-4 ${
                          theme === 'dark' ? 'text-gray-600' : 'text-gray-400'
                        }`} />
                        <p className={`mb-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                          You haven't placed any orders yet
                        </p>
                        <Link
                          to="/shop/products"
                          className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
                            theme === 'dark'
                              ? 'bg-electric-green text-slate-900 hover:bg-electric-green/90'
                              : 'bg-accent-blue text-white hover:bg-accent-blue/90'
                          }`}
                        >
                          Start Shopping
                        </Link>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'wishlist' && (
                  <div className={`p-6 rounded-2xl ${
                    theme === 'dark' ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-gray-200'
                  }`}>
                    <h3 className={`text-lg font-bold mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      My Wishlist
                    </h3>

                    {wishlist.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {wishlist.map((item) => (
                          <Link
                            key={item.id}
                            to={`/shop/products/${item.product?.slug}`}
                            className={`flex items-center gap-4 p-4 rounded-xl border transition-colors ${
                              theme === 'dark' ? 'border-slate-600 hover:bg-slate-700' : 'border-gray-200 hover:bg-gray-50'
                            }`}
                          >
                            <div className={`w-16 h-16 rounded-lg flex items-center justify-center ${
                              theme === 'dark' ? 'bg-slate-700' : 'bg-gray-100'
                            }`}>
                              {item.product?.thumbnail ? (
                                <img src={item.product.thumbnail} alt="" className="w-full h-full object-cover rounded-lg" />
                              ) : (
                                <ShoppingBag className="w-6 h-6 text-gray-400" />
                              )}
                            </div>
                            <div className="flex-1">
                              <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                {item.product?.name}
                              </p>
                              <p className={`font-semibold ${
                                theme === 'dark' ? 'text-electric-green' : 'text-accent-blue'
                              }`}>
                                ${parseFloat(item.product?.price || '0').toFixed(2)}
                              </p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <Heart className={`w-16 h-16 mx-auto mb-4 ${
                          theme === 'dark' ? 'text-gray-600' : 'text-gray-400'
                        }`} />
                        <p className={`mb-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                          Your wishlist is empty
                        </p>
                        <Link
                          to="/shop/products"
                          className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
                            theme === 'dark'
                              ? 'bg-electric-green text-slate-900 hover:bg-electric-green/90'
                              : 'bg-accent-blue text-white hover:bg-accent-blue/90'
                          }`}
                        >
                          Explore Products
                        </Link>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'settings' && (
                  <div className="space-y-6">
                    <div className={`p-6 rounded-2xl ${
                      theme === 'dark' ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-gray-200'
                    }`}>
                      <div className="flex items-center justify-between mb-6">
                        <h3 className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                          Profile Information
                        </h3>
                        <button className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium ${
                          theme === 'dark'
                            ? 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}>
                          <Edit className="w-4 h-4" />
                          Edit
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                            Full Name
                          </label>
                          <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                            {user.name}
                          </p>
                        </div>
                        <div>
                          <label className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                            Email
                          </label>
                          <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                            {user.email}
                          </p>
                        </div>
                        <div>
                          <label className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                            Phone
                          </label>
                          <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                            {user.phone || 'Not set'}
                          </p>
                        </div>
                        <div>
                          <label className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                            Member Since
                          </label>
                          <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                            {new Date(user.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className={`p-6 rounded-2xl ${
                      theme === 'dark' ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-gray-200'
                    }`}>
                      <h3 className={`text-lg font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        Preferences
                      </h3>
                      <div className="space-y-4">
                        {[
                          { icon: Bell, label: 'Email Notifications', description: 'Receive order updates and promotions' },
                          { icon: Shield, label: 'Two-Factor Auth', description: 'Add extra security to your account' },
                        ].map((pref) => (
                          <div key={pref.label} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <pref.icon className={`w-5 h-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
                              <div>
                                <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                  {pref.label}
                                </p>
                                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                  {pref.description}
                                </p>
                              </div>
                            </div>
                            <button className={`relative w-12 h-6 rounded-full transition-colors ${
                              theme === 'dark' ? 'bg-slate-600' : 'bg-gray-200'
                            }`}>
                              <span className={`absolute left-1 top-1 w-4 h-4 rounded-full bg-white transition-transform`} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className={`p-6 rounded-2xl border-2 border-dashed ${
                      theme === 'dark' ? 'border-red-500/30' : 'border-red-200'
                    }`}>
                      <h3 className="text-lg font-bold text-red-500 mb-2">Danger Zone</h3>
                      <p className={`text-sm mb-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                        Once you delete your account, there is no going back. Please be certain.
                      </p>
                      <button className="px-4 py-2 rounded-lg text-sm font-medium bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors">
                        Delete Account
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            </main>
          </div>
        </div>
      </section>

      <Footer variant="shop" />
    </div>
  );
}
